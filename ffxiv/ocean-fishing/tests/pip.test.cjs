const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'../..'),ocean=path.join(root,'ocean-fishing');
const fish=require('../data/fish.json'),achievements=require('../data/achievements.json');
const first=Date.parse(require('./fixtures/voyages.json').firstDeparture);

async function open(route,options={}){
  const errors=[],values=options.values||new Map(),timers=new Map(),children=[],childTimers=new Map(),notices=[];let now=first-60000,requests=0,failed=false;
  const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
  const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...s)=>errors.push(s.join(' ')));
  class Local extends ResourceLoader{fetch(url){const p=new URL(url);if(!p.pathname.endsWith('.js'))return null;return Promise.resolve(fs.readFileSync(path.join(root,p.pathname.replace('/ffxiv/',''))));}}
  const dom=new JSDOM(fs.readFileSync(path.join(ocean,route,'index.html'),'utf8'),{
    url:`https://journal.test/ffxiv/ocean-fishing/${route?route+'/':''}${options.search||''}`,resources:new Local(),runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,
    beforeParse(w){
      Object.defineProperty(w,'localStorage',{value:storage});Object.defineProperty(w,'isSecureContext',{value:true});
      w.Date.now=()=>now;w.scrollTo=()=>{};w.focus=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
      w.setInterval=(fn,ms)=>{timers.set(ms,fn);return ms;};w.clearInterval=id=>timers.delete(id);
      w.fetch=async url=>({ok:true,json:async()=>JSON.parse(JSON.stringify(url.includes('achievements.json')?achievements:fish))});
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
  return {w,d,$,storage,values,errors,children,childTimers,timers,notices,get requests(){return requests;},setFail:v=>failed=v,setNow:t=>now=t,
    get child(){return children.at(-1).window;},p(s){return this.child.document.querySelector(s);},
    input(s,value){const e=$(s);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatchEvent(new w.Event(e.type==='number'?'input':'change',{bubbles:true}));},
    async launch(){ $('#openOceanPip').click();await flush();return this.child; },flush,
    close(){w.dispatchEvent(new w.Event('pagehide'));children.forEach(c=>c.window.close());w.close();}
  };
}
function sameRows(ui,stop,phase){
  const parent=[...ui.d.querySelectorAll(phase==='all'?`#stopPanel${stop} [data-entry]`:`[data-zone="${stop}-${phase}"] [data-entry]`)].map(e=>e.dataset.entry);
  const child=[...ui.child.document.querySelectorAll(phase==='all'?'[data-pip-entry]':`[data-pip-zone="${phase}"] [data-pip-entry]`)].map(e=>e.dataset.pipEntry);
  assert.deepEqual(child,parent);return child;
}

test('PiP settings fold away and both water lists fold independently without losing state',async()=>{
  const ui=await open('indigo',{alerts:true});
  try{
    await ui.launch();const child=ui.child;
    const settings=()=>ui.p('#oceanPipControls'),zone=id=>ui.p(`[data-pip-zone="${id}"]`);
    assert.equal(settings().open,false);assert.equal(ui.p('[data-pip-phase]'),null);
    for(const id of ['regular','spectral'])assert.ok(zone(id).open);
    assert.match(ui.p('#oceanPipCompactSummary').textContent,/1구간.*알림 OFF/);sameRows(ui,0,'all');
    for(const id of ['oceanPipStops','oceanPipStarter','oceanPipRecommendations']){
      assert.equal(ui.p('#'+id).closest('details'),null,id+' must remain outside folded settings');
      assert.ok(ui.p('#'+id).compareDocumentPosition(ui.p('#oceanPipList'))&ui.child.Node.DOCUMENT_POSITION_FOLLOWING);
    }
    ui.p('[data-pip-stop="2"]').click();assert.equal(settings().open,false);
    assert.match(ui.p('#oceanPipCompactSummary').textContent,/3구간/);sameRows(ui,2,'all');
    assert.equal(ui.p('#oceanPipStarter').textContent,ui.$('#stopTab2 .stop-starter').textContent);
    settings().querySelector('summary').click();assert.equal(settings().open,true);
    for(const id of ['oceanPipGoal','oceanPipNotifications'])assert.ok(settings().contains(ui.p('#'+id)),id);
    ui.p('#oceanPipNotifications').click();await ui.flush();assert.match(ui.p('#oceanPipCompactSummary').textContent,/알림 ON/);
    ui.p('[data-pip-stop="2"]').click();assert.match(ui.p('#oceanPipCompactSummary').textContent,/3구간/);
    settings().querySelector('summary').click();assert.equal(settings().open,false);
    ui.p('[data-pip-zone-summary=regular]').click();assert.equal(zone('regular').open,false);assert.equal(zone('spectral').open,true);
    const catchBox=zone('spectral').querySelector('[data-pip-catch]');catchBox.click();
    assert.equal(zone('regular').open,false);assert.equal(zone('spectral').open,true);assert.equal(settings().open,false);
    ui.p('#oceanPipUndo').click();assert.equal(zone('regular').open,false);
    ui.input('#strategyGP',100);assert.equal(zone('regular').open,false);
    ui.$('[data-stop="1"]').click();assert.equal(zone('regular').open,false);assert.equal(zone('spectral').open,true);sameRows(ui,1,'all');
    ui.p('[data-pip-zone-summary=spectral]').click();assert.equal(zone('spectral').open,false);
    ui.p('[data-pip-route=ruby]').click();assert.equal(settings().open,false);assert.equal(zone('regular').open,false);assert.equal(zone('spectral').open,false);sameRows(ui,0,'all');
    ui.p('[data-pip-zone-summary=regular]').click();assert.equal(zone('regular').open,true);
    ui.$('#scheduleToggle').click();ui.d.querySelectorAll('[data-voyage]')[1].click();
    assert.equal(zone('regular').open,true);assert.equal(zone('spectral').open,false);assert.equal(ui.child,child);
    // A newly opened PiP starts with both lists visible, rather than inheriting a hidden phase.
    child.close();await ui.launch();assert.equal(settings().open,false);assert.equal(zone('regular').open,true);assert.equal(zone('spectral').open,true);
    assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
});

for(const route of ['indigo','ruby'])test(`${route}: PiP recommends current voyage achievements across purposes and completion filters`,async()=>{
  const ui=await open(route);const V=require('../scripts/voyages.js');
  try{
    await ui.launch();const child=ui.child;
    ui.$('#scheduleToggle').click();ui.$('#moreVoyages').click();
    const ids=()=>[...child.document.querySelectorAll('[data-pip-achievement]')].map(b=>b.dataset.pipAchievement).sort();
    const choose=number=>{
      const button=[...ui.d.querySelectorAll('[data-voyage]')].find(b=>V.at(route,Number(b.dataset.voyage)).number===number);
      assert.ok(button,route+' '+number);button.click();return button.dataset.voyage;
    };
    for(let number=1;number<=(route==='indigo'?12:9);number++){
      choose(number);
      const expected=achievements.goals.filter(g=>g.route===route&&g.recommended.includes(number)).map(g=>g.id).sort();
      assert.deepEqual(ids(),expected,'only exact recommended routes, never appearance or alternatives');
      assert.equal(ui.p('#oceanPipRecommendations').hidden,false);
      if(!expected.length)assert.match(ui.p('#oceanPipRecommendations').textContent,/현재 항로에 추천 업적 없음/);
    }
    const voyage=route==='indigo'?12:5;choose(voyage);
    const goals=achievements.goals.filter(g=>g.route===route&&g.recommended.includes(voyage));assert.equal(goals.length,2);
    const expected=goals.map(g=>g.id).sort();
    const mainIds=()=>[...ui.$('[data-voyage][aria-pressed=true]').closest('tr').querySelectorAll('[data-recommended-achievement]')].map(el=>el.dataset.recommendedAchievement).sort();
    for(const purpose of ['all','collection','mission','score','achievement']){
      ui.input(`[name=purpose][value=${purpose}]`,purpose);assert.deepEqual(ids(),expected);
      assert.deepEqual(mainIds(),expected,'main schedule must also recommend independently of fishing purpose');
      assert.equal(ui.p('#oceanPipRecommendations').closest('details'),null);
    }
    const different=achievements.goals.find(g=>g.route===route&&!expected.includes(g.id));
    ui.$(`[name=achievementGroup][value="${different.id}"]`).click();
    assert.deepEqual(mainIds(),expected,'a selected goal must not hide other recommended achievements');assert.deepEqual(ids(),expected);
    for(const g of goals){
      const button=ui.p(`[data-pip-achievement="${g.id}"]`);
      assert.ok(button.textContent.includes(g.label));assert.ok(button.textContent.includes((g.scope==='party'?'파티':'개인')+' '+g.count+'마리'));
    }
    ui.$('[name=purpose][value=mission]').click();
    const mission=ui.$('[name=species]');mission.click();const savedMission=ui.values.get('ocean:species-groups:'+route);
    ui.p('[data-pip-stop="2"]').click();const departure=ui.$('#selectedTime').textContent;
    const goal=goals[0],badge=ui.p(`[data-pip-achievement="${goal.id}"]`);badge.focus();badge.click();
    assert.equal(ui.p('#oceanPipGoal').value,'achievement');assert.equal(ui.p('#oceanPipGoalOptions').open,false);
    assert.deepEqual([...ui.d.querySelectorAll('[name=achievementGroup]:checked')].map(b=>b.value),[goal.id]);
    assert.deepEqual(JSON.parse(ui.values.get('ocean:achievement-groups:'+route)),[goal.id]);
    assert.equal(ui.values.get('ocean:species-groups:'+route),savedMission);
    assert.equal(ui.p(`[data-pip-achievement="${goal.id}"]`).getAttribute('aria-pressed'),'true');
    assert.equal(child.document.activeElement.dataset.pipAchievement,goal.id);
    assert.equal(ui.$('#selectedTime').textContent,departure);assert.equal(ui.p('#oceanPipStop2').getAttribute('aria-selected'),'true');
    for(const g of goals)ui.$(`[data-achievement-record="${g.id}"]`).click();
    assert.deepEqual(ids(),[]);assert.equal(ui.p('#oceanPipRecommendations').hidden,false);
    assert.match(ui.p('#oceanPipRecommendations').textContent,/완료한 추천 업적은 제외 중/);
    ui.p('[data-pip-goal-field=excludeCompletedAchievements]').click();assert.deepEqual(ids(),expected);
    for(const g of goals)assert.match(ui.p(`[data-pip-achievement="${g.id}"]`).textContent,/완료/);
    // External completion changes also update the open PiP.
    const records=ui.w.OceanAchievementRecords;records.setCompleted(ui.storage,goal.id,false);
    ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:records.KEY}));
    assert.doesNotMatch(ui.p(`[data-pip-achievement="${goal.id}"]`).textContent,/완료/);
    ui.p(`[data-pip-route="${route==='indigo'?'ruby':'indigo'}"]`).click();
    assert.ok(ids().every(id=>achievements.goals.find(g=>g.id===id).route!==route));
    assert.equal(ui.child,child);assert.equal(ui.requests,1);assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
});

for(const entry of ['', 'indigo', 'ruby'])test(`${entry||'unified home'}: switching routes keeps one PiP, independent goals and route views, records and alerts`,async()=>{
  const values=new Map(['indigo','ruby'].map(route=>['ocean:purpose:'+route,'mission']));
  const ui=await open(entry,{values,alerts:true});
  try{
    const initial=entry==='ruby'?'ruby':'indigo',other=initial==='ruby'?'indigo':'ruby';
    await ui.launch();const child=ui.child;
    const groupIds=()=>[...child.document.querySelectorAll('[data-pip-group]')].map(el=>el.dataset.pipGroup);
    const firstGroup=groupIds()[0];ui.p(`[data-pip-group="${firstGroup}"]`).click();
    ui.$('#scheduleToggle').click();ui.d.querySelectorAll('[data-voyage]')[3].click();
    const departure=ui.$('#selectedTime').textContent;
    ui.p('[data-pip-stop="2"]').click();
    ui.input('[data-zone="2-regular"] [data-zone-option=sort]','name');
    ui.p('#oceanPipNotifications').click();await ui.flush();
    ui.p(`[data-pip-route="${other}"]`).click();
    assert.equal(ui.child,child);assert.equal(child.closed,false);assert.equal(ui.requests,1);assert.equal(ui.childTimers.size,1);
    assert.equal(new URL(ui.w.location.href).searchParams.get('route'),other);
    assert.equal(ui.p(`[data-pip-route="${other}"]`).getAttribute('aria-pressed'),'true');
    assert.equal(ui.$(`[data-ocean-route="${other}"]`).getAttribute('aria-pressed'),'true');
    assert.equal(ui.$('#selectedTime').textContent,departure,'first visit keeps the departure time while recomputing the route');
    assert.equal(ui.p('#oceanPipGoal').value,'mission');
    const expected=[...new Set(fish.fish.filter(f=>f.route===other&&f.Species).map(f=>f.Species))].sort();
    assert.deepEqual(groupIds().sort(),expected,'same purpose must rebuild groups for the new route');
    assert.equal(child.document.querySelectorAll('[data-pip-group]:checked').length,0);
    assert.deepEqual([...ui.d.querySelectorAll('[data-achievement-record]')].map(el=>el.dataset.achievementRecord).sort(),achievements.goals.filter(g=>g.route===other).map(g=>g.id).sort());
    sameRows(ui,0,'all');assert.equal(ui.p('#oceanPipNotifications').getAttribute('aria-checked'),'true');
    const nextGroup=groupIds()[0];ui.p(`[data-pip-group="${nextGroup}"]`).click();
    const catchBox=ui.p('[data-pip-catch]'),f=fish.fish.find(f=>f.entryId===catchBox.dataset.pipCatch);catchBox.click();
    assert.ok(ui.w.OceanCollection.caught(ui.w.OceanCollection.read(ui.storage),other,f.Fish));
    ui.$(`[data-ocean-route="${initial}"]`).click();
    assert.equal(ui.child,child);assert.equal(ui.p('#oceanPipStop2').getAttribute('aria-selected'),'true');
    assert.equal(ui.$('[data-zone="2-regular"] [data-zone-option=sort]').value,'name');
    assert.equal(ui.$('#selectedTime').textContent,departure);assert.ok(ui.p(`[data-pip-group="${firstGroup}"]`).checked);sameRows(ui,2,'all');
    ui.p('#oceanPipUndo').click();assert.equal(ui.w.OceanCollection.caught(ui.w.OceanCollection.read(ui.storage),other,f.Fish),false,'undo still targets the fish on the previous route');
    ui.w.history.back();await new Promise(resolve=>setTimeout(resolve,30));
    assert.equal(ui.$(`[data-ocean-route="${other}"]`).getAttribute('aria-pressed'),'true');assert.ok(ui.p(`[data-pip-group="${nextGroup}"]`).checked);sameRows(ui,0,'all');
    ui.w.history.forward();await new Promise(resolve=>setTimeout(resolve,30));sameRows(ui,2,'all');
    // Navigation's journal link must also leave the current PiP alive.
    ui.$('.site-nav a[aria-current="page"]').click();assert.equal(child.closed,false);assert.equal(ui.requests,1);
    for(const img of child.document.querySelectorAll('img'))assert.ok(new URL(img.src).pathname.startsWith('/ffxiv/ocean-fishing/img/'),img.src);
    for(const link of child.document.querySelectorAll('link[rel=stylesheet]'))assert.ok(fs.existsSync(path.join(root,link.href.split('/ffxiv/')[1].split('?')[0])),link.href);
    ui.setNow(first);ui.childTimers.get(child)();await ui.flush();assert.equal(ui.notices.length,1);
    assert.ok(new URL(ui.notices[0].options.icon).pathname==='/ffxiv/fishing-log/app-icon.png');
    assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
});

test('unified entry restores the last route, accepts explicit bookmarks and ignores unknown routes',async()=>{
  const values=new Map([['ocean:active-route','ruby']]);
  for(const [search,route] of [['','ruby'],['?route=indigo','indigo'],['?route=invalid','ruby']]){
    const ui=await open('',{values,search});try{assert.equal(ui.$(`[data-ocean-route="${route}"]`).getAttribute('aria-pressed'),'true');assert.ok(ui.$('#collectionStatus').textContent.includes('/ '+(route==='ruby'?119:140)+'종'));assert.deepEqual(ui.errors,[]);}finally{ui.close();}
  }
});

for(const route of ['indigo','ruby'])test(`${route}: PiP mirrors filters, stop selection, ranking and shared collection`,async()=>{
  const ui=await open(route);
  try{
    assert.equal(ui.requests,0,'opening the planner must not open PiP');assert.equal(ui.$('#openOceanPip').disabled,false);
    await ui.launch();assert.equal(ui.requests,1);assert.equal(ui.$('#openOceanPip').getAttribute('aria-pressed'),'true');
    assert.equal(ui.p('#oceanPipTitle').textContent,route==='indigo'?'근해 수첩':'원양 수첩');
    assert.equal(ui.p('#oceanPipDeparture').textContent,ui.$('#selectedTime').textContent);sameRows(ui,0,'all');
    assert.equal(ui.p('img').src.startsWith(`https://journal.test/ffxiv/ocean-fishing/`),true);
    ui.$('#openOceanPip').click();await ui.flush();assert.equal(ui.requests,1,'reuse the existing PiP window');
    ui.p('[data-pip-stop="2"]').click();assert.equal(ui.$('#stopTab2').getAttribute('aria-selected'),'true');sameRows(ui,2,'all');
    ui.p('[data-pip-zone-summary=regular]').click();assert.equal(ui.p('[data-pip-zone=regular]').open,false);sameRows(ui,2,'spectral');
    ui.$('[data-stop="1"]').click();assert.equal(ui.p('#oceanPipStop1').getAttribute('aria-selected'),'true');sameRows(ui,1,'spectral');
    ui.p('#oceanPipStop1').dispatchEvent(new ui.child.KeyboardEvent('keydown',{key:'Home',bubbles:true}));sameRows(ui,0,'spectral');
    ui.$('[name=purpose][value=score]').click();sameRows(ui,0,'spectral');assert.match(ui.p('#oceanPipPurpose').textContent,/고득점 · 700 GP/);
    assert.ok(ui.p('.recommendation'));assert.match(ui.p('.recommendation').textContent,/1순위/);
    ui.input('#strategyGP',100);assert.match(ui.p('#oceanPipPurpose').textContent,/100 GP/);
    ui.input('[data-zone="0-spectral"] [data-zone-option=scoreSort]','name');sameRows(ui,0,'spectral');
    ui.input('[data-zone="0-spectral"] [data-zone-option=bait]','Krill');sameRows(ui,0,'spectral');
    ui.$('[name=purpose][value=all]').click();ui.p('[data-pip-zone-summary=regular]').click();ui.p('[data-pip-zone-summary=spectral]').click();
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

for(const route of ['indigo','ruby'])test(`${route}: score deadline switch syncs independently and the PiP clock fires it at :14`,async()=>{
  const ui=await open(route,{alerts:true});try{
    await ui.launch();assert.equal(ui.p('#oceanPipScoreNotifications').getAttribute('aria-checked'),'false');
    assert.equal(ui.p('#oceanPipScoreNotifications').previousElementSibling.id,'oceanPipNotifications');
    assert.equal(ui.$('#oceanScoreNotifications').previousElementSibling.id,'oceanNotifications');
    ui.$('#oceanScoreNotifications').click();await ui.flush();
    assert.equal(ui.p('#oceanPipScoreNotifications').getAttribute('aria-checked'),'true');
    assert.equal(ui.p('#oceanPipNotifications').getAttribute('aria-checked'),'false');
    assert.match(ui.p('#oceanPipCompactSummary').textContent,/점수 마감 알림 ON/);
    ui.p('#oceanPipScoreNotifications').click();await ui.flush();assert.equal(ui.$('#oceanScoreNotifications').getAttribute('aria-checked'),'false');
    ui.p('#oceanPipScoreNotifications').click();await ui.flush();assert.equal(ui.$('#oceanScoreNotifications').getAttribute('aria-checked'),'true');
    ui.setNow(first);ui.childTimers.get(ui.child)();await ui.flush();assert.equal(ui.notices.length,0);
    ui.p('[data-pip-route="'+(route==='indigo'?'ruby':'indigo')+'"]').click();
    assert.equal(ui.p('#oceanPipScoreNotifications').getAttribute('aria-checked'),'true');
    ui.setNow(first+14*60000);ui.childTimers.get(ui.child)();await ui.flush();assert.equal(ui.notices.length,1);assert.match(ui.notices[0].title,/점수 마감 1분 전/);
    ui.childTimers.get(ui.child)();await ui.flush();assert.equal(ui.notices.length,1);
    ui.child.close();assert.equal(ui.$('#oceanScoreNotifications').getAttribute('aria-checked'),'true');assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
});

for(const route of ['indigo','ruby'])test(`${route}: goals can be edited in PiP without losing independent targets, filters, collections or saved preferences`,async()=>{
  let ui=await open(route);const change=(selector,value,type='change')=>{const el=ui.p(selector);el.value=value;el.dispatchEvent(new ui.child.Event(type,{bubbles:true}));};
  try{
    await ui.launch();const records=ui.storage.getItem('teo-ffxiv.fishing.collection.v2'),departure=ui.$('#selectedTime').textContent;
    assert.equal(ui.p('#oceanPipGoal').value,'collection');
    change('#oceanPipGoal','mission');assert.ok(ui.$('[name=purpose][value=mission]').checked);assert.ok(ui.p('#oceanPipGoalOptions').open);
    const groupIds=[...ui.child.document.querySelectorAll('[data-pip-group]')].slice(0,2).map(el=>el.dataset.pipGroup);assert.equal(groupIds.length,2);
    for(const id of groupIds)ui.p(`[data-pip-group="${id}"]`).click();
    assert.deepEqual([...ui.d.querySelectorAll('[name=species]:checked')].map(el=>el.value),groupIds);sameRows(ui,0,'all');
    assert.equal(ui.storage.getItem('ocean:species-groups:'+route),JSON.stringify(groupIds));
    change('#oceanPipGoal','achievement');assert.equal(ui.child.document.querySelectorAll('[data-pip-group]:checked').length,0);
    const goal=ui.p('[data-pip-group]').dataset.pipGroup;ui.p(`[data-pip-group="${goal}"]`).click();assert.equal(ui.storage.getItem('ocean:achievement-groups:'+route),JSON.stringify([goal]));
    ui.$(`[data-achievement-record="${goal}"]`).click();assert.equal(ui.p(`[data-pip-group="${goal}"]`).closest('label').querySelector('[data-pip-completed]').hidden,false);
    ui.p('[data-pip-goal-field=excludeCompletedAchievements]').click();assert.equal(ui.$('#excludeCompletedAchievements').checked,false);sameRows(ui,0,'all');
    ui.$('#excludeCompletedAchievements').click();assert.equal(ui.p('[data-pip-goal-field=excludeCompletedAchievements]').checked,true);
    change('#oceanPipGoal','mission');assert.deepEqual([...ui.child.document.querySelectorAll('[data-pip-group]:checked')].map(el=>el.dataset.pipGroup),groupIds);
    ui.$(`[name=species][value="${groupIds[1]}"]`).click();assert.equal(ui.p(`[data-pip-group="${groupIds[1]}"]`).checked,false);
    ui.$('[name=purpose][value=score]').click();assert.equal(ui.p('#oceanPipGoal').value,'score');
    const gp=ui.p('#oceanPipGP');gp.focus();change('#oceanPipGP','','input');assert.equal(ui.child.document.activeElement,gp);assert.equal(gp.value,'','clearing the input must not interrupt typing');
    change('#oceanPipGP','1200','input');assert.equal(ui.child.document.activeElement,gp);assert.equal(ui.$('#strategyGP').value,'1200');
    change('#oceanPipGP','1200');ui.p('[data-pip-goal-field=scoreMode][value=DH]').click();assert.equal(ui.$('#scoreMode').value,'DH');
    ui.p('[data-pip-goal-field=strategyPrize]').click();assert.equal(ui.$('#strategyPrize').checked,false);
    ui.p('[data-pip-goal-field=strategyObjective][value=efficiency]').click();assert.equal(ui.$('#strategyObjective').value,'efficiency');assert.equal(ui.p('#oceanPipPrize').hidden,true);sameRows(ui,0,'all');
    ui.input('#strategyGP',500);assert.equal(ui.p('#oceanPipGP').value,'500');
    assert.equal(ui.$('#selectedTime').textContent,departure);assert.equal(ui.storage.getItem('teo-ffxiv.fishing.collection.v2'),records);
    const values=ui.values;ui.close();ui=await open(route,{values});await ui.launch();
    assert.equal(ui.p('#oceanPipGoal').value,'score');assert.equal(ui.p('#oceanPipGP').value,'500');assert.equal(ui.p('[data-pip-goal-field=scoreMode][value=DH]').checked,true);
    change('#oceanPipGoal','mission');assert.equal(ui.p(`[data-pip-group="${groupIds[0]}"]`).checked,true);assert.equal(ui.p(`[data-pip-group="${groupIds[1]}"]`).checked,false);
    change('#oceanPipGoal','achievement');assert.equal(ui.p(`[data-pip-group="${goal}"]`).checked,true);assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
});
