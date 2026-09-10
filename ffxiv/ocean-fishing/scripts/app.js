// 항해일지 application. Native DOM rendering; no original-site runtime or UI library.
(() => {
  'use strict';
  const C = window.OceanCollection, V = window.JournalVoyages, A = window.OceanAchievements;
  const page = document.body.dataset.page;
  const isChecklist = page === 'checklist';
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Nonessential preferences can remain in memory. */ } };
  const json = (key, fallback) => { try { return JSON.parse(read(key)) ?? fallback; } catch { return fallback; } };
  let route = isChecklist ? (read('checklistCombined-activeTab') === 'ruby' ? 'ruby' : 'indigo') : page;
  let fish = [], routeFish = [], catalog, names, state, voyages = [], selected = null, activeStop = 0;
  let expanded = false, scheduleCount = 12, hideCompleted = read('ocean:hide-completed-routes') === 'true';
  let purpose = 'collection', species = [], achievementSpecies = [];
  let achievements;
  const achievementOpen = new Set();
  let query = '', uncaught = false, checkOpen = new Set(), checklistInitialized = false, timer, undo;
  let strategy = {gp:700, prizeCatch:true, ...json('ocean:strategy', {})};
  strategy.gp = Number.isFinite(Number(strategy.gp)) ? Math.max(0,Math.min(9999,Number(strategy.gp))) : 700;
  strategy.objective = strategy.version === 2 && ['community','burst','efficiency'].includes(strategy.objective) ? strategy.objective : 'community';
  strategy.prizeCatch = strategy.prizeCatch !== false;
  strategy.version = 2;
  let scoreMode = 'TH';
  const zoneOptions = new Map();
  const checkState = () => C.read(localStorage);
  const caught = f => C.caught(state, f.route, f.Fish);
  const count = rows => new Set(rows.filter(caught).map(f => f.id)).size;
  const total = rows => new Set(rows.map(f => f.id)).size;
  const routeLabel = () => route === 'indigo' ? '근해' : '원양';
  const time = timestamp => new Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Seoul',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(timestamp);
  const range = value => value ? (value.min === value.max ? String(value.min) : `${value.min.toLocaleString()}–${value.max.toLocaleString()}`) : '미확인';
  const points = (f, mode) => { const amount = C.numberRange(f[mode]); return amount && Number(f.Points) > 0 ? {min:Number(f.Points)*amount.min,max:Number(f.Points)*amount.max} : null; };
  const label = name => names.get(C.key(name)) || C.name(name);
  const image = f => `<img class="fish-image" src="../${esc(f.image)}" alt="" width="32" height="32" loading="lazy">`;
  const period = value => `<span class="period ${value.toLowerCase()}">${esc(V.periods[value])}</span>`;
  function initials(text) {
    const table = [...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
    return [...text].map(c => { const n=c.charCodeAt(0)-0xac00; return n>=0 && n<11172 ? table[Math.floor(n/588)] : c; }).join('');
  }
  function matches(f, text) {
    const q=C.key(text); return !q || [f.Fish, f.FishTranslated, initials(f.FishTranslated)].some(value => C.key(value).includes(q));
  }
  function captureFocus() {
    const element = document.activeElement;
    return element?.matches('input[data-entry]') ? {entry:element.dataset.entry,x:scrollX,y:scrollY} : null;
  }
  function restoreFocus(saved) {
    if (!saved) return;
    const target = [...document.querySelectorAll('input[data-entry]')].find(el => el.dataset.entry === saved.entry && el.getClientRects().length);
    (target || $('undoCatch')).focus({preventScroll:true}); window.scrollTo(saved.x,saved.y);
  }
  function notify(message, callback) {
    undo = callback || null; $('noticeText').textContent = message; $('undoCatch').hidden = !undo; $('notice').hidden = false;
  }
  function changeCatch(entryId, value) {
    const f=fish.find(f => f.entryId===entryId); if(!f) return;
    const saved=captureFocus();let before;
    try {state=checkState();before=caught(f);state=C.setCaught(localStorage,f.route,f.Fish,value);}
    catch { notify('브라우저에 저장하지 못했어요. 저장 공간과 사이트 권한을 확인해 주세요.'); render(); restoreFocus(saved); return; }
    notify(`${f.FishTranslated} · ${value?'수집 기록을 남겼어요.':'수집 표시를 해제했어요.'}`, () => {
      state=C.setCaught(localStorage,f.route,f.Fish,before); render();
    });
    render(); restoreFocus(saved);
  }
  function catchToggle(f) {
    return `<label class="catch-toggle"><input type="checkbox" class="${isChecklist?'fish-check':'collection-check'}" data-entry="${esc(f.entryId)}" aria-label="${esc(f.FishTranslated)} 수집" ${caught(f)?'checked':''}><span class="catch-toggle-face" aria-hidden="true"><span class="catch-toggle-mark"></span><span class="catch-label-empty">미수집</span><span class="catch-label-done">수집</span></span></label>`;
  }
  function baitText(f) {
    if(f.BaitAny==='Yes') return '기본 미끼 3종 모두 가능';
    return (/^M!/.test(f.BestBait)?'생미끼 · ':'') + (f.BestBaitTranslated || C.name(f.BestBait) || '미끼 미확인');
  }
  function baitSummary(rows) {
    if(!rows.length)return '';
    const baits=new Map(), basics=['ragworm','krill','plumpworm'];
    let any=false;
    for(const f of rows) {
      if(f.BaitAny==='Yes'){any=true;continue;}
      const id=C.key(f.BestBait), mooch=/^M!/.test(f.BestBait);
      baits.set((mooch?'mooch:':'bait:')+id,{id,mooch,text:baitText(f)});
    }
    const items=[...baits.values()].sort((a,b)=>Number(a.mooch)-Number(b.mooch)||(basics.includes(a.id)?basics.indexOf(a.id):3)-(basics.includes(b.id)?basics.indexOf(b.id):3)||a.text.localeCompare(b.text,'ko'));
    if(any&&!basics.some(id=>baits.has('bait:'+id)))items.unshift({text:'바위털갯지렁이 / 크릴 / 굵은지렁이 중 하나'});
    return `<div class="zone-baits"><span class="zone-baits-label">권장 미끼</span><div class="zone-bait-list">${items.map(b=>`<span class="bait-chip ${b.mooch?'bait-chip-mooch':''}">${esc(b.text)}</span>`).join('')}</div><span class="zone-baits-note">표시된 물고기 기준</span></div>`;
  }
  function conditions(f) {
    const out=[];
    if(f.intuition.fish.length) out.push(`<span class="condition-label">직감${f.intuition.seconds?' '+f.intuition.seconds+'초':''}</span> ${f.intuition.fish.map(dep=>`${esc(label(dep.name))} × ${dep.count}`).join(' + ')}`);
    if(f.BaitMoochType) out.push(`<span class="condition-label">생미끼</span> ${esc(label(f.BaitMoochType))}${f.BaitMoochAlternatives?' / '+f.BaitMoochAlternatives.split('|').map(name=>esc(label(name))).join(' / '):''}`);
    return out.length?`<div class="fish-conditions">${out.map(line=>`<div>${line}</div>`).join('')}</div>`:'';
  }
  function renderVoyageBaits(rows) {
    const summary=C.voyageBaits(rows), purposeLabel={all:'전체 보기',collection:'도감 채우기',mission:'선상과제',achievement:'업적작',score:'고득점'}[purpose];
    const scoreBaits=new Set();
    if(purpose==='score')for(const f of rows.filter(f=>f.LocalScore)) {
      if(f.BaitAny==='Yes')continue;
      scoreBaits.add((/^M!/.test(f.BestBait)?'mooch:':'bait:')+C.key(f.BestBait));
    }
    const chips=(items,mooch=false)=>items.map(b=>{
      const locations=[...new Set(b.fish.map(f=>(V.names[f.Stop]||f.StopTranslated||f.Stop)+' · '+(f.spectral?'환해류':'일반')))];
      const recommended=scoreBaits.has((mooch?'mooch:':'bait:')+b.id);
      return `<span class="bait-chip ${mooch?'bait-chip-mooch':''} ${recommended?'bait-chip-score':''}" data-bait="${esc(b.id)}" title="${esc(locations.join(' / '))}">${esc(mooch?(names.get(b.id)||b.name):b.name)}${recommended?'<b>추천</b>':''}</span>`;
    }).join('');
    const line=(kind,title,content)=>content?`<div class="voyage-bait-row" data-bait-group="${kind}"><strong>${title}</strong><div class="zone-bait-list">${content}</div></div>`:'';
    const basicChoice=summary.basicChoice?'<span class="bait-chip">바위털갯지렁이 / 크릴 / 굵은지렁이 중 하나</span>':'';
    $('voyageBaits').innerHTML=`<div class="voyage-baits-heading"><h3 id="voyageBaitsTitle">항로 준비 미끼</h3><span>${purposeLabel} · 3구역 일반·환해류</span></div>${line('recommended','권장 미끼',chips(summary.recommended)+basicChoice)}${line('alternatives','대체 가능',chips(summary.alternatives))}${line('mooch','생미끼',chips(summary.mooch,true))}<p class="voyage-baits-note">현재 목적·필터로 표시되는 물고기와 직감·생미끼 조건 기준. 대체 미끼는 일부 어종에만 사용할 수 있으며, 생미끼는 항로에서 낚아 준비합니다.${purpose==='score'?' 추천 표시는 GP 추천 대상의 권장 미끼입니다.':''}${summary.unknown.length?' 권장 미끼 미확인 '+summary.unknown.length+'종.':''}${!rows.length?' 표시할 물고기가 없습니다.':''}</p>`;
  }
  function weatherText(f) {
    if(!f.weather.length) return f.spectral?'환해류 중':'날씨 미확인';
    const yes=f.weather.filter(w=>w.available), no=f.weather.filter(w=>!w.available);
    if(!no.length) return '모든 날씨';
    return no.length<yes.length?no.map(w=>w.name).join('·')+' 제외':yes.map(w=>w.name).join('·') || '조건 미확인';
  }
  function recommendation(entry) {
    if(!entry) return '';
    if(entry.role) return `<span class="recommendation ${entry.role==='trigger'?'priority':'neutral'}">${entry.rank?'1순위 · ':''}${esc(entry.reason)}</span>`;
    const best=entry.best, target=entry.recoveryTarget, community=strategy.objective==='community';
    const action=o=>(o.prize?'대물 + ':'')+(o.action==='DH'?'이중':'삼중');
    const recovery=target&&(!best||target.total.min>best.total.min)?`<small class="efficiency">회복 후 목표: ${action(target)} · ${target.cost} GP · ${range(target.total)}점</small>`:'';
    if(!best) return `<span class="recommendation neutral">${esc(entry.reason)}</span>${recovery}`;
    const rotation=community?`<p>${best.prize?'투척 전 대물 낚시 → ':''}${entry.hints.field==='Mooch'?'생미끼 낚시':'낚싯대 던지기'} → 목표 입질에 ${best.action==='DH'?'이중':'삼중'} 낚아채기</p>${!entry.conditional&&target?`<p>확인 후 반복: 한결같은 챔질 → ${target.prize?'대물 낚시 → ':''}낚싯대 던지기 → ${target.action==='DH'?'이중':'삼중'} 낚아채기.</p><p>반복 1회 ${range(target.total)}점 · ${target.cost+350} GP (첫 어획 별도·중간 회복 필요)</p>`:'<p>직감·생미끼 준비가 필요한 조건부 대상입니다. 활성 생미끼에는 대물 낚시·한결같은 챔질을 쓰지 마세요.</p>'}`:'';
    return `<span class="recommendation ${entry.rank<=3?'priority':''}">${entry.conditional?'조건부 ':''}${entry.rank<=3?entry.rank+'순위 · ':''}${action(best)} 추천</span><small class="efficiency">${community?`${best.cost} GP · ${best.prize?'월척 ':''}${range(best.total)}점`:`${best.cost} GP · 추가 ${range(best.extra)}점 · 100 GP당 +${best.efficiency.toFixed(1)}점`}</small>${recovery}<details class="target-details"><summary>${community?'저격 조건·사용 순서':'저격 조건'}</summary>${rotation}<p>${esc(entry.hints.label)} · ${esc(C.biteTimeText(entry.hints.rawTime))} · ${esc(entry.hints.bite)}</p><p>${entry.hints.overlaps.length?'같은 미끼·입질·시간이 겹치는 물고기: '+entry.hints.overlaps.map(esc).join(', '):'자료상 같은 입질 구간과 겹치는 물고기 없음'}</p>${entry.hints.unknown?'<p>일부 입질 시간은 미확인입니다. 정확한 구분을 보장하지 않아요.</p>':''}<p>날씨와 직감 조건은 게임에서 확인해 주세요.</p></details>`;
  }
  function table(rows, id, options={}) {
    const score=purpose==='score' && !isChecklist;
    const sort=score?(options.scoreSort||'recommendation'):(options.sort||'order');
    rows=[...rows];
    if(sort==='recommendation') rows.sort(C.compareRecommendations);
    if(sort==='name') rows.sort((a,b)=>a.FishTranslated.localeCompare(b.FishTranslated,'ko'));
    if(sort==='points') rows.sort((a,b)=>Number(b.Points)-Number(a.Points));
    if(sort==='triple') rows.sort((a,b)=>(points(b,'TH')?.min||0)-(points(a,'TH')?.min||0));
    if(!rows.length) return '<p class="empty-state">조건에 맞는 물고기가 없어요. 필터를 바꿔 보세요.</p>';
    const headers=['물고기','입질','권장 미끼','기본 점수','이중 점수','삼중 점수','시간·날씨','물고기군','미끼별 입질 시간'];
    return `<div class="fish-table-scroll" role="region" aria-label="물고기 표 · 작은 화면에서는 가로로 스크롤" tabindex="0"><table id="${esc(id)}" class="fish-table ${score?'score-table':''}"><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(f=>{
      const rec=f.LocalRecommendation, preferred=rec?.best?.action;
      const badges=[f.LocalAlwaysVisible?`<span class="fish-tag">${f.spectralTrigger?'환해류 유도 · ':''}항상 표시</span>`:'',f.LocalGroupMatch?`<span class="fish-tag">${purpose==='achievement'?'업적':'과제'} 대상</span>`:'',f.LocalRequiredBy?.length?`<span class="fish-tag condition" title="${esc(f.LocalRequiredBy.join(', '))}에 필요한 조건 물고기">조건용</span>`:''];
      return `<tr data-fish-id="${f.id}" class="${caught(f)?'is-caught':''}"><td><div class="fish-heading">${image(f)}<div><strong>${esc(f.FishTranslated)}</strong><span class="fish-stars" aria-label="별 ${esc(f.Stars)}개">${'★'.repeat(Math.min(5,Number(f.Stars)||0))}</span></div></div><div class="collection-control">${catchToggle(f)}${badges.join('')}</div>${conditions(f)}${f.DataNotes?`<details class="data-note"><summary>자료 참고</summary><p>${esc(f.DataNotes)}</p></details>`:''}${score?recommendation(rec):''}</td><td><strong class="bite bite-${f.Bite.length}">${esc(f.Bite||'?')}</strong><small>${esc(f.hooksetName || (f.Hookset==='Precision'?'섬세한 낚아채기':'강력한 낚아채기'))}</small></td><td><strong class="bait-label">${esc(baitText(f))}</strong><small>${esc(C.biteTimeText(C.baitInfo(f).rawTime))}</small></td><td class="points">${f.Points?Number(f.Points).toLocaleString():'미확인'}</td>${['DH','TH'].map(mode=>`<td class="points ${score&&preferred===mode?'score-emphasis':''}">${range(points(f,mode))}<small>${C.numberRange(f[mode])?range(C.numberRange(f[mode]))+'마리':'수량 미확인'}</small>${score&&preferred===mode?`<span class="recommended-cell">${rec.best.prize?'월척 '+range(rec.best.total)+'점':'추천'}</span>`:''}</td>`).join('')}<td><div>${f.spectral?['Day','Sunset','Night'].filter(p=>f['TimeFrame'+p]==='Yes').map(period).join(' '):'모든 시간'}</div><small>${esc(weatherText(f))}</small></td><td>${esc(f.SpeciesTranslated||'—')}</td><td class="bait-times">${f.baits.map(b=>`<div><span>${esc(b.kind==='Mooch'?'생미끼 · '+label(b.name):b.label)}</span> ${esc(C.biteTimeText(b.time))}</div>`).join('')||'자료 없음'}</td></tr>`;
    }).join('')}</tbody></table></div>`;
  }
  function loadPreferences() {
    routeFish=fish.filter(f=>f.route===route); catalog=C.createCatalog(routeFish);
    const saved=read('ocean:purpose:'+route);
    purpose=['all','collection','mission','achievement','score'].includes(saved)?saved:'collection';
    const groups=json('ocean:species-groups:'+route,null), legacy=read('ocean:species:'+route);
    species=Array.isArray(groups)?groups.filter(x=>typeof x==='string'):legacy?[legacy]:[];
    const savedAchievements=json('ocean:achievement-groups:'+route,null);
    // Carry the former combined selection across once; later changes stay independent.
    achievementSpecies=Array.isArray(savedAchievements)?savedAchievements.filter(x=>typeof x==='string'):[...species];
    if(!Array.isArray(savedAchievements))write('ocean:achievement-groups:'+route,JSON.stringify(achievementSpecies));
    scoreMode=read('ocean:score:'+route)==='DH'?'DH':'TH';
  }
  function planned() {
    // Plan the whole voyage before splitting its stops and currents: a spectral
    // target can need an already-caught fish from the regular current or an earlier stop.
    const available=voyageFish(selected);
    const groups=purpose==='mission'?species:purpose==='achievement'?(achievementSpecies.length?achievementSpecies:achievements.data.goals.filter(g=>g.route===route).map(g=>g.id)):'';
    const result=C.plan(available,catalog,f=>C.caught(state,route,f),purpose==='collection',groups,purpose==='score'?scoreMode:'',strategy);
    const keep=new Set(), required=new Map();
    for(const f of result) {
      const i=selected.stops.findIndex((_,i)=>V.available(f,selected,i));
      const options=zoneOptions.get(`${i}-${f.spectral?'spectral':'regular'}`)||{};
      if(!C.alwaysVisible(f) && ((options.fabled&&f.FabledTable!=='Yes') || (options.bait&&!f.baits.some(b=>b.kind===options.bait))))continue;
      keep.add(C.key(f.Fish));
      const visited=new Set([C.key(f.Fish)]);
      function walk(id) {
        for(const dep of catalog.get(id)?.dependencies||[]) {
          if(visited.has(dep))continue;
          visited.add(dep);keep.add(dep);
          if(!required.has(dep))required.set(dep,new Set());
          required.get(dep).add(f.FishTranslated);walk(dep);
        }
      }
      walk(C.key(f.Fish));
    }
    return result.filter(f=>keep.has(C.key(f.Fish))).map(f=>({...f,LocalRequiredBy:[...new Set([...(f.LocalRequiredBy||[]),...(required.get(C.key(f.Fish))||[])])]}));
  }
  function refreshVoyages() {
    const previous=voyages[0]?.start, following=!selected || selected.start===previous;
    voyages=V.upcoming(route,Date.now(),scheduleCount);
    if(following) selected=voyages[0];
  }
  function voyageFish(v) { return routeFish.filter(f=>v.stops.some((_,i)=>V.available(f,v,i))); }
  function fishNames(rows) {
    const unique=[...new Map(rows.map(f=>[f.id,f])).values()];
    return unique.map(f=>f.FishTranslated+(caught(f)?' (수집완료)':'')).join(' · ');
  }
  function legendaryNames(rows) { return fishNames(rows.filter(f=>f.legendary)); }
  function starterBait(rows) {
    const triggers=rows.filter(f=>f.spectralTrigger);
    if(!triggers.length)return '';
    const baits=[...new Set(triggers.map(baitText))].join(' / ');
    return `<span class="stop-starter" title="${esc(triggers.map(f=>f.FishTranslated).join(' · '))}를 노리는 시작 미끼"><span>환해류 유도</span><b>${esc(baits)}</b></span>`;
  }
  function achievement(v) {
    if(purpose==='mission')return '';
    const plans=achievements.forVoyage(v).filter(g=>g.status==='recommended'&&(purpose!=='achievement'||!achievementSpecies.length||achievementSpecies.includes(g.id)));
    return plans.map(g=>`<span class="route-achievement">업적 추천 · ${esc(g.label)} · ${g.scope==='party'?'파티':'개인'} ${g.count}마리</span>`).join('');
  }
  function renderAchievements() {
    const board=$('achievementPlans');board.hidden=purpose!=='achievement';if(board.hidden)return;
    const plans=achievements.forVoyage(selected).filter(g=>!achievementSpecies.length||achievementSpecies.includes(g.id));
    const sources=achievements.data.sources;
    const conflicts=selected.stops.flatMap((stop,index)=>{
      const actions=plans.filter(g=>g.sections[index].step&&['seek','avoid'].includes(g.sections[index].step.current));
      return new Set(actions.map(g=>g.sections[index].step.current)).size>1?[`${stop.name}: ${actions.map(g=>g.label+' '+(g.sections[index].step.current==='seek'?'유도':'회피')).join(' / ')}`]:[];
    });
    board.innerHTML=`<header class="achievement-heading"><h3 id="achievementTitle">업적작 계획</h3><span>${achievements.data.verifiedAt} 확인 · ${routeLabel()} ${achievements.data.goals.filter(g=>g.route===route).length}종</span></header><p class="achievement-help">한 번의 항해 기준 · 파티 업적은 소속 파티 합산, 개인 업적은 본인 기록만 계산해요. 도감 수집 체크는 이번 항해의 포획 수가 아니에요.</p>${plans.length>1?`<p class="achievement-caution">여러 업적을 함께 표시해도 동시에 노리기 좋다는 뜻은 아니에요.${conflicts.length?' 환해류 운영이 달라요: '+esc(conflicts.join(' · ')):''}</p>`:''}<div class="achievement-list">${plans.map(g=>{
      const next=achievements.nextDeparture(g.id), upcoming=next?time(next.start)+' 출항':'예정 시간 없음';
      const sourceLinks=g.sourceIds.map(id=>sources.find(s=>s.id===id)).filter(Boolean);
      return `<details class="achievement-plan" data-achievement="${g.id}" ${achievementOpen.has(g.id)?'open':''}><summary><strong>${esc(g.label)}</strong><span class="achievement-target">${g.scope==='party'?'파티':'개인'} ${g.count}마리</span><span class="achievement-status ${g.status}">${g.statusLabel}</span><span class="achievement-chevron" aria-hidden="true"></span></summary><div class="achievement-body"><p class="achievement-note">${esc(g.note)}</p>${g.status!=='recommended'?`<p class="achievement-caution">${{alternative:'공략상 대체 가능한 항로예요. 아래는 현재 시간대의 출현 어종이며, 구간 운영은 추천 항로에서 안내해요.',appearance:'대상 어종은 있지만 추천 항로로 확인된 조합은 아니에요. 아래 출현 목록만으로 업적 달성을 판단하지 마세요.',absent:'현재 항로에 이 업적의 대상 어종이 없어요.'}[g.status]}</p>`:''}<div class="achievement-next"><span>가장 가까운 추천 시간 · <b>${esc(upcoming)}</b></span>${next?`<button type="button" data-achievement-departure="${g.id}">이 업적 추천 시간으로</button>`:''}</div>${g.sections.map(s=>`<section class="achievement-stop"><h4>${s.index+1}. ${esc(s.name)} ${period(s.time)}${s.step?`<span class="current-policy ${s.step.current}">${A.currentLabels[s.step.current]}</span>`:''}</h4>${s.step?`<p>${esc(s.step.note)}${['seek','weather'].includes(s.step.current)&&s.trigger?` <span class="achievement-trigger">유도 미끼: ${esc(baitText(s.trigger))} · ${esc(s.trigger.FishTranslated)}</span>`:''}</p>`:''}${s.targets.length?`<div class="achievement-fish-list">${s.targets.map(({fish:f,priority})=>`<div class="achievement-fish" data-achievement-fish="${f.id}"><span class="achievement-water ${f.spectral?'spectral':''}">${f.spectral?'환해류':'일반'}</span><span class="achievement-fish-name">${image(f)}<strong>${esc(f.FishTranslated)}</strong>${priority?'<b class="achievement-priority">주력</b>':''}${(f.intuition.fish.length||/^M!/.test(f.BestBait))?'<span class="fish-tag condition">조건 있음</span>':''}</span><span>${esc(baitText(f))}</span><span><b class="bite">${esc(f.Bite||'?')}</b> · ${esc(C.biteTimeText(C.baitInfo(f).rawTime))}<small>${esc(f.hooksetName||'낚아채기 미확인')}${weatherText(f)!=='모든 날씨'?' · '+esc(weatherText(f)):''}</small></span><span class="achievement-yield">이중 <b>${range(C.numberRange(f.DH))}</b> · 삼중 <b>${range(C.numberRange(f.TH))}</b>마리</span>${(f.intuition.fish.length||/^M!/.test(f.BestBait))?`<div class="achievement-dependencies">${conditions(f)}</div>`:''}</div>`).join('')}</div>`:'<p class="achievement-empty">이 구간에는 대상 어종이 없어요.</p>'}</section>`).join('')}<div class="achievement-sources">${sourceLinks.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}</div></div></details>`;
    }).join('')}</div><p class="achievement-help">주력 표시는 추천 항로의 공략 대상이에요. 이중 400 GP · 삼중 700 GP. 입질 시간은 미끼별 관측값이며 루어 사용·날씨·직감에 따라 저격이 달라질 수 있어요. 환해류 발생과 업적 달성을 보장하지 않아요.</p>`;
  }
  function countdown(v) {
    const now=Date.now();
    if(now>=v.close) return `접수 마감 · ${Math.floor((now-v.start)/60000)}분 전 출항`;
    if(now>=v.start) return `접수 중 · ${Math.ceil((v.close-now)/60000)}분 남음`;
    const mins=Math.ceil((v.start-now)/60000); return mins<60?`${mins}분 후`:`${Math.floor(mins/60)}시간${mins%60?' '+mins%60+'분':''} 후`;
  }
  function renderSchedule() {
    $('scheduleAchievementHelp').hidden=purpose==='mission';
    const focused=document.activeElement?.dataset.voyage;
    $('scheduleToggle').textContent=expanded?'접기':'다음 시간 보기'; $('scheduleToggle').setAttribute('aria-expanded',String(expanded));
    $('hideCompleted').closest('label').hidden=purpose!=='collection'; $('hideCompleted').checked=hideCompleted;
    $('moreVoyages').hidden=!expanded || scheduleCount>=144;
    $('scheduleRows').innerHTML=voyages.map((v,i)=>{
      const remaining=total(voyageFish(v))-count(voyageFish(v));
      const hide=i>0&&(!expanded || (hideCompleted&&purpose==='collection'&&remaining===0));
      return `<tr ${hide?'hidden':''} class="${v.start===selected.start?'selected':''}"><td><button type="button" data-voyage="${v.start}" aria-pressed="${v.start===selected.start}">${time(v.start)}</button></td><td><span class="departure-countdown">${countdown(v)}</span></td><td>${esc(v.stops[2].name)} ${period(v.stops[2].time)}${achievement(v)}</td><td>${remaining}종</td><td>${esc(legendaryNames(voyageFish(v)) || '—')}</td></tr>`;
    }).join('');
    if(focused)document.querySelector(`[data-voyage="${focused}"]`)?.focus({preventScroll:true});
  }
  function renderSummary() {
    $('collectionCount').textContent=count(routeFish); $('collectionTotal').textContent=total(routeFish)+'종';
    $('collectionProgress').value=count(routeFish); $('collectionProgress').max=total(routeFish);
    $('collectionProgress').setAttribute('aria-label',`${routeLabel()} 수집 ${count(routeFish)} / ${total(routeFish)}종`);
    $('collectionStatus').textContent=`${routeLabel()} ${count(routeFish)} / ${total(routeFish)}종 수집 · 이 브라우저에 저장`;
  }
  function renderOptions() {
    document.querySelectorAll('[name=purpose]').forEach(input=>{input.checked=input.value===purpose;});
    const groups=[...new Map(routeFish.filter(f=>f.Species).map(f=>[f.Species,f.SpeciesTranslated])).entries()].sort((a,b)=>a[1].localeCompare(b[1],'ko'));
    $('speciesOptions').hidden=purpose!=='mission'; $('achievementOptions').hidden=purpose!=='achievement'; $('scoreOptions').hidden=purpose!=='score';
    if(!$('speciesChoices').children.length) $('speciesChoices').innerHTML=groups.map(([id,text])=>`<label class="species-option"><input type="checkbox" name="species" value="${esc(id)}" ${species.includes(id)?'checked':''}>${esc(text)}</label>`).join('');
    document.querySelectorAll('[name=species]').forEach(input=>{input.checked=species.includes(input.value);});
    if(!$('achievementChoices').children.length) $('achievementChoices').innerHTML=groups.filter(([id])=>achievements.goals.has(id)).map(([id,text])=>`<label class="species-option"><input type="checkbox" name="achievementGroup" value="${esc(id)}">${esc(text)}</label>`).join('');
    document.querySelectorAll('[name=achievementGroup]').forEach(input=>{input.checked=achievementSpecies.includes(input.value);});
    $('scoreMode').value=scoreMode; $('strategyGP').value=strategy.gp; $('strategyObjective').value=strategy.objective;
    $('strategyPrize').checked=strategy.prizeCatch;
    $('purposeHelp').textContent={all:'모든 물고기를 표시해요. 수집 상태와 관계없이 미끼를 확인할 수 있어요.',collection:'미수집 물고기와 필요한 직감·생미끼 조건을 보여줘요. 일반 구간의 유령·환해 물고기는 항상 남겨요.',mission:species.length?`선상과제 ${species.length}개 물고기군과 필요한 조건 물고기를 함께 보여줘요. 환해류 유도 물고기는 항상 표시해요.`:'선상과제에 나온 물고기군을 선택하세요. 두 종류 이상 함께 선택할 수 있어요.',achievement:achievementSpecies.length?'선택한 업적의 목표 수량·추천 항로·구간별 공략과 대상 물고기를 보여줘요.':'전체 업적을 보여줘요. 목표를 선택하면 해당 업적의 항로와 물고기로 좁혀져요.',score:'모든 점수를 표시하고, 현재 GP로 가능한 기술을 추천해요. 목표 물고기를 낚는 데 성공한다는 전제입니다.'}[purpose];
  }
  function renderFishing() {
    const focused=document.activeElement, focusZone=focused?.closest('[data-zone]')?.dataset.zone, focusOption=focused?.dataset.zoneOption;
    const plannedFish=planned();
    renderAchievements();
    renderVoyageBaits(plannedFish);
    $('scoreGuide').hidden=purpose!=='score';
    $('strategyPrize').closest('label').hidden=strategy.objective!=='community';
    $('selectedTime').textContent=time(selected.start)+' 출항';
    $('selectedStops').textContent=selected.stops.map(stop=>stop.name).join(' → ');
    $('returnFirst').hidden=selected.start===voyages[0].start;
    $('stopTabs').innerHTML=selected.stops.map((stop,i)=>{
      const available=routeFish.filter(f=>V.available(f,selected,i)), legends=legendaryNames(available), big=fishNames(available.filter(f=>f.bigFish));
      return `<button role="tab" id="stopTab${i}" aria-controls="stopPanel${i}" aria-selected="${i===activeStop}" tabindex="${i===activeStop?0:-1}" data-stop="${i}"><small>0${i+1} / STOP</small><span class="stop-location"><strong>${esc(stop.name)}</strong>${period(stop.time)}</span>${starterBait(available)}${big?`<span class="stop-big-fish">터주 · ${esc(big)}</span>`:''}${legends?`<span class="stop-legendary">전설어 · ${esc(legends)}</span>`:''}</button>`;
    }).join('');
    $('fishPanels').innerHTML=selected.stops.map((stop,i)=>`<section role="tabpanel" id="stopPanel${i}" aria-labelledby="stopTab${i}" ${i!==activeStop?'hidden':''}>${[false,true].map(spectral=>{
      const id=`${i}-${spectral?'spectral':'regular'}`, options=zoneOptions.get(id)||{}, visible=plannedFish.filter(f=>V.available(f,selected,i)&&f.spectral===spectral);
      return `<section class="fishing-zone ${spectral?'spectral':''}" data-zone="${id}"><header><h2>${spectral?'환해류':'일반 구간'} <small>${visible.length}종</small></h2><label class="subtle-option"><input type="checkbox" data-zone-option="fabled" ${options.fabled?'checked':''}> 전설어 조건 중심</label></header>${baitSummary(visible)}<div class="zone-tools"><label>정렬 <select data-zone-option="${purpose==='score'?'scoreSort':'sort'}">${purpose==='score'?`<option value="recommendation" ${!options.scoreSort||options.scoreSort==='recommendation'?'selected':''}>추천 1순위 우선</option>`:''}<option value="order" ${(purpose==='score'?options.scoreSort:options.sort)==='order'?'selected':''}>도감 순서</option><option value="name" ${(purpose==='score'?options.scoreSort:options.sort)==='name'?'selected':''}>이름</option><option value="points" ${(purpose==='score'?options.scoreSort:options.sort)==='points'?'selected':''}>기본 점수 높은 순</option><option value="triple" ${(purpose==='score'?options.scoreSort:options.sort)==='triple'?'selected':''}>삼중 점수 높은 순</option></select></label><label>미끼 <select data-zone-option="bait"><option value="">모든 미끼</option>${[['Ragworm','바위털갯지렁이'],['Krill','크릴'],['PlumpWorm','굵은지렁이'],['VersatileLure','만능 루어'],['Special','특수 미끼'],['Mooch','생미끼']].map(([value,label])=>`<option value="${value}" ${options.bait===value?'selected':''}>${label}</option>`).join('')}</select></label></div>${purpose==='score'?`<p class="score-explanation">${strategy.objective==='community'?(spectral?'다음 투척 기준 · 현재 GP로 가능한 최고 점수 조합. 대물 낚시는 월척 2배, 생미끼는 별도 준비.':'환해류 전 준비 기준 · 유도 물고기 우선, GP는 환해류에 집중. 환해류 종료 후에는 다른 추천 기준을 사용할 수 있어요.'):'추가 점수 = 여러 마리 점수 − 일반 한 마리 점수. 이중 400 GP · 삼중 700 GP.'} 표의 기본·이중·삼중 점수는 보통 크기 기준입니다. 추천은 수량 범위의 최솟값을 비교하며, 포획 확률·향후 GP 회복·항해 보너스는 계산하지 않아요.</p>`:''}${table(visible,'fish-'+id,options)}</section>`;
    }).join('')}</section>`).join('');
    if(focusZone&&focusOption)document.querySelector(`[data-zone="${focusZone}"] [data-zone-option="${focusOption}"]`)?.focus({preventScroll:true});
  }
  function checklistGroups() {
    return [...new Set(routeFish.map(f=>f.Stop))].flatMap(stop=>[false,true].map(spectral=>({id:route+'-'+C.key(stop)+'-'+spectral,stop,spectral,rows:routeFish.filter(f=>f.Stop===stop&&f.spectral===spectral)}))).filter(group=>group.rows.length);
  }
  function renderChecklist() {
    const groups=checklistGroups(), filtering=!!query.trim()||uncaught;
    if(!checklistInitialized) {checkOpen.add(groups[0].id);checklistInitialized=true;}
    $('checklistCount').textContent=`${routeLabel()} ${count(routeFish)} / ${total(routeFish)}종 수집`;
    document.querySelectorAll('[data-check-route]').forEach(b=>{const active=b.dataset.checkRoute===route;b.setAttribute('aria-pressed',String(active));});
    const filtered=f=>matches(f,query)&&(!uncaught||!caught(f));
    const visible=routeFish.filter(filtered);
    $('checklistResults').textContent=`검색 결과 ${total(visible)}종`;
    $('checklistGroups').innerHTML=groups.map(group=>{
      const rows=group.rows.filter(filtered), open=filtering?rows.length>0:checkOpen.has(group.id);
      return `<details class="checklist-group" data-group="${group.id}" ${open?'open':''} ${!rows.length?'hidden':''}><summary><span>${esc(V.names[group.stop]||group.stop)}${group.spectral?' · 환해류':''}</span><small>${count(group.rows)} / ${total(group.rows)}종${filtering?' · 표시 '+rows.length+'종':''}</small></summary>${open?table(rows,'check-'+group.id):''}</details>`;
    }).join('')+(visible.length?'':'<p class="empty-state">조건에 맞는 물고기가 없어요. 검색어나 미획득 필터를 바꿔 보세요.</p>');
  }
  function render() {
    if(!fish.length) return;
    if(isChecklist) renderChecklist();
    else {renderSummary();renderSchedule();renderFishing();}
  }
  function backupStatus() {
    const date=read('ocean:last-export'); $('backupStatus').textContent=date && Number.isFinite(Date.parse(date))?'최근 내보내기: '+time(Date.parse(date)):'아직 이 브라우저에서 내보낸 기록이 없어요.';
  }
  function download() {
    const data=JSON.stringify(checkState(),null,2), url=URL.createObjectURL(new Blob([data],{type:'application/json'})), a=document.createElement('a');
    a.href=url;a.download='항해일지-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    write('ocean:last-export',new Date().toISOString());backupStatus();$('recordMessage').textContent='근해·원양 기록을 JSON 파일로 내보냈어요.';
  }
  async function copyTeamcraft() {
    const text=JSON.stringify(C.exportTeamcraft(localStorage));
    $('teamcraftOutput').value=text;$('teamcraftFallback').hidden=false;
    try {await navigator.clipboard.writeText(text);$('recordMessage').textContent='Teamcraft용 기록을 복사했어요.';}
    catch {$('teamcraftOutput').focus();$('teamcraftOutput').select();$('recordMessage').textContent='자동 복사를 사용할 수 없어요. 아래 내용을 직접 복사해 주세요.';}
  }
  function importText(text) {
    try {const result=C.importCaught(localStorage,text);state=result.state;render();$('recordMessage').textContent=result.format==='teamcraft'?`${result.added}종 추가 · 관련 없는 ID ${result.ignored}개 제외${result.duplicates?' · 중복 '+result.duplicates+'개 제외':''}`:`잡은 기록 ${result.imported}종을 합쳤어요.`;}
    catch(error){$('recordMessage').textContent='가져오지 못했어요. '+(error instanceof SyntaxError?'올바른 JSON인지 확인해 주세요.':error.message);}
  }
  function bind() {
    $('openRecords').addEventListener('click',()=>{backupStatus();$('recordsDialog').showModal();});
    $('closeRecords').addEventListener('click',()=>$('recordsDialog').close());
    $('recordsDialog').addEventListener('close',()=>$('openRecords').focus());
    $('recordsDialog').addEventListener('click',event=>{if(event.target!==$('recordsDialog'))return;const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();});
    $('exportRecords').addEventListener('click',download);$('copyTeamcraft').addEventListener('click',copyTeamcraft);
    $('importRecords').addEventListener('click',()=>$('importFile').click());
    $('importFile').addEventListener('change',async event=>{const f=event.target.files[0];if(!f)return;try {if(f.size>5*1024*1024)throw Error('5 MB 이하 JSON 파일을 선택해 주세요.');importText(await f.text());}catch(e){$('recordMessage').textContent=e.message;}finally{event.target.value='';}});
    $('pasteImport').addEventListener('submit',event=>{event.preventDefault();importText($('importText').value);});
    $('undoCatch').addEventListener('click',()=>{try{undo?.();notify('체크 변경을 되돌렸어요.');}catch{notify('되돌린 기록을 저장하지 못했어요. 다시 시도해 주세요.',undo);}});
    $('closeNotice').addEventListener('click',()=>$('notice').hidden=true);
    document.addEventListener('change',event=>{
      const el=event.target;if(el.matches('input[data-entry]'))changeCatch(el.dataset.entry,el.checked);
      if(el.matches('[data-zone-option]')){const id=el.closest('[data-zone]').dataset.zone;zoneOptions.set(id,{...zoneOptions.get(id),[el.dataset.zoneOption]:el.type==='checkbox'?el.checked:el.value});renderFishing();}
    });
    window.addEventListener('storage',event=>{if(window.FishingCollection.isStorageKey(event.key)){try{state=checkState();undo=null;render();notify('연동된 수집 기록을 반영했어요.');}catch{notify('연동 기록을 읽지 못했어요. 기존 기록은 보존됩니다.');}}});
    window.addEventListener('pageshow',()=>{if(fish.length){try{state=checkState();render();}catch{notify('연동 기록을 읽지 못했어요. 기존 기록은 보존됩니다.');}}});
    if(isChecklist) {
      document.querySelectorAll('[data-check-route]').forEach(button=>button.addEventListener('click',()=>{route=button.dataset.checkRoute;write('checklistCombined-activeTab',route);loadPreferences();checkOpen=new Set();checklistInitialized=false;render();}));
      $('checklistSearch').addEventListener('input',event=>{query=event.target.value;renderChecklist();});
      $('checklistUncaught').addEventListener('change',event=>{uncaught=event.target.checked;renderChecklist();});
      $('clearSearch').addEventListener('click',()=>{query='';uncaught=false;$('checklistSearch').value='';$('checklistUncaught').checked=false;renderChecklist();$('checklistSearch').focus();});
      $('checklistGroups').addEventListener('click',event=>{
        const summary=event.target.closest('summary');if(!summary||!summary.parentElement.matches('[data-group]'))return;
        event.preventDefault();const d=summary.parentElement, open=!d.open;d.open=open;
        if(!query.trim()&&!uncaught){if(open)checkOpen.add(d.dataset.group);else checkOpen.delete(d.dataset.group);}
        if(open&&!d.querySelector('table')){const group=checklistGroups().find(g=>g.id===d.dataset.group);d.insertAdjacentHTML('beforeend',table(group.rows.filter(f=>matches(f,query)&&(!uncaught||!caught(f))),'check-'+group.id));}
      });
    } else {
      document.querySelectorAll('[name=purpose]').forEach(input=>input.addEventListener('change',()=>{purpose=input.value;write('ocean:purpose:'+route,purpose);renderOptions();render();}));
      $('speciesChoices').addEventListener('change',()=>{species=[...document.querySelectorAll('[name=species]:checked')].map(el=>el.value);write('ocean:species-groups:'+route,JSON.stringify(species));renderOptions();render();});
      $('achievementChoices').addEventListener('change',event=>{achievementSpecies=[...document.querySelectorAll('[name=achievementGroup]:checked')].map(el=>el.value);if(event.target.checked)achievementOpen.add(event.target.value);write('ocean:achievement-groups:'+route,JSON.stringify(achievementSpecies));renderOptions();render();});
      $('achievementPlans').addEventListener('click',event=>{
        const summary=event.target.closest('summary');
        if(summary?.parentElement.matches('[data-achievement]')){event.preventDefault();const details=summary.parentElement;details.open=!details.open;if(details.open)achievementOpen.add(details.dataset.achievement);else achievementOpen.delete(details.dataset.achievement);return;}
        const button=event.target.closest('[data-achievement-departure]');if(!button)return;
        const id=button.dataset.achievementDeparture, next=achievements.nextDeparture(id);if(!next)return;
        purpose='achievement';achievementSpecies=[id];achievementOpen.add(id);zoneOptions.clear();
        write('ocean:purpose:'+route,purpose);write('ocean:achievement-groups:'+route,JSON.stringify(achievementSpecies));
        const all=V.upcoming(route,Date.now(),144),index=all.findIndex(v=>v.start===next.start);
        scheduleCount=Math.min(144,Math.max(scheduleCount,Math.ceil((index+1)/12)*12));refreshVoyages();selected=next;activeStop=0;
        renderOptions();render();$('achievementPlans').querySelector('summary')?.focus({preventScroll:true});
      });
      $('scoreMode').addEventListener('change',event=>{scoreMode=event.target.value;write('ocean:score:'+route,scoreMode);renderFishing();});
      $('strategyGP').addEventListener('input',event=>{strategy.gp=Math.max(0,Math.min(9999,Number(event.target.value)||0));write('ocean:strategy',JSON.stringify(strategy));renderFishing();});
      $('strategyPrize').addEventListener('change',event=>{strategy.prizeCatch=event.target.checked;write('ocean:strategy',JSON.stringify(strategy));renderFishing();});
      $('strategyObjective').addEventListener('change',event=>{strategy.objective=event.target.value;write('ocean:strategy',JSON.stringify(strategy));renderFishing();});
      $('scheduleToggle').addEventListener('click',()=>{expanded=!expanded;renderSchedule();});
      $('moreVoyages').addEventListener('click',()=>{scheduleCount=Math.min(144,scheduleCount+12);refreshVoyages();renderSchedule();});
      $('hideCompleted').addEventListener('change',event=>{hideCompleted=event.target.checked;write('ocean:hide-completed-routes',String(hideCompleted));renderSchedule();});
      $('scheduleRows').addEventListener('click',event=>{const button=event.target.closest('tr')?.querySelector('[data-voyage]');if(!button)return;selected=voyages.find(v=>v.start===Number(button.dataset.voyage));activeStop=0;renderSchedule();renderFishing();});
      $('returnFirst').addEventListener('click',()=>{selected=voyages[0];activeStop=0;renderSchedule();renderFishing();});
      $('stopTabs').addEventListener('click',event=>{const button=event.target.closest('[data-stop]');if(!button)return;activeStop=Number(button.dataset.stop);renderFishing();$('stopTab'+activeStop).focus();});
      $('stopTabs').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();activeStop=event.key==='Home'?0:event.key==='End'?2:(activeStop+(event.key==='ArrowRight'?1:2))%3;renderFishing();$('stopTab'+activeStop).focus();});
      timer=setInterval(()=>{const first=voyages[0].start;refreshVoyages();renderSchedule();if(first!==voyages[0].start)renderFishing();},30000);
    }
  }
  async function start() {
    try {
      if(!window.FishingCollection)throw Error('수집 기록 연동 프로그램을 불러오지 못했습니다.');
      const suffix='?v='+encodeURIComponent(document.body.dataset.version);
      const [response,achievementResponse]=await Promise.all([fetch('../data/fish.json'+suffix),isChecklist?Promise.resolve(null):fetch('../data/achievements.json'+suffix)]);if(!response.ok)throw Error('자료 응답 '+response.status);
      const payload=await response.json();if(payload.version!==1||!Array.isArray(payload.fish)||payload.fish.length!==260)throw Error('자료 형식 오류');
      fish=payload.fish;names=new Map(fish.map(f=>[C.key(f.Fish),f.FishTranslated]));state=checkState();loadPreferences();
      if(!isChecklist){if(!achievementResponse.ok)throw Error('업적 자료 응답 '+achievementResponse.status);achievements=A.create(await achievementResponse.json(),fish);}
      if(!isChecklist){refreshVoyages();renderOptions();}
      bind();render();$('loading').hidden=true;$('appContent').hidden=false;
    } catch(error) {$('loading').textContent='자료를 불러오지 못했어요. 저장한 수집 기록은 유지됩니다.';$('retryLoad').hidden=false;console.error('Journal initialization failed',error);}
  }
  $('retryLoad').addEventListener('click',()=>location.reload());
  start();
})();
