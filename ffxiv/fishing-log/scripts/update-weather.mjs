// Weather-rate facts from the same Teamcraft revision as the collection catalog.
import fs from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),cache=new URL('../../../.cache/fishing-log/',import.meta.url);
const context={window:{}};vm.runInNewContext(await fs.readFile(new URL('data.js',root),'utf8'),context);
const data=context.window.FISHING_DATA,revision=data.revisions.teamcraft;
async function source(name){
  const url=`https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/${revision}/apps/client/src/app/core/data/sources/${name}.ts`;
  const response=await fetch(url);if(!response.ok)throw Error(`${response.status}: ${url}`);
  const text=await response.text();await fs.mkdir(cache,{recursive:true});await fs.writeFile(new URL(name+'.ts',cache),text);
  // These exports contain JSON literals, not executable TypeScript.
  return JSON.parse(text.slice(text.indexOf('=')+1).trim().replace(/;\s*$/,''));
}
const [rates,maps]=await Promise.all([source('weather-index'),source('map-ids')]);
const used=new Set(Object.values(data.spots).map(s=>s.map)),byMap={};
for(const m of maps)if(used.has(m.id)&&rates[m.weatherRate])byMap[m.id]=rates[m.weatherRate];
// Ocean voyages and instanced Diadem weather don't follow overworld forecasts.
const specialMaps=[...new Set(Object.values(data.spots).filter(s=>/성취호|디아뎀/.test(s.area)).map(s=>s.map))];
for(const [id,table] of Object.entries(byMap))if(table.at(-1)?.rate!==100||table.some((r,i)=>r.rate<=(table[i-1]?.rate||0)))throw Error('Invalid weather rates: '+id);
const result={revision,updatedAt:data.updatedAt,byMap,specialMaps};
await fs.writeFile(new URL('weather-data.js',root),'/* Teamcraft weather tables; licenses/Teamcraft-MIT.txt */\n(function(r,d){if(typeof module==="object"&&module.exports)module.exports=d;else r.FISHING_WEATHER=d;})(globalThis,'+JSON.stringify(result)+');\n');
console.log(`Weather tables: ${Object.keys(byMap).length} maps; special maps: ${specialMaps.join(', ')}`);
