(() => {
  'use strict';
  const route = location.pathname.includes('/ruby') ? 'ruby' : 'indigo';
  const api = window.OceanCollection;
  let state = api.read(localStorage);
  let hide = true;
  try { hide = localStorage.getItem('ocean:hide-caught') !== 'false'; } catch {}
  let selected = null;
  let catalog = new Map();
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const originalDisplay = window.displayStops;
  window.isFishCaught = fish => api.caught(state, route, fish);
  window.displayStops = function(color, number, data) {
    selected = { color, number, data };
    state = api.read(localStorage);
    // Original table rendering mutates rows; always rebuild from untouched source data.
    const fresh = JSON.parse(JSON.stringify(cleanedDataObjBK.length ? cleanedDataObjBK : data));
    catalog = api.createCatalog(fresh);
    originalDisplay(color, number, fresh);
    updateStatus();
  };
  window.filterCollectionStop = rows => api.plan(rows, catalog, fish => api.caught(state, route, fish), hide);
  window.collectionControl = (fish, row) => {
    const required = row.LocalRequiredBy || [];
    return `<div class="collection-control"><label><input type="checkbox" class="collection-check" data-fish="${escape(api.name(fish))}" ${row.LocalCaught ? 'checked' : ''} aria-label="${escape(api.name(row.FishTranslated || fish))} 잡음"><span>잡음</span></label>${required.length && row.LocalCaught ? `<span class="condition-fish" title="${escape(required.join(', '))}의 직감·생미끼 조건">조건용 · ${escape(required.join(', '))}</span>` : ''}</div>`;
  };
  function updateStatus(message) {
    const total = catalog.size;
    const count = [...catalog.values()].filter(fish => api.caught(state, route, fish.name)).length;
    document.getElementById('collectionStatus').textContent = message || `${route === 'indigo' ? '근해' : '원양'} ${count} / ${total}종 잡음 · 이 브라우저에 저장`;
  }
  function refresh() {
    if (selected) window.displayStops(selected.color, selected.number, selected.data);
    if (typeof convertTime === 'function' && catalog.size) convertTime(false);
  }
  document.addEventListener('DOMContentLoaded', () => {
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
