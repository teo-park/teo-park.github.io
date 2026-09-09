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
    const key='teo-ffxiv.fishing.plan.v1',v=JSON.parse(p.storage.getItem(key));v.settings.days.forEach(d=>d.enabled=false);p.storage.setItem(key,JSON.stringify(v));p.w.dispatchEvent(new p.w.StorageEvent('storage',{key}));assert.ok(p.planSnapshot().settings.days.every(d=>!d.enabled));assert.ok(p.all('.plan-card[data-plan-availability="timed"]').every(c=>c.textContent.includes('접속 요일 설정 필요')&&c.dataset.planNow==='false'));assert.ok(p.all('.plan-card[data-plan-availability="always"]').length);
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
test('unlimited planner keeps a pending distant fish visible, then fills its date and year',async()=>{
  const p=open({plan:true});try{
    Object.defineProperty(p.d,'hidden',{value:false,configurable:true});p.w.Date.now=()=>Date.parse('2026-09-09T04:00:00Z');
    p.$('#showPlanner').click();p.$('#planSearch').value='두둑지갑';p.$('#planRefresh').click();
    assert.equal(p.$('#planHorizon'),null);assert.equal(p.$('.plan-name').textContent,'두둑지갑');assert.match(p.$('.plan-window').textContent,/찾는 중/);assert.equal(p.$('.plan-card').dataset.planNow,'false');
    for(let i=0;i<30&&p.$('.plan-window').textContent.includes('찾는 중');i++)await new Promise(r=>setTimeout(r,50));
    assert.match(p.$('.plan-window').textContent,/2027/);assert.match(p.$('#planCoverage').textContent,/기간 제한 없이/);
  }finally{p.close();}
});
test('condition panels expand under each row, preserve comparisons on refresh, and close independently',()=>{
  const p=open({plan:true});try{
    p.$('#showPlanner').click();p.$('#planCollectionMode').click();p.$('#planSearch').value='호수성게';p.$('#planRefresh').click();
    p.$('.plan-card [data-plan-detail]').click();const panel=p.$('.plan-inline-detail:not([hidden])');assert.ok(panel.textContent.includes('같은 입질 비교'));assert.equal(p.$('#detailDialog').open,false);assert.equal(p.$('.plan-card [data-plan-detail]').getAttribute('aria-expanded'),'true');
    const select=panel.querySelector('[data-compare-exclude]');select.value=select.options[1].value;select.dispatchEvent(new p.w.Event('change',{bubbles:true}));const choice=select.value;
    p.$('#planRefresh').click();assert.equal(p.$('.plan-inline-detail:not([hidden])'),panel);assert.equal(panel.querySelector('[data-compare-exclude]').value,choice);
    p.$('[data-plan-spot]').click();const another=p.all('.plan-card [data-plan-detail]').find(b=>b.dataset.planDetail!=='12720');another.click();assert.equal(p.all('.plan-inline-detail:not([hidden])').length,2);
    p.$('.plan-card [data-plan-detail="12720"]').click();assert.equal(p.$('#plan-detail-12720').hidden,true);assert.equal(p.all('.plan-inline-detail:not([hidden])').length,1);
    assert.equal(p.$('#detailDialog').open,false);assert.equal(p.$('#totalCount').textContent,'0 / 1,806');
  }finally{p.close();}
});
