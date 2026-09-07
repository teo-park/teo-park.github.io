const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../scripts/entry.js'),'utf8');
function boot({route='indigo',signedIn=false,blocked=false,entry=false,search=''}={}){
 const listeners={},attributes=new Set(entry?['data-entry-page']:['data-entry-locked']);
 const state=new Map(signedIn?[['ocean:journal-entry:v1','open-20260908']]:[]);
 const redirects=[];
 const url=new URL(`https://teo-park.github.io/ffxiv/ocean-fishing/${entry?'':route+'/'}${search}`);
 const location={href:url.href,pathname:url.pathname,search:url.search,replace:url=>redirects.push(url)};
 const document={documentElement:{hasAttribute:key=>attributes.has(key),setAttribute:key=>attributes.add(key),removeAttribute:key=>attributes.delete(key)},addEventListener:(key,fn)=>listeners[key]=fn,querySelectorAll:()=>[],getElementById:()=>null};
 const sessionStorage={getItem:key=>{if(blocked)throw Error('blocked');return state.get(key)||null},removeItem:key=>state.delete(key)};
 const context={document,location,sessionStorage,URL,URLSearchParams,window:{addEventListener:(key,fn)=>listeners[key]=fn}};
 vm.runInNewContext(source,context);
 return {listeners,attributes,state,redirects,document};
}
test('every direct route requires entry and preserves only its own return destination',()=>{
 for(const route of ['indigo','ruby','checklist']){
  const page=boot({route});
  assert.deepEqual(page.redirects,[`https://teo-park.github.io/ffxiv/ocean-fishing/?next=${route}`]);
  assert.ok(page.attributes.has('data-entry-locked'));
 }
});
test('accepted tab session permits navigation and refresh without another password',()=>{
 for(const route of ['indigo','ruby','checklist']){
  const page=boot({route,signedIn:true});
  assert.deepEqual(page.redirects,[]);assert.equal(page.attributes.has('data-entry-locked'),false);
  page.listeners.pageshow();assert.deepEqual(page.redirects,[]);
 }
});
test('storage denial stays locked instead of revealing the route',()=>{
 const page=boot({blocked:true});assert.equal(page.redirects.length,1);assert.ok(page.attributes.has('data-entry-locked'));
});
test('restoring a page from history rechecks a revoked session before revealing content',()=>{
 const page=boot({signedIn:true,route:'checklist'});
 page.listeners.pagehide();assert.ok(page.attributes.has('data-entry-locked'));
 page.state.clear();page.listeners.pageshow();
 assert.ok(page.attributes.has('data-entry-locked'));
 assert.equal(page.redirects[0],'https://teo-park.github.io/ffxiv/ocean-fishing/?next=checklist');
});
test('entrance never redirects an admitted tab to an untrusted return URL',()=>{
 const page=boot({entry:true,signedIn:true,search:'?next=https%3A%2F%2Fexample.com'});
 page.document.getElementById=()=>({});page.listeners.DOMContentLoaded();
 assert.equal(page.redirects[0],'https://teo-park.github.io/ffxiv/ocean-fishing/indigo/');
});
test('signing out revokes only journal entry and keeps collection storage untouched',()=>{
 const page=boot({signedIn:true,route:'ruby'});let click;
 page.document.querySelectorAll=()=>[{addEventListener:(name,fn)=>click=fn}];
 page.listeners.DOMContentLoaded();click();
 assert.equal(page.state.size,0);assert.ok(page.attributes.has('data-entry-locked'));
 assert.equal(page.redirects[0],'https://teo-park.github.io/ffxiv/ocean-fishing/?next=ruby');
});
