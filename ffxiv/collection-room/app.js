import {ensureConnection,subscribe,linkNotebooks,unlinkNotebooks,localBooks,changeItem} from '../collection-sync.js?v=20261028-syncfix1';

const M=globalThis.CollectionRoomModel,$=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PAGE_SIZE=30;
let b,catalog,user=null,session=0,roomId=null,meta=null,members={},view='together',page=1,linked=false,linking=false;
let userRoomsOff,roomOff=[],listOff=new Map(),peerOff=new Map(),peers=new Map(),roomNames=new Map(),localCache={};
const statusLabels={disconnected:'이 브라우저의 기록',connecting:'연결 중',synced:'동기화됨',pending:'변경 사항 전송 중',offline:'연결 대기 · 브라우저에 보관',error:'동기화 확인 필요'};
function message(text,error=false){$('message').textContent=text;$('message').hidden=false;$('message').classList.toggle('error',error);}
function errorMessage(error){
  const code=String(error?.code||'').toLowerCase();
  if(code.includes('popup-closed'))return '로그인 창이 닫혔어요. 다시 시작할 수 있어요.';
  if(code.includes('popup-blocked'))return '팝업이 차단됐어요. 이 사이트의 팝업을 허용하고 다시 로그인해 주세요.';
  if(code.includes('permission-denied')||code.includes('permission_denied'))return '접근할 수 없어요. 방 코드·비밀번호·참여 권한을 확인해 주세요.';
  if(code.includes('network'))return '연결하지 못했어요. 네트워크를 확인하고 다시 시도해 주세요.';
  return error?.message||'처리하지 못했어요. 다시 시도해 주세요.';
}
async function action(button,run){
  button.disabled=true;
  try{await run();}catch(error){message(errorMessage(error),true);}finally{button.disabled=false;}
}
function requireUser(){const uid=b?.auth.currentUser?.uid;if(!uid)throw Error('먼저 Google로 로그인해 주세요.');return uid;}
function sharingFields(container,values={}){container.innerHTML=M.BOOKS.map(book=>`<label><input type="checkbox" name="share" value="${book.id}" ${values[book.id]?'checked':''}>${book.label}</label>`).join('');}
function formSharing(form){const selected=new FormData(form).getAll('share');return Object.fromEntries(M.BOOKS.map(book=>[book.id,selected.includes(book.id)]));}
function nickname(value){const name=String(value||'').trim();if(!name||name.length>30)throw Error('방에서 쓸 이름은 1~30자로 입력해 주세요.');return name;}
function parseRoom(value){
  let text=String(value||'').trim();
  if(text.includes('://')){try{text=new URL(text).hash.replace(/^#(?:room=)?/,'');}catch{throw Error('방 링크를 확인해 주세요.');}}
  text=text.replace(/^#(?:room=)?/,'');if(!/^[a-f0-9]{32}$/.test(text))throw Error('방 링크 또는 32자리 방 코드를 확인해 주세요.');return text;
}
function renderLocal(){
  let failed=false;
  $('localSummary').innerHTML=M.BOOKS.map(book=>{
    let count='확인 필요';
    try{count=Object.values(M.readBook(localStorage,book)).filter(v=>v.value>0).length;}catch{failed=true;}
    const total=catalog?.books[book.id].items.length;
    return `<a class="notebook-count" href="../${book.path}"><span>${book.label}</span><strong>${count}<small>${total?' / '+total:''}</small></strong><small>${book.id==='weapons'?'시작한 무기':'체크한 항목'} · 수첩 열기 ↗</small></a>`;
  }).join('');
  if(failed)$('connectionHint').textContent='읽지 못한 수첩이 있어요. 해당 수첩에서 기록을 확인해 주세요. 원본을 덮어쓰지 않았어요.';
}
function clearRoom(){
  for(const off of roomOff.splice(0))off();for(const off of peerOff.values())off();peerOff.clear();peers.clear();
  roomId=null;meta=null;members={};$('activeRoom').hidden=true;$('emptyRoom').hidden=false;
  $('roomTitle').textContent='';$('roomSubtitle').textContent='';$('results').replaceChildren();$('profileName').value='';$('manageName').value='';$('manageForm').elements.password.value='';
}
function clearSession(){
  session++;clearRoom();userRoomsOff?.();userRoomsOff=null;for(const off of listOff.values())off();listOff.clear();roomNames.clear();$('roomList').replaceChildren();$('roomCount').textContent='0개';
}
function renderRooms(){
  $('roomCount').textContent=roomNames.size+'개';
  $('roomList').innerHTML=roomNames.size?[...roomNames].map(([id,name])=>`<div><button type="button" data-room="${id}" ${id===roomId?'aria-current="true"':''}>${esc(name===false?'참여 권한 없는 방':name||'방 이름 불러오는 중…')}</button>${name===false?`<button type="button" data-forget="${id}">목록에서 지우기</button>`:''}</div>`).join(''):'<p class="muted small">아직 참여한 방이 없어요.</p>';
}
function watchRooms(){
  const token=session,uid=user.uid;
  userRoomsOff=b.DB.onValue(b.ref(`userRooms/${uid}`),snapshot=>{
    if(token!==session)return;
    const ids=Object.keys(snapshot.val()||{}).filter(id=>/^[a-f0-9]{32}$/.test(id));
    for(const [id,off] of listOff)if(!ids.includes(id)){off();listOff.delete(id);roomNames.delete(id);if(roomId===id)clearRoom();}
    for(const id of ids)if(!listOff.has(id)){
      roomNames.set(id,null);
      listOff.set(id,b.DB.onValue(b.ref(`rooms/${id}/meta`),s=>{if(token!==session)return;roomNames.set(id,s.val()?.name||false);renderRooms();},()=>{if(token!==session)return;roomNames.set(id,false);renderRooms();}));
    }
    renderRooms();
    const desired=location.hash.replace(/^#room=/,'');
    if(!roomId&&ids.includes(desired))selectRoom(desired);
    else if(!roomId&&ids.length===1&&!desired)selectRoom(ids[0]);
  },error=>{if(token===session){$('serviceNotice').hidden=false;$('serviceNotice').textContent='수집방에 연결하지 못했어요. 연결 상태를 확인하고, 문제가 계속되면 사이트 관리자에게 알려주세요.';message(errorMessage(error),true);}});
}
function profileWatch(){
  const current=roomId,token=session,wanted=new Set();
  for(const [uid,profile] of Object.entries(members))for(const book of M.BOOKS)if(profile.sharing?.[book.id]){
    const key=uid+'/'+book.id;wanted.add(key);
    if(!peerOff.has(key)){
      peerOff.set(key,b.DB.onValue(b.ref(`shared/${current}/${key}`),snapshot=>{
        if(token!==session||roomId!==current)return;
        try{const published=snapshot.val();if(published?.ready===true)peers.set(key,M.normalize({[book.id]:published.entries||{}})[book.id]);else peers.delete(key);renderResults();}catch{peers.delete(key);message('공유된 수첩 기록을 읽지 못했어요. 페이지를 새로고침해 주세요.',true);renderResults();}
      },()=>{if(token!==session||roomId!==current)return;peers.delete(key);renderResults();}));
    }
  }
  for(const [key,off] of peerOff)if(!wanted.has(key)){off();peerOff.delete(key);peers.delete(key);}
}
function selectRoom(id){
  clearRoom();roomId=id;page=1;const token=session;
  history.replaceState(null,'','#room='+id);renderRooms();$('emptyRoom').hidden=true;$('activeRoom').hidden=false;$('roomTitle').textContent='방 불러오는 중…';
  const denied=()=>{if(token!==session||roomId!==id)return;clearRoom();message('이 방을 볼 수 없어요. 참여 권한이 변경됐거나 입장이 필요해요.',true);};
  roomOff.push(b.DB.onValue(b.ref(`rooms/${id}/meta`),snapshot=>{
    if(token!==session||roomId!==id)return;meta=snapshot.val();if(!meta){denied();return;}renderRoomHeader();renderResults();
  },denied));
  roomOff.push(b.DB.onValue(b.ref(`rooms/${id}/members`),snapshot=>{
    if(token!==session||roomId!==id)return;members=snapshot.val()||{};if(!members[user.uid]){denied();return;}
    $('profileName').value=members[user.uid].name;sharingFields($('sharingOptions'),members[user.uid].sharing);profileWatch();renderRoomHeader();renderResults();
  },denied));
}
function renderRoomHeader(){
  if(!meta||!user)return;
  const owner=meta.owner===user.uid;$('roomTitle').textContent=meta.name;$('roomSubtitle').textContent=`참여 ${Object.keys(members).length}명 · ${meta.locked?'새 참여 잠김':'비밀번호로 참여'} · 참여자에게만 공개`;
  $('managePanel').hidden=!owner;$('leaveRoom').hidden=owner;
  if(!$('managePanel').open){$('manageName').value=meta.name;$('roomLocked').checked=meta.locked;}
}
function bookRecords(uid,book){
  if(uid===user?.uid&&linked)return localCache[book]||{};
  return peers.get(uid+'/'+book)||null;
}
function eligible(book){return Object.entries(members).filter(([uid,p])=>p.sharing?.[book]&&bookRecords(uid,book)!==null);}
function stats(book,item){
  const people=eligible(book),missing=[],wanted=[],owned=[];
  for(const [uid,p] of people){const record=bookRecords(uid,book)?.[item.id];if(M.complete(book,item,record))owned.push([uid,p]);else{missing.push([uid,p]);if(record?.wanted)wanted.push([uid,p]);}}
  return {people,missing,wanted,owned};
}
function editItem(book,id,field,value){
  changeItem(book,id,field,value);
  if(book!=='weapons'||!id.includes('~PLD~'))return;
  const items=catalog.books.weapons.items,item=items.find(t=>t.id===id),paired=items.find(t=>t.id===id.replace(/~(weapon|shield)$/,id.endsWith('weapon')?'~shield':'~weapon'));
  if(paired){const stage=field==='value'?item.stages.findIndex(s=>s.id===value):-1;changeItem(book,paired.id,field,field==='value'?(paired.stages[stage]?.id||0):value);}
}
function nameOf(uid,profile){return profile.name+(uid===user?.uid?' (나)':'');}
function renderMembers(){
  $('resultSummary').textContent=`참여 ${Object.keys(members).length}명 · 공유한 수첩의 현황만 보여요.`;
  $('results').innerHTML=Object.entries(members).map(([uid,p])=>`<article class="member-card"><div class="member-heading"><h3>${esc(nameOf(uid,p))}${uid===meta.owner?' · 방장':''}</h3>${meta.owner===user.uid&&uid!==user.uid?`<button type="button" data-kick="${esc(uid)}">내보내기</button>`:''}</div><div class="member-books">${M.BOOKS.map(book=>{
    if(!p.sharing?.[book.id])return `<div class="member-book"><span>${book.label}</span><strong>공유 안 함</strong></div>`;
    const records=bookRecords(uid,book.id);if(records===null)return `<div class="member-book"><span>${book.label}</span><strong>수첩 연결 대기</strong></div>`;
    const items=catalog.books[book.id].items,count=items.filter(item=>M.complete(book.id,item,records[item.id])).length;
    return `<div class="member-book"><span>${book.label}</span><strong>${count} / ${items.length}</strong><progress value="${count}" max="${items.length}" aria-label="${esc(p.name)} ${book.label} 수집률"></progress></div>`;
  }).join('')}</div></article>`).join('');
}
function itemControls(book,item,record){
  const enabled=linked,owned=M.complete(book,item,record);
  const collect=book==='weapons'?`<label>단계 <select data-stage="${item.id}" ${enabled?'':'disabled'} aria-label="${esc(item.name)} 수집 단계"><option value="0">미수집</option>${item.stages.map(s=>`<option value="${s.id}" ${record?.value===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label>`:`<button type="button" data-id="${item.id}" data-field="value" aria-pressed="${owned}" ${enabled?'':'disabled'}>${owned?'✓ 내 수집 완료':'내 수집 체크'}</button>`;
  return `${collect}<button type="button" data-id="${item.id}" data-field="wanted" aria-pressed="${!!record?.wanted}" ${enabled?'':'disabled'}>${record?.wanted?'★':'☆'} 같이하고 싶어요</button>`;
}
function renderResults(){
  if(!catalog||!roomId||!meta||!user||!members[user.uid])return;
  try{localCache=linked?localBooks():{};}catch{localCache={};}
  $('catalogControls').hidden=view==='members';$('pagination').hidden=true;
  if(view==='members'){renderMembers();return;}
  const book=$('bookSelect').value,all=catalog.books[book].items,query=$('search').value,filter=$('itemFilter').value;
  if(view==='mine'&&!linked){$('resultSummary').textContent='';$('results').innerHTML='<div class="inline-empty">위에서 내 수첩을 연결하면 여기서도 기록을 수정할 수 있어요.</div>';return;}
  if(view==='together'&&!members[user.uid]?.sharing?.[book]){$('resultSummary').textContent='';$('results').innerHTML='<div class="inline-empty">이 수첩을 공유하면 나와 목표가 겹치는 사람을 찾을 수 있어요.<br>위의 ‘내 이름과 공유할 수첩 설정’에서 선택해 주세요.</div>';return;}
  const mine=bookRecords(user.uid,book)||{},matched=all.filter(item=>{
    if(!M.matches(item.name+' '+item.source,query))return false;
    const s=stats(book,item),completed=M.complete(book,item,mine[item.id]);
    if(view==='mine'){if(filter==='wanted')return !!mine[item.id]?.wanted&&!completed;if(filter==='all')return true;return !completed;}
    if(filter==='all')return true;if(filter==='wanted')return s.wanted.length>0;if(filter==='missing')return !completed;return s.missing.some(([id])=>id===user.uid)&&s.missing.length>=2;
  });
  const pages=Math.max(1,Math.ceil(matched.length/PAGE_SIZE));page=Math.min(page,pages);const people=eligible(book),loading=Object.entries(members).filter(([uid,p])=>p.sharing?.[book]&&bookRecords(uid,book)===null).length;
  $('resultSummary').textContent=`${catalog.books[book].label} · ${matched.length}개 항목 · 현황 공유 ${people.length}명${loading?' · '+loading+'명 연결 대기':''}${view==='mine'?' · 내 기록은 수첩과 함께 변경돼요.':''}`;
  $('results').innerHTML=matched.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE).map(item=>{
    const s=stats(book,item),record=mine[item.id],wantedIds=new Set(s.wanted.map(([id])=>id));
    return `<article class="collection-item"><div class="item-heading"><h3>${esc(item.name)}</h3><span class="item-count">${s.owned.length}/${s.people.length}명 수집</span></div><p class="source">${esc(item.source||'자세한 획득 방법은 원래 수첩에서 확인하세요.')}</p>${view==='together'?`<div class="person-chips">${s.missing.map(([uid,p])=>`<span class="person-chip ${wantedIds.has(uid)?'wanted':''} ${uid===user.uid?'self':''}">${wantedIds.has(uid)?'★ ':''}${esc(nameOf(uid,p))}</span>`).join('')||'<span class="muted small">공유한 참여자 모두 수집했어요.</span>'}</div>`:''}<div class="item-actions">${itemControls(book,item,record)}${view==='together'&&s.missing.length?`<button type="button" data-invite="${item.id}">모집 문구 복사 ↗</button>`:''}</div></article>`;
  }).join('')||'<div class="inline-empty">조건에 맞는 항목이 없어요.<br>보기 조건을 바꾸거나 다른 수첩을 선택해 보세요.</div>';
  $('pagination').hidden=pages<=1;$('pageLabel').textContent=`${page} / ${pages}`;$('prevPage').disabled=page<=1;$('nextPage').disabled=page>=pages;
}
async function enterRoom(id,proof,name,sharing){
  const uid=requireUser();
  await b.DB.set(b.ref(`access/${id}/${uid}`),{active:true,proof});
  await b.DB.update(b.ref(''),{[`rooms/${id}/members/${uid}`]:{name,sharing},[`userRooms/${uid}/${id}`]:true});
  if(b.auth.currentUser?.uid!==uid)return;
  selectRoom(id);message('수집방에 참여했어요. 공유한 수첩의 현황이 동기화돼요.');
}
function wire(){
  for(const id of ['createSharing','joinSharing'])sharingFields($(id),Object.fromEntries(M.BOOKS.map(book=>[book.id,true])));
  $('bookSelect').innerHTML=M.BOOKS.map(book=>`<option value="${book.id}">${book.label}</option>`).join('');
  $('login').addEventListener('click',()=>action($('login'),async()=>{await b.login();}));
  $('logout').addEventListener('click',()=>action($('logout'),async()=>{clearSession();await b.logout();message('로그아웃했어요. 이 브라우저의 수첩 기록은 그대로 보관돼요.');}));
  $('linkNotebooks').addEventListener('click',()=>action($('linkNotebooks'),async()=>{linking=true;try{await linkNotebooks(catalog);message('기존 수첩 기록을 불러왔어요. 이제 수첩과 수집방 어디에서 체크해도 함께 반영돼요.');}finally{linking=false;}}));
  $('unlinkNotebooks').addEventListener('click',()=>action($('unlinkNotebooks'),async()=>{unlinkNotebooks();message('이 브라우저의 자동 동기화를 해제했어요. 기록과 방 참여는 유지돼요.');}));
  $('createForm').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget,data=new FormData(form),sharing=formSharing(form);void action(form.querySelector('button[type=submit]'),async()=>{
    const uid=requireUser(),id=[...crypto.getRandomValues(new Uint8Array(16))].map(v=>v.toString(16).padStart(2,'0')).join(''),name=String(data.get('name')).trim(),nick=nickname(data.get('nickname'));
    if(!name||name.length>60)throw Error('방 이름은 1~60자로 입력해 주세요.');
    const proof=await M.passwordProof(data.get('password'),id);
    await b.DB.set(b.ref(`secrets/${id}`),{owner:uid,verifier:proof});
    await b.DB.set(b.ref(`access/${id}/${uid}`),{active:true,proof});
    await b.DB.update(b.ref(''),{[`rooms/${id}/meta`]:{name,owner:uid,locked:false,createdAt:b.DB.serverTimestamp()},[`rooms/${id}/members/${uid}`]:{name:nick,sharing},[`userRooms/${uid}/${id}`]:true});
    form.reset();$('createDetails').open=false;if(b.auth.currentUser?.uid===uid){selectRoom(id);message('수집방을 만들었어요. 초대 링크와 비밀번호를 부대원에게 알려주세요.');}
  });});
  $('joinForm').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget,data=new FormData(form),sharing=formSharing(form);void action(form.querySelector('button[type=submit]'),async()=>{
    const id=parseRoom(data.get('room')),name=nickname(data.get('name')),proof=await M.passwordProof(data.get('password'),id);await enterRoom(id,proof,name,sharing);form.elements.password.value='';$('joinDetails').open=false;
  });});
  $('startCreate').addEventListener('click',()=>{$('createDetails').open=true;$('createForm').elements.name.focus();});
  $('roomList').addEventListener('click',event=>{const selected=event.target.closest('[data-room]');if(selected)selectRoom(selected.dataset.room);const forget=event.target.closest('[data-forget]');if(forget)void action(forget,async()=>{await b.DB.remove(b.ref(`userRooms/${requireUser()}/${forget.dataset.forget}`));});});
  $('profileForm').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget,sharing=formSharing(form),id=roomId;void action(form.querySelector('button'),async()=>{
    const uid=requireUser(),name=nickname(form.elements.name.value),updates={[`rooms/${id}/members/${uid}`]:{name,sharing}};
    for(const book of M.BOOKS)if(!sharing[book.id])updates[`shared/${id}/${uid}/${book.id}`]=null;
    await b.DB.update(b.ref(''),updates);message('이 방의 공유 설정을 저장했어요.');
  });});
  $('manageForm').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget,data=new FormData(form),id=roomId;void action(form.querySelector('button'),async()=>{
    requireUser();const name=String(data.get('name')).trim();if(!name)throw Error('방 이름을 입력해 주세요.');
    const updates={[`rooms/${id}/meta/name`]:name,[`rooms/${id}/meta/locked`]:data.has('locked')};
    if(data.get('password'))updates[`secrets/${id}/verifier`]=await M.passwordProof(data.get('password'),id);
    await b.DB.update(b.ref(''),updates);form.elements.password.value='';message('방 설정을 저장했어요.');
  });});
  $('copyRoomLink').addEventListener('click',()=>action($('copyRoomLink'),async()=>{await navigator.clipboard.writeText(new URL('./',location.href).href+'#room='+roomId);message('초대 링크를 복사했어요. 비밀번호는 따로 알려주세요.');}));
  $('leaveRoom').addEventListener('click',()=>action($('leaveRoom'),async()=>{
    const uid=requireUser(),id=roomId,updates={[`rooms/${id}/members/${uid}`]:null,[`access/${id}/${uid}`]:null,[`userRooms/${uid}/${id}`]:null};
    for(const book of M.BOOKS)updates[`shared/${id}/${uid}/${book.id}`]=null;
    await b.DB.update(b.ref(''),updates);clearRoom();history.replaceState(null,'',location.pathname);message('방에서 나왔어요. 내 수집 기록은 유지돼요.');
  }));
  for(const button of document.querySelectorAll('[data-view]'))button.addEventListener('click',()=>{view=button.dataset.view;page=1;const common=$('itemFilter').querySelector('option[value=common]');common.hidden=view==='mine';common.disabled=view==='mine';if(view==='mine'&&$('itemFilter').value==='common')$('itemFilter').value='all';for(const tab of document.querySelectorAll('[data-view]'))tab.setAttribute('aria-pressed',String(tab===button));renderResults();});
  for(const id of ['bookSelect','itemFilter'])$(id).addEventListener('change',()=>{page=1;renderResults();});$('search').addEventListener('input',()=>{page=1;renderResults();});
  $('prevPage').addEventListener('click',()=>{page--;renderResults();});$('nextPage').addEventListener('click',()=>{page++;renderResults();});
  $('results').addEventListener('change',event=>{const select=event.target.closest('[data-stage]');if(select){try{editItem($('bookSelect').value,select.dataset.stage,'value',+select.value);}catch(error){message(errorMessage(error),true);}renderResults();}});
  $('results').addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.field){try{const book=$('bookSelect').value,id=button.dataset.id,field=button.dataset.field,old=localBooks()[book]?.[id]||M.empty();editItem(book,id,field,field==='value'?(old.value?0:1):!old.wanted);renderResults();}catch(error){message(errorMessage(error),true);}}
    if(button.dataset.invite)void action(button,async()=>{const book=$('bookSelect').value,item=catalog.books[book].items.find(i=>i.id===button.dataset.invite),s=stats(book,item),names=s.missing.filter(([uid])=>uid!==user.uid).map(([,p])=>p.name+'님');await navigator.clipboard.writeText(`[${meta.name}] ${item.name} 같이 모으실래요?${names.length?' '+names.join(', '):''}`);message('모집 문구를 복사했어요. 부대 채팅에 붙여넣어 보세요.');});
    if(button.dataset.kick)void action(button,async()=>{const id=roomId,uid=button.dataset.kick;requireUser();const updates={[`bans/${id}/${uid}`]:true,[`access/${id}/${uid}`]:null,[`rooms/${id}/members/${uid}`]:null};for(const book of M.BOOKS)updates[`shared/${id}/${uid}/${book.id}`]=null;await b.DB.update(b.ref(''),updates);message('참여자를 내보냈어요. 이 계정은 같은 비밀번호로 다시 들어올 수 없어요.');});
  });
  window.addEventListener('ffxiv:collection-render',()=>{renderLocal();renderResults();});
  window.addEventListener('storage',event=>{if(event.key===null||event.key===M.WISH_KEY||M.BOOKS.some(book=>book.key===event.key)){renderLocal();renderResults();}});
  window.addEventListener('hashchange',()=>{try{const id=parseRoom(location.hash);if(roomNames.has(id))selectRoom(id);else{$('joinCode').value=id;$('joinDetails').open=true;}}catch{}});
  window.addEventListener('pagehide',()=>{clearSession();});
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
}
async function init(){
  renderLocal();
  const response=await fetch('./catalog.json?v=20261028-room1');if(!response.ok)throw Error('수집 목록을 불러오지 못했어요. 새로고침해 주세요.');catalog=await response.json();renderLocal();
  b=await ensureConnection();wire();
  subscribe(state=>{
    linked=!!state.user&&state.binding?.uid===state.user.uid;
    $('syncStatus').textContent=statusLabels[state.status]||'연결 중';$('linkNotebooks').disabled=!state.user||linked||linking;$('linkNotebooks').hidden=linked;$('unlinkNotebooks').hidden=!state.binding;
    if(state.binding&&state.user&&state.binding.uid!==state.user.uid)$('connectionHint').textContent='다른 계정에 연결된 브라우저예요. 기존 연결을 해제하고, 아래 수첩 기록이 현재 계정의 것인지 확인한 뒤 연결해 주세요.';
    else if(linked)$('connectionHint').textContent='수첩과 수집방 어디에서 체크해도 내 기록에 함께 반영돼요. 방마다 공유할 수첩을 따로 선택할 수 있어요.';
    else $('connectionHint').textContent='기존 기록을 먼저 확인하세요. 로그인한 뒤 연결하면 서버 기록과 합쳐져요. 무기 메모는 이 브라우저에만 보관해요.';
    if(state.error)message(errorMessage(state.error),true);
    if(state.user?.uid!==user?.uid){clearSession();user=state.user;$('signedIn').hidden=!user;$('welcome').hidden=!!user;$('login').hidden=!!user;$('logout').hidden=!user;$('accountName').textContent=user?'내 기록으로 로그인했어요.':'방에 참여한 사람만 볼 수 있어요.';if(user){$('serviceNotice').hidden=true;watchRooms();}}
    renderLocal();renderResults();
  });
  try{const id=parseRoom(location.hash);$('joinCode').value=id;$('joinDetails').open=true;}catch{}
}
init().catch(error=>{message(errorMessage(error),true);$('serviceNotice').hidden=false;$('serviceNotice').textContent='수집방 기능을 불러오지 못했어요. 기존 수첩은 계속 이용할 수 있어요.';$('login').disabled=true;});
