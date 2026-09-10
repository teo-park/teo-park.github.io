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
test('progressive search keeps distant fish visible and finds both chances beyond 30 and 90 days',()=>{
  const from=Date.parse('2026-09-09T04:00:00Z'),real=F.create(D,W),fishes=[49794,49800,16754].map(id=>D.fishes.find(f=>f.id===id));
  const search=real.startSearch(fishes,F.defaults(),from);assert.equal(search.result.rows.length,3);assert.ok(search.result.rows.every(r=>r.start===null&&r.pending));
  let steps=0;while(search.result.pending&&steps++<100)search.step();assert.equal(search.result.pending,0);
  const reference=real.plan(fishes,F.defaults(),from,365);
  for(const row of search.result.rows){const expected=reference.rows.find(r=>r.fish.id===row.fish.id);assert.equal(row.start,expected.start);assert.equal(row.end,expected.end);assert.equal(row.nextStart,expected.nextStart);assert.equal(row.pending,false);}
  assert.ok(search.result.rows.find(r=>r.fish.id===49794).start>from+120*F.DAY);
});
test('minute refresh resumes distant searches, while changed routes and schedules start fresh',()=>{
  const from=Date.parse('2026-09-09T04:00:00Z'),real=F.create(D,W),fish=D.fishes.find(f=>f.id===49794),settings=F.defaults(),old=real.startSearch([fish],settings,from);
  old.step();old.step();const cursor=old.states.get(fish.id).to;assert.equal(old.result.rows[0].start,null);
  const fresh=real.startSearch([fish],settings,from+F.MINUTE,old);assert.equal(fresh.states.get(fish.id).to,cursor);
  const changed={...fish,routes:fish.routes.map(r=>({...r,bait:999}))};assert.ok(real.startSearch([changed],settings,from+F.MINUTE,old).states.get(fish.id).to<cursor);
  const times=F.defaults();times.days[0].start='19:00';assert.ok(real.startSearch([fish],times,from+F.MINUTE,old).states.get(fish.id).to<cursor);
});
test('disabled sessions, too-short windows and unsupported weather cannot cause endless searches',()=>{
  const fish={id:1,routes:[route({spawn:1,duration:1})]},settings=daily('20:00','23:00');settings.minMinutes=5;
  const short=m.startSearch([fish],settings,Date.now());assert.equal(short.result.pending,0);assert.match(short.result.rows[0].unavailableReason,/최소 도전/);
  settings.minMinutes=1;settings.days.forEach(d=>d.enabled=false);const disabled=m.startSearch([fish],settings,Date.now());assert.equal(disabled.result.pending,0);assert.equal(disabled.result.rows[0].start,null);assert.match(disabled.result.rows[0].unavailableReason,/접속 요일/);
  const invalid=m.startSearch([{id:2,routes:[route({weathers:[999]})]}],F.defaults(),Date.now());assert.equal(invalid.result.pending,0);assert.equal(invalid.result.excluded.length,1);
});
test('five-chance timeline merges duplicate routes and preserves active and midnight-spanning windows',()=>{
  const r=route({spawn:23,duration:3}),fish={id:1,routes:[r,{...r}]},from=24*F.ET_HOUR;
  const search=m.startTimeline(fish,from);
  assert.equal(search.result.pending,false);assert.equal(search.result.chances.length,5);
  for(const [i,c] of search.result.chances.entries()){
    assert.equal(c.start,(23+i*24)*F.ET_HOUR);assert.equal(c.end,(26+i*24)*F.ET_HOUR);assert.deepEqual(c.routes,[0,1]);
  }
});
test('five-chance timeline crosses distant search chunks and matches full-range play opportunities',()=>{
  const from=Date.parse('2026-09-09T04:00:00Z'),real=F.create(D,W),fish=D.fishes.find(f=>f.id===49794),settings=F.defaults();
  const search=real.startTimeline(fish,from,{settings});assert.ok(search.result.pending);
  let steps=0;while(search.result.pending&&steps++<100)search.step();
  assert.equal(search.result.pending,false);assert.equal(search.result.chances.length,5);assert.ok(search.result.chances[0].start>from+120*F.DAY);
  const expected=F.merge(real.opportunities(fish,settings,from,from+3000*F.DAY)).slice(0,5);
  assert.deepEqual(search.result.chances.map(c=>[c.start,c.end]),expected.map(c=>[c.start,c.end]));
});
test('timeline handles always, unsupported and impossible play settings without fake dates',()=>{
  assert.equal(m.startTimeline({id:1,routes:[route()]},0).result.always,true);
  assert.match(m.startTimeline({id:2,routes:[route({verified:false})]},0).result.reason,/확인/);
  const settings=daily('20:00','23:00'),fish={id:3,routes:[route({spawn:1,duration:1})]};settings.days.forEach(d=>d.enabled=false);
  const result=m.startTimeline(fish,0,{settings}).result;assert.equal(result.pending,false);assert.equal(result.chances.length,0);assert.match(result.reason,/접속 요일/);
  assert.equal(m.startTimeline(fish,0).result.chances.length,5,'actual openings remain available outside disabled play sessions');
});
