import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
import * as core from '../core.js';
const data=JSON.parse(await fs.readFile(new URL('../data/weapons.json',import.meta.url),'utf8'));
const t=id=>data.tracks.find(t=>t.id===id),record=(itemId=0,target=false,note='')=>({itemId,target,note});
const bk=records=>({...core.emptyBackup(),records}),pld=t('zodiac.PLD.weapon'),shield=t('zodiac.PLD.shield');
test('catalog has every verified stage, supported job and a distinct shield per series',()=>{
 assert.equal(data.series.length,15);assert.equal(data.tracks.length,260);
 const ids=data.tracks.flatMap(t=>t.items.map(i=>i.id));assert.equal(ids.length,920);assert.equal(new Set(ids).size,920);
 assert.equal(new Set(data.tracks.map(t=>t.id)).size,260);
 for(const s of data.series){const tracks=data.tracks.filter(t=>t.seriesId===s.id);assert.equal(tracks.length,s.trackCount);assert.equal(new Set(tracks.map(t=>t.jobId)).size,s.jobCount);
  for(const x of tracks){assert.equal(x.items.length,s.labels.length);assert.ok(x.items.every((i,n)=>i.name&&i.icon.startsWith('https://v2.xivapi.com/')&&i.official.startsWith('https://guide.ff14.co.kr/')&&i.stage===s.labels[n]&&i.itemLevel>0&&(n===0||i.itemLevel>=x.items[n-1].itemLevel)));}
  if(s.id!=='gentlemage'){assert.ok(t(s.id+'.PLD.weapon'));assert.ok(t(s.id+'.PLD.shield'));}
 }
 assert.equal(data.tracks.some(t=>t.seriesId==='zodiac'&&t.jobId==='SGE'),false);
 assert.ok(t('top.VPR.weapon'));assert.ok(t('top.PCT.weapon'));
 assert.equal(t('phantom.PLD.weapon').items.at(-1).name,'팬텀 숨은그림자 한손검');
});
test('Exquisite tracks start at augmented and end at exquisite, including VPR/PCT',()=>{
 for(const x of data.tracks.filter(t=>t.seriesId==='exquisite')){assert.deepEqual(x.items.map(i=>i.stage),['보강','재보강']);assert.deepEqual(x.items.map(i=>i.itemLevel),[660,665]);assert.match(x.items[0].name,/^보강된/);assert.match(x.items[1].name,/^재보강된/);}
 assert.equal(t('gentlemage.BLU.weapon').items.at(-1).itemLevel,530);
});
test('highest stage is reversible and does not count all intermediate items as collected weapons',()=>{
 assert.equal(core.stageIndex(pld,record(pld.items[5].id)),6);assert.equal(core.statusOf(pld,record(pld.items[5].id)),'progress');
 assert.equal(core.statusOf(pld,record(pld.items[7].id)),'complete');assert.equal(core.statusOf(pld,record(0)),'unstarted');
 assert.deepEqual(core.summarize([pld,shield],{[pld.id]:record(pld.items[7].id)}),{total:2,complete:1,progress:0,unstarted:1,targets:0});
});
test('backup merge preserves higher stages, favorites and unrelated or future records',()=>{
 const old=bk({[pld.id]:record(pld.items[7].id,true,'이전 메모'),'future.PCT.weapon':record(999999,true)}),incoming=bk({[pld.id]:record(pld.items[1].id,false,'새 메모'),[shield.id]:record(shield.items[0].id)});
 const merged=core.mergeBackups(core.parseBackup(old,data),core.parseBackup(incoming,data),data);
 assert.equal(merged.records[pld.id].itemId,pld.items[7].id);assert.equal(merged.records[pld.id].target,true);assert.equal(merged.records[pld.id].note,'새 메모');assert.ok(merged.records['future.PCT.weapon']);assert.ok(merged.records[shield.id]);
 assert.deepEqual(core.mergeBackups(old,incoming,data,true),incoming);assert.equal(old.records[pld.id].note,'이전 메모');
});
test('malformed or wrong-tool imports fail atomically, including an item belonging to a different track',()=>{
 for(const value of ['{',[],{records:{}},bk({[pld.id]:record(shield.items[0].id)}),bk({[pld.id]:record(-1)}),bk({[pld.id]:{itemId:0,target:'yes',note:''}}),bk({[pld.id]:record(0,false,'x'.repeat(501))}),JSON.parse('{"format":"teo-ffxiv-weapons","version":1,"records":{"__proto__":{"itemId":0,"target":true,"note":""}}}')])assert.throws(()=>core.parseBackup(value,data));
 assert.deepEqual(core.parseBackup(JSON.stringify(bk({[pld.id]:record(pld.items[2].id)})),data),bk({[pld.id]:record(pld.items[2].id)}));
});
test('search supports Korean initials and intermediate weapon names with combined filters',()=>{
 assert.deepEqual(core.filterTracks(data,{}, {query:'ㅋㄹㅌㄴ'}).map(t=>t.id),[pld.id,'uwu.PLD.weapon']);
 assert.ok(core.filterTracks(data,{}, {query:'엑스칼리버'}).some(x=>x.id===pld.id));
 assert.equal(core.filterTracks(data,{}, {series:'zodiac',job:'SGE'}).length,0);
 const records={[pld.id]:record(pld.items[0].id,true)};
 assert.deepEqual(core.filterTracks(data,records,{kind:'relic',job:'PLD',status:'progress',target:true}).map(t=>t.id),[pld.id]);
});

const html=await fs.readFile(new URL('../index.html',import.meta.url),'utf8');
const source=(await fs.readFile(new URL('../app.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/gm,'')+'\n';
async function harness(tester,stored=null){
 const dom=new JSDOM(html,{url:'https://example.test/ffxiv/weapons/',runScripts:'outside-only'}),w=dom.window,d=w.document;
 Object.assign(w,core);w.mountShowcase=()=>({refresh(){}});w.structuredClone=structuredClone;w.fetch=async()=>({ok:true,json:async()=>data});
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};w.HTMLElement.prototype.scrollIntoView=function(){};
 if(stored!==null)w.localStorage.setItem(core.STORAGE_KEY,typeof stored==='string'?stored:JSON.stringify(stored));
 new vm.Script(source).runInContext(dom.getInternalVMContext());
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(d.getElementById('app').hidden,false);
 const change=(element,value)=>{element.value=value;element.dispatchEvent(new w.Event('change',{bubbles:true}));};
 const click=selector=>{const element=d.querySelector(selector);assert.ok(element,selector);element.click();};
 const saved=()=>JSON.parse(w.localStorage.getItem(core.STORAGE_KEY)||'null');
 try{await tester({w,d,click,change,saved});}finally{dom.window.close();}
}
test('UI stage changes persist without changing shield and undo restores exactly',()=>harness(({d,change,click,saved})=>{
 change(d.querySelector(`[data-stage="${pld.id}"]`),pld.items[5].id);
 assert.equal(saved().records[pld.id].itemId,pld.items[5].id);assert.equal(saved().records[shield.id],undefined);assert.equal(d.getElementById('progressCount').textContent,'1');
 click('#undo');assert.deepEqual(saved().records,{});
}));
test('UI existing records restore, stage detail shows previous steps, notes are escaped',()=>harness(({d,click,change,saved})=>{
 assert.equal(d.getElementById('completeCount').textContent,'1');click(`[data-detail="${pld.id}"]`);assert.equal(d.querySelectorAll('.stage-list li.done').length,8);
 d.getElementById('weaponNote').value='<img src=x onerror=alert(1)>';click('#saveNote');assert.equal(d.querySelectorAll('#detailBody img[onerror]').length,0);assert.equal(saved().records[pld.id].note,'<img src=x onerror=alert(1)>');
 click(`[data-set-stage="${pld.items[2].id}"]`);assert.equal(d.querySelectorAll('.stage-list li.done').length,3);click('#clearStage');assert.equal(saved().records[pld.id].itemId,0);
},bk({[pld.id]:record(pld.items[7].id)})));
test('UI ultimate collection keeps its one-line label and filters refresh',()=>harness(({d,click,change,saved})=>{
 click('[data-kind="ultimate"]');const id='ucob.PLD.weapon';click(`[data-collect="${id}"]`);assert.equal(d.querySelector(`[data-collect="${id}"]`).textContent.trim(),'수집');assert.equal(d.querySelector(`[data-collect="${id}"]`).getAttribute('aria-pressed'),'true');
 change(d.getElementById('statusFilter'),'complete');assert.equal(d.querySelectorAll('.weapon-row').length,1);click(`[data-collect="${id}"]`);assert.equal(d.querySelectorAll('.weapon-row').length,0);assert.equal(saved().records[id].itemId,0);assert.equal(d.getElementById('emptyResults').hidden,false);
}));
test('UI IME input searches the currently composing consonant and grid/list preserves records',()=>harness(({w,d,click,change,saved})=>{
 const q=d.getElementById('search');q.value='ㅋㄹㅌㄴ';q.dispatchEvent(new w.InputEvent('input',{bubbles:true,isComposing:true}));assert.equal(d.querySelectorAll('.weapon-row').length,1);
 change(d.querySelector('[data-stage]'),pld.items[0].id);click('[data-layout="grid"]');assert.equal(d.getElementById('catalog').dataset.collectionLayout,'grid');click('[data-layout="list"]');assert.equal(saved().records[pld.id].itemId,pld.items[0].id);
}));
test('UI importing requires a preview, merges by default and explicit replacement clears missing records',()=>harness(({d,click,change,saved})=>{
 click('#openRecords');d.getElementById('backupText').value=JSON.stringify(bk({[shield.id]:record(shield.items[2].id)}));click('#previewImport');assert.equal(saved().records[shield.id],undefined);click('#applyImport');assert.ok(saved().records[pld.id]);assert.ok(saved().records[shield.id]);
 change(d.getElementById('importMode'),'replace');click('#applyImport');assert.ok(saved().records[pld.id]);click('#previewImport');click('#applyImport');assert.equal(saved().records[pld.id],undefined);click('#undo');assert.ok(saved().records[pld.id]);
},bk({[pld.id]:record(pld.items[7].id)})));
test('UI malformed stored data remains untouched; explicit import can repair it',()=>harness(({w,d,click,change,saved})=>{
 change(d.querySelector('[data-stage]'),pld.items[0].id);assert.equal(w.localStorage.getItem(core.STORAGE_KEY),'not json');assert.equal(d.getElementById('storageWarning').hidden,false);
 click('#openRecords');assert.equal(d.getElementById('exportRaw').hidden,false);d.getElementById('backupText').value=JSON.stringify(bk({[pld.id]:record(pld.items[0].id)}));change(d.getElementById('importMode'),'replace');click('#previewImport');click('#applyImport');assert.equal(saved().records[pld.id].itemId,pld.items[0].id);assert.equal(d.getElementById('storageWarning').hidden,true);
},'not json'));
test('UI storage failure never claims a successful collection update',()=>harness(({w,d,change})=>{
 const before=w.localStorage.getItem(core.STORAGE_KEY);w.Storage.prototype.setItem=function(){throw Error('Quota exceeded');};change(d.querySelector('[data-stage]'),pld.items[0].id);assert.equal(w.localStorage.getItem(core.STORAGE_KEY),before);assert.equal(d.getElementById('progressCount').textContent,'0');assert.match(d.getElementById('storageWarning').textContent,/자동 저장 실패/);
}));
test('UI writes merge unseen changes from another tab instead of losing them',()=>harness(({w,d,change,saved})=>{
 w.localStorage.setItem(core.STORAGE_KEY,JSON.stringify(bk({[shield.id]:record(shield.items[7].id)})));change(d.querySelector(`[data-stage="${pld.id}"]`),pld.items[0].id);assert.ok(saved().records[shield.id]);assert.ok(saved().records[pld.id]);
}));
