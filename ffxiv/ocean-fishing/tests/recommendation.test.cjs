const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../scripts/collection.js');
const fish = (Fish, values = {}) => ({ Fish, FishTranslated: Fish, Stop: 'A', TimeFrameDay: '', Points: '100', DH: '4', TH: '6', BestBait: 'Krill', BaitKrill: '4 - 8', Bite: '!', ...values });
const recommendation = (row, options) => api.recommend([row], options).get(row);

test('compares marginal points against a free single catch, and distinguishes efficiency from burst', () => {
  const row = fish('Target');
  const efficient = recommendation(row, { gp: 700 });
  assert.equal(efficient.best.action, 'DH');
  assert.equal(efficient.best.efficiency, 75);
  assert.deepEqual(efficient.best.extra, { min: 300, max: 300 });
  assert.equal(recommendation(row, { gp: 700, objective: 'burst' }).best.action, 'TH');
  // Equal total/GP ratios would incorrectly favour DH here; subtracting the free fish favours TH.
  assert.equal(recommendation(fish('Marginal', { DH: '4', TH: '7' }), { gp: 700 }).best.action, 'TH');
  assert.equal(recommendation(fish('Equal efficiency', { DH: '5', TH: '8' }), { gp: 700 }).best.action, 'DH');
  assert.equal(recommendation(fish('Equal score', { DH: '4', TH: '4' }), { gp: 700, objective: 'burst' }).best.action, 'DH');
});

test('respects exact GP boundaries, unavailable skills and conservative count ranges', () => {
  const row = fish('Target', { DH: ['2 - 4'], TH: ['3 - 7'] });
  for (const gp of [-1, NaN, Infinity, 0, 399]) assert.equal(recommendation(row, { gp }).best, null);
  for (const gp of [400, 699]) assert.equal(recommendation(row, { gp, objective: 'burst' }).best.action, 'DH');
  const burst = recommendation(row, { gp: 700, objective: 'burst' });
  assert.deepEqual(burst.best.total, { min: 300, max: 700 });
  assert.equal(recommendation(row, { gp: 2000, objective: 'burst', allowTriple: false }).best.action, 'DH');
  const save = recommendation(fish('One fish', { DH: '1', TH: '1' }), { gp: 1000 });
  assert.equal(save.best, null); assert.match(save.reason, /GP 보존/);
});

test('never ranks missing, guessed, invalid or already-rendered haul quantities', () => {
  for (const invalid of ['', 'unknown', '3 - 2', '0', '-2', '1.5', '400 - 800 (2 - 4)']) {
    assert.equal(recommendation(fish('Missing', { DH: invalid, TH: invalid })).best, null);
  }
  assert.equal(recommendation(fish('Fallback', { DH: ['3 - 4'], TH: ['5 - 7'], DHKnown: false, THKnown: false })).best, null);
  assert.equal(recommendation(fish('No points', { Points: '' })).best, null);
});

test('ranks separately by stop, normal/spectral and preparation conditions, with ties', () => {
  const rows = [fish('A'), fish('Tie'), fish('Lower', { Points: 50 }),
    fish('Conditional', { Intuition: '<img src="../img/fish/B.png">', Points: 1000 }),
    fish('Mooch', { BestBait: 'M!B', BaitMoochType: 'B', Points: 900 }),
    fish('Spectral', { TimeFrameDay: 'Yes', Points: 2000 }), fish('Other stop', { Stop: 'B', Points: 3000 })];
  const before = JSON.stringify(rows), result = api.recommend(rows);
  assert.deepEqual(rows.map(row => result.get(row).rank), [1, 1, 3, 1, 2, 1, 1]);
  assert.deepEqual(result.get(rows[4]).hints.conditions, ['생미끼']);
  assert.equal(JSON.stringify(rows), before);
  const planned = api.plan(rows, api.createCatalog(rows), () => true, true, '', 'TH', { gp: 700 });
  assert.equal(planned.length, rows.length, 'recommendation never hides low-score or caught fish');
  assert.ok(planned.every(row => row.LocalRecommendation));
});

test('uses the target bait for overlap checks, not each competitor’s preferred bait', () => {
  const target = fish('Target');
  const rows = [target,
    fish('Overlap', { BestBait: 'Ragworm', BaitKrill: '7 - 10' }),
    fish('Boundary', { BaitKrill: '8 - 10' }),
    fish('Other bite', { Bite: '!!' }), fish('Other time', { BaitKrill: '9 - 12' }),
    fish('Other weather mode', { TimeFrameDay: 'Yes' }), fish('Other stop', { Stop: 'B' }),
    fish('Not on bait', { BaitKrill: '' })];
  const hints = api.recommend(rows).get(target).hints;
  assert.deepEqual(hints.overlaps, ['Overlap', 'Boundary']);
  assert.deepEqual(hints.window, { min: 4, max: 8 });
  const nested = fish('Nested', { Bait: { BestBait: 'Krill', Krill: ['4 - 8', 4] } });
  assert.deepEqual(recommendation(nested).hints.window, hints.window);
  const unknown = recommendation(fish('Unknown', { BaitKrill: '?' })).hints;
  assert.equal(unknown.unknown, true); assert.equal(unknown.window, null);
});

test('bait timing handles spaced names and preserves estimates without inventing exact bounds', () => {
  for (const BestBait of ['Plump Worm', 'PlumpWorm', '  Plump Worm ']) {
    assert.deepEqual(api.baitInfo({ BestBait, BaitPlumpWorm: '13 - 16' }).window, {min:13,max:16});
  }
  const nested = { Bait: { BestBait:'Plump Worm', PlumpWorm:['13 - 16',13] } };
  assert.equal(api.baitInfo(nested).rawTime,'13 - 16');
  for (const [raw,text] of [['~6 - 8','약 6–8초'],['5.5+','5.5초 이상'],['','시간 미확인']]) {
    assert.equal(api.biteTimeText(raw),text);
    const result=recommendation(fish('Approximate',{BaitKrill:raw}));
    assert.equal(result.hints.window,null);assert.equal(result.hints.unknown,true);
    assert.equal(result.hints.rawTime,raw);
  }
  assert.deepEqual(api.numberRange('9 – 12'),{min:9,max:12});
});

test('any-bait observations require an explicit flag and matching measured windows', () => {
  const row={BestBait:'',BaitAny:'Yes',BaitRagworm:'10 - 11',BaitKrill:'10 - 11',BaitPlumpWorm:'10 -11'};
  assert.equal(api.baitInfo(row).label,'기본 미끼 3종 모두 가능');
  assert.deepEqual(api.baitInfo(row).window,{min:10,max:11});
  assert.equal(api.baitInfo({...row,BaitAny:''}).rawTime,'');
  assert.equal(api.baitInfo({...row,BaitKrill:'8 - 12'}).rawTime,'','do not average incompatible bait windows');
});

test('optional mooching keeps alternatives in prerequisites without making bait fishing conditional', () => {
  const row=fish('Target',{BaitMoochType:'M!A',BaitMoochAlternatives:'M!B'});
  assert.deepEqual(api.dependencies(row),['a','b']);
  assert.equal(recommendation(row).conditional,false);
  assert.equal(recommendation({...row,BestBait:'M!A'}).conditional,true);
  const target=fish('From B',{BestBait:'M!B',BaitMoochType:'M!B',BaitMooch:'4 - 5'});
  assert.equal(api.recommend([target,row]).get(target).hints.unknown,true,'unmeasured alternate mooch is not assumed to have an exact window');
});
