const {test}=require('node:test'),assert=require('node:assert/strict'),{request}=require('../sync-leader.js');
test('new collection client queues before asking the old tab to release and requeue its lock',async()=>{
  let active=true,releaseNew,value=JSON.stringify({uid:'alice'});const queue=[],events=[];
  function pump(){if(active||!queue.length)return;active=true;queue.shift()();}
  const locks={request:(_,__,run)=>new Promise(resolve=>{queue.push(()=>{Promise.resolve(run()).then(()=>{active=false;resolve();pump();});});pump();})};
  const storage={getItem:()=>value,setItem:(_,next)=>{value=next;events.push('notify-old');active=false;pump();void locks.request('sync',{},()=>{events.push('old-requeued');});}};
  const pending=request({locks,name:'sync',run:()=>{events.push('new-owner');return new Promise(resolve=>{releaseNew=resolve;});},storage,bindingKey:'binding',binding:{uid:'alice'},version:'mounts'});
  assert.deepEqual(events,['notify-old','new-owner']);assert.equal(JSON.parse(value).uid,'alice');assert.equal(JSON.parse(value).syncVersion,'mounts');releaseNew();await pending;await new Promise(r=>setImmediate(r));assert.deepEqual(events,['notify-old','new-owner','old-requeued']);
});
test('matching versions do not restart other tabs, and a changed account is never overwritten',async()=>{
  for(const latest of [{uid:'alice',syncVersion:'mounts'},{uid:'bob'}]){
    let writes=0;await request({locks:{request:async(_,__,run)=>run()},name:'sync',run:()=>{},storage:{getItem:()=>JSON.stringify(latest),setItem:()=>{writes++;}},bindingKey:'binding',binding:latest.uid==='alice'?latest:{uid:'alice'},version:'mounts'});assert.equal(writes,0);
  }
});
test('blocked metadata writes leave the queued lock promise intact',async()=>{
  const pending=Promise.resolve('queued');
  assert.equal(request({locks:{request:()=>pending},name:'sync',run:()=>{},storage:{getItem:()=>'{"uid":"alice"}',setItem:()=>{throw Error('quota');}},bindingKey:'binding',binding:{uid:'alice'},version:'mounts'}),pending);
  assert.equal(await pending,'queued');
});
