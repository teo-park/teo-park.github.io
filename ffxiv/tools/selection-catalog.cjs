// Public game metadata only. Never read user saves or search input.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
function bundled(file,key){const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context,{timeout:10000});return context.window[key];}
function build(){
  const groups={};
  const add=(key,label,rows)=>{const names={};for(const row of rows){const id=String(row.id);if(!/^[a-z0-9]{1,16}$/.test(id)||!row.name)throw Error('Invalid catalog entry');names[id]=row.name;}groups[key]={label,names};};
  add('quest','메인 퀘스트',bundled('msq-tracker/data.js','MSQ_DATA').quests);
  add('duty','임무',bundled('duty-finder/data.js','DUTY_DATA').duties);
  add('card','트리플 트라이어드 카드',bundled('triple-triad/data.js','TRIPLE_TRIAD_DATA').cards);
  add('minion','꼬마친구',bundled('minions/data.js','MINION_DATA').minions);
  add('spell','청마법',bundled('blue-mage/data.js','BLUE_MAGE_DATA').spells);
  add('beast','마수',JSON.parse(fs.readFileSync(path.join(root,'beastmaster/data.json'),'utf8')).beasts);
  const fishing=bundled('fishing-log/data.js','FISHING_DATA');
  const ocean=JSON.parse(fs.readFileSync(path.join(root,'ocean-fishing/data/fish.json'),'utf8')).fish;
  add('fish','물고기',[...Object.values(fishing.related).filter(f=>f.fish),...fishing.fishes,...ocean.filter(f=>f.id).map(f=>({id:f.id,name:f.FishTranslated}))]);
  return {version:1,groups,oceanEntries:Object.fromEntries(ocean.filter(f=>f.id).map(f=>[f.entryId,String(f.id)]))};
}
module.exports={build};
