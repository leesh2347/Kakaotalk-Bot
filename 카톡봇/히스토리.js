const scriptName = "히스토리";
FS = FileStream;

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
var s="";
for(var i=20;i<30;i++){
	if(data2.get(i).toString().includes("var expHistoryLabels = ")){
		s=data2.get(i).toString();
		break;
	}
}
var a=s.split("var expHistoryLabels = ")[1].split("c3.generate")[0]
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
var s="";
for(var i=20;i<30;i++){
	if(data2.get(i).toString().includes("c3.generate({")&&!(data2.get(i).toString().includes("var expHistoryLabels"))){
		s=data2.get(i).toString();
		break;
	}
}
var s2=s.split("columns: ")[1].split(",\n                labels:")[0].replace("[[","{[").replace("]]","]}").replace("[\"x\"","\"x\":[\"1\"").replace(" [\"level\"","\"level\":[\"1\"");
var s3=JSON.parse(s2);

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