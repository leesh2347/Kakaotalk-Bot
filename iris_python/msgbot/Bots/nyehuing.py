import random
from msgbot.Bots.nyehuing_modules.chars import CHS

def handle_message(chat):
    if '!녜힁' in chat.message.msg or '@녜힁' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            if 1 < n < 7:
                nick = ""
                for i in range(1,n+1):
                    r = random.randint(1,len(CHS))
                    nick = nick+CHS[r]
                chat.reply(f"녜힁 생성완료: {nick}") 
            else:
                chat.reply("메이플 닉네임은 2글자에서 6글자까지만 가능합니다.")
        else:
            chat.reply("메이플 닉네임은 2글자에서 6글자까지만 가능합니다.")