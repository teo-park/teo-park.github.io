import './collection-room/model.js?v=20261028-mounts1';
import './collection-room/sync-engine.js?v=20261028-project2';
import './collection-room/share-sync.js?v=20261028-syncfix1';
import './collection-room/sync-leader.js?v=20261028-mounts1';
import './ocean-fishing/scripts/teamcraft-ids.js';
import './fishing-collection.js';
import {connect} from './collection-room/firebase.js?v=20261028-project2';

const M=globalThis.CollectionRoomModel;
let backend,user,engine,releaseLock,lockAbort,stopListeners=[],status='disconnected',epoch=0,starting;
const subscribers=new Set();
const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('ffxiv-collection-sync-teo-ffxiv-v1'):null;
function getBinding(){try{return JSON.parse(localStorage.getItem(M.BINDING_KEY)||'null');}catch{return null;}}
function announce(next,error,broadcast=true){
  status=next;
  const detail={status,user,binding:getBinding(),error};
  window.dispatchEvent(new CustomEvent('ffxiv:collection-sync',{detail}));
  for(const cb of subscribers)cb(detail);
  if(broadcast&&engine)channel?.postMessage({uid:user?.uid,status:next});
  const banner=document.getElementById('collectionSyncBanner');
  if(banner)banner.querySelector('span').textContent=({synced:'수집방과 동기화됨',pending:'변경 사항 전송 중',offline:'연결 대기 · 변경 사항은 이 브라우저에 보관 중',error:'동기화 확인 필요',disconnected:'수집방 로그인 필요',connecting:'수집 기록 연결 중'})[next]||'수집 기록 연결 중';
}
function notebookBanner(){
  if(document.getElementById('roomApp')||document.getElementById('collectionSyncBanner')||!getBinding())return;
  const node=document.createElement('aside');node.id='collectionSyncBanner';node.setAttribute('aria-label','수집 기록 동기화');
  node.style.cssText='max-width:1200px;margin:12px auto;padding:8px 20px;display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--ff-muted)';
  const text=document.createElement('span');text.setAttribute('role','status');const link=document.createElement('a');link.href=new URL('./collection-room/',import.meta.url).href;link.textContent='내 수집방 열기 ↗';node.append(text,link);
  document.querySelector('.site-header')?.after(node);
}
function stop(){
  epoch++;engine?.stop();engine=null;
  for(const off of stopListeners.splice(0))off();
  releaseLock?.();releaseLock=null;lockAbort?.abort();lockAbort=null;
}
function applyLocal(books){
  for(const book of M.BOOKS){
    const old=localStorage.getItem(book.key),oldWishes=localStorage.getItem(M.WISH_KEY);
    M.writeBook(localStorage,book,books[book.id]||{});
    const value=localStorage.getItem(book.key);
    if(old!==value)window.dispatchEvent(new StorageEvent('storage',{key:book.key,oldValue:old,newValue:value,storageArea:localStorage}));
    if(oldWishes!==localStorage.getItem(M.WISH_KEY))window.dispatchEvent(new CustomEvent('ffxiv:collection-render'));
  }
  window.dispatchEvent(new CustomEvent('ffxiv:collection-render'));
}
async function runSync(uid,token){
  if(token!==epoch||user?.uid!==uid||getBinding()?.uid!==uid)return;
  const {DB,ref}=backend;let cloud={},roomShares=new Map(),roomOff=new Map(),connected=false;
  const alive=()=>token===epoch&&user?.uid===uid;
  function shareError(cause){
    const error=Error('수집 기록은 저장했지만 방 공유 현황을 갱신하지 못했어요. 연결을 확인하면 자동으로 다시 시도해요.',{cause});
    error.code='collection/share-failed';return error;
  }
  const publisher=globalThis.CollectionShareSync.create({books:M.BOOKS,readCloud:()=>cloud,readShares:()=>roomShares,isActive:alive,
    writeShared:(room,book,payload)=>DB.set(ref(`shared/${room}/${uid}/${book}`),payload),
    onError:error=>announce('error',shareError(error)),
    onSettled:()=>{if(engine?.ready&&!Object.keys(engine.pending).length)announce(connected?'synced':'offline');},
  });
  const publish=()=>publisher.publish();
  try{
    localBooks();
    engine=globalThis.CollectionSyncEngine.create({model:M,storage:localStorage,uid,applyLocal,onStatus:(next,error)=>{
      if(next==='synced'&&publisher.error)announce('error',shareError(publisher.error));
      else announce(!connected&&['pending','synced'].includes(next)?'offline':next,error);
    },writeRemote:patch=>DB.update(ref(`users/${uid}/books`),patch)});
    engine.observe();announce('connecting');
    stopListeners.push(DB.onValue(DB.ref(backend.db,'.info/connected'),snapshot=>{
      if(!alive())return;connected=snapshot.val()===true;
      if(!connected)announce('offline');else if(engine.ready){engine.change();void publish();}
    }));
    stopListeners.push(DB.onValue(ref(`users/${uid}/books`),snapshot=>{
      if(!alive())return;
      try{cloud=M.normalize(snapshot.val());engine.receive(cloud);void publish();}catch(error){announce('error',error);}
    },error=>{if(alive())announce('error',error);}));
    stopListeners.push(DB.onValue(ref(`userRooms/${uid}`),snapshot=>{
      if(!alive())return;
      const rooms=snapshot.val()||{};
      for(const [room,off] of roomOff)if(!rooms[room]){off();roomOff.delete(room);roomShares.delete(room);}
      for(const room of Object.keys(rooms))if(/^[a-f0-9]{32}$/.test(room)&&!roomOff.has(room)){
        const off=DB.onValue(ref(`rooms/${room}/members/${uid}`),s=>{
          if(!alive())return;
          const profile=s.val();if(profile)roomShares.set(room,profile.sharing||{});else roomShares.delete(room);
          if(engine?.ready)void publish();
        },()=>{roomShares.delete(room);});
        roomOff.set(room,off);
      }
    },error=>{if(alive())announce('error',error);}));
    stopListeners.push(()=>{for(const off of roomOff.values())off();roomOff.clear();roomShares.clear();});
    const changed=()=>{if(!alive())return;try{engine.change();if(connected)void publisher.retry();}catch(error){announce('error',error);}};
    const storageChanged=e=>{if(e.key===null||e.key===M.WISH_KEY||M.BOOKS.some(b=>b.key===e.key))changed();};
    window.addEventListener('ffxiv:collection-change',changed);window.addEventListener('storage',storageChanged);window.addEventListener('online',changed);window.addEventListener('focus',changed);window.addEventListener('pagehide',changed);
    // Also catches a legacy notebook tab that has not loaded the new change hook yet.
    const interval=setInterval(()=>{if(document.visibilityState!=='hidden')changed();},3000);
    stopListeners.push(()=>{clearInterval(interval);window.removeEventListener('ffxiv:collection-change',changed);window.removeEventListener('storage',storageChanged);window.removeEventListener('online',changed);window.removeEventListener('focus',changed);window.removeEventListener('pagehide',changed);});
  }catch(error){announce('error',error);}
}
function start(){
  stop();const token=epoch,uid=user?.uid,binding=getBinding();
  if(!uid||binding?.uid!==uid){announce('disconnected');return;}
  notebookBanner();
  if(navigator.locks){
    lockAbort=new AbortController();
    globalThis.CollectionSyncLeader.request({locks:navigator.locks,name:'ffxiv-collection-sync-teo-ffxiv-v1',signal:lockAbort.signal,storage:localStorage,bindingKey:M.BINDING_KEY,binding,version:'20261028-mounts1',run:async()=>{
      if(token!==epoch)return;
      await runSync(uid,token);
      await new Promise(resolve=>{releaseLock=resolve;});
    }}).catch(error=>{if(error.name!=='AbortError'&&token===epoch)announce('error',error);});
    // The owning tab processes this tab's storage changes as well.
    announce('connecting');
    channel?.postMessage({uid,request:true});
  }else void runSync(uid,token);
}
export async function ensureConnection(){
  if(starting)return starting;
  starting=connect().then(b=>{
    backend=b;
    b.Auth.onAuthStateChanged(b.auth,next=>{user=next;start();});
    return b;
  }).catch(error=>{starting=null;announce('error',error);throw error;});
  return starting;
}
export function subscribe(callback){subscribers.add(callback);callback({status,user,binding:getBinding()});return ()=>subscribers.delete(callback);}
export async function linkNotebooks(catalog){
  const b=await ensureConnection(),uid=b.auth.currentUser?.uid;
  if(!uid)throw Error('Google 로그인 후 연결해 주세요.');
  const existing=getBinding();
  if(existing&&existing.uid!==uid)throw Error('다른 계정에 연결된 브라우저입니다. 먼저 기존 연결을 해제한 뒤 기록을 확인해 주세요.');
  const local=localBooks();
  const result=await b.DB.runTransaction(b.ref(`users/${uid}/books`),remote=>M.mergeInitial(remote,local,catalog),{applyLocally:false});
  if(!result.committed||b.auth.currentUser?.uid!==uid)throw Error('연결을 완료하지 못했습니다. 다시 시도해 주세요.');
  // Preserve changes made in a notebook while the initial merge was in flight.
  const during=M.diff(local,M.readLocal(localStorage));
  const merged=M.overlay(result.snapshot.val(),during);
  applyLocal(merged);
  const key=M.OUTBOX_PREFIX+uid;
  localStorage.setItem(key,JSON.stringify({base:M.readLocal(localStorage),pending:during}));
  localStorage.setItem(M.BINDING_KEY,JSON.stringify({uid,linkedAt:new Date().toISOString()}));
  start();
}
export function unlinkNotebooks(){
  const binding=getBinding(),saved=binding?JSON.parse(localStorage.getItem(M.OUTBOX_PREFIX+binding.uid)||'null'):null;
  if(Object.keys(engine?.pending||saved?.pending||{}).length)throw Error('아직 전송하지 못한 변경이 있습니다. 연결을 복구한 뒤 해제해 주세요.');
  stop();localStorage.removeItem(M.BINDING_KEY);announce('disconnected');
}
export function localBooks(){window.FishingCollection.read(localStorage);return M.readLocal(localStorage);}
export function changeItem(book,id,field,value){
  const binding=getBinding();if(!user||binding?.uid!==user.uid)throw Error('먼저 내 수첩을 연결해 주세요.');
  const definition=M.BOOKS.find(b=>b.id===book);if(!definition)throw Error('수첩을 확인해 주세요.');
  const entries=M.readBook(localStorage,definition);entries[id]={...(entries[id]||M.empty()),[field]:value};M.writeBook(localStorage,definition,entries);
  window.dispatchEvent(new CustomEvent('ffxiv:collection-change'));window.dispatchEvent(new CustomEvent('ffxiv:collection-render'));
}
window.addEventListener('storage',event=>{if(event.key===M.BINDING_KEY){start();notebookBanner();}});
if(channel)channel.onmessage=event=>{const data=event.data;if(data.uid!==user?.uid)return;if(data.request){if(engine)channel.postMessage({uid:user.uid,status});}else if(!engine&&getBinding()?.uid===user?.uid)announce(data.status,undefined,false);};
window.addEventListener('pagehide',()=>{try{engine?.observe();}finally{stop();}});
window.addEventListener('pageshow',event=>{if(event.persisted&&backend){user=backend.auth.currentUser;start();}});
if(getBinding()){notebookBanner();void ensureConnection().catch(()=>{});}
