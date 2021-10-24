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
function skipnick(sender) //단축어
{
	var n="";
	if(sender.includes("디벨로이드")||sender=="이상훈")
		n="디벨로이드";
	else if(sender.includes("세렌디피티"))
		n="l세렌디피티l";
	else if(sender=="임주환")
		n="뤠먼듀블";
	else if(sender=="서연")
		n="뎅잇";
	else if(sender=="전태원")
		n="홍색리트머스";
	else if(sender=="ㅇㅅ")
		n="혼남팡";
	else if(sender=="윤근준")
		n="션추";
	else if(sender=="채하민")
		n="단혜설";
	else if(sender=="김태현")
		n="Rucee";
	else if(sender=="재우")
		n="베얌";
	else if(sender.includes("가을이없는날"))
		n="가을이없는날";
	else if(sender.includes("염동숙칠"))
		n="염동숙칠";
	else if(sender.includes("GTX"))
		n="GTXC노선";
	else if(sender.includes("도령"))
		n="SD도령";
	else if(sender.includes("쵸")&&sender.includes("쌤"))
		n="쵸쌤";
	else if(sender.includes("중단원"))
		n="중단원";
	else if(sender.includes("우락키네"))
		n="우락키네";
	else if(sender.includes("온큐리"))
		n="온큐리";
	return n;
} 
 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(room=="바다 월드") return
if(msg.split(" ")[0]=="@무릉")
{
var nick=msg.split(" ")[1];
if(nick==undefined)
	 nick=skipnick(sender);
var url="https://maple.gg/u/"+nick;
var data=Jsoup.connect(url).get();
var a=data.select(".character-card-additional>li>b").get(0).text();
var text="";
text=text+data.select(".character-card-summary-item").get(1).text()+"/"+data.select(".character-card-summary-item").get(2).text()+"\n";
if(a=="예전무릉")
{
text=text+"기록이 없습니다.\n\n개편전 무릉 기록\n";
}
text=text+"층수: "+data.select(".character-card-additional>li>span").get(0).text()+"\n시간: "+data.select(".character-card-additional>li>small").get(1).text();
replier.reply("["+nick+"]\n"+text);
}
if(msg.split(" ")[0]=="@유니온")
{
var nick=msg.split(" ")[1];
if(nick==undefined)
	 nick=skipnick(sender);
var url="https://maple.gg/u/"+nick;
var data=Jsoup.connect(url).get();
var a=data.select(".character-card-additional>li>span").get(1).text();
var text="";
if(a!="기록없음")
{
var n=data.select("#app > div.card.border-bottom-0 > div > section > div.row.text-center > div:nth-child(3) > section > footer > div.d-block.mb-1 > span").text().split("전투력 ")[1];
var num=Number(parseInt(n.replace(/,/g,"")));
var coin=Math.ceil(num*864/1000000000);
text=text+data.select(".character-card-additional>li>span").get(1).text()+"\n"+data.select(".character-card-additional>li>small").get(2).text()+"\n전투력: "+n+"\n일일 코인 수급량: "+coin;
replier.reply("["+nick+"]\n"+text);
}
else
replier.reply("["+nick+"]\n기록이 없습니다.\n유니온은 본캐만 조회가 가능합니다. 본캐인지 확인해주세요!");
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