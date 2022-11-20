exports.cmds={
    'help':'@포켓몬스터',
    'uphelp':'@포켓몬 도움말',
    'join':'@포켓몬 가입',
    'leave':'@포켓몬 탈퇴',
    'play':['@야생','ㅇㅅ'],
	'ballthrow':['@볼','ㅂ'],
	'esc':['@도망','ㄷㅁ'],
    'box':'@내 포켓몬',
    'info':'@트레이너정보',
    'lock':'@덱',
    'unlock':'@박스',
	'boxlock':'@잠금',
	'boxunlock':'@잠금해제',
	'skilllock':'@스킬잠금',
    'skillunlock':'@스킬잠금해제',
    'ball':'@볼구매',
	'egg':'@알 부화',
	'legendegg':'@전설알',
    'pokinfo':'@포켓몬정보',
	'dpokinfo':'@덱정보',
	'swap':'@순서변경',
	'rest':'@휴식',
	'ballup':'@볼강화',
	'ballinfo':'@볼종류',
	'sell':'@놓아주기',
    'title':'@트레이너등급',
    'rank':'@포켓몬 랭킹',
	'battlejoin':'@배틀참가',
	'battletower':'@배틀타워',
	'battleexit':'@배틀취소',
	'battlenext':'@다음',
	'skillchange':'@스킬뽑기',
	'effort':'@노력치강화',
	'leaguechar':'@리그캐릭터',
    'levelup':'@레벨업',
	'boxlevelup':'@박스레벨업',
	'mega':'@메가진화',
	'ribbon':'@리본종류',
	'giveup':'@배틀기권',
	'eventinfo':'@포켓몬이벤트',
	'gym':'@체육관',
	'gatcha':'@제비뽑기',
	'champ':'@챔피언도전',
	'champinfo':'@챔피언정보',
	'collectioninfo':'@컬렉션목록',
	'mycollection':'@내 컬렉션',
	'collectioneffects':'@컬렉션효과',
	'formchange':'@폼체인지',
	'seasoninfo':'@포켓몬계절'
};

/* 설정값 (잘못건들면 버그생겨요. 백업해두고 하세요) */
exports.setting={
    'p':{
		'g5':0,  //울트라
        'g4':0,  //전포
        'g3':1,
        'g2':19,
        'g1':60,
        'i':10,  //아이템
        'g':10,  //돈
    },  //확률(%) (*모두 더해서 100을 만들것*)
    'success':Number(70),  //기본성공률(%)
	'catchsuccess':[1,1,15,30,40], //기본포획률(%)
	'run':[75,40,30,20,10], //도주확률(%)
	'ballPrice':[500,2000,5000,10000,20000,30000,50000,75000,100000,150000,200000,300000,400000,500000,600000,800000,1000000,1200000,1500000,1750000,2000000],  //볼구매가격(골드)
    'maxball':Number(50),  //볼 최대갯수(개)
	'ballg5':[0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,3,4,5,6,7,8], //울트라비스트 볼강화 출현률
	'ballg4':[0,0,0.1,0.5,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], //전설 볼강화 출현률
	'ballg3':[0.1,0.5,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20], //레어 볼강화 출현률
	'ballupPrice':[5000,50000,250000,800000,3000000,7500000,15000000,30000000,50000000,100000000,250000000,500000000,1000000000,1500000000,2000000000,2500000000,3000000000,3500000000,4000000000,4500000000,0], //볼별 다음볼로 업그레이드비용
	'ballupsucc':[10,30,50,100,200,300,500,700,1000,1250,1500,1750,2000,2250,2500,2750,3000,3250,3500,4000,0], //볼강화 요구 포켓몬 발견 횟수
    'ballcatch':[0.2,0.5,2,3,5],  //볼강화 포획률(g5~g1)
    'maxlevel':Number(250),  //포켓몬 만렙
	'minlevel':Number(40),  //노강화 야생렙 최소
    'castT':{'min':30,'max':40},  //탐험소요시간(30~40초사이 랜덤을 뜻함)
    'ranknum':Number(30),  //랭킹 출력갯수(개)
	'balluplev':7,
	'luckygold':300000000, //알수없는돌 금액
	'championlev':260, //챔피언 레벨
	'leaguechararr':['큐레무','지가르데','네크로즈마'],
	'leaguecharacter':'네크로즈마',
	//eventp변수: 추가 부여 스탯(이벤트 개최 등에 사용) (이벤트가 없을 땐 모두 0으로 해두셈)
	'eventp':{
		'unknown':0, //??? 추가 출현률
		'gatcha':0,//제비뽑기 추가횟수
		'battletower':1, //배틀타워 추가횟수
		'g4':0, //전설 추가 출현률
		'g3':0,  //레어 추가 출현률
		'g4catch':0,  //전설 추가 포획률
		'g3catch':0,  //레어 추가 포획률
		'allcatch':0,  //나머지 추가 포획률
		'goldX':2 //모든 골드 획득량 배수(평상시 1로 두면 됨)
	},
    'rank':{
        'upif':[0,1,10,25,50,100,200,300,500,750,1000,1250,1500,1750,2000,2500,3000,0,0],  //랭크업조건(포획성공횟수)
        'name':['신입 트레이너','초보 트레이너','엘리트 트레이너','베테랑 트레이너','레드 트레이너','블루 트레이너','브론즈 트레이너','실버 트레이너','골드 트레이너','블랙 트레이너','관동지방 마스터','성도지방 마스터','호연지방 마스터','신오지방 마스터','하나지방 마스터','칼로스지방 마스터','포켓몬 마스터','챔피언','개발자'],  //칭호이름
        'success':[0,1,3,5,7,9,11,14,17,20,23,26,29,30,30,30,30,30,30],  //추가 탐험성공률(%)
		'successcatch':[0,0.1,0.5,1,2,3,4,5,6,7,8,9,10,11,12,13,14,25,100],  //추가 포획성공률(%)
        'maxHp':[20,30,40,50,70,100,120,150,170,190,210,230,250,270,300,330,350,400,999999],  //최대체력
        'rest':[20000,19000,18000,17000,16000,15000,14000,13000,12000,11000,10000,9000,8000,7000,7000,7000,7000,3000,1000],  //체력 +1 회복당 휴식시간
        'castT':[0,1,3,5,7,9,11,13,15,17,19,21,23,25,28,31,35,50,90]  //탐험 소요시간 단축(%)
    },  //트레이너등급 (포획수로 등급업)
	'ribbon':{
        'upif':[1,5,10,20,50,100,150,200,300,500,1000,0],  //랭크업조건(배틀횟수)
        'name':['뉴비 리본','큐트 리본','노력 리본','어빌리티 리본','위닝 리본','빅토리 리본','내셔널 리본','어스 리본','레전드 리본','고저스 리본','로열 리본','고저스 로열 리본'],  //리본이름
		'g4':[0,0,0.1,0.5,1,2,3,4,5,6,7,8], //전설 추가 출현률
		'g3':[0,0.5,1,2,4,6,8,10,12,14,16,18], //레어 추가 출현률
		'successcatch':[0,1,2,3,4,5,6,7,8,9,10,11],  //추가 포획성공률(%)
		'balldc':[0,1,3,5,10,15,20,30,40,50,65,80], //볼구매 할인 (%)
		'upgradedc':[0,1,2,4,6,8,10,15,20,30,40,50] //강화 및 스킬뽑기 할인 (%)
    } //리본 (배틀 수로 등급업)
};

//포켓몬 목록. 카링으로 사진 띄울때 포켓몬위키 파싱하므로 없는 포켓몬 이름 넣으면 에러납니다!!
exports.pokArr={
    'gold':[
        '빨강구슬','초록구슬','파랑구슬','하얀구슬','금강구슬','별의조각',
		'금구슬','별의모래','혜성조각','큰진주','고대의은화','고대의금화'],
    'group1':[
        '구구','꼬렛','찌르꼬','비버니','꼬리선','부우부',
		'주뱃','깨비참','모래두지','꼬링크','고라파덕','귀뚤뚜기',
		'도롱충이','메리프','꼬몽울','뚜벅쵸','꼬마돌','캐터피',
		'요가랑','개무소','우파','코코파스','랑딸랑','미꾸리',
		'게을로','포니타','잉어킹','알통몬','콘치','고오스',
		'모다피','토중몬','캐이시','슬리프','왕눈해','포챠나',
		'지그제구리','갈모매','테일로','깝질무','요테리','쌔비냥','보르쥐',
		'탱그릴','콩둘기','단굴','으랏차','동챙이','두르보','깨봉이','사철록',
		'깜놀버슬','파쪼옥','또르박쥐','마디네','배쓰나이','딱정곤','쪼마리',
		'파르빗','화살꼬빈','분이벌레','메이클','레오꼬','판짱','완철포',
		'콕코구리','영구스','턱지충이','암멍이','약어리','물거미','달콤아'],
    'group2':[
        '동미러','골뱃','데구리','로젤리아','셀러','별가사리','두개도스',
		'방패톱스','니로우','무우마','쥬쥬','야돈','가디','발챙이','미뇽',
		'이브이','피츄','페라페','플러시','마이농','핑복','삐','파치리스',
		'롱스톤','코일','니드런♂','니드런♀','삐딱구리','리오르','또가스',
		'아보','질퍽이','나옹','두두','디그다','크랩','찌리리공','뿔카노',
		'쏘드라','에레키드','마그비','흉내내','덩쿠리','캥카','내루미','아라리',
		'스라크','먹고자','딥상어동','브이젤','망키','꼬지지','루리리','통통코',
		'에이팜','해너츠','네이티','페이검','레디바','푸푸린','왕자리','헤라크로스',
		'쁘사이저','세꿀버리','키링키','피콘','글라이거','블루','침바루','샤프니아',
		'포푸니','눈쓰개','깜지곰','마그마그','꾸꾸리','코산호','타만타','총어',
		'가재군','딜리버드','델빌','코코리','노라키','밀탱크','켄타로스','무스틈니',
		'형광어','배루키','애버라스','연꽃몬','도토링','랄토스','버섯꼬','소곤룡',
		'마크탕','에나비','히포포타스','스콜피','입치트','가보리','썬더라이','꼴깍몬',
		'고래왕자','둔타','톱치','비구술','피그점프','파비코','선인왕','쟝고',
		'세비퍼','식스테일','오뚝군','콘팡','캐스퐁','탕구리','뽀뽀라','켈리몬',
		'어둠대신','해골몽','대굴레오','진주몽','메탕','아공이','야나프','바오프','앗차프',
		'몽나','줄뮤마','두더류','다부니','던지미','타격귀','소미안','치릴리','깜눈크','달막화',
		'마라카치','돌살이','곤율랭','데스마스','치라미','고디탱','유니란','꼬지보리','바닐프티',
		'맘복치','에몽가','철시드','기어르','불켜미','터검니','리그레','메더','비조푸','크리만',
		'골비람','자망칼','버프론','앤티골','아이앤트','플라베베','트리미앙','냐스퍼','단칼빙','슈쁘',
		'나룸퍼프','오케이징','거북손손','수레기','목도리키텔','루차불','데덴네','멜리시',
		'클레피','나목령','호바귀','꽁어름','오기지게','춤추새','에블리','시마사리','짜랑랑','자마슈',
		'포곰곰','큐아링','하랑우탄','내던숭이','꼬시레','모래꿍','해무기','메테노','자말라','폭거북스','토게데마루',
		'치갈기'
		],
    'group3':[
        '강철톤','갸라도스','메타몽','라프라스','빈티나','토게피','폴리곤',
		'암나이트','투구','프테라','아노딥스','노고치','눈꼬마','무장조',
		'깜까미','시라칸','코터스','루나톤','솔록','릴링','트로피우스','앱솔',
		'사랑동이','화강돌','흔들풍손','파이리','이상해씨','꼬부기','브케인','리아코','치코리타',
		'물짱이','아차모','나무지기','모부기','불꽃숭이','팽도리',
		'한바이트','포푸니라','신뇽','데기라스','쉘곤','메탕구','주리비얀','뚜꾸리','수댕이',
		'저리어','프리지오','로토무','모노두','활화르바','프로토가','아켄','수리둥보','벌차이',
		'액슨도','코고미','심보러','조로아','불비달마',
		'도치마론','푸호꼬','개구마르','음뱃','티고라스','아마루스','미끄메라',
		'나몰빼미','냐오불','누리공','머드나기','야도뇽','실버디','따라큐','짜랑꼬','할비롱','타타륜'],
    'group4':[
        '그란돈','가이오가','레쿠쟈','칠색조','루기아','테오키스','뮤','뮤츠',
		'세레비','라티아스','라티오스','지라치','레지락','레지스틸','레지아이스','유크시',
		'아그놈','엠라이트','라이코','스이쿤','앤테이','파이어','프리져','썬더','피오네',
		'마나피','쉐이미','다크라이','디아루가','펄기아','기라티나','히드런','레지기가스',
		'크레세리아','아르세우스','토네로스','볼트로스','랜드로스','코바르온','테라키온',
		'비리디온','레시라무','제크로무','비크티니','메로엣타','케르디오','게노세크트',
		'제르네아스','이벨타르','디안시','후파','볼케니온',
		'카푸꼬꼬꼭','카푸나비나','카푸브루루','카푸느지느','솔가레오','루나아라','마기아나','마샤도','제라오라'],
	'group5':[
        '텅비드','페로코체','매시붕','전수목','철화구야','종이신도','악식킹','아고용','차곡차곡','두파팡'],
	'groupunknown':[
        '미싱노','유령','지우의피카츄'],	
};
//그룹3 레어 그룹4 전설 그룹5 울트라비스트 

//계절별 출현률 증가 포켓몬 목록
exports.seasons={
	'spring':['다부니','파이리','불꽃숭이','아차모','브케인','가디','식스테일','이상해씨','치코리타','모부기','버섯꼬','니로우','깨비참',
		'나무지기','모다피','로젤리아','해너츠','통통코','무스틈니','도토링','마그비','포니타','델빌','구구','켄타로스','밀탱크','뚜꾸리',
		'찌르꼬','테일로','부우부','삐','푸푸린','핑복','토게피','질퍽이','꼴깍몬','파비코','아공이','리오르','이브이','주뱃','두두','네이티','주리비얀',
		'나목령','호바귀','멜리시','도치마론','푸호꼬','화살꼬빈','레오꼬','플라베베','메이클','냐스퍼','트리미앙','슈쁘','나룸퍼프','판짱',
		'블루','흔들풍손','파이어','칠색조','테오키스','뮤','뮤츠','세레비','쉐이미','앤테이','크레세리아','아르세우스','비크티니','케르디오','메로엣타','제르네아스','디안시','솔가레오','카푸나비나'],
	'summer':['다부니','트로피우스','갈모매','우파','잉어킹','갸라도스','연꽃몬','형광어','콘치','고래왕자','타만타','총어','별가사리','고라파덕','토중몬',
		'팽도리','꼬부기','리아코','물짱이','침바루','샤프니아','루리리','깝질무','브이젤','삐딱구리','스콜피','코산호','글라이거','가재군','크랩','진주몽',
		'왕눈해','비구술','도롱충이','개무소','페이검','캐터피','뿔충이','콘팡','피콘','헤라크로스','쁘사이저','빈티나','아라리','덩쿠리','메리프',
		'아보','세비퍼','꼬링크','피츄','플러시','마이농','파치리스','찌리리공','레디바','왕자리','사랑동이','썬더라이','야돈','세꿀버리',
		'탱그릴','배쓰나이','두르보','마디네','소미안','동챙이','수댕이','꼬지보리','사철록','딱정곤','쪼마리','깜놀버슬','줄뮤마','에몽가',
		'완철포','수레기','오케이징','개구마르','분이벌레','거북손손','데덴네',
		'가이오가','루기아','라티아스','라티오스','썬더','스이쿤','라이코','유크시','아그놈','엠라이트','피오네','마나피','펄기아','토네로스','볼트로스',
		'비리디온','카푸느지느','제라오라'],
	'autumn':['다부니','딥상어동','꼬마돌','롱스톤','히포포타스','알통몬','마크탕','코터스','마그마그','디그다',
		'동미러','루나톤','솔록','애버라스','메탕','선인왕','톱치','둔타','무장조','코코리','코코파스','또가스',
		'뿔카노','가보리','꼬지지','모래두지','코일','오뚝군','입치트','니드런♂','니드런♀','탕구리','단굴','달막화','두더류',
		'깜눈크','마라카치','돌살이','철시드','기어르','메더','저리어','터검니','크리만','골비람','으랏차',
		'목도리키텔','클레피',
		'그란돈','레지락','레지스틸','히드런','지라치','디아루가','랜드로스','레시라무','게노세크트','코바르온','테라키온','볼케니온',
		'카푸꼬꼬꼭','마기아나'],
	'winter':['다부니','요가랑','랑딸랑','포푸니','눈쓰개','대굴레오','쥬쥬','꾸꾸리','딜리버드','뽀뽀라','눈꼬마',
		'고오스','무우마','해골몽','어둠대신','쟝고','깜지곰','앱솔','깜까미','화강돌','라프라스','쏘드라','미뇽',
		'바닐프티','코고미','프리지오','데스마스','자망칼','모노두','조로아','곤율랭','심보러','꽁어름','단칼빙','음뱃',
		'로토무','레지아이스','프리져','레지기가스','기라티나','다크라이','제크로무','이벨타르','후파','마샤도','루나아라']
};

exports.ballArr=[
    '몬스터볼','슈퍼볼','하이퍼볼','네트볼','다이브볼','다크볼','타이마볼','퀵볼','마스터볼','프레미어볼','울트라볼','프레셔스볼','드림볼','파크볼','메가톤볼','기가톤볼','GS볼','오리진볼','아크로마머신','특수 전파 발생기','붉은 쇠사슬'
];

exports.collectionnames=[
	'관동지방',
	'성도지방',
	'호연지방',
	'신오지방',
	'하나지방',
	'칼로스지방',
	'알로라지방',
	'전설/환상',
	'울트라비스트',
	'???'
];

exports.collectioncontents=[
	['이상해꽃','리자몽','거북왕','버터플','독침붕','피죤투','레트라','깨비드릴조','아보크','라이츄','고지',
	'니드킹','니드퀸','픽시','나인테일','푸크린','라플레시아','파라섹트','도나리','닥트리오','페르시온',
	'골덕','성원숭','강챙이','윈디','후딘','괴력몬','우츠보트','독파리','딱구리','날쌩마','파오리','두트리오',
	'쥬레곤','질뻐기','파르셀','팬텀','슬리퍼','킹크랩','붐볼','나시','텅구리','시라소몬','홍수몬','또도가스',
	'캥카','왕콘치','아쿠스타','마임맨','루주라','쁘사이저','켄타로스','메타몽','갸라도스','라프라스','샤미드','쥬피썬더',
	'부스터','암스타','투구푸스','잠만보','망나뇽'],
	['메가니움','블레이범','장크로다일','다꼬리','야부엉','레디안','아리아도스','크로뱃','랜턴','네이티오','전룡',
	'아르코','마릴리','꼬지모','왕구리','솜솜코','해루미','누오','에브이','블래키','야도킹','키링키','쏘콘','노고치',
	'강철톤','그랑블루','침바루','핫삼','단단지','헤라크로스','링곰','마그카르고','코산호','대포무노','딜리버드','만타인',
	'무장조','헬가','코리갑','노라키','카포에라','밀탱크','해피너스','마기라스'],
	['나무킹','번치코','대짱이','그라에나','직구리','뷰티플라이','독케일','로파파','다탱구','스왈로','패리퍼','가디안',
	'비나방','버섯모','게을킹','아이스크','껍질몬','폭음룡','하리뭉','델케티','깜까미','입치트','보스로라','요가램','썬더볼트',
	'플러시','마이농','볼비트','네오비트','꿀꺽몬','샤크니아','고래왕','폭타','코터스','피그킹','플라이곤','밤선인','파비코리',
	'쟝고','세비퍼','루나톤','솔록','메깅','가재장군','점토도리','릴리요','아말도','밀로틱','캐스퐁','켈리몬','다크펫','트로피우스',
	'치렁','앱솔','얼음귀신','씨카이저','헌테일','분홍장이','시라칸','사랑동이','보만다','메타그로스'],
	['토대부기','초염몽','엠페르트','찌르호크','비버통','귀뚤톡크','렌트라','로즈레이드','램펄드','바리톱스','도롱마담','나메일',
	'비퀸','파치리스','플로젤','체리꼬','트리토돈','겟핸보숭','둥실라이드','이어롭','무우마직','돈크로우','동탁군','페라페','화강돌',
	'한카리아스','루카리오','하마돈','드래피온','독개굴','무스틈니','네오라이트','눈설왕','포푸니라','자포코일','내룸벨트','거대코뿌리',
	'덩쿠림보','마그마번','토게키스','메가자리','리피아','글레이시아','글라이온','맘모꾸리','폴리곤Z','엘레이드','대코파스','야느와르몽',
	'눈여아','로토무'],
	['샤로다','염무왕','대검귀','보르그','바랜드','레파르다스','야나키','바오키','앗차키','몽얌나','켄호로우','제브라이카',
	'기가이어스','맘박쥐','몰드류','다부니','노보청','두빅굴','던지미','타격귀','모아머','펜드라','엘풍','드레디어','배쓰나이',
	'악비아르','불비달마','마라카치','암팰리스','곤율거니','심보러','데스니칸','늑골라','아케오스','더스트나','조로아크','치라치노',
	'고디모아젤','란쿨루스','스완나','배바닐라','바라철록','에몽가','슈바르고','뽀록나','탱탱겔','맘복치','전툴라','너트령',
	'기기기어르','저리더프','벰크','샹델라','액스라이즈','툰베어','프리지오','어지리더','메더','비조도','크리만','골루그','절각참',
	'버프론','워글','버랜지나','앤티골','아이앤트','삼삼드래','불카모스'],
	['브리가론','마폭시','개굴닌자','파르토','파이어로','비비용','화염레오','플라제스','고고트','부란다','트리미앙','냐오닉스','킬가르도',
	'프레프티르','나루림','칼라마네로','거북손데스','일레도리자드','블로스터','드래캄','견고라스','아마루르가','님피아','루차불','데덴네',
	'멜리시','미끄래곤','클레피','대로트','펌킨인','크레베이스','음번'],
	['모크나이퍼','어흥염','누리레느','왕큰부리','형사구스','투구뿌논','모단단게','춤추새','에리본','루가루암','약어리','더시마사리','만마드',
	'깨비물거미','라란티스','마셰이드','염뉴트','이븐곰','달코퀸','하랑우탄','내던숭이','갑주무사','모래성이당','해무기','실버디','메테노',
	'자말라','폭거북스','토게데마루','따라큐','치갈기','할비롱','타타륜','짜랑고우거'],
	['그란돈','가이오가','레쿠쟈','칠색조','루기아','테오키스','뮤','뮤츠',
		'세레비','라티아스','라티오스','지라치','레지락','레지스틸','레지아이스','유크시',
		'아그놈','엠라이트','라이코','스이쿤','앤테이','파이어','프리져','썬더','피오네',
		'마나피','쉐이미','다크라이','디아루가','펄기아','기라티나','히드런','레지기가스',
		'크레세리아','아르세우스','토네로스','볼트로스','랜드로스','코바르온','테라키온',
		'비리디온','레시라무','제크로무','비크티니','메로엣타','케르디오','게노세크트',
		'제르네아스','이벨타르','디안시','후파','볼케니온',
		'카푸꼬꼬꼭','카푸나비나','카푸브루루','카푸느지느','솔가레오','루나아라','마기아나','마샤도','제라오라'],
	['텅비드','페로코체','매시붕','전수목','철화구야','종이신도','악식킹','아고용','차곡차곡','두파팡'],
	['미싱노','유령','지우의피카츄','큐레무','지가르데','네크로즈마']
];

exports.trainerranpoks=['이상해꽃','리자몽','거북왕','나무킹','대짱이','번치코','메가니움','블레이범','장크로다일','토대부기','초염몽','엠페르트','찌르호크','샤로다','염무왕','대검귀','브리가론','마폭시','개굴닌자','모크나이퍼','어흥염','누리레느','잠만보','망나뇽','해피너스','마기라스','보만다','메타그로스','포푸니라','자포코일','내룸벨트','거대코뿌리','덩쿠림보','마그마번','에레키블','전룡','보스로라','루카리오','한카리아스','드래피온','너트령','토게키스','글라이온','맘모꾸리','폴리곤Z','엘레이드','대코파스','야느와르몽','눈여아','로토무','악비아르','불비달마','타격귀','몰드류','삼삼드래','불카모스','조로아크','샹델라','액스라이즈','킬가르도','미끄래곤','따라큐','타타륜','짜랑고우거','그란돈','가이오가','레쿠쟈','디아루가','펄기아','히드런','팬텀','레시라무','제크로무','뮤츠','제르네아스','이벨타르','카푸꼬꼬꼭','카푸나비나','카푸브루루','카푸느지느','제라오라','유령','지우의피카츄','종이신도','전수목','철화구야']

exports.meganames=[
	'이상해꽃',
	'리자몽',
	'거북왕',
	'독침붕',
	'피죤투',
	'후딘',
	'야도란',
	'팬텀',
	'캥카',
	'쁘사이저',
	'갸라도스',
	'프테라',
	'뮤츠',
	'전룡',
	'강철톤',
	'핫삼',
	'헤라크로스',
	'헬가',
	'마기라스',
	'나무킹',
	'번치코',
	'대짱이',
	'가디안',
	'깜까미',
	'입치트',
	'보스로라',
	'요가램',
	'썬더볼트',
	'샤크니아',
	'폭타',
	'파비코리',
	'다크펫',
	'앱솔',
	'얼음귀신',
	'보만다',
	'메타그로스',
	'라티오스',
	'라티아스',
	'레쿠쟈',
	'이어롭',
	'한카리아스',
	'루카리오',
	'눈설왕',
	'엘레이드',
	'다부니',
	'디안시',
	'그란돈',
	'가이오가',
	'네크로즈마'
];

exports.megaafternames=[
	'메가이상해꽃',
	'메가리자몽X',
	'메가리자몽Y',
	'메가거북왕',
	'메가독침붕',
	'메가피죤투',
	'메가후딘',
	'메가야도란',
	'메가팬텀',
	'메가캥카',
	'메가쁘사이저',
	'메가갸라도스',
	'메가프테라',
	'메가뮤츠X',
	'메가뮤츠Y',
	'메가전룡',
	'메가강철톤',
	'메가핫삼',
	'메가헤라크로스',
	'메가헬가',
	'메가마기라스',
	'메가나무킹',
	'메가번치코',
	'메가대짱이',
	'메가가디안',
	'메가깜까미',
	'메가입치트',
	'메가보스로라',
	'메가요가램',
	'메가썬더볼트',
	'메가샤크니아',
	'메가폭타',
	'메가파비코리',
	'메가다크펫',
	'메가앱솔',
	'메가얼음귀신',
	'메가보만다',
	'메가메타그로스',
	'메가라티오스',
	'메가라티아스',
	'메가레쿠쟈',
	'메가이어롭',
	'메가한카리아스',
	'메가루카리오',
	'메가눈설왕',
	'메가엘레이드',
	'메가다부니',
	'메가디안시',
	'원시그란돈',
	'원시가이오가',
	'울트라네크로즈마'
];

exports.megapicture=[
	'https://static.wikia.nocookie.net/pokemon/images/1/17/%EB%A9%94%EA%B0%80%EC%9D%B4%EC%83%81%ED%95%B4%EA%BD%83_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20130904130327&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/a/ac/%EB%A9%94%EA%B0%80%EB%A6%AC%EC%9E%90%EB%AA%BDX_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170404233338&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/2/2f/%EB%A9%94%EA%B0%80%EB%A6%AC%EC%9E%90%EB%AA%BDY_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20130904131742&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/7/7b/%EB%A9%94%EA%B0%80%EA%B1%B0%EB%B6%81%EC%99%95_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20130904131725&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/9/97/%EB%A9%94%EA%B0%80%EB%8F%85%EC%B9%A8%EB%B6%95_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141015160317&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/a/ab/%EB%A9%94%EA%B0%80%ED%94%BC%EC%A3%A4%ED%88%AC_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141022121732&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/6/69/%EB%A9%94%EA%B0%80%ED%9B%84%EB%94%98_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131115151658&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/5/50/%EB%A9%94%EA%B0%80%EC%95%BC%EB%8F%84%EB%9E%80_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141022120903&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/d/d9/%EB%A9%94%EA%B0%80%ED%8C%AC%ED%85%80_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131101172210&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/5/5b/%EB%A9%94%EA%B0%80%EC%BA%A5%EC%B9%B4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131016102955&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/2/20/%EB%A9%94%EA%B0%80%EC%81%98%EC%82%AC%EC%9D%B4%EC%A0%80_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131115151832&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/7/79/%EB%A9%94%EA%B0%80%EA%B0%B8%EB%9D%BC%EB%8F%84%EC%8A%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131115152234&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/5/51/%EB%A9%94%EA%B0%80%ED%94%84%ED%85%8C%EB%9D%BC_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131115152045&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/f/f8/%EB%A9%94%EA%B0%80%EB%AE%A4%EC%B8%A0X_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20130916110725&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/e/e8/%EB%A9%94%EA%B0%80%EB%AE%A4%EC%B8%A0Y_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170405090316&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/0/0f/%EB%A9%94%EA%B0%80%EC%A0%84%EB%A3%A1_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170406072637&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/6/61/%EB%A9%94%EA%B0%80%EA%B0%95%EC%B2%A0%ED%86%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170409103151&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/1/14/%EB%A9%94%EA%B0%80%ED%95%AB%EC%82%BC_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20150122082737&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/a/ac/%EB%A9%94%EA%B0%80%ED%97%A4%EB%9D%BC%ED%81%AC%EB%A1%9C%EC%8A%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131115152219&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/7/7d/%EB%A9%94%EA%B0%80%ED%97%AC%EA%B0%80_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131115152300&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/c/cf/%EB%A9%94%EA%B0%80%EB%A7%88%EA%B8%B0%EB%9D%BC%EC%8A%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131101170147&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/f/f0/%EB%A9%94%EA%B0%80%EB%82%98%EB%AC%B4%ED%82%B9_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141022113116&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/8/8c/%EB%A9%94%EA%B0%80%EB%B2%88%EC%B9%98%EC%BD%94_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170412111525&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/3/3e/%EB%A9%94%EA%B0%80%EB%8C%80%EC%A7%B1%EC%9D%B4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141022113351&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/5/5e/%EB%A9%94%EA%B0%80%EA%B0%80%EB%94%94%EC%95%88_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131115111239&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/2/28/%EB%A9%94%EA%B0%80%EA%B9%9C%EA%B9%8C%EB%AF%B8_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20140805110210&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/7/7e/%EB%A9%94%EA%B0%80%EC%9E%85%EC%B9%98%ED%8A%B8_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170412224959&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/4/4a/%EB%A9%94%EA%B0%80%EB%B3%B4%EC%8A%A4%EB%A1%9C%EB%9D%BC_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170412225400&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/d/d4/%EB%A9%94%EA%B0%80%EC%9A%94%EA%B0%80%EB%9E%A8_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131115153042&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/c/cc/%EB%A9%94%EA%B0%80%EC%8D%AC%EB%8D%94%EB%B3%BC%ED%8A%B8_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131115111209&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/1/12/%EB%A9%94%EA%B0%80%EC%83%A4%ED%81%AC%EB%8B%88%EC%95%84_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141015161811&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/c/cc/%EB%A9%94%EA%B0%80%ED%8F%AD%ED%83%80_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141022121140&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/a/ab/%EB%A9%94%EA%B0%80%ED%8C%8C%EB%B9%84%EC%BD%94%EB%A6%AC_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141022120201&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/4/43/%EB%A9%94%EA%B0%80%EB%8B%A4%ED%81%AC%ED%8E%AB_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131115153143&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/b/b0/%EB%A9%94%EA%B0%80%EC%95%B1%EC%86%94_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170416044327&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/9/91/%EB%A9%94%EA%B0%80%EC%96%BC%EC%9D%8C%EA%B7%80%EC%8B%A0_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141022114722&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/8/88/%EB%A9%94%EA%B0%80%EB%B3%B4%EB%A7%8C%EB%8B%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20140810181815&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/d/da/%EB%A9%94%EA%B0%80%EB%A9%94%ED%83%80%EA%B7%B8%EB%A1%9C%EC%8A%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20140927174121&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/f/fb/%EB%A9%94%EA%B0%80%EB%9D%BC%ED%8B%B0%EC%98%A4%EC%8A%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141015155448&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/2/21/%EB%A9%94%EA%B0%80%EB%9D%BC%ED%8B%B0%EC%95%84%EC%8A%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141015155854&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/e/e0/%EB%A9%94%EA%B0%80%EB%A0%88%EC%BF%A0%EC%9F%88_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141015162944&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/f/f1/%EB%A9%94%EA%B0%80%EC%9D%B4%EC%96%B4%EB%A1%AD_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20140810182004&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/e/e2/%EB%A9%94%EA%B0%80%ED%95%9C%EC%B9%B4%EB%A6%AC%EC%95%84%EC%8A%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20130916104954&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/4/41/%EB%A9%94%EA%B0%80%EB%A3%A8%EC%B9%B4%EB%A6%AC%EC%98%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20130809183858&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/1/17/%EB%A9%94%EA%B0%80%EB%88%88%EC%84%A4%EC%99%95_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20131115153201&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/1/15/%EB%A9%94%EA%B0%80%EC%97%98%EB%A0%88%EC%9D%B4%EB%93%9C_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141022121449&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/f/fd/%EB%A9%94%EA%B0%80%EB%8B%A4%EB%B6%80%EB%8B%88_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141022120651&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/0/0b/%EB%A9%94%EA%B0%80%EB%94%94%EC%95%88%EC%8B%9C_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20141022115115&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/b/bc/%EC%9B%90%EC%8B%9C%EA%B7%B8%EB%9E%80%EB%8F%88_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170416102207&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/0/0f/%EC%9B%90%EC%8B%9C%EA%B0%80%EC%9D%B4%EC%98%A4%EA%B0%80_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170416101436&path-prefix=ko',
	'https://static.wikia.nocookie.net/pokemon/images/e/ee/%EC%9A%B8%ED%8A%B8%EB%9D%BC_%EB%84%A4%ED%81%AC%EB%A1%9C%EC%A6%88%EB%A7%88_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20171119132046&path-prefix=ko'
];

exports.formchangenames=[
	'로토무',
	'큐레무',
	'토네로스',
	'볼트로스',
	'랜드로스',
	'테오키스',
	'쉐이미',
	'후파',
	'디아루가',
	'펄기아',
	'기라티나',
	'아르세우스',
	'메로엣타',
	'캐스퐁',
	'도롱마담',
	'킬가르도',
	'지가르데',
	'네크로즈마'
];

exports.formchangestatus={
	'로토무':['로토무','히트로토무','워시로토무','스핀로토무','프로스트로토무','커트로토무'],
	'큐레무':['큐레무','블랙큐레무','화이트큐레무'],
	'토네로스':['화신폼','영물폼'],
	'볼트로스':['화신폼','영물폼'],
	'랜드로스':['화신폼','영물폼'],
	'테오키스':['노말폼','어택폼','디펜스폼','스피드폼'],
	'쉐이미':['랜드폼','스카이폼'],
	'후파':['굴레에 빠진 후파','굴레를 벗어난 후파'],
	'디아루가':['어나더폼','오리진폼'],
	'펄기아':['어나더폼','오리진폼'],
	'기라티나':['어나더폼','오리진폼'],
	'아르세우스':['노말폼','불구슬플레이트','물방울플레이트','초록플레이트','푸른하늘플레이트','암석플레이트','대지플레이트','주먹플레이트','강철플레이트','비단벌레플레이트','고드름플레이트','우뢰플레이트','맹독플레이트','이상한플레이트','원령플레이트','공포플레이트','용의플레이트','정령플레이트'],
	'메로엣타':['보이스폼','스텝폼'],
	'캐스퐁':['노말폼','태양의 모습','빗방울의 모습','설운의 모습'],
	'도롱마담':['초목도롱','모래땅도롱','슈레도롱'],
	'킬가르도':['실드폼','블레이드폼'],
	'지가르데':['50%폼','퍼펙트폼'],
	'네크로즈마':['황혼의 갈기','새벽의 날개']
};

exports.formchangeimage={
	"로토무":["",
	"https://static.wikia.nocookie.net/pokemon/images/5/55/%EB%A1%9C%ED%86%A0%EB%AC%B4_%ED%9E%88%ED%8A%B8_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20150810073157&path-prefix=ko",
	"https://static.wikia.nocookie.net/pokemon/images/4/4a/%EB%A1%9C%ED%86%A0%EB%AC%B4_%EC%9B%8C%EC%8B%9C_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20150810073210&path-prefix=ko",
	"https://static.wikia.nocookie.net/pokemon/images/5/54/%EB%A1%9C%ED%86%A0%EB%AC%B4_%EC%8A%A4%ED%95%80_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20150810073201&path-prefix=ko",
	"https://static.wikia.nocookie.net/pokemon/images/c/c7/%EB%A1%9C%ED%86%A0%EB%AC%B4_%ED%94%84%EB%A1%9C%EC%8A%A4%ED%8A%B8_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20150810073206&path-prefix=ko",
	"https://static.wikia.nocookie.net/pokemon/images/5/51/%EB%A1%9C%ED%86%A0%EB%AC%B4_%EC%BB%A4%ED%8A%B8_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20150810073218&path-prefix=ko"],
	"큐레무":["","https://static.wikia.nocookie.net/pokemon/images/0/0f/646%EB%B8%94%EB%9E%99%ED%81%90%EB%A0%88%EB%AC%B4.png/revision/latest/scale-to-width-down/200?cb=20170802060103&path-prefix=ko","https://static.wikia.nocookie.net/pokemon/images/a/a1/646%ED%99%94%EC%9D%B4%ED%8A%B8%ED%81%90%EB%A0%88%EB%AC%B4.png/revision/latest/scale-to-width-down/200?cb=20170802060325&path-prefix=ko"],
	"토네로스":["","https://static.wikia.nocookie.net/pokemon/images/c/c6/%ED%86%A0%EB%84%A4%EB%A1%9C%EC%8A%A4_%EC%98%81%EB%AC%BC%ED%8F%BC_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20170802054841&path-prefix=ko"],
	"볼트로스":["","https://static.wikia.nocookie.net/pokemon/images/4/41/%EB%B3%BC%ED%8A%B8%EB%A1%9C%EC%8A%A4_%EC%98%81%EB%AC%BC%ED%8F%BC_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20170802055217&path-prefix=ko"],
	"랜드로스":["","https://static.wikia.nocookie.net/pokemon/images/0/04/%EB%9E%9C%EB%93%9C%EB%A1%9C%EC%8A%A4_%EC%98%81%EB%AC%BC%ED%8F%BC_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20170802055916&path-prefix=ko"],
	"테오키스":["","https://static.wikia.nocookie.net/pokemon/images/7/7d/%ED%85%8C%EC%98%A4%ED%82%A4%EC%8A%A4_%EC%96%B4%ED%83%9D_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20170416103218&path-prefix=ko",
	"https://static.wikia.nocookie.net/pokemon/images/9/9f/%ED%85%8C%EC%98%A4%ED%82%A4%EC%8A%A4_%EB%94%94%ED%8E%9C%EC%8A%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20170416103353&path-prefix=ko",
	"https://static.wikia.nocookie.net/pokemon/images/3/3f/%ED%85%8C%EC%98%A4%ED%82%A4%EC%8A%A4_%EC%8A%A4%ED%94%BC%EB%93%9C_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20170416103457&path-prefix=ko"],
	"쉐이미":["","https://static.wikia.nocookie.net/pokemon/images/2/22/%EC%89%90%EC%9D%B4%EB%AF%B8_%EC%8A%A4%EC%B9%B4%EC%9D%B4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20170730125415&path-prefix=ko"],
	"후파":["","https://static.wikia.nocookie.net/pokemon/images/1/1b/%EA%B5%B4%EB%A0%88%EB%A5%BC_%EB%B2%97%EC%96%B4%EB%82%9C_%ED%9B%84%ED%8C%8C_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20150415060652&path-prefix=ko"],
	"디아루가":["","https://static.wikia.nocookie.net/pokemon/images/c/c8/%EB%94%94%EC%95%84%EB%A3%A8%EA%B0%80_%EC%98%A4%EB%A6%AC%EC%A7%84_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20220217120015&path-prefix=ko"],
	"펄기아":["","https://static.wikia.nocookie.net/pokemon/images/f/f2/%ED%8E%84%EA%B8%B0%EC%95%84_%EC%98%A4%EB%A6%AC%EC%A7%84_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20220217120017&path-prefix=ko"],
	"기라티나":["","https://static.wikia.nocookie.net/pokemon/images/9/91/%EA%B8%B0%EB%9D%BC%ED%8B%B0%EB%82%98_%EC%98%A4%EB%A6%AC%EC%A7%84_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20150810072347&path-prefix=ko"],
	"메로엣타":["","https://static.wikia.nocookie.net/pokemon/images/3/34/%EB%A9%94%EB%A1%9C%EC%97%A3%ED%83%80_%EC%8A%A4%ED%85%9D%ED%8F%BC_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20170802060824&path-prefix=ko"],
	"캐스퐁":["","https://static.wikia.nocookie.net/pokemon/images/d/d3/351a.png/revision/latest?cb=20161228132030&path-prefix=ko",
	"https://static.wikia.nocookie.net/pokemon/images/6/62/351b.png/revision/latest?cb=20161228132053&path-prefix=ko",
	"https://static.wikia.nocookie.net/pokemon/images/b/b6/351c.png/revision/latest?cb=20161228132206&path-prefix=ko"],
	"도롱마담":["","https://static.wikia.nocookie.net/pokemon/images/4/46/%EB%8F%84%EB%A1%B1%EB%A7%88%EB%8B%B4_%EB%AA%A8%EB%9E%98%EB%95%85%EB%8F%84%EB%A1%B1_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20150724223207&path-prefix=ko","https://static.wikia.nocookie.net/pokemon/images/f/fe/%EB%8F%84%EB%A1%B1%EB%A7%88%EB%8B%B4_%EC%8A%88%EB%A0%88%EB%8F%84%EB%A1%B1_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20150724223213&path-prefix=ko"],
	"킬가르도":["","https://static.wikia.nocookie.net/pokemon/images/1/18/%ED%82%AC%EA%B0%80%EB%A5%B4%EB%8F%84_%EB%B8%94%EB%A0%88%EC%9D%B4%EB%93%9C%ED%8F%BC_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20140226084111&path-prefix=ko"],
	"지가르데":["","https://static.wikia.nocookie.net/pokemon/images/0/0d/%EC%A7%80%EA%B0%80%EB%A5%B4%EB%8D%B0_%ED%8D%BC%ED%8E%99%ED%8A%B8%ED%8F%BC_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20170802123600&path-prefix=ko"],
	"네크로즈마":["","https://static.wikia.nocookie.net/pokemon/images/9/95/%ED%99%A9%ED%98%BC%EC%9D%98_%EA%B0%88%EA%B8%B0_%EB%84%A4%ED%81%AC%EB%A1%9C%EC%A6%88%EB%A7%88_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20171013235809&path-prefix=ko","https://static.wikia.nocookie.net/pokemon/images/a/a6/%EC%83%88%EB%B2%BD%EC%9D%98_%EB%82%A0%EA%B0%9C_%EB%84%A4%ED%81%AC%EB%A1%9C%EC%A6%88%EB%A7%88_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20171013235856&path-prefix=ko"]
};

exports.ballfail=[
    '안돼, 포켓몬이 볼에서 나와버렸어요!',
    '아아, 잡았다고 생각했는데!',
	'아쉽다, 잡을 수 있었는데!'
];

exports.advfail=[
    '이런, 허탕이군요...',
    '어, 저기 포켓몬이? ...아니라 바람에 흩날리는 나뭇가지였네요.',
	'어, 저기 포켓몬이? ...아니라 그냥 그림자였네요.',
	'어, 저기 포켓몬이? ...아니라 지나가던 사람이었네요.'
];

exports.specialimgpoks=[
'미싱노','유령','지우의피카츄'
];

exports.specialpoksimage=[
'https://static.wikia.nocookie.net/pokemon/images/e/ec/%EB%AF%B8%EC%8B%B1%EB%85%B8_%ED%8F%89%EC%83%81%EC%8B%9C_%ED%8F%BC.png/revision/latest?cb=20110717094443&path-prefix=ko',
'https://static.wikia.nocookie.net/pokemon/images/4/45/1%EC%84%B8%EB%8C%80_%EC%9C%A0%EB%A0%B9.png/revision/latest?cb=20110717094446&path-prefix=ko',
'https://static.wikia.nocookie.net/pokemon/images/5/58/%EB%8F%84%ED%8A%B8_7%EB%AA%A8%EB%8D%B8%EB%A7%81_025%EB%AC%B4%EC%9D%B8.gif/revision/latest?cb=20161207120655&path-prefix=ko'
];
