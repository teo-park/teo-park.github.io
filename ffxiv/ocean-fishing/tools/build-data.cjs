// Convert retained community measurements into non-executable, structured records.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const collection = require('../scripts/collection.js');
const ids = require('../scripts/teamcraft-ids.js');
function parseCSV(text) {
  const records = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { field += '"'; i++; } else quoted = !quoted; }
    else if (!quoted && (c === ',' || c === '\n')) { row.push(field.replace(/\r$/, '')); field = ''; if (c === '\n') { records.push(row); row = []; } }
    else field += c;
  }
  if (field || row.length) { row.push(field.replace(/\r$/, '')); records.push(row); }
  const header = records.shift();
  return records.filter(r => r.length > 1).map(r => Object.fromEntries(header.map((name, i) => [name, r[i] || ''])));
}
const itemIds = new Map(Object.entries(ids).flatMap(([id, entries]) => entries.map(e => [e.route + ':' + collection.key(e.name), Number(id)])));
const stops = { Galadion:'갈라디온 만', Southern:'멜토르 해협 남쪽', Northern:'멜토르 해협 북쪽', Rhotano:'로타노 해', Cieldalaes:'시엘달레 제도', Bloodbrine:'붉은물결 바다', Rothlyt:'로들리트 만', Sirensong:'세이렌 해', Kugane:'쿠가네', 'Ruby Sea':'홍옥해', 'One River':'무이강', Unnamed:'이름 없는 섬', Thavnair:'사베니어 섬' };
const baitLabels = {Ragworm:'바위털갯지렁이',Krill:'크릴',PlumpWorm:'굵은지렁이',VersatileLure:'만능 루어'};
function normalize(row, route, index) {
  const name = collection.name(row.Fish), sourceIntuition = row.Intuition;
  const intuitionFish = [...sourceIntuition.matchAll(/(?:x\s*(\d+)\s*)?<img[^>]+src=["'][^"']*\/fish\/([^"']+)\.png["'][^>]*>/gi)].map(match => ({name:decodeURIComponent(match[2]).replaceAll('_', "'"), count:Number(match[1]) || 1}));
  const seconds = Number(sourceIntuition.match(/\((\d+)s\)/)?.[1]) || null;
  const baits = ['Ragworm','Krill','PlumpWorm','VersatileLure','Special','Mooch'].flatMap(kind => {
    const time = row['Bait' + kind]; if (!time) return [];
    const name = kind === 'Special' || kind === 'Mooch' ? collection.name(row['Bait' + kind + 'Type']) : kind;
    return [{kind, name, label:row['Bait' + kind + 'TypeTranslated'] || baitLabels[kind] || name, time}];
  });
  const weather = ['FairSkies','Clouds','Fog','ClearSkies','Special1','Special2','Special3'].flatMap(kind => {
    const flag = row['Weather' + kind]; if (!flag) return [];
    return [{name:row['Weather' + kind + 'TypeTranslated'] || {FairSkies:'맑음',Clouds:'흐림',Fog:'안개',ClearSkies:'쾌청'}[kind] || kind, available:flag === 'Yes'}];
  });
  const record = {...row, Fish:name, StopTranslated:stops[row.Stop] || row.StopTranslated,
    id:itemIds.get(route + ':' + collection.key(name)), route, entryId:route + '-' + index,
    spectral:!!row.TimeFrameDay, legendary:/(?:^|!)F!/.test(row.Fish),
    Dependencies:collection.dependencies(row), intuition:{seconds, fish:intuitionFish}, baits, weather,
    Intuition:intuitionFish.length ? intuitionFish.map(f => `${f.name} × ${f.count}`).join(' + ') : '',
    image:'img/fish/' + name.replaceAll("'", '_') + '.png'};
  if (!record.id) throw Error('Missing item ID: ' + name);
  if (!fs.existsSync(path.join(root, record.image))) {
    record.image = 'img/fish/' + name + '.png';
    if (!fs.existsSync(path.join(root, record.image))) throw Error('Missing image: ' + name);
  }
  for (const [key, value] of Object.entries(record)) if (typeof value === 'string' && /<[^>]+>/.test(value)) throw Error('Unconverted markup: ' + name + '/' + key);
  return record;
}
if (require.main === module) {
  fs.mkdirSync(path.join(root, 'data'), {recursive:true});
  const fish = ['indigo','ruby'].flatMap(route => parseCSV(fs.readFileSync(path.join(root, `fishdata/${route}-KO.csv`), 'utf8')).map((r, i) => normalize(r, route, i)));
  fs.writeFileSync(path.join(root, 'data/fish.json'), JSON.stringify({version:1,sourceDate:'2026-09-07',fish}, null, 2) + '\n');
  console.log(`Structured data: ${fish.length} entries, ${new Set(fish.map(f => f.id)).size} item IDs. No executable markup.`);
}
module.exports = {parseCSV, normalize};
