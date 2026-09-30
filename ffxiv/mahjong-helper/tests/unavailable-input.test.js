const test = require('node:test');
const assert = require('node:assert/strict');
const U = require('../unavailable-input.js');

test('zero remaining notation accepts Korean and English suit suffixes', () => {
  assert.deepEqual(U.parse('1ㅁ 7ㅌ 5ㅈ').tiles, [0, 15, 31]);
  assert.deepEqual(U.parse('1m7p5z').tiles, [0, 15, 31]);
  assert.deepEqual(U.parse('11ㅁ,7ㅌ').tiles, [0, 15]);
  assert.equal(U.parse('123456789ㅁ123456789ㅌ').tiles.length, 18);
  assert.equal(U.format([31, 0, 15]), '1ㅁ 7ㅌ 5ㅈ');
});

test('incomplete suffix stays pending and invalid tile types report an error', () => {
  assert.equal(U.parse('1ㅁ 7').pending, true);
  assert.deepEqual(U.parse('1ㅁ 7').tiles, [0]);
  assert.ok(U.parse('8ㅈ').error);
  assert.ok(U.parse('1q').error);
});

test('zero remaining tile types can be entered separately by suit', () => {
  const values = { man: '15', pin: '7', sou: '39', honors: '5' };
  const parsed = U.parseFields(values);
  assert.equal(parsed.error, null);
  assert.deepEqual(parsed.tiles, [0, 4, 15, 20, 26, 31]);
  assert.deepEqual(U.formatFields(parsed.tiles), values);
  assert.deepEqual(U.parseFields({ man: '11' }).tiles, [0]);
  assert.ok(U.parseFields({ honors: '8' }).error);
});
