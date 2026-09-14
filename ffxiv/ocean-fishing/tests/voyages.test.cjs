const {test}=require('node:test');
const assert=require('node:assert/strict');
const V=require('../scripts/voyages.js'),C=require('../scripts/collection.js');
const fixture=require('./fixtures/voyages.json'),data=require('../data/fish.json').fish;

test('every checklist entry finds the nearest five boardable departures in order',()=>{
 const first=Date.parse(fixture.firstDeparture);
 for(const now of [first-60000,first,first+15*60000,first+23*3600000])for(const f of data){
  const actual=V.forFish(f,now),expected=[];
  const beginning=V.upcoming(f.route,now,1)[0].start;
  for(let i=0;i<720&&expected.length<5;i++){
   const v=V.at(f.route,beginning+i*V.INTERVAL);
   const stopIndex=v.stops.findIndex(s=>s.stop===f.Stop&&(!f.spectral||f['TimeFrame'+s.time]==='Yes'));
   if(v.close>now&&stopIndex>=0)expected.push([v.start,stopIndex]);
  }
  assert.equal(actual.length,5,f.entryId);
  assert.deepEqual(actual.map(v=>[v.start,v.stopIndex]),expected,f.entryId);
  for(const v of actual){assert.ok(V.isDeparture(v.start));assert.equal(v.route,f.route);assert.equal(v.stops[v.stopIndex].stop,f.Stop);}
 }
});
test('fish departures include open registration but stop at the exact closing time',()=>{
 const start=Date.parse(fixture.firstDeparture),v=V.at('indigo',start);
 const f=data.find(f=>f.route==='indigo'&&V.available(f,v,0));
 for(const offset of [-1,0,15*60000-1])assert.equal(V.forFish(f,start+offset)[0].start,start);
 assert.ok(V.forFish(f,start+15*60000)[0].start>start);
 assert.equal(V.forFish({...f,Stop:'unknown'},start).length,0);
 assert.deepEqual(V.forFish({...f,route:'unknown'},start),[]);
 assert.deepEqual(V.forFish(f,start,0),[]);
 assert.equal(V.isDeparture(start+1),false);assert.equal(V.isDeparture(NaN),false);
});
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
 for(const flag of ['legendary','bigFish','spectralTrigger']){
  assert.equal(data.filter(f=>f[flag]).length,13,flag);
  for(const stop of new Set(data.map(f=>f.Stop)))assert.equal(data.filter(f=>f.Stop===stop&&f[flag]).length,1,flag+' at '+stop);
 }
 for(const name of ['Placodus','Glass Dragon'])assert.equal(data.find(f=>f.Fish===name).legendary,true,name);
 for(const name of ['Spectresaur','Spectral Wrasse','Spectral Snake Eel','Spectral Kotsu Zetsu'])assert.equal(data.find(f=>f.Fish===name).spectralTrigger,true,name);
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
