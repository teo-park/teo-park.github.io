(function(){
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const group={chum:'chum',patience:'patience',patience2:'patience',prize:'prize',makeshift:'makeshift',slap:'slap',identical:'identical',spareful:'spareful',collect:'collect',modest:'lures',ambitious:'lures'};
  function create(data,model,guides,catchStats){
    const engine=window.FishingStrategy.create(data,model,guides,catchStats);
    function reference(id){const f=model.byId.get(+id);if(!f)return esc('자료 미확인 '+id);return f.fish?`<button class="strategy-reference" data-fish-detail="${f.id}">${esc(f.name)}</button>`:`<a href="https://ffxivteamcraft.com/db/ko/item/${f.id}" target="_blank" rel="noopener noreferrer">${esc(f.name)} ↗</a>`;}
    function rich(text){return String(text).split(/(\{\d+\})/).map(p=>/^\{\d+\}$/.test(p)?reference(p.slice(1,-1)):esc(p)).join('');}
    const external=(url,label)=>/^https:\/\//.test(url||'')?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`:'';
    const list=items=>'<ol>'+items.map(s=>'<li>'+rich(s)+'</li>').join('')+'</ol>';
    function slap(s){return `<div class="strategy-slap ${s.inferred?'is-inferred':''}"><strong>${esc(s.phase)}</strong><p>${s.ids.map(reference).join(' / ')}</p><p>${rich(s.note)}</p>${s.inferred?`<small>${reference(s.bait)} · 해당 어종 포획 ${s.samples.toLocaleString()}건 / 이 미끼 전체 ${s.total.toLocaleString()}건</small>`:''}</div>`;}
    function render(fish,route,{open=false}={}){
      const p=engine.plan(fish,route);if(!p)return '';
      const e=p.entry,s=guides.sources;
      return `<details class="fish-strategy" data-strategy="${fish.id}" ${open?'open':''}>
        <summary><span class="strategy-summary-title">터주 공략 <span class="strategy-evidence ${e.reviewed?'is-reviewed':''}">${esc(p.evidence)}</span></span><span class="strategy-approach">${esc(p.approach)}</span><span class="strategy-chevron" aria-hidden="true">⌄</span></summary>
        <div class="strategy-body"><div class="strategy-skill-list"><span>Lv.100 기준 · 주요 기술</span>${p.skills.map(key=>{const name=engine.skillNames[key],level=guides.skills[name]?.level;return `<a href="../fisher-skills/#${group[key]}" target="_blank" rel="noopener noreferrer">${esc(name)}${level?' <small>Lv.'+level+'</small>':''}</a>`;}).join('')}</div>
        <div class="strategy-grid"><section><h5>밑작업</h5>${list(p.prep)}</section><section><h5>도전 순서</h5>${list(p.steps)}</section><section><h5>교환 방생</h5>${e.note?.slapAdvice?'<p>'+rich(e.note.slapAdvice)+'</p>':''}${p.slaps.map(slap).join('')}${p.suggestion?'<p class="strategy-inferred-label">개별 교방 공략 미확인 · 관측 기반 후보</p>'+slap(p.suggestion):''}${p.missingSlap?'<p>확인된 교방 대상을 찾지 못했습니다. 임의의 물고기를 최적 대상으로 표시하지 않으며, 같은 입질 비교를 함께 확인해 주세요.</p>':''}${e.note?.noSlap?'<p>기본 추천 없음 · 준비용 GP 확보 우선</p>':''}</section></div>
        ${p.warnings.length?'<div class="strategy-warnings"><h5>주의할 점</h5><ul>'+p.warnings.map(t=>'<li>'+rich(t)+'</li>').join('')+'</ul></div>':''}
        <footer class="strategy-sources"><div>${external(e.guide,'Fruity Snacks · '+(e.sharedWith?'관련 어종 공략':'개별 공략'))}${e.note?.recent?external(s.k755.url,'꼬막킴 · 7.55 공략'):''}${external('https://ffxivteamcraft.com/db/ko/item/'+fish.id,'Teamcraft 조건')}${external(s.official.url,'공식 기술 설명')}</div><p>${esc(guides.checked)} 대조 · 패치 ${esc(guides.patch)}${e.note?.recent?' · 최근 공략은 최적화 중':''}. ${e.reviewed?'개별 공략의 예외를 대조했고, 기본 경로·기술 안내는 수첩 조건에서 작성했습니다.':'위 계획은 수첩의 미끼·직감·기술 조건에서 도출했습니다. 개별 공략으로 검증된 최적 전략은 아닙니다.'}</p>
        <details class="strategy-method"><summary>자료 범위·추천 기준</summary><p>일반 해역 터주 ${guides.coverage.total}종(터주왕 ${guides.coverage.legendary}종 포함). ${guides.coverage.reviewed}종은 개별 예외를 대조했고 ${guides.coverage.linked}종에는 개별·관련 공략 링크가 있습니다. 먼바다 어종은 항해일지에서 다룹니다.</p><p>교방 후보는 같은 미끼·입질 계열에서 관측된 일반 어종만 비교하며, 생미끼·직감 준비에 필요한 어종을 제외합니다. 포획 기록에는 선택적으로 낚은 결과가 섞여 있으므로 입질 확률이나 확정 저격을 보장하지 않습니다.</p><p>인내·대물 낚시는 월척 확보용입니다. 터주 입질 자체를 올리는 효과로 취급하지 않습니다. 소박한·거대한 루어는 낚아채기 계열과 창 길이까지 고려해야 합니다. 수집 체크는 게임 안의 직감 재료 진행도와 무관합니다.</p><div>${external(s.fruity.url,'Fruity Snacks 공략 모음')}${external(s.tracker.url,'Carbuncle Plushy 조건·직감 시간')}</div></details></footer></div></details>`;
    }
    return {render,engine};
  }
  window.FishingStrategyView={create};
})();
