const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../../fishing-log/node_modules/jsdom');
const root=path.resolve(__dirname,'..');
function open(){const dom=new JSDOM(fs.readFileSync(path.join(root,'big-fish/index.html'),'utf8'),{url:'https://example.com/ffxiv/fisher-skills/big-fish/',runScripts:'outside-only'});dom.window.eval(fs.readFileSync(path.join(root,'skill-tips.js'),'utf8'));return dom;}
test('inline skill references retain fallback links and match the exact skill, icon and level',()=>{
  const dom=open(),d=dom.window.document,official=require('../official.json');
  try{
    const guide=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8')).window.document;
    const refs=[...d.querySelectorAll('.skill-term')];assert.ok(refs.length>50);
    for(const ref of refs){const skill=official.find(s=>s.name===ref.dataset.skillName);assert.ok(skill);assert.equal(ref.querySelector('img').src,skill.icon);assert.equal(ref.querySelector('img').width,16);assert.ok(guide.getElementById(new URL(ref.href).hash.slice(1)));}
    const {rich}=require('../skill-tips.cjs').create('../');
    const fragment=JSDOM.fragment(rich('인내 2 → 생미끼 낚시 2 → 교방'));
    assert.deepEqual([...fragment.querySelectorAll('[data-skill-name]')].map(e=>e.dataset.skillName),['인내 2','생미끼 낚시 2','교환 방생']);
    assert.ok(!d.querySelector('a a'),'Skill references must not nest links');
  }finally{dom.window.close();}
});
test('hover, touch/click and keyboard show the right explanation and dismiss without navigation',async()=>{
  const dom=open(),w=dom.window,d=w.document,panel=d.getElementById('skillTip');
  try{
    const makeshift=d.querySelector('[data-skill-name="숙련 낚시꾼"]');
    makeshift.dispatchEvent(new w.MouseEvent('pointerenter'));assert.equal(panel.hidden,false);assert.equal(d.getElementById('skillTipName').textContent,'숙련 낚시꾼');assert.match(d.getElementById('skillTipSummary').textContent,/생미끼.*유지/);assert.match(d.getElementById('skillTipMeta').textContent,/Lv.48/);
    makeshift.dispatchEvent(new w.MouseEvent('pointerleave'));panel.dispatchEvent(new w.MouseEvent('pointerenter'));await new Promise(r=>setTimeout(r,220));assert.equal(panel.hidden,false,'Pointer can enter the explanation to follow its links');
    const patience2=d.querySelector('[data-skill-name="인내 2"]');patience2.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true,detail:1}));assert.equal(d.getElementById('skillTipName').textContent,'인내 2');assert.match(d.getElementById('skillTipMeta').textContent,/Lv.60.*GP 560/);assert.match(d.getElementById('skillTipGuide').href,/#patience$/);assert.match(d.getElementById('skillTipOfficial').href,/#anchor_17420$/);assert.equal(w.location.hash,'');
    patience2.dispatchEvent(new w.MouseEvent('pointerleave'));await new Promise(r=>setTimeout(r,220));assert.equal(panel.hidden,false,'Tapped explanation stays open');
    d.body.dispatchEvent(new w.MouseEvent('pointerdown',{bubbles:true}));assert.equal(panel.hidden,true);assert.equal(patience2.getAttribute('aria-expanded'),'false');
    makeshift.focus();assert.equal(panel.hidden,false);makeshift.click();assert.equal(d.activeElement,panel.querySelector('button'));
    d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(panel.hidden,true);assert.equal(d.activeElement,makeshift);
    makeshift.click();panel.querySelector('button').click();assert.equal(panel.hidden,true);assert.equal(d.activeElement,makeshift);
  }finally{dom.window.close();}
});
