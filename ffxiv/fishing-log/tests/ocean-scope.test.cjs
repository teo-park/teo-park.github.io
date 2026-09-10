const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../engine.js'),{D,KEY,open,memory}=require('./helpers.cjs'),M=E.create(D);

test('ocean scope partitions the rod log by ocean location without changing original book order or spear records',()=>{
 const all=M.filter(new Set(),{kind:'rod'}),field=M.filter(new Set(),{kind:'rod',scope:'field'}),ocean=M.filter(new Set(),{kind:'rod',scope:'ocean'});
 assert.equal(ocean.length,259);assert.equal(field.length,1258);assert.equal(field.length+ocean.length,all.length);
 assert.equal(new Set([...field,...ocean].map(f=>f.id)).size,all.length);
 assert.deepEqual(ocean.map(f=>f.order),all.filter(M.isOceanFish).map(f=>f.order));
 assert.ok(D.missingConditions.every(id=>ocean.some(f=>f.id===id)));
 assert.equal(M.filter(new Set(),{kind:'spear',scope:'field'}).length,289);assert.equal(M.filter(new Set(),{kind:'spear',scope:'ocean'}).length,0);
 assert.equal(M.isOceanFish({kind:'rod',routes:[]}),false);
 assert.equal(M.isOceanFish({kind:'rod',routes:[{spotKey:'missing'}]}),false);
 assert.ok(field.some(f=>f.routes.some(r=>D.spots[r.spotKey].area==='디아뎀 제도')));
});

test('collection scopes preserve checks and complete game pages; spear mode resets and hides the rod scope',()=>{
 const fish=D.fishes.find(M.isOceanFish),storage=memory({[KEY]:E.backup(new Set([fish.id,52012,999999]))}),p=open({storage});try{
  const before=storage.getItem(KEY);assert.equal(p.$('#collectionScope').value,'all');assert.equal(p.all('.fish-tile').length,100);
  p.change('#collectionScope','ocean');assert.match(p.$('#resultCount').textContent,/259종/);assert.equal(p.$('#oceanCollectionNote').hidden,false);
  assert.ok(p.all('#fishGrid [data-caught]').every(b=>M.isOceanFish(M.byId.get(+b.dataset.caught))));assert.equal(p.$(`[data-caught="${fish.id}"]`).getAttribute('aria-pressed'),'true');
  assert.match(p.$('#viewHint').textContent,/필터를 초기화/);
  p.change('#status','caught');assert.equal(p.all('.fish-tile').length,1);assert.equal(p.$('#fishGrid [data-caught]').dataset.caught,String(fish.id));
  p.change('#collectionScope','field');assert.equal(p.all('.fish-tile').length,1);assert.equal(p.$('#fishGrid [data-caught]').dataset.caught,'52012');
  p.$('#resetFilters').click();assert.equal(p.$('#collectionScope').value,'all');assert.equal(p.$('#fishGrid [data-caught]').dataset.caught,String(D.fishes[0].id));assert.match(p.$('#viewHint').textContent,/게임 도감 번호순/);
  p.change('#collectionScope','ocean');p.$('#spearMode').click();assert.equal(p.$('#oceanScopeField').hidden,true);assert.equal(p.$('#collectionScope').value,'all');assert.match(p.$('#resultCount').textContent,/289종/);
  p.$('#rodMode').click();assert.equal(p.$('#oceanScopeField').hidden,false);assert.equal(storage.getItem(KEY),before);
 }finally{p.close();}
});

test('planner excludes ocean fish from rows, review list and alerts, and links to their separate collection view',()=>{
 const p=open({plan:true});try{
  const before=p.storage.getItem(KEY);p.$('#showPlanner').click();p.$('#planCollectionMode').click();
  assert.ok(p.all('.plan-card [data-caught]').every(b=>!M.isOceanFish(M.byId.get(+b.dataset.caught))));
  const excluded=p.all('#planUnscheduled [data-fish-detail]').map(b=>+b.dataset.fishDetail);assert.deepEqual(excluded,[],'timed prerequisites now have their own plan rows');
  p.$('#planSearch').value='칠채천주';p.$('#planRefresh').click();assert.match(p.$('.plan-window').textContent,/준비 필요/);assert.equal(p.all('#planResults [data-preparation-fish]').length,5);
  assert.ok(p.planSnapshot().ids.every(id=>!M.isOceanFish(M.byId.get(id))));assert.ok(![...p.$('#planRegion').options].some(o=>o.value==='???'));
  p.$('#planSearch').value='송린가자미';p.$('#planRefresh').click();assert.equal(p.$('.plan-card'),null);assert.equal(p.$('#planUnscheduled [data-fish-detail]'),null);
  p.$('#planToOcean').click();assert.equal(p.$('#fishingPlanner').hidden,true);assert.equal(p.$('#collectionScope').value,'ocean');assert.equal(p.$('#search').value,'');assert.match(p.$('#resultCount').textContent,/259종/);
  p.$('#showPlanner').click();p.$('#planSearch').value='포테우카';p.$('#planRefresh').click();p.$('#planToSpot').click();assert.equal(p.$('#collectionScope').value,'field');assert.match(p.$('#resultCount').textContent,/1종/);assert.equal(p.storage.getItem(KEY),before);
 }finally{p.close();}
});
