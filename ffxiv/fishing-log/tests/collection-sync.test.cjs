const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const E=require('../engine.js'),{D,memory,open}=require('./helpers.cjs');
const Sync=require('../../fishing-collection.js'),map=require('../../ocean-fishing/scripts/teamcraft-ids.js'),S=Sync.create(map);
const oceanId=name=>+Object.entries(map).find(([,entries])=>entries.some(e=>e.name===name))[0];
const a=oceanId('Galadion Chovy'),b=oceanId('Gladius'),spear=D.fishes.find(f=>f.kind==='spear').id;
const legacy={indigo:{'Galadion Chovy|legacy|bait':true,Gladius:true,'Future Ocean Fish':true},ruby:{}};
test('all 259 journal species match notebook item IDs',()=>{
 const known=new Set(D.fishes.map(f=>f.id));assert.equal(Object.keys(map).length,259);for(const id of Object.keys(map))assert.ok(known.has(+id),id);
});
test('first read unions both legacy stores, preserves unknown records and never rewrites the originals',()=>{
 const oldBook=E.backup(new Set([a,spear,999999])),oldOcean=JSON.stringify(legacy),storage=memory({[S.BOOK_KEY]:oldBook,[S.OCEAN_KEY]:oldOcean});
 assert.deepEqual(S.read(storage),new Set([a,b,spear,999999]));assert.equal(storage.getItem(S.BOOK_KEY),oldBook);assert.equal(storage.getItem(S.OCEAN_KEY),oldOcean);
 assert.equal(S.readOcean(storage).indigo['Future Ocean Fish'],true);const before=storage.getItem(S.KEY);S.read(storage);S.readOcean(storage);assert.equal(storage.getItem(S.KEY),before);
 const ids=S.read(storage);ids.delete(b);S.write(storage,ids);assert.equal(S.read(storage).has(b),false);assert.equal(S.readOcean(storage).indigo.Gladius,false);assert.equal(storage.getItem(S.OCEAN_KEY),oldOcean);
});
test('ocean edits preserve notebook-only and spear IDs, while real old-tab deltas are applied once',()=>{
 const storage=memory({[S.BOOK_KEY]:E.backup(new Set([spear,999999])),[S.OCEAN_KEY]:JSON.stringify(legacy)});
 const state=S.readOcean(storage);state.indigo.Gladius=false;S.writeOcean(storage,state);assert.deepEqual(S.read(storage),new Set([a,spear,999999]));
 const old=JSON.parse(storage.getItem(S.OCEAN_KEY));old.indigo['Galadion Chovy|legacy|bait']=false;storage.setItem(S.OCEAN_KEY,JSON.stringify(old));assert.deepEqual(S.read(storage),new Set([spear,999999]));
 // The unchanged legacy Gladius=true must not resurrect a shared-store deletion.
 assert.equal(S.readOcean(storage).indigo.Gladius,false);
 storage.setItem(S.BOOK_KEY,E.backup(new Set([spear,999999,b])));assert.ok(S.read(storage).has(b));
 const next=S.readOcean(storage);next.indigo['Galadion Chovy']=true;S.writeOcean(storage,next);storage.setItem(S.BOOK_KEY,E.backup(new Set([999999,b])));assert.deepEqual(S.read(storage),new Set([a,b,999999]));
});
test('corrupt sources and quota failures cannot partially migrate or overwrite either collection',()=>{
 for(const [badKey,badValue] of [[S.KEY,'broken'],[S.BOOK_KEY,'[]'],[S.OCEAN_KEY,'{"indigo":{"Gladius":"true"}}']]){
  const storage=memory({[S.BOOK_KEY]:E.backup(new Set([spear])),[S.OCEAN_KEY]:JSON.stringify(legacy),[badKey]:badValue});const before=[S.KEY,S.BOOK_KEY,S.OCEAN_KEY].map(k=>storage.getItem(k));
  assert.throws(()=>S.read(storage));assert.throws(()=>S.write(storage,new Set([a])));assert.deepEqual([S.KEY,S.BOOK_KEY,S.OCEAN_KEY].map(k=>storage.getItem(k)),before);
 }
 const storage=memory({[S.BOOK_KEY]:E.backup(new Set([spear])),[S.OCEAN_KEY]:JSON.stringify(legacy)});storage.setItem=()=>{throw Error('quota');};assert.throws(()=>S.read(storage),/quota/);assert.equal(storage.getItem(S.KEY),null);
});
test('notebook UI follows journal imports, unchecks, undo and navigation restoration',()=>{
 const storage=memory({[S.BOOK_KEY]:E.backup(new Set([spear]))}),ui=open({storage});
 try{
  ui.w.eval(fs.readFileSync(path.join(__dirname,'../../ocean-fishing/scripts/collection.js'),'utf8'));const journal=ui.w.OceanCollection;
  journal.importCaught(storage,JSON.stringify([a,b]));ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:S.KEY}));ui.change('#search',String(a),'input');assert.equal(ui.$(`[data-caught="${a}"]`).getAttribute('aria-pressed'),'true');
  ui.$(`[data-caught="${a}"]`).click();assert.equal(journal.caught(journal.read(storage),'indigo','Galadion Chovy'),false);assert.ok(S.read(storage).has(spear));assert.ok(S.read(storage).has(b));
  ui.$('#undo').click();assert.equal(journal.caught(journal.read(storage),'indigo','Galadion Chovy'),true);
  journal.setCaught(storage,'indigo','Galadion Chovy',false);ui.w.dispatchEvent(new ui.w.Event('pageshow'));assert.equal(ui.$(`[data-caught="${a}"]`).getAttribute('aria-pressed'),'false');
  assert.equal(ui.scanApply([a]).ok,true);assert.equal(journal.caught(journal.read(storage),'indigo','Galadion Chovy'),true);
 }finally{ui.close();}
});
test('new ID writes survive migration snapshots and malformed or unrelated imports do not change shared data',()=>{
 const ui=open();try{
  ui.w.eval(fs.readFileSync(path.join(__dirname,'../../ocean-fishing/scripts/collection.js'),'utf8'));const journal=ui.w.OceanCollection;
  ui.scanApply([spear,b]);const before=ui.storage.getItem(S.KEY);assert.throws(()=>journal.importCaught(ui.storage,'["oops"]'));journal.importCaught(ui.storage,'[1]');assert.equal(ui.storage.getItem(S.KEY),before);
  journal.setCaught(ui.storage,'indigo','Galadion Chovy',true);assert.deepEqual(E.parseBackup(ui.storage.getItem(S.KEY)),new Set([a,b,spear]));
 }finally{ui.close();}
});
