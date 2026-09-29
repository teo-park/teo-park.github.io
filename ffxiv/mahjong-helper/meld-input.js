/* Compact input for fixed chi, pon, and kan groups. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./quick-input.js'));
  else root.MahjongMeldInput = factory(root.MahjongQuickInput);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Q) {
  const error = message => ({ melds: null, error: { message } });

  function parse(value) {
    const text = String(value || '').trim().replace(/안깡\s+(?=[1-9])/gu, '안깡:');
    if (!text) return { melds: [], error: null };
    const groups = text.split(/[\s,/|]+/u).filter(Boolean);
    if (groups.length > 4) return error('치·퐁·깡 묶음은 네 개까지 입력할 수 있어요.');
    const melds = [];
    const counts = Array(34).fill(0);
    for (const group of groups) {
      const closed = /^(안깡:|안:|안)/u.test(group);
      const notation = group.replace(/^(안깡:|안:|안)/u, '');
      const parsed = Q.parseCompact(notation);
      if (parsed.error || parsed.pending || !parsed.tiles?.length)
        return error(`“${group}”을(를) 읽지 못했어요. 예: 123ㅅ, 555ㅈ, 안깡:7777ㅌ`);
      const tiles = parsed.tiles.slice().sort((a, b) => a - b);
      let type;
      if (tiles.length === 4 && tiles.every(tile => tile === tiles[0])) type = 'kan';
      else if (tiles.length === 3 && tiles.every(tile => tile === tiles[0])) type = 'pon';
      else if (tiles.length === 3 && tiles[0] < 27 &&
        Math.floor(tiles[0] / 9) === Math.floor(tiles[2] / 9) &&
        tiles[1] === tiles[0] + 1 && tiles[2] === tiles[0] + 2) type = 'chi';
      if (!type) return error(`“${group}”은 순자 3장, 같은 패 3장, 같은 패 4장 중 하나로 적어 주세요.`);
      if (closed && type !== 'kan') return error('안깡 표기는 같은 패 네 장에만 쓸 수 있어요.');
      for (const tile of tiles) if (++counts[tile] > 4)
        return error('오른쪽 묶음에 같은 패가 네 장을 넘었어요.');
      melds.push({ type, tiles, open: !closed });
    }
    return { melds, error: null };
  }

  function format(melds) {
    return melds.map(meld => `${meld.open ? '' : '안깡:'}${Q.formatCompact(meld.tiles).replaceAll(' ', '')}`).join(' ');
  }

  return { parse, format };
});
