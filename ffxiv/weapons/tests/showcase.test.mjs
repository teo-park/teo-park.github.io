import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {buildShowcase,showcaseLayout,drawShowcase,loadShowcaseIcons,canvasPNG,writePNG} from '../showcase.js';
import {mountShowcase} from '../showcase-ui.js';
const data=JSON.parse(await fs.readFile(new URL('../data/weapons.json',import.meta.url),'utf8'));
const track=id=>data.tracks.find(t=>t.id===id),record=(id,n)=>({itemId:track(id).items[n-1]?.id||0,target:true,note:'이 메모는 이미지에 나가면 안 됩니다.'});
const records={'zodiac.PLD.weapon':record('zodiac.PLD.weapon',8),'zodiac.PLD.shield':record('zodiac.PLD.shield',3),'top.PCT.weapon':record('top.PCT.weapon',1),'phantom.SGE.weapon':record('phantom.SGE.weapon',2)};
test('bundled icons cover every stage with valid PNGs',async()=>{
 const bundle=JSON.parse(await fs.readFile(new URL('../data/weapon-icons.json',import.meta.url),'utf8'));
 const urls=new Set(data.tracks.flatMap(t=>t.items.map(i=>i.icon)));
 assert.equal(bundle.count,526);assert.equal(Object.keys(bundle.icons).length,urls.size);
 for(const url of urls){
  const key=new URL(url).searchParams.get('path').split('/').at(-1).replace('.tex',''),value=bundle.icons[key];
  assert.ok(value?.startsWith('data:image/png;base64,'),key);
  const png=Buffer.from(value.split(',')[1],'base64');assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.ok(png.readUInt32BE(16)>0&&png.readUInt32BE(20)>0);
 }
});
test('overview includes all 260 tracks in 22 job rows, independent of ordinary filters',()=>{
 const m=buildShowcase(data,records,{query:'없는 무기',series:'zodiac',job:'PLD',status:'complete',page:2});
 assert.equal(m.rows.length,22);assert.equal(new Set(m.rows.map(r=>r.job.id)).size,22);assert.equal(m.series.length,15);assert.equal(m.stats.total,260);assert.equal(m.stats.complete,2);assert.equal(m.stats.progress,2);
 assert.equal(m.rows.flatMap(r=>r.cells.flatMap(c=>c.entries)).length,260);
 for(const r of m.rows){assert.equal(r.cells.length,15);assert.ok(r.cells.flatMap(c=>c.entries).every(e=>e.trackId.includes('.'+r.job.id+'.')));}
 assert.equal(JSON.stringify(m).includes('이 메모'),false);assert.equal(JSON.stringify(m).includes('"target":'),false);
});
test('PLD sword/shield share one cell and independently preserve partial progress',()=>{
 const m=buildShowcase(data,records),pld=m.rows.find(r=>r.job.id==='PLD'),entries=pld.cells[0].entries;
 assert.deepEqual(entries.map(e=>e.slot),['weapon','shield']);assert.deepEqual(entries.map(e=>e.status),['complete','progress']);assert.equal(entries[1].step,3);assert.equal(entries[1].item.id,track('zodiac.PLD.shield').items[2].id);
 assert.equal(m.rows.find(r=>r.job.id==='SGE').cells[0].entries.length,0);
});
test('hiding untouched jobs never inflates the collection percentage',()=>{
 const m=buildShowcase(data,records,{onlyStarted:true});assert.deepEqual(m.rows.map(r=>r.job.id),['PLD','SGE','PCT']);assert.equal(m.stats.total,260);assert.equal(m.stats.complete,2);
 const empty=buildShowcase(data,{}, {onlyStarted:true});assert.equal(empty.rows.length,0);assert.equal(empty.stats.total,260);assert.ok(showcaseLayout(empty).height>400);
});
test('category-specific images retain all eligible jobs and exact counts',()=>{
 const m=buildShowcase(data,records,{kind:'enhanced'});assert.equal(m.series.length,2);assert.equal(m.stats.total,23);assert.equal(m.rows.length,22);
 assert.equal(buildShowcase(data,records,{kind:'ultimate'}).stats.total,136);
 for(const kind of ['','relic','ultimate','enhanced']){const model=buildShowcase(data,records,{kind}),l=showcaseLayout(model);assert.ok(l.width>=820);assert.ok(l.columns.every((c,i)=>c.x>=l.pad+l.label&&c.x+c.width<=l.width-l.pad+.01&&(!i||c.x>l.columns[i-1].x+l.columns[i-1].width)));}
});
test('PNG painting works without network icons and retains a single row per job',()=>{
 const calls=[],ctx=new Proxy({measureText:s=>({width:String(s).length*7}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:(...args)=>calls.push([k,...args])});
 const canvas={getContext:()=>ctx};const model=buildShowcase(data,records,{name:'모험가',theme:'paper',date:'2026-09-09'}),l=drawShowcase(canvas,model);
 assert.equal(canvas.width,l.width*2);assert.equal(canvas.height,l.height*2);assert.ok(canvas.width*canvas.height<16_000_000);
 for(const r of model.rows)assert.equal(calls.filter(c=>c[0]==='fillText'&&c[1]===r.job.name).length,1);
 assert.ok(calls.some(c=>c[0]==='fillText'&&c[1]==='모험가'));assert.ok(calls.some(c=>c[0]==='fillText'&&c[1].includes('© SQUARE ENIX')));assert.equal(calls.some(c=>c[0]==='drawImage'),false);
});
test('icon loading is CORS-safe, bounded, deduplicated, cached and retryable',async()=>{
 let count=0;const cache=new Map(),opts={cache,fetcher:async(url,options)=>{count++;assert.equal(options.mode,'cors');assert.equal(options.credentials,'omit');if(url==='bad')throw Error('blocked');return {ok:true,blob:async()=>url};},decode:async b=>({id:b})};
 const r=await loadShowcaseIcons(['a','a','b','bad'],opts);assert.equal(count,3);assert.equal(r.missing,1);assert.equal(cache.size,2);
 await loadShowcaseIcons(['a','b','bad'],opts);assert.equal(count,4);
 const aborted=await loadShowcaseIcons(['slow'],{timeout:5,fetcher:(_,options)=>new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(Error('aborted')))),decode:async()=>({})});assert.equal(aborted.missing,1);
});
test('PNG encoding and clipboard success/failure retain real result semantics',async()=>{
 const png=new Blob(['png'],{type:'image/png'});assert.equal(await canvasPNG({toBlob:fn=>fn(png)}),png);await assert.rejects(canvasPNG({toBlob:fn=>fn(null)}));
 let value;await writePNG(png,{Item:class{constructor(v){value=v;}},clipboard:{write:async items=>assert.equal(items.length,1)}});assert.equal(value['image/png'],png);
 await assert.rejects(writePNG(png,{clipboard:{},Item:null}),/PNG 저장/);
 await assert.rejects(writePNG(png,{Item:class{},clipboard:{write:async()=>{throw Error('denied');}}}),/denied/);
});
const html=await fs.readFile(new URL('../index.html',import.meta.url),'utf8');
async function ui(run,{loader,encoder,copy,getRecords}={}){
 const dom=new JSDOM(html,{url:'https://example.test/ffxiv/weapons/'}),w=dom.window,d=w.document,painted=[];
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};w.URL.createObjectURL=()=>`blob:preview-${painted.length}`;w.URL.revokeObjectURL=()=>{};
 const controller=mountShowcase({catalog:data,doc:d,getRecords:getRecords||(()=>records),loadIcons:loader||(async urls=>({images:new Map(urls.map(url=>[url,{}])),missing:0})),paint:(c,m)=>{painted.push(m);c.width=3048;c.height=4256;return{width:1524};},toPNG:encoder||(async()=>new Blob(['png'],{type:'image/png'})),copyPNG:copy||(async()=>{})});
 const click=id=>d.getElementById(id).click(),tick=()=>new Promise(r=>setImmediate(r));
 try{await run({w,d,click,tick,painted,controller});}finally{d.getElementById('showcaseDialog').close();w.close();}
}
test('share dialog prepares the full snapshot and does not touch collection storage',()=>ui(async({d,click,tick,painted,w})=>{
 w.localStorage.setItem('teo-ffxiv.weapons.collection.v1','original');click('openShowcase');assert.equal(d.getElementById('copyShowcase').disabled,true);await tick();
 assert.equal(d.getElementById('copyShowcase').disabled,false);assert.equal(painted[0].rows.length,22);assert.equal(d.querySelectorAll('#shareText tbody tr').length,22);assert.equal(w.localStorage.getItem('teo-ffxiv.weapons.collection.v1'),'original');
 click('copyShowcase');await tick();assert.match(d.getElementById('shareStatus').textContent,/복사했습니다/);click('closeShowcase');
}));
test('denied clipboard uses a truthful message and keeps PNG save available',()=>ui(async({d,click,tick})=>{
 click('openShowcase');await tick();click('copyShowcase');await tick();assert.match(d.getElementById('shareStatus').textContent,/PNG 저장/);assert.equal(d.getElementById('saveShowcase').disabled,false);
},{copy:async()=>{throw Error('NotAllowedError');}}));
test('blocked external font still exports with the secondary font',()=>ui(async({d,click,tick,painted})=>{
 Object.defineProperty(d,'fonts',{value:{load:async family=>{if(family.includes('KotraHope'))throw Error('CDN unavailable');return [];}}});
 click('openShowcase');await tick();assert.equal(d.getElementById('copyShowcase').disabled,false);assert.equal(painted[0].fontFamily,'NanumSquareRound, sans-serif');
}));
test('failed generation never copies an old preview after an option change',()=>ui(async({d,click,tick,controller})=>{
 click('openShowcase');await tick();assert.equal(d.getElementById('saveShowcase').disabled,false);d.getElementById('shareName').value='새 이름';await controller.refresh();assert.equal(d.getElementById('copyShowcase').disabled,true);assert.equal(d.getElementById('saveShowcase').disabled,true);assert.match(d.getElementById('shareStatus').textContent,/준비하지 못했습니다/);
},{encoder:(()=>{let n=0;return async()=>{if(n++)throw Error('PNG failure');return new Blob(['png']);};})()}));
test('closed or outdated asynchronous renders cannot replace the newer image',()=>ui(async({d,click,tick,controller,painted})=>{
 click('openShowcase');d.getElementById('shareName').value='최신 이름';const newer=controller.refresh();await newer;await tick();assert.equal(painted.length,1);assert.equal(painted[0].name,'최신 이름');
 click('closeShowcase');await controller.refresh();assert.equal(painted.length,1);
}));
