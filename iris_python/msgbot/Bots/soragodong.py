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

MENTS = ["그래.","그.....래.","그럼~","아니.","안돼.","아.....니.","안.....돼.","언젠가는.","가만히 있어.","그것도 안돼.","다시 한 번 물어봐.","그렇고 말고.","그러지 마.","물론~","하지 마."]

def handle_message(chat):
    """
    여러 명령어를 한 모듈에서 처리할 수 있음
    """
    if chat.room.name in BANNED_PLAY_ROOMS:
        return
    #재미요소 금지 방 필터

    if chat.message.msg == '소라고동님':
        chat.reply("왜.")
    elif '소라고동님' in chat.message.msg:
        r = random.randint(1, 100)  # 1~100 사이 정수
        if r == 1:
            chat.reply("고동이는 기여어>< 고동 고동")
        elif r == 2:
            chat.reply(f"그치만....{chat.sender.name}쟝....이렇게라도 하지 않으면.....내겐 관심도 없는걸!")
        else:
            t = random.randint(1,len(MENTS))
            chat.reply(f"{MENTS[t-1]}")
