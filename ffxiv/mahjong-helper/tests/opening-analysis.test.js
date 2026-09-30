const test = require('node:test');
const assert = require('node:assert/strict');
const O = require('../opening-analysis.js');
const D = require('../partial-dictionary.js');
const counts = tiles => tiles.reduce((a, tile) => (a[tile]++, a), Array(34).fill(0));
test('multivariate draw probability agrees with exhaustive tiny decks', () => {
  const remaining = Array(34).fill(0); remaining[0] = 2; remaining[1] = 2; remaining[2] = 1;
  assert.equal(O.acquireProbability([0, 1], remaining, 2), 4 / 10);
  assert.equal(O.acquireProbability([0, 0], remaining, 2), 1 / 10);
  assert.equal(O.acquireProbability([0, 0, 0], remaining, 3), 0);
  assert.equal(O.acquireProbability([], remaining, 0), 1);
});
test('reported first hand selects 567 pin across every possible double run', () => {
  const result = O.analyze(D.parseTiles('23m55567p114889s'));
  const path = result.paths.find(p => p.id === 'iipeikou');
  assert.deepEqual(counts(path.core), counts(D.parseTiles('556677p')));
  assert.deepEqual(path.missing, D.parseTiles('67p'));
  assert.ok(Math.abs(path.probability - .0303697740929501) < 1e-12);
  assert.equal(result.unseen, 123);
  assert.equal(result.nextChance, result.effective.total / 123);
});
test('fourteen tiles evaluate discards and never make a discarded tile unseen again', () => {
  const result = O.analyze(D.parseTiles('123m123p123s55z67s9m'));
  assert.equal(result.unseen, 122);
  assert.equal(result.discards[0].index, 8);
  assert.equal(result.shanten, 0);
  assert.deepEqual(result.effective.tiles.map(t => t.index), [22, 25]);
});
test('completed core is 100 percent without claiming whole hand completion', () => {
  const result = O.analyze(D.parseTiles('112233m456p789s5z'));
  assert.equal(result.paths.find(p => p.id === 'iipeikou').probability, 1);
  assert.notEqual(result.shanten, -1);
});
test('a complete fourteen-tile shape does not prompt an unnecessary discard', () => {
  const result = O.analyze(D.parseTiles('123m123p123s555z11m'));
  assert.equal(result.complete, true);
  assert.equal(result.shanten, -1);
  assert.deepEqual(result.discards, []);
});
