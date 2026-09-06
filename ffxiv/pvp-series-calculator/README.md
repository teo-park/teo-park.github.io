# 시리즈 작전표

파이널판타지14 PvP 시리즈의 현재 레벨과 경험치를 입력해 목표까지 남은 경험치와 콘텐츠별 예상 판수를 계산하는 정적 웹 도구입니다.

서비스: <https://teo-park.github.io/ffxiv/pvp-series-calculator/>

독립 정적 앱이며, 모든 화면 글꼴은 공통 `theme.css`의 나눔스퀘어라운드를 사용합니다. 글꼴 파일과 [SIL Open Font License 1.1](../fonts/nanum-square-round/OFL.txt)은 공통 `fonts/nanum-square-round/`에 포함되어 있습니다.

브라우저 입력 복원을 위해 기존 저장 키 `small-tools:pvp-series-calculator:v1`을 유지합니다. 저장값은 현재 사이트의 브라우저 저장소에만 보관합니다. 도메인이 달라져 이전 사이트의 저장값은 자동으로 이전되지 않습니다.

## 기능

- 시리즈 레벨 1~30의 구간별 요구 경험치 계산
- 레벨 30 이후 20,000 EXP 단위의 추가 레벨 계산
- 크리스탈라인 컨플릭트·기공전·전장의 빠른/예상/보수적 판수 비교
- 일일 전장 보너스를 포함한 예상 일수 계산
- 선택한 마감일까지 필요한 하루 경험치와 콘텐츠별 플레이량 계산

판수와 일수는 목표 경험치가 부족하지 않도록 항상 올림합니다. 크리스탈라인 컨플릭트와 기공전의 예상치는 승률 50%, 전장의 예상치는 1~3위가 같은 비율로 나온다고 가정합니다.

## 데이터 기준

- 레벨 30까지 누적 요구 경험치: 158,000 EXP
- 레벨 30 이후 추가 레벨: 1회당 20,000 EXP
- 콘텐츠별 시리즈 경험치와 일일 전장 보너스는 [Series Malmstones](https://ffxiv.consolegameswiki.com/wiki/Series_Malmstones)의 공개 데이터를 사용합니다.

게임 수치가 변경되면 `app.js`의 경험치 구간과 `REWARDS` 상수를 갱신하고 테스트 기대값도 함께 변경합니다.

## 테스트

```bash
node --test pvp-series-calculator/tests/pvp-series-calculator.test.js
```
