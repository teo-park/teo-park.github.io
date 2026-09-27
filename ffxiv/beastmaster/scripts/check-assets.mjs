import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const data = JSON.parse(await fs.readFile(new URL('data.json', root), 'utf8'));
const results = Array(data.beasts.length);
let cursor = 0;

await Promise.all(Array.from({length: 5}, async () => {
  while (cursor < data.beasts.length) {
    const index = cursor++;
    const beast = data.beasts[index];
    const response = await fetch(beast.icon.url, {method: 'HEAD', signal: AbortSignal.timeout(20000)});
    results[index] = {
      beastId: beast.id,
      iconId: beast.icon.id,
      url: beast.icon.url,
      status: response.status,
      contentType: response.headers.get('content-type')
    };
  }
}));

const available = results.filter(row => row.status === 200 && row.contentType?.startsWith('image/png'));
const status = {
  checkedAt: new Date().toISOString(),
  method: 'HEAD',
  sampleOnly: false,
  count: results.length,
  available: available.length,
  note: '50종의 XIVAPI 아이콘 URL을 확인했습니다. 응답 상태는 검사 시점의 결과이며 브라우저에서 이미지가 표시되는지는 네트워크 환경에 따라 달라질 수 있습니다.',
  samples: results
};
await fs.writeFile(new URL('asset-status.json', root), JSON.stringify(status, null, 2) + '\n');
console.log(`${available.length}/${results.length} beast icons available`);
