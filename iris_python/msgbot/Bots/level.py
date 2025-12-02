import requests
import json
from urllib import parse
import math
import numpy as np
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import recordnick, recommendnick, comma, get_yesterday_date
from msgbot.Bots.guk_data.sungbi_levdata import DATA_AFTER_210, DATA_101_TO_209, DATA_1_TO_100

def getexp(index):
    if index > 209:
        e = DATA_AFTER_210[index - 210]
    elif index > 100:
        e = DATA_101_TO_209[index - 101]
    else:
        e = DATA_1_TO_100[index - 1]
    return int(e)

def sum_cnt(index1, index2):
    n = 0
    for ii in range(int(index1), int(index2)):
        if ii > 209:
            n = n + DATA_AFTER_210[ii - 210]
        elif ii > 100:
            n = n + DATA_101_TO_209[ii - 101]
        else:
            n = n + DATA_1_TO_100[ii - 1]
    return int(n)

def unitExp(remaintonext):
    tempNum = remaintonext/10000
    unit = f"약 {int((math.ceil(remaintonext/10000)))}만"
    jo = 0
    yuk = 0
    man = 0
    if tempNum > 100000000:
        man = int(tempNum%10000)
        tempNum = tempNum/10000
        yuk = int(tempNum%10000)
        tempNum = tempNum/10000
        jo = int(tempNum%10000)
        if yuk == 0 and man == 0:
            unit = f"{jo}조 "
        elif yuk == 0:
            unit = f"{jo}조 {man}만"
        elif man == 0:
            unit = f"{jo}조 {yuk}억"
        else:
            unit = f"{jo}조 {yuk}억 {man}만"
    elif tempNum > 10000:
        man = int(tempNum%10000)
        tempNum = tempNum/10000
        yuk = int(tempNum%10000)
        if man == 0:
            unit = f"{yuk}억"
        else:
            unit = f"{yuk}억 {man}만"
    elif tempNum > 100:
        man = int(tempNum%10000)
        unit = f"{man}만"
    return unit

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


def levelsearch(nick, sender, nextlev, date):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        try:
            recordnick(sender, nick)
            
            ocid = search_api_ocid(nick)

            levurl = f"https://open.api.nexon.com/maplestory/v1/character/basic?ocid={ocid}"

            ress = f"[{nick}]\n"

            if "최근" in date:
                ress = ress + "(검색 기준: 실시간)\n"
            else:
                levurl = levurl + f"&date={date}"
                ress = ress + f"(검색 기준: {date})\n"

            s2 = search_maple_api(levurl)
            
            level = s2["character_level"]

            exp = s2["character_exp"]

            space = "\u200b" * 500

            if level is None:
                return "x"
            elif level > 299:
                return f"[{nick}]\nLv.{level}"
            else:
                per = round((exp / getexp(level)*100), 3)
                remaintonext = 0
                remaintomax = 0

                nl = 0
                if np.nan == nextlev or nextlev is None or nextlev == "":
                    nl =  1
                elif int(nextlev) < (level + 1):
                    nl =  1
                else:
                    nl = int(nextlev) - level
                
                if nl > 1:
                    remaintomax = sum_cnt(level, int(level + nl)) - exp
                    if (math.ceil(remaintomax/10000000000000000)-1) > 0:
                        return f"{ress}Lv.{level}({per}%)\n다음 레벨까지 경험치\n{unitExp(remaintonext)}\n{nl}레벨까지 : {math.ceil(remaintomax/10000000000000000)-1}경 {(math.ceil(remaintomax/1000000000000)-(math.ceil(remaintomax/10000000000000000)-1)*10000)-1}조 {math.ceil(remaintomax/100000000)-(math.ceil((remaintomax/1000000000000)-1)*10000)-1}억{space}\n\nSpecial Thanks 정쿠,우락키네"
                    else:
                        return f"{ress}Lv.{level}({per}%)\n다음 레벨까지 경험치\n{unitExp(remaintonext)}\n{nl}레벨까지 : {(math.ceil(remaintomax/1000000000000)-(math.ceil(remaintomax/10000000000000000)-1)*10000)-1}조 {math.ceil(remaintomax/100000000)-(math.ceil((remaintomax/1000000000000)-1)*10000)-1}억{space}\n\nSpecial Thanks 정쿠,우락키네"   
                else:
                    remaintonext = getexp(level) - exp
                    remaintomax = sum_cnt(level, 300) - exp
                    if (math.ceil(remaintomax/10000000000000000) - 1) > 0:
                        return f"{ress}Lv.{level}({per}%)\n다음 레벨까지 경험치\n{unitExp(remaintonext)}\n만렙까지 : {math.ceil(remaintomax/10000000000000000)-1}경 {(math.ceil(remaintomax/1000000000000)-(math.ceil(remaintomax/10000000000000000)-1)*10000)-1}조 {math.ceil(remaintomax/100000000)-(math.ceil((remaintomax/1000000000000)-1)*10000)-1}억{space}\n\nSpecial Thanks 정쿠,우락키네"
                    else:
                        return f"{ress}Lv.{level}({per}%)\n다음 레벨까지 경험치\n{unitExp(remaintonext)}\n만렙까지 : {(math.ceil(remaintomax/1000000000000)-(math.ceil(remaintomax/10000000000000000)-1)*10000)-1}조 {math.ceil(remaintomax/100000000)-(math.ceil((remaintomax/1000000000000)-1)*10000)-1}억{space}\n\nSpecial Thanks 정쿠,우락키네"

        except Exception as e:
            return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다."


def handle_message(chat):
    if "@레벨" in chat.message.msg or "!레벨" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        nick = ""
        nextlev = ""
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name)
        else:
            nick = parts[1]
            if len(parts) < 3:
                nextlev = ""
            else:
                nextlev = parts[2]
        
        res = levelsearch(nick, chat.sender.name, nextlev,"최근")
        if res == "x":
            chat.reply(f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.")
        else:
            chat.reply(res)
