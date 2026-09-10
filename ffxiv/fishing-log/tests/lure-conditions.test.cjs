const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../engine.js'),{D,KEY,open}=require('./helpers.cjs');

test('lure requirements come only from explicit skill conditions, not tug, bait or rarity',()=>{
 for(const route of [{},{bait:29717,tug:1,hookset:2},{aLure:0,mLure:0},{mLure:-1},{mLure:'2'},{aLure:4}])assert.deepEqual(E.lureRequirements(route),[]);
 assert.deepEqual(E.lureRequirements({mLure:2}).map(l=>[l.key,l.name,l.uses]),[['mLure','소박한 루어',2]]);
 assert.deepEqual(E.lureRequirements({aLure:3}).map(l=>[l.key,l.name,l.uses]),[['aLure','거대한 루어',3]]);
});

test('every catalog fish with a lure requirement exposes it before opening conditions',()=>{
 const p=open({plan:true});try{
  p.$('#showPlanner').click();p.$('#planCollectionMode').click();const before=p.storage.getItem(KEY);
  const fishes=D.fishes.filter(f=>f.routes.some(r=>E.lureRequirements(r).length));assert.ok(fishes.length>0);
  for(const f of fishes){
   p.$('#planSearch').value=f.name;p.$('#planRefresh').click();
   const card=p.$('.plan-card');assert.ok(card,f.name);assert.equal(p.$('.plan-inline-detail').hidden,true);
   for(const expected of E.lureRequirements(f.routes[0])){
    const badge=card.querySelector(`[data-lure-kind="${expected.key}"]`);assert.ok(badge,f.name);assert.ok(badge.textContent.includes(expected.name));assert.ok(badge.textContent.includes('메시지 필요'));
    assert.ok(badge.title.includes(expected.uses+'회'));assert.equal(new URL(badge.href).hash,'#lures');assert.equal(badge.querySelector('img').width,16);
   }
  }
  p.$('[data-plan-detail]').click();assert.ok(p.$('.plan-detail-conditions').textContent.includes('특수 메시지 필요'));
  p.$('#planSearch').value='표범참바리';p.$('#planRefresh').click();assert.equal(p.$('.plan-lure-badge'),null);assert.equal(p.storage.getItem(KEY),before);
 }finally{p.close();}
});

test('intuition prey lure badges identify the prey and are not claimed as a target requirement',()=>{
 const p=open({plan:true});try{
  p.$('#showPlanner').click();
  for(const [target,prey] of [['번개구체','황금참바리'],['세 날 범고래','무태상어']]){
   p.$('#planSearch').value=target;p.$('#planRefresh').click();
   assert.equal(p.$('.plan-tackle > .plan-lure-badge'),null);
   const prep=p.$('.plan-prep-lure');assert.ok(prep,target);assert.ok(prep.textContent.includes(prey));assert.equal(prep.querySelector('[data-lure-kind]').dataset.lureKind,'aLure');
  }
 }finally{p.close();}
});

test('Poteuka appears in collection planning with verified tackle, but respects big-fish and caught filters',()=>{
 const p=open({plan:true});try{
  const f=D.fishes.find(f=>f.id===52012);assert.ok(!D.missingConditions.includes(f.id));assert.equal(f.big,false);
  p.$('#showPlanner').click();p.$('#planSearch').value='포테우카';p.$('#planRefresh').click();assert.equal(p.$('.plan-card'),null);
  p.$('#planCollectionMode').click();let row=p.$('.plan-card');assert.ok(row);assert.equal(row.dataset.planAvailability,'always');
  assert.equal(row.querySelector('.plan-tug').textContent,'!!');assert.equal(row.querySelector('.plan-hookset').textContent,'강력한 낚아채기');assert.ok(row.querySelector('.plan-place').textContent.includes('하누의 물가'));assert.equal(row.querySelector('.plan-bait-link').textContent,'금속 스피너');assert.equal(row.querySelector('.plan-lure-badge'),null);assert.ok(p.planSnapshot().ids.includes(52012));
  p.$('[data-caught="52012"]').click();assert.equal(p.$('.plan-card'),null);assert.ok(!p.planSnapshot().ids.includes(52012));p.$('#undo').click();assert.ok(p.$('.plan-card'));
  p.$('#planSearch').value='';p.$('#planRefresh').click();const excluded=p.all('#planUnscheduled [data-fish-detail]').map(b=>+b.dataset.fishDetail);assert.ok(!excluded.includes(52012));assert.ok(D.missingConditions.filter(id=>D.fishes.find(f=>f.id===id).kind==='rod').every(id=>excluded.includes(id)));
 }finally{p.close();}
});
