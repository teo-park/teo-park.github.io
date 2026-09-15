const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom'),{open,memory,KEY}=require('./helpers.cjs');
test('each fishing page contains only its own workspace and all local assets and navigation resolve',()=>{
 for(const page of ['', 'catalog/']){
  const dom=new JSDOM(fs.readFileSync(path.join(__dirname,'..',page,'index.html'),'utf8'),{url:'https://example.com/ffxiv/fishing-log/'+page}),d=dom.window.document;
  try{
   assert.equal(!!d.querySelector('#fishingPlanner'),!page);assert.equal(!!d.querySelector('#collectionPanel'),!!page);assert.equal(!!d.querySelector('.progress-strip'),!!page);
   assert.equal(d.querySelector('.fishing-page-nav [aria-current]').href,'https://example.com/ffxiv/fishing-log/'+page);
   assert.equal(new URL(d.querySelector('.skip-link').href).pathname,'/ffxiv/fishing-log/'+page);
   for(const el of d.querySelectorAll('script[src],link[rel="stylesheet"],.fishing-page-nav a')){
    const url=new URL(el.src||el.href);if(url.origin!=='https://example.com')continue;
    const relative=url.pathname.replace('/ffxiv/',''),file=path.join(__dirname,'../..',relative,relative.endsWith('/')?'index.html':'');assert.ok(fs.existsSync(file),url.pathname);
   }
  }finally{dom.window.close();}
 }
});
test('forecast catch syncs into the separate catalog and catalog-only startup leaves alerts unmounted',()=>{
 const storage=memory();let p=open({plan:true,storage});try{
  const check=p.$('.plan-card [data-caught]'),id=check.dataset.caught;check.click();const saved=storage.getItem(KEY);
  p.$('#showBook').click();assert.equal(p.$('#fatal').textContent,'');assert.equal(p.planSnapshot,undefined);assert.equal(p.$('#fishingPlanner'),null);
  p.change('#search',id,'input');assert.equal(p.$(`[data-caught="${id}"]`).getAttribute('aria-pressed'),'true');assert.equal(storage.getItem(KEY),saved);
  p.$(`[data-caught="${id}"]`).click();p.$('#showPlanner').click();p.$('#planSearch').value=id;p.$('#planRefresh').click();assert.equal(p.$('.plan-card [data-caught]').getAttribute('aria-pressed'),'false');
 }finally{p.close();}
});
