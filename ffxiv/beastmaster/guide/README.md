# 마수조련사 공략

공개 주소: https://teo-park.github.io/ffxiv/beastmaster/guide/

홈과 공통 상단 메뉴의 **수집·육성**에서 마수도감과 함께 제공합니다.

## 편집 기준

공식 직업 안내와 해외 공략·본인 플레이 기록을 직접 확인해 필요한 사실과 운영 팁을 한국어로 짧게 요약합니다. 한국어 글은 원 출처를 찾는 단서로만 사용할 수 있으며, 한국 블로그의 번역문·편집을 재사용하지 않습니다. 각 카드에 실제 참고한 원문을 연결합니다. 기사 전체 번역, 공략 이미지·영상·댓글의 복제나 실시간 수집은 하지 않습니다.

공식 규칙, 공략 작성자의 추천, 플레이어 달성 제보를 화면에서 구분합니다. Lodestone 개인 일기를 공식 공략으로 표시하지 않습니다. 제보 조합을 최적 조합이나 모든 난도의 확정 공략으로 일반화하지 않습니다.

한국어 마수 이름·기술명·도감 번호 연결은 기존 마수도감 게임 데이터로 대조합니다. 마수 이름은 `../#beast-번호`로 연결해 획득처를 열며, 이 페이지는 보유 기록을 변경하지 않습니다.

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

2026-09-14에 공식 안내·Icy Veins·해외 플레이 기록을 추가했습니다. Game8 기존 요약은 2026-09-12 확인본을 유지하며, 세 번째 시련 기사는 09-14 재확인했습니다. Icy Veins의 시련별 상세 공략 페이지는 아직 작성 예정 상태여서 구간별 공략 근거로 사용하지 않았습니다. 시련 공통 전설 최소 점수, 최속 육성 순위, 미검증 추가 난도별 절차는 제시하지 않습니다.

## 동작과 검증

`#leveling`, `#rank`, `#legendary`와 기존 `#starter-team` 링크를 유지합니다. 정적 HTML은 스크립트를 끄면 세 항목이 모두 보이고, `guide.js`가 탭과 뒤로 가기를 지원합니다.

검증: 저장소 루트에서 `node --test ffxiv/tests/navigation.test.cjs`, `cd ffxiv/beastmaster` 후 `npm test`. 검토한 원문 링크, 플레이어 사례 표시, 마수 이름·도감 번호와 탭 동작을 검증합니다.
