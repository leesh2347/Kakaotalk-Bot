from msgbot.Bots.room_check.room_module import record_room_info

message_count = {}

def handle_message(chat):
    room_id = chat.room.id
    room_name = chat.room.name
    sender = chat.sender.name
    
    if room_name not in message_count:
        message_count[room_name] = 0
        
    message_count[room_name] = message_count[room_name]+1
    
    if message_count[room_name] > 300:
        message_count[room_name] = 1
        record_room_info(room_id, room_name)
        chat.reply("[루시] 누적 톡수 300개 누적!\n원활한 봇 작동을 위해 읽음처리됩니다.")