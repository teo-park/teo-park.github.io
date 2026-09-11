// Keep every guide readable without JavaScript; enhance purpose links into panels.
(() => {
  const links = [...document.querySelectorAll('.guide-tabs a')];
  const panels = [...document.querySelectorAll('.guide-panel')];
  function selectFromHash() {
    const target = document.getElementById(location.hash.slice(1));
    const panel = target?.closest('.guide-panel') || panels[0];
    for (const section of panels) section.hidden = section !== panel;
    for (const link of links) {
      if (link.hash === `#${panel.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  for (const link of links) link.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    selectFromHash();
  });
  window.addEventListener('hashchange', selectFromHash);
  selectFromHash();
})();
