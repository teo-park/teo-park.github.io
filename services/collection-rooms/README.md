# 비공개 부대 수집방

`ffxiv/collection-room/`의 정적 페이지와 전용 `teo-ffxiv` 프로젝트의 Google 인증·Realtime Database를 사용합니다. 웹 앱 이름도 `teo-ffxiv`입니다. 방문 통계 프로젝트 `teo-ffxiv-counter`와 앱·사용자·데이터베이스·규칙을 분리합니다. 별도 서버 함수나 유료 요금제 전환은 필요하지 않습니다. Firebase의 사용량 제한은 적용됩니다.

## 실제 서비스 연결

1. `npm --prefix services/collection-rooms ci --ignore-scripts`
2. `teo-ffxiv` 프로젝트에 권한이 있는 계정으로 Firebase CLI에 로그인합니다. 현재 소유 계정은 `teo.ffxiv.kr@gmail.com`입니다.
3. 저장소 루트에서 `node services/collection-rooms/rules.cjs`로 수집방 전용 규칙을 생성합니다.
4. 소유 계정으로 아래 명령을 실행하거나 Firebase Console의 Realtime Database 규칙에 `services/collection-rooms/database.rules.json`을 게시합니다.

```powershell
node services/collection-rooms/node_modules/firebase-tools/lib/bin/firebase.js login:add
node services/collection-rooms/node_modules/firebase-tools/lib/bin/firebase.js deploy --only auth,database --project teo-ffxiv --account teo.ffxiv.kr@gmail.com --config firebase.json
```

5. 기존 GitHub Pages 배포 과정으로 정적 파일을 배포합니다. `teo-ffxiv`의 인증 허용 도메인에 `teo-park.github.io`가 있어야 합니다. Google 로그인 공급자와 `https://teo-ffxiv.firebaseapp.com/__/auth/handler`를 전용 프로젝트에서 설정합니다. 로컬에서 실제 Google 로그인을 테스트할 경우에만 `localhost`를 별도로 허용합니다.

규칙 게시 전에는 수집방 데이터에 대한 접근이 거부됩니다. 테스트는 `demo-collection-rooms` 에뮬레이터에서만 진행하며 실제 서비스에 테스트 방이나 사용자 기록을 생성하지 않습니다. 루트 `firebase.json`과 `.firebaserc`의 기본 프로젝트는 수집방 앱용입니다. 통계 프로젝트는 `firebase.counter.json`으로 별도 배포합니다. 수집방 규칙을 공개 읽기로 바꾸지 마세요.

```powershell
node ffxiv/tools/visitor-counter.cjs
node services/collection-rooms/node_modules/firebase-tools/lib/bin/firebase.js deploy --only database --project teo-ffxiv-counter --account teo.ffxiv.kr@gmail.com --config firebase.counter.json
```

2026-10-28에 통계 프로젝트를 점검했을 때 `collectionRooms` 데이터는 없었습니다. 분리 시 기존 브라우저의 수첩·같이하기 기록은 보존하고, 연결·전송 대기열·탭 통신은 새 프로젝트 전용 이름을 사용합니다. 이전 배포를 열어 둔 브라우저는 새로고침한 뒤 Google 로그인과 수첩 연결을 다시 진행합니다. 과거 프로젝트의 브라우저 연결 정보와 대기열은 자동 삭제하지 않습니다.

## 데이터와 접근 권한

모든 경로는 `collectionRooms/` 아래에 있습니다.

- `users/<uid>/books`: Google 계정 본인만 읽고 쓰는 원본 수집 기록. 체크와 같이하기 표시만 저장하며 무기 메모는 올리지 않습니다.
- `secrets/<room>`: 방장 UID와 방별 PBKDF2-SHA256 검증값. 공개 조회·방 참여자 조회 모두 금지합니다. 원래 비밀번호는 저장하지 않습니다.
- `access/<room>/<uid>`: 본인이 비밀번호 검증값을 제출해 획득하는 입장 권한. 다른 사람의 권한이나 비밀번호 증명을 읽을 수 없습니다.
- `rooms/<room>/meta`, `members`: 입장한 계정만 방 이름·참여자 이름·공유 수첩 선택을 조회합니다.
- `shared/<room>/<uid>/<book>`: 선택해 공유한 수첩만 참여자에게 보입니다. `{ ready: true, entries: ... }` 형태로, 아직 연결하지 않은 사람을 미수집자로 집계하지 않습니다.
- `bans/<room>/<uid>`: 방장이 내보낸 계정의 재입장을 막습니다. 내보내기와 동시에 입장 권한·방 프로필·공유 사본을 삭제합니다. 개인 기록은 유지됩니다.
- `userRooms/<uid>`: 본인의 참여 방 바로가기. 내보내진 방은 접근 불가로 표시하며 본인이 목록에서 지울 수 있습니다.

방 비밀번호는 방 ID를 salt로 사용해 브라우저에서 210,000회 PBKDF2로 변환합니다. 서버 규칙은 저장된 검증값과 제출값을 비교해 입장을 허용합니다. 클라이언트에서 화면만 숨기는 구조가 아닙니다. HTTPS 환경에서 사용합니다. 방장이 비밀번호를 바꾸거나 새 참여를 잠가도 기존 참여자는 유지됩니다. 참여자는 자신의 기록만 변경할 수 있고, 방장도 다른 사람의 개인 수첩을 읽거나 수정할 수 없습니다.

방장은 자신의 방을 나갈 수 없으며 현재 버전에는 방 소유권 이전·방 삭제·전체 계정 데이터 삭제 UI가 없습니다. 이 작업이 필요하면 소유 계정으로 관리해야 합니다. 사람을 내보낼 때에는 해당 계정이 같은 비밀번호로 다시 들어오지 못합니다.

## 동기화

처음 ‘기존 기록 불러오고 연결’을 누르면 브라우저의 기존 기록과 서버 기록을 트랜잭션으로 합칩니다. 무기는 아이템 번호의 크기가 아닌 실제 성장 단계 순서로 합치며, 체크하지 않은 다른 기록과 무기 메모·낚시 연동 메타데이터·알 수 없는 미래 ID를 보존합니다. 어부 수첩과 항해일지의 이전 저장 형식은 기존 공통 저장소로 먼저 이전합니다.

이후에는 항목별 `value`, `wanted` 변경만 보냅니다. 체크 해제는 `0`/`false`로 보관하고 전송되지 않은 변경은 계정별 브라우저 대기열에 저장합니다. 다른 기기의 서로 다른 항목·필드 수정이 전체 수첩 덮어쓰기로 사라지지 않습니다. 같은 항목의 같은 필드가 충돌하면 서버가 마지막으로 받은 변경이 반영됩니다. 기기 시계에 의존하지 않습니다.

같은 브라우저에서는 Web Locks로 한 탭만 통신을 담당하며 다른 탭의 변경은 저장소 이벤트로 전달합니다. 기록을 전송한 뒤 공유 중인 모든 방으로 사본을 갱신합니다. 서버 저장과 방 사본 갱신은 별도 작업이므로 잠깐의 지연이 있을 수 있고, 네트워크가 끊겼거나 모든 페이지를 닫으면 다시 페이지를 열 때 남은 변경을 전송합니다. 공유 사본은 현재 로그인한 사용자의 페이지가 동작하는 동안 갱신됩니다.

다른 Google 계정으로 바뀌면 자동 업로드를 멈춥니다. 기존 연결 해제와 명시적인 재연결 없이는 이전 사용자의 브라우저 기록을 새 계정으로 올리지 않습니다. 로그아웃·권한 변경 뒤에 도착하는 응답은 방 화면을 복구하지 못합니다. 다른 기기·브라우저에서 이어 쓰려면 같은 Google 계정으로 로그인하고 해당 브라우저에서도 수첩을 연결하세요.

브라우저 사이트 데이터를 지우면 아직 서버로 전송되지 않은 변경도 지워집니다. 기존 수첩의 백업 기능은 계속 사용할 수 있습니다.

## 검증

```powershell
node --test ffxiv/collection-room/tests/*.test.cjs
npm --prefix services/collection-rooms test
```

에뮬레이터에는 Java 21 이상이 필요합니다. 테스트 명령은 `demo-collection-rooms` 프로젝트만 사용합니다. 비밀번호·개인 기록 보호, 다른 방 격리, 공유 설정, 내보내기, 기존 통계 권한, 동기화 대기열·해제·오프라인 복원 등을 검사합니다.

공개 게임 목록을 갱신한 뒤 `node ffxiv/tools/collection-catalog.cjs`를 실행하면 방의 검색 목록을 같은 데이터로 재생성합니다. 탈것은 원본 수첩·한국어 목록이 아직 없어서 이 버전에 포함하지 않습니다.
