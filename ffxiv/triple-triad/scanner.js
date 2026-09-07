/* Browser-local recognition of the game's 5 × 6 collection grid.
   The reference is only the empty slot's luminance signature, not a collection. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TriadScanner = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const SIZE = 20;
  const REFERENCE = [35,38,41,46,53,63,80,114,121,45,43,66,148,133,103,80,64,54,48,44,37,40,46,55,64,79,106,151,82,47,50,51,58,112,150,120,92,71,55,47,39,44,54,65,77,99,136,152,50,56,60,60,57,53,85,147,135,101,73,54,41,51,63,76,93,122,163,69,55,62,66,68,66,62,55,49,126,143,101,68,46,58,72,88,111,147,162,54,54,55,56,58,61,65,63,56,48,73,126,85,52,65,80,100,130,170,86,48,71,132,157,149,99,59,65,61,52,44,110,98,56,71,89,113,151,151,50,48,161,218,192,218,216,76,62,63,54,45,124,102,61,77,98,130,174,97,56,54,72,76,54,112,230,117,59,63,53,78,149,97,64,82,109,148,160,54,61,66,65,60,60,153,225,92,59,60,53,151,135,90,66,86,121,166,83,56,65,72,71,65,150,223,162,60,61,57,73,164,119,84,68,94,136,173,55,61,69,74,68,86,226,153,60,61,60,52,163,148,107,79,68,102,153,80,54,63,70,75,66,79,183,89,57,65,57,88,175,131,97,76,69,109,132,45,56,65,71,76,66,78,161,89,57,62,52,144,154,115,89,71,67,109,107,45,54,64,70,74,65,95,211,112,55,57,80,176,133,101,80,65,61,98,119,44,50,58,66,71,68,61,67,57,56,53,152,151,113,89,73,58,54,79,120,132,71,52,59,65,68,67,63,60,55,66,164,127,97,79,65,51,48,63,87,121,158,105,55,56,61,63,63,57,52,152,141,103,81,67,56,45,45,50,63,83,110,143,158,57,52,54,54,50,75,158,113,84,68,57,47,40,42,46,51,61,76,96,124,148,104,45,45,43,120,123,87,67,56,48,42,39,39,42,46,50,56,66,81,104,133,121,67,83,123,88,65,54,47,42,39,36];
  const mean = values => values.reduce((sum, n) => sum + n, 0) / values.length;
  function referenceFor(values) {
    const average = mean(values), centered = values.map(n => n - average);
    return {centered, norm: Math.sqrt(centered.reduce((sum, n) => sum + n * n, 0)), core: values.length===SIZE*SIZE ? referenceFor(coreValues(values)) : null};
  }
  function coreValues(values) { return values.filter((_,i)=>i%SIZE>=4&&i%SIZE<16&&Math.floor(i/SIZE)>=4&&Math.floor(i/SIZE)<16); }
  const builtin = referenceFor(REFERENCE);
  function luminance(image, x, y) {
    x = Math.max(0, Math.min(image.width - 1, x)); y = Math.max(0, Math.min(image.height - 1, y));
    const x0 = Math.floor(x), y0 = Math.floor(y), x1 = Math.min(x0 + 1, image.width - 1), y1 = Math.min(y0 + 1, image.height - 1);
    const dx = x - x0, dy = y - y0;
    const gray = (px, py) => { const i = (py * image.width + px) * 4; return image.data[i] * .299 + image.data[i + 1] * .587 + image.data[i + 2] * .114; };
    return gray(x0, y0) * (1 - dx) * (1 - dy) + gray(x1, y0) * dx * (1 - dy) + gray(x0, y1) * (1 - dx) * dy + gray(x1, y1) * dx * dy;
  }
  function descriptor(image, cx, cy, width, height, angle = 0, size = SIZE) {
    const values = [];
    const cos = Math.cos(angle * Math.PI / 180), sin = Math.sin(angle * Math.PI / 180);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const px = ((x + .5) / size - .5) * width, py = ((y + .5) / size - .5) * height;
      values.push(luminance(image, cx + px * cos - py * sin, cy + px * sin + py * cos));
    }
    return values;
  }
  function compare(values, reference = builtin) {
    const average = mean(values); let variance = 0, dot = 0;
    for (let i = 0; i < values.length; i++) { const n = values[i] - average; variance += n * n; dot += n * reference.centered[i]; }
    const norm = Math.sqrt(variance);
    return {score: norm > 0 && reference.norm > 0 ? dot / (norm * reference.norm) : 0, texture: norm / Math.sqrt(values.length)};
  }
  function match(values,reference) {
    const full=compare(values,reference),core=compare(coreValues(values),reference.core);
    // The selected card's glowing border must not hide the central question mark.
    if(core.texture>=12&&core.score*.94>=.82)full.score=Math.max(full.score,core.score*.94);
    return full;
  }
  function classifyCell(image, cx, cy, width, height, reference = builtin) {
    let best = {score: -1, texture: 0}, fit;
    for (const scale of [.58, .66, .74, .82]) for (const dx of [-.18, -.12, -.06, 0, .06, .12, .18]) for (const dy of [-.12, -.06, 0, .06, .12]) {
      const result = match(descriptor(image, cx + dx * width, cy + dy * height, width * scale, height * scale),reference);
      if (result.score > best.score) { best = result; fit = {cx: cx + dx * width, cy: cy + dy * height, scale}; }
    }
    if (best.score >= .4 && best.score < .97) {
      for (const angle of [-12, -6, 0, 6, 12]) for (const dx of [-.035, 0, .035]) for (const dy of [-.035, 0, .035]) {
        const candidate = match(descriptor(image, fit.cx + dx * width, fit.cy + dy * height, width * fit.scale, height * fit.scale, angle),reference);
        if (candidate.score > best.score) best = candidate;
      }
    }
    const state = best.texture < 12 ? 'uncertain' : best.score >= .82 ? 'missing' : best.score < .55 ? 'owned' : 'uncertain';
    return {state, score: best.score, texture: best.texture};
  }
  function makeReference(image, rect, index) {
    const error=validateRect(rect,image.width,image.height);if(error)throw Error(error);
    if(!Number.isInteger(index)||index<0||index>=30)throw Error('물음표 칸을 선택해 주세요.');
    const w=rect.w*image.width/5,h=rect.h*image.height/6;
    const values=descriptor(image,(rect.x+(index%5+.5)*rect.w/5)*image.width,(rect.y+(Math.floor(index/5)+.5)*rect.h/6)*image.height,w*.74,h*.74);
    const reference=referenceFor(values);
    if(reference.norm/SIZE<12)throw Error('무늬가 없는 칸이에요. 물음표가 보이는 미수집 칸을 선택해 주세요.');
    return reference;
  }
  function validateRect(rect, width, height) {
    if (!rect || ![rect.x, rect.y, rect.w, rect.h].every(Number.isFinite) || rect.x < 0 || rect.y < 0 || rect.w <= 0 || rect.h <= 0 || rect.x + rect.w > 1.001 || rect.y + rect.h > 1.001) return '카드 영역이 이미지 안에 들어오도록 지정해 주세요.';
    const cellWidth = rect.w * width / 5, cellHeight = rect.h * height / 6;
    if (cellWidth < 20 || cellHeight < 20) return '카드 그림이 너무 작아요. 더 큰 원본 캡처를 사용해 주세요.';
    if (cellWidth / cellHeight < .7 || cellWidth / cellHeight > 1.35) return '5열×6행의 카드 칸만 들어오도록 영역을 지정해 주세요. 위쪽 페이지 번호와 아래쪽 합계는 제외해요.';
    return '';
  }
  function analyze(image, rect, count = 30, reference = null) {
    if (!Number.isInteger(count) || count < 1 || count > 30) throw Error('페이지의 카드 수가 올바르지 않아요.');
    if (!image || image.data?.length !== image.width * image.height * 4) throw Error('이미지 픽셀을 읽을 수 없어요.');
    const error = validateRect(rect, image.width, image.height); if (error) throw Error(error);
    const w = rect.w * image.width / 5, h = rect.h * image.height / 6;
    return Array.from({length: count}, (_, index) => {
      const cx=rect.x*image.width+(index%5+.5)*w,cy=rect.y*image.height+(Math.floor(index/5)+.5)*h;
      let result=classifyCell(image,cx,cy,w,h);
      if(reference){const adapted=classifyCell(image,cx,cy,w,h,reference);if(adapted.score>result.score)result=adapted;}
      return {index,...result};
    });
  }
  function pagesFor(cards) {
    const pages = [];
    for (const ex of [false, true]) {
      const group = cards.filter(c => c.ex === ex).sort((a, b) => a.order - b.order);
      const max = Math.max(0, ...group.map(c => c.order));
      for (let n = 1; n <= Math.ceil(max / 30); n++) {
        const part = group.filter(c => c.order > (n - 1) * 30 && c.order <= n * 30);
        if (part.length) pages.push({key: `${ex ? 'ex' : 'normal'}:${n}`, label: `${ex ? 'EX' : '일반'} ${n}페이지 · ${ex ? 'EX' : 'No.'} ${part[0].order}–${part.at(-1).order}`, cards: part});
      }
    }
    return pages;
  }
  function prepareImport(entries, pages) {
    if (!entries.length) throw Error('인식할 캡처를 먼저 선택해 주세요.');
    const usedPages = new Set(), seenIds = new Set(), ownedIds = new Set();
    for (const entry of entries) {
      const page = pages.find(p => p.key === entry.pageKey);
      if (!page) throw Error('모든 캡처의 게임 페이지 번호를 선택해 주세요.');
      if (usedPages.has(page.key)) throw Error(`${page.label} 페이지가 두 번 지정되어 있어요. 캡처별 페이지 번호를 확인해 주세요.`);
      usedPages.add(page.key);
      if (!entry.results || entry.results.length !== page.cards.length || entry.results.some(r => !['owned', 'missing'].includes(r.state))) throw Error('확인 필요 칸을 모두 보유 또는 미수집으로 지정해 주세요.');
      if (!entry.reviewed) throw Error('각 캡처의 페이지 번호와 칸을 확인한 뒤 확인 체크박스를 눌러 주세요.');
      page.cards.forEach((card, index) => { seenIds.add(card.id); if (entry.results[index].state === 'owned') ownedIds.add(card.id); });
    }
    return {seenIds: [...seenIds], ownedIds: [...ownedIds]};
  }
  return {SIZE, descriptor, compare, classifyCell, validateRect, analyze, pagesFor, prepareImport, makeReference};
});
