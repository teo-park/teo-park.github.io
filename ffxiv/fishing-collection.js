// Shared item-ID collection for the fishing notebook and ocean journal.
(function(root){
 'use strict';
 const KEY='teo-ffxiv.fishing.collection.v2',BOOK_KEY='teo-ffxiv.fishing.collection.v1',OCEAN_KEY='caughtFishLS-combined';
 const name=v=>String(v||'').replace(/^(?:[MITF]!)+/,'').trim();
 const key=v=>name(v).normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
 const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 const validIds=v=>Array.isArray(v)&&v.length<=30000&&v.every(id=>Number.isSafeInteger(id)&&id>0);
 function book(raw){
  if(raw===null)return null;
  const value=JSON.parse(raw);if(!object(value)||value.type!=='ffxiv-fishing-log'||value.schemaVersion!==1||!validIds(value.caught))throw Error('어부 수첩 수집 기록 형식이 올바르지 않습니다.');
  return value;
 }
 function ocean(value){
  if(value===null)return {indigo:{},ruby:{}};
  if(!object(value))throw Error('항해일지 수집 기록 형식이 올바르지 않습니다.');
  const result={indigo:{},ruby:{}};
  for(const route of ['indigo','ruby']){
   if(!Object.hasOwn(value,route))continue;
   if(!object(value[route]))throw Error('항해일지 항로 기록 형식이 올바르지 않습니다.');
   for(const [fish,flag] of Object.entries(value[route])){
    if(typeof flag!=='boolean'||!key(fish.split('|')[0])||fish.length>1000||['__proto__','prototype','constructor'].includes(fish))throw Error('항해일지 물고기 기록 형식이 올바르지 않습니다.');
    result[route][fish]=flag;
   }
  }
  return result;
 }
 function create(idMap){
  if(!object(idMap)||!Object.keys(idMap).length)throw Error('먼바다 물고기 ID 자료를 불러오지 못했습니다.');
  const byName=new Map(),entries=Object.entries(idMap).map(([id,list])=>[+id,list]);
  for(const [id,list] of entries)for(const entry of list)byName.set(entry.route+':'+key(entry.name),id);
  function oceanIds(state){
   const ids=new Set();for(const route of ['indigo','ruby'])for(const [fish,value] of Object.entries(state[route]))if(value){const id=byName.get(route+':'+key(fish.split('|')[0]));if(id)ids.add(id);}return ids;
  }
  function extras(state){
   const result={indigo:{},ruby:{}};for(const route of ['indigo','ruby'])for(const [fish,value] of Object.entries(state[route]))if(!byName.has(route+':'+key(fish.split('|')[0])))result[route][fish]=value;return result;
  }
  const sorted=ids=>[...new Set(ids)].sort((a,b)=>a-b);
  function load(storage){
   // Read and validate every source before the one atomic write. Legacy keys stay intact.
   const raw=storage.getItem(KEY),oldBookRaw=storage.getItem(BOOK_KEY),oldOceanRaw=storage.getItem(OCEAN_KEY);
   const stored=book(raw),oldBook=book(oldBookRaw),oldOcean=ocean(oldOceanRaw===null?null:JSON.parse(oldOceanRaw)),previous=stored?.sync;
   if(previous&&(!object(previous)||previous.version!==1||!validIds(previous.book)||!validIds(previous.ocean)))throw Error('수집 기록 연동 정보가 올바르지 않습니다.');
   const ids=new Set(stored?.caught||[]),bookIds=new Set(oldBook?.caught||[]),journalIds=oceanIds(oldOcean);
   function reconcile(current,last){
    if(!last){for(const id of current)ids.add(id);return;}
    const before=new Set(last);for(const id of current)if(!before.has(id))ids.add(id);for(const id of before)if(!current.has(id))ids.delete(id);
   }
   reconcile(bookIds,previous?.book);reconcile(journalIds,previous?.ocean);
   const oldExtras=extras(oldOcean),savedExtras=ocean(previous?.extras??null);
   const record={type:'ffxiv-fishing-log',schemaVersion:1,caught:sorted(ids),sync:{version:1,book:sorted(bookIds),ocean:sorted(journalIds),extras:{indigo:{...oldExtras.indigo,...savedExtras.indigo},ruby:{...oldExtras.ruby,...savedExtras.ruby}}}};
   const serialized=JSON.stringify(record),changed=(raw!==null||oldBookRaw!==null||oldOceanRaw!==null)&&serialized!==raw;
   return {record,serialized,changed};
  }
  function current(storage){const snapshot=load(storage);if(snapshot.changed)storage.setItem(KEY,snapshot.serialized);return snapshot.record;}
  function read(storage){return new Set(current(storage).caught);}
  function write(storage,ids){
   const values=sorted(ids);if(!validIds(values))throw Error('수집 아이템 ID가 올바르지 않습니다.');
   const {record}=load(storage);record.caught=values;storage.setItem(KEY,JSON.stringify(record));return new Set(values);
  }
  function readOcean(storage){
   const record=current(storage),state=ocean(record.sync.extras),ids=new Set(record.caught);
   for(const [id,list] of entries)for(const entry of list)state[entry.route][entry.name]=ids.has(id);
   return state;
  }
  function writeOcean(storage,value){
   const state=ocean(value),{record}=load(storage),ids=new Set(record.caught),next=oceanIds(state);
   for(const [id] of entries){if(next.has(id))ids.add(id);else ids.delete(id);}
   record.caught=sorted(ids);record.sync.extras=extras(state);storage.setItem(KEY,JSON.stringify(record));return state;
  }
  return {KEY,BOOK_KEY,OCEAN_KEY,read,write,readOcean,writeOcean,isStorageKey:value=>value===null||[KEY,BOOK_KEY,OCEAN_KEY].includes(value)};
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={create,KEY,BOOK_KEY,OCEAN_KEY};
 else root.FishingCollection=create(root.OceanTeamcraftIds);
})(typeof window==='undefined'?globalThis:window);
