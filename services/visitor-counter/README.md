# 사이트 조회 카운터

Firebase 프로젝트: `teo-ffxiv-counter` (Teo FFXIV Counter)
소유 계정: `teo.ffxiv.kr@gmail.com`. Spark 무료 요금제, Realtime Database 싱가포르 리전.
Google Analytics, Authentication, 결제 연결, 서버 함수는 사용하지 않는다.

## 집계 의미

- 공개 `/ffxiv/` 페이지 하단에 전체 조회·현재 페이지 조회와 접을 수 있는 페이지별 목록을 표시한다.
- 같은 origin의 같은 브라우저에서 같은 페이지는 30분에 한 번 집계한다. 개인별 고유 방문자 수가 아니다.
- 전체 조회는 등록된 페이지 카운터의 합계다. 근해·원양의 이전 URL은 먼바다로 합산한다.
- 페이지를 열 때 집계한다. 열린 페이지의 체류 시간, PiP, 페이지 내부 탭·검색·해시 변화는 추가 집계하지 않는다.
- 브라우저 간·기기 간 중복, 저장소 삭제, 봇·직접 API 요청은 완벽하게 구별할 수 없다. 참고용 수치다.
- 로컬 테스트에서는 집계하지 않는다. 비활성 탭은 처음 화면에 표시될 때 집계한다.
- DNT/GPC 사용 시 조회만 하고 증가시키지 않는다. localStorage 사용 불가 시에도 증가시키지 않는다.
- 네트워크 응답 유실 시 중복 집계를 막기 위해 자동 쓰기 재시도를 하지 않는다. 따라서 누락이 생길 수 있다.

## 저장 정보와 보안

DB에는 `/counters/<등록된 페이지 키>`의 숫자만 저장한다. 브라우저에는 페이지별 마지막 집계 시각만 저장한다.
방문 식별자, 이메일, 수집 기록, 검색어, URL 쿼리 등은 전송하지 않는다. 쿠키·인증·리퍼러를 전송하지 않는 REST 요청으로 처리한다.
Firebase 자체 네트워크 처리와 로그는 해당 서비스 정책을 따른다.

`database.rules.json`은 루트 읽기/쓰기와 알 수 없는 키를 거부한다. 카운터 숫자는 공개 조회하며 1로 초기화하거나 기존 값에 1만 더할 수 있다. 삭제·감소·임의 값/객체 쓰기는 거부한다. 전체 숫자를 별도로 쓰지 않아 페이지 합계와 어긋나지 않는다.
이 규칙은 임의 데이터 변경을 제한하지만 인증 없는 공개 카운터에 대한 반복 요청까지 차단하지는 못한다. 정확한 방문자 분석이나 강력한 남용 방지가 필요하면 별도 서버와 요청 제한을 도입해야 한다.

무료 한도 내에서 동작하며 결제 요금제는 자동으로 올리지 않는다. 연결을 유지하지 않고 페이지 진입 시 쓰기 최대 1회·읽기 1회만 실행한다. 네트워크 또는 무료 한도 문제로 읽기가 실패하면 기존 도구는 그대로 동작하고 카운터는 표시하지 않는다.

## 변경 방법

저장소 루트에서:

```sh
node ffxiv/tools/visitor-counter.cjs
node ffxiv/tools/site-navigation.cjs
node --test ffxiv/tests/visitor-counter.test.cjs ffxiv/tests/navigation.test.cjs
```

새 DB 주소는 `node ffxiv/tools/visitor-counter.cjs https://실제-데이터베이스-호스트`로 설정한다. `ffxiv/visitor-counter-config.json`의 DB 주소는 공개 연결 주소이며 비밀키가 아니다. 서비스 계정 키나 관리자 토큰을 넣으면 안 된다.
새 페이지 추가 시 생성기를 다시 실행하고 Firebase Console의 Realtime Database → 규칙에 생성된 `database.rules.json`을 게시한 다음 사이트를 배포한다.

운영 문서: [REST 쓰기](https://firebase.google.com/docs/database/rest/save-data), [보안 규칙](https://firebase.google.com/docs/database/security), [무료 요금제와 사용량](https://firebase.google.com/docs/database/usage/billing).
