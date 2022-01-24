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
	'battleexit':'@배틀취소',
	'battlenext':'@다음',
	'skillchange':'@스킬뽑기',
	'leaguechar':'@리그캐릭터',
    'levelup':'@레벨업',
	'ribbon':'@리본종류',
	'giveup':'@배틀기권',
	'eventinfo':'@포켓몬이벤트',
	'seasoninfo':'@포켓몬계절'
};

/* 설정값 (잘못건들면 버그생겨요. 백업해두고 하세요) */
exports.setting={
    'p':{
        'g4':0,  //전포
        'g3':1,
        'g2':19,
        'g1':60,
        'i':10,  //아이템
        'g':10,  //돈
    },  //확률(%) (*모두 더해서 100을 만들것*)
    'success':Number(70),  //기본성공률(%)
	'catchsuccess':[1,15,30,40], //기본포획률(%)
	'run':[40,30,20,10], //도주확률(%)
    'ballPrice':[500,2000,5000,10000,20000,30000,50000,80000,150000,250000,500000],  //볼구매가격(골드)
    'maxball':Number(50),  //볼 최대갯수(개)
	'ballg4':[0,0,0.1,1,2,3,5,7,9,11,13], //전설 볼강화 출현률
	'ballg3':[0,0.1,1,4,8,12,16,20,25,31,35], //레어 볼강화 출현률
	'ballupPrice':[5000,50000,250000,800000,3000000,7500000,15000000,30000000,80000000,150000000,0], //볼별 다음볼로 업그레이드비용
	'ballupsucc':[10,30,50,100,200,300,500,700,1000,2000,0], //볼강화 요구 포켓몬 발견 횟수
    'ballcatch':[0.5,2,3,5],  //볼강화 포획률(g4~g1)
    'maxlevel':Number(200),  //포켓몬 만렙
    'castT':{'min':30,'max':40},  //탐험소요시간(30~40초사이 랜덤을 뜻함)
    'ranknum':Number(30),  //랭킹 출력갯수(개)
	'balluplev':10,
	'leaguecharacter':'메가뮤츠X',
	//eventp변수: 추가 부여 스탯(이벤트 개최 등에 사용) (이벤트가 없을 땐 모두 0으로 해두셈)
	'eventp':{
		'g4':0, //전설 추가 출현률
		'g3':0,  //레어 추가 출현률
		'g4catch':0,  //전설 추가 포획률
		'g3catch':0,  //레어 추가 포획률
		'allcatch':0,  //나머지 추가 포획률
		'goldX':1 //모든 골드 획득량 배수(평상시 1로 두면 됨)
	},
    'rank':{
        'upif':[0,1,10,25,50,100,200,300,500,1000,2000,0,0],  //랭크업조건(포획성공횟수)
        'name':['신입 트레이너','초보 트레이너','엘리트 트레이너','베테랑 트레이너','레드 트레이너','블루 트레이너','브론즈 트레이너','실버 트레이너','골드 트레이너','블랙 트레이너','포켓몬 마스터','챔피언','개발자'],  //칭호이름
        'success':[0,1,3,5,8,12,16,20,25,30,30,30,30],  //추가 탐험성공률(%)
		'successcatch':[0,0.1,0.5,1,2,3,4,5,6,7,10,20,100],  //추가 포획성공률(%)
        'maxHp':[20,30,40,50,70,100,120,150,170,190,210,250,999999],  //최대체력
        'rest':[15000,14000,13000,12000,11000,10000,9000,8000,7000,6000,5000,4000,1000],  //체력 +1 회복당 휴식시간
        'castT':[0,1,3,5,7,9,11,14,17,20,30,50,100]  //탐험 소요시간 단축(%)
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
		'지그제구리','갈모매','테일로','깝질무'],
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
		'어둠대신','해골몽','대굴레오','진주몽','메탕','아공이'],
    'group3':[
        '강철톤','갸라도스','메타몽','라프라스','빈티나','토게피','폴리곤',
		'암나이트','투구','프테라','아노딥스','노고치','눈꼬마','무장조',
		'깜까미','시라칸','코터스','루나톤','솔록','릴링','트로피우스','앱솔',
		'사랑동이','화강돌','흔들풍손','파이리','이상해씨','꼬부기','브케인','리아코','치코리타',
		'물짱이','아차모','나무지기','모부기','불꽃숭이','팽도리',
		'한바이트','포푸니라','신뇽','데기라스','쉘곤','메탕구'],
    'group4':[
        '로토무','그란돈','가이오가','레쿠쟈','칠색조','루기아','테오키스','뮤','뮤츠',
		'세레비','라티아스','라티오스','지라치','레지락','레지스틸','레지아이스','유크시',
		'아그놈','엠라이트','라이코','스이쿤','앤테이','파이어','프리져','썬더','피오네',
		'마나피','쉐이미','다크라이','디아루가','펄기아','기라티나','히드런','레지기가스',
		'크레세리아','아르세우스']
};
//그룹3 레어 그룹4 전설

//계절별 출현률 증가 포켓몬 목록
exports.seasons={
	'spring':['캐스퐁','파이리','불꽃숭이','아차모','브케인','가디','식스테일','이상해씨','치코리타','모부기','버섯꼬','니로우','깨비참',
		'나무지기','모다피','로젤리아','해너츠','통통코','무스틈니','도토링','마그비','포니타','델빌','구구','켄타로스','밀탱크',
		'찌르꼬','테일로','부우부','삐','푸푸린','핑복','토게피','질퍽이','꼴깍몬','파비코','아공이','리오르','이브이','주뱃','두두','네이티',
		'블루','흔들풍손','파이어','칠색조','테오키스','뮤','뮤츠','세레비','쉐이미','앤테이','크레세리아','아르세우스'],
	'summer':['캐스퐁','트로피우스','갈모매','우파','잉어킹','갸라도스','연꽃몬','형광어','콘치','고래왕자','타만타','총어','별가사리','고라파덕','토중몬',
		'팽도리','꼬부기','리아코','물짱이','침바루','샤프니아','루리리','깝질무','브이젤','삐딱구리','스콜피','코산호','글라이거','가재군','크랩','진주몽',
		'왕눈해','비구술','도롱충이','개무소','페이검','캐터피','뿔충이','콘팡','피콘','헤라크로스','쁘사이저','빈티나','아라리','덩쿠리','메리프',
		'아보','세비퍼','꼬링크','피츄','플러시','마이농','파치리스','찌리리공','레디바','왕자리','사랑동이','썬더라이','야돈','세꿀버리',
		'가이오가','루기아','라티아스','라티오스','썬더','스이쿤','라이코','유크시','아그놈','엠라이트','피오네','마나피','펄기아'],
	'autumn':['캐스퐁','딥상어동','꼬마돌','롱스톤','히포포타스','알통몬','마크탕','코터스','마그마그','디그다',
		'동미러','루나톤','솔록','애버라스','메탕','선인왕','톱치','둔타','무장조','코코리','코코파스','또가스',
		'뿔카노','가보리','꼬지지','모래두지','코일','오뚝군','입치트','니드런♂','니드런♀','탕구리',
		'그란돈','레지락','레지스틸','히드런','지라치','디아루가'],
	'winter':['캐스퐁','요가랑','랑딸랑','포푸니','눈쓰개','대굴레오','쥬쥬','꾸꾸리','딜리버드','뽀뽀라','눈꼬마',
		'고오스','무우마','해골몽','어둠대신','쟝고','깜지곰','앱솔','깜까미','화강돌','라프라스','쏘드라','미뇽',
		'로토무','레지아이스','프리져','레지기가스','기라티나','다크라이']
};

exports.ballArr=[
    '몬스터볼','슈퍼볼','하이퍼볼','네트볼','다이브볼','다크볼','타이마볼','퀵볼','마스터볼','프레셔스볼','울트라볼'
];

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