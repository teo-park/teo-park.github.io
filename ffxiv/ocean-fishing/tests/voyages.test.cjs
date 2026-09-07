const {test}=require('node:test');
const assert=require('node:assert/strict');
const V=require('../scripts/voyages.js'),C=require('../scripts/collection.js');
const fixture=require('./fixtures/voyages.json'),data=require('../data/fish.json').fish;
test('both native schedulers match a full 12-day rotation, including midnight skips',()=>{
 const first=Date.parse(fixture.firstDeparture);
 for(const route of ['indigo','ruby']){
  const actual=Array.from({length:144},(_,i)=>V.at(route,first+i*V.INTERVAL).number);
  assert.deepEqual(actual,fixture.routes[route].numbers);
  assert.deepEqual(Array.from({length:144},(_,i)=>V.at(route,first+(i+144)*V.INTERVAL).number),actual);
  assert.deepEqual(Array.from({length:144},(_,i)=>V.at(route,first+(i-144)*V.INTERVAL).number),actual);
 }
});
test('the last departure remains visible for one hour even after registration closes',()=>{
 const start=Date.parse(fixture.firstDeparture);
 for(const route of ['indigo','ruby']){
  for(const offset of [0,1,14*60000,15*60000,30*60000,60*60000]){
   const recent=V.upcoming(route,start+offset)[0];
   assert.equal(recent.start,start);assert.equal(recent.close,start+15*60000);
  }
  assert.equal(V.upcoming(route,start+60*60000+1)[0].start,start+V.INTERVAL);
  assert.equal(V.upcoming(route,start-1)[0].start,start);
 }
});
test('each voyage retains the same available species and 7.5 Ruby locations',()=>{
 for(const route of ['indigo','ruby']){
  const departures=V.upcoming(route,Date.parse(fixture.firstDeparture));
  const counts=departures.map(v=>new Set(data.filter(f=>f.route===route&&v.stops.some((_,i)=>V.available(f,v,i))).map(f=>f.id)).size);
  assert.deepEqual(counts,fixture.routes[route].uncaught);
 }
 for(const number of [1,4,7])assert.deepEqual(V.stops('ruby',number).map(s=>s.name),['이름 없는 섬','세이렌 해','사베니어 섬']);
});
test('normalized data preserves IDs, dependencies, missing quantities and game images without HTML',()=>{
 const fs=require('node:fs'),path=require('node:path');
 assert.equal(data.length,260);assert.equal(new Set(data.map(f=>f.id)).size,259);
 const catalog=C.createCatalog(data);
 for(const f of data){
  assert.ok(f.id>0);assert.ok(fs.existsSync(path.join(__dirname,'..',f.image)));
  assert.doesNotMatch(JSON.stringify(f),/<\/?[a-z][^>]*>/i);
  for(const dep of f.Dependencies)assert.ok(catalog.has(dep),f.Fish+' -> '+dep);
 }
 const core=require('../tools/build-data.cjs');
 for(const route of ['indigo','ruby']){
  const raw=core.parseCSV(fs.readFileSync(path.join(__dirname,`../fishdata/${route}-KO.csv`),'utf8'));
  const normalized=data.filter(f=>f.route===route);
  raw.forEach((f,i)=>{assert.equal(normalized[i].DH,f.DH);assert.equal(normalized[i].TH,f.TH);assert.deepEqual(normalized[i].Dependencies,C.dependencies(f));});
 }
});
