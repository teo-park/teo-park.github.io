(() => {
  'use strict';
  const route = location.pathname.includes('/ruby') ? 'ruby' : 'indigo';
  const api = window.OceanCollection;
  let state = api.read(localStorage);
  let hide = true;
  try { hide = localStorage.getItem('ocean:hide-caught') !== 'false'; } catch {}
  let species = '';
  try { species = localStorage.getItem('ocean:species:' + route) || ''; } catch {}
  let scoreMode = '';
  try { scoreMode = localStorage.getItem('ocean:score:' + route) || ''; } catch {}
  if (!['DH', 'TH'].includes(scoreMode)) scoreMode = '';
  if (scoreMode) species = '';
  const focused = () => !!species || !!scoreMode;
  let groupsReady = false;
  let catalog = new Map();
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const originalDisplay = window.displayStops;
  const originalHideCompletedRoutes = window.getHideCompletedRoutesEnabled;
  window.getHideCompletedRoutesEnabled = () => focused() ? false : originalHideCompletedRoutes();
  window.isFishCaught = fish => api.caught(state, route, fish);
  window.displayStops = function(color, number, data) {
    state = api.read(localStorage);
    // Original table rendering mutates rows; always rebuild from untouched source data.
    const fresh = JSON.parse(JSON.stringify(cleanedDataObjBK.length ? cleanedDataObjBK : data));
    prepareGroups(fresh);
    originalDisplay(color, number, fresh);
    updateStatus();
  };
  function prepareGroups(fresh) {
    catalog = api.createCatalog(fresh);
    if (!groupsReady) {
      const select = document.getElementById('speciesFilter');
      const groups = new Map(fresh.filter(row => row.Species).map(row => [row.Species, row.SpeciesTranslated || row.Species]));
      for (const [value, label] of [...groups].sort((a, b) => a[1].localeCompare(b[1], 'ko'))) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        select.append(option);
      }
      if (!groups.has(species)) species = '';
      select.value = species;
      groupsReady = true;
    }
    syncGroupControls();
    updateStatus();
  }
  // Initialize controls even when all completed voyages are hidden at startup.
  for (const color of ['Indigo', 'Ruby']) {
    const handler = window['sheetDataHandler' + color];
    window['sheetDataHandler' + color] = function(data) {
      handler(data);
      prepareGroups(cleanedDataObjBK);
    };
  }
  window.filterCollectionStop = rows => api.plan(rows, catalog, fish => api.caught(state, route, fish), hide, species, scoreMode);
  window.collectionControl = (fish, row) => {
    const required = row.LocalRequiredBy || [];
    const score = row.LocalScore;
    const scoreBadge = score ? '<span class="score-target-fish">' + (scoreMode === 'DH' ? '이중 ' : '삼중 ') + score.min + (score.max !== score.min ? '–' + score.max : '') + '점 · 고득점 후보</span>' : '';
    return `<div class="collection-control"><label><input type="checkbox" class="collection-check" data-fish="${escape(api.name(fish))}" ${row.LocalCaught ? 'checked' : ''} aria-label="${escape(api.name(row.FishTranslated || fish))} 잡음"><span>잡음</span></label>${scoreBadge}${row.LocalGroupMatch ? '<span class="group-target-fish">과제 대상</span>' : ''}${row.LocalAlwaysVisible ? '<span class="always-visible-fish">미끼 확인용 · 항상 표시</span>' : ''}${required.length && (row.LocalCaught || row.LocalGroupDependency) ? `<span class="condition-fish" title="${escape(required.join(', '))}의 직감·생미끼 조건">조건용 · ${escape(required.join(', '))}</span>` : ''}</div>`;
  };
  function updateStatus(message) {
    const total = catalog.size;
    const count = [...catalog.values()].filter(fish => api.caught(state, route, fish.name)).length;
    document.getElementById('collectionStatus').textContent = message || `${route === 'indigo' ? '근해' : '원양'} ${count} / ${total}종 잡음 · 이 브라우저에 저장`;
  }
  function syncGroupControls() {
    document.getElementById('hideCaughtFish').disabled = focused();
    document.getElementById('scoreMode').value = scoreMode;
    document.getElementById('speciesHelp').textContent = scoreMode
      ? '일반·환해류 각각 최소 획득 점수 상위 3종(동점 포함)을 표시해요. 잡은 물고기도 포함하며, 점수는 기본 점수 × 낚는 수예요. 보너스·GP·입질 확률은 미반영이에요.'
      : species
      ? '선상과제용으로 선택한 물고기군은 잡았어도 표시해요. 필요한 조건 물고기와 유령 물고기도 남겨요.'
      : '물고기군을 고르면 해당 종류와 필요한 조건 물고기를 모아 볼 수 있어요.';
    const routesToggle = document.getElementById('hideCompletedRoutesToggle');
    routesToggle.disabled = focused();
    routesToggle.classList.toggle('active', !focused() && originalHideCompletedRoutes());
    routesToggle.setAttribute('aria-pressed', String(!focused() && originalHideCompletedRoutes()));
  }
  function refresh() {
    if (!catalog.size) return;
    const first = convertTime(false);
    const number = syncActiveBoatScheduleRoute(first);
    if (number) window.displayStops(route === 'indigo' ? 'Indigo' : 'Ruby', number, cleanedDataObjBK);
    else { clearDisplayedStopTables(); updateStatus(); }
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('speciesFilter').addEventListener('change', event => {
      species = event.target.value;
      scoreMode = '';
      try { localStorage.removeItem('ocean:score:' + route); } catch {}
      try { localStorage.setItem('ocean:species:' + route, species); } catch {}
      syncGroupControls();
      refresh();
    });
    document.getElementById('scoreMode').addEventListener('change', event => {
      scoreMode = event.target.value;
      species = '';
      document.getElementById('speciesFilter').value = '';
      try { localStorage.setItem('ocean:score:' + route, scoreMode); localStorage.removeItem('ocean:species:' + route); } catch {}
      syncGroupControls();
      refresh();
    });
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
        transferStatus.textContent = `${result.imported}종의 잡은 기록을 합쳤어요. 근해·원양 모두 반영했고 기존 기록도 유지했어요.`;
      } catch (error) {
        transferStatus.textContent = `가져오지 못했어요. ${error instanceof SyntaxError ? '올바른 JSON 파일을 선택해 주세요.' : error.message}`;
      } finally {
        fileInput.value = '';
        importButton.disabled = false;
      }
    });
    document.getElementById('exportCollection').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(api.read(localStorage), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'checklist-export.json';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      transferStatus.textContent = '근해·원양 기록을 JSON 파일로 내보냈어요.';
    });
    const toggle = document.getElementById('hideCaughtFish');
    toggle.checked = hide;
    toggle.addEventListener('change', () => {
      hide = toggle.checked;
      try { localStorage.setItem('ocean:hide-caught', String(hide)); } catch {}
      refresh();
    });
    document.addEventListener('change', event => {
      if (!event.target.matches('.collection-check')) return;
      const fish = event.target.dataset.fish;
      try { state = api.setCaught(localStorage, route, fish, event.target.checked); }
      catch { event.target.checked = !event.target.checked; updateStatus('브라우저 저장에 실패했어요. 저장 공간·사이트 권한을 확인해 주세요.'); return; }
      refresh();
      const remaining = [...document.querySelectorAll('.collection-check')].find(el => el.dataset.fish === fish && el.getClientRects().length);
      (remaining || toggle).focus({ preventScroll: true });
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === 'caughtFishLS-combined' || event.key === null) { state = api.read(localStorage); refresh(); }
  });
})();
