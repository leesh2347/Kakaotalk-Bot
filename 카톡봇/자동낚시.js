const scriptName = "자동낚시";
var macroon=false;
var isnight=false;
var rest=0;
var chats=0;
/*
카톡봇 낚시게임의 자동플레이 소스
@낚시 로 낚시를 하면 체력이 닳고, @휴식 으로 회복하는 형태입니다
 */
function naksi(replier)
{
	chats=1;
	replier.reply("@낚시");
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(room=="바다 낚시터")
{
   if(sender=='디벨로이드'&&msg=='/시작')
   {
      replier.reply("작동을 시작합니다.");
      macroon=true;
      replier.reply("@휴식");
   }
   if(sender=='디벨로이드'&&msg=='/정지')
   {
      macroon=false;
      replier.reply("작동을 중지합니다.");
      replier.reply("@휴식");
   }
   if(sender=='디벨로이드'&&msg=='/야간모드')
   {
      if(isnight==true)
      {
         isnight=false;
         replier.reply("야간모드 OFF");
      }
      else
      {
         isnight=true;
         replier.reply("야간모드 ON");
      }
      
   }
   if(sender=='디벨로이드'&&msg.split(" ")[0]=='/강화')
   {
var n=msg.split(" ")[1];
      for(var i=0;i<n;i++) replier.reply("@강화")
   }
   if(macroon==true)
   {
      if(rest>0)
         rest++;
      if(rest>50)
      {
         rest=0;
         replier.reply("@휴식");
      }
      if(msg.includes('@루시 Jr.'))
      {
        if(msg.includes('낚시 실패')||msg.includes('낚았어요'))
          naksi(replier);
        if(msg.includes('체력이 부족해요'))
        {
           if(isnight==true)
           {
			   chats=0;
              replier.reply("@휴식");
			  
             java.lang.Thread.sleep(30000);
             replier.reply("@휴식");

           }
           else
           {
			   chats=0;
             rest=1; 
             replier.reply("@휴식");
			 
           }
        }
        if(msg.includes('휴식을 종료했어요'))
          naksi(replier);
      if(msg.includes('개를 구매했어요'))
          naksi(replier);
        if(msg.includes('휴식중에는'))
          replier.reply("@휴식");
        if(msg.includes('미끼가 없어요'))
          replier.reply("@미끼 구매 40");
        if(msg.includes('골드가 부족해요'))
          replier.reply("@물고기 판매");
	  if(msg.includes('골드에 팔았어요'))
          replier.reply("@미끼 구매 40");
      }
	  if(chats>0)
		  chats++;
      if(chats>50) //가끔 하는 사람이 몰리거나, 바다가 죽거나 등의 이유로 톡이 씹혀서 오토가 멈출 때가 있습니다 그거 방지용
      {
         naksi(replier);
      }
   }
}
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}
