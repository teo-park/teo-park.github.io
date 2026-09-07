/* Icon matching runs locally. Screenshot positions never imply missing minions. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MinionScanner=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const SIZE=16;
  function pixels(image,cx,cy,w,h){
    const out=new Uint8Array(SIZE*SIZE*3);
    for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){
      const px=Math.max(0,Math.min(image.width-1,cx+((x+.5)/SIZE-.5)*w)),py=Math.max(0,Math.min(image.height-1,cy+((y+.5)/SIZE-.5)*h));
      const x0=Math.floor(px),y0=Math.floor(py),x1=Math.min(x0+1,image.width-1),y1=Math.min(y0+1,image.height-1),dx=px-x0,dy=py-y0;
      for(let c=0;c<3;c++)out[(y*SIZE+x)*3+c]=Math.round(image.data[(y0*image.width+x0)*4+c]*(1-dx)*(1-dy)+image.data[(y0*image.width+x1)*4+c]*dx*(1-dy)+image.data[(y1*image.width+x0)*4+c]*(1-dx)*dy+image.data[(y1*image.width+x1)*4+c]*dx*dy);
    }return out;
  }
  function normalize(values){
    const mean=values.reduce((a,b)=>a+b,0)/values.length,out=new Float32Array(values.length);let norm=0;
    for(let i=0;i<values.length;i++){out[i]=values[i]-mean;norm+=out[i]*out[i];}
    norm=Math.sqrt(norm);for(let i=0;i<out.length;i++)out[i]/=norm||1;
    return {vector:out,texture:norm/Math.sqrt(values.length)};
  }
  function similarity(a,b){let dot=0;for(let i=0;i<a.length;i++)dot+=a[i]*b[i];return dot;}
  function references(data){
    if(data?.size!==SIZE||!Array.isArray(data.icons))throw Error('아이콘 비교 자료가 올바르지 않아요.');
    return data.icons.map(([id,encoded])=>{const raw=typeof Buffer!=='undefined'?Uint8Array.from(Buffer.from(encoded,'base64')):Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));if(raw.length!==SIZE*SIZE*3)throw Error('아이콘 비교 자료가 손상됐어요.');return {id,...normalize(raw)};});
  }
  function validateRect(rect,width,height){
    if(!rect||![rect.x,rect.y,rect.w,rect.h].every(Number.isFinite)||rect.x<0||rect.y<0||rect.w<=0||rect.h<=0||rect.x+rect.w>1.001||rect.y+rect.h>1.001)return '아이콘 영역이 이미지 안에 들어오도록 지정해 주세요.';
    const w=rect.w*width/5,h=rect.h*height/6;
    if(w<20||h<20)return '아이콘 한 칸이 20픽셀 이상인 캡처를 사용해 주세요.';
    if(w/h<.75||w/h>1.3)return '5열 × 6행 아이콘 칸만 지정해 주세요. 위쪽 페이지 번호는 제외해요.';
    return '';
  }
  function defaultCrop(width,height){
    const ratio=width/height;
    if(ratio>=.81&&ratio<=.87)return {x:0,y:0,w:1,h:1};
    if(ratio>=.68&&ratio<.81){const w=.924,h=w*width*6/5/height;return {x:.034,y:Math.min(.124,1-h),w,h};}
    const h=Math.min(height*.8,width*.9*6/5),w=h*5/6;
    return {x:(1-w/width)/2,y:(1-h/height)/2,w:w/width,h:h/height};
  }
  function matchCell(image,rect,index,refs){
    const w=rect.w*image.width/5,h=rect.h*image.height/6,cx=(rect.x+(index%5+.5)*rect.w/5)*image.width,cy=(rect.y+(Math.floor(index/5)+.5)*rect.h/6)*image.height;
    const variants=[.66,.72,.78,.84].map(scale=>normalize(pixels(image,cx,cy,w*scale,h*scale)));
    const candidates=refs.map(ref=>({id:ref.id,score:Math.max(...variants.map(v=>similarity(v.vector,ref.vector))),ref})).sort((a,b)=>b.score-a.score).slice(0,8);
    for(const scale of [.66,.72,.78,.84])for(const dx of [-.035,0,.035])for(const dy of [-.035,0,.035]){
      const v=normalize(pixels(image,cx+dx*w,cy+dy*h,w*scale,h*scale));
      for(const candidate of candidates)candidate.score=Math.max(candidate.score,similarity(v.vector,candidate.ref.vector));
    }
    candidates.sort((a,b)=>b.score-a.score);
    const best=candidates[0],gap=best.score-(candidates[1]?.score??0);
    return {index,id:best.id,state:(best.score>=.78&&gap>=.055)||(best.score>=.72&&gap>=.12)?'match':'review',score:best.score,candidates:candidates.map(({id,score})=>({id,score}))};
  }
  function applyOrder(results,minions,rescore=null){
    const ordered=[...minions].sort((a,b)=>a.order-b.order||a.id-b.id),order=new Map(ordered.map((m,i)=>[m.id,i]));
    // Confident picture matches are anchors. Never move an anchor to force a sequence.
    const anchors=results.filter(r=>r.state==='match');
    for(let i=1;i<anchors.length;i++)if(order.get(anchors[i].id)<=order.get(anchors[i-1].id)){
      anchors[i].state=anchors[i-1].state='review';anchors[i].orderConflict=anchors[i-1].orderConflict=true;
    }
    for(const r of results){
      if(r.state==='match'||r.orderConflict)continue;
      const before=results.slice(0,r.index).filter(a=>a.state==='match').at(-1),after=results.slice(r.index+1).find(a=>a.state==='match');
      if(!before&&!after)continue;
      const lower=before?order.get(before.id):-1,upper=after?order.get(after.id):ordered.length;
      // Recheck the complete bounded catalog: the correct icon can miss the global
      // coarse shortlist and only become recognizable when alignment is refined.
      if(before&&after&&rescore&&upper>lower+1){
        const allowed=ordered.slice(lower+1,upper).map(m=>m.id),allowedIds=new Set(allowed);
        const checked=rescore(r.index,allowed).filter(c=>allowedIds.has(c.id)&&Number.isFinite(c.score));
        const merged=new Map(r.candidates.map(c=>[c.id,c]));for(const c of checked)merged.set(c.id,c);
        r.candidates=[...merged.values()].sort((a,b)=>b.score-a.score);
      }
      const choices=r.candidates.filter(c=>order.get(c.id)>lower&&order.get(c.id)<upper);
      if(!choices.length)continue;
      const best=choices[0];
      if(before&&after&&best.score>=.68&&(!choices[1]||best.score-choices[1].score>=.07)){
        r.id=best.id;r.score=best.score;r.state='match';r.usedOrder=true;r.orderContext={before:before.id,after:after.id};
      }
    }
    const used=new Map();for(const r of results){if(used.has(r.id)){r.state='review';used.get(r.id).state='review';}else used.set(r.id,r);}
    return results;
  }
  async function analyze(image,rect,refs,{count=30,minions=[],useOrder=true,onProgress=()=>{},cancelled=()=>false}={}){
    if(!image||image.data?.length!==image.width*image.height*4)throw Error('이미지 픽셀을 읽을 수 없어요.');
    const error=validateRect(rect,image.width,image.height);if(error)throw Error(error);
    if(!Number.isInteger(count)||count<1||count>30||refs.length<2)throw Error('인식할 칸 수 또는 비교 자료가 올바르지 않아요.');
    const results=[];
    for(let index=0;index<count;index++){
      if(cancelled())throw Error('인식을 취소했어요.');
      results.push(matchCell(image,rect,index,refs));onProgress(index+1,count);
      await new Promise(resolve=>setTimeout(resolve,0));
    }
    if(cancelled())throw Error('인식을 취소했어요.');
    if(!useOrder)return results;
    const byId=new Map(refs.map(ref=>[ref.id,ref]));
    return applyOrder(results,minions,(index,ids)=>{
      const subset=ids.map(id=>byId.get(id)).filter(Boolean);
      return subset.length?matchCell(image,rect,index,subset).candidates:[];
    });
  }
  function prepareImport(entries,minions){
    const valid=new Set(minions.map(m=>m.id)),ids=new Set();
    if(!entries.length)throw Error('캡처를 먼저 추가해 주세요.');
    for(const entry of entries){
      if(!entry.results?.length||!entry.reviewed)throw Error('모든 캡처의 인식 결과를 확인해 주세요.');
      for(const result of entry.results){
        if(result.state==='skip')continue;
        if(result.state!=='match'||!valid.has(result.id))throw Error('확인 필요 칸을 수정하거나 제외해 주세요.');
        ids.add(result.id);
      }
    }
    if(!ids.size)throw Error('추가할 꼬마친구가 없어요.');
    return [...ids];
  }
  return {SIZE,pixels,normalize,similarity,references,validateRect,defaultCrop,matchCell,applyOrder,analyze,prepareImport};
});
