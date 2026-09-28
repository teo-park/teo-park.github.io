const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('../../ocean-fishing/node_modules/jsdom');
const L=require('../logic.js');
const root=path.resolve(__dirname,'..');

test('hub raid filter and search find the helper',()=>{
  const dom=new JSDOM(fs.readFileSync(path.join(root,'../index.html'),'utf8'),{url:'https://example.test/ffxiv/',runScripts:'outside-only'});
  try{
    const w=dom.window,d=w.document;w.eval(fs.readFileSync(path.join(root,'../hub.js'),'utf8'));
    d.querySelector('[data-category="raid"]').click();
    assert.deepEqual([...d.querySelectorAll('.tool-link:not([hidden])')].map(a=>new URL(a.href).pathname),['/ffxiv/dream-helper/']);
    const search=d.getElementById('toolSearch');search.value='드림';search.dispatchEvent(new w.Event('input'));
    assert.equal(d.querySelectorAll('.tool-link:not([hidden])').length,1);
  }finally{dom.window.close();}
});

test('every original strategy route, marker and line pair is preserved',()=>{
  const fixture=require('./original-strategies.json');
  for(const [key,source] of Object.entries(fixture))for(let i=0;i<8;i++){
    for(const [spread,map] of [['spread','spread_map_1'],['stack','spread_map_2']]){
      const s={...L.initial(key),clone:i,spread};const r=L.calculate(s);
      assert.equal(r.route.join(' - '),source[map][i+3],`${key} ${i} ${spread}`);
      assert.equal(r.check,source.text_3_10[i+3]);
      assert.equal(r.checkIcon,source.check_img_key_map[i+3]);
      assert.equal(L.strategies[key].marks[i]+'mark',source.btn_icon_map[i+3]);
      assert.equal(r.line,source.btn_to_line_marks[i+3].map(x=>x.replace('mark','')).join('·'));
      assert.equal(r.lineType,key==='09stop'?(i<4?'쉐어':'산개'):([0,5,6,7].includes(i)?'쉐어':'산개'));
    }
  }
});
test('all role/tower/flash combinations and incomplete inputs',()=>{
  const tankSwaps={TH:['dark','wind'],D:['fire','earth']};
  const pairs={dark:'earth',earth:'dark',fire:'wind',wind:'fire'};
  for(const role of L.roles)for(const tower of Object.keys(pairs))for(const flash of ['TH','D']){
    const r=L.calculate({...L.initial('09stop',role),tower,flash});
    const expected=role.startsWith('D')?!tankSwaps[flash].includes(tower):tankSwaps[flash].includes(tower);
    assert.equal(r.swap,expected);assert.equal(r.finalTower,expected?pairs[tower]:tower);
    assert.ok(r.instruction);
  }
  assert.equal(L.calculate(L.initial()).swap,null);
  assert.equal(L.calculate({...L.initial(),tower:'earth'}).finalTower,null);
  assert.equal(L.calculate({...L.initial(),flash:'TH'}).swap,null);
});
test('opening routes, island safety and missing data',()=>{
  for(const key of ['09stop','game8'])for(const role of L.roles)for(const shape of ['plus','cross']){
    const main=['T1','H1','D1','D3'].includes(role);
    const points=key==='09stop'?(main?['12시','1시']:['3시','5시']):(main?['A징','1징']:['D징','4징']);
    assert.equal(L.calculate({...L.initial(key,role),shape}).opening,(shape==='plus'?points:points.reverse()).join(' → '));
  }
  for(const safe of ['A','C'])for(const remaining of ['A','C'])assert.equal(L.calculate({...L.initial(),safe,remaining}).safety,safe===remaining?'양옆 안전 · 히트박스 안(편안)':'위아래 안전 · 히트박스 바깥(불편)');
  const empty=L.calculate(L.initial());
  for(const key of ['opening','check','line','route','safety'])assert.equal(empty[key],null);
});
function open({pip=true,fail=false,blocked=false,stored=null}={}){
  const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'https://example.test/ffxiv/dream-helper/',runScripts:'outside-only'});
  const w=dom.window;const children=[];
  Object.defineProperty(w,'isSecureContext',{value:true});
  function makeChild(){const d=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:w.location.href});children.push(d);return d.window;}
  if(pip)w.documentPictureInPicture={requestWindow:async()=>{if(fail)throw Error('denied');return makeChild();}};
  else w.open=()=>blocked?null:makeChild();
  if(stored!==null)w.localStorage.setItem('ffxiv-dream-helper-settings-v1',stored);
  for(const file of ['logic.js','app.js'])w.eval(fs.readFileSync(path.join(root,file),'utf8'));
  return {w,d:w.document,children,close(){children.forEach(c=>c.window.close());w.close();}};
}
const click=(d,f,v)=>d.querySelector(`[data-field="${f}"][data-value="${v}"]`).click();
const tick=()=>new Promise(r=>setTimeout(r,0));
test('PiP is interactive, syncs in both directions, resets and reopens with state',async()=>{
  const app=open();try{
    const {d}=app;click(d,'role','D1');click(d,'shape','plus');
    d.getElementById('openPip').click();await tick();
    const p=app.children[0].window.document;
    assert.equal(p.documentElement.lang,'ko');assert.equal(p.querySelectorAll('link').length,2);
    click(p,'clone',0);assert.match(d.querySelector('.result').textContent,/숫자 1 · 쉐어/);
    click(d,'spread','spread');assert.equal(p.querySelectorAll('.route div').length,4);
    click(p,'tower','dark');click(p,'flash','D');assert.match(d.querySelector('.result').textContent,/교대하기 · 어둠 → 땅/);
    click(p,'safe','C');click(p,'remaining','A');click(p,'island','B');
    assert.match(d.querySelector('.result').textContent,/히트박스 바깥/);
    p.querySelector('[data-action="previous"]').click();assert.match(p.querySelector('.step[data-active=true]').textContent,/남은 분신/);
    app.children[0].window.dispatchEvent(new app.children[0].window.Event('pagehide'));
    assert.equal(d.getElementById('openPip').getAttribute('aria-pressed'),'false');
    d.getElementById('openPip').click();await tick();
    assert.match(app.children[1].window.document.querySelector('.result').textContent,/히트박스 바깥/);
    app.children[1].window.document.querySelector('[data-action="reset"]').click();
    assert.equal(d.querySelectorAll('.route div').length,0);assert.equal(d.querySelector('[data-field="role"][aria-pressed="true"]').textContent,'D1');
    click(d,'clone',1);click(d,'strategy','game8');assert.equal(d.querySelectorAll('[data-field="clone"][aria-pressed="true"]').length,0);
  }finally{app.close();}
});
test('failed PiP, unsupported popup, blocked popup and invalid storage remain usable',async()=>{
  for(const options of [{fail:true},{pip:false},{pip:false,blocked:true},{stored:'{invalid'},{stored:'{"strategy":"__proto__","role":"invalid"}'}]){
    const app=open(options);try{
      app.d.getElementById('openPip').click();await tick();
      assert.equal(app.d.getElementById('openPip').disabled,false);
      click(app.d,'shape','plus');assert.match(app.d.querySelector('.result').textContent,/12시 → 1시/);
      if(options.fail||options.blocked)assert.match(app.d.getElementById('pipStatus').textContent,/못했|차단/);
      if(options.pip===false&&!options.blocked)assert.match(app.d.getElementById('pipStatus').textContent,/일반 작은 창/);
    }finally{app.close();}
  }
});
