// Personal achievement completion, independent of fish catches and voyage counts.
(function(root) {
  'use strict';
  const KEY='ocean:achievement-records:v1',EXCLUDE_KEY='ocean:hide-completed-achievements';
  function read(storage) {
    const raw=storage.getItem(KEY);
    if(raw===null)return new Set();
    const value=JSON.parse(raw);
    if(value?.version!==1||!Array.isArray(value.completed)||value.completed.some(id=>typeof id!=='string'||!id||id.length>100))throw Error('업적 완료 기록 형식 오류');
    return new Set(value.completed);
  }
  function setCompleted(storage,id,completed) {
    if(typeof id!=='string'||!id||id.length>100||typeof completed!=='boolean')throw Error('업적 기록 입력 오류');
    // Merge the latest value so editing another achievement in a second tab is retained.
    const next=read(storage);
    if(completed)next.add(id);else next.delete(id);
    storage.setItem(KEY,JSON.stringify({version:1,completed:[...next].sort()}));
    return next;
  }
  const api={KEY,EXCLUDE_KEY,read,setCompleted};
  if(typeof module==='object')module.exports=api;else root.OceanAchievementRecords=api;
})(typeof window==='undefined'?globalThis:window);
