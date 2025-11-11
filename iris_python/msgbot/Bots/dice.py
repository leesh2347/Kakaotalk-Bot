# /msgbot/Bots/bot_test1.py

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

def handle_message(chat):
    """
    여러 명령어를 한 모듈에서 처리할 수 있음
    """
    if chat.room.name in BANNED_PLAY_ROOMS:
        return
    #재미요소 금지 방 필터


    if chat.message.command == '@주사위' or chat.message.command == '!주사위' or chat.message.command == '일 확률' or chat.message.command == '할 확률' or chat.message.command == '을 확률':
        a = random.randint(1, 100)  # 1~100 사이 정수
        if 0 < a < 2:
            chat.reply(f"망이네요.....주사위가 {a} 나왔습니다.")
        elif 1 < a < 10:
            chat.reply(f"오늘의 운은 꽝이군요....주사위가 {a} 나왔습니다.")
        elif 9 < a < 20:
            chat.reply(f"어렵겠군요. 너무 슬퍼마세요....주사위가 {a} 나왔습니다.")
        elif 19 < a < 30:
            chat.reply(f"주사위는 아무 잘못이 없어요...주사위가 {a} 나왔습니다.")
        elif 29 < a < 40:
            chat.reply(f"괜찮아요, 다음엔 잘 나오겠죠. 주사위가 {a} 나왔습니다.")
        elif 39 < a < 50:
            chat.reply(f"조금 아깝네요...한번 더 해볼래요? 주사위가 {a} 나왔습니다.")
        elif 49 < a < 60:
            chat.reply(f"그래도 절반은 넘겼네요! 주사위가 {a} 나왔습니다.")
        elif 59 < a < 70:
            chat.reply(f"흠....나쁘진 않네요. 주사위가 {a} 나왔습니다.")
        elif 69 < a < 80:
            chat.reply(f"순전히 운빨! 좀 더 해봐요! 주사위가 {a} 나왔습니다.")
        elif 79 < a < 90:
            chat.reply(f"오호~대단하군요! 주사위가 {a} 나왔습니다.")
        elif 89 < a < 96:
            chat.reply(f"행운의 여신이 함께하길. 주사위가 {a} 나왔습니다.")
        elif a == 100:
            chat.reply(f"AI 루시가 확실하게 보증합니다. 주사위가 {a} 나왔습니다!")
        else:
            chat.reply(f"AI 루시가 보증합니다. 주사위가 {a} 나왔습니다!")
