/* Four-player riichi hand analysis. Tile indices: man 0-8, pin 9-17, sou 18-26, honors 27-33. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.MahjongHelper = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const HONORS = ['東', '南', '西', '北', '白', '發', '中'];
  const SYMBOLS = ['🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏','🀙','🀚','🀛','🀜','🀝','🀞','🀟','🀠','🀡','🀐','🀑','🀒','🀓','🀔','🀕','🀖','🀗','🀘','🀀','🀁','🀂','🀃','🀆','🀅','🀄'];
  const KOKUSHI = [0,8,9,17,18,26,27,28,29,30,31,32,33];
  const name = i => i < 27 ? `${i % 9 + 1}${['만','통','삭'][Math.floor(i / 9)]}` : HONORS[i - 27];
  const isTerminal = i => i >= 27 || i % 9 === 0 || i % 9 === 8;
  function standardShanten(counts, fixedMelds = 0) {
    let best = 8;
    const seen = new Set();
    function walk(i, meld, taatsu, pair) {
      while (i < 34 && !counts[i]) i++;
      if (i === 34) {
        best = Math.min(best, 8 - 2 * meld - Math.min(taatsu, 4 - meld) - pair);
        return;
      }
      const key = `${i}|${meld}|${taatsu}|${pair}|${counts.slice(i).join('')}`;
      if (seen.has(key)) return;
      seen.add(key);
      const n = counts[i], r = i % 9, suited = i < 27;
      if (n >= 3) { counts[i] -= 3; walk(i, meld + 1, taatsu, pair); counts[i] += 3; }
      if (suited && r <= 6 && counts[i + 1] && counts[i + 2]) {
        counts[i]--; counts[i + 1]--; counts[i + 2]--;
        walk(i, meld + 1, taatsu, pair);
        counts[i]++; counts[i + 1]++; counts[i + 2]++;
      }
      if (!pair && n >= 2) { counts[i] -= 2; walk(i, meld, taatsu, 1); counts[i] += 2; }
      if (taatsu < 4) {
        if (n >= 2) { counts[i] -= 2; walk(i, meld, taatsu + 1, pair); counts[i] += 2; }
        if (suited && r <= 7 && counts[i + 1]) {
          counts[i]--; counts[i + 1]--; walk(i, meld, taatsu + 1, pair); counts[i]++; counts[i + 1]++;
        }
        if (suited && r <= 6 && counts[i + 2]) {
          counts[i]--; counts[i + 2]--; walk(i, meld, taatsu + 1, pair); counts[i]++; counts[i + 2]++;
        }
      }
      counts[i]--; walk(i, meld, taatsu, pair); counts[i]++;
    }
    walk(0, fixedMelds, 0, 0);
    return best;
  }
  function shanten(counts, fixedMelds = 0) {
    const total = counts.reduce((a, b) => a + b, 0);
    if (!Number.isInteger(fixedMelds) || fixedMelds < 0 || fixedMelds > 4 ||
        ![13 - 3 * fixedMelds, 14 - 3 * fixedMelds].includes(total) ||
        counts.some(n => n < 0 || n > 4)) return null;
    if (fixedMelds) return standardShanten(counts.slice(), fixedMelds);
    const pairs = counts.filter(n => n >= 2).length;
    const distinct = counts.filter(n => n > 0).length;
    const sevenPairs = 6 - pairs + Math.max(0, 7 - distinct);
    const unique = KOKUSHI.filter(i => counts[i]).length;
    const thirteen = 13 - unique - (KOKUSHI.some(i => counts[i] >= 2) ? 1 : 0);
    return Math.min(standardShanten(counts.slice()), sevenPairs, thirteen);
  }
  function effectiveTiles(counts, fixedMelds = 0, visible = counts) {
    const base = shanten(counts, fixedMelds);
    if (base === null) return null;
    const tiles = [];
    for (let i = 0; i < 34; i++) {
      if (visible[i] >= 4) continue;
      counts[i]++;
      if (shanten(counts, fixedMelds) < base) tiles.push({ index: i, remaining: 4 - visible[i] + (visible === counts ? 1 : 0) });
      counts[i]--;
    }
    return { tiles, total: tiles.reduce((n, t) => n + t.remaining, 0) };
  }
  function discards(counts, fixedMelds = 0, exposed = Array(34).fill(0)) {
    if (counts.reduce((a, b) => a + b, 0) !== 14 - 3 * fixedMelds) return [];
    const results = [];
    const visible = counts.map((n, i) => n + exposed[i]);
    for (let i = 0; i < 34; i++) {
      if (!counts[i]) continue;
      counts[i]--;
      const s = shanten(counts, fixedMelds);
      const effective = effectiveTiles(counts, fixedMelds, visible);
      results.push({ index: i, shanten: s, effective: effective.total, tiles: effective.tiles });
      counts[i]++;
    }
    return results.sort((a, b) => a.shanten - b.shanten || b.effective - a.effective || a.index - b.index);
  }
  function candidates(counts, seat = 27, round = 27) {
    const n = counts.reduce((a, b) => a + b, 0);
    if (n < 13) return [];
    const suited = counts.slice(0, 27).reduce((a, b) => a + b, 0);
    const simples = counts.reduce((a, b, i) => a + (isTerminal(i) ? 0 : b), 0);
    const pairs = counts.filter(x => x >= 2).length;
    const triples = counts.filter(x => x >= 3).length;
    const honor = counts.slice(27).reduce((a, b) => a + b, 0);
    const suits = [0, 1, 2].map(s => counts.slice(s * 9, s * 9 + 9).reduce((a, b) => a + b, 0));
    const result = [];
    const add = (title, score, why, next, tags) => result.push({ title, score, why, next, tags });
    if (simples >= 8) add('탕야오 + 리치', simples * 5 + 14, `2~8 수패 ${simples}장 · 1·9·자패 ${n - simples}장`, '1·9·자패를 정리하며 4면자 1머리로. 멘젠이면 리치도 함께 노릴 수 있어요.', ['초보 추천','멘젠 리치']);
    const value = [...new Set([seat, round, 31, 32, 33])].filter(i => counts[i] >= 2);
    if (value.length) add(triples >= 2 || pairs >= 4 ? '역패 + 또이또이' : '역패 확보', value.reduce((a, i) => a + counts[i], 0) * 7 + triples * 5, `${value.map(i => `${name(i)} ${counts[i]}장`).join(' · ')} · 또이츠 ${pairs}개`, '역패를 커쯔로 만들면 울어도 역이 생깁니다. 커쯔가 늘면 또이또이까지 노려보세요.', ['울기 가능']);
    if (pairs >= 3) add('치또이츠 + 리치', pairs * 8 + 3, `또이츠 ${pairs}종`, '서로 다른 7종의 또이츠를 모으세요. 같은 패 4장은 두 쌍으로 세지 않습니다.', ['멘젠 전용']);
    const maxSuit = Math.max(...suits), suit = suits.indexOf(maxSuit), offSuit = suited - maxSuit;
    if (maxSuit >= 7 && offSuit <= 3) add(honor ? (value.length ? '혼일색 + 역패' : '혼일색') : '청일색', maxSuit * 5 - offSuit * 9 + honor, `${['만수','통수','삭수'][suit]} ${maxSuit}장 · 다른 수패 ${offSuit}장 · 자패 ${honor}장`, honor ? '다른 색 수패를 정리하세요. 자패가 역패라면 함께 묶기 좋습니다.' : '한 색만 남겨 청일색을 노려볼 수 있어요.', ['색 패']);
    const kokushiUnique = KOKUSHI.filter(i => counts[i]).length;
    if (kokushiUnique >= 8) add('국사무쌍', kokushiUnique * 6 - simples * 4, `요구패 ${kokushiUnique}/13종`, '1·9·자패 13종과 그중 한 장의 중복이 필요합니다.', ['역만','멘젠 전용']);
    // A pinfu path is only shown when there is enough sequence structure to justify it.
    let links = 0;
    for (let base = 0; base < 27; base += 9) for (let r = 0; r < 8; r++) if (counts[base + r] && counts[base + r + 1]) links++;
    if (links >= 3 && triples <= 1 && pairs <= 2) add('핑후 + 리치', links * 5 + 13 - triples * 7, `연속 수패 연결 ${links}곳 · 커쯔 ${triples}개`, '순자 중심으로 만들고 역패가 아닌 머리와 양면 대기를 맞춰야 핑후가 됩니다.', ['멘젠 전용','완성형 조건 주의']);
    if (!result.length) add('멘젠 리치', 1, '뚜렷한 역 재료가 아직 적습니다', '울지 않고 기본형 4면자 1머리를 만들며 텐파이를 우선하세요.', ['멘젠 전용']);
    return result.sort((a, b) => b.score - a.score).slice(0, 4);
  }
  return { HONORS, SYMBOLS, KOKUSHI, name, isTerminal, shanten, effectiveTiles, discards, candidates };
});
