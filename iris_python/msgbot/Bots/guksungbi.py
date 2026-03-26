import requests
import numpy as np
import math
from msgbot.Bots.guk_data.sungbi_levdata import DATA_AFTER_210, DATA_101_TO_209, DATA_1_TO_100, DATA_HIGHMOUNTAIN, DATA_ANGLER, DATA_NIGHTMARE, DATA_EXP_COUPON, DATA_HIGH_EXP_COUPON, DATA_MONSTERPARK_EXTREME, DATA_EXPRESS_BOOSTER, DATA_MECHA_STRAWBERRY
from msgbot.bot_commands.commands_config import PREFIX_CHOSUNGBI, PREFIX_GUKSUNGBI, PREFIX_TAESUNGBI, PREFIX_IKSUNGBI, PREFIX_SUNGBI_200, PREFIX_SUNGBI_210, PREFIX_SUNGBI_220, PREFIX_HIGHMOUNTAIN, PREFIX_ANGLER, PREFIX_NIGHTMARE, PREFIX_EXTREME_MONSTERPARK, PREFIX_EXPCOUPON, PREFIX_HIGHEXPCOUPON, PREFIX_EXPRESS_BOOSTER, PREFIX_MECHA_STRAWBERRY, PREFIX_ZUNSUNGBI, PREFIX_DOSUNGBI


SUNGBI = [571115568, 6120258214, 22164317197, 64359295696]

# 성장의 비약 데이터: (경험치값, 최대레벨, 이름, 축약명)
SUNGBI_DATA = {
    "zun": (16657228589191, 279, "전설의 성장의 비약", "전성비"),
    "cho": (2438047518853, 269, "초월 성장의 비약", "초성비"),
    "do": (577306661354, 259, "도약의 성장의 비약", "도성비"),
    "guk": (294971656640, 249, "극한 성장의 비약", "극성비"),
    "tae": (137783047111, 239, "태풍 성장의 비약", "태성비"),
}

# 성장의 비약 (구간별) 데이터: (경험치값, 최대레벨, 이름, 축약명, 레벨업 설명)
SUNGBI_RANGE_DATA = {
    "ik": (SUNGBI[0], 199, "익스트림 성장의 비약", "익성비", "141~199 레벨까지 1~10 레벨 랜덤으로 레벨업"),
    "200": (SUNGBI[1], 209, "성장의 비약 (200~209)", "200 성비", "해당 레벨 구간에서 1 업"),
    "210": (SUNGBI[2], 219, "성장의 비약 (210~219)", "210 성비", "해당 레벨 구간에서 1 업"),
    "220": (SUNGBI[3], 229, "성장의 비약 (220~229)", "220 성비", "해당 레벨 구간에서 1 업"),
}


def get_exp_for_level(index):
    """주어진 레벨의 필요한 경험치 반환"""
    if index > 209:
        return DATA_AFTER_210[index - 210]
    elif index > 100:
        return DATA_101_TO_209[index - 101]
    else:
        return DATA_1_TO_100[index - 1]


def calc_sungbi(index, exp_value, max_level, item_name, short_name, range_desc=None):
    """
    성장의 비약 경험치 획득량 계산
    
    Args:
        index: 현재 레벨
        exp_value: 비약의 경험치 값
        max_level: 비약이 1 업되는 최대 레벨
        item_name: 비약 전체 이름
        short_name: 비약 축약명 (전성비, 초성비 등)
        range_desc: 구간별 비약의 경우 레벨업 설명 (없으면 None)
    
    Returns:
        계산 결과 문자열
    """
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    
    exp_needed = get_exp_for_level(index)
    percentage = exp_value / exp_needed * 100
    
    if percentage >= 100:
        if range_desc:
            return f"{item_name}: {range_desc},\n그 이상부터는 {max_level}레벨의 100% 경험치만큼 지급"
        else:
            return f"{item_name}: 레벨 {max_level} 이하까지 1 업,\n그 이상부터는 {max_level}레벨의 100% 경험치만큼 지급"
    else:
        return f"{index}레벨에서 {short_name}를 마셨을때의 경험치 획득량 : {round(percentage, 3)}%"


def zunsungbi(index):
    exp, max_lv, name, short = SUNGBI_DATA["zun"]
    return calc_sungbi(index, exp, max_lv, name, short)

def chosungbi(index):
    exp, max_lv, name, short = SUNGBI_DATA["cho"]
    return calc_sungbi(index, exp, max_lv, name, short)

def dosungbi(index):
    exp, max_lv, name, short = SUNGBI_DATA["do"]
    return calc_sungbi(index, exp, max_lv, name, short)

def guksungbi(index):
    exp, max_lv, name, short = SUNGBI_DATA["guk"]
    return calc_sungbi(index, exp, max_lv, name, short)

def taesungbi(index):
    exp, max_lv, name, short = SUNGBI_DATA["tae"]
    return calc_sungbi(index, exp, max_lv, name, short)

def iksungbi(index):
    exp, max_lv, name, short, desc = SUNGBI_RANGE_DATA["ik"]
    return calc_sungbi(index, exp, max_lv, name, short, desc)

def sungbi_200_to_209(index):
    exp, max_lv, name, short, desc = SUNGBI_RANGE_DATA["200"]
    return calc_sungbi(index, exp, max_lv, name, short, desc)

def sungbi_210_to_219(index):
    exp, max_lv, name, short, desc = SUNGBI_RANGE_DATA["210"]
    return calc_sungbi(index, exp, max_lv, name, short, desc)

def sungbi_220_to_229(index):
    exp, max_lv, name, short, desc = SUNGBI_RANGE_DATA["220"]
    return calc_sungbi(index, exp, max_lv, name, short, desc)


# 에픽 던전 데이터: (데이터 배열, 최소레벨, 던전이름, 메포 옵션 [(금액, 배수)])
EPIC_DUNGEON_DATA = {
    "highmountain": (DATA_HIGHMOUNTAIN, 260, "하이마운틴", [(7500, 5), (30000, 9)]),
    "angler": (DATA_ANGLER, 270, "앵글러 컴퍼니", [(10000, 5), (40000, 9)]),
    "nightmare": (DATA_NIGHTMARE, 280, "악몽선경", [(12500, 5), (50000, 9)]),
}


def calc_epicdungeon(index, dungeon_key):
    """
    에픽 던전 경험치 획득량 계산
    
    Args:
        index: 현재 레벨
        dungeon_key: 던전 키 ("highmountain", "angler", "nightmare")
    
    Returns:
        계산 결과 문자열
    """
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    
    data, min_level, name, meso_options = EPIC_DUNGEON_DATA[dungeon_key]
    
    if index < min_level:
        return f"에픽 던전 {name}은 {min_level}레벨 이상의 캐릭터만 입장 가능합니다."
    
    exp_needed = DATA_AFTER_210[index - 210]
    exp_reward = data[index - min_level]
    
    percentage = exp_reward / exp_needed * 100
    
    result = f"{index}레벨에서 {name} 클리어 시 경험치 획득량 : {round(percentage, 3)}%"
    
    meso_lines = []
    for meso_cost, multiplier in meso_options:
        meso_lines.append(f"{meso_cost}메포 사용 시: {round(percentage * multiplier, 3)}% (X{multiplier})")
    
    if meso_lines:
        result += "\n\n" + "\n".join(meso_lines)
    
    return result


def highmountain(index):
    return calc_epicdungeon(index, "highmountain")

def angler(index):
    return calc_epicdungeon(index, "angler")

def nightmare(index):
    return calc_epicdungeon(index, "nightmare")

def extreme_monsterpark(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index < 260:
            return "몬스터파크 익스트림은 260 레벨 이상의 캐릭터만 입장 가능합니다."
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
            return "EXP 쿠폰은 200 레벨 이상 260 레벨 이하의 캐릭터만 사용 가능합니다."
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

            return f"{index}레벨에서 EXP 쿠폰 {c}개 사용 시 경험치 획득량 : {round(s, 3)}%"

def high_exp_coupon(index, count):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index < 260:
            return "상급 EXP 쿠폰은 260 레벨 이상의 캐릭터만 사용 가능합니다."
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

            return f"{index}레벨에서 상급 EXP 쿠폰 {c}개 사용 시 경험치 획득량 : {round(s, 3)}%"

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

            return f"{index}레벨에서 익스프레스 부스터 몬스터 {c}마리 처치 시 경험치 획득량 : {round(s_c, 3)}%\n\n1 레벨업에 필요한 사냥 마릿수: {t}"

def mecha_strawberry(index):
    if np.nan == index or index < 1 or index > 299:
        return "레벨은 1~299 사이 숫자만 입력해 주세요."
    else:
        if index < 280:
            return "메카 딸기 농장은 280 레벨 이상의 캐릭터만 입장 가능합니다."
        else:
            l = DATA_AFTER_210[index - 210]
            e = DATA_MECHA_STRAWBERRY[index - 280]

            s = e/l*100

            t = math.ceil(100 / s)

            return f"{index}레벨에서 메카딸기농장 1 회 입장 시 경험치 획득량 : {round(s, 3)}%\n\n1 레벨업에 필요한 티켓 수: {t} 장"

def handle_message(chat):
    # 1 단계: 레벨만 인자로 받는 함수들 (접두사 리스트, 함수) 매핑
    single_arg_commands = [
        (PREFIX_ZUNSUNGBI, zunsungbi),
        (PREFIX_CHOSUNGBI, chosungbi),
        (PREFIX_DOSUNGBI, dosungbi),
        (PREFIX_GUKSUNGBI, guksungbi),
        (PREFIX_TAESUNGBI, taesungbi),
        (PREFIX_IKSUNGBI, iksungbi),
        (PREFIX_SUNGBI_200, sungbi_200_to_209),
        (PREFIX_SUNGBI_210, sungbi_210_to_219),
        (PREFIX_SUNGBI_220, sungbi_220_to_229),
        (PREFIX_HIGHMOUNTAIN, highmountain),
        (PREFIX_ANGLER, angler),
        (PREFIX_NIGHTMARE, nightmare),
        (PREFIX_EXTREME_MONSTERPARK, extreme_monsterpark),
        (PREFIX_MECHA_STRAWBERRY, mecha_strawberry),
    ]
    
    for prefixes, func in single_arg_commands:
        if any(prefix in chat.message.msg for prefix in prefixes):
            parts = chat.message.msg.split(" ")
            if len(parts) > 1 and parts[1].isdigit():
                n = int(parts[1])
                res = func(n)
                chat.reply(res)
            break
    
    # 2 단계: 레벨 + 개수 (선택) 인자로 받는 함수들
    two_arg_commands = [
        (PREFIX_EXPCOUPON, exp_coupon),
        (PREFIX_HIGHEXPCOUPON, high_exp_coupon),
        (PREFIX_EXPRESS_BOOSTER, express_booster),
    ]
    
    for prefixes, func in two_arg_commands:
        if any(prefix in chat.message.msg for prefix in prefixes):
            parts = chat.message.msg.split(" ")
            if len(parts) > 1 and parts[1].isdigit():
                n = int(parts[1])
                c = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 1
                res = func(n, c)
                chat.reply(res)
            break
