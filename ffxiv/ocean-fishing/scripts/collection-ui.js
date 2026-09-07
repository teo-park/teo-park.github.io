(() => {
  'use strict';
  const route = location.pathname.includes('/ruby') ? 'ruby' : 'indigo';
  const api = window.OceanCollection;
  let state = api.read(localStorage);
  let hide = true;
  try { hide = localStorage.getItem('ocean:hide-caught') !== 'false'; } catch {}
  let species = [];
  try {
    const saved = localStorage.getItem('ocean:species-groups:' + route);
    const legacy = localStorage.getItem('ocean:species:' + route);
    const selected = saved === null ? (legacy ? [legacy] : []) : JSON.parse(saved);
    if (Array.isArray(selected)) species = [...new Set(selected.filter(value => typeof value === 'string'))];
  } catch {}
  let scoreMode = '';
  try { scoreMode = localStorage.getItem('ocean:score:' + route) || ''; } catch {}
  if (!['DH', 'TH'].includes(scoreMode)) scoreMode = '';
  let purpose = '';
  try { purpose = localStorage.getItem('ocean:purpose:' + route) || ''; } catch {}
  if (!['all','collection','mission','score'].includes(purpose)) purpose = scoreMode ? 'score' : species.length ? 'mission' : hide ? 'collection' : 'all';
  if (!scoreMode) scoreMode = 'TH';
  let strategy = { gp: 700, objective: 'efficiency' };
  try {
    const saved = JSON.parse(localStorage.getItem('ocean:strategy') || '{}');
    if (Number.isInteger(saved.gp) && saved.gp >= 0 && saved.gp <= 9999) strategy.gp = saved.gp;
    if (['efficiency', 'burst'].includes(saved.objective)) strategy.objective = saved.objective;
  } catch {}
  let detailed = false;
  try { detailed = localStorage.getItem('ocean:table-details') === 'true'; } catch {}
  const tableVisibility = new WeakMap();
  let groupsReady = false;
  let catalog = new Map();
  const achievementCache = new Map();
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const originalDisplay = window.displayStops;
  const originalHideCompletedRoutes = window.getHideCompletedRoutesEnabled;
  window.getHideCompletedRoutesEnabled = () => purpose === 'collection' && originalHideCompletedRoutes();
  window.isFishCaught = fish => api.caught(state, route, fish);
  window.displayStops = function(color, number, data) {
    state = api.read(localStorage);
    // Original table rendering mutates rows; always rebuild from untouched source data.
    const fresh = JSON.parse(JSON.stringify(cleanedDataObjBK.length ? cleanedDataObjBK : data));
    prepareGroups(fresh);
    originalDisplay(color, number, fresh);
    updateViewingRoute();
    applyTableDetails(true);
    updateStatus();
  };
  function prepareGroups(fresh) {
    catalog = api.createCatalog(fresh);
    if (!groupsReady) {
      const choices = document.getElementById('speciesFilter');
      const groups = new Map(fresh.filter(row => row.Species).map(row => [row.Species, row.SpeciesTranslated || row.Species]));
      for (const [value, label] of [...groups].sort((a, b) => a[1].localeCompare(b[1], 'ko'))) {
        const option = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox'; input.className = 'species-check'; input.value = value;
        const text = document.createElement('span'); text.textContent = label;
        option.append(input, text); choices.append(option);
      }
      species = species.filter(value => groups.has(value));
      groupsReady = true;
    }
    syncGroupControls();
    updateStatus();
  }
  // Initialize controls even when all completed voyages are hidden at startup.
  for (const color of ['Indigo', 'Ruby']) {
    const handler = window['sheetDataHandler' + color];
    window['sheetDataHandler' + color] = function(data) {
      achievementCache.clear();
      handler(data);
      prepareGroups(cleanedDataObjBK);
    };
  }
  window.filterCollectionStop = rows => api.plan(rows, catalog, fish => api.caught(state, route, fish), purpose === 'collection', purpose === 'mission' ? species : '', purpose === 'score' ? scoreMode : '', strategy).map(row => {
    const bait = api.baitInfo(row);
    return {...row, LocalBestBite: bait.rawTime, LocalAnyBait: bait.any};
  });
  const note = (className, label, body) => '<details class="fish-note ' + className + '"><summary>' + label + '</summary><span>' + escape(body) + '</span></details>';
  const format = value => Number(value).toLocaleString('ko-KR', { maximumFractionDigits: 1 });
  const range = value => format(value.min) + (value.min === value.max ? '' : '–' + format(value.max));
  const actionName = action => action === 'DH' ? '이중' : '삼중';
  function optionText(option) {
    return `${actionName(option.action)} ${option.cost}GP → ${range(option.total)}점 · 일반 대비 +${range(option.extra)}점 · 100GP당 +${format(option.efficiency)}점`;
  }
  function targetText(hints) {
    const time = api.biteTimeText(hints.rawTime);
    const overlap = hints.overlaps.length ? `같은 미끼·입질·시간 구간이 겹치는 물고기 ${hints.overlaps.length}종: ${hints.overlaps.join(', ')}` : hints.unknown ? '입질 구분 자료 부족' : '표의 알려진 입질 구간에서 겹침 없음';
    return `${hints.label || '미끼 자료 없음'} · ${hints.bite || '입질 자료 없음'} · ${time}. ${overlap}.`;
  }
  function recommendationText(entry) {
    return (entry.best ? optionText(entry.best) + '. ' : entry.reason + '. ')
      + entry.options.filter(option => option !== entry.best).map(option => optionText(option) + (option.affordable ? '' : ' (GP 부족)')).join('. ')
      + (entry.conditional ? ' ' + entry.hints.conditions.join('·') + ' 조건 충족 시에만 유효해요.' : '')
      + ' ' + targetText(entry.hints) + ' 효율은 자료의 최소 수량 기준이며 입질 확률을 뜻하지 않아요.';
  }
  window.collectionControl = (fish, row) => {
    const required = row.LocalRequiredBy || [], score = row.LocalScore, rec = row.LocalRecommendation;
    const scoreText = score ? (scoreMode === 'DH' ? '이중 ' : '삼중 ') + score.min + (score.max !== score.min ? '–' + score.max : '') + '점. 기본 점수 × 낚는 수 기준이에요.' : '';
    return '<div class="collection-control' + (purpose === 'score' ? ' score-comparison-fish' : '') + '"><label><input type="checkbox" class="collection-check" data-fish="' + escape(api.name(fish)) + '" ' + (row.LocalCaught ? 'checked' : '') + ' aria-label="' + escape(api.name(row.FishTranslated || fish)) + ' 잡음"><span>잡음</span></label>'
      + (rec ? note(rec.rank && rec.rank <= 3 ? 'score-target-fish' : 'gp-fish-note',
        rec.best ? (rec.conditional ? '조건부 ' : '') + (rec.rank <= 3 ? rec.rank + '순위 · ' : '') + actionName(rec.best.action) : rec.reason,
        recommendationText(rec)) : score ? note('score-target-fish','고득점',scoreText) : '')
      + (row.LocalGroupMatch ? '<span class="group-target-fish">대상</span>' : '')
      + (row.LocalAlwaysVisible ? note('always-visible-fish','유령','미끼 확인용으로 잡았어도 항상 표시해요.') : '')
      + (row.DataNotes ? note('data-fish-note','참고',row.DataNotes) : '')
      + (required.length && (row.LocalCaught || row.LocalGroupDependency) ? note('condition-fish','조건용',required.join(', ') + '의 직감·생미끼 조건이에요.') : '') + '</div>';
  };
  function achievementsFor(number) {
    if (!cleanedDataObjBK.length) return [];
    const id = Number(number);
    if (!achievementCache.has(id)) achievementCache.set(id, api.routeAchievements(cleanedDataObjBK, getRouteStopConfig(route, id)));
    return achievementCache.get(id);
  }
  function achievementText(groups) {
    return '업적작 가능 (' + groups.map(group => group.label + (group.requiresSpectral ? '*' : '')).join('·') + ')';
  }
  function achievementDescription(groups) {
    return groups.map(group => group.label + ': ' + group.stops.map((stop, index) => `${index + 1}구간 ${stop.regular ? '일반' + (stop.spectral ? '·환해류' : '') : '환해류 필요'}`).join(' / ')).join('\n')
      + '\n세 구간 등장 기준이에요. 날씨·환해류·업적 목표 마릿수 조건은 별도로 충족해야 해요.';
  }
  window.decorateRouteAchievements = () => {
    document.querySelectorAll('#boatSchedule .stopsRow').forEach(row => {
      row.querySelector('.route-achievement')?.remove();
      const groups = achievementsFor(row.dataset.route);
      if (!groups.length) return;
      const badge = document.createElement('span'); badge.className = 'route-achievement';
      badge.textContent = achievementText(groups); badge.title = achievementDescription(groups); badge.tabIndex = 0;
      badge.setAttribute('aria-label', badge.textContent + '. ' + badge.title);
      row.cells[4]?.append(badge);
    });
    updateViewingRoute();
  };
  function updateViewingRoute() {
    const selected = document.querySelector('#boatSchedule .stopsRow.activeRow');
    const first = document.querySelector('#boatSchedule .stopsRow');
    const text = document.getElementById('viewingRoute');
    text.textContent = selected ? selected.cells[0].textContent.trim() + ' 출항' : '표시할 항로가 없어요.';
    document.getElementById('viewingStops').textContent = selected ? [1,2,3].map(i => document.getElementById('dest' + i + 'Label').textContent.trim()).join(' → ') : '';
    document.getElementById('returnFirstRoute').hidden = !selected || selected === first;
    const badge = document.getElementById('viewingAchievements');
    if (badge) {
      const groups = selected ? achievementsFor(selected.dataset.route) : [];
      badge.hidden = !groups.length;
      badge.textContent = groups.length ? achievementText(groups) : '';
      badge.title = groups.length ? achievementDescription(groups) : '';
      badge.setAttribute('aria-label', badge.textContent + '. ' + badge.title);
    }
  }
  function applyTableDetails(fresh = false) {
    document.body.classList.toggle('table-details', detailed);
    if (purpose !== 'score') document.querySelectorAll('.gp-recommendation').forEach(el => el.remove());
    document.querySelectorAll('table[id^="desttable"]').forEach(node => {
      if (!$.fn.dataTable.isDataTable(node)) return;
      const table = $(node).DataTable();
      if (fresh || !tableVisibility.has(node)) tableVisibility.set(node, table.columns().visible().toArray());
      const saved = tableVisibility.get(node);
      table.columns().every(function(index) {
        const src = this.dataSrc();
        const data = typeof src === 'string' ? src : src?._;
        const scoreColumn = purpose === 'score' && ['Points', 'DH.0', 'TH.0'].includes(data);
        const compact = index < 3 || scoreColumn;
        this.header()?.classList.remove('score-emphasis');
        this.nodes().toArray().forEach(cell => {
          const index = table.cell(cell).index();
          const rec = index ? table.row(index.row).data()?.LocalRecommendation : null;
          const emphasize = purpose === 'score' && rec?.best?.action + '.0' === data;
          cell.classList.toggle('score-emphasis', emphasize);
        });
        this.visible(detailed ? saved[index] || scoreColumn : compact, false);
      });
      table.rows().every(function() {
        const row = this.data(), cell = table.cell(this.index(),2).node();
        cell?.querySelector('.best-bite-time')?.remove();
        cell?.querySelector('.bait-name')?.remove();
        const baitNames = [...new Set([...cell.querySelectorAll('img[alt]')].map(img => img.alt.trim()).filter(Boolean))];
        if (baitNames.length) {
          const label = document.createElement('span'); label.className = 'bait-name';
          label.textContent = baitNames.join(' / '); cell.append(label);
        }
        if (!detailed) {
          const hint = document.createElement('small'); hint.className = 'best-bite-time';
          hint.textContent = (row.LocalAnyBait ? '기본 미끼 3종 · ' : '입질 ') + api.biteTimeText(row.LocalBestBite); cell.append(hint);
        }
      });
      table.columns.adjust();
      if (purpose === 'score') renderRecommendation(node, table);
    });
  }
  function renderRecommendation(node, table) {
    let panel = document.getElementById('gp-summary-' + node.id);
    if (!panel) {
      panel = document.createElement('aside'); panel.id = 'gp-summary-' + node.id; panel.className = 'gp-recommendation';
      const wrapper = node.closest('.dt-container') || node;
      wrapper.before(panel);
    }
    const expanded = panel.querySelector('details')?.open || false;
    const entries = table.rows().data().toArray().map(row => row.LocalRecommendation).filter(Boolean);
    const candidates = conditional => entries.filter(entry => entry.conditional === conditional && entry.best && entry.rank <= 3).sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label, 'ko'));
    const direct = candidates(false), conditional = candidates(true), first = direct[0];
    const heading = strategy.objective === 'burst' ? '한 번 점수 우선' : 'GP 효율 우선';
    const summary = first ? `${first.label} · ${optionText(first.best)}` : strategy.gp < 400 ? '400GP 미만 · 일반 낚아채기로 GP를 보존하세요.' : conditional.length ? '직감·생미끼 조건 없는 추천 후보가 없어요. 조건부 후보를 확인하세요.' : '현재 GP·사용 기술·수량 자료로 추천할 후보가 없어요.';
    const list = values => values.map(entry => '<li><strong>' + escape(`${entry.rank}순위 ${entry.label} · ${actionName(entry.best.action)}`) + '</strong><span>' + escape(optionText(entry.best)) + '</span><small>' + escape((entry.conditional ? entry.hints.conditions.join('·') + ' 조건 충족 시. ' : '') + targetText(entry.hints)) + '</small></li>').join('');
    panel.innerHTML = '<p><strong>' + heading + '</strong> · ' + escape(summary) + '</p><details' + (expanded ? ' open' : '') + '><summary>추천 근거·조건부 후보 보기</summary>'
      + (direct.length ? '<p>직감·생미끼 조건 없는 후보 · 상위 3순위, 동점 포함</p><ol>' + list(direct) + '</ol>' : '')
      + (conditional.length ? '<p>조건부 후보 · 직감·생미끼 준비 비용은 계산하지 않아요</p><ol>' + list(conditional) + '</ol>' : '')
      + '<p>이 표 안에서 비교하며 다른 구간에 쓸 GP는 배분하지 않아요. 미끼·입질 정보는 저격 참고용이며 확정 판별이 아니에요. 날씨 조건은 상세 정보에서 확인하세요.</p></details>';
  }
  function updateStatus(message) {
    const total = catalog.size;
    const count = [...catalog.values()].filter(fish => api.caught(state, route, fish.name)).length;
    document.getElementById('collectionStatus').textContent = message || `${route === 'indigo' ? '근해' : '원양'} ${count} / ${total}종 잡음 · 이 브라우저에 저장`;
  }
  function syncGroupControls() {
    document.querySelectorAll('[name="fishingPurpose"]').forEach(input => { input.checked = input.value === purpose; });
    document.getElementById('speciesControl').hidden = purpose !== 'mission';
    document.getElementById('scoreControl').hidden = purpose !== 'score';
    document.getElementById('strategyControls').hidden = purpose !== 'score';
    document.getElementById('strategyHelp').hidden = purpose !== 'score';
    document.querySelectorAll('.species-check').forEach(input => { input.checked = species.includes(input.value); });
    document.getElementById('scoreMode').value = scoreMode;
    document.getElementById('showTableDetails').checked = detailed;
    document.getElementById('purposeHelp').textContent = {
      all: '현재 구간에서 낚을 수 있는 물고기를 모두 보여줘요.',
      collection: '미획득 물고기 위주로 보여줘요. 유령과 필요한 직감·생미끼 조건 물고기는 남겨요.',
      mission: species.length ? `${species.length}개 물고기군을 함께 보여줘요. 잡은 물고기·유령·필요한 조건 물고기도 포함해요.` : '물고기군을 하나 이상 선택해 주세요. 여러 종류를 함께 선택할 수 있어요. 선택 전에는 유령 물고기만 표시해요.',
      score: '모든 점수를 보여주고, 현재 GP로 가능한 추천 기술을 물고기별로 강조해요. 일반·환해류와 직감·생미끼 조건부 후보는 따로 비교해요. GP는 직접 입력하며 자동 차감하지 않아요.'
    }[purpose];
    const routesToggle = document.getElementById('hideCompletedRoutesToggle');
    routesToggle.hidden = purpose !== 'collection';
    routesToggle.classList.toggle('active', purpose === 'collection' && originalHideCompletedRoutes());
    routesToggle.setAttribute('aria-pressed', String(purpose === 'collection' && originalHideCompletedRoutes()));
  }
  function refresh() {
    if (!catalog.size) return;
    const first = convertTime(false);
    const number = syncActiveBoatScheduleRoute(first);
    if (number) window.displayStops(route === 'indigo' ? 'Indigo' : 'Ruby', number, cleanedDataObjBK);
    else { clearDisplayedStopTables(); updateStatus(); updateViewingRoute(); }
  }
  document.addEventListener('DOMContentLoaded', () => {
    const controls = document.createElement('div'); controls.id = 'strategyControls'; controls.className = 'strategy-controls';
    controls.innerHTML = '<label for="strategyGP">현재 쓸 GP <input id="strategyGP" type="number" class="form-control form-control-sm" min="0" max="9999" step="1" inputmode="numeric"></label><label for="strategyObjective">추천 기준 <select id="strategyObjective" class="form-select form-select-sm"><option value="efficiency">GP 효율 우선</option><option value="burst">한 번 점수 우선</option></select></label>';
    document.getElementById('scoreControl').before(controls);
    const help = document.createElement('details'); help.id = 'strategyHelp'; help.className = 'strategy-help';
    help.innerHTML = '<summary>추천 계산 방법과 전제</summary><p><b>GP 효율 우선</b>: (기본 점수 × 추가 마릿수) ÷ 소비 GP. 일반 낚아채기 1마리를 제외한 추가 점수로 비교해요. 여러 번 목표를 노릴 여유가 있을 때 참고하세요.</p><p><b>한 번 점수 우선</b>: 현재 GP로 가능한 기술 중 한 번의 총점이 큰 쪽을 골라요. 남은 기회가 적을 때 참고하세요. 수량 범위가 있으면 낮은 값을 사용해요. 먼바다 낚시의 이중·삼중 수량은 획득력으로 늘어나지 않아요. 같은 효율·점수라면 GP가 적게 드는 기술을 골라요.</p><p>목표 물고기를 낚는 데 성공한다는 조건의 비교예요. 입질·실패 확률, 인내, 월척·보너스, 한결같은 챔질·대물 낚시 조합, GP 회복, 남은 시간은 계산하지 않아요. 현재 날씨·직감 활성 여부도 자동으로 알 수 없어요. 수량 자료가 없는 기술은 추천에서 제외해요.</p><p><a href="https://guide.ff14.co.kr/job/Fisher/31?type=L" target="_blank" rel="noopener noreferrer">한국 공식 가이드 · 어부 기술</a> · 이중 400GP / 삼중 700GP · <a href="https://oceanfishing.boats/FAQ/" target="_blank" rel="noopener noreferrer">원본 측정팀 FAQ · 낚아채기 수량</a></p>';
    document.getElementById('purposeHelp').after(help);
    const gpInput = document.getElementById('strategyGP'), objectiveInput = document.getElementById('strategyObjective');
    gpInput.value = strategy.gp; objectiveInput.value = strategy.objective;
    const applyStrategy = () => {
      if (!gpInput.value.trim() || !gpInput.checkValidity()) { gpInput.reportValidity(); return; }
      strategy = { gp: Number(gpInput.value), objective: objectiveInput.value };
      try { localStorage.setItem('ocean:strategy', JSON.stringify(strategy)); } catch {}
      OceanUX.preserveScroll(refresh);
    };
    gpInput.addEventListener('change', applyStrategy); objectiveInput.addEventListener('change', applyStrategy);
    gpInput.addEventListener('keydown', event => { if (event.key === 'Enter') gpInput.blur(); });
    document.querySelectorAll('[name="fishingPurpose"]').forEach(input => input.addEventListener('change', event => {
      purpose = event.target.value;
      try { localStorage.setItem('ocean:purpose:' + route, purpose); } catch {}
      syncGroupControls(); refresh();
    }));
    document.getElementById('speciesFilter').addEventListener('change', event => {
      if (!event.target.matches('.species-check')) return;
      species = [...document.querySelectorAll('.species-check:checked')].map(input => input.value);
      try { localStorage.setItem('ocean:species-groups:' + route, JSON.stringify(species)); } catch {}
      refresh();
    });
    document.getElementById('scoreMode').addEventListener('change', event => {
      scoreMode = event.target.value;
      try { localStorage.setItem('ocean:score:' + route, scoreMode); } catch {}
      refresh();
    });
    document.getElementById('showTableDetails').addEventListener('change', event => {
      if (detailed) document.querySelectorAll('table[id^="desttable"]').forEach(node => {
        if ($.fn.dataTable.isDataTable(node)) tableVisibility.set(node, $(node).DataTable().columns().visible().toArray());
      });
      detailed = event.target.checked;
      try { localStorage.setItem('ocean:table-details', String(detailed)); } catch {}
      OceanUX.preserveScroll(() => applyTableDetails());
    });
    document.getElementById('returnFirstRoute').addEventListener('click', () => document.querySelector('#boatSchedule .stopsRow')?.click());
    syncGroupControls();
    const fileInput = document.getElementById('importCollectionFile');
    const importButton = document.getElementById('importCollection');
    const transferStatus = document.getElementById('collectionTransferStatus');
    importButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) return;
      importButton.disabled = true;
      try {
        if (file.size > 2 * 1024 * 1024) throw new Error('파일이 너무 커요. 체크리스트 JSON 파일을 선택해 주세요.');
        const result = api.importCaught(localStorage, await file.text());
        state = result.state;
        refresh();
        transferStatus.textContent = OceanUX.importMessage(result);
        OceanUX.notice(transferStatus.textContent);
      } catch (error) {
        transferStatus.textContent = `가져오지 못했어요. ${error instanceof SyntaxError ? '올바른 JSON 파일을 선택해 주세요.' : error.message}`;
      } finally {
        fileInput.value = '';
        importButton.disabled = false;
      }
    });
    document.getElementById('exportCollection').addEventListener('click', () => {
      OceanUX.exportRecords();
      transferStatus.textContent = '근해·원양 기록을 JSON 파일로 내보냈어요.';
    });
    document.addEventListener('change', event => {
      if (!event.target.matches('.collection-check')) return;
      const fish = event.target.dataset.fish;
      const previous = api.caught(api.read(localStorage), route, fish);
      const next = event.target.checked;
      try { state = api.setCaught(localStorage, route, fish, event.target.checked); }
      catch { event.target.checked = !event.target.checked; updateStatus('브라우저 저장에 실패했어요. 저장 공간·사이트 권한을 확인해 주세요.'); return; }
      OceanUX.preserveScroll(refresh);
      OceanUX.catchChanged(route, fish, previous, next, catalog.get(api.key(fish))?.label || fish, refresh);
      const remaining = [...document.querySelectorAll('.collection-check')].find(el => el.dataset.fish === fish && el.getClientRects().length);
      (remaining || document.getElementById('undoCatch')).focus({ preventScroll: true });
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === 'caughtFishLS-combined' || event.key === null) { state = api.read(localStorage); refresh(); }
  });
  document.addEventListener('ocean-records-imported', () => { state = api.read(localStorage); refresh(); });
})();
