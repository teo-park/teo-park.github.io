const {test,before,after,beforeEach}=require('node:test');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {initializeTestEnvironment,assertSucceeds,assertFails}=require('@firebase/rules-unit-testing');
const {ref,set,get,update,remove,serverTimestamp,runTransaction}=require('firebase/database');
const room='a'.repeat(32),otherRoom='b'.repeat(32),proof='c'.repeat(64),wrong='d'.repeat(64);
let env;
before(async()=>{env=await initializeTestEnvironment({projectId:'demo-collection-rooms',database:{host:'127.0.0.1',port:9150,rules:fs.readFileSync(path.resolve(__dirname,'../database.rules.json'),'utf8')}});});
after(async()=>{await env?.cleanup();});beforeEach(async()=>{await env.clearDatabase();});
const db=(uid,extra={})=>uid?env.authenticatedContext(uid,{email_verified:true,firebase:{sign_in_provider:'google.com'},...extra}).database():env.unauthenticatedContext().database();
const r=(database,p='')=>ref(database,'collectionRooms/'+p);
async function create(id=room){
  const owner=db('owner');await set(r(owner,`secrets/${id}`),{owner:'owner',verifier:proof});await set(r(owner,`access/${id}/owner`),{active:true,proof});
  await update(r(owner),{[`rooms/${id}/meta`]:{name:'테스트 수집방',owner:'owner',locked:false,createdAt:serverTimestamp()},[`rooms/${id}/members/owner`]:{name:'방장',sharing:{'blue-mage':true}},[`userRooms/owner/${id}`]:true});return owner;
}
async function join(uid='member',id=room){const member=db(uid);await set(r(member,`access/${id}/${uid}`),{active:true,proof});await update(r(member),{[`rooms/${id}/members/${uid}`]:{name:'참여자',sharing:{'blue-mage':true}},[`userRooms/${uid}/${id}`]:true});return member;}
test('owner creates room with private verifier; anonymous and outsiders cannot enumerate or read',async()=>{
  const owner=await create(),member=await join(),outsider=db('outsider');
  for(const database of [db(),outsider,member,owner])await assertFails(get(r(database,`secrets/${room}`)));
  for(const database of [db(),outsider])for(const p of ['',`rooms/${room}/meta`,`rooms/${room}/members`,`access/${room}/owner`])await assertFails(get(r(database,p)));
  assert.equal((await assertSucceeds(get(r(member,`rooms/${room}/meta`)))).val().name,'테스트 수집방');
  await assertFails(get(r(member,'rooms')));await assertFails(get(r(member,`access/${room}/owner`)));
});
test('wrong password, unverified identity, and non-Google provider cannot enter',async()=>{
  await create();
  for(const database of [db('member'),db()])await assertFails(set(r(database,`access/${room}/member`),{active:true,proof:wrong}));
  await assertFails(set(r(db('member',{email_verified:false}),`access/${room}/member`),{active:true,proof}));
  await assertFails(set(r(db('member',{firebase:{sign_in_provider:'password'}}),`access/${room}/member`),{active:true,proof}));
  await assertFails(set(r(db('member'),`rooms/${room}/members/member`),{name:'침입',sharing:{'blue-mage':true}}));
});
test('only the owner can rotate the password and lock new admission; current members retain access',async()=>{
  const owner=await create(),member=await join();
  await assertFails(update(r(member,`secrets/${room}`),{verifier:wrong}));
  await assertFails(update(r(member,`rooms/${room}/meta`),{locked:true}));
  await assertSucceeds(update(r(owner,`secrets/${room}`),{verifier:wrong}));
  await assertFails(set(r(db('next'),`access/${room}/next`),{active:true,proof}));
  await assertSucceeds(set(r(db('next'),`access/${room}/next`),{active:true,proof:wrong}));
  await update(r(owner,`rooms/${room}/meta`),{locked:true});
  await assertFails(set(r(db('next2'),`access/${room}/next2`),{active:true,proof:wrong}));
  await assertSucceeds(get(r(member,`rooms/${room}/meta`)));
});
test('personal books are private, validated, and support atomic initial merge and field updates',async()=>{
  const owner=await create(),member=await join();
  await assertSucceeds(runTransaction(r(member,'users/member/books'),()=>({'blue-mage':{1:{value:1,wanted:false}}})));
  await assertSucceeds(update(r(member,'users/member/books'),{'blue-mage/1/value':0,'blue-mage/2/value':1,'blue-mage/2/wanted':true}));
  assert.equal((await get(r(member,'users/member/books/blue-mage/1/value'))).val(),0);
  for(const database of [owner,db('outsider'),db()]){await assertFails(get(r(database,'users/member')));await assertFails(set(r(database,'users/member/books/blue-mage/1'),{value:1,wanted:true}));}
  for(const value of [{value:2,wanted:false},{value:-1,wanted:false},{value:1.5,wanted:true},{value:1,wanted:false,note:'private'}])await assertFails(set(r(member,'users/member/books/blue-mage/1'),value));
  await assertSucceeds(update(r(member,'users/member/books'),{'blue-mage/3/value':1,'blue-mage/4/wanted':true}));
  assert.equal((await get(r(member,'users/member/books/blue-mage/3/value'))).val(),1);
  await assertSucceeds(update(r(member,'users/member/books'),{'blue-mage/3/wanted':true}));
  await assertFails(set(r(member,'users/member/books/unknown/1'),{value:1,wanted:false}));
  await assertFails(set(r(member,'users/member/books/blue-mage/bad-id'),{value:1,wanted:false}));
  await assertFails(set(r(member,'users/member/books/weapons/zodiac~PLD~weapon'),{value:-1,wanted:false}));
  await assertSucceeds(set(r(member,'users/member/books/weapons/zodiac~PLD~weapon'),{value:10054,wanted:true}));
});
test('shared books require membership and per-book consent, including on atomic enable and disable',async()=>{
  const owner=await create(),member=await join(),values={ready:true,entries:{1:{value:1,wanted:false}}};
  await assertSucceeds(set(r(member,`shared/${room}/member/blue-mage`),values));
  await assertSucceeds(get(r(owner,`shared/${room}/member/blue-mage`)));
  await assertFails(get(r(db('outsider'),`shared/${room}/member/blue-mage`)));
  await assertFails(get(r(owner,`shared/${room}/member`)));
  await assertFails(set(r(owner,`shared/${room}/member/blue-mage`),values));
  await assertFails(set(r(member,`shared/${room}/member/minions`),values));
  await assertSucceeds(update(r(member),{[`rooms/${room}/members/member/sharing/minions`]:true,[`shared/${room}/member/minions`]:values}));
  await assertSucceeds(get(r(owner,`shared/${room}/member/minions`)));
  await assertSucceeds(update(r(member),{[`rooms/${room}/members/member/sharing/minions`]:false,[`shared/${room}/member/minions`]:null}));
  await assertFails(get(r(owner,`shared/${room}/member/minions`)));
});
test('real Firebase dense numeric snapshots can be imported, published, and read by another member',async()=>{
  const M=require('../../../ffxiv/collection-room/model.js'),owner=await create(),member=await join();
  const original={'blue-mage':{'1':{value:1,wanted:false},'2':{value:1,wanted:true},'4':{value:0,wanted:false}}};
  await set(r(member,'users/member/books'),original);
  const received=(await get(r(member,'users/member/books'))).val();assert.equal(Array.isArray(received['blue-mage']),true);
  const decoded=M.normalize(received);assert.deepEqual(decoded,original);
  await set(r(member,`shared/${room}/member/blue-mage`),{ready:true,entries:decoded['blue-mage']});
  const published=(await get(r(owner,`shared/${room}/member/blue-mage`))).val();assert.equal(Array.isArray(published.entries),true);
  assert.deepEqual(M.normalize({'blue-mage':published.entries}),original);
  await update(r(member,'users/member/books'),{'blue-mage/1/value':0});
  const latest=M.normalize((await get(r(member,'users/member/books'))).val());assert.equal(latest['blue-mage']['1'].value,0);assert.equal(latest['blue-mage']['2'].wanted,true);
});
test('membership in one room never grants access to another room',async()=>{
  const owner=await create();await create(otherRoom);const member=await join();
  await set(r(owner,`shared/${otherRoom}/owner/blue-mage`),{ready:true,entries:{1:{value:1,wanted:false}}});
  await assertFails(get(r(member,`rooms/${otherRoom}/meta`)));await assertFails(get(r(member,`shared/${otherRoom}/owner/blue-mage`)));
});
test('kick revokes reads and writes, prevents password re-entry, and leaves personal books intact',async()=>{
  const owner=await create(),member=await join();
  await set(r(member,'users/member/books/blue-mage/1'),{value:1,wanted:false});
  await set(r(member,`shared/${room}/member/blue-mage`),{ready:true,entries:{1:{value:1,wanted:false}}});
  await assertFails(set(r(member,`bans/${room}/owner`),true));
  await assertSucceeds(update(r(owner),{[`bans/${room}/member`]:true,[`access/${room}/member`]:null,[`rooms/${room}/members/member`]:null,[`shared/${room}/member/blue-mage`]:null}));
  await assertFails(get(r(member,`rooms/${room}/members`)));await assertFails(get(r(member,`shared/${room}/owner/blue-mage`)));
  await assertFails(set(r(member,`access/${room}/member`),{active:true,proof}));
  await assertFails(set(r(member,`shared/${room}/member/blue-mage`),{ready:true,entries:{1:{value:0,wanted:true}}}));
  assert.equal((await get(r(member,'users/member/books/blue-mage/1/value'))).val(),1);
});
test('leaving removes room copies without removing personal collection',async()=>{
  await create();const member=await join();await set(r(member,'users/member/books/blue-mage/1'),{value:1,wanted:false});
  await assertSucceeds(update(r(member),{[`rooms/${room}/members/member`]:null,[`access/${room}/member`]:null,[`userRooms/member/${room}`]:null,[`shared/${room}/member/blue-mage`]:null,[`shared/${room}/member/minions`]:null}));
  await assertFails(get(r(member,`rooms/${room}/meta`)));await assertSucceeds(get(r(member,'users/member/books')));
});
test('application project never accepts statistics writes or exposes counter data',async()=>{
  const member=db('member');await assertFails(get(ref(member,'visits')));await assertFails(get(ref(member,'counters')));await assertFails(set(ref(member,'counters/home'),42));
  await assertFails(set(ref(env.unauthenticatedContext().database(),'visits/home/'+'e'.repeat(32)),true));
});
test('mount collection preserves old notebooks and needs separate room consent',async()=>{
  const M=require('../../../ffxiv/collection-room/model.js'),catalog=require('../../../ffxiv/collection-room/catalog.json'),owner=await create(),member=await join();
  await set(r(member,'users/member/books/blue-mage/1'),{value:1,wanted:false});
  await runTransaction(r(member,'users/member/books'),remote=>M.mergeInitial(remote,{mounts:{'28':{value:1,wanted:false},'29':{value:0,wanted:true}}},catalog));
  const books=M.normalize((await get(r(member,'users/member/books'))).val());assert.equal(books['blue-mage']['1'].value,1);assert.equal(books.mounts['28'].value,1);assert.equal(books.mounts['29'].wanted,true);
  const value={ready:true,entries:books.mounts};await assertFails(set(r(member,`shared/${room}/member/mounts`),value));await assertFails(get(r(owner,'users/member/books/mounts')));
  await assertSucceeds(update(r(member),{[`rooms/${room}/members/member/sharing/mounts`]:true,[`shared/${room}/member/mounts`]:value}));
  const shared=(await get(r(owner,`shared/${room}/member/mounts`))).val();assert.deepEqual(M.normalize({mounts:shared.entries}).mounts,books.mounts);
});
