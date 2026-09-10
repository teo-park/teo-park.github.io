const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../forecast.js'),W=require('../weather-data.js'),E=require('../engine.js'),{D,open,memory,KEY}=require('./helpers.cjs');
const real=F.create(D,W),fish=id=>D.fishes.find(f=>f.id===id);
const tick=()=>new Promise(resolve=>setTimeout(resolve,1100));

test('preparation times toggle live countdowns, retain focus, cross start/end and synchronize all views without collecting',async()=>{
  const p=open({plan:true});try{
    Object.defineProperty(p.d,'hidden',{value:false,configurable:true});
    let now=Date.parse('2026-09-10T13:00:00Z');p.w.Date.now=()=>now;
    const chance=real.startTimeline(fish(21177),now,{count:2}).result.chances[0];now=chance.start-2000;
    p.$('#showPlanner').click();p.$('#planSearch').value='칠채천주';p.$('#planRefresh').click();
    const selector='[data-preparation-fish="21177"] button[data-preparation-times]',before=p.storage.getItem(KEY),preferences=JSON.stringify(p.planSnapshot());
    let button=p.$('#planResults '+selector);assert.ok(button&&!button.disabled);assert.equal(button.getAttribute('aria-pressed'),'false');assert.match(button.textContent,/9\./);
    button.focus();button.click();assert.match(button.textContent,/시작까지 2초/);assert.match(button.textContent,/다음 출현까지/);
    now+=1000;await tick();assert.match(button.textContent,/시작까지 1초/);assert.equal(p.d.activeElement,button);
    now+=1000;await tick();assert.match(button.textContent,/종료까지/);assert.ok(button.querySelector('.preparation-now'));
    p.$('#planRefresh').click();button=p.$('#planResults '+selector);assert.equal(button.getAttribute('aria-pressed'),'true');assert.match(button.textContent,/종료까지/);
    now=chance.end;await tick();assert.match(button.textContent,/시작까지/);assert.equal(button.querySelector('.preparation-now'),null);
    p.$('.plan-name').click();const modal=p.$('#detailBody '+selector);assert.equal(modal.getAttribute('aria-pressed'),'true');modal.click();assert.equal(modal.getAttribute('aria-pressed'),'false');assert.match(modal.textContent,/9\./);assert.equal(button.getAttribute('aria-pressed'),'false');assert.equal(p.$('#detailTitle').textContent,'칠채천주');
    p.$('#closeDetail').click();p.$('#showBook').click();p.$('[data-layout-choice="list"]').click();p.change('#search','칠채천주','input');
    const catalog=p.$('#collectionListViewport '+selector);catalog.click();assert.match(catalog.textContent,/시작까지/);p.change('#search','칠채천주','input');assert.equal(p.$('#collectionListViewport '+selector).getAttribute('aria-pressed'),'true');
    assert.equal(p.storage.getItem(KEY),before);assert.equal(JSON.stringify(p.planSnapshot()),preferences);
  }finally{p.close();}
});
test('Warden preparation preserves intuition counts and follows timed mooch fish',()=>{
  const nodes=real.preparations(fish(24994));
  assert.deepEqual(nodes.map(n=>[n.id,n.amount,n.relation]),[[24203,3,'intuition'],[23056,3,'intuition'],[24204,5,'intuition']]);
  assert.equal(nodes[0].timed,false);assert.equal(nodes[1].timed,false);assert.equal(nodes[2].timed,true);
  assert.deepEqual(nodes[0].children.map(n=>[n.id,n.relation]),[[21177,'mooch']]);
  assert.deepEqual(nodes[1].children.map(n=>[n.id,n.relation]),[[22397,'mooch']]);
  const windows=real.startTimeline(nodes[0].children[0].fish,Date.parse('2026-09-10T13:00:00Z')).result.chances;
  assert.equal(windows.length,5);assert.ok(windows.every(w=>w.end-w.start===4*F.ET_HOUR));
});
test('Triple Threat includes both timed and weather-only intuition fish',()=>{
  const nodes=real.preparations(fish(52011));
  assert.deepEqual(nodes.map(n=>[n.id,n.amount,n.timed]),[[43795,2,true],[52006,1,true]]);
  assert.ok(nodes.every(n=>n.fish.routes.every(r=>r.spotKey==='rod:332')));
});
test('preparations avoid cycles, duplicate edges and unrelated mooch fishing spots',()=>{
  const a={id:1,fish:true,routes:[{spotKey:'a',bait:2,predators:[{id:3,amount:2}]}]},b={id:2,fish:true,routes:[{spotKey:'a',bait:2,spawn:1,duration:2},{spotKey:'b',spawn:8,duration:2}]},c={id:3,fish:true,routes:[{spotKey:'b',spawn:4,duration:1}]};
  const m=F.create({fishes:[a,b,c],spots:{},related:{}},{byMap:{},specialMaps:[]});
  const nodes=m.preparations(a,[...a.routes,...a.routes]);assert.equal(nodes.length,2);
  const mooch=nodes.find(n=>n.relation==='mooch');assert.equal(mooch.children.length,0);assert.deepEqual(mooch.fish.routes.map(r=>r.spotKey),['a']);
  assert.equal(nodes.find(n=>n.relation==='intuition').fish.routes[0].spotKey,'b');
  assert.deepEqual(m.preparations({id:4,routes:[{spotKey:'c',bait:2}]}),[]);
});
test('planner and dialog show timed prerequisites below targets despite collection/search filters',()=>{
  const storage=memory({'teo-ffxiv.fishing.collection.v1':E.backup(new Set([24203,23056,24204,21177,22397,43795,52006]))}),p=open({plan:true,storage});
  try{
    Object.defineProperty(p.d,'hidden',{value:false,configurable:true});p.w.Date.now=()=>Date.parse('2026-09-10T13:00:00Z');
    p.$('#showPlanner').click();p.$('#planSearch').value='칠채천주';p.$('#planRefresh').click();
    assert.equal(p.all('.plan-card').length,1);assert.equal(p.$('.plan-name').textContent,'칠채천주');assert.match(p.$('.plan-window').textContent,/준비 시작 → 직감 가능/);
    const group=p.$('.plan-entry>.fish-preparations');assert.ok(group);assert.equal(group.querySelectorAll('[data-preparation-fish]').length,5);
    assert.match(group.querySelector('[data-preparation-fish="24203"] .preparation-role').textContent,/직감 ×3/);
    assert.equal(group.querySelector('[data-preparation-caught="24203"]').hidden,false);
    assert.ok(group.querySelector('[data-preparation-fish="24203"] [data-preparation-fish="21177"]'));
    assert.match(group.querySelector('[data-preparation-fish="21177"] [data-preparation-times]').textContent,/다음/);
    const before=p.storage.getItem(KEY),preferences=JSON.stringify(p.planSnapshot());
    p.$('.plan-name').click();assert.equal(p.all('#detailBody [data-preparation-fish]').length,5);
    p.$('#detailBody [data-preparation-fish="21177"] .preparation-more').click();assert.equal(p.$('#detailTitle').textContent,'자채어');assert.equal(p.all('.timeline-list li').length,5);
    p.$('#closeDetail').click();p.$('#planSearch').value='세 날 범고래';p.$('#planRefresh').click();
    const whale=p.$('.plan-entry>.fish-preparations');assert.equal(whale.querySelectorAll('[data-preparation-fish]').length,2);
    for(const id of [43795,52006]){assert.equal(whale.querySelector(`[data-preparation-caught="${id}"]`).hidden,false);assert.match(whale.querySelector(`[data-preparation-fish="${id}"] [data-preparation-times]`).textContent,/다음/);}
    assert.equal(p.storage.getItem(KEY),before);assert.equal(JSON.stringify(p.planSnapshot()),preferences);
    p.$('#planSearch').value='잘레라';p.$('#planRefresh').click();assert.equal(p.$('.plan-entry>.fish-preparations'),null);
  }finally{p.close();}
});
