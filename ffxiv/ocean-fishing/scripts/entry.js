(() => {
  'use strict';
  // A client-side entrance screen, not server authentication or access control.
  const KEY = 'ocean:journal-entry:v1';
  const TOKEN = 'open-20260908';
  const DIGEST = 'c37b2b11e7914e10d51d827b3d68656e539b165e42c930cf0323f2530b3279df';
  const routes = ['indigo', 'ruby', 'checklist'];
  const isEntry = document.documentElement.hasAttribute('data-entry-page');
  const route = routes.find(name => location.pathname.includes('/' + name + '/')) || 'indigo';
  const base = new URL(isEntry ? './' : '../', location.href);
  const allowed = () => { try { return sessionStorage.getItem(KEY) === TOKEN; } catch { return false; } };
  const target = () => {
    const next = new URLSearchParams(location.search).get('next');
    return new URL((routes.includes(next) ? next : 'indigo') + '/', base).href;
  };
  function requireEntry() {
    if (allowed()) { document.documentElement.removeAttribute('data-entry-locked'); return; }
    document.documentElement.setAttribute('data-entry-locked', '');
    const entry = new URL(base); entry.searchParams.set('next', route);
    location.replace(entry.href);
  }
  if (!isEntry) {
    requireEntry();
    window.addEventListener('pageshow', requireEntry);
    window.addEventListener('pagehide', () => document.documentElement.setAttribute('data-entry-locked', ''));
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-lock-journal]').forEach(button => button.addEventListener('click', () => {
      try { sessionStorage.removeItem(KEY); } catch {}
      document.documentElement.setAttribute('data-entry-locked', '');
      const entry = new URL(base); entry.searchParams.set('next', route); location.replace(entry.href);
    }));
    const form = document.getElementById('entryForm');
    if (!form) return;
    if (allowed()) { location.replace(target()); return; }
    const field = document.getElementById('entryPassword');
    const status = document.getElementById('entryStatus');
    const submit = form.querySelector('button[type="submit"]');
    const reveal = document.getElementById('showPassword');
    reveal.addEventListener('change', () => { field.type = reveal.checked ? 'text' : 'password'; });
    field.addEventListener('input', () => { field.removeAttribute('aria-invalid'); status.textContent = ''; });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      submit.disabled = true;
      try {
        const bytes = new TextEncoder().encode(field.value.normalize('NFC').trim());
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        const hex = [...new Uint8Array(digest)].map(n => n.toString(16).padStart(2, '0')).join('');
        if (hex !== DIGEST) {
          status.textContent = '비밀번호가 맞지 않아요. 띄어쓰기까지 확인해 주세요.';
          field.setAttribute('aria-invalid', 'true'); field.focus(); field.select(); return;
        }
        try { sessionStorage.setItem(KEY, TOKEN); }
        catch { status.textContent = '이 브라우저에서 사이트 저장을 허용한 뒤 다시 입장해 주세요.'; return; }
        field.value = '';
        location.replace(target());
      } catch {
        status.textContent = '입장하지 못했어요. HTTPS 주소 또는 localhost에서 다시 열어 주세요.';
      } finally { submit.disabled = false; }
    });
  });
})();
