# 먼바다 낚시 개인용 수정판

직접 주소로 사용하는 근해·원양 항로 페이지입니다. 포털 메뉴와 사이트맵에 연결하지 않으며 HTML에 `noindex, nofollow, noarchive`를 표시합니다. 접근 제한은 없으므로 주소를 알면 누구나 볼 수 있습니다.

## 변경점

- 나눔스퀘어라운드, 기본 13px 글자, 물고기 아이콘 30px, 좁은 표 여백.
- 항로의 물고기 행에서 잡음 체크와 해제, 잡은 물고기 숨기기.
- 직감·생미끼 의존 관계를 따라 필요한 물고기를 계속 표시하고 `조건용`으로 설명.
- 목표를 잡으면 불필요해진 조건 물고기도 숨김. 같은 어종의 여러 행은 함께 처리.
- 근해·원양 체크를 브라우저에 저장하고 같은 출처의 탭 간 변경을 반영.
- 원본 데이터·항로 계산을 유지하며 외부 분석 스크립트는 사용하지 않음.

원본 사이트와 출처가 달라 원본 사이트의 브라우저 저장값은 자동으로 이전되지 않습니다.

## 출처

- [OceanFishing.Boats](https://oceanfishing.boats/about/) / [원본 저장소](https://github.com/netsua92/OceanFishing)
- 기준 원본 커밋: `bbd67f90ed0285aa8e23d8f92f7f4d4c234441a2` (2026-09-07에 확인)
- 데이터·설명: Tyo'to Tayuun, 원본 개발: Xina Apella, 시간표: Donut Steel, 한국어 번역: 수리비용. 기타 제작진은 원본 About 참고.
- 게임 자산: © SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.
- 글꼴: 네이버 나눔스퀘어라운드. 상위 도구함의 글꼴과 OFL 라이선스를 사용합니다.

원본 저장소에서 별도 재사용 라이선스는 확인되지 않았습니다. 이 수정판은 원본과 제3자 자산에 새로운 이용 허락을 부여하지 않습니다. 원본 라이브러리의 저작권·라이선스 주석은 유지합니다.

## 관리

`scripts/collection.js`는 의존 관계와 저장 상태, `collection-ui.js`는 체크·숨김 UI, `css/compact.css`는 크기와 간격을 담당합니다. 원본 `displayStops.js`와 `gFuncs.js`에 표시 연결부가 있습니다. 원본 행은 표시하면서 수정되므로 다시 그릴 때 항상 `cleanedDataObjBK`의 복사본을 사용합니다.

`fishdata/`의 한국어 CSV는 현재 시점의 복사본입니다. 데이터 갱신 후 다음 명령으로 직감·생미끼 참조를 확인하세요.

```sh
node --test ffxiv/ocean-fishing/tests/collection.test.cjs
```
