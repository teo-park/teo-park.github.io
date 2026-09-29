const test = require('node:test');
const assert = require('node:assert/strict');
const Q = require('../quick-input.js');

test('short suit and honor text becomes tile IDs', () => {
  const { tiles, error } = Q.parse({ man: '111345', pin: '1123', sou: '55', honors: 'ㄷ백' });
  assert.equal(error, null);
  assert.deepEqual(tiles, [0, 0, 0, 2, 3, 4, 9, 9, 10, 11, 22, 22, 27, 31]);
});

test('Korean wind initials, full names, and tile characters are equivalent', () => {
  const initial = Q.parse({ honors: 'ㄷㄴㅅㅂ백발중' });
  const names = Q.parse({ honors: '동남서북白發中' });
  const numeric = Q.parse({ honors: '1234567' });
  assert.equal(initial.error, null);
  assert.deepEqual(initial.tiles, [27, 28, 29, 30, 31, 32, 33]);
  assert.deepEqual(names.tiles, initial.tiles);
  assert.deepEqual(numeric.tiles, initial.tiles);
  assert.equal(Q.parse({ honors: '5567' }).tiles.join(','), '31,31,32,33');
  assert.equal(Q.formatNotation(Q.parse({ man: '123', pin: '123', sou: '123', honors: '5567' }).tiles), '123m123p123s5567z');
  assert.deepEqual(Q.parse(Q.format(initial.tiles)).tiles, initial.tiles);
});

test('invalid characters and impossible tile counts show a useful error', () => {
  assert.equal(Q.parse({ man: '120' }).error.field, 'man');
  assert.equal(Q.parse({ honors: 'ㅈ' }).error.field, 'honors');
  assert.match(Q.parse({ honors: 'ㅂㅂㅂㅂㅂ' }).error.message, /네 장/);
  assert.match(Q.parse({ man: '1111', pin: '2222', sou: '3333', honors: 'ㄷㄷㄷ' }).error.message, /14장/);
});

test('one-line Korean suffix notation and mpsz notation select the same tiles', () => {
  const korean = Q.parseCompact('123ㅁ 123ㅌ 123ㅅ 5567ㅈ');
  const english = Q.parseCompact('123m123p123s5567z');
  const prefixed = Q.parseCompact('ㅁ123 ㅌ123 ㅅ123 ㅈ5567');
  assert.equal(korean.error, null);
  assert.equal(korean.pending, false);
  assert.deepEqual(korean.tiles, english.tiles);
  assert.deepEqual(korean.tiles, prefixed.tiles);
  assert.equal(Q.formatCompact(korean.tiles), '123ㅁ 123ㅌ 123ㅅ 5567ㅈ');
});

test('an unfinished one-line group waits for its suffix', () => {
  const unfinished = Q.parseCompact('123ㅁ45');
  assert.equal(unfinished.error, null);
  assert.equal(unfinished.pending, true);
  assert.deepEqual(unfinished.tiles, [0, 1, 2]);
  assert.equal(Q.parseCompact('123ㅁ45ㅌ').pending, false);
  assert.equal(Q.parseCompact('123ㅁ0ㅌ').error.field, 'compact');
  assert.match(Q.parseCompact('11111ㅁ').error.message, /네 장/);
  assert.match(Q.parseCompact('1111ㅁ2222ㅌ3333ㅅ555ㅈ').error.message, /14장/);
});
