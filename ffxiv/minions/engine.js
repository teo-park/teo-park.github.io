(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MinionCollection=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const INITIALS=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
  const normalize=value=>String(value??'').normalize('NFC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
  const initials=value=>[...value].map(c=>{const n=c.charCodeAt(0)-0xac00;return n>=0&&n<=11171?INITIALS[Math.floor(n/588)]:c;}).join('');
  function matches(minion,query){
    const q=normalize(query);if(!q)return true;
    const text=[minion.name,minion.original,...minion.sources.flatMap(s=>[s.name,s.original,s.typeName,s.condition])].join(' ');
    return normalize(text).includes(q)||normalize(initials(text)).includes(q);
  }
  function filter(minions,owned,options={}){
    return minions.filter(m=>matches(m,options.query)&&(!options.status||options.status==='all'||owned.has(m.id)===(options.status==='owned'))&&(!options.source||options.source==='all'||(options.source==='unknown'?!m.sources.length:m.sources.some(s=>s.type===options.source)))&&(!options.expansion||options.expansion==='all'||Math.floor(+m.patch)===+options.expansion)&&(!options.tradeable||m.tradeable)&&(!options.excludeSpecial||m.sources.some(s=>!['Premium','Event'].includes(s.type))));
  }
  function sort(minions,by='game'){
    return [...minions].sort((a,b)=>(by==='name'?a.name.localeCompare(b.name,'ko'):by==='newest'?+b.patch-+a.patch:by==='oldest'?+a.patch-+b.patch:a.order-b.order)||a.order-b.order||a.id-b.id);
  }
  function parseBackup(text){
    let value;try{value=JSON.parse(text);}catch{throw Error('JSON 백업 파일을 읽을 수 없어요.');}
    if(!value||value.type!=='ffxiv-minions'||value.schemaVersion!==1||!Array.isArray(value.collected)||value.collected.length>10000||value.collected.some(id=>!Number.isSafeInteger(id)||id<=0))throw Error('꼬마친구 수첩에서 내보낸 백업 파일을 선택해 주세요.');
    return new Set(value.collected);
  }
  function backup(ids){return JSON.stringify({type:'ffxiv-minions',schemaVersion:1,exportedAt:new Date().toISOString(),collected:[...ids].sort((a,b)=>a-b)},null,2);}
  return {normalize,initials,matches,filter,sort,parseBackup,backup};
});
