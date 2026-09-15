(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    const script = document.currentScript;
    if (script && location.origin === 'https://teo-park.github.io') {
      const configUrl = new URL('visitor-counter-config.json?v=20260915-counter1', script.src);
      api.start(window, configUrl.href).catch(() => {});
    }
  }
})(typeof window === 'object' ? window : null, function () {
  'use strict';
  const storagePrefix = 'ffxiv-counter-v1:';
  function pageFor(config, pathname) {
    const clean = pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
    const path = config.aliases[clean] || clean;
    return config.pages.find(page => page.path === path);
  }
  function totals(config, data, key) {
    const counts = Object.fromEntries(config.pages.map(page => [page.key,
      Number.isSafeInteger(data?.[page.key]) && data[page.key] >= 0 ? data[page.key] : 0]));
    return { counts, total: Object.values(counts).reduce((sum, n) => sum + n, 0), page: counts[key] || 0 };
  }
  function due(last, now, interval) {
    return !Number.isFinite(last) || last <= 0 || last > now || now - last >= interval;
  }
  async function request(w, url, options = {}) {
    const controller = new w.AbortController();
    const timeout = w.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await w.fetch(url, { credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', ...options, signal: controller.signal });
      if (!response.ok) throw Error('Counter unavailable');
      return await response.json();
    } finally { w.clearTimeout(timeout); }
  }
  function render(w, config, current, result) {
    const d = w.document;
    let panel = d.querySelector('[data-visitor-counter]');
    if (panel) return;
    const el = (tag, text, className) => {
      const node = d.createElement(tag);
      if (text !== undefined) node.textContent = text;
      if (className) node.className = className;
      return node;
    };
    const number = n => n.toLocaleString('ko-KR');
    panel = el('section', undefined, 'visitor-counter');
    panel.dataset.visitorCounter = '';
    panel.setAttribute('aria-label', '사이트 조회 현황');
    const line = el('div', undefined, 'visitor-counter-line');
    for (const [label, value] of [['전체 조회', result.total], ['이 페이지', result.page]]) {
      const item = el('span', label + ' ');
      item.append(el('strong', number(value)));
      line.append(item);
    }
    panel.append(line);
    const details = el('details');
    details.append(el('summary', '페이지별 조회 보기'));
    const list = el('ul');
    for (const page of [...config.pages].sort((a, b) => result.counts[b.key] - result.counts[a.key])) {
      const row = el('li');
      const link = el('a', page.label);
      link.href = page.path;
      if (page.key === current.key) link.setAttribute('aria-current', 'page');
      row.append(link, el('strong', number(result.counts[page.key])));
      list.append(row);
    }
    details.append(list, el('p', '같은 브라우저의 같은 페이지는 30분에 한 번 집계합니다. 전체 조회는 페이지별 합계이며 실제 방문자 수와 다릅니다. 근해·원양은 먼바다로 합산합니다.'));
    details.append(el('p', 'Firebase에는 페이지별 숫자만 저장하며 수집 기록을 전송하지 않습니다. 집계 시작 이전 방문은 포함되지 않습니다.'));
    panel.append(details);
    const footer = d.querySelector('footer.site-footer, footer');
    if (footer) footer.append(panel);
    else d.body.append(panel);
  }
  async function start(w, configUrl) {
    if (w.document.querySelector('[data-visitor-counter]')) return;
    const config = await request(w, configUrl);
    if (!config.origins.includes(w.location.origin) || !config.databaseUrl) return;
    const page = pageFor(config, w.location.pathname);
    if (!page) return;
    const database = config.databaseUrl.replace(/\/$/, '');
    const tracked = w.navigator.doNotTrack !== '1' && !w.navigator.globalPrivacyControl;
    // Hidden/preloaded tabs and PiP documents must not create additional visits.
    if (w.document.visibilityState === 'hidden') {
      await new Promise(resolve => {
        const visible = () => {
          if (w.document.visibilityState !== 'hidden') {
            w.document.removeEventListener('visibilitychange', visible);
            resolve();
          }
        };
        w.document.addEventListener('visibilitychange', visible);
      });
    }
    const record = async () => {
      const storageKey = storagePrefix + page.key;
      let storage;
      try { storage = w.localStorage; storage.getItem(storageKey); } catch { return; }
      const now = Date.now();
      if (!tracked || !due(Number(storage.getItem(storageKey)), now, config.intervalMs)) return;
      // Reserve before sending: an uncertain network response must never cause an automatic duplicate.
      try { storage.setItem(storageKey, String(now)); } catch { return; }
      await request(w, database + '/counters/' + page.key + '.json', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ '.sv': { increment: 1 } }),
      });
    };
    try {
      if (w.navigator.locks) await w.navigator.locks.request(storagePrefix + page.key, record);
      else await record();
    } catch { /* Display readable totals even when this visit could not be recorded. */ }
    const data = await request(w, database + '/counters.json');
    render(w, config, page, totals(config, data, page.key));
  }
  return { pageFor, totals, due, start, render };
});
