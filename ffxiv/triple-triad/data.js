// Generated from public sources by scripts/update-data.mjs. See README.md.
window.TRIPLE_TRIAD_DATA = {
  "schemaVersion": 1,
  "updatedAt": "2026-09-07",
  "count": 475,
  "koreanCount": 475,
  "npcCount": 134,
  "officialCount": 464,
  "source": {
    "collect": "https://ffxivcollect.com/api",
    "cards": "https://ffxivcollect.com/api/triad/cards",
    "npcs": "https://ffxivcollect.com/api/triad/npcs",
    "packs": "https://ffxivcollect.com/api/triad/packs",
    "korean": "https://github.com/Ra-Workspace/ffxiv-datamining-ko/tree/9431b6ce34e0f5b79686f71b585769819f81ae2b",
    "global": "https://github.com/xivapi/ffxiv-datamining/tree/64ff8a5d2903b429cb9d95066547ce57fc53bfc8",
    "guide": "https://guide.ff14.co.kr/lodestone/db/item?category2=7&category3=90"
  },
  "groups": [
    [
      "npc",
      "NPC 대결"
    ],
    [
      "duty",
      "임무"
    ],
    [
      "exchange",
      "교환"
    ],
    [
      "pack",
      "카드팩"
    ],
    [
      "achievement",
      "업적"
    ],
    [
      "quest",
      "퀘스트"
    ],
    [
      "other",
      "기타"
    ]
  ],
  "cards": [
    {
      "id": 1,
      "number": "No. 1",
      "order": 1,
      "deckOrder": 1,
      "ex": false,
      "name": "도도",
      "original": "Dodo",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 2,
        "bottom": 3,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088001_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/1.png",
      "link": "https://ffxivcollect.com/triad/cards/1",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/820add096df",
      "officialExact": true,
      "sources": [
        {
          "type": "Quest",
          "typeName": "퀘스트",
          "group": "quest",
          "relatedType": "Quest",
          "relatedId": 65973,
          "name": "도전! 트리플 트라이어드",
          "original": "Triple Triad Trial",
          "method": "퀘스트 완료 보상",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%8F%84%EC%A0%84!%20%ED%8A%B8%EB%A6%AC%ED%94%8C%20%ED%8A%B8%EB%9D%BC%EC%9D%B4%EC%96%B4%EB%93%9C",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 2,
      "number": "No. 2",
      "order": 2,
      "deckOrder": 1,
      "ex": false,
      "name": "톤베리",
      "original": "Tonberry",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 2,
        "bottom": 7,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088002_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/2.png",
      "link": "https://ffxivcollect.com/triad/cards/2",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/cb541670f94",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293762,
          "name": "메메룬",
          "original": "Memeroon",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "고지 라노시아",
          "link": "https://ffxivcollect.com/triad/npcs/2293762",
          "region": "라노시아",
          "npc": {
            "id": 2293762,
            "residentId": 1005249,
            "name": "메메룬",
            "original": "Memeroon",
            "location": "고지 라노시아",
            "region": "라노시아",
            "x": "14.7",
            "y": "24.3",
            "quest": null,
            "ruleIds": [
              2
            ],
            "rules": [
              "모두 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293762"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 10,
          "name": "방랑자의 궁전",
          "original": "The Wanderer's Palace",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/3c97112d11b",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 30,
          "name": "방랑자의 궁전(어려움)",
          "original": "The Wanderer's Palace (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/94e69de74b8",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 3,
      "number": "No. 3",
      "order": 3,
      "deckOrder": 1,
      "ex": false,
      "name": "사보텐더",
      "original": "Sabotender",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 3,
        "bottom": 3,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088003_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/3.png",
      "link": "https://ffxivcollect.com/triad/cards/3",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6303aff92df",
      "officialExact": true,
      "sources": [
        {
          "type": "Quest",
          "typeName": "퀘스트",
          "group": "quest",
          "relatedType": "Quest",
          "relatedId": 65973,
          "name": "도전! 트리플 트라이어드",
          "original": "Triple Triad Trial",
          "method": "퀘스트 완료 보상",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%8F%84%EC%A0%84!%20%ED%8A%B8%EB%A6%AC%ED%94%8C%20%ED%8A%B8%EB%9D%BC%EC%9D%B4%EC%96%B4%EB%93%9C",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 4,
      "number": "No. 4",
      "order": 4,
      "deckOrder": 1,
      "ex": false,
      "name": "스프리건",
      "original": "Spriggan",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 3,
        "bottom": 4,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088004_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/4.png",
      "link": "https://ffxivcollect.com/triad/cards/4",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/df711d5a1d1",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293771,
          "name": "트리플 트라이어드 마스터",
          "original": "Triple Triad Master",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293771",
          "region": "다날란",
          "npc": {
            "id": 2293771,
            "residentId": 1011060,
            "name": "트리플 트라이어드 마스터",
            "original": "Triple Triad Master",
            "location": "골드 소서",
            "region": "다날란",
            "x": "4.2",
            "y": "7.5",
            "quest": null,
            "ruleIds": [
              2
            ],
            "rules": [
              "모두 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293771"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        }
      ]
    },
    {
      "id": 5,
      "number": "No. 5",
      "order": 5,
      "deckOrder": 1,
      "ex": false,
      "name": "푸딩",
      "original": "Pudding",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 4,
        "bottom": 3,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088005_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/5.png",
      "link": "https://ffxivcollect.com/triad/cards/5",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/68c40454b98",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293765,
          "name": "로저",
          "original": "Roger",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "중부 다날란",
          "link": "https://ffxivcollect.com/triad/npcs/2293765",
          "region": "다날란",
          "npc": {
            "id": 2293765,
            "residentId": 1001541,
            "name": "로저",
            "original": "Roger",
            "location": "중부 다날란",
            "region": "다날란",
            "x": "19.5",
            "y": "20.6",
            "quest": null,
            "ruleIds": [
              2
            ],
            "rules": [
              "모두 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293765"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        }
      ]
    },
    {
      "id": 6,
      "number": "No. 6",
      "order": 6,
      "deckOrder": 1,
      "ex": false,
      "name": "봄",
      "original": "Bomb",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 4,
        "bottom": 3,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088006_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/6.png",
      "link": "https://ffxivcollect.com/triad/cards/6",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ffa9bb6c524",
      "officialExact": true,
      "sources": [
        {
          "type": "Quest",
          "typeName": "퀘스트",
          "group": "quest",
          "relatedType": "Quest",
          "relatedId": 65973,
          "name": "도전! 트리플 트라이어드",
          "original": "Triple Triad Trial",
          "method": "퀘스트 완료 보상",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%8F%84%EC%A0%84!%20%ED%8A%B8%EB%A6%AC%ED%94%8C%20%ED%8A%B8%EB%9D%BC%EC%9D%B4%EC%96%B4%EB%93%9C",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 7,
      "number": "No. 7",
      "order": 7,
      "deckOrder": 1,
      "ex": false,
      "name": "만드라고라",
      "original": "Mandragora",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 2,
        "bottom": 5,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088007_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/7.png",
      "link": "https://ffxivcollect.com/triad/cards/7",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f0124ce48fb",
      "officialExact": true,
      "sources": [
        {
          "type": "Quest",
          "typeName": "퀘스트",
          "group": "quest",
          "relatedType": "Quest",
          "relatedId": 65973,
          "name": "도전! 트리플 트라이어드",
          "original": "Triple Triad Trial",
          "method": "퀘스트 완료 보상",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%8F%84%EC%A0%84!%20%ED%8A%B8%EB%A6%AC%ED%94%8C%20%ED%8A%B8%EB%9D%BC%EC%9D%B4%EC%96%B4%EB%93%9C",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 8,
      "number": "No. 8",
      "order": 8,
      "deckOrder": 1,
      "ex": false,
      "name": "코브란",
      "original": "Coblyn",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 3,
        "bottom": 3,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088008_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/8.png",
      "link": "https://ffxivcollect.com/triad/cards/8",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ecbf73d4a95",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293764,
          "name": "마이센타",
          "original": "Maisenta",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 신시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293764",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293764,
            "residentId": 1001276,
            "name": "마이센타",
            "original": "Maisenta",
            "location": "그리다니아 신시가지",
            "region": "검은장막 숲",
            "x": "11.5",
            "y": "11.3",
            "quest": null,
            "ruleIds": [
              2
            ],
            "rules": [
              "모두 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293764"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293768,
          "name": "와이먼드",
          "original": "Wymond",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 날 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293768",
          "region": "다날란",
          "npc": {
            "id": 2293768,
            "residentId": 1001285,
            "name": "와이먼드",
            "original": "Wymond",
            "location": "울다하 날 회랑",
            "region": "다날란",
            "x": "9.9",
            "y": "8.7",
            "quest": null,
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293768"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        }
      ]
    },
    {
      "id": 9,
      "number": "No. 9",
      "order": 9,
      "deckOrder": 1,
      "ex": false,
      "name": "몰볼",
      "original": "Morbol",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 2,
        "bottom": 5,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088009_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/9.png",
      "link": "https://ffxivcollect.com/triad/cards/9",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8b693a60cd5",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293765,
          "name": "로저",
          "original": "Roger",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "중부 다날란",
          "link": "https://ffxivcollect.com/triad/npcs/2293765",
          "region": "다날란",
          "npc": {
            "id": 2293765,
            "residentId": 1001541,
            "name": "로저",
            "original": "Roger",
            "location": "중부 다날란",
            "region": "다날란",
            "x": "19.5",
            "y": "20.6",
            "quest": null,
            "ruleIds": [
              2
            ],
            "rules": [
              "모두 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293765"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 5,
          "name": "금빛 골짜기",
          "original": "The Aurum Vale",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/b6915777cba",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 10,
      "number": "No. 10",
      "order": 10,
      "deckOrder": 1,
      "ex": false,
      "name": "커얼",
      "original": "Coeurl",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 5,
        "bottom": 2,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088010_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/10.png",
      "link": "https://ffxivcollect.com/triad/cards/10",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/67cf344f320",
      "officialExact": true,
      "sources": [
        {
          "type": "Quest",
          "typeName": "퀘스트",
          "group": "quest",
          "relatedType": "Quest",
          "relatedId": 65973,
          "name": "도전! 트리플 트라이어드",
          "original": "Triple Triad Trial",
          "method": "퀘스트 완료 보상",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%8F%84%EC%A0%84!%20%ED%8A%B8%EB%A6%AC%ED%94%8C%20%ED%8A%B8%EB%9D%BC%EC%9D%B4%EC%96%B4%EB%93%9C",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 11,
      "number": "No. 11",
      "order": 11,
      "deckOrder": 1,
      "ex": false,
      "name": "아리만",
      "original": "Ahriman",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 5,
        "bottom": 2,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088011_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/11.png",
      "link": "https://ffxivcollect.com/triad/cards/11",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/fe998c7610a",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293780,
          "name": "아우어딜릭",
          "original": "Ourdilic",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "커르다스 중앙고지",
          "link": "https://ffxivcollect.com/triad/npcs/2293780",
          "region": "커르다스",
          "npc": {
            "id": 2293780,
            "residentId": 1006480,
            "name": "아우어딜릭",
            "original": "Ourdilic",
            "location": "커르다스 중앙고지",
            "region": "커르다스",
            "x": "6.2",
            "y": "22.6",
            "quest": null,
            "ruleIds": [
              8
            ],
            "rules": [
              "순서대로"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293780"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 13,
          "name": "제멜 요새",
          "original": "Dzemael Darkhold",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/91824420114",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 12,
      "number": "No. 12",
      "order": 12,
      "deckOrder": 1,
      "ex": false,
      "name": "구부",
      "original": "Goobbue",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 5,
        "bottom": 5,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088012_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/12.png",
      "link": "https://ffxivcollect.com/triad/cards/12",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0bf97e0ecca",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293767,
          "name": "뮨",
          "original": "Mother Miounne",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 신시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293767",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293767,
            "residentId": 1000100,
            "name": "뮨",
            "original": "Mother Miounne",
            "location": "그리다니아 신시가지",
            "region": "검은장막 숲",
            "x": "11.7",
            "y": "13.5",
            "quest": {
              "name": "마른뼈 야영지로",
              "original": "A Wild Rose by Any Other Name",
              "link": "https://www.garlandtools.org/db/#quest/66046"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293767"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293773,
          "name": "클럽 오리포르",
          "original": "Aurifort of the Three Clubs",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293773",
          "region": "다날란",
          "npc": {
            "id": 2293773,
            "residentId": 1011056,
            "name": "클럽 오리포르",
            "original": "Aurifort of the Three Clubs",
            "location": "골드 소서",
            "region": "다날란",
            "x": "4.1",
            "y": "7.8",
            "quest": null,
            "ruleIds": [
              3,
              8
            ],
            "rules": [
              "3장 공개",
              "순서대로"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293773"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        }
      ]
    },
    {
      "id": 13,
      "number": "No. 13",
      "order": 13,
      "deckOrder": 2,
      "ex": false,
      "name": "초코보",
      "original": "Chocobo",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 2,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088013_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/13.png",
      "link": "https://ffxivcollect.com/triad/cards/13",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/eeb07801990",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293766,
          "name": "다이아몬드 구트빈트",
          "original": "Guhtwint of the Three Diamonds",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293766",
          "region": "다날란",
          "npc": {
            "id": 2293766,
            "residentId": 1011059,
            "name": "다이아몬드 구트빈트",
            "original": "Guhtwint of the Three Diamonds",
            "location": "골드 소서",
            "region": "다날란",
            "x": "4.3",
            "y": "7.0",
            "quest": null,
            "ruleIds": [
              3,
              6
            ],
            "rules": [
              "3장 공개",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293766"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "600 맨더빌 골드 소서 포인트",
          "original": "600 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/13"
        }
      ]
    },
    {
      "id": 14,
      "number": "No. 14",
      "order": 14,
      "deckOrder": 3,
      "ex": false,
      "name": "아말쟈",
      "original": "Amalj'aa",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 1,
        "right": 4,
        "bottom": 7,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088014_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/14.png",
      "link": "https://ffxivcollect.com/triad/cards/14",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8869cd6009e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293762,
          "name": "메메룬",
          "original": "Memeroon",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "고지 라노시아",
          "link": "https://ffxivcollect.com/triad/npcs/2293762",
          "region": "라노시아",
          "npc": {
            "id": 2293762,
            "residentId": 1005249,
            "name": "메메룬",
            "original": "Memeroon",
            "location": "고지 라노시아",
            "region": "라노시아",
            "x": "14.7",
            "y": "24.3",
            "quest": null,
            "ruleIds": [
              2
            ],
            "rules": [
              "모두 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293762"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        }
      ]
    },
    {
      "id": 15,
      "number": "No. 15",
      "order": 15,
      "deckOrder": 3,
      "ex": false,
      "name": "이크살",
      "original": "Ixal",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 6,
        "right": 1,
        "bottom": 3,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088015_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/15.png",
      "link": "https://ffxivcollect.com/triad/cards/15",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e501d89c233",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293772,
          "name": "조엘로",
          "original": "Joellaut",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "커르다스 중앙고지",
          "link": "https://ffxivcollect.com/triad/npcs/2293772",
          "region": "커르다스",
          "npc": {
            "id": 2293772,
            "residentId": 1006466,
            "name": "조엘로",
            "original": "Joellaut",
            "location": "커르다스 중앙고지",
            "region": "커르다스",
            "x": "13.3",
            "y": "15.5",
            "quest": null,
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293772"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293763,
          "name": "스페이드 조나스",
          "original": "Jonas of the Three Spades",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293763",
          "region": "다날란",
          "npc": {
            "id": 2293763,
            "residentId": 1011058,
            "name": "스페이드 조나스",
            "original": "Jonas of the Three Spades",
            "location": "골드 소서",
            "region": "다날란",
            "x": "4.7",
            "y": "7.3",
            "quest": null,
            "ruleIds": [
              2,
              4
            ],
            "rules": [
              "모두 공개",
              "동수"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293763"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        }
      ]
    },
    {
      "id": 16,
      "number": "No. 16",
      "order": 16,
      "deckOrder": 3,
      "ex": false,
      "name": "말썽쟁이 실프",
      "original": "Sylph",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 2,
        "right": 4,
        "bottom": 5,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088016_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/16.png",
      "link": "https://ffxivcollect.com/triad/cards/16",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8b101f50dd3",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293764,
          "name": "마이센타",
          "original": "Maisenta",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 신시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293764",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293764,
            "residentId": 1001276,
            "name": "마이센타",
            "original": "Maisenta",
            "location": "그리다니아 신시가지",
            "region": "검은장막 숲",
            "x": "11.5",
            "y": "11.3",
            "quest": null,
            "ruleIds": [
              2
            ],
            "rules": [
              "모두 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293764"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        }
      ]
    },
    {
      "id": 17,
      "number": "No. 17",
      "order": 17,
      "deckOrder": 3,
      "ex": false,
      "name": "코볼드",
      "original": "Kobold",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 2,
        "right": 2,
        "bottom": 4,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088017_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/17.png",
      "link": "https://ffxivcollect.com/triad/cards/17",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/da9372917a3",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        }
      ]
    },
    {
      "id": 18,
      "number": "No. 18",
      "order": 18,
      "deckOrder": 3,
      "ex": false,
      "name": "사하긴",
      "original": "Sahagin",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 4,
        "right": 5,
        "bottom": 3,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088018_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/18.png",
      "link": "https://ffxivcollect.com/triad/cards/18",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/cc50451496e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293777,
          "name": "바데론",
          "original": "Baderon",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "림사 로민사 상층 갑판",
          "link": "https://ffxivcollect.com/triad/npcs/2293777",
          "region": "라노시아",
          "npc": {
            "id": 2293777,
            "residentId": 1000972,
            "name": "바데론",
            "original": "Baderon",
            "location": "림사 로민사 상층 갑판",
            "region": "라노시아",
            "x": "11.6",
            "y": "11.1",
            "quest": {
              "name": "마른뼈 야영지로",
              "original": "A Wild Rose by Any Other Name",
              "link": "https://www.garlandtools.org/db/#quest/66046"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293777"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 4,
          "name": "사스타샤 침식 동굴",
          "original": "Sastasha",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/dee4271da7e",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 19,
      "number": "No. 19",
      "order": 19,
      "deckOrder": 5,
      "ex": false,
      "name": "타타루 타루",
      "original": "Tataru Taru",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 7,
        "right": 2,
        "bottom": 3,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088019_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/19.png",
      "link": "https://ffxivcollect.com/triad/cards/19",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/863ac334daa",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        }
      ]
    },
    {
      "id": 20,
      "number": "No. 20",
      "order": 20,
      "deckOrder": 3,
      "ex": false,
      "name": "모그리",
      "original": "Moogle",
      "korean": true,
      "stars": 1,
      "patch": "2.51",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 2,
        "right": 1,
        "bottom": 3,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088020_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/20.png",
      "link": "https://ffxivcollect.com/triad/cards/20",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c19c2041798",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293775,
          "name": "트라흐툼",
          "original": "Trachtoum",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "저지 라노시아",
          "link": "https://ffxivcollect.com/triad/npcs/2293775",
          "region": "라노시아",
          "npc": {
            "id": 2293775,
            "residentId": 1006264,
            "name": "트라흐툼",
            "original": "Trachtoum",
            "location": "저지 라노시아",
            "region": "라노시아",
            "x": "35.6",
            "y": "15.9",
            "quest": {
              "name": "등불이 꺼진 날",
              "original": "All Good Things",
              "link": "https://www.garlandtools.org/db/#quest/66053"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293775"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293763,
          "name": "스페이드 조나스",
          "original": "Jonas of the Three Spades",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293763",
          "region": "다날란",
          "npc": {
            "id": 2293763,
            "residentId": 1011058,
            "name": "스페이드 조나스",
            "original": "Jonas of the Three Spades",
            "location": "골드 소서",
            "region": "다날란",
            "x": "4.7",
            "y": "7.3",
            "quest": null,
            "ruleIds": [
              2,
              4
            ],
            "rules": [
              "모두 공개",
              "동수"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293763"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "840 맨더빌 골드 소서 포인트",
          "original": "840 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/20"
        }
      ]
    },
    {
      "id": 21,
      "number": "No. 21",
      "order": 21,
      "deckOrder": 8,
      "ex": false,
      "name": "세이렌",
      "original": "Siren",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 6,
        "bottom": 7,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088021_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/21.png",
      "link": "https://ffxivcollect.com/triad/cards/21",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a15e64dcdac",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293776,
          "name": "미미도아",
          "original": "Mimidoa",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "저지 라노시아",
          "link": "https://ffxivcollect.com/triad/npcs/2293776",
          "region": "라노시아",
          "npc": {
            "id": 2293776,
            "residentId": 1002236,
            "name": "미미도아",
            "original": "Mimidoa",
            "location": "저지 라노시아",
            "region": "라노시아",
            "x": "25.1",
            "y": "35.0",
            "quest": {
              "name": "광기 어린 노랫소리",
              "original": "History Repeating",
              "link": "https://www.garlandtools.org/db/#quest/66503"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293776"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 17,
          "name": "시리우스 대등대",
          "original": "Pharos Sirius",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/1683ecdf6cc",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 22,
      "number": "No. 22",
      "order": 22,
      "deckOrder": 8,
      "ex": false,
      "name": "오르트로스 & 티폰",
      "original": "Ultros & Typhon",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 3,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088022_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/22.png",
      "link": "https://ffxivcollect.com/triad/cards/22",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ae0bea9d345",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293779,
          "name": "헬름하트",
          "original": "Helmhart",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "동부 다날란",
          "link": "https://ffxivcollect.com/triad/npcs/2293779",
          "region": "다날란",
          "npc": {
            "id": 2293779,
            "residentId": 1006209,
            "name": "헬름하트",
            "original": "Helmhart",
            "location": "동부 다날란",
            "region": "다날란",
            "x": "20.1",
            "y": "21.4",
            "quest": null,
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293779"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 81,
          "name": "아마지나배 투기대회 결승전",
          "original": "The Dragon's Neck",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/467a02c57b3",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 23,
      "number": "No. 23",
      "order": 23,
      "deckOrder": 8,
      "ex": false,
      "name": "악마의 벽",
      "original": "Demon Wall",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 7,
        "bottom": 2,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088023_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/23.png",
      "link": "https://ffxivcollect.com/triad/cards/23",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bf226afbbdf",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293783,
          "name": "버스카론",
          "original": "Buscarron",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 남부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293783",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293783,
            "residentId": 1000590,
            "name": "버스카론",
            "original": "Buscarron",
            "location": "검은장막 숲 남부삼림",
            "region": "검은장막 숲",
            "x": "18.1",
            "y": "19.8",
            "quest": {
              "name": "지옥 밑바닥에서 들리는 목소리",
              "original": "Into the Beast's Maw",
              "link": "https://www.garlandtools.org/db/#quest/66050"
            },
            "ruleIds": [
              8
            ],
            "rules": [
              "순서대로"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293783"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 14,
          "name": "옛 암다포르 성",
          "original": "Amdapor Keep",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/cca62880915",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 29,
          "name": "옛 암다포르 성(어려움)",
          "original": "Amdapor Keep (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/c3bbfb061f2",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 24,
      "number": "No. 24",
      "order": 24,
      "deckOrder": 8,
      "ex": false,
      "name": "서큐버스",
      "original": "Succubus",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 3,
        "bottom": 2,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088024_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/24.png",
      "link": "https://ffxivcollect.com/triad/cards/24",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e28ea8d53aa",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293774,
          "name": "피랄노",
          "original": "Piralnaut",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 동부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293774",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293774,
            "residentId": 1006189,
            "name": "피랄노",
            "original": "Piralnaut",
            "location": "검은장막 숲 동부삼림",
            "region": "검은장막 숲",
            "x": "17.4",
            "y": "26.5",
            "quest": null,
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293774"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 6,
          "name": "하우케타 별궁",
          "original": "Haukke Manor",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/1dafce825e1",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 19,
          "name": "하우케타 별궁(어려움)",
          "original": "Haukke Manor (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/87215a79974",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 25,
      "number": "No. 25",
      "order": 25,
      "deckOrder": 8,
      "ex": false,
      "name": "키마이라",
      "original": "Chimera",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 7,
        "bottom": 2,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088025_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/25.png",
      "link": "https://ffxivcollect.com/triad/cards/25",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/5065b2747f5",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293778,
          "name": "푸푸루파",
          "original": "Fufulupa",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "서부 다날란",
          "link": "https://ffxivcollect.com/triad/npcs/2293778",
          "region": "다날란",
          "npc": {
            "id": 2293778,
            "residentId": 1002058,
            "name": "푸푸루파",
            "original": "Fufulupa",
            "location": "서부 다날란",
            "region": "다날란",
            "x": "22.6",
            "y": "17.1",
            "quest": {
              "name": "마른뼈 야영지로",
              "original": "A Wild Rose by Any Other Name",
              "link": "https://www.garlandtools.org/db/#quest/66046"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293778"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 12,
          "name": "나무꾼의 비명",
          "original": "Cutter's Cry",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/ea16aa0f97d",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 26,
      "number": "No. 26",
      "order": 26,
      "deckOrder": 8,
      "ex": false,
      "name": "푸른 용",
      "original": "Blue Dragon",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 2,
        "bottom": 7,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088026_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/26.png",
      "link": "https://ffxivcollect.com/triad/cards/26",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/dd0f82305ce",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293780,
          "name": "아우어딜릭",
          "original": "Ourdilic",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "커르다스 중앙고지",
          "link": "https://ffxivcollect.com/triad/npcs/2293780",
          "region": "커르다스",
          "npc": {
            "id": 2293780,
            "residentId": 1006480,
            "name": "아우어딜릭",
            "original": "Ourdilic",
            "location": "커르다스 중앙고지",
            "region": "커르다스",
            "x": "6.2",
            "y": "22.6",
            "quest": null,
            "ruleIds": [
              8
            ],
            "rules": [
              "순서대로"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293780"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 11,
          "name": "돌방패 경계초소",
          "original": "The Stone Vigil",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/53b6f68baad",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 25,
          "name": "돌방패 경계초소(어려움)",
          "original": "The Stone Vigil (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/e0d811f0a6b",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 27,
      "number": "No. 27",
      "order": 27,
      "deckOrder": 10,
      "ex": false,
      "name": "잘생긴 부가쟈",
      "original": "Scarface Bugaal Ja",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 2,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088027_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/27.png",
      "link": "https://ffxivcollect.com/triad/cards/27",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/9a4b32ea929",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293773,
          "name": "클럽 오리포르",
          "original": "Aurifort of the Three Clubs",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293773",
          "region": "다날란",
          "npc": {
            "id": 2293773,
            "residentId": 1011056,
            "name": "클럽 오리포르",
            "original": "Aurifort of the Three Clubs",
            "location": "골드 소서",
            "region": "다날란",
            "x": "4.1",
            "y": "7.8",
            "quest": null,
            "ruleIds": [
              3,
              8
            ],
            "rules": [
              "3장 공개",
              "순서대로"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293773"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293766,
          "name": "다이아몬드 구트빈트",
          "original": "Guhtwint of the Three Diamonds",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293766",
          "region": "다날란",
          "npc": {
            "id": 2293766,
            "residentId": 1011059,
            "name": "다이아몬드 구트빈트",
            "original": "Guhtwint of the Three Diamonds",
            "location": "골드 소서",
            "region": "다날란",
            "x": "4.3",
            "y": "7.0",
            "quest": null,
            "ruleIds": [
              3,
              6
            ],
            "rules": [
              "3장 공개",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293766"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        }
      ]
    },
    {
      "id": 28,
      "number": "No. 28",
      "order": 28,
      "deckOrder": 13,
      "ex": false,
      "name": "모모디 모디",
      "original": "Momodi Modi",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 5,
        "bottom": 5,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088028_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/28.png",
      "link": "https://ffxivcollect.com/triad/cards/28",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/2588a9d73e0",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293769,
          "name": "모모디",
          "original": "Momodi",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 날 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293769",
          "region": "다날란",
          "npc": {
            "id": 2293769,
            "residentId": 1001353,
            "name": "모모디",
            "original": "Momodi",
            "location": "울다하 날 회랑",
            "region": "다날란",
            "x": "11.6",
            "y": "9.7",
            "quest": {
              "name": "마른뼈 야영지로",
              "original": "A Wild Rose by Any Other Name",
              "link": "https://www.garlandtools.org/db/#quest/66046"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293769"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        }
      ]
    },
    {
      "id": 29,
      "number": "No. 29",
      "order": 29,
      "deckOrder": 13,
      "ex": false,
      "name": "열 손가락 바데론",
      "original": "Baderon Tenfingers",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 5,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088029_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/29.png",
      "link": "https://ffxivcollect.com/triad/cards/29",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6da8798949f",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293777,
          "name": "바데론",
          "original": "Baderon",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "림사 로민사 상층 갑판",
          "link": "https://ffxivcollect.com/triad/npcs/2293777",
          "region": "라노시아",
          "npc": {
            "id": 2293777,
            "residentId": 1000972,
            "name": "바데론",
            "original": "Baderon",
            "location": "림사 로민사 상층 갑판",
            "region": "라노시아",
            "x": "11.6",
            "y": "11.1",
            "quest": {
              "name": "마른뼈 야영지로",
              "original": "A Wild Rose by Any Other Name",
              "link": "https://www.garlandtools.org/db/#quest/66046"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293777"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        }
      ]
    },
    {
      "id": 30,
      "number": "No. 30",
      "order": 30,
      "deckOrder": 13,
      "ex": false,
      "name": "뮨",
      "original": "Mother Miounne",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 5,
        "bottom": 3,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088030_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/30.png",
      "link": "https://ffxivcollect.com/triad/cards/30",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/00475ff5f56",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293767,
          "name": "뮨",
          "original": "Mother Miounne",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 신시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293767",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293767,
            "residentId": 1000100,
            "name": "뮨",
            "original": "Mother Miounne",
            "location": "그리다니아 신시가지",
            "region": "검은장막 숲",
            "x": "11.7",
            "y": "13.5",
            "quest": {
              "name": "마른뼈 야영지로",
              "original": "A Wild Rose by Any Other Name",
              "link": "https://www.garlandtools.org/db/#quest/66046"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293767"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        }
      ]
    },
    {
      "id": 31,
      "number": "No. 31",
      "order": 31,
      "deckOrder": 11,
      "ex": false,
      "name": "리위아 사스 유니우스",
      "original": "Livia sas Junius",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 7,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088031_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/31.png",
      "link": "https://ffxivcollect.com/triad/cards/31",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d414c7c1ca2",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293790,
          "name": "나른해 보이는 제국 병사",
          "original": "Indolent Imperial",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "모르도나",
          "link": "https://ffxivcollect.com/triad/npcs/2293790",
          "region": "모르도나",
          "npc": {
            "id": 2293790,
            "residentId": 1011789,
            "name": "나른해 보이는 제국 병사",
            "original": "Indolent Imperial",
            "location": "모르도나",
            "region": "모르도나",
            "x": "11.9",
            "y": "17.4",
            "quest": null,
            "ruleIds": [
              12
            ],
            "rules": [
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293790"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 15,
          "name": "카스트룸 메리디아눔",
          "original": "Castrum Meridianum",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/e94a2b5fea6",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 32,
      "number": "No. 32",
      "order": 32,
      "deckOrder": 11,
      "ex": false,
      "name": "리트아틴 사스 아르비나",
      "original": "Rhitahtyn sas Arvina",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 7,
        "right": 1,
        "bottom": 3,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088032_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/32.png",
      "link": "https://ffxivcollect.com/triad/cards/32",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d6bc24ccb3c",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293790,
          "name": "나른해 보이는 제국 병사",
          "original": "Indolent Imperial",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "모르도나",
          "link": "https://ffxivcollect.com/triad/npcs/2293790",
          "region": "모르도나",
          "npc": {
            "id": 2293790,
            "residentId": 1011789,
            "name": "나른해 보이는 제국 병사",
            "original": "Indolent Imperial",
            "location": "모르도나",
            "region": "모르도나",
            "x": "11.9",
            "y": "17.4",
            "quest": null,
            "ruleIds": [
              12
            ],
            "rules": [
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293790"
          }
        }
      ]
    },
    {
      "id": 33,
      "number": "No. 33",
      "order": 33,
      "deckOrder": 15,
      "ex": false,
      "name": "빅스 & 웨지",
      "original": "Biggs & Wedge",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 3,
        "bottom": 7,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088033_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/33.png",
      "link": "https://ffxivcollect.com/triad/cards/33",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/15ca76d9d8c",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293776,
          "name": "미미도아",
          "original": "Mimidoa",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "저지 라노시아",
          "link": "https://ffxivcollect.com/triad/npcs/2293776",
          "region": "라노시아",
          "npc": {
            "id": 2293776,
            "residentId": 1002236,
            "name": "미미도아",
            "original": "Mimidoa",
            "location": "저지 라노시아",
            "region": "라노시아",
            "x": "25.1",
            "y": "35.0",
            "quest": {
              "name": "광기 어린 노랫소리",
              "original": "History Repeating",
              "link": "https://www.garlandtools.org/db/#quest/66503"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293776"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293784,
          "name": "세즐 토톨록",
          "original": "Sezul Totoloc",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 북부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293784",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293784,
            "residentId": 1009199,
            "name": "세즐 토톨록",
            "original": "Sezul Totoloc",
            "location": "검은장막 숲 북부삼림",
            "region": "검은장막 숲",
            "x": "24.4",
            "y": "23.4",
            "quest": {
              "name": " 날개를 펼쳐 누구보다 높이 날아라",
              "original": "Spread Your Wings and Soar",
              "link": "https://www.garlandtools.org/db/#quest/67029"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293784"
          }
        }
      ]
    },
    {
      "id": 34,
      "number": "No. 34",
      "order": 34,
      "deckOrder": 14,
      "ex": false,
      "name": "게롤트 블랙손",
      "original": "Gerolt",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 7,
        "bottom": 3,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088034_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/34.png",
      "link": "https://ffxivcollect.com/triad/cards/34",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/69df86f876b",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293791,
          "name": "로웨나",
          "original": "Rowena",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "모르도나",
          "link": "https://ffxivcollect.com/triad/npcs/2293791",
          "region": "모르도나",
          "npc": {
            "id": 2293791,
            "residentId": 1001304,
            "name": "로웨나",
            "original": "Rowena",
            "location": "모르도나",
            "region": "모르도나",
            "x": "22.0",
            "y": "5.0",
            "quest": {
              "name": "전설의 무기 장인",
              "original": "The Weaponsmith of Legend",
              "link": "https://www.garlandtools.org/db/#quest/66241"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293791"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293779,
          "name": "헬름하트",
          "original": "Helmhart",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "동부 다날란",
          "link": "https://ffxivcollect.com/triad/npcs/2293779",
          "region": "다날란",
          "npc": {
            "id": 2293779,
            "residentId": 1006209,
            "name": "헬름하트",
            "original": "Helmhart",
            "location": "동부 다날란",
            "region": "다날란",
            "x": "20.1",
            "y": "21.4",
            "quest": null,
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293779"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        }
      ]
    },
    {
      "id": 35,
      "number": "No. 35",
      "order": 35,
      "deckOrder": 10,
      "ex": false,
      "name": "프리크시오",
      "original": "Frixio",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 6,
        "right": 2,
        "bottom": 6,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088035_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/35.png",
      "link": "https://ffxivcollect.com/triad/cards/35",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6d04e034802",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293774,
          "name": "피랄노",
          "original": "Piralnaut",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 동부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293774",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293774,
            "residentId": 1006189,
            "name": "피랄노",
            "original": "Piralnaut",
            "location": "검은장막 숲 동부삼림",
            "region": "검은장막 숲",
            "x": "17.4",
            "y": "26.5",
            "quest": null,
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293774"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293782,
          "name": "마르세트",
          "original": "Marcette",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 중부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293782",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293782,
            "residentId": 1006261,
            "name": "마르세트",
            "original": "Marcette",
            "location": "검은장막 숲 중부삼림",
            "region": "검은장막 숲",
            "x": "16.6",
            "y": "18.7",
            "quest": null,
            "ruleIds": [
              9
            ],
            "rules": [
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293782"
          }
        }
      ]
    },
    {
      "id": 36,
      "number": "No. 36",
      "order": 36,
      "deckOrder": 10,
      "ex": false,
      "name": "뮤타믹스",
      "original": "Mutamix Bubblypots",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 2,
        "right": 6,
        "bottom": 6,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088036_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/36.png",
      "link": "https://ffxivcollect.com/triad/cards/36",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/efdb632a966",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293770,
          "name": "프호바스",
          "original": "F'hobhas",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "중부 다날란",
          "link": "https://ffxivcollect.com/triad/npcs/2293770",
          "region": "다날란",
          "npc": {
            "id": 2293770,
            "residentId": 1001427,
            "name": "프호바스",
            "original": "F'hobhas",
            "location": "중부 다날란",
            "region": "다날란",
            "x": "23.5",
            "y": "13.9",
            "quest": null,
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293770"
          }
        }
      ]
    },
    {
      "id": 37,
      "number": "No. 37",
      "order": 37,
      "deckOrder": 10,
      "ex": false,
      "name": "메메룬",
      "original": "Memeroon",
      "korean": true,
      "stars": 2,
      "patch": "2.51",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 6,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088037_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/37.png",
      "link": "https://ffxivcollect.com/triad/cards/37",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/eefbf420565",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293762,
          "name": "메메룬",
          "original": "Memeroon",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "고지 라노시아",
          "link": "https://ffxivcollect.com/triad/npcs/2293762",
          "region": "라노시아",
          "npc": {
            "id": 2293762,
            "residentId": 1005249,
            "name": "메메룬",
            "original": "Memeroon",
            "location": "고지 라노시아",
            "region": "라노시아",
            "x": "14.7",
            "y": "24.3",
            "quest": null,
            "ruleIds": [
              2
            ],
            "rules": [
              "모두 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293762"
          }
        }
      ]
    },
    {
      "id": 38,
      "number": "No. 38",
      "order": 38,
      "deckOrder": 17,
      "ex": false,
      "name": "베히모스",
      "original": "Behemoth",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 8,
        "bottom": 4,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088038_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/38.png",
      "link": "https://ffxivcollect.com/triad/cards/38",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/fd46b1f9a53",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293780,
          "name": "아우어딜릭",
          "original": "Ourdilic",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "커르다스 중앙고지",
          "link": "https://ffxivcollect.com/triad/npcs/2293780",
          "region": "커르다스",
          "npc": {
            "id": 2293780,
            "residentId": 1006480,
            "name": "아우어딜릭",
            "original": "Ourdilic",
            "location": "커르다스 중앙고지",
            "region": "커르다스",
            "x": "6.2",
            "y": "22.6",
            "quest": null,
            "ruleIds": [
              8
            ],
            "rules": [
              "순서대로"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293780"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293784,
          "name": "세즐 토톨록",
          "original": "Sezul Totoloc",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 북부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293784",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293784,
            "residentId": 1009199,
            "name": "세즐 토톨록",
            "original": "Sezul Totoloc",
            "location": "검은장막 숲 북부삼림",
            "region": "검은장막 숲",
            "x": "24.4",
            "y": "23.4",
            "quest": {
              "name": " 날개를 펼쳐 누구보다 높이 날아라",
              "original": "Spread Your Wings and Soar",
              "link": "https://www.garlandtools.org/db/#quest/67029"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293784"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        }
      ]
    },
    {
      "id": 39,
      "number": "No. 39",
      "order": 39,
      "deckOrder": 28,
      "ex": false,
      "name": "길가메시 & 엔키두",
      "original": "Gilgamesh & Enkidu",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 3,
        "bottom": 7,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088039_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/39.png",
      "link": "https://ffxivcollect.com/triad/cards/39",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b6249c2bb7a",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "미스라이트 트라이어드 팩",
          "original": "Mythril Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#4",
          "pack": {
            "id": 4,
            "name": "미스라이트 트라이어드 팩",
            "cost": 8000,
            "link": "https://ffxivcollect.com/triad/packs#4"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 76,
          "name": "길가메시 토벌전",
          "original": "Battle on the Big Bridge",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/25b2ff0126c",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 40,
      "number": "No. 40",
      "order": 40,
      "deckOrder": 25,
      "ex": false,
      "name": "이프리트",
      "original": "Ifrit",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 7,
        "right": 1,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088040_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/40.png",
      "link": "https://ffxivcollect.com/triad/cards/40",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/5b7341e2114",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293788,
          "name": "불멸대 대령 스위프트",
          "original": "Swift",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 날 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293788",
          "region": "다날란",
          "npc": {
            "id": 2293788,
            "residentId": 1004576,
            "name": "불멸대 대령 스위프트",
            "original": "Swift",
            "location": "울다하 날 회랑",
            "region": "다날란",
            "x": "8.4",
            "y": "8.9",
            "quest": {
              "name": "부와 나라를 위하여",
              "original": "For Coin and Country",
              "link": "https://www.garlandtools.org/db/#quest/66221"
            },
            "ruleIds": [
              9
            ],
            "rules": [
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293788"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 59,
          "name": "진 이프리트 토벌전",
          "original": "The Bowl of Embers (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/9d9542db9db",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 63,
          "name": "극 이프리트 토벌전",
          "original": "The Bowl of Embers (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/6978819142c",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 41,
      "number": "No. 41",
      "order": 41,
      "deckOrder": 25,
      "ex": false,
      "name": "타이탄",
      "original": "Titan",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 1,
        "right": 7,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088041_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/41.png",
      "link": "https://ffxivcollect.com/triad/cards/41",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/de2a798e870",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293775,
          "name": "트라흐툼",
          "original": "Trachtoum",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "저지 라노시아",
          "link": "https://ffxivcollect.com/triad/npcs/2293775",
          "region": "라노시아",
          "npc": {
            "id": 2293775,
            "residentId": 1006264,
            "name": "트라흐툼",
            "original": "Trachtoum",
            "location": "저지 라노시아",
            "region": "라노시아",
            "x": "35.6",
            "y": "15.9",
            "quest": {
              "name": "등불이 꺼진 날",
              "original": "All Good Things",
              "link": "https://www.garlandtools.org/db/#quest/66053"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293775"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293785,
          "name": "랑드넬",
          "original": "Landenel",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 남부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293785",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293785,
            "residentId": 1006279,
            "name": "랑드넬",
            "original": "Landenel",
            "location": "검은장막 숲 남부삼림",
            "region": "검은장막 숲",
            "x": "16.8",
            "y": "28.2",
            "quest": {
              "name": "등불이 꺼진 날",
              "original": "All Good Things",
              "link": "https://www.garlandtools.org/db/#quest/66053"
            },
            "ruleIds": [
              9,
              11
            ],
            "rules": [
              "무작위 순서",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293785"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 60,
          "name": "진 타이탄 토벌전",
          "original": "The Navel (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/bc3791a1dfd",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 64,
          "name": "극 타이탄 토벌전",
          "original": "The Navel (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/4e50507ad4c",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 42,
      "number": "No. 42",
      "order": 42,
      "deckOrder": 25,
      "ex": false,
      "name": "가루다",
      "original": "Garuda",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 7,
        "right": 6,
        "bottom": 1,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088042_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/42.png",
      "link": "https://ffxivcollect.com/triad/cards/42",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/06f32bca6e6",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293782,
          "name": "마르세트",
          "original": "Marcette",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 중부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293782",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293782,
            "residentId": 1006261,
            "name": "마르세트",
            "original": "Marcette",
            "location": "검은장막 숲 중부삼림",
            "region": "검은장막 숲",
            "x": "16.6",
            "y": "18.7",
            "quest": null,
            "ruleIds": [
              9
            ],
            "rules": [
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293782"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 61,
          "name": "진 가루다 토벌전",
          "original": "The Howling Eye (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/eec2b4e2fbc",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 65,
          "name": "극 가루다 토벌전",
          "original": "The Howling Eye (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/9842c2bdc58",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 43,
      "number": "No. 43",
      "order": 43,
      "deckOrder": 25,
      "ex": false,
      "name": "선왕 모그루 모그 XII세",
      "original": "Good King Moggle Mog XII",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 7,
        "right": 6,
        "bottom": 7,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088043_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/43.png",
      "link": "https://ffxivcollect.com/triad/cards/43",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/2c11dfa0db5",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293787,
          "name": "쌍사당 대령 보르셀",
          "original": "Vorsaile Heuloix",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 신시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293787",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293787,
            "residentId": 1000168,
            "name": "쌍사당 대령 보르셀",
            "original": "Vorsaile Heuloix",
            "location": "그리다니아 신시가지",
            "region": "검은장막 숲",
            "x": "9.7",
            "y": "11.1",
            "quest": {
              "name": "부와 나라를 위하여",
              "original": "For Coin and Country",
              "link": "https://www.garlandtools.org/db/#quest/66221"
            },
            "ruleIds": [
              12
            ],
            "rules": [
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293787"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293817,
          "name": "단장 모그진",
          "original": "Master Mogzin",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "드라바니아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293817",
          "region": "드라바니아",
          "npc": {
            "id": 2293817,
            "residentId": 1017320,
            "name": "단장 모그진",
            "original": "Master Mogzin",
            "location": "드라바니아 구름바다",
            "region": "드라바니아",
            "x": "15.7",
            "y": "28.8",
            "quest": {
              "name": "미래를 바라보는 복원단!",
              "original": "The Zenith of Craftsmanship",
              "link": "https://www.garlandtools.org/db/#quest/67863"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293817"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 66,
          "name": "선왕 모그루 모그 XII세 토벌전",
          "original": "Thornmarch (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/43a5a9402fb",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 67,
          "name": "극왕 모그루 모그 XII세 토벌전",
          "original": "Thornmarch (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/8906bc1280a",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 44,
      "number": "No. 44",
      "order": 44,
      "deckOrder": 28,
      "ex": false,
      "name": "라야 오 센나 & 아 룬 센나",
      "original": "Raya-O-Senna & A-Ruhn-Senna",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 6,
        "bottom": 6,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088044_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/44.png",
      "link": "https://ffxivcollect.com/triad/cards/44",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d1c8d82c2d5",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293783,
          "name": "버스카론",
          "original": "Buscarron",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 남부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293783",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293783,
            "residentId": 1000590,
            "name": "버스카론",
            "original": "Buscarron",
            "location": "검은장막 숲 남부삼림",
            "region": "검은장막 숲",
            "x": "18.1",
            "y": "19.8",
            "quest": {
              "name": "지옥 밑바닥에서 들리는 목소리",
              "original": "Into the Beast's Maw",
              "link": "https://www.garlandtools.org/db/#quest/66050"
            },
            "ruleIds": [
              8
            ],
            "rules": [
              "순서대로"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293783"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "4,800 맨더빌 골드 소서 포인트",
          "original": "4,800 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/44"
        }
      ]
    },
    {
      "id": 45,
      "number": "No. 45",
      "order": 45,
      "deckOrder": 28,
      "ex": false,
      "name": "고드베르트 맨더빌",
      "original": "Godbert Manderville",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 5,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088045_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/45.png",
      "link": "https://ffxivcollect.com/triad/cards/45",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/5e1f4db546b",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293789,
          "name": "하브",
          "original": "Hab",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "남부 다날란",
          "link": "https://ffxivcollect.com/triad/npcs/2293789",
          "region": "다날란",
          "npc": {
            "id": 2293789,
            "residentId": 1004914,
            "name": "하브",
            "original": "Hab",
            "location": "남부 다날란",
            "region": "다날란",
            "x": "24.8",
            "y": "40.9",
            "quest": {
              "name": "서글픈 좀비",
              "original": "Zombies Are People Too",
              "link": "https://www.garlandtools.org/db/#quest/66558"
            },
            "ruleIds": [
              13
            ],
            "rules": [
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293789"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293786,
          "name": "킹 엘머",
          "original": "King Elmer III",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293786",
          "region": "다날란",
          "npc": {
            "id": 2293786,
            "residentId": 1011055,
            "name": "킹 엘머",
            "original": "King Elmer III",
            "location": "골드 소서",
            "region": "다날란",
            "x": "3.8",
            "y": "7.8",
            "quest": null,
            "ruleIds": [
              6
            ],
            "rules": [
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293786"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293781,
          "name": "하트 루트뷔다",
          "original": "Ruhtwyda of the Three Hearts",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293781",
          "region": "다날란",
          "npc": {
            "id": 2293781,
            "residentId": 1011057,
            "name": "하트 루트뷔다",
            "original": "Ruhtwyda of the Three Hearts",
            "location": "골드 소서",
            "region": "다날란",
            "x": "3.9",
            "y": "7.5",
            "quest": null,
            "ruleIds": [
              5,
              12
            ],
            "rules": [
              "연장전",
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293781"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "9,600 맨더빌 골드 소서 포인트",
          "original": "9,600 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/45"
        }
      ]
    },
    {
      "id": 46,
      "number": "No. 46",
      "order": 46,
      "deckOrder": 27,
      "ex": false,
      "name": "산크레드",
      "original": "Thancred",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 2,
        "right": 3,
        "bottom": 8,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088046_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/46.png",
      "link": "https://ffxivcollect.com/triad/cards/46",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8b581c58811",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293778,
          "name": "푸푸루파",
          "original": "Fufulupa",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "서부 다날란",
          "link": "https://ffxivcollect.com/triad/npcs/2293778",
          "region": "다날란",
          "npc": {
            "id": 2293778,
            "residentId": 1002058,
            "name": "푸푸루파",
            "original": "Fufulupa",
            "location": "서부 다날란",
            "region": "다날란",
            "x": "22.6",
            "y": "17.1",
            "quest": {
              "name": "마른뼈 야영지로",
              "original": "A Wild Rose by Any Other Name",
              "link": "https://www.garlandtools.org/db/#quest/66046"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293778"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293789,
          "name": "하브",
          "original": "Hab",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "남부 다날란",
          "link": "https://ffxivcollect.com/triad/npcs/2293789",
          "region": "다날란",
          "npc": {
            "id": 2293789,
            "residentId": 1004914,
            "name": "하브",
            "original": "Hab",
            "location": "남부 다날란",
            "region": "다날란",
            "x": "24.8",
            "y": "40.9",
            "quest": {
              "name": "서글픈 좀비",
              "original": "Zombies Are People Too",
              "link": "https://www.garlandtools.org/db/#quest/66558"
            },
            "ruleIds": [
              13
            ],
            "rules": [
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293789"
          }
        }
      ]
    },
    {
      "id": 47,
      "number": "No. 47",
      "order": 47,
      "deckOrder": 26,
      "ex": false,
      "name": "네로 톨 스카이와",
      "original": "Nero tol Scaeva",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 4,
        "right": 1,
        "bottom": 8,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088047_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/47.png",
      "link": "https://ffxivcollect.com/triad/cards/47",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/7bf7d4aacf4",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293790,
          "name": "나른해 보이는 제국 병사",
          "original": "Indolent Imperial",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "모르도나",
          "link": "https://ffxivcollect.com/triad/npcs/2293790",
          "region": "모르도나",
          "npc": {
            "id": 2293790,
            "residentId": 1011789,
            "name": "나른해 보이는 제국 병사",
            "original": "Indolent Imperial",
            "location": "모르도나",
            "region": "모르도나",
            "x": "11.9",
            "y": "17.4",
            "quest": null,
            "ruleIds": [
              12
            ],
            "rules": [
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293790"
          }
        }
      ]
    },
    {
      "id": 48,
      "number": "No. 48",
      "order": 48,
      "deckOrder": 27,
      "ex": false,
      "name": "파파리모 & 이다",
      "original": "Papalymo & Yda",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 8,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088048_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/48.png",
      "link": "https://ffxivcollect.com/triad/cards/48",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ef8208de564",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293787,
          "name": "쌍사당 대령 보르셀",
          "original": "Vorsaile Heuloix",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 신시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293787",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293787,
            "residentId": 1000168,
            "name": "쌍사당 대령 보르셀",
            "original": "Vorsaile Heuloix",
            "location": "그리다니아 신시가지",
            "region": "검은장막 숲",
            "x": "9.7",
            "y": "11.1",
            "quest": {
              "name": "부와 나라를 위하여",
              "original": "For Coin and Country",
              "link": "https://www.garlandtools.org/db/#quest/66221"
            },
            "ruleIds": [
              12
            ],
            "rules": [
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293787"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293783,
          "name": "버스카론",
          "original": "Buscarron",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 남부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293783",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293783,
            "residentId": 1000590,
            "name": "버스카론",
            "original": "Buscarron",
            "location": "검은장막 숲 남부삼림",
            "region": "검은장막 숲",
            "x": "18.1",
            "y": "19.8",
            "quest": {
              "name": "지옥 밑바닥에서 들리는 목소리",
              "original": "Into the Beast's Maw",
              "link": "https://www.garlandtools.org/db/#quest/66050"
            },
            "ruleIds": [
              8
            ],
            "rules": [
              "순서대로"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293783"
          }
        }
      ]
    },
    {
      "id": 49,
      "number": "No. 49",
      "order": 49,
      "deckOrder": 27,
      "ex": false,
      "name": "야슈톨라",
      "original": "Y'shtola",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 7,
        "right": 8,
        "bottom": 1,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088049_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/49.png",
      "link": "https://ffxivcollect.com/triad/cards/49",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/5da48a5f9cd",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293793,
          "name": "흑와단 대령 르아샤",
          "original": "R'ashaht Rhiki",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "림사 로민사 상층 갑판",
          "link": "https://ffxivcollect.com/triad/npcs/2293793",
          "region": "라노시아",
          "npc": {
            "id": 2293793,
            "residentId": 1003281,
            "name": "흑와단 대령 르아샤",
            "original": "R'ashaht Rhiki",
            "location": "림사 로민사 상층 갑판",
            "region": "라노시아",
            "x": "13.2",
            "y": "12.8",
            "quest": {
              "name": "부와 나라를 위하여",
              "original": "For Coin and Country",
              "link": "https://www.garlandtools.org/db/#quest/66221"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293793"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293792,
          "name": "게게루주",
          "original": "Gegeruju",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "동부 라노시아",
          "link": "https://ffxivcollect.com/triad/npcs/2293792",
          "region": "라노시아",
          "npc": {
            "id": 2293792,
            "residentId": 1006273,
            "name": "게게루주",
            "original": "Gegeruju",
            "location": "동부 라노시아",
            "region": "라노시아",
            "x": "33.8",
            "y": "30.5",
            "quest": {
              "name": "등불이 꺼진 날",
              "original": "All Good Things",
              "link": "https://www.garlandtools.org/db/#quest/66053"
            },
            "ruleIds": [
              5,
              14
            ],
            "rules": [
              "연장전",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293792"
          }
        }
      ]
    },
    {
      "id": 50,
      "number": "No. 50",
      "order": 50,
      "deckOrder": 27,
      "ex": false,
      "name": "위리앙제 오귀레",
      "original": "Urianger",
      "korean": true,
      "stars": 3,
      "patch": "2.51",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 8,
        "right": 1,
        "bottom": 4,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088050_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/50.png",
      "link": "https://ffxivcollect.com/triad/cards/50",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/3544bf44b3b",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293781,
          "name": "하트 루트뷔다",
          "original": "Ruhtwyda of the Three Hearts",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293781",
          "region": "다날란",
          "npc": {
            "id": 2293781,
            "residentId": 1011057,
            "name": "하트 루트뷔다",
            "original": "Ruhtwyda of the Three Hearts",
            "location": "골드 소서",
            "region": "다날란",
            "x": "3.9",
            "y": "7.5",
            "quest": null,
            "ruleIds": [
              5,
              12
            ],
            "rules": [
              "연장전",
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293781"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        }
      ]
    },
    {
      "id": 51,
      "number": "No. 51",
      "order": 51,
      "deckOrder": 36,
      "ex": false,
      "name": "알테마 웨폰",
      "original": "Ultima Weapon",
      "korean": true,
      "stars": 4,
      "patch": "2.51",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 7,
        "right": 8,
        "bottom": 9,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088051_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/51.png",
      "link": "https://ffxivcollect.com/triad/cards/51",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/098f382e006",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "플래티넘 트라이어드 팩",
          "original": "Platinum Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#5",
          "pack": {
            "id": 5,
            "name": "플래티넘 트라이어드 팩",
            "cost": 0,
            "link": "https://ffxivcollect.com/triad/packs#5"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 68,
          "name": "궁극의 환상 알테마 웨폰 파괴작전",
          "original": "The Minstrel's Ballad: Ultima's Bane",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/66ae49e0046",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 52,
      "number": "No. 52",
      "order": 52,
      "deckOrder": 35,
      "ex": false,
      "name": "오딘",
      "original": "Odin",
      "korean": true,
      "stars": 4,
      "patch": "2.51",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 8,
        "right": 8,
        "bottom": 1,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088052_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/52.png",
      "link": "https://ffxivcollect.com/triad/cards/52",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e726810ff1e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293785,
          "name": "랑드넬",
          "original": "Landenel",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 남부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293785",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293785,
            "residentId": 1006279,
            "name": "랑드넬",
            "original": "Landenel",
            "location": "검은장막 숲 남부삼림",
            "region": "검은장막 숲",
            "x": "16.8",
            "y": "28.2",
            "quest": {
              "name": "등불이 꺼진 날",
              "original": "All Good Things",
              "link": "https://www.garlandtools.org/db/#quest/66053"
            },
            "ruleIds": [
              9,
              11
            ],
            "rules": [
              "무작위 순서",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293785"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "미스라이트 트라이어드 팩",
          "original": "Mythril Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#4",
          "pack": {
            "id": 4,
            "name": "미스라이트 트라이어드 팩",
            "cost": 8000,
            "link": "https://ffxivcollect.com/triad/packs#4"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 82,
          "name": "투신 오딘 토벌전",
          "original": "Urth's Fount",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/5f3f910214e",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 53,
      "number": "No. 53",
      "order": 53,
      "deckOrder": 35,
      "ex": false,
      "name": "라무",
      "original": "Ramuh",
      "korean": true,
      "stars": 4,
      "patch": "2.51",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 8,
        "right": 1,
        "bottom": 8,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088053_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/53.png",
      "link": "https://ffxivcollect.com/triad/cards/53",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/52c81d43121",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293787,
          "name": "쌍사당 대령 보르셀",
          "original": "Vorsaile Heuloix",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 신시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293787",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293787,
            "residentId": 1000168,
            "name": "쌍사당 대령 보르셀",
            "original": "Vorsaile Heuloix",
            "location": "그리다니아 신시가지",
            "region": "검은장막 숲",
            "x": "9.7",
            "y": "11.1",
            "quest": {
              "name": "부와 나라를 위하여",
              "original": "For Coin and Country",
              "link": "https://www.garlandtools.org/db/#quest/66221"
            },
            "ruleIds": [
              12
            ],
            "rules": [
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293787"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 77,
          "name": "진 라무 토벌전",
          "original": "The Striking Tree (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/ed444c7acd3",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 78,
          "name": "극 라무 토벌전",
          "original": "The Striking Tree (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/cefca6483e5",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 54,
      "number": "No. 54",
      "order": 54,
      "deckOrder": 35,
      "ex": false,
      "name": "리바이어선",
      "original": "Leviathan",
      "korean": true,
      "stars": 4,
      "patch": "2.51",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 8,
        "right": 8,
        "bottom": 8,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088054_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/54.png",
      "link": "https://ffxivcollect.com/triad/cards/54",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f08035f6b5b",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293793,
          "name": "흑와단 대령 르아샤",
          "original": "R'ashaht Rhiki",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "림사 로민사 상층 갑판",
          "link": "https://ffxivcollect.com/triad/npcs/2293793",
          "region": "라노시아",
          "npc": {
            "id": 2293793,
            "residentId": 1003281,
            "name": "흑와단 대령 르아샤",
            "original": "R'ashaht Rhiki",
            "location": "림사 로민사 상층 갑판",
            "region": "라노시아",
            "x": "13.2",
            "y": "12.8",
            "quest": {
              "name": "부와 나라를 위하여",
              "original": "For Coin and Country",
              "link": "https://www.garlandtools.org/db/#quest/66221"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293793"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 72,
          "name": "진 리바이어선 토벌전",
          "original": "The *Whorleater* (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/7cf438b6efe",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 73,
          "name": "극 리바이어선 토벌전",
          "original": "The *Whorleater* (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/e804f3b8b97",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 55,
      "number": "No. 55",
      "order": 55,
      "deckOrder": 35,
      "ex": false,
      "name": "시바",
      "original": "Shiva",
      "korean": true,
      "stars": 4,
      "patch": "2.51",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 1,
        "right": 8,
        "bottom": 8,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088055_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/55.png",
      "link": "https://ffxivcollect.com/triad/cards/55",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b63559ecac9",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "플래티넘 트라이어드 팩",
          "original": "Platinum Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#5",
          "pack": {
            "id": 5,
            "name": "플래티넘 트라이어드 팩",
            "cost": 0,
            "link": "https://ffxivcollect.com/triad/packs#5"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 79,
          "name": "진 시바 토벌전",
          "original": "The Akh Afah Amphitheatre (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/e144969a90a",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 80,
          "name": "극 시바 토벌전",
          "original": "The Akh Afah Amphitheatre (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/4bf35b95f14",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 56,
      "number": "No. 56",
      "order": 56,
      "deckOrder": 37,
      "ex": false,
      "name": "민필리아",
      "original": "Minfilia",
      "korean": true,
      "stars": 4,
      "patch": "2.51",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 9,
        "right": 8,
        "bottom": 3,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088056_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/56.png",
      "link": "https://ffxivcollect.com/triad/cards/56",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/36889a54592",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293792,
          "name": "게게루주",
          "original": "Gegeruju",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "동부 라노시아",
          "link": "https://ffxivcollect.com/triad/npcs/2293792",
          "region": "라노시아",
          "npc": {
            "id": 2293792,
            "residentId": 1006273,
            "name": "게게루주",
            "original": "Gegeruju",
            "location": "동부 라노시아",
            "region": "라노시아",
            "x": "33.8",
            "y": "30.5",
            "quest": {
              "name": "등불이 꺼진 날",
              "original": "All Good Things",
              "link": "https://www.garlandtools.org/db/#quest/66053"
            },
            "ruleIds": [
              5,
              14
            ],
            "rules": [
              "연장전",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293792"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        }
      ]
    },
    {
      "id": 57,
      "number": "No. 57",
      "order": 57,
      "deckOrder": 38,
      "ex": false,
      "name": "아씨엔 라하브레아",
      "original": "Lahabrea",
      "korean": true,
      "stars": 4,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 9,
        "bottom": 4,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088057_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/57.png",
      "link": "https://ffxivcollect.com/triad/cards/57",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/adb2a64e8b9",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "플래티넘 트라이어드 팩",
          "original": "Platinum Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#5",
          "pack": {
            "id": 5,
            "name": "플래티넘 트라이어드 팩",
            "cost": 0,
            "link": "https://ffxivcollect.com/triad/packs#5"
          }
        }
      ]
    },
    {
      "id": 58,
      "number": "No. 58",
      "order": 58,
      "deckOrder": 38,
      "ex": false,
      "name": "시드 갈론드",
      "original": "Cid Garlond",
      "korean": true,
      "stars": 4,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 9,
        "bottom": 9,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088058_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/58.png",
      "link": "https://ffxivcollect.com/triad/cards/58",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/89b4e8f7614",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293784,
          "name": "세즐 토톨록",
          "original": "Sezul Totoloc",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 북부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293784",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293784,
            "residentId": 1009199,
            "name": "세즐 토톨록",
            "original": "Sezul Totoloc",
            "location": "검은장막 숲 북부삼림",
            "region": "검은장막 숲",
            "x": "24.4",
            "y": "23.4",
            "quest": {
              "name": " 날개를 펼쳐 누구보다 높이 날아라",
              "original": "Spread Your Wings and Soar",
              "link": "https://www.garlandtools.org/db/#quest/67029"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293784"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        }
      ]
    },
    {
      "id": 59,
      "number": "No. 59",
      "order": 59,
      "deckOrder": 37,
      "ex": false,
      "name": "알피노 & 알리제",
      "original": "Alphinaud & Alisaie",
      "korean": true,
      "stars": 4,
      "patch": "2.51",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 9,
        "right": 3,
        "bottom": 3,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088059_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/59.png",
      "link": "https://ffxivcollect.com/triad/cards/59",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f0adc4c568e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293788,
          "name": "불멸대 대령 스위프트",
          "original": "Swift",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 날 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293788",
          "region": "다날란",
          "npc": {
            "id": 2293788,
            "residentId": 1004576,
            "name": "불멸대 대령 스위프트",
            "original": "Swift",
            "location": "울다하 날 회랑",
            "region": "다날란",
            "x": "8.4",
            "y": "8.9",
            "quest": {
              "name": "부와 나라를 위하여",
              "original": "For Coin and Country",
              "link": "https://www.garlandtools.org/db/#quest/66221"
            },
            "ruleIds": [
              9
            ],
            "rules": [
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293788"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293772,
          "name": "조엘로",
          "original": "Joellaut",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "커르다스 중앙고지",
          "link": "https://ffxivcollect.com/triad/npcs/2293772",
          "region": "커르다스",
          "npc": {
            "id": 2293772,
            "residentId": 1006466,
            "name": "조엘로",
            "original": "Joellaut",
            "location": "커르다스 중앙고지",
            "region": "커르다스",
            "x": "13.3",
            "y": "15.5",
            "quest": null,
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293772"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "플래티넘 트라이어드 팩",
          "original": "Platinum Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#5",
          "pack": {
            "id": 5,
            "name": "플래티넘 트라이어드 팩",
            "cost": 0,
            "link": "https://ffxivcollect.com/triad/packs#5"
          }
        }
      ]
    },
    {
      "id": 60,
      "number": "No. 60",
      "order": 60,
      "deckOrder": 37,
      "ex": false,
      "name": "루이수아 르베유르",
      "original": "Louisoix Leveilleur",
      "korean": true,
      "stars": 4,
      "patch": "2.51",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 9,
        "right": 4,
        "bottom": 9,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088060_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/60.png",
      "link": "https://ffxivcollect.com/triad/cards/60",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e48bf1febe7",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293791,
          "name": "로웨나",
          "original": "Rowena",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "모르도나",
          "link": "https://ffxivcollect.com/triad/npcs/2293791",
          "region": "모르도나",
          "npc": {
            "id": 2293791,
            "residentId": 1001304,
            "name": "로웨나",
            "original": "Rowena",
            "location": "모르도나",
            "region": "모르도나",
            "x": "22.0",
            "y": "5.0",
            "quest": {
              "name": "전설의 무기 장인",
              "original": "The Weaponsmith of Legend",
              "link": "https://www.garlandtools.org/db/#quest/66241"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293791"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "플래티넘 트라이어드 팩",
          "original": "Platinum Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#5",
          "pack": {
            "id": 5,
            "name": "플래티넘 트라이어드 팩",
            "cost": 0,
            "link": "https://ffxivcollect.com/triad/packs#5"
          }
        }
      ]
    },
    {
      "id": 61,
      "number": "No. 61",
      "order": 61,
      "deckOrder": 42,
      "ex": false,
      "name": "바하무트",
      "original": "Bahamut",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 9,
        "right": 5,
        "bottom": 9,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088061_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/61.png",
      "link": "https://ffxivcollect.com/triad/cards/61",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/7c6d3e57828",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293786,
          "name": "킹 엘머",
          "original": "King Elmer III",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293786",
          "region": "다날란",
          "npc": {
            "id": 2293786,
            "residentId": 1011055,
            "name": "킹 엘머",
            "original": "King Elmer III",
            "location": "골드 소서",
            "region": "다날란",
            "x": "3.8",
            "y": "7.8",
            "quest": null,
            "ruleIds": [
              6
            ],
            "rules": [
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293786"
          }
        }
      ]
    },
    {
      "id": 62,
      "number": "No. 62",
      "order": 62,
      "deckOrder": 45,
      "ex": false,
      "name": "힐디브랜드 & 나슈 마카라카",
      "original": "Hildibrand & Nashu Mhakaracca",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 8,
        "bottom": 10,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088062_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/62.png",
      "link": "https://ffxivcollect.com/triad/cards/62",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/47dd153168a",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293789,
          "name": "하브",
          "original": "Hab",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "남부 다날란",
          "link": "https://ffxivcollect.com/triad/npcs/2293789",
          "region": "다날란",
          "npc": {
            "id": 2293789,
            "residentId": 1004914,
            "name": "하브",
            "original": "Hab",
            "location": "남부 다날란",
            "region": "다날란",
            "x": "24.8",
            "y": "40.9",
            "quest": {
              "name": "서글픈 좀비",
              "original": "Zombies Are People Too",
              "link": "https://www.garlandtools.org/db/#quest/66558"
            },
            "ruleIds": [
              13
            ],
            "rules": [
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293789"
          }
        }
      ]
    },
    {
      "id": 63,
      "number": "No. 63",
      "order": 63,
      "deckOrder": 46,
      "ex": false,
      "name": "나나모 울 나모",
      "original": "Nanamo Ul Namo",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 6,
        "bottom": 4,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088063_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/63.png",
      "link": "https://ffxivcollect.com/triad/cards/63",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8b383ef7915",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "400,000 맨더빌 골드 소서 포인트",
          "original": "400,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/63"
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "플래티넘 트라이어드 팩",
          "original": "Platinum Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#5",
          "pack": {
            "id": 5,
            "name": "플래티넘 트라이어드 팩",
            "cost": 0,
            "link": "https://ffxivcollect.com/triad/packs#5"
          }
        }
      ]
    },
    {
      "id": 64,
      "number": "No. 64",
      "order": 64,
      "deckOrder": 43,
      "ex": false,
      "name": "가이우스 반 바일사르",
      "original": "Gaius van Baelsar",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 4,
        "right": 10,
        "bottom": 5,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088064_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/64.png",
      "link": "https://ffxivcollect.com/triad/cards/64",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d43a665cd90",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293790,
          "name": "나른해 보이는 제국 병사",
          "original": "Indolent Imperial",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "모르도나",
          "link": "https://ffxivcollect.com/triad/npcs/2293790",
          "region": "모르도나",
          "npc": {
            "id": 2293790,
            "residentId": 1011789,
            "name": "나른해 보이는 제국 병사",
            "original": "Indolent Imperial",
            "location": "모르도나",
            "region": "모르도나",
            "x": "11.9",
            "y": "17.4",
            "quest": null,
            "ruleIds": [
              12
            ],
            "rules": [
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293790"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 16,
          "name": "마도성 프라이토리움",
          "original": "The Praetorium",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/9937aa5a421",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 65,
      "number": "No. 65",
      "order": 65,
      "deckOrder": 45,
      "ex": false,
      "name": "멜위브 블루피쉰",
      "original": "Merlwyb Bloefhiswyn",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 9,
        "bottom": 10,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088065_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/65.png",
      "link": "https://ffxivcollect.com/triad/cards/65",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ff7c454eb22",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293819,
          "name": "모딘",
          "original": "Mordyn",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "림사 로민사 상층 갑판",
          "link": "https://ffxivcollect.com/triad/npcs/2293819",
          "region": "라노시아",
          "npc": {
            "id": 2293819,
            "residentId": 1000916,
            "name": "모딘",
            "original": "Mordyn",
            "location": "림사 로민사 상층 갑판",
            "region": "라노시아",
            "x": "11.3",
            "y": "7.9",
            "quest": {
              "name": "거친 파도 넘나드는 난파선의 섬",
              "original": "Storming the Hull",
              "link": "https://www.garlandtools.org/db/#quest/67784"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293819"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293818,
          "name": "오칼카야",
          "original": "O'kalkaya",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "림사 로민사 상층 갑판",
          "link": "https://ffxivcollect.com/triad/npcs/2293818",
          "region": "라노시아",
          "npc": {
            "id": 2293818,
            "residentId": 1000919,
            "name": "오칼카야",
            "original": "O'kalkaya",
            "location": "림사 로민사 상층 갑판",
            "region": "라노시아",
            "x": "12.2",
            "y": "14.0",
            "quest": {
              "name": "거친 파도 넘나드는 난파선의 섬",
              "original": "Storming the Hull",
              "link": "https://www.garlandtools.org/db/#quest/67784"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293818"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293793,
          "name": "흑와단 대령 르아샤",
          "original": "R'ashaht Rhiki",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "림사 로민사 상층 갑판",
          "link": "https://ffxivcollect.com/triad/npcs/2293793",
          "region": "라노시아",
          "npc": {
            "id": 2293793,
            "residentId": 1003281,
            "name": "흑와단 대령 르아샤",
            "original": "R'ashaht Rhiki",
            "location": "림사 로민사 상층 갑판",
            "region": "라노시아",
            "x": "13.2",
            "y": "12.8",
            "quest": {
              "name": "부와 나라를 위하여",
              "original": "For Coin and Country",
              "link": "https://www.garlandtools.org/db/#quest/66221"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293793"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        }
      ]
    },
    {
      "id": 66,
      "number": "No. 66",
      "order": 66,
      "deckOrder": 45,
      "ex": false,
      "name": "카느 에 센나",
      "original": "Kan-E-Senna",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 10,
        "bottom": 1,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088066_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/66.png",
      "link": "https://ffxivcollect.com/triad/cards/66",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bd21476affc",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293787,
          "name": "쌍사당 대령 보르셀",
          "original": "Vorsaile Heuloix",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 신시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293787",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293787,
            "residentId": 1000168,
            "name": "쌍사당 대령 보르셀",
            "original": "Vorsaile Heuloix",
            "location": "그리다니아 신시가지",
            "region": "검은장막 숲",
            "x": "9.7",
            "y": "11.1",
            "quest": {
              "name": "부와 나라를 위하여",
              "original": "For Coin and Country",
              "link": "https://www.garlandtools.org/db/#quest/66221"
            },
            "ruleIds": [
              12
            ],
            "rules": [
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293787"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        }
      ]
    },
    {
      "id": 67,
      "number": "No. 67",
      "order": 67,
      "deckOrder": 45,
      "ex": false,
      "name": "라우반 알딘",
      "original": "Raubahn Aldynn",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 2,
        "bottom": 9,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088067_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/67.png",
      "link": "https://ffxivcollect.com/triad/cards/67",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/845209ec92d",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293788,
          "name": "불멸대 대령 스위프트",
          "original": "Swift",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 날 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293788",
          "region": "다날란",
          "npc": {
            "id": 2293788,
            "residentId": 1004576,
            "name": "불멸대 대령 스위프트",
            "original": "Swift",
            "location": "울다하 날 회랑",
            "region": "다날란",
            "x": "8.4",
            "y": "8.9",
            "quest": {
              "name": "부와 나라를 위하여",
              "original": "For Coin and Country",
              "link": "https://www.garlandtools.org/db/#quest/66221"
            },
            "ruleIds": [
              9
            ],
            "rules": [
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293788"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        }
      ]
    },
    {
      "id": 81,
      "number": "No. 68",
      "order": 68,
      "deckOrder": 1,
      "ex": false,
      "name": "게일리캣",
      "original": "Gaelicat",
      "korean": true,
      "stars": 1,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 1,
        "bottom": 1,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088081_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/81.png",
      "link": "https://ffxivcollect.com/triad/cards/81",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/93e0f86c45d",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293795,
          "name": "노에스",
          "original": "Noes",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 구시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293795",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293795,
            "residentId": 1000282,
            "name": "노에스",
            "original": "Noes",
            "location": "그리다니아 구시가지",
            "region": "검은장막 숲",
            "x": "10.6",
            "y": "5.5",
            "quest": null,
            "ruleIds": [
              6,
              13
            ],
            "rules": [
              "합산",
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293795"
          }
        }
      ]
    },
    {
      "id": 82,
      "number": "No. 69",
      "order": 69,
      "deckOrder": 10,
      "ex": false,
      "name": "바누바누",
      "original": "Vanu Vanu",
      "korean": true,
      "stars": 2,
      "patch": "3.0",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 2,
        "right": 6,
        "bottom": 4,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088082_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/82.png",
      "link": "https://ffxivcollect.com/triad/cards/82",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/83f9a744a6e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293804,
          "name": "모그밀",
          "original": "Mogmill",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "드라바니아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293804",
          "region": "드라바니아",
          "npc": {
            "id": 2293804,
            "residentId": 1012085,
            "name": "모그밀",
            "original": "Mogmill",
            "location": "드라바니아 구름바다",
            "region": "드라바니아",
            "x": "28.3",
            "y": "35.4",
            "quest": {
              "name": "숨겨진 명당",
              "original": "A Secret from Everyone",
              "link": "https://www.garlandtools.org/db/#quest/67376"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293804"
          }
        }
      ]
    },
    {
      "id": 83,
      "number": "No. 70",
      "order": 70,
      "deckOrder": 10,
      "ex": false,
      "name": "그나스",
      "original": "Gnath",
      "korean": true,
      "stars": 2,
      "patch": "3.0",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 6,
        "right": 3,
        "bottom": 7,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088083_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/83.png",
      "link": "https://ffxivcollect.com/triad/cards/83",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/250a794c556",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293804,
          "name": "모그밀",
          "original": "Mogmill",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "드라바니아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293804",
          "region": "드라바니아",
          "npc": {
            "id": 2293804,
            "residentId": 1012085,
            "name": "모그밀",
            "original": "Mogmill",
            "location": "드라바니아 구름바다",
            "region": "드라바니아",
            "x": "28.3",
            "y": "35.4",
            "quest": {
              "name": "숨겨진 명당",
              "original": "A Secret from Everyone",
              "link": "https://www.garlandtools.org/db/#quest/67376"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293804"
          }
        }
      ]
    },
    {
      "id": 84,
      "number": "No. 71",
      "order": 71,
      "deckOrder": 15,
      "ex": false,
      "name": "안개의 유우기리",
      "original": "Yugiri Mistwalker",
      "korean": true,
      "stars": 2,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 7,
        "bottom": 1,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088084_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/84.png",
      "link": "https://ffxivcollect.com/triad/cards/84",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/83cd06f1c1e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293796,
          "name": "노란 달",
          "original": "Yellow Moon",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 달 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293796",
          "region": "다날란",
          "npc": {
            "id": 2293796,
            "residentId": 1001691,
            "name": "노란 달",
            "original": "Yellow Moon",
            "location": "울다하 달 회랑",
            "region": "다날란",
            "x": "14.1",
            "y": "13.3",
            "quest": null,
            "ruleIds": [
              12,
              14
            ],
            "rules": [
              "유형 강화",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293796"
          }
        }
      ]
    },
    {
      "id": 85,
      "number": "No. 72",
      "order": 72,
      "deckOrder": 9,
      "ex": false,
      "name": "뚱보초코보",
      "original": "Fat Chocobo",
      "korean": true,
      "stars": 2,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 5,
        "bottom": 5,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088085_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/85.png",
      "link": "https://ffxivcollect.com/triad/cards/85",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8c5a5eb624f",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293813,
          "name": "으뜸이",
          "original": "Vath Deftarm",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "고지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293813",
          "region": "드라바니아",
          "npc": {
            "id": 2293813,
            "residentId": 1016802,
            "name": "으뜸이",
            "original": "Vath Deftarm",
            "location": "고지 드라바니아",
            "region": "드라바니아",
            "x": "23.6",
            "y": "19.1",
            "quest": {
              "name": "끊어진 이야기",
              "original": "A Symbiotic Friendship",
              "link": "https://www.garlandtools.org/db/#quest/67796"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293813"
          }
        },
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "돌발임무 \"강습하는 갑룡\" - 고지 드라바니아",
          "original": "FATE \"Special Tarasque Force\" - The Dravanian Forelands",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/85"
        }
      ]
    },
    {
      "id": 86,
      "number": "No. 73",
      "order": 73,
      "deckOrder": 19,
      "ex": false,
      "name": "그리핀",
      "original": "Griffin",
      "korean": true,
      "stars": 3,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 1,
        "bottom": 7,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088086_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/86.png",
      "link": "https://ffxivcollect.com/triad/cards/86",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/998c4ddbc45",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293807,
          "name": "도미니아크",
          "original": "Dominiac",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "커르다스 서부고지",
          "link": "https://ffxivcollect.com/triad/npcs/2293807",
          "region": "커르다스",
          "npc": {
            "id": 2293807,
            "residentId": 1013710,
            "name": "도미니아크",
            "original": "Dominiac",
            "location": "커르다스 서부고지",
            "region": "커르다스",
            "x": "16.6",
            "y": "22.6",
            "quest": {
              "name": "끝없는 전쟁",
              "original": "A War without End",
              "link": "https://www.garlandtools.org/db/#quest/67434"
            },
            "ruleIds": [
              8
            ],
            "rules": [
              "순서대로"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293807"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293825,
          "name": "어칸발드",
          "original": "Ercanbald",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "랄거의 손길",
          "link": "https://ffxivcollect.com/triad/npcs/2293825",
          "region": "기라바니아",
          "npc": {
            "id": 2293825,
            "residentId": 1019465,
            "name": "어칸발드",
            "original": "Ercanbald",
            "location": "랄거의 손길",
            "region": "기라바니아",
            "x": "9.8",
            "y": "9.7",
            "quest": {
              "name": "파괴신의 손길이 닿는 곳",
              "original": "A Haven for the Bold",
              "link": "https://www.garlandtools.org/db/#quest/67985"
            },
            "ruleIds": [],
            "rules": [],
            "link": "https://ffxivcollect.com/triad/npcs/2293825"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 36,
          "name": "어스름 요새",
          "original": "The Dusk Vigil",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/d5736022993",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 87,
      "number": "No. 74",
      "order": 74,
      "deckOrder": 19,
      "ex": false,
      "name": "티오만",
      "original": "Tioman",
      "korean": true,
      "stars": 3,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 5,
        "bottom": 8,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088087_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/87.png",
      "link": "https://ffxivcollect.com/triad/cards/87",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/66309abfefd",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 37,
          "name": "솜 알",
          "original": "Sohm Al",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/5ea4ee6dacd",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 88,
      "number": "No. 75",
      "order": 75,
      "deckOrder": 29,
      "ex": false,
      "name": "에스티니앙",
      "original": "Estinien",
      "korean": true,
      "stars": 3,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 8,
        "bottom": 2,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088088_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/88.png",
      "link": "https://ffxivcollect.com/triad/cards/88",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/826bcdef9f7",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293799,
          "name": "지브리옹",
          "original": "Gibrillont",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "이슈가르드 하층",
          "link": "https://ffxivcollect.com/triad/npcs/2293799",
          "region": "커르다스",
          "npc": {
            "id": 2293799,
            "residentId": 1011192,
            "name": "지브리옹",
            "original": "Gibrillont",
            "location": "이슈가르드 하층",
            "region": "커르다스",
            "x": "13.0",
            "y": "11.9",
            "quest": {
              "name": "뒤엉키는 안개",
              "original": "The Better Half",
              "link": "https://www.garlandtools.org/db/#quest/67118"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293799"
          }
        }
      ]
    },
    {
      "id": 89,
      "number": "No. 76",
      "order": 76,
      "deckOrder": 29,
      "ex": false,
      "name": "루키아",
      "original": "Lucia goe Junius",
      "korean": true,
      "stars": 3,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 2,
        "bottom": 3,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088089_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/89.png",
      "link": "https://ffxivcollect.com/triad/cards/89",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ab33ac55497",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293797,
          "name": "와와라고",
          "original": "Wawalago",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "림사 로민사 하층 갑판",
          "link": "https://ffxivcollect.com/triad/npcs/2293797",
          "region": "라노시아",
          "npc": {
            "id": 2293797,
            "residentId": 1000856,
            "name": "와와라고",
            "original": "Wawalago",
            "location": "림사 로민사 하층 갑판",
            "region": "라노시아",
            "x": "8.1",
            "y": "15.3",
            "quest": null,
            "ruleIds": [
              9,
              14
            ],
            "rules": [
              "무작위 순서",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293797"
          }
        }
      ]
    },
    {
      "id": 90,
      "number": "No. 77",
      "order": 77,
      "deckOrder": 29,
      "ex": false,
      "name": "이젤",
      "original": "Ysayle",
      "korean": true,
      "stars": 3,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 8,
        "bottom": 8,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088090_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/90.png",
      "link": "https://ffxivcollect.com/triad/cards/90",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/de2efec02c7",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293800,
          "name": "마르스샹",
          "original": "Marcechamp",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "고지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293800",
          "region": "드라바니아",
          "npc": {
            "id": 2293800,
            "residentId": 1011916,
            "name": "마르스샹",
            "original": "Marcechamp",
            "location": "고지 드라바니아",
            "region": "드라바니아",
            "x": "31.9",
            "y": "22.9",
            "quest": {
              "name": "낙오자가 좋아하는 것",
              "original": "Gifts for the Outcasts",
              "link": "https://www.garlandtools.org/db/#quest/67148"
            },
            "ruleIds": [
              6,
              10
            ],
            "rules": [
              "합산",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293800"
          }
        }
      ]
    },
    {
      "id": 91,
      "number": "No. 78",
      "order": 78,
      "deckOrder": 29,
      "ex": false,
      "name": "힐다",
      "original": "Hilda",
      "korean": true,
      "stars": 3,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 4,
        "bottom": 8,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088091_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/91.png",
      "link": "https://ffxivcollect.com/triad/cards/91",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c382cb74797",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293803,
          "name": "지루해 보이는 제국병",
          "original": "Idle Imperial",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아지스 라",
          "link": "https://ffxivcollect.com/triad/npcs/2293803",
          "region": "아발라시아",
          "npc": {
            "id": 2293803,
            "residentId": 1015021,
            "name": "지루해 보이는 제국병",
            "original": "Idle Imperial",
            "location": "아지스 라",
            "region": "아발라시아",
            "x": "28.1",
            "y": "31.2",
            "quest": {
              "name": "새로운 날개 엑셀시어",
              "original": "The First Flight of the Excelsior",
              "link": "https://www.garlandtools.org/db/#quest/67199"
            },
            "ruleIds": [
              9,
              14
            ],
            "rules": [
              "무작위 순서",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293803"
          }
        }
      ]
    },
    {
      "id": 92,
      "number": "No. 79",
      "order": 79,
      "deckOrder": 29,
      "ex": false,
      "name": "마토야",
      "original": "Matoya",
      "korean": true,
      "stars": 3,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 3,
        "bottom": 8,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088092_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/92.png",
      "link": "https://ffxivcollect.com/triad/cards/92",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/11e3060f4dd",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293802,
          "name": "한밤의 이슬",
          "original": "Midnight Dew",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "이딜샤이어",
          "link": "https://ffxivcollect.com/triad/npcs/2293802",
          "region": "드라바니아",
          "npc": {
            "id": 2293802,
            "residentId": 1012133,
            "name": "한밤의 이슬",
            "original": "Midnight Dew",
            "location": "이딜샤이어",
            "region": "드라바니아",
            "x": "5.6",
            "y": "6.7",
            "quest": {
              "name": "쌓아온 것을 지키기 위해",
              "original": "Over My Dead Gobbie",
              "link": "https://www.garlandtools.org/db/#quest/67501"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293802"
          }
        }
      ]
    },
    {
      "id": 93,
      "number": "No. 80",
      "order": 80,
      "deckOrder": 29,
      "ex": false,
      "name": "에드몽 드 포르탕",
      "original": "Count Edmont de Fortemps",
      "korean": true,
      "stars": 3,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 8,
        "bottom": 3,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088093_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/93.png",
      "link": "https://ffxivcollect.com/triad/cards/93",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/cec9427fac8",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293801,
          "name": "마리엘",
          "original": "Marielle",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아발라시아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293801",
          "region": "아발라시아",
          "npc": {
            "id": 2293801,
            "residentId": 1012060,
            "name": "마리엘",
            "original": "Marielle",
            "location": "아발라시아 구름바다",
            "region": "아발라시아",
            "x": "15.4",
            "y": "37.7",
            "quest": {
              "name": "말썽꾸러기 다루는 법 2",
              "original": "A Reward Long in Coming",
              "link": "https://www.garlandtools.org/db/#quest/67132"
            },
            "ruleIds": [
              8
            ],
            "rules": [
              "순서대로"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293801"
          }
        }
      ]
    },
    {
      "id": 94,
      "number": "No. 81",
      "order": 81,
      "deckOrder": 19,
      "ex": false,
      "name": "비블로스",
      "original": "Byblos",
      "korean": true,
      "stars": 3,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 4,
        "bottom": 1,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088094_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/94.png",
      "link": "https://ffxivcollect.com/triad/cards/94",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/9f90fcf310d",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293845,
          "name": "메로 록고",
          "original": "Mero Roggo",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "저지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293845",
          "region": "드라바니아",
          "npc": {
            "id": 2293845,
            "residentId": 1027209,
            "name": "메로 록고",
            "original": "Mero Roggo",
            "location": "저지 드라바니아",
            "region": "드라바니아",
            "x": "12.8",
            "y": "36.8",
            "quest": {
              "name": "광란의 전주곡",
              "original": "Prelude in Violet",
              "link": "https://www.garlandtools.org/db/#quest/68685"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293845"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 31,
          "name": "구브라 환상도서관",
          "original": "The Great Gubal Library",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/d3e0bd0074e",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 95,
      "number": "No. 82",
      "order": 82,
      "deckOrder": 29,
      "ex": false,
      "name": "오르슈팡",
      "original": "Haurchefant",
      "korean": true,
      "stars": 3,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 1,
        "bottom": 5,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088095_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/95.png",
      "link": "https://ffxivcollect.com/triad/cards/95",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/9c8eef4882a",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 1373,
          "name": "길거리 듀얼리스트: 3단계",
          "original": "Triple Team III",
          "method": "트리플 트라이어드로 NPC 41명에게 승리",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EA%B8%B8%EA%B1%B0%EB%A6%AC%20%EB%93%80%EC%96%BC%EB%A6%AC%EC%8A%A4%ED%8A%B8%3A%203%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 96,
      "number": "No. 83",
      "order": 83,
      "deckOrder": 39,
      "ex": false,
      "name": "아이메리크",
      "original": "Aymeric",
      "korean": true,
      "stars": 4,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 5,
        "bottom": 9,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088096_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/96.png",
      "link": "https://ffxivcollect.com/triad/cards/96",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/82e7a2cf18e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293798,
          "name": "야야케",
          "original": "Yayake",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 날 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293798",
          "region": "다날란",
          "npc": {
            "id": 2293798,
            "residentId": 1002279,
            "name": "야야케",
            "original": "Yayake",
            "location": "울다하 날 회랑",
            "region": "다날란",
            "x": "7.3",
            "y": "12.4",
            "quest": null,
            "ruleIds": [
              1,
              9
            ],
            "rules": [
              "무작위 규칙",
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293798"
          }
        }
      ]
    },
    {
      "id": 97,
      "number": "No. 84",
      "order": 84,
      "deckOrder": 35,
      "ex": false,
      "name": "라바나",
      "original": "Ravana",
      "korean": true,
      "stars": 4,
      "patch": "3.0",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 9,
        "right": 7,
        "bottom": 8,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088097_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/97.png",
      "link": "https://ffxivcollect.com/triad/cards/97",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e41ce3612d1",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293813,
          "name": "으뜸이",
          "original": "Vath Deftarm",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "고지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293813",
          "region": "드라바니아",
          "npc": {
            "id": 2293813,
            "residentId": 1016802,
            "name": "으뜸이",
            "original": "Vath Deftarm",
            "location": "고지 드라바니아",
            "region": "드라바니아",
            "x": "23.6",
            "y": "19.1",
            "quest": {
              "name": "끊어진 이야기",
              "original": "A Symbiotic Friendship",
              "link": "https://www.garlandtools.org/db/#quest/67796"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293813"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 86,
          "name": "진 라바나 토벌전",
          "original": "Thok ast Thok (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/37b1cff3e79",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 87,
          "name": "극 라바나 토벌전",
          "original": "Thok ast Thok (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/f9413653e56",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 98,
      "number": "No. 85",
      "order": 85,
      "deckOrder": 35,
      "ex": false,
      "name": "비스마르크",
      "original": "Bismarck",
      "korean": true,
      "stars": 4,
      "patch": "3.0",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 1,
        "right": 9,
        "bottom": 7,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088098_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/98.png",
      "link": "https://ffxivcollect.com/triad/cards/98",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ed4857cebbb",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293812,
          "name": "리누바리",
          "original": "Linu Vali",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아발라시아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293812",
          "region": "아발라시아",
          "npc": {
            "id": 2293812,
            "residentId": 1016087,
            "name": "리누바리",
            "original": "Linu Vali",
            "location": "아발라시아 구름바다",
            "region": "아발라시아",
            "x": "6.6",
            "y": "14.3",
            "quest": {
              "name": "적절한 비유",
              "original": "The Nest of Honor",
              "link": "https://www.garlandtools.org/db/#quest/67761"
            },
            "ruleIds": [
              9,
              10
            ],
            "rules": [
              "무작위 순서",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293812"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 88,
          "name": "진 비스마르크 토벌전",
          "original": "The Limitless Blue (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/5f1b4362363",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 89,
          "name": "극 비스마르크 토벌전",
          "original": "The Limitless Blue (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/326a8edafad",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 99,
      "number": "No. 86",
      "order": 86,
      "deckOrder": 46,
      "ex": false,
      "name": "니드호그",
      "original": "Nidhogg",
      "korean": true,
      "stars": 5,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 7,
        "bottom": 3,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088099_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/99.png",
      "link": "https://ffxivcollect.com/triad/cards/99",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/fba92561f9d",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 39,
          "name": "용의 둥지",
          "original": "The Aery",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/a4b4baddeaa",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 169,
          "name": "니드호그 토벌전",
          "original": "The Final Steps of Faith",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/86cfd7a94a8",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 170,
          "name": "극 니드호그 토벌전",
          "original": "The Minstrel's Ballad: Nidhogg's Rage",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/5a3c9c4fa40",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 100,
      "number": "No. 87",
      "order": 87,
      "deckOrder": 47,
      "ex": false,
      "name": "미드가르드오름",
      "original": "Midgardsormr",
      "korean": true,
      "stars": 5,
      "patch": "3.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 8,
        "bottom": 10,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088100_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/100.png",
      "link": "https://ffxivcollect.com/triad/cards/100",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/170de9373cd",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 1372,
          "name": "카드 수집가: 4단계",
          "original": "Triple-decker IV",
          "method": "트리플 트라이어드 카드 90종류 입수",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%20%EC%88%98%EC%A7%91%EA%B0%80%3A%204%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 101,
      "number": "No. 88",
      "order": 88,
      "deckOrder": 1,
      "ex": false,
      "name": "볼록눈",
      "original": "Deepeye",
      "korean": true,
      "stars": 1,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 3,
        "bottom": 7,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088101_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/101.png",
      "link": "https://ffxivcollect.com/triad/cards/101",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/854a530d58a",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293807,
          "name": "도미니아크",
          "original": "Dominiac",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "커르다스 서부고지",
          "link": "https://ffxivcollect.com/triad/npcs/2293807",
          "region": "커르다스",
          "npc": {
            "id": 2293807,
            "residentId": 1013710,
            "name": "도미니아크",
            "original": "Dominiac",
            "location": "커르다스 서부고지",
            "region": "커르다스",
            "x": "16.6",
            "y": "22.6",
            "quest": {
              "name": "끝없는 전쟁",
              "original": "A War without End",
              "link": "https://www.garlandtools.org/db/#quest/67434"
            },
            "ruleIds": [
              8
            ],
            "rules": [
              "순서대로"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293807"
          }
        }
      ]
    },
    {
      "id": 102,
      "number": "No. 89",
      "order": 89,
      "deckOrder": 7,
      "ex": false,
      "name": "아르케오니스",
      "original": "Archaeornis",
      "korean": true,
      "stars": 2,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 4,
        "bottom": 6,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088102_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/102.png",
      "link": "https://ffxivcollect.com/triad/cards/102",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/2154538a515",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293806,
          "name": "엘레이스",
          "original": "Elaisse",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "이슈가르드 상층",
          "link": "https://ffxivcollect.com/triad/npcs/2293806",
          "region": "커르다스",
          "npc": {
            "id": 2293806,
            "residentId": 1012180,
            "name": "엘레이스",
            "original": "Elaisse",
            "location": "이슈가르드 상층",
            "region": "커르다스",
            "x": "7.7",
            "y": "10.8",
            "quest": {
              "name": "상인의 함정",
              "original": "Caught in the Act",
              "link": "https://www.garlandtools.org/db/#quest/67406"
            },
            "ruleIds": [
              6,
              9
            ],
            "rules": [
              "합산",
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293806"
          }
        }
      ]
    },
    {
      "id": 103,
      "number": "No. 90",
      "order": 90,
      "deckOrder": 7,
      "ex": false,
      "name": "파이싸",
      "original": "Paissa",
      "korean": true,
      "stars": 2,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 6,
        "bottom": 3,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088103_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/103.png",
      "link": "https://ffxivcollect.com/triad/cards/103",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/13f7a57153a",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293808,
          "name": "라니에트",
          "original": "Laniaitte",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아발라시아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293808",
          "region": "아발라시아",
          "npc": {
            "id": 2293808,
            "residentId": 1011952,
            "name": "라니에트",
            "original": "Laniaitte",
            "location": "아발라시아 구름바다",
            "region": "아발라시아",
            "x": "17.0",
            "y": "37.3",
            "quest": {
              "name": "깃발이 본 석양",
              "original": "Honoring the Past",
              "link": "https://www.garlandtools.org/db/#quest/67410"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293808"
          }
        }
      ]
    },
    {
      "id": 104,
      "number": "No. 91",
      "order": 91,
      "deckOrder": 7,
      "ex": false,
      "name": "달멜",
      "original": "Dhalmel",
      "korean": true,
      "stars": 2,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 5,
        "bottom": 3,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088104_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/104.png",
      "link": "https://ffxivcollect.com/triad/cards/104",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ffccaac70e6",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293808,
          "name": "라니에트",
          "original": "Laniaitte",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아발라시아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293808",
          "region": "아발라시아",
          "npc": {
            "id": 2293808,
            "residentId": 1011952,
            "name": "라니에트",
            "original": "Laniaitte",
            "location": "아발라시아 구름바다",
            "region": "아발라시아",
            "x": "17.0",
            "y": "37.3",
            "quest": {
              "name": "깃발이 본 석양",
              "original": "Honoring the Past",
              "link": "https://www.garlandtools.org/db/#quest/67410"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293808"
          }
        }
      ]
    },
    {
      "id": 105,
      "number": "No. 92",
      "order": 92,
      "deckOrder": 7,
      "ex": false,
      "name": "밴더스내치",
      "original": "Bandersnatch",
      "korean": true,
      "stars": 2,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 3,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088105_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/105.png",
      "link": "https://ffxivcollect.com/triad/cards/105",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4c925d0f751",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293809,
          "name": "낭카 먹보",
          "original": "Voracious Vath",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "고지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293809",
          "region": "드라바니아",
          "npc": {
            "id": 2293809,
            "residentId": 1011931,
            "name": "낭카 먹보",
            "original": "Voracious Vath",
            "location": "고지 드라바니아",
            "region": "드라바니아",
            "x": "23.7",
            "y": "19.8",
            "quest": {
              "name": "돌의 비밀",
              "original": "Yellow Stones",
              "link": "https://www.garlandtools.org/db/#quest/67329"
            },
            "ruleIds": [
              12,
              14
            ],
            "rules": [
              "유형 강화",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293809"
          }
        }
      ]
    },
    {
      "id": 106,
      "number": "No. 93",
      "order": 93,
      "deckOrder": 7,
      "ex": false,
      "name": "누에",
      "original": "Crawler",
      "korean": true,
      "stars": 2,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 7,
        "bottom": 3,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088106_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/106.png",
      "link": "https://ffxivcollect.com/triad/cards/106",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/32b6193027c",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293810,
          "name": "세이카",
          "original": "Seika",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "이딜샤이어",
          "link": "https://ffxivcollect.com/triad/npcs/2293810",
          "region": "드라바니아",
          "npc": {
            "id": 2293810,
            "residentId": 1013747,
            "name": "세이카",
            "original": "Seika",
            "location": "이딜샤이어",
            "region": "드라바니아",
            "x": "6.7",
            "y": "7.4",
            "quest": {
              "name": "그녀의 보물",
              "original": "Enigma",
              "link": "https://www.garlandtools.org/db/#quest/67630"
            },
            "ruleIds": [
              9,
              10
            ],
            "rules": [
              "무작위 순서",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293810"
          }
        }
      ]
    },
    {
      "id": 107,
      "number": "No. 94",
      "order": 94,
      "deckOrder": 7,
      "ex": false,
      "name": "포록고",
      "original": "Poroggo",
      "korean": true,
      "stars": 2,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 3,
        "bottom": 7,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088107_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/107.png",
      "link": "https://ffxivcollect.com/triad/cards/107",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/7a4c51dc16a",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293810,
          "name": "세이카",
          "original": "Seika",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "이딜샤이어",
          "link": "https://ffxivcollect.com/triad/npcs/2293810",
          "region": "드라바니아",
          "npc": {
            "id": 2293810,
            "residentId": 1013747,
            "name": "세이카",
            "original": "Seika",
            "location": "이딜샤이어",
            "region": "드라바니아",
            "x": "6.7",
            "y": "7.4",
            "quest": {
              "name": "그녀의 보물",
              "original": "Enigma",
              "link": "https://www.garlandtools.org/db/#quest/67630"
            },
            "ruleIds": [
              9,
              10
            ],
            "rules": [
              "무작위 순서",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293810"
          }
        }
      ]
    },
    {
      "id": 108,
      "number": "No. 95",
      "order": 95,
      "deckOrder": 17,
      "ex": false,
      "name": "베드르폴니르",
      "original": "Vedrfolnir",
      "korean": true,
      "stars": 3,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 2,
        "bottom": 7,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088108_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/108.png",
      "link": "https://ffxivcollect.com/triad/cards/108",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/aeea65256f8",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293804,
          "name": "모그밀",
          "original": "Mogmill",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "드라바니아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293804",
          "region": "드라바니아",
          "npc": {
            "id": 2293804,
            "residentId": 1012085,
            "name": "모그밀",
            "original": "Mogmill",
            "location": "드라바니아 구름바다",
            "region": "드라바니아",
            "x": "28.3",
            "y": "35.4",
            "quest": {
              "name": "숨겨진 명당",
              "original": "A Secret from Everyone",
              "link": "https://www.garlandtools.org/db/#quest/67376"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293804"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "미스라이트 트라이어드 팩",
          "original": "Mythril Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#4",
          "pack": {
            "id": 4,
            "name": "미스라이트 트라이어드 팩",
            "cost": 8000,
            "link": "https://ffxivcollect.com/triad/packs#4"
          }
        }
      ]
    },
    {
      "id": 109,
      "number": "No. 96",
      "order": 96,
      "deckOrder": 18,
      "ex": false,
      "name": "커얼레기나",
      "original": "Coeurlregina",
      "korean": true,
      "stars": 3,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 5,
        "bottom": 5,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088109_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/109.png",
      "link": "https://ffxivcollect.com/triad/cards/109",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d1084e6f56b",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293809,
          "name": "낭카 먹보",
          "original": "Voracious Vath",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "고지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293809",
          "region": "드라바니아",
          "npc": {
            "id": 2293809,
            "residentId": 1011931,
            "name": "낭카 먹보",
            "original": "Voracious Vath",
            "location": "고지 드라바니아",
            "region": "드라바니아",
            "x": "23.7",
            "y": "19.8",
            "quest": {
              "name": "돌의 비밀",
              "original": "Yellow Stones",
              "link": "https://www.garlandtools.org/db/#quest/67329"
            },
            "ruleIds": [
              12,
              14
            ],
            "rules": [
              "유형 강화",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293809"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293813,
          "name": "으뜸이",
          "original": "Vath Deftarm",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "고지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293813",
          "region": "드라바니아",
          "npc": {
            "id": 2293813,
            "residentId": 1016802,
            "name": "으뜸이",
            "original": "Vath Deftarm",
            "location": "고지 드라바니아",
            "region": "드라바니아",
            "x": "23.6",
            "y": "19.1",
            "quest": {
              "name": "끊어진 이야기",
              "original": "A Symbiotic Friendship",
              "link": "https://www.garlandtools.org/db/#quest/67796"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293813"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "미스라이트 트라이어드 팩",
          "original": "Mythril Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#4",
          "pack": {
            "id": 4,
            "name": "미스라이트 트라이어드 팩",
            "cost": 8000,
            "link": "https://ffxivcollect.com/triad/packs#4"
          }
        }
      ]
    },
    {
      "id": 110,
      "number": "No. 97",
      "order": 97,
      "deckOrder": 20,
      "ex": false,
      "name": "엄마 봄",
      "original": "Progenitrix",
      "korean": true,
      "stars": 3,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 3,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088110_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/110.png",
      "link": "https://ffxivcollect.com/triad/cards/110",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/2a0bdcf1665",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 40,
          "name": "시리우스 대등대(어려움)",
          "original": "Pharos Sirius (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/90433510008",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 111,
      "number": "No. 98",
      "order": 98,
      "deckOrder": 20,
      "ex": false,
      "name": "벨라돈나",
      "original": "Belladonna",
      "korean": true,
      "stars": 3,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 3,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088111_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/111.png",
      "link": "https://ffxivcollect.com/triad/cards/111",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4ffa023ce8a",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293802,
          "name": "한밤의 이슬",
          "original": "Midnight Dew",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "이딜샤이어",
          "link": "https://ffxivcollect.com/triad/npcs/2293802",
          "region": "드라바니아",
          "npc": {
            "id": 2293802,
            "residentId": 1012133,
            "name": "한밤의 이슬",
            "original": "Midnight Dew",
            "location": "이딜샤이어",
            "region": "드라바니아",
            "x": "5.6",
            "y": "6.7",
            "quest": {
              "name": "쌓아온 것을 지키기 위해",
              "original": "Over My Dead Gobbie",
              "link": "https://www.garlandtools.org/db/#quest/67501"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293802"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 41,
          "name": "성 모샨 식물원",
          "original": "Saint Mocianne's Arboretum",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/322c928d23a",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 112,
      "number": "No. 99",
      "order": 99,
      "deckOrder": 23,
      "ex": false,
      "name": "에키드나",
      "original": "Echidna",
      "korean": true,
      "stars": 3,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 4,
        "bottom": 7,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088112_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/112.png",
      "link": "https://ffxivcollect.com/triad/cards/112",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/1580ccb5fdc",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293844,
          "name": "붉은부리 조달원",
          "original": "Redbill Storeboy",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "이딜샤이어",
          "link": "https://ffxivcollect.com/triad/npcs/2293844",
          "region": "드라바니아",
          "npc": {
            "id": 2293844,
            "residentId": 1027208,
            "name": "붉은부리 조달원",
            "original": "Redbill Storeboy",
            "location": "이딜샤이어",
            "region": "드라바니아",
            "x": "3.8",
            "y": "4.5",
            "quest": {
              "name": "또 하나 모험이 끝나고",
              "original": "A Redbill Farewell",
              "link": "https://www.garlandtools.org/db/#quest/67910"
            },
            "ruleIds": [
              9
            ],
            "rules": [
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293844"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 120,
          "name": "보이드의 방주",
          "original": "The Void Ark",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/02f46089740",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 113,
      "number": "No. 100",
      "order": 100,
      "deckOrder": 30,
      "ex": false,
      "name": "피핀 타루핀",
      "original": "Pipin Tarupin",
      "korean": true,
      "stars": 3,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 5,
        "bottom": 6,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088113_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/113.png",
      "link": "https://ffxivcollect.com/triad/cards/113",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/60dd70a9deb",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293788,
          "name": "불멸대 대령 스위프트",
          "original": "Swift",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 날 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293788",
          "region": "다날란",
          "npc": {
            "id": 2293788,
            "residentId": 1004576,
            "name": "불멸대 대령 스위프트",
            "original": "Swift",
            "location": "울다하 날 회랑",
            "region": "다날란",
            "x": "8.4",
            "y": "8.9",
            "quest": {
              "name": "부와 나라를 위하여",
              "original": "For Coin and Country",
              "link": "https://www.garlandtools.org/db/#quest/66221"
            },
            "ruleIds": [
              9
            ],
            "rules": [
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293788"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "미스라이트 트라이어드 팩",
          "original": "Mythril Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#4",
          "pack": {
            "id": 4,
            "name": "미스라이트 트라이어드 팩",
            "cost": 8000,
            "link": "https://ffxivcollect.com/triad/packs#4"
          }
        }
      ]
    },
    {
      "id": 114,
      "number": "No. 101",
      "order": 101,
      "deckOrder": 30,
      "ex": false,
      "name": "줄리안 맨더빌",
      "original": "Julyan Manderville",
      "korean": true,
      "stars": 3,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 5,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088114_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/114.png",
      "link": "https://ffxivcollect.com/triad/cards/114",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b5000ebdb36",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "14,400 맨더빌 골드 소서 포인트",
          "original": "14,400 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/114"
        }
      ]
    },
    {
      "id": 115,
      "number": "No. 102",
      "order": 102,
      "deckOrder": 24,
      "ex": false,
      "name": "모그린",
      "original": "Moglin",
      "korean": true,
      "stars": 3,
      "patch": "3.1",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 8,
        "right": 5,
        "bottom": 4,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088115_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/115.png",
      "link": "https://ffxivcollect.com/triad/cards/115",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/123f1bfed5e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293804,
          "name": "모그밀",
          "original": "Mogmill",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "드라바니아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293804",
          "region": "드라바니아",
          "npc": {
            "id": 2293804,
            "residentId": 1012085,
            "name": "모그밀",
            "original": "Mogmill",
            "location": "드라바니아 구름바다",
            "region": "드라바니아",
            "x": "28.3",
            "y": "35.4",
            "quest": {
              "name": "숨겨진 명당",
              "original": "A Secret from Everyone",
              "link": "https://www.garlandtools.org/db/#quest/67376"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293804"
          }
        }
      ]
    },
    {
      "id": 116,
      "number": "No. 103",
      "order": 103,
      "deckOrder": 31,
      "ex": false,
      "name": "샤리베르",
      "original": "Charibert",
      "korean": true,
      "stars": 3,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 8,
        "bottom": 4,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088116_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/116.png",
      "link": "https://ffxivcollect.com/triad/cards/116",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/519fa8ccc5b",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 34,
          "name": "이슈가르드 교황청",
          "original": "The Vault",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/47abc7ba847",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 117,
      "number": "No. 104",
      "order": 104,
      "deckOrder": 24,
      "ex": false,
      "name": "라운드록스",
      "original": "Roundrox",
      "korean": true,
      "stars": 3,
      "patch": "3.1",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 2,
        "right": 2,
        "bottom": 8,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088117_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/117.png",
      "link": "https://ffxivcollect.com/triad/cards/117",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/7187c9a0665",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293815,
          "name": "탭클릭스",
          "original": "Tapklix",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "저지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293815",
          "region": "드라바니아",
          "npc": {
            "id": 2293815,
            "residentId": 1012287,
            "name": "탭클릭스",
            "original": "Tapklix",
            "location": "저지 드라바니아",
            "region": "드라바니아",
            "x": "22.0",
            "y": "18.8",
            "quest": {
              "name": "그녀가 없는 세상",
              "original": "A Gob in the Machine",
              "link": "https://www.garlandtools.org/db/#quest/67789"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293815"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293810,
          "name": "세이카",
          "original": "Seika",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "이딜샤이어",
          "link": "https://ffxivcollect.com/triad/npcs/2293810",
          "region": "드라바니아",
          "npc": {
            "id": 2293810,
            "residentId": 1013747,
            "name": "세이카",
            "original": "Seika",
            "location": "이딜샤이어",
            "region": "드라바니아",
            "x": "6.7",
            "y": "7.4",
            "quest": {
              "name": "그녀의 보물",
              "original": "Enigma",
              "link": "https://www.garlandtools.org/db/#quest/67630"
            },
            "ruleIds": [
              9,
              10
            ],
            "rules": [
              "무작위 순서",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293810"
          }
        }
      ]
    },
    {
      "id": 118,
      "number": "No. 105",
      "order": 105,
      "deckOrder": 39,
      "ex": false,
      "name": "세뇨르 사보텐더",
      "original": "Senor Sabotender",
      "korean": true,
      "stars": 4,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 5,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088118_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/118.png",
      "link": "https://ffxivcollect.com/triad/cards/118",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4658af565d2",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "200,000 맨더빌 골드 소서 포인트",
          "original": "200,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/118"
        }
      ]
    },
    {
      "id": 119,
      "number": "No. 106",
      "order": 106,
      "deckOrder": 43,
      "ex": false,
      "name": "레굴라 반 히드루스",
      "original": "Regula van Hydrus",
      "korean": true,
      "stars": 5,
      "patch": "3.1",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 8,
        "right": 8,
        "bottom": 6,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088119_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/119.png",
      "link": "https://ffxivcollect.com/triad/cards/119",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/eaf6a8a3976",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293803,
          "name": "지루해 보이는 제국병",
          "original": "Idle Imperial",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아지스 라",
          "link": "https://ffxivcollect.com/triad/npcs/2293803",
          "region": "아발라시아",
          "npc": {
            "id": 2293803,
            "residentId": 1015021,
            "name": "지루해 보이는 제국병",
            "original": "Idle Imperial",
            "location": "아지스 라",
            "region": "아발라시아",
            "x": "28.1",
            "y": "31.2",
            "quest": {
              "name": "새로운 날개 엑셀시어",
              "original": "The First Flight of the Excelsior",
              "link": "https://www.garlandtools.org/db/#quest/67199"
            },
            "ruleIds": [
              9,
              14
            ],
            "rules": [
              "무작위 순서",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293803"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "제국 트라이어드 팩",
          "original": "Imperial Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#6",
          "pack": {
            "id": 6,
            "name": "제국 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#6"
          }
        }
      ]
    },
    {
      "id": 120,
      "number": "No. 107",
      "order": 107,
      "deckOrder": 47,
      "ex": false,
      "name": "토르당 7세",
      "original": "Archbishop Thordan VII",
      "korean": true,
      "stars": 5,
      "patch": "3.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 1,
        "bottom": 10,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088120_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/120.png",
      "link": "https://ffxivcollect.com/triad/cards/120",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/215f7a33e27",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 91,
          "name": "극 나이츠 오브 라운드 토벌전",
          "original": "The Minstrel's Ballad: Thordan's Reign",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/e3aeb0747be",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 121,
      "number": "No. 108",
      "order": 108,
      "deckOrder": 16,
      "ex": false,
      "name": "오노루아",
      "original": "Honoroit",
      "korean": true,
      "stars": 2,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 2,
        "bottom": 7,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088121_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/121.png",
      "link": "https://ffxivcollect.com/triad/cards/121",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ca606abd68c",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293816,
          "name": "포르탕 가 집사",
          "original": "House Fortemps Manservant",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "포르탕 저택",
          "link": "https://ffxivcollect.com/triad/npcs/2293816",
          "region": "커르다스",
          "npc": {
            "id": 2293816,
            "residentId": 1012337,
            "name": "포르탕 가 집사",
            "original": "House Fortemps Manservant",
            "location": "포르탕 저택",
            "region": "커르다스",
            "x": "6.0",
            "y": "6.0",
            "quest": {
              "name": "창천의 이슈가르드",
              "original": "Heavensward",
              "link": "https://www.garlandtools.org/db/#quest/67205"
            },
            "ruleIds": [
              3,
              6
            ],
            "rules": [
              "3장 공개",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293816"
          }
        }
      ]
    },
    {
      "id": 122,
      "number": "No. 109",
      "order": 109,
      "deckOrder": 12,
      "ex": false,
      "name": "빛바랜 바위 & 쿨테네",
      "original": "Hoary Boulder & Coultenet",
      "korean": true,
      "stars": 2,
      "patch": "3.2",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 2,
        "right": 7,
        "bottom": 2,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088122_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/122.png",
      "link": "https://ffxivcollect.com/triad/cards/122",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bf8856bfe09",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        }
      ]
    },
    {
      "id": 123,
      "number": "No. 110",
      "order": 110,
      "deckOrder": 18,
      "ex": false,
      "name": "브라키오레이도스",
      "original": "Brachiosaur",
      "korean": true,
      "stars": 3,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 4,
        "bottom": 5,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088123_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/123.png",
      "link": "https://ffxivcollect.com/triad/cards/123",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/9c8fcfe7c5d",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293812,
          "name": "리누바리",
          "original": "Linu Vali",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아발라시아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293812",
          "region": "아발라시아",
          "npc": {
            "id": 2293812,
            "residentId": 1016087,
            "name": "리누바리",
            "original": "Linu Vali",
            "location": "아발라시아 구름바다",
            "region": "아발라시아",
            "x": "6.6",
            "y": "14.3",
            "quest": {
              "name": "적절한 비유",
              "original": "The Nest of Honor",
              "link": "https://www.garlandtools.org/db/#quest/67761"
            },
            "ruleIds": [
              9,
              10
            ],
            "rules": [
              "무작위 순서",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293812"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "미스라이트 트라이어드 팩",
          "original": "Mythril Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#4",
          "pack": {
            "id": 4,
            "name": "미스라이트 트라이어드 팩",
            "cost": 8000,
            "link": "https://ffxivcollect.com/triad/packs#4"
          }
        }
      ]
    },
    {
      "id": 124,
      "number": "No. 111",
      "order": 111,
      "deckOrder": 17,
      "ex": false,
      "name": "검은미늘",
      "original": "Darkscale",
      "korean": true,
      "stars": 3,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 8,
        "bottom": 4,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088124_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/124.png",
      "link": "https://ffxivcollect.com/triad/cards/124",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/874cbc8d099",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293817,
          "name": "단장 모그진",
          "original": "Master Mogzin",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "드라바니아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293817",
          "region": "드라바니아",
          "npc": {
            "id": 2293817,
            "residentId": 1017320,
            "name": "단장 모그진",
            "original": "Master Mogzin",
            "location": "드라바니아 구름바다",
            "region": "드라바니아",
            "x": "15.7",
            "y": "28.8",
            "quest": {
              "name": "미래를 바라보는 복원단!",
              "original": "The Zenith of Craftsmanship",
              "link": "https://www.garlandtools.org/db/#quest/67863"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293817"
          }
        },
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "돌발임무 \"하얀 궁전 방어전: 모그리 구출\" / \"하얀 궁전 방어전: 맹룡 토벌\" / \"하얀 궁전 방어전: 아기용 구출\" - 드라바니아 구름바다",
          "original": "FATEs \"Mogicide\" / \"Rastaban Vibration\" / \"End of the Rainbow\" - The Churning Mists",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/124"
        }
      ]
    },
    {
      "id": 125,
      "number": "No. 112",
      "order": 112,
      "deckOrder": 18,
      "ex": false,
      "name": "펜리르",
      "original": "Fenrir",
      "korean": true,
      "stars": 3,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 3,
        "bottom": 6,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088125_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/125.png",
      "link": "https://ffxivcollect.com/triad/cards/125",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e770bd81b7d",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "72,000 맨더빌 골드 소서 포인트",
          "original": "72,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/125"
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 27,
          "name": "얼음외투 대빙벽",
          "original": "Snowcloak",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/a89bb3fde6d",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 126,
      "number": "No. 113",
      "order": 113,
      "deckOrder": 18,
      "ex": false,
      "name": "크라켄",
      "original": "Kraken",
      "korean": true,
      "stars": 3,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 6,
        "bottom": 6,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088126_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/126.png",
      "link": "https://ffxivcollect.com/triad/cards/126",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/485e2b383d9",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293819,
          "name": "모딘",
          "original": "Mordyn",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "림사 로민사 상층 갑판",
          "link": "https://ffxivcollect.com/triad/npcs/2293819",
          "region": "라노시아",
          "npc": {
            "id": 2293819,
            "residentId": 1000916,
            "name": "모딘",
            "original": "Mordyn",
            "location": "림사 로민사 상층 갑판",
            "region": "라노시아",
            "x": "11.3",
            "y": "7.9",
            "quest": {
              "name": "거친 파도 넘나드는 난파선의 섬",
              "original": "Storming the Hull",
              "link": "https://www.garlandtools.org/db/#quest/67784"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293819"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 28,
          "name": "사스타샤 침식 동굴(어려움)",
          "original": "Sastasha (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/c40d4ac8f8d",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 127,
      "number": "No. 114",
      "order": 114,
      "deckOrder": 18,
      "ex": false,
      "name": "아제마 교황",
      "original": "Vicegerent to the Warden",
      "korean": true,
      "stars": 3,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 1,
        "bottom": 7,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088127_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/127.png",
      "link": "https://ffxivcollect.com/triad/cards/127",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0f77185df18",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293798,
          "name": "야야케",
          "original": "Yayake",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 날 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293798",
          "region": "다날란",
          "npc": {
            "id": 2293798,
            "residentId": 1002279,
            "name": "야야케",
            "original": "Yayake",
            "location": "울다하 날 회랑",
            "region": "다날란",
            "x": "7.3",
            "y": "12.4",
            "quest": null,
            "ruleIds": [
              1,
              9
            ],
            "rules": [
              "무작위 규칙",
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293798"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 26,
          "name": "카른의 무너진 사원(어려움)",
          "original": "The Sunken Temple of Qarn (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/71bd1da0cb4",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 128,
      "number": "No. 115",
      "order": 115,
      "deckOrder": 24,
      "ex": false,
      "name": "빛나는 비늘의 몰라쟈쟈",
      "original": "Manxome Molaa Ja Ja",
      "korean": true,
      "stars": 3,
      "patch": "3.2",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 2,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088128_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/128.png",
      "link": "https://ffxivcollect.com/triad/cards/128",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bbee15352ab",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293762,
          "name": "메메룬",
          "original": "Memeroon",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "고지 라노시아",
          "link": "https://ffxivcollect.com/triad/npcs/2293762",
          "region": "라노시아",
          "npc": {
            "id": 2293762,
            "residentId": 1005249,
            "name": "메메룬",
            "original": "Memeroon",
            "location": "고지 라노시아",
            "region": "라노시아",
            "x": "14.7",
            "y": "24.3",
            "quest": null,
            "ruleIds": [
              2
            ],
            "rules": [
              "모두 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293762"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 30,
          "name": "방랑자의 궁전(어려움)",
          "original": "The Wanderer's Palace (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/94e69de74b8",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 129,
      "number": "No. 116",
      "order": 116,
      "deckOrder": 18,
      "ex": false,
      "name": "페르디아",
      "original": "Ferdiad",
      "korean": true,
      "stars": 3,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 6,
        "bottom": 8,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088129_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/129.png",
      "link": "https://ffxivcollect.com/triad/cards/129",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/25c7ead6319",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293844,
          "name": "붉은부리 조달원",
          "original": "Redbill Storeboy",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "이딜샤이어",
          "link": "https://ffxivcollect.com/triad/npcs/2293844",
          "region": "드라바니아",
          "npc": {
            "id": 2293844,
            "residentId": 1027208,
            "name": "붉은부리 조달원",
            "original": "Redbill Storeboy",
            "location": "이딜샤이어",
            "region": "드라바니아",
            "x": "3.8",
            "y": "4.5",
            "quest": {
              "name": "또 하나 모험이 끝나고",
              "original": "A Redbill Farewell",
              "link": "https://www.garlandtools.org/db/#quest/67910"
            },
            "ruleIds": [
              9
            ],
            "rules": [
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293844"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "실버 트라이어드 팩",
          "original": "Silver Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#2",
          "pack": {
            "id": 2,
            "name": "실버 트라이어드 팩",
            "cost": 1150,
            "link": "https://ffxivcollect.com/triad/packs#2"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 29,
          "name": "옛 암다포르 성(어려움)",
          "original": "Amdapor Keep (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/c3bbfb061f2",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 130,
      "number": "No. 117",
      "order": 117,
      "deckOrder": 20,
      "ex": false,
      "name": "칼카브리나",
      "original": "Calcabrina",
      "korean": true,
      "stars": 3,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 6,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088130_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/130.png",
      "link": "https://ffxivcollect.com/triad/cards/130",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/fec28ab8904",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293845,
          "name": "메로 록고",
          "original": "Mero Roggo",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "저지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293845",
          "region": "드라바니아",
          "npc": {
            "id": 2293845,
            "residentId": 1027209,
            "name": "메로 록고",
            "original": "Mero Roggo",
            "location": "저지 드라바니아",
            "region": "드라바니아",
            "x": "12.8",
            "y": "36.8",
            "quest": {
              "name": "광란의 전주곡",
              "original": "Prelude in Violet",
              "link": "https://www.garlandtools.org/db/#quest/68685"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293845"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 141,
          "name": "거꾸로 선 탑",
          "original": "The Antitower",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/d9b8f3ac92f",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 131,
      "number": "No. 118",
      "order": 118,
      "deckOrder": 20,
      "ex": false,
      "name": "쿠리부",
      "original": "Kuribu",
      "korean": true,
      "stars": 3,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 3,
        "bottom": 2,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088131_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/131.png",
      "link": "https://ffxivcollect.com/triad/cards/131",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/249e7d57cf2",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293795,
          "name": "노에스",
          "original": "Noes",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 구시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293795",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293795,
            "residentId": 1000282,
            "name": "노에스",
            "original": "Noes",
            "location": "그리다니아 구시가지",
            "region": "검은장막 숲",
            "x": "10.6",
            "y": "5.5",
            "quest": null,
            "ruleIds": [
              6,
              13
            ],
            "rules": [
              "합산",
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293795"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 140,
          "name": "옛 암다포르 시가지(어려움)",
          "original": "The Lost City of Amdapor (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/55c679671bc",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 132,
      "number": "No. 119",
      "order": 119,
      "deckOrder": 22,
      "ex": false,
      "name": "티탄",
      "original": "Phlegethon",
      "korean": true,
      "stars": 3,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 7,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088132_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/132.png",
      "link": "https://ffxivcollect.com/triad/cards/132",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/2cab9405e7a",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293814,
          "name": "클륀토타",
          "original": "Klynthota",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "모르도나",
          "link": "https://ffxivcollect.com/triad/npcs/2293814",
          "region": "모르도나",
          "npc": {
            "id": 2293814,
            "residentId": 1006550,
            "name": "클륀토타",
            "original": "Klynthota",
            "location": "모르도나",
            "region": "모르도나",
            "x": "30.4",
            "y": "13.7",
            "quest": {
              "name": "악귀와 달의 위성",
              "original": "Moon Sliver and Me",
              "link": "https://www.garlandtools.org/db/#quest/66530"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293814"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 92,
          "name": "크리스탈 타워: 고대인의 미궁",
          "original": "The Labyrinth of the Ancients",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/fc38048f4fc",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 133,
      "number": "No. 120",
      "order": 120,
      "deckOrder": 29,
      "ex": false,
      "name": "아르투아렐 드 포르탕",
      "original": "Artoirel de Fortemps",
      "korean": true,
      "stars": 3,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 3,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088133_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/133.png",
      "link": "https://ffxivcollect.com/triad/cards/133",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/3f3fb0c4aea",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293816,
          "name": "포르탕 가 집사",
          "original": "House Fortemps Manservant",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "포르탕 저택",
          "link": "https://ffxivcollect.com/triad/npcs/2293816",
          "region": "커르다스",
          "npc": {
            "id": 2293816,
            "residentId": 1012337,
            "name": "포르탕 가 집사",
            "original": "House Fortemps Manservant",
            "location": "포르탕 저택",
            "region": "커르다스",
            "x": "6.0",
            "y": "6.0",
            "quest": {
              "name": "창천의 이슈가르드",
              "original": "Heavensward",
              "link": "https://www.garlandtools.org/db/#quest/67205"
            },
            "ruleIds": [
              3,
              6
            ],
            "rules": [
              "3장 공개",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293816"
          }
        }
      ]
    },
    {
      "id": 134,
      "number": "No. 121",
      "order": 121,
      "deckOrder": 29,
      "ex": false,
      "name": "에마넬랭 드 포르탕",
      "original": "Emmanellain de Fortemps",
      "korean": true,
      "stars": 3,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 4,
        "bottom": 7,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088134_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/134.png",
      "link": "https://ffxivcollect.com/triad/cards/134",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/2db4e64d929",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293816,
          "name": "포르탕 가 집사",
          "original": "House Fortemps Manservant",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "포르탕 저택",
          "link": "https://ffxivcollect.com/triad/npcs/2293816",
          "region": "커르다스",
          "npc": {
            "id": 2293816,
            "residentId": 1012337,
            "name": "포르탕 가 집사",
            "original": "House Fortemps Manservant",
            "location": "포르탕 저택",
            "region": "커르다스",
            "x": "6.0",
            "y": "6.0",
            "quest": {
              "name": "창천의 이슈가르드",
              "original": "Heavensward",
              "link": "https://www.garlandtools.org/db/#quest/67205"
            },
            "ruleIds": [
              3,
              6
            ],
            "rules": [
              "3장 공개",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293816"
          }
        }
      ]
    },
    {
      "id": 135,
      "number": "No. 122",
      "order": 122,
      "deckOrder": 33,
      "ex": false,
      "name": "잔데",
      "original": "Xande",
      "korean": true,
      "stars": 4,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 4,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088135_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/135.png",
      "link": "https://ffxivcollect.com/triad/cards/135",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/01eb6781706",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293814,
          "name": "클륀토타",
          "original": "Klynthota",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "모르도나",
          "link": "https://ffxivcollect.com/triad/npcs/2293814",
          "region": "모르도나",
          "npc": {
            "id": 2293814,
            "residentId": 1006550,
            "name": "클륀토타",
            "original": "Klynthota",
            "location": "모르도나",
            "region": "모르도나",
            "x": "30.4",
            "y": "13.7",
            "quest": {
              "name": "악귀와 달의 위성",
              "original": "Moon Sliver and Me",
              "link": "https://www.garlandtools.org/db/#quest/66530"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293814"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 102,
          "name": "크리스탈 타워: 시르쿠스 탑",
          "original": "Syrcus Tower",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/9cf6ef52d99",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 136,
      "number": "No. 123",
      "order": 123,
      "deckOrder": 32,
      "ex": false,
      "name": "포악한 심판자",
      "original": "Brute Justice",
      "korean": true,
      "stars": 4,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 7,
        "bottom": 7,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088136_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/136.png",
      "link": "https://ffxivcollect.com/triad/cards/136",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/14b5a5b40ae",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293815,
          "name": "탭클릭스",
          "original": "Tapklix",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "저지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293815",
          "region": "드라바니아",
          "npc": {
            "id": 2293815,
            "residentId": 1012287,
            "name": "탭클릭스",
            "original": "Tapklix",
            "location": "저지 드라바니아",
            "region": "드라바니아",
            "x": "22.0",
            "y": "18.8",
            "quest": {
              "name": "그녀가 없는 세상",
              "original": "A Gob in the Machine",
              "link": "https://www.garlandtools.org/db/#quest/67789"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293815"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 139,
          "name": "기공성 알렉산더: 율동편 4",
          "original": "Alexander - The Burden of the Son",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/fdedddb6a38",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 137,
      "number": "No. 124",
      "order": 124,
      "deckOrder": 35,
      "ex": false,
      "name": "세피로트",
      "original": "Sephirot",
      "korean": true,
      "stars": 4,
      "patch": "3.2",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 6,
        "right": 8,
        "bottom": 8,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088137_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/137.png",
      "link": "https://ffxivcollect.com/triad/cards/137",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d4bdf7c9044",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 134,
          "name": "마신 세피로트 토벌전",
          "original": "Containment Bay S1T7",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/914e46eb26f",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 135,
          "name": "극 마신 세피로트 토벌전",
          "original": "Containment Bay S1T7 (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/412aec8660e",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 138,
      "number": "No. 125",
      "order": 125,
      "deckOrder": 37,
      "ex": false,
      "name": "프라민",
      "original": "F'lhaminn",
      "korean": true,
      "stars": 4,
      "patch": "3.2",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 9,
        "right": 7,
        "bottom": 3,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088138_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/138.png",
      "link": "https://ffxivcollect.com/triad/cards/138",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4ef1b418225",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "20,000 맨더빌 골드 소서 포인트",
          "original": "20,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/138"
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "플래티넘 트라이어드 팩",
          "original": "Platinum Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#5",
          "pack": {
            "id": 5,
            "name": "플래티넘 트라이어드 팩",
            "cost": 0,
            "link": "https://ffxivcollect.com/triad/packs#5"
          }
        }
      ]
    },
    {
      "id": 139,
      "number": "No. 126",
      "order": 126,
      "deckOrder": 39,
      "ex": false,
      "name": "비도프니르",
      "original": "Vidofnir",
      "korean": true,
      "stars": 4,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 6,
        "bottom": 8,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088139_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/139.png",
      "link": "https://ffxivcollect.com/triad/cards/139",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/1bdf4ea45a1",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 1488,
          "name": "카드 수집가: 5단계",
          "original": "Triple-decker V",
          "method": "트리플 트라이어드 카드 120종류 입수",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%20%EC%88%98%EC%A7%91%EA%B0%80%3A%205%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 140,
      "number": "No. 127",
      "order": 127,
      "deckOrder": 41,
      "ex": false,
      "name": "어둠의 구름",
      "original": "Cloud of Darkness",
      "korean": true,
      "stars": 5,
      "patch": "3.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 10,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088140_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/140.png",
      "link": "https://ffxivcollect.com/triad/cards/140",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6dfd5ef4aa3",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293814,
          "name": "클륀토타",
          "original": "Klynthota",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "모르도나",
          "link": "https://ffxivcollect.com/triad/npcs/2293814",
          "region": "모르도나",
          "npc": {
            "id": 2293814,
            "residentId": 1006550,
            "name": "클륀토타",
            "original": "Klynthota",
            "location": "모르도나",
            "region": "모르도나",
            "x": "30.4",
            "y": "13.7",
            "quest": {
              "name": "악귀와 달의 위성",
              "original": "Moon Sliver and Me",
              "link": "https://www.garlandtools.org/db/#quest/66530"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293814"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 111,
          "name": "크리스탈 타워: 어둠의 세계",
          "original": "The World of Darkness",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/a70105d73ff",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 141,
      "number": "No. 128",
      "order": 128,
      "deckOrder": 13,
      "ex": false,
      "name": "로로리토 나나리토",
      "original": "Lolorito Nanarito",
      "korean": true,
      "stars": 2,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 3,
        "bottom": 7,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088141_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/141.png",
      "link": "https://ffxivcollect.com/triad/cards/141",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/cfcf75126d3",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293768,
          "name": "와이먼드",
          "original": "Wymond",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 날 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293768",
          "region": "다날란",
          "npc": {
            "id": 2293768,
            "residentId": 1001285,
            "name": "와이먼드",
            "original": "Wymond",
            "location": "울다하 날 회랑",
            "region": "다날란",
            "x": "9.9",
            "y": "8.7",
            "quest": null,
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293768"
          }
        }
      ]
    },
    {
      "id": 142,
      "number": "No. 129",
      "order": 129,
      "deckOrder": 15,
      "ex": false,
      "name": "지브리옹",
      "original": "Gibrillont",
      "korean": true,
      "stars": 2,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 6,
        "bottom": 3,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088142_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/142.png",
      "link": "https://ffxivcollect.com/triad/cards/142",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/04bdd43789c",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293806,
          "name": "엘레이스",
          "original": "Elaisse",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "이슈가르드 상층",
          "link": "https://ffxivcollect.com/triad/npcs/2293806",
          "region": "커르다스",
          "npc": {
            "id": 2293806,
            "residentId": 1012180,
            "name": "엘레이스",
            "original": "Elaisse",
            "location": "이슈가르드 상층",
            "region": "커르다스",
            "x": "7.7",
            "y": "10.8",
            "quest": {
              "name": "상인의 함정",
              "original": "Caught in the Act",
              "link": "https://www.garlandtools.org/db/#quest/67406"
            },
            "ruleIds": [
              6,
              9
            ],
            "rules": [
              "합산",
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293806"
          }
        }
      ]
    },
    {
      "id": 143,
      "number": "No. 130",
      "order": 130,
      "deckOrder": 16,
      "ex": false,
      "name": "라니에트 드 아유나르트",
      "original": "Laniaitte de Haillenarte",
      "korean": true,
      "stars": 2,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 6,
        "bottom": 3,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088143_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/143.png",
      "link": "https://ffxivcollect.com/triad/cards/143",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c581d90f381",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293801,
          "name": "마리엘",
          "original": "Marielle",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아발라시아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293801",
          "region": "아발라시아",
          "npc": {
            "id": 2293801,
            "residentId": 1012060,
            "name": "마리엘",
            "original": "Marielle",
            "location": "아발라시아 구름바다",
            "region": "아발라시아",
            "x": "15.4",
            "y": "37.7",
            "quest": {
              "name": "말썽꾸러기 다루는 법 2",
              "original": "A Reward Long in Coming",
              "link": "https://www.garlandtools.org/db/#quest/67132"
            },
            "ruleIds": [
              8
            ],
            "rules": [
              "순서대로"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293801"
          }
        }
      ]
    },
    {
      "id": 144,
      "number": "No. 131",
      "order": 131,
      "deckOrder": 14,
      "ex": false,
      "name": "로즈웬",
      "original": "Rhoswen",
      "korean": true,
      "stars": 2,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 6,
        "bottom": 4,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088144_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/144.png",
      "link": "https://ffxivcollect.com/triad/cards/144",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/235b9a4b4c1",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293818,
          "name": "오칼카야",
          "original": "O'kalkaya",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "림사 로민사 상층 갑판",
          "link": "https://ffxivcollect.com/triad/npcs/2293818",
          "region": "라노시아",
          "npc": {
            "id": 2293818,
            "residentId": 1000919,
            "name": "오칼카야",
            "original": "O'kalkaya",
            "location": "림사 로민사 상층 갑판",
            "region": "라노시아",
            "x": "12.2",
            "y": "14.0",
            "quest": {
              "name": "거친 파도 넘나드는 난파선의 섬",
              "original": "Storming the Hull",
              "link": "https://www.garlandtools.org/db/#quest/67784"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293818"
          }
        }
      ]
    },
    {
      "id": 145,
      "number": "No. 132",
      "order": 132,
      "deckOrder": 14,
      "ex": false,
      "name": "카르발랭 드 고르가뉴",
      "original": "Carvallain de Gorgagne",
      "korean": true,
      "stars": 2,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 7,
        "bottom": 7,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088145_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/145.png",
      "link": "https://ffxivcollect.com/triad/cards/145",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/5cf69f30a80",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293819,
          "name": "모딘",
          "original": "Mordyn",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "림사 로민사 상층 갑판",
          "link": "https://ffxivcollect.com/triad/npcs/2293819",
          "region": "라노시아",
          "npc": {
            "id": 2293819,
            "residentId": 1000916,
            "name": "모딘",
            "original": "Mordyn",
            "location": "림사 로민사 상층 갑판",
            "region": "라노시아",
            "x": "11.3",
            "y": "7.9",
            "quest": {
              "name": "거친 파도 넘나드는 난파선의 섬",
              "original": "Storming the Hull",
              "link": "https://www.garlandtools.org/db/#quest/67784"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293819"
          }
        }
      ]
    },
    {
      "id": 146,
      "number": "No. 133",
      "order": 133,
      "deckOrder": 30,
      "ex": false,
      "name": "칼 미크",
      "original": "Kal Myhk",
      "korean": true,
      "stars": 3,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 8,
        "bottom": 4,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088146_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/146.png",
      "link": "https://ffxivcollect.com/triad/cards/146",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4158a4dbf78",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293817,
          "name": "단장 모그진",
          "original": "Master Mogzin",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "드라바니아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293817",
          "region": "드라바니아",
          "npc": {
            "id": 2293817,
            "residentId": 1017320,
            "name": "단장 모그진",
            "original": "Master Mogzin",
            "location": "드라바니아 구름바다",
            "region": "드라바니아",
            "x": "15.7",
            "y": "28.8",
            "quest": {
              "name": "미래를 바라보는 복원단!",
              "original": "The Zenith of Craftsmanship",
              "link": "https://www.garlandtools.org/db/#quest/67863"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293817"
          }
        }
      ]
    },
    {
      "id": 147,
      "number": "No. 134",
      "order": 134,
      "deckOrder": 19,
      "ex": false,
      "name": "와우케온",
      "original": "Waukkeon",
      "korean": true,
      "stars": 3,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 6,
        "bottom": 7,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088147_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/147.png",
      "link": "https://ffxivcollect.com/triad/cards/147",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bb7656b233d",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293812,
          "name": "리누바리",
          "original": "Linu Vali",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아발라시아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293812",
          "region": "아발라시아",
          "npc": {
            "id": 2293812,
            "residentId": 1016087,
            "name": "리누바리",
            "original": "Linu Vali",
            "location": "아발라시아 구름바다",
            "region": "아발라시아",
            "x": "6.6",
            "y": "14.3",
            "quest": {
              "name": "적절한 비유",
              "original": "The Nest of Honor",
              "link": "https://www.garlandtools.org/db/#quest/67761"
            },
            "ruleIds": [
              9,
              10
            ],
            "rules": [
              "무작위 순서",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293812"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 33,
          "name": "거두지 않는 섬",
          "original": "Neverreap",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/c09d7f0d58c",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 148,
      "number": "No. 135",
      "order": 135,
      "deckOrder": 19,
      "ex": false,
      "name": "전시 책임자",
      "original": "Curator",
      "korean": true,
      "stars": 3,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 6,
        "bottom": 4,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088148_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/148.png",
      "link": "https://ffxivcollect.com/triad/cards/148",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b71f9486a25",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293803,
          "name": "지루해 보이는 제국병",
          "original": "Idle Imperial",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아지스 라",
          "link": "https://ffxivcollect.com/triad/npcs/2293803",
          "region": "아발라시아",
          "npc": {
            "id": 2293803,
            "residentId": 1015021,
            "name": "지루해 보이는 제국병",
            "original": "Idle Imperial",
            "location": "아지스 라",
            "region": "아발라시아",
            "x": "28.1",
            "y": "31.2",
            "quest": {
              "name": "새로운 날개 엑셀시어",
              "original": "The First Flight of the Excelsior",
              "link": "https://www.garlandtools.org/db/#quest/67199"
            },
            "ruleIds": [
              9,
              14
            ],
            "rules": [
              "무작위 순서",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293803"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 35,
          "name": "무한연속 박물함",
          "original": "The Fractal Continuum",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/b9cacb80f11",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 149,
      "number": "No. 136",
      "order": 136,
      "deckOrder": 28,
      "ex": false,
      "name": "안개수염",
      "original": "Mistbeard",
      "korean": true,
      "stars": 3,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 6,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088149_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/149.png",
      "link": "https://ffxivcollect.com/triad/cards/149",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4b5413b271e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293818,
          "name": "오칼카야",
          "original": "O'kalkaya",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "림사 로민사 상층 갑판",
          "link": "https://ffxivcollect.com/triad/npcs/2293818",
          "region": "라노시아",
          "npc": {
            "id": 2293818,
            "residentId": 1000919,
            "name": "오칼카야",
            "original": "O'kalkaya",
            "location": "림사 로민사 상층 갑판",
            "region": "라노시아",
            "x": "12.2",
            "y": "14.0",
            "quest": {
              "name": "거친 파도 넘나드는 난파선의 섬",
              "original": "Storming the Hull",
              "link": "https://www.garlandtools.org/db/#quest/67784"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293818"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 172,
          "name": "난파선의 섬(어려움)",
          "original": "Hullbreaker Isle (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/c210394f48a",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 150,
      "number": "No. 137",
      "order": 137,
      "deckOrder": 38,
      "ex": false,
      "name": "우네 & 도가",
      "original": "Unei & Doga",
      "korean": true,
      "stars": 4,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 8,
        "bottom": 6,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088150_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/150.png",
      "link": "https://ffxivcollect.com/triad/cards/150",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/515d6de17cf",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293814,
          "name": "클륀토타",
          "original": "Klynthota",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "모르도나",
          "link": "https://ffxivcollect.com/triad/npcs/2293814",
          "region": "모르도나",
          "npc": {
            "id": 2293814,
            "residentId": 1006550,
            "name": "클륀토타",
            "original": "Klynthota",
            "location": "모르도나",
            "region": "모르도나",
            "x": "30.4",
            "y": "13.7",
            "quest": {
              "name": "악귀와 달의 위성",
              "original": "Moon Sliver and Me",
              "link": "https://www.garlandtools.org/db/#quest/66530"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293814"
          }
        }
      ]
    },
    {
      "id": 151,
      "number": "No. 138",
      "order": 138,
      "deckOrder": 39,
      "ex": false,
      "name": "티아마트",
      "original": "Tiamat",
      "korean": true,
      "stars": 4,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 6,
        "bottom": 5,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088151_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/151.png",
      "link": "https://ffxivcollect.com/triad/cards/151",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d26759f0605",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293803,
          "name": "지루해 보이는 제국병",
          "original": "Idle Imperial",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아지스 라",
          "link": "https://ffxivcollect.com/triad/npcs/2293803",
          "region": "아발라시아",
          "npc": {
            "id": 2293803,
            "residentId": 1015021,
            "name": "지루해 보이는 제국병",
            "original": "Idle Imperial",
            "location": "아지스 라",
            "region": "아발라시아",
            "x": "28.1",
            "y": "31.2",
            "quest": {
              "name": "새로운 날개 엑셀시어",
              "original": "The First Flight of the Excelsior",
              "link": "https://www.garlandtools.org/db/#quest/67199"
            },
            "ruleIds": [
              9,
              14
            ],
            "rules": [
              "무작위 순서",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293803"
          }
        }
      ]
    },
    {
      "id": 152,
      "number": "No. 139",
      "order": 139,
      "deckOrder": 33,
      "ex": false,
      "name": "칼로피스테리",
      "original": "Calofisteri",
      "korean": true,
      "stars": 4,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 8,
        "bottom": 7,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088152_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/152.png",
      "link": "https://ffxivcollect.com/triad/cards/152",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f13aa24f276",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293844,
          "name": "붉은부리 조달원",
          "original": "Redbill Storeboy",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "이딜샤이어",
          "link": "https://ffxivcollect.com/triad/npcs/2293844",
          "region": "드라바니아",
          "npc": {
            "id": 2293844,
            "residentId": 1027208,
            "name": "붉은부리 조달원",
            "original": "Redbill Storeboy",
            "location": "이딜샤이어",
            "region": "드라바니아",
            "x": "3.8",
            "y": "4.5",
            "quest": {
              "name": "또 하나 모험이 끝나고",
              "original": "A Redbill Farewell",
              "link": "https://www.garlandtools.org/db/#quest/67910"
            },
            "ruleIds": [
              9
            ],
            "rules": [
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293844"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 168,
          "name": "금기도시 마하",
          "original": "The Weeping City of Mhach",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/60cf92904b2",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 153,
      "number": "No. 140",
      "order": 140,
      "deckOrder": 46,
      "ex": false,
      "name": "흐레스벨그",
      "original": "Hraesvelgr",
      "korean": true,
      "stars": 5,
      "patch": "3.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 7,
        "bottom": 10,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088153_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/153.png",
      "link": "https://ffxivcollect.com/triad/cards/153",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f7d058cbbce",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293817,
          "name": "단장 모그진",
          "original": "Master Mogzin",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "드라바니아 구름바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293817",
          "region": "드라바니아",
          "npc": {
            "id": 2293817,
            "residentId": 1017320,
            "name": "단장 모그진",
            "original": "Master Mogzin",
            "location": "드라바니아 구름바다",
            "region": "드라바니아",
            "x": "15.7",
            "y": "28.8",
            "quest": {
              "name": "미래를 바라보는 복원단!",
              "original": "The Zenith of Craftsmanship",
              "link": "https://www.garlandtools.org/db/#quest/67863"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293817"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "플래티넘 트라이어드 팩",
          "original": "Platinum Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#5",
          "pack": {
            "id": 5,
            "name": "플래티넘 트라이어드 팩",
            "cost": 0,
            "link": "https://ffxivcollect.com/triad/packs#5"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 171,
          "name": "소르 카이",
          "original": "Sohr Khai",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/6b652893080",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 154,
      "number": "No. 141",
      "order": 141,
      "deckOrder": 1,
      "ex": false,
      "name": "아프칼루",
      "original": "Apkallu",
      "korean": true,
      "stars": 1,
      "patch": "3.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 4,
        "bottom": 4,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088154_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/154.png",
      "link": "https://ffxivcollect.com/triad/cards/154",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/320d5b0ca40",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293820,
          "name": "초록손 위라 리에가",
          "original": "Wyra “Greenhands” Lyehga",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "카드 대결장",
          "link": "https://ffxivcollect.com/triad/npcs/2293820",
          "region": "다날란",
          "npc": {
            "id": 2293820,
            "residentId": 1016297,
            "name": "초록손 위라 리에가",
            "original": "Wyra “Greenhands” Lyehga",
            "location": "카드 대결장",
            "region": "다날란",
            "x": "3.4",
            "y": "3.4",
            "quest": null,
            "ruleIds": [
              2,
              4
            ],
            "rules": [
              "모두 공개",
              "동수"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293820"
          }
        }
      ]
    },
    {
      "id": 155,
      "number": "No. 142",
      "order": 142,
      "deckOrder": 1,
      "ex": false,
      "name": "콜리브리",
      "original": "Colibri",
      "korean": true,
      "stars": 1,
      "patch": "3.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 1,
        "bottom": 4,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088155_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/155.png",
      "link": "https://ffxivcollect.com/triad/cards/155",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a842c70907f",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293823,
          "name": "고귀한 플리슈아렐",
          "original": "Flichoirel the Lordling",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "카드 대결장",
          "link": "https://ffxivcollect.com/triad/npcs/2293823",
          "region": "다날란",
          "npc": {
            "id": 2293823,
            "residentId": 1016300,
            "name": "고귀한 플리슈아렐",
            "original": "Flichoirel the Lordling",
            "location": "카드 대결장",
            "region": "다날란",
            "x": "3.8",
            "y": "3.7",
            "quest": null,
            "ruleIds": [],
            "rules": [],
            "link": "https://ffxivcollect.com/triad/npcs/2293823"
          }
        }
      ]
    },
    {
      "id": 156,
      "number": "No. 143",
      "order": 143,
      "deckOrder": 4,
      "ex": false,
      "name": "마도 죽음손아귀",
      "original": "Magitek Death Claw",
      "korean": true,
      "stars": 1,
      "patch": "3.4",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 4,
        "right": 3,
        "bottom": 2,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088156_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/156.png",
      "link": "https://ffxivcollect.com/triad/cards/156",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/1cab53d0a82",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        }
      ]
    },
    {
      "id": 157,
      "number": "No. 144",
      "order": 144,
      "deckOrder": 8,
      "ex": false,
      "name": "액체 불꽃",
      "original": "Liquid Flame",
      "korean": true,
      "stars": 2,
      "patch": "3.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 3,
        "bottom": 6,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088157_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/157.png",
      "link": "https://ffxivcollect.com/triad/cards/157",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ee2e12db190",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        }
      ]
    },
    {
      "id": 158,
      "number": "No. 145",
      "order": 145,
      "deckOrder": 8,
      "ex": false,
      "name": "양",
      "original": "Lost Lamb",
      "korean": true,
      "stars": 2,
      "patch": "3.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 3,
        "bottom": 4,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088158_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/158.png",
      "link": "https://ffxivcollect.com/triad/cards/158",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8ac8fbd3193",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293821,
          "name": "졸부 거만한 수사슴",
          "original": "Prideful Stag",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "카드 대결장",
          "link": "https://ffxivcollect.com/triad/npcs/2293821",
          "region": "다날란",
          "npc": {
            "id": 2293821,
            "residentId": 1016298,
            "name": "졸부 거만한 수사슴",
            "original": "Prideful Stag",
            "location": "카드 대결장",
            "region": "다날란",
            "x": "3.8",
            "y": "3.4",
            "quest": null,
            "ruleIds": [
              6
            ],
            "rules": [
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293821"
          }
        }
      ]
    },
    {
      "id": 159,
      "number": "No. 146",
      "order": 146,
      "deckOrder": 10,
      "ex": false,
      "name": "배달부 모그리",
      "original": "Delivery Moogle",
      "korean": true,
      "stars": 2,
      "patch": "3.4",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 5,
        "right": 5,
        "bottom": 6,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088159_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/159.png",
      "link": "https://ffxivcollect.com/triad/cards/159",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/9ede0fe32e6",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        }
      ]
    },
    {
      "id": 160,
      "number": "No. 147",
      "order": 147,
      "deckOrder": 11,
      "ex": false,
      "name": "마도 콜로서스",
      "original": "Magitek Colossus",
      "korean": true,
      "stars": 2,
      "patch": "3.4",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 6,
        "right": 3,
        "bottom": 6,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088160_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/160.png",
      "link": "https://ffxivcollect.com/triad/cards/160",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/69a0240cf14",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293824,
          "name": "카드 대결장 관리자",
          "original": "Hall Overseer",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "카드 대결장",
          "link": "https://ffxivcollect.com/triad/npcs/2293824",
          "region": "다날란",
          "npc": {
            "id": 2293824,
            "residentId": 1016295,
            "name": "카드 대결장 관리자",
            "original": "Hall Overseer",
            "location": "카드 대결장",
            "region": "다날란",
            "x": "3.6",
            "y": "3.6",
            "quest": null,
            "ruleIds": [
              9,
              11
            ],
            "rules": [
              "무작위 순서",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293824"
          }
        }
      ]
    },
    {
      "id": 161,
      "number": "No. 148",
      "order": 148,
      "deckOrder": 20,
      "ex": false,
      "name": "스트릭스",
      "original": "Strix",
      "korean": true,
      "stars": 3,
      "patch": "3.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 7,
        "bottom": 1,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088161_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/161.png",
      "link": "https://ffxivcollect.com/triad/cards/161",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/33d40705aa4",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293845,
          "name": "메로 록고",
          "original": "Mero Roggo",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "저지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293845",
          "region": "드라바니아",
          "npc": {
            "id": 2293845,
            "residentId": 1027209,
            "name": "메로 록고",
            "original": "Mero Roggo",
            "location": "저지 드라바니아",
            "region": "드라바니아",
            "x": "12.8",
            "y": "36.8",
            "quest": {
              "name": "광란의 전주곡",
              "original": "Prelude in Violet",
              "link": "https://www.garlandtools.org/db/#quest/68685"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293845"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 196,
          "name": "구브라 환상도서관(어려움)",
          "original": "The Great Gubal Library (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/18560552a6a",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 162,
      "number": "No. 149",
      "order": 149,
      "deckOrder": 24,
      "ex": false,
      "name": "청풍의 토졸 후아토틀",
      "original": "Tozol Huatotl",
      "korean": true,
      "stars": 3,
      "patch": "3.4",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 7,
        "right": 6,
        "bottom": 6,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088162_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/162.png",
      "link": "https://ffxivcollect.com/triad/cards/162",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/835502c8453",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293784,
          "name": "세즐 토톨록",
          "original": "Sezul Totoloc",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "검은장막 숲 북부삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293784",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293784,
            "residentId": 1009199,
            "name": "세즐 토톨록",
            "original": "Sezul Totoloc",
            "location": "검은장막 숲 북부삼림",
            "region": "검은장막 숲",
            "x": "24.4",
            "y": "23.4",
            "quest": {
              "name": " 날개를 펼쳐 누구보다 높이 날아라",
              "original": "Spread Your Wings and Soar",
              "link": "https://www.garlandtools.org/db/#quest/67029"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293784"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "브론즈 트라이어드 팩",
          "original": "Bronze Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#1",
          "pack": {
            "id": 1,
            "name": "브론즈 트라이어드 팩",
            "cost": 520,
            "link": "https://ffxivcollect.com/triad/packs#1"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 182,
          "name": "젤파톨",
          "original": "Xelphatol",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/10b543ab57d",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 163,
      "number": "No. 150",
      "order": 150,
      "deckOrder": 25,
      "ex": false,
      "name": "알렉산더 프라임",
      "original": "Alexander Prime",
      "korean": true,
      "stars": 3,
      "patch": "3.4",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 7,
        "right": 3,
        "bottom": 2,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088163_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/163.png",
      "link": "https://ffxivcollect.com/triad/cards/163",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/46dab9db0a0",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293815,
          "name": "탭클릭스",
          "original": "Tapklix",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "저지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293815",
          "region": "드라바니아",
          "npc": {
            "id": 2293815,
            "residentId": 1012287,
            "name": "탭클릭스",
            "original": "Tapklix",
            "location": "저지 드라바니아",
            "region": "드라바니아",
            "x": "22.0",
            "y": "18.8",
            "quest": {
              "name": "그녀가 없는 세상",
              "original": "A Gob in the Machine",
              "link": "https://www.garlandtools.org/db/#quest/67789"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293815"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 189,
          "name": "기공성 알렉산더: 천동편 4",
          "original": "Alexander - The Soul of the Creator",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/c676012a31a",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 164,
      "number": "No. 151",
      "order": 151,
      "deckOrder": 31,
      "ex": false,
      "name": "넉살 좋은 삼형제",
      "original": "Brendt, Brennan, & Bremondt",
      "korean": true,
      "stars": 3,
      "patch": "3.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 6,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088164_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/164.png",
      "link": "https://ffxivcollect.com/triad/cards/164",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/44d54b604d1",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293822,
          "name": "고주망태 넬",
          "original": "Nell Half-full",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "카드 대결장",
          "link": "https://ffxivcollect.com/triad/npcs/2293822",
          "region": "다날란",
          "npc": {
            "id": 2293822,
            "residentId": 1016299,
            "name": "고주망태 넬",
            "original": "Nell Half-full",
            "location": "카드 대결장",
            "region": "다날란",
            "x": "3.4",
            "y": "3.7",
            "quest": null,
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293822"
          }
        }
      ]
    },
    {
      "id": 165,
      "number": "No. 152",
      "order": 152,
      "deckOrder": 37,
      "ex": false,
      "name": "산크레드(창천의 이슈가르드)",
      "original": "Heavensward Thancred",
      "korean": true,
      "stars": 4,
      "patch": "3.4",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 8,
        "right": 1,
        "bottom": 7,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088165_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/165.png",
      "link": "https://ffxivcollect.com/triad/cards/165",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/131379e7703",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 1631,
          "name": "카드 수집가: 6단계",
          "original": "Triple-decker VI",
          "method": "트리플 트라이어드 카드 150종류 입수",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%20%EC%88%98%EC%A7%91%EA%B0%80%3A%206%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 166,
      "number": "No. 153",
      "order": 153,
      "deckOrder": 37,
      "ex": false,
      "name": "야슈톨라(창천의 이슈가르드)",
      "original": "Heavensward Y'shtola",
      "korean": true,
      "stars": 4,
      "patch": "3.4",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 9,
        "right": 9,
        "bottom": 2,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088166_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/166.png",
      "link": "https://ffxivcollect.com/triad/cards/166",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/46b53a22095",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 1632,
          "name": "길거리 듀얼리스트: 5단계",
          "original": "Triple Team V",
          "method": "트리플 트라이어드로 NPC 60명에게 승리",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EA%B8%B8%EA%B1%B0%EB%A6%AC%20%EB%93%80%EC%96%BC%EB%A6%AC%EC%8A%A4%ED%8A%B8%3A%205%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 167,
      "number": "No. 154",
      "order": 154,
      "deckOrder": 36,
      "ex": false,
      "name": "넬 반 다르누스",
      "original": "Nael van Darnus",
      "korean": true,
      "stars": 4,
      "patch": "3.4",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 3,
        "right": 9,
        "bottom": 3,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088167_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/167.png",
      "link": "https://ffxivcollect.com/triad/cards/167",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bbf1a7c10d5",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293823,
          "name": "고귀한 플리슈아렐",
          "original": "Flichoirel the Lordling",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "카드 대결장",
          "link": "https://ffxivcollect.com/triad/npcs/2293823",
          "region": "다날란",
          "npc": {
            "id": 2293823,
            "residentId": 1016300,
            "name": "고귀한 플리슈아렐",
            "original": "Flichoirel the Lordling",
            "location": "카드 대결장",
            "region": "다날란",
            "x": "3.8",
            "y": "3.7",
            "quest": null,
            "ruleIds": [],
            "rules": [],
            "link": "https://ffxivcollect.com/triad/npcs/2293823"
          }
        }
      ]
    },
    {
      "id": 168,
      "number": "No. 155",
      "order": 155,
      "deckOrder": 42,
      "ex": false,
      "name": "소피아",
      "original": "Sophia",
      "korean": true,
      "stars": 5,
      "patch": "3.4",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 10,
        "right": 8,
        "bottom": 5,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088168_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/168.png",
      "link": "https://ffxivcollect.com/triad/cards/168",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c43f135cdaa",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 183,
          "name": "여신 소피아 토벌전",
          "original": "Containment Bay P1T6",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/206a8369051",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 184,
          "name": "극 여신 소피아 토벌전",
          "original": "Containment Bay P1T6 (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/1820d2beabc",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 169,
      "number": "No. 156",
      "order": 156,
      "deckOrder": 1,
      "ex": false,
      "name": "오포오포",
      "original": "Opo-opo",
      "korean": true,
      "stars": 1,
      "patch": "3.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 4,
        "bottom": 2,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088169_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/169.png",
      "link": "https://ffxivcollect.com/triad/cards/169",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/70c58fbe372",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "600 맨더빌 골드 소서 포인트",
          "original": "600 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/169"
        }
      ]
    },
    {
      "id": 170,
      "number": "No. 157",
      "order": 157,
      "deckOrder": 8,
      "ex": false,
      "name": "금강거북",
      "original": "Adamantoise",
      "korean": true,
      "stars": 2,
      "patch": "3.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 7,
        "bottom": 4,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088170_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/170.png",
      "link": "https://ffxivcollect.com/triad/cards/170",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/aaf79b9b576",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "840 맨더빌 골드 소서 포인트",
          "original": "840 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/170"
        }
      ]
    },
    {
      "id": 171,
      "number": "No. 158",
      "order": 158,
      "deckOrder": 11,
      "ex": false,
      "name": "마도 뱅가드",
      "original": "Magitek Vanguard",
      "korean": true,
      "stars": 2,
      "patch": "3.5",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 3,
        "right": 5,
        "bottom": 4,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088171_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/171.png",
      "link": "https://ffxivcollect.com/triad/cards/171",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f684a1cd1a5",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "제국 트라이어드 팩",
          "original": "Imperial Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#6",
          "pack": {
            "id": 6,
            "name": "제국 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#6"
          }
        }
      ]
    },
    {
      "id": 172,
      "number": "No. 159",
      "order": 159,
      "deckOrder": 11,
      "ex": false,
      "name": "마도 건십",
      "original": "Magitek Gunship",
      "korean": true,
      "stars": 2,
      "patch": "3.5",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 3,
        "right": 5,
        "bottom": 5,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088172_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/172.png",
      "link": "https://ffxivcollect.com/triad/cards/172",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d30bffc6202",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "제국 트라이어드 팩",
          "original": "Imperial Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#6",
          "pack": {
            "id": 6,
            "name": "제국 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#6"
          }
        }
      ]
    },
    {
      "id": 174,
      "number": "No. 160",
      "order": 160,
      "deckOrder": 20,
      "ex": false,
      "name": "용암 전갈",
      "original": "Lava Scorpion",
      "korean": true,
      "stars": 3,
      "patch": "3.55a",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 8,
        "bottom": 5,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088174_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/174.png",
      "link": "https://ffxivcollect.com/triad/cards/174",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0483839c8ca",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 221,
          "name": "솜 알(어려움)",
          "original": "Sohm Al (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/c1ea0f615b4",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 175,
      "number": "No. 161",
      "order": 161,
      "deckOrder": 26,
      "ex": false,
      "name": "마도 프레데터",
      "original": "Magitek Predator",
      "korean": true,
      "stars": 3,
      "patch": "3.55a",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 5,
        "right": 7,
        "bottom": 4,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088175_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/175.png",
      "link": "https://ffxivcollect.com/triad/cards/175",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e9998858200",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "제국 트라이어드 팩",
          "original": "Imperial Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#6",
          "pack": {
            "id": 6,
            "name": "제국 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#6"
          }
        }
      ]
    },
    {
      "id": 176,
      "number": "No. 162",
      "order": 162,
      "deckOrder": 26,
      "ex": false,
      "name": "마도 스카이아머",
      "original": "Magitek Sky Armor",
      "korean": true,
      "stars": 3,
      "patch": "3.55a",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 6,
        "right": 2,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088176_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/176.png",
      "link": "https://ffxivcollect.com/triad/cards/176",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bb5c5842c13",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "제국 트라이어드 팩",
          "original": "Imperial Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#6",
          "pack": {
            "id": 6,
            "name": "제국 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#6"
          }
        }
      ]
    },
    {
      "id": 177,
      "number": "No. 163",
      "order": 163,
      "deckOrder": 31,
      "ex": false,
      "name": "철가면",
      "original": "The Griffin",
      "korean": true,
      "stars": 3,
      "patch": "3.55a",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 8,
        "bottom": 4,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088177_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/177.png",
      "link": "https://ffxivcollect.com/triad/cards/177",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/03400009571",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 219,
          "name": "바일사르 장성",
          "original": "Baelsar's Wall",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/22d510d3637",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 179,
      "number": "No. 164",
      "order": 164,
      "deckOrder": 33,
      "ex": false,
      "name": "공허의 디아볼로스",
      "original": "Diabolos Hollow",
      "korean": true,
      "stars": 4,
      "patch": "3.55a",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 4,
        "bottom": 8,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088179_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/179.png",
      "link": "https://ffxivcollect.com/triad/cards/179",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/5d64c249daa",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293844,
          "name": "붉은부리 조달원",
          "original": "Redbill Storeboy",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "이딜샤이어",
          "link": "https://ffxivcollect.com/triad/npcs/2293844",
          "region": "드라바니아",
          "npc": {
            "id": 2293844,
            "residentId": 1027208,
            "name": "붉은부리 조달원",
            "original": "Redbill Storeboy",
            "location": "이딜샤이어",
            "region": "드라바니아",
            "x": "3.8",
            "y": "4.5",
            "quest": {
              "name": "또 하나 모험이 끝나고",
              "original": "A Redbill Farewell",
              "link": "https://www.garlandtools.org/db/#quest/67910"
            },
            "ruleIds": [
              9
            ],
            "rules": [
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293844"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 220,
          "name": "둔 스카",
          "original": "Dun Scaith",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/4ded102beb0",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 180,
      "number": "No. 165",
      "order": 165,
      "deckOrder": 36,
      "ex": false,
      "name": "무장 병기",
      "original": "Armored Weapon",
      "korean": true,
      "stars": 4,
      "patch": "3.55a",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 3,
        "right": 5,
        "bottom": 9,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088180_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/180.png",
      "link": "https://ffxivcollect.com/triad/cards/180",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ebaa18e6143",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "제국 트라이어드 팩",
          "original": "Imperial Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#6",
          "pack": {
            "id": 6,
            "name": "제국 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#6"
          }
        }
      ]
    },
    {
      "id": 182,
      "number": "No. 166",
      "order": 166,
      "deckOrder": 42,
      "ex": false,
      "name": "주르반",
      "original": "Zurvan",
      "korean": true,
      "stars": 5,
      "patch": "3.5",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 8,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088182_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/182.png",
      "link": "https://ffxivcollect.com/triad/cards/182",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4c8edceda99",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 223,
          "name": "귀신 주르반 토벌전",
          "original": "Containment Bay Z1T9",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/4e265a3eced",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 224,
          "name": "극 귀신 주르반 토벌전",
          "original": "Containment Bay Z1T9 (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/84ced1731eb",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 173,
      "number": "No. 167",
      "order": 167,
      "deckOrder": 16,
      "ex": false,
      "name": "토끼 소녀",
      "original": "Gold Saucer Attendant",
      "korean": true,
      "stars": 2,
      "patch": "3.55a",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 1,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088173_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/173.png",
      "link": "https://ffxivcollect.com/triad/cards/173",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/fd7bb74779d",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "5,000 맨더빌 골드 소서 포인트",
          "original": "5,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/173"
        }
      ]
    },
    {
      "id": 178,
      "number": "No. 168",
      "order": 168,
      "deckOrder": 31,
      "ex": false,
      "name": "롤랜드",
      "original": "Roland",
      "korean": true,
      "stars": 3,
      "patch": "3.55a",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 7,
        "bottom": 8,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088178_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/178.png",
      "link": "https://ffxivcollect.com/triad/cards/178",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/49e227bf3ef",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "10,000 맨더빌 골드 소서 포인트",
          "original": "10,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/178"
        }
      ]
    },
    {
      "id": 181,
      "number": "No. 169",
      "order": 169,
      "deckOrder": 39,
      "ex": false,
      "name": "기기",
      "original": "Gigi",
      "korean": true,
      "stars": 4,
      "patch": "3.55a",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 8,
        "bottom": 4,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088181_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/181.png",
      "link": "https://ffxivcollect.com/triad/cards/181",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/1ac17cc4dcb",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "90,000 맨더빌 골드 소서 포인트",
          "original": "90,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/181"
        }
      ]
    },
    {
      "id": 183,
      "number": "No. 170",
      "order": 170,
      "deckOrder": 3,
      "ex": false,
      "name": "나마즈오",
      "original": "Namazu",
      "korean": true,
      "stars": 1,
      "patch": "4.0",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 1,
        "right": 6,
        "bottom": 1,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088183_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/183.png",
      "link": "https://ffxivcollect.com/triad/cards/183",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bc825419fb1",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293829,
          "name": "교에이",
          "original": "Gyoei",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "얀샤",
          "link": "https://ffxivcollect.com/triad/npcs/2293829",
          "region": "오사드",
          "npc": {
            "id": 2293829,
            "residentId": 1019301,
            "name": "교에이",
            "original": "Gyoei",
            "location": "얀샤",
            "region": "오사드",
            "x": "15.7",
            "y": "31.9",
            "quest": {
              "name": "미소 짓는 녀석",
              "original": "Criminal Phrenology",
              "link": "https://www.garlandtools.org/db/#quest/68281"
            },
            "ruleIds": [
              6,
              10
            ],
            "rules": [
              "합산",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293829"
          }
        }
      ]
    },
    {
      "id": 184,
      "number": "No. 171",
      "order": 171,
      "deckOrder": 10,
      "ex": false,
      "name": "코우진",
      "original": "Kojin",
      "korean": true,
      "stars": 2,
      "patch": "4.0",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 4,
        "right": 5,
        "bottom": 5,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088184_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/184.png",
      "link": "https://ffxivcollect.com/triad/cards/184",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/67c1aa93685",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293828,
          "name": "츠즈라",
          "original": "Tsuzura",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "홍옥해",
          "link": "https://ffxivcollect.com/triad/npcs/2293828",
          "region": "오사드",
          "npc": {
            "id": 2293828,
            "residentId": 1019184,
            "name": "츠즈라",
            "original": "Tsuzura",
            "location": "홍옥해",
            "region": "오사드",
            "x": "28.5",
            "y": "16.4",
            "quest": {
              "name": "혼은 등딱지에 깃든다",
              "original": "Our Most Venerated Ancestor",
              "link": "https://www.garlandtools.org/db/#quest/68227"
            },
            "ruleIds": [
              1,
              9
            ],
            "rules": [
              "무작위 규칙",
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293828"
          }
        }
      ]
    },
    {
      "id": 185,
      "number": "No. 172",
      "order": 172,
      "deckOrder": 10,
      "ex": false,
      "name": "아난타",
      "original": "Ananta",
      "korean": true,
      "stars": 2,
      "patch": "4.0",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 5,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088185_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/185.png",
      "link": "https://ffxivcollect.com/triad/cards/185",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f47c274a0ff",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293834,
          "name": "가리마",
          "original": "Garima",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "기라바니아 변방지대",
          "link": "https://ffxivcollect.com/triad/npcs/2293834",
          "region": "기라바니아",
          "npc": {
            "id": 2293834,
            "residentId": 1020818,
            "name": "가리마",
            "original": "Garima",
            "location": "기라바니아 변방지대",
            "region": "기라바니아",
            "x": "28.2",
            "y": "19.9",
            "quest": {
              "name": "어머니의 총애",
              "original": "Delicate as a Flower",
              "link": "https://www.garlandtools.org/db/#quest/68353"
            },
            "ruleIds": [
              6,
              12
            ],
            "rules": [
              "합산",
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293834"
          }
        }
      ]
    },
    {
      "id": 186,
      "number": "No. 173",
      "order": 173,
      "deckOrder": 16,
      "ex": false,
      "name": "메나고",
      "original": "M'naago",
      "korean": true,
      "stars": 2,
      "patch": "4.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 1,
        "bottom": 4,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088186_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/186.png",
      "link": "https://ffxivcollect.com/triad/cards/186",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/858b2eb01bb",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293825,
          "name": "어칸발드",
          "original": "Ercanbald",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "랄거의 손길",
          "link": "https://ffxivcollect.com/triad/npcs/2293825",
          "region": "기라바니아",
          "npc": {
            "id": 2293825,
            "residentId": 1019465,
            "name": "어칸발드",
            "original": "Ercanbald",
            "location": "랄거의 손길",
            "region": "기라바니아",
            "x": "9.8",
            "y": "9.7",
            "quest": {
              "name": "파괴신의 손길이 닿는 곳",
              "original": "A Haven for the Bold",
              "link": "https://www.garlandtools.org/db/#quest/67985"
            },
            "ruleIds": [],
            "rules": [],
            "link": "https://ffxivcollect.com/triad/npcs/2293825"
          }
        }
      ]
    },
    {
      "id": 187,
      "number": "No. 174",
      "order": 174,
      "deckOrder": 16,
      "ex": false,
      "name": "코토카제",
      "original": "Kotokaze",
      "korean": true,
      "stars": 2,
      "patch": "4.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 6,
        "bottom": 2,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088187_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/187.png",
      "link": "https://ffxivcollect.com/triad/cards/187",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/1f0860f0105",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293826,
          "name": "코토카제",
          "original": "Kotokaze",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293826",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293826,
            "residentId": 1019002,
            "name": "코토카제",
            "original": "Kotokaze",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "10.3",
            "y": "10.2",
            "quest": {
              "name": "울다하 무역상관에 잘 오셨습니다",
              "original": "By the Grace of Lord Lolorito",
              "link": "https://www.garlandtools.org/db/#quest/68008"
            },
            "ruleIds": [
              4
            ],
            "rules": [
              "동수"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293826"
          }
        }
      ]
    },
    {
      "id": 188,
      "number": "No. 175",
      "order": 175,
      "deckOrder": 20,
      "ex": false,
      "name": "매머드",
      "original": "Mammoth",
      "korean": true,
      "stars": 3,
      "patch": "4.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 3,
        "bottom": 8,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088188_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/188.png",
      "link": "https://ffxivcollect.com/triad/cards/188",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/81886cd33b4",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293832,
          "name": "문글리그",
          "original": "Munglig",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아짐 대초원",
          "link": "https://ffxivcollect.com/triad/npcs/2293832",
          "region": "오사드",
          "npc": {
            "id": 2293832,
            "residentId": 1019323,
            "name": "문글리그",
            "original": "Munglig",
            "location": "아짐 대초원",
            "region": "오사드",
            "x": "12.2",
            "y": "33.7",
            "quest": {
              "name": "용맹한 도탈족",
              "original": "The Undying Ones",
              "link": "https://www.garlandtools.org/db/#quest/68048"
            },
            "ruleIds": [
              4,
              9
            ],
            "rules": [
              "동수",
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293832"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293830,
          "name": "니겐",
          "original": "Nigen",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아짐 대초원",
          "link": "https://ffxivcollect.com/triad/npcs/2293830",
          "region": "오사드",
          "npc": {
            "id": 2293830,
            "residentId": 1019387,
            "name": "니겐",
            "original": "Nigen",
            "location": "아짐 대초원",
            "region": "오사드",
            "x": "31.9",
            "y": "11.6",
            "quest": {
              "name": "아내의 걱정",
              "original": "And Dzo It Goes",
              "link": "https://www.garlandtools.org/db/#quest/68308"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293830"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293831,
          "name": "오고데이",
          "original": "Ogodei",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아짐 대초원",
          "link": "https://ffxivcollect.com/triad/npcs/2293831",
          "region": "오사드",
          "npc": {
            "id": 2293831,
            "residentId": 1019421,
            "name": "오고데이",
            "original": "Ogodei",
            "location": "아짐 대초원",
            "region": "오사드",
            "x": "22.0",
            "y": "20.7",
            "quest": {
              "name": "초원에서 태어날 아이에게",
              "original": "A Warm Welcome",
              "link": "https://www.garlandtools.org/db/#quest/68311"
            },
            "ruleIds": [
              6,
              11
            ],
            "rules": [
              "합산",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293831"
          }
        },
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "돌발임무 \"긴엄니 압살자\" - 아짐 대초원",
          "original": "FATE \"Wham, Bam, Thank You, Mammoth\" - The Azim Steppe",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/188"
        }
      ]
    },
    {
      "id": 189,
      "number": "No. 176",
      "order": 176,
      "deckOrder": 20,
      "ex": false,
      "name": "포배드",
      "original": "Phoebad",
      "korean": true,
      "stars": 3,
      "patch": "4.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 8,
        "bottom": 3,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088189_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/189.png",
      "link": "https://ffxivcollect.com/triad/cards/189",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/fd580049646",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293840,
          "name": "암갈색 급류",
          "original": "Umber Torrent",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "기라바니아 호반지대",
          "link": "https://ffxivcollect.com/triad/npcs/2293840",
          "region": "기라바니아",
          "npc": {
            "id": 2293840,
            "residentId": 1025327,
            "name": "암갈색 급류",
            "original": "Umber Torrent",
            "location": "기라바니아 호반지대",
            "region": "기라바니아",
            "x": "16.4",
            "y": "24.6",
            "quest": {
              "name": "영웅의 귀환",
              "original": "Return of the Bull",
              "link": "https://www.garlandtools.org/db/#quest/68508"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293840"
          }
        },
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "돌발임무 \"하얗고 큰 얼굴\" - 기라바니아 호반지대",
          "original": "FATE \"Tall Tale\" - The Lochs",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/189"
        }
      ]
    },
    {
      "id": 190,
      "number": "No. 177",
      "order": 177,
      "deckOrder": 25,
      "ex": false,
      "name": "스사노오",
      "original": "Susano",
      "korean": true,
      "stars": 3,
      "patch": "4.0",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 2,
        "right": 8,
        "bottom": 3,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088190_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/190.png",
      "link": "https://ffxivcollect.com/triad/cards/190",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/86ebf31e1d5",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 243,
          "name": "스사노오 토벌전",
          "original": "The Pool of Tribute",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/37f52ddb19b",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 244,
          "name": "극 스사노오 토벌전",
          "original": "The Pool of Tribute (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/d5b152fa4b4",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 191,
      "number": "No. 178",
      "order": 178,
      "deckOrder": 25,
      "ex": false,
      "name": "락슈미",
      "original": "Lakshmi",
      "korean": true,
      "stars": 3,
      "patch": "4.0",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 7,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088191_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/191.png",
      "link": "https://ffxivcollect.com/triad/cards/191",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4d90fe973fb",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 263,
          "name": "락슈미 토벌전",
          "original": "Emanation",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/0b5cd739ef5",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 264,
          "name": "극 락슈미 토벌전",
          "original": "Emanation (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/f33ee9ce371",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 192,
      "number": "No. 179",
      "order": 179,
      "deckOrder": 26,
      "ex": false,
      "name": "그륀바트",
      "original": "Grynewaht",
      "korean": true,
      "stars": 3,
      "patch": "4.0",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 7,
        "right": 4,
        "bottom": 7,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088192_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/192.png",
      "link": "https://ffxivcollect.com/triad/cards/192",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f89e3514a44",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293835,
          "name": "제국군 탈영병",
          "original": "Imperial Deserter",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "기라바니아 호반지대",
          "link": "https://ffxivcollect.com/triad/npcs/2293835",
          "region": "기라바니아",
          "npc": {
            "id": 2293835,
            "residentId": 1023053,
            "name": "제국군 탈영병",
            "original": "Imperial Deserter",
            "location": "기라바니아 호반지대",
            "region": "기라바니아",
            "x": "32.7",
            "y": "30.1",
            "quest": {
              "name": "홍련의 해방자",
              "original": "Stormblood",
              "link": "https://www.garlandtools.org/db/#quest/68089"
            },
            "ruleIds": [
              11
            ],
            "rules": [
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293835"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 241,
          "name": "도마 성",
          "original": "Doma Castle",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/4e6ff665ed3",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 193,
      "number": "No. 180",
      "order": 180,
      "deckOrder": 31,
      "ex": false,
      "name": "라쇼",
      "original": "Rasho",
      "korean": true,
      "stars": 3,
      "patch": "4.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 8,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088193_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/193.png",
      "link": "https://ffxivcollect.com/triad/cards/193",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/581ab02a769",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293827,
          "name": "카이잔",
          "original": "Kaizan",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "홍옥해",
          "link": "https://ffxivcollect.com/triad/npcs/2293827",
          "region": "오사드",
          "npc": {
            "id": 2293827,
            "residentId": 1021519,
            "name": "카이잔",
            "original": "Kaizan",
            "location": "홍옥해",
            "region": "오사드",
            "x": "22.4",
            "y": "8.6",
            "quest": {
              "name": "해적 형제단의 징계",
              "original": "A Dance with Snakes",
              "link": "https://www.garlandtools.org/db/#quest/68216"
            },
            "ruleIds": [
              13,
              14
            ],
            "rules": [
              "유형 약화",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293827"
          }
        }
      ]
    },
    {
      "id": 194,
      "number": "No. 181",
      "order": 181,
      "deckOrder": 31,
      "ex": false,
      "name": "시리나",
      "original": "Cirina",
      "korean": true,
      "stars": 3,
      "patch": "4.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 5,
        "bottom": 6,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088194_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/194.png",
      "link": "https://ffxivcollect.com/triad/cards/194",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ed57b31831f",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293830,
          "name": "니겐",
          "original": "Nigen",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아짐 대초원",
          "link": "https://ffxivcollect.com/triad/npcs/2293830",
          "region": "오사드",
          "npc": {
            "id": 2293830,
            "residentId": 1019387,
            "name": "니겐",
            "original": "Nigen",
            "location": "아짐 대초원",
            "region": "오사드",
            "x": "31.9",
            "y": "11.6",
            "quest": {
              "name": "아내의 걱정",
              "original": "And Dzo It Goes",
              "link": "https://www.garlandtools.org/db/#quest/68308"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293830"
          }
        }
      ]
    },
    {
      "id": 195,
      "number": "No. 182",
      "order": 182,
      "deckOrder": 31,
      "ex": false,
      "name": "마그나이",
      "original": "Magnai",
      "korean": true,
      "stars": 3,
      "patch": "4.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 7,
        "bottom": 4,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088195_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/195.png",
      "link": "https://ffxivcollect.com/triad/cards/195",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/80443caf9a5",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293831,
          "name": "오고데이",
          "original": "Ogodei",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아짐 대초원",
          "link": "https://ffxivcollect.com/triad/npcs/2293831",
          "region": "오사드",
          "npc": {
            "id": 2293831,
            "residentId": 1019421,
            "name": "오고데이",
            "original": "Ogodei",
            "location": "아짐 대초원",
            "region": "오사드",
            "x": "22.0",
            "y": "20.7",
            "quest": {
              "name": "초원에서 태어날 아이에게",
              "original": "A Warm Welcome",
              "link": "https://www.garlandtools.org/db/#quest/68311"
            },
            "ruleIds": [
              6,
              11
            ],
            "rules": [
              "합산",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293831"
          }
        }
      ]
    },
    {
      "id": 196,
      "number": "No. 183",
      "order": 183,
      "deckOrder": 31,
      "ex": false,
      "name": "사두",
      "original": "Sadu",
      "korean": true,
      "stars": 3,
      "patch": "4.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 7,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088196_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/196.png",
      "link": "https://ffxivcollect.com/triad/cards/196",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/cf1a1f9c3af",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293832,
          "name": "문글리그",
          "original": "Munglig",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아짐 대초원",
          "link": "https://ffxivcollect.com/triad/npcs/2293832",
          "region": "오사드",
          "npc": {
            "id": 2293832,
            "residentId": 1019323,
            "name": "문글리그",
            "original": "Munglig",
            "location": "아짐 대초원",
            "region": "오사드",
            "x": "12.2",
            "y": "33.7",
            "quest": {
              "name": "용맹한 도탈족",
              "original": "The Undying Ones",
              "link": "https://www.garlandtools.org/db/#quest/68048"
            },
            "ruleIds": [
              4,
              9
            ],
            "rules": [
              "동수",
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293832"
          }
        }
      ]
    },
    {
      "id": 197,
      "number": "No. 184",
      "order": 184,
      "deckOrder": 35,
      "ex": false,
      "name": "신룡",
      "original": "Shinryu",
      "korean": true,
      "stars": 4,
      "patch": "4.0",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 7,
        "right": 8,
        "bottom": 8,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088197_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/197.png",
      "link": "https://ffxivcollect.com/triad/cards/197",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a8bb76a0fab",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293847,
          "name": "갈론드 아이언웍스 조사원",
          "original": "Ironworks Hand",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "랄거의 손길",
          "link": "https://ffxivcollect.com/triad/npcs/2293847",
          "region": "기라바니아",
          "npc": {
            "id": 2293847,
            "residentId": 1027210,
            "name": "갈론드 아이언웍스 조사원",
            "original": "Ironworks Hand",
            "location": "랄거의 손길",
            "region": "기라바니아",
            "x": "13.7",
            "y": "11.3",
            "quest": {
              "name": "날개에 꿈을",
              "original": "To Kweh under Distant Skies",
              "link": "https://www.garlandtools.org/db/#quest/68693"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293847"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 239,
          "name": "신룡 토벌전",
          "original": "The Royal Menagerie",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/e7f2a59aaf1",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 278,
          "name": "극 신룡 토벌전",
          "original": "The Minstrel's Ballad: Shinryu's Domain",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/76d334b99e2",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 198,
      "number": "No. 185",
      "order": 185,
      "deckOrder": 36,
      "ex": false,
      "name": "요츠유",
      "original": "Yotsuyu",
      "korean": true,
      "stars": 4,
      "patch": "4.0",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 9,
        "right": 2,
        "bottom": 8,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088198_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/198.png",
      "link": "https://ffxivcollect.com/triad/cards/198",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c1924e5109e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293835,
          "name": "제국군 탈영병",
          "original": "Imperial Deserter",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "기라바니아 호반지대",
          "link": "https://ffxivcollect.com/triad/npcs/2293835",
          "region": "기라바니아",
          "npc": {
            "id": 2293835,
            "residentId": 1023053,
            "name": "제국군 탈영병",
            "original": "Imperial Deserter",
            "location": "기라바니아 호반지대",
            "region": "기라바니아",
            "x": "32.7",
            "y": "30.1",
            "quest": {
              "name": "홍련의 해방자",
              "original": "Stormblood",
              "link": "https://www.garlandtools.org/db/#quest/68089"
            },
            "ruleIds": [
              11
            ],
            "rules": [
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293835"
          }
        }
      ]
    },
    {
      "id": 199,
      "number": "No. 186",
      "order": 186,
      "deckOrder": 37,
      "ex": false,
      "name": "쿠루루 발데시온",
      "original": "Krile",
      "korean": true,
      "stars": 4,
      "patch": "4.0",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 2,
        "right": 8,
        "bottom": 8,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088199_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/199.png",
      "link": "https://ffxivcollect.com/triad/cards/199",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/dc813f2fad2",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 1908,
          "name": "카드 수집가: 7단계",
          "original": "Triple-decker VII",
          "method": "트리플 트라이어드 카드 190종류 입수",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%20%EC%88%98%EC%A7%91%EA%B0%80%3A%207%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 200,
      "number": "No. 187",
      "order": 187,
      "deckOrder": 37,
      "ex": false,
      "name": "리세",
      "original": "Lyse",
      "korean": true,
      "stars": 4,
      "patch": "4.0",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 6,
        "right": 9,
        "bottom": 1,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088200_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/200.png",
      "link": "https://ffxivcollect.com/triad/cards/200",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a83f13745d9",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 1909,
          "name": "길거리 듀얼리스트: 6단계",
          "original": "Triple Team VI",
          "method": "트리플 트라이어드로 NPC 70명에게 승리",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EA%B8%B8%EA%B1%B0%EB%A6%AC%20%EB%93%80%EC%96%BC%EB%A6%AC%EC%8A%A4%ED%8A%B8%3A%206%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 201,
      "number": "No. 188",
      "order": 188,
      "deckOrder": 43,
      "ex": false,
      "name": "제노스 예 갈부스",
      "original": "Zenos yae Galvus",
      "korean": true,
      "stars": 5,
      "patch": "4.0",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 7,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088201_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/201.png",
      "link": "https://ffxivcollect.com/triad/cards/201",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/813456fe724",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293842,
          "name": "하치난",
          "original": "Hachinan",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "얀샤",
          "link": "https://ffxivcollect.com/triad/npcs/2293842",
          "region": "오사드",
          "npc": {
            "id": 2293842,
            "residentId": 1026600,
            "name": "하치난",
            "original": "Hachinan",
            "location": "얀샤",
            "region": "오사드",
            "x": "26.5",
            "y": "12.9",
            "quest": {
              "name": "십육야의 달",
              "original": "The Primary Agreement",
              "link": "https://www.garlandtools.org/db/#quest/68610"
            },
            "ruleIds": [
              11,
              12
            ],
            "rules": [
              "에이스 약화",
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293842"
          }
        },
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 247,
          "name": "알라미고",
          "original": "Ala Mhigo",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/5e1a7bf4569",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 202,
      "number": "No. 189",
      "order": 189,
      "deckOrder": 47,
      "ex": false,
      "name": "히엔",
      "original": "Hien",
      "korean": true,
      "stars": 5,
      "patch": "4.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 10,
        "bottom": 5,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088202_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/202.png",
      "link": "https://ffxivcollect.com/triad/cards/202",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ac7c0a7696f",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293833,
          "name": "키우카",
          "original": "Kiuka",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "도마 도읍지",
          "link": "https://ffxivcollect.com/triad/npcs/2293833",
          "region": "오사드",
          "npc": {
            "id": 2293833,
            "residentId": 1024797,
            "name": "키우카",
            "original": "Kiuka",
            "location": "도마 도읍지",
            "region": "오사드",
            "x": "7.0",
            "y": "5.9",
            "quest": {
              "name": "도마라는 나라",
              "original": "The World Turned Upside Down",
              "link": "https://www.garlandtools.org/db/#quest/68061"
            },
            "ruleIds": [
              9
            ],
            "rules": [
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293833"
          }
        }
      ]
    },
    {
      "id": 203,
      "number": "No. 190",
      "order": 190,
      "deckOrder": 1,
      "ex": false,
      "name": "이끼이끼",
      "original": "Mossling",
      "korean": true,
      "stars": 1,
      "patch": "4.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 2,
        "bottom": 5,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088203_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/203.png",
      "link": "https://ffxivcollect.com/triad/cards/203",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/18cacf4e129",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "840 맨더빌 골드 소서 포인트",
          "original": "840 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/203"
        }
      ]
    },
    {
      "id": 204,
      "number": "No. 191",
      "order": 191,
      "deckOrder": 8,
      "ex": false,
      "name": "큰메뚜기",
      "original": "Chapuli",
      "korean": true,
      "stars": 2,
      "patch": "4.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 2,
        "bottom": 2,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088204_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/204.png",
      "link": "https://ffxivcollect.com/triad/cards/204",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/91318c20883",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "1,200 맨더빌 골드 소서 포인트",
          "original": "1,200 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/204"
        }
      ]
    },
    {
      "id": 205,
      "number": "No. 192",
      "order": 192,
      "deckOrder": 10,
      "ex": false,
      "name": "키키룬 고기냠냠이",
      "original": "Qiqirn Meateater",
      "korean": true,
      "stars": 2,
      "patch": "4.1",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 1,
        "right": 5,
        "bottom": 7,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088205_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/205.png",
      "link": "https://ffxivcollect.com/triad/cards/205",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0e37a7eb877",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293834,
          "name": "가리마",
          "original": "Garima",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "기라바니아 변방지대",
          "link": "https://ffxivcollect.com/triad/npcs/2293834",
          "region": "기라바니아",
          "npc": {
            "id": 2293834,
            "residentId": 1020818,
            "name": "가리마",
            "original": "Garima",
            "location": "기라바니아 변방지대",
            "region": "기라바니아",
            "x": "28.2",
            "y": "19.9",
            "quest": {
              "name": "어머니의 총애",
              "original": "Delicate as a Flower",
              "link": "https://www.garlandtools.org/db/#quest/68353"
            },
            "ruleIds": [
              6,
              12
            ],
            "rules": [
              "합산",
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293834"
          }
        }
      ]
    },
    {
      "id": 206,
      "number": "No. 193",
      "order": 193,
      "deckOrder": 20,
      "ex": false,
      "name": "입바른 흐로드릭",
      "original": "Hrodric Poisontongue",
      "korean": true,
      "stars": 3,
      "patch": "4.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 7,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088206_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/206.png",
      "link": "https://ffxivcollect.com/triad/cards/206",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b6c5583e4d3",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 279,
          "name": "스칼라 유적",
          "original": "The Drowned City of Skalla",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/2a631760846",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 207,
      "number": "No. 194",
      "order": 194,
      "deckOrder": 31,
      "ex": false,
      "name": "포르돌라 렘 루푸스",
      "original": "Fordola rem Lupis",
      "korean": true,
      "stars": 3,
      "patch": "4.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 8,
        "bottom": 6,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088207_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/207.png",
      "link": "https://ffxivcollect.com/triad/cards/207",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0ba6ba1685e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293835,
          "name": "제국군 탈영병",
          "original": "Imperial Deserter",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "기라바니아 호반지대",
          "link": "https://ffxivcollect.com/triad/npcs/2293835",
          "region": "기라바니아",
          "npc": {
            "id": 2293835,
            "residentId": 1023053,
            "name": "제국군 탈영병",
            "original": "Imperial Deserter",
            "location": "기라바니아 호반지대",
            "region": "기라바니아",
            "x": "32.7",
            "y": "30.1",
            "quest": {
              "name": "홍련의 해방자",
              "original": "Stormblood",
              "link": "https://www.garlandtools.org/db/#quest/68089"
            },
            "ruleIds": [
              11
            ],
            "rules": [
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293835"
          }
        }
      ]
    },
    {
      "id": 208,
      "number": "No. 195",
      "order": 195,
      "deckOrder": 23,
      "ex": false,
      "name": "인마왕 로포칼레",
      "original": "Rofocale",
      "korean": true,
      "stars": 3,
      "patch": "4.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 1,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088208_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/208.png",
      "link": "https://ffxivcollect.com/triad/cards/208",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/fac142a7620",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293859,
          "name": "하나가사",
          "original": "Hanagasa",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293859",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293859,
            "residentId": 1032906,
            "name": "하나가사",
            "original": "Hanagasa",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "10.5",
            "y": "11.9",
            "quest": {
              "name": "오본느 수도원",
              "original": "The City of Lost Angels",
              "link": "https://www.garlandtools.org/db/#quest/68725"
            },
            "ruleIds": [
              6,
              13
            ],
            "rules": [
              "합산",
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293859"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 281,
          "name": "왕도 라바나스터",
          "original": "The Royal City of Rabanastre",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/f5c80e86c10",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 209,
      "number": "No. 196",
      "order": 196,
      "deckOrder": 33,
      "ex": false,
      "name": "냉혈검 아르가스",
      "original": "Argath Thadalfus",
      "korean": true,
      "stars": 4,
      "patch": "4.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 2,
        "bottom": 5,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088209_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/209.png",
      "link": "https://ffxivcollect.com/triad/cards/209",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/52a4f286a7b",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293859,
          "name": "하나가사",
          "original": "Hanagasa",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293859",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293859,
            "residentId": 1032906,
            "name": "하나가사",
            "original": "Hanagasa",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "10.5",
            "y": "11.9",
            "quest": {
              "name": "오본느 수도원",
              "original": "The City of Lost Angels",
              "link": "https://www.garlandtools.org/db/#quest/68725"
            },
            "ruleIds": [
              6,
              13
            ],
            "rules": [
              "합산",
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293859"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 281,
          "name": "왕도 라바나스터",
          "original": "The Royal City of Rabanastre",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/f5c80e86c10",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 210,
      "number": "No. 197",
      "order": 197,
      "deckOrder": 47,
      "ex": false,
      "name": "라우반 & 피핀",
      "original": "Raubahn & Pipin",
      "korean": true,
      "stars": 5,
      "patch": "4.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 10,
        "bottom": 10,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088210_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/210.png",
      "link": "https://ffxivcollect.com/triad/cards/210",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d79959e4433",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "400,000 맨더빌 골드 소서 포인트",
          "original": "400,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/210"
        }
      ]
    },
    {
      "id": 211,
      "number": "No. 198",
      "order": 198,
      "deckOrder": 1,
      "ex": false,
      "name": "코자",
      "original": "Koja",
      "korean": true,
      "stars": 1,
      "patch": "4.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 2,
        "bottom": 1,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088211_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/211.png",
      "link": "https://ffxivcollect.com/triad/cards/211",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/638c761ef40",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293836,
          "name": "마사츠치",
          "original": "Masatsuchi",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "얀샤",
          "link": "https://ffxivcollect.com/triad/npcs/2293836",
          "region": "오사드",
          "npc": {
            "id": 2293836,
            "residentId": 1019259,
            "name": "마사츠치",
            "original": "Masatsuchi",
            "location": "얀샤",
            "region": "오사드",
            "x": "29.5",
            "y": "20.2",
            "quest": {
              "name": "육식계 인랑",
              "original": "Tiger Blood",
              "link": "https://www.garlandtools.org/db/#quest/68268"
            },
            "ruleIds": [
              4
            ],
            "rules": [
              "동수"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293836"
          }
        }
      ]
    },
    {
      "id": 212,
      "number": "No. 199",
      "order": 199,
      "deckOrder": 8,
      "ex": false,
      "name": "안고",
      "original": "Ango",
      "korean": true,
      "stars": 2,
      "patch": "4.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 2,
        "bottom": 7,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088212_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/212.png",
      "link": "https://ffxivcollect.com/triad/cards/212",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b05b45e637e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293837,
          "name": "이소베",
          "original": "Isobe",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "홍옥해",
          "link": "https://ffxivcollect.com/triad/npcs/2293837",
          "region": "오사드",
          "npc": {
            "id": 2293837,
            "residentId": 1019219,
            "name": "이소베",
            "original": "Isobe",
            "location": "홍옥해",
            "region": "오사드",
            "x": "21.3",
            "y": "19.5",
            "quest": {
              "name": "히스이와 쿠레나이",
              "original": "The Two Princesses of Sui–no–Sato",
              "link": "https://www.garlandtools.org/db/#quest/68243"
            },
            "ruleIds": [
              6,
              14
            ],
            "rules": [
              "합산",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293837"
          }
        }
      ]
    },
    {
      "id": 213,
      "number": "No. 200",
      "order": 200,
      "deckOrder": 16,
      "ex": false,
      "name": "유도 시스템",
      "original": "Guidance Node",
      "korean": true,
      "stars": 2,
      "patch": "4.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 4,
        "bottom": 4,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088213_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/213.png",
      "link": "https://ffxivcollect.com/triad/cards/213",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/3dec975ed28",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 285,
          "name": "무한연속 박물함(어려움)",
          "original": "The Fractal Continuum (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/10f56ad2032",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 214,
      "number": "No. 201",
      "order": 201,
      "deckOrder": 16,
      "ex": false,
      "name": "탄스이",
      "original": "Tansui",
      "korean": true,
      "stars": 2,
      "patch": "4.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 2,
        "bottom": 3,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088214_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/214.png",
      "link": "https://ffxivcollect.com/triad/cards/214",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f01b435996c",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293838,
          "name": "유우스이",
          "original": "Yusui",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "홍옥해",
          "link": "https://ffxivcollect.com/triad/npcs/2293838",
          "region": "오사드",
          "npc": {
            "id": 2293838,
            "residentId": 1019168,
            "name": "유우스이",
            "original": "Yusui",
            "location": "홍옥해",
            "region": "오사드",
            "x": "31.5",
            "y": "37.1",
            "quest": {
              "name": "곤경에 처한 해적 형제단",
              "original": "Boys with Boats",
              "link": "https://www.garlandtools.org/db/#quest/68014"
            },
            "ruleIds": [
              6
            ],
            "rules": [
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293838"
          }
        }
      ]
    },
    {
      "id": 215,
      "number": "No. 202",
      "order": 202,
      "deckOrder": 20,
      "ex": false,
      "name": "현무",
      "original": "Genbu",
      "korean": true,
      "stars": 3,
      "patch": "4.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 7,
        "bottom": 1,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088215_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/215.png",
      "link": "https://ffxivcollect.com/triad/cards/215",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e6acf3aba6d",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 284,
          "name": "지옥뚜껑",
          "original": "Hells' Lid",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/bc73953dc39",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 216,
      "number": "No. 203",
      "order": 203,
      "deckOrder": 20,
      "ex": false,
      "name": "백호",
      "original": "Byakko",
      "korean": true,
      "stars": 3,
      "patch": "4.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 1,
        "bottom": 7,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088216_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/216.png",
      "link": "https://ffxivcollect.com/triad/cards/216",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/704d4e7dd30",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 290,
          "name": "백호 토벌전",
          "original": "The Jade Stoa",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/3e8ee9f8e98",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 291,
          "name": "극 백호 토벌전",
          "original": "The Jade Stoa (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/caaf9cad5e0",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 217,
      "number": "No. 204",
      "order": 204,
      "deckOrder": 27,
      "ex": false,
      "name": "아렌발드 렌티누스",
      "original": "Arenvald Lentinus",
      "korean": true,
      "stars": 3,
      "patch": "4.2",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 8,
        "right": 4,
        "bottom": 8,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088217_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/217.png",
      "link": "https://ffxivcollect.com/triad/cards/217",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/792f9246bd3",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293840,
          "name": "암갈색 급류",
          "original": "Umber Torrent",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "기라바니아 호반지대",
          "link": "https://ffxivcollect.com/triad/npcs/2293840",
          "region": "기라바니아",
          "npc": {
            "id": 2293840,
            "residentId": 1025327,
            "name": "암갈색 급류",
            "original": "Umber Torrent",
            "location": "기라바니아 호반지대",
            "region": "기라바니아",
            "x": "16.4",
            "y": "24.6",
            "quest": {
              "name": "영웅의 귀환",
              "original": "Return of the Bull",
              "link": "https://www.garlandtools.org/db/#quest/68508"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293840"
          }
        }
      ]
    },
    {
      "id": 218,
      "number": "No. 205",
      "order": 205,
      "deckOrder": 24,
      "ex": false,
      "name": "인랑족",
      "original": "Lupin",
      "korean": true,
      "stars": 3,
      "patch": "4.2",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 3,
        "right": 3,
        "bottom": 8,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088218_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/218.png",
      "link": "https://ffxivcollect.com/triad/cards/218",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ceea1c7b391",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293836,
          "name": "마사츠치",
          "original": "Masatsuchi",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "얀샤",
          "link": "https://ffxivcollect.com/triad/npcs/2293836",
          "region": "오사드",
          "npc": {
            "id": 2293836,
            "residentId": 1019259,
            "name": "마사츠치",
            "original": "Masatsuchi",
            "location": "얀샤",
            "region": "오사드",
            "x": "29.5",
            "y": "20.2",
            "quest": {
              "name": "육식계 인랑",
              "original": "Tiger Blood",
              "link": "https://www.garlandtools.org/db/#quest/68268"
            },
            "ruleIds": [
              4
            ],
            "rules": [
              "동수"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293836"
          }
        }
      ]
    },
    {
      "id": 219,
      "number": "No. 206",
      "order": 206,
      "deckOrder": 39,
      "ex": false,
      "name": "행콕",
      "original": "Hancock",
      "korean": true,
      "stars": 4,
      "patch": "4.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 9,
        "bottom": 1,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088219_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/219.png",
      "link": "https://ffxivcollect.com/triad/cards/219",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/fe541ae7f66",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293839,
          "name": "키키모",
          "original": "Kikimo",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293839",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293839,
            "residentId": 1019049,
            "name": "키키모",
            "original": "Kikimo",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "8.6",
            "y": "14.0",
            "quest": {
              "name": "울다하 무역상관에 잘 오셨습니다",
              "original": "By the Grace of Lord Lolorito",
              "link": "https://www.garlandtools.org/db/#quest/68008"
            },
            "ruleIds": [
              11,
              14
            ],
            "rules": [
              "에이스 약화",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293839"
          }
        }
      ]
    },
    {
      "id": 220,
      "number": "No. 207",
      "order": 207,
      "deckOrder": 47,
      "ex": false,
      "name": "히스이 & 쿠레나이",
      "original": "Hisui & Kurenai",
      "korean": true,
      "stars": 5,
      "patch": "4.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 2,
        "bottom": 7,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088220_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/220.png",
      "link": "https://ffxivcollect.com/triad/cards/220",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6ed66c06753",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293837,
          "name": "이소베",
          "original": "Isobe",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "홍옥해",
          "link": "https://ffxivcollect.com/triad/npcs/2293837",
          "region": "오사드",
          "npc": {
            "id": 2293837,
            "residentId": 1019219,
            "name": "이소베",
            "original": "Isobe",
            "location": "홍옥해",
            "region": "오사드",
            "x": "21.3",
            "y": "19.5",
            "quest": {
              "name": "히스이와 쿠레나이",
              "original": "The Two Princesses of Sui–no–Sato",
              "link": "https://www.garlandtools.org/db/#quest/68243"
            },
            "ruleIds": [
              6,
              14
            ],
            "rules": [
              "합산",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293837"
          }
        }
      ]
    },
    {
      "id": 224,
      "number": "No. 208",
      "order": 208,
      "deckOrder": 20,
      "ex": false,
      "name": "제천대성",
      "original": "Qitian Dasheng",
      "korean": true,
      "stars": 3,
      "patch": "4.36",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 8,
        "bottom": 4,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088224_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/224.png",
      "link": "https://ffxivcollect.com/triad/cards/224",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6d8b276dfb2",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 536,
          "name": "강엔 종묘",
          "original": "The Swallow's Compass",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/832472ee9d2",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 228,
      "number": "No. 209",
      "order": 209,
      "deckOrder": 35,
      "ex": false,
      "name": "츠쿠요미",
      "original": "Tsukuyomi",
      "korean": true,
      "stars": 4,
      "patch": "4.3",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 2,
        "right": 7,
        "bottom": 7,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088228_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/228.png",
      "link": "https://ffxivcollect.com/triad/cards/228",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/2fc047f327a",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 537,
          "name": "츠쿠요미 토벌전",
          "original": "Castrum Fluminis",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/0456095b013",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 538,
          "name": "극 츠쿠요미 토벌전",
          "original": "The Minstrel's Ballad: Tsukuyomi's Pain",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/246b2ff14bf",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 229,
      "number": "No. 210",
      "order": 210,
      "deckOrder": 41,
      "ex": false,
      "name": "귀룡 야즈마트",
      "original": "Yiazmat",
      "korean": true,
      "stars": 5,
      "patch": "4.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 6,
        "bottom": 10,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088229_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/229.png",
      "link": "https://ffxivcollect.com/triad/cards/229",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b422e12497a",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293859,
          "name": "하나가사",
          "original": "Hanagasa",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293859",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293859,
            "residentId": 1032906,
            "name": "하나가사",
            "original": "Hanagasa",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "10.5",
            "y": "11.9",
            "quest": {
              "name": "오본느 수도원",
              "original": "The City of Lost Angels",
              "link": "https://www.garlandtools.org/db/#quest/68725"
            },
            "ruleIds": [
              6,
              13
            ],
            "rules": [
              "합산",
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293859"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 550,
          "name": "대등대 리도르아나",
          "original": "The Ridorana Lighthouse",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/57d953f74ba",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 230,
      "number": "No. 211",
      "order": 211,
      "deckOrder": 47,
      "ex": false,
      "name": "고우세츠",
      "original": "Gosetsu",
      "korean": true,
      "stars": 5,
      "patch": "4.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 5,
        "bottom": 10,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088230_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/230.png",
      "link": "https://ffxivcollect.com/triad/cards/230",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4eb23674a94",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 2078,
          "name": "카드 수집가: 8단계",
          "original": "Triple-decker VIII",
          "method": "트리플 트라이어드 카드 220종류 입수",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%20%EC%88%98%EC%A7%91%EA%B0%80%3A%208%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 221,
      "number": "No. 212",
      "order": 212,
      "deckOrder": 1,
      "ex": false,
      "name": "총각바퀴 & 처녀바퀴",
      "original": "Wanyudo & Katasharin",
      "korean": true,
      "stars": 1,
      "patch": "4.35",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 1,
        "bottom": 1,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088221_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/221.png",
      "link": "https://ffxivcollect.com/triad/cards/221",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/47e5ad36830",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293846,
          "name": "우시오기",
          "original": "Ushiogi",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "홍옥해",
          "link": "https://ffxivcollect.com/triad/npcs/2293846",
          "region": "오사드",
          "npc": {
            "id": 2293846,
            "residentId": 1021521,
            "name": "우시오기",
            "original": "Ushiogi",
            "location": "홍옥해",
            "region": "오사드",
            "x": "21.8",
            "y": "7.9",
            "quest": {
              "name": "우리는 평범하지만",
              "original": "On the Shoulders of Giants",
              "link": "https://www.garlandtools.org/db/#quest/68668"
            },
            "ruleIds": [
              8,
              14
            ],
            "rules": [
              "순서대로",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293846"
          }
        },
        {
          "type": "Deep Dungeon",
          "typeName": "딥 던전",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "천궁탑 - 은빛·금빛 보물 자루",
          "original": "Heaven-on-High - Silver/Gold Sack",
          "method": "딥 던전의 숨겨진 보물 감정 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/221"
        }
      ]
    },
    {
      "id": 222,
      "number": "No. 213",
      "order": 213,
      "deckOrder": 8,
      "ex": false,
      "name": "직속 무사",
      "original": "Hatamoto",
      "korean": true,
      "stars": 2,
      "patch": "4.35",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 7,
        "bottom": 5,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088222_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/222.png",
      "link": "https://ffxivcollect.com/triad/cards/222",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e5a135bfc6c",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293846,
          "name": "우시오기",
          "original": "Ushiogi",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "홍옥해",
          "link": "https://ffxivcollect.com/triad/npcs/2293846",
          "region": "오사드",
          "npc": {
            "id": 2293846,
            "residentId": 1021521,
            "name": "우시오기",
            "original": "Ushiogi",
            "location": "홍옥해",
            "region": "오사드",
            "x": "21.8",
            "y": "7.9",
            "quest": {
              "name": "우리는 평범하지만",
              "original": "On the Shoulders of Giants",
              "link": "https://www.garlandtools.org/db/#quest/68668"
            },
            "ruleIds": [
              8,
              14
            ],
            "rules": [
              "순서대로",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293846"
          }
        },
        {
          "type": "Deep Dungeon",
          "typeName": "딥 던전",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "천궁탑 - 은빛·금빛 보물 자루",
          "original": "Heaven-on-High - Silver/Gold Sack",
          "method": "딥 던전의 숨겨진 보물 감정 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/222"
        }
      ]
    },
    {
      "id": 225,
      "number": "No. 214",
      "order": 214,
      "deckOrder": 20,
      "ex": false,
      "name": "히루코",
      "original": "Hiruko",
      "korean": true,
      "stars": 3,
      "patch": "4.36",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 5,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088225_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/225.png",
      "link": "https://ffxivcollect.com/triad/cards/225",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/926bd103a2c",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293846,
          "name": "우시오기",
          "original": "Ushiogi",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "홍옥해",
          "link": "https://ffxivcollect.com/triad/npcs/2293846",
          "region": "오사드",
          "npc": {
            "id": 2293846,
            "residentId": 1021521,
            "name": "우시오기",
            "original": "Ushiogi",
            "location": "홍옥해",
            "region": "오사드",
            "x": "21.8",
            "y": "7.9",
            "quest": {
              "name": "우리는 평범하지만",
              "original": "On the Shoulders of Giants",
              "link": "https://www.garlandtools.org/db/#quest/68668"
            },
            "ruleIds": [
              8,
              14
            ],
            "rules": [
              "순서대로",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293846"
          }
        },
        {
          "type": "Deep Dungeon",
          "typeName": "딥 던전",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "천궁탑 - 금빛 보물 자루",
          "original": "Heaven-on-High - Gold Sack",
          "method": "딥 던전의 숨겨진 보물 감정 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/225"
        }
      ]
    },
    {
      "id": 223,
      "number": "No. 215",
      "order": 215,
      "deckOrder": 8,
      "ex": false,
      "name": "눈요정",
      "original": "Yukinko",
      "korean": true,
      "stars": 2,
      "patch": "4.36",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 3,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088223_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/223.png",
      "link": "https://ffxivcollect.com/triad/cards/223",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0cd3321154e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293843,
          "name": "보탄",
          "original": "Botan",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293843",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293843,
            "residentId": 1026601,
            "name": "보탄",
            "original": "Botan",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "7.8",
            "y": "14.7",
            "quest": {
              "name": "얼음과 불의 땅 피로스",
              "original": "And We Shall Call It Pyros",
              "link": "https://www.garlandtools.org/db/#quest/68148"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293843"
          }
        },
        {
          "type": "Eureka",
          "typeName": "에우레카",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "돌발임무 \"하얀 지배자\" - 에우레카: 파고스 지대",
          "original": "FATE \"Eternity\" - Eureka Pagos",
          "method": "해당 에우레카 돌발임무 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/223"
        }
      ]
    },
    {
      "id": 226,
      "number": "No. 216",
      "order": 216,
      "deckOrder": 20,
      "ex": false,
      "name": "행운토끼",
      "original": "Happy Bunny",
      "korean": true,
      "stars": 3,
      "patch": "4.36",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 8,
        "bottom": 7,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088226_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/226.png",
      "link": "https://ffxivcollect.com/triad/cards/226",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6862d36a3ef",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293843,
          "name": "보탄",
          "original": "Botan",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293843",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293843,
            "residentId": 1026601,
            "name": "보탄",
            "original": "Botan",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "7.8",
            "y": "14.7",
            "quest": {
              "name": "얼음과 불의 땅 피로스",
              "original": "And We Shall Call It Pyros",
              "link": "https://www.garlandtools.org/db/#quest/68148"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293843"
          }
        },
        {
          "type": "Eureka",
          "typeName": "에우레카",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "에우레카 파고스·피로스·히다토스: 행운토끼 은 보물상자",
          "original": "Eureka Pagos/Pyros/Hydatos: Bunny Silver Coffer",
          "method": "해당 에우레카 돌발임무 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/226"
        }
      ]
    },
    {
      "id": 227,
      "number": "No. 217",
      "order": 217,
      "deckOrder": 20,
      "ex": false,
      "name": "로우히",
      "original": "Louhi",
      "korean": true,
      "stars": 3,
      "patch": "4.36",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 8,
        "bottom": 2,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088227_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/227.png",
      "link": "https://ffxivcollect.com/triad/cards/227",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/eebdc5470de",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293843,
          "name": "보탄",
          "original": "Botan",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293843",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293843,
            "residentId": 1026601,
            "name": "보탄",
            "original": "Botan",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "7.8",
            "y": "14.7",
            "quest": {
              "name": "얼음과 불의 땅 피로스",
              "original": "And We Shall Call It Pyros",
              "link": "https://www.garlandtools.org/db/#quest/68148"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293843"
          }
        },
        {
          "type": "Eureka",
          "typeName": "에우레카",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "돌발임무 \"푸른 얼음 칼날\" - 에우레카: 파고스 지대",
          "original": "FATE \"Louhi on Ice\" - Eureka Pagos",
          "method": "해당 에우레카 돌발임무 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/227"
        }
      ]
    },
    {
      "id": 232,
      "number": "No. 218",
      "order": 218,
      "deckOrder": 8,
      "ex": false,
      "name": "무드수드",
      "original": "Muud Suud",
      "korean": true,
      "stars": 2,
      "patch": "4.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 1,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088232_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/232.png",
      "link": "https://ffxivcollect.com/triad/cards/232",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ae836aec751",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "1,500 맨더빌 골드 소서 포인트",
          "original": "1,500 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/232"
        }
      ]
    },
    {
      "id": 233,
      "number": "No. 219",
      "order": 219,
      "deckOrder": 20,
      "ex": false,
      "name": "진흙장사",
      "original": "Tokkapchi",
      "korean": true,
      "stars": 3,
      "patch": "4.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 6,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088233_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/233.png",
      "link": "https://ffxivcollect.com/triad/cards/233",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6a794441453",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 584,
          "name": "성 모샨 식물원(어려움)",
          "original": "Saint Mocianne's Arboretum (Hard)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/d3302288da4",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 234,
      "number": "No. 220",
      "order": 220,
      "deckOrder": 20,
      "ex": false,
      "name": "안개 드래곤",
      "original": "Mist Dragon",
      "korean": true,
      "stars": 3,
      "patch": "4.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 8,
        "bottom": 5,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088234_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/234.png",
      "link": "https://ffxivcollect.com/triad/cards/234",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c1400f1d26a",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 585,
          "name": "영구 초토지대",
          "original": "The Burn",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/56dcc8b6657",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 235,
      "number": "No. 221",
      "order": 221,
      "deckOrder": 20,
      "ex": false,
      "name": "주작",
      "original": "Suzaku",
      "korean": true,
      "stars": 3,
      "patch": "4.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 7,
        "bottom": 7,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088235_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/235.png",
      "link": "https://ffxivcollect.com/triad/cards/235",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ec039bc0703",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 596,
          "name": "주작 토벌전",
          "original": "Hells' Kier",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/0bb7a09e177",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 597,
          "name": "극 주작 토벌전",
          "original": "Hells' Kier (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/10e75d5ce80",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 238,
      "number": "No. 222",
      "order": 222,
      "deckOrder": 26,
      "ex": false,
      "name": "아사히 사스 브루투스",
      "original": "Asahi sas Brutus",
      "korean": true,
      "stars": 3,
      "patch": "4.4",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 8,
        "right": 4,
        "bottom": 1,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088238_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/238.png",
      "link": "https://ffxivcollect.com/triad/cards/238",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b152a109aee",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293842,
          "name": "하치난",
          "original": "Hachinan",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "얀샤",
          "link": "https://ffxivcollect.com/triad/npcs/2293842",
          "region": "오사드",
          "npc": {
            "id": 2293842,
            "residentId": 1026600,
            "name": "하치난",
            "original": "Hachinan",
            "location": "얀샤",
            "region": "오사드",
            "x": "26.5",
            "y": "12.9",
            "quest": {
              "name": "십육야의 달",
              "original": "The Primary Agreement",
              "link": "https://www.garlandtools.org/db/#quest/68610"
            },
            "ruleIds": [
              11,
              12
            ],
            "rules": [
              "에이스 약화",
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293842"
          }
        }
      ]
    },
    {
      "id": 240,
      "number": "No. 223",
      "order": 223,
      "deckOrder": 47,
      "ex": false,
      "name": "오메가",
      "original": "Omega",
      "korean": true,
      "stars": 5,
      "patch": "4.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 9,
        "bottom": 3,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088240_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/240.png",
      "link": "https://ffxivcollect.com/triad/cards/240",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4032869fdf4",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293847,
          "name": "갈론드 아이언웍스 조사원",
          "original": "Ironworks Hand",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "랄거의 손길",
          "link": "https://ffxivcollect.com/triad/npcs/2293847",
          "region": "기라바니아",
          "npc": {
            "id": 2293847,
            "residentId": 1027210,
            "name": "갈론드 아이언웍스 조사원",
            "original": "Ironworks Hand",
            "location": "랄거의 손길",
            "region": "기라바니아",
            "x": "13.7",
            "y": "11.3",
            "quest": {
              "name": "날개에 꿈을",
              "original": "To Kweh under Distant Skies",
              "link": "https://www.garlandtools.org/db/#quest/68693"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293847"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 590,
          "name": "차원의 틈 오메가: 알파편 4",
          "original": "Alphascape V4.0",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/e3478e88f21",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 594,
          "name": "차원의 틈 오메가: 알파편(영웅) 4",
          "original": "Alphascape V4.0 (Savage)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/0c0630eddf9",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 231,
      "number": "No. 224",
      "order": 224,
      "deckOrder": 1,
      "ex": false,
      "name": "꼭두각시 한냐",
      "original": "Karakuri Hanya",
      "korean": true,
      "stars": 1,
      "patch": "4.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 1,
        "bottom": 1,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088231_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/231.png",
      "link": "https://ffxivcollect.com/triad/cards/231",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/98c8cf787bc",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293841,
          "name": "호쿠신",
          "original": "Hokushin",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293841",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293841,
            "residentId": 1019031,
            "name": "호쿠신",
            "original": "Hokushin",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "14.4",
            "y": "11.2",
            "quest": {
              "name": "쉴 새 없는 무기 괴도",
              "original": "Good Swords, Good Dogs",
              "link": "https://www.garlandtools.org/db/#quest/68687"
            },
            "ruleIds": [
              6,
              14
            ],
            "rules": [
              "합산",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293841"
          }
        }
      ]
    },
    {
      "id": 236,
      "number": "No. 225",
      "order": 225,
      "deckOrder": 20,
      "ex": false,
      "name": "파주주",
      "original": "Pazuzu",
      "korean": true,
      "stars": 3,
      "patch": "4.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 8,
        "bottom": 4,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088236_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/236.png",
      "link": "https://ffxivcollect.com/triad/cards/236",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/2504c9d600c",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293843,
          "name": "보탄",
          "original": "Botan",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293843",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293843,
            "residentId": 1026601,
            "name": "보탄",
            "original": "Botan",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "7.8",
            "y": "14.7",
            "quest": {
              "name": "얼음과 불의 땅 피로스",
              "original": "And We Shall Call It Pyros",
              "link": "https://www.garlandtools.org/db/#quest/68148"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293843"
          }
        },
        {
          "type": "Eureka",
          "typeName": "에우레카",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "돌발임무 \"폭풍의 마왕\" - 에우레카: 아네모스 지대",
          "original": "FATE \"Wail in the Willows\" - Eureka Anemos",
          "method": "해당 에우레카 돌발임무 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/236"
        }
      ]
    },
    {
      "id": 237,
      "number": "No. 226",
      "order": 226,
      "deckOrder": 20,
      "ex": false,
      "name": "펜테실레이아",
      "original": "Penthesilea",
      "korean": true,
      "stars": 3,
      "patch": "4.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 2,
        "bottom": 8,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088237_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/237.png",
      "link": "https://ffxivcollect.com/triad/cards/237",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/fe14bc9defd",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293848,
          "name": "헤츠카제",
          "original": "Hetsukaze",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293848",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293848,
            "residentId": 1027211,
            "name": "헤츠카제",
            "original": "Hetsukaze",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "8.0",
            "y": "13.6",
            "quest": {
              "name": "결전의 땅 히다토스",
              "original": "And We Shall Call It Hydatos",
              "link": "https://www.garlandtools.org/db/#quest/68149"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293848"
          }
        },
        {
          "type": "Eureka",
          "typeName": "에우레카",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "돌발임무 \"불나비 여왕\" - 에우레카: 피로스 지대",
          "original": "FATE \"Lost Epic\" - Eureka Pyros",
          "method": "해당 에우레카 돌발임무 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/237"
        }
      ]
    },
    {
      "id": 239,
      "number": "No. 227",
      "order": 227,
      "deckOrder": 47,
      "ex": false,
      "name": "요우진보 & 다이고로",
      "original": "Yojimbo & Daigoro",
      "korean": true,
      "stars": 5,
      "patch": "4.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 8,
        "bottom": 1,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088239_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/239.png",
      "link": "https://ffxivcollect.com/triad/cards/239",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/7c3043355d3",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293841,
          "name": "호쿠신",
          "original": "Hokushin",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293841",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293841,
            "residentId": 1019031,
            "name": "호쿠신",
            "original": "Hokushin",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "14.4",
            "y": "11.2",
            "quest": {
              "name": "쉴 새 없는 무기 괴도",
              "original": "Good Swords, Good Dogs",
              "link": "https://www.garlandtools.org/db/#quest/68687"
            },
            "ruleIds": [
              6,
              14
            ],
            "rules": [
              "합산",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293841"
          }
        }
      ]
    },
    {
      "id": 241,
      "number": "No. 228",
      "order": 228,
      "deckOrder": 5,
      "ex": false,
      "name": "타타루 타루(홍련)",
      "original": "Stormblood Tataru Taru",
      "korean": true,
      "stars": 1,
      "patch": "4.5",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 1,
        "right": 4,
        "bottom": 1,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088241_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/241.png",
      "link": "https://ffxivcollect.com/triad/cards/241",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/189412e9448",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "96,000 맨더빌 골드 소서 포인트",
          "original": "96,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/241"
        }
      ]
    },
    {
      "id": 244,
      "number": "No. 229",
      "order": 229,
      "deckOrder": 26,
      "ex": false,
      "name": "프로메테우스",
      "original": "Prometheus",
      "korean": true,
      "stars": 3,
      "patch": "4.5",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 6,
        "right": 5,
        "bottom": 8,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088244_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/244.png",
      "link": "https://ffxivcollect.com/triad/cards/244",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/189c8cf46b5",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 611,
          "name": "김리트 황야",
          "original": "The Ghimlyt Dark",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/f75503e962e",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 246,
      "number": "No. 230",
      "order": 230,
      "deckOrder": 20,
      "ex": false,
      "name": "청룡",
      "original": "Seiryu",
      "korean": true,
      "stars": 3,
      "patch": "4.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 7,
        "bottom": 7,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088246_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/246.png",
      "link": "https://ffxivcollect.com/triad/cards/246",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e031588ad09",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 637,
          "name": "청룡 토벌전",
          "original": "The Wreath of Snakes",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/3872aa603e0",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 638,
          "name": "극 청룡 토벌전",
          "original": "The Wreath of Snakes (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/61eae94c75a",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 247,
      "number": "No. 231",
      "order": 231,
      "deckOrder": 21,
      "ex": false,
      "name": "알파",
      "original": "Alpha",
      "korean": true,
      "stars": 3,
      "patch": "4.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 6,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088247_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/247.png",
      "link": "https://ffxivcollect.com/triad/cards/247",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/322f2c277c0",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293847,
          "name": "갈론드 아이언웍스 조사원",
          "original": "Ironworks Hand",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "랄거의 손길",
          "link": "https://ffxivcollect.com/triad/npcs/2293847",
          "region": "기라바니아",
          "npc": {
            "id": 2293847,
            "residentId": 1027210,
            "name": "갈론드 아이언웍스 조사원",
            "original": "Ironworks Hand",
            "location": "랄거의 손길",
            "region": "기라바니아",
            "x": "13.7",
            "y": "11.3",
            "quest": {
              "name": "날개에 꿈을",
              "original": "To Kweh under Distant Skies",
              "link": "https://www.garlandtools.org/db/#quest/68693"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293847"
          }
        }
      ]
    },
    {
      "id": 248,
      "number": "No. 232",
      "order": 232,
      "deckOrder": 34,
      "ex": false,
      "name": "금마즈오 대왕",
      "original": "Great Gold Whisker",
      "korean": true,
      "stars": 4,
      "patch": "4.5",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 6,
        "right": 9,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088248_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/248.png",
      "link": "https://ffxivcollect.com/triad/cards/248",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/92a1d46aced",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293829,
          "name": "교에이",
          "original": "Gyoei",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "얀샤",
          "link": "https://ffxivcollect.com/triad/npcs/2293829",
          "region": "오사드",
          "npc": {
            "id": 2293829,
            "residentId": 1019301,
            "name": "교에이",
            "original": "Gyoei",
            "location": "얀샤",
            "region": "오사드",
            "x": "15.7",
            "y": "31.9",
            "quest": {
              "name": "미소 짓는 녀석",
              "original": "Criminal Phrenology",
              "link": "https://www.garlandtools.org/db/#quest/68281"
            },
            "ruleIds": [
              6,
              10
            ],
            "rules": [
              "합산",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293829"
          }
        }
      ]
    },
    {
      "id": 250,
      "number": "No. 233",
      "order": 233,
      "deckOrder": 41,
      "ex": false,
      "name": "성천사 알테마",
      "original": "Ultima, the High Seraph",
      "korean": true,
      "stars": 5,
      "patch": "4.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 10,
        "bottom": 7,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088250_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/250.png",
      "link": "https://ffxivcollect.com/triad/cards/250",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/1913757bac3",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293859,
          "name": "하나가사",
          "original": "Hanagasa",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293859",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293859,
            "residentId": 1032906,
            "name": "하나가사",
            "original": "Hanagasa",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "10.5",
            "y": "11.9",
            "quest": {
              "name": "오본느 수도원",
              "original": "The City of Lost Angels",
              "link": "https://www.garlandtools.org/db/#quest/68725"
            },
            "ruleIds": [
              6,
              13
            ],
            "rules": [
              "합산",
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293859"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 636,
          "name": "오본느 수도원",
          "original": "The Orbonne Monastery",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/bf7b76fa52a",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 251,
      "number": "No. 234",
      "order": 234,
      "deckOrder": 44,
      "ex": false,
      "name": "알피노 & 알리제(홍련)",
      "original": "Stormblood Alphinaud & Alisaie",
      "korean": true,
      "stars": 5,
      "patch": "4.5",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 6,
        "right": 8,
        "bottom": 8,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088251_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/251.png",
      "link": "https://ffxivcollect.com/triad/cards/251",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/52deb718b65",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293845,
          "name": "메로 록고",
          "original": "Mero Roggo",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "저지 드라바니아",
          "link": "https://ffxivcollect.com/triad/npcs/2293845",
          "region": "드라바니아",
          "npc": {
            "id": 2293845,
            "residentId": 1027209,
            "name": "메로 록고",
            "original": "Mero Roggo",
            "location": "저지 드라바니아",
            "region": "드라바니아",
            "x": "12.8",
            "y": "36.8",
            "quest": {
              "name": "광란의 전주곡",
              "original": "Prelude in Violet",
              "link": "https://www.garlandtools.org/db/#quest/68685"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293845"
          }
        }
      ]
    },
    {
      "id": 242,
      "number": "No. 235",
      "order": 235,
      "deckOrder": 8,
      "ex": false,
      "name": "드베르그",
      "original": "Dvergr",
      "korean": true,
      "stars": 2,
      "patch": "4.55",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 5,
        "bottom": 3,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088242_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/242.png",
      "link": "https://ffxivcollect.com/triad/cards/242",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d4ee2e67d2d",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293848,
          "name": "헤츠카제",
          "original": "Hetsukaze",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293848",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293848,
            "residentId": 1027211,
            "name": "헤츠카제",
            "original": "Hetsukaze",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "8.0",
            "y": "13.6",
            "quest": {
              "name": "결전의 땅 히다토스",
              "original": "And We Shall Call It Hydatos",
              "link": "https://www.garlandtools.org/db/#quest/68149"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293848"
          }
        },
        {
          "type": "Eureka",
          "typeName": "에우레카",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "돌발임무 \"이계의 대장장이 왕\" - 에우레카: 히다토스 지대",
          "original": "FATE \"Duty-free\" - Eureka Hydatos",
          "method": "해당 에우레카 돌발임무 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/242"
        }
      ]
    },
    {
      "id": 243,
      "number": "No. 236",
      "order": 236,
      "deckOrder": 16,
      "ex": false,
      "name": "에지카 츤지카",
      "original": "Ejika Tsunjika",
      "korean": true,
      "stars": 2,
      "patch": "4.55",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 1,
        "bottom": 1,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088243_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/243.png",
      "link": "https://ffxivcollect.com/triad/cards/243",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/371f51c5b38",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293848,
          "name": "헤츠카제",
          "original": "Hetsukaze",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293848",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293848,
            "residentId": 1027211,
            "name": "헤츠카제",
            "original": "Hetsukaze",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "8.0",
            "y": "13.6",
            "quest": {
              "name": "결전의 땅 히다토스",
              "original": "And We Shall Call It Hydatos",
              "link": "https://www.garlandtools.org/db/#quest/68149"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293848"
          }
        }
      ]
    },
    {
      "id": 245,
      "number": "No. 237",
      "order": 237,
      "deckOrder": 20,
      "ex": false,
      "name": "기원 관찰자",
      "original": "Provenance Watcher",
      "korean": true,
      "stars": 3,
      "patch": "4.55",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 4,
        "bottom": 4,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088245_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/245.png",
      "link": "https://ffxivcollect.com/triad/cards/245",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b0d605d91aa",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293848,
          "name": "헤츠카제",
          "original": "Hetsukaze",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293848",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293848,
            "residentId": 1027211,
            "name": "헤츠카제",
            "original": "Hetsukaze",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "8.0",
            "y": "13.6",
            "quest": {
              "name": "결전의 땅 히다토스",
              "original": "And We Shall Call It Hydatos",
              "link": "https://www.garlandtools.org/db/#quest/68149"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293848"
          }
        },
        {
          "type": "Eureka",
          "typeName": "에우레카",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "돌발임무 \"수정룡\" - 에우레카: 히다토스 지대",
          "original": "FATE \"Crystalline Provenance\" - Eureka Hydatos",
          "method": "해당 에우레카 돌발임무 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/245"
        }
      ]
    },
    {
      "id": 249,
      "number": "No. 238",
      "order": 238,
      "deckOrder": 39,
      "ex": false,
      "name": "길가메시(홍련)",
      "original": "Stormblood Gilgamesh",
      "korean": true,
      "stars": 4,
      "patch": "4.56",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 4,
        "bottom": 8,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088249_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/249.png",
      "link": "https://ffxivcollect.com/triad/cards/249",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/3faf263b931",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 595,
          "name": "진 요우진보 토벌전",
          "original": "Kugane Ohashi",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/575a8f6a948",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 253,
      "number": "No. 239",
      "order": 239,
      "deckOrder": 1,
      "ex": false,
      "name": "아마로",
      "original": "Amaro",
      "korean": true,
      "stars": 1,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 7,
        "bottom": 2,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088253_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/253.png",
      "link": "https://ffxivcollect.com/triad/cards/253",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bbb8d1093c6",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293849,
          "name": "글리나드",
          "original": "Glynard",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "크리스타리움",
          "link": "https://ffxivcollect.com/triad/npcs/2293849",
          "region": "노르브란트",
          "npc": {
            "id": 2293849,
            "residentId": 1027322,
            "name": "글리나드",
            "original": "Glynard",
            "location": "크리스타리움",
            "region": "노르브란트",
            "x": "10.8",
            "y": "15.3",
            "quest": {
              "name": "어둠의 전사",
              "original": "Warrior of Darkness",
              "link": "https://www.garlandtools.org/db/#quest/68837"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293849"
          }
        }
      ]
    },
    {
      "id": 254,
      "number": "No. 240",
      "order": 240,
      "deckOrder": 1,
      "ex": false,
      "name": "무기마",
      "original": "Evil Weapon",
      "korean": true,
      "stars": 1,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 2,
        "bottom": 2,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088254_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/254.png",
      "link": "https://ffxivcollect.com/triad/cards/254",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/3c017e6d733",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293852,
          "name": "드레리",
          "original": "Drery",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아므 아랭",
          "link": "https://ffxivcollect.com/triad/npcs/2293852",
          "region": "노르브란트",
          "npc": {
            "id": 2293852,
            "residentId": 1027925,
            "name": "드레리",
            "original": "Drery",
            "location": "아므 아랭",
            "region": "노르브란트",
            "x": "11.9",
            "y": "16.9",
            "quest": {
              "name": " 유언은 암호",
              "original": "Mystery Miners",
              "link": "https://www.garlandtools.org/db/#quest/69046"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293852"
          }
        }
      ]
    },
    {
      "id": 255,
      "number": "No. 241",
      "order": 241,
      "deckOrder": 6,
      "ex": false,
      "name": "차이 부부",
      "original": "Lord and Lady Chai",
      "korean": true,
      "stars": 1,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 1,
        "bottom": 6,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088255_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/255.png",
      "link": "https://ffxivcollect.com/triad/cards/255",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c9ac4aabe23",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293853,
          "name": "이베나트",
          "original": "Ibenart",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "콜루시아 섬",
          "link": "https://ffxivcollect.com/triad/npcs/2293853",
          "region": "노르브란트",
          "npc": {
            "id": 2293853,
            "residentId": 1028318,
            "name": "이베나트",
            "original": "Ibenart",
            "location": "콜루시아 섬",
            "region": "노르브란트",
            "x": "19.1",
            "y": "17.4",
            "quest": {
              "name": "이것이 마지막",
              "original": "That None Shall Ever Again",
              "link": "https://www.garlandtools.org/db/#quest/69177"
            },
            "ruleIds": [
              3,
              11
            ],
            "rules": [
              "3장 공개",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293853"
          }
        }
      ]
    },
    {
      "id": 256,
      "number": "No. 242",
      "order": 242,
      "deckOrder": 8,
      "ex": false,
      "name": "기가텐더",
      "original": "Gigantender",
      "korean": true,
      "stars": 2,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 4,
        "bottom": 4,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088256_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/256.png",
      "link": "https://ffxivcollect.com/triad/cards/256",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/76b3c5d2343",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293852,
          "name": "드레리",
          "original": "Drery",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아므 아랭",
          "link": "https://ffxivcollect.com/triad/npcs/2293852",
          "region": "노르브란트",
          "npc": {
            "id": 2293852,
            "residentId": 1027925,
            "name": "드레리",
            "original": "Drery",
            "location": "아므 아랭",
            "region": "노르브란트",
            "x": "11.9",
            "y": "16.9",
            "quest": {
              "name": " 유언은 암호",
              "original": "Mystery Miners",
              "link": "https://www.garlandtools.org/db/#quest/69046"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293852"
          }
        }
      ]
    },
    {
      "id": 257,
      "number": "No. 243",
      "order": 243,
      "deckOrder": 10,
      "ex": false,
      "name": "페오 울",
      "original": "Feo Ul",
      "korean": true,
      "stars": 2,
      "patch": "5.0",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 7,
        "right": 5,
        "bottom": 5,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088257_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/257.png",
      "link": "https://ffxivcollect.com/triad/cards/257",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8b96866916b",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293850,
          "name": "규프 윈",
          "original": "Gyuf Uin",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "일 메그",
          "link": "https://ffxivcollect.com/triad/npcs/2293850",
          "region": "노르브란트",
          "npc": {
            "id": 2293850,
            "residentId": 1031206,
            "name": "규프 윈",
            "original": "Gyuf Uin",
            "location": "일 메그",
            "region": "노르브란트",
            "x": "16.2",
            "y": "30.7",
            "quest": {
              "name": "즐거운 축하연",
              "original": "Acht-la Ormh Inn",
              "link": "https://www.garlandtools.org/db/#quest/68856"
            },
            "ruleIds": [
              3,
              14
            ],
            "rules": [
              "3장 공개",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293850"
          }
        }
      ]
    },
    {
      "id": 258,
      "number": "No. 244",
      "order": 244,
      "deckOrder": 16,
      "ex": false,
      "name": "루나르",
      "original": "Runar",
      "korean": true,
      "stars": 2,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 4,
        "bottom": 7,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088258_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/258.png",
      "link": "https://ffxivcollect.com/triad/cards/258",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/26cbeb6be3d",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293851,
          "name": "하르그라",
          "original": "Hargra",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "라케티카 대삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293851",
          "region": "노르브란트",
          "npc": {
            "id": 2293851,
            "residentId": 1031303,
            "name": "하르그라",
            "original": "Hargra",
            "location": "라케티카 대삼림",
            "region": "노르브란트",
            "x": "18.6",
            "y": "26.0",
            "quest": {
              "name": " 잊은 물건과 고향을 향한 마음",
              "original": "An Express Delivery",
              "link": "https://www.garlandtools.org/db/#quest/68991"
            },
            "ruleIds": [
              1,
              4
            ],
            "rules": [
              "무작위 규칙",
              "동수"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293851"
          }
        }
      ]
    },
    {
      "id": 259,
      "number": "No. 245",
      "order": 245,
      "deckOrder": 16,
      "ex": false,
      "name": "그레놀트",
      "original": "Grenoldt",
      "korean": true,
      "stars": 2,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 3,
        "bottom": 7,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088259_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/259.png",
      "link": "https://ffxivcollect.com/triad/cards/259",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/5f4bb1fb38e",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293855,
          "name": "사우쉬 콜",
          "original": "Saushs Koal",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "템페스트",
          "link": "https://ffxivcollect.com/triad/npcs/2293855",
          "region": "노르브란트",
          "npc": {
            "id": 2293855,
            "residentId": 1027761,
            "name": "사우쉬 콜",
            "original": "Saushs Koal",
            "location": "템페스트",
            "region": "노르브란트",
            "x": "31.6",
            "y": "17.4",
            "quest": {
              "name": " 매혹적인 바다의 보물",
              "original": "Pearls of the Deep",
              "link": "https://www.garlandtools.org/db/#quest/69113"
            },
            "ruleIds": [
              2
            ],
            "rules": [
              "모두 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293855"
          }
        }
      ]
    },
    {
      "id": 260,
      "number": "No. 246",
      "order": 246,
      "deckOrder": 20,
      "ex": false,
      "name": "필리아",
      "original": "Philia",
      "korean": true,
      "stars": 3,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 6,
        "bottom": 8,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088260_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/260.png",
      "link": "https://ffxivcollect.com/triad/cards/260",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/9f96961c799",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 676,
          "name": "홀민스터",
          "original": "Holminster Switch",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/e72435e2ebc",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "꿈의 트라이어드 팩",
          "original": "Dream Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#7",
          "pack": {
            "id": 7,
            "name": "꿈의 트라이어드 팩",
            "cost": 3240,
            "link": "https://ffxivcollect.com/triad/packs#7"
          }
        }
      ]
    },
    {
      "id": 261,
      "number": "No. 247",
      "order": 247,
      "deckOrder": 20,
      "ex": false,
      "name": "티타니아",
      "original": "Titania",
      "korean": true,
      "stars": 3,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 6,
        "bottom": 6,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088261_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/261.png",
      "link": "https://ffxivcollect.com/triad/cards/261",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/2401e7f0df9",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 657,
          "name": "티타니아 토벌전",
          "original": "The Dancing Plague",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/f7a52f14e83",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 658,
          "name": "극 티타니아 토벌전",
          "original": "The Dancing Plague (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/a0b3834c5d9",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "꿈의 트라이어드 팩",
          "original": "Dream Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#7",
          "pack": {
            "id": 7,
            "name": "꿈의 트라이어드 팩",
            "cost": 3240,
            "link": "https://ffxivcollect.com/triad/packs#7"
          }
        }
      ]
    },
    {
      "id": 262,
      "number": "No. 248",
      "order": 248,
      "deckOrder": 20,
      "ex": false,
      "name": "에로스",
      "original": "Eros",
      "korean": true,
      "stars": 3,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 2,
        "bottom": 6,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088262_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/262.png",
      "link": "https://ffxivcollect.com/triad/cards/262",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/68582b1e10b",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 651,
          "name": "키타나 신굴",
          "original": "The Qitana Ravel",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/9addfadf723",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "꿈의 트라이어드 팩",
          "original": "Dream Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#7",
          "pack": {
            "id": 7,
            "name": "꿈의 트라이어드 팩",
            "cost": 3240,
            "link": "https://ffxivcollect.com/triad/packs#7"
          }
        }
      ]
    },
    {
      "id": 263,
      "number": "No. 249",
      "order": 249,
      "deckOrder": 20,
      "ex": false,
      "name": "스토르게",
      "original": "Storge",
      "korean": true,
      "stars": 3,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 8,
        "bottom": 2,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088263_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/263.png",
      "link": "https://ffxivcollect.com/triad/cards/263",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/3e86e5d5950",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 656,
          "name": "말리카 큰우물",
          "original": "Malikah's Well",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/06d18eda983",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "꿈의 트라이어드 팩",
          "original": "Dream Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#7",
          "pack": {
            "id": 7,
            "name": "꿈의 트라이어드 팩",
            "cost": 3240,
            "link": "https://ffxivcollect.com/triad/packs#7"
          }
        }
      ]
    },
    {
      "id": 264,
      "number": "No. 250",
      "order": 250,
      "deckOrder": 20,
      "ex": false,
      "name": "어마무시",
      "original": "Formidable",
      "korean": true,
      "stars": 3,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 5,
        "bottom": 5,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088264_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/264.png",
      "link": "https://ffxivcollect.com/triad/cards/264",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/3140d1d42ea",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 즈무트 - 톰라 마을 (콜루시아 섬) - 200 두 빛깔 보석 (단계 3)",
          "original": "Zumutt - Tomra (Kholusia) - 200 Bicolor Gemstones (Rank 3)",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/264"
        }
      ]
    },
    {
      "id": 265,
      "number": "No. 251",
      "order": 251,
      "deckOrder": 31,
      "ex": false,
      "name": "라이나",
      "original": "Lyna",
      "korean": true,
      "stars": 3,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 8,
        "bottom": 8,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088265_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/265.png",
      "link": "https://ffxivcollect.com/triad/cards/265",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/7745966af86",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293854,
          "name": "라믈린",
          "original": "Lamlyn",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "레이크랜드",
          "link": "https://ffxivcollect.com/triad/npcs/2293854",
          "region": "노르브란트",
          "npc": {
            "id": 2293854,
            "residentId": 1027344,
            "name": "라믈린",
            "original": "Lamlyn",
            "location": "레이크랜드",
            "region": "노르브란트",
            "x": "35.4",
            "y": "20.3",
            "quest": {
              "name": "무대에서 가장 불쌍한 배우",
              "original": "Reassuring the Masses",
              "link": "https://www.garlandtools.org/db/#quest/69180"
            },
            "ruleIds": [
              9
            ],
            "rules": [
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293854"
          }
        }
      ]
    },
    {
      "id": 266,
      "number": "No. 252",
      "order": 252,
      "deckOrder": 31,
      "ex": false,
      "name": "율모어의 광대",
      "original": "Jongleurs of Eulmore",
      "korean": true,
      "stars": 3,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 4,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088266_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/266.png",
      "link": "https://ffxivcollect.com/triad/cards/266",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0fd0d3ce45f",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293856,
          "name": "그레웬",
          "original": "Grewenn",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "율모어",
          "link": "https://ffxivcollect.com/triad/npcs/2293856",
          "region": "노르브란트",
          "npc": {
            "id": 2293856,
            "residentId": 1031130,
            "name": "그레웬",
            "original": "Grewenn",
            "location": "율모어",
            "region": "노르브란트",
            "x": "12.6",
            "y": "10.0",
            "quest": {
              "name": "칠흑의 반역자",
              "original": "Shadowbringers",
              "link": "https://www.garlandtools.org/db/#quest/69190"
            },
            "ruleIds": [
              6,
              14
            ],
            "rules": [
              "합산",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293856"
          }
        }
      ]
    },
    {
      "id": 267,
      "number": "No. 253",
      "order": 253,
      "deckOrder": 32,
      "ex": false,
      "name": "이노센스",
      "original": "Innocence",
      "korean": true,
      "stars": 4,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 3,
        "bottom": 8,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088267_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/267.png",
      "link": "https://ffxivcollect.com/triad/cards/267",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/5d0f3634846",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 666,
          "name": "이노센스 토벌전",
          "original": "The Crown of the Immaculate",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/6858b374c73",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 667,
          "name": "극 이노센스 토벌전",
          "original": "The Crown of the Immaculate (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/9f55d76c659",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "꿈의 트라이어드 팩",
          "original": "Dream Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#7",
          "pack": {
            "id": 7,
            "name": "꿈의 트라이어드 팩",
            "cost": 3240,
            "link": "https://ffxivcollect.com/triad/packs#7"
          }
        }
      ]
    },
    {
      "id": 268,
      "number": "No. 254",
      "order": 254,
      "deckOrder": 37,
      "ex": false,
      "name": "야슈톨라(칠흑)",
      "original": "Shadowbringers Y'shtola",
      "korean": true,
      "stars": 4,
      "patch": "5.0",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 2,
        "right": 9,
        "bottom": 5,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088268_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/268.png",
      "link": "https://ffxivcollect.com/triad/cards/268",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6bc29ce5361",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293851,
          "name": "하르그라",
          "original": "Hargra",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "라케티카 대삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293851",
          "region": "노르브란트",
          "npc": {
            "id": 2293851,
            "residentId": 1031303,
            "name": "하르그라",
            "original": "Hargra",
            "location": "라케티카 대삼림",
            "region": "노르브란트",
            "x": "18.6",
            "y": "26.0",
            "quest": {
              "name": " 잊은 물건과 고향을 향한 마음",
              "original": "An Express Delivery",
              "link": "https://www.garlandtools.org/db/#quest/68991"
            },
            "ruleIds": [
              1,
              4
            ],
            "rules": [
              "무작위 규칙",
              "동수"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293851"
          }
        }
      ]
    },
    {
      "id": 269,
      "number": "No. 255",
      "order": 255,
      "deckOrder": 37,
      "ex": false,
      "name": "위리앙제(칠흑)",
      "original": "Shadowbringers Urianger",
      "korean": true,
      "stars": 4,
      "patch": "5.0",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 9,
        "right": 2,
        "bottom": 5,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088269_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/269.png",
      "link": "https://ffxivcollect.com/triad/cards/269",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/3a3edd50975",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 2368,
          "name": "카드 수집가: 9단계",
          "original": "Triple-decker IX",
          "method": "트리플 트라이어드 카드 270종류 입수",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%20%EC%88%98%EC%A7%91%EA%B0%80%3A%209%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 270,
      "number": "No. 256",
      "order": 256,
      "deckOrder": 39,
      "ex": false,
      "name": "란지트",
      "original": "Ran'jit",
      "korean": true,
      "stars": 4,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 9,
        "bottom": 9,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088270_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/270.png",
      "link": "https://ffxivcollect.com/triad/cards/270",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ff46e62c184",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293856,
          "name": "그레웬",
          "original": "Grewenn",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "율모어",
          "link": "https://ffxivcollect.com/triad/npcs/2293856",
          "region": "노르브란트",
          "npc": {
            "id": 2293856,
            "residentId": 1031130,
            "name": "그레웬",
            "original": "Grewenn",
            "location": "율모어",
            "region": "노르브란트",
            "x": "12.6",
            "y": "10.0",
            "quest": {
              "name": "칠흑의 반역자",
              "original": "Shadowbringers",
              "link": "https://www.garlandtools.org/db/#quest/69190"
            },
            "ruleIds": [
              6,
              14
            ],
            "rules": [
              "합산",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293856"
          }
        }
      ]
    },
    {
      "id": 271,
      "number": "No. 257",
      "order": 257,
      "deckOrder": 47,
      "ex": false,
      "name": "하데스",
      "original": "Hades",
      "korean": true,
      "stars": 5,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 6,
        "bottom": 6,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088271_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/271.png",
      "link": "https://ffxivcollect.com/triad/cards/271",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8b825c96b5f",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 687,
          "name": "하데스 토벌전",
          "original": "The Dying Gasp",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/321fd159682",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 693,
          "name": "극 하데스 토벌전",
          "original": "The Minstrel's Ballad: Hades's Elegy",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/ad5521cac0d",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 272,
      "number": "No. 258",
      "order": 258,
      "deckOrder": 47,
      "ex": false,
      "name": "아르버트",
      "original": "Ardbert",
      "korean": true,
      "stars": 5,
      "patch": "5.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 9,
        "bottom": 9,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088272_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/272.png",
      "link": "https://ffxivcollect.com/triad/cards/272",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d5816f464dc",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 2369,
          "name": "길거리 듀얼리스트: 7단계",
          "original": "Triple Team VII",
          "method": "트리플 트라이어드로 NPC 92명에게 승리",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EA%B8%B8%EA%B1%B0%EB%A6%AC%20%EB%93%80%EC%96%BC%EB%A6%AC%EC%8A%A4%ED%8A%B8%3A%207%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 273,
      "number": "No. 259",
      "order": 259,
      "deckOrder": 1,
      "ex": false,
      "name": "홉고블린",
      "original": "Hobgoblin",
      "korean": true,
      "stars": 1,
      "patch": "5.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 7,
        "bottom": 2,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088273_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/273.png",
      "link": "https://ffxivcollect.com/triad/cards/273",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/07619313a12",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "꿈의 트라이어드 팩",
          "original": "Dream Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#7",
          "pack": {
            "id": 7,
            "name": "꿈의 트라이어드 팩",
            "cost": 3240,
            "link": "https://ffxivcollect.com/triad/packs#7"
          }
        }
      ]
    },
    {
      "id": 274,
      "number": "No. 260",
      "order": 260,
      "deckOrder": 1,
      "ex": false,
      "name": "포크시",
      "original": "Porxie",
      "korean": true,
      "stars": 1,
      "patch": "5.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 2,
        "bottom": 6,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088274_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/274.png",
      "link": "https://ffxivcollect.com/triad/cards/274",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b708524a12f",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293857,
          "name": "에오 시군",
          "original": "Eo Sigun",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "일 메그",
          "link": "https://ffxivcollect.com/triad/npcs/2293857",
          "region": "노르브란트",
          "npc": {
            "id": 2293857,
            "residentId": 1028783,
            "name": "에오 시군",
            "original": "Eo Sigun",
            "location": "일 메그",
            "region": "노르브란트",
            "x": "22.2",
            "y": "3.7",
            "quest": {
              "name": " 꿈과 현실 사이에서",
              "original": "Manic Pixie Dream Realm",
              "link": "https://www.garlandtools.org/db/#quest/69219"
            },
            "ruleIds": [
              6
            ],
            "rules": [
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293857"
          }
        }
      ]
    },
    {
      "id": 275,
      "number": "No. 261",
      "order": 261,
      "deckOrder": 8,
      "ex": false,
      "name": "이구아나",
      "original": "Iguana",
      "korean": true,
      "stars": 2,
      "patch": "5.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 5,
        "bottom": 6,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088275_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/275.png",
      "link": "https://ffxivcollect.com/triad/cards/275",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/25d08b97053",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "꿈의 트라이어드 팩",
          "original": "Dream Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#7",
          "pack": {
            "id": 7,
            "name": "꿈의 트라이어드 팩",
            "cost": 3240,
            "link": "https://ffxivcollect.com/triad/packs#7"
          }
        }
      ]
    },
    {
      "id": 276,
      "number": "No. 262",
      "order": 262,
      "deckOrder": 10,
      "ex": false,
      "name": "응 모우",
      "original": "Nu Mou",
      "korean": true,
      "stars": 2,
      "patch": "5.1",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 7,
        "right": 6,
        "bottom": 2,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088276_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/276.png",
      "link": "https://ffxivcollect.com/triad/cards/276",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/40f022485a6",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293857,
          "name": "에오 시군",
          "original": "Eo Sigun",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "일 메그",
          "link": "https://ffxivcollect.com/triad/npcs/2293857",
          "region": "노르브란트",
          "npc": {
            "id": 2293857,
            "residentId": 1028783,
            "name": "에오 시군",
            "original": "Eo Sigun",
            "location": "일 메그",
            "region": "노르브란트",
            "x": "22.2",
            "y": "3.7",
            "quest": {
              "name": " 꿈과 현실 사이에서",
              "original": "Manic Pixie Dream Realm",
              "link": "https://www.garlandtools.org/db/#quest/69219"
            },
            "ruleIds": [
              6
            ],
            "rules": [
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293857"
          }
        }
      ]
    },
    {
      "id": 277,
      "number": "No. 263",
      "order": 263,
      "deckOrder": 10,
      "ex": false,
      "name": "푸아",
      "original": "Fuath",
      "korean": true,
      "stars": 2,
      "patch": "5.1",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 7,
        "right": 4,
        "bottom": 6,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088277_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/277.png",
      "link": "https://ffxivcollect.com/triad/cards/277",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/fd618a96654",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "꿈의 트라이어드 팩",
          "original": "Dream Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#7",
          "pack": {
            "id": 7,
            "name": "꿈의 트라이어드 팩",
            "cost": 3240,
            "link": "https://ffxivcollect.com/triad/packs#7"
          }
        }
      ]
    },
    {
      "id": 278,
      "number": "No. 264",
      "order": 264,
      "deckOrder": 20,
      "ex": false,
      "name": "랴난시",
      "original": "Leannan Sith",
      "korean": true,
      "stars": 3,
      "patch": "5.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 7,
        "bottom": 2,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088278_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/278.png",
      "link": "https://ffxivcollect.com/triad/cards/278",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c5115e405c7",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "꿈의 트라이어드 팩",
          "original": "Dream Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#7",
          "pack": {
            "id": 7,
            "name": "꿈의 트라이어드 팩",
            "cost": 3240,
            "link": "https://ffxivcollect.com/triad/packs#7"
          }
        }
      ]
    },
    {
      "id": 279,
      "number": "No. 265",
      "order": 265,
      "deckOrder": 20,
      "ex": false,
      "name": "검은 도사",
      "original": "Seeker of Solitude",
      "korean": true,
      "stars": 3,
      "patch": "5.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 6,
        "bottom": 6,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088279_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/279.png",
      "link": "https://ffxivcollect.com/triad/cards/279",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6817831f18d",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 692,
          "name": "그랑 코스모스",
          "original": "The Grand Cosmos",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/2714339e457",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 280,
      "number": "No. 266",
      "order": 266,
      "deckOrder": 39,
      "ex": false,
      "name": "빛의 무녀",
      "original": "Oracle of Light",
      "korean": true,
      "stars": 4,
      "patch": "5.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 7,
        "bottom": 9,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088280_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/280.png",
      "link": "https://ffxivcollect.com/triad/cards/280",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/5c079c77e79",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "꿈의 트라이어드 팩",
          "original": "Dream Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#7",
          "pack": {
            "id": 7,
            "name": "꿈의 트라이어드 팩",
            "cost": 3240,
            "link": "https://ffxivcollect.com/triad/packs#7"
          }
        }
      ]
    },
    {
      "id": 281,
      "number": "No. 267",
      "order": 267,
      "deckOrder": 40,
      "ex": false,
      "name": "아르케오타니아",
      "original": "Archaeotania",
      "korean": true,
      "stars": 5,
      "patch": "5.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 9,
        "bottom": 7,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088281_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/281.png",
      "link": "https://ffxivcollect.com/triad/cards/281",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b872cb3c540",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "꿈의 트라이어드 팩",
          "original": "Dream Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#7",
          "pack": {
            "id": 7,
            "name": "꿈의 트라이어드 팩",
            "cost": 3240,
            "link": "https://ffxivcollect.com/triad/packs#7"
          }
        }
      ]
    },
    {
      "id": 282,
      "number": "No. 268",
      "order": 268,
      "deckOrder": 41,
      "ex": false,
      "name": "9S",
      "original": "9S",
      "korean": true,
      "stars": 5,
      "patch": "5.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 8,
        "bottom": 6,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088282_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/282.png",
      "link": "https://ffxivcollect.com/triad/cards/282",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0abc0961b2c",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 700,
          "name": "복제된 공장 폐허",
          "original": "The Copied Factory",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/9145014afa2",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 283,
      "number": "No. 269",
      "order": 269,
      "deckOrder": 1,
      "ex": false,
      "name": "꽃바구니",
      "original": "Flower Basket",
      "korean": true,
      "stars": 1,
      "patch": "5.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 2,
        "bottom": 2,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088283_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/283.png",
      "link": "https://ffxivcollect.com/triad/cards/283",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a57f266419e",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 슬 라드 - 리다 란 (일 메그) - 40 두 빛깔 보석",
          "original": "Sul Lad - Lydha Lran (Il Mheg) - 40 Bicolor Gemstones",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/283"
        }
      ]
    },
    {
      "id": 284,
      "number": "No. 270",
      "order": 270,
      "deckOrder": 3,
      "ex": false,
      "name": "키타리",
      "original": "Qitari",
      "korean": true,
      "stars": 1,
      "patch": "5.2",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 4,
        "right": 6,
        "bottom": 2,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088284_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/284.png",
      "link": "https://ffxivcollect.com/triad/cards/284",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b9c72a4b25c",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293858,
          "name": "레다드",
          "original": "Redard",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "라케티카 대삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293858",
          "region": "노르브란트",
          "npc": {
            "id": 2293858,
            "residentId": 1027744,
            "name": "레다드",
            "original": "Redard",
            "location": "라케티카 대삼림",
            "region": "노르브란트",
            "x": "20.4",
            "y": "27.2",
            "quest": {
              "name": "정사를 잇는 자들이 나타나리",
              "original": "The Stewards of Note",
              "link": "https://www.garlandtools.org/db/#quest/69330"
            },
            "ruleIds": [
              4,
              10
            ],
            "rules": [
              "동수",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293858"
          }
        }
      ]
    },
    {
      "id": 285,
      "number": "No. 271",
      "order": 271,
      "deckOrder": 8,
      "ex": false,
      "name": "놀",
      "original": "Gnoll",
      "korean": true,
      "stars": 2,
      "patch": "5.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 4,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088285_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/285.png",
      "link": "https://ffxivcollect.com/triad/cards/285",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/11cf9d23817",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 슈르메 - 좁 요새 (레이크랜드) - 60 두 빛깔 보석",
          "original": "Siulmet - Fort Jobb (Lakeland) - 60 Bicolor Gemstones",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/285"
        }
      ]
    },
    {
      "id": 287,
      "number": "No. 272",
      "order": 272,
      "deckOrder": 20,
      "ex": false,
      "name": "배츠콰치",
      "original": "Batsquatch",
      "korean": true,
      "stars": 3,
      "patch": "5.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 2,
        "bottom": 8,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088287_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/287.png",
      "link": "https://ffxivcollect.com/triad/cards/287",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8558bb407a4",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293858,
          "name": "레다드",
          "original": "Redard",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "라케티카 대삼림",
          "link": "https://ffxivcollect.com/triad/npcs/2293858",
          "region": "노르브란트",
          "npc": {
            "id": 2293858,
            "residentId": 1027744,
            "name": "레다드",
            "original": "Redard",
            "location": "라케티카 대삼림",
            "region": "노르브란트",
            "x": "20.4",
            "y": "27.2",
            "quest": {
              "name": "정사를 잇는 자들이 나타나리",
              "original": "The Stewards of Note",
              "link": "https://www.garlandtools.org/db/#quest/69330"
            },
            "ruleIds": [
              4,
              10
            ],
            "rules": [
              "동수",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293858"
          }
        }
      ]
    },
    {
      "id": 288,
      "number": "No. 273",
      "order": 273,
      "deckOrder": 20,
      "ex": false,
      "name": "면죄된 외설",
      "original": "Forgiven Obscenity",
      "korean": true,
      "stars": 3,
      "patch": "5.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 7,
        "bottom": 1,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088288_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/288.png",
      "link": "https://ffxivcollect.com/triad/cards/288",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/901e98bb6b2",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 즈무트 - 톰라 마을 (콜루시아 섬) - 100 두 빛깔 보석",
          "original": "Zumutt - Tomra (Kholusia) - 100 Bicolor Gemstones",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/288"
        }
      ]
    },
    {
      "id": 289,
      "number": "No. 274",
      "order": 274,
      "deckOrder": 20,
      "ex": false,
      "name": "후아카",
      "original": "Huaca",
      "korean": true,
      "stars": 3,
      "patch": "5.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 5,
        "bottom": 8,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088289_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/289.png",
      "link": "https://ffxivcollect.com/triad/cards/289",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f3fd31c6d87",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 나실 - 파노브 마을 (라케티카 대삼림) - 100 두 빛깔 보석",
          "original": "Nacille - Fanow (The Rak'tika Greatwood) - 100 Bicolor Gemstones",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/289"
        }
      ]
    },
    {
      "id": 290,
      "number": "No. 275",
      "order": 275,
      "deckOrder": 20,
      "ex": false,
      "name": "정체불명",
      "original": "Unknown",
      "korean": true,
      "stars": 3,
      "patch": "5.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 6,
        "bottom": 3,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088290_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/290.png",
      "link": "https://ffxivcollect.com/triad/cards/290",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/95114f18e07",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 714,
          "name": "애니드라스 아남네시스",
          "original": "Anamnesis Anyder",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/d656dfeebd0",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 291,
      "number": "No. 276",
      "order": 276,
      "deckOrder": 36,
      "ex": false,
      "name": "루비 웨폰",
      "original": "Ruby Weapon",
      "korean": true,
      "stars": 4,
      "patch": "5.2",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 8,
        "right": 7,
        "bottom": 1,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088291_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/291.png",
      "link": "https://ffxivcollect.com/triad/cards/291",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/223e2591c89",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 717,
          "name": "루비 웨폰 파괴작전",
          "original": "Cinder Drift",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/d58875864be",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 718,
          "name": "극 루비 웨폰 파괴작전",
          "original": "Cinder Drift (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/8a3e1760919",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 292,
      "number": "No. 277",
      "order": 277,
      "deckOrder": 40,
      "ex": false,
      "name": "메가테리온",
      "original": "Therion",
      "korean": true,
      "stars": 5,
      "patch": "5.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 9,
        "bottom": 2,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088292_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/292.png",
      "link": "https://ffxivcollect.com/triad/cards/292",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d3791f6566f",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 고우쉬 온 - 온도 바다웅덩이 (템페스트) - 250 두 빛깔 보석",
          "original": "Goushs Ooan - The Ondo Cups (The Tempest) - 250 Bicolor Gemstones",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/292"
        }
      ]
    },
    {
      "id": 286,
      "number": "No. 278",
      "order": 278,
      "deckOrder": 16,
      "ex": false,
      "name": "리즈베스",
      "original": "Lizbeth",
      "korean": true,
      "stars": 2,
      "patch": "5.21",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 5,
        "bottom": 6,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088286_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/286.png",
      "link": "https://ffxivcollect.com/triad/cards/286",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/31fb82f1e82",
      "officialExact": true,
      "sources": [
        {
          "type": "Skybuilders",
          "typeName": "이슈가르드 부흥",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "에니 - 창천 거리 - 500 창천 거리 진흥권",
          "original": "Enie - The Firmament - 500 Skybuilders' Scrips",
          "method": "창천 거리에서 부흥용 화폐로 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/286"
        }
      ]
    },
    {
      "id": 293,
      "number": "No. 279",
      "order": 279,
      "deckOrder": 43,
      "ex": false,
      "name": "바리스 예 갈부스",
      "original": "Varis yae Galvus",
      "korean": true,
      "stars": 5,
      "patch": "5.25",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 10,
        "right": 10,
        "bottom": 4,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088293_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/293.png",
      "link": "https://ffxivcollect.com/triad/cards/293",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/cb68869cccb",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 725,
          "name": "극 보즈야 추억전",
          "original": "Memoria Misera (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/fba9d509110",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 294,
      "number": "No. 280",
      "order": 280,
      "deckOrder": 3,
      "ex": false,
      "name": "드워프",
      "original": "Dwarf",
      "korean": true,
      "stars": 1,
      "patch": "5.3",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 2,
        "right": 4,
        "bottom": 6,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088294_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/294.png",
      "link": "https://ffxivcollect.com/triad/cards/294",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a406838a7f2",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293860,
          "name": "코블레바",
          "original": "Cobleva",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "레이크랜드",
          "link": "https://ffxivcollect.com/triad/npcs/2293860",
          "region": "노르브란트",
          "npc": {
            "id": 2293860,
            "residentId": 1034888,
            "name": "코블레바",
            "original": "Cobleva",
            "location": "레이크랜드",
            "region": "노르브란트",
            "x": "14.3",
            "y": "7.8",
            "quest": {
              "name": "노르브란트의 평화를 지켜라!",
              "original": "Tanks for the Memory",
              "link": "https://www.garlandtools.org/db/#quest/69437"
            },
            "ruleIds": [
              6,
              10
            ],
            "rules": [
              "합산",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293860"
          }
        }
      ]
    },
    {
      "id": 296,
      "number": "No. 281",
      "order": 281,
      "deckOrder": 8,
      "ex": false,
      "name": "드워프 전차",
      "original": "Rolling Tankard",
      "korean": true,
      "stars": 2,
      "patch": "5.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 4,
        "bottom": 2,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088296_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/296.png",
      "link": "https://ffxivcollect.com/triad/cards/296",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c469ee03e47",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293860,
          "name": "코블레바",
          "original": "Cobleva",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "레이크랜드",
          "link": "https://ffxivcollect.com/triad/npcs/2293860",
          "region": "노르브란트",
          "npc": {
            "id": 2293860,
            "residentId": 1034888,
            "name": "코블레바",
            "original": "Cobleva",
            "location": "레이크랜드",
            "region": "노르브란트",
            "x": "14.3",
            "y": "7.8",
            "quest": {
              "name": "노르브란트의 평화를 지켜라!",
              "original": "Tanks for the Memory",
              "link": "https://www.garlandtools.org/db/#quest/69437"
            },
            "ruleIds": [
              6,
              10
            ],
            "rules": [
              "합산",
              "역전"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293860"
          }
        }
      ]
    },
    {
      "id": 297,
      "number": "No. 282",
      "order": 282,
      "deckOrder": 20,
      "ex": false,
      "name": "루구스",
      "original": "Lugus",
      "korean": true,
      "stars": 3,
      "patch": "5.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 4,
        "bottom": 7,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088297_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/297.png",
      "link": "https://ffxivcollect.com/triad/cards/297",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0eb33c8d99f",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "21,000 맨더빌 골드 소서 포인트",
          "original": "21,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/297"
        }
      ]
    },
    {
      "id": 300,
      "number": "No. 283",
      "order": 283,
      "deckOrder": 39,
      "ex": false,
      "name": "아씨엔 엘리디부스",
      "original": "Elidibus",
      "korean": true,
      "stars": 4,
      "patch": "5.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 4,
        "bottom": 9,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088300_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/300.png",
      "link": "https://ffxivcollect.com/triad/cards/300",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/11ef54321d4",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "56,000 맨더빌 골드 소서 포인트",
          "original": "56,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/300"
        }
      ]
    },
    {
      "id": 301,
      "number": "No. 284",
      "order": 284,
      "deckOrder": 37,
      "ex": false,
      "name": "산크레드(칠흑)",
      "original": "Shadowbringers Thancred",
      "korean": true,
      "stars": 4,
      "patch": "5.3",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 7,
        "right": 9,
        "bottom": 8,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088301_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/301.png",
      "link": "https://ffxivcollect.com/triad/cards/301",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/539308d0d60",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 2643,
          "name": "카드 수집가: 10단계",
          "original": "Triple-decker X",
          "method": "트리플 트라이어드 카드 300종류 입수",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%20%EC%88%98%EC%A7%91%EA%B0%80%3A%2010%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 302,
      "number": "No. 285",
      "order": 285,
      "deckOrder": 36,
      "ex": false,
      "name": "사파이어 웨폰",
      "original": "Sapphire Weapon",
      "korean": true,
      "stars": 4,
      "patch": "5.3",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 1,
        "right": 9,
        "bottom": 8,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088302_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/302.png",
      "link": "https://ffxivcollect.com/triad/cards/302",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/483683f033b",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293861,
          "name": "주눅들지 않는 제국병",
          "original": "Furtive Former Imperial",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "턴클리프",
          "link": "https://ffxivcollect.com/triad/npcs/2293861",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293861,
            "residentId": 1033652,
            "name": "주눅들지 않는 제국병",
            "original": "Furtive Former Imperial",
            "location": "턴클리프",
            "region": "길드마스터처럼 보이는 남자",
            "x": "5.0",
            "y": "6.3",
            "quest": {
              "name": "날아라! 웰리트를 향하여",
              "original": "Sleep Now in Sapphire",
              "link": "https://www.garlandtools.org/db/#quest/69431"
            },
            "ruleIds": [
              11,
              14
            ],
            "rules": [
              "에이스 약화",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293861"
          }
        }
      ]
    },
    {
      "id": 303,
      "number": "No. 286",
      "order": 286,
      "deckOrder": 41,
      "ex": false,
      "name": "2P",
      "original": "2P",
      "korean": true,
      "stars": 5,
      "patch": "5.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 8,
        "bottom": 10,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088303_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/303.png",
      "link": "https://ffxivcollect.com/triad/cards/303",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f9b840c0036",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 736,
          "name": "인형들의 군사 기지",
          "original": "The Puppets' Bunker",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/e4fa57a2f0d",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 304,
      "number": "No. 287",
      "order": 287,
      "deckOrder": 42,
      "ex": false,
      "name": "빛의 전사(칠흑)",
      "original": "Shadowbringers Warrior of Light",
      "korean": true,
      "stars": 5,
      "patch": "5.3",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 2,
        "right": 10,
        "bottom": 10,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088304_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/304.png",
      "link": "https://ffxivcollect.com/triad/cards/304",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/171197947ce",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 738,
          "name": "빛의 전사 토벌전",
          "original": "The Seat of Sacrifice",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/e62003f42c2",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 739,
          "name": "극 빛의 전사 토벌전",
          "original": "The Seat of Sacrifice (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/d93b9ae2a34",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 295,
      "number": "No. 288",
      "order": 288,
      "deckOrder": 16,
      "ex": false,
      "name": "엘 투",
      "original": "Ehll Tou",
      "korean": true,
      "stars": 2,
      "patch": "5.31",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 7,
        "bottom": 1,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088295_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/295.png",
      "link": "https://ffxivcollect.com/triad/cards/295",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4840220e5ff",
      "officialExact": true,
      "sources": [
        {
          "type": "Skybuilders",
          "typeName": "이슈가르드 부흥",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "에니 - 창천 거리 - 500 창천 거리 진흥권",
          "original": "Enie - The Firmament - 500 Skybuilders' Scrips",
          "method": "창천 거리에서 부흥용 화폐로 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/295"
        }
      ]
    },
    {
      "id": 298,
      "number": "No. 289",
      "order": 289,
      "deckOrder": 26,
      "ex": false,
      "name": "다우언",
      "original": "Dawon",
      "korean": true,
      "stars": 3,
      "patch": "5.35",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 8,
        "right": 4,
        "bottom": 6,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088298_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/298.png",
      "link": "https://ffxivcollect.com/triad/cards/298",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/5cda93307da",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293862,
          "name": "아르시우",
          "original": "Arsieu",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "강고스",
          "link": "https://ffxivcollect.com/triad/npcs/2293862",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293862,
            "residentId": 1034206,
            "name": "아르시우",
            "original": "Arsieu",
            "location": "강고스",
            "region": "길드마스터처럼 보이는 남자",
            "x": "5.9",
            "y": "6.6",
            "quest": {
              "name": "성검 세이브 더 퀸",
              "original": "The Lady of Blades",
              "link": "https://www.garlandtools.org/db/#quest/69487"
            },
            "ruleIds": [
              6,
              12
            ],
            "rules": [
              "합산",
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293862"
          }
        }
      ]
    },
    {
      "id": 299,
      "number": "No. 290",
      "order": 290,
      "deckOrder": 20,
      "ex": false,
      "name": "아드람멜렉",
      "original": "Adrammelech",
      "korean": true,
      "stars": 3,
      "patch": "5.35",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 1,
        "bottom": 7,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088299_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/299.png",
      "link": "https://ffxivcollect.com/triad/cards/299",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/60342683045",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293862,
          "name": "아르시우",
          "original": "Arsieu",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "강고스",
          "link": "https://ffxivcollect.com/triad/npcs/2293862",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293862,
            "residentId": 1034206,
            "name": "아르시우",
            "original": "Arsieu",
            "location": "강고스",
            "region": "길드마스터처럼 보이는 남자",
            "x": "5.9",
            "y": "6.6",
            "quest": {
              "name": "성검 세이브 더 퀸",
              "original": "The Lady of Blades",
              "link": "https://www.garlandtools.org/db/#quest/69487"
            },
            "ruleIds": [
              6,
              12
            ],
            "rules": [
              "합산",
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293862"
          }
        }
      ]
    },
    {
      "id": 306,
      "number": "No. 291",
      "order": 291,
      "deckOrder": 8,
      "ex": false,
      "name": "마더 포크시",
      "original": "Mother Porxie",
      "korean": true,
      "stars": 2,
      "patch": "5.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 3,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088306_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/306.png",
      "link": "https://ffxivcollect.com/triad/cards/306",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/60bb9dcc46f",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 746,
          "name": "마토야의 공방",
          "original": "Matoya's Relict",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/75a6ed4a2f9",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 312,
      "number": "No. 292",
      "order": 292,
      "deckOrder": 36,
      "ex": false,
      "name": "에메랄드 웨폰",
      "original": "Emerald Weapon",
      "korean": true,
      "stars": 4,
      "patch": "5.4",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 7,
        "right": 1,
        "bottom": 9,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088312_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/312.png",
      "link": "https://ffxivcollect.com/triad/cards/312",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e63c375a193",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 762,
          "name": "에메랄드 웨폰 파괴작전",
          "original": "Castrum Marinum",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/4c3975dacb6",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 763,
          "name": "극 에메랄드 웨폰 파괴작전",
          "original": "Castrum Marinum (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/950545da440",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 313,
      "number": "No. 293",
      "order": 293,
      "deckOrder": 39,
      "ex": false,
      "name": "린",
      "original": "Ryne",
      "korean": true,
      "stars": 4,
      "patch": "5.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 9,
        "bottom": 7,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088313_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/313.png",
      "link": "https://ffxivcollect.com/triad/cards/313",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c3236dbc4cf",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293872,
          "name": "류토 수",
          "original": "Lewto-Sue",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아므 아랭",
          "link": "https://ffxivcollect.com/triad/npcs/2293872",
          "region": "노르브란트",
          "npc": {
            "id": 2293872,
            "residentId": 1035180,
            "name": "류토 수",
            "original": "Lewto-Sue",
            "location": "아므 아랭",
            "region": "노르브란트",
            "x": "26.8",
            "y": "16.3",
            "quest": {
              "name": "언젠가 다시 태어날 생명들의 이야기",
              "original": "Where I Belong",
              "link": "https://www.garlandtools.org/db/#quest/69515"
            },
            "ruleIds": [
              6,
              11
            ],
            "rules": [
              "합산",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293872"
          }
        }
      ]
    },
    {
      "id": 314,
      "number": "No. 294",
      "order": 294,
      "deckOrder": 39,
      "ex": false,
      "name": "가이아",
      "original": "Gaia",
      "korean": true,
      "stars": 4,
      "patch": "5.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 9,
        "bottom": 1,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088314_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/314.png",
      "link": "https://ffxivcollect.com/triad/cards/314",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/daa7323e601",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293872,
          "name": "류토 수",
          "original": "Lewto-Sue",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "아므 아랭",
          "link": "https://ffxivcollect.com/triad/npcs/2293872",
          "region": "노르브란트",
          "npc": {
            "id": 2293872,
            "residentId": 1035180,
            "name": "류토 수",
            "original": "Lewto-Sue",
            "location": "아므 아랭",
            "region": "노르브란트",
            "x": "26.8",
            "y": "16.3",
            "quest": {
              "name": "언젠가 다시 태어날 생명들의 이야기",
              "original": "Where I Belong",
              "link": "https://www.garlandtools.org/db/#quest/69515"
            },
            "ruleIds": [
              6,
              11
            ],
            "rules": [
              "합산",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293872"
          }
        }
      ]
    },
    {
      "id": 315,
      "number": "No. 295",
      "order": 295,
      "deckOrder": 40,
      "ex": false,
      "name": "에덴의 약속",
      "original": "Eden's Promise",
      "korean": true,
      "stars": 5,
      "patch": "5.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 5,
        "bottom": 8,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088315_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/315.png",
      "link": "https://ffxivcollect.com/triad/cards/315",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6ad3d327067",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 758,
          "name": "희망의 낙원 에덴: 재생편 4",
          "original": "Eden's Promise: Eternity",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/0a5f0cdd470",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 759,
          "name": "희망의 낙원 에덴: 재생편(영웅) 4",
          "original": "Eden's Promise: Eternity (Savage)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/b49091cec54",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 316,
      "number": "No. 296",
      "order": 296,
      "deckOrder": 42,
      "ex": false,
      "name": "피닉스",
      "original": "Phoenix",
      "korean": true,
      "stars": 5,
      "patch": "5.4",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 5,
        "right": 9,
        "bottom": 6,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088316_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/316.png",
      "link": "https://ffxivcollect.com/triad/cards/316",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bbef6582298",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 2799,
          "name": "토너먼트 승자: 1단계",
          "original": "Open and Shut I",
          "method": "공식 토너먼트 1회 우승",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%ED%86%A0%EB%84%88%EB%A8%BC%ED%8A%B8%20%EC%8A%B9%EC%9E%90%3A%201%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 305,
      "number": "No. 297",
      "order": 297,
      "deckOrder": 6,
      "ex": false,
      "name": "청가면",
      "original": "Great Azuro",
      "korean": true,
      "stars": 1,
      "patch": "5.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 1,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088305_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/305.png",
      "link": "https://ffxivcollect.com/triad/cards/305",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a7b72b8da2c",
      "officialExact": true,
      "sources": [
        {
          "type": "Hunts",
          "typeName": "마물 사냥",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "울보 라토쟈 - 울다하 - 100 동맹 휘장",
          "original": "Maudlin Latool Ja - Ul'dah - 100 Allied Seals",
          "method": "동맹 휘장으로 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/305"
        }
      ]
    },
    {
      "id": 307,
      "number": "No. 298",
      "order": 298,
      "deckOrder": 20,
      "ex": false,
      "name": "탐구의 삼위일체",
      "original": "Trinity Seeker",
      "korean": true,
      "stars": 3,
      "patch": "5.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 1,
        "bottom": 8,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088307_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/307.png",
      "link": "https://ffxivcollect.com/triad/cards/307",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/3df60bc44eb",
      "officialExact": true,
      "sources": [
        {
          "type": "Bozja",
          "typeName": "보즈야",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "3 보즈야 클러스터",
          "original": "3 Bozjan Clusters",
          "method": "보즈야 클러스터로 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/307"
        }
      ]
    },
    {
      "id": 308,
      "number": "No. 299",
      "order": 299,
      "deckOrder": 20,
      "ex": false,
      "name": "맹세의 삼위일체",
      "original": "Trinity Avowed",
      "korean": true,
      "stars": 3,
      "patch": "5.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 7,
        "bottom": 6,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088308_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/308.png",
      "link": "https://ffxivcollect.com/triad/cards/308",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0eecfa7287c",
      "officialExact": true,
      "sources": [
        {
          "type": "Bozja",
          "typeName": "보즈야",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "3 보즈야 클러스터",
          "original": "3 Bozjan Clusters",
          "method": "보즈야 클러스터로 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/308"
        }
      ]
    },
    {
      "id": 309,
      "number": "No. 300",
      "order": 300,
      "deckOrder": 20,
      "ex": false,
      "name": "아포칼리옵스",
      "original": "Azulmagia",
      "korean": true,
      "stars": 3,
      "patch": "5.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 8,
        "bottom": 6,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088309_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/309.png",
      "link": "https://ffxivcollect.com/triad/cards/309",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b88370d27fd",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293871,
          "name": "드로인",
          "original": "Droyn",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 달 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293871",
          "region": "다날란",
          "npc": {
            "id": 2293871,
            "residentId": 1035181,
            "name": "드로인",
            "original": "Droyn",
            "location": "울다하 달 회랑",
            "region": "다날란",
            "x": "11.8",
            "y": "13.0",
            "quest": {
              "name": "안녕, 초대 청가면",
              "original": "Blue Cheese",
              "link": "https://www.garlandtools.org/db/#quest/69273"
            },
            "ruleIds": [
              4,
              13
            ],
            "rules": [
              "동수",
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293871"
          }
        }
      ]
    },
    {
      "id": 310,
      "number": "No. 301",
      "order": 301,
      "deckOrder": 20,
      "ex": false,
      "name": "지크프리드",
      "original": "Siegfried",
      "korean": true,
      "stars": 3,
      "patch": "5.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 4,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088310_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/310.png",
      "link": "https://ffxivcollect.com/triad/cards/310",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b7b2f9f20d0",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293871,
          "name": "드로인",
          "original": "Droyn",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 달 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293871",
          "region": "다날란",
          "npc": {
            "id": 2293871,
            "residentId": 1035181,
            "name": "드로인",
            "original": "Droyn",
            "location": "울다하 달 회랑",
            "region": "다날란",
            "x": "11.8",
            "y": "13.0",
            "quest": {
              "name": "안녕, 초대 청가면",
              "original": "Blue Cheese",
              "link": "https://www.garlandtools.org/db/#quest/69273"
            },
            "ruleIds": [
              4,
              13
            ],
            "rules": [
              "동수",
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293871"
          }
        }
      ]
    },
    {
      "id": 311,
      "number": "No. 302",
      "order": 302,
      "deckOrder": 20,
      "ex": false,
      "name": "흉내쟁이 고고",
      "original": "Gogo, Master of Mimicry",
      "korean": true,
      "stars": 3,
      "patch": "5.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 6,
        "bottom": 4,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088311_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/311.png",
      "link": "https://ffxivcollect.com/triad/cards/311",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/729d2d6c4a4",
      "officialExact": true,
      "sources": [
        {
          "type": "Quest",
          "typeName": "퀘스트",
          "group": "quest",
          "relatedType": "Quest",
          "relatedId": 69530,
          "name": "청마법의 미래",
          "original": "A Future in Blue",
          "method": "퀘스트 완료 보상",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B2%AD%EB%A7%88%EB%B2%95%EC%9D%98%20%EB%AF%B8%EB%9E%98",
          "linkLabel": "공식 가이드 검색"
        },
        {
          "type": "Hunts",
          "typeName": "마물 사냥",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "울보 라토쟈 - 울다하 - 300 동맹 휘장",
          "original": "Maudlin Latool Ja - Ul'dah - 300 Allied Seals",
          "method": "동맹 휘장으로 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/311"
        }
      ]
    },
    {
      "id": 317,
      "number": "No. 303",
      "order": 303,
      "deckOrder": 8,
      "ex": false,
      "name": "지하미궁 수호자",
      "original": "Keeper of the Keys",
      "korean": true,
      "stars": 2,
      "patch": "5.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 4,
        "bottom": 4,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088317_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/317.png",
      "link": "https://ffxivcollect.com/triad/cards/317",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bb55a450e40",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 슬 라드 - 리다 란 (일 메그) - 60 두 빛깔 보석",
          "original": "Sul Lad - Lydha Lran (Il Mheg) - 60 Bicolor Gemstones",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/317"
        }
      ]
    },
    {
      "id": 318,
      "number": "No. 304",
      "order": 304,
      "deckOrder": 25,
      "ex": false,
      "name": "루나 바하무트",
      "original": "Lunar Bahamut",
      "korean": true,
      "stars": 3,
      "patch": "5.5",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 8,
        "right": 2,
        "bottom": 8,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088318_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/318.png",
      "link": "https://ffxivcollect.com/triad/cards/318",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/75ce6859fa9",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 777,
          "name": "파글단",
          "original": "Paglth'an",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/30aa935e026",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 319,
      "number": "No. 305",
      "order": 305,
      "deckOrder": 26,
      "ex": false,
      "name": "발렌스 반 바로",
      "original": "Valens van Varro",
      "korean": true,
      "stars": 3,
      "patch": "5.5",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 7,
        "right": 5,
        "bottom": 8,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088319_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/319.png",
      "link": "https://ffxivcollect.com/triad/cards/319",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a6ebe198603",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "22,400 맨더빌 골드 소서 포인트",
          "original": "22,400 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/319"
        }
      ]
    },
    {
      "id": 323,
      "number": "No. 306",
      "order": 306,
      "deckOrder": 32,
      "ex": false,
      "name": "G 워리어",
      "original": "G-Warrior",
      "korean": true,
      "stars": 4,
      "patch": "5.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 1,
        "bottom": 7,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088323_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/323.png",
      "link": "https://ffxivcollect.com/triad/cards/323",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/03c4fb039f9",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "카인타나 - 모르도나 - 1 붉은 미지의 야만신 우상, 1 녹색 미지의 야만신 우상 and 1 흰색 미지의 야만신 우상",
          "original": "C'intana - Mor Dhona - 1 Ruby Totem, 1 Emerald Totem and 1 Diamond Totem",
          "method": "기재된 토벌전 우상을 모아 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/323"
        }
      ]
    },
    {
      "id": 324,
      "number": "No. 307",
      "order": 307,
      "deckOrder": 36,
      "ex": false,
      "name": "다이아몬드 웨폰",
      "original": "Diamond Weapon",
      "korean": true,
      "stars": 4,
      "patch": "5.5",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 9,
        "right": 8,
        "bottom": 7,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088324_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/324.png",
      "link": "https://ffxivcollect.com/triad/cards/324",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/56e62afce18",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 781,
          "name": "다이아몬드 웨폰 포획작전",
          "original": "The Cloud Deck",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/aa56c6c81f2",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 782,
          "name": "극 다이아몬드 웨폰 포획작전",
          "original": "The Cloud Deck (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/19d0fd71f66",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 326,
      "number": "No. 308",
      "order": 308,
      "deckOrder": 41,
      "ex": false,
      "name": "2B",
      "original": "2B",
      "korean": true,
      "stars": 5,
      "patch": "5.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 10,
        "bottom": 4,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088326_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/326.png",
      "link": "https://ffxivcollect.com/triad/cards/326",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/1e574f39be8",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 779,
          "name": "희망의 포대: '탑'",
          "original": "The Tower at Paradigm's Breach",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/60e868561a1",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 320,
      "number": "No. 309",
      "order": 309,
      "deckOrder": 25,
      "ex": false,
      "name": "루나 이프리트",
      "original": "Lunar Ifrit",
      "korean": true,
      "stars": 3,
      "patch": "5.55",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 8,
        "right": 3,
        "bottom": 4,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088320_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/320.png",
      "link": "https://ffxivcollect.com/triad/cards/320",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6b5e14d90d5",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "22,400 맨더빌 골드 소서 포인트",
          "original": "22,400 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/320"
        }
      ]
    },
    {
      "id": 321,
      "number": "No. 310",
      "order": 310,
      "deckOrder": 20,
      "ex": false,
      "name": "IV군단 셰미하자",
      "original": "4th-make Shemhazai",
      "korean": true,
      "stars": 3,
      "patch": "5.55",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 6,
        "bottom": 7,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088321_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/321.png",
      "link": "https://ffxivcollect.com/triad/cards/321",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/52fada2ead4",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293873,
          "name": "슬라드키",
          "original": "Sladkey",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "강고스",
          "link": "https://ffxivcollect.com/triad/npcs/2293873",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293873,
            "residentId": 1035621,
            "name": "슬라드키",
            "original": "Sladkey",
            "location": "강고스",
            "region": "길드마스터처럼 보이는 남자",
            "x": "5.7",
            "y": "6.7",
            "quest": {
              "name": "피투성이 여왕의 행진",
              "original": "March of the Bloody Queen",
              "link": "https://www.garlandtools.org/db/#quest/69624"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293873"
          }
        }
      ]
    },
    {
      "id": 322,
      "number": "No. 311",
      "order": 311,
      "deckOrder": 20,
      "ex": false,
      "name": "IV군단 쿠훌린",
      "original": "4th-make Cuchulainn",
      "korean": true,
      "stars": 3,
      "patch": "5.55",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 1,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088322_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/322.png",
      "link": "https://ffxivcollect.com/triad/cards/322",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/469d5e52631",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293873,
          "name": "슬라드키",
          "original": "Sladkey",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "강고스",
          "link": "https://ffxivcollect.com/triad/npcs/2293873",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293873,
            "residentId": 1035621,
            "name": "슬라드키",
            "original": "Sladkey",
            "location": "강고스",
            "region": "길드마스터처럼 보이는 남자",
            "x": "5.7",
            "y": "6.7",
            "quest": {
              "name": "피투성이 여왕의 행진",
              "original": "March of the Bloody Queen",
              "link": "https://www.garlandtools.org/db/#quest/69624"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293873"
          }
        }
      ]
    },
    {
      "id": 325,
      "number": "No. 312",
      "order": 312,
      "deckOrder": 32,
      "ex": false,
      "name": "디아블로 아머먼트",
      "original": "Diablo Armament",
      "korean": true,
      "stars": 4,
      "patch": "5.55",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 4,
        "bottom": 9,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088325_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/325.png",
      "link": "https://ffxivcollect.com/triad/cards/325",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e2d36062d39",
      "officialExact": true,
      "sources": [
        {
          "type": "Bozja",
          "typeName": "보즈야",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "7 보즈야 클러스터",
          "original": "7 Bozjan Clusters",
          "method": "보즈야 클러스터로 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/325"
        }
      ]
    },
    {
      "id": 327,
      "number": "No. 313",
      "order": 313,
      "deckOrder": 1,
      "ex": false,
      "name": "트롤",
      "original": "Troll",
      "korean": true,
      "stars": 1,
      "patch": "6.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 4,
        "bottom": 3,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088327_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/327.png",
      "link": "https://ffxivcollect.com/triad/cards/327",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/94a16c6ff64",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293874,
          "name": "애글핀",
          "original": "Aiglephine",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "라비린토스",
          "link": "https://ffxivcollect.com/triad/npcs/2293874",
          "region": "북해 지역",
          "npc": {
            "id": 2293874,
            "residentId": 1041090,
            "name": "애글핀",
            "original": "Aiglephine",
            "location": "라비린토스",
            "region": "북해 지역",
            "x": "29.2",
            "y": "13.2",
            "quest": {
              "name": "조달하는 자, 조달하는 것",
              "original": "Glorified Ratcatcher",
              "link": "https://www.garlandtools.org/db/#quest/69898"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293874"
          }
        }
      ]
    },
    {
      "id": 328,
      "number": "No. 314",
      "order": 314,
      "deckOrder": 1,
      "ex": false,
      "name": "피샤차",
      "original": "Pisaca",
      "korean": true,
      "stars": 1,
      "patch": "6.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 4,
        "bottom": 4,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088328_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/328.png",
      "link": "https://ffxivcollect.com/triad/cards/328",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e9867dcca92",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293875,
          "name": "케타누르",
          "original": "Qetanur",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "사베네어 섬",
          "link": "https://ffxivcollect.com/triad/npcs/2293875",
          "region": "일사바드",
          "npc": {
            "id": 2293875,
            "residentId": 1041091,
            "name": "케타누르",
            "original": "Qetanur",
            "location": "사베네어 섬",
            "region": "일사바드",
            "x": "19.7",
            "y": "9.1",
            "quest": {
              "name": "거인석과 소년",
              "original": "A Boy's Errand",
              "link": "https://www.garlandtools.org/db/#quest/69910"
            },
            "ruleIds": [
              4
            ],
            "rules": [
              "동수"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293875"
          }
        }
      ]
    },
    {
      "id": 329,
      "number": "No. 315",
      "order": 315,
      "deckOrder": 1,
      "ex": false,
      "name": "이아",
      "original": "Ea",
      "korean": true,
      "stars": 1,
      "patch": "6.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 4,
        "bottom": 1,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088329_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/329.png",
      "link": "https://ffxivcollect.com/triad/cards/329",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/11477836499",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 N-1499 - 오미크론 기지 (울티마 툴레) - 200 두 빛깔 보석 (단계 3)",
          "original": "N-1499 - Base Omicron (Ultima Thule) - 200 Bicolor Gemstones (Rank 3)",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/329"
        }
      ]
    },
    {
      "id": 330,
      "number": "No. 316",
      "order": 316,
      "deckOrder": 10,
      "ex": false,
      "name": "아르카소다라",
      "original": "Arkasodara",
      "korean": true,
      "stars": 2,
      "patch": "6.0",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 4,
        "right": 4,
        "bottom": 7,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088330_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/330.png",
      "link": "https://ffxivcollect.com/triad/cards/330",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/025006ca95f",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293877,
          "name": "메리드",
          "original": "Mehryde",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "라자한",
          "link": "https://ffxivcollect.com/triad/npcs/2293877",
          "region": "일사바드",
          "npc": {
            "id": 2293877,
            "residentId": 1037381,
            "name": "메리드",
            "original": "Mehryde",
            "location": "라자한",
            "region": "일사바드",
            "x": "10.8",
            "y": "7.6",
            "quest": {
              "name": " 끈이 이어준 생명",
              "original": "A Bond Eternal",
              "link": "https://www.garlandtools.org/db/#quest/69805"
            },
            "ruleIds": [
              6
            ],
            "rules": [
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293877"
          }
        }
      ]
    },
    {
      "id": 331,
      "number": "No. 317",
      "order": 317,
      "deckOrder": 16,
      "ex": false,
      "name": "레포릿",
      "original": "Loporrit",
      "korean": true,
      "stars": 2,
      "patch": "6.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 6,
        "bottom": 6,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088331_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/331.png",
      "link": "https://ffxivcollect.com/triad/cards/331",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/235e2e64b01",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293878,
          "name": "치팅웨이",
          "original": "Cheatingway",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "올드 샬레이안",
          "link": "https://ffxivcollect.com/triad/npcs/2293878",
          "region": "북해 지역",
          "npc": {
            "id": 2293878,
            "residentId": 1041093,
            "name": "치팅웨이",
            "original": "Cheatingway",
            "location": "올드 샬레이안",
            "region": "북해 지역",
            "x": "11.0",
            "y": "8.9",
            "quest": {
              "name": "모든 아이들에게",
              "original": "Her Children, One and All",
              "link": "https://www.garlandtools.org/db/#quest/69985"
            },
            "ruleIds": [
              6,
              14
            ],
            "rules": [
              "합산",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293878"
          }
        }
      ]
    },
    {
      "id": 332,
      "number": "No. 318",
      "order": 318,
      "deckOrder": 16,
      "ex": false,
      "name": "아르고스",
      "original": "Argos",
      "korean": true,
      "stars": 2,
      "patch": "6.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 3,
        "bottom": 7,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088332_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/332.png",
      "link": "https://ffxivcollect.com/triad/cards/332",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d74e6abfc27",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293878,
          "name": "치팅웨이",
          "original": "Cheatingway",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "올드 샬레이안",
          "link": "https://ffxivcollect.com/triad/npcs/2293878",
          "region": "북해 지역",
          "npc": {
            "id": 2293878,
            "residentId": 1041093,
            "name": "치팅웨이",
            "original": "Cheatingway",
            "location": "올드 샬레이안",
            "region": "북해 지역",
            "x": "11.0",
            "y": "8.9",
            "quest": {
              "name": "모든 아이들에게",
              "original": "Her Children, One and All",
              "link": "https://www.garlandtools.org/db/#quest/69985"
            },
            "ruleIds": [
              6,
              14
            ],
            "rules": [
              "합산",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293878"
          }
        }
      ]
    },
    {
      "id": 333,
      "number": "No. 319",
      "order": 319,
      "deckOrder": 20,
      "ex": false,
      "name": "헤르메스",
      "original": "Hermes",
      "korean": true,
      "stars": 3,
      "patch": "6.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 8,
        "bottom": 7,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088333_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/333.png",
      "link": "https://ffxivcollect.com/triad/cards/333",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f63ec9b93bd",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 787,
          "name": "휘페르보레아 조물원",
          "original": "Ktisis Hyperboreia",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/59bc9590194",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 334,
      "number": "No. 320",
      "order": 320,
      "deckOrder": 20,
      "ex": false,
      "name": "이집의 아몬",
      "original": "Amon the Undying",
      "korean": true,
      "stars": 3,
      "patch": "6.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 7,
        "bottom": 3,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088334_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/334.png",
      "link": "https://ffxivcollect.com/triad/cards/334",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/688df1d3cb8",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 786,
          "name": "아이티온 별현미경",
          "original": "The Aitiascope",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/9bf8cfa2bf3",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 336,
      "number": "No. 321",
      "order": 321,
      "deckOrder": 25,
      "ex": false,
      "name": "메이거스 세 자매",
      "original": "Magus Sisters",
      "korean": true,
      "stars": 3,
      "patch": "6.0",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 4,
        "right": 1,
        "bottom": 8,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088336_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/336.png",
      "link": "https://ffxivcollect.com/triad/cards/336",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bc6b6a9c730",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 783,
          "name": "조트 탑",
          "original": "The Tower of Zot",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/ea013c32adf",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 337,
      "number": "No. 322",
      "order": 322,
      "deckOrder": 31,
      "ex": false,
      "name": "메테이온",
      "original": "Meteion",
      "korean": true,
      "stars": 3,
      "patch": "6.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 1,
        "bottom": 8,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088337_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/337.png",
      "link": "https://ffxivcollect.com/triad/cards/337",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f249ea43f76",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 796,
          "name": "종언의 결전",
          "original": "The Final Day",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/f74becf42ce",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 846,
          "name": "종극의 결전",
          "original": "The Minstrel's Ballad: Endsinger's Aria",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/260caa43959",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 338,
      "number": "No. 323",
      "order": 323,
      "deckOrder": 31,
      "ex": false,
      "name": "푸르슈노 르베유르",
      "original": "Fourchenault Leveilleur",
      "korean": true,
      "stars": 3,
      "patch": "6.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 7,
        "bottom": 3,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088338_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/338.png",
      "link": "https://ffxivcollect.com/triad/cards/338",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a0a0a391f22",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293879,
          "name": "셀리아",
          "original": "Celia",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "올드 샬레이안",
          "link": "https://ffxivcollect.com/triad/npcs/2293879",
          "region": "북해 지역",
          "npc": {
            "id": 2293879,
            "residentId": 1041082,
            "name": "셀리아",
            "original": "Celia",
            "location": "올드 샬레이안",
            "region": "북해 지역",
            "x": "15.8",
            "y": "7.0",
            "quest": {
              "name": "효월의 종언",
              "original": "Endwalker",
              "link": "https://www.garlandtools.org/db/#quest/70000"
            },
            "ruleIds": [
              5,
              6
            ],
            "rules": [
              "연장전",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293879"
          }
        }
      ]
    },
    {
      "id": 339,
      "number": "No. 324",
      "order": 324,
      "deckOrder": 35,
      "ex": false,
      "name": "아니마",
      "original": "Anima",
      "korean": true,
      "stars": 4,
      "patch": "6.0",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 5,
        "right": 1,
        "bottom": 9,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088339_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/339.png",
      "link": "https://ffxivcollect.com/triad/cards/339",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4dd1f80cb0b",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 785,
          "name": "바브일 탑",
          "original": "The Tower of Babil",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/915693d5dc6",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 340,
      "number": "No. 325",
      "order": 325,
      "deckOrder": 36,
      "ex": false,
      "name": "퀸투스 반 킨나",
      "original": "Quintus van Cinna",
      "korean": true,
      "stars": 4,
      "patch": "6.0",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 9,
        "right": 3,
        "bottom": 6,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088340_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/340.png",
      "link": "https://ffxivcollect.com/triad/cards/340",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e3c04a6c633",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293876,
          "name": "처세에 능한 제국 병사",
          "original": "Worldly Imperial",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "갈레말드",
          "link": "https://ffxivcollect.com/triad/npcs/2293876",
          "region": "일사바드",
          "npc": {
            "id": 2293876,
            "residentId": 1041092,
            "name": "처세에 능한 제국 병사",
            "original": "Worldly Imperial",
            "location": "갈레말드",
            "region": "일사바드",
            "x": "31.7",
            "y": "17.0",
            "quest": {
              "name": "겨울이 계속되어도",
              "original": "Strange Bedfellows",
              "link": "https://www.garlandtools.org/db/#quest/69929"
            },
            "ruleIds": [
              1
            ],
            "rules": [
              "무작위 규칙"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293876"
          }
        }
      ]
    },
    {
      "id": 341,
      "number": "No. 326",
      "order": 326,
      "deckOrder": 37,
      "ex": false,
      "name": "알피노 & 알리제(효월)",
      "original": "Endwalker Alphinaud & Alisaie",
      "korean": true,
      "stars": 4,
      "patch": "6.0",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 4,
        "right": 9,
        "bottom": 9,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088341_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/341.png",
      "link": "https://ffxivcollect.com/triad/cards/341",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8733b6cfec0",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293879,
          "name": "셀리아",
          "original": "Celia",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "올드 샬레이안",
          "link": "https://ffxivcollect.com/triad/npcs/2293879",
          "region": "북해 지역",
          "npc": {
            "id": 2293879,
            "residentId": 1041082,
            "name": "셀리아",
            "original": "Celia",
            "location": "올드 샬레이안",
            "region": "북해 지역",
            "x": "15.8",
            "y": "7.0",
            "quest": {
              "name": "효월의 종언",
              "original": "Endwalker",
              "link": "https://www.garlandtools.org/db/#quest/70000"
            },
            "ruleIds": [
              5,
              6
            ],
            "rules": [
              "연장전",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293879"
          }
        }
      ]
    },
    {
      "id": 342,
      "number": "No. 327",
      "order": 327,
      "deckOrder": 39,
      "ex": false,
      "name": "휘틀로다이우스",
      "original": "Hythlodaeus",
      "korean": true,
      "stars": 4,
      "patch": "6.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 9,
        "bottom": 6,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088342_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/342.png",
      "link": "https://ffxivcollect.com/triad/cards/342",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4b14ff8431f",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 아이사라 - 아나그노리시스 천측원 (엘피스) - 200 두 빛깔 보석 (단계 3)",
          "original": "Aisara - Anagnorisis (Elpis) - 200 Bicolor Gemstones (Rank 3)",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/342"
        }
      ]
    },
    {
      "id": 343,
      "number": "No. 328",
      "order": 328,
      "deckOrder": 39,
      "ex": false,
      "name": "브리트라",
      "original": "Vrtra",
      "korean": true,
      "stars": 4,
      "patch": "6.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 3,
        "bottom": 7,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088343_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/343.png",
      "link": "https://ffxivcollect.com/triad/cards/343",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/657b94d1272",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 3021,
          "name": "길거리 듀얼리스트: 8단계",
          "original": "Triple Team VIII",
          "method": "트리플 트라이어드로 NPC 107명에게 승리",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EA%B8%B8%EA%B1%B0%EB%A6%AC%20%EB%93%80%EC%96%BC%EB%A6%AC%EC%8A%A4%ED%8A%B8%3A%208%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 344,
      "number": "No. 329",
      "order": 329,
      "deckOrder": 42,
      "ex": false,
      "name": "조디아크",
      "original": "Zodiark",
      "korean": true,
      "stars": 5,
      "patch": "6.0",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 5,
        "right": 10,
        "bottom": 3,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088344_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/344.png",
      "link": "https://ffxivcollect.com/triad/cards/344",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ffa03c4e841",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 802,
          "name": "조디아크 토벌전",
          "original": "The Dark Inside",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/0ec40757254",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 803,
          "name": "극 조디아크 토벌전",
          "original": "The Minstrel's Ballad: Zodiark's Fall",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/435cbb84c32",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 345,
      "number": "No. 330",
      "order": 330,
      "deckOrder": 42,
      "ex": false,
      "name": "하이델린",
      "original": "Hydaelyn",
      "korean": true,
      "stars": 5,
      "patch": "6.0",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 10,
        "right": 3,
        "bottom": 10,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088345_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/345.png",
      "link": "https://ffxivcollect.com/triad/cards/345",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8199f3bd13b",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 790,
          "name": "하이델린 토벌전",
          "original": "The Mothercrystal",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/dc51d7c2abd",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 791,
          "name": "극 하이델린 토벌전",
          "original": "The Minstrel's Ballad: Hydaelyn's Call",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/328162d734a",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 346,
      "number": "No. 331",
      "order": 331,
      "deckOrder": 43,
      "ex": false,
      "name": "제노스 갈부스",
      "original": "Zenos Galvus",
      "korean": true,
      "stars": 5,
      "patch": "6.0",
      "typeId": 4,
      "type": "제국",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 9,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088346_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/346.png",
      "link": "https://ffxivcollect.com/triad/cards/346",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e43cb7d29f3",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 3020,
          "name": "카드 수집가: 11단계",
          "original": "Triple-decker XI",
          "method": "트리플 트라이어드 카드 344종류 입수",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%20%EC%88%98%EC%A7%91%EA%B0%80%3A%2011%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 335,
      "number": "No. 332",
      "order": 332,
      "deckOrder": 20,
      "ex": false,
      "name": "에리크토니오스",
      "original": "Erichthonios",
      "korean": true,
      "stars": 3,
      "patch": "6.01",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 8,
        "bottom": 5,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088335_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/335.png",
      "link": "https://ffxivcollect.com/triad/cards/335",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c9a2444b9a2",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 808,
          "name": "마의 전당 판데모니움: 변옥편 1",
          "original": "Asphodelos: The First Circle",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/42cb1dee850",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 809,
          "name": "마의 전당 판데모니움: 변옥편(영웅) 1",
          "original": "Asphodelos: The First Circle (Savage)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/60022c94e99",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 347,
      "number": "No. 333",
      "order": 333,
      "deckOrder": 1,
      "ex": false,
      "name": "방어벽",
      "original": "Rampart",
      "korean": true,
      "stars": 1,
      "patch": "6.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 6,
        "bottom": 5,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088347_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/347.png",
      "link": "https://ffxivcollect.com/triad/cards/347",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d4b1f9080b8",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 844,
          "name": "알자달 해저 유적",
          "original": "Alzadaal's Legacy",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/aa54f7c0f95",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 350,
      "number": "No. 334",
      "order": 334,
      "deckOrder": 23,
      "ex": false,
      "name": "랄거",
      "original": "Rhalgr",
      "korean": true,
      "stars": 3,
      "patch": "6.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 8,
        "bottom": 1,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088350_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/350.png",
      "link": "https://ffxivcollect.com/triad/cards/350",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6dced726804",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293881,
          "name": "프루덴스",
          "original": "Prudence",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "모르도나",
          "link": "https://ffxivcollect.com/triad/npcs/2293881",
          "region": "모르도나",
          "npc": {
            "id": 2293881,
            "residentId": 1042266,
            "name": "프루덴스",
            "original": "Prudence",
            "location": "모르도나",
            "region": "모르도나",
            "x": "30.6",
            "y": "12.3",
            "quest": {
              "name": "탐험가의 솔직한 모습",
              "original": "The Face of an Explorer",
              "link": "https://www.garlandtools.org/db/#quest/70075"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293881"
          }
        }
      ]
    },
    {
      "id": 351,
      "number": "No. 335",
      "order": 335,
      "deckOrder": 23,
      "ex": false,
      "name": "아제마",
      "original": "Azeyma",
      "korean": true,
      "stars": 3,
      "patch": "6.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 6,
        "bottom": 1,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088351_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/351.png",
      "link": "https://ffxivcollect.com/triad/cards/351",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/5554f4874c9",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293881,
          "name": "프루덴스",
          "original": "Prudence",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "모르도나",
          "link": "https://ffxivcollect.com/triad/npcs/2293881",
          "region": "모르도나",
          "npc": {
            "id": 2293881,
            "residentId": 1042266,
            "name": "프루덴스",
            "original": "Prudence",
            "location": "모르도나",
            "region": "모르도나",
            "x": "30.6",
            "y": "12.3",
            "quest": {
              "name": "탐험가의 솔직한 모습",
              "original": "The Face of an Explorer",
              "link": "https://www.garlandtools.org/db/#quest/70075"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293881"
          }
        }
      ]
    },
    {
      "id": 352,
      "number": "No. 336",
      "order": 336,
      "deckOrder": 23,
      "ex": false,
      "name": "날",
      "original": "Nald",
      "korean": true,
      "stars": 3,
      "patch": "6.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 1,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088352_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/352.png",
      "link": "https://ffxivcollect.com/triad/cards/352",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/9b70e936969",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 866,
          "name": "찬란한 신역 아글라이아",
          "original": "Aglaia",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/5b2bd74bd65",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 353,
      "number": "No. 337",
      "order": 337,
      "deckOrder": 23,
      "ex": false,
      "name": "달",
      "original": "Thal",
      "korean": true,
      "stars": 3,
      "patch": "6.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 7,
        "bottom": 8,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088353_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/353.png",
      "link": "https://ffxivcollect.com/triad/cards/353",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/75edf2031d5",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "24,800 맨더빌 골드 소서 포인트",
          "original": "24,800 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/353"
        }
      ]
    },
    {
      "id": 354,
      "number": "No. 338",
      "order": 338,
      "deckOrder": 32,
      "ex": false,
      "name": "키",
      "original": "Chi",
      "korean": true,
      "stars": 4,
      "patch": "6.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 1,
        "bottom": 9,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088354_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/354.png",
      "link": "https://ffxivcollect.com/triad/cards/354",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/66d34c0b263",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 N-1499 - 오미크론 기지 (울티마 툴레) - 300 두 빛깔 보석 (단계 3)",
          "original": "N-1499 - Base Omicron (Ultima Thule) - 300 Bicolor Gemstones (Rank 3)",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/354"
        }
      ]
    },
    {
      "id": 355,
      "number": "No. 339",
      "order": 339,
      "deckOrder": 35,
      "ex": false,
      "name": "다이바디파",
      "original": "Daivadipa",
      "korean": true,
      "stars": 4,
      "patch": "6.1",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 7,
        "right": 8,
        "bottom": 1,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088355_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/355.png",
      "link": "https://ffxivcollect.com/triad/cards/355",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bd2032eb418",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 마베이다 - 예드리만 연안 (사베네어 섬) - 300 두 빛깔 보석 (단계 3)",
          "original": "Mahveydah - Yedlihmad (Thavnair) - 300 Bicolor Gemstones (Rank 3)",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/355"
        }
      ]
    },
    {
      "id": 356,
      "number": "No. 340",
      "order": 340,
      "deckOrder": 40,
      "ex": false,
      "name": "종언을 노래하는 자",
      "original": "Endsinger",
      "korean": true,
      "stars": 5,
      "patch": "6.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 10,
        "bottom": 2,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088356_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/356.png",
      "link": "https://ffxivcollect.com/triad/cards/356",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ce6dbab967b",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "72,000 맨더빌 골드 소서 포인트",
          "original": "72,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/356"
        }
      ]
    },
    {
      "id": 348,
      "number": "No. 341",
      "order": 341,
      "deckOrder": 6,
      "ex": false,
      "name": "하마 마차",
      "original": "Hippo Cart",
      "korean": true,
      "stars": 1,
      "patch": "6.15",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 1,
        "bottom": 7,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088348_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/348.png",
      "link": "https://ffxivcollect.com/triad/cards/348",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/88adcaa6325",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293880,
          "name": "가사",
          "original": "Ghasa",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "사베네어 섬",
          "link": "https://ffxivcollect.com/triad/npcs/2293880",
          "region": "일사바드",
          "npc": {
            "id": 2293880,
            "residentId": 1042729,
            "name": "가사",
            "original": "Ghasa",
            "location": "사베네어 섬",
            "region": "일사바드",
            "x": "19.5",
            "y": "28.3",
            "quest": {
              "name": " 아르카소다라와 가자수라",
              "original": "Leader to Leader",
              "link": "https://www.garlandtools.org/db/#quest/70085"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293880"
          }
        }
      ]
    },
    {
      "id": 349,
      "number": "No. 342",
      "order": 342,
      "deckOrder": 10,
      "ex": false,
      "name": "가자수라",
      "original": "Gajasura",
      "korean": true,
      "stars": 2,
      "patch": "6.15",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 4,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088349_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/349.png",
      "link": "https://ffxivcollect.com/triad/cards/349",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/2d9fce69764",
      "officialExact": true,
      "sources": [
        {
          "type": "Tribal",
          "typeName": "우호부족",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "간타 - 스바르나 창고 (사베네어 섬) - 6 아르카소다라 별법구 (단계 5)",
          "original": "Ghanta - Svarna (Thavnair) - 6 Arkasodara Pana (Rank 5)",
          "method": "우호부족 상점에서 교환 · 표시된 우호도 필요",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/349"
        }
      ]
    },
    {
      "id": 361,
      "number": "No. 343",
      "order": 343,
      "deckOrder": 20,
      "ex": false,
      "name": "베아트리체",
      "original": "Beatrice",
      "korean": true,
      "stars": 3,
      "patch": "6.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 7,
        "bottom": 7,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088361_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/361.png",
      "link": "https://ffxivcollect.com/triad/cards/361",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a27256c3711",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 869,
          "name": "트로이아 궁정",
          "original": "The Fell Court of Troia",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/6135f1eb300",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 362,
      "number": "No. 344",
      "order": 344,
      "deckOrder": 23,
      "ex": false,
      "name": "비레고",
      "original": "Byregot",
      "korean": true,
      "stars": 3,
      "patch": "6.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 6,
        "bottom": 8,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088362_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/362.png",
      "link": "https://ffxivcollect.com/triad/cards/362",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ea9c4da2794",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "24,800 맨더빌 골드 소서 포인트",
          "original": "24,800 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/362"
        }
      ]
    },
    {
      "id": 364,
      "number": "No. 345",
      "order": 345,
      "deckOrder": 32,
      "ex": false,
      "name": "스카르밀리오네",
      "original": "Scarmiglione",
      "korean": true,
      "stars": 4,
      "patch": "6.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 6,
        "bottom": 8,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088364_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/364.png",
      "link": "https://ffxivcollect.com/triad/cards/364",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/cf39c84fd30",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "40,000 맨더빌 골드 소서 포인트",
          "original": "40,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/364"
        }
      ]
    },
    {
      "id": 365,
      "number": "No. 346",
      "order": 346,
      "deckOrder": 32,
      "ex": false,
      "name": "바르바리차",
      "original": "Barbariccia",
      "korean": true,
      "stars": 4,
      "patch": "6.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 7,
        "bottom": 7,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088365_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/365.png",
      "link": "https://ffxivcollect.com/triad/cards/365",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/69e5f3208bc",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 870,
          "name": "바르바리차 토벌전",
          "original": "Storm's Crown",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/4c8d2ff8db1",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 871,
          "name": "극 바르바리차 토벌전",
          "original": "Storm's Crown (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/72c1cef271a",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 366,
      "number": "No. 347",
      "order": 347,
      "deckOrder": 39,
      "ex": false,
      "name": "라하브레아",
      "original": "Chief Keyward Lahabrea",
      "korean": true,
      "stars": 4,
      "patch": "6.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 9,
        "bottom": 5,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088366_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/366.png",
      "link": "https://ffxivcollect.com/triad/cards/366",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8d4dd308d9a",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 아이사라 - 아나그노리시스 천측원 (엘피스) - 200 두 빛깔 보석 (단계 3)",
          "original": "Aisara - Anagnorisis (Elpis) - 200 Bicolor Gemstones (Rank 3)",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/366"
        }
      ]
    },
    {
      "id": 367,
      "number": "No. 348",
      "order": 348,
      "deckOrder": 40,
      "ex": false,
      "name": "헤파이스토스",
      "original": "Hephaistos",
      "korean": true,
      "stars": 5,
      "patch": "6.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 4,
        "bottom": 10,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088367_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/367.png",
      "link": "https://ffxivcollect.com/triad/cards/367",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a43a0f8860f",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 883,
          "name": "마의 전당 판데모니움: 연옥편 4",
          "original": "Abyssos: The Eighth Circle",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/350d3f10d44",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 884,
          "name": "마의 전당 판데모니움: 연옥편(영웅) 4",
          "original": "Abyssos: The Eighth Circle (Savage)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/d6de8662221",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 357,
      "number": "No. 349",
      "order": 349,
      "deckOrder": 6,
      "ex": false,
      "name": "N-7000",
      "original": "N-7000",
      "korean": true,
      "stars": 1,
      "patch": "6.25",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 5,
        "bottom": 1,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088357_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/357.png",
      "link": "https://ffxivcollect.com/triad/cards/357",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/3005674a177",
      "officialExact": true,
      "sources": [
        {
          "type": "Tribal",
          "typeName": "우호부족",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "N-0598 - 리서치 A4 (울티마 툴레) - 6 오미크론 토큰 (단계 4)",
          "original": "N-0598 - A-4 Research (Ultima Thule) - 6 Omicron Omnitokens (Rank 4)",
          "method": "우호부족 상점에서 교환 · 표시된 우호도 필요",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/357"
        }
      ]
    },
    {
      "id": 358,
      "number": "No. 350",
      "order": 350,
      "deckOrder": 8,
      "ex": false,
      "name": "패도의 게리온",
      "original": "Geryon the Steer",
      "korean": true,
      "stars": 2,
      "patch": "6.25",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 4,
        "bottom": 6,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088358_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/358.png",
      "link": "https://ffxivcollect.com/triad/cards/358",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/1e31fdeee04",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293882,
          "name": "킬푸푸",
          "original": "Kilfufu",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "울다하 날 회랑",
          "link": "https://ffxivcollect.com/triad/npcs/2293882",
          "region": "다날란",
          "npc": {
            "id": 2293882,
            "residentId": 1044127,
            "name": "킬푸푸",
            "original": "Kilfufu",
            "location": "울다하 날 회랑",
            "region": "다날란",
            "x": "12.6",
            "y": "8.4",
            "quest": {
              "name": "여왕 폐하와 약속의 열쇠",
              "original": "A Key to the Past",
              "link": "https://www.garlandtools.org/db/#quest/70182"
            },
            "ruleIds": [
              3,
              6
            ],
            "rules": [
              "3장 공개",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293882"
          }
        }
      ]
    },
    {
      "id": 359,
      "number": "No. 351",
      "order": 351,
      "deckOrder": 8,
      "ex": false,
      "name": "실디하 검투사",
      "original": "Gladiator of Sil'dih",
      "korean": true,
      "stars": 2,
      "patch": "6.25",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 2,
        "bottom": 5,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088359_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/359.png",
      "link": "https://ffxivcollect.com/triad/cards/359",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/65656106bc6",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 868,
          "name": "변형 던전: 실디하 지하수도",
          "original": "The Sil'dihn Subterrane",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%8B%A4%EB%94%94%ED%95%98%20%EC%A7%80%ED%95%98%EC%88%98%EB%8F%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 360,
      "number": "No. 352",
      "order": 352,
      "deckOrder": 8,
      "ex": false,
      "name": "손 마법기사",
      "original": "Thorne Knight",
      "korean": true,
      "stars": 2,
      "patch": "6.25",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 2,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088360_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/360.png",
      "link": "https://ffxivcollect.com/triad/cards/360",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e51e0b818f8",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 868,
          "name": "변형 던전: 실디하 지하수도",
          "original": "The Sil'dihn Subterrane",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%8B%A4%EB%94%94%ED%95%98%20%EC%A7%80%ED%95%98%EC%88%98%EB%8F%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 363,
      "number": "No. 353",
      "order": 353,
      "deckOrder": 24,
      "ex": false,
      "name": "그림자불 젤레즈 가",
      "original": "Shadowcaster Zeless Gah",
      "korean": true,
      "stars": 3,
      "patch": "6.25",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 2,
        "right": 8,
        "bottom": 8,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088363_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/363.png",
      "link": "https://ffxivcollect.com/triad/cards/363",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/4df033db0c4",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 868,
          "name": "변형 던전: 실디하 지하수도",
          "original": "The Sil'dihn Subterrane",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%8B%A4%EB%94%94%ED%95%98%20%EC%A7%80%ED%95%98%EC%88%98%EB%8F%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 368,
      "number": "No. 354",
      "order": 354,
      "deckOrder": 1,
      "ex": false,
      "name": "꼭두각시 음양사 ＆ 꼭두각시 경호원",
      "original": "Clockwork Onmyoji & Clockwork Yojimbo",
      "korean": true,
      "stars": 1,
      "patch": "6.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 3,
        "bottom": 1,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088368_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/368.png",
      "link": "https://ffxivcollect.com/triad/cards/368",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/53cca9e2b12",
      "officialExact": true,
      "sources": [
        {
          "type": "PvP",
          "typeName": "PvP",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "1,000 명예 점수",
          "original": "1,000 Wolf Marks",
          "method": "늑대우리 부두에서 명예 점수로 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/368"
        }
      ]
    },
    {
      "id": 370,
      "number": "No. 355",
      "order": 355,
      "deckOrder": 16,
      "ex": false,
      "name": "야옹 선생",
      "original": "Felicitous Furball",
      "korean": true,
      "stars": 2,
      "patch": "6.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 5,
        "bottom": 7,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088370_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/370.png",
      "link": "https://ffxivcollect.com/triad/cards/370",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c7e08f3dd95",
      "officialExact": true,
      "sources": [
        {
          "type": "Island Sanctuary",
          "typeName": "무인도 개척",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "1,000 시엘달레 화폐: 청선화",
          "original": "1,000 Seafarer's Cowries",
          "method": "무인도 개척 교환 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/370"
        }
      ]
    },
    {
      "id": 371,
      "number": "No. 356",
      "order": 356,
      "deckOrder": 16,
      "ex": false,
      "name": "안덴",
      "original": "Anden",
      "korean": true,
      "stars": 2,
      "patch": "6.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 1,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088371_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/371.png",
      "link": "https://ffxivcollect.com/triad/cards/371",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b5f319eebb9",
      "officialExact": true,
      "sources": [
        {
          "type": "Quest",
          "typeName": "퀘스트",
          "group": "quest",
          "relatedType": "Quest",
          "relatedId": 70252,
          "name": "안덴의 선택",
          "original": "Every Anden of the Rainbow",
          "method": "퀘스트 완료 보상",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%95%88%EB%8D%B4%EC%9D%98%20%EC%84%A0%ED%83%9D",
          "linkLabel": "공식 가이드 검색"
        },
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 슬 라드 - 리다 란 (일 메그) - 60 두 빛깔 보석",
          "original": "Sul Lad - Lydha Lran (Il Mheg) - 60 Bicolor Gemstones",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/371"
        }
      ]
    },
    {
      "id": 374,
      "number": "No. 357",
      "order": 357,
      "deckOrder": 23,
      "ex": false,
      "name": "메느피나",
      "original": "Menphina",
      "korean": true,
      "stars": 3,
      "patch": "6.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 7,
        "bottom": 6,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088374_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/374.png",
      "link": "https://ffxivcollect.com/triad/cards/374",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b37ea4d7594",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 911,
          "name": "환희의 신역 에우프로시네",
          "original": "Euphrosyne",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/6a4c4fd6d54",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 375,
      "number": "No. 358",
      "order": 358,
      "deckOrder": 32,
      "ex": false,
      "name": "카냐초",
      "original": "Cagnazzo",
      "korean": true,
      "stars": 4,
      "patch": "6.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 6,
        "bottom": 7,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088375_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/375.png",
      "link": "https://ffxivcollect.com/triad/cards/375",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/3cbc660791b",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 896,
          "name": "라피스 마날리스",
          "original": "Lapis Manalis",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/792e67706b4",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 376,
      "number": "No. 359",
      "order": 359,
      "deckOrder": 32,
      "ex": false,
      "name": "루비칸테",
      "original": "Rubicante",
      "korean": true,
      "stars": 4,
      "patch": "6.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 8,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088376_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/376.png",
      "link": "https://ffxivcollect.com/triad/cards/376",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/999eae1232f",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 886,
          "name": "루비칸테 토벌전",
          "original": "Mount Ordeals",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/d507cfbc2ee",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 924,
          "name": "극 루비칸테 토벌전",
          "original": "Mount Ordeals (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/dddb0b153e4",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 369,
      "number": "No. 360",
      "order": 360,
      "deckOrder": 6,
      "ex": false,
      "name": "드리밍웨이",
      "original": "Dreamingway",
      "korean": true,
      "stars": 1,
      "patch": "6.35",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 5,
        "bottom": 5,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088369_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/369.png",
      "link": "https://ffxivcollect.com/triad/cards/369",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/fa9ccca2eb9",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293883,
          "name": "게이밍웨이",
          "original": "Gamingway",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "비탄의 바다",
          "link": "https://ffxivcollect.com/triad/npcs/2293883",
          "region": "외계",
          "npc": {
            "id": 2293883,
            "residentId": 1044415,
            "name": "게이밍웨이",
            "original": "Gamingway",
            "location": "비탄의 바다",
            "region": "외계",
            "x": "18.1",
            "y": "16.1",
            "quest": {
              "name": " 끝나지 않아, 꿈은!",
              "original": "Dreams Come True",
              "link": "https://www.garlandtools.org/db/#quest/70222"
            },
            "ruleIds": [
              14
            ],
            "rules": [
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293883"
          }
        }
      ]
    },
    {
      "id": 372,
      "number": "No. 361",
      "order": 361,
      "deckOrder": 20,
      "ex": false,
      "name": "슈퍼 루게이에",
      "original": "Suprae-Lugae",
      "korean": true,
      "stars": 3,
      "patch": "6.35",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 7,
        "bottom": 5,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088372_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/372.png",
      "link": "https://ffxivcollect.com/triad/cards/372",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/2cef8dfbfd5",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "14,400 맨더빌 골드 소서 포인트",
          "original": "14,400 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/372"
        }
      ]
    },
    {
      "id": 373,
      "number": "No. 362",
      "order": 362,
      "deckOrder": 20,
      "ex": false,
      "name": "간카나",
      "original": "Gancanagh",
      "korean": true,
      "stars": 3,
      "patch": "6.35",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 3,
        "bottom": 2,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088373_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/373.png",
      "link": "https://ffxivcollect.com/triad/cards/373",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/55f4c65844b",
      "officialExact": true,
      "sources": [
        {
          "type": "Deep Dungeon",
          "typeName": "딥 던전",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "에우레카 오르토스 - 은빛 보물 자루",
          "original": "Eureka Orthos - Silver Sack",
          "method": "딥 던전의 숨겨진 보물 감정 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/373"
        }
      ]
    },
    {
      "id": 377,
      "number": "No. 363",
      "order": 363,
      "deckOrder": 47,
      "ex": false,
      "name": "베네스",
      "original": "Venat",
      "korean": true,
      "stars": 5,
      "patch": "6.35",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 8,
        "bottom": 7,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088377_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/377.png",
      "link": "https://ffxivcollect.com/triad/cards/377",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/34af504aa9c",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 3209,
          "name": "카드 수집가: 12단계",
          "original": "Triple-decker XII",
          "method": "트리플 트라이어드 카드 376종류 입수",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%20%EC%88%98%EC%A7%91%EA%B0%80%3A%2012%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 381,
      "number": "No. 364",
      "order": 364,
      "deckOrder": 20,
      "ex": false,
      "name": "옥토매머드",
      "original": "Octomammoth",
      "korean": true,
      "stars": 3,
      "patch": "6.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 8,
        "bottom": 4,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088381_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/381.png",
      "link": "https://ffxivcollect.com/triad/cards/381",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/92d4af1dffd",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 822,
          "name": "함 섬",
          "original": "The Aetherfont",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/0dff0394534",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 382,
      "number": "No. 365",
      "order": 365,
      "deckOrder": 20,
      "ex": false,
      "name": "프로토 카벙클",
      "original": "Proto-Carbuncle",
      "korean": true,
      "stars": 3,
      "patch": "6.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 5,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088382_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/382.png",
      "link": "https://ffxivcollect.com/triad/cards/382",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8a858015ce7",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293884,
          "name": "루이스노",
          "original": "Ruissenaud",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "라비린토스",
          "link": "https://ffxivcollect.com/triad/npcs/2293884",
          "region": "북해 지역",
          "npc": {
            "id": 2293884,
            "residentId": 1041259,
            "name": "루이스노",
            "original": "Ruissenaud",
            "location": "라비린토스",
            "region": "북해 지역",
            "x": "8.9",
            "y": "27.3",
            "quest": {
              "name": "'별'에게 소원을",
              "original": "Guided by the Past",
              "link": "https://www.garlandtools.org/db/#quest/70296"
            },
            "ruleIds": [
              4,
              13
            ],
            "rules": [
              "동수",
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293884"
          }
        }
      ]
    },
    {
      "id": 385,
      "number": "No. 366",
      "order": 366,
      "deckOrder": 39,
      "ex": false,
      "name": "테미스",
      "original": "Themis",
      "korean": true,
      "stars": 4,
      "patch": "6.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 5,
        "bottom": 9,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088385_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/385.png",
      "link": "https://ffxivcollect.com/triad/cards/385",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/64b359381ca",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293884,
          "name": "루이스노",
          "original": "Ruissenaud",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "라비린토스",
          "link": "https://ffxivcollect.com/triad/npcs/2293884",
          "region": "북해 지역",
          "npc": {
            "id": 2293884,
            "residentId": 1041259,
            "name": "루이스노",
            "original": "Ruissenaud",
            "location": "라비린토스",
            "region": "북해 지역",
            "x": "8.9",
            "y": "27.3",
            "quest": {
              "name": "'별'에게 소원을",
              "original": "Guided by the Past",
              "link": "https://www.garlandtools.org/db/#quest/70296"
            },
            "ruleIds": [
              4,
              13
            ],
            "rules": [
              "동수",
              "유형 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293884"
          }
        }
      ]
    },
    {
      "id": 387,
      "number": "No. 367",
      "order": 367,
      "deckOrder": 40,
      "ex": false,
      "name": "골베자",
      "original": "Golbez",
      "korean": true,
      "stars": 5,
      "patch": "6.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 5,
        "bottom": 2,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088387_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/387.png",
      "link": "https://ffxivcollect.com/triad/cards/387",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/1ae51b55710",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 949,
          "name": "골베자 토벌전",
          "original": "The Voidcast Dais",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/455ef52165f",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 950,
          "name": "극 골베자 토벌전",
          "original": "The Voidcast Dais (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/8eb0a1aa316",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 388,
      "number": "No. 368",
      "order": 368,
      "deckOrder": 40,
      "ex": false,
      "name": "아테나",
      "original": "Athena",
      "korean": true,
      "stars": 5,
      "patch": "6.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 5,
        "bottom": 10,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088388_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/388.png",
      "link": "https://ffxivcollect.com/triad/cards/388",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d8338dcc558",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 942,
          "name": "마의 전당 판데모니움: 천옥편 4",
          "original": "Anabaseios: The Twelfth Circle",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/ccde89dc68b",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 943,
          "name": "마의 전당 판데모니움: 천옥편(영웅) 4",
          "original": "Anabaseios: The Twelfth Circle (Savage)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/b8a237d0914",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 378,
      "number": "No. 369",
      "order": 369,
      "deckOrder": 1,
      "ex": false,
      "name": "요괴등",
      "original": "Okuri Chochin",
      "korean": true,
      "stars": 1,
      "patch": "6.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 5,
        "bottom": 1,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088378_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/378.png",
      "link": "https://ffxivcollect.com/triad/cards/378",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6c86f2619a0",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293885,
          "name": "토키모리",
          "original": "Tokimori",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쿠가네",
          "link": "https://ffxivcollect.com/triad/npcs/2293885",
          "region": "동쪽 나라",
          "npc": {
            "id": 2293885,
            "residentId": 1045250,
            "name": "토키모리",
            "original": "Tokimori",
            "location": "쿠가네",
            "region": "동쪽 나라",
            "x": "8.9",
            "y": "8.8",
            "quest": {
              "name": "시슈 육근산 여행길",
              "original": "Mononoke Aware",
              "link": "https://www.garlandtools.org/db/#quest/70269"
            },
            "ruleIds": [
              6,
              11
            ],
            "rules": [
              "합산",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293885"
          }
        }
      ]
    },
    {
      "id": 379,
      "number": "No. 370",
      "order": 370,
      "deckOrder": 8,
      "ex": false,
      "name": "무쇠쥐 고우라이",
      "original": "Gorai the Uncaged",
      "korean": true,
      "stars": 2,
      "patch": "6.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 2,
        "bottom": 6,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088379_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/379.png",
      "link": "https://ffxivcollect.com/triad/cards/379",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/40eecbc823e",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 945,
          "name": "변형 던전: 육근산",
          "original": "Mount Rokkon",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%9C%A1%EA%B7%BC%EC%82%B0",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 380,
      "number": "No. 371",
      "order": 371,
      "deckOrder": 8,
      "ex": false,
      "name": "원령 모우코",
      "original": "Moko the Restless",
      "korean": true,
      "stars": 2,
      "patch": "6.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 6,
        "bottom": 7,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088380_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/380.png",
      "link": "https://ffxivcollect.com/triad/cards/380",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c9acd6ed1a7",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 945,
          "name": "변형 던전: 육근산",
          "original": "Mount Rokkon",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%9C%A1%EA%B7%BC%EC%82%B0",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 383,
      "number": "No. 372",
      "order": 372,
      "deckOrder": 20,
      "ex": false,
      "name": "골도르",
      "original": "Goldor",
      "korean": true,
      "stars": 3,
      "patch": "6.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 2,
        "bottom": 8,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088383_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/383.png",
      "link": "https://ffxivcollect.com/triad/cards/383",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/1e884d1a0a9",
      "officialExact": true,
      "sources": [
        {
          "type": "Quest",
          "typeName": "퀘스트",
          "group": "quest",
          "relatedType": "Quest",
          "relatedId": 70314,
          "name": "악역의 길",
          "original": "The Brave and the Blue",
          "method": "퀘스트 완료 보상",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%95%85%EC%97%AD%EC%9D%98%20%EA%B8%B8",
          "linkLabel": "공식 가이드 검색"
        },
        {
          "type": "Hunts",
          "typeName": "마물 사냥",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "울보 라토쟈 - 울다하 - 300 동맹 휘장",
          "original": "Maudlin Latool Ja - Ul'dah - 300 Allied Seals",
          "method": "동맹 휘장으로 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/383"
        }
      ]
    },
    {
      "id": 384,
      "number": "No. 373",
      "order": 373,
      "deckOrder": 20,
      "ex": false,
      "name": "사자왕",
      "original": "Shishio",
      "korean": true,
      "stars": 3,
      "patch": "6.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 5,
        "bottom": 2,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088384_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/384.png",
      "link": "https://ffxivcollect.com/triad/cards/384",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f354ea3f67a",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 945,
          "name": "변형 던전: 육근산",
          "original": "Mount Rokkon",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%9C%A1%EA%B7%BC%EC%82%B0",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 386,
      "number": "No. 374",
      "order": 374,
      "deckOrder": 32,
      "ex": false,
      "name": "엔엔라",
      "original": "Enenra",
      "korean": true,
      "stars": 4,
      "patch": "6.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 5,
        "bottom": 5,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088386_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/386.png",
      "link": "https://ffxivcollect.com/triad/cards/386",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/9472116dbbd",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 945,
          "name": "변형 던전: 육근산",
          "original": "Mount Rokkon",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%9C%A1%EA%B7%BC%EC%82%B0",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 394,
      "number": "No. 375",
      "order": 375,
      "deckOrder": 23,
      "ex": false,
      "name": "노피카",
      "original": "Nophica",
      "korean": true,
      "stars": 3,
      "patch": "6.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 6,
        "bottom": 7,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088394_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/394.png",
      "link": "https://ffxivcollect.com/triad/cards/394",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0df55b54cb9",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293886,
          "name": "일레어",
          "original": "Ylaire",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 구시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293886",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293886,
            "residentId": 1043026,
            "name": "일레어",
            "original": "Ylaire",
            "location": "그리다니아 구시가지",
            "region": "검은장막 숲",
            "x": "7.8",
            "y": "10.9",
            "quest": {
              "name": "열두 신의 비밀",
              "original": "The Secret of the Twelve",
              "link": "https://www.garlandtools.org/db/#quest/70205"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293886"
          }
        }
      ]
    },
    {
      "id": 395,
      "number": "No. 376",
      "order": 376,
      "deckOrder": 23,
      "ex": false,
      "name": "알디크",
      "original": "Althyk",
      "korean": true,
      "stars": 3,
      "patch": "6.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 7,
        "bottom": 8,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088395_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/395.png",
      "link": "https://ffxivcollect.com/triad/cards/395",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/7501e61eb53",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293886,
          "name": "일레어",
          "original": "Ylaire",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 구시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293886",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293886,
            "residentId": 1043026,
            "name": "일레어",
            "original": "Ylaire",
            "location": "그리다니아 구시가지",
            "region": "검은장막 숲",
            "x": "7.8",
            "y": "10.9",
            "quest": {
              "name": "열두 신의 비밀",
              "original": "The Secret of the Twelve",
              "link": "https://www.garlandtools.org/db/#quest/70205"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293886"
          }
        }
      ]
    },
    {
      "id": 396,
      "number": "No. 377",
      "order": 377,
      "deckOrder": 23,
      "ex": false,
      "name": "니메이아",
      "original": "Nymeia",
      "korean": true,
      "stars": 3,
      "patch": "6.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 8,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088396_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/396.png",
      "link": "https://ffxivcollect.com/triad/cards/396",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0fc35a5c2e4",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293886,
          "name": "일레어",
          "original": "Ylaire",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "그리다니아 구시가지",
          "link": "https://ffxivcollect.com/triad/npcs/2293886",
          "region": "검은장막 숲",
          "npc": {
            "id": 2293886,
            "residentId": 1043026,
            "name": "일레어",
            "original": "Ylaire",
            "location": "그리다니아 구시가지",
            "region": "검은장막 숲",
            "x": "7.8",
            "y": "10.9",
            "quest": {
              "name": "열두 신의 비밀",
              "original": "The Secret of the Twelve",
              "link": "https://www.garlandtools.org/db/#quest/70205"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293886"
          }
        }
      ]
    },
    {
      "id": 397,
      "number": "No. 378",
      "order": 378,
      "deckOrder": 23,
      "ex": false,
      "name": "할로네",
      "original": "Halone",
      "korean": true,
      "stars": 3,
      "patch": "6.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 8,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088397_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/397.png",
      "link": "https://ffxivcollect.com/triad/cards/397",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a285f2bc7f6",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "24,800 맨더빌 골드 소서 포인트",
          "original": "24,800 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/397"
        }
      ]
    },
    {
      "id": 398,
      "number": "No. 379",
      "order": 379,
      "deckOrder": 23,
      "ex": false,
      "name": "살리아크",
      "original": "Thaliak",
      "korean": true,
      "stars": 3,
      "patch": "6.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 8,
        "bottom": 6,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088398_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/398.png",
      "link": "https://ffxivcollect.com/triad/cards/398",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/fa72ac7358b",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293887,
          "name": "마야르",
          "original": "Maillart",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "올드 샬레이안",
          "link": "https://ffxivcollect.com/triad/npcs/2293887",
          "region": "북해 지역",
          "npc": {
            "id": 2293887,
            "residentId": 1043027,
            "name": "마야르",
            "original": "Maillart",
            "location": "올드 샬레이안",
            "region": "북해 지역",
            "x": "8.5",
            "y": "15.2",
            "quest": {
              "name": "신들에게 사랑받은 땅, 에오르제아",
              "original": "Embraced by Gods",
              "link": "https://www.garlandtools.org/db/#quest/70328"
            },
            "ruleIds": [
              6,
              9
            ],
            "rules": [
              "합산",
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293887"
          }
        }
      ]
    },
    {
      "id": 399,
      "number": "No. 380",
      "order": 380,
      "deckOrder": 23,
      "ex": false,
      "name": "리믈렌",
      "original": "Llymlaen",
      "korean": true,
      "stars": 3,
      "patch": "6.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 8,
        "bottom": 1,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088399_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/399.png",
      "link": "https://ffxivcollect.com/triad/cards/399",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/49295b57a37",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293887,
          "name": "마야르",
          "original": "Maillart",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "올드 샬레이안",
          "link": "https://ffxivcollect.com/triad/npcs/2293887",
          "region": "북해 지역",
          "npc": {
            "id": 2293887,
            "residentId": 1043027,
            "name": "마야르",
            "original": "Maillart",
            "location": "올드 샬레이안",
            "region": "북해 지역",
            "x": "8.5",
            "y": "15.2",
            "quest": {
              "name": "신들에게 사랑받은 땅, 에오르제아",
              "original": "Embraced by Gods",
              "link": "https://www.garlandtools.org/db/#quest/70328"
            },
            "ruleIds": [
              6,
              9
            ],
            "rules": [
              "합산",
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293887"
          }
        }
      ]
    },
    {
      "id": 400,
      "number": "No. 381",
      "order": 381,
      "deckOrder": 23,
      "ex": false,
      "name": "오쉬온",
      "original": "Oschon",
      "korean": true,
      "stars": 3,
      "patch": "6.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 6,
        "bottom": 8,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088400_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/400.png",
      "link": "https://ffxivcollect.com/triad/cards/400",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/379ebdabbfa",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "24,800 맨더빌 골드 소서 포인트",
          "original": "24,800 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/400"
        }
      ]
    },
    {
      "id": 401,
      "number": "No. 382",
      "order": 382,
      "deckOrder": 20,
      "ex": false,
      "name": "두란테",
      "original": "Durante",
      "korean": true,
      "stars": 3,
      "patch": "6.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 6,
        "bottom": 6,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088401_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/401.png",
      "link": "https://ffxivcollect.com/triad/cards/401",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b937880b474",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 823,
          "name": "달의 지하계곡",
          "original": "The Lunar Subterrane",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/49a97bd9e40",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 402,
      "number": "No. 383",
      "order": 383,
      "deckOrder": 33,
      "ex": false,
      "name": "에울로기아",
      "original": "Eulogia",
      "korean": true,
      "stars": 4,
      "patch": "6.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 9,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088402_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/402.png",
      "link": "https://ffxivcollect.com/triad/cards/402",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a19217b843e",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 962,
          "name": "번영의 신역 탈레이아",
          "original": "Thaleia",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/6f78305dcab",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 404,
      "number": "No. 384",
      "order": 384,
      "deckOrder": 40,
      "ex": false,
      "name": "제로무스",
      "original": "Zeromus",
      "korean": true,
      "stars": 5,
      "patch": "6.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 9,
        "bottom": 9,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088404_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/404.png",
      "link": "https://ffxivcollect.com/triad/cards/404",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ac71b00d582",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 964,
          "name": "제로무스 토벌전",
          "original": "The Abyssal Fracture",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/3aae319c9b2",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 965,
          "name": "극 제로무스 토벌전",
          "original": "The Abyssal Fracture (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/eec4c21096e",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 389,
      "number": "No. 385",
      "order": 385,
      "deckOrder": 1,
      "ex": false,
      "name": "케투두케",
      "original": "Ketuduke",
      "korean": true,
      "stars": 1,
      "patch": "6.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 3,
        "bottom": 4,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088389_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/389.png",
      "link": "https://ffxivcollect.com/triad/cards/389",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/91c94b5c7c1",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 961,
          "name": "변형 던전: 알로알로 섬",
          "original": "Aloalo Island",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%95%8C%EB%A1%9C%EC%95%8C%EB%A1%9C%20%EC%84%AC",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 390,
      "number": "No. 386",
      "order": 386,
      "deckOrder": 8,
      "ex": false,
      "name": "랄랄",
      "original": "Lala",
      "korean": true,
      "stars": 2,
      "patch": "6.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 6,
        "bottom": 2,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088390_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/390.png",
      "link": "https://ffxivcollect.com/triad/cards/390",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/010751c6ad5",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 961,
          "name": "변형 던전: 알로알로 섬",
          "original": "Aloalo Island",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%95%8C%EB%A1%9C%EC%95%8C%EB%A1%9C%20%EC%84%AC",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 391,
      "number": "No. 387",
      "order": 387,
      "deckOrder": 8,
      "ex": false,
      "name": "스타티스",
      "original": "Statice",
      "korean": true,
      "stars": 2,
      "patch": "6.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 4,
        "bottom": 5,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088391_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/391.png",
      "link": "https://ffxivcollect.com/triad/cards/391",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bd113973508",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 961,
          "name": "변형 던전: 알로알로 섬",
          "original": "Aloalo Island",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%95%8C%EB%A1%9C%EC%95%8C%EB%A1%9C%20%EC%84%AC",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 393,
      "number": "No. 388",
      "order": 388,
      "deckOrder": 20,
      "ex": false,
      "name": "로쿠로쿠이",
      "original": "Loquloqui",
      "korean": true,
      "stars": 3,
      "patch": "6.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 5,
        "bottom": 7,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088393_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/393.png",
      "link": "https://ffxivcollect.com/triad/cards/393",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d320abb995e",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 961,
          "name": "변형 던전: 알로알로 섬",
          "original": "Aloalo Island",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%95%8C%EB%A1%9C%EC%95%8C%EB%A1%9C%20%EC%84%AC",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 392,
      "number": "No. 389",
      "order": 389,
      "deckOrder": 17,
      "ex": false,
      "name": "코요코요",
      "original": "PuPu",
      "korean": true,
      "stars": 2,
      "patch": "6.55",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 7,
        "bottom": 4,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088392_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/392.png",
      "link": "https://ffxivcollect.com/triad/cards/392",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/17e27496a7e",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "5,454 맨더빌 골드 소서 포인트",
          "original": "5,454 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/392"
        }
      ]
    },
    {
      "id": 403,
      "number": "No. 390",
      "order": 390,
      "deckOrder": 35,
      "ex": false,
      "name": "아수라",
      "original": "Asura",
      "korean": true,
      "stars": 4,
      "patch": "6.55",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 9,
        "right": 5,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088403_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/403.png",
      "link": "https://ffxivcollect.com/triad/cards/403",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8f20b4c550b",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 69,
          "name": "アスラ討滅戦",
          "original": "The Gilded Araya",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%E3%82%A2%E3%82%B9%E3%83%A9%E8%A8%8E%E6%BB%85%E6%88%A6",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 406,
      "number": "No. 391",
      "order": 391,
      "deckOrder": 3,
      "ex": false,
      "name": "펠루펠루",
      "original": "Pelupelu",
      "korean": true,
      "stars": 1,
      "patch": "7.0",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 5,
        "right": 3,
        "bottom": 4,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088406_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/406.png",
      "link": "https://ffxivcollect.com/triad/cards/406",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d161c84797d",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293888,
          "name": "니퀘니",
          "original": "Nyikweni",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "툴라이욜라",
          "link": "https://ffxivcollect.com/triad/npcs/2293888",
          "region": "요카 투랄",
          "npc": {
            "id": 2293888,
            "residentId": 1048549,
            "name": "니퀘니",
            "original": "Nyikweni",
            "location": "툴라이욜라",
            "region": "요카 투랄",
            "x": "15.0",
            "y": "13.5",
            "quest": {
              "name": "펠루펠루족을 알다",
              "original": "Knowing the Pelupelu",
              "link": "https://www.garlandtools.org/db/#quest/70413"
            },
            "ruleIds": [
              2
            ],
            "rules": [
              "모두 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293888"
          }
        }
      ]
    },
    {
      "id": 407,
      "number": "No. 392",
      "order": 392,
      "deckOrder": 1,
      "ex": false,
      "name": "알파카",
      "original": "Alpaca",
      "korean": true,
      "stars": 1,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 5,
        "bottom": 3,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088407_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/407.png",
      "link": "https://ffxivcollect.com/triad/cards/407",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/714779db2db",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293889,
          "name": "워펠리",
          "original": "Wopli",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "오르코 파차",
          "link": "https://ffxivcollect.com/triad/npcs/2293889",
          "region": "요카 투랄",
          "npc": {
            "id": 2293889,
            "residentId": 1048664,
            "name": "워펠리",
            "original": "Wopli",
            "location": "오르코 파차",
            "region": "요카 투랄",
            "x": "28.5",
            "y": "12.9",
            "quest": {
              "name": "펠루펠루족을 알다",
              "original": "Knowing the Pelupelu",
              "link": "https://www.garlandtools.org/db/#quest/70413"
            },
            "ruleIds": [
              3
            ],
            "rules": [
              "3장 공개"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293889"
          }
        }
      ]
    },
    {
      "id": 408,
      "number": "No. 393",
      "order": 393,
      "deckOrder": 10,
      "ex": false,
      "name": "모블린",
      "original": "Moblin",
      "korean": true,
      "stars": 2,
      "patch": "7.0",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 5,
        "right": 5,
        "bottom": 4,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088408_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/408.png",
      "link": "https://ffxivcollect.com/triad/cards/408",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/83cf5161a73",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293890,
          "name": "와소워크",
          "original": "Warsowok",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "코자말루 카",
          "link": "https://ffxivcollect.com/triad/npcs/2293890",
          "region": "요카 투랄",
          "npc": {
            "id": 2293890,
            "residentId": 1048918,
            "name": "와소워크",
            "original": "Warsowok",
            "location": "코자말루 카",
            "region": "요카 투랄",
            "x": "11.5",
            "y": "27.1",
            "quest": {
              "name": "수집의 민족, 모블린족",
              "original": "A Leaking Workpot",
              "link": "https://www.garlandtools.org/db/#quest/70416"
            },
            "ruleIds": [
              4
            ],
            "rules": [
              "동수"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293890"
          }
        }
      ]
    },
    {
      "id": 409,
      "number": "No. 394",
      "order": 394,
      "deckOrder": 8,
      "ex": false,
      "name": "나무전령",
      "original": "Branchbearer",
      "korean": true,
      "stars": 2,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 5,
        "bottom": 3,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088409_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/409.png",
      "link": "https://ffxivcollect.com/triad/cards/409",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/85942777d07",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293891,
          "name": "부르크노크",
          "original": "Br'uk Noq'",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "야크텔 밀림",
          "link": "https://ffxivcollect.com/triad/npcs/2293891",
          "region": "요카 투랄",
          "npc": {
            "id": 2293891,
            "residentId": 1048965,
            "name": "부르크노크",
            "original": "Br'uk Noq'",
            "location": "야크텔 밀림",
            "region": "요카 투랄",
            "x": "12.7",
            "y": "14.8",
            "quest": {
              "name": "친구의 시련",
              "original": "The Feat of the Brotherhood",
              "link": "https://www.garlandtools.org/db/#quest/70444"
            },
            "ruleIds": [
              12
            ],
            "rules": [
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293891"
          }
        }
      ]
    },
    {
      "id": 410,
      "number": "No. 395",
      "order": 395,
      "deckOrder": 8,
      "ex": false,
      "name": "로네크",
      "original": "Rroneek",
      "korean": true,
      "stars": 2,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 5,
        "bottom": 4,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088410_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/410.png",
      "link": "https://ffxivcollect.com/triad/cards/410",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/7299c74f09d",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293892,
          "name": "루야와",
          "original": "Luwyawa",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "샬로니 황야",
          "link": "https://ffxivcollect.com/triad/npcs/2293892",
          "region": "사카 투랄",
          "npc": {
            "id": 2293892,
            "residentId": 1049410,
            "name": "루야와",
            "original": "Luwyawa",
            "location": "샬로니 황야",
            "region": "사카 투랄",
            "x": "28.8",
            "y": "30.3",
            "quest": {
              "name": "사카 투랄로",
              "original": "The Long Road to Xak Tural",
              "link": "https://www.garlandtools.org/db/#quest/70448"
            },
            "ruleIds": [
              3,
              6
            ],
            "rules": [
              "3장 공개",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293892"
          }
        }
      ]
    },
    {
      "id": 411,
      "number": "No. 396",
      "order": 396,
      "deckOrder": 8,
      "ex": false,
      "name": "보초병 R",
      "original": "Sentry R8",
      "korean": true,
      "stars": 2,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 6,
        "bottom": 4,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088411_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/411.png",
      "link": "https://ffxivcollect.com/triad/cards/411",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/9c2a489689a",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293893,
          "name": "와타아예",
          "original": "Uataaye",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "헤리티지 파운드",
          "link": "https://ffxivcollect.com/triad/npcs/2293893",
          "region": "사카 투랄",
          "npc": {
            "id": 2293893,
            "residentId": 1049469,
            "name": "와타아예",
            "original": "Uataaye",
            "location": "헤리티지 파운드",
            "region": "사카 투랄",
            "x": "19.5",
            "y": "9.4",
            "quest": {
              "name": "이왕 스펜",
              "original": "A Royal Welcome",
              "link": "https://www.garlandtools.org/db/#quest/70464"
            },
            "ruleIds": [
              13,
              14
            ],
            "rules": [
              "유형 약화",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293893"
          }
        }
      ]
    },
    {
      "id": 412,
      "number": "No. 397",
      "order": 397,
      "deckOrder": 8,
      "ex": false,
      "name": "아웃러너",
      "original": "Outrunner",
      "korean": true,
      "stars": 2,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 3,
        "bottom": 6,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088412_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/412.png",
      "link": "https://ffxivcollect.com/triad/cards/412",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/45812cf2488",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293894,
          "name": "라리사",
          "original": "Larisa",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "솔루션 나인",
          "link": "https://ffxivcollect.com/triad/npcs/2293894",
          "region": "사카 투랄",
          "npc": {
            "id": 2293894,
            "residentId": 1049259,
            "name": "라리사",
            "original": "Larisa",
            "location": "솔루션 나인",
            "region": "사카 투랄",
            "x": "5.8",
            "y": "13.9",
            "quest": {
              "name": "다정하고도 잔혹한 세계",
              "original": "In Serenity and Sorrow",
              "link": "https://www.garlandtools.org/db/#quest/70486"
            },
            "ruleIds": [
              2,
              6
            ],
            "rules": [
              "모두 공개",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293894"
          }
        }
      ]
    },
    {
      "id": 413,
      "number": "No. 398",
      "order": 398,
      "deckOrder": 31,
      "ex": false,
      "name": "굴루쟈쟈",
      "original": "Gulool Ja Ja",
      "korean": true,
      "stars": 3,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 7,
        "bottom": 7,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088413_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/413.png",
      "link": "https://ffxivcollect.com/triad/cards/413",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a4e24525736",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293895,
          "name": "가보쟈",
          "original": "Gavoll Ja",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "툴라이욜라",
          "link": "https://ffxivcollect.com/triad/npcs/2293895",
          "region": "요카 투랄",
          "npc": {
            "id": 2293895,
            "residentId": 1048550,
            "name": "가보쟈",
            "original": "Gavoll Ja",
            "location": "툴라이욜라",
            "region": "요카 투랄",
            "x": "15.7",
            "y": "2.9",
            "quest": {
              "name": "피눈물을 훔치며",
              "original": "No Time for Tears",
              "link": "https://www.garlandtools.org/db/#quest/70456"
            },
            "ruleIds": [
              9,
              11
            ],
            "rules": [
              "무작위 순서",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293895"
          }
        }
      ]
    },
    {
      "id": 414,
      "number": "No. 399",
      "order": 399,
      "deckOrder": 20,
      "ex": false,
      "name": "졸음보",
      "original": "Drowsie",
      "korean": true,
      "stars": 3,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 5,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088414_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/414.png",
      "link": "https://ffxivcollect.com/triad/cards/414",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/1681e084635",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 826,
          "name": "이후이카 투무",
          "original": "Ihuykatumu",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/a23267fb7f1",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 415,
      "number": "No. 400",
      "order": 400,
      "deckOrder": 20,
      "ex": false,
      "name": "료코 테테",
      "original": "Ryoqor Terteh",
      "korean": true,
      "stars": 3,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 4,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088415_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/415.png",
      "link": "https://ffxivcollect.com/triad/cards/415",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f4bcd805cf3",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 824,
          "name": "워코 조모",
          "original": "Worqor Zormor",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/d2b1e0330eb",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 416,
      "number": "No. 401",
      "order": 401,
      "deckOrder": 20,
      "ex": false,
      "name": "망치머리 거병",
      "original": "Maulskull",
      "korean": true,
      "stars": 3,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 7,
        "bottom": 4,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088416_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/416.png",
      "link": "https://ffxivcollect.com/triad/cards/416",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bb9fb3ca657",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 829,
          "name": "하늘심연 세노테",
          "original": "The Skydeep Cenote",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/5c5eb2cb875",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 417,
      "number": "No. 402",
      "order": 402,
      "deckOrder": 20,
      "ex": false,
      "name": "앰브로즈",
      "original": "Ambrose",
      "korean": true,
      "stars": 3,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 3,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088417_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/417.png",
      "link": "https://ffxivcollect.com/triad/cards/417",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0c68c5eeff6",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 825,
          "name": "오리제닉스",
          "original": "Origenics",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/c3e5463873d",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 418,
      "number": "No. 403",
      "order": 403,
      "deckOrder": 32,
      "ex": false,
      "name": "발리가르만다",
      "original": "Valigarmanda",
      "korean": true,
      "stars": 4,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 5,
        "bottom": 6,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088418_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/418.png",
      "link": "https://ffxivcollect.com/triad/cards/418",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/903e56113e5",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 832,
          "name": "발리가르만다 토벌전",
          "original": "Worqor Lar Dor",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/5de535790ce",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 833,
          "name": "극 발리가르만다 토벌전",
          "original": "Worqor Lar Dor (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/71c8e2c4ab4",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 419,
      "number": "No. 404",
      "order": 404,
      "deckOrder": 40,
      "ex": false,
      "name": "조라쟈",
      "original": "Zoraal Ja",
      "korean": true,
      "stars": 5,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 8,
        "bottom": 5,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088419_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/419.png",
      "link": "https://ffxivcollect.com/triad/cards/419",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/55a0b69a62a",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 995,
          "name": "조라쟈 토벌전",
          "original": "Everkeep",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/99d1fd992bb",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 996,
          "name": "극 조라쟈 토벌전",
          "original": "Everkeep (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/b7e0a867f42",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 420,
      "number": "No. 405",
      "order": 405,
      "deckOrder": 40,
      "ex": false,
      "name": "이터널 퀸",
      "original": "Queen Eternal",
      "korean": true,
      "stars": 5,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 10,
        "bottom": 9,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088420_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/420.png",
      "link": "https://ffxivcollect.com/triad/cards/420",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bcac57dc5eb",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 984,
          "name": "이터널 퀸 토벌전",
          "original": "The Interphos",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/9d3819988bc",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1017,
          "name": "극 이터널 퀸 토벌전",
          "original": "The Minstrel's Ballad: Sphene's Burden",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/80c0e53db64",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 422,
      "number": "No. 406",
      "order": 406,
      "deckOrder": 39,
      "ex": false,
      "name": "오티스",
      "original": "Otis",
      "korean": true,
      "stars": 4,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 7,
        "bottom": 8,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088422_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/422.png",
      "link": "https://ffxivcollect.com/triad/cards/422",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/383f571bacc",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 토샤나 - 헤리티지 파운드 - 300 두 빛깔 보석 (단계 4)",
          "original": "Toashana - Heritage Found - 300 Bicolor Gemstones (Rank 4)",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/422"
        }
      ]
    },
    {
      "id": 423,
      "number": "No. 407",
      "order": 407,
      "deckOrder": 39,
      "ex": false,
      "name": "카흐키와",
      "original": "Cahciua",
      "korean": true,
      "stars": 4,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 8,
        "bottom": 5,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088423_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/423.png",
      "link": "https://ffxivcollect.com/triad/cards/423",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/62687c0e58c",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 직원 PX-0027 - 리빙 메모리 - 300 두 빛깔 보석 (단계 4)",
          "original": "Clerk PX-0029 - Living Memory - 300 Bicolor Gemstones (Rank 4)",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/423"
        }
      ]
    },
    {
      "id": 424,
      "number": "No. 408",
      "order": 408,
      "deckOrder": 47,
      "ex": false,
      "name": "우크라마트",
      "original": "Wuk Lamat",
      "korean": true,
      "stars": 5,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 5,
        "bottom": 10,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088424_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/424.png",
      "link": "https://ffxivcollect.com/triad/cards/424",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6a7a72e3aac",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 3558,
          "name": "길거리 듀얼리스트: 9단계",
          "original": "Triple Team IX",
          "method": "트리플 트라이어드로 NPC 123명에게 승리",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EA%B8%B8%EA%B1%B0%EB%A6%AC%20%EB%93%80%EC%96%BC%EB%A6%AC%EC%8A%A4%ED%8A%B8%3A%209%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 425,
      "number": "No. 409",
      "order": 409,
      "deckOrder": 47,
      "ex": false,
      "name": "스펜",
      "original": "Sphene",
      "korean": true,
      "stars": 5,
      "patch": "7.0",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 10,
        "bottom": 6,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088425_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/425.png",
      "link": "https://ffxivcollect.com/triad/cards/425",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c1c2ef4afa8",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 3557,
          "name": "카드 수집가: 13단계",
          "original": "Triple-decker XIII",
          "method": "트리플 트라이어드 카드 423종류 입수",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%20%EC%88%98%EC%A7%91%EA%B0%80%3A%2013%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 421,
      "number": "No. 410",
      "order": 410,
      "deckOrder": 20,
      "ex": false,
      "name": "블랙 캣",
      "original": "Black Cat",
      "korean": true,
      "stars": 3,
      "patch": "7.01",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 3,
        "bottom": 3,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088421_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/421.png",
      "link": "https://ffxivcollect.com/triad/cards/421",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/cef60f7b29c",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 985,
          "name": "아르카디아 선수권: 라이트헤비급 1",
          "original": "AAC Light-heavyweight M1",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/b9830c3e072",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 986,
          "name": "아르카디아 선수권: 라이트헤비급(영웅) 1",
          "original": "AAC Light-heavyweight M1 (Savage)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/12d5cc71b6a",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 426,
      "number": "No. 411",
      "order": 411,
      "deckOrder": 8,
      "ex": false,
      "name": "소장 카닐로카",
      "original": "Overseer Kanilokka",
      "korean": true,
      "stars": 2,
      "patch": "7.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 4,
        "bottom": 5,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088426_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/426.png",
      "link": "https://ffxivcollect.com/triad/cards/426",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/a2010505c44",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1008,
          "name": "유웨야와타",
          "original": "Yuweyawata Field Station",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/0de18774e83",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 427,
      "number": "No. 412",
      "order": 412,
      "deckOrder": 23,
      "ex": false,
      "name": "아크 엔젤 MR",
      "original": "Ark Angel MR",
      "korean": true,
      "stars": 3,
      "patch": "7.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 8,
        "bottom": 4,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088427_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/427.png",
      "link": "https://ffxivcollect.com/triad/cards/427",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/dffc6344060",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "24,800 맨더빌 골드 소서 포인트",
          "original": "24,800 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/427"
        }
      ]
    },
    {
      "id": 428,
      "number": "No. 413",
      "order": 413,
      "deckOrder": 23,
      "ex": false,
      "name": "아크 엔젤 TT",
      "original": "Ark Angel TT",
      "korean": true,
      "stars": 3,
      "patch": "7.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 4,
        "bottom": 4,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088428_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/428.png",
      "link": "https://ffxivcollect.com/triad/cards/428",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/51204871179",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293896,
          "name": "파쿠퀘",
          "original": "Pawkukwe",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쥬노 하층",
          "link": "https://ffxivcollect.com/triad/npcs/2293896",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293896,
            "residentId": 1051946,
            "name": "파쿠퀘",
            "original": "Pawkukwe",
            "location": "쥬노 하층",
            "region": "길드마스터처럼 보이는 남자",
            "x": "6.7",
            "y": "7.1",
            "quest": {
              "name": "쥬노를 향해서",
              "original": "Jeuno",
              "link": "https://www.garlandtools.org/db/#quest/70772"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293896"
          }
        }
      ]
    },
    {
      "id": 429,
      "number": "No. 414",
      "order": 414,
      "deckOrder": 23,
      "ex": false,
      "name": "아크 엔젤 GK",
      "original": "Ark Angel GK",
      "korean": true,
      "stars": 3,
      "patch": "7.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 4,
        "bottom": 7,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088429_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/429.png",
      "link": "https://ffxivcollect.com/triad/cards/429",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/55076aac1e1",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293896,
          "name": "파쿠퀘",
          "original": "Pawkukwe",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쥬노 하층",
          "link": "https://ffxivcollect.com/triad/npcs/2293896",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293896,
            "residentId": 1051946,
            "name": "파쿠퀘",
            "original": "Pawkukwe",
            "location": "쥬노 하층",
            "region": "길드마스터처럼 보이는 남자",
            "x": "6.7",
            "y": "7.1",
            "quest": {
              "name": "쥬노를 향해서",
              "original": "Jeuno",
              "link": "https://www.garlandtools.org/db/#quest/70772"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293896"
          }
        }
      ]
    },
    {
      "id": 430,
      "number": "No. 415",
      "order": 415,
      "deckOrder": 23,
      "ex": false,
      "name": "아크 엔젤 HM",
      "original": "Ark Angel HM",
      "korean": true,
      "stars": 3,
      "patch": "7.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 4,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088430_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/430.png",
      "link": "https://ffxivcollect.com/triad/cards/430",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b239267cd8d",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293897,
          "name": "미이조",
          "original": "Miitso",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쥬노 하층",
          "link": "https://ffxivcollect.com/triad/npcs/2293897",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293897,
            "residentId": 1051947,
            "name": "미이조",
            "original": "Miitso",
            "location": "쥬노 하층",
            "region": "길드마스터처럼 보이는 남자",
            "x": "6.4",
            "y": "6.1",
            "quest": {
              "name": "쥬노를 향해서",
              "original": "Jeuno",
              "link": "https://www.garlandtools.org/db/#quest/70772"
            },
            "ruleIds": [
              6,
              11
            ],
            "rules": [
              "합산",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293897"
          }
        }
      ]
    },
    {
      "id": 431,
      "number": "No. 416",
      "order": 416,
      "deckOrder": 23,
      "ex": false,
      "name": "아크 엔젤 EV",
      "original": "Ark Angel EV",
      "korean": true,
      "stars": 3,
      "patch": "7.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 8,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088431_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/431.png",
      "link": "https://ffxivcollect.com/triad/cards/431",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d2b07781564",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293897,
          "name": "미이조",
          "original": "Miitso",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쥬노 하층",
          "link": "https://ffxivcollect.com/triad/npcs/2293897",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293897,
            "residentId": 1051947,
            "name": "미이조",
            "original": "Miitso",
            "location": "쥬노 하층",
            "region": "길드마스터처럼 보이는 남자",
            "x": "6.4",
            "y": "6.1",
            "quest": {
              "name": "쥬노를 향해서",
              "original": "Jeuno",
              "link": "https://www.garlandtools.org/db/#quest/70772"
            },
            "ruleIds": [
              6,
              11
            ],
            "rules": [
              "합산",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293897"
          }
        }
      ]
    },
    {
      "id": 432,
      "number": "No. 417",
      "order": 417,
      "deckOrder": 32,
      "ex": false,
      "name": "토크로네",
      "original": "Ttokrrone",
      "korean": true,
      "stars": 4,
      "patch": "7.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 7,
        "bottom": 7,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088432_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/432.png",
      "link": "https://ffxivcollect.com/triad/cards/432",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f05a3795556",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 미테페 - 샬로니 황야 - 300 두 빛깔 보석 (단계 4)",
          "original": "Mitepe - Shaaloani - 300 Bicolor Gemstones (Rank 4)",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/432"
        }
      ]
    },
    {
      "id": 433,
      "number": "No. 418",
      "order": 418,
      "deckOrder": 32,
      "ex": false,
      "name": "마술다람쥐 마이카",
      "original": "Mica the Magical Mu",
      "korean": true,
      "stars": 4,
      "patch": "7.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 2,
        "bottom": 9,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088433_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/433.png",
      "link": "https://ffxivcollect.com/triad/cards/433",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/83d47461e48",
      "officialExact": true,
      "sources": [
        {
          "type": "FATE",
          "typeName": "돌발임무",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "광역 무역상 직원 PX-0027 - 리빙 메모리 - 300 두 빛깔 보석 (단계 4)",
          "original": "Clerk PX-0029 - Living Memory - 300 Bicolor Gemstones (Rank 4)",
          "method": "돌발임무 보상 또는 지역 교환원에게 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/433"
        }
      ]
    },
    {
      "id": 434,
      "number": "No. 419",
      "order": 419,
      "deckOrder": 33,
      "ex": false,
      "name": "아득한 주박의 프리슈",
      "original": "Prishe of the Distant Chains",
      "korean": true,
      "stars": 4,
      "patch": "7.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 8,
        "bottom": 8,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088434_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/434.png",
      "link": "https://ffxivcollect.com/triad/cards/434",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/ea69deebb5e",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "60,000 맨더빌 골드 소서 포인트",
          "original": "60,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/434"
        }
      ]
    },
    {
      "id": 435,
      "number": "No. 420",
      "order": 420,
      "deckOrder": 41,
      "ex": false,
      "name": "어둠의 왕",
      "original": "Shadow Lord",
      "korean": true,
      "stars": 5,
      "patch": "7.1",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 10,
        "bottom": 4,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088435_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/435.png",
      "link": "https://ffxivcollect.com/triad/cards/435",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/93b44c55903",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1015,
          "name": "쥬노: 첫 번째 반향세계",
          "original": "Jeuno: The First Walk",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/d966ab55a02",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 436,
      "number": "No. 421",
      "order": 421,
      "deckOrder": 8,
      "ex": false,
      "name": "발리아 피라",
      "original": "Valia Pira",
      "korean": true,
      "stars": 2,
      "patch": "7.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 6,
        "bottom": 5,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088436_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/436.png",
      "link": "https://ffxivcollect.com/triad/cards/436",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0b0303daead",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1027,
          "name": "언더킵",
          "original": "The Underkeep",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/af3eb37f191",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 437,
      "number": "No. 422",
      "order": 422,
      "deckOrder": 31,
      "ex": false,
      "name": "올리어",
      "original": "Ollier",
      "korean": true,
      "stars": 3,
      "patch": "7.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 5,
        "bottom": 6,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088437_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/437.png",
      "link": "https://ffxivcollect.com/triad/cards/437",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8132d24d272",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293898,
          "name": "사악한 족제비",
          "original": "Malevolent Weasel",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293898",
          "region": "다날란",
          "npc": {
            "id": 2293898,
            "residentId": 1049068,
            "name": "사악한 족제비",
            "original": "Malevolent Weasel",
            "location": "골드 소서",
            "region": "다날란",
            "x": "4.6",
            "y": "6.2",
            "quest": null,
            "ruleIds": [
              6,
              9
            ],
            "rules": [
              "합산",
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293898"
          }
        }
      ]
    },
    {
      "id": 438,
      "number": "No. 423",
      "order": 423,
      "deckOrder": 32,
      "ex": false,
      "name": "젤레니아",
      "original": "Zelenia",
      "korean": true,
      "stars": 4,
      "patch": "7.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 7,
        "bottom": 7,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088438_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/438.png",
      "link": "https://ffxivcollect.com/triad/cards/438",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d8d29fc13ef",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1030,
          "name": "젤레니아 토벌전",
          "original": "Recollection",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/b80ea021025",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1031,
          "name": "극 젤레니아 토벌전",
          "original": "Recollection (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/afecec9fa18",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 439,
      "number": "No. 424",
      "order": 424,
      "deckOrder": 40,
      "ex": false,
      "name": "하울링 블레이드",
      "original": "Howling Blade",
      "korean": true,
      "stars": 5,
      "patch": "7.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 9,
        "bottom": 1,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088439_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/439.png",
      "link": "https://ffxivcollect.com/triad/cards/439",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/98150f47b43",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1025,
          "name": "아르카디아 선수권: 크루저급 4",
          "original": "AAC Cruiserweight M4",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/0a2b646f87c",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1026,
          "name": "아르카디아 선수권: 크루저급(영웅) 4",
          "original": "AAC Cruiserweight M4 (Savage)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/778f1525435",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 440,
      "number": "No. 425",
      "order": 425,
      "deckOrder": 32,
      "ex": false,
      "name": "마기타우로스",
      "original": "Magitaur",
      "korean": true,
      "stars": 4,
      "patch": "7.25",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 6,
        "bottom": 5,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088440_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/440.png",
      "link": "https://ffxivcollect.com/triad/cards/440",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b985b73e2f8",
      "officialExact": true,
      "sources": [
        {
          "type": "Occult Crescent",
          "typeName": "초승달 섬",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "포크 타워: 힘의 탑 - 최종 보스 보물상자",
          "original": "The Forked Tower: Blood - Final Boss Chest",
          "method": "초승달 섬 보상 또는 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/440"
        },
        {
          "type": "Occult Crescent",
          "typeName": "초승달 섬",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "탐사대 동전 감정사 - 초승달 섬 북부 - 3 마의 부적",
          "original": "Expedition Antiquarian - North Horn - 3 Arcane Amulets",
          "method": "초승달 섬 보상 또는 교환",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/440"
        }
      ]
    },
    {
      "id": 441,
      "number": "No. 426",
      "order": 426,
      "deckOrder": 8,
      "ex": false,
      "name": "푸른 리프킨",
      "original": "Blue Leafkin",
      "korean": true,
      "stars": 2,
      "patch": "7.25",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 5,
        "bottom": 3,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088441_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/441.png",
      "link": "https://ffxivcollect.com/triad/cards/441",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8d8ce0309d5",
      "officialExact": true,
      "sources": [
        {
          "type": "Tribal",
          "typeName": "우호부족",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "베루쟈 - 고크골마 농원 (야크텔 밀림) - 6 마무쟈 청초화 (단계 8)",
          "original": "Veerul Ja - Gok Golma (Yak T'el) - 6 Mamool Ja Nanook (Rank 8)",
          "method": "우호부족 상점에서 교환 · 표시된 우호도 필요",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/441"
        }
      ]
    },
    {
      "id": 442,
      "number": "No. 427",
      "order": 427,
      "deckOrder": 8,
      "ex": false,
      "name": "코뿔도마뱀",
      "original": "Wivre",
      "korean": true,
      "stars": 2,
      "patch": "7.25",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 2,
        "bottom": 6,
        "left": 2
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088442_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/442.png",
      "link": "https://ffxivcollect.com/triad/cards/442",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d701c814449",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293899,
          "name": "푸데쟈",
          "original": "Pudeel Ja",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "야크텔 밀림",
          "link": "https://ffxivcollect.com/triad/npcs/2293899",
          "region": "요카 투랄",
          "npc": {
            "id": 2293899,
            "residentId": 1054148,
            "name": "푸데쟈",
            "original": "Pudeel Ja",
            "location": "야크텔 밀림",
            "region": "요카 투랄",
            "x": "33.2",
            "y": "36.5",
            "quest": {
              "name": " 마무쟈족의 사랑하는 고향",
              "original": "The Pride of Mamook",
              "link": "https://www.garlandtools.org/db/#quest/70796"
            },
            "ruleIds": [
              4,
              12
            ],
            "rules": [
              "동수",
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293899"
          }
        }
      ]
    },
    {
      "id": 443,
      "number": "No. 428",
      "order": 428,
      "deckOrder": 24,
      "ex": false,
      "name": "도프로족",
      "original": "Doppro",
      "korean": true,
      "stars": 3,
      "patch": "7.25",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 2,
        "right": 7,
        "bottom": 4,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088443_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/443.png",
      "link": "https://ffxivcollect.com/triad/cards/443",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/cf63b6a4c61",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293899,
          "name": "푸데쟈",
          "original": "Pudeel Ja",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "야크텔 밀림",
          "link": "https://ffxivcollect.com/triad/npcs/2293899",
          "region": "요카 투랄",
          "npc": {
            "id": 2293899,
            "residentId": 1054148,
            "name": "푸데쟈",
            "original": "Pudeel Ja",
            "location": "야크텔 밀림",
            "region": "요카 투랄",
            "x": "33.2",
            "y": "36.5",
            "quest": {
              "name": " 마무쟈족의 사랑하는 고향",
              "original": "The Pride of Mamook",
              "link": "https://www.garlandtools.org/db/#quest/70796"
            },
            "ruleIds": [
              4,
              12
            ],
            "rules": [
              "동수",
              "유형 강화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293899"
          }
        }
      ]
    },
    {
      "id": 445,
      "number": "No. 429",
      "order": 429,
      "deckOrder": 20,
      "ex": false,
      "name": "어느 사람들의 기억",
      "original": "Immortal Remains",
      "korean": true,
      "stars": 3,
      "patch": "7.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 4,
        "bottom": 7,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088445_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/445.png",
      "link": "https://ffxivcollect.com/triad/cards/445",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/25d77ea2711",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1028,
          "name": "메인 터미널",
          "original": "The Meso Terminal",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/97c1c8e073e",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 446,
      "number": "No. 430",
      "order": 430,
      "deckOrder": 23,
      "ex": false,
      "name": "캄라나트",
      "original": "Kam'lanaut",
      "korean": true,
      "stars": 3,
      "patch": "7.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 8,
        "bottom": 2,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088446_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/446.png",
      "link": "https://ffxivcollect.com/triad/cards/446",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b5e9ad3e7bd",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293900,
          "name": "흄족 흑마도사",
          "original": "Hume Black Mage",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쥬노 하층",
          "link": "https://ffxivcollect.com/triad/npcs/2293900",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293900,
            "residentId": 1054320,
            "name": "흄족 흑마도사",
            "original": "Hume Black Mage",
            "location": "쥬노 하층",
            "region": "길드마스터처럼 보이는 남자",
            "x": "5.5",
            "y": "5.7",
            "quest": {
              "name": "이 세계에서 그대는 무엇을 바라는가?",
              "original": "Apocalypse Nigh",
              "link": "https://www.garlandtools.org/db/#quest/70865"
            },
            "ruleIds": [
              4,
              9
            ],
            "rules": [
              "동수",
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293900"
          }
        }
      ]
    },
    {
      "id": 447,
      "number": "No. 431",
      "order": 431,
      "deckOrder": 33,
      "ex": false,
      "name": "엘드나슈",
      "original": "Eald'narche",
      "korean": true,
      "stars": 4,
      "patch": "7.3",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 6,
        "bottom": 8,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088447_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/447.png",
      "link": "https://ffxivcollect.com/triad/cards/447",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/659ade9b15d",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1058,
          "name": "산도리아: 두 번째 반향세계",
          "original": "San d'Oria: The Second Walk",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/a8dda42d624",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 448,
      "number": "No. 432",
      "order": 432,
      "deckOrder": 35,
      "ex": false,
      "name": "영원한 어둠",
      "original": "Necron",
      "korean": true,
      "stars": 4,
      "patch": "7.3",
      "typeId": 1,
      "type": "야만신",
      "stats": {
        "top": 5,
        "right": 9,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088448_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/448.png",
      "link": "https://ffxivcollect.com/triad/cards/448",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/884acb50ed1",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1061,
          "name": "영원한 어둠 토벌전",
          "original": "The Ageless Necropolis",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/975d83e5b41",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1062,
          "name": "극 영원한 어둠 토벌전",
          "original": "The Minstrel's Ballad: Necron's Embrace",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/ec052ed4f4f",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 449,
      "number": "No. 433",
      "order": 433,
      "deckOrder": 16,
      "ex": false,
      "name": "파워 로더",
      "original": "Vacuum Suit",
      "korean": true,
      "stars": 2,
      "patch": "7.31",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 2,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088449_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/449.png",
      "link": "https://ffxivcollect.com/triad/cards/449",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/dcf6f6372a1",
      "officialExact": true,
      "sources": [
        {
          "type": "Cosmic Exploration",
          "typeName": "우주 개척",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "메주에동크 - 4,000 우주 화폐",
          "original": "Mesouaidonque - 4,000 Cosmocredits",
          "method": "우주 개척 교환 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/449"
        }
      ]
    },
    {
      "id": 450,
      "number": "No. 434",
      "order": 434,
      "deckOrder": 31,
      "ex": false,
      "name": "네이밍웨이",
      "original": "Namingway",
      "korean": true,
      "stars": 3,
      "patch": "7.31",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 4,
        "bottom": 3,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088450_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/450.png",
      "link": "https://ffxivcollect.com/triad/cards/450",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/383b608c660",
      "officialExact": true,
      "sources": [
        {
          "type": "Cosmic Exploration",
          "typeName": "우주 개척",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "메주에동크 - 6,000 우주 화폐",
          "original": "Mesouaidonque - 6,000 Cosmocredits",
          "method": "우주 개척 교환 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/450"
        }
      ]
    },
    {
      "id": 451,
      "number": "No. 435",
      "order": 435,
      "deckOrder": 8,
      "ex": false,
      "name": "로로 테",
      "original": "Rorrlo Teh",
      "korean": true,
      "stars": 2,
      "patch": "7.35",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 6,
        "bottom": 5,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088451_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/451.png",
      "link": "https://ffxivcollect.com/triad/cards/451",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/918e13d0731",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293901,
          "name": "토코주",
          "original": "Tokorzur",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "지고테 제단",
          "link": "https://ffxivcollect.com/triad/npcs/2293901",
          "region": "요카 투랄",
          "npc": {
            "id": 2293901,
            "residentId": 1054991,
            "name": "토코주",
            "original": "Tokorzur",
            "location": "지고테 제단",
            "region": "요카 투랄",
            "x": "8.0",
            "y": "4.4",
            "quest": {
              "name": " 말을 거는 눈요정",
              "original": "With High Spirits",
              "link": "https://www.garlandtools.org/db/#quest/70871"
            },
            "ruleIds": [
              4,
              6
            ],
            "rules": [
              "동수",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293901"
          }
        }
      ]
    },
    {
      "id": 452,
      "number": "No. 436",
      "order": 436,
      "deckOrder": 8,
      "ex": false,
      "name": "꽃인간",
      "original": "Ornamental Leafman",
      "korean": true,
      "stars": 2,
      "patch": "7.35",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 2,
        "right": 6,
        "bottom": 6,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088452_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/452.png",
      "link": "https://ffxivcollect.com/triad/cards/452",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/7782643a0b9",
      "officialExact": true,
      "sources": [
        {
          "type": "Deep Dungeon",
          "typeName": "딥 던전",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "노르브란트 순례길 - 은빛 보물 자루",
          "original": "Pilgrim's Traverse - Silver Sack",
          "method": "딥 던전의 숨겨진 보물 감정 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/452"
        }
      ]
    },
    {
      "id": 453,
      "number": "No. 437",
      "order": 437,
      "deckOrder": 24,
      "ex": false,
      "name": "파라파",
      "original": "Fahrafahr",
      "korean": true,
      "stars": 3,
      "patch": "7.35",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 8,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088453_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/453.png",
      "link": "https://ffxivcollect.com/triad/cards/453",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/29c8379861c",
      "officialExact": true,
      "sources": [
        {
          "type": "Tribal",
          "typeName": "우호부족",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "라코고 - 눈지기의 돌방 (오르코 파차) - 8 요카후이 찰갑편 (단계 8)",
          "original": "Rarkorgor - Shelter (Urqopacha) - 8 Yok Huy Wards (Rank 8)",
          "method": "우호부족 상점에서 교환 · 표시된 우호도 필요",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/453"
        }
      ]
    },
    {
      "id": 454,
      "number": "No. 438",
      "order": 438,
      "deckOrder": 44,
      "ex": false,
      "name": "쿠루루(황금)",
      "original": "Dawntrail Krile",
      "korean": true,
      "stars": 5,
      "patch": "7.35",
      "typeId": 2,
      "type": "새벽",
      "stats": {
        "top": 2,
        "right": 8,
        "bottom": 10,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088454_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/454.png",
      "link": "https://ffxivcollect.com/triad/cards/454",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/db80526d9d3",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 3820,
          "name": "카드 수집가: 14단계",
          "original": "Triple-decker XIV",
          "method": "트리플 트라이어드 카드 451종류 입수",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%20%EC%88%98%EC%A7%91%EA%B0%80%3A%2014%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 455,
      "number": "No. 439",
      "order": 439,
      "deckOrder": 20,
      "ex": false,
      "name": "번개 그리폰",
      "original": "Thundergust Griffin",
      "korean": true,
      "stars": 3,
      "patch": "7.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 7,
        "bottom": 5,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088455_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/455.png",
      "link": "https://ffxivcollect.com/triad/cards/455",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/507d4f9147d",
      "officialExact": true,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1064,
          "name": "안개여로",
          "original": "Mistwake",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/e60e156423a",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 456,
      "number": "No. 440",
      "order": 440,
      "deckOrder": 32,
      "ex": false,
      "name": "글라시아 라볼라스",
      "original": "Doomtrain",
      "korean": true,
      "stars": 4,
      "patch": "7.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 8,
        "bottom": 7,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088456_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/456.png",
      "link": "https://ffxivcollect.com/triad/cards/456",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/acdcb524ceb",
      "officialExact": true,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1076,
          "name": "글라시아 라볼라스 토벌전",
          "original": "Hell on Rails",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/c352dd60d71",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1077,
          "name": "극 글라시아 라볼라스 토벌전",
          "original": "Hell on Rails (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/2e80f652c99",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 457,
      "number": "No. 441",
      "order": 441,
      "deckOrder": 40,
      "ex": false,
      "name": "린드블룸",
      "original": "Lindwurm",
      "korean": true,
      "stars": 5,
      "patch": "7.4",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 7,
        "bottom": 8,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088457_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/457.png",
      "link": "https://ffxivcollect.com/triad/cards/457",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/6cbd5b79a21",
      "officialExact": true,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1074,
          "name": "아르카디아 선수권: 헤비급 4",
          "original": "AAC Heavyweight M4",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/c9c0643eb85",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1075,
          "name": "아르카디아 선수권: 헤비급(영웅) 4",
          "original": "AAC Heavyweight M4 (Savage)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/548016adc67",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 458,
      "number": "No. 442",
      "order": 442,
      "deckOrder": 16,
      "ex": false,
      "name": "우주 달멜",
      "original": "Interstellar Dhalmel",
      "korean": true,
      "stars": 2,
      "patch": "7.41",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 4,
        "bottom": 4,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088458_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/458.png",
      "link": "https://ffxivcollect.com/triad/cards/458",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/c163f9a93d6",
      "officialExact": true,
      "sources": [
        {
          "type": "Cosmic Exploration",
          "typeName": "우주 개척",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "메주에동크 - 4,000 우주 화폐",
          "original": "Mesouaidonque - 4,000 Cosmocredits",
          "method": "우주 개척 교환 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/458"
        }
      ]
    },
    {
      "id": 459,
      "number": "No. 443",
      "order": 443,
      "deckOrder": 8,
      "ex": false,
      "name": "괴조 루흐",
      "original": "Rukhkh",
      "korean": true,
      "stars": 2,
      "patch": "7.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 7,
        "bottom": 2,
        "left": 3
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088459_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/459.png",
      "link": "https://ffxivcollect.com/triad/cards/459",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/287b3e6cb07",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293902,
          "name": "카말부제르",
          "original": "Camalbusert",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "올드 샬레이안",
          "link": "https://ffxivcollect.com/triad/npcs/2293902",
          "region": "북해 지역",
          "npc": {
            "id": 2293902,
            "residentId": 1056463,
            "name": "카말부제르",
            "original": "Camalbusert",
            "location": "올드 샬레이안",
            "region": "북해 지역",
            "x": "14.6",
            "y": "11.1",
            "quest": {
              "name": "푸른색 책이 들려주는 모험담",
              "original": "A Spellbinding Read",
              "link": "https://www.garlandtools.org/db/#quest/70977"
            },
            "ruleIds": [
              11,
              14
            ],
            "rules": [
              "에이스 약화",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293902"
          }
        }
      ]
    },
    {
      "id": 460,
      "number": "No. 444",
      "order": 444,
      "deckOrder": 8,
      "ex": false,
      "name": "램프의 정령",
      "original": "Genie of the Lamp",
      "korean": true,
      "stars": 2,
      "patch": "7.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 2,
        "bottom": 7,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088460_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/460.png",
      "link": "https://ffxivcollect.com/triad/cards/460",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/55e94f54766",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293902,
          "name": "카말부제르",
          "original": "Camalbusert",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "올드 샬레이안",
          "link": "https://ffxivcollect.com/triad/npcs/2293902",
          "region": "북해 지역",
          "npc": {
            "id": 2293902,
            "residentId": 1056463,
            "name": "카말부제르",
            "original": "Camalbusert",
            "location": "올드 샬레이안",
            "region": "북해 지역",
            "x": "14.6",
            "y": "11.1",
            "quest": {
              "name": "푸른색 책이 들려주는 모험담",
              "original": "A Spellbinding Read",
              "link": "https://www.garlandtools.org/db/#quest/70977"
            },
            "ruleIds": [
              11,
              14
            ],
            "rules": [
              "에이스 약화",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293902"
          }
        }
      ]
    },
    {
      "id": 461,
      "number": "No. 445",
      "order": 445,
      "deckOrder": 20,
      "ex": false,
      "name": "불요정 페리",
      "original": "Pari of Plenty",
      "korean": true,
      "stars": 3,
      "patch": "7.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 4,
        "bottom": 6,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088461_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/461.png",
      "link": "https://ffxivcollect.com/triad/cards/461",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/b4ebdc92318",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1066,
          "name": "변형 던전: 상인 이야기",
          "original": "*The Merchant's Tale*",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%83%81%EC%9D%B8%20%EC%9D%B4%EC%95%BC%EA%B8%B0",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 462,
      "number": "No. 446",
      "order": 446,
      "deckOrder": 20,
      "ex": false,
      "name": "인어 다르야",
      "original": "Darya the Sea-maid",
      "korean": true,
      "stars": 3,
      "patch": "7.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 5,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088462_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/462.png",
      "link": "https://ffxivcollect.com/triad/cards/462",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/21702977f90",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1066,
          "name": "변형 던전: 상인 이야기",
          "original": "*The Merchant's Tale*",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%83%81%EC%9D%B8%20%EC%9D%B4%EC%95%BC%EA%B8%B0",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 463,
      "number": "No. 447",
      "order": 447,
      "deckOrder": 20,
      "ex": false,
      "name": "소드마스터",
      "original": "Lone Swordmaster",
      "korean": true,
      "stars": 3,
      "patch": "7.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 7,
        "bottom": 4,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088463_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/463.png",
      "link": "https://ffxivcollect.com/triad/cards/463",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/492712c5726",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1066,
          "name": "변형 던전: 상인 이야기",
          "original": "*The Merchant's Tale*",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%83%81%EC%9D%B8%20%EC%9D%B4%EC%95%BC%EA%B8%B0",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 464,
      "number": "No. 448",
      "order": 448,
      "deckOrder": 32,
      "ex": false,
      "name": "단단",
      "original": "Deadly Dandan",
      "korean": true,
      "stars": 4,
      "patch": "7.45",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 6,
        "bottom": 6,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088464_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/464.png",
      "link": "https://ffxivcollect.com/triad/cards/464",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/bf34985be06",
      "officialExact": true,
      "sources": [
        {
          "type": "V&C Dungeon",
          "typeName": "변형·파생 던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1066,
          "name": "변형 던전: 상인 이야기",
          "original": "*The Merchant's Tale*",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%B3%80%ED%98%95%20%EB%8D%98%EC%A0%84%3A%20%EC%83%81%EC%9D%B8%20%EC%9D%B4%EC%95%BC%EA%B8%B0",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 465,
      "number": "No. 449",
      "order": 449,
      "deckOrder": 31,
      "ex": false,
      "name": "니토위퀘",
      "original": "Nitowikwe",
      "korean": true,
      "stars": 3,
      "patch": "7.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 4,
        "bottom": 8,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088465_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/465.png",
      "link": "https://ffxivcollect.com/triad/cards/465",
      "official": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%3A%20%EB%8B%88%ED%86%A0%EC%9C%84%ED%80%98",
      "officialExact": false,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "36,000 맨더빌 골드 소서 포인트",
          "original": "36,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/465"
        }
      ]
    },
    {
      "id": 466,
      "number": "No. 450",
      "order": 450,
      "deckOrder": 31,
      "ex": false,
      "name": "율루스 피르 노르바누스",
      "original": "Jullus pyr Norbanus",
      "korean": true,
      "stars": 3,
      "patch": "7.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 7,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088466_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/466.png",
      "link": "https://ffxivcollect.com/triad/cards/466",
      "official": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%3A%20%EC%9C%A8%EB%A3%A8%EC%8A%A4%20%ED%94%BC%EB%A5%B4%20%EB%85%B8%EB%A5%B4%EB%B0%94%EB%88%84%EC%8A%A4",
      "officialExact": false,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "24,000 맨더빌 골드 소서 포인트",
          "original": "24,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/466"
        }
      ]
    },
    {
      "id": 467,
      "number": "No. 451",
      "order": 451,
      "deckOrder": 31,
      "ex": false,
      "name": "제로",
      "original": "Zero",
      "korean": true,
      "stars": 3,
      "patch": "7.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 6,
        "bottom": 3,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088467_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/467.png",
      "link": "https://ffxivcollect.com/triad/cards/467",
      "official": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%3A%20%EC%A0%9C%EB%A1%9C",
      "officialExact": false,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "32,000 맨더빌 골드 소서 포인트",
          "original": "32,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/467"
        }
      ]
    },
    {
      "id": 468,
      "number": "No. 452",
      "order": 452,
      "deckOrder": 20,
      "ex": false,
      "name": "말파스",
      "original": "Malphas",
      "korean": true,
      "stars": 3,
      "patch": "7.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 6,
        "bottom": 7,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088468_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/468.png",
      "link": "https://ffxivcollect.com/triad/cards/468",
      "official": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%3A%20%EB%A7%90%ED%8C%8C%EC%8A%A4",
      "officialExact": false,
      "sources": [
        {
          "type": "Dungeon",
          "typeName": "던전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1011,
          "name": "클리테우스 마도 공장",
          "original": "The Clyteum",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/941e2187bf5",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 469,
      "number": "No. 453",
      "order": 453,
      "deckOrder": 23,
      "ex": false,
      "name": "악마 샨토토",
      "original": "Shantotto the Demon",
      "korean": true,
      "stars": 3,
      "patch": "7.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 5,
        "bottom": 5,
        "left": 6
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088469_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/469.png",
      "link": "https://ffxivcollect.com/triad/cards/469",
      "official": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%3A%20%EC%95%85%EB%A7%88%20%EC%83%A8%ED%86%A0%ED%86%A0",
      "officialExact": false,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293903,
          "name": "흄족 도적",
          "original": "Hume Thief",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쥬노 하층",
          "link": "https://ffxivcollect.com/triad/npcs/2293903",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293903,
            "residentId": 1058928,
            "name": "흄족 도적",
            "original": "Hume Thief",
            "location": "쥬노 하층",
            "region": "길드마스터처럼 보이는 남자",
            "x": "6.4",
            "y": "6.9",
            "quest": {
              "name": "머나먼 약속",
              "original": "Distant Promises",
              "link": "https://www.garlandtools.org/db/#quest/71016"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293903"
          }
        }
      ]
    },
    {
      "id": 470,
      "number": "No. 454",
      "order": 454,
      "deckOrder": 23,
      "ex": false,
      "name": "부활한 알렉산더",
      "original": "Alexander Resurrected",
      "korean": true,
      "stars": 3,
      "patch": "7.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 4,
        "bottom": 5,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088470_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/470.png",
      "link": "https://ffxivcollect.com/triad/cards/470",
      "official": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%3A%20%EB%B6%80%ED%99%9C%ED%95%9C%20%EC%95%8C%EB%A0%89%EC%82%B0%EB%8D%94",
      "officialExact": false,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293903,
          "name": "흄족 도적",
          "original": "Hume Thief",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쥬노 하층",
          "link": "https://ffxivcollect.com/triad/npcs/2293903",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293903,
            "residentId": 1058928,
            "name": "흄족 도적",
            "original": "Hume Thief",
            "location": "쥬노 하층",
            "region": "길드마스터처럼 보이는 남자",
            "x": "6.4",
            "y": "6.9",
            "quest": {
              "name": "머나먼 약속",
              "original": "Distant Promises",
              "link": "https://www.garlandtools.org/db/#quest/71016"
            },
            "ruleIds": [
              4,
              14
            ],
            "rules": [
              "동수",
              "카드 교환"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293903"
          }
        }
      ]
    },
    {
      "id": 444,
      "number": "No. 455",
      "order": 455,
      "deckOrder": 39,
      "ex": false,
      "name": "킹 엘머",
      "original": "King Elmer III",
      "korean": true,
      "stars": 4,
      "patch": "7.2",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 4,
        "bottom": 7,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088444_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/444.png",
      "link": "https://ffxivcollect.com/triad/cards/444",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/1b52afa91c1",
      "officialExact": true,
      "sources": [
        {
          "type": "Event",
          "typeName": "기간 한정 이벤트",
          "group": "other",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 소서 축제 (2025, 기간 한정)",
          "original": "The Make It Rain Campaign (2025)",
          "method": "해당 기간 한정 이벤트 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/444"
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "48,000 맨더빌 골드 소서 포인트",
          "original": "48,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/444"
        }
      ]
    },
    {
      "id": 471,
      "number": "No. 456",
      "order": 456,
      "deckOrder": 32,
      "ex": false,
      "name": "에누오",
      "original": "Enuo",
      "korean": true,
      "stars": 4,
      "patch": "7.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 7,
        "bottom": 8,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088471_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/471.png",
      "link": "https://ffxivcollect.com/triad/cards/471",
      "official": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%3A%20%EC%97%90%EB%88%84%EC%98%A4",
      "officialExact": false,
      "sources": [
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1115,
          "name": "에누오 토벌전",
          "original": "The Unmaking",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/2c82e3130e1",
          "linkLabel": "공식 임무 안내"
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1116,
          "name": "극 에누오 토벌전",
          "original": "The Unmaking (Extreme)",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/b6c80b13c51",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 472,
      "number": "No. 457",
      "order": 457,
      "deckOrder": 33,
      "ex": false,
      "name": "프로마시아",
      "original": "Promathia",
      "korean": true,
      "stars": 4,
      "patch": "7.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 3,
        "bottom": 6,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088472_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/472.png",
      "link": "https://ffxivcollect.com/triad/cards/472",
      "official": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%3A%20%ED%94%84%EB%A1%9C%EB%A7%88%EC%8B%9C%EC%95%84",
      "officialExact": false,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293904,
          "name": "엘반족 적마도사",
          "original": "Elvaan Red Mage",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "쥬노 하층",
          "link": "https://ffxivcollect.com/triad/npcs/2293904",
          "region": "길드마스터처럼 보이는 남자",
          "npc": {
            "id": 2293904,
            "residentId": 1058929,
            "name": "엘반족 적마도사",
            "original": "Elvaan Red Mage",
            "location": "쥬노 하층",
            "region": "길드마스터처럼 보이는 남자",
            "x": "6.7",
            "y": "6.3",
            "quest": {
              "name": "머나먼 약속",
              "original": "Distant Promises",
              "link": "https://www.garlandtools.org/db/#quest/71016"
            },
            "ruleIds": [
              6,
              9
            ],
            "rules": [
              "합산",
              "무작위 순서"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293904"
          }
        }
      ]
    },
    {
      "id": 473,
      "number": "No. 458",
      "order": 458,
      "deckOrder": 41,
      "ex": false,
      "name": "신룡(바나딜)",
      "original": "Shinryu (Vana'diel)",
      "korean": true,
      "stars": 5,
      "patch": "7.5",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 6,
        "bottom": 3,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088473_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/473.png",
      "link": "https://ffxivcollect.com/triad/cards/473",
      "official": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%3A%20%EC%8B%A0%EB%A3%A1(%EB%B0%94%EB%82%98%EB%94%9C)",
      "officialExact": false,
      "sources": [
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 1117,
          "name": "윈더스: 세 번째 반향세계",
          "original": "Windurst: The Third Walk",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/82362c7fc16",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 474,
      "number": "No. 459",
      "order": 459,
      "deckOrder": 16,
      "ex": false,
      "name": "개량형 우주 무장 병기",
      "original": "Cosmic Armored Weapon Beta",
      "korean": true,
      "stars": 2,
      "patch": "7.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 3,
        "right": 6,
        "bottom": 6,
        "left": 4
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088474_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/474.png",
      "link": "https://ffxivcollect.com/triad/cards/474",
      "official": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%3A%20%EA%B0%9C%EB%9F%89%ED%98%95%20%EC%9A%B0%EC%A3%BC%20%EB%AC%B4%EC%9E%A5%20%EB%B3%91%EA%B8%B0",
      "officialExact": false,
      "sources": [
        {
          "type": "Cosmic Exploration",
          "typeName": "우주 개척",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "메주에동크 - 4,000 우주 화폐",
          "original": "Mesouaidonque - 4,000 Cosmocredits",
          "method": "우주 개척 교환 보상",
          "location": "",
          "link": "https://ffxivcollect.com/triad/cards/474"
        }
      ]
    },
    {
      "id": 475,
      "number": "No. 460",
      "order": 460,
      "deckOrder": 24,
      "ex": false,
      "name": "티소쟈",
      "original": "Tiisol Ja",
      "korean": true,
      "stars": 3,
      "patch": "7.51",
      "typeId": 3,
      "type": "수인",
      "stats": {
        "top": 5,
        "right": 6,
        "bottom": 6,
        "left": 7
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088475_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/475.png",
      "link": "https://ffxivcollect.com/triad/cards/475",
      "official": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%B9%B4%EB%93%9C%3A%20%ED%8B%B0%EC%86%8C%EC%9F%88",
      "officialExact": false,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293905,
          "name": "시사쟈",
          "original": "Xiisal Ja",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "툴라이욜라",
          "link": "https://ffxivcollect.com/triad/npcs/2293905",
          "region": "요카 투랄",
          "npc": {
            "id": 2293905,
            "residentId": 1058534,
            "name": "시사쟈",
            "original": "Xiisal Ja",
            "location": "툴라이욜라",
            "region": "요카 투랄",
            "x": "14.6",
            "y": "11.4",
            "quest": {
              "name": "2호점, 개점!",
              "original": "A Dream Realized",
              "link": "https://www.garlandtools.org/db/#quest/70997"
            },
            "ruleIds": [
              1,
              6
            ],
            "rules": [
              "무작위 규칙",
              "합산"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293905"
          }
        }
      ]
    },
    {
      "id": 68,
      "number": "Ex. 1",
      "order": 1,
      "deckOrder": 48,
      "ex": true,
      "name": "빛의 전사",
      "original": "Warrior of Light",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 2,
        "bottom": 5,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088068_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/68.png",
      "link": "https://ffxivcollect.com/triad/cards/68",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8654dac1111",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        }
      ]
    },
    {
      "id": 69,
      "number": "Ex. 2",
      "order": 2,
      "deckOrder": 48,
      "ex": true,
      "name": "프리오닐",
      "original": "Firion",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 5,
        "bottom": 10,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088069_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/69.png",
      "link": "https://ffxivcollect.com/triad/cards/69",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/efa4a4cbce2",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "트리플 트라이어드 대회",
          "original": "Triple Triad Tournament",
          "method": "트리플 트라이어드 대회 보상",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/69"
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "플래티넘 트라이어드 팩",
          "original": "Platinum Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#5",
          "pack": {
            "id": 5,
            "name": "플래티넘 트라이어드 팩",
            "cost": 0,
            "link": "https://ffxivcollect.com/triad/packs#5"
          }
        }
      ]
    },
    {
      "id": 70,
      "number": "Ex. 3",
      "order": 3,
      "deckOrder": 48,
      "ex": true,
      "name": "양파 기사",
      "original": "Onion Knight",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 8,
        "right": 2,
        "bottom": 8,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088070_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/70.png",
      "link": "https://ffxivcollect.com/triad/cards/70",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/9f4c0b82627",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293811,
          "name": "르웨나",
          "original": "Lewena",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293811",
          "region": "다날란",
          "npc": {
            "id": 2293811,
            "residentId": 1011145,
            "name": "르웨나",
            "original": "Lewena",
            "location": "골드 소서",
            "region": "다날란",
            "x": "4.8",
            "y": "6.1",
            "quest": null,
            "ruleIds": [
              9,
              11
            ],
            "rules": [
              "무작위 순서",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293811"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "미스라이트 트라이어드 팩",
          "original": "Mythril Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#4",
          "pack": {
            "id": 4,
            "name": "미스라이트 트라이어드 팩",
            "cost": 8000,
            "link": "https://ffxivcollect.com/triad/packs#4"
          }
        },
        {
          "type": "Raid",
          "typeName": "레이드",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 111,
          "name": "크리스탈 타워: 어둠의 세계",
          "original": "The World of Darkness",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/a70105d73ff",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 71,
      "number": "Ex. 4",
      "order": 4,
      "deckOrder": 48,
      "ex": true,
      "name": "세실 하비",
      "original": "Cecil Harvey",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 10,
        "bottom": 4,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088071_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/71.png",
      "link": "https://ffxivcollect.com/triad/cards/71",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/cafe35b0130",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "트리플 트라이어드 대회",
          "original": "Triple Triad Tournament",
          "method": "트리플 트라이어드 대회 보상",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/71"
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "플래티넘 트라이어드 팩",
          "original": "Platinum Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#5",
          "pack": {
            "id": 5,
            "name": "플래티넘 트라이어드 팩",
            "cost": 0,
            "link": "https://ffxivcollect.com/triad/packs#5"
          }
        }
      ]
    },
    {
      "id": 72,
      "number": "Ex. 5",
      "order": 5,
      "deckOrder": 48,
      "ex": true,
      "name": "바츠 클라우저",
      "original": "Bartz Klauser",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 4,
        "bottom": 10,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088072_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/72.png",
      "link": "https://ffxivcollect.com/triad/cards/72",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/8656dea1f9c",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293811,
          "name": "르웨나",
          "original": "Lewena",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293811",
          "region": "다날란",
          "npc": {
            "id": 2293811,
            "residentId": 1011145,
            "name": "르웨나",
            "original": "Lewena",
            "location": "골드 소서",
            "region": "다날란",
            "x": "4.8",
            "y": "6.1",
            "quest": null,
            "ruleIds": [
              9,
              11
            ],
            "rules": [
              "무작위 순서",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293811"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "미스라이트 트라이어드 팩",
          "original": "Mythril Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#4",
          "pack": {
            "id": 4,
            "name": "미스라이트 트라이어드 팩",
            "cost": 8000,
            "link": "https://ffxivcollect.com/triad/packs#4"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 85,
          "name": "진 길가메시 토벌전",
          "original": "Battle in the Big Keep",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/ff94bc7e233",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 73,
      "number": "Ex. 6",
      "order": 6,
      "deckOrder": 48,
      "ex": true,
      "name": "티나 브랜포드",
      "original": "Terra Branford",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 10,
        "bottom": 2,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088073_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/73.png",
      "link": "https://ffxivcollect.com/triad/cards/73",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/29aacd936cf",
      "officialExact": true,
      "sources": [
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293811,
          "name": "르웨나",
          "original": "Lewena",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/npcs/2293811",
          "region": "다날란",
          "npc": {
            "id": 2293811,
            "residentId": 1011145,
            "name": "르웨나",
            "original": "Lewena",
            "location": "골드 소서",
            "region": "다날란",
            "x": "4.8",
            "y": "6.1",
            "quest": null,
            "ruleIds": [
              9,
              11
            ],
            "rules": [
              "무작위 순서",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293811"
          }
        },
        {
          "type": "NPC",
          "typeName": "NPC 대결",
          "group": "npc",
          "relatedType": "NPC",
          "relatedId": 2293824,
          "name": "카드 대결장 관리자",
          "original": "Hall Overseer",
          "method": "NPC와 카드 대결을 해 보상으로 획득",
          "location": "카드 대결장",
          "link": "https://ffxivcollect.com/triad/npcs/2293824",
          "region": "다날란",
          "npc": {
            "id": 2293824,
            "residentId": 1016295,
            "name": "카드 대결장 관리자",
            "original": "Hall Overseer",
            "location": "카드 대결장",
            "region": "다날란",
            "x": "3.6",
            "y": "3.6",
            "quest": null,
            "ruleIds": [
              9,
              11
            ],
            "rules": [
              "무작위 순서",
              "에이스 약화"
            ],
            "link": "https://ffxivcollect.com/triad/npcs/2293824"
          }
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "미스라이트 트라이어드 팩",
          "original": "Mythril Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#4",
          "pack": {
            "id": 4,
            "name": "미스라이트 트라이어드 팩",
            "cost": 8000,
            "link": "https://ffxivcollect.com/triad/packs#4"
          }
        },
        {
          "type": "Trial",
          "typeName": "토벌전",
          "group": "duty",
          "relatedType": "Instance",
          "relatedId": 81,
          "name": "아마지나배 투기대회 결승전",
          "original": "The Dragon's Neck",
          "method": "해당 임무의 보상으로 획득",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/db/duty/467a02c57b3",
          "linkLabel": "공식 임무 안내"
        }
      ]
    },
    {
      "id": 74,
      "number": "Ex. 7",
      "order": 7,
      "deckOrder": 48,
      "ex": true,
      "name": "클라우드 스트라이프",
      "original": "Cloud Strife",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 3,
        "bottom": 9,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088074_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/74.png",
      "link": "https://ffxivcollect.com/triad/cards/74",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/d7a44a87ffa",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "1,000,000 맨더빌 골드 소서 포인트",
          "original": "1,000,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/74"
        }
      ]
    },
    {
      "id": 75,
      "number": "Ex. 8",
      "order": 8,
      "deckOrder": 48,
      "ex": true,
      "name": "스콜 레온하트",
      "original": "Squall Leonhart",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 6,
        "right": 10,
        "bottom": 10,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088075_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/75.png",
      "link": "https://ffxivcollect.com/triad/cards/75",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/0b51ae7cf81",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 1104,
          "name": "길거리 듀얼리스트: 2단계",
          "original": "Triple Team II",
          "method": "트리플 트라이어드로 NPC 30명에게 승리",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EA%B8%B8%EA%B1%B0%EB%A6%AC%20%EB%93%80%EC%96%BC%EB%A6%AC%EC%8A%A4%ED%8A%B8%3A%202%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 76,
      "number": "Ex. 9",
      "order": 9,
      "deckOrder": 48,
      "ex": true,
      "name": "지탄 트라이벌",
      "original": "Zidane Tribal",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 5,
        "right": 10,
        "bottom": 6,
        "left": 8
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088076_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/76.png",
      "link": "https://ffxivcollect.com/triad/cards/76",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/41a31925a6e",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "골드 트라이어드 팩",
          "original": "Gold Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#3",
          "pack": {
            "id": 3,
            "name": "골드 트라이어드 팩",
            "cost": 2160,
            "link": "https://ffxivcollect.com/triad/packs#3"
          }
        }
      ]
    },
    {
      "id": 77,
      "number": "Ex. 10",
      "order": 10,
      "deckOrder": 48,
      "ex": true,
      "name": "티다",
      "original": "Tidus",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 7,
        "bottom": 1,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088077_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/77.png",
      "link": "https://ffxivcollect.com/triad/cards/77",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/2c82b23dc5c",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "트리플 트라이어드 대회",
          "original": "Triple Triad Tournament",
          "method": "트리플 트라이어드 대회 보상",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/77"
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "플래티넘 트라이어드 팩",
          "original": "Platinum Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#5",
          "pack": {
            "id": 5,
            "name": "플래티넘 트라이어드 팩",
            "cost": 0,
            "link": "https://ffxivcollect.com/triad/packs#5"
          }
        }
      ]
    },
    {
      "id": 78,
      "number": "Ex. 11",
      "order": 11,
      "deckOrder": 48,
      "ex": true,
      "name": "샨토토",
      "original": "Shantotto",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 4,
        "right": 9,
        "bottom": 7,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088078_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/78.png",
      "link": "https://ffxivcollect.com/triad/cards/78",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/f6aa9909f9a",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 1113,
          "name": "대회의 승리자: 3단계",
          "original": "Kumite Kumite Kumite",
          "method": "트리플 트라이어드 대회에서 총 30회 승리",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EB%8C%80%ED%9A%8C%EC%9D%98%20%EC%8A%B9%EB%A6%AC%EC%9E%90%3A%203%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 79,
      "number": "Ex. 12",
      "order": 12,
      "deckOrder": 48,
      "ex": true,
      "name": "반",
      "original": "Vaan",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 1,
        "right": 7,
        "bottom": 10,
        "left": 9
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088079_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/79.png",
      "link": "https://ffxivcollect.com/triad/cards/79",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/e4f43d4f7be",
      "officialExact": true,
      "sources": [
        {
          "type": "Achievement",
          "typeName": "업적",
          "group": "achievement",
          "relatedType": "Achievement",
          "relatedId": 1109,
          "name": "승패는 병가지상사: 5단계",
          "original": "Wheel of Fortune V",
          "method": "트리플 트라이어드에서 '무작위 규칙'으로 총 300회 승리",
          "location": "",
          "link": "https://guide.ff14.co.kr/lodestone/search?keyword=%EC%8A%B9%ED%8C%A8%EB%8A%94%20%EB%B3%91%EA%B0%80%EC%A7%80%EC%83%81%EC%82%AC%3A%205%EB%8B%A8%EA%B3%84",
          "linkLabel": "공식 가이드 검색"
        }
      ]
    },
    {
      "id": 80,
      "number": "Ex. 13",
      "order": 13,
      "deckOrder": 48,
      "ex": true,
      "name": "라이트닝",
      "original": "Lightning",
      "korean": true,
      "stars": 5,
      "patch": "2.51",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 9,
        "right": 1,
        "bottom": 7,
        "left": 10
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088080_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/80.png",
      "link": "https://ffxivcollect.com/triad/cards/80",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/45ef67f2ca6",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "트리플 트라이어드 대회",
          "original": "Triple Triad Tournament",
          "method": "트리플 트라이어드 대회 보상",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/80"
        },
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "pack",
          "relatedType": null,
          "relatedId": null,
          "name": "플래티넘 트라이어드 팩",
          "original": "Platinum Triad Card",
          "method": "카드팩 개봉 시 무작위 획득",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/packs#5",
          "pack": {
            "id": 5,
            "name": "플래티넘 트라이어드 팩",
            "cost": 0,
            "link": "https://ffxivcollect.com/triad/packs#5"
          }
        }
      ]
    },
    {
      "id": 252,
      "number": "Ex. 14",
      "order": 14,
      "deckOrder": 48,
      "ex": true,
      "name": "녹티스 루시스 카일룸",
      "original": "Noctis Lucis Caelum",
      "korean": true,
      "stars": 5,
      "patch": "4.56",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 7,
        "right": 10,
        "bottom": 9,
        "left": 1
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088252_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/252.png",
      "link": "https://ffxivcollect.com/triad/cards/252",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/5a1364114e7",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "200,000 맨더빌 골드 소서 포인트",
          "original": "200,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/252"
        }
      ]
    },
    {
      "id": 405,
      "number": "Ex. 15",
      "order": 15,
      "deckOrder": 48,
      "ex": true,
      "name": "클라이브 로즈필드",
      "original": "Clive Rosfield",
      "korean": true,
      "stars": 5,
      "patch": "6.58",
      "typeId": 0,
      "type": "일반",
      "stats": {
        "top": 10,
        "right": 7,
        "bottom": 8,
        "left": 5
      },
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F088000%2F088405_hr1.tex",
      "image": "https://ffxivcollect.com/images/cards/large/405.png",
      "link": "https://ffxivcollect.com/triad/cards/405",
      "official": "https://guide.ff14.co.kr/lodestone/db/item/92d626a032d",
      "officialExact": true,
      "sources": [
        {
          "type": "Gold Saucer",
          "typeName": "골드 소서",
          "group": "exchange",
          "relatedType": null,
          "relatedId": null,
          "name": "200,000 맨더빌 골드 소서 포인트",
          "original": "200,000 MGP",
          "method": "골드 소서의 카드 교환원에게 MGP로 교환",
          "location": "골드 소서",
          "link": "https://ffxivcollect.com/triad/cards/405"
        }
      ]
    }
  ],
  "rules": [
    {
      "id": 1,
      "name": "무작위 규칙"
    },
    {
      "id": 2,
      "name": "모두 공개"
    },
    {
      "id": 3,
      "name": "3장 공개"
    },
    {
      "id": 4,
      "name": "동수"
    },
    {
      "id": 5,
      "name": "연장전"
    },
    {
      "id": 6,
      "name": "합산"
    },
    {
      "id": 7,
      "name": "무작위 패"
    },
    {
      "id": 8,
      "name": "순서대로"
    },
    {
      "id": 9,
      "name": "무작위 순서"
    },
    {
      "id": 10,
      "name": "역전"
    },
    {
      "id": 11,
      "name": "에이스 약화"
    },
    {
      "id": 12,
      "name": "유형 강화"
    },
    {
      "id": 13,
      "name": "유형 약화"
    },
    {
      "id": 14,
      "name": "카드 교환"
    },
    {
      "id": 15,
      "name": "카드 선발"
    }
  ]
};
