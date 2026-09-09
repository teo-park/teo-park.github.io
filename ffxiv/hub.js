(function(){
  'use strict';
  const search=document.getElementById('toolSearch'),clear=document.getElementById('clearToolSearch'),list=document.getElementById('toolList');
  const buttons=[...document.querySelectorAll('[data-category]')],groups=[...document.querySelectorAll('[data-tool-group]')],cards=[...list.querySelectorAll('.tool-link')];
  const initials=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
  const normalize=text=>text.normalize('NFKC').toLocaleLowerCase('ko').replace(/\s+/g,'');
  const initialText=text=>[...text].map(c=>{const n=c.charCodeAt(0)-0xac00;return n>=0&&n<11172?initials[Math.floor(n/588)]:c;}).join('');
  const terms=new Map(cards.map(card=>{const text=card.textContent+' '+card.dataset.keywords;return [card,{text:normalize(text),initials:normalize(initialText(text))}];}));
  let category='all';
  function render(){
    const query=normalize(search.value);let count=0;
    for(const card of cards){const term=terms.get(card);card.hidden=!(category==='all'||card.dataset.group===category)||!!query&&!term.text.includes(query)&&!term.initials.includes(query);if(!card.hidden)count++;}
    for(const group of groups)group.hidden=![...group.querySelectorAll('.tool-link')].some(card=>!card.hidden);
    for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset.category===category));
    clear.hidden=!search.value;
    document.getElementById('noTools').hidden=count>0;
    const status=document.getElementById('searchStatus');status.hidden=category==='all'&&!search.value;status.textContent=`${count}개 도구`;
  }
  // Input events include the character currently being composed by a Korean IME.
  search.addEventListener('input',render);search.addEventListener('compositionend',render);
  search.addEventListener('keydown',event=>{if(event.key==='Escape'&&!event.isComposing){search.value='';render();}});
  clear.addEventListener('click',()=>{search.value='';render();search.focus();});
  for(const button of buttons)button.addEventListener('click',()=>{category=button.dataset.category;render();});
  document.getElementById('resetToolFilters').addEventListener('click',()=>{category='all';search.value='';render();search.focus();});
  document.getElementById('toolControls').hidden=false;render();
})();
