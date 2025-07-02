const scriptName = "llmtest";
FS = FileStream;
Jsoup = org.jsoup.Jsoup;


function call_llm(question){
	let jsondata = { "question": question, "use_tools":"true" };

		const Url = "http://111.111.111.111:8002/ask"; //여기 ip와 포트번호를 자기가 포트포워딩한 주소로 바꾸셈

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

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMention, logId, channelId, userHash) {
	if (msg.startsWith("!@루시 ")) {
		msg = msg.replace("!@루시 ", "");
			let results=call_llm(msg);
		  
		  //result 형식: {"정보":"명령어", "옵션":"닉네임, 날짜 등등 옵션. ',' 로 구분"}
		  
		  if(results["정보"]=="캐릭터"){
			  let r=Bridge.getScopeOf("maplegg.js").maplegg(results["옵션"],sender);
			  replier.reply(r);
		  }
		  else if(results["정보"]=="무릉"){
			  let r=Bridge.getScopeOf("무릉유니온.js").murung(results["옵션"],sender);
			  replier.reply(r);
		  }
		  else if(results["정보"]=="유니온"){
			  let r=Bridge.getScopeOf("무릉유니온.js").union(results["옵션"],sender);
			  replier.reply(r);
		  }
		  else if(results["정보"]=="업적"){
			  let r=Bridge.getScopeOf("무릉유니온.js").achive(results["옵션"],sender);
			  replier.reply(r);
		  }
		  else if(results["정보"]=="아티팩트"){
			  let r=Bridge.getScopeOf("무릉유니온.js").artifact(results["옵션"],sender);
			  replier.reply(r);
		  }
		  else if(results["정보"]=="없음"){
			  //LLM이 명령어를 찾아내지 못했을 때
			  replier.reply("[루시] 죄송해요. 잘 알아듣지 못했어요.");
		  }
		  else{
			  //미구현인 명령어들
			  replier.reply("[루시] "+results["정보"]+" "+results["옵션"]);
		  }  
	}
	
	if (msg=="!@테스트"){
		var res=Bridge.getScopeOf("maplegg.js").maplegg("디벨로이드",sender);
		
		replier.reply("test:"+res);
	}
	
	
}