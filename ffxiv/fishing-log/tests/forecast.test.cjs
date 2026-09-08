const {test}=require('node:test'),assert=require('node:assert/strict'),F=require('../forecast.js'),W=require('../weather-data.js'),{D}=require('./helpers.cjs');
const route=(extra={})=>({spotKey:'rod:1',verified:true,...extra}),data={spots:{'rod:1':{map:1}},fishes:[],related:{}},weather={byMap:{1:[{rate:50,weatherId:1},{rate:100,weatherId:2}]},specialMaps:[]},m=F.create(data,weather);
const daily=(start,end)=>({days:Array.from({length:7},()=>({enabled:true,start,end})),lead:10,minMinutes:1});
test('weather formula agrees with independent original unsigned algorithm, including bucket boundaries',()=>{
  function original(time){const unixSeconds=time/1000,bell=unixSeconds/175,increment=(bell+8-(bell%8))%24,totalDays=(unixSeconds/4200<<0)>>>0,calcBase=totalDays*100+increment,step1=((calcBase<<11)^calcBase)>>>0;return (((step1>>>8)^step1)>>>0)%100;}
  for(let t=Date.UTC(2026,0,1);t<Date.UTC(2026,0,5);t+=137291)assert.equal(F.weatherTarget(t),original(t));
  for(let n=100000;n<100100;n++){const t=n*F.WEATHER;assert.equal(F.weatherTarget(t),F.weatherTarget(t+F.WEATHER-1));assert.equal(F.weatherTarget(t-1),original(t-1));}
});
test('verified tables cover all ordinary weather-constrained catalog routes',()=>{const real=F.create(D,W);for(const fish of D.fishes)for(const r of fish.routes)if(r.verified&&!W.specialMaps.includes(D.spots[r.spotKey].map)&&r.oceanFishingTime===undefined&&r.weathers?.length)assert.ok(W.byMap[D.spots[r.spotKey].map],fish.name);assert.ok(real.reason(D.fishes.flatMap(f=>f.routes).find(r=>r.oceanFishingTime!==undefined)));});
test('ET overnight windows merge across weather blocks and have exact boundaries',()=>{
  const ranges=m.windows(route({spawn:23,duration:3}),0,3*F.ET_DAY);
  assert.deepEqual(ranges.slice(1,3),[{start:23*F.ET_HOUR,end:26*F.ET_HOUR},{start:47*F.ET_HOUR,end:50*F.ET_HOUR}]);
  assert.deepEqual(m.windows(route({spawn:6,duration:4}),7*F.ET_HOUR,11*F.ET_HOUR),[{start:6*F.ET_HOUR,end:10*F.ET_HOUR}]);
});
test('weather transitions inspect the previous weather period, not previous distinct weather',()=>{
  const r=route({weathers:[1],weathersFrom:[2]});const all=m.windows(r,100*F.WEATHER,200*F.WEATHER);
  assert.ok(all.length);for(const w of all){assert.equal(m.at(1,w.start),1);assert.equal(m.at(1,w.start-F.WEATHER),2);assert.equal(w.end-w.start,F.WEATHER);}
});
test('a Friday overnight session includes Saturday early hours and is half-open',()=>{
  const s=daily('22:00','02:00');s.days.forEach((d,i)=>d.enabled=i===5);const start=Date.parse('2026-09-12T00:30:00+09:00');
  assert.deepEqual(F.sessions(s,start,start+F.DAY),[{start:Date.parse('2026-09-11T22:00:00+09:00'),end:Date.parse('2026-09-12T02:00:00+09:00')}]);
  assert.equal(F.sessions(s,Date.parse('2026-09-12T02:00:00+09:00'),start+F.DAY).length,0);
  assert.throws(()=>F.validate(daily('20:00','20:00')));assert.throws(()=>F.validate(daily('24:00','02:00')));
});
test('playable minutes and alert lead are clipped to the session; no disabled-day alerts',()=>{
  const s=daily('20:00','23:00'),now=Date.parse('2026-09-08T19:00:00+09:00'),fish={id:1,routes:[route({spawn:0,duration:12})]};
  const list=m.opportunities(fish,s,now,now+F.DAY);assert.ok(list.length);for(const c of list){assert.ok(c.notifyAt>=c.sessionStart);assert.ok(c.end<=c.sessionEnd);assert.ok(c.end-c.start>=F.MINUTE);}
  s.days.forEach(d=>d.enabled=false);assert.deepEqual(m.opportunities(fish,s,now,now+F.DAY),[]);
});
test('catalog flags do not invent weather restrictions; unknown and special routes stay separate',()=>{
  const d={...data,fishes:[{id:1,weathered:true,routes:[route()]},{id:2,routes:[route({verified:false})]},{id:3,routes:[route({oceanFishingTime:0})]}]};
  const plan=F.create(d,weather).plan(d.fishes,daily('20:00','23:00'),Date.now(),2);assert.deepEqual(plan.always.map(f=>f.id),[1]);assert.deepEqual(plan.excluded.map(f=>f.id),[2,3]);
});
test('intuition-only fish with timed prerequisites are not mislabeled as always available',()=>{
  const real=F.create(D,W),fish=D.fishes.find(f=>f.id===24994);assert.ok(fish);assert.match(real.reason(fish.routes[0]),/선행 시간/);
  const plan=real.plan([fish],F.defaults(),Date.now(),1);assert.equal(plan.always.length,0);assert.equal(plan.excluded[0].id,24994);
});
