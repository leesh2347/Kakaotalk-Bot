import requests
import json
from datetime import date, timedelta
from urllib import parse
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import recordnick, recommendnick, comma

#api ocid 검색
def search_api_ocid(nick):
    headers = {
        "Content-Type": "application/json",
        "x-nxopen-api-key": "live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59"
    }
    res = requests.get("https://open.api.nexon.com/maplestory/v1/id", params={"character_name": nick}, headers=headers)
    res.raise_for_status()     # 200이 아니면 에러
    #print(res.text)
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
    #print(res.text)
    s2 = json.loads(res.text)
    return s2

def murung(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        if " " in nick:
            #무릉 다수 검색
            nickarr = nick.split(" ")
            res = ""
            nickarrlen = len(nickarr)
            if nickarrlen > 6:
                nickarrlen = 6
            text = ""
            for i in range(0, nickarrlen):
                try:
                    text = ""
                    ocid = search_api_ocid(nickarr[i])
                    t = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/dojang?ocid={ocid}")
                    if t["dojang_best_floor"] is not None:
                        text = f'{t["dojang_best_floor"]}층'
                except Exception as e:
                    text = "(기록없음)"
                res = res + f"[{nickarr[i]}] {text}\n"
            return res
        else:
            #무릉 한명 검색
            try:
                recordnick(sender, nick)
                ocid = search_api_ocid(nick)
                t = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/dojang?ocid={ocid}")
                if t["dojang_best_floor"] is not None:
                    return f'[{nick}]\n{t["world_name"]}/{t["character_class"]}\n층수: {t["dojang_best_floor"]}층\n시간: {Math.floor(t["dojang_best_time"]/60)}분 {(t["dojang_best_time"]%60)}초'
                else:
                    return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다."
            except Exception as e:
                return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다."

def union(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        try:
            recordnick(sender, nick)

            today = date.today()
            # 어제
            d = today - timedelta(days=1)
            # "YYYY-MM-DD" 형태로 포맷
            d2 = d.strftime("%Y-%m-%d")

            ocid = search_api_ocid(nick)
            t = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/user/union?ocid={ocid}")

            ans2 = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/ranking/union?ocid={ocid}&date={d2}")
            t2 = ans2["ranking"][0]

            if t["union_grade"] is not None:
                atk = t2["union_power"]
                coin = int(int(atk)*864/1000000000)
                return f'[{nick}]\n{t["union_grade"]}\nLv.{t["union_level"]}\n전투력: {comma(atk)}\n일일 코인 수급량: {coin}개'
            else:
                return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다."
        except Exception as e:
            return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다."

def achieve(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        try:
            recordnick(sender, nick)

            ocid = search_api_ocid(nick)
            answer = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/ranking/achievement?ocid={ocid}")
            t = answer["ranking"][0]
            return f'[{nick}]\n{t["trophy_grade"]} 등급\n{comma(t["trophy_score"])}점'
        except Exception as e:
            return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다."


def artifact(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        try:
            recordnick(sender, nick)

            ocid = search_api_ocid(nick)
            answer = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/user/union?ocid={ocid}")
            t = answer["union_artifact_level"]
            t2 = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/user/union-artifact?ocid={ocid}")

            a = ""

            for i in range(0, len(t2["union_artifact_effect"])):
                a = a + f'\n{t2["union_artifact_effect"][i]["name"]}  (Lv.{t2["union_artifact_effect"][i]["level"]})'
            space = "\u200b" * 500
            return f'[{nick}]\n아티팩트 레벨: Lv.{t}\n{space}\n----보유중인 효과----{a}'
        except Exception as e:
            return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다."



def handle_message(chat):
    if "@무릉" in chat.message.msg or "!무릉" in chat.message.msg:
        nick = chat.message.msg[4:]
        if nick is None or nick == "":
            nick = recommendnick(chat.sender.name)
        res = murung(nick, chat.sender.name)
        chat.reply(res)

    if "@유니온" in chat.message.msg or "!유니온" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name)
        else:
            nick = parts[1]
        res = union(nick, chat.sender.name)
        chat.reply(res)

    if "@업적" in chat.message.msg or "!업적" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name)
        else:
            nick = parts[1]
        res = achieve(nick, chat.sender.name)
        chat.reply(res)

    if "@아티팩트" in chat.message.msg or "!아티팩트" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name)
        else:
            nick = parts[1]
        res = artifact(nick, chat.sender.name)
        chat.reply(res)