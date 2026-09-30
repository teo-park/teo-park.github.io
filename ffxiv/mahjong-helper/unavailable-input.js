/* Tile types known to have zero drawable copies left. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./quick-input.js'));
  else root.MahjongUnavailableInput = factory(root.MahjongQuickInput);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Q) {
  const suitBases = { 'ㅁ': 0, m: 0, 'ㅌ': 9, p: 9, 'ㅅ': 18, s: 18, 'ㅈ': 27, z: 27 };
  const invalid = () => ({ tiles: null, error: { message: '숫자 뒤에 ㅁ·ㅌ·ㅅ·ㅈ을 붙여 주세요. 예: 1ㅁ 7ㅌ 5ㅈ' }, pending: false });

  function parse(value) {
    const text = String(value || '').replace(/[\s,·/|]/gu, '').toLowerCase();
    if (!text) return { tiles: [], error: null, pending: false };
    const tiles = new Set();
    const groups = /([1-9]+)([ㅁㅌㅅㅈmpsz])/gu;
    let consumed = 0;
    for (const match of text.matchAll(groups)) {
      if (match.index !== consumed) return invalid();
      const base = suitBases[match[2]];
      for (const digit of match[1]) {
        const rank = Number(digit);
        if (base === 27 && rank > 7)
          return { tiles: null, error: { message: '자패는 1동부터 7중까지 적어 주세요.' }, pending: false };
        tiles.add(base + rank - 1);
      }
      consumed += match[0].length;
    }
    const rest = text.slice(consumed);
    if (rest && !/^[1-9]+$/u.test(rest)) return invalid();
    return { tiles: [...tiles].sort((a, b) => a - b), error: null, pending: Boolean(rest) };
  }

  function format(tiles) { return Q.formatCompact([...new Set(tiles)].sort((a, b) => a - b)); }

  return { parse, format };
});
