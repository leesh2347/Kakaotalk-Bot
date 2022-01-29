var food;
function response(room, msg, sender, isGroupChat, replier, ImageDB) {
   if(room!="바다 월드"){
      if(msg=="뭐먹지") {
            food=new Array("햄버거","피자","삼겹살","닭갈비","돈까스","초밥","회덮밥","짜장면","짬뽕","탕수육","굶어","재획","민트초코","장어구이","순대국밥","부대찌개","보쌈","갈비탕","꼬리곰탕","삼계탕","칼국수","쌀국수뚝배기","한솥","편의점도시락","봉구스밥버거","냉면","A+등급한우","볶음밥","오므라이스","떡만두국","순두부찌개","된장찌개","스파게티","함박스테이크","마라탕","탄탄면","규카츠","규동","치킨","닭볶음탕","라면","라볶이","전복죽","지코바치밥","전주비빔밥","족발","명륜진사갈비","니가? 먹어? 왜?");
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
