const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../forecast.js'),W=require('../weather-data.js'),{D,open,KEY}=require('./helpers.cjs');
const real=F.create(D,W),fish=id=>D.fishes.find(f=>f.id===id),now=Date.parse('2026-09-11T06:00:00Z');

function fixture(){
  const route=(spawn,duration,rest={})=>({spotKey:'a',verified:true,...(spawn===null?{}:{spawn,duration}),...rest});
  const fishes=[
    {id:1,fish:true,routes:[route(0,2)]},
    {id:2,fish:true,routes:[route(null,null,{bait:1})]},
    {id:3,fish:true,routes:[route(4,2)]},
    {id:4,fish:true,routes:[route(8,2)]},
    {id:9,fish:true,big:true,kind:'rod',routes:[route(null,null,{predators:[{id:2,amount:3},{id:3,amount:2},{id:4,amount:5}]})]},
  ];
  const data={fishes,related:{},spots:{a:{map:1}}},weather={byMap:{1:[{weatherId:1,rate:100}]},specialMaps:[]};
  return {fishes,data,weather,forecast:F.create(data,weather),target:fishes.at(-1)};
}
test('separate ingredient windows form a sequential preparation plan rather than an intersection',()=>{
  const {forecast,target}=fixture(),plan=forecast.startIntuitionPreparation(target,0).result.plan;
  assert.equal(plan.preparationStart,0);assert.equal(plan.start,8*F.ET_HOUR);assert.equal(plan.end,10*F.ET_HOUR);
  assert.deepEqual(plan.steps.map(p=>[p.id,p.amount]),[[2,3],[3,2],[4,5]]);
  assert.equal(plan.steps[0].end,2*F.ET_HOUR,'the mooch source limits fresh acquisition of ingredient 2');
  const restarted=forecast.startIntuitionPreparation(target,3*F.ET_HOUR).result.plan;
  assert.equal(restarted.preparationStart,4*F.ET_HOUR);assert.equal(restarted.start,24*F.ET_HOUR);
  assert.equal(restarted.lastId,2,'expired ingredients are not assumed already caught');
});
test('overlapping windows keep a final preparation opportunity without inventing a catch duration',()=>{
  const {fishes,data,weather,target}=fixture();fishes[0].routes[0].duration=16;fishes[2].routes[0].spawn=0;
  const plan=F.create(data,weather).startIntuitionPreparation(target,0).result.plan;
  assert.equal(plan.start,8*F.ET_HOUR);assert.equal(plan.end,16*F.ET_HOUR);assert.equal(plan.lastId,2);
  assert.deepEqual(plan.steps.map(p=>p.id),[3,4,2]);
});
test('missing, cross-spot, cyclic and nested-intuition prerequisites do not generate times',()=>{
  for(const mutate of [f=>f[0].routes[0].verified=false,f=>f[0].routes[0].spotKey='b',f=>f[0].routes[0].bait=2,f=>f[0].routes[0].predators=[{id:3,amount:1}]]){
    const {fishes,data,weather,target}=fixture();mutate(fishes);
    const result=F.create(data,weather).startIntuitionPreparation(target,0).result;
    assert.equal(result.plan,null);assert.equal(result.pending,false);assert.ok(result.reason);
  }
});
test('real Warden and Kuno plans preserve requirements while other intuition targets retain their own windows',()=>{
  const plan=real.startIntuitionPreparation(fish(24994),now).result.plan;
  assert.deepEqual(plan.steps.map(p=>[p.id,p.amount]).sort((a,b)=>a[0]-b[0]),[[23056,3],[24203,3],[24204,5]]);
  assert.equal(plan.preparationStart,Math.min(...plan.steps.map(p=>p.start)));
  assert.equal(plan.start,Math.max(...plan.steps.map(p=>p.start)));
  assert.ok(plan.preparationStart>real.startTimeline(fish(21177),now).result.chances[0].start,'later prerequisite windows avoid several hours of unnecessary waiting');
  assert.ok(plan.start-plan.preparationStart<F.ET_DAY);
  const single=real.startIntuitionPreparation(fish(8763),now).result.plan;
  assert.equal(single.lastId,8762);assert.equal(single.steps.length,1);assert.equal(single.preparationStart,single.start);
  for(const id of [33244,41412,24993])assert.equal(real.startIntuitionPreparation(fish(id),now).result.plan,null);
});
test('numeric preparation and intuition times appear in all views, refresh after expiry, and never change collection or alerts',()=>{
  const p=open({plan:true});try{
    Object.defineProperty(p.d,'hidden',{value:false,configurable:true});let time=now;p.w.Date.now=()=>time;
    const before=p.storage.getItem(KEY);
    p.$('#showPlanner').click();p.$('#planSearch').value='칠채천주';p.$('#planRefresh').click();
    const settings=JSON.stringify(p.planSnapshot()),selector='[data-intuition-target="24994"]';
    assert.equal(p.all('#planResults '+selector).length,2);
    const summary=p.$('#planResults .intuition-summary');assert.match(summary.textContent,/준비 시작 → 직감 가능/);assert.match(summary.textContent,/9\. 11\./);assert.doesNotMatch(summary.textContent,/완성|계산 중/);
    const plan=p.$('#planResults .intuition-plan');assert.match(plan.textContent,/남채어 ×3/);assert.match(plan.textContent,/등채어 ×3/);assert.match(plan.textContent,/녹채어 ×5/);assert.match(plan.textContent,/직감 종료 시각은 아닙니다/);
    assert.equal(p.$('#planResults .plan-card').dataset.planNow,'false');
    const prior=plan.textContent;time=real.startIntuitionPreparation(fish(24994),time).result.plan.steps[0].end;
    p.w.FishingPreparationView.refresh();assert.notEqual(plan.textContent,prior);
    p.$('#planResults .plan-name[data-fish-detail="24994"]').click();assert.equal(p.$('#fishTimeline'),null);assert.ok(p.$('#detailBody '+selector));assert.equal(p.$('#detailBody [data-mooch-plan]'),null);p.$('#closeDetail').click();
    p.$('#showBook').click();p.$('[data-layout-choice="list"]').click();p.change('#search','칠채천주','input');assert.match(p.$('#collectionListViewport .intuition-summary').textContent,/직감 가능/);
    assert.equal(p.storage.getItem(KEY),before);assert.equal(JSON.stringify(p.planSnapshot()),settings);
  }finally{p.close();}
});
