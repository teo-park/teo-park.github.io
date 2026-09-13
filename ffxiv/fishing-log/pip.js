(function(){
  'use strict';
  const MINUTE=60000,VERSION='20260913-pip1';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stamp=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
  function remaining(ms){
    const seconds=Math.max(0,Math.ceil(ms/1000)),days=Math.floor(seconds/86400),hours=Math.floor(seconds%86400/3600),minutes=Math.floor(seconds%3600/60);
    return days?`${days}일 ${hours}시간`:hours?`${hours}시간 ${minutes}분`:minutes?`${minutes}분 ${seconds%60}초`:`${seconds}초`;
  }
  function partition(rows,now,horizon){
    const current=[],upcoming=[];let unresolved=0;
    for(const row of rows){
      if(row.preparationOnly||(!row.always&&(!Number.isFinite(row.start)||!Number.isFinite(row.end)))){unresolved++;continue;}
      if(row.always||row.start<=now&&now<row.end)current.push(row);
      else if(row.start>now&&(horizon===0||row.start-now<=horizon*MINUTE))upcoming.push(row);
    }
    current.sort((a,b)=>Number(a.always)-Number(b.always)||(a.end??Infinity)-(b.end??Infinity)||a.order-b.order);
    upcoming.sort((a,b)=>a.start-b.start||a.order-b.order);
    return {current,upcoming,unresolved};
  }
  function mount({getView,refresh,notifications,onOpen,onClose,openSettings,openFish}){
    const button=document.getElementById('openFishingPip'),hint=document.getElementById('fishingPipHint');
    if(!button)return;
    let pip=null,interval=null,opening=false,view=null,horizon=60,signature='';
    const isOpen=()=>!!pip&&!pip.closed;
    if(!window.isSecureContext||!window.documentPictureInPicture?.requestWindow){
      button.disabled=true;
      hint.textContent='PIP 작은 창은 PC Chrome·Edge 등 지원 브라우저에서 사용할 수 있어요.';
      return {isOpen,update(){}};
    }
    button.disabled=false;
    function notificationState(){
      if(!isOpen())return;
      const state=notifications?.state()||{enabled:false,busy:false,supported:false,message:'알림 기능을 사용할 수 없습니다.'};
      const toggle=pip.document.getElementById('pipNotifications');
      toggle.checked=state.enabled;toggle.disabled=state.busy||!state.supported;
      pip.document.getElementById('pipNotificationLabel').textContent=state.busy?'알림 설정 중':state.enabled?'알림 ON':'알림 OFF';
      pip.document.getElementById('pipNotificationStatus').textContent=state.message;
    }
    function rowMarkup(row){
      const detail=[row.spot,row.bait,row.bite,row.conditions].filter(Boolean).join(' · ');
      return `<li class="pip-fish${row.always?' is-always':''}" data-pip-fish="${row.id}"><img src="${esc(row.icon)}" width="28" height="28" alt="" loading="lazy"><div class="pip-fish-copy"><div class="pip-fish-top"><button type="button" data-pip-detail="${row.id}" title="본 페이지에서 ${esc(row.name)} 상세 보기">${row.star?'★ ':''}${esc(row.name)}</button><time id="pip-time-${row.id}" data-pip-time="${row.id}"></time></div><p title="${esc(detail)}">${esc(detail)}</p></div></li>`;
    }
    function paint(){
      if(!isOpen()||!view)return;
      const d=pip.document,now=Date.now(),groups=partition(view.rows,now,horizon);
      d.getElementById('pipScope').textContent=view.scope;
      d.getElementById('pipAlertScope').textContent=view.alertScope;
      d.getElementById('pipCurrentCount').textContent=groups.current.length;
      d.getElementById('pipUpcomingCount').textContent=groups.upcoming.length;
      const nextSignature=JSON.stringify([groups.current,groups.upcoming]);
      if(signature!==nextSignature){
        const focus=d.activeElement?.dataset.pipDetail;
        for(const [id,rows,message] of [['pipCurrent',groups.current,'지금 도전 가능한 미수집 물고기가 없어요.'],['pipUpcoming',groups.upcoming,'선택한 시간 안에 예정된 물고기가 없어요.']]){
          const list=d.getElementById(id),scroll=list.scrollTop;
          list.innerHTML=rows.map(rowMarkup).join('')||`<li class="pip-empty">${message}</li>`;list.scrollTop=scroll;
        }
        if(focus)d.querySelector(`[data-pip-detail="${focus}"]`)?.focus({preventScroll:true});
        signature=nextSignature;
      }
      for(const [rows,current] of [[groups.current,true],[groups.upcoming,false]])for(const row of rows){
        const el=d.getElementById('pip-time-'+row.id);
        el.textContent=row.always?'상시':current?'남은 '+remaining(row.end-now):remaining(row.start-now)+' 후';
        el.title=row.always?'시간·날씨 제한 없음':`${stamp.format(row.start)} – ${stamp.format(row.end)} (KST · 내 접속 시간 기준)`;
        if(!row.always)el.dateTime=new Date(current?row.end:row.start).toISOString();
      }
      d.getElementById('pipNotes').textContent=(view.saved?'':'접속 시간은 아직 저장 전 예시 설정입니다. ')+`예보는 내 접속 시간 기준 · 직감·생미끼 등 선행 조건은 별도 준비.${groups.unresolved?' 준비·설정·예보 확인 필요 '+groups.unresolved+'종은 본 목록에서 확인하세요.':''}${view.pending?' 더 먼 기회 조회 중.':''}`;
      d.getElementById('pipUpdated').textContent='KST · '+stamp.format(view.updatedAt);
    }
    function update(){if(isOpen()){view=getView();paint();notificationState();}}
    function tick(){
      if(!isOpen())return;
      const now=Date.now();
      if(!view||now-view.updatedAt>=MINUTE||view.rows.some(r=>Number.isFinite(r.end)&&r.end<=now))refresh();
      paint();
    }
    function cleanup(closed){
      if(pip!==closed)return;
      closed.clearInterval(interval);interval=null;pip=null;view=null;signature='';
      button.setAttribute('aria-pressed','false');button.textContent='PIP 작은 창';
      hint.textContent='작은 창을 닫았어요. 알림 설정은 유지됩니다.';onClose?.();
    }
    async function open(){
      if(opening)return;
      if(isOpen()){pip.focus();return;}
      opening=true;button.disabled=true;
      try{
        const child=await window.documentPictureInPicture.requestWindow({width:460,height:640});pip=child;
        child.addEventListener('pagehide',()=>cleanup(child),{once:true});
        const d=child.document;d.documentElement.lang='ko';d.title='세누어 · 낚시 알림';
        const base=d.createElement('base');base.href=new URL('./',location.href).href;d.head.append(base);
        for(const path of ['../theme.css?v=20260909-line1','./pip.css?v='+VERSION]){const link=d.createElement('link');link.rel='stylesheet';link.href=new URL(path,location.href).href;d.head.append(link);}
        d.body.innerHTML=`<main class="fishing-pip"><header class="pip-header"><div><h1>세누어 <span>낚시 알림</span></h1><button type="button" id="pipSettings">본 페이지 ↗</button></div><div class="pip-controls"><label class="pip-switch"><input type="checkbox" role="switch" id="pipNotifications" aria-label="페이지 접속 중 알림"><span aria-hidden="true"></span><strong id="pipNotificationLabel">알림 OFF</strong></label><span id="pipUpdated"></span></div><p id="pipAlertScope"></p><details class="pip-status"><summary>알림 상태·안내</summary><p id="pipNotificationStatus" role="status"></p><p>본 페이지를 열어 두세요. 작은 창을 닫아도 알림 설정은 유지됩니다. 절전·브라우저 상태에 따라 갱신과 알림이 늦어질 수 있어요.</p></details></header><p id="pipScope" class="pip-scope"></p><section class="pip-section is-current" aria-labelledby="pipCurrentTitle"><h2 id="pipCurrentTitle"><i aria-hidden="true"></i>지금 <b id="pipCurrentCount">0</b></h2><ul id="pipCurrent" tabindex="0" aria-label="현재 도전 가능 물고기"></ul></section><section class="pip-section is-upcoming" aria-labelledby="pipUpcomingTitle"><div class="pip-section-heading"><h2 id="pipUpcomingTitle">다음 출현 <b id="pipUpcomingCount">0</b></h2><div class="pip-horizon" role="group" aria-label="다음 출현 범위"><button type="button" data-pip-horizon="30">30분</button><button type="button" data-pip-horizon="60">1시간</button><button type="button" data-pip-horizon="0">전체</button></div></div><ul id="pipUpcoming" tabindex="0" aria-label="다음 출현 물고기"></ul></section><footer id="pipNotes"></footer></main>`;
        d.getElementById('pipNotifications').addEventListener('change',async event=>{
          const enabling=event.target.checked;
          await (enabling?notifications?.enable():notifications?.disable());notificationState();
          if(isOpen()&&pip===child&&enabling&&!notifications?.state().enabled)d.querySelector('.pip-status').open=true;
        });
        d.getElementById('pipSettings').addEventListener('click',()=>{window.focus();openSettings();});
        d.addEventListener('click',event=>{
          const range=event.target.closest('[data-pip-horizon]');
          if(range){horizon=+range.dataset.pipHorizon;for(const el of d.querySelectorAll('[data-pip-horizon]'))el.setAttribute('aria-pressed',String(+el.dataset.pipHorizon===horizon));paint();}
          const fish=event.target.closest('[data-pip-detail]');if(fish){window.focus();openFish(+fish.dataset.pipDetail);}
        });
        for(const el of d.querySelectorAll('[data-pip-horizon]'))el.setAttribute('aria-pressed',String(+el.dataset.pipHorizon===horizon));
        onOpen?.();update();
        interval=child.setInterval(tick,1000);
        button.setAttribute('aria-pressed','true');button.textContent='PIP 작은 창으로 이동';
        hint.textContent='PIP에 낚시 계획의 필터·접속 시간을 반영하고 있어요. 본 페이지는 열어 두세요.';
      }catch{
        if(pip){const failed=pip;failed.close();cleanup(failed);}
        hint.textContent='작은 창을 열지 못했어요. PC Chrome·Edge에서 다시 눌러 주세요.';
      }finally{opening=false;button.disabled=false;}
    }
    button.addEventListener('click',open);
    document.addEventListener('fishing-notifications-changed',notificationState);
    window.addEventListener('pagehide',()=>{if(pip){const closed=pip;closed.close();cleanup(closed);}});
    return {isOpen,update};
  }
  window.FishingPip={mount,partition,remaining};
})();
