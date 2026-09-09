const {test}=require('node:test'),assert=require('node:assert/strict');
const C=require('../scripts/collection.js'),fish=require('../data/fish.json').fish;
test('voyage baits deduplicate recommendations and distinguish observed alternatives from mooch fish',()=>{
 const rows=[
  {BestBait:'Plump Worm',BestBaitTranslated:'굵은지렁이',baits:[{kind:'Krill',name:'Krill',label:'크릴',time:'10 - 12'}]},
  {BestBait:'PlumpWorm',BestBaitTranslated:'굵은지렁이',BaitSpecialType:'Imaginary Bait',baits:[]},
  {BestBait:'M!T!Mooch Fish',BestBaitTranslated:'조건 물고기',BaitMoochAlternatives:'M!Alternative Fish',baits:[]},
  {BestBait:'Glowworm',BestBaitTranslated:'발광충',baits:[{kind:'Special',name:'Glowworm',label:'발광충',time:'9 - 12'},{kind:'VersatileLure',name:'VersatileLure',label:'만능 루어',time:''}]}
 ];
 const before=structuredClone(rows),result=C.voyageBaits(rows);
 assert.deepEqual(result.recommended.map(b=>b.id),['plumpworm','glowworm']);assert.equal(result.recommended[0].fish.length,2);
 assert.deepEqual(result.alternatives.map(b=>b.id),['krill']);assert.deepEqual(new Set(result.mooch.map(b=>b.id)),new Set(['moochfish','alternativefish']));assert.equal(result.unknown.length,0);assert.deepEqual(rows,before);
});
test('any basic bait is a choice, and absent recommendations stay unknown',()=>{
 const row={BestBait:'Krill',BaitAny:'Yes',baits:[{kind:'Krill',name:'Krill',label:'크릴',time:'3 - 4'}]};
 assert.equal(C.voyageBaits([row]).recommended.length,0);assert.equal(C.voyageBaits([row]).basicChoice,true);
 assert.equal(C.voyageBaits([row,{BestBait:'Ragworm',BestBaitTranslated:'바위털갯지렁이'}]).basicChoice,false);
 assert.equal(C.voyageBaits([{}]).unknown.length,1);assert.deepEqual(C.voyageBaits([]).recommended,[]);
});
test('real optional mooch alternatives and transitive starter baits are all retained',()=>{
 const tylo=fish.find(f=>f.Fish==='Tylosaurus'),catalog=C.createCatalog(fish.filter(f=>f.route===tylo.route));
 const rows=C.plan(fish.filter(f=>f.route===tylo.route),catalog,name=>C.key(name)!==C.key(tylo.Fish),true);
 const summary=C.voyageBaits(rows),ids=new Set(summary.mooch.map(b=>b.id));
 assert.ok(ids.has('captainspen'));assert.ok(ids.has('cieldalaesroosterfish'));
 for(const dep of rows.filter(f=>f.LocalRequiredBy.length&&!/^M!/.test(f.BestBait)&&f.BaitAny!=='Yes'))assert.ok(summary.recommended.some(b=>b.id===C.key(dep.BestBait)),dep.Fish);
});
