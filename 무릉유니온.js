const scriptName = "무릉유니온";
Jsoup=org.jsoup.Jsoup
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
if(room=="바다 월드") return
if(msg.split(" ")[0]=="@무릉")
{
var url="https://maple.gg/u/"+msg.split(" ")[1];
var data=Jsoup.connect(url).get();
var a=data.select(".character-card-additional>li>b").get(0).text();
var text="";
text=text+data.select(".character-card-summary-item").get(1).text()+"/"+data.select(".character-card-summary-item").get(2).text()+"\n";
if(a=="예전무릉")
{
text=text+"기록이 없습니다.\n\n개편전 무릉 기록\n";
}
text=text+"층수: "+data.select(".character-card-additional>li>span").get(0).text()+"\n시간: "+data.select(".character-card-additional>li>small").get(1).text();
replier.reply("["+msg.split(" ")[1]+"]\n"+text);
}
if(msg.split(" ")[0]=="@유니온")
{
var url="https://maple.gg/u/"+msg.split(" ")[1];
var data=Jsoup.connect(url).get();
var a=data.select(".character-card-additional>li>span").get(1).text();
var text="";
if(a!="기록없음")
{
var n=data.select("#app > div.card.border-bottom-0 > div > section > div.row.text-center > div:nth-child(3) > section > footer > div.d-block.mb-1 > span").text().split("전투력 ")[1];
var num=Number(parseInt(n.replace(/,/g,"")));
var coin=Math.ceil(num*864/1000000000);
text=text+data.select(".character-card-additional>li>span").get(1).text()+"\n"+data.select(".character-card-additional>li>small").get(2).text()+"\n전투력: "+n+"\n일일 코인 수급량: "+coin;
replier.reply("["+msg.split(" ")[1]+"]\n"+text);
}
else
replier.reply("["+msg.split(" ")[1]+"]\n기록이 없습니다.\n유니온은 본캐만 조회가 가능합니다. 본캐인지 확인해주세요!");
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