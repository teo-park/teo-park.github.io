import {buildShowcase,drawShowcase,loadBundledShowcaseIcons,canvasPNG,writePNG} from './showcase.js?v=20260909-line1';

const PREFS='teo-ffxiv.weapons.showcase.v1';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mountShowcase({catalog,getRecords,doc=document,loadIcons=loadBundledShowcaseIcons,paint=drawShowcase,toPNG=canvasPNG,copyPNG=writePNG}={}){
 const win=doc.defaultView,$=id=>doc.getElementById(id),dialog=$('showcaseDialog'),cache=new Map();
 let version=0,blob=null,objectURL=null,assetKey='',assets=null,timer=null;
 const options=()=>({name:$('shareName').value,kind:$('shareKind').value,theme:$('shareTheme').value,onlyStarted:$('shareOnlyStarted').checked});
 try{const p=JSON.parse(win.localStorage.getItem(PREFS)||'null');if(p){$('shareName').value=String(p.name||'').slice(0,30);$('shareKind').value=['relic','ultimate','enhanced'].includes(p.kind)?p.kind:'';$('shareTheme').value=p.theme==='paper'?'paper':'night';$('shareOnlyStarted').checked=!!p.onlyStarted;}}catch{}
 function busy(message){blob=null;$('copyShowcase').disabled=true;$('saveShowcase').disabled=true;$('shareStatus').textContent=message;$('sharePreview').setAttribute('aria-busy','true');}
 function savePrefs(){try{win.localStorage.setItem(PREFS,JSON.stringify(options()));}catch{}}
 function textTable(model){
  $('shareText').innerHTML=`<table><caption>${escape(model.scope)} · 완성 ${model.stats.complete}/${model.stats.total} · 성장 중 ${model.stats.progress}</caption><thead><tr><th scope="col">직업</th>${model.series.map(s=>`<th scope="col">${escape(s.name)}</th>`).join('')}</tr></thead><tbody>${model.rows.map(row=>`<tr><th scope="row">${row.job.name}</th>${row.cells.map(c=>`<td>${c.entries.length?c.entries.map(e=>`${e.slot==='shield'?'방패: ':row.job.id==='PLD'?'검: ':''}${escape(e.item.name)} — ${e.status==='complete'?'완성·수집':e.step?e.step+'/'+e.total+'단계':'미수집'}`).join('<br>'):'해당 없음'}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 }
 async function waitFont(family){
  if(!doc.fonts?.load)return;
  let timeout;try{await Promise.race([Promise.all([doc.fonts.load(`400 14px ${family}`),doc.fonts.load(`700 14px ${family}`),doc.fonts.load(`800 42px ${family}`)]),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('글꼴을 불러오지 못했습니다. 다시 시도해 주세요.')),8000);})]);}finally{clearTimeout(timeout);}
 }
 async function fonts(family){
  try{await waitFont(family);return family;}catch{
   const fallback=win.getComputedStyle(doc.documentElement).getPropertyValue('--ff-font-secondary').trim()||'NanumSquareRound';
   try{await waitFont(fallback);}catch{/* The browser's sans-serif still allows an image export offline. */}
   return fallback+', sans-serif';
  }
 }
 async function refresh(){
  if(!dialog.open)return;const ticket=++version;busy('무기 아이콘과 공유 이미지를 준비하고 있어요.');$('retryShowcase').hidden=true;
  try{
   const records=getRecords(),model=buildShowcase(catalog,records,options());
   model.fontFamily=win.getComputedStyle(doc.documentElement).getPropertyValue('--ff-sans').trim()||'LINESeedKR, NanumSquareRound, sans-serif';
   // The normal search, series, status filter and pagination never limit this image.
   const all=buildShowcase(catalog,records),urls=all.rows.flatMap(r=>r.cells.flatMap(c=>c.entries.map(e=>e.item.icon))),key=[...new Set(urls)].sort().join('|');
   if(!assets||key!==assetKey){assetKey=key;assets=loadIcons(urls,{cache});}
   const [loaded,fontFamily]=await Promise.all([assets,fonts(model.fontFamily)]);if(ticket!==version||!dialog.open)return;
   model.fontFamily=fontFamily;
   const canvas=doc.createElement('canvas'),size=paint(canvas,model,loaded.images),png=await toPNG(canvas);if(ticket!==version||!dialog.open)return;
   const nextURL=win.URL.createObjectURL(png),oldURL=objectURL;objectURL=nextURL;blob=png;
   $('shareImage').src=nextURL;$('shareImage').alt=`${model.name?model.name+'의 ':''}무기 수집 현황. 완성 ${model.stats.complete}/${model.stats.total}개, 성장 중 ${model.stats.progress}개. 직업 ${model.rows.length}행, 시리즈 ${model.series.length}열. 자세한 내용은 아래 텍스트 현황에서 확인할 수 있습니다.`;
   $('shareImage').hidden=false;if(oldURL)win.URL.revokeObjectURL(oldURL);
   $('sharePreview').style.setProperty('--poster-width',size.width+'px');
   const failed=[...new Set(model.rows.flatMap(r=>r.cells.flatMap(c=>c.entries.map(e=>e.item.icon))))].filter(url=>!loaded.images.has(url)).length;
   $('shareStatus').textContent=`${canvas.width} × ${canvas.height}px · ${model.rows.length}개 직업을 한 행씩 배치했습니다.${failed?` 아이콘 ${failed}개는 불러오지 못해 대체 표시했어요.`:''}`;
   $('retryShowcase').hidden=failed===0;$('copyShowcase').disabled=false;$('saveShowcase').disabled=false;$('sharePreview').setAttribute('aria-busy','false');textTable(model);
  }catch(error){if(ticket!==version)return;$('shareStatus').textContent='이미지를 준비하지 못했습니다. '+error.message;$('retryShowcase').hidden=false;$('sharePreview').setAttribute('aria-busy','false');}
 }
 function schedule(){clearTimeout(timer);version++;busy('공유 이미지를 갱신하고 있어요.');savePrefs();timer=setTimeout(refresh,180);}
 $('openShowcase').disabled=false;
 $('openShowcase').addEventListener('click',()=>{dialog.showModal();refresh();});
 $('closeShowcase').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{version++;clearTimeout(timer);blob=null;});
 for(const id of ['shareName','shareKind','shareTheme','shareOnlyStarted'])$(id).addEventListener(id==='shareName'?'input':'change',schedule);
 $('retryShowcase').addEventListener('click',()=>{assets=null;refresh();});
 $('shareZoom').addEventListener('click',()=>{const zoom=$('shareZoom').getAttribute('aria-pressed')!=='true';$('shareZoom').setAttribute('aria-pressed',String(zoom));$('sharePreview').classList.toggle('zoomed',zoom);$('shareZoom').textContent=zoom?'화면에 맞추기':'크게 보기';});
 $('copyShowcase').addEventListener('click',()=>{
  if(!blob)return;const image=blob;$('copyShowcase').disabled=true;
  // Call write during the click, with the already prepared Blob. No async fetch can expire user activation.
  copyPNG(image).then(()=>{$('shareStatus').textContent='이미지를 복사했습니다. 채팅창에 Ctrl+V로 붙여넣으세요.';},()=>{$('shareStatus').textContent='이미지 복사가 허용되지 않았습니다. PNG 저장 버튼으로 파일을 내려받아 주세요.';}).finally(()=>{$('copyShowcase').disabled=!blob;});
 });
 $('saveShowcase').addEventListener('click',()=>{
  if(!blob)return;const url=win.URL.createObjectURL(blob),a=doc.createElement('a');a.href=url;a.download=`ffxiv-weapons-${new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'})}.png`;doc.body.append(a);a.click();a.remove();setTimeout(()=>win.URL.revokeObjectURL(url),1000);$('shareStatus').textContent='PNG 파일 저장을 시작했습니다.';
 });
 return {refresh};
}
