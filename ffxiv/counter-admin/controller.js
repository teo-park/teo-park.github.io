(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CounterAdminController=factory();})(typeof window==='object'?window:null,function(){
  function create(document,model,services){
    const $=id=>document.getElementById(id);
    let user=null,generation=0,selectedRows=[];
    function excludeThisBrowser(){
      try{
        const storage=document.defaultView.localStorage;
        storage.setItem('ffxiv-counter-owner-excluded','true');
        // Also stop collectors already loaded in other tabs on the previous version.
        storage.setItem('ffxiv-usage-stats-disabled','true');
        $('selfExclusion').textContent='이 브라우저는 방문·게임 항목 선택 집계에서 제외됩니다. 로그아웃하거나 브라우저를 다시 열어도 유지됩니다.';
      }catch{
        $('selfExclusion').textContent='집계 제외 설정을 저장하지 못했습니다. 브라우저의 사이트 저장소를 허용한 뒤 이 페이지를 새로고침해 주세요.';
      }
    }
    function clearSelections(){selectedRows=[];$('selectionRows').replaceChildren();$('selectionTotal').textContent='—';$('selectionHint').textContent='';}
    function renderSelections(){
      const rows=selectedRows.filter(row=>!$('selectionKind').value||row.kind===$('selectionKind').value);
      $('selectionRows').replaceChildren();
      for(const item of rows.slice(0,50)){
        const tr=document.createElement('tr'),name=document.createElement('td'),id=document.createElement('small');
        name.textContent=item.name;id.textContent='ID '+item.id;name.append(id);tr.append(name);
        for(const text of [item.label,item.count.toLocaleString('ko-KR')]){const td=document.createElement('td');td.textContent=text;tr.append(td);}
        $('selectionRows').append(tr);
      }
      $('selectionHint').textContent=rows.length?`${rows.length.toLocaleString('ko-KR')}개 항목 중 상위 ${Math.min(50,rows.length)}개`:'아직 집계된 선택이 없습니다.';
    }
    function clear(){
      $('dashboard').hidden=true;$('loginPanel').hidden=false;
      $('account').textContent='';$('total').textContent='—';$('updated').textContent='';$('rows').replaceChildren();
      $('selfExclusion').textContent='';
      clearSelections();
    }
    async function refresh(){
      if(!model.allowed(user))return;
      const revision=++generation;
      $('refresh').disabled=true;$('status').textContent='통계를 불러오고 있습니다.';
      try{
        const {pages,baseline,visits,catalog,selections}=await services.load();
        if(revision!==generation||!model.allowed(user))return;
        const summary=model.summarize(pages,baseline,visits);
        $('rows').replaceChildren();
        for(const item of summary.rows){
          const tr=document.createElement('tr'),label=document.createElement('td'),link=document.createElement('a');
          link.textContent=item.label;link.href=item.path;label.append(link);tr.append(label);
          for(const text of [item.count.toLocaleString('ko-KR'),summary.total?(item.count/summary.total*100).toFixed(1)+'%':'0%']){
            const td=document.createElement('td');td.textContent=text;tr.append(td);
          }
          $('rows').append(tr);
        }
        $('total').textContent=summary.total.toLocaleString('ko-KR');
        const selected=model.selections(catalog,selections);selectedRows=selected.rows;
        const kind=$('selectionKind').value;$('selectionKind').replaceChildren();
        for(const [value,label] of [['','전체 종류'],...Object.entries(catalog?.groups||{}).map(([key,group])=>[key,group.label])]){
          const option=document.createElement('option');option.value=value;option.textContent=label;$('selectionKind').append(option);
        }
        if([...$('selectionKind').options].some(option=>option.value===kind))$('selectionKind').value=kind;
        $('selectionTotal').textContent=selected.total.toLocaleString('ko-KR');renderSelections();
        $('updated').textContent='확인 시각 · '+new Date().toLocaleString('ko-KR');
        $('status').textContent='';
      }catch{
        if(revision!==generation)return;
        // Clear previously loaded data instead of presenting it as a successful refresh.
        $('rows').replaceChildren();$('total').textContent='—';$('updated').textContent='';
        clearSelections();
        $('status').textContent='통계를 읽지 못했습니다. 계정 권한이나 연결 상태를 확인한 뒤 다시 시도하세요.';
      }finally{if(revision===generation)$('refresh').disabled=false;}
    }
    async function onUser(next){
      generation++;user=next;clear();$('login').disabled=false;$('refresh').disabled=false;
      if(!next){$('status').textContent='관리자 계정으로 로그인하면 통계가 표시됩니다.';return;}
      if(!model.allowed(next)){$('status').textContent='이 계정에는 통계 조회 권한이 없습니다. 관리자 계정으로 다시 로그인하세요.';await services.signOut();return;}
      excludeThisBrowser();
      $('loginPanel').hidden=true;$('dashboard').hidden=false;$('account').textContent=next.email;
      await refresh();
    }
    $('login').addEventListener('click',async()=>{
      $('login').disabled=true;$('status').textContent='Google 로그인 창에서 계정을 선택하세요.';
      try{await services.signIn();}
      catch(error){
        const messages={
          'auth/popup-blocked':'로그인 팝업이 차단되었습니다. 팝업을 허용한 뒤 다시 눌러 주세요.',
          'auth/popup-closed-by-user':'로그인 창이 닫혔습니다. 다시 눌러 로그인해 주세요.',
          'auth/unauthorized-domain':'이 주소에서 로그인이 허용되지 않았습니다. 관리자에게 주소 설정 확인을 요청하세요.',
          'auth/network-request-failed':'로그인 서버에 연결하지 못했습니다. 연결 상태를 확인하고 다시 시도하세요.',
        };
        const code=/^auth\/[a-z-]+$/.test(error?.code||'')?error.code:'';
        $('status').textContent=messages[code]||('로그인을 완료하지 못했습니다. 다시 시도하세요.'+(code?' ('+code+')':''));
      }
      finally{$('login').disabled=false;}
    });
    $('refresh').addEventListener('click',refresh);
    $('selectionKind').addEventListener('change',renderSelections);
    $('logout').addEventListener('click',async()=>{
      generation++;user=null;clear();$('status').textContent='로그아웃 중입니다.';
      try{await services.signOut();$('status').textContent='로그아웃했습니다.';}
      catch{$('status').textContent='로그아웃을 완료하지 못했습니다. 페이지를 닫고 다시 확인해 주세요.';}
    });
    return {onUser,refresh,clear};
  }
  return {create};
});
