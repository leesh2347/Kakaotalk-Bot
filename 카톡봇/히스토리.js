const scriptName = "히스토리";
FS = FileStream;
Jsoup=org.jsoup.Jsoup;

var loc = "sdcard/katalkbot/Bots/maplelog.json";
var historynumloc = "sdcard/msgbot/Bots/히스토리/num.json";

var dbloc="sdcard/Devel/Maple/db_level.json";

if (FS.read(loc) == null) FS.write(loc, "{}");

if (FS.read(dbloc) == null) FS.write(dbloc, "{}");

//var a = [12, 34, 25, 63, 53, 34], l = 10
function graph(a,a2,d,l) {
//a(array)는 배열, l(length)은 그래프 길이
return Array(a.length).fill(100).map((_,i)=>d[i]+'\n|'+'█'.repeat(l*a[i]/_)+' ▏▎▍▌▋▊▉█'.split('')[(a[i]/_%1)*8+0.5|0]+' '+a2[i]+"("+a[i]+"%)").join('\n');
}

function graph2(a,d,l) {
//a(array)는 배열, l(length)은 그래프 길이
//return Array(a.length).fill(Math.max.apply(null,a)).map((_,i)=>d[i]+'\n|'+'█'.repeat(l*a[i]/_)+' ▏▎▍▌▋▊▉█'.split('')[(a[i]/_%1)*8+0.5|0]+' Lv.'+a[i]).join('\n')

return Array(a.length).fill(Math.max.apply(null,a)).map((_,i)=>d[i]+': '+' Lv.'+a[i]).join('\n');
}

function dbsave(nick,lev,date){
   var rd = JSON.parse(FS.read(dbloc));
   if(rd[nick]==undefined) rd[nick] = {};
   if(rd[nick]["lev"]==undefined)rd[nick]["lev"] = [];
   if(rd[nick]["date"]==undefined)rd[nick]["date"] = [];
   
   
   var recentlev=0;
   if(rd[nick]["lev"].length>0){
	   recentlev=rd[nick]["lev"][rd[nick]["lev"].length-1];  
   }
   
   if(recentlev<lev){
	   if(rd[nick]["lev"].length>6){
		   rd[nick]["lev"].splice(0,1);
		   rd[nick]["date"].splice(0,1);
	   }
	   rd[nick]["lev"].push(lev);
	   rd[nick]["date"].push(date);
	   
	   FS.write(dbloc, JSON.stringify(rd));
   }
   
}

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

function histdatearr(datestr){
	
	var datearr=[];
	
	var today = new Date(datestr);
	
	for(var i=6;i>=0;i--){
		var d = new Date(today.setDate(today.getDate() + 1));
		var d2=(d.getYear()+1900)+"-"+String(d.getMonth()+1).padStart(2, "0")+"-"+String(d.getDate()).padStart(2, "0");
		datearr.push(d2);
	}
	
	return datearr;
	
}

function hist(name,datearr, sender){
	recordnick(sender,name);
try{
	

	var ocid1 = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/id?character_name="+encodeURIComponent(name)).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	var ocid2=JSON.parse(ocid1)["ocid"];

	if(ocid2!=undefined&&ocid2!=null&&ocid2!=""){
		var arr=[]
		//경험치
		var arr2=[]
		//레벨
		var darr=[]
		//날짜
		//for(var i=0;i<7;i++)
		
		var ismaxup=0;

		var islevup="";

		var lvv=0;
		
		for(var i=0;i<datearr.length;i++){
			
			var d = new Date(datearr[i]);
			
			var answer = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/basic?ocid="+ocid2+"&date="+datearr[i]).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
			var data=JSON.parse(answer);
			
			darr.push((d.getMonth()+1)+"월 "+(d.getDate())+"일");
		   arr.push(Number(data["character_exp_rate"]));
		   arr2.push(Number(data["character_level"]));
		   
		   if(lvv<Number(data["character_level"])){
			   if(lvv!=0)
				   islevup="\n🎊 레벨업 축하합니다! 🎊";
			   lvv=Number(data["character_level"]);
		   }
		   
		   if(Number(data["character_level"])>299)
		   {
			   ismaxup=1;
			   break;
		   }
			
		}

		dbsave(name,arr2[arr2.length-1],darr[darr.length-1]);
		var min=arr[0];
		var max=arr[arr.length-1];
		if(min>max) max=max+100;
		var lvup=Math.ceil((100-arr[arr.length-1])/((max-min)/arr.length));
		if(ismaxup==1)
			return "["+name+"]님의 경험치 히스토리\n("+datearr[datearr.length-1]+" 기준)\n\n"+graph(arr,arr2,darr,5)+"\n\n🏆 만렙 달성 축하합니다! 🏆";
		else if(lvup == Infinity)
			return "["+name+"]님의 경험치 히스토리\n("+datearr[datearr.length-1]+" 기준)\n\n"+graph(arr,arr2,darr,5)+"\n\n예상 다음 레벨업: 메이플 섭종 후";
		else
			return "["+name+"]님의 경험치 히스토리\n("+datearr[datearr.length-1]+" 기준)\n\n"+graph(arr,arr2,darr,5)+"\n\n예상 다음 레벨업: "+lvup+"일 후"+islevup;
	}
	else{
		return "["+name+"]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.";
	}



	}catch(e){
		return "["+name+"]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.";
	}
}

function levhist(name, sender){
	recordnick(sender,name);
		try{
			
		var data = JSON.parse(FS.read(dbloc));
		if(data[name]==undefined){
		   return "["+name+"]\n2024.7.17 이후 히스토리 기록이 없는 캐릭터명 입니다.";
		}
		if(data[name]["lev"]==undefined)
		{
		   return "["+name+"]\n2024.7.17 이후 히스토리 기록이 없는 캐릭터명 입니다.";
		}
	   if(data[name]["date"]==undefined)
		{
		   return "["+name+"]\n2024.7.17 이후 히스토리 기록이 없는 캐릭터명 입니다.";
		}

		var arr=[]
		//레벨
		var darr=[]
		//날짜
		for(var i=0;i<data[name]["lev"].length;i++){
		   darr.push(data[name]["date"][i]);
		   arr.push(data[name]["lev"][i]);
		}

		return "["+name+"]님의 레벨 히스토리\n\n"+graph2(arr,darr,5);
		}catch(e){
		return "["+name+"]\n2024.7.17 이후 히스토리 기록이 없는 캐릭터명 입니다.";
		}
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMention, logId, channelId, userHash) {
if(msg.split(" ")[0]=="!히스토리"||msg.split(" ")[0]=="@히스토리"){
var name=msg.split(" ")[1];
if(name==undefined)
   name=recommendnick(sender,replier);
if(name=="") replier.reply("닉네임을 입력해 주세요.");
else
{
	var today=new Date();
	
	if(today.getHours()<1)
		today.setDate(today.getDate() - 9);
	else
		today.setDate(today.getDate() - 8);
	
	var yyyyMmDd = today.toISOString().slice(0, 10);
	
	var daarr=null;
	daarr=histdatearr(yyyyMmDd);
	var res=hist(name,daarr, sender);
	replier.reply(res);

}
}


if(msg.split(" ")[0]=="!레벨히스토리"||msg.split(" ")[0]=="@레벨히스토리"){
	var name=msg.split(" ")[1];
	if(name==undefined)
	   name=recommendnick(sender,replier);
	if(name=="") replier.reply("닉네임을 입력해 주세요.");
	else
	{
		var res=levhist(name, sender);
		replier.reply(res);
	}
}


}

