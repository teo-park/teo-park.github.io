// Firebase web configuration is public. Database Security Rules enforce access.
const firebaseConfig={
  apiKey:'AIzaSyCwN4gvdeT8seTXaTJS8i_7CTsH-XmX9pQ',
  authDomain:'teo-ffxiv-counter.firebaseapp.com',
  databaseURL:'https://teo-ffxiv-counter-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId:'teo-ffxiv-counter',
  appId:'1:504148055963:web:5ebbe46c8820209dc4333e',
};
try{
  const [{initializeApp},Auth,Database,response]=await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js'),
    fetch('../visitor-counter-config.json?v=20260915-private1',{cache:'no-store'}),
  ]);
  if(!response.ok)throw Error('Configuration unavailable');
  const config=await response.json();
  const app=initializeApp(firebaseConfig),auth=Auth.getAuth(app),db=Database.getDatabase(app);
  await Auth.setPersistence(auth,Auth.browserSessionPersistence);
  auth.languageCode='ko';
  const provider=new Auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt:'select_account',login_hint:CounterAdminModel.ownerEmail});
  const controller=CounterAdminController.create(document,CounterAdminModel,{
    signIn:()=>Auth.signInWithPopup(auth,provider),
    signOut:()=>Auth.signOut(auth),
    load:async()=>{
      if(!CounterAdminModel.allowed(auth.currentUser))throw Error('Unauthorized');
      const [baseline,visits]=await Promise.all([
        Database.get(Database.ref(db,'counters')),
        Database.get(Database.ref(db,'visits')),
      ]);
      return {pages:config.pages,baseline:baseline.val(),visits:visits.val()};
    },
  });
  Auth.onAuthStateChanged(auth,user=>{controller.onUser(user).catch(()=>{
    controller.clear();document.getElementById('status').textContent='로그인 상태를 확인하지 못했습니다. 다시 시도하세요.';
  });});
  // Do not retain rendered statistics when returning to a cached page after logout.
  window.addEventListener('pageshow',event=>{if(event.persisted)controller.onUser(auth.currentUser);});
}catch{
  document.getElementById('status').textContent='로그인 기능을 불러오지 못했습니다. 연결 상태를 확인하고 페이지를 새로고침하세요.';
}
