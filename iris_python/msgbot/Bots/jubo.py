import requests
import json
from datetime import date, timedelta
from urllib import parse
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import recordnick, recommendnick, comma
from msgbot.bot_commands.commands_config import PREFIX_STAT

SCHEDULER_TEXTS = {
    "true_boss":"✅",
    "false_boss":"❌",
    "bossWeekly":"주간"
}

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

def suro(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        try:
            recordnick(sender, nick)

            ocid = search_api_ocid(nick)
            t = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/scheduler/character-state?ocid={ocid}")
            r = ""

            weekly_contents = t["weekly_contents"]

            boss_contents = t["boss_contents"]


            r += "\n[주간퀘]\n"

            flag = 0
            suro = 0

            for weekly in weekly_contents:
                #스케줄러 등록만 표시
                if "플래그 레이스" in weekly["content_name"]:
                    flag = weekly["now_count"]
                elif "지하 수로" in weekly["content_name"]:
                    suro = weekly["now_count"]

            if flag > 0:
                is_flag_complete = "✅"
            else:
                is_flag_complete = "❌"
            
            if suro > 0:
                is_suro_complete = "✅"
            else:
                is_suro_complete = "❌"


            return "\n".join([
                f"[{nick}]님의 이번 주 길드 컨텐츠",
                "",
                f"플래그 레이스: {flag}점 {is_flag_complete}",
                f"지하 수로: {suro}점 {is_suro_complete}"
            ])
        except Exception as e:
            return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.{e}"

def jubo(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        try:
            recordnick(sender, nick)

            ocid = search_api_ocid(nick)
            t = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/scheduler/character-state?ocid={ocid}")
            r = ""
            daily_contents = t["daily_contents"]

            weekly_contents = t["weekly_contents"]

            boss_contents = t["boss_contents"]

            weekly_boss_clear_count = t["weekly_boss_clear_count"]

            weekly_boss_clear_limit_count = t["weekly_boss_clear_limit_count"]

            r += "\n[일퀘]\n"

            for daily in daily_contents:
                #스케줄러 등록만 표시
                if daily["registration_flag"] == "true":
                    r += f'-일퀘이름:{daily["content_name"]}\n'
                    r += f'-진행상태:{daily["now_count"]}/{daily["max_count"]}\n'
                    r += "\n"

            r += "\n[주간퀘]\n"

            for weekly in weekly_contents:
                #스케줄러 등록만 표시
                if weekly["registration_flag"] == "true":
                    r += f'-주간퀘이름:{weekly["content_name"]}\n'
                    r += f'-진행상태:{weekly["now_count"]}/{weekly["max_count"]}\n'
                    r += "\n"

            r += "\n[보스컨텐츠]\n"

            for boss in boss_contents:
                #스케줄러 등록만 표시
                if boss["registration_flag"] == "true":
                    r += f'-보스이름:{boss["content_name"]}({boss["difficulty"]}) ({boss["cycle"]})\n'
                    if boss["complete_flag"] == "true":
                        r += "클리어 완료\n"
                    else:
                        r += "클리어 미완료\n"
                    r += "\n"

            r += f"\n[주보 클리어 카운트] {weekly_boss_clear_count}\n"
            r += f"\n[주보 클리어 제한 카운트] {weekly_boss_clear_limit_count}\n"

            return "\n".join([
                f"[{nick}]",
                "\u200b"*500,
                r
            ])
        except Exception as e:
            return f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.{e}"


def handle_message(chat):
    if any(prefix in chat.message.msg for prefix in ["@스케줄러"]):
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name, chat.room.name)
        else:
            nick = parts[1]
        res = jubo(nick, chat.sender.name)
        chat.reply(res)

    if any(prefix in chat.message.msg for prefix in ["@플래그","@수로","@수플"]):
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name)
        else:
            nick = parts[1]
        res = suro(nick, chat.sender.name)
        chat.reply(res)
