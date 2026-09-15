const fs = require('node:fs');
const path = require('node:path');
const { categories, journalPages } = require('./site-navigation.cjs');
const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'visitor-counter-config.json');
const keyFor = route => route.replace(/\/$/, '').replaceAll('/', '__') || 'home';
const entries = [['', '도구함 홈'], ...categories.flatMap(c => c.tools), ...journalPages, ['ocean-fishing/sources/', '먼바다 출처 안내']];
const pages = entries.map(([route, label]) => ({ key: keyFor(route), path: '/ffxiv/' + route, label }));
function build(databaseUrl) {
  const config = {
    databaseUrl,
    origins: ['https://teo-park.github.io'],
    intervalMs: 30 * 60 * 1000,
    pages,
    aliases: { '/ffxiv/ocean-fishing/indigo/': '/ffxiv/ocean-fishing/', '/ffxiv/ocean-fishing/ruby/': '/ffxiv/ocean-fishing/' },
  };
  const rules = { rules: { '.read': false, '.write': false, counters: { '.read': true } } };
  for (const { key } of pages) {
    rules.rules.counters[key] = {
      '.write': 'newData.isNumber() && ((!data.exists() && newData.val() === 1) || (data.isNumber() && newData.val() === data.val() + 1))',
      '.validate': 'newData.val() <= 9007199254740991 && newData.getPriority() === null',
    };
  }
  return { config, rules };
}
if (require.main === module) {
  const existing = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
  const { config, rules } = build(process.argv[2] || existing.databaseUrl || '');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
  const directory = path.join(root, '..', 'services', 'visitor-counter');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'database.rules.json'), JSON.stringify(rules, null, 2) + '\n');
  console.log(`Generated ${pages.length} page counters and restricted database rules.`);
}
module.exports = { build };
