const {test}=require('node:test');
const assert=require('node:assert/strict');
const R=require('../scripts/achievement-records.js');
function memory(){const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v))};}
test('completion reads default empty, merges fresh edits across routes, and retains future goal IDs',()=>{
  const storage=memory();assert.deepEqual([...R.read(storage)],[]);
  storage.setItem(R.KEY,JSON.stringify({version:1,completed:['FutureGoal','Shark']}));
  R.setCompleted(storage,'Mantis',true);R.setCompleted(storage,'Shark',false);
  assert.deepEqual([...R.read(storage)],['FutureGoal','Mantis']);
  assert.equal(storage.getItem('caughtFishLS-combined'),null);
});
test('invalid or unavailable records fail without overwriting the saved data',()=>{
  for(const raw of ['invalid','null','[]','{"version":2,"completed":[]}','{"version":1,"completed":[1]}']){
    const storage=memory();storage.setItem(R.KEY,raw);
    assert.throws(()=>R.setCompleted(storage,'Shark',true));assert.equal(storage.getItem(R.KEY),raw);
  }
  const storage=memory();R.setCompleted(storage,'Shark',true);
  storage.setItem=()=>{throw Error('quota');};assert.throws(()=>R.setCompleted(storage,'Mantis',true));assert.deepEqual([...R.read(storage)],['Shark']);
});
