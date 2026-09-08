import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {KEY,create,parseBackup,parseNumbers,backup} from '../engine.js';
import {mount} from '../app.js';

const data=JSON.parse(readFileSync(new URL('../data.json',import.meta.url))),html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const model=create(data),valid=new Set(model.byId.keys());
const locations=JSON.parse(readFileSync(new URL('../locations.json',import.meta.url)));
function setup(seed,locationData=locations){
  const dom=new JSDOM(html,{url:'https://example.test/ffxiv/beastmaster/',pretendToBeVisual:true,runScripts:'outside-only'}),w=dom.window,d=w.document;
  w.HTMLElement.prototype.scrollIntoView=function(){};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  if(seed!==undefined)w.localStorage.setItem(KEY,typeof seed==='string'?seed:backup(new Set(seed)));
  mount(w,data,locationData);w.eval(readFileSync(new URL('../../collection-layout.js',import.meta.url),'utf8'));
  const $=id=>d.getElementById(id),click=selector=>{const e=d.querySelector(selector);assert.ok(e,selector);e.click();};
  const input=(id,value,event='input')=>{$(id).value=value;$(id).dispatchEvent(new w.Event(event,{bubbles:true}));};
  const ids=()=>[...d.querySelectorAll('#beastGrid .beast-tile')].map(e=>Number(e.dataset.id));
  const saved=()=>parseBackup(w.localStorage.getItem(KEY));
  return {w,d,$,click,input,ids,saved,close:()=>w.close()};
}

test('monster aliases open the correct beast and show sourced coordinates without changing collection',()=>{
  const a=setup([41]);try{
    a.input('search','검은 큰도롱뇽');assert.deepEqual(a.ids(),[41]);const before=a.w.localStorage.getItem(KEY);
    a.click('[data-detail="41"]');assert.equal(a.$('detailTitle').textContent,'불도롱뇽');
    assert.match(a.$('locationMapContent').textContent,/검은 큰도롱뇽/);assert.match(a.$('locationMapContent').textContent,/X:26 · Y:20/);
    assert.match(a.$('locationMapContent').querySelector('a').href,/inven.*detail\.php/);
    assert.equal(a.w.localStorage.getItem(KEY),before);
    a.d.querySelector('[data-location-map]').dispatchEvent(new a.w.Event('error'));
    assert.ok(a.d.querySelector('.map-failed'));assert.match(a.$('locationMapContent').textContent,/불러오지 못했어요/);assert.ok(a.$('locationMapContent').querySelector('a'));
  }finally{a.close();}
});

test('target switching updates the map pin and copy text, and alternate regions are identified',async()=>{
  const a=setup([7]);try{
    a.input('search','7');a.click('[data-detail="7"]');const before=a.w.localStorage.getItem(KEY);
    const select=a.$('locationTarget'),first=a.d.querySelector('.location-pin').style.left;
    a.input('locationTarget',select.options[select.options.length-1].value,'change');
    assert.notEqual(a.d.querySelector('.location-pin').style.left,first);assert.match(a.$('locationMapContent').textContent,/납 코브란/);
    let copied;Object.defineProperty(a.w.navigator,'clipboard',{value:{writeText:async value=>{copied=value;}}});
    a.click('[data-copy-location]');await Promise.resolve();assert.match(copied,/납 코브란.*X:13 Y:10/);
    assert.equal(a.w.localStorage.getItem(KEY),before);
    a.click('#closeDetail');a.input('search','25');a.click('[data-detail="25"]');assert.match(a.d.querySelector('.location-alternate').textContent,/중부 다날란.*다른 지역/);
  }finally{a.close();}
});

test('missing reference data keeps collection and acquisition routes usable',()=>{
  const a=setup([2],null);try{a.click('[data-detail="2"]');assert.match(a.$('detailBody').textContent,/지도 자료를 불러오지 못했어요/);assert.match(a.$('detailBody').textContent,/검은장막 숲 중부삼림/);a.click('#detailBody [data-check="2"]');assert.equal(a.saved().has(2),false);}finally{a.close();}
});

test('layout controls preserve the 25-entry page, checks and acquisition grouping',()=>{
  const a=setup();try{
    a.click('#paginationTop [aria-label="2페이지"]');a.click('#beastGrid [data-check="50"]');const ids=a.ids(),before=a.w.localStorage.getItem(KEY),node=a.d.querySelector('#beastGrid [data-check="50"]');
    a.click('[data-layout-choice="list"]');assert.equal(a.$('catalog').dataset.collectionLayout,'list');assert.deepEqual(a.ids(),ids);assert.equal(a.d.querySelector('#beastGrid [data-check="50"]'),node);assert.match(a.$('viewHint').textContent,/도감 번호순/);
    a.click('#placeView');assert.equal(a.$('catalog').dataset.collectionLayout,'list');a.click('[data-layout-choice="grid"]');assert.equal(a.$('placeGroups').hidden,false);assert.equal(a.w.localStorage.getItem(KEY),before);
    const key='teo-ffxiv.collection-layout.beastmaster.v1';a.w.localStorage.setItem(key,'list');a.w.dispatchEvent(new a.w.StorageEvent('storage',{key}));assert.equal(a.$('catalog').dataset.collectionLayout,'list');assert.equal(a.w.localStorage.getItem(KEY),before);
  }finally{a.close();}
});
test('50 beasts have correct source filters and Korean initial/name/number searches',()=>{
  const empty=new Set();
  assert.equal(model.filter(empty).length,50);
  for(const [method,count] of Object.entries({field:37,duty:12,exchange:15,quest:1}))assert.equal(model.filter(empty,{method}).length,count);
  assert.deepEqual(model.filter(empty,{query:'ㅊㅅㅁ'}).map(b=>b.id),[2]);
  assert.deepEqual(model.filter(empty,{query:'청 설 모'}).map(b=>b.id),[2]);
  assert.deepEqual(model.filter(empty,{query:'No.50'}).map(b=>b.id),[50]);
  assert.deepEqual(model.filter(empty,{query:'BEHEMOTH'}).map(b=>b.id),[50]);
  assert.ok(model.filter(empty,{query:'구리종광산'}).length);
  assert.equal(model.filter(empty,{method:'field',place:'exchange:1771020'}).length,0,'method and place must match the same acquisition route');
  assert.equal(model.filter(new Set([1,2]),{status:'owned'}).length,2);
  assert.equal(model.filter(new Set([1,2]),{status:'missing'}).length,48);
});

test('number entry validates the whole input; backups accept only this collection schema',()=>{
  assert.deepEqual([...parseNumbers('1, 2 4 - 6, 25～27',valid)],[1,2,4,5,6,25,26,27]);
  for(const raw of ['1,51','2-1','1 and 3','0','999999999999999999999'])assert.throws(()=>parseNumbers(raw,valid));
  for(const v of ['[]','{"type":"ffxiv-blue-mage","schemaVersion":1,"collected":[1]}','{"type":"ffxiv-beastmaster","schemaVersion":1,"collected":[-1]}'])assert.throws(()=>parseBackup(v));
  assert.deepEqual([...parseBackup(backup(new Set([1,999])))],[1,999]);
});

test('the default book has 25 beasts per page, preserving No.1–25 and No.26–50',()=>{
  const a=setup();try{
    assert.deepEqual(a.ids(),Array.from({length:25},(_,i)=>i+1));
    a.click('#paginationTop [data-page="2"]');assert.deepEqual(a.ids(),Array.from({length:25},(_,i)=>i+26));
    assert.equal(a.$('paginationTop').querySelectorAll('[aria-current="page"]').length,1);
    assert.match(a.$('viewHint').textContent,/5 × 5/);
    assert.equal(a.$('appContent').hidden,false);assert.equal(a.$('openRecords').disabled,false);
  }finally{a.close();}
});

test('checks persist after reload; missing-filter cards remain until explicit refresh',()=>{
  const a=setup();try{
    a.input('status','missing','change');a.click('#beastGrid [data-check="1"]');
    assert.equal(a.$('ownedCount').textContent,'1');assert.ok(a.saved().has(1));
    assert.ok(a.ids().includes(1));assert.equal(a.$('refreshResults').hidden,false);
    assert.equal(a.d.querySelector('[data-check="1"]').getAttribute('aria-pressed'),'true');
    const b=setup(a.w.localStorage.getItem(KEY));try{assert.equal(b.$('ownedCount').textContent,'1');}finally{b.close();}
    a.click('#refreshResults');assert.ok(!a.ids().includes(1));assert.equal(a.$('resultCount').textContent,'49종');
    a.click('#undo');assert.equal(a.$('ownedCount').textContent,'0');a.click('#refreshResults');assert.ok(a.ids().includes(1));
  }finally{a.close();}
});

test('page bulk check touches only the current 25 IDs and supports undo',()=>{
  const a=setup([1]);try{
    a.click('#paginationTop [data-page="2"]');a.click('#markPage');
    assert.deepEqual([...a.saved()],[1,...Array.from({length:25},(_,i)=>i+26)]);
    a.click('#undo');assert.deepEqual([...a.saved()],[1]);
  }finally{a.close();}
});

test('IME composition input searches the currently composed final initial',()=>{
  const a=setup();try{
    a.input('search','ㅊㅅ');a.$('search').value='ㅊㅅㅁ';
    a.$('search').dispatchEvent(new a.w.InputEvent('input',{data:'ㅁ',isComposing:true,bubbles:true}));
    assert.deepEqual(a.ids(),[2]);a.input('search','no.50');assert.deepEqual(a.ids(),[50]);
    a.click('#clearSearch');assert.equal(a.ids().length,25);
  }finally{a.close();}
});

test('place view supports sources, shared checks, and acquisition-filter handoff',()=>{
  const a=setup();try{
    a.input('method','exchange','change');a.click('#placeView');
    assert.equal(a.d.querySelectorAll('.place-group').length,2);
    assert.equal(a.d.querySelectorAll('#placeGroups .beast-tile').length,15);
    a.click('#placeGroups [data-detail="50"]');assert.ok(a.$('detailDialog').open);
    a.click('#detailBody [data-route="duty:92"]');
    assert.equal(a.$('detailDialog').open,false);assert.equal(a.$('status').value,'missing');assert.equal(a.$('method').value,'duty');assert.equal(a.$('place').value,'duty:92');
    assert.ok(a.$('placeGroups').textContent.includes('고대인의 미궁'));
  }finally{a.close();}
});

test('details distinguish starter quest from capture and merchant coordinates from unverified capture locations',()=>{
  const a=setup();try{
    a.click('[data-detail="1"]');let text=a.$('detailBody').textContent;
    assert.match(text,/마수를 조련하는 사람들/);assert.match(text,/진행 중 지급/);assert.doesNotMatch(text,/필드 포획/);
    a.click('#closeDetail');a.input('search','50');a.click('[data-detail="50"]');text=a.$('detailBody').textContent;
    for(const expected of ['크리스탈 타워: 고대인의 미궁','고순도 마수핵 40개','탐식의 거틀러','상인 위치','X:21.9 · Y:22.6','파악하기'])assert.ok(text.includes(expected),expected);
    assert.equal(a.$('detailBody').querySelector('.location-map'),null,'merchant coordinates are not used as capture pins');
    assert.equal(a.$('closeDetail').closest('.dialog-body'),null,'close control lives outside the scrolling body');
    assert.ok([...a.$('detailBody').querySelectorAll('a')].every(a=>a.href.startsWith('https://')));
    a.click('#detailBody [data-check="50"]');assert.equal(a.d.querySelector('#beastGrid [data-check="50"]').getAttribute('aria-pressed'),'true');
  }finally{a.close();}
});

test('missing image leaves a readable numbered fallback',()=>{
  const a=setup();try{
    const img=a.d.querySelector('.beast-art img');img.dispatchEvent(new a.w.Event('error'));
    assert.equal(img.hidden,true);assert.equal(img.parentElement.querySelector('.icon-fallback').textContent,'01');
    assert.match(img.closest('button').getAttribute('aria-label'),/No.1 쿠시/);
  }finally{a.close();}
});

test('number registration and JSON imports merge, preserve future IDs, reject wrong files atomically',()=>{
  const a=setup([1,999]);try{
    a.click('#openRecords');a.input('ownedNumbers','2-4,50');a.click('#applyNumbers');assert.deepEqual([...a.saved()],[1,2,3,4,50,999]);
    a.input('backupText',backup(new Set([3,5,1000])));a.click('#applyBackup');
    assert.deepEqual([...a.saved()],[1,2,3,4,5,50,999,1000]);assert.equal(a.$('ownedCount').textContent,'6');
    assert.match(a.$('recordMessage').textContent,/현재 목록에 없는 1종/);
    const before=a.w.localStorage.getItem(KEY);a.input('backupText','{"type":"ffxiv-beastmaster","schemaVersion":1,"collected":[7,"8"]}');a.click('#applyBackup');
    assert.equal(a.w.localStorage.getItem(KEY),before);assert.match(a.$('recordMessage').textContent,/백업 파일/);
    a.input('ownedNumbers','6,51');assert.equal(a.$('applyNumbers').disabled,true);assert.equal(a.w.localStorage.getItem(KEY),before);
  }finally{a.close();}
});

test('mutations and undo preserve unrelated writes in other tabs; storage events refresh check state',()=>{
  const a=setup([1]);try{
    a.w.localStorage.setItem(KEY,backup(new Set([1,20])));a.click('[data-check="2"]');assert.deepEqual([...a.saved()],[1,2,20]);
    a.w.localStorage.setItem(KEY,backup(new Set([1,2,20,30])));a.click('#undo');assert.deepEqual([...a.saved()],[1,20,30]);
    a.w.localStorage.setItem(KEY,backup(new Set([2,3])));a.w.dispatchEvent(new a.w.StorageEvent('storage',{key:KEY}));
    assert.equal(a.$('ownedCount').textContent,'2');assert.equal(a.d.querySelector('[data-check="1"]').getAttribute('aria-pressed'),'false');
    assert.equal(a.d.querySelector('[data-check="3"]').getAttribute('aria-pressed'),'true');assert.equal(a.$('undo').hidden,true);
  }finally{a.close();}
});

test('corrupt or unavailable storage cannot be overwritten by a check',()=>{
  const a=setup('unreadable existing record');try{
    a.click('[data-check="1"]');assert.equal(a.w.localStorage.getItem(KEY),'unreadable existing record');assert.equal(a.$('ownedCount').textContent,'0');
  }finally{a.close();}
  const b=setup([1]);try{
    b.w.Storage.prototype.setItem=function(){throw Error('quota');};b.click('[data-check="2"]');
    assert.equal(b.$('ownedCount').textContent,'1');assert.deepEqual([...b.saved()],[1]);assert.match(b.$('noticeText').textContent,/저장하지 못/);
  }finally{b.close();}
});

test('portal and sitemap link the collection, leaving the ocean log unlisted',()=>{
  const portal=new JSDOM(readFileSync(new URL('../../index.html',import.meta.url),'utf8')).window.document;
  assert.equal(portal.querySelectorAll('.tool-link').length,8);assert.equal(portal.querySelector('.collection-count strong').textContent,'08');
  assert.ok(portal.querySelector('.tool-link[href="./beastmaster/"]'));assert.equal(portal.querySelector('a[href*="ocean-fishing"]'),null);
  const sitemap=readFileSync(new URL('../../sitemap.xml',import.meta.url),'utf8');assert.match(sitemap,/\/ffxiv\/beastmaster\//);assert.doesNotMatch(sitemap,/ocean-fishing/);
});
