const { KakaoLinkClient } = require('kakaolink');
const Kakao =new KakaoLinkClient("aaa","http://asdf");
Kakao.login('asdf','asdf');

playerList = [];
isAI = 99;
order = [];
start = false;
leader = "없음";
nowTurn = "없음";
turnnum=0;
total = 27;
nowroom="없음";
var img="";
var colnum=[[0,0],[438,607],[358,607],[278,607],[198,607],[118,607],[38,607],[38,515],
[38,423],[118,423],[198,423],[278,423],[358,423],[438,423],[438,331],[438,239],
[358,239],[278,239],[198,239],[118,239],[38,239],[38,147],[38,55],
[118,55],[198,55],[278,55],[358,55],[438,55]];
var diceshow=["⚀","⚁","⚂","⚃","⚄","⚅"];
var tokenshow=["🔴","🔵","🟢","🟣"];
var playersnum=[];

Array.prototype.shuffle = function() {
return this.sort(_ => Math.random() - 0.5)
}

function brReset()
{
playerList = [];
isAI = 99;
order = [];
start = false;
leader = "없음";
nowTurn = "없음";
turnnum=0;
nowroom = "없음";
playersnum=[];
}

function imgurl(player1,player2,player3,player4){
	var txt="https://res.cloudinary.com/leesh2347/image/upload/c_thumb,w_540,h_716/c_thumb,w_48,h_48,l_token1_yo3cio/fl_layer_apply,g_north_west,x_";
	txt=txt+colnum[player1][0]+",y_"+colnum[player1][1]+"/";
	txt=txt+"c_thumb,w_48,h_48,l_token2_mvkypf/fl_layer_apply,g_north_west,x_"+(colnum[player2][0]+5)+",y_"+(colnum[player2][1]+8)+"/";
	if(player3>0)
		txt=txt+"c_thumb,w_48,h_48,l_token3_ebx9ff/fl_layer_apply,g_north_west,x_"+(colnum[player3][0]+10)+",y_"+(colnum[player3][1]+16)+"/";
	if(player3>0)
		txt=txt+"c_thumb,w_48,h_48,l_token4_tiop8w/fl_layer_apply,g_north_west,x_"+(colnum[player4][0]+15)+",y_"+(colnum[player4][1]+24)+"/";
	txt=txt+"board_qezys1";
	return txt;
}

function colmove(num){
	var n=num;
	if(n==4)
		n=n-1;
	else if(n==10||n==16)
		n=n-3;
	else if(n==23)
		n=n-5;
	else if(n==5)
		n=n+2;
	else if(n==12)
		n=n+5;
	else if(n==19)
		n=n+3;
	else if(n==9)
		n=20;
	else if(n==20)
		n=9;
	else if(n==11)
		n=24;
	else if(n==24)
		n=11;
	else if(n==8||n==14||n==25)
		n=1;
	return n;
}

function response(room, msg, sender, isGroupChat, replier, imageDB) {
	if(room=="키네연구소") return;
	
	if(msg=="/주사위게임 도움말")
		replier.reply("추억의 주사위 보드게임\n\n/주사위게임 입장\n/주사위게임 퇴장\n/주사위게임 AI\n/주사위게임 시작\n\n*2인 이상부터 게임 진행이 가능합니다.");
	
	if (msg == "/주사위게임 입장") {
		if(nowroom!="없음"&&nowroom!=room)
		replier.reply("다른 방에서 게임이 진행 중입니다.");
		else{
			if (!start) {
				if (playerList.indexOf(sender)==-1) {
					if(playerList.length>3)
						replier.reply("주사위 게임은 한 판에 4명까지만 입장 가능합니다.\n\n"+playerList.map((a, b) => (b+1)+". "+a).join("\n"));
					else
					{
						playerList.push(sender);
						replier.reply("["+sender+"] 님이 방에 입장하셨어요!\n\n"+playerList.map((a, b) => (b+1)+". "+a).join("\n"));
						if (playerList.length==1) {
							leader = sender;
							nowroom=room;
							replier.reply("["+sender+"] 님이 방장입니다!");
						}
					}
				} else {
					replier.reply("이미 방에 입장하셨습니다.");
				}
			} 
			else {
				replier.reply("이미 게임이 시작되었습니다.");
			}
		}
	}
	
	if (msg == "/주사위게임 AI") {
		if(nowroom!="없음"&&nowroom!=room)
			replier.reply("다른 방에서 게임이 진행 중입니다.");
		else{
			if (!start) {
				if (playerList.length==0) {
					replier.reply("AI유저는 방장이 될 수 없습니다. 아무나 먼저 1명 이상 입장해 주세요!");
				}
				else
				{
					if(playerList.length>3)
						replier.reply("주사위 게임은 한 판에 4명까지만 입장 가능합니다.\n\n"+playerList.map((a, b) => (b+1)+". "+a).join("\n"));
					else if(playerList.includes("AI 루시")&&isAI==playerList.indexOf("AI 루시"))
						replier.reply("이미 루시가 입장했어요.\n\n"+playerList.map((a, b) => (b+1)+". "+a).join("\n"));
					else
					{
						playerList.push("AI 루시");
						isAI=(playerList.length-1);
						replier.reply("게임에 루시가 참가했어요!\n\n"+playerList.map((a, b) => (b+1)+". "+a).join("\n"));
					}
				}
			} 
			else {
				replier.reply("이미 게임이 시작되었습니다.");
			}
		}
	}
	
	if (msg == "/주사위게임 퇴장") {
		if(nowroom!="없음"&&nowroom!=room)
			replier.reply("다른 방에서 게임이 진행 중입니다.");
		else{
			if (!start) {
				if (playerList.indexOf(sender)!=-1) {
					if(playerList.indexOf(sender)<isAI)
						isAI=isAI-1;
					playerList.splice(playerList.indexOf(sender), 1)
					replier.reply(("["+sender+"] 님이 퇴장하셨어요!\n\n"+playerList.map((a, b) => (b+1)+". "+a).join("\n")).trim())
					if (playerList.length==1) {
						leader = sender;
						replier.reply("["+playerList+"] 님이 방장입니다!");
					}
					if (playerList.length==0||isAI==0){
						brReset();
						replier.reply("모든 플레이어가 퇴장하였습니다!");
					}
				} else {
					replier.reply("아직 방에 입장하지 않으셨습니다!");
				}
			} else {
				replier.reply("게임 중에는 퇴장할 수 없습니다!");
			}
		}
	}
	
	if (msg == "/주사위게임 시작") {
		if(nowroom!="없음"&&nowroom!=room)
			replier.reply("다른 방에서 게임이 진행 중입니다.");
		else{
			if (!start) {
				if (sender == leader) {
					if (playerList.length > 1) {
						start = true;
						order = playerList.shuffle();
						if(isAI!=99)
							isAI=order.indexOf("AI 루시");
						playersnum=[0,0,0,0];
						for(var i=0;i<order.length;i++)
							playersnum[i]=1;
						turnnum=0;
						var showorder="";
						for(var i=0;i<order.length;i++)
							showorder=showorder+tokenshow[i]+": "+order[i]+"\n";
						replier.reply("게임을 시작합니다! \n\n"+showorder);
						nowTurn = order[turnnum];
						replier.reply(order[turnnum]+" 님 부터 /굴리기 를 통해 주사위를 굴려 주세요.");
						if(isAI==turnnum&&order[turnnum]=="AI 루시")
						{
							java.lang.Thread.sleep(1000);
							replier.reply("루시가 주사위를 굴립니다.");
							var r=Math.floor(Math.random()*6);
							replier.reply(diceshow[r]);
							java.lang.Thread.sleep(1000);
							playersnum[turnnum]=playersnum[turnnum]+(r+1);
							playersnum[turnnum]=colmove(playersnum[turnnum]);
							if(playersnum[turnnum]>total)
								playersnum[turnnum]=total;
							var img="";
							img=imgurl(playersnum[0],playersnum[1],playersnum[2],playersnum[3]);
							
							Kakao.sendLink(room, {
							"link_ver":"4.0",
							"template_id":(61194),
							"template_args":{
							//이곳에 템플릿 정보를 입력하세요.
							'IMG':img
							}
							}, "custom")
							var showorder="";
							for(var i=0;i<order.length;i++)
								showorder=showorder+tokenshow[i]+": "+order[i]+"\n";
							replier.reply(showorder);
							if(playersnum[turnnum]==total)
							{
								replier.reply("루시의 승리! 게임 끝!");
								brReset();
							}
							else
							{
								turnnum++;
								if(turnnum==playerList.length)
								   turnnum=0;
							   nowTurn = order[turnnum];
							   replier.reply(order[turnnum]+" 님의 차례입니다.\n/굴리기 를 통해 주사위를 굴려 주세요.");
							}
							
						}
						
					} else {
						replier.reply("2인 이상이어야 게임을 시작할 수 있습니다!");
					}
				} else {
					replier.reply("게임은 오직 방장만 시작할 수 있습니다.");
				}
			} else {
				replier.reply("이미 게임이 시작되었습니다.");
			}
		}
	}
	if (order[turnnum]==sender&&start&&nowroom==room) {
		if(msg=="/굴리기"){
			var r=Math.floor(Math.random()*6);
			replier.reply(diceshow[r]);
			java.lang.Thread.sleep(1000);
			playersnum[turnnum]=playersnum[turnnum]+(r+1);
			playersnum[turnnum]=colmove(playersnum[turnnum]);
			if(playersnum[turnnum]>total)
				playersnum[turnnum]=total;
			var img="";
			img=imgurl(playersnum[0],playersnum[1],playersnum[2],playersnum[3]);
			
			Kakao.sendLink(room, {
			"link_ver":"4.0",
			"template_id":(61194),
			"template_args":{
			//이곳에 템플릿 정보를 입력하세요.
			'IMG':img
			}
			}, "custom")
			var showorder="";
			for(var i=0;i<order.length;i++)
				showorder=showorder+tokenshow[i]+": "+order[i]+"\n";
			replier.reply(showorder);
			if(playersnum[turnnum]==total)
			{
				replier.reply(nowTurn+" 님의 승리! 게임 끝!");
				brReset();
			}
			else
			{
				turnnum++;
				if(turnnum==playerList.length)
				   turnnum=0;
			   nowTurn = order[turnnum];
			   replier.reply(order[turnnum]+" 님의 차례입니다.\n/굴리기 를 통해 주사위를 굴려 주세요.");
			   if(isAI==turnnum&&order[turnnum]=="AI 루시")
						{
							java.lang.Thread.sleep(1000);
							replier.reply("루시가 주사위를 굴립니다.");
							var r=Math.floor(Math.random()*6);
							replier.reply(diceshow[r]);
							java.lang.Thread.sleep(1000);
							playersnum[turnnum]=playersnum[turnnum]+(r+1);
							playersnum[turnnum]=colmove(playersnum[turnnum]);
							if(playersnum[turnnum]>total)
								playersnum[turnnum]=total;
							var img="";
							img=imgurl(playersnum[0],playersnum[1],playersnum[2],playersnum[3]);
							
							Kakao.sendLink(room, {
							"link_ver":"4.0",
							"template_id":(61194),
							"template_args":{
							//이곳에 템플릿 정보를 입력하세요.
							'IMG':img
							}
							}, "custom")
							var showorder="";
							for(var i=0;i<order.length;i++)
								showorder=showorder+tokenshow[i]+": "+order[i]+"\n";
							replier.reply(showorder);
							if(playersnum[turnnum]==total)
							{
								replier.reply("루시의 승리! 게임 끝!");
								brReset();
							}
							else
							{
								turnnum++;
								if(turnnum==playerList.length)
								   turnnum=0;
							   nowTurn = order[turnnum];
							   replier.reply(order[turnnum]+" 님의 차례입니다.\n/굴리기 를 통해 주사위를 굴려 주세요.");
							}
						}
						
			}
		}
	}
	
}