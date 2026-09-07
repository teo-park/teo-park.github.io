// Node.js 20+. Public metadata only; no character data or account access.
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const root = new URL('../', import.meta.url);
const cache = new URL('../../.cache/triple-triad/', root);
const refreshing = process.argv.includes('--refresh');

export function parseCsv(text, selected = null) {
  const records = []; let header, indexes, row = [], field = '', quoted = false;
  const finish = () => {
    row.push(field); field = '';
    if (!header) { header = row.map(value => value.replace(/^\uFEFF/, '')); indexes = header.map((key,i) => [key,i]).filter(([key]) => !selected || selected.includes(key)); }
    else if (row.length > 1) records.push(Object.fromEntries(indexes.map(([key,i]) => [key,row[i] || ''])));
    row = [];
  };
  for (let i=0;i<text.length;i++) {
    const c=text[i];
    if (c==='"') { if(quoted && text[i+1]==='"'){field+='"';i++;} else quoted=!quoted; }
    else if(c===',' && !quoted){row.push(field);field='';}
    else if((c==='\n'||c==='\r') && !quoted){if(c==='\r'&&text[i+1]==='\n')i++;finish();}
    else field+=c;
  }
  if(quoted) throw new Error('Unterminated CSV field');
  if(field || row.length) finish();
  return records;
}
export const plain = value => String(value ?? '').replace(/<[^>]*>/g,'').replace(/&#(x[\da-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):+n)).replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const key = value => plain(value).normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
const escapeRE = value => value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

async function get(name,url) {
  const dest=new URL(name,cache);
  if(!refreshing)try{return await fs.readFile(dest,'utf8');}catch{}
  for(let attempt=0;attempt<3;attempt++)try{
    const response=await fetch(url,{signal:AbortSignal.timeout(60000),headers:{'User-Agent':'teo-ffxiv-card-data/1.0 (non-commercial collection tracker)'}});
    if(!response.ok)throw Error(`${response.status}: ${url}`);
    const content=await response.text();await fs.mkdir(cache,{recursive:true});await fs.writeFile(dest,content);return content;
  }catch(error){if(attempt===2)throw error;}
}
const json = async(name,url)=>JSON.parse(await get(name,url));
async function pool(values,fn,concurrency=3){let index=0;await Promise.all(Array.from({length:concurrency},async()=>{while(index<values.length)await fn(values[index++]);}));}
const rowsById = rows => new Map(rows.map(row=>[+row['#'],row]));

export function parseOfficialCards(html) {
  const body=html.split('<ul class="list_type">')[1]?.split('<div class="pagination">')[0];
  if(!body)throw Error('Korean guide list markup changed');
  return [...body.matchAll(/<a href="\/lodestone\/db\/item\/([a-f\d]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(([,id,row])=>({id,name:plain(row.match(/<cite class="name[^"\n]*">([\s\S]*?)<\/cite>/)?.[1]).replace(/^카드:\s*/,'')}));
}
async function officialCards(){
  const cards=[],seen=new Set();
  for(let page=1;page<=100;page++){
    const html=await get('guide-cards-'+page+'.html','https://guide.ff14.co.kr/lodestone/db/item?category2=7&category3=90&page='+page);
    const rows=parseOfficialCards(html);if(!rows.length)throw Error('Empty official card page '+page);
    for(const row of rows){if(seen.has(row.id))throw Error('Duplicate official card: '+row.id);seen.add(row.id);cards.push(row);}
    const pages=[...html.matchAll(/href="\/lodestone\/db\/item\?[^"\s]*?page=(\d+)"/g)].map(m=>+m[1]);
    if(!pages.some(p=>p>page))return cards;
  }
  throw Error('Official card pagination overflow');
}

export async function update(){
  const [apiCards,apiNpcs,apiPacks,koMeta,enMeta]=await Promise.all([
    json('cards.json','https://ffxivcollect.com/api/triad/cards'),json('npcs.json','https://ffxivcollect.com/api/triad/npcs'),json('packs.json','https://ffxivcollect.com/api/triad/packs'),
    json('ko-tree.json','https://api.github.com/repos/xivapi/ffxiv-datamining/contents/csv/ko'),json('datamining-head.json','https://api.github.com/repos/xivapi/ffxiv-datamining/commits/master')]);
  for(const data of [apiCards,apiNpcs,apiPacks])if(data.count!==data.results?.length)throw Error('Incomplete API response');
  if(apiCards.count<400||apiNpcs.count<100)throw Error('Unexpectedly small card catalog');
  const wanted={TripleTriadCard:['#','Name'],TripleTriadCardType:['#','Name'],TripleTriadCardResident:['#','Top','Right','Bottom','Left','TripleTriadCardRarity','TripleTriadCardType'],ENpcResident:['#','Singular'],PlaceName:['#','Name'],ContentFinderCondition:['#','Name'],Achievement:['#','Name','Description'],TripleTriadRule:['#','Name'],Quest:['#','Name'],Item:['#','Name'],Fate:['#','Name']};
  const sheets={ko:{},en:{}};
  const jobs=[...Object.keys(wanted).map(sheet=>['ko',sheet]),...['PlaceName','ENpcResident','Item','Fate'].map(sheet=>['en',sheet])];
  await pool(jobs,async([lang,sheet])=>{
    const url=lang==='ko'?`https://raw.githubusercontent.com/Ra-Workspace/ffxiv-datamining-ko/${koMeta.sha}/csv/${sheet}.csv`:`https://raw.githubusercontent.com/xivapi/ffxiv-datamining/${enMeta.sha}/csv/en/${sheet}.csv`;
    sheets[lang][sheet]=rowsById(parseCsv(await get(lang+'-'+sheet+'.csv',url),wanted[sheet]));
    console.log(`${lang}/${sheet}: ${sheets[lang][sheet].size}`);
  });
  const official=await officialCards();
  const officialByName=new Map(official.map(card=>[key(card.name),card]));
  const dictionary=new Map();
  for(const sheet of Object.keys(sheets.en))for(const [id,en]of sheets.en[sheet]){
    const ko=sheets.ko[sheet]?.get(id),enName=plain(en.Name||en.Singular),koName=plain(ko?.Name||ko?.Singular);
    if(enName.length>=3&&/[가-힣]/.test(koName))dictionary.set(enName,koName);
  }
  // Collect's duty label differs from the PlaceName sheet's English label.
  dictionary.set('The Forked Tower: Blood', plain(sheets.ko.PlaceName.get(4933)?.Name));
  const phrasePairs=[['Eureka Pagos/Pyros/Hydatos: Bunny Silver Coffer','에우레카 파고스·피로스·히다토스: 행운토끼 은 보물상자'],['Final Boss Chest','최종 보스 보물상자'],['Silver/Gold Sack','은빛·금빛 보물 자루'],['Silver Sack','은빛 보물 자루'],['Gold Sack','금빛 보물 자루'],['Triple Triad Tournament','트리플 트라이어드 대회'],['The Make It Rain Campaign (2025)','골드 소서 축제 (2025, 기간 한정)'],['Rank','단계'],['FATE','돌발임무']];
  const mixed = text => {
    let result=plain(text).replace(/\*/g,'');
    const entries=[...dictionary,...phrasePairs].filter(([en])=>result.toLowerCase().includes(en.toLowerCase())).sort((a,b)=>b[0].length-a[0].length);
    for(const [en,ko]of entries)result=result.replace(new RegExp('(?<![A-Za-z])'+escapeRE(en)+'(?:s)?(?![A-Za-z])','gi'),ko);
    return result;
  };
  const place = value => dictionary.get(value) || value || '';
  const guideSearch = value => 'https://guide.ff14.co.kr/lodestone/search?keyword='+encodeURIComponent(value);
  const dutySource=await fs.readFile(new URL('../../duty-finder/data.js',import.meta.url),'utf8').catch(()=>null);
  const duties=dutySource?JSON.parse(dutySource.slice(dutySource.indexOf('=')+1).trim().replace(/;$/,'')).duties:[];
  const packs=new Map(apiPacks.results.map(pack=>[pack.name,{id:pack.id,name:dictionary.get(pack.name)||mixed(pack.name),cost:pack.cost,link:pack.link}]));
  const npcMap=new Map(apiNpcs.results.map(npc=>{
    const name=plain(sheets.ko.ENpcResident.get(npc.resident_id)?.Singular)||npc.name;
    const quest=npc.quest?{name:plain(sheets.ko.Quest.get(npc.quest.id)?.Name)||npc.quest.name,original:npc.quest.name,link:npc.quest.link}:null;
    return [npc.id,{id:npc.id,residentId:npc.resident_id,name,original:npc.name,location:place(npc.location?.name),region:place(npc.location?.region),x:npc.location?.x||'',y:npc.location?.y||'',quest,ruleIds:npc.rule_ids,rules:npc.rule_ids.map((id,index)=>plain(sheets.ko.TripleTriadRule.get(id)?.Name)||npc.rules[index]),link:npc.link}];
  }));
  const typeNames={'NPC':'NPC 대결','Cosmic Exploration':'우주 개척','Raid':'레이드','Trial':'토벌전','Dungeon':'던전','Gold Saucer':'골드 소서','V&C Dungeon':'변형·파생 던전','Achievement':'업적','Tribal':'우호부족','Deep Dungeon':'딥 던전','Occult Crescent':'초승달 섬','Event':'기간 한정 이벤트','FATE':'돌발임무','Quest':'퀘스트','Hunts':'마물 사냥','Island Sanctuary':'무인도 개척','PvP':'PvP','Bozja':'보즈야','Skybuilders':'이슈가르드 부흥','Eureka':'에우레카'};
  const cards=apiCards.results.map(card=>{
    const koName=plain(sheets.ko.TripleTriadCard.get(card.id)?.Name),name=koName||card.name,official=officialByName.get(key(name.replace('(창천의 이슈가르드)','(창천)')));
    const resident=sheets.ko.TripleTriadCardResident.get(card.id);
    if(!resident||['top','right','bottom','left'].some(side=>+resident[side[0].toUpperCase()+side.slice(1)]!==card.stats.numeric[side])||+resident.TripleTriadCardRarity!==card.stars||+resident.TripleTriadCardType!==card.type.id)throw Error('Korean/global card stats differ: '+card.id);
    const sources=card.sources.map(source=>{
      if(!typeNames[source.type])throw Error('Unknown source type: '+source.type);
      const result={type:source.type,typeName:typeNames[source.type],group:'other',relatedType:source.related_type,relatedId:source.related_id,name:mixed(source.text),original:plain(source.text),method:'',location:'',link:card.link};
      if(source.related_type==='NPC'){
        const npc=npcMap.get(source.related_id);if(!npc)throw Error('Missing NPC '+source.related_id);
        Object.assign(result,{group:'npc',name:npc.name,method:'NPC와 카드 대결을 해 보상으로 획득',location:npc.location,region:npc.region,npc,link:npc.link});
      }else if(source.related_type==='Instance'){
        const name=plain(sheets.ko.ContentFinderCondition.get(source.related_id)?.Name)||plain(source.text).replace(/\*/g,'');
        const matched=duties.find(duty=>key(duty.name)===key(name));
        Object.assign(result,{group:'duty',name,method:'해당 임무의 보상으로 획득',link:matched?'https://guide.ff14.co.kr/lodestone/db/duty/'+matched.id:guideSearch(name),linkLabel:matched?'공식 임무 안내':'공식 가이드 검색'});
      }else if(source.related_type==='Achievement'){
        const achievement=sheets.ko.Achievement.get(source.related_id);
        Object.assign(result,{group:'achievement',name:plain(achievement?.Name)||source.text,method:plain(achievement?.Description)||'업적 달성 보상',link:guideSearch(plain(achievement?.Name)||source.text),linkLabel:'공식 가이드 검색'});
      }else if(source.related_type==='Quest'){
        const name=plain(sheets.ko.Quest.get(source.related_id)?.Name)||source.text;
        Object.assign(result,{group:'quest',name,method:'퀘스트 완료 보상',link:guideSearch(name),linkLabel:'공식 가이드 검색'});
      }else if(packs.has(source.text)){
        const pack=packs.get(source.text);
        Object.assign(result,{group:'pack',name:pack.name,method:'카드팩 개봉 시 무작위 획득',location:'골드 소서',pack,link:pack.link});
      }else if(source.type==='Gold Saucer'){
        Object.assign(result,{group:'exchange',method:/MGP/.test(source.text)?'골드 소서의 카드 교환원에게 MGP로 교환':'트리플 트라이어드 대회 보상',location:'골드 소서'});
      }else{
        const methods={'Cosmic Exploration':'우주 개척 교환 보상','Tribal':'우호부족 상점에서 교환 · 표시된 우호도 필요','Deep Dungeon':'딥 던전의 숨겨진 보물 감정 보상','Occult Crescent':'초승달 섬 보상 또는 교환','Event':'해당 기간 한정 이벤트 보상','FATE':'돌발임무 보상 또는 지역 교환원에게 교환','Hunts':'동맹 휘장으로 교환','Island Sanctuary':'무인도 개척 교환 보상','PvP':'늑대우리 부두에서 명예 점수로 교환','Bozja':'보즈야 클러스터로 교환','Skybuilders':'창천 거리에서 부흥용 화폐로 교환','Eureka':'해당 에우레카 돌발임무 보상'};
        result.method=methods[source.type]||'기재된 획득 조건을 충족하면 획득';
        if(['Cosmic Exploration','Tribal','Hunts','Island Sanctuary','PvP','Bozja','Skybuilders'].includes(source.type)||/Totem|Amulet|Gemstone/.test(source.text))result.group='exchange';
        if(source.type==='Trial'&&result.group==='exchange')result.method='기재된 토벌전 우상을 모아 교환';
      }
      return result;
    });
    return {id:card.id,number:card.number,order:card.order,deckOrder:card.deck_order,ex:card.order_group!==0,name,original:card.name,korean:!!koName,stars:card.stars,patch:card.patch,typeId:card.type.id,type:plain(sheets.ko.TripleTriadCardType.get(card.type.id)?.Name)||'일반',stats:card.stats.numeric,icon:card.icon,image:card.image,link:card.link,official:official?'https://guide.ff14.co.kr/lodestone/db/item/'+official.id:guideSearch('카드: '+name),officialExact:!!official,sources};
  }).sort((a,b)=>Number(a.ex)-Number(b.ex)||a.order-b.order);
  if(new Set(cards.map(c=>c.id)).size!==cards.length||cards.some(c=>!c.sources.length))throw Error('Invalid card catalog');
  const data={schemaVersion:1,updatedAt:new Date().toISOString().slice(0,10),count:cards.length,koreanCount:cards.filter(c=>c.korean).length,npcCount:npcMap.size,officialCount:cards.filter(c=>c.officialExact).length,source:{collect:'https://ffxivcollect.com/api',cards:'https://ffxivcollect.com/api/triad/cards',npcs:'https://ffxivcollect.com/api/triad/npcs',packs:'https://ffxivcollect.com/api/triad/packs',korean:`https://github.com/Ra-Workspace/ffxiv-datamining-ko/tree/${koMeta.sha}`,global:`https://github.com/xivapi/ffxiv-datamining/tree/${enMeta.sha}`,guide:'https://guide.ff14.co.kr/lodestone/db/item?category2=7&category3=90'},groups:[['npc','NPC 대결'],['duty','임무'],['exchange','교환'],['pack','카드팩'],['achievement','업적'],['quest','퀘스트'],['other','기타']],cards};
  data.rules=[...sheets.ko.TripleTriadRule].filter(([id])=>id>0).map(([id,row])=>({id,name:plain(row.Name)}));
  await fs.mkdir(root,{recursive:true});
  await fs.writeFile(new URL('data.js',root),'// Generated from public sources by scripts/update-data.mjs. See README.md.\nwindow.TRIPLE_TRIAD_DATA = '+JSON.stringify(data,null,2)+';\n');
  const unresolved=cards.flatMap(c=>c.sources.filter(s=>/[A-Za-z]{4}/.test(s.name.replace(/MGP|PvP|FATE/g,''))).map(s=>({card:c.name,type:s.type,name:s.name,original:s.original})));
  await fs.writeFile(new URL('translation-review.json',cache),JSON.stringify({missingCards:cards.filter(c=>!c.korean).map(c=>c.name),unresolved,officialUnmatched:cards.filter(c=>!c.officialExact).map(c=>c.name)},null,2));
  console.log(JSON.stringify({count:data.count,korean:data.koreanCount,official:data.officialCount,sources:cards.reduce((sum,c)=>sum+c.sources.length,0),review:unresolved.length}));
  return data;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await update();
