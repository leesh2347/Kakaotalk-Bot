var lastreboot=0;
var nowam=0;
function reboot(replier)
{
	/*
	여기에 재부팅할 봇들을 넣어줍니다
	
	Api.reload("봇이름1");
	Api.reload("봇이름2");
	
	이런 식으로 해주시면 됩니다
	봇 이름은 해당 봇의 js 소스파일 이름
	
	굳이 모든 봇을 넣을 필요는 없고 카링과 조금 무거운 소스만 넣어줘도 됩니다
 */
	replier.reply("자동 재부팅 완료");
}

function response(room, msg, sender, isGroupChat, replier, ImageDB) {
var today = new Date().getDay();
var nowtime=new Date().getHours();
if(nowtime>12)
	nowam=0;
else
	nowam=1;
if(lastreboot!=nowam)
{
	reboot(replier);
	lastreboot=nowam;
}
}