# 마수조련사 공략

공개 주소: https://teo-park.github.io/ffxiv/beastmaster/guide/

홈과 공통 상단 메뉴의 **마수조련사** 아래에서 마수도감과 함께 제공합니다.

- `#leveling`: 30~49레벨 시련장 진행. 실잠자리 등 50레벨 포획·교환 마수를 기본 편성으로 요구하지 않습니다.
- `#rank`: 50레벨 이후 마수 랭크 육성. 순위표 랭킹과 구분하며, 주력+육성 자리 편성은 공개 클리어 편성과 공식 성장 규칙을 조합한 제안입니다. 시간당 경험치를 실측한 최적 경로가 아닙니다.
- `#legendary`: 전설 평가 달성 사례. 기본 교대와 시련별 예외, 상점·아이템을 사용하는 사례를 구분합니다.

내용은 2026-09-12에 확인한 패치 7.56 자료를 요약했습니다. 각 편성에 원문과 클리어 영상(해당 시련의 시작 시각)을 연결합니다. 원문 전체·동영상·댓글을 복제하지 않습니다. 이용자 점수를 전설 평가의 공통 최소 점수로 해석하지 않습니다.

## 출처

- 한국 공식 [잡 가이드](https://guide.ff14.co.kr/job/BeastMaster/34?type=E), [7.56 패치노트](https://www.ff14.co.kr/news/notice/view/2947): 공식 기술명·시련장 성장·점수 규칙.
- Game8 [첫 번째](https://game8.jp/ff14/815038) / [두 번째](https://game8.jp/ff14/815368) / [세 번째 시련](https://game8.jp/ff14/815556): 기본 편성과 독 면역·기믹 대응.
- ルプス [첫 번째~세 번째](https://www.youtube.com/watch?v=67UMHF4B1Ws) / [특급 시련](https://www.youtube.com/watch?v=9Quje7ZkO3Q): 전설 평가 달성 영상과 작성자 설명.
- Reddit [시체강 사례](https://www.reddit.com/r/ffxiv/comments/1wcph60/got_my_1st_2_legendary_rank_on_boards_bst_crucible/) / [백수강 사례](https://www.reddit.com/r/ffxiv/comments/1wc0st4/psa_you_can_get_the_new_hairstyle_as_a_drop/): 대체 편성과 달성 조건 제보.
- 한국어 [공략 모음](https://ffxiv-fudge.com/7-56-bst/).
- [마수도감 데이터 출처](../README.md): 한국 마수 이름·분류·기술·포획 및 교환 조건. 한국어 `ContentFinderCondition`의 1088~1092는 첫 번째~세 번째 시련과 첫 번째·두 번째 **특급 시련**입니다.

## 동작과 검증

정적 HTML에 모든 공략이 있어 스크립트를 끄면 세 항목이 모두 보입니다. `guide.js`는 목적에 따라 표시를 바꾸고 URL 조각·뒤로 가기·새로고침을 지원합니다. 수집 기록을 읽거나 저장하지 않습니다.

마수 링크는 `../#beast-44`처럼 도감 번호를 사용하며 도감의 `app.js`가 데이터를 불러온 뒤 상세 획득처를 엽니다. 링크 진입·닫기는 수집 기록이나 검색 필터를 바꾸지 않습니다.

검증: 저장소 루트에서 `node --test ffxiv/tests/navigation.test.cjs`, `cd ffxiv/beastmaster` 후 `npm test`.
