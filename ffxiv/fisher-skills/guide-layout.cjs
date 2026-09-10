const {guidePages}=require('../tools/site-navigation.cjs');
const version='20260910-guides1';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base=page=>page==='skills'?'./':'../';
function assets(page){return `<link rel="stylesheet" href="${base(page)}guide.css?v=${version}">`;}
function masthead(page,description){
  const current=page==='skills'?0:1,root=base(page);
  return `<header class="guide-masthead"><div><p class="eyebrow">어부 가이드</p><h1>${guidePages[current][1]}</h1><p>${esc(description)}</p></div><a class="planner-link" href="${root}../fishing-log/">낚시 계획·수집 도감 ↗</a></header>
<nav class="guide-tabs" aria-label="어부 가이드">${guidePages.map(([path,title],i)=>`<a href="${root}${path.slice('fisher-skills/'.length)}"${i===current?' aria-current="page"':''}>${title}</a>`).join('')}</nav>`;
}
function sidebar(title,items,extras=[],reveal=false){
  const link=({id,title},i,extra=false)=>`<a href="#${esc(id)}"${extra?' class="extra-nav"':''}${reveal?' data-related':''}>${extra?'':`<span>${String(i+1).padStart(2,'0')}</span>`}${esc(title)}</a>`;
  return `<aside class="guide-sidebar"><nav aria-label="${esc(title)} 목차"><p>${esc(title)}</p>${items.map((item,i)=>link(item,i)).join('')}${extras.map(item=>link(item,0,true)).join('')}</nav></aside>`;
}
module.exports={assets,masthead,sidebar,version};
