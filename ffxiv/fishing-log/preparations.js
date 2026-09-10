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
      if(!entries.has(signature)){const value={key:'prep-'+(++sequence),fish,from:0,search:null};entries.set(signature,value);byKey.set(value.key,value);}
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
      return `<li data-preparation-fish="${fish.id}" data-preparation-relation="${node.relation}"><div class="preparation-row"><div class="preparation-fish">${fish.icon?`<img src="${esc(fish.icon)}" alt="" width="24" height="24" loading="lazy">`:''}<div><span class="preparation-role">${relation}</span><button type="button" data-fish-detail="${fish.id}">${esc(fish.name)}</button><span class="preparation-caught" data-preparation-caught="${fish.id}" ${getCaught().has(fish.id)?'':'hidden'}>수집 완료</span></div></div><div class="preparation-tackle"><span>${esc(bait.join(' / ')||'미끼 확인 필요')}</span><span>${esc(bites.join(' / '))}</span><span>${esc(places.join(' · '))}</span></div><div class="preparation-time"><span class="preparation-condition">${esc(condition(fish.routes))}</span>${node.timed?`<div data-preparation-times="${entry(fish).key}" aria-label="${esc(fish.name)} 출현 시간">출현 시간 계산 중</div><button type="button" class="preparation-more" data-fish-detail="${fish.id}" aria-label="${esc(fish.name)} 출현 시간 5회 보기">출현 5회 ↗</button>`:'<span>준비 시간은 하위 어종 참고</span>'}</div></div>${node.children.length?tree(node.children):''}</li>`;
    }).join('')}</ul>`;}
    function markup(fish,routes=fish.routes){const nodes=forecast.preparations(fish,routes);return nodes.length?`<section class="fish-preparations" aria-label="${esc(fish.name)} 준비 어종"><div class="preparation-heading"><strong>준비 어종 · 출현 시간</strong><span>접속 시간과 관계없는 출현 · KST</span></div>${tree(nodes)}<p class="preparation-note">준비 어종은 수집했어도 표시합니다. 각 어종의 독립적인 출현 시간이며, 본 낚시의 가능 시간이나 준비 완료 여부를 뜻하지 않습니다.</p></section>`:'';}
    function paint(value,slots,now){
      const state=value.search.result,stamp=ms=>(new Date(ms+F.KST).getUTCFullYear()===new Date(now+F.KST).getUTCFullYear()?date:longDate).format(ms);
      const range=c=>`${stamp(c.start)} – ${Math.floor((c.start+F.KST)/F.DAY)===Math.floor((c.end+F.KST)/F.DAY)?clock.format(c.end):stamp(c.end)}`;
      const current=state.chances[0],next=state.chances[1];
      const html=state.reason?esc(state.reason):state.always?'상시 낚시':`${current?`<strong>${current.start<=now&&now<current.end?'<b class="preparation-now">지금</b> ':''}${range(current)}</strong>`:'<span>다음 출현 찾는 중</span>'}${next?`<span>다음 ${range(next)}</span>`:state.pending?'<span>더 먼 출현 찾는 중</span>':''}`;
      for(const slot of slots)if(slot.innerHTML!==html)slot.innerHTML=html;
    }
    function refresh(){
      clearTimeout(timer);if(document.hidden)return;
      const now=Date.now(),groups=new Map(),caught=getCaught();
      for(const label of document.querySelectorAll('[data-preparation-caught]'))label.hidden=!caught.has(+label.dataset.preparationCaught);
      for(const slot of document.querySelectorAll('[data-preparation-times]'))if(visible(slot)){const key=slot.dataset.preparationTimes;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(slot);}
      const pending=[];
      for(const [key,slots] of groups){const value=byKey.get(key);if(!value)continue;
        // Do not restart a distant search while its first window is still in the future.
        if(!value.search||value.search.result.chances[0]?.end<=now||!value.search.result.pending&&now-value.from>=F.MINUTE){value.search=forecast.startTimeline(value.fish,now,{count:2});value.from=now;}
        paint(value,slots,now);if(value.search.result.pending)pending.push({value,slots});
      }
      function advance(){
        if(document.hidden)return;const start=performance.now();
        while(pending.length&&performance.now()-start<12){const item=pending.shift();item.slots=item.slots.filter(visible);if(!item.slots.length)continue;item.value.search.step();paint(item.value,item.slots,Date.now());if(item.value.search.result.pending)pending.push(item);}
        if(pending.length)timer=setTimeout(advance,50);
      }
      if(pending.length)timer=setTimeout(advance,0);
    }
    const view={markup,refresh};window.FishingPreparationView=view;
    setInterval(refresh,60000);
    document.addEventListener('visibilitychange',refresh);
    document.addEventListener('fishing-collection-changed',refresh);
    document.getElementById('detailDialog').addEventListener('close',refresh);
    return view;
  }
  window.FishingPreparations={mount};
})();
