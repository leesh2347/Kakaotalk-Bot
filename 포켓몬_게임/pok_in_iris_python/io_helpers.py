# IO Helpers Module - File I/O and utility functions
import json
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
    """
    try:
        # TODO: Implement actual KakaoTalk link sending
        # This requires integration with the Iris framework's KakaoTalk API
        # For now, fall back to text reply with image URL
        if 'POKIMG' in template_args:
            chat.reply(f"이미지: {template_args['POKIMG']}\n{template_args.get('POKNAME', '')}\n{template_args.get('DESC', '')}")
        elif 'player1img' in template_args:
            chat.reply(f"⚔️배틀\n{template_args['player1']}\n{template_args['player1desc']}\nvs\n{template_args['player2']}\n{template_args['player2desc']}")
        else:
            chat.reply(f"카카오링크 전송 (template_id: {template_id})")
    except Exception as e:
        # Fallback to text
        if 'player1img' in template_args:
            chat.reply(f"카카오링크 오류. 리셋 한번 해주세요.\n\n{template_args.get('player1', '')}\n{template_args.get('player1desc', '')}\n\n{template_args.get('player2', '')}\n{template_args.get('player2desc', '')}")
        else:
            chat.reply(f"카카오링크 오류. 리셋 한번 해주세요.")

def fetch_url(url):
    """Fetch URL content"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def pokimglink(pokename, formchange):
    """Get Pokemon image URL"""
    from .config import MEGA_AFTER_NAMES, MEGA_PICTURES, SPECIAL_IMG_POKS, SPECIAL_POKS_IMAGE, FORM_CHANGE_NAMES, FORM_CHANGE_IMAGE
    
    imgg = ""
    if pokename in MEGA_AFTER_NAMES:
        idx = MEGA_AFTER_NAMES.index(pokename)
        if idx < len(MEGA_PICTURES):
            imgg = MEGA_PICTURES[idx]
    elif pokename in SPECIAL_IMG_POKS:
        idx = SPECIAL_IMG_POKS.index(pokename)
        if idx < len(SPECIAL_POKS_IMAGE):
            imgg = SPECIAL_POKS_IMAGE[idx]
    elif formchange > 0 and pokename in FORM_CHANGE_NAMES:
        if pokename != "아르세우스":
            if pokename in FORM_CHANGE_IMAGE and formchange < len(FORM_CHANGE_IMAGE[pokename]):
                imgg = FORM_CHANGE_IMAGE[pokename][formchange]
        else:
            imgg = ""
    else:
        imgg = ""
    return imgg

def typejudge(skilltype, typea, typeb):
    """Calculate type effectiveness"""
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
        if typea == 8 or typeb == 8:
            typeres = typeres / 2
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 16 or typeb == 16:
            typeres = typeres / 2
        if typea == 3 or typeb == 3:
            typeres = typeres * 2
        if typea == 5 or typeb == 5:
            typeres = typeres * 2
    elif skilltype == 14:
        if typea == 9 or typeb == 9:
            typeres = typeres / 2
        if typea == 13 or typeb == 13:
            typeres = typeres / 2
        if typea == 16 or typeb == 16:
            typeres = typeres / 2
        if typea == 4 or typeb == 4:
            typeres = typeres * 2
        if typea == 18 or typeb == 18:
            typeres = typeres * 2
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
            res += f"{skills[i]} {type_text}\n위력:{power}  PP:{skill_data.get('pp', 0)}  명중률:{accr}"
            
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
            res += f"🔒{locked[i]} {type_text}\n위력:{power}  PP:{skill_data.get('pp', 0)}  명중률:{accr}"
            
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
