import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const html=readFileSync(new URL('../guide/index.html',import.meta.url),'utf8');
const script=readFileSync(new URL('../guide/guide.js',import.meta.url),'utf8');
function open(hash='',enhance=true){
  const dom=new JSDOM(html,{url:`https://example.test/ffxiv/beastmaster/guide/${hash}`,runScripts:'outside-only'});
  if(enhance)dom.window.eval(script);
  return dom;
}
test('purpose links switch panels, preserve deep links, and respond to browser history',async()=>{
  const dom=open(),w=dom.window,d=w.document;
  const visible=()=>[...d.querySelectorAll('.guide-panel')].filter(p=>!p.hidden).map(p=>p.id);
  try{
    assert.deepEqual(visible(),['leveling']);
    d.querySelector('.guide-tabs a[href="#rank"]').click();assert.deepEqual(visible(),['rank']);assert.equal(w.location.hash,'#rank');
    d.querySelector('.guide-tabs a[href="#legendary"]').click();assert.deepEqual(visible(),['legendary']);
    const back=new Promise(resolve=>w.addEventListener('hashchange',resolve,{once:true}));w.history.back();await back;
    assert.deepEqual(visible(),['rank']);assert.equal(d.querySelector('.guide-tabs [aria-current]').hash,'#rank');
    w.location.hash='#starter-team';await new Promise(resolve=>w.addEventListener('hashchange',resolve,{once:true}));assert.deepEqual(visible(),['leveling']);
  }finally{w.close();}
  for(const [hash,want] of [['#legendary','legendary'],['#rank','rank'],['#unknown','leveling']]){
    const page=open(hash);try{assert.equal(page.window.document.querySelector('.guide-panel:not([hidden])').id,want);}finally{page.window.close();}
  }
});
test('guides remain readable without scripts and each beast link resolves to the matching record',()=>{
  const dom=open('',false),d=dom.window.document,data=JSON.parse(readFileSync(new URL('../data.json',import.meta.url)));
  try{
    assert.equal(d.querySelectorAll('.guide-panel:not([hidden])').length,3);
    for(const link of d.querySelectorAll('main a[href^="../#beast-"]')){
      const beast=data.beasts.find(b=>b.id===Number(link.hash.slice(7)));
      assert.ok(beast,link.href);assert.ok(link.textContent.includes(beast.name),`${link.textContent} should include ${beast.name}`);
    }
    for(const asset of d.querySelectorAll('script[src],link[rel="stylesheet"],link[rel="icon"]')){
      const url=new URL(asset.src||asset.href);assert.ok(existsSync(new URL(`../..${url.pathname.replace('/ffxiv','')}`,import.meta.url)),url.pathname);
    }
  }finally{dom.window.close();}
});

test('strategy sources are Game8 articles and legendary claims retain their verified scope',()=>{
  const dom=open('',false),d=dom.window.document;
  try{
    const links=[...d.querySelectorAll('main a[href^="https:"]')];assert.ok(links.length);
    for(const link of links)assert.equal(new URL(link.href).hostname,'game8.jp');
    for(const card of d.querySelectorAll('[data-source]'))assert.ok(card.querySelector(`.source-line a[href="https://game8.jp/ff14/${card.dataset.source}"]`));
    assert.match(d.querySelector('#legendary').textContent,/확인하지 못했습니다/);
    assert.doesNotMatch(html,/ffxiv-fudge|youtube\.com|reddit\.com|클리어 영상 있음/);
  }finally{dom.window.close();}
});
