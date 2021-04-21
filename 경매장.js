const scriptName = "경매장";
Jsoup = org.jsoup.Jsoup

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
   
    if(msg.indexOf('!경매장') == 0){
   
   try{
      var text = msg.substr(4).trim();
      var name = text.split(' ')[0];
      var sub = text.split(' ')[1];
      
      경매장 = Jsoup.connect("https://maple.market/items/" + name + "/" + sub).get()
     
     tna = 경매장.select("#auction-list > table > tbody > tr:nth-child(1) > td.text-left > span").get(0).text();
     price1 = 경매장.select("#auction-list > table > tbody > tr:nth-child(1) > td:nth-child(4)").get(0).text();
     price2 = 경매장.select("#auction-list > table > tbody > tr:nth-child(2) > td:nth-child(4)").get(0).text();
     price3 = 경매장.select("#auction-list > table > tbody > tr:nth-child(3) > td:nth-child(4)").get(0).text();
     price4 = 경매장.select("#auction-list > table > tbody > tr:nth-child(3) > td:nth-child(4)").get(0).text();
     price5 = 경매장.select("#auction-list > table > tbody > tr:nth-child(3) > td:nth-child(4)").get(0).text();
     priceck = 경매장.select("#auction-list > table > tbody > tr:nth-child(1) > td:nth-child(5)").get(0).text();
     
     if(price1 == "-")
     {
        price1 = 경매장.select("#auction-list > table > tbody > tr:nth-child(1) > td:nth-child(5)").get(0).text();
        price2 = 경매장.select("#auction-list > table > tbody > tr:nth-child(2) > td:nth-child(5)").get(0).text();
        price3 = 경매장.select("#auction-list > table > tbody > tr:nth-child(3) > td:nth-child(5)").get(0).text();
        price4 = 경매장.select("#auction-list > table > tbody > tr:nth-child(4) > td:nth-child(5)").get(0).text();
        price5 = 경매장.select("#auction-list > table > tbody > tr:nth-child(5) > td:nth-child(5)").get(0).text();
      }
      
      if(priceck == "-")
      {
        price1 = 경매장.select("#auction-list > table > tbody > tr:nth-child(1) > td:nth-child(6)").get(0).text();
        price2 = 경매장.select("#auction-list > table > tbody > tr:nth-child(2) > td:nth-child(6)").get(0).text();
        price3 = 경매장.select("#auction-list > table > tbody > tr:nth-child(3) > td:nth-child(6)").get(0).text();
        price4 = 경매장.select("#auction-list > table > tbody > tr:nth-child(4) > td:nth-child(6)").get(0).text();
        price5 = 경매장.select("#auction-list > table > tbody > tr:nth-child(5) > td:nth-child(6)").get(0).text();
      }
      rep = "검색하신 ["+ sub + "섭 " + name + "]의\n경매장 검색 결과는\n\n" + "1 : " + price1 + "\n2 : " + price2 + "\n3 : " + price3 + "\n4 : " + price4 + "\n5 : " + price5 + "\n\n더 많은 내역은 인게임에서 확인해주세요~"
     
      replier.reply(rep);
   }
   catch(e){
      replier.reply("메이플 마켓에 지원하지 않는 아이템이거나\n지원하지 않는 서버입니다.\n아이템명(공백없이)/서버명을 확인 해주세요.\n지원서버 : 스카니아, 루나, 크로아, 엘리시움")
   }
   }
}