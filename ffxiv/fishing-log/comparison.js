(function(){
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tugs={0:'!!',1:'!!!',2:'!'},hooks={0:'일반 낚아채기',1:'강력한 낚아채기',2:'섬세한 낚아채기'};
  const rangeText=r=>r?`약 ${r.min}–${r.max}초`:'시간 미확인';
  function mount({model,reference}){
    function render(route,fish,index,excludedId=0,compact=false){
      if(!route.bait||route.tug===undefined)return '';
      const competitors=model.competitors(fish.id,route),target=model.biteTime(fish.id,route),mooch=!!model.byId.get(route.bait)?.fish;
      const selectable=competitors.filter(c=>c.baitKnown&&c.tugKnown);
      if(mooch||!selectable.some(c=>c.fish.id===excludedId))excludedId=0;
      const remaining=competitors.filter(c=>c.fish.id!==excludedId),uncertain=remaining.filter(c=>!c.baitKnown||!c.tugKnown||!c.time);
      const windows=window.FishingBook.clearBiteWindows(target,remaining),knownCount=remaining.filter(c=>c.baitKnown&&c.tugKnown).length;
      const summary=windows===null?'자료가 부족해 단독 입질 구간을 판단할 수 없어요.':windows.length?`관측상 단독 구간: ${windows.map(([a,b])=>`약 ${a}–${b}초`).join(' · ')}`:'관측 범위 안에서는 입질 시간만으로 구분하기 어려워요.';
      const row=(entry,isTarget=false)=>{
        const f=entry.fish,excluded=f.id===excludedId,time=entry.time,routes=entry.routes;
        const tug=[...new Set(routes.map(r=>tugs[r.tug]).filter(Boolean))].join(' / ')||'입질 미확인';
        const hook=[...new Set(routes.map(r=>hooks[r.hookset]).filter(Boolean))].join(' / ')||'낚아채기 미확인';
        const overlap=target&&time&&Math.max(target.min,time.min)<Math.min(target.max,time.max);
        const state=isTarget?'대상':excluded?'제외 가정':!entry.baitKnown?'미끼 확인 필요':!entry.tugKnown?'입질 확인 필요':!time||!target?'시간 미확인':overlap?'시간 겹침':'관측 시간 분리';
        const conditions=[f.timed||routes.some(r=>Number.isFinite(r.duration)&&r.duration<24)?'시간 조건':'',f.weathered||routes.some(r=>r.weathers?.length||r.weathersFrom?.length)?'날씨 조건':'',routes.some(r=>r.predators?.length)?'직감 필요':'',routes.some(r=>r.snagging)?'갈고리 낚시 필요':''].filter(Boolean).join(' · ');
        return `<tr class="${isTarget?'compare-target':''} ${excluded?'compare-excluded':''}"><td>${isTarget?`<strong>${esc(f.name)}</strong>`:reference(f.id)}${conditions?`<small>${esc(conditions)}</small>`:''}</td><td><strong>${esc(tug)}</strong><small>${esc(hook)}</small></td><td${time?` title="관측 ${time.samples.toLocaleString()}건"`:''}>${rangeText(time)}</td><td><span class="compare-state ${isTarget?'is-target':excluded?'':overlap&&entry.baitKnown?'is-overlap':''}">${state}</span></td></tr>`;
      };
      const confirmed=competitors.filter(c=>c.baitKnown&&c.tugKnown),unconfirmed=competitors.filter(c=>!c.baitKnown||!c.tugKnown);
      if(compact){
        const smallRow=entry=>{
          const excluded=entry.fish.id===excludedId,overlap=target&&entry.time&&Math.max(target.min,entry.time.min)<Math.min(target.max,entry.time.max);
          const state=excluded?'제외 가정':!entry.baitKnown?'미끼 미확인':!entry.tugKnown?'입질 미확인':!entry.time||!target?'시간 미확인':overlap?'겹침':'분리';
          const tackle=[...new Set(entry.routes.map(r=>(tugs[r.tug]||'?')+' '+(hooks[r.hookset]||'낚아채기 미확인')))].join(' / ');
          const conditions=[entry.fish.timed?'시간 조건':'',entry.fish.weathered?'날씨 조건':'',entry.routes.some(r=>r.predators?.length)?'직감 필요':'',entry.routes.some(r=>r.snagging)?'갈고리 필요':''].filter(Boolean).join(' · ');
          return `<tr class="${excluded?'compare-excluded':''}"><td>${reference(entry.fish.id)}<small>${esc(tackle)}${conditions?' · '+esc(conditions):''}</small></td><td>${rangeText(entry.time)}</td><td><span class="compare-state ${overlap?'is-overlap':''}">${state}</span></td></tr>`;
        };
        const entries=[...confirmed,...unconfirmed],table=items=>`<table><tbody>${items.map(smallRow).join('')}</tbody></table>`;
        return `<section class="bite-comparison compare-compact" data-compare-compact="true" data-compare-fish="${fish.id}" data-compare-route="${index}" aria-label="${esc(fish.name)} 같은 입질 비교">
          <div class="compare-compact-heading"><h4>같은 입질 비교 <span>${entries.length}종</span></h4><span>${esc(model.byId.get(route.bait)?.name||route.bait)} · ${tugs[route.tug]} · 대상 ${rangeText(target)}</span></div>
          ${mooch?'<p class="compare-rule">생미끼 경로 · 교환 방생 적용 불가</p>':`<label class="compare-exclude">교환 방생 가정<select data-compare-exclude aria-label="${esc(fish.name)} 비교에서 제외할 물고기"><option value="0">제외하지 않음</option>${selectable.map(c=>`<option value="${c.fish.id}" ${c.fish.id===excludedId?'selected':''}>${esc(c.fish.name)}</option>`).join('')}</select></label>`}
          ${entries.length?table(entries.slice(0,4)):'<p class="compare-rule">같은 입질의 다른 어종 기록 없음</p>'}
          ${entries.length>4?`<details class="compare-more"><summary>나머지 ${entries.length-4}종 보기</summary>${table(entries.slice(4))}</details>`:''}
          <p class="compare-summary">${excludedId?'제외 가정 후 · ':''}${summary}${uncertain.length?` <span>미확인 ${uncertain.length}종 포함</span>`:''}</p>
        </section>`;
      }
      return `<section class="bite-comparison" data-compare-fish="${fish.id}" data-compare-route="${index}" aria-label="${esc(fish.name)} 같은 입질 비교">
        <h4>같은 입질 비교</h4><p class="compare-context">${esc(model.byId.get(route.bait)?.name||route.bait)}${mooch?' 생미끼':''} · ${tugs[route.tug]} · 같은 낚시터 기준</p>
        <div class="compare-scroll" role="region" aria-label="입질 시간 비교 목록 · 좌우 스크롤 가능" tabindex="0"><table><thead><tr><th scope="col">물고기</th><th scope="col">입질 · 낚아채기</th><th scope="col">관측 시간</th><th scope="col">대상과 비교</th></tr></thead><tbody>${row({fish,routes:[route],time:target},true)}${confirmed.map(c=>row(c)).join('')}${unconfirmed.length?'<tr class="compare-unconfirmed"><th colspan="4" scope="rowgroup">낚시터 내 추가 어종 · 이 미끼 또는 입질 확인 필요</th></tr>'+unconfirmed.map(c=>row(c)).join(''):''}</tbody></table></div>
        ${mooch?'<p class="compare-rule">생미끼 낚시로 잡은 물고기는 교환 방생을 적용할 수 없어요.</p>':`<label class="compare-exclude">교환 방생 가정 · 한 종<select data-compare-exclude aria-label="${esc(fish.name)} 비교에서 제외할 물고기"><option value="0">제외하지 않음</option>${selectable.map(c=>`<option value="${c.fish.id}" ${c.fish.id===excludedId?'selected':''}>${esc(c.fish.name)}</option>`).join('')}</select></label>`}
        <p class="compare-summary">${excludedId?'제외 가정 후 ':''}같은 미끼·입질 경쟁 ${knownCount}종${uncertain.length?` · 자료 확인 필요 ${uncertain.length}종`:''}<br><strong>${summary}</strong></p>
        <p class="compare-note">수집 여부와 관계없이 비교합니다. 미끼·입질이 미확인인 어종도 함께 표시하며, 시간·날씨·직감에 따라 실제 후보가 달라집니다. 입질 시간은 모으기·루어 사용 여부를 구분하지 않은 관측 범위로, 확정 포획을 보장하지 않습니다.</p>
        <p class="compare-note">교환 방생은 생미끼 낚시로 잡은 물고기 등 일부 어종에 적용되지 않습니다. 위 선택은 비교용 가정입니다. <a href="https://guide.ff14.co.kr/job/Fisher/31?type=L" target="_blank" rel="noopener noreferrer">공식 기술 안내 ↗</a></p>
      </section>`;
    }
    document.addEventListener('change',e=>{
      const select=e.target.closest('[data-compare-exclude]');if(!select)return;
      const section=select.closest('.bite-comparison'),fish=model.byId.get(+section.dataset.compareFish),index=+section.dataset.compareRoute;
      if(!fish?.routes[index])return;
      const moreOpen=section.querySelector('.compare-more')?.open,holder=document.createElement('div');holder.innerHTML=render(fish.routes[index],fish,index,+select.value,section.dataset.compareCompact==='true');
      const next=holder.firstElementChild;section.replaceWith(next);if(moreOpen&&next.querySelector('.compare-more'))next.querySelector('.compare-more').open=true;next.querySelector('[data-compare-exclude]')?.focus({preventScroll:true});
    });
    return {render};
  }
  window.FishingComparison={mount};
})();
