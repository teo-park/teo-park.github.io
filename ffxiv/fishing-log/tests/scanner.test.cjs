const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const S=require('../scanner.js'),E=require('../engine.js'),{D,KEY,open}=require('./helpers.cjs');
const rows=(state='learned')=>Array.from({length:100},(_,index)=>({index,state}));
test('capture pages keep rod and spear separate, ignore only unused final slots and reject incomplete reviews',()=>{
 const pages=S.pagesFor(D.fishes);assert.equal(pages.length,19);assert.equal(pages.find(p=>p.key==='rod:6').items[0].id,20072);assert.equal(pages.find(p=>p.key==='spear:3').items.length,89);
 const e={page:'spear:3',reviewed:true,results:rows().map((r,i)=>({...r,state:i<89?'learned':'review'}))};assert.equal(S.prepareImport([e],D.fishes).length,89);
 for(const entries of [[],[{...e,page:''}],[e,e],[{...e,reviewed:false}],[{...e,results:rows('review')}],[{...e,results:rows('missing')}]])assert.throws(()=>S.prepareImport(entries,D.fishes));
 assert.equal(S.prepareImport([{...e,page:'rod:1',results:rows()},{...e,page:'spear:1',results:rows()}],D.fishes).length,200);
});
test('blank images require review; invalid crops and cancellation cannot produce importable records',async()=>{
 const pixels={width:400,height:400,data:new Uint8Array(400*400*4)},crop={x:0,y:0,w:1,h:1};assert.equal(S.classifyCell(pixels,crop,0).state,'review');
 assert.ok(S.validateRect({...crop,w:.4},400,400));assert.ok(S.validateRect(crop,100,100));assert.ok(S.validateRect({...crop,x:-1},400,400));assert.equal(S.validateRect(crop,400,400),'');
 await assert.rejects(()=>S.analyze(pixels,crop,{cancelled:()=>true}),/취소/);await assert.rejects(()=>S.analyze({width:400,height:400,data:[]},crop),/픽셀/);
});
test('capture UI requires page and review, toggles cells on the image, and adds only learned fish',async()=>{
 const ui=open({scan:true});try{ui.$('#openScan').click();await ui.addImage();assert.equal(ui.all('[data-scan-cell]').length,100);assert.equal(ui.$('#scanApply').disabled,true);ui.change('#scanPage','rod:6');assert.match(ui.$('#scanPageHelp').textContent,/아다만 폴립테루스/);
 ui.$('#scanReviewed').click();assert.equal(ui.$('#scanApply').disabled,false);ui.$('[data-scan-cell="0"]').click();assert.equal(ui.$('#scanReviewed').checked,false);assert.match(ui.$('#scanCellTitle').textContent,/미수집/);ui.$('#scanLearned').click();ui.$('#scanReviewed').click();ui.$('#scanApply').click();
 const ids=E.parseBackup(ui.storage.getItem(KEY));assert.equal(ids.size,99);assert.ok(ids.has(20072));assert.ok(!ids.has(S.pagesFor(D.fishes).find(p=>p.key==='rod:6').items[4].id));assert.equal(ui.$('#scanDialog').open,false);ui.$('#undo').click();assert.equal(E.parseBackup(ui.storage.getItem(KEY)).size,0);
 }finally{ui.close();}
});
test('capture UI prevents duplicate pages and excludes blank slots when switching to the last spear page',async()=>{
 const ui=open({scan:true});try{ui.$('#openScan').click();await ui.addImage();ui.change('#scanPage','spear:3');assert.equal(ui.all('.scan-unused').length,11);ui.$('#scanReviewed').click();assert.equal(ui.$('#scanApply').disabled,false);await ui.addImage('second.png');ui.change('#scanPage','spear:3');ui.$('#scanReviewed').click();assert.equal(ui.$('#scanApply').disabled,true);assert.match(ui.$('#scanReadyNote').textContent,/중복/);ui.change('#scanPage','rod:1');ui.$('#scanReviewed').click();assert.equal(ui.$('#scanApply').disabled,false);ui.$('#scanRemove').click();await new Promise(r=>setTimeout(r,0));assert.match(ui.$('#scanTotal').textContent,/캡처 1장/);
 }finally{ui.close();}
});
test('paste is scoped to the capture dialog and closing cancels a pending analysis',async()=>{
 let finish;const ui=open({scan:true,analyze:()=>new Promise(r=>{finish=r;})});try{
 const paste=()=>{const e=new ui.w.Event('paste',{cancelable:true});Object.defineProperty(e,'clipboardData',{value:{items:[{kind:'file',type:'image/png',getAsFile:()=>({name:'pasted.png',type:'image/png',size:100})}]}});ui.d.dispatchEvent(e);return e;};
 assert.equal(paste().defaultPrevented,false);assert.match(ui.$('#scanTotal').textContent,/캡처 0장/);ui.$('#openScan').click();assert.equal(paste().defaultPrevented,true);await new Promise(r=>setTimeout(r,0));assert.equal(ui.$('#scanPage').disabled,true);ui.$('#closeScan').click();finish(rows());await new Promise(r=>setTimeout(r,0));assert.equal(ui.$('#scanDialog').open,false);assert.equal(ui.all('[data-scan-cell]').length,0);assert.equal(ui.storage.getItem(KEY),null);
 }finally{ui.close();}
});
const fixturePath=process.env.FISH_SCAN_FIXTURE;
test('private sample and local variants preserve the 86 collected / 14 missing cells, including the selected first cell',{skip:!fixturePath},async()=>{
 const fixture=JSON.parse(fs.readFileSync(fixturePath,'utf8')),dir=path.dirname(fixturePath);
 for(const f of fixture.variants||[{...fixture,file:'sample.rgba',name:'original'}]){const result=await S.analyze({width:f.width,height:f.height,data:fs.readFileSync(path.join(dir,f.file))},f.rect);assert.deepEqual(result.filter(r=>r.state==='missing').map(r=>r.index),fixture.missing,f.name);assert.equal(result.filter(r=>r.state==='learned').length,86,f.name);assert.equal(result[0].state,'learned',f.name);}
});
