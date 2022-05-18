const FS = FileStream;
const pathRank="sdcard/katalkbot/Bots/inquiry/banned_nicks.json";  //랭킹파일경로

function response(room, msg, sender, isGroupChat, replier, ImageDB) {
   
   if(msg.split(" ")[0]=="@문의") {
        let banned=JSON.parse(FileStream.read(pathRank));
		if(banned==null){
			let data={"banned":[]};
			FileStream.write(pathRank, JSON.stringify(data));
			banned=JSON.parse(FileStream.read(pathRank));
		}
		if(banned["banned"].includes(sender))
			replier.reply("[루시] 개발자에 의해 문의가 차단되신 분이에요 ㅠㅠ");
		else{
			var content=msg.split("@문의 ")[1];
			Api.replyRoom("디벨로이드_스카니아",sender+"님의 문의 도착\n"+"\u200b".repeat(500)+"\n"+content);
			replier.reply("[루시] 개발자에게 문의를 전송했어요!\n\n※욕설 및 과도한 도배 사용 시 문의가 차단될 수 있어요 ^~^");
		}
   }
   
   if(msg.split(" ")[0]=="@문의차단"&&sender.includes("디벨로이드")&&room==sender) {
        let banned=JSON.parse(FileStream.read(pathRank));
		if(banned==null){
			let data={"banned":[]};
			FileStream.write(pathRank, JSON.stringify(data));
			banned=JSON.parse(FileStream.read(pathRank));
		}
		var content=msg.split("@문의차단 ")[1];
		if(banned["banned"].includes(content))
			replier.reply("이미 차단된 이름이에요.");
		else
		{
			banned["banned"].push(content);
			FileStream.write(pathRank, JSON.stringify(banned));
			replier.reply(content+"님에게서의 문의를 차단합니다.");
		}
   }
   
   if(msg.split(" ")[0]=="@문의차단해제"&&sender.includes("디벨로이드")&&room==sender) {
        let banned=JSON.parse(FileStream.read(pathRank));
		if(banned==null){
			let data={"banned":[]};
			FileStream.write(pathRank, JSON.stringify(data));
			banned=JSON.parse(FileStream.read(pathRank));
		}
		var content=msg.split("@문의차단해제 ")[1];
		if(banned["banned"].includes(content))
		{
			banned["banned"].splice(banned["banned"].indexOf(content), 1);
			FileStream.write(pathRank, JSON.stringify(banned));
			replier.reply(content+"님의 차단을 해제했습니다.");
		}
		else
			replier.reply("차단 목록에 없는 닉네임입니다.");
   }
   
   if(msg.split(" ")[0]=="@문의차단목록"&&sender.includes("디벨로이드")&&room==sender) {
        let banned=JSON.parse(FileStream.read(pathRank));
		if(banned==null){
			let data={"banned":[]};
			FileStream.write(pathRank, JSON.stringify(data));
			banned=JSON.parse(FileStream.read(pathRank));
		}
		if(banned["banned"].length>0)
		{
			replier.reply("문의 차단 목록\n"+"\u200b".repeat(500)+"\n"+banned["banned"].join("\n"));
		}
		else
			replier.reply("차단 목록이 없습니다.");
   }
}