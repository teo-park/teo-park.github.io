const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{open,D}=require('./helpers.cjs');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../expansion-data.js'),'utf8'),context);const X=context.window.FISHING_EXPANSIONS;
test('every current rod and spear fish has an explicit introduction expansion, including recent additions',()=>{
  assert.equal(Object.keys(X.byFish).length,D.fishes.length);
  for(const fish of D.fishes)assert.ok(Number.isInteger(X.byFish[fish.id])&&X.labels[X.byFish[fish.id]],fish.name);
  for(const [name,ex] of [['잘레라',0],['쿠노',0],['칠채천주',2],['별고래',4],['포테우카',5],['세 날 범고래',5]])assert.equal(X.byFish[D.fishes.find(f=>f.name===name).id],ex,name);
});
test('big-fish collection status filters preserve catch toggles and keep collected fish out of notifications',()=>{
  const p=open({plan:true});try{
    p.w.Date.now=()=>Date.parse('2026-09-09T11:00:00Z');p.$('#showPlanner').click();p.$('#savePlay').click();p.$('#planSearch').value='잘레라';p.$('#planRefresh').click();
    const fish=D.fishes.find(f=>f.name==='잘레라');assert.equal(p.$('#planStatus').value,'missing');assert.ok(p.planSnapshot().ids.includes(fish.id));
    p.$('.plan-card [data-caught]').click();assert.equal(p.$('.plan-card'),null);
    p.change('#planStatus','caught');assert.equal(p.$('.plan-name').textContent,fish.name);assert.match(p.$('#planCount').textContent,/^수집 1종/);assert.match(p.$('.plan-collected').textContent,/✓ 수집/);assert.equal(p.$('.plan-card [data-caught]').getAttribute('aria-pressed'),'true');assert.equal(p.$('.plan-card [data-caught]').textContent,'수집');assert.ok(!p.planSnapshot().ids.includes(fish.id));
    p.change('#planStatus','all');p.$('.plan-card [data-caught]').click();assert.ok(p.$('.plan-card'));assert.equal(p.$('.plan-collected'),null);assert.equal(p.$('.plan-card [data-caught]').getAttribute('aria-pressed'),'false');assert.match(p.$('#planCount').textContent,/^전체 1종/);assert.ok(p.planSnapshot().ids.includes(fish.id));
    p.change('#planStatus','caught');assert.equal(p.$('.plan-card'),null);p.$('#undo').click();assert.ok(p.$('.plan-card'));assert.ok(!p.planSnapshot().ids.includes(fish.id));
    p.$('#planCollectionMode').click();assert.equal(p.$('#planStatusField').hidden,true);assert.equal(p.$('.plan-card'),null,'collection mode remains uncollected only');p.$('#planBigMode').click();assert.equal(p.$('#planStatusField').hidden,false);assert.equal(p.$('#planStatus').value,'caught');assert.ok(p.$('.plan-card'));
  }finally{p.close();}
});
test('expansions intersect rarity, collection, region and spot filters without narrowing notification targets',()=>{
  const p=open({plan:true});try{
    p.w.Date.now=()=>Date.parse('2026-09-09T11:00:00Z');p.$('#showPlanner').click();p.$('#savePlay').click();const targets=JSON.stringify(p.planSnapshot().ids);
    assert.equal(p.all('#planExpansion option').length,7);
    for(let ex=0;ex<6;ex++){
      p.change('#planExpansion',String(ex));assert.ok(p.$('.plan-card'),X.labels[ex]);
      for(const el of p.all('.plan-card [data-caught]'))assert.equal(X.byFish[el.dataset.caught],ex);
      assert.equal(JSON.stringify(p.planSnapshot().ids),targets);
    }
    p.change('#planExpansion','0');p.$('#planSearch').value='잘레라';p.$('#planRefresh').click();p.$('.plan-card [data-caught]').click();p.change('#planStatus','caught');assert.ok(p.$('.plan-card'));
    p.change('#planExpansion','1');assert.equal(p.$('.plan-card'),null);p.change('#planExpansion','0');assert.ok(p.$('.plan-card'));
    p.change('#planRegion','다날란');assert.equal(p.$('.plan-card'),null);p.change('#planRegion','all');p.$('[data-plan-spot]').click();assert.equal(p.$('#planActiveFilters').hidden,false);assert.ok(p.$('.plan-card'));p.change('#planExpansion','5');assert.equal(p.$('.plan-card'),null);assert.equal(p.$('#planActiveFilters').hidden,false,'spot chip stays explicit');p.$('[data-plan-clear-spot]').click();
    p.$('#planCollectionMode').click();p.$('#planSearch').value='포테우카';p.$('#planRefresh').click();assert.equal(p.$('.plan-name').textContent,'포테우카');p.change('#planExpansion','4');assert.equal(p.$('.plan-card'),null);
    p.change('#planExpansion','all');assert.equal(p.$('.plan-name').textContent,'포테우카');
  }finally{p.close();}
});
