// Public catalog only. No Lodestone character lookup or user records.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {parseCsv,plain} from '../../triple-triad/scripts/update-data.mjs';
const root=new URL('../',import.meta.url),cache=new URL('../../../.cache/extreme-mounts/',import.meta.url);
async function cached(name,url){
  if(!process.argv.includes('--refresh'))try{return await fs.readFile(new URL(name,cache),'utf8');}catch{}
  const r=await fetch(url,{signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error(r.status+' '+url);
  const text=await r.text();await fs.mkdir(cache,{recursive:true});await fs.writeFile(new URL(name,cache),text);return text;
}
async function update(){
  const manifest=JSON.parse(await fs.readFile(new URL('manifest.json',root),'utf8'));
  const apiRaw=await cached('collect.json','https://ffxivcollect.com/api/mounts'),api=JSON.parse(apiRaw);
  if(api.count!==api.results.length)throw Error('Incomplete Collect catalog');
  const ko=JSON.parse(await cached('ko-meta.json','https://api.github.com/repos/xivapi/ffxiv-datamining/contents/csv/ko'));
  const sheets={};
  for(const [sheet,fields] of Object.entries({Mount:['#','Singular'],Item:['#','Name'],ContentFinderCondition:['#','Name'],Quest:['#','Name']})){
    const text=await cached('ko-'+sheet+'.csv',`https://raw.githubusercontent.com/Ra-Workspace/ffxiv-datamining-ko/${ko.sha}/csv/${sheet}.csv`);
    sheets[sheet]=new Map(parseCsv(text,fields).map(r=>[+r['#'],r]));
  }
  const context={window:{}};vm.runInNewContext(await fs.readFile(new URL('../../duty-finder/data.js',import.meta.url),'utf8'),context);
  const duties=new Map(context.window.DUTY_DATA.duties.map(d=>[d.name,d]));
  const search=name=>'https://guide.ff14.co.kr/lodestone/search?keyword='+encodeURIComponent(name),byId=new Map(api.results.map(m=>[m.id,m])),mounts=[];
  for(const expansion of manifest)for(const [kind,ids] of [['trial',expansion.required],['reward',[expansion.reward]],['extra',expansion.extras]])for(const id of ids){
    const m=byId.get(id),name=plain(sheets.Mount.get(id)?.Singular),item=plain(sheets.Item.get(m?.item_id)?.Name);
    if(!m||!/[가-힣]/.test(name)||!item)throw Error('Missing Korean mount/item '+id);
    const sources=m.sources.filter(s=>s.related_type==='Instance'&&s.type==='Trial'&&(/\(Extreme\)|The Minstrel's Ballad/.test(s.text))).map(s=>{
      const name=plain(sheets.ContentFinderCondition.get(s.related_id)?.Name),duty=duties.get(name);
      if(!name||(id!==293&&!name.startsWith('극 ')&&!name.includes('극 ')))throw Error('Expected Korean extreme duty for '+id+': '+name);
      return {id:s.related_id,name,link:duty?'https://guide.ff14.co.kr/lodestone/db/duty/'+duty.id:search(name)};
    });
    const quest=m.sources.find(s=>s.related_type==='Quest'),questName=quest?plain(sheets.Quest.get(quest.related_id)?.Name):'';
    if(kind==='reward'&&!questName)throw Error('Missing reward quest '+id);
    if(kind!=='reward'&&!sources.length)throw Error('Missing extreme acquisition duty '+id);
    mounts.push({id,name,original:m.name,itemId:m.item_id,itemName:item,expansion:expansion.id,kind,patch:m.patch,icon:m.icon,image:m.image,sources,quest:questName?{id:quest.related_id,name:questName,link:search(questName)}:null,official:search(item),collect:'https://ffxivcollect.com/mounts/'+id});
  }
  if(mounts.length!==50||new Set(mounts.map(m=>m.id)).size!==50)throw Error('Expected 50 unique curated mounts');
  const data={version:1,updatedAt:new Date().toISOString().slice(0,10),expansions:manifest,mounts,source:{collect:'https://ffxivcollect.com/api/mounts',collectSha256:createHash('sha256').update(apiRaw).digest('hex'),korean:'https://github.com/Ra-Workspace/ffxiv-datamining-ko/tree/'+ko.sha,patchNote:'https://www.ff14.co.kr/news/notice/view/2865'}};
  await fs.writeFile(new URL('data.json',root),JSON.stringify(data,null,2)+'\n');
  await fs.writeFile(new URL('data.js',root),'// Generated public game metadata. See README.md.\nwindow.EXTREME_MOUNTS_DATA='+JSON.stringify(data)+';\n');
  console.log(JSON.stringify({mounts:mounts.length,expansions:manifest.length,required:manifest.reduce((n,e)=>n+e.required.length,0),rewards:manifest.length,extras:manifest.reduce((n,e)=>n+e.extras.length,0)}));
}
if(process.argv[1]===fileURLToPath(import.meta.url))await update();
export {update};
