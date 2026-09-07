const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const S = require('../scanner.js');
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../data.js'), 'utf8'), context);
const cards = context.window.TRIPLE_TRIAD_DATA.cards;
const pages = S.pagesFor(cards);
const entry = (page, states) => ({pageKey: page.key, reviewed: true, results: page.cards.map((_, i) => ({state: states?.[i] || 'missing'}))});

test('game pages separate normal and EX numbers and cover each stable ID exactly once', () => {
  assert.equal(pages.length, 17);
  assert.equal(pages[15].key, 'normal:16');
  assert.equal(pages[15].cards.length, 10);
  assert.equal(pages[16].key, 'ex:1');
  assert.equal(pages[16].cards.length, 15);
  const all = pages.flatMap(p => Array.from(p.cards, c => c.id));
  assert.equal(new Set(all).size, cards.length);
  for (const page of pages) page.cards.forEach((card, i) => assert.equal(card.order, (Number(page.key.split(':')[1]) - 1) * 30 + i + 1));
  const ex = pages[16];
  const prepared = S.prepareImport([entry(ex, ['owned'])], pages);
  assert.deepEqual(prepared.ownedIds, [ex.cards[0].id]);
  assert.notEqual(ex.cards[0].id, ex.cards[0].order);
});

test('reviewed page positions map to owned IDs without counting missing slots', () => {
  const missing = new Set([2, 4, 6, 10, 13, 18, 20, 24, 27]);
  const states = Array.from({length: 30}, (_, i) => missing.has(i + 1) ? 'missing' : 'owned');
  const result = S.prepareImport([entry(pages[0], states)], pages);
  assert.equal(result.seenIds.length, 30);
  assert.equal(result.ownedIds.length, 21);
  assert.deepEqual(result.seenIds.filter(id => !result.ownedIds.includes(id)), [...missing]);
});

test('imports reject unreviewed, uncertain, incomplete and duplicate pages atomically', () => {
  const valid = entry(pages[0]);
  assert.throws(() => S.prepareImport([], pages));
  assert.throws(() => S.prepareImport([{...valid, pageKey: 'unknown'}], pages), /페이지 번호/);
  assert.throws(() => S.prepareImport([valid, valid], pages), /두 번/);
  assert.throws(() => S.prepareImport([{...valid, reviewed: false}], pages), /체크박스/);
  assert.throws(() => S.prepareImport([entry(pages[0], ['uncertain'])], pages), /확인 필요/);
  assert.throws(() => S.prepareImport([{...valid, results: valid.results.slice(1)}], pages), /확인 필요/);
});

test('blank and unreadable cells need review; unused final-page positions are not imported', () => {
  const image = {width: 200, height: 240, data: new Uint8ClampedArray(200 * 240 * 4).fill(127)};
  const rect = {x: 0, y: 0, w: 1, h: 1};
  assert.equal(S.analyze(image, rect).filter(r => r.state === 'uncertain').length, 30);
  assert.equal(S.analyze(image, rect, 10).length, 10);
  assert.throws(() => S.analyze(image, rect, 31));
  assert.throws(() => S.analyze({...image, data: []}, rect), /픽셀/);
  assert.throws(() => S.analyze(image, {...rect, x: .8}), /이미지 안/);
  assert.ok(S.validateRect({x: 0, y: 0, w: .2, h: .2}, 200, 240));
  assert.ok(S.validateRect({x: 0, y: 0, w: 1, h: .5}, 200, 240));
});

test('a calibrated question mark survives an offset and a bright selection border without marking artwork missing', () => {
  const width=200,height=240,data=new Uint8ClampedArray(width*height*4);
  let seed=12345;
  for(let i=0;i<data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;data[i]=seed&255;data[i+1]=(seed>>>8)&255;data[i+2]=(seed>>>16)&255;data[i+3]=255;}
  const image={width,height,data},rect={x:0,y:0,w:1,h:1};
  function question(index,shift,highlight){
    const x0=index%5*40,y0=Math.floor(index/5)*40;
    const paint=(x,y,v)=>{const i=((y0+y)*width+x0+x)*4;data[i]=data[i+1]=data[i+2]=v;};
    for(let y=0;y<40;y++)for(let x=0;x<40;x++)paint(x,y,highlight&&(x<5||x>34||y<5||y>34)?240:45);
    const glyph=['01110','10001','00010','00100','00100','00000','00100'];
    glyph.forEach((row,y)=>[...row].forEach((pixel,x)=>{if(pixel==='1')for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++)paint(12+x*3+dx+shift,9+y*3+dy,220);}));
  }
  question(0,0,false);question(11,4,true);
  const reference=S.makeReference(image,rect,0);
  const results=S.analyze(image,rect,30,reference);
  assert.deepEqual(results.filter(r=>r.state==='missing').map(r=>r.index),[0,11]);
  assert.equal(results.filter(r=>r.state==='owned').length,28);
});
