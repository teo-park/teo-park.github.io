(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FishingStrategy=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const tug=r=>['!!','!!!','!'][r.tug]||'입질 미확인',hook=r=>['일반 낚아채기','강력한 낚아채기','섬세한 낚아채기'][r.hookset]||'낚아채기 미확인';
  const ref=id=>'{'+id+'}';
  const skillNames={chum:'밑밥',patience:'인내',patience2:'인내 2',prize:'대물 낚시',makeshift:'숙련 낚시꾼',slap:'교환 방생',identical:'한결같은 챔질',spareful:'낚시꾼의 묘안',collect:'소장품 채집',modest:'소박한 루어',ambitious:'거대한 루어'};
  function create(data,model,guides,catchStats={}){
    const valid=guides?.schemaVersion===1&&guides.catalogRevision===data.revisions?.teamcraft,cache=new WeakMap();
    const known=new Map(data.fishes.map(f=>[f.id,f]));
    function protectedFish(fish,route){
      const ids=new Set([fish.id]),visit=(id,depth=0)=>{if(ids.has(id)||depth>15)return;ids.add(id);for(const r of model.byId.get(id)?.routes||[])if(r.spotKey===route.spotKey){if(model.byId.get(r.bait)?.fish)visit(r.bait,depth+1);for(const p of r.predators||[])visit(p.id,depth+1);}};
      for(const p of model.paths(route))for(const id of p.ids)if(model.byId.get(id)?.fish)visit(id);
      for(const p of route.predators||[])visit(p.id);
      return ids;
    }
    function inferredSlap(fish,route,paths){
      if(catchStats.sourceRevision!==data.revisions?.teamcraft)return null;
      const path=paths[0];if(!path)return null;
      const mooch=path.ids.length>1,focus=mooch?model.byId.get(path.ids[1]):fish,base=path.ids[0];
      const focusRoute=mooch?focus?.routes.find(r=>r.spotKey===route.spotKey&&(r.bait===base||r.catalogBait===base)):route;
      if(!focusRoute)return null;
      const stats=catchStats.spots?.[route.spotKey]?.[base];if(!stats||stats.total<100)return null;
      const protectedIds=protectedFish(fish,route);
      const options=model.competitors(focus.id,{...focusRoute,bait:base}).filter(c=>{
        const f=known.get(c.fish.id)||c.fish;
        return c.baitKnown&&c.tugKnown&&c.hooksetKnown&&!protectedIds.has(f.id)&&!f.big&&!f.legendary&&!f.timed&&!f.weathered&&
          c.routes.some(r=>r.verified&&!model.byId.get(r.bait)?.fish&&!r.predators?.length&&!r.weathers?.length&&!r.weathersFrom?.length&&!r.aLure&&!r.mLure&&!r.snagging&&!Number.isFinite(r.spawn))&&stats.fish?.[f.id]>=10;
      }).sort((a,b)=>stats.fish[b.fish.id]-stats.fish[a.fish.id]||a.fish.id-b.fish.id);
      const best=options[0];if(!best)return null;
      return {ids:[best.fish.id],phase:mooch?model.byId.get(path.ids[1]).name+' 준비 후보':'본 낚시 교방 후보',inferred:true,bait:base,samples:stats.fish[best.fish.id],total:stats.total,
        note:'같은 미끼·입질 계열의 일반 어종 중 포획 기록이 많은 후보입니다. 최적 공략이나 입질 확률을 뜻하지 않습니다.'};
    }
    function plan(fish,route){
      if(!valid||!fish?.big||fish.stars||!guides.fish[fish.id]||!fish.routes.includes(route))return null;
      if(cache.has(route))return cache.get(route);
      const entry=guides.fish[fish.id],note=entry.note||{},allPaths=model.paths(route),paths=allPaths.filter(p=>p.complete).sort((a,b)=>a.ids.length-b.ids.length),mooch=!!model.byId.get(route.bait)?.fish;
      const first=paths[0],baitFish=model.byId.get(route.bait),skills=new Set(),prep=[],steps=[],warnings=[];
      let approach=note.approach||(mooch?(first?.ids.length>2?'연속 생미끼 준비':baitFish?.big?'희귀 생미끼·대물 낚시':'생미끼 준비·인내'):(route.predators?.length?'직감 준비 후 직접 낚시':'직접 낚시·밑밥'));
      if(!paths.length)prep.push('시작 미끼 경로를 확인하지 못했습니다. 연결된 원문에서 미끼를 먼저 확인하세요.');
      else prep.push('기본 경로: '+paths.map(p=>[...p.ids,fish.id].map(ref).join(' → ')).join(' / '));
      if(route.predators?.length)prep.push('직감 재료: '+route.predators.map(p=>ref(p.id)+' ×'+p.amount).join(' · ')+(entry.intuitionSeconds?' · 직감 '+entry.intuitionSeconds+'초':' · 지속 시간 자료 미확인'));
      if(route.snagging)prep.push('갈고리 낚시를 켜고 시작합니다.');
      if(note.prep?.length)prep.push(...note.prep);
      if(mooch){
        const prize=note.preferPrize||baitFish?.big&&!note.preserveLoop&&first?.ids.length===2;
        skills.add(prize?'prize':'patience');skills.add('makeshift');if(!note.noStore)skills.add('spareful');
        steps.push(prize?'첫 생미끼를 낚기 전에 대물 낚시를 켭니다. 대상 생미끼를 월척으로 낚으면 바로 생미끼로 이어갑니다.':'첫 생미끼를 준비하기 전에 인내를 켜고, 각 단계에 맞는 낚아채기로 월척을 확보합니다. 연속 생미끼에는 인내 2 또는 숙련 낚시꾼을 선택합니다.');
        warnings.push('생미끼 프록이 떠 있으면 밑밥·대물 낚시·인내·교환 방생·한결같은 챔질로 끊지 마세요. 숙련 낚시꾼은 프록을 유지하며 다음 포획부터 적용됩니다.');
        if(note.preserveLoop)warnings.push('두 기술을 함께 쓸 수 있는 일반 생미끼에서는 낚시꾼의 묘안 → 한결같은 챔질 순서입니다. 터주 등 챔질 대상이 아닌 어종에는 적용하지 않습니다.');
      }else{
        skills.add('chum');
        steps.push('본 어종은 미끼를 직접 던져 낚습니다. 수첩 등록만 목적이면 월척이 필수는 아니므로 인내·대물 낚시를 기본으로 켜지 않습니다.');
      }
      if(note.steps?.length)steps.push(...note.steps);
      const required=route.mLure>0?'modest':route.aLure>0?'ambitious':null,lure=required||(!note.noLure&&note.lure);
      if(lure){skills.add(lure);steps.push(required?`${skillNames[lure]} ${route.mLure||route.aLure}회 조건을 충족해야 합니다. 일반 크기 확정 메시지와 어종 전용 메시지를 구분합니다.`:`본 낚시에서 ${skillNames[lure]}를 최대 3회 또는 해당 계열 확정 메시지까지 사용하는 공략입니다. 밑밥을 쓰더라도 루어용 GP를 남깁니다.`);}
      steps.push('목표 입질 '+tug(route)+' · 인내 효과 중에는 '+hook(route)+'.'+(note.preserveLoop?' 생미끼를 이어 줄 물고기도 실제 이름을 확인해 낚습니다.':note.keepOtherBites?' 직감 갱신·재준비용 입질은 아래 주의사항도 확인합니다.':' 재료 준비가 끝난 본 낚시에서는 다른 입질을 거두고 재시도합니다.'));
      if(note.lurePrep){skills.add(note.lurePrep);prep.push(`첫 생미끼 준비에는 ${skillNames[note.lurePrep]}를 활용합니다. 생미끼를 던진 뒤에 이 기술을 쓰는 뜻은 아닙니다.`);}
      if(note.lureTiming){skills.add(route.hookset===1?'ambitious':'modest');}
      if(lure||note.lurePrep||note.lureTiming)warnings.push('루어는 사용 시점의 조건으로 다시 판정합니다. 창이 끝난 뒤 마지막 캐스팅에 루어를 쓰면 목표가 후보에서 빠질 수 있습니다.');
      if(note.collectHold){skills.add('collect');warnings.push('소장품 확인 창에서 기다리는 동안에는 아직 직감 재료를 획득한 것이 아닙니다. 수량과 실제 창 시작을 확인하고 받습니다.');}
      const slaps=note.noSlap?[]:note.slaps?.length?note.slaps:[];
      const suggestion=!note.noSlap&&!slaps.length&&!note.slapAdvice?inferredSlap(fish,route,paths):null;
      if(slaps.length||suggestion||note.slapAdvice)skills.add('slap');
      if(note.noSlap)warnings.push('이 공략은 교환 방생을 기본 추천하지 않습니다. '+(mooch?'정해진 미끼로 생미끼를 확보하는 데 집중합니다.':'직감 재준비와 캐스팅 자원을 먼저 확보합니다.'));
      if(note.noLure)warnings.push('입질 세기·낚아채기 계열만 보고 루어를 추가하지 않습니다. 이 공략에서는 루어보다 시도 횟수·GP를 우선합니다.');
      warnings.push(...(note.warnings||[]));
      const result={id:fish.id,approach,entry,prep,steps,warnings,skills:[...skills],slaps,suggestion,paths,mooch,required,
        evidence:entry.reviewed?'공략 대조':'조건 기반 계획',missingSlap:!note.noSlap&&!note.slapAdvice&&!slaps.length&&!suggestion};
      cache.set(route,result);return result;
    }
    return {plan,inferredSlap,protectedFish,skillNames};
  }
  return {create,skillNames};
});
