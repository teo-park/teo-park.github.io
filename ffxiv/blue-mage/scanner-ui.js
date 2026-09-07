(function(){
  'use strict';
  window.BlueMageScanUI={mount};
  function mount({spells,apply}){
    const S=window.BlueMageScanner,$=id=>document.getElementById(id),pages=S.pagesFor(spells),canvas=$('scanCanvas'),ctx=canvas.getContext('2d');
    const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const labels={learned:'습득',missing:'미습득',review:'확인 필요'};
    let entries=[],selected=0,cell=0,bitmap=null,busy=false,editing=false,version=0,drag=null;
    const current=()=>entries[selected],pageFor=e=>pages.find(p=>p.number===e?.page),status=text=>{$('scanStatus').textContent=text;};
    const countFor=e=>pageFor(e)?.spells.length||16;
    function ready(){try{return !busy&&!editing?S.prepareImport(entries,spells):null;}catch{return null;}}
    function draw(){
      const e=current();if(!e||!bitmap)return;const r=e.crop;
      if(!editing&&e.results){canvas.width=bitmap.width;canvas.height=bitmap.height;ctx.drawImage(bitmap,0,0);}
      else{canvas.width=bitmap.width;canvas.height=bitmap.height;ctx.drawImage(bitmap,0,0);ctx.fillStyle='#03081488';ctx.fillRect(0,0,canvas.width,r.y*canvas.height);ctx.fillRect(0,(r.y+r.h)*canvas.height,canvas.width,canvas.height*(1-r.y-r.h));ctx.fillRect(0,r.y*canvas.height,r.x*canvas.width,r.h*canvas.height);ctx.fillRect((r.x+r.w)*canvas.width,r.y*canvas.height,canvas.width*(1-r.x-r.w),r.h*canvas.height);ctx.lineWidth=Math.max(1,canvas.width/500);ctx.strokeStyle='#a5caff';for(let n=0;n<=4;n++){ctx.beginPath();ctx.moveTo((r.x+r.w*n/4)*canvas.width,r.y*canvas.height);ctx.lineTo((r.x+r.w*n/4)*canvas.width,(r.y+r.h)*canvas.height);ctx.stroke();ctx.beginPath();ctx.moveTo(r.x*canvas.width,(r.y+r.h*n/4)*canvas.height);ctx.lineTo((r.x+r.w)*canvas.width,(r.y+r.h*n/4)*canvas.height);ctx.stroke();}}
    }
    function render(){
      const e=current(),p=pageFor(e),all=entries.flatMap(e=>e.results||[]),ids=ready();
      $('scanWorkspace').hidden=!e;
      $('scanFileList').innerHTML=entries.map((e,i)=>`<button type="button" data-scan-file="${i}" aria-pressed="${i===selected}" ${busy?'disabled':''}>${i+1}. ${esc(e.file.name)}<span>${e.page?e.page+'페이지':'페이지 미지정'} · ${e.reviewed?'✓ 확인 완료':e.results?'검토 중':'인식 전'}</span></button>`).join('');
      $('scanTotal').textContent=`캡처 ${entries.length}장 · 습득 ${all.filter(r=>r.state==='learned').length}칸 · 미습득 ${all.filter(r=>r.state==='missing').length}칸 · 확인 필요 ${all.filter(r=>r.state==='review').length}칸`;
      $('scanApply').disabled=!ids;$('scanApply').textContent=ids?`${ids.length}종 습득 기록에 추가`:'습득 기록에 추가';
      for(const id of ['scanAddImages','scanFiles'])$(id).disabled=busy;
      if(!e)return;
      $('scanPage').value=String(e.page||'');$('scanReviewed').checked=!!e.reviewed;$('scanReviewed').disabled=busy||editing||!p||!e.results||e.results.some(r=>r.state==='review');
      $('scanPageHelp').textContent=p?`No.${p.spells[0].id}–${p.spells.at(-1).id} · ${p.spells.length}칸${p.spells.length<16?' (마지막 줄은 빈 칸)':''}`:'캡처 위쪽의 게임 페이지 번호를 선택하세요. 번호는 자동 인식하지 않습니다.';
      $('scanOverlay').hidden=editing||!e.results;
      if(e.crop){$('scanOverlay').style.inset=`${e.crop.y*100}% auto auto ${e.crop.x*100}%`;$('scanOverlay').style.width=e.crop.w*100+'%';$('scanOverlay').style.height=e.crop.h*100+'%';}
      $('scanOverlay').innerHTML=e.results?Array.from({length:16},(_,i)=>{const r=e.results[i],s=p?.spells[i];if(!r)return '<span class="scan-unused">빈 칸</span>';const number=s?'No.'+s.id:`${Math.floor(i/4)+1}행 ${i%4+1}열`;return `<button type="button" class="scan-cell ${r.state} ${i===cell?'selected':''}" data-scan-cell="${i}" aria-label="${number} ${esc(s?.name||'')} ${labels[r.state]} · 누르면 변경" ${busy?'disabled':''}><b>${r.state==='learned'?'✓ ':r.state==='review'?'! ':''}${labels[r.state]}</b><span>${number}</span></button>`;}).join(''):'';
      const r=e.results?.[cell],s=p?.spells[cell];$('scanCellTools').hidden=editing||!r;
      $('scanCellTitle').textContent=r?`${s?'No.'+s.id+' '+s.name:`${Math.floor(cell/4)+1}행 ${cell%4+1}열`} · ${labels[r.state]}`:'';
      for(const state of ['learned','missing']){const b=$(state==='learned'?'scanLearned':'scanMissing');b.disabled=busy||!r;b.setAttribute('aria-pressed',r?.state===state);}
      $('scanNextReview').disabled=busy||!e.results?.some(r=>r.state==='review');
      for(const id of ['scanPage','scanRemove'])$(id).disabled=busy;
      for(const id of ['scanAnalyze','scanEditCrop','scanFullImage'])$(id).disabled=busy||!bitmap;
      $('scanFullImage').hidden=!editing;$('scanEditCrop').textContent=editing?'영역 조정 중':'아이콘 영역 조정';
      $('scanCropHelp').textContent=editing?'페이지 번호와 아래 합계를 제외한 4열 × 4행 칸 전체를 드래그하세요. 번호 표시는 포함해도 됩니다.':'칸을 누르면 습득 ↔ 미습득으로 바뀝니다. 왼쪽의 게임 체크박스는 읽지 않습니다.';
      draw();
    }
    function imagePixels(){const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;const context=c.getContext('2d',{willReadFrequently:true});context.drawImage(bitmap,0,0);return context.getImageData(0,0,c.width,c.height);}
    async function analyze(){
      const e=current();if(!e||!bitmap||busy)return;const error=S.validateRect(e.crop,bitmap.width,bitmap.height);if(error){status(error);return;}
      const token=++version;busy=true;e.reviewed=false;e.results=null;render();status('4 × 4 아이콘에서 습득 상태를 읽고 있어요.');
      try{const results=await S.analyze(imagePixels(),e.crop,{count:countFor(e),cancelled:()=>version!==token});if(token!==version)return;e.results=results;editing=false;cell=Math.max(0,results.findIndex(r=>r.state==='review'));status(`습득 ${results.filter(r=>r.state==='learned').length}개 · 미습득 ${results.filter(r=>r.state==='missing').length}개 · 확인 필요 ${results.filter(r=>r.state==='review').length}개. 페이지 번호와 칸을 확인해 주세요.`);}
      catch(error){if(token===version)status(error.message);}finally{if(token===version){busy=false;render();}}
    }
    async function select(index){
      const token=++version;busy=true;selected=index;cell=0;editing=false;bitmap?.close();bitmap=null;render();
      try{let image=await createImageBitmap(current().file);if(image.width<100||image.height<100||image.width*image.height>32000000){image.close();throw Error('100×100 이상, 3,200만 화소 이하 이미지를 사용해 주세요.');}if(token!==version){image.close();return;}
        if(Math.max(image.width,image.height)>1600){const scale=1600/Math.max(image.width,image.height),resized=await createImageBitmap(image,{resizeWidth:Math.round(image.width*scale),resizeHeight:Math.round(image.height*scale)});image.close();image=resized;}if(token!==version){image.close();return;}
        bitmap=image;current().crop||=S.defaultCrop(image.width,image.height);busy=false;render();if(!current().results)await analyze();else status('페이지 번호와 습득 상태를 확인해 주세요.');
      }catch(error){if(token===version){busy=false;status(error.message);render();}}
    }
    async function add(files){
      if(busy)return;const chosen=Array.from(files).filter(f=>/^image\/(png|jpeg|webp|bmp)$/.test(f.type));if(!chosen.length){status('PNG·JPG·WebP·BMP 이미지를 선택해 주세요.');return;}
      if(entries.length+chosen.length>12||chosen.some(f=>f.size>12000000)){status('한 번에 12장 이하, 파일당 12MB 이하로 추가해 주세요.');return;}
      const first=entries.length;entries.push(...chosen.map(file=>({file,page:0,reviewed:false,results:null})));await select(first);
    }
    function setState(state){const e=current(),r=e?.results?.[cell];if(!r||busy||editing)return;r.state=state;r.manual=true;e.reviewed=false;render();}
    function changeCrop(rect){const e=current();if(!e||busy)return;e.crop=rect;e.results=null;e.reviewed=false;editing=true;render();}
    const point=event=>{const r=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(event.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(event.clientY-r.top)/r.height))};};
    canvas.addEventListener('pointerdown',event=>{if(!editing||busy||!bitmap)return;drag={start:point(event),before:{...current().crop}};canvas.setPointerCapture(event.pointerId);});
    canvas.addEventListener('pointermove',event=>{if(!drag)return;const end=point(event),start=drag.start;current().crop={x:Math.min(start.x,end.x),y:Math.min(start.y,end.y),w:Math.abs(end.x-start.x),h:Math.abs(end.y-start.y)};draw();});
    canvas.addEventListener('pointerup',event=>{if(!drag)return;const end=point(event),start=drag.start,rect={x:Math.min(start.x,end.x),y:Math.min(start.y,end.y),w:Math.abs(end.x-start.x),h:Math.abs(end.y-start.y)};if(rect.w<.03||rect.h<.03)current().crop=drag.before;else changeCrop(rect);drag=null;draw();});
    canvas.addEventListener('pointercancel',()=>{if(drag){current().crop=drag.before;drag=null;draw();}});
    $('scanPage').insertAdjacentHTML('beforeend',pages.map(p=>`<option value="${p.number}">${p.number}페이지 · No.${p.spells[0].id}–${p.spells.at(-1).id}</option>`).join(''));
    $('openScan').addEventListener('click',()=>{$('scanDialog').showModal();render();});$('closeScan').addEventListener('click',()=>$('scanDialog').close());
    $('scanDialog').addEventListener('close',()=>{++version;busy=false;if(drag&&current())current().crop=drag.before;drag=null;render();});
    $('scanAddImages').addEventListener('click',()=>$('scanFiles').click());$('scanFiles').addEventListener('change',async event=>{await add(event.target.files);event.target.value='';});
    document.addEventListener('paste',event=>{if(!$('scanDialog').open||busy)return;const images=Array.from(event.clipboardData?.items||[]).filter(i=>i.kind==='file'&&i.type.startsWith('image/')).map(i=>i.getAsFile()).filter(Boolean);if(images.length){event.preventDefault();add(images);}});
    $('scanFileList').addEventListener('click',event=>{const b=event.target.closest('[data-scan-file]');if(b&&!busy)select(+b.dataset.scanFile);});
    $('scanOverlay').addEventListener('click',event=>{const b=event.target.closest('[data-scan-cell]');if(!b||busy)return;cell=+b.dataset.scanCell;setState(current().results[cell].state==='learned'?'missing':'learned');$('scanOverlay').querySelector(`[data-scan-cell="${cell}"]`)?.focus({preventScroll:true});});
    $('scanLearned').addEventListener('click',()=>setState('learned'));$('scanMissing').addEventListener('click',()=>setState('missing'));
    $('scanNextReview').addEventListener('click',()=>{const results=current()?.results||[];cell=results.findIndex((r,i)=>i>cell&&r.state==='review');if(cell<0)cell=results.findIndex(r=>r.state==='review');render();});
    $('scanPage').addEventListener('change',()=>{const e=current();e.page=+$('scanPage').value;e.reviewed=false;cell=0;if(e.results?.length!==countFor(e))analyze();else render();});
    $('scanReviewed').addEventListener('change',()=>{if(current())current().reviewed=$('scanReviewed').checked;render();});
    $('scanAnalyze').addEventListener('click',analyze);$('scanEditCrop').addEventListener('click',()=>{editing=true;current().reviewed=false;render();});$('scanFullImage').addEventListener('click',()=>changeCrop({x:0,y:0,w:1,h:1}));
    $('scanRemove').addEventListener('click',()=>{if(busy)return;entries.splice(selected,1);bitmap?.close();bitmap=null;editing=false;if(entries.length)select(Math.min(selected,entries.length-1));else{selected=0;render();status('캡처를 추가해 주세요.');}});
    $('scanApply').addEventListener('click',()=>{if(busy||editing)return;try{const ids=S.prepareImport(entries,spells),result=apply(ids);if(!result.ok)throw Error(result.error||'저장하지 못했어요.');entries=[];bitmap?.close();bitmap=null;render();$('scanDialog').close();}catch(error){status(error.message);}});
    $('openScan').disabled=false;render();
  }
})();
