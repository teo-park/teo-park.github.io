import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseHunting,buildLocations} from '../scripts/update-locations.mjs';
import {create,mapPosition} from '../engine.js';
const read=name=>JSON.parse(readFileSync(new URL('../'+name,import.meta.url)));
const data=read('data.json'),locations=read('locations.json');

test('hidden hunting rows are included, malformed and absent coordinates are not invented',()=>{
  const row=(name,place,hidden='')=>`<tr ${hidden}><td class='name'><a href="https://ff14.inven.co.kr/dataninfo/hunting/detail.php?d=51&c=1">${name}<span class=cmtnum>[5]</span></a></td><td class='etc0'>${place}</td></tr>`;
  const rows=parseHunting(row('청설모','중부삼림>비취 호수(22, 17)')+row('푸길','중부 라노시아>여름여울(20, 22)',"style='display:none'")+row('사원 벌','남부 다날란>카른의 무너진 사원')+row('금강거북','남부삼림>낮은길(16, 30'));
  assert.equal(rows.length,4);assert.equal(rows[0].name,'청설모');assert.deepEqual(rows[1].coordinates,[{x:20,y:22}]);assert.deepEqual(rows[2].coordinates,[]);assert.deepEqual(rows[3].coordinates,[]);
});

test('explicit species links reject partial monster names and preserve NPC IDs',()=>{
  const input={beasts:[{id:33,locationHint:{type:'field',name:'지역'}}],links:[{beastId:33,names:['커얼'],region:'지역'}],maps:new Map([[1,{Id:'s1f6/00',SizeFactor:'100',PlaceName:'1',TerritoryType:'180'}]]),places:new Map([[1,{Name:'지역'}]]),npcs:new Map([[101,{Singular:'커얼'}],[102,{Singular:'커얼발톱 난봉꾼'}]]),rows:[{name:'커얼발톱 난봉꾼',region:'지역',area:'장소',coordinates:[{x:10,y:20}],sourceUrl:'https://ff14.inven.co.kr/dataninfo/hunting/detail.php?c=12'}]};
  assert.throws(()=>buildLocations(input),/No Inven coordinates/);
  input.rows.push({...input.rows[0],name:'커얼'});const result=buildLocations(input);assert.equal(result.entries[0].targets.length,1);assert.deepEqual(result.entries[0].targets[0].npcNameIds,[101]);assert.equal(result.entries[0].targets[0].captureVerified,false);
});

test('map coordinates use scale without applying the world offset a second time',()=>{
  assert.deepEqual(mapPosition({x:21.5,y:21.5},100),{x:50,y:50});assert.deepEqual(mapPosition({x:11.25,y:11.25},200),{x:50,y:50});assert.deepEqual(mapPosition({x:1,y:1}),{x:0,y:0});assert.throws(()=>mapPosition({x:0,y:60}),/지도 밖/);
});

test('reference coverage is sourced and never treated as verified capture routes',()=>{
  const model=create(data,locations),ids=new Set(data.beasts.map(b=>b.id));
  assert.equal(locations.coverage.beasts,locations.entries.length);assert.equal(locations.coverage.targets,locations.entries.flatMap(e=>e.targets).length);
  for(const entry of locations.entries){assert.ok(ids.has(entry.beastId));for(const t of entry.targets){assert.equal(t.captureVerified,false);assert.ok(t.npcNameIds.length);assert.ok(locations.maps[t.mapId]);assert.match(t.source.url,/^https:\/\/ff14\.inven\.co\.kr\/dataninfo\/hunting\/detail\.php\?/);mapPosition(t.coordinates,locations.maps[t.mapId].sizeFactor);}}
  assert.deepEqual(model.filter(new Set(),{query:'ㄱㅇㅋㄷㄹㄴ'}).map(b=>b.id),[41]);
  assert.deepEqual(model.filter(new Set(),{query:'커얼발톱 난봉꾼'}),[]);
  assert.equal(model.routes.get(25)[0].name,'중부 다날란');assert.equal(model.locations.get(25)[0].region,'검은장막 숲 남부삼림');
  assert.equal(model.locations.has(15),false,'new Crab family is not conflated with Megalocrab');
  assert.equal(model.locations.has(1),false,'starter quest has no invented spawn');
});
