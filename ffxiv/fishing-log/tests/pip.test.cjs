const {test}=require('node:test'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom'),{open}=require('./helpers.cjs');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function companion(){
  const child=new JSDOM('<html><head></head><body></body></html>',{url:'https://example.com/ffxiv/fishing-log/',runScripts:'outside-only'}),timers=new Map();let seq=0;
  child.window.closed=false;child.window.focus=()=>{};
  child.window.setInterval=fn=>{timers.set(++seq,fn);return seq;};child.window.clearInterval=id=>timers.delete(id);
  const close=child.window.close.bind(child.window);child.window.close=()=>{if(child.window.closed)return;child.window.dispatchEvent(new child.window.Event('pagehide'));child.window.closed=true;close();};
  return {w:child.window,$:s=>child.window.document.querySelector(s),all:s=>[...child.window.document.querySelectorAll(s)],timers,close:()=>child.window.close(),tick:()=>[...timers.values()].forEach(fn=>fn())};
}
test('PIP partitions exact time boundaries, keeps all rows, and excludes uncertain preparation windows',()=>{
  const p=open({plan:true});try{
    const now=10000000,make=(id,extra)=>({id,order:id,start:now-1000,end:now+1000,...extra});
    const rows=[make(1,{end:now}),make(2,{start:now}),make(3,{start:now+30*60000,end:now+31*60000}),make(4,{start:now+30*60000+1}),make(5,{always:true,start:null,end:null}),make(6,{start:null,end:null}),make(7,{preparationOnly:true}),...Array.from({length:40},(_,i)=>make(i+10,{}))];
    const group=p.w.FishingPip.partition(rows,now,30);
    assert.equal(group.current.length,42);assert.equal(group.current.at(-1).id,5);assert.deepEqual(Array.from(group.upcoming,r=>r.id),[3]);assert.equal(group.unresolved,2);
    assert.deepEqual(Array.from(p.w.FishingPip.partition(rows,now,0).upcoming,r=>r.id),[3,4]);
    assert.equal(p.w.FishingPip.remaining(59001),'1분 0초');assert.equal(p.w.FishingPip.remaining(999),'1초');
  }finally{p.close();}
});
test('PIP opens on user action, mirrors planner filters and collection changes, and shares alert controls',async()=>{
  const children=[],controllerState={enabled:false,busy:false,supported:true,message:'알림 꺼짐'};let calls=0,enables=0,disables=0,p;
  const notify=()=>p.d.dispatchEvent(new p.w.Event('fishing-notifications-changed'));
  const notificationController={state:()=>controllerState,enable:async()=>{enables++;controllerState.enabled=true;controllerState.message='알림 켜짐';notify();},disable:()=>{disables++;controllerState.enabled=false;notify();}};
  p=open({plan:true,notificationController,pip:w=>{Object.defineProperty(w,'isSecureContext',{value:true});w.documentPictureInPicture={requestWindow:async()=>{calls++;const c=companion();children.push(c);return c.w;}};}});
  try{
    p.w.focus=()=>{};p.w.Date.now=()=>Date.parse('2026-09-09T11:00:00Z');p.$('#showPlanner').click();p.$('#planCollectionMode').click();p.$('#savePlay').click();
    assert.equal(calls,0);p.$('#openFishingPip').click();await flush();const c=children[0];
    assert.equal(calls,1);assert.equal(enables,0);assert.equal(p.$('#openFishingPip').getAttribute('aria-pressed'),'true');
    assert.ok(c.all('#pipCurrent li[data-pip-fish]').length>30,'PIP includes rows beyond the main page limit');
    assert.match(c.$('#pipScope').textContent,/수첩작/);assert.equal(c.$('#pipNotifications').checked,false);
    assert.ok(c.$('link[href$="pip.css?v=20260913-fishbell2"]'));assert.equal(c.w.document.documentElement.lang,'ko');
    c.$('#pipNotifications').click();await flush();assert.equal(enables,1);assert.equal(c.$('#pipNotifications').checked,true);
    notificationController.disable();assert.equal(c.$('#pipNotifications').checked,false,'main-page state updates the PIP switch');
    c.$('#pipNotifications').click();await flush();c.$('#pipNotifications').click();await flush();assert.equal(disables,2);
    const first=c.$('#pipCurrent li[data-pip-fish]'),id=first.dataset.pipFish;p.$('#planSearch').value=first.querySelector('button').textContent;p.$('#planRefresh').click();
    assert.equal(c.all('[data-pip-fish]').length,1);assert.equal(c.$('[data-pip-fish]').dataset.pipFish,id);
    p.$('.plan-card [data-caught]').click();assert.equal(c.all('[data-pip-fish]').length,0);p.$('#undo').click();assert.equal(c.all('[data-pip-fish]').length,1);
    p.$('#planBigMode').click();p.$('#planSearch').value='잘레라';p.$('#planRefresh').click();p.$('.plan-card [data-caught]').click();p.change('#planStatus','caught');p.selectExpansions('0');c.$('[data-pip-horizon="0"]').click();
    assert.equal(c.all('[data-pip-fish]').length,1);assert.equal(c.$('[data-pip-fish]').dataset.pipCaught,'true');assert.match(c.$('#pipScope').textContent,/수집 · 신생 에오르제아/);assert.match(c.$('.pip-fish p').textContent,/✓ 수집/);assert.ok(!p.planSnapshot().ids.includes(+c.$('[data-pip-fish]').dataset.pipFish));
    p.selectExpansions('1');assert.equal(c.all('[data-pip-fish]').length,0);p.selectExpansions('0');assert.equal(c.all('[data-pip-fish]').length,1);
    p.$('#planExpansions input[value="4"]').click();assert.match(c.$('#pipScope').textContent,/신생 에오르제아 · 효월의 종언/);assert.equal(c.all('[data-pip-fish]').length,1);p.$('#planExpansionNone').click();assert.match(c.$('#pipScope').textContent,/확장팩 선택 없음/);assert.equal(c.all('[data-pip-fish]').length,0);p.$('#planExpansions input[value="0"]').click();assert.equal(c.all('[data-pip-fish]').length,1);
    p.$('#showBook').click();c.$('[data-pip-detail]').click();assert.equal(p.$('#detailDialog').open,true);p.$('#closeDetail').click();
    assert.equal(c.timers.size,1);p.$('#openFishingPip').click();await flush();assert.equal(calls,1,'existing PIP is reused');
    c.close();assert.equal(c.timers.size,0);assert.equal(p.$('#openFishingPip').getAttribute('aria-pressed'),'false');assert.equal(disables,2,'closing PIP does not disable alerts');
    p.$('#showPlanner').click();p.$('#openFishingPip').click();await flush();assert.equal(calls,2);assert.equal(children[1].timers.size,1);
    p.w.dispatchEvent(new p.w.Event('pagehide'));assert.equal(children[1].w.closed,true);assert.equal(children[1].timers.size,0);
  }finally{children.forEach(c=>c.close());p.close();}
});
test('PIP countdowns continue with the main page hidden and expired windows refresh to the next opening',async()=>{
  const c=companion();let p,now=10000000,refreshes=0;
  p=open({plan:true});try{
    Object.defineProperty(p.w,'isSecureContext',{value:true});p.w.documentPictureInPicture={requestWindow:async()=>c.w};
    Object.defineProperty(p.d,'hidden',{value:true,configurable:true});p.w.Date.now=()=>now;
    // Use the same public adapter as the planner, with deterministic forecast windows.
    let view={saved:true,scope:'터주 전용',alertScope:'알림: 선택 어종 전체',updatedAt:now,rows:[{id:1,name:'시간제 물고기',icon:'https://example.com/fish.png',order:1,start:now+2000,end:now+4000,always:false}]};
    const ui=p.w.FishingPip.mount({getView:()=>view,refresh:()=>{refreshes++;view={...view,updatedAt:now,rows:view.rows.map(r=>({...r,start:now+10000,end:now+20000}))};ui.update();},openSettings(){},openFish(){}});
    p.$('#openFishingPip').click();await flush();assert.match(c.$('[data-pip-time]').textContent,/2초 후/);
    now+=2000;c.tick();assert.equal(c.$('#pipCurrentCount').textContent,'1');assert.match(c.$('[data-pip-time]').textContent,/남은 2초/);
    now+=2000;c.tick();assert.equal(refreshes,1);assert.equal(c.$('#pipCurrentCount').textContent,'0');assert.match(c.$('[data-pip-time]').textContent,/10초 후/);
    c.$('[data-pip-horizon="0"]').click();assert.equal(c.$('[data-pip-horizon="0"]').getAttribute('aria-pressed'),'true');
    c.close();assert.equal(c.timers.size,0);
  }finally{c.close();p.close();}
});
test('unsupported and denied PIP requests leave the main planner usable without enabling alerts',async()=>{
  let p=open({plan:true});try{assert.equal(p.$('#openFishingPip').disabled,true);assert.match(p.$('#fishingPipHint').textContent,/PC Chrome/);p.$('#showPlanner').click();assert.ok(p.$('.plan-card'));}finally{p.close();}
  p=open({plan:true,pip:w=>{Object.defineProperty(w,'isSecureContext',{value:true});w.documentPictureInPicture={requestWindow:async()=>{throw Error('NotAllowedError');}};}});
  try{p.$('#showPlanner').click();p.$('#openFishingPip').click();await flush();assert.match(p.$('#fishingPipHint').textContent,/열지 못했/);assert.equal(p.$('#openFishingPip').disabled,false);assert.equal(p.$('#openFishingPip').getAttribute('aria-pressed'),'false');assert.equal(p.storage.getItem('teo-ffxiv.fishing.notifications.v1'),null);}finally{p.close();}
});
