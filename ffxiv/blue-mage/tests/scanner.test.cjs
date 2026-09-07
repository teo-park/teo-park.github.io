const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),S=require('../scanner.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../data.js'),'utf8'),context);const spells=context.window.BLUE_MAGE_DATA.spells;
test('game pages use 4 × 4 numbering with only 12 spells on page 8',()=>{const p=S.pagesFor(spells);assert.equal(p.length,8);assert.equal(p[0].spells.length,16);assert.deepEqual(Array.from(p[3].spells,s=>s.id),Array.from({length:16},(_,i)=>49+i));assert.deepEqual(Array.from(p[7].spells,s=>s.id),Array.from({length:12},(_,i)=>113+i));});
test('crop and pixel validation rejects malformed, tiny, out-of-bounds and wrong-shaped regions',async()=>{for(const rect of [null,{x:0,y:0,w:0,h:1},{x:.5,y:0,w:.8,h:1},{x:0,y:0,w:1,h:.1}])assert.ok(S.validateRect(rect,300,320));assert.ok(S.validateRect({x:0,y:0,w:1,h:1},60,60));await assert.rejects(S.analyze({width:300,height:320,data:[]},{x:0,y:0,w:1,h:1}));});
test('blank or unreadable images remain review items and cancellation interrupts analysis',async()=>{const image={width:288,height:256,data:new Uint8ClampedArray(288*256*4).fill(50)},crop={x:0,y:0,w:1,h:1};const results=await S.analyze(image,crop);assert.ok(results.every(r=>r.state==='review'));await assert.rejects(S.analyze(image,crop,{cancelled:()=>true}),/취소/);});
test('import requires explicit unique page choices and full review, and only adds learned numbers',()=>{
  const entry={page:4,reviewed:true,results:Array.from({length:16},(_,index)=>({index,state:[2,5,10,11,12].includes(index)?'missing':'learned'}))};
  assert.deepEqual(S.prepareImport([entry],spells),[49,50,52,53,55,56,57,58,62,63,64]);
  for(const bad of [[{...entry,page:0}],[{...entry,reviewed:false}],[entry,entry],[{...entry,results:entry.results.slice(1)}],[{...entry,results:entry.results.map(r=>({...r,state:'review'}))}],[{...entry,results:entry.results.map(r=>({...r,state:'missing'}))}]])assert.throws(()=>S.prepareImport(bad,spells));
  const last={page:8,reviewed:true,results:Array.from({length:12},(_,index)=>({index,state:'learned'}))};assert.deepEqual(S.prepareImport([last],spells),Array.from({length:12},(_,i)=>113+i));
});
test('private sample regressions: question marks, selection glow, inactive checkboxes, resizing and JPEG',{skip:!process.env.BLUE_SCAN_FIXTURES},async()=>{
  const fixtures=JSON.parse(fs.readFileSync(process.env.BLUE_SCAN_FIXTURES,'utf8'));
  for(const f of fixtures){const result=await S.analyze(f,S.defaultCrop(f.width,f.height));assert.deepEqual(result.map((r,i)=>r.state==='missing'?i:null).filter(n=>n!==null),f.missing,f.name);assert.equal(result.filter(r=>r.state==='review').length,0,f.name);}
});
