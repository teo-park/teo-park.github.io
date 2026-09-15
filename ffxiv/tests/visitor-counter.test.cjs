const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('../ocean-fishing/node_modules/jsdom');
const api = require('../visitor-counter.js');
const { build } = require('../tools/visitor-counter.cjs');
const { pages } = require('../tools/site-navigation.cjs');
const { config, rules } = build('https://counter.example.test');
function open(options = {}) {
  const dom = new JSDOM('<!doctype html><body><footer class="site-footer">출처</footer>', { url: options.url || 'https://teo-park.github.io/ffxiv/fishing-log/', pretendToBeVisual: true });
  const w = dom.window, calls = [];
  let counts = { 'fishing-log': 10, home: 5 };
  w.fetch = async (url, opts = {}) => {
    calls.push({ url, ...opts });
    if (url.endsWith('config.json')) return { ok: true, json: async () => config };
    if (options.failedRead && opts.method !== 'PUT') throw Error('offline');
    if (opts.method === 'PUT') {
      counts['fishing-log']++;
      if (options.failedWrite) throw Error('uncertain response');
      return { ok: true, json: async () => counts['fishing-log'] };
    }
    return { ok: true, json: async () => counts };
  };
  return { dom, w, calls, writes: () => calls.filter(c => c.method === 'PUT') };
}
test('all public pages resolve to a known counter, aliases combine and unknown paths do not count', () => {
  for (const p of pages) {
    assert.ok(api.pageFor(config, '/ffxiv/' + p));
    assert.ok(api.pageFor(config, '/ffxiv/' + p + 'index.html'));
  }
  assert.equal(api.pageFor(config, '/ffxiv/ocean-fishing/ruby/').key, 'ocean-fishing');
  assert.equal(api.pageFor(config, '/ffxiv/ocean-fishing/indigo/').key, 'ocean-fishing');
  assert.equal(api.pageFor(config, '/unrelated/'), undefined);
});
test('total uses only registered numeric page counts and includes zeros', () => {
  const value = api.totals(config, { home: 12, 'fishing-log': 3, unknown: 999, minions: 'bad', weapons: -1 }, 'fishing-log');
  assert.equal(value.total, 15);
  assert.equal(value.page, 3);
  assert.equal(value.counts.weapons, 0);
  assert.equal(api.totals(config, null, 'home').total, 0);
});
test('30-minute deduplication and clock changes', () => {
  assert.equal(api.due(100, 1800099, 1800000), false);
  assert.equal(api.due(100, 1800100, 1800000), true);
  for (const last of [0, NaN, 2000000]) assert.equal(api.due(last, 1000, 1800000), true);
});
test('renders live counts and expands page list, never exports collection data', async () => {
  const ui = open();
  try {
    ui.w.localStorage.setItem('private-collection', 'not-for-upload');
    await api.start(ui.w, 'https://site.example/config.json');
    assert.equal(ui.writes().length, 1);
    assert.deepEqual(JSON.parse(ui.writes()[0].body), { '.sv': { increment: 1 } });
    const panel = ui.w.document.querySelector('[data-visitor-counter]');
    assert.match(panel.textContent, /전체 조회 16이 페이지 11/);
    assert.equal(panel.querySelectorAll('li').length, config.pages.length);
    assert.equal(panel.querySelector('details').open, false);
    assert.ok(ui.calls.every(c => c.credentials === 'omit' && c.referrerPolicy === 'no-referrer'));
    panel.remove();
    await api.start(ui.w, 'https://site.example/config.json');
    assert.equal(ui.writes().length, 1, 'refresh within 30 minutes does not increment');
  } finally { ui.dom.window.close(); }
});
test('ambiguous write failure is not retried, but counts remain usable', async () => {
  const ui = open({ failedWrite: true });
  try {
    await api.start(ui.w, 'https://site.example/config.json');
    assert.ok(ui.w.document.querySelector('[data-visitor-counter]'));
    ui.w.document.querySelector('[data-visitor-counter]').remove();
    await api.start(ui.w, 'https://site.example/config.json');
    assert.equal(ui.writes().length, 1);
  } finally { ui.dom.window.close(); }
});
test('localhost never reaches database and DNT is read-only', async () => {
  for (const local of [true, false]) {
    const ui = open(local ? { url: 'http://localhost:4198/ffxiv/fishing-log/' } : {});
    Object.defineProperty(ui.w.navigator, 'doNotTrack', { value: '1' });
    try {
      await api.start(ui.w, 'https://site.example/config.json');
      assert.equal(ui.writes().length, 0);
      assert.equal(ui.calls.length, local ? 1 : 2);
    } finally { ui.dom.window.close(); }
  }
});
test('database unavailable leaves the tool page intact without false zero counts', async () => {
  const ui = open({ failedRead: true });
  try {
    await assert.rejects(api.start(ui.w, 'https://site.example/config.json'));
    assert.equal(ui.w.document.querySelector('[data-visitor-counter]'), null);
    assert.equal(ui.w.document.querySelector('footer').textContent, '출처');
  } finally { ui.dom.window.close(); }
});
test('simultaneous tabs share a Web Lock and record the same page only once', async () => {
  const a = open(), b = open(), values = new Map();
  const storage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
  let queue = Promise.resolve();
  const locks = { request: (_key, run) => { const task = queue.then(run); queue = task.catch(() => {}); return task; } };
  try {
    for (const ui of [a, b]) {
      Object.defineProperty(ui.w, 'localStorage', { value: storage });
      Object.defineProperty(ui.w.navigator, 'locks', { value: locks });
    }
    await Promise.all([api.start(a.w, 'https://site.example/config.json'), api.start(b.w, 'https://site.example/config.json')]);
    assert.equal(a.writes().length + b.writes().length, 1);
  } finally { a.w.close(); b.w.close(); }
});
test('hidden tab waits until visible and denied local storage is read-only', async () => {
  const ui = open();
  let visibility = 'hidden';
  Object.defineProperty(ui.w.document, 'visibilityState', { get: () => visibility });
  try {
    const pending = api.start(ui.w, 'https://site.example/config.json');
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(ui.writes().length, 0);
    visibility = 'visible';
    ui.w.document.dispatchEvent(new ui.w.Event('visibilitychange'));
    await pending;
    assert.equal(ui.writes().length, 1);
    ui.w.document.querySelector('[data-visitor-counter]').remove();
    Object.defineProperty(ui.w, 'localStorage', { get: () => { throw Error('denied'); } });
    await api.start(ui.w, 'https://site.example/config.json');
    assert.equal(ui.writes().length, 1);
    assert.ok(ui.w.document.querySelector('[data-visitor-counter]'));
  } finally { ui.w.close(); }
});
test('database denies unregistered writes and every public page loads the shared counter once', () => {
  assert.equal(rules.rules['.write'], false);
  assert.equal(rules.rules['.read'], false);
  assert.deepEqual(Object.keys(rules.rules.counters).filter(k => !k.startsWith('.')).sort(), config.pages.map(p => p.key).sort());
  for (const page of pages) {
    const html = fs.readFileSync(path.resolve(__dirname, '..', page, 'index.html'), 'utf8');
    assert.equal((html.match(/src="[^\"]*visitor-counter\.js/g) || []).length, 1, page);
    assert.equal((html.match(/href="[^\"]*visitor-counter\.css/g) || []).length, 1, page);
  }
});
