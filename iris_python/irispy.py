from iris import Bot, ChatContext, IrisLink
import sys
from msgbot.bot_main import handle_command

if len(sys.argv) < 2:
    print("Usage: python iris.py 172.30.10.66:3000")
    sys.exit(1)
iris_url = sys.argv[1]
bot = Bot(iris_url)
#bot.iris_url은 정제된 주소(IP:PORT 형식)

#초기 세팅법
#pip install irispy-client 친 후
#iris init 실행하면 irispy.py 코드가 생성됩니다.
#그 파일을 이거로 교체하고, 하위 코드들도 연동해 주세요.
#실행방법: python irispy.py (redroid ip):3000

kl = IrisLink(bot.iris_url)

#메시지 감지
@bot.on_event("message")
def on_message(chat: ChatContext):
    handle_command(chat)
    #봇 코드 허브로 넘김

#입장감지
@bot.on_event("new_member")
def on_newmem(chat: ChatContext):
    #chat.reply(f"Hello {chat.sender.name}")
    pass

#퇴장감지
@bot.on_event("del_member")
def on_delmem(chat: ChatContext):
    #chat.reply(f"Bye {chat.sender.name}")
    pass

@bot.on_event("error")
def on_error(err):
    print(f"{err.event} 이벤트에서 오류가 발생했습니다: {err.exception}")

if __name__ == "__main__":
    bot.run()
