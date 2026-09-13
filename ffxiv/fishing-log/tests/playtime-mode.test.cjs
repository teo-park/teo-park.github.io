const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../forecast.js'),N=require('../notification-engine.js'),{open,memory}=require('./helpers.cjs');
const data={spots:{'rod:1':{map:1}},related:{},fishes:[{id:1,kind:'rod',routes:[{verified:true,spotKey:'rod:1',spawn:23,duration:3}]},{id:2,kind:'rod',routes:[{verified:true,spotKey:'rod:1'}]}]},weather={byMap:{1:[{rate:100,weatherId:1}]},specialMaps:[]};
test('unrestricted play keeps real ET boundaries, bridges midnight, and respects minimum duration',()=>{
 const settings={...F.defaults(),unrestricted:true};settings.days.forEach(d=>d.enabled=false);
 const model=F.create(data,weather),from=24*F.ET_HOUR;
 const chances=model.opportunities(data.fishes[0],settings,from,from+F.DAY);
 assert.ok(chances.length);assert.equal(chances[0].windowStart,23*F.ET_HOUR);assert.equal(chances[0].end,26*F.ET_HOUR);
 assert.deepEqual(F.sessions(settings,from,from+F.DAY),F.sessions(settings,from+F.DAY,from+2*F.DAY));
 settings.minMinutes=10;assert.equal(model.opportunities(data.fishes[0],settings,from,from+F.DAY).length,0);
 assert.match(model.startSearch([data.fishes[0]],settings,from).result.rows[0].unavailableReason,/最小|최소/);
});
test('unrestricted alerts deduplicate timed windows and always fish once per KST day',()=>{
 const settings={...F.defaults(),unrestricted:true},now=Date.parse('2026-09-13T23:59:00+09:00');
 const opts={settings,ids:[2],includeAlways:true};let batch=N.next(data,weather,opts,now);
 assert.equal(batch.at,now);const sent=N.remember([],batch.events,now);
 batch=N.next(data,weather,{...opts,sent},now+30000);assert.equal(batch.at,Date.parse('2026-09-14T00:00:00+09:00'));
 const t=24*F.ET_HOUR,first=N.next(data,weather,{settings,ids:[1]},t),history=N.remember([],first.events,t);
 const next=N.next(data,weather,{settings,ids:[1],sent:history},t+30000);assert.ok(next.at>first.events[0].end);
});
test('playtime off preserves custom days across reenable and reload without changing collection',()=>{
 const storage=memory(),p=open({plan:true,storage});try{
  p.$('#showPlanner').click();p.change('#playStart5','22:00');p.change('#playEnd5','02:00');p.all('[data-day]').forEach(d=>d.checked=d.dataset.day==='5');p.$('#savePlay').click();
  const before=JSON.stringify(p.planSnapshot().settings.days),caught=storage.getItem('teo-ffxiv.fishing.collection.v2');
  p.$('#playtimeOff').click();assert.equal(p.planSnapshot().settings.unrestricted,true);assert.equal(p.$('#customPlaytime').hidden,true);assert.equal(JSON.stringify(p.planSnapshot().settings.days),before);
  assert.equal(storage.getItem('teo-ffxiv.fishing.collection.v2'),caught);
  const q=open({plan:true,storage});try{assert.equal(q.planSnapshot().settings.unrestricted,true);q.$('#playtimeOn').click();assert.equal(q.planSnapshot().settings.unrestricted,false);assert.equal(JSON.stringify(q.planSnapshot().settings.days),before);}finally{q.close();}
 }finally{p.close();}
});
test('explicit all-time choice confirms preferences and bridge sends only after handshake',async()=>{
 const p=open({plan:true}),messages=[];try{
  p.w.postMessage=(m)=>messages.push(m);p.$('#playtimeOff').click();assert.equal(p.planSnapshot().saved,true);assert.equal(messages.length,0);
  Object.defineProperty(p.d,'hidden',{value:false,configurable:true});
  p.w.dispatchEvent(new p.w.MessageEvent('message',{source:p.w,origin:p.w.location.origin,data:{type:'SENUEO_FISH_BELL_REQUEST'}}));
  assert.equal(messages.length,1);const m=messages[0].payload;assert.equal(m.version,1);assert.equal(m.settings.unrestricted,true);assert.ok(m.ids.length);assert.ok(m.alertIds.length);
  p.selectExpansions([]);assert.equal(messages.at(-1).payload.ids.length,0);assert.ok(messages.at(-1).payload.alertIds.length,'website list filters remain separate from alert scope');
 }finally{p.close();}
});
