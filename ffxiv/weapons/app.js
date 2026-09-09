import {STORAGE_KEY,emptyBackup,emptyRecord,parseBackup,mergeBackups,stageIndex,statusOf,summarize,filterTracks} from './core.js';
import {mountShowcase} from './showcase-ui.js?v=20260909-line1';

const $=id=>document.getElementById(id),esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PREFS='teo-ffxiv.weapons.preferences.v1';
const KIND_NAMES={relic:'성장형',ultimate:'절 무기',enhanced:'재보강'};
const COLUMN_NAMES={zodiac:'제타',ucob:'절 바하무트',uwu:'절 알테마',tea:'절 알렉산더',top:'절 오메가'};
let data,state=emptyBackup(),storageBlocked=false,rawStored=null,undoState=null,pendingImport=null,detailId=null;
let filters={kind:'relic',series:'',job:'',status:'',query:'',target:false};
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
function setStage(id,itemId){const t=trackById.get(id);if(!t||(itemId!==0&&!t.items.some(i=>i.id===itemId)))return false;return updateRecord(id,{itemId});}
function cycleStage(id){
 try{const t=trackById.get(id);if(!t||seriesById.get(t.seriesId).kind!=='enhanced')return false;
  const step=stageIndex(t,latest().records[id]);return setStage(id,t.items[step]?.id||0);
 }catch(error){warn(error.message);return false;}
}
function preferences(){try{localStorage.setItem(PREFS,JSON.stringify({filters}));}catch{/* Collection storage reports failures separately. */}}
function renderSeriesOptions(){
 const grouped=['relic','ultimate'].includes(filters.kind);if(grouped)filters.series='';
 $('seriesField').hidden=grouped;document.querySelector('.filters').classList.toggle('relic-filters',grouped);
 const available=data.series.filter(s=>!filters.kind||s.kind===filters.kind);
 if(filters.series&&!available.some(s=>s.id===filters.series))filters.series='';
 $('seriesFilter').innerHTML='<option value="">모든 시리즈</option>'+available.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('');$('seriesFilter').value=filters.series;
 document.querySelectorAll('[data-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.kind===filters.kind)));
}
function tableEntry(t){
 const r=getRecord(t.id),step=stageIndex(t,r),status=statusOf(t,r),single=t.items.length===1,cycling=seriesById.get(t.seriesId).kind==='enhanced';
 const current=t.items[step?step-1:t.items.length-1],name=label(t)+' '+seriesById.get(t.seriesId).short;
 const slot=t.jobId==='PLD'?`<span class="relic-slot">${t.slot==='shield'?'방패':'검'}</span>`:'';
 const stateLabel=step?t.items[step-1].stage:'없음',nextLabel=t.items[step]?.stage||'없음';
 const control=cycling
  ? `<div class="relic-stage"><button id="cycle-${t.id}" class="stage-cycle" data-cycle="${t.id}" aria-label="${esc(name)}: 현재 ${esc(stateLabel)}, 클릭하면 ${esc(nextLabel)}" title="${esc(['없음',...t.items.map(i=>i.stage),'없음'].join(' → '))}"><span class="cycle-value">${esc(stateLabel)}</span><span class="cycle-arrow" aria-hidden="true">↻</span></button></div>`
  : single
  ? `<div class="relic-stage"><button class="collect-toggle" data-collect="${t.id}" aria-pressed="${step>0}" aria-label="${esc(name)} 수집"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m3 8 3 3 7-7"/></svg>수집</button></div>`
  : `<label class="relic-stage" for="stage-${t.id}"><select id="stage-${t.id}" data-stage="${t.id}" aria-label="${esc(name)} 완료한 단계" title="${step?`${step}. ${esc(t.items[step-1].stage)}`:'미시작'}"><option value="0"${!step?' selected':''}>미시작</option>${t.items.map((item,n)=>`<option value="${item.id}"${r.itemId===item.id?' selected':''}>${esc(item.stage)}${n===t.items.length-1?' ✓':''}</option>`).join('')}</select></label>`;
 return `<div class="relic-entry ${status}" data-track="${t.id}">${control}<div class="relic-cell-actions"><button class="relic-detail" data-detail="${t.id}" aria-label="${esc(name+' · '+current.name)} 단계·획득처" title="${esc(current.name)} · 단계·획득처">${slot}<img loading="lazy" src="${esc(current.icon)}" alt=""><span>${single||cycling?(slot?'정보':'획득처'):step?`${step}/${t.items.length}`:'단계'}</span></button><button class="relic-target" data-target="${t.id}" aria-pressed="${r.target}" aria-label="${esc(name)} 관심 무기" title="관심 무기">${r.target?'★':'☆'}</button></div></div>`;
}
function collectionTable(list){
 const series=data.series.filter(s=>(!filters.kind||s.kind===filters.kind)&&(!filters.series||s.id===filters.series));
 const matched=new Set(list.map(t=>t.id)),jobs=data.jobs.filter(j=>list.some(t=>t.jobId===j.id));
 const seriesIds=new Set(series.map(s=>s.id)),all=data.tracks.filter(t=>seriesIds.has(t.seriesId));
 const boundary=index=>index>0&&series[index-1].kind!==series[index].kind?' series-boundary':'';
 return `<div id="relicTableScroll" class="relic-table-scroll" role="region" aria-label="직업별 무기 수집표, 가로와 세로로 스크롤 가능" tabindex="0"><table class="relic-table" style="--table-width:${104+series.length*120}px"><caption class="visually-hidden">직업별 무기 수집 현황과 완료 단계. 같은 칸의 나이트 검과 방패는 따로 저장됩니다.</caption><colgroup><col class="relic-job-col">${series.map(()=>'<col>').join('')}</colgroup><thead><tr><th scope="col">직업</th>${series.map((s,index)=>`<th scope="col" class="${boundary(index)}"><a href="${esc(s.source)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.name)} 획득 안내" title="${esc(s.name)}">${esc(COLUMN_NAMES[s.id]||s.short)} ↗</a><small>${KIND_NAMES[s.kind]} · ${s.labels.length===1?`Lv.${s.level}`:`${s.labels.length}단계`}</small></th>`).join('')}</tr></thead><tbody>${jobs.map(j=>{
  const own=all.filter(t=>t.jobId===j.id),stats=summarize(own,state.records);
  return `<tr data-job="${j.id}"><th scope="row"><span class="relic-job" data-role="${j.role}">${esc(j.name)}</span><small>${j.id} · ${stats.complete}/${stats.total}</small></th>${series.map((s,index)=>{
   const available=own.filter(t=>t.seriesId===s.id),entries=available.filter(t=>matched.has(t.id)),edge=boundary(index);
   if(!available.length)return `<td class="relic-unavailable${edge}"><span aria-label="해당 무기 없음">—</span></td>`;
   if(!entries.length)return `<td class="relic-filtered${edge}">조건 제외</td>`;
   return `<td data-series="${s.id}" class="${edge}">${entries.map(tableEntry).join('')}</td>`;
  }).join('')}</tr>`;
 }).join('')}</tbody></table></div>`;
}
function render(){
 const active=document.activeElement,focus=active?.id||null,focusTarget=active?.dataset?.target,focusCollect=active?.dataset?.collect;
 const scroll=$('relicTableScroll'),scrollPosition=scroll?{left:scroll.scrollLeft,top:scroll.scrollTop}:null;
 $('resultLabel').textContent=filters.kind==='relic'?'고대무기 진행표':filters.kind==='ultimate'?'절 무기 수집표':filters.kind==='enhanced'?'재보강 무기 진행표':'전체 무기 수집표';
 const total=summarize(data.tracks,state.records);$('completeCount').textContent=total.complete;$('totalCount').textContent=`/ ${total.total}개`;$('progressCount').textContent=total.progress;$('targetCount').textContent=total.targets;
 const list=filterTracks(data,state.records,filters);
 $('resultCount').textContent=`${list.length}개`;$('targetFilter').setAttribute('aria-pressed',String(filters.target));$('targetFilter').textContent=filters.target?'★ 관심 무기만':'☆ 관심 무기만';
 $('scopeNote').textContent='칸에서 단계나 수집 여부를 바꾸면 자동 저장됩니다. 나이트 검·방패는 별도 기록합니다. — 해당 무기 없음 · 조건 제외: 필터 불일치';
 $('weaponList').innerHTML=list.length?collectionTable(list):'';
 if(scrollPosition&&$('relicTableScroll')){$('relicTableScroll').scrollLeft=scrollPosition.left;$('relicTableScroll').scrollTop=scrollPosition.top;}
 $('emptyResults').hidden=list.length>0;
 if(detailId&&$('detailDialog').open)renderDetail();
 showcase?.refresh();
 let restore=focus?$(focus):null;
 if(focusTarget)restore=[...document.querySelectorAll('[data-target]')].find(b=>b.dataset.target===focusTarget);
 if(focusCollect)restore=[...document.querySelectorAll('[data-collect]')].find(b=>b.dataset.collect===focusCollect);
 if(restore)restore.focus({preventScroll:true});else if(active?.closest?.('.weapon-row,.relic-entry'))$('resultTitle').focus({preventScroll:true});
}
function renderDetail(){
 const t=trackById.get(detailId),s=seriesById.get(t.seriesId),r=getRecord(t.id),n=stageIndex(t,r),last=t.items.at(-1);
 const note=$('weaponNote')?.value,oldNoteTrack=$('weaponNote')?.dataset.track,scroll=$('detailDialog').scrollTop;
 $('detailTitle').textContent=label(t)+' · '+s.short;
 $('detailBody').innerHTML=`<div class="detail-intro"><img src="${esc(last.icon)}" alt=""><div><h3>${esc(last.name)}</h3><p>${esc(s.name)} · 최종 IL ${last.itemLevel}</p></div></div><div class="acquisition"><p>${esc(s.acquisition)}</p><a href="${esc(s.source)}" target="_blank" rel="noopener noreferrer">획득 경로 자세히 보기 ↗</a></div><p class="muted">완료한 단계의 「여기까지」를 누르면 이전 단계도 함께 기록됩니다. 모조품의 별도 구매 여부는 포함하지 않습니다.</p><ol class="stage-list">${t.items.map((item,i)=>`<li class="${i<n?'done':''} ${i===n-1?'current':''}"><span class="stage-number">${i<n?'✓':i+1}</span><img loading="lazy" src="${esc(item.icon)}" alt=""><div class="stage-info"><strong>${esc(item.name)}</strong><small>${esc(item.stage)} · IL ${item.itemLevel}</small><a href="${esc(item.official)}" target="_blank" rel="noopener noreferrer">공식 가이드 ↗</a></div><button data-set-stage="${item.id}"${i===n-1?' disabled':''}>${i===n-1?'현재 단계':'여기까지'}</button></li>`).join('')}</ol><div class="detail-actions"><button id="clearStage"${n?'':' disabled'}>${t.items.length===1?'미수집으로':'미시작으로'}</button></div><div class="note-area"><label for="weaponNote">진행 메모</label><textarea id="weaponNote" data-track="${t.id}" maxlength="500" rows="3" placeholder="모아 둔 재료, 다음에 할 퀘스트 등">${esc(oldNoteTrack===t.id?note:r.note)}</textarea><button id="saveNote">메모 저장</button></div>`;
 $('detailDialog').scrollTop=scroll;
}
function openDetail(id){detailId=id;renderDetail();$('detailDialog').showModal();$('detailDialog').scrollTop=0;}
function changedFilters(){if($('relicTableScroll'))$('relicTableScroll').scrollTop=0;preferences();render();}
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
  try{const p=JSON.parse(localStorage.getItem(PREFS)||'null');if(p?.filters){filters={...filters,...p.filters};if(!['','relic','ultimate','enhanced'].includes(filters.kind))filters.kind='';if(!seriesById.has(filters.series))filters.series='';if(!jobsById.has(filters.job))filters.job='';if(!['','unstarted','progress','complete'].includes(filters.status))filters.status='';filters.query=typeof filters.query==='string'?filters.query:'';filters.target=!!filters.target;}}catch{}
  $('jobFilter').innerHTML='<option value="">모든 직업</option>'+data.jobs.map(j=>`<option value="${j.id}">${j.name}</option>`).join('');$('jobFilter').value=filters.job;$('statusFilter').value=filters.status;$('search').value=filters.query;
  renderSeriesOptions();render();$('app').hidden=false;$('loadStatus').hidden=true;$('openRecords').disabled=false;
 }catch(error){$('loadStatus').textContent='무기 데이터를 불러오지 못했습니다. 새로고침해 주세요. '+error.message;return;}
 showcase=mountShowcase({catalog:data,getRecords:()=>latest().records});
 $('search').addEventListener('input',()=>{filters.query=$('search').value;changedFilters();});
 $('search').addEventListener('compositionend',()=>{filters.query=$('search').value;changedFilters();});
 $('seriesFilter').addEventListener('change',()=>{filters.series=$('seriesFilter').value;changedFilters();});
 $('jobFilter').addEventListener('change',()=>{filters.job=$('jobFilter').value;changedFilters();});
 $('statusFilter').addEventListener('change',()=>{filters.status=$('statusFilter').value;changedFilters();});
 $('targetFilter').addEventListener('click',()=>{filters.target=!filters.target;changedFilters();});$('resetFilters').addEventListener('click',resetFilters);
 $('kinds').addEventListener('click',e=>{const b=e.target.closest('[data-kind]');if(b){filters.kind=b.dataset.kind;filters.series='';renderSeriesOptions();changedFilters();}});
 $('weaponList').addEventListener('change',e=>{if(e.target.matches('[data-stage]')&&!setStage(e.target.dataset.stage,Number(e.target.value)))render();});
 $('weaponList').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.detail)openDetail(b.dataset.detail);if(b.dataset.target)updateRecord(b.dataset.target,{target:!getRecord(b.dataset.target).target});if(b.dataset.cycle)cycleStage(b.dataset.cycle);if(b.dataset.collect){const t=trackById.get(b.dataset.collect);setStage(t.id,getRecord(t.id).itemId?0:t.items[0].id);}});
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
