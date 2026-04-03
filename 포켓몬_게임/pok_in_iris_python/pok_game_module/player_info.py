# Module 5: Player Info Display
import math
from .config import SETTING, BALL_ARR, COLLECTION_NAMES, V_TEXTS, TYPE_TEXTS
from .io_helpers import read_json, printskills, pokimglink, send_image

def handle_info(sender, chat):
    """Handle trainer info command (@트레이너정보)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    res = f"@{sender} 트레이너 정보\n"
    res += f"등급: {pokUser.get('rank', '없음')}\n"
    res += f"리본: {pokUser.get('ribbon', '없음')}\n"
    res += f"골드: {pokUser.get('gold', 0):,}\n"
    res += f"볼: {pokUser.get('balls', 0)}개 ({pokUser.get('Ball', BALL_ARR[0])})\n"
    res += f"체력: {pokUser.get('hp', 0)}/{pokUser.get('maxHp', 0)}\n"
    res += f"발견 횟수: {pokUser.get('count', {}).get('total', 0)}\n"
    res += f"포획 성공: {pokUser.get('count', {}).get('succ', 0)}\n"
    res += f"배틀 횟수: {pokUser.get('battlecount', {}).get('total', 0)}\n"
    res += f"승리: {pokUser.get('battlecount', {}).get('win', 0)}\n"
    res += f"패배: {pokUser.get('battlecount', {}).get('lose', 0)}\n"
    res += f"뱃지: {pokUser.get('badge', 0)}개"
    
    chat.reply(res)

def handle_box(sender, chat):
    """Handle pokemon box command (@내 포켓몬)"""
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    deck = pokInv.get("deck", [])
    box = pokInv.get("box", [])
    
    res = f"@{sender}님의 포켓몬 상자\n"
    res += f"덱: {len(deck)}마리\n"
    res += f"상자: {len(box)}마리\n\n"
    res+="\u200b"*500
    
    if deck:
        res += "[덱]\n"
        for i, pok in enumerate(deck[:6]):
            v_text = V_TEXTS[pok.get('v', 1)] if pok.get('v', 1) < len(V_TEXTS) else f"V{pok.get('v', 1)}"
            res += f"{i+1}. Lv.{pok.get('level', 0)} {pok.get('name', '???')} [{pok.get('hp', 0)}HP] {v_text}\n"
    
    if box:
        res += f"\n[상자 - {len(box)}마리]\n"
        for i, pok in enumerate(box):
            v_text = V_TEXTS[pok.get('v', 1)] if pok.get('v', 1) < len(V_TEXTS) else f"V{pok.get('v', 1)}"
            lock_mark = "🔒" if pok.get('islocked', 0) == 1 else ""
            res += f"{i+1}. {lock_mark}Lv.{pok.get('level', 0)} {pok.get('name', '???')} {v_text}\n"
    
    chat.reply(res)

def handle_pokinfo(sender, chat, args=None):
    """Handle pokemon info command (@포켓몬정보)"""
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {SETTING["pokinfo"]} [상자번호]')
        return
    
    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    if n < 1 or n > len(pokInv.get("box", [])):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    p = pokInv["box"][n - 1]
    
    # Build description
    v_text = V_TEXTS[p.get('v', 1)] if p.get('v', 1) < len(V_TEXTS) else f"V{p.get('v', 1)}"
    
    type1 = read_json(f"포켓몬/{p['name']}", "type1") or 1
    type2 = read_json(f"포켓몬/{p['name']}", "type2") or 1
    
    pokdesc = v_text
    if type1 > 0:
        pokdesc += " " + TYPE_TEXTS[type1]
    if type2 > 0 and type2 != type1:
        pokdesc += " " + TYPE_TEXTS[type2]
    
    # Get image via KakaoTalk link
    try:
        img = pokimglink(p["name"], p.get("formchange", 0))
        send_image(None, chat, 58796, {
            'POKIMG': img,
            'POKNAME': f"Lv.{p['level']} {p['name']}",
            'DESC': pokdesc,
            'LINK': f"ko/wiki/{p['name']}_(포켓몬)"
        })
    except:
        pass
    
    # Skills
    if p["name"] == "메타몽":
        skills_text = "변신"
    else:
        skills_text = printskills(p.get("skills", []), p.get("skillslocked", []))
    
    res = f"Lv.{p['level']} {p['name']}\n"
    res += f"HP:{p['hp']} ATK:{p['atk']} DEF:{p['def']} SPD:{p['spd']}\n"
    res += f"{pokdesc}\n\n"
    res += skills_text
    
    chat.reply(res)

def handle_dpokinfo(sender, chat, args=None):
    """Handle deck info command (@덱정보)"""
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {SETTING["dpokinfo"]} [덱번호]')
        return
    
    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    if n < 1 or n > len(pokInv.get("deck", [])):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    p = pokInv["deck"][n - 1]
    
    # Build description
    v_text = V_TEXTS[p.get('v', 1)] if p.get('v', 1) < len(V_TEXTS) else f"V{p.get('v', 1)}"
    
    if p.get("formchange", 0) > 0:
        type1 = read_json(f"포켓몬/{p['name']}_{p['formchange']}", "type1") or 1
        type2 = read_json(f"포켓몬/{p['name']}_{p['formchange']}", "type2") or 1
    else:
        type1 = read_json(f"포켓몬/{p['name']}", "type1") or 1
        type2 = read_json(f"포켓몬/{p['name']}", "type2") or 1
    
    pokdesc = v_text
    if type1 > 0:
        pokdesc += " " + TYPE_TEXTS[type1]
    if type2 > 0 and type2 != type1:
        pokdesc += " " + TYPE_TEXTS[type2]
    
    # Get image via KakaoTalk link
    try:
        img = pokimglink(p["name"], p.get("formchange", 0))
        send_image(None, chat, 58796, {
            'POKIMG': img,
            'POKNAME': f"Lv.{p['level']} {p['name']}",
            'DESC': pokdesc,
            'LINK': f"ko/wiki/{p['name']}_(포켓몬)"
        })
    except:
        pass
    
    # Skills
    if p["name"] == "메타몽":
        skills_text = "변신"
    else:
        skills_text = printskills(p.get("skills", []), p.get("skillslocked", []))
    
    res = f"Lv.{p['level']} {p['name']}\n"
    res += f"HP:{p['hp']} ATK:{p['atk']} DEF:{p['def']} SPD:{p['spd']}\n"
    res += f"{pokdesc}\n\n"
    res += skills_text
    
    chat.reply(res)
