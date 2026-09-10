const {test}=require('node:test'),assert=require('node:assert/strict'),{open,KEY}=require('./helpers.cjs');
const MINUTE=60000;
test('collection badges use actual opening time with exact 5/15/30-minute boundaries and no expired or pending badges',()=>{
 const p=open({plan:true});try{
  const timing=p.w.FishingPlanner.timing,start=Date.parse('2026-09-10T20:00:00+09:00'),row={start,end:start+10*MINUTE,windowStart:start};
  const state=(at,purpose='collection',r=row)=>timing(r,at,purpose)?.state??null;
  assert.equal(state(start-30*MINUTE-1),null);assert.equal(state(start-30*MINUTE),'30');
  assert.equal(state(start-15*MINUTE-1),'30');assert.equal(state(start-15*MINUTE),'15');
  assert.equal(state(start-5*MINUTE-1),'15');assert.equal(state(start-5*MINUTE),'5');
  for(const [seconds,label] of [[300,'5분 전'],[299,'4분 전'],[240,'4분 전'],[239,'3분 전'],[180,'3분 전'],[179,'2분 전'],[120,'2분 전'],[119,'1분 전'],[60,'1분 전'],[59,'59초 전'],[30,'30초 전'],[1,'1초 전']]){
    const badge=timing(row,start-seconds*1000,'collection');assert.equal(badge.label,label);assert.equal(badge.state,'5');
  }
  assert.equal(timing(row,start-1,'collection').label,'1초 전','never display zero seconds before opening');
  assert.match(timing(row,start-119000,'collection').title,/1분 59초 남음/);
  assert.equal(state(start-1),'5');assert.equal(state(start),'now');assert.equal(state(row.end-1),'now');assert.equal(state(row.end),null);
  assert.equal(state(start-10*MINUTE,'big'),null);assert.equal(state(start,'big'),'now');
  assert.equal(state(start,'collection',{start:null,end:null,pending:true}),null);
  assert.equal(state(start,'collection',{always:true,start}),'now');
  // A later play-session start must not masquerade as a new fish opening.
  assert.equal(state(start-10*MINUTE,'collection',{...row,windowStart:start-20*MINUTE}),null);
  const badge=timing({...row,start:start+5*MINUTE},start-20*MINUTE,'collection');assert.equal(badge.state,'30');assert.match(badge.title,/20:00/);
 }finally{p.close();}
});
test('open collection list counts down minutes and seconds without resetting conditions or notification preferences',async()=>{
 const p=open({plan:true});try{
  let now=Date.parse('2026-09-09T10:00:00Z');p.w.Date.now=()=>now;
  p.$('#showPlanner').click();p.$('#planCollectionMode').click();p.$('#planSearch').value='잘레라';p.$('#planRefresh').click();
  p.$('.plan-card [data-plan-detail]').click();const panel=p.$('.plan-inline-detail:not([hidden])'),slot=p.$('[data-plan-timing]'),opening=+slot.dataset.opening,start=+slot.dataset.start,end=+slot.dataset.end;
  const collection=p.storage.getItem(KEY),preferences=JSON.stringify(p.planSnapshot());
  assert.equal(p.$('#planUpcomingHint').hidden,false);Object.defineProperty(p.d,'hidden',{value:false,configurable:true});
  const tick=async at=>{now=at;await new Promise(r=>setTimeout(r,1050));};
  await tick(opening-20*MINUTE);assert.equal(slot.textContent,'30분 전');assert.ok(slot.querySelector('.plan-soon-30'));
  await tick(opening-10*MINUTE);assert.equal(slot.textContent,'15분 전');assert.ok(slot.querySelector('.plan-soon-15'));assert.equal(p.$('.plan-card').dataset.planNow,'false');
  await tick(opening-5*MINUTE);assert.equal(slot.textContent,'5분 전');assert.ok(slot.querySelector('.plan-soon-5'));assert.equal(p.$('.plan-card').dataset.planNow,'false');
  await tick(opening-119000);assert.equal(slot.textContent,'1분 전');assert.match(slot.firstElementChild.title,/1분 59초 남음/);
  await tick(opening-59000);assert.equal(slot.textContent,'59초 전');
  await tick(opening-58000);assert.equal(slot.textContent,'58초 전');
  await tick(opening-1);assert.equal(slot.textContent,'1초 전');assert.equal(p.$('.plan-card').dataset.planNow,'false');
  await tick(start);assert.equal(slot.textContent,'지금');assert.equal(p.$('.plan-card').dataset.planNow,'true');
  await tick(end);assert.equal(slot.textContent,'');assert.equal(p.$('.plan-card').dataset.planNow,'false');assert.equal(p.$('.plan-inline-detail:not([hidden])'),panel);
  assert.equal(p.storage.getItem(KEY),collection);assert.equal(JSON.stringify(p.planSnapshot()),preferences);
  p.$('#planBigMode').click();assert.equal(p.$('#planUpcomingHint').hidden,true);assert.equal(p.$('.plan-soon-badge'),null);
 }finally{p.close();}
});
