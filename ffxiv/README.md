# 파판14 도구함

파이널판타지14 한국 서버를 위한 정적 웹 도구 모음입니다.

**모든 도구를 무료로 제공합니다. 광고·후원·유료 기능 없이 비영리로 운영합니다.** SQUARE ENIX 및 액토즈소프트가 제작하거나 승인한 공식 서비스가 아닌 팬 제작 사이트입니다.

- 첫 화면: <https://teo-park.github.io/ffxiv/>
- [메인 퀘스트 진행률](https://teo-park.github.io/ffxiv/msq-tracker/) — 주요 퀘스트 이름·초성 검색과 전체·확장팩별 진행률
- [앱 설명과 데이터 갱신 안내](./msq-tracker/README.md)
- [PvP 시리즈 계산기](https://teo-park.github.io/ffxiv/pvp-series-calculator/) — PvP 시리즈 목표 경험치·예상 판수·하루 목표 계산 ([앱 안내](./pvp-series-calculator/README.md))
- [임무 초성 사전](https://teo-park.github.io/ffxiv/duty-finder/) — 던전·토벌전·레이드 등 공식 임무의 한글·초성 검색 ([앱 안내](./duty-finder/README.md))
- [트리플 트라이어드 수첩](https://teo-park.github.io/ffxiv/triple-triad/) — 카드 수집 체크·획득처·규칙별 보유 카드 덱 추천 ([데이터와 추천 안내](./triple-triad/README.md))
- [꼬마친구 수첩](https://teo-park.github.io/ffxiv/minions/) — 아이콘으로 빠른 보유 체크·초성 검색·획득처·확장팩 필터 ([데이터와 이용 안내](./minions/README.md))
- [청마도사 스킬 수첩](https://teo-park.github.io/ffxiv/blue-mage/) — 청마법 습득 체크·번호와 초성 검색·장소별 습득처·우상 조건 ([데이터와 이용 안내](./blue-mage/README.md))

- [세계를 누비는 어부](https://teo-park.github.io/ffxiv/fishing-log/) — 어류·작살도감 10×10 수집 체크·캡처 등록·Teamcraft 기록 호환·미끼와 장소별 보기·내 접속 시간의 낚시 예보·페이지 접속 중 알림 ([데이터와 이용 안내](./fishing-log/README.md))

- [어부 스킬 안내](https://teo-park.github.io/ffxiv/fisher-skills/) — 숙련 낚시꾼의 생미끼 프록 유지·쿠얼 저글링, 생미끼·저격·직감 스킬 사용법 ([설명 기준과 출처](./fisher-skills/README.md))

- [마수도감](https://teo-park.github.io/ffxiv/beastmaster/) — 마수 50종 5×5 수집 체크·장소별 포획·항아리 교환 가격과 선행 퀘스트 ([데이터와 이용 안내](./beastmaster/README.md))
- [마수조련사 공략](https://teo-park.github.io/ffxiv/beastmaster/guide/) — Game8 기반 시련장 레벨링·추천 편성과 기믹 요약 ([편집 기준](./beastmaster/guide/README.md))

수집형 도감(카드·꼬마친구·청마법·마수·어류/작살도감)은 창문 모양 **그리드 아이콘**과 **목록 아이콘**으로 배치를 전환합니다. 현재 페이지·필터·수집 체크는 유지하고 각 도감의 보기 방식은 브라우저에 기억합니다. 기존 페이지 크기는 유지합니다. 청마법 장소별, 낚시 미끼·장소별 보기는 자체 목록을 사용합니다.

공통 배치 UI는 `collection-layout.js`와 `collection-layout.css`에서 관리하며, 보기 설정은 `teo-ffxiv.collection-layout.<도감>.v1`에 수집 기록과 별도로 저장합니다.

- [무기 수첩](https://teo-park.github.io/ffxiv/weapons/) — 직업별 성장 단계·절 무기 수집·재보강 신곡 무기·백업 ([데이터와 이용 안내](./weapons/README.md))

## 출처 및 권리 안내

전체 페이지와 무기 공유 이미지는 [LINE Seed KR](https://seed.line.me/index_kr.html)을 사용하고, 나눔스퀘어라운드를 보조 글꼴로 유지합니다. 공식 배포본의 Regular·Bold 웹폰트를 수정 없이 제공하며 [OFL](./fonts/line-seed-kr/OFL.txt)을 따릅니다. 공통 글꼴은 `theme.css`의 `--ff-font-primary`와 `--ff-sans`에서 관리합니다. 기존 글꼴로 돌아가려면 `--ff-font-primary`를 `"NanumSquareRound"`로 변경하세요.

- 퀘스트 이름·레벨·분류·선행 관계: [파이널판타지14 한국 공식 가이드 — 주요 퀘스트](https://guide.ff14.co.kr/lodestone/db/quest)
- 임무 이름·레벨·분류: [파이널판타지14 한국 공식 가이드 — 임무](https://guide.ff14.co.kr/lodestone/db/duty)
- PvP 경험치·보상 수치: [FFXIV Console Games Wiki — Series Malmstones](https://ffxiv.consolegameswiki.com/wiki/Series_Malmstones)
- 카드·NPC·획득처: [FFXIV Collect 공개 API](https://ffxivcollect.com/api), 한국어 명칭: [한국어 게임 데이터](https://github.com/Ra-Workspace/ffxiv-datamining-ko), 규칙: [한국 공식 트리플 트라이어드 안내](https://guide.ff14.co.kr/Goldsaucer/tripletriad)
- 글꼴: [LINE Seed KR](https://seed.line.me/index_kr.html), [SIL Open Font License 1.1](./fonts/line-seed-kr/OFL.txt). 보조 글꼴: [네이버 나눔스퀘어라운드](https://hangeul.naver.com/font/nanum), [OFL](./fonts/nanum-square-round/OFL.txt).
- 청마법 목록·습득처: [FFXIV Collect](https://ffxivcollect.com/spells), 체득 안내: [한국 공식 청마도사 가이드](https://guide.ff14.co.kr/job/BlueMage/18?type=E), 한국어 명칭과 수치: [한국어 게임 데이터](https://github.com/Ra-Workspace/ffxiv-datamining-ko)
- 마수도감 이름·장소·항아리 획득처: [한국어·글로벌 게임 데이터](./beastmaster/README.md), 기능과 교환 NPC 위치: [한국 공식 7.56 안내](https://www.ff14.co.kr/news/notice/view/2947)

기재되어있는 회사 명 · 제품명 · 시스템 이름은 해당 소유자의 상표 또는 등록 상표입니다.

© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.

[파이널판타지14 저작물 이용 허락 조건 — 한국 운영정책 10조](https://www.ff14.co.kr/support/policy)를 따릅니다. 공식 가이드에서 가져온 게임 정보와 제3자 글꼴의 권리는 각 권리자에게 있으며, 이 저장소의 공개가 해당 자료에 대한 별도의 자유 이용 허락을 의미하지 않습니다. 권리자의 요청이 있으면 관련 자료의 게재를 중단합니다.

낚시 조건은 [FFXIV Teamcraft 공개 데이터](https://github.com/ffxiv-teamcraft/ffxiv-teamcraft)를 참고하며 [MIT 고지](./fishing-log/licenses/Teamcraft-MIT.txt)를 포함합니다. 어류·작살도감 정렬과 한국어 명칭은 게임 데이터에서 확인합니다. 상세 범위와 고정 리비전은 [어부 수첩 안내](./fishing-log/README.md)에 기록합니다.

## 배포

GitHub Pages의 원본은 `main` 브랜치의 `/ (root)`입니다. 실제 도구는 저장소의 `ffxiv/` 폴더에 있으며, 빌드나 패키지 설치 없이 루트의 `.nojekyll`을 사용해 배포합니다.

검색 등록용 사이트맵은 `https://teo-park.github.io/sitemap.xml`입니다. 루트의 사이트맵 색인에서 이 폴더의 `sitemap.xml`을 참조하며, 루트 `robots.txt`에도 같은 주소를 안내합니다. 새 도구를 공개하면 `ffxiv/sitemap.xml`에 해당 페이지의 대표 주소를 추가합니다.

```text
/
├── index.html
├── theme.css
├── hub.css
├── favicon.svg
├── sitemap.xml
├── msq-tracker/
├── pvp-series-calculator/
├── duty-finder/
├── triple-triad/
├── minions/
├── blue-mage/
├── fishing-log/
├── beastmaster/
└── weapons/
```

검증: `node --test msq-tracker/tests/progress.test.cjs`

PvP 시리즈 계산기 검증: `node --test pvp-series-calculator/tests/pvp-series-calculator.test.js`

임무 초성 사전 검증: `node --test duty-finder/tests/duty-finder.test.cjs`

카드 수첩 검증: `cd triple-triad` 후 `npm ci --ignore-scripts` 및 `npm test` (정적 배포에는 설치·빌드 불필요)

꼬마친구 수첩 검증: `cd minions` 후 `npm ci --ignore-scripts` 및 `npm test`

청마법 수첩 검증: `cd blue-mage` 후 `npm ci --ignore-scripts` 및 `npm test`

어부 수첩 검증: `cd fishing-log` 후 `npm ci --ignore-scripts` 및 `npm test`

마수도감 검증: `cd beastmaster` 후 `npm ci --ignore-scripts` 및 `npm test`

공통 색상·하단 영역은 `theme.css`, 상단 카테고리 메뉴는 `navigation.css`와 `navigation.js`, 도구 목록은 `hub.css`, 각 앱의 작업 화면은 해당 폴더의 `styles.css`에서 관리합니다.

상단 메뉴와 홈은 진행·검색 / 수집·육성 / 어부로 통일합니다. 마수도감과 마수조련사 공략은 수집·육성 아래에 둡니다. 어부 아래에는 어부 가이드(어부 스킬 안내, 터주 유형별 공략)와 낚시 도감(세계를 누비는 어부, 먼바다)을 둡니다. 먼바다의 근해·원양·물고기 도감 바로가기는 그 아래에 유지합니다. 메뉴 항목은 `tools/site-navigation.cjs`에서 관리하며, 저장소 루트에서 `node ffxiv/tools/site-navigation.cjs`를 실행하면 18개 페이지의 정적 메뉴와 공통 파일 참조를 갱신합니다. JavaScript 없이도 카테고리를 열어 이동할 수 있고, JavaScript는 바깥 클릭·Esc 닫기와 방향키 이동을 보완합니다. 검증: `node --test ffxiv/tests/navigation.test.cjs` (먼바다의 개발 의존성 설치 필요).

선택지가 고정된 4항목 이하의 필터·설정은 `select-options.js`와 `select-options.css`의 라디오 그룹으로 표시합니다. 적용할 `select`에만 `data-radio-options`를 붙이며, 원래 select의 값·change 이벤트·양식 제출은 유지합니다. 데이터나 다른 조건에 따라 목록·선택 가능 항목이 바뀌는 지역·미끼·시작 도시 등에는 적용하지 않습니다. 화면이 늦게 생성되는 청마 역할·무투회 필터도 선택지 자체는 고정되어 있어 적용합니다. 검증: `node --test ffxiv/tests/select-options.test.cjs`.

모든 페이지의 본문·숫자·영문·라벨은 네이버 **나눔스퀘어라운드**를 공통으로 사용합니다. [네이버 공식 배포 페이지](https://hangeul.naver.com/font/nanum)의 Regular·Bold·ExtraBold 웹폰트를 `fonts/nanum-square-round/`에 포함해 직접 제공합니다. 원본 파일은 변경하지 않았으며, [저작권 안내와 SIL Open Font License 1.1](./fonts/nanum-square-round/OFL.txt)을 함께 배포합니다. [네이버 라이선스 안내](https://help.naver.com/support/contents/contents.help?serviceNo=1074&categoryNo=3497).

무기 수첩 검증: `cd weapons` 후 `npm ci --ignore-scripts` 및 `npm test`
