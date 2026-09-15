(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CounterAdminModel=factory();})(typeof window==='object'?window:null,function(){
  const ownerEmail='teo.ffxiv.kr@gmail.com';
  function allowed(user){return !!user&&user.email===ownerEmail&&user.emailVerified===true&&user.providerData?.some(p=>p.providerId==='google.com');}
  function summarize(pages,baseline,visits){
    const rows=pages.map(page=>{
      const previous=Number.isSafeInteger(baseline?.[page.key])&&baseline[page.key]>=0?baseline[page.key]:0;
      const added=Object.values(visits?.[page.key]||{}).filter(value=>value===true).length;
      return {...page,count:previous+added};
    }).sort((a,b)=>b.count-a.count);
    return {rows,total:rows.reduce((sum,row)=>sum+row.count,0)};
  }
  function selections(catalog,data){
    const rows=[];
    for(const [kind,group] of Object.entries(catalog?.groups||{}))for(const [id,events] of Object.entries(data?.[kind]||{})){
      if(!Object.hasOwn(group.names,id))continue;
      const count=Object.values(events||{}).filter(value=>value===true).length;
      if(count)rows.push({kind,id,name:group.names[id],label:group.label,count});
    }
    rows.sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,'ko'));
    return {rows,total:rows.reduce((sum,row)=>sum+row.count,0)};
  }
  return {ownerEmail,allowed,summarize,selections};
});
