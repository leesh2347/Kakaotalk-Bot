const servers=["scania","bera","luna","jenis","croa","union","elysium","enosis","red","aurora","arcane","nova","average"];
const serverk=["스카니아","베라","루나","제니스","크로아","유니온","엘리시움","이노시스","레드","오로라","아케인","노바","평균"];
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
if(msg.split(" ")[0]=="!물통")
{
var serv=msg.split(" ")[1];
if(serverk.indexOf(serv)==-1||serv=="평균")
{
var num=Number(parseInt(msg.split(" ")[2]));
var a=Jsoup.connect("https://gamemarket.kr/api/price1.php").ignoreContentType(true).ignoreHttpErrors(true).get().text();
var str="";
for(var i=0;i<13;i++)
{
str=str+serverk[i]+" : "+JSON.parse(a)["direct"][servers[i]]+"\n";
}
replier.reply("서버별 물통 시세 현황\n\n"+str+"\n\nThanks to CG아렌");
}
else
{
var num=Number(parseInt(msg.split(" ")[2]));
var a=Jsoup.connect("https://gamemarket.kr/api/price1.php").ignoreContentType(true).ignoreHttpErrors(true).get().text();
var res=JSON.parse(a)["direct"][servers[serverk.indexOf(serv)]];
replier.reply("현재 ["+serv+"] 서버의 물통 시세 : "+res+"\n\n입력하신 "+num+"억의 시세는\n"+Number(res)*num+"원 입니다.\n\nThanks to CG아렌");
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