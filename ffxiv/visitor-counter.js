(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    const script = document.currentScript;
    if (script && location.origin === 'https://teo-park.github.io') {
      const configUrl = new URL('visitor-counter-config.json?v=20260916-pages1', script.src);
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
  async function start(w, configUrl) {
    if (w.__ffxivCounterStarted) return;
    w.__ffxivCounterStarted = true;
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
      if (storage.getItem('ffxiv-counter-owner-excluded') === 'true' || storage.getItem('ffxiv-usage-stats-disabled') === 'true') return;
      const now = Date.now();
      if (!tracked || !due(Number(storage.getItem(storageKey)), now, config.intervalMs)) return;
      // Reserve before sending: an uncertain network response must never cause an automatic duplicate.
      try { storage.setItem(storageKey, String(now)); } catch { return; }
      const bytes = w.crypto.getRandomValues(new Uint8Array(16));
      const eventId = Array.from(bytes, n => n.toString(16).padStart(2, '0')).join('');
      await request(w, database + '/visits/' + page.key + '/' + eventId + '.json', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: 'true',
      });
    };
    try {
      if (w.navigator.locks) await w.navigator.locks.request(storagePrefix + page.key, record);
      else await record();
    } catch { /* A failed background count must never interrupt the tool. */ }
  }
  return { pageFor, totals, due, start };
});
