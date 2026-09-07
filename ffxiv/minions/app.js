/* Local collection state. No account, upload, analytics, or runtime catalog requests. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id),D=window.MINION_DATA,E=window.MinionCollection;
  const storageKey='teo-ffxiv.minions.collection.v1';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let owned=new Set(),filtered=[],page=1,pageSize=96,pageItems=[],activeDetail=null,history=[];
  const byId=new Map((D?.minions||[]).map(m=>[m.id,m]));
  const knownCount=ids=>[...ids].filter(id=>byId.has(id)).length;
  function read(){const raw=localStorage.getItem(storageKey);return raw===null?new Set():E.parseBackup(raw);}
  function notice(text){$('noticeText').textContent=text;$('notice').hidden=false;$('undo').hidden=!history.length;}
  function updateCounts(){
    const count=knownCount(owned),pct=(count/D.count*100).toFixed(1);
    $('ownedCount').textContent=count;$('totalCount').textContent=`/ ${D.count}종`;
    $('ownedPercent').textContent=pct+'%';$('remainingCount').textContent=`아직 만나지 못한 친구 ${D.count-count}종`;
    $('collectionProgress').value=count;$('collectionProgress').max=D.count;
    $('collectionProgress').setAttribute('aria-label',`꼬마친구 ${count} / ${D.count}종 수집`);
    $('recordCount').textContent=`보유 ${count}종`+(owned.size>count?` · 현재 목록 외 ${owned.size-count}개 ID도 보존 중`:'');
    $('markPage').disabled=!pageItems.some(m=>!owned.has(m.id));
  }
  function updateTiles(){
    for(const tile of document.querySelectorAll('.minion-tile')){
      const id=+tile.dataset.id,checked=owned.has(id);tile.classList.toggle('is-owned',checked);
      const button=tile.querySelector('[data-collect]');button.setAttribute('aria-pressed',String(checked));
      tile.querySelector('.collection-state').textContent=checked?'보유':'미수집';
    }
    const detail=$('detailBody').querySelector('[data-collect]');
    if(detail){const checked=owned.has(+detail.dataset.collect);detail.setAttribute('aria-pressed',String(checked));detail.textContent=checked?'✓ 보유 중 · 누르면 체크 해제':'보유한 꼬마친구로 체크';}
  }
  function saveChanges(changes,message,remember=true){
    try{
      const latest=read(),next=new Set(latest),before=[];
      for(const [id,checked]of changes){if(latest.has(id)===checked)continue;before.push([id,latest.has(id)]);if(checked)next.add(id);else next.delete(id);}
      if(before.length){localStorage.setItem(storageKey,E.backup(next));if(remember){history.push(before);if(history.length>25)history.shift();}}
      owned=next;updateCounts();updateTiles();
      if($('status').value!=='all')$('refreshResults').hidden=false;
      $('fatal').hidden=true;notice(message);return true;
    }catch(error){notice('저장하지 못했어요. 기존 기록은 그대로입니다. 브라우저 저장 공간·권한을 확인해 주세요.');return false;}
  }
  function toggle(id){
    const m=byId.get(id);if(!m)return;
    let checked;try{checked=!read().has(id);}catch{notice('기존 수집 기록을 읽지 못해 변경하지 않았어요.');return;}
    saveChanges([[id,checked]],m.name+(checked?' · 보유 체크했어요.':' · 체크를 해제했어요.'));
  }
  function options(){return {query:$('search').value,status:$('status').value,source:$('source').value,expansion:$('expansion').value,tradeable:$('tradeable').checked,excludeSpecial:$('excludeSpecial').checked};}
  function refilter(){filtered=E.sort(E.filter(D.minions,owned,options()),$('sort').value);page=1;$('refreshResults').hidden=true;renderList();}
  function reset(){for(const id of ['search','status','source','expansion','sort'])$(id).value=id==='search'?'':id==='sort'?'game':'all';$('tradeable').checked=false;$('excludeSpecial').checked=false;refilter();}
  function tile(m){const checked=owned.has(m.id);return `<article class="minion-tile ${checked?'is-owned':''}" data-id="${m.id}"><button type="button" class="collect-button" data-collect="${m.id}" aria-label="${esc(m.name)} 보유" aria-pressed="${checked}"><span class="collection-tick" aria-hidden="true">✓</span><img src="${esc(m.icon)}" alt="" width="52" height="52" loading="lazy"><span class="minion-name">${esc(m.name)}</span><span class="collection-state" aria-hidden="true">${checked?'보유':'미수집'}</span></button><button type="button" class="source-button" data-detail="${m.id}" aria-label="${esc(m.name)} 획득처">획득처 ↗</button></article>`;}
  function renderList(){
    const pages=Math.max(1,Math.ceil(filtered.length/pageSize));page=Math.min(page,pages);
    const start=(page-1)*pageSize;pageItems=filtered.slice(start,start+pageSize);
    $('resultCount').textContent=`${filtered.length}종`+(filtered.length?` · ${start+1}–${start+pageItems.length}`:'');
    $('minionGrid').innerHTML=pageItems.map(tile).join('');$('emptyResults').hidden=filtered.length!==0;
    $('markPage').hidden=!pageItems.length;$('markPage').textContent=`이 페이지 ${pageItems.length}종 모두 보유`;
    const numbers=[...new Set([1,...Array.from({length:5},(_,i)=>page+i-2).filter(n=>n>0&&n<=pages),pages])].sort((a,b)=>a-b);
    $('pagination').hidden=pages<=1;
    $('pagination').innerHTML=`<button type="button" data-page="${page-1}" ${page===1?'disabled':''} aria-label="이전 페이지">←</button>`+numbers.map((n,i)=>(i&&n-numbers[i-1]>1?'<span aria-hidden="true">…</span>':'')+`<button type="button" data-page="${n}" ${n===page?'aria-current="page"':''} aria-label="${n}페이지">${n}</button>`).join('')+`<button type="button" data-page="${page+1}" ${page===pages?'disabled':''} aria-label="다음 페이지">→</button><span class="page-summary">${page} / ${pages} 페이지</span>`;
    updateCounts();
  }
  function detail(m){
    activeDetail=m.id;
    $('detailBody').innerHTML=`<div class="detail-hero"><img src="${esc(m.image)}" alt="${esc(m.name)}" width="88" height="88"><div><h2 id="detailTitle">${esc(m.name)}</h2><p lang="en">${esc(m.original)}</p><div class="detail-tags"><span>패치 ${esc(m.patch)}</span><span>${m.tradeable?'거래 가능':'거래 불가'}</span></div></div></div><button type="button" class="detail-check" data-collect="${m.id}" aria-pressed="${owned.has(m.id)}"></button><p class="source-note">획득처·패치는 글로벌 공개 자료 기준입니다. 한국 서버의 이벤트 일정·판매 여부는 공식 가이드와 공지에서 확인해 주세요.</p><h3>어디서 얻나요?</h3><ul class="detail-sources">${m.sources.length?m.sources.map(s=>`<li><span class="source-type">${esc(s.typeName)}</span><h3>${esc(s.name)}</h3>${s.condition?`<p>${esc(s.condition)}</p>`:''}<a href="${esc(s.link)}" target="_blank" rel="noopener noreferrer">${esc(s.linkLabel)} ↗</a>${s.name!==s.original?`<details class="source-original"><summary>획득처 원문</summary><p lang="en">${esc(s.original)}</p></details>`:''}</li>`).join(''):'<li><h3>획득처 확인 중</h3><p>현재 공개 자료에 획득 경로가 등록되어 있지 않아요.</p></li>'}</ul><p class="source-note">${m.tradeable?'거래 가능한 꼬마친구입니다. 장터 게시판에서도 이름으로 찾아볼 수 있어요.':'직접 획득해야 하는 거래 불가 꼬마친구입니다.'}</p><div class="detail-links"><a href="${esc(m.official)}" target="_blank" rel="noopener noreferrer">${m.officialExact?'한국 공식 아이템 안내':'한국 공식 가이드 검색'} ↗</a><a href="${esc(m.collect)}" target="_blank" rel="noopener noreferrer">FFXIV Collect 원본 ↗</a></div>`;
    updateTiles();$('detailDialog').showModal();
  }
  function events(){
    // Read the current composing value too, so the final Korean consonant is searchable.
    $('search').addEventListener('input',refilter);$('search').addEventListener('compositionupdate',()=>queueMicrotask(refilter));$('search').addEventListener('compositionend',refilter);
    $('clearSearch').addEventListener('click',()=>{$('search').value='';refilter();$('search').focus();});
    for(const id of ['status','source','expansion','sort','tradeable','excludeSpecial'])$(id).addEventListener('change',refilter);
    $('resetFilters').addEventListener('click',reset);$('emptyReset').addEventListener('click',reset);$('refreshResults').addEventListener('click',refilter);
    $('pageSize').addEventListener('change',()=>{pageSize=$('pageSize').value==='all'?D.count:+$('pageSize').value;page=1;renderList();});
    document.addEventListener('click',event=>{
      const collect=event.target.closest('[data-collect]');if(collect){toggle(+collect.dataset.collect);return;}
      const info=event.target.closest('[data-detail]');if(info)detail(byId.get(+info.dataset.detail));
    });
    $('pagination').addEventListener('click',event=>{const button=event.target.closest('[data-page]');if(!button||button.disabled)return;page=+button.dataset.page;renderList();document.querySelector('.catalog').scrollIntoView({block:'start'});$('pagination').querySelector('[aria-current=page]')?.focus({preventScroll:true});});
    $('markPage').addEventListener('click',()=>saveChanges(pageItems.map(m=>[m.id,true]),`현재 페이지의 ${pageItems.length}종을 보유로 체크했어요.`));
    $('undo').addEventListener('click',()=>{const change=history.at(-1);if(!change)return;if(saveChanges(change,'방금 변경을 되돌렸어요.',false)){history.pop();$('undo').hidden=!history.length;}});
    $('closeNotice').addEventListener('click',()=>{$('notice').hidden=true;});
    $('closeDetail').addEventListener('click',()=>$('detailDialog').close());
    $('openRecords').addEventListener('click',()=>{$('recordMessage').textContent='';$('recordsDialog').showModal();});
    $('closeRecords').addEventListener('click',()=>$('recordsDialog').close());
    $('exportRecords').addEventListener('click',()=>{
      try{const blob=new Blob([E.backup(read())],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`ffxiv-minions-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('recordMessage').textContent='백업 파일을 내보냈어요.';}
      catch{$('recordMessage').textContent='기록을 읽을 수 없어 내보내지 못했어요.';}
    });
    $('importRecords').addEventListener('click',()=>$('importFile').click());
    $('importFile').addEventListener('change',async()=>{
      const input=$('importFile'),file=input.files[0];if(!file)return;
      try{
        if(file.size>1000000)throw Error('백업 파일은 1MB 이하만 가져올 수 있어요.');
        const ids=E.parseBackup(await file.text()),latest=read(),added=[...ids].filter(id=>!latest.has(id)).length;
        if(saveChanges([...ids].map(id=>[id,true]),`${added}개 기록을 추가했어요.`)){$('recordMessage').textContent=`${added}개 기록을 추가했어요. 기존 보유 기록도 유지됩니다.`;refilter();}
        else $('recordMessage').textContent='저장하지 못해 가져오기를 적용하지 않았어요.';
      }catch(error){$('recordMessage').textContent=error.message;}
      finally{input.value='';}
    });
    window.addEventListener('storage',event=>{
      if(event.key!==storageKey&&event.key!==null)return;
      try{owned=read();history=[];updateCounts();updateTiles();$('undo').hidden=true;if($('status').value!=='all')$('refreshResults').hidden=false;notice('다른 탭에서 변경한 수집 기록을 반영했어요.');}
      catch{notice('다른 탭의 수집 기록을 읽지 못했어요.');}
    });
    document.addEventListener('error',event=>{
      const img=event.target;if(!(img instanceof HTMLImageElement))return;
      const fallback=document.createElement('span');fallback.className='image-fallback';fallback.setAttribute('aria-hidden','true');
      const m=byId.get(+(img.closest('[data-id]')?.dataset.id||activeDetail));fallback.textContent=m?.name[0]||'친';img.replaceWith(fallback);
    },true);
  }
  try{
    if(!D||!E||D.count!==D.minions.length)throw Error('자료를 불러오지 못했어요. 새로고침해 주세요.');
    try{owned=read();}catch{$('fatal').textContent='저장된 기록을 읽지 못했어요. 기존 데이터는 덮어쓰지 않았습니다. 브라우저 저장 공간·권한을 확인해 주세요.';$('fatal').hidden=false;}
    $('source').insertAdjacentHTML('beforeend',D.types.map(([id,name])=>`<option value="${esc(id)}">${esc(name)}</option>`).join('')+'<option value="unknown">획득처 확인 중</option>');
    $('dataNote').innerHTML=`${esc(D.updatedAt)} 기준 · 공개 목록 ${D.count}종 · 한국어 이름 ${D.count}종 · 획득 경로 ${D.sourceCount}개. 목록과 획득처는 글로벌 자료를 포함하며 한국 서버의 현재 획득 가능 수를 뜻하지 않아요. <a href="./README.md">출처·데이터 범위</a>`;
    events();refilter();$('appContent').hidden=false;$('loading').hidden=true;$('openRecords').disabled=false;
  }catch(error){$('loading').hidden=true;$('fatal').textContent=error.message;$('fatal').hidden=false;}
})();
