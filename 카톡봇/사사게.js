function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(room=="키네연구소") return;
  if(msg.split(" ")[0]=="@사사게"||msg.split(" ")[0]=="!사사게")
  {
	  var nick=msg.split(" ")[1];
	  try{
		  var url="";
		  var data;
		  var data2;
		  var res="";
		  for(var i=1;i<6;i++){
			  url="https://m.inven.co.kr/board/lostark/5355?p="+i;
				data = org.jsoup.Jsoup.connect(url).get();
				data2=data.select(".tit ").select(".subject");
				for(var j=0;j<data2.length;j++)
				{
					if(data2[j].text().includes(nick))
						res=res+"🚨"+data2[j].text()+"\n";
				}
				
		  }
		  if(res!="")
				replier.reply("["+nick+"] 닉네임의 사사게 검색 결과입니다.\n\n-------------\n"+res);
			else
				replier.reply("["+nick+"] 닉네임의 사사게 검색 결과입니다.\n\n-------------\n\n검색 결과 없음\n");
	  }
	  catch(e)
	  {
		  replier.reply("인벤 사이트 접속 오류입니다.");
	  }
  }
}