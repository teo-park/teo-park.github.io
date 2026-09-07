const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom'),S=require('../scanner.js');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
async function settle(ui){for(let i=0;i<100;i++){await tick();if(!ui.$('#scanAddImages').disabled)return;}throw Error('Scanner did not finish');}
function app({applyResult={ok:true},decodeError=false,analyze}={}){
  const dom=new JSDOM(read('index.html'),{url:'https://example.test/ffxiv/minions/',runScripts:'outside-only'}),w=dom.window,d=w.document,$=s=>d.querySelector(s),calls=[];
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  w.HTMLCanvasElement.prototype.getContext=()=>({drawImage(){},fillRect(){},clearRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},getImageData(){return {width:250,height:300,data:new Uint8ClampedArray(250*300*4)};}});
  w.createImageBitmap=async()=>{if(decodeError)throw Error('깨진 이미지');return {width:250,height:300,close(){}};};
  for(const file of ['data.js','engine.js'])w.eval(read(file));const minions=w.MINION_DATA.minions;
  w.MinionScanner={...S,analyze:analyze||(async(image,rect,refs,{count})=>Array.from({length:count},(_,index)=>({index,id:minions[index].id,state:index===0?'review':'match',candidates:[{id:minions[index].id,score:.9},{id:minions[100].id,score:.6}]})))};
  w.fetch=async()=>({ok:true,json:async()=>JSON.parse(read('scan-icons.json'))});
  w.eval(read('scanner-ui.js'));w.MinionScanUI.mount({minions,apply:ids=>{calls.push(ids);return applyResult;}});
  const change=(s,value)=>{const el=$(s);if(el.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new w.Event('change',{bubbles:true}));};
  const upload=async(files=[new w.File(['fake'],'sample.png',{type:'image/png'})])=>{Object.defineProperty($('#scanFiles'),'files',{configurable:true,value:files});$('#scanFiles').dispatchEvent(new w.Event('change'));await settle({$});};
  return {dom,w,d,$,calls,minions,change,upload};
}
test('review overlay edits candidates, excludes cells, invalidates review after changes and applies once confirmed',async t=>{
  const a=app();t.after(()=>a.dom.window.close());a.$('#openScan').click();await a.upload();
  assert.equal(a.d.querySelectorAll('.scan-cell').length,30);assert.equal(a.$('#scanReviewed').disabled,true);assert.equal(a.$('#scanApply').disabled,true);
  a.$('#scanCandidateList button').click();a.change('#scanReviewed',true);assert.equal(a.$('#scanApply').disabled,false);
  a.$('#scanSkipCell').click();assert.equal(a.$('#scanReviewed').checked,false);assert.equal(a.$('#scanApply').disabled,true);
  a.change('#scanReviewed',true);a.$('#scanApply').click();
  assert.equal(a.calls.length,1);assert.equal(a.calls[0].length,29);assert.ok(!a.calls[0].includes(a.minions[0].id));assert.equal(a.$('#scanDialog').open,false);
});
test('clipboard images only import in the open dialog; multiple captures stay separate and deduplicate on apply',async t=>{
  const a=app();t.after(()=>a.dom.window.close());
  const paste=()=>{const event=new a.w.Event('paste',{cancelable:true});Object.defineProperty(event,'clipboardData',{value:{items:[{kind:'file',type:'image/png',getAsFile:()=>new a.w.File(['fake'],'paste.png',{type:'image/png'})}]}});a.d.dispatchEvent(event);return event;};
  assert.equal(paste().defaultPrevented,false);assert.equal(a.d.querySelectorAll('[data-scan-file]').length,0);
  a.$('#openScan').click();assert.equal(paste().defaultPrevented,true);await settle(a);
  a.$('#scanCandidateList button').click();a.change('#scanReviewed',true);
  await a.upload();assert.equal(a.d.querySelectorAll('[data-scan-file]').length,2);assert.equal(a.$('#scanApply').disabled,true);
  a.$('#scanCandidateList button').click();a.change('#scanReviewed',true);a.$('#scanApply').click();assert.equal(a.calls[0].length,30);
});
test('partial pages and crop edits require reanalysis; malformed files and failed storage do not close the review',async t=>{
  const a=app({applyResult:{ok:false,error:'저장 실패'}});t.after(()=>a.dom.window.close());a.$('#openScan').click();await a.upload();
  a.change('#scanCount','3');await settle(a);assert.equal(a.d.querySelectorAll('.scan-cell').length,3);assert.equal(a.d.querySelectorAll('.scan-unused').length,27);
  a.$('#scanCandidateList button').click();a.change('#scanReviewed',true);a.$('#scanApply').click();assert.equal(a.$('#scanDialog').open,true);assert.match(a.$('#scanStatus').textContent,/저장 실패/);
  a.$('#scanEditCrop').click();assert.equal(a.$('#scanApply').disabled,true);a.$('#scanFullImage').click();assert.equal(a.d.querySelectorAll('.scan-cell').length,0);
  const b=app({decodeError:true});t.after(()=>b.dom.window.close());b.$('#openScan').click();await b.upload();assert.match(b.$('#scanStatus').textContent,/깨진 이미지/);assert.equal(b.$('#scanApply').disabled,true);b.$('#scanRemove').click();assert.equal(b.d.querySelectorAll('[data-scan-file]').length,0);
});
test('closing the dialog cancels pending analysis so late results cannot be applied',async t=>{
  let finish;const a=app({analyze:()=>new Promise(resolve=>{finish=resolve;})});t.after(()=>a.dom.window.close());a.$('#openScan').click();
  Object.defineProperty(a.$('#scanFiles'),'files',{value:[new a.w.File(['fake'],'sample.png',{type:'image/png'})]});a.$('#scanFiles').dispatchEvent(new a.w.Event('change'));
  for(let i=0;i<10&&!finish;i++)await tick();assert.ok(finish);a.$('#closeScan').click();finish([]);await tick();a.$('#openScan').click();
  assert.equal(a.d.querySelectorAll('.scan-cell').length,0);assert.equal(a.$('#scanApply').disabled,true);
});
