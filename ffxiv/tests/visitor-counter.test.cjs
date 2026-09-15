const{test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const{JSDOM}=require('../ocean-fishing/node_modules/jsdom');
const api=require('../visitor-counter.js');
const{build}=require('../tools/visitor-counter.cjs');
const{pages}=require('../tools/site-navigation.cjs');
const{config,rules}=build('https://counter.example.test');
function open(options={}){
 const dom=new JSDOM('<!doctype html><body><footer>출처</footer>',{url:options.url||'https://teo-park.github.io/ffxiv/fishing-log/',pretendToBeVisual:true});
 const w=dom.window,calls=[];
 w.fetch=async(url,opts={})=>{calls.push({url,...opts});if(url.endsWith('config.json'))return{ok:true,json:async()=>config};if(options.failedWrite)throw Error('uncertain response');return{ok:true,json:async()=>true};};
 return{dom,w,calls,writes:()=>calls.filter(c=>c.method==='PUT')};
}
test('canonical pages and legacy aliases resolve, admin and unknown pages do not count',()=>{
 for(const p of pages){assert.ok(api.pageFor(config,'/ffxiv/'+p));assert.ok(api.pageFor(config,'/ffxiv/'+p+'index.html'));}
 for(const route of ['indigo','ruby'])assert.equal(api.pageFor(config,'/ffxiv/ocean-fishing/'+route+'/').key,'ocean-fishing');
 assert.equal(api.pageFor(config,'/ffxiv/counter-admin/'),undefined);
});
test('30 minute deduplication permits expired entries and corrects backwards clock',()=>{
 assert.equal(api.due(100,1800099,1800000),false);assert.equal(api.due(100,1800100,1800000),true);
 for(const last of [0,NaN,2000000])assert.equal(api.due(last,1000,1800000),true);
});
test('public client writes only an opaque event and never reads totals or exposes controls',async()=>{
 const ui=open();try{
 ui.w.localStorage.setItem('private-collection','secret');await api.start(ui.w,'https://site.example/config.json');
 assert.equal(ui.calls.length,2);assert.equal(ui.writes().length,1);
 const write=ui.writes()[0];assert.match(write.url,/\/visits\/fishing-log\/[a-f0-9]{32}\.json$/);assert.equal(write.body,'true');
 assert.ok(ui.calls.every(c=>c.credentials==='omit'&&c.referrerPolicy==='no-referrer'));
 assert.equal(ui.w.document.body.textContent,'출처');
 await api.start(ui.w,'https://site.example/config.json');assert.equal(ui.writes().length,1);
 }finally{ui.w.close();}
});
test('simultaneous tabs and refresh share browser deduplication, failures are not retried',async()=>{
 for(const failedWrite of [false,true]){
 const values=new Map(),a=open({failedWrite}),b=open({failedWrite});let queue=Promise.resolve();
 const storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 const locks={request:(_,run)=>{const job=queue.then(run);queue=job.catch(()=>{});return job;}};
 try{for(const ui of [a,b]){Object.defineProperty(ui.w,'localStorage',{value:storage});Object.defineProperty(ui.w.navigator,'locks',{value:locks});}
 await Promise.all([api.start(a.w,'https://site.example/config.json'),api.start(b.w,'https://site.example/config.json')]);assert.equal(a.writes().length+b.writes().length,1);
 }finally{a.w.close();b.w.close();}
 }
});
test('localhost, DNT, GPC, unavailable storage and hidden tabs do not submit visits',async()=>{
 for(const mode of ['local','dnt','gpc','storage','hidden']){
 const ui=open(mode==='local'?{url:'http://localhost:4198/ffxiv/fishing-log/'}:{});let visible='hidden';
 try{
 if(mode==='dnt')Object.defineProperty(ui.w.navigator,'doNotTrack',{value:'1'});
 if(mode==='gpc')Object.defineProperty(ui.w.navigator,'globalPrivacyControl',{value:true});
 if(mode==='storage')Object.defineProperty(ui.w,'localStorage',{get:()=>{throw Error('denied');}});
 if(mode==='hidden')Object.defineProperty(ui.w.document,'visibilityState',{get:()=>visible});
 const pending=api.start(ui.w,'https://site.example/config.json');await new Promise(r=>setImmediate(r));assert.equal(ui.writes().length,0);
 if(mode==='hidden'){visible='visible';ui.w.document.dispatchEvent(new ui.w.Event('visibilitychange'));}
 await pending;assert.equal(ui.writes().length,mode==='hidden'?1:0);
 }finally{ui.w.close();}
 }
});
test('rules make old counters immutable, gate reads to verified Google owner and bound event writes',()=>{
 assert.equal(rules.rules['.write'],false);assert.equal(rules.rules['.read'],false);
 for(const branch of ['counters','visits']){const read=rules.rules[branch]['.read'];assert.match(read,/teo.ffxiv.kr@gmail.com/);assert.match(read,/email_verified === true/);assert.match(read,/sign_in_provider === 'google.com'/);}
 assert.deepEqual(Object.keys(rules.rules.counters),['.read']);
 assert.deepEqual(Object.keys(rules.rules.visits).filter(k=>!k.startsWith('.')).sort(),config.pages.map(p=>p.key).sort());
 for(const p of config.pages){const rule=rules.rules.visits[p.key]['$eventId'];assert.ok(rule['.write'].includes('!data.exists()'));assert.ok(rule['.write'].includes('newData.val() === true'));}
});
test('public pages have only a background collector and no admin links or old counter CSS',()=>{
 for(const p of pages){const html=fs.readFileSync(path.resolve(__dirname,'..',p,'index.html'),'utf8');assert.equal((html.match(/src="[^"]*visitor-counter\.js/g)||[]).length,1,p);assert.doesNotMatch(html,/visitor-counter\.css|counter-admin\//);}
 assert.doesNotMatch(fs.readFileSync(path.resolve(__dirname,'../../sitemap.xml'),'utf8'),/counter-admin/);
});
