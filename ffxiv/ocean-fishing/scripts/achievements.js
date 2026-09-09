// Own achievement planner. Requirements and curated routes are cited in data/achievements.json.
(function(root) {
  'use strict';
  const C=typeof module==='object'?require('./collection.js'):root.OceanCollection;
  const V=typeof module==='object'?require('./voyages.js'):root.JournalVoyages;
  const statusLabels={recommended:'추천 항로',alternative:'대체 항로',appearance:'일부 어종 출현',absent:'대상 없음'};
  const currentLabels={seek:'환해류 유도',avoid:'환해류 회피',weather:'날씨별 판단',prepare:'다음 구간 준비'};
  function create(data,fish) {
    if(data?.version!==1||!Array.isArray(data.goals)||data.goals.length!==12)throw Error('업적 자료 형식 오류');
    const goals=new Map(data.goals.map(g=>[g.id,g]));
    const cache=new Map();
    function forVoyage(voyage) {
      const {route,stops}=voyage;
      const max=route==='indigo'?12:route==='ruby'?9:0;
      if(!max||!Array.isArray(stops)||stops.length!==3)return [];
      // Derive identity from all three stop/time pairs, never trust a stale route number.
      const number=Array.from({length:max},(_,i)=>i+1).find(n=>V.stops(route,n).every((s,i)=>s.stop===stops[i]?.stop&&s.time===stops[i]?.time));
      if(!number)return [];
      const key=route+':'+number;
      if(cache.has(key))return cache.get(key);
      const result=data.goals.filter(g=>g.route===route).map(goal=>{
        const recommended=goal.recommended.includes(number);
        const sections=stops.map((stop,index)=>{
          const step=recommended?goal.steps[stop.stop]:null;
          const rows=fish.filter(f=>f.route===route&&f.Species===goal.id&&V.available(f,voyage,index));
          const targets=rows.map(f=>({fish:f,priority:!!step?.targets.includes(f.Fish)})).sort((a,b)=>Number(a.fish.spectral)-Number(b.fish.spectral)||Number(b.priority)-Number(a.priority)||(C.numberRange(b.fish.TH)?.min||0)-(C.numberRange(a.fish.TH)?.min||0)||a.fish.id-b.fish.id);
          return {...stop,index,targets,step,trigger:fish.find(f=>f.route===route&&f.Stop===stop.stop&&f.spectralTrigger)};
        });
        const count=sections.reduce((sum,s)=>sum+s.targets.length,0);
        const status=!count?'absent':recommended?'recommended':goal.alternatives.includes(number)?'alternative':'appearance';
        return {...goal,status,statusLabel:statusLabels[status],sections,availableCount:count};
      });
      cache.set(key,result);return result;
    }
    function nextDeparture(id,now=Date.now()) {
      const goal=goals.get(id);if(!goal)return null;
      // Search the full 12-day schedule cycle, including a still-open registration.
      return V.upcoming(goal.route,now,144).find(v=>v.close>now&&goal.recommended.includes(v.number))||null;
    }
    return {data,goals,forVoyage,nextDeparture};
  }
  const api={create,statusLabels,currentLabels};
  if(typeof module==='object')module.exports=api;else root.OceanAchievements=api;
})(typeof window==='undefined'?globalThis:window);
