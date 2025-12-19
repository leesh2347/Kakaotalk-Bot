import os
from msgbot.Bots.maple_nickskip.nickskip_module import _load_data, _save_data

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_FILE_DIR = os.path.join(BASE_DIR, "data_custom_command.json")

KINE_MANAGER_LIST = ["디벨로이드_27","듀랑고엘린"]

comm_list = {}
answ_list = {}

def record_to_data_file(datadir, com, ans):
    dat = _load_data(datadir)
    dat[com] = ans
    _save_data(datadir, dat)

def handle_message(chat):

    if " 라고하면 " in chat.message.msg and " 라고해" in chat.message.msg:
        if chat.room.name == "키네연구소" and chat.sender.name not in KINE_MANAGER_LIST:
            chat.reply("[루시] 관리자만 가능한 기능이에요!")
        else:
            comm = ""
            answer = ""
            comm = chat.message.msg.split(" 라고하면 ")[0]
            answer = chat.message.msg.split(" 라고하면 ")[1].split(" 라고해")[0]

            comm_list = _load_data(DATA_FILE_DIR)["command"]
            answ_list = _load_data(DATA_FILE_DIR)["answer"]

            if chat.room.name not in comm_list:
                comm_list[chat.room.name] = []
            if chat.room.name not in answ_list:
                answ_list[chat.room.name] = []
            
            if comm not in comm_list[chat.room.name]:
                comm_list[chat.room.name].append(comm)
                answ_list[chat.room.name].append(answer)
                record_to_data_file(DATA_FILE_DIR, "command", comm_list)
                record_to_data_file(DATA_FILE_DIR, "answer", answ_list)
                chat.reply(f"[루시] {comm}(이)라고 하면 {answer}(이)라고 할게요!")
            else:
                chat.reply("[루시] 이미 가르쳐준 말 같은데요?")
    elif " 라고하지마" in chat.message.msg:
        if chat.room.name == "키네연구소" and chat.sender.name not in KINE_MANAGER_LIST:
            chat.reply("[루시] 관리자만 가능한 기능이에요!")
        else:
            comm = ""
            answer = ""
            comm = chat.message.msg.split(" 라고하지마")[0]
            comm_list = _load_data(DATA_FILE_DIR)["command"]
            answ_list = _load_data(DATA_FILE_DIR)["answer"]

            if chat.room.name not in comm_list:
                comm_list[chat.room.name] = []
            if chat.room.name not in answ_list:
                answ_list[chat.room.name] = []

            if comm in comm_list[chat.room.name]:
                idx = comm_list[chat.room.name].index(comm)
                del answ_list[chat.room.name][idx]
                del comm_list[chat.room.name][idx]
                record_to_data_file(DATA_FILE_DIR, "command", comm_list)
                record_to_data_file(DATA_FILE_DIR, "answer", answ_list)
                chat.reply(f"[루시] {comm}(이)라고 할 때의 기억을 지웠어요!")
            else:
                chat.reply("[루시] 저는 배운 기억이 없는데요?")
    elif chat.message.msg == "!학습목록":
        is_manager = 0
        if chat.room.name == "키네연구소":
            if chat.sender.name in KINE_MANAGER_LIST:
                is_manager = 1
        else:
            if "디벨로이드" in chat.sender.name or "JOLT_" in chat.sender.name:
                is_manager = 1
        if is_manager == 1:
            t = ""
            comm_list = _load_data(DATA_FILE_DIR)["command"]
            answ_list = _load_data(DATA_FILE_DIR)["answer"]
            if chat.room.name not in comm_list:
                comm_list[chat.room.name] = []
            if chat.room.name not in answ_list:
                answ_list[chat.room.name] = []
            for i in range(0, len(comm_list[chat.room.name])):
                t = t + f"{comm_list[chat.room.name][i]}:\n{answ_list[chat.room.name][i]}\n\n"
            space = "\u200b" * 500
            chat.reply(f"{chat.room.name}방의 현재 학습된 전체 목록\n{space}\n\n{t}")
        else:
            chat.reply("[루시] 학습어 목록은 관리자만 열람 가능해요!")
    else:
        comm_list = _load_data(DATA_FILE_DIR)["command"]
        answ_list = _load_data(DATA_FILE_DIR)["answer"]
        if chat.room.name not in comm_list:
            comm_list[chat.room.name] = []
        if chat.room.name not in answ_list:
            answ_list[chat.room.name] = []
        if chat.message.msg in comm_list[chat.room.name]:
            if chat.message.msg == "ㄴㅇㄱ":
                chat.reply("ㄴㅇㄱ")
            else:
                chat.reply(f"[루시] {answ_list[chat.room.name][comm_list[chat.room.name].index(chat.message.msg)]}")


