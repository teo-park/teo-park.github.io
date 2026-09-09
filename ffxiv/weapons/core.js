export const FORMAT='teo-ffxiv-weapons';
export const STORAGE_KEY='teo-ffxiv.weapons.collection.v1';
export const emptyRecord=()=>({itemId:0,target:false,note:''});
export const emptyBackup=()=>({format:FORMAT,version:1,records:{}});
export function stageIndex(track,record){return record?.itemId?track.items.findIndex(i=>i.id===record.itemId)+1:0;}
export function statusOf(track,record){const n=stageIndex(track,record);return n===track.items.length?'complete':n>0?'progress':'unstarted';}
export function summarize(tracks,records){return tracks.reduce((a,t)=>{a.total++;a[statusOf(t,records[t.id])]++;if(records[t.id]?.target)a.targets++;return a;},{total:0,complete:0,progress:0,unstarted:0,targets:0});}
export function parseBackup(input,catalog){
 const data=typeof input==='string'?JSON.parse(input):input;
 if(!data||data.format!==FORMAT||data.version!==1||!data.records||typeof data.records!=='object'||Array.isArray(data.records))throw Error('무기 수첩에서 내보낸 백업 파일을 선택해 주세요.');
 if(Object.keys(data.records).length>10000)throw Error('백업 항목이 너무 많습니다.');
 const tracks=new Map(catalog.tracks.map(t=>[t.id,t])),records={};
 for(const [id,r] of Object.entries(data.records)){
  if(!/^[a-z0-9-]+\.[A-Z]{3}\.(weapon|shield)$/.test(id)||!r||typeof r!=='object'||Array.isArray(r)||!Number.isSafeInteger(r.itemId)||r.itemId<0||typeof r.target!=='boolean'||typeof r.note!=='string'||r.note.length>500)throw Error('백업의 수집 기록 형식이 올바르지 않습니다.');
  const t=tracks.get(id);if(t&&r.itemId!==0&&!t.items.some(i=>i.id===r.itemId))throw Error('해당 무기의 단계에 없는 아이템이 포함되어 있습니다.');
  records[id]={itemId:r.itemId,target:r.target,note:r.note};
 }
 return {format:FORMAT,version:1,records};
}
export function mergeBackups(current,incoming,catalog,replace=false){
 if(replace)return structuredClone(incoming);
 const result=structuredClone(current),byId=new Map(catalog.tracks.map(t=>[t.id,t]));
 for(const [id,r] of Object.entries(incoming.records)){
  const old=result.records[id],t=byId.get(id);
  if(!old){result.records[id]={...r};continue;}
  result.records[id]={itemId:t&&stageIndex(t,old)>stageIndex(t,r)?old.itemId:r.itemId,target:old.target||r.target,note:r.note||old.note};
 }
 return result;
}
const initials=s=>[...s].map(c=>{const n=c.charCodeAt(0)-44032;return n>=0&&n<=11171?'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'[Math.floor(n/588)]:c;}).join('');
const normalize=s=>s.toLowerCase().replace(/\s/g,'');
export function matches(track,series,job,query){
 const q=normalize(query);if(!q)return true;
 const text=normalize([series.name,series.short,series.expansion,job.id,job.name,...track.items.flatMap(i=>[i.name,i.englishName,i.stage])].join(' '));
 return text.includes(q)||initials(text).includes(q);
}
export function filterTracks(catalog,records,filters){
 const ss=new Map(catalog.series.map(s=>[s.id,s])),js=new Map(catalog.jobs.map(j=>[j.id,j]));
 return catalog.tracks.filter(t=>(!filters.kind||ss.get(t.seriesId).kind===filters.kind)&&(!filters.series||t.seriesId===filters.series)&&(!filters.job||t.jobId===filters.job)&&(!filters.status||statusOf(t,records[t.id])===filters.status)&&(!filters.target||records[t.id]?.target)&&matches(t,ss.get(t.seriesId),js.get(t.jobId),filters.query||''));
}
