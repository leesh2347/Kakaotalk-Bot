const room_name = ["메이플 키네시스", "ㅇㅇㅇ", "메이플스토리 봇 개발 놀이터"];
var old = "";  
var now = "";
var timer = 0;
var interval = 5;
Jsoup = org.jsoup.Jsoup;

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) { 
   
   if(room_name.indexOf(room)!= -1) {  
      
      if(timer == interval){
         
        var doc = Jsoup.connect("https://maplestory.nexon.com/News/Notice").get();
      var now = doc.select("#container > div > div.contents_wrap > div.news_board > ul > li:nth-child(1) > p > a > span").get(0).text();
      
         if(now != old) { 
         
            var url=doc.select("#container > div > div.contents_wrap > div.news_board>ul>li>p>a").attr("href");
            var doc2=Jsoup.connect("https://maplestory.nexon.com"+url).get();
         
            for(var i=0; i < room_name.length; i++){
               Api.replyRoom(room_name[i],"메이플스토리 홈페이지에 새로운 공지가 있습니다.\n\n"+now+"\n"+"\u200b".repeat(500)+"\n\n"+doc2.select("#container > div > div.contents_wrap > div.qs_text > div").get(0).wholeText()+
               "\n\n"+"공홈에서 확인하기 : https://maplestory.nexon.com"+url);
            }
            old = now; 
         }
         timer=0;
      }
   timer++;
   }
}