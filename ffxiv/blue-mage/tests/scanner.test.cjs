const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),S=require('../scanner.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../data.js'),'utf8'),context);const spells=context.window.BLUE_MAGE_DATA.spells;
test('game pages use 4 × 4 numbering with only 12 spells on page 8',()=>{const p=S.pagesFor(spells);assert.equal(p.length,8);assert.equal(p[0].spells.length,16);assert.deepEqual(Array.from(p[3].spells,s=>s.id),Array.from({length:16},(_,i)=>49+i));assert.deepEqual(Array.from(p[7].spells,s=>s.id),Array.from({length:12},(_,i)=>113+i));});
test('crop and pixel validation rejects malformed, tiny, out-of-bounds and wrong-shaped regions',async()=>{for(const rect of [null,{x:0,y:0,w:0,h:1},{x:.5,y:0,w:.8,h:1},{x:0,y:0,w:1,h:.1}])assert.ok(S.validateRect(rect,300,320));assert.ok(S.validateRect({x:0,y:0,w:1,h:1},60,60));await assert.rejects(S.analyze({width:300,height:320,data:[]},{x:0,y:0,w:1,h:1}));});
test('blank or unreadable images remain review items and cancellation interrupts analysis',async()=>{const image={width:288,height:256,data:new Uint8ClampedArray(288*256*4).fill(50)},crop={x:0,y:0,w:1,h:1};const results=await S.analyze(image,crop);assert.ok(results.every(r=>r.state==='review'));await assert.rejects(S.analyze(image,crop,{cancelled:()=>true}),/취소/);});
function pageHeader(selected=[]){
  const image={width:304,height:325,data:new Uint8ClampedArray(304*325*4).fill(55)};
  const fill=(x,y,w,h,rgb)=>{for(let py=y;py<y+h;py++)for(let px=x;px<x+w;px++)image.data.set([...rgb,255],(py*image.width+px)*4);};
  const digits=['00100/01100/00100/00100/00100/00100/01110','01110/10001/00001/00010/00100/01000/11111','11110/00001/00001/01110/00001/00001/11110','00010/00110/01010/10010/11111/00010/00010','11111/10000/10000/11110/00001/00001/11110','01110/10000/10000/11110/10001/10001/01110','11111/00001/00010/00100/01000/01000/01000','01110/10001/10001/01110/10001/10001/01110'];
  for(const page of selected){const left=6+26*(page-1);fill(left,8,24,2,[230,180,90]);fill(left,8,2,22,[230,180,90]);fill(left+22,8,2,22,[230,180,90]);fill(left,28,24,2,[230,180,90]);}
  digits.forEach((digit,i)=>digit.split('/').forEach((row,y)=>[...row].forEach((pixel,x)=>{if(pixel==='1')fill(13+26*i+x*2,13+y*2,2,2,[225,225,220]);})));
  fill(179,7,3,3,[90,240,120]);fill(205,7,3,3,[90,240,120]);return {image,fill};
}
test('selected page detection supports each tab and ignores green notification dots',()=>{
  for(let page=1;page<=8;page++)assert.equal(S.detectPage(pageHeader([page]).image)?.page,page,`page ${page}`);
});
test('missing, ambiguous or incomplete page headers require manual choice',()=>{
  assert.equal(S.detectPage(pageHeader().image),null);assert.equal(S.detectPage(pageHeader([1,4]).image),null);
  const partial=pageHeader([4]);partial.fill(10,11,15,17,[55,55,55]);assert.equal(S.detectPage(partial.image),null);
  assert.equal(S.detectPage(pageHeader([4]).image,{x:0,y:0,w:1,h:1}),null);
  for(const invalid of [null,{}, {width:300,height:320,data:[]}])assert.equal(S.detectPage(invalid),null);
});
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
test('private screenshot headers detect actual pages and abstain when cropped or uncertain',{skip:!process.env.BLUE_SCAN_FIXTURES},()=>{
  const fixtures=JSON.parse(fs.readFileSync(process.env.BLUE_SCAN_FIXTURES,'utf8'));
  for(const f of fixtures){const detected=S.detectPage(f),expected=f.name.startsWith('0-')?1:4;if(f.name.endsWith('cropped'))assert.equal(detected,null,f.name);else if(f.name==='0-jpeg')assert.ok(detected===null||detected.page===expected,f.name);else assert.equal(detected?.page,expected,f.name);}
});
