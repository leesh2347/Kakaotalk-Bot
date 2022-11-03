const config=require('pok_data');

const FS = FileStream;
Jsoup=org.jsoup.Jsoup;
const kalink=require('kaling_config');
const kaling=kalink.kaling;
const { KakaoLinkClient } = require('kakaolink');
const Kakao =new KakaoLinkClient(kaling.key,kaling.url);
Kakao.login(kaling.email,kaling.password);

const cmds=config.cmds;
const pokArr=config.pokArr;
const ballArr=config.ballArr;
const ballfail=config.ballfail;
const setting=config.setting;
const advfail=config.advfail;
const seasons=config.seasons;
const collectionnames=config.collectionnames;
const collectioncontents=config.collectioncontents;
const meganames=config.meganames;
const megaafternames=config.megaafternames;
const megapicture=config.megapicture;
const specialimgpoks=config.specialimgpoks;
const specialpoksimage=config.specialpoksimage;
const formchangenames=config.formchangenames;
const formchangestatus=config.formchangestatus;
const formchangeimage=config.formchangeimage;
const trainerranpoks=config.trainerranpoks;
var month=0;
const pathRank="sdcard/Devel/Pokemon/Data/ranking.json";  //랭킹파일경로
const pathchampRank="sdcard/Devel/Pokemon/Data/trainer/champlog.json";  //챔피언기록파일경로
const pathseason="sdcard/Devel/Pokemon/Data/season.json";  //계절파일경로
var typetexts=[" ","[⚪노말]","[🔥불]","[🌊물]","[🌿풀]","[🕊비행]","[🪨바위]","[⛰땅]","[✊격투]","[⛓강철]","[🐞벌레]","[❄얼음]","[⚡전기]","[🧪독]","[👽에스퍼]","[☠고스트]","[😈악]","[🌠드래곤]","[🎀페어리]"];
var weathertexts=["[맑음]","[🌞햇살이 강함]","[☔비]","[🌪모래바람]","[☃️싸라기눈]"];
var weatherdesc=["","🌞햇살이 강해요.","☔비가 내리고 있어요.","🌪모래바람이 세차게 불고 있어요.","☃️싸라기눈이 내리고 있어요."];
var runpoks=["캐이시","라이코","스이쿤","앤테이","엠라이트","크레세리아","토네로스","볼트로스","라티아스","라티오스","릴링","델빌","가디","파이어","썬더","프리져"];
var ispokselect=0;
const more = "​";
var succrate=0;
var ispokfind=[];
var battlepokinfo=[];
var pokUser={};
var pokInv={};
var pokCol={};
var pokdelay={};
var advOn={};
var parse;
var poklink;
var img;
var isballwaiting=[];
var player1="";
var player2="";
var isbattle=0;
var player1retire=[];
var player2retire=[];
var gatchaplayers={};
var champplayers={};
var battletowerplayers={};
var battletowerlev={};
var player1ball="";
var player2ball="";
var player1maxhp=0;
var player2maxhp=0;
var weather=0; //1 쾌청 2 비 3 모래바람 4 싸라기눈
var player1pok={};
var player2pok={};
var player1pp=[];
var player2pp=[];
var gymnum=0;
var isplayer1bind=0;
var isnpcbattle=0;
var isplayer2bind=0;
var nextpokchoose=0;
var battleres="";
var trainerInv={};
var trainerpoknum=0;

Number.prototype.comma = function() {
	var coma=this.toString().replace(/(?=(\d{3})+(?!\d))/g, ",");
	if(coma[0]==",") coma=coma.substr(1);
return coma;
}

function read(target, res){
return JSON.parse(FileStream.read("sdcard/Devel/Pokemon/Data/"+target+".json"))[res];
}
function write(target, res){
var result = JSON.stringify(res);
var write = FileStream.write("sdcard/Devel/Pokemon/Data/"+target+".json", result);
return write;
}
function data(target){
return JSON.parse(FileStream.read("sdcard/Devel/Pokemon/Data/"+target+".json"));
}

function user(target, res, to){
var Data = data(target);
Data[res] = to;
var result = JSON.stringify(Data);
var write = FileStream.write("sdcard/Devel/Pokemon/Data/"+target+".json", result);
return write;
}

function pokimglink(pokename,formchange){//카링 이미지 주소. 이거로 메가진화나 폼체인지 이미지 링크 변경
	var imgg="";
	if(megaafternames.includes(pokename))
	{
		imgg=megapicture[megaafternames.indexOf(pokename)];
	}
	else if(specialimgpoks.includes(pokename))
	{
		imgg=specialpoksimage[specialimgpoks.indexOf(pokename)];
	}
	else if(formchange>0&&formchangenames.includes(pokename))
	{
		if(pokename!="아르세우스")
			imgg=formchangeimage[pokename][formchange];
		else
			imgg=Jsoup.connect("https://librewiki.net/wiki/"+pokename+"_(포켓몬)").get().select("meta[property=og:image]").attr("content");
	}
	else
		imgg=Jsoup.connect("https://librewiki.net/wiki/"+pokename+"_(포켓몬)").get().select("meta[property=og:image]").attr("content");
	return imgg;
}

function weatherjudge(atk,type){
	var at=atk;
	if(weather==1&&type==2)
		at=at*2;
	if(weather==1&&type==3)
		at=at/2;
	if(weather==2&&type==2)
		at=at/2;
	if(weather==2&&type==3)
		at=at*2;
	return at;
}

function newChampion(username,replier){
	let chamRank=JSON.parse(FileStream.read(pathchampRank));
	if(chamRank==null){
		let cdata={"Champnum":1,"Champlogs":[]};
			FileStream.write(pathchampRank, JSON.stringify(cdata));
			chamRank=JSON.parse(FileStream.read(pathchampRank));
		}
		if(chamRank["Champlogs"].length>1)
		{
			var oldchamp=chamRank["Champlogs"][chamRank["Champlogs"].length-1];
			pokUser[oldchamp]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+oldchamp+'.json'));
			pokInv[oldchamp]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+oldchamp+'_inv.json'));
			pokUser[oldchamp].rank=setting.rank.name[setting.rank.name.length-3];
			
			pokUser[oldchamp]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+oldchamp+'.json'));
			var b=0;
			b=ballArr.indexOf(pokUser[oldchamp].Ball);
			var nowr=0;
			nowr=setting.rank.name.length-3;
			while(pokUser[oldchamp].count.succ<=setting.rank.upif[nowr]){
				nowr--;
			}
			if(b>1){
				while(setting.ballupsucc[b-1]>pokUser[oldchamp].count.total)
				{
					b=b-1;
					pokUser[oldchamp].Ball=ballArr[b];
				}
			}
			pokUser[oldchamp].maxHp=setting.rank.maxHp[nowr];
			pokUser[oldchamp].rest=setting.rank.rest[nowr];
			pokUser[oldchamp].castT=setting.rank.castT[nowr];
			pokUser[oldchamp].success=setting.success+setting.rank.success[nowr];
			pokUser[oldchamp].rank=setting.rank.name[nowr];
			pokUser[oldchamp].Ball=ballArr[b];
			pokUser[oldchamp].successcatch.g5=setting.catchsuccess[0]+(setting.ballcatch[0]*b)+setting.rank.successcatch[nowr];
			pokUser[oldchamp].successcatch.g4=setting.catchsuccess[1]+(setting.ballcatch[1]*b)+setting.rank.successcatch[nowr];
			pokUser[oldchamp].successcatch.g3=setting.catchsuccess[2]+(setting.ballcatch[2]*b)+setting.rank.successcatch[nowr];
			pokUser[oldchamp].successcatch.g2=setting.catchsuccess[3]+(setting.ballcatch[3]*b)+setting.rank.successcatch[nowr];
			pokUser[oldchamp].successcatch.g1=setting.catchsuccess[4]+(setting.ballcatch[4]*b)+setting.rank.successcatch[nowr];
			if(b>0){
				pokUser[oldchamp].stat.g5=setting.p.g5+setting.ballg5[b];
				pokUser[oldchamp].stat.g4=setting.p.g4+setting.ballg4[b];
				pokUser[oldchamp].stat.g3=setting.p.g3+setting.ballg3[b];
			}
			if(pokUser[oldchamp].ribbon==undefined) pokUser[oldchamp].ribbon=setting.ribbon.name[0];
			if(pokUser[oldchamp].balldc==undefined) pokUser[oldchamp].balldc=setting.ribbon.balldc[0];
			if(pokUser[oldchamp].upgradedc==undefined) pokUser[oldchamp].upgradedc=setting.ribbon.upgradedc[0];
			pokUser[oldchamp].successcatch.g5=pokUser[oldchamp].successcatch.g5+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[oldchamp].ribbon)];
			pokUser[oldchamp].successcatch.g4=pokUser[oldchamp].successcatch.g4+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[oldchamp].ribbon)];
			pokUser[oldchamp].successcatch.g3=pokUser[oldchamp].successcatch.g3+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[oldchamp].ribbon)];
			pokUser[oldchamp].successcatch.g2=pokUser[oldchamp].successcatch.g2+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[oldchamp].ribbon)];
			pokUser[oldchamp].successcatch.g1=pokUser[oldchamp].successcatch.g1+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[oldchamp].ribbon)];
			pokUser[oldchamp].stat.g4=pokUser[oldchamp].stat.g4+setting.ribbon.g4[setting.ribbon.name.indexOf(pokUser[oldchamp].ribbon)];
			pokUser[oldchamp].stat.g3=pokUser[oldchamp].stat.g3+setting.ribbon.g3[setting.ribbon.name.indexOf(pokUser[oldchamp].ribbon)];
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+oldchamp+'.json', JSON.stringify(pokUser[oldchamp]));
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+oldchamp+'_inv.json', JSON.stringify(pokInv[oldchamp]));
			java.lang.Thread.sleep(2000);
			replier.reply("@"+oldchamp+"\n새로운 챔피언의 등장으로 챔피언의 자리에서 내려왔어요.");
		}
		pokUser[username]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+username+'.json'));
		pokInv[username]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json'));
		pokCol[username]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+username+'_collection.json'));
		var temparr=[];
		for(var i=0;i<pokInv[username].deck.length;i++)
		{
			temparr.push(pokInv[username].deck[i]);
		}
		var isfirstchamp=0;
		var curlev=[];
		if(chamRank["Champlogs"].indexOf(username)==(-1))
			isfirstchamp=1;
		chamRank["Champnum"]++;
		chamRank["Champlogs"].push(username);
		FileStream.write(pathchampRank, JSON.stringify(chamRank));
		let chamdata=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/trainer/champion.json"));
		chamdata.champname=username;
		let chamdeck=[];
		for(var i=0;i<temparr.length;i++)
		{
			chamdeck.push(temparr[i]);
		}
		var champdeckprint="";
		for(var i=0;i<chamdeck.length;i++)
		{
			curlev.push(pokInv[username].deck[i].level);
			champdeckprint=champdeckprint+"Lv."+chamdeck[i].level+" "+chamdeck[i].name+"\n";
			chamdeck[i].level=setting.championlev;
			
		}
		chamdata.deck=chamdeck;
		FileStream.write("sdcard/Devel/Pokemon/Data/trainer/champion.json", JSON.stringify(chamdata));
		nowr=setting.rank.name.indexOf(pokUser[username].rank);
		pokUser[username].maxHp=setting.rank.maxHp[setting.rank.name.length-2];
		pokUser[username].rest=setting.rank.rest[setting.rank.name.length-2];
		pokUser[username].castT=setting.rank.castT[setting.rank.name.length-2];
		pokUser[username].success=pokUser[username].success+setting.rank.success[setting.rank.name.length-2]-setting.rank.success[nowr];
		pokUser[username].successcatch.g5=pokUser[username].successcatch.g5+setting.rank.successcatch[setting.rank.name.length-2]-setting.rank.successcatch[nowr];
		pokUser[username].successcatch.g4=pokUser[username].successcatch.g4+setting.rank.successcatch[setting.rank.name.length-2]-setting.rank.successcatch[nowr];
		pokUser[username].successcatch.g3=pokUser[username].successcatch.g3+setting.rank.successcatch[setting.rank.name.length-2]-setting.rank.successcatch[nowr];
		pokUser[username].successcatch.g2=pokUser[username].successcatch.g2+setting.rank.successcatch[setting.rank.name.length-2]-setting.rank.successcatch[nowr];
		pokUser[username].successcatch.g1=pokUser[username].successcatch.g1+setting.rank.successcatch[setting.rank.name.length-2]-setting.rank.successcatch[nowr];
		pokUser[username].rank=setting.rank.name[setting.rank.name.length-2];
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'.json', JSON.stringify(pokUser[username]));
		
		let p1;
		for(var i=0;i<pokInv[username].deck.length;i++)
		{
			p1=pokInv[username].deck[i];
				pokInv[username].deck[i].level=curlev[i];
				if(p1.formchange!=0){
				p1.hp=Math.ceil((read("포켓몬/"+p1.name+"_"+p1.formchange,"hp"))*p1.level/50);
				p1.atk=Math.ceil(read("포켓몬/"+p1.name+"_"+p1.formchange,"atk")*p1.level/50);
				p1.def=Math.ceil(read("포켓몬/"+p1.name+"_"+p1.formchange,"def")*p1.level/50);
				p1.spd=Math.ceil(read("포켓몬/"+p1.name+"_"+p1.formchange,"spd")*p1.level/50);
				}
				else{
					p1.hp=Math.ceil((read("포켓몬/"+p1.name,"hp"))*p1.level/50);
					p1.atk=Math.ceil(read("포켓몬/"+p1.name,"atk")*p1.level/50);
					p1.def=Math.ceil(read("포켓몬/"+p1.name,"def")*p1.level/50);
					p1.spd=Math.ceil(read("포켓몬/"+p1.name,"spd")*p1.level/50);
				}
				pokInv[username].deck[i]=p1;

		}
		
		pokInv[username].item.push("전설알");
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json', JSON.stringify(pokInv[username]));
		if(champplayers[username]==null||champplayers[username]==undefined)
			champplayers[username]=0;
		champplayers[username]++;
		java.lang.Thread.sleep(2000);
		replier.reply("@"+username+"\n⭐축하합니다!⭐\n"+chamRank["Champlogs"].length+"번째 챔피언이 되었습니다!\n챔피언 달성 보상으로 전설의 포켓몬의 알이 지급되었습니다.\n\n\n전당등록을 축하합니다!"+"\u200b".repeat(500)+"\n"+champdeckprint);
		if(pokCol[username]["???"].includes(setting.leaguecharacter))
		{
			
		}
		else
		{
			giveleaguecharacter(username);
			replier.reply("@"+username+"\n챔피언 달성 보상으로 리그 캐릭터인 Lv.200 <🦄울트라비스트🦄> "+setting.leaguecharacter+"(이)가 지급되었습니다.");
			for(var ii of collectionnames){
				if(collectioncontents[collectionnames.indexOf(ii)].includes(setting.leaguecharacter))
				{
					if(pokCol[username][ii].indexOf(setting.leaguecharacter)==(-1))
					{
						pokCol[username][ii].push(setting.leaguecharacter)
						FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_collection.json', JSON.stringify(pokCol[username]));
						break;
					}
				}
			}
			replier.reply("@"+username+"\n도감의 ["+ii+"] 에 새로운 포켓몬이 등록되었습니다.");
			updatecollection(replier,username);
		}
}

function giveleaguecharacter(username){
	let pokname=setting.leaguecharacter;
	var skillsarr=read("포켓몬/"+pokname,"skills");
	var caughtpokskills=[];
	var poklev=200;
	if(skillsarr.length<5)
		caughtpokskills=skillsarr;
	else
	{
		while(caughtpokskills.length<4)
		{
			var t=skillsarr[Math.floor(Math.random()*skillsarr.length)];
			t=t.replace("DP","").replace("Pt","");
			if(caughtpokskills.indexOf(t)==(-1))
				caughtpokskills.push(t);
		}
	}
	var caughtpokhp=read("포켓몬/"+pokname,"hp");
	let caughtpok={
		'name':pokname,
		'level':poklev,
		'hp': Math.ceil(caughtpokhp*poklev/50),
		'atk': Math.ceil(read("포켓몬/"+pokname,"atk")*poklev/50),
		'def': Math.ceil(read("포켓몬/"+pokname,"def")*poklev/50),
		'spd': Math.ceil(read("포켓몬/"+pokname,"spd")*poklev/50),
		'skills':caughtpokskills, //위 4개는 json read
		'skillslocked':[],
		'formchange':0,
		'islocked':0
	};
	pokInv[username].box.push(caughtpok);
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json', JSON.stringify(pokInv[username]));
}

function giveribbonreward(username,ribbonname,replier){
	if(ribbonname==setting.ribbon.name[3]){
		pokInv[username].item.push("일반알");
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'.json', JSON.stringify(pokUser[username]));
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json', JSON.stringify(pokInv[username]));
		replier.reply("@"+username+"\n리본 등급업 보상으로 포켓몬의 알이 지급되었습니다.\n"+cmds.egg+" 명령어로 알을 부화시키세요.");
	}
	else if(ribbonname==setting.ribbon.name[4]){
		pokUser[username].gold=pokUser[username].gold+19999999;
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'.json', JSON.stringify(pokUser[username]));
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json', JSON.stringify(pokInv[username]));
		replier.reply("@"+username+"\n리본 등급업 보상으로 2000만 원이 지급되었습니다.");
	}
	if(ribbonname==setting.ribbon.name[5]){
		pokInv[username].item.push("전설알");
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'.json', JSON.stringify(pokUser[username]));
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json', JSON.stringify(pokInv[username]));
		replier.reply("@"+username+"\n리본 등급업 보상으로 전설의 포켓몬의 알이 지급되었습니다.\n"+cmds.legendegg+" 명령어로 알을 부화시키세요.");
	}
	else if(ribbonname==setting.ribbon.name[6]){
		pokUser[username].gold=pokUser[username].gold+299999999;
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'.json', JSON.stringify(pokUser[username]));
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json', JSON.stringify(pokInv[username]));
		replier.reply("@"+username+"\n리본 등급업 보상으로 3억 원이 지급되었습니다.");
	}
	else if(ribbonname==setting.ribbon.name[7]){
		pokInv[username].item.push("전설알");
		pokInv[username].item.push("전설알");
		pokInv[username].item.push("전설알");
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'.json', JSON.stringify(pokUser[username]));
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json', JSON.stringify(pokInv[username]));
		replier.reply("@"+username+"\n리본 등급업 보상으로 전설의 포켓몬의 알 3개가 지급되었습니다.\n"+cmds.legendegg+" 명령어로 알을 부화시키세요.");
	}
	else if(ribbonname==setting.ribbon.name[8]){
		pokUser[username].gold=pokUser[username].gold+999999999;
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'.json', JSON.stringify(pokUser[username]));
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json', JSON.stringify(pokInv[username]));
		replier.reply("@"+username+"\n리본 등급업 보상으로 10억 원이 지급되었습니다.");
	}
	else if(ribbonname==setting.ribbon.name[9]){
		giveleaguecharacter(username);
		replier.reply("@"+username+"\n축하합니다!\n리본 등급업 보상으로 Lv."+(setting.championlev-10)+" <🦄울트라비스트🦄> "+setting.leaguecharacter+"(를) 획득했습니다.");
	}
}

function printskills(skills,locked){
	var res="";
	var power="";
	var accr="";
	
	for(var i=0;i<(skills.length);i++)
	{
		try{
			if(read("기술/"+skills[i],"damage")==9999)
				power="일격필살";
			else if(read("기술/"+skills[i],"damage")<3)
				power="자신이 받은 데미지X"+read("기술/"+skills[i],"damage")+"배";
			else power=read("기술/"+skills[i],"damage");
			if(read("기술/"+skills[i],"accr")==9999)
				accr="반드시 명중";
			else accr=read("기술/"+skills[i],"accr")+"%";
			res=res+skills[i]+" "+typetexts[read("기술/"+skills[i],"type")]+"\n위력:"+power+"  PP:"+read("기술/"+skills[i],"pp")+"  명중률:"+accr;
			if(read("기술/"+skills[i],"addi")==1)
				res=res+"\n💬 공격시 반동으로 1턴 쉼";
			else if(read("기술/"+skills[i],"addi")==3)
				res=res+"\n💥 공격시 1/4의 반동 데미지를 입음";
			else if(read("기술/"+skills[i],"addi")==2)
				res=res+"\n💚 공격시 1/4 데미지만큼 체력 회복";
			else if(read("기술/"+skills[i],"addi")==9)
				res=res+"\n💣 공격시 자폭하여 본인의 체력이 1이 됨";
			res=res+"\n\n";
		}catch(e){
			res=res+skills[i]+" (데이터 읽기 오류)\n\n";
		}
	}
	res=res+"\u200b".repeat(500)+"\n";
	for(var i=0;i<(locked.length);i++)
	{
		try{
			if(read("기술/"+locked[i],"damage")==9999)
				power="일격필살";
			else if(read("기술/"+locked[i],"damage")<3)
				power="자신이 받은 데미지X"+read("기술/"+locked[i],"damage")+"배";
			else power=read("기술/"+locked[i],"damage");
			if(read("기술/"+locked[i],"accr")==9999)
				accr="반드시 명중";
			else accr=read("기술/"+locked[i],"accr")+"%";
			res=res+"🔒"+locked[i]+" "+typetexts[read("기술/"+locked[i],"type")]+"\n위력:"+power+"  PP:"+read("기술/"+locked[i],"pp")+"  명중률:"+accr;
			if(read("기술/"+locked[i],"addi")==1)
				res=res+"\n💬 공격시 반동으로 1턴 쉼";
			else if(read("기술/"+locked[i],"addi")==3)
				res=res+"\n💥 공격시 1/4의 반동 데미지를 입음";
			else if(read("기술/"+locked[i],"addi")==2)
				res=res+"\n💚 공격시 1/4 데미지만큼 체력 회복";
			else if(read("기술/"+locked[i],"addi")==9)
				res=res+"\n💣 공격시 자폭하여 본인의 체력이 1이 됨";
			res=res+"\n\n";
		}catch(e){
			res=res+"🔒"+locked[i]+" (데이터 읽기 오류)\n\n";
		}
	}
	return res;
}

function printbattlekakaolink(room,replier){
	try{
	var img1=pokimglink(player1pok.name,player1pok.formchange);
	var img2=pokimglink(player2pok.name,player2pok.formchange);
	
	Kakao.sendLink(room, {
			"link_ver":"4.0",
			"template_id":(67300),
			"template_args":{
			//이곳에 템플릿 정보를 입력하세요.
			'player1img':img1,
			'player2img':img2,
			'player1':"Lv."+player1pok.level+" "+player1pok.name,
			'player2':"Lv."+player2pok.level+" "+player2pok.name,
			'player1desc':"["+player1pok.hp+"/"+player1maxhp+"]",
			'player2desc':"["+player2pok.hp+"/"+player2maxhp+"]"
			}
			}, "custom")
	}catch(e){
		replier.reply("카카오링크 오류. 리셋 한번 해주세요.\n\nLv."+player1pok.level+" "+player1pok.name+"\n["+player1pok.hp+"/"+player1maxhp+"]\n\nLv."+player2pok.level+" "+player2pok.name+"\n["+player2pok.hp+"/"+player2maxhp+"]")
	}
}

function battleturn(room,replier) //배틀 구현 함수
{
			var player1skillarr=player1pok.skills;
			for(var j=0;j<player1pok.skillslocked.length;j++)
				player1skillarr.push(player1pok.skillslocked[j]);
			
			var player2skillarr=player2pok.skills;
			for(var j=0;j<player2pok.skillslocked.length;j++)
				player2skillarr.push(player2pok.skillslocked[j]);
			var player1skill="";
			var player2skill="";
			do{
				player1skill=player1skillarr[Math.floor(Math.random()*player1skillarr.length)];
			}while(player1pp[player1skillarr.indexOf(player1skill)]);
			do{
				player2skill=player2skillarr[Math.floor(Math.random()*player2skillarr.length)];
			}while(player2pp[player2skillarr.indexOf(player2skill)]);
			var player1spd=0;
			var player2spd=0;
			if(player1pok.spd>player2pok.spd)
				player1spd=1;
			else if(player2pok.spd>player1pok.spd)
				player2spd=1;
			else
			{
				if(Math.floor(Math.random()*2)==0) player1spd=1;
				else player2spd=1;
			}
			player1spd=player1spd+Number(read("기술/"+player1skill,"priority"))*2;
			player2spd=player2spd+Number(read("기술/"+player2skill,"priority"))*2;
			if(player1spd>player2spd){
				//선공 포켓몬 공격
				if(isplayer1bind==1)
				{
					battleres=battleres+"["+player1+"] "+player1pok.name+"는 공격의 반동으로 움직일 수 없었어요!\n";
					isplayer1bind=0;
				}
				else
				{
					battleres=battleres+"["+player1+"] "+player1pok.name+"의 "+player1skill+"!\n";
					player1pp[player1skillarr.indexOf(player1skill)]--;
					try{
					var accr=Number(read("기술/"+player1skill,"accr"));
					if(player1pok.level<player2pok.level)
						accr=Math.ceil(accr*(100-(player2pok.level-player1pok.level)*2)/100);
					if(Number(pokUser[player2].activecollection.includes(9)))
						accr=Math.ceil(accr*(100-pokUser[player2].collectionlev*3)/100);
					if(accr<Number(read("기술/"+player1skill,"accr"))/2)
						accr=Number(read("기술/"+player1skill,"accr"))/2;
					if(Math.floor(Math.random()*100)<accr){
						var atk=Math.ceil(player1pok.atk*read("기술/"+player1skill,"damage")/300*(2000-player2pok.def)/2000);
						if(read("기술/"+player1skill,"addi")==4)
							atk=atk*(player1maxhp-player1pok.hp)/2;
						if(player1pok.formchange==0){
							if(read("기술/"+player1skill,"type")==read("포켓몬/"+player1pok.name,"type1")||read("기술/"+player1skill,"type")==read("포켓몬/"+player1pok.name,"type2"))
							atk=atk*1.5;
						}
						else{
							if(read("기술/"+player1skill,"type")==read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"type1")||read("기술/"+player1skill,"type")==read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"type2"))
							atk=atk*1.5;
						}
						
						atk=weatherjudge(atk,read("기술/"+player1skill,"type"));
						var judge;
						if(player2pok.formchange==0){
							judge=typejudge(read("기술/"+player1skill,"type"),read("포켓몬/"+player2pok.name,"type1"),read("포켓몬/"+player2pok.name,"type2"));
						}
						else{
							judge=typejudge(read("기술/"+player1skill,"type"),read("포켓몬/"+player2pok.name+"_"+player2pok.formchange,"type1"),read("포켓몬/"+player2pok.name+"_"+player2pok.formchange,"type2"));
						}
						atk=atk*judge;
						if(isnpcbattle==0){
						if(pokUser[player1].activecollection.includes(1)||pokUser[player1].activecollection.includes(2))
							atk=atk*(pokUser[player1].collectionlev*2+100)/100;
						if(pokUser[player1].activecollection.includes(3)||pokUser[player1].activecollection.includes(4))
							atk=atk*(pokUser[player1].collectionlev*2+100)/100;
						if(pokUser[player1].activecollection.includes(5))
							atk=atk*(pokUser[player1].collectionlev*2+100)/100;
						if(pokUser[player1].activecollection.includes(6)||pokUser[player1].activecollection.includes(7))
							atk=atk*(pokUser[player1].collectionlev*2+100)/100;
						}
						if(pokUser[player2].activecollection.includes(12)&&judge>1)
							atk=atk*(100-pokUser[player2].collectionlev*5)/100;
						player2pok.hp=Math.ceil(player2pok.hp-atk);
						if(player2pok.hp<0){
							if(Number(pokUser[player2].activecollection.includes(14)))
							{
								if(Math.floor(Math.random()*100)<pokUser[player2].collectionlev*4)
								{
									player2pok.hp=1;
									battleres=battleres+"["+player2+"] "+player2pok.name+"는 치명적인 공격으로부터 가까스로 버텼어요!\n";
								}
								else
									player2pok.hp=0;
							}
							else
								player2pok.hp=0;
						}
						if(judge>1) battleres=battleres+"["+player1+"] 효과가 굉장했어요!\n";
						else if(judge==0) battleres=battleres+"["+player1+"] 상대에겐 효과가 없는 듯해요...\n";
						else if(judge<1) battleres=battleres+"["+player1+"] 효과가 별로인 듯해요\n";
						
						if(read("기술/"+player1skill,"addi")==3&&judge!=0)
						{
							player1pok.hp=Math.ceil(player1pok.hp-atk/4);
							if(player1pok.hp<1) player1pok.hp=1;
							battleres=battleres+"["+player1+"] "+player1pok.name+"는 공격의 반동으로 데미지를 입었어요!\n";
							
						}
						else if(read("기술/"+player1skill,"addi")==2&&judge!=0)
						{
							player1pok.hp=Math.ceil(player1pok.hp+atk/4);
							if(player1pok.hp>player1maxhp) player1pok.hp=player1maxhp;
							battleres=battleres+"["+player1+"] "+player1pok.name+"는 공격을 통해 체력을 흡수했어요!\n";
							
						}
						else if(read("기술/"+player1skill,"addi")==1&&player1skill!="솔라빔"&&weather!=1)
						{
							isplayer1bind=1;
							
						}
						else if(read("기술/"+player1skill,"addi")==9)
						{
							player1pok.hp=1;
							
						}
						battleres=battleres+"\n";
						battleres=battleres+"Lv."+player1pok.level+" "+player1pok.name+"   ["+player1pok.hp+"/"+player1maxhp+"]\n";
						battleres=battleres+"Lv."+player2pok.level+" "+player2pok.name+"   ["+player2pok.hp+"/"+player2maxhp+"]\n";
						battleres=battleres+"\n";
					}
					else
						battleres=battleres+"["+player1+"] 아쉽게 "+player1pok.name+"의 기술은 빗나갔어요!\n";
					}
					catch(e){
						battleres=battleres+"["+player1+"] 기술 사용에 실패했어요! (데이터 오류)\n";
					}
					if(player2pok.hp<1) return;
					
				}
				//끝
				
				//후공 포켓몬 공격
				if(isplayer2bind==1)
				{
					battleres=battleres+"["+player2+"] "+player2pok.name+"는 공격의 반동으로 움직일 수 없었어요!\n";
					isplayer2bind=0;
				}
				else
				{
					battleres=battleres+"["+player2+"] "+player2pok.name+"의 "+player2skill+"!\n";
					player2pp[player2skillarr.indexOf(player2skill)]--;
					try{
					var accr=Number(read("기술/"+player2skill,"accr"));
					if(player2pok.level<player1pok.level)
						accr=Math.ceil(accr*(100-(player1pok.level-player2pok.level)*2)/100);
					if(isnpcbattle==0){
					if(pokUser[player1].activecollection.includes(9))
						accr=Math.ceil(accr*(100-pokUser[player1].collectionlev*3)/100);
					}
					if(accr<Number(read("기술/"+player2skill,"accr"))/2)
						accr=Number(read("기술/"+player2skill,"accr"))/2;
					if(Math.floor(Math.random()*100)<accr){
						var atk=Math.ceil(player2pok.atk*read("기술/"+player2skill,"damage")/300*(2000-player1pok.def)/2000);
						if(read("기술/"+player2skill,"addi")==4)
							atk=atk*(player2maxhp-player2pok.hp)/2;
						if(player2pok.formchange==0){
							if(read("기술/"+player2skill,"type")==read("포켓몬/"+player2pok.name,"type1")||read("기술/"+player2skill,"type")==read("포켓몬/"+player2pok.name,"type2"))
							atk=atk*1.5;
						}
						else{
							if(read("기술/"+player2skill,"type")==read("포켓몬/"+player2pok.name+"_"+player2pok.formchange,"type1")||read("기술/"+player2skill,"type")==read("포켓몬/"+player2pok.name+"_"+player2pok.formchange,"type2"))
							atk=atk*1.5;
						}
						
						atk=weatherjudge(atk,read("기술/"+player2skill,"type"));
						var judge;
						if(player1pok.formchange==0){
							judge=typejudge(read("기술/"+player2skill,"type"),read("포켓몬/"+player1pok.name,"type1"),read("포켓몬/"+player1pok.name,"type2"));
						}
						else{
							judge=typejudge(read("기술/"+player2skill,"type"),read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"type1"),read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"type2"));
						}
						atk=atk*judge;
						if(pokUser[player2].activecollection.includes(1)||pokUser[player2].activecollection.includes(2))
							atk=atk*(pokUser[player2].collectionlev*2+100)/100;
						if(pokUser[player2].activecollection.includes(3)||pokUser[player2].activecollection.includes(4))
							atk=atk*(pokUser[player2].collectionlev*2+100)/100;
						if(pokUser[player2].activecollection.includes(5))
							atk=atk*(pokUser[player2].collectionlev*2+100)/100;
						if(pokUser[player2].activecollection.includes(6)||pokUser[player2].activecollection.includes(7))
							atk=atk*(pokUser[player2].collectionlev*2+100)/100;
						if(isnpcbattle==0){
						if(pokUser[player1].activecollection.includes(12)&&judge>1)
							atk=atk*(100-pokUser[player1].collectionlev*5)/100;
						}
						player1pok.hp=Math.ceil(player1pok.hp-atk);
						if(player1pok.hp<0){
							if(isnpcbattle==0)
							{
								if(pokUser[player1].activecollection.includes(14)){
								if(Math.floor(Math.random()*100)<pokUser[player1].collectionlev*4)
								{
									player1pok.hp=1;
									battleres=battleres+"["+player1+"] "+player1pok.name+"는 치명적인 공격으로부터 가까스로 버텼어요!\n";
								}
								else
									player1pok.hp=0;
								}
							}
							else
								player1pok.hp=0;
						}
						if(judge>1) battleres=battleres+"["+player2+"] 효과가 굉장했어요!\n";
						else if(judge==0) battleres=battleres+"["+player2+"] 상대에겐 효과가 없는 듯해요...\n";
						else if(judge<1) battleres=battleres+"["+player2+"] 효과가 별로인 듯해요\n";
						
						if(read("기술/"+player2skill,"addi")==3&&judge!=0)
						{
							player2pok.hp=Math.ceil(player2pok.hp-atk/4);
							if(player2pok.hp<1) player2pok.hp=1;
							battleres=battleres+"["+player2+"] "+player2pok.name+"는 공격의 반동으로 데미지를 입었어요!\n";
							
						}
						else if(read("기술/"+player2skill,"addi")==2&&judge!=0)
						{
							player2pok.hp=Math.ceil(player2pok.hp+atk/4);
							if(player2pok.hp>player2maxhp) player2pok.hp=player2maxhp;
							battleres=battleres+"["+player2+"] "+player2pok.name+"는 공격을 통해 체력을 흡수했어요!\n";
							
						}
						else if(read("기술/"+player2skill,"addi")==1&&player2skill!="솔라빔"&&weather!=1)
						{
							isplayer2bind=1;
							
						}
						else if(read("기술/"+player2skill,"addi")==9)
						{
							player2pok.hp=1;
							
						}
						battleres=battleres+"\n";
						battleres=battleres+"Lv."+player1pok.level+" "+player1pok.name+"   ["+player1pok.hp+"/"+player1maxhp+"]\n";
						battleres=battleres+"Lv."+player2pok.level+" "+player2pok.name+"   ["+player2pok.hp+"/"+player2maxhp+"]\n";
						battleres=battleres+"\n";
					}
					else
						battleres=battleres+"["+player2+"] 아쉽게 "+player2pok.name+"의 기술은 빗나갔어요!\n";
					}
					catch(e){
						battleres=battleres+"["+player2+"] 기술 사용에 실패했어요! (데이터 오류)\n";
					}
				}
				//끝 
			}
			else{
				//선공 포켓몬 공격
				if(isplayer2bind==1)
				{
					battleres=battleres+"["+player2+"] "+player2pok.name+"는 공격의 반동으로 움직일 수 없었어요!\n";
					isplayer2bind=0;
				}
				else
				{
					battleres=battleres+"["+player2+"] "+player2pok.name+"의 "+player2skill+"!\n";
					player2pp[player2skillarr.indexOf(player2skill)]--;
					try{
					var accr=Number(read("기술/"+player2skill,"accr"));
					if(player2pok.level<player1pok.level)
						accr=Math.ceil(accr*(100-(player1pok.level-player2pok.level)*2)/100);
					if(isnpcbattle==0){
					if(pokUser[player1].activecollection.includes(9))
						accr=Math.ceil(accr*(100-pokUser[player1].collectionlev*3)/100);
					}
					if(accr<Number(read("기술/"+player2skill,"accr"))/2)
						accr=Number(read("기술/"+player2skill,"accr"))/2;
					if(Math.floor(Math.random()*100)<accr){
						var atk=Math.ceil(player2pok.atk*read("기술/"+player2skill,"damage")/300*(2000-player1pok.def)/2000);
						if(read("기술/"+player2skill,"addi")==4)
							atk=atk*(player2maxhp-player2pok.hp)/2;
						if(player2pok.formchange==0){
							if(read("기술/"+player2skill,"type")==read("포켓몬/"+player2pok.name,"type1")||read("기술/"+player2skill,"type")==read("포켓몬/"+player2pok.name,"type2"))
							atk=atk*1.5;
						}
						else{
							if(read("기술/"+player2skill,"type")==read("포켓몬/"+player2pok.name+"_"+player2pok.formchange,"type1")||read("기술/"+player2skill,"type")==read("포켓몬/"+player2pok.name+"_"+player2pok.formchange,"type2"))
							atk=atk*1.5;
						}
						
						atk=weatherjudge(atk,read("기술/"+player2skill,"type"));
						var judge;
						if(player1pok.formchange==0){
							judge=typejudge(read("기술/"+player2skill,"type"),read("포켓몬/"+player1pok.name,"type1"),read("포켓몬/"+player1pok.name,"type2"));
						}
						else{
							judge=typejudge(read("기술/"+player2skill,"type"),read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"type1"),read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"type2"));
						}
						atk=atk*judge;
						if(pokUser[player2].activecollection.includes(1)||pokUser[player2].activecollection.includes(2))
							atk=atk*(pokUser[player2].collectionlev*2+100)/100;
						if(pokUser[player2].activecollection.includes(3)||pokUser[player2].activecollection.includes(4))
							atk=atk*(pokUser[player2].collectionlev*2+100)/100;
						if(pokUser[player2].activecollection.includes(5))
							atk=atk*(pokUser[player2].collectionlev*2+100)/100;
						if(pokUser[player2].activecollection.includes(6)||pokUser[player2].activecollection.includes(7))
							atk=atk*(pokUser[player2].collectionlev*2+100)/100;
						if(isnpcbattle==0){
						if(pokUser[player1].activecollection.includes(12)&&judge>1)
							atk=atk*(100-pokUser[player1].collectionlev*5)/100;
						}
						player1pok.hp=Math.ceil(player1pok.hp-atk);
						if(player1pok.hp<0){
							if(isnpcbattle==0)
							{
								if(pokUser[player1].activecollection.includes(14)){
								if(Math.floor(Math.random()*100)<pokUser[player1].collectionlev*4)
								{
									player1pok.hp=1;
									battleres=battleres+"["+player1+"] "+player1pok.name+"는 치명적인 공격으로부터 가까스로 버텼어요!\n";
								}
								else
									player1pok.hp=0;
								}
							}
							else
								player1pok.hp=0;
						}
						if(judge>1) battleres=battleres+"["+player2+"] 효과가 굉장했어요!\n";
						else if(judge==0) battleres=battleres+"["+player2+"] 상대에겐 효과가 없는 듯해요...\n";
						else if(judge<1) battleres=battleres+"["+player2+"] 효과가 별로인 듯해요\n";
						
						if(read("기술/"+player2skill,"addi")==3&&judge!=0)
						{
							player2pok.hp=Math.ceil(player2pok.hp-atk/4);
							if(player2pok.hp<1) player2pok.hp=1;
							battleres=battleres+"["+player2+"] "+player2pok.name+"는 공격의 반동으로 데미지를 입었어요!\n";
							
						}
						else if(read("기술/"+player2skill,"addi")==2&&judge!=0)
						{
							player2pok.hp=Math.ceil(player2pok.hp+atk/4);
							if(player2pok.hp>player2maxhp) player2pok.hp=player2maxhp;
							battleres=battleres+"["+player2+"] "+player2pok.name+"는 공격을 통해 체력을 흡수했어요!\n";
							
						}
						else if(read("기술/"+player2skill,"addi")==1&&player2skill!="솔라빔"&&weather!=1)
						{
							isplayer2bind=1;
							
						}
						else if(read("기술/"+player2skill,"addi")==9)
						{
							player2pok.hp=1;
							
						}
						battleres=battleres+"\n";
						battleres=battleres+"Lv."+player1pok.level+" "+player1pok.name+"   ["+player1pok.hp+"/"+player1maxhp+"]\n";
						battleres=battleres+"Lv."+player2pok.level+" "+player2pok.name+"   ["+player2pok.hp+"/"+player2maxhp+"]\n";
						battleres=battleres+"\n";
					}
					else
						battleres=battleres+"["+player2+"] 아쉽게 "+player2pok.name+"의 기술은 빗나갔어요!\n";
					}
					catch(e){
						battleres=battleres+"["+player2+"] 기술 사용에 실패했어요! (데이터 오류)\n";
					}
					if(player1pok.hp<1) return;
				}
				//끝
				
				//후공 포켓몬 공격
				if(isplayer1bind==1)
				{
					battleres=battleres+"["+player1+"] "+player1pok.name+"는 공격의 반동으로 움직일 수 없었어요!\n";
					isplayer1bind=0;
				}
				else
				{
					battleres=battleres+"["+player1+"] "+player1pok.name+"의 "+player1skill+"!\n";
					player1pp[player1skillarr.indexOf(player1skill)]--;
					try{
					var accr=Number(read("기술/"+player1skill,"accr"));
					if(player1pok.level<player2pok.level)
						accr=Math.ceil(accr*(100-(player2pok.level-player1pok.level)*2)/100);
					if(Number(pokUser[player2].activecollection.includes(9)))
						accr=Math.ceil(accr*(100-pokUser[player2].collectionlev*3)/100);
					if(accr<Number(read("기술/"+player1skill,"accr"))/2)
						accr=Number(read("기술/"+player1skill,"accr"))/2;
					if(Math.floor(Math.random()*100)<accr){
						var atk=Math.ceil(player1pok.atk*read("기술/"+player1skill,"damage")/300*(2000-player2pok.def)/2000);
						if(read("기술/"+player1skill,"addi")==4)
							atk=atk*(player1maxhp-player1pok.hp)/2;
						if(player1pok.formchange==0){
							if(read("기술/"+player1skill,"type")==read("포켓몬/"+player1pok.name,"type1")||read("기술/"+player1skill,"type")==read("포켓몬/"+player1pok.name,"type2"))
							atk=atk*1.5;
						}
						else{
							if(read("기술/"+player1skill,"type")==read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"type1")||read("기술/"+player1skill,"type")==read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"type2"))
							atk=atk*1.5;
						}
						
						atk=weatherjudge(atk,read("기술/"+player1skill,"type"));
						var judge;
						if(player2pok.formchange==0){
							judge=typejudge(read("기술/"+player1skill,"type"),read("포켓몬/"+player2pok.name,"type1"),read("포켓몬/"+player2pok.name,"type2"));
						}
						else{
							judge=typejudge(read("기술/"+player1skill,"type"),read("포켓몬/"+player2pok.name+"_"+player2pok.formchange,"type1"),read("포켓몬/"+player2pok.name+"_"+player2pok.formchange,"type2"));
						}
						atk=atk*judge;
						if(isnpcbattle==0){
						if(pokUser[player1].activecollection.includes(1)||pokUser[player1].activecollection.includes(2))
							atk=atk*(pokUser[player1].collectionlev*2+100)/100;
						if(pokUser[player1].activecollection.includes(3)||pokUser[player1].activecollection.includes(4))
							atk=atk*(pokUser[player1].collectionlev*2+100)/100;
						if(pokUser[player1].activecollection.includes(5))
							atk=atk*(pokUser[player1].collectionlev*2+100)/100;
						if(pokUser[player1].activecollection.includes(6)||pokUser[player1].activecollection.includes(7))
							atk=atk*(pokUser[player1].collectionlev*2+100)/100;
						}
						if(pokUser[player2].activecollection.includes(12)&&judge>1)
							atk=atk*(100-pokUser[player2].collectionlev*5)/100;
						player2pok.hp=player2pok.hp-atk;
						if(player2pok.hp<0){
							if(Number(pokUser[player2].activecollection.includes(14)))
							{
								if(Math.floor(Math.random()*100)<pokUser[player2].collectionlev*4)
								{
									player2pok.hp=1;
									battleres=battleres+"["+player2+"] "+player2pok.name+"는 치명적인 공격으로부터 가까스로 버텼어요!\n";
								}
								else
									player2pok.hp=0;
							}
							else
								player2pok.hp=0;
						}
						if(judge>1) battleres=battleres+"["+player1+"] 효과가 굉장했어요!";
						else if(judge==0) battleres=battleres+"["+player1+"] 상대에겐 효과가 없는 듯해요...\n";
						else if(judge<1) battleres=battleres+"["+player1+"] 효과가 별로인 듯해요\n";
						
						if(read("기술/"+player1skill,"addi")==3&&judge!=0)
						{
							player1pok.hp=Math.ceil(player1pok.hp-atk/4);
							if(player1pok.hp<1) player1pok.hp=1;
							battleres=battleres+"["+player1+"] "+player1pok.name+"는 공격의 반동으로 데미지를 입었어요!\n";
							
						}
						else if(read("기술/"+player1skill,"addi")==2&&judge!=0)
						{
							player1pok.hp=Math.ceil(player1pok.hp+atk/4);
							if(player1pok.hp>player1maxhp) player1pok.hp=player1maxhp;
							battleres=battleres+"["+player1+"] "+player1pok.name+"는 공격을 통해 체력을 흡수했어요!\n";
							
						}
						else if(read("기술/"+player1skill,"addi")==1&&player1skill!="솔라빔"&&weather!=1)
						{
							isplayer1bind=1;
							
						}
						else if(read("기술/"+player1skill,"addi")==9)
						{
							player1pok.hp=1;
							
						}
						battleres=battleres+"\n";
						battleres=battleres+"Lv."+player1pok.level+" "+player1pok.name+"   ["+player1pok.hp+"/"+player1maxhp+"]\n";
						battleres=battleres+"Lv."+player2pok.level+" "+player2pok.name+"   ["+player2pok.hp+"/"+player2maxhp+"]\n";
						battleres=battleres+"\n";
					}
					else
						battleres=battleres+"["+player1+"] 아쉽게 "+player1pok.name+"의 기술은 빗나갔어요!\n";
					}
					catch(e){
						battleres=battleres+"["+player1+"] 기술 사용에 실패했어요! (데이터 오류)\n";
					}
				}
				//끝
			}
		battleres=battleres+"\n\n";
		if(weather!=0){
			battleres=battleres+weatherdesc[weather]+"\n";
			if(weather>2)
			{
				if(weather==3)
				{
					if(read("포켓몬/"+player1pok.name,"type1")!=6&&read("포켓몬/"+player1pok.name,"type2")!=6&&read("포켓몬/"+player1pok.name,"type1")!=7&&read("포켓몬/"+player1pok.name,"type2")!=7)
					{
						player1pok.hp=Math.ceil(player1pok.hp*7/8);
						battleres=battleres+"["+player1+"] 모래바람이 "+player1pok.name+"(를)을 덮쳤어요!\n";
					}
					if(read("포켓몬/"+player2pok.name,"type1")!=6&&read("포켓몬/"+player2pok.name,"type2")!=6&&read("포켓몬/"+player2pok.name,"type1")!=7&&read("포켓몬/"+player2pok.name,"type2")!=7)
					{
						player2pok.hp=Math.ceil(player2pok.hp*7/8);
						battleres=battleres+"["+player2+"] 모래바람이 "+player2pok.name+"(를)을 덮쳤어요!\n";
					}
				}
				if(weather==4)
				{
					if(read("포켓몬/"+player1pok.name,"type1")!=11&&read("포켓몬/"+player1pok.name,"type2")!=11)
					{
						player1pok.hp=Math.ceil(player1pok.hp*7/8);
						battleres=battleres+"["+player1+"] 싸라기눈이 "+player1pok.name+"(를)을 덮쳤어요!\n";
					}
					if(read("포켓몬/"+player2pok.name,"type1")!=11&&read("포켓몬/"+player2pok.name,"type2")!=11)
					{
						player2pok.hp=Math.ceil(player2pok.hp*7/8);
						battleres=battleres+"["+player2+"] 싸라기눈이 "+player2pok.name+"(를)을 덮쳤어요!\n";
					}
				}
				battleres=battleres+"\n";
				battleres=battleres+"Lv."+player1pok.level+" "+player1pok.name+"   ["+player1pok.hp+"/"+player1maxhp+"]\n";
				battleres=battleres+"Lv."+player2pok.level+" "+player2pok.name+"   ["+player2pok.hp+"/"+player2maxhp+"]\n";
				battleres=battleres+"\n";
			}
		}
}

function updatetitle(replier,sender) //칭호
{
	var nowr=0;
	nowr=setting.rank.name.indexOf(pokUser[sender].rank);
	if(nowr<setting.rank.name.length-3)
	{
		if(pokUser[sender].count.succ>(setting.rank.upif[nowr+1]))
		{
			pokUser[sender].maxHp=setting.rank.maxHp[nowr+1];
			pokUser[sender].rest=setting.rank.rest[nowr+1];
			pokUser[sender].castT=setting.rank.castT[nowr+1];
			pokUser[sender].success=pokUser[sender].success+setting.rank.success[nowr+1]-setting.rank.success[nowr];
			pokUser[sender].successcatch.g5=pokUser[sender].successcatch.g5+setting.rank.successcatch[nowr+1]-setting.rank.successcatch[nowr];
			pokUser[sender].successcatch.g4=pokUser[sender].successcatch.g4+setting.rank.successcatch[nowr+1]-setting.rank.successcatch[nowr];
			pokUser[sender].successcatch.g3=pokUser[sender].successcatch.g3+setting.rank.successcatch[nowr+1]-setting.rank.successcatch[nowr];
			pokUser[sender].successcatch.g2=pokUser[sender].successcatch.g2+setting.rank.successcatch[nowr+1]-setting.rank.successcatch[nowr];
			pokUser[sender].successcatch.g1=pokUser[sender].successcatch.g1+setting.rank.successcatch[nowr+1]-setting.rank.successcatch[nowr];
			pokUser[sender].rank=setting.rank.name[nowr+1];
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
			java.lang.Thread.sleep(2000);
			replier.reply("@"+sender+"\n축하합니다! ["+pokUser[sender].rank+"] 등급이 되었어요!");
		}
	}
}

function updateribbon(replier,player) //리본
{
	var nowr=0;
	nowr=setting.ribbon.name.indexOf(pokUser[player].ribbon);
	if(nowr<11)
	{
		if(pokUser[player].battlecount.total>(setting.rank.upif[nowr]))
		{
			pokUser[player].upgradedc=setting.ribbon.upgradedc[nowr+1];
			pokUser[player].balldc=setting.ribbon.balldc[nowr+1];
			pokUser[player].stat.g4=pokUser[player].stat.g4+setting.ribbon.g4[nowr+1]-setting.ribbon.g4[nowr];
			pokUser[player].stat.g3=pokUser[player].stat.g3+setting.ribbon.g3[nowr+1]-setting.ribbon.g3[nowr];
			pokUser[player].successcatch.g4=pokUser[player].successcatch.g4+setting.ribbon.successcatch[nowr+1]-setting.ribbon.successcatch[nowr];
			pokUser[player].successcatch.g3=pokUser[player].successcatch.g3+setting.ribbon.successcatch[nowr+1]-setting.ribbon.successcatch[nowr];
			pokUser[player].successcatch.g2=pokUser[player].successcatch.g2+setting.ribbon.successcatch[nowr+1]-setting.ribbon.successcatch[nowr];
			pokUser[player].successcatch.g1=pokUser[player].successcatch.g1+setting.ribbon.successcatch[nowr+1]-setting.ribbon.successcatch[nowr];
			pokUser[player].ribbon=setting.ribbon.name[nowr+1];
			
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player+'.json', JSON.stringify(pokUser[player]));
			java.lang.Thread.sleep(2000);
			replier.reply("@"+player+"\n축하합니다! 리본이 ["+pokUser[player].ribbon+"] 으로 업그레이드되었어요!");
			java.lang.Thread.sleep(1000);
			giveribbonreward(player,pokUser[player].ribbon,replier);
				
		}
		
	}
}

function updatecollection(replier,player) //컬렉션 업데이트
{
	pokUser[player].activecollection=[];
	pokCol[player]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+player+'_collection.json'));
	if(pokCol[player]==null){
        let dogam={'관동지방':[],'성도지방':[],'호연지방':[],'신오지방':[],'하나지방':[],'칼로스지방':[],'알로라지방':[],'전설/환상':[],'울트라비스트':[],'???':[]}
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player+'_collection.json', JSON.stringify(dogam));
		pokCol[player]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+player+'_collection.json'));
    }
	var levsum=0;
	var res="";
	for(var ii of collectionnames){
		if(pokCol[player][ii].length==collectioncontents[collectionnames.indexOf(ii)].length)
			levsum++;
		if(collectionnames.indexOf(ii)<7){ //1~7세대 비전설
			if(pokCol[player][ii].length>(collectioncontents[collectionnames.indexOf(ii)].length)/2)
			{
				pokUser[player].activecollection.push(collectionnames.indexOf(ii)+1);
				res=res+"["+ii+"] 50%\n"
			}
			if(pokCol[player][ii].length==collectioncontents[collectionnames.indexOf(ii)].length)
			{
				pokUser[player].activecollection.push(collectionnames.indexOf(ii)+8);
				res=res+"["+ii+"] 100%\n"
			}
			
		}
		if(collectionnames.indexOf(ii)==7){ //전설
		
			if(pokCol[player][ii].length>(collectioncontents[collectionnames.indexOf(ii)].length)/2)
			{
				pokUser[player].activecollection.push(15);
				res=res+"[전설/환상] 50%\n"
			}
			if(pokCol[player][ii].length==collectioncontents[collectionnames.indexOf(ii)].length)
			{
				pokUser[player].activecollection.push(16);
				res=res+"[전설/환상] 100%\n"
			}
		}
		if(collectionnames.indexOf(ii)==8){ //울트라
			if(pokCol[player][ii].length>(collectioncontents[collectionnames.indexOf(ii)].length)/2)
			{
				pokUser[player].activecollection.push(17);
				res=res+"[울트라비스트] 50%\n"
			}
			if(pokCol[player][ii].length==collectioncontents[collectionnames.indexOf(ii)].length)
			{
				pokUser[player].activecollection.push(18);
				res=res+"[울트라비스트] 100%\n"
			}
		}
		if(collectionnames.indexOf(ii)==9){ //히든
			if(pokCol[player][ii].length>(collectioncontents[collectionnames.indexOf(ii)].length)/2)
			{
				pokUser[player].activecollection.push(19);
				res=res+"[???] 50%\n"
			}
			if(pokCol[player][ii].length==collectioncontents[collectionnames.indexOf(ii)].length)
			{
				pokUser[player].activecollection.push(20);
				res=res+"[???] 100%\n"
			}
		}
				
	}
	pokUser[player].collectionlev=levsum+1;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player+'.json', JSON.stringify(pokUser[player]));
	if(pokUser[player].activecollection.length>0){
		for(var i=0;i<pokUser[player].activecollection.length;i++)
		java.lang.Thread.sleep(1000);
		replier.reply("@"+player+"\n현재 적용된 컬렉션 효과\n\n"+res);
	}
}

function typejudge(skilltype,typea,typeb){
//배틀 상성 판정
var typeres=1;
if(skilltype==1)
{
if(typea==15||typeb==15)
typeres=0;
if(typea==9||typeb==9)
typeres=typeres/2;
if(typea==6||typeb==6)
typeres=typeres/2;
}
else if(skilltype==2)
{
if(typea==2||typeb==2)
typeres=typeres/2;
if(typea==3||typeb==3)
typeres=typeres/2;
if(typea==6||typeb==6)
typeres=typeres/2;
if(typea==17||typeb==17)
typeres=typeres/2;
if(typea==4||typeb==4)
typeres=typeres*2;
if(typea==9||typeb==9)
typeres=typeres*2;
if(typea==10||typeb==10)
typeres=typeres*2;
if(typea==11||typeb==11)
typeres=typeres*2;
}
else if(skilltype==3)
{
if(typea==3||typeb==3)
typeres=typeres/2;
if(typea==4||typeb==4)
typeres=typeres/2;
if(typea==17||typeb==17)
typeres=typeres/2;
if(typea==2||typeb==2)
typeres=typeres*2;
if(typea==6||typeb==6)
typeres=typeres*2;
if(typea==7||typeb==7)
typeres=typeres*2;
}
else if(skilltype==4)
{
if(typea==4||typeb==4)
typeres=typeres/2;
if(typea==2||typeb==2)
typeres=typeres/2;
if(typea==5||typeb==5)
typeres=typeres/2;
if(typea==9||typeb==9)
typeres=typeres/2;
if(typea==10||typeb==10)
typeres=typeres/2;
if(typea==13||typeb==13)
typeres=typeres/2;
if(typea==17||typeb==17)
typeres=typeres/2;
if(typea==3||typeb==3)
typeres=typeres*2;
if(typea==6||typeb==6)
typeres=typeres*2;
if(typea==7||typeb==7)
typeres=typeres*2;
}
else if(skilltype==5)
{
if(typea==6||typeb==6)
typeres=typeres/2;
if(typea==9||typeb==9)
typeres=typeres/2;
if(typea==12||typeb==12)
typeres=typeres/2;
if(typea==4||typeb==4)
typeres=typeres*2;
if(typea==8||typeb==8)
typeres=typeres*2;
if(typea==10||typeb==10)
typeres=typeres*2;
}
else if(skilltype==6)
{
if(typea==7||typeb==7)
typeres=typeres/2;
if(typea==8||typeb==8)
typeres=typeres/2;
if(typea==9||typeb==9)
typeres=typeres/2;
if(typea==2||typeb==2)
typeres=typeres*2;
if(typea==5||typeb==5)
typeres=typeres*2;
if(typea==10||typeb==10)
typeres=typeres*2;
if(typea==11||typeb==11)
typeres=typeres*2;
}
else if(skilltype==7)
{
if(typea==5||typeb==5)
typeres=0;
if(typea==4||typeb==4)
typeres=typeres/2;
if(typea==10||typeb==10)
typeres=typeres/2;
if(typea==2||typeb==2)
typeres=typeres*2;
if(typea==6||typeb==6)
typeres=typeres*2;
if(typea==9||typeb==9)
typeres=typeres*2;
if(typea==12||typeb==12)
typeres=typeres*2;
if(typea==13||typeb==13)
typeres=typeres*2;
}
else if(skilltype==8)
{
if(typea==15||typeb==15)
typeres=0;
if(typea==5||typeb==5)
typeres=typeres/2;
if(typea==18||typeb==18)
typeres=typeres/2;
if(typea==14||typeb==14)
typeres=typeres/2;
if(typea==10||typeb==10)
typeres=typeres/2;
if(typea==13||typeb==13)
typeres=typeres/2;
if(typea==1||typeb==1)
typeres=typeres*2;
if(typea==6||typeb==6)
typeres=typeres*2;
if(typea==9||typeb==9)
typeres=typeres*2;
if(typea==11||typeb==11)
typeres=typeres*2;
if(typea==16||typeb==16)
typeres=typeres*2;
}
else if(skilltype==9)
{
if(typea==2||typeb==2)
typeres=typeres/2;
if(typea==3||typeb==3)
typeres=typeres/2;
if(typea==9||typeb==9)
typeres=typeres/2;
if(typea==12||typeb==12)
typeres=typeres/2;
if(typea==6||typeb==6)
typeres=typeres*2;
if(typea==11||typeb==11)
typeres=typeres*2;
if(typea==18||typeb==18)
typeres=typeres*2;
}
else if(skilltype==10)
{
if(typea==2||typeb==2)
typeres=typeres/2;
if(typea==8||typeb==8)
typeres=typeres/2;
if(typea==18||typeb==18)
typeres=typeres/2;
if(typea==9||typeb==9)
typeres=typeres/2;
if(typea==5||typeb==5)
typeres=typeres/2;
if(typea==13||typeb==13)
typeres=typeres/2;
if(typea==15||typeb==15)
typeres=typeres/2;
if(typea==4||typeb==4)
typeres=typeres*2;
if(typea==14||typeb==14)
typeres=typeres*2;
if(typea==16||typeb==16)
typeres=typeres*2;
}
else if(skilltype==11)
{
if(typea==2||typeb==2)
typeres=typeres/2;
if(typea==3||typeb==3)
typeres=typeres/2;
if(typea==9||typeb==9)
typeres=typeres/2;
if(typea==11||typeb==11)
typeres=typeres/2;
if(typea==4||typeb==4)
typeres=typeres*2;
if(typea==5||typeb==5)
typeres=typeres*2;
if(typea==7||typeb==7)
typeres=typeres*2;
if(typea==17||typeb==17)
typeres=typeres*2;
}
else if(skilltype==12)
{
if(typea==7||typeb==7)
typeres=0;
if(typea==4||typeb==4)
typeres=typeres/2;
if(typea==12||typeb==12)
typeres=typeres/2;
if(typea==17||typeb==17)
typeres=typeres/2;
if(typea==3||typeb==3)
typeres=typeres*2;
if(typea==5||typeb==5)
typeres=typeres*2;
}
else if(skilltype==13)
{
if(typea==9||typeb==9)
typeres=0;
if(typea==13||typeb==13)
typeres=typeres/2;
if(typea==7||typeb==7)
typeres=typeres/2;
if(typea==6||typeb==6)
typeres=typeres/2;
if(typea==15||typeb==15)
typeres=typeres/2;
if(typea==4||typeb==4)
typeres=typeres*2;
if(typea==18||typeb==18)
typeres=typeres*2;
}
else if(skilltype==14)
{
if(typea==16||typeb==16)
typeres=0;
if(typea==9||typeb==9)
typeres=typeres/2;
if(typea==14||typeb==14)
typeres=typeres/2;
if(typea==8||typeb==8)
typeres=typeres*2;
if(typea==13||typeb==13)
typeres=typeres*2;
}
else if(skilltype==15)
{
if(typea==1||typeb==1)
typeres=0;
if(typea==16||typeb==16)
typeres=typeres/2;
if(typea==14||typeb==14)
typeres=typeres*2;
if(typea==15||typeb==15)
typeres=typeres*2;
}
else if(skilltype==16)
{
if(typea==8||typeb==8)
typeres=typeres/2;
if(typea==16||typeb==16)
typeres=typeres/2;
if(typea==18||typeb==18)
typeres=typeres/2;
if(typea==14||typeb==14)
typeres=typeres*2;
if(typea==15||typeb==15)
typeres=typeres*2;
}
else if(skilltype==17)
{
if(typea==18||typeb==18)
typeres=0;
if(typea==9||typeb==9)
typeres=typeres/2;
if(typea==17||typeb==17)
typeres=typeres*2;
}
else if(skilltype==18)
{
if(typea==9||typeb==9)
typeres=typeres/2;
if(typea==13||typeb==13)
typeres=typeres/2;
if(typea==2||typeb==2)
typeres=typeres/2;
if(typea==17||typeb==17)
typeres=typeres*2;
if(typea==16||typeb==16)
typeres=typeres*2;
if(typea==8||typeb==8)
typeres=typeres*2;
}
return typeres;
}

function getprob(sender,replier){ //포켓몬 출현률
	var ran=(Math.floor(Math.random()*1000)+1)/10;
	ran=100-ran;
	var i=0;
	i=setting.p.i;
	ran=ran-i;
	if(ran<0) return 1;
	i=setting.p.g;
	ran=ran-i;
	if(ran<0) return 2;
	ran=ran-1;
	if(ran<0) return 99;
	i=pokUser[sender].stat.g5;
	if(Number(pokUser[sender].activecollection.includes(20)))
		i=i+pokUser[sender].collectionlev;
	ran=ran-i;
	if(ran<0) return 3;
	i=pokUser[sender].stat.g4+setting.eventp.g4;
	if(i<0) i=0;
	ran=ran-i;
	if(ran<0) return 4;
	i=pokUser[sender].stat.g3+setting.eventp.g3;
	if(i<0) i=0;
	ran=ran-i;
	if(ran<0) return 5;
	i=setting.p.g2;
	ran=ran-i;
	if(ran<0) return 6;
	i=Math.ceil((100-pokUser[sender].stat.g4-setting.eventp.g4-pokUser[sender].stat.g3-setting.eventp.g3-setting.p.g2)/2);
	ran=ran-i;
	if(ran<0) return 7;
	else return 6;
	//i:1 g:2 g5:3 g4:4 g3:5 g2:6 g1:7
	//7: 계절포켓몬
	//99: 히든포켓몬
}

//포획률 함수
function catchjudge(group,sender,replier){
	var ran=Math.floor(Math.random()*100)+1;
	var iscatch=0;
	if(group==99)
		iscatch=20;
	else if(group==5)
		iscatch=pokUser[sender].successcatch.g5;
	else if(group==4)
		iscatch=pokUser[sender].successcatch.g4;
	else if(group==3)
		iscatch=pokUser[sender].successcatch.g3;
	else if(group==2)
		iscatch=pokUser[sender].successcatch.g2;
	else
		iscatch=pokUser[sender].successcatch.g1;
	iscatch=Number(iscatch);
	if(group==4) iscatch=iscatch+setting.eventp.g4catch;
	else if(group==3) iscatch=iscatch+setting.eventp.g3catch;
	else iscatch=iscatch+setting.eventp.allcatch;
	if(Number(pokUser[sender].activecollection.includes(17)))
		iscatch=Number(iscatch+pokUser[sender].collectionlev);
	if(iscatch<0) iscatch=1;
	if(iscatch<ran) 
		return false;
	else
		return true;
}

function pokjoin(sender, replier){
    pokUser[sender]=JSON.parse(FileStream.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
    if(pokUser[sender]==null){
        if(sender.includes('/')){
            replier.reply('@'+sender+' \n• 닉네임에 슬래시"/" 가 들어가면 가입할 수 없어요.');
            return;
        }
        if(sender.length<1){
            replier.reply('@'+sender+' \n• 닉네임이 공백이면 가입할 수 없어요.');
            return;
        }
        let data={
            'name':sender,
            'hp':setting.rank.maxHp[0], 'maxHp':setting.rank.maxHp[0],
            'stat':{
                'g5':setting.p.g5,'g4':setting.p.g4, 'g3':setting.p.g3, 'g2':setting.p.g2, 'g1':setting.p.g1  //그룹별 출현률
            },
            'rank':setting.rank.name[0],  //칭호
			'ribbon':setting.ribbon.name[0], //리본
			'balldc':setting.ribbon.balldc[0], //볼값 할인
			'upgradedc':setting.ribbon.upgradedc[0], //강화값 할인
            'gold':1000,  //초기보유자금
            'Ball':ballArr[0],  //볼이름
            'balls':50, //초기볼갯수
            'count':{
                'total':0,  //포켓몬 조우횟수
                'succ':0,  //포획 성공횟수
                'fail':0  //포획 실패횟수
            },
			'battlecount':{
                'total':0,  //배틀횟수
                'win':0,  //배틀 승리횟수
                'lose':0  //배틀 패배횟수
            },
			'badge':0,
			'activecollection':[],
			'collectionlev':0,
            'success':setting.success,  //탐방성공률
			'successcatch':{
				'g5':setting.catchsuccess[0], 'g4':setting.catchsuccess[1], 'g3':setting.catchsuccess[2], 'g2':setting.catchsuccess[3], 'g1':setting.catchsuccess[4]
			},  //포획성공률
            'rest':Number(setting.rank.rest[0]),  //체력+1당 휴식시간
            'castT':0,  //캐스팅시간
            'restOn':{'on':0, 'time':0}  //휴식객체
        };
        let inv={'deck':[],'box':[],'item':['전설알','전설알','전설알']};
		let dogam={'관동지방':[],'성도지방':[],'호연지방':[],'신오지방':[],'하나지방':[],'칼로스지방':[],'알로라지방':[],'전설/환상':[],'울트라비스트':[],'???':[]}
        FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(data));
        FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(inv));
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json', JSON.stringify(dogam));
        replier.reply('@'+sender+'\n포켓몬의 세계에 오신 것을 환영합니다!\n@야생 명령어를 입력하면 탐험을 시작하게 됩니다.\n\n※신규 가입 지원 보상으로 전설의 포켓몬의 알 3개가 지급되었습니다. '+cmds.legendegg+"로 알을 부화시켜 보세요.");
    } else replier.reply('@'+sender+' \n이미 가입한 상태에요.');
}

function pokleave(sender,replier){
    pokUser[sender]=JSON.parse(FileStream.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
    if(pokUser[sender]!=null){
		pokUser[sender]==null;
		pokInv[sender]==null;
		pokCol[sender]==null;
		let pokRank=JSON.parse(FileStream.read(pathRank));
        if(pokRank.some(e=>e.name==sender)){
            pokRank.splice(pokRank.findIndex(e=>e.name==sender),1);
            FileStream.write(pathRank, JSON.stringify(pokRank));
        }
        FileStream.remove("sdcard/Devel/Pokemon/Data/player_"+sender+'.json');
        FileStream.remove("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json');
		FileStream.remove("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json');
        replier.reply('@'+sender+'\n탈퇴가 완료되었어요. 바이바이.');
    } else replier.reply('@'+sender+' \n가입한 상태가 아니에요.');
}

function response(room, msg, sender, isGroupChat, replier, ImageDB){
if(room!="루시 포켓몬방"&&room!="낚시터") return;
if(msg==cmds.join) //가입
	pokjoin(sender,replier);
if(msg==cmds.leave) //탈퇴
	pokleave(sender,replier);
if(cmds.play.includes(msg)){
	/* 디바이스 온도 체크 */
    if(Device.getBatteryTemperature()>=450){
        replier.reply('@'+sender+' \n봇이 과열되었어요!\n조금만 쉬었다가 다시 해 주세요.');
        return;
    }
    /* 쓰레드감지 */
    if(Api.getActiveThreadsCount()>=7){
        replier.reply('@'+sender+' \n사용자 폭주중이예요.\n잠시후에 다시 시도해 주세요.');
        return;
    }
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	if(advOn[sender]==undefined) advOn[sender]=0;
	if(advOn[sender]==2||advOn[sender]==3){
        replier.reply('@'+sender+'\n이미 탐험 또는 배틀 중이에요.');
        return;
    }
	if(advOn[sender]==1){
        replier.reply('@'+sender+'\n탐험중이에요. 기다리세요.');
        return;
    }
	if(pokUser[sender].restOn.on){
        replier.reply('@'+sender+' \n휴식 중입니다.\n"'+cmds.rest+'" 을 입력해서 휴식을 종료하세요.');
        return;
    }
    if(pokUser[sender].hp<=0){
        replier.reply('@'+sender+' \n체력이 부족해요.\n"'+cmds.rest+'" 명령어를 사용해보세요.');
        return;
    }
	if(pokUser[sender].balls<=0){
        replier.reply('@'+sender+' \n볼이 없는 상태에선 탐험할 수 없어요.\n"'+cmds.ball+'" 을 통해 볼을 구매해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	pokCol[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json'));
	if(pokCol[sender]==null){
        let dogam={'관동지방':[],'성도지방':[],'호연지방':[],'신오지방':[],'하나지방':[],'칼로스지방':[],'알로라지방':[],'전설/환상':[],'울트라비스트':[],'???':[]}
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json', JSON.stringify(dogam));
		pokCol[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json'));
    }
	pokdelay[sender]=Math.ceil((Math.random()*(setting.castT.max*1000-setting.castT.min*1000)+setting.castT.min*1000)*(100-Number(pokUser[sender].castT))/100);
	advOn[sender]=1;
	replier.reply("@"+sender+"\n탐험을 시작합니다!\n탐험은 포켓몬을 발견하면 종료되며,\n실패 또는 포켓몬 미발견 시마다 자동으로 재시도됩니다.");

	java.lang.Thread.sleep(pokdelay[sender]);
	
	if(advOn[sender]==0) return;
	
	var r=0;
	r=Math.floor(Math.random()*100)+1;
	if(r>pokUser[sender].success) //탐험실패
	{
		do{
			replier.reply("@"+sender+"\n"+advfail[Math.floor(Math.random()*advfail.length)]);
			--pokUser[sender].hp;
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
			pokdelay[sender]=Math.ceil((Math.random()*(setting.castT.max*1000-setting.castT.min*1000)+setting.castT.min*1000)*(100-Number(pokUser[sender].castT))/100);
			java.lang.Thread.sleep(pokdelay[sender]);
	
			if(advOn[sender]==0) return;
			r=Math.floor(Math.random()*100)+1;
		}while(r>pokUser[sender].success);
	}
	var prob=0;
	prob=getprob(sender,replier);
	if(prob<3){
	do{
		if(r>pokUser[sender].success) //탐험실패
		{
			replier.reply("@"+sender+"\n"+advfail[Math.floor(Math.random()*advfail.length)]);
		}
		else
		{
		if(prob==1) //돈발견
		{
			
			var money=(Math.floor(Math.random()*100)+1)*500;//100~10000
			money=money*(ballArr.indexOf(pokUser[sender].Ball)+1)*100; //볼 강화당 돈발견 금액 증가
			if(Number(pokUser[sender].activecollection.includes(19)))
				money=money*(pokUser[sender].collectionlev*10+100)/100;
			if(Number(pokUser[sender].activecollection.includes(16)))
				money=money*(pokUser[player].collectionlev+1);
			money=money*setting.eventp.goldX;
			pokUser[sender].gold=pokUser[sender].gold+money;
			replier.reply("@"+sender+"\n"+pokArr.gold[Math.floor(Math.random()*pokArr.gold.length)]+"를(을) 발견했어요!\n상점에 팔아 "+money.comma()+"원을 획득했어요.");
		}
		else if(prob==2)
		{
			var ran=Math.floor(Math.random()*100)+1;
			if(ran<85)
			{
				var balln=Math.floor(Math.random()*10)+1;
				pokUser[sender].balls=Number(pokUser[sender].balls)+Number(balln);
				if(pokUser[sender].balls>setting.maxball)
					pokUser[sender].balls=setting.maxball;
				replier.reply("@"+sender+"\n바닥에 떨어진 볼을 발견했어요!\n볼 "+balln+"개 획득.");
			}
			else
			{
				if(ran<95&&ran>84)
				{
					pokInv[sender].item.push("일반알");
					replier.reply("@"+sender+"\n축하합니다!\n포켓몬의 알을 발견했습니다.\n'"+cmds.egg+"' 명령어를 통해 알을 부화시키세요.");
				}
				else if(ran==99)
				{
					pokInv[sender].item.push("전설알");
					replier.reply("@"+sender+"\n축하합니다!\n<⭐전설⭐> 포켓몬의 알을 발견했습니다.\n'"+cmds.legendegg+"' 명령어를 통해 알을 부화시키세요.");
				}
				else if(ran==98)
				{
					var money=setting.luckygold*10;
					if(Number(pokUser[sender].activecollection.includes(19)))
						money=money*(pokUser[sender].collectionlev*10+100)/100;
					pokUser[sender].gold=pokUser[sender].gold+money;
					var moneyprint="";
					if(money>100000000)
					{
						moneyprint=moneyprint+Math.floor(money/100000000)+"억 ";
						if((money%100000000)!=0)
							moneyprint=moneyprint+Math.floor((money%100000000)/10000)+"만 ";
					}
					else
						moneyprint=moneyprint+Math.floor((money%100000000)/10000)+"만 ";
					replier.reply("@"+sender+"\n축하합니다!\n👑마제스티의 키를 발견했어요!\n상점에 팔아 "+moneyprint+"원을 획득했어요.");
				}	
				else
				{
					var money=setting.luckygold;
					if(Number(pokUser[sender].activecollection.includes(19)))
						money=money*(pokUser[sender].collectionlev*10+100)/100;
					pokUser[sender].gold=pokUser[sender].gold+money;
					var moneyprint="";
					if(money>100000000)
					{
						moneyprint=moneyprint+Math.floor(money/100000000)+"억 ";
						if((money%100000000)!=0)
							moneyprint=moneyprint+Math.floor((money%100000000)/10000)+"만 ";
					}
					else
						moneyprint=moneyprint+Math.floor((money%100000000)/10000)+"만 ";
					replier.reply("@"+sender+"\n축하합니다!\n🪨알 수 없는 돌을 발견했어요!\n상점에 팔아 "+moneyprint+"원을 획득했어요.");
				}	
			}
		}
		}
		
		--pokUser[sender].hp;
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
        FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
		
		pokdelay[sender]=Math.ceil((Math.random()*(setting.castT.max*1000-setting.castT.min*1000)+setting.castT.min*1000)*(100-Number(pokUser[sender].castT))/100);
		java.lang.Thread.sleep(pokdelay[sender]);
		
		if(advOn[sender]==0) return;
		prob=getprob(sender,replier);
		r=Math.floor(Math.random()*100)+1;
	}while(prob<3);
	if(pokUser[sender].hp<0) pokUser[sender].hp=0;
	}
	let pokname="";
	var lev=0;
	if(Math.floor(Math.random()*50)==1)
	{
		let pokseason=JSON.parse(FileStream.read(pathseason));
		if(pokseason==null){
			let data={"month":1};
			FileStream.write(pathseason, JSON.stringify(data));
			pokseason=JSON.parse(FileStream.read(pathseason));
		}
		month=month+1;
		if(month>4) month=month-4;
		
		pokseason["month"]=month;
		FileStream.write(pathseason, JSON.stringify(pokseason));
		var seasontext=["","봄","여름","가을","겨울"];
		replier.reply("현재 계절: "+seasontext[month]);
	}
	if(prob==7)
	{
		let pokseason=JSON.parse(FileStream.read(pathseason));
		if(pokseason==null){
			let data={"month":1};
			FileStream.write(pathseason, JSON.stringify(data));
			pokseason=JSON.parse(FileStream.read(pathseason));
		}
		month=pokseason["month"];
		
		if(month==1)
			pokname=seasons.spring[Math.floor(Math.random()*seasons.spring.length)];
		else if(month==2)
			pokname=seasons.summer[Math.floor(Math.random()*seasons.summer.length)];
		else if(month==3)
			pokname=seasons.autumn[Math.floor(Math.random()*seasons.autumn.length)];
		else
			pokname=seasons.winter[Math.floor(Math.random()*seasons.winter.length)];
	}
	else if(prob==99)
		pokname=pokArr.groupunknown[Math.floor(Math.random()*pokArr.groupunknown.length)];
	else if(prob==3)
		pokname=pokArr.group5[Math.floor(Math.random()*pokArr.group5.length)];
	else if(prob==4)
	{
		pokname=pokArr.group4[Math.floor(Math.random()*pokArr.group4.length)];
	}
	else if(prob==5)
		pokname=pokArr.group3[Math.floor(Math.random()*pokArr.group3.length)];
	else if(prob==6)
		pokname=pokArr.group2[Math.floor(Math.random()*pokArr.group2.length)];
	else
		pokname=pokArr.group1[Math.floor(Math.random()*pokArr.group1.length)];
	let lt=pokname.length-1;
	lev=lev+setting.minlevel+(ballArr.indexOf(pokUser[sender].Ball)+1)*setting.balluplev; //볼 강화당 출현레벨 8씩 증가
	lev=lev+Math.floor(Math.random()*10)+1;
	if(pokArr.groupunknown.includes(pokname))
		replier.reply("@"+sender+"\n❗ <???> "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '이' : '가')+" 나타났어요!");
	else if(pokArr.group5.includes(pokname))
		replier.reply("@"+sender+"\n❗ <🦄울트라비스트🦄> "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '이' : '가')+" 나타났어요!");
	else if(pokArr.group4.includes(pokname))
		replier.reply("@"+sender+"\n❗ <⭐전설⭐> "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '이' : '가')+" 나타났어요!");
	else if(pokArr.group3.includes(pokname))
		replier.reply("@"+sender+"\n❗ [레어] 야생의 "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '이' : '가')+" 나타났어요!");
	else if(pokArr.group2.includes(pokname))
		replier.reply("@"+sender+"\n❗ [고급] 야생의 "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '이' : '가')+" 나타났어요!");
	else
		replier.reply("@"+sender+"\n❗ [일반] 야생의 "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '이' : '가')+" 튀어나왔어요!");
	++pokUser[sender].count.total;
	
	let pokinfo={
		'name':pokname,
		'level':lev
	};
	ispokfind.push(sender);
	battlepokinfo.push(pokinfo);
	isballwaiting=[];
	advOn[sender]=2;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
    FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	try{
		img=pokimglink(pokname,0);
		poklink="ko/wiki/"+encodeURIComponent(pokname+"_(포켓몬)");
		//
		
		Kakao.sendLink(room, {
			"link_ver":"4.0",
			"template_id":(58796),
			"template_args":{
			//이곳에 템플릿 정보를 입력하세요.
			'POKIMG':img,
			'POKNAME':"Lv."+lev+"  "+pokname,
			'DESC':"볼던지기: "+cmds.ballthrow.join("/")+"\n도망가기: "+cmds.esc.join("/"),
			'LINK':poklink
			}
			}, "custom")
	//
	}catch(e){
		replier.reply("카카오링크 오류. 리셋 한번 해주세요.\n(볼은 던질수 있음)\n\n"+"Lv."+lev+"  "+pokname+"\n볼던지기: "+cmds.ballthrow.join("/")+"\n도망가기: "+cmds.esc.join("/"));
	}

}

if(cmds.ballthrow.includes(msg)){ //볼던지기
	/* 디바이스 온도 체크 */
    if(Device.getBatteryTemperature()>=450){
        replier.reply('@'+sender+'\n봇이 과열되었어요!\n조금만 쉬었다가 다시 해 주세요.');
        return;
    }
    /* 쓰레드감지 */
    if(Api.getActiveThreadsCount()>=7){
        replier.reply('@'+sender+' \n사용자 폭주중이예요.\n잠시후에 다시 시도해 주세요.');
        return;
    }
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	if(advOn[sender]!=2){
        replier.reply('@'+sender+'\n발견한 포켓몬이 없어요!\n@야생 명령어로 탐험부터 시작해 보세요.');
        return;
    }
	if(isballwaiting.includes(sender)){
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	let pokname=battlepokinfo[ispokfind.indexOf(sender)].name;
	--pokUser[sender].balls; //볼 소모
	replier.reply(sender+' 님이 '+pokname+'에게 '+pokUser[sender].Ball+'을 던졌어요!');
	isballwaiting.push(sender);
	var group=0;
	if(pokArr.groupunknown.includes(pokname))
		group=99;
	else if(pokArr.group5.includes(pokname))
		group=5;
	else if(pokArr.group4.includes(pokname))
		group=4;
	else if(pokArr.group3.includes(pokname))
		group=3;
	else if(pokArr.group2.includes(pokname))
		group=2;
	else
		group=1;
	java.lang.Thread.sleep(1000);
		if(catchjudge(group,sender,replier))
		{
			//포획성공
			var caughtpoklev=Number(battlepokinfo[ispokfind.indexOf(sender)].level);
			var skillsarr=read("포켓몬/"+pokname,"skills");
			var caughtpokskills=[];
			if(skillsarr.length<5)
				caughtpokskills=skillsarr;
			else
			{
				while(caughtpokskills.length<4)
				{
					var t=skillsarr[Math.floor(Math.random()*skillsarr.length)];
					t=t.replace("DP","").replace("Pt","");
					if(caughtpokskills.indexOf(t)==(-1))
						caughtpokskills.push(t);
				}
			}
			
			var caughtpokhp=read("포켓몬/"+pokname,"hp");
			
			let caughtpok={
				'name':pokname,
				'level':caughtpoklev,
				'hp': Math.ceil(caughtpokhp*caughtpoklev/50),
				'atk': Math.ceil(read("포켓몬/"+pokname,"atk")*caughtpoklev/50),
				'def': Math.ceil(read("포켓몬/"+pokname,"def")*caughtpoklev/50),
				'spd': Math.ceil(read("포켓몬/"+pokname,"spd")*caughtpoklev/50),
				'skills':caughtpokskills,
				'skillslocked':[],
				'formchange':0,
				'islocked':0
			};
			pokInv[sender].box.push(caughtpok);
			++pokUser[sender].count.succ;
			--pokUser[sender].hp;
			let lt=battlepokinfo[ispokfind.indexOf(sender)].name.length-1;
			replier.reply("@"+sender+"\n축하합니다!\n"+pokname+(pokname[lt].normalize("NFD").length == 3 ? '을' : '를')+" 잡았습니다!");
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
			battlepokinfo.splice(ispokfind.indexOf(sender),1);
			ispokfind.splice(ispokfind.indexOf(sender),1);
			advOn[sender]=0;
			replier.reply("@"+sender+"\n잡은 포켓몬을 저장했습니다.");
			for(var ii of collectionnames){
			if(collectioncontents[collectionnames.indexOf(ii)].includes(pokname))
			{
				if(pokCol[sender][ii].indexOf(pokname)==(-1))
				{
					pokCol[sender][ii].push(pokname)
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json', JSON.stringify(pokCol[sender]));
					replier.reply("@"+sender+"\n도감의 ["+ii+"] 에 새로운 포켓몬이 등록되었습니다.");
					updatecollection(replier,sender);
					break;
				}
			}
		}
		
			updatetitle(replier,sender);
			return;
		}
		else
		{
			//포획실패
			replier.reply("@"+sender+"\n"+ballfail[Math.floor(Math.random()*ballfail.length)])
			var runprob=0;
			if(runpoks.includes(pokname)||pokArr.groupunknown.includes(pokname)) runprob=90;
			else runprob=setting.run[5-group];
			if(runprob>(Math.floor(Math.random()*100)+1)) //포켓몬 도주
			{
				++pokUser[sender].count.fail;
				--pokUser[sender].hp;
				battlepokinfo.splice(ispokfind.indexOf(sender),1);
				ispokfind.splice(ispokfind.indexOf(sender),1);
				FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
				FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
				advOn[sender]=0;
				let lt=pokname.length-1;
				replier.reply("@"+sender+"\n야생의 "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '은' : '는')+" 도망쳐 버렸어요!\n포획 실패!");
			}
			else if(pokUser[sender].balls<1) //볼없음
			{
				++pokUser[sender].count.fail;
				--pokUser[sender].hp;
				battlepokinfo.splice(ispokfind.indexOf(sender),1);
				ispokfind.splice(ispokfind.indexOf(sender),1);
				FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
				FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
				advOn[sender]=0;
				replier.reply("@"+sender+"\n더 이상 던질 볼이 없어 도망쳐 나왔어요. "+cmds.ball+" 를 통해 볼을 구매해 주세요!\n포획 실패!");
			}
			else
			{
				FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
				replier.reply("@"+sender+"\n\n"+battlepokinfo[ispokfind.indexOf(sender)].name+"\nLv."+battlepokinfo[ispokfind.indexOf(sender)].level+"\n\n볼 던지기:"+cmds.ballthrow.join("/")+" 도망가기:"+cmds.esc.join("/"));
			}
		}
	
	isballwaiting.splice(isballwaiting.indexOf(sender),1);
	
}

if(cmds.esc.includes(msg)){ //도망
	/* 디바이스 온도 체크 */
    if(Device.getBatteryTemperature()>=390){
        replier.reply('@'+sender+'\n루시가 과열되었어요!\n조금만 쉬었다가 다시 해 주세요.');
        return;
    }
    /* 쓰레드감지 */
    if(Api.getActiveThreadsCount()>=5){
        replier.reply('@'+sender+' \n사용자 폭주중이예요.\n잠시후에 다시 시도해 주세요.');
        return;
    }
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	if(advOn[sender]!=2){
        replier.reply('@'+sender+'\n발견한 포켓몬이 없어요!\n@야생 명령어로 탐험부터 시작해 보세요.');
        return;
    }
	--pokUser[sender].hp;
	battlepokinfo.splice(ispokfind.indexOf(sender),1);
	ispokfind.splice(ispokfind.indexOf(sender),1);
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
	advOn[sender]=0;
	replier.reply("@"+sender+"\n무사히 도망쳤어요!");
}
if(msg==cmds.box)//포켓몬 보관함
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	var str="";
	var str2="";
	var showlocked=[" ","🔒"];
	if(pokInv[sender].deck.length<1) str="\n현재 장착 중인 덱이 없습니다.\n";
	else{
		for(var i=0;i<pokInv[sender].deck.length;i++)
			str=str+(i+1)+".  Lv."+pokInv[sender].deck[i].level+" "+pokInv[sender].deck[i].name+"\n";
		if(pokInv[sender].deck.length<6)
		{
			for(var i=0;i<(6-pokInv[sender].deck.length);i++)
				str=str+(pokInv[sender].deck.length+(i+1))+".  (비어 있음)\n";
		}
	}
	if(pokInv[sender].box.length<1) str2="\n보유 중인 포켓몬이 없습니다.\n";
	else{
		for(var i=0;i<pokInv[sender].box.length;i++)
			str2=str2+(i+1)+".  Lv."+pokInv[sender].box[i].level+" "+pokInv[sender].box[i].name+" "+showlocked[pokInv[sender].box[i].islocked]+"\n";
	}
	replier.reply("["+sender+"] 님의 포켓몬 목록\n"+"\u200b".repeat(500)+"\n포켓몬 정보 자세히 보기: "+cmds.pokinfo+" (숫자)\n(덱에 장착 중인 포켓몬은 "+cmds.dpokinfo+" 를 이용)\n※포켓몬 스킬 뽑기, 레벨업은 덱에 장착된 상태여야 가능\n\n덱 장착: "+cmds.lock+" (번호)\n덱 장착해제: "+cmds.unlock+" (번호)\n덱 순서 변경: "+cmds.swap+" (번호1) (번호2)\n보관함 포켓몬 잠금: "+cmds.boxlock+" (번호)\n보관함 포켓몬 잠금해제: "+cmds.boxunlock+" (번호)\n\n-----[배틀 덱]-----\n"+str+"\n----------\n\n\n-----[보관함]-----\n"+str2+"\n----------");
}

if(msg.split(" ")[0]==cmds.boxlock)//잠금
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].box.length+1)&&msg.indexOf(".")==(-1))
	{
	var n=msg.split(" ")[1];
	pokInv[sender].box[n-1].islocked=1;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	replier.reply("@"+sender+"\n박스의 Lv."+pokInv[sender].box[n-1].level+" "+pokInv[sender].box[n-1].name+"(을)를 잠금 완료했어요!");
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
}

if(msg.split(" ")[0]==cmds.boxunlock)//잠금해제
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].box.length+1)&&msg.indexOf(".")==(-1))
	{
	var n=msg.split(" ")[1];
	pokInv[sender].box[n-1].islocked=0;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	replier.reply("@"+sender+"\n박스의 Lv."+pokInv[sender].box[n-1].level+" "+pokInv[sender].box[n-1].name+"(을)를 잠금 해제했어요!");
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
}

if(msg.split(" ")[0]==cmds.sell)//놓아주기
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].box.length>0)
	{
		var money=0;
		var pokmoney=0;
		let tempbox=[];
	for(var i=0;i<pokInv[sender].box.length;i++)
	{
		if(pokInv[sender].box[i].islocked==0)
		{
			pokmoney=3000*pokInv[sender].box[i].level*pokInv[sender].box[i].level;
			if(pokArr.group4.includes(pokInv[sender].box[i].name)||pokInv[sender].box[i].name=="다부니")
				pokmoney=pokmoney*5;
			else if(pokArr.group5.includes(pokInv[sender].box[i].name))
				pokmoney=pokmoney*10;
			money=money+pokmoney;
			
		}
		else{
			tempbox.push(pokInv[sender].box[i]);
		}
	}
	pokInv[sender].box=[];
	if(tempbox.length>0){
		for(var i=0;i<tempbox.length;i++)
			pokInv[sender].box.push(tempbox[i]);
	}
	if(Number(pokUser[sender].activecollection.includes(19)))
		money=money*(pokUser[sender].collectionlev*10+100)/100;
	money=money*setting.eventp.goldX;
	pokUser[sender].gold=pokUser[sender].gold+money;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
	replier.reply("@"+sender+"\n잠금상태의 포켓몬을 제외한 박스의 모든 포켓몬을 놓아주었어요.\n"+money.comma()+"원 획득.\n\n보유금액: "+(pokUser[sender].gold).comma()+"원");
	}else replier.reply("@"+sender+"\n박스에 포켓몬이 없어요.");
}

if(msg.split(" ")[0]==cmds.create)//포켓몬 합성
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].box.length>0)
	{
		var pok1num=msg.split(" ")[1];
		var pok2num=msg.split(" ")[2];
		if(pok1num==pok2num){
			replier.reply('@'+sender+"\n서로 다른 두 포켓몬을 선택해 주세요.");
			return;
		}
		if(pok2num<pok1num){
			var ttemp=pok2num;
			pok2num=pok1num;
			pok1num=ttemp;
		}
		if((pokArr.group4.indexOf(pokInv[sender].box[pok1num-1].name)==(-1)&&setting.leaguechararr.indexOf(pokInv[sender].box[pok1num-1].name)==(-1))||(pokArr.group4.indexOf(pokInv[sender].box[pok2num-1].name)==(-1)&&setting.leaguechararr.indexOf(pokInv[sender].box[pok2num-1].name)==(-1)))
		{
			replier.reply('@'+sender+'\n포켓몬 합성은 두 마리의 전설의 포켓몬으로만 가능해요.\n사용방법: '+cmds.create+" (박스번호1) (박스번호2)");
			return;
		}
		if(pokInv[sender].box[pok1num-1].islocked!=0||pokInv[sender].box[pok2num-1].islocked!=0)
		{
			replier.reply('@'+sender+"\n선택한 두 포켓몬 중 잠금 상태의 포켓몬이 있어요.");
			return;
		}
		var money=100000000;
		if(pokUser[sender].gold<money)
		{
			replier.reply('@'+sender+"\n돈이 부족해요.\n포켓몬 합성 비용: "+money.comma()+"원");
			return;
		}
		var oldpoks=[pokInv[sender].box[pok1num-1].name,pokInv[sender].box[pok2num-1].name];
	pokInv[sender].box.splice((pok2num-1),1);
	pokInv[sender].box.splice((pok1num-1),1);
	pokUser[sender].gold=pokUser[sender].gold-money;
	pokInv[sender].item.push("전설알");
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
	replier.reply("@"+sender+"\n"+money.comma()+"원 지불.\n보유금액: "+(pokUser[sender].gold).comma()+"원\n\n"+oldpoks[0]+" + "+oldpoks[1]+"을 합성하여 전설의 포켓몬의 알을 획득했어요.\n"+cmds.legendegg+" 명령어로 획득한 알을 부화시키세요.");
	}else replier.reply("@"+sender+"\n박스에 포켓몬이 없어요.");
}


if(msg==cmds.gatcha)//제비뽑기
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(gatchaplayers[sender]==null||gatchaplayers[sender]==undefined)
		gatchaplayers[sender]=0;
	gatchaplayers[sender]++;
	if(Number(pokUser[sender].activecollection.includes(15)))
	{
		if(gatchaplayers[sender]>(3+pokUser[sender].collectionlev)){
			replier.reply('@'+sender+"\n제비뽑기는 1회 리로드 당 3(+"+pokUser[sender].collectionlev+")회만 도전할 수 있어요.");
			return;
		}
	}
	else if(gatchaplayers[sender]>3)
	{
		replier.reply('@'+sender+"\n제비뽑기는 1회 리로드 당 3회만 도전할 수 있어요.");
		return;
	}
	var gooditemadd=0;
	if(Number(pokUser[sender].activecollection.includes(13)))
	{
		gooditemadd=pokUser[sender].collectionlev;
	}
	var itemname = ["1000000","10000000","볼 10개","볼 30개","100000000","알수없는돌","일반알","전설알","마제스티의키","10000000000","100000000000","100"];
	var itemrate = [240,200,100,100,(20+gooditemadd*10),(10+gooditemadd*10),(20+gooditemadd*10),(10+gooditemadd*10),(6+gooditemadd*10),(3+gooditemadd*10),(1+gooditemadd*10),300];
      var ran = Math.random()*1000;
      var a = 0;
      var b = itemrate[0];
      for(var j = 0 ; j < itemrate.length ; j++){
         if(ran>=a && ran<b)
         {
            var res="";
			var resdesc="";
			if(itemname[j]=="알수없는돌")
			{
				res="🪨알 수 없는 돌";
				var money=setting.luckygold;
					if(Number(pokUser[sender].activecollection.includes(19)))
						money=money*(pokUser[sender].collectionlev*10+100)/100;
					pokUser[sender].gold=pokUser[sender].gold+money;
					var moneyprint="";
					if(money>100000000)
					{
						moneyprint=moneyprint+Math.floor(money/100000000)+"억 ";
						if((money%100000000)!=0)
							moneyprint=moneyprint+Math.floor((money%100000000)/10000)+"만 ";
					}
					else
						moneyprint=moneyprint+Math.floor((money%100000000)/10000)+"만 ";
					resdesc=moneyprint+"원 획득.";
				
			}
			else if(itemname[j]=="볼 30개")
			{
				res=itemname[j];
				pokUser[sender].balls=Number(pokUser[sender].balls)+30;
				if(pokUser[sender].balls>setting.maxball)
					pokUser[sender].balls=setting.maxball;
					resdesc="";
			}
			else if(itemname[j]=="볼 10개")
			{
				res=itemname[j];
				pokUser[sender].balls=Number(pokUser[sender].balls)+10;
				if(pokUser[sender].balls>setting.maxball)
					pokUser[sender].balls=setting.maxball;
					resdesc="";
			}
			else if(itemname[j]=="일반알")
			{
				res="포켓몬의 알";
				pokInv[sender].item.push("일반알");
				resdesc=cmds.egg+" 명령어로 알을 부화시키세요.";
			}
			else if(itemname[j]=="전설알")
			{
				res="<⭐전설⭐>포켓몬의 알";
				pokInv[sender].item.push("전설알");
				resdesc=cmds.legendegg+" 명령어로 알을 부화시키세요.";
			}
			else if(itemname[j]=="마제스티의키")
			{
				res="👑마제스티의 키";
				var money=setting.luckygold*10;
					if(Number(pokUser[sender].activecollection.includes(19)))
						money=money*(pokUser[sender].collectionlev*10+100)/100;
					pokUser[sender].gold=pokUser[sender].gold+money;
					var moneyprint="";
					if(money>100000000)
					{
						moneyprint=moneyprint+Math.floor(money/100000000)+"억 ";
						if((money%100000000)!=0)
							moneyprint=moneyprint+Math.floor((money%100000000)/10000)+"만 ";
					}
					else
						moneyprint=moneyprint+Math.floor((money%100000000)/10000)+"만 ";
					resdesc=moneyprint+"원 획득.";
			}
			else if(!isNaN(Number(itemname[j]))){
				var money=0;
				
				money=Number(itemname[j]);
				res=money.comma()+"원";
				pokUser[sender].gold=Number(pokUser[sender].gold+Number(money));
				resdesc="";
			}
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
            replier.reply("@"+sender+"\n보유금액: "+(pokUser[sender].gold).comma()+"원\n\n제비뽑기에서 "+res+"(을)를 획득했습니다.\n"+resdesc);
            return;
         }
         else{
            a=b;
            b=b+itemrate[j+1];
         }
      }
   }

   
   
if(msg.split(" ")[0]==cmds.lock)//덱 장착
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].box.length+1)&&msg.indexOf(".")==(-1))
	{
	if(pokInv[sender].deck.length<6){
	var n=msg.split(" ")[1];
	let p;
	p=pokInv[sender].box[n-1];
	var ismegaexists=0;
	for(var i=0;i<pokInv[sender].deck.length;i++)
	{
		if(megaafternames.includes(pokInv[sender].deck[i].name))
			ismegaexists=1;
	}
	if(ismegaexists==1&&megaafternames.includes(p.name))
	{
		replier.reply("@"+sender+"\n이미 덱에 메가진화한 포켓몬이 있어요.\n메가진화는 덱에 1마리만 장착 가능해요.");
		return;
	}
	pokInv[sender].box.splice((n-1),1);
	pokInv[sender].deck.push(p);
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	replier.reply("@"+sender+"\nLv."+p.level+" "+p.name+"(을)를 덱으로 이동했어요!");
	}else replier.reply("@"+sender+"\n배틀용 덱은 6마리까지만 장착할 수 있어요.");
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
}

if(msg.split(" ")[0]==cmds.unlock)//박스로 이동
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].deck.length+1)&&msg.indexOf(".")==(-1))
	{
		
	var n=msg.split(" ")[1];
	let p;
	p=pokInv[sender].deck[n-1];
	pokInv[sender].deck.splice((n-1),1);
	pokInv[sender].box.push(p);
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	replier.reply("@"+sender+"\nLv."+p.level+" "+p.name+"(을)를 보관함으로 이동했어요!");
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
}

if(msg.split(" ")[0]==cmds.skillchange)//스킬뽑기
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].deck.length<1)
		replier.reply("@"+sender+"\n스킬 뽑기는 덱에 장착된 포켓몬만 가능해요.\n먼저 포켓몬을 덱에 장착해 주세요.");
	else
	{
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].deck.length+1)&&msg.indexOf(".")==(-1))
	{
	var n=msg.split(" ")[1];
	let p;
	p=pokInv[sender].deck[n-1];
	var skillcosts=[100000,1000000,10000000,50000000,0];
	var cost=Math.ceil(skillcosts[p.skillslocked.length]*(100-pokUser[sender].upgradedc)/100);
	if(pokUser[sender].gold<cost)
		replier.reply("@"+sender+"\n돈이 부족해요.\n\nLv."+p.level+" "+p.name+"의 스킬 뽑기 비용: "+cost.comma()+"\n("+p.skillslocked.length+"개 스킬 잠금)");
	else{
	var skillsarr=read("포켓몬/"+p.name,"skills");
	if(p.formchange!=0)
		skillsarr=read("포켓몬/"+p.name+"_"+p.formchange,"skills");
	if(skillsarr.length<5||p.skillslocked.length>3) replier.reply("@"+sender+"\n해당 포켓몬은 바꿀 스킬이 없어요.");
	else
	{
	var caughtpokskills=[];
	p.skills=caughtpokskills;
	while(caughtpokskills.length<(4-p.skillslocked.length))
	{
		var t=skillsarr[Math.floor(Math.random()*skillsarr.length)];
		t=t.replace("DP","").replace("Pt","");
		if(caughtpokskills.indexOf(t)==(-1)&&p.skillslocked.indexOf(t)==(-1))
			caughtpokskills.push(t);
	}
	p.skills=caughtpokskills;
	pokInv[sender].deck[n-1]=p;
	pokUser[sender].gold=pokUser[sender].gold-cost;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
	replier.reply("@"+sender+"\n"+cost.comma()+"원 지불.\n보유금액: "+(pokUser[sender].gold).comma()+"원\n\nLv."+pokInv[sender].deck[n-1].level+" "+pokInv[sender].deck[n-1].name+"의 기술\n\n"+printskills(pokInv[sender].deck[n-1].skills,pokInv[sender].deck[n-1].skillslocked));
	}
	}
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
	}
}
//
if(msg.split(" ")[0]==cmds.levelup)//레벨업
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	pokCol[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json'));
	if(pokCol[sender]==null){
        let dogam={'관동지방':[],'성도지방':[],'호연지방':[],'신오지방':[],'하나지방':[],'칼로스지방':[],'알로라지방':[],'전설/환상':[],'울트라비스트':[],'???':[]}
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json', JSON.stringify(dogam));
		pokCol[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json'));
    }
	if(pokInv[sender].deck.length<1)
		replier.reply("@"+sender+"\n레벨업은 덱에 장착된 포켓몬만 가능해요.\n먼저 포켓몬을 덱에 장착해 주세요.");
	else
	{
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].deck.length+1)&&msg.indexOf(".")==(-1))
	{
	var n=msg.split(" ")[1];
	var n2=Number(msg.split(" ")[2]);
	if(n2>0){
		
	}
	else n2=1;
	if(n2<1||n2>(setting.maxlevel-1))
	{
		replier.reply('@'+sender+'\n다중 레벨업은 1~'+(setting.maxlevel-1)+'사이 숫자로만 입력해 주세요.');
        return;
	}
	let p;
	p=pokInv[sender].deck[n-1];
	var skillcosts=0;
	var totalcosts=0;
	for(var j=0;j<n2;j++)
	{
		skillcosts=10*(p.level+j)*(p.level+j)*(p.level+j);
		if(pokArr.group5.includes(p.name)) skillcosts=skillcosts*2;
		if((p.level+j)>150) skillcosts=skillcosts*2;
		else if(p.level>100) skillcosts=skillcosts*1.5;
		if(Number(pokUser[sender].activecollection.includes(18)))
			skillcosts=Math.ceil(skillcosts*(100-pokUser[sender].upgradedc-pokUser[sender].collectionlev*5)/100);
		else
			skillcosts=Math.ceil(skillcosts*(100-pokUser[sender].upgradedc)/100);
		if((p.level+j)>200) skillcosts=skillcosts*5;
		totalcosts=totalcosts+skillcosts;
	}
	if(pokUser[sender].gold<totalcosts)
	{
		if(n2<2)
			replier.reply("@"+sender+"\n돈이 부족해요.\n\nLV."+p.level+" "+p.name+"의 다음 레벨업 비용: "+totalcosts.comma()+"원");
		else
			replier.reply("@"+sender+"\n돈이 부족해요.\n\nLV."+p.level+" "+p.name+"의 Lv."+(p.level+n2)+"까지의 레벨업 비용: "+totalcosts.comma()+"원");
	}
	else{
	if(p.level>(setting.maxlevel-1)) replier.reply("@"+sender+"\n해당 포켓몬은 이미 최대 레벨이에요.");
	else if((Number(p.level)+Number(n2))>setting.maxlevel) replier.reply("@"+sender+"\n최대 레벨을 초과하여 강화할 수 없어요.\n\nLV."+p.level+" "+p.name+"의 최대 레벨까지 남은 레벨업: "+(setting.maxlevel-p.level)+"회");
	else
	{
	p.level=Number(p.level)+Number(n2);
	if(p.level>(read("포켓몬/"+p.name,"nextlv")-1)&&read("포켓몬/"+p.name,"nextup")!="x")
	{
		var preup=p.name;
		var up=read("포켓몬/"+p.name,"nextup");
		if(up.includes("/"))
			p.name=up.split("/")[Math.floor(Math.random()*up.split("/").length)];
		else p.name=up;
		replier.reply("@"+sender+"\n축하합니다!\n"+preup+"은(는) Lv."+p.level+"을 달성하여 "+p.name+"(으)로 진화하였습니다!");
		for(var i of collectionnames){
			if(collectioncontents[collectionnames.indexOf(i)].includes(p.name))
			{
				if(pokCol[sender][i].indexOf(p.name)==(-1))
				{
					pokCol[sender][i].push(p.name)
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json', JSON.stringify(pokCol[sender]));
					replier.reply("@"+sender+"\n도감의 ["+i+"] 에 새로운 포켓몬이 등록되었습니다.");
					updatecollection(replier,sender);
					break;
				}
			}
		}
		
		
	}
	if(p.formchange!=0){
	p.hp=Math.ceil(read("포켓몬/"+p.name+"_"+p.formchange,"hp")*p.level/50);
	p.atk=Math.ceil(read("포켓몬/"+p.name+"_"+p.formchange,"atk")*p.level/50);
	p.def=Math.ceil(read("포켓몬/"+p.name+"_"+p.formchange,"def")*p.level/50);
	p.spd=Math.ceil(read("포켓몬/"+p.name+"_"+p.formchange,"spd")*p.level/50);
	}
	else
	{
	p.hp=Math.ceil(read("포켓몬/"+p.name,"hp")*p.level/50);
	p.atk=Math.ceil(read("포켓몬/"+p.name,"atk")*p.level/50);
	p.def=Math.ceil(read("포켓몬/"+p.name,"def")*p.level/50);
	p.spd=Math.ceil(read("포켓몬/"+p.name,"spd")*p.level/50);
	}
	
	pokInv[sender].deck[n-1]=p;
	pokUser[sender].gold=pokUser[sender].gold-totalcosts;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
	var showstats="\n최대 HP: "+pokInv[sender].deck[n-1].hp+"\n공격력: "+pokInv[sender].deck[n-1].atk+"\n방어력: "+pokInv[sender].deck[n-1].def+"\n스피드: "+pokInv[sender].deck[n-1].spd;
	replier.reply("@"+sender+"\n"+totalcosts.comma()+"원 지불.\n보유금액: "+(pokUser[sender].gold).comma()+"원\n\nLv."+(pokInv[sender].deck[n-1].level-n2)+" > Lv."+pokInv[sender].deck[n-1].level+" "+pokInv[sender].deck[n-1].name+"\n\n"+"\u200b".repeat(500)+showstats);
	}
	}
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
	}
}
//
if(msg.split(" ")[0]==cmds.boxlevelup)//박스레벨업
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	pokCol[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json'));
	if(pokCol[sender]==null){
        let dogam={'관동지방':[],'성도지방':[],'호연지방':[],'신오지방':[],'하나지방':[],'칼로스지방':[],'알로라지방':[],'전설/환상':[],'울트라비스트':[],'???':[]}
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json', JSON.stringify(dogam));
		pokCol[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json'));
    }
	if(pokInv[sender].box.length<1)
		replier.reply("@"+sender+"\n박스에 포켓몬이 없어요.");
	else
	{
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].box.length+1)&&msg.indexOf(".")==(-1))
	{
	var n=msg.split(" ")[1];
	var n2=Number(msg.split(" ")[2]);
	if(n2>0){
		
	}
	else n2=1;
	if(n2<1||n2>(setting.maxlevel-1))
	{
		replier.reply('@'+sender+'\n다중 레벨업은 1~'+(setting.maxlevel-1)+'사이 숫자로만 입력해 주세요.');
        return;
	}
	let p;
	p=pokInv[sender].box[n-1];
	var skillcosts=0;
	var totalcosts=0;
	for(var j=0;j<n2;j++)
	{
		skillcosts=10*(p.level+j)*(p.level+j)*(p.level+j);
		if(pokArr.group5.includes(p.name)) skillcosts=skillcosts*2;
		if((p.level+j)>150) skillcosts=skillcosts*2;
		else if(p.level>100) skillcosts=skillcosts*1.5;
		if(Number(pokUser[sender].activecollection.includes(18)))
			skillcosts=Math.ceil(skillcosts*(100-pokUser[sender].upgradedc-pokUser[sender].collectionlev*5)/100);
		else
			skillcosts=Math.ceil(skillcosts*(100-pokUser[sender].upgradedc)/100);
		if((p.level+j)>200) skillcosts=skillcosts*5;
		totalcosts=totalcosts+skillcosts;
	}
	if(pokUser[sender].gold<totalcosts)
	{
		if(n2<2)
			replier.reply("@"+sender+"\n돈이 부족해요.\n\nLV."+p.level+" "+p.name+"의 다음 레벨업 비용: "+totalcosts.comma()+"원");
		else
			replier.reply("@"+sender+"\n돈이 부족해요.\n\nLV."+p.level+" "+p.name+"의 Lv."+(p.level+n2)+"까지의 레벨업 비용: "+totalcosts.comma()+"원");
	}
	else{
	if(p.level>(setting.maxlevel-1)) replier.reply("@"+sender+"\n해당 포켓몬은 이미 최대 레벨이에요.");
	else if((Number(p.level)+Number(n2))>setting.maxlevel) replier.reply("@"+sender+"\n최대 레벨을 초과하여 강화할 수 없어요.\n\nLV."+p.level+" "+p.name+"의 최대 레벨까지 남은 레벨업: "+(setting.maxlevel-p.level)+"회");
	else
	{
	p.level=Number(p.level)+Number(n2);
	if(p.level>(read("포켓몬/"+p.name,"nextlv")-1)&&read("포켓몬/"+p.name,"nextup")!="x")
	{
		var preup=p.name;
		var up=read("포켓몬/"+p.name,"nextup");
		if(up.includes("/"))
			p.name=up.split("/")[Math.floor(Math.random()*up.split("/").length)];
		else p.name=up;
		replier.reply("@"+sender+"\n축하합니다!\n"+preup+"은(는) Lv."+p.level+"을 달성하여 "+p.name+"(으)로 진화하였습니다!");
		for(var i of collectionnames){
			if(collectioncontents[collectionnames.indexOf(i)].includes(p.name))
			{
				if(pokCol[sender][i].indexOf(p.name)==(-1))
				{
					pokCol[sender][i].push(p.name)
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json', JSON.stringify(pokCol[sender]));
					replier.reply("@"+sender+"\n도감의 ["+i+"] 에 새로운 포켓몬이 등록되었습니다.");
					updatecollection(replier,sender);
					break;
				}
			}
		}
		
		
	}
	if(p.formchange!=0){
	p.hp=Math.ceil(read("포켓몬/"+p.name+"_"+p.formchange,"hp")*p.level/50);
	p.atk=Math.ceil(read("포켓몬/"+p.name+"_"+p.formchange,"atk")*p.level/50);
	p.def=Math.ceil(read("포켓몬/"+p.name+"_"+p.formchange,"def")*p.level/50);
	p.spd=Math.ceil(read("포켓몬/"+p.name+"_"+p.formchange,"spd")*p.level/50);
	}
	else
	{
	p.hp=Math.ceil(read("포켓몬/"+p.name,"hp")*p.level/50);
	p.atk=Math.ceil(read("포켓몬/"+p.name,"atk")*p.level/50);
	p.def=Math.ceil(read("포켓몬/"+p.name,"def")*p.level/50);
	p.spd=Math.ceil(read("포켓몬/"+p.name,"spd")*p.level/50);
	}
	
	pokInv[sender].box[n-1]=p;
	pokUser[sender].gold=pokUser[sender].gold-totalcosts;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
	var showstats="\n최대 HP: "+pokInv[sender].box[n-1].hp+"\n공격력: "+pokInv[sender].box[n-1].atk+"\n방어력: "+pokInv[sender].box[n-1].def+"\n스피드: "+pokInv[sender].box[n-1].spd;
	replier.reply("@"+sender+"\n"+totalcosts.comma()+"원 지불.\n보유금액: "+(pokUser[sender].gold).comma()+"원\n\nLv."+(pokInv[sender].box[n-1].level-n2)+" > Lv."+pokInv[sender].box[n-1].level+" "+pokInv[sender].box[n-1].name+"\n\n"+"\u200b".repeat(500)+showstats);
	}
	}
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
	}
}

if(msg.split(" ")[0]==cmds.formchange)//폼체인지
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].deck.length<1)
		replier.reply("@"+sender+"\n폼체인지는 덱에 장착된 포켓몬만 가능해요.\n먼저 포켓몬을 덱에 장착해 주세요.");
	else
	{
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].deck.length+1)&&msg.indexOf(".")==(-1))
	{
	var n=msg.split(" ")[1];
	let p;
	p=pokInv[sender].deck[n-1];
	if(formchangenames.indexOf(p.name)==(-1))
	{
		replier.reply("@"+sender+"\n폼체인지를 할 수 없는 포켓몬이에요.\n\n폼체인지 가능한 포켓몬: "+formchangenames.join(","));
		return;
	}
	var skillcosts=10000000;
	skillcosts=Math.ceil(skillcosts*(100-pokUser[sender].upgradedc)/100);
	if(pokUser[sender].gold<skillcosts)
	{
		replier.reply("@"+sender+"\n돈이 부족해요.\n\nLV."+p.level+" "+p.name+"의 폼체인지 비용: "+skillcosts.comma()+"원");
	}
	else{
	var oldname=formchangestatus[p.name][p.formchange];
	if(p.name=="큐레무")
	{
		if(pokCol[sender]["전설/환상"].includes("제크로무")&&pokCol[sender]["전설/환상"].includes("레시라무")){
			
		}
		else
		{
			replier.reply("큐레무의 폼체인지는 제크로무, 레시라무가 모두 도감에 등록되어 있어야 가능합니다.");
			return;
		}
	}
	if(p.name=="네크로즈마")
	{
		if(pokCol[sender]["전설/환상"].includes("솔가레오")&&pokCol[sender]["전설/환상"].includes("루나아라")){
			
		}
		else
		{
			replier.reply("네크로즈마의 폼체인지는 솔가레오, 루나아라가 모두 도감에 등록되어 있어야 가능합니다.");
			return;
		}
	}
	var newform=0;
	do{
		newform=Math.floor(Math.random()*formchangestatus[p.name].length);
	}while(newform==p.formchange);
	p.formchange=newform;
	if(p.formchange!=0){
	p.hp=Math.ceil(read("포켓몬/"+p.name+"_"+p.formchange,"hp")*p.level/50);
	p.atk=Math.ceil(read("포켓몬/"+p.name+"_"+p.formchange,"atk")*p.level/50);
	p.def=Math.ceil(read("포켓몬/"+p.name+"_"+p.formchange,"def")*p.level/50);
	p.spd=Math.ceil(read("포켓몬/"+p.name+"_"+p.formchange,"spd")*p.level/50);
	}
	else
	{
	p.hp=Math.ceil(read("포켓몬/"+p.name,"hp")*p.level/50);
	p.atk=Math.ceil(read("포켓몬/"+p.name,"atk")*p.level/50);
	p.def=Math.ceil(read("포켓몬/"+p.name,"def")*p.level/50);
	p.spd=Math.ceil(read("포켓몬/"+p.name,"spd")*p.level/50);
	}
	
	pokInv[sender].deck[n-1]=p;
	pokUser[sender].gold=pokUser[sender].gold-skillcosts;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
	var showstats="\n최대 HP: "+pokInv[sender].deck[n-1].hp+"\n공격력: "+pokInv[sender].deck[n-1].atk+"\n방어력: "+pokInv[sender].deck[n-1].def+"\n스피드: "+pokInv[sender].deck[n-1].spd;
	replier.reply("@"+sender+"\n"+skillcosts.comma()+"원 지불.\n보유금액: "+(pokUser[sender].gold).comma()+"원\n\nLv."+pokInv[sender].deck[n-1].level+pokInv[sender].deck[n-1].name+"("+oldname+") > Lv."+pokInv[sender].deck[n-1].level+" "+pokInv[sender].deck[n-1].name+"("+formchangestatus[p.name][p.formchange]+")\n\n"+"\u200b".repeat(500)+showstats);
	
	}
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
	}
}

if(msg.split(" ")[0]==cmds.mega)//메가진화
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].deck.length<1)
		replier.reply("@"+sender+"\n메가진화는 덱에 장착된 포켓몬만 가능해요.\n먼저 포켓몬을 덱에 장착해 주세요.");
	else
	{
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].deck.length+1)&&msg.indexOf(".")==(-1))
	{
	var n=msg.split(" ")[1];
	let p;
	p=pokInv[sender].deck[n-1];
	if(meganames.indexOf(p.name)==(-1))
	{
		replier.reply("@"+sender+"\n메가진화를 할 수 없는 포켓몬이에요.\n\n메가진화 가능한 포켓몬: "+meganames.join(", "));
		return;
	}
	if(p.name=="네크로즈마"&&p.formchange==0)
	{
		replier.reply("@"+sender+"\n네크로즈마의 메가진화는 폼체인지 상태에서만 가능해요.");
		return;
	}
	var ismegaexists=0;
	for(var i=0;i<pokInv[sender].deck.length;i++)
	{
		if(megaafternames.includes(pokInv[sender].deck[i].name))
			ismegaexists=1;
	}
	if(ismegaexists==1)
	{
		replier.reply("@"+sender+"\n이미 덱에 메가진화한 포켓몬이 있어요.\n메가진화는 덱에 1마리만 장착 가능해요.");
		return;
	}
	if(p.level<200)
	{
		replier.reply("@"+sender+"\n메가진화는 레벨 200 이상부터 가능해요.");
		return;
	}
	var skillcosts=2000000000;
	if(pokUser[sender].gold<skillcosts)
	{
		replier.reply("@"+sender+"\n돈이 부족해요.\n\nLV."+p.level+" "+p.name+"의 메가진화 비용: "+skillcosts.comma()+"원");
	}
	else{
	var oldname=p.name;
	if(p.name=="리자몽"||p.name=="뮤츠")
	{
		var newname="메가"+p.name;
		if(Math.floor(Math.random()*2)==1)
			newname=newname+"X";
		else
			newname=newname+"Y";
		p.name=newname;
	}
	else if(p.name=="그란돈"||p.name=="가이오가")
	{
		var newname="원시"+p.name;
		p.name=newname;
	}
	else if(p.name=="네크로즈마")
	{
		var newname="울트라"+p.name;
		p.name=newname;
	}
	else
	{
		var newname="메가"+p.name;
		p.name=newname;
	}
	p.hp=Math.ceil(read("포켓몬/"+p.name,"hp")*p.level/50);
	p.atk=Math.ceil(read("포켓몬/"+p.name,"atk")*p.level/50);
	p.def=Math.ceil(read("포켓몬/"+p.name,"def")*p.level/50);
	p.spd=Math.ceil(read("포켓몬/"+p.name,"spd")*p.level/50);
	p.formchange=0;
	pokInv[sender].deck[n-1]=p;
	pokUser[sender].gold=pokUser[sender].gold-skillcosts;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
	var showstats="\n최대 HP: "+pokInv[sender].deck[n-1].hp+"\n공격력: "+pokInv[sender].deck[n-1].atk+"\n방어력: "+pokInv[sender].deck[n-1].def+"\n스피드: "+pokInv[sender].deck[n-1].spd;
	replier.reply("@"+sender+"\n축하합니다!\n"+oldname+"(은)는 "+pokInv[sender].deck[n-1].name+"(으)로 메가진화했습니다!");
	replier.reply("@"+sender+"\n"+skillcosts.comma()+"원 지불.\n보유금액: "+(pokUser[sender].gold).comma()+"원\n\nLv."+pokInv[sender].deck[n-1].level+" "+oldname+" > Lv."+pokInv[sender].deck[n-1].level+" "+pokInv[sender].deck[n-1].name+"\n\n"+"\u200b".repeat(500)+showstats);
	
	}
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
	}
}

if(msg.split(" ")[0]==cmds.skilllock)//스킬잠금
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].deck.length<1)
		replier.reply("@"+sender+"\n스킬 잠금 및 해제는 덱에 장착된 포켓몬만 가능해요.\n먼저 포켓몬을 덱에 장착해 주세요.");
	else
	{
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].deck.length+1)&&msg.indexOf(".")==(-1))
	{
	if(0<msg.split(" ")[2]&&msg.split(" ")[2]<5){
	var n1=msg.split(" ")[1];
	var n2=msg.split(" ")[2];
	var n="";
	let p;
	p=pokInv[sender].deck[n1-1];
	if(n2<(p.skills.length+1)){
	n=p.skills[n2-1];
	p.skillslocked.push(n);
	p.skills.splice(p.skills.indexOf(n),1);
	pokInv[sender].deck[n1-1]=p;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	replier.reply("@"+sender+"\nLv."+pokInv[sender].deck[n1-1].level+" "+pokInv[sender].deck[n1-1].name+"의 기술\n"+"\u200b".repeat(500)+"\n"+printskills(pokInv[sender].deck[n1-1].skills,pokInv[sender].deck[n1-1].skillslocked));
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
	}
}

if(msg.split(" ")[0]==cmds.skillunlock)//스킬잠금해제
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].deck.length<1)
		replier.reply("@"+sender+"\n스킬 잠금 및 해제는 덱에 장착된 포켓몬만 가능해요.\n먼저 포켓몬을 덱에 장착해 주세요.");
	else
	{
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].deck.length+1)&&msg.indexOf(".")==(-1))
	{
	if(0<msg.split(" ")[2]&&msg.split(" ")[2]<5){
	var n1=msg.split(" ")[1];
	var n2=msg.split(" ")[2];
	var n="";
	let p;
	p=pokInv[sender].deck[n1-1];
	if(n2<(p.skillslocked.length+1)){
	n=p.skillslocked[n2-1];
	p.skills.push(n);
	p.skillslocked.splice(p.skillslocked.indexOf(n),1);
	pokInv[sender].deck[n1-1]=p;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	replier.reply("@"+sender+"\nLv."+pokInv[sender].deck[n1-1].level+" "+pokInv[sender].deck[n1-1].name+"의 기술\n"+"\u200b".repeat(500)+"\n"+printskills(pokInv[sender].deck[n1-1].skills,pokInv[sender].deck[n1-1].skillslocked));
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
	}
}

if(msg.split(" ")[0]==cmds.swap)//순서변경
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].deck.length+1)&&msg.indexOf(".")==(-1)&&0<msg.split(" ")[2]&&msg.split(" ")[2]<(pokInv[sender].deck.length+1)&&msg.split(" ")[1]!=msg.split(" ")[2])
	{
	var n1=msg.split(" ")[1];
	var n2=msg.split(" ")[2];
	let p;
	p=pokInv[sender].deck[n1-1];
	pokInv[sender].deck[n1-1]=pokInv[sender].deck[n2-1];
	pokInv[sender].deck[n2-1]=p;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	replier.reply("@"+sender+"\n"+pokInv[sender].deck[n1-1].name+", "+pokInv[sender].deck[n2-1].name+"의 순서를 변경했어요!");
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
}

if(msg.split(" ")[0]==cmds.pokinfo)//포켓몬 정보 자세히
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].box.length+1)&&msg.indexOf(".")==(-1))
	{
	var n=msg.split(" ")[1];
	let p;
	
	p=pokInv[sender].box[n-1];
	var pokdesc=typetexts[read("포켓몬/"+p.name,"type1")]+" "+typetexts[read("포켓몬/"+p.name,"type2")];
	if(p.formchange>0)
		pokdesc=typetexts[read("포켓몬/"+p.name+"_"+p.formchange,"type1")]+" "+typetexts[read("포켓몬/"+p.name+"_"+p.formchange,"type2")];
	try{
		img=pokimglink(p.name,p.formchange);
		poklink="ko/wiki/"+encodeURIComponent(p.name+"_(포켓몬)");
//  	
		
		
		Kakao.sendLink(room, {
			"link_ver":"4.0",
			"template_id":(58796),
			"template_args":{
			//이곳에 템플릿 정보를 입력하세요.
			'POKIMG':img,
			'POKNAME':"Lv."+p.level+" "+p.name+"  "+pokdesc,
			'DESC':"최대 HP: "+p.hp+" 공격력: "+p.atk+" 방어력: "+p.def+" 스피드: "+p.spd,
			'LINK':poklink
			}
			}, "custom")

	
	//
	}catch(e){
		replier.reply("카카오링크 오류. 리셋 한번 해주세요.\n\nLv."+p.level+" "+p.name+"  "+typetexts[read("포켓몬/"+p.name,"type1")]+" "+typetexts[read("포켓몬/"+p.name,"type2")]+"\n"+"최대 HP: "+p.hp+" 공격력: "+p.atk+" 방어력: "+p.def+" 스피드: "+p.spd);
	}
	if(p.name=="메타몽") replier.reply("보유 기술\n"+"\u200b".repeat(500)+"\n변신 [⚪노말]\n상대 포켓몬으로 변신");
	else replier.reply("보유 기술\n"+"\u200b".repeat(500)+"\n"+printskills(p.skills,p.skillslocked));
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
}

if(msg.split(" ")[0]==cmds.ball)//볼구매
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(setting.maxball+1)&&msg.indexOf(".")==(-1))
	{
	var n=msg.split(" ")[1];
	if((Number(pokUser[sender].balls)+Number(n))>setting.maxball) replier.reply("@"+sender+"\n볼은 50개까지만 소지할 수 있어요.\n현재 보유 갯수: "+pokUser[sender].balls);
	else
	{
		var price=setting.ballPrice[ballArr.indexOf(pokUser[sender].Ball)];
		price=price*n;
		price=Math.ceil(price*(100-pokUser[sender].balldc)/100);
		if(pokUser[sender].gold<price)
			replier.reply("@"+sender+"\n돈이 부족해요.\n구매 필요 가격: "+price.comma()+"원");
		else
		{
			pokUser[sender].gold=pokUser[sender].gold-price;
			pokUser[sender].balls=Number(pokUser[sender].balls)+Number(n);
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
			replier.reply("@"+sender+"\n"+price.comma()+"원으로 볼 "+n+"개를 구매했어요.");
		}
	}
	}else replier.reply("@"+sender+"\n볼은 50개까지만 소지할 수 있어요.\n현재 보유 갯수: "+pokUser[sender].balls);
}

if(msg.split(" ")[0]==cmds.dpokinfo)//포켓몬 정보 자세히(덱)
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].deck.length+1)&&msg.indexOf(".")==(-1))
	{
	var n=msg.split(" ")[1];
	let p;
	p=pokInv[sender].deck[n-1];
	var pokdesc=typetexts[read("포켓몬/"+p.name,"type1")]+" "+typetexts[read("포켓몬/"+p.name,"type2")];
	if(p.formchange>0)
		pokdesc=typetexts[read("포켓몬/"+p.name+"_"+p.formchange,"type1")]+" "+typetexts[read("포켓몬/"+p.name+"_"+p.formchange,"type2")];
	try{
		img=pokimglink(p.name,p.formchange);
		poklink="ko/wiki/"+encodeURIComponent(p.name+"_(포켓몬)");
		//    
		
		Kakao.sendLink(room, {
			"link_ver":"4.0",
			"template_id":(58796),
			"template_args":{
			//이곳에 템플릿 정보를 입력하세요.
			'POKIMG':img,
			'POKNAME':"Lv."+p.level+" "+p.name+"  "+pokdesc,
			'DESC':"최대 HP: "+p.hp+" 공격력: "+p.atk+" 방어력: "+p.def+" 스피드: "+p.spd,
			'LINK':poklink
			}
			}, "custom")
	
	//
	}catch(e){
		replier.reply("카카오링크 오류. 리셋 한번 해주세요.\n\nLv."+p.level+" "+p.name+"  "+typetexts[read("포켓몬/"+p.name,"type1")]+" "+typetexts[read("포켓몬/"+p.name,"type2")]+"\n"+"최대 HP: "+p.hp+" 공격력: "+p.atk+" 방어력: "+p.def+" 스피드: "+p.spd);
	}
	if(p.name=="메타몽") replier.reply("보유 기술\n"+"\u200b".repeat(500)+"\n변신 [⚪노말]\n상대 포켓몬으로 변신");
	else replier.reply("보유 기술\n"+"\u200b".repeat(500)+"\n"+printskills(p.skills,p.skillslocked));
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
}

if(msg.startsWith(cmds.info))//트레이너정보
{
	var name=msg.substr(cmds.info.length);
	if(name.slice(-2)==("  ")) name.slice(0,-2);
	else if(name.slice(-1)==(" ")) name.slice(0,-1);
	if(name==""||name==undefined) name=sender;
	else name=name.substr(1);
	
	pokUser[name]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+name+'.json'));
	if(pokUser[name]==null){
        replier.reply('@'+name+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[name]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+name+'_inv.json'));
	var str="";
	if(pokInv[name].deck.length<1) str="\n현재 장착 중인 덱이 없습니다.\n";
	else{
		for(var i=0;i<pokInv[name].deck.length;i++)
			str=str+(i+1)+".  Lv."+pokInv[name].deck[i].level+" "+pokInv[name].deck[i].name+"\n";
		if(pokInv[name].deck.length<6)
		{
			for(var i=0;i<(6-pokInv[name].deck.length);i++)
				str=str+(pokInv[name].deck.length+(i+1))+".  (비어 있음)\n";
		}
	}
	var winrate=Math.ceil(Number(pokUser[name].battlecount.win)*100/(Number(pokUser[name].battlecount.win)+Number(pokUser[name].battlecount.lose)));
	if(isNaN(winrate)) winrate=0;
	replier.reply(["["+pokUser[name].rank+"] "+name+"님의 정보",
	"\u200b".repeat(500),
	"\n",
	"현재 체력: "+pokUser[name].hp+"/"+pokUser[name].maxHp,
	"보유금액: "+pokUser[name].gold.comma()+"원",
	"볼: "+pokUser[name].Ball,
	"볼 1개당 가격: "+Math.ceil(setting.ballPrice[ballArr.indexOf(pokUser[name].Ball)]*(100-pokUser[name].balldc)/100).comma()+"원("+pokUser[name].balldc+"% 할인)",
	"야생 포켓몬 레벨: "+(setting.minlevel+(ballArr.indexOf(pokUser[name].Ball)+1)*setting.balluplev+1)+"~"+(setting.minlevel+(ballArr.indexOf(pokUser[name].Ball)+1)*setting.balluplev+10),
	"현재 볼 갯수: "+pokUser[name].balls,
	"\n",
	"현재 장착 중인 덱",
	"ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ",
	str,
	"ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ",
	"\n",
	"포켓몬 조우 횟수: "+pokUser[name].count.total,
	"포획 성공: "+pokUser[name].count.succ,
	"포획 실패: "+pokUser[name].count.fail,
	"포획 성공률: "+Math.ceil(Number(pokUser[name].count.succ)*100/(Number(pokUser[name].count.succ)+Number(pokUser[name].count.fail)))+"%",
	"\n",
	"리본: "+pokUser[name].ribbon,
	"획득한 뱃지 개수: "+pokUser[name].badge+"개",
	"배틀 횟수: "+pokUser[name].battlecount.total,
	"배틀 승리: "+pokUser[name].battlecount.win,
	"배틀 패배: "+pokUser[name].battlecount.lose,
	"배틀 승률: "+winrate+"%",
	"\n",
	"탐험 성공률: "+pokUser[name].success+"%(+"+(pokUser[name].success-setting.success)+"%)",
	"휴식 소요시간: "+Number(pokUser[name].rest)/1000+"초마다 체력 1 회복",
	"탐험 소요시간: "+Math.ceil(setting.castT.min*(100-pokUser[name].castT)/100)+"~"+Math.ceil(setting.castT.max*(100-pokUser[name].castT)/100)+"초 ("+pokUser[name].castT+"% 단축)",
	"\n",
	"포켓몬 레벨업/스킬뽑기 할인: "+pokUser[name].upgradedc+"%",
	"\n",
	"울트라비스트 출현률: "+pokUser[name].stat.g5+"%(+"+(pokUser[name].stat.g5-setting.p.g5).toFixed(1)+"%)",
	"전설의 포켓몬 출현률: "+pokUser[name].stat.g4+"%(+"+(pokUser[name].stat.g4-setting.p.g4).toFixed(1)+"%)",
	"레어 포켓몬 출현률: "+pokUser[name].stat.g3+"%(+"+(pokUser[name].stat.g3-setting.p.g3).toFixed(1)+"%)",
	"고급 포켓몬 출현률: "+pokUser[name].stat.g2+"%(+"+(pokUser[name].stat.g2-setting.p.g2).toFixed(1)+"%)",
	"일반 포켓몬 출현률: "+pokUser[name].stat.g1+"%(+"+(pokUser[name].stat.g1-setting.p.g1).toFixed(1)+"%)",
	"\n",
	"포켓몬 그룹별 포획률",
	"울트라비스트: "+pokUser[name].successcatch.g5+"%(+"+(pokUser[name].successcatch.g5-setting.catchsuccess[0]).toFixed(1)+"%)",
	"전설: "+pokUser[name].successcatch.g4+"%(+"+(pokUser[name].successcatch.g4-setting.catchsuccess[1]).toFixed(1)+"%)",
	"레어: "+pokUser[name].successcatch.g3+"%(+"+(pokUser[name].successcatch.g3-setting.catchsuccess[2]).toFixed(1)+"%)",
	"고급: "+pokUser[name].successcatch.g2+"%(+"+(pokUser[name].successcatch.g2-setting.catchsuccess[3]).toFixed(1)+"%)",
	"일반: "+pokUser[name].successcatch.g1+"%(+"+(pokUser[name].successcatch.g1-setting.catchsuccess[4]).toFixed(1)+"%)"].join("\n"));
}

if(msg==cmds.mycollection)//내 컬렉션
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	pokCol[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json'));
	if(pokCol[sender]==null){
        let dogam={'관동지방':[],'성도지방':[],'호연지방':[],'신오지방':[],'하나지방':[],'칼로스지방':[],'알로라지방':[],'전설/환상':[],'울트라비스트':[],'???':[]}
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json', JSON.stringify(dogam));
		pokCol[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json'));
    }
	var res="";
	for(var ii of collectionnames){
		if(ii!='???')
			res=res+"["+ii+"] "+pokCol[sender][ii].length+"/"+collectioncontents[collectionnames.indexOf(ii)].length+"\n";
		else
			res=res+"[???] "+pokCol[sender][ii].length+"/???\n";
	}
	res=res+"\n"
	if(pokUser[sender].activecollection.length>0){
		res=res+"---현재 적용중인 컬렉션 효과---\n";
		for(var i=0;i<pokUser[sender].activecollection.length;i++)
		{
			if(Number(pokUser[sender].activecollection[i])>0&&Number(pokUser[sender].activecollection[i])<8)
				res=res+"배틀 중 아군의 데미지 "+pokUser[sender].collectionlev*2+"% 증가\n";
			else if(Number(pokUser[sender].activecollection[i])==8)
				res=res+"배틀 중 아군의 스피드 "+pokUser[sender].collectionlev*5+" 증가\n";
			else if(Number(pokUser[sender].activecollection[i])==9)
				res=res+"배틀 중 상대방 명중률 "+pokUser[sender].collectionlev*3+"% 감소\n(렙차 패널티와 합해서 50%를 넘을 수 없음)\n";
			else if(Number(pokUser[sender].activecollection[i])==10)
				res=res+"PVP 배틀 상금 X"+(pokUser[sender].collectionlev+1)+" 배\n";
			else if(Number(pokUser[sender].activecollection[i])==11)
				res=res+"배틀 중 아군의 방어력 "+pokUser[sender].collectionlev*30+" 증가\n";
			else if(Number(pokUser[sender].activecollection[i])==12)
				res=res+"배틀 중 상대의 효과가 굉장한 공격의 데미지 "+pokUser[sender].collectionlev*5+"% 감소\n";
			else if(Number(pokUser[sender].activecollection[i])==13)
				res=res+"제비뽑기 좋은 보상 획득 확률 "+pokUser[sender].collectionlev+"% 증가\n";
			else if(Number(pokUser[sender].activecollection[i])==14)
				res=res+"배틀에서 아군이 쓰러질 공격을 받을 시 "+pokUser[sender].collectionlev*4+"% 확률로 체력 1을 남기고 생존\n";
			else if(Number(pokUser[sender].activecollection[i])==15)
				res=res+"제비뽑기 리로드 1회당 횟수 제한 "+pokUser[sender].collectionlev+"회 증가\n";
			else if(Number(pokUser[sender].activecollection[i])==16)
				res=res+"탐험 중 돈 발견 시 획득량 X"+(pokUser[sender].collectionlev+1)+" 배\n";
			else if(Number(pokUser[sender].activecollection[i])==17)
				res=res+"추가 포획률 "+pokUser[sender].collectionlev+"% 증가\n";
			else if(Number(pokUser[sender].activecollection[i])==18)
				res=res+"포켓몬 레벨업 비용 "+pokUser[sender].collectionlev*5+"% 감소\n";
			else if(Number(pokUser[sender].activecollection[i])==19)
				res=res+"모든 돈 획득량 +"+pokUser[sender].collectionlev*10+"% 증가\n";
			else if(Number(pokUser[sender].activecollection[i])==20)
				res=res+"울트라비스트 출현율 "+pokUser[sender].collectionlev+"% 증가\n";
		}
		res=res+"\n";
	}
	res=res+"---현재 컬렉션 등록 포켓몬 현황---\n";
	for(var ii of collectionnames){
		res=res+"["+ii+"]\n"+pokCol[sender][ii].join(", ")+"\n\n";
	}
	replier.reply("["+sender+"] 님의 현재 컬렉션\n"+"\u200b".repeat(500)+"\n"+res);
}

if(msg==cmds.rest)//휴식
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	if(advOn[sender]==undefined) advOn[sender]=0;
	if(advOn[sender]!=0)
	{
		replier.reply('@'+sender+'\n탐험 및 배틀 중엔 휴식을 할 수가 없어요.');
		return;
	}
	if(pokUser[sender].hp>=pokUser[sender].maxHp)
	{
		replier.reply('@'+sender+'\n체력이 최대에요.');
		return;
	}
	if(pokUser[sender].restOn.on){ //휴식종료
		let t=Number(Date.now());
        t=Math.ceil(Number((t-Number(pokUser[sender].restOn.time))/Number(pokUser[sender].rest)));
		pokUser[sender].hp=pokUser[sender].hp+t;
		if(pokUser[sender].hp>pokUser[sender].maxHp) pokUser[sender].hp=pokUser[sender].maxHp;
		pokUser[sender].restOn.on=0;
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
		replier.reply('@'+sender+'\n휴식을 종료했어요.\n현재 체력: '+pokUser[sender].hp+"/"+pokUser[sender].maxHp);
	}
	else{ //휴식시작
		pokUser[sender].restOn.time=Number(Date.now());
		pokUser[sender].restOn.on=1;
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
		replier.reply('@'+sender+'\n휴식을 시작했어요.\n"'+cmds.rest+'"을 다시 사용하면 휴식을 종료할 수 있어요.');
	}
}

if(msg==cmds.egg)//알 부화(아이템)
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].item.includes("일반알"))
	{
		pokInv[sender].item.splice(pokInv[sender].item.indexOf("일반알"),1);
		var rann=Math.floor(Math.random()*100);
		let pokname="";
		var islegend=0;
		if(rann==1)
		{
			pokname=pokArr.groupunknown[Math.floor(Math.random()*pokArr.groupunknown.length)];
			islegend=3;
		}
		else if(rann<4)
		{
			pokname=pokArr.group5[Math.floor(Math.random()*pokArr.group5.length)];
			islegend=2;
		}
		else if(rann>3&&rann<22)
		{
			pokname=pokArr.group4[Math.floor(Math.random()*pokArr.group4.length)];
			islegend=1;
		}
		else
		{
			pokname=pokArr.group3[Math.floor(Math.random()*pokArr.group3.length)];
		}
			var skillsarr=read("포켓몬/"+pokname,"skills");
			var caughtpokskills=[];
			var poklev=0;
			poklev=((ballArr.indexOf(pokUser[sender].Ball)+1)*setting.balluplev)+10;
			if(skillsarr.length<5)
				caughtpokskills=skillsarr;
			else
			{
				while(caughtpokskills.length<4)
				{
					var t=skillsarr[Math.floor(Math.random()*skillsarr.length)];
					t=t.replace("DP","").replace("Pt","");
					if(caughtpokskills.indexOf(t)==(-1))
						caughtpokskills.push(t);
				}
			}
			
			var caughtpokhp=read("포켓몬/"+pokname,"hp");
			
			let caughtpok={
				'name':pokname,
				'level':poklev,
				'hp': Math.ceil(caughtpokhp*poklev/50),
				'atk': Math.ceil(read("포켓몬/"+pokname,"atk")*poklev/50),
				'def': Math.ceil(read("포켓몬/"+pokname,"def")*poklev/50),
				'spd': Math.ceil(read("포켓몬/"+pokname,"spd")*poklev/50),
				'skills':caughtpokskills, //위 4개는 json read
				'skillslocked':[],
				'formchange':0,
				'islocked':0
			};
			pokInv[sender].box.push(caughtpok);
			let lt=pokname.length-1;
			if(islegend==1)
				replier.reply("@"+sender+"\n축하합니다!\n 알에서 <⭐전설⭐> Lv."+poklev+" "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '을' : '를')+" 획득했습니다!");
			else if(islegend==2)
				replier.reply("@"+sender+"\n축하합니다!\n 알에서 <🦄울트라비스트🦄> Lv."+poklev+" "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '을' : '를')+" 획득했습니다!");
			else if(islegend==3)
				replier.reply("@"+sender+"\n축하합니다!\n 알에서 <???> Lv."+poklev+" "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '을' : '를')+" 획득했습니다!");
			else
				replier.reply("@"+sender+"\n축하합니다!\n 알에서 [레어] Lv."+poklev+" "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '을' : '를')+" 획득했습니다!");
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
			replier.reply("@"+sender+"\n획득한 포켓몬을 저장했습니다.");
			for(var ii of collectionnames){
				if(collectioncontents[collectionnames.indexOf(ii)].includes(pokname))
				{
					if(pokCol[sender][ii].indexOf(pokname)==(-1))
					{
						pokCol[sender][ii].push(pokname)
						FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json', JSON.stringify(pokCol[sender]));
						replier.reply("@"+sender+"\n도감의 ["+ii+"] 에 새로운 포켓몬이 등록되었습니다.");
						updatecollection(replier,sender);
						break;
					}
				}
			}
	}
}

if(msg==cmds.legendegg)//전설알(아이템)
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].item.includes("전설알"))
	{
		pokInv[sender].item.splice(pokInv[sender].item.indexOf("전설알"),1);
		var rann=Math.floor(Math.random()*100);
		let pokname="";
		var islegend=0;
		if(rann==1)
		{
			pokname=pokArr.groupunknown[Math.floor(Math.random()*pokArr.groupunknown.length)];
			islegend=2;
		}
		else if(rann<4)
		{
			pokname=pokArr.group5[Math.floor(Math.random()*pokArr.group5.length)];
			islegend=1;
		}
		else
		{
			pokname=pokArr.group4[Math.floor(Math.random()*pokArr.group4.length)];
		}
			var skillsarr=read("포켓몬/"+pokname,"skills");
			var caughtpokskills=[];
			var poklev=0;
			poklev=((ballArr.indexOf(pokUser[sender].Ball)+1)*setting.balluplev)+10;
			if(skillsarr.length<5)
				caughtpokskills=skillsarr;
			else
			{
				while(caughtpokskills.length<4)
				{
					var t=skillsarr[Math.floor(Math.random()*skillsarr.length)];
					t=t.replace("DP","").replace("Pt","");
					if(caughtpokskills.indexOf(t)==(-1))
						caughtpokskills.push(t);
				}
			}
			
			var caughtpokhp=read("포켓몬/"+pokname,"hp");
			
			let caughtpok={
				'name':pokname,
				'level':poklev,
				'hp': Math.ceil(caughtpokhp*poklev/50),
				'atk': Math.ceil(read("포켓몬/"+pokname,"atk")*poklev/50),
				'def': Math.ceil(read("포켓몬/"+pokname,"def")*poklev/50),
				'spd': Math.ceil(read("포켓몬/"+pokname,"spd")*poklev/50),
				'skills':caughtpokskills, //위 4개는 json read
				'skillslocked':[],
				'formchange':0,
				'islocked':0
			};
			pokInv[sender].box.push(caughtpok);
			let lt=pokname.length-1;
			if(islegend==1)
				replier.reply("@"+sender+"\n축하합니다!\n 알에서 <🦄울트라비스트🦄> Lv."+poklev+" "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '을' : '를')+" 획득했습니다!");
			else if(islegend==2)
				replier.reply("@"+sender+"\n축하합니다!\n 알에서 <???> Lv."+poklev+" "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '을' : '를')+" 획득했습니다!");
			else
				replier.reply("@"+sender+"\n축하합니다!\n 알에서 <⭐전설⭐> Lv."+poklev+" "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '을' : '를')+" 획득했습니다!");
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
			replier.reply("@"+sender+"\n획득한 포켓몬을 저장했습니다.");
			for(var ii of collectionnames){
				if(collectioncontents[collectionnames.indexOf(ii)].includes(pokname))
				{
					if(pokCol[sender][ii].indexOf(pokname)==(-1))
					{
						pokCol[sender][ii].push(pokname)
						FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_collection.json', JSON.stringify(pokCol[sender]));
						replier.reply("@"+sender+"\n도감의 ["+ii+"] 에 새로운 포켓몬이 등록되었습니다.");
						updatecollection(replier,sender);
						break;
					}
				}
			}
	}
}

if(msg==cmds.ballup)//볼강화
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	var b=ballArr.indexOf(pokUser[sender].Ball);
	if(b==(ballArr.length-1))
		replier.reply("@"+sender+"\n이미 볼 강화가 최대로 완료되어 있어요.");
	else if(setting.ballupPrice[b]>pokUser[sender].gold)
		replier.reply("@"+sender+"\n볼을 업그레이드하기 위한 돈이 모자라요.\n업그레이드 비용: "+setting.ballupPrice[b].comma()+"원");
	else if(setting.ballupsucc[b]>pokUser[sender].count.total)
		replier.reply("@"+sender+"\n포켓몬을 더 많이 만나야 업그레이드할 수 있어요.\n업그레이드 요구 포켓몬 발견 횟수: "+setting.ballupsucc[b]+"회");
	else
	{
		pokUser[sender].gold=pokUser[sender].gold-setting.ballupPrice[b];
		pokUser[sender].Ball=ballArr[b+1];
		
		pokUser[sender].successcatch.g5=pokUser[sender].successcatch.g5+setting.ballcatch[0];
		pokUser[sender].successcatch.g4=pokUser[sender].successcatch.g4+setting.ballcatch[1];
		pokUser[sender].successcatch.g3=pokUser[sender].successcatch.g3+setting.ballcatch[2];
		pokUser[sender].successcatch.g2=pokUser[sender].successcatch.g2+setting.ballcatch[3];
		pokUser[sender].successcatch.g1=pokUser[sender].successcatch.g1+setting.ballcatch[4];
		
		pokUser[sender].stat.g5=pokUser[sender].stat.g5+setting.ballg5[b+1]-setting.ballg5[b];
		pokUser[sender].stat.g4=pokUser[sender].stat.g4+setting.ballg4[b+1]-setting.ballg4[b];
		pokUser[sender].stat.g3=pokUser[sender].stat.g3+setting.ballg3[b+1]-setting.ballg3[b];
		
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
		replier.reply('@'+sender+'\n'+setting.ballupPrice[b].comma()+'원을 지불하여\n볼을 '+ballArr[b]+"에서 "+pokUser[sender].Ball+"로 업그레이드했어요.");
	}
}

if(msg==cmds.battleexit)//배틀취소
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	if(pokUser[sender].restOn.on){
        replier.reply('@'+sender+' \n휴식 중입니다.\n"'+cmds.rest+'" 을 입력해서 휴식을 종료하세요.');
        return;
    }
	if(advOn[sender]==undefined) advOn[sender]=0;
	if(player2==""&&player1==sender&&isbattle==0)
	{
		player1="";
		advOn[sender]=0;
		replier.reply('@'+sender+'\n배틀에서 퇴장했어요.');
	}
	else replier.reply('@'+sender+'\n배틀에 입장하지 않았거나 이미 배틀이 시작됐어요.');
	
}

if(msg==cmds.battlejoin)//배틀참가
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	if(pokUser[sender].restOn.on){
        replier.reply('@'+sender+' \n휴식 중입니다.\n"'+cmds.rest+'" 을 입력해서 휴식을 종료하세요.');
        return;
    }
	if(advOn[sender]==undefined) advOn[sender]=0;
	if(advOn[sender]==3){
        replier.reply('@'+sender+'\n이미 배틀에 참가한 상태에요.');
        return;
    }
	else if(advOn[sender]!=0){
        replier.reply('@'+sender+'\n탐험 중에는 배틀에 참가할 수 없어요.');
        return;
    }
	
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].deck.length<1)
		replier.reply("@"+sender+"\n덱에 장착한 포켓몬이 없어요.\n배틀에 내보낼 포켓몬을 선택해서 덱으로 이동시켜 주세요.");
	else
	{
		if(player1==""&&isbattle==0)
		{
			player1=sender;
			replier.reply("["+sender+"]님이 배틀에 입장하셨습니다!\n다른 참가자가 입장할때까지 대기해 주세요.\n"+cmds.battleexit+" 명령어로 매칭을 취소할 수 있습니다.");
			advOn[player1]=3;
		}
		else if(player2==""&&isbattle==0)
		{
			player2=sender;
			isbattle=1;
			advOn[player2]=3;
			player1retire=[];
			player2retire=[];
			replier.reply("["+sender+"]님이 배틀에 입장하셨습니다!\n\n"+player1+"\nVS\n"+player2+"\n\n매칭이 성사되어 잠시 후 배틀이 시작됩니다.");
			pokInv[player1]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+player1+'_inv.json'));
			pokInv[player2]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+player2+'_inv.json'));
			player1ball="";
			player2ball="";
			battleres="";
			player1pok={};
			player2pok={};
			player1pp=[];
			player2pp=[];
			isplayer1bind=0;
			isplayer2bind=0;
			isnpcbattle=0;
			nextpokchoose=0;
			player1maxhp=0;
			player2maxhp=0;
			weather=0;
			for(var i=0;i<(pokInv[player1].deck.length-player1retire.length);i++)
				player1ball=player1ball+"○";
			for(var i=0;i<player1retire.length;i++)
				player1ball=player1ball+"●";
			for(var i=0;i<(pokInv[player2].deck.length-player2retire.length);i++)
				player2ball=player2ball+"○";
			for(var i=0;i<player2retire.length;i++)
				player2ball=player2ball+"●";
			java.lang.Thread.sleep(3000);
			replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
			player1pok=pokInv[player1].deck[0];
			player2pok=pokInv[player2].deck[0];
			player1maxhp=player1pok.hp;
			player2maxhp=player2pok.hp;
			var player1skillsarr=[];
			for(var j=0;j<player1pok.skills.length;j++)
				player1skillsarr.push(player1pok.skills[j]);
			for(var j=0;j<player1pok.skillslocked.length;j++)
				player1skillsarr.push(player1pok.skillslocked[j]);
			var player2skillsarr=[];
			for(var j=0;j<player2pok.skills.length;j++)
				player2skillsarr.push(player2pok.skills[j]);
			for(var j=0;j<player2pok.skillslocked.length;j++)
				player2skillsarr.push(player2pok.skillslocked[j]);
			if(player1pok.name=="메타몽"){
				player1pok.name=player2pok.name;
				player1pok.hp=player2maxhp;
				player1pok.skills=player2pok.skills;
				player1pok.skillslocked=player2pok.skillslocked;
				player1pok.atk=player2pok.atk;
				player1pok.def=player2pok.def;
				player1pok.spd=player2pok.spd;
				player1skillsarr=player2skillsarr;
				player1maxhp=player2maxhp;
				replier.reply("@"+player1+"\n메타몽은 "+player1pok.name+"의 모습으로 변신했어요!");
			}
			else if(player2pok.name=="메타몽"){
				player2pok.name=player1pok.name;
				player2pok.hp=player1maxhp;
				player2pok.skills=player1pok.skills;
				player2pok.skillslocked=player1pok.skillslocked;
				player2pok.atk=player1pok.atk;
				player2pok.def=player1pok.def;
				player2pok.spd=player1pok.spd;
				player2skillsarr=player1skillsarr;
				player2maxhp=player1maxhp;
				replier.reply("@"+player2+"\n메타몽은 "+player2pok.name+"의 모습으로 변신했어요!");
			}
			if(pokUser[player1].activecollection.includes(8))
				player1pok.spd=player1pok.spd+pokUser[player1].collectionlev*5;
			if(Number(pokUser[player2].activecollection.includes(8)))
				player2pok.spd=player2pok.spd+pokUser[player2].collectionlev*5;
			if(pokUser[player1].activecollection.includes(11))
				player1pok.def=player1pok.def+pokUser[player1].collectionlev*30;
			if(Number(pokUser[player2].activecollection.includes(11)))
				player2pok.def=player2pok.def+pokUser[player2].collectionlev*30;
			for(var i=0;i<player1skillsarr.length;i++)
			{
				try{
					player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
				}
				catch(e){
					player1pp.push(1);
				}
			}
			for(var i=0;i<player2skillsarr.length;i++)
			{
				try{
					player2pp.push(Number(read("기술/"+player2skillsarr[i]),"pp"));
				}
				catch(e){
					player2pp.push(1);
				}
			}
			if(Math.floor(Math.random()*3)==1){
				let pokseason=JSON.parse(FileStream.read(pathseason));
				if(pokseason==null){
					let data={"month":1};
					FileStream.write(pathseason, JSON.stringify(data));
					pokseason=JSON.parse(FileStream.read(pathseason));
				}
				month=pokseason["month"];
				weather=month;
				if(weather==1) replier.reply("햇살이 강해졌어요!\n현재 날씨: "+weathertexts[weather]);
				else if(weather==2) replier.reply("비가 내리기 시작했어요!\n현재 날씨: "+weathertexts[weather]);
				else if(weather==3) replier.reply("모래바람이 불기 시작했어요!\n현재 날씨: "+weathertexts[weather]);
				else if(weather==4) replier.reply("싸라기눈이 내리기 시작했어요!\n현재 날씨: "+weathertexts[weather]);
			}
			printbattlekakaolink(room,replier);
			do{
				battleturn(room,replier);
			}while(player1pok.hp>0&&player2pok.hp>0);
			replier.reply("배틀 결과\n"+"\u200b".repeat(500)+"\n"+battleres);
			battleres="";
			if(player1pok.hp<1)
			{
				player1retire.push(pokInv[player1].deck.indexOf(player1pok));
				let lt=player1pok.name.length-1;
				replier.reply("@"+player1+"\n"+player1pok.name+(player1pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
				java.lang.Thread.sleep(1000);
				if(player1retire.length==pokInv[player1].deck.length)
				{
					var reward=Math.ceil(pokUser[player1].gold/10);
					if(Number(pokUser[player2].activecollection.includes(10)))
						reward=reward*(pokUser[player2].collectionlev+1);
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player1]=0;
					advOn[player2]=0;
					weather=0;
					pokUser[player1].gold=pokUser[player1].gold-reward;
					pokUser[player2].gold=pokUser[player2].gold+reward;
					pokUser[player1].battlecount.total=pokUser[player1].battlecount.total+1;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player1].battlecount.lose=pokUser[player1].battlecount.lose+1;
					pokUser[player2].battlecount.win=pokUser[player2].battlecount.win+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player1].name)){
						let ruser={
							'name':pokUser[player1].name,
							'rank':pokUser[player1].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player1].battlecount.total;
						ruser.battle.win=pokUser[player1].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player1].name);
						pokRank[n].rank=pokUser[player1].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player1].battlecount.total)
							pokRank[n].battle.total=pokUser[player1].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player1].battlecount.win)
							pokRank[n].battle.win=pokUser[player1].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player1+'.json', JSON.stringify(pokUser[player1]));
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player1+"\n배틀에서 패배했어요.\n"+reward.comma()+"원을 잃었어요.\n보유금액: "+pokUser[player1].gold.comma()+"원");
					replier.reply("@"+player2+"\n배틀에서 승리했어요.\n상금으로 "+reward.comma()+"원을 얻었어요.\n보유금액: "+pokUser[player2].gold.comma()+"원");
					player1="";
					player2="";
				}
				else
				{
					nextpokchoose=1;
					var res="";
					for(var i=0;i<pokInv[player1].deck.length;i++)
					{
						res=res+(i+1)+". ";
						if(player1retire.includes(i)) res=res+"(기절) ";
						res=res+"Lv."+pokInv[player1].deck[i].level+" "+pokInv[player1].deck[i].name+"\n";
					}
					replier.reply("@"+player1+"\n다음으로 내보낼 포켓몬을 선택해 주세요.\n("+cmds.battlenext+" (숫자) 명령어로 선택)\n\n"+res);
				}
			}
			else if(player2pok.hp<1)
			{
				player2retire.push(pokInv[player2].deck.indexOf(player2pok));
				let lt=player2pok.name.length-1;
				replier.reply("@"+player2+"\n"+player2pok.name+(player2pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
				java.lang.Thread.sleep(1000);
				if(player2retire.length==pokInv[player2].deck.length)
				{
					var reward=Math.ceil(pokUser[player2].gold/10);
					if(pokUser[player1].activecollection.includes(10))
						reward=reward*(pokUser[player1].collectionlev+1);
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player1]=0;
					advOn[player2]=0;
					weather=0;
					pokUser[player2].gold=pokUser[player2].gold-reward;
					pokUser[player1].gold=pokUser[player1].gold+reward;
					pokUser[player1].battlecount.total=pokUser[player1].battlecount.total+1;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.lose=pokUser[player2].battlecount.lose+1;
					pokUser[player1].battlecount.win=pokUser[player1].battlecount.win+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player1].name)){
						let ruser={
							'name':pokUser[player1].name,
							'rank':pokUser[player1].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player1].battlecount.total;
						ruser.battle.win=pokUser[player1].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player1].name);
						pokRank[n].rank=pokUser[player1].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player1].battlecount.total)
							pokRank[n].battle.total=pokUser[player1].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player1].battlecount.win)
							pokRank[n].battle.win=pokUser[player1].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player1+'.json', JSON.stringify(pokUser[player1]));
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n배틀에서 패배했어요.\n"+reward.comma()+"원을 잃었어요.\n보유금액: "+pokUser[player2].gold.comma()+"원");
					replier.reply("@"+player1+"\n배틀에서 승리했어요.\n상금으로 "+reward.comma()+"원을 얻었어요.\n보유금액: "+pokUser[player1].gold.comma()+"원");
					player1="";
					player2="";
				}
				else
				{
					nextpokchoose=2;
					var res="";
					for(var i=0;i<pokInv[player2].deck.length;i++)
					{
						res=res+(i+1)+". ";
						if(player2retire.includes(i)) res=res+"(기절) ";
						res=res+"Lv."+pokInv[player2].deck[i].level+" "+pokInv[player2].deck[i].name+"\n";
					}
					replier.reply("@"+player2+"\n다음으로 내보낼 포켓몬을 선택해 주세요.\n("+cmds.battlenext+" (숫자) 명령어로 선택)\n\n"+res);
				}
			}
		}
		else
		{
			replier.reply("@"+sender+"\n이미 진행 중인 배틀이 있어요.\n\n현재 진행 중인 배틀\n"+player1+" VS "+player2);
		}
	}
}

if(msg==cmds.battletower)//배틀타워(일일 레이드)
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	if(pokUser[sender].restOn.on){
        replier.reply('@'+sender+' \n휴식 중입니다.\n"'+cmds.rest+'" 을 입력해서 휴식을 종료하세요.');
        return;
    }
	if(advOn[sender]==undefined) advOn[sender]=0;
	if(advOn[sender]==3){
        replier.reply('@'+sender+'\n이미 다른 배틀을 매칭 중인 상태에요.\n배틀을 끝내시거나 매칭을 취소해 주세요.');
        return;
    }
	else if(advOn[sender]!=0){
        replier.reply('@'+sender+'\n탐험 중에는 배틀에 참가할 수 없어요.');
        return;
    }
	if(pokUser[sender].hp<=4){
        replier.reply('@'+sender+' \n배틀타워 도전은 1회당 체력 5를 소모해요.\n"'+cmds.rest+'" 명령어를 사용해보세요.');
        return;
    }
	if(battletowerplayers[sender]==null||battletowerplayers[sender]==undefined)
				battletowerplayers[sender]=0;
	if(battletowerplayers[sender]>0)
	{
		replier.reply('@'+sender+"\n배틀타워는 1회 리로드 당 1회만 클리어 가능합니다.");
		return;
	}
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].deck.length<1)
		replier.reply("@"+sender+"\n덱에 장착한 포켓몬이 없어요.\n배틀에 내보낼 포켓몬을 선택해서 덱으로 이동시켜 주세요.");
	else
	{
		if(player1==""&&isbattle==0)
		{
			player1="포켓몬 트레이너";
			player2=sender;
			isbattle=4;
			advOn[player2]=3;
			player1retire=[];
			player2retire=[];
			trainerInv={};
			pokUser[sender].hp=pokUser[sender].hp-5;
			trainerInv[player1]={"deck":[]};
			pokInv[player2]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+player2+'_inv.json'));
			battletowerlev[sender]=pokInv[sender].deck[0].level;
			var aipokname="";
			for(var ii=0;ii<6;ii++){
				aipokname=trainerranpoks[Math.floor(Math.random()*trainerranpoks.length)];
				var skillsarr=read("포켓몬/"+aipokname,"skills");
				var caugtpokskills=[];
				if(skillsarr.length<5)
					caugtpokskills=skillsarr;
				else
				{
					while(caugtpokskills.length<4)
					{
						var tt=skillsarr[Math.floor(Math.random()*skillsarr.length)];
						tt=tt.replace("DP","").replace("Pt","");
						if(caugtpokskills.indexOf(tt)==(-1))
							caugtpokskills.push(tt);
					}
				}
				
				var caugtpokhp=read("포켓몬/"+aipokname,"hp");
				
				let caugtpok={
					'name':aipokname,
					'level':battletowerlev[sender],
					'hp': Math.ceil(caugtpokhp*battletowerlev[sender]/50),
					'atk': Math.ceil(read("포켓몬/"+aipokname,"atk")*battletowerlev[sender]/50),
					'def': Math.ceil(read("포켓몬/"+aipokname,"def")*battletowerlev[sender]/50),
					'spd': Math.ceil(read("포켓몬/"+aipokname,"spd")*battletowerlev[sender]/50),
					'skills':caugtpokskills,
					'skillslocked':[],
					'formchange':0,
					'islocked':0
				};
				trainerInv[player1].deck.push(caugtpok);
			}
			replier.reply("@"+sender+"\n랜덤으로 트레이너가 매칭되었습니다!\n\n잠시 후 배틀이 시작됩니다.");
			player1ball="";
			player2ball="";
			battleres="";
			player1pok={};
			player2pok={};
			player1pp=[];
			player2pp=[];
			isplayer1bind=0;
			isplayer2bind=0;
			isnpcbattle=1;
			nextpokchoose=0;
			player1maxhp=0;
			player2maxhp=0;
			trainerpoknum=0;
			weather=0;
			for(var i=0;i<(trainerInv[player1].deck.length-player1retire.length);i++)
				player1ball=player1ball+"○";
			for(var i=0;i<player1retire.length;i++)
				player1ball=player1ball+"●";
			for(var i=0;i<(pokInv[player2].deck.length-player2retire.length);i++)
				player2ball=player2ball+"○";
			for(var i=0;i<player2retire.length;i++)
				player2ball=player2ball+"●";
			java.lang.Thread.sleep(3000);
			replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
			trainerpoknum=1;
			player1pok=trainerInv[player1].deck[trainerpoknum-1];
			player2pok=pokInv[player2].deck[0];
			if(player1pok.formchange!=0)
			{
				player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"hp")*player1pok.level/50);
				player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"atk")*player1pok.level/50);
				player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"def")*player1pok.level/50);
				player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"spd")*player1pok.level/50);
			}
			else{
			player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name,"hp")*player1pok.level/50);
			player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name,"atk")*player1pok.level/50);
			player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name,"def")*player1pok.level/50);
			player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name,"spd")*player1pok.level/50);
			}
			//
			player1maxhp=player1pok.hp;
			player2maxhp=player2pok.hp;
			var player1skillsarr=[];
			for(var j=0;j<player1pok.skills.length;j++)
				player1skillsarr.push(player1pok.skills[j]);
			for(var j=0;j<player1pok.skillslocked.length;j++)
				player1skillsarr.push(player1pok.skillslocked[j]);
			var player2skillsarr=[];
			for(var j=0;j<player2pok.skills.length;j++)
				player2skillsarr.push(player2pok.skills[j]);
			for(var j=0;j<player2pok.skillslocked.length;j++)
				player2skillsarr.push(player2pok.skillslocked[j]);
			if(player2pok.name=="메타몽"){
				player2pok.name=player1pok.name;
				player2pok.hp=player1maxhp;
				player2pok.skills=player1pok.skills;
				player2pok.skillslocked=player1pok.skillslocked;
				player2pok.atk=player1pok.atk;
				player2pok.def=player1pok.def;
				player2pok.spd=player1pok.spd;
				player2skillsarr=player1skillsarr;
				player2maxhp=player1maxhp;
				replier.reply("@"+player2+"\n메타몽은 "+player2pok.name+"의 모습으로 변신했어요!");
			}
			if(Number(pokUser[player2].activecollection.includes(8)))
				player2pok.spd=player2pok.spd+pokUser[player2].collectionlev*5;
			if(Number(pokUser[player2].activecollection.includes(11)))
				player2pok.def=player2pok.def+pokUser[player2].collectionlev*30;
			for(var i=0;i<player1skillsarr.length;i++)
			{
				try{
					player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
				}
				catch(e){
					player1pp.push(1);
				}
			}
			for(var i=0;i<player2skillsarr.length;i++)
			{
				try{
					player2pp.push(Number(read("기술/"+player2skillsarr[i]),"pp"));
				}
				catch(e){
					player2pp.push(1);
				}
			}
			if(Math.floor(Math.random()*3)==1){
				let pokseason=JSON.parse(FileStream.read(pathseason));
				if(pokseason==null){
					let data={"month":1};
					FileStream.write(pathseason, JSON.stringify(data));
					pokseason=JSON.parse(FileStream.read(pathseason));
				}
				month=pokseason["month"];
				weather=month;
				if(weather==1) replier.reply("햇살이 강해졌어요!\n현재 날씨: "+weathertexts[weather]);
				else if(weather==2) replier.reply("비가 내리기 시작했어요!\n현재 날씨: "+weathertexts[weather]);
				else if(weather==3) replier.reply("모래바람이 불기 시작했어요!\n현재 날씨: "+weathertexts[weather]);
				else if(weather==4) replier.reply("싸라기눈이 내리기 시작했어요!\n현재 날씨: "+weathertexts[weather]);
			}
			do{
				printbattlekakaolink(room,replier);
				do{
					battleturn(room,replier);
				}while(player1pok.hp>0&&player2pok.hp>0);
				replier.reply("배틀 결과\n"+"\u200b".repeat(500)+"\n"+battleres);
				battleres="";
				if(player1pok.hp<1){
					player1retire.push(trainerInv[player1].deck.indexOf(player1pok));
					let lt=player1pok.name.length-1;
					replier.reply("상대 트레이너의 "+player1pok.name+(player1pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
					java.lang.Thread.sleep(1000);
					if(player1retire.length!=trainerInv[player1].deck.length){
						replier.reply("상대 트레이너가 다음 포켓몬을 배틀에 내보냅니다.");
						player1pok={};
						player1pp=[];
						player1maxhp=0;
						player1ball="";
						player2ball="";
						for(var i=0;i<(trainerInv[player1].deck.length-player1retire.length);i++)
							player1ball=player1ball+"○";
						for(var i=0;i<player1retire.length;i++)
							player1ball=player1ball+"●";
						for(var i=0;i<(pokInv[player2].deck.length-player2retire.length);i++)
							player2ball=player2ball+"○";
						for(var i=0;i<player2retire.length;i++)
							player2ball=player2ball+"●";
						java.lang.Thread.sleep(2000);
						replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
						trainerpoknum=trainerpoknum+1;
						player1pok=trainerInv[player1].deck[trainerpoknum-1];
						if(player1pok.formchange!=0)
						{
							player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"hp")*player1pok.level/50);
							player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"atk")*player1pok.level/50);
							player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"def")*player1pok.level/50);
							player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"spd")*player1pok.level/50);
						}
						else{
						player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name,"hp")*player1pok.level/50);
						player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name,"atk")*player1pok.level/50);
						player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name,"def")*player1pok.level/50);
						player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name,"spd")*player1pok.level/50);
						}
						//
						player1maxhp=player1pok.hp;
						var player1skillsarr=[];
						for(var j=0;j<player1pok.skills.length;j++)
							player1skillsarr.push(player1pok.skills[j]);
						for(var j=0;j<player1pok.skillslocked.length;j++)
							player1skillsarr.push(player1pok.skillslocked[j]);
						for(var i=0;i<player1skillsarr.length;i++)
						{
							try{
							player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
							}
							catch(e){
								player1pp.push(1);
							}
						}
						
					}
				}
			}while(player1retire.length!=trainerInv[player1].deck.length&&player2pok.hp>0);
			
			if(player1retire.length==trainerInv[player1].deck.length)
			{
					var reward=battletowerlev[player2]*battletowerlev[player2]*10000;
					reward=reward*setting.eventp.goldX;
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player2]=0;
					weather=0;
					trainerInv={};
					trainerpoknum=0;
					battletowerplayers[player2]++;
					pokUser[player2].gold=pokUser[player2].gold+reward;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.win=pokUser[player2].battlecount.win+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n배틀타워에서 승리했어요.\n상금으로 "+reward.comma()+"원을 얻었어요.\n보유금액: "+pokUser[player2].gold.comma()+"원");
					updateribbon(replier,player2);
					player1="";
					player2="";

			}
			else
			{
				player2retire.push(pokInv[player2].deck.indexOf(player2pok));
				let lt=player2pok.name.length-1;
				replier.reply("@"+player2+"\n"+player2pok.name+(player2pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
				java.lang.Thread.sleep(1000);
				if(player2retire.length==pokInv[player2].deck.length)
				{
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player1]=0;
					advOn[player2]=0;
					weather=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.lose=pokUser[player2].battlecount.lose+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n상대 트레이너와의 배틀에서 패배했어요.\n도전에 실패했어요.");
					player1="";
					player2="";
				}
				else
				{
					nextpokchoose=2;
					var res="";
					for(var i=0;i<pokInv[player2].deck.length;i++)
					{
						res=res+(i+1)+". ";
						if(player2retire.includes(i)) res=res+"(기절) ";
						res=res+"Lv."+pokInv[player2].deck[i].level+" "+pokInv[player2].deck[i].name+"\n";
					}
					replier.reply("@"+player2+"\n다음으로 내보낼 포켓몬을 선택해 주세요.\n("+cmds.battlenext+" (숫자) 명령어로 선택)\n\n"+res);
				}
			}
		}
		else
		{
			replier.reply("@"+sender+"\n이미 진행 중인 배틀이 있거나 체육관 또는 챔피언에 도전중인 유저가 있어요.\n\n현재 진행 중인 배틀\n"+player1+" VS "+player2);
		}
	}
}

if(msg==cmds.gym)//체육관
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	if(pokUser[sender].restOn.on){
        replier.reply('@'+sender+' \n휴식 중입니다.\n"'+cmds.rest+'" 을 입력해서 휴식을 종료하세요.');
        return;
    }
	if(advOn[sender]==undefined) advOn[sender]=0;
	if(advOn[sender]==3){
        replier.reply('@'+sender+'\n이미 다른 배틀을 매칭 중인 상태에요.\n배틀을 끝내시거나 매칭을 취소해 주세요.');
        return;
    }
	else if(advOn[sender]!=0){
        replier.reply('@'+sender+'\n탐험 중에는 배틀에 참가할 수 없어요.');
        return;
    }
	if(pokUser[sender].hp<=4){
        replier.reply('@'+sender+' \n체육관 도전은 1회당 체력 5를 소모해요.\n"'+cmds.rest+'" 명령어를 사용해보세요.');
        return;
    }
	
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].deck.length<1)
		replier.reply("@"+sender+"\n덱에 장착한 포켓몬이 없어요.\n배틀에 내보낼 포켓몬을 선택해서 덱으로 이동시켜 주세요.");
	else
	{
		gymnum=0;
		if(pokUser[sender].badge>(-1))
		{
			
		}
		else{
			pokUser[sender].badge=null;
			pokUser[sender].badge=0;
			
		}
		gymnum=pokUser[sender].badge+1;
		if((gymnum-1)>17)
			replier.reply("@"+sender+"\n모든 체육관의 뱃지를 획득하여 더 도전할 체육관이 없습니다.\n챔피언에 도전해 보세요.");
		else if(player1==""&&isbattle==0)
		{
			player1="체육관 관장";
			player2=sender;
			isbattle=2;
			advOn[player2]=3;
			player1retire=[];
			player2retire=[];
			trainerInv={};
			pokUser[sender].hp=pokUser[sender].hp-5;
			replier.reply("@"+sender+"\n"+gymnum+"번째 체육관 도전을 시작합니다!\n\n잠시 후 배틀이 시작됩니다.");
			trainerInv[player1]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/trainer/gym_"+gymnum+'.json'));
			pokInv[player2]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+player2+'_inv.json'));
			player1ball="";
			player2ball="";
			battleres="";
			player1pok={};
			player2pok={};
			player1pp=[];
			player2pp=[];
			isplayer1bind=0;
			isplayer2bind=0;
			isnpcbattle=1;
			nextpokchoose=0;
			player1maxhp=0;
			player2maxhp=0;
			trainerpoknum=0;
			weather=0;
			for(var i=0;i<(trainerInv[player1].deck.length-player1retire.length);i++)
				player1ball=player1ball+"○";
			for(var i=0;i<player1retire.length;i++)
				player1ball=player1ball+"●";
			for(var i=0;i<(pokInv[player2].deck.length-player2retire.length);i++)
				player2ball=player2ball+"○";
			for(var i=0;i<player2retire.length;i++)
				player2ball=player2ball+"●";
			java.lang.Thread.sleep(3000);
			replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
			trainerpoknum=1;
			player1pok=trainerInv[player1].deck[trainerpoknum-1];
			player2pok=pokInv[player2].deck[0];
			//체육관 관장 포켓몬의 스텟은 여기서 자동 계산
			if(player1pok.formchange!=0)
			{
				player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"hp")*player1pok.level/50);
				player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"atk")*player1pok.level/50);
				player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"def")*player1pok.level/50);
				player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"spd")*player1pok.level/50);
			}
			else{
			player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name,"hp")*player1pok.level/50);
			player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name,"atk")*player1pok.level/50);
			player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name,"def")*player1pok.level/50);
			player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name,"spd")*player1pok.level/50);
			}
			//
			player1maxhp=player1pok.hp;
			player2maxhp=player2pok.hp;
			var player1skillsarr=[];
			for(var j=0;j<player1pok.skills.length;j++)
				player1skillsarr.push(player1pok.skills[j]);
			for(var j=0;j<player1pok.skillslocked.length;j++)
				player1skillsarr.push(player1pok.skillslocked[j]);
			var player2skillsarr=[];
			for(var j=0;j<player2pok.skills.length;j++)
				player2skillsarr.push(player2pok.skills[j]);
			for(var j=0;j<player2pok.skillslocked.length;j++)
				player2skillsarr.push(player2pok.skillslocked[j]);
			if(player2pok.name=="메타몽"){
				player2pok.name=player1pok.name;
				player2pok.hp=player1maxhp;
				player2pok.skills=player1pok.skills;
				player2pok.skillslocked=player1pok.skillslocked;
				player2pok.atk=player1pok.atk;
				player2pok.def=player1pok.def;
				player2pok.spd=player1pok.spd;
				player2skillsarr=player1skillsarr;
				player2maxhp=player1maxhp;
				replier.reply("@"+player2+"\n메타몽은 "+player2pok.name+"의 모습으로 변신했어요!");
			}
			if(Number(pokUser[player2].activecollection.includes(8)))
				player2pok.spd=player2pok.spd+pokUser[player2].collectionlev*5;
			if(Number(pokUser[player2].activecollection.includes(11)))
				player2pok.def=player2pok.def+pokUser[player2].collectionlev*30;
			for(var i=0;i<player1skillsarr.length;i++)
			{
				try{
					player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
				}
				catch(e){
					player1pp.push(1);
				}
			}
			for(var i=0;i<player2skillsarr.length;i++)
			{
				try{
					player2pp.push(Number(read("기술/"+player2skillsarr[i]),"pp"));
				}
				catch(e){
					player2pp.push(1);
				}
			}
			if(Math.floor(Math.random()*3)==1){
				let pokseason=JSON.parse(FileStream.read(pathseason));
				if(pokseason==null){
					let data={"month":1};
					FileStream.write(pathseason, JSON.stringify(data));
					pokseason=JSON.parse(FileStream.read(pathseason));
				}
				month=pokseason["month"];
				weather=month;
				if(weather==1) replier.reply("햇살이 강해졌어요!\n현재 날씨: "+weathertexts[weather]);
				else if(weather==2) replier.reply("비가 내리기 시작했어요!\n현재 날씨: "+weathertexts[weather]);
				else if(weather==3) replier.reply("모래바람이 불기 시작했어요!\n현재 날씨: "+weathertexts[weather]);
				else if(weather==4) replier.reply("싸라기눈이 내리기 시작했어요!\n현재 날씨: "+weathertexts[weather]);
			}
			do{
				printbattlekakaolink(room,replier);
				do{
					battleturn(room,replier);
				}while(player1pok.hp>0&&player2pok.hp>0);
				replier.reply("배틀 결과\n"+"\u200b".repeat(500)+"\n"+battleres);
				battleres="";
				if(player1pok.hp<1){
					player1retire.push(trainerInv[player1].deck.indexOf(player1pok));
					let lt=player1pok.name.length-1;
					replier.reply("체육관 관장의 "+player1pok.name+(player1pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
					java.lang.Thread.sleep(1000);
					if(player1retire.length!=trainerInv[player1].deck.length){
						replier.reply("체육관 관장이 다음 포켓몬을 배틀에 내보냅니다.");
						player1pok={};
						player1pp=[];
						player1maxhp=0;
						player1ball="";
						player2ball="";
						for(var i=0;i<(trainerInv[player1].deck.length-player1retire.length);i++)
							player1ball=player1ball+"○";
						for(var i=0;i<player1retire.length;i++)
							player1ball=player1ball+"●";
						for(var i=0;i<(pokInv[player2].deck.length-player2retire.length);i++)
							player2ball=player2ball+"○";
						for(var i=0;i<player2retire.length;i++)
							player2ball=player2ball+"●";
						java.lang.Thread.sleep(2000);
						replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
						trainerpoknum=trainerpoknum+1;
						player1pok=trainerInv[player1].deck[trainerpoknum-1];
						//체육관 관장 포켓몬의 스텟은 여기서 자동 계산
						if(player1pok.formchange!=0)
						{
							player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"hp")*player1pok.level/50);
							player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"atk")*player1pok.level/50);
							player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"def")*player1pok.level/50);
							player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"spd")*player1pok.level/50);
						}
						else{
						player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name,"hp")*player1pok.level/50);
						player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name,"atk")*player1pok.level/50);
						player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name,"def")*player1pok.level/50);
						player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name,"spd")*player1pok.level/50);
						}
						//
						player1maxhp=player1pok.hp;
						var player1skillsarr=[];
						for(var j=0;j<player1pok.skills.length;j++)
							player1skillsarr.push(player1pok.skills[j]);
						for(var j=0;j<player1pok.skillslocked.length;j++)
							player1skillsarr.push(player1pok.skillslocked[j]);
						for(var i=0;i<player1skillsarr.length;i++)
						{
							try{
								player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
							}
							catch(e){
								player1pp.push(1);
							}
						}
						
					}
				}
			}while(player1retire.length!=trainerInv[player1].deck.length&&player2pok.hp>0);
			
			if(player1retire.length==trainerInv[player1].deck.length)
			{
					var reward=2000000*(gymnum+1)*(gymnum+1);
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player2]=0;
					weather=0;
					gymnum=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].gold=pokUser[player2].gold+reward;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.win=pokUser[player2].battlecount.win+1;
					pokUser[player2].badge=pokUser[player2].badge+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n체육관 관장에게서 승리하여 뱃지를 획득했어요.\n상금으로 "+reward.comma()+"원을 얻었어요.\n보유금액: "+pokUser[player2].gold.comma()+"원\n현재 뱃지 개수: "+pokUser[player2].badge+"개");
					updateribbon(replier,player2);
					player1="";
					player2="";

			}
			else
			{
				player2retire.push(pokInv[player2].deck.indexOf(player2pok));
				let lt=player2pok.name.length-1;
				replier.reply("@"+player2+"\n"+player2pok.name+(player2pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
				java.lang.Thread.sleep(1000);
				if(player2retire.length==pokInv[player2].deck.length)
				{
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player1]=0;
					advOn[player2]=0;
					weather=0;
					gymnum=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.lose=pokUser[player2].battlecount.lose+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n체육관 관장과의 배틀에서 패배했어요.\n도전에 실패했어요.\n현재 뱃지 개수: "+pokUser[player2].badge+"개");
					player1="";
					player2="";
				}
				else
				{
					nextpokchoose=2;
					var res="";
					for(var i=0;i<pokInv[player2].deck.length;i++)
					{
						res=res+(i+1)+". ";
						if(player2retire.includes(i)) res=res+"(기절) ";
						res=res+"Lv."+pokInv[player2].deck[i].level+" "+pokInv[player2].deck[i].name+"\n";
					}
					replier.reply("@"+player2+"\n다음으로 내보낼 포켓몬을 선택해 주세요.\n("+cmds.battlenext+" (숫자) 명령어로 선택)\n\n"+res);
				}
			}
		}
		else
		{
			replier.reply("@"+sender+"\n이미 진행 중인 배틀이 있거나 체육관 또는 챔피언에 도전중인 유저가 있어요.\n\n현재 진행 중인 배틀\n"+player1+" VS "+player2);
		}
	}
}

if(msg==cmds.champ)//챔피언도전
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	if(pokUser[sender].restOn.on){
        replier.reply('@'+sender+' \n휴식 중입니다.\n"'+cmds.rest+'" 을 입력해서 휴식을 종료하세요.');
        return;
    }
	if(advOn[sender]==undefined) advOn[sender]=0;
	if(advOn[sender]==3){
        replier.reply('@'+sender+'\n이미 다른 배틀을 매칭 중인 상태에요.\n배틀을 끝내시거나 매칭을 취소해 주세요.');
        return;
    }
	else if(advOn[sender]!=0){
        replier.reply('@'+sender+'\n탐험 중에는 배틀에 참가할 수 없어요.');
        return;
    }
	if(pokUser[sender].hp<=4){
        replier.reply('@'+sender+' \n챔피언 도전은 1회당 체력 5를 소모해요.\n"'+cmds.rest+'" 명령어를 사용해보세요.');
        return;
    }
	
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].deck.length<1)
		replier.reply("@"+sender+"\n덱에 장착한 포켓몬이 없어요.\n배틀에 내보낼 포켓몬을 선택해서 덱으로 이동시켜 주세요.");
	else
	{
		gymnum=0;
		if(pokUser[sender].badge>(-1))
		{
			
		}
		else{
			pokUser[sender].badge=null;
			pokUser[sender].badge=0;
			
		}
		gymnum=pokUser[sender].badge+1;
		if(gymnum<18)
			replier.reply("@"+sender+"\n챔피언 도전은 모든 체육관을 클리어해야만 가능해요.");
		else if(player1==""&&isbattle==0)
		{
			let chamRank=JSON.parse(FileStream.read(pathchampRank));
			if(chamRank==null){
				let cdata={"Champnum":1,"Champlogs":[]};
				FileStream.write(pathchampRank, JSON.stringify(cdata));
				chamRank=JSON.parse(FileStream.read(pathchampRank));
			}
			if(chamRank["Champlogs"][chamRank["Champlogs"].length-1]==sender)
			{
				replier.reply('@'+sender+'\n이미 현 챔피언이에요.\n다른 유저의 챔피언 도전을 기다려 보세요.');
				return;
			}
			if(champplayers[sender]==null||champplayers[sender]==undefined)
				champplayers[sender]=0;
			if(champplayers[sender]>0)
			{
				replier.reply('@'+sender+"\n챔피언은 1회 리로드 당 1회만 될 수 있어요.");
				return;
			}
			player1="챔피언";
			player2=sender;
			isbattle=3;
			advOn[player2]=3;
			player1retire=[];
			player2retire=[];
			trainerInv={};
			trainerInv[player1]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/trainer/champion.json"));
			pokUser[sender].hp=pokUser[sender].hp-5;
			replier.reply("@"+sender+"\n님이 챔피언 "+trainerInv[player1].champname+"에게 도전을 시작합니다!\n\n잠시 후 배틀이 시작됩니다.");
			pokInv[player2]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+player2+'_inv.json'));
			player1ball="";
			player2ball="";
			battleres="";
			player1pok={};
			player2pok={};
			player1pp=[];
			player2pp=[];
			isplayer1bind=0;
			isplayer2bind=0;
			isnpcbattle=1;
			nextpokchoose=0;
			player1maxhp=0;
			player2maxhp=0;
			trainerpoknum=0;
			weather=0;
			for(var i=0;i<(trainerInv[player1].deck.length-player1retire.length);i++)
				player1ball=player1ball+"○";
			for(var i=0;i<player1retire.length;i++)
				player1ball=player1ball+"●";
			for(var i=0;i<(pokInv[player2].deck.length-player2retire.length);i++)
				player2ball=player2ball+"○";
			for(var i=0;i<player2retire.length;i++)
				player2ball=player2ball+"●";
			java.lang.Thread.sleep(3000);
			replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
			trainerpoknum=1;
			player1pok=trainerInv[player1].deck[trainerpoknum-1];
			player2pok=pokInv[player2].deck[0];
			//챔피언 포켓몬의 스텟은 여기서 자동 계산
			if(player1pok.formchange!=0)
			{
				player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"hp")*player1pok.level/50);
				player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"atk")*player1pok.level/50);
				player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"def")*player1pok.level/50);
				player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"spd")*player1pok.level/50);
			}
			else{
			player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name,"hp")*player1pok.level/50);
			player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name,"atk")*player1pok.level/50);
			player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name,"def")*player1pok.level/50);
			player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name,"spd")*player1pok.level/50);
			}
			//
			player1maxhp=player1pok.hp;
			player2maxhp=player2pok.hp;
			var player1skillsarr=[];
			for(var j=0;j<player1pok.skills.length;j++)
				player1skillsarr.push(player1pok.skills[j]);
			for(var j=0;j<player1pok.skillslocked.length;j++)
				player1skillsarr.push(player1pok.skillslocked[j]);
			var player2skillsarr=[];
			for(var j=0;j<player2pok.skills.length;j++)
				player2skillsarr.push(player2pok.skills[j]);
			for(var j=0;j<player2pok.skillslocked.length;j++)
				player2skillsarr.push(player2pok.skillslocked[j]);
			if(player2pok.name=="메타몽"){
				player2pok.name=player1pok.name;
				player2pok.hp=player1maxhp;
				player2pok.skills=player1pok.skills;
				player2pok.skillslocked=player1pok.skillslocked;
				player2pok.atk=player1pok.atk;
				player2pok.def=player1pok.def;
				player2pok.spd=player1pok.spd;
				player2skillsarr=player1skillsarr;
				player2maxhp=player1maxhp;
				replier.reply("@"+player2+"\n메타몽은 "+player2pok.name+"의 모습으로 변신했어요!");
			}
			if(Number(pokUser[player2].activecollection.includes(8)))
				player2pok.spd=player2pok.spd+pokUser[player2].collectionlev*5;
			if(Number(pokUser[player2].activecollection.includes(11)))
				player2pok.def=player2pok.def+pokUser[player2].collectionlev*30;
			for(var i=0;i<player1skillsarr.length;i++)
			{
				try{
					player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
				}
				catch(e){
					player1pp.push(1);
				}
			}
			for(var i=0;i<player2skillsarr.length;i++)
			{
				try{
					player2pp.push(Number(read("기술/"+player2skillsarr[i]),"pp"));
				}
				catch(e){
					player2pp.push(1);
				}
			}
			if(Math.floor(Math.random()*3)==1){
				let pokseason=JSON.parse(FileStream.read(pathseason));
				if(pokseason==null){
					let data={"month":1};
					FileStream.write(pathseason, JSON.stringify(data));
					pokseason=JSON.parse(FileStream.read(pathseason));
				}
				month=pokseason["month"];
				weather=month;
				if(weather==1) replier.reply("햇살이 강해졌어요!\n현재 날씨: "+weathertexts[weather]);
				else if(weather==2) replier.reply("비가 내리기 시작했어요!\n현재 날씨: "+weathertexts[weather]);
				else if(weather==3) replier.reply("모래바람이 불기 시작했어요!\n현재 날씨: "+weathertexts[weather]);
				else if(weather==4) replier.reply("싸라기눈이 내리기 시작했어요!\n현재 날씨: "+weathertexts[weather]);
			}
			do{
				printbattlekakaolink(room,replier);
				do{
					battleturn(room,replier);
				}while(player1pok.hp>0&&player2pok.hp>0);
				replier.reply("배틀 결과\n"+"\u200b".repeat(500)+"\n"+battleres);
				battleres="";
				if(player1pok.hp<1){
					player1retire.push(trainerInv[player1].deck.indexOf(player1pok));
					let lt=player1pok.name.length-1;
					replier.reply("챔피언의 "+player1pok.name+(player1pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
					java.lang.Thread.sleep(1000);
					if(player1retire.length!=trainerInv[player1].deck.length){
						replier.reply("챔피언이 다음 포켓몬을 배틀에 내보냅니다.");
						player1pok={};
						player1pp=[];
						player1maxhp=0;
						player1ball="";
						player2ball="";
						for(var i=0;i<(trainerInv[player1].deck.length-player1retire.length);i++)
							player1ball=player1ball+"○";
						for(var i=0;i<player1retire.length;i++)
							player1ball=player1ball+"●";
						for(var i=0;i<(pokInv[player2].deck.length-player2retire.length);i++)
							player2ball=player2ball+"○";
						for(var i=0;i<player2retire.length;i++)
							player2ball=player2ball+"●";
						java.lang.Thread.sleep(2000);
						replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
						trainerpoknum=trainerpoknum+1;
						player1pok=trainerInv[player1].deck[trainerpoknum-1];
						//체육관 관장 포켓몬의 스텟은 여기서 자동 계산
						if(player1pok.formchange!=0)
						{
							player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"hp")*player1pok.level/50);
							player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"atk")*player1pok.level/50);
							player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"def")*player1pok.level/50);
							player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"spd")*player1pok.level/50);
						}
						else{
						player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name,"hp")*player1pok.level/50);
						player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name,"atk")*player1pok.level/50);
						player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name,"def")*player1pok.level/50);
						player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name,"spd")*player1pok.level/50);
						}
						//
						player1maxhp=player1pok.hp;
						var player1skillsarr=[];
						for(var j=0;j<player1pok.skills.length;j++)
							player1skillsarr.push(player1pok.skills[j]);
						for(var j=0;j<player1pok.skillslocked.length;j++)
							player1skillsarr.push(player1pok.skillslocked[j]);
						for(var i=0;i<player1skillsarr.length;i++)
						{
							try{
								player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
							}
							catch(e){
								player1pp.push(1);
							}
						}
						
					}
				}
			}while(player1retire.length!=trainerInv[player1].deck.length&&player2pok.hp>0);
			
			if(player1retire.length==trainerInv[player1].deck.length)
			{
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player2]=0;
					weather=0;
					gymnum=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.win=pokUser[player2].battlecount.win+1;
					pokUser[player2].badge=pokUser[player2].badge+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					newChampion(player2,replier);
					updateribbon(replier,player2);
					player1="";
					player2="";

			}
			else
			{
				player2retire.push(pokInv[player2].deck.indexOf(player2pok));
				let lt=player2pok.name.length-1;
				replier.reply("@"+player2+"\n"+player2pok.name+(player2pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
				java.lang.Thread.sleep(1000);
				if(player2retire.length==pokInv[player2].deck.length)
				{
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player1]=0;
					advOn[player2]=0;
					weather=0;
					gymnum=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.lose=pokUser[player2].battlecount.lose+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n챔피언과의 배틀에서 패배했어요.\n도전에 실패했어요.");
					player1="";
					player2="";
				}
				else
				{
					nextpokchoose=2;
					var res="";
					for(var i=0;i<pokInv[player2].deck.length;i++)
					{
						res=res+(i+1)+". ";
						if(player2retire.includes(i)) res=res+"(기절) ";
						res=res+"Lv."+pokInv[player2].deck[i].level+" "+pokInv[player2].deck[i].name+"\n";
					}
					replier.reply("@"+player2+"\n다음으로 내보낼 포켓몬을 선택해 주세요.\n("+cmds.battlenext+" (숫자) 명령어로 선택)\n\n"+res);
				}
			}
		}
		else
		{
			replier.reply("@"+sender+"\n이미 진행 중인 배틀이 있거나 체육관 또는 챔피언에 도전중인 유저가 있어요.\n\n현재 진행 중인 배틀\n"+player1+" VS "+player2);
		}
	}
}

if(msg.split(" ")[0]==cmds.battlenext&&isbattle!=0)//배틀 다음포켓몬
{
	
	if(advOn[sender]==undefined) advOn[sender]=0;
	if(advOn[sender]!=3){
        replier.reply('@'+sender+'\n탐험 중에는 배틀에 참가할 수 없어요.');
        return;
    }
	if(pokUser[sender].restOn.on){
        replier.reply('@'+sender+' \n휴식 중입니다.\n"'+cmds.rest+'" 을 입력해서 휴식을 종료하세요.');
        return;
    }
	if(nextpokchoose!=0){
		var nextpoknum=msg.split(" ")[1];
		if(player1==sender&&nextpokchoose==1&&isbattle==1){
			if(0<nextpoknum&&nextpoknum<(pokInv[player1].deck.length+1)&&msg.indexOf(".")==(-1)){
				if(player1retire.includes(nextpoknum-1))
				{
					var res="";
						for(var i=0;i<pokInv[player1].deck.length;i++)
						{
							res=res+(i+1)+". ";
							if(player1retire.includes(i)) res=res+"(기절) ";
							res=res+"Lv."+pokInv[player1].deck[i].level+" "+pokInv[player1].deck[i].name+"\n";
						}
						replier.reply("@"+player1+"\n해당 포켓몬은 기절해서 나갈 수 없어요.\n다른 포켓몬을 선택해 주세요.\n("+cmds.battlenext+" (숫자) 명령어로 선택)\n\n"+res);
						return;
				}
				else
				{
					player1pok={};
					player1pp=[];
					player1maxhp=0;
					player1ball="";
					player2ball="";
					for(var i=0;i<(pokInv[player1].deck.length-player1retire.length);i++)
						player1ball=player1ball+"○";
					for(var i=0;i<player1retire.length;i++)
						player1ball=player1ball+"●";
					for(var i=0;i<(pokInv[player2].deck.length-player2retire.length);i++)
						player2ball=player2ball+"○";
					for(var i=0;i<player2retire.length;i++)
						player2ball=player2ball+"●";
					java.lang.Thread.sleep(2000);
					replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
					player1pok=pokInv[player1].deck[nextpoknum-1];
					player1maxhp=player1pok.hp;
					var player1skillsarr=[];
					for(var j=0;j<player1pok.skills.length;j++)
						player1skillsarr.push(player1pok.skills[j]);
					for(var j=0;j<player1pok.skillslocked.length;j++)
						player1skillsarr.push(player1pok.skillslocked[j]);
					if(player1pok.name=="메타몽"){
						player1pok.name=player2pok.name;
						player1pok.hp=player2maxhp;
						player1pok.skills=player2pok.skills;
						player1pok.skillslocked=player2pok.skillslocked;
						player1pok.atk=player2pok.atk;
						player1pok.def=player2pok.def;
						player1pok.spd=player2pok.spd;
						player1skillsarr=player2skillsarr;
						player1maxhp=player2maxhp;
						replier.reply("@"+player1+"\n메타몽은 "+player1pok.name+"의 모습으로 변신했어요!");
					}
					if(pokUser[player1].activecollection.includes(8))
						player1pok.spd=player1pok.spd+pokUser[player1].collectionlev*5;
					if(pokUser[player1].activecollection.includes(11))
						player1pok.def=player1pok.def+pokUser[player1].collectionlev*30;
					for(var i=0;i<player1skillsarr.length;i++)
						{
							try{
								player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
							}
							catch(e){
								player1pp.push(1);
							}
						}
					
				}
			}else{
				replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
				return;
			}
		}
		else if(player2==sender&&nextpokchoose==2){
			if(0<nextpoknum&&nextpoknum<(pokInv[player2].deck.length+1)&&msg.indexOf(".")==(-1)){
				if(player2retire.includes(nextpoknum-1))
				{
					var res="";
						for(var i=0;i<pokInv[player2].deck.length;i++)
						{
							res=res+(i+1)+". ";
							if(player2retire.includes(i)) res=res+"(기절) ";
							res=res+"Lv."+pokInv[player2].deck[i].level+" "+pokInv[player2].deck[i].name+"\n";
						}
						replier.reply("@"+player2+"\n해당 포켓몬은 기절해서 나갈 수 없어요.\n다른 포켓몬을 선택해 주세요.\n("+cmds.battlenext+" (숫자) 명령어로 선택)\n\n"+res);
						return;
				}
				else
				{
					player2pok={};
					player2pp=[];
					player2maxhp=0;
					player1ball="";
					player2ball="";
					if(isbattle==1){
						for(var i=0;i<(pokInv[player1].deck.length-player1retire.length);i++)
							player1ball=player1ball+"○";
						for(var i=0;i<player1retire.length;i++)
							player1ball=player1ball+"●";
					}
					else{
						for(var i=0;i<(trainerInv[player1].deck.length-player1retire.length);i++)
							player1ball=player1ball+"○";
						for(var i=0;i<player1retire.length;i++)
							player1ball=player1ball+"●";
					}
					for(var i=0;i<(pokInv[player2].deck.length-player2retire.length);i++)
						player2ball=player2ball+"○";
					for(var i=0;i<player2retire.length;i++)
						player2ball=player2ball+"●";
					java.lang.Thread.sleep(1000);
					replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
					player2pok=pokInv[player2].deck[nextpoknum-1];
					player2maxhp=player2pok.hp;
					var player2skillsarr=[];
					for(var j=0;j<player2pok.skills.length;j++)
						player2skillsarr.push(player2pok.skills[j]);
					for(var j=0;j<player2pok.skillslocked.length;j++)
						player2skillsarr.push(player2pok.skillslocked[j]);
					if(player2pok.name=="메타몽"){
						player2pok.name=player1pok.name;
						player2pok.hp=player1maxhp;
						player2pok.skills=player1pok.skills;
						player2pok.skillslocked=player1pok.skillslocked;
						player2pok.atk=player1pok.atk;
						player2pok.def=player1pok.def;
						player2pok.spd=player1pok.spd;
						player2skillsarr=player1skillsarr;
						player2maxhp=player1maxhp;
						replier.reply("@"+player2+"\n메타몽은 "+player2pok.name+"의 모습으로 변신했어요!");
					}
					if(Number(pokUser[player2].activecollection.includes(8)))
						player2pok.spd=player2pok.spd+pokUser[player2].collectionlev*5;
					if(Number(pokUser[player2].activecollection.includes(11)))
						player2pok.def=player2pok.def+pokUser[player2].collectionlev*30;
					for(var i=0;i<player2skillsarr.length;i++)
					{
						try{
							player2pp.push(Number(read("기술/"+player2skillsarr[i]),"pp"));
						}
						catch(e){
							player2pp.push(1);
						}
					}
					
				}
			}else{
				replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
				return;
			}
		}
		else return;
		if(isbattle==1){
			printbattlekakaolink(room,replier);
			do{
					battleturn(room,replier);
				}while(player1pok.hp>0&&player2pok.hp>0);
			replier.reply("배틀 결과\n"+"\u200b".repeat(500)+"\n"+battleres);
			battleres="";
			if(player1pok.hp<1)
			{
					player1retire.push(pokInv[player1].deck.indexOf(player1pok));
					let lt=player1pok.name.length-1;
					replier.reply("@"+player1+"\n"+player1pok.name+(player1pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
					java.lang.Thread.sleep(1000);
					if(player1retire.length==pokInv[player1].deck.length)
					{
						var reward=Math.ceil(pokUser[player1].gold/10);
						if(Number(pokUser[player2].activecollection.includes(10)))
							reward=reward*(pokUser[player2].collectionlev+1);
						isbattle=0;
						player1retire=[];
						player2retire=[];
						player1ball="";
						player2ball="";
						player1pok={};
						player2pok={};
						player1pp=[];
						player2pp=[];
						isplayer1bind=0;
						isplayer2bind=0;
						isnpcbattle=0;
						player1maxhp=0;
						player2maxhp=0;
						weather=0;
						nextpokchoose=0;
						battleres="";
						advOn[player1]=0;
						advOn[player2]=0;
						pokUser[player1].gold=pokUser[player1].gold-reward;
						pokUser[player2].gold=pokUser[player2].gold+reward;
						pokUser[player1].battlecount.total=pokUser[player1].battlecount.total+1;
						pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
						pokUser[player1].battlecount.lose=pokUser[player1].battlecount.lose+1;
						pokUser[player2].battlecount.win=pokUser[player2].battlecount.win+1;
						
						let pokRank=JSON.parse(FileStream.read(pathRank));
						if(pokRank==null){
							let data=[];
							FileStream.write(pathRank, JSON.stringify(data));
							pokRank=JSON.parse(FileStream.read(pathRank));
						}
						if(!pokRank.some(e=>e.name==pokUser[player1].name)){
							let ruser={
								'name':pokUser[player1].name,
								'rank':pokUser[player1].rank,
								'battle':{'total':0,'win':0}
							};
							ruser.battle.total=pokUser[player1].battlecount.total;
							ruser.battle.win=pokUser[player1].battlecount.win;
							pokRank.push(ruser);
							FileStream.write(pathRank, JSON.stringify(pokRank));
						}
						else{
							let n=pokRank.findIndex(e=>e.name==pokUser[player1].name);
							pokRank[n].rank=pokUser[player1].rank;
							if(Number(pokRank[n].battle.total)<pokUser[player1].battlecount.total)
								pokRank[n].battle.total=pokUser[player1].battlecount.total;
							if(Number(pokRank[n].battle.win)<pokUser[player1].battlecount.win)
								pokRank[n].battle.win=pokUser[player1].battlecount.win;
							FileStream.write(pathRank, JSON.stringify(pokRank));
						}
						if(!pokRank.some(e=>e.name==pokUser[player2].name)){
							let ruser={
								'name':pokUser[player2].name,
								'rank':pokUser[player2].rank,
								'battle':{'total':0,'win':0}
							};
							ruser.battle.total=pokUser[player2].battlecount.total;
							ruser.battle.win=pokUser[player2].battlecount.win;
							pokRank.push(ruser);
							FileStream.write(pathRank, JSON.stringify(pokRank));
						}
						else{
							let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
							pokRank[n].rank=pokUser[player2].rank;
							if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
								pokRank[n].battle.total=pokUser[player2].battlecount.total;
							if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
								pokRank[n].battle.win=pokUser[player2].battlecount.win;
							FileStream.write(pathRank, JSON.stringify(pokRank));
						}
						FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player1+'.json', JSON.stringify(pokUser[player1]));
						FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
						replier.reply("@"+player1+"\n배틀에서 패배했어요.\n"+reward.comma()+"원을 잃었어요.\n보유금액: "+pokUser[player1].gold.comma()+"원");
						replier.reply("@"+player2+"\n배틀에서 승리했어요.\n상금으로 "+reward.comma()+"원을 얻었어요.\n보유금액: "+pokUser[player2].gold.comma()+"원");
						updateribbon(replier,player1);
						updateribbon(replier,player2);
						player1="";
						player2="";
					}
					else
					{
						nextpokchoose=1;
						var res="";
						for(var i=0;i<pokInv[player1].deck.length;i++)
						{
							res=res+(i+1)+". ";
							if(player1retire.includes(i)) res=res+"(기절) ";
							res=res+"Lv."+pokInv[player1].deck[i].level+" "+pokInv[player1].deck[i].name+"\n";
						}
						replier.reply("@"+player1+"\n다음으로 내보낼 포켓몬을 선택해 주세요.\n("+cmds.battlenext+" (숫자) 명령어로 선택)\n\n"+res);
					}
			}
			else if(player2pok.hp<1)
			{
					player2retire.push(pokInv[player2].deck.indexOf(player2pok));
					let lt=player2pok.name.length-1;
					replier.reply("@"+player2+"\n"+player2pok.name+(player2pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
					java.lang.Thread.sleep(1000);
					if(player2retire.length==pokInv[player2].deck.length)
					{
						var reward=Math.ceil(pokUser[player2].gold/10);
						if(pokUser[player1].activecollection.includes(10))
							reward=reward*(pokUser[player1].collectionlev+1);
						isbattle=0;
						player1retire=[];
						player2retire=[];
						player1ball="";
						player2ball="";
						player1pok={};
						player2pok={};
						player1pp=[];
						player2pp=[];
						isplayer1bind=0;
						isplayer2bind=0;
						isnpcbattle=0;
						weather=0;
						player1maxhp=0;
						player2maxhp=0;
						nextpokchoose=0;
						battleres="";
						advOn[player1]=0;
						advOn[player2]=0;
						pokUser[player2].gold=pokUser[player2].gold-reward;
						pokUser[player1].gold=pokUser[player1].gold+reward;
						pokUser[player1].battlecount.total=pokUser[player1].battlecount.total+1;
						pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
						pokUser[player2].battlecount.lose=pokUser[player2].battlecount.lose+1;
						pokUser[player1].battlecount.win=pokUser[player1].battlecount.win+1;
						let pokRank=JSON.parse(FileStream.read(pathRank));
						if(pokRank==null){
							let data=[];
							FileStream.write(pathRank, JSON.stringify(data));
							pokRank=JSON.parse(FileStream.read(pathRank));
						}
						if(!pokRank.some(e=>e.name==pokUser[player1].name)){
							let ruser={
								'name':pokUser[player1].name,
								'rank':pokUser[player1].rank,
								'battle':{'total':0,'win':0}
							};
							ruser.battle.total=pokUser[player1].battlecount.total;
							ruser.battle.win=pokUser[player1].battlecount.win;
							pokRank.push(ruser);
							FileStream.write(pathRank, JSON.stringify(pokRank));
						}
						else{
							let n=pokRank.findIndex(e=>e.name==pokUser[player1].name);
							pokRank[n].rank=pokUser[player1].rank;
							if(Number(pokRank[n].battle.total)<pokUser[player1].battlecount.total)
								pokRank[n].battle.total=pokUser[player1].battlecount.total;
							if(Number(pokRank[n].battle.win)<pokUser[player1].battlecount.win)
								pokRank[n].battle.win=pokUser[player1].battlecount.win;
							FileStream.write(pathRank, JSON.stringify(pokRank));
						}
						if(!pokRank.some(e=>e.name==pokUser[player2].name)){
							let ruser={
								'name':pokUser[player2].name,
								'rank':pokUser[player2].rank,
								'battle':{'total':0,'win':0}
							};
							ruser.battle.total=pokUser[player2].battlecount.total;
							ruser.battle.win=pokUser[player2].battlecount.win;
							pokRank.push(ruser);
							FileStream.write(pathRank, JSON.stringify(pokRank));
						}
						else{
							let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
							pokRank[n].rank=pokUser[player2].rank;
							if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
								pokRank[n].battle.total=pokUser[player2].battlecount.total;
							if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
								pokRank[n].battle.win=pokUser[player2].battlecount.win;
							FileStream.write(pathRank, JSON.stringify(pokRank));
						}
						FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player1+'.json', JSON.stringify(pokUser[player1]));
						FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
						replier.reply("@"+player2+"\n배틀에서 패배했어요.\n"+reward.comma()+"원을 잃었어요.\n보유금액: "+pokUser[player2].gold.comma()+"원");
						replier.reply("@"+player1+"\n배틀에서 승리했어요.\n상금으로 "+reward.comma()+"원을 얻었어요.\n보유금액: "+pokUser[player1].gold.comma()+"원");
						updateribbon(replier,player1);
						updateribbon(replier,player2);
						player1="";
						player2="";
					}
					else
					{
						nextpokchoose=2;
						var res="";
						for(var i=0;i<pokInv[player2].deck.length;i++)
						{
							res=res+(i+1)+". ";
							if(player2retire.includes(i)) res=res+"(기절) ";
							res=res+"Lv."+pokInv[player2].deck[i].level+" "+pokInv[player2].deck[i].name+"\n";
						}
						replier.reply("@"+player2+"\n다음으로 내보낼 포켓몬을 선택해 주세요.\n("+cmds.battlenext+" (숫자) 명령어로 선택)\n\n"+res);
					}
			}
		}
		else if(isbattle==3){
			do{
				printbattlekakaolink(room,replier);
				do{
					battleturn(room,replier);
				}while(player1pok.hp>0&&player2pok.hp>0);
				replier.reply("배틀 결과\n"+"\u200b".repeat(500)+"\n"+battleres);
				battleres="";
				if(player1pok.hp<1){
					player1retire.push(trainerInv[player1].deck.indexOf(player1pok));
					let lt=player1pok.name.length-1;
					replier.reply("챔피언의 "+player1pok.name+(player1pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
					java.lang.Thread.sleep(1000);
					if(player1retire.length!=trainerInv[player1].deck.length){
						replier.reply("챔피언이 다음 포켓몬을 배틀에 내보냅니다.");
						player1pok={};
						player1pp=[];
						player1maxhp=0;
						player1ball="";
						player2ball="";
						for(var i=0;i<(trainerInv[player1].deck.length-player1retire.length);i++)
							player1ball=player1ball+"○";
						for(var i=0;i<player1retire.length;i++)
							player1ball=player1ball+"●";
						for(var i=0;i<(pokInv[player2].deck.length-player2retire.length);i++)
							player2ball=player2ball+"○";
						for(var i=0;i<player2retire.length;i++)
							player2ball=player2ball+"●";
						java.lang.Thread.sleep(2000);
						replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
						trainerpoknum=trainerpoknum+1;
						player1pok=trainerInv[player1].deck[trainerpoknum-1];
						//챔피언 포켓몬의 스텟은 여기서 자동 계산
						if(player1pok.formchange!=0)
						{
							player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"hp")*player1pok.level/50);
							player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"atk")*player1pok.level/50);
							player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"def")*player1pok.level/50);
							player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"spd")*player1pok.level/50);
						}
						else{
						player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name,"hp")*player1pok.level/50);
						player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name,"atk")*player1pok.level/50);
						player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name,"def")*player1pok.level/50);
						player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name,"spd")*player1pok.level/50);
						}
						//
						player1maxhp=player1pok.hp;
						var player1skillsarr=player1pok.skills;
						for(var j=0;j<player1pok.skillslocked.length;j++)
							player1skillsarr.push(player1pok.skillslocked[j]);
						for(var i=0;i<player1skillsarr.length;i++)
						{
							try{
								player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
							}
							catch(e){
								player1pp.push(1);
							}
						}
						
					}
				}
			}while(player1retire.length!=trainerInv[player1].deck.length&&player2pok.hp>0);
			
			if(player1retire.length==trainerInv[player1].deck.length)
			{
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player2]=0;
					weather=0;
					gymnum=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.win=pokUser[player2].battlecount.win+1;
					pokUser[player2].badge=pokUser[player2].badge+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					newChampion(player2,replier);
					updateribbon(replier,player2);
					player1="";
					player2="";

			}
			else
			{
				player2retire.push(pokInv[player2].deck.indexOf(player2pok));
				let lt=player2pok.name.length-1;
				replier.reply("@"+player2+"\n"+player2pok.name+(player2pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
				java.lang.Thread.sleep(1000);
				if(player2retire.length==pokInv[player2].deck.length)
				{
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player1]=0;
					advOn[player2]=0;
					weather=0;
					gymnum=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.lose=pokUser[player2].battlecount.lose+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n챔피언과의 배틀에서 패배했어요.\n도전에 실패했어요.");
					player1="";
					player2="";
				}
				else
				{
					nextpokchoose=2;
					var res="";
					for(var i=0;i<pokInv[player2].deck.length;i++)
					{
						res=res+(i+1)+". ";
						if(player2retire.includes(i)) res=res+"(기절) ";
						res=res+"Lv."+pokInv[player2].deck[i].level+" "+pokInv[player2].deck[i].name+"\n";
					}
					replier.reply("@"+player2+"\n다음으로 내보낼 포켓몬을 선택해 주세요.\n("+cmds.battlenext+" (숫자) 명령어로 선택)\n\n"+res);
				}
			}
		}
		else if(isbattle==4){
			do{
				printbattlekakaolink(room,replier);
				do{
					battleturn(room,replier);
				}while(player1pok.hp>0&&player2pok.hp>0);
				replier.reply("배틀 결과\n"+"\u200b".repeat(500)+"\n"+battleres);
				battleres="";
				if(player1pok.hp<1){
					player1retire.push(trainerInv[player1].deck.indexOf(player1pok));
					let lt=player1pok.name.length-1;
					replier.reply("상대 트레이너의 "+player1pok.name+(player1pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
					java.lang.Thread.sleep(1000);
					if(player1retire.length!=trainerInv[player1].deck.length){
						replier.reply("상대 트레이너가 다음 포켓몬을 배틀에 내보냅니다.");
						player1pok={};
						player1pp=[];
						player1maxhp=0;
						player1ball="";
						player2ball="";
						for(var i=0;i<(trainerInv[player1].deck.length-player1retire.length);i++)
							player1ball=player1ball+"○";
						for(var i=0;i<player1retire.length;i++)
							player1ball=player1ball+"●";
						for(var i=0;i<(pokInv[player2].deck.length-player2retire.length);i++)
							player2ball=player2ball+"○";
						for(var i=0;i<player2retire.length;i++)
							player2ball=player2ball+"●";
						java.lang.Thread.sleep(2000);
						replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
						trainerpoknum=trainerpoknum+1;
						player1pok=trainerInv[player1].deck[trainerpoknum-1];
						//체육관 관장 포켓몬의 스텟은 여기서 자동 계산
						if(player1pok.formchange!=0)
						{
							player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"hp")*player1pok.level/50);
							player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"atk")*player1pok.level/50);
							player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"def")*player1pok.level/50);
							player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"spd")*player1pok.level/50);
						}
						else{
						player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name,"hp")*player1pok.level/50);
						player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name,"atk")*player1pok.level/50);
						player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name,"def")*player1pok.level/50);
						player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name,"spd")*player1pok.level/50);
						}
						//
						player1maxhp=player1pok.hp;
						var player1skillsarr=player1pok.skills;
						for(var j=0;j<player1pok.skillslocked.length;j++)
							player1skillsarr.push(player1pok.skillslocked[j]);
						for(var i=0;i<player1skillsarr.length;i++)
						{
							try{
								player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
							}
							catch(e){
								player1pp.push(1);
							}
						}
						
					}
				}
			}while(player1retire.length!=trainerInv[player1].deck.length&&player2pok.hp>0);
			
			if(player1retire.length==trainerInv[player1].deck.length)
			{
					var reward=battletowerlev[player2]*battletowerlev[player2]*10000;
					reward=reward*setting.eventp.goldX;
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player2]=0;
					weather=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].gold=pokUser[player2].gold+reward;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.win=pokUser[player2].battlecount.win+1;
					battletowerplayers[player2]++;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n배틀타워에서 승리했어요.\n상금으로 "+reward.comma()+"원을 얻었어요.\n보유금액: "+pokUser[player2].gold.comma()+"원");
					player1="";
					player2="";

			}
			else
			{
				player2retire.push(pokInv[player2].deck.indexOf(player2pok));
				let lt=player2pok.name.length-1;
				replier.reply("@"+player2+"\n"+player2pok.name+(player2pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
				java.lang.Thread.sleep(1000);
				if(player2retire.length==pokInv[player2].deck.length)
				{
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player1]=0;
					advOn[player2]=0;
					weather=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.lose=pokUser[player2].battlecount.lose+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n상대 트레이너와의 배틀에서 패배했어요.\n도전에 실패했어요.");
					player1="";
					player2="";
				}
				else
				{
					nextpokchoose=2;
					var res="";
					for(var i=0;i<pokInv[player2].deck.length;i++)
					{
						res=res+(i+1)+". ";
						if(player2retire.includes(i)) res=res+"(기절) ";
						res=res+"Lv."+pokInv[player2].deck[i].level+" "+pokInv[player2].deck[i].name+"\n";
					}
					replier.reply("@"+player2+"\n다음으로 내보낼 포켓몬을 선택해 주세요.\n("+cmds.battlenext+" (숫자) 명령어로 선택)\n\n"+res);
				}
			}
		}
		//
		else{
			do{
				printbattlekakaolink(room,replier);
				do{
					battleturn(room,replier);
				}while(player1pok.hp>0&&player2pok.hp>0);
				replier.reply("배틀 결과\n"+"\u200b".repeat(500)+"\n"+battleres);
				battleres="";
				if(player1pok.hp<1){
					player1retire.push(trainerInv[player1].deck.indexOf(player1pok));
					let lt=player1pok.name.length-1;
					replier.reply("체육관 관장의 "+player1pok.name+(player1pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
					java.lang.Thread.sleep(1000);
					if(player1retire.length!=trainerInv[player1].deck.length){
						replier.reply("체육관 관장이 다음 포켓몬을 배틀에 내보냅니다.");
						player1pok={};
						player1pp=[];
						player1maxhp=0;
						player1ball="";
						player2ball="";
						for(var i=0;i<(trainerInv[player1].deck.length-player1retire.length);i++)
							player1ball=player1ball+"○";
						for(var i=0;i<player1retire.length;i++)
							player1ball=player1ball+"●";
						for(var i=0;i<(pokInv[player2].deck.length-player2retire.length);i++)
							player2ball=player2ball+"○";
						for(var i=0;i<player2retire.length;i++)
							player2ball=player2ball+"●";
						java.lang.Thread.sleep(2000);
						replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
						trainerpoknum=trainerpoknum+1;
						player1pok=trainerInv[player1].deck[trainerpoknum-1];
						//체육관 관장 포켓몬의 스텟은 여기서 자동 계산
						if(player1pok.formchange!=0)
						{
							player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"hp")*player1pok.level/50);
							player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"atk")*player1pok.level/50);
							player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"def")*player1pok.level/50);
							player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name+"_"+player1pok.formchange,"spd")*player1pok.level/50);
						}
						else{
						player1pok.hp=Math.ceil(read("포켓몬/"+player1pok.name,"hp")*player1pok.level/50);
						player1pok.atk=Math.ceil(read("포켓몬/"+player1pok.name,"atk")*player1pok.level/50);
						player1pok.def=Math.ceil(read("포켓몬/"+player1pok.name,"def")*player1pok.level/50);
						player1pok.spd=Math.ceil(read("포켓몬/"+player1pok.name,"spd")*player1pok.level/50);
						}
						//
						player1maxhp=player1pok.hp;
						var player1skillsarr=player1pok.skills;
						for(var j=0;j<player1pok.skillslocked.length;j++)
							player1skillsarr.push(player1pok.skillslocked[j]);
						for(var i=0;i<player1skillsarr.length;i++)
						{
							try{
								player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
							}
							catch(e){
								player1pp.push(1);
							}
						}
						
					}
				}
			}while(player1retire.length!=trainerInv[player1].deck.length&&player2pok.hp>0);
			
			if(player1retire.length==trainerInv[player1].deck.length)
			{
					var reward=2000000*(gymnum+1)*(gymnum+1);
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player2]=0;
					weather=0;
					gymnum=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].gold=pokUser[player2].gold+reward;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.win=pokUser[player2].battlecount.win+1;
					pokUser[player2].badge=pokUser[player2].badge+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n체육관 관장에게서 승리하여 뱃지를 획득했어요.\n상금으로 "+reward.comma()+"원을 얻었어요.\n보유금액: "+pokUser[player2].gold.comma()+"원\n현재 뱃지 개수: "+pokUser[player2].badge+"개");
					player1="";
					player2="";

			}
			else
			{
				player2retire.push(pokInv[player2].deck.indexOf(player2pok));
				let lt=player2pok.name.length-1;
				replier.reply("@"+player2+"\n"+player2pok.name+(player2pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
				java.lang.Thread.sleep(1000);
				if(player2retire.length==pokInv[player2].deck.length)
				{
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player1]=0;
					advOn[player2]=0;
					weather=0;
					gymnum=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.lose=pokUser[player2].battlecount.lose+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n체육관 관장과의 배틀에서 패배했어요.\n도전에 실패했어요.\n현재 뱃지 개수: "+pokUser[player2].badge+"개");
					player1="";
					player2="";
				}
				else
				{
					nextpokchoose=2;
					var res="";
					for(var i=0;i<pokInv[player2].deck.length;i++)
					{
						res=res+(i+1)+". ";
						if(player2retire.includes(i)) res=res+"(기절) ";
						res=res+"Lv."+pokInv[player2].deck[i].level+" "+pokInv[player2].deck[i].name+"\n";
					}
					replier.reply("@"+player2+"\n다음으로 내보낼 포켓몬을 선택해 주세요.\n("+cmds.battlenext+" (숫자) 명령어로 선택)\n\n"+res);
				}
			}
		}
		
	}
}

if(msg==cmds.giveup)//배틀 기권
{
	if(isbattle!=0){
		if(sender==player1&&isbattle==1)
			{
				replier.reply(player1+"님이 배틀을 기권했어요.");
				java.lang.Thread.sleep(1000);
				var reward=Math.ceil(pokUser[player1].gold/10);
				if(Number(pokUser[player2].activecollection.includes(10)))
					reward=reward*(pokUser[player2].collectionlev+1);
				isbattle=0;
				player1retire=[];
				player2retire=[];
				player1ball="";
				player2ball="";
				player1pok={};
				player2pok={};
				player1pp=[];
				player2pp=[];
				isplayer1bind=0;
				isplayer2bind=0;
				isnpcbattle=0;
				player1maxhp=0;
				player2maxhp=0;
				nextpokchoose=0;
				battleres="";
				advOn[player1]=0;
				advOn[player2]=0;
				pokUser[player1].gold=pokUser[player1].gold-reward;
				pokUser[player2].gold=pokUser[player2].gold+reward;
				pokUser[player1].battlecount.total=pokUser[player1].battlecount.total+1;
				pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
				pokUser[player1].battlecount.lose=pokUser[player1].battlecount.lose+1;
				pokUser[player2].battlecount.win=pokUser[player2].battlecount.win+1;
					
				let pokRank=JSON.parse(FileStream.read(pathRank));
				if(pokRank==null){
					let data=[];
					FileStream.write(pathRank, JSON.stringify(data));
					pokRank=JSON.parse(FileStream.read(pathRank));
				}
				if(!pokRank.some(e=>e.name==pokUser[player1].name)){
					let ruser={
						'name':pokUser[player1].name,
						'rank':pokUser[player1].rank,
						'battle':{'total':0,'win':0}
					};
					ruser.battle.total=pokUser[player1].battlecount.total;
					ruser.battle.win=pokUser[player1].battlecount.win;
					pokRank.push(ruser);
					FileStream.write(pathRank, JSON.stringify(pokRank));
				}
				else{
					let n=pokRank.findIndex(e=>e.name==pokUser[player1].name);
					pokRank[n].rank=pokUser[player1].rank;
					if(Number(pokRank[n].battle.total)<pokUser[player1].battlecount.total)
						pokRank[n].battle.total=pokUser[player1].battlecount.total;
					if(Number(pokRank[n].battle.win)<pokUser[player1].battlecount.win)
						pokRank[n].battle.win=pokUser[player1].battlecount.win;
					FileStream.write(pathRank, JSON.stringify(pokRank));
				}
				if(!pokRank.some(e=>e.name==pokUser[player2].name)){
					let ruser={
						'name':pokUser[player2].name,
						'rank':pokUser[player2].rank,
						'battle':{'total':0,'win':0}
					};
					ruser.battle.total=pokUser[player2].battlecount.total;
					ruser.battle.win=pokUser[player2].battlecount.win;
					pokRank.push(ruser);
					FileStream.write(pathRank, JSON.stringify(pokRank));
				}
				else{
					let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
					pokRank[n].rank=pokUser[player2].rank;
					if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
						pokRank[n].battle.total=pokUser[player2].battlecount.total;
					if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
						pokRank[n].battle.win=pokUser[player2].battlecount.win;
					FileStream.write(pathRank, JSON.stringify(pokRank));
				}
					
				FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player1+'.json', JSON.stringify(pokUser[player1]));
				FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
				replier.reply("@"+player1+"\n배틀에서 패배했어요.\n"+reward.comma()+"원을 잃었어요.\n보유금액: "+pokUser[player1].gold.comma()+"원");
				replier.reply("@"+player2+"\n배틀에서 승리했어요.\n상금으로 "+reward.comma()+"원을 얻었어요.\n보유금액: "+pokUser[player2].gold.comma()+"원");
				updateribbon(replier,player1);
				updateribbon(replier,player2);
				player1="";
				player2="";
			}

			else if(sender==player2)
			{
					replier.reply(player2+"님이 배틀을 기권했어요.");
					java.lang.Thread.sleep(1000);
					if(isbattle==1){
						var reward=Math.ceil(pokUser[player2].gold/10);
						if(pokUser[player1].activecollection.includes(10))
							reward=reward*(pokUser[player1].collectionlev+1);
						isbattle=0;
						player1retire=[];
						player2retire=[];
						player1ball="";
						player2ball="";
						player1pok={};
						player2pok={};
						player1pp=[];
						player2pp=[];
						isplayer1bind=0;
						isplayer2bind=0;
						isnpcbattle=0;
						player1maxhp=0;
						player2maxhp=0;
						nextpokchoose=0;
						battleres="";
						advOn[player1]=0;
						advOn[player2]=0;
						pokUser[player2].gold=pokUser[player2].gold-reward;
						pokUser[player1].gold=pokUser[player1].gold+reward;
						pokUser[player1].battlecount.total=pokUser[player1].battlecount.total+1;
						pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
						pokUser[player2].battlecount.lose=pokUser[player2].battlecount.lose+1;
						pokUser[player1].battlecount.win=pokUser[player1].battlecount.win+1;
						let pokRank=JSON.parse(FileStream.read(pathRank));
						if(pokRank==null){
							let data=[];
							FileStream.write(pathRank, JSON.stringify(data));
							pokRank=JSON.parse(FileStream.read(pathRank));
						}
						if(!pokRank.some(e=>e.name==pokUser[player1].name)){
							let ruser={
								'name':pokUser[player1].name,
								'rank':pokUser[player1].rank,
								'battle':{'total':0,'win':0}
							};
							ruser.battle.total=pokUser[player1].battlecount.total;
							ruser.battle.win=pokUser[player1].battlecount.win;
							pokRank.push(ruser);
							FileStream.write(pathRank, JSON.stringify(pokRank));
						}
						else{
							let n=pokRank.findIndex(e=>e.name==pokUser[player1].name);
							pokRank[n].rank=pokUser[player1].rank;
							if(Number(pokRank[n].battle.total)<pokUser[player1].battlecount.total)
								pokRank[n].battle.total=pokUser[player1].battlecount.total;
							if(Number(pokRank[n].battle.win)<pokUser[player1].battlecount.win)
								pokRank[n].battle.win=pokUser[player1].battlecount.win;
							FileStream.write(pathRank, JSON.stringify(pokRank));
						}
						if(!pokRank.some(e=>e.name==pokUser[player2].name)){
							let ruser={
								'name':pokUser[player2].name,
								'rank':pokUser[player2].rank,
								'battle':{'total':0,'win':0}
							};
							ruser.battle.total=pokUser[player2].battlecount.total;
							ruser.battle.win=pokUser[player2].battlecount.win;
							pokRank.push(ruser);
							FileStream.write(pathRank, JSON.stringify(pokRank));
						}
						else{
							let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
							pokRank[n].rank=pokUser[player2].rank;
							if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
								pokRank[n].battle.total=pokUser[player2].battlecount.total;
							if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
								pokRank[n].battle.win=pokUser[player2].battlecount.win;
							FileStream.write(pathRank, JSON.stringify(pokRank));
						}
						FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player1+'.json', JSON.stringify(pokUser[player1]));
						FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
						replier.reply("@"+player2+"\n배틀에서 패배했어요.\n"+reward.comma()+"원을 잃었어요.\n보유금액: "+pokUser[player2].gold.comma()+"원");
						replier.reply("@"+player1+"\n배틀에서 승리했어요.\n상금으로 "+reward.comma()+"원을 얻었어요.\n보유금액: "+pokUser[player1].gold.comma()+"원");
						updateribbon(replier,player1);
						updateribbon(replier,player2);
						player1="";
						player2="";
				}
				else if(isbattle==3){
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player1]=0;
					advOn[player2]=0;
					weather=0;
					gymnum=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.lose=pokUser[player2].battlecount.lose+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n챔피언과의 배틀에서 패배했어요.\n도전에 실패했어요.");
					player1="";
					player2="";
				}
				else if(isbattle==4){
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player1]=0;
					advOn[player2]=0;
					weather=0;
					gymnum=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.lose=pokUser[player2].battlecount.lose+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n상대 트레이너와의 배틀에서 패배했어요.\n배틀타워 도전에 실패했어요.");
					player1="";
					player2="";
				}
				else{
					isbattle=0;
					player1retire=[];
					player2retire=[];
					player1ball="";
					player2ball="";
					battleres="";
					player1pok={};
					player2pok={};
					player1pp=[];
					player2pp=[];
					isplayer1bind=0;
					isplayer2bind=0;
					isnpcbattle=0;
					player1maxhp=0;
					player2maxhp=0;
					nextpokchoose=0;
					advOn[player1]=0;
					advOn[player2]=0;
					weather=0;
					gymnum=0;
					trainerInv={};
					trainerpoknum=0;
					pokUser[player2].battlecount.total=pokUser[player2].battlecount.total+1;
					pokUser[player2].battlecount.lose=pokUser[player2].battlecount.lose+1;
					
					let pokRank=JSON.parse(FileStream.read(pathRank));
					if(pokRank==null){
						let data=[];
						FileStream.write(pathRank, JSON.stringify(data));
						pokRank=JSON.parse(FileStream.read(pathRank));
					}
					if(!pokRank.some(e=>e.name==pokUser[player2].name)){
						let ruser={
							'name':pokUser[player2].name,
							'rank':pokUser[player2].rank,
							'battle':{'total':0,'win':0}
						};
						ruser.battle.total=pokUser[player2].battlecount.total;
						ruser.battle.win=pokUser[player2].battlecount.win;
						pokRank.push(ruser);
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					else{
						let n=pokRank.findIndex(e=>e.name==pokUser[player2].name);
						pokRank[n].rank=pokUser[player2].rank;
						if(Number(pokRank[n].battle.total)<pokUser[player2].battlecount.total)
							pokRank[n].battle.total=pokUser[player2].battlecount.total;
						if(Number(pokRank[n].battle.win)<pokUser[player2].battlecount.win)
							pokRank[n].battle.win=pokUser[player2].battlecount.win;
						FileStream.write(pathRank, JSON.stringify(pokRank));
					}
					
					FileStream.write("sdcard/Devel/Pokemon/Data/player_"+player2+'.json', JSON.stringify(pokUser[player2]));
					replier.reply("@"+player2+"\n체육관 관장과의 배틀에서 패배했어요.\n도전에 실패했어요.\n현재 뱃지 개수: "+pokUser[player2].badge+"개");
					player1="";
					player2="";
				}
			}
			else replier.reply("@"+sender+"\n배틀 참가자가 아니에요.");
	}
}

if(msg==cmds.title)//트레이너등급
{
	var res=[];
	for(var i=0;i<(setting.rank.name.length-2);i++)
	{
		res.push(setting.rank.name[i]+"\n포켓몬 "+setting.rank.upif[i]+"마리 포획성공 시 등급업\n추가 탐험 성공률: +"+setting.rank.success[i]+"%\n추가 포획 성공률: +"+setting.rank.successcatch[i]+"%\n최대 체력: "+setting.rank.maxHp[i]+"\n탐험 소요시간 단축: -"+setting.rank.castT[i]+"%\n휴식시 "+(setting.rank.rest[i]/1000)+"초마다 체력 1 회복\n");
	}
	res.push(setting.rank.name[(setting.rank.name.length-2)]+"\n챔피언에게서 승리 시 등급업\n추가 탐험 성공률: +"+setting.rank.success[(setting.rank.name.length-2)]+"%\n추가 포획 성공률: +"+setting.rank.successcatch[(setting.rank.name.length-2)]+"%\n최대 체력: "+setting.rank.maxHp[(setting.rank.name.length-2)]+"\n탐험 소요시간 단축: -"+setting.rank.castT[(setting.rank.name.length-2)]+"%\n휴식시 "+(setting.rank.rest[(setting.rank.name.length-2)]/1000)+"초마다 체력 1 회복\n");
	replier.reply("포켓몬스터 게임 트레이너 등급"+"\u200b".repeat(500)+"\n"+res.join("\n"));
}

if(msg==cmds.ribbon)//리본종류
{
	var rewards=["-","-","-","포켓몬의 알 1개","2000만 원","전설의 포켓몬의 알 1개","3억 원","전설의 포켓몬의 알 3개","10억 원","Lv.200 네크로즈마","(미구현)","(미구현)"];
	var res=[];
	res.push("["+setting.ribbon.name[0]+"]\n배틀 0회 시 업그레이드\n추가 포획 성공률: +"+setting.ribbon.successcatch[0]+"%\n전설의 포켓몬 출현률: +"+setting.ribbon.g4[0]+"%\n레어 포켓몬 출현률: +"+setting.ribbon.g3[0]+"%\n볼 구매 할인: -"+setting.ribbon.balldc[0]+"%\n포켓몬 레벨업 및 스킬뽑기 할인: -"+setting.ribbon.upgradedc[0]+"%\n달성 보상: "+rewards[0]+"\n");
	for(var i=1;i<12;i++)
	{
		res.push("["+setting.ribbon.name[i]+"]\n배틀 "+setting.ribbon.upif[i-1]+"회 시 업그레이드\n추가 포획 성공률: +"+setting.ribbon.successcatch[i]+"%\n전설의 포켓몬 출현률: +"+setting.ribbon.g4[i]+"%\n레어 포켓몬 출현률: +"+setting.ribbon.g3[i]+"%\n볼 구매 할인: -"+setting.ribbon.balldc[i]+"%\n포켓몬 레벨업 및 스킬뽑기 할인: -"+setting.ribbon.upgradedc[i]+"%\n달성 보상: "+rewards[i]+"\n");
	}
	replier.reply("포켓몬스터 게임 리본 종류"+"\u200b".repeat(500)+"\n"+res.join("\n"));
}

if(msg==cmds.ballinfo)//볼강화 종류
{
	var res=[];
	for(var i=0;i<(ballArr.length-1);i++)
	{
		res.push("["+ballArr[i]+"]\n업그레이드 비용: "+setting.ballupPrice[i].comma()+"\n업그레이드에 필요한 포켓몬 발견 횟수: "+setting.ballupsucc[i]+"\n볼 1개당 가격: "+setting.ballPrice[i].comma()+"\n야생 포켓몬 레벨: "+(setting.minlevel+(i+1)*setting.balluplev+1)+"~"+(setting.minlevel+(i+1)*setting.balluplev+10)+"\n추가 포획률\n전설: +"+(setting.ballcatch[0]*i)+"%\n레어: +"+(setting.ballcatch[1]*i)+"%\n고급: +"+(setting.ballcatch[2]*i)+"%\n일반: +"+(setting.ballcatch[3]*i)+"%\n전설 포켓몬 출현률: +"+(setting.ballg4[i])+"%\n레어 포켓몬 출현률: +"+(setting.ballg3[i])+"%\n");
	}
	res.push("["+ballArr[(ballArr.length-1)]+"]\n업그레이드 비용: -\n업그레이드에 필요한 포켓몬 발견 횟수: -\n볼 1개당 가격: "+setting.ballPrice[(ballArr.length-1)].comma()+"\n야생 포켓몬 레벨: "+(setting.minlevel+((ballArr.length-1))*setting.balluplev+1)+"~"+(setting.minlevel+((ballArr.length-1))*setting.balluplev+10)+"\n추가 포획률\n전설: +"+(setting.ballcatch[0]*(ballArr.length-1))+"%\n레어: +"+(setting.ballcatch[1]*(ballArr.length-1))+"%\n고급: +"+(setting.ballcatch[2]*(ballArr.length-1))+"%\n일반: +"+(setting.ballcatch[3]*(ballArr.length-1))+"%\n전설 포켓몬 출현률: +"+(setting.ballg4[(ballArr.length-1)])+"%\n레어 포켓몬 출현률: +"+(setting.ballg3[(ballArr.length-1)])+"%\n");
	replier.reply("포켓몬스터 게임 볼 강화 목록"+"\u200b".repeat(500)+"\n"+res.join("\n"));
}

if(msg==cmds.collectioneffects)//컬렉션 효과
{
	var res=["[관동지방]",
	"---50% 달성---\n배틀 중 아군의 데미지 2x(컬렉션 레벨)% 증가\n---100% 달성---\n배틀 중 아군의 스피드 5x(컬렉션 레벨) 증가\n",
	"[성도지방]",
	"---50% 달성---\n배틀 중 아군의 데미지 2x(컬렉션 레벨)% 증가\n---100% 달성---\n배틀 중 상대방 명중률 3x(컬렉션 레벨)% 감소\n(렙차 패널티와 합해서 50%를 넘을 수 없음)\n",
	"[호연지방]",
	"---50% 달성---\n배틀 중 아군의 데미지 2x(컬렉션 레벨)% 증가\n---100% 달성---\nPVP 배틀 상금 X(컬렉션 레벨+1) 배\n",
	"[신오지방]",
	"---50% 달성---\n배틀 중 아군의 데미지 2x(컬렉션 레벨)% 증가\n---100% 달성---\n배틀 중 아군의 방어력 30x(컬렉션 레벨) 증가\n",
	"[하나지방]",
	"---50% 달성---\n배틀 중 아군의 데미지 2x(컬렉션 레벨)% 증가\n---100% 달성---\n배틀 중 상대의 효과가 굉장한 공격의 데미지 5x(컬렉션 레벨)% 감소\n",
	"[칼로스지방]",
	"---50% 달성---\n배틀 중 아군의 데미지 2x(컬렉션 레벨)% 증가\n---100% 달성---\n제비뽑기 좋은 보상 획득 확률 (컬렉션 레벨)% 증가\n",
	"[알로라지방]",
	"---50% 달성---\n배틀 중 아군의 데미지 2x(컬렉션 레벨)% 증가\n---100% 달성---\n배틀에서 아군이 쓰러질 공격을 받을 시 4x(컬렉션 레벨)% 확률로 체력 1을 남기고 생존\n",
	"[전설/환상]",
	"---50% 달성---\n제비뽑기 1회당 횟수 제한 (컬렉션 레벨)회 추가\n---100% 달성---\n탐험 중 돈 발견 시 획득량 X(컬렉션 레벨+1) 배\n",
	"[울트라비스트]",
	"---50% 달성---\n추가 포획률 (컬렉션 레벨)% 증가\n---100% 달성---\n포켓몬 레벨업 비용 5x(컬렉션 레벨)% 감소\n",
	"[???]",
	"---50% 달성---\n모든 돈 획득량 +10x(컬렉션 레벨)% 증가\n---100% 달성---\n울트라비스트 출현율 (컬렉션 레벨)% 증가\n",
	];
	replier.reply("포켓몬스터 게임 컬렉션 효과 목록"+"\u200b".repeat(500)+"\n※컬렉션 레벨은 100%수집을 달성한 지역 1개당 1씩 오릅니다.\n\n"+res.join("\n"));
}

if(msg==cmds.collectioninfo)//컬렉션 목록
{
	var res="";
	for(var ii of collectionnames){
		if(ii!="???")
			res=res+"["+ii+"]\n"+collectioncontents[collectionnames.indexOf(ii)].join(",")+"\n\n";
		else
			res=res+"[???]\n???, ???, ???, ???, ???, ???\n\n";
	}
	replier.reply("포켓몬스터 게임 컬렉션 목록"+"\u200b".repeat(500)+"\n컬렉션 효과 보기: "+cmds.collectioneffects+"\n\n"+res);
}

if(msg==cmds.rank)//배틀 랭킹
{
	let pokRank=JSON.parse(FileStream.read(pathRank));
    if(pokRank==null){
        let data=[];
        FileStream.write(pathRank, JSON.stringify(data));
        pokRank=JSON.parse(FileStream.read(pathRank));
    }
    let rarr=[];
    var result="";
	if(pokRank.length==0||pokRank==undefined) result='※ 랭킹에 등록된 유저가 없어요.';
    else if(pokRank.length==1)
        result="[1위]\n<"+pokRank[0].rank+"> "+pokRank[0].name+"\n총 배틀 횟수: "+pokRank[0].battle.total+"\n승리 횟수: "+pokRank[0].battle.win;
	else{
		pokRank.sort((a,b)=>b.battle.win-a.battle.win);
		var n;
		if(pokRank.length<setting.ranknum) n=pokRank.length;
		else n=setting.ranknum;
		for(var i=0; i<n; i++) rarr.push(pokRank[i]);
		for(var i=0;i<rarr.length;i++)
			result=result+"["+(i+1)+"위]\n<"+rarr[i].rank+"> "+rarr[i].name+"\n총 배틀 횟수: "+rarr[i].battle.total+"\n승리 횟수: "+rarr[i].battle.win+"\n\n\n";
    }
	replier.reply("포켓몬스터 게임 랭킹\n"+"\u200b".repeat(500)+"\n"+result);
}

if(msg==cmds.leaguechar)//리그캐
{
	var pname=setting.leaguecharacter;
	img=pokimglink(pname,0);
	poklink="ko/wiki/"+encodeURIComponent(pname+"_(포켓몬)");
	try{
	Kakao.sendLink(room, {
			"link_ver":"4.0",
			"template_id":(58796),
			"template_args":{
			//이곳에 템플릿 정보를 입력하세요.
			'POKIMG':img,
			'LINK':poklink,
			'POKNAME':"Lv."+(setting.championlev-10)+" "+pname+"  "+typetexts[read("포켓몬/"+pname,"type1")]+" "+typetexts[read("포켓몬/"+pname,"type2")],
			'DESC':"최대 HP: "+(read("포켓몬/"+pname,"hp")*Math.ceil((setting.championlev-10)/50))+" 공격력: "+(read("포켓몬/"+pname,"atk")*Math.ceil((setting.championlev-10)/50))+" 방어력: "+(read("포켓몬/"+pname,"def")*Math.ceil((setting.championlev-10)/50))+" 스피드: "+(read("포켓몬/"+pname,"spd")*Math.ceil((setting.championlev-10)/50))
			}
			}, "custom")
	}catch(e){
		replier.reply("카카오링크 오류. 리셋 한번 해주세요.\n\nLv."+setting.maxlevel+" "+pname+"  "+typetexts[read("포켓몬/"+pname,"type1")]+" "+typetexts[read("포켓몬/"+pname,"type2")]+"\n\n최대 HP: "+(read("포켓몬/"+pname,"hp")*Math.ceil(setting.maxlevel/50))+" 공격력: "+(read("포켓몬/"+pname,"atk")*Math.ceil(setting.maxlevel/50))+" 방어력: "+(read("포켓몬/"+pname,"def")*Math.ceil(setting.maxlevel/50))+" 스피드: "+(read("포켓몬/"+pname,"spd")*Math.ceil(setting.maxlevel/50)));
	}
	replier.reply("리그 캐릭터 획득 방법\n-챔피언리그 우승\n-리본 ["+setting.ribbon.name[9]+"] 단계 업그레이드 보상");
}

if(msg==cmds.uphelp)//명령어
{
	replier.reply(["포켓몬스터 게임 명령어 목록",
	"\u200b".repeat(500),
	"\n",
	cmds.help+": 게임 소개",
	cmds.uphelp+": 도움말(명령어 목록)",
	cmds.join+": 회원가입",
	cmds.leave+": 탈퇴",
	cmds.play.join("/")+": 탐험시작",
	cmds.ballthrow.join("/")+": 볼 던지기",
	cmds.esc.join("/")+": 도망가기",
	cmds.box+": 포켓몬 보관함",
	cmds.mycollection+": 컬렉션 수집 현황",
	cmds.collectioninfo+": 컬렉션 포켓몬 목록",
	cmds.collectioninfo+": 컬렉션 효과 종류",
	cmds.info+": 내 트레이너 정보 (닉네임 같이 입력 시 해당 유저 정보)",
	cmds.ball+" (숫자): 볼 구매",
	cmds.rest+": 휴식(다시 사용시 휴식 종료)",
	cmds.sell+": 놓아주기(돈 획득)\n(박스 전체 포켓몬에 적용, 덱에 장착 혹은 잠금 상태의 포켓몬은 제외)",
	cmds.skillchange+" (덱 번호): 스킬 랜덤 뽑기(돈 소모)",
	cmds.skilllock+"/"+cmds.skillunlock+" (덱 번호) (스킬 번호): 스킬 뽑기 시 잠금 및 해제할 기술 선택",
	"(잠금 상태의 기술은 뽑기 시에도 고정, 단 잠금 갯수에 따라 뽑기 비용 상승)",
	cmds.levelup+" (덱 번호): 포켓몬 레벨업(돈 소모)",
	cmds.mega+" (덱 번호): 포켓몬 메가진화(고정 비용 20억 소모, 200렙 이상만 가능)",
	cmds.formchange+" (덱 번호): 포켓몬 폼체인지(돈 소모)",
	cmds.ballup+": 볼 업그레이드(돈 소모)",
	cmds.ballinfo+": 볼 업그레이드 목록",
	cmds.gatcha+": 제비뽑기(도박컨텐츠, 고정 비용 1000만 원 소모)",
	cmds.battlejoin+": 배틀(PVP), 두 명이 참가 시 매칭되어 배틀 진행",
	cmds.eventinfo+": 현재 진행중인 이벤트 보기",
	cmds.title+": 트레이너 등급 목록",
	cmds.ribbon+": 리본 목록",
	cmds.leaguechar+": 현재 리그 보상 포켓몬 보기",
	cmds.rank+": 트레이너 배틀 랭킹",
	cmds.giveup+": 배틀 기권",
	cmds.battletower+": 배틀타워(일일 컨텐츠)",
	cmds.gym+": 체육관 도전",
	cmds.champ+": 챔피언리그 도전(모든 체육관 클리어해야 도전 가능)",
	cmds.champinfo+": 챔피언리그 정보",
	cmds.seasoninfo+": 현재 계절 보기(계절은 포켓몬 출현 시 2%확률로 순환)"
	].join("\n"));
}

if(msg==cmds.help)//소개
{
	replier.reply(["포켓몬스터 게임 V2.0",
	"Made By 디벨로이드",
	"\u200b".repeat(500),
	"\n",
	"카카오톡에서 포켓몬 게임을 즐겨 보세요!",
	"",
	cmds.play.join("/")+" 명령어를 통해 탐험을 시도할 수 있으며,",
	"탐험 성공 시 일정량의 돈 또는 포켓몬을 발견할 수 있습니다.",
	"한번 탐험을 시도하면 포켓몬을 발견할 때까지 자동으로 재시도되므로 기다리시면 되며,",
	"포켓몬 미발견 시에는 운이 좋다면 특별한 보상을 획득할 수도 있습니다.",
	"",
	"발견한 포켓몬에겐 "+cmds.ballthrow.join("/")+" 를 통해 볼을 던져서 잡을 수 있고,",
	"잡은 포켓몬을 강화 및 스킬 세팅을 맞춰 덱을 맞추거나, 방생시켜 돈을 얻을 수도 있습니다.",
	"일부 포켓몬은 요구하는 레벨업 수치 만족 시 진화하여 더 강한 포켓몬으로 변하기도 합니다.",
	"",
	"일정 수치의 포켓몬 포획 수를 달성할 때마다 트레이너 등급이 상승하여 여러 혜택이 주어지며,",
	"포켓몬 포획 수 충족 시 일정 금액을 투자하여 볼 종류를 업그레이드하여 더 좋은 포켓몬의 출현률 및 포획률을 올릴 수도 있습니다.",
	"※전설의 포켓몬은 볼 업그레이드 ["+ballArr[3]+"] 부터 등장합니다.",
	"",
	"포획한 포켓몬으로 덱을 꾸민 후에는 다른 유저와의 배틀(PVP) 를 통해 겨룰 수 있으며,",
	"체육관에 도전하여 배지와 상금 보상을 획득할 수 있고 모든 배지를 획득 시 챔피언리그 도전권이 주어집니다.",
	"",
	"전체 명령어 보기: "+cmds.uphelp
	].join("\n"));
}

if(msg==cmds.eventinfo)//이벤트 보기
{
	var res="";
	if(setting.eventp.unknown!=0)
		res=res+"히든 포켓몬 출현률 증가: +"+setting.eventp.unknown+"%\n";
	if(setting.eventp.g4!=0)
		res=res+"전설의 포켓몬 출현률 증가: +"+setting.eventp.g4+"%\n";
	if(setting.eventp.g3!=0)
		res=res+"레어 포켓몬 출현률 증가: +"+setting.eventp.g3+"%\n";
	if(setting.eventp.g4catch!=0)
		res=res+"전설의 포켓몬 추가 포획률: +"+setting.eventp.g4catch+"%\n";
	if(setting.eventp.g3catch!=0)
		res=res+"레어 포켓몬 추가 포획률: +"+setting.eventp.g3catch+"%\n";
	if(setting.eventp.goldX!=1)
		res=res+"모든 돈 획득량: X"+setting.eventp.goldX+"배\n";
	if(res=="")
		replier.reply("포켓몬스터 게임 이벤트 목록\n\n현재 진행중인 이벤트가 없습니다.");
	else
		replier.reply("포켓몬스터 게임 이벤트 목록\n\n"+res);
}

if(msg.split(" ")[0]=="@패치업뎃")//확률수정 이후 업뎃용
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender].rank=='개발자'){
		var username=msg.substr("@패치업뎃 ".length);
		pokUser[username]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+username+'.json'));
		if(pokUser[username]==null){
			replier.reply('@'+username+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
			return;
		}
		pokInv[username]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json'));
		
		var b=0;
		b=ballArr.indexOf(pokUser[username].Ball);
		var nowr=0;
		nowr=setting.rank.name.indexOf(pokUser[username].rank);
		while(pokUser[username].count.succ<=setting.rank.upif[nowr]){
				nowr--;
		}
		if(b>1){
			while(setting.ballupsucc[b-1]>pokUser[username].count.total)
			{
				b=b-1;
				pokUser[username].Ball=ballArr[b];
			}
		}
		pokUser[username].maxHp=setting.rank.maxHp[nowr];
		pokUser[username].rest=setting.rank.rest[nowr];
		pokUser[username].castT=setting.rank.castT[nowr];
		pokUser[username].success=setting.success+setting.rank.success[nowr];
		pokUser[username].rank=setting.rank.name[nowr];
		pokUser[username].Ball=ballArr[b];
		pokUser[username].successcatch.g5=setting.catchsuccess[0]+(setting.ballcatch[0]*b)+setting.rank.successcatch[nowr];
		pokUser[username].successcatch.g4=setting.catchsuccess[1]+(setting.ballcatch[1]*b)+setting.rank.successcatch[nowr];
		pokUser[username].successcatch.g3=setting.catchsuccess[2]+(setting.ballcatch[2]*b)+setting.rank.successcatch[nowr];
		pokUser[username].successcatch.g2=setting.catchsuccess[3]+(setting.ballcatch[3]*b)+setting.rank.successcatch[nowr];
		pokUser[username].successcatch.g1=setting.catchsuccess[4]+(setting.ballcatch[4]*b)+setting.rank.successcatch[nowr];
		if(b>0){
			pokUser[username].stat.g5=setting.p.g5+setting.ballg5[b];
			pokUser[username].stat.g4=setting.p.g4+setting.ballg4[b];
			pokUser[username].stat.g3=setting.p.g3+setting.ballg3[b];
		}
		if(pokUser[username].ribbon==undefined) pokUser[username].ribbon=setting.ribbon.username[0];
		if(pokUser[username].balldc==undefined) pokUser[username].balldc=setting.ribbon.balldc[0];
		if(pokUser[username].upgradedc==undefined) pokUser[username].upgradedc=setting.ribbon.upgradedc[0];
		pokUser[username].successcatch.g5=pokUser[username].successcatch.g5+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[username].ribbon)];
		pokUser[username].successcatch.g4=pokUser[username].successcatch.g4+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[username].ribbon)];
		pokUser[username].successcatch.g3=pokUser[username].successcatch.g3+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[username].ribbon)];
		pokUser[username].successcatch.g2=pokUser[username].successcatch.g2+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[username].ribbon)];
		pokUser[username].successcatch.g1=pokUser[username].successcatch.g1+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[username].ribbon)];
		pokUser[username].stat.g4=pokUser[username].stat.g4+setting.ribbon.g4[setting.ribbon.name.indexOf(pokUser[username].ribbon)];
		pokUser[username].stat.g3=pokUser[username].stat.g3+setting.ribbon.g3[setting.ribbon.name.indexOf(pokUser[username].ribbon)];
		if(pokUser[username].badge>(-1))
		{
			
		}
		else{
			pokUser[username].badge=null;
			pokUser[username].badge=0;
		}
		if(pokUser[username].activecollection==undefined||pokUser[username].activecollection==null)
		{
			pokUser[username].activecollection=null;
			pokUser[username].activecollection=[];
		}
		if(pokUser[username].collectionlev==undefined||pokUser[username].collectionlev==null)
		{
			pokUser[username].collectionlev=null;
			pokUser[username].collectionlev=0;
		}
		pokCol[username]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+username+'_collection.json'));
		if(pokCol[username]==null){
			let dogam={'관동지방':[],'성도지방':[],'호연지방':[],'신오지방':[],'하나지방':[],'칼로스지방':[],'알로라지방':[],'전설/환상':[],'울트라비스트':[],'???':[]}
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_collection.json', JSON.stringify(dogam));
			pokCol[username]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+username+'_collection.json'));
		}
		
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'.json', JSON.stringify(pokUser[username]));
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json', JSON.stringify(pokInv[username]));
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_collection.json', JSON.stringify(pokCol[username]));
		replier.reply("@"+username+"\n새로운 패치 데이터 반영 완료.");
	}
	else{
		replier.reply("@"+username+"\n개발자만 가능한 기능이에요.");
	}
}

if(msg==cmds.champinfo) //리그정보
{
	let chamRank=JSON.parse(FileStream.read(pathchampRank));
	if(chamRank==null){
		let cdata={"Champnum":1,"Champlogs":[]};
			FileStream.write(pathchampRank, JSON.stringify(cdata));
			chamRank=JSON.parse(FileStream.read(pathchampRank));
	}
	var champrint="";
	if(chamRank["Champlogs"].length>1){
		for(var i=1;i<chamRank["Champlogs"].length;i++)
		{
			champrint=champrint+i+"대 챔피언: "+chamRank["Champlogs"][i]+"\n";
		}
	}
	else{
		champrint="아직 챔피언 리그 승리자가 나타나지 않았습니다.\n"+cmds.champ+" 을 통해 챔피언리그에 도전해 보세요!";
	}
	replier.reply("현재 포켓몬 챔피언리그 정보\n(리그 도전: "+cmds.champ+")\n\nㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n⚜시즌 1 챔피언⚜\n\n[챔피언] Korrie\nㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n역대 챔피언 기록\n\n"+champrint);
}

if(msg==cmds.seasoninfo) //계절
{
	let pokseason=JSON.parse(FileStream.read(pathseason));
	if(pokseason==null){
		let data={"month":1};
		FileStream.write(pathseason, JSON.stringify(data));
		pokseason=JSON.parse(FileStream.read(pathseason));
	}
	month=pokseason["month"];
	var seasontext=["","봄","여름","가을","겨울"];
	var res="";
	if(month==1) res=res+"출현률 증가 포켓몬: "+seasons.spring.join(", ")+"\n\n배틀 시 1/3 확률로 날씨가 "+weathertexts[month]+" 상태로 변함\n";
	else if(month==2) res=res+"출현률 증가 포켓몬: "+seasons.summer.join(", ")+"\n\n배틀 시 1/3 확률로 날씨가 "+weathertexts[month]+" 상태로 변함\n";
	else if(month==3) res=res+"출현률 증가 포켓몬: "+seasons.autumn.join(", ")+"\n\n배틀 시 1/3 확률로 날씨가 "+weathertexts[month]+" 상태로 변함\n";
	else if(month==4) res=res+"출현률 증가 포켓몬: "+seasons.winter.join(", ")+"\n\n배틀 시 1/3 확률로 날씨가 "+weathertexts[month]+" 상태로 변함\n";
	replier.reply("현재 계절: "+seasontext[month]+"\n\n"+res);
}

if(msg.split(" ")[0]=="@포켓몬복구") //포켓몬 복구용
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender].rank=='개발자'){
		var username=msg.split(" ")[1];
		pokUser[username]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+username+'.json'));
		if(pokUser[username]==null){
			replier.reply('@'+username+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
			return;
		}
		pokInv[username]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json'));
		var pokname=msg.split(" ")[2];
		let pokinfo={
			'name':pokname,
			'level':1
		};
		ispokfind.push(username);
		battlepokinfo.push(pokinfo);
		isballwaiting=[];
		advOn[username]=2;
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'.json', JSON.stringify(pokUser[username]));
		FileStream.write("sdcard/Devel/Pokemon/Data/player_"+username+'_inv.json', JSON.stringify(pokInv[username]));
		replier.reply('@'+username+'\n개발자에 의해 '+pokname+" 의 발견 정보가 복구되었습니다. 볼을 던질 수 있습니다.");
		}
		else
			replier.reply("개발자만 가능합니다.");
}

if(msg=="@포켓몬리셋") //강제리셋
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender].rank=='개발자'){
	replier.reply("강제 리로드. 비상시에만 사용해 주세요.");
	Api.reload("pok");
	}
	else
		replier.reply("개발자만 가능합니다.");
}
}

function onStartCompile() {
	var seasontext=["","봄","여름","가을","겨울"];
	let pokseason=JSON.parse(FileStream.read(pathseason));
	if(pokseason==null){
		let data={"month":1};
		FileStream.write(pathseason, JSON.stringify(data));
		pokseason=JSON.parse(FileStream.read(pathseason));
	}
	month=pokseason["month"];
	gatchaplayers={};
	champplayers={};
    Api.replyRoom("낚시터","포켓몬 게임 리로드.\n현재 계절: "+seasontext[month]);
}