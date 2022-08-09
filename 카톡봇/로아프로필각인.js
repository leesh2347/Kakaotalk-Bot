FS = FileStream;
const kalink=require('kaling_config');
const kaling=kalink.kaling;
const { KakaoLinkClient } = require('kakaolink');
const Kakao =new KakaoLinkClient(kaling.key,kaling.url);
Kakao.login(kaling.email,kaling.password);
 
var loc="sdcard/katalkbot/Bots/loalog.json";
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
  if(room=="키네연구소") return;
  if(msg.split(" ")[0]=="@로아"||msg.split(" ")[0]=="!로아") {
   try{ 
        var nick = msg.split(" ")[1];
        if(nick==undefined)
           nick=recommendnick(sender,replier);
        if(nick=="") replier.reply("닉네임을 입력해 주세요.");
        else
        {
           recordnick(sender,nick);
           var a=org.jsoup.Jsoup.connect("https://lostark.game.onstove.com/Profile/Character/"+encodeURIComponent(nick)).header("referrer","https://lostark.game.onstove.com").header("content-type", "application/x-www-form-urlencoded; charset=UTF-8").data("memberNo", "l4hDdfILC1alFbTIUSPkO42bMb+bnyPi3CeFuKxi4vw=").data("worldNo", "ua/3l9nKTmxZWGSrvdE1IgK21Zs3E2eAbJNncGnV4tI=").data("pcId", "1xeBlgCfGJQUV2nugoVOV1336mH0ZtY9VVq6vkj4DiU=").ignoreContentType(true).ignoreHttpErrors(true).post();
           var img=a.select(".profile-equipment>div>img").attr("src");
            var ilev=a.select(".level-info2__expedition>span").text().split("장착 아이템 레벨 ")[1];
            var server=a.select(".profile-character-info__server").text().split("@")[1];
            var job=a.select(".profile-equipment>div>img").attr("alt");
            var guild=a.select(".game-info__guild").text().split("길드")[1];
            var ulev=a.select(".level-info__expedition>span").text().split("원정대 레벨 ")[1];
         Kakao.sendLink(room, {
         "link_ver":"4.0",
         "template_id":(81159),
         "template_args":{
            'IMG':img,
			'SERVER':server,
            'ULEV':ulev,
            'GUILD':guild,
            'ILEV':ilev,
            'NAME':nick,
            'JOB':job
            }
         }, "custom")
      }
   }
   catch(e)
   {
      var nick = msg.split(" ")[1];
      replier.reply("["+nick+"]\n존재하지 않는 캐릭터 입니다.");
   }
}

if(msg.split(" ")[0]=="@각인"||msg.split(" ")[0]=="!각인") {
   try{ 
        var nick = msg.split(" ")[1];
        if(nick==undefined)
           nick=recommendnick(sender,replier);
        if(nick=="") replier.reply("닉네임을 입력해 주세요.");
        else
        {
           recordnick(sender,nick);
           var a=org.jsoup.Jsoup.connect("https://lostark.game.onstove.com/Profile/Character/"+encodeURIComponent(nick)).header("referrer","https://lostark.game.onstove.com").header("content-type", "application/x-www-form-urlencoded; charset=UTF-8").data("memberNo", "l4hDdfILC1alFbTIUSPkO42bMb+bnyPi3CeFuKxi4vw=").data("worldNo", "ua/3l9nKTmxZWGSrvdE1IgK21Zs3E2eAbJNncGnV4tI=").data("pcId", "1xeBlgCfGJQUV2nugoVOV1336mH0ZtY9VVq6vkj4DiU=").ignoreContentType(true).ignoreHttpErrors(true).post();
           var job=a.select(".profile-equipment>div>img").attr("alt");
		   var b=a.select(".profile-ability-engrave>div>div").select("li>span").text();
		   var arr=b.split("3 ").join("3#").split("2 ").join("2#").split("1 ").join("1#").split("#");
		   var gak1="";
		   var gak2="";
		   for(var i=0;i<arr.length;i++)
		   {
			   if(arr[i].includes("감소"))
				   gak2=gak2+arr[i]+"\n";
			   else
				   gak1=gak1+arr[i]+"\n";
		   }
		   if(gak2=="")
			   replier.reply("["+nick+"]님의 보유 각인\n직업: "+job+"\n\n"+gak1);
		   else
			   replier.reply("["+nick+"]님의 보유 각인\n직업: "+job+"\n\n"+gak1+"\n\n-보유 패널티 각인-\n"+gak2);
      }
   }
   catch(e)
   {
      var nick = msg.split(" ")[1];
      replier.reply("["+nick+"]\n존재하지 않는 캐릭터 입니다.");
   }
}



}