const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const S=require('../scanner.js'),data=require('../scan-icons.json'),context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../data.js'),'utf8'),context);
const minions=context.window.MINION_DATA.minions;
test('reference index covers the catalog once and contains valid, textured descriptors',()=>{
  const refs=S.references(data);assert.equal(refs.length,minions.length);assert.equal(new Set(refs.map(r=>r.id)).size,refs.length);
  assert.deepEqual(refs.map(r=>r.id).sort((a,b)=>a-b),Array.from(minions,m=>m.id).sort((a,b)=>a-b));
  for(const ref of refs){assert.ok(ref.texture>2);assert.ok(Math.abs(S.similarity(ref.vector,ref.vector)-1)<.001);}
  assert.throws(()=>S.references({size:16,icons:[[1,'broken']]}));
});
test('blank screenshots remain unconfirmed; partial pages respect count and invalid crops are rejected',async()=>{
  const image={width:200,height:240,data:new Uint8ClampedArray(200*240*4).fill(100)},rect={x:0,y:0,w:1,h:1};
  const results=await S.analyze(image,rect,S.references(data),{count:3,minions});
  assert.equal(results.length,3);assert.ok(results.every(r=>r.state==='review'));
  await assert.rejects(()=>S.analyze(image,rect,S.references(data),{count:31}));
  await assert.rejects(()=>S.analyze(image,{...rect,x:.5},S.references(data)));
  await assert.rejects(()=>S.analyze(image,rect,S.references(data),{cancelled:()=>true}),/취소/);
  assert.deepEqual(S.defaultCrop(250,300),rect);
});
test('game order skips absent IDs and can distinguish similar candidates without forcing a conflicting anchor',()=>{
  const list=[{id:1,order:1},{id:2,order:2},{id:3,order:3},{id:4,order:4},{id:5,order:5}];
  const results=[{index:0,id:2,state:'match',candidates:[{id:2,score:.96}]},{index:1,id:1,state:'review',candidates:[{id:1,score:.83},{id:3,score:.8}]},{index:2,id:5,state:'match',candidates:[{id:5,score:.96}]}];
  S.applyOrder(results,list);assert.equal(results[1].id,3);assert.equal(results[1].state,'match');assert.equal(results[1].usedOrder,true);
  const reverse=[{index:0,id:4,state:'match',candidates:[]},{index:1,id:2,state:'match',candidates:[]}];
  S.applyOrder(reverse,list);assert.ok(reverse.every(r=>r.state==='review'));assert.deepEqual(reverse.map(r=>r.id),[4,2]);
});
test('unreviewed, uncertain and unknown IDs are rejected, excluded cells omitted and repeated images deduplicated',()=>{
  const id=minions[0].id,entry={reviewed:true,results:[{state:'match',id},{state:'skip',id:minions[1].id}]};
  assert.deepEqual(S.prepareImport([entry,entry],minions),[id]);
  for(const entries of [[],[{...entry,reviewed:false}],[{reviewed:true,results:[{state:'review',id}]}],[{reviewed:true,results:[{state:'match',id:999999}]}],[{reviewed:true,results:[{state:'skip'}]}]])assert.throws(()=>S.prepareImport(entries,minions));
});

test('a minion missing from the initial shortlist is rechecked between recognized neighbors',()=>{
  const antelope=minions.find(m=>m.name==='꼬마 영양'),imp=minions.find(m=>m.name==='아기 임프'),coeurl=minions.find(m=>m.name==='꼬마 커얼'),wrong=minions.find(m=>m.name==='테미스 인형');
  const results=[{index:0,id:antelope.id,state:'match',candidates:[{id:antelope.id,score:.77}]},{index:1,id:wrong.id,state:'review',candidates:[{id:wrong.id,score:.67}]},{index:2,id:coeurl.id,state:'match',candidates:[{id:coeurl.id,score:.81}]}];
  let calls=0;
  S.applyOrder(results,minions,(index,ids)=>{calls++;assert.equal(index,1);assert.deepEqual(ids,[imp.id]);return [{id:imp.id,score:.785}];});
  assert.equal(calls,1);assert.equal(results[1].id,imp.id);assert.equal(results[1].state,'match');assert.deepEqual(results[1].orderContext,{before:antelope.id,after:coeurl.id});
  assert.ok(results[1].candidates.some(c=>c.id===imp.id));
});

test('a unique order gap still needs matching pixels; uncertain color variants stay unconfirmed',()=>{
  const list=[{id:1,order:1},{id:2,order:2},{id:3,order:3},{id:4,order:4}];
  const entries=()=>[{index:0,id:1,state:'match',candidates:[{id:1,score:.9}]},{index:1,id:4,state:'review',candidates:[{id:4,score:.6}]},{index:2,id:3,state:'match',candidates:[{id:3,score:.9}]}];
  const weak=entries();S.applyOrder(weak,list,()=>[{id:2,score:.2}]);assert.equal(weak[1].state,'review');assert.equal(weak[1].id,4);
  const ambiguous=entries();ambiguous[2]={index:2,id:4,state:'match',candidates:[{id:4,score:.9}]};
  S.applyOrder(ambiguous,list,()=>[{id:2,score:.82},{id:3,score:.81}]);assert.equal(ambiguous[1].state,'review');
  const noEnd=entries().slice(0,2);S.applyOrder(noEnd,list,()=>{assert.fail('One neighbor cannot bound a recheck');});assert.equal(noEnd[1].state,'review');
});

test('refining a single bounded reference is supported without making a blank cell a match',()=>{
  const image={width:200,height:240,data:new Uint8ClampedArray(200*240*4).fill(100)};
  const result=S.matchCell(image,{x:0,y:0,w:1,h:1},0,S.references(data).slice(0,1));
  assert.equal(result.candidates.length,1);assert.equal(result.state,'review');assert.equal(result.score,0);
});
