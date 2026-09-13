const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'../..'),ocean=path.join(root,'ocean-fishing');
const fish=require('../data/fish.json'),achievements=require('../data/achievements.json');
const first=Date.parse(require('./fixtures/voyages.json').firstDeparture);

async function open(route,options={}){
  const errors=[],values=new Map(),timers=new Map(),children=[],childTimers=new Map(),notices=[];let now=first-60000,requests=0,failed=false;
  const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
  const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...s)=>errors.push(s.join(' ')));
  class Local extends ResourceLoader{fetch(url){const p=new URL(url);if(!p.pathname.endsWith('.js'))return null;return Promise.resolve(fs.readFileSync(path.join(root,p.pathname.replace('/ffxiv/',''))));}}
  const dom=new JSDOM(fs.readFileSync(path.join(ocean,route,'index.html'),'utf8'),{
    url:`https://journal.test/ffxiv/ocean-fishing/${route}/`,resources:new Local(),runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,
    beforeParse(w){
      Object.defineProperty(w,'localStorage',{value:storage});Object.defineProperty(w,'isSecureContext',{value:true});
      w.Date.now=()=>now;w.scrollTo=()=>{};w.focus=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
      w.setInterval=(fn,ms)=>{timers.set(ms,fn);return ms;};w.clearInterval=id=>timers.delete(id);
      w.fetch=async url=>({ok:true,json:async()=>JSON.parse(JSON.stringify(url.includes('achievements')?achievements:fish))});
      if(options.alerts){w.Notification=function(title,options){notices.push({title,options});this.close=()=>{};};w.Notification.permission='granted';}
      if(!options.unsupported)w.documentPictureInPicture={requestWindow:async()=>{
        requests++;if(failed)throw Error('denied');
        const child=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:w.location.href,pretendToBeVisual:true,virtualConsole:vc});
        children.push(child);const cw=child.window,close=cw.close.bind(cw);cw.closed=false;cw.focus=()=>{};
        cw.setInterval=(fn,ms)=>{childTimers.set(cw,fn);return ms;};cw.clearInterval=()=>childTimers.delete(cw);
        cw.close=()=>{if(cw.closed)return;cw.dispatchEvent(new cw.Event('pagehide'));cw.closed=true;close();};return cw;
      }};
    }
  });
  const w=dom.window,d=w.document,$=s=>d.querySelector(s);
  for(let i=0;i<100&&$('#appContent').hidden&&$('#retryLoad').hidden;i++)await new Promise(r=>setTimeout(r,10));
  assert.equal($('#appContent').hidden,false,errors.join('\n'));
  const flush=()=>new Promise(r=>setImmediate(r));
  return {w,d,$,storage,errors,children,childTimers,timers,notices,get requests(){return requests;},setFail:v=>failed=v,setNow:t=>now=t,
    get child(){return children.at(-1).window;},p(s){return this.child.document.querySelector(s);},
    input(s,value){const e=$(s);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatchEvent(new w.Event(e.type==='number'?'input':'change',{bubbles:true}));},
    async launch(){ $('#openOceanPip').click();await flush();return this.child; },flush,
    close(){w.dispatchEvent(new w.Event('pagehide'));children.forEach(c=>c.window.close());w.close();}
  };
}
function sameRows(ui,stop,phase){
  const parent=[...ui.d.querySelectorAll(`[data-zone="${stop}-${phase}"] [data-entry]`)].map(e=>e.dataset.entry);
  const child=[...ui.child.document.querySelectorAll('[data-pip-entry]')].map(e=>e.dataset.pipEntry);
  assert.deepEqual(child,parent);return child;
}

for(const route of ['indigo','ruby'])test(`${route}: PiP mirrors filters, stop selection, ranking and shared collection`,async()=>{
  const ui=await open(route);
  try{
    assert.equal(ui.requests,0,'opening the planner must not open PiP');assert.equal(ui.$('#openOceanPip').disabled,false);
    await ui.launch();assert.equal(ui.requests,1);assert.equal(ui.$('#openOceanPip').getAttribute('aria-pressed'),'true');
    assert.equal(ui.p('#oceanPipTitle').textContent,route==='indigo'?'근해 수첩':'원양 수첩');
    assert.equal(ui.p('#oceanPipDeparture').textContent,ui.$('#selectedTime').textContent);sameRows(ui,0,'regular');
    assert.equal(ui.p('img').src.startsWith(`https://journal.test/ffxiv/ocean-fishing/`),true);
    ui.$('#openOceanPip').click();await ui.flush();assert.equal(ui.requests,1,'reuse the existing PiP window');
    ui.p('[data-pip-stop="2"]').click();assert.equal(ui.$('#stopTab2').getAttribute('aria-selected'),'true');sameRows(ui,2,'regular');
    ui.p('[data-pip-phase=spectral]').click();sameRows(ui,2,'spectral');
    ui.$('[data-stop="1"]').click();assert.equal(ui.p('#oceanPipStop1').getAttribute('aria-selected'),'true');sameRows(ui,1,'spectral');
    ui.p('#oceanPipStop1').dispatchEvent(new ui.child.KeyboardEvent('keydown',{key:'Home',bubbles:true}));sameRows(ui,0,'spectral');
    ui.$('[name=purpose][value=score]').click();sameRows(ui,0,'spectral');assert.match(ui.p('#oceanPipPurpose').textContent,/고득점 · 700 GP/);
    assert.ok(ui.p('.recommendation'));assert.match(ui.p('.recommendation').textContent,/1순위/);
    ui.input('#strategyGP',100);assert.match(ui.p('#oceanPipPurpose').textContent,/100 GP/);
    ui.input('[data-zone="0-spectral"] [data-zone-option=scoreSort]','name');sameRows(ui,0,'spectral');
    ui.input('[data-zone="0-spectral"] [data-zone-option=bait]','Krill');sameRows(ui,0,'spectral');
    ui.$('[name=purpose][value=all]').click();ui.p('[data-pip-phase=regular]').click();
    const entry=sameRows(ui,0,'regular')[0],f=fish.fish.find(f=>f.entryId===entry);
    ui.p(`[data-pip-catch="${entry}"]`).click();assert.equal(ui.w.OceanCollection.caught(ui.w.OceanCollection.read(ui.storage),route,f.Fish),true);
    assert.equal(ui.$(`[data-entry="${entry}"]`).checked,true);assert.equal(ui.p(`[data-pip-catch="${entry}"]`).checked,true);
    assert.match(ui.p('#oceanPipMessage').textContent,/수집 기록/);assert.equal(ui.p('#oceanPipUndo').hidden,false);
    ui.p('#oceanPipUndo').click();assert.equal(ui.w.OceanCollection.caught(ui.w.OceanCollection.read(ui.storage),route,f.Fish),false);assert.equal(ui.p(`[data-pip-catch="${entry}"]`).checked,false);
    ui.w.OceanCollection.setCaught(ui.storage,route,f.Fish,true);ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:'caughtFishLS-combined'}));
    assert.equal(ui.p(`[data-pip-catch="${entry}"]`).checked,true,'updates made in another tab must reach PiP');
    ui.$(`[data-entry="${entry}"]`).click();assert.equal(ui.p(`[data-pip-catch="${entry}"]`).checked,false);
    ui.$('[name=purpose][value=collection]').click();sameRows(ui,0,'regular');
    const removable=[...ui.child.document.querySelectorAll('[data-pip-entry]')].find(row=>!row.textContent.includes('환해류 유도')&&!row.textContent.includes('조건용'));
    if(removable){removable.querySelector('input').click();sameRows(ui,0,'regular');ui.p('#oceanPipUndo').click();sameRows(ui,0,'regular');}
    assert.ok(ui.p('.ocean-pip-comparison'),'condition fish keep their bite comparisons');
    ui.p('.ocean-pip-comparison').open=true;ui.$('#strategyGP').value='200';ui.input('#strategyGP',200);assert.ok(ui.p('.ocean-pip-comparison').open);
    assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
});

test('child countdown, voyage rollover, close/reopen and failed open leave records intact',async()=>{
  const ui=await open('indigo');
  try{
    await ui.launch();const departure=ui.p('#oceanPipDeparture').textContent;
    assert.match(ui.p('#oceanPipClock').textContent,/접수까지/);
    ui.setNow(first+30000);ui.childTimers.get(ui.child)();assert.match(ui.p('#oceanPipClock').textContent,/접수 중/);
    ui.setNow(first+61*60000);ui.timers.get(30000)();assert.equal(ui.p('#oceanPipDeparture').textContent,departure);
    ui.childTimers.get(ui.child)();assert.match(ui.p('#oceanPipClock').textContent,/접수 종료/);
    ui.$('#returnFirst').click();assert.notEqual(ui.p('#oceanPipDeparture').textContent,departure);
    const records=ui.storage.getItem('caughtFishLS-combined');
    ui.child.close();assert.equal(ui.childTimers.size,0);assert.equal(ui.$('#openOceanPip').getAttribute('aria-pressed'),'false');
    ui.setFail(true);ui.$('#openOceanPip').click();await ui.flush();assert.match(ui.$('#oceanPipHint').textContent,/열지 못/);assert.equal(ui.$('#openOceanPip').disabled,false);
    ui.setFail(false);await ui.launch();assert.ok(ui.p('[data-pip-entry]'));assert.equal(ui.childTimers.size,1);
    ui.w.dispatchEvent(new ui.w.Event('pagehide'));assert.equal(ui.child.closed,true);assert.equal(ui.childTimers.size,0);
    assert.equal(ui.storage.getItem('caughtFishLS-combined'),records);assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
});
test('unsupported browser leaves both route buttons disabled and checklist unchanged',async()=>{
  for(const route of ['indigo','ruby','checklist']){
    const ui=await open(route,{unsupported:true});try{
      if(route==='checklist')assert.equal(ui.$('[data-open-ocean-pip]'),null);
      else{assert.equal(ui.d.querySelectorAll('[data-open-ocean-pip]:disabled').length,2);assert.match(ui.$('#oceanPipHint').textContent,/PC Chrome/);}
      assert.deepEqual(ui.errors,[]);
    }finally{ui.close();}
  }
});

for(const route of ['indigo','ruby'])test(`${route}: departure alert switch syncs between PiP and timetable, and the child clock triggers it`,async()=>{
  const ui=await open(route,{alerts:true});try{
    await ui.launch();assert.equal(ui.p('#oceanPipNotifications').getAttribute('aria-checked'),'false');
    ui.$('#oceanNotifications').click();await ui.flush();assert.equal(ui.p('#oceanPipNotifications').getAttribute('aria-checked'),'true');
    assert.match(ui.p('#oceanPipNotificationStatus').textContent,/근해·원양 공통/);
    ui.p('#oceanPipNotifications').click();await ui.flush();assert.equal(ui.$('#oceanNotifications').getAttribute('aria-checked'),'false');
    ui.p('#oceanPipNotifications').click();await ui.flush();assert.equal(ui.$('#oceanNotifications').getAttribute('aria-checked'),'true');
    ui.setNow(first);ui.childTimers.get(ui.child)();await ui.flush();assert.equal(ui.notices.length,1);assert.match(ui.notices[0].title,/접수 시작/);
    ui.childTimers.get(ui.child)();await ui.flush();assert.equal(ui.notices.length,1);
    ui.child.close();assert.equal(ui.$('#oceanNotifications').getAttribute('aria-checked'),'true','closing PiP must not turn off the page alarm');
    ui.$('#oceanNotifications').click();await ui.flush();assert.equal(ui.$('#oceanNotifications').getAttribute('aria-checked'),'false');assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
});
