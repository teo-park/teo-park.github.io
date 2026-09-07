// Build browser-local image signatures. Source images stay in the ignored cache.
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import S from '../scanner.js';
const root=new URL('../',import.meta.url),cache=new URL('../../../.cache/minion-scan/',import.meta.url);
const context={window:{}};vm.runInNewContext(await fs.readFile(new URL('data.js',root),'utf8'),context);
const minions=context.window.MINION_DATA.minions,offline=process.argv.includes('--offline');
await fs.mkdir(cache,{recursive:true});let cursor=0;
async function worker(){
  while(cursor<minions.length){
    const m=minions[cursor++],file=new URL(m.id+'.webp',cache);
    try{await fs.access(file);continue;}catch{if(offline)throw Error('Missing cached icon: '+m.id);}
    for(let n=0;;n++){
      try{const res=await fetch(m.icon,{signal:AbortSignal.timeout(30000)});if(!res.ok)throw Error(res.status+' '+m.icon);await fs.writeFile(file,Buffer.from(await res.arrayBuffer()));break;}
      catch(error){if(n===3)throw error;await new Promise(resolve=>setTimeout(resolve,2000*(n+1)));}
    }
    await new Promise(resolve=>setTimeout(resolve,300));
  }
}
await Promise.all(Array.from({length:5},worker));
const paths=minions.map(m=>({id:m.id,path:fileURLToPath(new URL(m.id+'.webp',cache))}));
await fs.writeFile(new URL('decode-input.json',cache),JSON.stringify(paths));
const decoder=`import json,sys
from PIL import Image
entries=json.load(open(sys.argv[1],encoding='utf-8'))
result=[]
for entry in entries:
    image=Image.open(entry['path']).convert('RGBA')
    result.append({'id':entry['id'],'width':image.width,'height':image.height,'data':list(image.tobytes())})
with open(sys.argv[2],'w',encoding='utf-8') as output: json.dump(result,output,separators=(',',':'))
`;
execFileSync(process.env.MINION_PYTHON||'python',['-c',decoder,fileURLToPath(new URL('decode-input.json',cache)),fileURLToPath(new URL('pixels.json',cache))],{stdio:'inherit'});
const pixels=JSON.parse(await fs.readFile(new URL('pixels.json',cache),'utf8'));
const data={size:S.SIZE,updatedAt:new Date().toISOString().slice(0,10),source:'XIVAPI — MINION_DATA.icon',icons:pixels.map(p=>[p.id,Buffer.from(S.pixels(p,p.width/2,p.height/2,p.width*.8,p.height*.8)).toString('base64')])};
S.references(data);if(data.icons.length!==minions.length||new Set(data.icons.map(r=>r[0])).size!==minions.length)throw Error('Incomplete icon index');
await fs.writeFile(new URL('scan-icons.json',root),JSON.stringify(data)+'\n');
console.log(`Built ${data.icons.length} local icon signatures. Source images are not published.`);
