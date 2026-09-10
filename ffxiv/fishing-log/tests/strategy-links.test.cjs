const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {D,open,KEY}=require('./helpers.cjs');
const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../strategy-links-data.js'),'utf8'),c);
const data=JSON.parse(JSON.stringify(c.window.FISHING_STRATEGY_LINKS));
test('all audited big fish have links to existing guide sections; normal and ocean fish are excluded',()=>{
  const fish=D.fishes.filter(f=>f.kind==='rod'&&f.big&&!f.stars);
  assert.equal(fish.length,335);assert.deepEqual(Object.keys(data.fish).map(Number).sort((a,b)=>a-b),fish.map(f=>f.id).sort((a,b)=>a-b));
  const guide=fs.readFileSync(path.join(__dirname,'../../fisher-skills/big-fish/index.html'),'utf8');
  for(const type of data.types)assert.ok(guide.includes(`id="${type.id}"`));
  for(const entry of Object.values(data.fish)){const ids=[...entry.main,...entry.preparation,...entry.methods];assert.ok(ids.length);assert.ok(ids.every(id=>data.types.some(t=>t.number===id)));}
  assert.deepEqual(data.fish[8763],{main:[4,5],preparation:[7],methods:[]});
  assert.deepEqual(data.fish[41408],{main:[1],preparation:[6,5],methods:[]});
  assert.deepEqual(data.fish[44342],{main:[4],preparation:[5],methods:[]});
  for(const id of [24992,41412])assert.deepEqual(data.fish[id].preparation,[6,7]);
  assert.deepEqual(data.fish[24990].methods,[2,3]);
  for(const id of [8765,15632,41412])assert.ok(![...data.fish[id].main,...data.fish[id].preparation].includes(5),'Unconfirmed loop must not be promoted');
});
test('planner and full details show phase-specific links without changing the collection or competing-fish panel',()=>{
 const p=open({plan:true});try{
  const before=p.storage.getItem(KEY);p.$('#showPlanner').click();p.$('#planSearch').value='갈리크티스';p.$('#planRefresh').click();p.$('.plan-card [data-plan-detail]').click();
  const panel=p.$('.plan-inline-detail:not([hidden])'),links=panel.querySelector('.fish-strategies');assert.ok(links);
  assert.ok(links.querySelector('[data-strategy-phase="main"] a').href.endsWith('/fisher-skills/big-fish/#direct'));
  assert.ok(links.querySelector('[data-strategy-phase="preparation"] a[href$="#loop"]'));
  assert.equal(links.querySelector('[data-strategy-phase="main"] a[href$="#loop"]'),null);
  assert.ok(panel.querySelector('.bite-comparison'));assert.ok(panel.querySelector('.plan-detail-baits'));
  for(const a of links.querySelectorAll('a')){assert.equal(a.target,'_blank');assert.match(a.rel,/noopener/);assert.match(a.getAttribute('aria-label'),/갈리크티스/);}
  panel.querySelector('[data-fish-detail="41408"]').click();assert.equal(p.$('#detailDialog').open,true);assert.equal(p.all('#detailDialog .fish-strategies').length,1);
  assert.equal(p.storage.getItem(KEY),before);
 }finally{p.close();}
});
test('book/group details expose both mooch options as a comparison and suppress links for unrelated fish',()=>{
 const p=open();try{
  p.change('#search','크세나칸투스','input');p.$('[data-fish-detail="24990"]').click();
  const group=p.$('#detailDialog [data-strategy-phase="methods"]');assert.match(group.textContent,/방법 비교/);assert.equal(group.querySelectorAll('a').length,2);
  p.$('#detailDialog').close();p.change('#view','spot');assert.equal(p.all('#fishGroups .fish-strategies').length,1);
  const normal=D.fishes.find(f=>!f.big),ocean=D.fishes.find(f=>f.big&&f.stars);
  for(const f of [normal,ocean,{id:999999,big:true}])assert.equal(p.w.FishingStrategyLinks.render(f),'');
 }finally{p.close();}
});
