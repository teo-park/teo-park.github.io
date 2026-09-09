(function () {
  'use strict';
  const header = document.querySelector('[data-navigation]');
  if (!header) return;
  const groups = [...header.querySelectorAll('.nav-category')];
  function closeOthers(keep) {
    for (const group of groups) if (group !== keep) group.open = false;
  }
  for (const group of groups) {
    const summary = group.querySelector('summary');
    group.addEventListener('toggle', () => {
      summary.setAttribute('aria-expanded', String(group.open));
      if (group.open) closeOthers(group);
    });
    summary.setAttribute('aria-expanded', String(group.open));
    summary.addEventListener('click', () => closeOthers(group));
    group.addEventListener('keydown', event => {
      if (event.key === 'Escape' && group.open) {
        event.preventDefault();
        event.stopPropagation();
        group.open = false;
        summary.focus();
        return;
      }
      const links = [...group.querySelectorAll('a')];
      const index = links.indexOf(document.activeElement);
      const fromSummary = document.activeElement === summary;
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) || (!fromSummary && index < 0)) return;
      if (fromSummary && ['Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      closeOthers(group);
      group.open = true;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 : fromSummary ? (event.key === 'ArrowDown' ? 0 : links.length - 1) : (index + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links[next].focus();
    });
    group.addEventListener('focusout', event => {
      if (event.relatedTarget && !group.contains(event.relatedTarget)) group.open = false;
    });
  }
  document.addEventListener('click', event => {
    if (!groups.some(group => group.contains(event.target))) closeOthers();
  });
  // A restored page should not cover its content with a previously opened menu.
  window.addEventListener('pageshow', event => { if (event.persisted) closeOthers(); });
})();
