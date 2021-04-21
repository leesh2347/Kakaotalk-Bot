const kalingModule = require("kaling.js").Kakao();
const Kakao = new kalingModule();
Kakao.init("asdf"), //Do Not Change
Kakao.login("asdf", "asdf");

Jsoup = org.jsoup.Jsoup

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if(room!="바다 월드"&msg=="@노래추천") {
var ran=Math.floor((Math.random()*120)+1);
var list=Jsoup.connect("https://melon.com/chart/").get();
var a=list.select(".rank_info").select("a").toArray();
var b=a[ran].text();
//replier.reply(b);
        melon(room,b);
    }
}

function melon(room, query) {
    try {
        let adult;
        let url = "https://m.search.daum.net/search?nil_profile=btn&w=music&DA=SBC&m=song&q=";
        let document = org.jsoup.Jsoup.connect(url + encodeURIComponent(query)).get();
        let title = document.select("strong.tit-g").get(0);
        title.select("span.ico_adult").text() != "" ? adult = true : adult = false;
        adult ? title = title.text().replace("19", "") : title = title.text();
        Kakao.send(room, {
            link_ver: "4.0",
            template_id: 17141, //Do Not Change
            template_args: {
                KMA: adult,
                SONG_ID: document.select("a").attr("data-song-id"),
                THUMB_URL: decodeURIComponent("http" + document.select("img").attr("data-original-src").split("http")[2]),
                TITLE: title,
                ARTIST: document.select("p.desc").get(0).text()
            }
        }, "custom");
    } catch (e) {
        Api.replyRoom(room, "[루시] 불러올 노래가 없네요...다음 기회에!");
    }
}