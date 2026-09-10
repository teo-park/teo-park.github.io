(function(){
  'use strict';
  const data=window.FISHING_STRATEGY_LINKS,base='../fisher-skills/big-fish/';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(fish){
    const entry=fish?.big&&!fish.stars&&data?.fish[fish.id];if(!entry)return '';
    const groups=[['preparation','준비',entry.preparation],['methods','생미끼 확보 · 방법 비교',entry.methods],['main','본 낚시',entry.main]];
    return `<section class="fish-strategies" data-strategy-fish="${fish.id}" aria-label="${esc(fish.name)} 유형별 공략"><strong class="fish-strategies-title">터주 유형별 공략</strong><div class="fish-strategy-groups">${groups.filter(([, ,ids])=>ids.length).map(([phase,label,ids])=>`<div class="fish-strategy-group" data-strategy-phase="${phase}"><span class="fish-strategy-label">${label}</span>${ids.map(number=>{const type=data.types.find(t=>t.number===number);return `<a class="fish-strategy-link" href="${base}#${type.id}" target="_blank" rel="noopener noreferrer" aria-label="${esc(fish.name+' · '+label+' · '+type.title)} 공략 (새 탭)"><span class="fish-strategy-number">${number}</span>${esc(type.title)}<span aria-hidden="true"> ↗</span></a>`;}).join('')}</div>`).join('')}</div></section>`;
  }
  window.FishingStrategyLinks={render};
})();
