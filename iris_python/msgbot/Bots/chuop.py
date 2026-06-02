import requests
import json
import math
import numpy as np
from datetime import date, timedelta
from urllib import parse
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import recordnick, recommendnick, comma
from msgbot.Bots.chuop_data.chuop_data_module import WEAPONS, ROOTABYSS, ABSOLABS, ARCANE, GENESIS, WEAPON_ZERO, ZERO_CHUOP

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


def jaehoek(nick, issmall, mari, sender):
    if nick is None or nick == "":
        return "재획비 효율 계산기 사용법: @재획 (닉네임) (간당 마리수)\n\n본섭 재획비가 얼마일 때부터 마시면 이득인지 효율을 계산해 줍니다.\n※간당 마리수는 만마리 단위로 입력해 주세요.(15000마리일 경우 1.5)\n※재획비를 마시지 않은 상태일 때 정확한 계산이 가능합니다.\n캐릭터의 드메 스탯은 약 15분 전 시점을 기준으로 반영됩니다."
    else:
        try:
            recordnick(sender, nick)

            ocid = search_api_ocid(nick)

            #레벨 검색
            lev_data = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/basic?ocid={ocid}")
            lev = lev_data["character_level"]

            #드, 메 값 검색(스탯)
            stat_data = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/stat?ocid={ocid}")

            drop = float(stat_data["final_stat"][28]["stat_value"])
            mehoek = float(stat_data["final_stat"][29]["stat_value"])

            if mari > 1000:
                mari = mari / 10000
            ddrop = 60 * (100 + drop) / 100
            jddrop = 60 * (120 + drop) / 100

            if ddrop > 100:
                ddrop = 100
            if jddrop > 100:
                jddrop = 100
            
            nojae = math.ceil(lev * (100 + mehoek) * mari * 7.5 * ddrop / 10000)
            jae = math.ceil(lev * (100 + mehoek) * mari * 7.5 * jddrop / 10000)

            if issmall == 1:
                return f"🍾소형 재획비 효율 계산기🍾\n\n재획비 사용X: 간당 {nojae}만\n재획비 사용: 간당 {jae}만\n\n소재비 사용 추천 시세: {(jae-nojae)/2}만▼"
            else:
                return f"🍾재획비 효율 계산기🍾\n\n재획비 사용X: 간당 {nojae}만\n재획비 사용: 간당 {jae}만\n\n재획비 사용 추천 시세: {(jae-nojae)*2}만▼\n(1시간 30분 사냥시): {math.ceil((jae-nojae)*1.5)}만▼\n(1시간 사냥시): {(jae-nojae)}만▼"

        except Exception as e:
            return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다."

def printchuop(series, name):

    space = "\u200b" * 500

    if series=="제로":
        if name in WEAPON_ZERO:
            return ZERO_CHUOP[WEAPON_ZERO.index(name)]
        else:
            print = ""
            for i in range(0, len(WEAPON_ZERO)):
                print = print + f"\n\n*{ZERO_CHUOP[i]}"
            return f"제로 무기 추옵\n{space}{print}"
        
    elif series=="파프":
        if name is not None and name != "":
            name = name.upper()
        if name in WEAPONS:
            return ROOTABYSS[WEAPONS.index(name)]
        else:
            print = ""
            for i in range(0, len(WEAPONS)):
                print = print + f"\n\n*{WEAPONS[i]}\n{ROOTABYSS[i]}"
            return f"파프니르 무기 추옵\n{space}{print}"

    elif series=="앱솔":
        if name is not None and name != "":
            name = name.upper()
        if name in WEAPONS:
            return ABSOLABS[WEAPONS.index(name)]
        else:
            print = ""
            for i in range(0, len(WEAPONS)):
                print = print + f"\n\n*{WEAPONS[i]}\n{ABSOLABS[i]}"
            return f"앱솔랩스 무기 추옵\n{space}{print}"

    elif series=="아케인":
        if name is not None and name != "":
            name = name.upper()
        if name in WEAPONS:
            return ARCANE[WEAPONS.index(name)]
        else:
            print = ""
            for i in range(0, len(WEAPONS)):
                print = print + f"\n\n*{WEAPONS[i]}\n{ARCANE[i]}"
            return f"아케인셰이드 무기 추옵\n{space}{print}"

    elif series=="제네":
        if name is not None and name != "":
            name = name.upper()
        if name in WEAPONS:
            return GENESIS[WEAPONS.index(name)]
        else:
            print = ""
            for i in range(0, len(WEAPONS)):
                print = print + f"\n\n*{WEAPONS[i]}\n{GENESIS[i]}"
            return f"제네시스 무기 추옵\n{space}{print}"

    else:
        return f"추옵 검색 사용법{space}\n\n사용법: !추옵 (장비종류) (무기종류)\n\n장비 종류: 파프, 앱솔, 아케인, 제네, 제로\n\n무기 종류: {', '.join(WEAPONS)}\n\n제로 무기 종류: 1형~10형\n\n*잘못된 값 입력 시 해당 장비 종류 모두를 출력합니다."

def armor(msg):
    msgg = msg.split(" ")
    analyze = []
    try:
        del msgg[0]

        for i in range(0, len(msgg)):
            analyze.append(float(msgg[i]))
        
        basic = analyze[1]
        real = 0
        real = basic
        for i in range(2, len(analyze)):
            real = ((real / 100) + (analyze[i] / 100) - (real * analyze[i]) / 10000) * 100
        rate = 1 - ((analyze[0] / 100) * (1 - (real / 100)))
        rate = rate * 100
        if rate < 0:
            rate = 0
        return f"표기 방무: {basic}%,  실 방무: {round(real, 2)}%\n보스 방어율: {analyze[0]}%, 보스에게 딜량: {round(rate, 2)}%"

    except Exception as e:
        print(e)
        return "방무 계산기 사용법:\n@방무 (보스방어율) (표기방무) (스킬방무1) (스킬방무2) ...."

def symbol(start, end):
    total_req = 0
    total_meso = [0,0,0,0,0,0,0]
    total_day_se = 0
    total_day = 0
    if np.isnan(start) or np.isnan(end):
        return "어센틱심볼 계산기 사용법: @어센틱 (시작레벨) (끝레벨)\n\n지역별 심볼세 합과 일퀘 일수를 계산해 줍니다."
    elif start >= 1 and end <= 11:
        # 요구 메소 = floor(필요 성장치 * 1.8 * ((지역상수 + 6) - (레벨 - 1)/3)) * 100000
        # 지역 상수 : 세르 1 호텔 2 오디움 3 도원경 4 아르테리아 5 카르시온 6 탈라하트 0 기어드락 0
        #그랜드 계산식 = 필요 성장치 × 1.8 × {(5×지역상수 +22) - (3×레벨 -1)÷9} * 100000
        
        for i in range(start, end):
            total_req += 9*i*i + 20*i
            total_meso[0] += (math.floor((9*i*i + 20*i) * 1.8 * (7 - (i - 1)/3)) * 100000)
            total_meso[1] += (math.floor((9*i*i + 20*i) * 1.8 * (8 - (i - 1)/3)) * 100000)
            total_meso[2] += (math.floor((9*i*i + 20*i) * 1.8 * (9 - (i - 1)/3)) * 100000)
            total_meso[3] += (math.floor((9*i*i + 20*i) * 1.8 * (10 - (i - 1)/3)) * 100000)
            total_meso[4] += (math.floor((9*i*i + 20*i) * 1.8 * (11 - (i - 1)/3)) * 100000)
            total_meso[5] += (math.floor((9*i*i + 20*i) * 1.8 * (12 - (i - 1)/3)) * 100000)
            total_meso[6] += (math.floor((9*i*i + 20*i) * 1.8 * ((5 * 0 + 22) - (3 * i - 1)/9)) * 100000)
            total_meso[7] += (math.floor((9*i*i + 20*i) * 1.8 * ((5 * 1 + 22) - (3 * i - 1)/9)) * 100000)
        
        total_day_se = math.ceil(total_req / 20)
        total_day = math.ceil(total_req / 10)

        return "\n".join([
            f"{start}레벨에서 {end}레벨까지",
            f"요구량: {total_req}",
            f"세르니움: {comma(total_meso[0])}메소",
            f"아르크스: {comma(total_meso[1])}메소",
            f"오디움: {comma(total_meso[2])}메소",
            f"도원경: {comma(total_meso[3])}메소",
            f"아르테리아: {comma(total_meso[4])}메소",
            f"카르시온: {comma(total_meso[5])}메소",
            f"탈라하트: {comma(total_meso[6])}메소",
            f"기어드락: {comma(total_meso[7])}메소",
            "\u200b"*500,
            "모든 추가 퀘스트 완료시 필요 기간",
            "",
            f"세르니움: {total_day_se}일",
            f"아르크스: {total_day}일",
            f"오디움: {total_day}일",
            f"도원경: {total_day}일",
            f"아르테리아: {total_day}일",
            f"카르시온: {total_day}일",
            f"탈라하트: {total_day}일",
            f"기어드락: {total_day}일"
        ])

    else:
        return "어센틱심볼 레벨이 정확하게 입력되었는지 확인해 주세요.\n어센틱 심볼 레벨은 1~11까지만 입력 가능합니다."


def handle_message(chat):
    if "@추옵" in chat.message.msg or "!추옵" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 3:
            name = ""
        else:
            name = parts[2]
        if len(parts) < 2:
            series = ""
        else:
            series = parts[1]
        res = printchuop(series, name)
        chat.reply(res)

    if "@재획" in chat.message.msg or "!재획" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 3:
            nick = ""
            mari = 0
        else:
            nick = parts[1]
            mari = float(parts[2])
        res = jaehoek(nick, 0, mari, chat.sender.name)
        chat.reply(res)

    if "@소재획" in chat.message.msg or "!소재획" in chat.message.msg or "!소재비" in chat.message.msg or "!소재비" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 3:
            nick = ""
            mari = 0
        else:
            nick = parts[1]
            mari = float(parts[2])
        res = jaehoek(nick, 1, mari, chat.sender.name)
        chat.reply(res)

    if "@방무" in chat.message.msg or "!방무" in chat.message.msg:
        res = armor(chat.message.msg)
        chat.reply(res)

    if "@어센틱" in chat.message.msg or "!어센틱" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 3:
            start = -1
            end = -1
        else:
            start = int(parts[1])
            end = int(parts[2])
        res = symbol(start, end)
        chat.reply(res)