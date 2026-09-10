// Reuse the catalog's pinned Teamcraft revision; omit fish and folklore books.
import fs from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),context={window:{}};
vm.runInNewContext(await fs.readFile(new URL('data.js',root),'utf8'),context);
const data=context.window.FISHING_DATA,revision=data.revisions.teamcraft;
const source=`https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/${revision}/libs/data/src/lib/json/`;
const cache=new URL(`../../../.cache/fishing-baits/${revision}/`,import.meta.url);
await fs.mkdir(cache,{recursive:true});
async function read(file){const dest=new URL(file.replaceAll('/','-'),cache);let raw;
  if(!process.argv.includes('--refresh'))try{raw=await fs.readFile(dest,'utf8');}catch{}
  if(!raw){const r=await fetch(source+file,{signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error(`${file}: ${r.status}`);raw=await r.text();await fs.writeFile(dest,raw);}return JSON.parse(raw);
}
const [shops,npcs,koNpcs,koPlaces,koItems,recipes]=await Promise.all(['shops.json','npcs.json','ko/ko-npcs.json','ko/ko-places.json','ko/ko-items.json','recipes-per-item.json'].map(read));
const baits={},vendors={},folklore=new Set(data.fishes.map(f=>f.folklore).filter(Boolean));
for(const bait of Object.values(data.related).filter(b=>!b.fish&&!folklore.has(b.id))){
  const offers=new Map();
  for(const shop of shops)for(const trade of shop.trades){
    const item=trade.items.find(i=>i.id===bait.id);if(!item)continue;
    for(const id of shop.npcs){const npc=npcs[id];if(!npc)continue;
      const costs=trade.currencies.map(c=>({id:c.id,name:c.id===1?'길':koItems[c.id]?.ko||`아이템 #${c.id}`,amount:c.amount}));
      if(!costs.length||!costs.every(c=>c.amount>0)||!(item.amount>0))continue;
      const key=JSON.stringify([id,item.amount,costs]);
      offers.set(key,{npc:id,quantity:item.amount,costs,type:shop.type});
      const p=npc.position;
      vendors[id]={name:koNpcs[id]?.ko||npc.en||`NPC #${id}`,area:p?koPlaces[p.zoneid]?.ko||'지역 확인 필요':'위치 자료 없음',...(p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?{x:p.x,y:p.y,map:p.map}:{})};
    }
  }
  baits[bait.id]={offers:[...offers.values()],recipes:(recipes[bait.id]||[]).map(r=>({id:r.id,job:r.job,level:r.lvl,quantity:r.yields}))};
}
await fs.writeFile(new URL('bait-data.js',root),'/* Teamcraft shop/recipe data (MIT); game data © SQUARE ENIX. See README.md. */\nwindow.FISHING_BAITS='+JSON.stringify({revision,source,baits,vendors})+';\n');
console.log(`${Object.keys(baits).length} baits; ${Object.values(baits).filter(b=>b.offers.length).length} with shops; ${Object.values(baits).filter(b=>b.recipes.length).length} craftable.`);
