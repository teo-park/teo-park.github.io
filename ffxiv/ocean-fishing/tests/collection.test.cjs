const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const api=require('../scripts/collection.js');
function parse(s){let rows=[],row=[],f='',q=false;for(let i=0;i<s.length;i++){let c=s[i];if(c==='"'){if(q&&s[i+1]==='"'){f+='"';i++;}else q=!q;}else if(c===','&&!q){row.push(f);f='';}else if(c==='\n'&&!q){row.push(f.replace(/\r$/,''));rows.push(row);row=[];f='';}else f+=c;}if(f||row.length){row.push(f);rows.push(row);}return rows.slice(1).filter(r=>r.length>1).map(r=>Object.fromEntries(rows[0].map((h,i)=>[h.replace(/\r$/,''),r[i]])));}
const load=route=>parse(fs.readFileSync(require('node:path').join(__dirname,'../fishdata/'+route+'-KO.csv'),'utf8'));
test('score candidates rank minimum haul separately per zone, include ties and retain dependencies',()=>{
 const rows=[
  {Fish:'A',Points:'100',DH:'2 - 4',TH:['3 - 6'],TimeFrameDay:'',BestBait:'M!B'},
  {Fish:'B',Points:'10',DH:'1',TH:'1',TimeFrameDay:''},
  {Fish:'C',Points:'90',DH:'3',TH:'4',TimeFrameDay:''},
  {Fish:'D',Points:'100',DH:'3',TH:'4',TimeFrameDay:''},
  {Fish:'E',Points:'100',DH:'2',TH:'3',TimeFrameDay:''},
  {Fish:'Spectral',Points:'1000',DH:'4',TH:'7',TimeFrameDay:'Yes'}
 ];
 assert.deepEqual(api.haulScore(rows[0],'DH'),{min:200,max:400});
 assert.deepEqual(api.haulScore(rows[0],'TH'),{min:300,max:600});
 const plan=api.plan(rows,api.createCatalog(rows),()=>true,true,'','DH');
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
 for(const text of ['null','[]','{}','broken','{"ruby":[]}','{"indigo":{"Gladius":"true"}}','{"ruby":{"__proto__":true}}']){
  assert.throws(()=>api.importCaught(storage,text));assert.equal(value,original);
 }
});
test('all caught regular ghost fish retain their bait information on both routes',()=>{
 for(const [route,count]of [['indigo',7],['ruby',3]]){
  const rows=load(route),catalog=api.createCatalog(rows);
  const expected=rows.filter(row=>row.TimeFrameDay===''&&row.FishTranslated.startsWith('유령'));
  const visible=api.plan(rows,catalog,()=>true,true);
  assert.equal(expected.length,count);
  assert.deepEqual(visible.map(row=>row.Fish),expected.map(row=>row.Fish));
  for(const row of visible){assert.equal(row.LocalAlwaysVisible,true);assert.ok(row.BestBait);assert.ok(row.BestBaitTranslated);}
 }
 assert.equal(api.alwaysVisible({FishTranslated:'유령나비어',TimeFrameDay:''}),true);
 assert.equal(api.alwaysVisible({FishTranslated:'유령 물고기',TimeFrameDay:'Yes'}),false);
 assert.equal(api.alwaysVisible({FishTranslated:'일반 물고기',TimeFrameDay:''}),false);
});
