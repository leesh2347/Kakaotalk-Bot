const servers=["scania","bera","luna","jenis","croa","union","elysium","enosis","red","aurora","arcane","nova","average"];
const serverk=["스카니아","베라","루나","제니스","크로아","유니온","엘리시움","이노시스","레드","오로라","아케인","노바","평균"];
Jsoup = org.jsoup.Jsoup;
FS = FileStream;

var loc="sdcard/msgbot/Bots/무통시세/lastrecord.json";
if (FS.read(loc)==null) FS.write(loc, "{}");

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(msg.split(" ")[0]=="!물통"||msg.split(" ")[0]=="@물통")
{
var serv=msg.split(" ")[1];
if(serverk.indexOf(serv)==-1||serv=="평균")
{
var num=Number(parseInt(msg.split(" ")[2]));
try{
var a=Jsoup.connect("https://gamemarket.kr/api/price1.php").ignoreContentType(true).ignoreHttpErrors(true).get().text();
var str="";
for(var i=0;i<13;i++)
{
str=str+serverk[i]+" : "+JSON.parse(a)["direct"][servers[i]]+"\n";
}
FS.write(loc, a);
replier.reply("서버별 물통 시세 현황\n\n"+str+"\n\nThanks to CG아렌");
}
catch(e){
	var rd = JSON.parse(FS.read(loc));
	var strr="";
	for(var i=0;i<13;i++)
	{
	strr=strr+serverk[i]+" : "+rd["direct"][servers[i]]+"\n";
	}
	replier.reply("사이트 일시적 오류로 가장 최근 검색값을 출력합니다.\n서버별 물통 시세 현황\n\n"+strr+"\n\nThanks to CG아렌");
}
}
else
{
var num=Number(parseInt(msg.split(" ")[2]));
try{
var a=Jsoup.connect("https://gamemarket.kr/api/price1.php").ignoreContentType(true).ignoreHttpErrors(true).get().text();
var res=JSON.parse(a)["direct"][servers[serverk.indexOf(serv)]];
if(isNaN(num)) num=1;
FS.write(loc, a);
replier.reply("현재 ["+serv+"] 서버의 물통 시세 : "+res+"\n\n입력하신 "+num+"억의 시세는\n"+Number(res)*num+"원 입니다.\n\nThanks to CG아렌");
}
catch(e){
	var rd = JSON.parse(FS.read(loc));
	var ress=rd["direct"][servers[serverk.indexOf(serv)]];
	if(isNaN(num)) num=1;
	replier.reply("사이트 일시적 오류로 가장 최근 검색값을 출력합니다.\n현재 ["+serv+"] 서버의 물통 시세 : "+ress+"\n\n입력하신 "+num+"억의 시세는\n"+Number(ress)*num+"원 입니다.\n\nThanks to CG아렌");
	
}
}

}
}