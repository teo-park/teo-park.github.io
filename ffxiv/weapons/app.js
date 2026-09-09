import {STORAGE_KEY,emptyBackup,emptyRecord,parseBackup,mergeBackups,stageIndex,statusOf,summarize,filterTracks} from './core.js';
import {mountShowcase} from './showcase-ui.js?v=20260909-share1';

const $=id=>document.getElementById(id),esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PREFS='teo-ffxiv.weapons.preferences.v1',PAGE_SIZE=24;
let data,state=emptyBackup(),storageBlocked=false,rawStored=null,undoState=null,pendingImport=null,detailId=null,page=1;
let filters={kind:'relic',series:'zodiac',job:'',status:'',query:'',target:false},layout='list';
let seriesById,jobsById,trackById,showcase;
const label=t=>jobsById.get(t.jobId).name+(t.jobId==='PLD'?(t.slot==='shield'?' · 방패':' · 검'):'');
const getRecord=id=>state.records[id]||emptyRecord();
function warn(text){$('storageWarning').textContent=text;$('storageWarning').hidden=!text;}
function notify(text,undo=false){$('noticeText').textContent=text;$('undo').hidden=!undo;$('notice').hidden=false;}
function latest(){
 if(storageBlocked)throw Error('저장된 기록을 읽지 못해 원본을 보존하고 있습니다. 기록 관리에서 원본을 백업하고 올바른 백업으로 교체해 주세요.');
 const text=localStorage.getItem(STORAGE_KEY);return text?parseBackup(text,data):emptyBackup();
}
function persist(next,{replaceDamaged=false,message='기록을 저장했습니다.'}={}){
 let before;
 try{before=replaceDamaged?state:latest();localStorage.setItem(STORAGE_KEY,JSON.stringify(next));}
 catch(error){warn('자동 저장 실패: '+error.message);notify('기록을 저장하지 못했습니다. 기존 기록을 유지합니다.');return false;}
 undoState={before:structuredClone(before),after:structuredClone(next)};state=next;storageBlocked=false;rawStored=null;warn('');render();notify(message,true);return true;
}
function updateRecord(id,patch){
 try{const base=latest(),next=structuredClone(base);next.records[id]={...(base.records[id]||emptyRecord()),...patch};
  return persist(next,{message:`${label(trackById.get(id))} 기록을 저장했습니다.`});
 }catch(error){warn(error.message);return false;}
}
function setStage(id,itemId){const t=trackById.get(id);if(!t||(itemId!==0&&!t.items.some(i=>i.id===itemId)))return;updateRecord(id,{itemId});}
function preferences(){try{localStorage.setItem(PREFS,JSON.stringify({filters,layout}));}catch{/* Collection storage reports failures separately. */}}
function applyLayout(){
 $('catalog').dataset.collectionLayout=layout;
 document.querySelectorAll('[data-layout]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layout===layout)));
}
function renderSeriesOptions(){
 const available=data.series.filter(s=>!filters.kind||s.kind===filters.kind);
 if(filters.series&&!available.some(s=>s.id===filters.series))filters.series='';
 $('seriesFilter').innerHTML='<option value="">모든 시리즈</option>'+available.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('');$('seriesFilter').value=filters.series;
 document.querySelectorAll('[data-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.kind===filters.kind)));
}
function row(t){
 const r=getRecord(t.id),step=stageIndex(t,r),current=t.items[step?step-1:t.items.length-1],status=statusOf(t,r),isSingle=t.items.length===1;
 const stateText=step?(status==='complete'?(isSingle?'수집 완료':'최종 단계 완료'):`${step} / ${t.items.length}단계 완료`):(isSingle?'미수집':'미시작 · 최종 목표');
 const control=isSingle?`<button class="collect-toggle" data-collect="${t.id}" aria-pressed="${step>0}" aria-label="${esc(label(t)+' '+seriesById.get(t.seriesId).name)} 수집"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m3 8 3 3 7-7"/></svg>수집</button>`:
  `<label for="stage-${t.id}">완료한 단계</label><select id="stage-${t.id}" data-stage="${t.id}"><option value="0"${!step?' selected':''}>미시작</option>${t.items.map((i,n)=>`<option value="${i.id}"${r.itemId===i.id?' selected':''}>${n+1}. ${esc(i.stage)}</option>`).join('')}</select>`;
 return `<article class="weapon-row ${status}" data-track="${t.id}"><img class="weapon-icon" loading="lazy" src="${esc(current.icon)}" alt=""><div class="job-name" data-role="${jobsById.get(t.jobId).role}"><strong>${esc(label(t))}</strong><span>${t.jobId}</span></div><div class="weapon-title"><strong>${esc(current.name)}</strong><span>${stateText} · IL ${current.itemLevel}</span></div><div class="stage-control">${control}</div><button class="details-button" data-detail="${t.id}" aria-label="${esc(label(t)+' '+seriesById.get(t.seriesId).name)} 단계·획득처">${isSingle?'획득처':'단계 보기'}</button><button class="target-button" data-target="${t.id}" aria-pressed="${r.target}" aria-label="${esc(label(t)+' '+seriesById.get(t.seriesId).name)} 관심 무기" title="관심 무기">${r.target?'★':'☆'}</button></article>`;
}
function render(){
 const active=document.activeElement,focus=active?.id||null,focusTarget=active?.dataset?.target,focusCollect=active?.dataset?.collect;
 const total=summarize(data.tracks,state.records);$('completeCount').textContent=total.complete;$('totalCount').textContent=`/ ${total.total}개`;$('progressCount').textContent=total.progress;$('targetCount').textContent=total.targets;
 const list=filterTracks(data,state.records,filters),pages=Math.max(1,Math.ceil(list.length/PAGE_SIZE));page=Math.min(page,pages);
 $('resultCount').textContent=`${list.length}개`;$('targetFilter').setAttribute('aria-pressed',String(filters.target));$('targetFilter').textContent=filters.target?'★ 관심 무기만':'☆ 관심 무기만';
 $('scopeNote').textContent=filters.series?`${seriesById.get(filters.series).name} · ${seriesById.get(filters.series).jobCount}개 직업 · ${seriesById.get(filters.series).labels.length}단계`:'직업·무기별 기록입니다. 지원하지 않는 직업의 무기는 표시하지 않습니다.';
 const visible=list.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE),groups=[...new Set(visible.map(t=>t.seriesId))];
 $('weaponList').innerHTML=groups.map(id=>{const s=seriesById.get(id),stats=summarize(list.filter(t=>t.seriesId===id),state.records);return `<section class="weapon-group"><div class="series-heading"><h3>${esc(s.name)}</h3><span>${s.expansion} · Lv.${s.level} · 완성 ${stats.complete}/${stats.total}</span><a href="${esc(s.source)}" target="_blank" rel="noopener noreferrer">획득 안내 ↗</a></div><div class="weapon-grid">${visible.filter(t=>t.seriesId===id).map(row).join('')}</div></section>`;}).join('');
 $('emptyResults').hidden=list.length>0;
 $('pagination').innerHTML=pages>1?`<button data-page="${page-1}"${page===1?' disabled':''}>이전</button><span>${page} / ${pages} 페이지</span><button data-page="${page+1}"${page===pages?' disabled':''}>다음</button>`:'';
 if(detailId&&$('detailDialog').open)renderDetail();
 showcase?.refresh();
 let restore=focus?$(focus):null;
 if(focusTarget)restore=[...document.querySelectorAll('[data-target]')].find(b=>b.dataset.target===focusTarget);
 if(focusCollect)restore=[...document.querySelectorAll('[data-collect]')].find(b=>b.dataset.collect===focusCollect);
 if(restore)restore.focus({preventScroll:true});else if(active?.closest?.('.weapon-row'))$('resultTitle').focus({preventScroll:true});
}
function renderDetail(){
 const t=trackById.get(detailId),s=seriesById.get(t.seriesId),r=getRecord(t.id),n=stageIndex(t,r),last=t.items.at(-1);
 const note=$('weaponNote')?.value,oldNoteTrack=$('weaponNote')?.dataset.track,scroll=$('detailDialog').scrollTop;
 $('detailTitle').textContent=label(t)+' · '+s.short;
 $('detailBody').innerHTML=`<div class="detail-intro"><img src="${esc(last.icon)}" alt=""><div><h3>${esc(last.name)}</h3><p>${esc(s.name)} · 최종 IL ${last.itemLevel}</p></div></div><div class="acquisition"><p>${esc(s.acquisition)}</p><a href="${esc(s.source)}" target="_blank" rel="noopener noreferrer">획득 경로 자세히 보기 ↗</a></div><p class="muted">완료한 단계의 「여기까지」를 누르면 이전 단계도 함께 기록됩니다. 모조품의 별도 구매 여부는 포함하지 않습니다.</p><ol class="stage-list">${t.items.map((item,i)=>`<li class="${i<n?'done':''} ${i===n-1?'current':''}"><span class="stage-number">${i<n?'✓':i+1}</span><img loading="lazy" src="${esc(item.icon)}" alt=""><div class="stage-info"><strong>${esc(item.name)}</strong><small>${esc(item.stage)} · IL ${item.itemLevel}</small><a href="${esc(item.official)}" target="_blank" rel="noopener noreferrer">공식 가이드 ↗</a></div><button data-set-stage="${item.id}"${i===n-1?' disabled':''}>${i===n-1?'현재 단계':'여기까지'}</button></li>`).join('')}</ol><div class="detail-actions"><button id="clearStage"${n?'':' disabled'}>${t.items.length===1?'미수집으로':'미시작으로'}</button></div><div class="note-area"><label for="weaponNote">진행 메모</label><textarea id="weaponNote" data-track="${t.id}" maxlength="500" rows="3" placeholder="모아 둔 재료, 다음에 할 퀘스트 등">${esc(oldNoteTrack===t.id?note:r.note)}</textarea><button id="saveNote">메모 저장</button></div>`;
 $('detailDialog').scrollTop=scroll;
}
function openDetail(id){detailId=id;renderDetail();$('detailDialog').showModal();$('detailDialog').scrollTop=0;}
function changedFilters(){page=1;preferences();render();}
function resetFilters(){filters={kind:'',series:'',job:'',status:'',query:'',target:false};$('search').value='';$('jobFilter').value='';$('statusFilter').value='';renderSeriesOptions();changedFilters();}
function download(text,name){const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function previewImport(){
 try{
  const incoming=parseBackup($('backupText').value,data),replace=$('importMode').value==='replace';
  const base=replace&&storageBlocked?state:latest(),next=mergeBackups(base,incoming,data,replace);
  const ids=new Set([...Object.keys(base.records),...Object.keys(next.records)]),changes=[...ids].filter(id=>JSON.stringify(base.records[id])!==JSON.stringify(next.records[id])).length;
  const stats=summarize(data.tracks,next.records),unknown=Object.keys(incoming.records).filter(id=>!trackById.has(id)).length;
  pendingImport={incoming,replace,text:$('backupText').value};$('importSummary').textContent=`${replace?'현재 기록 교체':'기존 기록과 합치기'} · ${changes}개 기록 변경 · 적용 후 완성 ${stats.complete}개 / 성장 중 ${stats.progress}개${unknown?` · 다른 버전의 기록 ${unknown}개도 보존`:''}`;$('importPreview').hidden=false;$('recordMessage').textContent='';
 }catch(error){pendingImport=null;$('importPreview').hidden=true;$('recordMessage').textContent='가져오기 실패: '+error.message;}
}
async function boot(){
 try{
  const response=await fetch('./data/weapons.json?v=20260909-1');if(!response.ok)throw Error(`HTTP ${response.status}`);data=await response.json();
  if(data.schemaVersion!==1||!data.tracks?.length)throw Error('데이터 형식 오류');
  seriesById=new Map(data.series.map(s=>[s.id,s]));jobsById=new Map(data.jobs.map(j=>[j.id,j]));trackById=new Map(data.tracks.map(t=>[t.id,t]));
  try{rawStored=localStorage.getItem(STORAGE_KEY);state=rawStored?parseBackup(rawStored,data):emptyBackup();rawStored=null;}catch(error){storageBlocked=true;warn('기록을 읽지 못했습니다. 기존 원본을 보존했습니다. 수집 기록 관리에서 원본을 백업할 수 있습니다. '+error.message);}
  try{const p=JSON.parse(localStorage.getItem(PREFS)||'null');if(p?.filters){filters={...filters,...p.filters};if(!['','relic','ultimate','enhanced'].includes(filters.kind))filters.kind='';if(!seriesById.has(filters.series))filters.series='';if(!jobsById.has(filters.job))filters.job='';if(!['','unstarted','progress','complete'].includes(filters.status))filters.status='';filters.query=typeof filters.query==='string'?filters.query:'';filters.target=!!filters.target;}layout=p?.layout==='grid'?'grid':'list';}catch{}
  $('jobFilter').innerHTML='<option value="">모든 직업</option>'+data.jobs.map(j=>`<option value="${j.id}">${j.name}</option>`).join('');$('jobFilter').value=filters.job;$('statusFilter').value=filters.status;$('search').value=filters.query;
  renderSeriesOptions();applyLayout();render();$('app').hidden=false;$('loadStatus').hidden=true;$('openRecords').disabled=false;
 }catch(error){$('loadStatus').textContent='무기 데이터를 불러오지 못했습니다. 새로고침해 주세요. '+error.message;return;}
 showcase=mountShowcase({catalog:data,getRecords:()=>latest().records});
 $('search').addEventListener('input',()=>{filters.query=$('search').value;changedFilters();});
 $('search').addEventListener('compositionend',()=>{filters.query=$('search').value;changedFilters();});
 $('seriesFilter').addEventListener('change',()=>{filters.series=$('seriesFilter').value;changedFilters();});
 $('jobFilter').addEventListener('change',()=>{filters.job=$('jobFilter').value;changedFilters();});
 $('statusFilter').addEventListener('change',()=>{filters.status=$('statusFilter').value;changedFilters();});
 $('targetFilter').addEventListener('click',()=>{filters.target=!filters.target;changedFilters();});$('resetFilters').addEventListener('click',resetFilters);
 $('kinds').addEventListener('click',e=>{const b=e.target.closest('[data-kind]');if(b){filters.kind=b.dataset.kind;filters.series='';renderSeriesOptions();changedFilters();}});
 document.querySelector('.collection-layout-switch').addEventListener('click',e=>{const b=e.target.closest('[data-layout]');if(b){layout=b.dataset.layout;applyLayout();preferences();}});
 $('weaponList').addEventListener('change',e=>{if(e.target.matches('[data-stage]')){setStage(e.target.dataset.stage,Number(e.target.value));render();}});
 $('weaponList').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.detail)openDetail(b.dataset.detail);if(b.dataset.target)updateRecord(b.dataset.target,{target:!getRecord(b.dataset.target).target});if(b.dataset.collect){const t=trackById.get(b.dataset.collect);setStage(t.id,getRecord(t.id).itemId?0:t.items[0].id);}});
 $('pagination').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b&&!b.disabled){page=Number(b.dataset.page);render();$('catalog').scrollIntoView({block:'start'});$('resultTitle').focus({preventScroll:true});}});
 $('detailBody').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.setStage)setStage(detailId,Number(b.dataset.setStage));if(b.id==='clearStage')setStage(detailId,0);if(b.id==='saveNote'&&updateRecord(detailId,{note:$('weaponNote').value}))$('saveNote').textContent='저장했습니다';});
 document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close).close()));
 $('detailDialog').addEventListener('close',()=>{detailId=null;$('detailBody').innerHTML='';});
 $('openRecords').addEventListener('click',()=>{$('exportRaw').hidden=rawStored===null;$('exportRecords').disabled=storageBlocked;$('recordsDialog').showModal();});
 $('exportRecords').addEventListener('click',()=>{try{const current=storageBlocked?state:latest();download(JSON.stringify({...current,exportedAt:new Date().toISOString()},null,2),`ffxiv-weapons-${new Date().toISOString().slice(0,10)}.json`);}catch(error){$('recordMessage').textContent=error.message;}});
 $('exportRaw').addEventListener('click',()=>download(rawStored||'',`ffxiv-weapons-original.json`));
 $('importRecords').addEventListener('click',()=>$('importFile').click());
 $('importFile').addEventListener('change',async()=>{const f=$('importFile').files[0];if(!f)return;try{if(f.size>2_000_000)throw Error('2MB 이하의 백업을 선택해 주세요.');$('backupText').value=await f.text();previewImport();}catch(error){pendingImport=null;$('importPreview').hidden=true;$('recordMessage').textContent=error.message;}$('importFile').value='';});
 $('previewImport').addEventListener('click',previewImport);
 for(const id of ['backupText','importMode'])$(id).addEventListener(id==='backupText'?'input':'change',()=>{pendingImport=null;$('importPreview').hidden=true;});
 $('applyImport').addEventListener('click',()=>{
  if(!pendingImport)return;
  try{const {incoming,replace}=pendingImport,base=replace&&storageBlocked?state:latest(),next=mergeBackups(base,incoming,data,replace);
   if(persist(next,{replaceDamaged:replace,message:'백업 기록을 가져왔습니다.'})){pendingImport=null;$('importPreview').hidden=true;$('recordMessage').textContent='가져오기를 완료했습니다.';$('exportRaw').hidden=true;$('exportRecords').disabled=false;}
  }catch(error){$('recordMessage').textContent=error.message;}
 });
 $('undo').addEventListener('click',()=>{if(!undoState)return;try{const current=latest();if(JSON.stringify(current)!==JSON.stringify(undoState.after))throw Error('다른 탭의 기록이 변경되어 실행 취소할 수 없습니다.');const before=undoState.before;localStorage.setItem(STORAGE_KEY,JSON.stringify(before));state=before;undoState=null;render();notify('이전 기록으로 되돌렸습니다.');}catch(error){notify(error.message);}});
 $('closeNotice').addEventListener('click',()=>{$('notice').hidden=true;});
 window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY||event.key===null){try{state=latest();undoState=null;render();notify('다른 탭의 수집 기록을 반영했습니다.');}catch(error){warn(error.message);}}});
}
boot();
