// Public game metadata and Teamcraft facts; no account or character requests.
import fs from 'node:fs/promises';
import {parseCsv,plain} from '../../triple-triad/scripts/update-data.mjs';
const root=new URL('../',import.meta.url),cache=new URL('../../../.cache/fishing-log/',import.meta.url);
const REV={teamcraft:'ceac70405b154d268bfc3bf6cda2776ac048a6d4',ko:'9431b6ce34e0f5b79686f71b585769819f81ae2b'};
const refresh=process.argv.includes('--refresh');
const corrections=JSON.parse(await fs.readFile(new URL('route-corrections.json',root),'utf8'));
async function get(name,url){if(!refresh)try{return await fs.readFile(new URL(name,cache),'utf8');}catch{}const r=await fetch(url,{signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error(`${r.status}: ${url}`);const text=await r.text();await fs.mkdir(cache,{recursive:true});await fs.writeFile(new URL(name,cache),text);return text;}
const tc=path=>`https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/${REV.teamcraft}/${path}`;
const tcData=async path=>JSON.parse(await get(path.split('/').at(-1),tc('libs/data/src/lib/json/'+path)));
const [koNames,enNames,icons,places,maps,weathers,parameters,sources,spearSources,spots,rodLog,spearLog,tracker,legendary,rodRows,spearRows]=await Promise.all([
 ...['ko/ko-items.json','items.json','item-icons.json','ko/ko-places.json','maps.json','ko/ko-weathers.json','fish-parameter.json','fishing-sources.json','spearfishing-sources.json','fishing-spots.json','fishing-log.json','spear-fishing-log.json','fishing-log-tracker-page-data.json','legendary-fish.json'].map(tcData),
 ...['FishParameter','SpearfishingItem'].map(async sheet=>parseCsv(await get('ko-'+sheet+'.csv',`https://raw.githubusercontent.com/Ra-Workspace/ffxiv-datamining-ko/${REV.ko}/csv/${sheet}.csv`)))
]);
const item=id=>({id:+id,name:plain(koNames[id]?.ko||enNames[id]?.en||`아이템 ${id}`),original:plain(enNames[id]?.en||''),icon:icons[id]?'https://v2.xivapi.com'+icons[id]:'',fish:!!parameters[id]||!!spearSources[id]});
const place=id=>plain(places[id]?.ko||`장소 ${id}`);
const spotIndex=new Map(),levels=new Map();
for(const [type,tab] of tracker.entries())for(const area of tab.tabs)for(const spot of area.spots){
 const kind=type===0?'rod':'spear',map=maps[spot.mapId];
 spotIndex.set(`${kind}:${spot.id}`,{key:`${kind}:${spot.id}`,id:spot.id,kind,name:place(spot.placeId),area:place(map?.placename_id||area.placeId),region:place(map?.region_id||area.placeId),map:spot.mapId,coords:spot.coords||null});
 for(const fish of spot.fishes)if(!levels.has(fish.itemId))levels.set(fish.itemId,fish.level);
}
for(const spot of spots)if(!spotIndex.has('rod:'+spot.id)){const map=maps[spot.mapId];spotIndex.set('rod:'+spot.id,{key:'rod:'+spot.id,id:spot.id,kind:'rod',name:place(spot.zoneId),area:place(spot.placeId),region:place(map?.region_id||spot.placeId),map:spot.mapId,coords:spot.coords||null});}
const seenRelated=new Set();
function routesFor(id,kind){
 const raw=kind==='rod'?sources[id]:spearSources[id],log=kind==='rod'?rodLog:spearLog;
 let routes=kind==='rod'?(raw||[]).map(s=>({...s,spotKey:'rod:'+s.spot,verified:true})):[...new Set(log.filter(x=>x.itemId===id).map(x=>x.id))].flatMap(spot=>(raw||[{}]).map(s=>({...s,spotKey:'spear:'+spot,verified:!!raw})));
 if(!routes.length)routes=[...new Set(log.filter(x=>x.itemId===id).map(x=>kind+':'+(x.spot?.id??x.id)))].map(spotKey=>({spotKey,verified:false}));
 // Only fill missing source routes; a later upstream record takes precedence.
 if(kind==='rod'&&!routes.some(r=>r.verified)&&corrections.fish[id])routes=corrections.fish[id].routes;
 return routes.map(s=>{
  const r={spotKey:s.spotKey,verified:s.verified};
  for(const k of ['bait','hookset','tug','spawn','duration','snagging','minGathering','aLure','mLure','oceanFishingTime','speed','shadowSize'])if(s[k]!==undefined)r[k]=s[k];
  for(const k of ['weathers','weathersFrom'])if(s[k]?.length)r[k]=s[k];
  if(s.predators?.length)r.predators=s.predators.map(p=>({id:p.id,amount:p.amount}));
  if(s.video&&/^https:\/\/(?:youtu.be\/|www.youtube.com\/)/.test(s.video))r.video=s.video;
  if(r.bait)seenRelated.add(r.bait);for(const p of r.predators||[])seenRelated.add(p.id);
  return r;
 });
}
const all=[];
for(const [kind,rows] of [['rod',rodRows],['spear',spearRows]]){
 // IsHidden denotes rare fish with undisclosed names, not absent log slots.
 const listed=rows.filter(r=>+r.Item>0&&(kind==='rod'?r.IsInLog==='True':r.IsVisible==='True')).sort((a,b)=>+a['#']-+b['#']);
 for(const [i,row] of listed.entries()){
  const id=+row.Item,p=parameters[id]||{},entry={...item(id),kind,order:i+1,gameId:+row['#'],level:p.level||levels.get(id)||null,big:kind==='rod'&&row.IsHidden==='True',legendary:!!legendary[id],stars:+row.OceanStars||0,timed:!!p.timed,weathered:!!p.weathered,folklore:p.folklore||null,routes:routesFor(id,kind)};
  if(!koNames[id]?.ko)throw Error('한국어 이름 누락: '+id);if(!entry.icon)throw Error('아이콘 누락: '+id);
  if(entry.folklore)seenRelated.add(entry.folklore);all.push(entry);
 }
}
const fishIds=new Set(all.map(f=>f.id));if(fishIds.size!==all.length)throw Error('어류/작살 아이템 ID 중복');
// Include bait chains even when a mooch fish is outside the two collection logs.
const related={};
for(let pass=0;pass<8;pass++)for(const id of [...seenRelated])if(!related[id])related[id]={...item(id),routes:parameters[id]?routesFor(id,'rod'):[]};
const usedSpots=new Set([...all,...Object.values(related)].flatMap(f=>f.routes.map(r=>r.spotKey))),unknownSpots=[...usedSpots].filter(k=>!spotIndex.has(k));
if(unknownSpots.length)throw Error('낚시터 누락: '+unknownSpots.join(','));
const usedWeather=new Set([...all,...Object.values(related)].flatMap(f=>f.routes.flatMap(r=>[...(r.weathers||[]),...(r.weathersFrom||[])])));
const result={schemaVersion:1,updatedAt:'2026-09-08',revisions:REV,count:all.length,counts:{rod:all.filter(f=>f.kind==='rod').length,spear:all.filter(f=>f.kind==='spear').length},missingConditions:all.filter(f=>!f.routes.some(r=>r.verified)).map(f=>f.id),fishes:all,related,spots:Object.fromEntries([...spotIndex].filter(([k])=>usedSpots.has(k))),weathers:Object.fromEntries([...usedWeather].map(id=>[id,placeWeather(id)])),source:{teamcraft:'https://ffxivteamcraft.com/log-tracker/FSH',official:'https://guide.ff14.co.kr/job/Fisher/31?type=L'}};
function placeWeather(id){if(!weathers[id]?.ko)throw Error('날씨 번역 누락: '+id);return weathers[id].ko;}
await fs.mkdir(root,{recursive:true});await fs.writeFile(new URL('data.js',root),'/* Public catalog snapshot. See README.md for sources and scope. */\nwindow.FISHING_DATA='+JSON.stringify(result)+';\n');
await fs.mkdir(new URL('licenses/',root),{recursive:true});await fs.writeFile(new URL('licenses/Teamcraft-MIT.txt',root),await get('LICENSE',tc('LICENSE')));
console.log(JSON.stringify({count:result.count,counts:result.counts,missingConditions:result.missingConditions.length,spots:usedSpots.size,related:seenRelated.size}));
