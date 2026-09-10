const test=require('node:test'),assert=require('node:assert/strict'),E=require('../engine.js'),{D,KEY,memory,open}=require('./helpers.cjs');
const known=new Set(D.fishes.map(f=>f.id));
test('layout icons keep fish IDs, checks, pagination and the spear book intact',()=>{
 const p=open();try{
  p.$('#paginationTop [aria-label="2페이지"]').click();p.$('#fishGrid [data-caught]').click();const before=p.storage.getItem(KEY),node=p.$('#fishGrid [data-caught]'),first=node.dataset.caught;
  p.$('[data-layout-choice="list"]').click();assert.equal(p.$('#catalog').dataset.collectionLayout,'list');assert.equal(p.$('#fishGrid [data-caught]'),node);assert.equal(p.$('#fishGrid [data-caught]').dataset.caught,first);assert.equal(p.storage.getItem(KEY),before);assert.ok(p.$('.collection-row-info').textContent.length);
  p.$('#spearMode').click();assert.equal(p.$('#catalog').dataset.collectionLayout,'list');assert.match(p.$('.collection-row-info').textContent,/작살질/);
  p.change('#view','spot');assert.equal(p.$('#collectionLayoutSwitch').hidden,true);p.change('#view','book');assert.equal(p.$('#collectionLayoutSwitch').hidden,false);
  p.$('[data-layout-choice="grid"]').click();assert.equal(p.$('#catalog').dataset.collectionLayout,'grid');assert.equal(p.storage.getItem(KEY),before);
 }finally{p.close();}
});
test('catalog keeps all log-visible fish, including hidden-name big fish, with separate ordered spear pages',()=>{
 assert.equal(D.count,1806);assert.deepEqual(D.counts,{rod:1517,spear:289});assert.equal(known.size,D.count);assert.equal(D.missingConditions.length,36);
 for(const kind of ['rod','spear'])assert.deepEqual(D.fishes.filter(f=>f.kind===kind).map(f=>f.order),Array.from({length:D.counts[kind]},(_,i)=>i+1));
 const page6=D.fishes.filter(f=>f.kind==='rod').slice(500,510);assert.equal(page6[0].id,20072);assert.equal(page6[0].name,'아다만 폴립테루스');assert.equal(page6[9].name,'피머금게');assert.ok(D.fishes.find(f=>f.id===7678).big);
 for(const f of D.fishes){assert.match(f.name,/[가-힣]|^E\.B\.E\.?-\d+$/);assert.match(f.icon,/^https:\/\/v2.xivapi.com\/api\/asset/);for(const r of f.routes){assert.ok(D.spots[r.spotKey]);if(r.bait)assert.ok(D.related[r.bait]||known.has(r.bait));for(const p of r.predators||[])assert.ok(p.amount>0&&(D.related[p.id]||known.has(p.id)));for(const w of [...(r.weathers||[]),...(r.weathersFrom||[])])assert.ok(D.weathers[w]);}}
});
test('mooch paths stay at the same spot, preserve alternatives, and terminate cyclic or unknown chains',()=>{
 const fish=(id,routes,kind='rod')=>({id,name:'어종'+id,original:'',fish:true,kind,order:id,routes}),data={related:{1:{id:1,name:'미끼 A',fish:false},2:{id:2,name:'미끼 B',fish:false}},spots:{x:{name:'강',area:'필드',region:'지역 A'},y:{name:'바다',area:'해안',region:'지역 B'}},fishes:[fish(10,[{spotKey:'x',bait:1},{spotKey:'y',bait:2}]),fish(11,[{spotKey:'x',bait:10}]),fish(12,[{spotKey:'y',bait:11}]),fish(13,[{spotKey:'x',bait:14}]),fish(14,[{spotKey:'x',bait:13}])]};
 const m=E.create(data);assert.deepEqual(m.paths(data.fishes[1].routes[0]),[{ids:[1,10],complete:true}]);assert.deepEqual(m.paths(data.fishes[2].routes[0]),[{ids:[11],complete:false}]);assert.equal(m.paths(data.fishes[3].routes[0])[0].complete,false);
 assert.equal(m.routeMatches(data.fishes[1].routes[0],{region:'지역 B',bait:'1'}),false);assert.equal(m.routeMatches(data.fishes[1].routes[0],{region:'지역 A',bait:'1'}),true);
 const matches=m.filter(new Set([10]),{kind:'rod',status:'missing',bait:'1'});assert.deepEqual(matches.map(f=>f.id),[11]);assert.deepEqual(m.paths(matches[0].routes[0])[0].ids,[1,10]);
});
test('search and grouping include Korean initials, raw fish IDs, spear properties and explicit unknown-data groups',()=>{
 const m=E.create(D);assert.ok(m.filter(new Set(),{kind:'rod',query:'ㅁㄹㅁㅇ'}).some(f=>f.name==='말름미역'));assert.equal(m.filter(new Set(),{kind:'rod',query:'20072'})[0].name,'아다만 폴립테루스');
 const caught=new Set([4776]),missing=m.filter(caught,{kind:'rod',status:'missing'});assert.equal(missing.length,1516);assert.ok(m.groups(missing,'bait').some(g=>g.key==='unknown'));assert.ok(m.filter(new Set(),{kind:'rod',bait:'unknown'}).some(f=>D.missingConditions.includes(f.id)));
 const spear=m.filter(new Set(),{kind:'spear'});assert.equal(spear.length,289);assert.ok(spear.some(f=>f.routes.some(r=>r.speed===0)));assert.ok(spear.every(f=>f.routes.every(r=>!r.bait)));assert.ok(m.groups(spear,'spot').length>1);
});
test('Teamcraft arrays import only catalog IDs, while native backups preserve future IDs; malformed imports are atomic',()=>{
 const r=E.parseTransfer('[4776,4776,20144,42]',known);assert.deepEqual(r.ids,new Set([4776,20144]));assert.equal(r.ignored,1);
 const backup=E.backup(new Set([4776,999999])),native=E.parseTransfer(backup,known);assert.deepEqual(native.ids,new Set([4776,999999]));assert.deepEqual(JSON.parse(E.teamcraft(native.ids,known)),{completed:[4776]});
 for(const value of ['{"type":"ffxiv-minions","caught":[4776]}','[4776,"20144"]','[0]','[4776,1.5]','null','[4776,]'])assert.throws(()=>E.parseTransfer(value,known));
 assert.deepEqual(E.parseTransfer('{"completed":[4776]}',known).ids,new Set([4776]));
});
test('time windows handle midnight, fractional hours and absent data without guessing a window',()=>{
 assert.equal(E.timeWindow({spawn:18,duration:12}),'ET 18:00–06:00 (다음 날)');assert.equal(E.timeWindow({spawn:0,duration:2.5}),'ET 00:00–02:30');assert.equal(E.timeWindow({spawn:0,duration:24}),'ET 24시간');assert.equal(E.timeWindow({}),null);
});
test('both catalogs render 10×10 slots, page six matches the sample, and spear mode disables bait filters',()=>{
 const ui=open();try{assert.equal(ui.$('#appContent').hidden,false);assert.equal(ui.all('.fish-tile').length,100);ui.$('#paginationTop [data-page="3"]').click();ui.$('#paginationTop [data-page="5"]').click();ui.$('#paginationTop [data-page="6"]').click();assert.equal(ui.$('#fishGrid [data-caught]').dataset.caught,'20072');
 ui.$('#spearMode').click();assert.equal(ui.all('.fish-tile').length,100);assert.equal(ui.$('#baitField').hidden,true);assert.equal(ui.$('#baitViewOption').disabled,true);ui.$('#paginationTop [data-page="3"]').click();assert.equal(ui.all('.fish-tile').length,89);assert.equal(ui.all('.empty-slot').length,11);
 ui.change('#view','spot');assert.ok(ui.$('.condition-tags').textContent.includes('어영'));assert.ok(ui.$('.condition-tags').textContent.includes('속도'));assert.equal(ui.$('#gridViewport').hidden,true);ui.$('#rodMode').click();assert.equal(ui.$('#baitViewOption').disabled,false);
 }finally{ui.close();}
});
test('checks merge with fresh other-tab records, undo preserves unrelated IDs, and failed storage keeps records',()=>{
 const storage=memory({[KEY]:E.backup(new Set([999999]))}),ui=open({storage});try{storage.setItem(KEY,E.backup(new Set([999999,20144])));ui.$('[data-caught="4776"]').click();assert.deepEqual(E.parseBackup(storage.getItem(KEY)),new Set([999999,20144,4776]));ui.$('#undo').click();assert.deepEqual(E.parseBackup(storage.getItem(KEY)),new Set([999999,20144]));const before=storage.getItem(KEY);storage.setItem=()=>{throw Error('quota');};ui.$('[data-caught="4776"]').click();assert.equal(storage.getItem(KEY),before);assert.match(ui.$('#noticeText').textContent,/저장하지 못/);}finally{ui.close();}
});
test('missing filter leaves checked tiles until refresh, and related fish remain visible after being collected',()=>{
 const ui=open();try{ui.change('#status','missing');ui.$('[data-caught="4776"]').click();assert.ok(ui.$('[data-caught="4776"]'));assert.equal(ui.$('#refreshResults').hidden,false);ui.$('#refreshResults').click();assert.equal(ui.$('#fishGrid [data-caught="4776"]'),null);
 ui.scanApply([4978]);ui.change('#search','8752','input');ui.$('#fishGrid [data-fish-detail]').click();assert.ok(ui.$('#detailBody [data-related-state="4978"]'));assert.match(ui.$('#detailBody [data-related-state="4978"]').textContent,/수집/);assert.match(ui.$('#detailBody').textContent,/직감/);
 }finally{ui.close();}
});
test('bulk checks, imports and capture apply are additive and invalid transfers never erase progress',()=>{
 const ui=open();try{ui.$('#markPage').click();assert.equal(E.parseBackup(ui.storage.getItem(KEY)).size,100);ui.$('#undo').click();assert.equal(E.parseBackup(ui.storage.getItem(KEY)).size,0);ui.$('#openRecords').click();ui.change('#importText','[4776,20144,42]','input');assert.match(ui.$('#importPreview').textContent,/2개.*1개 제외/);ui.$('#applyImport').click();assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set([4776,20144]));
 const before=ui.storage.getItem(KEY);ui.change('#importText','{"caught":[4776]}','input');assert.equal(ui.$('#applyImport').disabled,true);assert.equal(ui.storage.getItem(KEY),before);assert.equal(ui.scanApply([20072]).ok,true);assert.equal(ui.scanApply([42]).ok,false);ui.$('#undo').click();assert.deepEqual(E.parseBackup(ui.storage.getItem(KEY)),new Set([4776,20144]));
 }finally{ui.close();}
});
test('backup download, Teamcraft copy fallback and cross-tab updates preserve the right collection',async()=>{
 const ui=open({storage:memory({[KEY]:E.backup(new Set([4776,20144,999999]))})});try{ui.$('#exportRecords').click();assert.deepEqual(E.parseBackup(await ui.downloads[0].text()),new Set([4776,20144,999999]));ui.$('#copyTeamcraft').click();await new Promise(r=>setTimeout(r,0));assert.equal(ui.$('#copyFallbackLabel').hidden,false);assert.deepEqual(JSON.parse(ui.$('#copyFallback').value),{completed:[4776,20144]});ui.storage.setItem(KEY,E.backup(new Set([4925])));ui.w.dispatchEvent(new ui.w.StorageEvent('storage',{key:KEY}));assert.match(ui.$('#totalCount').textContent,/1 \/ 1,806/);assert.equal(ui.$('#undo').hidden,true);}finally{ui.close();}
});
