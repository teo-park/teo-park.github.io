const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const {createSearch,initials}=require('../search.js');
const root=path.join(__dirname,'..');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),context);
const data=JSON.parse(JSON.stringify(context.window.DUTY_DATA));
const search=createSearch(data.duties);

test('official catalog has unique valid entries and all category totals reconcile',()=>{
  assert.equal(data.schemaVersion,1);
  assert.equal(data.duties.length,400);
  assert.equal(new Set(data.duties.map(d=>d.id)).size,data.duties.length);
  assert.equal(data.categories.length,7);
  for(const c of data.categories)assert.equal(data.duties.filter(d=>d.category===c.name).length,c.count);
  for(const d of data.duties){
    assert.match(d.id,/^[a-f0-9]{11}$/);
    assert(d.name&&!d.name.includes('<')&&!d.name.endsWith(' N'));
    assert(d.level>=1&&d.level<=100);
    assert(d.itemLevel===null||Number.isInteger(d.itemLevel)&&d.itemLevel>0);
  }
});
test('initials, partial names, mixed Korean, spaces and category filters work',()=>{
  assert(search('ㅅㅅㅌㅅ').some(d=>d.name==='사스타샤 침식 동굴'));
  assert(search('극ㅇㅍㄹㅌ').some(d=>d.name==='극 이프리트 토벌전'));
  assert(search('극 ㅇㅍㄹㅌ').every(d=>d.name.includes('극')&&d.name.includes('이프리트')));
  assert(search('ㅇㅍㄹㅌ','토벌전').length>1);
  assert.equal(search('ㅇㅍㄹㅌ','던전').length,0);
  assert.equal(search('','던전').length,103);
  assert.equal(search('').length,0);
  assert.equal(search(' !!! ').length,0);
  assert.equal(search('없는임무이름입니다').length,0);
  assert.equal(initials('까치 숲 1'),'ㄲㅊ ㅅ 1');
  for(const d of data.duties){
    assert(search(d.name).some(result=>result.id===d.id),d.name);
    assert(search(initials(d.name)).some(result=>result.id===d.id),d.name);
  }
});
test('HTML extraction keeps title metadata and removes the NEW marker',async()=>{
  const {parsePage}=await import(pathToFileURL(path.join(root,'scripts/update-data.mjs')));
  const rows=parsePage('<ul class="list_type"><li><a href="/lodestone/db/duty/123456abcde"><em class="type">토벌전 &gt; 신생 에오르제아</em><cite class="name">극 이프리트 토벌전 <i>N</i></cite><dd>50</dd><dd>70</dd></a></li></ul><div class="pagination">');
  assert.deepEqual(rows,[{id:'123456abcde',name:'극 이프리트 토벌전',category:'토벌전',expansion:'신생 에오르제아',level:50,itemLevel:70}]);
  assert.throws(()=>parsePage('<html>Unavailable</html>'));
});
test('app includes the composing character, filters results, clears and paginates',()=>{
  const element=()=>({value:'',children:[],dataset:{},handlers:{},hidden:false,
    append(...items){this.children.push(...items);},replaceChildren(...items){this.children=items;},
    setAttribute(){},focus(){},addEventListener(name,handler){this.handlers[name]=handler;}
  });
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const nodes=Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(([,id])=>[id,element()]));
  vm.runInNewContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),{
    window:{DUTY_DATA:data,DutySearch:require('../search.js')},
    document:{getElementById:id=>nodes[id],createElement:element,querySelectorAll:()=>[]},
    console:{error(error){throw error;}}
  });
  const input=nodes.dutySearch;
  assert.equal(nodes.searchResults.children.length,1);
  for(const query of ['ㅇ','ㅇㅍ','ㅇㅍㄹㅌ','극ㅇㅍㄹㅌ']){
    input.value=query;input.handlers.input({isComposing:true});
    assert.equal(nodes.searchResults.children.length,Math.min(30,search(query).length));
    assert.equal(input.value,query);
    assert.deepEqual(nodes.searchResults.children.map(card=>card.children[1].textContent),search(query).slice(0,30).map(d=>d.name));
  }
  input.handlers.compositionend();
  nodes.clearSearch.handlers.click();
  assert.equal(input.value,'');assert.equal(nodes.clearSearch.hidden,true);
  nodes.categoryFilter.value='던전';nodes.categoryFilter.handlers.change();
  assert.equal(nodes.searchResults.children.length,30);
  nodes.showMore.handlers.click();assert.equal(nodes.searchResults.children.length,60);
  nodes.showMore.handlers.click();nodes.showMore.handlers.click();
  assert.equal(nodes.searchResults.children.length,103);assert.equal(nodes.showMore.hidden,true);
});
test('page assets, element IDs, shared navigation and font references resolve',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size);
  for(const [,id] of app.matchAll(/\$\('([^']+)'\)/g))assert(ids.includes(id),id);
  for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+)"/g))if(!/^https?:/.test(url))assert(fs.existsSync(path.resolve(root,url.split('?')[0])),url);
  for(const file of ['../index.html','../msq-tracker/index.html','../pvp-series-calculator/index.html','index.html']){
    const page=fs.readFileSync(path.join(root,file),'utf8');
    assert.equal([...page.matchAll(/aria-current="page"/g)].length,1);
    assert(page.includes('duty-finder/'));
  }
  const theme=fs.readFileSync(path.join(root,'../theme.css'),'utf8');
  for(const [,url] of theme.matchAll(/url\("([^"]+)"\)/g))assert(fs.existsSync(path.resolve(root,'..',url)));
  for(const file of ['app.js','search.js','data.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'));
});
