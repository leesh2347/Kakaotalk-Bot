const kalink=require('kaling_config');
const kaling=kalink.kaling;
const { KakaoLinkClient } = require('kakaolink');
const Kakao =new KakaoLinkClient(kaling.key,kaling.url);
Kakao.login(kaling.email,kaling.password);

function response(room, msg, sender, isGroupChat, replier, imageDB) {
if(msg.split(" ")[0]=="!무토"||msg.split(" ")[0]=="@무토")
{
   var imgurl="";
   var name=msg.split(" ")[1];
   if(name==undefined||name==null)
      imgurl="https://i.imgur.com/EkmOMdp.jpg";
   else
   {
      if(name=="깔깔만두"||name=="앗볶음")
         imgurl="https://i.imgur.com/C94G8xr.jpg";
      else if(name=="낄낄볶음밥"||name=="헉튀김")
         imgurl="https://i.imgur.com/biGLMG0.jpg";
      else if(name=="엉엉순대"||name=="으악샐러드")
         imgurl="https://i.imgur.com/otvUk0W.jpg";
      else if(name=="저런찜"||name=="하빵")
         imgurl="https://i.imgur.com/jzjdJvJ.jpg";
      else if(name=="크헉구이"||name=="흑흑화채")
         imgurl="https://i.imgur.com/7buyNcO.jpg";
      else if(name=="큭큭죽"||name=="호호탕")
         imgurl="https://i.imgur.com/pEBdeQI.jpg";
      else if(name=="오잉피클"||name=="허허말이")
         imgurl="https://i.imgur.com/704ItyX.jpg";
      else if(name=="이런면"||name=="휴피자")
         imgurl="https://i.imgur.com/8zIQjNo.jpg";
      else
         imgurl="https://i.imgur.com/EkmOMdp.jpg";
   }



Kakao.sendLink(room, {
"link_ver":"4.0",
"template_id":(79771),
"template_args":{
//이곳에 템플릿 정보를 입력하세요.
'IMG':imgurl
}
}, "custom")

}

}