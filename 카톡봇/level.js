Jsoup = org.jsoup.Jsoup;
FS = FileStream;
function getexp(index){
var l = JSON.parse(FS.read(exploc));
if(index>209)
	var e=l["data_after210"][index-210];
else if(index>100)
	var e=l["data_101to209"][index-101];
else
	var e=l["data_1to100"][index-1];
return Number(e);
}

var loc="sdcard/msgbot/Bots/maplelog.json";
var exploc="sdcard/msgbot/Bots/levdata.json";
if (FS.read(loc)==null) FS.write(loc, "{}");

function recordnick(sender,nick){
	var rd = JSON.parse(FS.read(loc));
	if(rd[sender]==undefined) rd[sender] = {};
	if(rd[sender][nick]==undefined)rd[sender][nick] = 0;
	rd[sender][nick] = rd[sender][nick]+1;
	var n=""
	var temparr = [];
		for (i in rd[sender]){
			temparr.push(i+"/"+rd[sender][i]);
		}
		temparr.sort((a, b)=>a.split("/")[1] - b.split("/")[1]).reverse();
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

function sum_cnt(index1,index2) {
var l = JSON.parse(FS.read(exploc));
var n=0;
for(var ii=Number(index1);ii<Number(index2);ii++){
	if(ii>209)
		n=n+l["data_after210"][ii-210];
	else if(ii>100)
		n=n+l["data_101to209"][ii-101];
	else
		n=n+l["data_1to100"][ii-1];
}
return Number(n);
}

function unitExp(remaintonext){
tempNum = remaintonext/10000
unit = "약 " + Number((Math.ceil(remaintonext/10000)))+ "만"
jo = 0
yuk = 0
man = 0  
if(tempNum>100000000){ //피 1조 이상     
man = parseInt(tempNum%10000)
tempNum=tempNum/10000
yuk = parseInt(tempNum%10000)
tempNum=tempNum/10000
jo =parseInt(tempNum%10000)
if(yuk==0 && man==0){
unit = jo+"조 "   
}else if(yuk==0){
unit = jo+"조 "+man+"만"
}else if(man==0){
unit = jo+"조 "+yuk+"억 "
}else{
unit = jo+"조 "+yuk+"억 "+man+"만"
}    
}else if(tempNum>10000){ // 피 1억이상     
man = parseInt(tempNum%10000)
tempNum=tempNum/10000
yuk = parseInt(tempNum%10000)
if(man==0){
unit = yuk+"억 "
}else{
unit = yuk+"억 "+man+"만"   
}
}else if(tempNum>100){ //피 100만이상    
man = parseInt(tempNum%10000)
unit = man+"만"  
}
// if(jo == 0){
   // }else if()
return unit 
}

function levelsearch(nick,sender, nextlev,date){
	if(nick=="") return "닉네임을 입력해 주세요.";
	else
	{
			  recordnick(sender,nick);
			  
			  
			  
			  
			  
			  var ocid1 = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/id?character_name="+encodeURIComponent(nick)).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
				var ocid2=JSON.parse(ocid1)["ocid"];

				var levurl="https://open.api.nexon.com/maplestory/v1/character/basic?ocid="+ocid2;
				  var ress="["+nick+"]\n";
				  
				  if(date.includes("최근"))
				  {
					  ress=ress+"(검색 기준: 실시간)\n";
				  }
				  else{
					  levurl=levurl+"&date="+date;
					  ress=ress+"(검색 기준: "+date+")\n";
				  }

				var s1 = Jsoup.connect(levurl).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
				var s2=JSON.parse(s1);
				
				var level=s2["character_level"];
				var exp=s2["character_exp"];
				
				if(isNaN(level)||level==undefined||level==null){
					return "x";
				}
				else if(level>299){
					return "["+nick+"]\nLv."+level;
				}else{
					
					
					var per=(exp/getexp(level)*100).toFixed(3);
					var remaintonext=0;
					var remaintomax=0;
					if(isNaN(nextlev)||nextlev==undefined||nextlev<(level+1)){
						remaintonext=getexp(level)-exp;
						remaintomax=sum_cnt(level,300)-exp;       
						 if((Math.ceil(remaintomax/10000000000000000)-1)>0){
							return ress+"Lv."+level+"("+per+"%)\n다음 레벨까지 경험치\n"+unitExp(remaintonext)+
							"\n만렙까지 : "+(Math.ceil(remaintomax/10000000000000000)-1)+"경 "+Number((Math.ceil(remaintomax/1000000000000)-(Math.ceil(remaintomax/10000000000000000)-1)*10000)-1)+"조 "+(Math.ceil(remaintomax/100000000)-(Math.ceil((remaintomax/1000000000000)-1)*10000)-1)+"억"+"\u200b".repeat(500)+"\n\nSpecial Thanks 정쿠,우락키네";
						}else{
							return ress+"Lv."+level+"("+per+"%)\n다음 레벨까지 경험치\n"+unitExp(remaintonext)+"\n만렙까지 : "+Number((Math.ceil(remaintomax/1000000000000)-(Math.ceil(remaintomax/10000000000000000)-1)*10000)-1)+"조 "+(Math.ceil(remaintomax/100000000)-(Math.ceil((remaintomax/1000000000000)-1)*10000)-1)+"억"+"\u200b".repeat(500)+"\n\nSpecial Thanks 정쿠,우락키네";
						}
					}
					else{
						remaintomax=sum_cnt(level,nextlev)-exp;       
						 if((Math.ceil(remaintomax/10000000000000000)-1)>0){
							return ress+"Lv."+level+"("+per+"%)\n"+nextlev+"레벨까지 : "+(Math.ceil(remaintomax/10000000000000000)-1)+"경 "+Number((Math.ceil(remaintomax/1000000000000)-(Math.ceil(remaintomax/10000000000000000)-1)*10000)-1)+"조 "+(Math.ceil(remaintomax/100000000)-(Math.ceil((remaintomax/1000000000000)-1)*10000)-1)+"억"+"\u200b".repeat(500)+"\n\nSpecial Thanks 정쿠,우락키네";
						}else{
							return ress+"Lv."+level+"("+per+"%)\n"+nextlev+"레벨까지 : "+Number((Math.ceil(remaintomax/1000000000000)-(Math.ceil(remaintomax/10000000000000000)-1)*10000)-1)+"조 "+(Math.ceil(remaintomax/100000000)-(Math.ceil((remaintomax/1000000000000)-1)*10000)-1)+"억"+"\u200b".repeat(500)+"\n\nSpecial Thanks 정쿠,우락키네";
						}
					}
				}
			  
			  
		}
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMention, logId, channelId, userHash) {
if(room=="바다 월드") return;
try{
if(msg.split(" ")[0]=="@레벨"||msg.split(" ")[0]=="!레벨"){
var nick = msg.split(" ")[1];

var nextlev = msg.split(" ")[2];

if(nick==undefined)
		  nick=recommendnick(sender,replier);
if(nick=="") replier.reply("닉네임을 입력해 주세요.");
else
{
	
	
	
	var res=levelsearch(nick, sender, nextlev,"최근");
	
	if(res=="x")
		replier.reply("["+nick+"]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.");
	else
		replier.reply(res);
	
}
}
}catch(e){
		var nick = msg.split(" ")[1];
		replier.reply("["+nick+"]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.");
}
}

