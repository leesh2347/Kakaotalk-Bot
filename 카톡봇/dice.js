var banrooms=["바다 월드","키네연구소","낚시터","메이플 키네시스"];

function response(room, msg, sender, isGroupChat, replier, ImageDB) {
if(banrooms.includes(room)) return;
else{
if (msg == '@주사위') {
        var a = Math.floor((Math.random() * 100) + 1);
        if(a>0&&a<2)
 replier.reply("망이네요.....주사위가 "+a+" 나왔습니다.");
else if(a>1&&a<10)
 replier.reply("오늘의 운은 꽝이군요....주사위가 "+a+" 나왔습니다.");
else if(a>9&&a<20)
 replier.reply("어렵겠군요. 너무 슬퍼마세요....주사위가 "+a+" 나왔습니다.");
else if(a>19&&a<30)
 replier.reply("주사위는 아무 잘못이 없어요...주사위가 "+a+" 나왔습니다.");
else if(a>29&&a<40)
 replier.reply("괜찮아요, 다음엔 잘 나오겠죠. 주사위가 "+a+" 나왔습니다.");
else if(a>39&&a<50)
 replier.reply("조금 아깝네요...한번 더 해볼래요? 주사위가 "+a+" 나왔습니다.");
else if(a>49&&a<60)
 replier.reply("그래도 절반은 넘겼네요! 주사위가 "+a+" 나왔습니다.");
else if(a>59&&a<70)
 replier.reply("흠....나쁘진 않네요. 주사위가 "+a+" 나왔습니다.");
else if(a>69&&a<80)
 replier.reply("순전히 운빨! 좀 더 해봐요! 주사위가 "+a+" 나왔습니다.");
else if(a>79&&a<90)
 replier.reply("오호~대단하군요! 주사위가 "+a+" 나왔습니다.");
else if(a>89&&a<96)
 replier.reply("행운의 여신이 함께하길. 주사위가 "+a+" 나왔습니다.");
else if(a==100)
 replier.reply("AI 루시가 확실하게 보증합니다. 주사위가 "+a+" 나왔습니다!");
else
 replier.reply("AI 루시가 보증합니다. 주사위가 "+a+" 나왔습니다!");
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