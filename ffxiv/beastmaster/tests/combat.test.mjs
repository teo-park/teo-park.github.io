import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {buildCombat,combatMatches,commands} from '../combat.js';
import {create,KEY,backup,parseBackup} from '../engine.js';
import {mount} from '../app.js';
const data=JSON.parse(readFileSync(new URL('../data.json',import.meta.url))),profiles=buildCombat(data),model=create(data);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const ids=o=>data.beasts.filter(b=>combatMatches(profiles.get(b.id),o)).map(b=>b.id);
function setup(seed=[]){
  const dom=new JSDOM(html,{url:'https://example.test/',pretendToBeVisual:true}),w=dom.window,d=w.document;
  w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  w.localStorage.setItem(KEY,backup(new Set(seed)));mount(w,data);
  const $=id=>d.getElementById(id),click=q=>{const b=d.querySelector(q);assert.ok(b,q);b.click();},input=(id,value,event='change')=>{$(id).value=value;$(id).dispatchEvent(new w.Event(event,{bubbles:true}));};
  return {w,d,$,click,input,ids:()=>[...d.querySelectorAll('[data-combat-beast]')].map(e=>+e.dataset.combatBeast),saved:()=>parseBackup(w.localStorage.getItem(KEY)),close:()=>w.close()};
}

test('50 familiars expose 100 unique commands with actual attack aspects and unlock levels',()=>{
  assert.equal(profiles.size,50);const actions=[...profiles.values()].flatMap(p=>p.actions);assert.equal(new Set(actions.map(a=>a.id)).size,100);
  for(const a of actions){assert.ok(a.summary);assert.doesNotMatch(a.summary,/<If|<UI|마지막 일격/);assert.equal(a.level,data.actions[commands[a.kind].actionId].level);}
  assert.equal(profiles.get(2).actions[0].element,'fire','fire-aspected magic with reversed adjective order');
  assert.equal(profiles.get(1).actions[0].element,'slash');assert.equal(profiles.get(17).actions[0].element,'unaspected');
});
test('enemy attacks, party resistance, recovery and harmful HP effects are classified separately',()=>{
  assert.deepEqual(ids({purpose:'heal'}),[13,17,19]);assert.deepEqual(ids({purpose:'buff'}),[2,15,18,22,47]);
  assert.deepEqual(ids({purpose:'cleanse'}),[19]);assert.deepEqual(ids({purpose:'dispel'}),[11]);
  assert.ok(!profiles.get(4).actions[1].states.includes('마비'));assert.equal(profiles.get(4).actions[1].element,null);
  assert.ok(!profiles.get(6).actions[1].states.includes('실명'));assert.equal(profiles.get(37).actions[1].element,null);
  assert.ok(ids({purpose:'state:기절'}).includes(26));assert.ok(!ids({purpose:'dot'}).includes(22),'party takes damage is not an enemy DoT');
  assert.ok(!ids({purpose:'heal'}).includes(30),'reducing enemy healing is not healing');
});
test('weakness matches actual damage, not protective aspects or a presumed elemental wheel',()=>{
  assert.deepEqual(ids({weakness:'fire'}),[2,14,29,34,35,38,50]);
  assert.ok(!profiles.get(35).actions[1].element,'fire resistance does not add a fire attack');
  assert.deepEqual(ids({purpose:'buff',weakness:'fire'}),[2],'different commands may satisfy the combined beast requirements');
  assert.deepEqual(ids({purpose:'heal',weakness:'fire'}),[]);
  assert.deepEqual(profiles.get(38).actions.map(a=>a.element),['fire','ice']);assert.deepEqual(profiles.get(38).actions[0].states,[],'bonus against frozen enemy does not itself freeze');
});
test('plain language and initial searches include skill names and usable effects',()=>{
  for(const query of ['힐','HP 회복'])assert.deepEqual(model.filter(new Set(),{query}).map(b=>b.id),[13,17,19]);
  assert.deepEqual(model.filter(new Set(),{query:'전광석화'}).map(b=>b.id),[2]);assert.deepEqual(model.filter(new Set(),{query:'ㅈㄱㅅㅎ'}).map(b=>b.id),[2]);
  assert.deepEqual(model.filter(new Set(),{query:'디스펠'}).map(b=>b.id),[11]);
  assert.deepEqual(model.filter(new Set(),{query:'헤이스트'}).map(b=>b.id),[2,15]);
  assert.deepEqual(model.filter(new Set(),{query:'흡혈'}).map(b=>b.id),[19],'an actual skill name still finds its user');
});
test('purpose view filters combined criteria, highlights matching commands, and preserves all ownership',()=>{
  const a=setup([2,17,999]);try{a.click('#combatView');assert.equal(a.ids().length,25);assert.equal(a.$('markPage').hidden,true);assert.equal(a.$('collectionLayoutSwitch').hidden,true);
    a.input('combatPurpose','buff');a.input('combatWeakness','fire');assert.deepEqual(a.ids(),[2]);assert.equal(a.d.querySelectorAll('.skill-matched').length,2);assert.match(a.$('combatResults').textContent,/전광석화/);
    a.input('status','owned');assert.deepEqual(a.ids(),[2]);a.click('#combatResults [data-check="2"]');assert.ok(a.saved().has(999));assert.deepEqual(a.ids(),[2]);a.click('#refreshResults');assert.deepEqual(a.ids(),[]);
    a.click('#undo');a.click('#refreshResults');assert.deepEqual(a.ids(),[2]);a.input('combatPurpose','heal');assert.deepEqual(a.ids(),[]);assert.equal(a.$('emptyResults').hidden,false);
    a.click('#resetCombat');assert.deepEqual(a.ids(),[2,17]);a.click('#numberView');assert.equal(a.$('combatFilters').hidden,true);assert.equal(a.$('collectionLayoutSwitch').hidden,false);
  }finally{a.close();}
});
test('details preserve conditional damage, command requirements and limitations with official sources',()=>{
  const a=setup();try{a.input('search','38','input');a.click('[data-detail="38"]');const body=a.$('detailBody');
    assert.match(body.textContent,/대상이 빙결 상태인 경우 추가 피해/);assert.match(body.textContent,/TP 100/);assert.match(body.textContent,/Lv.44/);
    assert.ok(body.querySelector('a[href="https://guide.ff14.co.kr/job/BeastMaster/34?type=E"]'));assert.equal(a.$('closeDetail').closest('.dialog-body'),null);
    a.click('#closeDetail');a.input('search','10','input');a.click('[data-detail="10"]');assert.match(a.$('detailBody').textContent,/실행 후 사역마수가 귀환/);
  }finally{a.close();}
});
