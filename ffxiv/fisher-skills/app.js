(function(){
  'use strict';
  const $=s=>document.querySelector(s),cards=[...document.querySelectorAll('.skill-card')],groups=[...document.querySelectorAll('[data-skill-group]')],search=$('#skillSearch');
  const initials=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
  const normalize=v=>v.normalize('NFC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
  const first=v=>[...v].map(c=>{const n=c.charCodeAt(0)-44032;return n>=0&&n<=11171?initials[Math.floor(n/588)]:c;}).join('');
  const texts=new Map(cards.map(c=>[c,{text:normalize(c.textContent),initials:normalize(first(c.textContent))}]));let category='all';
  function render(){const q=normalize(search.value);let count=0;for(const card of cards){const t=texts.get(card),show=(category==='all'||card.dataset.category===category)&&(!q||t.text.includes(q)||t.initials.includes(q));card.hidden=!show;if(show)count++;}for(const group of groups){const visible=group.querySelectorAll('.skill-card:not([hidden])').length;group.hidden=!visible;group.querySelector('.group-count').textContent=`${visible}개 설명`;}$('#skillCount').textContent=`${count}개 설명 · 전체 ${cards.length}개`;$('#noSkills').hidden=count>0;for(const b of document.querySelectorAll('[data-filter]'))b.setAttribute('aria-pressed',String(b.dataset.filter===category));}
  function revealHash(){const id=decodeURIComponent(location.hash.slice(1)),target=cards.find(c=>c.id===id);if(target?.hidden){category='all';search.value='';render();}if(target)target.scrollIntoView({block:'start'});}
  search.addEventListener('input',render);search.addEventListener('compositionend',render);
  $('#clearSearch').addEventListener('click',()=>{search.value='';render();search.focus();});
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;render();}));
  document.querySelectorAll('[data-related]').forEach(a=>a.addEventListener('click',()=>{category='all';search.value='';render();}));
  window.addEventListener('hashchange',revealHash);$('.skill-controls').hidden=false;revealHash();
})();
