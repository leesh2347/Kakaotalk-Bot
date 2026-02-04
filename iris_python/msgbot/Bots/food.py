import json
import os

import random

from msgbot.Bots.maple_nickskip.nickskip_module import _load_data, _save_data

# banned_rooms.json의 절대 경로 계산
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # msgbot/
FILTER_FILE = os.path.join(BASE_DIR, "banned_rooms.json")
DATA_FILE_DIR = os.path.join(BASE_DIR, "data_custom_food.json")

def record_to_data_file(datadir, com, ans):
    dat = _load_data(datadir)
    dat[com] = ans
    _save_data(datadir, dat)

# JSON 파일 로드
with open(FILTER_FILE, "r", encoding="utf-8") as f:
    filter_data = json.load(f)

# 금지 방 목록 로드
BANNED_PLAY_ROOMS = filter_data["banrooms"]["play"]

def handle_message(chat):
    
    if chat.room.name in BANNED_PLAY_ROOMS:
        return

    if '@뭐먹지등록' in chat.message.msg or '!뭐먹지등록' in chat.message.msg:

        parts = chat.message.msg.split(" ")

        if len(parts) > 1:
            new_food = chat.message.msg[7:]

            foods_arr = _load_data(DATA_FILE_DIR)["food"]

            space = "\u200b" * 500

            if new_food not in foods_arr:
                    foods_arr.append(new_food)
                    record_to_data_file(DATA_FILE_DIR, "food", foods_arr)
                    chat.reply(f'[루시] 뭐먹지 메뉴 등록 완료: {new_food}\n{space}\n현재 등록된 뭐먹지 목록\n{",".join(foods_arr)}')
            else:
                chat.reply(f'[루시] 이미 등록된 메뉴입니다: {new_food}\n{space}\n현재 등록된 뭐먹지 목록\n{",".join(foods_arr)}')
        else:
            chat.reply("메뉴를 입력해 주세요.")

    elif '@뭐먹지삭제' in chat.message.msg or '!뭐먹지삭제' in chat.message.msg:
        parts = chat.message.msg.split(" ")

        if len(parts) > 1:
            new_food = chat.message.msg[7:]

            foods_arr = _load_data(DATA_FILE_DIR)["food"]

            space = "\u200b" * 500

            if new_food in foods_arr:
                    idx = foods_arr.index(new_food)
                    del foods_arr[idx]
                    record_to_data_file(DATA_FILE_DIR, "food", foods_arr)
                    chat.reply(f'[루시] 뭐먹지 메뉴 삭제 완료: {new_food}\n{space}\n현재 등록된 뭐먹지 목록\n{",".join(foods_arr)}')
            else:
                chat.reply(f'[루시] 등록되어있지 않은 메뉴입니다: {new_food}\n{space}\n현재 등록된 뭐먹지 목록\n{",".join(foods_arr)}')
        else:
            chat.reply("메뉴를 입력해 주세요.")
    elif '뭐먹지' in chat.message.msg or 'ㅁㅁㅈ' in chat.message.msg:
        parts = chat.message.msg.split(" ")

        foods_arr = _load_data(DATA_FILE_DIR)["food"]

        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            if 1 < n < 11:
                res = []
                t = ""
                for i in range(1,n+1):
                    t = foods_arr[random.randint(1, len(foods_arr))-1]
                    res.append(t)
                chat.reply(f"{chat.sender.name}님의 추천 메뉴는\n\n{','.join(res)}")
        else:
            t = random.randint(1, len(foods_arr))
            chat.reply(f"선택장애 {chat.sender.name}님!\n메뉴는 [{foods_arr[t-1]}]입니다 ^.^")


