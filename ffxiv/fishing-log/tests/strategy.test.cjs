const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {D,open,KEY,memory}=require('./helpers.cjs'),E=require('../engine.js'),B=require('../bait-ranking.js'),S=require('../strategy.js');
const context={window:{}};for(const file of ['strategy-data.js','bait-catches.js','bite-times.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
const guides=JSON.parse(JSON.stringify(context.window.FISHING_STRATEGIES)),counts=JSON.parse(JSON.stringify(context.window.FISHING_BAIT_CATCHES));
const prepared=B.prepare(D,counts),model=E.create(prepared,context.window.FISHING_BITE_TIMES),engine=S.create(prepared,model,guides,counts);
const plan=id=>{const f=model.byId.get(id);return engine.plan(f,f.routes[0]);},words=p=>JSON.stringify(p);

test('all 335 overworld big fish have plans; all 36 legendary fish have reviewed exceptions',()=>{
 const before=JSON.stringify(prepared),scope=prepared.fishes.filter(f=>f.big&&!f.stars);
 assert.equal(scope.length,335);assert.equal(scope.filter(f=>f.legendary).length,36);
 for(const f of scope)for(const r of f.routes){const p=engine.plan(f,r);assert.ok(p,f.name);assert.ok(p.prep.length&&p.steps.length,f.name);if(f.legendary)assert.equal(p.entry.reviewed,true,f.name);}
 assert.equal(JSON.stringify(prepared),before,'guide creation must not rewrite routes or bait preferences');
 assert.equal(Object.keys(guides.fish).length,scope.length);
});
test('normal fish, ocean fish, and mismatched catalog revisions do not receive overworld plans',()=>{
 for(const f of prepared.fishes.filter(f=>!f.big||f.stars).slice(0,100))assert.equal(engine.plan(f,f.routes[0]),null);
 const ocean=prepared.fishes.find(f=>f.big&&f.stars);assert.equal(engine.plan(ocean,ocean.routes[0]),null);
 const stale=S.create(prepared,model,{...guides,catalogRevision:'old'},counts),f=model.byId.get(24993);assert.equal(stale.plan(f,f.routes[0]),null);
});
test('reviewed slap targets are real fish at the target fishing hole, never an arbitrary name match',()=>{
 for(const f of prepared.fishes.filter(f=>guides.fish[f.id]))for(const r of f.routes){const p=engine.plan(f,r);for(const s of p.slaps)for(const id of s.ids){assert.notEqual(id,f.id);assert.ok(model.byId.get(id)?.routes.some(t=>t.spotKey===r.spotKey),f.name+' slap '+id);}}
 assert.deepEqual(plan(24993).slaps[0].ids,[20037]);
});
test('inferred candidates exclude target, mooch chain and intuition materials and expose counts as observations',()=>{
 let tested=0;
 for(const f of prepared.fishes.filter(f=>guides.fish[f.id]))for(const r of f.routes){const p=engine.plan(f,r);if(!p.suggestion)continue;tested++;const s=p.suggestion;assert.equal(s.inferred,true);assert.ok(s.samples>=10&&s.total>=100);for(const id of s.ids){assert.ok(!engine.protectedFish(f,r).has(id));assert.equal(!!model.byId.get(id).big,false);}assert.match(s.note,/확률을 뜻하지/);}
 assert.ok(tested>30,'exercise actual data coverage, not an empty candidate set');
});
test('rare mooch uses Prize Catch while a direct catch does not need large-size buffs',()=>{
 assert.ok(plan(24990).skills.includes('prize'));
 assert.match(words(plan(24990)),/월척/);
 const direct=plan(7679);assert.ok(direct.skills.includes('chum'));assert.ok(!direct.skills.includes('patience'));assert.ok(!direct.skills.includes('prize'));
 assert.equal(direct.evidence,'조건 기반 계획');
 assert.ok(!plan(8772).skills.includes('prize'),'a multi-stage mooch must not inherit the one-rare-mooch recommendation');
});
test('Ruby Dragon preserves existing mooch and warns Makeshift is not retroactive',()=>{
 const p=plan(24993);assert.match(words(p),/숙련 낚시꾼/);assert.match(words(p),/소급/);assert.match(words(p),/묘안 → 한결같은 챔질/);
 assert.match(words(p),/생미끼 프록이 떠 있으면 밑밥/);assert.ok(p.entry.note.preserveLoop);
});
test('intuition-phase slap is explicit; do not recommend a prerequisite before completing it',()=>{
 assert.deepEqual(plan(24991).slaps[0].ids,[23060]);assert.match(plan(24991).slaps[0].phase,/직감/);assert.match(words(plan(24991)),/각각/);
 assert.deepEqual(plan(8754).slaps[0].ids,[4913]);assert.match(plan(8754).slaps[0].note,/모으기 전에는 제외하지/);
});
test('Snowy Parexus conserves GP rather than blindly adding Surface Slap and Lure',()=>{
 const p=plan(41409);assert.equal(p.slaps.length,0);assert.equal(p.suggestion,null);assert.ok(!p.skills.includes('slap'));assert.ok(!p.skills.includes('ambitious'));assert.match(words(p),/750|350.*400/);assert.equal(p.entry.intuitionSeconds,35);
});
test('Ner Lar Dor requires its hidden message, while Lightning preserves Goldgrouper for intuition',()=>{
 const ner=plan(52007);assert.equal(ner.required,'modest');assert.match(words(ner),/물속에 무지갯빛/);assert.match(words(ner),/일반 소형 입질 확정 메시지/);
 assert.ok(ner.steps.findIndex(s=>s.includes('회 조건을 충족'))<ner.steps.findIndex(s=>s.startsWith('목표 입질')),'required lure must precede hooking in the displayed sequence');
 const lightning=plan(52297);assert.deepEqual(lightning.slaps[0].ids,[43773]);assert.match(words(lightning),/갱신되는 것은 확정이 아닙니다/);assert.equal(lightning.entry.intuitionSeconds,90);
});
test('shared source chapters do not leak the parent strategy into prerequisite fish',()=>{
 assert.equal(plan(33319).entry.sharedWith,33240);assert.equal(plan(33319).entry.note.lure,undefined);assert.equal(plan(33319).entry.note.noLure,true);
 assert.equal(plan(52002).entry.sharedWith,52009);assert.ok(!plan(52002).prep.some(t=>t.startsWith('직감 재료')));
 assert.ok(!plan(33325).steps.some(t=>t.includes('오징어 살')));
});
test('guide renders in both dialog and inline conditions, and fish links still work',()=>{
 const app=open();try{
  app.w.FishingDetails.renderPlan;
  app.$('[data-fish-detail="7678"]')?.click();
  // Use the delegated fish-detail event from a real element, independent of page pagination.
  const b=app.d.createElement('button');b.dataset.fishDetail='24993';app.d.body.append(b);b.click();
  assert.equal(app.$('#detailDialog').open,true);assert.equal(app.$('#detailBody [data-strategy="24993"]').open,true);
  assert.match(app.$('#detailBody .strategy-sources').textContent,/Fruity Snacks/);
  app.$('#detailBody .strategy-reference[data-fish-detail="20037"]').click();assert.equal(app.$('#detailTitle').textContent,'줄무늬장어');
  const f=app.w.FISHING_DATA.fishes.find(f=>f.id===24993),html=app.w.FishingDetails.renderPlan(f.id,f.routes[0],'inline-title');
  const holder=app.d.createElement('div');holder.innerHTML=html;assert.ok(holder.querySelector('[data-strategy="24993"]'));assert.equal(holder.querySelector('[data-strategy]').open,false);
 }finally{app.close();}
});
test('opening guides never changes collection records',()=>{
 const store=memory(),seed=open({storage:store});seed.w.FishingCollection.write(store,new Set([24993]));seed.close();
 const before=store.getItem(KEY),app=open({storage:store});try{
  assert.equal(app.$('#totalCount').textContent,'1 / 1,806');assert.equal(app.$('#fatal').hidden,true);
  const b=app.d.createElement('button');b.dataset.fishDetail='52007';app.d.body.append(b);b.click();assert.ok(app.$('[data-strategy="52007"]'));assert.equal(store.getItem(KEY),before);
 }finally{app.close();}
});
test('refresh preserves an open strategy inside its original planner row',()=>{
 const app=open({plan:true});try{
  app.$('#showPlanner').click();app.$('#planSearch').value='홍룡';app.$('#planRefresh').click();
  app.$('[data-plan-detail="24993"]').click();const guide=app.$('.plan-inline-detail [data-strategy="24993"]');assert.ok(guide);guide.open=true;
  app.$('#planRefresh').click();assert.equal(app.$('.plan-inline-detail [data-strategy="24993"]'),guide);assert.equal(guide.open,true);
  app.$('[data-plan-detail="24993"]').click();assert.equal(app.$('#plan-detail-24993').hidden,true);
 }finally{app.close();}
});
