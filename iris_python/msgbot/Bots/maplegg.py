import requests
import json
from urllib import parse
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import recordnick, recommendnick, comma, get_yesterday_date, history_db_save

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

#api 검색_basic
def search_maple_api(ocid):
    headers = {
        "Content-Type": "application/json",
        "x-nxopen-api-key": "live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59"
    }
    res = requests.get("https://open.api.nexon.com/maplestory/v1/character/basic", params={"ocid": ocid}, headers=headers)
    res.raise_for_status()     # 200이 아니면 에러
    #print(res.text)
    s2 = json.loads(res.text)
    return s2

#api 검색_ranking
def search_maple_api_ranking(ocid, isreboot):

    d2 = get_yesterday_date()

    headers = {
        "Content-Type": "application/json",
        "x-nxopen-api-key": "live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59"
    }
    
    params = {"ocid": ocid, "date": d2}
    if isreboot == 1:
        params = {"ocid": ocid, "date": d2, "world_type":1}

    res = requests.get("https://open.api.nexon.com/maplestory/v1/ranking/overall", params=params, headers=headers)
    res.raise_for_status()     # 200이 아니면 에러
    #print(res.text)
    s2 = json.loads(res.text)
    return s2

#api 검색_직업랭킹
def search_maple_api_ranking_class(ocid, job1, job2, isreboot):

    d2 = get_yesterday_date()

    headers = {
        "Content-Type": "application/json",
        "x-nxopen-api-key": "live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59"
    }
    
    url="https://open.api.nexon.com/maplestory/v1/ranking/overall"
    if isreboot == 1:
        url = url + f"?ocid={ocid}&date={d2}&class={job1}-{job2}&world_type=1"
    else:
        url = url + f"?ocid={ocid}&date={d2}&class={job1}-{job2}"

    res = requests.get(url, headers=headers)
    res.raise_for_status()     # 200이 아니면 에러
    #print(res.text)
    s2 = json.loads(res.text)
    return s2

def maplegg(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        recordnick(sender, nick)
        ocid = search_api_ocid(nick)
        search1 = search_maple_api(ocid)
        server = search1["world_name"]
        if "리부트" in server:
            search2 = search_maple_api_ranking(ocid, 1)
        else:
            search2 = search_maple_api_ranking(ocid, 0)

        per = search1["character_exp_rate"]
        img = search1["character_image"]

        job1 = search2["ranking"][0]["class_name"]
        job2 = search2["ranking"][0]["sub_class_name"]
        lv = int(search2["ranking"][0]["character_level"])
        pop = search2["ranking"][0]["character_popularity"]
        gu = search2["ranking"][0]["character_guildname"]
        ranking_all = int(search2["ranking"][0]["ranking"])

        history_db_save(nick, lv, "")
        
        if job2 is not None and job2 != "":
            printjob = f"{job1}/{job2}"
        else:
            printjob = f"{job1}/{job1}"

        if "리부트" in server:
            search3 = search_maple_api_ranking_class(ocid, job1, job2, 1)
        else:
            search3 = search_maple_api_ranking_class(ocid, job1, job2, 0)

        ranking_class = int(search3["ranking"][0]["ranking"])

        return "\n".join([
            f"[{nick}@{server}]",
            printjob,
            f"레벨: {lv}({per}%)",
            f"길드: {gu} │ 인기도: {pop}",
            f"월드 랭킹: {comma(ranking_all)}위",
            f"직업 랭킹(월드): {comma(ranking_class)}위",
            "\u200b" * 500,
            f"메애기 링크: https://meaegi.com/s/{parse.quote(nick)}",
            "",
            f"환산 링크: https://maplescouter.com/info?name={parse.quote(nick)}",
            "",
            "캐릭터 이미지 다운로드",
            img,
            "",
            "Special Thanks 정쿠"
        ])
        

def handle_message(chat):
    if "@메이플" in chat.message.msg or "!메아플" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name)
        else:
            nick = parts[1]
        try:
            res = maplegg(nick, chat.sender.name)
            chat.reply(res)
        except Exception as e:
            nick = chat.message.msg[5:]
            chat.reply(f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.")
            raise