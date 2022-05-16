
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
limit = 31
commList = {};
answList = {};
k_managerlist=["디벨로이드_스카니아","산조","듀랑고엘린","스카니아/우아거"];
var loc="sdcard/katalkbot/Bots/학습기능/";

function read(target, res){
   return JSON.parse(FileStream.read(loc+""+target+".json"))[res];
   }
function write(target, res){
   var result = JSON.stringify(res);
    var write = FileStream.write(loc+""+target+".json", result);
    return write;
   }
function data(target){
   return JSON.parse(FileStream.read(loc+""+target+".json"));
   }
function user(target, res, to){
   var Data = data(target);
   Data[res] = to;
   var result = JSON.stringify(Data);
    var write = FileStream.write(loc+""+target+".json", result);
    return write;
   }

function response (room, msg, sender, isGroupChat, replier, ImageDB) {

if (msg.indexOf(" 라고하면 ")!=(-1)&&msg.indexOf(" 라고해")!=(-1)) {
	if(room=="키네연구소"&&k_managerlist.indexOf(sender)==(-1)){
		replier.reply("[루시] 관리자만 가능한 기능이에요!");
	}
	else{
		var comm="";
		var answer="";
		comm=msg.split(" 라고하면 ")[0];
		answer=msg.split(" 라고하면 ")[1].split(" 라고해")[0];
		commList=read("data", "command");
		answList=read("data", "answer");
		if(commList[room]==null||commList[room]==undefined)
			commList[room]=[];
		if(answList[room]==null||answList[room]==undefined)
			answList[room]=[];
		if (commList[room].indexOf(comm)==-1) {
			commList[room].push(comm);
			answList[room].push(answer);
			user("data", "command", commList);
			user("data", "answer", answList);
			replier.reply("[루시] "+comm+"(이)라고 하면 "+answer+"(이)라고 할게요!");
		}
		else
		{
		   replier.reply("[루시] 이미 가르쳐준 말 같은데요?");
		}
	}
}

else if (msg.indexOf("ㄴㅇㄱ 라고하지마")==(-1)&&msg.indexOf(" 라고하지마")!=(-1)) {
	if(room=="키네연구소"&&k_managerlist.indexOf(sender)==(-1)){
		replier.reply("[루시] 관리자만 가능한 기능이에요!");
	}
	else{
		var comm="";
		var answer="";
		comm=msg.split(" 라고하지마")[0];
		commList=read("data", "command");
		answList=read("data", "answer");
		if(commList[room]==null||commList[room]==undefined)
			commList[room]=[];
		if(answList[room]==null||answList[room]==undefined)
			answList[room]=[];
		if (commList[room].indexOf(comm)!=(-1)) {
			answList[room].splice(commList[room].indexOf(comm), 1);
			commList[room].splice(commList[room].indexOf(comm), 1);
			user("data", "command", commList);
			user("data", "answer", answList);
			replier.reply("[루시] "+comm+"(이)라고 할 때의 기억을 지웠어요!");
		}
		else
		{
		   replier.reply("[루시] 저는 배운 기억이 없는데요?");
		}
	}
}

else if(msg=="!학습목록"){
	var ismanager=0;
	if(room=="키네연구소")
	{
		if(k_managerlist.indexOf(sender)!=(-1)) ismanager=1;
	}
	else{
		if(sender.includes("디벨로이드")||sender=="이상훈") ismanager=1;
	}
	if(ismanager==1){
   var t="";
   commList=read("data", "command");
	answList=read("data", "answer");
	if(commList[room]==null||commList[room]==undefined)
		commList[room]=[];
	if(answList[room]==null||answList[room]==undefined)
		answList[room]=[];
   for(var i=0;i<commList[room].length;i++){
      t=t+commList[room][i]+":\n"+answList[room][i]+"\n\n";
   }
      replier.reply(room+"방의 현재 학습된 전체 목록\n"+"\u200b".repeat(500)+"\n\n"+t);
   }
   else
      replier.reply("[루시] 학습어 목록은 관리자만 열람 가능해요!");
}

else{
	commList=read("data", "command");
	answList=read("data", "answer");
	if(commList[room]==null||commList[room]==undefined)
		commList[room]=[];
	if(answList[room]==null||answList[room]==undefined)
		answList[room]=[];
	if(commList[room].indexOf(msg)!=(-1))
	{
		if(msg=="ㄴㅇㄱ")
			replier.reply("ㄴㅇㄱ");
		else
			replier.reply("[루시]  "+answList[room][commList[room].indexOf(msg)]);
	}
	
}




}