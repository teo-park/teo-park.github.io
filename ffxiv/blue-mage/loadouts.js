/* Curated recommendations, not a combat simulator. See README for references. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BlueMageLoadouts=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const LIMIT=24;
  const roles={tank:'탱 청마',healer:'힐 청마',dps:'딜 청마'};
  const duties={boss:'토벌전·레이드 보스',dungeon:'파티 던전',solo:'혼자 던전'};
  const cooldowns=[[20,43],[44,45],[46,47],[48,49],[67,92],[79,80],[88,95,100],[89,90,113],[102,104],[60,120],[123,124]];
  const reasons={
    1:'배운 기술로 사용하는 기본 원거리 공격',2:'기본 범위 공격',9:'지속 피해 유지',10:'기본 범위 공격',12:'다음 마법 강화 · 물리 강화 버프와 중첩 불가',
    13:'현재 자신의 HP만큼 파티 회복 · MP와 적개심 주의',17:'MP 보충',20:'파티 공격에 맞춰 받는 피해 증가',24:'시전 방해',28:'대상의 주는 피해 감소',
    29:'큰 피해 대응 · 사용 후 10초 동안 이동·행동 불가',30:'받는 피해 감소·적개심 증가 · 주는 피해도 감소',33:'주변 적 빙결',43:'파티 마법 공격 지원',44:'재사용마다 쓰는 범위 공격',45:'깃털비 대신 사용하는 범위 공격',46:'번개 충격 대신 사용하는 근거리 공격',47:'재사용마다 쓰는 범위 공격',48:'추가 범위 공격',53:'기본 원거리 범위 공격',
    58:'힐러 복사 상태에서 단일 회복',59:'공격이 오기 전에 파티 보호막',60:'MP 회복·지능/정신력 감소',62:'탱커 교대용 도발',63:'짧은 시전의 기본 원거리 공격',64:'다음 물리 마법 강화 · 노발대발과 중첩 불가',
    67:'레벨이 5의 배수인 적 즉사 · 면역·실패 가능',72:'전투 불능 파티원 부활',73:'해제 가능한 약화 효과 제거',75:'최대 HP 증가 · 탱커 복사로 지속 시간 증가',77:'전투 전에 해당 역할의 다른 플레이어를 복사',78:'충전 4회 연속 사용 · 사이에 다른 행동 금지',79:'정의의 발차기 대신 사용하는 범위 공격',80:'돌진 공격 · 강제 이동 주의',81:'물리 버프를 받은 뒤 쓰는 3연타',82:'다음 물리 마법에 추가 위력',85:'힐러 복사 상태에서 범위 회복',88:'힐러 복사 상태에서 범위 회복·지속 회복',89:'정지 상태에서 피해 감소 · 움직이거나 다른 기술을 쓰면 해제',90:'짧은 재사용의 공격 · 밀쳐내기 주의',91:'혼자 다인용 임무에 들어갔을 때 강화',92:'빙결·석화된 적 즉사 · 높은 레벨·면역 적 제외',95:'탱커 복사 상태에서 강화되는 피해 감소',97:'적을 한곳으로 당기는 범위 공격',100:'딜러 복사 상태에서 강화되는 8연타',102:'달빛 저승꽃 대신 사용하는 범위 공격',103:'제자리 연속 공격 · 다른 행동으로 끊지 않기',104:'범위 공격·지속 피해',105:'강력 방어를 켠 상태에서 적 정면 공격',108:'자신의 HP 회복 · 긴 시전 주의',109:'파티에서 한 명만 담당하는 지속 피해',118:'반복 사용해 중첩을 쌓는 물리 공격',120:'MP 회복·힘/민첩성 감소',121:'파티에서 한 명만 담당 · 전투 중 대상에 사용',122:'추가 범위 공격 · 날씨 보너스는 별도',124:'추가 범위 공격',39:'15초 공격 강화 후 15초 행동 불가'
  };
  const core={tank:[77,30,29,13,17],healer:[77,58,13,59],dps:[77]};
  const fillerIds=[63,53,2,10,1];
  // The complete opener is shown only when every required blue spell is equipped.
  // GCD and ability lanes are separate; role action Swiftcast is not a blue-spell slot.
  const opener=[
    {label:'전투 전',gcd:64,abilities:[]},
    {label:'전투 시작',gcd:82,abilities:[]},
    {label:'준비',gcd:90,abilities:[]},
    {label:'강화 시작',gcd:39,abilities:[80]},
    {label:'1',gcd:81,abilities:[104]},
    {label:'2',gcd:118,abilities:[44,122]},
    {label:'3',gcd:118,abilities:[47,124]},
    {label:'4',gcd:12,abilities:['swiftcast',78,78,78,78]},
    {label:'5',gcd:100,abilities:[103]}
  ];
  const openerIds=[...new Set(opener.flatMap(s=>[s.gcd,...s.abilities]).filter(Number.isInteger))];
  function recommend(spells,learned,options={}){
    const duty=Object.hasOwn(duties,options.duty)?options.duty:'boss',role=duty==='solo'?'tank':Object.hasOwn(roles,options.role)?options.role:'dps';
    const known=new Set(spells.map(s=>s.id)),have=new Set([...learned].filter(id=>known.has(id)));
    const selected=[],used=new Set(),wanted=[],skipped=[];
    const clash=id=>cooldowns.some(g=>g.includes(id)&&g.some(n=>used.has(n)&&n!==id));
    function add(ids,group='공격',reason){
      ids=ids.filter(id=>!used.has(id));if(!ids.length)return true;
      if(ids.some(id=>!have.has(id))||ids.some(clash)||selected.length+ids.length>LIMIT)return false;
      for(const id of ids){used.add(id);selected.push({id,group,reason:reason||reasons[id]});}return true;
    }
    function choose(ids,group='공격',required=false){
      const candidate=ids.find(id=>have.has(id)&&!clash(id));
      if(candidate!==undefined){add([candidate],group);return candidate;}
      const id=ids[0];if(known.has(id)&&!have.has(id)&&!wanted.some(s=>s.id===id))wanted.push({id,group,required,reason:reasons[id]});return null;
    }
    for(const id of core[role])choose([id],'역할 핵심',true);
    if(duty==='solo')choose([91],'임무 핵심',true);
    if(role==='tank')for(const id of [75,95,28])choose([id],'방어·회복');
    if(role==='healer')for(const id of [88,72,73])choose([id],'방어·회복');
    if(duty!=='boss'){
      choose([33],'임무 핵심');
      if(have.has(33))choose([92,67],'임무 핵심');
      else {if(have.has(92))skipped.push({id:92,needs:[33],reason:'빙결의 포효와 함께 사용할 때 추천합니다.'});choose([67],'임무 핵심');}
      choose([97],'임무 핵심');
    }
    if(duty==='solo')choose([108],'방어·회복');
    if(role==='tank'&&duty==='boss')choose([89],'방어·회복');
    if(options.interrupt)choose([24],'선택한 임무 기술',true);
    if(options.cleanse&&role!=='healer')choose([73],'선택한 임무 기술',true);
    if(options.swap&&role==='tank'&&duty!=='solo')choose([62],'선택한 임무 기술',true);
    if(options.debuff==='offguard')choose([20],'선택한 담당 기술',true);
    if(options.debuff==='light')choose([43],'선택한 담당 기술',true);
    const dot=options.dot==='breath'?109:options.dot==='flame'?121:null;
    if(dot)choose([dot],'선택한 담당 기술',true);
    const filler=choose(fillerIds,'기본 공격');
    if(role==='tank')choose([105],'기본 공격');
    if(duty!=='solo'&&role!=='healer')choose([72],'방어·회복');
    if(role==='dps')choose([100],'공격');
    choose([9],'공격');
    if(used.has(dot)||(role!=='healer'&&(used.has(9)||used.has(100))))choose([12],'연계 버프');
    if(role==='dps'){
      // Atomic package: buffs are never equipped without their physical spell.
      if(have.has(81)){add([81,...[64,82].filter(id=>have.has(id))],'물리 연계');for(const id of [64,82])if(!have.has(id))choose([id],'물리 연계');}
      else choose([81],'물리 연계');
    }
    for(const ids of [[104,102],[44,45],[47,46],[78],[80,79],[124],[122]])choose(ids,'공격');
    if(role==='dps'){
      choose([118],'공격');choose([90],'공격');
      if(options.burst!==false&&[81,100,104,78,124].filter(id=>used.has(id)).length>=3)choose([39],'연계 버프');
    }
    choose([103],'공격');
    if(role!=='dps')choose([60,120],'방어·회복');
    if(role==='healer')choose([85],'방어·회복');
    if(role!=='tank')choose([90],'공격');
    choose([48],'공격');
    const missing=wanted.sort((a,b)=>Number(b.required)-Number(a.required));
    const blocked=missing.filter(s=>s.required);
    const notes=[];
    if(!have.size)notes.push('수집 기록 관리 또는 목록에서 습득한 기술을 먼저 체크하세요.');
    if(have.size&&blocked.length)notes.push('미습득 핵심·담당 기술이 있습니다. 아래 목록은 임시 조합이며, 이대로 역할 준비가 끝난 것은 아닙니다.');
    if(have.size&&!filler)notes.push('추천할 기본 원거리 공격이 없습니다. 물대포 등 기본 공격을 습득 체크해 주세요.');
    if(duty==='solo')notes.push('혼자 던전은 탱커 복사 기준입니다. 투쟁 본능은 다인용 임무에 혼자 있을 때만 적용되며, 필드·가면 무투회에는 적용되지 않습니다.');
    if(duty!=='boss')notes.push('빙결·즉사는 면역인 적에게 통하지 않습니다. 초진동이 재사용 대기 중이면 범위 공격을 사용하고 파티원과 순서를 나누세요.');
    if(role==='healer'&&!used.has(77))notes.push('에테르 복사가 없으면 회복 기술의 힐러 강화 효과를 받을 수 없습니다.');
    if(role==='tank'&&!used.has(30))notes.push('강력 방어가 없으므로 피해 감소·적개심 확보에 큰 제약이 있습니다.');
    if(dot)notes.push('마법 숨결·필멸의 불꽃은 각각 파티에서 한 명씩 담당하세요. 같은 효과를 덮어쓰지 않도록 조율합니다.');
    const result={role,duty,selected,missing,blocked,skipped,notes,filler,limit:LIMIT};
    result.rotation=rotation(result);return result;
  }
  function rotation(result){
    const ids=new Set(result.selected.map(s=>s.id)),has=(...list)=>list.every(id=>ids.has(id)),{role,duty,filler}=result;
    const flows=[];
    const flow=(title,steps,note,kind='combo')=>{if(steps.length&&steps.every(id=>ids.has(id)))flows.push({title,steps,note,kind});};
    const prep=[77,...(role==='tank'?[30]:[]),...(duty==='solo'?[91]:[])].filter(id=>ids.has(id));
    flow('전투 전 준비',prep,`에테르 복사는 다른 ${role==='tank'?'탱커':role==='healer'?'힐러':'딜러'} 플레이어에게 사용합니다. 전투 중 반복하는 순서가 아닙니다.`,'setup');
    if(role==='tank'){
      if(has(75))flow('전투 초반 · HP 확보',[75],'탱커 복사 상태에서 최대 HP 증가를 유지합니다.');
      if(has(28))flow('피해 감소가 필요할 때',[28],'대상의 피해 감소를 유지합니다. 생존기는 보스 공격에 맞춰 나누어 사용하세요.');
      if(has(95))flow('강한 공격·적 무리 접근 전',[95],'탱커 복사를 유지하고 피격 전에 사용합니다. 초경화와 항상 함께 소비하지 말고 필요한 구간에 배분하세요.');
      if(has(29))flow('큰 공격 직전',[29],'시전 완료가 피격보다 빨라야 합니다. 이후 10초 동안 이동·행동할 수 없으므로 모든 공격에 반복하지 마세요.');
      if(has(13,17))flow('회복·적개심과 MP 관리',[13,17],'하얀 바람은 자신의 현재 HP와 MP를 확인해 사용하고, MP가 부족해질 때 흡혈로 보충합니다. 매번 두 기술을 연달아 쓸 필요는 없습니다.');
    }
    if(role==='healer'){
      if(has(59))flow('광역 공격 직전',[59],'피해가 들어오기 전에 보호막을 준비합니다.');
      if(has(58,13))flow('자신의 HP가 낮고 파티 회복이 필요할 때',[58,13],'자신에게 폼폼 케알 → 하얀 바람. 하얀 바람의 회복량은 자신의 현재 HP를 따릅니다.');
      if(has(88))flow('큰 회복이 필요할 때',[88],'힐러 복사 상태에서 지속 회복까지 활용합니다.');
      if(has(73))flow('해제 가능한 약화 효과가 생겼을 때',[73],'대상 가까이에서 해제합니다.');
    }
    if(duty!=='boss'&&has(33,92))flow('적 무리 처리',[...(has(97)?[97]:[]),33,92],'적 모으기 → 빙결 확인 → 초진동. 면역인 적·자신보다 높은 레벨의 적에게는 즉사를 기대하지 마세요.');
    if(has(81))flow('물리 3연타',[...(has(64)?[64]:[]),...(has(82)?[82]:[]),81],'버프와 삼단 작살 사이에 다른 물리 마법을 넣지 마세요. 호루라기와 노발대발은 서로 중첩되지 않습니다.');
    for(const id of [9,100,109,121])if(has(12,id))flow(id===9?'지속 피해 갱신':id===100?'8연타 강화':'담당 지속 피해 강화',[12,id],id===9?'달빛 저승꽃의 지속 피해가 남아 있을 때는 고통의 노래로 덮어쓰지 마세요.':id===121?'전투에 들어간 대상에게 적용합니다. 이미 유지 중이면 반복할 필요가 없습니다.':'노발대발 바로 다음 마법으로 사용합니다. 강화할 공격 앞에 다른 마법을 넣지 마세요.');
    if(has(78))flow('관통산탄 연속 사용',[78,78,78,78],'4회 충전이 있을 때 연속 사용합니다. 사이에 다른 기술을 사용하면 강화가 끊깁니다.');
    if(has(103))flow('귀수각 마무리',[103,103],'일반 사용: 제자리에서 연속 피해를 준 뒤 효과가 끝나기 전에 다시 눌러 마무리합니다. 달의 피리 끝에 쓰는 경우는 시작 순서의 지침을 따르세요.');
    const loop=[];
    const entry=(id,text)=>{if(ids.has(id))loop.push({id,text});};
    if(role==='tank'){entry(75,'최대 HP 증가 유지');entry(105,'강력 방어 상태에서 정면 기본 공격');}
    if(role==='healer'){entry(58,'탱커 회복 우선');entry(13,'파티 회복이 필요할 때');}
    entry(90,'재사용이 돌아오면 공격');entry(118,'중첩을 쌓으며 공격');
    entry(109,'담당한 지속 피해가 끝나기 전에 갱신');entry(121,'전투 중 한 번 적용하고 유지 여부 확인');
    entry(9,'지속 피해 갱신 · 달빛 저승꽃이 끝난 뒤');
    if(filler)entry(filler,'나머지 시간 기본 공격');
    const full=role==='dps'&&duty==='boss'&&openerIds.every(id=>ids.has(id))&&!has(109)&&!has(121);
    const simple=[];
    if(has(39)){
      const physical=has(81)&&!has(109)&&!has(121);
      if(physical)for(const id of [64,82])if(has(id))simple.push({label:'준비',gcd:id,abilities:[]});
      simple.push({label:'강화 시작',gcd:39,abilities:[]});
      const primary=[109,121,100,9].find(id=>has(id));
      if(physical)simple.push({label:'물리 연계',gcd:81,abilities:[]});
      if(primary){if(has(12))simple.push({label:'마법 강화',gcd:12,abilities:[]});simple.push({label:'강화 공격',gcd:primary,abilities:[]});}
      // A short example deliberately leaves spare time; never squeeze every owned cooldown into 15s.
      const attacks=simple.filter(s=>[81,12,primary].includes(s.gcd));
      const abilities=[[104,102],[44,45],[47,46],[124]].map(g=>g.find(id=>has(id))).filter(Boolean);
      attacks.forEach((s,i)=>{s.abilities=abilities.slice(i*2,i*2+2);});
      if(has(103))simple.push({label:'강화 종료 직전',gcd:null,abilities:[103]});
    }
    const burst={enabled:has(39),full,steps:full?opener:simple,needs:openerIds.filter(id=>!ids.has(id))};
    return {flows,loop,burst};
  }
  return {LIMIT,roles,duties,cooldowns,reasons,openerIds,recommend};
});
