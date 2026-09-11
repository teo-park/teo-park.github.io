import {KEY,methods,create,parseNumbers,parseBackup,backup,mapPosition} from './engine.js?v=20260909-borrow1';
import {createAtlas,captureDetails} from './atlas.js?v=20260909-atlas1';
import {initCombatFilters,combatRow,combatDetails} from './combat-view.js?v=20260909-borrow1';

const PAGE_SIZE=25;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external=(url,label)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;

export function mount(win,data,locationData=null,captureData=null){
  const doc=win.document,$=id=>doc.getElementById(id),model=create(data,locationData,captureData),valid=new Set(model.byId.keys());
  let detailId=null;
  let owned=new Set(),undoChange=null,page=1,view='number',shown=[],storageError=false;
  const combatOptions=()=>({command:$('combatCommand').value,purpose:$('combatPurpose').value,weakness:$('combatWeakness').value});
  const options=()=>({query:$('search').value,status:$('status').value,method:['map','combat'].includes(view)?'all':$('method').value,place:['map','combat'].includes(view)?'all':$('place').value,...(view==='combat'?{combat:combatOptions()}:{})});
  const atlas=createAtlas(doc,model,{onRegionChange:()=>render()});
  initCombatFilters(doc,()=>render());
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
      button.closest('.combat-row')?.classList.toggle('collected',isOwned);
    }
    for(const label of doc.querySelectorAll('[data-group-count]')){
      const group=model.groups(shown,options()).find(g=>g.key===label.dataset.groupCount);
      if(group)label.textContent=`${group.entries.filter(e=>owned.has(e.beast.id)).length} / ${group.entries.length}종 수집`;
    }
    atlas.updateOwned(owned);previewNumbers();
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
  function tile(b){const routes=model.routes.get(b.id),primary=routes[0];return `<article class="beast-tile" data-id="${b.id}"><button class="beast-check" data-check="${b.id}" aria-pressed="false"><span class="tile-top"><span>No.${b.id}</span><span class="check-mark" aria-hidden="true">＋</span></span>${art(b)}<strong class="beast-name">${esc(b.name)}</strong><span class="state-label">미수집</span></button><p class="tile-location" title="${esc(primary.name)}">${esc(primary.type==='quest'?'개방 퀘스트':primary.name)}</p><button class="source-button" data-detail="${b.id}" aria-label="${esc(b.name)} 획득처 자세히 보기">획득처${routes.length>1?` <span class="alternate-dot" aria-label="여러 경로">· ${routes.length}</span>`:''} <span aria-hidden="true">↗</span></button></article>`;}
  function populatePlaces(){
    const previous=$('place').value,entries=model.groups(data.beasts,{method:$('method').value});
    $('place').innerHTML='<option value="all">모든 장소</option>'+entries.map(g=>`<option value="${esc(g.key)}">${esc(g.name)} · ${g.entries.length}종</option>`).join('');
    $('place').value=entries.some(g=>g.key===previous)?previous:'all';
  }
  function pagination(){
    const total=Math.ceil(shown.length/PAGE_SIZE),start=(page-1)*PAGE_SIZE+1,end=Math.min(page*PAGE_SIZE,shown.length);
    const html=total?`<button data-page="${page-1}" ${page===1?'disabled':''} aria-label="이전 페이지">‹</button>${Array.from({length:total},(_,i)=>`<button data-page="${i+1}" ${page===i+1?'aria-current="page"':''} aria-label="${i+1}페이지">${i+1}</button>`).join('')}<button data-page="${page+1}" ${page===total?'disabled':''} aria-label="다음 페이지">›</button><span>${start}–${end} / ${shown.length}종</span>`:'';
    for(const id of ['pagination','paginationTop']){$(id).innerHTML=html;$(id).hidden=!['number','combat'].includes(view)||!shown.length;}
  }
  function render(reset=true){
    if(reset){page=1;shown=model.filter(owned,options());$('refreshResults').hidden=true;}
    page=Math.max(1,Math.min(page,Math.ceil(shown.length/PAGE_SIZE)));
    const isNumber=view==='number',isMap=view==='map',isCombat=view==='combat',pageBeasts=shown.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
    $('beastGrid').hidden=!isNumber;$('placeGroups').hidden=view!=='place';$('regionAtlas').hidden=!isMap;
    $('combatFilters').hidden=!isCombat;$('combatResults').hidden=!isCombat;
    $('collectionLayoutSwitch').hidden=isMap||isCombat;$('method').closest('label').hidden=isMap||isCombat;$('place').closest('label').hidden=isMap||isCombat;
    $('numberView').setAttribute('aria-pressed',String(isNumber));$('placeView').setAttribute('aria-pressed',String(view==='place'));$('mapView').setAttribute('aria-pressed',String(isMap));
    $('combatView').setAttribute('aria-pressed',String(isCombat));
    $('resultCount').textContent=`${shown.length}종`;
    updateViewHint();
    if(!isCombat)$('combatResults').replaceChildren();
    if(isNumber){$('placeGroups').replaceChildren();$('beastGrid').innerHTML=pageBeasts.map(tile).join('');}
    else if(isMap){$('beastGrid').replaceChildren();$('placeGroups').replaceChildren();$('resultCount').textContent=`${atlas.render(shown)}종`;}
    else if(isCombat){$('beastGrid').replaceChildren();$('placeGroups').replaceChildren();$('regionAtlas').replaceChildren();$('combatResults').innerHTML=pageBeasts.map(b=>combatRow(b,model.combat.get(b.id),combatOptions())).join('');}
    else{$('regionAtlas').replaceChildren();$('beastGrid').replaceChildren();$('placeGroups').innerHTML=model.groups(shown,options()).map(g=>`<section class="place-group"><div class="group-heading"><div><span class="method-badge">${methods[g.type]}</span><h3>${esc(g.name)}</h3></div><span data-group-count="${esc(g.key)}"></span></div><div class="beast-grid">${g.entries.map(e=>tile(e.beast)).join('')}</div></section>`).join('');}
    $('markPage').hidden=isMap||isCombat||!shown.length;$('markPage').textContent=isNumber?`이 페이지 ${pageBeasts.length}종 모두 수집`:`표시된 ${shown.length}종 모두 수집`;
    $('emptyResults').hidden=isMap||!!shown.length;pagination();updateCounts();
  }
  function reset(){for(const id of ['status','method','place','combatCommand','combatPurpose','combatWeakness'])$(id).value='all';$('search').value='';populatePlaces();render();}
  function updateViewHint(){const shape=$('catalog').dataset.collectionLayout==='list'?'도감 번호순':'5 × 5';$('viewHint').textContent=view==='number'?`${shape} · 칸을 눌러 수집 체크 · 획득처에서 자세히 보기`:view==='map'?'지역을 고르면 공개된 포획 대상을 함께 표시합니다. 위 수집 상태에서 미수집만 볼 수 있어요.':view==='combat'?'수집 상태를 ‘수집 완료’로 선택하면 보유한 마수만 비교할 수 있어요.':'같은 장소에서 모을 마수를 확인하세요. 획득 경로가 여럿인 마수는 각 장소에 표시됩니다.';}
  function routeDetails(r){
    let body='';
    if(r.capture||r.reported){body=`<h3>${esc(r.name)}</h3><p class="muted">${r.capture?'도감의 주요 출현 지역':'추가 포획처 · 공개 제보'}</p>${r.targets?.length?`<p>${r.targets.map(t=>`Lv.${t.level} ${esc(t.name)}${t.status==='conflict'?' (위치 확인 필요)':''}`).join(' · ')}</p>`:''}<p>포획 가능한 개체와 난이도는 현장에서 ‘파악하기’로 확인하세요.</p>${external(r.link,r.capture?'공식 가이드에서 장소 검색':'포획 제보 원문')}`;}
    else if(r.type==='exchange'){
      const s=r.source;body=`<h3>${esc(r.item.name)}</h3><p>항아리를 마수조련사로 사용하면 계약할 수 있어요.</p><dl class="source-facts"><div><dt>교환 가격</dt><dd>${s.costs.map(c=>`${esc(c.name)} <strong>${c.count}개</strong>`).join(' + ')} <span class="muted">/ 항아리 ${s.receiveCount}개</span></dd></div><div><dt>교환 NPC</dt><dd>${esc(s.merchant)}</dd></div><div><dt>상인 위치</dt><dd>${esc(s.location.name)}<br>X:${s.location.coordinates.x} · Y:${s.location.coordinates.y}</dd></div><div><dt>선행 퀘스트</dt><dd>${s.prerequisiteQuests.map(q=>external(q.official,`Lv.${q.level} ${q.name}`)).join('<br>')||'없음'}</dd></div></dl>${external(r.item.official,'공식 가이드에서 항아리 검색')} · ${external(r.link,'공식 교환 안내')}`;
    }else{body=`<h3>${esc(r.source.quest.name)}</h3><p>Lv.${r.source.quest.level} · 마수조련사 개방 퀘스트</p><p>${esc(r.source.note)}</p><p class="item-name">${esc(r.item.name)}</p>${external(r.link,'공식 가이드에서 퀘스트 검색')}`;}
    return `<section class="source-card"><span class="method-badge">${methods[r.type]}</span>${body}<button class="route-filter quiet" data-route="${esc(r.key)}" data-method="${r.type}">이곳의 미수집 마수 보기 →</button></section>`;
  }
  function locationDetails(b){
    const targets=model.locations.get(b.id)||[];
    if(!targets.length)return b.locationHint?.type==='field'?`<section class="location-section"><h2 class="section-title">몬스터 위치 지도</h2><p class="muted">${locationData?'인벤 토벌수첩에서 연결할 위치를 아직 찾지 못했어요. 아래 주요 출현 지역을 참고하세요.':'지도 자료를 불러오지 못했어요. 새로고침하거나 아래 공식 가이드 링크를 이용해 주세요.'}</p></section>`:'';
    return `<section class="location-section" aria-labelledby="locationTitle"><h2 id="locationTitle" class="section-title">몬스터 위치 지도 <span>토벌수첩 참고</span></h2><p class="location-note">인벤의 기존 몬스터 출현 위치입니다. 최신 포획 가능 여부와 위치는 ‘파악하기’로 확인하세요.</p>${targets.length>1?`<label class="location-select" for="locationTarget">지도에 표시할 몬스터<select id="locationTarget">${targets.map(t=>`<option value="${esc(t.id)}">${esc(t.name)} · ${esc(t.area)} (X:${t.coordinates.x}, Y:${t.coordinates.y})</option>`).join('')}</select></label>`:''}<div id="locationMapContent"></div></section>`;
  }
  function renderLocation(targetId){
    const b=model.byId.get(detailId),targets=model.locations.get(detailId)||[];
    const t=targets.find(t=>t.id===targetId)||targets[0];if(!t||!$('locationMapContent'))return;
    const map=model.maps[t.mapId],point=mapPosition(t.coordinates,map.sizeFactor);
    $('locationMapContent').innerHTML=`<div class="location-summary"><div><strong>${esc(t.name)}</strong><span>${esc(t.region)} · ${esc(t.area)}</span></div><b>X:${t.coordinates.x} · Y:${t.coordinates.y} 부근</b></div>${!t.matchesHint?`<p class="location-alternate">도감의 주요 출현 지역(${esc(b.locationHint.name)})과 다른 지역의 참고 위치예요.</p>`:''}<figure class="location-map"><img data-location-map src="${esc(map.url)}" alt="${esc(map.name)} 지도" width="1024" height="1024"><span class="location-pin" style="left:${point.x}%;top:${point.y}%" role="img" aria-label="${esc(t.name)} 참고 위치 X:${t.coordinates.x}, Y:${t.coordinates.y}"><span aria-hidden="true">●</span></span><figcaption data-map-status role="status">지도를 불러오는 중…</figcaption></figure><div class="location-tools">${external(t.source.url,'인벤 위치 원문')}<button class="quiet" data-copy-location="${esc(t.id)}">좌표 복사</button><span id="coordinateCopyStatus" role="status"></span></div><p class="map-credit">지도 © SQUARE ENIX · 제공 XIVAPI</p>`;
  }
  function showDetail(id){
    const b=model.byId.get(id);if(!b)return;
    detailId=id;
    $('detailBody').innerHTML=`<div class="detail-heading">${art(b)}<div><p class="eyebrow">No.${b.id} / ${esc(b.englishName)}</p><h2 id="detailTitle">${esc(b.name)}</h2></div></div><button class="detail-check" data-check="${b.id}" aria-pressed="false"><span class="check-mark" aria-hidden="true">＋</span> <span class="state-label">미수집</span></button>${combatDetails(b,model.combat.get(b.id),data)}${captureDetails(b,model)}${locationDetails(b)}<p class="description">${esc(b.description)}</p><h2 class="section-title">획득 방법 <span>${model.routes.get(id).length}</span></h2>${model.routes.get(id).map(routeDetails).join('')}<p class="detail-official">${external(b.official,'공식 가이드에서 마수 검색')}</p>`;
    renderLocation();if($('locationTarget'))$('locationTarget').onchange=()=>renderLocation($('locationTarget').value);
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
  doc.addEventListener('load',event=>{if(event.target.matches?.('[data-location-map]'))event.target.closest('figure').querySelector('[data-map-status]').hidden=true;},true);
  doc.addEventListener('error',event=>{if(event.target.matches?.('[data-location-map]')){const figure=event.target.closest('figure');figure.classList.add('map-failed');figure.querySelector('[data-map-status]').textContent='지도 이미지를 불러오지 못했어요. 위 좌표와 인벤 위치 원문을 참고하세요.';}},true);
  doc.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||button.disabled)return;
    if(button.dataset.check){const id=Number(button.dataset.check);let latest;try{latest=read();}catch{announce('기존 수집 기록을 읽지 못했어요. 브라우저 저장 설정을 확인해 주세요.');return;}mutate([id],!latest.has(id),`${model.byId.get(id).name} 수집 기록을 ${latest.has(id)?'해제':'추가'}했어요.`);}
    else if(button.dataset.detail)showDetail(Number(button.dataset.detail));
    else if(button.dataset.openRegion){$('search').value='';$('status').value='all';atlas.open(button.dataset.openRegion,button.dataset.target);view='map';$('detailDialog').close();render();$('catalog').scrollIntoView({block:'start'});}
    else if(button.dataset.copyLocation){const target=(model.locations.get(detailId)||[]).find(t=>t.id===button.dataset.copyLocation);if(!target)return;const status=$('coordinateCopyStatus'),value=`${target.name} · ${target.region} X:${target.coordinates.x} Y:${target.coordinates.y} 부근`;
      if(!win.navigator.clipboard?.writeText){status.textContent=value;return;}
      win.navigator.clipboard.writeText(value).then(()=>{status.textContent='좌표를 복사했어요.';},()=>{status.textContent='복사하지 못했어요. 위 좌표를 직접 선택해 주세요.';});}
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
  $('mapView').onclick=()=>{view='map';render();};
  $('combatView').onclick=()=>{view='combat';render();};
  $('resetCombat').onclick=()=>{for(const id of ['combatCommand','combatPurpose','combatWeakness'])$(id).value='all';render();};
  win.addEventListener('resize',()=>{if(view==='map')render(false);});
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
  // Guide links open acquisition details without touching collection or filters.
  function openLinkedBeast(){
    const match=/^#beast-(\d+)$/.exec(win.location.hash);
    if(match&&model.byId.has(Number(match[1])))showDetail(Number(match[1]));
  }
  win.addEventListener('hashchange',openLinkedBeast);
  $('detailDialog').addEventListener('close',()=>{
    if(/^#beast-\d+$/.test(win.location.hash))win.history.replaceState(null,'',win.location.pathname+win.location.search);
  });
  openLinkedBeast();
  if(storageError)announce('기존 수집 기록을 읽지 못했어요. 목록은 볼 수 있지만 저장 전에 브라우저 설정이나 백업을 확인해 주세요.');
  return {model,render,showDetail};
}

if(typeof window!=='undefined'){
  const readJson=path=>fetch(new URL(path,import.meta.url)).then(r=>{if(!r.ok)throw Error(path);return r.json();});
  Promise.all([readJson('./data.json?v=20260909-borrow1'),readJson('./locations.json?v=20260908-maps1').catch(()=>null),readJson('./captures.json?v=20260909-atlas1').catch(()=>null)]).then(([data,locations,captures])=>mount(window,data,locations,captures)).catch(()=>{
    document.getElementById('loading').hidden=true;const fatal=document.getElementById('fatal');fatal.hidden=false;fatal.textContent='마수도감을 불러오지 못했어요. 인터넷 연결을 확인하고 새로고침해 주세요. 저장된 수집 기록은 유지됩니다.';
  });
}
