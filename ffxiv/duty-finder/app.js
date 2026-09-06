(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const node=(tag,className,text)=>{const el=document.createElement(tag);el.className=className;if(text!==undefined)el.textContent=text;return el;};
  let search,data,limit=30;
  function render(){
    const query=$('dutySearch').value,category=$('categoryFilter').value;
    const results=$('searchResults');results.replaceChildren();
    $('clearSearch').hidden=!query;
    if(!window.DutySearch.normalize(query)&&!category){
      $('searchSummary').textContent='초성을 입력하거나 콘텐츠 종류를 골라주세요';
      results.append(node('p','empty','찾고 싶은 임무의 초성을 입력해 주세요.\n이름의 앞부분을 몰라도 검색할 수 있어요.'));
      $('showMore').hidden=true;return;
    }
    const matches=search(query,category);
    $('searchSummary').textContent=`${matches.length}개 임무${matches.length>limit?` · ${limit}개 표시`:''}`;
    if(!matches.length)results.append(node('p','empty','일치하는 임무가 없어요. 초성을 짧게 입력하거나 콘텐츠 종류를 바꿔 보세요.'));
    for(const duty of matches.slice(0,limit)){
      const card=node('article','duty-result');
      const meta=node('div','duty-meta');meta.append(node('span','category',duty.category),node('span','level',`Lv.${duty.level}`));card.append(meta);
      card.append(node('h3','',duty.name),node('p','initials',window.DutySearch.initials(duty.name)));
      const detail=[duty.expansion,duty.itemLevel===null?'':`평균 아이템 레벨 ${duty.itemLevel}`].filter(Boolean).join(' · ');
      card.append(node('p','duty-detail',detail));
      const link=node('a','guide-link','공식 가이드에서 보기 ↗');link.href=`https://guide.ff14.co.kr/lodestone/db/duty/${duty.id}`;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`${duty.name} 공식 가이드에서 보기 (새 탭)`);card.append(link);
      results.append(card);
    }
    $('showMore').hidden=matches.length<=limit;
  }
  try{
    data=window.DUTY_DATA;
    if(data?.schemaVersion!==1||!data.duties?.length)throw new Error('Invalid duty data');
    search=window.DutySearch.createSearch(data.duties);
    for(const category of data.categories){const option=node('option','',`${category.name} (${category.count})`);option.value=category.name;$('categoryFilter').append(option);}
    $('dutySearch').disabled=false;$('categoryFilter').disabled=false;
    // Read input.value on every input, including IME composition. Never replace the input itself.
    $('dutySearch').addEventListener('input',()=>{limit=30;render();});
    $('dutySearch').addEventListener('compositionend',()=>{limit=30;render();});
    $('categoryFilter').addEventListener('change',()=>{limit=30;render();});
    $('clearSearch').addEventListener('click',()=>{$('dutySearch').value='';limit=30;render();$('dutySearch').focus();});
    $('showMore').addEventListener('click',()=>{limit+=30;render();});
    for(const button of document.querySelectorAll('[data-example]')){button.disabled=false;button.addEventListener('click',()=>{$('dutySearch').value=button.dataset.example;$('categoryFilter').value='';limit=30;render();$('dutySearch').focus();});}
    $('dataInfo').textContent=`공식 가이드 확인일 ${data.fetchedAt} · ${data.duties.length}개 임무 · 검색어는 서버에 전송하지 않아요.`;
    render();
  }catch(error){
    $('searchSummary').textContent='임무 목록을 불러오지 못했어요.';
    $('searchResults').replaceChildren(node('p','error','새로고침해 주세요. 계속 실패하면 잠시 후 다시 방문해 주세요.'));
    console.error(error);
  }
})();
