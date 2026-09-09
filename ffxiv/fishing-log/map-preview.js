(function(){
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function point(coords,sizeFactor){
    // In-game coordinates already include world offsets. Convert to map-image %.
    const x=(coords?.x-1)*sizeFactor/41,y=(coords?.y-1)*sizeFactor/41;
    return Number.isFinite(x)&&Number.isFinite(y)&&sizeFactor>0&&x>=0&&x<=100&&y>=0&&y<=100?{x,y}:null;
  }
  function position(rect,width,height,viewportWidth,viewportHeight){
    const margin=12,gap=8,clamp=(n,min,max)=>Math.max(min,Math.min(n,max));
    let left,top;
    if(viewportWidth>=700&&rect.right+gap+width<=viewportWidth-margin){left=rect.right+gap;top=rect.top;}
    else if(viewportWidth>=700&&rect.left-gap-width>=margin){left=rect.left-gap-width;top=rect.top;}
    else{left=(rect.left+rect.right-width)/2;top=rect.bottom+gap;if(top+height>viewportHeight-margin)top=rect.top-gap-height;}
    return {left:clamp(left,margin,viewportWidth-width-margin),top:clamp(top,margin,viewportHeight-height-margin)};
  }
  function mount({data,maps=window.FISHING_MAPS?.maps||{}}){
    const doc=document,host=doc.getElementById('fishingPlanner'),results=doc.getElementById('planResults');
    if(!host||!results)return;
    const panel=doc.createElement('aside');panel.id='fishingSpotMap';panel.className='spot-map-preview';panel.hidden=true;
    panel.setAttribute('role','dialog');panel.setAttribute('aria-labelledby','spotMapTitle');panel.tabIndex=-1;doc.body.append(panel);
    let trigger=null,pinned=false,showTimer,hideTimer,restoring=false,anchorRect,pointerFocus=null;
    const find=target=>target?.closest?.('[data-spot-map]');
    const contains=target=>!!target&&(panel.contains(target)||!!trigger?.contains(target));
    function expanded(el,value){if(el?.matches('button'))el.setAttribute('aria-expanded',String(value));}
    function hide(restore=false){
      clearTimeout(showTimer);clearTimeout(hideTimer);const previous=trigger,hadFocus=panel.contains(doc.activeElement);
      expanded(trigger,false);trigger=null;pinned=false;panel.hidden=true;panel.replaceChildren();
      if(restore&&hadFocus&&previous?.isConnected){restoring=true;previous.focus({preventScroll:true});restoring=false;}
    }
    function place(){if(!trigger)return;anchorRect=trigger.getBoundingClientRect();const p=position(anchorRect,panel.offsetWidth,panel.offsetHeight,doc.documentElement.clientWidth||window.innerWidth,doc.documentElement.clientHeight||window.innerHeight);panel.style.left=p.left+'px';panel.style.top=p.top+'px';}
    function show(el,pin=false){
      clearTimeout(showTimer);clearTimeout(hideTimer);
      if(!el.isConnected||host.hidden)return;
      if(pinned&&!pin&&el!==trigger)return;
      if(trigger===el&&!panel.hidden){if(pin){pinned=true;panel.querySelector('[data-map-close]').focus({preventScroll:true});}return;}
      const spot=data.spots[el.dataset.spotMap];if(!spot)return;
      expanded(trigger,false);trigger=el;pinned=pin;expanded(trigger,true);
      const map=maps[spot.map],pinPoint=point(spot.coords,map?.sizeFactor);
      const url=`https://ffxivteamcraft.com/db/ko/${spot.kind==='spear'?'spearfishing-spot':'fishing-spot'}/${spot.id}`;
      const coords=Number.isFinite(spot.coords?.x)&&Number.isFinite(spot.coords?.y)?`X:${spot.coords.x.toFixed(1)} · Y:${spot.coords.y.toFixed(1)}`:'좌표 미확인';
      panel.innerHTML=`<div class="spot-map-heading"><div><span>${esc(spot.area)}</span><strong id="spotMapTitle">${esc(spot.name)}</strong></div><button type="button" data-map-close aria-label="낚시터 지도 닫기">×</button></div>
        <div class="spot-map-canvas" data-map-state="${pinPoint?'loading':'error'}">${pinPoint?`<img alt="${esc(spot.area)} 지도" width="1024" height="1024" decoding="async"><span class="spot-map-pin" role="img" aria-label="${esc(spot.name)} 위치 ${coords}" style="left:${pinPoint.x}%;top:${pinPoint.y}%"></span>`:''}<span class="spot-map-status" role="status">${pinPoint?'지도를 불러오는 중…':'지도 자료가 없어요. Teamcraft에서 확인해 주세요.'}</span></div>
        <div class="spot-map-tools"><strong>${coords}</strong><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">Teamcraft ↗</a></div><p class="spot-map-credit">지도 © SQUARE ENIX · XIVAPI<br>좌표: Teamcraft · 낚시터 대표 위치</p>`;
      const img=panel.querySelector('img'),canvas=panel.querySelector('.spot-map-canvas');
      if(img){
        img.onload=()=>{if(panel.querySelector('img')!==img)return;canvas.dataset.mapState='ready';canvas.querySelector('[role=status]').textContent='';};
        img.onerror=()=>{if(panel.querySelector('img')!==img)return;canvas.dataset.mapState='error';canvas.querySelector('[role=status]').textContent='지도를 불러오지 못했어요. 아래 좌표나 Teamcraft 링크를 이용해 주세요.';};
        img.src=map.image;
      }
      panel.hidden=false;place();if(pin)panel.querySelector('[data-map-close]').focus({preventScroll:true});
    }
    function scheduleHide(){clearTimeout(showTimer);clearTimeout(hideTimer);if(!pinned)hideTimer=setTimeout(()=>hide(),180);}
    doc.addEventListener('pointerover',event=>{
      if(event.pointerType==='touch')return;
      if(panel.contains(event.target)){clearTimeout(hideTimer);return;}
      const el=find(event.target);if(!el||el.contains(event.relatedTarget))return;
      clearTimeout(hideTimer);clearTimeout(showTimer);showTimer=setTimeout(()=>show(el),180);
    });
    doc.addEventListener('pointerout',event=>{
      const el=find(event.target);
      if((el&&!el.contains(event.relatedTarget))||(panel.contains(event.target)&&!panel.contains(event.relatedTarget))){
        if(!contains(event.relatedTarget))scheduleHide();
      }
    });
    doc.addEventListener('focusin',event=>{if(restoring)return;const el=find(event.target);if(el){if(el!==pointerFocus)show(el);}else if(panel.contains(event.target))clearTimeout(hideTimer);else if(!pinned)hide();});
    doc.addEventListener('focusout',event=>{if(contains(event.target)&&!contains(event.relatedTarget)&&!pinned)scheduleHide();});
    doc.addEventListener('click',event=>{
      pointerFocus=null;
      if(event.target.closest('[data-map-close]')){hide(true);return;}
      const el=find(event.target);
      if(el?.matches('button')){if(trigger===el&&pinned)hide();else show(el,true);return;}
      if(!panel.contains(event.target))hide();
    });
    doc.addEventListener('pointerdown',event=>{
      // Opening during pointer-induced focus can cover a touch target before
      // pointerup, cancelling its click. Click opens it after the gesture ends.
      pointerFocus=find(event.target);clearTimeout(showTimer);
      if(!panel.hidden&&!contains(event.target)&&!pointerFocus)hide();
    });
    doc.addEventListener('pointercancel',()=>{pointerFocus=null;});
    doc.addEventListener('keydown',event=>{
      pointerFocus=null;
      if(event.key==='Escape'&&!panel.hidden){event.preventDefault();event.stopPropagation();hide(true);}
      if(event.key==='ArrowDown'&&find(event.target)){event.preventDefault();show(find(event.target),true);}
    });
    window.addEventListener('scroll',event=>{
      if(!trigger||(event.target instanceof Node&&panel.contains(event.target)))return;
      if(pinned){place();return;}
      // Focus can queue a scroll event before the preview opens. Only dismiss
      // when scrolling actually moves its anchor from the measured position.
      const rect=trigger.getBoundingClientRect();
      if(Math.abs(rect.top-anchorRect.top)>1||Math.abs(rect.left-anchorRect.left)>1)hide();
    },true);
    window.addEventListener('resize',()=>{if(!panel.hidden)place();});
    doc.addEventListener('visibilitychange',()=>{if(doc.hidden)hide();});
    const observer=new MutationObserver(()=>{
      if(!trigger)return;
      if(host.hidden){hide();return;}
      if(!trigger.isConnected){
        // Forecasts fill in asynchronously and redraw the list. Keep the open
        // map if the same fish still uses the same spot in the refreshed row.
        const previous=trigger,replacement=[...results.querySelectorAll('[data-spot-map]')].find(el=>el.tagName===previous.tagName&&el.dataset.spotMap===previous.dataset.spotMap&&el.dataset.mapOwner===previous.dataset.mapOwner);
        if(!replacement){hide();return;}
        expanded(previous,false);trigger=replacement;expanded(trigger,true);place();
      }
    });
    observer.observe(results,{childList:true});observer.observe(host,{attributes:true,attributeFilter:['hidden']});
    return {hide};
  }
  window.FishingSpotMaps={point,position,mount};
})();
