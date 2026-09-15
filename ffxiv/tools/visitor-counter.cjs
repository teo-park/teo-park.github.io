const fs = require('node:fs');
const path = require('node:path');
const { categories, journalPages } = require('./site-navigation.cjs');
const selectionCatalog = require('./selection-catalog.cjs').build();
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
  const owner = "auth != null && auth.token.email === 'teo.ffxiv.kr@gmail.com' && auth.token.email_verified === true && auth.token.firebase.sign_in_provider === 'google.com'";
  const rules = { rules: { '.read': false, '.write': false, counters: { '.read': owner }, visits: { '.read': owner }, selections: { '.read': owner } } };
  for (const [kind, group] of Object.entries(selectionCatalog.groups)) {
    // Keep each automaton small enough for Firebase's rule compiler.
    const ids=Object.keys(group.names).sort(),checks=[];
    for(let i=0;i<ids.length;i+=32)checks.push(`$gameId.matches(/^(${ids.slice(i,i+32).join('|')})$/)`);
    rules.rules.selections[kind]={'$gameId':{'$eventId':{
      '.write':`!data.exists() && newData.val() === true && $eventId.matches(/^[a-f0-9]{32}$/) && (${checks.join(' || ')})`,
      '.validate':'newData.getPriority() === null',
    }}};
  }
  for (const { key } of pages) {
    rules.rules.visits[key] = { '$eventId': {
      '.write': "!data.exists() && newData.val() === true && $eventId.matches(/^[a-f0-9]{32}$/)",
      '.validate': 'newData.getPriority() === null',
    } };
  }
  return { config, rules };
}
if (require.main === module) {
  const existing = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
  const { config, rules } = build(process.argv[2] || existing.databaseUrl || '');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
  fs.writeFileSync(path.join(root,'selection-catalog.json'),JSON.stringify(selectionCatalog)+'\n');
  const directory = path.join(root, '..', 'services', 'visitor-counter');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'database.rules.json'), JSON.stringify(rules, null, 2) + '\n');
  console.log(`Generated ${pages.length} page counters and restricted database rules.`);
}
module.exports = { build };
