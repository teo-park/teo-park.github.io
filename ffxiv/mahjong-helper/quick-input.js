/* Short Korean notation for the web yaku dictionary. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MahjongQuickInput = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const fields = [
    ['man', 0, '만'], ['pin', 9, '통'], ['sou', 18, '삭']
  ];
  const honors = { ㄷ: 27, 동: 27, 東: 27, ㄴ: 28, 남: 28, 南: 28,
    ㅅ: 29, 서: 29, 西: 29, ㅂ: 30, 북: 30, 北: 30,
    백: 31, 白: 31, 발: 32, 發: 32, 発: 32, 중: 33, 中: 33,
    1: 27, 2: 28, 3: 29, 4: 30, 5: 31, 6: 32, 7: 33 };
  const separators = /[\s,·/|]/u;
  const compactGroups = { ㅁ: 'man', ㅌ: 'pin', ㅅ: 'sou', ㅈ: 'honors',
    m: 'man', p: 'pin', s: 'sou', z: 'honors' };

  function parse(values) {
    const tiles = [];
    for (const [key, base, name] of fields) {
      for (const character of String(values[key] || '')) {
        if (separators.test(character)) continue;
        if (!/[1-9]/u.test(character)) {
          return { tiles: null, error: { field: key, message: `${name}패에는 1~9 숫자만 입력해 주세요.` } };
        }
        tiles.push(base + Number(character) - 1);
      }
    }
    for (const character of String(values.honors || '')) {
      if (separators.test(character)) continue;
      if (!(character in honors)) {
        return { tiles: null, error: { field: 'honors', message: `자패의 “${character}”을(를) 읽지 못했어요. 1~7 또는 ㄷ·ㄴ·ㅅ·ㅂ을 입력해 주세요.` } };
      }
      tiles.push(honors[character]);
    }
    const counts = Array(34).fill(0);
    for (const tile of tiles) {
      counts[tile]++;
      if (counts[tile] > 4) {
        return { tiles: null, error: { field: null, message: '같은 패는 네 장까지만 넣을 수 있어요.' } };
      }
    }
    if (tiles.length > 14) {
      return { tiles: null, error: { field: null, message: '손패는 최대 14장까지 넣을 수 있어요.' } };
    }
    return { tiles, error: null };
  }

  function format(tiles) {
    const values = { man: '', pin: '', sou: '', honors: '' };
    for (const tile of tiles) {
      if (tile < 9) values.man += tile + 1;
      else if (tile < 18) values.pin += tile - 8;
      else if (tile < 27) values.sou += tile - 17;
      else values.honors += tile - 26;
    }
    return values;
  }

  function formatNotation(tiles) {
    const values = format(tiles);
    return [['man', 'm'], ['pin', 'p'], ['sou', 's'], ['honors', 'z']]
      .map(([key, suffix]) => values[key] ? `${values[key]}${suffix}` : '')
      .join('');
  }

  function formatCompact(tiles) {
    const values = format(tiles);
    return [['man', 'ㅁ'], ['pin', 'ㅌ'], ['sou', 'ㅅ'], ['honors', 'ㅈ']]
      .map(([key, suffix]) => values[key] ? `${values[key]}${suffix}` : '')
      .filter(Boolean).join(' ');
  }

  function parseCompact(value) {
    const text = String(value || '').replace(/[\s,·/|]/gu, '');
    const values = { man: '', pin: '', sou: '', honors: '' };
    if (!text) return { ...parse(values), pending: false };
    const groupAt = index => compactGroups[text[index]?.toLowerCase()];
    const prefix = Boolean(groupAt(0));
    let index = 0;
    let pending = false;
    while (index < text.length) {
      let group;
      let digits = '';
      if (prefix) {
        group = groupAt(index);
        if (!group) return { tiles: null, error: { field: 'compact', message: 'ㅁ·ㅌ·ㅅ·ㅈ 기호 뒤에 숫자를 적어 주세요.' }, pending: false };
        index++;
      }
      while (index < text.length && /[1-9]/u.test(text[index])) digits += text[index++];
      if (!digits) {
        if (prefix && index === text.length) { pending = true; break; }
        return { tiles: null, error: { field: 'compact', message: '각 종류 기호 옆에 숫자를 한 장 이상 적어 주세요.' }, pending: false };
      }
      if (!prefix) {
        group = groupAt(index);
        if (!group) {
          if (index === text.length) { pending = true; break; }
          return { tiles: null, error: { field: 'compact', message: '숫자 뒤에 ㅁ·ㅌ·ㅅ·ㅈ 또는 m·p·s·z를 붙여 주세요.' }, pending: false };
        }
        index++;
      }
      values[group] += digits;
    }
    const result = parse(values);
    if (result.error) result.error.field = 'compact';
    return { ...result, pending };
  }

  return { parse, format, formatNotation, parseCompact, formatCompact };
});
