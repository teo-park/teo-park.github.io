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

test('a single missing minion is inferred between consecutive recognized neighbors without rechecking pixels',()=>{
  const antelope=minions.find(m=>m.name==='꼬마 영양'),imp=minions.find(m=>m.name==='아기 임프'),coeurl=minions.find(m=>m.name==='꼬마 커얼'),wrong=minions.find(m=>m.name==='테미스 인형');
  const results=[{index:0,id:antelope.id,state:'match',candidates:[{id:antelope.id,score:.77}]},{index:1,id:wrong.id,state:'review',candidates:[{id:wrong.id,score:.67}]},{index:2,id:coeurl.id,state:'match',candidates:[{id:coeurl.id,score:.81}]}];
  S.applyOrder(results,minions,()=>assert.fail('The unique order assignment needs no pixel comparison'));
  assert.equal(results[1].id,imp.id);assert.equal(results[1].state,'match');assert.deepEqual(results[1].orderContext,{before:antelope.id,after:coeurl.id,count:1});
  assert.ok(results[1].candidates.some(c=>c.id===imp.id));
});

test('an exact gap bypasses weak pixels while ambiguous gaps and a single endpoint stay unconfirmed',()=>{
  const list=[{id:1,order:1},{id:2,order:2},{id:3,order:3},{id:4,order:4}];
  const entries=()=>[{index:0,id:1,state:'match',candidates:[{id:1,score:.9}]},{index:1,id:4,state:'review',candidates:[{id:4,score:.6}]},{index:2,id:3,state:'match',candidates:[{id:3,score:.9}]}];
  const weak=entries();S.applyOrder(weak,list,()=>assert.fail('No image threshold for an exact gap'));assert.equal(weak[1].state,'match');assert.equal(weak[1].id,2);assert.equal(weak[1].inferredByCount,true);assert.deepEqual(weak[1].candidateRange,[2]);
  const ambiguous=entries();ambiguous[2]={index:2,id:4,state:'match',candidates:[{id:4,score:.9}]};
  S.applyOrder(ambiguous,list,()=>[{id:2,score:.82},{id:3,score:.81}]);assert.equal(ambiguous[1].state,'review');
  const noEnd=entries().slice(0,2);S.applyOrder(noEnd,list,()=>{assert.fail('One neighbor cannot bound a recheck');});assert.equal(noEnd[1].state,'review');
});

test('refining a single bounded reference is supported without making a blank cell a match',()=>{
  const image={width:200,height:240,data:new Uint8ClampedArray(200*240*4).fill(100)};
  const result=S.matchCell(image,{x:0,y:0,w:1,h:1},0,S.references(data).slice(0,1));
  assert.equal(result.candidates.length,1);assert.equal(result.state,'review');assert.equal(result.score,0);
});

const orderedList=Array.from({length:8},(_,i)=>({id:i+1,order:i+1}));
const cell=(index,id,state='review',manual=false)=>({index,id,state,manual,score:.9,candidates:[{id,score:.9}]});
test('manual endpoints narrow candidates and a later match cascades back to an earlier ambiguous cell',()=>{
  const results=[cell(0,1,'match',true),cell(1,8),cell(2,7),cell(3,6,'match',true)],ranges=[];
  S.applyOrder(results,orderedList,(index,ids)=>{
    ranges.push([index,[...ids]]);
    return index===2?[{id:3,score:.9}]:ids.includes(3)?[{id:2,score:.8},{id:3,score:.78}]:[{id:2,score:.8}];
  });
  assert.deepEqual(results.map(r=>r.id),[1,2,3,6]);assert.ok(results.every(r=>r.state==='match'));
  assert.deepEqual(ranges,[[1,[2,3,4,5]],[2,[2,3,4,5]]]);
  assert.deepEqual(results[1].candidates,[{id:2,score:null}]);assert.deepEqual(results[1].candidateRange,[2]);assert.equal(results[1].inferredByCount,true);
  assert.equal(results[0].manual,true);assert.equal(results[3].manual,true);
});

test('manual anchors override conflicting automatic matches; conflicting manual choices remain editable',()=>{
  const results=[cell(0,3,'match',true),cell(1,2,'match'),cell(2,6,'match',true)];
  S.applyOrder(results,orderedList,()=>[{id:4,score:.3},{id:5,score:.2}]);
  assert.deepEqual(results.map(r=>r.id),[3,4,6]);assert.equal(results[1].state,'review');
  assert.deepEqual(results[1].candidateRange,[4,5]);assert.ok(results.every(r=>!r.orderConflict));
  const conflict=[cell(0,6,'match',true),cell(1,3,'match',true)];
  S.applyOrder(conflict,orderedList);assert.deepEqual(conflict.map(r=>r.id),[6,3]);
  assert.ok(conflict.every(r=>r.state==='match'&&r.orderConflict));
  assert.throws(()=>S.prepareImport([{reviewed:true,results:conflict}],orderedList),/순서/);
});

test('excluded cells are never revived and a review candidate cannot invalidate a confirmed choice',()=>{
  const results=[cell(0,1,'match',true),cell(1,2,'skip',true),cell(2,8),cell(3,5,'match',true)];
  S.applyOrder(results,orderedList,(index)=>{assert.equal(index,2);return [{id:3,score:.3},{id:4,score:.29}];});
  assert.equal(results[1].state,'skip');assert.equal(results[1].id,2);assert.equal(results[2].state,'review');
  const ambiguous=[cell(0,2,'match',true),cell(1,2)];S.applyOrder(ambiguous,orderedList);
  assert.equal(ambiguous[0].state,'match');assert.equal(ambiguous[0].orderConflict,undefined);
});

test('editing or removing an anchor restores original evidence before rechecking, and order-off keeps manual edits',async()=>{
  const image={width:200,height:240,data:new Uint8ClampedArray(200*240*4).fill(100)},rect={x:0,y:0,w:1,h:1},refs=S.references(data);
  const results=[cell(0,1,'match',true),cell(1,8),cell(2,4,'match',true),cell(3,7,'skip',true)];
  let next=await S.refine(image,rect,refs,results,{minions:orderedList});
  assert.deepEqual(next[1].candidateRange,[2,3]);assert.equal(next[1].state,'review');
  next[2].id=6;next=await S.refine(image,rect,refs,next,{minions:orderedList});
  assert.deepEqual(next[1].candidateRange,[2,3,4,5]);assert.equal(next[1].original.id,8);
  const off=await S.refine(image,rect,refs,next,{minions:orderedList,useOrder:false});
  assert.equal(off[1].id,8);assert.equal(off[1].candidateRange,undefined);assert.equal(off[2].id,6);assert.equal(off[3].state,'skip');
  next[2].state='skip';next=await S.refine(image,rect,refs,next,{minions:orderedList});
  assert.deepEqual(next[1].candidateRange,[2,3,4,5,6,7,8]);assert.equal(next[1].id,8);assert.equal(next[2].state,'skip');
  const before=JSON.stringify(next);
  await assert.rejects(()=>S.refine(image,rect,refs,next,{minions:orderedList,cancelled:()=>true}),/취소/);
  assert.equal(JSON.stringify(next),before);
});

test('confirming 7 after 3 fills the three intervening slots as 4, 5, 6 without any image evidence',()=>{
  const results=[cell(0,3,'match'),cell(1,8),cell(2,1),cell(3,2),cell(4,7,'match',true)];
  for(const r of results.slice(1,4)){r.score=0;r.candidates=[];}
  S.applyOrder(results,orderedList,()=>assert.fail('Exact sequence must not read pixels'));
  assert.deepEqual(results.map(r=>r.id),[3,4,5,6,7]);assert.ok(results.every(r=>r.state==='match'));
  for(const r of results.slice(1,4)){
    assert.equal(r.inferredByCount,true);assert.equal(r.score,null);
    assert.deepEqual(r.orderContext,{before:3,after:7,count:3});
  }
  assert.deepEqual(S.prepareImport([{reviewed:true,results}],orderedList),[3,4,5,6,7]);
});

test('exact gaps use game rank across row boundaries and retain excluded physical slots',()=>{
  const list=[{id:900,order:30},{id:70,order:10},{id:2,order:50},{id:25,order:40},{id:8,order:20}];
  const results=[cell(0,null,'skip',true),cell(1,null,'skip',true),cell(2,null,'skip',true),cell(3,70,'match',true),cell(4,2),cell(5,null,'skip',true),cell(6,70),cell(7,2,'match',true)];
  S.applyOrder(results,list,()=>assert.fail('Use physical slot count even when a slot is excluded'));
  assert.equal(results[4].id,8);assert.equal(results[6].id,25);
  assert.equal(results[5].id,null);assert.equal(results[5].state,'skip');
  assert.deepEqual(S.prepareImport([{reviewed:true,results}],list),[70,8,25,2]);
});

test('nonexact or conflicting ranges do not invent a consecutive sequence',()=>{
  for(const results of [
    [cell(0,3,'match',true),cell(1,8),cell(2,1),cell(3,7,'match',true)],
    [cell(0,3,'match',true),cell(1,8),cell(2,1),cell(3,5,'match',true)],
    [cell(0,7,'match',true),cell(1,8),cell(2,1),cell(3,4,'match',true)]
  ]){
    S.applyOrder(results,orderedList,(index,ids)=>ids.map(id=>({id,score:0})));
    assert.ok(results.slice(1,-1).every(r=>r.state==='review'&&!r.inferredByCount));
  }
});

test('correcting an endpoint or disabling order removes old count deductions without changing manual choices',async()=>{
  const image={width:200,height:240,data:new Uint8ClampedArray(200*240*4).fill(100)},rect={x:0,y:0,w:1,h:1};
  const results=[cell(0,3,'match',true),cell(1,8),cell(2,1),cell(3,2),cell(4,7,'match',true)],refs=S.references(data);
  let next=await S.refine(image,rect,refs,results,{minions:orderedList});
  assert.deepEqual(next.map(r=>r.id),[3,4,5,6,7]);assert.ok(next.slice(1,4).every(r=>r.inferredByCount));
  const off=await S.refine(image,rect,refs,next,{minions:orderedList,useOrder:false});
  assert.deepEqual(off.map(r=>r.id),[3,8,1,2,7]);assert.ok(off.slice(1,4).every(r=>r.state==='review'&&!r.inferredByCount));
  next[4].id=8;next=await S.refine(image,rect,refs,next,{minions:orderedList});
  assert.equal(next[4].id,8);assert.equal(next[4].manual,true);assert.ok(next.slice(1,4).every(r=>r.state==='review'&&!r.inferredByCount));
});
