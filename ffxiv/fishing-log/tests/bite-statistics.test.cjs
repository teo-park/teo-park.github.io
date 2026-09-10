const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../engine.js'),{open}=require('./helpers.cjs');

test('weighted bin statistics resist sparse tails and average the two central observations for even counts',async()=>{
 const {summarize}=await import('../scripts/update-bite-times.mjs'),k='10|rod:1|1',allowed=new Set([k]);
 const row=(t,n)=>({itemId:10,spot:1,baitId:1,flooredBiteTime:t,occurences:n});
 // Unsorted bins and a duplicate must carry their observation weights, not
 // count as three equally likely durations or midpoint the full 10–101 range.
 assert.deepEqual(summarize([row(100,3),row(10,30),row(10,3)],allowed)[k],{min:10,max:101,samples:36,median:10.5,mean:18});
 assert.deepEqual(summarize([row(100,3),row(10,3)],allowed)[k],{min:10,max:101,samples:6,median:55.5,mean:55.5});
 assert.deepEqual(summarize([row(100,4),row(10,3)],allowed)[k],{min:10,max:101,samples:7,median:100.5,mean:61.9});
 assert.deepEqual(summarize([row(10,2),row(11,0),row(12,-1)],allowed),{});
});

test('older or missing observations are never assigned fabricated central estimates',()=>{
 const old=E.biteStats({min:5,max:70,samples:9});assert.equal(old.primary,'약 5–70초');assert.equal(old.central,'');assert.ok(!old.title.includes('평균'));
 const missing=E.biteStats(null);assert.equal(missing.primary,'시간 미확인');assert.equal(missing.central,'');
});

test('inline, modal and alternate-bait details use the same exact-route statistics as the planner',()=>{
 const p=open({plan:true});try{
  p.$('#showPlanner').click();p.$('#planCollectionMode').click();p.$('#planSearch').value='호수성게';p.$('#planRefresh').click();
  const observed=p.$('.plan-bite-time'),median=observed.textContent.match(/중앙 (\S+)초/)[1];
  assert.match(observed.title,/평균 약 \d/);assert.match(observed.title,/1초 구간별 건수/);
  p.$('[data-plan-detail]').click();
  assert.ok(p.$('.compare-compact-heading').textContent.includes(`중앙값 약 ${median}초`));assert.match(p.$('.compare-compact-heading').textContent,/평균 약/);
  const alternative=p.$('.bait-alternatives .bite-observation');assert.match(alternative.textContent,/중앙값 약.*평균 약.*약 \d+–\d+초/);
  p.$('.plan-detail-tools [data-fish-detail]').click();
  const target=p.$('#detailDialog .compare-target .bite-observation');assert.ok(target.textContent.includes(`중앙값 약 ${median}초`));assert.match(target.textContent,/평균 약/);
  assert.ok(p.$('#detailDialog .condition-tags').textContent.includes(`중앙값 약 ${median}초`));
 }finally{p.close();}
});
