/* Collection and deck logic. No network or browser state is required. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Triad = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const SIDES = ['top', 'right', 'bottom', 'left'];
  const CORNERS = [[1, 2], [2, 3], [0, 1], [0, 3]];
  const CORNER_NAMES = ['왼쪽 위', '오른쪽 위', '왼쪽 아래', '오른쪽 아래'];
  const INITIALS = [...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
  const RULES = [
    [1, '무작위 규칙', '추첨 결과가 나온 뒤 실제로 적용된 규칙을 선택하세요.'],
    [2, '모두 공개', '상대 패를 모두 볼 수 있어요. 숫자 평가는 기본 규칙과 같아요.'],
    [3, '3장 공개', '보이는 상대 카드 3장과 아직 모르는 2장을 함께 고려하세요.'],
    [4, '동수', '맞닿는 두 면 이상이 동시에 같으면 포획해요. 숫자쌍의 연결 가능성을 참고해 추천해요.'],
    [5, '연장전', '무승부 뒤에는 지배 중인 카드로 다시 시작해요. 추천은 첫 판의 덱 기준이에요.'],
    [6, '합산', '맞닿는 두 면 이상에서 합이 같으면 포획해요. 연결 가능성을 참고하며 실제 연쇄는 계산하지 않아요.'],
    [7, '무작위 패', '보유 목록에서 패가 무작위로 정해져요. 미리 편성한 덱을 추천할 수 없어요.'],
    [8, '순서대로', '덱에 놓인 순서대로 사용해요. 초반 모서리 배치용 카드를 앞에 제안해요.'],
    [9, '무작위 순서', '낼 카드가 무작위로 정해져요. 어느 방향에도 대응할 수 있는 균형을 더 중시해요.'],
    [10, '역전', '작은 숫자가 이겨요. 낮은 숫자와 모서리 방향을 기준으로 다시 평가해요.'],
    [11, '에이스 약화', '1이 A를 잡아요. 역전도 적용되면 A가 1을 잡는 관계로 바뀌어요.'],
    [12, '유형 강화', '같은 유형이 놓일수록 숫자가 올라가요. 덱 안의 유형 구성과 역전 여부를 함께 평가해요.'],
    [13, '유형 약화', '같은 유형이 놓일수록 숫자가 내려가요. 유형 없는 카드와 역전 조합도 비교해요.'],
    [14, '카드 교환', '시작 전 상대와 카드 1장을 바꿔요. 교환 뒤에도 남을 카드들의 균형을 더 중시해요.'],
    [15, '카드 선발', '제공된 카드로 현장에서 덱을 만들어요. 내 보유 카드로 미리 덱을 추천할 수 없어요.']
  ].map(([id, name, tip]) => ({id, name, tip}));
  const normalize = value => String(value ?? '').normalize('NFC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
  const initials = value => [...String(value)].map(c => {
    const n = c.charCodeAt(0) - 0xac00;
    return n >= 0 && n <= 11171 ? INITIALS[Math.floor(n / 588)] : c;
  }).join('');
  function searchText(card) {
    return [card.name, card.original, card.type, ...card.sources.flatMap(s => [s.name, s.original, s.location, s.region, s.npc?.quest?.name])].filter(Boolean).join(' ');
  }
  function matches(card, query) {
    const q = normalize(query);
    if (!q) return true;
    const number = /^(no|ex)?(\d+)$/.exec(q);
    if (number) return card.order === Number(number[2]) && card.ex === (number[1] === 'ex');
    const text = searchText(card);
    return normalize(text).includes(q) || normalize(initials(text)).includes(q);
  }
  function parseBackup(text) {
    let value;
    try { value = JSON.parse(text); } catch { throw Error('JSON 파일 형식이 올바르지 않아요. 내보낸 백업 파일을 선택해 주세요.'); }
    if (!value || value.type !== 'ffxiv-triple-triad' || value.schemaVersion !== 1 || !Array.isArray(value.collected) || value.collected.length > 10000 || value.collected.some(id => !Number.isSafeInteger(id) || id <= 0)) {
      throw Error('이 도구에서 내보낸 카드 수집 파일이 아니거나, 지원하지 않는 형식이에요.');
    }
    return new Set(value.collected);
  }
  function backup(ids) {
    return JSON.stringify({type: 'ffxiv-triple-triad', schemaVersion: 1, exportedAt: new Date().toISOString(), collected: [...ids].sort((a, b) => a - b)}, null, 2);
  }
  function legal(deck, complete = true) {
    return (!complete || deck.length === 5) && deck.length <= 5 && new Set(deck.map(c => c.id)).size === deck.length && deck.filter(c => c.stars === 5).length <= 1 && deck.filter(c => c.stars >= 4).length <= 2;
  }
  function validateRules(ids) {
    if (!Array.isArray(ids) || ids.some(id => !RULES.some(r => r.id === id))) return '알 수 없는 규칙이 있어요.';
    if (new Set(ids).size !== ids.length || ids.length > 4) return '규칙은 중복 없이 최대 4개까지 선택해 주세요.';
    for (const [a, b] of [[2, 3], [8, 9], [12, 13]]) if (ids.includes(a) && ids.includes(b)) return `${RULES.find(r => r.id === a).name}와 ${RULES.find(r => r.id === b).name} 중 실제 적용된 하나를 선택해 주세요.`;
    return '';
  }
  function beats(a, b, rules = []) {
    if (a === b) return false;
    const reverse = rules.includes(10);
    if (rules.includes(11) && ((a === 1 && b === 10) || (a === 10 && b === 1))) return reverse ? a === 10 : a === 1;
    return reverse ? a < b : a > b;
  }
  function adjusted(value, typeId, count, rules) {
    if (!typeId) return value;
    const delta = rules.includes(12) ? count : rules.includes(13) ? -count : 0;
    return Math.max(1, Math.min(10, value + delta));
  }
  function recommend(catalog, owned, ruleIds = [], allCards = false) {
    const error = validateRules(ruleIds);
    if (error) return {error};
    if (ruleIds.includes(7) || ruleIds.includes(15)) return {error: '이 규칙에서는 미리 짠 덱을 사용하지 않아요. 무작위 패·카드 선발을 해제하면 보유 카드로 추천할 수 있어요.', unavailable: true};
    if (ruleIds.includes(1)) return {error: '무작위 규칙의 추첨 결과를 확인한 뒤, 실제로 적용된 규칙으로 바꿔 주세요.', unavailable: true};
    const candidates = catalog.filter(c => allCards || owned.has(c.id));
    if (candidates.length < 5) return {error: '보유 카드를 5장 이상 체크해 주세요. 전체 카드로 목표 덱을 먼저 살펴볼 수도 있어요.'};
    if (candidates.filter(c => c.stars <= 3).length < 3 || candidates.filter(c => c.stars <= 4).length < 4) return {error: '별 4~5개 카드는 합쳐 2장, 별 5개 카드는 1장까지만 편성할 수 있어요. 낮은 등급의 보유 카드를 더 체크해 주세요.'};

    // Empirical side frequencies supply a neutral opponent model, not a win rate.
    // NPC-specific decks, board state, combos and move search are not simulated.
    const histogram = Array.from({length: 4}, () => Array(11).fill(0));
    let weight = 0;
    for (const card of catalog) {
      const w = card.stars >= 4 ? 0.5 : 1;
      weight += w;
      SIDES.forEach((side, i) => { histogram[i][card.stats[side]] += w; });
    }
    histogram.forEach(row => row.forEach((n, i) => { row[i] = n / weight; }));
    const sideUtility = histogram.map((_, i) => Array.from({length: 11}, (_, n) => {
      if (!n) return 0;
      return histogram[(i + 2) % 4].reduce((sum, p, other) => sum + p * (Number(beats(n, other, ruleIds)) + 0.65 * Number(!beats(other, n, ruleIds))), 0);
    }));
    const cache = new Map();
    function profile(card, count) {
      const cacheKey = card.id + ':' + count;
      if (cache.has(cacheKey)) return cache.get(cacheKey);
      const states = [{values: SIDES.map(s => card.stats[s]), weight: 1}];
      if (card.typeId && count && (ruleIds.includes(12) || ruleIds.includes(13))) {
        states[0].weight = 0.35;
        for (let n = 1; n <= count; n++) states.push({values: SIDES.map(s => adjusted(card.stats[s], card.typeId, n, ruleIds)), weight: 0.65 / count});
      }
      const utility = [0, 0, 0, 0]; let combo = 0;
      for (const state of states) {
        state.values.forEach((n, i) => { utility[i] += sideUtility[i][n] * state.weight; });
        if (ruleIds.includes(4) || ruleIds.includes(6)) {
          for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) {
            const ha = histogram[(a + 2) % 4], hb = histogram[(b + 2) % 4];
            if (ruleIds.includes(4)) combo += state.weight * ha[state.values[a]] * hb[state.values[b]];
            if (ruleIds.includes(6)) for (let n = 1; n <= 10; n++) {
              const m = state.values[a] + n - state.values[b];
              if (m >= 1 && m <= 10) combo += state.weight * ha[n] * hb[m];
            }
          }
        }
      }
      const corners = CORNERS.map(([a, b]) => Math.min(utility[a], utility[b]) * 0.65 + (utility[a] + utility[b]) * 0.175);
      const mean = utility.reduce((a, b) => a + b) / 4;
      const balance = Math.min(...utility) * 0.6 + mean * 0.4;
      const result = {corners, mean, balance, combo, best: Math.max(...corners)};
      cache.set(cacheKey, result); return result;
    }
    function evaluate(deck) {
      const counts = {};
      deck.forEach(c => { counts[c.typeId] = (counts[c.typeId] || 0) + 1; });
      const profiles = deck.map(c => profile(c, counts[c.typeId]));
      // Each physical card can anchor only one corner. A mask assignment avoids
      // counting a single strong card as all four defensive options at once.
      let assignment = Array(16).fill(-Infinity); assignment[0] = 0;
      for (const p of profiles) {
        const next = [...assignment];
        for (let mask = 0; mask < 16; mask++) if (Number.isFinite(assignment[mask])) {
          for (let corner = 0; corner < 4; corner++) if (!(mask & (1 << corner))) {
            const target = mask | (1 << corner);
            next[target] = Math.max(next[target], assignment[mask] + p.corners[corner]);
          }
        }
        assignment = next;
      }
      const coverage = Math.max(...assignment);
      const balanced = ruleIds.includes(9) || ruleIds.includes(14);
      const quality = profiles.reduce((sum, p) => sum + p.best * (balanced ? 0.35 : 0.65) + p.balance * (balanced ? 0.65 : 0.15) + p.mean * 0.2 + p.combo * 0.22, 0);
      return coverage * 1.3 + quality;
    }
    // Keep candidates for every rarity, type and corner, including the opposite
    // type modifier scenario. This prevents the shortlist from losing synergies.
    const shortlist = new Map();
    for (const rarity of [1, 4, 5]) for (const type of [null, 0, 1, 2, 3, 4]) {
      const group = candidates.filter(c => (rarity === 1 ? c.stars <= 3 : c.stars === rarity) && (type === null || c.typeId === type));
      for (let corner = 0; corner < 5; corner++) for (const count of ruleIds.includes(12) || ruleIds.includes(13) ? [0, 4] : [0]) {
        const score = c => { const p = profile(c, count); return corner < 4 ? p.corners[corner] + 0.15 * p.mean + 0.15 * p.combo : p.balance + 0.15 * p.combo; };
        group.sort((a, b) => score(b) - score(a) || a.id - b.id).slice(0, type === null ? 5 : 2).forEach(c => shortlist.set(c.id, c));
      }
    }
    const pool = [...shortlist.values()];
    let beam = [{deck: [], score: 0}];
    for (let size = 1; size <= 5; size++) {
      const seen = new Set(), next = [];
      for (const entry of beam) for (const card of pool) {
        if (entry.deck.some(c => c.id === card.id)) continue;
        const deck = [...entry.deck, card];
        if (!legal(deck, false)) continue;
        const key = deck.map(c => c.id).sort((a, b) => a - b).join(',');
        if (seen.has(key)) continue;
        seen.add(key); next.push({deck, score: evaluate(deck)});
      }
      next.sort((a, b) => b.score - a.score);
      beam = next.slice(0, 48);
    }
    if (!beam.length) return {error: '이 보유 목록에서는 편성 제한을 만족하는 5장을 구성할 수 없어요.'};
    // Final one-card substitution across the complete owned pool avoids a
    // permanent shortlist exclusion and improves a bounded beam result.
    let best = beam[0];
    for (let pass = 0; pass < 2; pass++) {
      let improved = best;
      for (let i = 0; i < 5; i++) for (const card of candidates) {
        const deck = best.deck.map((c, index) => index === i ? card : c);
        if (!legal(deck)) continue;
        const score = evaluate(deck);
        if (score > improved.score + 1e-9) improved = {deck, score};
      }
      if (improved === best) break;
      best = improved;
    }
    const counts = {};
    best.deck.forEach(c => { counts[c.typeId] = (counts[c.typeId] || 0) + 1; });
    const deck = [...best.deck].sort((a, b) => {
      const pa = profile(a, counts[a.typeId]), pb = profile(b, counts[b.typeId]);
      return ruleIds.includes(8) ? (pb.best - pb.mean) - (pa.best - pa.mean) || a.id - b.id : b.stars - a.stars || a.order - b.order;
    });
    const details = deck.map(card => {
      const p = profile(card, counts[card.typeId]), corner = p.corners.indexOf(p.best);
      const reason = [`${CORNER_NAMES[corner]} 모서리에서 ${CORNERS[corner].map(i => ({top: '위', right: '오른쪽', bottom: '아래', left: '왼쪽'})[SIDES[i]] + ' ' + (card.stats[SIDES[i]] === 10 ? 'A' : card.stats[SIDES[i]])).join(' · ')} 활용`];
      if (card.typeId && (ruleIds.includes(12) || ruleIds.includes(13))) reason.push(`${card.type} ${counts[card.typeId]}장 구성 · 같은 유형이 놓일 때의 수치 변화 평가`);
      if (ruleIds.includes(11) && Object.values(card.stats).some(n => n === 1 || n === 10)) reason.push(ruleIds.includes(10) ? 'A가 1을 잡는 예외 관계 반영' : '1이 A를 잡는 예외 관계 반영');
      return {id: card.id, corner, reason};
    });
    return {deck, details, candidateCount: candidates.length, rules: [...ruleIds], allCards};
  }
  return {SIDES, CORNERS, CORNER_NAMES, RULES, normalize, initials, matches, backup, parseBackup, legal, validateRules, beats, adjusted, recommend};
});
