const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('../ocean-fishing/node_modules/jsdom');
const script = fs.readFileSync(require.resolve('../select-options.js'), 'utf8');
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
function open() {
  const dom = new JSDOM(`<form><label>수집 상태<select data-radio-options id="status" name="status"><option value="all">전체</option><option value="missing">미수집</option><option value="owned">수집</option></select></label><label>지역<select id="region"><option>전체</option><option>신생</option><option>창천</option></select></label><select data-radio-options id="large">${[1,2,3,4,5].map(n=>`<option>${n}</option>`).join('')}</select><button type="reset">초기화</button></form>`, { url: 'https://example.test/ffxiv/', runScripts: 'outside-only' });
  dom.window.eval(script);
  return dom;
}
test('only fixed lists of at most four items become radio groups; dynamic lists stay dropdowns', async () => {
  const dom = open(), d = dom.window.document;
  try {
    await tick();
    assert.equal(d.querySelectorAll('[role="radiogroup"]').length, 1);
    assert.equal(d.querySelector('[role="radiogroup"]').getAttribute('aria-label'), '수집 상태');
    assert.equal(d.querySelector('#region').classList.contains('select-options-native'), false);
    d.querySelector('#region').innerHTML = '<option>전체</option><option>동적인 지역</option>';
    await tick();
    assert.equal(d.querySelector('#region').classList.contains('select-options-native'), false);
    assert.equal(d.querySelector('#large').classList.contains('select-options-native'), false);
  } finally { dom.window.close(); }
});
test('radio clicks retain the native value, form submission and existing change handlers', async () => {
  const dom = open(), w = dom.window, d = w.document, changes = [];
  try {
    d.querySelector('#status').addEventListener('change', event => changes.push(event.target.value));
    d.querySelectorAll('[role="radio"]')[1].click(); await tick();
    assert.deepEqual(changes, ['missing']);
    assert.equal(d.querySelector('#status').value, 'missing');
    assert.equal(new w.FormData(d.querySelector('form')).get('status'), 'missing');
    assert.equal(d.querySelector('[aria-checked="true"]').textContent, '미수집');
    d.querySelector('button[type="reset"]').click(); await tick();
    assert.equal(d.querySelector('[aria-checked="true"]').textContent, '전체');
    d.querySelector('#status').value = 'owned';
    d.querySelector('#status').dispatchEvent(new w.Event('change', { bubbles: true })); await tick();
    assert.equal(d.querySelector('[aria-checked="true"]').textContent, '수집');
  } finally { dom.window.close(); }
});
test('keyboard selection skips disabled items, uses one Tab stop and follows programmatic reset', async () => {
  const dom = open(), w = dom.window, d = w.document;
  try {
    d.querySelector('#status').options[1].disabled = true; await tick();
    const buttons = [...d.querySelectorAll('[role="radio"]')]; buttons[0].focus();
    buttons[0].dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); await tick();
    assert.equal(d.querySelector('#status').value, 'owned');
    assert.equal(d.activeElement, buttons[2]);
    assert.equal(buttons.filter(button => button.tabIndex === 0).length, 1);
    // Apps reset select values, then render results without a native change event.
    d.querySelector('#status').value = 'all'; d.body.append(d.createElement('p')); await tick();
    assert.equal(buttons[0].getAttribute('aria-checked'), 'true');
    d.querySelector('#status').disabled = true; await tick();
    assert.ok(buttons.every(button => button.disabled));
  } finally { dom.window.close(); }
});
test('fixed controls mounted later are enhanced and replacements leave no stale radio groups', async () => {
  const dom = open(), d = dom.window.document;
  try {
    const panel = d.createElement('section'); d.body.append(panel);
    panel.innerHTML = '<label>역할<select data-radio-options id="role"><option>딜</option><option>힐</option><option>탱</option></select></label>';
    await tick(); assert.equal(panel.querySelectorAll('[role="radio"]').length, 3);
    panel.innerHTML = '<label>역할<select data-radio-options id="role"><option>딜</option><option>힐</option></select></label>';
    await tick(); assert.equal(panel.querySelectorAll('[role="radiogroup"]').length, 1); assert.equal(panel.querySelectorAll('[role="radio"]').length, 2);
    panel.querySelector('select').hidden = true; await tick(); assert.equal(panel.querySelector('[role="radiogroup"]').hidden, true);
  } finally { dom.window.close(); }
});
