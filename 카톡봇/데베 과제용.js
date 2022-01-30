Jsoup = org.jsoup.Jsoup;
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
if(room.includes("디벨로이드")&&msg.split("!데베")){
var name=msg.split(" ")[1];
var url="https://pokemon.fandom.com/ko/wiki/"+encodeURIComponent(name);
var data = Utils.getWebText(url).replace(/(<([^>]+)>)/g, "").replace(/[\n\s]{2,}/g,"\n");

data=data.split("function mfTempOpenSection(id)")[1]

var type=data.split("타입\n")[1].split("분류\n")[0];
var category=data.split("분류\n")[1].split("효과\n")[0];
var effect=data.split("효과\n")[1].split("위력\n")[0];
var power=data.split("위력\n")[1].split("명중률\n")[0];
var accu=data.split("명중률\n")[1].split("PP\n")[0];
var pp=data.split("PP\n")[1].split(" (최대")[0];
var priority=data.split("우선도\n")[1].split("범위\n")[0];
var range=data.split("범위\n")[1].split("이 기술은...")[0];

var res="INSERT INTO 기술 VALUES(\'"+name+"\',\'"+effect+"\',\'"+type+"\',"+pp+","+priority+",\'"+range+"\',\'"+category+"\',"+power+","+accu+")\;  ";
res=res.replace(/[\n]{1,}/g,"");
res=res.replace(/[\']{2,}/g,"NULL");
res=res.replace(/[—]{1,}/g,"NULL");

replier.reply(res);
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
