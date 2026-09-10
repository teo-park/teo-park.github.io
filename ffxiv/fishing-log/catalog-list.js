(function(){
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  const fullDate=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
  const clock=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false});
  function mount({data,model}){
    const parts=window.FishingPlanRows;if(!parts)return null;
    const $=id=>document.getElementById(id),host=$('collectionListViewport'),F=window.FishingForecast;
    const selections=new Map(),opened=new Set(),countdowns=new Set(),cache=new Map();
    let items=[],options={},live=new Map(),timer;
    const visible=()=>!document.hidden&&!host.closest('[hidden]');
    const stamp=(ms,now)=>(new Date(ms+F.KST).getUTCFullYear()===new Date(now+F.KST).getUTCFullYear()?date:fullDate).format(ms);
    function entry(fish){
      const routes=model.routeList(fish,options),index=selections.get(fish.id),route=routes.find(r=>fish.routes.indexOf(r)===index)||routes[0];
      const routeIndex=fish.routes.indexOf(route),key=fish.id+':'+routeIndex;
      if(!cache.has(key))cache.set(key,{fish,route,routeIndex,key,search:null,from:0});
      return {...cache.get(key),routes,value:cache.get(key)};
    }
    function status(item){
      if(item.fish.kind==='spear')return {reason:'작살질',note:item.route?.predators?.length?'숨은 어장 준비 필요':'어장 조건은 조건 버튼에서 확인'};
      if(model.isOceanFish(item.fish))return {reason:'먼바다 전용',note:'항로·환해류 조건 확인',ocean:true};
      const reason=item.route?parts.forecast.reason(item.route):'조건 자료 확인 필요';
      return reason?{reason:reason==='생미끼·직감 선행 시간 별도 확인'?'직감·생미끼 준비 필요':reason,note:reason==='생미끼·직감 선행 시간 별도 확인'?'하위 어종의 출현 시간 참고':'조건 버튼에서 상세 확인'}:null;
    }
    function panel(item){return item.route?window.FishingDetails.renderCatalog(item.fish.id,item.route,'catalog-detail-title-'+item.fish.id):'<p>낚시 조건 자료 확인 필요</p>';}
    function row(item){
      const {fish,route,routes,routeIndex}=item,unknown=status(item),id=fish.id;
      const choices=routes.length>1?`<select class="catalog-route-choice" data-catalog-route="${id}" aria-label="${esc(fish.name)} 낚시 경로">${routes.map((r,i)=>`<option value="${fish.routes.indexOf(r)}" ${r===route?'selected':''}>${i+1}/${routes.length} · ${esc(data.spots[r.spotKey]?.name||'낚시터 미확인')}${r.bait?' · '+esc(model.byId.get(r.bait)?.name||'미끼 미확인'):''}</option>`).join('')}</select>`:'';
      return `<div class="plan-entry catalog-entry" data-catalog-entry="${id}"><article class="plan-card catalog-card" aria-label="${esc(fish.name)} 수집도감" data-plan-now="false" data-plan-availability="unknown">
        <div class="plan-fish"><img src="${esc(fish.icon)}" width="30" height="30" alt="" loading="lazy"><div><button class="plan-name" data-fish-detail="${id}">${esc(fish.name)}</button><div class="plan-labels"><span>No.${fish.order}</span><span>${fish.legendary?'전설어':fish.big?'터주':fish.kind==='spear'?'작살질':'일반'}</span><span class="catalog-collected">수집 완료</span><span data-catalog-timing></span></div></div></div>
        ${route?parts.bite(fish,route):'<div class="plan-bite">입질 자료 확인 필요</div>'}
        ${route?parts.place(fish,route,'',choices):'<div class="plan-place">낚시터 자료 확인 필요</div>'}
        ${unknown?`<div class="plan-window"><strong>${esc(unknown.reason)}</strong><span>${esc(unknown.note)}</span></div>`:`<button class="plan-window plan-time-toggle" data-catalog-countdown="${id}" aria-label="${esc(fish.name)} 남은 시간 보기" aria-pressed="${countdowns.has(id)}" disabled><strong>출현 시간 계산 중</strong></button>`}
        ${route?parts.tackle(fish,route):'<div class="plan-tackle">미끼·조건 자료 확인 필요</div>'}
        <div class="plan-next"><span data-catalog-next>${unknown?'—':'다음 출현 계산 중'}</span>${unknown?.ocean?'<a class="plan-timeline-link" href="../ocean-fishing/">먼바다 보기 ↗</a>':fish.kind==='rod'?`<button class="plan-timeline-link" data-fish-detail="${id}">${unknown?'준비·조건 보기':'출현 5회 보기'} ↗</button>`:''}</div>
        <div class="plan-card-actions"><button data-catalog-detail="${id}" aria-label="${esc(fish.name)} 낚시 조건" aria-expanded="${opened.has(item.key)}" aria-controls="catalog-detail-${id}">조건</button><button data-caught="${id}" aria-label="${esc(fish.name)} 수집" aria-pressed="false">수집</button></div>
      </article>${fish.kind==='rod'&&route&&!model.isOceanFish(fish)?window.FishingPreparationView?.markup(fish,[route])||'':''}<section class="plan-inline-detail" id="catalog-detail-${id}" data-catalog-panel="${item.key}" aria-labelledby="catalog-detail-title-${id}" ${opened.has(item.key)?'':'hidden'}>${opened.has(item.key)?panel(item):''}</section></div>`;
    }
    function remaining(ms){const total=Math.max(0,Math.ceil(ms/1000)),days=Math.floor(total/86400),hours=Math.floor(total%86400/3600),minutes=Math.floor(total%3600/60);return days?`${days}일 ${hours}시간 ${minutes}분`:hours?`${hours}시간 ${minutes}분`:minutes?`${minutes}분 ${total%60}초`:`${total}초`;}
    function paint(item,now){
      const state=item.value.search?.result;if(!state)return;
      const root=host.querySelector(`[data-catalog-entry="${item.fish.id}"]`);if(!root)return;
      const button=root.querySelector('[data-catalog-countdown]');if(!button)return;
      const chances=state.chances.filter(c=>c.end>now),current=chances[0],next=chances[1],card=root.querySelector('.catalog-card');
      const timing=window.FishingPlanner.timing(state.always?{always:true}:current||{},now,'collection');
      card.dataset.planNow=String(timing?.state==='now');card.dataset.planAvailability=state.always?'always':'timed';
      const badge=root.querySelector('[data-catalog-timing]'),badgeHtml=timing?`<b class="${timing.state==='now'?'plan-now-badge':'plan-soon-badge plan-soon-'+timing.state}" title="${esc(timing.title)}">${esc(timing.label)}</b>`:'';
      if(badge.innerHTML!==badgeHtml)badge.innerHTML=badgeHtml;
      const counting=countdowns.has(item.fish.id);button.disabled=!current||state.always;button.setAttribute('aria-pressed',String(!!current&&counting));
      button.setAttribute('aria-label',item.fish.name+(counting?' 출현 시각 보기':' 남은 시간 보기'));
      const end=current&&(Math.floor((current.start+F.KST)/F.DAY)===Math.floor((current.end+F.KST)/F.DAY)?clock.format(current.end):stamp(current.end,now));
      const html=state.always?'<strong>상시 낚시</strong><span>시간·날씨 제한 없음</span>':current?(counting?`<strong>${now<current.start?'시작':'종료'}까지 ${remaining((now<current.start?current.start:current.end)-now)}</strong><span>${stamp(current.start,now)} – ${end}</span>`:`<strong>${stamp(current.start,now)}</strong><span>– ${end} · ${Math.round((current.end-current.start)/F.MINUTE)}분</span>`):`<strong>${esc(state.reason||'다음 날짜 찾는 중')}</strong><span>조회 기한 없이 계산합니다.</span>`;
      if(button.innerHTML!==html)button.innerHTML=html;
      root.querySelector('[data-catalog-next]').textContent=state.always?'상시 가능':next?stamp(next.start,now):state.pending?'더 먼 출현 찾는 중':'—';
    }
    function refresh(){
      clearTimeout(timer);if(!visible())return;
      const now=Date.now(),pending=[];
      for(const item of live.values()){
        if(status(item))continue;
        const value=item.value,state=value.search?.result;
        if(state&&!state.pending&&(now-value.from>=F.MINUTE||state.chances[0]?.end<=now))value.search=null;
        if(!value.search||value.search.result.pending)pending.push(item);
        paint(item,now);
      }
      function advance(){
        if(!visible())return;const start=performance.now();
        while(pending.length&&performance.now()-start<12){const item=pending.shift(),value=item.value;if(!value.search){value.from=Date.now();value.search=parts.forecast.startTimeline({...item.fish,routes:[item.route]},value.from,{count:2});}else value.search.step();paint(item,Date.now());if(value.search.result.pending)pending.push(item);}
        if(pending.length)timer=setTimeout(advance,50);
      }
      if(pending.length)timer=setTimeout(advance,0);
      window.FishingPreparationView?.refresh();
    }
    function render(fishes,filters){
      clearTimeout(timer);items=fishes;options=filters;live=new Map(items.map(f=>[f.id,entry(f)]));
      const panels=new Map([...host.querySelectorAll('[data-catalog-panel]:not([hidden])')].map(p=>[p.dataset.catalogPanel,p]));
      const spear=filters.kind==='spear';
      host.innerHTML=`<div class="plan-table-head" aria-hidden="true"><span>물고기 · 도감 번호</span><span>${spear?'어영 · 속도':'입질 · 낚아채기'}</span><span>지역 · 낚시터</span><span>${spear?'어장 조건':'출현 시간 · KST'}</span><span>${spear?'필수 준비':'미끼 · 필수 준비'}</span><span>다음 출현</span><span>관리</span></div><div class="plan-list">${[...live.values()].map(row).join('')}</div>`;
      for(const panel of host.querySelectorAll('[data-catalog-panel]:not([hidden])')){const old=panels.get(panel.dataset.catalogPanel);if(old)panel.replaceWith(old);}
      window.FishingDetails.sync();refresh();
    }
    host.addEventListener('click',event=>{
      const detail=event.target.closest('[data-catalog-detail]');if(detail){const id=+detail.dataset.catalogDetail,item=live.get(id);if(!item)return;const section=$('catalog-detail-'+id),open=!opened.has(item.key);if(open){opened.add(item.key);section.innerHTML=section.innerHTML||panel(item);}else opened.delete(item.key);section.hidden=!open;host.querySelector(`.catalog-card [data-catalog-detail="${id}"]`).setAttribute('aria-expanded',String(open));window.FishingDetails.sync();return;}
      const countdown=event.target.closest('[data-catalog-countdown]');if(countdown){const id=+countdown.dataset.catalogCountdown;if(countdowns.has(id))countdowns.delete(id);else countdowns.add(id);paint(live.get(id),Date.now());}
    });
    host.addEventListener('change',event=>{const select=event.target.closest('[data-catalog-route]');if(!select)return;const id=+select.dataset.catalogRoute;selections.set(id,+select.value);render(items,options);host.querySelector(`[data-catalog-route="${id}"]`)?.focus({preventScroll:true});});
    setInterval(()=>{if(!visible())return;const now=Date.now();for(const item of live.values())paint(item,now);},1000);
    setInterval(refresh,60000);document.addEventListener('visibilitychange',refresh);
    const view={render,refresh,clear(){clearTimeout(timer);live.clear();host.innerHTML='';}};window.FishingCatalogListView=view;return view;
  }
  window.FishingCatalogList={mount};
})();
