Jsoup=org.jsoup.Jsoup;
const scriptName = "추옵";
const weapon=["블레이드","아대","건","에너지소드","소울슈터","너클","건틀렛리볼버","폴암","활","에인션트보우","듀얼보우건","단검","체인","부채","한손검","한손둔기","한손도끼","케인","석궁","창","두손검","두손둔기","두손도끼","데스페라도","핸드캐논","완드","샤이닝로드","ESP리미터","매직건틀렛","스태프","튜너","브레스슈터","차크람","장검"];

const rootabyss=["파프니르 레피드엣지\n기본공: 81\n추옵: 없음","파프니르 리스크홀더\n기본공: 86\n추옵: 11/16/21/28/36","파프니르 첼리스카\n기본공: 125\n추옵: 15/22/31/40/52","파프니르 스플릿엣지\n기본공: 128\n추옵: 16/23/31/41/53","파프니르 엔젤릭슈터\n기본공: 128\n추옵: 16/23/31/41/53","파프니르 펜리르탈론\n기본공: 128\n추옵: 16/23/31/41/53","파프니르 빅 마운틴\n기본공: 128\n추옵: 16/23/31/41/53","파프니르 문글레이브\n기본공: 153\n추옵: 19/27/38/49/63","파프니르 윈드체이서\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 에인션트 보우\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 듀얼윈드윙\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 다마스커스\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 체인\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 용선\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 미스틸테인\n기본공: 164\n추옵: 20/29/40/53/68","파프니르 골디언해머\n기본공: 164\n추옵: 20/29/40/53/68","파프니르 트윈클리버\n기본공: 164\n추옵: 20/29/40/53/68","파프니르 클레르시엘\n기본공: 164\n추옵: 20/29/40/53/68","파프니르 윈드윙슈터\n기본공: 164\n추옵: 20/29/40/53/68","파프니르 브류나크\n기본공: 171\n추옵: 21/31/42/55/71","파프니르 페니텐시아\n기본공: 171\n추옵: 21/31/42/55/71","파프니르 라이트닝어\n기본공: 171\n추옵: 21/31/42/55/71","파프니르 배틀클리버\n기본공: 171\n추옵: 21/31/42/55/71","파프니르 데스브링어\n기본공: 171\n추옵: 21/31/42/55/71","파프니르 러스터캐논\n기본공: 175\n추옵: 21/31/43/56/72","파프니르 마나테이커\n기본마력: 201\n추옵: 25/36/49/65/83","파프니르 마나크래들\n기본마력: 201\n추옵: 25/36/49/65/83","파프니르 ESP리미터\n기본마력: 201\n추옵: 25/36/49/65/83","파프니르 매직 건틀렛\n기본마력: 201\n추옵: 25/36/49/65/83","파프니르 마나크라운\n기본마력: 204\n추옵: 25/36/50/66/84","파프니르 포기브니스\n기본공: 171\n추옵: 21/31/42/55/71","파프니르 나이트체이서\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 차크람\n기본공: 160\n추옵: 20/29/39/52/66","파프니르 용천검\n기본공: 171\n추옵: 21/31/42/55/71"];
const absolabs=["앱솔랩스 블레이드\n기본공: 97\n추옵: 없음","앱솔랩스 리벤지가즈\n기본공: 103\n추옵: 16/23/32/42/53","앱솔랩스 포인팅건\n기본공: 150\n추옵: 23/33/46/60/77","앱솔랩스 에너지소드\n기본공: 154\n추옵: 24/34/47/62/79","앱솔랩스 소울슈터\n기본공: 154\n추옵: 24/34/47/62/79","앱솔랩스 블로우너클\n기본공: 154\n추옵: 24/34/47/62/79","앱솔랩스 파일 갓\n기본공: 154\n추옵: 24/34/47/62/79","앱솔랩스 핼버드\n기본공: 184\n추옵: 28/41/56/74/95","앱솔랩스 슈팅보우\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 에인션트 보우\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 듀얼보우건\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 슬래셔\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 체인\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 괴선\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 세이버\n기본공: 197\n추옵: 30/44/60/79/101","앱솔랩스 비트해머\n기본공: 197\n추옵: 30/44/60/79/101","앱솔랩스 엑스\n기본공: 197\n추옵: 30/44/60/79/101","앱솔랩스 핀쳐케인\n기본공: 197\n추옵: 30/44/60/79/101","앱솔랩스 크로스보우\n기본공: 197\n추옵: 30/44/60/79/101","앱솔랩스 피어싱스피어\n기본공: 205\n추옵: 31/46/63/82/106","앱솔랩스 브로드세이버\n기본공: 205\n추옵: 31/46/63/82/106","앱솔랩스 브로드해머\n기본공: 205\n추옵: 31/46/63/82/106","앱솔랩스 브로드엑스\n기본공: 205\n추옵: 31/46/63/82/106","앱솔랩스 데스페라도\n기본공: 205\n추옵: 32/47/64/84/108","앱솔랩스 블래스트캐논\n기본공: 210\n추옵: 32/47/64/84/108","앱솔랩스 스펠링완드\n기본마력: 241\n추옵: 37/54/73/97/124","앱솔랩스 샤이닝로드\n기본마력: 241\n추옵: 37/54/73/97/124","앱솔랩스 ESP리미터\n기본마력: 241\n추옵: 37/54/73/97/124","앱솔랩스 매직 건틀렛\n기본마력: 241\n추옵: 37/54/73/97/124","앱솔랩스 스펠링스태프\n기본마력: 245\n추옵: 37/54/75/98/126","앱솔랩스 튜너\n기본공: 205\n추옵: 31/46/63/82/106","앱솔랩스 브레스 슈터\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 차크람\n기본공: 192\n추옵: 29/43/59/77/99","앱솔랩스 폭검\n기본공: 205\n추옵: 31/46/63/82/106"];
const arcane=["아케인셰이드 블레이드\n기본공: 140\n추옵: 없음","아케인셰이드 가즈\n기본공: 149\n추옵: 27/40/55/72/92","아케인셰이드 피스톨\n기본공: 216\n추옵: 39/58/79/104/133","아케인셰이드 에너지체인\n기본공: 221\n추옵: 40/59/81/106/136","아케인셰이드 소울슈터\n기본공: 221\n추옵: 40/59/81/106/136","아케인셰이드 클로\n기본공: 221\n추옵: 40/59/81/106/136","아케인셰이드 엘라하\n기본공: 221\n추옵: 40/59/81/106/136","아케인셰이드 폴암\n기본공: 264\n추옵: 48/70/96/127/163","아케인셰이드 보우\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 에인션트 보우\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 듀얼보우건\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 대거\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 체인\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 초선\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 세이버\n기본공: 283\n추옵: 51/75/103/136/175","아케인셰이드 해머\n기본공: 283\n추옵: 51/75/103/136/175","아케인셰이드 엑스\n기본공: 283\n추옵: 51/75/103/136/175","아케인셰이드 케인\n기본공: 283\n추옵: 51/75/103/136/175","아케인셰이드 크로스보우\n기본공: 283\n추옵: 51/75/103/136/175","아케인셰이드 스피어\n기본공: 295\n추옵: 54/78/108/142/182","아케인셰이드 투핸드소드\n기본공: 295\n추옵: 54/78/108/142/182","아케인셰이드 투핸드해머\n기본공: 295\n추옵: 54/78/108/142/182","아케인셰이드 투핸드엑스\n기본공: 295\n추옵: 54/78/108/142/182","아케인셰이드 데스페라도\n기본공: 295\n추옵: 54/78/108/142/182","아케인셰이드 시즈건\n기본공: 302\n추옵: 55/80/110/145/186","아케인셰이드 완드\n기본마력: 347\n추옵: 63/92/126/167/214","아케인셰이드 샤이닝로드\n기본마력: 347\n추옵: 63/92/126/167/214","아케인셰이드 ESP리미터\n기본마력: 347\n추옵: 63/92/126/167/214","아케인셰이드 매직 건틀렛\n기본마력: 347\n추옵: 63/92/126/167/214","아케인셰이드 스태프\n기본마력: 353\n추옵: 64/94/129/170/218","아케인셰이드 튜너\n기본공: 295\n추옵: 54/78/108/142/182","아케인셰이드 브레스 슈터\n기본공: 283\n추옵: 51/75/103/136/175","아케인셰이드 차크람\n기본공: 276\n추옵: 50/73/101/133/170","아케인셰이드 환검\n기본공: 295\n추옵: 54/78/108/142/182"];
const genesis=["(데이터 미구현)","제네시스 가즈\n기본공: 172\n추옵: 31/46/63/83/106","제네시스 피스톨\n기본공: 249\n추옵: 45/66/91/120/154","제네시스 에너지체인\n기본공: 255\n추옵: 46/68/93/123/157","제네시스 소울슈터\n기본공: 255\n추옵: 46/68/93/123/157","제네시스 클로\n기본공: 255\n추옵: 46/68/93/123/157","제네시스 엘라하\n기본공: 255\n추옵: 46/68/93/123/157","제네시스 폴암\n기본공: 304\n추옵: 55/81/111/146/187","제네시스 보우\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 에인션트 보우\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 듀얼보우건\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 대거\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 체인\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 창세선\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 세이버\n기본공: 326\n추옵: 59/87/119/157/201","제네시스 해머\n기본공: 326\n추옵: 59/87/119/157/201","제네시스 엑스\n기본공: 326\n추옵: 59/87/119/157/201","제네시스 케인\n기본공: 326\n추옵: 59/87/119/157/201","제네시스 크로스보우\n기본공: 326\n추옵: 59/87/119/157/201","제네시스 스피어\n기본공: 340\n추옵: 62/90/124/164/210","제네시스 투핸드소드\n기본공: 340\n추옵: 62/90/124/164/210","제네시스 투핸드해머\n기본공: 340\n추옵: 62/90/124/164/210","제네시스 투핸드엑스\n기본공: 340\n추옵: 62/90/124/164/210","제네시스 데스페라도\n기본공: 340\n추옵: 62/90/124/164/210","제네시스 시즈건\n기본공: 348\n추옵: 63/92/127/167/215","제네시스 완드\n기본마력: 400\n추옵: 72/106/146/192/246","제네시스 샤이닝로드\n기본마력: 400\n추옵: 72/106/146/192/246","제네시스 ESP리미터\n기본마력: 400\n추옵: 72/106/146/192/246","제네시스 매직 건틀렛\n기본마력: 400\n추옵: 72/106/146/192/246","제네시스 스태프\n기본마력: 406\n추옵:74/108/148/195/250","제네시스 튜너\n기본공: 340\n추옵: 62/90/124/164/210","제네시스 브레스 슈터\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 이클립스\n기본공: 318\n추옵: 58/84/116/153/196","제네시스 창세검\n기본공: 340\n추옵: 62/90/124/164/210"];
const weaponzero=["1형","2형","3형","4형","5형","6형","7형","8형","9형","10형"];
const zero=["1형(Lv.110)\n기본공: 100/102\n추옵: 4/7/12/17/23","2형(Lv.110)\n기본공: 103/105\n추옵: 4/7/12/17/23","3형(Lv.120)\n기본공: 105/107\n추옵: 5/10/16/23/32","4형(Lv.130)\n기본공: 112/114\n추옵: 5/11/17/25/34","5형(Lv.140)\n기본공: 117/121\n추옵: 5/11/18/26/36","6형(Lv.150)\n기본공: 135/139\n추옵: 6/13/21/30/41","7형(Lv.170) (무료 업그레이드 최대 형태)\n기본공: 169/179\n추옵: 9/20/32/47/64","8형(Lv.180) (=앱솔랩스)\n기본공: 203/207\n추옵: 11/23/38/56/76","9형(Lv.200) (=아케인셰이드)\n기본공: 293/297\n추옵: 18/40/65/95/131","10형(Lv.200) (=제네시스)\n기본공: 337/342\n추옵: 21/46/75/110/150"];
const starleon=[6,7,7,8,9];
const starcyg=[7,8,8,9,10,11,12];
const starroot=[8,9,9,10,11,12,13];
const starabs=[9,9,10,11,12,13,14];
const stararc=[13,13,14,14,15,16,17];
const jaknum=[3,5,7,9];
const jak=["100%","70%","30%","15%"];

 
 Number.prototype.comma = function() {
	var coma=this.toString().replace(/(?=(\d{3})+(?!\d))/g, ",");
	if(coma[0]==",") coma=coma.substr(1);
return coma;
}
 
 function printchuop(series,name)
 {
	 
	 if(series=="제로")
	 {
		 
		 if(weaponzero.indexOf(name)!=(-1))
			 return zero[weaponzero.indexOf(name)];
		 else
		 {
			 var print="";
			 for(var i=0;i<weaponzero.length;i++)
				 print=print+"\n\n*"+zero[i];
			 return "제로 무기 추옵\n"+"\u200b".repeat(500)+print;
		 }
	 }
	 else if(series=="파프")
	 {

		 if(name!=undefined)
			 name=name.toUpperCase();
		 if(weapon.indexOf(name)!=(-1))
			 return rootabyss[weapon.indexOf(name)];
		 else
		 {
			 var print="";
			 for(var i=0;i<weapon.length;i++)
				 print=print+"\n\n*"+weapon[i]+"\n"+rootabyss[i];
			 return "파프니르 무기 추옵\n"+"\u200b".repeat(500)+print;
		 }
	 }
	 else if(series=="앱솔")
	 {

		 if(name!=undefined)
			 name=name.toUpperCase();
		 if(weapon.indexOf(name)!=(-1))
			 return absolabs[weapon.indexOf(name)];
		 else
		 {
			 var print="";
			 for(var i=0;i<weapon.length;i++)
				 print=print+"\n\n*"+weapon[i]+"\n"+absolabs[i];
			 return "앱솔랩스 무기 추옵\n"+"\u200b".repeat(500)+print;
		 }
	 }
	 else if(series=="아케인")
	 {

		 if(name!=undefined)
			 name=name.toUpperCase();
		 if(weapon.indexOf(name)!=(-1))
			 return arcane[weapon.indexOf(name)];
		 else
		 {
			 var print="";
			 for(var i=0;i<weapon.length;i++)
				 print=print+"\n\n*"+weapon[i]+"\n"+arcane[i];
			 return "아케인셰이드 무기 추옵\n"+"\u200b".repeat(500)+print;
		 }
	 }
	 else if(series=="제네")
	 {

		 if(name!=undefined)
			 name=name.toUpperCase();
		 if(weapon.indexOf(name)!=(-1))
			 return genesis[weapon.indexOf(name)];
		 else
		 {
			 var print="";
			 for(var i=0;i<weapon.length;i++)
				 print=print+"\n\n*"+weapon[i]+"\n"+genesis[i];
			 return "제네시스 무기 추옵\n"+"\u200b".repeat(500)+print;
		 }
	 }
	 else
	 {
		 return "추옵 검색 사용법"+"\u200b".repeat(500)+"\n\n사용법: !추옵 (장비종류) (무기종류)\n\n장비 종류: 파프, 앱솔, 아케인, 제네, 제로\n\n무기 종류: "+weapon.join(", ")+"\n\n제로 무기 종류: 1형~10형\n\n*잘못된 값 입력 시 해당 장비 종류 모두를 출력합니다.";
	 }
 }
 
 function armor(msg,replier)
 {
	 var msgg=msg.split("!방무 ")[1];
	 try{
	 var analyze=msgg.split(' ');
      for (i=0;i<analyze.length;i++) {
         analyze[i]=Number(analyze[i]);
      }
	  var basic=analyze[1];
	  var real=basic;
	  for(i=2;i<analyze.length;i++)
		  real=((real/100)+(analyze[i]/100)-(real*analyze[i])/10000)*100;
	  var rate=1-((analyze[0]/100)*(1-(real/100)));
	  rate=rate*100;
   if(rate<0) rate=0;
	  replier.reply("표기 방무: "+basic+"%,  실 방무: "+real.toFixed(2)+"%\n보스 방어율: "+analyze[0]+"%, 보스에게 딜량: "+rate.toFixed(2)+"%");
	 }
	 catch(e)
	 {
		 replier.reply("방무 계산기 사용법:\n@방무 (보스방어율) (표기방무) (스킬방무1) (스킬방무2) ....");
	 }
	  
 }
 
 function jaehoek(msg,issmall,replier){
	 var nick=msg.split(" ")[1];
	
	 
	 if(nick==undefined||nick=="")
		 replier.reply("재획비 효율 계산기 사용법: @재획 (닉네임) (간당 마리수)\n\n본섭 재획비가 얼마일 때부터 마시면 이득인지 효율을 계산해 줍니다.\n※간당 마리수는 만마리 단위로 입력해 주세요.(15000마리일 경우 1.5)\n※재획비를 마시지 않은 상태일 때 정확한 계산이 가능합니다.\n캐릭터의 드메 스탯은 약 15분 전 시점을 기준으로 반영됩니다.");
	 else{
		 var mari=Number(msg.split(" ")[2]);
		 try{

			
			var ocid1 = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/id?character_name="+encodeURIComponent(nick)).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
			var ocid2=JSON.parse(ocid1)["ocid"];

			var answer = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/stat?ocid="+ocid2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
			var t=JSON.parse(answer);
			
			 var isreboot=org.jsoup.Jsoup.connect("https://maplestory.nexon.com/N23Ranking/World/Total?c=" +nick).get().select("#container > div > div > div:nth-child(4)").text();
			 var data;
			  if(isreboot!="랭킹정보가 없습니다.")
			  {
				  data = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/N23Ranking/World/Total?c=" +nick).get().select("tr.search_com_chk").select("td");//공홈파싱
			  }
			  else{
				  data = org.jsoup.Jsoup.connect("https://maplestory.nexon.com/N23Ranking/World/Total?c=" +nick+"&w=254").get().select("tr.search_com_chk").select("td");//공홈파싱
			  }
			 
			 var lev=Number(data.get(2).text().replace("Lv.", ""));
			 var drop=Number(t["final_stat"][28]["stat_value"]);
			 var me=Number(t["final_stat"][29]["stat_value"]);
			
			 
				if(mari>1000) mari=mari/10000;
			 var ddrop=60*(100+drop)/100
			var jddrop=60*(120+drop)/100
			if(ddrop>100) ddrop=100;
			if(jddrop>100) jddrop=100;
			var nojae=Math.ceil(lev*(100+me)*mari*7.5*ddrop/10000);
			var jae=Math.ceil(lev*(100+me)*1.2*mari*7.5*jddrop/10000);
			
			if(issmall==1)
				replier.reply("🍾소형 재획비 효율 계산기🍾\n\n재획비 사용X: 간당 "+nojae+"만\n재획비 사용: 간당 "+jae+"만\n\n소재비 사용 추천 시세: "+(jae-nojae)/2+"만▼");
			else
				replier.reply("🍾재획비 효율 계산기🍾\n\n재획비 사용X: 간당 "+nojae+"만\n재획비 사용: 간당 "+jae+"만\n\n재획비 사용 추천 시세: "+(jae-nojae)*2+"만▼\n(1시간 30분 사냥시): "+Math.ceil((jae-nojae)*1.5)+"만▼\n(1시간 사냥시): "+(jae-nojae)+"만▼");
			 
		 }
		 catch(e){
			 replier.reply("닉네임을 정확하게 입력했는지 확인해 주세요.\n재획비 효율 계산기 사용법: @재획 (닉네임) (간당 마리수)\n※재획비를 마시지 않은 상태로 접속을 종료해야 정확한 계산이 가능합니다.");
		 }
	 }
 }
 
  function symbol(start, end){
	 var total_req=0;
	 var total_meso=[0,0,0,0,0,0,0];
	 var total_day_se=0;
	 var total_day=0;
	 if(isNaN(start)||isNaN(end))
	 {
		 return "어센틱심볼 계산기 사용법: @어센틱 (시작레벨) (끝레벨)\n\n지역별 심볼세 합과 일퀘 일수를 계산해 줍니다.";
	 }
	 else if(start>=1&&end<=11)
	 {
		 // 요구 메소 = floor(필요 성장치 * 1.8 * ((지역상수 + 6) - (레벨 - 1)/3)) * 100000
        // 지역 상수 : 세르 1 호텔 2 오디움 3 도원경 4 아르테리아 5 카르시온 6
		for (var i = start; i < end; i++){
            total_req += 9*i*i + 20*i;
            total_meso[0] += Number(Math.floor((9*i*i + 20*i) * 1.8 * (7 - (i - 1)/3)) * 100000);
            total_meso[1] += Number(Math.floor((9*i*i + 20*i) * 1.8 * (8 - (i - 1)/3)) * 100000);
            total_meso[2] += Number(Math.floor((9*i*i + 20*i) * 1.8 * (9 - (i - 1)/3)) * 100000);
            total_meso[3] += Number(Math.floor((9*i*i + 20*i) * 1.8 * (10 - (i - 1)/3)) * 100000);
			total_meso[4] += Number(Math.floor((9*i*i + 20*i) * 1.8 * (11 - (i - 1)/3)) * 100000);
			total_meso[5] += Number(Math.floor((9*i*i + 20*i) * 1.8 * (12 - (i - 1)/3)) * 100000);
			total_meso[6] += Number(Math.floor((9*i*i + 20*i) * 1.8 * ((7*2/3)*(7*2/3) - (i - 1)/3)) * 100000);
        }
		total_day_se=Math.ceil(total_req/20);
		total_day=Math.ceil(total_req/10);
		
		return [
		start+"레벨에서 "+end+"레벨까지",
		"요구량: "+total_req,
		"세르니움: "+total_meso[0].comma()+"메소",
		"아르크스: "+total_meso[1].comma()+"메소",
		"오디움: "+total_meso[2].comma()+"메소",
		"도원경: "+total_meso[3].comma()+"메소",
		"아르테리아: "+total_meso[4].comma()+"메소",
		"카르시온: "+total_meso[5].comma()+"메소",
		"탈라하트: "+total_meso[6].comma()+"메소",
		"\u200b".repeat(500),
		"모든 추가 퀘스트 완료시 필요 기간",
		"",
		"세르니움: "+total_day_se+"일",
		"아르크스: "+total_day+"일",
		"오디움: "+total_day+"일",
		"도원경: "+total_day+"일",
		"아르테리아: "+total_day+"일",
		"카르시온: "+total_day+"일",
		"탈라하트: "+total_day+"일",
		].join("\n");
	 }
	 else{
		 return "어센틱심볼 레벨이 정확하게 입력되었는지 확인해 주세요.\n어센틱 심볼 레벨은 1~11까지만 입력 가능합니다.";
	 }
	 
 }
 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMention, logId, channelId, userHash) {
	if(msg=="!추옵"||msg=="@추옵")
		replier.reply("추옵 검색 사용법"+"\u200b".repeat(500)+"\n\n사용법: !추옵 (장비종류) (무기종류)\n\n장비 종류: 파프, 앱솔, 아케인, 제네, 제로\n\n무기 종류: "+weapon.join(", ")+"\n\n제로 무기 종류: 1형~10형\n\n*잘못된 값 입력 시 해당 장비 종류 모두를 출력합니다.");
	else if(msg.split(" ")[0]=="!추옵"||msg.split(" ")[0]=="@추옵")
	{
		 var series=msg.split(" ")[1];
		 var name=msg.split(" ")[2];
		 var res=printchuop(series,name);
		 replier.reply(res);
	}
	if(msg.split(" ")[0]=="!방무"||msg.split(" ")[0]=="@방무")
		armor(msg,replier);
	if(msg.split(" ")[0]=="!재획"||msg.split(" ")[0]=="@재획")
		jaehoek(msg,0,replier);
	if(msg.split(" ")[0]=="!소재획"||msg.split(" ")[0]=="@소재획"||msg.split(" ")[0]=="!소재비"||msg.split(" ")[0]=="@소재비")
		jaehoek(msg,1,replier);
	if(msg.split(" ")[0]=="!어센틱"||msg.split(" ")[0]=="@어센틱")
	{
		var start=Number(msg.split(" ")[1]);
		var end=Number(msg.split(" ")[2]);
		var res=symbol(start,end);
		replier.reply(res);
	}
		
}

