# 꼬마친구 수첩

공개 주소: <https://teo-park.github.io/ffxiv/minions/>

아이콘을 눌러 여러 꼬마친구의 보유 상태를 빠르게 기록합니다. 한국어·초성·영문·획득처 검색, 보유/미수집·획득 경로·확장팩·거래 가능 필터와 게임 분류순·이름순·패치순 정렬을 제공합니다. 한 번에 48종·96종·전체를 볼 수 있습니다.

체크하는 동안 아이콘 위치를 유지합니다. 미수집/보유 필터에서 체크가 바뀌면 **체크 반영해 목록 정리**로 목록을 갱신합니다. **이 페이지 모두 보유**는 지금 보이는 페이지에만 적용하며 최근 25번의 변경을 실행 취소할 수 있습니다. 획득처 버튼은 모든 공개 획득 경로·조건·한국 공식 링크를 보여줍니다. 게임 캡처 인식이나 계정 자동 연동은 포함하지 않습니다.

## 데이터 범위

2026-09-07 조회한 [FFXIV Collect 공개 API](https://ffxivcollect.com/api/minions)의 **583종·895개 획득 경로**를 포함합니다. 583종 전체에 한국어 게임 명칭을 ID로 연결하고 한국 공식 아이템 상세 페이지 561종을 연결했습니다. 나머지는 명시적으로 공식 가이드 검색 링크를 제공합니다. 미드가르드오름처럼 소환이 직접 해금되는 꼬친도 있으므로 아이템 상세 페이지 미연결을 국내 미출시로 판단하지 않습니다.

- 전체 수집률의 분모는 이 공개 목록입니다. **한국 서버에서 현재 획득할 수 있는 종 수를 뜻하지 않습니다.** 글로벌 상품·이벤트 일정·패치·거래 정보는 한국 운영과 다를 수 있으며 공식 안내를 함께 확인해야 합니다.
- 한국어 이름·게임 분류순은 한국어 `Companion` 시트의 같은 행 ID를 사용합니다. 획득처의 NPC·지역·임무·퀘스트·아이템은 한국어/영문 시트를 같은 ID로 연결합니다.
- 무료 서술형 획득 정보는 한국어 용어와 짧은 문구로 치환하고 원문을 함께 보존합니다. 상품명·일부 고유 명칭은 영어로 남습니다. 획득처별 **획득처 원문**에서 원본을 확인할 수 있습니다.
- 현재 공개 자료에서 경로가 비어 있는 **코트르 인형·자동인형 적색 바이킹·빈센트 인형**은 ‘획득처 확인 중’으로 표시합니다. 드롭 확률이나 자료에 없는 선행 조건을 추측하지 않습니다.
- ‘유료·이벤트 외 획득처 있음’ 필터는 적어도 하나의 일반 획득 경로가 있는 대상을 남깁니다. 현재 즉시 획득 가능 여부를 판정하는 필터가 아닙니다. 거래 가능 정보는 공개 자료 기준이며 장터 가격·매물은 수집하지 않습니다.
- 게임 장문 설명·대사·공방전 스킬 설명은 포함하지 않습니다. 이미지 파일은 저장소에 복제하지 않고 공개 API의 이미지 URL로 표시합니다. 이미지 제공이 중단되면 이름 첫 글자로 대체하고 수집 기능은 유지합니다.

출처:

- [FFXIV Collect 꼬마친구](https://ffxivcollect.com/minions), [공개 API](https://ffxivcollect.com/api/minions)
- [한국어 게임 시트](https://github.com/Ra-Workspace/ffxiv-datamining-ko), [영문 게임 시트](https://github.com/xivapi/ffxiv-datamining). 사용한 커밋 주소는 `data.js`의 `source`에 기록합니다.
- [한국 공식 가이드 꼬마 친구 분류](https://guide.ff14.co.kr/lodestone/db/item?category2=7&category3=85), [공식 꼬마친구 안내](https://guide.ff14.co.kr/lodestone/playguide/view/162)
- 이미지: 공개 API가 제공하는 [XIVAPI](https://v2.xivapi.com/)의 게임 아이콘.

## 수집 기록과 백업

서버에 수집 기록을 보내지 않으며 브라우저의 `teo-ffxiv.minions.collection.v1` 키에 저장합니다. 카드·낚시 기록과 분리됩니다. 다른 브라우저·기기에는 기록이 공유되지 않으므로 기록 관리에서 JSON을 내보내고 가져옵니다.

```json
{
  "type": "ffxiv-minions",
  "schemaVersion": 1,
  "exportedAt": "2026-09-07T00:00:00.000Z",
  "collected": [1, 3, 9]
}
```

숫자는 아이템 ID나 화면 순번이 아닌 **Companion/Collect 꼬마친구 ID**입니다. 다른 수집 도구의 단순 숫자 배열은 받지 않습니다. 가져오기는 전체 파일 검증 후 기존 기록과 합치며, 현재 목록에 없는 향후 ID도 보존합니다. 기록을 읽거나 저장하지 못하면 기존 기록을 덮어쓰지 않습니다. 저장 실패 시 화면에 성공으로 표시하지 않습니다. 외부 탭의 변경도 반영하고, 여러 탭 사용 시 최신 저장값에 변경분만 적용합니다.

## 개발·갱신

정적 HTML/CSS/JavaScript이므로 GitHub Pages 배포 시 빌드나 설치가 필요 없습니다. 로컬 확인은 저장소 루트에서 HTTP 서버를 열고 `/ffxiv/minions/`에 접속합니다.

```sh
# 저장소 루트, Node.js 20 이상
node ffxiv/minions/scripts/update-data.mjs --refresh
cd ffxiv/minions
npm ci --ignore-scripts
npm test
```

갱신기는 카드 도구에서 이미 사용하는 CSV/HTML 파서만 재사용합니다. `--refresh` 없이 실행하면 `.cache/minions/`와 같은 커밋의 기존 `.cache/triple-triad/` 자료를 재사용합니다. API 수량·중복 ID·한국어 이름·공식 가이드 분류·페이지 중복·획득 경로 유형을 확인하고, 연결하지 못한 공식 링크와 잔여 영어를 `.cache/minions/translation-review.json`에 남깁니다. 새 데이터는 결과를 검토한 후 커밋합니다.

테스트는 데이터 완전성, 초성 검색, 조합 필터, 빠른 체크의 위치 유지, 페이지 단위 일괄 체크/취소, 조합 중 한글 검색, 상세 화면 동기화, 잘못된 백업·저장 실패·다른 탭 변경·미래 ID 보존을 확인합니다.

## 권리 표시

무료·비영리 팬 제작 도구입니다. 광고·후원·유료 기능이나 계정 연동이 없습니다. SQUARE ENIX 및 액토즈소프트의 승인·제휴를 의미하지 않습니다.

기재되어있는 회사 명 · 제품명 · 시스템 이름은 해당 소유자의 상표 또는 등록 상표입니다.

© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.

[FFXIV Collect MIT 라이선스](../triple-triad/licenses/ffxiv-collect-MIT.txt)(Copyright 2019 Matt Antonelli)를 보존합니다. 프로젝트 코드의 라이선스가 게임 이미지·명칭의 권리를 부여하는 것은 아닙니다. 글꼴은 [네이버 나눔스퀘어라운드](https://hangeul.naver.com/font/nanum), [SIL OFL](../fonts/nanum-square-round/OFL.txt)입니다. [한국 저작물 이용 허락 조건](https://www.ff14.co.kr/support/policy)을 안내하며 권리자의 요청이 있으면 관련 자료의 게재를 중단합니다.
