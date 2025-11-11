# /msgbot/Bots/bot_test1.py

def handle_message(chat):
    """
    여러 명령어를 한 모듈에서 처리할 수 있음
    """
    print("test1py message")
    if chat.room.name == 'JOLT_26':
        if "JOLT" in chat.sender.name:
            if chat.message.command == '@hi':
                chat.reply(f"👋 Hi, {chat.sender.name}!")
