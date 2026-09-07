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
    paste(files, {target = $('scanDialog'), fallback = false} = {}) {
      const event = new w.Event('paste', {bubbles: true, cancelable: true});
      Object.defineProperty(event, 'clipboardData', {value: {items: fallback ? [] : files.map(file => ({kind: 'file', type: file.type, getAsFile: () => file})), files}});
      target.dispatchEvent(event);
      return event;
    },
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

test('pasted images append in order without losing edited results, reviews or selected page numbers', async t => {
  const a = scanner(t, 90);
  await a.choose(['first.png']);
  a.change('scanPage', 'normal:2');
  await a.analyze();
  a.$('scanReviewGrid').querySelector('button').click();
  a.change('scanReviewed', true);
  const image = new a.w.File(['image'], 'image.png', {type: 'image/png'});
  assert.equal(a.paste([image]).defaultPrevented, true);
  await until(() => a.$('scanFileName').textContent === '붙여넣은 캡처 01.png');
  assert.equal(a.$('scanFileList').children.length, 2);
  assert.equal(a.$('scanPage').value, 'normal:1');
  a.paste([image], {fallback: true});
  await until(() => a.$('scanFileName').textContent === '붙여넣은 캡처 02.png');
  assert.equal(a.$('scanFileList').children.length, 3);
  assert.equal(a.$('scanPage').value, 'normal:3');
  a.$('scanFileList').querySelector('button').click();
  await until(() => a.$('scanFileName').textContent === 'first.png');
  assert.equal(a.$('scanReviewed').checked, true);
  assert.match(a.$('scanPageSummary').textContent, /보유 14장/);
  await a.choose(['additional.png']);
  assert.equal(a.$('scanFileList').children.length, 4);
  assert.match(a.$('scanFileList').querySelector('button').textContent, /검토 완료/);
});

test('paste can start an empty collection; text and closed-dialog paste remain native', async t => {
  const a = scanner(t);
  const image = new a.w.File(['image'], 'image.png', {type: 'image/png'});
  a.$('scanClose').click();
  assert.equal(a.paste([image], {target: a.w.document}).defaultPrevented, false);
  assert.equal(a.$('scanWorkspace').hidden, true);
  a.$('scanOpen').click();
  assert.equal(a.paste([], {target: a.$('scanExpected')}).defaultPrevented, false);
  a.paste([image], {target: a.$('scanExpected')});
  await until(() => a.$('scanCanvas').width === 256);
  assert.equal(a.$('scanWorkspace').hidden, false);
  assert.equal(a.$('scanFileList').children.length, 1);
  await a.analyze();
  a.change('scanReviewed', true);
  a.$('scanApply').click();
  assert.equal(a.applied().ownedIds.length, 15);
});

test('invalid, excessive or busy pastes do not alter existing captures', async t => {
  const a = scanner(t);
  await a.choose(['first.png']);
  const image = new a.w.File(['image'], 'image.png', {type: 'image/png'});
  for (const files of [Array(30).fill(image), [new a.w.File(['image'], 'image.gif', {type: 'image/gif'})]]) {
    a.paste(files);
    assert.equal(a.$('scanFileList').children.length, 1);
    assert.match(a.$('scanStatus').textContent, /기존 캡처는 유지/);
  }
  a.$('scanAnalyze').click();
  a.paste([image]);
  assert.match(a.$('scanStatus').textContent, /인식이 끝난 뒤/);
  await until(() => !a.$('scanAnalyze').disabled);
  assert.equal(a.$('scanFileList').children.length, 1);
  a.change('scanReviewed', true);
  assert.equal(a.$('scanApply').disabled, false);
});

test('review checkboxes sit on the cropped canvas and crop mode does not change saved review choices', async t => {
  const a = scanner(t);
  await a.choose(['first.png']);
  a.$('scanUseFullImage').click();
  await a.analyze();
  const grid = a.$('scanReviewGrid');
  assert.equal(grid.parentElement, a.$('scanCanvas').parentElement);
  assert.equal(grid.hidden, false);
  assert.equal(a.$('scanCropControls').hidden, true);
  assert.equal(grid.querySelectorAll('[role="checkbox"]').length, 30);
  assert.equal(grid.querySelector('button').getAttribute('aria-checked'), 'true');
  grid.querySelector('button').click();
  assert.equal(grid.querySelector('button').getAttribute('aria-checked'), 'false');
  a.change('scanReviewed', true);
  a.$('scanEditCrop').click();
  assert.equal(grid.hidden, true);
  assert.equal(a.$('scanCropControls').hidden, false);
  a.$('scanEditCrop').click();
  assert.equal(grid.hidden, false);
  assert.equal(a.$('scanReviewed').checked, true);
  assert.equal(grid.querySelector('button').getAttribute('aria-checked'), 'false');
});

test('learning a question-mark reference rechecks unreviewed pages but preserves manual corrections', async t => {
  const a = scanner(t);
  await a.choose(['first.png', 'second.png']);
  await a.analyze();
  a.$('scanReviewGrid').querySelector('button').click();
  a.change('scanReviewed', true);
  a.$('scanNext').click();
  await until(() => !a.$('scanPickMissing').disabled);
  a.$('scanReviewGrid').querySelector('button').click();
  const reference = {test: 'selected question mark'}, calls = [];
  a.w.TriadScanner.makeReference = () => reference;
  a.w.TriadScanner.analyze = (pixels, rect, count, ref) => {
    calls.push(ref);
    return Array.from({length: count}, (_, index) => ({index, state: 'owned'}));
  };
  a.$('scanPickMissing').click();
  assert.equal(a.$('scanCalibrationHint').hidden, false);
  a.$('scanReviewGrid').querySelector('[data-scan-cell="1"]').click();
  await until(() => !a.$('scanAnalyze').disabled);
  assert.deepEqual(calls, [reference]);
  assert.equal(a.$('scanCalibrationHint').hidden, true);
  assert.equal(a.$('scanReviewed').checked, false);
  assert.match(a.$('scanPageSummary').textContent, /보유 28장 · 미수집 2장/);
  a.change('scanReviewed', true);
  a.$('scanApply').click();
  assert.equal(a.applied().ownedIds.length, 42);
});
