import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),cache=new URL('../../../.cache/weapons/icons/',import.meta.url);
await fs.mkdir(cache,{recursive:true});
const data=JSON.parse(await fs.readFile(new URL('data/weapons.json',root),'utf8'));
const urls=[...new Set(data.tracks.flatMap(t=>t.items.map(i=>i.icon)))].sort(),entries=new Map(),failures=[];
const key=url=>new URL(url).searchParams.get('path').split('/').at(-1).replace('.tex','');
const valid=b=>b.length>8&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
let next=0,done=0;
async function worker(){while(next<urls.length){const url=urls[next++],id=key(url),file=new URL(id+'.png',cache);let image;
 try{image=await fs.readFile(file);if(!valid(image))image=null;}catch{}
 for(let attempt=0;!image&&attempt<3;attempt++){try{const r=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('HTTP '+r.status);const b=Buffer.from(await r.arrayBuffer());if(!valid(b))throw Error('Invalid PNG');image=b;await fs.writeFile(file,b);}catch(error){if(attempt===2)failures.push({id,error:error.message});else await new Promise(r=>setTimeout(r,750*(attempt+1)));}}
 if(image)entries.set(id,'data:image/png;base64,'+image.toString('base64'));done++;if(done%100===0)console.log(`${done}/${urls.length}`);
}}
await Promise.all(Array.from({length:6},worker));
if(failures.length){console.log(failures);throw Error('Icon bundle incomplete; previous bundle preserved.');}
const icons=Object.fromEntries([...entries].sort(([a],[b])=>a.localeCompare(b)));
const output={version:1,count:entries.size,source:'https://v2.xivapi.com/',copyright:'© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.',contentSha256:createHash('sha256').update(JSON.stringify(icons)).digest('hex'),icons};
await fs.writeFile(new URL('data/weapon-icons.json',root),JSON.stringify(output)+'\n');console.log(`Bundled ${entries.size} unmodified PNG icons.`);
