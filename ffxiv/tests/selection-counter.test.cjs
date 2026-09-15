const {test}=require('node:test'),assert=require('node:assert/strict');
const {JSDOM}=require('../ocean-fishing/node_modules/jsdom');
const api=require('../selection-counter.js'),admin=require('../counter-admin/model.js');
const {config,rules}=require('../tools/visitor-counter.cjs').build('https://counter.example.test');
const catalog=require('../tools/selection-catalog.cjs').build();
function open(page='fishing-log',options={}){
 const dom=new JSDOM('<body><main><input id="search" value="private@email.test"><button data-fish-detail="4776">보기</button><button data-caught="4776">수집</button><button data-plan-detail="4776" aria-expanded="false">조건</button></main><footer></footer>',{url:options.url||'https://teo-park.github.io/ffxiv/'+page+'/',pretendToBeVisual:true});
 const w=dom.window,calls=[];
 w.fetch=async(url,opts={})=>{calls.push({url,...opts});if(url.includes('config.json'))return{ok:true,json:async()=>config};if(url.includes('catalog.json'))return{ok:true,json:async()=>catalog};if(options.failed)throw Error('ambiguous');return{ok:true,json:async()=>true};};
 const event=(selector,extra={})=>({target:w.document.querySelector(selector),type:'click',isTrusted:true,...extra});
 return{dom,w,calls,event,writes:()=>calls.filter(c=>c.method==='PUT')};
}
test('only deliberate supported selections count; typing, collection, closing and scripts do not',async()=>{
 const ui=open();try{const handler=api.start(ui.w,'https://site.test/config.json');
 for(const e of [ui.event('[data-caught]'),ui.event('#search',{type:'input'}),ui.event('[data-fish-detail]',{isTrusted:false})])await handler.handle(e);
 ui.w.document.querySelector('[data-plan-detail]').setAttribute('aria-expanded','true');await handler.handle(ui.event('[data-plan-detail]'));
 assert.equal(ui.calls.length,0);
 await handler.handle(ui.event('[data-fish-detail]'));await handler.handle(ui.event('[data-fish-detail]'));
 assert.equal(ui.writes().length,1);assert.match(ui.writes()[0].url,/\/selections\/fish\/4776\/[a-f0-9]{32}\.json$/);assert.equal(ui.writes()[0].body,'true');
 assert.ok(ui.calls.every(c=>c.credentials==='omit'&&c.referrerPolicy==='no-referrer'));
 assert.doesNotMatch(JSON.stringify(ui.calls),/private@email|query|caught/);
 }finally{ui.w.close();}
});
test('invalid IDs never leave the client and backend allowlists match the bundled catalog exactly',async()=>{
 const ui=open();try{const handler=api.start(ui.w,'https://site.test/config.json');ui.w.document.querySelector('[data-fish-detail]').dataset.fishDetail='private@email.test';await handler.handle(ui.event('[data-fish-detail]'));assert.equal(ui.writes().length,0);}finally{ui.w.close();}
 const read=rules.rules.selections['.read'];assert.match(read,/email_verified === true/);assert.match(read,/sign_in_provider === 'google.com'/);
 for(const [kind,group] of Object.entries(catalog.groups)){
  const rule=rules.rules.selections[kind].$gameId.$eventId;
  const expressions=[...rule['.write'].matchAll(/\$gameId\.matches\(\/([^/]+)\/\)/g)].map(match=>new RegExp(match[1]));
  for(const id of Object.keys(group.names))assert.equal(expressions.some(regex=>regex.test(id)),true,kind+':'+id);
  for(const id of ['999999999','private@email.test','4776/query','__proto__'])assert.equal(expressions.some(regex=>regex.test(id)),false);
  assert.match(rule['.write'],/!data.exists\(\).*newData.val\(\) === true/);
  assert.equal(rule['.validate'],'newData.getPriority() === null');
 }
});
test('privacy preference, DNT, GPC, hidden tab and missing storage prevent transmission',async()=>{
 for(const mode of ['optout','dnt','gpc','hidden','storage','local']){const ui=open('fishing-log',mode==='local'?{url:'http://localhost/ffxiv/fishing-log/'}:{});try{
  if(mode==='optout')ui.w.localStorage.setItem('ffxiv-usage-stats-disabled','true');
  if(mode==='dnt')Object.defineProperty(ui.w.navigator,'doNotTrack',{value:'1'});
  if(mode==='gpc')Object.defineProperty(ui.w.navigator,'globalPrivacyControl',{value:true});
  if(mode==='hidden')Object.defineProperty(ui.w.document,'visibilityState',{value:'hidden'});
  if(mode==='storage')Object.defineProperty(ui.w,'localStorage',{get:()=>{throw Error('denied');}});
  const handler=api.start(ui.w,'https://site.test/config.json');await handler?.handle(ui.event('[data-fish-detail]'));assert.equal(ui.calls.length,0,mode);
 }finally{ui.w.close();}}
});
test('deduplicates across tabs, retains failed reservations, and handles game ID namespaces',async()=>{
 for(const failed of [false,true]){const a=open('fishing-log',{failed}),b=open('fishing-log',{failed}),storage=new Map();let queue=Promise.resolve();
 try{for(const ui of [a,b]){Object.defineProperty(ui.w,'localStorage',{value:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)}});Object.defineProperty(ui.w.navigator,'locks',{value:{request:(_,run)=>{const job=queue.then(run);queue=job.catch(()=>{});return job;}}});}
 const aa=api.start(a.w,'https://site.test/config.json'),bb=api.start(b.w,'https://site.test/config.json');await Promise.all([aa.handle(a.event('[data-fish-detail]')),bb.handle(b.event('[data-fish-detail]'))]);await aa.handle(a.event('[data-fish-detail]'));assert.equal(a.writes().length+b.writes().length,1);
 storage.set('ffxiv-selection-v1:fish:4776',String(Date.now()-1800001));await aa.handle(a.event('[data-fish-detail]'));assert.equal(a.writes().length+b.writes().length,2);
 }finally{a.w.close();b.w.close();}}
});
test('recognized click contracts cover quest keyboard, duty links, all supported books and ocean aliases',()=>{
 const cases=[['msq-tracker','<button data-quest="3d98488c2c7"></button>','quest','3d98488c2c7'],['triple-triad','<button data-open="1"></button>','card','1'],['minions','<button data-detail="3"></button>','minion','3'],['blue-mage','<button data-detail="1"></button>','spell','1'],['beastmaster','<button data-detail="1"></button>','beast','1'],['ocean-fishing__checklist','<button data-fish-departures="indigo-0"></button>','fish','indigo-0'],['duty-finder','<div id="searchResults"><a class="guide-link" href="https://guide.ff14.co.kr/lodestone/db/duty/dee4271da7e"></a></div>','duty','dee4271da7e']];
 for(const [page,html,kind,id]of cases){const ui=open(page);try{ui.w.document.querySelector('main').innerHTML=html;assert.deepEqual(api.candidate(page,{type:'click',target:ui.w.document.querySelector('button,a')}),{kind,id,...(page!=='duty-finder'?{ocean:page.startsWith('ocean')}: {})});}finally{ui.w.close();}}
 const ui=open('msq-tracker');try{ui.w.document.querySelector('main').innerHTML='<input id="questSearch"><div id="searchResults"><button data-quest="3d98488c2c7"></button></div>';assert.deepEqual(api.candidate('msq-tracker',ui.event('input',{type:'keydown',key:'Enter'})),{kind:'quest',id:'3d98488c2c7'});assert.equal(api.candidate('msq-tracker',ui.event('input',{type:'keydown',key:'Enter',isComposing:true})),null);}finally{ui.w.close();}
 assert.equal(catalog.oceanEntries['indigo-0'],'28937');
});
test('admin resolves names from public catalog and never counts unknown or malformed entries',()=>{
 const s=admin.selections(catalog,{fish:{4776:{a:true,b:false,c:true},999999:{d:true}},minion:{3:{a:true}},query:{secret:{a:true}}});
 assert.equal(s.total,3);assert.equal(s.rows.length,2);assert.equal(s.rows[0].name,'말름미역');assert.equal(s.rows[1].name,'초코초코보');
});
