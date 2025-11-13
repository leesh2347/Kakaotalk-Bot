import json
import os
from datetime import datetime

import random

# banned_rooms.json의 절대 경로 계산
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # msgbot/
FILTER_FILE = os.path.join(BASE_DIR, "banned_rooms.json")

today_count = {}

UNSE=["운이 좋은 날이군요. 스타포스 한 번 해볼까요?","운이 좋은 날이군요. 로얄 한 번 해볼까요?","천생연분을 만날 수도 있는 하루입니다! 솔로이시면 기대해 보세요.","금전적인 이득을 얻을 수 있는 하루네요. 0빼기를 먹거나 길을 걷다 돈을 주울 수도 있겠군요.","오늘의 운은 보통입니다. 평범한 하루가 되겠군요.","소라고동님이 좋아하는 하루네요. 소라고동님께 물어보죠.","주사위를 던져서 점수를 알아보세요. (@주사위)","가까운 사람과 갈등이 생길 수도 있는 하루입니다. 조심하세요.","오늘의 운은 나쁩니다. 스타포스를 하면 터지겠군요.","오늘의 운은 나쁩니다. 방구석 히키코모리나 하세요.","큰 화를 입을 수도 있는 하루입니다. 과음은 하지 마시길 추천드려요."]

# JSON 파일 로드
with open(FILTER_FILE, "r", encoding="utf-8") as f:
    filter_data = json.load(f)

# 금지 방 목록 로드
BANNED_PLAY_ROOMS = filter_data["banrooms"]["play"]

def handle_message(chat):

    if chat.room.name in BANNED_PLAY_ROOMS:
        return
        
    if chat.message.msg == "@오늘의운세" or chat.message.msg == "!오늘의운세":
        sender = chat.sender.name
        today = datetime.today()
        
        if sender not in today_count:
            today_count[sender] = {
                "count":0,
                "day":today
            }

        if today_count[sender]["day"].date() != today.date():
            today_count[sender]["count"] = 0
            today_count[sender]["day"] = today
            
        if today_count[sender]["count"] > 0:
            chat.reply("운세는 하루에 한 번만 볼수있어요!")
            
        else:
            today_count[sender]["count"] = today_count[sender]["count"]+1
            t=random.randint(1,len(UNSE))
            chat.reply(UNSE[t-1])