// Snapshot public, aggregate bite-time bins. No accounts or individual catch records.
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

export const endpoint='https://gubal.ffxivteamcraft.com/graphql';
export const key=(id,spotKey,bait)=>`${id}|${spotKey}|${bait}`;
export function summarize(rows,allowed){
  const ranges={};
  for(const row of rows){
    const k=key(row.itemId,'rod:'+row.spot,row.baitId),t=row.flooredBiteTime,n=row.occurences;
    if(!allowed.has(k)||!Number.isInteger(t)||t<=1||t>=600||!Number.isInteger(n)||n<3)continue;
    const r=ranges[k]??={min:t,max:t+1,samples:0};
    // A floored second bin t includes [t, t+1), so preserve its upper edge.
    r.min=Math.min(r.min,t);r.max=Math.max(r.max,t+1);r.samples+=n;
  }
  return ranges;
}
async function main(){
  const root=new URL('../',import.meta.url),cache=new URL('../../../.cache/fishing-log/bite-times/',import.meta.url),context={window:{}};
  vm.runInNewContext(await fs.readFile(new URL('data.js',root),'utf8'),context);
  const data=context.window.FISHING_DATA,byId=new Map(Object.values(data.related).map(f=>[f.id,f]));
  for(const f of data.fishes)byId.set(f.id,f);
  const routes=new Map();
  for(const f of byId.values())for(const r of f.routes||[])if(r.spotKey.startsWith('rod:')&&r.bait)routes.set(key(f.id,r.spotKey,r.bait),{itemId:f.id,spot:+r.spotKey.slice(4),baitId:r.bait});
  const entries=[...new Set([...routes.values()].map(r=>r.itemId))].sort((a,b)=>a-b),batches=[];
  for(let i=0;i<entries.length;i+=20)batches.push(entries.slice(i,i+20));
  await fs.mkdir(cache,{recursive:true});
  const all=[];let cursor=0;
  async function worker(){while(cursor<batches.length){
    const batch=batches[cursor++],cacheFile=new URL(batch[0]+'.json',cache),stamp=JSON.stringify(batch);let stored;
    if(!process.argv.includes('--refresh'))try{const value=JSON.parse(await fs.readFile(cacheFile,'utf8'));if(value.stamp===stamp)stored=value;}catch{}
    if(!stored){
      const rows=[];let offset=0;
      while(true){
      const query=`query { biteTimes: bite_time_per_fish_per_spot_per_bait(where:{itemId:{_in:[${batch.join(',')}]},flooredBiteTime:{_gt:1,_lt:600},occurences:{_gte:3}},order_by:[{itemId:asc},{spot:asc},{baitId:asc},{flooredBiteTime:asc}],limit:1000,offset:${offset}){itemId spot baitId flooredBiteTime occurences} }`;
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query}),signal:AbortSignal.timeout(45000)});
      if(!response.ok)throw Error(`Bite-time query failed: ${response.status}`);
      const result=await response.json();if(result.errors||!Array.isArray(result.data?.biteTimes))throw Error('Invalid bite-time response: '+JSON.stringify(result.errors));
      rows.push(...result.data.biteTimes);if(result.data.biteTimes.length<1000)break;offset+=1000;
      }
      stored={stamp,fetchedAt:new Date().toISOString(),rows};await fs.writeFile(cacheFile,JSON.stringify(stored));
    }
    all.push(stored);console.log(`Bite times: ${all.length}/${batches.length} batches`);
  }}
  await Promise.all([worker(),worker()]);
  const rows=all.flatMap(x=>x.rows);
  // Keep observations with other baits too: the catalog's preferred bait is not
  // an exhaustive bait list, and those catches matter when comparing competitors.
  const allowed=new Set(rows.filter(r=>byId.has(r.itemId)&&data.spots['rod:'+r.spot]).map(r=>key(r.itemId,'rod:'+r.spot,r.baitId)));
  const ranges=summarize(rows,allowed);
  if(!Object.keys(ranges).length)throw Error('Empty snapshot; existing bite times were not replaced.');
  const dates=all.map(x=>x.fetchedAt).sort(),result={schemaVersion:1,source:endpoint,sourceRevision:data.revisions.teamcraft,fetchedFrom:dates[0],fetchedThrough:dates.at(-1),routeCount:routes.size,coveredRoutes:[...routes.keys()].filter(k=>ranges[k]).length,observedCombinations:Object.keys(ranges).length,ranges:Object.fromEntries(Object.entries(ranges).sort(([a],[b])=>a.localeCompare(b)))};
  await fs.writeFile(new URL('bite-times.js',root),'/* Teamcraft aggregate observations; see README.md for scope and rounding. */\nwindow.FISHING_BITE_TIMES='+JSON.stringify(result)+';\n');
  console.log(JSON.stringify({routeCount:result.routeCount,coveredRoutes:result.coveredRoutes,fishCount:new Set(Object.keys(ranges).map(k=>k.split('|')[0])).size}));
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await main();
