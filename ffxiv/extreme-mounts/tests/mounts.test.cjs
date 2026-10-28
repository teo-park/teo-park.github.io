const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../../ocean-fishing/node_modules/jsdom'),E=require('../engine.js'),M=require('../../collection-room/model.js'),{mount}=require('../app.js'),data=require('../data.json');
function storage(){const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};}
function open(){const dom=new JSDOM(fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8'),{url:'https://teo-park.github.io/ffxiv/extreme-mounts/',runScripts:'outside-only'}),w=dom.window;w.ExtremeMounts=E;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};const ui=mount(w,data);return {dom,w,d:w.document,ui,$:id=>w.document.getElementById(id),click:selector=>w.document.querySelector(selector).click()};}
test('six expansion collections contain 41 required mounts, six quest rewards, and three separate extras',()=>{
  assert.equal(data.expansions.length,6);assert.equal(data.mounts.length,50);assert.equal(new Set(data.mounts.map(m=>m.id)).size,50);assert.equal(data.mounts.filter(m=>m.kind==='trial').length,41);assert.equal(data.mounts.filter(m=>m.kind==='reward').length,6);assert.equal(data.mounts.filter(m=>m.kind==='extra').length,3);
  for(const e of data.expansions){assert.equal(e.required.length,e.id==='arr'?6:7);assert.ok(!e.extras.some(id=>e.required.includes(id)));for(const id of [...e.required,e.reward,...e.extras]){const m=data.mounts.find(m=>m.id===id);assert.equal(m.expansion,e.id);assert.match(m.name,/[가-힣]/);assert.ok(m.image.startsWith('https://'));if(m.kind==='reward')assert.ok(m.quest.name);else assert.ok(m.sources.length);}}
  assert.equal(data.mounts.find(m=>m.id===293).sources[0].name,'종극의 결전');assert.equal(data.mounts.find(m=>m.id===444).name,'허무의 날개');assert.equal(data.mounts.find(m=>m.id===399).sources.length,1);
});
test('backup, unknown IDs and room adapter use the same record and preserve other notebook wishes',()=>{
  const s=storage();s.setItem(E.WISH_KEY,JSON.stringify({'blue-mage':{'1':true}}));E.write(s,{collected:new Set([28,999999]),wanted:new Set([29])});
  const current=E.read(s);assert.deepEqual([...current.collected],[28,999999]);assert.deepEqual([...E.parse(E.backup(current)).wanted],[29]);assert.equal(JSON.parse(s.getItem(E.WISH_KEY))['blue-mage']['1'],true);
  assert.equal(M.BOOKS.find(b=>b.id==='mounts').key,E.KEY);assert.deepEqual(M.readLocal(s).mounts['29'],{value:0,wanted:true});
  M.writeBook(s,M.BOOKS.find(b=>b.id==='mounts'),{'28':{value:0,wanted:false},'47':{value:1,wanted:true},'999999':{value:1,wanted:false}});
  assert.deepEqual([...E.read(s).collected],[47,999999]);assert.deepEqual([...E.read(s).wanted],[47]);
});
test('unrelated backups and malformed originals never overwrite collection records',()=>{
  const s=storage(),raw='{"type":"other","collected":[28]}';s.setItem(E.KEY,raw);assert.throws(()=>E.read(s));assert.throws(()=>E.write(s,{collected:new Set([29]),wanted:new Set()}));assert.equal(s.getItem(E.KEY),raw);assert.throws(()=>E.parse('{"type":"ffxiv-minions","schemaVersion":1,"collected":[28]}'));
});
test('a failed second storage write rolls back the first without losing original records',()=>{
  const s=storage();E.write(s,{collected:new Set([28]),wanted:new Set()});const original=s.getItem(E.KEY),set=s.setItem;s.setItem=(k,v)=>{if(k===E.WISH_KEY)throw Error('quota');set(k,v);};
  assert.throws(()=>E.write(s,{collected:new Set([29]),wanted:new Set([30])}));assert.equal(s.getItem(E.KEY),original);
});
test('Korean initials and duty names search correctly, with expansion and missing/wanted filters',()=>{
  const record={collected:new Set([28]),wanted:new Set([28,29])};assert.ok(E.filter(data.mounts,record,{query:'ㅂㅎ'}).some(m=>m.name==='봉황'));assert.ok(E.filter(data.mounts,record,{query:'극 이프리트'}).some(m=>m.id===28));assert.ok(E.filter(data.mounts,record,{expansion:'dt'}).every(m=>m.expansion==='dt'));assert.deepEqual(E.filter(data.mounts,record,{status:'wanted'}).map(m=>m.id),[29]);assert.ok(!E.filter(data.mounts,record,{status:'missing'}).some(m=>m.id===28));
});
test('extras and quest rewards never satisfy required mount counts or automatically award the capstone',()=>{
  const e=data.expansions[0];assert.equal(E.summary(e,new Set([22,47])).owned,0);assert.equal(E.summary(e,new Set(e.required)).owned,6);assert.equal(E.summary(e,new Set(e.required)).reward,false);
});
test('notebook checks, wanted goals, undo and incoming room updates stay connected',()=>{
  const h=open();try{let changes=0;h.w.addEventListener('ffxiv:collection-change',()=>changes++);h.click('[data-owned="28"]');assert.equal(h.$('ownedCount').textContent,'1');assert.equal(h.d.querySelector('[data-owned="28"]').getAttribute('aria-pressed'),'true');h.click('[data-wanted="29"]');assert.equal(M.readLocal(h.w.localStorage).mounts['29'].wanted,true);assert.equal(changes,2);
    const book=M.BOOKS.find(b=>b.id==='mounts');M.writeBook(h.w.localStorage,book,{'28':{value:1,wanted:false},'29':{value:0,wanted:true},'47':{value:1,wanted:false}});h.w.dispatchEvent(new h.w.StorageEvent('storage',{key:E.KEY}));h.click('#undo');assert.equal(E.read(h.w.localStorage).wanted.has(29),false);assert.equal(E.read(h.w.localStorage).collected.has(47),true);
    M.writeBook(h.w.localStorage,book,{'28':{value:0,wanted:false},'47':{value:1,wanted:false}});h.w.dispatchEvent(new h.w.CustomEvent('ffxiv:collection-render'));assert.equal(h.$('ownedCount').textContent,'0');assert.equal(h.$('rewardCount').textContent,'1 / 6');assert.equal(h.d.querySelector('[data-owned="28"]').getAttribute('aria-pressed'),'false');
  }finally{h.dom.window.close();}
});
test('expansion selection and complete-required state leave quest rewards unchecked',()=>{
  const h=open();try{for(const id of data.expansions[0].required)h.click(`[data-owned="${id}"]`);assert.equal(h.$('ownedCount').textContent,'6');assert.equal(h.$('rewardCount').textContent,'0 / 6');h.click('[data-expansion="arr"]');assert.equal(h.d.querySelectorAll('.expansion-group').length,1);assert.match(h.d.querySelector('.reward-condition').textContent,/조건 충족/);h.$('search').value='ㅂㄹㅇㅅ';h.$('search').dispatchEvent(new h.w.Event('input'));assert.equal(h.d.querySelectorAll('.mount-card').length,1);
  }finally{h.dom.window.close();}
});
test('corrupt local data locks checks while retaining the original for backup',()=>{
  const h=open();try{const raw='broken';h.w.localStorage.setItem(E.KEY,raw);h.w.dispatchEvent(new h.w.StorageEvent('storage',{key:E.KEY}));assert.ok(h.d.querySelector('[data-owned]').disabled);assert.equal(h.w.localStorage.getItem(E.KEY),raw);}finally{h.dom.window.close();}
});
