const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
const C=require('../scripts/collection.js'),V=require('../scripts/voyages.js');
const Shared=require('../../fishing-collection.js').create(require('../scripts/teamcraft-ids.js'));
const payload=require('../data/fish.json'),root=path.resolve(__dirname,'..');
const first=Date.parse(require('./fixtures/voyages.json').firstDeparture);
const storageKey='caughtFishLS-combined';
function memory(values={}) {
  const map=new Map(Object.entries(values));
  return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
}
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
  ui.d.querySelectorAll('[name=species]')[0].click();ui.d.querySelectorAll('[name=species]')[1].click();assert.match(ui.$('#voyageBaits').textContent,/선상과제\/업적/);
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
      w.fetch=async url=>{assert.equal(url,'../data/fish.json?v='+w.document.body.dataset.version);return {ok:!failData,status:failData?503:200,json:async()=>JSON.parse(JSON.stringify(payload))};};
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
for(const route of ['indigo','ruby'])test(`${route}: native route UI, expanded departures, missions, GP and catch undo`,async()=>{
  const ui=await open(route);const {$,d,input,errors,requests}=ui;
  try {
    assert.deepEqual(requests,['scripts/teamcraft-ids.js','fishing-collection.js','scripts/collection.js','scripts/voyages.js','scripts/app.js']);
    for(const global of ['$','jQuery','bootstrap','moment'])assert.equal(ui.w[global],undefined);
    assert.equal(d.querySelectorAll('#scheduleRows tr:not([hidden])').length,1);
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
