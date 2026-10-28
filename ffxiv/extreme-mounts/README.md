# 극 토벌전 탈것 수첩

신생·창천·홍련·칠흑·효월·황금의 극 토벌전 탈것을 확장팩별로 체크합니다. 한국어 탈것·소환 아이템·임무·보상 퀘스트 이름을 사용하며 초성·영문·획득처 검색과 미수집·보유·같이하기 필터를 제공합니다.

| 확장팩 | 필수 극 탈것 | 완성 보상 | 추가 탈것 |
| --- | ---: | --- | --- |
| 신생 | 6종 | 기린 | 나이트메어 |
| 창천 | 7종 | 봉황 | — |
| 홍련 | 7종 | 구미호 | 리오레우스 |
| 칠흑 | 7종 | 렌더바페 | — |
| 효월 | 7종 | 바하무트 아포크리파 | — |
| 황금 | 7종 | 유산의 날개 | 야옹수레 |

필수 41종·완성 보상 6종·추가 3종, 총 50종입니다. 추가 탈것은 완성 보상 조건에서 제외합니다. 보상은 필수 탈것을 모으고 해당 퀘스트를 완료한 뒤 직접 체크합니다. 필수 조건을 채워도 보상 체크는 자동으로 변경하지 않습니다. 퀘스트의 추가 선행 조건·아이템 사용 여부는 게임과 공식 가이드를 확인하세요.

기본 기록은 `teo-ffxiv.extreme-mounts.collection.v1`에 `{type:'ffxiv-extreme-mounts', schemaVersion:1, collected:[Collect 탈것 ID]}` 형식으로 저장합니다. 같이하기는 공통 `teo-ffxiv.collection-wishes.v1`의 `mounts`에 저장합니다. 미래 ID도 보존하고 현재 현황의 분모에는 포함하지 않습니다. 기록 관리에서 수집·같이하기 백업을 내보내고 가져올 수 있으며, 가져오기는 기본적으로 합칩니다. 교체는 직접 선택해야 합니다.

[부대 수집방](../collection-room/)과 체크·해제·같이하기를 동기화합니다. 수집방에는 확장팩 필터와 부대원별 필수 수집률도 표시합니다. **기존 방은 공유 설정에서 ‘극 탈것’을 선택해야 공유됩니다.** 새 수첩이 추가되어도 기존 공유 선택은 자동으로 켜지지 않습니다. [서버·권한 안내](../../services/collection-rooms/README.md).

자료는 [FFXIV Collect Mounts API](https://ffxivcollect.com/api/mounts)와 [한국어 게임 데이터](https://github.com/Ra-Workspace/ffxiv-datamining-ko)의 Mount·Item·ContentFinderCondition·Quest에서 가져옵니다. 응답의 SHA-256과 한국어 커밋은 `data.json`에 기록합니다. 황금 7종과 완성 퀘스트는 [한국 공식 7.5 패치노트](https://www.ff14.co.kr/news/notice/view/2865)와 대조했습니다. 원본 소프트웨어의 [FFXIV Collect MIT 고지](../triple-triad/licenses/ffxiv-collect-MIT.txt)를 따르며, 게임 이름·이미지의 권리는 SQUARE ENIX에 있습니다. 게임의 긴 설명·대사·세계관 문장은 배포하지 않습니다.

`manifest.json`에서 필수·보상·추가 ID를 관리합니다. 갱신기는 누락된 한국어 이름·획득처·퀘스트와 중복을 검사합니다.

```powershell
node ffxiv/extreme-mounts/scripts/update-data.mjs
node ffxiv/tools/collection-catalog.cjs
node --test ffxiv/extreme-mounts/tests/*.test.cjs
```

`--refresh`를 붙이면 공개 원본을 다시 다운로드합니다. 캐시는 루트 `.cache/extreme-mounts/`에만 보관합니다. UI 테스트는 기존 `ffxiv/ocean-fishing/node_modules/jsdom`을 사용합니다. 없으면 해당 폴더에서 `npm ci --ignore-scripts`를 실행합니다.
