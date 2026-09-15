(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else if(document.currentScript&&location.origin==='https://teo-park.github.io'){
    api.start(window,new URL('visitor-counter-config.json?v=20260915-selection1',document.currentScript.src).href);
  }
})(typeof window==='object'?window:null,function(){
  'use strict';
  const preference='ffxiv-usage-stats-disabled';
  const prefix='ffxiv-selection-v1:';
  const routes={
    'msq-tracker':['quest','[data-quest]','data-quest'],
    'triple-triad':['card','[data-open]','data-open'],
    'minions':['minion','[data-detail]','data-detail'],
    'blue-mage':['spell','[data-detail]','data-detail'],
    'beastmaster':['beast','[data-detail]','data-detail'],
    'fishing-log':['fish','[data-fish-detail],[data-plan-detail],[data-catalog-detail]',null],
    'ocean-fishing__checklist':['fish','[data-fish-departures]','data-fish-departures'],
  };
  function ownerExcluded(w){try{return w.localStorage.getItem('ffxiv-counter-owner-excluded')==='true';}catch{return false;}}
  function enabled(w){try{return w.navigator.doNotTrack!=='1'&&!w.navigator.globalPrivacyControl&&!ownerExcluded(w)&&w.localStorage.getItem(preference)!=='true';}catch{return false;}}
  function candidate(page,event){
    const target=event.target;
    if(!target?.closest||target.closest('[disabled],[aria-disabled="true"]'))return null;
    if(event.type==='keydown'){
      // MSQ handles Enter itself rather than synthesizing a click.
      if(page!=='msq-tracker'||event.key!=='Enter'||event.isComposing||target.id!=='questSearch')return null;
      const first=target.ownerDocument.querySelector('#searchResults button[data-quest]');
      return first?{kind:'quest',id:first.dataset.quest}:null;
    }
    if(event.type!=='click')return null;
    if(page==='duty-finder'){
      const link=target.closest('#searchResults a.guide-link');if(!link)return null;
      const url=new URL(link.href),match=url.pathname.match(/^\/lodestone\/db\/duty\/([a-z0-9]+)$/);
      return url.origin==='https://guide.ff14.co.kr'&&match?{kind:'duty',id:match[1]}:null;
    }
    const rule=routes[page];if(!rule)return null;
    const control=target.closest(rule[1]);if(!control)return null;
    // Capture before the app toggles aria-expanded; closing is not a selection.
    if(control.getAttribute('aria-expanded')==='true')return null;
    const attribute=rule[2]||['data-fish-detail','data-plan-detail','data-catalog-detail'].find(a=>control.hasAttribute(a));
    return {kind:rule[0],id:control.getAttribute(attribute),ocean:attribute==='data-fish-departures'};
  }
  async function request(w,url,options={}){
    const controller=new w.AbortController(),timeout=w.setTimeout(()=>controller.abort(),8000);
    try{const r=await w.fetch(url,{credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store',...options,signal:controller.signal});if(!r.ok)throw Error('Statistics unavailable');return await r.json();}finally{w.clearTimeout(timeout);}
  }
  function notice(w){
    const host=w.document.querySelector('footer');if(!host||host.querySelector('[data-usage-notice]'))return;
    const details=w.document.createElement('details');details.setAttribute('data-usage-notice','');details.className='usage-notice';
    const summary=w.document.createElement('summary');summary.textContent='이용 통계 안내';
    const p=w.document.createElement('p');p.textContent='조회 수와 직접 선택한 게임 항목 ID를 집계합니다. 검색어·수집 기록·사용자 식별자는 보내지 않습니다. 같은 항목은 이 브라우저에서 30분에 한 번 집계하며, 통계는 관리자만 확인합니다. 전송에는 Google Firebase를 사용합니다.';
    const button=w.document.createElement('button');button.type='button';
    const sync=()=>{const owner=ownerExcluded(w),privacy=w.navigator.doNotTrack==='1'||w.navigator.globalPrivacyControl;button.textContent=owner?'관리자 브라우저 · 집계 제외':privacy?'브라우저 개인정보 보호 설정으로 집계 꺼짐':enabled(w)?'이 브라우저에서 집계 끄기':'이 브라우저에서 집계 켜기';button.disabled=owner||!!privacy;};
    button.addEventListener('click',()=>{try{w.localStorage.setItem(preference,enabled(w)?'true':'false');sync();}catch{button.textContent='브라우저 저장 설정으로 집계 꺼짐';button.disabled=true;}});
    w.addEventListener('storage',sync);sync();details.append(summary,p,button);host.append(details);
  }
  function start(w,configUrl){
    if(w.__ffxivSelectionStarted)return;w.__ffxivSelectionStarted=true;
    if(w.location.origin!=='https://teo-park.github.io'||w.location.pathname.includes('/counter-admin/'))return;
    const page=w.location.pathname.replace(/^\/ffxiv\//,'').replace(/index\.html$/,'').replace(/\/$/,'').replaceAll('/','__');
    notice(w);
    let metadata;
    const load=()=>metadata||(metadata=Promise.all([request(w,configUrl),request(w,new URL('selection-catalog.json?v=20260915-selection1',configUrl).href)]));
    async function handle(event){
      // Ignore scripted clicks, typing, restored state, refreshes, and collection toggles.
      if(!event.isTrusted||!enabled(w)||w.document.visibilityState==='hidden')return;
      const selected=candidate(page,event);if(!selected)return;
      try{
        const [config,catalog]=await load();
        if(!config.origins.includes(w.location.origin)||!config.databaseUrl)return;
        const id=selected.ocean?catalog.oceanEntries[selected.id]:String(selected.id);
        if(!Object.hasOwn(catalog.groups[selected.kind]?.names||{},id))return;
        const key=prefix+selected.kind+':'+id;
        const record=async()=>{
          if(!enabled(w))return;
          const now=Date.now(),last=Number(w.localStorage.getItem(key));
          if(last>0&&last<=now&&now-last<config.intervalMs)return;
          // Reserve before sending; do not retry ambiguous failures or assign a visitor ID.
          w.localStorage.setItem(key,String(now));
          const eventId=Array.from(w.crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');
          await request(w,config.databaseUrl.replace(/\/$/,'')+'/selections/'+selected.kind+'/'+id+'/'+eventId+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:'true'});
        };
        if(w.navigator.locks)await w.navigator.locks.request(key,record);else await record();
      }catch{/* Statistics must never interrupt the tool. */}
    }
    w.document.addEventListener('click',handle,true);
    w.document.addEventListener('keydown',handle,true);
    return {handle};
  }
  return {candidate,enabled,start};
});
