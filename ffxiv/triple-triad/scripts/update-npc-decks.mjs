// NPC card IDs from the same pinned game sheets as the local card catalog.
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {parseCsv} from './update-data.mjs';

const root = new URL('../', import.meta.url);
export function deckRows(text) {
  // Korean Saint Coinach exports have a key row and a type row around the header.
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  const start = lines.findIndex(line => line.startsWith('#,'));
  if (start < 0) throw Error('Missing TripleTriad header');
  const rows = parseCsv(lines.slice(start).join('\n'));
  return new Map(rows.filter(row => /^\d+$/.test(row['#'])).map(row => [Number(row['#']), Object.fromEntries(Object.entries(row).map(([key, value]) => [key.replace(/[{}]/g, ''), value]))]));
}

export function buildNpcDecks(catalog, korean, global) {
  const sheets = [deckRows(korean), deckRows(global)];
  const cards = new Set(catalog.cards.map(card => card.id));
  const npcs = new Map(catalog.cards.flatMap(card => card.sources.filter(source => source.npc).map(source => [source.npc.id, source.npc])));
  return [...npcs.values()].sort((a, b) => a.id - b.id).map(npc => {
    const decks = sheets.map(sheet => {
      const row = sheet.get(npc.id);
      if (!row) throw Error('Missing NPC row: ' + npc.id);
      const ids = prefix => Array.from({length: 5}, (_, i) => Number(row[`${prefix}[${i}]`])).filter(id => id !== 0);
      return {fixed: ids('TripleTriadCardFixed'), variable: ids('TripleTriadCardVariable'), ruleIds: [...new Set([0, 1].map(i => Number(row[`TripleTriadRule[${i}]`])).filter(Boolean))], regionalRules: row.UsesRegionalRules === 'True'};
    });
    if (JSON.stringify(decks[0]) !== JSON.stringify(decks[1])) throw Error('Korean/global NPC mismatch: ' + npc.id);
    const deck = decks[0], ids = [...deck.fixed, ...deck.variable];
    if (deck.fixed.length > 5 || ids.length < 5 || new Set(ids).size !== ids.length || ids.some(id => !cards.has(id))) throw Error('Invalid NPC card pool: ' + npc.id);
    if (JSON.stringify([...deck.ruleIds].sort()) !== JSON.stringify([...npc.ruleIds].sort())) throw Error('NPC rule mismatch: ' + npc.id);
    return {id: npc.id, ...deck};
  });
}

export async function updateNpcDecks() {
  const text = await fs.readFile(new URL('data.js', root), 'utf8');
  const catalog = JSON.parse(text.slice(text.indexOf('=') + 1).trim().replace(/;$/, ''));
  const source = {
    korean: catalog.source.korean.replace('https://github.com/', 'https://raw.githubusercontent.com/').replace('/tree/', '/') + '/csv/TripleTriad.csv',
    global: catalog.source.global.replace('https://github.com/', 'https://raw.githubusercontent.com/').replace('/tree/', '/') + '/csv/en/TripleTriad.csv'
  };
  const sheets = await Promise.all(Object.values(source).map(async url => {
    const response = await fetch(url, {signal: AbortSignal.timeout(30000)});
    if (!response.ok) throw Error(`${response.status}: ${url}`);
    return response.text();
  }));
  const npcs = buildNpcDecks(catalog, ...sheets);
  const data = {schemaVersion: 1, updatedAt: new Date().toISOString().slice(0, 10), source, count: npcs.length, npcs};
  await fs.writeFile(new URL('npc-decks.js', root), '/* Fixed cards and random candidate pools; game data, not reward cards. */\nwindow.TRIAD_NPC_DECKS = ' + JSON.stringify(data, null, 2) + ';\n');
  console.log(`NPC decks: ${npcs.length}; Korean/global card pools and rules agree.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await updateNpcDecks();
