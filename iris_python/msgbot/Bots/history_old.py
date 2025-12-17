import requests
import json
from urllib import parse
from datetime import datetime, timedelta
import math
import numpy as np
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import recordnick, recommendnick, comma, get_yesterday_date, history_db_save, history_db_load

def graph(a, a2, d, l):
    """
    a  : 값 배열
    a2 : 값 옆에 붙는 문자열 배열
    d  : 라벨(label) 배열
    l  : 그래프 길이
    """
    result = []
    for i in range(len(a)):
        _ = 100  # JS 코드의 fill(100)과 동일
        bar_full = int(l * a[i] / _)

        # 8단계 그래픽 문자
        blocks = list("▏▎▍▌▋▊▉█")

        # 소수점 부분
        fractional = (a[i] / _ % 1) * 8
        idx = int(fractional + 0.5)
        if idx >= len(blocks):
            idx = len(blocks) - 1

        bar = "█" * bar_full + blocks[idx]
        line = f"{d[i]}\n|{bar} {a2[i]}({a[i]}%)"
        result.append(line)

    return "\n".join(result)


def graph2(a, d, l):
    """
    a : 값 배열
    d : 라벨(label) 배열
    l : 그래프 길이
    """
    _max = max(a)

    # 실제 반환은 그래프가 아니라 "이름: Lv.x" 라인만 출력
    result = []
    for i in range(len(a)):
        result.append(f"{d[i]}: Lv.{a[i]}")
    return "\n".join(result)

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


def hist_search(nick, datearr, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
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
                        islevup = "\n🎊 레벨업 축하합니다! 🎊"
                        lvv = data["character_level"]

                if data["character_level"] > 299:
                    ismaxup = 1
                    break

            #print(f"arr: {arr}")
            #print(f"arr2: {arr2}")
            #print(f"darr: {darr}")

            history_db_save(nick, arr2[-1], darr[-1])

            min = arr[0]
            max = arr[-1]

            if min > max:
                max = max + 100

            div = (max-min) / len(arr)

            if div == 0:
                lvup = 999999
            else:
                lvup = math.ceil((100 - arr[-1]) / div)
            
            if ismaxup == 1:
                return f"[{nick}]님의 경험치 히스토리\n({datearr[-1]} 기준)\n\n{graph(arr,arr2,darr,5)}\n\n🏆 만렙 달성 축하합니다! 🏆"
            elif div == 0:
                return f"[{nick}]님의 경험치 히스토리\n({datearr[-1]} 기준)\n\n{graph(arr,arr2,darr,5)}\n\n예상 다음 레벨업: 메이플 섭종 후{islevup}"
            else:
                return f"[{nick}]님의 경험치 히스토리\n({datearr[-1]} 기준)\n\n{graph(arr,arr2,darr,5)}\n\n예상 다음 레벨업: {lvup}일 후{islevup}"

        except Exception as e:
            raise
            return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다."

def levhist(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        try:
            recordnick(sender, nick)
            
            data_lv = history_db_load(nick)

            arr = []
            darr = []

            if len(data_lv) < 1:
                return f"[{nick}]\n2024.7.17 이후 히스토리 기록이 없는 캐릭터명 입니다."
            else:
                for i in range(0, len(data_lv)):
                    darr.append(data_lv[i]["date"])
                    arr.append(data_lv[i]["level"])

                return f"[{nick}]님의 레벨 히스토리\n\n{graph2(arr,darr,5)}"

        except Exception as e:
            raise
            return f"[{nick}]\n2024.7.17 이후 히스토리 기록이 없는 캐릭터명 입니다."


def handle_message(chat):

    if "@히스토리" in chat.message.msg or "!히스토리" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        nick = parts[1] if len(parts) > 1 else None
        if nick is None:
            nick = recommendnick(chat.sender.name)
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




    if "@레벨히스토리" in chat.message.msg or "!레벨히스토리" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        nick = ""
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name)
        else:
            nick = parts[1]
        print(nick)
        res = levhist(nick, chat.sender.name)
        chat.reply(res)
