const scriptName = "추옵";
const weapon=["블레이드","아대","건","에너지소드","소울슈터","너클","건틀렛리볼버","폴암","활","에인션트보우","듀얼보우건","단검","체인","부채","한손검","한손둔기","한손도끼","케인","석궁","창","두손검","두손둔기","두손도끼","데스페라도","핸드캐논","완드","샤이닝로드","ESP리미터","매직건틀렛","스태프","튜너","브레스슈터"];
const poisonic=["자쿰의 포이즈닉 블레이드\n기본공: 54\n추옵: 없음","자쿰의 포이즈닉 가즈\n기본공: 52\n추옵: 5/7/10/13/16","자쿰의 포이즈닉 건\n기본공: 80\n추옵: 8/11/15/20/25","자쿰의 포이즈닉 에너지소드\n기본공: 80\n추옵: 8/11/15/20/25","자쿰의 포이즈닉 소울슈터\n기본공: 80\n추옵: 8/11/15/20/25","자쿰의 포이즈닉 너클\n기본공: 80\n추옵: 8/11/15/20/25","자쿰의 포워르\n기본공: 80\n추옵: 8/11/15/20/25","자쿰의 포이즈닉 폴암\n기본공: 109\n추옵: 10/15/20/27/34","자쿰의 포이즈닉 보우\n기본공: 102\n추옵: 10/14/19/25/32","자쿰의 포이즈닉 에인션트 보우\n기본공: 102\n추옵: 10/14/19/25/32","자쿰의 포이즈닉 듀얼보우건\n기본공: 102\n추옵: 10/14/19/25/32","자쿰의 포이즈닉 대거\n기본공: 102\n추옵: 10/14/19/25/32","자쿰의 포이즈닉 체인\n기본공: 102\n추옵: 10/14/19/25/32","자쿰의 독선\n기본공: 102\n추옵: 10/14/19/25/32","자쿰의 포이즈닉 소드\n기본공: 105\n추옵: 10/14/20/26/33","자쿰의 포이즈닉 해머\n기본공: 105\n추옵: 10/14/20/26/33","자쿰의 포이즈닉 엑스\n기본공: 105\n추옵: 10/14/20/26/33","자쿰의 포이즈닉 케인\n기본공: 105\n추옵: 10/14/20/26/33","자쿰의 포이즈닉 크로스보우\n기본공: 105\n추옵: 10/14/20/26/33","자쿰의 포이즈닉 스피어\n기본공: 109\n추옵: 10/15/20/27/34","자쿰의 포이즈닉 투핸드소드\n기본공: 107\n추옵: 10/14/20/26/33","자쿰의 포이즈닉 빅해머\n기본공: 109\n추옵: 10/15/20/27/34","자쿰의 포이즈닉 투핸드엑스\n기본공: 109\n추옵: 10/15/20/27/34","자쿰의 포이즈닉 데스페라도\n기본공: 107\n추옵: 10/15/20/27/34","자쿰의 포이즈닉 핸드캐논\n기본공: 109\n추옵: 10/15/20/27/34","자쿰의 포이즈닉 완드\n기본마력: 128\n추옵: 12/17/24/31/40","자쿰의 포이즈닉 샤이닝로드\n기본마력: 128\n추옵: 12/17/24/31/40","자쿰의 ESP리미터\n기본마력: 128\n추옵: 12/17/24/31/40","자쿰의 포이즈닉 매직 건틀렛\n기본마력: 128\n추옵: 12/17/24/31/40","자쿰의 포이즈닉 스태프\n기본마력: 130\n추옵: 12/18/24/32/40","자쿰의 포이즈닉 리가드\n기본공: 107\n추옵: 10/14/20/26/33","자쿰의 포이즈닉 브레스 슈터\n기본공: 102\n추옵: 10/14/19/25/32"];
const necro=["네크로 블레이드\n기본공: 57\n추옵: 없음","네크로 블러디미스트\n기본공: 54\n추옵: 7/10/14/18/23","네크로 이글\n기본공: 82\n추옵: 10/15/20/27/34","네크로 샤프트헤드\n기본공: 82\n추옵: 10/15/20/27/34","네크로 퍼플드래곤\n기본공: 82\n추옵: 10/15/20/27/34","네크로 울프\n기본공: 82\n추옵: 10/15/20/27/34","네크로 기가스\n기본공: 82\n추옵: 10/15/20/27/34","네크로 폴암\n기본공: 112\n추옵: 14/20/28/36/46","네크로 롱보우\n기본공: 105\n추옵: 13/19/26/34/44","네크로 에인션트 보우\n기본공: 105\n추옵: 13/19/26/34/44","네크로 듀얼보우건\n기본공: 105\n추옵: 13/19/26/34/44","네크로 슬레이어\n기본공: 103\n추옵: 13/19/25/33/43","네크로 체인\n기본공: 105\n추옵: 13/19/26/34/44","네크로 영선\n기본공: 105\n추옵: 13/19/26/34/44","네크로 피어\n기본공: 108\n추옵: 13/20/27/35/45","네크로 해머\n기본공: 108\n추옵: 13/20/27/35/45","네크로 헤드\n기본공: 108\n추옵: 13/20/27/35/45","네크로 제스터\n기본공: 108\n추옵: 13/20/27/35/45","네크로 크로스보우\n기본공: 108\n추옵: 13/20/27/35/45","네크로 스피어\n기본공: 112\n추옵: 14/20/28/36/46","네크로 투핸더\n기본공: 110\n추옵: 14/20/28/36/46","네크로 모울\n기본공: 112\n추옵: 14/20/27/36/46","네크로 기간틱\n기본공: 112\n추옵: 14/20/28/36/46","네크로 그림시커\n기본공: 110\n추옵: 14/20/27/36/46","네크로 이그니스\n기본공: 112\n추옵: 14/20/28/36/46","네크로 완드\n기본마력: 133\n추옵: 16/24/33/43/55","네크로 샤이닝로드\n기본마력: 133\n추옵: 16/24/33/43/55","네크로 ESP리미터\n기본마력: 133\n추옵: 16/24/33/43/55","네크로 매직 건틀렛\n기본마력: 133\n추옵: 16/24/33/43/55","네크로 로드\n기본마력: 135\n추옵: 17/24/33/44/56","네크로 트러스트\n기본공: 110\n추옵: 14/20/27/36/46","네크로 브레스 슈터\n기본공: 108\n추옵: 13/20/27/35/45"];
const leon=["없음","로얄 반 레온 가즈\n기본공: 59\n추옵: 8/11/15/19/25","로얄 반 레온 피스톨\n기본공: 90\n추옵: 11/16/22/29/37","로얄 반 레온 에너지체인\n기본공: 90\n추옵: 11/16/22/29/37","로얄 반 레온 드래곤소울\n기본공: 90\n추옵: 11/16/22/29/37","로얄 반 레온 클로\n기본공: 90\n추옵: 11/16/22/29/37","로얄 반 레온 예거\n기본공: 90\n추옵: 11/16/22/29/37","로얄 반 레온 핼버드\n기본공: 120\n추옵: 15/22/30/39/50","로얄 반 레온 보우\n기본공: 112\n추옵: 14/20/28/36/46","로얄 반 레온 에인션트 보우\n기본공: 112\n추옵: 14/20/28/36/46","로얄 반 레온 듀얼보우건\n기본공: 112\n추옵: 14/20/28/36/46","로얄 반 레온 대거\n기본공: 114\n추옵: 14/21/28/37/47","로얄 반 레온 체인\n기본공: 114\n추옵: 14/21/28/37/47","로얄 반 레온 호선\n기본공: 114\n추옵: 14/21/28/37/47","로얄 반 레온 세이버\n기본공: 116\n추옵: 14/21/29/38/48","로얄 반 레온 해머\n기본공: 116\n추옵: 14/21/29/38/48","로얄 반 레온 엑스\n기본공: 116\n추옵: 14/21/29/38/48","로얄 반 레온 케인\n기본공: 116\n추옵: 14/21/29/38/48","로얄 반 레온 크로스보우\n기본공: 116\n추옵: 14/21/29/38/48","로얄 반 레온 스피어\n기본공: 120\n추옵: 15/22/30/39/50","로얄 반 레온 투핸드소드\n기본공: 120\n추옵: 15/22/30/39/50","로얄 반 레온 투핸드해머\n기본공: 120\n추옵: 15/22/30/39/50","로얄 반 레온 투핸드엑스\n기본공: 120\n추옵: 15/22/30/39/50","로얄 반 레온 데스페라도\n기본공: 120\n추옵: 15/22/30/39/50","로얄 반 레온 시즈건\n기본공: 123\n추옵: 15/22/30/40/51","로얄 반 레온 완드\n기본마력: 144\n추옵: 18/26/35/47/60","로얄 반 레온 샤이닝로드\n기본마력: 144\n추옵: 18/26/35/47/60","로얄 반 레온 ESP리미터\n기본마력: 144\n추옵: 18/26/35/47/60","로얄 반 레온 매직 건틀렛\n기본마력: 144\n추옵: 18/26/35/47/60","로얄 반 레온 스태프\n기본마력: 146\n추옵: 18/26//36/48/60","로얄 반 레온 로열티\n기본공: 120\n추옵: 15/22/30/39/50","로얄 반 레온 브레스 슈터\n기본공: 112\n추옵: 14/20/28/36/46"];
const cygnus=["레이븐혼 섀도우블레이드\n기본공: 65\n추옵: 없음","레이븐혼 메탈피스트\n기본공: 69\n추옵: 9/13/17/23/29","샤크투스 샤프슈터\n기본공: 100\n추옵: 12/18/25/32/41","레이븐혼/샤크투스 퀸스폴링\n기본공: 102\n추옵: 13/18/25/33/42","샤크투스 소울드링커\n기본공: 102\n추옵: 13/18/25/33/42","샤크투스 와일드탈론\n기본공: 102\n추옵: 13/18/25/33/42","라이온하트 발로르\n기본공: 102\n추옵: 13/18/25/33/42","라이온하트 파르티잔\n기본공: 122\n추옵: 15/22/30/39/51","팔콘윙 컴포지트 보우\n기본공: 128\n추옵: 16/23/31/41/53","팔콘윙 에인션트 보우\n기본공: 128\n추옵: 16/23/31/41/53","팔콘윙 듀얼보우건\n기본공: 128\n추옵: 16/23/31/41/53","레이븐혼 바젤라드\n기본공: 128\n추옵: 16/23/31/41/53","레이븐혼 체인\n기본공: 128\n추옵: 16/23/31/41/53","레이븐혼 각선\n기본공: 128\n추옵: 16/23/31/41/53","라이온하트 커틀러스\n기본공: 131\n추옵: 16/24/32/42/54","라이온하트 배틀해머\n기본공: 131\n추옵: 16/24/32/42/54","라이온하트 엑스\n기본공: 131\n추옵: 16/24/32/42/54","레이븐혼 크림슨 케인\n기본공: 131\n추옵: 16/24/32/42/54","팔콘윙 헤비크로스보우\n기본공: 131\n추옵: 16/24/32/42/54","라이온하트 푸스키나\n기본공: 137\n추옵: 17/25/34/44/57","라이온하트 배틀시미터\n기본공: 137\n추옵: 17/25/34/44/57","라이온하트 기간틱모울\n기본공: 137\n추옵: 17/25/34/44/57","라이온하트 배틀엑스\n기본공: 137\n추옵: 17/25/34/44/57","라이온하트 페인풀 데스티니\n기본공: 137\n추옵: 17/25/34/44/57","샤크투스 플람\n기본공: 140\n추옵: 17/25/34/45/58","드래곤테일 아크완드\n기본마력: 161\n추옵: 20/29/39/52/67","드래곤테일 타나토스\n기본마력: 161\n추옵: 20/29/39/52/67","드래곤테일 ESP리미터\n기본마력: 161\n추옵: 20/29/39/52/67","드래곤테일 매직 건틀렛\n기본마력: 161\n추옵: 20/29/39/52/67","드래곤테일 워스태프\n기본마력: 163\n추옵: 20/29/40/53/67","라이온하트 리스트레인트\n기본공: 137\n추옵: 17/25/34/44/57","팔콘윙 스플렌디드 네로\n기본공: 128\n추옵: 16/23/31/41/53"];
const rootabyss=["파프니르 레피드엣지\n기본공: 81\n추옵: 없음","파프니르 리스크홀더\n기본공: 86\n추옵: 11/16/21/28/36","파프니르 첼리스카\n기본공: 125\n추옵: 15/22/31/40/52","파프니르 스플릿엣지\n기본공: 128\n추옵: 16/23/31/41/53","파프니르 엔젤릭슈터\n기본공: 128\n추옵: 16/23/31/41/53","파프니르 펜리르탈론\n기본공: 128\n추옵: 16/23/31/41/53","파프니르 빅 마운틴\n기본공: 128\n추옵: 16/23/31/41/53","파프니르 문글레이브\n기본공: 153\n추옵: 19/27/38/49/63","파프니르 윈드체이서\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 에인션트 보우\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 듀얼윈드윙\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 다마스커스\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 체인\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 용선\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 미스틸테인\n기본공: 164\n추옵: 20/29/40/53/68","파프니르 골디언해머\n기본공: 164\n추옵: 20/29/40/53/68","파프니르 트윈클리버\n기본공: 164\n추옵: 20/29/40/53/68","파프니르 클레르시엘\n기본공: 164\n추옵: 20/29/40/53/68","파프니르 윈드윙슈터\n기본공: 164\n추옵: 20/29/40/53/68","파프니르 브류나크\n기본공: 171\n추옵: 21/31/42/55/71","파프니르 페니텐시아\n기본공: 171\n추옵: 21/31/42/55/71","파프니르 라이트닝어\n기본공: 171\n추옵: 21/31/42/55/71","파프니르 배틀클리버\n기본공: 171\n추옵: 21/31/42/55/71","파프니르 데스브링어\n기본공: 171\n추옵: 21/31/42/55/71","파프니르 러스터캐논\n기본공: 175\n추옵: 21/31/43/56/72","파프니르 마나테이커\n기본마력: 201\n추옵: 25/36/49/65/83","파프니르 마나크래들\n기본마력: 201\n추옵: 25/36/49/65/83","파프니르 ESP리미터\n기본마력: 201\n추옵: 25/36/49/65/83","파프니르 매직 건틀렛\n기본마력: 201\n추옵: 25/36/49/65/83","파프니르 마나크라운\n기본마력: 204\n추옵: 25/36/50/66/84","파프니르 포기브니스\n기본공: 171\n추옵: 21/31/42/55/71","파프니르 나이트체이서\n기본공: 160\n추옵: 20/29/39/52/66"];
const absolabs=["앱솔랩스 블레이드\n기본공: 97\n추옵: 없음","앱솔랩스 리벤지가즈\n기본공: 103\n추옵: 16/23/32/42/53","앱솔랩스 포인팅건\n기본공: 150\n추옵: 23/33/46/60/77","앱솔랩스 에너지소드\n기본공: 154\n추옵: 24/34/47/62/79","앱솔랩스 소울슈터\n기본공: 154\n추옵: 24/34/47/62/79","앱솔랩스 블로우너클\n기본공: 154\n추옵: 24/34/47/62/79","앱솔랩스 파일 갓\n기본공: 154\n추옵: 24/34/47/62/79","앱솔랩스 핼버드\n기본공: 184\n추옵: 28/41/56/74/95","앱솔랩스 슈팅보우\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 에인션트 보우\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 듀얼보우건\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 슬래셔\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 체인\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 괴선\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 세이버\n기본공: 197\n추옵: 30/44/60/79/101","앱솔랩스 비트해머\n기본공: 197\n추옵: 30/44/60/79/101","앱솔랩스 엑스\n기본공: 197\n추옵: 30/44/60/79/101","앱솔랩스 핀쳐케인\n기본공: 197\n추옵: 30/44/60/79/101","앱솔랩스 크로스보우\n기본공: 197\n추옵: 30/44/60/79/101","앱솔랩스 피어싱스피어\n기본공: 205\n추옵: 31/46/63/82/106","앱솔랩스 브로드세이버\n기본공: 205\n추옵: 31/46/63/82/106","앱솔랩스 브로드해머\n기본공: 205\n추옵: 31/46/63/82/106","앱솔랩스 브로드엑스\n기본공: 205\n추옵: 31/46/63/82/106","앱솔랩스 데스페라도\n기본공: 205\n추옵: 32/47/64/84/108","앱솔랩스 블래스트캐논\n기본공: 210\n추옵: 32/47/64/84/108","앱솔랩스 스펠링완드\n기본마력: 241\n추옵: 37/54/73/97/124","앱솔랩스 샤이닝로드\n기본마력: 241\n추옵: 37/54/73/97/124","앱솔랩스 ESP리미터\n기본마력: 241\n추옵: 37/54/73/97/124","앱솔랩스 매직 건틀렛\n기본마력: 241\n추옵: 37/54/73/97/124","앱솔랩스 스펠링스태프\n기본마력: 245\n추옵: 37/54/75/98/126","앱솔랩스 튜너\n기본공: 205\n추옵: 31/46/63/82/106","앱솔랩스 브레스 슈터\n기본공: 192\n추옵: 29/43/59/77/99"];
const arcane=["아케인셰이드 블레이드\n기본공: 140\n추옵: 없음","아케인셰이드 가즈\n기본공: 149\n추옵: 27/40/55/72/92","아케인셰이드 피스톨\n기본공: 216\n추옵: 39/58/79/104/133","아케인셰이드 에너지체인\n기본공: 221\n추옵: 40/59/81/106/136","아케인셰이드 소울슈터\n기본공: 221\n추옵: 40/59/81/106/136","아케인셰이드 클로\n기본공: 221\n추옵: 40/59/81/106/136","아케인셰이드 엘라하\n기본공: 221\n추옵: 40/59/81/106/136","아케인셰이드 폴암\n기본공: 264\n추옵: 48/70/96/127/163","아케인셰이드 보우\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 에인션트 보우\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 듀얼보우건\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 대거\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 체인\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 초선\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 세이버\n기본공: 283\n추옵: 51/75/103/136/175","아케인셰이드 해머\n기본공: 283\n추옵: 51/75/103/136/175","아케인셰이드 엑스\n기본공: 283\n추옵: 51/75/103/136/175","아케인셰이드 케인\n기본공: 283\n추옵: 51/75/103/136/175","아케인셰이드 크로스보우\n기본공: 283\n추옵: 51/75/103/136/175","아케인셰이드 스피어\n기본공: 295\n추옵: 54/78/108/142/182","아케인셰이드 투핸드소드\n기본공: 295\n추옵: 54/78/108/142/182","아케인셰이드 투핸드해머\n기본공: 295\n추옵: 54/78/108/142/182","아케인셰이드 투핸드엑스\n기본공: 295\n추옵: 54/78/108/142/182","아케인셰이드 데스페라도\n기본공: 295\n추옵: 54/78/108/142/182","아케인셰이드 시즈건\n기본공: 302\n추옵: 55/80/110/145/186","아케인셰이드 완드\n기본마력: 347\n추옵: 63/92/126/167/214","아케인셰이드 샤이닝로드\n기본마력: 347\n추옵: 63/92/126/167/214","아케인셰이드 ESP리미터\n기본마력: 347\n추옵: 63/92/126/167/214","아케인셰이드 매직 건틀렛\n기본마력: 347\n추옵: 63/92/126/167/214","아케인셰이드 스태프\n기본마력: 353\n추옵: 64/94/129/170/218","아케인셰이드 튜너\n기본공: 295\n추옵: 54/78/108/142/182","아케인셰이드 브레스 슈터\n기본공: 283\n추옵: 51/75/103/136/175"];
const genesis=["(데이터 미구현)","제네시스 가즈\n기본공: 172\n추옵: 31/46/63/83/106","제네시스 피스톨\n기본공: 249\n추옵: 45/66/91/120/154","제네시스 에너지체인\n기본공: 255\n추옵: 46/68/93/123/157","제네시스 소울슈터\n기본공: 255\n추옵: 46/68/93/123/157","제네시스 클로\n기본공: 255\n추옵: 46/68/93/123/157","제네시스 엘라하\n기본공: 255\n추옵: 46/68/93/123/157","제네시스 폴암\n기본공: 304\n추옵: 55/81/111/146/187","제네시스 보우\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 에인션트 보우\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 듀얼보우건\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 대거\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 체인\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 창세선\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 세이버\n기본공: 326\n추옵: 59/87/119/157/201","제네시스 해머\n기본공: 326\n추옵: 59/87/119/157/201","제네시스 엑스\n기본공: 326\n추옵: 59/87/119/157/201","제네시스 케인\n기본공: 326\n추옵: 59/87/119/157/201","제네시스 크로스보우\n기본공: 326\n추옵: 59/87/119/157/201","제네시스 스피어\n기본공: 340\n추옵: 62/90/124/164/210","제네시스 투핸드소드\n기본공: 340\n추옵: 62/90/124/164/210","제네시스 투핸드해머\n기본공: 340\n추옵: 62/90/124/164/210","제네시스 투핸드엑스\n기본공: 340\n추옵: 62/90/124/164/210","제네시스 데스페라도\n기본공: 340\n추옵: 62/90/124/164/210","제네시스 시즈건\n기본공: 348\n추옵: 63/92/127/167/215","제네시스 완드\n기본마력: 400\n추옵: 72/106/146/192/246","제네시스 샤이닝로드\n기본마력: 400\n추옵: 72/106/146/192/246","제네시스 ESP리미터\n기본마력: 400\n추옵: 72/106/146/192/246","제네시스 매직 건틀렛\n기본마력: 400\n추옵: 72/106/146/192/246","제네시스 스태프\n기본마력: 406\n추옵:74/108/148/195/250","제네시스 튜너\n기본공: 340\n추옵: 62/90/124/164/210","제네시스 브레스 슈터\n기본공: 318\n추옵: 58/84/116/153/196"];
const weaponzero=["1형","2형","3형","4형","5형","6형","7형","8형","9형","10형"];
const zero=["1형(Lv.110)\n기본공: 100/102\n추옵: 4/7/12/17/23","2형(Lv.110)\n기본공: 103/105\n추옵: 4/7/12/17/23","3형(Lv.120)\n기본공: 105/107\n추옵: 5/10/16/23/32","4형(Lv.130)\n기본공: 112/114\n추옵: 5/11/17/25/34","5형(Lv.140)\n기본공: 117/121\n추옵: 5/11/18/26/36","6형(Lv.150)\n기본공: 135/139\n추옵: 6/13/21/30/41","7형(Lv.170) (무료 업그레이드 최대 형태)\n기본공: 169/179\n추옵: 9/20/32/47/64","8형(Lv.180) (=앱솔랩스)\n기본공: 203/207\n추옵: 11/23/38/56/76","9형(Lv.200) (=아케인셰이드)\n기본공: 293/297\n추옵: 18/40/65/95/131","10형(Lv.200) (=제네시스)\n기본공: 337/342\n추옵: 21/46/75/110/150"];
const starleon=[6,7,7,8,9];
const starcyg=[7,8,8,9,10,11,12];
const starroot=[8,9,9,10,11,12,13];
const starabs=[9,9,10,11,12,13,14];
const stararc=[13,13,14,14,15,16,17];
const jaknum=[3,5,7,9];
const jak=["100%","70%","30%","15%"];
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
 
 function printchuop(msg,replier)
 {
	 var series=msg.split(" ")[1];
	 if(series=="류드")
	 {
		 replier.reply("류드의 검\n기본공: 165\n추옵: 20/30/40/53/68");
	 }
	 else if(series=="제로")
	 {
		 var name=msg.split(" ")[2];
		 if(weaponzero.indexOf(name)!=(-1))
			 replier.reply(zero[weaponzero.indexOf(name)]);
		 else
		 {
			 var print="";
			 for(var i=0;i<weaponzero.length;i++)
				 print=print+"\n\n*"+zero[i];
			 replier.reply("제로 무기 추옵\n"+"\u200b".repeat(500)+print);
		 }
	 }
	 else if(series=="해카세")
	 {
		 replier.reply("해방된 카이세리움\n기본공: 400\n추옵: 16/36/59/86/118");
	 }
	 else if(series=="자쿰")
	 {
		 var name=msg.split(" ")[2].toUpperCase();
		 if(weapon.indexOf(name)!=(-1))
			 replier.reply(poisonic[weapon.indexOf(name)]);
		 else
		 {
			 var print="";
			 for(var i=0;i<weapon.length;i++)
				 print=print+"\n\n*"+weapon[i]+"\n"+poisonic[i];
			 replier.reply("자쿰 무기 추옵\n"+"\u200b".repeat(500)+print);
		 }
	 }
	 else if(series=="네크로")
	 {
		 var name=msg.split(" ")[2].toUpperCase();
		 if(weapon.indexOf(name)!=(-1))
			 replier.reply(necro[weapon.indexOf(name)]);
		 else
		 {
			 var print="";
			 for(var i=0;i<weapon.length;i++)
				 print=print+"\n\n*"+weapon[i]+"\n"+necro[i];
			 replier.reply("네크로 무기 추옵\n"+"\u200b".repeat(500)+print);
		 }
	 }
	 else if(series=="반레온")
	 {
		 var name=msg.split(" ")[2].toUpperCase();
		 if(weapon.indexOf(name)!=(-1))
			 replier.reply(leon[weapon.indexOf(name)]);
		 else
		 {
			 var print="";
			 for(var i=0;i<weapon.length;i++)
				 print=print+"\n\n*"+weapon[i]+"\n"+leon[i];
			 replier.reply("반레온 무기 추옵\n"+"\u200b".repeat(500)+print);
		 }
	 }
	 else if(series=="여제")
	 {
		 var name=msg.split(" ")[2].toUpperCase();
		 if(weapon.indexOf(name)!=(-1))
			 replier.reply(cygnus[weapon.indexOf(name)]);
		 else
		 {
			 var print="";
			 for(var i=0;i<weapon.length;i++)
				 print=print+"\n\n*"+weapon[i]+"\n"+cygnus[i];
			 replier.reply("여제 무기 추옵\n"+"\u200b".repeat(500)+print);
		 }
	 }
	 else if(series=="파프")
	 {
		 var name=msg.split(" ")[2].toUpperCase();
		 if(weapon.indexOf(name)!=(-1))
			 replier.reply(rootabyss[weapon.indexOf(name)]);
		 else
		 {
			 var print="";
			 for(var i=0;i<weapon.length;i++)
				 print=print+"\n\n*"+weapon[i]+"\n"+rootabyss[i];
			 replier.reply("파프니르 무기 추옵\n"+"\u200b".repeat(500)+print);
		 }
	 }
	 else if(series=="앱솔")
	 {
		 var name=msg.split(" ")[2].toUpperCase();
		 if(weapon.indexOf(name)!=(-1))
			 replier.reply(absolabs[weapon.indexOf(name)]);
		 else
		 {
			 var print="";
			 for(var i=0;i<weapon.length;i++)
				 print=print+"\n\n*"+weapon[i]+"\n"+absolabs[i];
			 replier.reply("앱솔랩스 무기 추옵\n"+"\u200b".repeat(500)+print);
		 }
	 }
	 else if(series=="아케인")
	 {
		 var name=msg.split(" ")[2].toUpperCase();
		 if(weapon.indexOf(name)!=(-1))
			 replier.reply(arcane[weapon.indexOf(name)]);
		 else
		 {
			 var print="";
			 for(var i=0;i<weapon.length;i++)
				 print=print+"\n\n*"+weapon[i]+"\n"+arcane[i];
			 replier.reply("아케인셰이드 무기 추옵\n"+"\u200b".repeat(500)+print);
		 }
	 }
	 else if(series=="제네")
	 {
		 var name=msg.split(" ")[2].toUpperCase();
		 if(weapon.indexOf(name)!=(-1))
			 replier.reply(genesis[weapon.indexOf(name)]);
		 else
		 {
			 var print="";
			 for(var i=0;i<weapon.length;i++)
				 print=print+"\n\n*"+weapon[i]+"\n"+genesis[i];
			 replier.reply("제네시스 무기 추옵\n"+"\u200b".repeat(500)+print);
		 }
	 }
	 else
	 {
		 replier.reply("추옵 검색 사용법"+"\u200b".repeat(500)+"\n\n사용법: !추옵 (장비종류) (무기종류)\n\n장비 종류: 자쿰, 네크로, 반레온, 여제, 파프, 앱솔, 아케인, 제네, 류드, 제로, 해카세\n\n무기 종류: "+weapon.join(", ")+"\n\n제로 무기 종류: 1형~10형\n\n*류드, 해카세의 경우 무기 종류는 입력하지 않습니다.\n*잘못된 값 입력 시 해당 장비 종류 모두를 출력합니다.");
	 }
 }
 
 function statanalysis(msg,replier)
 {
	 var analyze=msg.split(' ');
      for (i=0;i<7;i++) {
         analyze[i]=Number(analyze[i]);
      }
      if(analyze.length != 7){
         replier.reply('입력한 값이 잘못되었습니다.\n@분석 을 통해 사용법을 확인해 주세요!');
         return;
      }
      if(analyze[4]!=130 && analyze[4]!=140 && analyze[4]!=150 && analyze[4]!=160 && analyze[4]!=200){
         replier.reply('레벨제한이 잘못되었습니다.\n사용 가능한 렙제: 130/140/150/160/200');
         return;
      }
      if(analyze[4]==130 && analyze[5]>20){
         replier.reply('130제는 20성까지만 가능합니다.');
         return;
      }
      if(analyze[5]<1 || analyze[5]>22){
         replier.reply('1~22성까지만 입력해야 합니다.');
         return;
      }
	  analyze[1]=analyze[1]-analyze[3];
      for (i=analyze[5];i>=1;i--){
         if(i>=16){
            if(analyze[4]==130){
               analyze[1]-=starleon[i-16];
            } 
            else if(analyze[4]==140){
               analyze[1]-=starcyg[i-16];
            }
            else if(analyze[4]==150){
               analyze[1]-=starroot[i-16];
            }
            else if(analyze[4]==160){
               analyze[1]-=starabs[i-16];
            }  
            else if(analyze[4]==200){
               analyze[1]-=stararc[i-16];
            }
         }
         if(i<=15){
            analyze[1]-=Math.floor((analyze[1]+50)/51);
         }
      }  
      
      var str = "*분석결과*\n"+analyze[4]+"제 "+analyze[5]+"성 강화\n";
	  var jaks=(Number(analyze[1])-Number(analyze[2]))/Number(analyze[6]);
	  if(jaknum.indexOf(jaks)!=(-1))
		  str=str+jak[jaknum.indexOf(jaks)]+" "+analyze[6]+"작 입니다.";
	  else
		  str=str+"주흔작이 아니거나 작이 섞여 있으므로 정확한 측정을 할 수 없습니다.\n1작당 평균 공/마 상승량: "+jaks.toFixed(1);
      replier.reply(str);
 }
 
 function armor(msg,replier)
 {
	 var msgg=msg.split("!방무 ")[1];
	 var analyze=msgg.split(' ');
      for (i=0;i<analyze.length;i++) {
         analyze[i]=Number(analyze[i]);
      }
	  var basic=analyze[1];
	  var real=basic;
	  for(i=2;i<analyze.length;i++)
		  real=((real/100)+(analyze[i]/100)-(real*analyze[i])/10000)*100;
	  var rate=1-((analyze[0]/100)*(1-(real/100)));
	  rate=rate*100;
   if(rate<0) rate=0;
	  replier.reply("표기 방무: "+basic+"%,  실 방무: "+real.toFixed(2)+"%\n보스 방어율: "+analyze[0]+"%, 보스에게 딜량: "+rate.toFixed(2)+"%");
	  
 }
 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
	if(msg=="!추옵")
		replier.reply("추옵 검색 사용법"+"\u200b".repeat(500)+"\n\n사용법: !추옵 (장비종류) (무기종류)\n\n장비 종류: 자쿰, 네크로, 반레온, 여제, 파프, 앱솔, 아케인, 제네, 류드, 제로, 해카세\n\n무기 종류: "+weapon.join(", ")+"\n\n제로 무기 종류: 1형~10형\n\n*류드, 해카세의 경우 무기 종류는 입력하지 않습니다.\n*잘못된 값 입력 시 해당 장비 종류 모두를 출력합니다.");
	else if(msg.split(" ")[0]=="!추옵")
		printchuop(msg,replier);
	if(msg.split(" ")[0]=="!작분석")
		statanalysis(msg,replier);
	if(msg.split(" ")[0]=="!방무")
		armor(msg,replier);
}