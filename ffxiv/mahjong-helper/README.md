# 작패유희 역 사전

파판14 작패유희의 리치 마작 역을 공부하기 위한 정적 웹 페이지입니다. [역 사전 열기](https://teo-park.github.io/ffxiv/mahjong-helper/)

`123ㅁ 123ㅌ 123ㅅ 5567ㅈ`처럼 패 종류 기호를 숫자 뒤에 붙여 입력합니다. 자패 숫자는 `1동 2남 3서 4북 5백 6발 7중`입니다. 영어식 `123m123p123s5567z`도 받습니다. 패 그림을 클릭하거나 종류별 입력 칸을 사용할 수도 있습니다.

입력한 패와 대표 완성 예시가 겹치는 정도를 비교합니다. 화료 확률, 최적 버림패, 점수는 계산하지 않습니다. 치·퐁·깡의 공개 패 묶음도 별도로 입력하지 않습니다. 자풍·장풍·멘젠 여부는 버튼으로 고를 수 있습니다.

입문용 역 11개의 조건과 예시를 담았습니다. 역 조건의 참고 자료는 [유럽 마작 협회의 리치 규칙](https://mahjong-europe.org/portal/images/docs/Riichi-rules-2025-EN.pdf)입니다. 패 그림은 [pjura/mahjong_souls_tiles](https://huggingface.co/datasets/pjura/mahjong_souls_tiles)의 기본 이미지이며 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)에 따라 사용했습니다. 서체는 도구함의 공통 글꼴인 [LINE Seed KR](../fonts/line-seed-kr/README.md)을 사용합니다.

로컬에서 확인하려면 저장소 루트에서 `python -m http.server 8767`을 실행한 뒤 `http://localhost:8767/ffxiv/mahjong-helper/`을 엽니다. 로직 검증은 `node --test ffxiv/mahjong-helper/tests/*.test.js`를 사용합니다.
