# Module 9: PVE Battle (Gym/Battle Tower)
import random
import math
import time
from .config import SETTING, TRAINER_RAN_POKS, TYPE_TEXTS, WEATHER_TEXTS
from .io_helpers import read_json, write_json, typejudge, weatherjudge, send_image, pokimglink

# Global battle state for PVE
isbattle = 0
player1 = ""
player2 = ""
player1pok = {}
player2pok = {}
player1maxhp = 0
player2maxhp = 0
player1pp = {}
player2pp = {}
player1retire = []
player2retire = []
isplayer1bind = 0
isplayer2bind = 0
battleres = ""
weather = 0
isnpcbattle = 0
nextpokchoose = 0
trainerInv = {}
trainerpoknum = 0
gymnum = 0
battletowerplayers = {}
battletowerlev = {}

def handle_gym(sender, chat, args=None):
    """Handle gym command (@체육관)"""
    global isbattle, player1, player2, player1pok, player2pok, player1maxhp, player2maxhp
    global player1pp, player2pp, player1retire, player2retire, isplayer1bind, isplayer2bind
    global battleres, weather, isnpcbattle, nextpokchoose, trainerInv, trainerpoknum, gymnum
    
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    # Check conditions
    if pokUser.get("restOn", {}).get("on", False):
        chat.reply(f'@{sender}\n휴식 중에는 체육관에 도전할 수 없어요!')
        return
    
    if isbattle != 0:
        chat.reply(f'@{sender}\n이미 배틀 중이에요!')
        return
    
    if pokUser.get("hp", 0) < 5:
        chat.reply(f'@{sender}\n체력이 5 이상이어야 체육관에 도전할 수 있어요!')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("deck"):
        chat.reply(f'@{sender}\n덱에 포켓몬이 없어요!')
        return
    
    # Initialize badge
    if "badge" not in pokUser:
        pokUser["badge"] = 0
    
    gymnum = pokUser["badge"] + 1
    
    if gymnum > 18:
        chat.reply(f'@{sender}\n모든 체육관을 클리어했어요!')
        return
    
    # Set battle state
    player1 = "체육관 관장"
    player2 = sender
    isbattle = 2
    isnpcbattle = 1
    
    # Deduct HP
    pokUser["hp"] -= 5
    write_json(f"player_{sender}", pokUser)
    
    # Load gym trainer data
    gym_data = read_json(f"trainer/gym_{gymnum}")
    if gym_data is None:
        chat.reply(f'@{sender}\n체육관 데이터를 불러올 수 없어요!')
        isbattle = 0
        return
    
    trainerInv = gym_data.get("deck", [])
    trainerpoknum = 0
    
    # Initialize battle state
    player1retire = []
    player2retire = []
    isplayer1bind = 0
    isplayer2bind = 0
    battleres = ""
    
    # Load first Pokemon
    player1pok = trainerInv[0].copy()
    player2pok = pokInv["deck"][0].copy()
    
    # Calculate gym leader Pokemon stats
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
    
    player1maxhp = player1pok["hp"]
    player2maxhp = player2pok["hp"]
    
    # Initialize PP
    player1pp = {}
    for skill in player1pok.get("skills", []):
        skill_data = read_json(f"기술/{skill}")
        player1pp[skill] = (skill_data.get("pp") if skill_data else None) or 10
    
    player2pp = {}
    for skill in player2pok.get("skills", []):
        skill_data = read_json(f"기술/{skill}")
        player2pp[skill] = (skill_data.get("pp") if skill_data else None) or 10
    
    # Random weather (1/3 chance)
    if random.randint(1, 3) == 1:
        weather = random.randint(1, 4)
    else:
        weather = 0
    
    # Start battle
    chat.reply(f"⚔️체육관 {gymnum}번째 도전!⚔️\n\n[{player1}] Lv.{player1pok['level']} {player1pok['name']}\nvs\n[{player2}] Lv.{player2pok['level']} {player2pok['name']}")
    
    # Send battle KakaoTalk link
    try:
        img1 = pokimglink(player1pok["name"], player1pok.get("formchange", 0))
        img2 = pokimglink(player2pok["name"], player2pok.get("formchange", 0))
        send_image(None, chat, 67300, {
            'player1img': img1,
            'player2img': img2,
            'player1': f"Lv.{player1pok['level']} {player1pok['name']}",
            'player2': f"Lv.{player2pok['level']} {player2pok['name']}",
            'player1desc': f"[{player1pok['hp']}/{player1maxhp}]",
            'player2desc': f"[{player2pok['hp']}/{player2maxhp}]"
        })
    except:
        pass
    
    if weather > 0:
        chat.reply(WEATHER_TEXTS[weather])
    
    # Battle loop
    battle_loop(chat, sender)

def handle_battletower(sender, chat, args=None):
    """Handle battle tower command (@배틀타워)"""
    global isbattle, player1, player2, player1pok, player2pok, player1maxhp, player2maxhp
    global player1pp, player2pp, player1retire, player2retire, isplayer1bind, isplayer2bind
    global battleres, weather, isnpcbattle, nextpokchoose, trainerInv, trainerpoknum
    global battletowerplayers, battletowerlev
    
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    # Check conditions
    if pokUser.get("restOn", {}).get("on", False):
        chat.reply(f'@{sender}\n휴식 중에는 배틀타워에 도전할 수 없어요!')
        return
    
    if isbattle != 0:
        chat.reply(f'@{sender}\n이미 배틀 중이에요!')
        return
    
    if pokUser.get("hp", 0) < 5:
        chat.reply(f'@{sender}\n체력이 5 이상이어야 배틀타워에 도전할 수 있어요!')
        return
    
    # Check daily limit
    if sender not in battletowerplayers:
        battletowerplayers[sender] = 0
    
    max_attempts = SETTING.get("eventp", {}).get("battletower", 0)
    if battletowerplayers[sender] >= max_attempts:
        chat.reply(f'@{sender}\n오늘의 배틀타워 횟수를 모두 사용했어요!')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("deck"):
        chat.reply(f'@{sender}\n덱에 포켓몬이 없어요!')
        return
    
    # Set battle state
    player1 = "포켓몬 트레이너"
    player2 = sender
    isbattle = 4
    isnpcbattle = 1
    
    # Deduct HP
    pokUser["hp"] -= 5
    write_json(f"player_{sender}", pokUser)
    
    # Generate AI Pokemon (6 random)
    trainerInv = []
    player_level = pokInv["deck"][0]["level"]
    battletowerlev[sender] = player_level
    
    for i in range(6):
        aipokname = random.choice(TRAINER_RAN_POKS)
        
        if player_level > 100:
            aipoklevel = player_level - random.randint(0, 20)
        else:
            aipoklevel = player_level - random.randint(0, 10)
        
        if aipoklevel < 1:
            aipoklevel = 1
        
        skillsarr = read_json(f"포켓몬/{aipokname}", "skills") or []
        caughtpokskills = []
        
        if len(skillsarr) < 5:
            caughtpokskills = skillsarr[:]
        else:
            while len(caughtpokskills) < 4:
                t = random.choice(skillsarr)
                t = t.replace("DP", "").replace("Pt", "")
                if t not in caughtpokskills:
                    caughtpokskills.append(t)
        
        aipokhp = read_json(f"포켓몬/{aipokname}", "hp") or 50
        aipok = {
            'name': aipokname,
            'level': aipoklevel,
            'hp': math.ceil(aipokhp * aipoklevel / 50),
            'atk': math.ceil((read_json(f"포켓몬/{aipokname}", "atk") or 50) * aipoklevel / 50),
            'def': math.ceil((read_json(f"포켓몬/{aipokname}", "def") or 50) * aipoklevel / 50),
            'spd': math.ceil((read_json(f"포켓몬/{aipokname}", "spd") or 50) * aipoklevel / 50),
            'satk': math.ceil((read_json(f"포켓몬/{aipokname}", "satk") or 1) * aipoklevel / 50),
            'sdef': math.ceil((read_json(f"포켓몬/{aipokname}", "sdef") or 1) * aipoklevel / 50),
            'skills': caughtpokskills,
            'skillslocked': [],
            'formchange': 0,
            'v': 0,
            'islocked': 0
        }
        
        trainerInv.append(aipok)
    
    trainerpoknum = 0
    
    # Initialize battle state
    player1retire = []
    player2retire = []
    isplayer1bind = 0
    isplayer2bind = 0
    battleres = ""
    
    # Load first Pokemon
    player1pok = trainerInv[0].copy()
    player2pok = pokInv["deck"][0].copy()
    
    player1maxhp = player1pok["hp"]
    player2maxhp = player2pok["hp"]
    
    # Initialize PP
    player1pp = {}
    for skill in player1pok.get("skills", []):
        skill_data = read_json(f"기술/{skill}")
        player1pp[skill] = (skill_data.get("pp") if skill_data else None) or 10
    
    player2pp = {}
    for skill in player2pok.get("skills", []):
        skill_data = read_json(f"기술/{skill}")
        player2pp[skill] = (skill_data.get("pp") if skill_data else None) or 10
    
    # Random weather
    if random.randint(1, 3) == 1:
        weather = random.randint(1, 4)
    else:
        weather = 0
    
    # Start battle
    chat.reply(f"⚔️배틀타워 도전!⚔️\n\n[{player1}] Lv.{player1pok['level']} {player1pok['name']}\nvs\n[{player2}] Lv.{player2pok['level']} {player2pok['name']}")
    
    # Send battle KakaoTalk link
    try:
        img1 = pokimglink(player1pok["name"], player1pok.get("formchange", 0))
        img2 = pokimglink(player2pok["name"], player2pok.get("formchange", 0))
        send_image(None, chat, 67300, {
            'player1img': img1,
            'player2img': img2,
            'player1': f"Lv.{player1pok['level']} {player1pok['name']}",
            'player2': f"Lv.{player2pok['level']} {player2pok['name']}",
            'player1desc': f"[{player1pok['hp']}/{player1maxhp}]",
            'player2desc': f"[{player2pok['hp']}/{player2maxhp}]"
        })
    except:
        pass
    
    if weather > 0:
        chat.reply(WEATHER_TEXTS[weather])
    
    # Battle loop
    battle_loop(chat, sender)

def battle_loop(chat, sender):
    """Execute battle loop for PVE"""
    global isbattle, player1, player2, player1pok, player2pok, player1maxhp, player2maxhp
    global player1pp, player2pp, player1retire, player2retire, isplayer1bind, isplayer2bind
    global battleres, weather, isnpcbattle, nextpokchoose, trainerInv, trainerpoknum, gymnum

    max_turns = 50
    turn = 0

    # Load player's Pokemon inventory at the start
    pokInv = read_json(f"player_{sender}_inv")
    
    # Initialize battle result accumulator
    battleres = ""

    while turn < max_turns:
        turn += 1

        # Check if any Pokemon fainted
        if player1pok["hp"] <= 0:
            # Send accumulated battle log before loading next Pokemon
            
            # Player 1's Pokemon fainted

            if battleres:
                space = "\u200b"*500
                chat.reply(f"배틀 결과\n{space}\n{battleres}")
                battleres = ""

            player1retire.append(trainerpoknum)
            trainerpoknum += 1

            if trainerpoknum >= len(trainerInv):
                # Player 1 has no more Pokemon - Player 2 wins
                end_pve_battle(chat, sender, winner=sender)
                return

            # Load next Pokemon
            player1pok = trainerInv[trainerpoknum].copy()
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

            player1maxhp = player1pok["hp"]
            player1pp = {}
            for skill in player1pok.get("skills", []):
                skill_data = read_json(f"기술/{skill}")
                player1pp[skill] = (skill_data.get("pp") if skill_data else None) or 10

            chat.reply(f"[{player1}] {player1pok['name']} 등장!")

            #이부분에 이미지출력 구현
            try:
                img1 = pokimglink(player1pok["name"], player1pok.get("formchange", 0))
                img2 = pokimglink(player2pok["name"], player2pok.get("formchange", 0))
                send_image(None, chat, 67300, {
                    'player1img': img1,
                    'player2img': img2,
                    'player1': f"Lv.{player1pok['level']} {player1pok['name']}",
                    'player2': f"Lv.{player2pok['level']} {player2pok['name']}",
                    'player1desc': f"[{player1pok['hp']}/{player1maxhp}]",
                    'player2desc': f"[{player2pok['hp']}/{player2maxhp}]"
                })
            except:
                pass

        if player2pok["hp"] <= 0:
            # Send accumulated battle log before loading next Pokemon
            
            # Player 2's Pokemon fainted
            if battleres:
                space = "\u200b"*500
                chat.reply(f"배틀 결과\n{space}\n{battleres}")
                battleres = ""
            player2retire.append(0)

            # Check if player has more Pokemon
            next_pok_idx = len(player2retire)

            if next_pok_idx >= len(pokInv.get("deck", [])):
                # Send any remaining battle log
                if battleres:
                    chat.reply(battleres)
                    battleres = ""
                # Player 2 has no more Pokemon - Player 1 wins
                end_pve_battle(chat, sender, winner=player1)
                return

            # Load next Pokemon
            player2pok = pokInv["deck"][next_pok_idx].copy()
            player2maxhp = player2pok["hp"]
            player2pp = {}
            for skill in player2pok.get("skills", []):
                skill_data = read_json(f"기술/{skill}")
                player2pp[skill] = (skill_data.get("pp") if skill_data else None) or 10

            chat.reply(f"[{player2}] {player2pok['name']} 등장!")

            #이부분에 이미지출력 구현
            try:
                img1 = pokimglink(player1pok["name"], player1pok.get("formchange", 0))
                img2 = pokimglink(player2pok["name"], player2pok.get("formchange", 0))
                send_image(None, chat, 67300, {
                    'player1img': img1,
                    'player2img': img2,
                    'player1': f"Lv.{player1pok['level']} {player1pok['name']}",
                    'player2': f"Lv.{player2pok['level']} {player2pok['name']}",
                    'player1desc': f"[{player1pok['hp']}/{player1maxhp}]",
                    'player2desc': f"[{player2pok['hp']}/{player2maxhp}]"
                })
            except:
                pass

        # Execute turn
        # Select skills
        player1skill = random.choice(player1pok.get("skills", ["태클"]))
        player2skill = random.choice(player2pok.get("skills", ["태클"]))

        # Determine turn order
        player1spd = player1pok["spd"]
        player2spd = player2pok["spd"]

        # Priority
        skill1_data = read_json(f"기술/{player1skill}")
        skill2_data = read_json(f"기술/{player2skill}")

        if skill1_data:
            player1spd += (skill1_data.get("priority") or 0) * 2
        if skill2_data:
            player2spd += (skill2_data.get("priority") or 0) * 2

        if player1spd > player2spd:
            execute_pve_attack(player1, player2, player1pok, player2pok, player1skill, player1pp)
            if player2pok["hp"] > 0:
                execute_pve_attack(player2, player1, player2pok, player1pok, player2skill, player2pp)
        else:
            execute_pve_attack(player2, player1, player2pok, player1pok, player2skill, player2pp)
            if player1pok["hp"] > 0:
                execute_pve_attack(player1, player2, player1pok, player2pok, player1skill, player1pp)

        # Weather damage
        if weather > 2:
            if weather == 3:  # Sandstorm
                type1_1 = read_json(f"포켓몬/{player1pok['name']}", "type1") or 1
                type2_1 = read_json(f"포켓몬/{player1pok['name']}", "type2") or 1
                if type1_1 != 6 and type2_1 != 6 and type1_1 != 7 and type2_1 != 7:
                    player1pok["hp"] = max(1, math.ceil(player1pok["hp"] * 7 / 8))
                    battleres += f"[{player1}] 모래바람이 {player1pok['name']}(를)을 덮쳤어요!\n"

                type1_2 = read_json(f"포켓몬/{player2pok['name']}", "type1") or 1
                type2_2 = read_json(f"포켓몬/{player2pok['name']}", "type2") or 1
                if type1_2 != 6 and type2_2 != 6 and type1_2 != 7 and type2_2 != 7:
                    player2pok["hp"] = max(1, math.ceil(player2pok["hp"] * 7 / 8))
                    battleres += f"[{player2}] 모래바람이 {player2pok['name']}(를)을 덮쳤어요!\n"

            elif weather == 4:  # Hail
                type1_2 = read_json(f"포켓몬/{player2pok['name']}", "type1") or 1
                type2_2 = read_json(f"포켓몬/{player2pok['name']}", "type2") or 1
                if type1_2 != 11 and type2_2 != 11:
                    player2pok["hp"] = max(1, math.ceil(player2pok["hp"] * 7 / 8))
                    battleres += f"[{player2}] 싸라기눈이 {player2pok['name']}(를)을 덮쳤어요!\n"

        # Check for battle end (a Pokemon fainted and no more to send)
        if player2pok["hp"] <= 0 and len(player2retire) >= len(pokInv.get("deck", [])):
            # Send final accumulated battle log
            if battleres:
                chat.reply(battleres)
                battleres = ""
            end_pve_battle(chat, sender, winner=player1)
            return

        if player1pok["hp"] <= 0 and trainerpoknum >= len(trainerInv) - 1:
            # Send final accumulated battle log
            if battleres:
                chat.reply(battleres)
                battleres = ""
            end_pve_battle(chat, sender, winner=sender)
            return

    # Timeout
    if battleres:
        chat.reply(battleres)
    chat.reply("배틀이 너무 길어져서 무승부로 처리됩니다.")
    isbattle = 0

def execute_pve_attack(attacker_name, defender_name, attacker, defender, skill, pp_dict):
    """Execute a single PVE attack"""
    global battleres
    
    skill_data = read_json(f"기술/{skill}")
    if not skill_data:
        battleres += f"[{attacker_name}] {attacker['name']}의 {skill}!\n기술 데이터 없음!\n\n"
        return
    
    # Check PP
    if skill not in pp_dict or pp_dict[skill] <= 0:
        battleres += f"[{attacker_name}] {attacker['name']}는 PP가 부족해요!\n\n"
        return
    
    pp_dict[skill] -= 1
    
    # Accuracy
    accr = skill_data.get("accr") or 100
    if random.randint(1, 100) > accr:
        battleres += f"[{attacker_name}] {attacker['name']}의 {skill}!\n아쉽게 빗나갔어요!\n\n"
        return

    # Calculate damage
    atktype = skill_data.get("atktype") or 1  # 0 = physical (atk/def), 1 = special (satk/sdef)
    if atktype == 0:
        atk_stat = attacker["atk"]
        def_stat = defender["def"]
    else:
        atk_stat = attacker.get("satk", attacker["atk"])
        def_stat = defender.get("sdef", defender["def"])

    atk = math.ceil(atk_stat * (skill_data.get("damage") or 40) / 300 * (2000 - def_stat) / 2000)

    # STAB
    skill_type = skill_data.get("type") or 1
    attacker_type1 = read_json(f"포켓몬/{attacker['name']}", "type1") or 1
    attacker_type2 = read_json(f"포켓몬/{attacker['name']}", "type2") or 1
    
    if skill_type == attacker_type1 or skill_type == attacker_type2:
        atk = atk * 1.5
    
    # Weather
    atk = weatherjudge(atk, skill_type, weather)
    
    # Type effectiveness
    defender_type1 = read_json(f"포켓몬/{defender['name']}", "type1") or 1
    defender_type2 = read_json(f"포켓몬/{defender['name']}", "type2") or 1
    
    judge = typejudge(skill_type, defender_type1, defender_type2)
    atk = atk * judge
    
    # Additional effects
    addi = skill_data.get("addi") or 0
    
    if addi == 4:  # Revenge
        atk = atk * (attacker.get("maxhp", attacker["hp"]) - attacker["hp"]) / 2
    
    defender["hp"] = max(0, defender["hp"] - math.ceil(atk))
    
    battleres += f"[{attacker_name}] {attacker['name']}의 {skill}!\n"
    
    if judge > 1:
        battleres += "효과가 굉장했어요!\n"
    elif judge == 0:
        battleres += "효과가 없는 듯해요...\n"
    elif judge < 1:
        battleres += "효과가 별로인 듯해요\n"
    
    # Recoil
    if addi == 3 and judge != 0:
        attacker["hp"] = max(1, attacker["hp"] - math.ceil(atk / 4))
        battleres += f"[{attacker_name}] {attacker['name']}는 공격의 반동으로 데미지를 입었어요!\n"
    elif addi == 2 and judge != 0:
        attacker["hp"] = min(attacker.get("maxhp", attacker["hp"]), attacker["hp"] + math.ceil(atk / 4))
        battleres += f"[{attacker_name}] {attacker['name']}는 공격을 통해 체력을 흡수했어요!\n"
    elif addi == 1 and skill != "솔라빔" and weather != 1:
        if attacker_name == player1:
            isplayer1bind = 1
        else:
            isplayer2bind = 1
    elif addi == 9:
        attacker["hp"] = 1
    
    battleres += f"\n[{attacker_name}] {attacker['name']} [{attacker['hp']}HP]\n[{defender_name}] {defender['name']} [{defender['hp']}HP]\n\n"

def end_pve_battle(chat, sender, winner):
    """End PVE battle"""
    global isbattle, player1, player2, player1pok, player2pok, gymnum, battletowerplayers
    
    pokUser = read_json(f"player_{sender}")
    
    if winner == sender:
        # Player wins
        if isbattle == 2:  # Gym
            reward = 2000000 * (gymnum + 1) ** 2
            reward = math.ceil(reward * SETTING.get("eventp", {}).get("goldX", 1))
            
            pokUser["gold"] += reward
            pokUser["badge"] = pokUser.get("badge", 0) + 1
            
            # Update ranking
            update_ranking(sender, True)
            
            write_json(f"player_{sender}", pokUser)
            
            chat.reply(f"🏆체육관 {gymnum} 클리어!🏆\n\n{reward:,}원을 얻었어요.\n보유금액: {pokUser['gold']:,}원\n현재 뱃지 개수: {pokUser['badge']}개")
        
        elif isbattle == 4:  # Battle Tower
            level = battletowerlev.get(sender, 50)
            reward = level ** 2 * 10000 * SETTING.get("eventp", {}).get("goldX", 1)
            
            pokUser["gold"] += reward
            battletowerplayers[sender] = battletowerplayers.get(sender, 0) + 1
            
            # Update ranking
            update_ranking(sender, True)
            
            write_json(f"player_{sender}", pokUser)
            
            chat.reply(f"🏆배틀타워 클리어!🏆\n\n{reward:,}원을 얻었어요.\n보유금액: {pokUser['gold']:,}원")
    else:
        # Player loses
        if isbattle == 2:
            chat.reply(f"체육관 관장과의 배틀에서 패배했어요.\n도전에 실패했어요.\n현재 뱃지 개수: {pokUser.get('badge', 0)}개")
        elif isbattle == 4:
            chat.reply(f"배틀타워에서 패배했어요.\n도전에 실패했어요.")
        
        # Update ranking
        update_ranking(sender, False)
    
    # Reset battle state
    isbattle = 0
    player1 = ""
    player2 = ""

def update_ranking(sender, is_win):
    """Update battle ranking"""
    pokRank = read_json("ranking")
    if pokRank is None:
        pokRank = []
    
    # Find or create entry
    found = False
    for entry in pokRank:
        if entry.get("name") == sender:
            entry["battle"]["total"] = entry.get("battle", {}).get("total", 0) + 1
            if is_win:
                entry["battle"]["win"] = entry.get("battle", {}).get("win", 0) + 1
            found = True
            break
    
    if not found:
        pokUser = read_json(f"player_{sender}")
        pokRank.append({
            "name": sender,
            "rank": pokUser.get("rank", "신입 트레이너"),
            "battle": {
                "total": 1,
                "win": 1 if is_win else 0
            }
        })
    
    write_json("ranking", pokRank)
