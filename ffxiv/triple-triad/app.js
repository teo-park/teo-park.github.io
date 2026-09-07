(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const data = window.TRIPLE_TRIAD_DATA, T = window.Triad;
  const STORAGE_KEY = 'teo-ffxiv.triple-triad.collection.v1';
  const PAGE_SIZE = 30;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  function fatal(message) { $('fatal').textContent = message; $('fatal').hidden = !message; }
  if (!data?.cards?.length || !T) { fatal('카드 자료를 불러오지 못했어요. 페이지를 새로고침해 주세요.'); return; }
  const byId = new Map(data.cards.map(c => [c.id, c]));
  const npcs = new Map(data.cards.flatMap(c => c.sources.filter(s => s.npc).map(s => [s.npc.id, s.npc])));
  let owned = new Set(), page = 1, selectedId = data.cards[0].id, filtered = [], currentView = 'collection';
  let importIds = null, toastTimer, result = null, requestVersion = 0;
  function readStored() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? new Set() : T.parseBackup(raw);
  }
  try { owned = readStored(); }
  catch { fatal('저장된 기록을 읽을 수 없어요. 브라우저의 저장 권한을 확인하거나 백업 파일을 가져와 주세요. 기존 기록을 덮어쓰지 않았어요.'); }
  function save(ids) {
    try { localStorage.setItem(STORAGE_KEY, T.backup(ids)); owned = ids; fatal(''); return true; }
    catch { fatal('수집 기록을 저장하지 못했어요. 브라우저의 저장 공간·권한을 확인해 주세요. 마지막으로 저장된 체크 상태를 유지합니다.'); return false; }
  }
  function toast(message) {
    clearTimeout(toastTimer); $('toast').textContent = message; $('toast').hidden = false;
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 3500);
  }
  function link(url, label, className = 'text-link') {
    try { if (new URL(url).protocol !== 'https:') return esc(label); } catch { return esc(label); }
    return `<a class="${className}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
  }
  const value = n => n === 10 ? 'A' : n;
  function stats(card) {
    return `<span class="stat-cross" role="img" aria-label="위 ${value(card.stats.top)}, 오른쪽 ${value(card.stats.right)}, 아래 ${value(card.stats.bottom)}, 왼쪽 ${value(card.stats.left)}">${T.SIDES.map(side => `<b class="stat-${side}" aria-hidden="true">${value(card.stats[side])}</b>`).join('')}</span>`;
  }
  function art(card) { return `<img class="card-art" src="${esc(card.image)}" alt="" width="76" height="100" loading="lazy" decoding="async" />`; }
  function stars(card) { return `<span class="stars" aria-label="별 ${card.stars}개">${'★'.repeat(card.stars)}</span>`; }
  function updateProgress() {
    const known = data.cards.filter(c => owned.has(c.id)), normal = data.cards.filter(c => !c.ex), ex = data.cards.filter(c => c.ex);
    $('ownedCount').textContent = known.length.toLocaleString(); $('totalCount').textContent = ` / ${data.count}장`;
    $('ownedPercent').textContent = `${(known.length / data.count * 100).toFixed(1)}%`;
    $('collectionProgress').max = data.count; $('collectionProgress').value = known.length;
    $('normalCount').textContent = `${known.filter(c => !c.ex).length} / ${normal.length}`;
    $('exCount').textContent = `${known.filter(c => c.ex).length} / ${ex.length}`;
  }
  function tile(card) {
    const collected = owned.has(card.id), groups = [...new Set(card.sources.map(s => data.groups.find(([id]) => id === s.group)?.[1] || s.typeName))];
    return `<article class="collect-card${collected ? ' is-owned' : ''}${selectedId === card.id ? ' selected' : ''}"><button class="card-open" data-open="${card.id}" aria-label="${esc(card.number + ' ' + card.name)} 획득처 보기" aria-pressed="${selectedId === card.id}"><span class="card-topline"><span>${esc(card.number)}</span>${stars(card)}</span><span class="card-visual">${art(card)}${stats(card)}</span><strong class="card-name">${esc(card.name)}</strong><span class="card-source">${esc(groups.slice(0, 2).join(' · '))}${groups.length > 2 ? ' 외' : ''} · ${card.sources.length}곳</span></button><label class="collect-check"><input type="checkbox" data-owned="${card.id}" aria-label="${esc(card.name)} 수집 완료" ${collected ? 'checked' : ''} /><span>${collected ? '수집 완료' : '수집 체크'}</span></label></article>`;
  }
  function sourceHtml(source) {
    const npc = source.npc;
    return `<section class="source-entry"><span class="badge">${esc(source.typeName)}</span><h4>${esc(source.name)}</h4><p>${esc(source.method)}</p>${source.location ? `<p class="source-location">${esc(source.location)}${npc?.x && npc?.y ? ` · X:${esc(npc.x)} Y:${esc(npc.y)}` : ''}</p>` : ''}${source.pack ? `<p>${source.pack.cost ? `${Number(source.pack.cost).toLocaleString()} MGP로 카드팩 구매` : '대회 보상으로 얻는 카드팩'}</p>` : ''}${npc?.quest ? `<p class="condition"><strong>선행 퀘스트</strong><br />${link('https://guide.ff14.co.kr/lodestone/search?keyword=' + encodeURIComponent(npc.quest.name), npc.quest.name)}</p>` : ''}${npc?.rules.length ? `<p class="muted">대결 규칙 · ${esc(npc.rules.join(' / '))}</p><button data-npc="${npc.id}">이 NPC 규칙으로 덱 추천</button>` : ''}${link(source.link, source.linkLabel || (npc ? 'NPC 정보 · FFXIV Collect' : '획득 정보 · FFXIV Collect'))}</section>`;
  }
  function detailHtml(card) {
    return `<div class="detail-hero">${art(card)}<div><p class="muted">${esc(card.number)} · 패치 ${esc(card.patch)}</p><h2>${esc(card.name)}</h2><p>${stars(card)} <span class="muted">· ${esc(card.type)}</span></p>${stats(card)}</div></div><label class="detail-check"><input type="checkbox" data-owned="${card.id}" aria-label="${esc(card.name)} 수집 완료" ${owned.has(card.id) ? 'checked' : ''} />${owned.has(card.id) ? '수집한 카드예요' : '이 카드를 수집했어요'}</label><div class="detail-links">${link(card.official, card.officialExact ? '한국 공식 가이드' : '한국 공식 가이드 검색')}${link(card.link, 'FFXIV Collect')}</div><h3 class="sources-heading">어디서 얻나요? <span class="muted">${card.sources.length}곳</span></h3>${card.sources.map(sourceHtml).join('')}`;
  }
  function renderDetail() {
    const card = byId.get(selectedId);
    $('cardDetail').innerHTML = card ? detailHtml(card) : '<p class="muted">카드를 선택하면 획득 방법을 볼 수 있어요.</p>';
    if ($('detailDialog').open && card) $('dialogBody').innerHTML = detailHtml(card);
  }
  function renderCollection() {
    const q = $('search').value, state = $('ownedFilter').value, source = $('sourceFilter').value, rarity = $('starFilter').value, type = $('typeFilter').value;
    filtered = data.cards.filter(c => T.matches(c, q) && (state === 'all' || owned.has(c.id) === (state === 'owned')) && (source === 'all' || c.sources.some(s => s.group === source)) && (rarity === 'all' || c.stars === Number(rarity)) && (type === 'all' || c.typeId === Number(type)));
    const sort = $('sortFilter').value;
    filtered.sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name, 'ko') : sort === 'stars' ? b.stars - a.stars : sort === 'newest' ? b.patch.localeCompare(a.patch, undefined, {numeric: true}) : 0) || Number(a.ex) - Number(b.ex) || a.order - b.order);
    const gamePages = sort === 'number' && !q.trim() && [state, source, rarity, type].every(value => value === 'all');
    const groups = gamePages ? [filtered.filter(c => !c.ex), filtered.filter(c => c.ex)] : [filtered];
    const pageSets = groups.flatMap((cards, group) => Array.from({length: Math.ceil(cards.length / PAGE_SIZE)}, (_, index) => ({cards: cards.slice(index * PAGE_SIZE, (index + 1) * PAGE_SIZE), label: gamePages ? `${group ? 'EX' : '일반'} ${index + 1} / ${Math.ceil(cards.length / PAGE_SIZE)}` : ''})));
    const pages = Math.max(1, pageSets.length); page = Math.min(Math.max(1, page), pages);
    if (!filtered.some(c => c.id === selectedId) && !$('detailDialog').open) selectedId = filtered[0]?.id;
    $('cardGrid').innerHTML = (pageSets[page - 1]?.cards || []).map(tile).join('');
    $('emptyResults').hidden = filtered.length > 0;
    $('resultCount').textContent = `${filtered.length}장 표시 · 이 중 ${filtered.filter(c => owned.has(c.id)).length}장 수집`;
    $('clearSearch').hidden = !q;
    $('pagination').innerHTML = pages > 1 ? `<button data-page="${page - 1}" ${page === 1 ? 'disabled' : ''} aria-label="이전 페이지">← 이전</button><span>${pageSets[page - 1]?.label || `${page} / ${pages}`}</span><button data-page="${page + 1}" ${page === pages ? 'disabled' : ''} aria-label="다음 페이지">다음 →</button>` : '';
    renderDetail();
  }
  function invalidateDeck(message = '규칙이나 수집 목록이 바뀌었어요. 다시 추천하면 현재 상태를 반영해요.') {
    requestVersion++;
    $('recommendButton').disabled = false;
    $('recommendButton').textContent = $('allCards').checked ? '전체 카드로 목표 덱 추천' : '내 카드로 덱 추천';
    if (result) { $('deckResult').className = 'panel deck-placeholder'; $('deckResult').innerHTML = `<h3>새 조건으로 덱을 골라볼까요?</h3><p class="muted">${esc(message)}</p>`; result = null; }
  }
  function resetFilters() {
    $('search').value = ''; ['ownedFilter', 'sourceFilter', 'starFilter', 'typeFilter'].forEach(id => { $(id).value = 'all'; });
    $('sortFilter').value = 'number'; page = 1; renderCollection();
  }
  function setView(view, focus = false) {
    currentView = view;
    for (const id of ['collection', 'deck']) {
      $(id + 'View').hidden = view !== id;
      $(id + 'Tab').setAttribute('aria-selected', String(view === id));
      $(id + 'Tab').tabIndex = view === id ? 0 : -1;
    }
    if (focus) $(view + 'Tab').focus();
  }
  const ruleIds = () => [...document.querySelectorAll('#ruleOptions input:checked')].map(el => Number(el.value));
  function renderTips() {
    const rules = T.RULES.filter(r => ruleIds().includes(r.id));
    $('ruleTips').hidden = !rules.length;
    $('ruleTips').innerHTML = `<h3>선택한 규칙의 활용법</h3>${rules.map(r => `<p><strong>${esc(r.name)}</strong> · ${esc(r.tip)}</p>`).join('')}`;
  }
  function applyRules(ids) {
    document.querySelectorAll('#ruleOptions input').forEach(el => { el.checked = ids.includes(Number(el.value)); });
    invalidateDeck(); renderTips();
  }
  function showResult(recommendation) {
    result = recommendation;
    $('deckResult').className = 'panel ' + (result.error ? 'deck-placeholder' : 'deck-result');
    if (result.error) { $('deckResult').innerHTML = `<h3>${result.unavailable ? '이 규칙은 현장에서 준비해요' : '덱을 구성하려면'}</h3><p role="status">${esc(result.error)}</p>`; return; }
    const missing = result.deck.filter(c => !owned.has(c.id)).length;
    $('deckResult').innerHTML = `<div class="deck-summary"><h3>${result.allCards ? '모아볼 목표 덱' : '내 카드로 만든 추천 덱'}</h3><p>${result.candidateCount}장 중 5장 · 편성 제한 충족${result.allCards ? ` · 미수집 ${missing}장` : ''}<br />${result.rules.includes(8) ? '초반 모서리 배치용 카드를 앞에 둔 순서예요. 게임의 덱 순서도 확인하세요.' : '아래 순서는 낼 순서를 뜻하지 않아요. 실제 판에 맞춰 사용하세요.'}</p></div><div class="recommended-cards">${result.deck.map((card, i) => `<article class="recommended-card"><button class="card-open" data-open="${card.id}" aria-label="${esc(card.name)} 획득처 보기"><span class="card-topline">${result.rules.includes(8) ? (i + 1) + '번째 · ' : ''}${esc(card.number)}</span>${art(card)}${stats(card)}<strong class="card-name">${esc(card.name)}</strong>${stars(card)}<br /><span class="badge">${owned.has(card.id) ? '보유' : '미수집'}</span></button></article>`).join('')}</div><ol class="recommend-reasons">${result.details.map(d => `<li><strong>${esc(byId.get(d.id).name)}</strong><p>${d.reason.map(esc).join('<br />')}</p></li>`).join('')}</ol><p class="small muted">현재 판과 상대의 실제 패에 따라 좋은 선택은 달라져요. 카드를 누르면 획득처를 볼 수 있어요.</p>`;
  }
  $('sourceFilter').insertAdjacentHTML('beforeend', data.groups.map(([id, name]) => `<option value="${esc(id)}">${esc(name)}</option>`).join(''));
  $('ruleOptions').insertAdjacentHTML('beforeend', T.RULES.map(r => `<label title="${esc(r.tip)}"><input type="checkbox" value="${r.id}" />${esc(r.name)}</label>`).join(''));
  $('dataNote').textContent = `자료 확인 ${data.updatedAt} · FFXIV Collect 카드 ${data.count}종 / NPC ${data.npcCount}명 · 한국 공식 카드 페이지 ${data.officialCount}종 연결. 공식 페이지를 찾지 못한 카드는 공식 검색으로 연결해요. 한국 서버의 현재 획득 가능 여부는 공식 가이드에서 확인해 주세요.`;
  // Read the live DOM value on every input, including an active Korean IME
  // composition. Waiting for compositionend would omit the last consonant.
  $('search').addEventListener('input', () => { page = 1; renderCollection(); });
  $('search').addEventListener('compositionend', () => { page = 1; renderCollection(); });
  $('clearSearch').addEventListener('click', () => { $('search').value = ''; page = 1; renderCollection(); $('search').focus(); });
  ['ownedFilter', 'sourceFilter', 'starFilter', 'typeFilter', 'sortFilter'].forEach(id => $(id).addEventListener('change', () => { page = 1; renderCollection(); }));
  ['resetFilters', 'emptyReset'].forEach(id => $(id).addEventListener('click', resetFilters));
  document.addEventListener('click', event => {
    const open = event.target.closest('[data-open]');
    if (open) {
      selectedId = Number(open.dataset.open); renderDetail();
      document.querySelectorAll('#cardGrid .collect-card').forEach(card => { const active = Number(card.querySelector('[data-open]').dataset.open) === selectedId; card.classList.toggle('selected', active); card.querySelector('[data-open]').setAttribute('aria-pressed', String(active)); });
      if (currentView === 'deck' || window.matchMedia('(max-width: 1150px)').matches) { $('dialogBody').innerHTML = detailHtml(byId.get(selectedId)); if (!$('detailDialog').open) $('detailDialog').showModal(); }
    }
    const next = event.target.closest('[data-page]');
    if (next && !next.disabled) { page = Number(next.dataset.page); renderCollection(); $('cardGrid').scrollIntoView({block: 'start'}); $('cardGrid').querySelector('button')?.focus({preventScroll: true}); }
    const npcButton = event.target.closest('[data-npc]');
    if (npcButton) {
      const npc = npcs.get(Number(npcButton.dataset.npc)); applyRules([...new Set(npc.ruleIds)]);
      $('npcRuleContext').textContent = `${npc.name} · 고정 대결 규칙을 가져왔어요. 게임에 표시되는 지역 규칙이 있다면 추가해 주세요.`; $('npcRuleContext').hidden = false;
      if ($('detailDialog').open) $('detailDialog').close(); setView('deck', true); $('deckTab').scrollIntoView({block: 'start'});
    }
    const preset = event.target.closest('[data-preset]');
    if (preset) { applyRules(preset.dataset.preset ? preset.dataset.preset.split(',').map(Number) : []); $('npcRuleContext').hidden = true; }
  });
  document.addEventListener('change', event => {
    const input = event.target.closest('[data-owned]');
    if (!input) return;
    const id = Number(input.dataset.owned), checked = input.checked, inDialog = !!input.closest('dialog'), inDetail = !!input.closest('#cardDetail');
    try {
      const next = readStored(); if (checked) next.add(id); else next.delete(id);
      if (!save(next)) { input.checked = owned.has(id); return; }
    } catch { input.checked = owned.has(id); fatal('저장된 기록을 읽을 수 없어 체크를 저장하지 않았어요. 수집 기록 관리에서 백업 파일을 가져와 복구할 수 있어요.'); return; }
    updateProgress(); renderCollection(); invalidateDeck();
    const container = inDialog ? $('dialogBody') : inDetail ? $('cardDetail') : $('cardGrid');
    (container.querySelector(`[data-owned="${id}"]`) || container.querySelector('[data-owned]'))?.focus({preventScroll: true});
    toast(`${byId.get(id).name} · ${checked ? '수집 완료' : '수집 해제'}`);
  });
  for (const view of ['collection', 'deck']) {
    $(view + 'Tab').addEventListener('click', () => setView(view));
    $(view + 'Tab').addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); setView(event.key === 'Home' ? 'collection' : event.key === 'End' ? 'deck' : view === 'collection' ? 'deck' : 'collection', true); } });
  }
  $('ruleOptions').addEventListener('change', event => {
    if (ruleIds().length > 4) { event.target.checked = false; toast('규칙은 최대 4개까지 선택할 수 있어요.'); }
    invalidateDeck(); renderTips();
  });
  $('allCards').addEventListener('change', () => {
    invalidateDeck(); document.querySelector('.deck-output > .list-heading > span').textContent = $('allCards').checked ? '전체 카드 기준 · 목표 덱' : '보유 카드 기준';
  });
  $('recommendButton').addEventListener('click', () => {
    const version = ++requestVersion, rules = ruleIds(), all = $('allCards').checked;
    $('recommendButton').disabled = true; $('recommendButton').textContent = '다섯 장을 고르고 있어요…';
    setTimeout(() => {
      if (version !== requestVersion) return;
      try { showResult(T.recommend(data.cards, owned, rules, all)); }
      catch { showResult({error: '추천을 계산하지 못했어요. 조건을 바꿔 다시 시도해 주세요.'}); }
      $('recommendButton').disabled = false; $('recommendButton').textContent = all ? '전체 카드로 목표 덱 추천' : '내 카드로 덱 추천';
      $('deckResult').tabIndex = -1;
      $('deckResult').focus({preventScroll: true});
      $('deckResult').scrollIntoView({block: 'start'});
    }, 30);
  });
  $('backupToggle').addEventListener('click', () => { const open = $('backupPanel').hidden; $('backupPanel').hidden = !open; $('backupToggle').setAttribute('aria-expanded', String(open)); });
  $('exportButton').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([T.backup(owned)], {type: 'application/json'}));
    const a = document.createElement('a'); a.href = url; a.download = `ffxiv-triple-triad-${new Date().toISOString().slice(0, 10)}.json`; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('backupMessage').textContent = '수집 기록 파일을 내보냈어요. 브라우저의 다운로드 목록에서 확인하세요.';
  });
  $('importFile').addEventListener('change', async event => {
    const file = event.target.files[0]; if (!file) return;
    importIds = null; $('importPreview').hidden = true;
    try {
      if (file.size > 1000000) throw Error('파일이 너무 커요. 이 도구에서 내보낸 JSON 파일을 선택해 주세요.');
      importIds = T.parseBackup(await file.text());
      const known = [...importIds].filter(id => byId.has(id)), unknown = importIds.size - known.length;
      $('importSummary').textContent = `${known.length}장의 수집 기록을 가져올 준비가 됐어요.${unknown ? ` 현재 목록에 없는 ${unknown}개의 기록도 다음 자료 갱신을 위해 보관해요.` : ''}`;
      $('backupMessage').textContent = ''; $('importPreview').hidden = false;
    } catch (error) { $('backupMessage').textContent = error.message; }
    event.target.value = '';
  });
  $('cancelImport').addEventListener('click', () => { importIds = null; $('importPreview').hidden = true; });
  $('applyImport').addEventListener('click', () => {
    if (!importIds) return;
    try {
      const replace = document.querySelector('[name="importMode"]:checked').value === 'replace';
      const ids = new Set([...(replace ? [] : readStored()), ...importIds]);
      if (!save(ids)) return;
      $('importPreview').hidden = true; importIds = null; updateProgress(); renderCollection(); invalidateDeck();
      $('backupMessage').textContent = '수집 기록을 가져와 저장했어요.';
    } catch { $('backupMessage').textContent = '기존 기록을 읽을 수 없어요. 복구하려면 ‘파일의 기록으로 교체’를 선택해 주세요.'; }
  });
  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    try { owned = readStored(); fatal(''); updateProgress(); renderCollection(); invalidateDeck(); }
    catch { fatal('다른 탭의 수집 기록을 읽을 수 없어요. 현재 표시 중인 기록은 유지했어요.'); }
  });
  window.TriadScanUI?.mount({cards: data.cards, apply: ({ownedIds, seenIds, replacePages}) => {
    if (!Array.isArray(ownedIds) || !Array.isArray(seenIds) || [...ownedIds, ...seenIds].some(id => !byId.has(id)) || ownedIds.some(id => !seenIds.includes(id))) return {ok: false, error: '인식한 카드 번호를 확인해 주세요.'};
    try {
      const next = readStored();
      if (replacePages) seenIds.forEach(id => next.delete(id));
      ownedIds.forEach(id => next.add(id));
      if (!save(next)) return {ok: false, error: '브라우저 저장 공간·권한을 확인해 주세요. 기존 수집 기록은 유지했어요.'};
      updateProgress(); renderCollection(); invalidateDeck();
      toast(`캡처에서 확인한 보유 카드 ${ownedIds.length}장을 반영했어요.`);
      return {ok: true};
    } catch { return {ok: false, error: '기존 기록을 읽을 수 없어요. 백업 파일로 복구한 뒤 다시 시도해 주세요.'}; }
  }});
  updateProgress(); renderCollection();
})();
