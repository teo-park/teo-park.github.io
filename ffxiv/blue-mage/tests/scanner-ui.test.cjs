const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom'),S=require('../scanner.js');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8'),tick=()=>new Promise(r=>setTimeout(r,1));
async function settle(a){for(let i=0;i<100;i++){await tick();if(!a.$('#scanAddImages').disabled)return;}throw Error('Scanner did not finish');}
function app({applyResult={ok:true},analyze,detectPage,decodeError=false}={}){
  const dom=new JSDOM(read('index.html'),{url:'https://example.test/ffxiv/blue-mage/',runScripts:'outside-only'}),w=dom.window,d=w.document,$=s=>d.querySelector(s),calls=[];
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  w.HTMLCanvasElement.prototype.getContext=()=>({drawImage(){},fillRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},getImageData(){return {width:304,height:325,data:new Uint8ClampedArray(304*325*4)};}});
  w.createImageBitmap=async()=>{if(decodeError)throw Error('깨진 이미지');return {width:304,height:325,close(){}};};
  w.eval(read('data.js'));w.BlueMageScanner={...S,analyze:analyze||(async(image,rect,{count})=>Array.from({length:count},(_,index)=>({index,state:index===0?'review':[2,5].includes(index)?'missing':'learned'})))};
  if(detectPage)w.BlueMageScanner.detectPage=detectPage;
  w.eval(read('scanner-ui.js'));w.BlueMageScanUI.mount({spells:w.BLUE_MAGE_DATA.spells,apply:ids=>{calls.push(ids);return applyResult;}});
  const change=(s,value)=>{const e=$(s);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatchEvent(new w.Event('change',{bubbles:true}));};
  const upload=async()=>{Object.defineProperty($('#scanFiles'),'files',{configurable:true,value:[new w.File(['fake'],'capture.png',{type:'image/png'})]});$('#scanFiles').dispatchEvent(new w.Event('change'));await settle({$});};
  return {dom,w,d,$,calls,change,upload};
}
test('overlay toggles states, requires page assignment and review, and submits only learned numbers',async t=>{
  const a=app();t.after(()=>a.dom.window.close());a.$('#openScan').click();await a.upload();assert.equal(a.d.querySelectorAll('.scan-cell').length,16);assert.equal(a.$('#scanReviewed').disabled,true);
  a.change('#scanPage','4');a.$('[data-scan-cell="0"]').click();assert.match(a.$('#scanCellTitle').textContent,/No.49/);assert.match(a.$('[data-scan-cell="0"]').textContent,/습득/);assert.equal(a.d.activeElement.dataset.scanCell,'0');assert.equal(a.$('#scanCanvas').width,304);assert.equal(a.$('#scanCanvas').height,325);assert.equal(a.$('#scanOverlay').style.width,'94.8%');a.change('#scanReviewed',true);assert.equal(a.$('#scanApply').disabled,false);
  a.$('[data-scan-cell="1"]').click();assert.equal(a.$('#scanReviewed').checked,false);assert.equal(a.$('#scanApply').disabled,true);assert.match(a.$('[data-scan-cell="1"]').textContent,/미습득/);
  a.$('#scanLearned').click();a.change('#scanReviewed',true);a.$('#scanApply').click();assert.equal(a.calls.length,1);assert.equal(a.calls[0].length,14);assert.ok(!a.calls[0].includes(51)&&!a.calls[0].includes(54));assert.equal(a.$('#scanDialog').open,false);
});
test('paste works only in the open scanner and duplicate page captures must be reassigned',async t=>{
  const a=app();t.after(()=>a.dom.window.close());const paste=()=>{const event=new a.w.Event('paste',{cancelable:true});Object.defineProperty(event,'clipboardData',{value:{items:[{kind:'file',type:'image/png',getAsFile:()=>new a.w.File(['fake'],'clipboard.png',{type:'image/png'})}]}});a.d.dispatchEvent(event);return event;};
  assert.equal(paste().defaultPrevented,false);a.$('#openScan').click();assert.equal(paste().defaultPrevented,true);await settle(a);a.change('#scanPage','1');a.$('#scanLearned').click();a.change('#scanReviewed',true);
  await a.upload();assert.equal(a.d.querySelectorAll('[data-scan-file]').length,2);a.change('#scanPage','1');a.$('#scanLearned').click();a.change('#scanReviewed',true);assert.equal(a.$('#scanApply').disabled,true);
  a.change('#scanPage','2');assert.equal(a.$('#scanReviewed').checked,false);a.change('#scanReviewed',true);assert.equal(a.$('#scanApply').disabled,false);a.$('#scanApply').click();assert.equal(a.calls[0].length,28);
});
test('page 8 reads only 12 cells and crop changes require reanalysis and review',async t=>{
  const a=app();t.after(()=>a.dom.window.close());a.$('#openScan').click();await a.upload();a.change('#scanPage','8');await settle(a);assert.equal(a.d.querySelectorAll('.scan-cell').length,12);assert.equal(a.d.querySelectorAll('.scan-unused').length,4);a.$('#scanLearned').click();a.change('#scanReviewed',true);assert.equal(a.$('#scanApply').disabled,false);
  a.$('#scanEditCrop').click();assert.equal(a.$('#scanApply').disabled,true);a.$('#scanFullImage').click();assert.equal(a.d.querySelectorAll('.scan-cell').length,0);a.$('#scanAnalyze').click();await settle(a);assert.equal(a.d.querySelectorAll('.scan-cell').length,12);assert.equal(a.$('#scanReviewed').checked,false);
});
test('failed writes preserve the reviewed capture and decode failures remain removable',async t=>{
  const a=app({applyResult:{ok:false,error:'저장 실패'}});t.after(()=>a.dom.window.close());a.$('#openScan').click();await a.upload();a.change('#scanPage','1');a.$('#scanLearned').click();a.change('#scanReviewed',true);a.$('#scanApply').click();assert.equal(a.$('#scanDialog').open,true);assert.match(a.$('#scanStatus').textContent,/저장 실패/);assert.equal(a.$('#scanReviewed').checked,true);
  const b=app({decodeError:true});t.after(()=>b.dom.window.close());b.$('#openScan').click();await b.upload();assert.match(b.$('#scanStatus').textContent,/깨진 이미지/);assert.equal(b.$('#scanApply').disabled,true);b.$('#scanRemove').click();assert.equal(b.d.querySelectorAll('[data-scan-file]').length,0);
});
test('closing cancels analysis and late results cannot enable registration',async t=>{
  let finish;const a=app({analyze:()=>new Promise(r=>{finish=r;})});t.after(()=>a.dom.window.close());a.$('#openScan').click();const upload=a.upload();for(let i=0;i<20&&!finish;i++)await tick();assert.ok(finish);a.$('#closeScan').click();finish(Array.from({length:16},(_,index)=>({index,state:'learned'})));await upload;a.$('#openScan').click();assert.equal(a.d.querySelectorAll('.scan-cell').length,0);assert.equal(a.$('#scanApply').disabled,true);
});
test('automatic page selection remaps labels, still requires review, and manual overrides survive reopening',async t=>{
  let attempts=0;const a=app({detectPage:()=>{attempts++;return {page:4};}});t.after(()=>a.dom.window.close());a.$('#openScan').click();await a.upload();assert.equal(a.$('#scanPage').value,'4');assert.match(a.$('#scanPageHelp').textContent,/4페이지를 자동/);assert.match(a.$('[data-scan-cell="0"]').textContent,/No.49/);assert.equal(a.$('#scanApply').disabled,true);
  a.change('#scanPage','3');assert.doesNotMatch(a.$('#scanPageHelp').textContent,/자동/);a.$('[data-scan-file="0"]').click();await settle(a);assert.equal(a.$('#scanPage').value,'3');assert.equal(attempts,1);a.$('#scanAnalyze').click();await settle(a);assert.equal(a.$('#scanPage').value,'3');assert.equal(attempts,1);
});
test('page 8 is recognized before determining the number of cells to analyze',async t=>{
  const a=app({detectPage:()=>({page:8})});t.after(()=>a.dom.window.close());a.$('#openScan').click();await a.upload();assert.equal(a.$('#scanPage').value,'8');assert.equal(a.d.querySelectorAll('.scan-cell').length,12);assert.match(a.$('[data-scan-cell="11"]').textContent,/No.124/);assert.equal(a.d.querySelectorAll('.scan-unused').length,4);
});
test('captures detect their own pages independently while uncertain results leave selection empty',async t=>{
  let attempt=0;const a=app({detectPage:()=>++attempt===1?{page:1}:attempt===2?{page:4}:null});t.after(()=>a.dom.window.close());a.$('#openScan').click();await a.upload();await a.upload();assert.equal(a.$('#scanPage').value,'4');a.$('[data-scan-file="0"]').click();await settle(a);assert.equal(a.$('#scanPage').value,'1');await a.upload();assert.equal(a.$('#scanPage').value,'');assert.match(a.$('#scanPageHelp').textContent,/직접 선택/);assert.equal(a.$('#scanApply').disabled,true);
});
