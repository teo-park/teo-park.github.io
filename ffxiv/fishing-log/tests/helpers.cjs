const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),context);
const D=JSON.parse(JSON.stringify(context.window.FISHING_DATA)),KEY='teo-ffxiv.fishing.collection.v2';
const memory=initial=>{const values=new Map(Object.entries(initial||{}));return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v))};};
function open({storage=memory(),scan=false,analyze,plan=false}={}){
 const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'https://example.com/ffxiv/fishing-log/',runScripts:'outside-only'}),w=dom.window,d=w.document,downloads=[];
 Object.defineProperty(w,'localStorage',{value:storage});w.HTMLElement.prototype.scrollIntoView=function(){};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 w.HTMLCanvasElement.prototype.getContext=()=>({drawImage(){},fillRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},getImageData:()=>({width:451,height:491,data:new Uint8Array(451*491*4)})});
 w.Blob=Blob;w.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};
 let scanApply;w.FishingScanUI={mount:({apply})=>{scanApply=apply;}};
 for(const name of ['data.js','bite-times.js','engine.js','comparison.js'])w.eval(fs.readFileSync(path.join(root,name),'utf8'));
 if(scan){w.eval(fs.readFileSync(path.join(root,'scanner.js'),'utf8'));w.FishingScanner.analyze=analyze||(async()=>Array.from({length:100},(_,index)=>({index,state:index===4?'missing':'learned'})));w.createImageBitmap=async()=>({width:451,height:491,close(){}});w.eval(fs.readFileSync(path.join(root,'scanner-ui.js'),'utf8'));}
 let planSnapshot;if(plan){w.FishingNotifications={mount:({snapshot})=>{planSnapshot=snapshot;}};for(const name of ['weather-data.js','forecast.js','map-data.js','map-preview.js','bait-data.js','bait-details.js','planner.js'])w.eval(fs.readFileSync(path.join(root,name),'utf8'));}
 for(const name of ['ocean-fishing/scripts/teamcraft-ids.js','fishing-collection.js'])w.eval(fs.readFileSync(path.join(root,'..',name),'utf8'));
 w.eval(fs.readFileSync(path.join(root,'app.js'),'utf8'));
 w.eval(fs.readFileSync(path.join(root,'..','collection-layout.js'),'utf8'));
 const $=s=>d.querySelector(s),all=s=>[...d.querySelectorAll(s)],change=(s,value,event='change')=>{const el=$(s);el.value=value;el.dispatchEvent(new w.Event(event,{bubbles:true}));};
 return {w,d,$,all,change,storage,downloads,scanApply,planSnapshot,close:()=>w.close(),async addImage(name='sample.png'){const el=$('#scanFiles');Object.defineProperty(el,'files',{configurable:true,value:[{name,type:'image/png',size:100}]});el.dispatchEvent(new w.Event('change'));await new Promise(r=>setTimeout(r,0));}};
}
module.exports={D,KEY,memory,open};
