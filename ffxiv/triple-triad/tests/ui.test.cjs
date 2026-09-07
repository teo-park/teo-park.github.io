const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const T = require('../engine.js');
const KEY = 'teo-ffxiv.triple-triad.collection.v1';
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
function app(options = {}) {
  const dom = new JSDOM(read('index.html'), {url: 'https://example.test/ffxiv/triple-triad/', runScripts: 'outside-only', pretendToBeVisual: true});
  const w = dom.window;
  w.matchMedia = () => ({matches: !!options.mobile});
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; };
  if (options.raw !== undefined) w.localStorage.setItem(KEY, options.raw);
  if (options.ids) w.localStorage.setItem(KEY, T.backup(new Set(options.ids)));
  let scanApply;
  w.TriadScanUI = {mount: options => { scanApply = options.apply; }};
  for (const file of ['data.js', 'engine.js', 'app.js']) w.eval(read(file));
  const $ = selector => w.document.querySelector(selector);
  const change = (selector, value) => { const el = $(selector); if (el.type === 'checkbox') el.checked = value; else el.value = value; el.dispatchEvent(new w.Event('change', {bubbles: true})); };
  const search = value => { $('#search').value = value; $('#search').dispatchEvent(new w.InputEvent('input', {bubbles: true, isComposing: true, inputType: 'insertCompositionText'})); };
  return {dom, w, $, change, search, scanApply};
}
test('active Korean composition searches the final consonant immediately', t => {
  const a = app(); t.after(() => a.dom.window.close());
  a.search('ㅊㅋㅂ');
  assert.ok(a.$('#cardGrid [data-open="13"]'));
  assert.ok(a.$('#cardGrid').textContent.includes('초코보'));
  a.search('absolutely-no-card-here');
  assert.equal(a.$('#emptyResults').hidden, false);
  a.$('#emptyReset').click();
  assert.equal(a.w.document.querySelectorAll('#cardGrid .collect-card').length, 30);
});
test('check, filter, reload and backup use the same stable card IDs', t => {
  const a = app(); t.after(() => a.dom.window.close());
  a.change('#cardGrid [data-owned="1"]', true);
  assert.equal(a.$('#ownedCount').textContent, '1');
  assert.deepEqual([...T.parseBackup(a.w.localStorage.getItem(KEY))], [1]);
  a.change('#ownedFilter', 'missing');
  assert.equal(a.$('#cardGrid [data-owned="1"]'), null);
  a.change('#ownedFilter', 'owned');
  assert.equal(a.w.document.querySelectorAll('#cardGrid .collect-card').length, 1);
  const b = app({raw: a.w.localStorage.getItem(KEY)}); t.after(() => b.dom.window.close());
  assert.equal(b.$('#cardGrid [data-owned="1"]').checked, true);
});
test('storage errors roll back the checkbox and do not replace corrupted saves', t => {
  const a = app({raw: '{broken'}); t.after(() => a.dom.window.close());
  a.change('#cardGrid [data-owned="1"]', true);
  assert.equal(a.$('#cardGrid [data-owned="1"]').checked, false);
  assert.equal(a.w.localStorage.getItem(KEY), '{broken');
  assert.equal(a.$('#fatal').hidden, false);
  const b = app({ids: [1]}); t.after(() => b.dom.window.close());
  b.w.Storage.prototype.setItem = () => { throw Error('QuotaExceededError'); };
  b.change('#cardGrid [data-owned="2"]', true);
  assert.equal(b.$('#cardGrid [data-owned="2"]').checked, false);
  assert.equal(b.$('#ownedCount').textContent, '1');
});
test('NPC conditions and rules are shown and applied to the recommendation tab', t => {
  const a = app(); t.after(() => a.dom.window.close());
  a.$('#cardGrid [data-open="2"]').click();
  assert.match(a.$('#cardDetail').textContent, /메메룬/);
  assert.match(a.$('#cardDetail').textContent, /X:14.7 Y:24.3/);
  assert.match(a.$('#cardDetail').textContent, /방랑자의 궁전/);
  a.$('#cardDetail [data-npc]').click();
  assert.equal(a.$('#deckView').hidden, false);
  assert.equal(a.$('#npcRuleContext').hidden, false);
  assert.ok(a.w.document.querySelectorAll('#ruleOptions input:checked').length > 0);
});
test('mobile card detail opens a dialog and checks sync back to collection', t => {
  const a = app({mobile: true}); t.after(() => a.dom.window.close());
  a.$('#cardGrid [data-open="2"]').click();
  assert.equal(a.$('#detailDialog').open, true);
  a.change('#dialogBody [data-owned="2"]', true);
  assert.equal(a.$('#cardGrid [data-owned="2"]').checked, true);
  assert.equal(a.$('#dialogBody [data-owned="2"]').checked, true);
});
test('imports preview before applying, merge by default, replace only when selected, reject invalid atomically', async t => {
  const a = app({ids: [1]}); t.after(() => a.dom.window.close());
  async function choose(text) {
    Object.defineProperty(a.$('#importFile'), 'files', {configurable: true, value: [{size: text.length, text: async () => text}]});
    a.$('#importFile').dispatchEvent(new a.w.Event('change', {bubbles: true}));
    await new Promise(resolve => setImmediate(resolve));
  }
  await choose(T.backup(new Set([2, 999999])));
  assert.equal(a.$('#importPreview').hidden, false);
  assert.deepEqual([...T.parseBackup(a.w.localStorage.getItem(KEY))], [1]);
  a.$('#applyImport').click();
  assert.deepEqual([...T.parseBackup(a.w.localStorage.getItem(KEY))], [1, 2, 999999]);
  await choose(T.backup(new Set([3])));
  a.$('[name="importMode"][value="replace"]').checked = true;
  a.$('#applyImport').click();
  assert.deepEqual([...T.parseBackup(a.w.localStorage.getItem(KEY))], [3]);
  await choose('{bad');
  assert.equal(a.$('#importPreview').hidden, true);
  a.$('#applyImport').click();
  assert.deepEqual([...T.parseBackup(a.w.localStorage.getItem(KEY))], [3]);
});
test('cross-tab changes refresh counts and a changed collection invalidates an old recommendation', async t => {
  const a = app({ids: [1, 3, 6, 7, 10]}); t.after(() => a.dom.window.close());
  a.$('#deckTab').click(); a.$('#recommendButton').click();
  await new Promise(resolve => setTimeout(resolve, 120));
  assert.equal(a.w.document.querySelectorAll('.recommended-card').length, 5);
  a.w.localStorage.setItem(KEY, T.backup(new Set([1])));
  a.w.dispatchEvent(new a.w.StorageEvent('storage', {key: KEY}));
  assert.equal(a.$('#ownedCount').textContent, '1');
  assert.equal(a.w.document.querySelectorAll('.recommended-card').length, 0);
});
test('rule limits, unavailable rule feedback and target deck work through controls', async t => {
  const a = app(); t.after(() => a.dom.window.close());
  a.$('#deckTab').click();
  for (const id of [1, 2, 4, 5, 6]) a.change(`#ruleOptions [value="${id}"]`, true);
  assert.equal(a.w.document.querySelectorAll('#ruleOptions input:checked').length, 4);
  a.$('#recommendButton').click(); await new Promise(resolve => setTimeout(resolve, 80));
  assert.match(a.$('#deckResult').textContent, /추첨 결과/);
  a.$('[data-preset="10"]').click(); a.change('#allCards', true);
  a.$('#recommendButton').click(); await new Promise(resolve => setTimeout(resolve, 250));
  assert.equal(a.w.document.querySelectorAll('.recommended-card').length, 5);
  assert.match(a.$('#deckResult').textContent, /미수집 5장/);
});

test('default pages follow game order in groups of 30 and keep EX cards on a separate page', t => {
  const a=app();t.after(()=>a.dom.window.close());
  const cards=[...a.w.TRIPLE_TRIAD_DATA.cards].sort((a,b)=>Number(a.ex)-Number(b.ex)||a.order-b.order);
  const groups=[cards.filter(c=>!c.ex),cards.filter(c=>c.ex)],seen=[];
  for(const [group,entries] of groups.entries()){
    const count=Math.ceil(entries.length/30);
    for(let page=1;page<=count;page++){
      const ids=[...a.w.document.querySelectorAll('#cardGrid [data-open]')].map(e=>+e.dataset.open);
      assert.deepEqual(ids,entries.slice((page-1)*30,page*30).map(c=>c.id));seen.push(...ids);
      assert.equal(a.$('#pagination span').textContent,`${group?'EX':'일반'} ${page} / ${count}`);
      const next=a.$('#pagination [aria-label="다음 페이지"]');
      assert.equal(next.disabled,group===1&&page===count);
      if(!next.disabled)next.click();
    }
  }
  assert.deepEqual(seen,cards.map(c=>c.id));
  a.change('#sortFilter','name');
  assert.equal(a.w.document.querySelectorAll('#cardGrid .collect-card').length,30);
  assert.equal(a.$('#pagination span').textContent,`1 / ${Math.ceil(cards.length/30)}`);
});

test('screenshot import merges by default and replaces only the reviewed pages when requested', t => {
  const a = app({ids: [1, 31, 999999]}); t.after(() => a.dom.window.close());
  const result = a.scanApply({ownedIds: [2], seenIds: [1, 2], replacePages: false});
  assert.equal(result.ok, true);
  assert.deepEqual([...T.parseBackup(a.w.localStorage.getItem(KEY))], [1, 2, 31, 999999]);
  assert.equal(a.$('#ownedCount').textContent, '3');
  assert.equal(a.scanApply({ownedIds: [2], seenIds: [1, 2], replacePages: true}).ok, true);
  assert.deepEqual([...T.parseBackup(a.w.localStorage.getItem(KEY))], [2, 31, 999999]);
  assert.equal(a.$('#cardGrid [data-owned="1"]').checked, false);
  assert.equal(a.$('#cardGrid [data-owned="2"]').checked, true);
});

test('screenshot errors and storage failures leave the prior collection intact', t => {
  const a = app({ids: [1]}); t.after(() => a.dom.window.close());
  for (const candidate of [
    {ownedIds: [2], seenIds: [1]},
    {ownedIds: [999999], seenIds: [999999]},
    {ownedIds: null, seenIds: []}
  ]) assert.equal(a.scanApply(candidate).ok, false);
  assert.deepEqual([...T.parseBackup(a.w.localStorage.getItem(KEY))], [1]);
  a.w.Storage.prototype.setItem = () => { throw Error('QuotaExceededError'); };
  assert.equal(a.scanApply({ownedIds: [2], seenIds: [1, 2], replacePages: true}).ok, false);
  assert.equal(a.$('#ownedCount').textContent, '1');
  assert.deepEqual([...T.parseBackup(a.w.localStorage.getItem(KEY))], [1]);
  const b = app({raw: '{broken'}); t.after(() => b.dom.window.close());
  assert.equal(b.scanApply({ownedIds: [2], seenIds: [2]}).ok, false);
  assert.equal(b.w.localStorage.getItem(KEY), '{broken');
});
