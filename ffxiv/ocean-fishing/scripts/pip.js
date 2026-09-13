(() => {
  'use strict';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const remaining=ms=>{const s=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?`${h}시간 ${m}분`:m?`${m}분 ${s%60}초`:`${s}초`;};
  function mount({getView,setStop,changeCatch,undoCatch,openMain,notifications}) {
    const buttons=[...document.querySelectorAll('[data-open-ocean-pip]')],hint=document.getElementById('oceanPipHint');
    if(!buttons.length)return;
    let child=null,opening=false,interval=null,phase='all',view=null,signature='',context='';
    const isOpen=()=>!!child&&!child.closed;
    if(!window.isSecureContext||!window.documentPictureInPicture?.requestWindow){
      buttons.forEach(b=>b.disabled=true);hint.textContent='PiP는 PC Chrome·Edge 등 지원 브라우저에서 사용할 수 있어요.';return {isOpen,update(){}};
    }
    buttons.forEach(b=>b.disabled=false);
    const $=id=>child.document.getElementById(id);
    function notificationState(){
      if(!isOpen())return;
      const state=notifications?.state()||{enabled:false,busy:false,supported:false,message:'알림 기능을 사용할 수 없어요.'};
      const toggle=$('oceanPipNotifications');if(!toggle)return;
      toggle.disabled=state.busy||!state.supported;toggle.setAttribute('aria-checked',String(state.enabled));
      toggle.textContent=state.busy?'알림 설정 중…':'정시 알림 '+(state.enabled?'ON':'OFF');
      $('oceanPipNotificationStatus').textContent=state.message;
    }
    function card(f){
      return `<article class="ocean-pip-fish${f.caught?' is-caught':''}" data-pip-entry="${esc(f.entryId)}"><div class="ocean-pip-fish-head"><img src="${esc(f.image)}" alt="" width="28" height="28"><strong>${esc(f.name)}</strong><label class="ocean-pip-catch"><input type="checkbox" data-pip-catch="${esc(f.entryId)}" aria-label="${esc(f.name)} 수집" ${f.caught?'checked':''}><span>수집</span></label></div><div class="ocean-pip-cast"><p class="ocean-pip-bait">${esc(f.bait)}</p><div class="ocean-pip-bite"><strong class="bite bite-${f.bite.length}">${esc(f.bite||'?')}</strong><span>${esc(f.hookset)}</span><span>${esc(f.baitTime)}</span></div></div><div class="ocean-pip-meta"><div class="ocean-pip-tags">${f.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><p class="ocean-pip-weather">${esc(f.weather)}</p></div>${f.conditions}<div class="ocean-pip-points"><span>기본 <b>${esc(f.points)}</b></span><span>이중 <b>${esc(f.double)}</b></span><span>삼중 <b>${esc(f.triple)}</b></span></div>${f.recommendation}${f.comparison?`<details class="ocean-pip-comparison"><summary>같은 입질 비교</summary>${f.comparison}</details>`:''}</article>`;
    }
    function clock(){
      if(!isOpen()||!view)return;const now=Date.now(),until=view.start-now,end=view.start+15*60000;
      $('oceanPipClock').textContent=until>0?'접수까지 '+remaining(until):now<end?'접수 중 · '+remaining(end-now)+' 남음':'접수 종료 · 선택한 항로';
      notifications?.check();
    }
    function paint(){
      if(!isOpen()||!view)return;
      $('oceanPipTitle').textContent=view.title;
      $('oceanPipDeparture').textContent=view.departure;
      $('oceanPipPurpose').textContent=view.purpose;
      $('oceanPipMessage').textContent=view.message||'';$('oceanPipUndo').hidden=!view.canUndo;
      $('oceanPipStops').innerHTML=view.stops.map((s,i)=>`<button type="button" role="tab" id="oceanPipStop${i}" data-pip-stop="${i}" aria-controls="oceanPipList" aria-selected="${i===view.activeStop}" tabindex="${i===view.activeStop?0:-1}"><small>${i+1}구간 · ${esc(s.time)}</small><span>${esc(s.name)}</span></button>`).join('');
      $('oceanPipList').setAttribute('aria-labelledby','oceanPipStop'+view.activeStop);
      for(const b of child.document.querySelectorAll('[data-pip-phase]'))b.setAttribute('aria-pressed',String(b.dataset.pipPhase===phase));
      const stop=view.stops[view.activeStop];
      $('oceanPipStarter').innerHTML=stop.starter||'';
      const zones=stop.zones.filter(z=>phase==='all'||z.key===phase),nextContext=view.start+':'+view.activeStop+':'+phase,nextSignature=JSON.stringify(zones);
      if(signature!==nextSignature||context!==nextContext){
        const list=$('oceanPipList'),scroll=list.scrollTop,focused=child.document.activeElement?.dataset.pipCatch;
        const open=[...list.querySelectorAll('[data-pip-entry]')].flatMap(row=>[...row.querySelectorAll('details')].flatMap((d,i)=>d.open?[row.dataset.pipEntry+':'+i]:[]));
        list.innerHTML=zones.map(z=>`<section class="ocean-pip-zone${z.key==='spectral'?' spectral':''}"><h2>${z.label} <small>${z.rows.length}종</small></h2>${z.baits}${z.rows.map(card).join('')||'<p class="ocean-pip-empty">현재 목적·필터에 맞는 물고기가 없어요.</p>'}</section>`).join('');
        if(context===nextContext){
          for(const row of list.querySelectorAll('[data-pip-entry]'))[...row.querySelectorAll('details')].forEach((d,i)=>d.open=open.includes(row.dataset.pipEntry+':'+i));
          list.scrollTop=scroll;
          if(focused){const target=[...list.querySelectorAll('[data-pip-catch]')].find(b=>b.dataset.pipCatch===focused);(target||list).focus({preventScroll:true});}
        }else list.scrollTop=0;
        signature=nextSignature;context=nextContext;
      }
      clock();
    }
    function update(){if(isOpen()){view=getView();paint();notificationState();}}
    function cleanup(closed){
      if(child!==closed)return;closed.clearInterval(interval);interval=null;child=null;view=null;signature='';context='';
      for(const b of buttons){b.setAttribute('aria-pressed','false');b.textContent='PiP 작은 창';}
      hint.textContent='작은 창을 닫았어요. 선택한 항로와 수집 기록은 유지됩니다.';
    }
    async function open(){
      if(opening)return;if(isOpen()){child.focus();return;}opening=true;buttons.forEach(b=>b.disabled=true);
      try{
        child=await window.documentPictureInPicture.requestWindow({width:560,height:720});const opened=child,d=child.document;phase='all';
        d.documentElement.lang='ko';d.title=getView().title+' · 먼바다 PiP';
        const base=d.createElement('base');base.href=new URL('./',location.href).href;d.head.append(base);
        for(const path of ['../../theme.css?v=20260909-line1','../css/app.css?v=20260913-departure-alerts','../css/pip.css?v=20260913-departure-alerts']){const link=d.createElement('link');link.rel='stylesheet';link.href=new URL(path,location.href).href;d.head.append(link);}
        d.body.className='ocean-pip-body';
        d.body.innerHTML='<main class="ocean-pip"><header class="ocean-pip-header"><div><h1 id="oceanPipTitle"></h1><button id="oceanPipMain" type="button">본 페이지 ↗</button></div><p><span id="oceanPipDeparture"></span><strong id="oceanPipClock"></strong></p><p id="oceanPipPurpose"></p></header><div id="oceanPipStops" class="ocean-pip-stops" role="tablist" aria-label="항로의 세 구간"></div><div class="ocean-pip-phase" role="group" aria-label="일반·환해류 보기"><button type="button" data-pip-phase="all">모두</button><button type="button" data-pip-phase="regular">일반</button><button type="button" data-pip-phase="spectral">환해류</button></div><div id="oceanPipStarter"></div><div id="oceanPipList" role="tabpanel" tabindex="0"></div><div class="ocean-pip-status"><span id="oceanPipMessage" role="status"></span><button type="button" id="oceanPipUndo" hidden>실행 취소</button></div><footer>목적·필터는 본 페이지와 연동됩니다. 실제 구간·환해류는 직접 선택하세요. 본 페이지를 열어 두세요.</footer></main>';
        opened.addEventListener('pagehide',()=>cleanup(opened),{once:true});
        d.addEventListener('click',event=>{
          const p=event.target.closest('[data-pip-phase]');if(p){phase=p.dataset.pipPhase;paint();return;}
          const s=event.target.closest('[data-pip-stop]');if(s){setStop(+s.dataset.pipStop);$('oceanPipStop'+s.dataset.pipStop).focus();}
        });
        d.addEventListener('change',event=>{const el=event.target;if(el.matches('[data-pip-catch]')){changeCatch(el.dataset.pipCatch,el.checked);update();}});
        $('oceanPipStops').addEventListener('keydown',event=>{
          if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();
          const next=event.key==='Home'?0:event.key==='End'?2:(view.activeStop+(event.key==='ArrowRight'?1:2))%3;setStop(next);$('oceanPipStop'+next).focus();
        });
        $('oceanPipMain').onclick=()=>{window.focus();openMain();};
        $('oceanPipUndo').onclick=()=>{undoCatch();update();};
        const controls=d.createElement('div');controls.className='ocean-pip-alerts';
        controls.innerHTML='<button id="oceanPipNotifications" class="departure-alert-toggle" type="button" role="switch" aria-checked="false" aria-label="먼바다 정시 알림">정시 알림 OFF</button><details><summary>알림 안내</summary><p id="oceanPipNotificationStatus" role="status"></p><p>KST 홀수 시 정각 · 근해·원양 공통. 페이지를 열어 둔 동안만 알립니다. 절전·브라우저 상태에 따라 늦어질 수 있어요.</p></details>';
        d.querySelector('.ocean-pip-header').append(controls);
        $('oceanPipNotifications').onclick=()=>notifications?.state().enabled?notifications.disable():notifications?.enable();
        update();interval=opened.setInterval(clock,1000);
        for(const b of buttons){b.setAttribute('aria-pressed','true');b.textContent='PiP 창으로 이동';}
        hint.textContent='PiP에서 구간·환해류 전환과 수집 체크를 할 수 있어요. 본 페이지는 열어 두세요.';
      }catch{
        if(child){const failed=child;failed.close();cleanup(failed);}
        hint.textContent='작은 창을 열지 못했어요. PC Chrome·Edge에서 다시 눌러 주세요.';
      }finally{opening=false;buttons.forEach(b=>b.disabled=false);}
    }
    for(const b of buttons)b.addEventListener('click',open);
    document.addEventListener('ocean-notifications-changed',notificationState);
    window.addEventListener('pagehide',()=>{if(child){const opened=child;opened.close();cleanup(opened);}});
    return {isOpen,update};
  }
  window.OceanPip={mount};
})();
