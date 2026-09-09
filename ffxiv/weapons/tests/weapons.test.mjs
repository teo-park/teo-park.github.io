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
async function harness(tester,stored=null,prefs=null){
 const dom=new JSDOM(html,{url:'https://example.test/ffxiv/weapons/',runScripts:'outside-only'}),w=dom.window,d=w.document;
 Object.assign(w,core);w.mountShowcase=()=>({refresh(){}});w.structuredClone=structuredClone;w.fetch=async()=>({ok:true,json:async()=>data});
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};w.HTMLElement.prototype.scrollIntoView=function(){};
 if(stored!==null)w.localStorage.setItem(core.STORAGE_KEY,typeof stored==='string'?stored:JSON.stringify(stored));
 if(prefs!==null)w.localStorage.setItem('teo-ffxiv.weapons.preferences.v1',JSON.stringify(prefs));
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
 change(d.getElementById('statusFilter'),'complete');assert.equal(d.querySelectorAll('.relic-entry').length,1);click(`[data-collect="${id}"]`);assert.equal(d.querySelectorAll('.relic-entry').length,0);assert.equal(saved().records[id].itemId,0);assert.equal(d.getElementById('emptyResults').hidden,false);
}));
test('UI IME input searches the composing consonant and changing table scope preserves records',()=>harness(({w,d,click,change,saved})=>{
 const q=d.getElementById('search');q.value='ㅋㄹㅌㄴ';q.dispatchEvent(new w.InputEvent('input',{bubbles:true,isComposing:true}));assert.equal(d.querySelectorAll('.relic-entry').length,1);
 change(d.querySelector('[data-stage]'),pld.items[0].id);click('[data-kind="ultimate"]');assert.equal(d.getElementById('catalog').dataset.collectionLayout,'table');click('[data-kind="relic"]');assert.equal(saved().records[pld.id].itemId,pld.items[0].id);
}));

test('relic table aligns six full series by job despite an old single-series/grid preference',()=>harness(({d})=>{
 assert.equal(d.getElementById('catalog').dataset.collectionLayout,'table');assert.equal(d.getElementById('seriesField').hidden,true);assert.equal(d.querySelector('.collection-layout-switch'),null);
 assert.deepEqual([...d.querySelectorAll('.relic-table thead th a')].map(x=>x.textContent.replace(' ↗','')),['제타','아니마','에우레카','레지스탕스','맨더빌','팬텀']);
 assert.equal(d.querySelectorAll('.relic-table tbody tr').length,21);assert.equal(d.querySelectorAll('.relic-entry').length,101);assert.equal(d.getElementById('pagination'),null);
 assert.equal(d.querySelectorAll('[data-job="PLD"] td[data-series="zodiac"] [data-stage]').length,2);
 assert.equal(d.querySelector('[data-job="SGE"] td').textContent,'—');assert.equal(d.querySelector('[data-job="BLU"]'),null);
 assert.equal(d.getElementById('seriesFilter').value,'');
},null,{filters:{kind:'relic',series:'zodiac'},layout:'grid'}));

test('table changes preserve scroll/focus and keep sword, shield and other series independent',()=>harness(({d,change,click,saved})=>{
 const scroll=d.getElementById('relicTableScroll');scroll.scrollLeft=260;scroll.scrollTop=400;
 const input=d.querySelector(`[data-stage="${pld.id}"]`);input.focus();change(input,pld.items.at(-1).id);
 assert.equal(d.activeElement.id,input.id);assert.equal(d.getElementById('relicTableScroll').scrollLeft,260);assert.equal(d.getElementById('relicTableScroll').scrollTop,400);
 assert.ok(d.querySelector(`[data-track="${pld.id}"]`).classList.contains('complete'));
 change(d.querySelector(`[data-stage="${shield.id}"]`),shield.items[2].id);assert.equal(saved().records[pld.id].itemId,pld.items.at(-1).id);assert.equal(saved().records[shield.id].itemId,shield.items[2].id);
 const anima=t('anima.PLD.weapon');change(d.querySelector(`[data-stage="${anima.id}"]`),anima.items[1].id);assert.equal(saved().records[pld.id].itemId,pld.items.at(-1).id);click('#undo');assert.equal(saved().records[anima.id],undefined);
}));

test('relic state and favorite filters keep column positions and distinguish unavailable cells',()=>harness(({d,change,click})=>{
 change(d.getElementById('statusFilter'),'progress');assert.equal(d.querySelectorAll('.relic-table tbody tr').length,1);assert.equal(d.querySelectorAll('.relic-table thead th').length,7);assert.equal(d.querySelectorAll('.relic-entry').length,1);
 assert.equal(d.querySelector('[data-job="SGE"] td').textContent,'—');assert.equal(d.querySelector('[data-job="SGE"] .relic-filtered').textContent,'조건 제외');
 click('#targetFilter');assert.equal(d.querySelectorAll('.relic-entry').length,1);click('[data-target="phantom.SGE.weapon"]');assert.equal(d.getElementById('emptyResults').hidden,false);assert.equal(d.querySelector('.relic-table'),null);
 click('[data-kind="enhanced"]');assert.equal(d.getElementById('seriesField').hidden,false);assert.equal(d.querySelector('.collection-layout-switch'),null);
},bk({'phantom.SGE.weapon':record(t('phantom.SGE.weapon').items[0].id,true)})));
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


test('ultimate table includes seven raids with separate sword and shield records',()=>harness(({d,click,change,saved})=>{
 assert.equal(d.getElementById('resultLabel').textContent,'절 무기 수집표');
 assert.equal(d.querySelectorAll('.relic-table thead th').length,8);assert.equal(d.querySelectorAll('.relic-table tbody tr').length,21);
 assert.equal(d.querySelectorAll('[data-collect]').length,136);assert.equal(d.querySelectorAll('[data-stage]').length,0);
 assert.equal(d.getElementById('seriesField').hidden,true);assert.equal(d.getElementById('seriesFilter').value,'');
 const sword=t('ucob.PLD.weapon'),shield=t('ucob.PLD.shield');
 assert.equal(d.querySelectorAll('[data-job="PLD"] [data-series="ucob"] [data-collect]').length,2);
 const scroll=d.getElementById('relicTableScroll');scroll.scrollLeft=350;scroll.scrollTop=240;
 const button=d.querySelector('[data-collect="ucob.PLD.weapon"]');button.focus();click('[data-collect="ucob.PLD.weapon"]');
 assert.equal(saved().records[sword.id].itemId,sword.items[0].id);assert.equal(saved().records[shield.id],undefined);
 assert.equal(d.activeElement.dataset.collect,sword.id);assert.equal(d.getElementById('relicTableScroll').scrollLeft,350);assert.equal(d.getElementById('relicTableScroll').scrollTop,240);
 click('[data-collect="ucob.PLD.shield"]');click('#undo');assert.equal(saved().records[shield.id],undefined);assert.equal(saved().records[sword.id].itemId,sword.items[0].id);
 change(d.getElementById('jobFilter'),'VPR');assert.equal(d.querySelector('[data-job="VPR"] td').textContent,'—');assert.ok(d.querySelector('[data-collect="top.VPR.weapon"]'));
},null,{filters:{kind:'ultimate',series:'ucob'},layout:'grid'}));

test('all table exposes every record and all fifteen series on aligned job rows',()=>harness(({d,click,change,saved})=>{
 click('[data-kind=""]');assert.equal(d.getElementById('resultLabel').textContent,'전체 무기 수집표');
 assert.equal(d.querySelectorAll('.relic-table tbody tr').length,22);assert.equal(d.querySelectorAll('.relic-table thead th').length,16);
 assert.equal(d.querySelectorAll('.relic-entry').length,260);assert.equal(d.querySelectorAll('[data-stage]').length,101);assert.equal(d.querySelectorAll('[data-cycle]').length,23);assert.equal(d.querySelectorAll('[data-collect]').length,136);
 assert.equal(d.querySelectorAll('.relic-table thead .series-boundary').length,2);
 assert.ok(d.querySelector('[data-job="BLU"] [data-cycle="gentlemage.BLU.weapon"]'));assert.equal(d.querySelector('[data-job="BLU"] td').textContent,'—');
 assert.equal(d.querySelectorAll('[data-job="PLD"] td').length,15);assert.equal(d.querySelectorAll('[data-job="PLD"] .relic-entry').length,28);
 change(d.querySelector('[data-stage="zodiac.PLD.weapon"]'),pld.items[2].id);click('[data-collect="tea.PLD.weapon"]');
 const exquisite=t('exquisite.PLD.weapon');click('[data-cycle="exquisite.PLD.weapon"]');click('[data-cycle="exquisite.PLD.weapon"]');
 assert.equal(saved().records[pld.id].itemId,pld.items[2].id);assert.equal(saved().records['tea.PLD.weapon'].itemId,t('tea.PLD.weapon').items[0].id);assert.equal(saved().records[exquisite.id].itemId,exquisite.items[1].id);
 change(d.getElementById('statusFilter'),'complete');assert.equal(d.querySelectorAll('.relic-table thead th').length,16);assert.equal(d.querySelectorAll('.relic-entry').length,2);
 assert.equal(d.querySelector('[data-job="PLD"] th small').textContent,'PLD · 2/28');
}));

test('ultimate collection storage failures preserve prior state and button',()=>harness(({w,d,click,saved})=>{
 click('[data-kind="ultimate"]');w.Storage.prototype.setItem=()=>{throw Error('Quota exceeded');};
 click('[data-collect="ucob.PLD.weapon"]');assert.equal(saved(),null);assert.equal(d.querySelector('[data-collect="ucob.PLD.weapon"]').getAttribute('aria-pressed'),'false');assert.match(d.getElementById('storageWarning').textContent,/자동 저장 실패/);
}));


test('enhanced buttons cycle absent to augmented to exquisite and back without touching shield or metadata',()=>harness(({d,click,saved})=>{
 click('[data-kind="enhanced"]');const id='exquisite.PLD.weapon',weapon=t(id),button=()=>d.querySelector('[data-cycle="'+id+'"]');
 const text=()=>button().querySelector('.cycle-value').textContent;
 assert.equal(text(),'없음');assert.match(button().getAttribute('aria-label'),/현재 없음, 클릭하면 보강/);
 const scroll=d.getElementById('relicTableScroll');scroll.scrollLeft=80;scroll.scrollTop=190;button().focus();
 click('[data-cycle="'+id+'"]');assert.equal(text(),'보강');assert.equal(saved().records[id].itemId,weapon.items[0].id);
 assert.equal(d.activeElement.id,'cycle-'+id);assert.equal(d.getElementById('relicTableScroll').scrollLeft,80);assert.equal(d.getElementById('relicTableScroll').scrollTop,190);
 assert.ok(button().closest('.relic-entry').classList.contains('progress'));
 click('[data-cycle="'+id+'"]');assert.equal(text(),'재보강');assert.equal(saved().records[id].itemId,weapon.items[1].id);assert.ok(button().closest('.relic-entry').classList.contains('complete'));
 click('[data-cycle="'+id+'"]');assert.equal(text(),'없음');assert.equal(saved().records[id].itemId,0);
 assert.equal(saved().records[id].target,true);assert.equal(saved().records[id].note,'남은 재료');assert.equal(saved().records['exquisite.PLD.shield'].itemId,t('exquisite.PLD.shield').items[0].id);
 click('#undo');assert.equal(text(),'재보강');assert.equal(saved().records[id].itemId,weapon.items[1].id);
},bk({'exquisite.PLD.weapon':record(0,true,'남은 재료'),'exquisite.PLD.shield':record(t('exquisite.PLD.shield').items[0].id)})));

test('enhanced cycle restores existing progress, reads newest tab state and preserves real umbrella stage names',()=>harness(({w,d,click,saved})=>{
 click('[data-kind="enhanced"]');const id='exquisite.WAR.weapon',weapon=t(id);
 assert.equal(d.querySelector('[data-cycle="'+id+'"] .cycle-value').textContent,'보강');
 w.localStorage.setItem(core.STORAGE_KEY,JSON.stringify(bk({[id]:record(weapon.items[1].id)})));
 click('[data-cycle="'+id+'"]');assert.equal(saved().records[id].itemId,0);
 const umbrella=t('gentlemage.BLU.weapon');click('[data-cycle="gentlemage.BLU.weapon"]');assert.equal(saved().records[umbrella.id].itemId,umbrella.items[0].id);assert.equal(d.querySelector('[data-cycle="gentlemage.BLU.weapon"] .cycle-value').textContent,'일반');
 click('[data-cycle="gentlemage.BLU.weapon"]');assert.equal(saved().records[umbrella.id].itemId,umbrella.items[1].id);
 click('[data-cycle="gentlemage.BLU.weapon"]');assert.equal(saved().records[umbrella.id].itemId,0);
},bk({'exquisite.WAR.weapon':record(t('exquisite.WAR.weapon').items[0].id)})));

test('enhanced cycle save failure keeps the current state and collection',()=>harness(({w,d,click,saved})=>{
 click('[data-kind="enhanced"]');const before=saved();w.Storage.prototype.setItem=()=>{throw Error('Quota exceeded');};
 click('[data-cycle="exquisite.PLD.weapon"]');assert.deepEqual(saved(),before);assert.equal(d.querySelector('[data-cycle="exquisite.PLD.weapon"] .cycle-value').textContent,'보강');assert.match(d.getElementById('storageWarning').textContent,/자동 저장 실패/);
},bk({'exquisite.PLD.weapon':record(t('exquisite.PLD.weapon').items[0].id)})));
