const scriptName = "히스토리";
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
if(msg.split(" ")[0]=="!히스토리"){
var name=msg.split(" ")[1];
try{
var url="https://maple.gg/u/"+name;
var data = org.jsoup.Jsoup.connect(url).get();
var s=data.getElementsByTag("script").select("script").get(26).toString()

var a=s.split("var expHistoryLabels = ")[1].split("c3.generate")[0]
var b=s.split("columns: ")[1].split("\"exp\"")[0]
b=b+"]]"

var res=""
for(var i=0;i<7;i++) res=res+JSON.parse(b)[0][i+1]+" : Lv."+JSON.parse(a)[i]["level"]+"("+JSON.parse(a)[i]["exp"]+"%)\n";
replier.reply("["+name+"]님의 경험치 히스토리\n"+res);
}catch(e){
replier.reply("없는 캐릭터 입니다.");}
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