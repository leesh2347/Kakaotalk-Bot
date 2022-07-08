const { KakaoLinkClient } = require('kakaolink');
const Kakao =new KakaoLinkClient("aaa","http://asdf");
Kakao.login('asdf','asdf');
const result=["메린이 응애 나 애기 메린","무자본 평균","경손실 따질 스펙","메이플 평균","메창","메이플 인생 메생이","컨텐츠가 부족한 토끼공듀","넥슨 VVIP 흑우 ㅋㅋ"];
Jsoup=org.jsoup.Jsoup
var lev;
var murung;
var union;

function calculate(nickname,isrbt){
   var url="https://maple.gg/u/"+nickname;
   var data=Jsoup.connect(url).get();
   murung=Number(data.select(".character-card-additional>li>span").get(0).text().replace("층", ""));
   if(isNaN(murung))
	   murung=0;
   if(murung!=0)
	   union=Number(data.select(".character-card-additional>li>small").get(2).text().replace("Lv.", ""));
   else
	   union=Number(data.select(".character-card-additional>li>small").get(0).text().replace("Lv.", ""));
   if(isrbt==0)
	   lev=Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c="+nickname).get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td:nth-child(3)").text().replace("Lv.", "");
   else
	   lev=Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c="+nickname+"&w=254").get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td:nth-child(3)").text().replace("Lv.", "");
}
 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(room!="바다 월드"){
if(msg=="!메창"||msg=="@메창")
{
replier.reply(["사용법: !메창 (닉네임)",
	"",
	"레벨-100+무릉x3+유니온/45",
	"※유니온 8500 이상: 유니온/35",
	"※무릉 50 이상=무릉x4로 계산",
	"※레벨 250 이상시 10, 260 이상시 20, 275 이상시 40 가중치 부여",
	"",
	"200~300 : 메린이",
	"301~400 : 무자본 평균",
	"401~450 : 메른이",
	"451~550 : 메이플 평균",
	"551~650 : 메창",
	"651~700 : 메이플 인생.",
	"701~750 : 토끼공듀",
	"751~800 : 넥슨 VVIP",
	"801+ : ?"
	].join("\n"));
}
else if(msg.split(" ")[0]=="!메창"){
lev=0;
murung=0;
union=0;
var nick=msg.split(" ")[1];
try{
var isreboot=org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick).get().select("#container > div > div > div:nth-child(4)").text();
if(isreboot!="랭킹정보가 없습니다.") calculate(nick,0);
else calculate(nick,1);
var judge=0;
var res=0;
if(murung>49) judge=judge+(murung*4);
else judge=judge+(murung*3);
if(union>8499) judge=judge+(union/35);
else judge=judge+(union/45);
if(Number(lev)>274)
	judge=Math.ceil(judge)+Number(lev)-60;
else if(Number(lev)>259)
	judge=Math.ceil(judge)+Number(lev)-80;
else if(Number(lev)>249)
	judge=Math.ceil(judge)+Number(lev)-90;
else
	judge=Math.ceil(judge)+Number(lev)-100;
if(judge<301) res=0;
else if(judge<401) res=1;
else if(judge<451) res=2;
else if(judge<551) res=3;
else if(judge<651) res=4;
else if(judge<701) res=5;
else if(judge<751) res=6;
else if(judge<801) res=7;
else res=8;
if(isNaN(judge))
replier.reply("본캐여부를 확인해주세요!\n본캐(월드 내 가장 레벨이 높은 캐릭터)가 아니면 측정할 수 없습니다.");
else
{
if(isreboot!="랭킹정보가 없습니다."){
	var img = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick).get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td.left > span > img:nth-child(1)").get(0).select("img").attr("src");
	var datar = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick).get().select("tr.search_com_chk").select("dd");//공홈파싱
	var job = datar.get(0).text().split("/")[1].split("\">\"")[0];//직업
	var serverimg=org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick).get().select("tr.search_com_chk").select("dt").select("img").attr("src")
}
else{
	var img = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick+"&w=254").get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td.left > span > img:nth-child(1)").get(0).select("img").attr("src");
	var datar = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick+"&w=254").get().select("tr.search_com_chk").select("dd");//공홈파싱
	var job = datar.get(0).text().split("/")[1].split("\">\"")[0];//직업
	var serverimg=org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick+"&w=254").get().select("tr.search_com_chk").select("dt").select("img").attr("src")
}
var desctext="직업: "+job+" │ 레벨: "+lev+"\n무릉: "+murung+"층 │ 유니온: "+union;
var buttontext="";
if(res<8)
	buttontext=result[res]+" ("+judge+"점)";
else
	buttontext="넥슨 창문 \""+judge+"\"개 오너";

Kakao.sendLink(room, {
"link_ver":"4.0",
"template_id":(58792),
"template_args":{
//이곳에 템플릿 정보를 입력하세요.
'CHARIMG':img,
'CHARNAME':"["+nick+"]님의 메창력",
'SERVER':serverimg,
'DESC':desctext,
'BUTTON':buttontext,
'LINK':"u/"+nick
}
}, "custom")

}
}catch(e)
{
   replier.reply("본캐여부를 확인해주세요!\n본캐(월드 내 가장 레벨이 높은 캐릭터)가 아니면 측정할 수 없습니다.");
}
}
}
}