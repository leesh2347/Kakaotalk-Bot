const scriptName = "극성비";
Jsoup = org.jsoup.Jsoup
var sungbi=[571115568,6120258214,27279159629,90403788195];

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
//극성비
if(msg.split(" ")[0]=="!극성비"||msg.split(" ")[0]=="@극성비"){
var index=Number(msg.split(" ")[1]);
if(isNaN(index)||index>299||index<1) replier.reply("레벨은 1~299 사이 숫자만 입력해 주세요.");
else{
var l=Jsoup.connect("http://wachan.me/exp_api.php?exp1="+index).ignoreContentType(true).ignoreHttpErrors(true).get().text();
var e = JSON.parse(l).result;

var guk=627637515116/Number(parseInt(e.replace(/,/g,"")))*100;
var tae=238203293384/Number(parseInt(e.replace(/,/g,"")))*100;
var res=0;
if(guk>=100)
	replier.reply("극한 성장의 비약: 레벨 249 이하까지 1업,\n그 이상부터는 249레벨의 100% 경험치만큼 지급")
else
	replier.reply(index+"레벨에서 극성비를 마셨을때의 경험치 획득량 : "+guk.toFixed(3)+"%");
}
}

//태성비
if(msg.split(" ")[0]=="!태성비"||msg.split(" ")[0]=="@태성비"){
var index=Number(msg.split(" ")[1]);
if(isNaN(index)||index>299||index<1) replier.reply("레벨은 1~299 사이 숫자만 입력해 주세요.");
else{
var l=Jsoup.connect("http://wachan.me/exp_api.php?exp1="+index).ignoreContentType(true).ignoreHttpErrors(true).get().text();
var e = JSON.parse(l).result;

var guk=627637515116/Number(parseInt(e.replace(/,/g,"")))*100;
var tae=238203293384/Number(parseInt(e.replace(/,/g,"")))*100;
var res=0;
if(tae>=100)
	replier.reply("태풍 성장의 비약: 레벨 239 이하까지 1업,\n그 이상부터는 239레벨의 100% 경험치만큼 지급")
else
	replier.reply(index+"레벨에서 태성비를 마셨을때의 경험치 획득량 : "+tae.toFixed(3)+"%");
}
}

//익성비
if(msg.split(" ")[0]=="!익성비"||msg.split(" ")[0]=="@익성비"){
var index=Number(msg.split(" ")[1]);
if(isNaN(index)||index>299||index<1) replier.reply("레벨은 1~299 사이 숫자만 입력해 주세요.");
else{
var l=Jsoup.connect("http://wachan.me/exp_api.php?exp1="+index).ignoreContentType(true).ignoreHttpErrors(true).get().text();
var e = JSON.parse(l).result;
var s=sungbi[0]/Number(parseInt(e.replace(/,/g,"")))*100;
var res=0;
if(s>=100)
	replier.reply("익스트림 성장의 비약: 141~199레벨까지 1~10레벨 랜덤으로 레벨업,\n그 이상부터는 199레벨의 100% 경험치만큼 지급")
else
	replier.reply(index+"레벨에서 익성비를 마셨을때의 경험치 획득량 : "+s.toFixed(3)+"%");
}
}

//200성비
if(msg.split(" ")[0]=="!성비1"||msg.split(" ")[0]=="@성비1"){
var index=Number(msg.split(" ")[1]);
if(isNaN(index)||index>299||index<1) replier.reply("레벨은 1~299 사이 숫자만 입력해 주세요.");
else{
var l=Jsoup.connect("http://wachan.me/exp_api.php?exp1="+index).ignoreContentType(true).ignoreHttpErrors(true).get().text();
var e = JSON.parse(l).result;
var s=sungbi[1]/Number(parseInt(e.replace(/,/g,"")))*100;
var res=0;
if(s>=100)
	replier.reply("성장의 비약(200~209): 해당 레벨 구간에서 1업,\n그 이상부터는 209레벨의 100% 경험치만큼 지급")
else
	replier.reply(index+"레벨에서 200성비를 마셨을때의 경험치 획득량 : "+s.toFixed(3)+"%");
}
}

//210성비
if(msg.split(" ")[0]=="!성비2"||msg.split(" ")[0]=="@성비2"){
var index=Number(msg.split(" ")[1]);
if(isNaN(index)||index>299||index<1) replier.reply("레벨은 1~299 사이 숫자만 입력해 주세요.");
else{
var l=Jsoup.connect("http://wachan.me/exp_api.php?exp1="+index).ignoreContentType(true).ignoreHttpErrors(true).get().text();
var e = JSON.parse(l).result;
var s=sungbi[2]/Number(parseInt(e.replace(/,/g,"")))*100;
var res=0;
if(s>=100)
	replier.reply("성장의 비약(210~219): 해당 레벨 구간에서 1업,\n그 이상부터는 219레벨의 100% 경험치만큼 지급")
else
	replier.reply(index+"레벨에서 210성비를 마셨을때의 경험치 획득량 : "+s.toFixed(3)+"%");
}
}

//220성비
if(msg.split(" ")[0]=="!성비3"||msg.split(" ")[0]=="@성비3"){
var index=Number(msg.split(" ")[1]);
if(isNaN(index)||index>299||index<1) replier.reply("레벨은 1~299 사이 숫자만 입력해 주세요.");
else{
var l=Jsoup.connect("http://wachan.me/exp_api.php?exp1="+index).ignoreContentType(true).ignoreHttpErrors(true).get().text();
var e = JSON.parse(l).result;
var s=sungbi[3]/Number(parseInt(e.replace(/,/g,"")))*100;
var res=0;
if(s>=100)
	replier.reply("성장의 비약(220~229): 해당 레벨 구간에서 1업,\n그 이상부터는 229레벨의 100% 경험치만큼 지급")
else
	replier.reply(index+"레벨에서 220성비를 마셨을때의 경험치 획득량 : "+s.toFixed(3)+"%");
}
}



}
