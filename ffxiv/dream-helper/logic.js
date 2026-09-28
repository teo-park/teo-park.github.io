(function (root) {
  'use strict';
  // Ported from the supplied Idyllic Dream Helper strategies.py and main.py.
  const strategies = {
    '09stop': {
      name: '09stop', center: '1·2징 사이',
      marks: ['A','1','B','2','C','3','D','4'],
      checks: ['숫자 1','숫자 3','숫자 2','숫자 4','금지 1','속박 1','금지 2','속박 2'],
      icons: ['first','third','second','fourth','stop1','bind1','stop2','bind2'],
      lines: ['A·1','B·2','C·3','D·4','A·1','B·2','C·3','D·4'],
      share: [0,1,2,3],
      routes: [
        ['center-1-center-1','center-1-center-1','center-2-center-2','center-2-center-2','D-1-center-1','center-1-D-1','C-2-center-2','center-2-C-2'],
        ['1-center-1-center','1-center-1-center','2-center-2-center','2-center-2-center','1-D-1-center','1-center-1-D','2-C-2-center','2-center-2-C']
      ],
      opening: [['12시 → 1시','1시 → 12시'],['3시 → 5시','5시 → 3시']],
      towers: ['에어로가(공중): 보스 정면에 딱 붙기','죽선(빔): 숫자징 뒤쪽 변에 서기','디버프 없는 원딜: 섬 남쪽(6시) 끝','디버프 없는 근딜: 숫자징 대상 뒤쪽 붙기']
    },
    game8: {
      name: 'Game8', center: 'C징',
      marks: ['A','2','B','3','C','4','D','1'],
      checks: ['숫자 4','숫자 1','금지 2','숫자 2','금지 1','속박 1','속박 2','숫자 3'],
      icons: ['fourth','first','stop2','second','stop1','bind1','bind2','third'],
      lines: ['A·2','A·2','D·1','B·3','C·4','C·4','D·1','B·3'],
      share: [0,5,6,7],
      routes: [
        ['C-3-C-3','2-3-C-3','C-4-1-4','C-3-2-3','1-4-C-4','C-4-C-4','C-4-C-4','C-3-C-3'],
        ['3-C-3-C','3-2-3-C','4-C-4-1','3-C-3-2','4-1-4-C','4-C-4-C','4-C-4-C','3-C-3-C']
      ],
      opening: [['A징 → 1징','1징 → A징'],['D징 → 4징','4징 → D징']],
      towers: ['에어로가(공중): 타겟서클 남쪽 끝','죽선(빔): 남쪽 숫자징 모서리 근처','디버프 없는 원딜: 섬 북쪽(12시) 끝','디버프 없는 근딜: 숫자징 대상 남쪽 붙기']
    }
  };
  const roles = ['T1','T2','D1','D2','H1','H2','D3','D4'];
  const fields = ['shape','clone','safe','spread','tower','flash','remaining','island'];
  const towerNames = {dark:'어둠',wind:'바람',fire:'화염',earth:'땅'};
  const towerPairs = {dark:'earth',earth:'dark',wind:'fire',fire:'wind'};
  function initial(strategy='09stop', role='T1') {
    return {strategy,role,shape:null,clone:null,safe:null,spread:null,tower:null,flash:null,remaining:null,island:null};
  }
  function calculate(s) {
    const strat = strategies[s.strategy];
    const group = ['T1','H1','D1','D3'].includes(s.role) ? 0 : 1;
    const hasClone = Number.isInteger(s.clone) && s.clone >= 0 && s.clone < 8;
    const swapKnown = Boolean(s.tower && s.flash);
    const tankSwap = (['dark','wind'].includes(s.tower) && s.flash==='TH') || (['fire','earth'].includes(s.tower) && s.flash==='D');
    const swap = swapKnown ? (s.role.startsWith('D') ? !tankSwap : tankSwap) : null;
    const finalTower = swapKnown ? (swap ? towerPairs[s.tower] : s.tower) : null;
    const destination = ['H1','H2','D3','D4'].includes(s.role) ? '남쪽 가장자리 유도' : '중앙 칼끝딜 유도';
    const instructions = {dark:'바깥으로 빔 유도 → 죽순 회피 → 중앙 히트박스 선',wind:'날아가기 각도 조정 → 죽순 회피 → 보스에게 딱 붙기',fire:'디버프 대기 → '+destination,earth:'죽순 회피 → '+destination};
    const safeKnown = Boolean(s.safe && s.remaining);
    return {
      group: group === 0 ? '메인조' : '서브조',
      opening: s.shape ? strat.opening[group][s.shape==='plus'?0:1] : null,
      check: hasClone ? strat.checks[s.clone] : null,
      checkIcon: hasClone ? strat.icons[s.clone] : null,
      line: hasClone ? strat.lines[s.clone] : null,
      lineType: hasClone ? (strat.share.includes(s.clone)?'쉐어':'산개') : null,
      route: hasClone && s.spread ? strat.routes[s.spread==='spread'?0:1][s.clone].split('-') : null,
      swap,finalTower,instruction: finalTower ? instructions[finalTower] : null,
      safety: safeKnown ? (s.safe===s.remaining ? '양옆 안전 · 히트박스 안(편안)' : '위아래 안전 · 히트박스 바깥(불편)') : null,
      latest: fields.findIndex(f=>s[f]===null) === -1 ? 8 : fields.findIndex(f=>s[f]===null)
    };
  }
  const api={strategies,roles,fields,towerNames,initial,calculate};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  else root.DreamLogic=api;
})(typeof globalThis!=='undefined'?globalThis:this);
