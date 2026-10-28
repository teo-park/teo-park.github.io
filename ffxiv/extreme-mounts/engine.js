(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ExtremeMounts=api;})(globalThis,function(){
  'use strict';
  const KEY='teo-ffxiv.extreme-mounts.collection.v1',WISH_KEY='teo-ffxiv.collection-wishes.v1',TYPE='ffxiv-extreme-mounts';
  const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
  function ids(value){if(!Array.isArray(value)||value.length>30000||value.some(v=>!Number.isSafeInteger(v)||v<=0||v>9999999999))throw Error('탈것 번호가 올바르지 않습니다.');return new Set(value);}
  const sorted=set=>[...set].sort((a,b)=>a-b);
  function parse(text){let v;try{v=JSON.parse(text);}catch{throw Error('JSON 백업 파일을 읽지 못했어요.');}if(!object(v)||v.type!==TYPE||v.schemaVersion!==1)throw Error('극 탈것 수첩의 백업 파일을 선택해 주세요.');return {collected:ids(v.collected),wanted:ids(v.wanted||[])};}
  function wishes(storage){const raw=storage.getItem(WISH_KEY),all=raw===null?{}:JSON.parse(raw);if(!object(all)||all.mounts!==undefined&&!object(all.mounts))throw Error('같이하기 기록을 확인해 주세요.');return all;}
  function read(storage){
    const raw=storage.getItem(KEY),collected=raw===null?new Set():parse(raw).collected,all=wishes(storage),wanted=new Set();
    for(const [id,value] of Object.entries(all.mounts||{})){if(!/^[1-9][0-9]{0,9}$/.test(id)||typeof value!=='boolean')throw Error('같이하기 기록을 확인해 주세요.');if(value)wanted.add(+id);}
    return {collected,wanted};
  }
  function backup(record){return JSON.stringify({type:TYPE,schemaVersion:1,exportedAt:new Date().toISOString(),collected:sorted(record.collected),wanted:sorted(record.wanted)},null,2);}
  function write(storage,next,{repair=false}={}){
    ids(sorted(next.collected));ids(sorted(next.wanted));if(!repair)read(storage);
    const beforeBook=storage.getItem(KEY),beforeWishes=storage.getItem(WISH_KEY);let old={};try{old=JSON.parse(beforeBook||'{}');}catch{if(!repair)throw Error('기존 기록을 읽지 못했어요.');}
    if(!object(old))old={};
    const all=wishes(storage);all.mounts=Object.fromEntries(sorted(next.wanted).map(id=>[id,true]));
    const book=JSON.stringify({...old,type:TYPE,schemaVersion:1,collected:sorted(next.collected)}),wish=JSON.stringify(all),written=[];
    try{if(beforeBook!==book){storage.setItem(KEY,book);written.push([KEY,beforeBook,book]);}if(beforeWishes!==wish){storage.setItem(WISH_KEY,wish);written.push([WISH_KEY,beforeWishes,wish]);}}
    catch(error){for(const [key,before,value] of written.reverse())try{if(storage.getItem(key)===value){if(before===null)storage.removeItem(key);else storage.setItem(key,before);}}catch{}throw error;}
    return next;
  }
  function summary(expansion,collected){return {owned:expansion.required.filter(id=>collected.has(id)).length,total:expansion.required.length,reward:collected.has(expansion.reward),extras:expansion.extras.filter(id=>collected.has(id)).length};}
  function matches(mount,query){const norm=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/\s/g,'');const text=norm([mount.name,mount.original,mount.itemName,...mount.sources.map(s=>s.name),mount.quest?.name].join(' ')),q=norm(query);const initials=[...text].map(c=>{const n=c.charCodeAt(0)-44032;return n>=0&&n<=11171?'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'[Math.floor(n/588)]:c;}).join('');return !q||text.includes(q)||norm(initials).includes(q);}
  function filter(mounts,record,{expansion='all',status='all',query=''}={}){return mounts.filter(m=>(expansion==='all'||m.expansion===expansion)&&matches(m,query)&&(status==='all'||(status==='wanted'?record.wanted.has(m.id)&&!record.collected.has(m.id):record.collected.has(m.id)===(status==='owned'))));}
  return {KEY,WISH_KEY,TYPE,parse,read,write,backup,summary,filter,matches};
});
