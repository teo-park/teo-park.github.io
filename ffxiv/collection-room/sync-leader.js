(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CollectionSyncLeader=api;})(globalThis,function(){
  // Queue the new client before notifying an older tab to release/requeue its
  // existing lock. Keep the same outbox and lock so there is still one writer.
  function request({locks,name,signal,run,storage,bindingKey,binding,version}){
    const pending=locks.request(name,{signal},run);
    // This notification is best effort: a full or blocked storage must not
    // detach the already queued lock promise or break synchronization startup.
    try{if(binding.syncVersion!==version){const latest=JSON.parse(storage.getItem(bindingKey)||'null');if(latest?.uid===binding.uid)storage.setItem(bindingKey,JSON.stringify({...latest,syncVersion:version}));}}catch{}
    return pending;
  }
  return {request};
});
