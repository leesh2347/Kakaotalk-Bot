Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, "6thskill");

Jsoup=org.jsoup.Jsoup;
FS = FileStream;
var loc="sdcard/katalkbot/Bots/maplelog.json";
if (FS.read(loc)==null) FS.write(loc, "{}");

const maxerda=1011;
const maxpiece=28704;
const janusmaxerda=208;
const janusmaxpiece=6268;

const hexa={
   "기운":[5,0,0,0,0,0,0,0,0],
   "조각":[10,10,20,20,20,20,30,40,50]
};

const origin={
   "기운":[0,1,1,1,2,2,2,3,3,10,3,3,4,4,4,4,4,4,5,15,5,5,5,5,5,6,6,6,7,20],
   "조각":[0,30,35,40,45,50,55,60,65,200,80,90,100,110,120,130,140,150,160,350,170,180,190,200,210,220,230,240,250,500]
};

const master={
   "기운":[3,1,1,1,1,1,1,2,2,5,2,2,2,2,2,2,2,2,2,8,3,3,3,3,3,3,3,3,4,10],
   "조각":[50,15,18,20,23,25,28,30,33,100,40,45,50,55,60,65,70,75,80,175,85,90,95,100,105,110,115,120,125,250]
};

const skill={
   "기운":[4,1,1,1,2,2,2,3,3,8,3,3,3,3,3,3,3,3,4,12,4,4,4,4,4,5,5,5,6,15],
   "조각":[75,23,27,30,34,38,42,45,49,150,60,68,75,83,90,98,105,113,120,263,128,135,143,150,158,165,173,180,188,375]
};

const gongyong={
   "기운":[7,2,2,2,3,3,3,5,5,14,5,5,6,6,6,6,6,6,7,17,7,7,7,7,7,9,9,9,10,20],
   "조각":[125,38,44,50,57,63,69,75,82,300,110,124,138,152,165,179,193,207,220,525,234,248,262,275,289,303,317,330,344,750]
};

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

Number.prototype.comma = function() {
   var coma=this.toString().replace(/(?=(\d{3})+(?!\d))/g, ",");
   if(coma[0]==",") coma=coma.substr(1);
return coma;
}

function hexasearch(nick,sender){
	if(nick=="") return "닉네임을 입력해 주세요.";
	else{
	try{
	var today=new Date();
	var d = new Date(today.setDate(today.getDate() - 1));
	var d2=(d.getYear()+1900)+"-"+String(d.getMonth()+1).padStart(2, "0")+"-"+String(d.getDate()).padStart(2, "0");

	var ocid1 = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/id?character_name="+encodeURIComponent(nick)).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	var ocid2=JSON.parse(ocid1)["ocid"];

	var answer = Jsoup.connect("https://open.api.nexon.com/maplestory/v1/character/hexamatrix?ocid="+ocid2+"&date="+d2).header("Content-Type","application/json").header("x-nxopen-api-key","live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59").ignoreContentType(true).ignoreHttpErrors(true).get().text();
	var t=JSON.parse(answer)["character_hexa_core_equipment"];
	recordnick(sender,nick);
		  var erda_a=[0,0,0,0];
			  var piece_a=[0,0,0,0];
			
			var i=0;
			var j=0;
			
			var sum_erda=2;
			var sum_piece=0;
			
			var janus_erda=0;
			var janus_piece=0;
			
			var origintext="";
			var mastertext="";
			var skilltext="";
			var publictext="";
			
		   for(i=0;i<t.length;i++){
		   
			   for (j = 0; j < t[i]["hexa_core_level"]; j++){
				  if(j>0&&t[i]["hexa_core_type"]=="스킬 코어"){
					 erda_a[0]=erda_a[0]+origin["기운"][j];
					 piece_a[0]=piece_a[0]+origin["조각"][j];
				  }
				  else if(t[i]["hexa_core_type"]=="마스터리 코어"){
					 erda_a[1]=erda_a[1]+master["기운"][j];
				   piece_a[1]=piece_a[1]+master["조각"][j];
				  }
				  else if(t[i]["hexa_core_type"]=="강화 코어"){
					 erda_a[1]=erda_a[1]+skill["기운"][j];
				   piece_a[1]=piece_a[1]+skill["조각"][j];
				  }
				   else if(t[i]["hexa_core_type"]=="공용 코어"){
					 erda_a[1]=erda_a[1]+gongyong["기운"][j];
				   piece_a[1]=piece_a[1]+gongyong["조각"][j];
				   
				   if(t[i]["hexa_core_name"].includes("야누스")){
					   janus_erda=janus_erda+gongyong["기운"][j];
						janus_piece=janus_piece+gongyong["조각"][j];
				   }
				   
				  }
				  
				  
			   }
			   
			  if(t[i]["hexa_core_type"]=="스킬 코어"){
				origintext=origintext+t[i]["hexa_core_name"]+": "+t[i]["hexa_core_level"]+"레벨\n";
			 }
			  else if(t[i]["hexa_core_type"]=="마스터리 코어"){
				mastertext=mastertext+t[i]["hexa_core_name"]+": "+t[i]["hexa_core_level"]+"레벨\n";
			  }
			  else if(t[i]["hexa_core_type"]=="강화 코어"){
				skilltext=skilltext+t[i]["hexa_core_name"]+": "+t[i]["hexa_core_level"]+"레벨\n";
			  }
			  else if(t[i]["hexa_core_type"]=="공용 코어"){
				publictext=publictext+t[i]["hexa_core_name"]+": "+t[i]["hexa_core_level"]+"레벨\n";
			 }
		   }
		   
		   for(i=0;i<4;i++){
			  sum_erda=sum_erda+erda_a[i];
			  sum_piece=sum_piece+piece_a[i];
		   }
		   
		   return [
		   "["+nick+"]",
		   "솔 야누스 포함",
		   "누적 소모 솔 에르다: "+sum_erda+"개",
		   "["+Math.floor((sum_erda*100)/maxerda)+"%] 강화 ("+sum_erda+"/"+maxerda+")",
		   "누적 소모 조각: "+sum_piece+"개",
		   "["+Math.floor((sum_piece*100)/maxpiece)+"%] 강화 ("+sum_piece+"/"+maxpiece+")​​​​​​​​​​​​​​​​​​​​",
		   "",
		   "솔 야누스 제외",
		   "누적 소모 솔 에르다: "+(sum_erda-janus_erda)+"개",
		   "["+Math.floor(((sum_erda-janus_erda)*100)/(maxerda-janusmaxerda))+"%] 강화 ("+(sum_erda-janus_erda)+"/"+(maxerda-janusmaxerda)+")",
		   "누적 소모 조각: "+(sum_piece-janus_piece)+"개",
		   "["+Math.floor(((sum_piece-janus_piece)*100)/(maxpiece-janusmaxpiece))+"%] 강화 ("+(sum_piece-janus_piece)+"/"+(maxpiece-janusmaxpiece)+")​​​​​​​​​​​​​​​​​​​​",
		   "\u200b".repeat(500),
		   "[오리진/어센트 스킬] 강화 내역",
		   origintext,
		   "[마스터리 코어] 강화 내역",
		   mastertext,
		   "[강화 코어] 강화 내역",
		   skilltext,
		   "[공용 코어] 강화 내역",
		   publictext
		   ].join("\n");

	}
	catch(e){
	   return "["+nick+"]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.";
	}
	}
}

function sixth_calc(start, end){
	if(isNaN(start)||isNaN(end))
       {
          return "6차 스킬 강화 계산기 사용법: @6차 (시작레벨) (끝레벨)\n\n필요 솔 에르다와 조각 갯수를 계산해 줍니다.";
       }
       else if((-1)<start&&start<30&&start<end&&0<end&&end<31)
       {
          var erda_a=[0,0,0,0];
          var piece_a=[0,0,0,0];
         for (var i = start; i < end; i++){
            erda_a[0]=erda_a[0]+origin["기운"][i];
            piece_a[0]=piece_a[0]+origin["조각"][i];
            
            erda_a[1]=erda_a[1]+master["기운"][i];
            piece_a[1]=piece_a[1]+master["조각"][i];
            
            erda_a[2]=erda_a[2]+skill["기운"][i];
            piece_a[2]=piece_a[2]+skill["조각"][i];
         
         erda_a[3]=erda_a[3]+gongyong["기운"][i];
            piece_a[3]=piece_a[3]+gongyong["조각"][i];
         }
         return "오리진/어센트 스킬 "+start+" ~ "+end+"레벨 까지\n필요한 솔 에르다💎 : "+erda_a[0]+"개\n솔 에르다 조각💠 : "+piece_a[0]+"개\n\n마스터리 코어 "+start+" ~ "+end+"레벨 까지\n필요한 솔 에르다💎 : "+erda_a[1]+"개\n솔 에르다 조각💠 : "+piece_a[1]+"개\n\n강화 코어 "+start+" ~ "+end+"레벨 까지\n필요한 솔 에르다💎 : "+erda_a[2]+"개\n솔 에르다 조각💠 : "+piece_a[2]+"개\n\n공용 코어/솔 야누스 "+start+" ~ "+end+"레벨 까지\n필요한 솔 에르다💎 : "+erda_a[3]+"개\n솔 에르다 조각💠 : "+piece_a[3]+"개";
       }
       else{
          return "시작 레벨과 끝 레벨을 제대로 입력했는지 확인해 주세요.\n레벨 범위: 0~30\n(코어가 없는 상태에서 제작하는 것을 0->1레벨 강화로 칩니다.)";
       }
}


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMention, logId, channelId, userHash) {
if(room=="바다 월드") return

if(msg.split(" ")[0]=="@헥사"||msg.split(" ")[0]=="!헥사")
{
var nick=msg.split(" ")[1];
if(nick==undefined)
    nick=recommendnick(sender,replier);

	var res=hexasearch(nick,sender);
	replier.reply(res);

}

if(msg.split(" ")[0]=="!6차"||msg.split(" ")[0]=="@6차")
   {
      var start=Number(msg.split(" ")[1]);
      var end=Number(msg.split(" ")[2]);
	  
	  var res=sixth_calc(start,end);
		replier.reply(res);
	  
   }
   
   if(msg.split(" ")[0]=="!오리진"||msg.split(" ")[0]=="@오리진"||msg.split(" ")[0]=="!어센트"||msg.split(" ")[0]=="@어센트")
   {
      var start=Number(msg.split(" ")[1]);
      var end=Number(msg.split(" ")[2]);
      if(isNaN(start)||isNaN(end))
       {
          replier.reply("오리진/어센트 스킬 계산기 사용법: @오리진 (시작레벨) (끝레벨)\n\n필요 솔 에르다와 조각 갯수를 계산해 줍니다.");
       }
       else if((-1)<start&&start<30&&start<end&&0<end&&end<31)
       {
          var erda=0;
          var piece=0;
         for (var i = start; i < end; i++){
            erda=erda+origin["기운"][i];
            piece=piece+origin["조각"][i];
         }
         replier.reply("오리진/어센트 스킬 "+start+" ~ "+end+"레벨 까지\n필요한 솔 에르다💎 : "+erda+"개\n솔 에르다 조각💠 : "+piece+"개");
       }
       else{
          replier.reply("시작 레벨과 끝 레벨을 제대로 입력했는지 확인해 주세요.\n레벨 범위: 0~30\n(코어가 없는 상태에서 제작하는 것을 0->1레벨 강화로 칩니다.)");
       }
   }
   
   if(msg.split(" ")[0]=="!마스터리"||msg.split(" ")[0]=="@마스터리")
   {
      var start=Number(msg.split(" ")[1]);
      var end=Number(msg.split(" ")[2]);
      if(isNaN(start)||isNaN(end))
       {
          replier.reply("마스터리 코어 계산기 사용법: @마스터리 (시작레벨) (끝레벨)\n\n필요 솔 에르다와 조각 갯수를 계산해 줍니다.");
       }
       else if((-1)<start&&start<30&&start<end&&0<end&&end<31)
       {
          var erda=0;
          var piece=0;
         for (var i = start; i < end; i++){
            erda=erda+master["기운"][i];
            piece=piece+master["조각"][i];
         }
         replier.reply("마스터리 코어 "+start+" ~ "+end+"레벨 까지\n필요한 솔 에르다💎 : "+erda+"개\n솔 에르다 조각💠 : "+piece+"개");
       }
       else{
          replier.reply("시작 레벨과 끝 레벨을 제대로 입력했는지 확인해 주세요.\n레벨 범위: 0~30\n(코어가 없는 상태에서 제작하는 것을 0->1레벨 강화로 칩니다.)");
       }
   }
   
   if(msg.split(" ")[0]=="!강화"||msg.split(" ")[0]=="@강화")
   {
      var start=Number(msg.split(" ")[1]);
      var end=Number(msg.split(" ")[2]);
      if(isNaN(start)||isNaN(end))
       {
          replier.reply("강화 코어 계산기 사용법: @강화 (시작레벨) (끝레벨)\n\n필요 솔 에르다와 조각 갯수를 계산해 줍니다.");
       }
       else if((-1)<start&&start<30&&start<end&&0<end&&end<31)
       {
          var erda=0;
          var piece=0;
         for (var i = start; i < end; i++){
            erda=erda+skill["기운"][i];
            piece=piece+skill["조각"][i];
         }
         replier.reply("강화 코어 "+start+" ~ "+end+"레벨 까지\n필요한 솔 에르다💎 : "+erda+"개\n솔 에르다 조각💠 : "+piece+"개");
       }
       else{
          replier.reply("시작 레벨과 끝 레벨을 제대로 입력했는지 확인해 주세요.\n레벨 범위: 0~30\n(코어가 없는 상태에서 제작하는 것을 0->1레벨 강화로 칩니다.)");
       }
   }
   
   if(msg.split(" ")[0]=="!공용"||msg.split(" ")[0]=="@공용")
   {
      var start=Number(msg.split(" ")[1]);
      var end=Number(msg.split(" ")[2]);
      if(isNaN(start)||isNaN(end))
       {
          replier.reply("공용 코어 계산기 사용법: @공용 (시작레벨) (끝레벨)\n\n필요 솔 에르다와 조각 갯수를 계산해 줍니다.");
       }
       else if((-1)<start&&start<30&&start<end&&0<end&&end<31)
       {
          var erda=0;
          var piece=0;
         for (var i = start; i < end; i++){
            erda=erda+gongyong["기운"][i];
            piece=piece+gongyong["조각"][i];
         }
         replier.reply("공용 코어 "+start+" ~ "+end+"레벨 까지\n필요한 솔 에르다💎 : "+erda+"개\n솔 에르다 조각💠 : "+piece+"개");
       }
       else{
          replier.reply("시작 레벨과 끝 레벨을 제대로 입력했는지 확인해 주세요.\n레벨 범위: 0~30\n(코어가 없는 상태에서 제작하는 것을 0->1레벨 강화로 칩니다.)");
       }
   }


}