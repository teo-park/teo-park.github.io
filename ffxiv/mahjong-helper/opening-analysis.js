/* First-hand model: random self draws from unseen tiles, retaining a fixed core. */
(function (root, factory) {
  const api = factory(typeof module === 'object' && module.exports ? require('./core.js') : root.MahjongHelper);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MahjongOpening = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (H) {
  const countsOf = tiles => tiles.reduce((counts, tile) => (counts[tile]++, counts), Array(34).fill(0));
  function choose(n, k) {
    if (k < 0 || k > n) return 0;
    let value = 1;
    for (let i = 1; i <= Math.min(k, n - k); i++) value *= (n - i + 1) / i;
    return value;
  }
  function acquireProbability(missing, remaining, draws = 8) {
    const required = countsOf(missing);
    const total = remaining.reduce((sum, n) => sum + n, 0);
    if (!Number.isInteger(draws) || draws < 0 || draws > total) throw new Error('뽑기 횟수가 올바르지 않습니다.');
    if (!missing.length) return 1;
    if (missing.length > draws || required.some((n, tile) => n > remaining[tile])) return 0;
    let weights = Array(draws + 1).fill(0); weights[0] = 1;
    let relevant = 0;
    required.forEach((minimum, tile) => {
      if (!minimum) return;
      const available = remaining[tile]; relevant += available;
      const next = Array(draws + 1).fill(0);
      for (let used = 0; used <= draws; used++) for (let take = minimum; take <= Math.min(available, draws - used); take++)
        next[used + take] += weights[used] * choose(available, take);
      weights = next;
    });
    const favorable = weights.reduce((sum, weight, used) => sum + weight * choose(total - relevant, draws - used), 0);
    return Math.max(0, Math.min(1, favorable / choose(total, draws)));
  }
  function corePatterns(seat, round) {
    const patterns = [];
    const add = (id, name, core) => patterns.push({ id, name, core });
    for (let suit = 0; suit < 3; suit++) {
      for (let start = 0; start < 7; start++) {
        const run = [0, 1, 2].map(offset => suit * 9 + start + offset);
        add('iipeikou', '이페코', [...run, ...run]);
      }
      add('ittsuu', '일기통관', Array.from({ length: 9 }, (_, rank) => suit * 9 + rank));
    }
    for (let start = 0; start < 7; start++)
      add('sanshoku', '삼색동순', [0, 1, 2].flatMap(suit => [0, 1, 2].map(offset => suit * 9 + start + offset)));
    for (const tile of new Set([seat, round, 31, 32, 33])) add('yakuhai', '역패', [tile, tile, tile]);
    return patterns;
  }
  function analyze(tiles, { seat = 27, round = 27, draws = 8 } = {}) {
    if (!Array.isArray(tiles) || ![13, 14].includes(tiles.length) || tiles.some(t => !Number.isInteger(t) || t < 0 || t > 33))
      throw new Error('첫 손패 13장 또는 첫 뽑기 후 14장을 입력하세요.');
    if (![seat, round].every(t => Number.isInteger(t) && t >= 27 && t <= 30)) throw new Error('자풍·장풍을 확인하세요.');
    const visible = countsOf(tiles);
    if (visible.some(n => n > 4)) throw new Error('같은 패는 네 장까지입니다.');
    const complete = H.shanten(visible) === -1;
    const discards = tiles.length === 14 && !complete ? H.discards(visible.slice()) : [];
    const retained = visible.slice();
    if (discards.length) retained[discards[0].index]--;
    const remaining = visible.map(n => 4 - n);
    const unseen = remaining.reduce((sum, n) => sum + n, 0);
    const effective = complete ? { tiles: [], total: 0 } : H.effectiveTiles(retained.slice(), 0, visible);
    const best = new Map();
    for (const pattern of corePatterns(seat, round)) {
      const target = countsOf(pattern.core), missing = [];
      target.forEach((n, tile) => { for (let copy = retained[tile]; copy < n; copy++) missing.push(tile); });
      const probability = acquireProbability(missing, remaining, draws);
      const item = { ...pattern, missing, probability, kept: pattern.core.length - missing.length };
      const previous = best.get(pattern.id);
      if (!previous || probability > previous.probability || probability === previous.probability && missing.length < previous.missing.length)
        best.set(pattern.id, item);
    }
    return { complete, shanten: H.shanten(retained), effective, unseen, nextChance: effective.total / unseen,
      draws, discards, analyzedDiscard: discards[0]?.index,
      paths: [...best.values()].sort((a, b) => b.probability - a.probability || b.kept - a.kept) };
  }
  return { analyze, acquireProbability };
});
