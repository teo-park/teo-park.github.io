(function(){
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.BlueMageLoadoutUI={mount({spells,getLearned}){
    const $=id=>document.getElementById(id),L=window.BlueMageLoadouts,byId=new Map(spells.map(s=>[s.id,s]));
    let current,view='rotation',lastKey='';
    $('loadoutPanel').innerHTML=`<div class="loadout-heading"><div><h2>스킬 조합 추천</h2><p>습득한 기술에서 최대 24개를 고르고, 사용할 순서를 함께 보여줍니다.</p></div><span class="loadout-edition">Lv.80 · 청마법 124종 기준</span></div>
      <div class="loadout-controls"><label>역할<select id="loadoutRole"><option value="dps">딜 청마</option><option value="healer">힐 청마</option><option value="tank">탱 청마</option></select></label><label>임무 유형<select id="loadoutDuty"><option value="boss">토벌전·레이드 보스</option><option value="dungeon">파티 던전</option><option value="solo">혼자 던전 · 탱커 복사</option></select></label><label id="loadoutBurstLabel" class="loadout-check"><input id="loadoutBurst" type="checkbox" checked> 달의 피리 몰아치기 포함</label></div>
      <details class="loadout-options"><summary>임무별 추가 기술·파티 담당 선택</summary><p>차단·해제·탱커 교대가 필요한 임무라면 체크하세요. 파티 담당 기술은 다른 청마도사와 나누어 선택합니다.</p><div class="loadout-controls"><label class="loadout-check"><input id="loadoutInterrupt" type="checkbox"> 시전 방해</label><label class="loadout-check"><input id="loadoutCleanse" type="checkbox"> 약화 효과 해제</label><label id="loadoutSwapLabel" class="loadout-check"><input id="loadoutSwap" type="checkbox"> 탱커 교대</label><label>피해 증가 담당<select id="loadoutDebuff"><option value="none">담당 안 함</option><option value="offguard">무방비</option><option value="light">신비한 빛</option></select></label><label>지속 피해 담당<select id="loadoutDot"><option value="none">담당 안 함</option><option value="breath">마법 숨결</option><option value="flame">필멸의 불꽃</option></select></label></div></details>
      <div id="loadoutSummary" class="loadout-summary" role="status" aria-live="polite"></div><div id="loadoutNotes" class="loadout-notes"></div>
      <div class="loadout-tabs" aria-label="추천 결과 보기"><button id="loadoutRotationTab" aria-pressed="true">사용 순서</button><button id="loadoutSpellsTab" aria-pressed="false">추천 기술</button><button id="loadoutMissingTab" aria-pressed="false">다음에 배울 기술</button><button id="loadoutCopy" class="quiet">조합 복사</button></div>
      <p id="loadoutCopyStatus" role="status"></p><textarea id="loadoutCopyFallback" rows="5" readonly hidden aria-label="추천 조합 복사용 텍스트"></textarea><div id="loadoutResult"></div>
      <p class="loadout-scope">임무 유형별 기본안입니다. 개별 보스의 기믹·면역·파티 편성에 맞춰 조정하세요. 기술 체크는 습득 기록이며, 게임의 활성 기술은 직접 설정해야 합니다. 역할 기술은 24칸에 포함하지 않습니다.</p>
      <div class="loadout-sources">추천·연계 참고: <a href="https://mage.blue/gameplay/tank/" target="_blank" rel="noopener noreferrer">Blue Academy 탱커</a> · <a href="https://mage.blue/gameplay/healer/" target="_blank" rel="noopener noreferrer">힐러</a> · <a href="https://mage.blue/gameplay/dps/" target="_blank" rel="noopener noreferrer">딜러</a> · <a href="https://mage.blue/gameplay/solo/" target="_blank" rel="noopener noreferrer">혼자 던전</a> · <a href="https://mage.blue/gameplay/moon-flute-opener/" target="_blank" rel="noopener noreferrer">시작 순서</a> · <a href="./README.md#스킬-조합과-사용-순서">추천 기준</a></div>`;
    const spell=(id,extra='')=>{if(id==='swiftcast')return '<span class="rotation-role-action">신속한 마법 <small>역할 기술 · Lv.18</small></span>';const s=byId.get(id);return s?`<button class="rotation-spell" data-detail="${id}"><img src="${esc(s.icon)}" alt="" width="28" height="28" loading="lazy"><span><small>No.${String(id).padStart(3,'0')}${extra?' · '+esc(extra):''}</small>${esc(s.name)}</span></button>`:'';};
    const abilitiesHTML=ids=>{
      const runs=[];for(const id of ids){if(runs.at(-1)?.id===id)runs.at(-1).count++;else runs.push({id,count:1});}
      return runs.map(s=>spell(s.id,s.count>1?s.count+'회 연속':'')).join('');
    };
    function options(){return {role:$('loadoutRole').value,duty:$('loadoutDuty').value,burst:$('loadoutBurst').checked,interrupt:$('loadoutInterrupt').checked,cleanse:$('loadoutCleanse').checked,swap:$('loadoutSwap').checked,debuff:$('loadoutDebuff').value,dot:$('loadoutDot').value};}
    function rotationHTML(){
      const {flows,loop,burst}=current.rotation;
      if(!current.selected.length)return '<div class="loadout-empty"><h3>추천할 공격·역할 기술이 없습니다.</h3><p>수집 기록 관리에서 캡처나 번호로 한 번에 등록할 수 있습니다.</p><button id="loadoutRegister">수집 기록 관리</button></div>';
      const loopHTML=loop.length?`<section class="rotation-loop"><h3>${current.role==='dps'?'기본 딜 사이클':'전투 중 우선순위'}</h3><p>위에서부터 필요한 행동을 확인하고, 기본 공격으로 돌아옵니다. 회복·기믹 처리가 먼저입니다.</p><ol>${loop.map(s=>`<li>${spell(s.id)}<span>${esc(s.text)}</span></li>`).join('')}</ol></section>`:'';
      let burstHTML='';
      if(burst.enabled){
        burstHTML=`<section class="rotation-burst"><h3>${burst.full?'달의 피리 · 기본 2분 시작 순서':'달의 피리 · 현재 조합의 짧은 연계 예시'}</h3><p>${burst.full?'왼쪽에서 오른쪽으로, 각 칸의 마법을 사용한 뒤 아래 능력을 끼워 넣습니다. 관통산탄 4회는 연속으로 사용하세요.':'배운 기술로 버프와 공격 순서를 익히는 짧은 예시입니다. 모든 공격 기술을 담은 최적 오프너는 아니며, 남은 기술을 억지로 15초 안에 밀어 넣지 마세요.'}</p><div class="rotation-timeline" tabindex="0" aria-label="왼쪽에서 오른쪽으로 사용하는 시작 순서">${burst.steps.map(s=>`<div class="rotation-beat"><span class="rotation-beat-label">${esc(s.label)}</span><div class="rotation-gcd">${s.gcd?spell(s.gcd):'<span>제자리 유지</span>'}</div>${s.abilities.length?`<div class="rotation-weaves"><small>이어서 사용하는 능력</small>${abilitiesHTML(s.abilities)}</div>`:''}</div>`).join('')}<div class="rotation-beat rotation-recovery"><strong>강화 종료</strong><span>15초 동안<br>공격·회복·기술 사용 불가</span></div></div><p class="rotation-caution">달의 피리 강화는 15초입니다. ${burst.steps.some(s=>s.abilities.includes(103))?'끝나기 직전에 귀수각을 시작했다면 다시 눌러 마무리하지 않고 유지하세요. 움직이거나 다른 행동을 하면 끊깁니다. ':''}${burst.full?'신속한 마법은 관통산탄 4회보다 먼저 사용하고 마트라 마법에 소비합니다. ':' '}시전 속도·지연 시간·보스 기믹에 따라 순서를 조정해야 합니다.</p>${burst.full?'<p>시작 이후에는 기본 사이클로 돌아가고 다음 몰아치기를 준비하세요. 이후 창의 중첩·재사용 상태는 첫 전투와 다르므로 위 순서를 그대로 반복하지 않습니다.</p>':''}</section>`;
      }else if(current.role==='dps')burstHTML=`<p class="rotation-caution">${$('loadoutBurst').checked?'달의 피리와 함께 쓸 주요 공격 기술이 충분히 추천 조합에 들어오면 몰아치기 순서를 표시합니다.':'달의 피리를 제외한 조합입니다.'} 지금은 아래 연계와 기본 공격을 사용하세요.</p>`;
      return loopHTML+burstHTML+`<section class="rotation-combos"><h3>상황별 사용 순서</h3><div class="rotation-flow-grid">${flows.map(f=>`<article class="rotation-flow"><h4>${esc(f.title)}</h4><ol class="rotation-chain">${f.steps.map(id=>`<li>${spell(id)}</li>`).join('')}</ol><p>${esc(f.note)}</p></article>`).join('')}</div></section>`;
    }
    function spellsHTML(items,missing=false){
      if(!items.length)return `<p class="loadout-empty">${missing?'이 기본안에서 다음 습득 대상으로 제안하는 기술이 없습니다.':'현재 습득 기록으로 추천할 기술이 없습니다.'}</p>`;
      const groups=new Map();for(const s of items){const key=missing?(s.required?'먼저 필요한 핵심·담당 기술':'추가로 배우면 좋은 기술'):s.group;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(s);}
      return [...groups].map(([group,rows])=>`<section class="loadout-spell-group"><h3>${esc(group)} <span>${rows.length}</span></h3><div class="loadout-spell-grid">${rows.map(s=>`<article class="loadout-spell" data-recommended="${s.id}">${spell(s.id)}<p>${esc(s.reason)}</p>${missing?`<button class="quiet" data-detail="${s.id}">습득 장소·조건 보기</button>`:''}</article>`).join('')}</div></section>`).join('');
    }
    function renderView(){
      for(const [key,id] of [['rotation','loadoutRotationTab'],['spells','loadoutSpellsTab'],['missing','loadoutMissingTab']])$(id).setAttribute('aria-pressed',String(view===key));
      $('loadoutResult').innerHTML=view==='rotation'?rotationHTML():view==='spells'?`<p>이 순서는 장착 목록입니다. 공격 순서는 ‘사용 순서’에서 확인하세요. 이름을 누르면 습득처가 열립니다.</p>`+spellsHTML(current.selected):`<p>미습득 기술은 추천 조합의 24칸에 포함하지 않습니다.</p>`+spellsHTML(current.missing,true);
      $('loadoutRegister')?.addEventListener('click',()=>$('openRecords').click());
    }
    function refresh(force=false){
      const opts=options(),learned=getLearned(),key=JSON.stringify([opts,[...learned].sort((a,b)=>a-b)]);if(!force&&key===lastKey)return;lastKey=key;
      current=L.recommend(spells,learned,opts);$('loadoutRole').disabled=current.duty==='solo';
      $('loadoutBurstLabel').hidden=current.role!=='dps';$('loadoutSwapLabel').hidden=current.role!=='tank'||current.duty==='solo';
      $('loadoutSummary').textContent=`${L.roles[current.role]} · ${L.duties[current.duty]} · 추천 ${current.selected.length} / 24개${current.blocked.length?' · 미습득 핵심·담당 '+current.blocked.length+'개':''}${current.selected.length<24?' · 빈 칸 '+(24-current.selected.length)+'개':''}`;
      $('loadoutNotes').innerHTML=current.notes.map(n=>`<p>${esc(n)}</p>`).join('')+current.skipped.map(s=>`<p>${esc(byId.get(s.id).name)} 제외: ${esc(s.reason)}</p>`).join('');
      $('loadoutSpellsTab').textContent=`추천 기술 ${current.selected.length}`;$('loadoutMissingTab').textContent=`다음에 배울 기술 ${current.missing.length}`;$('loadoutCopy').disabled=!current.selected.length;$('loadoutCopyStatus').textContent='';$('loadoutCopyFallback').hidden=true;renderView();
    }
    for(const id of ['loadoutRole','loadoutDuty','loadoutBurst','loadoutInterrupt','loadoutCleanse','loadoutSwap','loadoutDebuff','loadoutDot'])$(id).addEventListener('change',()=>refresh());
    for(const [key,id] of [['rotation','loadoutRotationTab'],['spells','loadoutSpellsTab'],['missing','loadoutMissingTab']])$(id).addEventListener('click',()=>{view=key;renderView();});
    $('loadoutCopy').addEventListener('click',async()=>{
      const text=[`${L.roles[current.role]} · ${L.duties[current.duty]} (${current.selected.length}/24)`,...current.selected.map(s=>`No.${String(s.id).padStart(3,'0')} ${byId.get(s.id).name}`)].join('\n');
      try{await navigator.clipboard.writeText(text);$('loadoutCopyStatus').textContent='추천 조합을 복사했어요.';}catch{$('loadoutCopyFallback').value=text;$('loadoutCopyFallback').hidden=false;$('loadoutCopyFallback').select();$('loadoutCopyStatus').textContent='아래 텍스트를 Ctrl+C로 복사하세요.';}
    });
    refresh();return {refresh};
  }};
})();
