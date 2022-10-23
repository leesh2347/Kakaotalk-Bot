var line1=["███","░░█","███","███","█░█","███","███","███","███","███"];
var line2=["█░█","░░█","░░█","░░█","█░█","█░░","█░░","░░█","█░█","█░█"];
var line3=["█░█","░░█","███","███","███","███","███","░░█","███","███"];
var line4=["█░█","░░█","█░░","░░█","░░█","░░█","█░█","░░█","█░█","░░█"];
var line5=["███","░░█","███","███","░░█","███","███","░░█","███","███"];

const br=require('banned_rooms');
const banrooms=br.banrooms['play'];

function response(room, msg, sender, isGroupChat, replier, ImageDB){
if(banrooms.includes(room)) return;
if(msg=="@슬롯머신")
{
   var ran=[0,0,0];
   for(var i=0;i<3;i++)
      ran[i]=Math.floor(Math.random()*9);
   replier.reply(["["+sender+"]님의 슬롯머신 결과",
   "",
   line1[ran[0]]+" "+line1[ran[1]]+" "+line1[ran[2]]+"",
   line2[ran[0]]+" "+line2[ran[1]]+" "+line2[ran[2]]+"",
   line3[ran[0]]+" "+line3[ran[1]]+" "+line3[ran[2]]+"",
   line4[ran[0]]+" "+line4[ran[1]]+" "+line4[ran[2]]+"",
   line5[ran[0]]+" "+line5[ran[1]]+" "+line5[ran[2]]+""
   ].join("\n"));
}

}