import requests
import json
import os
from datetime import date, timedelta
from urllib import parse
from bs4 import BeautifulSoup

from msgbot.Bots.maplegg import maplegg
from msgbot.Bots.murung_and_union import murung, union, achieve, artifact
from msgbot.Bots.level import levelsearch
from msgbot.Bots.mechang import mechang
from msgbot.Bots.sixth_skill import hexasearch, sixth_calc
from msgbot.Bots.stat import stat
from msgbot.Bots.history import hist_search, histdatearr
from msgbot.Bots.chuop import symbol

# banned_rooms.json의 절대 경로 계산
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # msgbot/
FILTER_FILE = os.path.join(BASE_DIR, "banned_rooms.json")

# JSON 파일 로드
with open(FILTER_FILE, "r", encoding="utf-8") as f:
    filter_data = json.load(f)

# 금지 방 목록 로드
ALLOW_ROOMS = filter_data["banrooms"]["talk"]

#LLM API 호출
#자연어 -> 봇 명령어 변환
def call_llm(question):
    jsondata = {
        "question": question,
        "use_tools": "true"
    }

    url = "http://127.0.0.1:8000/ask"

    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "Mozilla",
        "Accept": "*/*"
    }

    res = requests.post(url, headers=headers, json=jsondata)
    res.raise_for_status()
    return res.json()

#LLM의 명령어 분류를 실제로 실행시키기
def process_result(info, args, sender):
    if info=="캐릭터":
        return maplegg(args,sender)
    elif info=="무릉":
        return murung(args,sender)
    elif info=="유니온":
        return union(args,sender)
    elif info=="업적":
        return achive(args,sender)
    elif info=="아티팩트":
        return artifact(args,sender)
    elif info=="메창":
        return mechang(args,sender)
    elif info=="헥사":
        return hexasearch(args,sender)
    elif info=="스탯":
        return stat(args,sender)
    elif info=="경험치":
        arr = args.split(", ")
        return levelsearch(arr[0],sender,"",arr[1])
    elif info=="히스토리":
        arr = args.split(", ")
        nick = arr[0]
        if arr[1] =="최근":
            today = datetime.now()
            # 자정 ~ 01:00 사이일 경우 한국식 로직을 반영해 날짜 보정
            if today.hour < 1:
                today -= timedelta(days=9)
            else:
                today -= timedelta(days=8)
            
            yyyyMmDd = today.strftime("%Y-%m-%d")
            daarr = histdatearr(yyyyMmDd)
            return hist_search(nick, daarr, sender)
        else:
            darr = []
            for i in range(1, len(arr)):
                darr.append(arr[i])
            return hist_search(nick, darr, sender)
    elif info=="6차코강":
        arr = args.split(", ")
        if arr[0] == 0:
            return sixth_calc("x", "x")
        else:
            return sixth_calc(arr[0], arr[1])
    elif info=="어센틱":
        arr = args.split(", ")
        if arr[0] == 0:
            return symbol("x", "x")
        else:
            return symbol(arr[0], arr[1])
    elif info=="없음":
        return "[루시] 죄송해요. 잘 알아듣지 못했어요."
    else:
        return f"[루시] 미구현된 기능입니다. {info} {args}"


def handle_message(chat):
    if chat.room.name in ALLOW_ROOMS:
        if chat.message.msg.startswith("루시 "):
            msg = chat.message.msg.replace("루시 ", "", 1)

            try:
                results = call_llm(msg)

                r = process_result(results.get("정보"), results.get("옵션"), chat.sender.name)

                chat.reply(r)

            except Exception as e:
                chat.reply(f"AI 분석 서버 쪽에 문제가 발생했습니다. {str(e)}")