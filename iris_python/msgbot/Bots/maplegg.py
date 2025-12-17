import requests
import json
from PIL import Image, ImageDraw, ImageFont
import io
import os
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

def generate_character_image(image_url, nick, server, job, lv, per, guild, pop, world_rank, class_rank):

    response = requests.get(image_url)
    response.raise_for_status()

    # 1. 원본 이미지 로드
    src_img = Image.open(io.BytesIO(response.content)).convert("RGBA")
    w, h = src_img.size

    # 2. 중앙 1/4 영역 crop
    crop_w, crop_h = w // 4, h // 3
    left = (w - crop_w) // 2
    top = (h - crop_h) // 2
    right = left + crop_w
    bottom = top + crop_h

    cropped_img = src_img.crop((left, top, right, bottom))

    # 3. 새 캔버스 생성 (500x500)
    canvas = Image.new("RGBA", (300, 320), (255, 255, 255, 255))

    # 4. crop 이미지를 캔버스 왼쪽에 붙이기 (세로 중앙)
    paste_x = (300 - crop_w) // 2
    canvas.paste(cropped_img, (paste_x, 10), cropped_img)

    # 5. 텍스트 그리기
    draw = ImageDraw.Draw(canvas)

    try:
        nick_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Bold.otf", 25)
    except:
        nick_font = ImageFont.load_default()

    try:
        content_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Light.otf", 20)
    except:
        content_font = ImageFont.load_default()

    draw.text((30, 130), f"[{nick}@{server}]", font=nick_font, fill=(0, 0, 0))

    draw.text((10, 185), job, font=content_font, fill=(0, 0, 0))

    draw.text((10, 210), f"레벨: {lv}({per}%)", font=content_font, fill=(0, 0, 0))

    draw.text((10, 235), f"길드: {guild} │ 인기도: {pop}", font=content_font, fill=(0, 0, 0))

    draw.text((10, 260), f"월드 랭킹: {comma(world_rank)}위", font=content_font, fill=(0, 0, 0))

    draw.text((10, 285), f"직업 랭킹(월드): {comma(class_rank)}위", font=content_font, fill=(0, 0, 0))

    # 6. 전송
    img_bytes = io.BytesIO()
    canvas.save(img_bytes, format="PNG")
    img_bytes.seek(0)
    return img_bytes

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

        img_bytes = generate_character_image(img, nick, server, printjob, lv, per, gu, pop, ranking_all, ranking_class)

        text_print = "\n".join([
            "메애기/환산 링크",
            "\u200b" * 500,
            f"메애기 링크: https://meaegi.com/s/{parse.quote(nick)}",
            "",
            f"환산 링크: https://maplescouter.com/info?name={parse.quote(nick)}",
            "",
            "Special Thanks 정쿠, Lune"
        ])

        result_json = {
            "img_bytes":img_bytes,
            "text_print":text_print
        }

        return result_json
        

def handle_message(chat):
    if "@메이플" in chat.message.msg or "!메아플" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name)
        else:
            nick = parts[1]
        try:
            res = maplegg(nick, chat.sender.name)
            chat.reply_media(res["img_bytes"])
            chat.reply(res["text_print"])
        except Exception as e:
            nick = chat.message.msg[5:]
            chat.reply(f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.")
            raise
