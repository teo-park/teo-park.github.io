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

test('every strategy cites a reviewed original and personal reports are visibly distinguished',()=>{
  const dom=open('',false),d=dom.window.document;
  const sources=JSON.parse(readFileSync(new URL('../guide/sources.json',import.meta.url)));
  try{
    const links=[...d.querySelectorAll('main a[href^="https:"]')];assert.ok(links.length);
    const reviewed=new Set(Object.values(sources).map(source=>source.url));
    for(const link of links)assert.ok(reviewed.has(link.href),`unreviewed source: ${link.href}`);
    for(const card of d.querySelectorAll('.strategy-card')){
      const source=sources[card.dataset.source];assert.ok(source,card.dataset.source);
      assert.ok(card.querySelector(`.source-line a[href="${source.url}"]`));
      assert.ok(['en','ja'].includes(source.language));
      if(source.kind==='player-report'){
        assert.equal(card.dataset.evidence,'player-report');
        assert.match(card.querySelector('.evidence-label').textContent,/플레이어 사례/);
        assert.doesNotMatch(card.querySelector('.evidence-label').textContent,/공식/);
      }
    }
    assert.equal(d.querySelectorAll('#legendary [data-evidence="player-report"]').length,2);
    assert.match(d.querySelector('#legendary').textContent,/필수 조건은 아니/);
    assert.match(d.querySelector('.guide-sources').textContent,/Lodestone 개인 일기는 공식 공략이 아닙니다/);
    assert.doesNotMatch(html,/ffxiv-fudge|Game8 기반|현재 확인한 Game8 자료의 범위/);
  }finally{dom.window.close();}
});
