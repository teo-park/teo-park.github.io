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
// A toitoi hand consists of four distinct triplets and a distinct pair.
// For each possible pair, the triplets retaining most input tiles give an
// exact minimum-missing completion, without enumerating every combination.
function toitoiExamples(counts, melds, unavailable) {
  if (melds.some(meld => meld.type === 'chi')) return [];
  const fixed = melds.map(meld => meld.tiles[0]);
  const examples = [];
  for (let pair = 0; pair < 34; pair++) {
    if (fixed.includes(pair) || unavailable.has(pair) && counts[pair] < 2) continue;
    const candidates = Array.from({ length: 34 }, (_, tile) => tile)
      .filter(tile => tile !== pair && !fixed.includes(tile) && (!unavailable.has(tile) || counts[tile] >= 3))
      .sort((a, b) => Math.min(counts[b], 3) - Math.min(counts[a], 3) || a - b);
    const needed = 4 - fixed.length;
    if (candidates.length < needed) continue;
    examples.push([...fixed, ...candidates.slice(0, needed)].flatMap(tile => [tile, tile, tile]).concat(pair, pair));
  }
  return examples;
}

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

function runProgress(counts, base) {
  const a = counts[base] > 0, b = counts[base + 1] > 0, c = counts[base + 2] > 0;
  const complete = a && b && c;
  return { complete: Number(complete), adjacent: Number(!complete && ((a && b) || (b && c))) };
}

function bestThreeRuns(counts, starts, fixedChiStarts = new Set()) {
  let best = { complete: 0, adjacent: 0, score: -Infinity };
  for (const group of starts) {
    const progress = group.map(start => fixedChiStarts.has(start)
      ? { complete: 1, adjacent: 0 } : runProgress(counts, start));
    const complete = progress.reduce((sum, part) => sum + part.complete, 0);
    const adjacent = progress.reduce((sum, part) => sum + part.adjacent, 0);
    const score = complete * 7.5 + adjacent * 1.2 - 3;
    if (score > best.score) best = { complete, adjacent, score };
  }
  return best;
}

function maxDisjointRuns(source) {
  const counts = source.slice();
  const memo = new Map();
  const walk = start => {
    if (start >= 27) return 0;
    const key = `${start}|${counts.join('')}`;
    if (memo.has(key)) return memo.get(key);
    let best = walk(start + 1);
    if (start % 9 <= 6 && counts[start] && counts[start + 1] && counts[start + 2]) {
      counts[start]--; counts[start + 1]--; counts[start + 2]--;
      best = Math.max(best, 1 + walk(start));
      counts[start]++; counts[start + 1]++; counts[start + 2]++;
    }
    memo.set(key, best);
    return best;
  };
  return walk(0);
}

function structuralEvidence(id, counts, seat, round, concealedCounts, melds) {
  const n = counts.reduce((sum, count) => sum + count, 0);
  const suits = [0, 1, 2].map(suit => counts.slice(suit * 9, suit * 9 + 9).reduce((a, b) => a + b, 0));
  const honors = counts.slice(27).reduce((a, b) => a + b, 0);
  const simple = counts.reduce((a, b, tile) => a + (H.isTerminal(tile) ? 0 : b), 0);
  const pairs = counts.filter(x => x >= 2).length;
  const triples = counts.filter(x => x >= 3).length;
  const singletons = counts.filter(x => x === 1).length;
  const maxSuit = Math.max(...suits);
  const fixedChiStarts = new Set(melds.filter(meld => meld.type === 'chi').map(meld => Math.min(...meld.tiles)));
  if (id === 'tanyao') return { score: simple * 1.2 - (n - simple) * 3, label: `2~8 수패 ${simple}/${n}장` };
  if (id === 'yakuhai') {
    const count = Math.max(...[...new Set([seat, round, 31, 32, 33])].map(tile => counts[tile]));
    return { score: [0, 1, 6, 16, 16][count], label: `역패 최대 ${Math.min(count, 3)}/3장` };
  }
  if (id === 'chiitoitsu') return {
    score: pairs * 5 - Math.max(0, singletons - 2) * 2 - triples * 4,
    label: `또이츠 ${pairs}/7쌍`
  };
  if (id === 'toitoi') {
    const fixedTriples = melds.filter(meld => meld.type !== 'chi').length;
    const triplets = fixedTriples + concealedCounts.filter(count => count >= 3).length;
    const loosePairs = concealedCounts.filter(count => count === 2).length;
    const looseTiles = concealedCounts.reduce((sum, count) => sum + count, 0);
    return { score: triplets * 8 + loosePairs * 2 - maxDisjointRuns(concealedCounts) * 2
      - Math.max(0, looseTiles - (triplets - fixedTriples) * 3 - loosePairs * 2 - 3) * .5,
      label: `커쯔·깡 ${Math.min(triplets, 4)}/4묶음` };
  }
  if (id === 'honitsu') return {
    score: maxSuit * 1.4 + honors * .9 - (n - maxSuit - honors) * 3.2,
    label: `한 수종·자패 ${maxSuit + honors}/${n}장`
  };
  if (id === 'chinitsu') return {
    score: maxSuit * 1.6 - (n - maxSuit) * 3.5,
    label: `한 수종 ${maxSuit}/${n}장`
  };
  if (id === 'kokushi') {
    const unique = H.KOKUSHI.filter(tile => counts[tile] > 0).length;
    const nonOrphans = n - H.KOKUSHI.reduce((sum, tile) => sum + counts[tile], 0);
    return { score: unique * 2.2 - nonOrphans * 3.5 + Number(H.KOKUSHI.some(tile => counts[tile] >= 2)) * 2,
      label: `필수 1·9·자패 ${unique}/13종` };
  }
  if (id === 'pinfu') {
    let links = 0;
    for (let suit = 0; suit < 3; suit++) for (let rank = 0; rank < 8; rank++)
      if (counts[suit * 9 + rank] && counts[suit * 9 + rank + 1]) links++;
    const runs = maxDisjointRuns(counts);
    const extraLinks = Math.min(4 - runs, Math.max(0, links - runs * 2));
    const validPair = counts.some((count, tile) => count >= 2 && ![seat, round, 31, 32, 33].includes(tile));
    return { score: runs * 5 + extraLinks * 1.2 + Number(validPair) * 2 - triples * 5 - honors * 1.5,
      label: `순자 ${runs}/4묶음` };
  }
  if (id === 'sanshoku') {
    const groups = Array.from({ length: 7 }, (_, start) => [0, 1, 2].map(suit => suit * 9 + start));
    const best = bestThreeRuns(concealedCounts, groups, fixedChiStarts);
    return { score: best.score, label: `같은 숫자 순자 ${best.complete}/3종` };
  }
  if (id === 'ittsuu') {
    const groups = [0, 1, 2].map(suit => [0, 3, 6].map(block => suit * 9 + block));
    const best = bestThreeRuns(concealedCounts, groups, fixedChiStarts);
    return { score: best.score, label: `123·456·789 ${best.complete}/3묶음` };
  }
  if (id === 'iipeikou') {
    let best = { score: 0, complete: 0 };
    for (let suit = 0; suit < 3; suit++) for (let start = 0; start <= 6; start++) {
      const base = suit * 9 + start;
      const paired = [0, 1, 2].filter(offset => counts[base + offset] >= 2).length;
      const present = [0, 1, 2].filter(offset => counts[base + offset] >= 1).length;
      const complete = present === 3 ? (paired === 3 ? 2 : 1) : 0;
      const score = paired === 3 ? 18 : paired === 2 && present === 3 ? 8
        : paired === 2 ? 5 : present === 3 ? 3 + paired : 0;
      if (score > best.score) best = { score, complete };
    }
    return { score: best.score, label: `같은 순자 ${best.complete}/2묶음` };
  }
  return { score: 0, label: '' };
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

function lookup(tiles, { seat = 27, round = 27, opened = false, melds = [], unavailable = [], limit = catalog.entries.length } = {}) {
  if (!Array.isArray(tiles) || tiles.length > 14) throw new Error('0~14장의 패를 입력해 주세요.');
  if (![seat, round].every(t => Number.isInteger(t) && t >= 27 && t <= 30)) throw new Error('자풍·장풍은 동·남·서·북 중 선택하세요.');
  if (!Array.isArray(unavailable) || unavailable.some(t => !Number.isInteger(t) || t < 0 || t >= 34))
    throw new Error('0장 남은 패는 올바른 패 종류로 입력해 주세요.');
  if (!Array.isArray(melds) || melds.length > 4 || melds.some(meld =>
    !['chi', 'pon', 'kan'].includes(meld.type) || !Array.isArray(meld.tiles) ||
    meld.tiles.length !== (meld.type === 'kan' ? 4 : 3))) throw new Error('옆으로 낸 패 묶음이 올바르지 않습니다.');
  const physical = tileCounts([...tiles, ...melds.flatMap(meld => meld.tiles)]);
  if (physical.some(n => n > 4)) throw new Error('손패와 오른쪽 묶음을 합쳐 같은 패는 네 장까지입니다.');
  const input = [...tiles, ...melds.flatMap(meld => meld.tiles.slice(0, 3))];
  if (input.length > 14) throw new Error('손패와 오른쪽 묶음을 합쳐 14장 구조를 넘었어요. 손패를 줄여 주세요.');
  const counts = tileCounts(input);
  const concealedCounts = tileCounts(tiles);
  if (!input.length) return { limitedEvidence: true, weakEvidence: true, blockedByUnavailable: false, results: [] };
  const unavailableSet = new Set(unavailable);
  let blockedByUnavailable = false;
  const isOpened = opened || melds.some(meld => meld.open);
  const results = catalog.entries.filter(entry => !isOpened || entry.openAllowed).map(entry => {
    const evidence = structuralEvidence(entry.id, counts, seat, round, concealedCounts, melds);
    let chosen;
    const examples = entry.id === 'toitoi' ? toitoiExamples(counts, melds, unavailableSet)
      : contextualExamplesFor(entry, seat, round, melds);
    for (const example of examples) {
      const comparison = compareExample(counts, example);
      if (comparison.missing.some(tile => unavailableSet.has(tile))) {
        blockedByUnavailable = true;
        continue;
      }
      const highlighted = highlightExample(entry.id, comparison.example, seat, round);
      const focusCounts = tileCounts(comparison.example.filter((_, index) => highlighted[index]));
      const coreKept = focusCounts.reduce((total, count, tile) => total + Math.min(counts[tile], count), 0);
      const coreTotal = highlighted.filter(Boolean).length;
      const coreMissing = [];
      focusCounts.forEach((count, tile) => {
        for (let i = counts[tile]; i < count; i++) coreMissing.push(tile);
      });
      // An example's filler tiles should not outweigh the tiles that define its yaku.
      const exampleFit = coreKept * 2 + (comparison.kept.length - coreKept) * .5
        - comparison.toSetAside.length * 2;
      // For two identical runs, favor the pattern needing fewer core tiles.
      // Filler tiles in a sample hand must not select a more distant double run.
      const closerDoubleRun = entry.id === 'iipeikou' && chosen &&
        coreMissing.length !== chosen.coreMissing.length;
      const closerToitoi = entry.id === 'toitoi' && chosen && comparison.missing.length !== chosen.missing.length;
      if (!chosen || (closerToitoi ? comparison.missing.length < chosen.missing.length : closerDoubleRun
        ? coreMissing.length < chosen.coreMissing.length
        : exampleFit > chosen.exampleFit)) chosen = {
        ...comparison, exampleFit, coreKept, coreTotal, coreMissing, highlighted
      };
    }
    if (!chosen) return null;
    return { id: entry.id, name: entry.name, condition: entry.condition,
      pairCount: entry.id === 'chiitoitsu' ? counts.filter(n => n >= 2).length : undefined,
      openAllowed: entry.openAllowed, source: catalog.source, ...chosen,
      evidenceLabel: evidence.label,
      score: evidence.score + chosen.kept.length * .3 - chosen.toSetAside.length * .1 };
  }).filter(entry => entry && entry.kept.length > 0);
  results.sort((a, b) => b.score - a.score || b.kept.length - a.kept.length || a.name.localeCompare(b.name, 'ko'));
  return { limitedEvidence: input.length < 4,
    weakEvidence: !results.length || results[0].score < Math.max(8, input.length * 1.25),
    blockedByUnavailable,
    results: results.slice(0, Math.max(0, Math.min(limit, results.length))) };
}

return { catalog, parseTiles, examplesFor, highlightExample, lookup };
});
