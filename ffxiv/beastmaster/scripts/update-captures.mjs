import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {table,revisions} from './update-data.mjs';
import {mapPosition} from '../engine.js';

const root=new URL('../',import.meta.url),cache=new URL('../../.cache/beastmaster/',root);
const requireValue=(v,m)=>{if(!v)throw Error(m);return v;};
const normal=s=>s.toLowerCase().replace(/^the /,'').trim();
const npcAliases={'Mossless Goobue':'Mossless Goobbue'};
// These English names refer to multiple Korean BNpcName rows. Select only after
// comparing the reported region with the game's existing field monster names.
const npcChoices={'Lost Lamb':392,'Puk Hatchling':401,'Kurrea':2952};
const unresolved={
  'Infernal Drake':'영문 대상명과 한국어 게임 데이터의 연결을 확인 중입니다.',
  'Antling':'원문은 마수 종 이름만 기재합니다. 개미 개체의 정확한 이름은 확인이 필요해요.',
  'Behemoth':'원문은 베히모스로만 기재합니다. 임무 안의 정확한 포획 대상명은 확인이 필요해요.'
};

export function buildCaptures({reports,beasts,sheets}){
  const targets=[],regions=new Map(),maps={},byId=new Map(beasts.map(b=>[b.id,b]));
  requireValue(reports.rows.length===50&&new Set(reports.rows.map(r=>r.beastId)).size===50,'Expected 50 unique source rows');
  function regionFor(english,type){
    const sheet=type==='field'?'PlaceName':'ContentFinderCondition';
    const matches=[...sheets.en[sheet]].filter(([id,r])=>normal(r.Name)===normal(english)&&(type!=='field'||[...sheets.en.Map.values()].some(m=>+m.PlaceName===id&&+m.SizeFactor===100&&/^[a-z]\df\d\/0[01]$/.test(m.Id))));
    requireValue(matches.length===1,`Ambiguous ${sheet}: ${english} (${matches.map(([id])=>id)})`);
    const [id]=matches[0],name=requireValue(sheets.ko[sheet].get(id)?.Name,`Missing Korean place: ${english}`),key=`${type}:${id}`;
    if(regions.has(key))return regions.get(key);
    const region={key,id,name,englishName:english,type,mapId:null};
    if(type==='field'){
      const choices=[...sheets.en.Map].filter(([,m])=>+m.PlaceName===id&&+m.SizeFactor===100&&/^[a-z]\df\d\/0[01]$/.test(m.Id));
      requireValue(choices.length===1,`Ambiguous map: ${english}`);
      const [mapId,m]=choices[0];region.mapId=mapId;
      maps[mapId]={id:mapId,path:m.Id,name,sizeFactor:+m.SizeFactor,url:`https://v2.xivapi.com/api/asset/map/${m.Id}`};
    }
    regions.set(key,region);return region;
  }
  for(const row of reports.rows){
    const beast=requireValue(byId.get(row.beastId),'Unknown beast');
    requireValue(row.targets.length===row.places.length,'Unpaired source lines');
    for(let i=0;i<row.targets.length;i++){
      const rawTarget=row.targets[i],rawLocation=row.places[i],match=rawTarget.match(/^Lv\s*(\d+)\s+(.+)$/);
      if(!match){requireValue((row.beastId===1&&rawTarget==='')||/ Gourd$/.test(rawTarget),`Unknown non-capture source: ${rawTarget}`);continue;}
      const level=+match[1];requireValue(level>=1&&level<=100,'Invalid level');
      let place=rawLocation.replace('Wesern La Noscea','Western La Noscea'),kind='field',event=null,coordinates=null;
      const fate=place.match(/^FATE: "(.+)" - (.+)$/),hunt=place.match(/^([ABS]) Rank Hunt - (.+)$/);
      if(fate){kind='fate';event=fate[1];place=fate[2];}
      else if(hunt){kind='hunt';event=`${hunt[1]}급 마물`;place=hunt[2];}
      const xy=place.match(/\s*\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)\)$/);
      if(xy){coordinates={x:+xy[1],y:+xy[2]};place=place.slice(0,xy.index);}
      else if(kind==='field')kind='duty';
      const type=kind==='duty'?'duty':'field';
      const conflict=beast.id===25;
      // Collect currently reports Western Thanalan, whereas the game hint and
      // Eorzea Weather specify Central Thanalan. Keep the report, never pin it.
      if(conflict){place='Central Thanalan';coordinates=null;}
      const region=regionFor(place,type);
      if(coordinates)mapPosition(coordinates,maps[region.mapId].sizeFactor);
      for(const englishName of match[2].split(' or ')){
        let npcNameIds=[],name=englishName,note=unresolved[englishName]||'';
        const matches=[...sheets.en.BNpcName].filter(([,r])=>r.Singular.toLowerCase()===(npcAliases[englishName]||englishName).toLowerCase());
        if(!unresolved[englishName]){
          npcNameIds=npcChoices[englishName]?[npcChoices[englishName]]:matches.map(([id])=>id);
          requireValue(npcNameIds.length&&npcNameIds.every(id=>matches.some(([n])=>n===id)),`Unmatched NPC: ${englishName}`);
          const names=new Set(npcNameIds.map(id=>requireValue(sheets.ko.BNpcName.get(id)?.Singular,`Missing Korean NPC ${id}`)));
          requireValue(names.size===1,`Ambiguous Korean NPC: ${englishName}`);name=[...names][0];
        }else if(englishName!=='Infernal Drake')name=beast.name;
        if(conflict)note='도감과 Eorzea Weather는 중부 다날란, FFXIV Collect는 서부 다날란 (27,24)으로 안내합니다. 지역·좌표 확인 전까지 핀을 표시하지 않아요.';
        targets.push({id:`${beast.id}:${i+1}:${targets.filter(t=>t.beastId===beast.id).length+1}`,beastId:beast.id,name,englishName,npcNameIds,level,kind,event,
          regionKey:region.key,coordinates,mapId:region.mapId,status:conflict?'conflict':unresolved[englishName]?'name-pending':'reported',note,
          source:{name:'FFXIV Collect',url:`https://ffxivcollect.com/beasts/${beast.id}`,target:rawTarget,location:rawLocation},
          ...(conflict?{additionalSource:{name:'Eorzea Weather',url:'https://eorzea-weather.com/beastmaster'}}:{})});
      }
    }
  }
  requireValue(new Set(targets.map(t=>t.beastId)).size===49,'Missing capture beast');
  return {schemaVersion:1,updatedAt:reports.observedAt,scope:'공개 포획 제보 목록. 좌표는 대표 위치이며 모든 출현 지점이나 포획 성공을 보증하지 않습니다.',
    coverage:{beasts:49,targets:targets.length,pins:targets.filter(t=>t.coordinates).length,regions:regions.size},
    regions:[...regions.values()].sort((a,b)=>a.type.localeCompare(b.type)||a.name.localeCompare(b.name,'ko')),targets,maps};
}

export async function updateCaptures(){
  const sheets={ko:{},en:{}},files=[];
  await Promise.all(['ko','en'].flatMap(lang=>['BNpcName','PlaceName','ContentFinderCondition','Map'].filter(s=>lang==='en'||s!=='Map').map(async sheet=>{
    const url=`https://raw.githubusercontent.com/${revisions[lang].repo}/${revisions[lang].sha}/csv/${lang==='en'?'en/':''}${sheet}.csv`,path=new URL(`${revisions[lang].sha}/${lang}-${sheet}.csv`,cache);
    let raw;try{raw=await fs.readFile(path,'utf8');}catch{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`${r.status} ${url}`);raw=await r.text();await fs.mkdir(new URL('.',path),{recursive:true});await fs.writeFile(path,raw);}
    sheets[lang][sheet]=table(raw,lang).rows;files.push({url,sha256:createHash('sha256').update(raw).digest('hex')});
  })));
  const reports=JSON.parse(await fs.readFile(new URL('capture-reports.json',root),'utf8')),data=JSON.parse(await fs.readFile(new URL('data.json',root),'utf8'));
  const result=buildCaptures({reports,beasts:data.beasts,sheets});
  await fs.writeFile(new URL('captures.json',root),JSON.stringify(result,null,2)+'\n');
  await fs.writeFile(new URL('captures.sources.json',root),JSON.stringify({source:reports.source,observedAt:reports.observedAt,sourceSha256:reports.sourceSha256,files:files.sort((a,b)=>a.url.localeCompare(b.url))},null,2)+'\n');
  console.log(result.coverage);return result;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await updateCaptures();
