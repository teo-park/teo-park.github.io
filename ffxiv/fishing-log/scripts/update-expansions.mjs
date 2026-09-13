// Expansion membership only; preserve the notebook's Korean fish list and routes.
import fs from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),revision='8e62945d81bd9ae57da661fbf0baaa3a7f1fbac4';
const cache=new URL(`../../../.cache/fishing-expansions/${revision}/`,import.meta.url);
const source=name=>`https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/${revision}/libs/data/src/lib/json/${name}`;
async function read(name){
  const file=new URL(name.split('/').at(-1),cache);
  if(!process.argv.includes('--refresh'))try{return JSON.parse(await fs.readFile(file,'utf8'));}catch{}
  const response=await fetch(source(name),{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error(`${response.status}: ${name}`);
  const text=await response.text();await fs.mkdir(cache,{recursive:true});await fs.writeFile(file,text);return JSON.parse(text);
}
const [items,patches,versions]=await Promise.all(['item-patch.json','patch-names.json','ko/ko-ex-versions.json'].map(read));
const context={window:{}};vm.runInNewContext(await fs.readFile(new URL('data.js',root),'utf8'),context);
const labels=Object.fromEntries(Object.entries(versions).map(([id,name])=>[id,name.ko]));
const byFish={};
for(const fish of context.window.FISHING_DATA.fishes){
  const patch=patches[items[fish.id]];
  if(!Number.isInteger(patch?.ex)||!labels[patch.ex])throw Error(`확장팩 자료 누락: ${fish.name} (${fish.id})`);
  byFish[fish.id]=patch.ex;
}
const result={schemaVersion:1,revision,sources:['item-patch.json','patch-names.json','ko/ko-ex-versions.json'].map(source),labels,byFish};
await fs.writeFile(new URL('expansion-data.js',root),'/* Teamcraft item introduction patches → expansion IDs. See README.md. */\nwindow.FISHING_EXPANSIONS='+JSON.stringify(result,null,2)+';\n');
console.log(JSON.stringify({count:Object.keys(byFish).length,expansions:Object.entries(labels).map(([id,name])=>({name,count:Object.values(byFish).filter(ex=>ex===+id).length}))}));
