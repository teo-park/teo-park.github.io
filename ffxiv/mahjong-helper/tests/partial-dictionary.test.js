const test = require('node:test');
const assert = require('node:assert/strict');
const H = require('../core.js');
const D = require('../partial-dictionary.js');

const counts = tiles => tiles.reduce((array, tile) => (array[tile]++, array), Array(34).fill(0));

test('all catalog examples are physical, complete hands with the stated core pattern', () => {
  assert.equal(D.catalog.entries.length, 11);
  for (const entry of D.catalog.entries) {
    const examples = D.examplesFor(entry, 27, 28);
    assert.ok(examples.length >= 3, entry.id);
    for (const tiles of examples) {
      const c = counts(tiles);
      assert.equal(tiles.length, 14, entry.id);
      assert.ok(c.every(n => n <= 4), entry.id);
      assert.equal(H.shanten(c), -1, entry.id);
      const highlight = D.highlightExample(entry.id, tiles, 27, 28);
      assert.equal(highlight.length, 14, entry.id);
      assert.equal(highlight.filter(Boolean).length,
        ({ yakuhai: 3, toitoi: 12, sanshoku: 9, ittsuu: 9, iipeikou: 6 })[entry.id] || 14, entry.id);
      if (entry.id === 'tanyao') assert.ok(tiles.every(t => !H.isTerminal(t)));
      if (entry.id === 'yakuhai') assert.ok([27, 28, 31, 32, 33].some(t => c[t] >= 3));
      if (entry.id === 'chiitoitsu') assert.equal(c.filter(n => n === 2).length, 7);
      if (entry.id === 'toitoi') assert.deepEqual(c.filter(Boolean).sort(), [2, 3, 3, 3, 3]);
      if (entry.id === 'honitsu' || entry.id === 'chinitsu') {
        const suits = [0, 1, 2].filter(s => c.slice(s * 9, s * 9 + 9).some(Boolean));
        assert.equal(suits.length, 1);
        assert.equal(c.slice(27).some(Boolean), entry.id === 'honitsu');
      }
      if (entry.id === 'kokushi') assert.ok(H.KOKUSHI.every(t => c[t] >= 1));
    }
  }
});

test('highlight isolates the tiles that form the named yaku', () => {
  const focused = (id, spec) => {
    const tiles = D.parseTiles(spec).sort((a, b) => a - b);
    const highlighted = D.highlightExample(id, tiles, 27, 28);
    return tiles.filter((_, index) => highlighted[index]);
  };
  assert.deepEqual(counts(focused('sanshoku', '234m234p234s567m55p')),
    counts(D.parseTiles('234m234p234s')));
  assert.deepEqual(counts(focused('ittsuu', '123m456m789m234p55s')),
    counts(D.parseTiles('123456789m')));
  assert.deepEqual(counts(focused('iipeikou', '234m234m567p789s55p')),
    counts(D.parseTiles('223344m')));
  assert.deepEqual(counts(focused('yakuhai', '123m456p789s555z22m')),
    counts(D.parseTiles('555z')));
});

test('partial inputs return every matching yaku and explain required changes', () => {
  const scenarios = [
    ['123m123p123s', 'sanshoku', 9],
    ['112233m44p', 'chiitoitsu', 8],
    ['19m19p19s123z', 'kokushi', 9],
    ['55z123m', 'yakuhai', 5],
    ['123m456m789m', 'ittsuu', 9]
  ];
  for (const [spec, id, minimum] of scenarios) {
    const input = D.parseTiles(spec);
    const { results } = D.lookup(input);
    assert.ok(results.length > 5);
    assert.equal(results.length, D.lookup(input, { limit: D.catalog.entries.length }).results.length);
    assert.equal(results[0].id, id, spec);
    assert.ok(results[0].kept.length >= minimum, spec);
    for (const result of results) {
      assert.equal(result.kept.length + result.toSetAside.length, input.length);
      assert.equal(result.kept.length + result.missing.length, 14);
      assert.equal(result.example.length, 14);
    }
  }
});

test('seat wind affects yakuhai examples and an open hand excludes closed-only yaku', () => {
  const westPair = D.parseTiles('33z');
  const west = D.lookup(westPair, { seat: 29, round: 27, limit: 11 });
  const yakuhai = west.results.find(x => x.id === 'yakuhai');
  assert.equal(counts(yakuhai.example)[29], 3);
  const open = D.lookup(D.parseTiles('112233m44p'), { opened: true, limit: 11 });
  assert.ok(open.results.every(x => x.openAllowed));
  assert.ok(!open.results.some(x => x.id === 'chiitoitsu' || x.id === 'pinfu'));
});

test('few tiles are marked as weak evidence and invalid tile inputs are rejected', () => {
  assert.equal(D.lookup(D.parseTiles('23m')).limitedEvidence, true);
  assert.deepEqual(D.lookup([]).results, []);
  assert.throws(() => D.parseTiles('55555z'));
  assert.throws(() => D.parseTiles('8z'));
  assert.throws(() => D.lookup([0, 0, 0, 0, 0]));
});
