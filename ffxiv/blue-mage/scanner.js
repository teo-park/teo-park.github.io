/* Local 4 × 4 spellbook recognition. Left-side active-action checkboxes are
   outside the sampled icon core. Only a generic question-mark signature is stored. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BlueMageScanner=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const SIZE=16;
  const QUESTION=[59,60,60,60,60,61,62,62,62,61,60,60,60,60,59,59,59,60,60,62,68,72,75,76,76,74,70,65,60,60,59,59,59,59,62,74,79,77,75,74,75,77,79,78,68,60,59,59,59,59,70,78,69,62,61,60,60,61,65,75,77,63,59,59,58,60,74,75,63,60,58,58,58,58,58,66,78,66,58,58,57,59,73,77,76,69,58,57,57,57,57,66,77,65,57,57,57,57,63,74,77,69,57,57,57,58,64,74,75,61,57,57,56,56,56,58,60,58,56,61,67,72,76,74,64,56,56,56,55,55,55,55,55,55,63,74,75,71,66,59,56,55,55,55,55,55,55,55,55,55,69,74,62,56,55,55,55,55,55,55,54,54,54,54,54,54,63,73,63,54,54,54,54,54,54,54,53,53,53,53,53,53,54,60,56,53,53,53,53,53,53,53,53,53,53,53,53,53,54,57,55,53,53,53,53,53,53,53,52,52,52,52,52,52,59,70,66,54,52,52,52,52,52,52,52,52,52,52,52,52,59,71,66,53,52,52,52,52,52,51,51,51,52,52,52,52,53,59,56,52,52,52,52,52,51,51];
  function normalized(values){const mean=values.reduce((a,b)=>a+b,0)/values.length,centered=values.map(n=>n-mean),norm=Math.sqrt(centered.reduce((a,n)=>a+n*n,0));return {vector:centered.map(n=>n/(norm||1)),texture:norm/Math.sqrt(values.length)};}
  const reference=normalized(QUESTION);
  function sample(image,cx,cy,side){
    const values=[],colors=[];
    for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){
      const px=Math.max(0,Math.min(image.width-1,cx+((x+.5)/SIZE-.5)*side)),py=Math.max(0,Math.min(image.height-1,cy+((y+.5)/SIZE-.5)*side)),x0=Math.floor(px),y0=Math.floor(py),x1=Math.min(image.width-1,x0+1),y1=Math.min(image.height-1,y0+1),dx=px-x0,dy=py-y0;
      const rgb=[0,1,2].map(c=>image.data[(y0*image.width+x0)*4+c]*(1-dx)*(1-dy)+image.data[(y0*image.width+x1)*4+c]*dx*(1-dy)+image.data[(y1*image.width+x0)*4+c]*(1-dx)*dy+image.data[(y1*image.width+x1)*4+c]*dx*dy);
      values.push(rgb[0]*.299+rgb[1]*.587+rgb[2]*.114);colors.push(Math.max(...rgb)-Math.min(...rgb));
    }
    const feature=normalized(values);return {...feature,chroma:colors.reduce((a,b)=>a+b,0)/colors.length,score:feature.vector.reduce((n,v,i)=>n+v*reference.vector[i],0)};
  }
  function defaultCrop(width,height){
    if(width/height>=1.035&&width/height<=1.3)return {x:0,y:0,w:1,h:1};
    const w=.948,h=Math.min(.85,w*width*8/9/height);return {x:.052,y:Math.min(.085,1-h),w,h};
  }
  function detectPage(image,rect,pageCount=8){
    // The game shows all eight numbered tabs in order. Require a complete,
    // evenly spaced row and one gold selection frame; never guess from icons.
    if(!image||image.data?.length!==image.width*image.height*4||!Number.isInteger(pageCount)||pageCount<2||pageCount>8)return null;
    rect||=defaultCrop(image.width,image.height);
    const scale=image.width/304,top=Math.floor(Math.min(rect?.y*image.height||0,image.height*.15)),right=Math.floor(image.width*.8);
    if(top<8*scale||right<40)return null;
    const luminances=[];for(let y=0;y<top;y++)for(let x=0;x<right;x++){const i=(y*image.width+x)*4;luminances.push(image.data[i]*.299+image.data[i+1]*.587+image.data[i+2]*.114);}
    luminances.sort((a,b)=>a-b);const threshold=Math.max(45,luminances[Math.floor(luminances.length*.98)]*.7),columns=Array.from({length:right},()=>[]);
    const gold=[];
    for(let y=0;y<top;y++)for(let x=0;x<right;x++){
      const i=(y*image.width+x)*4,r=image.data[i],g=image.data[i+1],b=image.data[i+2],hi=Math.max(r,g,b),lo=Math.min(r,g,b),luma=r*.299+g*.587+b*.114;
      if(luma>threshold&&hi-lo<hi*.28)columns[x].push(y);
      if(r>65&&r-g>Math.max(7,g*.07)&&g-b>Math.max(12,g*.13))gold.push({x,y});
    }
    const groups=[];let current=null;const gap=Math.max(1,Math.round(scale*.7));
    for(let x=0;x<right;x++)if(columns[x].length){if(!current||x-current.right>gap+1){current={left:x,right:x,ys:[]};groups.push(current);}current.right=x;current.ys.push(...columns[x]);}
    const digits=groups.filter(g=>g.ys.length>=5*scale*scale&&g.right-g.left+1>=2*scale&&g.right-g.left+1<=16*scale).map(g=>({...g,cx:(g.left+g.right)/2,top:Math.min(...g.ys),bottom:Math.max(...g.ys)}));
    if(digits.length!==pageCount)return null;
    const steps=digits.slice(1).map((g,i)=>g.cx-digits[i].cx),step=[...steps].sort((a,b)=>a-b)[Math.floor(steps.length/2)];
    if(step<17*scale||step>35*scale||steps.some(d=>Math.abs(d-step)>step*.2))return null;
    const baseline=digits.map(d=>(d.top+d.bottom)/2).sort((a,b)=>a-b)[Math.floor(pageCount/2)];
    if(digits.some(d=>d.bottom-d.top+1<4*scale||d.bottom-d.top+1>15*scale||Math.abs((d.top+d.bottom)/2-baseline)>3*scale))return null;
    const candidates=digits.map((d,index)=>{
      const points=gold.filter(p=>Math.abs(p.x-d.cx)<step*.49&&p.y>=d.top-7*scale&&p.y<=d.bottom+6*scale);
      const left=points.filter(p=>p.x<d.cx-step*.25).length,right=points.filter(p=>p.x>d.cx+step*.25).length,above=points.filter(p=>p.y<d.top).length;
      const framed=points.length>=18*scale*scale&&left>=2*scale*scale&&right>=2*scale*scale&&above>=3*scale*scale;
      return {page:index+1,score:points.length/(scale*scale),framed};
    });
    const selected=candidates.filter(c=>c.framed);if(selected.length!==1)return null;
    const best=selected[0],other=Math.max(0,...candidates.filter(c=>c!==best).map(c=>c.score));
    return best.score>=other*2.5?{page:best.page,method:'selected-tab'}:null;
  }
  function validateRect(rect,width,height){
    if(!rect||![rect.x,rect.y,rect.w,rect.h].every(Number.isFinite)||rect.x<0||rect.y<0||rect.w<=0||rect.h<=0||rect.x+rect.w>1.001||rect.y+rect.h>1.001)return '아이콘 영역이 이미지 안에 들어오도록 지정해 주세요.';
    const w=rect.w*width/4,h=rect.h*height/4;if(Math.min(w,h)<24)return '한 칸이 24픽셀 이상인 캡처를 사용해 주세요.';
    if(w/h<.8||w/h>1.4)return '페이지 번호와 아래 합계를 제외한 4열 × 4행 영역을 지정해 주세요.';
    return '';
  }
  function classifyCell(image,rect,index){
    const w=rect.w*image.width/4,h=rect.h*image.height/4,side=Math.min(w,h),cx=rect.x*image.width+(index%4+.5)*w,cy=rect.y*image.height+(Math.floor(index/4)+.5)*h;
    let best={score:-1},fit;
    for(const scale of [.42,.48,.54,.60])for(const dx of [-.045,0,.045])for(const dy of [-.08,-.04,0,.04,.08]){const candidate=sample(image,cx+dx*w,cy+dy*h,side*scale);if(candidate.score>best.score){best=candidate;fit={cx:cx+dx*w,cy:cy+dy*h,side:side*scale};}}
    if(best.score>.55)for(const dx of [-.022,0,.022])for(const dy of [-.02,0,.02])for(const scale of [.95,1,1.05]){const candidate=sample(image,fit.cx+dx*w,fit.cy+dy*h,fit.side*scale);if(candidate.score>best.score)best=candidate;}
    const core=sample(image,cx,cy,side*.5);
    const state=best.score>=.83&&best.texture>=3&&best.chroma<20&&core.chroma<20?'missing':core.chroma>=25&&core.texture>=18||best.score<.65&&core.texture>=25?'learned':'review';
    return {index,state,score:best.score,texture:core.texture,chroma:core.chroma};
  }
  async function analyze(image,rect,{count=16,cancelled=()=>false}={}){
    if(!image||image.data?.length!==image.width*image.height*4)throw Error('이미지 픽셀을 읽을 수 없어요.');
    const error=validateRect(rect,image.width,image.height);if(error)throw Error(error);
    if(!Number.isInteger(count)||count<1||count>16)throw Error('페이지의 칸 수가 올바르지 않아요.');
    const results=[];for(let i=0;i<count;i++){if(cancelled())throw Error('인식을 취소했어요.');results.push(classifyCell(image,rect,i));if(i%4===3)await new Promise(r=>setTimeout(r,0));}if(cancelled())throw Error('인식을 취소했어요.');return results;
  }
  function pagesFor(spells){return Array.from({length:Math.ceil(spells.length/16)},(_,i)=>({number:i+1,spells:spells.filter(s=>s.id>i*16&&s.id<=(i+1)*16)}));}
  function prepareImport(entries,spells){
    if(!entries.length)throw Error('캡처를 먼저 추가해 주세요.');const pages=pagesFor(spells),seen=new Set(),ids=new Set();
    for(const e of entries){const p=pages.find(p=>p.number===e.page);if(!p)throw Error('각 캡처의 게임 페이지 번호를 선택해 주세요.');if(seen.has(e.page))throw Error(`${e.page}페이지 캡처가 중복되어 있어요.`);seen.add(e.page);
      if(!e.reviewed||!e.results||e.results.length!==p.spells.length||e.results.some(r=>!['learned','missing'].includes(r.state)))throw Error('각 캡처의 번호와 습득 상태를 확인해 주세요.');
      p.spells.forEach((s,i)=>{if(e.results[i].state==='learned')ids.add(s.id);});
    }
    if(!ids.size)throw Error('추가할 습득 기록이 없어요.');return [...ids];
  }
  return {SIZE,sample,defaultCrop,detectPage,validateRect,classifyCell,analyze,pagesFor,prepareImport};
});
