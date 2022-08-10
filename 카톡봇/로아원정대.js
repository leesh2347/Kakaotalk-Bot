FS = FileStream;
 
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
  if(msg.split(" ")[0]=="@원정대"||msg.split(" ")[0]=="!원정대") {
   try{ 
        var nick = msg.split(" ")[1];
        if(nick==undefined)
           nick=recommendnick(sender,replier);
        if(nick=="") replier.reply("닉네임을 입력해 주세요.");
        else
        {
           recordnick(sender,nick);
           var a=org.jsoup.Jsoup.connect("https://lostark.game.onstove.com/Profile/Character/"+encodeURIComponent(nick)).get();
		   var server=a.select(".profile-character-info__server").text().split("@")[1];
		   var n=0;
         var data=a.select(".profile-character-list__char");
		 var data2;
		 for(var i=0;i<data.length;i++){
			 if(data[i].text().includes(nick))
				 n=i;
		 }
		 if(n==1)
			 data2=a.select(".profile-character-list__char").get(1).select("button");
		 else if(n==2)
			 data2=a.select(".profile-character-list__char").get(2).select("button");
		 else if(n==2)
			 data2=a.select(".profile-character-list__char").get(3).select("button");
		 else if(n==2)
			 data2=a.select(".profile-character-list__char").get(4).select("button");
		 else if(n==2)
			 data2=a.select(".profile-character-list__char").get(5).select("button");
		 else if(n==2)
			 data2=a.select(".profile-character-list__char").get(6).select("button");
		 else if(n==2)
			 data2=a.select(".profile-character-list__char").get(7).select("button");
		 else
			 data2=a.select(".profile-character-list__char").get(0).select("button");
         var res="";
         for(var i=0;i<data2.length;i++)
         {
            res=res+"- ["+data2[i].select("img").attr("alt")+"] "+data2[i].select("span").text()+"\n";
         }
         replier.reply("["+nick+"@"+server+"]\n님의 원정대 캐릭터 목록\n\nㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n"+res);
      }
   }
   catch(e)
   {
      var nick = msg.split(" ")[1];
      replier.reply("["+nick+"]\n존재하지 않는 캐릭터 입니다.");
   }
}
}