const {test}=require('node:test'),assert=require('node:assert/strict');
const {create}=require('../share-sync.js');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function setup(options={}){
  let cloud={'blue-mage':{'1':{value:1,wanted:false}}},active=true,time=0,write=options.write||(async()=>{});
  const shares=new Map([['room',{'blue-mage':true,minions:false}]]),calls=[],errors=[],settled=[];
  const publisher=create({books:[{id:'blue-mage'},{id:'minions'}],readCloud:()=>cloud,readShares:()=>shares,isActive:()=>active,now:()=>time,
    writeShared:async(...args)=>{calls.push(args);return write(...args);},onError:e=>errors.push(e),onSettled:()=>settled.push(true)});
  return {publisher,shares,calls,errors,settled,setCloud:v=>{cloud=v;},setActive:v=>{active=v;},setTime:v=>{time=v;},setWrite:v=>{write=v;}};
}
test('only consenting books are published, including a ready marker for an empty notebook',async()=>{
  const h=setup();await h.publisher.publish();assert.deepEqual(h.calls,[['room','blue-mage',{ready:true,entries:{'1':{value:1,wanted:false}}}]]);assert.equal(h.settled.length,1);
  h.setCloud({});await h.publisher.publish();assert.deepEqual(h.calls.at(-1),['room','blue-mage',{ready:true,entries:null}]);
});
test('publishing failures are reported and retried after backoff instead of silently claiming success',async()=>{
  const failure=Error('permission-denied'),h=setup({write:async()=>{throw failure;}});await h.publisher.publish();
  assert.equal(h.publisher.error,failure);assert.deepEqual(h.errors,[failure]);assert.equal(h.settled.length,0);
  await h.publisher.retry();assert.equal(h.calls.length,1);h.setTime(3000);h.setWrite(async()=>{});await h.publisher.retry();
  assert.equal(h.calls.length,2);assert.equal(h.publisher.error,null);assert.equal(h.settled.length,1);
});
test('a changed canonical snapshot during a write is published after the previous snapshot completes',async()=>{
  let finish;const h=setup({write:()=>new Promise(resolve=>{finish=resolve;})}),pending=h.publisher.publish();await tick();
  h.setCloud({'blue-mage':{'2':{value:1,wanted:true}}});void h.publisher.publish();finish();await tick();assert.equal(h.calls.length,2);assert.deepEqual(h.calls[1][2].entries,{'2':{value:1,wanted:true}});finish();await pending;assert.equal(h.settled.length,1);
});
test('revoked sharing permissions and late responses after logout cannot restore or report old room data',async()=>{
  let finish;const h=setup({write:()=>new Promise((_,reject)=>{finish=()=>reject(Error('permission-denied'));})}),pending=h.publisher.publish();await tick();h.shares.clear();finish();await pending;assert.equal(h.errors.length,0);
  const next=h.publisher.publish();h.setActive(false);await next;const before=h.calls.length;await h.publisher.publish();assert.equal(h.calls.length,before);
});
