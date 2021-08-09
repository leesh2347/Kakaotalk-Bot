const scriptName = "maplegg";
const { KakaoLinkClient } = require('kakaolink');
const Kakao =new KakaoLinkClient("2e2549bbfab7c0a3c7e6bf230e0ff54f","http://bigmoonworld.p-e.kr");
Kakao.login('2leesh2347@gmail.com','l6372325');
 
function skipnick(sender) //단축어
{
	var n="";
	if(sender.includes("디벨로이드")||sender=="이상훈")
		n="디벨로이드";
	else if(sender=="둔나")
		n="손성";
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
	else if(sender.includes("마법의쥐"))
		n="마법의쥐";
	else if(sender.includes("루시드키네"))
		n="루시드키네o";
	else if(sender.includes("싶으레"))
		n="싶으레";
	else if(sender.includes("따끈따끈밀크"))
		n="따끈따끈밀크";
	else if(sender.includes("최로"))
		n="최로";
	else if(sender.includes("우락키네"))
		n="우락키네";
	else if(sender.includes("온큐리"))
		n="온큐리";
	return n;
} 

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(room=="바다 월드") return;
  if(msg.split(" ")[0]=="@메이플") {
try{ 
      var nick = msg.split(" ")[1];
	  if(nick==undefined)
		  nick=skipnick(sender);
      var img = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick).get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td.left > span > img:nth-child(1)").get(0).select("img").attr("src");
      var datar = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick).get().select("tr.search_com_chk").select("dd");//공홈파싱
      var job = datar.get(0).text().split("/")[1].split("\">\"")[0];//직업
	  var serverimg=org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick).get().select("tr.search_com_chk").select("dt").select("img").attr("src")
      var data = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick).get().select("tr.search_com_chk").select("td");//공홈파싱
      var lv = data.get(2).text().replace("Lv.", "");//td 3번째줄, 'Lv.'은 보기 좀 그래서 삭제
      var exp = data.get(3).text();//td 4번째줄
      var pop = data.get(4).text();//td 5번째줄
      var gu = data.get(5).text();//td 6번째줄
      var unity = "레벨: " + lv +" │ "+"인기도: "+ pop + "\n길드: "+ gu;
      
Kakao.sendLink(room, {
"link_ver":"4.0",
"template_id":(58792),
"template_args":{
'CHARIMG':img,
'CHARNAME':nick+" │ "+job,
'SERVER':serverimg,
'DESC':unity,
'LINK':"u/"+nick
}
}, "custom")

}
catch(e)
{
var nick = msg.substr(5);
replier.reply("["+nick+"]\n존재하지 않는 캐릭터 입니다.\n혹시 캐릭터가 있는데도 이 멘트가 보인다면 갱신 한번 해주세요~\n\nmaple.gg/u/"+nick);
}
 
 
}
}