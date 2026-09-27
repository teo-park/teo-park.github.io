import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';

const root = new URL('../', import.meta.url);
const source = 'https://ffxivcollect.com/beasts';
const response = await fetch(source, {signal: AbortSignal.timeout(30000)});
if (!response.ok) throw Error(`FFXIV Collect: ${response.status}`);
const html = await response.text();
const document = new JSDOM(html).window.document;
const rows = [...document.querySelectorAll('tbody tr.collectable')].map(tr => {
  const cells = [...tr.querySelectorAll('td')];
  if (cells.length !== 7) throw Error('FFXIV Collect source layout changed');
  const beastId = Number(tr.querySelector('a[href^="/beasts/"]')?.getAttribute('href').split('/').pop());
  const targets = [], places = [], sourceEntries = [];
  for (const entry of cells[3].querySelectorAll('.source')) {
    const kind = [...entry.classList].find(name => name.startsWith('source-'))?.slice(7);
    const text = entry.textContent.trim();
    sourceEntries.push({kind, text});
    // Quest and gourd acquisition come from the Korean game tables. A treasure
    // map has no fixed region, so retain its raw source without inventing a pin.
    if (kind === 'quest' || kind === 'treasure-hunt' || !text.startsWith('Lv ')) continue;
    const split = text.indexOf(' - ');
    if (split < 0) throw Error(`Unrecognized capture route for No.${beastId}: ${text}`);
    let target = text.slice(0, split).replace(/^Lv (\d+) - /, 'Lv $1 ');
    let place = text.slice(split + 3);
    if (beastId === 37 && place === "Myrmidon Princess - Cutter's Cry") place = "Cutter's Cry";
    if (beastId === 44 && target === 'Lv 50') {
      const extra = place.indexOf(' - ');
      target += ` ${place.slice(0, extra)}`;
      place = place.slice(extra + 3);
    }
    targets.push(target.trim());
    places.push(place.trim().replace(/^([ABS])-Rank Hunt - /, '$1 Rank Hunt - '));
  }
  return {beastId, targets, places, sourceEntries};
});
if (rows.length !== 50 || new Set(rows.map(row => row.beastId)).size !== 50 ||
  rows.some(row => !row.beastId || row.targets.length !== row.places.length)) {
  throw Error('Unexpected beast capture report count');
}
const report = {
  source,
  observedAt: new Date().toISOString().slice(0, 10),
  sourceSha256: createHash('sha256').update(html).digest('hex'),
  note: 'FFXIV Collect의 공개 포획 제보. 원문 출처 종류와 문구를 sourceEntries에 보존합니다. 상점·퀘스트는 한국어 게임 데이터에서 연결하고, 지역을 특정할 수 없는 보물지도 제보에는 지도 핀을 만들지 않습니다.',
  rows
};
await fs.writeFile(new URL('capture-reports.json', root), JSON.stringify(report, null, 2) + '\n');
console.log(`${rows.length} beasts, ${rows.reduce((n, row) => n + row.targets.length, 0)} capture source lines`);
