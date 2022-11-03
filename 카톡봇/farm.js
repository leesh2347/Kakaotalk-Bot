 Jsoup=org.jsoup.Jsoup;
 
 function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
	 if(msg.startsWith("@농장")||msg.startsWith("!농장")) {
		  let mob = msg.slice(4).replace(/ /g,"");
	   try{  
		aa = Jsoup.connect("http://wachan.me/farm_monster.php").ignoreContentType(true).data("monster", mob)
		 .userAgent("Mozilla").cookie("auth", "token").post().select("body").text();
		
		  farm = Jsoup.connect("http://wachan.me/farm_read.php").ignoreContentType(true).data("monster", aa)
		 .userAgent("Mozilla").cookie("auth", "token").post().select("body").text();

		  rep = JSON.parse(farm).farm_list;
		 replier.reply(aa+" 보유 농장 보러가기"+"\u200b".repeat(500)+"\n\n\n"+rep.join("\n━━━━━━━━━━━━━━\n")+"\n\nSpecial Thanks 전쿠\nAPI - 와쨩");
		 
	   }
	   catch(e){
		  replier.reply("없는 몬스터입니다.\n몬스터 이름을 확인해주세요!\n입력 된 몬스터 이름 - ["+mob+']');
	  }
	}
}