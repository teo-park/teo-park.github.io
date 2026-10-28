const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../../ocean-fishing/node_modules/jsdom');
const M=require('../model.js'),catalog=require('../catalog.json'),navigation=require('../../tools/site-navigation.cjs');
const root=path.resolve(__dirname,'../..');
test('room is discoverable from navigation and home, but HTML contains no member or private data',()=>{
  const dom=new JSDOM(fs.readFileSync(path.join(root,'collection-room/index.html'),'utf8'));try{
    const d=dom.window.document;assert.match(d.querySelector('meta[name=robots]').content,/noindex/);assert.equal(d.getElementById('activeRoom').hidden,true);assert.equal(d.getElementById('signedIn').hidden,true);assert.equal(d.getElementById('results').children.length,0);assert.equal(d.getElementById('roomList').children.length,0);assert.ok(navigation.categories.find(c=>c.id==='collection').tools.some(([p])=>p==='collection-room/'));
    assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'),/class="tool-link[^\"]*" href="\.\/collection-room\/"/);
  }finally{dom.window.close();}
});
test('every connected notebook includes the shared sync module exactly once',()=>{
  for(const page of ['blue-mage/','weapons/','fishing-log/','ocean-fishing/','ocean-fishing/checklist/','triple-triad/','minions/','beastmaster/']){
    const dom=new JSDOM(fs.readFileSync(path.join(root,page,'index.html'),'utf8'),{url:'https://teo-park.github.io/ffxiv/'+page});try{
      const scripts=[...dom.window.document.scripts].filter(s=>s.src.includes('/collection-sync.js?'));assert.equal(scripts.length,1,page);assert.equal(scripts[0].type,'module');assert.equal(new URL(scripts[0].src).pathname,'/ffxiv/collection-sync.js');
    }finally{dom.window.close();}
  }
});
test('public room catalog is current and every ID and weapon stage is compatible with synchronization',()=>{
  const generated=require('../../tools/collection-catalog.cjs').build();assert.equal(JSON.stringify(catalog),JSON.stringify(generated));
  for(const book of M.BOOKS){const ids=new Set();for(const item of catalog.books[book.id].items){assert.ok(!ids.has(item.id),book.id+':'+item.id);ids.add(item.id);assert.equal(typeof item.name,'string');M.normalize({[book.id]:{[item.id]:{value:0,wanted:false}}});if(book.id==='weapons'){assert.ok(item.stages.length);assert.ok(item.stages.every(s=>Number.isSafeInteger(s.id)&&s.id>0));}}}
});
test('legacy fishing stores are imported before the first room connection without rewriting their originals',()=>{
  const dom=new JSDOM('',{url:'https://teo-park.github.io/ffxiv/collection-room/',runScripts:'outside-only'});try{
    const w=dom.window,s=w.localStorage;w.eval(fs.readFileSync(path.join(root,'ocean-fishing/scripts/teamcraft-ids.js'),'utf8'));w.eval(fs.readFileSync(path.join(root,'fishing-collection.js'),'utf8'));
    const old=JSON.stringify({type:'ffxiv-fishing-log',schemaVersion:1,caught:[4776,999999]});s.setItem(w.FishingCollection.BOOK_KEY,old);w.FishingCollection.read(s);
    const data=M.readLocal(s);assert.equal(data.fishing['4776'].value,1);assert.equal(data.fishing['999999'].value,1);assert.equal(s.getItem(w.FishingCollection.BOOK_KEY),old);
  }finally{dom.window.close();}
});
