const scriptName = "히스토리";
FS = FileStream;

var loc = "sdcard/katalkbot/Bots/maplelog.json";
var historynumloc = "sdcard/msgbot/Bots/히스토리/num.json";
if (FS.read(loc) == null) FS.write(loc, "{}");

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
var res=""
for(var i=0;i<7;i++){
	if(JSON.parse(b)[0][i+1]!=undefined)
	res=res+"\n"+JSON.parse(b)[0][i+1]+" : Lv."+JSON.parse(a)[i]["level"]+"("+JSON.parse(a)[i]["exp"]+"%)";
}
replier.reply("["+name+"]님의 경험치 히스토리\n"+res);
}catch(e){
replier.reply("없는 캐릭터 입니다.");}
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
var res=""
for(var i=0;i<7;i++){
	if(JSON.parse(s2)["x"][i+1]!=undefined)
		res=res+"\n"+JSON.parse(s2)["x"][i+1]+" : Lv."+JSON.parse(s2)["level"][i+1];
}
replier.reply("["+name+"]님의 레벨 히스토리\n"+res);
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