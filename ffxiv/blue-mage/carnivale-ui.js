(function(){
  'use strict';
  const $=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.BlueMageCarnivaleUI={mount({spells,getLearned}){
    const D=window.BLUE_MAGE_CARNIVALE,E=window.BlueMageCarnivale,panel=$('carnivalePanel'),byId=new Map(spells.map(s=>[s.id,s]));
    if(!D||!E){panel.textContent='무투회 공략을 불러오지 못했어요. 새로고침해 주세요.';return {refresh(){}};}
    let selected=1,visible=D.stages,learned=getLearned();
    const link=(url,label)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
    function chip(id){const s=byId.get(id);if(!s)return '';const has=learned.has(id);return `<button class="carnivale-spell ${has?'is-known':'is-missing'}" data-detail="${id}" aria-label="No.${id} ${esc(s.name)} · ${has?'습득':'미습득'} · 습득처 보기"><span class="carnivale-spell-state">${has?'✓':'미습득'}</span><span>No.${id} ${esc(s.name)}</span></button>`;}
    const chips=ids=>`<div class="carnivale-spells">${[...new Set(ids)].map(chip).join('')}</div>`;
    panel.innerHTML=`<div class="carnivale-heading"><div><h2>가면 무투회 공략</h2><p>32시합 · 기믹 준비 · 페이즈별 순서</p></div>${link(D.official,'한국 공식 무투회 안내')}</div>
      <details class="carnivale-basics"><summary>공통 준비와 입장 안내</summary><ul><li>청마도사 Lv.50 직업 퀘스트 ‘2대 청가면’ 완료 후, 울다하 달 회랑의 청공 투기장 안내인(X:11.5 Y:13.2)에게 입장합니다.</li><li>청마법은 최대 24개. 페이즈 사이에도 활성화 기술을 바꿀 수 없으니 모든 페이즈를 확인하세요.</li><li>에테르 복사: 치유사와 회복 기술을 준비하면 편합니다. 마법·물리 공격과 시전 방해 기술도 확인하세요. 특수 업적은 회복 등 별도 제한을 먼저 확인합니다.</li><li>기본 본능(No.91)은 가면 무투회에 적용되지 않습니다. 주간 목표는 게임에서 확인하세요.</li></ul><div id="carnivaleBaseSpells"></div>${link(D.basics,'Blue Academy 공통 공략')}</details>
      <div class="carnivale-layout"><aside class="carnivale-picker" aria-label="시합 선택"><label for="carnivaleSearch">시합 번호·이름·초성·기술 검색</label><input id="carnivaleSearch" type="search" placeholder="25, 황금, ㄱㅎ, 초경화…" autocomplete="off"><label for="carnivaleFilter">목록 필터</label><select data-radio-options id="carnivaleFilter"><option value="all">전체 시합</option><option value="missing">기믹 준비 기술 부족</option><option value="achievement">특수 업적 공략 있음</option></select><p id="carnivaleCount" role="status"></p><label class="carnivale-mobile" for="carnivaleSelect">시합 선택</label><select class="carnivale-mobile" id="carnivaleSelect"></select><nav id="carnivaleList" aria-label="무투회 시합 목록"></nav></aside>
      <div class="carnivale-content"><p id="carnivaleEmpty" class="carnivale-empty" hidden>조건에 맞는 시합이 없어요. 검색어나 필터를 바꿔 주세요.</p><div id="carnivaleGuide"></div></div></div>`;
    function renderGuide(){
      const stage=visible.find(s=>s.id===selected),guide=$('carnivaleGuide');$('carnivaleEmpty').hidden=!!stage;guide.hidden=!stage;if(!stage){guide.innerHTML='';return;}
      const prep=E.preparation(stage,learned),index=visible.indexOf(stage),learnable=spells.filter(s=>s.sources.some(x=>x.locationKey===`carnivale:${stage.id}`));
      const readiness=prep.total?`${prep.ready} / ${prep.total}가지 기믹 준비`:'추가 기믹 기술 지정 없음';
      const groups=prep.groups.map(g=>`<li class="carnivale-requirement"><div><strong>${esc(g.label)}</strong><span class="${g.ready?'ready':'missing'}">${g.ready?'✓ 습득한 기술로 준비 가능':'미습득 기술 확인'}</span></div><div class="carnivale-alternatives">${g.alternatives.map((ids,i)=>`${i?'<span class="carnivale-or">또는</span>':''}<div class="carnivale-bundle">${ids.map((id,j)=>(j?'<span class="carnivale-plus">+</span>':'')+chip(id)).join('')}</div>`).join('')}</div></li>`).join('');
      guide.innerHTML=`<div class="carnivale-stage-nav"><button data-carnivale-move="-1" ${index===0?'disabled':''} aria-label="이전 시합">← 이전</button><span>시합 ${String(stage.id).padStart(2,'0')} · Lv.${stage.level}</span><button data-carnivale-move="1" ${index===visible.length-1?'disabled':''} aria-label="다음 시합">다음 →</button></div><header class="carnivale-stage-heading"><h3 id="carnivaleStageTitle" tabindex="-1">${String(stage.id).padStart(2,'0')}. ${esc(stage.name)}</h3><p>${esc(stage.summary)}</p><div class="carnivale-tags">${stage.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div></header>
        <section class="carnivale-prep" aria-labelledby="carnivalePrepTitle"><div class="carnivale-section-heading"><h4 id="carnivalePrepTitle">이 공략의 기믹 준비</h4><span id="carnivaleReady" class="${prep.complete?'ready':'missing'}">${readiness}</span></div><p>현재 습득 기록 기준입니다. 대안 중 하나를 준비하고, +로 묶인 기술은 함께 준비하세요. 회복·기본 공격은 공통 준비에서 확인할 수 있어요.</p>${groups?`<ul>${groups}</ul>`:'<p>특정 기믹용 기술 지정 없이 기본 전투로 진행할 수 있습니다.</p>'}${stage.roleActions?.length?`<p class="carnivale-role">역할 기술: ${stage.roleActions.map(esc).join(' · ')}</p>`:''}${stage.recommended.length?`<details class="carnivale-extra"><summary>추가로 활용할 기술 ${stage.recommended.length}개</summary>${chips(stage.recommended)}</details>`:''}<p class="carnivale-prep-note">기술을 누르면 습득처를 확인합니다. 이 표시는 기술 보유 확인이며, 장착 여부·클리어 가능 여부를 판정하지 않습니다.</p></section>
        ${stage.warning?`<aside class="carnivale-warning"><strong>주의</strong><p>${esc(stage.warning)}</p></aside>`:''}
        <section class="carnivale-phases" aria-label="일반 클리어 순서"><h4>일반 클리어 순서</h4>${stage.phases.map(p=>`<section class="carnivale-phase"><h5>${esc(p.title)}</h5><ol>${p.steps.map(s=>`<li><strong>${esc(s.trigger)}</strong><p>${esc(s.action)}</p>${s.spells.length?chips(s.spells):''}</li>`).join('')}</ol></section>`).join('')}</section>
        ${stage.achievement?`<section class="carnivale-achievement" aria-labelledby="carnivaleAchievementTitle"><h4 id="carnivaleAchievementTitle">특수 업적 · ${esc(stage.achievement.title)}</h4><ul>${stage.achievement.conditions.map(c=>`<li>${esc(c)}</li>`).join('')}</ul><p>${esc(stage.achievement.note)}</p>${stage.achievement.spells?.length?chips(stage.achievement.spells):''}${link(D.bonuses,'보너스 조건 출처')}</section>`:''}
        ${learnable.length?`<section class="carnivale-learnable"><h4>이 시합에서 배울 수 있는 청마법</h4>${chips(learnable.map(s=>s.id))}<p>대상이 기술을 사용하는 것을 본 뒤 처치하세요. 습득처 버튼에서 페이즈와 대상을 확인할 수 있어요.</p></section>`:''}
        <footer class="carnivale-sources"><p>공략 참고: ${link(stage.source,'Blue Academy · '+String(stage.id).padStart(2,'0')+'시합')}${stage.video?' · '+link(stage.video,'공략 영상'):''}</p><p>${D.updatedAt} 확인 · 한국어 요약. 안전지대의 정확한 위치는 원문·영상과 함께 확인하세요. 주간 보너스 조건은 별도로 적용됩니다.</p></footer>`;
    }
    function renderList(){
      const oldScroll=$('carnivaleList').scrollTop;
      $('carnivaleCount').textContent=`${visible.length} / ${D.count}시합`;
      $('carnivaleList').innerHTML=visible.map(s=>{const p=E.preparation(s,learned);return `<button data-carnivale-stage="${s.id}" ${s.id===selected?'aria-current="true"':''}><span class="carnivale-list-number">${String(s.id).padStart(2,'0')}</span><span><strong>${esc(s.name)}</strong><small>${p.total?`기믹 준비 ${p.ready}/${p.total}`:'기본 전투'}${s.achievement?' · 업적':''}</small></span></button>`;}).join('');
      $('carnivaleList').scrollTop=oldScroll;
      $('carnivaleSelect').innerHTML=visible.map(s=>`<option value="${s.id}">${String(s.id).padStart(2,'0')}. ${esc(s.name)}</option>`).join('');$('carnivaleSelect').value=String(selected);$('carnivaleSelect').disabled=!visible.length;
    }
    function refresh(){
      learned=getLearned();visible=E.filter(D.stages,learned,{query:$('carnivaleSearch').value,kind:$('carnivaleFilter').value},spells);
      if(!visible.some(s=>s.id===selected))selected=visible[0]?.id??null;
      const achievementFocus=document.activeElement?.dataset.carnivaleStage;
      const extraOpen=!!$('carnivaleGuide').querySelector('.carnivale-extra[open]');
      $('carnivaleBaseSpells').innerHTML=chips([77,58,13,24,63,55]);renderList();renderGuide();
      if(extraOpen)$('carnivaleGuide').querySelector('.carnivale-extra')?.setAttribute('open','');
      if(achievementFocus)$('carnivaleList').querySelector(`[data-carnivale-stage="${achievementFocus}"]`)?.focus({preventScroll:true});
    }
    function select(id){if(!visible.some(s=>s.id===id))return;selected=id;renderList();renderGuide();$('carnivaleStageTitle').focus({preventScroll:true});$('carnivaleStageTitle').scrollIntoView({block:'start'});}
    $('carnivaleSearch').addEventListener('input',refresh);$('carnivaleSearch').addEventListener('compositionupdate',()=>queueMicrotask(refresh));$('carnivaleSearch').addEventListener('compositionend',refresh);
    $('carnivaleFilter').addEventListener('change',refresh);$('carnivaleSelect').addEventListener('change',event=>select(+event.target.value));
    panel.addEventListener('click',event=>{const b=event.target.closest('[data-carnivale-stage],[data-carnivale-move]');if(!b||b.disabled)return;if(b.hasAttribute('data-carnivale-stage'))select(+b.dataset.carnivaleStage);else select(visible[visible.findIndex(s=>s.id===selected)+ +b.dataset.carnivaleMove]?.id);});
    refresh();return {refresh};
  }};
})();
