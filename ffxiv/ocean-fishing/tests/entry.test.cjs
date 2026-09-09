const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'scripts/entry.js'),'utf8');
function boot({entry=false,home=false,route='indigo',search=''}={}){
 const attributes=new Set(entry?['data-entry-page']:home?['data-journal-home']:['data-entry-locked']),redirects=[];
 const url=new URL(`https://teo-park.github.io/ffxiv/ocean-fishing/${entry||home?'':route+'/'}${search}`);
 const document={documentElement:{hasAttribute:k=>attributes.has(k),removeAttribute:k=>attributes.delete(k)}};
 const context={document,location:{href:url.href,search:url.search,replace:u=>redirects.push(u)},URL,URLSearchParams};
 for(const key of ['localStorage','sessionStorage'])Object.defineProperty(context,key,{get(){throw Error('Storage must not be accessed by navigation');}});
 vm.runInNewContext(source,context);return {attributes,redirects};
}
test('old cached routes are revealed without authentication or storage access',()=>{
 for(const route of ['indigo','ruby','checklist']){const p=boot({route});assert.deepEqual(p.redirects,[]);assert.equal(p.attributes.has('data-entry-locked'),false);}
});
test('old entry bookmarks preserve allowlisted destinations and cannot redirect to another site',()=>{
 for(const next of ['indigo','ruby','checklist'])assert.deepEqual(boot({home:true,search:'?next='+next}).redirects,[`https://teo-park.github.io/ffxiv/ocean-fishing/${next}/`]);
 for(const next of ['https://example.com','//example.com','../','ruby/../sources']){
  assert.deepEqual(boot({home:true,search:'?next='+encodeURIComponent(next)}).redirects,[]);
  assert.deepEqual(boot({entry:true,search:'?next='+encodeURIComponent(next)}).redirects,['https://teo-park.github.io/ffxiv/ocean-fishing/indigo/']);
 }
 assert.deepEqual(boot({home:true}).redirects,[]);
});
test('published pages have no password form, lock button, lock styling, or indexing block',()=>{
 for(const route of ['', 'indigo/','ruby/','checklist/','sources/']){
  const html=fs.readFileSync(path.join(root,route,'index.html'),'utf8'),doc=new JSDOM(html).window.document;
  assert.equal(doc.querySelector('input[type=password], [data-entry-locked], [data-lock-journal]'),null);
  assert.equal(doc.querySelector('meta[name=robots]'),null);assert.ok(doc.querySelector('a[href$="../"]'),'return to the tool portal');
  if(route&&route!=='sources/')assert.equal(doc.querySelector('script[src*="entry.js"]'),null);
 }
});
test('public home links to each journal route and the portal includes the journal',()=>{
 const home=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8')).window.document;
 for(const route of ['indigo','ruby','checklist'])assert.ok(home.querySelector(`.journal-home-links a[href="./${route}/"]`));
 const portal=new JSDOM(fs.readFileSync(path.join(root,'../index.html'),'utf8')).window.document;assert.ok(portal.querySelector('.tool-link[href="./ocean-fishing/"]'));
 const sitemap=fs.readFileSync(path.join(root,'../sitemap.xml'),'utf8');for(const route of ['', 'indigo/','ruby/','checklist/'])assert.ok(sitemap.includes(`/ffxiv/ocean-fishing/${route}</loc>`));
});
