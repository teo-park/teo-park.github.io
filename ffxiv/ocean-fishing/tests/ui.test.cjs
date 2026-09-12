const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
const C=require('../scripts/collection.js'),V=require('../scripts/voyages.js');
const Shared=require('../../fishing-collection.js').create(require('../scripts/teamcraft-ids.js'));
const achievementData=require('../data/achievements.json');
const payload=require('../data/fish.json'),root=path.resolve(__dirname,'..');
const first=Date.parse(require('./fixtures/voyages.json').firstDeparture);
const storageKey='caughtFishLS-combined';
const AchievementRecords=require('../scripts/achievement-records.js');

for(const [route,id] of [['indigo','Shark'],['ruby','Mantis']])test(`${route}: completed goals leave recommendations immediately, undo, and survive reload`,async()=>{
 const storage=memory();let ui=await open(route,storage);
 try{
  const $=selector=>ui.$(selector);
  $('[name=purpose][value=achievement]').click();$(`[name=achievementGroup][value=${id}]`).click();$(`[data-achievement-departure=${id}]`).click();
  const catches=storage.getItem('teo-ffxiv.fishing.collection.v2'),legacy=storage.getItem(storageKey);
  assert.ok($(`[data-recommended-achievement=${id}]`));
  $(`[data-achievement-complete=${id}]`).click();
  assert.ok(AchievementRecords.read(storage).has(id));assert.equal($(`[data-achievement=${id}]`),null);assert.equal($(`[data-recommended-achievement=${id}]`),null);
  assert.ok($(`[name=achievementGroup][value=${id}]`).checked,'explicit target remains selected instead of silently selecting all goals');
  assert.ok($(`[data-achievement-record=${id}]`).checked);assert.ok($('.achievement-empty-state'));
  assert.equal(ui.d.querySelectorAll('#fishPanels [data-bite-comparison]').length,0);
  assert.ok(ui.d.querySelectorAll('#fishPanels tr[data-fish-id]').length,'spectral triggers remain visible');
  $('#undoCatch').click();assert.ok($(`[data-achievement=${id}]`));assert.ok($(`[data-recommended-achievement=${id}]`));assert.equal($(`[data-achievement-record=${id}]`).checked,false);
  $(`[data-achievement-complete=${id}]`).click();$('[data-achievement-show-completed]').click();
  assert.equal($('#excludeCompletedAchievements').checked,false);assert.equal($(`[data-achievement-complete=${id}]`).getAttribute('aria-pressed'),'true');assert.match($(`[data-recommended-achievement=${id}]`).textContent,/완료/);
  ui.close();ui=await open(route,storage);
  assert.equal($('#excludeCompletedAchievements').checked,false);assert.ok($(`[data-achievement-record=${id}]`).checked);assert.ok($(`[data-achievement=${id}]`));
  $('#excludeCompletedAchievements').click();assert.equal($(`[data-achievement=${id}]`),null);
  $(`[data-achievement-record=${id}]`).click();assert.ok($(`[data-achievement=${id}]`));assert.equal(AchievementRecords.read(storage).has(id),false);
  assert.equal(storage.getItem('teo-ffxiv.fishing.collection.v2'),catches);assert.equal(storage.getItem(storageKey),legacy);assert.deepEqual(ui.errors,[]);
 }finally{ui.close();}
});
test('complete records keep both routes and synchronize completion and exclusion from another tab',async()=>{
 const storage=memory();let ui=await open('indigo',storage);
 try{
  ui.$('[data-achievement-record=Shark]').click();
  AchievementRecords.setCompleted(storage,'Mantis',true);
  ui.$('[data-achievement-record=Fugu]').click();assert.deepEqual([...AchievementRecords.read(storage)].sort(),['Fugu','Mantis','Shark']);
  ui.close();ui=await open('ruby',storage);assert.ok(ui.$('[data-achievement-record=Mantis]').checked);
  ui.$('[name=purpose][value=achievement]').click();assert.equal(ui.$('[data-achievement=Mantis]'),null);
  storage.setItem(AchievementRecords.EXCLUDE_KEY,'false');ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:AchievementRecords.EXCLUDE_KEY}));
  assert.equal(ui.$('#excludeCompletedAchievements').checked,false);assert.ok(ui.$('[data-achievement=Mantis]'));
  AchievementRecords.setCompleted(storage,'Mantis',false);ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:AchievementRecords.KEY}));
  assert.equal(ui.$('[data-achievement-record=Mantis]').checked,false);assert.deepEqual([...AchievementRecords.read(storage)].sort(),['Fugu','Shark']);assert.deepEqual(ui.errors,[]);
 }finally{ui.close();}
});
test('all completed achievements give a reversible empty state without changing missions or fish collection',async()=>{
 const storage=memory({[AchievementRecords.KEY]:JSON.stringify({version:1,completed:achievementData.goals.map(g=>g.id)})});
 const ui=await open('ruby',storage);
 try{
  assert.equal(ui.$('[data-recommended-achievement]'),null);assert.match(ui.$('#achievementRecordCount').textContent,/5 \/ 5/);
  ui.$('[name=purpose][value=mission]').click();ui.$('[name=species][value=Mantis]').click();
  const before=ui.$('#fishPanels').textContent;ui.$('#excludeCompletedAchievements').click();assert.equal(ui.$('#fishPanels').textContent,before);
  ui.$('#excludeCompletedAchievements').click();ui.$('[name=purpose][value=achievement]').click();assert.match(ui.$('.achievement-empty-state').textContent,/모두 완료/);
  assert.equal(ui.d.querySelectorAll('[data-achievement]').length,0);assert.equal(ui.d.querySelectorAll('[data-achievement-record]').length,5);
  ui.$('[data-achievement-show-completed]').click();assert.equal(ui.d.querySelectorAll('[data-achievement]').length,5);assert.deepEqual(ui.errors,[]);
 }finally{ui.close();}
});
test('failed completion writes revert controls and do not discard the previous record',async()=>{
 const storage=memory({[AchievementRecords.KEY]:JSON.stringify({version:1,completed:['Mantis']})});const ui=await open('indigo',storage);
 try{
  const original=storage.setItem;storage.setItem=(key,value)=>{if(key===AchievementRecords.KEY)throw Error('quota');original(key,value);};
  ui.$('[data-achievement-record=Shark]').click();assert.equal(ui.$('[data-achievement-record=Shark]').checked,false);assert.match(ui.$('#noticeText').textContent,/저장하지 못/);
  assert.deepEqual([...AchievementRecords.read(storage)],['Mantis']);assert.deepEqual(ui.errors,[]);
 }finally{ui.close();}
});
for(const route of ['indigo','ruby'])test(`${route}: missions and achievements retain independent selections across departure changes and reloads`,async()=>{
 const goals=achievementData.goals.filter(g=>g.route===route),a=goals[0].id,b=goals[1].id;
 const storage=memory({['ocean:purpose:'+route]:'mission',['ocean:species-groups:'+route]:JSON.stringify([a])});
 let ui=await open(route,storage);
 const checked=name=>[...ui.d.querySelectorAll(`[name=${name}]:checked`)].map(el=>el.value).sort();
 try{
  const records=storage.getItem('teo-ffxiv.fishing.collection.v2'),legacy=storage.getItem(storageKey);
  assert.equal(ui.$('[name=purpose][value=mission]').checked,true);
  assert.equal(ui.$('#speciesOptions').hidden,false);assert.equal(ui.$('#achievementOptions').hidden,true);
  assert.equal(ui.$('#achievementPlans').hidden,true);assert.equal(ui.$('#scheduleAchievementHelp').hidden,true);
  assert.equal(ui.$('.route-achievement'),null);
  assert.deepEqual(checked('species'),[a]);
  ui.$(`[name=species][value=${b}]`).click();
  assert.deepEqual(checked('species'),[a,b].sort());
  ui.$('[name=purpose][value=achievement]').click();
  assert.equal(ui.$('#speciesOptions').hidden,true);assert.equal(ui.$('#achievementOptions').hidden,false);
  assert.equal(ui.$('#achievementPlans').hidden,false);assert.equal(ui.$('#scheduleAchievementHelp').hidden,false);
  assert.deepEqual(checked('achievementGroup'),[a],'legacy selection copied once, before mission edits');
  ui.$(`[name=achievementGroup][value=${a}]`).click();
  assert.equal(ui.d.querySelectorAll('[data-achievement]').length,goals.length,'no selection shows all achievements');
  ui.$(`[name=achievementGroup][value=${b}]`).click();
  ui.$(`[data-achievement-departure=${b}]`).click();
  assert.equal(ui.d.querySelectorAll('[data-achievement]').length,1);
  assert.equal(ui.$(`[data-achievement=${b}] .achievement-status`).textContent,'추천 항로');
  assert.match(ui.$('#voyageBaits').textContent,/업적작/);
  assert.match(ui.$('#fishPanels').textContent,/업적 대상/);
  assert.doesNotMatch(ui.$('#fishPanels').textContent,/과제 대상/);
  for(const row of ui.d.querySelectorAll('#fishPanels tr[data-fish-id]')){
   const f=payload.fish.find(f=>f.id===Number(row.dataset.fishId));
   assert.ok(f.Species===b||C.alwaysVisible(f)||row.textContent.includes('조건용'),f.Fish);
  }
  ui.$('[name=purpose][value=mission]').click();
  assert.deepEqual(checked('species'),[a,b].sort(),'recommended departure does not replace mission selection');
  assert.equal(ui.$('#achievementPlans').hidden,true);
  assert.match(ui.$('#fishPanels').textContent,/과제 대상/);
  assert.doesNotMatch(ui.$('#fishPanels').textContent,/업적 대상/);
  ui.$('[name=purpose][value=achievement]').click();
  assert.deepEqual(checked('achievementGroup'),[b]);
  assert.deepEqual(ui.errors,[]);ui.close();ui=await open(route,storage);
  assert.equal(ui.$('[name=purpose][value=achievement]').checked,true);
  assert.deepEqual(checked('achievementGroup'),[b]);
  ui.$('[name=purpose][value=mission]').click();assert.deepEqual(checked('species'),[a,b].sort());
  assert.equal(storage.getItem('teo-ffxiv.fishing.collection.v2'),records);
  assert.equal(storage.getItem(storageKey),legacy);
  assert.deepEqual(ui.errors,[]);
 }finally{ui.close();}
});
test('achievement plans show scope, expand inline, retain multiple groups and jump to a recommended departure',async()=>{
 const ui=await open('ruby');
 try {
  ui.$('[name=purpose][value=achievement]').click();
  assert.equal(ui.d.querySelectorAll('[data-achievement]').length,5);
  ui.$('[name=achievementGroup][value=Mantis]').click();
  assert.equal(ui.d.querySelectorAll('[data-achievement]').length,1);
  assert.ok(ui.$('[data-achievement=Mantis]').open);assert.match(ui.$('[data-achievement=Mantis]').textContent,/개인 50마리/);
  const catches=ui.storage.getItem(storageKey);
  ui.$('[data-achievement-departure=Mantis]').click();
  assert.equal(ui.$('[data-achievement=Mantis] .achievement-status').textContent,'추천 항로');
  assert.ok(ui.$('[data-achievement=Mantis]').open);
  assert.equal(ui.storage.getItem(storageKey),catches,'planning never changes collection');
  const mantis=payload.fish.find(f=>f.Fish==='Tiger Mantis');assert.ok(ui.$(`[data-achievement-fish="${mantis.id}"]`));
  ui.$('[name=achievementGroup][value=Prehistoric]').click();
  assert.equal(ui.d.querySelectorAll('[name=achievementGroup]:checked').length,2);assert.equal(ui.d.querySelectorAll('[data-achievement]').length,2);
  ui.$('[data-achievement=Mantis]>summary').click();assert.equal(ui.$('[data-achievement=Mantis]').open,false);
  ui.$('[name=purpose][value=all]').click();assert.equal(ui.$('#achievementPlans').hidden,true);
  ui.$('[name=purpose][value=achievement]').click();assert.equal(ui.$('[data-achievement=Mantis]').open,false);
  assert.deepEqual(ui.errors,[]);
 }finally{ui.close();}
});
test('manta and fugu on a shared route display conflicting current tactics rather than promising both',async()=>{
 const ui=await open('indigo');
 try{
  ui.$('[name=purpose][value=achievement]').click();ui.$('[data-achievement-departure=Fugu]').click();
  ui.$('#scheduleToggle').click();ui.$('#moreVoyages').click();
  const target=[...ui.d.querySelectorAll('[data-voyage]')].find(b=>V.at('indigo',Number(b.dataset.voyage)).number===12);assert.ok(target);target.click();
  ui.$('[name=achievementGroup][value=Manta]').click();
  assert.match(ui.$('#achievementPlans>.achievement-caution').textContent,/로타노 해: 복어 유도 \/ 가오리 회피/);
  assert.equal(ui.$('[data-achievement=Manta] .achievement-status').textContent,'추천 항로');
  assert.doesNotMatch(ui.$('#scheduleRows').textContent,/업적작 가능/);
  assert.deepEqual(ui.errors,[]);
 }finally{ui.close();}
});
function memory(values={}) {
  const map=new Map(Object.entries(values));
  return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
}

for(const [route,goal,targetName,peerName] of [['indigo','Shark','Quicksilver Blade','Fishmonger'],['ruby','Mantis','Jade Mantis Shrimp','Mermaid Scale']])test(`${route}: achievement comparisons remain visible for collected competitors in plans and fish tables`,async()=>{
 const target=payload.fish.find(f=>f.Fish===targetName),peer=payload.fish.find(f=>f.Fish===peerName);
 const ui=await open(route,memory({[storageKey]:JSON.stringify({indigo:{},ruby:{},[route]:{[peerName]:true}})}));
 try{
  ui.$('[name=purpose][value=achievement]').click();ui.$(`[name=achievementGroup][value=${goal}]`).click();ui.$(`[data-achievement-departure=${goal}]`).click();
  const records=ui.storage.getItem('teo-ffxiv.fishing.collection.v2');
  for(const root of ['#achievementPlans','#fishPanels']){
   const comparison=ui.$(`${root} [data-bite-comparison="${target.id}"]`);assert.ok(comparison);
   const row=comparison.querySelector(`[data-bite-peer="${peer.id}"]`);assert.ok(row);assert.match(row.textContent,/시간 겹침/);assert.match(row.textContent,/초/);
   assert.equal(row.querySelector('input'),null,'comparison must not toggle collection');
  }
  ui.$('[name=purpose][value=mission]').click();assert.equal(ui.$('#fishPanels [data-bite-comparison]'),null);
  ui.$('[name=purpose][value=achievement]').click();assert.ok(ui.$(`#fishPanels [data-bite-comparison="${target.id}"]`));
  assert.equal(ui.storage.getItem('teo-ffxiv.fishing.collection.v2'),records);assert.deepEqual(ui.errors,[]);
 }finally{ui.close();}
});
for(const [route,targetName,requiredName,peerName] of [
 ['indigo','Drunkfish','Galadion Chovy','Galadion Goby'],
 ['indigo','Great Grandmarlin','Hi-aetherlouse','Charlatan Survivor'],
 ['ruby','Dusk Shark',"Poet's Pipe",'Pink Shrimp']
])test(`${route}: ${requiredName} compares hidden caught competitors while preparing ${targetName}`,async()=>{
 const find=name=>payload.fish.find(f=>f.Fish===name);
 const target=find(targetName),required=find(requiredName),peer=find(peerName);
 const caught=Object.fromEntries(payload.fish.filter(f=>f.route===route).map(f=>[C.name(f.Fish),true]));caught[C.name(targetName)]=false;
 const storage=memory({[storageKey]:JSON.stringify({indigo:{},ruby:{},[route]:caught})});let ui=await open(route,storage);
 const comparison=()=>ui.$(`#fishPanels [data-bite-comparison="${required.id}"]`);
 const check=()=>{
  const row=ui.$(`#fishPanels tr[data-fish-id="${required.id}"]`);assert.ok(row.classList.contains('is-caught'));assert.match(row.textContent,/조건용/);
  assert.equal(row.nextElementSibling.querySelector('[data-bite-comparison]'),comparison(),'comparison belongs directly below its prerequisite');
  const competitor=comparison().querySelector(`[data-bite-peer="${peer.id}"]`);assert.ok(competitor);assert.match(competitor.textContent,/시간 겹침/);
  assert.equal(competitor.querySelector('input'),null);assert.doesNotMatch(comparison().textContent,/업적 대상/,'unrelated prerequisites must not label peers as achievement targets');
 };
 try{
  check();assert.equal(ui.$(`#fishPanels tr[data-fish-id="${peer.id}"]`),null,'caught competitor is absent from the filtered fish table');
  assert.equal(ui.$(`#fishPanels [data-bite-comparison="${target.id}"]`),null,'ordinary targets do not expand the whole fish list');
  const records=storage.getItem('teo-ffxiv.fishing.collection.v2'),baits=ui.$('#voyageBaits').textContent;
  for(const mode of ['all','score','collection']){ui.$(`[name=purpose][value=${mode}]`).click();check();}
  assert.equal(storage.getItem('teo-ffxiv.fishing.collection.v2'),records);assert.equal(ui.$('#voyageBaits').textContent,baits);
  ui.$(`[data-fish-id="${target.id}"] input[data-entry]`).click();assert.equal(comparison(),null,'comparison leaves once its last unfinished target is caught');
  ui.$('#undoCatch').click();check();
  ui.close();ui=await open(route,storage);check();assert.deepEqual(ui.errors,[]);
 }finally{ui.close();}
});

test('mission and achievement prerequisites compare fish outside the selected group within the current departure',async()=>{
 const target=payload.fish.find(f=>f.Fish==='Aetheric Seadragon'),required=payload.fish.find(f=>f.Fish==='Hi-aetherlouse');
 const ui=await open('indigo');
 try{
  ui.$('[name=purpose][value=mission]').click();ui.$('[name=species][value=Seadragon]').click();ui.$('#scheduleToggle').click();
  const departure=[...ui.d.querySelectorAll('[data-voyage]')].find(el=>{
   const v=V.at('indigo',Number(el.dataset.voyage));return v.stops.some((s,i)=>V.available(target,v,i));
  });assert.ok(departure);departure.click();
  const comparison=()=>ui.$(`#fishPanels [data-bite-comparison="${required.id}"]`);
  assert.ok(comparison());const peers=[...comparison().querySelectorAll('[data-bite-peer]')];assert.ok(peers.length);
  const voyage=V.at('indigo',Number(departure.dataset.voyage));
  for(const el of peers){
   const peer=payload.fish.find(f=>f.id===+el.dataset.bitePeer);
   assert.equal(peer.Stop,required.Stop);assert.equal(peer.spectral,required.spectral);assert.equal(peer.Bite,required.Bite);
   assert.ok(voyage.stops.some((s,i)=>V.available(peer,voyage,i)));assert.equal(ui.$(`#fishPanels tr[data-fish-id="${peer.id}"]`),null);
  }
  assert.doesNotMatch(comparison().textContent,/업적 대상/);
  ui.$('[name=purpose][value=achievement]').click();ui.$('[name=achievementGroup][value=Seadragon]').click();assert.ok(comparison());
  assert.doesNotMatch(comparison().textContent,/업적 대상/);assert.deepEqual(ui.errors,[]);
 }finally{ui.close();}
});

test('voyage supplies react to collection changes, undo and imports without losing caught prerequisites',async()=>{
 const caught=Object.fromEntries(payload.fish.filter(f=>f.route==='indigo').map(f=>[C.name(f.Fish),true]));caught.Sothis=false;
 const ui=await open('indigo',memory({[storageKey]:JSON.stringify({indigo:caught,ruby:{}})}));
 try {
  const glow=()=>ui.$('#voyageBaits [data-bait-group="recommended"] [data-bait="glowworm"]');
  assert.ok(glow());assert.match(ui.$('#voyageBaits').textContent,/도감 채우기/);
  assert.ok(ui.$('#voyageBaits [data-bait="krill"]'));assert.ok(ui.$('#voyageBaits [data-bait="ragworm"]'));
  const before=ui.$('#voyageBaits').textContent;ui.$('[data-stop="2"]').click();assert.equal(ui.$('#voyageBaits').textContent,before);
  const sothis=payload.fish.find(f=>f.Fish==='Sothis');ui.$(`[data-fish-id="${sothis.id}"] input[data-entry]`).click();assert.equal(glow(),null);
  ui.$('#undoCatch').click();assert.ok(glow());ui.submit(JSON.stringify([sothis.id]));assert.equal(glow(),null);
  assert.ok(ui.$('#voyageBaits [data-bait-group="recommended"] .bait-chip'));assert.deepEqual(ui.errors,[]);
 }finally{ui.close();}
});
for(const route of ['indigo','ruby'])test(`${route}: supplies cover all three stops and follow purpose, GP and departure`,async()=>{
 const ui=await open(route);
 try {
  const check=()=>{
   const start=Number(ui.$('[data-voyage][aria-pressed="true"]').dataset.voyage),v=V.at(route,start);
   const rows=payload.fish.filter(f=>f.route===route&&v.stops.some((_,i)=>V.available(f,v,i)));
   const expected=new Set(rows.filter(f=>f.BaitAny!=='Yes'&&!/^M!/.test(f.BestBait)).map(f=>C.key(f.BestBait)));
   const shown=new Set([...ui.d.querySelectorAll('#voyageBaits [data-bait-group="recommended"] [data-bait]')].map(b=>b.dataset.bait));assert.deepEqual(shown,expected);
  };
  ui.$('[name=purpose][value=all]').click();check();ui.$('#scheduleToggle').click();ui.d.querySelectorAll('[data-voyage]')[5].click();check();
  ui.$('[name=purpose][value=score]').click();assert.ok(ui.$('#voyageBaits .bait-chip-score'));ui.input('#strategyGP','399');assert.equal(ui.$('#voyageBaits .bait-chip-score'),null);check();
  ui.$('[name=purpose][value=mission]').click();assert.equal(ui.$('#voyageBaits [data-bait-group="mooch"]'),null);
  ui.d.querySelectorAll('[name=species]')[0].click();ui.d.querySelectorAll('[name=species]')[1].click();assert.match(ui.$('#voyageBaits').textContent,/선상과제/);
  const rows=[...ui.d.querySelectorAll('#fishPanels tr[data-fish-id]')].map(el=>payload.fish.find(f=>f.id===+el.dataset.fishId));
  for(const f of rows.filter(f=>!/^M!/.test(f.BestBait)&&f.BaitAny!=='Yes'))assert.ok(ui.$(`#voyageBaits [data-bait="${C.key(f.BestBait)}"]`),f.Fish);
  assert.deepEqual(ui.errors,[]);
 }finally{ui.close();}
});
async function open(page,storage=memory(),failData=false) {
  const errors=[],requests=[],downloads=[],console=new VirtualConsole();
  console.on('jsdomError',e=>errors.push(e.message));
  console.on('error',(...args)=>errors.push(args.map(String).join(' ')));
  class LocalScripts extends ResourceLoader {
    fetch(url) {
      const parsed=new URL(url);assert.equal(parsed.origin,'https://journal.test');
      if(parsed.pathname.endsWith('.css'))return null;
      if(parsed.pathname==='/ffxiv/select-options.js')return Promise.resolve(fs.readFileSync(path.join(root,'../select-options.js')));
      if(parsed.pathname==='/ffxiv/navigation.js')return Promise.resolve(fs.readFileSync(path.join(root,'../navigation.js')));
      if(parsed.pathname==='/ffxiv/fishing-collection.js'){requests.push('fishing-collection.js');return Promise.resolve(fs.readFileSync(path.join(root,'../fishing-collection.js')));}
      const relative=parsed.pathname.replace('/ffxiv/ocean-fishing/','');
      assert.match(relative,/^scripts\/[a-z-]+\.js$/);requests.push(relative);
      return Promise.resolve(fs.readFileSync(path.join(root,relative)));
    }
  }
  const dom=new JSDOM(fs.readFileSync(path.join(root,page,'index.html'),'utf8'),{
    url:`https://journal.test/ffxiv/ocean-fishing/${page}/`,resources:new LocalScripts(),runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:console,
    beforeParse(w) {
      Object.defineProperty(w,'localStorage',{value:storage});
      Object.defineProperty(w,'sessionStorage',{get(){throw Error('Session storage is unavailable');}});
      w.Date.now=()=>first-60000;w.scrollTo=()=>{};
      w.fetch=async url=>{assert.ok(['fish','achievements'].some(name=>url==='../data/'+name+'.json?v='+w.document.body.dataset.version));return {ok:!failData,status:failData?503:200,json:async()=>JSON.parse(JSON.stringify(url.includes('achievements.json')?achievementData:payload))};};
      w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
      w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
      w.Blob=Blob;w.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test';};w.URL.revokeObjectURL=()=>{};
      w.HTMLAnchorElement.prototype.click=function(){assert.match(this.download,/\.json$/);};
    }
  });
  const w=dom.window,d=w.document,$=s=>d.querySelector(s);
  for(let i=0;i<100;i++) {if(!$('#appContent').hidden||!$('#retryLoad').hidden)break;await new Promise(r=>setTimeout(r,20));}
  assert.equal(failData?$('#retryLoad').hidden:$('#appContent').hidden,false);
  const input=(selector,value,type='input')=>{const el=$(selector);if(el.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new w.Event(type,{bubbles:true}));};
  const submit=value=>{input('#importText',value);$('#pasteImport').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));};
  return {w,d,$,input,submit,storage,downloads,errors,requests,close:()=>w.close()};
}
for(const route of ['indigo','ruby'])test(`${route}: score view defaults to ranked community strategy and keeps all fish and preferences`,async()=>{
  const storage=memory({'ocean:strategy':JSON.stringify({gp:900,objective:'efficiency'})});
  let ui=await open(route,storage);
  try{
    ui.$('[name=purpose][value=all]').click();
    ui.input('[data-zone="0-regular"] [data-zone-option="sort"]','name','change');
    const ids=()=>[...ui.d.querySelectorAll('#fishPanels tr[data-fish-id]')].map(el=>el.dataset.fishId).sort();
    const all=ids();
    ui.$('[name=purpose][value=score]').click();
    assert.equal(ui.$('#strategyObjective').value,'community');assert.equal(ui.$('#strategyGP').value,'900');
    assert.equal(ui.$('#scoreGuide').hidden,false);assert.deepEqual(ids(),all);
    assert.equal(ui.$('[data-zone="0-regular"] [data-zone-option="scoreSort"]').value,'recommendation');
    for(const zone of ui.d.querySelectorAll('.fishing-zone')){
      const tags=[...zone.querySelectorAll('tbody .recommendation')];
      const ranks=tags.map(t=>+(t.textContent.match(/(\d+)순위/)?.[1]||Infinity));
      assert.deepEqual(ranks,[...ranks].sort((a,b)=>a-b),zone.dataset.zone);
      assert.equal(ranks[0],1,zone.dataset.zone);
    }
    assert.match(ui.$('.spectral .target-details').textContent,/한결같은 챔질/);
    assert.match(ui.$('.spectral .recommendation').textContent,/대물/);
    ui.input('#strategyPrize',false,'change');
    for(const tag of ui.d.querySelectorAll('.spectral .recommendation'))assert.doesNotMatch(tag.textContent,/대물/);
    ui.input('#strategyObjective','efficiency','change');
    assert.equal(ui.$('#strategyPrize').closest('label').hidden,true);
    ui.$('[name=purpose][value=all]').click();
    assert.equal(ui.$('#scoreGuide').hidden,true);
    assert.equal(ui.$('[data-zone="0-regular"] [data-zone-option="sort"]').value,'name');
    assert.deepEqual(ids(),all);assert.deepEqual(ui.errors,[]);
    ui.close();ui=await open(route,storage);
    ui.$('[name=purpose][value=score]').click();
    assert.equal(ui.$('#strategyObjective').value,'efficiency');assert.equal(ui.$('#strategyPrize').checked,false);
    assert.equal(ui.$('#strategyGP').value,'900');assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
});
for(const route of ['indigo','ruby'])test(`${route}: native route UI, expanded departures, missions, GP and catch undo`,async()=>{
  const ui=await open(route);const {$,d,input,errors,requests}=ui;
  try {
    assert.deepEqual(requests,['scripts/teamcraft-ids.js','fishing-collection.js','scripts/collection.js','scripts/voyages.js','scripts/achievements.js','scripts/achievement-records.js','scripts/app.js']);
    for(const global of ['$','jQuery','bootstrap','moment'])assert.equal(ui.w[global],undefined);
    assert.equal(d.querySelectorAll('#scheduleRows tr:not([hidden])').length,1);
    const firstFishCell=()=>$('#scheduleRows tr:first-child .schedule-fish');
    const expected=route==='indigo'?['소티스','바위비늘','만취어','꼬마 리바이어선','바다판금장화']:['지옥뚜껑게','어스름상어','매듭고기','천궁호랑이'];
    for(const name of expected)assert.ok(firstFishCell().textContent.includes(name),name);
    assert.equal(firstFishCell().querySelectorAll('[data-schedule-fish]').length,2);
    assert.ok(!firstFishCell().textContent.includes(route==='indigo'?'산호가오리':'청옥룡'),'legendary fish from another time of day must not appear');
    const regular=payload.fish.find(f=>f.Fish===(route==='indigo'?'Drunkfish':'Dusk Shark'));
    $(`[data-fish-id="${regular.id}"] input[data-entry]`).click();assert.ok(firstFishCell().textContent.includes(regular.FishTranslated+' (수집완료)'));
    $('#undoCatch').click();assert.ok(!firstFishCell().textContent.includes('(수집완료)'));
    $('#scheduleToggle').click();assert.equal(d.querySelectorAll('#scheduleRows tr:not([hidden])').length,12);
    $('#moreVoyages').click();assert.equal(d.querySelectorAll('[data-voyage]').length,24);
    d.querySelectorAll('[data-voyage]')[3].click();$('#scheduleToggle').click();
    assert.equal(d.querySelectorAll('#scheduleRows tr:not([hidden])').length,1);assert.equal($('#returnFirst').hidden,false);
    $('#returnFirst').click();assert.equal($('#returnFirst').hidden,true);
    $('[name=purpose][value=score]').click();assert.equal(d.querySelectorAll('.score-table').length,6);assert.ok($('.score-emphasis'));
    input('#strategyGP','399');assert.equal($('.score-emphasis'),null);
    input('#strategyGP','400');for(const td of d.querySelectorAll('.score-emphasis'))assert.equal(td.cellIndex,4);
    $('[name=purpose][value=mission]').click();const group=$('[name=species]');group.focus();group.click();
    assert.equal(d.activeElement,group);d.querySelectorAll('[name=species]')[1].click();assert.equal(d.querySelectorAll('[name=species]:checked').length,2);
    $('[name=purpose][value=all]').click();assert.equal($('#hideCompleted').closest('label').hidden,true);
    const firstFish=$('.collection-check');firstFish.click();assert.ok($('.is-caught'));$('#undoCatch').click();assert.equal($('.is-caught'),null);
    assert.deepEqual(errors,[]);
  }finally{ui.close();}
});
test('caught prerequisites and ghost baits survive collection and additional filters',async()=>{
  const caught=Object.fromEntries(payload.fish.filter(f=>f.route==='indigo').map(f=>[C.name(f.Fish),true]));
  caught['Little Leviathan']=false;caught.Sothis=false;
  const ui=await open('indigo',memory({[storageKey]:JSON.stringify({indigo:caught,ruby:{}})}));
  try {
    const ids=()=>new Set([...ui.d.querySelectorAll('[data-fish-id]')].map(el=>+el.dataset.fishId));
    const f=name=>payload.fish.find(f=>C.key(f.Fish)===C.key(name));
    for(const name of ['Little Leviathan','Gladius','Ghoul Barracuda','Sothis',"Heaven's Key","Navigator's Print"])assert.ok(ids().has(f(name).id),name);
    ui.$('[data-zone="0-spectral"] [data-zone-option="fabled"]').click();
    for(const name of ['Sothis',"Heaven's Key","Navigator's Print"])assert.ok(ids().has(f(name).id),name);
    ui.$('[data-stop="1"]').click();
    ui.input('[data-zone="1-regular"] [data-zone-option="bait"]','PlumpWorm','change');
    for(const name of ['Little Leviathan','Gladius','Ghoul Barracuda'])assert.ok(ids().has(f(name).id),name);
    const voyage=V.at('indigo',first);
    for(const ghost of payload.fish.filter(f=>f.route==='indigo'&&C.alwaysVisible(f)&&voyage.stops.some((_,i)=>V.available(f,voyage,i))))assert.ok(ids().has(ghost.id));
    assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
});

test('ruby spectral triggers stay visible with caught, mission, fabled and bait filters',async()=>{
  const allCaught=Object.fromEntries(payload.fish.filter(f=>f.route==='ruby').map(f=>[C.name(f.Fish),true]));
  const ui=await open('ruby',memory({[storageKey]:JSON.stringify({indigo:{},ruby:allCaught})}));
  try{
    const targets=payload.fish.filter(f=>['환해 놀래기','환해 구렁이','환해 골설어'].includes(f.FishTranslated));assert.equal(targets.length,3);
    const voyages=Array.from({length:12},(_,i)=>V.at('ruby',first+i*7200000)),seen=new Set();
    const river=voyages.find(v=>v.stops.some(stop=>stop.stop==='One River'));assert.ok(river);
    ui.$('#scheduleToggle').click();
    for(const voyage of [voyages[0],river]){
      ui.$(`[data-voyage="${voyage.start}"]`).click();
      const check=()=>{for(const fish of targets.filter(f=>voyage.stops.some(stop=>stop.stop===f.Stop))){const row=ui.$(`[data-fish-id="${fish.id}"]`);assert.ok(row,fish.FishTranslated);assert.match(row.textContent,/항상 표시/);assert.match(row.textContent,/크릴/);seen.add(fish.id);}};
      ui.$('[name=purpose][value=collection]').click();check();ui.$('[name=purpose][value=mission]').click();if(!ui.$('[name=species]').checked)ui.$('[name=species]').click();check();
      for(let stop=0;stop<3;stop++){
        ui.$(`[data-stop="${stop}"]`).click();
        const fabled=ui.$(`[data-zone="${stop}-regular"] [data-zone-option="fabled"]`);if(!fabled.checked)fabled.click();
        ui.input(`[data-zone="${stop}-regular"] [data-zone-option="bait"]`,'PlumpWorm','change');check();
      }
    }
    assert.equal(seen.size,3);
    assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
});
test('legacy names, pasted imports, file imports, downloads and Teamcraft share persistent records',async()=>{
  const storage=memory({[storageKey]:JSON.stringify({indigo:{'Galadion Chovy|legacy|bait':true},ruby:{}})});
  const ui=await open('checklist',storage);
  try {
    assert.match(ui.$('#checklistCount').textContent,/1 \/ 140/);
    ui.$('#openRecords').click();assert.equal(ui.$('#recordsDialog').open,true);
    ui.submit(JSON.stringify({indigo:{'Galadion Chovy':false,Gladius:true},ruby:{'Poets Pipe':false}}));
    assert.equal(C.caught(Shared.readOcean(storage),'indigo','Galadion Chovy'),true);assert.equal(C.caught(Shared.readOcean(storage),'indigo','Gladius'),true);
    const ruby=payload.fish.find(f=>f.route==='ruby');
    ui.submit(JSON.stringify([ruby.id,ruby.id,1]));assert.match(ui.$('#recordMessage').textContent,/1종 추가/);assert.match(ui.$('#recordMessage').textContent,/중복 1개/);
    const before=storage.getItem(storageKey);ui.submit('{broken');assert.equal(storage.getItem(storageKey),before);assert.match(ui.$('#recordMessage').textContent,/가져오지 못/);
    ui.submit('["not a number"]');assert.equal(storage.getItem(storageKey),before);
    const file=ui.$('#importFile');Object.defineProperty(file,'files',{value:[{size:90,text:async()=>JSON.stringify({ruby:{'Dusk Shark':true}})}]});
    file.dispatchEvent(new ui.w.Event('change'));await new Promise(r=>setTimeout(r,20));assert.equal(C.caught(Shared.readOcean(storage),'ruby','Dusk Shark'),true);
    ui.$('#exportRecords').click();assert.deepEqual(JSON.parse(await ui.downloads[0].text()),Shared.readOcean(storage));
    ui.$('#copyTeamcraft').click();await new Promise(r=>setTimeout(r,10));
    const completed=JSON.parse(ui.$('#teamcraftOutput').value).completed;assert.ok(completed.includes(ruby.id));assert.ok(completed.includes(payload.fish.find(f=>f.Fish==='Gladius').id));
    assert.equal(ui.$('#teamcraftFallback').hidden,false);
    ui.$('#closeRecords').click();assert.equal(ui.d.activeElement,ui.$('#openRecords'));
    assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
  for(const route of ['indigo','ruby']){
    const ui=await open(route,storage);
    try{assert.ok(Number(ui.$('#collectionCount').textContent)>0);assert.equal(Number(ui.$('#collectionCount').textContent),new Set(payload.fish.filter(f=>f.route===route&&C.caught(Shared.readOcean(storage),route,f.Fish)).map(f=>f.id)).size);}
    finally{ui.close();}
  }
});
test('checklist live initials, collapsed sections, external storage changes and loading errors',async()=>{
  const storage=memory(),ui=await open('checklist',storage);
  try{
    ui.$('.checklist-group[open]>summary').click();ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:storageKey}));assert.equal(ui.$('.checklist-group[open]'),null);
    ui.input('#checklistSearch','ㄱㄹㄷㅇㅅ');assert.match(ui.$('#checklistResults').textContent,/1종/);assert.match(ui.$('.fish-check').getAttribute('aria-label'),/글라디우스/);
    ui.$('.fish-check').click();assert.equal(C.caught(Shared.readOcean(storage),'indigo','Gladius'),true);
    ui.$('#checklistUncaught').click();assert.match(ui.$('#checklistResults').textContent,/0종/);
    ui.$('#undoCatch').click();assert.match(ui.$('#checklistResults').textContent,/1종/);
    ui.$('#clearSearch').click();ui.$('[data-check-route=ruby]').click();assert.match(ui.$('#checklistCount').textContent,/119/);
    C.setCaught(storage,'ruby',payload.fish.find(f=>f.route==='ruby').Fish,true);ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:storageKey}));assert.match(ui.$('#checklistCount').textContent,/1 \/ 119/);
    assert.deepEqual(ui.errors,[]);
  }finally{ui.close();}
  const before=storage.getItem(storageKey),failed=await open('indigo',storage,true);
  try{assert.match(failed.$('#loading').textContent,/저장한 수집 기록은 유지/);assert.equal(storage.getItem(storageKey),before);assert.equal(failed.errors.length,1);}
  finally{failed.close();}
});
