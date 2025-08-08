Jsoup=org.jsoup.Jsoup;
FS = FileStream;
var loc="sdcard/katalkbot/Bots/maplelog.json";
if (FS.read(loc)==null) FS.write(loc, "{}");

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

function stat(nick,sender){
	var ocid1 = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/id?character_name="+encodeURIComponent(nick)).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	var ocid2=JSON.parse(ocid1)["ocid"];

	var answer = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/stat?ocid="+ocid2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	var t=JSON.parse(answer);
	recordnick(sender,nick);
	var r="";
	for(var i=0;i<t["final_stat"].length;i++)
	{
	   if(t["final_stat"][i]["stat_name"]!="전투력")
		  r+=t["final_stat"][i]["stat_name"]+": "+Number(t["final_stat"][i]["stat_value"]).comma()+"\n";
	}
	var atk=Number(t["final_stat"][42]["stat_value"]).comma();
	return [
	"["+nick+"]",
	"전투력: "+atk,
	"\u200b".repeat(500),
	"스공: "+Number(t["final_stat"][0]["stat_value"]).comma()+" ~ "+Number(t["final_stat"][1]["stat_value"]).comma(),
	"STR: "+Number(t["final_stat"][16]["stat_value"]).comma(),
	"DEX: "+Number(t["final_stat"][17]["stat_value"]).comma(),
	"INT: "+Number(t["final_stat"][18]["stat_value"]).comma(),
	"LUK: "+Number(t["final_stat"][19]["stat_value"]).comma(),
	"",
	"HP: "+Number(t["final_stat"][20]["stat_value"]).comma(),
	"MP: "+Number(t["final_stat"][21]["stat_value"]).comma(),
	"공격력: "+Number(t["final_stat"][40]["stat_value"]).comma(),
	"마력: "+Number(t["final_stat"][41]["stat_value"]).comma(),
	"",
	"보스 몬스터 데미지: "+Number(t["final_stat"][3]["stat_value"])+"%",
	"방어율 무시: "+Number(t["final_stat"][5]["stat_value"])+"%",
	"데미지: "+Number(t["final_stat"][2]["stat_value"])+"%",
	"최종 데미지: "+Number(t["final_stat"][4]["stat_value"])+"%",
	"크리티컬 데미지: "+Number(t["final_stat"][7]["stat_value"])+"%",
	"상태이상 추가 데미지: "+Number(t["final_stat"][37]["stat_value"])+"%",
	"일반 몬스터 데미지: "+Number(t["final_stat"][32]["stat_value"])+"%",
	"",
	"크리티컬 확률: "+Number(t["final_stat"][6]["stat_value"])+"%",
	"버프 지속시간: "+Number(t["final_stat"][30]["stat_value"])+"%",
	"공격 속도: "+Number(t["final_stat"][31]["stat_value"]),
	"상태이상 내성: "+Number(t["final_stat"][8]["stat_value"]),
	"소환수 지속시간 증가: "+Number(t["final_stat"][43]["stat_value"]),
	"재사용 대기시간 감소(초): "+Number(t["final_stat"][33]["stat_value"])+"초",
	"재사용 대기시간 감소(%): "+Number(t["final_stat"][34]["stat_value"])+"%",
	"재사용 대기시간 미적용: "+Number(t["final_stat"][35]["stat_value"])+"%",
	"",
	"스타포스: "+Number(t["final_stat"][13]["stat_value"]),
	"아케인포스: "+Number(t["final_stat"][14]["stat_value"]),
	"어센틱포스: "+Number(t["final_stat"][15]["stat_value"]),
	"",
	"아이템 드롭률: "+Number(t["final_stat"][28]["stat_value"])+"%",
	"메소 획득량: "+Number(t["final_stat"][29]["stat_value"])+"%",
	"추가 경험치 획득: "+Number(t["final_stat"][39]["stat_value"])+"%",
	].join("\n");
}

Number.prototype.comma = function() {
   var coma=this.toString().replace(/(?=(\d{3})+(?!\d))/g, ",");
   if(coma[0]==",") coma=coma.substr(1);
return coma;
}
 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMention, logId, channelId, userHash) {
if(room=="바다 월드") return

if(msg.split(" ")[0]=="@스탯"||msg.split(" ")[0]=="!스탯")
{
var nick=msg.split(" ")[1];
if(nick==undefined)
    nick=recommendnick(sender,replier);
if(nick=="") replier.reply("닉네임을 입력해 주세요.");
else{
try{

	var res=stat(nick, sender);
	replier.reply(res);

}
catch(e){
   replier.reply("["+nick+"]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.");
}
}
}

}

