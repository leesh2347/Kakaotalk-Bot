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


def stat(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        try:
            recordnick(sender, nick)

            ocid = search_api_ocid(nick)
            t = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/stat?ocid={ocid}")
            r = ""

            final_stat = t["final_stat"]

            for i in range(0, len(final_stat)):
                if "전투력" not in final_stat[i]["stat_name"]:
                    r = r + f"{final_stat[i]['stat_name']}: {comma(final_stat[i]['stat_value'])}\n"
            
            atk = comma(final_stat[42]["stat_value"])

            return "\n".join([
                f"[{nick}]",
                f"전투력: {atk}",
                "\u200b"*500,
                f"스공: {comma(final_stat[0]['stat_value'])} ~ {comma(final_stat[1]['stat_value'])}",
                f"STR: {comma(final_stat[16]['stat_value'])}",
                f"DEX: {comma(final_stat[17]['stat_value'])}",
                f"INT: {comma(final_stat[18]['stat_value'])}",
                f"LUK: {comma(final_stat[19]['stat_value'])}",
                "",
                f"HP: {comma(final_stat[20]['stat_value'])}",
                f"MP: {comma(final_stat[21]['stat_value'])}",
                f"공격력: {comma(final_stat[40]['stat_value'])}",
                f"마력: {comma(final_stat[41]['stat_value'])}",
                "",
                f"보스 몬스터 데미지: {comma(final_stat[3]['stat_value'])}%",
                f"방어율 무시: {comma(final_stat[5]['stat_value'])}%",
                f"데미지: {comma(final_stat[2]['stat_value'])}%",
                f"최종 데미지: {comma(final_stat[4]['stat_value'])}%",
                f"크리티컬 데미지: {comma(final_stat[7]['stat_value'])}%",
                f"상태이상 추가 데미지: {comma(final_stat[37]['stat_value'])}%",
                f"일반 몬스터 데미지: {comma(final_stat[32]['stat_value'])}%",
                "",
                f"크리티컬 확률: {comma(final_stat[6]['stat_value'])}%",
                f"버프 지속시간: {comma(final_stat[30]['stat_value'])}%",
                f"공격 속도: {comma(final_stat[31]['stat_value'])}",
                f"상태이상 내성: {comma(final_stat[8]['stat_value'])}",
                f"소환수 지속시간 증가: {comma(final_stat[43]['stat_value'])}",
                f"재사용 대기시간 감소(초): {comma(final_stat[33]['stat_value'])}초",
                f"재사용 대기시간 감소(%): {comma(final_stat[34]['stat_value'])}%",
                f"재사용 대기시간 미적용: {comma(final_stat[35]['stat_value'])}%",
                "",
                f"스타포스: {comma(final_stat[13]['stat_value'])}",
                f"아케인포스: {comma(final_stat[14]['stat_value'])}",
                f"어센틱포스: {comma(final_stat[15]['stat_value'])}",
                "",
                f"아이템 드롭률: {comma(final_stat[28]['stat_value'])}%",
                f"메소 획득량: {comma(final_stat[29]['stat_value'])}%",
                f"추가 경험치 획득: {comma(final_stat[39]['stat_value'])}%"
            ])
        except Exception as e:
            return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다."


def handle_message(chat):
    if "@스탯" in chat.message.msg or "!스탯" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name)
        else:
            nick = parts[1]
        res = stat(nick, chat.sender.name)
        chat.reply(res)
