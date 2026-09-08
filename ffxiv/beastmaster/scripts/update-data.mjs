// Public game metadata only. No account or character collection access.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {parseCsv} from '../../triple-triad/scripts/update-data.mjs';

const root = new URL('../', import.meta.url);
const cache = new URL('../../.cache/beastmaster/', root);
export const revisions = {
  ko: {repo:'Ra-Workspace/ffxiv-datamining-ko', sha:'66eceba69eb2398958bdb133b241a69c13672b6c'},
  en: {repo:'xivapi/ffxiv-datamining', sha:'a67c23b00fe8cb254855d06b59845958b55d28f3'}
};
const patchNotes = 'https://www.ff14.co.kr/news/notice/view/2947';
const search = name => 'https://guide.ff14.co.kr/lodestone/search?keyword='+encodeURIComponent(name);
const sourceUrl = (lang,path) => `https://github.com/${revisions[lang].repo}/blob/${revisions[lang].sha}/${path}`;
export const icon = id => ({id, path:`ui/icon/${String(Math.floor(id/1000)*1000).padStart(6,'0')}/${String(id).padStart(6,'0')}.tex`,
  url:`https://v2.xivapi.com/api/asset?path=${encodeURIComponent(`ui/icon/${String(Math.floor(id/1000)*1000).padStart(6,'0')}/${String(id).padStart(6,'0')}.tex`)}&format=png`});
const requireValue = (value,message) => {if(!value)throw Error(message);return value;};
const integer = (v,label) => {const n=Number(v);if(v===''||v==null||!Number.isSafeInteger(n))throw Error(`Invalid integer ${label}: ${v}`);return n;};

// The Korean dump has numeric physical columns plus two metadata rows.
// The global dump has one header in schema order. Never join by column position across languages.
export function table(text,lang,fields=null) {
  const selected=lang==='ko'&&fields?['key',...Object.entries(parseCsv(text.split('\n',2).join('\n'))[0])
    .filter(([,name])=>fields.includes(name)).map(([column])=>column)]:fields;
  const parsed = parseCsv(text,selected);
  if(lang==='en')return {rows:new Map(parsed.map(r=>[integer(r['#'],'row'),r])),raw:null};
  const [header,types,...raw] = parsed;
  requireValue(header?.key==='#' && types?.key==='int32','Unexpected Korean EXD format');
  const keys=Object.keys(header).filter(k=>k!=='key'&&header[k]);
  return {raw:new Map(raw.map(r=>[integer(r.key,'row'),r])),rows:new Map(raw.map(r=>[integer(r.key,'row'),{
    '#':r.key,...Object.fromEntries(keys.map(k=>[header[k],r[k]]))
  }]))};
}

export function tooltip(raw='') {
  const text=raw.replace(/<(UIForeground|UIGlow)>[\s\S]*?<\/\1>/g,'')
    .replace(/<13>[\s\S]*?<\/13>/g,'').replace(/<[^>]*>/g,'').replace(/\r\n/g,'\n').trim();
  // The source can contain player-level branches. Keep the original, and flag
  // the stripped text as a preview instead of presenting it as resolved effects.
  return {text,raw,hasConditions:/<If\b|<Else\b|<Switch\b|<Sheet\b|<Highlight\b/.test(raw)};
}

export function build(sheets) {
  const ko=sheets.ko,en=sheets.en,lookup=(sheet,id)=>requireValue(ko[sheet].rows.get(id),`Missing ${sheet} ${id}`);
  const beasts=[];
  for(const [id,r] of ko.XBMPet.raw) {
    if(id===0)continue;
    const original=requireValue(en.XBMPet.rows.get(id),`Missing global beast ${id}`);
    const petId=integer(r['0'],'pet'),pet=lookup('Pet',petId),rawPet=ko.Pet.raw.get(petId);
    const name=requireValue(pet.Name,`Empty pet name ${id}`);
    const iconId=integer(r['4'],'icon'),locationType=integer(r['6'],'location type'),locationId=integer(r['7'],'location');
    const checks={Pet:petId,Unknown3:iconId,Action:integer(r['5'],'action'),Location:locationId,LocationKey:locationType};
    for(const [field,value] of Object.entries(checks))if(integer(original[field],field)!==value)throw Error(`Korean/global join mismatch ${id} ${field}`);
    requireValue([0,1,2].includes(locationType),`Unknown location kind ${locationType}`);
    const locationSheet={1:'PlaceName',2:'ContentFinderCondition'}[locationType];
    const place=locationSheet?lookup(locationSheet,locationId):null;
    const location=place?{type:locationType===1?'field':'duty',id:locationId,name:requireValue(place.Name,'Missing location name'),
      source:{sheet:locationSheet,id:locationId},official:search(place.Name),coordinates:null,
      note:'마수도감의 주요 출현 지역입니다. 해당 장소의 모든 개체가 포획 가능하다는 뜻은 아닙니다.'}:null;
    const actions=[0,1,2,3].map(slot=>({slot,actionId:integer(rawPet[String(slot+1)],'pet action')}));
    for(const a of actions)requireValue(lookup('Action',a.actionId).Name,`Unnamed player pet action ${a.actionId}`);
    const englishName=requireValue(en.Pet.rows.get(petId)?.Name,'Missing English name');
    beasts.push({id,petId,name,englishName,icon:icon(iconId),description:tooltip(r['8']).text,
      combatHints:{instinctual:tooltip(r['9']).text,release:tooltip(r['10']).text},locationHint:location,
      acquisition:location?[{type:'capture',location,enemyNames:null,captureDifficulty:null,successRate:null,
        note:'대상 개체와 난이도는 게임의 파악하기로 확인해야 합니다.'}]:[],actions,
      sourceRows:{XBMPet:id,Pet:petId},official:search(name),
      unmapped:{relatedActionId:integer(r['5'],'related action'),columns:Object.fromEntries([
        '1','2','3',...Array.from({length:16},(_,i)=>String(i+11))
      ].map(k=>[k,r[k]]))}});
  }
  beasts.sort((a,b)=>a.id-b.id);
  requireValue(beasts.length===50 && beasts.every((b,i)=>b.id===i+1),'Unexpected 7.56 catalog size/IDs');
  requireValue(en.XBMPet.rows.size===beasts.length+1,'Global catalog has different size');
  const beastById=new Map(beasts.map(b=>[b.id,b])),items=[];
  const quest = id => {
    const q=lookup('Quest',id);
    return {id,name:requireValue(q.Name,'Missing quest name'),level:integer(q['ClassJobLevel[0]'],'quest level'),official:search(q.Name)};
  };
  for(const [id,row] of ko.Item.rows) {
    if(!row.Name?.startsWith('코르나고 항아리:'))continue;
    const effect=lookup('ItemAction',integer(row.ItemAction,'item action'));
    requireValue(effect.Type==='50454','Unexpected familiar unlock item action');
    const beastId=integer(effect['Data[0]'],'unlocked beast'),beast=requireValue(beastById.get(beastId),'Item unlock points outside catalog');
    requireValue(row.Name===`코르나고 항아리: ${beast.name}`,`Item/beast name mismatch ${id}`);
    const sources=[];
    for(const [shopId,shop] of ko.SpecialShop.rows)for(let slot=0;slot<60;slot++) {
      if(Number(shop[`Item{Receive}[${slot}][0]`])!==id)continue;
      // Both beast-core shops encode costs as actual item IDs (currency type 2).
      requireValue(shop.UseCurrencyType==='2','Unexpected shop currency mapping');
      const costs=[];
      for(let i=0;i<3;i++) {
        const costId=integer(shop[`Item{Cost}[${slot}][${i}]`],'cost item'),count=integer(shop[`Count{Cost}[${slot}][${i}]`],'cost count');
        if(costId && count)costs.push({id:costId,name:requireValue(lookup('Item',costId).Name,'Cost item name'),count});
      }
      requireValue(costs.length,'Empty item cost');
      const gates=[...new Set([Number(shop['Quest{Unlock}']),Number(shop[`Quest{Item}[${slot}]`])].filter(Boolean))];
      sources.push({type:'exchange',shopId,shopName:shop.Name,slot,
        receiveCount:integer(shop[`Count{Receive}[${slot}][0]`],'received amount'),costs,
        prerequisiteQuests:gates.map(quest),merchant:'코르나고파 상인',
        location:{name:'검은장막 숲 중부삼림',coordinates:{x:21.9,y:22.6},source:patchNotes},
        source:{sheet:'SpecialShop',id:shopId}});
    }
    if(beastId===1) {
      const dialog=ko.JobXbm001_05490.raw.get(147);
      requireValue(dialog?.['0']==='TEXT_JOBXBM001_05490_SYSTEM_100_119' && dialog['1'].includes('<Sheet(Item,49805,0)/>') && dialog['1'].includes('받았습니다'), 'Starter item quest evidence changed');
      sources.push({type:'quest',quest:quest(71026),note:'잡 개방 퀘스트 진행 중 받은 항아리를 마수조련사로 사용합니다. 퀘스트 완료 보상 칸이 아닌 진행 중 지급입니다.',
        source:{sheet:'quest/054/JobXbm001_05490',id:147}});
    }
    requireValue(sources.length,`No origin found for unlock item ${id}`);
    items.push({id,beastId,name:row.Name,description:tooltip(row.Description).text,icon:icon(integer(row.Icon,'item icon')),
      itemActionId:Number(row.ItemAction),official:search(row.Name),sources});
    beast.acquisition.push({type:'item',itemId:id,note:'항아리를 사용하면 해당 마수와 계약합니다. 필드 포획의 대체 획득 경로입니다.'});
  }
  requireValue(items.length===16,'Unexpected number of unlock items');
  const actionIds=[...new Set(beasts.flatMap(b=>b.actions.map(a=>a.actionId)))].sort((a,b)=>a-b);
  for(const [id,r] of ko.Action.rows)if(r.ClassJob==='43' && r.Name)actionIds.push(id);
  const actions=Object.fromEntries([...new Set(actionIds)].sort((a,b)=>a-b).map(id=>{
    const a=lookup('Action',id),help=ko.ActionTransient.rows.get(id)?.Description||'';
    return [id,{id,name:a.Name,icon:icon(integer(a.Icon,'action icon')),classJobId:Number(a.ClassJob),level:Number(a.ClassJobLevel),
      tooltip:tooltip(help),source:{sheet:'Action',id}}];
  }));
  const missingCaptureDetails=beasts.filter(b=>b.locationHint).map(b=>b.id);
  const coverage={count:beasts.length,koreanNames:beasts.filter(b=>/[가-힣]/.test(b.name)).length,
    englishNames:beasts.filter(b=>b.englishName).length,iconReferences:beasts.length,descriptions:beasts.filter(b=>b.description).length,
    fieldHints:beasts.filter(b=>b.locationHint?.type==='field').length,dutyHints:beasts.filter(b=>b.locationHint?.type==='duty').length,
    starterQuest:1,unlockItems:items.length,exchangeItems:items.filter(i=>i.sources.some(s=>s.type==='exchange')).length,
    linkedActions:Object.keys(actions).length,exactCaptureCoordinates:0,exactCaptureDifficulty:0,
    needsCaptureDetail:missingCaptureDetails,uninterpretedColumns:[1,2,3,...Array.from({length:16},(_,i)=>i+11)]};
  return {schemaVersion:1,patch:'7.56',locale:'ko-KR',snapshotStatus:'initial-extraction',
    revisions,source:{korean:sourceUrl('ko','csv/XBMPet.csv'),global:sourceUrl('en','csv/en/XBMPet.csv'),patchNotes},
    count:beasts.length,coverage,beasts,items,actions,
    captureRules:{assessmentActionId:44882,captureActionId:44880,source:patchNotes},
    limitations:[
      '원본 7.56 XBMPet의 ID 1~50을 사용합니다. 게임 화면의 정렬·페이지 배치는 아직 실물과 대조하지 않았습니다.',
      '주요 출현 지역은 도감 힌트이며, 모든 포획 대상 개체·정확한 좌표·난이도·확률은 포함하지 않습니다.',
      '의미가 확인되지 않은 분류·능력치 열은 unmapped에 원본 값으로 보존합니다. 포획 레벨이나 난이도로 추정하지 않습니다.',
      '기술 tooltip.text는 원문 미리보기입니다. hasConditions가 true인 기술은 캐릭터 레벨 등의 조건을 적용하지 않았으므로 확정 효과로 사용하지 마세요.',
      '아이콘은 게임 리소스 ID와 XIVAPI URL 참조입니다. 이미지 파일을 복제하지 않으며 신규 아이콘 서버 반영은 별도 확인이 필요합니다.'
    ],rights:'무료·비영리 팬 도구용 게임 메타데이터. © SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.'};
}

export async function update({refresh=false}={}) {
  const files=[];
  const fields={Action:['Name','Icon','ClassJob','ClassJobLevel'],ActionTransient:['Description'],
    Item:['Name','Description','Icon','ItemAction'],ItemAction:['Type','Data[0]'],Quest:['Name','ClassJobLevel[0]']};
  async function get(lang,path,baseName) {
    const {repo,sha}=revisions[lang],name=`${lang}-${baseName}.csv`,dest=new URL(`${sha}/${name}`,cache);
    let text;
    if(!refresh)try{text=await fs.readFile(dest,'utf8');}catch{}
    if(text===undefined) {
      const response=await fetch(`https://raw.githubusercontent.com/${repo}/${sha}/${path}`,{signal:AbortSignal.timeout(60000)});
      if(!response.ok)throw Error(`${response.status}: ${path}`);
      text=await response.text();await fs.mkdir(new URL(`${sha}/`,cache),{recursive:true});await fs.writeFile(dest,text);
    }
    files.push({language:lang,path,revision:sha,url:sourceUrl(lang,path),sha256:createHash('sha256').update(text).digest('hex')});
    return table(text,lang,fields[baseName]||null);
  }
  const specs={ko:['XBMPet','Pet','PlaceName','ContentFinderCondition','Action','ActionTransient','Item','ItemAction','SpecialShop','Quest'],en:['XBMPet','Pet']};
  const sheets={ko:{},en:{}};
  // Bound concurrent downloads to avoid hammering the public source.
  const jobs=Object.entries(specs).flatMap(([lang,list])=>list.map(name=>({lang,name,path:lang==='ko'?`csv/${name}.csv`:`csv/en/${name}.csv`})));
  jobs.push({lang:'ko',name:'JobXbm001_05490',path:'csv/quest/054/JobXbm001_05490.csv'});
  let cursor=0;
  await Promise.all(Array.from({length:3},async()=>{while(cursor<jobs.length){const j=jobs[cursor++];sheets[j.lang][j.name]=await get(j.lang,j.path,j.name);}}));
  const data=build(sheets);
  await fs.mkdir(root,{recursive:true});
  await fs.writeFile(new URL('data.json',root),JSON.stringify(data,null,2)+'\n');
  await fs.writeFile(new URL('sources.lock.json',root),JSON.stringify({patch:'7.56',revisions,files:files.sort((a,b)=>(a.language+a.path).localeCompare(b.language+b.path))},null,2)+'\n');
  await fs.writeFile(new URL('catalog.md',root),catalog(data));
  console.log(JSON.stringify(data.coverage));
  return data;
}

export function catalog(data) {
  const itemById=new Map(data.items.map(i=>[i.id,i]));
  const lines=['# 마수도감 데이터 목록','','패치 7.56 · 50종 · 수집 UI 제작 전 데이터 확인용 목록입니다. 번호는 XBMPet ID이며 게임 화면 정렬은 별도 확인이 필요합니다.','','장소는 도감의 주요 출현 지역입니다. 개별 포획 대상·좌표·난이도는 아직 연결하지 않았습니다.','','| ID | 마수 | 주요 출현 지역 | 항아리 획득 |','| --- | --- | --- | --- |'];
  for(const b of data.beasts) {
    const item=b.acquisition.find(a=>a.type==='item');
    const methods=item?itemById.get(item.itemId).sources.map(s=>s.type==='quest'?`「${s.quest.name}」 진행 중 지급`:s.costs.map(c=>`${c.name} ${c.count}개`).join(' + ')+` · 선행: ${s.prerequisiteQuests.map(q=>'「'+q.name+'」').join(', ')}`).join(' / '):'—';
    lines.push(`| ${b.id} | ${b.name} | ${b.locationHint?(b.locationHint.type==='field'?'필드':'임무')+' · '+b.locationHint.name:'개방 퀘스트'} | ${methods} |`);
  }
  lines.push('','출처·범위·갱신 방법은 [README](./README.md), 프로그램용 데이터는 [data.json](./data.json)을 참고하세요.','');
  return lines.join('\n');
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)await update({refresh:process.argv.includes('--refresh')});
