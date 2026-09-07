const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM}=require('jsdom'),E=require('../engine.js');
const root=path.resolve(__dirname,'..'),context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),context);
const D=JSON.parse(JSON.stringify(context.window.MINION_DATA)),KEY='teo-ffxiv.minions.collection.v1';
const memory=initial=>{const values=new Map(Object.entries(initial||{}));return{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};};
function open(storage=memory()){
  const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'https://example.com/ffxiv/minions/',runScripts:'outside-only'}),w=dom.window,d=w.document,downloads=[];
  Object.defineProperty(w,'localStorage',{value:storage});w.HTMLElement.prototype.scrollIntoView=function(){};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  w.Blob=Blob;w.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};
  let scanApply;w.MinionScanUI={mount:({apply})=>{scanApply=apply;}};
  for(const file of ['data.js','engine.js','app.js'])w.eval(fs.readFileSync(path.join(root,file),'utf8'));
  const $=selector=>d.querySelector(selector),change=(selector,value,event='change')=>{const el=$(selector);if(el.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new w.Event(event,{bubbles:true}));};
  assert.equal($('#appContent').hidden,false);
  return{w,d,$,change,storage,downloads,scanApply,close:()=>w.close()};
}
test('catalog covers all Korean names, valid source links, unique IDs and explicit unknown sources',()=>{
  assert.equal(D.count,D.minions.length);assert.equal(new Set(D.minions.map(m=>m.id)).size,D.count);assert.ok(D.count>500);assert.ok(D.officialCount>500);
  assert.equal(D.sourceCount,D.minions.reduce((n,m)=>n+m.sources.length,0));
  for(const m of D.minions){assert.match(m.name,/[가-힣]/);assert.match(m.official,/^https:\/\/guide.ff14.co.kr\//);assert.ok(Number.isInteger(m.order));assert.match(m.icon,/^https:\/\/v2.xivapi.com\//);for(const s of m.sources)assert.ok(s.typeName&&s.name&&s.original);}
  assert.ok(D.minions.some(m=>m.sources.length===0));
});
test('name, initials, acquisition and combinable filters',()=>{
  const fat=D.minions.find(m=>m.name==='뚱냥이');assert.ok(fat);
  for(const text of ['뚱 냥 이','ㄸㄴㅇ','fat cat','집사 수행'])assert.ok(E.matches(fat,text),text);
  assert.equal(E.filter(D.minions,new Set([fat.id]),{query:'ㄸㄴㅇ',status:'owned',source:'Venture',expansion:'2',tradeable:true}).length,1);
  assert.equal(E.filter(D.minions,new Set([fat.id]),{query:'ㄸㄴㅇ',status:'unowned'}).length,0);
  for(const m of E.filter(D.minions,new Set(),{excludeSpecial:true}))assert.ok(m.sources.some(s=>!['Premium','Event'].includes(s.type)));
  assert.ok(E.filter(D.minions,new Set(),{source:'unknown'}).every(m=>m.sources.length===0));
});
test('backup validates type and all IDs before allowing import; future IDs survive',()=>{
  assert.deepEqual(E.parseBackup(E.backup(new Set([1,5,99999]))),new Set([1,5,99999]));
  for(const bad of ['{broken','[1,2]',JSON.stringify({type:'ffxiv-triple-triad',schemaVersion:1,collected:[1]}),JSON.stringify({type:'ffxiv-minions',schemaVersion:1,collected:[1,'2']}),JSON.stringify({type:'ffxiv-minions',schemaVersion:1,collected:[0]})])assert.throws(()=>E.parseBackup(bad));
});
test('rapid icon checks persist without moving tiles; undo restores just the last change',()=>{
  const ui=open();try{
    const before=[...ui.d.querySelectorAll('[data-id]')].map(e=>e.dataset.id),buttons=ui.d.querySelectorAll('.collect-button'),first=+buttons[0].dataset.collect,second=+buttons[1].dataset.collect;
    buttons[0].click();buttons[1].click();assert.equal(ui.$('#ownedCount').textContent,'2');assert.equal(ui.$('.collect-button').getAttribute('aria-pressed'),'true');
    assert.deepEqual([...ui.d.querySelectorAll('[data-id]')].map(e=>e.dataset.id),before);
    ui.$('#undo').click();assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set([first]));assert.equal(ui.$(`[data-collect="${second}"]`).getAttribute('aria-pressed'),'false');
    ui.$('#undo').click();assert.equal(ui.$('#ownedCount').textContent,'0');
  }finally{ui.close();}
});

test('30-item pages retain game order without omissions or duplicates through the final page',()=>{
  const ui=open();try{
    const expected=E.sort(D.minions,'game').map(m=>m.id),seen=[];
    for(let page=1;page<=Math.ceil(expected.length/30);page++){
      const ids=[...ui.d.querySelectorAll('.collect-button')].map(e=>+e.dataset.collect);
      assert.deepEqual(ids,expected.slice((page-1)*30,page*30));seen.push(...ids);
      const next=ui.$('#pagination [aria-label="다음 페이지"]');
      assert.equal(next.disabled,page===Math.ceil(expected.length/30));
      if(!next.disabled)next.click();
    }
    assert.deepEqual(seen,expected);
    ui.$('#pagination [data-page="1"]').click();
    assert.equal(+ui.$('.collect-button').dataset.collect,expected[0]);
  }finally{ui.close();}
});
test('unowned filter keeps checked tiles until explicitly refreshed, and page bulk action is scoped',()=>{
  const ui=open();try{
    ui.change('#status','unowned');const id=+ui.$('.collect-button').dataset.collect;
    ui.$('.collect-button').click();assert.ok(ui.$(`[data-id="${id}"]`));assert.equal(ui.$('#refreshResults').hidden,false);
    ui.$('#refreshResults').click();assert.equal(ui.$(`[data-id="${id}"]`),null);
    const visible=[...ui.d.querySelectorAll('.collect-button')].map(e=>+e.dataset.collect);
    ui.$('#markPage').click();const saved=E.parseBackup(ui.storage.getItem(KEY));assert.equal(saved.size,31);for(const id of visible)assert.ok(saved.has(id));
    ui.$('#undo').click();assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set([id]));
  }finally{ui.close();}
});
test('search includes the last composing consonant; resetting filters restores the first 30 minions',()=>{
  const ui=open();try{
    const el=ui.$('#search');el.dispatchEvent(new ui.w.CompositionEvent('compositionstart',{bubbles:true}));
    ui.change('#search','ㄸㄴㅇ','input');assert.match(ui.$('#minionGrid').textContent,/뚱냥이/);assert.equal(ui.d.querySelectorAll('.minion-tile').length,1);
    ui.$('#clearSearch').click();assert.equal(ui.d.querySelectorAll('.minion-tile').length,30);assert.equal(ui.$('#pagination').hidden,false);
    ui.change('#search','ㄸㄴㅇ','input');ui.change('#source','Venture');ui.change('#tradeable',true);ui.$('#resetFilters').click();assert.equal(ui.$('#search').value,'');assert.equal(ui.$('#source').value,'all');assert.equal(ui.$('#tradeable').checked,false);assert.equal(ui.d.querySelectorAll('.minion-tile').length,30);
  }finally{ui.close();}
});
test('detail dialog and grid share collection status and show every acquisition route',()=>{
  const ui=open();try{
    ui.change('#search','뚱냥이','input');const m=D.minions.find(m=>m.name==='뚱냥이');ui.$('[data-detail]').click();
    assert.equal(ui.$('#detailDialog').open,true);assert.equal(ui.d.querySelectorAll('.detail-sources li').length,m.sources.length);
    ui.$('#detailBody [data-collect]').click();assert.equal(ui.$('.collect-button').getAttribute('aria-pressed'),'true');assert.match(ui.$('.detail-check').textContent,/보유 중/);
    ui.$('#closeDetail').click();ui.change('#source','unknown');ui.change('#search','','input');ui.$('[data-detail]').click();assert.match(ui.$('#detailBody').textContent,/획득처 확인 중/);
  }finally{ui.close();}
});
test('write failures and malformed existing storage never discard a collection',()=>{
  const first=D.minions[0].id,storage=memory({[KEY]:E.backup(new Set([first]))}),ui=open(storage);
  try{const old=storage.getItem(KEY);storage.setItem=()=>{throw Error('quota');};ui.$('.collect-button').click();assert.equal(ui.$('#ownedCount').textContent,'1');assert.equal(storage.getItem(KEY),old);assert.match(ui.$('#noticeText').textContent,/저장하지 못/);}finally{ui.close();}
  const corrupted=memory({[KEY]:'{broken'}),bad=open(corrupted);try{bad.$('.collect-button').click();assert.equal(corrupted.getItem(KEY),'{broken');assert.equal(bad.$('#fatal').hidden,false);}finally{bad.close();}
});
test('imports merge, retain unknown IDs, reject other trackers and exports round trip',async()=>{
  const first=D.minions[0].id,second=D.minions[1].id,storage=memory({[KEY]:E.backup(new Set([first,99999]))}),ui=open(storage);
  try{
    const file=ui.$('#importFile');Object.defineProperty(file,'files',{configurable:true,value:[{size:100,text:async()=>E.backup(new Set([second]))}]});
    file.dispatchEvent(new ui.w.Event('change'));await new Promise(resolve=>setTimeout(resolve,0));assert.deepEqual(E.parseBackup(storage.getItem(KEY)),new Set([first,second,99999]));
    const before=storage.getItem(KEY);Object.defineProperty(file,'files',{value:[{size:100,text:async()=>'[1,2]'}]});file.dispatchEvent(new ui.w.Event('change'));await new Promise(resolve=>setTimeout(resolve,0));assert.equal(storage.getItem(KEY),before);
    ui.$('#exportRecords').click();assert.deepEqual(E.parseBackup(await ui.downloads[0].text()),new Set([first,second,99999]));
  }finally{ui.close();}
});
test('other-tab edits update tiles and are preserved by subsequent checks',()=>{
  const ui=open();try{
    const first=D.minions[0].id,other=D.minions[140].id;ui.storage.setItem(KEY,E.backup(new Set([other])));
    ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:KEY}));assert.equal(ui.$('#ownedCount').textContent,'1');
    ui.$('.collect-button').click();assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set([first,other]));
  }finally{ui.close();}
});

test('screenshot registration only adds known IDs, preserves previous and future IDs, and supports undo',()=>{
  const first=D.minions[0].id,second=D.minions[31].id,third=D.minions[70].id,storage=memory({[KEY]:E.backup(new Set([first,99999]))}),ui=open(storage);
  try{
    storage.setItem(KEY,E.backup(new Set([first,third,99999])));
    assert.equal(ui.scanApply([first,second,second]).ok,true);
    assert.deepEqual(E.parseBackup(storage.getItem(KEY)),new Set([first,second,third,99999]));
    ui.$('#undo').click();assert.deepEqual(E.parseBackup(storage.getItem(KEY)),new Set([first,third,99999]));
    for(const bad of [[],[99999],[String(first)],null])assert.equal(ui.scanApply(bad).ok,false);
  }finally{ui.close();}
});

test('screenshot storage failures do not report success or replace existing records',()=>{
  const storage=memory({[KEY]:E.backup(new Set([D.minions[0].id]))}),ui=open(storage);
  try{const old=storage.getItem(KEY);storage.setItem=()=>{throw Error('quota');};assert.equal(ui.scanApply([D.minions[1].id]).ok,false);assert.equal(storage.getItem(KEY),old);assert.equal(ui.$('#ownedCount').textContent,'1');}finally{ui.close();}
  const bad=open(memory({[KEY]:'{broken'}));try{assert.equal(bad.scanApply([D.minions[0].id]).ok,false);assert.equal(bad.storage.getItem(KEY),'{broken');}finally{bad.close();}
});
