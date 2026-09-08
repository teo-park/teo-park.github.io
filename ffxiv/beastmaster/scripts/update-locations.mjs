import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {table,revisions} from './update-data.mjs';

const root=new URL('../',import.meta.url),cache=new URL('../../.cache/beastmaster/',root);
const source='https://ff14.inven.co.kr/dataninfo/hunting/list.php?dataidx=51';
const hash=s=>createHash('sha256').update(s).digest('hex');
const requireValue=(v,m)=>{if(!v)throw Error(m);return v;};
const text=s=>s.replace(/<span\b[^>]*>[\s\S]*?<\/span>/g,'').replace(/<[^>]*>/g,'').replace(/&gt;/g,'>').replace(/&amp;/g,'&').trim();

export function parseHunting(html){
  const rows=[];
  for(const [row] of html.matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/g)){
    const cells=Object.fromEntries([...row.matchAll(/<td\s+class=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/td>/g)].map(m=>[m[1],m[2]]));
    if(!cells.name||!cells.etc0)continue;
    const sourceUrl=cells.name.match(/href="([^"]+)"/)?.[1];
    if(!sourceUrl?.startsWith('https://ff14.inven.co.kr/dataninfo/hunting/detail.php?'))continue;
    const locationText=text(cells.etc0),[region]=locationText.split('>');
    const area=locationText.slice(region.length+1).split('(')[0].trim();
    // A malformed coordinate or a dungeon name is not an overworld map point.
    const coordinates=[...locationText.matchAll(/\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)\)/g)].map(m=>({x:+m[1],y:+m[2]}));
    rows.push({name:text(cells.name),region,area,locationText,coordinates,sourceUrl});
  }
  return rows;
}

export function buildLocations({rows,links,beasts,maps,places,npcs}){
  const byId=new Map(beasts.map(b=>[b.id,b])),entries=[],seen=new Set();
  for(const rule of links){
    requireValue(!seen.has(rule.beastId),'Duplicate beast link');seen.add(rule.beastId);
    const b=requireValue(byId.get(rule.beastId),'Invalid beast ID');
    requireValue(b.locationHint?.type==='field','Only overworld references are supported');
    const mapMatches=[...maps].filter(([,m])=>places.get(+m.PlaceName)?.Name===rule.region&&+m.SizeFactor===100&&/^[a-z]\df\d\/0[01]$/.test(m.Id));
    requireValue(mapMatches.length===1,`Ambiguous overworld map: ${rule.region}`);
    const [mapId,m]=mapMatches[0],targets=[];
    for(const name of rule.names){
      const npcNameIds=[...npcs].filter(([,n])=>n.Singular===name).map(([id])=>id);
      requireValue(npcNameIds.length,`No exact Korean BNpcName: ${name}`);
      const matches=rows.filter(r=>r.name===name&&r.region===rule.region&&r.coordinates.length);
      requireValue(matches.length,`No Inven coordinates: ${name} / ${rule.region}`);
      // Each class can repeat the same monster. Keep one sourced representative
      // coordinate per named subarea, rather than treating each row as a new mob.
      for(const r of matches){
        if(targets.some(t=>t.name===name&&t.area===r.area))continue;
        const coordinates=r.coordinates[0];
        requireValue(Object.values(coordinates).every(n=>n>=1&&n<=42),'Coordinates outside map');
        targets.push({id:`${rule.beastId}:${new URL(r.sourceUrl).searchParams.get('c')}`,name,npcNameIds,
          region:r.region,area:r.area,coordinates,approximate:true,captureVerified:false,
          matchesHint:r.region===b.locationHint.name,mapId,
          source:{name:'인벤 토벌수첩',url:r.sourceUrl,locationText:r.locationText}});
      }
    }
    entries.push({beastId:b.id,targets});
  }
  const used=new Set(entries.flatMap(e=>e.targets.map(t=>t.mapId)));
  return {entries,maps:Object.fromEntries([...used].sort((a,b)=>a-b).map(id=>{
    const m=maps.get(id);return [id,{id,path:m.Id,name:places.get(+m.PlaceName).Name,sizeFactor:+m.SizeFactor,
      territoryId:+m.TerritoryType,url:`https://v2.xivapi.com/api/asset/map/${m.Id}`}];
  }))};
}

export async function updateLocations({refresh=false}={}){
  const files=[];
  async function get(name,url){
    const dest=new URL(name,cache);let value;
    if(!refresh)try{value=await fs.readFile(dest,'utf8');}catch{}
    if(value===undefined){const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`${r.status}: ${url}`);value=await r.text();await fs.mkdir(new URL('.',dest),{recursive:true});await fs.writeFile(dest,value);}
    files.push({url,sha256:hash(value)});return value;
  }
  const raw=(lang,name)=>`https://raw.githubusercontent.com/${revisions[lang].repo}/${revisions[lang].sha}/csv/${lang==='en'?'en/':''}${name}.csv`;
  const [html,mapText,placeText,npcText]=await Promise.all([
    get('inven-hunting.html',source),get('en-Map.csv',raw('en','Map')),
    get(`${revisions.ko.sha}/ko-PlaceName.csv`,raw('ko','PlaceName')),get(`${revisions.ko.sha}/ko-BNpcName.csv`,raw('ko','BNpcName'))
  ]);
  const rows=parseHunting(html);requireValue(rows.length>=600,'Incomplete Inven hunting table');
  const {links}=JSON.parse(await fs.readFile(new URL('location-links.json',root),'utf8'));
  const {beasts}=JSON.parse(await fs.readFile(new URL('data.json',root),'utf8'));
  const built=buildLocations({rows,links,beasts,maps:table(mapText,'en').rows,places:table(placeText,'ko').rows,npcs:table(npcText,'ko').rows});
  const data={schemaVersion:1,source,scope:'토벌수첩의 몬스터 출현 참고 위치. 마수 포획 가능 여부·현재 위치는 별도 확인 필요.',
    coverage:{beasts:built.entries.length,targets:built.entries.reduce((n,e)=>n+e.targets.length,0),captureVerified:0},...built};
  await fs.writeFile(new URL('locations.json',root),JSON.stringify(data,null,2)+'\n');
  await fs.writeFile(new URL('locations.sources.json',root),JSON.stringify({files},null,2)+'\n');
  console.log(JSON.stringify(data.coverage));return data;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await updateLocations({refresh:process.argv.includes('--refresh')});
