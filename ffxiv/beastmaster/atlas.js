import {mapPosition} from './engine.js?v=20260909-atlas1';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external=(url,label)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
export const captureKind=t=>({field:'필드',fate:'돌발임무',hunt:t.event,duty:'임무'}[t.kind]);
export const capturePosition=t=>t.status==='conflict'?'위치 확인 필요':t.coordinates?`X:${t.coordinates.x} · Y:${t.coordinates.y} 부근`:t.kind==='duty'?'임무 내부 · 좌표 없음':'좌표 미등록';
// Group nearby pins for readability, retaining every target's original coordinates.
// A group's anchor is its first reported location, never a synthetic spawn point.
export const pinLabel=group=>{const ids=[...new Set(group.map(t=>t.beastId))];return ids.length>2?`${ids.length}종`:ids.join('·');};
export function pinGroups(targets,mapWidth=560){
  const groups=targets.filter(t=>t.coordinates).map(t=>[t]);
  const width=g=>Math.max(28,pinLabel(g).length*8+12);
  let merged=true;
  while(merged){merged=false;
    outer:for(let i=0;i<groups.length;i++)for(let j=i+1;j<groups.length;j++){
      const a=groups[i],b=groups[j],dx=Math.abs(a[0].coordinates.x-b[0].coordinates.x)*mapWidth/41,dy=Math.abs(a[0].coordinates.y-b[0].coordinates.y)*mapWidth/41;
      if(dx<(width(a)+width(b))/2+6&&dy<34){a.push(...b);groups.splice(j,1);merged=true;break outer;}
    }
  }
  return groups;
}
export function captureDetails(beast,model){
  const targets=model.capturesByBeast.get(beast.id)||[];
  if(!targets.length)return '';
  return `<section class="capture-section"><h2 class="section-title">포획 대상 <span>${targets.length}</span></h2><p class="location-note">공개 포획 제보입니다. 레벨은 제보된 개체 기준이며, 현장에서 ‘파악하기’로 확인하세요.</p><div class="capture-details">${targets.map(t=>`<article><div><span class="capture-kind">${esc(captureKind(t))}</span> <strong>Lv.${t.level} ${esc(t.name)}</strong>${t.name!==t.englishName?`<small class="capture-english">${esc(t.englishName)}</small>`:''}</div><p>${esc(model.regions.get(t.regionKey).name)} · ${esc(capturePosition(t))}${t.event&&t.kind==='fate'?`<br>돌발임무: ${esc(t.event)}`:''}</p>${t.note?`<p class="capture-warning">${esc(t.note)}</p>`:''}<div class="capture-links"><button class="quiet" data-open-region="${esc(t.regionKey)}" data-target="${esc(t.id)}">${t.kind==='duty'?'이 임무의 포획 대상':'이 지역 지도'} →</button>${external(t.source.url,'포획 제보 원문')}${t.additionalSource?external(t.additionalSource.url,t.additionalSource.name):''}</div></article>`).join('')}</div></section>`;
}

export function createAtlas(doc,model,{onRegionChange}){
  const host=doc.getElementById('regionAtlas');
  let regionKey=[...model.regions.values()].find(r=>r.englishName==='Central Shroud')?.key||model.regions.keys().next().value,selectedIds=[],visible=[];
  function select(ids,scroll=false){
    selectedIds=ids;
    for(const e of host.querySelectorAll('[data-select-target]'))e.setAttribute('aria-pressed',String(ids.includes(e.dataset.selectTarget)));
    for(const e of host.querySelectorAll('[data-target-row]'))e.classList.toggle('selected',ids.includes(e.dataset.targetRow));
    for(const e of host.querySelectorAll('[data-pin-targets]'))e.setAttribute('aria-pressed',String(e.dataset.pinTargets.split(',').some(id=>ids.includes(id))));
    const selected=visible.filter(t=>ids.includes(t.id)),label=host.querySelector('#mapSelection');
    if(label)label.textContent=selected.length?selected.map(t=>`No.${t.beastId} ${model.byId.get(t.beastId).name} ← Lv.${t.level} ${t.name} · ${capturePosition(t)}`).join(' / '):'지도 핀이나 대상 이름을 선택하세요.';
    if(scroll&&selected.length)host.querySelector(`[data-target-row="${selected[0].id}"]`)?.scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  function render(beasts){
    if(!model.captures.length){host.textContent='포획 지도 자료를 불러오지 못했어요. 새로고침하거나 획득처의 기존 참고 지도를 이용해 주세요.';return 0;}
    visible=model.regionTargets(regionKey,beasts);
    const region=model.regions.get(regionKey),map=model.captureMaps[region.mapId],hostWidth=host.clientWidth||1049,mapWidth=doc.defaultView.innerWidth<=800?hostWidth:(hostWidth-22)*1.2/2.2,pins=pinGroups(visible,mapWidth);
    const count=new Set(visible.map(t=>t.beastId)).size,unmapped=visible.filter(t=>!t.coordinates).length;
    host.innerHTML=`<div class="atlas-toolbar"><label for="mapRegion">지역·임무<select id="mapRegion">${['field','duty'].map(type=>`<optgroup label="${type==='field'?'필드 지역':'임무'}">${[...model.regions.values()].filter(r=>r.type===type).map(r=>`<option value="${esc(r.key)}" ${r.key===regionKey?'selected':''}>${esc(r.name)} · ${new Set(model.regionTargets(r.key,beasts).map(t=>t.beastId)).size}종</option>`).join('')}</optgroup>`).join('')}</select></label><p id="mapCount" role="status"><strong>${count}종</strong> · 포획 대상 ${visible.length}건${map?` · 지도 ${visible.length-unmapped}건 / 좌표 미등록 ${unmapped}건`:''}</p></div><div class="atlas-layout ${map?'':'atlas-duty'}"><div class="atlas-map-column">${map?`<figure class="region-map"><img data-atlas-map src="${esc(map.url)}" alt="${esc(region.name)} 포획 지도" width="1024" height="1024">${pins.map(group=>{const point=mapPosition(group[0].coordinates,map.sizeFactor),numbers=pinLabel(group);return `<button class="atlas-pin" data-pin-targets="${group.map(t=>t.id).join(',')}" style="left:${point.x}%;top:${point.y}%" aria-pressed="false" aria-label="${esc(group.map(t=>`No.${t.beastId} ${t.name}`).join(', '))} 위치" title="${esc(group.map(t=>t.name).join(' · '))}">${numbers}</button>`;}).join('')}<figcaption data-atlas-status role="status">지도를 불러오는 중…</figcaption></figure><p class="map-credit">지도 © SQUARE ENIX · 제공 XIVAPI</p>`:`<div class="atlas-no-map"><strong>${esc(region.name)}</strong><p>임무 내부의 포획 대상입니다.<br>세부 좌표가 공개되지 않아 대상 목록으로 안내해요.</p></div>`}<p id="mapSelection" class="map-selection" role="status"></p><p class="atlas-note">${map?'핀에는 마수도감 번호나 묶인 종 수가 표시됩니다. 가까운 대상은 핀 하나에 묶으며, 각각의 좌표는 목록에서 확인할 수 있어요. ':''}목록은 공개된 포획 제보 전체이며, 모든 출현 지점을 뜻하지는 않아요.</p></div><div class="atlas-targets" aria-label="이 지역의 포획 대상">${visible.length?visible.map(t=>{const beast=model.byId.get(t.beastId);return `<article class="atlas-target" data-target-row="${esc(t.id)}"><button class="target-heading" data-select-target="${esc(t.id)}" aria-pressed="false"><span class="target-number">${beast.id}</span><span><strong>Lv.${t.level} ${esc(t.name)}</strong><small>→ ${esc(beast.name)}</small></span></button><div class="target-meta"><span class="capture-kind">${esc(captureKind(t))}</span><span>${esc(capturePosition(t))}</span></div>${t.event&&t.kind==='fate'?`<p class="target-event">돌발임무: ${esc(t.event)}</p>`:''}${t.note?`<p class="capture-warning">${esc(t.note)}</p>`:''}<div class="target-actions"><button class="target-check" data-check="${beast.id}" aria-pressed="false"><span class="check-mark" aria-hidden="true">＋</span> <span class="state-label">미수집</span></button><button class="quiet" data-detail="${beast.id}">획득처</button>${t.coordinates?`<button class="quiet" data-copy-target="${esc(t.id)}">좌표 복사</button>`:''}${external(t.source.url,'출처')}</div></article>`;}).join(''):'<p class="atlas-empty">이 지역에 조건에 맞는 포획 대상이 없어요. 수집 상태·검색어를 바꾸거나 다른 지역을 선택해 주세요.</p>'}</div></div><p class="atlas-source">포획 제보: ${external('https://ffxivcollect.com/beasts','FFXIV Collect')} · 2026-09-09 확인 · 좌표는 대표 위치</p>`;
    host.querySelector('#mapRegion').onchange=e=>{regionKey=e.target.value;selectedIds=[];onRegionChange();};
    const kept=selectedIds.filter(id=>visible.some(t=>t.id===id));
    select(kept.length?kept:visible.length?[visible[0].id]:[]);
    if(!visible.length)host.querySelector('#mapSelection').textContent='표시할 대상이 없어요.';
    return count;
  }
  host.addEventListener('click',async event=>{
    const b=event.target.closest('button');if(!b)return;
    if(b.dataset.pinTargets)select(b.dataset.pinTargets.split(','),true);
    if(b.dataset.selectTarget)select([b.dataset.selectTarget]);
    if(b.dataset.copyTarget){const t=visible.find(t=>t.id===b.dataset.copyTarget),value=`${t.name} · ${model.regions.get(t.regionKey).name} X:${t.coordinates.x} Y:${t.coordinates.y} 부근`,status=host.querySelector('#mapSelection');
      try{await doc.defaultView.navigator.clipboard.writeText(value);status.textContent=`복사 완료: ${value}`;}catch{status.textContent=`직접 복사해 주세요: ${value}`;}}
  });
  host.addEventListener('load',e=>{if(e.target.matches?.('[data-atlas-map]'))e.target.closest('figure').querySelector('[data-atlas-status]').hidden=true;},true);
  host.addEventListener('error',e=>{if(e.target.matches?.('[data-atlas-map]')){const figure=e.target.closest('figure');figure.classList.add('atlas-map-failed');figure.querySelector('[data-atlas-status]').textContent='지도를 불러오지 못했어요. 대상 목록의 좌표와 출처를 이용해 주세요.';}},true);
  function updateOwned(owned){for(const row of host.querySelectorAll('[data-target-row]')){const t=visible.find(t=>t.id===row.dataset.targetRow);row.classList.toggle('collected',owned.has(t.beastId));}for(const pin of host.querySelectorAll('[data-pin-targets]'))pin.classList.toggle('collected',pin.dataset.pinTargets.split(',').every(id=>owned.has(visible.find(t=>t.id===id).beastId)));}
  return {render,updateOwned,open(key,target){regionKey=key;selectedIds=target?[target]:[];}};
}
