FS=FileStream;

var loc="sdcard/katalkbot/Bots/boss/보스데이터.json";

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName){
	if(msg.split(" ")[0]=="!보스")
	{
		var bossname=msg.split("!보스 ")[1];
		let bossdat=JSON.parse(FS.read(loc));
		//replier.reply(bossdat["데이터"]);
		if(bossdat["데이터"][bossname]!=null&&bossdat["데이터"][bossname]!=undefined)
		{
			let bossdata=bossdat["데이터"];
			//replier.reply(bossdata);
			var s="";
			for(var i of Object.keys(bossdata[bossname]["HP"]))
			{
				s=s+"   "+i+": "+bossdata[bossname]["HP"][i]+"\n";
			}
			
			var arc="";
			try{
			if(bossdata[bossname]["arcaneforce"].equals(arc))
			{
				
			}
			else
			{
				arc="아케인포스: "+bossdata[bossname]["arcaneforce"];
			}
			}
			catch(e)
			{
				arc="어센틱포스:\n";
				for(var i of Object.keys(bossdata[bossname]["arcaneforce"]))
			{
				arc=arc+"   "+i+": "+bossdata[bossname]["arcaneforce"][i]+"\n";
			}
			}
			
			replier.reply([
			"["+bossdata[bossname]["name"]+"]",
			"",
			"Lv."+bossdata[bossname]["level"],
			"HP:",
			s,
			"방어율: "+bossdata[bossname]["defenseRate"]+"%",
			"최소 입장 레벨: Lv."+bossdata[bossname]["minLevel"],
			"데스카운트: "+bossdata[bossname]["deathCount"],
			"결정석 가격: "+bossdata[bossname]["bossCrystal"],
			arc,
			"\u200b".repeat(500),
			"",
			"주요 보상:",
			bossdata[bossname]["dropItem"].join("\n"),
			"",
			"Thanks to Lune"
			].join("\n"));
			
		}
		else
			replier.reply("보스 이름이 제대로 입력되었는지 확인해 주세요.\n\n예시: !보스 카오스벨룸 (띄어쓰기 없이)\n※몇몇 축약어도 어느정도 인식합니다.");
	}
}