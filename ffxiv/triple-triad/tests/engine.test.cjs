const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const T = require('../engine.js');
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../data.js'), 'utf8'), context);
const data = JSON.parse(JSON.stringify(context.window.TRIPLE_TRIAD_DATA));
const all = new Set(data.cards.map(c => c.id));

test('updater parses quoted commas, embedded newlines and doubled quotes without shifting sheet IDs', async () => {
  const {parseCsv} = await import('../scripts/update-data.mjs');
  const rows = parseCsv('\uFEFF#,Name,Description\r\n1,"한글, 이름","첫 줄\n둘째 줄"\r\n2,"인물 ""별명""",설명', ['#', 'Name']);
  assert.deepEqual(rows, [{'#': '1', Name: '한글, 이름'}, {'#': '2', Name: '인물 "별명"'}]);
  assert.throws(() => parseCsv('#,Name\n1,"unfinished'));
});

test('catalog has unique IDs and display numbers, valid stats, and all source links', () => {
  assert.equal(data.cards.length, data.count);
  assert.equal(new Set(data.cards.map(c => c.id)).size, data.count);
  assert.equal(new Set(data.cards.map(c => c.number)).size, data.count);
  assert.ok(data.count >= 475);
  assert.equal(data.cards.filter(c => c.korean).length, data.count);
  for (const c of data.cards) {
    assert.ok(c.sources.length && c.stars >= 1 && c.stars <= 5 && c.typeId >= 0 && c.typeId <= 4);
    assert.deepEqual(Object.keys(c.stats).sort(), ['bottom', 'left', 'right', 'top']);
    assert.ok(Object.values(c.stats).every(n => Number.isInteger(n) && n >= 1 && n <= 10));
    assert.match(c.official, /^https:\/\/guide\.ff14\.co\.kr\//);
    for (const s of c.sources) {
      assert.ok(s.name && s.method && s.original);
      assert.ok(data.groups.some(([id]) => id === s.group));
      assert.equal(new URL(s.link).protocol, 'https:');
      if (s.npc) { assert.ok(s.npc.name && s.npc.location); assert.equal(s.npc.rules.length, s.npc.ruleIds.length); }
    }
  }
  assert.equal(data.rules.length, T.RULES.length);
  assert.equal(new Set(data.cards.flatMap(c => c.sources.filter(s => s.npc).map(s => s.npc.id))).size, data.npcCount);
});
test('search recognizes Korean initials, English, locations and display numbers without confusing IDs', () => {
  const chocobo = data.cards.find(c => c.name === '초코보');
  assert.ok(T.matches(chocobo, 'ㅊㅋㅂ'));
  assert.ok(T.matches(chocobo, 'ChOcObO'));
  const resident = data.cards.find(c => c.sources.some(s => s.npc?.location));
  assert.ok(T.matches(resident, resident.sources.find(s => s.npc).npc.location));
  const ex = data.cards.find(c => c.ex && c.order === 1);
  assert.ok(T.matches(ex, 'EX. 1'));
  assert.equal(T.matches(ex, '1'), false);
  const shifted = data.cards.find(c => !c.ex && c.order !== c.id);
  assert.ok(T.matches(shifted, String(shifted.order)));
  assert.equal(T.matches(shifted, String(shifted.id)), false);
});
test('backup round-trip preserves unknown future IDs, validates atomically and deduplicates', () => {
  assert.deepEqual([...T.parseBackup(T.backup(new Set([1, 4, 999999])))], [1, 4, 999999]);
  const base = {type: 'ffxiv-triple-triad', schemaVersion: 1, collected: [1, 1, 2]};
  assert.deepEqual([...T.parseBackup(JSON.stringify(base))], [1, 2]);
  for (const collected of [[1, -2], [1, '2'], [1, 2.5], null]) assert.throws(() => T.parseBackup(JSON.stringify({...base, collected})));
  assert.throws(() => T.parseBackup('[1,2,3]'));
  assert.throws(() => T.parseBackup(JSON.stringify({...base, schemaVersion: 2})));
  assert.throws(() => T.parseBackup('{oops'));
});
test('5 unique cards, one 5-star and two combined 4/5-stars are enforced', () => {
  const make = stars => stars.map((stars, id) => ({id, stars}));
  assert.ok(T.legal(make([5, 4, 3, 3, 3])));
  assert.ok(T.legal(make([4, 4, 3, 3, 3])));
  assert.ok(T.legal(make([1, 1, 1, 1, 1])));
  assert.equal(T.legal(make([5, 5, 3, 3, 3])), false);
  assert.equal(T.legal(make([4, 4, 4, 3, 3])), false);
  assert.equal(T.legal(make([3, 3, 3, 3])), false);
  assert.equal(T.legal([{id: 1, stars: 1}, {id: 1, stars: 1}], false), false);
});
test('Reverse and Fallen Ace obey the 1/A exception in both directions', () => {
  for (const rules of [[], [10], [11], [10, 11]]) for (let a = 1; a <= 10; a++) for (let b = 1; b <= 10; b++) {
    assert.equal(a === b ? T.beats(a, b, rules) : T.beats(a, b, rules) === T.beats(b, a, rules), false);
  }
  assert.equal(T.beats(1, 10, []), false);
  assert.equal(T.beats(1, 10, [11]), true);
  assert.equal(T.beats(10, 1, [10, 11]), true);
  assert.equal(T.beats(1, 2, [11]), false);
  assert.equal(T.beats(1, 2, [10, 11]), true);
});
test('type changes clamp at 1/A and do not affect untyped cards', () => {
  assert.equal(T.adjusted(9, 1, 3, [12]), 10);
  assert.equal(T.adjusted(2, 1, 4, [13]), 1);
  assert.equal(T.adjusted(7, 0, 5, [13]), 7);
  assert.equal(T.adjusted(7, 1, 2, [13, 10]), 5);
});
test('incompatible, excessive, duplicate and unknown rules fail clearly', () => {
  for (const ids of [[2, 3], [8, 9], [12, 13], [1, 2, 4, 5, 6], [10, 10], [99]]) assert.ok(T.validateRules(ids));
  assert.equal(T.validateRules([10, 11, 4, 6]), '');
  for (const rules of [[1], [7], [15]]) assert.ok(T.recommend(data.cards, all, rules).unavailable);
});
test('owned-only mode never borrows cards and explains impossible pools', () => {
  const starter = new Set([1, 3, 6, 7, 10]);
  assert.deepEqual(new Set(T.recommend(data.cards, starter).deck.map(c => c.id)), starter);
  assert.ok(T.recommend(data.cards, new Set()).error);
  assert.ok(T.recommend(data.cards, new Set(data.cards.filter(c => c.stars === 5).map(c => c.id))).error);
  const target = T.recommend(data.cards, new Set(), [], true);
  assert.equal(target.allCards, true); assert.ok(T.legal(target.deck));
});
test('every supported rule and important combinations produce legal decks', () => {
  for (const rules of [[], ...T.RULES.filter(r => ![1, 7, 15].includes(r.id)).map(r => [r.id]), [10, 11], [10, 12], [10, 13], [4, 6], [4, 6, 10, 11], [12, 8]]) {
    const result = T.recommend(data.cards, all, rules);
    assert.equal(result.error, undefined, rules.join(','));
    assert.ok(T.legal(result.deck));
    assert.equal(result.details.length, 5);
    assert.ok(result.deck.every(c => all.has(c.id)));
  }
});
test('Reverse favors low values; Ascension favors a shared type; Descension avoids penalties', () => {
  const normal = T.recommend(data.cards, all).deck, reverse = T.recommend(data.cards, all, [10]).deck;
  const sum = deck => deck.reduce((s, c) => s + Object.values(c.stats).reduce((a, b) => a + b), 0);
  assert.ok(sum(reverse) < sum(normal));
  const ascension = T.recommend(data.cards, all, [12]).deck;
  assert.ok([1, 2, 3, 4].some(type => ascension.filter(c => c.typeId === type).length >= 4));
  assert.ok(T.recommend(data.cards, all, [13]).deck.every(c => c.typeId === 0));
});
