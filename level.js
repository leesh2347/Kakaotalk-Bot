Jsoup = org.jsoup.Jsoup;
FS = FileStream;
function getexp(index){
var l=Jsoup.connect("http://wachan.me/exp_api.php?exp1="+index).ignoreContentType(true).ignoreHttpErrors(true).get().text();
var e = JSON.parse(l).result;
return Number(parseInt(e.replace(/,/g,"")));
}

var loc="sdcard/katalkbot/Bots/maplelog.json";
if (FS.read(loc)==null) FS.write(loc, "{}");

function recordnick(sender,nick){
	var rd = JSON.parse(FS.read(loc));
	if(rd[sender]==undefined) rd[sender] = {};
	if(rd[sender][nick]==undefined)rd[sender][nick] = 0;
	rd[sender][nick] = rd[sender][nick]+1;
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
var l=Jsoup.connect("http://wachan.me/exp_api.php?exp1="+index1+"&exp2="+index2).ignoreContentType(true).ignoreHttpErrors(true).get().text();
var e = JSON.parse(l).result;
return Number(parseInt(e.replace(/,/g,"")));
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


function response(room, msg, sender, isGroupChat, replier, ImageDB) {
if(room=="바다 월드") return;
try{
if(msg.startsWith("@레벨")){
var nick = msg.split(" ")[1];
if(nick==undefined)
		  nick=recommendnick(sender,replier);
if(nick=="") replier.reply("닉네임을 입력해 주세요.");
else
{
recordnick(sender,nick);	
var data = Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c="+nick).get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td:nth-child(4)").text();      
var level=Jsoup.connect("https://maplestory.nexon.com/Ranking/World/Total?c="+nick).get().select("#container > div > div > div:nth-child(4) > div.rank_table_wrap > table > tbody > tr.search_com_chk > td:nth-child(3)").text().replace("Lv.", "");      
if(level>299){
replier.reply("["+nick+"]\nLv."+level);
}else{
var exp=data.replace(/,/g, "");     
var per=(exp/getexp(level)*100).toFixed(3);
var remaintonext=getexp(level)-exp;
var remaintomax=sum_cnt(level,300)-exp;       
 if((Math.ceil(remaintomax/10000000000000000)-1)>0){
replier.reply("["+nick+"]\nLv."+level+"("+per+"%)\n다음 레벨까지 경험치\n"+unitExp(remaintonext)+
"\n만렙까지 : "+(Math.ceil(remaintomax/10000000000000000)-1)+"경 "+Number((Math.ceil(remaintomax/1000000000000)-(Math.ceil(remaintomax/10000000000000000)-1)*10000)-1)+"조 "+(Math.ceil(remaintomax/100000000)-(Math.ceil((remaintomax/1000000000000)-1)*10000)-1)+"억"+"\u200b".repeat(500)+"\n\nSpecial Thanks 정쿠");
}else{
replier.reply("["+nick+"]\nLv."+level+"("+per+"%)\n다음 레벨까지 경험치\n"+unitExp(remaintonext)+"\n만렙까지 : "+Number((Math.ceil(remaintomax/1000000000000)-(Math.ceil(remaintomax/10000000000000000)-1)*10000)-1)+"조 "+(Math.ceil(remaintomax/100000000)-(Math.ceil((remaintomax/1000000000000)-1)*10000)-1)+"억"+"\u200b".repeat(500)+"\n\nSpecial Thanks 정쿠");
}
}
}
}
}catch(e){
replier.reply("없는 캐릭터 입니다.");
}
}