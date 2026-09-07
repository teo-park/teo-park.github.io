(function(){
  'use strict';
  window.MinionScanUI={mount};
  function mount({minions,apply}){
    const S=window.MinionScanner,$=id=>document.getElementById(id),byId=new Map(minions.map(m=>[m.id,m]));
    const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const canvas=$('scanCanvas'),ctx=canvas.getContext('2d');
    let entries=[],selected=0,cell=0,bitmap=null,refs=null,busy=false,editing=false,version=0,drag=null;
    const current=()=>entries[selected],status=text=>{$('scanStatus').textContent=text;};
    const name=id=>byId.get(id)?.name||'후보 없음';
    function ready(){try{return S.prepareImport(entries,minions);}catch{return null;}}
    function totals(){
      const all=entries.flatMap(e=>e.results||[]),ids=ready();
      $('scanTotal').textContent=`추가 후보 ${new Set(all.filter(r=>r.state==='match').map(r=>r.id)).size}종 · 확인 필요 ${all.filter(r=>r.state==='review').length}칸 · 제외 ${all.filter(r=>r.state==='skip').length}칸`;
      $('scanApply').disabled=busy||!ids;
      $('scanApply').textContent=ids?`${ids.length}종 보유 기록에 추가`:'보유 기록에 추가';
    }
    function draw(){
      if(!bitmap||!current())return;
      const r=current().crop;
      if(!editing&&current().results){
        canvas.width=Math.round(bitmap.width*r.w);canvas.height=Math.round(bitmap.height*r.h);
        ctx.drawImage(bitmap,r.x*bitmap.width,r.y*bitmap.height,r.w*bitmap.width,r.h*bitmap.height,0,0,canvas.width,canvas.height);
      }else{
        canvas.width=bitmap.width;canvas.height=bitmap.height;ctx.drawImage(bitmap,0,0);
        ctx.fillStyle='#03081488';ctx.fillRect(0,0,canvas.width,r.y*canvas.height);ctx.fillRect(0,(r.y+r.h)*canvas.height,canvas.width,canvas.height*(1-r.y-r.h));
        ctx.fillRect(0,r.y*canvas.height,r.x*canvas.width,r.h*canvas.height);ctx.fillRect((r.x+r.w)*canvas.width,r.y*canvas.height,(1-r.x-r.w)*canvas.width,r.h*canvas.height);
        ctx.lineWidth=Math.max(1,canvas.width/500);ctx.strokeStyle='#a5d8b2';
        for(let x=0;x<=5;x++){ctx.beginPath();ctx.moveTo((r.x+r.w*x/5)*canvas.width,r.y*canvas.height);ctx.lineTo((r.x+r.w*x/5)*canvas.width,(r.y+r.h)*canvas.height);ctx.stroke();}
        for(let y=0;y<=6;y++){ctx.beginPath();ctx.moveTo(r.x*canvas.width,(r.y+r.h*y/6)*canvas.height);ctx.lineTo((r.x+r.w)*canvas.width,(r.y+r.h*y/6)*canvas.height);ctx.stroke();}
      }
    }
    function candidates(){
      const r=current()?.results?.[cell];$('scanCandidates').hidden=!r||editing;
      if(!r||editing)return;
      $('scanCellTitle').textContent=`${Math.floor(cell/5)+1}행 ${cell%5+1}열 · ${r.state==='skip'?'제외':name(r.id)}`;
      $('scanCellHelp').textContent=r.state==='review'?'그림을 비교하고 맞는 꼬친을 선택하세요. 목록에서 직접 검색할 수도 있어요.':r.usedOrder&&r.orderContext?`${name(r.orderContext.before)} → ${name(r.id)} → ${name(r.orderContext.after)} 순서에서 그림을 다시 비교한 후보예요.`:r.usedOrder?'앞뒤 꼬친의 게임 분류순을 함께 확인한 후보예요.':'선택한 칸의 꼬친을 바꾸거나 등록에서 제외할 수 있어요.';
      const query=$('scanCandidateSearch').value;
      const options=query.trim()?minions.filter(m=>window.MinionCollection.matches(m,query)).slice(0,30):r.candidates.map(c=>byId.get(c.id)).filter(Boolean);
      $('scanCandidateList').innerHTML=options.map(m=>`<button type="button" data-scan-id="${m.id}" aria-pressed="${r.state==='match'&&r.id===m.id}" ${busy?'disabled':''}><img src="${esc(m.icon)}" alt="" width="40" height="40"><span>${esc(m.name)}</span>${r.id===m.id?'<b>현재 후보</b>':''}</button>`).join('')||'<p>검색 결과가 없어요.</p>';
      $('scanSkipCell').disabled=busy;$('scanNextReview').disabled=busy||!current().results.some(r=>r.state==='review');
    }
    function render(){
      const e=current();
      $('scanWorkspace').hidden=!e;
      $('scanFileList').innerHTML=entries.map((entry,i)=>`<button type="button" data-scan-file="${i}" aria-pressed="${i===selected}" ${busy?'disabled':''}>${i+1}. ${esc(entry.file.name)} <span>${entry.reviewed?'✓ 확인 완료':entry.results?'검토 중':'인식 전'}</span></button>`).join('');
      if(e){
        $('scanCount').value=e.count;$('scanUseOrder').checked=e.useOrder;
        $('scanReviewed').checked=!!e.reviewed;$('scanReviewed').disabled=busy||!e.results||e.results.some(r=>r.state==='review')||editing;
        $('scanOverlay').hidden=editing||!e.results;
        $('scanOverlay').innerHTML=e.results?Array.from({length:30},(_,i)=>{
          const r=e.results[i];if(!r)return '<span class="scan-unused">빈 칸</span>';
          const label={match:'추가',review:'확인',skip:'제외'}[r.state];
          return `<button type="button" class="scan-cell ${r.state} ${i===cell?'selected':''}" data-scan-cell="${i}" aria-label="${Math.floor(i/5)+1}행 ${i%5+1}열 ${esc(name(r.id))} ${label}" aria-pressed="${i===cell}" ${busy?'disabled':''}><b>${label==='추가'?'✓ ':label==='확인'?'? ':''}${label}</b><span>${esc(r.state==='skip'?'등록 제외':name(r.id))}</span></button>`;
        }).join(''):'';
        $('scanCropHelp').textContent=editing?'빈 칸을 포함한 5열 × 6행 영역을 드래그하세요. 페이지 번호·검색 버튼은 제외해요.':'칸을 누르면 후보 목록에서 인식한 이름을 확인·수정할 수 있어요.';
        $('scanEditCrop').textContent=editing?'영역 조정 중':'아이콘 영역 조정';
        for(const id of ['scanAnalyze','scanEditCrop','scanFullImage','scanCount','scanUseOrder'])$(id).disabled=busy||!bitmap;
        $('scanRemove').disabled=busy;
        $('scanFullImage').hidden=!editing;
        draw();candidates();
      }
      $('scanFiles').disabled=busy;$('scanAddImages').disabled=busy;totals();
    }
    async function referenceData(){
      if(refs)return refs;
      const res=await fetch('./scan-icons.json?v=20260908-1');if(!res.ok)throw Error('아이콘 비교 자료를 불러오지 못했어요. 다시 인식을 눌러 주세요.');
      refs=S.references(await res.json());return refs;
    }
    async function analyze(){
      const e=current();if(!e||!bitmap||busy)return;
      const error=S.validateRect(e.crop,bitmap.width,bitmap.height);if(error){status(error);return;}
      const token=++version;busy=true;e.results=null;e.reviewed=false;render();status('아이콘 비교 자료를 준비하고 있어요.');
      try{
        const references=await referenceData();if(token!==version)return;
        const scratch=document.createElement('canvas');scratch.width=bitmap.width;scratch.height=bitmap.height;
        const context=scratch.getContext('2d',{willReadFrequently:true});context.drawImage(bitmap,0,0);
        const results=await S.analyze(context.getImageData(0,0,scratch.width,scratch.height),e.crop,references,{count:e.count,minions,useOrder:e.useOrder,cancelled:()=>token!==version,onProgress:(n,total)=>status(`${n} / ${total}칸 인식 중…`)});
        if(token!==version)return;
        e.results=results;cell=Math.max(0,results.findIndex(r=>r.state==='review'));editing=false;
        status(`인식 완료 · ${results.filter(r=>r.state==='review').length}칸 확인 필요. 이름을 확인한 뒤 아래 확인란을 체크하세요.`);
      }catch(error){if(token===version)status(error.message);}
      finally{if(token===version){busy=false;render();}}
    }
    async function select(index){
      const token=++version;busy=true;selected=index;cell=0;bitmap?.close();bitmap=null;editing=false;$('scanCandidateSearch').value='';render();
      try{
        let image=await createImageBitmap(current().file);
        if(image.width<100||image.height<100||image.width*image.height>32000000){image.close();throw Error('이미지는 100×100 이상, 3,200만 화소 이하로 선택해 주세요.');}
        if(token!==version){image.close();return;}
        if(Math.max(image.width,image.height)>1600){const resized=await createImageBitmap(image,{resizeWidth:Math.round(image.width*Math.min(1,1600/Math.max(image.width,image.height))),resizeHeight:Math.round(image.height*Math.min(1,1600/Math.max(image.width,image.height)))});image.close();image=resized;}
        if(token!==version){image.close();return;}
        bitmap=image;current().crop||=S.defaultCrop(image.width,image.height);busy=false;render();
        if(!current().results)await analyze();
      }catch(error){if(token===version){busy=false;status(error.message);render();}}
    }
    async function add(files){
      if(busy)return;
      const chosen=Array.from(files).filter(f=>/^image\/(png|jpeg|webp|bmp)$/.test(f.type));
      if(!chosen.length){status('PNG·JPG·WebP·BMP 이미지 파일을 선택해 주세요.');return;}
      if(entries.length+chosen.length>24||chosen.some(f=>f.size>12000000)){status('한 번에 24개 이하, 파일당 12MB 이하로 추가해 주세요.');return;}
      const first=entries.length;
      entries.push(...chosen.map((file,i)=>({file,count:30,useOrder:true,reviewed:false,results:null,key:first+i})));
      await select(first);
    }
    function choose(id){const e=current(),r=e?.results?.[cell];if(!r||busy||!byId.has(id))return;r.id=id;r.state='match';r.manual=true;r.usedOrder=false;delete r.orderContext;e.reviewed=false;render();}
    function changeCrop(rect){const e=current();if(!e||busy)return;e.crop=rect;e.results=null;e.reviewed=false;editing=true;render();}
    const point=event=>{const r=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(event.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(event.clientY-r.top)/r.height))};};
    canvas.addEventListener('pointerdown',event=>{if(!editing||busy||!bitmap)return;drag={start:point(event),before:{...current().crop}};canvas.setPointerCapture(event.pointerId);});
    canvas.addEventListener('pointermove',event=>{if(!drag)return;const end=point(event),start=drag.start;current().crop={x:Math.min(start.x,end.x),y:Math.min(start.y,end.y),w:Math.abs(end.x-start.x),h:Math.abs(end.y-start.y)};draw();});
    canvas.addEventListener('pointerup',event=>{if(!drag)return;const end=point(event),start=drag.start,rect={x:Math.min(start.x,end.x),y:Math.min(start.y,end.y),w:Math.abs(end.x-start.x),h:Math.abs(end.y-start.y)};if(rect.w<.03||rect.h<.03)current().crop=drag.before;else changeCrop(rect);drag=null;draw();});
    canvas.addEventListener('pointercancel',()=>{if(drag){current().crop=drag.before;drag=null;draw();}});
    $('openScan').addEventListener('click',()=>{$('scanDialog').showModal();render();});
    $('closeScan').addEventListener('click',()=>$('scanDialog').close());
    $('scanDialog').addEventListener('close',()=>{++version;busy=false;drag=null;render();});
    $('scanAddImages').addEventListener('click',()=>$('scanFiles').click());
    $('scanFiles').addEventListener('change',async event=>{await add(event.target.files);event.target.value='';});
    document.addEventListener('paste',event=>{
      if(!$('scanDialog').open||busy)return;
      const images=Array.from(event.clipboardData?.items||[]).filter(item=>item.kind==='file'&&item.type.startsWith('image/')).map(item=>item.getAsFile()).filter(Boolean);
      if(images.length){event.preventDefault();add(images);}
    });
    $('scanFileList').addEventListener('click',event=>{const b=event.target.closest('[data-scan-file]');if(b&&!busy)select(+b.dataset.scanFile);});
    $('scanOverlay').addEventListener('click',event=>{const b=event.target.closest('[data-scan-cell]');if(!b||busy)return;cell=+b.dataset.scanCell;$('scanCandidateSearch').value='';render();});
    $('scanCandidateList').addEventListener('click',event=>{const b=event.target.closest('[data-scan-id]');if(b)choose(+b.dataset.scanId);});
    $('scanCandidateSearch').addEventListener('input',candidates);
    $('scanSkipCell').addEventListener('click',()=>{const e=current(),r=e?.results?.[cell];if(!r||busy)return;r.state='skip';e.reviewed=false;render();});
    $('scanNextReview').addEventListener('click',()=>{const results=current()?.results||[];cell=results.findIndex((r,i)=>i>cell&&r.state==='review');if(cell<0)cell=results.findIndex(r=>r.state==='review');$('scanCandidateSearch').value='';render();});
    $('scanReviewed').addEventListener('change',event=>{if(current())current().reviewed=event.target.checked;render();});
    $('scanAnalyze').addEventListener('click',analyze);
    $('scanEditCrop').addEventListener('click',()=>{editing=true;current().reviewed=false;render();});
    $('scanFullImage').addEventListener('click',()=>changeCrop({x:0,y:0,w:1,h:1}));
    $('scanCount').addEventListener('change',event=>{current().count=+event.target.value;current().results=null;current().reviewed=false;render();analyze();});
    $('scanUseOrder').addEventListener('change',event=>{current().useOrder=event.target.checked;current().results=null;current().reviewed=false;render();analyze();});
    $('scanRemove').addEventListener('click',()=>{if(busy)return;entries.splice(selected,1);bitmap?.close();bitmap=null;if(entries.length)select(Math.min(selected,entries.length-1));else{selected=0;render();status('캡처를 추가해 주세요.');}});
    $('scanApply').addEventListener('click',()=>{
      if(busy)return;
      try{const ids=S.prepareImport(entries,minions),result=apply(ids);if(!result.ok)throw Error(result.error||'저장하지 못했어요.');
        status(result.message||'보유 기록에 추가했어요.');entries=[];bitmap?.close();bitmap=null;render();$('scanDialog').close();
      }catch(error){status(error.message);}
    });
    $('openScan').disabled=false;render();
  }
})();
