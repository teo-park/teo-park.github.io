(function () {
  'use strict';
  const controls = new Map();
  let queued = false;
  function attribute(el, name, value) {
    if (el.getAttribute(name) !== String(value)) el.setAttribute(name, String(value));
  }
  function nameOf(select) {
    if (select.getAttribute('aria-label')) return select.getAttribute('aria-label');
    return [...(select.labels || [])].map(label => {
      const copy = label.cloneNode(true);
      copy.querySelectorAll('select,.select-options').forEach(el => el.remove());
      return copy.textContent.replace(/\s+/g, ' ').trim();
    }).filter(Boolean).join(' · ') || '선택';
  }
  function choose(select, index, focus = false) {
    const entry = controls.get(select), button = entry?.buttons[index];
    if (!button || button.disabled) return;
    if (focus) button.focus();
    if (select.selectedIndex !== index) {
      select.selectedIndex = index;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    syncAll();
  }
  function create(select) {
    const group = document.createElement('span');
    group.className = 'select-options';
    group.setAttribute('role', 'radiogroup');
    if (select.id) group.dataset.selectId = select.id;
    select.after(group);
    select.classList.add('select-options-native');
    const entry = { group, buttons: [], signature: '' };
    controls.set(select, entry);
    group.addEventListener('click', event => {
      const button = event.target.closest('button[role="radio"]');
      if (!button || !group.contains(button)) return;
      // These controls can live inside the select's original wrapping label.
      event.preventDefault();
      choose(select, entry.buttons.indexOf(button));
    });
    group.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      const enabled = entry.buttons.filter(button => !button.disabled && !button.hidden);
      const current = enabled.indexOf(event.target);
      if (current < 0 || !enabled.length) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1 : (current + (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1) + enabled.length) % enabled.length;
      choose(select, entry.buttons.indexOf(enabled[next]), true);
    });
    entry.invalid = event => {
      event.preventDefault();
      attribute(group, 'aria-invalid', 'true');
      group.title = select.validationMessage;
      entry.buttons.find(button => !button.disabled && !button.hidden)?.focus();
    };
    select.addEventListener('invalid', entry.invalid);
    return entry;
  }
  function remove(select, entry) {
    const focused = entry.group.contains(document.activeElement);
    entry.group.remove();
    select.classList.remove('select-options-native');
    select.removeEventListener('invalid', entry.invalid);
    controls.delete(select);
    if (focused && select.isConnected) select.focus({ preventScroll: true });
  }
  function sync(select) {
    const options = [...select.options];
    if (select.multiple || select.size > 1 || options.length < 1 || options.length > 4) {
      if (controls.has(select)) remove(select, controls.get(select));
      return;
    }
    const entry = controls.get(select) || create(select), { group } = entry;
    if (group.previousElementSibling !== select) select.after(group);
    group.hidden = select.hidden || select.style.display === 'none';
    const labelledBy = select.getAttribute('aria-labelledby');
    if (labelledBy) {
      attribute(group, 'aria-labelledby', labelledBy);
      group.removeAttribute('aria-label');
    } else {
      group.removeAttribute('aria-labelledby');
      attribute(group, 'aria-label', nameOf(select));
    }
    const description = select.getAttribute('aria-describedby');
    if (description) attribute(group, 'aria-describedby', description); else group.removeAttribute('aria-describedby');
    const signature = JSON.stringify(options.map(option => [option.value, option.label, option.hidden, option.parentElement.tagName === 'OPTGROUP' ? option.parentElement.label : '']));
    if (signature !== entry.signature) {
      const hadFocus = group.contains(document.activeElement);
      entry.signature = signature;
      entry.buttons = options.map(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'select-option';
        button.setAttribute('role', 'radio');
        const prefix = option.parentElement.tagName === 'OPTGROUP' ? option.parentElement.label + ' · ' : '';
        button.textContent = prefix + option.label;
        button.hidden = option.hidden;
        return button;
      });
      group.replaceChildren(...entry.buttons);
      if (hadFocus) entry.buttons[select.selectedIndex]?.focus({ preventScroll: true });
    }
    const disabled = select.matches(':disabled');
    entry.buttons.forEach((button, index) => {
      button.disabled = disabled || options[index].disabled || options[index].parentElement.disabled === true;
      attribute(button, 'aria-checked', index === select.selectedIndex);
    });
    const focusButton = entry.buttons.find((button, index) => index === select.selectedIndex && !button.disabled && !button.hidden) || entry.buttons.find(button => !button.disabled && !button.hidden);
    entry.buttons.forEach(button => { button.tabIndex = button === focusButton ? 0 : -1; });
    if (select.validity.valid) { group.removeAttribute('aria-invalid'); group.removeAttribute('title'); }
  }
  function syncAll() {
    queued = false;
    if (!window.document?.documentElement) return;
    for (const [select, entry] of controls) if (!select.isConnected || !select.hasAttribute('data-radio-options')) remove(select, entry);
    // Only explicitly marked, fixed choice lists use radios. Dynamic lists stay native.
    document.querySelectorAll('select[data-radio-options]').forEach(sync);
  }
  function schedule() {
    if (!queued) { queued = true; queueMicrotask(syncAll); }
  }
  const observer = new MutationObserver(records => {
    if (!window.document?.documentElement) return;
    if (records.some(record => {
      const el = record.target.nodeType === 1 ? record.target : record.target.parentElement;
      if (el?.closest('.select-options')) return false;
      return record.type !== 'attributes' || el?.matches('select,option,optgroup,fieldset');
    })) schedule();
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['disabled', 'hidden', 'style', 'selected', 'label', 'aria-label', 'aria-labelledby', 'aria-describedby', 'multiple', 'size'] });
  document.addEventListener('change', schedule);
  document.addEventListener('input', schedule);
  document.addEventListener('reset', schedule);
  document.addEventListener('focusin', schedule);
  window.addEventListener('pageshow', schedule);
  syncAll();
})();
