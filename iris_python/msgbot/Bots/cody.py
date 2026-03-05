import requests
import json
from PIL import Image, ImageDraw, ImageFont
import io
import os
from urllib import parse
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import recordnick, recommendnick, comma, get_yesterday_date, history_db_save
from msgbot.bot_commands.commands_config import PREFIX_CODY

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

#api 검색-basic
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

#api 검색-헤어성형
def search_maple_api_beauty(ocid):
    headers = {
        "Content-Type": "application/json",
        "x-nxopen-api-key": "live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59"
    }
    res = requests.get("https://open.api.nexon.com/maplestory/v1/character/beauty-equipment", params={"ocid": ocid}, headers=headers)
    res.raise_for_status()     # 200이 아니면 에러
    #print(res.text)
    s2 = json.loads(res.text)
    return s2

#api 검색-코디템들
def search_maple_api_items(ocid):
    headers = {
        "Content-Type": "application/json",
        "x-nxopen-api-key": "live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59"
    }
    res = requests.get("https://open.api.nexon.com/maplestory/v1/character/cashitem-equipment", params={"ocid": ocid}, headers=headers)
    res.raise_for_status()     # 200이 아니면 에러
    #print(res.text)
    s2 = json.loads(res.text)
    return s2

def generate_cody_image(image_url, nick, beauty_text, item_text):

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
    canvas = Image.new("RGBA", (300, 520), (255, 255, 255, 255))

    # 4. crop 이미지를 캔버스 왼쪽에 붙이기 (세로 중앙)
    paste_x = (300 - crop_w) // 2
    canvas.paste(cropped_img, (paste_x, 10), cropped_img)

    # 5. 텍스트 그리기
    draw = ImageDraw.Draw(canvas)

    try:
        nick_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Bold.otf", 23)
    except:
        nick_font = ImageFont.load_default()

    try:
        beauty_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Light.otf", 18)
    except:
        beauty_font = ImageFont.load_default()

    try:
        items_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Light.otf", 16)
    except:
        items_font = ImageFont.load_default()

    draw.text((150, 150), f"[{nick}]님의 코디 정보", font=nick_font, fill=(0, 0, 0), anchor="mm")

    draw.text((10, 185), beauty_text, font=beauty_font, fill=(0, 0, 0))

    draw.text((10, 300), item_text, font=items_font, fill=(0, 0, 0))

    # 6. 전송
    img_bytes = io.BytesIO()
    canvas.save(img_bytes, format="PNG")
    img_bytes.seek(0)
    return img_bytes

def cody(nick, sender):
    if nick is None or nick == "":
        return {
            "img_bytes":"",
            "text_print":"닉네임을 입력해 주세요"
        }
    else:
        recordnick(sender, nick)
        ocid = search_api_ocid(nick)

        search_img = search_maple_api(ocid)

        search = search_maple_api_beauty(ocid)

        search2 = search_maple_api_items(ocid)

        img = search_img["character_image"]

        beauty_text = ""

        hair_color_text = search["character_hair"]["base_color"]

        beauty_text = beauty_text + f'헤어: {search["character_hair"]["hair_name"].replace(hair_color_text,'')}'

        if search["character_hair"]["mix_color"] is None:
            beauty_text = beauty_text + f'\n      ({hair_color_text})'
        else:
            beauty_text = beauty_text + f'\n      ({hair_color_text}{100 - int(search["character_hair"]["mix_rate"])}/{search["character_hair"]["mix_color"]}{search["character_hair"]["mix_rate"]})'

        beauty_text = beauty_text + f'\n성형: {search["character_face"]["face_name"]}'

        if search["character_face"]["mix_color"] is None:
            beauty_text = beauty_text + f'\n      ({search["character_face"]["base_color"]})'
        else:
            beauty_text = beauty_text + f'\n      ({search["character_face"]["base_color"]}{100 - int(search["character_face"]["mix_rate"])}/{search["character_face"]["mix_color"]}{search["character_face"]["mix_rate"]})'

        beauty_text = beauty_text + f'\n피부: {search["character_skin"]["skin_name"]}'

        cody_item_text = ""
        
        for item in search2["cash_item_equipment_base"]:
            part = ""
            itemname = ""
            itemicon = ""
            part = item["cash_item_equipment_part"]
            itemname = item["cash_item_name"]
            itemicon = item["cash_item_icon"]
            if item["item_gender"] is not None:
                itemname = f'{itemname} ({item["item_gender"]})'
            cody_item_text = cody_item_text + f"{part}: {itemname}\n"
            

        img_bytes = generate_cody_image(img, nick, beauty_text, cody_item_text)

        result_json = {
            "img_bytes":img_bytes,
            "text_print":""
        }

        return result_json
        

def handle_message(chat):
    if any(prefix in chat.message.msg for prefix in PREFIX_CODY):
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name)
        else:
            nick = parts[1]
        try:
            res = cody(nick, chat.sender.name)
            if res["img_bytes"] != "":
                chat.reply_media(res["img_bytes"])
            if res["text_print"] != "":
                chat.reply(res["text_print"])
        except Exception as e:
            raise
            nick = chat.message.msg[5:]
            chat.reply(f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다.")
            raise