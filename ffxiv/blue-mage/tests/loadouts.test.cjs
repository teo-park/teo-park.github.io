const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const L=require('../loadouts.js'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../data.js'),'utf8'),ctx);
const spells=JSON.parse(JSON.stringify(ctx.window.BLUE_MAGE_DATA.spells)),all=new Set(spells.map(s=>s.id));
const run=(ids,options={})=>L.recommend(spells,new Set(ids),options),selected=r=>r.selected.map(s=>s.id);
function invariants(r,learned){
  const ids=selected(r),set=new Set(ids);assert.ok(ids.length<=24);assert.equal(set.size,ids.length);
  assert.ok(ids.every(id=>learned.has(id)));assert.ok(r.selected.every(s=>s.reason&&s.group));
  for(const group of L.cooldowns)assert.ok(group.filter(id=>set.has(id)).length<=1,`shared cooldown ${group}`);
  if(set.has(64)||set.has(82))assert.ok(set.has(81));
  if(set.has(92))assert.ok(set.has(33));
  for(const f of r.rotation.flows)assert.ok(f.steps.every(id=>set.has(id)),f.title);
  for(const s of r.rotation.loop)assert.ok(set.has(s.id));
  for(const s of r.rotation.burst.steps){if(s.gcd)assert.ok(set.has(s.gcd));assert.ok(s.abilities.every(id=>id==='swiftcast'||set.has(id)));}
  assert.ok(r.missing.every(s=>!learned.has(s.id)));assert.ok(r.blocked.every(s=>s.required));
}
test('all roles and duties stay within 24 learned spells, including requested utility and assigned DoTs',()=>{
  for(const role of Object.keys(L.roles))for(const duty of Object.keys(L.duties))for(const dot of ['none','breath','flame']){
    const options={role,duty,dot,interrupt:true,cleanse:true,swap:true,debuff:'offguard'},r=run(all,options);invariants(r,all);
    assert.ok(selected(r).includes(24));assert.ok(selected(r).includes(73));assert.ok(selected(r).includes(20));
    if(dot!=='none')assert.ok(selected(r).includes(dot==='breath'?109:121));
  }
});
test('empty and partially learned records do not invent core spells or complete role readiness',()=>{
  for(const role of Object.keys(L.roles)){const r=run([], {role});assert.equal(r.selected.length,0);assert.ok(r.blocked.some(s=>s.id===77));}
  const tank=run([1,63,105],{role:'tank'});assert.deepEqual(tank.blocked.map(s=>s.id),[77,30,29,13,17]);assert.ok(tank.notes.some(n=>n.includes('적개심')));
  const healer=run([13,58,59],{role:'healer'});assert.deepEqual(healer.blocked.map(s=>s.id),[77]);assert.ok(healer.notes.some(n=>n.includes('힐러 강화')));
});
test('role cooldowns and solo setup reflect the selected role',()=>{
  for(const [role,id,excluded] of [['tank',95,[88,100,39]],['healer',88,[95,100,39]],['dps',100,[88,95,30]]]){
    const ids=selected(run(all,{role}));assert.ok(ids.includes(id));assert.ok(excluded.every(n=>!ids.includes(n)));
  }
  const solo=run(all,{role:'dps',duty:'solo'});assert.equal(solo.role,'tank');assert.ok([77,30,91].every(id=>selected(solo).includes(id)));assert.match(solo.notes.join(' '),/가면 무투회/);
  assert.ok(!selected(run(all,{role:'tank'})).includes(91));
});
test('cooldown alternatives and spell packages work with incomplete collections',()=>{
  const have=new Set([1,45,46,79,102,120,67,64,82,92]);const r=run(have,{role:'healer',duty:'dungeon'});invariants(r,have);
  assert.ok([1,45,46,79,102,120,67].every(id=>selected(r).includes(id)));
  assert.ok([64,82,92].every(id=>!selected(r).includes(id)));assert.ok(r.skipped.some(s=>s.id===92));
  const pair=run([1,33,92,67],{duty:'dungeon'});assert.ok(selected(pair).includes(92));assert.ok(!selected(pair).includes(67));
});
test('buffs, crowd-control and healing sequences retain their actual order',()=>{
  const dps=run(all),flows=dps.rotation.flows;
  assert.deepEqual(flows.find(f=>f.title==='물리 3연타').steps,[64,82,81]);
  assert.deepEqual(flows.find(f=>f.title==='8연타 강화').steps,[12,100]);
  assert.deepEqual(flows.find(f=>f.title==='관통산탄 연속 사용').steps,[78,78,78,78]);
  assert.deepEqual(run(all,{duty:'dungeon'}).rotation.flows.find(f=>f.title==='적 무리 처리').steps,[97,33,92]);
  assert.deepEqual(run(all,{role:'healer'}).rotation.flows.find(f=>f.title.includes('자신의 HP')).steps,[58,13]);
});
test('full opener separates GCDs, uninterrupted four-charge Surpanakha, Swiftcast and end channel',()=>{
  const burst=run(all).rotation.burst;assert.equal(burst.full,true);
  assert.deepEqual(burst.steps.map(s=>s.gcd),[64,82,90,39,81,118,118,12,100]);
  assert.deepEqual(burst.steps.at(-2).abilities,['swiftcast',78,78,78,78]);
  assert.deepEqual(burst.steps.at(-1).abilities,[103]);
  for(const id of L.openerIds){const have=new Set(all);have.delete(id);const r=run(have);assert.equal(r.rotation.burst.full,false);invariants(r,have);}
});
test('DoT duty changes to a bounded partial example instead of silently editing the full opener',()=>{
  for(const dot of ['breath','flame']){
    const r=run(all,{dot}),b=r.rotation.burst,id=dot==='breath'?109:121;assert.equal(b.full,false);assert.equal(b.enabled,true);
    const gcds=b.steps.map(s=>s.gcd).filter(Boolean);assert.deepEqual(gcds,[39,12,id]);assert.ok(!gcds.includes(81));
    assert.ok(r.rotation.flows.some(f=>f.steps.join()===`12,${id}`));
  }
  assert.equal(run(all,{burst:false}).rotation.burst.enabled,false);
  assert.ok(!selected(run([77,39,1])).includes(39));
});
test('deterministic subsets never create impossible rotations or use unknown future IDs',()=>{
  let seed=5321;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<160;i++){
    const learned=new Set(spells.filter(()=>random()<.55).map(s=>s.id));learned.add(999);
    const options={role:['tank','healer','dps'][i%3],duty:['boss','dungeon','solo'][Math.floor(i/3)%3],dot:['none','breath','flame'][i%3],interrupt:i%2===0,swap:true};
    const r=run(learned,options);invariants(r,learned);assert.ok(!selected(r).includes(999));assert.deepEqual(r,run(learned,options));
  }
});
