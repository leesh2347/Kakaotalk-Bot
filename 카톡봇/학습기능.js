
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
commList = [];
answList = [];
k_commList = [];
k_answList = [];
allowrooms=["카톡 봇, 디코 봇 개발 놀이터","키네연구소","구 바다 월드","루시 도배방","다들 아침 릴리만세는 외쳤는가?"];
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
if(allowrooms.indexOf(room)==(-1)) return;

if (msg.indexOf(" 라고하면 ")!=(-1)&&msg.indexOf(" 라고해")!=(-1)) {
var comm="";
var answer="";
comm=msg.split(" 라고하면 ")[0];
answer=msg.split(" 라고하면 ")[1].split(" 라고해")[0];
if(room!="키네연구소"){
if (read("data", "command").indexOf(comm)==-1) {
commList=read("data", "command");
answList=read("data", "answer");
k_commList=read("data", "kineroom_command");
k_answList=read("data", "kineroom_answer");
commList.push(comm);
answList.push(answer);
user("data", "command", commList);
user("data", "answer", answList);
replier.reply("[루시] "+comm+"(이)라고 하면 "+answer+"(이)라고 할게요!");
}
else
{
   replier.reply("[루시] 이미 가르쳐준 말 같은데요?");
}
}
else
{
	if(k_managerlist.indexOf(sender)==(-1)) return;
	if (read("data", "kineroom_command").indexOf(comm)==-1) {
	k_commList=read("data", "kineroom_command");
	k_answList=read("data", "kineroom_answer");
	k_commList.push(comm);
	k_answList.push(answer);
	user("data", "kineroom_command", k_commList);
	user("data", "kineroom_answer", k_answList);
	replier.reply("[루시] "+comm+"(이)라고 하면 "+answer+"(이)라고 할게요!");
	}
	else
	{
	   replier.reply("[루시] 이미 가르쳐준 말 같은데요?");
	}
}
}

if (msg.indexOf("ㄴㅇㄱ 라고하지마")==(-1)&&msg.indexOf(" 라고하지마")!=(-1)) {
var comm="";
var answer="";
comm=msg.split(" 라고하지마")[0];
if(room!="키네연구소"){
if (read("data", "command").indexOf(comm)!=(-1)) {
commList=read("data", "command");
answList=read("data", "answer");
answList.splice(commList.indexOf(comm), 1);
commList.splice(commList.indexOf(comm), 1);
user("data", "command", commList);
user("data", "answer", answList);
replier.reply("[루시] "+comm+"(이)라고 할 때의 기억을 지웠어요!");
}
else
{
   replier.reply("[루시] 저는 배운 기억이 없는데요?");
}
}
else
{
	if(k_managerlist.indexOf(sender)==(-1)) return;
	if (read("data", "kineroom_command").indexOf(comm)!=(-1)) {
	k_commList=read("data", "kineroom_command");
	k_answList=read("data", "kineroom_answer");
	k_answList.splice(k_commList.indexOf(comm), 1);
	k_commList.splice(k_commList.indexOf(comm), 1);
	user("data", "kineroom_command", k_commList);
	user("data", "kineroom_answer", k_answList);
	replier.reply("[루시] "+comm+"(이)라고 할 때의 기억을 지웠어요!");
	}
	else
	{
	   replier.reply("[루시] 저는 배운 기억이 없는데요?");
	}
}

}

if(read("data", "kineroom_command").indexOf(msg)!=(-1)&&room=="키네연구소")
{
	replier.reply("[루시]  "+read("data", "kineroom_answer")[read("data", "kineroom_command").indexOf(msg)]);
}

else if(read("data", "command").indexOf(msg)!=(-1)&&room!="키네연구소")
{
	if(msg=="ㄴㅇㄱ")
		replier.reply("ㄴㅇㄱ");
	else
		replier.reply("[루시]  "+read("data", "answer")[read("data", "command").indexOf(msg)]);
}

if(msg=="!학습목록"){
	if(room=="키네연구소"&&k_managerlist.indexOf(sender)!=(-1)){
   var t="";
   k_commList=read("data", "kineroom_command");
   k_answList=read("data", "kineroom_answer");
   for(var i=0;i<k_commList.length;i++){
      t=t+k_commList[i]+":\n"+k_answList[i]+"\n\n";
   }
      replier.reply("현재 학습된 전체 목록\n"+"\u200b".repeat(500)+"\n\n"+t);
   }
   else if(sender.indexOf("디벨로이드")!=(-1)||sender=="이상훈")
   {
   var t="";
   commList=read("data", "command");
   answList=read("data", "answer");
   for(var i=0;i<commList.length;i++){
      t=t+commList[i]+":\n"+answList[i]+"\n\n";
   }
      replier.reply("현재 학습된 전체 목록\n"+"\u200b".repeat(500)+"\n\n"+t);
   }
   else
      replier.reply("[루시] 학습어 목록은 관리자만 열람 가능해요!");
}

}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) {
	var file=JSON.parse(FileStream.read(loc+"data"));
	if(file["kineroom_command"]==null||file["kineroom_command"]==undefined)
	{
		file["kineroom_command"]=[];
		file["kineroom_answer"]=[];
		FileStream.write(loc+"data", JSON.stringify(file));
	}
}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}