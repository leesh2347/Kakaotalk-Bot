const serverk=["베라","스카니아","제니스","크로아","이노시스","유니온","RED","엘리시움","루나","오로라","리부트","리부트2","아케인","노바","버닝","버닝2","버닝3"];
Jsoup = org.jsoup.Jsoup;
FS = FileStream;

var loc="sdcard/msgbot/Bots/무통시세/lastrecord.json";
if (FS.read(loc)==null) FS.write(loc, "{}");

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(msg.split(" ")[0]=="!물통"||msg.split(" ")[0]=="@물통")
{
var serv=msg.split(" ")[1];
if(serv=="레드") serv="RED";
if(serverk.indexOf(serv)==-1||serv=="평균")
{
var num=Number(parseInt(msg.split(" ")[2]));
try{
	
var a=Jsoup.connect("http://trade.itemmania.com/_xml/gamemoney_servers.xml.php?gamecode=138").get();
var str="";
var str2="{\"a\":0";
for(var i=0;i<serverk.length;i++)
{
	if(i!=10&&i!=11){
		str=str+serverk[i]+" : "+a.select("data")[i].attr("price")+"\n";
		str2=str2+",\""+serverk[i]+"\":"+a.select("data")[i].attr("price");
	}
}
str2=str2+"}";

FS.write(loc,str2);
replier.reply("서버별 물통 시세 현황\n\n"+str+"\n\nThanks to Lune");
}
catch(e){
	var rd = JSON.parse(FS.read(loc));
	var strr="";
	for(var i=0;i<serverk.length;i++)
	{
	strr=strr+serverk[i]+" : "+rd[serverk[i]]+"\n";
	}
	replier.reply("서버별 물통 시세 현황\n\n"+strr+"\n\nThanks to Lune");
}
}
else
{
var num=Number(parseInt(msg.split(" ")[2]));

try{
	
var a=Jsoup.connect("http://trade.itemmania.com/_xml/gamemoney_servers.xml.php?gamecode=138").get();
var res=a.select("data")[serverk.indexOf(serv)].attr("price");
if(isNaN(num)) num=1;

var rd = JSON.parse(FS.read(loc));
rd[serv]=Number(res);
FS.write(loc,JSON.stringify(rd));

replier.reply("현재 ["+serv+"] 서버의 물통 시세 : "+res+"\n\n입력하신 "+num+"억의 시세는\n"+Number(res)*num+"원 입니다.\n\nThanks to Lune");

}
catch(e){
	var rd = JSON.parse(FS.read(loc));
	var ress=rd[serv];
	if(isNaN(num)) num=1;
	replier.reply("현재 ["+serv+"] 서버의 물통 시세 : "+ress+"\n\n입력하신 "+num+"억의 시세는\n"+Number(ress)*num+"원 입니다.\n\nThanks to Lune");
	
}
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
