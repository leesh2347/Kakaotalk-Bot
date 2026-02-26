from msgbot.bot_commands.commands_config import PREFIX_CHANNEL, PREFIX_CHALLNNEL
import random

def handle_message(chat):

    if any(prefix in chat.message.msg for prefix in PREFIX_CHANNEL):
        #챌섭은 40을 60으로
        a = random.randint(1, 40)

        pickCh = "20세 이상 채널" if a == 40 else f"{a}번 채널"

        chat.reply(f"오늘의 에픽빔이 잘뜨는 채널은~\n[{pickCh}]입니다~ (안떠도 일단 제탓은 아님)")

    if any(prefix in chat.message.msg for prefix in PREFIX_CHALLNNEL):
        #챌섭은 40을 60으로
        a = random.randint(1, 60)

        pickCh = "20세 이상 채널" if a == 60 else f"{a}번 채널"

        chat.reply(f"오늘의 에픽빔이 잘뜨는 챌린저스 채널은~\n[{pickCh}]입니다~ (안떠도 일단 제탓은 아님)")

        
