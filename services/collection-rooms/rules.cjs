// Merged by the existing generator so counter deployments cannot erase room rules.
const signed="auth != null && auth.token.email_verified === true && auth.token.firebase.sign_in_provider === 'google.com'";
const own=`${signed} && auth.uid === $uid`;
const owner=`${signed} && root.child('collectionRooms/secrets').child($room).child('owner').val() === auth.uid`;
const member=`${signed} && root.child('collectionRooms/access').child($room).child(auth.uid).child('active').val() === true && !root.child('collectionRooms/bans').child($room).child(auth.uid).exists()`;
const books=['blue-mage','weapons','fishing','triple-triad','minions','beastmaster'];
function scalar(expression){return {'.validate':expression+' && newData.getPriority() === null'};}
function entries(){return {
  '.validate':"newData.getPriority() === null",
  '$id':{
    '.validate':"(($book === 'weapons' && $id.matches(/^[a-z0-9-]+~[A-Z]{3}~(weapon|shield)$/)) || ($book !== 'weapons' && $id.matches(/^[1-9][0-9]{0,9}$/))) && (newData.hasChild('value') || newData.hasChild('wanted')) && newData.getPriority() === null",
    value:scalar("newData.isNumber() && newData.val() >= 0 && newData.val() % 1 === 0 && newData.val() <= ($book === 'weapons' ? 2147483647 : 1)"),
    wanted:scalar('newData.isBoolean()'),
    '$other':{'.validate':false},
  },
};}
function build(){
  const bookCheck=books.map(b=>`$book === '${b}'`).join(' || ');
  const newRoomRoot="newData.parent().parent().parent().parent()";
  return {
    secrets:{'$room':{
      '.write':`${signed} && $room.matches(/^[a-f0-9]{32}$/) && newData.exists() && ((!data.exists() && newData.child('owner').val() === auth.uid) || data.child('owner').val() === auth.uid)`,
      '.validate':"newData.hasChildren(['owner','verifier']) && newData.getPriority() === null",
      owner:scalar("newData.isString() && newData.val() === auth.uid && (!data.exists() || newData.val() === data.val())"),
      verifier:scalar("newData.isString() && newData.val().matches(/^[a-f0-9]{64}$/)"),
      '$other':{'.validate':false},
    }},
    access:{'$room':{'$uid':{
      '.read':own,
      '.write':`(${own} && (!newData.exists() || (!root.child('collectionRooms/bans').child($room).child($uid).exists() && root.child('collectionRooms/rooms').child($room).child('meta/locked').val() !== true && newData.child('proof').val() === root.child('collectionRooms/secrets').child($room).child('verifier').val()))) || (${owner} && !newData.exists())`,
      '.validate':"newData.hasChildren(['active','proof']) && newData.getPriority() === null",
      active:scalar('newData.val() === true'),proof:scalar("newData.isString() && newData.val().matches(/^[a-f0-9]{64}$/)"),'$other':{'.validate':false},
    }}},
    bans:{'$room':{'.read':owner,'$uid':{'.write':`${owner} && $uid !== auth.uid`,'.validate':'newData.val() === true'}}},
    rooms:{'$room':{
      meta:{
        '.read':member,'.write':`${owner} && newData.exists()`,
        '.validate':"newData.hasChildren(['name','owner','locked','createdAt']) && newData.getPriority() === null",
        name:scalar('newData.isString() && newData.val().length > 0 && newData.val().length <= 60'),
        owner:scalar("newData.val() === auth.uid && newData.val() === root.child('collectionRooms/secrets').child($room).child('owner').val()"),
        locked:scalar('newData.isBoolean()'),createdAt:scalar('newData.isNumber() && ((!data.exists() && newData.val() === now) || newData.val() === data.val())'),'$other':{'.validate':false},
      },
      members:{'.read':member,'$uid':{
        '.write':`(${own} && ((!newData.exists() && root.child('collectionRooms/secrets').child($room).child('owner').val() !== auth.uid) || (${member} && newData.exists()))) || (${owner} && $uid !== auth.uid && !newData.exists())`,
        '.validate':"newData.hasChildren(['name']) && newData.getPriority() === null",
        name:scalar('newData.isString() && newData.val().length > 0 && newData.val().length <= 30'),
        sharing:{'$book':scalar(`(${bookCheck}) && newData.isBoolean()`),'.validate':'newData.getPriority() === null'},'$other':{'.validate':false},
      }},
    }},
    userRooms:{'$uid':{'.read':own,'$room':{
      '.write':own,'.validate':"newData.val() === true && root.child('collectionRooms/access').child($room).child($uid).child('active').val() === true && !root.child('collectionRooms/bans').child($room).child($uid).exists()",
    }}},
    users:{'$uid':{
      '.read':own,
      books:{'.write':own,'$book':{'.validate':`(${bookCheck}) && newData.getPriority() === null`,'$id':entries()['$id']}},
    }},
    shared:{'$room':{'$uid':{'$book':{
      '.read':`${member} && root.child('collectionRooms/access').child($room).child($uid).child('active').val() === true && !root.child('collectionRooms/bans').child($room).child($uid).exists() && root.child('collectionRooms/rooms').child($room).child('members').child($uid).child('sharing').child($book).val() === true`,
      '.write':`(${own} && (!newData.exists() || (${member} && ${newRoomRoot}.child('rooms').child($room).child('members').child($uid).child('sharing').child($book).val() === true))) || (${owner} && !newData.exists())`,
      '.validate':`(${bookCheck}) && newData.child('ready').val() === true && newData.getPriority() === null`,ready:scalar('newData.val() === true'),entries:entries(),'$other':{'.validate':false},
    }}}},
  };
}
module.exports={build};
