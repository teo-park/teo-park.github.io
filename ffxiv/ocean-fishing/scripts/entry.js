// Compatibility for old bookmarks and cached entry pages. The journal is public;
// this script never reads or changes entry sessions or fishing collection data.
(() => {
  const html=document.documentElement;
  html.removeAttribute('data-entry-locked');
  const routes=['indigo','ruby','checklist'];
  const next=new URLSearchParams(location.search).get('next');
  if(html.hasAttribute('data-entry-page')||(html.hasAttribute('data-journal-home')&&routes.includes(next))){
    location.replace(new URL((routes.includes(next)?next:'indigo')+'/',location.href).href);
  }
})();
