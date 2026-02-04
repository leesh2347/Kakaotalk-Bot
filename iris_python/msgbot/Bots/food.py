import json
import os

import random

from msgbot.Bots.maple_nickskip.nickskip_module import _load_data, _save_data
from msgbot.bot_commands.commands_config import PREFIX_FOOD_ADD, PREFIX_FOOD_DELETE, PREFIX_JOB_ADD, PREFIX_JOB_DELETE, PREFIX_FOOD, PREFIX_JOB

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

def add_food(new_food, add_type):
    foods_arr = _load_data(DATA_FILE_DIR)[f'{add_type}']

    space = "\u200b" * 500

    if new_food not in foods_arr:
        foods_arr.append(new_food)
        record_to_data_file(DATA_FILE_DIR, add_type, foods_arr)
        if add_type =="food":
            res_text = f'[루시] 뭐먹지 메뉴 등록 완료: {new_food}\n{space}\n현재 등록된 뭐먹지 목록\n{",".join(foods_arr)}'
        else:
            res_text = f'[루시] 뭐하지 할일 등록 완료: {new_food}\n{space}\n현재 등록된 뭐하지 목록\n{",".join(foods_arr)}'
        return res_text
    else:
        if add_type =="food":
            res_text = f'[루시] 이미 등록된 메뉴입니다: {new_food}\n{space}\n현재 등록된 뭐먹지 목록\n{",".join(foods_arr)}'
        else:
            res_text = f'[루시] 이미 등록된 할일입니다: {new_food}\n{space}\n현재 등록된 뭐하지 목록\n{",".join(foods_arr)}'
        return res_text

def delete_food(new_food, del_type):
    foods_arr = _load_data(DATA_FILE_DIR)[f'{del_type}']

    space = "\u200b" * 500

    if new_food in foods_arr:
        idx = foods_arr.index(new_food)
        del foods_arr[idx]
        record_to_data_file(DATA_FILE_DIR, del_type, foods_arr)
        res_text = ''
        if del_type =="food":
            res_text = f'[루시] 뭐먹지 메뉴 삭제 완료: {new_food}\n{space}\n현재 등록된 뭐먹지 목록\n{",".join(foods_arr)}'
        else:
            res_text = f'[루시] 뭐하지 할일 삭제 완료: {new_food}\n{space}\n현재 등록된 뭐하지 목록\n{",".join(foods_arr)}'
        return res_text
    else:
        if del_type =="food":
            res_text = f'[루시] 등록되어있지 않은 메뉴입니다: {new_food}\n{space}\n현재 등록된 뭐먹지 목록\n{",".join(foods_arr)}'
        else:
            res_text = f'[루시] 등록되어있지 않은 할일입니다: {new_food}\n{space}\n현재 등록된 뭐하지 목록\n{",".join(foods_arr)}'
        return res_text

def choose_food(msg, choose_type):
    parts = msg.split(" ")

    foods_arr = _load_data(DATA_FILE_DIR)[f'{choose_type}']

    if len(parts) > 1 and parts[1].isdigit():
        n = int(parts[1])
        if 1 < n < 11:
            res = []
            t = ""
            for i in range(1,n+1):
                t = foods_arr[random.randint(1, len(foods_arr))-1]
                res.append(t)
            if choose_type =="food":
                return f"{chat.sender.name}님의 추천 메뉴는\n\n{','.join(res)}"
            else:
                return f"{chat.sender.name}님의 추천 할일은\n\n{','.join(res)}"
    else:
        t = random.randint(1, len(foods_arr))
        if choose_type =="food":
            return f"선택장애 {chat.sender.name}님!\n메뉴는 [{foods_arr[t-1]}]입니다 ^.^"
        else:
            return f"심심하신 {chat.sender.name}님!\n[{foods_arr[t-1]}] 추천드립니다 ^.^"

def handle_message(chat):
    
    if chat.room.name in BANNED_PLAY_ROOMS:
        return

    if any(prefix in chat.message.msg for prefix in PREFIX_FOOD_ADD):

        parts = chat.message.msg.split(" ")

        if len(parts) > 1:
            new_food = chat.message.msg[7:]
            res = add_food(new_food, "food")
            chat.reply(res)
        else:
            chat.reply("메뉴를 입력해 주세요.")

    elif any(prefix in chat.message.msg for prefix in PREFIX_FOOD_DELETE):
        parts = chat.message.msg.split(" ")

        if len(parts) > 1:
            new_food = chat.message.msg[7:]
            res = delete_food(new_food, "food")
            chat.reply(res)

        else:
            chat.reply("메뉴를 입력해 주세요.")

    if any(prefix in chat.message.msg for prefix in PREFIX_JOB_ADD):

        parts = chat.message.msg.split(" ")

        if len(parts) > 1:
            new_food = chat.message.msg[7:]
            res = add_food(new_food, "job")
            chat.reply(res)
        else:
            chat.reply("할일을 입력해 주세요.")

    elif any(prefix in chat.message.msg for prefix in PREFIX_JOB_DELETE):
        parts = chat.message.msg.split(" ")

        if len(parts) > 1:
            new_food = chat.message.msg[7:]
            res = delete_food(new_food, "job")
            chat.reply(res)

        else:
            chat.reply("할일을 입력해 주세요.")

    elif any(prefix in chat.message.msg for prefix in PREFIX_FOOD):
        res = choose_food(chat.message.msg, "food")
        chat.reply(res)

    elif any(prefix in chat.message.msg for prefix in PREFIX_JOB):
        res = choose_food(chat.message.msg, "job")
        chat.reply(res)



