(function(){
  'use strict';
  const $=id=>document.getElementById(id),F=window.FishingForecast,KEY='teo-ffxiv.fishing.plan.v1';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  const time=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false});
  // Teamcraft encodes Medium, Big, Light as 0, 1, 2. Hookset is independent.
  const tugs={0:'!!',1:'!!!',2:'!'},hooksets={0:'일반 낚아채기',1:'강력한 낚아채기',2:'섬세한 낚아채기'};
  function mount({data,model,getCaught}){
    if(!F||!window.FISHING_WEATHER)return;
    const forecast=F.create(data,window.FISHING_WEATHER),fishById=new Map(data.fishes.map(f=>[f.id,f]));
    let settings=F.defaults(),saved=false,stars=new Set(),mode='all',purpose='big',rarities={big:'big',collection:'all'},alwaysAlerts={big:false,collection:true},result=null,shown=30,active=false,timer;
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
      $('notifyAlways').checked=alwaysAlerts[purpose];
    }
    modeControls();
    $('playDays').innerHTML=[1,2,3,4,5,6,0].map(i=>`<div class="play-day"><label><input type="checkbox" data-day="${i}" ${settings.days[i].enabled?'checked':''}>${'일월화수목금토'[i]}요일</label><input type="time" id="playStart${i}" aria-label="${'일월화수목금토'[i]}요일 접속 시작" value="${settings.days[i].start}"><span>–</span><input type="time" id="playEnd${i}" aria-label="${'일월화수목금토'[i]}요일 접속 종료" value="${settings.days[i].end}"></div>`).join('');
    $('planLead').value=settings.lead;$('planMinimum').value=settings.minMinutes;$('notificationScope').value=mode;
    $('playSummary').textContent=saved?'내 접속 시간 · 변경하기':'내 접속 시간 설정 · 예시 20:00–23:00';
    $('playSettings').open=!saved;
    const regionNames=[...new Set(data.fishes.filter(f=>f.kind==='rod').flatMap(f=>f.routes.map(r=>data.spots[r.spotKey].region)))].sort((a,b)=>a.localeCompare(b,'ko'));
    $('planRegion').insertAdjacentHTML('beforeend',regionNames.map(n=>`<option>${esc(n)}</option>`).join(''));
    function eligible(){return model.filter(getCaught(),{kind:'rod',status:'missing',rarity:rarities[purpose]}).filter(f=>(purpose!=='big'||f.big)&&(mode!=='stars'||stars.has(f.id))&&f.routes.some(r=>!forecast.reason(r)&&(alwaysAlerts[purpose]||forecast.limited(r))));}
    const snapshot=()=>({saved,settings,ids:eligible().map(f=>f.id),includeAlways:alwaysAlerts[purpose]});
    function targetCount(){$('notificationTargets').textContent=`${purpose==='big'?'터주 전용':'수첩작 전용'} · 현재 알림 대상 ${eligible().length}종 · 수집하면 대상에서 제외됩니다.`;}
    function changed(){document.dispatchEvent(new CustomEvent('fishing-plan-changed'));}
    function calculate(){
      const fishes=model.filter(getCaught(),{kind:'rod',status:'missing',region:$('planRegion').value,rarity:rarities[purpose],query:$('planSearch').value}).map(f=>({...f,routes:model.routeList(f,{region:$('planRegion').value})}));
      const now=Date.now();result=forecast.plan(fishes,settings,now,30);result.now=now;shown=30;render();
    }
    function rows(){
      if(!result)return [];
      const availability=$('planAvailability').value;
      const list=availability==='always'?[]:result.rows.filter(r=>r.start<result.now+Number($('planHorizon').value)*F.DAY);
      if(availability!=='timed')for(const fish of result.always)list.push({fish,route:fish.routes.findIndex(r=>!forecast.reason(r)&&!forecast.limited(r)),always:true,start:result.now});
      if($('planSort').value==='rare')list.sort((a,b)=>Number(!!a.always)-Number(!!b.always)||(b.nextGap??Infinity)-(a.nextGap??Infinity)||a.start-b.start||a.fish.order-b.fish.order);
      else if($('planSort').value==='book')list.sort((a,b)=>a.fish.order-b.fish.order);
      else list.sort((a,b)=>(purpose==='big'?Number(!!a.always)-Number(!!b.always):0)||a.start-b.start||a.fish.order-b.fish.order);
      return list;
    }
    function chain(route){const paths=model.paths(route);return paths.length?paths.map(p=>(p.complete?'':'시작 미끼 미확인 → ')+p.ids.map(id=>model.byId.get(id)?.name||id).join(' → ')).join(' / '):'미끼 자료 확인 필요';}
    function card(row){
      const fish=row.fish,route=fish.routes[row.route],spot=data.spots[route.spotKey],next=row.nextStart?`${date.format(row.nextStart)}`:'30일 조회 범위 안에 없음';
      const special=(route.predators||[]).map(p=>`${model.byId.get(p.id)?.name||p.id} ×${p.amount}`).join(' · ');
      const tug=tugs[route.tug],hookset=hooksets[route.hookset];
      return `<article class="plan-card" aria-label="${esc(fish.name)} 낚시 계획" data-plan-kind="${fish.big?'big':'normal'}" data-plan-availability="${row.always?'always':'timed'}">
        <div class="plan-fish"><img src="${esc(fish.icon)}" width="30" height="30" alt="" loading="lazy"><div><button class="plan-name" data-fish-detail="${fish.id}">${esc(fish.name)}</button><div class="plan-labels"><span>${fish.big?(fish.legendary?'전설어':'터주'):'일반'}</span><span>${row.always?'상시':'조건부'}</span></div></div><button class="plan-star" data-plan-star="${fish.id}" aria-pressed="${stars.has(fish.id)}" aria-label="${esc(fish.name)} 관심 물고기">${stars.has(fish.id)?'★':'☆'}</button></div>
        <div class="plan-bite"><strong class="plan-tug ${tug?'tug-'+tug.length:'tug-unknown'}" aria-label="${tug?'입질 강도 '+tug:'입질 미확인'}">${tug||'입질 미확인'}</strong><span class="plan-hookset">${hookset||'낚아채기 미확인'}</span></div>
        <div class="plan-place"><span>${esc(spot.area)}</span><strong>${esc(spot.name)}</strong></div>
        <div class="plan-window">${row.always?'<strong>상시 낚시</strong><span>시간·날씨 제한 없음</span>':`<strong>${date.format(row.start)}</strong><span>– ${time.format(row.end)} · ${Math.floor((row.end-row.start)/F.MINUTE)}분${row.start<=result.now?' · 지금부터':''}</span>`}</div>
        <div class="plan-tackle"><p class="plan-bait">${esc(chain(route))}</p>${special?`<p class="plan-condition">직감: ${esc(special)}</p>`:''}</div>
        <p class="plan-next" title="이 도전 구간을 놓친 경우, 내 접속 시간 안의 다음 기회">${row.always?'상시 가능':next}</p>
        <div class="plan-card-actions"><button data-fish-detail="${fish.id}" aria-label="${esc(fish.name)} 낚시 조건">조건</button><button data-caught="${fish.id}" aria-label="${esc(fish.name)} 수집 체크">수집</button></div>
      </article>`;
    }
    function prep(list){
      const baitMap=new Map();
      function add(route,fish,condition=false){for(const p of model.paths(route).filter(p=>p.complete)){const base=p.ids[0];if(!baitMap.has(base))baitMap.set(base,new Map());baitMap.get(base).set(fish.id+(condition?':prep':''),fish.name+(condition?' (직감 준비)':''));}}
      for(const row of list){const route=row.fish.routes[row.route];add(route,row.fish);for(const p of route.predators||[]){const f=model.byId.get(p.id);if(f)for(const r of f.routes.filter(r=>r.spotKey===route.spotKey))add(r,f,true);}}
      $('planPrepSummary').textContent=`미끼 준비 목록 · ${baitMap.size}종 / 현재 결과 ${list.length}종 기준`;
      $('planPrep').innerHTML=[...baitMap].map(([id,targets])=>`<div><strong>${esc(model.byId.get(id)?.name||id)}</strong><p>${esc([...targets.values()].join(' · '))}</p></div>`).join('')||'<p>조회 결과가 없어요.</p>';
    }
    function render(){if(!result)return;const list=rows();$('planResults').innerHTML=list.slice(0,shown).map(card).join('')||'<p class="empty-state">설정한 접속 시간·조회 기간에 맞는 예보가 없어요. 기간이나 최소 도전 시간을 바꿔 보세요.</p>';
      $('planCount').textContent=`미수집 ${list.length}종 · 시간·날씨 조건 ${list.filter(r=>!r.always).length}종 / 상시 ${list.filter(r=>r.always).length}종 · 한국 시간(KST)`;
      $('planMore').hidden=list.length<=shown;$('planMore').textContent=`다음 ${Math.min(30,list.length-shown)}종 더 보기`;
      $('planCoverage').textContent=`별도 확인: 특수 지역·선행 조건·자료 미확인 ${result.excluded.length}종 · 30일 안에 접속 시간과 겹치지 않는 ${result.absent.length}종. 상시 어종은 접속 시간·조회 기간과 관계없이 목록에 표시합니다. ${time.format(result.now)} 계산.`;
      $('planUnscheduled').innerHTML=[...result.excluded,...result.absent].map(f=>`<button data-fish-detail="${f.id}" title="${esc(f.routes.map(r=>forecast.reason(r)).filter(Boolean).join(' · ')||'30일 내 접속 시간과 겹치지 않음')}">${esc(f.name)} <span>${esc(f.routes.map(r=>forecast.reason(r)).find(Boolean)||'접속 시간과 겹치지 않음')}</span></button>`).join('');prep(list);
      targetCount();
    }
    function show(plan){active=plan;$('fishingPlanner').hidden=!plan;$('collectionPanel').hidden=plan;$('showPlanner').setAttribute('aria-pressed',String(plan));$('showBook').setAttribute('aria-pressed',String(!plan));if(plan)calculate();}
    $('showPlanner').onclick=()=>show(true);$('showBook').onclick=()=>show(false);
    function choosePurpose(next){if(next===purpose)return;const previous=purpose;purpose=next;try{if(saved)store();modeControls();$('planAvailability').value='all';calculate();changed();}catch{purpose=previous;modeControls();$('planMessage').textContent='낚시 모드를 저장하지 못했습니다.';}}
    $('planBigMode').onclick=()=>choosePurpose('big');$('planCollectionMode').onclick=()=>choosePurpose('collection');
    function collectionView(view){show(false);$('rodMode').click();$('status').value='missing';$('region').value=$('planRegion').value;$('rarity').value=$('planRarity').value;$('search').value=$('planSearch').value;$('view').value=view;$('view').dispatchEvent(new Event('change'));}
    $('planToBait').onclick=()=>collectionView('bait');$('planToSpot').onclick=()=>collectionView('spot');
    $('copyPlayDays').onclick=()=>{for(let i=0;i<7;i++){$('playStart'+i).value=$('playStart1').value;$('playEnd'+i).value=$('playEnd1').value;}};
    $('savePlay').onclick=()=>{try{const next=F.validate({days:Array.from({length:7},(_,i)=>({enabled:document.querySelector(`[data-day="${i}"]`).checked,start:$('playStart'+i).value,end:$('playEnd'+i).value})),lead:+$('planLead').value,minMinutes:+$('planMinimum').value});
      localStorage.setItem(KEY,serialized(next));settings=next;saved=true;$('playSummary').textContent='내 접속 시간 · 변경하기';$('playSettings').open=false;$('planMessage').textContent='접속 시간을 저장했습니다. 알림은 이 시간 안에서만 보냅니다.';calculate();changed();}catch(e){$('planMessage').textContent=e.message;}};
    $('notificationScope').onchange=()=>{const prev=mode;mode=$('notificationScope').value;try{if(saved)store();targetCount();changed();}catch{mode=prev;$('notificationScope').value=prev;$('planMessage').textContent='알림 대상 설정을 저장하지 못했습니다.';}};
    $('notifyAlways').onchange=()=>{const previous=alwaysAlerts[purpose];alwaysAlerts[purpose]=$('notifyAlways').checked;try{if(saved)store();targetCount();changed();}catch{alwaysAlerts[purpose]=previous;$('notifyAlways').checked=previous;$('planMessage').textContent='상시 알림 설정을 저장하지 못했습니다.';}};
    document.addEventListener('click',e=>{const b=e.target.closest('[data-plan-star]');if(!b)return;const id=+b.dataset.planStar,had=stars.has(id);if(had)stars.delete(id);else stars.add(id);try{if(saved)store();render();changed();}catch{if(had)stars.add(id);else stars.delete(id);$('planMessage').textContent='관심 물고기를 저장하지 못했습니다.';}});
    $('planRegion').onchange=calculate;
    $('planRarity').onchange=()=>{const previous=rarities[purpose];rarities[purpose]=$('planRarity').value;try{if(saved)store();calculate();changed();}catch{rarities[purpose]=previous;$('planRarity').value=previous;$('planMessage').textContent='어종 필터를 저장하지 못했습니다.';}};
    $('planSearch').oninput=()=>{clearTimeout(timer);timer=setTimeout(calculate,150);};
    for(const id of ['planHorizon','planSort','planAvailability'])$(id).onchange=()=>{shown=30;render();};
    $('planRefresh').onclick=calculate;$('planMore').onclick=()=>{shown+=30;render();};
    document.addEventListener('fishing-collection-changed',()=>{if(active)calculate();changed();});
    window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){try{const raw=localStorage.getItem(KEY);if(!raw){saved=false;return;}preferences(JSON.parse(raw));modeControls();
      for(let i=0;i<7;i++){document.querySelector(`[data-day="${i}"]`).checked=settings.days[i].enabled;$('playStart'+i).value=settings.days[i].start;$('playEnd'+i).value=settings.days[i].end;}$('planLead').value=settings.lead;$('planMinimum').value=settings.minMinutes;$('notificationScope').value=mode;$('planMessage').textContent='다른 탭에서 바꾼 계획을 반영했습니다.';if(active)calculate();changed();}catch{$('planMessage').textContent='다른 탭의 계획을 읽지 못했습니다. 새로고침 후 확인해 주세요.';}}});
    setInterval(()=>{if(active&&!document.hidden){forecast.clearCache();calculate();}},60000);
    document.addEventListener('visibilitychange',()=>{if(active&&!document.hidden)calculate();});
    window.FishingNotifications?.mount({snapshot,data,model});
    const linked=Number(new URL(location.href).searchParams.get('fish'));if(fishById.has(linked)){show(true);const b=document.createElement('button');b.dataset.fishDetail=linked;b.hidden=true;document.body.append(b);b.click();b.remove();}
  }
  window.FishingPlanner={mount};
})();
