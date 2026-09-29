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

function decompositions(example) {
  const counts = tileCounts(example);
  const found = [];
  for (let pair = 0; pair < 34; pair++) {
    if (counts[pair] < 2) continue;
    counts[pair] -= 2;
    const walk = groups => {
      const first = counts.findIndex(Boolean);
      if (first < 0) { if (groups.length === 4) found.push({ pair, groups }); return; }
      if (counts[first] >= 3) {
        counts[first] -= 3;
        walk([...groups, [first, first, first]]);
        counts[first] += 3;
      }
      if (first < 27 && first % 9 <= 6 && counts[first + 1] && counts[first + 2]) {
        counts[first]--; counts[first + 1]--; counts[first + 2]--;
        walk([...groups, [first, first + 1, first + 2]]);
        counts[first]++; counts[first + 1]++; counts[first + 2]++;
      }
    };
    walk([]);
    counts[pair] += 2;
  }
  return found;
}

function validGroups(id, groups, pair, seat, round) {
  const all = [...groups.flat(), pair, pair];
  const runs = groups.filter(group => group[0] !== group[1]);
  const triples = groups.filter(group => group[0] === group[1]);
  const suited = all.filter(tile => tile < 27);
  const suits = new Set(suited.map(tile => Math.floor(tile / 9)));
  if (id === 'tanyao') return all.every(tile => !H.isTerminal(tile));
  if (id === 'yakuhai') return triples.some(group => [seat, round, 31, 32, 33].includes(group[0]));
  if (id === 'toitoi') return triples.length === 4;
  if (id === 'honitsu') return suits.size === 1 && all.some(tile => tile >= 27);
  if (id === 'chinitsu') return suits.size === 1 && all.every(tile => tile < 27);
  if (id === 'pinfu') return runs.length === 4 && ![seat, round, 31, 32, 33].includes(pair);
  if (id === 'sanshoku') return Array.from({ length: 7 }, (_, start) => start).some(start =>
    [0, 1, 2].every(suit => runs.some(group => group[0] === suit * 9 + start)));
  if (id === 'ittsuu') return [0, 1, 2].some(suit =>
    [0, 3, 6].every(start => runs.some(group => group[0] === suit * 9 + start)));
  if (id === 'iipeikou') return runs.some((group, index) =>
    runs.some((other, otherIndex) => index !== otherIndex && group[0] === other[0]));
  return false;
}

const contextualCache = new Map();
function contextualExamplesFor(entry, seat, round, melds) {
  if (!melds.length) return examplesFor(entry, seat, round);
  if (entry.id === 'chiitoitsu' || entry.id === 'kokushi') return [];
  const fixed = melds.map(meld => meld.tiles.slice(0, 3).sort((a, b) => a - b));
  const cacheKey = `${entry.id}|${seat}|${round}|${fixed.map(group => group.join(',')).sort().join(';')}`;
  if (contextualCache.has(cacheKey)) return contextualCache.get(cacheKey);
  const examples = [];
  const seen = new Set();
  const chooseReplacements = (groups, count, start = 0, selected = []) => {
    if (selected.length === count) return [selected];
    const combinations = [];
    for (let index = start; index <= groups.length - (count - selected.length); index++)
      combinations.push(...chooseReplacements(groups, count, index + 1, [...selected, index]));
    return combinations;
  };
  for (const base of examplesFor(entry, seat, round)) for (const { pair, groups } of decompositions(base)) {
    for (const replaced of chooseReplacements(groups, fixed.length)) {
      const candidateGroups = [...groups.filter((_, index) => !replaced.includes(index)), ...fixed];
      if (!validGroups(entry.id, candidateGroups, pair, seat, round)) continue;
      const tiles = [...candidateGroups.flat(), pair, pair];
      if (tileCounts(tiles).some(n => n > 4)) continue;
      const key = tileCounts(tiles).join(',');
      if (!seen.has(key)) { seen.add(key); examples.push(tiles); }
    }
  }
  contextualCache.set(cacheKey, examples);
  return examples;
}

function runEvidence(counts, base, fullWeight) {
  // A gap such as 2·4 needs its middle tile before it is a sequence clue.
  const a = counts[base] > 0;
  const b = counts[base + 1] > 0;
  const c = counts[base + 2] > 0;
  if (a && b && c) return fullWeight;
  return (a && b) || (b && c) ? 1 : 0;
}

function affinity(id, counts, seat, round) {
  const n = counts.reduce((sum, count) => sum + count, 0);
  const suits = [0, 1, 2].map(suit => counts.slice(suit * 9, suit * 9 + 9).reduce((a, b) => a + b, 0));
  const honors = counts.slice(27).reduce((a, b) => a + b, 0);
  const simple = counts.reduce((a, b, tile) => a + (H.isTerminal(tile) ? 0 : b), 0);
  const pairs = counts.filter(x => x >= 2).length;
  const triples = counts.filter(x => x >= 3).length;
  const singletons = counts.filter(x => x === 1).length;
  const maxSuit = Math.max(...suits);
  if (id === 'tanyao') return simple * 1.3 - (n - simple) * 1.8;
  if (id === 'yakuhai') return Math.max(...[...new Set([seat, round, 31, 32, 33])].map(t => counts[t])) * 5;
  // Matching an example's lone tiles does not create seven distinct pairs.
  if (id === 'chiitoitsu') return pairs * 3.5 - triples * 3 - Math.max(0, singletons - 2) * 1.5;
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
    let best = -5;
    for (let start = 0; start <= 6; start++)
      best = Math.max(best, -5 + [0, 1, 2].reduce((score, suit) =>
        score + runEvidence(counts, suit * 9 + start, 4), 0));
    return best;
  }
  if (id === 'ittsuu') {
    let best = -2;
    for (let suit = 0; suit < 3; suit++)
      best = Math.max(best, -2 + [0, 3, 6].reduce((score, block) =>
        score + runEvidence(counts, suit * 9 + block, 4.5), 0));
    return best;
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

function lookup(tiles, { seat = 27, round = 27, opened = false, melds = [], limit = catalog.entries.length } = {}) {
  if (!Array.isArray(tiles) || tiles.length > 14) throw new Error('0~14장의 패를 입력해 주세요.');
  if (![seat, round].every(t => Number.isInteger(t) && t >= 27 && t <= 30)) throw new Error('자풍·장풍은 동·남·서·북 중 선택하세요.');
  if (!Array.isArray(melds) || melds.length > 4 || melds.some(meld =>
    !['chi', 'pon', 'kan'].includes(meld.type) || !Array.isArray(meld.tiles) ||
    meld.tiles.length !== (meld.type === 'kan' ? 4 : 3))) throw new Error('옆으로 낸 패 묶음이 올바르지 않습니다.');
  const physical = tileCounts([...tiles, ...melds.flatMap(meld => meld.tiles)]);
  if (physical.some(n => n > 4)) throw new Error('손패와 오른쪽 묶음을 합쳐 같은 패는 네 장까지입니다.');
  const input = [...tiles, ...melds.flatMap(meld => meld.tiles.slice(0, 3))];
  if (input.length > 14) throw new Error('손패와 오른쪽 묶음을 합쳐 14장 구조를 넘었어요. 손패를 줄여 주세요.');
  const counts = tileCounts(input);
  if (!input.length) return { limitedEvidence: true, weakEvidence: true, results: [] };
  const isOpened = opened || melds.some(meld => meld.open);
  const results = catalog.entries.filter(entry => !isOpened || entry.openAllowed).map(entry => {
    const bonus = affinity(entry.id, counts, seat, round);
    let chosen;
    for (const example of contextualExamplesFor(entry, seat, round, melds)) {
      const comparison = compareExample(counts, example);
      const highlighted = highlightExample(entry.id, comparison.example, seat, round);
      const focusCounts = tileCounts(comparison.example.filter((_, index) => highlighted[index]));
      const coreKept = focusCounts.reduce((total, count, tile) => total + Math.min(counts[tile], count), 0);
      const coreTotal = highlighted.filter(Boolean).length;
      const coreMissing = [];
      focusCounts.forEach((count, tile) => {
        for (let i = counts[tile]; i < count; i++) coreMissing.push(tile);
      });
      // An example's filler tiles should not outweigh the tiles that define its yaku.
      const score = coreKept * 2 + (comparison.kept.length - coreKept) * .5
        - comparison.toSetAside.length * 2 + bonus;
      if (!chosen || score > chosen.score) chosen = {
        ...comparison, score, coreKept, coreTotal, coreMissing, highlighted
      };
    }
    if (!chosen) return null;
    return { id: entry.id, name: entry.name, condition: entry.condition,
      pairCount: entry.id === 'chiitoitsu' ? counts.filter(n => n >= 2).length : undefined,
      openAllowed: entry.openAllowed, source: catalog.source, ...chosen };
  }).filter(entry => entry && entry.kept.length > 0);
  results.sort((a, b) => b.score - a.score || b.kept.length - a.kept.length || a.name.localeCompare(b.name, 'ko'));
  return { limitedEvidence: input.length < 4,
    weakEvidence: !results.length || results[0].score < Math.max(4, input.length * .5),
    results: results.slice(0, Math.max(0, Math.min(limit, results.length))) };
}

return { catalog, parseTiles, examplesFor, highlightExample, lookup };
});
