const scriptName="soragodong";
const ments=["그래.","그.....래.","그럼~","아니.","안돼.","아.....니.","안.....돼.","언젠가는.","가만히 있어.","그것도 안돼.","다시 한 번 물어봐.","그렇고 말고.","그러지 마.","물론~","하지 마."];


function response(room, msg, sender, isGroupChat, replier, ImageDB) {
if(room == "메이플 키1네시스"||room=="바다 월드") return
else{
if(msg=="소라고동님")
replier.reply("왜.");
else if(msg.indexOf("소라고동님")!=(-1))
{
var r=Math.floor(Math.random()*100);
if(r==1)
replier.reply("고동이는 기여어>< 고동 고동");
else if(r==2)
replier.reply("그치만...."+sender+"쟝....이렇게라도 하지 않으면.....내겐 관심도 없는걸!");
else
{
var t=Math.floor(Math.random()*(ments.length));
replier.reply(ments[t]);
}
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