const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('../ocean-fishing/node_modules/jsdom');
const { pages } = require('../tools/site-navigation.cjs');
const root = path.resolve(__dirname, '..');
function open(page = 'fishing-log/') {
  const dom = new JSDOM(fs.readFileSync(path.join(root, page, 'index.html'), 'utf8'), { url: `https://example.test/ffxiv/${page}`, runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync(path.join(root, 'navigation.js'), 'utf8'));
  return dom;
}
const tick = () => new Promise(resolve => setTimeout(resolve, 10));
test('all public pages have consistent navigation, valid relative destinations and current-page markers', () => {
  for (const page of pages) {
    const dom = open(page), d = dom.window.document;
    try {
      assert.equal(d.querySelectorAll('[data-navigation]').length, 1, page);
      assert.deepEqual([...d.querySelectorAll('.nav-category > summary')].map(el => el.textContent), ['진행·검색', '수집·육성', '어부']);
      assert.equal(d.querySelectorAll('.site-nav a').length, 15);
      const guides=d.querySelectorAll('#nav-fishing ul[aria-labelledby="nav-fisher-guide-label"] > li > a');
      assert.deepEqual([...guides].map(a=>a.textContent.replace('현재','')),['어부 스킬 안내','터주 유형별 공략']);
      assert.deepEqual([...d.querySelectorAll('#nav-fishing .nav-group-label')].map(el=>el.textContent),['어부 가이드','낚시 도감']);
      assert.deepEqual([...d.querySelectorAll('#nav-fishing ul[aria-labelledby="nav-fishing-log-label"] > li > a')].map(el=>el.textContent.replace('현재','')),['세계를 누비는 어부','먼바다']);
      for (const link of d.querySelectorAll('[data-navigation] a')) {
        const url = new URL(link.href);
        assert.equal(url.origin, 'https://example.test');
        assert.ok(fs.existsSync(path.join(root, '..', url.pathname, 'index.html')), url.pathname);
      }
      const current = d.querySelectorAll('[data-navigation] [aria-current="page"]');
      assert.equal(current.length, page === 'ocean-fishing/sources/' ? 0 : 1, page);
      if (current.length) assert.equal(new URL(current[0].href).pathname, `/ffxiv/${page}`);
      for (const asset of ['navigation.js', 'navigation.css']) {
        const selector = asset.endsWith('.js') ? 'script[src]' : 'link[href]';
        const nodes = [...d.querySelectorAll(selector)].filter(el => (el.src || el.href).includes('/' + asset + '?'));
        assert.equal(nodes.length, 1, page + asset);
        assert.equal(new URL(nodes[0].src || nodes[0].href).pathname, '/ffxiv/' + asset);
      }
    } finally { dom.window.close(); }
  }
});
test('opening another category or clicking outside dismisses the previous dropdown', async () => {
  const dom = open(), d = dom.window.document;
  try {
    await tick();
    const groups = [...d.querySelectorAll('.nav-category')];
    groups[0].querySelector('summary').click(); await tick();
    assert.equal(groups[0].open, true);
    assert.equal(groups[0].querySelector('summary').getAttribute('aria-expanded'), 'true');
    groups[1].querySelector('summary').click(); await tick();
    assert.deepEqual(groups.map(el => el.open), [false, true, false]);
    dom.window.dispatchEvent(new dom.window.PageTransitionEvent('pageshow'));
    assert.equal(groups[1].open, true, 'finishing the initial load must not close a menu already opened by the user');
    dom.window.dispatchEvent(new dom.window.PageTransitionEvent('pageshow', { persisted: true }));
    assert.ok(groups.every(el => !el.open));
    groups[2].querySelector('summary').click(); await tick();
    d.querySelector('h1').click(); await tick();
    assert.ok(groups.every(el => !el.open));
  } finally { dom.window.close(); }
});
test('keyboard opens and traverses links, Escape restores focus, and Tab can leave the dropdown', async () => {
  const dom = open(), w = dom.window, d = w.document;
  try {
    await tick();
    const group = d.querySelector('.nav-category'), summary = group.querySelector('summary'), links = [...group.querySelectorAll('a')];
    const key = value => d.activeElement.dispatchEvent(new w.KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }));
    summary.focus(); key('ArrowDown');
    assert.equal(group.open, true); assert.equal(d.activeElement, links[0]);
    key('ArrowDown'); assert.equal(d.activeElement, links[1]);
    key('End'); assert.equal(d.activeElement, links.at(-1));
    key('Home'); assert.equal(d.activeElement, links[0]);
    key('Escape'); assert.equal(group.open, false); assert.equal(d.activeElement, summary);
    key('ArrowUp'); assert.equal(d.activeElement, links.at(-1));
    d.querySelectorAll('.nav-category > summary')[1].focus(); assert.equal(group.open, false);
  } finally { dom.window.close(); }
});
