// Keep every guide readable without JavaScript; enhance purpose links into panels.
(() => {
  const links = [...document.querySelectorAll('.guide-tabs a')];
  const shortcuts = [...document.querySelectorAll('.guide-shortcuts a')];
  const panels = [...document.querySelectorAll('.guide-panel')];
  function selectFromHash() {
    const target = document.getElementById(location.hash.slice(1));
    const panel = target?.closest('.guide-panel') || panels[0];
    for (const section of panels) section.hidden = section !== panel;
    for (const link of links) {
      if (link.hash === `#${panel.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    for (const link of shortcuts) {
      if (link.hash === location.hash) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  for (const link of document.querySelectorAll('main a[href^="#"]')) link.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target?.closest('.guide-panel')) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    selectFromHash();
    if (!links.includes(link)) {
      target.tabIndex = -1;
      target.focus({preventScroll: true});
      target.scrollIntoView({block: 'start'});
    }
  });
  window.addEventListener('hashchange', selectFromHash);
  selectFromHash();
})();
