# Module 10: Champion League
import random
import math
import time
from .config import SETTING, TYPE_TEXTS
from .io_helpers import read_json, write_json, typejudge, weatherjudge, send_image, pokimglink
from .explore import advOn

champplayers = {}

def handle_champ(sender, chat, args=None):
    global champplayers

    from . import pve_battle
    from .maintenance import check_updating
    if not check_updating(sender, chat):
        return

    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    if pokUser.get("restOn", {}).get("on", False):
        chat.reply(f'@{sender}\n휴식 중에는 챔피언에게 도전할 수 없어요!')
        return

    if pokUser.get("badge", 0) < 18:
        chat.reply(f'@{sender}\n모든 체육관 뱃지를 획득해야 챔피언에게 도전할 수 있어요!')
        return

    state = pve_battle._get_state(sender)
    if state['isbattle'] != 0:
        chat.reply(f'@{sender}\n이미 배틀 중이에요!')
        return

    if advOn.get(sender, 0) != 0:
        chat.reply(f'@{sender}\n이미 탐험 또는 배틀 중이에요!')
        return

    if pokUser.get("hp", 0) < 5:
        chat.reply(f'@{sender}\n체력이 5 이상이어야 챔피언에게 도전할 수 있어요!')
        return

    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("deck"):
        chat.reply(f"@{sender}\n덱에 포켓몬이 없어요!")
        return

    advOn[sender] = 3
    state['player1'] = "챔피언"
    state['player2'] = sender
    state['isbattle'] = 3
    state['isnpcbattle'] = 1

    pokUser["hp"] -= 5
    write_json(f"player_{sender}", pokUser)

    champ_data = read_json(f"trainer/champion")
    if champ_data is None:
        chat.reply(f'@{sender}\n챔피언 데이터를 불러올 수 없어요!')
        state['isbattle'] = 0
        advOn[sender] = 0
        return

    trainerInv = champ_data.get("deck", [])
    state['trainerInv'] = trainerInv
    state['trainerpoknum'] = 0
    state['player1retire'] = []
    state['player2retire'] = []
    state['isplayer1bind'] = 0
    state['isplayer2bind'] = 0
    state['battleres'] = ""

    state['player1pok'] = trainerInv[0].copy()
    state['player2pok'] = pokInv["deck"][0].copy()

    player1pok = state['player1pok']
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

    player2pok = state['player2pok']
    if player2pok["name"] == "메타몽":
        player2pok["name"] = player1pok["name"]
        player2pok["hp"] = player1pok["hp"]
        player2pok["atk"] = player1pok["atk"]
        player2pok["def"] = player1pok["def"]
        player2pok["spd"] = player1pok["spd"]
        player2pok["satk"] = player1pok["satk"]
        player2pok["sdef"] = player1pok["sdef"]
        player2pok["skills"] = player1pok["skills"][:]

    if 8 in pokUser.get("activecollection", []):
        player2pok["spd"] += 8
    if 11 in pokUser.get("activecollection", []):
        player2pok["def"] += 11

    state['player1maxhp'] = player1pok["hp"]
    state['player2maxhp'] = player2pok["hp"]

    state['player1pp'] = {}
    for skill in player1pok.get("skills", []):
        skill_data = read_json(f"기술/{skill}")
        state['player1pp'][skill] = (skill_data.get("pp") if skill_data else None) or 10

    state['player2pp'] = {}
    for skill in player2pok.get("skills", []):
        skill_data = read_json(f"기술/{skill}")
        state['player2pp'][skill] = (skill_data.get("pp") if skill_data else None) or 10

    if random.randint(1, 3) == 1:
        state['weather'] = random.randint(1, 4)
    else:
        state['weather'] = 0

    chat.reply(f"⚔️챔피언 도전!⚔️\n\n[{state['player1']}] Lv.{player1pok['level']} {player1pok['name']}\nvs\n[{state['player2']}] Lv.{player2pok['level']} {player2pok['name']}")

    try:
        img1 = pokimglink(player1pok["name"], player1pok.get("formchange", 0), player1pok.get("shiny", 0))
        img2 = pokimglink(player2pok["name"], player2pok.get("formchange", 0), player2pok.get("shiny", 0))
        send_image(None, chat, 67300, {
            'player1name': state['player1'],
            'player2name': state['player2'],
            'player1img': img1,
            'player2img': img2,
            'player1shiny': player1pok.get("shiny", 0),
            'player2shiny': player2pok.get("shiny", 0),
            'player1': f"Lv.{player1pok['level']} {player1pok['name']}",
            'player2': f"Lv.{player2pok['level']} {player2pok['name']}",
            'player1desc': f"[{player1pok['hp']}/{state['player1maxhp']}]",
            'player2desc': f"[{player2pok['hp']}/{state['player2maxhp']}]"
        })
    except Exception as e:
         print(e)

    if state['weather'] > 0:
        from .config import WEATHER_TEXTS
        chat.reply(WEATHER_TEXTS[state['weather']])

    time.sleep(5)

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

    rewardtext = f"-{reward}골드\n"  
    # Update ranking

    is_new_champion = pokUser["rank"] != "챔피언"

    if is_new_champion:
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

        pokUser["rank"] = "챔피언"
                
        write_json(f"player_{sender}", pokUser)



    pokInv = read_json(f"player_{sender}_inv")

    if "item" not in pokInv:
        pokInv["item"] = []
    pokInv["item"].append("전설알")
    
    rewardtext+="-전설알 1개\n"

    #give league pok(1회)
    if is_new_champion:

        pokInv["item"].append("금왕관")
        rewardtext+="-금왕관 1개(최초 클리어 한정 지급)\n"

        pokname = SETTING.get("leaguecharacter", "네크로즈마")
        poklev = 200

        rewardtext+=f"-Lv.{poklev} {pokname}(최초 클리어 한정 지급)\n"
        
        
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
    if is_new_champion:
        write_json(f"player_{sender}_collection", pokCol)
            
    chat.reply(f"{sender}\n⭐축하합니다!⭐\n챔피언이 되었습니다!\n챔피언 클리어 보상이 지급되었습니다." + "\u200b" * 500 + f"\n{rewardtext}")
            