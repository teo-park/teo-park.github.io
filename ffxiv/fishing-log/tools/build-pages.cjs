const fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../../ocean-fishing/node_modules/jsdom');
const navigation=require('../../tools/site-navigation.cjs');
const root=path.resolve(__dirname,'..'),version='20260916-pages1';
// Both documents share asset URLs and detail/record dialogs, but only mount their own workspace.
for(const catalog of [false,true]){
 const dom=new JSDOM(fs.readFileSync(path.join(__dirname,'page-template.html'),'utf8')),d=dom.window.document;
 const $=s=>d.querySelector(s),page=catalog?'fishing-log/catalog/':'fishing-log/';
 d.body.dataset.fishingPage=catalog?'catalog':'forecast';
 if(catalog){const base=d.createElement('base');base.href='../';d.head.prepend(base);}
 d.title=`${catalog?'물고기 도감':'낚시 예보'} · 세계를 누비는 어부`;
 $('link[rel="canonical"]').href='https://teo-park.github.io/ffxiv/'+page;
 $('meta[property="og:url"]').content='https://teo-park.github.io/ffxiv/'+page;
 $('meta[property="og:title"]').content=d.title;
 const description=catalog?'어류·작살도감 수집 현황, 미끼·지역별 미수집 찾기와 캡처·Teamcraft 기록 관리.':'터주·일반 물고기의 시간·날씨별 낚시 예보, 접속 시간에 맞는 알림과 PIP.';
 $('meta[name="description"]').content=description;$('meta[property="og:description"]').content=description;
 $('.masthead > div').innerHTML=`<h1>세계를 누비는 어부 <span>${catalog?'물고기 도감':'낚시 예보'}</span></h1>`;
 $('.notebook-tabs').outerHTML=`<nav class="fishing-page-nav" aria-label="세계를 누비는 어부 페이지"><a id="showPlanner" href="./"${catalog?'':' aria-current="page"'}>낚시 예보</a><a id="showBook" href="catalog/"${catalog?' aria-current="page"':''}>물고기 도감</a></nav>`;
 $('.masthead').after($('.fishing-page-nav'));
 if(catalog){
  $('#fishingPlanner').remove();
  for(const a of d.querySelectorAll('a[href^="#"]'))a.setAttribute('href','catalog/'+a.getAttribute('href'));
 }else{
  $('.progress-strip').remove();$('#collectionPanel').remove();
  const heading=$('.planner-heading');$('.fishing-page-nav').append(heading.querySelector('.planner-actions'));heading.remove();
  $('.masthead').classList.add('forecast-masthead');$('.masthead h1 span').remove();
  $('.planner-actions').append($('#openRecords'));$('.masthead').append($('.fishing-page-nav'));
  for(const id of ['planToSpot','planToBait']){const button=$('#'+id),a=d.createElement('a');a.id=id;a.href='catalog/';a.textContent=button.textContent;button.replaceWith(a);}
  $('#planToOcean').outerHTML='<a id="planToOcean" href="../ocean-fishing/checklist/">먼바다 물고기 도감</a>';
  $('#fishingPlanner').setAttribute('aria-label','낚시 예보');$('#fishingPlanner').removeAttribute('aria-labelledby');
  const options=$('#planOptions');options.querySelector('summary').innerHTML='설정 <span>목적 · 접속 시간 · 알림</span>';
  options.querySelector('.plan-search-label').remove();
  const toolbar=d.createElement('div');toolbar.className='forecast-toolbar';
  toolbar.innerHTML='<label class="forecast-search">검색</label><span id="forecastState" class="forecast-state"></span>';
  toolbar.querySelector('label').append($('#planSearch'));toolbar.append($('#planRefresh'));
  $('#planActiveFilters').before(toolbar);
  const filters=d.createElement('div');filters.className='forecast-filters';$('.plan-catalog-filters').before(filters);
  for(const row of [$('.plan-catalog-filters'),$('.plan-filters')]){filters.append(...row.children);row.remove();}
  const settingsButton=d.createElement('button');settingsButton.type='button';settingsButton.id='togglePlanOptions';settingsButton.textContent='설정';settingsButton.setAttribute('aria-controls','planOptions');settingsButton.setAttribute('aria-expanded','false');
  $('.planner-actions').append(settingsButton);options.querySelector('summary').classList.add('visually-hidden');
  const info=d.createElement('div');info.className='forecast-info';info.append($('#planCount'),$('.plan-prep'),$('.plan-help'));$('.plan-results-scroll').before(info);
 }
 const css=d.createElement('link');css.rel='stylesheet';css.href='../fishing-pages.css?v=20260916-width1';d.head.append(css);
 for(const name of ['app.js','planner.js']){const s=$(`script[src^="./${name}?"]`);s.src='./'+name+'?v='+version;}
 $('[data-navigation]').outerHTML=navigation.header(page);
 for(const el of d.querySelectorAll('script[src],link[href]'))if(/\/(navigation|select-options|visitor-counter|selection-counter)\.(js|css)\?/.test(el.getAttribute('src')||el.getAttribute('href')))el.remove();
 d.head.insertAdjacentHTML('beforeend',navigation.assets(page));
 // The catalog base keeps all existing data/icon URLs relative to fishing-log/.
 fs.mkdirSync(path.join(root,catalog?'catalog':''),{recursive:true});
 fs.writeFileSync(path.join(root,catalog?'catalog/index.html':'index.html'),dom.serialize().replace(/[ \t]+$/gm,'')+'\n');dom.window.close();
}
