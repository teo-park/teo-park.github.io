// Public aggregate catch composition, independent of the filtered bite-time bins.
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
export const endpoint='https://gubal.ffxivteamcraft.com/graphql';
export function summarize(rows,allowedSpots,allowedBaits){
  const spots={};
  for(const r of rows){
    if(!allowedSpots.has(r.spot)||!allowedBaits.has(r.baitId)||r.aLure!==0||r.mLure!==0||!Number.isSafeInteger(r.itemId)||r.itemId<=0||!Number.isSafeInteger(r.occurences)||r.occurences<=0)continue;
    const b=(spots['rod:'+r.spot]??={})[r.baitId]??={total:0,fish:{}};
    b.total+=r.occurences;b.fish[r.itemId]=(b.fish[r.itemId]||0)+r.occurences;
  }
  return spots;
}
async function main(){
  const root=new URL('../',import.meta.url),cache=new URL('../../../.cache/fishing-log/bait-catches/',import.meta.url),ctx={window:{}};
  for(const file of ['data.js','bait-data.js'])vm.runInNewContext(await fs.readFile(new URL(file,root),'utf8'),ctx);
  const data=ctx.window.FISHING_DATA,allowedBaits=new Set(Object.keys(ctx.window.FISHING_BAITS.baits).map(Number));
  const spotIds=Object.values(data.spots).filter(s=>s.kind==='rod').map(s=>s.id).sort((a,b)=>a-b),allowedSpots=new Set(spotIds),batches=[];
  for(let i=0;i<spotIds.length;i+=10)batches.push(spotIds.slice(i,i+10));
  await fs.mkdir(cache,{recursive:true});const records=[];let cursor=0;
  async function worker(){while(cursor<batches.length){const batch=batches[cursor++],stamp=JSON.stringify({schema:1,spots:batch,baits:[...allowedBaits]}),dest=new URL(batch[0]+'.json',cache);let stored;
    if(!process.argv.includes('--refresh'))try{const v=JSON.parse(await fs.readFile(dest,'utf8'));if(v.stamp===stamp)stored=v;}catch{}
    if(!stored){const rows=[];for(let offset=0;;offset+=1000){
      const query=`query { catches: baits_per_fish_per_spot(where:{spot:{_in:[${batch}]},baitId:{_in:[${[...allowedBaits]}]},itemId:{_gt:0},aLure:{_eq:0},mLure:{_eq:0},occurences:{_gt:0}},order_by:[{spot:asc},{baitId:asc},{itemId:asc}],limit:1000,offset:${offset}){itemId spot baitId aLure mLure occurences} }`;
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query}),signal:AbortSignal.timeout(45000)});
      if(!response.ok)throw Error(`Catch query: ${response.status}`);const body=await response.json();
      if(body.errors||!Array.isArray(body.data?.catches))throw Error('Invalid aggregate catch response: '+JSON.stringify(body.errors));
      rows.push(...body.data.catches);if(body.data.catches.length<1000)break;
    }stored={stamp,fetchedAt:new Date().toISOString(),rows};await fs.writeFile(dest,JSON.stringify(stored));}
    records.push(stored);console.log(`Catch composition: ${records.length}/${batches.length} batches`);
  }}
  await Promise.all([worker(),worker()]);const spots=summarize(records.flatMap(r=>r.rows),allowedSpots,allowedBaits);
  if(!Object.keys(spots).length)throw Error('Empty snapshot; existing data not replaced.');
  const dates=records.map(r=>r.fetchedAt).sort();
  const output={schemaVersion:1,source:endpoint,sourceRevision:data.revisions.teamcraft,fetchedFrom:dates[0],fetchedThrough:dates.at(-1),scope:'successful-catches-with-zero-lure-counters',spots:Object.fromEntries(Object.entries(spots).sort(([a],[b])=>a.localeCompare(b)))};
  const dest=new URL('bait-catches.js',root),temporary=new URL('bait-catches.js.tmp',root);
  await fs.writeFile(temporary,'/* Teamcraft public aggregate catches (MIT), no personal records. See README.md. */\nwindow.FISHING_BAIT_CATCHES='+JSON.stringify(output)+';\n');await fs.rename(temporary,dest);
  console.log(`Saved ${Object.keys(spots).length} spots; ${Object.values(spots).reduce((n,s)=>n+Object.keys(s).length,0)} spot/bait denominators.`);
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await main();
