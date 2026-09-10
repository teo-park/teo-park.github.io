(function(){
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const jobs={8:'목수',9:'대장장이',10:'갑주제작사',11:'보석공예가',12:'가죽공예가',13:'재봉사',14:'연금술사',15:'요리사'};
  let mounted=false;
  function mount({model}){
    if(mounted)return;mounted=true;
    const data=window.FISHING_BAITS||{baits:{},vendors:{}};
    const dialog=document.createElement('dialog');dialog.id='baitDialog';dialog.className='bait-dialog';dialog.setAttribute('aria-labelledby','baitTitle');
    dialog.innerHTML='<div class="dialog-top"><span>미끼 정보</span><button type="button" data-bait-close aria-label="미끼 정보 닫기">닫기 ×</button></div><div class="bait-detail-body"></div>';
    document.body.append(dialog);const body=dialog.querySelector('.bait-detail-body');let opener;
    const link=(url,text)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(text)} ↗</a>`;
    function show(id,trigger){
      const bait=model.byId.get(id);if(!bait||bait.fish)return;
      const record=data.baits[id]||{offers:[],recipes:[]};opener=trigger;
      const groups=new Map();
      for(const offer of record.offers){const key=JSON.stringify([offer.quantity,offer.costs]);if(!groups.has(key))groups.set(key,{...offer,vendors:new Set()});groups.get(key).vendors.add(offer.npc);}
      const shopHtml=[...groups.values()].sort((a,b)=>Number(b.costs.every(c=>c.id===1))-Number(a.costs.every(c=>c.id===1))).map(group=>{
        const cost=group.costs.map(c=>c.id===1?`${c.amount.toLocaleString()}길`:`${esc(c.name)} ×${c.amount.toLocaleString()}`).join(' + ');
        const vendors=[...group.vendors].map(id=>({id,...data.vendors[id]})).sort((a,b)=>a.area.localeCompare(b.area,'ko')||a.name.localeCompare(b.name,'ko'));
        const row=v=>`<li><div>${link(`https://ffxivteamcraft.com/db/ko/npc/${v.id}`,v.name)}<span>${esc(v.area)}</span></div><span>${Number.isFinite(v.x)?`X:${v.x.toFixed(1)} · Y:${v.y.toFixed(1)}`:'위치 확인 필요'}</span></li>`;
        return `<section class="bait-offer"><h3>${cost}<small>미끼 ${group.quantity}개 기준</small></h3><ul>${vendors.slice(0,5).map(row).join('')}</ul>${vendors.length>5?`<details><summary>다른 판매처 ${vendors.length-5}곳</summary><ul>${vendors.slice(5).map(row).join('')}</ul></details>`:''}</section>`;
      }).join('');
      body.innerHTML=`<div class="bait-heading"><img src="${esc(bait.icon)}" width="80" height="80" alt="${esc(bait.name)} 아이콘"><div><h2 id="baitTitle">${esc(bait.name)}</h2><p>${esc(bait.original)}</p>${link(`https://ffxivteamcraft.com/db/ko/item/${id}`,'Teamcraft 아이템 정보')}</div></div><h3 class="bait-section-title">구매·교환처</h3>${shopHtml||'<p class="bait-empty">연결된 NPC 판매처 자료가 없습니다.</p>'}${record.recipes.length?`<section class="bait-craft"><h3>직접 제작</h3>${record.recipes.map(r=>`<p>${link(`https://ffxivteamcraft.com/db/ko/recipe/${r.id}`,`${jobs[r.job]||'제작'} Lv.${r.level} · ${r.quantity}개 제작`)}</p>`).join('')}</section>`:''}<p class="bait-source-note">Teamcraft 공개 상점·제작 자료 기준입니다. 상점 개방, 우호도 및 교환 화폐 조건에 따라 이용 가능 여부가 달라질 수 있습니다. 한국 서버의 실제 판매 목록은 게임에서 확인해 주세요.</p>`;
      if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
    }
    document.addEventListener('click',e=>{const trigger=e.target.closest('[data-bait-detail]');if(trigger){e.preventDefault();show(+trigger.dataset.baitDetail,trigger);}});
    dialog.querySelector('[data-bait-close]').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
    dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus({preventScroll:true});});
  }
  window.FishingBaitDetails={mount};
})();
