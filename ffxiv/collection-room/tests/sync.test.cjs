const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../model.js'),{create}=require('../sync-engine.js');
const catalog=require('../catalog.json');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function storage(){const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,String(value)),removeItem:key=>map.delete(key)};}
function mark(s,book,id,value=1,wanted=false){const b=M.BOOKS.find(b=>b.id===book),entries=M.readBook(s,b);entries[id]={value,wanted};M.writeBook(s,b,entries);}
function harness({s=storage(),write=async()=>{}}={}){
  const writes=[],statuses=[];
  const e=create({model:M,storage:s,uid:'alice',applyLocal:books=>{for(const b of M.BOOKS)M.writeBook(s,b,books[b.id]||{});},writeRemote:async patch=>{writes.push(patch);await write(patch);},onStatus:(status,error)=>statuses.push([status,error])});return {e,s,writes,statuses};
}
test('all six existing notebook formats round-trip; notes, fishing sync metadata and unknown IDs survive',()=>{
  const s=storage();
  for(const b of M.BOOKS.filter(b=>b.id!=='weapons'))s.setItem(b.key,JSON.stringify({type:b.type,schemaVersion:1,[b.field]:[1,999999],sync:{version:1,book:[1],ocean:[],extras:{indigo:{},ruby:{}}}}));
  const weapon=M.BOOKS.find(b=>b.id==='weapons');s.setItem(weapon.key,JSON.stringify({format:'teo-ffxiv-weapons',version:1,records:{'zodiac.PLD.weapon':{itemId:10054,target:true,note:'개인 메모'}}}));
  const before=M.readLocal(s);assert.equal(JSON.stringify(before).includes('개인 메모'),false);
  for(const b of M.BOOKS)M.writeBook(s,b,before[b.id]);
  assert.deepEqual(M.readLocal(s),before);
  assert.equal(JSON.parse(s.getItem(weapon.key)).records['zodiac.PLD.weapon'].note,'개인 메모');
  assert.deepEqual(JSON.parse(s.getItem(M.BOOKS.find(b=>b.id==='fishing').key)).sync.book,[1]);
});
test('malformed original records fail before overwriting and unsafe remote IDs are rejected',()=>{
  const s=storage(),b=M.BOOKS[0],raw='{"type":"other","learned":[1]}';s.setItem(b.key,raw);
  assert.throws(()=>M.writeBook(s,b,{'1':{value:1,wanted:false}}));assert.equal(s.getItem(b.key),raw);
  for(const books of [{'blue-mage':{bad:{value:1,wanted:false}}},{weapons:{'x.PLD.weapon':{value:1,wanted:false}}},{'blue-mage':{'1':{value:2,wanted:false}}}])assert.throws(()=>M.normalize(books));
});
test('initial merge unions collections and wishes, using weapon stage order instead of numeric IDs',()=>{
  const book='weapons',item=catalog.books.weapons.items.find(t=>t.stages.some((s,i)=>i>0&&s.id<t.stages[i-1].id));assert.ok(item);
  const index=item.stages.findIndex((s,i)=>i>0&&s.id<item.stages[i-1].id),old=item.stages[index-1].id,later=item.stages[index].id;
  const merged=M.mergeInitial({[book]:{[item.id]:{value:old,wanted:true}},'blue-mage':{'1':{value:1,wanted:false}}},{[book]:{[item.id]:{value:later,wanted:false}},'blue-mage':{'2':{value:1,wanted:true}}},catalog);
  assert.equal(merged.weapons[item.id].value,later);assert.equal(merged.weapons[item.id].wanted,true);assert.equal(merged['blue-mage']['1'].value,1);assert.equal(merged['blue-mage']['2'].value,1);
});
test('diff records both unchecks and wish removals without resending unrelated fields',()=>{
  assert.deepEqual(M.diff({'blue-mage':{'1':{value:1,wanted:true},'2':{value:1,wanted:false}}},{'blue-mage':{'2':{value:1,wanted:false}}}),{'blue-mage/1/value':0,'blue-mage/1/wanted':false});
});
test('Firebase numeric arrays decode into ID maps without treating null holes as collected items',()=>{
  const data=[null,{value:1,wanted:false},null,{value:0,wanted:true},{value:1}];
  const books=M.normalize({'blue-mage':data,'triple-triad':data,minions:data,beastmaster:data,fishing:data});
  for(const book of ['blue-mage','triple-triad','minions','beastmaster','fishing'])assert.deepEqual(books[book],{'1':{value:1,wanted:false},'3':{value:0,wanted:true},'4':{value:1,wanted:false}});
  assert.throws(()=>M.normalize({weapons:data}));assert.throws(()=>M.normalize({'blue-mage':[{value:1,wanted:false}]}));
});
test('initial import, room snapshots and realtime unchecks accept Firebase array snapshots',async()=>{
  const h=harness();h.e.receive({'blue-mage':[null,{value:1,wanted:false},{value:1,wanted:true}]});
  assert.deepEqual(JSON.parse(h.s.getItem(M.BOOKS[0].key)).learned,[1,2]);
  h.e.receive({'blue-mage':[null,{value:0,wanted:false},{value:1,wanted:true}]});
  assert.deepEqual(JSON.parse(h.s.getItem(M.BOOKS[0].key)).learned,[2]);
  mark(h.s,'blue-mage','3');h.e.change();await tick();assert.deepEqual(h.writes.at(-1),{'blue-mage/3/value':1});
  const merged=M.mergeInitial({'blue-mage':[null,{value:1}]},{'blue-mage':{'2':{value:1,wanted:false}}},catalog);
  assert.equal(merged['blue-mage']['1'].value,1);assert.equal(merged['blue-mage']['2'].value,1);
});
test('notebook checks and room checks use the same local store and send only changed fields',async()=>{
  const h=harness();h.e.receive({});mark(h.s,'blue-mage','1');h.e.change();await tick();
  assert.deepEqual(h.writes,[{'blue-mage/1/value':1}]);assert.deepEqual(h.e.pending,{});
  h.e.receive({'blue-mage':{'1':{value:1,wanted:false}}});mark(h.s,'blue-mage','1',0);h.e.change();await tick();
  assert.deepEqual(h.writes.at(-1),{'blue-mage/1/value':0});assert.equal(M.readLocal(h.s)['blue-mage']['1'],undefined);
});
test('offline uncheck persists across reload and wins over an old server snapshot',async()=>{
  const s=storage();mark(s,'blue-mage','1');const h=harness({s,write:async()=>{throw Error('offline');}});
  h.e.receive({'blue-mage':{'1':{value:1,wanted:false}}});mark(s,'blue-mage','1',0);h.e.change();await tick();assert.equal(h.e.pending['blue-mage/1/value'],0);h.e.stop();
  const next=harness({s});next.e.receive({'blue-mage':{'1':{value:1,wanted:false}}});await tick();
  assert.equal(M.readLocal(s)['blue-mage']['1'],undefined);assert.deepEqual(next.writes,[{'blue-mage/1/value':0}]);
});
test('edits made while all pages are closed are diffed against last persisted notebook state',async()=>{
  const h=harness();h.e.receive({});h.e.stop();mark(h.s,'minions','7');const next=harness({s:h.s});
  next.e.receive({'blue-mage':{'2':{value:1,wanted:false}}});await tick();
  assert.deepEqual(next.writes,[{'minions/7/value':1}]);assert.equal(M.readLocal(h.s)['blue-mage']['2'].value,1);
});
test('remote device changes preserve independent local pending fields',async()=>{
  const h=harness({write:async()=>{throw Error('offline');}});h.e.receive({});mark(h.s,'blue-mage','1',0,true);h.e.change();await tick();
  h.e.receive({'blue-mage':{'1':{value:1,wanted:false},'2':{value:1,wanted:false}}});await tick();
  const local=M.readLocal(h.s);assert.deepEqual(local['blue-mage']['1'],{value:1,wanted:true});assert.equal(local['blue-mage']['2'].value,1);
});
test('a second change during an in-flight write is not removed by the first acknowledgement',async()=>{
  let finish;const h=harness({write:()=>new Promise(resolve=>{finish=resolve;})});h.e.receive({});mark(h.s,'blue-mage','1');h.e.change();
  mark(h.s,'blue-mage','1',0);h.e.change();finish();await tick();assert.equal(h.writes.length,2);assert.deepEqual(h.writes[1],{'blue-mage/1/value':0});finish();await tick();assert.deepEqual(h.e.pending,{});
});
test('remote unchecks are applied to the original notebook without reviving unknown IDs',()=>{
  const h=harness();h.e.receive({'blue-mage':{'1':{value:1,wanted:false},'999999':{value:1,wanted:false}}});
  h.e.receive({'blue-mage':{'1':{value:0,wanted:false},'999999':{value:1,wanted:false}}});
  assert.deepEqual(JSON.parse(h.s.getItem(M.BOOKS[0].key)).learned,[999999]);
});
test('late data after logout cannot restore records or clear the persisted outbox',async()=>{
  let finish;const h=harness({write:()=>new Promise(resolve=>{finish=resolve;})});h.e.receive({});mark(h.s,'blue-mage','1');h.e.change();h.e.stop();
  h.e.receive({'blue-mage':{'2':{value:1,wanted:false}}});finish();await tick();
  assert.equal(M.readLocal(h.s)['blue-mage']['2'],undefined);assert.equal(h.e.pending['blue-mage/1/value'],1);
});
test('password proofs are deterministic per room, salted across rooms, and reject short passwords',async()=>{
  const p=await M.passwordProof('우리부대123456','a'.repeat(32));assert.match(p,/^[a-f0-9]{64}$/);assert.equal(await M.passwordProof('우리부대123456','a'.repeat(32)),p);assert.notEqual(await M.passwordProof('우리부대123456','b'.repeat(32)),p);assert.match(await M.passwordProof('1234','a'.repeat(32)),/^[a-f0-9]{64}$/);await assert.rejects(M.passwordProof('123','a'.repeat(32)),/4~128/);
});
test('matching distinguishes missing, wanted, and completed stages and supports Korean initials',()=>{
  assert.equal(M.matches('물대포 · 아마쟈','ㅁㄷㅍ'),true);assert.equal(M.complete('blue-mage',{id:'1'},{value:1,wanted:false}),true);const item=catalog.books.weapons.items[0];assert.equal(M.complete('weapons',item,{value:item.stages[0].id}),false);assert.equal(M.complete('weapons',item,{value:item.stages.at(-1).id}),true);
});
test('new project uses a separate binding and outbox while preserving legacy state and notebook checks',()=>{
  const s=storage(),legacy='teo-ffxiv.collection-outbox.v1.alice',old='legacy queue stays intact';s.setItem(legacy,old);s.setItem('teo-ffxiv.collection-binding.v1',JSON.stringify({uid:'old-project-user'}));mark(s,'blue-mage','2');
  const h=harness({s});assert.notEqual(M.BINDING_KEY,'teo-ffxiv.collection-binding.v1');assert.notEqual(h.e.key,legacy);assert.match(h.e.key,/teo-ffxiv/);assert.equal(s.getItem(legacy),old);assert.equal(M.readLocal(s)['blue-mage']['2'].value,1);
});
