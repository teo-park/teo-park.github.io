(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FishingBaitRanking=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const policy={minTotal:100,minHits:10,minGain:.02,z:1.96};
  // Wilson bounds penalize small samples; they do not correct selective hooking.
  function bounds(hits,total){
    if(!Number.isSafeInteger(hits)||!Number.isSafeInteger(total)||hits<0||total<=0||hits>total)return null;
    const rate=hits/total,z2=policy.z**2,denominator=1+z2/total,center=rate+z2/(2*total),radius=policy.z*Math.sqrt(rate*(1-rate)/total+z2/(4*total**2));
    return {rate,lower:Math.max(0,(center-radius)/denominator),upper:Math.min(1,(center+radius)/denominator)};
  }
  function eligible(fish,route,byId,spot){
    return fish.kind==='rod'&&!fish.big&&!fish.legendary&&!fish.timed&&!fish.weathered&&route.verified===true&&byId.has(route.bait)&&byId.get(route.bait).fish===false&&spot?.kind==='rod'&&
      !Number.isFinite(route.spawn)&&!Number.isFinite(route.duration)&&!route.weathers?.length&&!route.weathersFrom?.length&&!route.predators?.length&&!route.snagging&&!route.aLure&&!route.mLure&&route.oceanFishingTime===undefined;
  }
  function rank(fishId,original,spotStats,byId){
    const candidates=[];
    for(const [key,stats] of Object.entries(spotStats||{})){
      const id=+key;if(byId.get(id)?.fish!==false)continue;
      const hits=stats.fish?.[fishId]||0,interval=bounds(hits,stats.total);if(!interval||!hits)continue;
      candidates.push({id,hits,total:stats.total,...interval,enough:stats.total>=policy.minTotal&&hits>=policy.minHits});
    }
    candidates.sort((a,b)=>Number(b.enough)-Number(a.enough)||b.lower-a.lower||Number(b.id===original)-Number(a.id===original)||a.id-b.id);
    const base=candidates.find(c=>c.id===original),supported=candidates.filter(c=>c.enough),best=supported[0];
    let selected=original,status='insufficient';
    if(base?.enough&&supported.length>=2){
      if(best.id===original)status='supported';
      else if(best.lower>base.upper&&best.rate-base.rate>=policy.minGain){selected=best.id;status='changed';}
      else status='close';
    }
    return {original,selected,status,candidates};
  }
  function prepare(data,snapshot){
    if(!data||snapshot?.schemaVersion!==1||!snapshot.spots||snapshot.sourceRevision!==data.revisions?.teamcraft)return data;
    const byId=new Map(Object.values(data.related).map(f=>[f.id,f]));for(const f of data.fishes)byId.set(f.id,f);
    const prepared=new Map();
    function fish(f){if(prepared.has(f.id))return prepared.get(f.id);
      const result={...f,routes:(f.routes||[]).map(r=>{
        if(!eligible(f,r,byId,data.spots[r.spotKey]))return r;
        // If this species also has a mooch route here, aggregate bait counts cannot
        // reliably separate that path. Keep its catalog route intact.
        if(f.routes.some(other=>other.spotKey===r.spotKey&&byId.get(other.bait)?.fish))return r;
        const original=r.catalogBait??r.bait,choice=rank(f.id,original,snapshot.spots[r.spotKey],byId);
        return {...r,bait:choice.selected,catalogBait:original,baitChoice:choice};
      })};prepared.set(f.id,result);return result;
    }
    return {...data,fishes:data.fishes.map(fish),related:Object.fromEntries(Object.entries(data.related).map(([id,f])=>[id,fish(f)]))};
  }
  return {policy,bounds,eligible,rank,prepare};
});
