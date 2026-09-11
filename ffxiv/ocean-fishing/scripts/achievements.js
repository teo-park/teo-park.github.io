// Own achievement planner. Requirements and curated routes are cited in data/achievements.json.
(function(root) {
  'use strict';
  const C=typeof module==='object'?require('./collection.js'):root.OceanCollection;
  const V=typeof module==='object'?require('./voyages.js'):root.JournalVoyages;
  const statusLabels={recommended:'추천 항로',alternative:'대체 항로',appearance:'일부 어종 출현',absent:'대상 없음'};
  const currentLabels={seek:'환해류 유도',avoid:'환해류 회피',weather:'날씨별 판단',prepare:'다음 구간 준비'};
  // Compare against the target's bait, before collection/species filters remove peers.
  function biteComparison(target,rows) {
    if(!/^!{1,3}$/.test(target.Bite||''))return [];
    const primary=C.baitInfo(target), baits=primary.any?
      [['Ragworm','바위털갯지렁이'],['Krill','크릴'],['Plump Worm','굵은지렁이']].map(([BestBait,BestBaitTranslated])=>C.baitInfo({...target,BaitAny:'',BestBait,BestBaitTranslated})): [primary];
    const present=value=>!!String(value??'').trim()&&!/^(null|undefined)$/i.test(String(value).trim());
    const sameWeather=peer=>{
      const a=target.weather?.filter(w=>w.available).map(w=>w.name)||[],b=peer.weather?.filter(w=>w.available).map(w=>w.name)||[];
      return !a.length||!b.length||a.some(name=>b.includes(name));
    };
    return baits.filter(bait=>bait.identity).map(bait=>{
      let unknown=0;
      const peers=[];
      for(const fish of rows){
        if(C.key(fish.Fish)===C.key(target.Fish)||fish.route!==target.route||fish.Stop!==target.Stop||!!fish.spectral!==!!target.spectral||fish.Bite!==target.Bite||!sameWeather(fish))continue;
        const peerBait=C.baitInfo(fish);
        if(bait.field==='Mooch'&&C.key(fish.BaitMoochType)!==bait.identity){
          if(String(fish.BaitMoochAlternatives||'').split('|').some(name=>C.key(name)===bait.identity))peers.push({fish,rawTime:'',overlap:null});
          continue;
        }
        if(bait.field==='Special'&&C.key(fish.BaitSpecialType)!==bait.identity)continue;
        const raw=fish['Bait'+bait.field],rawTime=String((Array.isArray(raw)?raw[0]:raw)??'').trim();
        if(!present(rawTime)&&peerBait.identity!==bait.identity&&!(peerBait.any&&['Ragworm','Krill','PlumpWorm'].includes(bait.field))){unknown++;continue;}
        const window=C.numberRange(rawTime),overlap=bait.window&&window?window.min<=bait.window.max&&window.max>=bait.window.min:null;
        peers.push({fish,rawTime,overlap});
      }
      const priority=p=>p.overlap===true?0:p.overlap===null?1:2;
      peers.sort((a,b)=>priority(a)-priority(b)||(C.numberRange(a.rawTime)?.min??Infinity)-(C.numberRange(b.rawTime)?.min??Infinity)||a.fish.FishTranslated.localeCompare(b.fish.FishTranslated,'ko'));
      return {...bait,peers,unknown};
    });
  }
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
          const available=fish.filter(f=>f.route===route&&V.available(f,voyage,index));
          const rows=available.filter(f=>f.Species===goal.id);
          const targets=rows.map(f=>({fish:f,priority:!!step?.targets.includes(f.Fish),comparison:biteComparison(f,available)})).sort((a,b)=>Number(a.fish.spectral)-Number(b.fish.spectral)||Number(b.priority)-Number(a.priority)||(C.numberRange(b.fish.TH)?.min||0)-(C.numberRange(a.fish.TH)?.min||0)||a.fish.id-b.fish.id);
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
  const api={create,statusLabels,currentLabels,biteComparison};
  if(typeof module==='object')module.exports=api;else root.OceanAchievements=api;
})(typeof window==='undefined'?globalThis:window);
