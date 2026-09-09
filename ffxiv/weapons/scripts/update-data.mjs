// Item IDs are public game facts, cross-checked against FFXIV Collect's catalog.
// Display, progress tracking and storage are implemented independently.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {table,revisions,icon} from '../../beastmaster/scripts/update-data.mjs';
const root=new URL('../',import.meta.url),cache=new URL('../../../.cache/weapons/',import.meta.url);
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const guide='https://guide.ff14.co.kr/lodestone/playguide/view/144';
const official=name=>'https://guide.ff14.co.kr/lodestone/search?keyword='+encodeURIComponent(name);
const jobs=[['PLD','나이트','tank'],['WAR','전사','tank'],['DRK','암흑기사','tank'],['GNB','건브레이커','tank'],['WHM','백마도사','healer'],['SCH','학자','healer'],['AST','점성술사','healer'],['SGE','현자','healer'],['MNK','몽크','melee'],['DRG','용기사','melee'],['NIN','닌자','melee'],['SAM','사무라이','melee'],['RPR','리퍼','melee'],['VPR','바이퍼','melee'],['BRD','음유시인','ranged'],['MCH','기공사','ranged'],['DNC','무도가','ranged'],['BLM','흑마도사','caster'],['SMN','소환사','caster'],['RDM','적마도사','caster'],['PCT','픽토맨서','caster'],['BLU','청마도사','limited']].map(([id,name,role])=>({id,name,role}));
const definitions=[
 {id:'zodiac',name:'고대의 무기 · 조디악 웨폰',short:'조디악',expansion:'신생',kind:'relic',level:50,
  labels:['고대의 무기','제니스','아트마','아니무스','노우스','넥서스','조디악','제타'],
  groups:[[1675,1746,1816,1885,1955,2052,2140,2213,2214,7888,2306],[...range(6257,6266),9250],[...range(7824,7833),9251],[...range(7834,7843),9252],[...range(7863,7872),9253],[...range(8649,8658),9254],[...range(9491,9501)],[...range(10054,10064)]],
  acquisition:'북부삼림의 게롤트에게서 고대의 무기 퀘스트를 시작합니다. 이후 잘잔과 강화 퀘스트를 진행합니다.',source:guide},
 {id:'anima',name:'아니마 웨폰',short:'아니마',expansion:'창천',kind:'relic',level:60,
  labels:['아니마','각성','기본형 완성','초전도','재창조','벼려진 무기','최종 형태','룩스'],
  groups:[[13611,13624],[13597,13610],[13223,13236],[14870,14883],[15223,15236],[15237,15250],[15251,15264],[16050,16063]].map(([a,b])=>range(a,b)),
  acquisition:'이딜샤이어의 로웨나에게서 「이름하여 아니마 웨폰」을 시작합니다. 아지스 라의 아르다시르에게서 강화를 이어갑니다.',source:guide},
 {id:'eureka',name:'에우레카 웨폰',short:'에우레카',expansion:'홍련',kind:'relic',level:70,
  labels:['복원','복원 +1','복원 +2','아네모스','파고스','파고스 +1','엘리멘탈','엘리멘탈 +1','엘리멘탈 +2','피로스','히다토스','히다토스 +1','최종 형태','에우레카','맞춤형'],
  groups:[21942,21958,21974,21990,22925,22941,22957,24039,24055,24071,24643,24659,24675,24691,24707].map(a=>range(a,a+15)),
  acquisition:'금단의 땅 에우레카에서 70레벨 잡 무기를 복원·강화합니다. 아네모스 → 파고스 → 피로스 → 히다토스 순서이며, 맞춤형은 발데시온 무기고의 재료가 필요합니다.',source:guide},
 {id:'resistance',name:'레지스탕스 웨폰',short:'레지스탕스',expansion:'칠흑',kind:'relic',level:80,
  labels:['기본형','보강','기억','법령','보강된 법령','최종 형태'],groups:[30228,30767,30785,32651,32669,33462].map(a=>range(a,a+17)),
  acquisition:'강고스에서 세이브 더 퀸 관련 퀘스트와 무기 강화를 진행합니다. 일부 공정은 캐릭터당 한 번만 진행하는 선행 퀘스트를 요구합니다.',source:guide},
 {id:'manderville',name:'맨더빌 웨폰',short:'맨더빌',expansion:'효월',kind:'relic',level:90,
  labels:['맨더빌','훌륭한 맨더빌','당당한 맨더빌','맨더빌한 무기'],groups:[38400,39144,39920,40932].map(a=>range(a,a+19)),
  acquisition:'힐디브랜드 퀘스트를 진행한 뒤 라자한에서 「맨더빌 가문과 고대의 무기」를 시작합니다.',source:guide},
 {id:'phantom',name:'팬텀 웨폰',short:'팬텀',expansion:'황금',kind:'relic',level:100,
  labels:['반그림자','그림자','어둠그림자','달그림자','숨은그림자'],groups:[47869,47006,50032,50978,51000].map(a=>range(a,a+21)),
  acquisition:'신기루 마을의 리디르세일에게서 「신기루에 싸인 무기」를 시작합니다. 초승달 섬과 관련 강화 퀘스트를 진행합니다.',source:guide},
 ...[
  ['ucob','절 바하무트 토벌전','홍련',70,20959,20974,'에쉬나 · 랄거의 손길'],
  ['uwu','절 알테마 웨폰 파괴작전','홍련',70,22868,22883,'에쉬나 · 랄거의 손길'],
  ['tea','절 알렉산더 토벌전','칠흑',80,28289,28306,'베르타나 · 이딜샤이어'],
  ['dsr','절 용시전쟁','효월',90,36943,36962,'네즈바즈 · 라자한'],
  ['top','절 오메가 검증전','효월',90,39164,39183,'네즈바즈 · 라자한'],
  ['fru','절 또 하나의 미래','황금',100,44721,44742,'와흐셰파 · 솔루션 나인'],
  ['dancing-mad','절 요성난무','황금',100,52299,52320,'와흐셰파 · 솔루션 나인']
 ].map(([id,name,expansion,level,a,b,merchant])=>({id,name,short:name,expansion,kind:'ultimate',level,labels:['수집'],groups:[[...range(a,b),...(id==='top'?[43642,43663]:[])]],acquisition:`${name} 클리어 보상인 우상을 ${merchant}에게 교환합니다.`,source:official(name)})),
 {id:'exquisite',name:'재보강 신곡 무기',short:'재보강 신곡',expansion:'효월',kind:'enhanced',level:90,
  labels:['보강','재보강'],groups:[[],[...range(41679,41698),44243,44244]],
  acquisition:'보강된 신곡 무기를 전천 강화약으로 재보강합니다. 라자한의 칼딘에게 교환하며, 전천 강화약은 번외 알로알로 섬(영웅) 보상 등의 교환 경로를 확인하세요. 나이트는 검·방패를 함께 교환합니다.',source:'https://www.ff14.co.kr/news/notice/view/2504'},
 {id:'gentlemage',name:'재보강 마법 신사 우산',short:'마법 신사 우산',expansion:'효월',kind:'enhanced',level:80,
  labels:['일반','재보강'],groups:[[40476],[41700]],acquisition:'청마도사의 마법 신사 우산을 전천 강화약으로 재보강합니다. 신곡 무기와는 별도이며, 우산은 울다하 달 회랑의 울적한 라토쟈에게서 획득합니다.',source:'https://ffxiv.consolegameswiki.com/wiki/Gentlemage%27s_Umbrella'}
];
await fs.mkdir(cache,{recursive:true});
const snapshots=[];
async function sheet(lang,name,fields) {
 const file=new URL(`${lang}-${name}.csv`,cache),r=revisions[lang];
 const source=`https://raw.githubusercontent.com/${r.repo}/${r.sha}/csv/${lang}/${name}.csv`;
 let text;
 try{text=await fs.readFile(file,'utf8');}catch{
  const local=new URL(`../../../.cache/beastmaster/${r.sha}/${lang}-${name}.csv`,import.meta.url);
  try{text=await fs.readFile(local,'utf8');}catch{const res=await fetch(source);if(!res.ok)throw Error(`${name}: ${res.status}`);text=await res.text();}
  await fs.writeFile(file,text);
 }
 snapshots.push({name,language:lang,source,sha256:createHash('sha256').update(text).digest('hex')});
 return table(text,lang,fields).rows;
}
const [ko,en,categories]=await Promise.all([sheet('ko','Item',['Name','Icon','Level{Item}','Level{Equip}','ClassJobCategory','EquipSlotCategory']),sheet('en','Item',['#','Name','ClassJobCategory','EquipSlotCategory']),sheet('en','ClassJobCategory')]);
const enByName=new Map([...en.values()].map(r=>[r.Name,Number(r['#'])]));
const ex=definitions.find(s=>s.id==='exquisite');
for(const id of ex.groups[1]){
 const name=en.get(id).Name.replace(/^Exquisite /,'');
 ex.groups[0].push(enByName.get('Augmented '+name));
}
const tracks=[],usedIds=new Set();
for(const s of definitions){
 const byTrack=new Map();
 for(let step=0;step<s.groups.length;step++)for(const id of s.groups[step]){
  if(!id||usedIds.has(id))throw Error(`Missing/duplicate item: ${s.id} ${id}`);usedIds.add(id);
  const r=ko.get(id),english=en.get(id),category=categories.get(Number(r?.ClassJobCategory));
  if(!r?.Name||!english?.Name||r.ClassJobCategory!==english.ClassJobCategory||r.EquipSlotCategory!==english.EquipSlotCategory)throw Error(`Unverified item ${id}`);
  const matching=jobs.filter(j=>category?.[j.id]==='True');if(matching.length!==1)throw Error(`Ambiguous job ${id}`);
  const jobId=matching[0].id,slot=r.EquipSlotCategory==='2'?'shield':'weapon',key=`${s.id}.${jobId}.${slot}`;
  if(!byTrack.has(key))byTrack.set(key,{id:key,seriesId:s.id,jobId,slot,items:[]});
  const t=byTrack.get(key);if(t.items.length!==step)throw Error(`Stage gap ${key}`);
  t.items.push({id,name:r.Name,englishName:english.Name,icon:icon(Number(r.Icon)).url,itemLevel:Number(r['Level{Item}']),level:Number(r['Level{Equip}']),stage:s.labels[step],official:official(r.Name)});
 }
 for(const t of byTrack.values()){if(t.items.length!==s.labels.length)throw Error(`Incomplete track ${t.id}`);tracks.push(t);}
 s.trackCount=byTrack.size;s.jobCount=new Set([...byTrack.values()].map(t=>t.jobId)).size;
 delete s.groups;
}
tracks.sort((a,b)=>definitions.findIndex(s=>s.id===a.seriesId)-definitions.findIndex(s=>s.id===b.seriesId)||jobs.findIndex(j=>j.id===a.jobId)-jobs.findIndex(j=>j.id===b.jobId)||a.slot.localeCompare(b.slot));
// Put PLD sword before shield while keeping every other job in role order.
for(let i=1;i<tracks.length;i++)if(tracks[i-1].seriesId===tracks[i].seriesId&&tracks[i-1].jobId==='PLD'&&tracks[i].jobId==='PLD'&&tracks[i-1].slot==='shield')[tracks[i-1],tracks[i]]=[tracks[i],tracks[i-1]];
const result={schemaVersion:1,updatedAt:'2026-09-09',patch:'7.56',jobs,series:definitions,tracks,
 sources:{official:guide,catalog:'https://ffxivcollect.com/relics/weapons',ultimate:'https://ffxivcollect.com/relics/ultimate',catalogRevision:'bd2b6c5e49cc560a06cb0bed887edc43978f597a',snapshots:snapshots.sort((a,b)=>(a.language+a.name).localeCompare(b.language+b.name))}};
await fs.mkdir(new URL('data/',root),{recursive:true});
await fs.writeFile(new URL('data/weapons.json',root),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({series:definitions.length,tracks:tracks.length,items:usedIds.size,counts:definitions.map(s=>[s.id,s.jobCount,s.trackCount,s.labels.length])},null,2));
