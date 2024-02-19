const result=["메린이 응애 나 애기 메린","무자본 평균","경손실 따질 스펙","메이플 평균","메창","메이플 인생 메생이","컨텐츠가 부족한 토끼공듀","넥슨 VVIP 흑우 ㅋㅋ"];
const desc=["어머~ 귀여워라~","늦지 않았어..도망쳐..!","도망치기엔 이미 늦었어...","이제 메린이라 하기엔 좀...?","아 맞다! 익몬! 일퀘!","가끔은 이세계도 돌아봐주세요.","아..게임 할 거 없네..컨텐츠가 부족하네.","음머~"];
const magpet=["오베론","티타니아","쁘띠 피코","빅토리","글로리","쁘띠 포니","황혼","신야","쁘띠 초롱","토트","벨라","쁘띠 데스","마주르카","칸타빌레","쁘띠 타임","플로리안","플로렌스","쁘띠 플로라"]

const origin={
   "기운":[0,1,1,1,2,2,2,3,3,10,3,3,4,4,4,4,4,4,5,15,5,5,5,5,5,6,6,6,7,20],
   "조각":[0,30,35,40,45,50,55,60,65,200,80,90,100,110,120,130,140,150,160,350,170,180,190,200,210,220,230,240,250,500]
};

const master={
   "기운":[3,1,1,1,1,1,1,2,2,5,2,2,2,2,2,2,2,2,2,8,3,3,3,3,3,3,3,3,4,10],
   "조각":[50,15,18,20,23,25,28,30,33,100,40,45,50,55,60,65,70,75,80,175,85,90,95,100,105,110,115,120,125,250]
};

const skill={
   "기운":[4,1,1,1,2,2,2,3,3,8,3,3,3,3,3,3,3,3,4,12,4,4,4,4,4,5,5,5,6,15],
   "조각":[75,23,27,30,34,38,42,45,49,150,60,68,75,83,90,98,105,113,120,263,128,135,143,150,158,165,173,180,188,375]
};

const gongyong={
   "기운":[7,2,2,2,3,3,3,5,5,14,5,5,6,6,6,6,6,6,7,17,7,7,7,7,7,9,9,9,10,20],
   "조각":[125,38,44,50,57,63,69,75,82,300,110,124,138,152,165,179,193,207,220,525,234,248,262,275,289,303,317,330,344,750]
};

Jsoup=org.jsoup.Jsoup;

var lev=0;
var union=0;
var atk=0;
var artifact=0;
var hexa=0;
var symbol=0;
var pet=0;

function calculate(nickname,isrbt){
	
	//레벨
	var l="";
   if(isrbt==0)
	   l=Jsoup.connect("https://maplestory.nexon.com/N23Ranking/World/Total?c="+nickname).get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td:nth-child(3)").text().replace("Lv.", "");
   else
	   l=Jsoup.connect("https://maplestory.nexon.com/N23Ranking/World/Total?c="+nickname+"&w=254").get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td:nth-child(3)").text().replace("Lv.", "");
   lev=Number(l)-250;
   if(lev<=0) lev=0;
   lev=lev*2;
   
   //api 기본세팅
   var today=new Date();
	var d = new Date(today.setDate(today.getDate() - 1));
	var d2=(d.getYear()+1900)+"-"+String(d.getMonth()+1).padStart(2, "0")+"-"+String(d.getDate()).padStart(2, "0");

	var ocid1 = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/id?character_name="+encodeURIComponent(nickname)).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	var ocid2=JSON.parse(ocid1)["ocid"];
	
	//유니온
	var answer_union = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/user/union?ocid="+ocid2+"&date="+d2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	var u=Number(JSON.parse(answer_union)["union_level"]);
	if(isNaN(u)) u=0;
	union=u-6000;
	if(union<=0) union=0;
	else{
		union=Math.floor(union/40);
		if(union>100) union=100;
	}
	
	//아티팩트
	artifact=Number(JSON.parse(answer_union)["union_artifact_level"]);
	if(isNaN(artifact)) artifact=0;
	artifact=artifact*2;
	if(artifact>100) artifact=100;
	
	//전투력
	var answer_stat = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/stat?ocid="+ocid2+"&date="+d2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	
	var at=0;
	var sym=0;
	
	for(var iii=0;iii<43;iii++){
		if(JSON.parse(answer_stat)["final_stat"][iii]["stat_name"]=="전투력")
			at=Number(JSON.parse(answer_stat)["final_stat"][iii]["stat_value"]);
		if(JSON.parse(answer_stat)["final_stat"][iii]["stat_name"]=="어센틱포스")
			sym=Number(JSON.parse(answer_stat)["final_stat"][iii]["stat_value"]);
	}
	
	if(isNaN(at)) at=0;
	if(at>692000000)
		atk=100;
	else if(at>350000000)
		atk=90;
	else if(at>260000000)
		atk=80;
	else if(at>232000000)
		atk=70;
	else if(at>160000000)
		atk=60;
	else if(at>120000000)
		atk=50;
	else if(at>60000000)
		atk=40;
	else if(at>30000000)
		atk=30;
	else if(at>20000000)
		atk=20;
	else if(at>13000000)
		atk=10;
	else
		atk=0;
	
	//어센틱포스
	if(isNaN(sym))
		symbol=0;
	else
		symbol=Math.floor((sym/660)*100);
	
	//헥사
	var answer_hexa = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/hexamatrix?ocid="+ocid2+"&date="+d2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	var h=JSON.parse(answer_hexa)["character_hexa_core_equipment"];
	var erda_a=[0,0,0,0];
    var piece_a=[0,0,0,0];
        
        var i=0;
        var j=0;
        
        var sum_erda=1;
        var sum_piece=0;
        
        var origintext="";
        var mastertext="";
        var skilltext="";
        var publictext="";
        
       for(i=0;i<h.length;i++){
       
           for (j = 0; j < h[i]["hexa_core_level"]; j++){
              if(j>0&&h[i]["hexa_core_type"]=="스킬 코어"){
                 erda_a[0]=erda_a[0]+origin["기운"][j];
                 piece_a[0]=piece_a[0]+origin["조각"][j];
              }
              else if(h[i]["hexa_core_type"]=="마스터리 코어"){
                 erda_a[1]=erda_a[1]+master["기운"][j];
               piece_a[1]=piece_a[1]+master["조각"][j];
              }
              else if(h[i]["hexa_core_type"]=="강화 코어"){
                 erda_a[1]=erda_a[1]+skill["기운"][j];
               piece_a[1]=piece_a[1]+skill["조각"][j];
              }
               else if(h[i]["hexa_core_type"]=="공용 코어"){
                 erda_a[1]=erda_a[1]+gongyong["기운"][j];
               piece_a[1]=piece_a[1]+gongyong["조각"][j];
              }
              
              
           }
       }
       
       for(i=0;i<4;i++){
          sum_erda=sum_erda+erda_a[i];
          sum_piece=sum_piece+piece_a[i];
       }
	   hexa=Math.floor((Math.floor((sum_erda*100)/928)+Math.floor((sum_piece*100)/26452))/2);
	
	//자석펫
	var answer_pet = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/pet-equipment?ocid="+ocid2+"&date="+d2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	var p=JSON.parse(answer_pet);
	if(p["pet_1_name"]!=undefined&&p["pet_1_name"]!=null&&p["pet_1_name"]!=""){
		if(magpet.indexOf(p["pet_1_name"])!=(-1))
			pet=pet+10;
	}
	if(p["pet_2_name"]!=undefined&&p["pet_2_name"]!=null&&p["pet_2_name"]!=""){
		if(magpet.indexOf(p["pet_2_name"])!=(-1))
			pet=pet+10;
	}
	if(p["pet_3_name"]!=undefined&&p["pet_3_name"]!=null&&p["pet_3_name"]!=""){
		if(magpet.indexOf(p["pet_3_name"])!=(-1))
			pet=pet+10;
	}
	
	
}
 
function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
	if(msg=="!메창"||msg=="@메창")
	{
	replier.reply(["사용법: !메창 (닉네임)",
		"",
		"0~100 : 메린이",
		"101~175 : 무자본 평균",
		"176~250 : 메른이",
		"251~325 : 메이플 평균",
		"326~400 : 메창",
		"401~475 : 메이플 인생.",
		"476~550 : 토끼공듀",
		"551~610 : 넥슨 VVIP",
		"611+ : ?",
		"(자세한 측정 기준을 보려면 전체보기 클릭)",
		"\u200b".repeat(500),
		"---측정 기준---",
		"[레벨]",
		"(현재 레벨-250)x2",
		"",
		"[유니온]",
		"유니온 레벨 최소 6000~최대 10000 사이에서 최소 0~최대 100점으로 환산",
		"",
		"[유니온 아티팩트]",
		"유니온 아티팩트 레벨x2",
		"",
		"[전투력]",
		"현재 전투력을 보스 구간별로 최소 0~최대 100점으로 환산",
		"(정확하진 않을 수 있으니 재미로 보세요)",
		"",
		"[어센틱포스]",
		"최대 강화 수치를 100% 기준으로 하여 현재의 진행도를 환산",
		"",
		"[HEXA 매트릭스]",
		"최대 강화 수치를 100% 기준으로 하여 현재의 진행도를 환산",
		"(측정 항목: 오리진 스킬, 마스터리 코어, 강화 코어, 공용 코어)",
		"",
		"[펫]",
		"자석펫 1마리 보유당 10점씩 최대 30점까지 추가"
		].join("\n"));
	}
	else if(msg.split(" ")[0]=="!메창"||msg.split(" ")[0]=="@메창"){
		lev=0;
		union=0;
		atk=0;
		artifact=0;
		hexa=0;
		symbol=0;
		pet=0;
		nick=msg.split(" ")[1];
		try{
			var isreboot=org.jsoup.Jsoup.connect("https://maplestory.nexon.com/N23Ranking/World/Total?c=" +nick).get().select("#container > div > div > div:nth-child(4)").text();
			if(isreboot!="랭킹정보가 없습니다.") calculate(nick,0);
			else calculate(nick,1);
			var judge=0;
			judge=Number(lev)+Number(union)+Number(atk)+Number(artifact)+Number(hexa)+Number(symbol)+Number(pet);
			if(judge<100) res=0;
			else if(judge<175) res=1;
			else if(judge<250) res=2;
			else if(judge<325) res=3;
			else if(judge<400) res=4;
			else if(judge<475) res=5;
			else if(judge<550) res=6;
			else if(judge<610) res=7;
			else res=8;
			if(isNaN(judge))
			replier.reply("측정 조건 자료 중 측정할 수 없는 항목이 있습니다.\n측정 항목을 확인해주세요.\n\n측정 항목: 레벨, 전투력, 유니온 레벨, 아티팩트 레벨, 6차 강화, 어센틱포스, 자석펫 유무\n\n※2023.12.21이후 접속 기록이 없는 캐릭터는 측정이 불가합니다.");
			else
			{
				if(res<8){
					replier.reply([
					"["+nick+"]님의 메창력 측정 결과...",
					"",
					"3대 '"+judge+"'치시는",
					"<"+result[res]+"> 입니다.",
					"",
					desc[res],
					"",
					"\u200b".repeat(500),
					"[레벨]: "+lev+"/100",
					"[유니온]: "+union+"/100",
					"[유니온 아티팩트]: "+artifact+"/100",
					"[전투력]: "+atk+"/100",
					"[어센틱포스]: "+symbol+"/100",
					"[HEXA 매트릭스]: "+hexa+"/100",
					"[펫]: "+pet+"/30"
					].join("\n"));
				}
					
				else
				{
					replier.reply([
						"["+nick+"]님의 메창력 측정 결과...",
						"",
						"어머...",
						"<넥슨 창문 '"+judge+"'개 오너> 이시군요?",
						"",
						"\u200b".repeat(500),
						"[레벨]: "+lev+"/100",
						"[유니온]: "+union+"/100",
						"[유니온 아티팩트]: "+artifact+"/100",
						"[전투력]: "+atk+"/100",
						"[어센틱포스]: "+symbol+"/100",
						"[HEXA 매트릭스]: "+hexa+"/100",
						"[펫]: "+pet+"/30"
					].join("\n"));
				}

			}
		}catch(e)
		{
		   replier.reply("측정 조건 자료 중 측정할 수 없는 항목이 있습니다.\n측정 항목을 확인해주세요.\n\n측정 항목: 레벨, 전투력, 유니온 레벨, 아티팩트 레벨, 6차 강화, 어센틱포스, 자석펫 유무\n\n※2023.12.21이후 접속 기록이 없는 캐릭터는 측정이 불가합니다.");
		   
		}
	}

}

function onNotificationPosted(sbn, sm) {
    var packageName = sbn.getPackageName();
    if (!packageName.startsWith("com.kakao.tal")) return;
    var actions = sbn.getNotification().actions;
    if (actions == null) return;
    var userId = sbn.getUser().hashCode();
    for (var n = 0; n < actions.length; n++) {
        var action = actions[n];
        if (action.getRemoteInputs() == null) continue;
        var bundle = sbn.getNotification().extras;

        var msg = bundle.get("android.text").toString();
        var sender = bundle.getString("android.title");
        var room = bundle.getString("android.subText");
        if (room == null) room = bundle.getString("android.summaryText");
        var isGroupChat = room != null;
        if (room == null) room = sender;
        var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, "");
        var icon = bundle.getParcelableArray("android.messages")[0].get("sender_person").getIcon().getBitmap();
        var image = bundle.getBundle("android.wearable.EXTENSIONS");
        if (image != null) image = image.getParcelable("background");
        var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
        com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
        if (this.hasOwnProperty("responseFix")) {
            responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, userId != 0);
        }
    }
}
