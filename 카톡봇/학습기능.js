
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
var banrooms=["바다 월드","키네연구소","리부트 길드 <계란> 오픈채팅방","낚시터","메이플 키네시스"];
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
if(banrooms.includes(room)) return;

if (msg.indexOf(" 라고하면 ")!=(-1)&&msg.indexOf(" 라고해")!=(-1)) {
var comm="";
var answer="";
comm=msg.split(" 라고하면 ")[0];
answer=msg.split(" 라고하면 ")[1].split(" 라고해")[0];
if (read("data", "command").indexOf(comm)==-1) {
commList=read("data", "command");
answList=read("data", "answer");
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

if (msg.indexOf("ㄴㅇㄱ 라고하지마")==(-1)&&msg.indexOf(" 라고하지마")!=(-1)) {
var comm="";
var answer="";
comm=msg.split(" 라고하지마")[0];
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

if(read("data", "command").indexOf(msg)!=(-1))
{
	if(msg=="ㄴㅇㄱ")
		replier.reply("ㄴㅇㄱ");
	else if(msg=="ㄷ ㄷ")
		replier.reply("ㄷ ㄷ");
	else
		replier.reply("[루시]  "+read("data", "answer")[read("data", "command").indexOf(msg)]);
}

if(msg=="!학습목록"){
   if(sender.indexOf("디벨로이드")!=(-1)||sender=="이상훈")
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

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}