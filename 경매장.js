const scriptName = "경매장";
Jsoup = org.jsoup.Jsoup

function abbri(n)
{
	if(n=="추경"||n=="경쿠")
        n="MVP추가경험치50쿠폰";
     else if(n=="코젬")
        n="코어젬스톤";
     else if(n=="수에큐")
        n="수상한에디셔널큐브";
    else if(n=="무트코인"||n=="무공")
        n="무공이보증한명예의훈장";
	else if(n=="고농축")
        n="고농축프리미엄생명의물";
	else if(n=="재획"||n=="재획비")
        n="재물획득의비약";
	else if(n=="경축"||n=="경축비")
        n="경험축적의비약";
	else if(n=="고보킬")
        n="고급보스킬러의비약";
	else if(n=="고관비")
        n="고급관통의비약";
	else if(n=="로얄")
        n="메이플로얄스타일";
	else if(n=="쥬씨")
        n="쥬니퍼베리씨앗오일";
	else if(n=="주흔")
        n="주문의흔적";
	else if(n=="헤이븐")
        n="보급형에너지코어(A급)";
	else if(n=="야영지")
        n="희미한낙인의영혼석";
	else if(n=="물떡")
        n="아케인리버물방울석";
	else if(n=="태떡")
        n="태초의물방울석";
	else if(n=="거코젬")
        n="거울세계의코어젬스톤";
     else if(n.indexOf("방탄")!=(-1))
        n=n.replace("방탄","[BTS]");
	return n;
}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
	if(msg=="경매장단축어")
		replier.reply("현재 경매장 단축어 목록\n(추가할거 계속 추천 받습니다)\n"+"\u200b".repeat(500)+"\n\nMVP추가경험치50쿠폰: 추경,경쿠\n코어젬스톤: 코젬\n수상한에디셔널큐브: 수에큐\n무공이보증한명예의훈장: 무트코인,무공\n재물획득의비약: 재획, 재획비\n경험축적의비약: 경축, 경축비\n[BTS]: 방탄\n주문의흔적: 주흔\n메이플로얄스타일: 로얄\n보급형에너지코어(A급): 헤이븐\n희미한낙인의영혼석: 야영지\n쥬니퍼베리씨앗오일: 쥬씨\n아케인리버물방울석: 물떡\n태초의물방울석: 태떡\n거울세계의코어젬스톤: 거코젬\n고급보스킬러의비약: 고보킬\n고급관통의비약: 고관비\n고농축프리미엄생명의물: 고농축");
    if(msg.indexOf('!경매장') == 0){
   
   try{
      var text = msg.substr(4).trim();
      var name = text.split(' ')[0];
      var sub = text.split(' ')[1];
	  var rep="";
      name=abbri(name);
      
      
     if(sub==undefined)
	 {
		 var arr=["스카니아","루나","엘리시움","크로아"];
		 rep=rep+"["+name+"] 의 서버별 시세\n\n";
		 for(var i=0;i<4;i++)
		 {
			 경매장 = Jsoup.connect("https://maple.market/items/" + name + "/" + arr[i]).get()
			 tna = 경매장.select("#auction-list > table > tbody > tr:nth-child(1) > td.text-left > span").get(0).text();
			 price1 = 경매장.select("#auction-list > table > tbody > tr:nth-child(1) > td:nth-child(4)").get(0).text();
			  if(price1 == "-")
				  price1 = 경매장.select("#auction-list > table > tbody > tr:nth-child(1) > td:nth-child(5)").get(0).text();
			  //if(priceck == "-")
				  //price1 = 경매장.select("#auction-list > table > tbody > tr:nth-child(1) > td:nth-child(6)").get(0).text();
			  rep=rep+"<"+arr[i]+">\n"+price1+"\n\n";
		 }
		 
	 }
	 else
	 {
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
     }
      replier.reply(rep+"\n\n사용 가능한 단축어 목록 보기: 경매장단축어");
   }
   catch(e){
      replier.reply("메이플 마켓에 지원하지 않는 아이템이거나\n지원하지 않는 서버입니다.\n아이템명(공백없이)/서버명을 확인 해주세요.\n지원서버 : 스카니아, 루나, 크로아, 엘리시움\n아이템명 단축어 보기: 경매장단축어")
   }
   }
}