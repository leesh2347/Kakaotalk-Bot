const br=require('banned_rooms');
const banrooms=br.banrooms['play'];

var playRoom={};

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
	if(banrooms.includes(room)) return;

	if(msg=="@룰렛 도움말"){
		replier.reply("러시안 룰렛 게임\n\n@룰렛 참가: 게임 참가 또는 방 생성\n@룰렛 시작: 게임 시작, 방장만 가능\n게임 진행은 접두문자 없이 '빵' 한 글자만 입력하면 됩니다.");
	}

	if(msg=="@룰렛 참가"){
		if(playRoom[room]==null||playRoom[room]==undefined)
		{
			playRoom[room]={"revolver":[],"onGame":false,"userList":[],"turn":0};
		}
		if(playRoom[room]["onGame"]){
			replier.reply("현재 게임이 진행 중입니다.");
			return;
		}
		if(playRoom[room]["userList"].indexOf(sender)!=-1){
			replier.reply("이미 게임에 참여한 상태입니다.");
			return;
		}
		playRoom[room]["userList"].push(sender);
		
		if(playRoom[room]["userList"][0]==sender)
		{
			playRoom[room]["revolver"]=["win","win","win"];
			replier.reply("러시안 룰렛 생성 완료!\n"+sender+"님이 방장입니다.\n인원이 모인 후 '@룰렛 시작'으로 시작해 주세요.");
		}
		else
		{
			playRoom[room]["revolver"].push("win");
			playRoom[room]["revolver"].push("win");
			replier.reply(sender+"님 참여 완료!\n러시안 룰렛 장전 수: "+playRoom[room]["revolver"].length);
		}
		//replier.reply(playRoom[room]["revolver"].length+" "+playRoom[room]["userList"]+" "+playRoom[room]["turn"]);
		return;
	}

	if(msg=="@룰렛 시작"){
		if(playRoom[room]==null||playRoom[room]==undefined){
			replier.reply("이 방에서 생성된 게임이 없습니다.\n'@룰렛 참가' 명령어로 방을 먼저 생성해 주세요.");
			return;
		}
		if(playRoom[room]["onGame"]){
			replier.reply("게임이 이미 진행 중입니다.");
			return;
		}
		if(sender!=playRoom[room]["userList"][0]){
			replier.reply("방장만 게임을 시작 할 수 있습니다.\n방장: "+playRoom[room]["userList"][0]);
			return;
		}
		if(playRoom[room]["userList"].length==1){
			replier.reply("혼자서는 게임을 진행 할 수 없습니다.");
			return;
		}
		playRoom[room]["onGame"]=true;
		playRoom[room]["revolver"][Math.floor(Math.random()*playRoom[room]["revolver"].length-1)] = "lose";
		replier.reply("게임을 시작합니다.\n'빵' 으로 당신의 차례를 진행해주세요.");
		//replier.reply(playRoom[room]["revolver"].length+" "+playRoom[room]["userList"]+" "+playRoom[room]["turn"]);
		return;
	}

	if(playRoom[room]!=null&&playRoom[room]!=undefined){
		if(playRoom[room]["onGame"]){
			if(msg=="빵"){
			if(sender==playRoom[room]["userList"][playRoom[room]["turn"]]){
				if(playRoom[room]["revolver"][0]=="win"){
				playRoom[room]["revolver"].splice(0,1);
				playRoom[room]["turn"]++;
				if(playRoom[room]["turn"]==playRoom[room]["userList"].length){
					playRoom[room]["turn"]=0;
				}
				replier.reply("철컥. 살아남았습니다.\n'"+playRoom[room]["userList"][playRoom[room]["turn"]]+"'님의 차례입니다.\n남은 횟수: "+playRoom[room]["revolver"].length+"회");
				
				//replier.reply(playRoom[room]["revolver"].length+" "+playRoom[room]["userList"]+" "+playRoom[room]["turn"]);
				return;
			}
			playRoom[room]=null;
			replier.reply("탕!\n'"+sender+"'님이 죽었습니다.\nㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ\n게임이 종료되었습니다.");
			return;
			}
			
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
