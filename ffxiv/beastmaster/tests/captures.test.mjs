import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {create,KEY,backup,parseBackup,mapPosition} from '../engine.js';
import {mount} from '../app.js';
import {pinGroups} from '../atlas.js';
const read=name=>JSON.parse(readFileSync(new URL(`../${name}`,import.meta.url)));
const data=read('data.json'),captures=read('captures.json'),reports=read('capture-reports.json'),locations=read('locations.json'),model=create(data,locations,captures);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
function setup(seed=[],source=captures){
  const dom=new JSDOM(html,{url:'https://example.test/',pretendToBeVisual:true}),w=dom.window,d=w.document;
  w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  w.localStorage.setItem(KEY,backup(new Set(seed)));mount(w,data,locations,source);
  const $=id=>d.getElementById(id),click=q=>{const b=d.querySelector(q);assert.ok(b,q);b.click();},input=(id,value,event='change')=>{$(id).value=value;$(id).dispatchEvent(new w.Event(event,{bubbles:true}));};
  return {d,w,$,click,input,close:()=>w.close(),saved:()=>parseBackup(w.localStorage.getItem(KEY))};
}
const region=name=>captures.regions.find(r=>r.englishName===name).key;

test('all reported targets survive source pairing, including alternatives, while gourds and starter are excluded',()=>{
  const expected=reports.rows.reduce((n,r)=>n+r.targets.filter(t=>/^Lv /.test(t)).reduce((n,t)=>n+t.split(' or ').length,0),0);
  assert.equal(captures.targets.length,expected);assert.equal(expected,76);assert.equal(model.capturesByBeast.get(1).length,0);
  assert.equal(new Set(captures.targets.map(t=>t.id)).size,expected);
  for(const t of captures.targets){assert.ok(t.source.url.endsWith(`/beasts/${t.beastId}`));assert.match(t.source.target,/^Lv /);assert.ok(captures.regions.some(r=>r.key===t.regionKey));if(t.coordinates){assert.equal(t.status,'reported');mapPosition(t.coordinates,captures.maps[t.mapId].sizeFactor);}}
  assert.deepEqual(model.capturesByBeast.get(2).map(t=>t.name),['청설모','마멋']);
  assert.equal(captures.targets.find(t=>t.englishName==='Black Eft').npcNameIds[0],196,'do not match the FATE boss called the Black Eft');
  const tortoise=model.capturesByBeast.get(25)[0];assert.equal(tortoise.status,'conflict');assert.equal(tortoise.coordinates,null);assert.match(tortoise.source.location,/Western Thanalan/);
  for(const name of ['Antling','Behemoth','Infernal Drake']){const t=captures.targets.find(t=>t.englishName===name);assert.equal(t.status,'name-pending');assert.equal(t.npcNameIds.length,0);assert.ok(t.note);}
});

test('actual target names and initials find beasts and alternate routes without duplicate species in a place',()=>{
  assert.deepEqual(model.filter(new Set(),{query:'마멋'}).map(b=>b.id),[2]);
  assert.ok(model.filter(new Set(),{query:'ㅁㅁ'}).some(b=>b.id===2));
  assert.deepEqual(model.filter(new Set(),{query:'딱딱지게'}).map(b=>b.id),[15]);
  const copperbell=model.groups(data.beasts).find(r=>r.name==='구리종 광산');
  assert.deepEqual(copperbell.entries.map(e=>e.beast.id),[7,17,27,29,40]);
  assert.equal(new Set(copperbell.entries.map(e=>e.beast.id)).size,copperbell.entries.length);
  assert.equal(model.filter(new Set(),{method:'duty',place:region('Copperbell Mines')}).length,5);
});

test('regional atlas includes every reported target, pins select matching rows, and does not bulk-check other regions',()=>{
  const a=setup();try{a.click('#mapView');const visible=model.regionTargets(region('Central Shroud'),data.beasts);
    assert.equal(a.d.querySelectorAll('.atlas-target').length,visible.length);assert.equal(a.d.querySelectorAll('.atlas-pin').length,pinGroups(visible).length);
    assert.equal(a.$('markPage').hidden,true);assert.equal(a.$('collectionLayoutSwitch').hidden,true);assert.match(a.$('mapCount').textContent,/8종.*9건/);
    const pin=[...a.d.querySelectorAll('[data-pin-targets]')].find(e=>e.dataset.pinTargets.includes('41:'));pin.click();assert.match(a.$('mapSelection').textContent,/검은 큰도롱뇽/);assert.ok(a.d.querySelector('.atlas-target.selected'));
    a.click('#numberView');assert.equal(a.$('collectionLayoutSwitch').hidden,false);assert.equal(a.d.querySelectorAll('#beastGrid .beast-tile').length,25);assert.equal(a.saved().size,0);
  }finally{a.close();}
});

test('missing filtering stages removal; same beast checks and undo sync all targets and pins',()=>{
  const a=setup([2,999]);try{a.click('#mapView');a.input('status','missing');assert.equal(a.d.querySelector('#regionAtlas [data-check="2"]'),null);
    a.click('#regionAtlas [data-check="34"]');assert.ok(a.saved().has(34));assert.ok(a.saved().has(999));
    const checks=[...a.d.querySelectorAll('#regionAtlas [data-check="34"]')];assert.equal(checks.length,2);assert.ok(checks.every(b=>b.getAttribute('aria-pressed')==='true'));assert.equal(a.$('refreshResults').hidden,false);
    a.click('#refreshResults');assert.equal(a.d.querySelector('#regionAtlas [data-check="34"]'),null);
    a.click('#undo');a.click('#refreshResults');assert.equal(a.saved().has(34),false);assert.equal(a.d.querySelectorAll('#regionAtlas [data-check="34"]').length,2);
  }finally{a.close();}
});

test('co-located targets remain selectable, conflicting and missing coordinates are listed without pins',()=>{
  const a=setup();try{a.click('#mapView');a.input('mapRegion',region('Central Thanalan'));
    const shared=[...a.d.querySelectorAll('[data-pin-targets]')].find(b=>b.dataset.pinTargets.includes('2:')&&b.dataset.pinTargets.includes('10:'));assert.ok(shared);shared.click();assert.match(a.$('mapSelection').textContent,/마멋/);assert.match(a.$('mapSelection').textContent,/거대 말벌/);
    assert.match(a.$('regionAtlas').textContent,/위치 확인 필요/);assert.equal(a.d.querySelector('[data-pin-targets*="25:"]'),null);
    a.input('mapRegion',region('East Shroud'));assert.equal(a.d.querySelectorAll('.atlas-pin').length,0);assert.match(a.$('regionAtlas').textContent,/따끔한 소피.*→ 땅벌/);assert.match(a.$('mapCount').textContent,/좌표 미등록 1건/);
    a.input('mapRegion',region('Cutter\'s Cry'));assert.equal(a.d.querySelector('.region-map'),null);assert.equal(a.d.querySelectorAll('.atlas-target').length,2);assert.match(a.$('regionAtlas').textContent,/개미 개체의 정확한 이름/);
  }finally{a.close();}
});

test('details open the selected region and retain actual sources, levels and collection state',()=>{
  const a=setup([2]);try{a.click('[data-detail="2"]');assert.match(a.$('detailBody').textContent,/Lv.1 마멋/);assert.match(a.$('detailBody').textContent,/포획 제보 원문/);
    a.click(`[data-open-region="${region('Central Thanalan')}"]`);assert.equal(a.$('detailDialog').open,false);assert.equal(a.$('mapRegion').value,region('Central Thanalan'));assert.match(a.$('mapSelection').textContent,/마멋/);assert.deepEqual([...a.saved()],[2]);
    a.d.querySelector('[data-atlas-map]').dispatchEvent(new a.w.Event('error'));assert.ok(a.d.querySelector('.atlas-map-failed'));assert.match(a.$('regionAtlas').textContent,/지도를 불러오지 못했어요/);assert.match(a.$('regionAtlas').textContent,/X:20 · Y:25/);assert.ok(a.d.querySelector('.target-actions a'));
  }finally{a.close();}
});

test('map errors or zero matches preserve recovery controls and do not block collection',()=>{
  const a=setup([],null);try{a.click('#mapView');assert.match(a.$('regionAtlas').textContent,/자료를 불러오지 못했어요/);a.click('#numberView');a.click('[data-check="1"]');assert.ok(a.saved().has(1));}finally{a.close();}
  const b=setup();try{b.click('#mapView');b.input('search','no.999','input');assert.match(b.$('regionAtlas').textContent,/조건에 맞는 포획 대상이 없어요/);assert.ok(b.$('mapRegion'));b.click('#resetFilters');assert.equal(b.d.querySelectorAll('.atlas-target').length,9);}finally{b.close();}
});
