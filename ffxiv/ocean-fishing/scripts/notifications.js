(() => {
  'use strict';
  const format=timestamp=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(timestamp);
  function createAlert({id,label,key,offset,grace,requestPermission}){
    const KEY=`teo-ffxiv.ocean.${key}-alerts.v1`,SENT=`teo-ffxiv.ocean.${key}-alerts.sent.v1`,LOCK=`teo-ffxiv-ocean-${key}-alert`;
    const button=document.getElementById(`ocean${id}Notifications`),hint=document.getElementById(`ocean${id}NotificationStatus`);
    const V=window.JournalVoyages,supported=()=>window.isSecureContext&&typeof window.Notification==='function';
    let enabled=false,busy=false,checking=false,timer=null,paused=false,revision=0,message='',lastState='';
    const state=()=>({enabled,busy,supported:supported(),message});
    function update(text){
      if(text!==undefined)message=text;
      button.disabled=busy||!supported();button.setAttribute('aria-checked',String(enabled));
      button.textContent=busy?'알림 설정 중…':label+' '+(enabled?'ON':'OFF');hint.textContent=enabled?label+' · '+message:message;
      const next=JSON.stringify(state());if(next!==lastState){lastState=next;document.dispatchEvent(new CustomEvent('ocean-notifications-changed'));}
    }
    const current=now=>V.upcoming('indigo',now-offset,1)[0].start+offset;
    const nextStart=now=>{const start=current(now);return start>now?start:start+V.INTERVAL;};
    const onMessage=()=>`근해·원양 공통 · 다음 알림 ${format(nextStart(Date.now()))} (KST)`;
    function schedule(){
      clearTimeout(timer);timer=null;
      if(enabled&&!paused)timer=setTimeout(check,Math.max(250,Math.min(30000,nextStart(Date.now())-Date.now())));
    }
    function stop(text,persist=false){
      enabled=false;clearTimeout(timer);timer=null;
      if(persist)try{localStorage.setItem(KEY,'off');}catch{text+=' 설정을 저장하지 못했어요. 다른 열린 탭에서도 알림을 꺼 주세요.';}
      update(text);
    }
    function show(start){
      const routes=offset?[]:[['indigo','근해'],['ruby','원양']].map(([route,label])=>{
        const last=V.at(route,start).stops.at(-1);return `${label}: ${last.name} · ${V.periods[last.time]}`;
      });
      const notification=new Notification('먼바다 · '+(offset?'점수 마감 1분 전':format(start)+' 접수 시작'),{
        body:offset?`점수 마감은 ${format(start+60000)} (KST)예요.`:'15분 동안 접수할 수 있어요.\n'+routes.join('\n'),tag:`ocean-${key}-`+start,
        icon:new URL((document.body.dataset.assetBase||'../')+'../fishing-log/app-icon.png',location.href).href
      });
      notification.onclick=()=>{window.focus();notification.close();document.getElementById('scheduleRows').scrollIntoView({block:'center'});};
      notification.onerror=()=>stop(`알림을 표시하지 못해 ${label}을 껐어요. 브라우저·기기 알림 설정을 확인해 주세요.`,true);
    }
    async function check(){
      if(!enabled||paused||checking)return;checking=true;
      try{
        if(!supported()||Notification.permission!=='granted'){stop('알림 권한이 꺼졌어요. 브라우저 사이트 설정에서 허용한 뒤 다시 켜 주세요.',true);return;}
        const inspect=()=>{
          // Re-read inside the lock so another tab's OFF wins over queued checks.
          if(!enabled||paused||localStorage.getItem(KEY)!=='on')return;
          const now=Date.now(),start=current(now),sent=Number(localStorage.getItem(SENT));
          if(!Number.isFinite(sent))throw Error('알림 이력을 읽지 못했어요.');
          if(now>=start&&now-start<grace&&sent!==start){
            // Reserve before showing; duplicate tabs and PiP use the same history.
            localStorage.setItem(SENT,String(start));
            try{show(start);}catch(error){localStorage.setItem(SENT,String(sent));throw error;}
          }
        };
        if(navigator.locks)await navigator.locks.request(LOCK,{mode:'exclusive',ifAvailable:true},lock=>{if(lock)inspect();});
        else inspect();
        if(enabled)update(onMessage());
      }catch{stop(`알림을 표시하거나 이력을 저장하지 못해 ${label}을 껐어요. 브라우저 권한·저장 공간을 확인해 주세요.`,true);}
      finally{checking=false;schedule();}
    }
    async function enable(){
      if(busy||!supported())return;const token=++revision;busy=true;update();
      try{
        const permission=await requestPermission();
        if(token!==revision||paused)return;
        if(permission!=='granted'){stop('브라우저 사이트 설정에서 알림을 허용한 뒤 켜 주세요.');return;}
        localStorage.setItem(KEY,'on');enabled=true;update(onMessage());await check();
      }catch{stop('알림을 켜지 못했어요. 브라우저 권한·저장 공간을 확인해 주세요.');}
      finally{busy=false;update();}
    }
    function disable(){++revision;stop(label+' OFF · 근해·원양 공통',true);}
    function sync(){
      ++revision;
      try{
        if(!supported()){stop('이 브라우저는 알림을 지원하지 않아요. PC Chrome·Edge에서 열어 주세요.');return;}
        enabled=localStorage.getItem(KEY)==='on'&&Notification.permission==='granted';
        if(enabled){update(onMessage());check();}
        else stop(Notification.permission==='denied'?'알림이 차단되어 있어요. 브라우저 사이트 설정에서 허용해 주세요.':label+' OFF · 근해·원양 공통');
      }catch{stop('알림 설정을 읽지 못했어요. 브라우저 저장 권한을 확인해 주세요.');}
    }
    button.addEventListener('click',()=>enabled?disable():enable());
    window.addEventListener('storage',event=>{if(event.key===KEY||event.key===null)sync();});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!busy)sync();});
    window.addEventListener('pagehide',()=>{paused=true;++revision;clearTimeout(timer);timer=null;});
    window.addEventListener('pageshow',()=>{paused=false;sync();});
    sync();
    return {state,enable,disable,check};
  }
  function mount(){
    let permissionRequest=null;
    const requestPermission=()=>Notification.permission!=='default'?Promise.resolve(Notification.permission):
      permissionRequest||(permissionRequest=Notification.requestPermission().finally(()=>{permissionRequest=null;}));
    const channels={
      departure:createAlert({id:'',label:'정시 알림',key:'departure',offset:0,grace:90000,requestPermission}),
      // Never replay a score reminder at or after the :15 deadline.
      score:createAlert({id:'Score',label:'점수 마감 1분 전 알림',key:'score-deadline',offset:14*60000,grace:60000,requestPermission})
    };
    return {
      state:(kind='departure')=>channels[kind].state(),
      enable:(kind='departure')=>channels[kind].enable(),
      disable:(kind='departure')=>channels[kind].disable(),
      check:()=>Promise.all(Object.values(channels).map(channel=>channel.check()))
    };
  }
  window.OceanNotifications={mount};
})();
