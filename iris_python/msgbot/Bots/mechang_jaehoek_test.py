import requests
import json
from urllib import parse

from io import BytesIO
from datetime import datetime, timedelta
import math
import numpy as np
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import recordnick, recommendnick, comma, get_yesterday_date, history_db_save, history_db_load
from msgbot.bot_commands.commands_config import PREFIX_HISTORY, PREFIX_LEVEL_HISTORY

def calc_min_threshold(level):
    return 3.5 * math.exp(-0.0549 * (level - 270)) + 0.4

def histdatearr(datestr):
    datearr = []

    today = datetime.strptime(datestr, "%Y-%m-%d")

    for _ in range(7):
        today += timedelta(days=1)
        d2 = today.strftime("%Y-%m-%d")
        datearr.append(d2)

    return datearr

#api ocid 검색
def search_api_ocid(nick):
    headers = {
        "Content-Type": "application/json",
        "x-nxopen-api-key": "live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59"
    }
    res = requests.get("https://open.api.nexon.com/maplestory/v1/id", params={"character_name": nick}, headers=headers)
    res.raise_for_status()     # 200이 아니면 에러
    ocid1 = json.loads(res.text)
    ocid2 = ocid1["ocid"]
    return ocid2

#api 검색
def search_maple_api(url):
    headers = {
        "Content-Type": "application/json",
        "x-nxopen-api-key": "live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59"
    }
    res = requests.get(url, headers=headers)
    res.raise_for_status()     # 200이 아니면 에러
    s2 = json.loads(res.text)
    return s2

def calc_mechang_score(exp_rates, levels):
    """
    exp_rates : [float] 경험치 퍼센트 배열
    levels    : [int]   레벨 배열
    return    : (score:int, detail:str)
    """
    base_lv = levels[-1]
    MIN_THRESHOLD = calc_min_threshold(base_lv)
    # 의미 있는 재획 기준 (%)
    deltas = []

    for i in range(1, len(exp_rates)):
        if levels[i] > levels[i-1]:
            delta = (100 - exp_rates[i-1]) + exp_rates[i]
        else:
            delta = exp_rates[i] - exp_rates[i-1]
        deltas.append(delta)

    # A. 재획 일수 점수
    active_days = sum(1 for d in deltas if d >= MIN_THRESHOLD)
    ratio = active_days / len(deltas)
    score_a = ratio * 50

    # B. 연속 재획 점수
    streak = max_streak = 0
    for d in deltas:
        if d >= MIN_THRESHOLD:
            streak += 1
            max_streak = max(max_streak, streak)
        else:
            streak = 0
    score_b = (max_streak / len(deltas)) * 25

    # C. 안정성 점수
    valid_deltas = [d for d in deltas if d >= MIN_THRESHOLD]
    if len(valid_deltas) >= 2:
        std = np.std(valid_deltas)
        if std <= 1:
            score_c = 25
        elif std <= 2:
            score_c = 18
        elif std <= 3:
            score_c = 10
        else:
            score_c = 0
    else:
        score_c = 0

    raw_score = score_a + score_b + score_c

    # 레벨 가중치
    lv = levels[-1]
    if lv >= 285:
        weight = 1.3
    elif lv >= 280:
        weight = 1.2
    elif lv >= 275:
        weight = 1.1
    else:
        weight = 1.0

    final_score = min(100, int(raw_score * weight))

    detail = (
        f"메창 점수: {final_score}점\n"
        f"- 최근 재획 {active_days}/{len(deltas)}일\n"
        f"- 최대 연속 재획 {max_streak}일"
    )

    return final_score, detail

def hist_search(nick, datearr, sender):
    if nick is None or nick == "":
        return {
                "img_bytes":"",
                "text_print":"닉네임을 입력해 주세요"
            }
    else:
        try:
            recordnick(sender, nick)
            
            ocid = search_api_ocid(nick)

            arr = []

            arr2 = []

            darr = []

            ismaxup = 0

            islevup = ""

            lvv = 0

            for i in range(0, len(datearr)):
                data = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/basic?ocid={ocid}&date={datearr[i]}")

                darr.append(f"{datearr[i].split('-')[1]}월 {datearr[i].split('-')[2]}일")
                arr.append(float(data["character_exp_rate"]))
                arr2.append(int(data["character_level"]))

                if lvv < data["character_level"]:
                    if lvv != 0:
                        lvv = data["character_level"]

                if data["character_level"] > 299:
                    ismaxup = 1
                    break

            #print(f"arr: {arr}")
            #print(f"arr2: {arr2}")
            #print(f"darr: {darr}")

            mechang_score, mechang_text = calc_mechang_score(arr, arr2)

            res_text = f"메창점수 테스트:{mechang_score}\n\n{mechang_text}"


            return res_text

        except Exception as e:
            raise
            return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다."

def handle_message(chat):

    if "!@히스테스트" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        nick = parts[1] if len(parts) > 1 else None
        if nick is None:
            nick = recommendnick(chat.sender.name, chat.room.name)
        if nick == "":
            chat.reply("닉네임을 입력해 주세요.")
        else:
            today = datetime.now()
            # 자정 ~ 01:00 사이일 경우 한국식 로직을 반영해 날짜 보정
            if today.hour < 1:
                today -= timedelta(days=9)
            else:
                today -= timedelta(days=8)
            
            yyyyMmDd = today.strftime("%Y-%m-%d")
            daarr = histdatearr(yyyyMmDd)
            #print(daarr)
            res = hist_search(nick, daarr, chat.sender.name)
            chat.reply(res)