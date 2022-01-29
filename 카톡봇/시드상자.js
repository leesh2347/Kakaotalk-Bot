const scriptName = "시드상자";
const itemname = ["리스트레인트 링","웨폰퍼프 - S링","웨폰퍼프 - I링","웨폰퍼프 - L링","웨폰퍼프 - D링","얼티메이덤 링","리스트테이커 링","링 오브 썸","크리데미지 링","크라이시스 - HM링","타워인헨스 링","버든리프트 링","오버패스 링","레벨퍼프 - S링","레벨퍼프 - D링","레벨퍼프 - I링","레벨퍼프 - L링","헬스컷 링","크리디펜스 링","리밋 링","듀라빌리티 링","리커버디펜스 링","실드스와프 링","마나컷 링","크라이시스 - H링","크라이시스 - M링","크리쉬프트 링","스탠스쉬프트 링","리커버스탠스 링","스위프트 링","리플렉티브 링","오션 글로우 이어링","시드 포인트 보따리 5개","경험치 2배 쿠폰(15분) 3개","깨진 상자 조각 5개"];
const itemrate = [424,262,262,262,262,262,262,185,185,185,185,185,185,185,185,185,185,185,185,185,162,162,162,162,162,162,162,162,162,162,162,49,587,723,5000];


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(room=="바다 월드"||room=="키네연구소") return
if(msg=="상자깡"){
      var ran = Math.random()*10000;
      var a = 0;
      var b = itemrate[0];
      var isring=0;
      for(var j = 0 ; j < itemrate.length ; j++){
         if(ran>=a && ran<b)
         {
            if(itemname[j].indexOf("링")!=(-1)&&itemname[j]!="오션 글로우 이어링") isring=1;
            var res="";
            if(isring==1)
            {
               var r = Math.random()*100;
               var lev=1;
               if(r<42) lev=1;
               else if(r>41&&r<70) lev=2;
               else if(r>69&&r<90) lev=3;
               else lev=4;
               res=itemname[j]+" ("+lev+"레벨)";
            }
            else res=itemname[j];
            replier.reply("["+sender+"] 님의 1급 상자 결과....\n\nㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n"+res+"\nㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ");
            return;
         }
         else{
            a=b;
            b=b+itemrate[j+1];
         }
      }
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
