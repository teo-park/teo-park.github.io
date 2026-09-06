(function(root){
  'use strict';
  const CHOSEONG='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  function initials(value){return [...String(value)].map(char=>{
    const code=char.charCodeAt(0)-0xac00;
    return code>=0&&code<11172?CHOSEONG[Math.floor(code/588)]:char;
  }).join('');}
  const normalize=value=>String(value).normalize('NFKC').toLocaleLowerCase('ko').replace(/[\s\p{P}\p{S}]/gu,'');
  // A query character may match either a full syllable or that syllable's initial.
  function position(row,query){
    const a=row.letters,b=[...query];
    for(let i=0;i<=a.length-b.length;i++)if(b.every((char,j)=>char===a[i+j]||char===row.heads[i+j]))return i;
    return -1;
  }
  function createSearch(duties){
    const index=duties.map(duty=>{
      const text=normalize(duty.name),letters=[...text];
      return {duty,text,letters,heads:letters.map(char=>normalize(initials(char))),initials:normalize(initials(duty.name))};
    });
    return (query,category='')=>{
      const terms=String(query).trim().split(/\s+/).map(normalize).filter(Boolean);
      if(!terms.length&&!category)return [];
      return index.filter(row=>!category||row.duty.category===category).map(row=>{
        const locations=terms.map(term=>position(row,term));
        const exact=terms.length===1&&(row.text===terms[0]||row.initials===terms[0]);
        return {...row,locations,rank:exact?-1:locations.reduce((a,b)=>a+b,0)};
      }).filter(row=>row.locations.every(n=>n>=0)).sort((a,b)=>a.rank-b.rank||a.duty.level-b.duty.level||a.duty.name.localeCompare(b.duty.name,'ko')).map(row=>row.duty);
    };
  }
  const api={initials,normalize,createSearch};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.DutySearch=api;
})(typeof window==='undefined'?globalThis:window);
