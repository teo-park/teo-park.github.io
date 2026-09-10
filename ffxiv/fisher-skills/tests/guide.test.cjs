const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('../../fishing-log/node_modules/jsdom');
const root=path.resolve(__dirname,'..');
function open(){const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'https://example.com/ffxiv/fisher-skills/',runScripts:'outside-only'});dom.window.HTMLElement.prototype.scrollIntoView=function(){};dom.window.eval(fs.readFileSync(path.join(root,'app.js'),'utf8'));return dom;}
test('all explanations exist without JS, official anchors and local links resolve',()=>{
 const dom=open(),d=dom.window.document;try{assert.equal(d.querySelectorAll('.skill-card').length,14);assert.match(d.querySelector('#makeshift').textContent,/쿠얼 → 쿠얼 → … → 홍룡/);assert.match(d.querySelector('#makeshift').textContent,/기존 프록 유지/);
 for(const a of d.querySelectorAll('a[href]')){const u=new URL(a.href);if(u.origin!=='https://example.com')continue;if(u.hash&&u.pathname==='/ffxiv/fisher-skills/')assert.ok(d.getElementById(u.hash.slice(1)),a.href);else if(!u.hash){const target=path.resolve(root,'../..',u.pathname.slice(1));assert.ok(fs.existsSync(u.pathname.endsWith('/')?path.join(target,'index.html'):target),a.href);}}
 for(const a of d.querySelectorAll('.official-links a'))assert.match(a.href,/#anchor_\d+$/);
 const groups=[...d.querySelectorAll('[data-skill-group]')];assert.equal(groups.length,5);assert.ok(groups.every(g=>g.querySelector('h2')&&g.querySelector('.skill-card')));
 const official=require('../official.json');for(const item of official){const badge=[...d.querySelectorAll('[data-skill]')].find(b=>b.dataset.skill===item.name);assert.ok(badge,item.name);assert.equal(badge.querySelector('strong').textContent,`Lv.${item.level}`);if(item.quest)assert.equal(badge.querySelector('.skill-quest').href,item.quest.url);}
 assert.equal(d.querySelector('[data-skill="강력한 낚아채기"] strong').textContent,'Lv.15');assert.equal(d.querySelector('[data-skill="인내 2"] strong').textContent,'Lv.60');
 }finally{dom.window.close();}
});
test('initials, composing Korean and category filters work; related links reveal hidden skills',()=>{
 const dom=open(),w=dom.window,d=w.document;try{const search=d.querySelector('#skillSearch'),visible=()=>[...d.querySelectorAll('.skill-card')].filter(c=>!c.hidden);search.value='ㅅㄹㄴㅅㄲ';search.dispatchEvent(new w.InputEvent('input',{bubbles:true,isComposing:true}));assert.ok(visible().some(c=>c.id==='makeshift'));assert.ok(visible().length<14);
 d.querySelector('[data-filter="multiple"]').click();assert.ok(visible().every(c=>c.dataset.category==='multiple'));d.querySelector('#clearSearch').click();assert.equal(visible().length,2);assert.equal(d.querySelectorAll('[data-skill-group]:not([hidden])').length,1);assert.equal(d.querySelector('[data-skill-group="multiple"] .group-count').textContent,'2개 설명');
 d.querySelector('#identical a[href="#art"]').click();assert.equal(d.querySelector('#art').hidden,false);assert.equal(visible().length,14);assert.equal(search.value,'');assert.equal(d.querySelectorAll('[data-skill-group]:not([hidden])').length,5);
 search.value='없는기술12345';search.dispatchEvent(new w.Event('input'));assert.equal(d.querySelector('#noSkills').hidden,false);assert.equal(visible().length,0);assert.equal(d.querySelectorAll('[data-skill-group]:not([hidden])').length,0);
 }finally{dom.window.close();}
});
