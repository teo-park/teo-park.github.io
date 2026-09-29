(async function () {
  const H = window.MahjongHelper;
  const Q = window.MahjongQuickInput;
  const el = id => document.getElementById(id);
  const labels = [
    ...Array.from({ length: 9 }, (_, i) => `${i + 1}n`),
    ...Array.from({ length: 9 }, (_, i) => `${i + 1}p`),
    ...Array.from({ length: 9 }, (_, i) => `${i + 1}b`),
    'ew', 'sw', 'ww', 'nw', 'wd', 'gd', 'rd'
  ];
  const groups = [
    ['만', Array.from({ length: 9 }, (_, i) => i)],
    ['통', Array.from({ length: 9 }, (_, i) => i + 9)],
    ['삭', Array.from({ length: 9 }, (_, i) => i + 18)],
    ['자패', Array.from({ length: 7 }, (_, i) => i + 27)]
  ];
  const honorNames = ['동', '남', '서', '북', '백', '발', '중'];
  const tileName = tile => tile < 27 ? H.name(tile) : honorNames[tile - 27];
  const glossary = {
    '샹텐': '화료 형태까지 남은 최소 패 교환 횟수입니다.',
    '순자': '같은 종류의 연속된 숫자 패 3장입니다. 예: 2·3·4만.',
    '커쯔': '같은 패 3장으로 만든 묶음입니다.',
    '머리': '같은 패 2장으로 만든 한 쌍입니다.',
    '멘젠': '다른 사람의 버린 패를 치·퐁·명깡으로 가져오지 않은 손패입니다.',
    '양면 대기': '연속된 두 패의 양끝 숫자를 기다리는 형태입니다. 예: 2·3에서 1 또는 4.'
  };
  let D;
  let hand = [];
  let seat = 27;
  let round = 27;
  let opened = false;
  const paletteButtons = [];
  const quickInputs = {};

  function keepInputOrder(previous, parsed) {
    const remaining = Array(34).fill(0);
    parsed.forEach(tile => remaining[tile]++);
    const next = [];
    for (const tile of previous) if (remaining[tile] > 0) { next.push(tile); remaining[tile]--; }
    for (const tile of parsed) if (remaining[tile] > 0) { next.push(tile); remaining[tile]--; }
    return next;
  }

  function syncQuickInputs() {
    const formatted = Q.format(hand);
    for (const [key, input] of Object.entries(quickInputs)) input.value = formatted[key];
    showQuickError(null);
  }

  function syncCompactInput() {
    el('quickCompact').value = Q.formatCompact(hand);
    el('quickPending').hidden = true;
  }

  function showQuickError(error, editedField) {
    const message = el('quickError');
    message.hidden = !error;
    message.textContent = error ? `${error.message} · 아래 패는 마지막 정상 입력을 표시합니다.` : '';
    for (const [key, input] of Object.entries(quickInputs)) {
      input.setAttribute('aria-invalid', String(Boolean(error && editedField !== 'compact' && (error.field || editedField) === key)));
    }
    el('quickCompact').setAttribute('aria-invalid', String(Boolean(error && editedField === 'compact')));
  }

  function readQuickInputs(editedField) {
    const values = Object.fromEntries(Object.entries(quickInputs).map(([key, input]) => [key, input.value]));
    const { tiles, error } = Q.parse(values);
    showQuickError(error, editedField);
    if (error) return;
    el('quickPending').hidden = true;
    hand = keepInputOrder(hand, tiles);
    render({ syncText: false });
  }

  function readCompactInput() {
    const { tiles, error, pending } = Q.parseCompact(el('quickCompact').value);
    showQuickError(error, 'compact');
    el('quickPending').hidden = !pending || Boolean(error);
    if (error) return;
    hand = keepInputOrder(hand, tiles);
    render({ syncCompact: false });
  }

  function tileImage(tile) {
    const image = document.createElement('img');
    image.src = `overlay/templates/${labels[tile]}.png`;
    image.alt = '';
    image.loading = 'lazy';
    return image;
  }

  function miniTiles(tiles, label) {
    if (!tiles.length) {
      const empty = document.createElement('p');
      empty.className = 'detail-empty';
      empty.textContent = '없음';
      return empty;
    }
    const row = document.createElement('div');
    row.className = 'mini-tiles';
    row.setAttribute('role', 'img');
    row.setAttribute('aria-label', `${label}: ${tiles.map(tileName).join(', ')}`);
    tiles.forEach(tile => {
      const wrapper = document.createElement('span');
      wrapper.className = 'mini-tile';
      wrapper.append(tileImage(tile));
      row.append(wrapper);
    });
    return row;
  }

  function detailLine(parent, title, tiles) {
    const label = document.createElement('p');
    label.className = 'detail-label';
    label.textContent = title;
    parent.append(label, miniTiles(tiles, title));
  }

  function explainedText(parent, value) {
    const pattern = /(양면 대기|샹텐|커쯔|순자|머리|멘젠)/g;
    let start = 0;
    for (const match of value.matchAll(pattern)) {
      parent.append(document.createTextNode(value.slice(start, match.index)));
      const term = document.createElement('abbr');
      term.className = 'term'; term.title = glossary[match[0]]; term.textContent = match[0];
      parent.append(term);
      start = match.index + match[0].length;
    }
    parent.append(document.createTextNode(value.slice(start)));
  }

  function createCard(item, index) {
    const card = document.createElement('details');
    card.className = 'result-card';
    card.open = index === 0;
    const summary = document.createElement('summary');
    const head = document.createElement('div');
    head.className = 'card-head';
    const rank = document.createElement('span'); rank.className = 'card-rank'; rank.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('strong'); title.className = 'card-title'; title.textContent = item.name;
    const flag = document.createElement('span'); flag.className = 'card-flag'; flag.textContent = item.openAllowed ? '울기 가능' : '멘젠 전용';
    flag.title = item.openAllowed ? '치·퐁·명깡을 해도 성립할 수 있는 역' : '치·퐁·명깡을 하지 않은 손패에서만 성립하는 역';
    const chevron = document.createElement('span'); chevron.className = 'card-chevron'; chevron.setAttribute('aria-hidden', 'true'); chevron.textContent = '⌄';
    head.append(rank, title, flag, chevron);
    const condition = document.createElement('p'); condition.className = 'card-condition'; explainedText(condition, item.condition);
    const match = document.createElement('span'); match.className = 'card-match';
    match.textContent = `입력 ${hand.length}장 중 ${item.kept.length}장이 아래 예시와 일치`;
    summary.append(head, condition, match);

    const detail = document.createElement('div'); detail.className = 'card-detail';
    detailLine(detail, '입력한 패 중 예시에 들어가는 패', item.kept);
    detailLine(detail, '이 예시에 더 필요한 패', item.missing);
    detailLine(detail, '대표 완성형 예시', item.example);
    detailLine(detail, '이 예시와 다른 입력 패', item.toSetAside);
    const note = document.createElement('p'); note.className = 'detail-note';
    note.textContent = '한 가지 대표 예시입니다. 같은 역을 만드는 다른 완성형도 있습니다.';
    detail.append(note);
    card.append(summary, detail);
    return card;
  }

  function buildPalette() {
    const palette = el('tilePalette');
    for (const [title, indices] of groups) {
      const row = document.createElement('div'); row.className = 'palette-row';
      const heading = document.createElement('strong'); heading.textContent = title;
      const tiles = document.createElement('div'); tiles.className = 'palette-tiles';
      for (const tile of indices) {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'tile-button';
        button.setAttribute('aria-label', `${tileName(tile)} 추가`);
        button.title = `${tileName(tile)} 추가`;
        button.append(tileImage(tile));
        const count = document.createElement('span'); count.className = 'copy-count'; count.hidden = true;
        button.append(count);
        button.addEventListener('click', () => { hand.push(tile); render(); });
        paletteButtons[tile] = { button, count };
        tiles.append(button);
      }
      row.append(heading, tiles);
      palette.append(row);
    }
  }

  function renderHand() {
    const selected = el('selectedHand');
    selected.replaceChildren();
    if (!hand.length) {
      const empty = document.createElement('span'); empty.className = 'empty-hand';
      empty.textContent = '위에 적거나 아래에서 패를 누르면 여기에 쌓입니다.';
      selected.append(empty);
      return;
    }
    const sorted = hand.map((tile, index) => ({ tile, index })).sort((a, b) => a.tile - b.tile || a.index - b.index);
    for (const { tile, index } of sorted) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'tile-button';
      button.setAttribute('aria-label', `${tileName(tile)} 제거`); button.title = `${tileName(tile)} 제거`;
      button.append(tileImage(tile));
      button.addEventListener('click', () => { hand.splice(index, 1); render(); });
      selected.append(button);
    }
  }

  function renderResults() {
    const target = el('resultCards');
    target.replaceChildren();
    if (!hand.length) {
      el('resultCount').textContent = '0개 후보';
      el('resultIntro').textContent = '패를 몇 장 골라 넣으면 조건과 예시가 이곳에 나타납니다.';
      el('liveLead').textContent = '패를 넣으면 바로 나타납니다';
      const empty = document.createElement('div'); empty.className = 'placeholder';
      const title = document.createElement('strong'); title.textContent = '패 3~8장부터 시작해 보세요';
      const hint = document.createElement('span'); hint.textContent = '백 한 쌍, 네 쌍, 삼색 순자 예시를 눌러도 됩니다.';
      empty.append(title, hint); target.append(empty);
      return;
    }
    const { limitedEvidence, results } = D.lookup(hand, { seat, round, opened, limit: 5 });
    if (!results.length) {
      el('liveLead').textContent = '일치하는 예시가 없습니다';
      el('resultCount').textContent = '0개 후보';
      el('resultIntro').textContent = '입력한 패와 겹치는 대표 예시가 없습니다. 패를 더 넣거나 일부를 지워 보세요.';
      return;
    }
    el('liveLead').textContent = `${results[0].name} · 예시와 ${results[0].kept.length}/${hand.length}장 일치`;
    el('resultCount').textContent = `${results.length}개 후보`;
    el('resultIntro').textContent = limitedEvidence
      ? '아직 단서가 적습니다. 아래 순서는 대표 예시와의 일치도만 보여줍니다.'
      : `입력한 ${hand.length}장과 겹치는 대표 완성형입니다. 펼쳐서 역 조건과 필요한 패를 비교해 보세요.`;
    results.forEach((item, index) => target.append(createCard(item, index)));
  }

  function render({ syncText = true, syncCompact = true } = {}) {
    if (syncText) syncQuickInputs();
    if (syncCompact) syncCompactInput();
    el('notationPreview').textContent = Q.formatNotation(hand) || '예: 123m123p123s5567z';
    el('inputCount').textContent = hand.length;
    const counts = Array(34).fill(0);
    hand.forEach(tile => counts[tile]++);
    for (let tile = 0; tile < 34; tile++) {
      const { button, count } = paletteButtons[tile];
      button.disabled = hand.length >= 14 || counts[tile] >= 4;
      count.hidden = counts[tile] === 0;
      count.textContent = counts[tile];
      button.setAttribute('aria-label', `${tileName(tile)} 추가, 현재 ${counts[tile]}장`);
    }
    el('undo').disabled = !hand.length;
    el('clear').disabled = !hand.length;
    renderHand();
    renderResults();
  }

  function connectControls() {
    const compact = el('quickCompact');
    compact.addEventListener('input', event => { if (!event.isComposing) readCompactInput(); });
    compact.addEventListener('compositionend', readCompactInput);
    compact.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); compact.blur(); }
    });
    const orderedInputs = [...document.querySelectorAll('[data-quick]')];
    orderedInputs.forEach((input, index) => {
      quickInputs[input.dataset.quick] = input;
      input.addEventListener('input', event => {
        if (!event.isComposing) readQuickInputs(input.dataset.quick);
      });
      input.addEventListener('compositionend', () => readQuickInputs(input.dataset.quick));
      input.addEventListener('keydown', event => {
        if (event.key !== 'Enter' || event.isComposing) return;
        event.preventDefault();
        if (orderedInputs[index + 1]) orderedInputs[index + 1].focus();
        else input.blur();
      });
    });
    document.querySelectorAll('.preset').forEach(button => button.addEventListener('click', () => {
      hand = D.parseTiles(button.dataset.spec); render();
    }));
    el('undo').addEventListener('click', () => { hand.pop(); render(); });
    el('clear').addEventListener('click', () => { hand = []; render(); });
    el('jumpResults').addEventListener('click', () => el('resultsTitle').scrollIntoView({ behavior: 'smooth', block: 'start' }));
    document.querySelectorAll('.segments').forEach(group => group.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || !group.contains(button)) return;
      group.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      if (group.dataset.wind === 'seat') seat = Number(button.dataset.value);
      if (group.dataset.wind === 'round') round = Number(button.dataset.value);
      if (group.hasAttribute('data-state')) opened = button.dataset.opened === 'true';
      renderResults();
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Backspace' && !event.repeat && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (hand.length) { hand.pop(); render(); event.preventDefault(); }
      }
    });
  }

  try {
    const response = await fetch('yaku-catalog.json');
    if (!response.ok) throw new Error(`데이터를 불러오지 못했습니다 (${response.status}).`);
    D = window.createMahjongDictionary(await response.json());
    buildPalette(); connectControls(); render();
  } catch (error) {
    el('resultIntro').textContent = `${error.message} · 로컬 서버나 웹 주소에서 다시 열어 주세요.`;
  }
})();
