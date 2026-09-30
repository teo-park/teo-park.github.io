(async function () {
  const H = window.MahjongHelper;
  const Q = window.MahjongQuickInput;
  const M = window.MahjongMeldInput;
  const U = window.MahjongUnavailableInput;
  const O = window.MahjongOpening;
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
    '샹텐': '텐파이까지 남은 최소 패 교환 횟수입니다. 0샹텐은 한 장을 기다리는 텐파이입니다.',
    '순자': '같은 종류의 연속된 숫자 패 3장입니다. 예: 2·3·4만.',
    '커쯔': '같은 패 3장으로 만든 묶음입니다.',
    '머리': '같은 패 2장으로 만든 한 쌍입니다.',
    '멘젠': '다른 사람의 버린 패를 치·퐁·명깡으로 가져오지 않은 손패입니다.',
    '양면 대기': '연속된 두 패의 양끝 숫자를 기다리는 형태입니다. 예: 2·3에서 1 또는 4.'
  };
  const evidenceHints = {
    chiitoitsu: '또이츠: 같은 패 2장으로 된 한 쌍입니다. 치또이츠에는 서로 다른 패 7쌍이 필요합니다.',
    toitoi: '커쯔는 같은 패 3장, 깡은 같은 패 4장으로 만든 묶음입니다.',
    pinfu: glossary['순자'],
    sanshoku: glossary['순자'],
    ittsuu: glossary['순자'],
    iipeikou: glossary['순자']
  };
  let D;
  let hand = [];
  let melds = [];
  let unavailable = [];
  let seat = 27;
  let round = 27;
  let manualOpened = false;
  let currentResults = [];
  let currentWeakEvidence = false;
  let meldSyntaxError = '';
  let meldEditSource = 'fields';
  let meldEditedField = '';
  let unavailableSyntaxError = '';
  let unavailableEditSource = 'fields';
  let unavailableEditedField = '';
  let unavailablePending = false;
  let currentBlockedByUnavailable = false;
  let currentOpening = null;
  let pipWindow = null;
  let pipOpening = false;
  const quickInputs = {};
  const inputTotal = () => hand.length + melds.length * 3;
  const isOpened = () => manualOpened || melds.some(meld => meld.open);

  function stateError() {
    const counts = Array(34).fill(0);
    for (const tile of [...hand, ...melds.flatMap(meld => meld.tiles)])
      if (++counts[tile] > 4) return '손패와 옆 패를 합쳐 같은 패는 네 장까지입니다.';
    if (inputTotal() > 14) return `옆 패 ${melds.length}묶음이면 손패는 ${14 - 3 * melds.length}장까지입니다. 손패 칸에서 패를 줄여 주세요.`;
    return '';
  }

  function syncOpenedControls() {
    const forced = melds.some(meld => meld.open);
    for (const root of [document, pipWindow?.document]) {
      const group = root?.querySelector('[data-state]');
      if (!group) continue;
      group.querySelectorAll('button').forEach(button => {
        button.disabled = forced;
        button.setAttribute('aria-pressed', String((button.dataset.opened === 'true') === isOpened()));
      });
    }
    const hint = forced ? '치·퐁·명깡 묶음이 있어 자동으로 울었음 처리했어요.'
      : '옆으로 낸 패는 손패 칸에서 빼고 적어 주세요. 안깡만 했다면 멘젠을 유지해요.';
    el('openedHint').textContent = hint;
    el('openedHint').classList.toggle('opened-hint-auto', forced);
    const pipHint = pipWindow?.document.getElementById('pipOpenedHint');
    if (pipHint) pipHint.textContent = hint;
  }

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

  function readMeldInput(input, fromPip = false) {
    const parsed = M.parse(input.value);
    meldEditSource = 'compact';
    meldSyntaxError = parsed.error?.message || '';
    if (!parsed.error) melds = parsed.melds;
    render({ syncMeldText: fromPip, syncPipInput: !fromPip });
    if (fromPip && !parsed.error) syncPipMeldFields();
  }

  function readMeldFields(root, fromPip = false, editedField = '') {
    const inputs = [...root.querySelectorAll(fromPip ? '[data-pip-meld]' : '[data-meld]')];
    const values = Object.fromEntries(inputs.map(input => [fromPip ? input.dataset.pipMeld : input.dataset.meld, input.value]));
    const parsed = M.parseFields(values);
    meldEditSource = 'fields';
    meldEditedField = parsed.field || editedField;
    meldSyntaxError = parsed.error?.message || '';
    if (!parsed.error) melds = parsed.melds;
    render({ syncMeldFields: fromPip, syncPipInput: !fromPip });
    if (fromPip && !parsed.error) root.getElementById('pipMeldInput').value = M.format(melds);
  }

  function readUnavailableInput(input, fromPip = false) {
    const parsed = U.parse(input.value);
    unavailableEditSource = 'compact';
    unavailableSyntaxError = parsed.error?.message || '';
    unavailablePending = parsed.pending;
    if (!parsed.error) unavailable = parsed.tiles;
    render({ syncUnavailableText: fromPip, syncPipInput: !fromPip });
    if (fromPip && !parsed.error) syncPipUnavailableFields();
  }

  function readUnavailableFields(root, fromPip = false, editedField = '') {
    const inputs = [...root.querySelectorAll(fromPip ? '[data-pip-unavailable]' : '[data-unavailable]')];
    const values = Object.fromEntries(inputs.map(input => [fromPip ? input.dataset.pipUnavailable : input.dataset.unavailable, input.value]));
    const parsed = U.parseFields(values);
    unavailableEditSource = 'fields';
    unavailableEditedField = parsed.error?.field || editedField;
    unavailableSyntaxError = parsed.error?.message || '';
    unavailablePending = false;
    if (!parsed.error) unavailable = parsed.tiles;
    render({ syncUnavailableFields: fromPip, syncPipInput: !fromPip });
    if (fromPip && !parsed.error) root.getElementById('pipUnavailableInput').value = U.format(unavailable);
  }

  function syncPipMeldFields() {
    if (!pipWindow || pipWindow.closed) return;
    const values = M.formatFields(melds);
    pipWindow.document.querySelectorAll('[data-pip-meld]').forEach(input => { input.value = values[input.dataset.pipMeld]; });
  }

  function syncPipUnavailableFields() {
    if (!pipWindow || pipWindow.closed) return;
    const values = U.formatFields(unavailable);
    pipWindow.document.querySelectorAll('[data-pip-unavailable]').forEach(input => { input.value = values[input.dataset.pipUnavailable]; });
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

  function renderMeldPreview(owner, target) {
    if (!target) return;
    target.replaceChildren();
    melds.forEach((meld, index) => {
      const chip = owner.createElement('div'); chip.className = 'meld-chip';
      const head = owner.createElement('div'); head.className = 'meld-chip-head';
      const name = owner.createElement('span');
      name.textContent = meld.type === 'chi' ? '치' : meld.type === 'pon' ? '퐁' : meld.open ? '명깡' : '안깡';
      const remove = owner.createElement('button'); remove.type = 'button'; remove.textContent = '×';
      remove.setAttribute('aria-label', `${name.textContent} ${meld.tiles.map(tileName).join(', ')} 제거`);
      remove.addEventListener('click', () => { melds.splice(index, 1); meldSyntaxError = ''; render(); });
      head.append(name, remove);
      chip.append(head, miniTiles(meld.tiles, `${name.textContent} 묶음`, owner));
      target.append(chip);
    });
  }

  function renderUnavailablePreview(owner, target) {
    if (!target) return;
    target.replaceChildren();
    unavailable.forEach(tile => {
      const button = owner.createElement('button');
      button.type = 'button';
      button.className = 'unavailable-chip';
      button.title = `${tileName(tile)} 0장 표시 제거`;
      button.setAttribute('aria-label', button.title);
      const image = owner.createElement('span');
      image.className = 'mini-tile';
      image.append(tileImage(tile, owner));
      const remove = owner.createElement('span');
      remove.setAttribute('aria-hidden', 'true');
      remove.textContent = '×';
      button.append(image, remove);
      button.addEventListener('click', () => {
        unavailable = unavailable.filter(value => value !== tile);
        unavailableSyntaxError = '';
        unavailablePending = false;
        render();
      });
      target.append(button);
    });
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
    match.textContent = `${item.evidenceLabel} · 예시 전체 ${item.kept.length}/${inputTotal()}장 일치`;
    if (evidenceHints[item.id]) match.title = evidenceHints[item.id];
    summary.append(head, condition, match);

    const detail = document.createElement('div'); detail.className = 'card-detail';
    if (item.coreTotal < 14 && item.coreMissing.length)
      detailLine(detail, '이 예시의 역 핵심에 아직 필요한 패', item.coreMissing);
    detailLine(detail, '손패·옆 패 중 예시에 들어가는 패', item.kept);
    detailLine(detail, '이 예시에 더 필요한 패', item.missing);
    detailLine(detail, '대표 완성형 예시', item.example, item.highlighted);
    detailLine(detail, '이 예시와 다른 손패', item.toSetAside);
    const note = document.createElement('p'); note.className = 'detail-note';
    note.textContent = item.id === 'chiitoitsu'
      ? '같은 패 2장이 또이츠 1쌍입니다. 낱패가 예시와 같아도 또이츠가 완성된 것은 아닙니다.'
      : '한 가지 대표 예시입니다. 같은 역을 만드는 다른 완성형도 있습니다.';
    detail.append(note);
    card.append(summary, detail);
    return card;
  }

  const percent = probability => probability === 0 ? '0%' : probability < .0001 ? '<0.01%'
    : `${(probability * 100).toFixed(probability < .01 ? 2 : 1)}%`;
  function renderOpening(owner, target) {
    if (!target) return;
    const wasExpanded = target.querySelector('.opening-details')?.open || false;
    target.replaceChildren();
    const text = (tag, value, title = '') => {
      const node = owner.createElement(tag); node.textContent = value;
      if (title) { node.title = title; node.className = 'term'; }
      return node;
    };
    target.append(text('h3', '첫 손패 분석'));
    const model = currentOpening;
    if (!model) {
      target.append(text('p', '멘젠 손패 13·14장을 모두 입력하면 분석이 나타납니다.'));
      return;
    }
    if (model.complete) {
      target.append(text('p', '14장의 화료 형태가 완성됐어요. 화료하려면 역과 대기 조건도 확인하세요.'));
      return;
    }
    const stats = owner.createElement('div'); stats.className = 'opening-stats';
    stats.append(text('strong', model.shanten === 0 ? '텐파이' : `${model.shanten}샹텐`, '샹텐은 텐파이까지 필요한 최소 패 교환 횟수입니다. 0샹텐은 한 장을 기다리는 텐파이입니다.'),
      text('strong', `유효패 ${model.effective.total}장`, '유효패는 뽑으면 샹텐이 줄어드는 패입니다. 각 패 4장에서 내 손패와 이번 버림패를 뺀 장수를 셉니다.'),
      text('span', `다음 뽑기 개선 ${percent(model.nextChance)}`));
    if (model.discards.length) stats.prepend(text('strong', `버릴 패 ${tileName(model.analyzedDiscard)}`, `${tileName(model.analyzedDiscard)}을 버린 뒤의 샹텐·유효패입니다. 샹텐을 최소로 유지하면서 유효패가 가장 많은 선택입니다.`));
    target.append(stats);
    const promising = model.paths.filter(path => path.missing.length <= 2 && path.probability >= .01).slice(0, 2);
    for (const path of promising) {
      const brief = owner.createElement('div'); brief.className = 'opening-brief';
      brief.append(text('strong', `${path.name} 핵심 · ${path.missing.length ? percent(path.probability) : '갖춤'}`, `${model.draws}번의 내 뽑기 안에 이 역의 핵심 패를 모을 확률입니다. 화료 확률은 아닙니다. 핵심에 필요한 패가 2장 이하이고 이 확률이 1% 이상인 후보만 최대 2개 표시합니다.`),
        text('span', path.missing.length ? `필요: ${path.missing.map(tileName).join(' · ')}` : '나머지 묶음·머리도 확인하세요.'));
      target.append(brief);
    }
    if (!promising.length) {
      const brief = owner.createElement('div'); brief.className = 'opening-brief';
      brief.append(text('span', '가까운 역 핵심 없음 · 유효패를 우선하세요.', '핵심에 필요한 패가 2장 이하이고, 8번의 내 뽑기 안에 모을 확률이 1% 이상인 후보가 없습니다. 비교 범위는 이페코·삼색동순·일기통관·역패입니다.'));
      target.append(brief);
    }
    const expanded = owner.createElement('details'); expanded.className = 'opening-details'; expanded.open = wasExpanded;
    expanded.append(text('summary', '자세히 보기'));
    target.append(expanded);
    if (model.discards.length) {
      const details = owner.createElement('details'); details.className = 'opening-discards';
      details.append(text('summary', `버림패 비교 · ${tileName(model.analyzedDiscard)}을 버린 뒤 기준`));
      const table = owner.createElement('table');
      const head = owner.createElement('tr');
      for (const label of ['버릴 패', '샹텐', '유효패']) head.append(text('th', label));
      const thead = owner.createElement('thead'); thead.append(head); table.append(thead);
      const body = owner.createElement('tbody');
      for (const discard of model.discards) {
        const row = owner.createElement('tr');
        if (discard.shanten === model.discards[0].shanten && discard.effective === model.discards[0].effective) row.className = 'opening-best';
        row.append(text('td', tileName(discard.index)), text('td', String(discard.shanten)), text('td', `${discard.effective}장`)); body.append(row);
      }
      table.append(body); details.append(table); expanded.append(details);
    }
    const effective = owner.createElement('div'); effective.className = 'opening-effective';
    for (const tile of model.effective.tiles) {
      const chip = owner.createElement('span'); chip.className = 'opening-chip';
      chip.setAttribute('aria-label', `${tileName(tile.index)} 남은 ${tile.remaining}장`);
      chip.append(tileImage(tile.index, owner), text('span', `${tile.remaining}장`)); effective.append(chip);
    }
    expanded.append(effective, text('h4', `${model.draws}번의 내 뽑기 안에 역 핵심 모으기`),
      text('p', `안 보이는 ${model.unseen}장이 무작위이고 필요한 패를 보유한다고 가정합니다. 각 역에서 가장 유리한 한 가지 핵심 모양을 비교해요. 나머지 묶음·머리와 실제 화료는 별도로 완성해야 합니다.`));
    for (const path of model.paths) {
      const row = owner.createElement('div'); row.className = 'opening-path';
      const heading = owner.createElement('div'); heading.className = 'opening-path-head';
      heading.append(text('strong', path.name), text('strong', path.missing.length ? percent(path.probability) : '핵심 갖춤'));
      row.append(heading, miniTiles(path.core.slice().sort((a, b) => a - b), `${path.name} 비교하는 핵심 패`, owner));
      row.append(text('p', path.missing.length ? `더 필요한 패: ${path.missing.map(tileName).join(' · ')}` : '이 역의 핵심 모양은 이미 있습니다.'));
      expanded.append(row);
    }
    expanded.append(text('p', '비교 범위: 이페코·삼색동순·일기통관·역패. 서로 다른 핵심 모양의 확률을 합한 값이나 화료 확률은 아닙니다. 상대의 버림패·치·퐁·깡·대국 종료는 반영하지 않습니다.'));
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
    const target = child.getElementById('pipResult');
    if (!target) return;
    renderOpening(child, child.getElementById('pipOpeningGuide'));
    if (syncInput) {
      const values = Q.format(hand);
      child.querySelectorAll('[data-pip-quick]').forEach(input => {
        input.value = values[input.dataset.pipQuick];
        input.setAttribute('aria-invalid', 'false');
      });
      const compact = child.getElementById('pipQuickCompact');
      compact.value = Q.formatCompact(hand);
      compact.setAttribute('aria-invalid', 'false');
      child.getElementById('pipMeldInput').value = M.format(melds);
      child.getElementById('pipUnavailableInput').value = U.format(unavailable);
      syncPipMeldFields();
      syncPipUnavailableFields();
      child.getElementById('pipMessage').textContent = '';
    }
    child.getElementById('pipInputCount').textContent = `손패 ${hand.length}/${14 - melds.length * 3}장`;
    child.getElementById('pipMeldCount').textContent = `${melds.length}/4묶음`;
    child.getElementById('pipUnavailableCount').textContent = `${unavailable.length}종`;
    child.getElementById('pipMeldError').textContent = meldSyntaxError || stateError();
    child.getElementById('pipMeldInput').setAttribute('aria-invalid', String(Boolean(meldSyntaxError && meldEditSource === 'compact')));
    child.querySelectorAll('[data-pip-meld]').forEach(input => input.setAttribute('aria-invalid',
      String(Boolean(meldSyntaxError && meldEditSource === 'fields' && (!meldEditedField || meldEditedField === input.dataset.pipMeld)))));
    renderMeldPreview(child, child.getElementById('pipMeldPreview'));
    child.getElementById('pipUnavailableError').textContent = unavailableSyntaxError ||
      (unavailablePending ? '끝에 종류 기호를 붙이면 마지막 숫자도 반영됩니다.' : '');
    child.getElementById('pipUnavailableInput').setAttribute('aria-invalid', String(Boolean(unavailableSyntaxError && unavailableEditSource === 'compact')));
    child.querySelectorAll('[data-pip-unavailable]').forEach(input => input.setAttribute('aria-invalid',
      String(Boolean(unavailableSyntaxError && unavailableEditSource === 'fields' && (!unavailableEditedField || unavailableEditedField === input.dataset.pipUnavailable)))));
    renderUnavailablePreview(child, child.getElementById('pipUnavailablePreview'));
    syncOpenedControls();
    child.getElementById('pipResultCount').textContent = `${currentResults.length}개 후보`;
    child.getElementById('pipCaveat').textContent = currentWeakEvidence && inputTotal()
      ? '뚜렷한 역 단서가 없습니다. 아래 순서는 예시 비교용입니다.'
      : '후보는 현재 성립한 역이 아닙니다. 핵심 패와 예시 전체를 구분해 보세요.';
    target.replaceChildren();
    if (!currentResults.length) {
      const empty = child.createElement('p');
      empty.className = 'pip-empty';
      empty.textContent = inputTotal()
        ? currentBlockedByUnavailable ? '0장 남은 패를 추가로 쓰지 않는 대표 예시가 없습니다. 표시를 확인해 보세요.' : '겹치는 예시가 없습니다. 패를 조정해 보세요.'
        : '패를 입력하면 겹치는 역 후보의 대표 완성형이 나타납니다.';
      target.append(empty);
      return;
    }
    currentResults.forEach((item, index) => {
      const card = child.createElement('article'); card.className = 'pip-result-card';
      const head = child.createElement('div'); head.className = 'pip-result-head';
      const name = child.createElement('strong'); name.textContent = `${index + 1}. ${item.name}`;
      const match = child.createElement('span'); match.textContent = `${item.evidenceLabel} · 전체 ${item.kept.length}/${inputTotal()}`;
      if (evidenceHints[item.id]) match.title = evidenceHints[item.id];
      head.append(name, match);
      const condition = child.createElement('p'); condition.className = 'pip-condition'; condition.textContent = item.condition;
      card.append(head, condition);
      if (item.coreTotal < 14 && item.coreMissing.length) {
        const missing = child.createElement('p'); missing.className = 'pip-condition';
        missing.textContent = `역 핵심에 필요한 패: ${item.coreMissing.map(tileName).join(' · ')}`;
        card.append(missing);
      }
      card.append(miniTiles(item.example, `${item.name} 대표 완성형 예시`, child, item.highlighted));
      target.append(card);
    });
  }

  function renderResults({ syncPipInput = true } = {}) {
    const target = el('resultCards');
    target.replaceChildren();
    const invalid = stateError();
    currentOpening = !invalid && !isOpened() && !melds.length && !unavailable.length && [13, 14].includes(hand.length)
      ? O.analyze(hand, { seat, round }) : null;
    renderOpening(document, el('openingGuide'));
    if (invalid) {
      currentResults = [];
      currentWeakEvidence = false;
      currentBlockedByUnavailable = false;
      el('resultCount').textContent = '입력 확인';
      el('resultIntro').textContent = invalid;
      el('liveLead').textContent = '입력한 패 수를 확인해 주세요';
      renderPip({ syncInput: syncPipInput });
      return;
    }
    if (!inputTotal()) {
      currentResults = [];
      currentWeakEvidence = false;
      currentBlockedByUnavailable = false;
      el('resultCount').textContent = '0개 후보';
      el('resultIntro').textContent = '패를 몇 장 적으면 조건과 예시가 이곳에 나타납니다.';
      el('liveLead').textContent = '패를 넣으면 바로 나타납니다';
      const empty = document.createElement('div'); empty.className = 'placeholder';
      const title = document.createElement('strong'); title.textContent = '패 3~8장부터 시작해 보세요';
      const hint = document.createElement('span'); hint.textContent = '예: 만·통·삭 칸에 각각 123을 적어 보세요.';
      empty.append(title, hint); target.append(empty);
      renderPip({ syncInput: syncPipInput });
      return;
    }
    const { limitedEvidence, weakEvidence, blockedByUnavailable, results } = D.lookup(hand, { seat, round, opened: isOpened(), melds, unavailable });
    currentResults = results;
    currentWeakEvidence = weakEvidence;
    currentBlockedByUnavailable = blockedByUnavailable;
    if (!results.length) {
      el('liveLead').textContent = '일치하는 예시가 없습니다';
      el('resultCount').textContent = '0개 후보';
      el('resultIntro').textContent = blockedByUnavailable
        ? '0장 남은 패를 추가로 쓰지 않는 대표 완성형 예시가 없습니다. 0장 표시를 확인해 보세요. 다른 완성형은 가능할 수 있습니다.'
        : '입력한 패와 겹치는 대표 예시가 없습니다. 패를 더 넣거나 일부를 지워 보세요.';
      renderPip({ syncInput: syncPipInput });
      return;
    }
    const lead = results[0];
    const leadMatch = lead.evidenceLabel;
    el('liveLead').textContent = weakEvidence
      ? `뚜렷한 역 단서 없음 · ${lead.name} ${leadMatch}`
      : `${lead.name} · ${leadMatch}`;
    el('resultCount').textContent = `${results.length}개 후보`;
    el('resultIntro').textContent = limitedEvidence
      ? '아직 단서가 적습니다. 아래 순서는 완성된 묶음과 역 조건을 우선해 비교합니다.'
      : weakEvidence
      ? '뚜렷하게 가까운 역이 없습니다. 아래 후보는 대표 완성형과의 비교용입니다.'
      : `손패와 옆 패 ${inputTotal()}장을 비교한 학습용 후보입니다. 현재 성립한 역은 아니며, 역 핵심 패와 필요한 패를 확인해 보세요.`;
    if (unavailable.length && blockedByUnavailable)
      el('resultIntro').textContent += ' 0장 남은 패가 추가로 필요한 대표 예시는 제외했어요.';
    results.forEach((item, index) => target.append(createCard(item, index)));
    renderPip({ syncInput: syncPipInput });
  }

  function render({ syncText = true, syncCompact = true, syncMeldText = true, syncMeldFields = true,
    syncUnavailableText = true, syncUnavailableFields = true, syncPipInput = true } = {}) {
    if (syncText) syncQuickInputs();
    if (syncCompact) syncCompactInput();
    if (syncMeldText) el('meldInput').value = M.format(melds);
    if (syncUnavailableText) el('unavailableInput').value = U.format(unavailable);
    if (syncMeldFields) {
      const values = M.formatFields(melds);
      document.querySelectorAll('[data-meld]').forEach(input => { input.value = values[input.dataset.meld]; });
    }
    if (syncUnavailableFields) {
      const values = U.formatFields(unavailable);
      document.querySelectorAll('[data-unavailable]').forEach(input => { input.value = values[input.dataset.unavailable]; });
    }
    el('notationPreview').textContent = Q.formatNotation(hand) || '예: 123m123p123s5567z';
    el('inputCount').textContent = hand.length;
    el('handCapacity').textContent = `/ ${14 - melds.length * 3}`;
    el('meldCount').textContent = `${melds.length}/4묶음`;
    el('unavailableCount').textContent = `${unavailable.length}종`;
    const meldMessage = meldSyntaxError || stateError();
    el('meldError').hidden = !meldMessage;
    el('meldError').textContent = meldMessage;
    el('meldInput').setAttribute('aria-invalid', String(Boolean(meldSyntaxError && meldEditSource === 'compact')));
    document.querySelectorAll('[data-meld]').forEach(input => input.setAttribute('aria-invalid',
      String(Boolean(meldSyntaxError && meldEditSource === 'fields' && (!meldEditedField || meldEditedField === input.dataset.meld)))));
    el('unavailableError').hidden = !unavailableSyntaxError;
    el('unavailableError').textContent = unavailableSyntaxError;
    el('unavailablePending').hidden = !unavailablePending || Boolean(unavailableSyntaxError);
    el('unavailableInput').setAttribute('aria-invalid', String(Boolean(unavailableSyntaxError && unavailableEditSource === 'compact')));
    document.querySelectorAll('[data-unavailable]').forEach(input => input.setAttribute('aria-invalid',
      String(Boolean(unavailableSyntaxError && unavailableEditSource === 'fields' && (!unavailableEditedField || unavailableEditedField === input.dataset.unavailable)))));
    el('undo').disabled = !hand.length;
    el('clear').disabled = !hand.length && !melds.length && !unavailable.length;
    renderMeldPreview(document, el('meldPreview'));
    renderUnavailablePreview(document, el('unavailablePreview'));
    syncOpenedControls();
    renderHand();
    renderResults({ syncPipInput });
  }

  function readPipFields() {
    if (!pipWindow || pipWindow.closed) return;
    const child = pipWindow.document;
    const inputs = [...child.querySelectorAll('[data-pip-quick]')];
    const values = Object.fromEntries(inputs.map(input => [input.dataset.pipQuick, input.value]));
    const { tiles, error } = Q.parse(values);
    child.getElementById('pipMessage').textContent = error ? `${error.message} · 마지막 정상 입력을 표시합니다.` : '';
    inputs.forEach(input => input.setAttribute('aria-invalid', String(Boolean(error && (!error.field || error.field === input.dataset.pipQuick)))));
    if (error) return;
    hand = keepInputOrder(hand, tiles);
    child.getElementById('pipQuickCompact').value = Q.formatCompact(hand);
    child.getElementById('pipQuickCompact').setAttribute('aria-invalid', 'false');
    render({ syncPipInput: false });
  }

  function readPipCompactInput() {
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
    const values = Q.format(hand);
    child.querySelectorAll('[data-pip-quick]').forEach(field => {
      field.value = values[field.dataset.pipQuick];
      field.setAttribute('aria-invalid', 'false');
    });
    render({ syncPipInput: false });
  }

  function connectContextControls(container) {
    container.querySelectorAll('.segments').forEach(group => group.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || !group.contains(button)) return;
      if (group.dataset.wind === 'seat') seat = Number(button.dataset.value);
      if (group.dataset.wind === 'round') round = Number(button.dataset.value);
      if (group.hasAttribute('data-state')) {
        if (melds.some(meld => meld.open)) return;
        manualOpened = button.dataset.opened === 'true';
      }
      const selector = group.dataset.wind ? `[data-wind="${group.dataset.wind}"]` : '[data-state]';
      for (const root of [document, pipWindow?.document]) {
        const matchingGroup = root?.querySelector(selector);
        if (!matchingGroup) continue;
        matchingGroup.querySelectorAll('button').forEach(option => {
          const matches = group.dataset.wind
            ? option.dataset.value === button.dataset.value
            : (option.dataset.opened === 'true') === isOpened();
          option.setAttribute('aria-pressed', String(matches));
        });
      }
      syncOpenedControls();
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
          ? await window.documentPictureInPicture.requestWindow({ width: 500, height: 620 })
          : window.open('about:blank', 'mahjong-dictionary-pip', 'popup,width=500,height=620');
        if (!openedWindow) throw new Error('작은 창을 열지 못했습니다.');
        pipWindow = openedWindow;
        const child = openedWindow.document;
        child.documentElement.lang = 'ko';
        child.title = '작패유희 · 역 사전';
        const viewport = child.createElement('meta');
        viewport.name = 'viewport'; viewport.content = 'width=device-width, initial-scale=1';
        child.head.append(viewport);
        for (const file of ['../theme.css?v=20260909-line1', 'dictionary.css?v=20260929-site1', 'pip.css?v=20260930-winds1', 'site-alignment.css?v=20260930-compact1']) {
          const stylesheet = child.createElement('link');
          stylesheet.rel = 'stylesheet';
          stylesheet.href = new URL(file, document.baseURI).href;
          child.head.append(stylesheet);
        }
        child.body.className = 'pip-body';
        child.body.innerHTML = `<div class="pip-shell">
          <header class="pip-heading"><strong>작패유희 역 사전</strong><button type="button" id="backToMain">본 페이지 ↗</button></header>
          <div class="pip-input-heading"><strong>종류별 입력</strong><span id="pipInputCount">0/14장</span></div>
          <div class="pip-fields">
            <label>만<input data-pip-quick="man" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="111345" aria-describedby="pipHelp pipMessage"></label>
            <label>통<input data-pip-quick="pin" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="1123" aria-describedby="pipHelp pipMessage"></label>
            <label>삭<input data-pip-quick="sou" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="559" aria-describedby="pipHelp pipMessage"></label>
            <label>자패<input data-pip-quick="honors" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="11557" aria-describedby="pipHelp pipMessage"></label>
          </div>
          <p id="pipHelp" class="pip-input-help">자패 1동 · 2남 · 3서 · 4북 · 5백 · 6발 · 7중</p>
          <details class="pip-compact"><summary>한 줄로 입력하기</summary><input id="pipQuickCompact" type="text" autocomplete="off" spellcheck="false" placeholder="123ㅁ 123ㅌ 123ㅅ 5567ㅈ" aria-label="한 줄 패 입력" aria-describedby="pipMessage"></details>
          <p id="pipMessage" class="pip-message" role="status"></p>
          <details class="pip-meld-entry pip-collapsible-entry"><summary class="pip-input-heading"><strong>옆으로 낸 패</strong><span id="pipMeldCount">0/4묶음</span></summary>
            <div class="pip-fields pip-secondary-fields">
              <label>만<input data-pip-meld="man" type="text" autocomplete="off" spellcheck="false" placeholder="123 555" aria-describedby="pipMeldHelp pipMeldError"></label>
              <label>통<input data-pip-meld="pin" type="text" autocomplete="off" spellcheck="false" placeholder="7777" aria-describedby="pipMeldHelp pipMeldError"></label>
              <label>삭<input data-pip-meld="sou" type="text" autocomplete="off" spellcheck="false" placeholder="123" aria-describedby="pipMeldHelp pipMeldError"></label>
              <label>자패<input data-pip-meld="honors" type="text" autocomplete="off" spellcheck="false" placeholder="555" aria-describedby="pipMeldHelp pipMeldError"></label>
            </div>
            <p id="pipMeldHelp" class="pip-input-help">묶음마다 공백 · 안깡:7777</p>
            <details class="pip-compact"><summary>한 줄로 입력하기</summary><input id="pipMeldInput" type="text" autocomplete="off" spellcheck="false" placeholder="123ㅅ 555ㅈ 7777ㅌ" aria-label="옆 패 한 줄 입력" aria-describedby="pipMeldError"></details>
            <p id="pipMeldError" class="pip-message" role="status"></p>
            <div id="pipMeldPreview" class="meld-preview" aria-label="입력한 옆 패 묶음"></div></details>
          <details class="pip-unavailable-entry pip-collapsible-entry"><summary class="pip-input-heading"><strong>0장 남은 패</strong><span id="pipUnavailableCount">0종</span></summary>
            <div class="pip-fields pip-secondary-fields">
              <label>만<input data-pip-unavailable="man" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="15" aria-describedby="pipUnavailableHelp pipUnavailableError"></label>
              <label>통<input data-pip-unavailable="pin" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="7" aria-describedby="pipUnavailableHelp pipUnavailableError"></label>
              <label>삭<input data-pip-unavailable="sou" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="39" aria-describedby="pipUnavailableHelp pipUnavailableError"></label>
              <label>자패<input data-pip-unavailable="honors" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="5" aria-describedby="pipUnavailableHelp pipUnavailableError"></label>
            </div>
            <p id="pipUnavailableHelp" class="pip-input-help">이미 손에 든 패는 사용 가능 · 추가로 필요한 예시만 제외</p>
            <details class="pip-compact"><summary>한 줄로 입력하기</summary><input id="pipUnavailableInput" type="text" autocomplete="off" spellcheck="false" placeholder="1ㅁ 7ㅌ 5ㅈ" aria-label="0장 패 한 줄 입력" aria-describedby="pipUnavailableError"></details>
            <p id="pipUnavailableError" class="pip-message" role="status"></p>
            <div id="pipUnavailablePreview" class="unavailable-preview" aria-label="0장 남은 패"></div></details>
          <div id="pipContext"></div>
          <p id="pipOpenedHint" class="pip-input-help"></p>
          <div class="pip-results-heading"><strong>가까운 완성형</strong><span id="pipResultCount">0개 후보</span></div>
          <p id="pipCaveat" class="pip-caveat">후보는 현재 성립한 역이 아닙니다. 핵심 패와 예시 전체를 구분해 보세요.</p>
          <section id="pipOpeningGuide" class="opening-guide" aria-label="첫 손패 분석"></section>
          <section id="pipResult" class="pip-result" aria-label="가까운 완성형 예시 전체"></section>
        </div>`;
        child.getElementById('backToMain').addEventListener('click', () => window.focus());
        const context = document.querySelector('.context').cloneNode(true);
        child.getElementById('pipContext').append(context);
        connectContextControls(context);
        const fields = [...child.querySelectorAll('[data-pip-quick]')];
        fields.forEach((field, index) => {
          field.addEventListener('input', event => { if (!event.isComposing) readPipFields(); });
          field.addEventListener('compositionend', readPipFields);
          field.addEventListener('keydown', event => {
            if (event.key !== 'Enter' || event.isComposing) return;
            event.preventDefault();
            if (fields[index + 1]) fields[index + 1].focus();
            else field.blur();
          });
        });
        const compact = child.getElementById('pipQuickCompact');
        compact.addEventListener('input', event => { if (!event.isComposing) readPipCompactInput(); });
        compact.addEventListener('compositionend', readPipCompactInput);
        compact.addEventListener('keydown', event => {
          if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); compact.blur(); }
        });
        const pipMeldInput = child.getElementById('pipMeldInput');
        pipMeldInput.addEventListener('input', event => { if (!event.isComposing) readMeldInput(pipMeldInput, true); });
        pipMeldInput.addEventListener('compositionend', () => readMeldInput(pipMeldInput, true));
        child.querySelectorAll('[data-pip-meld]').forEach(input => {
          input.addEventListener('input', event => { if (!event.isComposing) readMeldFields(child, true, input.dataset.pipMeld); });
          input.addEventListener('compositionend', () => readMeldFields(child, true, input.dataset.pipMeld));
        });
        const pipUnavailableInput = child.getElementById('pipUnavailableInput');
        pipUnavailableInput.addEventListener('input', event => { if (!event.isComposing) readUnavailableInput(pipUnavailableInput, true); });
        pipUnavailableInput.addEventListener('compositionend', () => readUnavailableInput(pipUnavailableInput, true));
        child.querySelectorAll('[data-pip-unavailable]').forEach(input => {
          input.addEventListener('input', event => { if (!event.isComposing) readUnavailableFields(child, true, input.dataset.pipUnavailable); });
          input.addEventListener('compositionend', () => readUnavailableFields(child, true, input.dataset.pipUnavailable));
        });
        openedWindow.addEventListener('pagehide', () => cleanup(openedWindow), { once: true });
        button.setAttribute('aria-pressed', 'true');
        button.textContent = '작은 창으로 이동';
        status.textContent = supported
          ? 'PiP 실행 중 · 작은 창에서 입력하면 이 페이지에도 반영됩니다.'
          : '일반 작은 창 실행 중 · 항상 위 고정은 지원하지 않습니다.';
        renderPip();
        fields[0].focus();
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
    const meldInput = el('meldInput');
    meldInput.addEventListener('input', event => { if (!event.isComposing) readMeldInput(meldInput); });
    meldInput.addEventListener('compositionend', () => readMeldInput(meldInput));
    document.querySelectorAll('[data-meld]').forEach(input => {
      input.addEventListener('input', event => { if (!event.isComposing) readMeldFields(document, false, input.dataset.meld); });
      input.addEventListener('compositionend', () => readMeldFields(document, false, input.dataset.meld));
    });
    const unavailableInput = el('unavailableInput');
    unavailableInput.addEventListener('input', event => { if (!event.isComposing) readUnavailableInput(unavailableInput); });
    unavailableInput.addEventListener('compositionend', () => readUnavailableInput(unavailableInput));
    document.querySelectorAll('[data-unavailable]').forEach(input => {
      input.addEventListener('input', event => { if (!event.isComposing) readUnavailableFields(document, false, input.dataset.unavailable); });
      input.addEventListener('compositionend', () => readUnavailableFields(document, false, input.dataset.unavailable));
    });
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
    el('clear').addEventListener('click', () => {
      hand = []; melds = []; unavailable = []; manualOpened = false;
      meldSyntaxError = ''; unavailableSyntaxError = ''; unavailablePending = false;
      render();
    });
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
