const scriptName = "무릉유니온";
Jsoup=org.jsoup.Jsoup;
FS = FileStream;
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
var loc="sdcard/katalkbot/Bots/maplelog.json";
if (FS.read(loc)==null) FS.write(loc, "{}");

function recordnick(sender,nick){
	var rd = JSON.parse(FS.read(loc));
	if(rd[sender]==undefined) rd[sender] = {};
	if(rd[sender][nick]==undefined)rd[sender][nick] = 0;
	rd[sender][nick] = rd[sender][nick]+1;
	FS.write(loc, JSON.stringify(rd))
	
}

function recommendnick(sender,replier){
	var n="";
	var rd = JSON.parse(FS.read(loc));
	if(rd[sender]==undefined){
		rd[sender] = {};
		n="";
	}
	else{
		result = [];
		for (i in rd[sender]){
			result.push(i+"/"+rd[sender][i]);
		}
		result.sort((a, b)=>a.split("/")[1] - b.split("/")[1]).reverse();
		n=result[0].split("/")[0];
	}
	
	return n;
}
 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(room=="바다 월드") return
if(msg.split(" ")[0]=="@무릉")
{
var nick=msg.split("@무릉 ")[1];
if(nick==undefined)
	 nick=recommendnick(sender,replier);
if(nick=="") replier.reply("닉네임을 입력해 주세요.");
else
{
if(nick.indexOf(" ")==(-1)){
try{
var url="https://maple.gg/u/"+nick;
var data=Jsoup.connect(url).get();
var a=data.select(".character-card-additional>li>b").get(0).text();
var text="";
text=text+data.select(".character-card-summary-item").get(1).text()+"/"+data.select(".character-card-summary-item").get(2).text()+"\n";
if(a=="예전무릉")
{
text=text+"기록이 없습니다.\n\n개편전 무릉 기록\n";
}
text=text+"층수: "+data.select(".character-card-additional>li>span").get(0).text()+"\n시간: "+data.select(".character-card-additional>li>small").get(1).text();
recordnick(sender,nick);
replier.reply("["+nick+"]\n"+text);
}catch(e){
replier.reply("["+nick+"]\n없는 캐릭터명 입니다.");
}
}
else
{
	var nickarr=nick.split(" ");
	var res="";
	var nickarrlen=nickarr.length;
	if(nickarrlen>6) nickarrlen=6;
	var text="";
	for(var i=0;i<nickarrlen;i++)
	{
		try{
			text="";
			var url="https://maple.gg/u/"+nickarr[i];
			var data=Jsoup.connect(url).get();
			var a=data.select(".character-card-additional>li>b").get(0).text();
			//text=text+data.select(".character-card-summary-item").get(1).text()+"/"+data.select(".character-card-summary-item").get(2).text()+"\n";
			if(a=="예전무릉")
			{
			text=text+"기록없음 / 개편전 무릉 ";
			}
			text=text+data.select(".character-card-additional>li>span").get(0).text();
		}
		catch(e){
			text="(기록없음)";
		}
		res=res+"["+nickarr[i]+"] "+text+"\n";
	}
	replier.reply(res);
}
}
}
if(msg.split(" ")[0]=="@유니온")
{
var nick=msg.split(" ")[1];
if(nick==undefined)
	 nick=recommendnick(sender,replier);
if(nick=="") replier.reply("닉네임을 입력해 주세요.");
else{
try{
var url="https://maple.gg/u/"+nick;
var data=Jsoup.connect(url).get();
var a=data.select(".character-card-additional>li>span").get(1).text();
var text="";
if(a!="기록없음")
{
var n=data.select("#app > div.card.border-bottom-0 > div > section > div.row.text-center > div:nth-child(3) > section > footer > div.d-block.mb-1 > span").text().split("전투력 ")[1];
var num=Number(parseInt(n.replace(/,/g,"")));
var coin=Math.ceil(num*864/1000000000);
if(data.select(".character-card-additional>li>small").get(0).text()=="최고")
text=text+data.select(".character-card-additional>li>span").get(1).text()+"\n"+data.select(".character-card-additional>li>small").get(2).text()+"\n전투력: "+n+"\n일일 코인 수급량: "+coin;
else
text=text+data.select(".character-card-additional>li>span").get(1).text()+"\n"+data.select(".character-card-additional>li>small").get(0).text()+"\n전투력: "+n+"\n일일 코인 수급량: "+coin;
recordnick(sender,nick);
replier.reply("["+nick+"]\n"+text);
}
else
{
recordnick(sender,nick);
replier.reply("["+nick+"]\n기록이 없습니다.\n유니온은 본캐만 조회가 가능합니다. 본캐인지 확인해주세요!");
}
}
catch(e){
	replier.reply("["+nick+"]\n없는 캐릭터명 입니다.");
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