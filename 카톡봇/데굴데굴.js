const kalink=require('kaling_config');
const kaling=kalink.kaling;
const { KakaoLinkClient } = require('kakaolink');
const Kakao =new KakaoLinkClient(kaling.key,kaling.url);
Kakao.login(kaling.email,kaling.password);
const br=require('banned_rooms');
const banrooms=br.banrooms['play'];

function response(room, msg, sender, isGroupChat, replier, imageDB) {
if(banrooms.includes(room)) return;
if(msg=="!ㄷㄱㄷㄱ"||msg=="@ㄷㄱㄷㄱ")
{
var n1=0;
   var n2=0;
   var n3=0;
   var n4=0;
   do{
		n1=Math.floor(Math.random()*7)+4;
		do{
		n2=Math.floor(Math.random()*(17-n1-4))+4;
		}while(n2>10);
		do
		{
		n3=Math.floor(Math.random()*(21-n1-n2-4))+4;
		}while(n3>10);
		n4=25-(n1+n2+n3);
   }while(n4>10);
var nick=sender;
if(nick.includes("/")) nick=nick.split("/").join("_");
var imgurl="https://res.cloudinary.com/leesh2347/image/upload/l_text:Arial_14_bold:"+encodeURIComponent(nick)+",co_rgb:ffffff,g_north_west,x_22,y_49/l_text:Arial_12_bold:"+n1;
imgurl=imgurl+",co_rgb:000000,g_north_west,x_59,y_110/l_text:Arial_12_bold:"+n2+",co_rgb:000000,g_north_west,x_59,y_130/l_text:Arial_12_bold:"+n3+",co_rgb:000000,g_north_west,x_59,y_150/l_text:Arial_12_bold:"+n4;
imgurl=imgurl+",co_rgb:000000,g_north_west,x_59,y_170/"+encodeURIComponent("주사위")+"_zap0t9";

Kakao.sendLink(room, {
"link_ver":"4.0",
"template_id":(61194),
"template_args":{
//이곳에 템플릿 정보를 입력하세요.
'IMG':imgurl
}
}, "custom")

}


}