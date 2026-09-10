const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const R=require('../bait-ranking.js'),E=require('../engine.js'),{D,open,KEY}=require('./helpers.cjs');
const ctx={window:{}};for(const name of ['bait-catches.js','bite-times.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',name),'utf8'),ctx);
const snapshot=JSON.parse(JSON.stringify(ctx.window.FISHING_BAIT_CATCHES)),P=R.prepare(D,snapshot);
const byId=new Map([100,101,102].map(id=>[id,{id,fish:false}])),stat=(hits,total)=>({total,fish:{10:hits}});
test('normalize bait usage instead of preferring raw totals; penalize tiny samples',()=>{
 const choice=R.rank(10,100,{100:stat(100,1000),101:stat(80,200),102:stat(2,2)},byId);
 assert.equal(choice.selected,101);assert.equal(choice.status,'changed');assert.equal(choice.candidates.at(-1).id,102);
 assert.ok(choice.candidates[0].lower<.4);assert.equal(choice.candidates.at(-1).enough,false);
 assert.equal(R.rank(10,100,{100:stat(100,1000),101:stat(105,1000)},byId).status,'close');
 assert.equal(R.rank(10,100,{100:stat(400,1000),101:stat(100,1000)},byId).status,'supported');
 assert.equal(R.rank(10,100,{100:stat(3,10),101:stat(80,200)},byId).selected,100);
 assert.equal(R.rank(10,100,{},byId).status,'insufficient');
 assert.equal(R.bounds(11,10),null);assert.equal(R.bounds(0,0),null);assert.equal(R.bounds(0,10).lower,0);
});
test('aggregate denominator includes all fish, excluding misses, other spots/baits and lure use',async()=>{
 const {summarize}=await import('../scripts/update-bait-catches.mjs');
 const row=(itemId,occurences,extra={})=>({spot:1,baitId:100,aLure:0,mLure:0,itemId,occurences,...extra});
 const s=summarize([row(10,4),row(999999,16),row(-1,50),row(10,20,{aLure:1}),row(10,30,{mLure:1}),row(10,40,{aLure:null}),row(10,50,{spot:2}),row(10,100,{baitId:10}),row(10,-4)],new Set([1]),new Set([100]));
 assert.deepEqual(s,{'rod:1':{100:{total:20,fish:{10:4,999999:16}}}});
 for(const spot of Object.values(snapshot.spots))for(const stats of Object.values(spot))assert.equal(stats.total,Object.values(stats.fish).reduce((n,v)=>n+v,0));
});
test('only unconstrained direct routes change; protect conditions and preserve source and mooch edges',()=>{
 const source={revisions:{teamcraft:'fixture'},related:Object.fromEntries(byId),spots:{'rod:1':{kind:'rod'},'rod:2':{kind:'rod'}},fishes:[{id:10,kind:'rod',fish:true,routes:[{spotKey:'rod:1',bait:100,verified:true},{spotKey:'rod:2',bait:100,verified:true}]}]};
 const data={schemaVersion:1,sourceRevision:'fixture',spots:{'rod:1':{100:stat(100,1000),101:stat(80,200)}}},before=structuredClone(source);
 const prepared=R.prepare(source,data);assert.equal(prepared.fishes[0].routes[0].bait,101);assert.equal(prepared.fishes[0].routes[1].bait,100);assert.deepEqual(source,before);assert.deepEqual(R.prepare(prepared,data),prepared);
 for(const f of [{big:true},{legendary:true},{timed:true},{weathered:true},{kind:'spear'}]){const s=structuredClone(source);Object.assign(s.fishes[0],f);assert.deepEqual(R.prepare(s,data).fishes[0].routes,s.fishes[0].routes);}
 for(const r of [{verified:false},{spawn:0,duration:24},{weathers:[1]},{weathersFrom:[2]},{predators:[{id:20,amount:1}]},{snagging:true},{aLure:1},{mLure:1},{oceanFishingTime:2}]){const s=structuredClone(source);Object.assign(s.fishes[0].routes[0],r);assert.deepEqual(R.prepare(s,data).fishes[0].routes[0],s.fishes[0].routes[0]);}
 source.fishes.push({id:20,kind:'rod',fish:true,big:true,routes:[{spotKey:'rod:1',bait:10,verified:true}]});
 const mooch=R.prepare(source,data),m=E.create(mooch);assert.equal(mooch.fishes[1].routes[0].bait,10);assert.deepEqual(m.paths(mooch.fishes[1].routes[0])[0].ids,[101,10]);
 source.fishes[0].routes.push({spotKey:'rod:1',bait:20,verified:true});assert.deepEqual(R.prepare(source,data).fishes[0].routes.filter(r=>r.spotKey==='rod:1'),source.fishes[0].routes.filter(r=>r.spotKey==='rod:1'));
 assert.equal(R.prepare(source,{...data,sourceRevision:'newer'}),source);assert.equal(R.prepare(source,null),source);
});
test('Pantherscale Grouper retains mackerel after comparing full catch shares',()=>{
 const fish=P.fishes.find(f=>f.id===36423),c=fish.routes[0].baitChoice;
 assert.equal(c.selected,36593);assert.equal(c.status,'supported');
 assert.equal(c.candidates[0].hits,208);assert.equal(c.candidates[0].total,988);
 assert.equal(c.candidates[1].id,36592);assert.equal(c.candidates[1].hits,2953);assert.equal(c.candidates[1].total,20333);
 assert.ok(c.candidates[0].rate>c.candidates[1].rate);
 assert.equal(ctx.window.FISHING_BITE_TIMES.ranges['36423|rod:261|36593'].samples,178);
});
test('changed recommendation stays consistent in paths, filters, bite times and alternate ranking',()=>{
 const m=E.create(P,ctx.window.FISHING_BITE_TIMES),fish=m.byId.get(4776),r=fish.routes.find(r=>r.spotKey==='rod:35');
 assert.equal(r.catalogBait,2587);assert.equal(r.bait,2585);assert.deepEqual(m.paths(r)[0].ids,[2585]);
 assert.equal(m.biteTime(fish.id,r),ctx.window.FISHING_BITE_TIMES.ranges['4776|rod:35|2585']);
 const o=m.baitOptions(fish.id,r)[0];assert.equal(o.choice,r.baitChoice);assert.equal(o.alternative.bait.id,2589);
 assert.ok(m.filter(new Set(),{kind:'rod',query:'말름미역',bait:'2585'}).some(f=>f.id===4776));
 for(const f of P.fishes)for(const r of f.routes)if(r.baitChoice?.status==='changed')assert.ok(m.paths(r).every(p=>p.complete&&p.ids[0]===r.bait));
});
test('planner shows normalized evidence and keeps it open when refreshed without changing collection',()=>{
 const p=open({plan:true});try{
  const before=p.storage.getItem(KEY);p.$('#showPlanner').click();p.$('#planCollectionMode').click();p.$('#planSearch').value='표범참바리';p.$('#planRefresh').click();
  assert.equal(p.$('.plan-bait [data-bait-detail]').dataset.baitDetail,'36593');assert.match(p.$('.plan-bait').textContent,/입질 178건/);assert.equal(p.$('.bait-choice-badge').textContent,'관측 보정');
  p.$('[data-plan-detail]').click();const evidence=p.$('.bait-ranking');assert.ok(evidence);assert.equal(evidence.open,false);evidence.open=true;
  assert.match(evidence.querySelector('.is-selected').textContent,/208 \/ 988.*21.1%.*18.6%/);assert.match(evidence.textContent,/2,953 \/ 20,333.*14.5%/);assert.match(evidence.textContent,/실제 성공률은 아닙니다/);
  p.$('#planRefresh').click();assert.equal(p.$('.bait-ranking'),evidence);assert.equal(evidence.open,true);assert.equal(p.storage.getItem(KEY),before);
  p.$('#planSearch').value='폼폼폼';p.$('#planRefresh').click();p.$('.plan-card [data-plan-detail]').click();
  const r=P.fishes.find(f=>f.id===12758).routes[0];assert.equal(r.catalogBait,29717);assert.notEqual(r.bait,r.catalogBait);
  assert.equal(+p.$('.plan-bait [data-bait-detail]').dataset.baitDetail,r.bait);assert.ok(p.$('#planPrep [data-bait-detail="'+r.bait+'"]'));assert.match(p.$('.plan-inline-detail:not([hidden]) .compare-compact-heading').textContent,/고블린 지그/);
  assert.match(p.$('.plan-inline-detail:not([hidden]) .bait-ranking').textContent,/만능 루어에서 변경/);
  const select=p.$('.plan-inline-detail:not([hidden]) [data-compare-exclude]');select.dispatchEvent(new p.w.Event('change',{bubbles:true}));assert.match(p.$('.plan-inline-detail:not([hidden]) .compare-compact-heading').textContent,/고블린 지그/);
 }finally{p.close();}
});
