export const KEY='teo-ffxiv.beastmaster.collection.v1';
export const methods={field:'필드 포획',duty:'임무 포획',exchange:'항아리 교환',quest:'퀘스트 지급'};
const initials=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
export const normalize=v=>String(v??'').normalize('NFC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
export const initialText=v=>[...v].map(c=>{const n=c.charCodeAt(0)-0xac00;return n>=0&&n<11172?initials[Math.floor(n/588)]:c;}).join('');
export function create(data){
  if(data?.count!==data?.beasts?.length||!data?.items||!data.count)throw Error('마수도감 자료를 읽지 못했어요. 새로고침해 주세요.');
  const byId=new Map(data.beasts.map(b=>[b.id,b])),items=new Map(data.items.map(i=>[i.id,i])),routes=new Map();
  for(const b of data.beasts){
    const entries=[];
    for(const a of b.acquisition){
      if(a.type==='capture'){const l=a.location;entries.push({type:l.type,key:`${l.type}:${l.id}`,name:l.name,link:l.official,capture:a});}
      else if(a.type==='item'){const item=items.get(a.itemId);if(!item)throw Error('마수 획득처 자료가 빠졌어요.');
        for(const source of item.sources){const exchange=source.type==='exchange';entries.push({type:source.type,key:`${source.type}:${exchange?source.shopId:source.quest.id}`,name:exchange?source.shopName:source.quest.name,link:exchange?source.location.source:source.quest.official,item,source});}}
    }
    routes.set(b.id,entries);
  }
  const sourceMatches=(r,o={})=>(!o.method||o.method==='all'||r.type===o.method)&&(!o.place||o.place==='all'||r.key===o.place);
  const matchingRoutes=(b,o={})=>routes.get(b.id).filter(r=>sourceMatches(r,o));
  const terms=new Map(data.beasts.map(b=>{const text=[b.name,b.englishName,...routes.get(b.id).flatMap(r=>[r.name,r.item?.name,r.source?.merchant,...(r.source?.costs||[]).map(c=>c.name),...(r.source?.prerequisiteQuests||[]).map(q=>q.name)])].filter(Boolean).join(' ');return [b.id,{text:normalize(text),initials:normalize(initialText(text))}];}));
  function filter(owned,o={}){const q=normalize(o.query),number=/^(?:no)?\d+$/.test(q)?Number(q.replace(/^no/,'')):null;
    return data.beasts.filter(b=>(!o.status||o.status==='all'||owned.has(b.id)===(o.status==='owned'))&&matchingRoutes(b,o).length&&(!q||(number!==null?b.id===number:terms.get(b.id).text.includes(q)||terms.get(b.id).initials.includes(q))));}
  function groups(beasts,o={}){const found=new Map();for(const b of beasts)for(const r of matchingRoutes(b,o)){
    if(!found.has(r.key))found.set(r.key,{key:r.key,name:r.name,type:r.type,link:r.link,entries:[]});
    found.get(r.key).entries.push({beast:b,route:r});}
    return [...found.values()].sort((a,b)=>Object.keys(methods).indexOf(a.type)-Object.keys(methods).indexOf(b.type)||a.name.localeCompare(b.name,'ko'));
  }
  return {byId,items,routes,matchingRoutes,filter,groups};
}
export function parseNumbers(text,valid){
  const ids=new Set(),tokens=String(text).trim().replace(/[，、]/g,',').replace(/\s*[-~～–]\s*/g,'-').split(/[\s,]+/).filter(Boolean);
  if(!tokens.length)throw Error('이 페이지에 표시된 마수 번호를 입력해 주세요.');
  if(tokens.length>1000)throw Error('한 번에 입력한 번호가 너무 많아요.');
  for(const token of tokens){const m=token.match(/^(\d+)(?:-(\d+))?$/);if(!m)throw Error('1, 2, 10-15처럼 입력해 주세요.');
    const from=Number(m[1]),to=Number(m[2]||m[1]);if(from>to||to-from>valid.size)throw Error('번호 범위를 확인해 주세요.');
    for(let id=from;id<=to;id++){if(!valid.has(id))throw Error(`목록에 없는 번호입니다: ${id}`);ids.add(id);}}
  return ids;
}
export function parseBackup(text){let v;try{v=JSON.parse(text);}catch{throw Error('JSON 백업 파일을 읽을 수 없어요.');}
  if(v?.type!=='ffxiv-beastmaster'||v.schemaVersion!==1||!Array.isArray(v.collected)||v.collected.length>10000||v.collected.some(n=>!Number.isSafeInteger(n)||n<=0))throw Error('마수도감에서 내보낸 백업 파일을 선택해 주세요.');
  return new Set(v.collected);
}
export const backup=ids=>JSON.stringify({type:'ffxiv-beastmaster',schemaVersion:1,exportedAt:new Date().toISOString(),collected:[...ids].sort((a,b)=>a-b)},null,2);
