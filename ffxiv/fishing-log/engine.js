(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FishingBook=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const INITIALS=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
  const normalize=v=>String(v??'').normalize('NFC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
  const initials=v=>[...v].map(c=>{const n=c.charCodeAt(0)-0xac00;return n>=0&&n<=11171?INITIALS[Math.floor(n/588)]:c;}).join('');
  function create(data,biteTimes={}){
    const byId=new Map(Object.values(data.related).map(f=>[f.id,f]));for(const f of data.fishes)byId.set(f.id,f);
    const cache=new Map();
    function chains(bait,spot,seen=new Set()){
      const f=byId.get(bait);if(!f?.fish)return [{ids:[bait],complete:!!f}];if(seen.has(bait))return [{ids:[bait],complete:false}];
      const next=new Set(seen);next.add(bait);const routes=(f.routes||[]).filter(r=>r.spotKey===spot&&r.bait);
      if(!routes.length)return [{ids:[bait],complete:false}];
      const paths=routes.flatMap(r=>chains(r.bait,spot,next).map(p=>({ids:[...p.ids,bait],complete:p.complete})));
      return [...new Map(paths.map(p=>[p.ids.join(','),p])).values()];
    }
    function paths(route){const key=route.spotKey+':'+route.bait;if(!route.bait)return [];if(!cache.has(key))cache.set(key,chains(route.bait,route.spotKey));return cache.get(key);}
    // Match each mooch edge, never another spot or another preceding bait.
    function tacklePaths(route){return paths(route).map(p=>({...p,steps:p.ids.map((id,i)=>({id,routes:i>0?(byId.get(id)?.routes||[]).filter(r=>r.spotKey===route.spotKey&&r.bait===p.ids[i-1]):[]}))}));}
    function biteTime(id,route){return biteTimes.ranges?.[`${id}|${route.spotKey}|${route.bait}`]||null;}
    function competitors(id,route){
      if(!route.bait||route.tug===undefined)return [];
      return [...byId.values()].filter(f=>f.fish&&f.id!==id).flatMap(f=>{
        const atSpot=(f.routes||[]).filter(r=>r.spotKey===route.spotKey),exact=atSpot.filter(r=>r.bait===route.bait),observed=biteTime(f.id,route);
        if(!atSpot.length&&!observed)return [];
        const conditions=exact.length?exact:atSpot,tugs=[...new Set(conditions.map(r=>r.tug).filter(v=>v!==undefined))];
        if(tugs.length&&!tugs.includes(route.tug))return [];
        // A different preferred bait does not prove that this bait cannot work.
        const baitKnown=!!(exact.length||observed),tugKnown=tugs.length===1&&tugs[0]===route.tug;
        return [{fish:f,routes:conditions,time:observed,baitKnown,tugKnown}];
      }).sort((a,b)=>Number(b.baitKnown)-Number(a.baitKnown)||Number(b.tugKnown)-Number(a.tugKnown)||a.fish.name.localeCompare(b.fish.name,'ko'));
    }
    function routeMatches(r,options={}){const place=data.spots[r.spotKey];if(options.region&&options.region!=='all'&&place?.region!==options.region)return false;if(!options.bait||options.bait==='all')return true;if(options.bait==='unknown')return !r.verified||!paths(r).some(p=>p.complete);return paths(r).some(p=>p.complete&&p.ids[0]===+options.bait);}
    const routeList=(fish,options={})=>fish.routes.filter(r=>routeMatches(r,options));
    const terms=new Map(data.fishes.map(f=>{const s=[f.name,f.original,...f.routes.flatMap(r=>[data.spots[r.spotKey]?.name,data.spots[r.spotKey]?.area,data.spots[r.spotKey]?.region,...paths(r).flatMap(p=>p.ids.map(id=>byId.get(id)?.name)),...(r.predators||[]).map(p=>byId.get(p.id)?.name)])].join(' ');return [f.id,{text:normalize(s),initials:normalize(initials(s))}];}));
    function filter(caught,options={}){const q=normalize(options.query),number=/^(?:no)?\d+$/.test(q)?+q.replace(/^no/,''):null;
      return data.fishes.filter(f=>(!options.kind||f.kind===options.kind)&&(!options.status||options.status==='all'||caught.has(f.id)===(options.status==='caught'))&&(!options.rarity||options.rarity==='all'||(options.rarity==='normal'?!f.big:options.rarity==='big'?f.big:f.legendary))&&(!q||(number!==null?f.order===number||f.id===number:terms.get(f.id).text.includes(q)||terms.get(f.id).initials.includes(q)))&&((options.region==='all'||!options.region)&&((options.bait==='all'||!options.bait)||options.bait==='unknown'&&!f.routes.length)||routeList(f,options).length));
    }
    function groups(fishes,mode,options={}){
      const found=new Map();
      for(const fish of fishes){const routes=routeList(fish,options);if(!routes.length){put('unknown','조건 자료 확인 필요',fish,[]);continue;}
        for(const route of routes){if(mode==='spot'){const p=data.spots[route.spotKey];put(route.spotKey,p?.name||'장소 확인 필요',fish,[route],p?.area);}
          else{const base=[...new Set(paths(route).filter(p=>p.complete).map(p=>p.ids[0]))];if(!base.length)put('unknown','시작 미끼 확인 필요',fish,[route]);else for(const id of base)if(!options.bait||options.bait==='all'||String(id)===options.bait)put(String(id),byId.get(id)?.name||'미끼 '+id,fish,[route]);}}
      }
      function put(key,name,fish,routes,area){if(!found.has(key))found.set(key,{key,name,area,entries:new Map()});const g=found.get(key);if(!g.entries.has(fish.id))g.entries.set(fish.id,{fish,routes:[]});const row=g.entries.get(fish.id);for(const route of routes)if(!row.routes.includes(route))row.routes.push(route);}
      return [...found.values()].map(g=>({...g,entries:[...g.entries.values()]})).sort((a,b)=>a.key==='unknown'?1:b.key==='unknown'?-1:a.name.localeCompare(b.name,'ko'));
    }
    return {byId,paths,tacklePaths,biteTime,competitors,routeMatches,routeList,filter,groups};
  }
  const validIds=ids=>Array.isArray(ids)&&ids.length<=30000&&ids.every(id=>Number.isSafeInteger(id)&&id>0);
  function parseBackup(text){let v;try{v=JSON.parse(text);}catch{throw Error('JSON 기록을 읽을 수 없어요.');}if(!v||v.type!=='ffxiv-fishing-log'||v.schemaVersion!==1||!validIds(v.caught))throw Error('어부 수첩의 백업 파일이 아닙니다.');return new Set(v.caught);}
  function parseTransfer(text,known){let v;try{v=JSON.parse(text);}catch{throw Error('복사한 JSON 전체를 붙여 넣어 주세요.');}if(v?.type==='ffxiv-fishing-log')return {ids:parseBackup(text),ignored:0,format:'backup'};const ids=Array.isArray(v)?v:v&&Object.keys(v).length===1&&Array.isArray(v.completed)?v.completed:null;if(!validIds(ids))throw Error('Teamcraft 숫자 ID 배열 또는 어부 수첩 백업을 넣어 주세요.');const unique=new Set(ids);return {ids:new Set([...unique].filter(id=>known.has(id))),ignored:[...unique].filter(id=>!known.has(id)).length,format:'teamcraft'};}
  const backup=caught=>JSON.stringify({type:'ffxiv-fishing-log',schemaVersion:1,exportedAt:new Date().toISOString(),caught:[...caught].sort((a,b)=>a-b)},null,2);
  const teamcraft=(caught,known)=>JSON.stringify({completed:[...caught].filter(id=>known.has(id)).sort((a,b)=>a-b)});
  function clock(hour){const minutes=((Math.round(hour*60)%1440)+1440)%1440;return String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');}
  function timeWindow(route){if(!Number.isFinite(route.spawn)||!Number.isFinite(route.duration))return null;if(route.duration>=24)return 'ET 24시간';return `ET ${clock(route.spawn)}–${clock(route.spawn+route.duration)}${route.spawn+route.duration>24?' (다음 날)':''}`;}
  function clearBiteWindows(target,competitors){
    if(!target||competitors.some(c=>!c.time||!c.baitKnown||!c.tugKnown))return null;
    let windows=[[target.min,target.max]];
    for(const c of competitors)windows=windows.flatMap(([start,end])=>c.time.max<=start||c.time.min>=end?[[start,end]]:[[start,Math.max(start,c.time.min)],[Math.min(end,c.time.max),end]].filter(([a,b])=>a<b));
    return windows;
  }
  return {normalize,initials,create,parseBackup,parseTransfer,backup,teamcraft,timeWindow,clearBiteWindows};
});
