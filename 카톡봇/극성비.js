const scriptName = "극성비";
Jsoup = org.jsoup.Jsoup;
FS = FileStream;
var sungbi=[571115568,6120258214,22164317197,64359295696];
var exploc="sdcard/msgbot/Bots/levdata.json";

function chosungbi(index){
	if(isNaN(index)||index>299||index<1) return "레벨은 1~299 사이 숫자만 입력해 주세요.";
	else{
	var l = JSON.parse(FS.read(exploc));
	if(index>209)
		var e=l["data_after210"][index-210];
	else if(index>100)
		var e=l["data_101to209"][index-101];
	else
		var e=l["data_1to100"][index-1];

	var cho=2438047518853/Number(e)*100;

	if(cho>=100)
		return "초월 성장의 비약: 레벨 269 이하까지 1업,\n그 이상부터는 269레벨의 100% 경험치만큼 지급";
	else
		return index+"레벨에서 초성비를 마셨을때의 경험치 획득량 : "+cho.toFixed(3)+"%";
	}
}

function guksungbi(index){
	if(isNaN(index)||index>299||index<1) return "레벨은 1~299 사이 숫자만 입력해 주세요.";
	else{
	var l = JSON.parse(FS.read(exploc));
	if(index>209)
		var e=l["data_after210"][index-210];
	else if(index>100)
		var e=l["data_101to209"][index-101];
	else
		var e=l["data_1to100"][index-1];

	var guk=294971656640/Number(e)*100;

	if(guk>=100)
		return "극한 성장의 비약: 레벨 249 이하까지 1업,\n그 이상부터는 249레벨의 100% 경험치만큼 지급";
	else
		return index+"레벨에서 극성비를 마셨을때의 경험치 획득량 : "+guk.toFixed(3)+"%";
	}
}

function taesungbi(index){
	if(isNaN(index)||index>299||index<1) return "레벨은 1~299 사이 숫자만 입력해 주세요.";
	else{
	var l = JSON.parse(FS.read(exploc));
	if(index>209)
		var e=l["data_after210"][index-210];
	else if(index>100)
		var e=l["data_101to209"][index-101];
	else
		var e=l["data_1to100"][index-1];

	var tae=137783047111/Number(e)*100;

	if(tae>=100)
		return "태풍 성장의 비약: 레벨 239 이하까지 1업,\n그 이상부터는 239레벨의 100% 경험치만큼 지급";
	else
		return index+"레벨에서 태성비를 마셨을때의 경험치 획득량 : "+tae.toFixed(3)+"%";
	}
}

function iksungbi(index){
	if(isNaN(index)||index>299||index<1) return "레벨은 1~299 사이 숫자만 입력해 주세요.";
	else{
	var l = JSON.parse(FS.read(exploc));
	if(index>209)
		var e=l["data_after210"][index-210];
	else if(index>100)
		var e=l["data_101to209"][index-101];
	else
		var e=l["data_1to100"][index-1];
	var s=sungbi[0]/Number(e)*100;

	if(s>=100)
		return "익스트림 성장의 비약: 141~199레벨까지 1~10레벨 랜덤으로 레벨업,\n그 이상부터는 199레벨의 100% 경험치만큼 지급";
	else
		return index+"레벨에서 익성비를 마셨을때의 경험치 획득량 : "+s.toFixed(3)+"%";
	}
}

function sungbi_200_to_209(index){
	if(isNaN(index)||index>299||index<1) return "레벨은 1~299 사이 숫자만 입력해 주세요.";
	else{
	var l = JSON.parse(FS.read(exploc));
	if(index>209)
		var e=l["data_after210"][index-210];
	else if(index>100)
		var e=l["data_101to209"][index-101];
	else
		var e=l["data_1to100"][index-1];
	var s=sungbi[1]/Number(e)*100;
	var res=0;
	if(s>=100)
		return "성장의 비약(200~209): 해당 레벨 구간에서 1업,\n그 이상부터는 209레벨의 100% 경험치만큼 지급"
	else
		return index+"레벨에서 200성비를 마셨을때의 경험치 획득량 : "+s.toFixed(3)+"%";
	}
}

function sungbi_210_to_219(index){
	if(isNaN(index)||index>299||index<1) return "레벨은 1~299 사이 숫자만 입력해 주세요.";
	else{
	var l = JSON.parse(FS.read(exploc));
	if(index>209)
		var e=l["data_after210"][index-210];
	else if(index>100)
		var e=l["data_101to209"][index-101];
	else
		var e=l["data_1to100"][index-1];
	var s=sungbi[2]/Number(e)*100;
	var res=0;
	if(s>=100)
		return "성장의 비약(210~219): 해당 레벨 구간에서 1업,\n그 이상부터는 219레벨의 100% 경험치만큼 지급";
	else
		return index+"레벨에서 210성비를 마셨을때의 경험치 획득량 : "+s.toFixed(3)+"%";
	}
}

function sungbi_220_to_229(index){
	if(isNaN(index)||index>299||index<1) return "레벨은 1~299 사이 숫자만 입력해 주세요.";
	else{
	var l = JSON.parse(FS.read(exploc));
	if(index>209)
		var e=l["data_after210"][index-210];
	else if(index>100)
		var e=l["data_101to209"][index-101];
	else
		var e=l["data_1to100"][index-1];
	var s=sungbi[3]/Number(e)*100;
	var res=0;
	if(s>=100)
		return "성장의 비약(220~229): 해당 레벨 구간에서 1업,\n그 이상부터는 229레벨의 100% 경험치만큼 지급";
	else
		return index+"레벨에서 220성비를 마셨을때의 경험치 획득량 : "+s.toFixed(3)+"%";
	}
}

function highmountain(index){
	if(isNaN(index)||index>299||index<1) return "레벨은 1~299 사이 숫자만 입력해 주세요.";
	else{
		
		if(index<260){
			return "에픽 던전 하이마운틴은 260레벨 이상의 캐릭터만 입장 가능합니다.";
		}
		else{
			var l = JSON.parse(FS.read(exploc));

			var e=l["data_highmountain"][index-260];

			replier.reply(index+"레벨에서 하이마운틴 클리어 시 경험치 획득량 : "+e+"%\n\n7500메포 사용 시: "+(e*5).toFixed(3)+"% (X5)\n30000메포 사용 시: "+(e*9).toFixed(3)+"% (X9)");
		}

	}
}

function angler(index){
	if(isNaN(index)||index>299||index<1) return "레벨은 1~299 사이 숫자만 입력해 주세요.";
	else{
		
		if(index<270){
			return "에픽 던전 앵글러 컴퍼니는 270레벨 이상의 캐릭터만 입장 가능합니다.";
		}
		else{
			var l = JSON.parse(FS.read(exploc));

			var e=l["data_angler"][index-270];

			return index+"레벨에서 앵글러 컴퍼니 클리어 시 경험치 획득량 : "+e+"%\n\n10000메포 사용 시: "+(e*5).toFixed(3)+"% (X5)\n40000메포 사용 시: "+(e*9).toFixed(3)+"% (X9)";
		}

	}
}


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMention, logId, channelId, userHash) {
	//초성비
	if(msg.split(" ")[0]=="!초성비"||msg.split(" ")[0]=="@초성비"){
		var index=Number(msg.split(" ")[1]);
		var res=chosungbi(index);
		replier.reply(res);
	}
		
		
	//극성비
	if(msg.split(" ")[0]=="!극성비"||msg.split(" ")[0]=="@극성비"){
		var index=Number(msg.split(" ")[1]);
		var res=guksungbi(index);
		replier.reply(res);
	}

	//태성비
	if(msg.split(" ")[0]=="!태성비"||msg.split(" ")[0]=="@태성비"){
		var index=Number(msg.split(" ")[1]);
		var res=taesungbi(index);
		replier.reply(res);
	}

	//익성비
	if(msg.split(" ")[0]=="!익성비"||msg.split(" ")[0]=="@익성비"){
		var index=Number(msg.split(" ")[1]);
		var res=iksungbi(index);
		replier.reply(res);
	}

	//200성비
	if(msg.split(" ")[0]=="!성비1"||msg.split(" ")[0]=="@성비1"){
		var index=Number(msg.split(" ")[1]);
		var res=sungbi_200_to_209(index);
		replier.reply(res);
	}

	//210성비
	if(msg.split(" ")[0]=="!성비2"||msg.split(" ")[0]=="@성비2"){
		var index=Number(msg.split(" ")[1]);
		var res=sungbi_210_to_219(index);
		replier.reply(res);
	}

	//220성비
	if(msg.split(" ")[0]=="!성비3"||msg.split(" ")[0]=="@성비3"){
		var index=Number(msg.split(" ")[1]);
		var res=sungbi_220_to_229(index);
		replier.reply(res);
	}

	//하이마운틴
	if(msg.split(" ")[0]=="!하이마운틴"||msg.split(" ")[0]=="@하이마운틴"){
		var index=Number(msg.split(" ")[1]);
		var res=highmountain(index);
		replier.reply(res);
	}
	//하이마운틴
	else if(msg.split(" ")[0]=="!높은산"||msg.split(" ")[0]=="@높은산"||msg.split(" ")[0]=="!안녕산"||msg.split(" ")[0]=="@안녕산"){
		var index=Number(msg.split(" ")[1]);
		var res=highmountain(index);
		replier.reply(res);
	}

	//앵글러
	else if(msg.split(" ")[0]=="!앵글러"||msg.split(" ")[0]=="@앵글러"){
		var index=Number(msg.split(" ")[1]);
		var res=angler(index);
		replier.reply(res);
	}

}


