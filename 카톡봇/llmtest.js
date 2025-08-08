const scriptName = "llmtest";
FS = FileStream;
Jsoup = org.jsoup.Jsoup;
const br=require('banned_rooms');
const allowrooms=br.banrooms['talk'];


function call_llm(question){
	let jsondata = { "question": question, "use_tools":"true" };

		const Url = "http://111.111.111.111:8000/ask"; //여기 ip와 포트번호를 자기가 포트포워딩한 주소로 바꾸셈

		send = _ => {
		try{
		let url = new java.net.URL(Url);
		let con = url.openConnection();
		con.setRequestMethod("POST"); // 서버 접속 방법을 설정하세요. GET, POST, OPTIONS 등..
		con.setRequestProperty("Content-Type", "application/json; charset=utf-8"); // 서버 접속시 가져올 데이터의 형식을 지정
		con.setRequestProperty("User-Agent", "Mozilla"); // 일부 사이트의 경우 User-Agent 를 요구합니다.
		con.setRequestProperty("Accpet", "*.*"); // 일부 사이트의 경우, 이 헤더가 없으면 오류가 발생합니다.
		con.setDoOutput(true);
		let wr = new java.io.DataOutputStream(con.getOutputStream());
		let writer = new java.io.BufferedWriter(new java.io.OutputStreamWriter(wr, "UTF-8"));
		writer.write(JSON.stringify(jsondata));
		writer.close();
		wr.close();

		let responseCode = con.getResponseCode();
		let br;

		if (responseCode == 200) {
		br = new java.io.BufferedReader(new java.io.InputStreamReader(con.getInputStream()));
		}
		else
		br = new java.io.BufferedReader(new java.io.InputStreamReader(con.getErrorStream()));

		let inputLine;
		let response = "";

		while ((inputLine = br.readLine()) != null) {
		response += inputLine;
		}
		br.close();
		return response;
		} catch (e) {
		return e;
		}
		}
		
		let r = JSON.parse(send());
		return r;
	
}

function process_result(info,args,sender){
	
			if(info=="캐릭터")
				return Bridge.getScopeOf("maplegg.js").maplegg(args,sender);
			else if(info=="무릉")
				return Bridge.getScopeOf("무릉유니온.js").murung(args,sender);
			else if(info=="유니온")
				return Bridge.getScopeOf("무릉유니온.js").union(args,sender);
			else if(info=="업적")
				return Bridge.getScopeOf("무릉유니온.js").achive(args,sender);
			else if(info=="아티팩트")
				return Bridge.getScopeOf("무릉유니온.js").artifact(args,sender);
			else if(info=="메창")
				return Bridge.getScopeOf("메창.js").mechang(args,sender);
			else if(info=="헥사")
				return Bridge.getScopeOf("6thskill.js").hexasearch(args,sender);
			else if(info=="스탯")
				return Bridge.getScopeOf("스탯.js").stat(args,sender);
			else if(info=="경험치")
			{
				var arr=args.split(", ");
				
				return Bridge.getScopeOf("level.js").levelsearch(arr[0],sender,"",arr[1]);
				
			}
			else if(info=="히스토리")
			{
				var arr=args.split(", ");
				var nick=arr[0];
				if(arr[1]=="최근"){
					var today=new Date();
	
					if(today.getHours()<1)
						today.setDate(today.getDate() - 9);
					else
						today.setDate(today.getDate() - 8);
					
					var yyyyMmDd = today.toISOString().slice(0, 10);
					
					var daarr=null;
					daarr=Bridge.getScopeOf("히스토리.js").histdatearr(yyyyMmDd);
					return Bridge.getScopeOf("히스토리.js").hist(nick,daarr, sender);
				}
				else{
					var darr=[];
					for(var i=1;i<arr.length;i++)
						darr.push(arr[i]);
					return Bridge.getScopeOf("히스토리.js").hist(nick,darr, sender);
				}
			}
			else if(info=="6차코강")
			{
				var arr=args.split(", ");
				if(arr[0]==0)
				{
					return Bridge.getScopeOf("6thskill.js").sixth_calc("x", "x");
				}
				else{
					return Bridge.getScopeOf("6thskill.js").sixth_calc(arr[0], arr[1]);
				}
				
			}
			else if(info=="어센틱")
			{
				var arr=args.split(", ");
				if(arr[0]==0)
				{
					return Bridge.getScopeOf("추옵.js").symbol("x", "x");
				}
				else{
					return Bridge.getScopeOf("추옵.js").symbol(arr[0], arr[1]);
				}
				
			}
			else if(info=="없음")
				return "[루시] 죄송해요. 잘 알아듣지 못했어요.";
			else
			{
				//미구현인 명령어들
				return "[루시] 미구현된 기능입니다. "+info+" "+args;
			}
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMention, logId, channelId, userHash) {
	if(allowrooms.includes(room)){
		if (msg.startsWith("루시 ")) {
			msg = msg.replace("루시 ", "");
			
			try{
				let results=call_llm(msg);
				
			  
			  //result 형식: {"정보":"명령어", "옵션":"닉네임, 날짜 등등 옵션. ',' 로 구분"}
			  
			  let r=process_result(results["정보"],results["옵션"],sender);
			  replier.reply(r);
			  
			}
			catch(e){
				replier.reply("AI 분석 서버 쪽에 문제가 발생했습니다."+e);
			}
			  
		}
	}
	
	
	if (msg=="!@테스트"){
		var res=Bridge.getScopeOf("level.js").levelsearch("폰타인간호사",sender,"","2025-08-01");
		
		replier.reply("test:"+res);
	}
	
	
}