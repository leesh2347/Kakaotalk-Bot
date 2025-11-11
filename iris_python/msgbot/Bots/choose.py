import random

def handle_message(chat):
    """
    여러 명령어를 한 모듈에서 처리할 수 있음
    """
    if chat.room.name == "키네연구소":
        return

    if ' vs ' in chat.message.msg:
        arr = chat.message.msg.split(" vs ")
        r = random.randint(1, len(arr))
        chat.reply(f"{arr[r-1]} (이) 가 더 좋을 것 같아요!")
