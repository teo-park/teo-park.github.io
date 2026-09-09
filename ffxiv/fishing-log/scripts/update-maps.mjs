// Map IDs and scale factors use the same Teamcraft revision as the fish catalog.
import fs from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const context={window:{}};
vm.runInNewContext(await fs.readFile(new URL('data.js',root),'utf8'),context);
const data=context.window.FISHING_DATA,revision=data.revisions.teamcraft;
const cache=new URL(`../../../.cache/fishing-log/maps-${revision}.json`,import.meta.url);
const source=`https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/${revision}/libs/data/src/lib/json/maps.json`;
let raw;
if(!process.argv.includes('--refresh'))try{raw=await fs.readFile(cache,'utf8');}catch{}
if(!raw){const response=await fetch(source,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(`Map data: ${response.status}`);raw=await response.text();await fs.mkdir(new URL('.',cache),{recursive:true});await fs.writeFile(cache,raw);}
const all=JSON.parse(raw),maps={};
for(const id of [...new Set(Object.values(data.spots).map(s=>s.map))].sort((a,b)=>a-b)){
  const map=all[id];
  if(!/^https:\/\/v2\.xivapi\.com\/api\/asset\/map\/[a-z0-9]+\/\d+$/.test(map?.image)||!(map.size_factor>0))throw Error(`Missing map: ${id}`);
  maps[id]={image:map.image,sizeFactor:map.size_factor};
}
for(const spot of Object.values(data.spots))for(const axis of ['x','y']){
  const percent=(spot.coords?.[axis]-1)*maps[spot.map].sizeFactor/41;
  if(!Number.isFinite(percent)||percent<0||percent>100)throw Error(`Invalid map coordinate: ${spot.key} ${axis}`);
}
await fs.writeFile(new URL('map-data.js',root),'/* Map metadata: Teamcraft (MIT). Map images: Square Enix, served by XIVAPI. See README.md. */\nwindow.FISHING_MAPS='+JSON.stringify({revision,source,maps})+';\n');
if(process.argv.includes('--check-images')){
  const entries=Object.entries(maps),failed=[];let cursor=0;
  await Promise.all(Array.from({length:4},async()=>{while(cursor<entries.length){const [id,map]=entries[cursor++];try{const response=await fetch(map.image,{method:'HEAD',signal:AbortSignal.timeout(20000)});if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))failed.push({id,status:response.status});}catch(error){failed.push({id,error:error.message});}}}));
  if(failed.length)throw Error(JSON.stringify(failed));
}
console.log(JSON.stringify({maps:Object.keys(maps).length,spots:Object.keys(data.spots).length,checkedImages:process.argv.includes('--check-images')}));
