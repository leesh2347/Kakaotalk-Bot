const scriptName = "타자게임";
var ans="";
var ans_fake="";
var start_time=null;
var isplaying=0;
var playingroom="";
Jsoup = org.jsoup.Jsoup
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
if(msg=="!타자게임"&&room!="키네연구소"){
if(isplaying==1)
replier.reply("[루시] 이미 이 방 또는 다른 방에서 진행 중인 게임이 있습니다.");
else{
var u = Jsoup.connect("https://m.search.naver.com/search.naver?sm=top_hty&fbm=0&ie=utf8&query=명언").get();
var a = u.select("div._front");
var b;
var c;
let box = [];
for (var i = 0; i < a.size(); i++)
{ b = a.select("p.text_ko").get(i).text();
c = a.select("span.name").get(i).text(); box.push(b);
}

ans=box[Math.random() * box.length | 0];
ans_fake=ans.split(" ").join(" \u200b");
start_time=Date.now();
isplaying=1;
playingroom=room;
replier.reply("[루시] 타자게임을 시작합니다!\n\n제시된 문장: "+ans_fake);
}
}

if(room!="키네연구소"&&isplaying==1){
if(room==playingroom){
var n=Date.now();
var playtime=((n-start_time)/1000).toFixed(2);

if(msg==ans){
isplaying=0;
playingroom="";
start_time=null;
replier.reply("[루시] '"+sender+"'님이 정답을 입력하셨습니다!\n\n걸린 시간: "+playtime+"초");
}

if(playtime>120)
{
isplaying=0;
playingroom="";
start_time=null;
replier.reply("[루시] 정답을 입력하지 않은 채로 2분이 지나 타자게임이 종료됩니다.");
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
