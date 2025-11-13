def handle_message(chat):
    
    if chat.message.msg == "@도움말" or chat.message.msg == "!도움말":
        chat.reply("\n".join([
            "루시 Jr. 봇 설명서",
          "https://leesh2347.github.io/kakaotalk_bot_manual/index.html",
          "",
          "봇 주인 문의하기",
          "https://open.kakao.com/o/sEEy7fze",
          "",
          "도배방 가기",
          "https://open.kakao.com/o/gIUCP4yg"
        ]))