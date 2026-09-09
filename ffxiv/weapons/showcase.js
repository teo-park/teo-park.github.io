import {stageIndex,statusOf,summarize} from './core.js';

export const THEMES={
 night:{bg:'#0b1525',top:'#21384d',panel:'#142438',alternate:'#17293d',line:'#30465e',text:'#edf3fa',muted:'#adbed1',gold:'#edce91',goldBg:'#343127',blue:'#89d4ed',blueBg:'#183749',empty:'#101e30',faint:'#4d6178'},
 paper:{bg:'#f2eee5',top:'#e4ded1',panel:'#fffcf5',alternate:'#eae5d9',line:'#cfc6b5',text:'#243441',muted:'#596573',gold:'#855d1c',goldBg:'#f3e3bd',blue:'#24627d',blueBg:'#ddeaf0',empty:'#e7e2d9',faint:'#958e82'}
};
const headings={zodiac:['조디악'],anima:['아니마'],eureka:['에우레카'],resistance:['레지스탕스'],manderville:['맨더빌'],phantom:['팬텀'],ucob:['절','바하무트'],uwu:['절','알테마'],tea:['절','알렉산더'],dsr:['절','용시'],top:['절','오메가'],fru:['절','미래'],'dancing-mad':['절','요성난무'],exquisite:['신곡','재보강'],gentlemage:['신사 우산','재보강']};
const groups={relic:'성장형 무기',ultimate:'절 무기',enhanced:'재보강 무기'};
const roleColors={tank:'#7196d0',healer:'#77a38b',melee:'#c98989',ranged:'#c89d77',caster:'#a18dc5',limited:'#7b9eac'};
export function buildShowcase(catalog,records,options={}){
 const kind=['relic','ultimate','enhanced'].includes(options.kind)?options.kind:'',series=catalog.series.filter(s=>!kind||s.kind===kind);
 const tracks=catalog.tracks.filter(t=>series.some(s=>s.id===t.seriesId));
 const rows=catalog.jobs.map(job=>{
  const own=tracks.filter(t=>t.jobId===job.id),stats=summarize(own,records);
  return {job,stats,cells:series.map(s=>({seriesId:s.id,entries:own.filter(t=>t.seriesId===s.id).sort((a,b)=>a.slot==='weapon'?-1:b.slot==='weapon'?1:0).map(t=>{
   const n=stageIndex(t,records[t.id]),item=t.items[n?n-1:t.items.length-1];
   return {trackId:t.id,slot:t.slot,item:{id:item.id,name:item.name,icon:item.icon},step:n,total:t.items.length,status:statusOf(t,records[t.id])};
  })}))};
 }).filter(r=>r.stats.total&&(!options.onlyStarted||r.stats.complete+r.stats.progress>0));
 // Empty rows can be hidden, but their uncollected weapons remain in the denominator.
 return {name:String(options.name||'').replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,30),kind,scope:kind?groups[kind]:'전체 무기',theme:THEMES[options.theme]?options.theme:'night',series,rows,stats:summarize(tracks,records),onlyStarted:!!options.onlyStarted,date:options.date||new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'})};
}
export function showcaseLayout(model){
 const pad=40,label=160,gap=4,sectionGap=14,breaks=Math.max(0,new Set(model.series.map(s=>s.kind)).size-1),n=model.series.length;
 const width=Math.max(820,pad*2+label+80*n+gap*(n-1)+sectionGap*breaks),cell=(width-pad*2-label-gap*(n-1)-sectionGap*breaks)/n;let x=pad+label,last=null;
 const columns=model.series.map(s=>{if(last&&last!==s.kind)x+=sectionGap;last=s.kind;const result={x,width:cell,series:s};x+=cell+gap;return result;});
 const rowHeight=70,rowGap=4,tableY=384;
 const height=tableY+Math.max(model.rows.length,1)*(rowHeight+rowGap)+116;
 return {pad,label,columns,width,height,tableY,rowHeight,rowGap};
}

// Only CORS-readable blobs are decoded; a failed remote icon can never taint the canvas.
export async function loadShowcaseIcons(urls,{cache=new Map(),fetcher=globalThis.fetch,resolveURL=url=>url,decode=blob=>createImageBitmap(blob),timeout=12000,concurrency=8}={}){
 const unique=[...new Set(urls)],missing=unique.filter(url=>!cache.has(url)),controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),timeout);let next=0;
 async function worker(){
  while(next<missing.length&&!controller.signal.aborted){const url=missing[next++];try{
   const response=await fetcher(resolveURL(url),{mode:'cors',credentials:'omit',signal:controller.signal});if(!response.ok)continue;
   const image=await decode(await response.blob());if(image)cache.set(url,image);
  }catch{/* The cell's state is still rendered when the icon is unavailable. */}}
 }
 try{await Promise.all(Array.from({length:Math.min(concurrency,missing.length)},worker));}finally{clearTimeout(timer);}
 return {images:cache,missing:unique.filter(url=>!cache.has(url)).length};
}
let iconBundle;
export async function loadBundledShowcaseIcons(urls,options={}){
 if(!iconBundle)iconBundle=fetch(new URL('./data/weapon-icons.json',import.meta.url),{signal:AbortSignal.timeout(8000)}).then(r=>r.ok?r.json():null).catch(()=>null);
 const bundle=await iconBundle;if(!bundle)iconBundle=null;
 return loadShowcaseIcons(urls,{...options,resolveURL:url=>{
  const path=new URL(url).searchParams.get('path'),key=path?.split('/').at(-1)?.replace('.tex',''),local=bundle?.icons?.[key];
  return typeof local==='string'&&local.startsWith('data:image/png;base64,')?local:url;
 }});
}
export function canvasPNG(canvas){return new Promise((resolve,reject)=>{try{canvas.toBlob(blob=>blob?resolve(blob):reject(Error('PNG 이미지를 만들지 못했습니다.')),'image/png');}catch(e){reject(e);}});}
export function writePNG(blob,{clipboard=globalThis.navigator?.clipboard,Item=globalThis.ClipboardItem}={}){
 if(!clipboard?.write||!Item)return Promise.reject(Error('이 브라우저는 이미지 복사를 지원하지 않습니다. PNG 저장을 이용해 주세요.'));
 try{return clipboard.write([new Item({'image/png':blob})]);}catch(error){return Promise.reject(error);}
}

export function drawShowcase(canvas,model,images=new Map(),scale=2){
 const l=showcaseLayout(model),p=THEMES[model.theme],ctx=canvas.getContext('2d');if(!ctx)throw Error('이미지 그리기를 지원하지 않는 브라우저입니다.');
 canvas.width=l.width*scale;canvas.height=l.height*scale;ctx.scale(scale,scale);
 const font=(size,weight=400)=>{ctx.font=`${weight} ${size}px ${model.fontFamily||'LINESeedKR, NanumSquareRound, sans-serif'}`;};
 const text=(s,x,y,size=14,color=p.text,weight=400,align='left',max=null)=>{font(size,weight);ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';s=String(s);if(max&&ctx.measureText(s).width>max){while(s.length&&ctx.measureText(s+'…').width>max)s=s.slice(0,-1);s+='…';}ctx.fillText(s,x,y);};
 const box=(x,y,w,h,color,r=8,stroke=null)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}};
 const line=(x,y,x2,y2,color)=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=1;ctx.stroke();};
 const check=(x,y,color)=>{ctx.strokeStyle=color;ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x-1,y+4);ctx.lineTo(x+6,y-5);ctx.stroke();};
 const diamond=(x,y,r,color)=>{ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r,y);ctx.closePath();ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.stroke();};
 ctx.fillStyle=p.bg;ctx.fillRect(0,0,l.width,l.height);
 const grad=ctx.createLinearGradient(0,0,l.width,260);grad.addColorStop(0,p.top);grad.addColorStop(1,p.bg);ctx.fillStyle=grad;ctx.fillRect(0,0,l.width,300);
 line(l.pad,28,l.width-l.pad,28,p.gold);diamond(l.width-68,84,23,p.gold);diamond(l.width-68,84,12,p.gold);
 text(model.name||'FINAL FANTASY XIV',l.pad,68,18,p.gold,700,'left',l.width-180);
 text('무기 수집 현황',l.pad,123,42,p.text,800);
 text(`${model.scope} · ${model.series.length}개 시리즈 · ${model.date}`,l.pad,153,14,p.muted);
 const percent=model.stats.total?Math.round(model.stats.complete/model.stats.total*1000)/10:0;
 const statW=(l.width-l.pad*2-24)/3;
 [{label:'완성·수집',value:String(model.stats.complete),tail:`/ ${model.stats.total}개`,color:p.gold},{label:'성장 중',value:String(model.stats.progress),tail:'개 무기',color:p.blue},{label:'수집 달성률',value:percent.toFixed(1)+'%',tail:'최종 단계 기준',color:p.text}].forEach((s,i)=>{
  const x=l.pad+i*(statW+12);box(x,181,statW,78,p.panel,10,p.line);text(s.label,x+18,206,14,p.muted);text(s.value,x+18,243,30,s.color,800);
  font(30,800);const width=ctx.measureText(s.value).width;text(s.tail,x+28+width,242,14,p.muted);
 });
 let lx=l.pad;check(lx+6,285,p.gold);text('완성·수집',lx+20,290,14,p.muted);lx+=123;
 text('3/8',lx,290,14,p.blue,700);text('성장 중',lx+34,290,14,p.muted);lx+=118;
 text('○',lx,290,17,p.faint);text('미수집',lx+21,290,14,p.muted);lx+=103;
 text('—',lx,290,14,p.faint);text('해당 무기 없음',lx+24,290,14,p.muted);
 if(model.onlyStarted)text('기록한 직업만 표시 · 달성률은 전체 기준',l.width-l.pad,153,13.334,p.muted,400,'right');
 text('직업',l.pad+16,360,14,p.muted,700);
 for(const kind of [...new Set(model.series.map(s=>s.kind))]){
  const cols=l.columns.filter(c=>c.series.kind===kind),first=cols[0],last=cols.at(-1);line(first.x,319,last.x+last.width,319,p.line);text(groups[kind],first.x,337,13.334,p.gold,700);
 }
 for(const c of l.columns){const parts=headings[c.series.id]||[c.series.short];parts.forEach((s,i)=>text(s,c.x+c.width/2,parts.length===1?369:355+i*17,13.334,p.text,700,'center',c.width-4));}
 model.rows.forEach((row,index)=>{
  const y=l.tableY+index*(l.rowHeight+l.rowGap),role=roleColors[row.job.role]||p.muted;
  box(l.pad,y,l.width-l.pad*2,l.rowHeight,index%2?p.alternate:p.panel,7);
  ctx.fillStyle=role;ctx.fillRect(l.pad+1,y+13,3,44);
  text(row.job.name,l.pad+16,y+27,15,p.text,700,'left',128);text(`${row.job.id} · ${row.stats.complete}/${row.stats.total}`,l.pad+16,y+48,13.334,p.muted);
  if(row.job.id==='PLD')text('검 · 방패',l.pad+16,y+64,13.334,p.muted);
  row.cells.forEach((cell,colIndex)=>{
   const col=l.columns[colIndex],x=col.x;
   if(!cell.entries.length){text('—',x+col.width/2,y+41,16,p.faint,400,'center');return;}
   const split=cell.entries.length>1,ew=split?(col.width-8)/2:col.width-4;
   cell.entries.forEach((entry,i)=>{
    const ex=x+2+(split?i*(ew+4):0),complete=entry.status==='complete',started=entry.status==='progress';
    box(ex,y+4,ew,l.rowHeight-8,complete?p.goldBg:started?p.blueBg:p.empty,6,complete?p.gold:started?p.blue:null);
    const size=split?Math.min(36,ew-8):36,ix=ex+(ew-size)/2,iy=y+9,img=images.get(entry.item.icon);
    ctx.save();ctx.globalAlpha=complete?1:started?.95:.25;
    if(img){if(!complete&&!started)ctx.filter='grayscale(1)';ctx.drawImage(img,ix,iy,size,size);}
    else {diamond(ix+size/2,iy+size/2,size*.32,complete?p.gold:p.muted);line(ix+size*.28,iy+size*.72,ix+size*.72,iy+size*.28,p.muted);}
    ctx.restore();
    if(complete)check(ex+ew/2,y+55,p.gold);else text(started?`${entry.step}/${entry.total}`:'○',ex+ew/2,y+61,13.334,started?p.blue:p.faint,started?700:400,'center');
   });
  });
 });
 if(!model.rows.length){box(l.pad,l.tableY,l.width-l.pad*2,l.rowHeight,p.panel);text('아직 기록한 직업이 없습니다.',l.width/2,l.tableY+43,18,p.muted,400,'center');}
 const bottom=l.height-88;line(l.pad,bottom,l.width-l.pad,bottom,p.line);
 text('무기 수첩 · teo-park.github.io/ffxiv/weapons/',l.pad,bottom+26,14,p.muted,700);
 text('제작·획득 이력 · 나이트 검·방패 별도 집계',l.width-l.pad,bottom+26,13.334,p.muted,400,'right');
 text('© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.',l.pad,bottom+51,13.334,p.muted);
 text('데이터: 한국 공식 가이드 · FFXIV Collect · 게임 데이터 / 아이콘: XIVAPI',l.pad,bottom+73,13.334,p.muted);
 return l;
}
