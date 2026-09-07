(function () {
  'use strict';
  window.TriadScanUI = {mount};
  function mount({cards, apply}) {
    const S = window.TriadScanner, $ = id => document.getElementById(id), pages = S.pagesFor(cards);
    const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const canvas = $('scanCanvas'), context = canvas.getContext('2d');
    let entries = [], selected = 0, bitmap = null, dragStart = null, dragCrop = null, previewVersion = 0, runVersion = 0, busy = false, pasteNumber = 0;
    const current = () => entries[selected];
    const status = text => { $('scanStatus').textContent = text; };
    const getPage = entry => pages.find(page => page.key === entry.pageKey);
    const counts = entry => Object.fromEntries(['owned', 'missing', 'uncertain'].map(state => [state, entry.results?.filter(r => r.state === state).length || 0]));
    function defaultCrop(width, height) {
      if (width / height > .65 && width / height < .9) return {x: 14 / 256, y: 32 / 341, w: 229 / 256, h: 278 / 341};
      const h = Math.min(height * .75, width * .8 * 6 / 5), w = h * 5 / 6;
      return {x: (1 - w / width) / 2, y: (1 - h / height) / 2, w: w / width, h: h / height};
    }
    async function openImage(file) {
      const image = await createImageBitmap(file);
      if (image.width * image.height > 32000000 || image.width < 100 || image.height < 100) { image.close(); throw Error('이미지는 100×100 이상, 3,200만 화소 이하로 선택해 주세요.'); }
      return image;
    }
    function cropFields() {
      const crop = current()?.crop;
      if (!crop) return;
      for (const [suffix, key] of [['X','x'],['Y','y'],['W','w'],['H','h']]) $('scanCrop' + suffix).value = (crop[key] * 100).toFixed(1);
    }
    function draw() {
      if (!bitmap || !current()?.crop) return;
      const {x,y,w,h} = current().crop, W = canvas.width, H = canvas.height;
      context.clearRect(0,0,W,H); context.drawImage(bitmap,0,0,W,H);
      context.fillStyle = '#03081499';
      context.fillRect(0,0,W,y*H); context.fillRect(0,(y+h)*H,W,(1-y-h)*H);
      context.fillRect(0,y*H,x*W,h*H); context.fillRect((x+w)*W,y*H,(1-x-w)*W,h*H);
      context.lineWidth = Math.max(1,W/700); context.strokeStyle = '#e7c78d';
      for (let col=0;col<=5;col++) { context.beginPath(); context.moveTo((x+w*col/5)*W,y*H); context.lineTo((x+w*col/5)*W,(y+h)*H); context.stroke(); }
      for (let row=0;row<=6;row++) { context.beginPath(); context.moveTo(x*W,(y+h*row/6)*H); context.lineTo((x+w)*W,(y+h*row/6)*H); context.stroke(); }
    }
    function fileList() {
      $('scanFileList').innerHTML = entries.map((entry,index) => {
        const count = counts(entry);
        return `<button data-scan-file="${index}" aria-pressed="${index===selected}"><strong>${index+1}. ${esc(entry.file.name)}</strong><span>${entry.error ? '확인 필요' : entry.reviewed ? '✓ 검토 완료' : entry.results ? `보유 ${count.owned} · 미수집 ${count.missing}${count.uncertain ? ` · 확인 ${count.uncertain}` : ''}` : '인식 전'}</span></button>`;
      }).join('');
    }
    function prepare() {
      const ready = S.prepareImport(entries,pages);
      const expected = $('scanExpected').value.trim();
      if (expected && (!/^\d+$/.test(expected) || +expected > cards.length)) throw Error(`전체 보유 수는 0~${cards.length} 사이로 입력해 주세요.`);
      if (ready.seenIds.length === cards.length && expected && +expected !== ready.ownedIds.length) throw Error(`전체 인식 ${ready.ownedIds.length}장과 입력한 보유 수 ${expected}장이 달라요. 페이지와 칸을 다시 확인해 주세요.`);
      return ready;
    }
    function updateTotal() {
      const total = entries.reduce((sum,entry) => { const c=counts(entry); for(const key of Object.keys(c))sum[key]+=c[key]; return sum; }, {owned:0,missing:0,uncertain:0});
      $('scanTotal').textContent = `보유 ${total.owned}장 · 미수집 ${total.missing}장 · 확인 필요 ${total.uncertain}칸 / 페이지 검토 ${entries.filter(e=>e.reviewed).length}/${entries.length}`;
      let message = '', ready;
      try {
        ready = prepare();
        message = `${ready.seenIds.length}/${cards.length}장의 칸을 확인했어요. ${ready.ownedIds.length}장을 보유 카드로 반영합니다.`;
        if (document.querySelector('[name="scanMode"]:checked').value === 'pages') message += ' 확인한 페이지의 미수집 칸은 기존 체크도 해제해요.';
      } catch (error) { message=error.message; ready=null; }
      $('scanApplyMessage').textContent = message;
      $('scanApply').disabled = busy || !ready;
    }
    function renderReview() {
      const entry=current(); if(!entry)return;
      const page=getPage(entry), count=counts(entry);
      $('scanPage').value=entry.pageKey||''; $('scanFileName').textContent=entry.file.name;
      $('scanPageSummary').textContent=entry.error || (entry.results ? `보유 ${count.owned}장 · 미수집 ${count.missing}장${count.uncertain ? ` · 확인 필요 ${count.uncertain}칸` : ''} — 칸을 누르면 상태를 바꿀 수 있어요.` : '영역을 확인한 뒤 전체 인식을 눌러 주세요.');
      $('scanReviewGrid').innerHTML=entry.results&&page ? entry.results.map((result,index) => {
        const card=page.cards[index], label={owned:'보유',missing:'미수집',uncertain:'확인 필요'}[result.state];
        return `<button class="scan-cell ${result.state}" data-scan-cell="${index}" aria-label="${esc(card.number+' '+card.name+' · '+label+' · 눌러서 변경')}"><span>${esc(card.number)}</span><strong>${esc(card.name)}</strong><b>${label}${result.manual ? ' · 수정' : ''}</b></button>`;
      }).join('') : '';
      $('scanReviewed').checked=!!entry.reviewed; $('scanReviewed').disabled=busy||!entry.results||!!count.uncertain;
      $('scanAnalyze').disabled=busy; $('scanCopyCrop').disabled=busy||!entry.crop;
      $('scanPage').disabled=busy; $('scanFiles').disabled=busy;
      $('scanNext').disabled=busy||selected>=entries.length-1;
      fileList(); updateTotal();
    }
    async function select(index) {
      selected=index; const entry=current(), version=++previewVersion;
      renderReview();
      try {
        const image=await openImage(entry.file);
        if(version!==previewVersion){image.close();return;}
        bitmap?.close(); bitmap=image; entry.width=image.width; entry.height=image.height;
        entry.crop ||= defaultCrop(image.width,image.height);
        canvas.width=image.width; canvas.height=image.height; cropFields(); draw(); renderReview();
      } catch(error) { if(version!==previewVersion)return; entry.error=error.message; status(error.message); renderReview(); }
    }
    function changeCrop(crop) {
      const entry=current(); if(!entry||busy)return;
      entry.crop=crop; entry.results=null; entry.reviewed=false; entry.error=''; cropFields(); draw(); renderReview();
    }
    function point(event) {
      const rect=canvas.getBoundingClientRect();
      return {x:Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width)),y:Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height))};
    }
    canvas.addEventListener('pointerdown',event=>{if(busy||!bitmap)return;dragStart=point(event);dragCrop={...current().crop};canvas.setPointerCapture(event.pointerId);});
    canvas.addEventListener('pointermove',event=>{
      if(!dragStart)return;const end=point(event);
      current().crop={x:Math.min(dragStart.x,end.x),y:Math.min(dragStart.y,end.y),w:Math.abs(end.x-dragStart.x),h:Math.abs(end.y-dragStart.y)};draw();
    });
    function finishDrag(event) {
      if(!dragStart)return;const end=point(event);
      const rect={x:Math.min(dragStart.x,end.x),y:Math.min(dragStart.y,end.y),w:Math.abs(end.x-dragStart.x),h:Math.abs(end.y-dragStart.y)};
      dragStart=null;
      if(rect.w<.03||rect.h<.03){current().crop=dragCrop;draw();return;}
      changeCrop(rect);
    }
    canvas.addEventListener('pointerup',finishDrag);
    canvas.addEventListener('pointercancel',()=>{if(dragStart){current().crop=dragCrop;draw();}dragStart=null;});
    for(const suffix of ['X','Y','W','H']) $('scanCrop'+suffix).addEventListener('change',()=>{
      const crop=Object.fromEntries([['X','x'],['Y','y'],['W','w'],['H','h']].map(([field,key])=>[key,Number($('scanCrop'+field).value)/100]));
      const error=S.validateRect(crop,bitmap?.width||0,bitmap?.height||0);
      if(error){status(error);return;} changeCrop(crop);
    });
    $('scanCopyCrop').addEventListener('click',()=>{
      const crop=current()?.crop;if(!crop)return;
      const error=S.validateRect(crop,bitmap.width,bitmap.height);if(error){status(error);return;}
      for(const entry of entries){entry.crop={...crop};entry.results=null;entry.reviewed=false;entry.error='';}
      status('같은 비율의 카드 영역을 모든 캡처에 적용했어요. 전체 인식을 눌러 주세요.');renderReview();
    });
    async function addFiles(files, pasted=false) {
      if(!files.length)return;
      if(busy){status('인식이 끝난 뒤 캡처를 다시 추가해 주세요.');return;}
      const totalSize=[...entries.map(e=>e.file),...files].reduce((sum,f)=>sum+f.size,0);
      if(entries.length+files.length>30||files.some(f=>!['image/png','image/jpeg','image/webp'].includes(f.type)||f.size>20*1024*1024)||totalSize>200*1024*1024){status('PNG·JPG·WebP를 최대 30장, 파일당 20MB·합계 200MB 이하로 추가해 주세요. 기존 캡처는 유지했어요.');return;}
      const firstAdded=entries.length, usedPages=new Set(entries.map(e=>e.pageKey));
      if(!pasted)files.sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));
      for(let file of files){
        if(pasted){const ext={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[file.type];file=new File([file],`붙여넣은 캡처 ${String(++pasteNumber).padStart(2,'0')}.${ext}`,{type:file.type});}
        const pageKey=pages.find(p=>!usedPages.has(p.key))?.key||'';usedPages.add(pageKey);
        entries.push({file,pageKey,crop:null,results:null,reviewed:false,error:''});
      }
      $('scanWorkspace').hidden=false;$('scanApplyPanel').hidden=false;
      status(`${files.length}장을 ${pasted?'붙여넣었어요':'추가했어요'}. 총 ${entries.length}장 · 새 캡처의 페이지 번호와 5×6 카드 영역을 확인해 주세요.`);
      await select(firstAdded);
    }
    $('scanFiles').addEventListener('change',event=>{
      const files=[...event.target.files];event.target.value='';void addFiles(files);
    });
    document.addEventListener('paste',event=>{
      if(!$('scanDialog').open||!event.clipboardData)return;
      let files=Array.from(event.clipboardData.items||[]).filter(item=>item.kind==='file'&&item.type.startsWith('image/')).map(item=>item.getAsFile()).filter(Boolean);
      if(!files.length)files=Array.from(event.clipboardData.files||[]).filter(file=>file.type.startsWith('image/'));
      if(!files.length)return;
      event.preventDefault();void addFiles(files,true);
    });
    $('scanPage').innerHTML='<option value="">페이지 선택</option>'+pages.map(p=>`<option value="${p.key}">${esc(p.label)}</option>`).join('');
    $('scanPage').addEventListener('change',()=>{current().pageKey=$('scanPage').value;current().results=null;current().reviewed=false;current().error='';renderReview();});
    $('scanFileList').addEventListener('click',event=>{const button=event.target.closest('[data-scan-file]');if(button&&!busy)select(Number(button.dataset.scanFile));});
    $('scanNext').addEventListener('click',async()=>{if(busy||selected>=entries.length-1)return;await select(selected+1);$('scanPage').scrollIntoView({block:'start',behavior:'smooth'});});
    $('scanReviewGrid').addEventListener('click',event=>{
      const button=event.target.closest('[data-scan-cell]');if(!button||busy)return;
      const index=Number(button.dataset.scanCell),result=current().results[index];result.state=result.state==='owned'?'missing':'owned';result.manual=true;current().reviewed=false;renderReview();
      $('scanReviewGrid').querySelector(`[data-scan-cell="${index}"]`)?.focus({preventScroll:true});
    });
    $('scanReviewed').addEventListener('change',()=>{current().reviewed=$('scanReviewed').checked;fileList();updateTotal();});
    $('scanExpected').addEventListener('input',updateTotal);
    document.querySelectorAll('[name="scanMode"]').forEach(el=>el.addEventListener('change',updateTotal));
    $('scanAnalyze').addEventListener('click',async()=>{
      const version=++runVersion;busy=true;renderReview();
      for(let index=0;index<entries.length;index++){
        if(version!==runVersion)return;
        const entry=entries[index];if(entry.results)continue;
        status(`${index+1}/${entries.length} 캡처 인식 중…`);await new Promise(resolve=>setTimeout(resolve,0));
        let image;
        try {
          const page=getPage(entry);if(!page)throw Error('게임 페이지 번호를 지정해 주세요.');
          image=await openImage(entry.file);entry.width=image.width;entry.height=image.height;entry.crop ||= defaultCrop(image.width,image.height);
          const error=S.validateRect(entry.crop,image.width,image.height);if(error)throw Error(error);
          const crop=entry.crop,cw=crop.w*image.width,ch=crop.h*image.height,scale=Math.min(1,1400/Math.max(cw,ch));
          const work=document.createElement('canvas');work.width=Math.round(cw*scale);work.height=Math.round(ch*scale);
          const ctx=work.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,crop.x*image.width,crop.y*image.height,cw,ch,0,0,work.width,work.height);
          entry.results=S.analyze(ctx.getImageData(0,0,work.width,work.height),{x:0,y:0,w:1,h:1},page.cards.length);entry.reviewed=false;entry.error='';
          work.width=work.height=0;
        } catch(error){entry.error=error.message;entry.results=null;} finally{image?.close();}
        renderReview();
      }
      if(version!==runVersion)return;
      busy=false;status('인식했어요. 각 캡처의 게임 페이지 번호와 결과를 확인하세요. 확인 필요 칸은 직접 지정해야 저장할 수 있어요.');renderReview();
    });
    $('scanApply').addEventListener('click',()=>{
      try{
        if(busy)return;
        const prepared=prepare();
        const response=apply({...prepared,replacePages:document.querySelector('[name="scanMode"]:checked').value==='pages'});
        if(!response?.ok)throw Error(response?.error||'수집 기록을 저장하지 못했어요.');
        $('scanDialog').close();
      }catch(error){$('scanApplyMessage').textContent=error.message;}
    });
    $('scanOpen').addEventListener('click',()=>{if(!$('scanDialog').open)$('scanDialog').showModal();});
    $('scanClose').addEventListener('click',()=>$('scanDialog').close());
    $('scanDialog').addEventListener('close',()=>{runVersion++;previewVersion++;busy=false;pasteNumber=0;dragStart=null;bitmap?.close();bitmap=null;entries=[];canvas.width=canvas.height=0;$('scanWorkspace').hidden=true;$('scanApplyPanel').hidden=true;$('scanFiles').disabled=false;status('① 캡처 선택·붙여넣기 → ② 카드 영역 지정 → ③ 인식·검토 → ④ 저장');});
  }
})();
