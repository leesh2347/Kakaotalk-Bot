from PIL import Image, ImageDraw, ImageFont
import io
import json
import os
import random

# banned_rooms.json의 절대 경로 계산
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # msgbot/
FILTER_FILE = os.path.join(BASE_DIR, "banned_rooms.json")

# JSON 파일 로드
with open(FILTER_FILE, "r", encoding="utf-8") as f:
    filter_data = json.load(f)

# 금지 방 목록 로드
BANNED_PLAY_ROOMS = filter_data["banrooms"]["play"]

def handle_message(chat):

    if chat.room.name in BANNED_PLAY_ROOMS:
        return
    #재미요소 금지 방 필터

    if chat.message.command == '@ㄷㄱㄷㄱ':
        try:

            n1 = 0
            n2 = 0
            n3 = 0
            n4 = 0

            n1 = random.randint(1, 8) + 3
            n2 = random.randint(1, (18 - n1 - 4)) + 3
            while n2 > 10:
                n2 = random.randint(1, (18 - n1 - 4)) + 3
            n3 = random.randint(1, (22 - n1 - n2 - 4)) + 3
            while n3 > 10:
                n3 = random.randint(1, (22 - n1 - n2 - 4)) + 3
            n4 = 25 - n1 - n2 - n3

            # 1. 테스트용 이미지 URL
            image_url = "res/img/maple_dice_bg.jpg"

            # 2. 이미지 로드
            img = Image.open(image_url).convert("RGBA")

            # 3. 캔버스(이미지) 위에 글자 넣기
            draw = ImageDraw.Draw(img)

            # 폰트 로딩 (사용 폰트가 없으면 기본폰트)
            try:
                font_nick = ImageFont.truetype("res/fonts/NanumFontSetup_OTF_GOTHIC/NanumGothicBold.otf", 30)
            except:
                font_nick = ImageFont.load_default()

            try:
                font_nums = ImageFont.truetype("res/fonts/NanumFontSetup_OTF_GOTHIC/NanumGothicBold.otf", 25)
            except:
                font_nums = ImageFont.load_default()

            draw.text((50, 95), chat.sender.name, font=font_nick, fill=(255, 255, 255))

            draw.text((110, 205), f"{n1}", font=font_nums, fill=(0, 0, 0))

            draw.text((110, 240), f"{n2}", font=font_nums, fill=(0, 0, 0))

            draw.text((110, 280), f"{n3}", font=font_nums, fill=(0, 0, 0))

            draw.text((110, 315), f"{n4}", font=font_nums, fill=(0, 0, 0))

            # 4. 전송할 BytesIO 형태로 변환
            img_bytes = io.BytesIO()
            img.save(img_bytes, format="PNG")
            img_bytes = io.BytesIO(img_bytes.getvalue())

            # 5. 카카오톡으로 이미지 전송
            chat.reply_media(img_bytes)

        except Exception as e:
            chat.reply(f"오류 발생: {e}")
