const config=require('pok_data');

const FS = FileStream;
Jsoup=org.jsoup.Jsoup;
const { KakaoLinkClient } = require('kakaolink');
const Kakao =new KakaoLinkClient("aaa","http://asdf");
Kakao.login('asdf','asdf');

const cmds=config.cmds;
const pokArr=config.pokArr;
const ballArr=config.ballArr;
const ballfail=config.ballfail;
const setting=config.setting;
const advfail=config.advfail;
const seasons=config.seasons;
var month=Math.floor((new Date().getDay()+1)/7)+1;
const pathRank="sdcard/Devel/Pokemon/Data/ranking.json";  //랭킹파일경로
var typetexts=[" ","[⚪노말]","[🔥불]","[🌊물]","[🌿풀]","[🕊비행]","[🪨바위]","[⛰땅]","[✊격투]","[⛓강철]","[🐞벌레]","[❄얼음]","[⚡전기]","[🧪독]","[👽에스퍼]","[☠고스트]","[😈악]","[🌠드래곤]"];
var weathertexts=["[맑음]","[🌞햇살이 강함]","[☔비]","[🌪모래바람]","[☃️싸라기눈]"];
var weatherdesc=["","🌞햇살이 강해요.","☔비가 내리고 있어요.","🌪모래바람이 세차게 불고 있어요.","☃️싸라기눈이 내리고 있어요."];
var ispokselect=0;
const more = "​";
var succrate=0;
var ispokfind=[];
var battlepokinfo=[];
var pokUser={};
var pokInv={};
var pokdelay={};
var advOn={};
var parse;
var img;
var isballwaiting=[];
var player1="";
var player2="";
var isbattle=0;
var player1retire=[];
var player2retire=[];
var player1ball="";
var player2ball="";
var player1maxhp=0;
var player2maxhp=0;
var weather=0; //1 쾌청 2 비 3 모래바람 4 싸라기눈
var player1pok={};
var player2pok={};
var player1pp=[];
var player2pp=[];
var isplayer1bind=0;
var isplayer2bind=0;
var nextpokchoose=0;
var battleres="";

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

function weatherjudge(atk,type){
	if(weather==1&&type==2)
		atk=atk*2;
	if(weather==1&&type==3)
		atk=atk/2;
	if(weather==2&&type==2)
		atk=atk/2;
	if(weather==2&&type==3)
		atk=atk*2;
}

function printskills(skills,locked){
	var res="";
	var power="";
	var accr="";
	for(var i=0;i<(locked.length);i++)
	{
		if(read("기술/"+locked[i],"damage")==9999)
			power="일격필살";
		else power=read("기술/"+locked[i],"damage");
		if(read("기술/"+locked[i],"accr")==9999)
			accr="반드시 명중";
		else accr=read("기술/"+locked[i],"accr")+"%";
		res=res+"🔒"+locked[i]+" "+typetexts[read("기술/"+locked[i],"type")]+"\n위력:"+power+"  PP:"+read("기술/"+locked[i],"pp")+"  명중률:"+accr+"\n\n";
	}
	for(var i=0;i<(skills.length);i++)
	{
		if(read("기술/"+skills[i],"damage")==9999)
			power="일격필살";
		else power=read("기술/"+skills[i],"damage");
		if(read("기술/"+skills[i],"accr")==9999)
			accr="반드시 명중";
		else accr=read("기술/"+skills[i],"accr")+"%";
		res=res+skills[i]+" "+typetexts[read("기술/"+skills[i],"type")]+"\n위력:"+power+"  PP:"+read("기술/"+skills[i],"pp")+"  명중률:"+accr+"\n\n";
	}
	return res;
}

function printbattlekakaolink(room,replier){
	var img1=Jsoup.connect("https://librewiki.net/wiki/"+player1pok.name+"_(포켓몬)").get().select("meta[property=og:image]").attr("content");
	var img2=Jsoup.connect("https://librewiki.net/wiki/"+player2pok.name+"_(포켓몬)").get().select("meta[property=og:image]").attr("content");
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
					var accr=Number(read("기술/"+player1skill,"accr"));
					if(player1pok.level<player2pok.level)
						accr=Math.ceil(accr*(100-(player2pok.level-player1pok.level)*2)/100);
					if(Math.floor(Math.random()*100)<accr){
						var atk=Math.ceil(player1pok.atk*read("기술/"+player1skill,"damage")/300*(1000-read("포켓몬/"+player2pok.name,"def"))/1000);
						if(read("기술/"+player1skill,"addi")==4)
							atk=atk*(player1maxhp-player1pok.hp)/2;
						if(read("기술/"+player1skill,"type")==read("포켓몬/"+player1pok.name,"type1")||read("기술/"+player1skill,"type")==read("포켓몬/"+player1pok.name,"type2"))
							atk=atk*1.5;
						atk=weatherjudge(atk,read("기술/"+player1skill,"type"));
						var judge=typejudge(read("기술/"+player1skill,"type"),read("포켓몬/"+player2pok.name,"type1"),read("포켓몬/"+player2pok.name,"type2"));
						atk=atk*judge;
						player2pok.hp=Math.ceil(player2pok.hp-atk);
						if(player2pok.hp<0) player2pok.hp=0;
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
						else if(read("기술/"+player1skill,"addi")==1)
						{
							isplayer1bind=1;
							
						}
						else if(player1skill=="자폭"||player1skill=="대폭발")
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
					var accr=Number(read("기술/"+player2skill,"accr"));
					if(player2pok.level<player1pok.level)
						accr=Math.ceil(accr*(100-(player1pok.level-player2pok.level)*2)/100);
					if(Math.floor(Math.random()*100)<accr){
						var atk=Math.ceil(player2pok.atk*read("기술/"+player2skill,"damage")/300*(1000-read("포켓몬/"+player1pok.name,"def"))/1000);
						if(read("기술/"+player2skill,"addi")==4)
							atk=atk*(player2maxhp-player2pok.hp)/2;
						if(read("기술/"+player2skill,"type")==read("포켓몬/"+player2pok.name,"type1")||read("기술/"+player2skill,"type")==read("포켓몬/"+player2pok.name,"type2"))
							atk=atk*1.5;
						atk=weatherjudge(atk,read("기술/"+player2skill,"type"));
						var judge=typejudge(read("기술/"+player2skill,"type"),read("포켓몬/"+player1pok.name,"type1"),read("포켓몬/"+player1pok.name,"type2"));
						atk=atk*judge;
						player1pok.hp=Math.ceil(player1pok.hp-atk);
						if(player1pok.hp<0) player1pok.hp=0;
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
						else if(read("기술/"+player2skill,"addi")==1)
						{
							isplayer2bind=1;
							
						}
						else if(player2skill=="자폭"||player2skill=="대폭발")
						{
							player2pok.hp=1;
							
						}
						battleres=battleres+"\n";
						battleres=battleres+"Lv."+player1pok.level+" "+player1pok.name+"   ["+player1pok.hp+"/"+player1maxhp+"]\n";
						battleres=battleres+"Lv."+player2pok.level+" "+player2pok.name+"   ["+player2pok.hp+"/"+player2maxhp+"]\n";
						battleres=battleres+"\n";
					}
					else
						battleres=battleres+"["+player1+"] 아쉽게 "+player2pok.name+"의 기술은 빗나갔어요!\n";
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
					var accr=Number(read("기술/"+player2skill,"accr"));
					if(player2pok.level<player1pok.level)
						accr=Math.ceil(accr*(100-(player1pok.level-player2pok.level)*2)/100);
					if(Math.floor(Math.random()*100)<accr){
						var atk=Math.ceil(player2pok.atk*read("기술/"+player2skill,"damage")/300*(1000-read("포켓몬/"+player1pok.name,"def"))/1000);
						if(read("기술/"+player2skill,"addi")==4)
							atk=atk*(player2maxhp-player2pok.hp)/2;
						if(read("기술/"+player2skill,"type")==read("포켓몬/"+player2pok.name,"type1")||read("기술/"+player2skill,"type")==read("포켓몬/"+player2pok.name,"type2"))
							atk=atk*1.5;
						atk=weatherjudge(atk,read("기술/"+player2skill,"type"));
						var judge=typejudge(read("기술/"+player2skill,"type"),read("포켓몬/"+player1pok.name,"type1"),read("포켓몬/"+player1pok.name,"type2"));
						atk=atk*judge;
						player1pok.hp=Math.ceil(player1pok.hp-atk);
						if(player1pok.hp<0) player1pok.hp=0;
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
						else if(read("기술/"+player2skill,"addi")==1)
						{
							isplayer2bind=1;
							
						}
						else if(player2skill=="자폭"||player2skill=="대폭발")
						{
							player2pok.hp=1;
							
						}
						battleres=battleres+"\n";
						battleres=battleres+"Lv."+player1pok.level+" "+player1pok.name+"   ["+player1pok.hp+"/"+player1maxhp+"]\n";
						battleres=battleres+"Lv."+player2pok.level+" "+player2pok.name+"   ["+player2pok.hp+"/"+player2maxhp+"]\n";
						battleres=battleres+"\n";
					}
					else
						battleres=battleres+"["+player1+"] 아쉽게 "+player2pok.name+"의 기술은 빗나갔어요!\n";
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
					var accr=Number(read("기술/"+player1skill,"accr"));
					if(player1pok.level<player2pok.level)
						accr=Math.ceil(accr*(100-(player2pok.level-player1pok.level)*2)/100);
					if(Math.floor(Math.random()*100)<accr){
						var atk=Math.ceil(player1pok.atk*read("기술/"+player1skill,"damage")/300*(1000-read("포켓몬/"+player2pok.name,"def"))/1000);
						if(read("기술/"+player1skill,"addi")==4)
							atk=atk*(player1maxhp-player1pok.hp)/2;
						if(read("기술/"+player1skill,"type")==read("포켓몬/"+player1pok.name,"type1")||read("기술/"+player1skill,"type")==read("포켓몬/"+player1pok.name,"type2"))
							atk=atk*1.5;
						atk=weatherjudge(atk,read("기술/"+player1skill,"type"));
						var judge=typejudge(read("기술/"+player1skill,"type"),read("포켓몬/"+player2pok.name,"type1"),read("포켓몬/"+player2pok.name,"type2"));
						atk=atk*judge;
						player2pok.hp=player2pok.hp-atk;
						if(player2pok.hp<0) player2pok.hp=0;
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
						else if(read("기술/"+player1skill,"addi")==1)
						{
							isplayer1bind=1;
							
						}
						else if(player1skill=="자폭"||player1skill=="대폭발")
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
				//끝
			}
		battleres=battleres+"\n";
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
	if(nowr<11)
	{
		if(pokUser[sender].count.succ>(setting.rank.upif[nowr+1]))
		{
			pokUser[sender].maxHp=setting.rank.maxHp[nowr+1];
			pokUser[sender].rest=setting.rank.rest[nowr+1];
			pokUser[sender].castT=setting.rank.castT[nowr+1];
			pokUser[sender].success=pokUser[sender].success+setting.rank.success[nowr+1]-setting.rank.success[nowr];
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
		}
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
if(ypea==11||typeb==11)
typeres=typeres*2;
}
else if(skilltype==10)
{
if(typea==2||typeb==2)
typeres=typeres/2;
if(typea==8||typeb==8)
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
if(typea==14||typeb==14)
typeres=typeres*2;
if(typea==15||typeb==15)
typeres=typeres*2;
}
else if(skilltype==17)
{
if(typea==9||typeb==9)
typeres=typeres/2;
if(typea==17||typeb==17)
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
	i=pokUser[sender].stat.g4+setting.eventp.g4;
	ran=ran-i;
	if(ran<0) return 3;
	i=pokUser[sender].stat.g3+setting.eventp.g3;
	ran=ran-i;
	if(ran<0) return 4;
	i=setting.p.g2;
	ran=ran-i;
	if(ran<0) return 5;
	i=Math.ceil(pokUser[sender].stat.g4/2);
	ran=ran-i;
	if(ran<0) return 7;
	else return 6;
	//i:1 g:2 g4:3 g3:4 g2:5 g1:6
	//7: 계절포켓몬
}

//포획률 함수
function catchjudge(group,sender,replier){
	var ran=Math.floor(Math.random()*100)+1;
	var iscatch=0;
	if(group==4)
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
                'g4':setting.p.g4, 'g3':setting.p.g3, 'g2':setting.p.g2, 'g1':setting.p.g1  //그룹별 출현률
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
			'badge':{},
            'success':setting.success,  //탐방성공률
			'successcatch':{
				'g4':setting.catchsuccess[0], 'g3':setting.catchsuccess[1], 'g2':setting.catchsuccess[2], 'g1':setting.catchsuccess[3]
			},  //포획성공률
            'rest':Number(setting.rank.rest[0]),  //체력+1당 휴식시간
            'castT':0,  //캐스팅시간
            'restOn':{'on':0, 'time':0}  //휴식객체
        };
        let inv={'deck':[],'box':[],'item':[]};
        FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(data));
        FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(inv));
        replier.reply('@'+sender+'\n포켓몬의 세계에 오신 것을 환영합니다!\n\n@야생 명령어를 입력하면 탐험을 시작하게 됩니다.');
    } else replier.reply('@'+sender+' \n이미 가입한 상태에요.');
}

function pokleave(sender,replier){
    pokUser[sender]=JSON.parse(FileStream.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
    if(pokUser[sender]!=null){
		pokUser[sender]==null;
		pokInv[sender]==null;
		let pokRank=JSON.parse(FileStream.read(pathRank));
        if(pokRank.some(e=>e.name==sender)){
            pokRank.splice(pokRank.findIndex(e=>e.name==sender),1);
            FileStream.write(pathRank, JSON.stringify(pokRank));
        }
        FileStream.remove("sdcard/Devel/Pokemon/Data/player_"+sender+'.json');
        FileStream.remove("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json');
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
    if(Device.getBatteryTemperature()>=390){
        replier.reply('@'+sender+' \n루시가 과열되었어요!\n조금만 쉬었다가 다시 해 주세요.');
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
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
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
			
			var money=Math.floor(Math.random()*100)*100;//100~10000
			money=money*(ballArr.indexOf(pokUser[sender].Ball)+1)*5; //볼 강화당 돈발견 금액 증가
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
				if(pokUser[sender].balls<setting.maxball)
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
					var money=99999999;
					money=money*setting.eventp.goldX;
					pokUser[sender].gold=pokUser[sender].gold+money;
					replier.reply("@"+sender+"\n축하합니다!\n👑마제스티의 키를 발견했어요!\n상점에 팔아 1억 원을 획득했어요.");
				}	
				else
				{
					var money=9999999;
					money=money*setting.eventp.goldX;
					pokUser[sender].gold=pokUser[sender].gold+money;
					replier.reply("@"+sender+"\n축하합니다!\n🪨알 수 없는 돌을 발견했어요!\n상점에 팔아 1000만 원을 획득했어요.");
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
	}
	let pokname="";
	var lev=0;
	if(prob==7)
	{
		if(month>4) month=1;
		
		if(month==1)
			pokname=seasons.spring[Math.floor(Math.random()*seasons.spring.length)];
		else if(month==2)
			pokname=seasons.summer[Math.floor(Math.random()*seasons.summer.length)];
		else if(month==3)
			pokname=seasons.autumn[Math.floor(Math.random()*seasons.autumn.length)];
		else
			pokname=seasons.winter[Math.floor(Math.random()*seasons.winter.length)];
	}
	else if(prob==3)
	{
		pokname=pokArr.group4[Math.floor(Math.random()*pokArr.group4.length)];
	}
	else if(prob==4)
		pokname=pokArr.group3[Math.floor(Math.random()*pokArr.group3.length)];
	else if(prob==5)
		pokname=pokArr.group2[Math.floor(Math.random()*pokArr.group2.length)];
	else
		pokname=pokArr.group1[Math.floor(Math.random()*pokArr.group1.length)];
	let lt=pokname.length-1;
	lev=lev+(ballArr.indexOf(pokUser[sender].Ball)+1)*8; //볼 강화당 출현레벨 8씩 증가
	lev=lev+Math.floor(Math.random()*10)+1;
	if(pokArr.group4.includes(pokname))
		replier.reply("@"+sender+"\n<⭐전설⭐> "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '이' : '가')+" 나타났어요!");
	else if(pokArr.group3.includes(pokname))
		replier.reply("@"+sender+"\n[레어] 야생의 "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '이' : '가')+" 나타났어요!");
	else if(pokArr.group2.includes(pokname))
		replier.reply("@"+sender+"\n[고급] 야생의 "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '이' : '가')+" 나타났어요!");
	else
		replier.reply("@"+sender+"\n[일반] 야생의 "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '이' : '가')+" 튀어나왔어요!");
	++pokUser[sender].count.total;
	
	parse = Jsoup.connect("https://librewiki.net/wiki/"+pokname+"_(포켓몬)").get()
	img = parse.select("meta[property=og:image]").attr("content")
	//
		
		Kakao.sendLink(room, {
			"link_ver":"4.0",
			"template_id":(58796),
			"template_args":{
			//이곳에 템플릿 정보를 입력하세요.
			'POKIMG':img,
			'POKNAME':"Lv."+lev+"  "+pokname,
			'DESC':"볼던지기: "+cmds.ballthrow.join("/")+"\n도망가기: "+cmds.esc.join("/")
			}
			}, "custom")
	//
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

}

if(cmds.ballthrow.includes(msg)){ //볼던지기
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
        replier.reply('@'+sender+'\n진행 중인 배틀이 없어요!\n@야생 명령어로 탐험부터 시작해 보세요.');
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
	if(pokArr.group4.includes(pokname))
		group=4;
	else if(pokArr.group3.includes(pokname))
		group=3;
	else if(pokArr.group2.includes(pokname))
		group=2;
	else
		group=1;
	java.lang.Thread.sleep(3000);
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
			if(caughtpokhp<40) caughtpokhp=caughtpokhp*3;
			else if(caughtpokhp<60) caughtpokhp=caughtpokhp*2;
			
			let caughtpok={
				'name':pokname,
				'level':caughtpoklev,
				'hp': Math.ceil(caughtpokhp*caughtpoklev/50),
				'atk': Math.ceil(read("포켓몬/"+pokname,"atk")*caughtpoklev/50),
				'def': Math.ceil(read("포켓몬/"+pokname,"def")*caughtpoklev/50),
				'spd': Math.ceil(read("포켓몬/"+pokname,"spd")*caughtpoklev/50),
				'skills':caughtpokskills, //위 4개는 json read
				'skillslocked':[],
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
			updatetitle(replier,sender);
			return;
		}
		else
		{
			//포획실패
			replier.reply("@"+sender+"\n"+ballfail[Math.floor(Math.random()*ballfail.length)])
			if(setting.run[4-group]>(Math.floor(Math.random()*100)+1)) //포켓몬 도주
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
        replier.reply('@'+sender+'\n진행 중인 배틀이 없어요!\n@야생 명령어로 탐험부터 시작해 보세요.');
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
				str=str+(pokInv[sender].deck.length+i)+".  (비어 있음)\n";
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
		let tempbox=[];
	for(var i=0;i<pokInv[sender].box.length;i++)
	{
		if(pokInv[sender].box[i].islocked==0)
		{
			money=money+300*pokInv[sender].box[i].level*pokInv[sender].box[i].level;
			
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
	money=money*setting.eventp.goldX;
	pokUser[sender].gold=pokUser[sender].gold+money;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
	replier.reply("@"+sender+"\n잠금상태의 포켓몬을 제외한 박스의 모든 포켓몬을 놓아주었어요.\n"+money.comma()+"원 획득.\n\n보유금액: "+(pokUser[sender].gold).comma()+"원");
	}else replier.reply("@"+sender+"\n박스에 포켓몬이 없어요.");
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
	var skillcosts=[1000,10000,100000,1000000,0];
	var cost=Math.ceil(skillcosts[p.skillslocked.length]*(100-pokUser[sender].upgradedc)/100);
	if(pokUser[sender].gold<cost)
		replier.reply("@"+sender+"\n돈이 부족해요.\n\nLv."+p.level+" "+p.name+"의 스킬 뽑기 비용: "+cost.comma()+"\n("+p.skillslocked.length+"개 스킬 잠금)");
	else{
	var skillsarr=read("포켓몬/"+p.name,"skills");
	if(skillsarr.length<5||p.skillslocked.length>3) replier.reply("@"+sender+"\n해당 포켓몬은 바꿀 스킬이 없어요.");
	else
	{
	var caughtpokskills=[];
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
	replier.reply("@"+sender+"\n"+cost.comma()+"원 지불.\n보유금액: "+(pokUser[sender].gold).comma()+"원\n\nLv."+pokInv[sender].deck[n-1].level+" "+pokInv[sender].deck[n-1].name+"의 기술\n"+"\u200b".repeat(500)+"\n"+printskills(pokInv[sender].deck[n-1].skills,pokInv[sender].deck[n-1].skillslocked));
	}
	}
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
	}
}

if(msg.split(" ")[0]==cmds.levelup)//레벨업
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	pokInv[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json'));
	if(pokInv[sender].deck.length<1)
		replier.reply("@"+sender+"\n레벨업은 덱에 장착된 포켓몬만 가능해요.\n먼저 포켓몬을 덱에 장착해 주세요.");
	else
	{
	if(0<msg.split(" ")[1]&&msg.split(" ")[1]<(pokInv[sender].deck.length+1)&&msg.indexOf(".")==(-1))
	{
	var n=msg.split(" ")[1];
	let p;
	p=pokInv[sender].deck[n-1];
	var skillcosts=10*p.level*p.level*p.level;
	if(p.level>150) skillcosts=skillcosts*2;
	else if(p.level>100) skillcosts=skillcosts*1.5;
	skillcosts=Math.ceil(skillcosts*(100-pokUser[sender].upgradedc)/100);
	if(pokUser[sender].gold<skillcosts)
		replier.reply("@"+sender+"\n돈이 부족해요.\n\nLV."+p.level+" "+p.name+"의 다음 레벨업 비용: "+skillcosts.comma()+"원");
	else{
	if(p.level>199) replier.reply("@"+sender+"\n해당 포켓몬은 이미 최대 레벨이에요.");
	else
	{
	p.level=p.level+1;
	if(p.level>(read("포켓몬/"+p.name,"nextlv")-1)&&read("포켓몬/"+p.name,"nextup")!="x")
	{
		var preup=p.name;
		var up=read("포켓몬/"+p.name,"nextup");
		if(up.includes("/"))
			p.name=up.split("/")[Math.floor(Math.random()*up.split("/").length)];
		else p.name=up;
		replier.reply("@"+sender+"\n축하합니다!\n"+preup+"은(는) Lv."+p.level+"을 달성하여 "+p.name+"(으)로 진화하였습니다!");
	}
	var caughtpokhp=read("포켓몬/"+p.name,"hp");
	if(caughtpokhp<40) caughtpokhp=caughtpokhp*3;
	else if(caughtpokhp<60) caughtpokhp=caughtpokhp*2;
	p.hp=Math.ceil(caughtpokhp*p.level/50);
	p.atk=Math.ceil(read("포켓몬/"+p.name,"atk")*p.level/50);
	p.def=Math.ceil(read("포켓몬/"+p.name,"def")*p.level/50);
	p.spd=Math.ceil(read("포켓몬/"+p.name,"spd")*p.level/50);
	
	pokInv[sender].deck[n-1]=p;
	pokUser[sender].gold=pokUser[sender].gold-skillcosts;
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
	var showstats="\n최대 HP: "+pokInv[sender].deck[n-1].hp+"\n공격력: "+pokInv[sender].deck[n-1].atk+"\n방어력: "+pokInv[sender].deck[n-1].def+"\n스피드: "+pokInv[sender].deck[n-1].spd;
	replier.reply("@"+sender+"\n"+skillcosts.comma()+"원 지불.\n보유금액: "+(pokUser[sender].gold).comma()+"원\n\nLv."+(pokInv[sender].deck[n-1].level-1)+" > Lv."+pokInv[sender].deck[n-1].level+" "+pokInv[sender].deck[n-1].name+"\n\n"+"\u200b".repeat(500)+showstats);
	}
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
	parse = Jsoup.connect("https://librewiki.net/wiki/"+p.name+"_(포켓몬)").get()
	img = parse.select("meta[property=og:image]").attr("content")
//  
		
		
		Kakao.sendLink(room, {
			"link_ver":"4.0",
			"template_id":(58796),
			"template_args":{
			//이곳에 템플릿 정보를 입력하세요.
			'POKIMG':img,
			'POKNAME':"Lv."+p.level+" "+p.name+"  "+typetexts[read("포켓몬/"+p.name,"type1")]+" "+typetexts[read("포켓몬/"+p.name,"type2")],
			'DESC':"최대 HP: "+p.hp+" 공격력: "+p.atk+" 방어력: "+p.def+" 스피드: "+p.spd
			}
			}, "custom")

	
	//
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
	parse = Jsoup.connect("https://librewiki.net/wiki/"+p.name+"_(포켓몬)").get()
	img = parse.select("meta[property=og:image]").attr("content")
	//    
		
		Kakao.sendLink(room, {
			"link_ver":"4.0",
			"template_id":(58796),
			"template_args":{
			//이곳에 템플릿 정보를 입력하세요.
			'POKIMG':img,
			'POKNAME':"Lv."+p.level+" "+p.name+"  "+typetexts[read("포켓몬/"+p.name,"type1")]+" "+typetexts[read("포켓몬/"+p.name,"type2")],
			'DESC':"최대 HP: "+p.hp+" 공격력: "+p.atk+" 방어력: "+p.def+" 스피드: "+p.spd
			}
			}, "custom")
	
	//
	if(p.name=="메타몽") replier.reply("보유 기술\n"+"\u200b".repeat(500)+"\n변신 [⚪노말]\n상대 포켓몬으로 변신");
	else replier.reply("보유 기술\n"+"\u200b".repeat(500)+"\n"+printskills(p.skills,p.skillslocked));
	}else replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
}

if(msg.startsWith(cmds.info))//트레이너정보
{
	var name=msg.substr(cmds.info.length);
	if(name==""||name==undefined) name=sender;
	else name=name.substr(2);
	
	pokUser[name]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+name+'.json'));
	if(pokUser[name]==null){
        replier.reply('@'+name+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
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
	"야생 포켓몬 레벨: "+((ballArr.indexOf(pokUser[name].Ball)+1)*8+1)+"~"+((ballArr.indexOf(pokUser[name].Ball)+1)*8+10),
	"현재 볼 갯수: "+pokUser[name].balls,
	"\n",
	"포켓몬 조우 횟수: "+pokUser[name].count.total,
	"포획 성공: "+pokUser[name].count.succ,
	"포획 실패: "+pokUser[name].count.fail,
	"포획 성공률: "+Math.ceil(Number(pokUser[name].count.succ)*100/(Number(pokUser[name].count.succ)+Number(pokUser[name].count.fail)))+"%",
	"\n",
	"리본: "+pokUser[name].ribbon,
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
	"전설의 포켓몬 출현률: "+pokUser[name].stat.g4+"%(+"+(pokUser[name].stat.g4-setting.p.g4).toFixed(1)+"%)",
	"레어 포켓몬 출현률: "+pokUser[name].stat.g3+"%(+"+(pokUser[name].stat.g3-setting.p.g3).toFixed(1)+"%)",
	"고급 포켓몬 출현률: "+pokUser[name].stat.g2+"%(+"+(pokUser[name].stat.g2-setting.p.g2).toFixed(1)+"%)",
	"일반 포켓몬 출현률: "+pokUser[name].stat.g1+"%(+"+(pokUser[name].stat.g1-setting.p.g1).toFixed(1)+"%)",
	"\n",
	"포켓몬 그룹별 포획률",
	"전설: "+pokUser[name].successcatch.g4+"%(+"+(pokUser[name].successcatch.g4-setting.catchsuccess[0]).toFixed(1)+"%)",
	"레어: "+pokUser[name].successcatch.g3+"%(+"+(pokUser[name].successcatch.g3-setting.catchsuccess[1]).toFixed(1)+"%)",
	"고급: "+pokUser[name].successcatch.g2+"%(+"+(pokUser[name].successcatch.g2-setting.catchsuccess[2]).toFixed(1)+"%)",
	"일반: "+pokUser[name].successcatch.g1+"%(+"+(pokUser[name].successcatch.g1-setting.catchsuccess[3]).toFixed(1)+"%)"].join("\n"));
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

if(msg==cmds.egg)//알(아이템)
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
		let pokname=pokArr.group3[Math.floor(Math.random()*pokArr.group3.length)];
			var skillsarr=read("포켓몬/"+pokname,"skills");
			var caughtpokskills=[];
			var poklev=0;
			poklev=((ballArr.indexOf(pokUser[sender].Ball)+1)*8)+10;
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
			if(caughtpokhp<40) caughtpokhp=caughtpokhp*3;
			else if(caughtpokhp<60) caughtpokhp=caughtpokhp*2;
			
			let caughtpok={
				'name':pokname,
				'level':poklev,
				'hp': Math.ceil(caughtpokhp*poklev/50),
				'atk': Math.ceil(read("포켓몬/"+pokname,"atk")*poklev/50),
				'def': Math.ceil(read("포켓몬/"+pokname,"def")*poklev/50),
				'spd': Math.ceil(read("포켓몬/"+pokname,"spd")*poklev/50),
				'skills':caughtpokskills, //위 4개는 json read
				'skillslocked':[],
				'islocked':0
			};
			pokInv[sender].box.push(caughtpok);
			let lt=pokname.length-1;
			replier.reply("@"+sender+"\n축하합니다!\n 알에서 [레어] Lv."+poklev+" "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '을' : '를')+" 획득했습니다!");
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
			replier.reply("@"+sender+"\n획득한 포켓몬을 저장했습니다.");
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
		let pokname=pokArr.group4[Math.floor(Math.random()*pokArr.group4.length)];
			var skillsarr=read("포켓몬/"+pokname,"skills");
			var caughtpokskills=[];
			var poklev=0;
			poklev=((ballArr.indexOf(pokUser[sender].Ball)+1)*8)+10;
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
			if(caughtpokhp<40) caughtpokhp=caughtpokhp*3;
			else if(caughtpokhp<60) caughtpokhp=caughtpokhp*2;
			
			let caughtpok={
				'name':pokname,
				'level':1,
				'hp': Math.ceil(caughtpokhp*poklev/50),
				'atk': Math.ceil(read("포켓몬/"+pokname,"atk")*poklev/50),
				'def': Math.ceil(read("포켓몬/"+pokname,"def")*poklev/50),
				'spd': Math.ceil(read("포켓몬/"+pokname,"spd")*poklev/50),
				'skills':caughtpokskills, //위 4개는 json read
				'skillslocked':[],
				'islocked':0
			};
			pokInv[sender].box.push(caughtpok);
			let lt=pokname.length-1;
			replier.reply("@"+sender+"\n축하합니다!\n 알에서 <⭐전설⭐> Lv."+poklev+" "+pokname+(pokname[lt].normalize("NFD").length == 3 ? '을' : '를')+" 획득했습니다!");
			FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'_inv.json', JSON.stringify(pokInv[sender]));
			replier.reply("@"+sender+"\n획득한 포켓몬을 저장했습니다.");
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
		
		pokUser[sender].successcatch.g4=pokUser[sender].successcatch.g4+setting.ballcatch[0];
		pokUser[sender].successcatch.g3=pokUser[sender].successcatch.g3+setting.ballcatch[1];
		pokUser[sender].successcatch.g2=pokUser[sender].successcatch.g2+setting.ballcatch[2];
		pokUser[sender].successcatch.g1=pokUser[sender].successcatch.g1+setting.ballcatch[3];
		
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
	if(player2==""&&player1==sender&&isbattle==0)
	{
		player1="";
		advOn[player1]=0;
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
			java.lang.Thread.sleep(10000);
			replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
			player1pok=pokInv[player1].deck[0];
			player2pok=pokInv[player2].deck[0];
			player1maxhp=player1pok.hp;
			player2maxhp=player2pok.hp;
			var player1skillsarr=player1pok.skills;
			for(var j=0;j<player1pok.skillslocked.length;j++)
				player1skillsarr.push(player1pok.skillslocked[j]);
			var player2skillsarr=player1pok.skills;
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
			for(var i=0;i<player1skillsarr.length;i++)
				player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
			for(var i=0;i<player2skillsarr.length;i++)
				player2pp.push(Number(read("기술/"+player2skillsarr[i]),"pp"));
			if(Math.floor(Math.random()*3)==1){
				if(month>4) month=1;
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
				java.lang.Thread.sleep(2000);
				if(player1retire.length==pokInv[player1].deck.length)
				{
					var reward=Math.ceil(pokUser[player1].gold/10);
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
				let lt=player1pok.name.length-1;
				replier.reply("@"+player2+"\n"+player2pok.name+(player2pok.name[lt].normalize("NFD").length == 3 ? '이' : '가')+" 쓰러졌어요!");
				java.lang.Thread.sleep(2000);
				if(player2retire.length==pokInv[player2].deck.length)
				{
					var reward=Math.ceil(pokUser[player2].gold/10);
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
		if(player1==sender&&nextpokchoose==1){
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
					java.lang.Thread.sleep(3000);
					replier.reply("["+player1+"]\n"+player1ball+"\n\n["+player2+"]\n"+player2ball);
					player1pok=pokInv[player1].deck[nextpoknum-1];
					player1maxhp=player1pok.hp;
					var player1skillsarr=player1pok.skills;
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
					for(var i=0;i<player1skillsarr.length;i++)
						player1pp.push(Number(read("기술/"+player1skillsarr[i]),"pp"));
					
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
					player2pok=pokInv[player2].deck[nextpoknum-1];
					player2maxhp=player2pok.hp;
					var player2skillsarr=player2pok.skills;
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
					for(var i=0;i<player2skillsarr.length;i++)
						player2pp.push(Number(read("기술/"+player2skillsarr[i]),"pp"));
					
				}
			}else{
				replier.reply("@"+sender+"\n잘못 입력하셨습니다.");
				return;
			}
		}
		else return;
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
				java.lang.Thread.sleep(2000);
				if(player1retire.length==pokInv[player1].deck.length)
				{
					var reward=Math.ceil(pokUser[player1].gold/10);
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
				java.lang.Thread.sleep(2000);
				if(player2retire.length==pokInv[player2].deck.length)
				{
					var reward=Math.ceil(pokUser[player2].gold/10);
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
}

if(msg==cmds.giveup)//배틀 기권
{
	if(isbattle==1){
		if(sender==player1)
			{
				replier.reply(player1+"님이 배틀을 기권했어요.");
				java.lang.Thread.sleep(2000);
				var reward=Math.ceil(pokUser[player1].gold/10);
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
					java.lang.Thread.sleep(2000);
					var reward=Math.ceil(pokUser[player2].gold/10);
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
			else replier.reply("@"+sender+"\n배틀 참가자가 아니에요.");
	}
}

if(msg==cmds.title)//트레이너등급
{
	var res=[];
	for(var i=0;i<11;i++)
	{
		res.push(setting.rank.name[i]+"\n포켓몬 "+setting.rank.upif[i]+"마리 포획성공 시 등급업\n추가 탐험 성공률: +"+setting.rank.success[i]+"%\n추가 포획 성공률: +"+setting.rank.successcatch[i]+"%\n최대 체력: "+setting.rank.maxHp[i]+"\n탐험 소요시간 단축: -"+setting.rank.castT[i]+"%\n휴식시 "+(setting.rank.rest[i]/1000)+"초마다 체력 1 회복\n");
	}
	res.push(setting.rank.name[11]+"\n챔피언에게서 승리 시 등급업\n추가 탐험 성공률: +"+setting.rank.success[11]+"%\n추가 포획 성공률: +"+setting.rank.successcatch[11]+"%\n최대 체력: "+setting.rank.maxHp[11]+"\n탐험 소요시간 단축: -"+setting.rank.castT[11]+"%\n휴식시 "+(setting.rank.rest[11]/1000)+"초마다 체력 1 회복\n");
	replier.reply("포켓몬스터 게임 트레이너 등급"+"\u200b".repeat(500)+"\n"+res.join("\n"));
}

if(msg==cmds.ribbon)//리본종류
{
	var res=[];
	res.push("["+setting.ribbon.name[0]+"]\n배틀 0회 시 업그레이드\n추가 포획 성공률: +"+setting.ribbon.successcatch[0]+"%\n전설의 포켓몬 출현률: +"+setting.ribbon.g4[0]+"%\n레어 포켓몬 출현률: +"+setting.ribbon.g3[0]+"%\n볼 구매 할인: -"+setting.ribbon.balldc[0]+"%\n포켓몬 레벨업 및 스킬뽑기 할인: -"+setting.ribbon.upgradedc[0]+"%\n");
	for(var i=1;i<12;i++)
	{
		res.push("["+setting.ribbon.name[i]+"]\n배틀 "+setting.ribbon.upif[i-1]+"회 시 업그레이드\n추가 포획 성공률: +"+setting.ribbon.successcatch[i]+"%\n전설의 포켓몬 출현률: +"+setting.ribbon.g4[i]+"%\n레어 포켓몬 출현률: +"+setting.ribbon.g3[i]+"%\n볼 구매 할인: -"+setting.ribbon.balldc[i]+"%\n포켓몬 레벨업 및 스킬뽑기 할인: -"+setting.ribbon.upgradedc[i]+"%\n");
	}
	replier.reply("포켓몬스터 게임 리본 종류"+"\u200b".repeat(500)+"\n"+res.join("\n"));
}

if(msg==cmds.ballinfo)//볼강화 종류
{
	var res=[];
	for(var i=0;i<10;i++)
	{
		res.push("["+ballArr[i]+"]\n업그레이드 비용: "+setting.ballupPrice[i].comma()+"\n업그레이드에 필요한 포켓몬 발견 횟수: "+setting.ballupsucc[i]+"\n볼 1개당 가격: "+setting.ballPrice[i].comma()+"\n야생 포켓몬 레벨: "+((i+1)*8+1)+"~"+((i+1)*8+10)+"\n추가 포획률\n전설: +"+(setting.ballcatch[0]*i)+"%\n레어: +"+(setting.ballcatch[1]*i)+"%\n고급: +"+(setting.ballcatch[2]*i)+"%\n일반: +"+(setting.ballcatch[3]*i)+"%\n전설 포켓몬 출현률: +"+(setting.ballg4[i])+"%\n레어 포켓몬 출현률: +"+(setting.ballg3[i])+"%\n");
	}
	res.push("["+ballArr[10]+"]\n업그레이드 비용: -\n업그레이드에 필요한 포켓몬 발견 횟수: -\n볼 1개당 가격: "+setting.ballPrice[10].comma()+"\n야생 포켓몬 레벨: "+89+"~"+98+"\n추가 포획률\n전설: +"+(setting.ballcatch[0]*10)+"%\n레어: +"+(setting.ballcatch[1]*10)+"%\n고급: +"+(setting.ballcatch[2]*10)+"%\n일반: +"+(setting.ballcatch[3]*10)+"%\n전설 포켓몬 출현률: +"+(setting.ballg4[10])+"%\n레어 포켓몬 출현률: +"+(setting.ballg3[10])+"%\n");
	replier.reply("포켓몬스터 게임 볼 강화 목록"+"\u200b".repeat(500)+"\n"+res.join("\n"));
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
	cmds.info+": 내 트레이너 정보 (닉네임 같이 입력 시 해당 유저 정보)",
	cmds.ball+" (숫자): 볼 구매",
	cmds.rest+": 휴식(다시 사용시 휴식 종료)",
	cmds.sell+": 놓아주기(돈 획득)\n(박스 전체 포켓몬에 적용, 덱에 장착 혹은 잠금 상태의 포켓몬은 제외)",
	cmds.skillchange+" (덱 번호): 스킬 랜덤 뽑기(돈 소모)",
	cmds.skilllock+"/"+cmds.skillunlock+" (덱 번호) (스킬 번호): 스킬 뽑기 시 잠금 및 해제할 기술 선택",
	"(잠금 상태의 기술은 뽑기 시에도 고정, 단 잠금 갯수에 따라 뽑기 비용 상승)",
	cmds.levelup+" (덱 번호): 포켓몬 레벨업(돈 소모)",
	cmds.ballup+": 볼 업그레이드(돈 소모)",
	cmds.ballinfo+": 볼 업그레이드 목록",
	cmds.battlejoin+": 배틀(PVP), 두 명이 참가 시 매칭되어 배틀 진행",
	cmds.eventinfo+": 현재 진행중인 이벤트 보기",
	cmds.title+": 트레이너 등급 목록",
	cmds.ribbon+": 리본 목록",
	cmds.rank+": 트레이너 배틀 랭킹",
	cmds.giveup+": 배틀 기권"
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
	"포획한 포켓몬으로 덱을 꾸민 후에는 다른 유저와의 배틀(PVP) 를 통해 겨룰 수 있습니다.",
	"",
	"전체 명령어 보기: "+cmds.uphelp
	].join("\n"));
}

if(msg==cmds.eventinfo)//이벤트 보기
{
	var res="";
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
		replier.reply("포켓몬스터 게임 이벤트 목록\n"+"\u200b".repeat(500)+"\n\n현재 진행중인 이벤트가 없습니다.");
	else
		replier.reply("포켓몬스터 게임 이벤트 목록\n"+"\u200b".repeat(500)+"\n"+res);
}

if(msg=="@확률업뎃")//확률수정 이후 업뎃용
{
	pokUser[sender]=JSON.parse(FS.read("sdcard/Devel/Pokemon/Data/player_"+sender+'.json'));
	if(pokUser[sender]==null){
        replier.reply('@'+sender+'\n가입 정보가 없습니다.\n"'+cmds.join+'"으로 회원가입부터 진행해 주세요.');
        return;
    }
	var b=0;
	b=ballArr.indexOf(pokUser[sender].Ball);
	var nowr=0;
	nowr=setting.rank.name.indexOf(pokUser[sender].rank);
	
	while(setting.ballupsucc[b]>pokUser[sender].count.total)
	{
		b=b-1;
		pokUser[sender].Ball=ballArr[b];
	}
	pokUser[sender].maxHp=setting.rank.maxHp[nowr];
	pokUser[sender].rest=setting.rank.rest[nowr];
	pokUser[sender].castT=setting.rank.castT[nowr];
	pokUser[sender].success=setting.success+setting.rank.success[nowr];
	pokUser[sender].rank=setting.rank.name[nowr];
	
	pokUser[sender].Ball=ballArr[b];
	pokUser[sender].successcatch.g4=setting.catchsuccess[0]+(setting.ballcatch[0]*b)+setting.rank.successcatch[nowr];
	pokUser[sender].successcatch.g3=setting.catchsuccess[1]+(setting.ballcatch[1]*b)+setting.rank.successcatch[nowr];
	pokUser[sender].successcatch.g2=setting.catchsuccess[2]+(setting.ballcatch[2]*b)+setting.rank.successcatch[nowr];
	pokUser[sender].successcatch.g1=setting.catchsuccess[3]+(setting.ballcatch[3]*b)+setting.rank.successcatch[nowr];
	if(b>0){
		pokUser[sender].stat.g4=setting.p.g4+setting.ballg4[b];
		pokUser[sender].stat.g3=setting.p.g3+setting.ballg3[b];
	}
	if(pokUser[sender].ribbon==undefined) pokUser[sender].ribbon=setting.ribbon.name[0];
	if(pokUser[sender].balldc==undefined) pokUser[sender].balldc=setting.ribbon.balldc[0];
	if(pokUser[sender].upgradedc==undefined) pokUser[sender].upgradedc=setting.ribbon.upgradedc[0];
	pokUser[sender].successcatch.g4=pokUser[sender].successcatch.g4+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[sender].ribbon)];
	pokUser[sender].successcatch.g3=pokUser[sender].successcatch.g3+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[sender].ribbon)];
	pokUser[sender].successcatch.g2=pokUser[sender].successcatch.g2+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[sender].ribbon)];
	pokUser[sender].successcatch.g1=pokUser[sender].successcatch.g1+setting.ribbon.successcatch[setting.ribbon.name.indexOf(pokUser[sender].ribbon)];
	pokUser[sender].stat.g4=pokUser[sender].stat.g4+setting.ribbon.g4[setting.ribbon.name.indexOf(pokUser[sender].ribbon)];
	pokUser[sender].stat.g3=pokUser[sender].stat.g3+setting.ribbon.g3[setting.ribbon.name.indexOf(pokUser[sender].ribbon)];
	FileStream.write("sdcard/Devel/Pokemon/Data/player_"+sender+'.json', JSON.stringify(pokUser[sender]));
	replier.reply("@"+sender+"\n수정된 확률 반영 완료.");
}

if(msg=="@포켓몬리셋") //강제리셋
{
	replier.reply("강제 리로드. 비상시에만 사용해 주세요.");
	Api.reload("pok");
}

}

function onStartCompile() {
	var seasontext=["","봄","여름","가을","겨울"];
	if(month>4) month=month-4;
    Api.replyRoom("낚시터","포켓몬 게임 리로드.\n현재 계절: "+seasontext[month]);
}