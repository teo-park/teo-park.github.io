const fs = require('node:fs');
const path = require('node:path');

const version = '20260909-nav1';
const categories = [
  { id: 'general', label: '진행·검색', tools: [
    ['msq-tracker/', '메인 퀘스트 진행률'],
    ['pvp-series-calculator/', 'PvP 시리즈 계산기'],
    ['duty-finder/', '임무 초성 사전'],
  ] },
  { id: 'collection', label: '수집·육성', tools: [
    ['triple-triad/', '트리플 트라이어드 수첩'],
    ['minions/', '꼬마친구 수첩'],
    ['blue-mage/', '청마도사 스킬 수첩'],
    ['weapons/', '무기 수첩'],
    ['beastmaster/', '마수도감'],
  ] },
  { id: 'fishing', label: '낚시', tools: [
    ['fisher-skills/', '어부 스킬 안내'],
    ['fishing-log/', '세계를 누비는 어부'],
    ['ocean-fishing/', '항해일지'],
  ] },
];
const journalPages = [
  ['ocean-fishing/indigo/', '근해 수첩'],
  ['ocean-fishing/ruby/', '원양 수첩'],
  ['ocean-fishing/checklist/', '물고기 도감'],
];
const pages = ['', ...categories.flatMap(c => c.tools.map(([url]) => url)), ...journalPages.map(([url]) => url), 'ocean-fishing/sources/'];
const baseFor = page => page ? '../'.repeat(page.split('/').filter(Boolean).length) : './';
function assets(page) {
  const base = baseFor(page);
  return `<link rel="stylesheet" href="${base}navigation.css?v=${version}"><script defer src="${base}navigation.js?v=${version}"></script><link rel="stylesheet" href="${base}select-options.css?v=20260910-radios4"><script defer src="${base}select-options.js?v=20260910-radios1"></script>`;
}
function header(page) {
  const base = baseFor(page);
  const link = ([url, label], nested = false) => `<li><a href="${base}${url}"${nested ? ' class="nav-subpage"' : ''}${page === url ? ' aria-current="page"' : ''}>${label}${page === url ? '<span class="nav-current-label">현재</span>' : ''}</a></li>`;
  const groups = categories.map(category => {
    const active = category.tools.some(([url]) => page.startsWith(url));
    return `<details class="nav-category"${active ? ' data-current-category' : ''}><summary aria-controls="nav-${category.id}">${category.label}<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m4 6 4 4 4-4"/></svg></summary><div class="nav-dropdown" id="nav-${category.id}"><ul>${category.tools.map(tool => link(tool) + (tool[0] === 'ocean-fishing/' ? `<li class="nav-journal-pages"><ul aria-label="항해일지 페이지">${journalPages.map(tool => link(tool, true)).join('')}</ul></li>` : '')).join('')}</ul></div></details>`;
  }).join('');
  return `<header class="site-header" data-navigation><a class="brand" href="${base}"${page === '' ? ' aria-current="page"' : ''}><img class="brand-emblem" src="${base}favicon.svg" alt="">파판14 도구함</a><nav class="site-nav" aria-label="도구 카테고리">${groups}</nav><span class="header-note">FFXIV · KR</span></header>`;
}
function update() {
  const root = path.resolve(__dirname, '..');
  for (const page of pages) {
    const file = path.join(root, page, 'index.html');
    let html = fs.readFileSync(file, 'utf8');
    if (!/<header class="site-header"/.test(html)) throw Error(`Missing header: ${file}`);
    html = html.replace(/<header class="site-header"[^>]*>[\s\S]*?<\/header>/, header(page));
    html = html.replace(/<link\b[^>]*href="[^"\s]*(?:navigation|select-options)\.css[^"\s]*"[^>]*>\s*/g, '')
      .replace(/<script\b[^>]*src="[^"\s]*(?:navigation|select-options)\.js[^"\s]*"[^>]*><\/script>\s*/g, '');
    html = html.replace('</head>', `${assets(page)}</head>`);
    fs.writeFileSync(file, html);
  }
  console.log(`Updated navigation on ${pages.length} pages.`);
}
if (require.main === module) update();
module.exports = { categories, journalPages, pages, header, assets, update };
