var banrooms=["바다 월드","키네연구소","낚시터","메이플 키네시스"];

var num;
var strike=0;
var ball=0;
var count=0;
var isplaying=0;
var play;
var proom=" ";

function response(room, msg, sender, isGroupChat, replier, ImageDB) {
if(banrooms.includes(room)) return;


if(msg=="/숫자야구시작")
{
if(isplaying==1)
replier.reply("이미 진행 중인 게임이 있습니다.");
else{
num=new Array(0,0,0);
play=new Array(0,0,0);
strike=0;
ball=0;
proom=room;
replier.reply("새로운 게임이 생성되었습니다!");
num[0]=Math.floor(Math.random()*9)+1;
do{
num[1]=Math.floor(Math.random()*9)+1;
}while(num[0]==num[1]);
do{
num[2]=Math.floor(Math.random()*9)+1;
}while(num[0]==num[2]||num[1]==num[2]);
isplaying=1;
replier.reply("숫자 생성 완료!\n공을 3개 던져주세요!\n\n현재 도전 횟수: "+count+"회 (최대 10회)");
}
}

if(msg=="/숫자야구도움말")
replier.reply("/숫자야구시작\n/숫자야구 (숫자) (숫자) (숫자)\n(1~9사이의 숫자만 가능합니다.)\n\n기회는 1게임당 10회씩 주어집니다.");

if(msg.split(' ')[0]=="/숫자야구")
{
if(isplaying==0)
replier.reply("진행 중인 게임이 없습니다.");
else if(proom!=room)
{
replier.reply("다른 방에서 누군가가 게임을 진행 중입니다.");
}
else{
play[0]=msg.split(' ')[1];
play[1]=msg.split(' ')[2];
play[2]=msg.split(' ')[3];
if(play[0]<1||play[0]>9||play[1]<1||play[1]>9||play[2]<1||play[2]>9)
replier.reply("1~9 사이의 숫자를 입력해 주세요.");
else
{
//replier.reply(" "+play[0]+play[1]+play[2]);
var i;
var j;
strike=0;
ball=0;
for(i=0;i<3;i++)
{
for(j=0;j<3;j++)
{
if(num[i]==play[j])
{
if(i==j)
strike++;
else
ball++;
}
}
}
if(strike==3)
{
replier.reply("축하합니다! \n정답은 "+num[0]+", "+num[1]+", "+num[2]+" 입니다.");
count=0;
strike=0;
ball=0;
isplaying=0;
proom=" ";
}
else
{
count++;
if(strike==ball&&strike==0&&ball==0)
replier.reply("Out입니다.\n현재 도전 횟수: "+count+"회 (최대 10회)");
else
replier.reply(strike+" Strike "+ball+" Ball 입니다.\n현재 도전 횟수: "+count+"회 (최대 10회)");
if(count>9)
{
replier.reply("도전 횟수를 모두 소모하여 게임이 종료됩니다.\n정답은 "+num[0]+", "+num[1]+", "+num[2]+" 입니다.");
count=0;
strike=0;
ball=0;
proom=" ";
isplaying=0;
}
}
}
}
}


}

function onStartCompile(){
    /*컴파일 또는 Api.reload호출시, 컴파일 되기 이전에 호출되는 함수입니다.
     *제안하는 용도: 리로드시 자동 백업*/
    
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState,activity) {
    var layout=new android.widget.LinearLayout(activity);
    layout.setOrientation(android.widget.LinearLayout.HORIZONTAL);
    var txt=new android.widget.TextView(activity);
    txt.setText("액티비티 사용 예시입니다.");
    layout.addView(txt);
    activity.setContentView(layout);
}
function onResume(activity) {}
function onPause(activity) {}
function onStop(activity) {}