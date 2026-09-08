(function(){
  'use strict';
  const $=id=>document.getElementById(id),KEY='teo-ffxiv.fishing.notifications.v1',HISTORY='teo-ffxiv.fishing.notifications.sent.v1';
  function mount({snapshot,data,model}){
    const E=window.FishingNotificationEngine;
    let enabled=false,registration=null,timer=null,busy=false,checking=false;
    const supported=()=>window.isSecureContext&&'Notification' in window;
    const status=text=>$('notificationStatus').textContent=text;
    const buttons=()=>{$('enableNotifications').disabled=busy||!supported();$('enableNotifications').textContent=enabled?'알림 켜짐 · 설정 반영':'이 브라우저에서 알림 켜기';$('testNotification').disabled=busy||!enabled;$('disableNotifications').disabled=busy||!enabled;};
    const readHistory=()=>{const value=JSON.parse(localStorage.getItem(HISTORY)||'[]');return Array.isArray(value)?value:[];};
    async function prepare(){
      if('serviceWorker' in navigator){try{registration=await navigator.serviceWorker.register('./sw.js',{scope:'./'});await navigator.serviceWorker.ready;}catch{registration=null;}}
    }
    async function show(payload){
      const url=new URL('./',location.href);if(payload.fish)url.searchParams.set('fish',payload.fish);
      const options={body:payload.body,tag:payload.tag,icon:'./app-icon.png',data:{url:url.href},renotify:false};
      if(registration)await registration.showNotification(payload.title,options);
      else{const notice=new Notification(payload.title,options);notice.onclick=()=>{window.focus();location.href=url.href;notice.close();};}
    }
    function schedule(delay=1000){clearTimeout(timer);timer=null;if(enabled)timer=setTimeout(()=>{timer=null;check();},Math.max(1000,Math.min(60000,delay)));}
    async function check(){
      if(!enabled||checking)return;checking=true;
      try{
        if(Notification.permission!=='granted')throw Error('알림 권한이 꺼졌습니다. 브라우저 사이트 설정을 확인해 주세요.');
        const inspect=async()=>{
          if(!enabled||localStorage.getItem(KEY)!=='on')return;
          const s=snapshot();if(!s.saved){status('접속 시간을 저장하면 예약 알림이 시작됩니다.');return;}
          const now=Date.now(),sent=readHistory(),batch=E.next(data,window.FISHING_WEATHER,{...s,sent},now);
          if(batch.events.length&&batch.at<=now){
            await show(E.message(data,model,batch.events));
            try{localStorage.setItem(HISTORY,JSON.stringify(E.remember(sent,batch.events,now)));}catch{enabled=false;buttons();throw Error('중복 방지 이력을 저장하지 못해 알림을 멈췄습니다. 브라우저 저장 공간을 확인해 주세요.');}
            status(`알림 켜짐 · ${batch.events.length}종 낚시 예보를 알렸습니다. 이 페이지를 열어 두세요.`);
          }else status(`알림 켜짐 · 대상 ${s.ids.length}종 · ${batch.events.length?'다음 알림 '+new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(batch.at):'접속 시간에 맞는 다음 예보를 확인 중'}`);
          schedule(batch.at<=now?1000:batch.at-now);
        };
        if(navigator.locks)await navigator.locks.request('ffxiv-fishing-notifications',{mode:'exclusive',ifAvailable:true},async lock=>{if(lock)await inspect();});
        else await inspect();
      }catch(e){status(e.message||'알림을 표시하지 못했습니다.');}finally{checking=false;if(enabled&&!timer)schedule(60000);}
    }
    $('enableNotifications').onclick=async()=>{
      if(busy)return;busy=true;buttons();
      try{if(!snapshot().saved)throw Error('먼저 내 접속 시간을 저장해 주세요.');
        const permission=await Notification.requestPermission();if(permission!=='granted')throw Error('브라우저의 사이트 설정에서 알림을 허용해 주세요.');
        await prepare();localStorage.setItem(KEY,'on');enabled=true;await check();
      }catch(e){status(e.message||'알림을 켜지 못했습니다.');}finally{busy=false;buttons();}
    };
    $('disableNotifications').onclick=()=>{try{localStorage.setItem(KEY,'off');enabled=false;clearTimeout(timer);timer=null;status('예약 알림을 껐습니다. 접속 시간과 수집 기록은 보관됩니다.');buttons();}catch{status('알림 설정을 저장하지 못했습니다. 이 페이지를 닫으면 알림이 멈춥니다.');}};
    $('testNotification').onclick=async()=>{try{await show({title:'어부 수첩 · 시험 알림',body:'브라우저 알림이 연결됐습니다. 예약 알림을 받으려면 어부 수첩 페이지를 열어 두세요.',tag:'fishing-test'});status('시험 알림을 표시했습니다. 기기의 알림함을 확인해 주세요.');}catch(e){status('이 환경에서 알림을 표시하지 못했습니다. '+e.message);}};
    document.addEventListener('fishing-plan-changed',()=>schedule());
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&enabled)check();});
    window.addEventListener('pageshow',()=>{if(enabled)check();});
    window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){enabled=localStorage.getItem(KEY)==='on'&&supported()&&Notification.permission==='granted';if(enabled)schedule();else{clearTimeout(timer);timer=null;status('예약 알림이 꺼져 있습니다.');}buttons();}});
    (async()=>{try{
      if(!supported()){status('이 환경은 브라우저 알림을 지원하지 않습니다. iPhone·iPad는 홈 화면에 추가한 뒤 열어 주세요.');buttons();return;}
      enabled=localStorage.getItem(KEY)==='on'&&Notification.permission==='granted';
      if(enabled){await prepare();await check();}else status('알림 꺼짐 · 접속 시간을 저장하고 알림을 켜 주세요.');
      buttons();
    }catch{status('알림 설정을 읽지 못했습니다. 브라우저 저장 권한을 확인해 주세요.');}})();
  }
  window.FishingNotifications={mount};
})();
