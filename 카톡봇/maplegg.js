const scriptName = "maplegg";
FS = FileStream;
//const kalingModule = require('kaling').Kakao();
const { KakaoLinkClient } = require('kakaolink');
const Kakao =new KakaoLinkClient("aaaaa","aaaaa");
Kakao.login('aaaaa','aaaaa');
 
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
  if(room=="바다 월드") return;
  if(msg.split(" ")[0]=="@메이플") {
	try{ 
		  var nick = msg.split(" ")[1];
		  if(nick==undefined)
			  nick=recommendnick(sender,replier);
		  if(nick=="") replier.reply("닉네임을 입력해 주세요.");
		  else
		  {
			  recordnick(sender,nick);
			  var isreboot=org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick).get().select("#container > div > div > div:nth-child(4)").text();
			  if(isreboot!="랭킹정보가 없습니다.")
			  {
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
			  }
			  else
			  {
				  var img = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick+"&w=254").get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td.left > span > img:nth-child(1)").get(0).select("img").attr("src");
				  var datar = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick+"&w=254").get().select("tr.search_com_chk").select("dd");//공홈파싱
				  var job = datar.get(0).text().split("/")[1].split("\">\"")[0];//직업
				  var serverimg=org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick+"&w=254").get().select("tr.search_com_chk").select("dt").select("img").attr("src")
				  var data = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick+"&w=254").get().select("tr.search_com_chk").select("td");//공홈파싱
				  var lv = data.get(2).text().replace("Lv.", "");//td 3번째줄, 'Lv.'은 보기 좀 그래서 삭제
				  var exp = data.get(3).text();//td 4번째줄
				  var pop = data.get(4).text();//td 5번째줄
				  var gu = data.get(5).text();//td 6번째줄
				  var unity = "레벨: " + lv +" │ "+"인기도: "+ pop + "\n길드: "+ gu;
			  }
			Kakao.sendLink(room, {
			"link_ver":"4.0",
			"template_id":(58792),
			"template_args":{
				//이곳에 템플릿 정보를 입력하세요.
				'CHARIMG':img,
				'CHARNAME':nick+" │ "+job,
				'SERVER':serverimg,
				'DESC':unity,
				'LINK':"u/"+nick
				}
			}, "custom")
		}
	}
	catch(e)
	{
		var nick = msg.substr(5);
		replier.reply("["+nick+"]\n존재하지 않는 캐릭터 입니다.\n혹시 캐릭터가 있는데도 이 멘트가 보인다면 갱신 한번 해주세요~\n\nmaple.gg/u/"+nick);
	}
}


if(msg.split(" ")[0]=="@코디") {
	try{ 
		  var nick = msg.split(" ")[1];
		  if(nick==undefined)
			  nick=recommendnick(sender,replier);
		  if(nick=="") replier.reply("닉네임을 입력해 주세요.");
		  else
		  {
			  recordnick(sender,nick);
			  var isreboot=org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick).get().select("#container > div > div > div:nth-child(4)").text();
			  if(isreboot!="랭킹정보가 없습니다.")
				  var img = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick).get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td.left > span > img:nth-child(1)").get(0).select("img").attr("src");
			  else
				  var img = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c=" +nick+"&w=254").get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td.left > span > img:nth-child(1)").get(0).select("img").attr("src");
			Kakao.sendLink(room, {
			"link_ver":"4.0",
			"template_id":(61194),
			"template_args":{
			//이곳에 템플릿 정보를 입력하세요.
			'IMG':img
			}
			}, "custom")
		}
	}
	catch(e)
	{
		var nick = msg.substr(5);
		replier.reply("["+nick+"]\n존재하지 않는 캐릭터 입니다.\n혹시 캐릭터가 있는데도 이 멘트가 보인다면 갱신 한번 해주세요~\n\nmaple.gg/u/"+nick);
	}
}



}