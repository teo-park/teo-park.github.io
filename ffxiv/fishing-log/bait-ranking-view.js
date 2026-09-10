(function(){
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pct=n=>(n*100).toFixed(1)+'%',num=n=>n.toLocaleString('ko-KR');
  const labels={changed:'관측 보정',supported:'관측 보정',close:'기존 미끼 유지',insufficient:'표본 부족'};
  function badge(choice){
    if(!choice?.candidates.length)return '';
    const selected=choice.candidates.find(c=>c.id===choice.selected),label=labels[choice.status];
    const note=selected?`목표 어획 ${num(selected.hits)} / 전체 어획 ${num(selected.total)} · ${pct(selected.rate)}. `:'';
    return `<span class="bait-choice-badge" title="${esc(note+'조건의 ‘미끼 추천 근거’에서 비교할 수 있어요. 실제 입질 확률은 아닙니다.')}">${label}</span>`;
  }
  function render(model,fish,route){
    return model.baitOptions(fish.id,route).filter(o=>o.choice?.candidates.length).map(o=>{
      const c=o.choice,original=model.byId.get(c.original)?.name||c.original;
      const reason={changed:`${original}에서 변경 · 보정 후에도 차이가 뚜렷합니다.`,supported:'기존 미끼가 보정 점수에서도 가장 높습니다.',close:'차이가 뚜렷하지 않아 기존 미끼를 유지합니다.',insufficient:'비교 표본이 부족해 기존 미끼를 유지합니다.'}[c.status];
      const rows=c.candidates.map(x=>`<tr${x.id===c.selected?' class="is-selected"':''}><th scope="row">${esc(model.byId.get(x.id)?.name||x.id)}<small>${[x.id===c.selected?'추천':'',x.id===c.original?'기존 미끼':'',!x.enough?'표본 부족':''].filter(Boolean).join(' · ')}</small></th><td>${num(x.hits)} / ${num(x.total)}<small>${pct(x.rate)}</small></td><td>${pct(x.lower)}</td></tr>`).join('');
      return `<details class="bait-ranking" data-bait-ranking="${o.id}:${o.base}"><summary>미끼 추천 근거${o.mooch?' · '+esc(o.fish.name):''}</summary><p>${esc(reason)}</p><table><caption class="visually-hidden">${esc(o.fish.name)} · 같은 낚시터의 미끼별 어획 비중</caption><thead><tr><th scope="col">미끼</th><th scope="col">목표 / 전체 어획</th><th scope="col">보정 점수</th></tr></thead><tbody>${rows}</tbody></table><p>같은 낚시터에서 루어 기술을 쓰지 않은 어획 기록입니다. 전체 100건·목표 10건 이상인 미끼를 비교하고, 표본이 적을수록 점수를 낮춥니다.</p><p>취소한 입질·교환 방생 등의 편향은 남아 있어 실제 성공률은 아닙니다. 위의 ‘입질 표본’은 별도 통계라 건수가 다릅니다. <a href="./README.md#미끼-추천-보정" target="_blank" rel="noopener noreferrer">계산 방법·출처 ↗</a></p></details>`;
    }).join('');
  }
  window.FishingBaitRankingView={badge,render};
})();
