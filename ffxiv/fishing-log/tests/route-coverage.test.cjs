const test=require('node:test'),assert=require('node:assert/strict');
const {D,KEY,open}=require('./helpers.cjs'),Forecast=require('../forecast.js'),weather=require('../weather-data.js');
const ocean=require('../../ocean-fishing/data/fish.json').fish;

test('all field log entries have source routes; remaining missing conditions belong to the ocean journal',()=>{
 const forecast=Forecast.create(D,weather),unresolved=[],preparation=[];
 for(const fish of D.fishes){
  const offshore=fish.routes.length>0&&fish.routes.every(r=>D.spots[r.spotKey]?.map===604);
  assert.ok(fish.routes.length,fish.name+' has no location');
  if(!offshore)assert.ok(fish.routes.some(r=>r.verified),fish.name+' has no verified route');
  if(fish.kind!=='rod')continue;
  for(const route of fish.routes){assert.ok(D.spots[route.spotKey],fish.name);if(!forecast.reason(route))assert.ok(route.bait,fish.name+' has no bait');}
  if(!offshore&&fish.routes.every(r=>forecast.reason(r))){
   if(fish.routes.every(r=>forecast.reason(r)==='생미끼·직감 선행 시간 별도 확인'))preparation.push(fish.id);
   else unresolved.push({id:fish.id,name:fish.name,reasons:fish.routes.map(r=>forecast.reason(r))});
  }
 }
 assert.deepEqual(unresolved,[]);
 assert.deepEqual(preparation,[4906,8763,23055,23056,24203,24994]);
 for(const id of D.missingConditions){
  const fish=D.fishes.find(f=>f.id===id);assert.ok(fish.routes.every(r=>D.spots[r.spotKey].map===604),fish.name);
  assert.ok(ocean.some(f=>f.id===id&&f.baits.length),fish.name+' missing from ocean journal');
 }
});

test('additional corrected fish appear with their own tackle and preserve collection records',()=>{
 const p=open({plan:true});try{
  p.$('#showPlanner').click();p.$('#planCollectionMode').click();const before=p.storage.getItem(KEY);
  for(const [id,name,spot,tug,hook] of [[52014,'이크에바지 가위','이크브라샤 저수지','!','섬세한 낚아채기'],[52015,'요에콰 먹물머리','조고 해협 서쪽','!!','강력한 낚아채기']]){
   p.$('#planSearch').value=name;p.$('#planRefresh').click();let row=p.$('.plan-card');assert.ok(row,name);
   assert.equal(row.dataset.planAvailability,'always');assert.equal(row.querySelector('.plan-tug').textContent,tug);assert.equal(row.querySelector('.plan-hookset').textContent,hook);
   assert.ok(row.querySelector('.plan-place').textContent.includes(spot));assert.equal(row.querySelector('.plan-bait-link').textContent,'금속 스피너');assert.equal(row.querySelector('.plan-lure-badge'),null);
   assert.ok(row.querySelector('.plan-bite-time').textContent.includes('중앙'));assert.ok(p.planSnapshot().ids.includes(id));
   p.$('#planBigMode').click();assert.equal(p.$('.plan-card'),null);p.$('#planCollectionMode').click();assert.ok(p.$('.plan-card'));
  }
  assert.equal(p.storage.getItem(KEY),before);
 }finally{p.close();}
});
