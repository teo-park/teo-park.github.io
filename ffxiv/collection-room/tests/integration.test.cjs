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
  for(const page of ['blue-mage/','weapons/','extreme-mounts/','fishing-log/','ocean-fishing/','ocean-fishing/checklist/','triple-triad/','minions/','beastmaster/']){
    const dom=new JSDOM(fs.readFileSync(path.join(root,page,'index.html'),'utf8'),{url:'https://teo-park.github.io/ffxiv/'+page});try{
      const scripts=[...dom.window.document.scripts].filter(s=>s.src.includes('/collection-sync.js?'));assert.equal(scripts.length,1,page);assert.equal(scripts[0].type,'module');assert.equal(new URL(scripts[0].src).pathname,'/ffxiv/collection-sync.js');
    }finally{dom.window.close();}
  }
});
test('public room catalog is current and every ID and weapon stage is compatible with synchronization',()=>{
  const generated=require('../../tools/collection-catalog.cjs').build();assert.equal(JSON.stringify(catalog),JSON.stringify(generated));
  for(const book of M.BOOKS){const ids=new Set();for(const item of catalog.books[book.id].items){assert.ok(!ids.has(item.id),book.id+':'+item.id);ids.add(item.id);assert.equal(typeof item.name,'string');M.normalize({[book.id]:{[item.id]:{value:0,wanted:false}}});if(book.id==='weapons'){assert.ok(item.stages.length);assert.ok(item.stages.every(s=>Number.isSafeInteger(s.id)&&s.id>0));}}}
});

test('room mount view filters expansions, counts required mounts, and preserves existing sharing choices',()=>{
  const dom=new JSDOM(fs.readFileSync(path.join(root,'collection-room/index.html'),'utf8'),{url:'https://example.test/ffxiv/collection-room/',runScripts:'outside-only'});
  try{
    const w=dom.window,d=w.document;w.CollectionRoomModel=M;w.__catalog=catalog;
    w.__sync={localBooks:()=>({mounts:{28:{value:1,wanted:false},47:{value:1,wanted:false},22:{value:1,wanted:false}}})};
    const source=fs.readFileSync(path.join(root,'collection-room/app.js'),'utf8').replace(/^import .*;\r?\n/,'const {localBooks}=globalThis.__sync;\n').replace(/^init\(\)\.catch\([^\n]+/m,'');
    w.eval(source+`;catalog=globalThis.__catalog;user={uid:'self'};roomId='test';meta={owner:'self'};members={self:{name:'테스트',sharing:{mounts:true}},old:{name:'기존 참여자',sharing:{'blue-mage':true}}};linked=true;view='mine';globalThis.__room={renderResults,renderMembers,sharingFields};`);
    d.getElementById('bookSelect').innerHTML='<option value="mounts">극 탈것</option>';
    d.getElementById('expansionSelect').innerHTML='<option value="all">전체</option><option value="arr">신생</option><option value="dt">황금</option>';
    d.getElementById('itemFilter').value='all';d.getElementById('expansionSelect').value='arr';w.__room.renderResults();
    assert.equal(d.getElementById('expansionFilterLabel').hidden,false);assert.match(d.getElementById('resultSummary').textContent,/8/);assert.match(d.getElementById('results').textContent,/아이톤/);assert.doesNotMatch(d.getElementById('results').textContent,/재앙의 날개/);
    d.getElementById('expansionSelect').value='dt';w.__room.renderResults();assert.match(d.getElementById('resultSummary').textContent,/9/);assert.match(d.getElementById('results').textContent,/재앙의 날개/);
    w.__room.renderMembers();const cards=d.querySelectorAll('.member-card');assert.match(cards[0].querySelector('.mount-expansion-summary').textContent,/신생\s+1 \/ 6/);assert.equal(cards[1].querySelector('.mount-expansion-summary'),null);
    w.__room.sharingFields(d.getElementById('sharingOptions'),{'blue-mage':true});assert.equal(d.querySelector('#sharingOptions input[value=mounts]').checked,false);
  }finally{dom.window.close();}
});
test('legacy fishing stores are imported before the first room connection without rewriting their originals',()=>{
  const dom=new JSDOM('',{url:'https://teo-park.github.io/ffxiv/collection-room/',runScripts:'outside-only'});try{
    const w=dom.window,s=w.localStorage;w.eval(fs.readFileSync(path.join(root,'ocean-fishing/scripts/teamcraft-ids.js'),'utf8'));w.eval(fs.readFileSync(path.join(root,'fishing-collection.js'),'utf8'));
    const old=JSON.stringify({type:'ffxiv-fishing-log',schemaVersion:1,caught:[4776,999999]});s.setItem(w.FishingCollection.BOOK_KEY,old);w.FishingCollection.read(s);
    const data=M.readLocal(s);assert.equal(data.fishing['4776'].value,1);assert.equal(data.fishing['999999'].value,1);assert.equal(s.getItem(w.FishingCollection.BOOK_KEY),old);
  }finally{dom.window.close();}
});
test('collection application and statistics have separate projects, rules, and deploy configurations',()=>{
  const repo=path.resolve(root,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(repo,p),'utf8'));
  const app=read('firebase.json'),counter=read('firebase.counter.json'),aliases=read('.firebaserc').projects;
  assert.equal(aliases.default,'teo-ffxiv');assert.equal(aliases.counter,'teo-ffxiv-counter');
  assert.equal(app.database.rules,'services/collection-rooms/database.rules.json');assert.equal(counter.database.rules,'services/visitor-counter/database.rules.json');
  const appRules=read(app.database.rules).rules,counterRules=read(counter.database.rules).rules;
  assert.ok(appRules.collectionRooms);assert.equal(appRules.visits,undefined);assert.equal(counterRules.collectionRooms,undefined);assert.ok(counterRules.visits);
  const sdk=fs.readFileSync(path.join(root,'collection-room/firebase.js'),'utf8'),config=JSON.parse(sdk.match(/const firebaseConfig=(\{[^\n]+\});/)[1]);
  assert.equal(config.projectId,'teo-ffxiv');assert.equal(config.authDomain,'teo-ffxiv.firebaseapp.com');assert.match(config.databaseURL,/\/\/teo-ffxiv-default-rtdb\./);assert.equal(sdk.includes('teo-ffxiv-counter'),false);
  assert.match(fs.readFileSync(path.join(root,'counter-admin/app.js'),'utf8'),/teo-ffxiv-counter/);
});
