const player_name=[];  //여기에 채팅방 이름을 입력하세요
const player_job=[]; //0: 시민 1: 마피아 2: 경찰 3:의사
var minnum=6; //최소시작인원
var playernum=0;
var isplaying=0; //2: 방 준비중 1: 게임 진행중
var nowturn=0;
var roommaker="";
var room_name="x";
var mnum=0;
var pnum=0;
var dnum=0;
const vote_name=[];
const vote_num=[];
const votecheck=[];
var isday=0;
var nightcheck;
var nightsel;
var victim="";

function endGame(room,msg,sender,replier)
{
   room_name="x";
   isplaying=0;
   playernum=0;
   player_name=[];
   player_job=[];
   vote_name=[];
   vote_num=[];
   votecheck=[];
   roommaker="";
   nowturn=0;
   pnum=0;
   mnum=0;
   dnum=0;
   isday=0;
   victim="";
   Api.replyRoom(room_name,"게임이 종료됩니다.");
   Api.reload("mapia");
}

function createroom(room,msg,sender,replier)
{
   if(room_name!="x")
      replier.reply("이미 생성된 방이 있습니다.\n현재 진행중인 방: "+room_name);
   else
   {
      room_name=room;
      isplaying=2;
      playernum=1;
      player_name.push(sender);
      player_job.push(0);
      roommaker=sender;
      replier.reply("새로운 게임이 생성되었습니다!\n방장: "+roommaker);
      replier.reply("6인 이상의 인원이 참가해야 게임 시작이 가능합니다.\n참가를 원하는 사람은 오픈채팅 프로필을 통해 개인톡으로 '/마피아 참가'를 입력해 주십시오.\n방장은 게임을 시작하고 싶을 때 오픈채팅 프로필을 통해 개인톡으로 '/마피아 시작'을 입력하시면 됩니다.\n\n*주의: 게임을 진행하는 톡방과 개인톡에서의 닉네임이 일치해야 게임 진행이 가능합니다!\n\n방장은 방 삭제를 원할 경우 '/마피아 종료' 를 통해 방 삭제가 가능합니다.");
   }
}

function gamejoin(room,msg,sender,replier)
{
   if(isplaying==0)
      replier.reply("생성된 방이 없습니다. 게임 진행을 원하는 톡방에서 '/마피아 생성' 을 통해 방을 먼저 생성해 주십시오.");
   else if(isplaying==1)
      replier.reply("이미 진행 중인 게임이 있습니다.\n현재 진행중인 방: "+room_name);
  else if(player_name.indexOf(sender)!=(-1))
     replier.reply("이미 방에 참가하였습니다. 게임이 시작되는 방에서 대기하여 주십시오.\n현재 진행중인 방: "+room_name);
  else
   {
      player_name.push(sender);
      player_job.push(0);
      playernum++;
      replier.reply("방에 참가하였습니다!\n["+room_name+"] 방에서 게임이 시작되니 대기하여 주십시오.");
      Api.replyRoom(room_name,"["+sender+"]님이 게임에 참가하였습니다.\n현재 인원: "+playernum);
   }
}
function deleteroom(room,msg,sender,replier)
{
   if(isplaying==0)
      replier.reply("생성된 방이 없습니다. 게임 진행을 원하는 톡방에서 '/마피아 생성' 을 통해 방을 먼저 생성해 주십시오.");
   else
   {
      if(sender!=roommaker)
         replier.reply("방 삭제는 방장만이 가능합니다.\n방장: "+roommaker);
      else
      {
         replier.reply("방장에 의해 방이 삭제되었습니다.");
         endGame(room,msg,sender,replier);
      }
   }
}

function gamestart(room,msg,sender,replier)
{
   if(isplaying==0)
      replier.reply("생성된 방이 없습니다. 게임 진행을 원하는 톡방에서 '/마피아 생성' 을 통해 방을 먼저 생성해 주십시오.");
   else if(isplaying==1)
      replier.reply("이미 진행 중인 게임이 있습니다.\n현재 진행중인 방: "+room_name);
   else
   {
      if(sender!=roommaker)
         replier.reply("게임 시작은 방장만이 가능합니다.\n방장: "+roommaker);
      else if(playernum<minnum)
         replier.reply("6명 이상부터 게임 시작이 가능합니다.\n현재 인원: "+playernum);
      else
      {
         replier.reply("인증되었습니다. 게임이 시작됩니다.");
         Api.replyRoom(room_name,"방장에 의해 게임이 시작됩니다!\n마피아, 경찰, 의사를 추첨합니다.");
         var temparr=new Array(0,0,0);
         temparr[0]=Math.floor(Math.random()*playernum)+1;
         do{
            temparr[1]=Math.floor(Math.random()*playernum)+1;
         }while(temparr[0]==temparr[1]);
         do{
            temparr[2]=Math.floor(Math.random()*playernum)+1;
         }while(temparr[0]==temparr[2]||temparr[1]==temparr[2]);
         mnum=temparr[0]-1;
         player_job[mnum]=1;
         Api.replyRoom(player_name[mnum],"당신은 마피아입니다.");
         pnum=temparr[1]-1;
         player_job[pnum]=2;
         Api.replyRoom(player_name[pnum],"당신은 경찰입니다.");
         dnum=temparr[2]-1;
         player_job[dnum]=3;
         Api.replyRoom(player_name[dnum],"당신은 의사입니다.");
         Api.replyRoom(room_name,"추첨된 마피아, 경찰, 의사에게 개인톡을 전달하였습니다.");
         isplaying=1;
         nowturn=1;
         Api.replyRoom(room_name,"게임이 시작되었습니다!");
       daystatus(room,msg,sender,replier);
      }
   }
}
function daystatus(room,msg,sender,replier)
{
   isday=1;
   vote_name=[];
   vote_num=[];
   votecheck=[];
   victim="";
var i=0;
if(votecheck.length>0)
{
votecheck.splice(0, votecheck.length);
}
if(vote_name.length>0)
{
vote_name.splice(0, vote_name.length);
}
if(vote_num.length>0)
{
vote_num.splice(0, vote_num.length);
}
   Api.replyRoom(room_name,nowturn+"번째 아침이 밝았습니다.\n현재 생존자: "+player_name.join(", "));
   Api.replyRoom(room_name,"생존자들은 자유롭게 토론 후, '/지목 (@언급)'을 통해 각자 한 명씩 지목하여 주십시오.");
   Api.replyRoom(room_name,votecheck.join(", "));
}
function nightstatus(room,msg,sender,replier)
{
   isday=0;
   nightcheck=new Array(0,0,0);
   nightsel=new Array(0,0,0);
   replier.reply(nowturn+"번째 밤이 되었습니다.\n현재 생존자: "+player_name.join(", "));
   replier.reply("마피아, 경찰, 의사는 각자 개인톡을 확인해 주시고, 나머지는 대기하여 주십시오.");
   Api.replyRoom(player_name[mnum],"마피아는 죽일 사람을 1명 선택하십시오.\n위에서부터의 순서로 해서 '지목 n'의 형식으로 하면 됩니다.\n\n "+player_name.join("\n"));
   if(pnum!=(-1))
      Api.replyRoom(player_name[pnum],"경찰은 정체를 알고 싶은 사람을 1명 선택하십시오.\n위에서부터의 순서로 해서 '지목 n'의 형식으로 하면 됩니다.\n\n "+player_name.join("\n"));
   if(dnum!=(-1))
      Api.replyRoom(player_name[dnum],"의사는 살릴 사람을 1명 선택하십시오.\n위에서부터의 순서로 해서 '지목 n'의 형식으로 하면 됩니다.\n\n "+player_name.join("\n"));
}

function nightselect(room,msg,sender,replier)
{
   var selnum=0;
   selnum=msg.split(' ')[1]-1;
   if(player_name.indexOf(sender)==mnum)
   {
      if(nightcheck[0]==0)
      {
      if(player_name[selnum]==sender)
         replier.reply("자기 자신은 선택할 수 없습니다!");
      else
      {
         nightsel[0]=selnum;
         nightcheck[0]=1;
         replier.reply("선택을 완료하였습니다.");
      }
      }
   }
   else if(player_name.indexOf(sender)==pnum)
   {
      if(nightcheck[1]==0)
      {
      if(player_name[selnum]==sender)
         replier.reply("자기 자신은 선택할 수 없습니다!");
      else
      {
         nightsel[1]=selnum;
         nightcheck[1]=1;
         replier.reply("선택을 완료하였습니다.");
      }
      }
   }
   else
   {
      if(nightcheck[2]==0)
      {
         nightsel[2]=selnum;
         nightcheck[2]=1;
         replier.reply("선택을 완료하였습니다.");
      }
   }
   if(pnum==(-1))
      nightcheck[1]=1;
   if(dnum==(-1))
      nightcheck[2]=1;
   if(nightcheck.indexOf(0)==(-1))
   {
      isday=2;
      Api.replyRoom(room_name,"마피아, 경찰, 의사가 모두 선택을 완료하였습니다.");
      nightjudge(room,msg,sender,replier);
      nowturn++;
     if(isplaying==1)
        daystatus(room,msg,sender,replier);
      //Api.replyRoom(room_name,isday);
      
   }
}

function nightjudge(room,msg,sender,replier)
{
   if(dnum==(-1))
   {
      Api.replyRoom(room_name,"마피아에 의해 "+player_name[nightsel[0]]+"님이 살해되었습니다.");
      isgameend(room,msg,sender,replier,nightsel[0]);
   }
   else if(nightsel[0]==nightsel[2])
      Api.replyRoom(room_name,"마피아가 공격한 자는 의사에 의해 살아남았습니다.");
   else
   {
      Api.replyRoom(room_name,"마피아에 의해 "+player_name[nightsel[0]]+"님이 살해되었습니다. 의사는 피해자를 살리지 못했습니다.");
      isgameend(room,msg,sender,replier,nightsel[0]);
   }
   if(pnum!=(-1))
      Api.replyRoom(room_name,"경찰이 조사한 사람의 직업은 ["+printjob(room,msg,sender,replier,nightsel[1])+"] 였습니다.");
}

function vote(room,msg,sender,replier)
{
      if(votecheck.indexOf(sender)==-1)
      {
      var tempname="";
      var isvote=0;
      tempname=msg.split('@')[1];
      for(var i=0;i<playernum;i++)
      {
         if(tempname.indexOf(player_name[i])!=-1)
         {
            if(vote_name.indexOf(player_name[i])==-1)
            {
               vote_name.push(player_name[i]);
               vote_num.push(0);
            }
            vote_num[vote_name.indexOf(player_name[i])]++;
            isvote=1;
            break;
         }
         
      }
      if(isvote==1)
      {
         votecheck.push(sender);
         var ttext="";
         for(var i=0;i<vote_name.length;i++)
         {
            ttext=ttext+""+vote_name[i]+"("+vote_num[i]+"), ";
         }
         replier.reply(sender+"님이 "+tempname+"님을 지목하였습니다.\n현재 투표 현황: "+ttext);
      }
      if(votecheck.length==playernum)
      {
         isday=2;
         judge(room,msg,sender,replier);
       if(victim=="x")
       {
          replier.reply("투표가 종료되었습니다.\n동점자가 발생하여 사망자는 없습니다.");
       }
       else
       {
         replier.reply("투표가 종료되었습니다.\n투표 결과에 의해 "+victim+"님이 사망하였습니다.");
         isgameend(room,msg,sender,replier,player_name.indexOf(victim));
       }
       if(isplaying==1)
          nightstatus(room,msg,sender,replier);
      }
      
      }
}

function judge(room,msg,sender,replier)
{
   var max=1;
   var n=1;
   var isdraw=0;
   for(var i=0;i<vote_name.length;i++)
   {
      if(max<vote_num[i])
      {
         max=vote_num[i];
         n=i+1;
      }
   }
   for(var i=0;i<vote_name.length;i++)
   {
      if(max==vote_num[i])
      {
         isdraw++;
      }
   }
   if(isdraw>1)
      victim="x";
   else
      victim=vote_name[n-1];
}

function isgameend(room,msg,sender,replier,deadnum)
{
Api.replyRoom(room_name,player_name[deadnum]+"님의 직업은 ["+printjob(room,msg,sender,replier,deadnum)+"]이었습니다.");
   if(player_job[deadnum]==1)
   {
     var t=new Array("","","");
     t[0]=player_name[mnum];
     t[1]=player_name[pnum];
     t[2]=player_name[dnum];
      player_name.splice(deadnum, 1);
      player_job.splice(deadnum, 1);
      playernum--;
     mnum=player_name.indexOf(t[0]);
     pnum=player_name.indexOf(t[1]);
     dnum=player_name.indexOf(t[2]);
      Api.replyRoom(room_name,"마피아가 사망함으로서 시민 팀의 승리입니다. 축하합니다!\n생존자: "+player_name.join(", "));
      endGame(room,msg,sender,replier);
      
   }
   else if(playernum<4)
   {
      var t=new Array("","","");
     t[0]=player_name[mnum];
     t[1]=player_name[pnum];
     t[2]=player_name[dnum];
      player_name.splice(deadnum, 1);
      player_job.splice(deadnum, 1);
      playernum--;
     mnum=player_name.indexOf(t[0]);
     pnum=player_name.indexOf(t[1]);
     dnum=player_name.indexOf(t[2]);
      Api.replyRoom(room_name,"시민이 1명만 남음으로서 마피아의 승리입니다.\n생존자: "+player_name.join(", "));
      endGame(room,msg,sender,replier);
   }
   else
   {
     var t=new Array("","","");
     t[0]=player_name[mnum];
     t[1]=player_name[pnum];
     t[2]=player_name[dnum];
      player_name.splice(deadnum, 1);
      player_job.splice(deadnum, 1);
      playernum--;
     mnum=player_name.indexOf(t[0]);
     pnum=player_name.indexOf(t[1]);
     dnum=player_name.indexOf(t[2]);
   }
}

function printjob(room,msg,sender,replier,deadnum)
{
   if(player_job[deadnum]==1)
      return "마피아";
   else if(player_job[deadnum]==2)
      return "경찰";
   else if(player_job[deadnum]==3)
      return "의사";
   else
      return "시민";
}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
   if(room=="메이플 키네시스") return;
   
   if(msg=="/마피아 도움말")
      replier.reply("마피아게임 v1.0 by 디벨\n\n/마피아 생성\n/마피아 시작\n/마피아 종료\n/마피아 정보\n\n*본 게임은 비밀 메시지 전달을 위해 개인톡을 요구합니다. 본 봇의 오픈채팅 프로필을 이용해 주시기 바라며, 다른 메시지와의 혼동에 주의해주시길 바랍니다.");
   if(msg=="/마피아 생성")
      createroom(room,msg,sender,replier);
   if(msg=="/마피아 종료")
      deleteroom(room,msg,sender,replier);
   if(room==sender&&msg=="/마피아 참가")
      gamejoin(room,msg,sender,replier);
if(msg=="/마피아 정보")
  {
     if(isplaying!=1)
        replier.reply("현재 진행중인 게임이 없습니다.");
     else
        replier.reply("현재 진행중인 게임 정보\n\n게입 진행중인 방:"+room_name+"\n방장:"+roommaker+"\n"+nowturn+"번째 날\n생존자: "+player_name.join(", "));
  }
   if(room==sender&&msg=="/마피아 시작")
   {
      gamestart(room,msg,sender,replier);
      
   }
   if(isplaying==1&&isday==1&&msg.split(' ')[0]=="/지목")
      vote(room,msg,sender,replier);
   if(isplaying==1&&isday==0&&room==sender&&msg.split(' ')[0]=="지목")
      nightselect(room,msg,sender,replier);
}
