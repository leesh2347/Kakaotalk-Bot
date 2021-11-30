Jsoup = org.jsoup.Jsoup;
FS = FileStream;
var loc="sdcard/katalkbot/Bots/royal/contents.json";
if (FS.read(loc)==null) FS.write(loc, "{}");
        
function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
if(room=="키네연구소"||room=="바다 월드") return;
if(msg=="@로얄업뎃"){
	var rd = JSON.parse(FS.read(loc));
	rd["itemname"] = [];
	rd["itemrate"] = [];
	var royal = Jsoup.connect("https://maplestory.nexon.com/Guide/CashShop/Probability/RoyalStyle").get();
   var con = "#container > div > div.contents_wrap > table > tbody > ";
    
	var i=0;
	for(i=0;i<5;i++)
	{
		if(i==0){
			var s1 = royal.select(con + "tr:nth-child("+(i+2)+") > td:nth-child(2) > span").get(0).text();
			var sp1 = royal.select(con + "tr:nth-child("+(i+2)+") > td:nth-child(3)").get(0).text().replace("%", "");
		}
		else{
			var s1 = royal.select(con + "tr:nth-child("+(i+2)+") > td:nth-child(1) > span").get(0).text();
			var sp1 = royal.select(con + "tr:nth-child("+(i+2)+") > td:nth-child(2)").get(0).text().replace("%", "");
		}
		rd["itemname"].push(s1);
		rd["itemrate"].push(Number(sp1));
	}
	
	for(i=7;i<27;i++)
	{
		var n1 = royal.select(con + "tr:nth-child("+i+") > td:nth-child(1) > span").get(0).text();
		var np1 = royal.select(con + "tr:nth-child("+i+") > td:nth-child(2)").get(0).text().replace("%", "");

		rd["itemname"].push(n1);
		rd["itemrate"].push(Number(np1));
	}

	FS.write(loc, JSON.stringify(rd));
	replier.reply("로얄 목록 업데이트 완료");
}
   
    if(msg=="@로얄확률"){
		var itemname=JSON.parse(FS.read(loc))["itemname"];
		var itemrate=JSON.parse(FS.read(loc))["itemrate"];
        var first;
         
         
        first="공홈에 명시된 로얄스타일 확률은. . .\n"+"\u200b".repeat(500)+"\n\n"
         
        for(var i=0 ; i<itemname.length ; i++){
            first+="\n";
            first+=itemname[i].replace("(남자만 획득가능) ", "(남)").replace("(여자만 획득가능)", "(여)");
            first+=" - ";
            first+=itemrate[i];
            first+="%"
        }
        replier.reply(first);
        return;
    }
      
    if(msg.split(" ")[0]=="@로얄"){
     

var item_name=JSON.parse(FS.read(loc))["itemname"];
var item_rate=JSON.parse(FS.read(loc))["itemrate"];

        var my_rate = Math.random()*100;
        var a = 0;
        var b = item_rate[0];
      var num=1;
      if(msg.split(" ")[1]>1) num=msg.split(" ")[1];
      if(num<2)
      {
        for(var j = 0 ; j < item_rate.length ; j++){   
            if(my_rate>=a && my_rate<b){
                replier.reply("[루시] '" + sender +"' 님이 로얄스타일을 개봉하여\n━━━━━━━━━━━━━━\n" + item_name[j].replace("(남자만 획득가능) ", "(남)").replace("(여자만 획득가능)", "(여)") + "\n━━━━━━━━━━━━━━\n아이템을 획득하였습니다.\n\n확률 : " + item_rate[j] + "%");
                return;
            }else{
                a=b;
                b+=item_rate[j+1];
            }
        }  
      }
      else
      {
         var res2="";
         var res=[];
         var resn=[];
         var t="";
         for(var k=0;k<num;k++)
         {
			 my_rate = Math.random()*100;
			a = 0;
			b = item_rate[0];
            for(var j = 0 ; j < item_rate.length ; j++){   
               if(my_rate>=a && my_rate<b){
                  t=item_name[j].replace("(남자만 획득가능) ", "(남)").replace("(여자만 획득가능)", "(여)")+":"+item_rate[j];
                  if(res.indexOf(t)!=(-1))
                  {
                     resn[res.indexOf(t)]=resn[res.indexOf(t)]+1;
                  }
                  else
                  {
                     res.push(t);
                     resn.push(1);
                  }
                  break;
               }else{
                  a=b;
                  b+=item_rate[j+1];
               }
            }
            
         }
         for(var j=0;j<res.length;j++)
         {
			 var t2=res[j].split(":");
            res2=res2+"\n"+t2[0]+"X"+resn[j]+" ("+t2[1]+"%)";
         }
         replier.reply("[루시] '" + sender +"' 님의 로얄스타일 "+num+"개 결과\n━━━━━━━━━━━━━━\n"+"\u200b".repeat(500)+res2);
      }
    }
}