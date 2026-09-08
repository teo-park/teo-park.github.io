/* Deterministic Eorzea weather formula: Teamcraft (MIT), see README.md. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.FishingForecast=factory();})(globalThis,function(){
  'use strict';
  const MINUTE=60000,DAY=86400000,ET_HOUR=175000,ET_DAY=24*ET_HOUR,WEATHER=8*ET_HOUR,KST=9*60*MINUTE;
  const defaults=()=>({days:Array.from({length:7},()=>({enabled:true,start:'20:00',end:'23:00'})),lead:10,minMinutes:1});
  function validate(settings){
    const clock=v=>typeof v==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(v);
    if(!settings||!Array.isArray(settings.days)||settings.days.length!==7||settings.days.some(d=>!d||typeof d.enabled!=='boolean'||!clock(d.start)||!clock(d.end)||d.enabled&&d.start===d.end))throw Error('요일별 시작·종료 시간을 확인해 주세요. 자정을 넘는 시간도 설정할 수 있습니다.');
    if(![0,5,10,15,30].includes(settings.lead)||![1,3,5,10].includes(settings.minMinutes))throw Error('알림 시점·최소 도전 시간을 확인해 주세요.');
    return {days:settings.days.map(d=>({enabled:d.enabled,start:d.start,end:d.end})),lead:settings.lead,minMinutes:settings.minMinutes};
  }
  function weatherTarget(time){
    const seconds=Math.floor(time/1000),hour=Math.floor(seconds/175),increment=(hour+8-hour%8)%24;
    const base=Math.floor(seconds/4200)*100+increment,step=((base<<11)^base)>>>0;
    return (((step>>>8)^step)>>>0)%100;
  }
  function merge(ranges){
    const out=[];for(const r of ranges.sort((a,b)=>a.start-b.start||a.end-b.end)){const prev=out.at(-1);if(prev&&r.start<=prev.end)prev.end=Math.max(prev.end,r.end);else out.push({...r});}return out;
  }
  function sessions(settings,from,to){
    const ms=t=>{const [h,m]=t.split(':').map(Number);return (h*60+m)*MINUTE;},out=[];
    for(let day=Math.floor((from+KST)/DAY)*DAY-KST-DAY;day<to;day+=DAY){
      const d=settings.days[new Date(day+KST).getUTCDay()];if(!d.enabled)continue;
      const start=day+ms(d.start),end=day+ms(d.end)+(d.end<d.start?DAY:0);
      if(end>from&&start<to)out.push({start,end});
    }
    return merge(out);
  }
  function intersect(a,b){const start=Math.max(a.start,b.start),end=Math.min(a.end,b.end);return end>start?{start,end}:null;}
  function create(data,weather){
    const weatherCache=new Map(),byId=new Map([...Object.values(data.related||{}),...(data.fishes||[])].map(f=>[f.id,f]));
    function prerequisiteWindow(route,seen=new Set()){
      const ids=[...(route.predators||[]).map(p=>p.id),...(byId.get(route.bait)?.fish?[route.bait]:[])];
      return ids.some(id=>{if(seen.has(id))return false;const visited=new Set(seen);visited.add(id);const fish=byId.get(id),routes=fish?.routes?.filter(r=>r.spotKey===route.spotKey&&r.verified)||[];
        return !routes.length||routes.every(r=>limited(r)||prerequisiteWindow(r,visited));});
    }
    function at(map,time){
      const bucket=Math.floor(time/WEATHER),key=map+':'+bucket;
      if(!weatherCache.has(key))weatherCache.set(key,weather.byMap[map]?.find(r=>weatherTarget(bucket*WEATHER)<r.rate)?.weatherId??null);
      return weatherCache.get(key);
    }
    function reason(route){
      const spot=data.spots[route.spotKey];
      if(!route.verified||!spot)return '조건 자료 확인 필요';
      if(weather.specialMaps.includes(spot.map)||route.oceanFishingTime!==undefined)return '항로·특수 지역 전용 조건';
      if(route.spawn!==undefined&&(!Number.isFinite(route.spawn)||!Number.isFinite(route.duration)||route.duration<=0||route.duration>24))return '시간 자료 확인 필요';
      if((route.weathers?.length||route.weathersFrom?.length)&&!weather.byMap[spot.map])return '지역 날씨표 확인 필요';
      if(!limited(route)&&prerequisiteWindow(route))return '생미끼·직감 선행 시간 별도 확인';
      return null;
    }
    const limited=r=>r.duration>0&&r.duration<24||!!r.weathers?.length||!!r.weathersFrom?.length;
    function weatherFits(route,time){const map=data.spots[route.spotKey].map;return (!route.weathers?.length||route.weathers.includes(at(map,time)))&&(!route.weathersFrom?.length||route.weathersFrom.includes(at(map,time-WEATHER)));}
    function windows(route,from,to){
      if(reason(route))return [];
      const timed=Number.isFinite(route.spawn)&&route.duration<24,wet=route.weathers?.length||route.weathersFrom?.length;
      if(!timed&&!wet)return [{start:from,end:to}];
      let begin=Math.floor(from/WEATHER)*WEATHER;
      // Preserve the real opening time of a weather window already in progress.
      if(wet&&!timed)for(let i=0;i<2048&&weatherFits(route,begin-WEATHER);i++)begin-=WEATHER;
      if(timed)begin=Math.floor(from/ET_DAY)*ET_DAY-ET_DAY;
      const result=[];
      for(let t=begin;t<to+WEATHER;t+=WEATHER){
        if(wet&&!weatherFits(route,t))continue;
        const block={start:t,end:t+WEATHER};
        if(!timed)result.push(block);
        else for(let day=Math.floor(t/ET_DAY)-1;day<=Math.floor((t+WEATHER)/ET_DAY);day++){
          const start=day*ET_DAY+route.spawn*ET_HOUR,hit=intersect(block,{start,end:start+route.duration*ET_HOUR});if(hit)result.push(hit);
        }
      }
      return merge(result).filter(w=>w.end>from&&w.start<to);
    }
    function opportunities(fish,settings,from,to,{includeAlways=false}={}){
      const play=sessions(settings,from,to),out=[];
      for(const [index,route] of fish.routes.entries()){
        if(reason(route)||!includeAlways&&!limited(route))continue;
        const ranges=windows(route,from,to);
        let cursor=0;
        for(const window of ranges){
          while(cursor<play.length&&play[cursor].end<=window.start)cursor++;
          for(let i=cursor;i<play.length&&play[i].start<window.end;i++){
            const overlap=intersect(window,play[i]);if(!overlap)continue;
            const start=Math.max(from,overlap.start),end=Math.min(to,overlap.end);
            if(end-start<settings.minMinutes*MINUTE)continue;
            out.push({id:fish.id,route:index,windowStart:window.start,windowEnd:window.end,start,end,sessionStart:play[i].start,sessionEnd:play[i].end,
              notifyAt:Math.max(play[i].start,overlap.start-settings.lead*MINUTE),key:`${fish.id}:${index}:${window.start}:${play[i].start}`});
          }
        }
      }
      return out.sort((a,b)=>a.start-b.start||b.end-a.end);
    }
    function plan(fishes,settings,from,days=30){
      const to=from+days*DAY,rows=[],excluded=[],always=[],absent=[];
      for(const fish of fishes){
        const supported=fish.routes.filter(r=>!reason(r));
        if(!supported.length){excluded.push(fish);continue;}
        if(supported.some(r=>!limited(r))){always.push(fish);continue;}
        const chances=opportunities(fish,settings,from,to),first=chances[0];
        if(!first){absent.push(fish);continue;}
        // Other routes/overlaps for the same opportunity aren't a later chance.
        let currentEnd=first.end,next=null;
        for(const c of chances.slice(1)){if(c.start<=currentEnd)currentEnd=Math.max(currentEnd,c.end);else{next=c;break;}}
        rows.push({fish,...first,nextStart:next?.start??null,nextGap:next?next.start-currentEnd:null});
      }
      return {rows:rows.sort((a,b)=>a.start-b.start),excluded,always,absent,to};
    }
    return {at,reason,limited,windows,opportunities,plan,clearCache:()=>weatherCache.clear()};
  }
  return {MINUTE,DAY,ET_HOUR,ET_DAY,WEATHER,KST,defaults,validate,weatherTarget,merge,sessions,intersect,create};
});
