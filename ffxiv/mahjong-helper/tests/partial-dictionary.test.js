const test = require('node:test');
const assert = require('node:assert/strict');
const H = require('../core.js');
const D = require('../partial-dictionary.js');

const counts = tiles => tiles.reduce((array, tile) => (array[tile]++, array), Array(34).fill(0));

test('speed is a conservative example distance and incomplete inputs are not classified', () => {
  const example = { coreMissing: [0], missing: [0, 9, 18] };
  assert.equal(D.assessSpeed(example, 8, true).level, 'unknown');
  assert.equal(D.assessSpeed(example, 13, true).level, 'fast');
  assert.equal(D.assessSpeed(example, 13, false).level, 'normal');
  assert.equal(D.assessSpeed({ coreMissing: [], missing: [0, 0, 9, 9, 18, 18] }, 13, true).level, 'slow');
  assert.match(D.assessSpeed(example, 13, false).reason, /화료 확률.*아닙니다/);
  const result = D.lookup(D.parseTiles('66699m63p236779s')).results.find(item => item.id === 'toitoi');
  assert.equal(result.speed.level, 'normal');
  assert.equal(result.speed.needed, result.coreMissing.length);
});

test('toitoi completion retains reported triplet and pairs instead of fixed catalog tiles', () => {
  const result = D.lookup(D.parseTiles('66699m63p236779s')).results.find(item => item.id === 'toitoi');
  const target = counts(result.example);
  assert.equal(target[5], 3);
  assert.ok(target[8] >= 2);
  assert.ok(target[24] >= 2);
  assert.equal(result.kept.length, 9);
  assert.equal(result.missing.length, 5);
  assert.equal(target[0], 0);
  assert.equal(target[31], 0);
  assert.deepEqual(target.filter(Boolean).sort(), [2, 3, 3, 3, 3]);
  assert.equal(H.shanten(target), -1);
});

test('adaptive toitoi respects fixed kan, exhausted tiles and chi incompatibility', () => {
  const kan = { type: 'kan', open: true, tiles: [31, 31, 31, 31] };
  const hand = D.parseTiles('66699m3377s');
  const result = D.lookup(hand, { melds: [kan], unavailable: [8] }).results.find(item => item.id === 'toitoi');
  const target = counts(result.example);
  assert.equal(target[31], 3);
  assert.equal(target[8], 2);
  assert.equal(result.missing.includes(8), false);
  assert.deepEqual(target.filter(Boolean).sort(), [2, 3, 3, 3, 3]);
  const chi = { type: 'chi', open: true, tiles: [0, 1, 2] };
  assert.equal(D.lookup(hand, { melds: [chi] }).results.some(item => item.id === 'toitoi'), false);
});

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
      assert.equal(result.coreKept + result.coreMissing.length, result.coreTotal);
    }
  }
});

test('unrelated example tiles do not make a distant pure straight look complete', () => {
  const { results } = D.lookup(D.parseTiles('2368m5569p13578s'));
  const straight = results.find(result => result.id === 'ittsuu');
  assert.notEqual(results[0].id, 'ittsuu');
  assert.equal(straight.coreKept, 5);
  assert.equal(straight.coreTotal, 9);
  assert.deepEqual(straight.coreMissing, D.parseTiles('2469s'));
  assert.ok(straight.kept.length > straight.coreKept);
});

test('identical-run example follows the closest pair of sequences, not matching filler', () => {
  const hand = D.parseTiles('23m55567p114889s');
  const iipeikou = D.lookup(hand).results.find(result => result.id === 'iipeikou');
  const highlighted = iipeikou.example.filter((_, index) => iipeikou.highlighted[index]);
  assert.deepEqual(counts(highlighted), counts(D.parseTiles('556677p')));
  assert.deepEqual(iipeikou.coreMissing, D.parseTiles('67p'));
  assert.equal(iipeikou.coreKept, 4);
});

test('gapped tiles across suits do not make sanshoku the leading pattern', () => {
  const reportedHand = D.lookup(D.parseTiles('1247m2447p2249s5z'));
  assert.equal(reportedHand.results[0].id, 'tanyao');
  assert.equal(reportedHand.weakEvidence, true);
  assert.ok(reportedHand.results.find(result => result.id === 'sanshoku').score < reportedHand.results[0].score);
  assert.equal(D.lookup(D.parseTiles('24m24p24s')).results[0].id, 'tanyao');
  const completeRuns = D.lookup(D.parseTiles('123m123p123s'));
  assert.equal(completeRuns.results[0].id, 'sanshoku');
  assert.equal(completeRuns.weakEvidence, false);
});

test('two actual pairs in a thirteen-tile hand do not make seven pairs the leading yaku', () => {
  const hand = D.parseTiles('34791m122358p44s');
  const { results, weakEvidence } = D.lookup(hand);
  const sevenPairs = results.find(result => result.id === 'chiitoitsu');
  assert.equal(sevenPairs.pairCount, 2);
  assert.notEqual(results[0].id, 'chiitoitsu');
  assert.equal(weakEvidence, true);
  assert.ok(sevenPairs.score < results[0].score);
  assert.equal(D.lookup(D.parseTiles('112233m44p')).results[0].id, 'chiitoitsu');
});

test('completed groups outweigh matching isolated tiles across group-based yaku', () => {
  const cases = [
    ['111m222p333s55z', 'toitoi', '커쯔·깡 3/4묶음'],
    ['112233m', 'iipeikou', '같은 순자 2/2묶음'],
    ['123m123p123s', 'sanshoku', '같은 숫자 순자 3/3종'],
    ['123456m', 'ittsuu', '123·456·789 2/3묶음'],
    ['123m456p789s22p', 'pinfu', '순자 3/4묶음'],
    ['555z', 'yakuhai', '역패 최대 3/3장']
  ];
  for (const [spec, expected, label] of cases) {
    const output = D.lookup(D.parseTiles(spec));
    assert.equal(output.results[0].id, expected, spec);
    assert.equal(output.results[0].evidenceLabel, label, spec);
  }
  assert.notEqual(D.lookup(D.parseTiles('123m')).results[0].id, 'iipeikou');
  assert.notEqual(D.lookup(D.parseTiles('1247m2447p2249s5z')).results[0].id, 'toitoi');
  assert.equal(D.lookup(D.parseTiles('112233m445566p7s')).results[0].id, 'chiitoitsu');
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

test('zero remaining tiles are excluded only when an example needs another copy', () => {
  const hand = D.parseTiles('123m123p123s');
  const base = D.lookup(hand);
  assert.ok(base.results.some(item => item.missing.includes(3)));
  const filtered = D.lookup(hand, { unavailable: [3] });
  assert.equal(filtered.blockedByUnavailable, true);
  assert.ok(filtered.results.length > 0);
  assert.ok(filtered.results.every(item => !item.missing.includes(3)));
  assert.ok(filtered.results.find(item => item.id === 'sanshoku'));

  const held = D.lookup(hand, { unavailable: [0, 9, 18] });
  const sanshoku = held.results.find(item => item.id === 'sanshoku');
  assert.ok(sanshoku);
  assert.ok([0, 9, 18].every(tile => !sanshoku.missing.includes(tile)));
});

test('exhausting all tile types can leave no representative examples', () => {
  const output = D.lookup(D.parseTiles('123m'), { unavailable: Array.from({ length: 34 }, (_, i) => i) });
  assert.equal(output.blockedByUnavailable, true);
  assert.deepEqual(output.results, []);
  assert.throws(() => D.lookup([0], { unavailable: [34] }));
  assert.throws(() => D.lookup([0], { unavailable: '1m' }));
});
