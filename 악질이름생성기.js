var d=['도둑', '연쇄절도범', '수호자', '담당일진', '약탈자', '방문판매원', '파괴자', '테러범', '교제사실을들킨', '뺏어먹는', '관찰자', '밑장빼기9단', '추종자', '셔틀', '지배자', '사재기빌런', '갈취왕', '단속반', '스틸러']
var d2=['카사노바', '소리없는방귀빌런', '절대강자', '노숙자', '진상손님', '술고래', '터줏대감', '트월킹머신', '관짝춤머신', '화장실문지기', '탈모인협회장', '지박령', '푸드파이터', '잔반처리반', '앞을서성이는', '청소부장', '앞에서절두번하는', '축구대회태클마스터', '에서코딱지파다가뒤통수맞는', '개미핥기조련사', '공문서위조마스터', '층간소음마스터']

var b=['노인정', '사우나', '성인용품점', '러브호텔', '피시방', '국어학원', '수학학원', '영어학원', '과학학원', '기숙학원', '기숙사', '독서실', '대형마트', '스터디카페', '노약자석', '임산부석', '장애인석', '대형마트시식코너', '경찰서', '대중목욕탕', '무료급식소', '초등학교', '중학교', '고등학교', '편의점', '학원가', '세탁소', '풋살장', '미용실', '찜질방', '동사무소', '전통시장', '태권도장', '놀이터', '헬스장', '할매순댓국밥', '버스정류장', '삼성프라자', '국회의사당', '흡연실', '아파트관리사무소', '생활관', '서점', '도서관', '급식실', '휴대폰대리점', '주유소', '공원', '에버랜드', '롯데월드', '지하철', '지하철역', '시내버스', '고속버스', '중화반점', '동대문시장', '맘스터치', '맥도날드', '롯데리아', '우정사업본부', '길고양이급식소', '휴지통속', '반찬가게', '동물원', '왁싱샵', '노인복지관', '공중화장실', '설빙', '배스킨라빈스', '피자스쿨']

var c = ['수건', '때밀이수건', '할머니때밀이수건', '흑돌', '백돌', '러브젤', '노트', '교재', '연필심', '샤프심', '휴대폰충전기', '마우스', '지우개', '테이저건', '콘돔', '분필', '젓가락', '잔디', '바리깡', '틀니', '잼민이휴대폰', '할아버지지팡이', '종이컵', '비타민', '리코더', '줄넘기', '프로틴', '단백질', '다데기', '탈모치료제', '생각하는의자', '단무지', '진라면순한맛', '짝퉁명품', '진동벨', '이쑤시개', '영양갱', '계란장수계란', '씹던껌', '고양이사료', '개사료', '휴지쪼가리', '냅킨', '락앤락통', '슬리퍼', '가발', '곽티슈', '케찹', '빨대', '마스크', '이유식', '에어컨', '연유', '돋보기', '홈런볼', '캐스터네츠', '숟가락', '파마산가루']

var a = ['동탄', '서울', '부산', '인천', '대구', '대전', '광주', '울산', '제주', '수원', '고양', '용인', '창원', '성남', '청주', '부천', '화성', '남양주', '전주', '천안', '안산', '안양']
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(msg.split(" ")[0]=="!악질이름"){
var str="";
str=str+a[Math.floor(Math.random()*(a.length))];
str=str+b[Math.floor(Math.random()*(b.length))];
if(Math.floor(Math.random()*2)==0)
{
str=str+d2[Math.floor(Math.random()*(d2.length))];
}
else
{
str=str+c[Math.floor(Math.random()*(c.length))];
str=str+d[Math.floor(Math.random()*(d.length))];
}
if(msg.split(" ")[1]!=undefined) str=str+msg.split(" ")[1];
replier.reply(str);
}
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}