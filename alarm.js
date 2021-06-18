let loop = false;
let on = false;
let alarm = [];
const rooms=["ㅇㅇㅇ","메이플 키네시스","메이플스토리 봇 개발 놀이터","아이엠캔들길드","재획파티","다들 아침 릴리만세는 외쳤는가?"];
var i;
 
response = (room, msg, sender, isGroupChat, replier) => {
 
    if (!loop) {
        if (msg == "/시작") {
            loop = true;
            on = true;
            replier.reply("[Bot]\n작동을 시작합니다.");
        }
 
if (msg == "/정지")
            replier.reply("[Bot]\n작동 중이 아닙니다.");
    }
    else if (loop) {
        if (msg == "정지") {
            loop = false;
            replier.reply("[Bot]\n작동을 정지합니다.");
        }
 
if (msg == "/시작")
            replier.reply("[Bot]\n작동 중 입니다.");
    }
 
    while (on) {
        if (!loop)
            break;
        on = false;
let day = new Date();
 
        var nowhour=new Date().getHours();
var nowmin=new Date().getMinutes();

if(nowhour==13&&nowmin==00)
{
   for(i=0;i<rooms.length;i++)
	   Api.replyRoom(rooms[i],"우르스타임 시작! 우르스 가즈아~");
   java.lang.Thread.sleep(60000);
}

if(nowhour==22&&nowmin==28)
{
	var nowday=new Date().getDay();
	if(nowday==0){
	for(i=0;i<rooms.length;i++)
	   Api.replyRoom(rooms[i],"초기화 전 마지막 플래그!\n까먹지 말고 참여하세요!");
   java.lang.Thread.sleep(60000);
	}
}

if(nowhour==22&&nowmin==40)
{
	for(i=0;i<rooms.length;i++)
	   Api.replyRoom(rooms[i],"우르스 우르스 우르스 우르스 우르스 우르스 우르스 우르스");
   java.lang.Thread.sleep(60000);
}

if(nowhour==23&&nowmin==30)
{
	var nowday=new Date().getDay();
	if(nowday==0){
	for(i=0;i<rooms.length;i++)
	   Api.replyRoom(rooms[i],"주간퀘스트는 하셨나요?\n수로는 하셨나요?");
   java.lang.Thread.sleep(60000);
	}
	else if(nowday==3){
	for(i=0;i<rooms.length;i++)
	   Api.replyRoom(rooms[i],"주간보스는 다 돌았나요?\n결정석은 파셨나요?");
   java.lang.Thread.sleep(60000);
	}
}

if(nowhour==23&&nowmin==40)
{
	for(i=0;i<rooms.length;i++)
	   Api.replyRoom(rooms[i],"아맞다 일일보스, 마일리지, 데일리, 몬컬 확인!");
   java.lang.Thread.sleep(60000);
}
 
        java.lang.Thread.sleep(1000);
        on = true;
    }
}
 
onStartCompile = _ => loop = false;