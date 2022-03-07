var banrooms=["바다 월드","키네연구소","낚시터","메이플 키네시스"];

var food=["짜장","짬뽕","오징어순대","파스타","육교","마라탕","한신닭발","스페셜정식","츄르","창세의뱃지","찜닭","재획","모듬회", "스테이크", "치즈버거", "김밥", "마라탕", "쌀국수", "칼국수", "매운닭발", "카이센동", "돈까스", "덮밥", "삼겹살", "갈매기살", "갈비", "치킨", "피자", "전", "김치찌개", "된장찌개", "해물찜", "갈비찜", "찜닭", "닭도리탕", "짜글이", "비빔밥", "쭈꾸미볶음", "제육볶음", "곱창", "감자탕", "냉면", "소바",  "쫄면", "떡볶이", "김치찜", "부대찌개", "탕수육","칠리새우", "크림새우", "샤브샤브", "닭갈비", "족발", "보쌈", "반반족발", "불족발", "랍스터", "튀김","메밀전병", "볶음밥", "샐러드", "리조또", "죽", "야끼소바", "오코노미야끼", "계란말이", "미역국", "생선구이", "마라샹궈", "훠궈", "모듬꼬치", "육회", "카레", "전골", "까수엘라", "조개구이", "라면", "초밥", "와플", "한정식", "북엇국","니가?먹어?왜?","먹이를주지마시오","코어젬스톤","응애나아기맘마줘응애","초이스아잉성형쿠폰","모코코씨앗","명륜진사갈비"];
function response(room, msg, sender, isGroupChat, replier, ImageDB) {
   if(banrooms.includes(room)) return;
   if(msg.split(" ")[0]=="뭐먹지"||msg.split(" ")[0]=="ㅁㅁㅈ") {
		  var n=msg.split(" ")[1];
		  if(1<n&&n<11){
			  var res=[];
			  var t="";
			  for(var i=0;i<n;i++)
			  {
				  do{
					  t=food[Math.floor(Math.random()*(food.length))];
				  }while(res.includes(food[t]));
				  res.push(t);
			  }
			  replier.reply(sender+"님의 추천 메뉴는\n\n"+res.join(","));
		  }
		  else
		  {
            var t=Math.floor(Math.random()*(food.length));
            replier.reply("선택장애 "+sender+"님!\n메뉴는 ["+food[t]+"]입니다 ^.^");
		  }
   }
}

function onStartCompile(){
    /*컴파일 또는 Api.reload호출시, 컴파일 되기 이전에 호출되는 함수입니다.
     *제안하는 용도: 리로드시 자동 백업*/
    
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState,activity) {
    var layout=new android.widget.LinearLayout(activity);
    layout.setOrientation(android.widget.LinearLayout.HORIZONTAL);
    var txt=new android.widget.TextView(activity);
    txt.setText("액티비티 사용 예시입니다.");
    layout.addView(txt);
    activity.setContentView(layout);
}
function onResume(activity) {}
function onPause(activity) {}
function onStop(activity) {}