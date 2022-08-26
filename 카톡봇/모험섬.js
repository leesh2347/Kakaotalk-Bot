const islands=["기회의 섬","메데이아","볼라르 섬","우거진 갈대의 섬","잔혹한 장난감 섬","죽음의 협곡","쿵덕쿵 아일랜드","포르페","고요한 안식의 섬","몬테 섬","블루홀 섬","수라도","하모니 섬","환영 나비 섬"];

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(room=="키네연구소") return;
  if(msg=="@모험섬"||msg=="!모험섬")
  {
     try{
        var url="https://m.inven.co.kr/lostark/timer/";
      var data = org.jsoup.Jsoup.connect(url).get();
      var d=data.select(".timerPart>div>div>ul>li");
      var d2;
      var d3;
      var now=new Date();
      var res="";
      for(var i=0;i<d.length;i++){
         d2=new Date(d[i].select(".gentime").text().split(" ")[0]);
         d3=d[i].select(".npcname").text();
         if(d2.getDate()==now.getDate()&&islands.includes(d3))
            res=res+"\n"+d3+" ["+d[i].select(".gentime").text().split(" ")[1]+"]";
      }
      replier.reply("🏝오늘의 모험섬 목록🏝\n"+res);

      
     }
     catch(e)
     {
        replier.reply("인벤 사이트 접속 오류입니다.");
     }
  }
  if(msg=="@항협"||msg=="!항협")
  {
     try{
        var url="https://m.inven.co.kr/lostark/timer/";
      var data = org.jsoup.Jsoup.connect(url).get();
      var d=data.select(".timerPart>div>div>ul>li");
      var d2;
      var d3;
      var now=new Date();
      var res="";
      for(var i=0;i<d.length;i++){
         d2=new Date(d[i].select(".gentime").text().split(" ")[0]);
         d3=d[i].select(".npcname").text();
         if(d2.getDate()==now.getDate()&&d3.includes("항해 협동 : "))
            res=res+"\n"+d3.split("항해 협동 : ")[1]+" ["+d[i].select(".gentime").text().split(" ")[1]+"]";
      }
      replier.reply("⛵오늘의 항해 협동 목록⛵\n"+res);

      
     }
     catch(e)
     {
        replier.reply("인벤 사이트 접속 오류입니다.");
     }
  }
}