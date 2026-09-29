const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../meld-input.js');
const D = require('../partial-dictionary.js');

test('chi, pon, open kan, and concealed kan are separate groups', () => {
  const { melds, error } = M.parse('123ㅅ 555ㅈ 7777ㅌ');
  assert.equal(error, null);
  assert.deepEqual(melds.map(meld => [meld.type, meld.open]),
    [['chi', true], ['pon', true], ['kan', true]]);
  assert.equal(M.format(melds), '123ㅅ 555ㅈ 7777ㅌ');
  assert.deepEqual(M.parse('안깡:7777ㅌ').melds.map(meld => [meld.type, meld.open]),
    [['kan', false]]);
});

test('invalid meld shapes and too many physical copies are rejected', () => {
  for (const spec of ['124ㅅ', '112ㅅ', '1234ㅅ', '안깡:111ㅈ', '555ㅈ 555ㅈ'])
    assert.ok(M.parse(spec).error, spec);
});

test('fixed melds shape candidate examples and automatically close off closed-only yaku', () => {
  const chi = M.parse('123ㅅ').melds;
  const output = D.lookup(D.parseTiles('55z'), { melds: chi });
  assert.ok(output.results.length);
  assert.ok(output.results.every(result => result.openAllowed));
  assert.ok(!output.results.some(result => result.id === 'tanyao' && result.example.includes(31)));
  for (const result of output.results) {
    for (const tile of D.parseTiles('123s')) assert.ok(result.example.includes(tile));
  }
  assert.ok(!output.results.some(result => result.id === 'toitoi'));
});

test('concealed kan keeps menzen but still excludes seven pairs and pinfu shapes', () => {
  const kan = M.parse('안깡:7777ㅌ').melds;
  const output = D.lookup(D.parseTiles('123m55z'), { melds: kan });
  assert.ok(output.results.some(result => result.id === 'iipeikou'));
  assert.ok(!output.results.some(result => result.id === 'chiitoitsu' || result.id === 'pinfu'));
  assert.ok(!output.results.some(result => result.id === 'kokushi'));
  assert.throws(() => D.lookup(D.parseTiles('7p'), { melds: kan }), /네 장/);
  assert.throws(() => D.lookup(D.parseTiles('123456789m123p'), { melds: kan }), /14장/);
});

test('multiple melds remain fixed and two kans use six structural tiles', () => {
  const mixed = M.parse('123ㅅ 555ㅈ').melds;
  const mixedResults = D.lookup(D.parseTiles('456m22p'), { melds: mixed }).results;
  assert.ok(mixedResults.length);
  assert.ok(mixedResults.every(result => result.openAllowed));
  for (const result of mixedResults) {
    for (const tile of D.parseTiles('123s555z')) assert.ok(result.example.includes(tile));
  }

  const twoKans = M.parse('7777ㅌ 5555ㅈ').melds;
  const kanResults = D.lookup(D.parseTiles('22m'), { melds: twoKans }).results;
  assert.ok(kanResults.some(result => result.id === 'toitoi'));
  assert.ok(kanResults.every(result => result.openAllowed));
  assert.throws(() => D.lookup(D.parseTiles('123456789m'), { melds: twoKans }), /14장/);
});
