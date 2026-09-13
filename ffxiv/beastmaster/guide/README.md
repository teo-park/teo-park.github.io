# 마수조련사 공략

공개 주소: https://teo-park.github.io/ffxiv/beastmaster/guide/

홈과 공통 상단 메뉴의 **수집·육성**에서 마수도감과 함께 제공합니다.

## 편집 기준

공식 직업 안내와 해외 공략·본인 플레이 기록을 직접 확인해 필요한 사실과 운영 팁을 한국어로 짧게 요약합니다. 한국어 글은 원 출처를 찾는 단서로만 사용할 수 있으며, 한국 블로그의 번역문·편집을 재사용하지 않습니다. 각 카드에 실제 참고한 원문을 연결합니다. 기사 전체 번역, 공략 이미지·영상·댓글의 복제나 실시간 수집은 하지 않습니다.

공식 규칙, 공략 작성자의 추천, 플레이어 달성 제보를 화면에서 구분합니다. Lodestone 개인 일기를 공식 공략으로 표시하지 않습니다. 제보 조합을 최적 조합이나 모든 난도의 확정 공략으로 일반화하지 않습니다.

한국어 마수 이름·기술명·도감 번호 연결은 기존 마수도감 게임 데이터로 대조합니다. 시련·적 이름은 같은 버전의 `PlaceName`·`BNpcName` 한국어 데이터로 확인합니다. 마수 이름은 `../#beast-번호`로 연결해 획득처를 열며, 이 페이지는 보유 기록을 변경하지 않습니다.

## 출처 관리

각 카드의 `data-source`는 [sources.json](./sources.json)의 원문 URL·작성자·언어·근거 종류와 연결합니다. `checkedAt`은 직접 확인한 날짜이며, 확인되는 경우에만 원문 발행일·갱신일을 별도로 기록합니다.

- [레벨링](https://game8.jp/ff14/814100): 30레벨 이후 시련장 경험치 안내. 경험치 비율은 원문 관측 예시이며 고정 보상이 아닙니다.
- [첫 번째 시련](https://game8.jp/ff14/815038): 사마귀·땅벌·자유 자리 편성, 전투 준비와 생존.
- [두 번째 시련](https://game8.jp/ff14/815368): 독 편성, 독 면역 구간, 점수와 보상.
- [세 번째 시련](https://game8.jp/ff14/815556): 구간별 역할·기믹 대응 후보. 일본어 다이아마이트는 한국어 도감의 거미전갈(No.8)로 연결합니다.
- [공식 직업 안내](https://na.finalfantasyxiv.com/jobguide/beastmaster/): 회복·먹이·동행 마수 성장·점수 규칙.
- [Icy Veins 아이템](https://www.icy-veins.com/ffxiv/beastmaster-crucible-of-the-unbroken-items): 효과 선택 기준.
- [Icy Veins 전투 운영](https://www.icy-veins.com/ffxiv/beastmaster-pve-dps-rotation-openers-abilities): 빌리기·연계·교대 주의점.
- [Ivy Itk의 개인 기록](https://jp.finalfantasyxiv.com/lodestone/character/55090234/blog/5725219/): 첫 번째 시련 전설 반복 사례.
- [Reddit 본인 달성 제보](https://www.reddit.com/r/ffxiv/comments/1wen5v5/legendary_on_all_5_boards/): Intelligent_Creme_39와 MiniMumbo의 편성. 다른 댓글 작성자의 조합을 게시자 조합으로 섞지 않습니다.
- [Slanius Pulszky의 두 번째 시련 기록](https://na.finalfantasyxiv.com/lodestone/character/53005800/blog/5724923/): 추가 적·미노타우로스 대응. 저자가 추측으로 남긴 좀비 대상 제어나 고정 기술 순서는 확정 공략으로 옮기지 않습니다.
- [Jets-Down-049222의 첫·두 번째 전설 기록](https://www.reddit.com/r/ffxiv/comments/1wcph60/got_my_1st_2_legendary_rank_on_boards_bst_crucible/): 본인 댓글의 편성과 두 번째 시련 경로. 장비 전제와 회복 아이템 사용을 함께 표시합니다.
- [Mic Fc의 세 번째 시련 기록](https://jp.finalfantasyxiv.com/lodestone/character/18824631/blog/5724975/): 전설 도전용 연습 메모. 작성자의 전설 달성 인증으로 표시하지 않습니다.
- [Da Da의 특급 시련 기록](https://forum.gamer.com.tw/C.php?bsn=17608&snA=31522&tnum=2): 1층·2층 글의 중국어 번체 운영 메모를 직접 요약했습니다. 영상은 원문에서 참고하도록 안내하며 영상을 시청·검증한 것으로 표시하지 않습니다.
- [Reddit 점수 경계 토론](https://www.reddit.com/r/ffxiv/comments/1wdvlwo/psa_master_boards_are_not_17500_for_legendary/): 특급 시련의 엇갈리는 추정과 보너스 개수 반례. 일반 세 시련의 17,500점 제보는 기존 다섯 시련 게시글을 연결합니다. 숫자는 확정 커트라인이나 모든 난도의 공통 기준으로 사용하지 않습니다.
- [한국어 보너스 데이터](https://github.com/Ra-Workspace/ffxiv-datamining-ko/blob/66eceba69eb2398958bdb133b241a69c13672b6c/csv/XBMScoreBonus.csv): 보너스 이름과 조건을 요약합니다. `XBMContent`의 미해석 숫자 열에서 등급 기준이나 배점을 추정해 게시하지 않습니다. 실제 시련별 제공 항목은 게임 내 보너스 화면을 우선하도록 안내합니다.

2026-09-14에 공식 안내·Icy Veins·해외 플레이 기록을 추가했습니다. Game8 기존 요약은 2026-09-12 확인본을 유지하며, 두 번째·세 번째 시련 기사는 09-14 재확인했습니다. 두 번째 시련의 주요 기믹과 일반 세 시련·특급 두 시련의 전설 도전 팁을 추가했습니다. Icy Veins의 시련별 상세 공략 페이지는 아직 작성 예정 상태여서 구간별 공략 근거로 사용하지 않았습니다. 전설 등급 안내에는 총점 평가 방식, 시련별 점수 제보의 한계, 선택할 보너스 조건을 구분합니다. 최속 육성 순위와 미검증 추가 난도별 절차는 제시하지 않습니다.

## 동작과 검증

`#leveling`, `#rank`, `#legendary`와 기존 `#starter-team` 링크를 유지합니다. 정적 HTML은 스크립트를 끄면 세 항목이 모두 보이고, `guide.js`가 탭과 뒤로 가기를 지원합니다.

상단 시련별 바로가기는 일반 세 시련의 기본 공략과 특급 두 시련의 전설 공략으로 연결합니다. 전설 탭에서도 다섯 시련별 바로가기를 제공합니다. `#legendary-first-board`, `#legendary-second-board`, `#legendary-third-board`, `#legendary-master-first`, `#legendary-master-second`가 해당 카드로 연결되고, `#legendary-shared-team`은 공통 편성 사례입니다. 숨겨진 탭의 항목을 열고 나서 해당 카드로 스크롤·초점을 이동합니다.

`#legendary-conditions`는 전설 평가 방식, `#legendary-score-reports`는 점수 참고선, `#legendary-bonuses`는 보너스 조건으로 연결합니다. 숫자 추정·한국어 게임 데이터·공식 안내에 각각 근거 표시와 출처를 둡니다.

검증: 저장소 루트에서 `node --test ffxiv/tests/navigation.test.cjs`, `cd ffxiv/beastmaster` 후 `npm test`. 검토한 원문 링크, 플레이어 사례 표시, 마수 이름·도감 번호와 탭 동작을 검증합니다.
