const words=["병신","븅신","씨발","시발","시팔","시벌","씨벌","씨팔","새끼","좆","니미","느금","애미","애비","꺼져","지랄","닥쳐","아가리"];
const ban_words=["헤비","ㅎㅂ","메린이","라이트","ㄹㅇㅌ","메린","헵이"];

function read(target, res){
   return JSON.parse(FileStream.read("sdcard/Kineroom/Data/"+target+".json"))[res];
   }
function write(target, res){
   var result = JSON.stringify(res);
    var write = FileStream.write("sdcard/Kineroom/Data/"+target+".json", result);
    return write;
   }
function data(target){
   return JSON.parse(FileStream.read("sdcard/Kineroom/Data/"+target+".json"));
   }
   
function user(target, res, to){
   var Data = data(target);
   Data[res] = to;
   var result = JSON.stringify(Data);
    var write = FileStream.write("sdcard/Kineroom/Data/"+target+".json", result);
    return write;
   }

function response(room, msg, sender, isGroupChat, replier, ImageDB) {
	if(room!="바다 월드"){
		var msgg=msg.replace(/[0-9a-z]/gi,"").replace(/( )+/g,"");
msgg=msgg.replace("~","");
		let list = [];
		
		for(let i in words) if(msgg.indexOf(words[i]) != -1) list.push(words[i]);
		if(list.length > 0){
			
			replier.reply(sender + "님! 보기 불편한 심한 욕설은 자제 부탁드려요 :)\n\n감지된 욕 : " + list.join(", "));
			user("botlog", "Filter", read("botlog", "Filter") + 1);

}
else {
	
	if(room=="메이플 키네시스") {
		let listt = [];
		for(let i in ban_words) if(msgg.indexOf(ban_words[i]) != -1) listt.push(ban_words[i]);
		if(listt.length>0)
			replier.reply("'"+listt[0]+"'은(는) 금지어 입니다.\n공지를 읽고 주의해 주세요.");
	}
	
}
		
	}
}