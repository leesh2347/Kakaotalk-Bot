# IO Helpers Module - File I/O and utility functions
import json
from PIL import Image, ImageDraw, ImageFont
import io
import os
import math
import requests

DATA_PATH = "Devel/Pokemon/Data"

def comma_format(number):
    """Format number with commas"""
    return f"{number:,}"

def read_json(target, res=None):
    """Read from JSON file"""
    try:
        file_path = os.path.join(DATA_PATH, f"{target}.json")
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if res:
            return data.get(res)
        return data
    except (FileNotFoundError, json.JSONDecodeError):
        return None

def write_json(target, data):
    """Write to JSON file"""
    try:
        file_path = os.path.join(DATA_PATH, f"{target}.json")
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error writing {target}.json: {e}")
        return False


def send_image(room, chat, template_id, template_args):
    """
    Send KakaoTalk link image (equivalent to Kakao.sendLink)
    template_id: Kakao template ID (58796 = single pokemon, 67300 = battle)
    template_args: dict with template-specific parameters


        ┌────────────────┬──────┬─────────────┬─────────────────────────────┐
    │ File           │ Line │ template_id │ Purpose                     │
    ├────────────────┼──────┼─────────────┼─────────────────────────────┤
    │ explore.py     │ 172  │ 58796       │ Wild pokemon encounter      │
    │ player_info.py │ 290  │ 58796       │ Pokemon info lookup         │
    │ player_info.py │ 355  │ 58796       │ Detailed pokemon info       │
    │ battle.py      │ 137  │ 67300       │ PvP battle start            │
    │ pve_battle.py  │ 163  │ 67300       │ Gym battle start            │
    │ pve_battle.py  │ 316  │ 67300       │ Battle tower start          │
    │ pve_battle.py  │ 401  │ 67300       │ PVE battle pokemon switch   │
    │ pve_battle.py  │ 448  │ 67300       │ Battle tower pokemon switch │
    └────────────────┴──────┴─────────────┴─────────────────────────────┘
    """
    try:
        if template_id == 58796:
            # 1. 새 캔버스 생성 
            canvas = Image.new("RGBA", (500, 650), (255, 255, 255, 255))

            #포켓몬 이미지 추가
            pok_img_url = template_args['POKIMG']
            pok_img = Image.open(pok_img_url).convert("RGBA")
            canvas.paste(pok_img, (0, 0), pok_img)

            #이로치 연출 추가
            if template_args['shiny'] > 0:
                shiny_icon_url = f"res/img/pok_game/shiny_icon_{template_args['shiny']}.png"
                shiny_icon = Image.open(shiny_icon_url).convert("RGBA")
                canvas.paste(shiny_icon, (440, 0), shiny_icon)

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

            draw.text((10, 510), template_args.get('POKNAME', ''), font=nick_font, fill=(0, 0, 0))

            draw.text((10, 550), template_args.get('DESC', ''), font=content_font, fill=(0, 0, 0))

            # 6. 전송
            img_bytes = io.BytesIO()
            canvas.save(img_bytes, format="PNG")
            img_bytes.seek(0)
            chat.reply_media(img_bytes)

        elif template_id == 67300:
            # 1. 새 캔버스 생성
            canvas = Image.new("RGBA", (1000, 600), (255, 255, 255, 255))

            #포켓몬 이미지 추가
            pok_img_url1 = template_args['player1img']
            pok_img1 = Image.open(pok_img_url1).convert("RGBA")
            pok1_w, pok1_h = pok_img1.size
            pok_img_converted1 = pok_img1.resize((int(pok1_w*0.7), int(pok1_h*0.7)),Image.Resampling.LANCZOS)

            pok_img_url2 = template_args['player2img']
            pok_img2 = Image.open(pok_img_url2).convert("RGBA")
            pok2_w, pok2_h = pok_img2.size
            pok_img_converted2 = pok_img2.resize((int(pok2_w*0.7), int(pok2_h*0.7)),Image.Resampling.LANCZOS)

            canvas.paste(pok_img_converted1, (0, 60), pok_img_converted1)
            canvas.paste(pok_img_converted2, (580, 60), pok_img_converted2)

            #이로치 아이콘 추가
            if template_args['player1shiny'] > 0:
                shiny_icon_url = f"res/img/pok_game/shiny_icon_{template_args['player1shiny']}.png"
                shiny_icon = Image.open(shiny_icon_url).convert("RGBA")
                canvas.paste(shiny_icon, (440, 60), shiny_icon)
            if template_args['player2shiny'] > 0:
                shiny_icon_url = f"res/img/pok_game/shiny_icon_{template_args['player2shiny']}.png"
                shiny_icon = Image.open(shiny_icon_url).convert("RGBA")
                canvas.paste(shiny_icon, (940, 60), shiny_icon)



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

            draw.text((250, 20), template_args.get('player1name', ''), font=nick_font, fill=(0, 0, 0), anchor="mm")

            draw.text((750, 20), template_args.get('player2name', ''), font=nick_font, fill=(0, 0, 0), anchor="mm")

            draw.text((250, 510), template_args.get('player1', ''), font=nick_font, fill=(0, 0, 0), anchor="mm")

            draw.text((750, 510), template_args.get('player2', ''), font=nick_font, fill=(0, 0, 0), anchor="mm")

            draw.text((500, 500), 'VS', font=nick_font, fill=(0, 0, 0), anchor="mm")

            draw.text((250, 560), template_args.get('player1desc', ''), font=content_font, fill=(0, 0, 0), anchor="mm")

            draw.text((750, 560), template_args.get('player2desc', ''), font=content_font, fill=(0, 0, 0), anchor="mm")

            # 전송
            img_bytes = io.BytesIO()
            canvas.save(img_bytes, format="PNG")
            img_bytes.seek(0)
            chat.reply_media(img_bytes)
    except Exception as e:
        print(e)
        # Fallback to text
        if template_id == 67300:
            chat.reply(f"카링 대체 부분\n⚔️배틀\n{template_args['player1']}\n{template_args['player1desc']}\nvs\n{template_args['player2']}\n{template_args['player2desc']}")
        elif template_id == 58796:
            chat.reply(f"카링 대체 부분\n이미지: {template_args['POKIMG']}\n{template_args.get('POKNAME', '')}\n{template_args.get('DESC', '')}")
        else:
            chat.reply(f"카링 대체 부분\n{template_args}")

def fetch_url(url):
    """Fetch URL content"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def pokimglink(pokename, formchange, shiny):
    """Get Pokemon image URL"""
    imgg = ""
    baseurl = ""
    if shiny > 0:
        baseurl = f"pokemon_images_shiny/{shiny}"
    else:
        baseurl = "pokemon_images"

    if formchange > 0 and pokename != "아르세우스":
        imgg = f"res/img/pok_game/{baseurl}/{pokename}_{formchange}.png"
    else:
        imgg = f"res/img/pok_game/{baseurl}/{pokename}.png"

    return imgg

def typejudge(skilltype, typea, typeb):
    """Calculate type effectiveness"""
    """
    1: 노말 2: 불꽃 3: 물 4: 풀 5: 비행 6: 바위 7: 땅 8: 격투 9: 강철 10: 벌레 11: 얼음 12: 전기 13: 독 14: 에스퍼 15: 고스트 16: 악 17: 드래곤 18: 페어리
    """
    typeres = 1
    
    if skilltype == 1:
        if typea == 15 or typeb == 15:
            typeres = 0
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 6 or typeb == 6:
            typeres = typeres / 2
    elif skilltype == 2:
        if typea == 2 or typeb == 2:
            typeres = typeres / 2
        if typea == 3 or typeb == 3:
            typeres = typeres / 2
        if typea == 6 or typeb == 6:
            typeres = typeres / 2
        if typea == 17 or typeb == 17:
            typeres = typeres / 2
        if typea == 4 or typeb == 4:
            typeres = typeres * 2
        if typea == 9 or typeb == 9:
            typeres = typeres * 2
        if typea == 10 or typeb == 10:
            typeres = typeres * 2
        if typea == 11 or typeb == 11:
            typeres = typeres * 2
    elif skilltype == 3:
        if typea == 3 or typeb == 3:
            typeres = typeres / 2
        if typea == 4 or typeb == 4:
            typeres = typeres / 2
        if typea == 17 or typeb == 17:
            typeres = typeres / 2
        if typea == 2 or typeb == 2:
            typeres = typeres * 2
        if typea == 6 or typeb == 6:
            typeres = typeres * 2
        if typea == 7 or typeb == 7:
            typeres = typeres * 2
    elif skilltype == 4:
        if typea == 4 or typeb == 4:
            typeres = typeres / 2
        if typea == 2 or typeb == 2:
            typeres = typeres / 2
        if typea == 5 or typeb == 5:
            typeres = typeres / 2
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 10 or typeb == 10:
            typeres = typeres / 2
        if typea == 13 or typeb == 13:
            typeres = typeres / 2
        if typea == 17 or typeb == 17:
            typeres = typeres / 2
        if typea == 3 or typeb == 3:
            typeres = typeres * 2
        if typea == 6 or typeb == 6:
            typeres = typeres * 2
        if typea == 7 or typeb == 7:
            typeres = typeres * 2
    elif skilltype == 5:
        if typea == 6 or typeb == 6:
            typeres = typeres / 2
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 12 or typeb == 12:
            typeres = typeres / 2
        if typea == 4 or typeb == 4:
            typeres = typeres * 2
        if typea == 8 or typeb == 8:
            typeres = typeres * 2
        if typea == 10 or typeb == 10:
            typeres = typeres * 2
    elif skilltype == 6:
        if typea == 7 or typeb == 7:
            typeres = typeres / 2
        if typea == 8 or typeb == 8:
            typeres = typeres / 2
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 2 or typeb == 2:
            typeres = typeres * 2
        if typea == 5 or typeb == 5:
            typeres = typeres * 2
        if typea == 10 or typeb == 10:
            typeres = typeres * 2
        if typea == 11 or typeb == 11:
            typeres = typeres * 2
    elif skilltype == 7:
        if typea == 5 or typeb == 5:
            typeres = 0
        if typea == 4 or typeb == 4:
            typeres = typeres / 2
        if typea == 10 or typeb == 10:
            typeres = typeres / 2
        if typea == 2 or typeb == 2:
            typeres = typeres * 2
        if typea == 6 or typeb == 6:
            typeres = typeres * 2
        if typea == 9 or typeb == 9:
            typeres = typeres * 2
        if typea == 12 or typeb == 12:
            typeres = typeres * 2
        if typea == 13 or typeb == 13:
            typeres = typeres * 2
    elif skilltype == 8:
        if typea == 15 or typeb == 15:
            typeres = 0
        if typea == 5 or typeb == 5:
            typeres = typeres / 2
        if typea == 18 or typeb == 18:
            typeres = typeres / 2
        if typea == 14 or typeb == 14:
            typeres = typeres / 2
        if typea == 10 or typeb == 10:
            typeres = typeres / 2
        if typea == 13 or typeb == 13:
            typeres = typeres / 2
        if typea == 15 or typeb == 15:
            typeres = typeres / 2
        if typea == 1 or typeb == 1:
            typeres = typeres * 2
        if typea == 6 or typeb == 6:
            typeres = typeres * 2
        if typea == 9 or typeb == 9:
            typeres = typeres * 2
        if typea == 11 or typeb == 11:
            typeres = typeres * 2
        if typea == 16 or typeb == 16:
            typeres = typeres * 2
    elif skilltype == 9:
        if typea == 2 or typeb == 2:
            typeres = typeres / 2
        if typea == 3 or typeb == 3:
            typeres = typeres / 2
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 12 or typeb == 12:
            typeres = typeres / 2
        if typea == 6 or typeb == 6:
            typeres = typeres * 2
        if typea == 11 or typeb == 11:
            typeres = typeres * 2
        if typea == 18 or typeb == 18:
            typeres = typeres * 2
    elif skilltype == 10:
        if typea == 2 or typeb == 2:
            typeres = typeres / 2
        if typea == 8 or typeb == 8:
            typeres = typeres / 2
        if typea == 18 or typeb == 18:
            typeres = typeres / 2
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 5 or typeb == 5:
            typeres = typeres / 2
        if typea == 13 or typeb == 13:
            typeres = typeres / 2
        if typea == 15 or typeb == 15:
            typeres = typeres / 2
        if typea == 4 or typeb == 4:
            typeres = typeres * 2
        if typea == 14 or typeb == 14:
            typeres = typeres * 2
        if typea == 16 or typeb == 16:
            typeres = typeres * 2
    elif skilltype == 11:
        if typea == 2 or typeb == 2:
            typeres = typeres / 2
        if typea == 3 or typeb == 3:
            typeres = typeres / 2
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 11 or typeb == 11:
            typeres = typeres / 2
        if typea == 4 or typeb == 4:
            typeres = typeres * 2
        if typea == 10 or typeb == 10:
            typeres = typeres * 2
        if typea == 13 or typeb == 13:
            typeres = typeres * 2
    elif skilltype == 12:
        if typea == 2 or typeb == 2:
            typeres = typeres / 2
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 10 or typeb == 10:
            typeres = typeres / 2
        if typea == 12 or typeb == 12:
            typeres = typeres / 2
        if typea == 4 or typeb == 4:
            typeres = typeres * 2
        if typea == 7 or typeb == 7:
            typeres = typeres * 2
    elif skilltype == 13:
        if typea == 9 or typeb == 9:
            typeres = 0
        if typea == 13 or typeb == 13:
            typeres = typeres / 2
        if typea == 6 or typeb == 6:
            typeres = typeres / 2
        if typea == 15 or typeb == 15:
            typeres = typeres / 2
        if typea == 4 or typeb == 4:
            typeres = typeres * 2
        if typea == 18 or typeb == 18:
            typeres = typeres * 2
    elif skilltype == 14:
        if typea == 8 or typeb == 8:
            typeres = typeres * 2
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 16 or typeb == 16:
            typeres = 0
        if typea == 10 or typeb == 10:
            typeres = typeres / 2
    elif skilltype == 15:
        if typea == 1 or typeb == 1:
            typeres = 0
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 16 or typeb == 16:
            typeres = typeres / 2
        if typea == 13 or typeb == 13:
            typeres = typeres * 2
        if typea == 14 or typeb == 14:
            typeres = typeres * 2
    elif skilltype == 16:
        if typea == 1 or typeb == 1:
            typeres = 0
        if typea == 8 or typeb == 8:
            typeres = typeres / 2
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 15 or typeb == 15:
            typeres = typeres * 2
        if typea == 14 or typeb == 14:
            typeres = typeres * 2
    elif skilltype == 17:
        if typea == 2 or typeb == 2:
            typeres = typeres / 2
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 10 or typeb == 10:
            typeres = typeres / 2
        if typea == 16 or typeb == 16:
            typeres = typeres / 2
        if typea == 13 or typeb == 13:
            typeres = typeres * 2
        if typea == 14 or typeb == 14:
            typeres = typeres * 2
        if typea == 15 or typeb == 15:
            typeres = typeres * 2
    elif skilltype == 18:
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 10 or typeb == 10:
            typeres = typeres / 2
        if typea == 2 or typeb == 2:
            typeres = typeres * 2
        if typea == 17 or typeb == 17:
            typeres = typeres * 2
    
    return typeres

def weatherjudge(atk, type_val, weather):
    """Apply weather modifiers to attack"""
    at = atk
    if weather == 1 and type_val == 2:
        at = at * 2
    if weather == 1 and type_val == 3:
        at = at / 2
    if weather == 2 and type_val == 2:
        at = at / 2
    if weather == 2 and type_val == 3:
        at = at * 2
    return at

def printskills(skills, locked):
    """Format and display Pokemon skills"""
    from .config import TYPE_TEXTS
    MORE = "\u200b"
    res = ""
    power = ""
    accr = ""
    
    for i in range(len(skills)):
        try:
            skill_data = read_json(f"기술/{skills[i]}")
            if skill_data is None:
                res += f"{skills[i]} (데이터 읽기 오류)\n\n"
                continue
                
            if skill_data.get("damage") == 9999:
                power = "일격필살"
            elif skill_data.get("damage", 0) < 3:
                power = f"자신이 받은 데미지X{skill_data['damage']}배"
            else:
                power = skill_data["damage"]
                
            if skill_data.get("accr") == 9999:
                accr = "반드시 명중"
            else:
                accr = f"{skill_data['accr']}%"
                
            type_val = skill_data.get("type", 0)
            type_text = TYPE_TEXTS[type_val] if type_val < len(TYPE_TEXTS) else ""

            atktype = skill_data.get("atktype", 1)
            atktype_text = "물리" if atktype == 0 else "특수"

            res += f"{skills[i]} {type_text} [{atktype_text}]\n위력:{power}  PP:{skill_data.get('pp', 0)}  명중률:{accr}"
            
            addi = skill_data.get("addi", 0)
            if addi == 1:
                res += "\n💬 공격시 반동으로 1턴 쉼"
            elif addi == 3:
                res += "\n💥 공격시 1/4의 반동 데미지를 입음"
            elif addi == 2:
                res += "\n💚 공격시 1/4 데미지만큼 체력 회복"
            elif addi == 9:
                res += "\n💣 공격시 자폭하여 본인의 체력이 1이 됨"
            res += "\n\n"
        except Exception as e:
            res += f"{skills[i]} (데이터 읽기 오류)\n\n"
    
    res += MORE * 500 + "\n"
    for i in range(len(locked)):
        try:
            skill_data = read_json(f"기술/{locked[i]}")
            if skill_data is None:
                res += f"🔒{locked[i]} (데이터 읽기 오류)\n\n"
                continue
                
            if skill_data.get("damage") == 9999:
                power = "일격필살"
            elif skill_data.get("damage", 0) < 3:
                power = f"자신이 받은 데미지X{skill_data['damage']}배"
            else:
                power = skill_data["damage"]
                
            if skill_data.get("accr") == 9999:
                accr = "반드시 명중"
            else:
                accr = f"{skill_data['accr']}%"
                
            type_val = skill_data.get("type", 0)
            type_text = TYPE_TEXTS[type_val] if type_val < len(TYPE_TEXTS) else ""
            atktype = skill_data.get("atktype", 1)
            atktype_text = "물리" if atktype == 0 else "특수"
            res += f"🔒{locked[i]} {type_text} [{atktype_text}]\n위력:{power}  PP:{skill_data.get('pp', 0)}  명중률:{accr}"
            
            addi = skill_data.get("addi", 0)
            if addi == 1:
                res += "\n💬 공격시 반동으로 1턴 쉼"
            elif addi == 3:
                res += "\n💥 공격시 1/4의 반동 데미지를 입음"
            elif addi == 2:
                res += "\n💚 공격시 1/4 데미지만큼 체력 회복"
            elif addi == 9:
                res += "\n💣 공격시 자폭하여 본인의 체력이 1이 됨"
            res += "\n\n"
        except Exception as e:
            res += f"🔒{locked[i]} (데이터 읽기 오류)\n\n"
    
    return res
