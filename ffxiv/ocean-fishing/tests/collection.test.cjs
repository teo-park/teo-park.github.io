const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const api=require('../scripts/collection.js');
function parse(s){let rows=[],row=[],f='',q=false;for(let i=0;i<s.length;i++){let c=s[i];if(c==='"'){if(q&&s[i+1]==='"'){f+='"';i++;}else q=!q;}else if(c===','&&!q){row.push(f);f='';}else if(c==='\n'&&!q){row.push(f.replace(/\r$/,''));rows.push(row);row=[];f='';}else f+=c;}if(f||row.length){row.push(f);rows.push(row);}return rows.slice(1).filter(r=>r.length>1).map(r=>Object.fromEntries(rows[0].map((h,i)=>[h.replace(/\r$/,''),r[i]])));}
const load=route=>parse(fs.readFileSync(require('node:path').join(__dirname,'../fishdata/'+route+'-KO.csv'),'utf8'));

test('new Ruby stops retain the complete Teamcraft census and verified timing corrections',()=>{
 const rows=load('ruby'),report=require('../fishdata/ruby-verification.json');
 const map=require('../scripts/teamcraft-ids.js');
 assert.equal(rows.length,120);assert.equal(api.createCatalog(rows).size,119);
 for(const spot of report.census){
  const actual=rows.filter(r=>r.Stop===spot.stop&&!!r.TimeFrameDay===spot.spectral).map(r=>api.key(r.Fish));
  const expected=spot.itemIds.flatMap(id=>map[id]).filter(r=>r.route==='ruby').map(r=>api.key(r.name));
  assert.equal(actual.length,10);assert.deepEqual(new Set(actual),new Set(expected));
 }
 assert.equal(report.changes.length,8);
 for(const change of report.changes){
  const row=rows.find(r=>r.Stop===change.stop&&!!r.TimeFrameDay===change.spectral&&api.name(r.Fish)===change.fish);
  assert.equal(row[change.field],change.after);
 }
 const find=name=>rows.find(r=>api.name(r.Fish)===name);
 assert.equal(api.baitInfo(find('Sanbaso')).rawTime,'18 - 31');
 assert.equal(find('Shisui Goby').BaitPlumpWorm,'14 - 25');
 assert.equal(api.baitInfo(find('Akupara')).window,null);
 assert.equal(find('Manasvin').BaitSpecial,'9 - 12');
 assert.ok(api.dependencies(find('Tylosaurus')).includes(api.key('Cieldalaes Roosterfish')));
 assert.equal(api.recommend([find('Tylosaurus')]).get(find('Tylosaurus')).conditional,false);
 assert.ok(rows.filter(r=>['Unnamed','Thavnair'].includes(r.Stop)&&!r.TimeFrameDay).every(r=>r.BaitVersatileLure===''),'unmeasured values remain unfilled');
});
test('multiple species show the union of targets and prerequisites; empty selection keeps only ghosts',()=>{
 for(const route of ['indigo','ruby']){
  const rows=load(route),catalog=api.createCatalog(rows),groups=[...new Set(rows.map(r=>r.Species).filter(Boolean))];
  for(let i=0;i<groups.length;i++)for(let j=i+1;j<groups.length;j++){
   const selected=[groups[i],groups[j]];
   const combined=api.plan(rows,catalog,()=>true,true,selected);
   const separate=selected.flatMap(group=>api.plan(rows,catalog,()=>true,true,group));
   assert.deepEqual(new Set(combined.map(r=>r.Fish)),new Set(separate.map(r=>r.Fish)));
   for(const row of combined)assert.equal(row.LocalGroupMatch,selected.includes(row.Species));
   assert.deepEqual(selected,[groups[i],groups[j]],'selection is not mutated');
  }
  const empty=api.plan(rows,catalog,()=>false,false,[]);
  assert.deepEqual(empty.map(r=>r.Fish),rows.filter(api.alwaysVisible).map(r=>r.Fish));
 }
});
test('score mode shows every fish while marking top candidates and retaining dependencies',()=>{
 const rows=[
  {Fish:'A',Points:'100',DH:'2 - 4',TH:['3 - 6'],TimeFrameDay:'',BestBait:'M!B'},
  {Fish:'B',Points:'10',DH:'1',TH:'1',TimeFrameDay:''},
  {Fish:'C',Points:'90',DH:'3',TH:'4',TimeFrameDay:''},
  {Fish:'D',Points:'100',DH:'3',TH:'4',TimeFrameDay:''},
  {Fish:'E',Points:'100',DH:'2',TH:'3',TimeFrameDay:''},
  {Fish:'Spectral',Points:'1000',DH:'4',TH:'7',TimeFrameDay:'Yes'},
  {Fish:'Low',Points:'1',DH:'1',TH:'1',TimeFrameDay:''}
 ];
 assert.deepEqual(api.haulScore(rows[0],'DH'),{min:200,max:400});
 assert.deepEqual(api.haulScore(rows[0],'TH'),{min:300,max:600});
 const plan=api.plan(rows,api.createCatalog(rows),()=>true,true,'','DH');
 assert.deepEqual(plan.map(row=>row.Fish),rows.map(row=>row.Fish));
 for(const route of ['indigo','ruby'])for(const mode of ['DH','TH']){
  const all=load(route);
  assert.equal(api.plan(all,api.createCatalog(all),()=>true,true,'',mode).length,all.length);
 }
 assert.deepEqual(new Set(plan.filter(r=>r.LocalScore).map(r=>r.Fish)),new Set(['A','C','D','E','Spectral']));
 assert.ok(plan.find(r=>r.Fish==='B').LocalGroupDependency);
 assert.deepEqual(api.haulScore({Points:'100',DH:''},'DH'),{min:300,max:400});
});
test('all task species include caught targets, transitive prerequisites, and regular ghosts',()=>{
 for(const route of ['indigo','ruby']) {
  const rows=load(route), catalog=api.createCatalog(rows), groups=new Set(rows.map(r=>r.Species).filter(Boolean));
  assert.equal(groups.size,route==='indigo'?7:5);
  for(const species of groups) {
   const visible=api.plan(rows,catalog,()=>true,true,species);
   for(const row of rows.filter(r=>r.Species===species||api.alwaysVisible(r))) assert.ok(visible.some(v=>v.Fish===row.Fish));
   for(const row of visible) assert.ok(row.LocalGroupMatch||row.LocalAlwaysVisible||row.LocalRequiredBy.length);
   for(const target of visible.filter(r=>r.LocalGroupMatch)) {
    const visit=id=>{for(const dep of catalog.get(id).dependencies){assert.ok(visible.some(v=>api.key(v.Fish)===dep),species+' prerequisite '+dep); visit(dep);}};
    visit(api.key(target.Fish));
   }
  }
 }
});
test('all real intuition/mooch dependencies in both catalogs resolve',()=>{
 for(const route of ['indigo','ruby']){const rows=load(route),catalog=api.createCatalog(rows);let edges=0;for(const [id,entry]of catalog)for(const dep of entry.dependencies){assert.ok(catalog.has(dep),route+' '+id+' -> '+dep);edges++;}assert.ok(edges>0);console.log(route+': '+catalog.size+' fish, '+edges+' dependency edges');}
});
test('caught prerequisites survive transitively and disappear when the target is caught',()=>{
 const rows=load('indigo'),catalog=api.createCatalog(rows);
 for(const [target,prerequisites] of [['Little Leviathan',['Gladius','Ghoul Barracuda']],['Coral Manta',['Great Grandmarlin','Hi-aetherlouse']]]){
  const visible=api.plan(rows,catalog,fish=>api.key(fish)!==api.key(target),true);
  assert.deepEqual(new Set(visible.filter(r=>!r.LocalAlwaysVisible).map(r=>api.name(r.Fish))),new Set([target,...prerequisites]));
  for(const row of visible.filter(r=>r.LocalCaught&&!r.LocalAlwaysVisible))assert.ok(row.LocalRequiredBy.length);
 }
 assert.equal(api.plan(rows,catalog,()=>true,true).length,7);
 assert.equal(api.plan(rows,catalog,()=>true,false).length,rows.length);
});
test('stored flags survive reload; unchecking clears old entry keys without touching the other route',()=>{
 let value=JSON.stringify({indigo:{'Gladius|old|key':true},ruby:{Other:true}});const storage={getItem:()=>value,setItem:(k,v)=>value=v};
 assert.ok(api.caught(api.read(storage),'indigo','T!Gladius'));
 api.setCaught(storage,'indigo','Gladius',false);
 assert.equal(api.caught(api.read(storage),'indigo','T!Gladius'),false);
 assert.equal(api.caught(api.read(storage),'ruby','Other'),true);
 api.setCaught(storage,'indigo','Gladius',true);
 assert.equal(api.caught(api.read(storage),'indigo','T!Gladius'),true);
});
test('original export merges both routes, handles entry keys, and preserves existing catches',()=>{
 let value=JSON.stringify({indigo:{Gladius:false,Existing:true},ruby:{Saved:true}});
 const storage={getItem:()=>value,setItem:(k,v)=>value=v};
 const text=JSON.stringify({indigo:{'Gladius|갈라디온 만||||krill||':true,'Gladius|southern|||yes|krill||':false,Existing:false},ruby:{'Dusk Shark|sirensong||||krill||':true}});
 const result=api.importCaught(storage,'\uFEFF'+text);
 assert.equal(result.imported,2);
 const state=api.read(storage);
 for(const [route,fish]of [['indigo','Gladius'],['indigo','Existing'],['ruby','Dusk Shark'],['ruby','Saved']])assert.equal(api.caught(state,route,fish),true);
 api.setCaught(storage,'indigo','Gladius',false);
 assert.equal(api.caught(api.read(storage),'indigo','Gladius'),false);
 const backup=value;
 value='{}';api.importCaught(storage,backup);
 assert.equal(api.caught(api.read(storage),'ruby','Dusk Shark'),true);
 assert.equal(api.caught(api.read(storage),'indigo','Gladius'),false);
});
test('invalid imports leave saved progress unchanged',()=>{
 let value=JSON.stringify({indigo:{Gladius:true},ruby:{}});const original=value;
 const storage={getItem:()=>value,setItem:(k,v)=>value=v};
 for(const text of ['null','["not an ID"]','{}','broken','{"ruby":[]}','{"indigo":{"Gladius":"true"}}','{"ruby":{"__proto__":true}}']){
  assert.throws(()=>api.importCaught(storage,text));assert.equal(value,original);
 }
});
test('Teamcraft ID map resolves all 259 fish exactly once',()=>{
 const ids=require('../scripts/teamcraft-ids.js'),entries=Object.values(ids).flat();
 assert.equal(Object.keys(ids).length,259);
 for(const route of ['indigo','ruby']){
  const catalog=api.createCatalog(load(route));
  assert.deepEqual(new Set(entries.filter(e=>e.route===route).map(e=>api.key(e.name))),new Set(catalog.keys()));
 }
});
test('Teamcraft import deduplicates, merges both routes, ignores unrelated IDs and validates atomically',()=>{
 const map=require('../scripts/teamcraft-ids.js');
 const indigo=Object.keys(map).find(id=>map[id][0].route==='indigo'),ruby=Object.keys(map).find(id=>map[id][0].route==='ruby');
 let value=JSON.stringify({indigo:{Existing:true,[map[indigo][0].name]:true},ruby:{Saved:true}});
 const storage={getItem:()=>value,setItem:(k,v)=>value=v};
 const result=api.importCaught(storage,JSON.stringify([+indigo,+ruby,+ruby,19956,22222]),map);
 assert.equal(result.imported,2);assert.equal(result.added,1);assert.equal(result.ignored,2);assert.equal(result.duplicates,1);
 assert.equal(api.caught(api.read(storage),'ruby',map[ruby][0].name),true);assert.equal(api.caught(api.read(storage),'indigo','Existing'),true);
 const unchanged=value;
 const sample=[19956,19933,17560,27697,20074,20050,20073,20011,26752,26753,29512,29520,29521,26754,26755,26757,22222];
 const ignored=api.importCaught(storage,JSON.stringify(sample),map);assert.equal(ignored.imported,0);assert.equal(ignored.ignored,17);assert.equal(value,unchanged);
 assert.equal(api.importCaught(storage,'[]',map).imported,0);assert.equal(value,unchanged);
 for(const ids of [[+indigo,'2'],[-1],[0],[1.5],[null],[{}]]){assert.throws(()=>api.importCaught(storage,JSON.stringify(ids),map));assert.equal(value,unchanged);}
});
test('Teamcraft export includes caught fish across routes once, preserves storage and round trips',()=>{
 const map=require('../scripts/teamcraft-ids.js');
 const a=Object.keys(map).find(id=>map[id][0].route==='indigo'),b=Object.keys(map).find(id=>map[id][0].route==='ruby');
 const fish=map[a][0].name;
 let value=JSON.stringify({indigo:{[fish]:false,[fish+'|legacy']:true,[fish.toUpperCase()+'|other']:true,Unknown:true},ruby:{[map[b][0].name]:true}});
 const storage={getItem:()=>value,setItem:(k,v)=>value=v},before=value;
 const payload=api.exportTeamcraft(storage,map);
 assert.deepEqual(payload,{completed:[+a,+b].sort((a,b)=>a-b)});assert.equal(value,before);
 value='{}';assert.deepEqual(api.exportTeamcraft(storage,map),{completed:[]});
 api.importCaught(storage,JSON.stringify(payload),map);
 assert.deepEqual(api.exportTeamcraft(storage,map),payload);
 api.setCaught(storage,'indigo',fish,false);
 assert.deepEqual(api.exportTeamcraft(storage,map),{completed:[+b]});
 const saved=value;
 for(const completed of [null,{},[+a,'bad']]){assert.throws(()=>api.importCaught(storage,JSON.stringify({completed}),map));assert.equal(value,saved);}
});
test('all caught regular ghost and spectral fish retain their bait information on both routes',()=>{
 for(const [route,count]of [['indigo',7],['ruby',6]]){
  const rows=load(route),catalog=api.createCatalog(rows);
  const expected=rows.filter(row=>row.TimeFrameDay===''&&/^(유령|환해)/.test(row.FishTranslated));
  const visible=api.plan(rows,catalog,()=>true,true);
  assert.equal(expected.length,count);
  assert.deepEqual(visible.map(row=>row.Fish),expected.map(row=>row.Fish));
  for(const row of visible){assert.equal(row.LocalAlwaysVisible,true);assert.ok(row.BestBait);assert.ok(row.BestBaitTranslated);}
 }
 assert.equal(api.alwaysVisible({FishTranslated:'유령나비어',TimeFrameDay:''}),true);
 assert.equal(api.alwaysVisible({FishTranslated:'유령 물고기',TimeFrameDay:'Yes'}),false);
 assert.equal(api.alwaysVisible({FishTranslated:'일반 물고기',TimeFrameDay:''}),false);
 assert.equal(api.alwaysVisible({FishTranslated:'환해 놀래기',TimeFrameDay:''}),true);
 assert.equal(api.alwaysVisible({FishTranslated:'환해 골설어',TimeFrameDay:'Yes'}),false);
 assert.equal(api.alwaysVisible({FishTranslated:'이름 변경된 유도어',TimeFrameDay:'',spectralTrigger:true}),true);
});
test('recommendations across the real catalog respect GP, skill availability and unknown data',()=>{
 for(const route of ['indigo','ruby']){
  const rows=load(route);
  for(const gp of [399,400,699,700,1000])for(const objective of ['efficiency','burst']){
   const recommendations=api.recommend(rows,{gp,objective});
   for(const [row,rec] of recommendations){
    if(!rec.best)continue;
    assert.ok(rec.best.cost<=gp);assert.ok(rec.best.extra.min>0);assert.ok(rec.rank>=1);
    assert.ok(String(row[rec.best.action]).trim(),'never uses an empty CSV count');
    assert.ok(Number.isFinite(rec.best.efficiency));
    assert.equal(rec.conditional,rec.hints.conditions.length>0);
   }
  }
 }
});
test('route achievements intersect all three stops, respecting spectral time and regular alternatives',()=>{
 const stops=[{stop:'A',time:'Day'},{stop:'B',time:'Night'},{stop:'C',time:'Sunset'}];
 const row=(Stop,Species,extra={})=>({Stop,Species,SpeciesTranslated:Species,TimeFrameDay:'',...extra});
 const rows=[row('A','Shark'),row('B','Shark'),row('C','Shark'),row('A','Octopus'),row('B','Octopus'),
  row('C','Octopus',{TimeFrameDay:'No',TimeFrameNight:'No',TimeFrameSunset:'Yes'}),
  row('A','Wrong time'),row('B','Wrong time'),row('C','Wrong time',{TimeFrameDay:'Yes',TimeFrameSunset:'No'}),
  row('A','Only two'),row('B','Only two'),row('A',''),row('B',''),row('C',''),
  row('AB','Wrong stop'),row('B','Wrong stop'),row('C','Wrong stop')];
 const before=JSON.stringify(rows),groups=api.routeAchievements(rows,stops);
 assert.deepEqual(groups.map(group=>group.id),['Octopus','Shark']);
 assert.equal(groups[0].requiresSpectral,true);assert.equal(groups[1].requiresSpectral,false);
 assert.deepEqual(groups[0].stops.map(stop=>stop.regular),[true,true,false]);
 assert.equal(JSON.stringify(rows),before);
 assert.deepEqual(api.routeAchievements(rows,stops.slice(0,2)),[]);
 assert.deepEqual(api.routeAchievements(rows,[...stops.slice(0,2),{stop:'C',time:'Invalid'}]),[]);
 const changed=api.routeAchievements(rows,[...stops.slice(0,2),{stop:'C',time:'Day'}]);
 assert.deepEqual(changed.map(group=>group.id),['Shark','Wrong time']);
 rows.push(row('C','Octopus'));
 assert.equal(api.routeAchievements(rows,stops).find(group=>group.id==='Octopus').requiresSpectral,false);
 const aliasStops=[...stops.slice(0,2),{stop:'Blood',time:'Day'}];
 assert.deepEqual(api.routeAchievements([...rows,row('Bloodbrine','Shark')],aliasStops).map(group=>group.id),['Shark']);
});
test('real route achievement groups are independent of catches and include only the three-stop intersection',()=>{
 const voyages=require('../scripts/voyages.js');
 const configs=Object.fromEntries(['indigo','ruby'].map(route=>[route,Array.from({length:route==='indigo'?12:9},(_,i)=>voyages.stops(route,i+1))]));
 for(const route of ['indigo','ruby']){
  const rows=load(route),catalog=new Set(rows.map(row=>row.Species).filter(Boolean));
  const actual=configs[route].map(stops=>api.routeAchievements(rows,stops));
  assert.equal(actual.length,route==='indigo'?12:9);
  const expected=route==='indigo'?[[],[],[],[],[],[],['Crab'],['Crab'],['Crab'],['Fugu'],['Fugu'],['Fugu']]:[['Mantis','Prehistoric'],['Shellfish','Shrimp'],['Shrimp','Squid'],['Mantis','Prehistoric'],['Shellfish','Shrimp'],['Shrimp','Squid'],['Mantis','Prehistoric'],['Shellfish','Shrimp'],['Shrimp','Squid']];
  // The expected snapshots below are checked against the bundled route data.
  assert.deepEqual(Array.from(actual,groups=>groups.map(group=>group.id).sort()),expected);
  for(let index=0;index<actual.length;index++)for(const group of actual[index]){
   assert.ok(catalog.has(group.id));assert.equal(group.stops.length,3);
   assert.ok(group.stops.every(stop=>stop.regular||stop.spectral));
  }
  console.log(route+': '+actual.length+' achievement route configurations verified');
 }
});
