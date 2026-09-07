const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM}=require('jsdom'),E=require('../engine.js');
const root=path.resolve(__dirname,'..'),context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),context);
const D=JSON.parse(JSON.stringify(context.window.BLUE_MAGE_DATA)),KEY='teo-ffxiv.blue-mage.collection.v1';
const memory=initial=>{const values=new Map(Object.entries(initial||{}));return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v))};};
function open(storage=memory()){
  const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'https://example.com/ffxiv/blue-mage/',runScripts:'outside-only'}),w=dom.window,d=w.document,downloads=[];
  Object.defineProperty(w,'localStorage',{value:storage});w.HTMLElement.prototype.scrollIntoView=function(){};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  w.Blob=Blob;w.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};
  let scanApply;w.BlueMageScanUI={mount:({apply})=>{scanApply=apply;}};
  for(const file of ['data.js','engine.js','app.js'])w.eval(fs.readFileSync(path.join(root,file),'utf8'));
  const $=s=>d.querySelector(s),all=s=>[...d.querySelectorAll(s)],change=(s,value,event='change')=>{const el=$(s);el.value=value;el.dispatchEvent(new w.Event(event,{bubbles:true}));};
  assert.equal($('#appContent').hidden,false);
  return {w,d,$,all,change,storage,downloads,scanApply,close:()=>w.close()};
}
test('catalog has every numbered Korean spell and preserves separate Collect and game IDs',()=>{
  assert.equal(D.count,124);assert.deepEqual(D.spells.map(s=>s.id),Array.from({length:124},(_,i)=>i+1));
  assert.equal(D.spells[0].name,'물대포');assert.equal(D.spells[0].collectId,3);assert.equal(D.spells[0].actionId,11385);
  assert.equal(D.spells[23].name,'날아라 정어리');assert.equal(D.spells[123].name,'죽어야 할 운명');
  assert.equal(new Set(D.spells.map(s=>s.actionId)).size,D.count);
  for(const s of D.spells){
    assert.match(s.name,/[가-힣]/);assert.ok(s.type&&s.aspect);assert.ok(s.rank>=1&&s.rank<=5);assert.ok(s.cast>=0&&s.recast>=0&&s.range>=0&&s.radius>=0);
    assert.equal(s.collect,'https://ffxivcollect.com/spells/'+s.collectId);assert.match(s.icon,/^https:\/\//);assert.ok(s.sources.length);
    for(const x of s.sources){assert.ok(D.types[x.type]);assert.ok(x.original&&x.location&&x.locationKey);assert.equal(x.sourceUrl,s.collect);assert.match(x.link,/^https:\/\/guide.ff14.co.kr\//);if(x.coordinates)assert.ok(x.coordinates.x>0&&x.coordinates.y>0&&x.coordinates.x<100&&x.coordinates.y<100);if(['dungeon','trial','raid'].includes(x.type)&&!x.difficultyUnspecified){assert.ok(x.level>=1&&x.level<=80);assert.match(x.link,/\/db\/duty\/[a-z0-9]+$/);}if(x.type==='totem')assert.ok(x.prerequisite&&x.requirement.count>0);}
  }
  assert.equal(D.sourceCount,D.spells.reduce((n,s)=>n+s.sources.length,0));assert.equal(D.sourceCount,169);
  assert.equal(new Set(D.spells.flatMap(s=>s.sources.map(x=>x.locationKey))).size,107);
  for(const [id,enemy] of [[3,'리바이어선'],[78,'라바나']]){const source=D.spells.find(s=>s.id===id).sources.find(x=>x.enemy===enemy);assert.equal(source.type,'trial');assert.equal(source.difficultyUnspecified,true);assert.match(source.condition,/난이도/);}
});
test('numbers match exactly and Korean initials, spaces, English and source text are searchable',()=>{
  const s=D.spells[23];for(const q of ['24','No.024','날아라정어리','ㄴㅇㄹㅈㅇㄹ','Flying Sardine'])assert.ok(E.matches(s,q),q);
  assert.equal(E.filter(D.spells,new Set(),{query:'24'}).length,1);assert.equal(E.matches(D.spells[123],'24'),false);
  const source=s.sources[0];assert.ok(E.matches(s,source.location));assert.ok(E.matches(s,source.enemy));
  assert.equal(E.filter(D.spells,new Set([24]),{query:'ㄴㅇㄹㅈㅇㄹ',status:'unlearned'}).length,0);
  assert.equal(E.filter(D.spells,new Set([24]),{query:'ㄴㅇㄹㅈㅇㄹ',status:'learned',aspect:s.aspect,rank:String(s.rank)})[0].id,24);
});
test('combined place and type filters must match one acquisition route, and groups deduplicate spells',()=>{
  const spell={id:1,name:'시험',sources:[{type:'field',location:'들판',locationKey:'f',enemy:'마물1'},{type:'dungeon',location:'던전',locationKey:'d',enemy:'마물2'},{type:'dungeon',location:'던전',locationKey:'d',enemy:'마물3'}]};
  assert.equal(E.filter([spell],new Set(),{source:'field',location:'d'}).length,0);
  const groups=E.groupByLocation([spell],{source:'dungeon'});assert.equal(groups.length,1);assert.equal(groups[0].spells.length,1);assert.equal(groups[0].spells[0].sources.length,2);
});
test('bulk number input validates all tokens and supports deduplicated ranges',()=>{
  assert.deepEqual(E.parseNumbers('1-3, 2 24\n77 ～ 79',D.spells),new Set([1,2,3,24,77,78,79]));
  for(const invalid of ['', '0','125','1-3, 999','7-2','2, 날아라','1.5','1-999999999999','Infinity','2--4'])assert.throws(()=>E.parseNumbers(invalid,D.spells),invalid);
});
test('backup rejects other trackers and invalid IDs while preserving future spell numbers',()=>{
  assert.deepEqual(E.parseBackup(E.backup(new Set([1,24,99999]))),new Set([1,24,99999]));
  for(const bad of ['{broken','[1,2]',JSON.stringify({type:'ffxiv-minions',schemaVersion:1,collected:[1]}),...[[1,'2'],[0],[-1],[1.5],[null]].map(learned=>JSON.stringify({type:'ffxiv-blue-mage',schemaVersion:1,learned}))])assert.throws(()=>E.parseBackup(bad));
});
test('checks persist without moving tiles; undo restores only the last action',()=>{
  const ui=open();try{
    const before=ui.all('.spell-check').map(e=>e.dataset.collect);ui.$('[data-collect="1"]').click();ui.$('[data-collect="2"]').click();
    assert.equal(ui.$('#learnedCount').textContent,'2');assert.deepEqual(ui.all('.spell-check').map(e=>e.dataset.collect),before);
    ui.$('#undo').click();assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set([1]));assert.equal(ui.$('[data-collect="2"]').getAttribute('aria-pressed'),'false');
    ui.$('#undo').click();assert.equal(ui.$('#learnedCount').textContent,'0');
  }finally{ui.close();}
});
test('30-item pagination covers all 124 spells without omissions',()=>{
  const ui=open();try{const seen=[];for(let p=1;p<=5;p++){const ids=ui.all('.spell-check').map(e=>+e.dataset.collect);assert.deepEqual(ids,D.spells.slice((p-1)*30,p*30).map(s=>s.id));seen.push(...ids);const next=ui.$('[aria-label="다음 페이지"]');assert.equal(next.disabled,p===5);if(p<5)next.click();}assert.equal(new Set(seen).size,124);ui.$('[data-page="1"]').click();assert.equal(ui.$('.spell-check').dataset.collect,'1');}finally{ui.close();}
});
test('unlearned filtering leaves checked tiles until refresh and bulk checks only the visible page',()=>{
  const ui=open();try{ui.change('#status','unlearned');ui.$('[data-collect="1"]').click();assert.ok(ui.$('[data-collect="1"]'));assert.equal(ui.$('#refreshResults').hidden,false);ui.$('#refreshResults').click();assert.equal(ui.$('[data-collect="1"]'),null);ui.$('#markPage').click();assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set(Array.from({length:31},(_,i)=>i+1)));ui.$('#undo').click();assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set([1]));}finally{ui.close();}
});
test('search includes composing final Korean consonant and resets filters',()=>{
  const ui=open();try{ui.$('#search').dispatchEvent(new ui.w.CompositionEvent('compositionstart',{bubbles:true}));ui.change('#search','ㄴㅇㄹㅈㅇㄹ','input');assert.equal(ui.all('.spell-check').length,1);assert.equal(ui.$('.spell-check').dataset.collect,'24');ui.change('#rank','5');ui.$('#resetFilters').click();assert.equal(ui.$('#search').value,'');assert.equal(ui.$('#rank').value,'all');assert.equal(ui.all('.spell-check').length,30);}finally{ui.close();}
});
test('detail shows all routes and totem requirements, and guides users to unlearned spells at that place',()=>{
  const ui=open();try{
    const s=D.spells.find(s=>s.sources.some(x=>x.requirement?.type==='learned')),source=s.sources.find(x=>x.requirement?.type==='learned');ui.change('#search',String(s.id),'input');ui.$('[data-detail]').click();
    assert.equal(ui.$('#detailDialog').open,true);assert.equal(ui.all('.detail-sources>li').length,s.sources.length);assert.match(ui.$('#detailBody').textContent,/청가면 탄생/);assert.match(ui.$('[data-totem-count]').textContent,/수첩 기록 0/);
    ui.$('.detail-check').click();assert.equal(ui.$('.spell-check').getAttribute('aria-pressed'),'true');assert.match(ui.$('[data-totem-count]').textContent,/수첩 기록 1/);
    ui.$(`[data-location="${source.locationKey}"]`).click();assert.equal(ui.$('#detailDialog').open,false);assert.equal(ui.$('#status').value,'unlearned');assert.equal(ui.$('#location').value,source.locationKey);assert.equal(ui.all('.location-group').length,1);assert.ok(ui.all('.location-entry').every(el=>!el.querySelector(`[data-collect="${s.id}"]`)));
  }finally{ui.close();}
});
test('location bulk checks deduplicate visible spells and undo restores the collection',()=>{
  const ui=open();try{ui.$('#locationView').click();const ids=new Set(ui.all('#locationGroups [data-collect]').map(e=>+e.dataset.collect));assert.equal(ui.all('.location-group').length,10);ui.$('#markPage').click();assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),ids);ui.$('#undo').click();assert.equal(ui.$('#learnedCount').textContent,'0');}finally{ui.close();}
});
test('number registration previews additions, rejects invalid input atomically and merges existing records',()=>{
  const ui=open(memory({[KEY]:E.backup(new Set([2,99999]))}));try{ui.$('#openRecords').click();assert.equal(ui.$('#recordsDialog').open,true);ui.change('#learnedNumbers','1-3,24','input');assert.match(ui.$('#numberPreview').textContent,/4종 선택 · 3종 새로 추가/);ui.$('#applyNumbers').click();assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set([1,2,3,24,99999]));assert.equal(ui.$('#learnedCount').textContent,'4');const before=ui.storage.getItem(KEY);ui.change('#learnedNumbers','4-8,125','input');assert.equal(ui.$('#applyNumbers').disabled,true);assert.equal(ui.storage.getItem(KEY),before);ui.$('#closeRecords').click();assert.equal(ui.$('#recordsDialog').open,false);}finally{ui.close();}
});
test('imports merge existing and future IDs, reject other formats, and export round trips',async()=>{
  const ui=open(memory({[KEY]:E.backup(new Set([1,99999]))}));try{const file=ui.$('#importFile');Object.defineProperty(file,'files',{configurable:true,value:[{size:100,text:async()=>E.backup(new Set([24]))}]});file.dispatchEvent(new ui.w.Event('change'));await new Promise(r=>setTimeout(r,0));assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set([1,24,99999]));const before=ui.storage.getItem(KEY);Object.defineProperty(file,'files',{value:[{size:100,text:async()=>'[1,2]'}]});file.dispatchEvent(new ui.w.Event('change'));await new Promise(r=>setTimeout(r,0));assert.equal(ui.storage.getItem(KEY),before);ui.$('#exportRecords').click();assert.deepEqual(E.parseBackup(await ui.downloads[0].text()),new Set([1,24,99999]));}finally{ui.close();}
});
test('storage failures and malformed stored data never discard previous records',()=>{
  const storage=memory({[KEY]:E.backup(new Set([1]))}),ui=open(storage);try{const old=storage.getItem(KEY);storage.setItem=()=>{throw Error('quota');};ui.$('[data-collect="2"]').click();assert.equal(ui.$('#learnedCount').textContent,'1');assert.equal(storage.getItem(KEY),old);assert.match(ui.$('#noticeText').textContent,/저장하지 못/);}finally{ui.close();}
  const corrupted=memory({[KEY]:'{broken'}),bad=open(corrupted);try{bad.$('.spell-check').click();assert.equal(corrupted.getItem(KEY),'{broken');assert.equal(bad.$('#fatal').hidden,false);}finally{bad.close();}
});
test('other-tab edits are reflected and subsequent changes read fresh state',()=>{
  const ui=open();try{ui.$('[data-collect="1"]').click();ui.storage.setItem(KEY,E.backup(new Set([1,80])));ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:KEY}));assert.equal(ui.$('#learnedCount').textContent,'2');assert.equal(ui.$('#undo').hidden,true);ui.storage.setItem(KEY,E.backup(new Set([1,80,90])));ui.$('[data-collect="2"]').click();assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set([1,2,80,90]));}finally{ui.close();}
});
test('capture registration merges fresh records, keeps missing and future IDs, and supports undo',()=>{
  const ui=open(memory({[KEY]:E.backup(new Set([51,99999]))}));try{ui.storage.setItem(KEY,E.backup(new Set([51,80,99999])));assert.equal(ui.scanApply([49,50,49]).ok,true);assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set([49,50,51,80,99999]));assert.match(ui.$('#recordMessage').textContent,/2종/);ui.$('#undo').click();assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set([51,80,99999]));const before=ui.storage.getItem(KEY);for(const ids of [[],null,[99999],['49']])assert.equal(ui.scanApply(ids).ok,false);assert.equal(ui.storage.getItem(KEY),before);}finally{ui.close();}
});
