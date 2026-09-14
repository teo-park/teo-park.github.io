(() => {
  'use strict';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const remaining=ms=>{const s=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?`${h}시간 ${m}분`:m?`${m}분 ${s%60}초`:`${s}초`;};
  function mount({getView,setStop,changeCatch,undoCatch,openMain,notifications,changeGoal,changeRoute}) {
    const buttons=[...document.querySelectorAll('[data-open-ocean-pip]')],hint=document.getElementById('oceanPipHint');
    if(!buttons.length)return;
    let child=null,opening=false,interval=null,view=null,signature='',context='',goalKind='',editingGP=false,recommendationsSignature='';
    const closedZones=new Set();
    const isOpen=()=>!!child&&!child.closed;
    if(!window.isSecureContext||!window.documentPictureInPicture?.requestWindow){
      buttons.forEach(b=>b.disabled=true);hint.textContent='PiP는 PC Chrome·Edge 등 지원 브라우저에서 사용할 수 있어요.';return {isOpen,update(){}};
    }
    buttons.forEach(b=>b.disabled=false);
    const $=id=>child.document.getElementById(id);
    function goalControls(){
      const goal=view.goal;if(!goal||!$('oceanPipGoal'))return;
      const select=$('oceanPipGoal'),details=$('oceanPipGoalOptions'),body=$('oceanPipGoalBody');
      if(!select.options.length)select.innerHTML=goal.purposes.map(p=>`<option value="${esc(p.id)}">${esc(p.label)}</option>`).join('');
      select.value=goal.purpose;
      details.hidden=!['mission','achievement','score'].includes(goal.purpose);
      const nextKind=view.route+':'+goal.purpose;
      if(goalKind!==nextKind){
        const switching=!!goalKind;goalKind=nextKind;
        if(goal.purpose==='mission'||goal.purpose==='achievement'){
          body.innerHTML=`<fieldset class="ocean-pip-goal-groups"><legend>${goal.purpose==='mission'?'선상과제 물고기군':'목표 업적'} · 복수 선택</legend>${goal.groups.map(g=>`<label><input type="checkbox" data-pip-group="${esc(g.id)}"><span>${esc(g.label)}</span><small data-pip-completed hidden>완료</small></label>`).join('')}</fieldset>${goal.purpose==='achievement'?'<label class="ocean-pip-goal-check"><input type="checkbox" data-pip-goal-field="excludeCompletedAchievements"> 완료한 업적 추천에서 제외</label>':''}<p id="oceanPipGoalHelp"></p>`;
        }else if(goal.purpose==='score'){
          const radios=(field,title,choices)=>`<fieldset class="ocean-pip-goal-radio"><legend>${title}</legend>${choices.map(([id,label])=>`<label><input type="radio" name="pip-${field}" data-pip-goal-field="${field}" value="${id}"><span>${label}</span></label>`).join('')}</fieldset>`;
          body.innerHTML='<div class="ocean-pip-goal-gp"><label for="oceanPipGP">현재 GP</label><input id="oceanPipGP" data-pip-goal-field="strategyGP" type="number" min="0" max="9999" step="1" inputmode="numeric"><label id="oceanPipPrize" class="ocean-pip-goal-check"><input type="checkbox" data-pip-goal-field="strategyPrize"> 대물 낚시 가능</label></div>'+radios('scoreMode','사용할 기술',[['TH','이중 + 삼중'],['DH','이중만']])+radios('strategyObjective','추천 기준',[['community','공략 기준'],['efficiency','GP 효율'],['burst','한 번 점수']]);
        }else body.innerHTML='';
        details.open=switching&&!details.hidden;
      }
      if(goal.purpose==='mission'||goal.purpose==='achievement'){
        for(const input of body.querySelectorAll('[data-pip-group]')){
          const group=goal.groups.find(g=>g.id===input.dataset.pipGroup);input.checked=group.checked;
          input.closest('label').querySelector('[data-pip-completed]').hidden=goal.purpose!=='achievement'||!group.completed;
        }
        $('oceanPipGoalHelp').textContent=goal.help;
      }
      const values={scoreMode:goal.score.mode,strategyGP:goal.score.gp,strategyObjective:goal.score.objective,strategyPrize:goal.score.prize,excludeCompletedAchievements:goal.excludeCompleted};
      for(const input of body.querySelectorAll('[data-pip-goal-field]')){
        const value=values[input.dataset.pipGoalField];
        if(input.type==='checkbox')input.checked=value;
        else if(input.type==='radio')input.checked=input.value===value;
        else if(!editingGP&&input.value!==String(value))input.value=value;
      }
      if($('oceanPipPrize'))$('oceanPipPrize').hidden=goal.score.objective!=='community';
      const count=goal.groups.filter(g=>g.checked).length;
      $('oceanPipGoalSummary').textContent=goal.purpose==='score'?`고득점 설정 · ${goal.score.gp} GP`:`목표 설정 · ${count?count+'개 선택':goal.purpose==='achievement'?'전체 업적':'물고기군 선택'}`;
    }
    function notificationState(){
      if(!isOpen())return;
      const state=notifications?.state()||{enabled:false,busy:false,supported:false,message:'알림 기능을 사용할 수 없어요.'};
      const toggle=$('oceanPipNotifications');if(!toggle)return;
      toggle.disabled=state.busy||!state.supported;toggle.setAttribute('aria-checked',String(state.enabled));
      toggle.textContent=state.busy?'알림 설정 중…':'정시 알림 '+(state.enabled?'ON':'OFF');
      $('oceanPipNotificationStatus').textContent=state.message;
      compactSettings();
    }
    function compactSettings(){
      if(!view)return;
      const stop=view.stops[view.activeStop],goal=view.goal,alert=notifications?.state().enabled?'알림 ON':'알림 OFF';
      const purpose=goal.purposes.find(p=>p.id===goal.purpose)?.label||'';
      $('oceanPipCompactSummary').textContent=`${view.activeStop+1}구간 · ${stop.name} · ${purpose} · ${alert}`;
      const recommended=$('oceanPipCompactRecommendations'),items=view.recommendations||[];
      recommended.hidden=!items.length;recommended.textContent=items.length?'추천 '+items.map(g=>g.label).join(' · '):'';
    }
    function recommendedAchievements(){
      const section=$('oceanPipRecommendations'),items=view.recommendations||[],nextSignature=JSON.stringify(items);
      section.hidden=!items.length;
      if(nextSignature===recommendationsSignature)return;
      const focused=section.contains(child.document.activeElement)?child.document.activeElement.dataset.pipAchievement:null;
      section.innerHTML=items.length?`<h2>이번 항로 추천 업적</h2><div>${items.map(g=>`<button type="button" data-pip-achievement="${esc(g.id)}" aria-pressed="${g.selected}" aria-label="${esc(g.label)} 업적작 목표로 선택"><strong>${esc(g.label)}</strong><span>${g.scope==='party'?'파티':'개인'} ${g.count}마리</span>${g.completed?'<small>완료</small>':''}<b aria-hidden="true">${g.selected?'✓':'↗'}</b></button>`).join('')}</div>${items.length>1?'<p>각 업적을 따로 노리는 추천이에요.</p>':''}`:'';
      if(focused)(section.querySelector(`[data-pip-achievement="${focused}"]`)||$('oceanPipGoal')).focus({preventScroll:true});
      recommendationsSignature=nextSignature;
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
      child.document.title=view.title+' · 먼바다 PiP';
      for(const button of child.document.querySelectorAll('[data-pip-route]'))button.setAttribute('aria-pressed',String(button.dataset.pipRoute===view.route));
      $('oceanPipDeparture').textContent=view.departure;
      $('oceanPipPurpose').textContent=view.purpose;
      goalControls();
      recommendedAchievements();
      compactSettings();
      $('oceanPipMessage').textContent=view.message||'';$('oceanPipUndo').hidden=!view.canUndo;
      $('oceanPipStops').innerHTML=view.stops.map((s,i)=>`<button type="button" role="tab" id="oceanPipStop${i}" data-pip-stop="${i}" aria-controls="oceanPipList" aria-selected="${i===view.activeStop}" tabindex="${i===view.activeStop?0:-1}"><small>${i+1}구간 · ${esc(s.time)}</small><span>${esc(s.name)}</span></button>`).join('');
      $('oceanPipList').setAttribute('aria-labelledby','oceanPipStop'+view.activeStop);
      const stop=view.stops[view.activeStop];
      $('oceanPipStarter').innerHTML=stop.starter||'';
      const zones=stop.zones,nextContext=view.route+':'+view.start+':'+view.activeStop,nextSignature=JSON.stringify(zones);
      if(signature!==nextSignature||context!==nextContext){
        const list=$('oceanPipList'),scroll=list.scrollTop,focused=child.document.activeElement?.dataset.pipCatch;
        const focusedZone=child.document.activeElement?.dataset.pipZoneSummary;
        for(const zone of list.querySelectorAll('[data-pip-zone]')){
          if(zone.open)closedZones.delete(zone.dataset.pipZone);else closedZones.add(zone.dataset.pipZone);
        }
        const open=[...list.querySelectorAll('[data-pip-entry]')].flatMap(row=>[...row.querySelectorAll('details')].flatMap((d,i)=>d.open?[row.dataset.pipEntry+':'+i]:[]));
        list.innerHTML=zones.map(z=>`<details class="ocean-pip-zone${z.key==='spectral'?' spectral':''}" data-pip-zone="${z.key}" ${closedZones.has(z.key)?'':'open'}><summary data-pip-zone-summary="${z.key}"><h2>${z.label} <small>${z.rows.length}종</small></h2></summary><div class="ocean-pip-zone-content">${z.baits}${z.rows.map(card).join('')||'<p class="ocean-pip-empty">현재 목적·필터에 맞는 물고기가 없어요.</p>'}</div></details>`).join('');
        if(context===nextContext){
          for(const row of list.querySelectorAll('[data-pip-entry]'))[...row.querySelectorAll('details')].forEach((d,i)=>d.open=open.includes(row.dataset.pipEntry+':'+i));
          list.scrollTop=scroll;
          if(focused){const target=[...list.querySelectorAll('[data-pip-catch]')].find(b=>b.dataset.pipCatch===focused);(target||list).focus({preventScroll:true});}
        }else list.scrollTop=0;
        if(focusedZone)list.querySelector(`[data-pip-zone-summary="${focusedZone}"]`)?.focus({preventScroll:true});
        signature=nextSignature;context=nextContext;
      }
      clock();
    }
    function update(){if(isOpen()){view=getView();paint();notificationState();}}
    function cleanup(closed){
      if(child!==closed)return;closed.clearInterval(interval);interval=null;child=null;view=null;signature='';context='';goalKind='';recommendationsSignature='';
      for(const b of buttons){b.setAttribute('aria-pressed','false');b.textContent='PiP 작은 창';}
      hint.textContent='작은 창을 닫았어요. 선택한 항로와 수집 기록은 유지됩니다.';
    }
    async function open(){
      if(opening)return;if(isOpen()){child.focus();return;}opening=true;buttons.forEach(b=>b.disabled=true);
      try{
        child=await window.documentPictureInPicture.requestWindow({width:560,height:720});const opened=child,d=child.document;closedZones.clear();
        d.documentElement.lang='ko';d.title=getView().title+' · 먼바다 PiP';
        const base=d.createElement('base');base.href=new URL('./',location.href).href;d.head.append(base);
        const assets=new URL(document.body.dataset.assetBase||'../',location.href);
        for(const path of ['../theme.css?v=20260909-line1','css/app.css?v=20260914-fish-departures','css/pip.css?v=20260914-pip-folds']){const link=d.createElement('link');link.rel='stylesheet';link.href=new URL(path,assets).href;d.head.append(link);}
        d.body.className='ocean-pip-body';
        d.body.innerHTML='<main class="ocean-pip"><header class="ocean-pip-header"><div><h1 id="oceanPipTitle"></h1><button id="oceanPipMain" type="button">본 페이지 ↗</button></div><p><span id="oceanPipDeparture"></span><strong id="oceanPipClock"></strong></p><p id="oceanPipPurpose"></p></header><div id="oceanPipStops" class="ocean-pip-stops" role="tablist" aria-label="항로의 세 구간"></div><div id="oceanPipStarter"></div><div id="oceanPipList" role="tabpanel" tabindex="0"></div><div class="ocean-pip-status"><span id="oceanPipMessage" role="status"></span><button type="button" id="oceanPipUndo" hidden>실행 취소</button></div><footer>목적·필터는 본 페이지와 연동됩니다. 현재 구간은 직접 선택하세요. 본 페이지를 열어 두세요.</footer></main>';
        opened.addEventListener('pagehide',()=>cleanup(opened),{once:true});
        const routes=d.createElement('div');routes.className='ocean-pip-routes';routes.setAttribute('role','group');routes.setAttribute('aria-label','근해·원양 선택');
        routes.innerHTML='<button type="button" data-pip-route="indigo">근해</button><button type="button" data-pip-route="ruby">원양</button>';
        d.querySelector('.ocean-pip-header>div').append(routes);
        const goals=d.createElement('section');goals.className='ocean-pip-goals';goals.setAttribute('aria-label','낚시 목적과 목표');
        goals.innerHTML='<label class="ocean-pip-goal-select" for="oceanPipGoal">낚시 목적 <select id="oceanPipGoal"></select></label><details id="oceanPipGoalOptions"><summary id="oceanPipGoalSummary">목표 설정</summary><div id="oceanPipGoalBody"></div></details>';
        d.querySelector('.ocean-pip-header').after(goals);
        const recommendations=d.createElement('section');recommendations.id='oceanPipRecommendations';recommendations.className='ocean-pip-recommendations';recommendations.setAttribute('aria-label','이번 항로 추천 업적');recommendations.hidden=true;
        goals.after(recommendations);
        // Keep the status available inside settings without repeating the selected purpose in the header.
        $('oceanPipGoalOptions').append($('oceanPipPurpose'));
        $('oceanPipGoal').onchange=event=>changeGoal('purpose',event.target.value);
        goals.addEventListener('change',event=>{
          const el=event.target;
          if(el.matches('[data-pip-group]'))changeGoal(view.goal.purpose==='achievement'?'achievementGroup':'species',{id:el.dataset.pipGroup,checked:el.checked});
          else if(el.matches('[data-pip-goal-field]')){
            if(el.type==='number')el.value=String(Math.max(0,Math.min(9999,Number(el.value)||0)));
            changeGoal(el.dataset.pipGoalField,el.type==='checkbox'?el.checked:el.value);
          }
        });
        goals.addEventListener('input',event=>{if(event.target.id==='oceanPipGP'){editingGP=true;try{changeGoal('strategyGP',event.target.value);}finally{editingGP=false;}}});
        d.addEventListener('click',event=>{
          const achievement=event.target.closest('[data-pip-achievement]');
          if(achievement){changeGoal('recommendedAchievement',achievement.dataset.pipAchievement);$('oceanPipGoalOptions').open=false;return;}
          const route=event.target.closest('[data-pip-route]');if(route){changeRoute(route.dataset.pipRoute);return;}
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
        const settings=d.createElement('details');settings.id='oceanPipControls';settings.className='ocean-pip-controls';
        settings.innerHTML='<summary><span class="ocean-pip-controls-title"><strong>설정·항로</strong><span id="oceanPipCompactRecommendations" hidden></span></span><span id="oceanPipCompactSummary"></span></summary><div id="oceanPipControlsBody"></div>';
        const header=d.querySelector('.ocean-pip-header');header.after(settings);
        const departure=header.querySelector('p');departure.className='ocean-pip-departure';
        $('oceanPipControlsBody').append(departure,controls,goals,recommendations,$('oceanPipStops'),$('oceanPipStarter'),d.querySelector('.ocean-pip>footer'));
        update();interval=opened.setInterval(clock,1000);
        for(const b of buttons){b.setAttribute('aria-pressed','true');b.textContent='PiP 창으로 이동';}
        hint.textContent='PiP에서 설정·항로와 일반·환해류 목록을 접고 펼칠 수 있어요. 본 페이지는 열어 두세요.';
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
