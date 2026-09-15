const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),context);
const D=JSON.parse(JSON.stringify(context.window.FISHING_DATA)),KEY='teo-ffxiv.fishing.collection.v2';
const memory=initial=>{const values=new Map(Object.entries(initial||{}));return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v))};};
function open({storage=memory(),scan=false,analyze,plan=false,catalog=!plan,query='',pip,notificationController,target,clock,hidden,forecastCreate}={}){
 const dom=new JSDOM(fs.readFileSync(path.join(root,catalog?'catalog/index.html':'index.html'),'utf8'),{url:'https://example.com/ffxiv/fishing-log/'+(catalog?'catalog/':'')+query,runScripts:'outside-only'}),w=dom.window,d=w.document,downloads=[];
 Object.defineProperty(w,'localStorage',{value:storage});w.HTMLElement.prototype.scrollIntoView=function(){};
 if(clock)w.Date.now=clock;if(hidden!==undefined)Object.defineProperty(d,'hidden',{value:hidden,configurable:true});
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 w.HTMLCanvasElement.prototype.getContext=()=>({drawImage(){},fillRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},getImageData:()=>({width:451,height:491,data:new Uint8Array(451*491*4)})});
 w.Blob=Blob;w.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};
 let scanApply;w.FishingScanUI={mount:({apply})=>{scanApply=apply;}};
 for(const name of ['data.js','bait-catches.js','bait-ranking.js','bait-ranking-view.js','bite-times.js','engine.js','comparison.js','strategy-links-data.js','strategy-links.js'])w.eval(fs.readFileSync(path.join(root,name),'utf8'));
 if(scan){w.eval(fs.readFileSync(path.join(root,'scanner.js'),'utf8'));w.FishingScanner.analyze=analyze||(async()=>Array.from({length:100},(_,index)=>({index,state:index===4?'missing':'learned'})));w.createImageBitmap=async()=>({width:451,height:491,close(){}});w.eval(fs.readFileSync(path.join(root,'scanner-ui.js'),'utf8'));}
 let planSnapshot;if(plan){pip?.(w);w.FishingNotifications={mount:({snapshot})=>{planSnapshot=snapshot;return notificationController;}};for(const name of ['weather-data.js','forecast.js','map-data.js','map-preview.js','bait-data.js','bait-details.js','preparations.js','expansion-data.js','pip.js','planner.js','catalog-list.js'])w.eval(fs.readFileSync(path.join(root,name),'utf8'));}
 for(const name of ['ocean-fishing/scripts/teamcraft-ids.js','fishing-collection.js'])w.eval(fs.readFileSync(path.join(root,'..',name),'utf8'));
 if(forecastCreate&&w.FishingForecast)w.FishingForecast.create=forecastCreate;
 w.eval(fs.readFileSync(path.join(root,'app.js'),'utf8'));
 w.eval(fs.readFileSync(path.join(root,'..','collection-layout.js'),'utf8'));
 const $=s=>d.querySelector(s),all=s=>[...d.querySelectorAll(s)],change=(s,value,event='change')=>{const el=$(s);el.value=value;el.dispatchEvent(new w.Event(event,{bubbles:true}));};
 const selectExpansions=values=>{const selected=new Set([values].flat().map(String));for(const input of all('#planExpansions input'))input.checked=values==='all'||selected.has(input.value);$('#planExpansions').dispatchEvent(new w.Event('change',{bubbles:true}));};
 const api=Object.assign(target||{},{w,d,$,all,change,selectExpansions,storage,downloads,scanApply,planSnapshot,close:()=>w.close(),async addImage(name='sample.png'){const el=$('#scanFiles');Object.defineProperty(el,'files',{configurable:true,value:[{name,type:'image/png',size:100}]});el.dispatchEvent(new w.Event('change'));await new Promise(r=>setTimeout(r,0));}});
 // Simulate full-document navigation while retaining the same browser storage.
 w.HTMLAnchorElement.prototype.click=function(){const url=new URL(this.href);if(url.origin!==w.location.origin)return;const nextCatalog=url.pathname.endsWith('/catalog/');if(nextCatalog===catalog&&url.search===query)return;const clock=w.Date.now,hidden=d.hidden,forecastCreate=w.FishingForecast?.create;w.dispatchEvent(new w.Event('pagehide'));w.close();open({storage,scan,analyze,plan,catalog:nextCatalog,query:url.search,pip,notificationController,target:api,clock,hidden,forecastCreate});};
 return api;
}
module.exports={D,KEY,memory,open};
