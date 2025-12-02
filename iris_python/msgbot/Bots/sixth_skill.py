import requests
import json
import math
from urllib import parse
import numpy as np
from bs4 import BeautifulSoup
from msgbot.Bots.hexa_data.hexa_levdata import MAX_ERDA, MAX_PIECE, JANUS_MAX_ERDA, JANUS_MAX_PIECE, HEXA_DATA, ORIGIN_DATA, MASTER_DATA, SKILL_DATA, GONGYONG_DATA
from msgbot.Bots.maple_nickskip.nickskip_module import recordnick, recommendnick, comma, get_yesterday_date

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

def hexasearch(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        try:
            recordnick(sender, nick)

            d2 = get_yesterday_date()

            ocid = search_api_ocid(nick)
            answer = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/hexamatrix?ocid={ocid}&date={d2}")
            t = answer["character_hexa_core_equipment"]

            erda_a = [0, 0, 0, 0]
            piece_a = [0, 0, 0, 0]
            sum_erda = 2
            sum_piece = 0

            janus_erda = 0
            janus_piece = 0

            origintext = ""
            mastertext = ""
            skilltext = ""
            publictext = ""

            for i in range(0, len(t)):
                for j in range(0, t[i]["hexa_core_level"]):
                    if j > 0 and t[i]["hexa_core_type"] == "스킬 코어":
                        erda_a[0] = erda_a[0] + ORIGIN_DATA["기운"][j]
                        piece_a[0]=piece_a[0] + ORIGIN_DATA["조각"][j]
                    elif t[i]["hexa_core_type"]=="마스터리 코어":
                        erda_a[1] = erda_a[1] + MASTER_DATA["기운"][j]
                        piece_a[1] = piece_a[1] + MASTER_DATA["조각"][j]
                    elif t[i]["hexa_core_type"] == "강화 코어":
                        erda_a[1] = erda_a[1] + SKILL_DATA["기운"][j]
                        piece_a[1] = piece_a[1] + SKILL_DATA["조각"][j]
                    elif t[i]["hexa_core_type"] == "공용 코어":
                        erda_a[1] = erda_a[1] + GONGYONG_DATA["기운"][j]
                        piece_a[1] = piece_a[1] + GONGYONG_DATA["조각"][j]
                    if "야누스" in t[i]["hexa_core_name"]:
                        janus_erda = janus_erda + GONGYONG_DATA["기운"][j]
                        janus_piece = janus_piece + GONGYONG_DATA["조각"][j]

                if t[i]["hexa_core_type"] == "스킬 코어":
                    origintext = origintext + f'{t[i]["hexa_core_name"]}: {t[i]["hexa_core_level"]}레벨\n'
                elif t[i]["hexa_core_type"] == "마스터리 코어":
                    mastertext = mastertext + f'{t[i]["hexa_core_name"]}: {t[i]["hexa_core_level"]}레벨\n'
                elif t[i]["hexa_core_type"] == "강화 코어":
                    skilltext = skilltext + f'{t[i]["hexa_core_name"]}: {t[i]["hexa_core_level"]}레벨\n'
                elif t[i]["hexa_core_type"] == "공용 코어":
                    publictext = publictext + f'{t[i]["hexa_core_name"]}: {t[i]["hexa_core_level"]}레벨\n'

            for i in range(0, 4):
                sum_erda = sum_erda + erda_a[i]
                sum_piece = sum_piece + piece_a[i]

            return "\n".join([
                f"[{nick}]",
                "솔 야누스 포함",
                f"누적 소모 솔 에르다: {sum_erda}개",
                f"[{math.floor((sum_erda*100)/MAX_ERDA)}%] 강화 ({sum_erda}/{MAX_ERDA})",
                f"누적 소모 조각: {sum_piece}개",
                f"[{math.floor((sum_piece*100)/MAX_PIECE)}%] 강화 ({sum_piece}/{MAX_PIECE})​​​​​​​​​​​​​​​​​​​​",
                "",
                "솔 야누스 제외",
                f"누적 소모 솔 에르다: {sum_erda-janus_erda}개",
                f"[{math.floor(((sum_erda-janus_erda)*100)/(MAX_ERDA-JANUS_MAX_ERDA))}%] 강화 ({(sum_erda-janus_erda)}/{(MAX_ERDA-JANUS_MAX_ERDA)})",
                f"누적 소모 조각: {(sum_piece-janus_piece)}개",
                f"[{math.floor(((sum_piece-janus_piece)*100)/(MAX_PIECE-JANUS_MAX_PIECE))}%] 강화 ({(sum_piece-janus_piece)}/{(MAX_PIECE-JANUS_MAX_PIECE)})​​​​​​​​​​​​​​​​​​​​",
                "\u200b"*500,
                "[오리진/어센트 스킬] 강화 내역",
                origintext,
                "[마스터리 코어] 강화 내역",
                mastertext,
                "[강화 코어] 강화 내역",
                skilltext,
                "[공용 코어] 강화 내역",
                publictext
            ])

        except Exception as e:
            raise
            return f"[{nick}]\n2023.12.21 이후 기록이 없거나, 6차 전직을 완료하지 않은 캐릭터명 입니다."

def sixth_calc(start, end):
    if not isinstance(start, int) or not isinstance(end, int):
        return "6차 스킬 강화 계산기 사용법: @6차 (시작레벨) (끝레벨)\n\n필요 솔 에르다와 조각 갯수를 계산해 줍니다."
    elif (-1) < start < 30 and 0 < end < 31:
        erda_a = [0, 0, 0, 0]
        piece_a = [0, 0, 0, 0]

        for i in range(start, end):
            erda_a[0] = erda_a[0] + ORIGIN_DATA["기운"][i]
            piece_a[0] = piece_a[0] + ORIGIN_DATA["조각"][i]

            erda_a[1] = erda_a[1] + MASTER_DATA["기운"][i]
            piece_a[1] = piece_a[1] + MASTER_DATA["조각"][i]

            erda_a[2] = erda_a[2] + SKILL_DATA["기운"][i]
            piece_a[2] = piece_a[2] + SKILL_DATA["조각"][i]

            erda_a[3]=erda_a[3]+GONGYONG_DATA["기운"][i]
            piece_a[3]=piece_a[3]+GONGYONG_DATA["조각"][i]
        
        return f"오리진/어센트 스킬 {start} ~ {end}레벨 까지\n필요한 솔 에르다💎 : {erda_a[0]}개\n솔 에르다 조각💠 : {piece_a[0]}개\n\n마스터리 코어 {start} ~ {end}레벨 까지\n필요한 솔 에르다💎 : {erda_a[1]}개\n솔 에르다 조각💠 : {piece_a[1]}개\n\n강화 코어 {start} ~ {end}레벨 까지\n필요한 솔 에르다💎 : {erda_a[2]}개\n솔 에르다 조각💠 : {piece_a[2]}개\n\n공용 코어/솔 야누스 {start} ~ {end}레벨 까지\n필요한 솔 에르다💎 : {erda_a[3]}개\n솔 에르다 조각💠 : {piece_a[3]}개"
    else:
        return "시작 레벨과 끝 레벨을 제대로 입력했는지 확인해 주세요.\n레벨 범위: 0~30\n(코어가 없는 상태에서 제작하는 것을 0->1레벨 강화로 칩니다.)"

def sixth_origin_calc(start, end):
    if not isinstance(start, int) or not isinstance(end, int):
        return "오리진/어센트 스킬 계산기 사용법: @오리진 (시작레벨) (끝레벨)\n\n필요 솔 에르다와 조각 갯수를 계산해 줍니다."
    elif (-1) < start < 30 and 0 < end < 31:
        erda = 0
        piece = 0

        for i in range(start, end):
            erda = erda + ORIGIN_DATA["기운"][i]
            piece = piece + ORIGIN_DATA["조각"][i]
        
        return f"오리진/어센트 스킬 {start} ~ {end}레벨 까지\n필요한 솔 에르다💎 : {erda}개\n솔 에르다 조각💠 : {piece}개"
    else:
        return "시작 레벨과 끝 레벨을 제대로 입력했는지 확인해 주세요.\n레벨 범위: 0~30\n(코어가 없는 상태에서 제작하는 것을 0->1레벨 강화로 칩니다.)"

def sixth_master_calc(start, end):
    if not isinstance(start, int) or not isinstance(end, int):
        return "마스터리 코어 계산기 사용법: @마스터리 (시작레벨) (끝레벨)\n\n필요 솔 에르다와 조각 갯수를 계산해 줍니다."
    elif (-1) < start < 30 and 0 < end < 31:
        erda = 0
        piece = 0

        for i in range(start, end):
            erda = erda + MASTER_DATA["기운"][i]
            piece = piece + MASTER_DATA["조각"][i]
        
        return f"마스터리 코어 {start} ~ {end}레벨 까지\n필요한 솔 에르다💎 : {erda}개\n솔 에르다 조각💠 : {piece}개"
    else:
        return "시작 레벨과 끝 레벨을 제대로 입력했는지 확인해 주세요.\n레벨 범위: 0~30\n(코어가 없는 상태에서 제작하는 것을 0->1레벨 강화로 칩니다.)"

def sixth_skill_calc(start, end):
    if not isinstance(start, int) or not isinstance(end, int):
        return "강화 코어 계산기 사용법: @강화 (시작레벨) (끝레벨)\n\n필요 솔 에르다와 조각 갯수를 계산해 줍니다."
    elif (-1) < start < 30 and 0 < end < 31:
        erda = 0
        piece = 0

        for i in range(start, end):
            erda = erda + SKILL_DATA["기운"][i]
            piece = piece + SKILL_DATA["조각"][i]
        
        return f"강화 코어 {start} ~ {end}레벨 까지\n필요한 솔 에르다💎 : {erda}개\n솔 에르다 조각💠 : {piece}개"
    else:
        return "시작 레벨과 끝 레벨을 제대로 입력했는지 확인해 주세요.\n레벨 범위: 0~30\n(코어가 없는 상태에서 제작하는 것을 0->1레벨 강화로 칩니다.)"

def sixth_gongyong_calc(start, end):
    if not isinstance(start, int) or not isinstance(end, int):
        return "공용 코어 계산기 사용법: @공용 (시작레벨) (끝레벨)\n\n필요 솔 에르다와 조각 갯수를 계산해 줍니다."
    elif (-1) < start < 30 and 0 < end < 31:
        erda = 0
        piece = 0

        for i in range(start, end):
            erda = erda + GONGYONG_DATA["기운"][i]
            piece = piece + GONGYONG_DATA["조각"][i]
        
        return f"공용 코어 {start} ~ {end}레벨 까지\n필요한 솔 에르다💎 : {erda}개\n솔 에르다 조각💠 : {piece}개"
    else:
        return "시작 레벨과 끝 레벨을 제대로 입력했는지 확인해 주세요.\n레벨 범위: 0~30\n(코어가 없는 상태에서 제작하는 것을 0->1레벨 강화로 칩니다.)"

def handle_message(chat):
    if "@헥사" in chat.message.msg or "!헥사" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name)
        else:
            nick = parts[1]
        res = hexasearch(nick, chat.sender.name)
        chat.reply(res)

    if "@6차" in chat.message.msg or "!6차" in chat.message.msg:
        parts = chat.message.msg.split(" ")

        start = 0
        end = 0

        if len(parts) > 2:
            if parts[1].isdigit() or parts[2].isdigit():
                start = int(parts[1])
                end = int(parts[2])

        res = sixth_calc(start, end)
        chat.reply(res)

    if "@오리진" in chat.message.msg or "!오리진" in chat.message.msg or "@어센트" in chat.message.msg or "!어센트" in chat.message.msg:
        parts = chat.message.msg.split(" ")

        start = 0
        end = 0

        if len(parts) > 2:
            if parts[1].isdigit() or parts[2].isdigit():
                start = int(parts[1])
                end = int(parts[2])

        res = sixth_origin_calc(start, end)
        chat.reply(res)

    if "@마스터리" in chat.message.msg or "!마스터리" in chat.message.msg:
        parts = chat.message.msg.split(" ")

        start = 0
        end = 0

        try:
            start = int(parts[1])
            end = int(parts[2])
                
            res = sixth_master_calc(start, end)
            chat.reply(res)

        except Exception as e:
            res = sixth_master_calc("", "")
            chat.reply(res)

    if "@강화" in chat.message.msg or "!강화" in chat.message.msg:
        parts = chat.message.msg.split(" ")

        start = 0
        end = 0

        if len(parts) > 2:
            if parts[1].isdigit() or parts[2].isdigit():
                start = int(parts[1])
                end = int(parts[2])

        res = sixth_skill_calc(start, end)
        chat.reply(res)

    if "@공용" in chat.message.msg or "!공용" in chat.message.msg or "@야누스" in chat.message.msg or "!야누스" in chat.message.msg:
        parts = chat.message.msg.split(" ")

        start = 0
        end = 0

        if len(parts) > 2:
            if parts[1].isdigit() or parts[2].isdigit():
                start = int(parts[1])
                end = int(parts[2])

        res = sixth_gongyong_calc(start, end)
        chat.reply(res)