import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {table,tooltip,icon,catalog} from '../scripts/update-data.mjs';

const data=JSON.parse(await fs.readFile(new URL('../data.json',import.meta.url),'utf8'));
const lock=JSON.parse(await fs.readFile(new URL('../sources.lock.json',import.meta.url),'utf8'));

test('Korean metadata rows and global schema rows preserve IDs, quoted fields and embedded newlines',()=>{
  const ko=table('key,0,1\n#,Name,Pet\nint32,str,int32\n1,"이름, 첫째",47\n2,"두 줄\n설명",48\n','ko',['Name']);
  assert.equal(ko.rows.size,2);assert.equal(ko.rows.get(1).Name,'이름, 첫째');assert.equal(ko.rows.get(2).Name,'두 줄\n설명');
  assert.equal(ko.raw.get(1)['1'],undefined);
  const en=table('#,Pet,Name\n1,47,"A ""quoted"" name"\n','en');
  assert.equal(en.rows.get(1).Pet,'47');assert.equal(en.rows.get(1).Name,'A "quoted" name');
  assert.throws(()=>table('key,0\n#,Name\nwrong,str\n1,a\n','ko'),/format/);
});

test('catalog contains fifty actual familiars with distinct Pet IDs and complete names',()=>{
  assert.equal(data.beasts.length,50);assert.deepEqual(data.beasts.map(b=>b.id),Array.from({length:50},(_,i)=>i+1));
  assert.equal(new Set(data.beasts.map(b=>b.petId)).size,50);
  for(const b of data.beasts){assert.match(b.name,/[가-힣]/);assert.ok(b.englishName);assert.ok(b.description);assert.ok(b.icon.id);assert.ok(b.acquisition.length);}
  assert.equal(data.beasts[0].name,'쿠시');assert.equal(data.beasts[49].name,'베히모스');
});

test('location reference type distinguishes fields from duties without inventing capture coordinates',()=>{
  const squirrel=data.beasts.find(b=>b.name==='청설모'),slime=data.beasts.find(b=>b.name==='슬라임');
  assert.equal(squirrel.locationHint.source.sheet,'PlaceName');assert.equal(squirrel.locationHint.name,'검은장막 숲 중부삼림');
  assert.equal(slime.locationHint.source.sheet,'ContentFinderCondition');assert.equal(slime.locationHint.name,'구리종 광산');
  assert.equal(data.beasts.filter(b=>b.locationHint?.type==='field').length,37);
  assert.equal(data.beasts.filter(b=>b.locationHint?.type==='duty').length,12);
  for(const b of data.beasts)for(const a of b.acquisition)if(a.type==='capture'){
    assert.equal(a.location.coordinates,null);assert.equal(a.enemyNames,null);assert.equal(a.captureDifficulty,null);assert.equal(a.successRate,null);
  }
});

test('starter quest and exchange alternatives have distinct provenance and correct currencies',()=>{
  assert.equal(data.items.length,16);
  const kushi=data.beasts[0],starter=data.items.find(i=>i.beastId===kushi.id);
  assert.equal(kushi.locationHint,null);assert.equal(kushi.acquisition.length,1);
  assert.equal(starter.id,49805);assert.equal(starter.sources[0].type,'quest');assert.equal(starter.sources[0].quest.id,71026);
  const crab=data.items.find(i=>i.name==='코르나고 항아리: 게');
  assert.deepEqual(crab.sources[0].costs,[{id:51734,name:'저순도 마수핵',count:10}]);
  assert.deepEqual(crab.sources[0].prerequisiteQuests.map(q=>q.id),[71030]);
  const behemoth=data.items.find(i=>i.beastId===50);
  assert.deepEqual(behemoth.sources[0].costs,[{id:51735,name:'고순도 마수핵',count:40}]);
  assert.equal(data.items.filter(i=>i.sources.some(s=>s.type==='exchange')).length,15);
  for(const item of data.items){assert.equal(data.beasts.find(b=>b.id===item.beastId).name,item.name.split(': ')[1]);assert.ok(item.sources.length);}
});

test('tooltips remove formatting payloads but retain conditional source and stable skill links',()=>{
  const t=tooltip('<UIForeground>F201F4</UIForeground>위력\n<If(Equal(1,1))>효과<Else/></If>');
  assert.equal(t.text,'위력\n효과');assert.equal(t.hasConditions,true);assert.match(t.raw,/<If/);
  assert.equal(Object.keys(data.actions).length,122);
  for(const b of data.beasts)for(const ref of b.actions)assert.ok(data.actions[ref.actionId].name);
  assert.equal(data.actions[44880].name,'포획하기');assert.match(data.actions[44880].tooltip.text,/자신의 레벨이 대상보다 낮으면 성공하지 않습니다/);
  assert.equal(data.actions[44936].tooltip.hasConditions,true);
  assert.equal(icon(242001).path,'ui/icon/242000/242001.tex');
});

test('source manifest pins every input and the human-readable catalog matches the generated data',async()=>{
  assert.equal(lock.files.length,13);assert.equal(new Set(lock.files.map(f=>f.language+f.path)).size,13);
  for(const f of lock.files){assert.match(f.revision,/^[a-f0-9]{40}$/);assert.match(f.sha256,/^[a-f0-9]{64}$/);assert.ok(f.url.includes(f.revision));}
  assert.equal(await fs.readFile(new URL('../catalog.md',import.meta.url),'utf8'),catalog(data));
});
