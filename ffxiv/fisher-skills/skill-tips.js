(() => {
  'use strict';
  const data=document.getElementById('skillTipData'),panel=document.getElementById('skillTip');
  if(!data||!panel)return;
  const skills=new Map(JSON.parse(data.textContent).map(s=>[s.name,s]));
  const field=id=>document.getElementById(id),closeButton=panel.querySelector('button');
  let active=null,pinned=false,leaveTimer=0,suppressFocus=false;
  function clearLeave(){clearTimeout(leaveTimer);}
  function position(){
    if(!active||panel.hidden)return;
    const rect=active.getBoundingClientRect(),margin=12,gap=8;
    const width=document.documentElement.clientWidth,height=window.innerHeight;
    panel.style.left=Math.max(margin,Math.min(rect.left,width-panel.offsetWidth-margin))+'px';
    const below=rect.bottom+gap,above=rect.top-panel.offsetHeight-gap;
    panel.style.top=Math.max(margin,below+panel.offsetHeight<=height-margin?below:Math.max(margin,above))+'px';
  }
  function hide(restore=false){
    clearLeave();const previous=active;
    if(previous)previous.setAttribute('aria-expanded','false');
    active=null;pinned=false;panel.hidden=true;
    if(restore&&previous){suppressFocus=true;previous.focus({preventScroll:true});suppressFocus=false;}
  }
  function show(trigger,pin=false){
    const skill=skills.get(trigger.dataset.skillName);if(!skill)return;
    clearLeave();
    if(active!==trigger){if(active)active.setAttribute('aria-expanded','false');pinned=false;}
    active=trigger;pinned=pinned||pin;
    field('skillTipIcon').src=skill.icon;field('skillTipName').textContent=skill.name;
    field('skillTipMeta').textContent=`Lv.${skill.level} · ${skill.meta}`;
    field('skillTipSummary').textContent=skill.summary;field('skillTipNote').textContent=skill.note;
    field('skillTipGuide').href=trigger.href;
    field('skillTipOfficial').href=`https://guide.ff14.co.kr/job/Fisher/31?type=L#${skill.anchor}`;
    panel.hidden=false;trigger.setAttribute('aria-expanded','true');position();
  }
  function leave(){clearLeave();if(!pinned)leaveTimer=setTimeout(()=>{if(!panel.contains(document.activeElement))hide();},180);}
  for(const term of document.querySelectorAll('.skill-term')){
    term.setAttribute('aria-haspopup','dialog');term.setAttribute('aria-controls','skillTip');term.setAttribute('aria-expanded','false');
    term.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'&&!pinned)show(term);});
    term.addEventListener('pointerleave',leave);
    term.addEventListener('focus',()=>{if(!suppressFocus&&!pinned)show(term);});
    term.addEventListener('blur',e=>{if(!panel.contains(e.relatedTarget)&&!pinned)hide();});
    term.addEventListener('click',e=>{
      if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
      e.preventDefault();
      if(active===term&&pinned){hide();return;}
      show(term,true);if(e.detail===0)closeButton.focus();
    });
    term.addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();term.click();}});
  }
  panel.addEventListener('pointerenter',clearLeave);panel.addEventListener('pointerleave',leave);
  panel.addEventListener('focusout',e=>{if(!panel.contains(e.relatedTarget)&&e.relatedTarget!==active)hide();});
  closeButton.addEventListener('click',()=>hide(true));
  document.addEventListener('pointerdown',e=>{if(active&&!panel.contains(e.target)&&!active.contains(e.target))hide();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();hide(panel.contains(document.activeElement));}});
  document.addEventListener('scroll',e=>{if(!panel.contains(e.target))hide();},true);
  window.addEventListener('resize',()=>hide());
})();
