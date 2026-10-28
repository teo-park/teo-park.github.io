// Public web configuration; all authorization is enforced by Database Rules.
const firebaseConfig={apiKey:'AIzaSyCwN4gvdeT8seTXaTJS8i_7CTsH-XmX9pQ',authDomain:'teo-ffxiv-counter.firebaseapp.com',databaseURL:'https://teo-ffxiv-counter-default-rtdb.asia-southeast1.firebasedatabase.app',projectId:'teo-ffxiv-counter',appId:'1:504148055963:web:5ebbe46c8820209dc4333e'};
let connection;
export function connect(){
  return connection||=Promise.all([
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js'),
  ]).then(async([App,Auth,DB])=>{
    const app=App.getApps().find(a=>a.name==='collection-rooms')||App.initializeApp(firebaseConfig,'collection-rooms'),auth=Auth.getAuth(app),db=DB.getDatabase(app);
    await Auth.setPersistence(auth,Auth.browserLocalPersistence);auth.languageCode='ko';
    const provider=new Auth.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
    return {Auth,DB,auth,db,ref:path=>DB.ref(db,'collectionRooms/'+path),login:()=>Auth.signInWithPopup(auth,provider),logout:()=>Auth.signOut(auth)};
  }).catch(error=>{connection=null;throw error;});
}
