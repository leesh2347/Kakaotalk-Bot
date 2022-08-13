const words=["병신","븅신","씨발","시발","시팔","시벌","씨벌","씨팔","새끼","좆","니미","느금","애미","애비","꺼져","지랄","닥쳐","아가리"];
const wrongspell=["됬","됌","됄","되요","몇일","되서","희안"];
const answer=["됐","됨","될","돼요","며칠","돼서","희한"];
const k_managerlist=["디벨로이드_스카니아","산조","듀랑고엘린","스카니아/우아거"];
FS = FileStream;

var loc="sdcard/msgbot/Bots/filterrooms.json";
if (FS.read(loc)==null) FS.write(loc, "{\"rooms\":[]}");

let rd = JSON.parse(FS.read(loc));

function response(room, msg, sender, isGroupChat, replier, ImageDB) {
	if(msg=="@욕설필터"||msg=="!욕설필터"){
		if(room=="키네연구소"&&k_managerlist.indexOf(sender)==(-1)){
			replier.reply("[루시] 관리자만 가능한 기능이에요!");
		}
		else{
			if(rd["rooms"].includes(room)){
				rd["rooms"].splice(rd["rooms"].indexOf(room), 1);
				FS.write(loc, JSON.stringify(rd));
				rd = JSON.parse(FS.read(loc));
				replier.reply("[루시] 욕설 필터링을 해제합니다.\n명령어를 다시 입력하면 기능이 다시 시작됩니다.");
			}
			else{
				rd["rooms"].push(room);
				FS.write(loc, JSON.stringify(rd));
				rd = JSON.parse(FS.read(loc));
				replier.reply("[루시] 욕설 필터링을 시작합니다.\n명령어를 다시 입력하면 기능이 해제됩니다.");
			}
		}
	}
	if(rd["rooms"].includes(room)){
		var msgg=msg.replace(/[0-9a-z]/gi,"").replace(/( )+/g,"");
msgg=msgg.replace("~","");
		let list = [];
		
		for(let i in words) if(msgg.indexOf(words[i]) != -1) list.push(words[i]);
		if(list.length > 0){
			
			replier.reply(sender + "님! 보기 불편한 심한 욕설은 자제 부탁드려요 :)\n\n감지된 욕 : " + list.join(", "));
			user("botlog", "Filter", read("botlog", "Filter") + 1);

		}
	else {
		
			let listw = [];
			let lista=[];
			for(let i in wrongspell) {
				if(msgg.indexOf(wrongspell[i]) != -1) 
				{
					listw.push(wrongspell[i]);
					lista.push(answer[i]);
				}
			}
			if(listw.length>0)
				replier.reply("'"+listw[0]+"'은(는) 없는 말이에요 '"+lista[0]+"'라고 써주세요");
		
	}
	}
}