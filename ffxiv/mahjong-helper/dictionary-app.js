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
  let currentResults = [];
  let pipWindow = null;
  let pipOpening = false;
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

  function tileImage(tile, owner = document) {
    const image = owner.createElement('img');
    image.src = new URL(`overlay/templates/${labels[tile]}.png`, document.baseURI).href;
    image.alt = '';
    image.loading = 'lazy';
    return image;
  }

  function miniTiles(tiles, label, owner = document, highlighted = null) {
    if (!tiles.length) {
      const empty = owner.createElement('p');
      empty.className = 'detail-empty';
      empty.textContent = '없음';
      return empty;
    }
    const row = owner.createElement('div');
    row.className = 'mini-tiles';
    if (highlighted) row.classList.add('yaku-highlight');
    row.setAttribute('role', 'img');
    row.setAttribute('aria-label', `${label}: ${tiles.map(tileName).join(', ')}${highlighted ? `. 강조한 패: ${tiles.filter((_, index) => highlighted[index]).map(tileName).join(', ')}` : ''}`);
    tiles.forEach((tile, index) => {
      const wrapper = owner.createElement('span');
      wrapper.className = 'mini-tile';
      if (highlighted?.[index]) wrapper.classList.add('yaku-focus');
      wrapper.append(tileImage(tile, owner));
      row.append(wrapper);
    });
    return row;
  }

  function detailLine(parent, title, tiles, highlighted = null) {
    const label = document.createElement('p');
    label.className = 'detail-label';
    label.textContent = highlighted ? `${title} · 금색 테두리 = 역의 핵심 패` : title;
    parent.append(label, miniTiles(tiles, title, document, highlighted));
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
    detailLine(detail, '대표 완성형 예시', item.example, item.highlighted);
    detailLine(detail, '이 예시와 다른 입력 패', item.toSetAside);
    const note = document.createElement('p'); note.className = 'detail-note';
    note.textContent = '한 가지 대표 예시입니다. 같은 역을 만드는 다른 완성형도 있습니다.';
    detail.append(note);
    card.append(summary, detail);
    return card;
  }

  function renderHand() {
    const selected = el('selectedHand');
    selected.replaceChildren();
    if (!hand.length) {
      const empty = document.createElement('span'); empty.className = 'empty-hand';
      empty.textContent = '위의 입력창에 적은 패가 여기에 표시됩니다.';
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

  function renderPip({ syncInput = true } = {}) {
    if (!pipWindow || pipWindow.closed) return;
    const child = pipWindow.document;
    const input = child.getElementById('pipQuickCompact');
    const target = child.getElementById('pipResult');
    if (!input || !target) return;
    if (syncInput) {
      input.value = Q.formatCompact(hand);
      input.setAttribute('aria-invalid', 'false');
      child.getElementById('pipMessage').textContent = '';
    }
    child.getElementById('pipInputCount').textContent = `${hand.length}/14장`;
    target.replaceChildren();
    const item = currentResults[0];
    if (!item) {
      const empty = child.createElement('p');
      empty.className = 'pip-empty';
      empty.textContent = hand.length ? '겹치는 예시가 없습니다. 패를 조정해 보세요.' : '패를 입력하면 가장 가까운 완성형의 대표 예시가 나타납니다.';
      target.append(empty);
      return;
    }
    const head = child.createElement('div'); head.className = 'pip-result-head';
    const name = child.createElement('strong'); name.textContent = item.name;
    const match = child.createElement('span'); match.textContent = `예시와 ${item.kept.length}/${hand.length}장 일치`;
    head.append(name, match);
    const condition = child.createElement('p'); condition.className = 'pip-condition'; condition.textContent = item.condition;
    const label = child.createElement('p'); label.className = 'pip-example-label'; label.textContent = '대표 완성형 예시 · 금색 테두리 = 역의 핵심 패';
    target.append(head, condition, label, miniTiles(item.example, '대표 완성형 예시', child, item.highlighted));
  }

  function renderResults({ syncPipInput = true } = {}) {
    const target = el('resultCards');
    target.replaceChildren();
    if (!hand.length) {
      currentResults = [];
      el('resultCount').textContent = '0개 후보';
      el('resultIntro').textContent = '패를 몇 장 적으면 조건과 예시가 이곳에 나타납니다.';
      el('liveLead').textContent = '패를 넣으면 바로 나타납니다';
      const empty = document.createElement('div'); empty.className = 'placeholder';
      const title = document.createElement('strong'); title.textContent = '패 3~8장부터 시작해 보세요';
      const hint = document.createElement('span'); hint.textContent = '예: 123ㅁ 123ㅌ 123ㅅ처럼 적어 보세요.';
      empty.append(title, hint); target.append(empty);
      renderPip({ syncInput: syncPipInput });
      return;
    }
    const { limitedEvidence, results } = D.lookup(hand, { seat, round, opened, limit: 5 });
    currentResults = results;
    if (!results.length) {
      el('liveLead').textContent = '일치하는 예시가 없습니다';
      el('resultCount').textContent = '0개 후보';
      el('resultIntro').textContent = '입력한 패와 겹치는 대표 예시가 없습니다. 패를 더 넣거나 일부를 지워 보세요.';
      renderPip({ syncInput: syncPipInput });
      return;
    }
    el('liveLead').textContent = `${results[0].name} · 예시와 ${results[0].kept.length}/${hand.length}장 일치`;
    el('resultCount').textContent = `${results.length}개 후보`;
    el('resultIntro').textContent = limitedEvidence
      ? '아직 단서가 적습니다. 아래 순서는 대표 예시와의 일치도만 보여줍니다.'
      : `입력한 ${hand.length}장과 겹치는 대표 완성형입니다. 펼쳐서 역 조건과 필요한 패를 비교해 보세요.`;
    results.forEach((item, index) => target.append(createCard(item, index)));
    renderPip({ syncInput: syncPipInput });
  }

  function render({ syncText = true, syncCompact = true, syncPipInput = true } = {}) {
    if (syncText) syncQuickInputs();
    if (syncCompact) syncCompactInput();
    el('notationPreview').textContent = Q.formatNotation(hand) || '예: 123m123p123s5567z';
    el('inputCount').textContent = hand.length;
    el('undo').disabled = !hand.length;
    el('clear').disabled = !hand.length;
    renderHand();
    renderResults({ syncPipInput });
  }

  function readPipInput() {
    if (!pipWindow || pipWindow.closed) return;
    const child = pipWindow.document;
    const input = child.getElementById('pipQuickCompact');
    const message = child.getElementById('pipMessage');
    const { tiles, error, pending } = Q.parseCompact(input.value);
    input.setAttribute('aria-invalid', String(Boolean(error)));
    message.textContent = error ? `${error.message} · 마지막 정상 입력을 표시합니다.`
      : pending ? '끝에 종류 기호를 붙이면 마지막 숫자도 반영됩니다.' : '';
    if (error) return;
    hand = keepInputOrder(hand, tiles);
    render({ syncPipInput: false });
  }

  function connectContextControls(container) {
    container.querySelectorAll('.segments').forEach(group => group.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || !group.contains(button)) return;
      if (group.dataset.wind === 'seat') seat = Number(button.dataset.value);
      if (group.dataset.wind === 'round') round = Number(button.dataset.value);
      if (group.hasAttribute('data-state')) opened = button.dataset.opened === 'true';
      const selector = group.dataset.wind ? `[data-wind="${group.dataset.wind}"]` : '[data-state]';
      for (const root of [document, pipWindow?.document]) {
        const matchingGroup = root?.querySelector(selector);
        if (!matchingGroup) continue;
        matchingGroup.querySelectorAll('button').forEach(option => {
          const matches = group.dataset.wind
            ? option.dataset.value === button.dataset.value
            : option.dataset.opened === button.dataset.opened;
          option.setAttribute('aria-pressed', String(matches));
        });
      }
      renderResults();
    }));
  }

  function connectPip() {
    const button = el('openPip');
    const status = el('pipStatus');
    const supported = Boolean(window.isSecureContext && window.documentPictureInPicture?.requestWindow);
    if (!supported) {
      button.textContent = '작은 창 열기';
      status.textContent = '이 브라우저에서는 일반 작은 창으로 열립니다. 항상 위 고정은 지원하지 않습니다.';
    }
    function cleanup(openedWindow) {
      if (pipWindow !== openedWindow) return;
      pipWindow = null;
      button.setAttribute('aria-pressed', 'false');
      button.textContent = supported ? 'PiP 작은 창' : '작은 창 열기';
      status.textContent = '작은 창을 닫았어요. 입력한 패는 이 페이지에 남아 있습니다.';
    }
    button.addEventListener('click', async () => {
      if (pipOpening) return;
      if (pipWindow && !pipWindow.closed) { pipWindow.focus(); return; }
      pipOpening = true;
      button.disabled = true;
      try {
        const openedWindow = supported
          ? await window.documentPictureInPicture.requestWindow({ width: 500, height: 490 })
          : window.open('about:blank', 'mahjong-dictionary-pip', 'popup,width=500,height=490');
        if (!openedWindow) throw new Error('작은 창을 열지 못했습니다.');
        pipWindow = openedWindow;
        const child = openedWindow.document;
        child.documentElement.lang = 'ko';
        child.title = '작패유희 · 역 사전';
        const viewport = child.createElement('meta');
        viewport.name = 'viewport'; viewport.content = 'width=device-width, initial-scale=1';
        child.head.append(viewport);
        for (const file of ['dictionary.css?v=20260929-pip1', 'pip.css?v=20260929-pip1']) {
          const stylesheet = child.createElement('link');
          stylesheet.rel = 'stylesheet';
          stylesheet.href = new URL(file, document.baseURI).href;
          child.head.append(stylesheet);
        }
        child.body.className = 'pip-body';
        child.body.innerHTML = '<div class="pip-shell"><header class="pip-heading"><strong>작패유희 역 사전</strong><button type="button" id="backToMain">본 페이지 ↗</button></header><label class="pip-input">한 줄 패 입력 <span id="pipInputCount">0/14장</span><input id="pipQuickCompact" type="text" autocomplete="off" spellcheck="false" placeholder="123ㅁ 123ㅌ 123ㅅ 5567ㅈ" aria-describedby="pipHelp pipMessage"></label><p id="pipHelp" class="pip-input-help">ㅁ 만 · ㅌ 통 · ㅅ 삭 · ㅈ 자패 (1동~7중)</p><p id="pipMessage" class="pip-message" role="status"></p><div id="pipContext"></div><section id="pipResult" class="pip-result" aria-label="가장 가까운 완성형 예시"></section><p class="pip-caveat">대표 예시와 겹치는 장수입니다. 화료 확률은 아닙니다.</p></div>';
        child.getElementById('backToMain').addEventListener('click', () => window.focus());
        const context = document.querySelector('.context').cloneNode(true);
        child.getElementById('pipContext').append(context);
        connectContextControls(context);
        const input = child.getElementById('pipQuickCompact');
        input.addEventListener('input', event => { if (!event.isComposing) readPipInput(); });
        input.addEventListener('compositionend', readPipInput);
        input.addEventListener('keydown', event => {
          if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); input.blur(); }
        });
        openedWindow.addEventListener('pagehide', () => cleanup(openedWindow), { once: true });
        button.setAttribute('aria-pressed', 'true');
        button.textContent = '작은 창으로 이동';
        status.textContent = supported
          ? 'PiP 실행 중 · 작은 창에서 입력하면 이 페이지에도 반영됩니다.'
          : '일반 작은 창 실행 중 · 항상 위 고정은 지원하지 않습니다.';
        renderPip();
        input.focus();
      } catch (error) {
        if (pipWindow && !pipWindow.closed) pipWindow.close();
        pipWindow = null;
        button.setAttribute('aria-pressed', 'false');
        status.textContent = supported
          ? 'PiP를 열지 못했어요. 브라우저 설정을 확인하고 다시 눌러 주세요.'
          : '작은 창이 차단됐어요. 팝업을 허용한 뒤 다시 눌러 주세요.';
      } finally {
        pipOpening = false;
        button.disabled = false;
      }
    });
    window.addEventListener('pagehide', () => { if (pipWindow && !pipWindow.closed) pipWindow.close(); });
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
    el('undo').addEventListener('click', () => { hand.pop(); render(); });
    el('clear').addEventListener('click', () => { hand = []; render(); });
    el('jumpResults').addEventListener('click', () => el('resultsTitle').scrollIntoView({ behavior: 'smooth', block: 'start' }));
    connectContextControls(document.querySelector('.context'));
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
    connectControls(); connectPip(); render();
  } catch (error) {
    el('resultIntro').textContent = `${error.message} · 로컬 서버나 웹 주소에서 다시 열어 주세요.`;
  }
})();
