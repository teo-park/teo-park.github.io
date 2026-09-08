import {KEY,methods,create,parseNumbers,parseBackup,backup} from './engine.js';

const PAGE_SIZE=25;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external=(url,label)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;

export function mount(win,data){
  const doc=win.document,$=id=>doc.getElementById(id),model=create(data),valid=new Set(model.byId.keys());
  let owned=new Set(),undoChange=null,page=1,view='number',shown=[],storageError=false;
  const options=()=>({query:$('search').value,status:$('status').value,method:$('method').value,place:$('place').value});
  const read=()=>{const raw=win.localStorage.getItem(KEY);return raw===null?new Set():parseBackup(raw);};
  function announce(message,undoable=false){$('noticeText').textContent=message;$('notice').hidden=false;$('undo').hidden=!undoable;}
  try{owned=read();}catch{storageError=true;}

  function updateCounts(){
    const n=[...owned].filter(id=>valid.has(id)).length,pct=Math.round(n/data.count*100);
    $('ownedCount').textContent=n;$('totalCount').textContent=`/ ${data.count}종`;
    $('remainingCount').textContent=`미수집 ${data.count-n}종`;$('ownedPercent').textContent=`${pct}%`;
    $('collectionProgress').value=n;$('collectionProgress').max=data.count;
    $('recordCount').textContent=`수집 ${n} / ${data.count}종 · 이 브라우저에 저장 중`;
    for(const button of doc.querySelectorAll('[data-check]')){
      const id=Number(button.dataset.check),isOwned=owned.has(id),b=model.byId.get(id);
      button.setAttribute('aria-pressed',String(isOwned));
      button.setAttribute('aria-label',`No.${id} ${b.name}, ${isOwned?'수집 완료. 클릭하면 해제':'미수집. 클릭하면 수집'}`);
      const label=button.querySelector('.state-label');if(label)label.textContent=isOwned?'수집 완료':'미수집';
      const mark=button.querySelector('.check-mark');if(mark)mark.textContent=isOwned?'✓':'＋';
      button.closest('.beast-tile')?.classList.toggle('collected',isOwned);
    }
    for(const label of doc.querySelectorAll('[data-group-count]')){
      const group=model.groups(shown,options()).find(g=>g.key===label.dataset.groupCount);
      if(group)label.textContent=`${group.entries.filter(e=>owned.has(e.beast.id)).length} / ${group.entries.length}종 수집`;
    }
    previewNumbers();
  }
  function changed(message){
    updateCounts();if($('status').value!=='all')$('refreshResults').hidden=false;
    announce(message,true);
  }
  function mutate(ids,state,message){
    try{
      // Merge against the latest storage value so another tab's unrelated checks survive.
      const before=read(),after=new Set(before),changes=[];
      for(const id of ids)if(before.has(id)!==state){changes.push({id,before:before.has(id),after:state});state?after.add(id):after.delete(id);}
      if(!changes.length){owned=before;updateCounts();announce('이미 반영된 기록이에요.');return true;}
      win.localStorage.setItem(KEY,backup(after));owned=after;undoChange=changes;storageError=false;changed(message);return true;
    }catch{announce('수집 기록을 저장하지 못했어요. 브라우저 저장 설정이나 기존 백업을 확인해 주세요.');return false;}
  }
  function undo(){
    if(!undoChange)return;
    try{
      const latest=read();let n=0;
      for(const c of undoChange)if(latest.has(c.id)===c.after){c.before?latest.add(c.id):latest.delete(c.id);n++;}
      win.localStorage.setItem(KEY,backup(latest));owned=latest;undoChange=null;updateCounts();
      if($('status').value!=='all')$('refreshResults').hidden=false;
      announce(`${n}종의 변경을 취소했어요.`);
    }catch{announce('실행 취소를 저장하지 못했어요. 기존 기록은 유지됩니다.',true);}
  }
  function art(b){return `<span class="beast-art" aria-hidden="true"><span class="icon-fallback">${String(b.id).padStart(2,'0')}</span><img src="${esc(b.icon.url)}" alt="" loading="lazy" width="56" height="56"></span>`;}
  function tile(b){const routes=model.routes.get(b.id),primary=routes[0];return `<article class="beast-tile" data-id="${b.id}"><button class="beast-check" data-check="${b.id}" aria-pressed="false"><span class="tile-top"><span>No.${b.id}</span><span class="check-mark" aria-hidden="true">＋</span></span>${art(b)}<strong class="beast-name">${esc(b.name)}</strong><span class="state-label">미수집</span></button><p class="tile-location" title="${esc(primary.name)}">${esc(primary.type==='quest'?'개방 퀘스트':primary.name)}</p><button class="source-button" data-detail="${b.id}" aria-label="${esc(b.name)} 획득처 자세히 보기">획득처${routes.length>1?' <span class="alternate-dot" aria-label="여러 경로">· 2</span>':''} <span aria-hidden="true">↗</span></button></article>`;}
  function populatePlaces(){
    const previous=$('place').value,entries=model.groups(data.beasts,{method:$('method').value});
    $('place').innerHTML='<option value="all">모든 장소</option>'+entries.map(g=>`<option value="${esc(g.key)}">${esc(g.name)} · ${g.entries.length}종</option>`).join('');
    $('place').value=entries.some(g=>g.key===previous)?previous:'all';
  }
  function pagination(){
    const total=Math.ceil(shown.length/PAGE_SIZE),start=(page-1)*PAGE_SIZE+1,end=Math.min(page*PAGE_SIZE,shown.length);
    const html=total?`<button data-page="${page-1}" ${page===1?'disabled':''} aria-label="이전 페이지">‹</button>${Array.from({length:total},(_,i)=>`<button data-page="${i+1}" ${page===i+1?'aria-current="page"':''} aria-label="${i+1}페이지">${i+1}</button>`).join('')}<button data-page="${page+1}" ${page===total?'disabled':''} aria-label="다음 페이지">›</button><span>${start}–${end} / ${shown.length}종</span>`:'';
    for(const id of ['pagination','paginationTop']){$(id).innerHTML=html;$(id).hidden=view!=='number'||!shown.length;}
  }
  function render(reset=true){
    if(reset){page=1;shown=model.filter(owned,options());$('refreshResults').hidden=true;}
    page=Math.max(1,Math.min(page,Math.ceil(shown.length/PAGE_SIZE)));
    const isNumber=view==='number',pageBeasts=shown.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
    $('beastGrid').hidden=!isNumber;$('placeGroups').hidden=isNumber;
    $('numberView').setAttribute('aria-pressed',String(isNumber));$('placeView').setAttribute('aria-pressed',String(!isNumber));
    $('resultCount').textContent=`${shown.length}종`;
    updateViewHint();
    if(isNumber){$('placeGroups').replaceChildren();$('beastGrid').innerHTML=pageBeasts.map(tile).join('');}
    else{$('beastGrid').replaceChildren();$('placeGroups').innerHTML=model.groups(shown,options()).map(g=>`<section class="place-group"><div class="group-heading"><div><span class="method-badge">${methods[g.type]}</span><h3>${esc(g.name)}</h3></div><span data-group-count="${esc(g.key)}"></span></div><div class="beast-grid">${g.entries.map(e=>tile(e.beast)).join('')}</div></section>`).join('');}
    $('markPage').hidden=!shown.length;$('markPage').textContent=isNumber?`이 페이지 ${pageBeasts.length}종 모두 수집`:`표시된 ${shown.length}종 모두 수집`;
    $('emptyResults').hidden=!!shown.length;pagination();updateCounts();
  }
  function reset(){for(const id of ['status','method','place'])$(id).value='all';$('search').value='';populatePlaces();render();}
  function updateViewHint(){const shape=$('catalog').dataset.collectionLayout==='list'?'도감 번호순':'5 × 5';$('viewHint').textContent=view==='number'?`${shape} · 칸을 눌러 수집 체크 · 획득처에서 자세히 보기`:'같은 장소에서 모을 마수를 확인하세요. 획득 경로가 여럿인 마수는 각 장소에 표시됩니다.';}
  function routeDetails(r){
    let body='';
    if(r.capture){body=`<h3>${esc(r.name)}</h3><p class="muted">도감의 주요 출현 지역</p><p>포획 가능한 개체와 난이도는 현장에서 ‘파악하기’로 확인하세요. 세부 포획 좌표는 아직 확인되지 않았어요.</p>${external(r.link,'공식 가이드에서 장소 검색')}`;}
    else if(r.type==='exchange'){
      const s=r.source;body=`<h3>${esc(r.item.name)}</h3><p>항아리를 마수조련사로 사용하면 계약할 수 있어요.</p><dl class="source-facts"><div><dt>교환 가격</dt><dd>${s.costs.map(c=>`${esc(c.name)} <strong>${c.count}개</strong>`).join(' + ')} <span class="muted">/ 항아리 ${s.receiveCount}개</span></dd></div><div><dt>교환 NPC</dt><dd>${esc(s.merchant)}</dd></div><div><dt>상인 위치</dt><dd>${esc(s.location.name)}<br>X:${s.location.coordinates.x} · Y:${s.location.coordinates.y}</dd></div><div><dt>선행 퀘스트</dt><dd>${s.prerequisiteQuests.map(q=>external(q.official,`Lv.${q.level} ${q.name}`)).join('<br>')||'없음'}</dd></div></dl>${external(r.item.official,'공식 가이드에서 항아리 검색')} · ${external(r.link,'공식 교환 안내')}`;
    }else{body=`<h3>${esc(r.source.quest.name)}</h3><p>Lv.${r.source.quest.level} · 마수조련사 개방 퀘스트</p><p>${esc(r.source.note)}</p><p class="item-name">${esc(r.item.name)}</p>${external(r.link,'공식 가이드에서 퀘스트 검색')}`;}
    return `<section class="source-card"><span class="method-badge">${methods[r.type]}</span>${body}<button class="route-filter quiet" data-route="${esc(r.key)}" data-method="${r.type}">이곳의 미수집 마수 보기 →</button></section>`;
  }
  function showDetail(id){
    const b=model.byId.get(id);if(!b)return;
    $('detailBody').innerHTML=`<div class="detail-heading">${art(b)}<div><p class="eyebrow">No.${b.id} / ${esc(b.englishName)}</p><h2 id="detailTitle">${esc(b.name)}</h2></div></div><button class="detail-check" data-check="${b.id}" aria-pressed="false"><span class="check-mark" aria-hidden="true">＋</span> <span class="state-label">미수집</span></button><p class="description">${esc(b.description)}</p><h2 class="section-title">획득 방법 <span>${model.routes.get(id).length}</span></h2>${model.routes.get(id).map(routeDetails).join('')}<p class="detail-official">${external(b.official,'공식 가이드에서 마수 검색')}</p>`;
    updateCounts();if(!$('detailDialog').open)$('detailDialog').showModal();$('detailBody').scrollTop=0;
  }
  function previewNumbers(){
    const raw=$('ownedNumbers').value.trim();$('applyNumbers').disabled=true;
    if(!raw){$('numberPreview').textContent='쉼표나 공백으로 구분하고, 1-5처럼 범위를 입력할 수 있어요.';return;}
    try{const ids=parseNumbers(raw,valid),n=[...ids].filter(id=>!owned.has(id)).length;$('numberPreview').textContent=`${ids.size}종 입력 · 새로 추가 ${n}종`;$('applyNumbers').disabled=false;}
    catch(e){$('numberPreview').textContent=e.message;}
  }
  function importText(text){
    try{
      if(text.length>1024*1024)throw Error('백업 파일이 너무 커요. 마수도감 백업인지 확인해 주세요.');
      const ids=parseBackup(text),unknown=[...ids].filter(id=>!valid.has(id)).length;
      if(mutate(ids,true,'백업의 수집 기록을 추가했어요.')){$('recordMessage').textContent=`가져온 ${ids.size}종을 기존 기록에 합쳤어요.${unknown?` 현재 목록에 없는 ${unknown}종도 백업에 보존합니다.`:''}`;return true;}
      $('recordMessage').textContent='기록을 저장하지 못했어요. 입력 내용은 유지됩니다.';
    }catch(e){$('recordMessage').textContent=e.message;}
    return false;
  }
  doc.addEventListener('load',event=>{if(event.target.matches?.('.beast-art img'))event.target.classList.add('loaded');},true);
  doc.addEventListener('error',event=>{if(event.target.matches?.('.beast-art img'))event.target.hidden=true;},true);
  doc.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||button.disabled)return;
    if(button.dataset.check){const id=Number(button.dataset.check);let latest;try{latest=read();}catch{announce('기존 수집 기록을 읽지 못했어요. 브라우저 저장 설정을 확인해 주세요.');return;}mutate([id],!latest.has(id),`${model.byId.get(id).name} 수집 기록을 ${latest.has(id)?'해제':'추가'}했어요.`);}
    else if(button.dataset.detail)showDetail(Number(button.dataset.detail));
    else if(button.dataset.page){page=Number(button.dataset.page);render(false);$('catalog').scrollIntoView({block:'start'});}
    else if(button.dataset.route){$('search').value='';$('status').value='missing';$('method').value=button.dataset.method;populatePlaces();$('place').value=button.dataset.route;view='place';$('detailDialog').close();render();$('catalog').scrollIntoView({block:'start'});}
  });
  $('search').addEventListener('input',()=>render());
  $('catalog').addEventListener('collectionlayoutchange',updateViewHint);
  $('search').addEventListener('compositionend',()=>render());
  $('clearSearch').onclick=()=>{$('search').value='';render();$('search').focus();};
  for(const id of ['status','place'])$(id).onchange=()=>render();
  $('method').onchange=()=>{populatePlaces();render();};
  $('resetFilters').onclick=reset;$('emptyReset').onclick=reset;$('refreshResults').onclick=()=>render();
  $('numberView').onclick=()=>{view='number';render();};$('placeView').onclick=()=>{view='place';render();};
  $('markPage').onclick=()=>{const ids=(view==='number'?shown.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE):shown).map(b=>b.id);mutate(ids,true,'표시된 마수를 수집 기록에 추가했어요.');};
  $('openRecords').onclick=()=>{$('recordMessage').textContent='';updateCounts();$('recordsDialog').showModal();};
  $('closeDetail').onclick=()=>$('detailDialog').close();$('closeRecords').onclick=()=>$('recordsDialog').close();
  $('ownedNumbers').addEventListener('input',previewNumbers);
  $('applyNumbers').onclick=()=>{try{const ids=parseNumbers($('ownedNumbers').value,valid);if(mutate(ids,true,'입력한 마수를 수집 기록에 추가했어요.')){$('ownedNumbers').value='';previewNumbers();$('recordMessage').textContent=`입력한 ${ids.size}종을 수집 기록에 반영했어요.`;}}catch(e){$('recordMessage').textContent=e.message;}};
  $('applyBackup').onclick=()=>{if(importText($('backupText').value))$('backupText').value='';};
  $('importRecords').onclick=()=>$('importFile').click();
  $('importFile').onchange=async()=>{const file=$('importFile').files[0];if(!file)return;try{if(file.size>1024*1024)throw Error('백업 파일이 너무 커요.');importText(await file.text());}catch(e){$('recordMessage').textContent=e.message;}$('importFile').value='';};
  $('exportRecords').onclick=()=>{try{const text=backup(read()),url=win.URL.createObjectURL(new win.Blob([text],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download=`ffxiv-beastmaster-${new Date().toISOString().slice(0,10)}.json`;doc.body.append(a);a.click();a.remove();win.setTimeout(()=>win.URL.revokeObjectURL(url),1000);$('recordMessage').textContent='백업 파일을 내보냈어요.';}catch{$('recordMessage').textContent='기존 기록을 읽지 못해 내보내지 않았어요. 브라우저 저장 설정을 확인해 주세요.';}};
  $('undo').onclick=undo;$('closeNotice').onclick=()=>$('notice').hidden=true;
  win.addEventListener('storage',e=>{if(e.key!==KEY&&e.key!==null)return;try{owned=read();undoChange=null;updateCounts();if($('status').value!=='all')$('refreshResults').hidden=false;announce('다른 탭의 수집 기록을 반영했어요.');}catch{announce('다른 탭의 수집 기록을 읽지 못했어요. 현재 표시는 유지됩니다.');}});
  populatePlaces();render();$('loading').hidden=true;$('appContent').hidden=false;$('openRecords').disabled=false;
  if(storageError)announce('기존 수집 기록을 읽지 못했어요. 목록은 볼 수 있지만 저장 전에 브라우저 설정이나 백업을 확인해 주세요.');
  return {model,render,showDetail};
}

if(typeof window!=='undefined'){
  fetch(new URL('./data.json?v=20260908-book',import.meta.url)).then(r=>{if(!r.ok)throw Error('data');return r.json();}).then(data=>mount(window,data)).catch(()=>{
    document.getElementById('loading').hidden=true;const fatal=document.getElementById('fatal');fatal.hidden=false;fatal.textContent='마수도감을 불러오지 못했어요. 인터넷 연결을 확인하고 새로고침해 주세요. 저장된 수집 기록은 유지됩니다.';
  });
}
