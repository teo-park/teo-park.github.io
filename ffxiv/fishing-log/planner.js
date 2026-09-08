(function(){
  'use strict';
  const $=id=>document.getElementById(id),F=window.FishingForecast,KEY='teo-ffxiv.fishing.plan.v1';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  const time=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false});
  function mount({data,model,getCaught}){
    if(!F||!window.FISHING_WEATHER)return;
    const forecast=F.create(data,window.FISHING_WEATHER),fishById=new Map(data.fishes.map(f=>[f.id,f]));
    let settings=F.defaults(),saved=false,stars=new Set(),mode='all',result=null,shown=30,active=false,timer;
    try{const raw=localStorage.getItem(KEY);if(raw){const v=JSON.parse(raw);settings=F.validate(v.settings);stars=new Set((v.stars||[]).filter(id=>fishById.has(id)));mode=v.mode==='stars'?'stars':'all';saved=true;}}catch{$('planMessage').textContent='저장된 계획을 읽지 못했습니다. 시간을 확인하고 다시 저장해 주세요.';}
    const store=()=>{localStorage.setItem(KEY,JSON.stringify({settings,stars:[...stars],mode}));saved=true;};
    $('playDays').innerHTML=[1,2,3,4,5,6,0].map(i=>`<div class="play-day"><label><input type="checkbox" data-day="${i}" ${settings.days[i].enabled?'checked':''}>${'일월화수목금토'[i]}요일</label><input type="time" id="playStart${i}" aria-label="${'일월화수목금토'[i]}요일 접속 시작" value="${settings.days[i].start}"><span>–</span><input type="time" id="playEnd${i}" aria-label="${'일월화수목금토'[i]}요일 접속 종료" value="${settings.days[i].end}"></div>`).join('');
    $('planLead').value=settings.lead;$('planMinimum').value=settings.minMinutes;$('notificationScope').value=mode;
    $('playSummary').textContent=saved?'내 접속 시간 · 변경하기':'내 접속 시간 설정 · 예시 20:00–23:00';
    $('playSettings').open=!saved;
    const regionNames=[...new Set(data.fishes.filter(f=>f.kind==='rod').flatMap(f=>f.routes.map(r=>data.spots[r.spotKey].region)))].sort((a,b)=>a.localeCompare(b,'ko'));
    $('planRegion').insertAdjacentHTML('beforeend',regionNames.map(n=>`<option>${esc(n)}</option>`).join(''));
    function eligible(){const caught=getCaught();return data.fishes.filter(f=>f.kind==='rod'&&!caught.has(f.id)&&(mode==='stars'?stars.has(f.id):f.big)&&f.routes.some(r=>!forecast.reason(r)&&forecast.limited(r)));}
    const snapshot=()=>({saved,settings,ids:eligible().map(f=>f.id)});
    function changed(){document.dispatchEvent(new CustomEvent('fishing-plan-changed'));}
    function calculate(){
      const fishes=model.filter(getCaught(),{kind:'rod',status:'missing',region:$('planRegion').value,rarity:$('planRarity').value,query:$('planSearch').value});
      const now=Date.now();result=forecast.plan(fishes,settings,now,30);result.now=now;shown=30;render();
    }
    function rows(){
      if(!result)return [];
      const list=result.rows.filter(r=>r.start<result.now+Number($('planHorizon').value)*F.DAY);
      if($('planSort').value==='rare')list.sort((a,b)=>(b.nextGap??Infinity)-(a.nextGap??Infinity)||a.start-b.start);
      return list;
    }
    function chain(route){const paths=model.paths(route);return paths.length?paths.map(p=>(p.complete?'':'시작 미끼 미확인 → ')+p.ids.map(id=>model.byId.get(id)?.name||id).join(' → ')).join(' / '):'미끼 자료 확인 필요';}
    function card(row){
      const fish=row.fish,route=fish.routes[row.route],spot=data.spots[route.spotKey],next=row.nextStart?`${date.format(row.nextStart)}`:'30일 조회 범위 안에 없음';
      const special=(route.predators||[]).map(p=>`${model.byId.get(p.id)?.name||p.id} ×${p.amount}`).join(' · ');
      return `<article class="plan-card"><div class="plan-fish"><img src="${esc(fish.icon)}" width="40" height="40" alt="" loading="lazy"><div><button class="plan-name" data-fish-detail="${fish.id}">${esc(fish.name)}</button><p>${esc(spot.area)} · ${esc(spot.name)}</p></div><button class="plan-star" data-plan-star="${fish.id}" aria-pressed="${stars.has(fish.id)}" aria-label="${esc(fish.name)} 관심 물고기">${stars.has(fish.id)?'★':'☆'}</button></div><div class="plan-window"><strong>${date.format(row.start)} – ${time.format(row.end)}</strong><span>${Math.floor((row.end-row.start)/F.MINUTE)}분 도전${row.start<=result.now?' · 현재 시간부터':''}</span></div><p class="plan-bait">${esc(chain(route))}</p>${special?`<p class="plan-condition">직감 준비: ${esc(special)} · <button data-fish-detail="${fish.id}">조건 확인</button></p>`:''}<p class="plan-next">이 기회를 놓치면 · 내 다음 접속 기회 ${next}</p><div class="plan-card-actions"><button data-fish-detail="${fish.id}">낚시 조건</button><button data-caught="${fish.id}">수집 체크</button></div></article>`;
    }
    function prep(list){
      const baitMap=new Map();
      function add(route,fish,condition=false){for(const p of model.paths(route).filter(p=>p.complete)){const base=p.ids[0];if(!baitMap.has(base))baitMap.set(base,new Map());baitMap.get(base).set(fish.id+(condition?':prep':''),fish.name+(condition?' (직감 준비)':''));}}
      for(const row of list){const route=row.fish.routes[row.route];add(route,row.fish);for(const p of route.predators||[]){const f=model.byId.get(p.id);if(f)for(const r of f.routes.filter(r=>r.spotKey===route.spotKey))add(r,f,true);}}
      $('planPrepSummary').textContent=`미끼 준비 목록 · ${baitMap.size}종 / 현재 결과 ${list.length}종 기준`;
      $('planPrep').innerHTML=[...baitMap].map(([id,targets])=>`<div><strong>${esc(model.byId.get(id)?.name||id)}</strong><p>${esc([...targets.values()].join(' · '))}</p></div>`).join('')||'<p>조회 결과가 없어요.</p>';
    }
    function render(){if(!result)return;const list=rows();$('planResults').innerHTML=list.slice(0,shown).map(card).join('')||'<p class="empty-state">설정한 접속 시간·조회 기간에 맞는 예보가 없어요. 기간이나 최소 도전 시간을 바꿔 보세요.</p>';
      $('planCount').textContent=`미수집 ${list.length}종 · 한국 시간(KST) · ${time.format(result.now)} 계산`;
      $('planMore').hidden=list.length<=shown;$('planMore').textContent=`다음 ${Math.min(30,list.length-shown)}종 더 보기`;
      $('planCoverage').textContent=`별도 확인: 특수 지역·선행 조건·자료 미확인 ${result.excluded.length}종 · 30일 안에 접속 시간과 겹치지 않는 ${result.absent.length}종. 시간·날씨 제한이 없는 ${result.always.length}종은 장소별·미끼별 목록에서 준비하세요.`;
      $('planUnscheduled').innerHTML=[...result.excluded,...result.absent].map(f=>`<button data-fish-detail="${f.id}" title="${esc(f.routes.map(r=>forecast.reason(r)).filter(Boolean).join(' · ')||'30일 내 접속 시간과 겹치지 않음')}">${esc(f.name)} <span>${esc(f.routes.map(r=>forecast.reason(r)).find(Boolean)||'접속 시간과 겹치지 않음')}</span></button>`).join('');prep(list);
      $('notificationTargets').textContent=`현재 알림 대상 ${eligible().length}종 · 수집하면 대상에서 제외됩니다.`;
    }
    function show(plan){active=plan;$('fishingPlanner').hidden=!plan;$('collectionPanel').hidden=plan;$('showPlanner').setAttribute('aria-pressed',String(plan));$('showBook').setAttribute('aria-pressed',String(!plan));if(plan)calculate();}
    $('showPlanner').onclick=()=>show(true);$('showBook').onclick=()=>show(false);
    function collectionView(view){show(false);$('rodMode').click();$('status').value='missing';$('region').value=$('planRegion').value;$('rarity').value=$('planRarity').value;$('search').value=$('planSearch').value;$('view').value=view;$('view').dispatchEvent(new Event('change'));}
    $('planToBait').onclick=()=>collectionView('bait');$('planToSpot').onclick=()=>collectionView('spot');
    $('copyPlayDays').onclick=()=>{for(let i=0;i<7;i++){$('playStart'+i).value=$('playStart1').value;$('playEnd'+i).value=$('playEnd1').value;}};
    $('savePlay').onclick=()=>{try{const next=F.validate({days:Array.from({length:7},(_,i)=>({enabled:document.querySelector(`[data-day="${i}"]`).checked,start:$('playStart'+i).value,end:$('playEnd'+i).value})),lead:+$('planLead').value,minMinutes:+$('planMinimum').value});
      localStorage.setItem(KEY,JSON.stringify({settings:next,stars:[...stars],mode}));settings=next;saved=true;$('playSummary').textContent='내 접속 시간 · 변경하기';$('playSettings').open=false;$('planMessage').textContent='접속 시간을 저장했습니다. 알림은 이 시간 안에서만 보냅니다.';calculate();changed();}catch(e){$('planMessage').textContent=e.message;}};
    $('notificationScope').onchange=()=>{const prev=mode;mode=$('notificationScope').value;try{if(saved)store();$('notificationTargets').textContent=`현재 알림 대상 ${eligible().length}종 · 수집하면 대상에서 제외됩니다.`;changed();}catch{mode=prev;$('notificationScope').value=prev;$('planMessage').textContent='알림 대상 설정을 저장하지 못했습니다.';}};
    document.addEventListener('click',e=>{const b=e.target.closest('[data-plan-star]');if(!b)return;const id=+b.dataset.planStar,had=stars.has(id);if(had)stars.delete(id);else stars.add(id);try{if(saved)store();render();changed();}catch{if(had)stars.add(id);else stars.delete(id);$('planMessage').textContent='관심 물고기를 저장하지 못했습니다.';}});
    for(const id of ['planRegion','planRarity'])$(id).onchange=calculate;
    $('planSearch').oninput=()=>{clearTimeout(timer);timer=setTimeout(calculate,150);};
    for(const id of ['planHorizon','planSort'])$(id).onchange=()=>{shown=30;render();};
    $('planRefresh').onclick=calculate;$('planMore').onclick=()=>{shown+=30;render();};
    document.addEventListener('fishing-collection-changed',()=>{if(active)calculate();changed();});
    window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){try{const raw=localStorage.getItem(KEY);if(!raw){saved=false;return;}const v=JSON.parse(raw);settings=F.validate(v.settings);stars=new Set((v.stars||[]).filter(id=>fishById.has(id)));mode=v.mode==='stars'?'stars':'all';saved=true;
      for(let i=0;i<7;i++){document.querySelector(`[data-day="${i}"]`).checked=settings.days[i].enabled;$('playStart'+i).value=settings.days[i].start;$('playEnd'+i).value=settings.days[i].end;}$('planLead').value=settings.lead;$('planMinimum').value=settings.minMinutes;$('notificationScope').value=mode;$('planMessage').textContent='다른 탭에서 바꾼 계획을 반영했습니다.';if(active)calculate();changed();}catch{$('planMessage').textContent='다른 탭의 계획을 읽지 못했습니다. 새로고침 후 확인해 주세요.';}}});
    setInterval(()=>{if(active&&!document.hidden){forecast.clearCache();calculate();}},60000);
    document.addEventListener('visibilitychange',()=>{if(active&&!document.hidden)calculate();});
    window.FishingNotifications?.mount({snapshot,data,model});
    const linked=Number(new URL(location.href).searchParams.get('fish'));if(fishById.has(linked)){show(true);const b=document.createElement('button');b.dataset.fishDetail=linked;b.hidden=true;document.body.append(b);b.click();b.remove();}
  }
  window.FishingPlanner={mount};
})();
