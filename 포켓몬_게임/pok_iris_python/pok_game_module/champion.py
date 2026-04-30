# Module 10: Champion League
import random
import math
import time
from .config import SETTING, TYPE_TEXTS
from .io_helpers import read_json, write_json, typejudge, weatherjudge, send_image, pokimglink

champplayers = {}

def handle_champ(sender, chat, args=None):
    """Handle champion challenge command (@챔피언도전)"""
    global champplayers

    # Import pve_battle module for battle state
    from . import pve_battle

    # Check maintenance mode
    from .maintenance import check_updating
    if not check_updating(sender, chat):
        return

    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    # Check conditions
    if pokUser.get("restOn", {}).get("on", False):
        chat.reply(f'@{sender}\n휴식 중에는 챔피언에게 도전할 수 없어요!')
        return
    
    if pve_battle.isbattle != 0:
        chat.reply(f'@{sender}\n이미 배틀 중이에요!')
        return
    
    if pokUser.get("hp", 0) < 5:
        chat.reply(f'@{sender}\n체력이 5 이상이어야 챔피언에게 도전할 수 있어요!')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("deck"):
        chat.reply(f"@{sender}\n덱에 포켓몬이 없어요!")
        return
    
    # Check if player is eligible
    current_rank = pokUser.get("rank", "")
    if current_rank != "포켓몬 마스터":
        chat.reply(f"@{sender}\n챔피언 도전은 '포켓몬 마스터' 등급만 가능합니다!\n현재 등급: {current_rank}")
        return
    
    # Check attempt limit
    if sender not in champplayers:
        champplayers[sender] = 0
    
    if champplayers[sender] >= 3:
        chat.reply(f"@{sender}\n챔피언 도전 횟수를 모두 사용했어요!")
        return
    
    
    # Set battle state
    pve_battle.player1 = "챔피언"
    pve_battle.player2 = sender
    pve_battle.isbattle = 3  # Champion battle
    pve_battle.isnpcbattle = 1
    
    # Deduct HP
    pokUser["hp"] -= 5
    write_json(f"player_{sender}", pokUser)
    
    # Load champion trainer data
    trainerInv = champ_data.get("deck", [])
    pve_battle.trainerInv = trainerInv
    pve_battle.trainerpoknum = 0
    
    # Initialize battle state
    pve_battle.player1retire = []
    pve_battle.player2retire = []
    pve_battle.isplayer1bind = 0
    pve_battle.isplayer2bind = 0
    pve_battle.battleres = ""
    
    # Load first Pokemon
    pve_battle.player1pok = trainerInv[0].copy()
    pve_battle.player2pok = pokInv["deck"][0].copy()
    
    # Calculate champion Pokemon stats
    player1pok = pve_battle.player1pok
    level = player1pok["level"]
    if player1pok.get("formchange", 0) > 0:
        player1pok["hp"] = math.ceil((read_json(f"포켓몬/{player1pok['name']}_{player1pok['formchange']}", "hp") or 50) * level / 50)
        player1pok["atk"] = math.ceil((read_json(f"포켓몬/{player1pok['name']}_{player1pok['formchange']}", "atk") or 50) * level / 50)
        player1pok["def"] = math.ceil((read_json(f"포켓몬/{player1pok['name']}_{player1pok['formchange']}", "def") or 50) * level / 50)
        player1pok["spd"] = math.ceil((read_json(f"포켓몬/{player1pok['name']}_{player1pok['formchange']}", "spd") or 50) * level / 50)
        player1pok["satk"] = math.ceil((read_json(f"포켓몬/{player1pok['name']}_{player1pok['formchange']}", "satk") or 1) * level / 50)
        player1pok["sdef"] = math.ceil((read_json(f"포켓몬/{player1pok['name']}_{player1pok['formchange']}", "sdef") or 1) * level / 50)
    else:
        player1pok["hp"] = math.ceil((read_json(f"포켓몬/{player1pok['name']}", "hp") or 50) * level / 50)
        player1pok["atk"] = math.ceil((read_json(f"포켓몬/{player1pok['name']}", "atk") or 50) * level / 50)
        player1pok["def"] = math.ceil((read_json(f"포켓몬/{player1pok['name']}", "def") or 50) * level / 50)
        player1pok["spd"] = math.ceil((read_json(f"포켓몬/{player1pok['name']}", "spd") or 50) * level / 50)
        player1pok["satk"] = math.ceil((read_json(f"포켓몬/{player1pok['name']}", "satk") or 1) * level / 50)
        player1pok["sdef"] = math.ceil((read_json(f"포켓몬/{player1pok['name']}", "sdef") or 1) * level / 50)
    
    # Handle Metamong transform
    player2pok = pve_battle.player2pok
    if player2pok["name"] == "메타몽":
        player2pok["name"] = player1pok["name"]
        player2pok["hp"] = player1pok["hp"]
        player2pok["atk"] = player1pok["atk"]
        player2pok["def"] = player1pok["def"]
        player2pok["spd"] = player1pok["spd"]
        player2pok["satk"] = player1pok["satk"]
        player2pok["sdef"] = player1pok["sdef"]
        player2pok["skills"] = player1pok["skills"][:]
    
    # Apply collection bonuses
    if 8 in pokUser.get("activecollection", []):
        player2pok["spd"] += 8
    if 11 in pokUser.get("activecollection", []):
        player2pok["def"] += 11
    
    pve_battle.player1maxhp = player1pok["hp"]
    pve_battle.player2maxhp = player2pok["hp"]
    
    # Initialize PP
    pve_battle.player1pp = {}
    for skill in player1pok.get("skills", []):
        skill_data = read_json(f"기술/{skill}")
        pve_battle.player1pp[skill] = (skill_data.get("pp") if skill_data else None) or 10
    
    pve_battle.player2pp = {}
    for skill in player2pok.get("skills", []):
        skill_data = read_json(f"기술/{skill}")
        pve_battle.player2pp[skill] = (skill_data.get("pp") if skill_data else None) or 10
    
    # Random weather (1/3 chance)
    if random.randint(1, 3) == 1:
        pve_battle.weather = random.randint(1, 4)
    else:
        pve_battle.weather = 0
    
    # Start battle
    chat.reply(f"⚔️챔피언 도전!⚔️\n\n[{pve_battle.player1}] Lv.{player1pok['level']} {player1pok['name']}\nvs\n[{pve_battle.player2}] Lv.{player2pok['level']} {player2pok['name']}")
    
    # Send battle KakaoTalk link
    try:
        img1 = pokimglink(player1pok["name"], player1pok.get("formchange", 0), player1pok.get("shiny", 0))
        img2 = pokimglink(player2pok["name"], player2pok.get("formchange", 0), player2pok.get("shiny", 0))
        send_image(None, chat, 67300, {
            'player1name': pve_battle.player1,
            'player2name': pve_battle.player2,
            'player1img': img1,
            'player2img': img2,
            'player1shiny': player1pok.get("shiny", 0),
            'player2shiny': player2pok.get("shiny", 0),
            'player1': f"Lv.{player1pok['level']} {player1pok['name']}",
            'player2': f"Lv.{player2pok['level']} {player2pok['name']}",
            'player1desc': f"[{player1pok['hp']}/{pve_battle.player1maxhp}]",
            'player2desc': f"[{player2pok['hp']}/{pve_battle.player2maxhp}]"
        })
    except Exception as e:
         print(e)
    
    if pve_battle.weather > 0:
        from .config import WEATHER_TEXTS
        chat.reply(WEATHER_TEXTS[pve_battle.weather])
    
    time.sleep(5)
    
    # Battle loop
    pve_battle.battle_loop(chat, sender)

def handle_champinfo(sender, chat):
    """Handle champion info command (@챔피언정보)"""
    champ_data = read_json("trainer/champion")
    champ_log = read_json("trainer/champlog")
    
    if not champ_data or "champname" not in champ_data:
        chat.reply("@{sender}\n아직 챔피언이 없어요!")
        return
    
    champ_name = champ_data["champname"]
    champ_deck = champ_data.get("deck", [])
    
    res = f"👑 챔피언 정보 👑\n\n"
    res += f"챔피언: {champ_name}\n"
    res += f"덱 포켓몬: {len(champ_deck)}마리\n\n"
    
    for i, pok in enumerate(champ_deck[:6]):
        res += f"{i+1}. Lv.{pok.get('level', 0)} {pok.get('name', '???')}\n"
    
    if champ_log:
        res += f"\n총 챔피언 수: {champ_log.get('Champnum', 0)}명"
    
    chat.reply(res)

def newChampion(sender, chat, pokUser):
    """Handle new champion creation"""
    reward = 2000000000  # Champion reward
            
    pokUser["gold"] += reward
            
    # Update ranking

    # Update HP and other stats based on new rank
    try:
        new_rank_idx = SETTING["rank"]["name"].index("챔피언")
    except ValueError:
        new_rank_idx = 0

    pokUser["maxHp"] = SETTING["rank"]["maxHp"][new_rank_idx]
    pokUser["success"] = SETTING["success"] + SETTING["rank"]["success"][new_rank_idx]
    pokUser["castT"] = SETTING["rank"]["castT"][new_rank_idx]
    pokUser["hp"] = pokUser.get("hp", 1) - 1  # Decrease HP on catch

    # Ensure HP doesn't exceed max
    if pokUser["hp"] > pokUser.get("maxHp", 0):
        pokUser["hp"] = pokUser.get("maxHp", 0)

    # Re-read to preserve ball count (balls were already decremented and persisted earlier)
    current_pokUser = read_json(f"player_{sender}")
    if current_pokUser:
        pokUser["balls"] = current_pokUser.get("balls", pokUser.get("balls", 0))
        pokUser["gold"] = current_pokUser.get("gold", pokUser.get("gold", 0))
            
    write_json(f"player_{sender}", pokUser)


    #give league pok

    pokInv = read_json(f"player_{sender}_inv")

    if "item" not in pokInv:
        pokInv["item"] = []
    pokInv["item"].append("전설알")
    pokInv["item"].append("금왕관")

    pokname = SETTING.get("leaguecharacter", "네크로즈마")
    
    poklev = 200
    
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
        'satk': math.ceil((read_json(f"포켓몬/{pokname}", "satk") or 50) * poklev / 50),
        'sdef': math.ceil((read_json(f"포켓몬/{pokname}", "sdef") or 50) * poklev / 50),
        'spd': math.ceil((read_json(f"포켓몬/{pokname}", "spd") or 50) * poklev / 50),
        'skills': caughtpokskills,
        'skillslocked': [],
        'formchange': 0,
        'shiny':0,
        'v': 0,
        'islocked': 1
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
            
    chat.reply(f"{sender}\n⭐축하합니다!⭐\n챔피언이 되었습니다!\n챔피언 클리어 보상이 지급되었습니다." + "\u200b" * 500 + f"\n-{reward}골드\n-전설알 1개\n-금왕관 1개\n-Lv.200 {pokname}")
            