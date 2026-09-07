// Public spell metadata only. No character, account, or collection lookup.
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import vm from 'node:vm';
import {parseCsv,plain} from '../../triple-triad/scripts/update-data.mjs';
const root=new URL('../',import.meta.url),cache=new URL('../../.cache/blue-mage/',root);
const refresh=process.argv.includes('--refresh');
const normalize=s=>plain(s).toLowerCase().replace(/[’‘]/g,"'").replace(/^the /,'').replace(/[\s\p{P}\p{S}]/gu,'');
const guide='https://guide.ff14.co.kr/job/BlueMage/18?type=E';
const guideSearch=name=>'https://guide.ff14.co.kr/lodestone/search?keyword='+encodeURIComponent(name);
const fields={AozAction:['#','Action','Rank'],AozActionTransient:['#','Stats','Number'],Action:['#','Name','Cast100ms','Recast100ms','Range','EffectRange'],BNpcName:['#','Singular'],PlaceName:['#','Name'],ContentFinderCondition:['#','Name','ClassJobLevelRequired','ContentType']};
const types={field:'필드',dungeon:'던전',trial:'토벌전',raid:'레이드',carnivale:'가면 무투회',totem:'청마법 우상',quest:'퀘스트'};
async function get(file,url){
  if(!refresh)try{return await fs.readFile(new URL(file,cache),'utf8');}catch{}
  const response=await fetch(url,{signal:AbortSignal.timeout(60000)});if(!response.ok)throw Error(`${response.status}: ${url}`);
  const text=await response.text();await fs.mkdir(cache,{recursive:true});await fs.writeFile(new URL(file,cache),text);return text;
}
export async function update(){
  let revisions;
  if(!refresh)try{revisions=JSON.parse(await fs.readFile(new URL('revisions.json',cache),'utf8'));}catch{}
  if(!revisions){
    const [ko,en]=await Promise.all(['https://api.github.com/repos/xivapi/ffxiv-datamining/contents/csv/ko','https://api.github.com/repos/xivapi/ffxiv-datamining/commits/master'].map(async url=>{const r=await fetch(url);if(!r.ok)throw Error(r.status);return r.json();}));
    revisions={ko:ko.sha,en:en.sha};await fs.mkdir(cache,{recursive:true});await fs.writeFile(new URL('revisions.json',cache),JSON.stringify(revisions));
  }
  const api=JSON.parse(await get('spells.json','https://ffxivcollect.com/api/spells')),sheets={ko:{},en:{}};
  if(api.count!==api.results?.length||api.count<124)throw Error('Incomplete spell catalog');
  for(const lang of ['ko','en'])await Promise.all(Object.keys(fields).map(async sheet=>{
    const base=lang==='ko'?`Ra-Workspace/ffxiv-datamining-ko/${revisions.ko}/csv`:`xivapi/ffxiv-datamining/${revisions.en}/csv/en`;
    sheets[lang][sheet]=new Map(parseCsv(await get(`${lang}-${sheet}.csv`,`https://raw.githubusercontent.com/${base}/${sheet}.csv`),fields[sheet]).map(row=>[+row['#'],row]));
  }));
  const maps={};for(const sheet of ['BNpcName','PlaceName','ContentFinderCondition']){
    maps[sheet]=new Map();for(const [id,en]of sheets.en[sheet]){const ko=sheets.ko[sheet].get(id);if(ko)maps[sheet].set(normalize(en.Name||en.Singular),{...ko,id});}
  }
  // Same English enemy name can refer to a later monster with a different Korean name.
  for(const [name,id] of [['Trickster Imp',492],['Manor Sentry',428],['Queen Hawk',4656],['Griffin',3526]])maps.BNpcName.set(normalize(name),{...sheets.ko.BNpcName.get(id),id});
  const dutyContext={window:{}};vm.runInNewContext(await fs.readFile(new URL('../../duty-finder/data.js',import.meta.url),'utf8'),dutyContext);
  const duties=dutyContext.window.DUTY_DATA?.duties||[];
  const dutyLinks=new Map(duties.map(d=>[normalize(d.name),'https://guide.ff14.co.kr/lodestone/db/duty/'+d.id]));
  const enemyName=text=>{
    const record=maps.BNpcName.get(normalize(text));if(record)return plain(record.Singular);
    if(text==='Shikigami')return '사역귀';
    if(text==='Faust & Sturm Doll')return '파우스트 · 인형 폭기병';
    if(text==='Ghrah Luminary Adds')return '발광 고라호가 소환하는 마물';
    if(text==='Dojun-maru Adds')return '도우준마루가 소환하는 마물';
    throw Error('Untranslated enemy: '+text);
  };
  function sourceData(source,spell){
    const original=plain(source.text),parts=original.split(' / '),common={original,sourceUrl:'https://ffxivcollect.com/spells/'+spell.id};
    if(parts.length!==2){
      if(original==='Learned First')return {...common,type:'quest',location:'청마도사 개방 퀘스트',enemy:'',condition:'「청마도사라는 남자」 퀘스트를 진행하며 습득',coordinates:null,level:null,locationKey:'quest:unlock',link:'https://guide.ff14.co.kr/lodestone/db/quest/87e6a79f8f4'};
      const learned=original.match(/Learn (\d+) Spells/),level=original.match(/Level (\d+)/),stages=original.match(/Complete (\d+) stages/);
      if(!learned&&!level&&!stages)throw Error('Unknown totem requirement: '+original);
      return {...common,type:'totem',location:'울다하 달 회랑',enemy:'괴짜 가히쟈',condition:learned?`청마법 ${learned[1]}종 습득 후 우상 수령`:level?`청마도사 레벨 ${level[1]} 달성 후 우상 수령`:`가면 무투회 ${stages[1]}개 시합 완료 후 우상 수령`,prerequisite:'잡 퀘스트 「청가면 탄생」 완료',coordinates:{x:12.5,y:12.9},level:null,locationKey:'totem:gaheelja',link:guide+'#anchor_h4',requirement:learned?{type:'learned',count:+learned[1]}:level?{type:'level',count:+level[1]}:{type:'stages',count:+stages[1]}};
    }
    let [enemy,location]=parts.map(s=>s.trim()),notes=[];
    const annotations={'B Rank':'B급 마물','A Rank':'A급 마물','No Tether':'연결선이 없는 개체','Heals Allies':'주변 마물을 회복할 때 기술 사용','2nd Boss':'두 번째 보스 전투','Final Boss 3 Orb Spawn':'최종 보스 전투에서 구슬 3개로 등장하는 마물','leave one head alive':'머리를 하나 남겨 기술 사용을 유도'};
    const removeNotes=text=>text.replace(/\(([^)]*)\)/g,(full,inner)=>{if(annotations[inner]){notes.push(annotations[inner]);return '';}return full;}).trim();
    enemy=removeNotes(enemy);location=removeNotes(location);
    const coordinates=location.match(/\(([\d.]+),\s*([\d.]+)\)/),point=coordinates?{x:+coordinates[1],y:+coordinates[2]}:null;
    if(coordinates)location=location.replace(coordinates[0],'').trim();
    const name=enemyName(enemy);
    if(/Masked Carnivale/.test(location)){
      const stages=[...location.matchAll(/#(\d+)/g)].map(m=>+m[1]);if(!stages.length)throw Error('Carnivale stage missing');
      // One source can list two different stages; expand each as a distinct location.
      return stages.map(n=>({...common,type:'carnivale',location:`가면 무투회 ${n}번`,enemy:name,condition:notes.join(' · '),coordinates:null,level:null,locationKey:'carnivale:'+n,link:guide+'#anchor_h5'}));
    }
    const alias={'The Binding Coil of Bahamut T1':'The Binding Coil of Bahamut - Turn 1'};
    location=alias[location]||location;
    const duty=maps.ContentFinderCondition.get(normalize(location)),place=maps.PlaceName.get(normalize(location));
    if(!duty&&!place)throw Error('Unknown source location: '+location);
    // Collect sometimes gives the arena name without a difficulty. Preserve that
    // ambiguity as a trial instead of turning an arena into an overworld field.
    if(!duty&&['The Whorleater','Thok Ast Thok'].includes(location))return {...common,type:'trial',location:plain(place.Name),enemy:name,condition:'토벌전 난이도는 원문에 구분되어 있지 않아요.',coordinates:null,level:null,locationKey:'trial-arena:'+place.id,link:guideSearch(name),difficultyUnspecified:true};
    const record=duty||place,koName=plain(record.Name),type=duty?{2:'dungeon',4:'trial',5:'raid'}[+duty.ContentType]:'field';
    if(!type)throw Error('Unexpected content type '+duty.ContentType);
    return {...common,type,location:koName,enemy:name,condition:notes.join(' · '),coordinates:point,level:duty?+duty.ClassJobLevelRequired:null,locationKey:(duty?'duty:':'place:')+record.id,link:dutyLinks.get(normalize(koName))||guideSearch(koName)};
  }
  const spells=api.results.map(s=>{
    const aoz=sheets.ko.AozAction.get(s.id),tr=sheets.ko.AozActionTransient.get(s.id),action=sheets.ko.Action.get(+aoz?.Action);
    if(!action?.Name||+tr?.Number!==s.order)throw Error('Korean spell number mismatch '+s.id);
    const stats=tr.Stats.replace(/\*\*/g,''),attack=stats.match(/공격 유형:\s*([^\n]+)/)?.[1],aspect=stats.match(/공격 속성:\s*([^\n]+)/)?.[1];
    if(!attack||!aspect)throw Error('Missing spell attributes '+s.order);
    return {id:s.order,collectId:s.id,actionId:+aoz.Action,name:plain(action.Name),original:s.name,rank:+aoz.Rank,patch:s.patch,type:attack,aspect,cast:+action.Cast100ms/10,recast:+action.Recast100ms/10,range:+action.Range,radius:+action.EffectRange,icon:s.icon,collect:'https://ffxivcollect.com/spells/'+s.id,sources:s.sources.flatMap(x=>sourceData(x,s))};
  }).sort((a,b)=>a.id-b.id);
  if(spells.some((s,i)=>s.id!==i+1||!s.sources.length||!/[가-힣]/.test(s.name)))throw Error('Incomplete numbered spellbook');
  const data={schemaVersion:1,updatedAt:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),count:spells.length,sourceCount:spells.reduce((n,s)=>n+s.sources.length,0),types,source:{collect:'https://ffxivcollect.com/api/spells',guide,korean:`https://github.com/Ra-Workspace/ffxiv-datamining-ko/tree/${revisions.ko}`,global:`https://github.com/xivapi/ffxiv-datamining/tree/${revisions.en}`},spells};
  await fs.writeFile(new URL('data.js',root),'// Generated public spell metadata. See README.md.\nwindow.BLUE_MAGE_DATA = '+JSON.stringify(data,null,2)+';\n');
  console.log(JSON.stringify({count:data.count,sources:data.sourceCount,locations:new Set(spells.flatMap(s=>s.sources.map(x=>x.locationKey))).size}));return data;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await update();
