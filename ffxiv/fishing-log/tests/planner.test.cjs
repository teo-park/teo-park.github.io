const {test}=require('node:test'),assert=require('node:assert/strict'),{open,D,memory}=require('./helpers.cjs');
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
    const key='teo-ffxiv.fishing.plan.v1',v=JSON.parse(p.storage.getItem(key));v.settings.days.forEach(d=>d.enabled=false);p.storage.setItem(key,JSON.stringify(v));p.w.dispatchEvent(new p.w.StorageEvent('storage',{key}));assert.ok(p.planSnapshot().settings.days.every(d=>!d.enabled));assert.equal(p.all('.plan-card[data-plan-availability="timed"]').length,0);assert.ok(p.all('.plan-card[data-plan-availability="always"]').length);
  }finally{p.close();}
});
test('collection purpose includes normal and always fish in cards, bait preparation and notification targets',()=>{
  const p=open({plan:true}),normal=D.fishes.find(f=>f.kind==='rod'&&f.order===1),byId=new Map(D.fishes.map(f=>[f.id,f]));try{
    p.$('#showPlanner').click();p.$('#savePlay').click();assert.ok(p.all('.plan-card').every(c=>c.dataset.planKind==='big'));assert.ok(p.planSnapshot().ids.every(id=>byId.get(id).big));
    p.$('#planCollectionMode').click();assert.equal(p.$('#planRarity').value,'all');assert.ok(p.planSnapshot().includeAlways);assert.ok(p.planSnapshot().ids.includes(normal.id));assert.ok(p.all('[data-plan-kind="normal"]').length);
    p.$('#planSearch').value=normal.name;p.$('#planRefresh').click();assert.equal(p.$('.plan-name').textContent,normal.name);assert.equal(p.$('.plan-card').dataset.planAvailability,'always');assert.match(p.$('.plan-window').textContent,/상시/);assert.ok(p.$('#planPrep').textContent.length>0);
    p.$('.plan-card [data-caught]').click();assert.equal(p.$('.plan-card'),null);assert.ok(!p.planSnapshot().ids.includes(normal.id));p.$('#undo').click();assert.ok(p.planSnapshot().ids.includes(normal.id));
    p.$('#notifyAlways').click();assert.equal(p.planSnapshot().includeAlways,false);assert.ok(!p.planSnapshot().ids.includes(normal.id));assert.ok(p.$('.plan-card'),'turning off alerts does not remove static collection cards');
    p.$('#planBigMode').click();assert.equal(p.$('#planRarity').value,'big');assert.equal(p.$('.plan-card'),null);assert.ok(p.planSnapshot().ids.every(id=>byId.get(id).big));
  }finally{p.close();}
});
test('normal-only filtering controls alert targets, mode preferences survive reload and old settings migrate safely',()=>{
  const store=memory(),key='teo-ffxiv.fishing.plan.v1',byId=new Map(D.fishes.map(f=>[f.id,f]));let p=open({plan:true,storage:store});
  try{
    p.$('#showPlanner').click();p.$('#savePlay').click();const legacy=JSON.parse(store.getItem(key));delete legacy.purpose;delete legacy.rarities;delete legacy.alwaysAlerts;store.setItem(key,JSON.stringify(legacy));p.close();p=open({plan:true,storage:store});
    assert.equal(p.$('#planBigMode').getAttribute('aria-pressed'),'true');assert.equal(p.planSnapshot().includeAlways,false);
    p.$('#showPlanner').click();p.$('#planCollectionMode').click();p.change('#planRarity','normal');assert.ok(p.planSnapshot().ids.length);assert.ok(p.planSnapshot().ids.every(id=>!byId.get(id).big));assert.ok(p.all('.plan-card').every(c=>c.dataset.planKind==='normal'));
    p.change('#planAvailability','always');assert.ok(p.all('.plan-card').every(c=>c.dataset.planAvailability==='always'));p.change('#planAvailability','timed');assert.ok(p.all('.plan-card').every(c=>c.dataset.planAvailability==='timed'));
    p.$('#planToSpot').click();assert.equal(p.$('#rarity').value,'normal');assert.equal(p.$('#view').value,'spot');
    p.close();p=open({plan:true,storage:store});assert.equal(p.$('#planCollectionMode').getAttribute('aria-pressed'),'true');assert.equal(p.$('#planRarity').value,'normal');assert.equal(p.planSnapshot().includeAlways,true);
  }finally{p.close();}
});
