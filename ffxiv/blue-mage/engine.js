(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BlueMageBook=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const INITIALS=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
  const normalize=v=>String(v??'').normalize('NFC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
  const initials=v=>[...v].map(c=>{const n=c.charCodeAt(0)-0xac00;return n>=0&&n<=11171?INITIALS[Math.floor(n/588)]:c;}).join('');
  function matches(spell,query){
    const q=normalize(query);if(!q)return true;
    if(/^(?:no)?\d+$/.test(q))return spell.id===+q.replace(/^no/,'');
    const text=[spell.name,spell.original,spell.type,spell.aspect,...spell.sources.flatMap(s=>[s.location,s.enemy,s.condition,s.original])].join(' ');
    return normalize(text).includes(q)||normalize(initials(text)).includes(q);
  }
  const sourceMatches=(source,options={})=>(!options.source||options.source==='all'||source.type===options.source)&&(!options.location||options.location==='all'||source.locationKey===options.location);
  function filter(spells,learned,options={}){
    return spells.filter(s=>matches(s,options.query)&&(!options.status||options.status==='all'||learned.has(s.id)===(options.status==='learned'))&&(!options.aspect||options.aspect==='all'||s.aspect===options.aspect)&&(!options.rank||options.rank==='all'||s.rank===+options.rank)&&s.sources.some(x=>sourceMatches(x,options)));
  }
  function groupByLocation(spells,options={}){
    const groups=new Map();
    for(const spell of spells)for(const source of spell.sources.filter(s=>sourceMatches(s,options))){
      if(!groups.has(source.locationKey))groups.set(source.locationKey,{key:source.locationKey,name:source.location,type:source.type,level:source.level,link:source.link,spells:[]});
      const group=groups.get(source.locationKey),entry=group.spells.find(s=>s.spell.id===spell.id);
      if(entry)entry.sources.push(source);else group.spells.push({spell,sources:[source]});
    }
    return [...groups.values()].sort((a,b)=>(a.level??0)-(b.level??0)||a.name.localeCompare(b.name,'ko'));
  }
  function parseNumbers(text,spells){
    const valid=new Set(spells.map(s=>s.id)),ids=new Set(),tokens=String(text).trim().replace(/[，、]/g,',').replace(/\s*[-~～–]\s*/g,'-').split(/[\s,]+/).filter(Boolean);
    if(!tokens.length)throw Error('습득한 청마법 번호를 입력해 주세요.');
    if(tokens.length>1000)throw Error('번호가 너무 많아요.');
    for(const token of tokens){
      const match=token.match(/^(\d+)(?:-(\d+))?$/);if(!match)throw Error('번호는 1, 2, 10-20처럼 입력해 주세요.');
      const from=+match[1],to=+(match[2]||match[1]);
      if(from>to||to-from>spells.length)throw Error('번호 범위를 확인해 주세요.');
      for(let n=from;n<=to;n++){if(!valid.has(n))throw Error(`수첩에 없는 번호입니다: ${n}`);ids.add(n);}
    }
    return ids;
  }
  function parseBackup(text){
    let v;try{v=JSON.parse(text);}catch{throw Error('JSON 백업 파일을 읽을 수 없어요.');}
    if(!v||v.type!=='ffxiv-blue-mage'||v.schemaVersion!==1||!Array.isArray(v.learned)||v.learned.length>10000||v.learned.some(id=>!Number.isSafeInteger(id)||id<=0))throw Error('청마도사 스킬 수첩에서 내보낸 백업 파일을 선택해 주세요.');
    return new Set(v.learned);
  }
  const backup=ids=>JSON.stringify({type:'ffxiv-blue-mage',schemaVersion:1,exportedAt:new Date().toISOString(),learned:[...ids].sort((a,b)=>a-b)},null,2);
  return {normalize,initials,matches,sourceMatches,filter,groupByLocation,parseNumbers,parseBackup,backup};
});
