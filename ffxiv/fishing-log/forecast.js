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
      if([route.weathers,route.weathersFrom].some(ids=>ids?.length&&!weather.byMap[spot.map]?.some(w=>ids.includes(w.weatherId))))return '지역 날씨 조건 확인 필요';
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
      if(!play.length)return out;
      for(const [index,route] of fish.routes.entries()){
        if(reason(route)||!includeAlways&&!limited(route))continue;
        const always=!limited(route),ranges=windows(route,from,to);
        let cursor=0;
        for(const window of ranges){
          while(cursor<play.length&&play[cursor].end<=window.start)cursor++;
          for(let i=cursor;i<play.length&&play[i].start<window.end;i++){
            const overlap=intersect(window,play[i]);if(!overlap)continue;
            const start=Math.max(from,overlap.start),end=Math.min(to,overlap.end);
            if(end-start<settings.minMinutes*MINUTE)continue;
            // Untimed fish use the whole play session as their stable opportunity.
            const windowStart=always?play[i].start:window.start,windowEnd=always?play[i].end:window.end;
            out.push({id:fish.id,route:index,always,windowStart,windowEnd,start,end,sessionStart:play[i].start,sessionEnd:play[i].end,
              notifyAt:always?play[i].start:Math.max(play[i].start,overlap.start-settings.lead*MINUTE),key:`${fish.id}:${index}:${windowStart}:${play[i].start}`});
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
        rows.push({fish,...first,currentEnd,nextStart:next?.start??null,nextGap:next?next.start-currentEnd:null});
      }
      return {rows:rows.sort((a,b)=>a.start-b.start),excluded,always,absent,to};
    }
    function playable(route,settings,from){
      const minimum=settings.minMinutes*MINUTE,play=sessions(settings,from,from+8*DAY);
      if(!play.some(p=>p.end-p.start>=minimum))return false;
      const timed=Number.isFinite(route.spawn)&&route.duration<24;
      if(!timed)return true;
      if(route.duration*ET_HOUR<minimum)return false;
      // The weekly play schedule and ET clock repeat together every seven days.
      for(let day=Math.floor(from/ET_DAY)-1;day*ET_DAY<from+8*DAY;day++){
        const start=day*ET_DAY+route.spawn*ET_HOUR,end=start+route.duration*ET_HOUR;
        if(play.some(p=>Math.min(p.end,end)-Math.max(p.start,start)>=minimum))return true;
      }
      return false;
    }
    function startSearch(fishes,settings,from,previous=null){
      const signature=JSON.stringify(settings),result=plan(fishes,settings,from,30),queue=[],states=new Map();
      for(const fish of result.absent)result.rows.push({fish,route:fish.routes.findIndex(r=>!reason(r)),start:null,end:null,nextStart:null,nextGap:null,pending:true});
      result.absent=[];
      for(const row of result.rows){
        if(row.nextStart!==null)continue;
        const supported=row.fish.routes.filter(r=>!reason(r));
        if(!supported.some(r=>playable(r,settings,from))){row.pending=false;row.unavailableReason=settings.days.some(d=>d.enabled)?'접속 시간·최소 도전 시간과 맞지 않음':'접속 요일 설정 필요';continue;}
        const state={row,to:result.to,currentEnd:row.currentEnd??row.end},old=previous?.signature===signature&&previous.states.get(row.fish.id);
        // Preserve distant searches across the minute refresh, without reusing
        // progress after route/filter changes or an expired first opportunity.
        if(old&&old.to>state.to&&JSON.stringify(old.row.fish.routes)===JSON.stringify(row.fish.routes)&&(old.row.start===null||old.row.end>from)){
          if(row.start===null&&old.row.start!==null)Object.assign(row,{...old.row,fish:row.fish});
          if(row.start===null&&old.row.start===null||row.windowStart===old.row.windowStart){state.to=old.to;state.currentEnd=old.currentEnd;}
        }
        states.set(row.fish.id,state);queue.push(state);
      }
      result.pending=queue.length;
      function step(){
        const state=queue.shift();if(!state)return false;
        if(weatherCache.size>100000)weatherCache.clear();
        const row=state.row,to=state.to+30*DAY,previousStart=row.start,previousNext=row.nextStart;
        // Overlap chunk edges so a short opening is never cut below minMinutes.
        const chances=opportunities(row.fish,settings,Math.max(from,state.to-DAY),to+DAY).filter(c=>c.start<to);
        for(const chance of chances){
          if(row.start===null){Object.assign(row,chance,{pending:false});state.currentEnd=chance.end;}
          else if(chance.start<=state.currentEnd)state.currentEnd=Math.max(state.currentEnd,chance.end);
          else{row.nextStart=chance.start;row.nextGap=chance.start-state.currentEnd;break;}
        }
        state.to=to;result.to=Math.max(result.to,to);
        if(row.nextStart===null)queue.push(state);else states.delete(row.fish.id);
        result.pending=queue.length;return row.start!==previousStart||row.nextStart!==previousNext;
      }
      return {result,states,signature,step};
    }
    function preparations(fish,routes=fish.routes,seen=new Set([fish.id])){
      const nodes=new Map();
      for(const route of routes){
        const dependencies=[...(route.predators||[]).map(p=>({...p,relation:'intuition'})),...(byId.get(route.bait)?.fish?[{id:route.bait,relation:'mooch'}]:[])];
        for(const dependency of dependencies){
          if(seen.has(dependency.id))continue;
          const child=byId.get(dependency.id);if(!child)continue;
          const local=(child.routes||[]).filter(r=>r.spotKey===route.spotKey);
          // Mooching must stay at this fishing spot; intuition may require another spot.
          const childRoutes=local.length||dependency.relation==='mooch'?local:child.routes||[];
          const key=JSON.stringify([dependency.id,dependency.relation,dependency.amount,childRoutes]);
          if(nodes.has(key))continue;
          const children=preparations(child,childRoutes,new Set([...seen,child.id])),timed=childRoutes.some(limited);
          if(timed||children.length)nodes.set(key,{...dependency,fish:{...child,routes:childRoutes},timed,children});
        }
      }
      return [...nodes.values()];
    }
    // Classify by the bait used for the TARGET itself. Intuition predators never
    // become mooch sources, even when catching those predators involves mooching.
    function moochSources(fish){
      return fish.routes.flatMap((route,index)=>{
        const source=byId.get(route.bait),why=reason(route);
        if(!source?.fish||source.id===fish.id||why&&why!=='생미끼·직감 선행 시간 별도 확인')return [];
        const local=(source.routes||[]).filter(r=>r.spotKey===route.spotKey);
        if(local.some(r=>!reason(r)&&!limited(r)))return [];
        const supported=local.filter(r=>!reason(r)&&limited(r)&&!r.predators?.length);
        return supported.length?[{route,index,source:{...source,routes:supported}}]:[];
      });
    }
    function startMoochPreparation(fish,from){
      const sources=moochSources(fish),result={plan:null,pending:!!sources.length,reason:sources.length?null:'시간을 연결할 생미끼 조건이 없습니다.'};
      let horizon=from;
      function step(){
        if(!result.pending)return;
        const to=horizon+30*DAY,plans=[];
        for(const {route,index,source} of sources){
          const prep=merge(source.routes.flatMap(r=>windows(r,from,to)));
          if(!prep.length)continue;
          if(!limited(route)){
            plans.push({route:index,source:source.id,preparation:{start:Math.max(from,prep[0].start),end:prep[0].end},challenge:null,hold:false,intuition:!!route.predators?.length});
            continue;
          }
          const target=windows(route,from,to).find(w=>w.end>Math.max(from,prep[0].start));
          if(!target)continue;
          // Prefer the closest preparation window before opening, or one within the
          // target window. The source's closing time is NOT the target's closing time:
          // a held mooch may still be usable afterwards.
          const before=prep.filter(w=>w.start<=target.start),window=before.at(-1)||prep.find(w=>w.start<target.end);
          if(!window)continue;
          plans.push({route:index,source:source.id,preparation:{start:Math.max(from,window.start),end:Math.min(window.end,target.end)},challenge:{start:Math.max(from,target.start,window.start),end:target.end},hold:window.end<=target.start,intuition:!!route.predators?.length});
        }
        plans.sort((a,b)=>(a.challenge?.start??a.preparation.start)-(b.challenge?.start??b.preparation.start));
        result.plan=plans[0]||null;horizon=to;
        result.pending=!result.plan||(result.plan.challenge?.end??result.plan.preparation.end)>=to;
        if(weatherCache.size>100000)weatherCache.clear();
      }
      step();return {result,step};
    }
    // Fresh intuition preparation for targets without their own clock/weather limit.
    // Ingredients can be accumulated in separate windows at the same fishing spot.
    // This is an opportunity estimate, not a prediction of catch duration or success.
    function startIntuitionPreparation(fish,from){
      const eligible=fish.big&&fish.kind==='rod'&&fish.routes.length&&fish.routes.every(r=>r.predators?.length&&!limited(r)&&reason(r)==='생미끼·직감 선행 시간 별도 확인');
      const result={plan:null,pending:!!eligible,reason:eligible?null:'본체의 출현 시간을 확인하세요.'};
      let horizon=from;
      function step(){
        if(!result.pending)return;
        const to=horizon+30*DAY,plans=[],memo=new Map();let supported=0;
        function ingredient(id,spotKey,seen){
          if(seen.has(id))return null;
          const key=id+':'+spotKey;if(memo.has(key))return memo.get(key);
          const source=byId.get(id),ranges=[];let valid=false;
          for(const route of source?.routes||[]){
            const why=reason(route);
            if(route.spotKey!==spotKey||route.predators?.length||why&&why!=='생미끼·직감 선행 시간 별도 확인')continue;
            const bait=byId.get(route.bait),mooch=bait?.fish?ingredient(bait.id,spotKey,new Set([...seen,id])):null;
            if(bait?.fish&&!mooch)continue;
            const own=windows({...route,bait:null,predators:[]},from,to);
            // Fresh mooch acquisition only. Held mooches and fishing already done
            // are deliberately not inferred from the permanent collection record.
            ranges.push(...(mooch?own.flatMap(a=>mooch.map(b=>intersect(a,b)).filter(Boolean)):own));valid=true;
          }
          const value=valid?merge(ranges):null;memo.set(key,value);return value;
        }
        for(const [index,route] of fish.routes.entries()){
          const requirements=route.predators.map(p=>({...p,windows:ingredient(p.id,route.spotKey,new Set([fish.id]))}));
          if(requirements.some(p=>!p.windows))continue;supported++;
          if(requirements.some(p=>!p.windows.length))continue;
          const start=Math.max(...requirements.map(p=>Math.max(from,p.windows[0].start)));
          // Once the earliest completion opportunity is known, use the closest
          // preparation windows before it instead of prescribing hours of idle waiting.
          const selected=requirements.map(p=>{const w=p.windows.filter(w=>w.start<=start).at(-1);return {id:p.id,amount:p.amount,start:Math.max(from,w.start),end:w.end};});
          // All earlier ingredients have had an opportunity by this point. Choose
          // the last ingredient that stays available longest, retaining its actual
          // closing time rather than intersecting all ingredient windows.
          const last=selected.filter(p=>p.end>start).sort((a,b)=>b.end-a.end||a.id-b.id)[0];
          if(!last)continue;
          const earlier=selected.filter(p=>p!==last).sort((a,b)=>a.end-b.end||a.start-b.start);
          plans.push({route:index,preparationStart:Math.min(...selected.map(p=>p.start)),start,end:last.end,lastId:last.id,steps:[...earlier,last]});
        }
        plans.sort((a,b)=>a.start-b.start||b.end-a.end);result.plan=plans[0]||null;horizon=to;
        result.pending=!result.plan||result.plan.end>=to;
        if(!supported){result.pending=false;result.reason='준비 경로 자료를 확인해야 해요. 아래 어종별 시간을 참고하세요.';}
        if(weatherCache.size>100000)weatherCache.clear();
      }
      step();return {result,step};
    }
    // An on-demand timeline for one fish. Keep the main list's two-chance search cheap.
    function startTimeline(fish,from,{settings=null,count=5}={}){
      const supported=fish.routes.filter(r=>!reason(r));
      const result={chances:[],pending:false,always:false,reason:null};
      if(!supported.length)result.reason=fish.routes.map(reason).find(Boolean)||'조건 자료 확인 필요';
      else if(supported.some(r=>!limited(r)))result.always=true;
      else if(settings&&!supported.some(r=>playable(r,settings,from)))result.reason=settings.days.some(d=>d.enabled)?'접속 시간·최소 도전 시간과 맞지 않음':'접속 요일 설정 필요';
      else result.pending=true;
      let cursor=from;
      function step(){
        if(!result.pending)return;
        if(weatherCache.size>100000)weatherCache.clear();
        const begin=Math.max(from,cursor-DAY),to=cursor+30*DAY;
        const chances=settings?opportunities(fish,settings,begin,to+DAY):fish.routes.flatMap((route,index)=>
          reason(route)?[]:windows(route,begin,to+DAY).map(w=>({...w,route:index,windowStart:w.start,windowEnd:w.end})));
        // Revisit chunk boundaries, preserving complete windows and merging alternate
        // routes so a single continuous opportunity cannot occupy several slots.
        const merged=[];
        for(const chance of [...result.chances,...chances.filter(c=>c.start<to)].sort((a,b)=>a.start-b.start||b.end-a.end)){
          const previous=merged.at(-1),routes=chance.routes||[chance.route];
          if(previous&&chance.start<=previous.end){previous.end=Math.max(previous.end,chance.end);previous.routes=[...new Set([...previous.routes,...routes])];}
          else merged.push({...chance,routes:[...routes]});
        }
        result.chances=merged.slice(0,count);cursor=to;
        // Complete the last displayed range before stopping at a chunk edge.
        result.pending=result.chances.length<count||result.chances.at(-1).end>=to;
      }
      step();
      return {result,step};
    }
    return {at,reason,limited,windows,opportunities,plan,startSearch,startTimeline,startMoochPreparation,startIntuitionPreparation,moochSources,preparations,clearCache:()=>weatherCache.clear()};
  }
  return {MINUTE,DAY,ET_HOUR,ET_DAY,WEATHER,KST,defaults,validate,weatherTarget,merge,sessions,intersect,create};
});
