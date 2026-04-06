# Module 6: Pokemon Training
import random
import math
import time
from .config import SETTING, MEGA_NAMES, MEGA_AFTER_NAMES, FORM_CHANGE_NAMES, FORM_CHANGE_STATUS, POK_ARR, CMDS
from .io_helpers import read_json, write_json, printskills, pokimglink

def handle_levelup(sender, chat, args=None):
    """Handle level up command (@레벨업)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("deck"):
        chat.reply(f'@{sender}\n덱에 포켓몬이 없어요!')
        return
    
    # Parse arguments
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {SETTING["levelup"]} [덱번호] [레벨량]\n예: {SETTING["levelup"]} 1 10')
        return
    
    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    if n < 1 or n > len(pokInv["deck"]):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    n2 = int(parts[1]) if len(parts) > 1 else 1
    if n2 < 1 or n2 > SETTING["maxlevel"] - 1:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    p = pokInv["deck"][n - 1]
    old_level = p["level"]
    
    # Calculate cost
    totalcosts = 0
    for j in range(1, n2 + 1):
        cost = 10 * (p["level"] + j) ** 3
        
        # Group5 or 다부니: x2
        if p["name"] in POK_ARR["group5"] or p["name"] == "다부니":
            cost *= 2
        
        # Level-based multiplier
        if p["level"] + j > 150:
            cost *= 2
        elif p["level"] + j > 100:
            cost *= 1.5
        
        # Over 200: x5
        if p["level"] + j > 200:
            cost *= 5
        
        totalcosts += cost
    
    # Apply discounts
    discount = pokUser.get("upgradedc", 0)
    if 18 in pokUser.get("activecollection", []):
        discount += pokUser.get("collectionlev", 1) * 5
    
    totalcosts = math.ceil(totalcosts * (100 - discount) / 100)
    
    # Check level cap
    if p["level"] + n2 > SETTING["maxlevel"]:
        chat.reply(f'@{sender}\n레벨 상한({SETTING["maxlevel"]})에 도달했어요!')
        return
    
    # Check gold
    if pokUser.get("gold", 0) < totalcosts:
        chat.reply(f'@{sender}\n골드가 부족해요!\n필요 골드: {totalcosts:,}\n보유 골드: {pokUser.get("gold", 0):,}')
        return
    
    # Check evolution
    preup = p["name"]
    up = read_json(f"포켓몬/{p['name']}", "nextup")

    if up and up != "x":
        # Handle multiple evolution paths (e.g., "이브이/피카츄")
        if "/" in up:
            up_options = up.split("/")
            up = random.choice(up_options)
        
        # Level up to new evolution
        new_pok = p.copy()
        new_pok["name"] = up
        
        # Recalculate stats
        new_pok["level"] = p["level"] + n2
        new_pok["hp"] = math.ceil((read_json(f"포켓몬/{up}", "hp") or 50) * new_pok["level"] / 50)
        new_pok["atk"] = math.ceil((read_json(f"포켓몬/{up}", "atk") or 50) * new_pok["level"] / 50)
        new_pok["def"] = math.ceil((read_json(f"포켓몬/{up}", "def") or 50) * new_pok["level"] / 50)
        new_pok["spd"] = math.ceil((read_json(f"포켓몬/{up}", "spd") or 50) * new_pok["level"] / 50)
        
        # Apply V bonus
        if new_pok.get("v", 0) > 0:
            v_bonus = (10 + new_pok["v"]) / 10
            new_pok["hp"] = math.ceil(new_pok["hp"] * v_bonus)
            new_pok["atk"] = math.ceil(new_pok["atk"] * v_bonus)
            new_pok["def"] = math.ceil(new_pok["def"] * v_bonus)
            new_pok["spd"] = math.ceil(new_pok["spd"] * v_bonus)
        
        pokInv["deck"][n - 1] = new_pok
        p = new_pok
        
        # Register in collection
        pokCol = read_json(f"player_{sender}_collection")
        if pokCol:
            from .config import COLLECTION_NAMES, COLLECTION_CONTENTS
            for ii in COLLECTION_NAMES:
                idx = COLLECTION_NAMES.index(ii)
                if up in COLLECTION_CONTENTS[idx]:
                    if ii not in pokCol:
                        pokCol[ii] = []
                    if up not in pokCol[ii]:
                        pokCol[ii].append(up)
                        chat.reply(f"@{sender}\n도감의 [{ii}] 에 새로운 포켓몬이 등록되었습니다.")
                    break
            write_json(f"player_{sender}_collection", pokCol)
    else:
        # Just level up
        p["level"] += n2
        p["hp"] = math.ceil((read_json(f"포켓몬/{p['name']}", "hp") or 50) * p["level"] / 50)
        p["atk"] = math.ceil((read_json(f"포켓몬/{p['name']}", "atk") or 50) * p["level"] / 50)
        p["def"] = math.ceil((read_json(f"포켓몬/{p['name']}", "def") or 50) * p["level"] / 50)
        p["spd"] = math.ceil((read_json(f"포켓몬/{p['name']}", "spd") or 50) * p["level"] / 50)
        
        # Apply V bonus
        if p.get("v", 0) > 0:
            v_bonus = (10 + p["v"]) / 10
            p["hp"] = math.ceil(p["hp"] * v_bonus)
            p["atk"] = math.ceil(p["atk"] * v_bonus)
            p["def"] = math.ceil(p["def"] * v_bonus)
            p["spd"] = math.ceil(p["spd"] * v_bonus)
        
        pokInv["deck"][n - 1] = p
    
    # Deduct gold
    pokUser["gold"] -= totalcosts
    
    write_json(f"player_{sender}_inv", pokInv)
    write_json(f"player_{sender}", pokUser)
    
    res = f"{totalcosts:,}원 지불.\n보유금액: {pokUser['gold']:,}원\n\n"
    res += f"Lv.{old_level} > Lv.{p['level']} {p['name']}\n\n"
    res += f"HP:{p['hp']} ATK:{p['atk']} DEF:{p['def']} SPD:{p['spd']}"
    
    chat.reply(f"@{sender}\n{res}")

def handle_skillchange(sender, chat, args=None):
    """Handle skill change command (@스킬뽑기)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("deck"):
        chat.reply(f'@{sender}\n덱에 포켓몬이 없어요!')
        return
    
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {SETTING["skillchange"]} [덱번호]')
        return
    
    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    if n < 1 or n > len(pokInv["deck"]):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    p = pokInv["deck"][n - 1]
    
    # Calculate cost based on locked skills count
    skillcosts = [100000, 1000000, 10000000, 50000000, 0]
    locked_count = len(p.get("skillslocked", []))
    if locked_count >= len(skillcosts):
        chat.reply(f'@{sender}\n더 이상 스킬을 뽑을 수 없어요!')
        return
    
    cost = skillcosts[locked_count]
    discount = pokUser.get("upgradedc", 0)
    cost = math.ceil(cost * (100 - discount) / 100)
    
    if pokUser.get("gold", 0) < cost:
        chat.reply(f'@{sender}\n골드가 부족해요!\n필요 골드: {cost:,}\n보유 골드: {pokUser.get("gold", 0):,}')
        return
    
    # Get skills from Pokemon data
    if p.get("formchange", 0) > 0:
        skillsarr = read_json(f"포켓몬/{p['name']}_{p['formchange']}", "skills") or []
    else:
        skillsarr = read_json(f"포켓몬/{p['name']}", "skills") or []
    
    # Check if Pokemon has enough skills
    if len(skillsarr) < 5 or locked_count > 3:
        chat.reply(f'@{sender}\n{p["name"]}은(는) 바꿀 스킬이 없어요!')
        return
    
    # Clear current skills and pick new ones
    locked_skills = p.get("skillslocked", [])[:]
    new_skills_count = 4 - len(locked_skills)
    
    caughtpokskills = []
    while len(caughtpokskills) < new_skills_count:
        t = random.choice(skillsarr)
        t = t.replace("DP", "").replace("Pt", "")
        if t not in caughtpokskills and t not in locked_skills:
            caughtpokskills.append(t)
    
    p["skills"] = caughtpokskills
    p["skillslocked"] = locked_skills
    
    pokInv["deck"][n - 1] = p
    pokUser["gold"] -= cost
    
    write_json(f"player_{sender}_inv", pokInv)
    write_json(f"player_{sender}", pokUser)

    res = f"{cost:,}원 지불.\n보유금액: {pokUser['gold']:,}원\n\n"
    res += printskills(p["skills"], p["skillslocked"])

    chat.reply(f"@{sender}\n{res}")

def handle_skilllock(sender, chat, args=None):
    """Handle skill lock command (@스킬잠금)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    if not pokInv.get("deck"):
        chat.reply(f'@{sender}\n스킬 잠금 및 해제는 덱에 장착된 포켓몬만 가능해요.\n먼저 포켓몬을 덱에 장착해 주세요.')
        return

    parts = args.split() if args else []
    if len(parts) < 2:
        chat.reply(f'@{sender}\n사용법: {CMDS["skilllock"]} [덱번호] [스킬번호]')
        return

    try:
        n1 = int(parts[0])
        n2 = int(parts[1])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    if n1 < 1 or n1 > len(pokInv["deck"]):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    if n2 < 1 or n2 > 4:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    p = pokInv["deck"][n1 - 1]

    if n2 > len(p.get("skills", [])):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    # Move skill from skills to skillslocked
    skill_name = p["skills"][n2 - 1]
    p["skillslocked"].append(skill_name)
    p["skills"].pop(n2 - 1)

    pokInv["deck"][n1 - 1] = p
    write_json(f"player_{sender}_inv", pokInv)

    res = f"Lv.{p['level']} {p['name']}의 기술\n{'\u200b' * 500}\n"
    res += printskills(p["skills"], p["skillslocked"])
    chat.reply(f"@{sender}\n{res}")

def handle_skillunlock(sender, chat, args=None):
    """Handle skill unlock command (@스킬잠금해제)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    if not pokInv.get("deck"):
        chat.reply(f'@{sender}\n스킬 잠금 및 해제는 덱에 장착된 포켓몬만 가능해요.\n먼저 포켓몬을 덱에 장착해 주세요.')
        return

    parts = args.split() if args else []
    if len(parts) < 2:
        chat.reply(f'@{sender}\n사용법: {CMDS["skillunlock"]} [덱번호] [스킬번호]')
        return

    try:
        n1 = int(parts[0])
        n2 = int(parts[1])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    if n1 < 1 or n1 > len(pokInv["deck"]):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    if n2 < 1 or n2 > 4:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    p = pokInv["deck"][n1 - 1]

    if n2 > len(p.get("skillslocked", [])):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    # Move skill from skillslocked to skills
    skill_name = p["skillslocked"][n2 - 1]
    p["skills"].append(skill_name)
    p["skillslocked"].pop(n2 - 1)

    pokInv["deck"][n1 - 1] = p
    write_json(f"player_{sender}_inv", pokInv)

    res = f"Lv.{p['level']} {p['name']}의 기술\n{'\u200b' * 500}\n"
    res += printskills(p["skills"], p["skillslocked"])
    chat.reply(f"@{sender}\n{res}")

def handle_effort(sender, chat, args=None):
    """Handle effort value upgrade command (@노력치강화)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("deck"):
        chat.reply(f'@{sender}\n덱에 포켓몬이 없어요!')
        return
    
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {SETTING["effort"]} [덱번호] [상자번호 or 금왕관]')
        return
    
    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    if n < 1 or n > len(pokInv["deck"]):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    p = pokInv["deck"][n - 1]
    
    # Check V max
    if p.get("v", 0) >= 6:
        chat.reply(f'@{sender}\nV가 이미 최대(❻)에요!')
        return
    
    iscrown = False
    n2 = None
    
    if len(parts) > 1:
        if parts[1] == "금왕관":
            iscrown = True
        else:
            try:
                n2 = int(parts[1])
            except:
                chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
                return
    
    # Check for gold crown or box material
    if not iscrown and n2 is None:
        if "금왕관" not in pokInv.get("item", []):
            chat.reply(f'@{sender}\n금왕관이 없어요!\n상자에서 포켓몬을 소재로 사용하거나 금왕관을 사용하세요.')
            return
        iscrown = True
    
    if n2 is not None:
        if n2 < 1 or n2 > len(pokInv.get("box", [])):
            chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
            return
        
        material_pok = pokInv["box"][n2 - 1]
        if material_pok.get("islocked", 0) == 1:
            chat.reply(f'@{sender}\n잠긴 포켓몬은 소재로 사용할 수 없어요!')
            return
    
    # Calculate cost
    v = p.get("v", 0)
    totalcosts = 500000000 * (v + 1)
    
    # Mega-evolved: /10
    if p["name"] in MEGA_AFTER_NAMES:
        totalcosts //= 10
    
    # Group unknown: /2
    if p["name"] in POK_ARR["groupunknown"]:
        totalcosts //= 2
    
    # Group4: x3
    if p["name"] in POK_ARR["group4"]:
        totalcosts *= 3
    
    # Group5: x5
    if p["name"] in POK_ARR["group5"]:
        totalcosts *= 5
    
    # Collection 18 discount
    if 18 in pokUser.get("activecollection", []):
        totalcosts = math.ceil(totalcosts * (100 - pokUser.get("collectionlev", 1) * 5) / 100)
    
    if pokUser.get("gold", 0) < totalcosts:
        chat.reply(f'@{sender}\n골드가 부족해요!\n필요 골드: {totalcosts:,}\n보유 골드: {pokUser.get("gold", 0):,}')
        return
    
    # Upgrade V
    old_v = p.get("v", 0)
    p["v"] = old_v + 1
    
    # Recalculate stats
    if p.get("formchange", 0) > 0:
        base_hp = read_json(f"포켓몬/{p['name']}_{p['formchange']}", "hp") or 50
        base_atk = read_json(f"포켓몬/{p['name']}_{p['formchange']}", "atk") or 50
        base_def = read_json(f"포켓몬/{p['name']}_{p['formchange']}", "def") or 50
        base_spd = read_json(f"포켓몬/{p['name']}_{p['formchange']}", "spd") or 50
    else:
        base_hp = read_json(f"포켓몬/{p['name']}", "hp") or 50
        base_atk = read_json(f"포켓몬/{p['name']}", "atk") or 50
        base_def = read_json(f"포켓몬/{p['name']}", "def") or 50
        base_spd = read_json(f"포켓몬/{p['name']}", "spd") or 50
    
    p["hp"] = math.ceil(base_hp * p["level"] / 50)
    p["atk"] = math.ceil(base_atk * p["level"] / 50)
    p["def"] = math.ceil(base_def * p["level"] / 50)
    p["spd"] = math.ceil(base_spd * p["level"] / 50)
    
    # Apply V bonus
    v_bonus = (10 + p["v"]) / 10
    p["hp"] = math.ceil(p["hp"] * v_bonus)
    p["atk"] = math.ceil(p["atk"] * v_bonus)
    p["def"] = math.ceil(p["def"] * v_bonus)
    p["spd"] = math.ceil(p["spd"] * v_bonus)
    
    pokInv["deck"][n - 1] = p
    
    # Consume material
    material_name = ""
    if iscrown:
        pokInv["item"].remove("금왕관")
        material_name = "금왕관"
    else:
        oldpok = pokInv["box"][n2 - 1]["name"]
        pokInv["box"].pop(n2 - 1)
        material_name = f"Lv.{oldpok}"
    
    pokUser["gold"] -= totalcosts
    
    write_json(f"player_{sender}_inv", pokInv)
    write_json(f"player_{sender}", pokUser)
    
    res = f"{totalcosts:,}원 지불, {material_name} 소모.\n"
    res += f"보유금액: {pokUser['gold']:,}원\n\n"
    res += f"Lv.{p['level']} {p['name']} ({old_v}V > {p['v']}V)\n\n"
    res += f"HP:{p['hp']} ATK:{p['atk']} DEF:{p['def']} SPD:{p['spd']}"
    
    chat.reply(f"@{sender}\n{res}")

def handle_mega(sender, chat, args=None):
    """Handle mega evolution command (@메가진화)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("deck"):
        chat.reply(f'@{sender}\n덱에 포켓몬이 없어요!')
        return
    
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {SETTING["mega"]} [덱번호]')
        return
    
    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    if n < 1 or n > len(pokInv["deck"]):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    p = pokInv["deck"][n - 1]
    
    # Check if Pokemon can mega evolve
    if p["name"] not in MEGA_NAMES:
        chat.reply(f'@{sender}\n{p["name"]}은(는) 메가진화할 수 없어요!')
        return
    
    # Special case: Necrozma needs formchange
    if p["name"] == "네크로즈마" and p.get("formchange", 0) == 0:
        chat.reply(f'@{sender}\n네크로즈마는 폼체인지 후 메가진화할 수 있어요!')
        return
    
    # Check if deck already has mega
    ismegaexists = 0
    for deck_pok in pokInv["deck"]:
        if deck_pok["name"] in MEGA_AFTER_NAMES:
            ismegaexists = 1
            break
    
    if ismegaexists == 1:
        chat.reply(f'@{sender}\n이미 덱에 메가진화한 포켓몬이 있어요. 메가진화는 덱에 1마리만 장착 가능해요.')
        return
    
    # Check level
    if p["level"] < 200:
        chat.reply(f'@{sender}\n메가진화는 레벨 200 이상이어야 해요!')
        return
    
    # Cost: 2 billion
    skillcosts = 2000000000
    
    if pokUser.get("gold", 0) < skillcosts:
        chat.reply(f'@{sender}\n골드가 부족해요!\n필요 골드: {skillcosts:,}\n보유 골드: {pokUser.get("gold", 0):,}')
        return
    
    # Determine new name
    oldname = p["name"]
    
    if p["name"] in ["리자몽", "뮤츠"]:
        newname = f"메가{p['name']}{'X' if random.randint(0, 1) == 0 else 'Y'}"
    elif p["name"] in ["그란돈", "가이오가"]:
        newname = f"원시{p['name']}"
    elif p["name"] == "네크로즈마":
        newname = "울트라네크로즈마"
    else:
        newname = f"메가{p['name']}"
    
    # Recalculate stats with new name
    new_hp = read_json(f"포켓몬/{newname}", "hp") or 50
    new_atk = read_json(f"포켓몬/{newname}", "atk") or 50
    new_def = read_json(f"포켓몬/{newname}", "def") or 50
    new_spd = read_json(f"포켓몬/{newname}", "spd") or 50
    
    p["name"] = newname
    p["hp"] = math.ceil(new_hp * p["level"] / 50)
    p["atk"] = math.ceil(new_atk * p["level"] / 50)
    p["def"] = math.ceil(new_def * p["level"] / 50)
    p["spd"] = math.ceil(new_spd * p["level"] / 50)
    
    # Apply V bonus
    if p.get("v", 0) > 0:
        v_bonus = (10 + p["v"]) / 10
        p["hp"] = math.ceil(p["hp"] * v_bonus)
        p["atk"] = math.ceil(p["atk"] * v_bonus)
        p["def"] = math.ceil(p["def"] * v_bonus)
        p["spd"] = math.ceil(p["spd"] * v_bonus)
    
    p["formchange"] = 0
    
    pokInv["deck"][n - 1] = p
    pokUser["gold"] -= skillcosts
    
    write_json(f"player_{sender}_inv", pokInv)
    write_json(f"player_{sender}", pokUser)
    
    chat.reply(f"@{sender}\n{oldname}이(가) {newname}(으)로 메가진화했어요!")
    
    res = f"{skillcosts:,}원 지불.\n보유금액: {pokUser['gold']:,}원\n\n"
    res += f"HP:{p['hp']} ATK:{p['atk']} DEF:{p['def']} SPD:{p['spd']}"
    
    chat.reply(f"@{sender}\n{res}")

def handle_formchange(sender, chat, args=None):
    """Handle form change command (@폼체인지)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("deck"):
        chat.reply(f'@{sender}\n덱에 포켓몬이 없어요!')
        return
    
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {SETTING["formchange"]} [덱번호]')
        return
    
    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    if n < 1 or n > len(pokInv["deck"]):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    p = pokInv["deck"][n - 1]
    
    # Check if Pokemon can form change
    if p["name"] not in FORM_CHANGE_NAMES:
        chat.reply(f'@{sender}\n{p["name"]}은(는) 폼체인지할 수 없어요!')
        return
    
    # Cost: 10 million with discount
    skillcosts = 10000000
    discount = pokUser.get("upgradedc", 0)
    skillcosts = math.ceil(skillcosts * (100 - discount) / 100)
    
    if pokUser.get("gold", 0) < skillcosts:
        chat.reply(f'@{sender}\n골드가 부족해요!\n필요 골드: {skillcosts:,}\n보유 골드: {pokUser.get("gold", 0):,}')
        return
    
    # Special requirements
    if p["name"] == "큐레무":
        pokCol = read_json(f"player_{sender}_collection")
        has_zekrom = False
        has_reshiram = False
        if pokCol:
            for region in pokCol.values():
                if "제크로무" in region:
                    has_zekrom = True
                if "레시라무" in region:
                    has_reshiram = True
        
        if not has_zekrom or not has_reshiram:
            chat.reply(f'@{sender}\n큐레무 폼체인지에는 제크로무와 레시라무가 도감에 등록되어 있어야 해요!')
            return
    
    if p["name"] == "네크로즈마":
        pokCol = read_json(f"player_{sender}_collection")
        has_solgaleo = False
        has_lunala = False
        if pokCol:
            for region in pokCol.values():
                if "솔가레오" in region:
                    has_solgaleo = True
                if "루나아라" in region:
                    has_lunala = True
        
        if not has_solgaleo or not has_lunala:
            chat.reply(f'@{sender}\n네크로즈마 폼체인지에는 솔가레오와 루나아라가 도감에 등록되어 있어야 해요!')
            return
    
    # Random new form (different from current)
    forms = FORM_CHANGE_STATUS[p["name"]]
    newform = p.get("formchange", 0)
    while newform == p.get("formchange", 0):
        newform = random.randint(0, len(forms) - 1)
    
    oldname = forms[p.get("formchange", 0)]
    newname = forms[newform]
    
    # Recalculate stats
    if newform > 0:
        base_hp = read_json(f"포켓몬/{p['name']}_{newform}", "hp") or 50
        base_atk = read_json(f"포켓몬/{p['name']}_{newform}", "atk") or 50
        base_def = read_json(f"포켓몬/{p['name']}_{newform}", "def") or 50
        base_spd = read_json(f"포켓몬/{p['name']}_{newform}", "spd") or 50
    else:
        base_hp = read_json(f"포켓몬/{p['name']}", "hp") or 50
        base_atk = read_json(f"포켓몬/{p['name']}", "atk") or 50
        base_def = read_json(f"포켓몬/{p['name']}", "def") or 50
        base_spd = read_json(f"포켓몬/{p['name']}", "spd") or 50
    
    p["formchange"] = newform
    p["hp"] = math.ceil(base_hp * p["level"] / 50)
    p["atk"] = math.ceil(base_atk * p["level"] / 50)
    p["def"] = math.ceil(base_def * p["level"] / 50)
    p["spd"] = math.ceil(base_spd * p["level"] / 50)
    
    # Apply V bonus
    if p.get("v", 0) > 0:
        v_bonus = (10 + p["v"]) / 10
        p["hp"] = math.ceil(p["hp"] * v_bonus)
        p["atk"] = math.ceil(p["atk"] * v_bonus)
        p["def"] = math.ceil(p["def"] * v_bonus)
        p["spd"] = math.ceil(p["spd"] * v_bonus)
    
    pokInv["deck"][n - 1] = p
    pokUser["gold"] -= skillcosts
    
    write_json(f"player_{sender}_inv", pokInv)
    write_json(f"player_{sender}", pokUser)
    
    res = f"{skillcosts:,}원 지불.\n보유금액: {pokUser['gold']:,}원\n\n"
    res += f"{oldname} > {newname}\n\n"
    res += f"HP:{p['hp']} ATK:{p['atk']} DEF:{p['def']} SPD:{p['spd']}"
    
    chat.reply(f"@{sender}\n{res}")

def handle_lock(sender, chat, args=None):
    """Handle lock to deck command (@덱)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {SETTING["lock"]} [상자번호]')
        return
    
    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    if n < 1 or n > len(pokInv.get("box", [])):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    # Check deck size
    if len(pokInv.get("deck", [])) >= 6:
        chat.reply(f'@{sender}\n배틀용 덱은 6마리까지만 장착할 수 있어요.')
        return
    
    # Check if mega already in deck
    ismegaexists = 0
    for deck_pok in pokInv.get("deck", []):
        if deck_pok["name"] in MEGA_AFTER_NAMES:
            ismegaexists = 1
            break
    
    p = pokInv["box"][n - 1]
    if ismegaexists == 1 and p["name"] in MEGA_AFTER_NAMES:
        chat.reply(f'@{sender}\n이미 덱에 메가진화한 포켓몬이 있어요. 메가진화는 덱에 1마리만 장착 가능해요.')
        return
    
    # Move from box to deck
    pokInv["box"].pop(n - 1)
    pokInv["deck"].append(p)
    
    write_json(f"player_{sender}_inv", pokInv)
    
    chat.reply(f"@{sender}\nLv.{p['level']} {p['name']}(을)를 덱으로 이동했어요!")

def handle_unlock(sender, chat, args=None):
    """Handle unlock from deck command (@박스)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {SETTING["unlock"]} [덱번호]')
        return
    
    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    if n < 1 or n > len(pokInv.get("deck", [])):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    # Move from deck to box
    p = pokInv["deck"].pop(n - 1)
    pokInv["box"].append(p)
    
    write_json(f"player_{sender}_inv", pokInv)
    
    chat.reply(f"@{sender}\nLv.{p['level']} {p['name']}(을)를 보관함으로 이동했어요!")

def handle_sell(sender, chat, args=None):
    """Handle sell/release pokemon command (@놓아주기)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("box"):
        chat.reply(f'@{sender}\n상자에 포켓몬이 없어요!')
        return

    parts = args.split() if args else []

    money = 0
    tempbox = []
    isselective = False
    startn = 0
    endn = len(pokInv["box"]) - 1

    if len(parts) >= 2:
        # Selective sell by range
        try:
            startn = int(parts[0]) - 1
            endn = int(parts[1]) - 1
            isselective = True
        except:
            chat.reply(f'@{sender}\n{CMDS["sell"]}(시작 박스 번호) (끝 박스 번호)형태로 숫자로 입력해 주세요.')
            return

        if startn < 0 or endn >= len(pokInv["box"]) or startn > endn:
            chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
            return

    # If no args, sell all non-locked Pokemon

    for i, pok in enumerate(pokInv["box"]):
        if pok.get("islocked", 0) == 1 or i < startn or i > endn:
            tempbox.append(pok)
        else:
            pokmoney = 3000 * pok["level"] ** 2

            if pok["name"] in POK_ARR["group4"] or pok["name"] == "다부니":
                pokmoney *= 5
            elif pok["name"] in MEGA_AFTER_NAMES or pok["name"] in POK_ARR["group5"]:
                pokmoney *= 10

            money += pokmoney

    if money == 0:
        chat.reply(f'@{sender}\n놓아줄 포켓몬이 없어요!')
        return

    # Apply collection 19 bonus
    if 19 in pokUser.get("activecollection", []):
        money = math.ceil(money * (pokUser.get("collectionlev", 1) * 10 + 100) / 100)

    # Apply event gold multiplier
    money = math.ceil(money * SETTING.get("eventp", {}).get("goldX", 1))

    pokInv["box"] = tempbox
    pokUser["gold"] += money

    write_json(f"player_{sender}_inv", pokInv)
    write_json(f"player_{sender}", pokUser)

    if not isselective:
        chat.reply(f"@{sender}\n잠금상태의 포켓몬을 제외한 박스의 모든 포켓몬을 놓아주었어요.\n{money:,}원 획득.\n\n보유금액: {pokUser['gold']:,}원")
    else:
        chat.reply(f"@{sender}\n박스의 {startn + 1}번 ~ {endn + 1}번 중 잠금상태의 포켓몬을 제외한 포켓몬을 놓아주었어요.\n{money:,}원 획득.\n\n보유금액: {pokUser['gold']:,}원")

def handle_boxlock(sender, chat, args=None):
    """Handle box lock command (@잠금)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {CMDS["boxlock"]} [상자번호]')
        return

    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    if n < 1 or n > len(pokInv.get("box", [])):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    pokInv["box"][n - 1]["islocked"] = 1
    write_json(f"player_{sender}_inv", pokInv)

    p = pokInv["box"][n - 1]
    chat.reply(f"@{sender}\n박스의 Lv.{p['level']} {p['name']}(을)를 잠금 완료했어요!")

def handle_boxunlock(sender, chat, args=None):
    """Handle box unlock command (@잠금해제)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {CMDS["boxunlock"]} [상자번호]')
        return

    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    if n < 1 or n > len(pokInv.get("box", [])):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    pokInv["box"][n - 1]["islocked"] = 0
    write_json(f"player_{sender}_inv", pokInv)

    p = pokInv["box"][n - 1]
    chat.reply(f"@{sender}\n박스의 Lv.{p['level']} {p['name']}(을)를 잠금 해제했어요!")

def handle_swap(sender, chat, args=None):
    """Handle swap pokemon order command (@순서변경)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("deck"):
        chat.reply(f'@{sender}\n덱에 포켓몬이 없어요!')
        return
    
    parts = args.split() if args else []
    if len(parts) < 2:
        chat.reply(f'@{sender}\n사용법: {SETTING["swap"]} [덱번호1] [덱번호2]')
        return
    
    try:
        n1 = int(parts[0])
        n2 = int(parts[1])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    if n1 < 1 or n1 > len(pokInv["deck"]) or n2 < 1 or n2 > len(pokInv["deck"]) or n1 == n2:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    # Swap
    p = pokInv["deck"][n1 - 1]
    pokInv["deck"][n1 - 1] = pokInv["deck"][n2 - 1]
    pokInv["deck"][n2 - 1] = p
    
    write_json(f"player_{sender}_inv", pokInv)
    
    chat.reply(f"@{sender}\n{pokInv['deck'][n1-1]['name']}, {pokInv['deck'][n2-1]['name']}의 순서를 변경했어요!")

def handle_rest(sender, chat):
    """Handle rest command (@휴식)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    from .explore import advOn
    if advOn.get(sender, 0) != 0:
        chat.reply(f'@{sender}\n탐험 또는 배틀 중에는 휴식할 수 없어요!')
        return
    
    if pokUser.get("hp", 0) >= pokUser.get("maxHp", 0):
        chat.reply(f'@{sender}\n체력이 이미 최대예요!')
        return
    
    rest_on = pokUser.get("restOn", {"on": False, "time": 0})
    
    if rest_on.get("on", False):
        # End rest
        elapsed = (time.time() * 1000 - rest_on["time"]) / pokUser.get("rest", 20000)
        recovered_hp = min(math.ceil(elapsed), pokUser.get("maxHp", 0) - pokUser.get("hp", 0))
        
        pokUser["hp"] = min(pokUser.get("hp", 0) + recovered_hp, pokUser.get("maxHp", 0))
        pokUser["restOn"] = {"on": False, "time": 0}
        
        write_json(f"player_{sender}", pokUser)
        
        chat.reply(f"@{sender}\n휴식을 종료했어요.\n현재 체력: {pokUser['hp']}/{pokUser['maxHp']}")
    else:
        # Start rest
        pokUser["restOn"] = {"on": True, "time": time.time() * 1000}
        
        write_json(f"player_{sender}", pokUser)
        
        chat.reply(f"@{sender}\n휴식을 시작했어요.\n\"{CMDS['rest']}\"을 다시 사용하면 휴식을 종료할 수 있어요.")

def handle_egg(sender, chat):
    """Handle egg hatch command (@알 부화)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or "일반알" not in pokInv.get("item", []):
        chat.reply(f'@{sender}\n포켓몬의 알이 없어요!')
        return
    
    # Remove egg
    pokInv["item"].remove("일반알")
    
    # Roll for rarity
    rann = random.randint(0, 99)
    
    if rann == 1:
        islegend = 3  # Unknown
        pokname = random.choice(POK_ARR["groupunknown"])
    elif rann < 4:
        islegend = 2  # Ultrabeast
        pokname = random.choice(POK_ARR["group5"])
    elif rann < 22:
        islegend = 1  # Legendary
        pokname = random.choice(POK_ARR["group4"])
    else:
        islegend = 0  # Rare
        pokname = random.choice(POK_ARR["group3"])
    
    # Calculate level
    ball_idx = BALL_ARR.index(pokUser.get("Ball", BALL_ARR[0]))
    poklev = (ball_idx + 1) * SETTING["balluplev"] + 10
    
    # Get skills
    skillsarr = read_json(f"포켓몬/{pokname}", "skills") or []
    caughtpokskills = []
    
    if len(skillsarr) < 5:
        caughtpokskills = skillsarr[:]
    else:
        while len(caughtpokskills) < 4:
            t = random.choice(skillsarr)
            t = t.replace("DP", "").replace("Pt", "")
            if t not in caughtpokskills:
                caughtpokskills.append(t)
    
    # Create Pokemon
    caughtpokhp = read_json(f"포켓몬/{pokname}", "hp") or 50
    caughtpok = {
        'name': pokname,
        'level': poklev,
        'hp': math.ceil(caughtpokhp * poklev / 50),
        'atk': math.ceil((read_json(f"포켓몬/{pokname}", "atk") or 50) * poklev / 50),
        'def': math.ceil((read_json(f"포켓몬/{pokname}", "def") or 50) * poklev / 50),
        'spd': math.ceil((read_json(f"포켓몬/{pokname}", "spd") or 50) * poklev / 50),
        'skills': caughtpokskills,
        'skillslocked': [],
        'formchange': 0,
        'v': 0,
        'islocked': 0
    }
    
    # Add to box
    if "box" not in pokInv:
        pokInv["box"] = []
    pokInv["box"].append(caughtpok)
    
    # Register in collection
    pokCol = read_json(f"player_{sender}_collection")
    if pokCol is None:
        from .config import COLLECTION_NAMES
        pokCol = {name: [] for name in COLLECTION_NAMES}
    
    from .config import COLLECTION_NAMES, COLLECTION_CONTENTS
    for ii in COLLECTION_NAMES:
        idx = COLLECTION_NAMES.index(ii)
        if pokname in COLLECTION_CONTENTS[idx]:
            if ii not in pokCol:
                pokCol[ii] = []
            if pokname not in pokCol[ii]:
                pokCol[ii].append(pokname)
                chat.reply(f"@{sender}\n도감의 [{ii}] 에 새로운 포켓몬이 등록되었습니다.")
            break
    
    write_json(f"player_{sender}_inv", pokInv)
    write_json(f"player_{sender}_collection", pokCol)
    
    # Reply based on rarity
    if islegend == 3:
        chat.reply(f"@{sender}\n축하합니다! <???> {pokname}이(가) 알에서 나왔어요!")
    elif islegend == 2:
        chat.reply(f"@{sender}\n축하합니다! <🦄울트라비스트🦄> {pokname}이(가) 알에서 나왔어요!")
    elif islegend == 1:
        chat.reply(f"@{sender}\n축하합니다! <⭐전설⭐> {pokname}이(가) 알에서 나왔어요!")
    else:
        chat.reply(f"@{sender}\n축하합니다! [레어] {pokname}이(가) 알에서 나왔어요!")

def handle_legendegg(sender, chat):
    """Handle legendary egg hatch command (@전설알)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or "전설알" not in pokInv.get("item", []):
        chat.reply(f'@{sender}\n전설의 포켓몬의 알이 없어요!')
        return
    
    # Remove egg
    pokInv["item"].remove("전설알")
    
    # Roll for rarity (better rates than regular egg)
    rann = random.randint(0, 99)
    
    if rann == 1:
        islegend = 3  # Unknown
        pokname = random.choice(POK_ARR["groupunknown"])
    elif rann < 4:
        islegend = 2  # Ultrabeast
        pokname = random.choice(POK_ARR["group5"])
    else:
        islegend = 1  # Legendary (96% chance)
        pokname = random.choice(POK_ARR["group4"])
    
    # Calculate level
    ball_idx = BALL_ARR.index(pokUser.get("Ball", BALL_ARR[0]))
    poklev = (ball_idx + 1) * SETTING["balluplev"] + 10
    
    # Get skills
    skillsarr = read_json(f"포켓몬/{pokname}", "skills") or []
    caughtpokskills = []
    
    if len(skillsarr) < 5:
        caughtpokskills = skillsarr[:]
    else:
        while len(caughtpokskills) < 4:
            t = random.choice(skillsarr)
            t = t.replace("DP", "").replace("Pt", "")
            if t not in caughtpokskills:
                caughtpokskills.append(t)
    
    # Create Pokemon
    caughtpokhp = read_json(f"포켓몬/{pokname}", "hp") or 50
    caughtpok = {
        'name': pokname,
        'level': poklev,
        'hp': math.ceil(caughtpokhp * poklev / 50),
        'atk': math.ceil((read_json(f"포켓몬/{pokname}", "atk") or 50) * poklev / 50),
        'def': math.ceil((read_json(f"포켓몬/{pokname}", "def") or 50) * poklev / 50),
        'spd': math.ceil((read_json(f"포켓몬/{pokname}", "spd") or 50) * poklev / 50),
        'skills': caughtpokskills,
        'skillslocked': [],
        'formchange': 0,
        'v': 0,
        'islocked': 0
    }
    
    # Add to box
    if "box" not in pokInv:
        pokInv["box"] = []
    pokInv["box"].append(caughtpok)
    
    # Register in collection
    pokCol = read_json(f"player_{sender}_collection")
    if pokCol is None:
        from .config import COLLECTION_NAMES
        pokCol = {name: [] for name in COLLECTION_NAMES}
    
    from .config import COLLECTION_NAMES, COLLECTION_CONTENTS
    for ii in COLLECTION_NAMES:
        idx = COLLECTION_NAMES.index(ii)
        if pokname in COLLECTION_CONTENTS[idx]:
            if ii not in pokCol:
                pokCol[ii] = []
            if pokname not in pokCol[ii]:
                pokCol[ii].append(pokname)
                chat.reply(f"@{sender}\n도감의 [{ii}] 에 새로운 포켓몬이 등록되었습니다.")
            break
    
    write_json(f"player_{sender}_inv", pokInv)
    write_json(f"player_{sender}_collection", pokCol)
    
    # Reply based on rarity
    if islegend == 3:
        chat.reply(f"@{sender}\n축하합니다! <???> {pokname}이(가) 알에서 나왔어요!")
    elif islegend == 2:
        chat.reply(f"@{sender}\n축하합니다! <🦄울트라비스트🦄> {pokname}이(가) 알에서 나왔어요!")
    else:
        chat.reply(f"@{sender}\n축하합니다! <⭐전설⭐> {pokname}이(가) 알에서 나왔어요!")
