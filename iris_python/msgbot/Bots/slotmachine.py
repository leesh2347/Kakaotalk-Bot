import json
import os

import random

# banned_rooms.json의 절대 경로 계산
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # msgbot/
FILTER_FILE = os.path.join(BASE_DIR, "banned_rooms.json")

# JSON 파일 로드
with open(FILTER_FILE, "r", encoding="utf-8") as f:
    filter_data = json.load(f)

# 금지 방 목록 로드
BANNED_PLAY_ROOMS = filter_data["banrooms"]["play"]

LINES={
    "line1":["███","░░█","███","███","█░█","███","███","███","███","███"],
    "line2":["█░█","░░█","░░█","░░█","█░█","█░░","█░░","░░█","█░█","█░█"],
    "line3":["█░█","░░█","███","███","███","███","███","░░█","███","███"],
    "line4":["█░█","░░█","█░░","░░█","░░█","░░█","█░█","░░█","█░█","░░█"],
    "line5":["███","░░█","███","███","░░█","███","███","░░█","███","███"]
}

def handle_message(chat):
    """
    여러 명령어를 한 모듈에서 처리할 수 있음
    """
    if chat.room.name in BANNED_PLAY_ROOMS:
        return
    #재미요소 금지 방 필터


    if chat.message.msg == '@슬롯머신' or chat.message.msg == '!슬롯머신':
    
        # 0~9 사이의 난수 3개 생성
        ran = [random.randint(0, 9) for _ in range(3)]
        
        res=""
        res=res+f"{LINES['line1'][ran[0]]} {LINES['line1'][ran[1]]} {LINES['line1'][ran[2]]}\n"
        res=res+f"{LINES['line2'][ran[0]]} {LINES['line2'][ran[1]]} {LINES['line2'][ran[2]]}\n"
        res=res+f"{LINES['line3'][ran[0]]} {LINES['line3'][ran[1]]} {LINES['line3'][ran[2]]}\n"
        res=res+f"{LINES['line4'][ran[0]]} {LINES['line4'][ran[1]]} {LINES['line4'][ran[2]]}\n"
        res=res+f"{LINES['line5'][ran[0]]} {LINES['line5'][ran[1]]} {LINES['line5'][ran[2]]}"
        
        chat.reply(f"{chat.sender.name}님의 슬롯머신 결과\n\n{res}")