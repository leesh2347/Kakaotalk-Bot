import requests
import numpy as np
from msgbot.Bots.guk_data.sungbi_levdata import DATA_AFTER_210, DATA_101_TO_209, DATA_1_TO_100, DATA_HIGHMOUNTAIN, DATA_ANGLER, DATA_NIGHTMARE

SUNGBI = [571115568,6120258214,22164317197,64359295696]

def chosungbi(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index > 209:
            e = DATA_AFTER_210[index - 210]
        elif index > 100:
            e = DATA_101_TO_209[index - 101]
        else:
            e = DATA_1_TO_100[index - 1]

        cho = 2438047518853/e*100

        if cho >= 100:
            return "초월 성장의 비약: 레벨 269 이하까지 1업,\n그 이상부터는 269레벨의 100% 경험치만큼 지급"
        else:
            return f"{index}레벨에서 초성비를 마셨을때의 경험치 획득량 : {round(cho, 3)}%"

def guksungbi(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index > 209:
            e = DATA_AFTER_210[index - 210]
        elif index > 100:
            e = DATA_101_TO_209[index - 101]
        else:
            e = DATA_1_TO_100[index - 1]

        guk = 294971656640/e*100

        if guk >= 100:
            return "극한 성장의 비약: 레벨 249 이하까지 1업,\n그 이상부터는 249레벨의 100% 경험치만큼 지급"
        else:
            return f"{index}레벨에서 극성비를 마셨을때의 경험치 획득량 : {round(guk, 3)}%"

def taesungbi(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index > 209:
            e = DATA_AFTER_210[index - 210]
        elif index > 100:
            e = DATA_101_TO_209[index - 101]
        else:
            e = DATA_1_TO_100[index - 1]

        tae = 137783047111/e*100

        if tae >= 100:
            return "태풍 성장의 비약: 레벨 239 이하까지 1업,\n그 이상부터는 239레벨의 100% 경험치만큼 지급"
        else:
            return f"{index}레벨에서 태성비를 마셨을때의 경험치 획득량 : {round(tae, 3)}%"

def iksungbi(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index > 209:
            e = DATA_AFTER_210[index - 210]
        elif index > 100:
            e = DATA_101_TO_209[index - 101]
        else:
            e = DATA_1_TO_100[index - 1]

        s = sungbi[0]/e*100

        if s >= 100:
            return "익스트림 성장의 비약: 141~199레벨까지 1~10레벨 랜덤으로 레벨업,\n그 이상부터는 199레벨의 100% 경험치만큼 지급"
        else:
            return f"{index}레벨에서 익성비를 마셨을때의 경험치 획득량 : {round(s, 3)}%"

def sungbi_200_to_209(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index > 209:
            e = DATA_AFTER_210[index - 210]
        elif index > 100:
            e = DATA_101_TO_209[index - 101]
        else:
            e = DATA_1_TO_100[index - 1]

        s = sungbi[1]/e*100

        if s >= 100:
            return "성장의 비약(200~209): 해당 레벨 구간에서 1업,\n그 이상부터는 209레벨의 100% 경험치만큼 지급"
        else:
            return f"{index}레벨에서 200성비를 마셨을때의 경험치 획득량 : {round(s, 3)}%"

def sungbi_210_to_219(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index > 209:
            e = DATA_AFTER_210[index - 210]
        elif index > 100:
            e = DATA_101_TO_209[index - 101]
        else:
            e = DATA_1_TO_100[index - 1]

        s = sungbi[2]/e*100

        if s >= 100:
            return "성장의 비약(210~219): 해당 레벨 구간에서 1업,\n그 이상부터는 219레벨의 100% 경험치만큼 지급"
        else:
            return f"{index}레벨에서 210성비를 마셨을때의 경험치 획득량 : {round(s, 3)}%"

def sungbi_220_to_229(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index > 209:
            e = DATA_AFTER_210[index - 210]
        elif index > 100:
            e = DATA_101_TO_209[index - 101]
        else:
            e = DATA_1_TO_100[index - 1]

        s = sungbi[3]/e*100

        if s >= 100:
            return "성장의 비약(220~229): 해당 레벨 구간에서 1업,\n그 이상부터는 229레벨의 100% 경험치만큼 지급"
        else:
            return f"{index}레벨에서 220성비를 마셨을때의 경험치 획득량 : {round(s, 3)}%"

def highmountain(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index < 260:
            return "에픽 던전 하이마운틴은 260레벨 이상의 캐릭터만 입장 가능합니다."
        else:
            l = DATA_AFTER_210[index - 210]
            e = DATA_HIGHMOUNTAIN[index - 260]

            s = e/l*100
            return f"{index}레벨에서 하이마운틴 클리어 시 경험치 획득량 : {round(s, 3)}%\n\n7500메포 사용 시: {round(s*5, 3)}% (X5)\n30000메포 사용 시: {round(s*9, 3)}% (X9)"

def angler(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index < 270:
            return "에픽 던전 앵글러 컴퍼니는 270레벨 이상의 캐릭터만 입장 가능합니다."
        else:
            l = DATA_AFTER_210[index - 210]
            e = DATA_ANGLER[index - 270]

            s = e/l*100

            return f"{index}레벨에서 앵글러 컴퍼니 클리어 시 경험치 획득량 : {round(s, 3)}%\n\n10000메포 사용 시: {round(s*5, 3)}% (X5)\n40000메포 사용 시: {round(s*9, 3)}% (X9)"

def nightmare(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index < 260:
            return "에픽 던전 악몽선경은 280 이상의 캐릭터만 입장 가능합니다."
        else:
            l = DATA_AFTER_210[index - 210]
            e = DATA_NIGHTMARE[index - 280]

            s = e/l*100

            return f"{index}레벨에서 악몽선경 클리어 시 경험치 획득량 : {round(s, 3)}%\n\n12500메포 사용 시: {round(s*5, 3)}% (X5)\n50000메포 사용 시: {round(s*9, 3)}% (X9)"

def handle_message(chat):
    #초성비
    if '!초성비' in chat.message.msg or '@초성비' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = chosungbi(n)
            chat.reply(res)

    #극성비
    if '!극성비' in chat.message.msg or '@극성비' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = guksungbi(n)
            chat.reply(res)

    #태성비
    if '!태성비' in chat.message.msg or '@태성비' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = taesungbi(n)
            chat.reply(res)

    #익성비
    if '!익성비' in chat.message.msg or '@익성비' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = iksungbi(n)
            chat.reply(res)

    #200성비
    if '!성비1' in chat.message.msg or '@성비1' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = sungbi_200_to_209(n)
            chat.reply(res)

    #210성비
    if '!성비2' in chat.message.msg or '@성비2' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = sungbi_210_to_219(n)
            chat.reply(res)

    #220성비
    if '!성비3' in chat.message.msg or '@성비3' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = sungbi_220_to_229(n)
            chat.reply(res)

    #하이마운틴
    if '!하이마운틴' in chat.message.msg or '@하이마운틴' in chat.message.msg or '@높은산' in chat.message.msg or '!높은산' in chat.message.msg or '@안녕산' in chat.message.msg or '!안녕산' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = highmountain(n)
            chat.reply(res)

    #앵글러
    if '!앵글러' in chat.message.msg or '@앵글러' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = angler(n)
            chat.reply(res)

    #악몽선경
    if '!악몽선경' in chat.message.msg or '@악몽선경' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = nightmare(n)
            chat.reply(res)