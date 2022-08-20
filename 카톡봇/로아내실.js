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
  if(msg.split(" ")[0]=="@내실"||msg.split(" ")[0]=="!내실") {
   try{ 
        var nick = msg.split(" ")[1];
        if(nick==undefined)
           nick=recommendnick(sender,replier);
        if(nick=="") replier.reply("닉네임을 입력해 주세요.");
        else
        {
           var url="https://lostark.game.onstove.com/Profile/GetCollection";
         var url2="https://lostark.game.onstove.com/Profile/Character/"+encodeURIComponent(nick);
         var data1=org.jsoup.Jsoup.connect(url2).get().select("script").toString().split("Content/Profile.js?v")[1].split("var _pvpLevel")[0].split("';");
         var memno=data1[0].split("var _memberNo = '")[1];
         var worno=data1[2].split("var _worldNo = '")[1];
         var pcid=data1[1].split("var _pcId = '")[1];
         var data2 = org.jsoup.Jsoup.connect(url).header("Content-Type","application/x-www-form-urlencoded; charset=UTF-8").header("User-Agent","Mozilla/5.0").header("Referer",url2).data("memberNo", memno).data("worldNo", worno).data("pcId", pcid).ignoreContentType(true).ignoreHttpErrors(true).post();
         var res=[];
         res[0]=data2.select("h4").get(0).text().replace("포인트",": ");
         res[1]=data2.select("h4").get(2).text().replace("포인트",": ");
         res[2]=data2.select("h4").get(4).text().replace("포인트",": ");
         res[3]=data2.select("h4").get(6).text().replace("포인트",": ");
         res[4]=data2.select("h4").get(8).text().replace("포인트",": ");
         res[5]=data2.select("h4").get(10).text().replace("포인트",": ");
         res[6]=data2.select("h4").get(12).text().replace("포인트",": ");
         res[7]=data2.select("h4").get(14).text().replace("포인트",": ");
         res[8]=data2.select("h4").get(16).text().replace("포인트",": ");
         replier.reply("["+nick+"]님의 내실 현황\n\n"+res.join("\n"));
      }
   }
   catch(e)
   {
      var nick = msg.split(" ")[1];
      replier.reply("["+nick+"]\n존재하지 않는 캐릭터 입니다.");
   }
}



}