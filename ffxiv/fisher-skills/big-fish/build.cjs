const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const content=require('./content.cjs'),skills=require('../content.cjs'),navigation=require('../../tools/site-navigation.cjs');
const tips=require('../skill-tips.cjs').create('../'),rich=tips.rich;
const root=path.resolve(__dirname,'../..'),context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'fishing-log/data.js'),'utf8'),context);
const data=context.window.FISHING_DATA,fish=new Map(data.fishes.map(f=>[f.id,f]));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external=(url,label)=>{if(!/^https:\/\//.test(url))throw Error('Invalid source URL: '+url);return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;};
const list=(items,ordered=false)=>`<${ordered?'ol':'ul'}>${items.map(s=>`<li>${rich(s)}</li>`).join('')}</${ordered?'ol':'ul'}>`;
function examples(items,compact=false){return `<ul class="examples${compact?' compact':''}">${items.map(e=>{const f=fish.get(e.id);if(!f?.big||f.stars)throw Error('Representative fish outside overworld big fish: '+e.id);return `<li data-example-fish="${f.id}"><div class="example-title">${external(`https://ffxivteamcraft.com/db/ko/item/${f.id}`,f.name)}<span>${f.legendary?'터주왕':'터주'}</span></div><p>${rich(e.reason)}</p>${external(e.source,e.sourceLabel)}</li>`;}).join('')}</ul>`;}
function skillLinks(ids){return ids.map(id=>{const s=skills.find(s=>s.id===id);if(!s)throw Error('Unknown skill link: '+id);return tips.term(s.skills[0]);}).join('');}
const ids=new Set();for(const item of [...content.types,...content.modifiers]){if(ids.has(item.id))throw Error('Duplicate section: '+item.id);ids.add(item.id);}
const cards=content.types.map((t,i)=>`<article class="type-card" id="${t.id}" aria-labelledby="title-${t.id}">
  <header class="type-heading"><span class="type-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><h2 id="title-${t.id}">${esc(t.title)}</h2><p>${esc(t.when)}</p></div><a class="permalink" href="#${t.id}" aria-label="${esc(t.title)} 바로가기">#</a></header>
  <ol class="flow" aria-label="기본 흐름">${t.flow.map(s=>`<li>${rich(s)}</li>`).join('')}</ol>
  <div class="type-instructions"><section><h3>준비</h3>${list(t.prep)}</section><section><h3>진행 순서</h3>${list(t.steps,true)}</section></div>
  <div class="type-mistake"><h3>주의할 점</h3><p>${rich(t.mistake)}</p></div>
  <section class="type-examples"><h3>대표 어종</h3>${examples(t.examples)}</section><div class="skill-links"><span>기술 사용법</span>${skillLinks(t.skills)}</div>
</article>`).join('\n');
const modifiers=content.modifiers.map(t=>`<article class="modifier-card" id="${t.id}"><h3>${esc(t.title)}</h3><p>${rich(t.text)}</p>${examples(t.examples,true)}</article>`).join('\n');
const html=`<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>터주 유형별 공략 · 파판14 도구함</title>
<meta name="description" content="직접 낚시, 생미끼 저격·연속·저글링, 직감 준비까지 7가지 터주 유형의 준비와 진행 순서. 홍룡·깜짝알·일라드 스칸 등 대표 어종과 기술 안내.">
<meta name="theme-color" content="#0b1220"><meta property="og:title" content="터주 유형별 공략"><meta property="og:description" content="7가지 기본 유형 · 준비·진행 순서·대표 어종"><meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><meta property="og:url" content="https://teo-park.github.io/ffxiv/fisher-skills/big-fish/">
<link rel="canonical" href="https://teo-park.github.io/ffxiv/fisher-skills/big-fish/"><link rel="icon" href="../../favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../../theme.css?v=20260909-line1"><link rel="stylesheet" href="./styles.css?v=20260910-types1"><link rel="stylesheet" href="../skill-tips.css?v=20260910-tips1"><script defer src="../skill-tips.js?v=20260910-tips1"></script>${navigation.assets('fisher-skills/big-fish/')}</head>
<body><a class="skip-link" href="#typeContent">공략 본문으로 바로가기</a>${navigation.header('fisher-skills/big-fish/')}
<main class="guide-main"><header class="guide-masthead"><div><p class="eyebrow">낚시 가이드</p><h1>터주 유형별 공략</h1><p>낚는 방식에 맞춰 준비하고, 필요한 기술을 골라 사용하세요.</p></div><a class="planner-link" href="../../fishing-log/">낚시 계획·수집 도감 ↗</a></header>
<nav class="guide-tabs" aria-label="어부 가이드"><a href="../">어부 스킬 안내</a><a href="./" aria-current="page">터주 유형별 공략</a></nav>
<div class="guide-layout"><aside class="type-sidebar"><nav aria-label="공략 목차"><p>기본 유형 7가지</p>${content.types.map((t,i)=>`<a href="#${t.id}"><span>${String(i+1).padStart(2,'0')}</span>${esc(t.title)}</a>`).join('')}<a href="#conditions" class="extra-nav">추가 조건 4가지</a><a href="#common" class="extra-nav">공통 원칙</a><a href="#sources" class="extra-nav">출처·설명 기준</a></nav></aside>
<div id="typeContent"><div class="guide-intro"><p><strong>기본 유형 + 추가 조건</strong>을 함께 보세요. 직감형은 직접 낚시·생미끼형과 겹칠 수 있습니다.</p><p>예: 수분어는 <a href="#rare-intuition">희귀 어종 직감형</a>이며, 직감 이후에는 <a href="#direct">직접 낚시형</a>으로 도전합니다.</p><p class="guide-meta">스킬명에 마우스를 올리거나 누르면 설명을 볼 수 있습니다.</p><p class="guide-meta">100레벨 기술을 활용한 일반 원리 · 무료·비영리 · ${content.checked} 확인</p></div>
${cards}
<section class="conditions-section" id="conditions" aria-labelledby="conditionsTitle"><div class="section-heading"><h2 id="conditionsTitle">함께 확인할 추가 조건</h2><p>기본 낚시 방식이 같아도 시간과 준비 조건에 따라 자원 배분이 달라집니다.</p></div><div class="modifier-grid">${modifiers}</div></section>
<section class="common-section" id="common" aria-labelledby="commonTitle"><h2 id="commonTitle">공통 원칙</h2><dl>
<div><dt>${rich('교방은 어종과 시점을 함께 선택')}</dt><dd>같은 미끼에서 자주 낚이는 어종뿐 아니라 오래 기다리게 하는 어종도 비교합니다. 포획 관측량을 입질 확률로 단정하지 않습니다. 생미끼·직감 재료는 준비와 갱신에 필요한지 먼저 봅니다.</dd></div>
<div><dt>활성 생미끼와 보관 생미끼는 구분</dt><dd>${rich('현재 생미끼 프록에 밑밥·인내·대물 낚시를 쓰면 연결이 끊어집니다. 묘안으로 보관한 생미끼는 남습니다. 교방·한결같은 챔질 효과 중에는 묘안을 사용할 수 없습니다.')} <a href="../#spareful">보관 방법 ↗</a></dd></div>
<div><dt>${rich('인내·대물 낚시는 월척 확보용')}</dt><dd>${rich('터주 자체의 입질 확률을 올리는 효과로 취급하지 않습니다. 인내 중에는 맞는 낚아채기로 페널티를 상쇄해야 하며, 이중·삼중 낚아채기가 대신해 주지 않습니다.')} <a href="../#patience">인내 사용법 ↗</a></dd></div>
<div><dt>!!!만으로 루어·낚아채기를 결정하지 않기</dt><dd>${rich('!!!에도 섬세한·강력한 낚아채기 대상이 있습니다. 소박한 루어는 섬세한 계열, 거대한 루어는 강력한 계열에 맞춰 검토합니다. 필수 조건이 아니라면 경쟁 어종·시간·GP도 함께 봅니다.')} <a href="../#lures">루어 사용법 ↗</a></dd></div>
</dl></section>
<section class="guide-sources" id="sources"><h2>출처·설명 기준</h2><p>유형은 일반적인 낚시 전략을 이해하기 위한 분류입니다. 대표 어종은 그 방식을 설명하기 위한 사례이며 난도 순위가 아닙니다. 어종별 정확한 미끼·날씨·시간·예외는 각 예시의 Teamcraft와 원문 공략에서 확인하세요.</p><ul>
<li>${external('https://guide.ff14.co.kr/job/Fisher/31?type=L','한국 공식 어부 가이드')}: 기술 이름·효과·해금 레벨. 각 기술의 자세한 순서는 ${'<a href="../">어부 스킬 안내</a>'}에 정리했습니다.</li>
<li>${external('https://docs.google.com/document/d/16svonqsZn4f0UUFHjO-7JG_-mLSRMXv_mczkECDiiQk/edit','Fruity Snacks · 일반 낚시 전략')}, ${external('https://afishersguidetoeorzea.carrd.co/','확장팩별 공략 모음')}: 직접 낚시·생미끼·직감의 접근법과 대표 사례. 설명은 유형의 원리를 중심으로 작성했습니다.</li>
<li>${external('https://www.inven.co.kr/board/ff14/4467/13958','꼬막킴 · 7.55 터주왕 공략')}: 네라도의 루어 조건 사례. 최근 공략은 최적화가 진행 중입니다.</li>
<li>${external('https://www.reddit.com/r/ffxiv/comments/1v3gsj8/my_experience_getting_the_final_fish_in_2_months/','수집 완료자의 후기')}: 대표 어종의 인지도·체감 난도 참고. 개인 경험을 고정된 성공률로 사용하지 않습니다.</li>
</ul><p>한국어 어종 이름·미끼 연결·직감 재료는 ${external('https://ffxivteamcraft.com/log-tracker/FSH','Teamcraft')}를 반영한 수첩 자료와 대조했습니다. 스킬 아이콘은 한국 공식 가이드의 이미지를 사용합니다.</p></section></div></div></main>${tips.markup()}
<footer class="site-footer"><div class="footer-top"><span>터주 유형별 공략 · 무료·비영리 팬 페이지</span><a href="../../">도구 목록으로 ↗</a></div><div class="site-credits"><p>SQUARE ENIX 및 액토즈소프트가 제작하거나 승인한 공식 서비스가 아닙니다.</p><p>© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.</p><p>글꼴: ${external('https://seed.line.me/index_kr.html','LINE Seed KR')} · <a href="../../fonts/line-seed-kr/OFL.txt">글꼴 라이선스</a> · 보조 글꼴: ${external('https://hangeul.naver.com/font/nanum','네이버 나눔스퀘어라운드')} · <a href="../../fonts/nanum-square-round/OFL.txt">OFL</a></p><p><a href="../../fishing-log/README.md">낚시 데이터·출처 안내</a> · ${external('https://www.ff14.co.kr/support/policy','한국 저작물 이용 허락 조건')}</p></div></footer></body></html>`;
fs.writeFileSync(path.join(__dirname,'index.html'),html);
console.log(`Built ${content.types.length} strategy types and ${content.modifiers.length} modifiers; ${new Set([...content.types,...content.modifiers].flatMap(t=>t.examples.map(e=>e.id))).size} representative fish.`);
