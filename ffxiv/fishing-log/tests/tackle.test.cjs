const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const E=require('../engine.js'),{D,KEY,open}=require('./helpers.cjs');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../bite-times.js'),'utf8'),context);
const B=JSON.parse(JSON.stringify(context.window.FISHING_BITE_TIMES));

function fixture(){
 const fish=(id,routes)=>({id,name:'어종'+id,fish:true,kind:'rod',order:id,routes});
 return {related:{1:{id:1,name:'미끼 A',fish:false},2:{id:2,name:'미끼 B',fish:false}},spots:{'rod:1':{name:'강'},'rod:2':{name:'바다'}},fishes:[
  fish(10,[{spotKey:'rod:1',bait:1,tug:2,hookset:2,snagging:true},{spotKey:'rod:1',bait:1,tug:1,hookset:2},{spotKey:'rod:1',bait:2,tug:0,hookset:1},{spotKey:'rod:2',bait:1,tug:0,hookset:1}]),
  fish(11,[{spotKey:'rod:1',bait:10,tug:0,hookset:1}]),fish(12,[{spotKey:'rod:2',bait:11,tug:1,hookset:1}]),
  fish(13,[{spotKey:'rod:1',bait:14}]),fish(14,[{spotKey:'rod:1',bait:13}])
 ]};
}
test('each mooch step retains only its preceding bait and spot, including independent tug/hookset variants',()=>{
 const d=fixture(),m=E.create(d),paths=m.tacklePaths(d.fishes[1].routes[0]);assert.equal(paths.length,2);
 const a=paths.find(p=>p.ids[0]===1),b=paths.find(p=>p.ids[0]===2);
 assert.deepEqual(a.steps[1].routes.map(r=>[r.tug,r.hookset,!!r.snagging]),[[2,2,true],[1,2,false]]);
 assert.deepEqual(b.steps[1].routes.map(r=>[r.tug,r.hookset]),[[0,1]]);assert.equal(a.steps[0].routes.length,0);
 assert.deepEqual(m.tacklePaths(d.fishes[2].routes[0])[0].steps,[{id:11,routes:[]}]);
 assert.equal(m.tacklePaths(d.fishes[3].routes[0])[0].complete,false);
});
test('bite observations exclude out-of-scope or sparse bins and retain the full floored-second interval',async()=>{
 const {summarize}=await import('../scripts/update-bite-times.mjs'),row=(t,n=3,spot=1)=>({itemId:10,spot,baitId:1,flooredBiteTime:t,occurences:n});
 assert.deepEqual(summarize([row(1),row(4,2),row(10,5),row(14,3),row(30,4,2),row(600),row(null),row(8.5)],new Set(['10|rod:1|1'])),{'10|rod:1|1':{min:10,max:15,samples:8}});
 const m=E.create(fixture(),{ranges:{'10|rod:1|1':{min:10,max:15,samples:8}}});assert.equal(m.biteTime(10,{spotKey:'rod:2',bait:1}),null);assert.equal(m.biteTime(10,{spotKey:'rod:1',bait:2}),null);
 assert.equal(E.create(fixture()).biteTime(10,{spotKey:'rod:1',bait:1}),null);
});
test('competition includes observed alternate baits, keeps uncertain fish and does not infer hookset from tug',()=>{
 const fish=(id,tug,bait=1,spotKey='rod:1')=>({id,name:'어종'+id,fish:true,routes:[{spotKey,bait,tug,hookset:2}]});
 const data={related:{1:{id:1,fish:false},2:{id:2,fish:false}},spots:{'rod:1':{},'rod:2':{}},fishes:[fish(10,1),fish(11,1,2),fish(12,1,2),fish(13,0),fish(14,1,1,'rod:2'),fish(15,undefined)]};
 const m=E.create(data,{ranges:{'11|rod:1|1':{min:10,max:15,samples:8}}}),rows=m.competitors(10,data.fishes[0].routes[0]);
 assert.deepEqual(new Set(rows.map(r=>r.fish.id)),new Set([11,12,15]));
 assert.equal(rows.find(r=>r.fish.id===11).baitKnown,true);assert.equal(rows.find(r=>r.fish.id===11).routes[0].hookset,2);
 assert.equal(rows.find(r=>r.fish.id===12).baitKnown,false);assert.equal(rows.find(r=>r.fish.id===15).tugKnown,false);
});
test('unique bite windows subtract all overlaps, respect touching edges and refuse unknown comparisons',()=>{
 const c=(min,max)=>({time:{min,max},baitKnown:true,tugKnown:true}),target={min:10,max:30};
 assert.deepEqual(E.clearBiteWindows(target,[c(5,12),c(15,20),c(18,25),c(30,35)]),[[12,15],[25,30]]);
 assert.deepEqual(E.clearBiteWindows(target,[c(10,30)]),[]);assert.deepEqual(E.clearBiteWindows(target,[]),[[10,30]]);
 assert.equal(E.clearBiteWindows(target,[{...c(10,20),baitKnown:false}]),null);assert.equal(E.clearBiteWindows(target,[{time:null}]),null);assert.equal(E.clearBiteWindows(null,[]),null);
});
test('snapshot ranges have real catalog fish and places, and cover the reported preferred-route count',()=>{
 const m=E.create(D,B),keys=new Set();for(const f of m.byId.values())for(const r of f.routes||[])if(r.spotKey.startsWith('rod:')&&r.bait)keys.add(`${f.id}|${r.spotKey}|${r.bait}`);
 assert.equal(B.routeCount,keys.size);assert.equal(B.coveredRoutes,[...keys].filter(k=>B.ranges[k]).length);assert.equal(B.observedCombinations,Object.keys(B.ranges).length);
 for(const [k,r] of Object.entries(B.ranges)){const [id,spot]=k.split('|');assert.ok(m.byId.has(+id));assert.ok(D.spots[spot]);assert.ok(r.min>1&&r.max<=600&&r.min<r.max&&r.samples>=3);}
 assert.ok(Object.keys(B.ranges).length>B.coveredRoutes,'alternative bait observations must survive');
});
test('planner shows target and chained bite details, snagging, short collection labels and preserves collected mooch fish',()=>{
 const p=open({plan:true});try{
  p.$('#showPlanner').click();p.$('#planCollectionMode').click();
  p.$('#planSearch').value='호수성게';p.$('#planRefresh').click();assert.equal(p.$('.plan-snagging').textContent,'갈고리 낚시 필요');assert.match(p.$('.plan-bite-time').textContent,/약 \d+–\d+초/);
  assert.equal(p.$('.plan-card [data-caught]').textContent,'수집');p.$('#showBook').click();p.scanApply([4869]);p.$('#showPlanner').click();
  p.$('#planSearch').value='심해아귀';p.$('#planRefresh').click();assert.equal(p.$('.plan-tug').textContent,'!!');assert.equal(p.$('.plan-hookset').textContent,'강력한 낚아채기');
  const steps=p.all('.plan-mooch');assert.deepEqual(steps.map(e=>e.querySelector('button').textContent),['멜토르 망둥이','줄삼치']);assert.match(steps[0].textContent,/! · 섬세한 낚아채기/);assert.match(steps[1].textContent,/!! · 강력한 낚아채기/);
  const m=E.create(D,B),target=m.byId.get(4912),step=m.tacklePaths(target.routes[0])[0].steps[1],range=m.biteTime(step.id,step.routes[0]);assert.match(steps[0].textContent,new RegExp(`약 ${range.min}–${range.max}초`));
  p.$('.plan-card [data-caught]').click();assert.equal(p.$('.plan-card'),null);p.$('#undo').click();assert.equal(p.$('.plan-card [data-caught]').textContent,'수집');
 }finally{p.close();}
});
test('detail comparisons simulate one exclusion without changing records, and mooch catches cannot use the simulation',()=>{
 const p=open();try{
  p.change('#search','호수성게','input');p.$('#fishGrid [data-fish-detail]').click();const section=p.$('.bite-comparison'),select=section.querySelector('[data-compare-exclude]'),before=p.storage.getItem(KEY);
  assert.ok(section.querySelector('.compare-target'));assert.ok(select.options.length>1);p.change('[data-compare-exclude]',select.options[1].value);assert.equal(p.all('.bite-comparison:first-of-type .compare-excluded').length,1);assert.equal(p.storage.getItem(KEY),before);
  p.$('#detailDialog').close();p.change('#search','심해아귀','input');p.$('#fishGrid [data-fish-detail]').click();assert.equal(p.$('[data-compare-exclude]'),null);assert.match(p.$('.compare-rule').textContent,/생미끼.*적용할 수 없/);
  assert.ok(p.$('.compare-target').textContent.includes('심해아귀'));
 }finally{p.close();}
});
test('spot buttons replace the search with an exact route filter, region changes reset it and alerts stay unchanged',()=>{
 const p=open({plan:true});try{
  p.$('#showPlanner').click();p.$('#planCollectionMode').click();const ids=[...p.planSnapshot().ids];
  p.$('#planSearch').value='호수성게';p.$('#planRefresh').click();const button=p.$('[data-plan-spot]'),key=button.dataset.planSpot;button.click();
  assert.equal(p.$('#planSpot').value,key);assert.equal(p.$('#planSearch').value,'');assert.ok(p.all('.plan-card').length>1);assert.ok(p.all('[data-plan-spot]').every(b=>b.dataset.planSpot===key));assert.deepEqual([...p.planSnapshot().ids],ids);
  p.change('#planSpot','all');assert.ok(p.all('[data-plan-spot]').some(b=>b.dataset.planSpot!==key));
  p.change('#planSpot',key);p.change('#planRegion','다날란');assert.equal(p.$('#planSpot').value,'all');assert.ok(p.all('#planSpot option').slice(1).every(o=>D.spots[o.value].region==='다날란'));
 }finally{p.close();}
});
test('now highlighting covers always fish and active intervals, and stops exactly when a timed interval ends',()=>{
 const p=open({plan:true});try{
  const now=Date.parse('2026-09-09T03:40:00Z');p.w.Date.now=()=>now;p.$('#showPlanner').click();p.$('#planCollectionMode').click();
  p.$('#planSearch').value='호수성게';p.$('#planRefresh').click();assert.equal(p.$('.plan-card').dataset.planNow,'true');assert.equal(p.$('.plan-now-badge').textContent,'지금');
  p.$('#planSearch').value='잘레라';p.$('#planRefresh').click();assert.equal(p.$('.plan-card').dataset.planNow,'false');
  const forecast=p.w.FishingForecast.create(p.w.FISHING_DATA,p.w.FISHING_WEATHER),fish=p.w.FISHING_DATA.fishes.find(f=>f.id===7678),row=forecast.plan([fish],p.planSnapshot().settings,now,30).rows[0];
  p.w.Date.now=()=>row.start;p.$('#planRefresh').click();assert.equal(p.$('.plan-card').dataset.planNow,'true');assert.equal(p.$('.plan-tug').textContent,'!!!');assert.equal(p.$('.plan-hookset').textContent,'섬세한 낚아채기');
  p.w.Date.now=()=>row.end;p.$('#planRefresh').click();assert.equal(p.$('.plan-card').dataset.planNow,'false');
 }finally{p.close();}
});
