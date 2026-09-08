(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./forecast.js'));else root.FishingNotificationEngine=factory(root.FishingForecast);})(globalThis,function(F){
  'use strict';
  function next(data,weather,{ids,settings,sent=[],includeAlways=false},now){
    const model=F.create(data,weather),wanted=new Set(ids),events=[];
    for(const fish of data.fishes){
      if(!wanted.has(fish.id)||fish.kind!=='rod')continue;
      for(const chance of model.opportunities(fish,settings,now,now+F.DAY,{includeAlways})){
        const key=`${fish.id}:${chance.sessionStart}:${chance.windowStart}`;
        if(sent.some(s=>s.key===key||s.id===fish.id&&s.sessionStart===chance.sessionStart&&s.start<chance.end&&s.end>chance.start))continue;
        events.push({...chance,key,at:Math.max(now,chance.notifyAt)});break;
      }
    }
    events.sort((a,b)=>a.at-b.at||Number(a.always)-Number(b.always)||a.id-b.id);
    return {at:events[0]?.at??now+F.MINUTE,events:events.filter(e=>e.at===(events[0]?.at))};
  }
  function message(data,model,events){
    const first=events[0],fish=model.byId.get(first.id),route=fish.routes[first.route],spot=data.spots[route.spotKey];
    const paths=model.paths(route),bait=paths.length?paths.map(p=>(p.complete?'':'시작 미끼 확인 → ')+p.ids.map(id=>model.byId.get(id)?.name||id).join(' → ')).join(' / '):'미끼 확인 필요';
    const prep=(route.predators||[]).map(p=>`${model.byId.get(p.id)?.name||p.id} ×${p.amount}`).join(' · ');
    const time=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false});
    const others=events.slice(1,5).map(e=>model.byId.get(e.id).name).join(' · ');
    const label=first.always?'상시 낚시 준비':'낚시 예보';
    return {title:fish.name+(events.length>1?` 외 ${events.length-1}종 · ${label}`:` · ${label}`),
      body:`${spot.area} · ${spot.name}\n${first.always?'시간·날씨 제한 없음 · ':`${time.format(first.start)}–${time.format(first.end)} (한국 시간) · `}${bait}`+(prep?`\n직감 준비: ${prep}`:'')+(others?`\n함께 확인: ${others}${events.length>5?` 외 ${events.length-5}종`:''}`:''),
      fish:fish.id,tag:'fishing-'+first.key};
  }
  const remember=(sent,events,now)=>[...sent.filter(e=>e.end>now-F.MINUTE),...events.map(e=>({key:e.key,id:e.id,start:e.start,end:e.end,sessionStart:e.sessionStart}))].slice(-2000);
  return {next,message,remember};
});
