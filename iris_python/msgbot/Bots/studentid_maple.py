import requests
import json
from PIL import Image, ImageDraw, ImageFont
import io
import os
from urllib import parse
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import comma, get_yesterday_date

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

def generate_studentid_image(image_url, nick, date):

    response = requests.get(image_url)
    response.raise_for_status()

    # 1. 테스트용 이미지 URL
    bg_url = "res/img/studentid_maple_bg.png"

    # 2. 이미지 로드
    bg_img = Image.open(bg_url).convert("RGBA")

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

    cw, ch = cropped_img.size
    new_size = (int(cw * 4), int(ch * 4))

    cropped_img = cropped_img.resize(new_size, Image.LANCZOS)

    # 3. bg 이미지로 배경 생성
    canvas = Image.new("RGBA", (1028, 1370), (255, 255, 255, 255))

    canvas.paste(bg_img, (0, 0), bg_img)

    canvas.paste(cropped_img, (220, 500), cropped_img)

    # 5. 텍스트 그리기
    draw = ImageDraw.Draw(canvas)

    try:
        nick_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Bold.otf", 45)
    except:
        nick_font = ImageFont.load_default()

    try:
        content_font2 = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Bold.otf", 30)
    except:
        content_font2 = ImageFont.load_default()

    draw.text((514, 350), nick, font=nick_font, fill=(255, 255, 255), anchor="mm")

    draw.text((700, 550), "메이플대학교", font=nick_font, fill=(40, 55, 150), anchor="mm")

    draw.text((700, 740), "메이플스토리 전공", font=content_font2, fill=(40, 55, 150), anchor="mm")

    draw.text((700, 925), date, font=nick_font, fill=(40, 55, 150), anchor="mm")

    # 6. 전송
    img_bytes = io.BytesIO()
    canvas.save(img_bytes, format="PNG")
    img_bytes.seek(0)
    return img_bytes

def maple_student_id(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        ocid = search_api_ocid(nick)
        search1 = search_maple_api(ocid)

        img = search1["character_image"]

        character_date_create = search1["character_date_create"]

        date1 = character_date_create.split("T")[0].split("-")
        date2 = "".join(date1)

        img_bytes = generate_studentid_image(img, nick, date2)

        return img_bytes
        

def handle_message(chat):
    if "@학생증" in chat.message.msg or "!학생증" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            nick = ""
        else:
            nick = parts[1]
        try:
            res = maple_student_id(nick, chat.sender.name)
            chat.reply_media(res)
        except Exception as e:
            nick = chat.message.msg[5:]
            chat.reply(f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.")
            raise