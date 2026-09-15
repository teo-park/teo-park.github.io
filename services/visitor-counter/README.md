# 비공개 조회 통계

프로젝트 `teo-ffxiv-counter` / 소유 계정 `teo.ffxiv.kr@gmail.com` / Spark 무료 요금제 / Realtime Database 싱가포르.

관리자 주소: `https://teo-park.github.io/ffxiv/counter-admin/`
메뉴·포털·사이트맵에 링크하지 않고 `noindex,nofollow,noarchive`를 적용한다. 주소와 소스는 공개 저장소에서 발견할 수 있지만 보안은 Firebase 규칙으로 강제한다.

## 접근 권한

Google 로그인 후 검증된 이메일 `teo.ffxiv.kr@gmail.com`과 `firebase.sign_in_provider === 'google.com'`이 모두 맞아야 `counters`와 `visits`를 읽을 수 있다. 클라이언트 검사는 UI용이며 DB 규칙이 최종 권한을 결정한다. 로그인은 브라우저 세션에만 유지한다. 로그아웃 즉시 화면과 진행 중인 이전 응답을 지운다. 통계는 별도 로컬 저장소에 캐시하거나 Git에 기록하지 않는다.
웹 Firebase 설정(apiKey, authDomain, appId)은 공개 설정이며 관리자 비밀키가 아니다. 서비스 계정 키와 관리자 토큰을 저장소에 넣지 않는다.

## 집계

기존 `counters/<page>`는 읽기 전용 기준값으로 보존한다. 새 방문은 `visits/<등록된 page>/<매번 새로운 128-bit 무작위 ID>: true`를 추가한다. 일반 방문자는 기존 값·총계·다른 기록을 읽을 수 없다. 삭제·덮어쓰기·임의 경로·숫자·객체·priority 입력을 차단한다. 쓰기 응답은 `true`만 포함한다. 숫자 카운터에 직접 increment를 허용하면 읽기 권한을 막아도 쓰기 응답으로 총계가 노출되므로 사용하지 않는다.
관리자는 기준값 + 새 기록 수를 합산한다. 일반 페이지는 UI와 DB 읽기 없이 기록만 전송한다.

같은 브라우저의 같은 페이지는 30분에 한 번 집계한다. 근해·원양의 이전 URL은 먼바다로 합산한다. 관리자·localhost·PiP·내부 탭·검색·해시 변경은 집계하지 않는다. 비활성 탭은 처음 표시될 때 집계한다. DNT/GPC 또는 저장소 사용 불가 시 기록하지 않는다. 네트워크 응답 유실 시 중복 방지를 위해 자동 재시도하지 않는다.

고유 방문자 수가 아니다. 기기 간 중복, 저장소 삭제, 봇·직접 반복 API 요청까지 구별하지 못한다. 강력한 남용 방지에는 별도 서버와 요청 제한이 필요하다.
이벤트에는 이메일·IP·수집 데이터·검색어를 넣지 않는다. 무작위 ID는 사람이나 브라우저를 식별하는 ID가 아니다. Firebase 자체 인증 및 네트워크 처리는 서비스 정책을 따른다.

## 운영

인증 도메인: `teo-park.github.io` 및 Firebase 기본 인증 도메인. Google Analytics, 유료 플랜, 서버 함수는 사용하지 않는다.
방문 기록은 누적되므로 Firebase 사용량 화면에서 저장량·다운로드량을 확인한다. 관리자 로그인과 수동 새로고침 때 통계를 읽는다. 기록이 커지면 관리자 권한 서버 집계/아카이브를 별도 설계해야 한다. 자동 유료 전환이나 기록 삭제는 하지 않는다.

```sh
node ffxiv/tools/visitor-counter.cjs
node ffxiv/tools/site-navigation.cjs
node --test ffxiv/tests/visitor-counter.test.cjs ffxiv/tests/counter-admin.test.cjs ffxiv/tests/navigation.test.cjs
```

새 페이지 추가 시 생성된 `database.rules.json`을 Firebase Console → Realtime Database → 규칙에 게시하고 사이트를 배포한다. 기존 기준값과 방문 기록은 유지한다.

[Google 로그인](https://firebase.google.com/docs/auth/web/google-signin) · [DB 보안 규칙](https://firebase.google.com/docs/database/security) · [요금제](https://firebase.google.com/docs/database/usage/billing)

## 선택한 게임 데이터 ID 통계

`selections/<종류>/<게임 ID>/<매번 새로운 128-bit 무작위 ID>: true`만 기록한다. 서버에 검색문·검색 결과 목록·수집 여부·사용자 ID·클라이언트 시각·페이지/세션 연결키를 저장하지 않는다. 관리자 화면은 공개 `selection-catalog.json`에서 ID의 이름을 찾아 종류별 상위 50개와 전체 선택 횟수를 보여준다. 이는 선택 횟수이며 검색량이나 고유 사용자 수가 아니다. 한 사람의 여러 항목을 연결할 수 있는 식별자를 만들지 않는다. 전송 과정에서 Firebase가 처리하는 네트워크 정보까지 없다는 뜻은 아니다.

집계 동작: 메인 퀘스트 결과 선택(Enter 포함), 임무 공식 가이드 링크, 카드·꼬마친구·청마법·마수 상세보기, 세누어 상세/조건 펼치기, 먼바다 물고기 도감의 출항 5회 펼치기. 무기 단계·수집 체크·선호 필터·단순 검색·자동 표시·접기는 제외한다. 세누어와 먼바다의 같은 물고기는 같은 아이템 ID로 합산한다. 원시 입력을 읽지 않고 실제 UI 조작에서 확인한 ID를 카탈로그로 검증한다.

같은 브라우저/종류/ID는 30분에 한 번만 기록한다. 마지막 집계 시각은 브라우저에만 저장한다. Web Locks로 탭 간 중복을 줄이고 통신 실패 시 자동 재시도하지 않는다. DNT/GPC와 `ffxiv-usage-stats-disabled` 설정을 방문/선택 집계 모두에서 존중한다. 공통 하단의 ‘이용 통계 안내’에서 이 브라우저의 집계를 끄고 켤 수 있다. 다른 기기에는 이 설정이 전달되지 않는다.

보안 규칙은 생성 당시 카탈로그에 등록된 종류와 정확한 ID만 허용하며 공개 조회·변경·삭제·자유 텍스트·숫자 카운터를 차단한다. Firebase 정규식 컴파일 한도 때문에 허용 목록을 32개씩 나눠 검증한다. 새 게임 데이터를 추가할 때 `node ffxiv/tools/visitor-counter.cjs`를 실행하고 규칙을 다시 게시해야 집계된다. 게임 데이터 업데이트 전후로 이름이 바뀌어도 ID가 같으면 합산한다.

선택 집계 검증: `node --test ffxiv/tests/selection-counter.test.cjs ffxiv/tests/counter-admin.test.cjs ffxiv/tests/visitor-counter.test.cjs ffxiv/tests/navigation.test.cjs`.
