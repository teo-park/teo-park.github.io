/* Field-level outbox: an uncheck survives reloads and unrelated device edits. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CollectionSyncEngine=api;})(globalThis,function(){
  'use strict';
  function create({model:M,storage,uid,writeRemote,readLocal=()=>M.readLocal(storage),applyLocal,onStatus=()=>{}}){
    const key=M.OUTBOX_PREFIX+uid;
    let state,cloud={},ready=false,sending=false,stopped=false,applying=false;
    const raw=storage.getItem(key);
    try{state=raw===null?{base:readLocal(),pending:{}}:JSON.parse(raw);M.normalize(state.base);M.overlay({},state.pending);}catch{throw Error('동기화 대기 기록을 읽지 못했습니다. 기존 데이터를 보존했습니다.');}
    const persist=()=>storage.setItem(key,JSON.stringify(state));
    function observe(){
      if(stopped||applying)return;
      const current=readLocal(),changes=M.diff(state.base,current);
      if(Object.keys(changes).length){Object.assign(state.pending,changes);state.base=current;persist();}
      if(Object.keys(state.pending).length)onStatus('pending');
    }
    function apply(){
      const merged=M.overlay(cloud,state.pending);applying=true;
      try{applyLocal(merged);state.base=readLocal();persist();}finally{applying=false;}
    }
    async function flush(){
      if(stopped||!ready||sending||!Object.keys(state.pending).length)return;
      sending=true;const patch={...state.pending};
      try{
        await writeRemote(patch);
        if(stopped)return;
        // The realtime subscription owns cloud state. An older write acknowledgement
        // must not overwrite a newer snapshot received from another device.
        for(const [path,value] of Object.entries(patch))if(state.pending[path]===value)delete state.pending[path];
        persist();onStatus(Object.keys(state.pending).length?'pending':'synced');
      }catch(error){if(!stopped)onStatus('offline',error);}finally{sending=false;}
      if(!stopped&&Object.keys(state.pending).length&&Object.keys(patch).some(k=>state.pending[k]!==patch[k]))void flush();
    }
    function receive(books){
      if(stopped)return;
      observe();cloud=M.normalize(books);ready=true;apply();onStatus(Object.keys(state.pending).length?'pending':'synced');void flush();
    }
    function change(){observe();void flush();}
    function stop(){stopped=true;}
    return {receive,change,flush,stop,observe,key,get pending(){return {...state.pending};},get ready(){return ready;}};
  }
  return {create};
});
