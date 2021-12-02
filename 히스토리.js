const scriptName = "히스토리";
FS = FileStream;
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
var loc="sdcard/katalkbot/Bots/maplelog.json";
if (FS.read(loc)==null) FS.write(loc, "{}");

function recordnick(sender,nick){
	var rd = JSON.parse(FS.read(loc));
	if(rd[sender]==undefined) rd[sender] = {};
	if(rd[sender][nick]==undefined)rd[sender][nick] = 0;
	rd[sender][nick] = rd[sender][nick]+1;
	FS.write(loc, JSON.stringify(rd))
	
}

function recommendnick(sender,replier){
	var n="";
	var rd = JSON.parse(FS.read(loc));
	if(rd[sender]==undefined){
		rd[sender] = {};
		n="";
	}
	else{
		result = [];
		for (i in rd[sender]){
			result.push(i+"/"+rd[sender][i]);
		}
		result.sort((a, b)=>a.split("/")[1] - b.split("/")[1]).reverse();
		n=result[0].split("/")[0];
	}
	
	return n;
}
 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(msg.split(" ")[0]=="!히스토리"){
var name=msg.split(" ")[1];
if(name==undefined)
	name=recommendnick(sender,replier);
if(name=="") replier.reply("닉네임을 입력해 주세요.");
else
{
recordnick(sender,name);
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