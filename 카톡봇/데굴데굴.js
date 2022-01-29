const scriptName = "ㄷㄱㄷㄱ";
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(msg=="!ㄷㄱㄷㄱ"){
   var n1=0;
   var n2=0;
   var n3=0;
   var n4=0;
n1=Math.floor(Math.random()*7)+4;
do{
n2=Math.floor(Math.random()*(17-n1-4))+4;
}while(n2>10);
do
{
n3=Math.floor(Math.random()*(21-n1-n2-4))+4;
}while(n3>10);
n4=25-(n1+n2+n3);
replier.reply("["+sender+"]\n\nSTR: "+n1+"\nDEX: "+n2+"\nINT: "+n3+"\nLUK: "+n4+"\n");
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
