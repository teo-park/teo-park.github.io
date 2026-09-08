const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const D=require('../carnivale-data.js'),E=require('../carnivale.js'),context={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../data.js'),'utf8'),context);
const spells=JSON.parse(JSON.stringify(context.window.BLUE_MAGE_DATA.spells)),known=new Set(spells.map(s=>s.id));
test('32 stages cover every Korean stage and phase, with sources and valid spell references',()=>{
  assert.deepEqual(D.stages.map(s=>s.id),Array.from({length:32},(_,i)=>i+1));assert.equal(D.count,32);
  assert.equal(D.stages[0].name,'데뷔전');assert.equal(D.stages[31].name,'황금 투사');
  assert.deepEqual(D.stages.map(s=>s.phases.length),[1,2,1,2,1,2,3,2,1,1,2,2,2,2,1,2,2,2,2,3,2,2,1,3,3,2,1,1,2,3,2,2]);
  for(const s of D.stages){
    assert.equal(s.level,s.id<=25?50:s.id<=30?60:s.id===31?70:80);
    assert.equal(s.source,`https://mage.blue/masked-carnivale/stages/${String(s.id).padStart(2,'0')}/`);assert.match(s.video,/^https:\/\/www.youtube.com\/watch\?v=[\w-]+$/);
    assert.ok(s.summary&&s.tags.length);for(const p of s.phases){assert.ok(p.title&&p.steps.length);for(const step of p.steps)assert.ok(step.trigger&&step.action);}
    const ids=[...s.required.flatMap(g=>g.alternatives.flat()),...s.recommended,...s.phases.flatMap(p=>p.steps.flatMap(x=>x.spells)),...(s.achievement?.spells||[])];
    for(const id of ids){assert.ok(known.has(id),`${s.id}: unknown spell ${id}`);assert.notEqual(id,91,'Basic Instinct does not apply in Carnivale');}
    for(const g of s.required){assert.ok(g.label&&g.alternatives.length);assert.ok(g.alternatives.every(a=>a.length));}
    assert.ok(E.preparation(s,known).complete);assert.equal(E.preparation(s,new Set()).ready,0);
  }
});
test('alternatives count a complete combo once and never treat half a combo as ready',()=>{
  const stage=D.stages[4],before=JSON.stringify(stage),learned=new Set([33,99999]);
  assert.equal(E.preparation(stage,learned).complete,false);
  assert.equal(E.preparation(stage,new Set([92])).complete,false);
  for(const ids of [[33,92],[36],[42]]){const p=E.preparation(stage,new Set(ids));assert.equal(p.ready,1);assert.equal(p.total,1);assert.equal(p.complete,true);}
  assert.deepEqual(learned,new Set([33,99999]));assert.equal(JSON.stringify(stage),before);
  const gold=D.stages[31],partial=new Set(known);partial.delete(33);assert.equal(E.preparation(gold,partial).complete,false);
});
test('stage search accepts exact numbers, Korean initials and required skills, and filters intersect',()=>{
  for(const q of ['2','No.02','2시합'])assert.deepEqual(E.filter(D.stages,new Set(),{query:q}).map(s=>s.id),[2]);
  assert.ok(E.matches(D.stages[31],'ㅎㄱㅌㅅ'));assert.ok(E.matches(D.stages[31],'초경화',spells));
  assert.equal(E.matches(D.stages[0],'초경화',spells),false);
  assert.deepEqual(E.filter(D.stages,new Set(),{kind:'achievement'}).map(s=>s.id),[10,20,25,30,31,32]);
  assert.equal(E.filter(D.stages,known,{kind:'missing'}).length,0);
  assert.deepEqual(E.filter(D.stages,new Set(),{query:'황금',kind:'missing'}).map(s=>s.id),[31,32]);
});
test('mechanic counters and special achievement restrictions stay stage-specific',()=>{
  assert.ok(D.stages[11].required.some(g=>g.alternatives.some(a=>a.includes(23))));
  assert.ok(D.stages[21].required.some(g=>g.alternatives.some(a=>a.includes(31))));
  assert.match(D.stages[21].warning,/정어리로 차단할 수 없/);
  const conditions=id=>D.stages[id-1].achievement.conditions.join(' ');
  assert.match(conditions(25),/7분 15초/);assert.match(conditions(25),/HP 회복 없음/);
  assert.match(conditions(30),/6분 30초/);assert.match(conditions(30),/분신 세 마리/);assert.doesNotMatch(conditions(30),/회복 없음|회복 금지/);
  assert.match(conditions(31),/6분 50초/);assert.doesNotMatch(conditions(31),/6속성|피해 없음/);
  assert.match(conditions(32),/전력 질주/);assert.match(conditions(32),/수정을 파괴하지/);assert.doesNotMatch(conditions(32),/분|피해 없음/);
});
