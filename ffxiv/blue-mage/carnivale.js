/* Guide preparation is separate from a learned-only combat loadout. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./engine.js'):root.BlueMageBook);if(typeof module==='object'&&module.exports)module.exports=api;else root.BlueMageCarnivale=api;})(typeof globalThis==='object'?globalThis:this,function(E){
  'use strict';
  function preparation(stage,learned){
    const groups=stage.required.map(g=>({...g,ready:g.alternatives.some(ids=>ids.every(id=>learned.has(id)))}));
    return {groups,total:groups.length,ready:groups.filter(g=>g.ready).length,complete:groups.every(g=>g.ready)};
  }
  function matches(stage,query,spells=[]){
    const q=E.normalize(query);if(!q)return true;
    if(/^(?:no)?\d+(?:시합)?$/.test(q))return stage.id===+q.replace(/^no/,'').replace(/시합$/,'');
    const used=new Set([...stage.required.flatMap(g=>g.alternatives.flat()),...stage.recommended,...stage.phases.flatMap(p=>p.steps.flatMap(s=>s.spells)),...(stage.achievement?.spells||[])]);
    const text=[stage.name,stage.summary,...stage.tags,...stage.required.map(g=>g.label),...stage.phases.flatMap(p=>p.steps.map(s=>s.trigger)),...spells.filter(s=>used.has(s.id)).map(s=>s.name)].join(' ');
    return E.normalize(text).includes(q)||E.normalize(E.initials(text)).includes(q);
  }
  function filter(stages,learned,{query='',kind='all'}={},spells=[]){
    return stages.filter(s=>matches(s,query,spells)&&(kind!=='achievement'||!!s.achievement)&&(kind!=='missing'||!preparation(s,learned).complete));
  }
  return {preparation,matches,filter};
});
