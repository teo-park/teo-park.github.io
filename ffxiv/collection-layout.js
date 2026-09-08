/* Presentation preferences are independent from each book's collection records. */
(function(){
  'use strict';
  function mount(doc=document){
    const win=doc.defaultView;
    for(const book of doc.querySelectorAll('[data-collection-book]')){
      if(book.dataset.layoutReady)continue;
      const controls=book.querySelector('[data-layout-controls]');if(!controls)continue;
      book.dataset.layoutReady='true';
      const key=`teo-ffxiv.collection-layout.${book.dataset.collectionBook}.v1`;
      const buttons=[...controls.querySelectorAll('[data-layout-choice]')];
      function apply(value,persist=false){
        const layout=value==='list'?'list':'grid';
        book.dataset.collectionLayout=layout;
        for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset.layoutChoice===layout));
        book.dispatchEvent(new win.CustomEvent('collectionlayoutchange',{detail:{layout}}));
        if(persist){try{win.localStorage.setItem(key,layout);}catch{/* The current view still works when storage is unavailable. */}}
      }
      let initial='grid';try{initial=win.localStorage.getItem(key);}catch{}
      apply(initial);
      controls.addEventListener('click',event=>{const button=event.target.closest('[data-layout-choice]');if(button&&controls.contains(button))apply(button.dataset.layoutChoice,true);});
      controls.addEventListener('keydown',event=>{
        if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
        const current=buttons.indexOf(event.target);if(current<0)return;
        event.preventDefault();const next=buttons[(current+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length];next.focus();apply(next.dataset.layoutChoice,true);
      });
      win.addEventListener('storage',event=>{if(event.key===key||event.key===null){try{apply(win.localStorage.getItem(key));}catch{}}});
    }
  }
  window.CollectionLayout={mount};
  mount();
})();
