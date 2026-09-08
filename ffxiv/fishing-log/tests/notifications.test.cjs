const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),F=require('../forecast.js'),E=require('../notification-engine.js'),Book=require('../engine.js'),{open}=require('./helpers.cjs');
const data={spots:{'rod:1':{map:1,name:'낚시터',area:'지역'}},related:{1:{id:1,name:'미끼',fish:false}},fishes:[{id:2,name:'물고기',kind:'rod',routes:[{verified:true,spotKey:'rod:1',spawn:0,duration:12,bait:1}]}]},weather={byMap:{1:[{rate:100,weatherId:1}]},specialMaps:[]};
const prefs={ids:[2],settings:F.defaults(),sent:[],saved:true},start=Date.parse('2026-09-08T19:00:00+09:00');
test('upcoming notifications respect ontime, deduplicate overlaps and ignore caught selections',()=>{
  const batch=E.next(data,weather,prefs,start);assert.ok(batch.events.length);assert.ok(batch.at>=Date.parse('2026-09-08T20:00:00+09:00'));
  const sent=E.remember([],batch.events,batch.at),next=E.next(data,weather,{...prefs,sent},batch.at);assert.notEqual(next.events[0]?.key,batch.events[0].key);
  assert.deepEqual(E.next(data,weather,{...prefs,ids:[]},start).events,[]);
  const message=E.message(data,Book.create(data),batch.events);assert.match(message.body,/미끼/);assert.equal(message.fish,2);
  const wake=E.next(data,weather,{...prefs,sent},batch.events[0].end+1);assert.ok(!wake.events.some(e=>e.end<=batch.events[0].end));
});
test('normal untimed fish notify once per play session, not on every timer tick or every route',()=>{
  const ordinary={...data,fishes:[{id:3,name:'일반 물고기',kind:'rod',routes:[{verified:true,spotKey:'rod:1',bait:1},{verified:true,spotKey:'rod:1',bait:1}]}]},settings={...prefs,ids:[3],includeAlways:true};
  const first=E.next(ordinary,weather,settings,start);assert.equal(first.at,Date.parse('2026-09-08T20:00:00+09:00'));assert.equal(first.events.length,1);assert.equal(first.events[0].always,true);
  const sent=E.remember([],first.events,first.at),later=E.next(ordinary,weather,{...settings,sent},first.at+5*F.MINUTE);
  assert.ok(later.events.length);assert.equal(later.events[0].sessionStart,first.events[0].sessionStart+F.DAY);assert.notEqual(later.events[0].key,first.events[0].key);
  assert.deepEqual(E.next(ordinary,weather,{...settings,includeAlways:false},start).events,[]);assert.deepEqual(E.next(ordinary,weather,{...settings,ids:[]},first.at).events,[]);
  const disabled={...settings,settings:{...settings.settings,days:settings.settings.days.map(d=>({...d,enabled:false}))}};assert.deepEqual(E.next(ordinary,weather,disabled,start).events,[]);
  const message=E.message(ordinary,Book.create(ordinary),first.events);assert.match(message.title,/상시 낚시 준비/);assert.match(message.body,/시간·날씨 제한 없음/);
});
test('page alerts request permission only on click, use local history and stop after disabling',async()=>{
  const p=open(),notices=[];let requests=0,now=start,settings={...prefs},timers=new Map(),seq=0;
  try{
    Object.defineProperty(p.w,'isSecureContext',{value:true});p.w.Date.now=()=>now;
    p.w.setTimeout=(fn)=>{timers.set(++seq,fn);return seq;};p.w.clearTimeout=id=>timers.delete(id);
    class FakeNotification{static permission='default';static async requestPermission(){requests++;this.permission='granted';return this.permission;}constructor(title,options){notices.push({title,options});}close(){}}
    p.w.Notification=FakeNotification;
    for(const file of ['forecast.js','notification-engine.js','notifications.js'])p.w.eval(fs.readFileSync(path.join(__dirname,'..',file),'utf8'));
    p.w.FISHING_WEATHER=weather;
    p.w.FishingNotifications.mount({snapshot:()=>settings,data,model:Book.create(data)});
    assert.equal(requests,0);assert.equal(notices.length,0);
    settings={...prefs,saved:false};await p.$('#enableNotifications').onclick();assert.equal(requests,0);assert.match(p.$('#notificationStatus').textContent,/먼저/);
    settings={...prefs};await p.$('#enableNotifications').onclick();assert.equal(requests,1);assert.equal(notices.length,0);assert.equal(p.storage.getItem('teo-ffxiv.fishing.notifications.v1'),'on');
    now=E.next(data,weather,prefs,start).at;
    async function tick(){const pending=[...timers.values()];timers.clear();for(const fn of pending)await fn();await new Promise(r=>setImmediate(r));}
    await tick();assert.equal(notices.length,1);await tick();assert.equal(notices.length,1);
    p.$('#disableNotifications').onclick();assert.equal(timers.size,0);assert.equal(p.storage.getItem('teo-ffxiv.fishing.notifications.v1'),'off');
    now+=F.DAY;p.d.dispatchEvent(new p.w.Event('visibilitychange'));await new Promise(r=>setImmediate(r));assert.equal(notices.length,1);
  }finally{p.close();}
});
test('notification failures do not mark an opportunity delivered',async()=>{
  const p=open();try{
    Object.defineProperty(p.w,'isSecureContext',{value:true});p.w.Date.now=()=>E.next(data,weather,prefs,start).at;
    class BrokenNotification{static permission='granted';static async requestPermission(){return 'granted';}constructor(){throw Error('OS rejected notification');}}
    p.w.Notification=BrokenNotification;
    for(const file of ['forecast.js','notification-engine.js','notifications.js'])p.w.eval(fs.readFileSync(path.join(__dirname,'..',file),'utf8'));
    p.w.FISHING_WEATHER=weather;p.w.FishingNotifications.mount({snapshot:()=>prefs,data,model:Book.create(data)});
    await p.$('#enableNotifications').onclick();assert.equal(p.storage.getItem('teo-ffxiv.fishing.notifications.sent.v1'),null);assert.match(p.$('#notificationStatus').textContent,/OS rejected/);
  }finally{p.close();}
});
