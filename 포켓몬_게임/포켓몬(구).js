/*
포켓몬 소스 초기 버전
워낙 스파게티 코드라 현재는 정상적으로 작동하지 않을 수도 있습니다
*/

var c=0;
var isballselect=0;
var isskillselect=0;
var capture=0;
var skilltonew=" ";
var isgameend=0;
var ischangeselect=0;
var isforgetselect=0;
//배틀용 변수들
var nowplaying1=" ";
var nowplaying2=" ";
var typetexts;
var debufftexts;
var isbattle=0;
var p1num=0;
var p2num=0;
var p1pokname=" ";
var p2pokname=" ";
var p1poklevel=0;
var p2poklevel=0;
var t1=" ";
var t2=" ";
var p1hp;
var p2hp;
var p1pp;
var p2pp;
var enemyskills;
var myskills;
var weather;
var p1pokstats;
var p2pokstats;
var player = "";
var player2="";
var gymnum=0;
var start = false;
var turn=0;

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

function endGame(msg,replier)
{
	isbattle=0;
	p1hp=0;
	p2hp=0;
	t1="";
	p1pokname="";
	p2pokname="";
	p1poklevel=0;
	p2poklevel=0;
	p1num=0;
	p2num=0;
	turn=0;
	isballselect=0;
	isskillselect=0;
	ischangeselect=0;
	isforgetselect=0;
	Api.reload("by디벨");
}

//1 일반 2 약점 3 반감 4 무효

function typejudge(skilltype,typea,typeb){

if(skilltype==1)
{
if(typea==15||typeb==15)
return 4;
else if(typea==9||typeb==9||typea==6||typeb==6)
return 3;
else
return 1;
}
else if(skilltype==2)
{
if(typea==2||typeb==2||typea==3||typeb==3||typea==6||typeb==6||typea==17||typeb==17)
return 3;
else if(typea==4||typeb==4||typea==9||typeb==9||typea==10||typeb==10||typea==11||typeb==11)
return 2;
else
return 1;
}
else if(skilltype==3)
{
if(typea==3||typeb==3||typea==4||typeb==4||typea==17||typeb==17)
return 3;
else if(typea==2||typeb==2||typea==6||typeb==6||typea==7||typeb==7)
return 2;
else
return 1;
}
else if(skilltype==4)
{
if(typea==4||typeb==4||typea==2||typeb==2||typea==5||typeb==5||typea==9||typeb==9||typea==10||typeb==10||typea==13||typeb==13||typea==17||typeb==17)
return 3;
else if(typea==3||typeb==3||typea==6||typeb==6||typea==7||typeb==7)
return 2;
else
return 1;
}
else if(skilltype==5)
{
if(typea==6||typeb==6||typea==9||typeb==9||typea==12||typeb==12)
return 3;
else if(typea==4||typeb==4||typea==8||typeb==8||typea==10||typeb==10)
return 2;
else
return 1;
}
else if(skilltype==6)
{
if(typea==7||typeb==7||typea==8||typeb==8||typea==9||typeb==9)
return 3;
else if(typea==2||typeb==2||typea==5||typeb==5||typea==10||typeb==10||typea==11||typeb==11)
return 2;
else
return 1;
}
else if(skilltype==7)
{
if(typea==5||typeb==5)
return 4;
else if(typea==4||typeb==4||typea==10||typeb==10)
return 3;
else if(typea==2||typeb==2||typea==6||typeb==6||typea==9||typeb==9||typea==12||typeb==12||typea==13||typeb==13)
return 2;
else
return 1;
}
else if(skilltype==8)
{
if(typea==15||typeb==15)
return 4;
else if(typea==5||typeb==5||typea==14||typeb==14||typea==10||typeb==10||typea==13||typeb==13)
return 3;
else if(typea==1||typeb==1||typea==6||typeb==6||typea==9||typeb==9||typea==11||typeb==11||typea==16||typeb==16)
return 2;
else
return 1;
}
else if(skilltype==9)
{
if(typea==2||typeb==2||typea==3||typeb==3||typea==9||typeb==9||typea==12||typeb==12)
return 3;
else if(typea==6||typeb==6||typea==11||typeb==11)
return 2;
else
return 1;
}
else if(skilltype==10)
{
if(typea==2||typeb==2||typea==8||typeb==8||typea==9||typeb==9||typea==5||typeb==5||typea==13||typeb==13||typea==15||typeb==15)
return 3;
else if(typea==4||typeb==4||typea==14||typeb==14||typea==16||typeb==16)
return 2;
else
return 1;
}
else if(skilltype==11)
{
if(typea==2||typeb==2||typea==3||typeb==3||typea==9||typeb==9||typea==11||typeb==11)
return 3;
else if(typea==4||typeb==4||typea==5||typeb==5||typea==7||typeb==7||typea==17||typeb==17)
return 2;
else
return 1;
}
else if(skilltype==12)
{
if(typea==7||typeb==7)
return 4;
else if(typea==4||typeb==4||typea==12||typeb==12||typea==17||typeb==17)
return 3;
else if(typea==3||typeb==3||typea==5||typeb==5)
return 2;
else
return 1;
}
else if(skilltype==13)
{
if(typea==9||typeb==9)
return 4;
else if(typea==13||typeb==13||typea==7||typeb==7||typea==6||typeb==6||typea==15||typeb==15)
return 3;
else if(typea==4||typeb==4)
return 2;
else
return 1;
}
else if(skilltype==14)
{
if(typea==16||typeb==16)
return 4;
else if(typea==9||typeb==9||typea==14||typeb==14)
return 3;
else if(typea==8||typeb==8||typea==13||typeb==13)
return 2;
else
return 1;
}
else if(skilltype==15)
{
if(typea==1||typeb==1)
return 4;
else if(typea==16||typeb==16)
return 3;
else if(typea==14||typeb==14||typea==15||typeb==15)
return 2;
else
return 1;
}
else if(skilltype==16)
{
if(typea==8||typeb==8||typea==16||typeb==16)
return 3;
else if(typea==14||typeb==14||typea==15||typeb==15)
return 2;
else
return 1;
}
else if(skilltype==17)
{
if(typea==9||typeb==9)
return 3;
else if(typea==17||typeb==17)
return 2;
else
return 1;
}

}

function myturn(skillselect,replier)
{
   var attack=0;
   var accurate=0;
   accurate=p1pokstats[0]/100*(100-p2pokstats[1])/100*read(myskills[skillselect], "accr");
   if(read(myskills[skillselect], "damage")!=0)
      replier.reply(p1pokname+"의 "+myskills[skillselect]+"!");
   else
      replier.reply(p1pokname+"는 "+myskills[skillselect]+"를 썼다!");
   if(Math.floor(Math.random()*100)>accurate)
      replier.reply("그러나 "+p1pokname+"의 공격은 빗나갔다!");
   else
   {
      if(read(myskills[skillselect], "damage")!=0)
      {
		  if(myskills[skillselect]=="참기"||myskills[skillselect]=="카운터"||myskills[skillselect]=="미러코트"||myskills[skillselect]=="메탈버스트")
		  {
			  attack=read(p1pokname, "hp")-p1hp[p1num-1];
			  if(myskills[skillselect]=="카운터"||myskills[skillselect]=="미러코트")
				  attack=attack*3/2;
			  else if(myskills[skillselect]=="메탈버스트")
				  attack=attack*2;
		  }
		  else
			  attack=p1pokstats[2]*(100-(p2pokstats[3]/4))/100*read(myskills[skillselect], "damage")/100;
         var sw=typejudge(read(myskills[skillselect], "type"),read(p2pokname, "type1"),read(p2pokname, "type2"));
		 if(p2pokstats[9]==1)
		 {
			 attack=0;
			 replier.reply("상대 "+p2pokname+"는 공격으로부터 몸을 지켰다!");
			 p2pokstats[9]=0;
		 }
		 else if(sw!=4&&p2pokstats[7]==3&&read(myskills[skillselect], "type")==7)
		 {
			 attack=0;
			 replier.reply("상대 "+p2pokname+"는 부유하고 있어 공격에 맞지 않았다!");
		 }
         else if(sw==4)
         {
            attack=0;
            replier.reply("상대 "+p2pokname+"에게는 효과가 없는 것 같다...");
         }
         else if(sw==3)
         {
            attack=attack/2;
            replier.reply("효과가 별로인 듯하다");
         }
         else if(sw==2)
         {
            attack=attack*2;
            replier.reply("효과가 굉장했다!");
         }
		 if(weather[0]==1&&read(myskills[skillselect], "type")==2)
			 attack=attack*6/5;
		 else if(weather[0]==2&&read(myskills[skillselect], "type")==2)
			 attack=attack*4/5;
		 if(p2pokstats[7]==2)
			 attack=attack*4/5;
		 if(read(myskills[skillselect], "addi")==5)
            {
               var times=Math.floor(Math.random()*5)+1;
			   attack=attack*times;
               replier.reply(times+"번 맞았다!");
            }
		 if(read(myskills[skillselect], "type")==read(p1pokname, "type1")||read(myskills[skillselect], "type")==read(p1pokname, "type2"))
			 attack=attack*11/10;
         p2hp[p2num-1]=Math.ceil(p2hp[p2num-1]-attack);
         if(attack!=0)
         {
			 if(read(myskills[skillselect], "type")==2&&Math.floor(Math.random()*5)==1&&read(p2pokname, "type1")!=2&&read(p2pokname, "type2")!=2)
				 nonattacking("도깨비불",1,replier);
			 if(read(myskills[skillselect], "type")==13&&Math.floor(Math.random()*5)==1&&read(p2pokname, "type1")!=13&&read(p2pokname, "type2")!=13)
				 nonattacking("맹독",1,replier);
			 if(read(myskills[skillselect], "type")==12&&Math.floor(Math.random()*5)==1&&read(p2pokname, "type1")!=12&&read(p2pokname, "type2")!=12)
				 nonattacking("전기자석파",1,replier);
            if(myskills[skillselect]=="땅가르기"||myskills[skillselect]=="절대영도"||myskills[skillselect]=="뿔드릴"||myskills[skillselect]=="가위자르기")
               replier.reply("일격필살!");
            if(read(myskills[skillselect], "addi")==7)
            {
               p1hp[p1num-1]=Math.ceil(p1hp[p1num-1]-(attack/4));
               replier.reply(p1pokname+"는 공격의 반동을 입었다!");
            }
            else if(read(myskills[skillselect], "addi")==4)
            {
               p1hp[p1num-1]=Math.ceil(p1hp[p1num-1]+(attack/4));
			   if(p1hp[p1num-1]>read(p1pokname, "hp"))
				   p1hp[p1num-1]=read(p1pokname, "hp");
               replier.reply("상대 "+p2pokname+"로부터 체력을 흡수했다!");
            }
            else if(read(myskills[skillselect], "addi")==12)
            {
               p1hp[p1num-1]=1;

            }
			else if(read(myskills[skillselect], "addi")==11)
            {
				if((Math.floor(Math.random()*3))==1)
					nonattacking("칼춤",1,replier);
            }
			else if(read(myskills[skillselect], "addi")==8)
            {
				p1pokstats[9]=3;
            }
			else if(read(myskills[skillselect], "addi")==9)
            {
				p1pokstats[2]=p1pokstats[2]*4/5;
				replier.reply(p1pokname+"의 공격이 크게 떨어졌다!");
            }
			else if(read(myskills[skillselect], "addi")==3&&Math.floor(Math.random()*3)==1)
				p2pokstats[9]=4;
         }
         
      }
      else
      {
         //비공격형 스킬 구현 예정 부분
		 if(p2pokstats[7]==6)
			 replier.reply(p1pokname+"는 도발에 넘어가 있어 공격 이외의 기술은 쓸 수 없다!");
		 else
		 {
			 if(myskills[skillselect]=="손가락흔들기")
				 myfinger(replier);
			 else
				 nonattacking(myskills[skillselect],1,replier);
		 }
      }
      if(p2hp[p2num-1]<1)
      {
		if(myskills[skillselect]=="칼등치기")
			p2hp[p2num-1]=1;
		else
			p2hp[p2num-1]=0;
	  }
      if(p1hp[p1num-1]<1)
         p1hp[p1num-1]=0;
      replier.reply(p2pokname+"        ["+p2hp[p2num-1]+"/"+read(p2pokname, "hp")+"]  "+debufftexts[p2pokstats[5]]+"\n\n"+p1pokname+"        ["+p1hp[p1num-1]+"/"+read(p1pokname, "hp")+"]  "+debufftexts[p1pokstats[5]]+"\n");
   }
   p1pp[skillselect]--;
}

function enemyturn(skillselect,replier)
{
   var attack=0;
   var accurate=0;
   accurate=p2pokstats[0]/100*(100-p1pokstats[1])/100*read(enemyskills[skillselect], "accr");
   if(read(enemyskills[skillselect], "damage")!=0)
      replier.reply("상대 "+p2pokname+"의 "+enemyskills[skillselect]+"!");
   else
      replier.reply("상대 "+p2pokname+"는 "+enemyskills[skillselect]+"를 썼다!");
   if(Math.floor(Math.random()*100)>accurate)
      replier.reply("그러나 상대 "+p2pokname+"의 공격은 빗나갔다!");
   else
   {
      if(read(enemyskills[skillselect], "damage")!=0)
      {
		  if(enemyskills[skillselect]=="참기"||enemyskills[skillselect]=="카운터"||enemyskills[skillselect]=="미러코트"||enemyskills[skillselect]=="메탈버스트")
		  {
			  attack=read(p2pokname, "hp")-p2hp[p2num-1];
			  if(enemyskills[skillselect]=="카운터"||enemyskills[skillselect]=="미러코트")
				  attack=attack*3/2;
			  else if(enemyskills[skillselect]=="메탈버스트")
				  attack=attack*2;
		  }
		  else
			  attack=p2pokstats[2]*(100-(p1pokstats[3]/4))/100*read(enemyskills[skillselect], "damage")/100;
         var sw=typejudge(read(enemyskills[skillselect], "type"),read(p1pokname, "type1"),read(p1pokname, "type2"));
		 if(p1pokstats[9]==1)
		 {
			 attack=0;
			 replier.reply(p1pokname+"는 공격으로부터 몸을 지켰다!");
			 p1pokstats[9]=0;
		 }
		 else if(sw!=4&&p1pokstats[7]==3&&read(enemyskills[skillselect], "type")==7)
		 {
			 attack=0;
			 replier.reply(p1pokname+"는 부유하고 있어 공격에 맞지 않았다!");
		 }
         else if(sw==4)
         {
            attack=0;
            replier.reply(p1pokname+"에게는 효과가 없는 것 같다...");
         }
         else if(sw==3)
         {
            attack=attack/2;
            replier.reply("효과가 별로인 듯하다");
         }
         else if(sw==2)
         {
            attack=attack*2;
            replier.reply("효과가 굉장했다!");
         }
		 if(weather[0]==1&&read(enemyskills[skillselect], "type")==2)
			 attack=attack*6/5;
		 else if(weather[0]==2&&read(enemyskills[skillselect], "type")==2)
			 attack=attack*4/5;
		 if(p1pokstats[7]==2)
			 attack=attack*4/5;
		 if(read(enemyskills[skillselect], "type")==read(p2pokname, "type1")||read(enemyskills[skillselect], "type")==read(p2pokname, "type2"))
			 attack=attack*11/10;
		 if(read(enemyskills[skillselect], "addi")==5)
            {
               var times=Math.floor(Math.random()*5)+1;
			   attack=attack*times;
               replier.reply(times+"번 맞았다!");
            }
         p1hp[p1num-1]=Math.ceil(p1hp[p1num-1]-attack);
         if(attack!=0)
         {
			 if(read(enemyskills[skillselect], "type")==2&&Math.floor(Math.random()*5)==1&&read(p1pokname, "type1")!=2&&read(p1pokname, "type2")!=2)
				 nonattacking("도깨비불",2,replier);
			 if(read(enemyskills[skillselect], "type")==13&&Math.floor(Math.random()*5)==1&&read(p1pokname, "type1")!=13&&read(p1pokname, "type2")!=13)
				 nonattacking("맹독",2,replier);
			 if(read(enemyskills[skillselect], "type")==12&&Math.floor(Math.random()*5)==1&&read(p1pokname, "type1")!=12&&read(p2pokname, "type2")!=12)
				 nonattacking("전기자석파",2,replier);
            if(enemyskills[skillselect]=="땅가르기"||enemyskills[skillselect]=="절대영도"||enemyskills[skillselect]=="뿔드릴"||enemyskills[skillselect]=="가위자르기")
               replier.reply("일격필살!");
            if(read(enemyskills[skillselect], "addi")==7)
            {
               p2hp[p2num-1]=Math.ceil(p2hp[p2num-1]-(attack/4));
               replier.reply("상대 "+p2pokname+"는 공격의 반동을 입었다!");
            }
            else if(read(enemyskills[skillselect], "addi")==4)
            {
               p2hp[p2num-1]=Math.ceil(p2hp[p2num-1]+(attack/4));
			   if(p2hp[p2num-1]>read(p2pokname, "hp"))
				   p2hp[p2num-1]=read(p2pokname, "hp");
               replier.reply(p1pokname+"로부터 체력을 흡수했다!");
            }
            else if(read(enemyskills[skillselect], "addi")==12)
            {
               p2hp[p2num-1]=1;
            }
			else if(read(enemyskills[skillselect], "addi")==11)
            {
				if((Math.floor(Math.random()*3))==1)
					nonattacking("칼춤",2,replier);
            }
			else if(read(enemyskills[skillselect], "addi")==8)
            {
				p2pokstats[9]=3;
            }
			else if(read(enemyskills[skillselect], "addi")==9)
            {
				p2pokstats[2]=p2pokstats[2]*4/5;
				replier.reply("상대 "+p2pokname+"의 공격이 크게 떨어졌다!");
            }
			else if(read(enemyskills[skillselect], "addi")==3&&Math.floor(Math.random()*3)==1)
				p1pokstats[9]=4;
         }
         
      }
      else
      {
         //비공격형 스킬 구현 예정 부분
		 if(p1pokstats[7]==6)
			 replier.reply("상대 "+p2pokname+"는 도발에 넘어가 있어 공격 이외의 기술은 쓸 수 없다!");
		 else
		 {
			 if(enemyskills[skillselect]=="손가락흔들기")
				 enemyfinger(replier);
			 else
				 nonattacking(enemyskills[skillselect],2,replier);
		 }
      }
      if(p1hp[p1num-1]<1)
	  {
		if(enemyskills[skillselect]=="칼등치기")
			p1hp[p1num-1]=1;
		else
			p1hp[p1num-1]=0;
	  }
      if(p2hp[p2num-1]<1)
         p2hp[p2num-1]=0;
      replier.reply(p2pokname+"        ["+p2hp[p2num-1]+"/"+read(p2pokname, "hp")+"]  "+debufftexts[p2pokstats[5]]+"\n\n"+p1pokname+"        ["+p1hp[p1num-1]+"/"+read(p1pokname, "hp")+"]  "+debufftexts[p1pokstats[5]]+"\n");
   }
   p2pp[skillselect]--;
}

function nonattacking(skillname,user,replier)
{
	if(skillname=="울음소리"||skillname=="애교부리기")
	{
		if(user==1)
		{
			p2pokstats[2]=p2pokstats[2]*9/10;
			replier.reply("상대 "+p2pokname+"의 공격이 떨어졌다!");
		}
		else
		{
			p1pokstats[2]=p1pokstats[2]*9/10;
			replier.reply(p1pokname+"의 공격이 떨어졌다!");
		}
	}
	else if(skillname=="째려보기"||skillname=="꼬리흔들기")
	{
		if(user==1)
		{
			p2pokstats[3]=p2pokstats[3]*9/10;
			replier.reply("상대 "+p2pokname+"의 방어가 떨어졌다!");
		}
		else
		{
			p1pokstats[3]=p1pokstats[3]*9/10;
			replier.reply(p1pokname+"의 방어가 떨어졌다!");
		}
	}
	else if(skillname=="원한")
	{
		var skillto=Math.floor(Math.random()*4);
		if(user==1)
		{
			p2pp[skillto]=p2pp[skillto]-4;
			if(p2pp[skillto]<1)
				p2pp[skillto]=0;
			replier.reply("상대 "+p2pokname+"의 "+enemyskills[skillto]+"의 PP를 4 깎았다!");
		}
		else
		{
			p1pp[skillto]=p1pp[skillto]-4;
			if(p1pp[skillto]<1)
				p1pp[skillto]=0;
			replier.reply(p1pokname+"의 "+myskills[skillto]+"의 PP를 4 깎았다!");
		}
	}
	else if(skillname=="껍질에숨기"||skillname=="웅크리기"||skillname=="단단해지기"||skillname=="철벽"||skillname=="비축하기"||skillname=="충전")
	{
		if(user==1)
		{
			p1pokstats[3]=p1pokstats[3]*11/10;
			replier.reply(p1pokname+"의 방어가 올라갔다!");
		}
		else
		{
			p2pokstats[3]=p2pokstats[3]*11/10;
			replier.reply("상대 "+p2pokname+"의 방어가 올라갔다!");
		}
	}
	else if(skillname=="용의춤"||skillname=="칼춤"||skillname=="명상")
	{
		if(user==1)
		{
			p1pokstats[2]=p1pokstats[2]*11/10;
			p1pokstats[3]=p1pokstats[3]*11/10;
			if(p1pokstats[4]<5)
				p1pokstats[4]++;
			replier.reply(p1pokname+"의 모든 능력치가 올라갔다!");
		}
		else
		{
			p2pokstats[2]=p2pokstats[2]*11/10;
			p2pokstats[3]=p2pokstats[3]*11/10;
			if(p2pokstats[4]<5)
				p2pokstats[4]++;
			replier.reply("상대 "+p2pokname+"의 모든 능력치가 올라갔다!");
		}
	}
	else if(skillname=="쾌청")
	{
		weather[0]=1;
		weather[1]=1;
		replier.reply("햇살이 강해졌다!");
	}
	else if(skillname=="비바라기")
	{
		weather[0]=2;
		weather[1]=1;
		replier.reply("비가 내리기 시작했다!");
	}
	else if(skillname=="모래바람")
	{
		weather[0]=3;
		weather[1]=1;
		replier.reply("모래바람이 불기 시작했다!");
	}
	else if(skillname=="싸라기눈")
	{
		weather[0]=4;
		weather[1]=1;
		replier.reply("싸라기눈이 내리기 시작했다!");
	}
	else if(skillname=="실뿜기"||skillname=="겁나는얼굴")
	{
		if(user==1)
		{
			if(p2pokstats[4]>1)
				p2pokstats[4]--;
			replier.reply("상대 "+p2pokname+"의 스피드가 떨어졌다!");
		}
		else
		{
			if(p1pokstats[4]>1)
				p1pokstats[4]--;
			replier.reply(p1pokname+"의 스피드가 떨어졌다!");
		}
	}
	else if(skillname=="록커트"||skillname=="고속이동")
	{
		if(user==1)
		{
			if(p1pokstats[4]<5)
				p1pokstats[4]++;
			replier.reply(p1pokname+"의 스피드가 올라갔다!");
		}
		else
		{
			if(p2pokstats[4]<5)
				p2pokstats[4]++;
			replier.reply("상대 "+p2pokname+"의 스피드가 올라갔다!");
		}
	}
	else if(skillname=="이상한빛"||skillname=="초음파"||skillname=="천사의키스"||skillname=="뽐내기")
	{
		if(user==1)
		{
			if(p2pokstats[5]!=0)
				replier.reply("그러나 실패하고 말았다!");
			else
			{
				if(skillname=="뽐내기")
				{
					p2pokstats[2]=p2pokstats[2]*6/5;
					replier.reply("상대 "+p2pokname+"의 공격이 크게 올라갔다!");
				}
				p2pokstats[5]=6;
				p2pokstats[6]=1;
				replier.reply("상대 "+p2pokname+"는 혼란에 빠졌다!");
			}
		}
		else
		{
			if(p1pokstats[5]!=0)
				replier.reply("그러나 실패하고 말았다!");
			else
			{
				if(skillname=="뽐내기")
				{
					p1pokstats[2]=p1pokstats[2]*6/5;
					replier.reply(p1pokname+"의 공격이 크게 올라갔다!");
				}
				p1pokstats[5]=6;
				p1pokstats[6]=1;
				replier.reply(p1pokname+"는 혼란에 빠졌다!");
			}
		}
	}
	else if(skillname=="최면술"||skillname=="노래하기"||skillname=="풀피리"||skillname=="악마의키스"||skillname=="하품"||skillname=="다크홀"||skillname=="수면가루")
	{
		if(user==1)
		{
			if(p2pokstats[5]!=0)
				replier.reply("그러나 실패하고 말았다!");
			else
			{
				p2pokstats[5]=5;
				p2pokstats[6]=1;
				replier.reply("상대 "+p2pokname+"는 잠들어 버렸다!");
			}
		}
		else
		{
			if(p1pokstats[5]!=0)
				replier.reply("그러나 실패하고 말았다!");
			else
			{
				p1pokstats[5]=5;
				p1pokstats[6]=1;
				replier.reply(p1pokname+"는 잠들어 버렸다!");
			}
		}
	}
	else if(skillname=="전기자석파"||skillname=="저리가루")
	{
		if(user==1)
		{
			if(p2pokstats[5]!=0||read(p2pokname, "type1")==12||read(p2pokname, "type2")==12||read(p2pokname, "type1")==7||read(p2pokname, "type2")==7)
				replier.reply("그러나 실패하고 말았다!");
			else
			{
				p2pokstats[5]=1;
				p2pokstats[6]=1;
				replier.reply("상대 "+p2pokname+"는 몸이 마비되었다!");
			}
		}
		else
		{
			if(p1pokstats[5]!=0||read(p1pokname, "type1")==12||read(p1pokname, "type2")==12||read(p1pokname, "type1")==7||read(p1pokname, "type2")==7)
				replier.reply("그러나 실패하고 말았다!");
			else
			{
				p1pokstats[5]=1;
				p1pokstats[6]=1;
				replier.reply(p1pokname+"는 몸이 마비되었다!");
			}
		}
	}
	else if(skillname=="잠자기")
	{
		if(user==1)
		{
			p1pokstats[5]=5;
			p1pokstats[6]=1;
			replier.reply(p1pokname+"는 잠을 자기 시작했다!");
			p1hp[p1num-1]=read(p1pokname, "hp");
			replier.reply(p1pokname+"의 체력이 완전히 회복되었다!");
		}
		else
		{
			p2pokstats[5]=5;
			p2pokstats[6]=1;
			replier.reply("상대 "+p2pokname+"는 잠을 자기 시작했다!");
			p2hp[p2num-1]=read(p2pokname, "hp");
			replier.reply("상대 "+p2pokname+"의 체력이 완전히 회복되었다!");
		}
	}
	else if(skillname=="맹독")
	{
		if(user==1)
		{
			if(p2pokstats[5]!=0||read(p2pokname, "type1")==13||read(p2pokname, "type2")==13||read(p2pokname, "type1")==9||read(p2pokname, "type2")==9)
				replier.reply("그러나 실패하고 말았다!");
			else
			{
				p2pokstats[5]=4;
				p2pokstats[6]=1;
				replier.reply("상대 "+p2pokname+"의 몸에 독이 퍼졌다!");
			}
		}
		else
		{
			if(p1pokstats[5]!=0||read(p1pokname, "type1")==13||read(p1pokname, "type2")==13||read(p1pokname, "type1")==9||read(p1pokname, "type2")==9)
				replier.reply("그러나 실패하고 말았다!");
			else
			{
				p1pokstats[5]=4;
				p1pokstats[6]=1;
				replier.reply(p1pokname+"의 몸에 독이 퍼졌다!");
			}
		}
	}
	else if(skillname=="도깨비불")
	{
		if(user==1)
		{
			if(p2pokstats[5]!=0||read(p2pokname, "type1")==2||read(p2pokname, "type2")==2)
				replier.reply("그러나 실패하고 말았다!");
			else
			{
				p2pokstats[5]=3;
				p2pokstats[6]=1;
				replier.reply("상대 "+p2pokname+"는 화상을 입었다!");
			}
		}
		else
		{
			if(p1pokstats[5]!=0||read(p1pokname, "type1")==2||read(p1pokname, "type2")==2)
				replier.reply("그러나 실패하고 말았다!");
			else
			{
				p1pokstats[5]=3;
				p1pokstats[6]=1;
				replier.reply(p1pokname+"는 화상을 입었다!");
			}
		}
	}
	else if(skillname=="트릭룸")
	{
		var tempspd=0;
		tempspd=p2pokstats[4];
		p2pokstats[4]=p1pokstats[4];
		p1pokstats[4]=tempspd;
		if(user==1)
			replier.reply(p1pokname+"는 시공을 뒤틀었다!");
		else
			replier.reply("상대 "+p2pokname+"는 시공을 뒤틀었다!");
	}
	else if(skillname=="연막")
	{
		if(user==1)
		{
			if(p2pokstats[1]>50)
				p2pokstats[0]=p2pokstats[0]-10;
			replier.reply("상대 "+p2pokname+"의 명중률이 떨어졌다!");
		}
		else
		{
			if(p1pokstats[1]>50)
				p1pokstats[0]=p1pokstats[0]-10;
			replier.reply(p1pokname+"의 명중률이 떨어졌다!");
		}
	}
	else if(skillname=="안개제거"||skillname=="꿰뚫어보기")
	{
		if(user==1)
		{
			p2pokstats[1]=0;
			replier.reply("상대 "+p2pokname+"의 회피율이 초기화되었다!");
		}
		else
		{
			p1pokstats[1]=0;
			replier.reply(p1pokname+"의 회피율이 초기화되었다!");
		}
	}
	else if(skillname=="그림자분신"||skillname=="작아지기")
	{
		if(user==1)
		{
			if(p1pokstats[1]<50)
				p1pokstats[1]=p1pokstats[1]+10;
			replier.reply(p1pokname+"의 회피율이 올라갔다!");
		}
		else
		{
			if(p2pokstats[1]<50)
				p2pokstats[1]=p2pokstats[1]+10;
			replier.reply("상대 "+p2pokname+"의 회피율이 올라갔다!");
		}
	}
	else if(skillname=="HP회복"||skillname=="우유마시기"||skillname=="알낳기"||skillname=="치유소원"||skillname=="희망사항"||skillname=="광합성"||skillname=="회복지령")
	{
		var maxhp=0;
		if(user==1)
		{
			maxhp=read(p1pokname, "hp")
			p1hp[p1num-1]=Math.ceil(p1hp[p1num-1]+maxhp/2);
			if(p1hp[p1num-1]>maxhp)
				p1hp[p1num-1]=maxhp;
			replier.reply(p1pokname+"는 체력을 회복했다!");
		}
		else
		{
			maxhp=read(p2pokname, "hp")
			p2hp[p2num-1]=Math.ceil(p2hp[p2num-1]+maxhp/2);
			if(p2hp[p2num-1]>maxhp)
				p2hp[p2num-1]=maxhp;
			replier.reply("상대 "+p2pokname+"는 체력을 회복했다!");
		}
	}
	else if(skillname=="방어"||skillname=="판별"||skillname=="방어지령")
	{
		var issuccess=Math.floor(Math.random()*2);
		if(user==1)
		{
			if(issuccess==1)
			{
				p1pokstats[9]=1;
				replier.reply(p1pokname+"는 방어 태세에 들어갔다!");
			}
			else
				replier.reply("그러나 실패하고 말았다!");
		}
		else
		{
			if(issuccess==1)
			{
				p2pokstats[9]=1;
				replier.reply("상대 "+p2pokname+"는 방어 태세에 들어갔다!");
			}
			else
				replier.reply("그러나 실패하고 말았다!");
		}
	}
	else if(skillname=="리플렉터"||skillname=="빛의장막")
	{
		if(user==1)
		{
			p1pokstats[7]=2;
			p1pokstats[8]=1;
			replier.reply(p1pokname+"는 공격에 좀더 강해졌다!");
		}
		else
		{

			p2pokstats[7]=2;
			p2pokstats[8]=1;
			replier.reply("상대 "+p2pokname+"는 공격에 좀더 강해졌다!");

		}
	}
	else if(skillname=="전자부유")
	{
		if(user==1)
		{
			p1pokstats[7]=3;
			p1pokstats[8]=1;
			replier.reply(p1pokname+"는 공중으로 떠올랐다!");
		}
		else
		{

			p2pokstats[7]=3;
			p2pokstats[8]=1;
			replier.reply("상대 "+p2pokname+"는 공중으로 떠올랐다!");

		}
	}
	else if(skillname=="도발")
	{
		if(user==1)
		{
			p1pokstats[7]=6;
			replier.reply("상대 "+p2pokname+"는 도발에 넘어가 버렸다!");
		}
		else
		{

			p2pokstats[7]=6;
			replier.reply(p1pokname+"는 도발에 넘어가 버렸다!");

		}
	}
	else if(skillname=="검은눈빛")
	{
		if(user==1)
		{
			p1pokstats[7]=5;
			replier.reply("상대 "+p2pokname+"는 도망칠 수 없게 되었다!");
		}
		else
		{

			p2pokstats[7]=5;
			replier.reply(p1pokname+"는 도망칠 수 없게 되었다!");

		}
	}
	else if(skillname=="튀어오르기")
		replier.reply("그러나 아무 일도 일어나지 않았다!");
	else
		replier.reply("그러나 실패하고 말았다!");
}

function weatherw(replier)
{
	if(weather[1]>2)
	{
		weather[0]=0;
		weather[1]=0;
		replier.reply("날씨가 원래대로 돌아갔다!");
	}
	else if(weather[0]!=0)
	{
		if(weather[0]==1)
			replier.reply("햇살이 강하다");
		if(weather[0]==2)
			replier.reply("비가 내리고 있다");
		if(weather[0]==3)
		{
			replier.reply("모래바람이 세차게 분다");
			if(read(p2pokname, "type1")!=6&&read(p2pokname, "type2")!=6&&read(p2pokname, "type1")!=7&&read(p2pokname, "type2")!=7&&read(p2pokname, "type1")!=9&&read(p2pokname, "type2")!=9)
			{
				p2hp[p2num-1]=Math.ceil(p2hp[p2num-1]*9/10);
				replier.reply("모래바람이 상대 "+p2pokname+"를 덮쳤다!");
			}
			if(read(p1pokname, "type1")!=6&&read(p1pokname, "type2")!=6&&read(p1pokname, "type1")!=7&&read(p1pokname, "type2")!=7&&read(p1pokname, "type1")!=9&&read(p1pokname, "type2")!=9)
			{
				p1hp[p1num-1]=Math.ceil(p1hp[p1num-1]*9/10);
				replier.reply("모래바람이 "+p1pokname+"를 덮쳤다!");
			}
		}
		if(weather[0]==4)
		{
			replier.reply("싸라기눈이 내리고 있다");
			if(read(p2pokname, "type1")!=11&&read(p2pokname, "type2")!=11)
			{
				p2hp[p2num-1]=Math.ceil(p2hp[p2num-1]*9/10);
				replier.reply("싸라기눈이 상대 "+p2pokname+"를 덮쳤다!");
			}
			if(read(p1pokname, "type1")!=11&&read(p1pokname, "type2")!=11)
			{
				p1hp[p1num-1]=Math.ceil(p1hp[p1num-1]*9/10);
				replier.reply("싸라기눈이 "+p1pokname+"를 덮쳤다!");
			}
		}
		weather[1]++;
		replier.reply(p2pokname+"        ["+p2hp[p2num-1]+"/"+read(p2pokname, "hp")+"]  "+debufftexts[p2pokstats[5]]+"\n\n"+p1pokname+"        ["+p1hp[p1num-1]+"/"+read(p1pokname, "hp")+"]  "+debufftexts[p1pokstats[5]]+"\n");
	}
}

function debuffw(replier)
{
	if(p2pokstats[5]!=0||p1pokstats[5]!=0)
	{
		if(p2pokstats[5]==3)
		{
			p2hp[p2num-1]=Math.ceil(p2hp[p2num-1]*9/10);
			replier.reply("상대 "+p2pokname+"는 화상에 의한 데미지를 입고 있다");
		}
		else if(p2pokstats[5]==4)
		{
			p2hp[p2num-1]=Math.ceil(p2hp[p2num-1]*9/10);
			replier.reply("상대 "+p2pokname+"는 독에 의한 데미지를 입고 있다");
		}
		if(p1pokstats[5]==3)
		{
			p1hp[p1num-1]=Math.ceil(p1hp[p1num-1]*9/10);
			replier.reply(p1pokname+"는 화상에 의한 데미지를 입고 있다");
		}
		else if(p1pokstats[5]==4)
		{
			p1hp[p1num-1]=Math.ceil(p1hp[p1num-1]*9/10);
			replier.reply(p1pokname+"는 독에 의한 데미지를 입고 있다");
		}
		if(p1pokstats[5]!=0)
			p1pokstats[6]++;
		if(p2pokstats[5]!=0)
			p2pokstats[6]++;
		if(p1pokstats[6]>3)
		{
			if(p1pokstats[5]==5)
			{
				replier.reply(p1pokname+"는 눈을 떴다!");
				p1pokstats[5]=0;
				p1pokstats[6]=0;
			}
			else if(p1pokstats[5]==6)
			{
				replier.reply(p1pokname+"의 혼란이 풀렸다!");
				p1pokstats[5]=0;
				p1pokstats[6]=0;
			}
			
		}
		if(p2pokstats[6]>3)
		{
			if(p2pokstats[5]==5)
			{
				replier.reply("상대 "+p2pokname+"는 눈을 떴다!");
				p2pokstats[5]=0;
				p2pokstats[6]=0;
			}
			else if(p2pokstats[5]==6)
			{
				replier.reply("상대 "+p2pokname+"의 혼란이 풀렸다!");
				p2pokstats[5]=0;
				p2pokstats[6]=0;
			}
			
		}
		replier.reply(p2pokname+"        ["+p2hp[p2num-1]+"/"+read(p2pokname, "hp")+"]  "+debufftexts[p2pokstats[5]]+"\n\n"+p1pokname+"        ["+p1hp[p1num-1]+"/"+read(p1pokname, "hp")+"]  "+debufftexts[p1pokstats[5]]+"\n");
	}
}

function mykilled(sender,replier)
{
   var allkilled=1;
   var i=0;
   var ttemp="";
   for(i=0;i<6;i++)
   {
      if(p1hp[i]!=0&&p1hp[i]!=(-1))
      {
         allkilled=0;
         //break;
      }
   }   
   if(allkilled==0)
   {
      var nowmypoks=new Array("","","","","","");
      for(i=0;i<6;i++)
      {
         
         if(p1hp[i]!=(-1))
         {
            ttemp="Pok"+(i+1)+"name";
            nowmypoks[i]=read(t1, ttemp)+"   "+p1hp[i]+"/"+read(read(t1, ttemp), "hp")+" ";
            if(p1hp[i]==0)
               nowmypoks[i]=nowmypoks[i]+"  [기절]";
         }
      }
      replier.reply("1. "+nowmypoks[0]+"\n2. "+nowmypoks[1]+"\n3. "+nowmypoks[2]+"\n4. "+nowmypoks[3]+"\n5. "+nowmypoks[4]+"\n6. "+nowmypoks[5]+"\n\n다음으로 내보낼 포켓몬을 선택해 주세요.\n(/교체 1 이런 형식으로 사용해 주세요)");
      ischangeselect=1;
   }
   else
   {
      replier.reply(sender+"는 더 이상 싸울 포켓몬이 없다!");
      replier.reply(sender+"는 배틀에서 패배했다!");
      isgameend=1;
	  endGame(msg,replier);
   }
}
//
function enemykilled(sender,replier)
{
   var allkilled=1;
   var i=0;
   var ttemp="";
   for(i=0;i<6;i++)
   {
      if(p2hp[i]!=0&&p2hp[i]!=(-1))
      {
         allkilled=0;
         break;
      }
   }   
   if(allkilled==0)
   {
         var temp="";
         var tempname="";
		 p2num++;
         temp="Pok"+p2num+"name";
         tempname=read(t2, temp);
         p2pokname=tempname;
         temp="Pok"+p2num+"skill";
         tempname=read(t2, temp);
         for(i=0;i<4;i++)
         {
            if(tempname.split('/')[i]!=" ")
              enemyskills[i]=tempname.split('/')[i];
         }
         for(i=0;i<4;i++)
         {
            if(enemyskills[i]!=" ")
               p2pp[i]=read(enemyskills[i], "pp");
         }
         p2pokstats=new Array(100,0,read(p2pokname, "atk"),read(p2pokname, "def"),read(p2pokname, "spd"),0,0,0,0);
		 if(isbattle==3)
			 replier.reply("챔피언 "+player2+"는 "+p2pokname+"를 내보냈다!");
		 else
			 replier.reply("체육관 관장 "+player2+"는 "+p2pokname+"를 내보냈다!");
         replier.reply(p2pokname+"        ["+p2hp[p2num-1]+"/"+read(p2pokname, "hp")+"]  "+debufftexts[p2pokstats[5]]+"\n\n"+p1pokname+"        ["+p1hp[p1num-1]+"/"+read(p1pokname, "hp")+"]  "+debufftexts[p1pokstats[5]]+"\n");
         //replier.reply(p1pokname+"는 무엇을 할까?\n\n1. 싸운다\n2. 볼\n3. 도망간다\n4. 포켓몬 교체\n\n(/싸운다 이런 형식으로 사용해주세요)");
	}
   else
   {
      var r=Math.floor(Math.random()*10);
      if(r==2||r==3)
         newskill(replier);
      else if(r==1)
         evolute(replier);
	 else
	 {
		replier.reply(sender+"는 배틀에서 승리했다!");
		if(isbattle==2)
			wingym(sender,replier);
		else if(isbattle==3)
			winchamp(sender,replier);
		isgameend=2;
		endGame(msg,replier);
	 }
      
}
}

function newskill(replier)
{
   var isskillfull=1;
   var emptynum=0;
   var i=0;
   var skillnum=read(p1pokname, "skills").split('/').length;
   var skillarr=read(p1pokname, "skills").split('/');
   for(i=0;i<4;i++)
   {
      if(myskills[i]==" ")
      {
         isskillfull=0;
         emptynum=i;
         break;
      }
   }
   skilltonew=skillarr[Math.floor(Math.random()*skillnum)];
   if(isskillfull==0)
   {
		myskills[emptynum]=skilltonew;
		var temp="Pok"+p1num+"skill";
		user(t1, temp, myskills[0]+"/"+myskills[1]+"/"+myskills[2]+"/"+myskills[3]);
		replier.reply(p1pokname+"은 새로 "+skilltonew+"를 배웠다!");
		skilltonew=" ";
		replier.reply(sender+"는 배틀에서 승리했다!");
		if(isbattle==2)
			wingym(sender,replier);
		else if(isbattle==3)
			winchamp(sender,replier);
		isgameend=2;
		endGame(msg,replier);
   }
   else
   {
      replier.reply(p1pokname+"은 새로 "+skilltonew+"를 배우고 싶다....");
      replier.reply("하지만 "+p1pokname+"은 이미 4개의 기술을 익힌 상태이기 때문에 더 이상 배울 수 없다!");
      replier.reply("1. "+myskills[0]+"\n2. "+myskills[1]+"\n3. "+myskills[2]+"\n4. "+myskills[3]+"\n\n"+skilltonew+"를 배우기 위해 잊게 할 기술을 선택해 주십시오\n(/잊기 1 이런 형식으로 사용해 주세요)\n(잊게 하지 않으려면 /잊기 0 을 해주세요)");
      isforgetselect=1;
   }
}

function judgeenemystatus(e,replier)
{
	
	if(p2pokstats[5]==5)
		replier.reply("상대 "+p2pokname+"는 쿨쿨 잠들어 있다");
	else if(p2pokstats[9]==3)
	{
		p2pokstats[9]=0;
		replier.reply("공격의 반동으로 상대 "+p2pokname+"는 움직일 수 없었다!");
	}
	else if(p2pokstats[9]==4)
	{
		p2pokstats[9]=0;
		replier.reply("상대 "+p2pokname+"는 풀이 죽어 움직일 수 없었다!");
	}
	else if(p2pokstats[5]==6)
	{
		var isattackable=Math.floor(Math.random()*4);
		replier.reply("상대 "+p2pokname+"는 혼란에 빠져 있다");
		if(isattackable==1)
		{
			p2hp[p2num-1]=Math.ceil(p2hp[p2num-1]*9/10);
			replier.reply("영문도 모른 채 자신을 공격했다!");
		}
		else
		enemyturn(e,replier);
	}
	else if(p2pokstats[5]==1||p2pokstats[5]==2)
	{
		var isattackable=Math.floor(Math.random()*4);
		if(isattackable==1)
		{
			if(p2pokstats[5]==1)
				replier.reply("상대 "+p2pokname+"는 몸이 저려 움직일 수 없었다");
			else
				replier.reply("상대 "+p2pokname+"는 몸이 얼어붙어 움직일 수 없었다");
		}
		else
		enemyturn(e,replier);
	}
	else
	{
		enemyturn(e,replier);
	}
}

function judgemystatus(e,replier)
{
	
	if(p1pokstats[5]==5)
		replier.reply(p1pokname+"는 쿨쿨 잠들어 있다");
	else if(p1pokstats[9]==3)
	{
		p1pokstats[9]=0;
		replier.reply("공격의 반동으로 "+p1pokname+"는 움직일 수 없었다!");
	}
	else if(p1pokstats[9]==4)
	{
		p1pokstats[9]=0;
		replier.reply(p1pokname+"는 풀이 죽어 움직일 수 없었다!");
	}
	else if(p1pokstats[5]==6)
	{
		var isattackable=Math.floor(Math.random()*4);
		replier.reply(p1pokname+"는 혼란에 빠져 있다");
		if(isattackable==1)
		{
			p1hp[p1num-1]=Math.ceil(p1hp[p1num-1]*9/10);
			replier.reply("영문도 모른 채 자신을 공격했다!");
		}
		else
		myturn(e,replier);
	}
	else if(p1pokstats[5]==1||p1pokstats[5]==2)
	{
		var isattackable=Math.floor(Math.random()*4);
		if(isattackable==1)
		{
			if(p1pokstats[5]==1)
				replier.reply(p1pokname+"는 몸이 저려 움직일 수 없었다");
			else
				replier.reply(p1pokname+"는 몸이 얼어붙어 움직일 수 없었다");
		}
		else
		myturn(e,replier);
	}
	else
	{
		myturn(e,replier);
	}
}

function evolute(replier)
{
   var temp="Pok"+p1num+"name";
   var evoluted="";
   if(read(p1pokname, "nextup")!="x")
   {
      replier.reply("어라? "+p1pokname+"의 모습이...")
      if(read(p1pokname, "nextup").split('/').length<2)
         evoluted=read(p1pokname, "nextup");
      else
      {
         var r=Math.floor(Math.random()*(read(p1pokname, "nextup").split('/').length));
         evoluted=read(p1pokname, "nextup").split('/')[r];
      }
      user(t1, temp, evoluted);
      replier.reply("축하합니다! "+p1pokname+"는 "+read(t1, temp)+"으로 진화했습니다!");
      if(read(t1, temp)=="x")
         user(t1, temp, p1pokname);
      p1pokname=read(t1, temp);
      newskill(replier);
   }
}

function wingym(sender,replier)
{
	var i=0;
	var temparr=read(t1, "Badge").split('/');
	temparr[gymnum-1]=1;
	var tempstr="";
	tempstr=temparr[0]+"/"+temparr[1];
	for(i=2;i<18;i++)
		tempstr=tempstr+"/"+temparr[i];
	user(t1, "Badge", tempstr);
	replier.reply(sender+"는 "+gymnum+"번째 뱃지를 받았다!");
	gymnum=0;
	t2=" ";
	player2=" ";
}

function winchamp(sender,replier)
{
	var i=0;
	var tempstr="";
	user("champion", "Champname", sender);
	tempstr=read("champlog", "Champlogs")+","+sender;
	user("champlog", "Champlogs", tempstr);
	user("champlog", "Champnum", read("champlog", "Champnum")+1);
	replier.reply("새로운 챔피언 "+sender+"님이 탄생했습니다!");
	for(i=0;i<6;i++)
	{
		tempstr="Pok"+(i+1)+"name";
		user("champion", tempstr, read(t1, tempstr));
		tempstr="Pok"+(i+1)+"skill";
		user("champion", tempstr, read(t1, tempstr));
	}
	replier.reply("전당등록을 축하합니다!\n\n"+read("champion", "Pok1name")+"     "+read("champion", "Pok1skill")+"\n"+read("champion", "Pok2name")+"     "+read("champion", "Pok2skill")+"\n"+read("champion", "Pok3name")+"     "+read("champion", "Pok3skill")+"\n"+read("champion", "Pok4name")+"     "+read("champion", "Pok4skill")+"\n"+read("champion", "Pok5name")+"     "+read("champion", "Pok5skill")+"\n"+read("champion", "Pok6name")+"     "+read("champion", "Pok6skill")+"\n\n챔피언 이름: "+read("champion", "Champname")+"\n"+read("champlog", "Champnum")+"대 챔피언");
	t2=" ";
	player2=" ";
}

function reflector(replier)
{
	if(p2pokstats[7]==2||p2pokstats[7]==3)
	{
		p2pokstats[8]++;
		if(p2pokstats[8]>3)
		{
			p2pokstats[7]=0;
			p2pokstats[8]=0;
			if(p2pokstats[7]==2)
				replier.reply("상대 앞의 마법의 벽이 사라졌다!");
			else if(p2pokstats[7]==3)
				replier.reply("상대 "+p2pokname+"는 지상으로 내려왔다!");
		}
	}
	if(p1pokstats[7]==2||p1pokstats[7]==3)
	{
		p1pokstats[8]++;
		if(p1pokstats[8]>3)
		{
			p1pokstats[7]=0;
			p1pokstats[8]=0;
			if(p1pokstats[7]==2)
				replier.reply("우리 팀 앞의 마법의 벽이 사라졌다!");
			else if(p1pokstats[7]==3)
				replier.reply(p1pokname+"는 지상으로 내려왔다!");
		}
	}
	
}

function myfinger(replier)
{
	var ttext1="";
	var rskill="";
	var rtype=Math.floor(Math.random()*17)+1;
	ttext1="skill"+rtype;
	var asd=Math.floor(Math.random()*(read("finger", ttext1).split('/').length));
	rskill=read("finger", ttext1).split('/')[asd];
	replier.reply("손가락을 흔들었더니 "+rskill+"가 나왔다!");
	var attack=0;
	var accurate=0;
	accurate=p1pokstats[0]/100*(100-p2pokstats[1])/100*read(rskill, "accr");
	if(Math.floor(Math.random()*100)>accurate)
      replier.reply("그러나 "+p1pokname+"의 공격은 빗나갔다!");
	else
	{
		if(rskill=="참기"||rskill=="카운터"||rskill=="미러코트"||rskill=="메탈버스트")
		  {
			  attack=read(p1pokname, "hp")-p1hp[p1num-1];
			  if(rskill=="카운터"||rskill=="미러코트")
				  attack=attack*3/2;
			  else if(rskill=="메탈버스트")
				  attack=attack*2;
		  }
		  else
			  attack=p1pokstats[2]*(100-(p2pokstats[3]/4))/100*read(rskill, "damage")/100;
         var sw=typejudge(read(rskill, "type"),read(p2pokname, "type1"),read(p2pokname, "type2"));
		 if(p2pokstats[9]==1)
		 {
			 attack=0;
			 replier.reply("상대 "+p2pokname+"는 공격으로부터 몸을 지켰다!");
			 p2pokstats[9]=0;
		 }
		 else if(sw!=4&&p2pokstats[7]==3&&read(rskill, "type")==7)
		 {
			 attack=0;
			 replier.reply("상대 "+p2pokname+"는 부유하고 있어 공격에 맞지 않았다!");
		 }
         else if(sw==4)
         {
            attack=0;
            replier.reply("상대 "+p2pokname+"에게는 효과가 없는 것 같다...");
         }
         else if(sw==3)
         {
            attack=attack/2;
            replier.reply("효과가 별로인 듯하다");
         }
         else if(sw==2)
         {
            attack=attack*2;
            replier.reply("효과가 굉장했다!");
         }
		 if(weather[0]==1&&read(rskill, "type")==2)
			 attack=attack*6/5;
		 else if(weather[0]==2&&read(rskill, "type")==2)
			 attack=attack*4/5;
		 if(p2pokstats[7]==2)
			 attack=attack*4/5;
		 if(read(rskill, "addi")==5)
            {
               var times=Math.floor(Math.random()*5)+1;
			   attack=attack*times;
               replier.reply(times+"번 맞았다!");
            }
		 if(read(rskill, "type")==read(p1pokname, "type1")||read(rskill, "type")==read(p1pokname, "type2"))
			 attack=attack*11/10;
         p2hp[p2num-1]=Math.ceil(p2hp[p2num-1]-attack);
         if(attack!=0)
         {
			 if(read(rskill, "type")==2&&Math.floor(Math.random()*5)==1&&read(p2pokname, "type1")!=2&&read(p2pokname, "type2")!=2)
				 nonattacking("도깨비불",1,replier);
			 if(read(rskill, "type")==13&&Math.floor(Math.random()*5)==1&&read(p2pokname, "type1")!=13&&read(p2pokname, "type2")!=13)
				 nonattacking("맹독",1,replier);
			 if(read(rskill, "type")==12&&Math.floor(Math.random()*5)==1&&read(p2pokname, "type1")!=12&&read(p2pokname, "type2")!=12)
				 nonattacking("전기자석파",1,replier);
            if(rskill=="땅가르기"||rskill=="절대영도"||rskill=="뿔드릴"||rskill=="가위자르기")
               replier.reply("일격필살!");
            if(read(rskill, "addi")==7)
            {
               p1hp[p1num-1]=Math.ceil(p1hp[p1num-1]-(attack/4));
               replier.reply(p1pokname+"는 공격의 반동을 입었다!");
            }
            else if(read(rskill, "addi")==4)
            {
               p1hp[p1num-1]=Math.ceil(p1hp[p1num-1]+(attack/4));
			   if(p1hp[p1num-1]>read(p1pokname, "hp"))
				   p1hp[p1num-1]=read(p1pokname, "hp");
               replier.reply("상대 "+p2pokname+"로부터 체력을 흡수했다!");
            }
            else if(read(rskill, "addi")==12)
            {
               p1hp[p1num-1]=1;

            }
			else if(read(rskill, "addi")==11)
            {
				if((Math.floor(Math.random()*3))==1)
					nonattacking("칼춤",1,replier);
            }
			else if(read(rskill, "addi")==8)
            {
				p1pokstats[9]=3;
            }
			else if(read(rskill, "addi")==9)
            {
				p1pokstats[2]=p1pokstats[2]*4/5;
				replier.reply(p1pokname+"의 공격이 크게 떨어졌다!");
            }
			else if(read(rskill, "addi")==3&&Math.floor(Math.random()*3)==1)
				p2pokstats[9]=4;
         }
	}
	if(p2hp[p2num-1]<1)
      {
		if(rskill=="칼등치기")
			p2hp[p2num-1]=1;
		else
			p2hp[p2num-1]=0;
	  }
      if(p1hp[p1num-1]<1)
         p1hp[p1num-1]=0;
      replier.reply(p2pokname+"        ["+p2hp[p2num-1]+"/"+read(p2pokname, "hp")+"]  "+debufftexts[p2pokstats[5]]+"\n\n"+p1pokname+"        ["+p1hp[p1num-1]+"/"+read(p1pokname, "hp")+"]  "+debufftexts[p1pokstats[5]]+"\n");
	  
}
function enemyfinger(replier)
{
	var ttext1="";
	var rskill="";
	var rtype=Math.floor(Math.random()*17)+1;
	ttext1="skill"+rtype;
	var asd=Math.floor(Math.random()*(read("finger", ttext1).split('/').length));
	rskill=read("finger", ttext1).split('/')[asd];
	replier.reply("손가락을 흔들었더니 "+rskill+"가 나왔다!");
	var attack=0;
	var accurate=0;
	accurate=p2pokstats[0]/100*(100-p1pokstats[1])/100*read(rskill, "accr");
	if(Math.floor(Math.random()*100)>accurate)
      replier.reply("그러나 상대 "+p2pokname+"의 공격은 빗나갔다!");
	else
	{
		if(rskill=="참기"||rskill=="카운터"||rskill=="미러코트"||rskill=="메탈버스트")
		  {
			  attack=read(p2pokname, "hp")-p2hp[p2num-1];
			  if(rskill=="카운터"||rskill=="미러코트")
				  attack=attack*3/2;
			  else if(rskill=="메탈버스트")
				  attack=attack*2;
		  }
		  else
			  attack=p2pokstats[2]*(100-(p1pokstats[3]/4))/100*read(rskill, "damage")/100;
         var sw=typejudge(read(rskill, "type"),read(p1pokname, "type1"),read(p1pokname, "type2"));
		 if(p1pokstats[9]==1)
		 {
			 attack=0;
			 replier.reply(p1pokname+"는 공격으로부터 몸을 지켰다!");
			 p1pokstats[9]=0;
		 }
		 else if(sw!=4&&p1pokstats[7]==3&&read(rskill, "type")==7)
		 {
			 attack=0;
			 replier.reply(p1pokname+"는 부유하고 있어 공격에 맞지 않았다!");
		 }
         else if(sw==4)
         {
            attack=0;
            replier.reply(p1pokname+"에게는 효과가 없는 것 같다...");
         }
         else if(sw==3)
         {
            attack=attack/2;
            replier.reply("효과가 별로인 듯하다");
         }
         else if(sw==2)
         {
            attack=attack*2;
            replier.reply("효과가 굉장했다!");
         }
		 if(weather[0]==1&&read(rskill, "type")==2)
			 attack=attack*6/5;
		 else if(weather[0]==2&&read(rskill, "type")==2)
			 attack=attack*4/5;
		 if(p1pokstats[7]==2)
			 attack=attack*4/5;
		 if(read(rskill, "addi")==5)
            {
               var times=Math.floor(Math.random()*5)+1;
			   attack=attack*times;
               replier.reply(times+"번 맞았다!");
            }
		 if(read(rskill, "type")==read(p2pokname, "type1")||read(rskill, "type")==read(p2pokname, "type2"))
			 attack=attack*11/10;
         p1hp[p1num-1]=Math.ceil(p1hp[p1num-1]-attack);
         if(attack!=0)
         {
			 if(read(rskill, "type")==2&&Math.floor(Math.random()*5)==1&&read(p1pokname, "type1")!=2&&read(p1pokname, "type2")!=2)
				 nonattacking("도깨비불",2,replier);
			 if(read(rskill, "type")==13&&Math.floor(Math.random()*5)==1&&read(p1pokname, "type1")!=13&&read(p1pokname, "type2")!=13)
				 nonattacking("맹독",2,replier);
			 if(read(rskill, "type")==12&&Math.floor(Math.random()*5)==1&&read(p1pokname, "type1")!=12&&read(p1pokname, "type2")!=12)
				 nonattacking("전기자석파",2,replier);
            if(rskill=="땅가르기"||rskill=="절대영도"||rskill=="뿔드릴"||rskill=="가위자르기")
               replier.reply("일격필살!");
            if(read(rskill, "addi")==7)
            {
               p2hp[p2num-1]=Math.ceil(p2hp[p2num-1]-(attack/4));
               replier.reply("상대 "+p2pokname+"는 공격의 반동을 입었다!");
            }
            else if(read(rskill, "addi")==4)
            {
               p2hp[p2num-1]=Math.ceil(p2hp[p2num-1]+(attack/4));
			   if(p2hp[p2num-1]>read(p2pokname, "hp"))
				   p2hp[p2num-1]=read(p2pokname, "hp");
               replier.reply(p1pokname+"로부터 체력을 흡수했다!");
            }
            else if(read(rskill, "addi")==12)
            {
               p2hp[p2num-1]=1;

            }
			else if(read(rskill, "addi")==11)
            {
				if((Math.floor(Math.random()*3))==1)
					nonattacking("칼춤",2,replier);
            }
			else if(read(rskill, "addi")==8)
            {
				p2pokstats[9]=3;
            }
			else if(read(rskill, "addi")==9)
            {
				p2pokstats[2]=p2pokstats[2]*4/5;
				replier.reply(p2pokname+"의 공격이 크게 떨어졌다!");
            }
			else if(read(rskill, "addi")==3&&Math.floor(Math.random()*3)==1)
				p1pokstats[9]=4;
         }
	}
	if(p1hp[p1num-1]<1)
      {
		if(rskill=="칼등치기")
			p1hp[p1num-1]=1;
		else
			p1hp[p1num-1]=0;
	  }
      if(p2hp[p2num-1]<1)
         p2hp[p2num-1]=0;
      replier.reply(p2pokname+"        ["+p2hp[p2num-1]+"/"+read(p2pokname, "hp")+"]  "+debufftexts[p2pokstats[5]]+"\n\n"+p1pokname+"        ["+p1hp[p1num-1]+"/"+read(p1pokname, "hp")+"]  "+debufftexts[p1pokstats[5]]+"\n");
	  
}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
if(room=="메이플 키네시스")
return;
else
{
if (msg == "/포켓몬스터"){
      replier.reply("포켓몬스터 v3.0");
      replier.reply("/회원가입\n/내 포켓몬\n/내 뱃지\n/순서변경 (번호) (번호)\n/야생\n/체육관 (1~18)   (기권은 /기권)\n/챔피언 도전\n/챔피언 정보");
   }
   if (msg == "/회원가입"){
if(c==0){
replier.reply("오박사: 포켓몬 세계에 온 것을 환영한다!");
replier.reply("처음 시작하는 만큼 귀한 포켓몬으로 준비했다!\n하나만 고를 수 있으니 신중하게 골라 보거라.\n\n\n1 파이리    2 꼬부기    3 이상해씨\n4 브케인    5 리아코    6 치코리타\n7 아차모    8 물짱이    9 나무지기\n10 모부기    11 팽도리    12 불꽃숭이\n\n(/선택 (숫자) 형식으로 해주세요)");
c=1;
}
}

if(msg.split(' ')[0]=="/선택")
{
if(c==1){
var st=msg.split(' ')[1];
switch(st){
            case '1':
   var a = {"Pok1name": "파이리","Pok1skill":"할퀴기/울음소리/불꽃세례/ ","Pok1level":5,"Pok1exp":0,"Pok2name": " ","Pok2skill":" / / / ","Pok2level":0,"Pok2exp":0,"Pok3name": " ","Pok3skill":" / / / ","Pok3level":0,"Pok3exp":0,"Pok4name": " ","Pok4skill":" / / / ","Pok4level":0,"Pok4exp":0,"Pok5name": " ","Pok5skill":" / / / ","Pok5level":0,"Pok5exp":0,"Pok6name": " ","Pok6skill":" / / / ","Pok6level":0,"Pok6exp":0,"Badge":"0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0"};
               replier.reply("오박사: 파이리를 골랐군! 이제는 너의 것이니 소중히 키우거라!");
               break;
               case '2':
   var a = {"Pok1name": "꼬부기","Pok1skill":"몸통박치기/꼬리흔들기/물대포/ ","Pok1level":5,"Pok1exp":0,"Pok2name": " ","Pok2skill":" / / / ","Pok2level":0,"Pok2exp":0,"Pok3name": " ","Pok3skill":" / / / ","Pok3level":0,"Pok3exp":0,"Pok4name": " ","Pok4skill":" / / / ","Pok4level":0,"Pok4exp":0,"Pok5name": " ","Pok5skill":" / / / ","Pok5level":0,"Pok5exp":0,"Pok6name": " ","Pok6skill":" / / / ","Pok6level":0,"Pok6exp":0,"Badge":"0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0"};
               replier.reply("오박사: 꼬부기를 골랐군! 이제는 너의 것이니 소중히 키우거라!");
               break;
               case '3':
   var a = {"Pok1name": "이상해씨","Pok1skill":"몸통박치기/울음소리/잎날가르기/ ","Pok1level":5,"Pok1exp":0,"Pok2name": " ","Pok2skill":" / / / ","Pok2level":0,"Pok2exp":0,"Pok3name": " ","Pok3skill":" / / / ","Pok3level":0,"Pok3exp":0,"Pok4name": " ","Pok4skill":" / / / ","Pok4level":0,"Pok4exp":0,"Pok5name": " ","Pok5skill":" / / / ","Pok5level":0,"Pok5exp":0,"Pok6name": " ","Pok6skill":" / / / ","Pok6level":0,"Pok6exp":0,"Badge":"0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0"};
               replier.reply("오박사: 이상해씨를 골랐군! 이제는 너의 것이니 소중히 키우거라!");
               break;
               case '4':
   var a = {"Pok1name": "브케인","Pok1skill":"몸통박치기/째려보기/불꽃세례/ ","Pok1level":5,"Pok1exp":0,"Pok2name": " ","Pok2skill":" / / / ","Pok2level":0,"Pok2exp":0,"Pok3name": " ","Pok3skill":" / / / ","Pok3level":0,"Pok3exp":0,"Pok4name": " ","Pok4skill":" / / / ","Pok4level":0,"Pok4exp":0,"Pok5name": " ","Pok5skill":" / / / ","Pok5level":0,"Pok5exp":0,"Pok6name": " ","Pok6skill":" / / / ","Pok6level":0,"Pok6exp":0,"Badge":"0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0"};
               replier.reply("오박사: 브케인을 골랐군! 이제는 너의 것이니 소중히 키우거라!");
               break;
               case '5':
   var a = {"Pok1name": "리아코","Pok1skill":"할퀴기/째려보기/물대포/ ","Pok1level":5,"Pok1exp":0,"Pok2name": " ","Pok2skill":" / / / ","Pok2level":0,"Pok2exp":0,"Pok3name": " ","Pok3skill":" / / / ","Pok3level":0,"Pok3exp":0,"Pok4name": " ","Pok4skill":" / / / ","Pok4level":0,"Pok4exp":0,"Pok5name": " ","Pok5skill":" / / / ","Pok5level":0,"Pok5exp":0,"Pok6name": " ","Pok6skill":" / / / ","Pok6level":0,"Pok6exp":0,"Badge":"0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0"};
               replier.reply("오박사: 리아코를 골랐군! 이제는 너의 것이니 소중히 키우거라!");
               break;
               case '6':
   var a = {"Pok1name": "치코리타","Pok1skill":"몸통박치기/울음소리/잎날가르기/ ","Pok1level":5,"Pok1exp":0,"Pok2name": " ","Pok2skill":" / / / ","Pok2level":0,"Pok2exp":0,"Pok3name": " ","Pok3skill":" / / / ","Pok3level":0,"Pok3exp":0,"Pok4name": " ","Pok4skill":" / / / ","Pok4level":0,"Pok4exp":0,"Pok5name": " ","Pok5skill":" / / / ","Pok5level":0,"Pok5exp":0,"Pok6name": " ","Pok6skill":" / / / ","Pok6level":0,"Pok6exp":0,"Badge":"0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0"};
               replier.reply("오박사: 치코리타를 골랐군! 이제는 너의 것이니 소중히 키우거라!");
               break;
            case '7':
   var a = {"Pok1name": "아차모","Pok1skill":"할퀴기/울음소리/불꽃세례/ ","Pok1level":5,"Pok1exp":0,"Pok2name": " ","Pok2skill":" / / / ","Pok2level":0,"Pok2exp":0,"Pok3name": " ","Pok3skill":" / / / ","Pok3level":0,"Pok3exp":0,"Pok4name": " ","Pok4skill":" / / / ","Pok4level":0,"Pok4exp":0,"Pok5name": " ","Pok5skill":" / / / ","Pok5level":0,"Pok5exp":0,"Pok6name": " ","Pok6skill":" / / / ","Pok6level":0,"Pok6exp":0,"Badge":"0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0"};
               replier.reply("오박사: 아차모를 골랐군! 이제는 너의 것이니 소중히 키우거라!");
               break;
               case '8':
   var a = {"Pok1name": "물짱이","Pok1skill":"몸통박치기/울음소리/물대포/ ","Pok1level":5,"Pok1exp":0,"Pok2name": " ","Pok2skill":" / / / ","Pok2level":0,"Pok2exp":0,"Pok3name": " ","Pok3skill":" / / / ","Pok3level":0,"Pok3exp":0,"Pok4name": " ","Pok4skill":" / / / ","Pok4level":0,"Pok4exp":0,"Pok5name": " ","Pok5skill":" / / / ","Pok5level":0,"Pok5exp":0,"Pok6name": " ","Pok6skill":" / / / ","Pok6level":0,"Pok6exp":0,"Badge":"0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0"};
               replier.reply("오박사: 물짱이를 골랐군! 이제는 너의 것이니 소중히 키우거라!");
               break;
               case '9':
   var a = {"Pok1name": "나무지기","Pok1skill":"막치기/울음소리/잎날가르기/ ","Pok1level":5,"Pok1exp":0,"Pok2name": " ","Pok2skill":" / / / ","Pok2level":0,"Pok2exp":0,"Pok3name": " ","Pok3skill":" / / / ","Pok3level":0,"Pok3exp":0,"Pok4name": " ","Pok4skill":" / / / ","Pok4level":0,"Pok4exp":0,"Pok5name": " ","Pok5skill":" / / / ","Pok5level":0,"Pok5exp":0,"Pok6name": " ","Pok6skill":" / / / ","Pok6level":0,"Pok6exp":0,"Badge":"0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0"};
               replier.reply("오박사: 나무지기를 골랐군! 이제는 너의 것이니 소중히 키우거라!");
               break;
               case '10':
     var a = {"Pok1name": "모부기","Pok1skill":"몸통박치기/껍질에숨기/잎날가르기/ ","Pok1level":5,"Pok1exp":0,"Pok2name": " ","Pok2skill":" / / / ","Pok2level":0,"Pok2exp":0,"Pok3name": " ","Pok3skill":" / / / ","Pok3level":0,"Pok3exp":0,"Pok4name": " ","Pok4skill":" / / / ","Pok4level":0,"Pok4exp":0,"Pok5name": " ","Pok5skill":" / / / ","Pok5level":0,"Pok5exp":0,"Pok6name": " ","Pok6skill":" / / / ","Pok6level":0,"Pok6exp":0,"Badge":"0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0"};
               replier.reply("오박사: 모부기를 골랐군! 이제는 너의 것이니 소중히 키우거라!");
               break;
               case '11':
   var a = {"Pok1name": "팽도리","Pok1skill":"막치기/울음소리/물대포/ ","Pok1level":5,"Pok1exp":0,"Pok2name": " ","Pok2skill":" / / / ","Pok2level":0,"Pok2exp":0,"Pok3name": " ","Pok3skill":" / / / ","Pok3level":0,"Pok3exp":0,"Pok4name": " ","Pok4skill":" / / / ","Pok4level":0,"Pok4exp":0,"Pok5name": " ","Pok5skill":" / / / ","Pok5level":0,"Pok5exp":0,"Pok6name": " ","Pok6skill":" / / / ","Pok6level":0,"Pok6exp":0,"Badge":"0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0"};
               replier.reply("오박사: 팽도리를 골랐군! 이제는 너의 것이니 소중히 키우거라!");
               break;
               case '12':
   var a = {"Pok1name": "불꽃숭이","Pok1skill":"할퀴기/째려보기/불꽃세례/ ","Pok1level":5,"Pok1exp":0,"Pok2name": " ","Pok2skill":" / / / ","Pok2level":0,"Pok2exp":0,"Pok3name": " ","Pok3skill":" / / / ","Pok3level":0,"Pok3exp":0,"Pok4name": " ","Pok4skill":" / / / ","Pok4level":0,"Pok4exp":0,"Pok5name": " ","Pok5skill":" / / / ","Pok5level":0,"Pok5exp":0,"Pok6name": " ","Pok6skill":" / / / ","Pok6level":0,"Pok6exp":0,"Badge":"0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0"};
               replier.reply("오박사: 불꽃숭이를 골랐군! 이제는 너의 것이니 소중히 키우거라!");
               break;
               }
var tt1="";
tt1="player_"+sender;
      write(tt1, a);
c=0;
tt1="";
      replier.reply("회원가입 완료!");
      }
}

if (msg == "/내 포켓몬")
{
	var tt1="";
	tt1="player_"+sender;
	replier.reply("[ "+sender+"님의 포켓몬 ]\n\n\nLv."+read(tt1, "Pok1level")+"  "+read(tt1, "Pok1name")+"     "+read(tt1, "Pok1skill")+"\nLv."+read(tt1, "Pok2level")+"  "+read(tt1, "Pok2name")+"     "+read(tt1, "Pok2skill")+"\nLv."+read(tt1, "Pok3level")+"  "+read(tt1, "Pok3name")+"     "+read(tt1, "Pok3skill")+"\nLv."+read(tt1, "Pok4level")+"  "+read(tt1, "Pok4name")+"     "+read(tt1, "Pok4skill")+"\nLv."+read(tt1, "Pok5level")+"  "+read(tt1, "Pok5name")+"     "+read(tt1, "Pok5skill")+"\nLv."+read(tt1, "Pok6level")+"  "+read(tt1, "Pok6name")+"     "+read(tt1, "Pok6skill")+"\n");
	tt1="";
}

if(msg=="/내 뱃지")
{
	var tt1="";
	var badgearr=new Array("◎","◇","△","☆","▣","♤","♡","®","♧","▩","▤","㉿","㉤","Θ","∞","＠","▒","ⓓ");
	tt1="player_"+sender;
	var temparr=read(tt1, "Badge").split('/');
	var tempstr1=" ";
	var tempstr2=" ";
	var i=0;
	for(i=0;i<9;i++)
	{
		if(temparr[i]!=0)
			tempstr1=tempstr1+badgearr[i]+"  ";
		else
			tempstr1=tempstr1+"●  ";
	}
	for(i=9;i<18;i++)
	{
		if(temparr[i]!=0)
			tempstr2=tempstr2+badgearr[i]+"  ";
		else
			tempstr2=tempstr2+"●  ";
	}
	replier.reply(sender+"님의 보유 배지\n\n"+tempstr1+"\n"+tempstr2+"\n");
	tt1="";
}

if(msg=="/챔피언 정보")
{
	var temparr=read("champlog", "Champlogs").split(',');
	var i=0;
	var temparr2="";
	for(i=0;i<temparr.length;i++)
	{
		temparr2=temparr2+"\n"+(i+1)+"번째 챔피언: "+temparr[i];
	}
	replier.reply("챔피언리그 기록\n"+temparr2+"\n\n현재 챔피언: "+read("champion", "Champname")+"\n"+read("champlog", "Champnum")+"대 챔피언");
	
}

if(start == false && msg=="/야생"){
player = sender;
start = true;
if(start == true && msg=="/야생" && isbattle!=0)
{
replier.reply("이미 누군가가 배틀 중이다!");
}
else
{
typetexts=new Array(" ","노말","불","물","풀","비행","바위","땅","격투","강철","벌레","얼음","전기","독","에스퍼","고스트","악","드래곤");
debufftexts=new Array(" ","[마비]","[얼음]","[화상]","[독]","[잠듦]","[혼란]");
var ran=0;
var r=0;
var w="";
t1="player_"+sender;
ran=Math.floor(Math.random()*100)+1;
if(ran==1)
{
w=read("wildpoks", "group4");
r=Math.floor(Math.random()*w.split('/').length);
p2pokname=w.split('/')[r];
capture=3;
replier.reply("야생의 "+p2pokname+"가 나타났다!");
}
else if(1<ran&&ran<16)
{
w=read("wildpoks", "group3");
r=Math.floor(Math.random()*w.split('/').length);
p2pokname=w.split('/')[r];
capture=10;
replier.reply("앗! 야생의 "+p2pokname+"가 튀어나왔다!");
}
else if(15<ran&&ran<46)
{
w=read("wildpoks", "group2");
r=Math.floor(Math.random()*w.split('/').length);
p2pokname=w.split('/')[r];
capture=25;
replier.reply("앗! 야생의 "+p2pokname+"가 튀어나왔다!");
}
else
{
w=read("wildpoks", "group1");
r=Math.floor(Math.random()*w.split('/').length);
p2pokname=w.split('/')[r];
capture=40;
replier.reply("앗! 야생의 "+p2pokname+"가 튀어나왔다!");
}
isbattle=1;
p1num=1;
p2num=1;
var i=0;
p1pokname=read(t1, "Pok1name");
replier.reply("가랏! "+p1pokname+"!");
p2hp=new Array(-1,-1,-1,-1,-1,-1);
p1hp=new Array(-1,-1,-1,-1,-1,-1);
var temp="";
var tempname="";
for(i=0;i<6;i++)
{
temp="Pok"+(i+1)+"name";
tempname=read(t1, temp);
if(tempname!=" ")
p1hp[i]=read(tempname, "hp");
}
p2hp[0]=read(p2pokname, "hp");

//스킬 배치
var skillnum=read(p2pokname, "skills").split('/').length;
var skillarr=read(p2pokname, "skills").split('/');
enemyskills=new Array(" "," "," "," ");
myskills=new Array(" "," "," "," ");
p1pp=new Array(0,0,0,0);
p2pp=new Array(0,0,0,0);
if(skillnum<2)
{
enemyskills[0]=read(p2pokname, "skills");
//replier.reply(enemyskills[0]+"/"+enemyskills[1]+"/"+enemyskills[2]+"/"+enemyskills[3]);
}
else
{
   if(skillnum<5)
   {
      for(i=0;i<skillnum;i++)
         enemyskills[i]=skillarr[i];
   }
   else
   {
      enemyskills[0]=skillarr[Math.floor(Math.random()*skillnum)];
      do{
         enemyskills[1]=skillarr[Math.floor(Math.random()*skillnum)];
      }while(enemyskills[0]==enemyskills[1]);
      do{
         enemyskills[2]=skillarr[Math.floor(Math.random()*skillnum)];
      }while(enemyskills[0]==enemyskills[2]||enemyskills[1]==enemyskills[2]);
      do{
         enemyskills[3]=skillarr[Math.floor(Math.random()*skillnum)];
      }while(enemyskills[0]==enemyskills[3]||enemyskills[1]==enemyskills[3]||enemyskills[2]==enemyskills[3]);
   }
}
temp="Pok"+p1num+"skill";
tempname=read(t1, temp);
for(i=0;i<4;i++)
{
   if(tempname.split('/')[i]!=" ")
      myskills[i]=tempname.split('/')[i];
}
for(i=0;i<4;i++)
{
   if(myskills[i]!=" ")
      p1pp[i]=read(myskills[i], "pp");
   if(enemyskills[i]!=" ")
      p2pp[i]=read(enemyskills[i], "pp");
}
//스킬 배치
turn=1;
isforgetselect=0;
ischangeselect=0;
isgameend=0;
skilltonew=" ";
weather=new Array(0,0);
//쾌청, 비, 모래바람, 싸라기눈 순
p1pokstats=new Array(100,0,read(p1pokname, "atk"),read(p1pokname, "def"),read(p1pokname, "spd"),0,0,0,0,0);
p2pokstats=new Array(100,0,read(p2pokname, "atk"),read(p2pokname, "def"),read(p2pokname, "spd"),0,0,0,0,0);
//명중률,회피율,공격력,방어력,스피드,상태이상종류,상태이상지속,특수상태종류,특수상태지속
replier.reply(p2pokname+"        ["+p2hp[p2num-1]+"/"+read(p2pokname, "hp")+"]  "+debufftexts[p2pokstats[5]]+"\n\n"+p1pokname+"        ["+p1hp[p1num-1]+"/"+read(p1pokname, "hp")+"]  "+debufftexts[p1pokstats[5]]+"\n");
replier.reply(p1pokname+"는 무엇을 할까?\n\n1. 싸운다\n2. 볼\n3. 도망간다\n4. 포켓몬 교체\n\n(/싸운다 이런 형식으로 사용해주세요)");
}
}

//aa
if(start == false &&msg.split(' ')[0]=="/체육관"){
var ran=0;
ran=msg.split(' ')[1]-1;
var judgebadge="";
var ttt1="";
var i=0;
var challengered=1;
ttt1="player_"+sender;
judgebadge=read(ttt1, "Badge");
for(i=0;i<17;i++)
{
	if(judgebadge.split('/')[i]!=1)
		challengered=0;
}
if(ran<0||ran>17)
{
	replier.reply("잘못 입력하셨습니다.");
}
else if(challengered==0&&ran==17)
{
	replier.reply("오박사: "+sender+"! 마지막 관장인 레드는 한때 챔피언이었단다! 그만큼 강력한 상대이니 다른 관장들부터 먼저 이긴 후에 도전하렴!");
}
else
{
if(start == true &&msg.split(' ')[0]=="/체육관" && isbattle!=0)
{
replier.reply("이미 누군가가 배틀 중이다!");
}
else
{
player = sender;
start = true;
typetexts=new Array(" ","노말","불","물","풀","비행","바위","땅","격투","강철","벌레","얼음","전기","독","에스퍼","고스트","악","드래곤");
debufftexts=new Array(" ","[마비]","[얼음]","[화상]","[독]","[잠듦]","[혼란]");
var r=0;
var w=read("champion", "gym").split('/');
player2=w[ran];
t1="player_"+sender;
t2="trainer_"+player2;
gymnum=(ran+1);
isbattle=2;
p1num=1;
p2num=1;
replier.reply("체육관 관장 "+player2+"가 승부를 걸어왔다!");
p2pokname=read(t2, "Pok1name");
p1pokname=read(t1, "Pok1name");
replier.reply("체육관 관장 "+player2+"는 "+p2pokname+"를 내보냈다!");
replier.reply("가랏! "+p1pokname+"!");
p2hp=new Array(-1,-1,-1,-1,-1,-1);
p1hp=new Array(-1,-1,-1,-1,-1,-1);
var temp="";
var tempname="";
//HP배치
for(i=0;i<6;i++)
{
temp="Pok"+(i+1)+"name";
tempname=read(t1, temp);
if(tempname!=" ")
p1hp[i]=read(tempname, "hp");
}
for(i=0;i<6;i++)
{
temp="Pok"+(i+1)+"name";
tempname=read(t2, temp);
if(tempname!=" ")
p2hp[i]=read(tempname, "hp");
}

//스킬 배치
enemyskills=new Array(" "," "," "," ");
myskills=new Array(" "," "," "," ");
p1pp=new Array(0,0,0,0);
p2pp=new Array(0,0,0,0);
temp="Pok"+p1num+"skill";
tempname=read(t1, temp);
for(i=0;i<4;i++)
{
   if(tempname.split('/')[i]!=" ")
      myskills[i]=tempname.split('/')[i];
}
temp="Pok"+p2num+"skill";
tempname=read(t2, temp);
for(i=0;i<4;i++)
{
   if(tempname.split('/')[i]!=" ")
      enemyskills[i]=tempname.split('/')[i];
}
for(i=0;i<4;i++)
{
   if(myskills[i]!=" ")
      p1pp[i]=read(myskills[i], "pp");
   if(enemyskills[i]!=" ")
      p2pp[i]=read(enemyskills[i], "pp");
}
//스킬 배치
turn=1;
isforgetselect=0;
ischangeselect=0;
isgameend=0;
skilltonew=" ";
weather=new Array(0,0);
//쾌청, 비, 모래바람, 싸라기눈 순
p1pokstats=new Array(100,0,read(p1pokname, "atk"),read(p1pokname, "def"),read(p1pokname, "spd"),0,0,0,0,0);
p2pokstats=new Array(100,0,read(p2pokname, "atk"),read(p2pokname, "def"),read(p2pokname, "spd"),0,0,0,0,0);
//명중률,회피율,공격력,방어력,스피드,상태이상종류,상태이상지속,특수상태종류,특수상태지속
replier.reply(p2pokname+"        ["+p2hp[p2num-1]+"/"+read(p2pokname, "hp")+"]  "+debufftexts[p2pokstats[5]]+"\n\n"+p1pokname+"        ["+p1hp[p1num-1]+"/"+read(p1pokname, "hp")+"]  "+debufftexts[p1pokstats[5]]+"\n");
replier.reply(p1pokname+"는 무엇을 할까?\n\n1. 싸운다\n2. 볼\n3. 도망간다\n4. 포켓몬 교체\n\n(/싸운다 이런 형식으로 사용해주세요)");
}
}
}
//aa

//aa
if(start == false && msg=="/챔피언 도전"){
var judgebadge="";
var ttt1="";
ttt1="player_"+sender;
judgebadge=read(ttt1, "Badge");
if(judgebadge=="1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1")
{
player = sender;
start = true;
if(start == true && msg=="/챔피언 도전" && isbattle!=0)
{
replier.reply("이미 누군가가 배틀 중이다!");
}
else
{
typetexts=new Array(" ","노말","불","물","풀","비행","바위","땅","격투","강철","벌레","얼음","전기","독","에스퍼","고스트","악","드래곤");
debufftexts=new Array(" ","[마비]","[얼음]","[화상]","[독]","[잠듦]","[혼란]");
var ran=0;
var r=0;
ran=Math.floor(Math.random()*17);
player2=read("champion", "Champname");
t1="player_"+sender;
t2="champion";
isbattle=3;
p1num=1;
p2num=1;
var i=0;
replier.reply("챔피언 "+player2+"가 승부를 걸어왔다!");
p2pokname=read(t2, "Pok1name");
p1pokname=read(t1, "Pok1name");
replier.reply("챔피언 "+player2+"는 "+p2pokname+"를 내보냈다!");
replier.reply("가랏! "+p1pokname+"!");
p2hp=new Array(-1,-1,-1,-1,-1,-1);
p1hp=new Array(-1,-1,-1,-1,-1,-1);
var temp="";
var tempname="";
//HP배치
for(i=0;i<6;i++)
{
temp="Pok"+(i+1)+"name";
tempname=read(t1, temp);
if(tempname!=" ")
p1hp[i]=read(tempname, "hp");
}
for(i=0;i<6;i++)
{
temp="Pok"+(i+1)+"name";
tempname=read(t2, temp);
if(tempname!=" ")
p2hp[i]=read(tempname, "hp");
}

//스킬 배치
enemyskills=new Array(" "," "," "," ");
myskills=new Array(" "," "," "," ");
p1pp=new Array(0,0,0,0);
p2pp=new Array(0,0,0,0);
temp="Pok"+p1num+"skill";
tempname=read(t1, temp);
for(i=0;i<4;i++)
{
   if(tempname.split('/')[i]!=" ")
      myskills[i]=tempname.split('/')[i];
}
temp="Pok"+p2num+"skill";
tempname=read(t2, temp);
for(i=0;i<4;i++)
{
   if(tempname.split('/')[i]!=" ")
      enemyskills[i]=tempname.split('/')[i];
}
for(i=0;i<4;i++)
{
   if(myskills[i]!=" ")
      p1pp[i]=read(myskills[i], "pp");
   if(enemyskills[i]!=" ")
      p2pp[i]=read(enemyskills[i], "pp");
}
//스킬 배치
turn=1;
isforgetselect=0;
ischangeselect=0;
isgameend=0;
skilltonew=" ";
weather=new Array(0,0);
//쾌청, 비, 모래바람, 싸라기눈 순
p1pokstats=new Array(100,0,read(p1pokname, "atk"),read(p1pokname, "def"),read(p1pokname, "spd"),0,0,0,0,0);
p2pokstats=new Array(100,0,read(p2pokname, "atk"),read(p2pokname, "def"),read(p2pokname, "spd"),0,0,0,0,0);
//명중률,회피율,공격력,방어력,스피드,상태이상종류,상태이상지속,특수상태종류,특수상태지속
replier.reply(p2pokname+"        ["+p2hp[p2num-1]+"/"+read(p2pokname, "hp")+"]  "+debufftexts[p2pokstats[5]]+"\n\n"+p1pokname+"        ["+p1hp[p1num-1]+"/"+read(p1pokname, "hp")+"]  "+debufftexts[p1pokstats[5]]+"\n");
replier.reply(p1pokname+"는 무엇을 할까?\n\n1. 싸운다\n2. 볼\n3. 도망간다\n4. 포켓몬 교체\n\n(/싸운다 이런 형식으로 사용해주세요)");
}
}
else
{
	replier.reply("모든 체육관의 배지를 보유하고 있지 않아 챔피언 도전 자격이 없습니다!");
}
ttt1="";
}
//aa

if(sender == player && msg.split(' ')[0]=="/잊기"&&isforgetselect==1)
{
   var selectn=msg.split(' ')[1];
   if(selectn<0||selectn>4)
      replier.reply("잘못 입력하셨습니다.");
   else if(selectn==0)
   {
      replier.reply(p1pokname+"은 "+skilltonew+"를 결국 배우지 않았다!");
	  skilltonew=" ";
	  isforgetselect=0;
	  replier.reply(sender+"는 배틀에서 승리했다!");
	  if(isbattle==2)
		  wingym(sender,replier);
	  else if(isbattle==3)
		  winchamp(sender,replier);
     endGame(msg,replier);
      
   }
   else
   {
      replier.reply(p1pokname+"은 "+myskills[selectn-1]+"를 깨끗이 잊었다!");
      myskills[selectn-1]=skilltonew;
      var temp="Pok"+p1num+"skill";
      user(t1, temp, myskills[0]+"/"+myskills[1]+"/"+myskills[2]+"/"+myskills[3]);
      replier.reply("그리고 "+p1pokname+"은 새로 "+skilltonew+"를 배웠다!");
	  skilltonew=" ";
	  isforgetselect=0;
	  replier.reply(sender+"는 배틀에서 승리했다!");
	  if(isbattle==2)
		  wingym(sender,replier);
	  else if(isbattle==3)
		  winchamp(sender,replier);
     endGame(msg,replier);
     
   }
}

if(sender == player && msg=="/포켓몬 교체")
   {
      var i=0;
      var ttemp="";
      var nowmypoks=new Array("","","","","","");
      for(i=0;i<6;i++)
      {
         
         if(p1hp[i]!=(-1))
         {
            ttemp="Pok"+(i+1)+"name";
            nowmypoks[i]=read(t1, ttemp)+"   "+p1hp[i]+"/"+read(read(t1, ttemp), "hp")+" ";
            if(p1hp[i]==0)
               nowmypoks[i]=nowmypoks[i]+"  [기절]";
         }
      }
      replier.reply("1. "+nowmypoks[0]+"\n2. "+nowmypoks[1]+"\n3. "+nowmypoks[2]+"\n4. "+nowmypoks[3]+"\n5. "+nowmypoks[4]+"\n6. "+nowmypoks[5]+"\n\n교체할 포켓몬을 선택해 주세요.\n(/교체 1 이런 형식으로 사용해 주세요)");
      ischangeselect=1;
   }

   if(msg.split(' ')[0]=="/교체"&&ischangeselect==1)
   {
      if(msg.split(' ')[1]<1||msg.split(' ')[1]>6||p1hp[(msg.split(' ')[1])-1]==(-1))
         replier.reply("잘못 입력하셨습니다.");
      else if(p1hp[(msg.split(' ')[1])-1]==0)
         replier.reply("해당 포켓몬은 기절해서 배틀에 나갈 수 없습니다.");
	 else if(p2pokstats[7]==5&&p1hp[p1num-1]!=0)
		 replier.reply(p1pokname+"는 상대의 검은눈빛으로 인해 도망칠 수 없다!");
      else
      {
         var temp="";
         var tempname="";
         var selectnum=msg.split(' ')[1];
         replier.reply(p1pokname+"! 돌아와!");
         temp="Pok"+selectnum+"name";
         tempname=read(t1, temp);
         p1pokname=tempname;
         temp="Pok"+selectnum+"skill";
         tempname=read(t1, temp);
         for(i=0;i<4;i++)
         {
            if(tempname.split('/')[i]!=" ")
              myskills[i]=tempname.split('/')[i];
         }
         for(i=0;i<4;i++)
         {
            if(myskills[i]!=" ")
               p1pp[i]=read(myskills[i], "pp");
         }
         p1pokstats=new Array(100,0,read(p1pokname, "atk"),read(p1pokname, "def"),read(p1pokname, "spd"),0,0,0,0);
         
         p1num=selectnum;
         replier.reply("가랏! "+p1pokname+"!");
		 ischangeselect=0;
         replier.reply(p2pokname+"        ["+p2hp[p2num-1]+"/"+read(p2pokname, "hp")+"]  "+debufftexts[p2pokstats[5]]+"\n\n"+p1pokname+"        ["+p1hp[p1num-1]+"/"+read(p1pokname, "hp")+"]  "+debufftexts[p1pokstats[5]]+"\n");
         replier.reply(p1pokname+"는 무엇을 할까?\n\n1. 싸운다\n2. 볼\n3. 도망간다\n4. 포켓몬 교체\n\n(/싸운다 이런 형식으로 사용해주세요)");
      }
   }
   
if(sender == player && msg=="/볼"&&ischangeselect==0&&isforgetselect==0)
{
   if(isbattle==2||isbattle==3)
      replier.reply("오박사: "+sender+"! 이런 물건은.....쓸 데가 따로 있다!");
   else if(isbattle==0)
      replier.reply("배틀 중이 아닙니다.");
else if(ischangeselect!=0&&isforgetselect!=0)
{

}
else
   {
      isballselect=1;
      replier.reply("1. 하이퍼볼\n2. 타이마볼\n3. 퀵볼\n4. 네트볼\n5. 다크볼\n\n(/볼선택 1 이런 형식으로 사용해주세요)");
   }
   
}

if(sender == player && msg.split(' ')[0]=="/볼선택"&&isballselect==1&&ischangeselect==0&&isforgetselect==0)
{
   var ran=Math.floor(Math.random()*100)+1;
   var fixedcapture=capture;
   if(p2hp[p2num-1]<(read(p2pokname, "hp")*2/5))
      fixedcapture=fixedcapture+5;
   else if(p2hp[p2num-1]<(read(p2pokname, "hp")/5))
      fixedcapture=fixedcapture+10;
	if(p2pokstats[5]!=0)
	{
		if(p2pokstats[5]==5)
			fixedcapture=fixedcapture+10;
		else
			fixedcapture=fixedcapture+5;
	}
   if(msg.split(' ')[1]==2)
   {
       if(turn<11)
          fixedcapture=fixedcapture+turn;
       else
          fixedcapture=fixedcapture+10;
      replier.reply(sender+"는 타이마볼을 썼다!");
   }
   else if(msg.split(' ')[1]==3)
   {
      if(turn==1)
         fixedcapture=fixedcapture+10;
      replier.reply(sender+"는 퀵볼을 썼다!");
   }
   else if(msg.split(' ')[1]==4)
   {
      if(read(p2pokname, "type1")==3||read(p2pokname, "type2")==3||read(p2pokname, "type1")==10||read(p2pokname, "type2")==10)
         fixedcapture=fixedcapture+5;
      replier.reply(sender+"는 네트볼을 썼다!");
   }
   else if(msg.split(' ')[1]==4)
   {
      if(read(p2pokname, "type1")==15||read(p2pokname, "type2")==15||read(p2pokname, "type1")==16||read(p2pokname, "type2")==16)
         fixedcapture=fixedcapture+5;
      replier.reply(sender+"는 다크볼을 썼다!");
   }
   else
   {
      fixedcapture=fixedcapture+2;
      replier.reply(sender+"는 하이퍼볼을 썼다!");
   }
   if((fixedcapture)<ran)
   {
      replier.reply("안돼! 포켓몬이 볼에서 나와버렸다!");
      if(Math.floor(Math.random()*10)!=1)
      {
      var enemyselect=0;
      if(p2pp[0]==0&&p2pp[1]==0&&p2pp[2]==0&&p2pp[3]==0)
      {
         replier.reply("상대 "+p2pokname+"는 쓸 수 있는 기술이 없다!");
         //발버둥 구현 예정
      }
      else
      {
         do
         {
            enemyselect=Math.floor(Math.random()*4);
         }while(enemyskills[enemyselect]==" "||p2pp[enemyselect]<1);
		 judgeenemystatus(enemyselect,replier);
      }
      if(p1hp[p1num-1]==0)
      {
         replier.reply(p1pokname+"는 쓰러졌다!");
		 mykilled(sender,replier);
         if(isgameend==1)
         {
            isbattle=0;
			endGame(msg,replier);
            return;
         }
      }
	  if(p1pokstats[9]==1||p1pokstats[9]==4)
		  p1pokstats[9]=0;
	  if(p2pokstats[9]==1||p2pokstats[9]==4)
		  p2pokstats[9]=0;
         turn++;
	   
	   if(isforgetselect==0&&ischangeselect==0)
	   {
		   
		   weatherw(replier);
		   debuffw(replier);
		   reflector(replier);
		   replier.reply(p1pokname+"는 무엇을 할까?\n\n1. 싸운다\n2. 볼\n3. 도망간다\n4. 포켓몬 교체\n\n(/싸운다 이런 형식으로 사용해주세요)");
	   }
      }
      else
      {
		  if(p1pokstats[7]==5){
			  replier.reply("야생 "+p2pokname+"는 상대의 검은눈빛으로 인해 도망칠 수 없다!");
			  if(isforgetselect==0&&ischangeselect==0)
			   {
				   
				   weatherw(replier);
				   debuffw(replier);
				   reflector(replier);
				   replier.reply(p1pokname+"는 무엇을 할까?\n\n1. 싸운다\n2. 볼\n3. 도망간다\n4. 포켓몬 교체\n\n(/싸운다 이런 형식으로 사용해주세요)");
			   }
		  }
		  
		 else{
         replier.reply("야생 "+p2pokname+"는 도망쳐 버렸다!");
         endGame(msg,replier);
		 }
      }
   }
   else
   {
      var i=0;
      var nextspace=6;
      var temp="";
      var tempname="";
      for(i=0;i<6;i++)
      {
         temp="Pok"+(i+1)+"name";
         tempname=read(t1, temp);
         if(tempname==" ")
         {
            nextspace=(i+1);
            break;
         }
      }
      temp="Pok"+nextspace+"name";
      user(t1, temp, p2pokname);
      temp="Pok"+nextspace+"skill";
      user(t1, temp, enemyskills[0]+"/"+enemyskills[1]+"/"+enemyskills[2]+"/"+enemyskills[3]);
      replier.reply("신난다! "+p2pokname+"를 붙잡았다!");
     
      
      endGame(msg,replier);
   }
   isballselect=0;
   isskillselect=0;
   isforgetselect=0;
}

if(sender == player && msg=="/싸운다"&&ischangeselect==0&&isforgetselect==0)
{
   if(isbattle==0)
      replier.reply("배틀 중이 아닙니다.");
   else
   {
      isskillselect=1;
     var types=new Array(" "," "," "," ");
     var pps=new Array(0,0,0,0);
     var i=0;
     for(i=0;i<4;i++)
     {
        if(myskills[i]!=" ")
        {
           types[i]=typetexts[read(myskills[i], "type")];
           pps[i]=read(myskills[i], "pp");
        }
     }
      replier.reply("1. ["+types[0]+"] "+myskills[0]+"    "+p1pp[0]+"/"+pps[0]+"\n2. ["+types[1]+"] "+myskills[1]+"    "+p1pp[1]+"/"+pps[1]+"\n3. ["+types[2]+"] "+myskills[2]+"    "+p1pp[2]+"/"+pps[2]+"\n4. ["+types[3]+"] "+myskills[3]+"    "+p1pp[3]+"/"+pps[3]+"\n\n(/기술 1 이렇게 써주세요.)");
   }
}

if(sender == player && msg.split(' ')[0]=="/기술"&&isskillselect==1)
{
   var myselect=msg.split(' ')[1];
   
   var enemyselect=0;
   if(myselect<1||myselect>4)
      replier.reply("잘못 입력하셨습니다.");
   else if(p1pp[myselect-1]<1)
      replier.reply("해당 기술의 PP를 모두 소진하여 사용할 수 없습니다!");
   else
   {
	   if(p2pp[0]==0&&p2pp[1]==0&&p2pp[2]==0&&p2pp[3]==0)
	   {
		   enemyselect=(-1);
	   }
	   else
	   {
		   do
		   {
			   enemyselect=Math.floor(Math.random()*4);
			}while(enemyskills[enemyselect]==" "||p2pp[enemyselect]<1);
	   }
	   var spd1=read(p1pokname, "spd");
	   var spd2=read(p2pokname, "spd");
	   if(p1pokstats[5]==1)
		   spd1=1;
	   if(p2pokstats[5]==1)
		   spd2=1;
	   if(read(myskills[myselect-1], "addi")==13)
		   spd1=10;
	   if(enemyselect!=(-1))
	   {
		   if(read(enemyskills[enemyselect], "addi")==13)
			   spd2=10;
	   }
	   if(read(myskills[myselect-1], "addi")==14)
		   spd1=0;
	   if(enemyselect!=(-1))
	   {
		   if(read(enemyskills[enemyselect], "addi")==14)
			   spd2=0;
	   }
      if(spd2<spd1)
      {
		  judgemystatus((myselect-1),replier);
         if(p2hp[p2num-1]==0)
         {
            replier.reply("상대 "+p2pokname+"는 쓰러졌다!");
            enemykilled(sender,replier);
            if(isgameend==2)
            {
               endGame(msg,replier);
               return;
            }
         }
         else
         {
            if(enemyselect==(-1))
            {
               replier.reply("상대 "+p2pokname+"는 쓸 수 있는 기술이 없다!");
               //발버둥 구현예정
            }
            else 
				judgeenemystatus(enemyselect,replier);
            if(p1hp[p1num-1]==0)
            {
               replier.reply(p1pokname+"는 쓰러졌다!");
            //Api.reload("by디벨.js");
               mykilled(sender,replier);
               if(isgameend==1)
               {
                  endGame(msg,replier);
                  return;
               }
            }

         }
      }
      else if(spd2>spd1)
      {
         if(enemyselect==(-1))
         {
            replier.reply("상대 "+p2pokname+"는 쓸 수 있는 기술이 없다!");
            //발버둥 구현예정
         }
         else
			judgeenemystatus(enemyselect,replier);
         if(p1hp[p1num-1]==0)
         {
            replier.reply(p1pokname+"는 쓰러졌다!");
         //Api.reload("by디벨.js");
            mykilled(sender,replier);
            if(isgameend==1)
            {
               endGame(msg,replier);
               return;
            }
         }
         else
         {
			judgemystatus((myselect-1),replier);
            if(p2hp[p2num-1]==0)
            {
               replier.reply("상대 "+p2pokname+"는 쓰러졌다!");
            //Api.reload("by디벨.js");
               enemykilled(sender,replier);
               if(isgameend==2)
               {
                  endGame(msg,replier);
                  return;
               }
            }
         }
      }
      else
      {
         var judgefirst=Math.floor(Math.random()*2);
         if(judgefirst==1)
         {
			judgemystatus((myselect-1),replier);  
            if(p2hp[p2num-1]==0)
            {
               replier.reply("상대 "+p2pokname+"는 쓰러졌다!");
            //Api.reload("by디벨.js");
               enemykilled(sender,replier);
               if(isgameend==2)
               {
                  endGame(msg,replier);
                  return;
               }
            }
            else
            {
               if(enemyselect==(-1))
               {
                  replier.reply("상대 "+p2pokname+"는 쓸 수 있는 기술이 없다!");
                  //발버둥 구현예정
               }
               else
				  judgeenemystatus(enemyselect,replier);
               if(p1hp[p1num-1]==0)
               {
                  replier.reply(p1pokname+"는 쓰러졌다!");
                  mykilled(sender,replier);
                  if(isgameend==1)
                  {
                     endGame(msg,replier);
                     return;
                  }
               }
            }
         }
         else
         {
            if(enemyselect==(-1))
            {
               replier.reply("상대 "+p2pokname+"는 쓸 수 있는 기술이 없다!");
               //발버둥 구현예정
            }
            else
               judgeenemystatus(enemyselect,replier);
            if(p1hp[p1num-1]==0)
            {
               replier.reply(p1pokname+"는 쓰러졌다!");
               mykilled(sender,replier);
               if(isgameend==1)
               {
                  endGame(msg,replier);
                  return;
               }
            }
            else
            {
				judgemystatus((myselect-1),replier);
               if(p2hp[p2num-1]==0)
               {
                  replier.reply("상대 "+p2pokname+"는 쓰러졌다!");
                  enemykilled(sender,replier);
                  if(isgameend==2)
                  {
                     endGame(msg,replier);
                     return;
                  }
               }
            }
         }
      }
      isskillselect=0;
      turn++;
	  if(p1pokstats[9]==1||p1pokstats[9]==4)
		  p1pokstats[9]=0;
	  if(p2pokstats[9]==1||p2pokstats[9]==4)
		  p2pokstats[9]=0;
	  
	  if(isforgetselect==0&&ischangeselect==0)
	  {
		weatherw(replier);
		debuffw(replier);
		reflector(replier);
		replier.reply(p1pokname+"는 무엇을 할까?\n\n1. 싸운다\n2. 볼\n3. 도망간다\n4. 포켓몬 교체\n\n(/싸운다 이런 형식으로 사용해주세요)");
	  }
   }
   
}

if(sender == player && msg=="/도망간다")
{
if(isbattle==1)
{
if(p2pokstats[7]==5)
replier.reply(p1pokname+"는 상대의 검은눈빛으로 인해 도망칠 수 없다!");
else
{
replier.reply("무사히 도망쳤다!");
endGame(msg,replier);
}
}
else if(isbattle==2||isbattle==3)
replier.reply("트레이너 대전 중에는 도망칠 수 없습니다!");
}
//
if(sender == player && msg=="/기권")
{
if(isbattle==2||isbattle==3)
{
replier.reply(sender+"는 승부를 기권했다!");
replier.reply(sender+"는 배틀에서 패배했다!");
endGame(msg,replier);
}
}
//
if(msg.split(' ')[0]=="/순서변경"){
var sw1=msg.split(' ')[1];
var sw2=msg.split(' ')[2];
var temp1=" ";
var temp2=" ";
var tempname=" ";
var tt1="";
tt1="player_"+sender;
if(sw1!=sw2&&sw1>0&&sw1<7&&sw2>0&&sw2<7)
{
   temp1="Pok"+sw1+"name";
   temp2="Pok"+sw2+"name";
   tempname=read(tt1, temp2);
   user(tt1, temp2, read(tt1, temp1));
   user(tt1, temp1, tempname);
   temp1="Pok"+sw1+"skill";
   temp2="Pok"+sw2+"skill";
   tempname=read(tt1, temp2);
   user(tt1, temp2, read(tt1, temp1));
   user(tt1, temp1, tempname);
   
   temp1="Pok"+sw1+"level";
   temp2="Pok"+sw2+"level";
   tempname=read(tt1, temp2);
   user(tt1, temp2, read(tt1, temp1));
   user(tt1, temp1, tempname);
   replier.reply(sw1+"번 포켓몬과 "+sw2+"번 포켓몬의 순서가 변경되었습니다.");
}
else
{
   replier.reply("잘못 입력하셨습니다.");
}
tt1="";
}

if(msg.split(' ')[0]=="@데이터변경")
{
	if(sender=="이상훈"||sender.indexOf("디벨로이드")!=(-1)||sender=="정규"||sender=="정쿠/줌쿠")
	{
		var tempa=" ";
		var tempb=" ";
		var tempc=" ";
		tempa=msg.split(' ')[1];
		tempb=msg.split(' ')[2];
		tempc=msg.split(' ')[3];
		user(tempa, tempb, tempc);
		replier.reply(tempa+".json 의"+tempb+"항목을 "+tempc+"로 관리자가 변경하였습니다.");
	}
	else
	{
		replier.reply("데이터 변경은 관리자만 가능합니다. 꼭 필요할 때만 사용해 주세요!");
	}
}

//ㅇㅇ

}
}undefined
