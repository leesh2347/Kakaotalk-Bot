const scriptName = "실검";
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
 const getKeywordList = (function () {
    return JSON.parse(org.jsoup.Jsoup.connect('https://api.signal.bz/news/realtimen')
        .userAgent('Mozilla/5.0')
        .ignoreContentType(true)
        .get()
        .wholeText()).map(element => element.keyword);
})();
 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(room=="바다 월드") return;
if(msg=="@실시간검색어")
{
  var a="";
for(var i=0;i<getKeywordList.length;i++) a=a+"\n"+(i+1)+". "+getKeywordList[i];

replier.reply("돌아온 네이버 실검~\n("+new Date().toLocaleString()+")\n"+a);
  
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