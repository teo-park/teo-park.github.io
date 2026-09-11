const {test}=require('node:test');
const assert=require('node:assert/strict');
const A=require('../scripts/achievements.js'),V=require('../scripts/voyages.js');
const data=require('../data/achievements.json'),fish=require('../data/fish.json').fish;
const planner=A.create(data,fish);
const voyage=(route,number)=>({route,number,stops:V.stops(route,number)});

test('bite comparison uses the target bait and separates overlapping, unknown and distinct observations',()=>{
  const target={Fish:'Target',FishTranslated:'대상',route:'indigo',Stop:'Galadion',spectral:false,Bite:'!',BestBait:'Krill',BestBaitTranslated:'크릴',BaitKrill:'4 - 8',weather:[{name:'맑음',available:true}]};
  const peer=(Fish,rest={})=>({...target,Fish,FishTranslated:Fish,...rest});
  const rows=[target,peer('Overlap',{BestBait:'Ragworm',BaitKrill:'6 - 10'}),peer('Boundary',{BaitKrill:'8 - 10'}),peer('Separated',{BaitKrill:'9 - 12'}),peer('Unmeasured',{BaitKrill:'~7 - 9'}),peer('Missing',{BaitKrill:''}),peer('Other bait',{BestBait:'Ragworm',BaitKrill:''}),peer('Other bite',{Bite:'!!'}),peer('Other current',{spectral:true}),peer('Other stop',{Stop:'Southern'}),peer('Other route',{route:'ruby'}),peer('Other weather',{weather:[{name:'비',available:true}]})];
  const before=JSON.stringify(rows),[result]=A.biteComparison(target,rows);
  assert.equal(result.label,'크릴');assert.equal(result.unknown,1);
  assert.deepEqual(result.peers.map(p=>[p.fish.Fish,p.rawTime,p.overlap]),[['Overlap','6 - 10',true],['Boundary','8 - 10',true],['Missing','',null],['Unmeasured','~7 - 9',null],['Separated','9 - 12',false]]);
  assert.equal(JSON.stringify(rows),before);
});

test('special and mooch comparisons keep bait identities and any-bait targets compare each basic bait separately',()=>{
  const target={Fish:'Target',FishTranslated:'대상',route:'ruby',Stop:'Thavnair',spectral:true,Bite:'!',BestBait:'M!Source',BaitMoochType:'Source',BaitMooch:'4 - 6'};
  const peer=(Fish,rest={})=>({...target,Fish,FishTranslated:Fish,...rest});
  const rows=[target,peer('Same'),peer('Other',{BestBait:'M!Different',BaitMoochType:'Different'}),peer('Alternative',{BestBait:'M!Different',BaitMoochType:'Different',BaitMoochAlternatives:'Source',BaitMooch:'1 - 2'})];
  assert.deepEqual(A.biteComparison(target,rows)[0].peers.map(p=>[p.fish.Fish,p.rawTime,p.overlap]),[['Same','4 - 6',true],['Alternative','',null]]);
  const special={...target,BestBait:'Rat Tail',BaitSpecialType:'Rat Tail',BaitSpecial:'4 - 6'};
  assert.deepEqual(A.biteComparison(special,[special,{...special,Fish:'Same'},{...special,Fish:'Different',BaitSpecialType:'Heavy Steel Jig'}])[0].peers.map(p=>p.fish.Fish),['Same']);
  const any={...target,BestBait:'Krill',BaitAny:'Yes',BaitRagworm:'2 - 4',BaitKrill:'4 - 6',BaitPlumpWorm:'6 - 8'},other={...any,Fish:'Other',BaitAny:'',BaitRagworm:'5 - 6',BaitKrill:'5 - 6',BaitPlumpWorm:'5 - 6'};
  assert.deepEqual(A.biteComparison(any,[any,other]).map(g=>[g.field,g.rawTime,g.peers[0].overlap]),[['Ragworm','2 - 4',false],['Krill','4 - 6',true],['PlumpWorm','6 - 8',true]]);
});

test('achievement comparisons use all available fish, including other groups, without mixing departure periods',()=>{
  for(const [route,max] of [['indigo',12],['ruby',9]])for(let n=1;n<=max;n++){
    const v=voyage(route,n);
    for(const goal of planner.forVoyage(v))for(const section of goal.sections)for(const target of section.targets)for(const group of target.comparison)for(const {fish:peer} of group.peers){
      assert.equal(peer.route,route);assert.equal(peer.Stop,section.stop);assert.equal(peer.spectral,target.fish.spectral);assert.equal(peer.Bite,target.fish.Bite);assert.ok(V.available(peer,v,section.index));
    }
  }
  const mantis=planner.forVoyage(voyage('ruby',4)).find(g=>g.id==='Mantis').sections[1].targets.find(t=>t.fish.Fish==='Jade Mantis Shrimp');
  assert.deepEqual(mantis.comparison[0].peers.map(p=>[p.fish.Fish,p.overlap]),[['Mermaid Scale',true],['Impostopus',false]]);
});
test('12 one-voyage goals distinguish individual catches from party totals, including 7.5',()=>{
  const expected={Jellyfish:['party',150],Seadragon:['party',100],Shark:['party',200],Octopus:['party',150],Fugu:['party',250],Crab:['party',250],Manta:['individual',25],Shellfish:['party',350],Squid:['party',400],Shrimp:['individual',50],Prehistoric:['party',300],Mantis:['individual',50]};
  assert.equal(planner.goals.size,12);
  for(const [id,[scope,count]] of Object.entries(expected)){
    const goal=planner.goals.get(id);assert.equal(goal.scope,scope,id);assert.equal(goal.count,count,id);
    for(const source of goal.sourceIds)assert.ok(data.sources.some(s=>s.id===source&&s.url.startsWith('https://')));
  }
});
test('curated route/time recommendations replace the three-stop intersection for all 21 routes',()=>{
  const expected={indigo:[['Seadragon'],['Octopus'],[],[],['Jellyfish'],['Shark'],[],['Manta'],['Crab'],[],['Fugu'],['Fugu','Manta']],ruby:[['Prehistoric'],[],['Squid'],['Mantis'],['Shellfish','Shrimp'],['Shrimp'],['Mantis'],['Shellfish'],['Squid']]};
  for(const [route,plans] of Object.entries(expected))for(let i=0;i<plans.length;i++){
    const result=planner.forVoyage(voyage(route,i+1));assert.deepEqual(result.filter(g=>g.status==='recommended').map(g=>g.id),plans[i]);
    for(const g of result.filter(g=>g.status==='recommended'))for(const section of g.sections){
      assert.ok(section.step,g.id+' '+section.stop);
      for(const target of section.step.targets)assert.ok(section.targets.some(t=>t.fish.Fish===target),g.id+' '+target);
    }
  }
  const shark=planner.forVoyage(voyage('indigo',6)).find(g=>g.id==='Shark');
  assert.equal(shark.status,'recommended');assert.equal(shark.sections[1].targets.length,0);assert.equal(shark.sections[1].step.current,'avoid');
  const jelly=planner.forVoyage(voyage('indigo',3)).find(g=>g.id==='Jellyfish');
  assert.equal(jelly.status,'alternative');assert.equal(jelly.sections.filter(s=>s.targets.length).length,1);
});
test('current/time-specific fish and goal groups stay accurate outside recommended routes',()=>{
  const one=planner.forVoyage(voyage('ruby',1)),other=planner.forVoyage(voyage('ruby',4));
  const shrimp=one.find(g=>g.id==='Shrimp'),mantis=one.find(g=>g.id==='Mantis');
  assert.equal(shrimp.status,'appearance');assert.ok(!shrimp.sections.flatMap(s=>s.targets).some(t=>t.fish.Fish==='Jade Mantis Shrimp'));
  assert.ok(mantis.sections[1].targets.some(t=>t.fish.Fish==='Jade Mantis Shrimp'));
  assert.ok(!mantis.sections[2].targets.some(t=>t.fish.Fish==='Tiger Mantis'));
  assert.ok(other.find(g=>g.id==='Mantis').sections[2].targets.some(t=>t.fish.Fish==='Tiger Mantis'));
  assert.ok(!other.find(g=>g.id==='Prehistoric').sections[2].targets.some(t=>t.fish.Fish==='Pliosaurus'));
  const shellfish=planner.forVoyage(voyage('ruby',2)).find(g=>g.id==='Shellfish');
  assert.ok(!shellfish.sections[1].targets.some(t=>t.fish.Fish==='Maelstrom Turban'));
  assert.ok(shellfish.sections.every(s=>s.step===null),'do not apply recommended-current tactics to another time');
  for(const route of ['indigo','ruby'])for(const g of planner.forVoyage(voyage(route,1)))for(const s of g.sections)for(const t of s.targets)assert.equal(t.fish.route,route);
});
test('next recommended registration follows published times and excludes already closed voyages',()=>{
  const now=Date.parse('2026-09-10T08:00:00+09:00');
  for(const [id,time] of [['Shrimp','09:00'],['Manta','15:00'],['Mantis','11:00'],['Prehistoric','23:00']])assert.equal(planner.nextDeparture(id,now).start,Date.parse('2026-09-10T'+time+':00+09:00'));
  const start=Date.parse('2026-09-10T09:00:00+09:00');
  assert.equal(planner.nextDeparture('Shrimp',start+14*60000).start,start);
  assert.equal(planner.nextDeparture('Shrimp',start+15*60000).start,Date.parse('2026-09-10T13:00:00+09:00'));
  assert.equal(planner.nextDeparture('not-a-goal',now),null);
});
test('invalid trips fail closed and derived plans do not mutate fish or read collection flags',()=>{
  const before=JSON.stringify(fish);
  assert.deepEqual(planner.forVoyage({route:'ruby',stops:[]}),[]);
  assert.deepEqual(planner.forVoyage({route:'other',stops:V.stops('ruby',1)}),[]);
  const altered=voyage('ruby',1);altered.stops[0].time='Invalid';assert.deepEqual(planner.forVoyage(altered),[]);
  const stale=voyage('ruby',1);stale.number=4;
  assert.equal(planner.forVoyage(stale).find(g=>g.id==='Prehistoric').status,'recommended');
  const marked=fish.map(f=>({...f,caught:true})),other=A.create(data,marked);
  assert.deepEqual(other.forVoyage(voyage('indigo',2)).map(g=>[g.id,g.status,g.availableCount]),planner.forVoyage(voyage('indigo',2)).map(g=>[g.id,g.status,g.availableCount]));
  assert.equal(JSON.stringify(fish),before);
});
