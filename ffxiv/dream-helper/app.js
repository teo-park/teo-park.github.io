(function () {
  'use strict';
  const L=window.DreamLogic, storageKey='ffxiv-dream-helper-settings-v1';
  let settings={};
  try{settings=JSON.parse(localStorage.getItem(storageKey))||{};}catch{}
  let state=L.initial(Object.hasOwn(L.strategies,settings.strategy)?settings.strategy:'09stop',L.roles.includes(settings.role)?settings.role:'T1');
  let step=0,child=null,opening=false;
  const main=document.getElementById('helper'),pipButton=document.getElementById('openPip'),status=document.getElementById('pipStatus');
  const supported=Boolean(window.isSecureContext && window.documentPictureInPicture?.requestWindow);
  const base=new URL('./',location.href);
  const labels=['첫 분신 모양','내 분신 위치','첫 안전지대','12시 분신의 징','내 탑 속성','섬광 대상','필드에 남은 분신','이동한 섬'];
  const positions=[[1,2],[1,3],[2,3],[3,3],[3,2],[3,1],[2,1],[1,1]];
  const times=['12시','1시','3시','5시','6시','7시','9시','11시'];
  const image=(key,cls='result-icon')=>`<img class="${cls}" src="${new URL('img/'+key+'.png',base).href}" alt="">`;
  const iconLabel=(key,label)=>`<span class="icon-label">${image(key,'mechanic-icon')}<span>${label}</span></span>`;
  function choiceLabel(field,value,label){
    if(field==='spread')return iconLabel(value,label);
    if(['safe','remaining','island'].includes(field))return iconLabel(value+'mark',label);
    if(field==='shape')return iconLabel(value==='plus'?'plusmark':'Xmark',label);
    return label;
  }
  function button(field,value,label,extra=''){
    return `<button type="button" data-field="${field}" data-value="${value}" aria-pressed="${state[field]===value}" ${extra}>${label}</button>`;
  }
  function choices(field,items){return `<div class="choices">${items.map(([v,t])=>button(field,v,choiceLabel(field,v,t))).join('')}</div>`;}
  function field(index,content,note=''){
    return `<fieldset class="step" data-active="${step===index}"><legend>${index+1}. ${labels[index]}</legend>${content}${note?`<p class="step-note">${note}</p>`:''}</fieldset>`;
  }
  function markup(){
    const s=L.strategies[state.strategy],r=L.calculate(state);
    const arena=`<div class="arena"><span class="arena-center">북쪽 ↑</span>${s.marks.map((mark,i)=>button('clone',i,image(mark+'mark','')+mark,`aria-label="${times[i]} ${mark}징 분신" style="grid-row:${positions[i][0]};grid-column:${positions[i][1]}"`)).join('')}</div>`;
    const route=r.route?`<div class="route">${r.route.map((v,i)=>{const spread=(state.spread==='spread')===(i%2===0);return `<div><span class="route-kind">${image(spread?'spread':'stack','route-mechanic')}<span>${i+1} · ${spread?'산개':'쉐어'}</span></span><b>${iconLabel(v==='center'?'centermark':v+'mark',v==='center'?'중앙':v)}</b></div>`;}).join('')}</div>`:'<p>내 분신 위치와 12시 징을 입력하세요.</p>';
    return `<section class="settings" aria-label="처리법과 파티 자리"><div><span class="setting-label">처리법</span>${choices('strategy',[['09stop','09stop'],['game8','Game8']])}</div><div><span class="setting-label">내 자리 · ${r.group}</span>${choices('role',L.roles.map(v=>[v,v]))}</div><button type="button" data-action="reset" class="reset">새 트라이</button></section>
      <div class="helper-layout"><section aria-label="기믹 입력"><div class="step-navigation"><button type="button" data-action="previous" ${step===0?'disabled':''}>← 이전</button><span>${step+1} / 8 · ${r.latest===8?'입력 완료':`${r.latest}/8 기록`}</span><button type="button" data-action="next" ${step===7?'disabled':''}>다음 →</button></div><div class="input-grid">
      ${field(0,choices('shape',[['plus','＋ 십자'],['cross','× X자']]))}
      ${field(1,arena,'분신이 서 있는 바닥징을 선택하세요.')}
      ${field(2,choices('safe',[['A','A 쪽'],['C','C 쪽']]))}
      ${field(3,choices('spread',[['spread','산개'],['stack','쉐어']]))}
      ${field(4,choices('tower',Object.entries(L.towerNames)),['T1','H2','D2','D3'].includes(state.role)?'내 자리 기본 탑: 땅 / 바람':'내 자리 기본 탑: 화염 / 어둠')}
      ${field(5,choices('flash',[['TH','탱·힐'],['D','딜러']]))}
      ${field(6,choices('remaining',[['A','A 쪽'],['C','C 쪽']]))}
      ${field(7,choices('island',[['D','← D 쪽'],['B','B 쪽 →']]))}
      </div></section><section class="result" aria-label="기믹 결과" aria-live="polite"><h2>이번 트라이</h2><p class="result-meta">${s.name} · ${state.role} · ${r.group}</p>
      <div class="result-row"><small>첫 분신 동선</small><strong>${r.opening?iconLabel(state.shape==='plus'?'plusmark':'Xmark',r.opening):'첫 분신 모양을 입력하세요'}</strong></div>
      <div class="result-row"><small>내 징 · 선 종류 · 선 위치</small><strong>${r.check?image(r.checkIcon)+r.check+' · '+iconLabel(r.lineType==='쉐어'?'stack':'spread',r.lineType):'내 분신 위치를 입력하세요'}</strong>${r.line?`<p>선 위치: ${r.line.split('·').map(mark=>iconLabel(mark+'mark',mark)).join(' · ')}징</p>`:''}</div>
      <div class="result-row"><small>첫 안전지대</small><strong>${state.safe?iconLabel(state.safe+'mark',state.safe+' 쪽 양옆'):'A / C 확인 대기'}</strong></div>
      <div class="result-row"><small>산개·쉐어 동선 · 중앙 = ${s.center}</small>${route}</div>
      <div class="result-row"><small>탑 교대</small><strong>${r.swap===null?'탑 속성과 섬광 대상을 입력하세요':r.swap?'교대하기 · '+L.towerNames[state.tower]+' → '+L.towerNames[r.finalTower]:'교대 없음 · '+L.towerNames[r.finalTower]}</strong>${r.instruction?`<p>${r.instruction}</p>`:''}</div>
      <div class="result-row"><small>이동한 섬 · 회피</small><strong>${state.island?iconLabel(state.island+'mark',state.island+' 쪽'):'B / D 확인 대기'}</strong><p>${r.safety?iconLabel(state.safe===state.remaining?'rlsafe':'udsafe',r.safety):'첫 안전지대와 남은 분신을 입력하세요.'}</p></div>
      <details class="tower-reference"><summary>${s.name} 탑 처리 참고</summary>${s.towers.map(t=>`<p>${t}</p>`).join('')}</details>
      </section></div>`;
  }
  function paint(root){
    const compact=root.ownerDocument.body.classList.contains('pip-body');
    const active=root.ownerDocument.activeElement;
    const focus=active && root.contains(active)?{field:active.dataset.field,value:active.dataset.value,action:active.dataset.action}:null;
    const details=root.querySelector('.tower-reference')?.open;
    root.innerHTML=markup();
    root.querySelector('.tower-reference').open=Boolean(details);
    if(compact){
      // Match the original 380×400 overlay: show only this phase's reminders.
      const visibleRows=[[],[0],[1],[1],[2,3],[2,3],[3,4],[4,5],[0,5]][step];
      root.querySelectorAll('.result-row').forEach((row,index)=>{if(!visibleRows.includes(index))row.remove();});
      root.querySelectorAll('.result h2,.result-meta,.tower-reference,.step-note').forEach(el=>el.remove());
      if(!visibleRows.length)root.querySelector('.result').remove();
      root.querySelectorAll('.step[data-active="false"]').forEach(el=>el.remove());
      const settings=root.querySelector('.settings');
      settings.className='compact-settings';
      settings.innerHTML=`<span>${L.strategies[state.strategy].name} · ${state.role} · ${L.calculate(state).group}</span><button type="button" data-action="reset">새 트라이</button>`;
      const navigation=root.querySelector('.step-navigation');
      navigation.innerHTML=`<button type="button" data-action="previous" ${step===0?'disabled':''}>← 이전</button><span>${step===8?'입력 완료':`${step+1} / 8 · ${labels[step]}`}</span><button type="button" data-action="next" ${step===8?'disabled':''}>다음 →</button>`;
      root.append(navigation);
    }
    if(focus){
      const target=focus.field?root.querySelector(`[data-field="${focus.field}"][data-value="${focus.value}"]`):focus.action?root.querySelector(`[data-action="${focus.action}"]`):null;
      if(target && !(compact && target.closest('.step[data-active="false"]')))target.focus({preventScroll:true});
      else if(compact)(root.querySelector('.step[data-active="true"] button')||root.querySelector('[data-action="previous"]'))?.focus({preventScroll:true});
    }
  }
  function render(){paint(main);if(child && !child.closed){const root=child.document.getElementById('pipHelper');if(root)paint(root);}}
  function input(event){
    const b=event.target.closest('button');if(!b)return;
    if(b.dataset.action){
      if(b.dataset.action==='reset'){state=L.initial(state.strategy,state.role);step=0;}
      if(b.dataset.action==='previous')step=Math.max(0,step-1);
      if(b.dataset.action==='next')step=Math.min(8,step+1);
    }else if(b.dataset.field){
      const f=b.dataset.field,v=f==='clone'?Number(b.dataset.value):b.dataset.value;
      if(f==='strategy' && v!==state.strategy){state=L.initial(v,state.role);step=0;}
      else {state[f]=v;if(L.fields.includes(f))step=Math.min(8,L.fields.indexOf(f)+1);}
      if(f==='strategy'||f==='role')try{localStorage.setItem(storageKey,JSON.stringify({strategy:state.strategy,role:state.role}));}catch{}
    }else return;
    render();
  }
  main.addEventListener('click',input);
  function cleanup(opened){
    if(child!==opened)return;
    child=null;pipButton.setAttribute('aria-pressed','false');pipButton.textContent=supported?'PiP 작은 창':'작은 창 열기';
    status.textContent='작은 창을 닫았어요. 현재 트라이 기록은 유지됩니다.';
  }
  pipButton.addEventListener('click',async()=>{
    if(opening)return;
    if(child&&!child.closed){child.focus();return;}
    opening=true;pipButton.disabled=true;
    try{
      const opened=supported?await window.documentPictureInPicture.requestWindow({width:380,height:400}):window.open('about:blank','dream-helper-popup','popup,width=380,height=400');
      if(!opened)throw new Error('popup blocked');
      child=opened;
      const d=opened.document;d.documentElement.lang='ko';d.title='헤비 영식 4층 · 드림 헬퍼';
      for(const file of ['../theme.css','app.css?v=20260928-icons']){const link=d.createElement('link');link.rel='stylesheet';link.href=new URL(file,base).href;d.head.append(link);}
      const meta=d.createElement('meta');meta.name='viewport';meta.content='width=device-width, initial-scale=1';d.head.append(meta);
      d.body.className='pip-body';d.body.innerHTML='<header class="pip-heading"><strong>드림 헬퍼</strong><button type="button" id="backToMain">설정 · 본 페이지 ↗</button></header><main id="pipHelper"></main>';
      d.getElementById('backToMain').addEventListener('click',()=>window.focus());
      d.getElementById('pipHelper').addEventListener('click',input);
      opened.addEventListener('pagehide',()=>cleanup(opened),{once:true});
      pipButton.setAttribute('aria-pressed','true');pipButton.textContent='작은 창으로 이동';
      status.textContent=supported?'PiP 실행 중 · 작은 창에서 바로 입력할 수 있어요.':'일반 작은 창 실행 중 · 이 환경은 항상 위에 표시하는 PiP를 지원하지 않습니다.';
      render();
    }catch{
      if(child&&!child.closed)child.close();child=null;
      pipButton.setAttribute('aria-pressed','false');
      status.textContent=supported?'PiP를 열지 못했어요. 브라우저 설정을 확인하고 다시 눌러 주세요.':'작은 창이 차단됐어요. 이 사이트의 팝업을 허용한 뒤 다시 눌러 주세요.';
    }finally{opening=false;pipButton.disabled=false;}
  });
  window.addEventListener('pagehide',()=>{if(child&&!child.closed)child.close();});
  if(!supported){pipButton.textContent='작은 창 열기';status.textContent='이 환경에서는 PiP 대신 일반 작은 창으로 열립니다. 항상 위 고정은 지원하지 않습니다.';}
  render();
})();
