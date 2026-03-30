import json
import os
import random

from msgbot.Bots.maple_nickskip.nickskip_module import _load_data, _save_data
from msgbot.bot_commands.commands_config import PREFIX_MYUNGDANG_ADD, PREFIX_MYUNGDANG_DELETE, PREFIX_MYUNGDANG_LIST, PREFIX_MYUNGDANG

# 데이터 파일 경로
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # msgbot/
DATA_FILE_DIR = os.path.join(BASE_DIR, "data_custom_myungdang.json")


def record_to_data_file(datadir, com, ans):
    dat = _load_data(datadir)
    dat[com] = ans
    _save_data(datadir, dat)


def add_myung(new_myung):
    myungdang_arr = _load_data(DATA_FILE_DIR)["myungdang"]

    space = "\u200b" * 500

    if new_myung not in myungdang_arr:
        myungdang_arr.append(new_myung)
        record_to_data_file(DATA_FILE_DIR, "myungdang", myungdang_arr)
        res_text = f'[루시] 명당 등록 완료: {new_myung}\n{space}\n현재 등록된 명당 목록\n{",".join(myungdang_arr)}'
        return res_text
    else:
        res_text = f'[루시] 이미 등록된 명당입니다: {new_myung}\n{space}\n현재 등록된 명당 목록\n{",".join(myungdang_arr)}'
        return res_text


def delete_myung(new_myung):
    myungdang_arr = _load_data(DATA_FILE_DIR)["myungdang"]

    space = "\u200b" * 500

    if new_myung in myungdang_arr:
        idx = myungdang_arr.index(new_myung)
        del myungdang_arr[idx]
        record_to_data_file(DATA_FILE_DIR, "myungdang", myungdang_arr)
        res_text = f'[루시] 명당 삭제 완료: {new_myung}\n{space}\n현재 등록된 명당 목록\n{",".join(myungdang_arr)}'
        return res_text
    else:
        res_text = f'[루시] 등록되어있지 않은 명당입니다: {new_myung}\n{space}\n현재 등록된 명당 목록\n{",".join(myungdang_arr)}'
        return res_text


def list_myung():
    myungdang_arr = _load_data(DATA_FILE_DIR)["myungdang"]

    space = "\u200b" * 500

    if len(myungdang_arr) == 0:
        res_text = f'[루시] 등록된 명당이 없습니다.\n{space}'
        return res_text

    res_text = f'[루시] 현재 등록된 명당 목록\n{space}\n{",".join(myungdang_arr)}'
    return res_text


def choose_myung(sender):
    myungdang_arr = _load_data(DATA_FILE_DIR)["myungdang"]

    if len(myungdang_arr) == 0:
        return f"[루시] 등록된 명당이 없습니다.\n@명당등록 명령어로 명당을 추가해주세요!"

    t = random.randint(0, len(myungdang_arr) - 1)
    return f"{sender}님!\n추천 명당은 [{myungdang_arr[t]}] 입니다~(안떠도 일단 제탓은 아님)"


def handle_message(chat):
    if any(prefix in chat.message.msg for prefix in PREFIX_MYUNGDANG_ADD):
        new_myung = chat.message.msg.split(" ", 1)[1] if len(chat.message.msg.split(" ")) > 1 else ""

        if new_myung:
            res = add_myung(new_myung)
            chat.reply(res)
        else:
            chat.reply("명당을 입력해 주세요.")

    elif any(prefix in chat.message.msg for prefix in PREFIX_MYUNGDANG_DELETE):
        new_myung = chat.message.msg.split(" ", 1)[1] if len(chat.message.msg.split(" ")) > 1 else ""

        if new_myung:
            res = delete_myung(new_myung)
            chat.reply(res)
        else:
            chat.reply("삭제할 명당을 입력해 주세요.")

    elif any(prefix in chat.message.msg for prefix in PREFIX_MYUNGDANG_LIST):
        res = list_myung()
        chat.reply(res)

    elif any(prefix in chat.message.msg for prefix in PREFIX_MYUNGDANG):
        res = choose_myung(chat.sender.name)
        chat.reply(res)
