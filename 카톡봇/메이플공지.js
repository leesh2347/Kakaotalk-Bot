const room_name = ["다들 아침 릴리만세는 외쳤는가?","ㅇㅇㅇ","루시 도배방","스카니아 리사 수다방🍀","키네연구소"];
const filter_keywords=["결제","카드","토스","캐쉬","포인트","충전","페이","쿠폰"];
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
		 var iscash=0;
		 for(var a=0;a<filter_keywords.length;a++)
			 if(now.includes(filter_keywords[a])) iscash=1;
            
			if(iscash==0){
				var url=doc.select("#container > div > div.contents_wrap > div.news_board>ul>li>p>a").attr("href");
				var doc2=Jsoup.connect("https://maplestory.nexon.com"+url).get();
				var article=doc2.select("#container > div > div.contents_wrap > div.qs_text > div").get(0).wholeText();
				article=article.replace(/[\n\s]{3,}/g,"\n\n");
				for(var i=0; i < room_name.length; i++){
				   Api.replyRoom(room_name[i],"메이플스토리 홈페이지에 새로운 공지가 있습니다.\n\n"+now+"\n"+"\u200b".repeat(500)+"\n\n"+article+"\n\n"+"공홈에서 확인하기 : https://maplestory.nexon.com"+url);
				}
			}
            old = now; 
         }
         timer=0;
      }
   timer++;
   }
}
