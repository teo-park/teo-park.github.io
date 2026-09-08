const {test}=require('node:test'),assert=require('node:assert/strict'),{open}=require('./helpers.cjs');
test('planner keeps the book accessible, saves overnight playtime and removes caught fish from alert targets',()=>{
  const p=open({plan:true});try{
    assert.equal(p.planSnapshot().saved,false);p.$('#showPlanner').click();assert.equal(p.$('#collectionPanel').hidden,true);assert.ok(p.all('.plan-card').length);
    p.change('#playStart5','22:00');p.change('#playEnd5','02:00');p.$('#savePlay').click();assert.equal(p.planSnapshot().saved,true);assert.equal(p.planSnapshot().settings.days[5].end,'02:00');
    const check=p.$('.plan-card [data-caught]'),id=+check.dataset.caught;assert.ok(p.planSnapshot().ids.includes(id));check.click();assert.ok(!p.planSnapshot().ids.includes(id));assert.equal(p.$(`.plan-card [data-caught="${id}"]`),null);
    p.$('#undo').click();assert.ok(p.planSnapshot().ids.includes(id));
    p.change('#planRegion','다날란');p.$('#planToBait').click();assert.equal(p.$('#collectionPanel').hidden,false);assert.equal(p.$('#view').value,'bait');assert.equal(p.$('#status').value,'missing');assert.equal(p.$('#region').value,'다날란');
  }finally{p.close();}
});
test('star-only alerts ignore the visual filter and cross-tab settings refresh the subscription snapshot',()=>{
  const p=open({plan:true});try{
    p.$('#showPlanner').click();p.$('#savePlay').click();const star=p.$('[data-plan-star]'),id=+star.dataset.planStar;star.click();p.change('#notificationScope','stars');assert.deepEqual([...p.planSnapshot().ids],[id]);
    p.change('#planRegion','다날란');assert.deepEqual([...p.planSnapshot().ids],[id]);
    const key='teo-ffxiv.fishing.plan.v1',v=JSON.parse(p.storage.getItem(key));v.settings.days.forEach(d=>d.enabled=false);p.storage.setItem(key,JSON.stringify(v));p.w.dispatchEvent(new p.w.StorageEvent('storage',{key}));assert.ok(p.planSnapshot().settings.days.every(d=>!d.enabled));assert.equal(p.all('.plan-card').length,0);
  }finally{p.close();}
});
