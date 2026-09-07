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

## 출처 및 권리 안내

- 퀘스트 이름·레벨·분류·선행 관계: [파이널판타지14 한국 공식 가이드 — 주요 퀘스트](https://guide.ff14.co.kr/lodestone/db/quest)
- 임무 이름·레벨·분류: [파이널판타지14 한국 공식 가이드 — 임무](https://guide.ff14.co.kr/lodestone/db/duty)
- PvP 경험치·보상 수치: [FFXIV Console Games Wiki — Series Malmstones](https://ffxiv.consolegameswiki.com/wiki/Series_Malmstones)
- 카드·NPC·획득처: [FFXIV Collect 공개 API](https://ffxivcollect.com/api), 한국어 명칭: [한국어 게임 데이터](https://github.com/Ra-Workspace/ffxiv-datamining-ko), 규칙: [한국 공식 트리플 트라이어드 안내](https://guide.ff14.co.kr/Goldsaucer/tripletriad)
- 글꼴: [네이버 나눔스퀘어라운드](https://hangeul.naver.com/font/nanum), [SIL Open Font License 1.1](./fonts/nanum-square-round/OFL.txt)
- 청마법 목록·습득처: [FFXIV Collect](https://ffxivcollect.com/spells), 체득 안내: [한국 공식 청마도사 가이드](https://guide.ff14.co.kr/job/BlueMage/18?type=E), 한국어 명칭과 수치: [한국어 게임 데이터](https://github.com/Ra-Workspace/ffxiv-datamining-ko)

기재되어있는 회사 명 · 제품명 · 시스템 이름은 해당 소유자의 상표 또는 등록 상표입니다.

© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.

[파이널판타지14 저작물 이용 허락 조건 — 한국 운영정책 10조](https://www.ff14.co.kr/support/policy)를 따릅니다. 공식 가이드에서 가져온 게임 정보와 제3자 글꼴의 권리는 각 권리자에게 있으며, 이 저장소의 공개가 해당 자료에 대한 별도의 자유 이용 허락을 의미하지 않습니다. 권리자의 요청이 있으면 관련 자료의 게재를 중단합니다.

## 배포

GitHub Pages의 원본은 `main` 브랜치의 `/ (root)`입니다. 실제 도구는 저장소의 `ffxiv/` 폴더에 있으며, 빌드나 패키지 설치 없이 루트의 `.nojekyll`을 사용해 배포합니다.

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
└── blue-mage/
```

검증: `node --test msq-tracker/tests/progress.test.cjs`

PvP 시리즈 계산기 검증: `node --test pvp-series-calculator/tests/pvp-series-calculator.test.js`

임무 초성 사전 검증: `node --test duty-finder/tests/duty-finder.test.cjs`

카드 수첩 검증: `cd triple-triad` 후 `npm ci --ignore-scripts` 및 `npm test` (정적 배포에는 설치·빌드 불필요)

꼬마친구 수첩 검증: `cd minions` 후 `npm ci --ignore-scripts` 및 `npm test`

청마법 수첩 검증: `cd blue-mage` 후 `npm ci --ignore-scripts` 및 `npm test`

공통 색상·상단 메뉴·하단 영역은 `theme.css`, 도구 목록은 `hub.css`, 각 앱의 작업 화면은 해당 폴더의 `styles.css`에서 관리합니다.

모든 페이지의 본문·숫자·영문·라벨은 네이버 **나눔스퀘어라운드**를 공통으로 사용합니다. [네이버 공식 배포 페이지](https://hangeul.naver.com/font/nanum)의 Regular·Bold·ExtraBold 웹폰트를 `fonts/nanum-square-round/`에 포함해 직접 제공합니다. 원본 파일은 변경하지 않았으며, [저작권 안내와 SIL Open Font License 1.1](./fonts/nanum-square-round/OFL.txt)을 함께 배포합니다. [네이버 라이선스 안내](https://help.naver.com/support/contents/contents.help?serviceNo=1074&categoryNo=3497).
