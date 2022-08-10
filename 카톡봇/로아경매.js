function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(room=="키네연구소") return;
  if(msg.split(" ")[0]=="@경매"||msg.split(" ")[0]=="!경매")
  {
	  var total=msg.split(" ")[1];
	  if(isNaN(total))
		  replier.reply("잘못된 입력 값입니다.\n\n사용법: @경매 (아이템시세) (사람수)\n※사람 수를 비워둘 시 자동으로 4인으로 계산합니다.");
	  var man=msg.split(" ")[2];
	  if(man==undefined||man==null)
		  man=4;
	  if(1<man&&man<9)
	  {
		  var s=Math.ceil(total/20);
		  var sell=total-s;
		  var div=Math.ceil(sell/man);
		  var sellbenefit=Math.ceil(total-Math.ceil(div*(man-1)*10/11));
		  replier.reply(["💰경매 입찰 계산",
		  "["+total+"골드, "+man+"인 기준]",
		  "",
		  "<사용 목적>",
		  "손익 분기점: "+Math.ceil(total*(man-1)/man),
		  "즉시 입찰가: "+Math.ceil(total*((man-1)*10)/(man*11))+"▼",
		  "🪙분배금: "+Math.ceil(total/man),
		  "",
		  "<판매 목적>",
		  "손익 분기점: "+Math.ceil(div*(man-1)),
		  "즉시 입찰가: "+Math.ceil(Math.ceil(div*(man-1))*10/11)+"▼",
		  "🪙분배금: "+Math.ceil(Math.ceil(total/man)*10/11),
		  "판매 차익: "+sellbenefit
		  ].join("\n"));
	  }
	  else
		  replier.reply("인원 수는 2~8명 안으로 입력해 주세요.");
  }
}
