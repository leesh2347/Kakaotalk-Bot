import requests
import numpy as np
import math
from msgbot.Bots.guk_data.sungbi_levdata import DATA_AFTER_210, DATA_101_TO_209, DATA_1_TO_100, DATA_HIGHMOUNTAIN, DATA_ANGLER, DATA_NIGHTMARE, DATA_EXP_COUPON, DATA_HIGH_EXP_COUPON, DATA_MONSTERPARK_EXTREME, DATA_EXPRESS_BOOSTER, DATA_MECHA_STRAWBERRY
from msgbot.bot_commands.commands_config import PREFIX_CHOSUNGBI, PREFIX_GUKSUNGBI, PREFIX_TAESUNGBI, PREFIX_IKSUNGBI, PREFIX_SUNGBI_200, PREFIX_SUNGBI_210, PREFIX_SUNGBI_220, PREFIX_HIGHMOUNTAIN, PREFIX_ANGLER, PREFIX_NIGHTMARE, PREFIX_EXTREME_MONSTERPARK, PREFIX_EXPCOUPON, PREFIX_HIGHEXPCOUPON, PREFIX_EXPRESS_BOOSTER, PREFIX_MECHA_STRAWBERRY


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
            return "에픽 던전 악몽선경은 280레벨 이상의 캐릭터만 입장 가능합니다."
        else:
            l = DATA_AFTER_210[index - 210]
            e = DATA_NIGHTMARE[index - 280]

            s = e/l*100

            return f"{index}레벨에서 악몽선경 클리어 시 경험치 획득량 : {round(s, 3)}%\n\n12500메포 사용 시: {round(s*5, 3)}% (X5)\n50000메포 사용 시: {round(s*9, 3)}% (X9)"

def extreme_monsterpark(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index < 260:
            return "몬스터파크 익스트림은 260레벨 이상의 캐릭터만 입장 가능합니다."
        else:
            l = DATA_AFTER_210[index - 210]
            e = DATA_MONSTERPARK_EXTREME[index - 260]

            s = e/l*100

            return f"{index}레벨에서 몬스터파크 익스트림 클리어 시 경험치 획득량 : {round(s, 3)}%"

def exp_coupon(index, count):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index < 200 or index > 260:
            return "EXP쿠폰은 200레벨 이상 260레벨 이하의 캐릭터만 사용 가능합니다."
        else:
            c = 0
            if np.nan == count or count is None:
                c = 1
            elif count < 1:
                c = 1
            else:
                c = int(count)

            if index > 209:
                l = DATA_AFTER_210[index - 210]
            else:
                l = DATA_101_TO_209[index - 101]
            e = DATA_EXP_COUPON[index - 200]

            s = e/l*100*c

            return f"{index}레벨에서 EXP쿠폰 {c}개 사용 시 경험치 획득량 : {round(s, 3)}%"

def high_exp_coupon(index, count):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index < 260:
            return "상급 EXP쿠폰은 260레벨 이상의 캐릭터만 사용 가능합니다."
        else:
            c = 0
            if np.nan == count or count is None:
                c = 1
            elif count < 1:
                c = 1
            else:
                c = int(count)

            l = DATA_AFTER_210[index - 210]
            e = DATA_HIGH_EXP_COUPON[index - 260]

            s = e/l*100*c

            return f"{index}레벨에서 상급 EXP쿠폰 {c}개 사용 시 경험치 획득량 : {round(s, 3)}%"

def express_booster(index, count):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index > 294 or index < 260:
            return "익스프레스 부스터는 레벨 260 이상 294 이하인 캐릭터만 사용 가능합니다."
        else:
            c = 0
            if np.nan == count or count is None:
                c = 1
            elif count < 1:
                c = 1
            else:
                c = int(count)

            l = DATA_AFTER_210[index - 210]
            e = DATA_EXPRESS_BOOSTER[index - 260]

            s = e/l*100
            s_c = s*c

            t = math.ceil(100 / s)

            return f"{index}레벨에서 익스프레스 부스터 몬스터 {c}마리 처치 시 경험치 획득량 : {round(s_c, 3)}%\n\n1레벨업에 필요한 사냥 마릿수: {t}"

def mecha_strawberry(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index < 280:
            return "메카 딸기 농장은 280레벨 이상의 캐릭터만 입장 가능합니다."
        else:
            l = DATA_AFTER_210[index - 210]
            e = DATA_MECHA_STRAWBERRY[index - 280]

            s = e/l*100

            t = math.ceil(100 / s)

            return f"{index}레벨에서 메카딸기농장 1회 입장 시 경험치 획득량 : {round(s, 3)}%\n\n1레벨업에 필요한 티켓 수: {t}장"

def handle_message(chat):
    #초성비
    if any(prefix in chat.message.msg for prefix in PREFIX_CHOSUNGBI):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = chosungbi(n)
            chat.reply(res)

    #극성비
    if any(prefix in chat.message.msg for prefix in PREFIX_GUKSUNGBI):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = guksungbi(n)
            chat.reply(res)

    #태성비
    if any(prefix in chat.message.msg for prefix in PREFIX_TAESUNGBI):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = taesungbi(n)
            chat.reply(res)

    #익성비
    if any(prefix in chat.message.msg for prefix in PREFIX_IKSUNGBI):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = iksungbi(n)
            chat.reply(res)

    #200성비
    if any(prefix in chat.message.msg for prefix in PREFIX_SUNGBI_200):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = sungbi_200_to_209(n)
            chat.reply(res)

    #210성비
    if any(prefix in chat.message.msg for prefix in PREFIX_SUNGBI_210):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = sungbi_210_to_219(n)
            chat.reply(res)

    #220성비
    if any(prefix in chat.message.msg for prefix in PREFIX_SUNGBI_220):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = sungbi_220_to_229(n)
            chat.reply(res)

    #하이마운틴
    if any(prefix in chat.message.msg for prefix in PREFIX_HIGHMOUNTAIN):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = highmountain(n)
            chat.reply(res)

    #앵글러
    if any(prefix in chat.message.msg for prefix in PREFIX_ANGLER):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = angler(n)
            chat.reply(res)

    #악몽선경
    if any(prefix in chat.message.msg for prefix in PREFIX_NIGHTMARE):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = nightmare(n)
            chat.reply(res)

    #익몬
    if any(prefix in chat.message.msg for prefix in PREFIX_EXTREME_MONSTERPARK):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = extreme_monsterpark(n)
            chat.reply(res)

    #exp쿠폰
    if any(prefix in chat.message.msg for prefix in PREFIX_EXPCOUPON):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])

            if len(parts) > 2 and parts[2].isdigit():
                c = int(parts[2])
            else:
                c = 1

            res = exp_coupon(n, c)
            chat.reply(res)

    #상급exp쿠폰
    if any(prefix in chat.message.msg for prefix in PREFIX_HIGHEXPCOUPON):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])

            if len(parts) > 2 and parts[2].isdigit():
                c = int(parts[2])
            else:
                c = 1

            res = high_exp_coupon(n, c)
            chat.reply(res)

    #익부
    if any(prefix in chat.message.msg for prefix in PREFIX_EXPRESS_BOOSTER):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])

            if len(parts) > 2 and parts[2].isdigit():
                c = int(parts[2])
            else:
                c = 1

            res = express_booster(n, c)
            chat.reply(res)

    #메카딸기
    if any(prefix in chat.message.msg for prefix in PREFIX_MECHA_STRAWBERRY):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            res = mecha_strawberry(n)
            chat.reply(res)