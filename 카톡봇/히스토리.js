const scriptName = "히스토리";
FS = FileStream;

var loc = "sdcard/katalkbot/Bots/maplelog.json";
var historynumloc = "sdcard/msgbot/Bots/히스토리/num.json";
if (FS.read(loc) == null) FS.write(loc, "{}");

//var a = [12, 34, 25, 63, 53, 34], l = 10
function graph(a,a2,d,l) {
//a(array)는 배열, l(length)은 그래프 길이
return Array(a.length).fill(100).map((_,i)=>d[i]+'\n|'+'█'.repeat(l*a[i]/_)+' ▏▎▍▌▋▊▉█'.split('')[(a[i]/_%1)*8+0.5|0]+' '+a2[i]+"("+a[i]+"%)").join('\n')
}

function graph2(a,d,l) {
//a(array)는 배열, l(length)은 그래프 길이
return Array(a.length).fill(Math.max.apply(null,a)).map((_,i)=>d[i]+'\n|'+'█'.repeat(l*a[i]/_)+' ▏▎▍▌▋▊▉█'.split('')[(a[i]/_%1)*8+0.5|0]+' Lv.'+a[i]).join('\n')
}

function recordnick(sender,nick){
	var rd = JSON.parse(FS.read(loc));
	if(rd[sender]==undefined) rd[sender] = {};
	if(rd[sender][nick]==undefined)rd[sender][nick] = 0;
	rd[sender][nick] = rd[sender][nick]+1;
	var n=""
	var temparr = [];
		for (i in rd[sender]){
			temparr.push(i+"/"+rd[sender][i]);
		}
		temparr.sort((a, b)=>a.split("/")[1] - b.split("/")[1]).reverse();
		n=temparr[0].split("/")[0];
	if(rd[sender][nick]>30&&nick==n){
		rd[sender] = {};
		rd[sender][nick] = 2;
	}
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

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(msg.split(" ")[0]=="!히스토리"||msg.split(" ")[0]=="@히스토리"){
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
var data2=data.getElementsByTag("script").select("script");
var s = "";
var num = JSON.parse(FS.read(historynumloc))["history"];
s = data2.get(num).toString();
var a=s.split("var expHistoryLabels = ")[1].split(";\n        c3.generate")[0]
var b=s.split("columns: ")[1].split("\"exp\"")[0]
b=b+"]]"
var arr=[]
var arr2=[]
var darr=[]
for(var i=0;i<7;i++){
	if(JSON.parse(b)[0][i+1]!=undefined)
	{
		darr.push(JSON.parse(b)[0][i+1])
		arr.push(JSON.parse(a)[i]["exp"])
		arr2.push(JSON.parse(a)[i]["level"])
	}
}
var min=arr[0];
var max=arr[arr.length-1];
if(min>max) max=max+100;
var lvup=Math.ceil((100-arr[arr.length-1])/((max-min)/arr.length));
replier.reply("["+name+"]님의 경험치 히스토리\n\n"+graph(arr,arr2,darr,5)+"\n\n예상 다음 레벨업: "+lvup+"일 후");

}catch(e){
replier.reply("없는 캐릭터 입니다.\n이 메시지가 계속 표시된다면 메이플지지 사이트의 구조에 문제가 생겼을 수 있습니다.");}

}
}
if(msg.split(" ")[0]=="!레벨히스토리"||msg.split(" ")[0]=="@레벨히스토리"){
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
var data2=data.getElementsByTag("script").select("script");
var s = "";
var num = JSON.parse(FS.read(historynumloc))["levhistory"];
s = data2.get(num).toString();
var s2=s.split("columns: ")[1].split(",\n                labels:")[0].replace("[[","{[").replace("]]","]}").replace("[\"x\"","\"x\":[\"1\"").replace(" [\"level\"","\"level\":[\"1\"");
var arr=[]
var darr=[]
for(var i=0;i<7;i++){
	if(JSON.parse(s2)["x"][i+1]!=undefined){
		darr.push(JSON.parse(s2)["x"][i+1])
		arr.push(JSON.parse(s2)["level"][i+1])
	}
}
replier.reply("["+name+"]님의 레벨 히스토리\n\n"+graph2(arr,darr,5));
}catch(e){
replier.reply("없는 캐릭터 입니다.");}
}
}
}
 

function onStartCompile() {
	var historynumloc = "sdcard/msgbot/Bots/히스토리/num.json";
	if (FS.read(historynumloc) == null) {
		let d = { "history": 0, "levhistory": 0 };
		FS.write(historynumloc, JSON.stringify(d));
	}
	let numrd = JSON.parse(FS.read(historynumloc));
	//지지 히스토리 위치 탐색, 임의로 닉네임 하나 넣음
	var url = "https://maple.gg/u/디벨로이드";
	var data = org.jsoup.Jsoup.connect(url).get();
	var data2 = data.getElementsByTag("script").select("script");
	var n = 0;
	var n1 = 0;
	for (var i = 0; i < data2.length; i++) {
		if (data2.get(i).toString().includes("var expHistoryLabels = ")) {
			n = i;
			break;
		}
	}
	numrd["history"] = n;
	for (var i = 0; i < data2.length; i++) {
		if (data2.get(i).toString().includes("c3.generate({") && !(data2.get(i).toString().includes("var expHistoryLabels"))) {
			n1 = i;
			break;
		}
	}
	numrd["levhistory"] = n1;
	if(numrd["levhistory"]!=0&&numrd["history"]!=0)
		FS.write(historynumloc, JSON.stringify(numrd));
}

function onNotificationPosted(sbn, sm) {
    var packageName = sbn.getPackageName();
    if (!packageName.startsWith("com.kakao.tal")) return;
    var actions = sbn.getNotification().actions;
    if (actions == null) return;
    var userId = sbn.getUser().hashCode();
    for (var n = 0; n < actions.length; n++) {
        var action = actions[n];
        if (action.getRemoteInputs() == null) continue;
        var bundle = sbn.getNotification().extras;

        var msg = bundle.get("android.text").toString();
        var sender = bundle.getString("android.title");
        var room = bundle.getString("android.subText");
        if (room == null) room = bundle.getString("android.summaryText");
        var isGroupChat = room != null;
        if (room == null) room = sender;
        var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, "");
        var icon = bundle.getParcelableArray("android.messages")[0].get("sender_person").getIcon().getBitmap();
        var image = bundle.getBundle("android.wearable.EXTENSIONS");
        if (image != null) image = image.getParcelable("background");
        var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
        com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
        if (this.hasOwnProperty("responseFix")) {
            responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, userId != 0);
        }
    }
}
