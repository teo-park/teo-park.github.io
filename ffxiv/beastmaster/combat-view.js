import {elements,purposes,ailments,commands,purposeMatches,weaknessMatches} from './combat.js?v=20260909-combat1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const guide='https://guide.ff14.co.kr/job/BeastMaster/34?type=E';
const link=(url,label)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
export function initCombatFilters(doc,onChange){
  doc.getElementById('combatPurpose').innerHTML='<option value="all">모든 용도</option><optgroup label="용도">'+Object.entries(purposes).map(([key,name])=>`<option value="${key}">${name}</option>`).join('')+'</optgroup><optgroup label="적에게 부여하는 상태">'+ailments.map(s=>`<option value="state:${s}">${s}</option>`).join('')+'</optgroup>';
  doc.getElementById('combatWeakness').innerHTML='<option value="all">약점 지정 안 함</option>'+[['물리',['slash','pierce','blunt']],['마법',['fire','ice','wind','earth','lightning','water']]].map(([name,keys])=>`<optgroup label="${name}">${keys.map(k=>`<option value="${k}">${elements[k]} 약점</option>`).join('')}</optgroup>`).join('');
  for(const id of ['combatPurpose','combatWeakness'])doc.getElementById(id).onchange=onChange;
}
function badges(action,o={}){
  const chips=[];
  if(action.element)chips.push(`<span class="combat-element ${o.weakness===action.element?'matched':''}">${elements[action.element]}${action.element==='unaspected'?'':' 공격'}</span>`);
  if(action.affinity)chips.push(`<span class="combat-affinity">수심기 ${action.affinity}</span>`);
  for(const tag of action.tags)chips.push(`<span class="combat-tag ${o.purpose===tag?'matched':''}">${purposes[tag]}</span>`);
  for(const state of action.states)chips.push(`<span class="combat-tag ${o.purpose===`state:${state}`?'matched':''}">${state}</span>`);
  return chips.join('');
}
function skill(action,o={},full=false){
  const matched=(o.purpose&&o.purpose!=='all'&&purposeMatches(action,o.purpose))||(o.weakness&&o.weakness!=='all'&&weaknessMatches(action,o.weakness));
  return `<div class="combat-skill ${matched?'skill-matched':''}"><div class="combat-skill-title"><span>${commands[action.kind].name} · Lv.${action.level}</span><strong>${esc(action.name)}</strong>${matched?'<b class="match-label">조건 일치</b>':''}</div><div class="combat-badges">${badges(action,o)}</div><p class="combat-effect">${esc(full?action.summary:shortEffect(action))}</p></div>`;
}
function shortEffect(action){
  // Show the effect, not a rating. Potency and conditional caveats remain intact
  // in the detail view, avoiding false comparisons of multihit and TP attacks.
  const lines=action.summary.split('\n');
  const brief=lines.filter(l=>!l.startsWith('위력:')&&!l.startsWith('지속 피해 위력:')&&l!=='전투 중에만 사용할 수 있습니다.'&&l!=='사역마수가 실행하는 수심기 무기 기술은 마수조련사의 수심기 무기 기술과 동일하게 수심기 연계를 발생시킵니다.');
  return brief.join(' ').replaceAll('추가 효과: ','');
}
export function combatRow(beast,profile,o){
  return `<article class="combat-row" data-combat-beast="${beast.id}"><div class="combat-beast"><span class="combat-number">No.${beast.id}</span><h3>${esc(beast.name)}</h3><button class="combat-check" data-check="${beast.id}" aria-pressed="false"><span class="check-mark" aria-hidden="true">＋</span> <span class="state-label">미수집</span></button><button class="quiet" data-detail="${beast.id}">기술·획득처 ↗</button></div>${profile.actions.map(a=>skill(a,o)).join('')}</article>`;
}
export function combatDetails(beast,profile,data){
  const source=`https://github.com/${data.revisions.ko.repo}/blob/${data.revisions.ko.sha}/csv/ActionTransient.csv`;
  return `<section class="combat-detail"><h2 class="section-title">용도·전투 기술</h2><p class="muted combat-scope">궁극기·능력 해방의 고유 기술 기준입니다. 적에게 표시된 약점과 공격 속성을 맞춰 보세요.</p>${profile.actions.map(a=>skill(a,{},true)).join('')}<p class="combat-scope">궁극기는 사역마수 TP 100 이상, 능력 해방은 사역마수가 생존한 인간 마수 동조 중에 전투 중 사용합니다. 상태 이상은 대상의 저항을 확인하세요. Lv.44부터 능력 해방의 마지막 일격 효과 향상도 적용됩니다.</p><p class="combat-source">${link(guide,'공식 전투 안내')} · ${link(source,'기술 효과 원문')} · Action ${profile.actions.map(a=>a.id).join(' / ')}</p></section>`;
}
