const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const R = require('../yaku-reference.js');
const H = require('../core.js');
const { JSDOM } = require('../../ocean-fishing/node_modules/jsdom');
test('full reference has 39 yaku and three bonuses with physical complete examples', () => {
  assert.equal(R.entries.filter(e => !e.bonus).length, 39);
  assert.equal(new Set(R.entries.map(e=>e.id)).size, 42);
  for (const entry of R.entries) {
    const groups = entry.groups.map(R.parseGroup);
    const physical = Array(34).fill(0);
    groups.flat().forEach(tile => physical[tile]++);
    assert.ok(physical.every(n => n <= 4), entry.id);
    assert.ok(entry.focus.every(index => groups[index]), entry.id);
    if (entry.id === 'nagashi') { assert.ok(groups.flat().every(H.isTerminal)); continue; }
    const structural = Array(34).fill(0);
    groups.flatMap(group => group.length === 4 ? group.slice(0, 3) : group).forEach(tile => structural[tile]++);
    assert.equal(structural.reduce((a,b)=>a+b,0), 14, entry.id);
    assert.equal(H.shanten(structural), -1, entry.id);
  }
});
test('reference tabs preserve hand inputs, support keyboard navigation and filter entries', () => {
  const root = path.resolve(__dirname, '..');
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), { url:'http://localhost/ffxiv/mahjong-helper/', runScripts:'outside-only' });
  const w = dom.window, doc = w.document;
  for (const script of ['core.js','yaku-reference.js','reference-app.js']) w.eval(fs.readFileSync(path.join(root,script),'utf8'));
  doc.getElementById('quickMan').value = '123';
  doc.getElementById('referenceTab').click();
  assert.equal(doc.getElementById('handPanel').hidden, true);
  assert.equal(doc.querySelectorAll('.reference-card').length, 42);
  const search = doc.getElementById('referenceSearch'); search.value = '삼색'; search.dispatchEvent(new w.Event('input'));
  assert.equal(doc.querySelectorAll('.reference-card').length, 2);
  search.value = ''; search.dispatchEvent(new w.Event('input'));
  const category = doc.getElementById('referenceCategory'); category.value = '역만'; category.dispatchEvent(new w.Event('change'));
  assert.equal(doc.querySelectorAll('.reference-card').length, 12);
  doc.getElementById('referenceClosed').click();
  assert.equal(doc.querySelectorAll('.reference-card').length, 5);
  doc.getElementById('referenceTab').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowLeft'}));
  assert.equal(doc.getElementById('referencePanel').hidden,true);
  assert.equal(doc.getElementById('quickMan').value,'123');
  assert.equal(doc.activeElement.id,'handTab');
  dom.window.close();
});
