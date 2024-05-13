Jsoup = org.jsoup.Jsoup;
FS = FileStream;
var loc="sdcard/katalkbot/Bots/maplelog.json";

if (FS.read(loc)==null) FS.write(loc, "{}");


Number.prototype.comma = function() {
   var coma=this.toString().replace(/(?=(\d{3})+(?!\d))/g, ",");
   if(coma[0]==",") coma=coma.substr(1);
return coma;
}

function recordnick(sender,nick){
	var rd = JSON.parse(FS.read(loc)) || {};
  rd[sender] = rd[sender] || {};
  rd[sender][nick] = (rd[sender][nick] || 0) + 1;
	let n=""
	var temparr = [];
		for (i in rd[sender]){
			temparr.push(`${i}/${rd[sender][i]}`);
		}
		temparr.sort((a, b) => b.split("/")[1] - a.split("/")[1]);
		n=temparr[0].split("/")[0];
	if(rd[sender][nick]>30&&nick==n){
		rd[sender] = {};
		rd[sender][nick] = 2;
	}
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

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(room=="바다 월드") return;
  if(msg.split(" ")[0]=="@메이플"||msg.split(" ")[0]=="!메이플") {
	try{ 
		  var nick = msg.split(" ")[1];
		  if(nick==undefined)
			  nick=recommendnick(sender,replier);
		  if(nick=="") replier.reply("닉네임을 입력해 주세요.");
		  else
		  {
			  recordnick(sender,nick);
			  
			  var today=new Date();
				var d = new Date(today.setDate(today.getDate() - 1));
				var d2=(d.getYear()+1900)+"-"+String(d.getMonth()+1).padStart(2, "0")+"-"+String(d.getDate()).padStart(2, "0");
			  
			  
			  var ocid1 = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/id?character_name="+encodeURIComponent(nick)).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
				var ocid2=JSON.parse(ocid1)["ocid"];

				var s1 = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/basic?ocid="+ocid2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
				var s2=JSON.parse(s1);
				var server=s2["world_name"];


				if(server.indexOf("리부트")==(-1)){
					var answer = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/ranking/overall?ocid="+ocid2+"&date="+d2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
				}
				else{
					var answer = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/ranking/overall?ocid="+ocid2+"&date="+d2+"&world_type=1").header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
				}
					
				var t=JSON.parse(answer);
				
			  var job1 =t["ranking"][0]["class_name"];
			  var job2 =t["ranking"][0]["sub_class_name"];
			  var lv =Number(t["ranking"][0]["character_level"]);
			  var per=s2["character_exp_rate"];
			  var img=s2["character_image"];
			  var pop =t["ranking"][0]["character_popularity"];
			  var gu =t["ranking"][0]["character_guildname"];
			  if(gu==null||gu==undefined||gu=="")
				  gu="(없음)";
			  
			  if(job2!=null&&job2!=undefined&&job2!="")
				  var printjob=job1+"/"+job2;
			  else
				  var printjob=job1+"/"+job1;
			  
			  if(server.indexOf("리부트")==(-1)){
					
					var answer2= Jsoup.connect("https://open.api.nexon.com/maplestory/v1/ranking/overall?ocid="+ocid2+"&date="+d2+"&class="+job1+"-"+job2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
				}
				else{
					var answer2= Jsoup.connect("https://open.api.nexon.com/maplestory/v1/ranking/overall?ocid="+ocid2+"&date="+d2+"&class="+job1+"-"+job2+"&world_type=1").header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
				}
				
				var t2=JSON.parse(answer2);
			  
			  var ranking_all=Number(t["ranking"][0]["ranking"]);
			  var ranking_class=Number(t2["ranking"][0]["ranking"]);
			  
				replier.reply([
				"["+nick+"@"+server+"]",
				printjob,
				"레벨: " + lv +"("+per+"%)",
				"길드: "+ gu+" │ "+"인기도: "+ pop,
				"월드 랭킹: "+ ranking_all.comma()+"위",
				"직업 랭킹(월드): "+ ranking_class.comma()+"위",
				"\u200b".repeat(500),
				"메이플지지 링크: https://maple.gg/u/"+encodeURIComponent(nick),
				"",
				"환산 링크: https://maplescouter.com/info?name="+encodeURIComponent(nick),
				"",
				"캐릭터 이미지 다운로드",
				img,
				"",
				"Special Thanks 정쿠"
				].join("\n"));
			  
			  
		}
	}
	catch(e)
	{
		var nick = msg.substr(5);
		replier.reply("["+nick+"]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.");
	}
}



}

function onNotificationPosted(sbn, sm) {
    var packageName = sbn.getPackageName();
    if (!packageName.startsWith("com.kakao.tal")) return;
    var actions = sbn.getNotification().actions;
    if (actions == null) return;
    var userId = sbn.getUser().hashCode();
    for (var n = 0; n < actions.length; n++) {
        var action = actions[n];
        if (action.getRemoteInputs() == null) continue;
        var bundle = sbn.getNotification().extras;

        var msg = bundle.get("android.text").toString();
        var sender = bundle.getString("android.title");
        var room = bundle.getString("android.subText");
        if (room == null) room = bundle.getString("android.summaryText");
        var isGroupChat = room != null;
        if (room == null) room = sender;
        var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, "");
        var icon = bundle.getParcelableArray("android.messages")[0].get("sender_person").getIcon().getBitmap();
        var image = bundle.getBundle("android.wearable.EXTENSIONS");
        if (image != null) image = image.getParcelable("background");
        var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
        com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
        if (this.hasOwnProperty("responseFix")) {
            responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, userId != 0);
        }
    }
}