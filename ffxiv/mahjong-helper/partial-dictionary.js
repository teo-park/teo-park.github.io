/* Partial-hand yaku study prototype. Scores rank representative examples,
   not drawing odds, exact shanten, or guaranteed winning paths. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core.js'), require('./yaku-catalog.json'));
  } else {
    root.createMahjongDictionary = catalog => factory(root.MahjongHelper, catalog);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (H, catalog) {

const permutations = [
  [0, 1, 2], [0, 2, 1], [1, 0, 2],
  [1, 2, 0], [2, 0, 1], [2, 1, 0]
];

function parseTiles(spec) {
  if (typeof spec !== 'string' || !spec) throw new Error('패 표기를 입력해 주세요.');
  const tiles = [];
  let consumed = 0;
  for (const match of spec.matchAll(/([1-9]+)([mpsz])/g)) {
    if (match.index !== consumed) throw new Error(`잘못된 패 표기: ${spec}`);
    consumed += match[0].length;
    const base = { m: 0, p: 9, s: 18, z: 27 }[match[2]];
    for (const digit of match[1]) {
      const rank = Number(digit);
      if (match[2] === 'z' && rank > 7) throw new Error(`자패는 1~7입니다: ${spec}`);
      tiles.push(base + rank - 1);
    }
  }
  if (consumed !== spec.length || tiles.length > 14) throw new Error(`잘못된 패 표기: ${spec}`);
  const counts = tileCounts(tiles);
  if (counts.some(n => n > 4)) throw new Error(`같은 패는 네 장까지입니다: ${spec}`);
  return tiles;
}

function tileCounts(tiles) {
  const counts = Array(34).fill(0);
  for (const tile of tiles) {
    if (!Number.isInteger(tile) || tile < 0 || tile > 33) throw new Error('패 번호는 0~33이어야 합니다.');
    counts[tile]++;
  }
  return counts;
}

function transform(example, permutation, honor = 31) {
  return example.map(tile => tile < 27
    ? permutation[Math.floor(tile / 9)] * 9 + tile % 9
    : tile === 31 && honor !== 31 ? honor : tile);
}

function examplesFor(entry, seat, round) {
  const honors = entry.id === 'yakuhai' ? [...new Set([seat, round, 31, 32, 33])] : [31];
  const examples = [];
  const seen = new Set();
  for (const spec of entry.examples) {
    const base = parseTiles(spec);
    const variants = [base];
    if (entry.id === 'sanshoku' || entry.id === 'iipeikou') {
      const affected = entry.id === 'sanshoku' ? 9 : 6;
      for (let delta = -1; delta <= 5; delta++) {
        if (delta === 0) continue;
        variants.push(base.map((tile, index) => index < affected ? tile + delta : tile));
      }
    }
    if (entry.id === 'kokushi') {
      const thirteen = base.slice(0, 13);
      for (const tile of H.KOKUSHI) variants.push([...thirteen, tile]);
    }
    for (const variant of variants) for (const permutation of permutations) for (const honor of honors) {
      const tiles = transform(variant, permutation, honor);
      const counts = tileCounts(tiles);
      if (counts.some(n => n > 4)) continue;
      const key = counts.join(',');
      if (!seen.has(key)) { seen.add(key); examples.push(tiles); }
    }
  }
  return examples;
}

function affinity(id, counts, seat, round) {
  const n = counts.reduce((sum, count) => sum + count, 0);
  const suits = [0, 1, 2].map(suit => counts.slice(suit * 9, suit * 9 + 9).reduce((a, b) => a + b, 0));
  const honors = counts.slice(27).reduce((a, b) => a + b, 0);
  const simple = counts.reduce((a, b, tile) => a + (H.isTerminal(tile) ? 0 : b), 0);
  const pairs = counts.filter(x => x >= 2).length;
  const triples = counts.filter(x => x >= 3).length;
  const maxSuit = Math.max(...suits);
  if (id === 'tanyao') return simple * 1.3 - (n - simple) * 1.8;
  if (id === 'yakuhai') return Math.max(...[...new Set([seat, round, 31, 32, 33])].map(t => counts[t])) * 3;
  if (id === 'chiitoitsu') return pairs * 4 - triples * 3;
  if (id === 'toitoi') return triples * 5 + pairs;
  if (id === 'honitsu') return maxSuit * 1.2 + honors * .7 - (n - maxSuit - honors) * 1.6;
  if (id === 'chinitsu') return maxSuit * 1.2 - (n - maxSuit) * 1.6;
  if (id === 'kokushi') return H.KOKUSHI.filter(t => counts[t]).length * 2 - simple * 2;
  if (id === 'pinfu') {
    let links = 0;
    for (let suit = 0; suit < 3; suit++) for (let rank = 0; rank < 8; rank++)
      if (counts[suit * 9 + rank] && counts[suit * 9 + rank + 1]) links++;
    return links * 1.5 - triples * 2 - honors * .5;
  }
  if (id === 'sanshoku') {
    let best = 0;
    for (let start = 0; start <= 6; start++) {
      let members = 0;
      for (let suit = 0; suit < 3; suit++) for (let rank = start; rank < start + 3; rank++)
        members += counts[suit * 9 + rank] > 0 ? 1 : 0;
      best = Math.max(best, members);
    }
    return best * 1.3;
  }
  if (id === 'ittsuu') {
    let best = 0;
    for (let suit = 0; suit < 3; suit++)
      best = Math.max(best, counts.slice(suit * 9, suit * 9 + 9).filter(x => x).length);
    return best * 1.3;
  }
  if (id === 'iipeikou') {
    let best = 0;
    for (let suit = 0; suit < 3; suit++) for (let start = 0; start <= 6; start++) {
      const base = suit * 9 + start;
      best = Math.max(best, Math.min(2, counts[base]) + Math.min(2, counts[base + 1]) + Math.min(2, counts[base + 2]));
    }
    return best * 1.5;
  }
  return 0;
}

function compareExample(inputCounts, example) {
  const target = tileCounts(example);
  const kept = [], toSetAside = [], missing = [];
  for (let tile = 0; tile < 34; tile++) {
    for (let i = 0; i < Math.min(inputCounts[tile], target[tile]); i++) kept.push(tile);
    for (let i = target[tile]; i < inputCounts[tile]; i++) toSetAside.push(tile);
    for (let i = inputCounts[tile]; i < target[tile]; i++) missing.push(tile);
  }
  return { kept, toSetAside, missing, example: example.slice().sort((a, b) => a - b) };
}

function highlightExample(id, example, seat = 27, round = 27) {
  if (!['yakuhai', 'toitoi', 'sanshoku', 'ittsuu', 'iipeikou'].includes(id))
    return example.map(() => true);
  const counts = tileCounts(example);
  const focus = Array(34).fill(0);
  if (id === 'yakuhai') {
    const honor = [...new Set([seat, round, 31, 32, 33])].find(tile => counts[tile] >= 3);
    if (honor !== undefined) focus[honor] = 3;
  } else if (id === 'toitoi') {
    counts.forEach((count, tile) => { if (count >= 3) focus[tile] = 3; });
  } else if (id === 'sanshoku') {
    for (let start = 0; start <= 6; start++) {
      const sequence = [0, 1, 2].flatMap(suit => [0, 1, 2].map(offset => suit * 9 + start + offset));
      if (sequence.every(tile => counts[tile] > 0)) {
        sequence.forEach(tile => { focus[tile] = 1; });
        break;
      }
    }
  } else if (id === 'ittsuu') {
    for (let suit = 0; suit < 3; suit++) {
      const run = Array.from({ length: 9 }, (_, rank) => suit * 9 + rank);
      if (run.every(tile => counts[tile] > 0)) {
        run.forEach(tile => { focus[tile] = 1; });
        break;
      }
    }
  } else if (id === 'iipeikou') {
    findDoubleRun: for (let suit = 0; suit < 3; suit++) for (let start = 0; start <= 6; start++) {
      const run = [0, 1, 2].map(offset => suit * 9 + start + offset);
      if (run.every(tile => counts[tile] >= 2)) {
        run.forEach(tile => { focus[tile] = 2; });
        break findDoubleRun;
      }
    }
  }
  return example.map(tile => focus[tile] > 0 ? (focus[tile]--, true) : false);
}

function lookup(tiles, { seat = 27, round = 27, opened = false, limit = catalog.entries.length } = {}) {
  if (!Array.isArray(tiles) || tiles.length > 14) throw new Error('0~14장의 패를 입력해 주세요.');
  if (![seat, round].every(t => Number.isInteger(t) && t >= 27 && t <= 30)) throw new Error('자풍·장풍은 동·남·서·북 중 선택하세요.');
  const counts = tileCounts(tiles);
  if (counts.some(n => n > 4)) throw new Error('같은 패는 네 장까지입니다.');
  if (!tiles.length) return { limitedEvidence: true, results: [] };
  const results = catalog.entries.filter(entry => !opened || entry.openAllowed).map(entry => {
    const bonus = affinity(entry.id, counts, seat, round);
    let chosen;
    for (const example of examplesFor(entry, seat, round)) {
      const comparison = compareExample(counts, example);
      const score = comparison.kept.length * 2 - comparison.toSetAside.length * 2 + bonus;
      if (!chosen || score > chosen.score) chosen = { ...comparison, score };
    }
    return { id: entry.id, name: entry.name, condition: entry.condition,
      openAllowed: entry.openAllowed, source: catalog.source, ...chosen,
      highlighted: highlightExample(entry.id, chosen.example, seat, round) };
  }).filter(entry => entry.kept.length > 0);
  results.sort((a, b) => b.score - a.score || b.kept.length - a.kept.length || a.name.localeCompare(b.name, 'ko'));
  return { limitedEvidence: tiles.length < 4, results: results.slice(0, Math.max(0, Math.min(limit, results.length))) };
}

return { catalog, parseTiles, examplesFor, highlightExample, lookup };
});
