// Public catalog metadata only. No character lookup or account access.
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {parseCsv, plain, parseOfficialCards} from '../../triple-triad/scripts/update-data.mjs';

const root=new URL('../',import.meta.url), cache=new URL('../../.cache/minions/',root);
const cardCache=new URL('../../.cache/triple-triad/',root);
const refresh=process.argv.includes('--refresh');
const key=value=>plain(value).normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
const escapeRE=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
async function get(name,url,reuseCard=false){
  if(!refresh){
    try{return await fs.readFile(new URL(name,cache),'utf8');}catch{}
    if(reuseCard)try{return await fs.readFile(new URL(name,cardCache),'utf8');}catch{}
  }
  const response=await fetch(url,{signal:AbortSignal.timeout(60000)});
  if(!response.ok)throw Error(`${response.status}: ${url}`);
  const text=await response.text();await fs.mkdir(cache,{recursive:true});await fs.writeFile(new URL(name,cache),text);return text;
}
const json=async(...args)=>JSON.parse(await get(...args));
const byId=rows=>new Map(rows.map(row=>[+row['#'],row]));
const guideSearch=name=>'https://guide.ff14.co.kr/lodestone/search?keyword='+encodeURIComponent(name);
export const typeNames={'Gold Saucer':'골드 소서','Occult Crescent':'초승달 섬','Quest':'퀘스트','Event':'기간 한정 이벤트','Premium':'유료 상품','Cosmic Exploration':'우주 개척','Raid':'레이드','PvP':'PvP','Gathering':'채집','Dungeon':'던전','V&C Dungeon':'변형·파생 던전','Trial':'토벌전','Deep Dungeon':'딥 던전','Tribal':'우호부족','Treasure Hunt':'보물찾기','Wondrous Tails':'쿠로의 공상수첩','Chaotic Raid':'혼돈 레이드','Voyages':'비공정·잠수함 탐사','Venture':'집사 수행','Hunts':'마물 사냥','FATE':'돌발임무','Island Sanctuary':'무인도 개척','Crafting':'제작','Achievement':'업적','Bozja':'보즈야','Skybuilders':'이슈가르드 부흥','Other':'기타','Eureka':'에우레카','Purchase':'상점 구입'};
const phrases=[
  ['Online Store (China Only)','글로벌 온라인 상점 (중국 한정)'],['Online Store','글로벌 온라인 상점'],['Korea Only','한국 한정'],['China Only','중국 한정'],['A Realm Reborn','신생 에오르제아'],['Heavensward','창천의 이슈가르드'],['Stormblood','홍련의 해방자'],['Shadowbringers','칠흑의 반역자'],['Endwalker','효월의 종언'],['Dawntrail','황금의 유산'],['Pre-order','예약 구매 특전'],['Fan Festival','팬 페스티벌'],['Digital','디지털'],['Collaboration','협업 이벤트'],['Plushie','인형 상품'],
  ['Item code included with','동봉 아이템 코드:'],['Original Soundtrack','오리지널 사운드트랙'],['Artbook','설정화집'],['Collector\'s Edition','콜렉터즈 에디션'],['Pre-order Bonus','예약 구매 특전'],['Bonus','특전'],
  ['The Rising','신생제'],['Heavensturn','강신제'],["All Saints' Wake",'수호천절'],['Starlight Celebration','별빛축제'],['Moonfire Faire','불꽃축제'],['Little Ladies\' Day','프린세스데이'],['Valentione\'s Day','발렌티온데이'],['Hatching-tide','알축제'],['The Make It Rain Campaign','골드 소서 축제'],
  ['Final Boss Chest','최종 보스 보물상자'],['Pot/Bunny Coffer','항아리·행운토끼 보물상자'],['Bronze/Silver Coffer','동·은 보물상자'],['Bronze Coffer','동 보물상자'],['Silver Coffer','은 보물상자'],['Gold Coffer','금 보물상자'],['Silver/Gold Sack','은빛·금빛 보물 자루'],['Gold/Platinum Sack','금빛·백금빛 보물 자루'],['Iron/Silver/Gold Sack','철·은·금빛 보물 자루'],['Bronze/Silver Sack','동·은빛 보물 자루'],['Bronze Sack','동빛 보물 자루'],['Silver Sack','은빛 보물 자루'],['Gold Sack','금빛 보물 자루'],['Any Sack','보물 자루'],['Accursed Hoard','숨겨진 보물'],['Bronze/Silver Ancient Record','동·은빛 고대 기록'],['Bronze/Silver Voyagers\' Record','동·은빛 항해 기록'],['Bronze Ancient Record','동빛 고대 기록'],['Bronze Voyagers\' Record','동빛 항해 기록'],
  ['Highland Exploration','고원 탐색'],['Woodland Exploration','삼림 탐색'],['Waterside Exploration','물가 탐색'],['Field Exploration','평지 탐색'],['Quick Exploration','집사 자유 탐색'],['Subaquatic Voyages','잠수함 탐사'],['Airship Voyages','비공정 탐사'],
  ['Crafted by Carpenter','목수 제작'],['Crafted by Blacksmith','대장장이 제작'],['Crafted by Armorer','갑주제작사 제작'],['Crafted by Goldsmith','보석공예가 제작'],['Crafted by Leatherworker','가죽공예가 제작'],['Crafted by Weaver','재봉사 제작'],['Crafted by Alchemist','연금술사 제작'],['Crafted by Culinarian','요리사 제작'],
  ['Gathered by Fisher','어부 채집'],['Gathered by Botanist','원예가 채집'],['Gathered by Miner','광부 채집'],['Gardening','재배'],['Desynthesize a','분해 대상:'],['PvP Series','PvP 시리즈'],['Level','레벨'],['Random Drop','무작위 보상'],['Requires Quest','선행 퀘스트'],['Requires FATE','선행 돌발임무'],['Requires','조건:'],['Cosmic Fortune','우주 복권'],['Attend a Ceremony of Eternal Bonding (Gold/Platinum)','영원한 언약식 참석 (골드·플래티넘 플랜)'],['only available during the','획득 기간:'],['event','이벤트'],
  ['Minion Trader','꼬마친구 판매원'],['Any Grand Company Headquarters','각 총사령부'],['Storm Quartermaster','흑와단 보급 담당관'],['Serpent Quartermaster','쌍사당 보급 담당관'],['Flame Quartermaster','불멸대 보급 담당관'],['Storm Seals','흑와단 군표'],['Serpent Seals','쌍사당 군표'],['Flame Seals','불멸대 군표'],['Gil','길'],
  ['Rank','등급'],['Allied','맹우'],['Bloodsworn','서약'],['Sworn','맹약'],['Honored','경의'],['Respected','존경'],['Trusted','신뢰'],['Friendly','우호'],['Recognized','인정'],['Neutral','중립'],['FATE','돌발임무'],['Achievement Certificates','업적 교환권'],['Achievement Certificate','업적 교환권'],['Faux Leaves','환상잎'],['Wolf Marks','명예 점수'],['Allied Seals','동맹 휘장'],['Centurio Seals','센추리오 휘장'],['Sacks of Nuts','마물 사냥 전리품'],['Bicolor Gemstones','두 빛깔 보석'],['Skybuilders\' Scrips','창천 거리 진흥권'],['Seafarer\'s Cowries','청선화'],['Island Rank','무인도 개척 등급'],['Skywatcher','기상 예보사']
];

export async function update(){
  const [api,koMeta,enMeta]=await Promise.all([
    json('minions.json','https://ffxivcollect.com/api/minions'),
    json('ko-tree.json','https://api.github.com/repos/xivapi/ffxiv-datamining/contents/csv/ko',true),
    json('datamining-head.json','https://api.github.com/repos/xivapi/ffxiv-datamining/commits/master',true)
  ]);
  if(api.count!==api.results?.length||api.count<500)throw Error('Incomplete minion catalog');
  const sheets={ko:{},en:{}};
  const wanted={Companion:['#','Singular','Order','Icon'],Item:['#','Name'],PlaceName:['#','Name'],ENpcResident:['#','Singular'],Fate:['#','Name'],Quest:['#','Name'],ContentFinderCondition:['#','Name'],Achievement:['#','Name','Description']};
  for(const lang of ['ko','en'])for(const sheet of Object.keys(wanted)){
    if(lang==='en'&&!['Item','PlaceName','ENpcResident','Fate','Quest','ContentFinderCondition'].includes(sheet))continue;
    const url=lang==='ko'?`https://raw.githubusercontent.com/Ra-Workspace/ffxiv-datamining-ko/${koMeta.sha}/csv/${sheet}.csv`:`https://raw.githubusercontent.com/xivapi/ffxiv-datamining/${enMeta.sha}/csv/en/${sheet}.csv`;
    sheets[lang][sheet]=byId(parseCsv(await get(lang+'-'+sheet+'.csv',url,true),wanted[sheet]));
  }
  const official=[],seen=new Set();
  for(let page=1;page<=100;page++){
    const html=await get(`guide-minions-85-${page}.html`,`https://guide.ff14.co.kr/lodestone/db/item?category2=7&category3=85&page=${page}`);
    if(!html.includes('&gt; 꼬마 친구'))throw Error('Korean guide category changed');
    const rows=parseOfficialCards(html);if(!rows.length)throw Error('Empty Korean guide page '+page);
    for(const row of rows){if(seen.has(row.id))throw Error('Repeated official page');seen.add(row.id);official.push(row);}
    const pages=[...html.matchAll(/href="\/lodestone\/db\/item\?[^"\s]*?page=(\d+)"/g)].map(m=>+m[1]);
    if(!pages.some(p=>p>page))break;
    if(page===100)throw Error('Korean guide pagination overflow');
  }
  const officialByName=new Map(official.map(row=>[key(row.name),row]));
  const dictionary=new Map();
  for(const sheet of Object.keys(sheets.en))for(const [id,en]of sheets.en[sheet]){
    const ko=sheets.ko[sheet].get(id),original=plain(en.Name||en.Singular),name=plain(ko?.Name||ko?.Singular);
    if(original.length>=3&&/[가-힣]/.test(name))dictionary.set(original,name);
  }
  const translate=value=>{
    let text=plain(value).replace(/\*/g,'');
    const entries=[...dictionary,...phrases].filter(([en])=>text.toLowerCase().includes(en.toLowerCase())).sort((a,b)=>b[0].length-a[0].length);
    for(const [en,ko]of entries)text=text.replace(new RegExp('(?<![A-Za-z])'+escapeRE(en)+'(?![A-Za-z])','gi'),ko);
    return text;
  };
  const minions=api.results.map(m=>{
    const ko=sheets.ko.Companion.get(m.id),name=plain(ko?.Singular),itemName=plain(sheets.ko.Item.get(m.item_id)?.Name);
    if(!name)throw Error('Missing Korean minion name: '+m.id);
    const exact=officialByName.get(key(itemName))||officialByName.get(key(name));
    const sources=m.sources.map(s=>{
      if(!typeNames[s.type])throw Error('Unknown source type: '+s.type);
      const result={type:s.type,typeName:typeNames[s.type],name:translate(s.text),original:plain(s.text),condition:'',link:guideSearch(name),linkLabel:'공식 가이드 검색'};
      const sheet={Instance:'ContentFinderCondition',Quest:'Quest',Achievement:'Achievement'}[s.related_type];
      if(s.related_type&&!sheet)throw Error('Unknown related source: '+s.related_type);
      if(sheet){
        const record=sheets.ko[sheet].get(s.related_id);
        if(record?.Name){result.name=plain(record.Name);result.link=guideSearch(result.name);}
        if(sheet==='Achievement')result.condition=plain(record?.Description);
        if(sheet==='Quest')result.condition='해당 퀘스트의 완료 보상';
        if(sheet==='ContentFinderCondition')result.condition='해당 임무에서 획득 · 드롭 확률은 공개 자료에 없음';
      }
      return result;
    });
    return {id:m.id,itemId:m.item_id,name,original:m.name,order:+ko.Order,patch:m.patch,tradeable:m.tradeable,icon:m.icon,image:m.image,official:exact?'https://guide.ff14.co.kr/lodestone/db/item/'+exact.id:guideSearch(itemName||name),officialExact:!!exact,collect:'https://ffxivcollect.com/minions/'+m.id,sources};
  }).sort((a,b)=>a.order-b.order||a.id-b.id);
  if(new Set(minions.map(m=>m.id)).size!==api.count)throw Error('Duplicate minion IDs');
  const data={schemaVersion:1,updatedAt:new Date().toISOString().slice(0,10),count:minions.length,officialCount:minions.filter(m=>m.officialExact).length,sourceCount:minions.reduce((n,m)=>n+m.sources.length,0),source:{collect:'https://ffxivcollect.com/api/minions',korean:`https://github.com/Ra-Workspace/ffxiv-datamining-ko/tree/${koMeta.sha}`,global:`https://github.com/xivapi/ffxiv-datamining/tree/${enMeta.sha}`,guide:'https://guide.ff14.co.kr/lodestone/db/item?category2=7&category3=85'},types:Object.entries(typeNames),minions};
  if(data.officialCount<500)throw Error('Too few Korean guide matches: '+data.officialCount);
  await fs.mkdir(root,{recursive:true});
  await fs.writeFile(new URL('data.js',root),'// Generated public metadata. See README.md.\nwindow.MINION_DATA = '+JSON.stringify(data,null,2)+';\n');
  const review={unmatchedOfficial:minions.filter(m=>!m.officialExact).map(m=>({id:m.id,name:m.name})),unknownSources:minions.filter(m=>!m.sources.length).map(m=>m.name),untranslated:minions.flatMap(m=>m.sources.filter(s=>/[A-Za-z]{4}/.test(s.name.replace(/MGP|MGC|PvP/g,''))).map(s=>({minion:m.name,name:s.name,original:s.original})))};
  await fs.writeFile(new URL('translation-review.json',cache),JSON.stringify(review,null,2));
  console.log(JSON.stringify({count:data.count,official:data.officialCount,sources:data.sourceCount,untranslated:review.untranslated.length,unknown:review.unknownSources}));
  return data;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await update();
