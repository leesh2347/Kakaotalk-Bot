var typetexts=[" ","노말","불꽃","물","풀","비행","바위","땅","격투","강철","벌레","얼음","전기","독","에스퍼","고스트","악","드래곤"];
const FS = FileStream;
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
if(room.includes("디벨로이드")&&msg.split(" ")[0]=="!포켓몬입력"){
try{
var name=msg.split(" ")[1];
var nextup=msg.split(" ")[2];
var nextlv=msg.split(" ")[3];
if(nextup==undefined) nextup="x";
if(nextlv==undefined) nextlv=0;
var url="https://pokemon.fandom.com/ko/wiki/"+encodeURIComponent(name+"_(포켓몬)/5세대_기술");
var data = Utils.getWebText(url).replace(/(<([^>]+)>)/g, "").replace(/[\n\s]{2,}/g,"\n");
var data2=data.split("5세대 레벨업으로 배우는 기술\nLV")[1].split("명중률\nPP")[1].split("게임 박스에 색깔이 입혀진 기술은 해당 게임에서 가르칠 수 있습니다.")[0];
var data3=data2.split("레벨에 최초라고 쓰여진 기술은 태어나면서부터 배우고 있는 기술입니다.")[0]; //레벨업
data2=data.split("5세대 레벨업으로 배우는 기술\nLV")[1].split("게임 박스에 색깔이 입혀진 기술은 해당 게임에서 가르칠 수 있습니다.")[0];
var data4=data2.split("5세대 머신으로 배우는 기술")[1].split("명중률\nPP")[1].split("굵게 써진 기술은 자속보정을 받는 기술입니다.")[0]; //기술머신
var data5=data2.split("5세대 기술가르침으로 배우는 기술")[1].split("명중률\nPP")[1]; //기술가르침
var t="";
for(var i=1;i<(data3.split("\n").length-1);i++)
{
t=t+data3.split("\n")[i]+" ";
if(i%7==0) t=t+"\n";
}
for(var i=1;i<(data4.split("\n").length-1);i++)
{
t=t+data4.split("\n")[i]+" ";
if(i%7==0) t=t+"\n";
}

var t2="";
for(var i=1;i<(data5.split("\n").length-1);i++)
{
t2=t2+data5.split("\n")[i]+" ";
if(i%10==0) t2=t2+"\n";
}

var arr=t.split("\n");
var arr2=[];
var t3="";
for(var i=0;i<arr.length;i++)
{
if(arr[i].split(" ")[3]!="변화"&&arr[i].split(" ")[1]!=undefined){
t3=arr[i].split(" ")[1].replace("HGSS","").replace("DPPt","");
if(arr2.indexOf(t3)==(-1)) arr2.push(t3);
}
}
arr=t2.split("\n");
for(var i=0;i<arr.length;i++)
{
//	replier.reply(arr[i].split(" ").join("\n"));
if(arr[i].split(" ")[6]!="변화"&&arr[i].split(" ")[1]!=undefined){
t3=arr[i].split(" ")[4].replace("HGSS","").replace("DPPt","");
if(arr2.indexOf(t3)==(-1)) arr2.push(t3);
}
}
//arr2=기술목록
var url2="https://librewiki.net/wiki/"+encodeURIComponent(name+"_(포켓몬)");
var typedata = org.jsoup.Jsoup.connect(url2).get().select("table").get(2).select("td").get(0).text().replace("페어리","노말").replace(/[^가-힣\s]/g,"");
//typedata.split(" ")[0] 타입1 typedata.split(" ")[1] 타입2
var type1=typetexts.indexOf(typedata.split(" ")[0]);
if(typedata.split(" ")[1]==undefined) var type2=0;
else var type2=typetexts.indexOf(typedata.split(" ")[1]);


var url3="https://pokemon.fandom.com/ko/wiki/"+encodeURIComponent(name+"_(포켓몬)");
var statdata = Utils.getWebText(url3).replace(/(<([^>]+)>)/g, "").replace(/[\n\s]{2,}/g,"\n");
var stat=statdata.split("function mfTempOpenSection(id)")[1].split("\n진화 단계\n")[1].split("퍼포먼스\n스피드")[0].split("Lv. 100일 때")[1].split("총합:")[0].split("\n");
/*stat[2]hp
stat[7]공
stat[12]방
stat[17]특공
stat[22]특방
stat[27]스피드
*/
if(Number(stat[7])>Number(stat[17])) var atk=Number(stat[7]);
else var atk=Number(stat[17]);
if(Number(stat[12])>Number(stat[22])) var def=Number(stat[12]);
else var def=Number(stat[22]);
let res={"type1":type1,"type2":type2,"nextup":nextup,"nextlv":Number(nextlv),"hp":Number(stat[2]),"atk":Number(atk),"def":Number(def),"spd":Number(stat[27]),"ability":0,"skills":arr2};
FileStream.write("sdcard/Devel/Pokemon/포켓몬/"+name+'.json', JSON.stringify(res));
replier.reply(JSON.stringify(res));
}catch(e){
	replier.reply("자동 입력 오류");
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
