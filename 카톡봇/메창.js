FS = FileStream;

const result=["메린이 응애 나 애기 메린","무자본 평균","경손실 따질 스펙","메이플 평균","메창","메이플 인생 메생이","컨텐츠가 부족한 토끼공듀","넥슨 VVIP 흑우 ㅋㅋ"];
const desc=["어머~ 귀여워라~","늦지 않았어..도망쳐..!","도망치기엔 이미 늦었어...","이제 메린이라 하기엔 좀...?","아 맞다! 익몬! 일퀘!","가끔은 이세계도 돌아봐주세요.","아..게임 할 거 없네..컨텐츠가 부족하네.","음머~"];
const magpet=["오베론","티타니아","쁘띠 피코","빅토리","글로리","쁘띠 포니","황혼","신야","쁘띠 초롱","토트","벨라","쁘띠 데스","마주르카","칸타빌레","쁘띠 타임","플로리안","플로렌스","쁘띠 플로라","쁘띠 탄지로","쁘띠 젠이츠","쁘띠 네즈코"]

const servarr=["","","에오스","핼리오스","오로라","레드","이노시스","유니온","스카니아","루나","제니스","크로아","베라","엘리시움","아케인","노바"];

var dbloc="sdcard/Devel/Maple/db_mechang.json";

if (FS.read(dbloc) == null) FS.write(dbloc, '{"name":[],"score":[]}');

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
var genesis=0;
var world=0;

function dbsave(nick,score,w){
	var rd = JSON.parse(FS.read(dbloc));
	
	var minscore=0;
	if(rd["score"].length>0)
		minscore=Math.min(rd["score"]);
	
	if(minscore<score||rd["score"].length<21){
		
		var nicksub=nick+"@"+servarr[w];
		
		if(rd["name"].indexOf(nicksub)!=(-1))
			rd["score"][rd["name"].indexOf(nicksub)]=score;
		else{
			rd["score"].push(score);
			rd["name"].push(nicksub);
		}
		
		
		/*
		var temparr=[];
		for(var i=0;i<rd["score"].length;i++){
			temparr.push(rd["score"][i]);
		}
		
		temparr.sort((a, b)=>a - b).reverse();
		*/
		
		if(rd["score"].length>20){
			rd["name"].splice(rd["score"].indexOf(minscore),1);
			rd["score"].splice(rd["score"].indexOf(minscore),1);
		}
		
		FS.write(dbloc, JSON.stringify(rd));
		
	}
	
}


function calculate(nickname,isrbt){
	
   
   //api 기본세팅

	var ocid1 = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/id?character_name="+encodeURIComponent(nickname)).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	var ocid2=JSON.parse(ocid1)["ocid"];
	
	//레벨
		
	var answer_lev = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/basic?ocid="+ocid2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	var l=Number(JSON.parse(answer_lev)["character_level"]);
	lev=l-250;
	if(lev<=0) lev=0;
   lev=lev*2;
   
   //월드
   world=servarr.indexOf(JSON.parse(answer_lev)["world_name"]);
	
	//유니온
	var answer_union = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/user/union?ocid="+ocid2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
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
	var answer_stat = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/stat?ocid="+ocid2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	
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
		symbol=Math.floor((sym/770)*100);
	
	//헥사
	var answer_hexa = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/hexamatrix?ocid="+ocid2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
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
	   hexa=Math.floor((Math.floor((sum_erda*100)/1010)+Math.floor((sum_piece*100)/28704))/2);
	
	//해방
	genesis=0;
	var answer_genesis = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/skill?ocid="+ocid2+"&character_skill_grade=0").header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	var g=JSON.parse(answer_genesis)["character_skill"];
	for(var iiii=0;iiii<g.length;iiii++){
		if(g[iiii]["skill_name"]=="창조의 아이온")
		{
			genesis=50;
			break;
		}
	}
	
	//자석펫
	var answer_pet = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/pet-equipment?ocid="+ocid2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
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
 
function mechang(nick){
			lev=0;
			union=0;
			atk=0;
			artifact=0;
			hexa=0;
			symbol=0;
			pet=0;
			genesis=0;
			world=0;
			
			calculate(nick,0);
			
			var res=0;
			var judge=0;
			judge=Number(lev)+Number(union)+Number(atk)+Number(artifact)+Number(hexa)+Number(symbol)+Number(pet)+Number(genesis);
			if(judge<100) res=0;
			else if(judge<150) res=1;
			else if(judge<230) res=2;
			else if(judge<320) res=3;
			else if(judge<400) res=4;
			else if(judge<475) res=5;
			else if(judge<550) res=6;
			else if(judge<620) res=7;
			else res=8;
			if(isNaN(judge))
			replier.reply("측정 조건 자료 중 측정할 수 없는 항목이 있습니다.\n측정 항목을 확인해주세요.\n\n측정 항목: 레벨, 전투력, 유니온 레벨, 아티팩트 레벨, 6차 강화, 어센틱포스, 해방 유무, 자석펫 유무\n\n※2023.12.21이후 접속 기록이 없는 캐릭터는 측정이 불가합니다.");
			else
			{
				dbsave(nick,judge,world);
				//replier.reply(nick+" "+judge+" "+world+" "+res)
				
				if(res<8){
					return [
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
					"[해방 여부]: +"+genesis,
					"[펫]: "+pet+"/30"
					].join("\n");
				}
					
				else
				{
					return [
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
						"[해방 여부]: +"+genesis,
						"[펫]: "+pet+"/30"
					].join("\n");
				}
		}
}
 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMention, logId, channelId, userHash) {
	if(msg=="!메창"||msg=="@메창")
	{
	replier.reply(["사용법: !메창 (닉네임)",
		"",
		"0~100 : 메린이",
		"101~150 : 무자본 평균",
		"151~230 : 메른이",
		"231~320 : 메이플 평균",
		"321~400 : 메창",
		"401~475 : 메이플 인생.",
		"476~550 : 토끼공듀",
		"551~620 : 넥슨 VVIP",
		"621+ : ?",
		"(자세한 측정 기준을 보려면 전체보기 클릭)",
		"\u200b".repeat(500),
		"---측정 기준---",
		"※상향평준화로 인해 2025.10 이후 기준 개편 예정입니다.",
		"",
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
		"[해방]",
		"해방 시 50점 가산점 추가",
		"",
		"[펫]",
		"자석펫 1마리 보유당 10점씩 최대 30점까지 추가"
		].join("\n"));
	}
	else if(msg=="!메창랭킹"||msg=="@메창랭킹")
	{
		var rd = JSON.parse(FS.read(dbloc));
		var temparr=rd["score"].sort().reverse();
		
		var ress="";
		for(var i=0;i<temparr.length;i++){
			ress=ress+(i+1)+". "+rd["name"][rd["score"].indexOf(temparr[i])]+": "+temparr[i]+"점\n";
		}
		replier.reply(ress);
		
	}
	else if(msg.split(" ")[0]=="!메창"||msg.split(" ")[0]=="@메창"){
		
		nick=msg.split(" ")[1];

		try{
			
			var res=mechang(nick);
			replier.reply(res);

		}
		catch(e)
		{
		  replier.reply("측정 조건 자료 중 측정할 수 없는 항목이 있습니다.\n측정 항목을 확인해주세요.\n\n측정 항목: 레벨, 전투력, 유니온 레벨, 아티팩트 레벨, 6차 강화, 어센틱포스, 해방 유무, 자석펫 유무\n\n※2023.12.21이후 접속 기록이 없는 캐릭터는 측정이 불가합니다.");
		   
		}

	}
}

