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
