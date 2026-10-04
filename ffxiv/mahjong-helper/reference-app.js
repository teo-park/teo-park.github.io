(function () {
  const R = window.MahjongReference;
  const H = window.MahjongHelper;
  const get = id => document.getElementById(id);
  const tabs = [get('handTab'), get('referenceTab')];
  const labels = [...Array.from({length:9},(_,i)=>`${i+1}n`), ...Array.from({length:9},(_,i)=>`${i+1}p`), ...Array.from({length:9},(_,i)=>`${i+1}b`), 'ew','sw','ww','nw','wd','gd','rd'];
  const node = (tag, text, className = '') => {
    const el = document.createElement(tag); el.textContent = text; el.className = className; return el;
  };
  function selectTab(index, focus = false) {
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    get('handPanel').hidden = index !== 0; get('referencePanel').hidden = index !== 1;
    get('pipStatus').hidden = index !== 0;
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      selectTab(index); history.replaceState(null, '', index ? '#all-yaku' : location.pathname + location.search);
    });
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
      tabs[next].click(); tabs[next].focus();
    });
  });
  function card(entry) {
    const article = node('article', '', 'reference-card'); article.dataset.yaku = entry.id;
    const head = node('div', '', 'reference-card-head');
    head.append(node('h3', entry.aliases.length ? `${entry.name} (${entry.aliases[0]})` : entry.name), node('span', entry.han, 'reference-han'));
    const badges = node('div', '', 'reference-badges');
    const status = node('span', entry.closed ? '멘젠 필수' : '울기 가능', entry.closed ? 'menzen-tag' : 'reference-open');
    status.title = entry.closed ? '치·퐁·명깡을 하지 않은 상태가 필요합니다. 일반적으로 안깡은 멘젠을 유지하지만 첫 순·일발 등 상황 조건은 별도로 확인하세요.' : '울어도 조건을 충족하면 성립합니다. 탕야오는 쿠이탕 설정을 확인하세요.';
    if (entry.bonus) { status.textContent = entry.closed ? '리치 필요' : '설정 확인'; }
    badges.append(status, node('span', entry.category, 'reference-category'));
    article.append(head, badges, node('p', entry.description, 'reference-description'));
    article.append(node('p', entry.id === 'nagashi' ? '버림패 예시' : '예시 조합', 'detail-label'));
    const example = node('div', '', 'reference-example');
    entry.groups.forEach((spec, groupIndex) => {
      const tiles = R.parseGroup(spec), group = node('div', '', 'reference-group');
      group.setAttribute('role', 'img'); group.setAttribute('aria-label', tiles.map(H.name).join(' · '));
      if (entry.focus.includes(groupIndex)) group.classList.add('reference-focus');
      tiles.forEach(tile => {
        const img = document.createElement('img'); img.src = `overlay/templates/${labels[tile]}.png`;
        img.alt = ''; img.loading = 'lazy'; img.width = 24; img.height = 38; group.append(img);
      });
      example.append(group);
    });
    article.append(example, node('p', entry.note, 'reference-example-note'));
    return article;
  }
  function render() {
    const query = get('referenceSearch').value.trim().toLocaleLowerCase();
    const category = get('referenceCategory').value;
    const filtered = R.entries.filter(entry =>
      (category === 'all' || entry.category === category) && (!get('referenceClosed').checked || entry.closed) &&
      `${entry.name} ${entry.aliases.join(' ')} ${entry.description} ${entry.note} ${entry.han} ${entry.closed ? '멘젠' : '울기'}`.toLocaleLowerCase().includes(query));
    get('referenceCards').replaceChildren(...filtered.map(card));
    if (!filtered.length) get('referenceCards').append(node('p', '검색 결과가 없습니다. 다른 이름이나 조건으로 찾아보세요.', 'reference-empty'));
    get('referenceCount').textContent = `${filtered.length}개 항목 · 전체 ${R.entries.filter(entry=>!entry.bonus).length}역 + 보너스 3종`;
  }
  get('referenceSearch').addEventListener('input', render);
  get('referenceCategory').addEventListener('change', render);
  get('referenceClosed').addEventListener('change', render);
  window.addEventListener('hashchange', () => selectTab(location.hash === '#all-yaku' ? 1 : 0));
  selectTab(location.hash === '#all-yaku' ? 1 : 0); render();
})();
