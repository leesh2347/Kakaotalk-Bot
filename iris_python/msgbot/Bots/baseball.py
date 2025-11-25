import json
import os

import random

# banned_rooms.json의 절대 경로 계산
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # msgbot/
FILTER_FILE = os.path.join(BASE_DIR, "banned_rooms.json")

num = [0, 0, 0]
strike = 0
ball = 0
count = 0
is_playing = 0
play = [0, 0, 0]
play_room = ""

# JSON 파일 로드
with open(FILTER_FILE, "r", encoding="utf-8") as f:
    filter_data = json.load(f)

# 금지 방 목록 로드
BANNED_PLAY_ROOMS = filter_data["banrooms"]["play"]

def handle_message(chat):
    global num, strike, ball, count, is_playing, play, play_room

    if chat.room.name in BANNED_PLAY_ROOMS:
        return
    #재미요소 금지 방 필터

    if chat.message.msg == "@숫자야구시작":
        if is_playing == 1:
            chat.reply("이미 진행 중인 게임이 있습니다.")

        else:
            for i in range(0,3):
                num[i] = 0
                play[i] = 0
            strike = 0
            ball = 0
            play_room = chat.room.name
            chat.reply("새로운 게임이 생성되었습니다.")

            num[0] = random.randint(1, 9)
            num[1] = random.randint(1, 9)
            while num[0] == num[1]:
                num[1] = random.randint(1, 9)
            num[2] = random.randint(1, 9)
            while num[0] == num[2] or num[1] == num[2]:
                num[2] = random.randint(1, 9)
            
            is_playing = 1
            chat.reply(f"숫자 생성 완료!\n공을 3개 던져주세요!\n\n현재 도전 횟수: {count}회 (최대 10회)")

    if chat.message.msg == "@숫자야구도움말":
        chat.reply("@숫자야구시작\n@숫자야구 (숫자) (숫자) (숫자)\n(1~9사이의 숫자만 가능합니다.)\n\n기회는 1게임당 10회씩 주어집니다.")

    if chat.message.command == "@숫자야구":
        if is_playing == 0:
            chat.reply("진행 중인 게임이 없습니다.")
        elif play_room != chat.room.name:
            chat.reply("다른 방에서 누군가가 게임을 진행 중입니다.")
        else:
            parts = chat.message.msg.split(" ")
            play[0] = int(parts[1])
            play[1] = int(parts[2])
            play[2] = int(parts[3])
        if play[0] < 1 or play[0] > 9 or play[1] < 1 or play[1] > 9 or play[2] < 1 or play[2] > 9:
            chat.reply("1~9 사이의 숫자를 입력해 주세요.")
        else:
            strike = 0
            ball = 0
            for i in range(0, 3):
                for j in range(0, 3):
                    if num[i] == play[j]:
                        if i == j:
                            strike = strike + 1
                        else:
                            ball = ball + 1
            
            if strike == 3:
                count = 0
                strike = 0
                ball = 0
                is_playing = 0
                play_room = ""
                chat.reply(f"축하합니다! \n정답은 {num[0]}, {num[1]}, {num[2]} 입니다.")
            else:
                count = count + 1
                if strike == ball and strike == 0 and ball == 0:
                    chat.reply(f"Out입니다.\n현재 도전 횟수: {count}회 (최대 10회)")
                else:
                    chat.reply(f"{strike} Strike {ball} Ball 입니다.\n현재 도전 횟수: {count}회 (최대 10회)")
                
                if count > 9:
                    chat.reply(f"도전 횟수를 모두 소모하여 게임이 종료됩니다.\n정답은 {num[0]}, {num[1]}, {num[2]} 입니다.")
                    count = 0
                    strike = 0
                    ball = 0
                    play_room = ""
                    is_playing = 0

