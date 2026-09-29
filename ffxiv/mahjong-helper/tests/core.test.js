const test = require('node:test');
const assert = require('node:assert/strict');
const H = require('../core.js');

function hand(spec) {
  const counts = Array(34).fill(0);
  for (const part of spec.matchAll(/([1-9]+)([mpsz])/g)) {
    const base = { m: 0, p: 9, s: 18, z: 27 }[part[2]];
    for (const digit of part[1]) counts[base + Number(digit) - 1]++;
  }
  return counts;
}

test('complete standard, seven pairs, and thirteen orphans are recognized', () => {
  assert.equal(H.shanten(hand('123m123p123s111z22z')), -1);
  assert.equal(H.shanten(hand('112233m445566p77s')), -1);
  assert.equal(H.shanten(hand('19m19p19s1234567z1m')), -1);
});

test('one tile away and effective tiles', () => {
  const c = hand('123m123p123s11z45m');
  assert.equal(H.shanten(c), 0);
  const useful = H.effectiveTiles(c);
  assert.deepEqual(useful.tiles.map(t => t.index), [2, 5]);
  assert.equal(useful.total, 7);
});

test('discard suggestions preserve the input hand and rank ready discards', () => {
  const c = hand('123m123p123s11z45m9s');
  const before = c.slice();
  const options = H.discards(c);
  assert.equal(options[0].index, 26);
  assert.equal(options[0].shanten, 0);
  assert.deepEqual(c, before);
});

test('candidate honor honors seat and round wind', () => {
  const c = hand('123m123p123s11z45m');
  assert.ok(H.candidates(c, 27, 28).some(x => x.title.startsWith('역패')));
  assert.ok(!H.candidates(c, 29, 28).some(x => x.title.startsWith('역패')));
});

test('fixed chi, pon, or kan melds count toward standard shanten', () => {
  assert.equal(H.shanten(hand('123p123s789m22z'), 1), -1);
  assert.equal(H.shanten(hand('123p456s22z'), 2), -1);
  assert.equal(H.shanten(hand('123p22z'), 3), -1);
  assert.equal(H.shanten(hand('22z'), 4), -1);
  assert.equal(H.shanten(hand('123p123s45m22z'), 1), 0);
  assert.equal(H.shanten(hand('123p123s789m22z')), null);
});

test('four copies in a kan are excluded from the effective tiles', () => {
  const c=hand('123p123s45m22z');
  const visible=c.slice();
  visible[2]=4;
  const result=H.effectiveTiles(c,1,visible);
  assert.deepEqual(result.tiles.map(x=>x.index),[5]);
  assert.equal(result.total,4);
});
