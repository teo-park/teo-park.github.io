/* Shared collection formats. Keep notebook-only notes and unknown IDs intact. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CollectionRoomModel=api;})(globalThis,function(){
  'use strict';
  const BOOKS=[
    {id:'blue-mage',label:'청마법',path:'blue-mage/',key:'teo-ffxiv.blue-mage.collection.v1',type:'ffxiv-blue-mage',field:'learned'},
    {id:'weapons',label:'무기',path:'weapons/',key:'teo-ffxiv.weapons.collection.v1'},
    {id:'fishing',label:'어부 수첩',path:'fishing-log/',key:'teo-ffxiv.fishing.collection.v2',type:'ffxiv-fishing-log',field:'caught'},
    {id:'triple-triad',label:'카드',path:'triple-triad/',key:'teo-ffxiv.triple-triad.collection.v1',type:'ffxiv-triple-triad',field:'collected'},
    {id:'minions',label:'꼬마친구',path:'minions/',key:'teo-ffxiv.minions.collection.v1',type:'ffxiv-minions',field:'collected'},
    {id:'beastmaster',label:'마수도감',path:'beastmaster/',key:'teo-ffxiv.beastmaster.collection.v1',type:'ffxiv-beastmaster',field:'collected'},
  ];
  const WISH_KEY='teo-ffxiv.collection-wishes.v1',BINDING_KEY='teo-ffxiv.collection-binding.teo-ffxiv.v1',OUTBOX_PREFIX='teo-ffxiv.collection-outbox.teo-ffxiv.v1.';
  const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
  const encode=id=>String(id).replaceAll('.','~'),decode=id=>String(id).replaceAll('~','.');
  const empty=()=>({value:0,wanted:false});
  function validId(book,id){return book==='weapons'?/^[a-z0-9-]+~[A-Z]{3}~(weapon|shield)$/.test(id):/^[1-9][0-9]{0,9}$/.test(id);}
  function cell(value){
    if(!object(value)||(value.value!==undefined&&(!Number.isSafeInteger(value.value)||value.value<0||value.value>2147483647))||(value.wanted!==undefined&&typeof value.wanted!=='boolean'))throw Error('수집 기록 형식을 확인해 주세요.');
    return {value:value.value??0,wanted:value.wanted??false};
  }
  function normalize(books){
    if(books==null)return {};
    if(!object(books))throw Error('수집 기록을 읽지 못했습니다.');
    const result={};
    for(const book of BOOKS){
      if(books[book.id]==null)continue;
      if(!object(books[book.id])||Object.keys(books[book.id]).length>30000)throw Error('수집 기록이 올바르지 않습니다.');
      result[book.id]={};
      for(const [id,v] of Object.entries(books[book.id])){if(!validId(book.id,id))throw Error('수집 항목 ID가 올바르지 않습니다.');const c=cell(v);if(book.id!=='weapons'&&c.value>1)throw Error('수집 체크가 올바르지 않습니다.');result[book.id][id]=c;}
    }
    return result;
  }
  function wishes(storage){const raw=storage.getItem(WISH_KEY);const v=raw===null?{}:JSON.parse(raw);if(!object(v))throw Error('같이하기 기록을 읽지 못했습니다.');return v;}
  function readBook(storage,book){
    const raw=storage.getItem(book.key),record=raw===null?null:JSON.parse(raw),result={};
    if(book.id==='weapons'){
      if(record!==null&&(record.format!=='teo-ffxiv-weapons'||record.version!==1||!object(record.records)))throw Error('무기 수첩 기록을 확인해 주세요.');
      for(const [id,r] of Object.entries(record?.records||{})){
        const k=encode(id);if(!validId(book.id,k)||!object(r)||!Number.isSafeInteger(r.itemId)||r.itemId<0||typeof r.target!=='boolean')throw Error('무기 수첩 기록을 확인해 주세요.');
        result[k]={value:r.itemId,wanted:r.target};
      }
    }else{
      if(record!==null&&(record.type!==book.type||record.schemaVersion!==1||!Array.isArray(record[book.field])||record[book.field].length>30000||record[book.field].some(id=>!Number.isSafeInteger(id)||id<=0)))throw Error(book.label+' 기록을 확인해 주세요.');
      for(const id of record?.[book.field]||[])result[String(id)]={value:1,wanted:false};
      for(const [id,wanted] of Object.entries(wishes(storage)[book.id]||{})){
        if(!validId(book.id,id)||typeof wanted!=='boolean')throw Error('같이하기 기록을 확인해 주세요.');
        result[id]={value:result[id]?.value||0,wanted};
      }
    }
    return result;
  }
  function readLocal(storage){return Object.fromEntries(BOOKS.map(b=>[b.id,readBook(storage,b)]));}
  function writeBook(storage,book,entries){
    normalize({[book.id]:entries});
    const raw=storage.getItem(book.key),record=raw===null?null:JSON.parse(raw);
    // Validate before writing so damaged notebook backups are never silently replaced.
    readBook(storage,book);
    if(book.id==='weapons'){
      const next=record||{format:'teo-ffxiv-weapons',version:1,records:{}};
      for(const id of new Set([...Object.keys(next.records).map(encode),...Object.keys(entries)])){
        const old=next.records[decode(id)]||{itemId:0,target:false,note:''},v=entries[id]||empty();
        next.records[decode(id)]={...old,itemId:v.value,target:v.wanted};
      }
      const value=JSON.stringify(next);if(raw!==value)storage.setItem(book.key,value);
    }else{
      const ids=Object.entries(entries).filter(([,v])=>v.value===1).map(([id])=>+id).sort((a,b)=>a-b);
      const next={...(record||{type:book.type,schemaVersion:1}),[book.field]:ids};
      const value=JSON.stringify(next);if(raw!==value)storage.setItem(book.key,value);
      const all=wishes(storage);all[book.id]=Object.fromEntries(Object.entries(entries).filter(([,v])=>v.wanted).map(([id])=>[id,true]));
      const wishValue=JSON.stringify(all);if(storage.getItem(WISH_KEY)!==wishValue)storage.setItem(WISH_KEY,wishValue);
    }
  }
  function diff(before,after){
    const changes={};
    for(const b of BOOKS)for(const id of new Set([...Object.keys(before[b.id]||{}),...Object.keys(after[b.id]||{})])){
      const a=before[b.id]?.[id]||empty(),z=after[b.id]?.[id]||empty();
      for(const field of ['value','wanted'])if(a[field]!==z[field])changes[`${b.id}/${id}/${field}`]=z[field];
    }
    return changes;
  }
  function overlay(books,patch){
    const result=structuredClone(normalize(books));
    for(const [path,value] of Object.entries(patch)){
      const [book,id,field,...extra]=path.split('/');
      if(extra.length||!BOOKS.some(b=>b.id===book)||!validId(book,id)||!['value','wanted'].includes(field))throw Error('동기화 대기 기록이 올바르지 않습니다.');
      result[book]||={};result[book][id]||=empty();result[book][id][field]=value;
    }
    return normalize(result);
  }
  function mergeInitial(remote,local,catalog){
    const result=structuredClone(normalize(remote));
    for(const b of BOOKS){result[b.id]||={};for(const [id,v] of Object.entries(local[b.id]||{})){
      const old=result[b.id][id]||empty();let value=Math.max(old.value,v.value);
      if(b.id==='weapons'){
        const stages=catalog?.books?.weapons?.items?.find(t=>t.id===id)?.stages||[];
        value=stages.findIndex(s=>s.id===v.value)>stages.findIndex(s=>s.id===old.value)?v.value:old.value||v.value;
      }
      result[b.id][id]={value,wanted:old.wanted||v.wanted};
    }}
    return result;
  }
  function complete(book,item,record){return book==='weapons'?record?.value===item.stages.at(-1)?.id:record?.value===1;}
  function matches(text,query){const norm=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/\s/g,'');const initials=v=>[...v].map(c=>{const n=c.charCodeAt(0)-44032;return n>=0&&n<=11171?'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'[Math.floor(n/588)]:c;}).join('');return norm(text).includes(norm(query))||norm(initials(text)).includes(norm(query));}
  async function passwordProof(password,roomId,cryptoApi=globalThis.crypto){
    if(typeof password!=='string'||password.length<8||password.length>128)throw Error('방 비밀번호는 8~128자로 입력해 주세요.');
    if(!/^[a-f0-9]{32}$/.test(roomId))throw Error('방 코드를 확인해 주세요.');
    const key=await cryptoApi.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
    const bits=await cryptoApi.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode('ffxiv-collection-room-v1:'+roomId),iterations:210000,hash:'SHA-256'},key,256);
    return [...new Uint8Array(bits)].map(v=>v.toString(16).padStart(2,'0')).join('');
  }
  return {BOOKS,WISH_KEY,BINDING_KEY,OUTBOX_PREFIX,encode,decode,empty,normalize,readBook,readLocal,writeBook,diff,overlay,mergeInitial,complete,matches,passwordProof};
});
