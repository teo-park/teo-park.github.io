const{test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const{JSDOM}=require('../ocean-fishing/node_modules/jsdom');
const model=require('../counter-admin/model.js'),{create}=require('../counter-admin/controller.js');
const owner={email:'teo.ffxiv.kr@gmail.com',emailVerified:true,providerData:[{providerId:'google.com'}]};
const fixture={catalog:{groups:{fish:{label:'물고기',names:{4776:'말름미역'}}}},selections:{fish:{4776:{a:true,b:true}}},pages:[{key:'home',path:'/ffxiv/',label:'홈'},{key:'minions',path:'/ffxiv/minions/',label:'꼬마친구'}],baseline:{home:10,minions:2},visits:{home:{a:true,b:true},minions:{c:true},unknown:{d:true}}};
function open(load=async()=>fixture){
 const dom=new JSDOM(fs.readFileSync(path.resolve(__dirname,'../counter-admin/index.html'),'utf8'),{url:'https://teo-park.github.io/ffxiv/counter-admin/'});
 const d=dom.window.document,calls={load:0,signOut:0};
 const controller=create(d,model,{signIn:async()=>{},signOut:async()=>{calls.signOut++;},load:async()=>{calls.load++;return load();}});
 return{dom,d,calls,controller,$:id=>d.getElementById(id)};
}
test('only verified Google owner qualifies for UI',()=>{
 assert.equal(model.allowed(owner),true);
 for(const user of [null,{...owner,email:'other@gmail.com'},{...owner,emailVerified:false},{...owner,providerData:[{providerId:'password'}]}])assert.equal(!!model.allowed(user),false);
});
test('keeps prior counts and adds only known valid visit records',()=>{
 const s=model.summarize(fixture.pages,fixture.baseline,fixture.visits);
 assert.equal(s.total,15);assert.deepEqual(s.rows.map(r=>r.count),[12,3]);
 assert.equal(model.summarize(fixture.pages,null,null).total,0);
 assert.equal(model.summarize(fixture.pages,{home:-1},{home:{a:false,b:1,c:true}}).total,1);
});
test('logged-out and wrong-account states never read statistics',async()=>{
 const ui=open();try{
 await ui.controller.onUser(null);assert.equal(ui.$('dashboard').hidden,true);assert.equal(ui.calls.load,0);
 await ui.controller.onUser({...owner,email:'other@gmail.com'});assert.equal(ui.calls.load,0);assert.equal(ui.calls.signOut,1);assert.equal(ui.$('rows').children.length,0);assert.equal(ui.$('selectionRows').children.length,0);assert.equal(ui.$('selectionTotal').textContent,'—');
 assert.match(ui.$('status').textContent,/권한이 없습니다/);
 }finally{ui.dom.window.close();}
});
test('owner sees counts and logout immediately erases them',async()=>{
 const ui=open();try{
 await ui.controller.onUser(owner);assert.equal(ui.$('dashboard').hidden,false);assert.equal(ui.$('loginPanel').hidden,true);assert.equal(ui.$('total').textContent,'15');assert.equal(ui.$('rows').children.length,2);assert.equal(ui.$('selectionTotal').textContent,'2');assert.match(ui.$('selectionRows').textContent,/말름미역/);
 ui.$('logout').click();assert.equal(ui.$('dashboard').hidden,true);assert.equal(ui.$('rows').children.length,0);assert.equal(ui.$('selectionRows').children.length,0);assert.equal(ui.$('selectionTotal').textContent,'—');assert.equal(ui.$('total').textContent,'—');
 await new Promise(r=>setImmediate(r));assert.equal(ui.calls.signOut,1);
 }finally{ui.dom.window.close();}
});
test('a response arriving after logout cannot restore private data',async()=>{
 let resolve;const ui=open(()=>new Promise(r=>{resolve=r;}));try{
 const pending=ui.controller.onUser(owner);ui.$('logout').click();resolve(fixture);await pending;
 assert.equal(ui.$('dashboard').hidden,true);assert.equal(ui.$('rows').children.length,0);assert.equal(ui.$('selectionRows').children.length,0);assert.equal(ui.$('selectionTotal').textContent,'—');
 }finally{ui.dom.window.close();}
});
test('failed refresh clears old stats and offers retry',async()=>{
 let fail=false;const ui=open(async()=>{if(fail)throw Error('permission-denied');return fixture;});try{
 await ui.controller.onUser(owner);fail=true;await ui.controller.refresh();assert.equal(ui.$('total').textContent,'—');assert.equal(ui.$('rows').children.length,0);assert.equal(ui.$('selectionRows').children.length,0);assert.equal(ui.$('selectionTotal').textContent,'—');assert.equal(ui.$('refresh').disabled,false);assert.match(ui.$('status').textContent,/읽지 못했습니다/);
 }finally{ui.dom.window.close();}
});
test('admin page is noindex without embedded statistics',()=>{
 const ui=open();try{assert.match(ui.d.querySelector('meta[name="robots"]').content,/noindex/);assert.equal(ui.$('dashboard').hidden,true);assert.equal(ui.$('rows').children.length,0);assert.equal(ui.$('selectionRows').children.length,0);assert.equal(ui.$('selectionTotal').textContent,'—');}finally{ui.dom.window.close();}
});
