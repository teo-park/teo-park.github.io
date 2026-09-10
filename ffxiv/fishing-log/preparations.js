(function(){
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  const longDate=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
  const clock=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false});
  function mount({data,model,forecast,getCaught}){
    const F=window.FishingForecast,entries=new Map(),byKey=new Map();let sequence=0,timer;
    const visible=slot=>slot.isConnected&&!slot.closest('[hidden]')&&(!slot.closest('dialog')||slot.closest('dialog').open);
    function entry(fish){
      const signature=JSON.stringify([fish.id,fish.routes]);
      if(!entries.has(signature)){const value={key:'prep-'+(++sequence),fish,from:0,search:null,counting:false};entries.set(signature,value);byKey.set(value.key,value);}
      return entries.get(signature);
    }
    function condition(routes){
      const labels=routes.map(r=>Number.isFinite(r.spawn)&&r.duration<24?`ET ${et(r.spawn)}–${et((r.spawn+r.duration)%24)}${r.weathers?.length||r.weathersFrom?.length?' · 날씨 조건':''}`:r.weathers?.length||r.weathersFrom?.length?'날씨 조건':'선행 준비 필요');
      return [...new Set(labels)].join(' / ');
    }
    const et=hour=>String(Math.floor(hour)).padStart(2,'0')+':'+String(Math.round((hour%1)*60)).padStart(2,'0');
    function tree(nodes){return `<ul class="preparation-list">${nodes.map(node=>{
      const fish=node.fish,relation=node.relation==='intuition'?`직감 ×${node.amount}`:'생미끼',places=[...new Set(fish.routes.map(r=>data.spots[r.spotKey]?.name).filter(Boolean))];
      const bait=[...new Set(fish.routes.flatMap(r=>model.paths(r).map(p=>p.ids.map(id=>model.byId.get(id)?.name||id).join(' → '))))];
      const bites=[...new Set(fish.routes.map(r=>`${{0:'!!',1:'!!!',2:'!'}[r.tug]||'입질 미확인'} · ${{0:'일반 낚아채기',1:'강력한 낚아채기',2:'섬세한 낚아채기'}[r.hookset]||'낚아채기 미확인'}`))];
      return `<li data-preparation-fish="${fish.id}" data-preparation-relation="${node.relation}"><div class="preparation-row"><div class="preparation-fish">${fish.icon?`<img src="${esc(fish.icon)}" alt="" width="24" height="24" loading="lazy">`:''}<div><span class="preparation-role">${relation}</span><button type="button" data-fish-detail="${fish.id}">${esc(fish.name)}</button><span class="preparation-caught" data-preparation-caught="${fish.id}" ${getCaught().has(fish.id)?'':'hidden'}>수집 완료</span></div></div><div class="preparation-tackle"><span>${esc(bait.join(' / ')||'미끼 확인 필요')}</span><span>${esc(bites.join(' / '))}</span><span>${esc(places.join(' · '))}</span></div><div class="preparation-time"><span class="preparation-condition">${esc(condition(fish.routes))}</span>${node.timed?`<button type="button" class="preparation-time-toggle" data-preparation-times="${entry(fish).key}" aria-label="${esc(fish.name)} 출현 시간" aria-pressed="false" disabled>출현 시간 계산 중</button><button type="button" class="preparation-more" data-fish-detail="${fish.id}" aria-label="${esc(fish.name)} 출현 시간 5회 보기">출현 5회 ↗</button>`:'<span>준비 시간은 하위 어종 참고</span>'}</div></div>${node.children.length?tree(node.children):''}</li>`;
    }).join('')}</ul>`;}
    function markup(fish,routes=fish.routes){
      const nodes=forecast.preparations(fish,routes);if(!nodes.length)return '';
      const scoped={...fish,routes},mooch=forecast.moochSources(scoped).length>0,intuition=routes.some(r=>r.predators?.length);
      const flow=mooch?`<div class="mooch-plan" data-mooch-plan="${entry(scoped).key}" data-mooch-target="${fish.id}"><strong>준비 시간 → 도전 구간</strong><span>생미끼 시간 계산 중</span></div>`:'';
      return `<section class="fish-preparations" aria-label="${esc(fish.name)} 준비 어종">${flow}<div class="preparation-heading"><strong>${intuition?'직감 준비 어종 · 출현 시간':'생미끼 준비 어종 · 출현 시간'}</strong><span>접속 시간과 관계없는 출현 · KST</span></div>${tree(nodes)}<p class="preparation-note">${intuition?'직감은 미리 준비한 뒤 지역에서 대기할 수 있습니다. 아래 어종의 출현 시간으로 대상의 도전 구간을 제한하지 않습니다. 수집 완료는 현재 직감 준비 완료를 뜻하지 않습니다.':'준비 어종은 수집했어도 표시합니다. 생미끼를 실제로 확보·유지해야 도전할 수 있으며, 준비 완료 여부는 자동으로 알 수 없습니다.'}</p></section>`;
    }
    function paintMooch(value,slots,now){
      const state=value.moochSearch.result,plan=state.plan;
      const stamp=ms=>(new Date(ms+F.KST).getUTCFullYear()===new Date(now+F.KST).getUTCFullYear()?date:longDate).format(ms);
      const range=c=>`${stamp(c.start)} – ${Math.floor((c.start+F.KST)/F.DAY)===Math.floor((c.end+F.KST)/F.DAY)?clock.format(c.end):stamp(c.end)}`;
      const html=`<strong class="mooch-title">준비 시간 → 도전 구간 <span>생미끼 · KST</span></strong>`+(plan?`<div class="mooch-flow"><div><span>준비 시간 · ${esc(model.byId.get(plan.source)?.name)}</span><strong>${range(plan.preparation)}</strong></div><span class="mooch-arrow" aria-hidden="true">→</span><div><span>도전 구간 · ${esc(value.fish.name)}</span><strong>${plan.challenge?range(plan.challenge):'생미끼 확보 후 · 유지 중 도전'}</strong>${plan.challenge?'':'<span>대상 자체의 시간·날씨 제한 없음</span>'}</div></div><p>${plan.hold?'생미끼를 확보한 뒤 도전 시작까지 유지해야 합니다. ':''}지금부터 새로 준비 · 생미끼 확보·유지 전제.${plan.intuition?' 직감 조건은 별도로 준비해야 합니다.':''}</p>`:`<span>${esc(state.reason||'준비 시간과 이어지는 도전 구간을 찾는 중')}</span>`);
      for(const slot of slots)if(slot.innerHTML!==html)slot.innerHTML=html;
    }
    function remaining(ms){const seconds=Math.max(0,Math.ceil(ms/1000)),days=Math.floor(seconds/86400),hours=Math.floor(seconds%86400/3600),minutes=Math.floor(seconds%3600/60);return [days?days+'일':'',hours?hours+'시간':'',minutes?minutes+'분':'',seconds%60+'초'].filter(Boolean).join(' ');}
    function paint(value,slots,now){
      const state=value.search.result,stamp=ms=>(new Date(ms+F.KST).getUTCFullYear()===new Date(now+F.KST).getUTCFullYear()?date:longDate).format(ms);
      const range=c=>`${stamp(c.start)} – ${Math.floor((c.start+F.KST)/F.DAY)===Math.floor((c.end+F.KST)/F.DAY)?clock.format(c.end):stamp(c.end)}`;
      const [current,next]=state.chances.filter(c=>c.end>now),counting=value.counting&&!!current;
      const currentText=current&&(counting?`${now<current.start?'시작':'종료'}까지 ${remaining((now<current.start?current.start:current.end)-now)}`:range(current));
      const nextText=next&&(counting?`다음 출현까지 ${remaining(next.start-now)}`:`다음 ${range(next)}`);
      const html=state.reason?esc(state.reason):state.always?'상시 낚시':`${current?`<strong>${current.start<=now&&now<current.end?'<b class="preparation-now">지금</b> ':''}${currentText}</strong>`:'<span>다음 출현 찾는 중</span>'}${next?`<span>${nextText}</span>`:state.pending?'<span>더 먼 출현 찾는 중</span>':''}`;
      for(const slot of slots){
        if(slot.innerHTML!==html)slot.innerHTML=html;
        slot.disabled=!current||!!state.reason||state.always;
        slot.setAttribute('aria-pressed',String(counting));
        slot.setAttribute('aria-label',value.fish.name+(slot.disabled?' 출현 시간':counting?' 출현 시각 보기':' 남은 시간 보기'));
        slot.title=current?`${range(current)} (KST)${next?' · 다음 '+range(next):''} · 눌러서 ${counting?'출현 시각':'남은 시간'} 보기`:'';
      }
    }
    function timeSlots(){
      const groups=new Map();
      for(const slot of document.querySelectorAll('[data-preparation-times]'))if(visible(slot)){const key=slot.dataset.preparationTimes;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(slot);}
      return groups;
    }
    function moochSlots(){
      const groups=new Map();for(const slot of document.querySelectorAll('[data-mooch-plan]'))if(visible(slot)){const key=slot.dataset.moochPlan;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(slot);}return groups;
    }
    function tick(){
      if(document.hidden)return;const now=Date.now();
      for(const [key,slots] of timeSlots()){const value=byKey.get(key);if(!value?.search)continue;
        if(value.search.result.chances[0]?.end<=now){refresh();return;}
        paint(value,slots,now);
      }
      for(const [key] of moochSlots()){const value=byKey.get(key),plan=value?.moochSearch?.result.plan;if(plan&&(plan.challenge?.end??plan.preparation.end)<=now){refresh();return;}}
    }
    function refresh(){
      clearTimeout(timer);if(document.hidden)return;
      const now=Date.now(),groups=timeSlots(),caught=getCaught();
      for(const label of document.querySelectorAll('[data-preparation-caught]'))label.hidden=!caught.has(+label.dataset.preparationCaught);
      const pending=[];
      for(const [key,slots] of groups){const value=byKey.get(key);if(!value)continue;
        // Do not restart a distant search while its first window is still in the future.
        if(!value.search||value.search.result.chances[0]?.end<=now||!value.search.result.pending&&now-value.from>=F.MINUTE){value.search=forecast.startTimeline(value.fish,now,{count:2});value.from=now;}
        paint(value,slots,now);if(value.search.result.pending)pending.push({value,slots});
      }
      for(const [key,slots] of moochSlots()){
        const value=byKey.get(key);if(!value)continue;const plan=value.moochSearch?.result.plan;
        if(!value.moochSearch||plan&&(plan.challenge?.end??plan.preparation.end)<=now||!value.moochSearch.result.pending&&now-value.moochFrom>=F.MINUTE){value.moochSearch=forecast.startMoochPreparation(value.fish,now);value.moochFrom=now;}
        paintMooch(value,slots,now);if(value.moochSearch.result.pending)pending.push({value,slots,mooch:true});
      }
      function advance(){
        if(document.hidden)return;const start=performance.now();
        while(pending.length&&performance.now()-start<12){const item=pending.shift();item.slots=item.slots.filter(visible);if(!item.slots.length)continue;const search=item.mooch?item.value.moochSearch:item.value.search;search.step();(item.mooch?paintMooch:paint)(item.value,item.slots,Date.now());if(search.result.pending)pending.push(item);}
        if(pending.length)timer=setTimeout(advance,50);
      }
      if(pending.length)timer=setTimeout(advance,0);
    }
    const view={markup,refresh};window.FishingPreparationView=view;
    document.addEventListener('click',event=>{const button=event.target.closest('button[data-preparation-times]');if(!button||button.disabled)return;const value=byKey.get(button.dataset.preparationTimes);if(value){value.counting=!value.counting;tick();}});
    setInterval(tick,1000);
    setInterval(refresh,60000);
    document.addEventListener('visibilitychange',refresh);
    document.addEventListener('fishing-collection-changed',refresh);
    document.getElementById('detailDialog').addEventListener('close',refresh);
    return view;
  }
  window.FishingPreparations={mount};
})();
