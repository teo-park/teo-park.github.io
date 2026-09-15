const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const V=require('../scripts/voyages.js');
const code=fs.readFileSync(path.join(__dirname,'../scripts/notifications.js'),'utf8');
const KEY='teo-ffxiv.ocean.departure-alerts.v1',SENT='teo-ffxiv.ocean.departure-alerts.sent.v1';
const SCORE_KEY='teo-ffxiv.ocean.score-deadline-alerts.v1',SCORE_SENT='teo-ffxiv.ocean.score-deadline-alerts.sent.v1';
const START=Date.parse('2026-09-13T04:00:00Z'); // 13:00 KST
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function environment(){
  const values=new Map(),sent=[];let queue=Promise.resolve();
  const env={values,sent,now:START-1000,permission:'default',requests:0,failKey:null,failDisplay:false,ask:null};
  env.storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>{if(k===env.failKey)throw Error('quota');values.set(k,String(v));}};
  env.locks={request:(name,options,fn)=>{const result=queue.then(()=>fn({name}));queue=result.catch(()=>{});return result;}};
  return env;
}
function open(env,route='indigo',{unsupported=false,noLocks=false}={}){
  const dom=new JSDOM('<button id="oceanNotifications"></button><p id="oceanNotificationStatus"></p><button id="oceanScoreNotifications"></button><p id="oceanScoreNotificationStatus"></p><div id="scheduleRows"></div>',{url:`https://journal.test/ffxiv/ocean-fishing/${route}/`,runScripts:'outside-only'});
  const w=dom.window,timers=new Map();let timerId=0;
  w.JournalVoyages=V;w.Date.now=()=>env.now;w.focus=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
  Object.defineProperty(w,'isSecureContext',{value:true});Object.defineProperty(w,'localStorage',{value:env.storage});
  if(!noLocks)Object.defineProperty(w.navigator,'locks',{value:env.locks});
  if(!unsupported){
    w.Notification=function(title,options){if(env.failDisplay)throw Error('display');this.title=title;this.options=options;this.close=()=>{};env.sent.push(this);};
    Object.defineProperty(w.Notification,'permission',{get:()=>env.permission});
    w.Notification.requestPermission=async()=>{env.requests++;return env.ask?await env.ask():env.permission='granted';};
  }
  w.setTimeout=(fn,ms)=>{const id=++timerId;timers.set(id,{fn,ms});return id;};w.clearTimeout=id=>timers.delete(id);
  w.eval(code);const api=w.OceanNotifications.mount();
  return {w,api,timers,button:w.document.getElementById('oceanNotifications'),close(){w.dispatchEvent(new w.Event('pagehide'));w.close();}};
}

test('OFF by default; permission is only requested by ON, and the next odd KST hour is scheduled',async()=>{
  const env=environment(),ui=open(env);try{
    await flush();assert.equal(env.requests,0);assert.equal(ui.api.state().enabled,false);assert.equal(ui.timers.size,0);
    await ui.api.enable();assert.equal(env.requests,1);assert.equal(env.values.get(KEY),'on');assert.equal(ui.button.getAttribute('aria-checked'),'true');
    assert.match(ui.api.state().message,/13:00/);assert.equal([...ui.timers.values()].at(-1).ms,1000);assert.equal(env.sent.length,0);
    env.now=START;await ui.api.check();assert.equal(env.sent.length,1);
    const n=env.sent[0];assert.match(n.title,/13:00.*접수 시작/);assert.match(n.options.body,/15분/);assert.match(n.options.body,/근해:/);assert.match(n.options.body,/원양:/);
    assert.match(n.options.icon,/\/ffxiv\/fishing-log\/app-icon.png$/);assert.equal(n.options.tag,'ocean-departure-'+START);
    await ui.api.check();assert.equal(env.sent.length,1);assert.match(ui.api.state().message,/15:00/);
    ui.api.disable();env.now=START+V.INTERVAL;await ui.api.check();assert.equal(env.sent.length,1);assert.equal(ui.timers.size,0);assert.equal(env.values.get(KEY),'off');
  }finally{ui.close();}
});
test('both routes share ON/OFF and exactly one notification, including simultaneous PiP checks and reload',async()=>{
  const env=environment(),a=open(env),b=open(env,'ruby');let c;
  try{
    await a.api.enable();b.w.dispatchEvent(new b.w.StorageEvent('storage',{key:KEY}));await flush();assert.equal(b.api.state().enabled,true);
    env.now=START;await Promise.all([a.api.check(),a.api.check(),b.api.check()]);assert.equal(env.sent.length,1);
    c=open(env);await flush();assert.equal(c.api.state().enabled,true);assert.equal(env.sent.length,1);assert.equal(env.requests,1);
    b.api.disable();for(const ui of [a,c])ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:KEY}));await flush();assert.equal(a.api.state().enabled,false);assert.equal(c.timers.size,0);
    await a.api.enable();await a.api.check();assert.equal(env.sent.length,1,'OFF/ON must not repeat this departure');
    env.now=START+V.INTERVAL;await a.api.check();assert.equal(env.sent.length,2);
  }finally{a.close();b.close();c?.close();}
});
test('late wake-up skips expired alerts and even KST hours; 23:00 rolls over to 01:00',async()=>{
  const env=environment();env.now=START+90000;const ui=open(env);try{
    await ui.api.enable();assert.equal(env.sent.length,0);
    env.now=START+3600000;await ui.api.check();assert.equal(env.sent.length,0);assert.match(ui.api.state().message,/15:00/);
    env.now=Date.parse('2026-09-13T14:00:00Z');await ui.api.check();assert.equal(env.sent.length,1);assert.match(env.sent[0].title,/23:00/);assert.match(ui.api.state().message,/09\. 14\. 01:00/);
    env.now+=V.INTERVAL;await ui.api.check();assert.equal(env.sent.length,2);assert.match(env.sent[1].title,/01:00/);
  }finally{ui.close();}
});
test('a delayed timer within 90 seconds still alerts once',async()=>{
  const env=environment(),ui=open(env);try{await ui.api.enable();env.now=START+89000;await ui.api.check();await ui.api.check();assert.equal(env.sent.length,1);}finally{ui.close();}
});
test('denied permission and unsupported browsers stay OFF without repeated permission requests',async()=>{
  const env=environment();env.permission='denied';const ui=open(env),unsupported=open(env,'ruby',{unsupported:true});try{
    await ui.api.enable();assert.equal(env.requests,0);assert.equal(ui.api.state().enabled,false);assert.match(ui.api.state().message,/허용/);
    assert.equal(unsupported.button.disabled,true);await unsupported.api.enable();assert.equal(env.requests,0);
  }finally{ui.close();unsupported.close();}
});
test('storage/display failures and permission revocation stop alerts visibly',async()=>{
  for(const failure of ['history','setting','display','revoked','asyncDisplay']){
    const env=environment(),ui=open(env);try{
      if(failure==='setting')env.failKey=KEY;
      await ui.api.enable();
      if(failure==='history')env.failKey=SENT;
      if(failure==='display')env.failDisplay=true;
      if(failure==='revoked')env.permission='denied';
      env.now=START;await ui.api.check();
      if(failure==='asyncDisplay')env.sent[0].onerror();
      assert.equal(ui.api.state().enabled,false,failure);assert.equal(ui.timers.size,0,failure);assert.equal(ui.button.getAttribute('aria-checked'),'false');
      if(failure!=='asyncDisplay')assert.equal(env.sent.length,0,failure);
    }finally{ui.close();}
  }
});
test('another tab turning OFF cancels a pending permission request; focus after permission does not cancel ON',async()=>{
  const env=environment();let resolve;env.ask=()=>new Promise(r=>resolve=r);const ui=open(env);try{
    const pending=ui.api.enable();env.storage.setItem(KEY,'off');ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:KEY}));env.permission='granted';resolve('granted');await pending;assert.equal(ui.api.state().enabled,false);assert.equal(env.values.get(KEY),'off');
    env.permission='default';const second=ui.api.enable();ui.w.document.dispatchEvent(new ui.w.Event('visibilitychange'));env.permission='granted';resolve('granted');await second;assert.equal(ui.api.state().enabled,true);
  }finally{ui.close();}
});
test('pagehide pauses timers, pageshow restores the saved toggle, and no-lock fallback reserves once',async()=>{
  const env=environment(),ui=open(env,'indigo',{noLocks:true});try{
    await ui.api.enable();ui.w.dispatchEvent(new ui.w.Event('pagehide'));env.now=START;await ui.api.check();assert.equal(env.sent.length,0);assert.equal(ui.timers.size,0);
    ui.w.dispatchEvent(new ui.w.Event('pageshow'));await flush();assert.equal(env.sent.length,1);assert.equal(ui.api.state().enabled,true);await ui.api.check();assert.equal(env.sent.length,1);
  }finally{ui.close();}
});

test('score reminder is independently OFF by default and fires at every odd KST hour :14 including midnight rollover',async()=>{
  const env=environment(),ui=open(env);try{
    assert.equal(ui.api.state('score').enabled,false);assert.equal(env.values.has(SCORE_KEY),false);
    env.now=Date.parse('2026-09-13T00:13:59+09:00');await ui.api.enable('score');
    assert.equal(ui.api.state().enabled,false);assert.equal(env.values.has(KEY),false);
    assert.match(ui.api.state('score').message,/01:14/);
    for(let hour=0;hour<26;hour++){
      const time=Date.parse('2026-09-13T00:00:00+09:00')+hour*3600000+14*60000;
      env.now=time-1;await ui.api.check();const before=env.sent.length;
      env.now=time;await ui.api.check();await ui.api.check();
      assert.equal(env.sent.length,before+(hour%2),'only odd KST hours at :14, once each');
      if(hour%2){assert.match(env.sent.at(-1).title,/점수 마감 1분 전/);assert.equal(env.sent.at(-1).options.tag,'ocean-score-deadline-'+time);}
    }
    assert.equal(env.sent.length,13);assert.match(ui.api.state('score').message,/09\. 14\. 03:14/);
    ui.api.disable('score');assert.equal(env.values.get(SCORE_KEY),'off');assert.equal(ui.timers.size,0);
  }finally{ui.close();}
});

test('score reminder tolerates a short delay but never fires after the :15 deadline or in an even hour',async()=>{
  for(const [delay,count] of [[-1,0],[59000,1],[60000,0],[90000,0],[3600000,0]]){
    const env=environment();env.now=START+14*60000+delay;const ui=open(env);try{
      await ui.api.enable('score');await ui.api.check();assert.equal(env.sent.length,count,String(delay));
    }finally{ui.close();}
  }
});

test('departure and score share permission but have separate toggles, histories and cross-tab deduplication',async()=>{
  const env=environment(),a=open(env),b=open(env,'ruby');let c;
  try{
    await Promise.all([a.api.enable(),a.api.enable('score')]);assert.equal(env.requests,1);
    for(const key of [KEY,SCORE_KEY])b.w.dispatchEvent(new b.w.StorageEvent('storage',{key}));await flush();
    assert.equal(b.api.state('score').enabled,true);
    env.now=START;await Promise.all([a.api.check(),b.api.check()]);assert.equal(env.sent.length,1);
    a.api.disable();assert.equal(a.api.state('score').enabled,true);
    b.w.dispatchEvent(new b.w.StorageEvent('storage',{key:KEY}));await flush();
    env.now=START+14*60000;await Promise.all([a.api.check(),a.api.check(),b.api.check()]);assert.equal(env.sent.length,2);
    assert.equal(env.values.get(SENT),String(START));assert.equal(env.values.get(SCORE_SENT),String(env.now));
    c=open(env);await flush();assert.equal(c.api.state('score').enabled,true);assert.equal(c.api.state().enabled,false);assert.equal(env.sent.length,2);
    a.api.disable('score');await a.api.enable('score');assert.equal(env.sent.length,2);
    b.api.disable('score');for(const ui of [a,c])ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:SCORE_KEY}));await flush();
    assert.equal(a.api.state('score').enabled,false);assert.equal(c.timers.size,0);
  }finally{a.close();b.close();c?.close();}
});

test('score history/display failure stops only the score reminder',async()=>{
  for(const failure of ['history','display']){
    const env=environment(),ui=open(env);try{
      await ui.api.enable();await ui.api.enable('score');
      if(failure==='history')env.failKey=SCORE_SENT;else env.failDisplay=true;
      env.now=START+14*60000;await ui.api.check();
      assert.equal(ui.api.state('score').enabled,false);assert.equal(ui.api.state().enabled,true);
      assert.match(ui.api.state('score').message,/점수 마감/);assert.equal(env.sent.length,0);
    }finally{ui.close();}
  }
});
