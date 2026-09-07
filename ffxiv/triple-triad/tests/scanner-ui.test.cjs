const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const S = require('../scanner.js');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
async function until(check) {
  for (let i = 0; i < 100; i++) {
    if (check()) return;
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  throw Error('UI did not settle');
}
function scanner(t, cardCount = 60) {
  const dom = new JSDOM(read('index.html'), {runScripts: 'outside-only', pretendToBeVisual: true});
  const w = dom.window, $ = id => w.document.getElementById(id);
  t.after(() => w.close());
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event('close')); };
  w.HTMLCanvasElement.prototype.getContext = () => ({
    clearRect() {}, drawImage() {}, fillRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, getImageData() { return {}; }
  });
  w.createImageBitmap = async () => ({width: 256, height: 341, close() {}});
  // Fixed recognition results isolate review and import behavior from image classification.
  w.TriadScanner = {...S, analyze: (_, rect, count) => Array.from({length: count}, (_, index) => ({index, state: index % 2 ? 'missing' : 'owned'}))};
  const cards = Array.from({length: cardCount}, (_, i) => ({id: i + 101, order: i + 1, number: `No. ${i + 1}`, name: `카드 ${i + 1}`, ex: false}));
  let applied = null;
  w.eval(read('scanner-ui.js'));
  w.TriadScanUI.mount({cards, apply: data => { applied = data; return {ok: true}; }});
  $('scanOpen').click();
  const change = (id, value) => {
    if ($(id).type === 'checkbox') $(id).checked = value; else $(id).value = value;
    $(id).dispatchEvent(new w.Event('change', {bubbles: true}));
  };
  return {w, $, change, applied: () => applied,
    async choose(names) {
      Object.defineProperty($('scanFiles'), 'files', {configurable: true, value: names.map(name => new w.File(['image'], name, {type: 'image/png'}))});
      $('scanFiles').dispatchEvent(new w.Event('change', {bubbles: true}));
      await until(() => $('scanCanvas').width === 256);
    },
    async analyze() {
      $('scanAnalyze').click();
      await until(() => !$('scanAnalyze').disabled);
    }
  };
}

test('multiple captures require every page review and corrections invalidate that review', async t => {
  const a = scanner(t);
  await a.choose(['page-2.png', 'page-1.png']);
  assert.equal(a.$('scanFileName').textContent, 'page-1.png');
  a.$('scanCopyCrop').click();
  await a.analyze();
  assert.match(a.$('scanTotal').textContent, /보유 30장 · 미수집 30장/);
  assert.equal(a.$('scanApply').disabled, true);
  a.change('scanReviewed', true);
  a.$('scanReviewGrid').querySelector('button').click();
  assert.equal(a.$('scanReviewed').checked, false);
  assert.equal(a.$('scanApply').disabled, true);
  a.change('scanReviewed', true);
  a.$('scanNext').click();
  await until(() => a.$('scanFileName').textContent === 'page-2.png');
  a.change('scanReviewed', true);
  assert.equal(a.$('scanApply').disabled, false);
  a.$('scanApply').click();
  assert.equal(a.applied().ownedIds.length, 29);
  assert.equal(a.applied().seenIds.length, 60);
  assert.equal(a.applied().replacePages, false);
});

test('duplicate pages and a complete-collection count mismatch block saving', async t => {
  const a = scanner(t);
  await a.choose(['page-1.png', 'page-2.png']);
  await a.analyze();
  a.change('scanReviewed', true);
  a.$('scanNext').click();
  await until(() => a.$('scanPage').value === 'normal:2');
  a.change('scanPage', 'normal:1');
  await a.analyze();
  a.change('scanReviewed', true);
  assert.equal(a.$('scanApply').disabled, true);
  assert.match(a.$('scanApplyMessage').textContent, /두 번/);
  a.change('scanPage', 'normal:2');
  await a.analyze();
  a.change('scanReviewed', true);
  a.$('scanExpected').value = '31';
  a.$('scanExpected').dispatchEvent(new a.w.Event('input'));
  assert.equal(a.$('scanApply').disabled, true);
  assert.match(a.$('scanApplyMessage').textContent, /달라요/);
  a.$('scanApply').dispatchEvent(new a.w.Event('click'));
  assert.equal(a.applied(), null);
  a.$('scanExpected').value = '30';
  a.$('scanExpected').dispatchEvent(new a.w.Event('input'));
  assert.equal(a.$('scanApply').disabled, false);
  a.$('scanApply').click();
  assert.equal(a.applied().ownedIds.length, 30);
});

test('closing during analysis discards pending results without applying a collection', async t => {
  const a = scanner(t);
  await a.choose(['page-1.png', 'page-2.png']);
  a.$('scanAnalyze').click();
  a.$('scanClose').click();
  await new Promise(resolve => setTimeout(resolve, 30));
  assert.equal(a.applied(), null);
  assert.equal(a.$('scanWorkspace').hidden, true);
  assert.equal(a.$('scanFiles').disabled, false);
  a.$('scanOpen').click();
  await a.choose(['page-1.png']);
  await a.analyze();
  a.change('scanReviewed', true);
  assert.equal(a.$('scanApply').disabled, false);
});
