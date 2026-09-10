const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../forecast.js'),W=require('../weather-data.js'),{D,open,KEY}=require('./helpers.cjs');
const forecast=F.create(D,W),fish=id=>D.fishes.find(f=>f.id===id),now=Date.parse('2026-09-11T06:00:00Z');

test('intuition ingredients that require mooching do not classify their target as a mooch fish',()=>{
  assert.ok(forecast.preparations(fish(24994)).some(n=>n.children.some(c=>c.relation==='mooch')));
  for(const id of [24994,33244,41412]){
    assert.deepEqual(forecast.moochSources(fish(id)),[]);
    const search=forecast.startMoochPreparation(fish(id),now);
    assert.equal(search.result.plan,null);assert.equal(search.result.pending,false);
  }
  const indigo=forecast.startMoochPreparation(fish(24203),now).result.plan;
  assert.equal(indigo.source,21177);assert.equal(indigo.challenge,null);
  const firelight=forecast.startMoochPreparation(fish(23056),now).result.plan;
  assert.equal(firelight.source,22397);assert.equal(firelight.challenge,null);
});

test('Ruby Dragon connects the actual Ku\'er preparation and target weather/time windows',()=>{
  const f=fish(24993),search=forecast.startMoochPreparation(f,now);
  while(search.result.pending)search.step();
  const plan=search.result.plan;assert.equal(plan.source,24214);
  const own=forecast.windows(f.routes[plan.route],plan.challenge.start,plan.challenge.end).find(w=>w.start<=plan.challenge.start&&w.end>=plan.challenge.end);
  assert.ok(own);assert.equal(plan.challenge.end,own.end);
  assert.ok(plan.preparation.start<plan.challenge.start);assert.equal(plan.intuition,false);
});

function fixture(spawn){
  const source={id:1,fish:true,name:'생미끼',routes:[{verified:true,spotKey:'a',spawn:0,duration:2}]};
  const target={id:2,fish:true,name:'대상',routes:[{verified:true,spotKey:'a',bait:1,spawn,duration:3}]};
  return {target,forecast:F.create({fishes:[source,target],related:{},spots:{a:{map:1}}},{byMap:{1:[{weatherId:1,rate:100}]},specialMaps:[]})};
}
test('the source closing does not truncate the target, and a gap explicitly needs a held mooch',()=>{
  for(const spawn of [1,4]){
    const {target,forecast}=fixture(spawn),plan=forecast.startMoochPreparation(target,0).result.plan;
    assert.equal(plan.preparation.end,2*F.ET_HOUR);
    assert.equal(plan.challenge.start,spawn*F.ET_HOUR);
    assert.equal(plan.challenge.end,(spawn+3)*F.ET_HOUR);
    assert.equal(plan.hold,spawn===4);
  }
});

test('unverified and other-spot source routes cannot create a preparation interval',()=>{
  const {target}=fixture(4),source={id:1,fish:true,routes:[{spotKey:'a',verified:false,spawn:0,duration:2},{spotKey:'b',verified:true,spawn:0,duration:2}]};
  const engine=F.create({fishes:[source,target],related:{},spots:{a:{map:1},b:{map:1}}},{byMap:{1:[{weatherId:1,rate:100}]},specialMaps:[]});
  assert.equal(engine.startMoochPreparation(target,0).result.plan,null);
});

test('plan, catalog and dialog keep intuition waiting separate from mooch preparation without changing saved state',()=>{
  const p=open({plan:true});try{
    Object.defineProperty(p.d,'hidden',{value:false,configurable:true});p.w.Date.now=()=>now;
    p.$('#showPlanner').click();p.$('#planSearch').value='칠채천주';p.$('#planRefresh').click();
    const saved=p.storage.getItem(KEY),settings=JSON.stringify(p.planSnapshot());
    assert.equal(p.$('#planResults [data-mooch-plan]'),null);
    assert.match(p.$('.plan-window').textContent,/직감 준비 필요/);
    assert.match(p.$('.preparation-note').textContent,/지역에서 대기/);
    p.$('#planResults .plan-name').click();assert.equal(p.$('#detailBody [data-mooch-plan]'),null);
    assert.doesNotMatch(p.$('#fishTimeline').textContent,/준비 시간 → 도전 구간/);
    p.$('#closeDetail').click();
    p.$('#planSearch').value='홍룡';p.$('#planRefresh').click();
    const flow=p.$('#planResults [data-mooch-target="24993"]');assert.ok(flow);
    assert.match(flow.textContent,/준비 시간 → 도전 구간/);assert.match(flow.textContent,/준비 시간 · 쿠얼/);assert.match(flow.textContent,/도전 구간 · 홍룡/);
    p.$('#planResults .plan-name[data-fish-detail="24993"]').click();assert.ok(p.$('#detailBody [data-mooch-target="24993"]'));p.$('#closeDetail').click();
    p.$('#showBook').click();p.$('[data-layout-choice="list"]').click();p.change('#search','칠채천주','input');
    assert.equal(p.$('#collectionListViewport [data-mooch-plan]'),null);assert.match(p.$('#collectionListViewport .plan-window').textContent,/직감 준비 필요/);
    p.change('#search','남채어','input');
    const indigo=p.$('#collectionListViewport [data-mooch-target="24203"]');assert.ok(indigo);assert.match(indigo.textContent,/생미끼 확보 후 · 유지 중 도전/);
    assert.equal(p.storage.getItem(KEY),saved);assert.equal(JSON.stringify(p.planSnapshot()),settings);
  }finally{p.close();}
});
