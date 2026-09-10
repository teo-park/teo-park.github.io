// Compact explanations reuse the guide's reviewed mechanics and official icon/level data.
const skills=require('./content.cjs'),official=require('./official.json');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const individual={
  '숙련 낚시꾼':['월척 낚시꾼 5중첩 · 145초','기존 생미끼 프록을 유지한 채 사용할 수 있습니다. 효과 중 새로 낚은 물고기는 보통 크기여도 생미끼 낚시·낚시꾼의 묘안에 쓸 수 있습니다.','생미끼가 가능한 어종에 적용됩니다. 사용 전에 잡은 보통 크기 물고기를 소급해 생미끼로 만들거나, 현재 프록의 제한 시간을 늘리지는 않습니다.'],
  '중단':['GP 0','낚시 자체를 끝냅니다. 원하지 않는 입질만 넘길 때는 낚싯대 거두기를 사용하세요.','현재 낚시를 이어가는 기술과 구분하세요.'],
  '생미끼 낚시':['GP 0','방금 낚은 월척 물고기를 다음 낚시의 미끼로 사용합니다. 생미끼로 쓸 수 있는 어종이어야 합니다.'],
  '생미끼 낚시 2':['GP 100 · 재사용 180초','방금 낚은 보통 크기 물고기를 생미끼로 사용합니다. 어획 후 15초 안에 사용하며, 생미끼가 가능한 어종이어야 합니다.'],
  '인내':['GP 200 · 60초','월척 확률을 50% 높이는 대신 낚아채기 성공률이 40% 감소합니다. 어종에 맞는 섬세한·강력한 낚아채기로 성공률 감소를 상쇄합니다.'],
  '인내 2':['GP 560 · 145초','월척 확률을 80% 높이는 대신 낚아채기 성공률이 75% 감소합니다. 어종에 맞는 섬세한·강력한 낚아채기로 성공률 감소를 상쇄합니다.'],
  '섬세한 낚아채기':['GP 50','인내 효과 중 소형 물고기를 낚을 때 성공률 감소를 상쇄합니다. !!! 입질 중에도 섬세한 낚아채기 대상이 있습니다.','입질 느낌표만으로 정하지 말고, 어종별 낚아채기를 확인하세요.'],
  '강력한 낚아채기':['GP 50','인내 효과 중 대형 물고기를 낚을 때 성공률 감소를 상쇄합니다. !!! 입질 중에도 강력한 낚아채기 대상이 있습니다.','입질 느낌표만으로 정하지 말고, 어종별 낚아채기를 확인하세요.'],
  '이중 낚아채기':['GP 400','한 번의 입질에 2마리 이상을 낚습니다. 실제 수량은 어종과 획득력에 따라 달라집니다.'],
  '삼중 낚아채기':['GP 700','한 번의 입질에 3마리 이상을 낚습니다. 실제 수량은 어종과 획득력에 따라 달라집니다.'],
  '월척 낚시꾼':['특성 · 최대 10중첩','월척을 낚으면 일정 확률로 중첩이 쌓입니다. 숙련 낚시꾼과 살리아크의 은총이 함께 사용하는 자원입니다.','숙련 낚시꾼을 사용할 계획이라면 5중첩을 남겨 두세요.'],
  '살리아크의 은총':['3중첩 → GP 150','월척 낚시꾼 3중첩을 소비해 GP를 150 회복합니다.','숙련 낚시꾼에 필요한 5중첩과 함께 배분하세요.'],
  '소박한 루어':['GP 10 → 20 → 30','소형·섬세한 낚아채기 계열 물고기를 유인하며, 사용할 때마다 입질할 어류를 재추첨합니다. !!!도 섬세한 계열이면 이쪽을 검토합니다.','관측상 사용 후 약 5초 동안 입질이 억제되어 지난 입질 구간의 어류도 다시 나올 수 있습니다. 출현 시간·직감이 끝난 뒤 사용하면 마지막 기회를 잃을 수 있어요.'],
  '거대한 루어':['GP 10 → 20 → 30','대형·강력한 낚아채기 계열 물고기를 유인하며, 사용할 때마다 입질할 어류를 재추첨합니다. !!!만 보고 결정하지 말고 낚아채기 계열을 확인하세요.','관측상 사용 후 약 5초 동안 입질이 억제되어 지난 입질 구간의 어류도 다시 나올 수 있습니다. 출현 시간·직감이 끝난 뒤 사용하면 마지막 기회를 잃을 수 있어요.'],
  '갈고리 낚시':['GP 0 · 켜기/끄기','특정 어종을 낚기 위해 필요한 효과입니다. 목표의 갈고리 낚시 필요 여부를 먼저 확인하세요.','모든 물고기에 필요한 효과는 아닙니다.'],
  '물고기의 눈':['GP 550 · 60초','일부 어종의 시간 조건을 무시합니다. 날씨·직감·생미끼 등 다른 조건은 따로 충족해야 합니다.'],
};
const entries=official.map(o=>{
  const guide=skills.find(s=>s.skills.includes(o.name));
  if(!guide)throw Error('Missing skill explanation: '+o.name);
  const override=individual[o.name];
  return {...o,id:guide.id,meta:override?.[0]||guide.meta,summary:override?.[1]||guide.lead,note:override?.[2]||guide.note};
});
const byName=new Map(entries.map(s=>[s.name,s]));
const aliases=new Map(entries.map(s=>[s.name,s.name]));
aliases.set('교방','교환 방생');aliases.set('묘안','낚시꾼의 묘안');
const pattern=new RegExp([...aliases.keys()].sort((a,b)=>b.length-a.length).join('|'),'g');
function create(base='./'){
  function term(name,label=name){
    const s=byName.get(name);if(!s)throw Error('Unknown skill: '+name);
    return `<a class="skill-term" data-skill-name="${esc(name)}" href="${base}#${s.id}"><img src="${esc(s.icon)}" alt="" width="16" height="16" loading="lazy">${esc(label)}</a>`;
  }
  function rich(text){
    text=String(text).replaceAll('섬세한·강력한 낚아채기','섬세한 낚아채기·강력한 낚아채기').replaceAll('이중·삼중 낚아채기','이중 낚아채기·삼중 낚아채기');
    let last=0,out='';
    for(const match of text.matchAll(pattern)){out+=esc(text.slice(last,match.index))+term(aliases.get(match[0]),match[0]);last=match.index+match[0].length;}
    return out+esc(text.slice(last));
  }
  function markup(){return `<script type="application/json" id="skillTipData">${JSON.stringify(entries).replace(/</g,'\\u003c')}</script><aside id="skillTip" class="skill-tip" role="dialog" aria-modal="false" aria-labelledby="skillTipName" hidden><button type="button" class="skill-tip-close" aria-label="스킬 설명 닫기">×</button><div class="skill-tip-heading"><img id="skillTipIcon" alt="" width="28" height="28"><div><strong id="skillTipName"></strong><p id="skillTipMeta"></p></div></div><p id="skillTipSummary"></p><p id="skillTipNote" class="skill-tip-note"></p><div class="skill-tip-links"><a id="skillTipGuide" href="${base}">사용법 자세히 보기 ↗</a><a id="skillTipOfficial" href="https://guide.ff14.co.kr/job/Fisher/31?type=L" target="_blank" rel="noopener noreferrer">공식 설명 ↗</a></div></aside>`;}
  return {term,rich,markup};
}
module.exports={create,entries};
