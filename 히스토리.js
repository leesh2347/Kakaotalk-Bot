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
	else if(sender.includes("우락키네"))
		n="우락키네";
	else if(sender.includes("중단원"))
		n="중단원";
	else if(sender.includes("온큐리"))
		n="온큐리";
	return n;
} 
 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(msg.split(" ")[0]=="!히스토리"){
var name=msg.split(" ")[1];
if(name==undefined)
	name=skipnick(sender);
if(name=="") replier.reply("닉네임을 입력해 주세요.");
else
{
try{
var url="https://maple.gg/u/"+name;
var data = org.jsoup.Jsoup.connect(url).get();
var s=data.getElementsByTag("script").select("script").get(26).toString()

var a=s.split("var expHistoryLabels = ")[1].split("c3.generate")[0]
var b=s.split("columns: ")[1].split("\"exp\"")[0]
b=b+"]]"

var res=""
for(var i=0;i<7;i++) res=res+"\n"+JSON.parse(b)[0][i+1]+" : Lv."+JSON.parse(a)[i]["level"]+"("+JSON.parse(a)[i]["exp"]+"%)";
replier.reply("["+name+"]님의 경험치 히스토리\n"+res);
}catch(e){
replier.reply("없는 캐릭터 입니다.");}
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