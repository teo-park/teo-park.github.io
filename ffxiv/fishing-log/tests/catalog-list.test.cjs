const {test}=require('node:test'),assert=require('node:assert/strict'),E=require('../engine.js');
const {open,D,KEY,memory}=require('./helpers.cjs');
const wait=()=>new Promise(r=>setTimeout(r,70));
function list(p){Object.defineProperty(p.d,'hidden',{value:false,configurable:true});p.$('[data-layout-choice="list"]').click();}
test('catalog list preserves 100-fish pages, caught checks, undo and saved layout across reload',async()=>{
  const storage=memory();let p=open({plan:true,storage});try{
    p.$('#paginationTop [aria-label="2페이지"]').click();const first=p.$('#fishGrid [data-caught]').dataset.caught;list(p);
    assert.equal(p.$('#collectionListViewport').hidden,false);assert.equal(p.$('#gridViewport').hidden,true);assert.equal(p.all('.catalog-card').length,100);
    assert.equal(p.$('.catalog-card [data-caught]').dataset.caught,first);assert.equal(p.$('#paginationTop [aria-current]').textContent,'2');
    const check=p.$('.catalog-card [data-caught]');check.click();assert.equal(check.textContent,'수집');assert.equal(check.getAttribute('aria-pressed'),'true');assert.ok(check.closest('.catalog-card').classList.contains('is-caught'));
    const before=storage.getItem(KEY);p.$('[data-layout-choice="grid"]').click();assert.equal(storage.getItem(KEY),before);assert.equal(p.$('#gridViewport').hidden,false);assert.equal(p.$('#fishGrid [data-caught]').dataset.caught,first);assert.equal(p.$('#fishGrid [data-caught]').getAttribute('aria-pressed'),'true');
    list(p);p.$('#undo').click();assert.equal(p.$('.catalog-card [data-caught]').getAttribute('aria-pressed'),'false');
    p.$('#markPage').click();assert.equal(E.parseBackup(storage.getItem(KEY)).size,100);p.$('#undo').click();
    p.close();p=open({plan:true,storage});assert.equal(p.$('#collectionListViewport').hidden,false);assert.equal(p.all('.catalog-card').length,100);
  }finally{p.close();}
});
test('list shows actual openings independent of online settings and keeps caught rows until explicit refresh',async()=>{
  const p=open({plan:true});try{
    p.w.Date.now=()=>Date.parse('2026-09-10T13:00:00Z');p.all('[data-day]').forEach(el=>el.checked=false);p.$('#savePlay').click();list(p);p.change('#search','잘레라','input');await wait();
    const preferences=JSON.stringify(p.planSnapshot()),row=p.$('.catalog-card');assert.match(row.querySelector('.plan-window').textContent,/9\./);assert.match(row.querySelector('.plan-bite').textContent,/!!!.*섬세한/s);
    p.$('[data-catalog-countdown]').click();assert.match(p.$('.catalog-card .plan-window').textContent,/(시작|종료)까지/);
    p.$('[data-catalog-detail]').click();assert.equal(p.$('[data-catalog-panel]').hidden,false);assert.ok(p.$('[data-catalog-panel] .plan-detail-grid'));assert.equal(p.$('#detailDialog').open,false);
    p.$('[data-catalog-panel] [data-catalog-detail]').click();assert.equal(p.$('[data-catalog-panel]').hidden,true);
    p.change('#status','missing');const check=p.$('.catalog-card [data-caught]');check.click();assert.equal(p.all('.catalog-card').length,1);assert.equal(check.textContent,'수집');assert.equal(p.$('#refreshResults').hidden,false);
    assert.equal(JSON.stringify(p.planSnapshot().settings),JSON.stringify(JSON.parse(preferences).settings));
    p.$('#refreshResults').click();assert.equal(p.all('.catalog-card').length,0);
  }finally{p.close();}
});
test('collection rows use planner tackle and map markup and switch only between filter-matching routes',async()=>{
  const p=open({plan:true});try{
    list(p);const fish=D.fishes.find(f=>f.id===4776);p.change('#search',String(fish.id),'input');await wait();
    const select=p.$('[data-catalog-route]');assert.ok(select&&select.options.length>1);const index=+select.options[1].value;
    p.change('[data-catalog-route]',String(index));const current=p.$('.catalog-card [data-spot-map]');assert.equal(current.dataset.spotMap,fish.routes[index].spotKey);
    p.$('[data-catalog-detail]').click();assert.match(p.$('[data-catalog-panel]').textContent,new RegExp(D.spots[fish.routes[index].spotKey].name));
    const region=D.spots[fish.routes[0].spotKey].region;p.change('#region',region);
    const choices=p.$('[data-catalog-route]');if(choices)for(const o of choices.options)assert.equal(D.spots[fish.routes[+o.value].spotKey].region,region);
    const bait=p.$('.catalog-card [data-bait-detail]');assert.ok(bait);bait.click();assert.equal(p.$('#baitDialog').open,true);
    p.$('[data-bait-close]').click();
    const rowRoute=p.$('.catalog-card [data-spot-map]').dataset.spotMap;assert.ok(rowRoute);
  }finally{p.close();}
});
test('timed preparation subrows include caught fish and unknown ocean/spear conditions are not marked always',async()=>{
  const p=open({plan:true,storage:memory({[KEY]:E.backup(new Set([24203,21177]))})});try{
    list(p);p.change('#search','칠채천주','input');await wait();assert.equal(p.all('#collectionListViewport [data-preparation-fish]').length,5);assert.equal(p.$('#collectionListViewport [data-preparation-caught="24203"]').hidden,false);
    assert.match(p.$('.catalog-card .plan-window').textContent,/준비 필요/);assert.equal(p.$('.catalog-card').dataset.planNow,'false');
    p.change('#search',String(D.missingConditions[0]),'input');await wait();assert.match(p.$('.catalog-card .plan-window').textContent,/먼바다 전용/);assert.equal(p.$('.catalog-card').dataset.planNow,'false');assert.equal(p.$('.catalog-card [data-catalog-countdown]'),null);
    p.$('#spearMode').click();p.change('#search','','input');assert.equal(p.all('.catalog-card').length,100);assert.match(p.$('.catalog-card .plan-bite').textContent,/어영/);assert.match(p.$('.catalog-card .plan-tackle').textContent,/미끼 없음/);assert.equal(p.$('.catalog-card [data-catalog-countdown]'),null);
    p.$('#paginationTop [aria-label="3페이지"]').click();assert.equal(p.all('.catalog-card').length,89);p.$('[data-catalog-detail]').click();assert.match(p.$('[data-catalog-panel]').textContent,/어영/);
    p.change('#view','spot');assert.equal(p.$('#collectionListViewport').hidden,true);assert.equal(p.$('#fishGroups').hidden,false);p.change('#view','book');assert.equal(p.$('#collectionListViewport').hidden,false);
  }finally{p.close();}
});
