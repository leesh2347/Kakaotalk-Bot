const result=["메린이 응애 나 애기 메린","무자본 평균","경손실 따질 스펙","메벤 평균","메창","메아일체","메이플 인생 메생이","넥슨 VVIP 흑우"];
Jsoup=org.jsoup.Jsoup
var lev;
var murung;
var union;
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
function calculate(nickname){
	var url="https://maple.gg/u/"+nickname;
	var data=Jsoup.connect(url).get();
	murung=Number(data.select(".character-card-additional>li>span").get(0).text().replace("층", ""));
	union=Number(data.select(".character-card-additional>li>small").get(2).text().replace("Lv.", ""));
	lev=Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c="+nickname).get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td:nth-child(3)").text().replace("Lv.", "");
}
 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(room!="바다 월드"){
if(msg=="!메창")
{
replier.reply("사용법: !메창 (닉네임)\n\n레벨-100+무릉x3+유니온/4\n※유니온 8000 이상=250으로 계산\n※무릉 45 이상=무릉x4로 계산\n\n200~300 : 메린이\n301~350 : 무자본 평균\n351~400 : 메른이\n401~500 : 메벤 평균\n501~550 : 메창\n551~600 : 일상생활 < 메이플\n601~700 : 메이플 인생.\n701+ : 넥슨 VVIP");
}
else if(msg.split(" ")[0]=="!메창"){
lev=0;
murung=0;
union=0;
var nick=msg.split(" ")[1];
try{
calculate(nick);

//replier.reply(lev);
var judge=0;
var res=0;
if(murung>44) judge=judge+(murung*4);
else judge=judge+(murung*3);
//replier.reply(judge);
if(union>7999) judge=judge+250;
else judge=judge+(union/40);
//replier.reply(judge);
judge=Math.ceil(judge)+Number(lev)-100;
//replier.reply(judge);
if(judge<301) res=0;
else if(judge<351) res=1;
else if(judge<401) res=2;
else if(judge<501) res=3;
else if(judge<551) res=4;
else if(judge<601) res=5;
else if(judge<701) res=6;
else res=7;
replier.reply("["+nick+"]님의 메창력 테스트 결과....\n\n3대 "+judge+" 치시는\n["+result[res]+"] 입니다.");
}catch(e)
{
	replier.reply("본캐인지 확인해주세요!\n본캐만 측정 가능합니다.")
}
}
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
