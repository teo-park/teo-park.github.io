// Public web configuration; all authorization is enforced by Database Rules.
const firebaseConfig={"apiKey":"AIzaSyAR1Ar8k3-l2lDnZxevMEy-mZOdkaiRTXE","authDomain":"teo-ffxiv.firebaseapp.com","databaseURL":"https://teo-ffxiv-default-rtdb.asia-southeast1.firebasedatabase.app","projectId":"teo-ffxiv","appId":"1:332896786813:web:11eea6e6f59201cfb1d414"};
let connection;
export function connect(){
  return connection||=Promise.all([
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js'),
  ]).then(async([App,Auth,DB])=>{
    const app=App.getApps().find(a=>a.name==='teo-ffxiv')||App.initializeApp(firebaseConfig,'teo-ffxiv'),auth=Auth.getAuth(app),db=DB.getDatabase(app);
    await Auth.setPersistence(auth,Auth.browserLocalPersistence);auth.languageCode='ko';
    const provider=new Auth.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
    return {Auth,DB,auth,db,ref:path=>DB.ref(db,'collectionRooms/'+path),login:()=>Auth.signInWithPopup(auth,provider),logout:()=>Auth.signOut(auth)};
  }).catch(error=>{connection=null;throw error;});
}
