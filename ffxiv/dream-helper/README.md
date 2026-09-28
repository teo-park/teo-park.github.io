# 헤비 영식 4층 드림 헬퍼

첨부된 `Idyllic-Dream-Helper-main.zip`의 `strategies.py`, `main.py` 계산과 `img/` 자산을 옮긴 정적 웹 도구입니다. 빌드나 Python 설치 없이 기존 사이트와 함께 제공합니다.

- 09stop / Game8, 8개 파티 자리, 분신 위치·산개/쉐어 동선, 탑 교대, 섬 안전지대
- Document Picture-in-Picture 창에서 단계별 입력, 본 페이지와 양방향 반영
- PiP 미지원 환경에서는 일반 팝업 창 사용 (항상 위 고정 없음)
- 처리법·파티 자리만 localStorage에 저장. 새 트라이 또는 처리법 변경 시 기믹 기록 초기화
- 원본의 `spread_map_1/2`, `btn_to_line_marks`, `check_img_key_map`, 역할별 탑 교대 및 안전 판정을 유지
- 원본의 투명도·클릭 무시·윈도우 위치 잠금은 브라우저 기능으로 제공하지 않음

검증: 이 폴더에서 `node --test tests/*.test.cjs`. UI 테스트는 기존 `../ocean-fishing/node_modules/jsdom`을 사용합니다.
