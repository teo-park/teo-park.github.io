(function(){
  'use strict';
  const $=id=>document.getElementById(id),F=window.FishingForecast,KEY='teo-ffxiv.fishing.plan.v1';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  const longDate=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
  const time=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false});
  // Teamcraft encodes Medium, Big, Light as 0, 1, 2. Hookset is independent.
  const tugs={0:'!!',1:'!!!',2:'!'},hooksets={0:'일반 낚아채기',1:'강력한 낚아채기',2:'섬세한 낚아채기'};
  function timing(row,now,purpose){
    if(row.always)return {state:'now',label:'지금',title:'현재 도전 가능 · 직감 등 선행 조건 별도 준비'};
    if(!Number.isFinite(row.start)||!Number.isFinite(row.end)||now>=row.end)return null;
    if(row.start<=now)return {state:'now',label:'지금',title:'현재 도전 가능 · 직감 등 선행 조건 별도 준비'};
    if(purpose!=='collection')return null;
    const opening=Number.isFinite(row.windowStart)?row.windowStart:row.start,left=opening-now;
    if(left<=0||left>30*F.MINUTE)return null;
    if(left<=5*F.MINUTE){
      const seconds=Math.ceil(left/1000),minutes=Math.floor(seconds/60),remainder=seconds%60;
      const label=minutes?minutes+'분 전':seconds+'초 전';
      const remaining=[minutes?minutes+'분':'',remainder?remainder+'초':''].filter(Boolean).join(' ');
      return {state:'5',label,title:`출현까지 ${remaining} 남음 · ${time.format(opening)} 출현 (KST) · 직감 등 선행 조건 별도 준비`};
    }
    const minutes=left<=15*F.MINUTE?15:30;
    return {state:String(minutes),label:minutes+'분 전',title:`출현까지 ${minutes}분 이내 · ${time.format(opening)} 출현 (KST) · 직감 등 선행 조건 별도 준비`};
  }
  function mount({data,model,getCaught}){
    if(!F||!window.FISHING_WEATHER)return;
    window.FishingSpotMaps?.mount({data});
    window.FishingBaitDetails?.mount({model});
    const forecast=F.create(data,window.FISHING_WEATHER),fishById=new Map(data.fishes.map(f=>[f.id,f]));
    const opened=new Set(),countdowns=new Set();let spotFilter='all';
    let settings=F.defaults(),saved=false,stars=new Set(),mode='all',purpose='big',rarities={big:'big',collection:'all'},alwaysAlerts={big:false,collection:true},result=null,search=null,searchTimer,shown=30,active=false,timer;
    function preferences(v){settings=F.validate(v.settings);stars=new Set((v.stars||[]).filter(id=>fishById.has(id)));mode=v.mode==='stars'?'stars':'all';purpose=v.purpose==='collection'?'collection':'big';
      rarities={big:v.rarities?.big==='legendary'?'legendary':'big',collection:['all','normal','big','legendary'].includes(v.rarities?.collection)?v.rarities.collection:'all'};
      alwaysAlerts={big:v.alwaysAlerts?.big===true,collection:v.alwaysAlerts?.collection!==false};saved=true;}
    try{const raw=localStorage.getItem(KEY);if(raw)preferences(JSON.parse(raw));}catch{$('planMessage').textContent='저장된 계획을 읽지 못했습니다. 시간을 확인하고 다시 저장해 주세요.';}
    const serialized=(next=settings)=>JSON.stringify({settings:next,stars:[...stars],mode,purpose,rarities,alwaysAlerts});
    const store=()=>{localStorage.setItem(KEY,serialized());saved=true;};
    function modeControls(){
      $('planBigMode').setAttribute('aria-pressed',String(purpose==='big'));$('planCollectionMode').setAttribute('aria-pressed',String(purpose==='collection'));
      $('planPurposeNote').textContent=purpose==='big'?'터주만 모아 보고 알림을 받습니다.':'일반 물고기와 터주를 함께 모아 보고 알림을 받습니다.';
      const choices=purpose==='big'?[['big','터주 전체'],['legendary','전설어만']]:[['all','일반 + 터주 전체'],['normal','일반 물고기만'],['big','터주만'],['legendary','전설어만']];
      $('planRarity').innerHTML=choices.map(([v,label])=>`<option value="${v}">${label}</option>`).join('');$('planRarity').value=rarities[purpose];
      $('notificationScope').options[0].textContent=purpose==='big'?'터주 전용 · 선택 어종 전체':'수첩작 전용 · 선택 어종 전체';
      $('notifyAlways').checked=alwaysAlerts[purpose];$('planUpcomingHint').hidden=purpose!=='collection';
    }
    modeControls();
    $('playDays').innerHTML=[1,2,3,4,5,6,0].map(i=>`<div class="play-day"><label><input type="checkbox" data-day="${i}" ${settings.days[i].enabled?'checked':''}>${'일월화수목금토'[i]}요일</label><input type="time" id="playStart${i}" aria-label="${'일월화수목금토'[i]}요일 접속 시작" value="${settings.days[i].start}"><span>–</span><input type="time" id="playEnd${i}" aria-label="${'일월화수목금토'[i]}요일 접속 종료" value="${settings.days[i].end}"></div>`).join('');
    $('planLead').value=settings.lead;$('planMinimum').value=settings.minMinutes;$('notificationScope').value=mode;
    $('playSummary').textContent=saved?'내 접속 시간 · 변경하기':'내 접속 시간 설정 · 예시 20:00–23:00';
    $('playSettings').open=!saved;
    const regionNames=[...new Set(data.fishes.filter(f=>f.kind==='rod'&&!model.isOceanFish(f)).flatMap(f=>f.routes.map(r=>data.spots[r.spotKey].region)))].sort((a,b)=>a.localeCompare(b,'ko'));
    $('planRegion').insertAdjacentHTML('beforeend',regionNames.map(n=>`<option>${esc(n)}</option>`).join(''));
    function eligible(){return model.filter(getCaught(),{kind:'rod',scope:'field',status:'missing',rarity:rarities[purpose]}).filter(f=>(purpose!=='big'||f.big)&&(mode!=='stars'||stars.has(f.id))&&f.routes.some(r=>!forecast.reason(r)&&(alwaysAlerts[purpose]||forecast.limited(r))));}
    const snapshot=()=>({saved,settings,ids:eligible().map(f=>f.id),includeAlways:alwaysAlerts[purpose]});
    function targetCount(){$('notificationTargets').textContent=`${purpose==='big'?'터주 전용':'수첩작 전용'} · 현재 알림 대상 ${eligible().length}종 · 수집하면 대상에서 제외됩니다.`;}
    function changed(){document.dispatchEvent(new CustomEvent('fishing-plan-changed'));}
    function continueSearch(){
      if(!active||document.hidden||!result.pending)return;
      const started=performance.now();let changed=false;
      do{changed=search.step()||changed;}while(result.pending&&performance.now()-started<16);
      if(changed||!result.pending)render();
      if(result.pending)searchTimer=setTimeout(continueSearch,100);
    }
    function calculate(){
      clearTimeout(searchTimer);
      const spot=spotFilter;
      const fishes=model.filter(getCaught(),{kind:'rod',scope:'field',status:'missing',region:$('planRegion').value,rarity:rarities[purpose],query:$('planSearch').value}).map(f=>({...f,routes:model.routeList(f,{region:$('planRegion').value}).filter(r=>spot==='all'||r.spotKey===spot)})).filter(f=>spot==='all'||f.routes.length);
      const now=Date.now();search=forecast.startSearch(fishes,settings,now,search);result=search.result;result.now=now;shown=30;render();
      if(result.pending&&active)searchTimer=setTimeout(continueSearch,100);
    }
    function rows(){
      if(!result)return [];
      const availability=$('planAvailability').value;
      const list=availability==='always'?[]:[...result.rows];
      if(availability!=='timed')for(const fish of result.always)list.push({fish,route:fish.routes.findIndex(r=>!forecast.reason(r)&&!forecast.limited(r)),always:true,start:result.now});
      if($('planSort').value==='rare')list.sort((a,b)=>Number(!!a.always)-Number(!!b.always)||(b.nextGap??-Infinity)-(a.nextGap??-Infinity)||(a.start??Infinity)-(b.start??Infinity)||a.fish.order-b.fish.order);
      else if($('planSort').value==='book')list.sort((a,b)=>a.fish.order-b.fish.order);
      else list.sort((a,b)=>(purpose==='big'?Number(!!a.always)-Number(!!b.always):0)||(a.start??Infinity)-(b.start??Infinity)||a.fish.order-b.fish.order);
      return list;
    }
    function biteTime(id,route){const range=route&&model.biteTime(id,route),stats=window.FishingBook.biteStats(range);return `<span class="plan-bite-time${range?'':' is-unknown'}" title="${esc(stats.title)}">${esc(stats.primary)}</span>`;}
    const dateText=ms=>(new Date(ms+F.KST).getUTCFullYear()===new Date(result.now+F.KST).getUTCFullYear()?date:longDate).format(ms);
    const snagging=route=>route.snagging?'<span class="plan-snagging">갈고리 낚시 필요</span>':'';
    function lureBadges(routes,subject=''){
      const requirements=[...new Map((Array.isArray(routes)?routes:[routes]).flatMap(window.FishingBook.lureRequirements).map(l=>[l.key+':'+l.uses,l])).values()];
      return requirements.map(l=>`<a class="plan-lure-badge" data-lure-kind="${l.key}" href="../fisher-skills/#lures" target="_blank" rel="noopener noreferrer" title="${esc((subject?subject+' · ':'')+l.hint)}" aria-label="${esc((subject?subject+' · ':'')+l.label)} · 사용법 (새 탭)"><img src="https://image.ff14.co.kr/guide/resources/images/jobicon/fisher/${l.icon}.png" alt="" width="16" height="16" loading="lazy"><span>${esc(l.name)}</span><b>메시지 필요</b></a>`).join('');
    }
    const baitLink=id=>`<button type="button" class="plan-bait-link" data-bait-detail="${id}" aria-haspopup="dialog" aria-controls="baitDialog" aria-label="${esc(model.byId.get(id)?.name||id)} 미끼 정보">${esc(model.byId.get(id)?.name||id)}</button>`;
    function chain(route,target){
      const paths=model.tacklePaths(route);if(!paths.length)return '미끼 자료 확인 필요';
      return paths.map(p=>`<div class="plan-bait-path">${p.complete?'':'<span class="plan-mooch-facts">시작 미끼 미확인 → </span>'}${p.steps.map(step=>{
        const fish=model.byId.get(step.id),name=esc(fish?.name||step.id);if(!fish?.fish){const first=p.steps[1],observed=first?first.routes[0]&&model.biteTime(first.id,first.routes[0]):model.biteTime(target.id,route);return `<span>${fish?baitLink(step.id):name}${observed?` <small class="plan-bait-samples" title="${esc(first?'첫 생미끼 물고기 '+model.byId.get(first.id).name:'대상 물고기')} 입질 시간 표본">입질 ${observed.samples.toLocaleString()}건</small>`:''}${window.FishingBaitRankingView?.badge(first?first.routes[0]?.baitChoice:route.baitChoice)||''}</span>`;}
        const variants=[...new Set((step.routes.length?step.routes:[{}]).map(r=>`${tugs[r.tug]||'입질 미확인'} · ${hooksets[r.hookset]||'낚아채기 미확인'}${r.snagging?' · 갈고리 낚시 필요':''}`))];
        return `<span class="plan-mooch"><button class="plan-mooch-name" data-fish-detail="${step.id}">${name}</button><span class="plan-mooch-facts">${variants.map(esc).join(' / ')} · ${biteTime(step.id,step.routes[0])}</span>${lureBadges(step.routes,fish.name)}</span>`;
      }).join('<span class="plan-bait-arrow"> → </span>')}</div>`).join('<span class="plan-path-or">또는</span>');
    }
    function alternateBait(fish,route){return model.baitOptions(fish.id,route).map(o=>{
      const a=o.alternative,v=o.versatile;return '<span class="plan-alternate-bait" title="같은 낚시터 관측 기록 기준 · 관측 건수는 입질 확률이 아닙니다">'+(o.mooch?'시작 ':'')+(a?'대체 '+baitLink(a.bait.id):'대체 기록 미확인')+'</span><span class="plan-versatile '+(v||o.versatilePrimary?'is-observed':'')+'">'+baitLink(29717)+(o.mooch?'로 시작':'')+' · '+(o.versatilePrimary?'기본 미끼':v?'기록 있음':'미확인')+'</span>';
    }).join('');}
    function remaining(ms){const seconds=Math.max(0,Math.ceil(ms/1000)),days=Math.floor(seconds/86400),hours=Math.floor(seconds%86400/3600),minutes=Math.floor(seconds%3600/60);return days?`${days}일 ${hours}시간 ${minutes}분`:hours?`${hours}시간 ${minutes}분`:minutes?`${minutes}분 ${seconds%60}초`:`${seconds}초`;}
    function countdownText(start,end,now){return now<start?`<strong>시작까지 ${remaining(start-now)}</strong><span>${dateText(start)} 시작</span>`:now<end?`<strong>종료까지 ${remaining(end-now)}</strong><span>지금 도전 가능 · ${time.format(end)} 종료</span>`:'<strong>이번 기회 종료</strong><span>다음 갱신에서 새 기회를 표시합니다.</span>';}
    function windowCell(row){
      const fish=row.fish;
      if(row.always)return '<div class="plan-window"><strong>상시 낚시</strong><span>시간·날씨 제한 없음</span></div>';
      if(row.start===null)return `<div class="plan-window"><strong>${row.unavailableReason?'접속 설정 확인':'다음 날짜 찾는 중'}</strong><span>${esc(row.unavailableReason||'기간 제한 없이 조회 중')}</span></div>`;
      const counting=countdowns.has(fish.id);
      return `<button class="plan-window plan-time-toggle" data-plan-countdown="${fish.id}" data-plan-start="${row.start}" data-plan-end="${row.end}" aria-pressed="${counting}" aria-label="${esc(fish.name)} ${counting?'도전 시각 보기':'남은 시간 보기'}" title="눌러서 ${counting?'도전 시각':'남은 시간'} 보기">${counting?countdownText(row.start,row.end,Date.now()):`<strong>${dateText(row.start)}</strong><span>– ${time.format(row.end)} · ${Math.floor((row.end-row.start)/F.MINUTE)}분${row.start<=result.now?' · 지금부터':''}</span>`}</button>`;
    }
    function timingBadge(state){return state?`<b class="${state.state==='now'?'plan-now-badge':'plan-soon-badge plan-soon-'+state.state}" title="${esc(state.title)}" aria-label="${esc(state.title)}">${state.label}</b>`:'';}
    function updateCountdowns(){
      if(!active||document.hidden)return;const now=Date.now();
      for(const button of document.querySelectorAll('[data-plan-countdown][aria-pressed="true"]'))button.innerHTML=countdownText(+button.dataset.planStart,+button.dataset.planEnd,now);
      for(const slot of document.querySelectorAll('[data-plan-timing]')){
        const number=v=>v===''?null:Number(v),row={always:slot.dataset.always==='true',start:number(slot.dataset.start),end:number(slot.dataset.end),windowStart:number(slot.dataset.opening)},state=timing(row,now,purpose),html=timingBadge(state);
        if(slot.innerHTML!==html)slot.innerHTML=html;
        slot.closest('.plan-card').dataset.planNow=String(state?.state==='now');
      }
    }
    function card(row){
      const fish=row.fish,route=fish.routes[row.route],spot=data.spots[route.spotKey],next=row.nextStart!==null&&row.nextStart!==undefined?dateText(row.nextStart):row.unavailableReason||'다음 기회 찾는 중';
      const special=(route.predators||[]).map(p=>`${model.byId.get(p.id)?.name||p.id} ×${p.amount}`).join(' · ');
      const preparationLures=(route.predators||[]).map(p=>{const f=model.byId.get(p.id),badges=lureBadges((f?.routes||[]).filter(r=>r.spotKey===route.spotKey),f?.name);return badges?`<span class="plan-prep-lure"><span>직감 준비 · ${esc(f.name)}</span>${badges}</span>`:'';}).join('');
      const tug=tugs[route.tug],hookset=hooksets[route.hookset];
      const spotUrl=`https://ffxivteamcraft.com/db/ko/${spot.kind==='spear'?'spearfishing-spot':'fishing-spot'}/${spot.id}`;
      const coords=Number.isFinite(spot.coords?.x)&&Number.isFinite(spot.coords?.y)?`<button type="button" class="plan-spot-coords" data-spot-map="${esc(route.spotKey)}" data-map-owner="${fish.id}" aria-label="${esc(spot.name)} 지도 미리보기 · X:${spot.coords.x.toFixed(1)} Y:${spot.coords.y.toFixed(1)}" aria-controls="fishingSpotMap" aria-expanded="false" aria-haspopup="dialog"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16"/></svg>X:${spot.coords.x.toFixed(1)} · Y:${spot.coords.y.toFixed(1)}</button>`:'';
      const timingState=timing(row,result.now,purpose),now=timingState?.state==='now';
      return `<div class="plan-entry"><article class="plan-card" aria-label="${esc(fish.name)} 낚시 계획" data-plan-kind="${fish.big?'big':'normal'}" data-plan-availability="${row.always?'always':'timed'}" data-plan-now="${now}">
        <div class="plan-fish"><img src="${esc(fish.icon)}" width="30" height="30" alt="" loading="lazy"><div><button class="plan-name" data-fish-detail="${fish.id}">${esc(fish.name)}</button><div class="plan-labels"><span>${fish.big?(fish.legendary?'전설어':'터주'):'일반'}</span><span class="plan-availability-label">${row.always?'상시':'조건부'}</span><span data-plan-timing data-always="${!!row.always}" data-start="${row.start??''}" data-end="${row.end??''}" data-opening="${row.windowStart??''}">${timingBadge(timingState)}</span></div></div><button class="plan-star" data-plan-star="${fish.id}" aria-pressed="${stars.has(fish.id)}" aria-label="${esc(fish.name)} 관심 물고기">${stars.has(fish.id)?'★':'☆'}</button></div>
        <div class="plan-bite"><div class="plan-bite-summary"><strong class="plan-tug ${tug?'tug-'+tug.length:'tug-unknown'}" aria-label="${tug?'입질 강도 '+tug:'입질 미확인'}">${tug||'입질 미확인'}</strong>${biteTime(fish.id,route)}</div><span class="plan-hookset">${hookset||'낚아채기 미확인'}</span>${snagging(route)}</div>
        <div class="plan-place"><span>${esc(spot.area)}</span><div class="plan-spot-line"><strong><a class="plan-spot-link" data-spot-map="${esc(route.spotKey)}" data-map-owner="${fish.id}" href="${esc(spotUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(spot.name)} · Teamcraft 낚시터 보기 (새 탭)">${esc(spot.name)}<span aria-hidden="true"> ↗</span></a></strong><button class="plan-spot-filter" data-plan-spot="${esc(route.spotKey)}" aria-label="${esc(spot.name)} 낚시터로 필터링" title="이 낚시터만 보기" aria-pressed="${spotFilter===route.spotKey}"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 5h16l-6 7v6l-4 2v-8z"/></svg></button></div>${coords}</div>
        ${windowCell(row)}
        <div class="plan-tackle"><div class="plan-bait">${chain(route,fish)}</div>${lureBadges(route,fish.name)}${alternateBait(fish,route)}${special?`<p class="plan-condition">직감: ${esc(special)}</p>`:''}${preparationLures}</div>
        <p class="plan-next" title="이 도전 구간을 놓친 경우, 내 접속 시간 안의 다음 기회">${row.always?'상시 가능':next}</p>
        <div class="plan-card-actions"><button data-plan-detail="${fish.id}" aria-label="${esc(fish.name)} 낚시 조건" aria-expanded="${opened.has(fish.id)}" aria-controls="plan-detail-${fish.id}">조건</button><button data-caught="${fish.id}" aria-label="${esc(fish.name)} 수집 체크">수집</button></div>
      </article><section id="plan-detail-${fish.id}" class="plan-inline-detail" data-plan-route="${fishById.get(fish.id).routes.indexOf(route)}" aria-labelledby="plan-detail-title-${fish.id}" ${opened.has(fish.id)?'':'hidden'}>${opened.has(fish.id)?window.FishingDetails?.renderPlan(fish.id,route,'plan-detail-title-'+fish.id)||'':''}</section></div>`;
    }
    function prep(list){
      const baitMap=new Map();
      function add(route,fish,condition=false){for(const p of model.paths(route).filter(p=>p.complete)){const base=p.ids[0];if(!baitMap.has(base))baitMap.set(base,new Map());baitMap.get(base).set(fish.id+(condition?':prep':''),fish.name+(condition?' (직감 준비)':''));}}
      for(const row of list){const route=row.fish.routes[row.route];add(route,row.fish);for(const p of route.predators||[]){const f=model.byId.get(p.id);if(f)for(const r of f.routes.filter(r=>r.spotKey===route.spotKey))add(r,f,true);}}
      $('planPrepSummary').textContent=`미끼 준비 목록 · ${baitMap.size}종 / 현재 결과 ${list.length}종 기준`;
      $('planPrep').innerHTML=[...baitMap].map(([id,targets])=>`<div><strong>${baitLink(id)}</strong><p>${esc([...targets.values()].join(' · '))}</p></div>`).join('')||'<p>조회 결과가 없어요.</p>';
    }
    function render(){if(!result)return;const selectedSpot=data.spots[spotFilter];$('planActiveFilters').hidden=!selectedSpot;$('planActiveFilters').innerHTML=selectedSpot?`<button class="plan-filter-tag" data-plan-clear-spot aria-label="${esc(selectedSpot.name)} 낚시터 필터 해제"><span>낚시터 · ${esc(selectedSpot.name)}</span><span aria-hidden="true">×</span></button>`:'';const list=rows(),panels=new Map([...$('planResults').querySelectorAll('.plan-inline-detail:not([hidden])')].map(p=>[p.id,p]));$('planResults').innerHTML=list.slice(0,shown).map(card).join('')||'<p class="empty-state">선택한 조건의 미수집 물고기가 없어요. 검색·어종·낚시터 필터를 확인해 주세요.</p>';
      for(const panel of $('planResults').querySelectorAll('.plan-inline-detail:not([hidden])'))if(panels.get(panel.id)?.dataset.planRoute===panel.dataset.planRoute)panel.replaceWith(panels.get(panel.id));
      $('planCount').textContent=`미수집 ${list.length}종 · 시간·날씨 조건 ${list.filter(r=>!r.always).length}종 / 상시 ${list.filter(r=>r.always).length}종 · 한국 시간(KST)`;
      $('planMore').hidden=list.length<=shown;$('planMore').textContent=`다음 ${Math.min(30,list.length-shown)}종 더 보기`;
      $('planCoverage').textContent=`기간 제한 없이 표시합니다.${result.pending?` 더 먼 다음 기회 조회 중 ${result.pending}종.`:''} 접속 설정 확인 ${result.rows.filter(r=>r.unavailableReason).length}종 · 별도 확인: 특수 지역·선행 조건·자료 미확인 ${result.excluded.length}종. 상시 어종은 접속 시간과 관계없이 표시합니다. ${time.format(result.now)} 계산.`;
      $('planUnscheduled').innerHTML=result.excluded.map(f=>`<button data-fish-detail="${f.id}" title="${esc(f.routes.map(r=>forecast.reason(r)).filter(Boolean).join(' · '))}">${esc(f.name)} <span>${esc(f.routes.map(r=>forecast.reason(r)).find(Boolean)||'조건 자료 확인 필요')}</span></button>`).join('');prep(list);
      targetCount();window.FishingDetails?.sync();
    }
    function show(plan){active=plan;$('fishingPlanner').hidden=!plan;$('collectionPanel').hidden=plan;$('showPlanner').setAttribute('aria-pressed',String(plan));$('showBook').setAttribute('aria-pressed',String(!plan));if(plan)calculate();}
    $('showPlanner').onclick=()=>show(true);$('showBook').onclick=()=>show(false);
    function choosePurpose(next){if(next===purpose)return;const previous=purpose;purpose=next;try{if(saved)store();modeControls();$('planAvailability').value='all';calculate();changed();}catch{purpose=previous;modeControls();$('planMessage').textContent='낚시 모드를 저장하지 못했습니다.';}}
    $('planBigMode').onclick=()=>choosePurpose('big');$('planCollectionMode').onclick=()=>choosePurpose('collection');
    function collectionView(view){show(false);$('rodMode').click();$('collectionScope').value='field';$('collectionScope').dispatchEvent(new Event('change'));$('status').value='missing';$('region').value=$('planRegion').value;$('rarity').value=$('planRarity').value;$('search').value=$('planSearch').value;$('view').value=view;$('view').dispatchEvent(new Event('change'));}
    $('planToBait').onclick=()=>collectionView('bait');$('planToSpot').onclick=()=>collectionView('spot');
    $('planToOcean').onclick=()=>{show(false);$('rodMode').click();$('resetFilters').click();$('collectionScope').value='ocean';$('collectionScope').dispatchEvent(new Event('change'));$('view').value='book';$('view').dispatchEvent(new Event('change'));};
    $('copyPlayDays').onclick=()=>{for(let i=0;i<7;i++){$('playStart'+i).value=$('playStart1').value;$('playEnd'+i).value=$('playEnd1').value;}};
    $('savePlay').onclick=()=>{try{const next=F.validate({days:Array.from({length:7},(_,i)=>({enabled:document.querySelector(`[data-day="${i}"]`).checked,start:$('playStart'+i).value,end:$('playEnd'+i).value})),lead:+$('planLead').value,minMinutes:+$('planMinimum').value});
      localStorage.setItem(KEY,serialized(next));settings=next;saved=true;$('playSummary').textContent='내 접속 시간 · 변경하기';$('playSettings').open=false;$('planMessage').textContent='접속 시간을 저장했습니다. 알림은 이 시간 안에서만 보냅니다.';calculate();changed();}catch(e){$('planMessage').textContent=e.message;}};
    $('notificationScope').onchange=()=>{const prev=mode;mode=$('notificationScope').value;try{if(saved)store();targetCount();changed();}catch{mode=prev;$('notificationScope').value=prev;$('planMessage').textContent='알림 대상 설정을 저장하지 못했습니다.';}};
    $('notifyAlways').onchange=()=>{const previous=alwaysAlerts[purpose];alwaysAlerts[purpose]=$('notifyAlways').checked;try{if(saved)store();targetCount();changed();}catch{alwaysAlerts[purpose]=previous;$('notifyAlways').checked=previous;$('planMessage').textContent='상시 알림 설정을 저장하지 못했습니다.';}};
    document.addEventListener('click',e=>{const detail=e.target.closest('[data-plan-detail]');if(detail){const id=+detail.dataset.planDetail;if(opened.has(id))opened.delete(id);else opened.add(id);render();if(opened.has(id)){$('planResults').closest('.plan-results-scroll').scrollLeft=0;$('plan-detail-'+id).querySelector('.plan-detail-tools')?.scrollIntoView({block:'nearest'});}document.querySelector(`.plan-card [data-plan-detail="${id}"]`)?.focus({preventScroll:true});return;}if(e.target.closest('[data-plan-clear-spot]')){spotFilter='all';calculate();return;}const place=e.target.closest('[data-plan-spot]');if(place){spotFilter=place.dataset.planSpot;$('planSearch').value='';clearTimeout(timer);calculate();return;}const b=e.target.closest('[data-plan-star]');if(!b)return;const id=+b.dataset.planStar,had=stars.has(id);if(had)stars.delete(id);else stars.add(id);try{if(saved)store();render();changed();}catch{if(had)stars.add(id);else stars.delete(id);$('planMessage').textContent='관심 물고기를 저장하지 못했습니다.';}});
    $('planRegion').onchange=()=>{if(spotFilter!=='all'&&$('planRegion').value!=='all'&&data.spots[spotFilter]?.region!==$('planRegion').value)spotFilter='all';calculate();};
    $('planRarity').onchange=()=>{const previous=rarities[purpose];rarities[purpose]=$('planRarity').value;try{if(saved)store();calculate();changed();}catch{rarities[purpose]=previous;$('planRarity').value=previous;$('planMessage').textContent='어종 필터를 저장하지 못했습니다.';}};
    $('planSearch').oninput=()=>{clearTimeout(timer);timer=setTimeout(calculate,150);};
    for(const id of ['planSort','planAvailability'])$(id).onchange=()=>{shown=30;render();};
    $('planRefresh').onclick=calculate;$('planMore').onclick=()=>{shown+=30;render();};
    document.addEventListener('click',e=>{const button=e.target.closest('[data-plan-countdown]');if(!button)return;const id=+button.dataset.planCountdown;if(countdowns.has(id))countdowns.delete(id);else countdowns.add(id);render();document.querySelector(`[data-plan-countdown="${id}"]`)?.focus({preventScroll:true});});
    setInterval(updateCountdowns,1000);
    document.addEventListener('fishing-collection-changed',()=>{if(active)calculate();changed();});
    window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){try{const raw=localStorage.getItem(KEY);if(!raw){saved=false;return;}preferences(JSON.parse(raw));modeControls();
      for(let i=0;i<7;i++){document.querySelector(`[data-day="${i}"]`).checked=settings.days[i].enabled;$('playStart'+i).value=settings.days[i].start;$('playEnd'+i).value=settings.days[i].end;}$('planLead').value=settings.lead;$('planMinimum').value=settings.minMinutes;$('notificationScope').value=mode;$('planMessage').textContent='다른 탭에서 바꾼 계획을 반영했습니다.';if(active)calculate();changed();}catch{$('planMessage').textContent='다른 탭의 계획을 읽지 못했습니다. 새로고침 후 확인해 주세요.';}}});
    setInterval(()=>{if(active&&!document.hidden){forecast.clearCache();calculate();}},60000);
    document.addEventListener('visibilitychange',()=>{if(active&&!document.hidden)calculate();});
    window.FishingNotifications?.mount({snapshot,data,model});
    const linked=Number(new URL(location.href).searchParams.get('fish'));if(fishById.has(linked)){show(true);const b=document.createElement('button');b.dataset.fishDetail=linked;b.hidden=true;document.body.append(b);b.click();b.remove();}
  }
  window.FishingPlanner={mount,timing};
})();
