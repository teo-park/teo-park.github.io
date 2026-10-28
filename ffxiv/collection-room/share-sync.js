/* Publish only consenting room copies; retain failures for bounded retries. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CollectionShareSync=api;})(globalThis,function(){
  'use strict';
  function create({books,readCloud,readShares,writeShared,isActive=()=>true,onError=()=>{},onSettled=()=>{},now=()=>Date.now()}){
    let running=null,dirty=false,error=null,retryAt=0,retryDelay=3000;
    async function drain(){
      while(dirty&&isActive()){
        dirty=false;const cloud=readCloud(),jobs=[];
        for(const [room,sharing] of readShares())for(const book of books)if(sharing[book.id])jobs.push({room,book:book.id,payload:{ready:true,entries:cloud[book.id]||null}});
        const results=await Promise.allSettled(jobs.map(job=>Promise.resolve().then(()=>writeShared(job.room,job.book,job.payload))));
        if(!isActive())return;
        const failed=results.findIndex((result,i)=>result.status==='rejected'&&readShares().get(jobs[i].room)?.[jobs[i].book]===true);
        if(failed!==-1){error=results[failed].reason;retryAt=now()+retryDelay;retryDelay=Math.min(retryDelay*2,60000);dirty=false;onError(error);return;}
        error=null;retryAt=0;retryDelay=3000;if(!dirty)onSettled();
      }
    }
    function publish(){
      if(!isActive())return Promise.resolve();dirty=true;
      if(!running)running=drain().finally(()=>{running=null;});
      return running;
    }
    function retry(){if(error&&now()>=retryAt)return publish();return running||Promise.resolve();}
    return {publish,retry,get error(){return error;}};
  }
  return {create};
});
