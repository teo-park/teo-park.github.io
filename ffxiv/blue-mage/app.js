/* Browser-local learning record. Public metadata is bundled with the page. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id),D=window.BLUE_MAGE_DATA,E=window.BlueMageBook,KEY='teo-ffxiv.blue-mage.collection.v1';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId=new Map((D?.spells||[]).map(s=>[s.id,s]));
  let learned=new Set(),filtered=[],page=1,pageItems=[],view='number',history=[];
  const read=()=>{const raw=localStorage.getItem(KEY);return raw===null?new Set():E.parseBackup(raw);};
  const knownCount=ids=>[...ids].filter(id=>byId.has(id)).length;
  function notify(text){$('noticeText').textContent=text;$('notice').hidden=false;$('undo').hidden=!history.length;}
  function counts(){
    const count=knownCount(learned);$('learnedCount').textContent=count;$('totalCount').textContent=`/ ${D.count}종`;
    $('remainingCount').textContent=`미습득 ${D.count-count}종`;$('learnedPercent').textContent=(count/D.count*100).toFixed(1)+'%';
    $('collectionProgress').value=count;$('collectionProgress').max=D.count;$('collectionProgress').setAttribute('aria-label',`청마법 ${count} / ${D.count}종 습득`);
    $('recordCount').textContent=`습득 ${count}종`+(learned.size>count?` · 현재 목록 외 ${learned.size-count}개 번호도 보존 중`:'');
    $('markPage').disabled=!pageItems.some(s=>!learned.has(s.id));
  }
  function updateChecks(){
    for(const button of document.querySelectorAll('[data-collect]')){
      const checked=learned.has(+button.dataset.collect);button.setAttribute('aria-pressed',String(checked));
      button.closest('.spell-tile,.location-entry')?.classList.toggle('is-learned',checked);
      if(button.classList.contains('spell-check'))button.querySelector('.collection-state').textContent=checked?'✓ 습득':'미습득';
      else button.textContent=button.classList.contains('detail-check')?(checked?'✓ 습득 완료 · 누르면 해제':'이 청마법 습득 체크'):(checked?'✓ 습득':'습득 체크');
    }
    for(const p of document.querySelectorAll('[data-totem-count]')){
      const total=+p.dataset.totemCount,current=knownCount(learned);p.textContent=`수첩 기록 ${current} / ${total}종${current>=total?' · 습득 개수 조건 충족':' · '+(total-current)+'종 더 필요'}`;
    }
    for(const p of document.querySelectorAll('[data-group-count]')){
      const ids=p.dataset.groupCount.split(',').map(Number),count=ids.filter(id=>learned.has(id)).length;p.textContent=`${ids.length}종 · 미습득 ${ids.length-count}종`;
    }
  }
  function save(changes,message,remember=true){
    try{
      const latest=read(),next=new Set(latest),before=[];
      for(const [id,checked] of changes){if(next.has(id)===checked)continue;before.push([id,next.has(id)]);if(checked)next.add(id);else next.delete(id);}
      if(before.length){localStorage.setItem(KEY,E.backup(next));if(remember){history.push(before);if(history.length>25)history.shift();}}
      learned=next;counts();updateChecks();$('fatal').hidden=true;
      if($('status').value!=='all')$('refreshResults').hidden=false;notify(message);return true;
    }catch{notify('저장하지 못했어요. 기존 기록은 그대로입니다. 브라우저 저장 공간·권한을 확인해 주세요.');return false;}
  }
  function toggle(id){if(!byId.has(id))return;try{const checked=!read().has(id);save([[id,checked]],`${byId.get(id).name} · ${checked?'습득 체크했어요.':'체크를 해제했어요.'}`);}catch{notify('기존 기록을 읽지 못해 변경하지 않았어요.');}}
  const options=()=>Object.fromEntries(['status','source','location','aspect','rank'].map(id=>[id,$(id).value]).concat([['query',$('search').value]]));
  function refilter(){filtered=E.filter(D.spells,learned,options());page=1;$('refreshResults').hidden=true;render();}
  function reset(){for(const id of ['status','source','location','aspect','rank'])$(id).value='all';$('search').value='';refilter();}
  const spellNumber=id=>'No. '+String(id).padStart(3,'0');
  function tile(s){
    const checked=learned.has(s.id),places=[...new Set(s.sources.map(x=>x.location))];
    return `<article class="spell-tile ${checked?'is-learned':''}"><button type="button" class="spell-check" data-collect="${s.id}" aria-label="${spellNumber(s.id)} ${esc(s.name)} 습득" aria-pressed="${checked}"><span class="spell-number-row"><span>${spellNumber(s.id)}</span><span class="collection-state">${checked?'✓ 습득':'미습득'}</span></span><img src="${esc(s.icon)}" alt="" width="44" height="44" loading="lazy"><span class="spell-name">${esc(s.name)}</span></button><div class="spell-attributes">${esc(s.aspect==='없음'?'무속성':s.aspect)} · <span aria-label="등급 ${s.rank}">${'★'.repeat(s.rank)}</span></div><button class="source-button" type="button" data-detail="${s.id}" aria-label="${esc(s.name)} 습득처"><span>${esc(places[0])}${places.length>1?' 외 '+(places.length-1)+'곳':''}</span><b>습득처 보기 ↗</b></button></article>`;
  }
  const sourceSummary=s=>[s.enemy,s.coordinates?`X:${s.coordinates.x} Y:${s.coordinates.y}`:'',s.condition].filter(Boolean).join(' · ');
  function groupCard(g){
    return `<section class="location-group"><div class="location-heading"><div><h3>${esc(g.name)}</h3><p>${esc(D.types[g.type])}${g.level?' · Lv.'+g.level:''} · <span data-group-count="${g.spells.map(x=>x.spell.id).join(',')}"></span></p></div><a href="${esc(g.link)}" target="_blank" rel="noopener noreferrer">공식 안내 ↗</a></div>${g.spells.map(({spell:s,sources})=>`<div class="location-entry"><img src="${esc(s.icon)}" alt="" width="36" height="36" loading="lazy"><button class="row-title" data-detail="${s.id}"><small>${spellNumber(s.id)}</small><strong>${esc(s.name)} ↗</strong></button><p>${sources.map(x=>esc(sourceSummary(x)||'해당 퀘스트에서 습득')).join('<br>')}</p><button data-collect="${s.id}" aria-label="${esc(s.name)} 습득" aria-pressed="false">습득 체크</button></div>`).join('')}</section>`;
  }
  function render(){
    const groups=view==='location'?E.groupByLocation(filtered,options()):[],items=view==='location'?groups:filtered,size=view==='location'?10:30,pages=Math.max(1,Math.ceil(items.length/size));
    page=Math.min(page,pages);const start=(page-1)*size,visible=items.slice(start,start+size);
    pageItems=view==='location'?[...new Map(visible.flatMap(g=>g.spells.map(x=>[x.spell.id,x.spell]))).values()]:visible;
    $('resultCount').textContent=`${filtered.length}종`+(view==='location'?` · ${groups.length}곳`:filtered.length?` · ${start+1}–${start+visible.length}`:'');
    $('numberView').setAttribute('aria-pressed',view==='number');$('locationView').setAttribute('aria-pressed',view==='location');
    $('viewHint').textContent=view==='number'?'아이콘 = 습득 체크 · 습득처 = 장소와 조건':'같은 장소에서 배울 수 있는 청마법을 모았어요. 여러 습득처가 있으면 각 장소에 표시합니다.';
    $('spellGrid').hidden=view!=='number';$('locationGroups').hidden=view!=='location';
    $('spellGrid').innerHTML=view==='number'?visible.map(tile).join(''):'';$('locationGroups').innerHTML=view==='location'?visible.map(groupCard).join(''):'';
    $('emptyResults').hidden=!!filtered.length;$('markPage').hidden=!pageItems.length;$('markPage').textContent=`이 페이지 ${pageItems.length}종 모두 습득`;
    const nums=[...new Set([1,...Array.from({length:5},(_,i)=>page+i-2).filter(n=>n>0&&n<=pages),pages])].sort((a,b)=>a-b);
    $('pagination').hidden=pages<=1;$('pagination').innerHTML=`<button data-page="${page-1}" ${page===1?'disabled':''} aria-label="이전 페이지">←</button>`+nums.map((n,i)=>(i&&n-nums[i-1]>1?'<span aria-hidden="true">…</span>':'')+`<button data-page="${n}" ${n===page?'aria-current="page"':''} aria-label="${n}페이지">${n}</button>`).join('')+`<button data-page="${page+1}" ${page===pages?'disabled':''} aria-label="다음 페이지">→</button><span class="page-summary">${page} / ${pages} 페이지</span>`;
    counts();updateChecks();
  }
  function detail(id){
    const s=byId.get(id);if(!s)return;
    $('detailBody').innerHTML=`<div class="detail-hero"><img src="${esc(s.icon)}" alt="" width="64" height="64"><div><p class="book-number">${spellNumber(s.id)} · 패치 ${esc(s.patch)}</p><h2 id="detailTitle">${esc(s.name)}</h2><p lang="en">${esc(s.original)}</p></div></div><div class="detail-stats"><span>${esc(s.type)} · ${esc(s.aspect==='없음'?'무속성':s.aspect)}</span><span>등급 ${'★'.repeat(s.rank)}</span><span>기본 시전 ${s.cast?s.cast+'초':'즉시'}</span><span>재사용 ${s.recast}초</span><span>거리 ${s.range}m · 범위 ${s.radius}m</span></div><button class="detail-check" data-collect="${s.id}" aria-pressed="false">이 청마법 습득 체크</button><h3>습득 장소와 조건</h3><ul class="detail-sources">${s.sources.map(x=>`<li><span class="source-type">${esc(D.types[x.type])}${x.level?' · 임무 Lv.'+x.level:''}</span><h3>${esc(x.location)}</h3>${x.enemy?`<p>대상: ${esc(x.enemy)}</p>`:''}${x.coordinates?`<p>좌표 X:${x.coordinates.x} · Y:${x.coordinates.y}</p>`:''}${x.condition?`<p class="source-condition">${esc(x.condition)}</p>`:''}${x.prerequisite?`<p>${esc(x.prerequisite)}</p>`:''}${x.requirement?.type==='learned'?`<p class="totem-progress" data-totem-count="${x.requirement.count}"></p>`:''}<div class="source-links"><a href="${esc(x.link)}" target="_blank" rel="noopener noreferrer">공식 안내 ↗</a><button data-location="${esc(x.locationKey)}">이 장소의 미습득 보기</button></div><details class="source-original"><summary>습득처 원문 · 출처</summary><p lang="en">${esc(x.original)}</p><a href="${esc(x.sourceUrl)}" target="_blank" rel="noopener noreferrer">FFXIV Collect ↗</a></details></li>`).join('')}</ul><div class="detail-links"><a href="${esc(D.source.guide)}#anchor_h3" target="_blank" rel="noopener noreferrer">한국 공식 체득 안내 ↗</a><a href="${esc(s.collect)}" target="_blank" rel="noopener noreferrer">FFXIV Collect 스킬 정보 ↗</a></div>`;
    updateChecks();$('detailDialog').showModal();
  }
  function previewNumbers(){
    $('applyNumbers').disabled=true;
    if(!$('learnedNumbers').value.trim()){$('numberPreview').textContent='쉼표·공백으로 구분하고, 연속된 번호는 1-10처럼 입력하세요.';return;}
    try{const ids=E.parseNumbers($('learnedNumbers').value,D.spells);$('numberPreview').textContent=`${ids.size}종 선택 · ${[...ids].filter(id=>!learned.has(id)).length}종 새로 추가`;$('applyNumbers').disabled=false;}catch(e){$('numberPreview').textContent=e.message;}
  }
  function events(){
    $('search').addEventListener('input',refilter);$('search').addEventListener('compositionupdate',()=>queueMicrotask(refilter));$('search').addEventListener('compositionend',refilter);
    $('clearSearch').addEventListener('click',()=>{$('search').value='';refilter();$('search').focus();});
    for(const id of ['status','source','location','aspect','rank'])$(id).addEventListener('change',refilter);
    for(const id of ['resetFilters','emptyReset'])$(id).addEventListener('click',reset);
    $('refreshResults').addEventListener('click',refilter);
    $('numberView').addEventListener('click',()=>{view='number';page=1;render();});$('locationView').addEventListener('click',()=>{view='location';page=1;render();});
    document.addEventListener('click',event=>{
      const b=event.target.closest('[data-collect],[data-detail],[data-location]');if(!b)return;
      if(b.hasAttribute('data-collect'))toggle(+b.dataset.collect);
      else if(b.hasAttribute('data-detail'))detail(+b.dataset.detail);
      else {for(const id of ['source','aspect','rank'])$(id).value='all';$('search').value='';$('status').value='unlearned';$('location').value=b.dataset.location;view='location';$('detailDialog').close();refilter();$('spellCatalog').scrollIntoView({block:'start'});}
    });
    $('pagination').addEventListener('click',event=>{const b=event.target.closest('[data-page]');if(!b||b.disabled)return;page=+b.dataset.page;render();$('spellCatalog').scrollIntoView({block:'start'});$('pagination').querySelector('[aria-current=page]')?.focus({preventScroll:true});});
    $('markPage').addEventListener('click',()=>save(pageItems.map(s=>[s.id,true]),`현재 페이지 ${pageItems.length}종을 습득으로 체크했어요.`));
    $('undo').addEventListener('click',()=>{const previous=history.at(-1);if(previous&&save(previous,'방금 변경을 되돌렸어요.',false)){history.pop();$('undo').hidden=!history.length;}});
    $('closeNotice').addEventListener('click',()=>{$('notice').hidden=true;});$('closeDetail').addEventListener('click',()=>$('detailDialog').close());
    $('openRecords').addEventListener('click',()=>{$('recordMessage').textContent='';previewNumbers();$('recordsDialog').showModal();});$('closeRecords').addEventListener('click',()=>$('recordsDialog').close());
    $('learnedNumbers').addEventListener('input',previewNumbers);
    $('applyNumbers').addEventListener('click',()=>{
      try{const ids=E.parseNumbers($('learnedNumbers').value,D.spells),latest=read(),added=[...ids].filter(id=>!latest.has(id)).length,message=`번호로 ${added}종을 습득 기록에 추가했어요.`;
        if(save([...ids].map(id=>[id,true]),message)){$('recordMessage').textContent=message;$('learnedNumbers').value='';previewNumbers();refilter();}else $('recordMessage').textContent='저장하지 못해 등록을 적용하지 않았어요.';
      }catch(e){$('recordMessage').textContent=e.message;}
    });
    $('exportRecords').addEventListener('click',()=>{try{const blob=new Blob([E.backup(read())],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`ffxiv-blue-mage-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('recordMessage').textContent='백업 파일을 내보냈어요.';}catch{$('recordMessage').textContent='기록을 읽을 수 없어 내보내지 못했어요.';}});
    $('importRecords').addEventListener('click',()=>$('importFile').click());
    $('importFile').addEventListener('change',async()=>{
      const input=$('importFile'),file=input.files[0];if(!file)return;
      try{if(file.size>1000000)throw Error('백업 파일은 1MB 이하만 가져올 수 있어요.');const ids=E.parseBackup(await file.text()),latest=read(),added=[...ids].filter(id=>!latest.has(id)).length,message=`${added}개 습득 기록을 추가했어요. 기존 기록도 유지됩니다.`;
        if(save([...ids].map(id=>[id,true]),message)){$('recordMessage').textContent=message;previewNumbers();refilter();}else $('recordMessage').textContent='저장하지 못해 가져오기를 적용하지 않았어요.';
      }catch(e){$('recordMessage').textContent=e.message;}finally{input.value='';}
    });
    window.addEventListener('storage',event=>{if(event.key!==KEY&&event.key!==null)return;try{learned=read();history=[];counts();updateChecks();previewNumbers();$('undo').hidden=true;if($('status').value!=='all')$('refreshResults').hidden=false;notify('다른 탭에서 변경한 습득 기록을 반영했어요.');}catch{notify('다른 탭의 기록을 읽지 못했어요.');}});
    document.addEventListener('error',event=>{const img=event.target;if(!(img instanceof HTMLImageElement))return;const el=document.createElement('span');el.className='image-fallback';el.setAttribute('aria-hidden','true');el.textContent='청';img.replaceWith(el);},true);
  }
  try{
    if(!D||!E||D.count!==D.spells.length)throw Error('청마법 자료를 불러오지 못했어요. 새로고침해 주세요.');
    try{learned=read();}catch{$('fatal').textContent='저장된 기록을 읽지 못했어요. 기존 데이터를 덮어쓰지 않았습니다.';$('fatal').hidden=false;}
    $('source').insertAdjacentHTML('beforeend',Object.entries(D.types).map(([id,name])=>`<option value="${id}">${esc(name)}</option>`).join(''));
    const places=E.groupByLocation(D.spells);$('location').insertAdjacentHTML('beforeend',places.map(g=>`<option value="${esc(g.key)}">${esc(g.name)}${g.level?' · Lv.'+g.level:''}</option>`).join(''));
    $('aspect').insertAdjacentHTML('beforeend',[...new Set(D.spells.map(s=>s.aspect))].map(a=>`<option value="${esc(a)}">${esc(a==='없음'?'무속성':a)}</option>`).join(''));
    $('dataNote').innerHTML=`${esc(D.updatedAt)} 기준 · 청마법 ${D.count}종 · 습득 경로 ${D.sourceCount}개. 한국어 게임 명칭과 공개 습득처 자료를 사용합니다. <a href="./README.md">데이터 범위·출처</a>`;
    events();refilter();
    window.BlueMageScanUI?.mount({spells:D.spells,apply:ids=>{
      if(!Array.isArray(ids)||!ids.length||ids.some(id=>!Number.isSafeInteger(id)||!byId.has(id)))return {ok:false,error:'수첩에 없는 번호가 포함되어 있어요.'};
      try{const latest=read(),unique=[...new Set(ids)],added=unique.filter(id=>!latest.has(id)).length,message=`캡처에서 ${added}종을 습득 기록에 추가했어요.`;
        if(!save(unique.map(id=>[id,true]),message))return {ok:false,error:'저장하지 못해 등록을 적용하지 않았어요.'};
        $('recordMessage').textContent=message;previewNumbers();refilter();return {ok:true,message};
      }catch{return {ok:false,error:'기존 기록을 읽지 못해 등록하지 않았어요.'};}
    }});
    $('loading').hidden=true;$('appContent').hidden=false;$('openRecords').disabled=false;
  }catch(e){$('loading').hidden=true;$('fatal').textContent=e.message;$('fatal').hidden=false;}
})();
