// Purpose labels are derived from the documented effects of the two unique
// familiar commands. They are not role ratings, DPS rankings or enemy resist data.
export const elements={slash:'베기',pierce:'찌르기',blunt:'타격',fire:'불',ice:'얼음',wind:'바람',earth:'땅',lightning:'번개',water:'물',unaspected:'무속성'};
export const purposes={heal:'회복·HP 흡수',defense:'피해 감소·저항',buff:'공격 강화·헤이스트',haste:'헤이스트·공격 가속',debuff:'적 약화·저항 감소',control:'행동 제어',cleanse:'아군 약화 해제',dispel:'적 강화 해제',dot:'지속 피해',aoe:'범위 공격',conditional:'상태 연계·추가 피해',finisher:'마무리·특수 효과'};
export const ailments=['수면','마비','실명','속박','과중력','석화','둔화','기절','질병','빙결','악몽','죽음의 선고'];
export const commands={instinctual:{name:'궁극기',level:8,actionId:47093},release:{name:'능력 해방',level:18,actionId:44890}};
const clean=s=>s.replace(/<(UIForeground|UIGlow)>[\s\S]*?<\/\1>/g,'').replace(/<[^>]*>/g,'').trim();

export function describeAction(action,kind){
  // All current conditional branches in these commands grant the same Lv.44
  // follow-up buff. Keep their source intact and classify the unconditional part.
  const text=clean(action.tooltip.raw.split('<If')[0]),lines=text.split('\n'),first=lines[0];
  const attack=first.includes('공격을 가합니다'),element=attack?Object.entries(elements).find(([,v])=>first.includes(`${v==='무속성'?'무':v}속성`))?.[0]||null:null;
  const tags=new Set(),states=[];
  const enemyLines=lines.filter(l=>/(대상(?:에게|을|의|이)|적에게)/.test(l)&&!/파티원|대상이 .+ 상태인/.test(l));
  if(/마수조련사의 HP를 회복|파티원에게 HP 흡수 공격/.test(text))tags.add('heal');
  if(/파티원[^\n]*(?:받는[^\n]*감소|저항력[^\n]*증가)/.test(text))tags.add('defense');
  if(/파티원이 주는[^\n]*증가|자동 공격 주기[^\n]*단축|파티원에게 양날의 검/.test(text))tags.add('buff');
  if(/자동 공격 주기[^\n]*단축/.test(text))tags.add('haste');
  if(enemyLines.some(l=>/저항력[^\n]*감소|받는 (물리|마법) 피해량[^\n]*증가|명중률[^\n]*감소/.test(l)))tags.add('debuff');
  if(/파티원에게 부여된[^\n]*약화 효과[^\n]*해제/.test(text))tags.add('cleanse');
  if(/대상에게 부여된 강화 효과[^\n]*해제/.test(text))tags.add('dispel');
  if(enemyLines.some(l=>/독 지속 피해/.test(l)))tags.add('dot');
  for(const state of ailments)if(enemyLines.some(l=>l.includes(state)&&/부여|마비시|석화시|기절시|속박/.test(l)))states.push(state);
  if(states.some(s=>s!=='죽음의 선고')||enemyLines.some(l=>/밀쳐|끌어당/.test(l)))tags.add('control');
  if(attack&&first.includes('범위'))tags.add('aoe');
  if(/대상이 .+ 상태인 경우 추가 피해/.test(text))tags.add('conditional');
  if(/사역마수가 귀환|죽음의 선고|HP를 한 자릿수/.test(text))tags.add('finisher');
  const affinity=text.match(/수심기 속성: (맹렬|견고|마력|비상)/)?.[1]||null;
  const summary=lines.filter(l=>!l.startsWith('수심기 속성:')&&!l.startsWith('발동 조건:')&&!l.startsWith('TP 소비량')&&!l.startsWith('사역마수가 실행하는 수심기')&&!l.includes('마지막 일격 효과 향상')).join('\n').replace(/^사역마수가 .+?를?을? 실행하여,\s*/,'');
  return {id:action.id,name:action.name,kind,level:commands[kind].level,element,attack,affinity,tags:[...tags],states,text,summary,
    followupConditional:action.tooltip.hasConditions,source:action.source};
}

export function buildCombat(data){
  return new Map(data.beasts.map(beast=>{
    const actions=['instinctual','release'].map((kind,slot)=>{
      const link=beast.actions.find(a=>a.slot===slot),action=data.actions[link?.actionId];
      if(!action?.tooltip?.raw)throw Error(`Missing familiar combat effect: ${beast.id}/${slot}`);
      return describeAction(action,kind);
    });
    return [beast.id,{beastId:beast.id,actions,tags:[...new Set(actions.flatMap(a=>a.tags))]}];
  }));
}
export const purposeMatches=(action,purpose)=>!purpose||purpose==='all'||action.tags.includes(purpose)||(purpose.startsWith('state:')&&action.states.includes(purpose.slice(6)));
export const weaknessMatches=(action,weakness)=>!weakness||weakness==='all'||action.element===weakness;
export function combatMatches(profile,o={}){
  return profile.actions.some(a=>purposeMatches(a,o.purpose))&&profile.actions.some(a=>weaknessMatches(a,o.weakness));
}
export function purposeForQuery(normalized){
  const aliases={힐:'heal',회복:'heal',hp회복:'heal',방어:'defense',생존:'defense',버프:'buff',헤이스트:'haste',디버프:'debuff',메즈:'control',에스나:'cleanse',디스펠:'dispel',독:'dot',도트:'dot',광역:'aoe',범위공격:'aoe'};
  return aliases[normalized]||(ailments.some(s=>s.replaceAll(' ','')===normalized)?`state:${ailments.find(s=>s.replaceAll(' ','')===normalized)}`:null);
}
export function combatSearchText(profile){
  const aliases={heal:'힐 HP 회복',defense:'방어 생존',buff:'버프',haste:'공격 가속',debuff:'디버프',control:'메즈 행동 방해',cleanse:'에스나 아군 상태이상 해제',dispel:'디스펠',dot:'도트 독',aoe:'광역 다수',conditional:'연계 콤보',finisher:'마무리'};
  return profile.actions.flatMap(a=>[a.name,a.text,...a.tags.flatMap(t=>[purposes[t],aliases[t]]),...a.states,a.element?elements[a.element]:'']).join(' ');
}
