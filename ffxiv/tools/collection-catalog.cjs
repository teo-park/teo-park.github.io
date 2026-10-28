// Compact room catalog generated solely from the notebooks' public metadata.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const json=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
function bundled(file,key){const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{timeout:10000});return ctx.window[key];}
function build(){
  const books={};
  function add(id,label,items){books[id]={label,items:items.map(i=>({...i,id:String(i.id)}))};}
  add('blue-mage','청마법',bundled('blue-mage/data.js','BLUE_MAGE_DATA').spells.map(s=>({id:s.id,name:s.name,source:[...new Set(s.sources.map(x=>x.location))].join(' · ')})));
  const weapons=json('weapons/data/weapons.json'),series=new Map(weapons.series.map(s=>[s.id,s])),jobs=new Map(weapons.jobs.map(j=>[j.id,j]));
  add('weapons','무기',weapons.tracks.map(t=>({id:t.id.replaceAll('.','~'),name:series.get(t.seriesId).name+' · '+jobs.get(t.jobId).name+(t.slot==='shield'?' 방패':''),source:series.get(t.seriesId).name,stages:t.items.map(i=>({id:i.id,name:i.stage||i.name}))})));
  const fish=bundled('fishing-log/data.js','FISHING_DATA'),ocean=json('ocean-fishing/data/fish.json').fish;
  const fishes=new Map(fish.fishes.map(f=>[f.id,{id:f.id,name:f.name,source:[...new Set((f.routes||[]).map(r=>fish.spots[r.spotKey]?.name).filter(Boolean))].join(' · ')}]));
  for(const f of ocean)if(f.id&&!fishes.has(f.id))fishes.set(f.id,{id:f.id,name:f.FishTranslated,source:'먼바다 낚시'});
  add('fishing','어부 수첩',[...fishes.values()]);
  add('triple-triad','카드',bundled('triple-triad/data.js','TRIPLE_TRIAD_DATA').cards.map(c=>({id:c.id,name:c.name,source:(c.sources||[]).map(s=>s.name||s.location||s.typeName||'').filter(Boolean).join(' · ')})));
  add('minions','꼬마친구',bundled('minions/data.js','MINION_DATA').minions.map(m=>({id:m.id,name:m.name,source:m.sources.map(s=>s.name||s.typeName).filter(Boolean).join(' · ')})));
  add('beastmaster','마수도감',json('beastmaster/data.json').beasts.map(b=>({id:b.id,name:b.name,source:(b.locations||[]).map(l=>typeof l==='string'?l:l.name||l.place||'').filter(Boolean).join(' · ')})));
  return {version:1,books};
}
if(require.main===module){const out=build();fs.writeFileSync(path.join(root,'collection-room/catalog.json'),JSON.stringify(out)+'\n');console.log(Object.fromEntries(Object.entries(out.books).map(([k,b])=>[k,b.items.length])));}
module.exports={build};
