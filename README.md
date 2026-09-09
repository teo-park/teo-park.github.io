# teo-park.github.io

파이널판타지14 한국 서버를 위한 무료·비영리 팬 도구입니다.

- [파판14 도구함](https://teo-park.github.io/ffxiv/)
- [메인퀘 어디쯤?](https://teo-park.github.io/ffxiv/msq-tracker/)
- [시리즈 작전표](https://teo-park.github.io/ffxiv/pvp-series-calculator/)
- [임무 초성 사전](https://teo-park.github.io/ffxiv/duty-finder/)
- [트리플 트라이어드 수첩](https://teo-park.github.io/ffxiv/triple-triad/) — 카드 수집·획득처·규칙별 덱 추천

- [무기 수첩](https://teo-park.github.io/ffxiv/weapons/) — 직업별 성장 단계·절 무기 수집·재보강 신곡 무기

파판14 관련 파일만 `ffxiv/`에 관리합니다. 데이터 출처·권리 안내와 개발 방법은 [도구함 README](./ffxiv/README.md)를 참고하세요.

GitHub Pages는 `main` 브랜치의 루트에서 배포합니다. 루트 주소는 `/ffxiv/`로 이동하며, 별도 빌드 과정은 없습니다.

검증:

```sh
node --test ffxiv/duty-finder/tests/duty-finder.test.cjs ffxiv/msq-tracker/tests/progress.test.cjs ffxiv/pvp-series-calculator/tests/pvp-series-calculator.test.js
```
