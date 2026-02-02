import requests
import json
from urllib import parse
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont, ImageColor
import io
from msgbot.Bots.maple_nickskip.nickskip_module import comma
from msgbot.Bots.maple_boss.boss_data import MAPLE_BOSS_DATA, MAPLE_BOSS_COMMANDS
from msgbot.bot_commands.commands_config import PREFIX_BOSS

def generate_boss_image(image_url, bgcolor, title_color, context_color, title_text, context_text):

    # 2. 이미지 로드
    boss_img = Image.open(image_url).convert("RGBA")

    # 3. 새 캔버스 생성 (500x500)
    canvas = Image.new("RGBA", (800, 500), (*ImageColor.getrgb(bgcolor), 255))

    canvas.paste(boss_img, (0, 0), boss_img)

    # 5. 텍스트 그리기
    draw = ImageDraw.Draw(canvas)

    try:
        nick_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Bold.otf", 25)
    except:
        nick_font = ImageFont.load_default()

    try:
        content_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Light.otf", 18)
    except:
        content_font = ImageFont.load_default()

    draw.text((440, 10), title_text, font=nick_font, fill=ImageColor.getrgb(title_color))

    draw.text((440, 50), context_text, font=content_font, fill=ImageColor.getrgb(context_color))

    # 6. 전송
    img_bytes = io.BytesIO()
    canvas.save(img_bytes, format="PNG")
    img_bytes.seek(0)
    return img_bytes

def boss(bossname):
    if bossname in MAPLE_BOSS_COMMANDS:

        boss_code = MAPLE_BOSS_COMMANDS[bossname]

        s = ""
        boss_data = MAPLE_BOSS_DATA[boss_code]
        for ii in boss_data["HP"]:
            s = s + f"{ii}: {boss_data['HP'][ii]}\n"
        levs = ""
        if isinstance(boss_data["level"],dict):
            for ii in boss_data["level"]:
                levs = levs + f"{ii}: Lv.{boss_data['level'][ii]}\n"
        else:
            levs = f"Lv.{boss_data['level']}"
        
        arc = ""

        if isinstance(boss_data["arcaneforce"],dict):
            arc = "어센틱포스:\n"
            for ii in boss_data["arcaneforce"]:
                arc = arc + f"{ii}: {boss_data['arcaneforce'][ii]}\n"
        else:
            if boss_data["arcaneforce"] != "":
                arc = f"아케인포스: {boss_data['arcaneforce']}"
        
        space = "\u200b"*500

        context_text = "\n".join([
            levs,
            "",
			"HP:",
			s,
			f"방어율: {boss_data['defenseRate']}%",
			f"최소 입장 레벨: Lv.{boss_data['minLevel']}",
			f"데스카운트: {boss_data['deathCount']}",
			arc,
        ])

        context_after_space = "\n".join([
			space,
			"",
			"주요 보상:",
			"\n".join(boss_data['dropItem']),
			"",
			"Thanks to Lune"
        ])

        image_url = f"res/img/maple_boss_img/{boss_data['image']}"

        img_bytes = generate_boss_image(image_url, boss_data['bg_color'], boss_data['title_color'], boss_data['content_color'], boss_data['name'], context_text)

        result_json = {
            "img_bytes":img_bytes,
            "text_print":context_after_space
        }


        return result_json
    else:
        return {
            "img_bytes":"",
            "text_print":"보스 이름이 제대로 입력되었는지 확인해 주세요.\n\n예시: !보스 카오스벨룸 (띄어쓰기 없이)\n※몇몇 축약어도 어느정도 인식합니다."
        }
    


def handle_message(chat):
    if any(prefix in chat.message.msg for prefix in PREFIX_BOSS):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1:
            bossname = parts[1]
        else:
            bossname = ""
        
        try:
            res = boss(bossname)
            if res["img_bytes"] != "":
                chat.reply_media(res["img_bytes"])
            chat.reply(res["text_print"])
        except Exception as e:
            raise
