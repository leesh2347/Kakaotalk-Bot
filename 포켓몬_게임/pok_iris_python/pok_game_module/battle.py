# Module 8: PvP Battle
import random
import math
import time
from .config import SETTING, BALL_ARR, TYPE_TEXTS
from .io_helpers import read_json, write_json, typejudge, weatherjudge, send_image, pokimglink
from .explore import advOn

# Global battle state
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
player1ball = ""
player2ball = ""
battletowerplayers = {}
battletowerlev = {}

# PvP battle specific state
player1inv = {}
player2inv = {}

def handle_battlejoin(sender, chat):
    """Handle battle join command (@배틀참가)"""
    global isbattle, player1, player2

    # Check maintenance mode
    from .maintenance import check_updating
    if not check_updating(sender, chat):
        return

    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if not pokInv or not pokInv.get("deck"):
        chat.reply(f"@{sender}\n덱에 포켓몬이 없어요!\n@덱 명령어로 포켓몬을 장착하세요.")
        return
    
    if isbattle == 0:
        # Create new battle
        player1 = sender
        isbattle = 3
        advOn[sender] = 3
        chat.reply(f"@{sender}\n배틀 참가 완료!\n상대를 기다리는 중...")
    elif isbattle == 3 and player1 != sender:
        # Join existing battle
        player2 = sender
        isbattle = 2
        advOn[sender] = 3
        chat.reply(f"@{player2}\n배틀 참가 완료!\n배틀을 시작합니다!")
        start_pvp_battle(chat)
    else:
        chat.reply(f"@{sender}\n이미 배틀이 진행 중이에요!")

def handle_battleexit(sender, chat):
    """Handle battle exit command (@배틀취소)"""
    global isbattle, player1, player2

    if sender == player1 and isbattle == 3:
        isbattle = 0
        player1 = ""
        advOn[sender] = 0
        chat.reply(f"@{sender}\n배틀 참가가 취소되었습니다.")
    elif sender == player2 and isbattle == 2:
        isbattle = 3
        player2 = ""
        advOn[sender] = 0
        chat.reply(f"@{sender}\n배틀 참가가 취소되었습니다.")
    else:
        chat.reply(f"@{sender}\n배틀 중이 아니에요!")

def handle_battlenext(sender, chat, args=None):
    """Handle next pokemon command (@다음)"""
    global nextpokchoose, player1retire, player2retire

    if nextpokchoose == 0:
        chat.reply(f"@{sender}\n다음 포켓몬을 선택할 차례가 아니에요!")
        return

    # Parse arguments
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {SETTING["battlenext"]} [포켓몬번호]\n예: @다음 2')
        return

    try:
        nextpoknum = int(parts[0])
    except:
        chat.reply(f"@{sender}\n잘못 입력하셨습니다.")
        return

    # TODO: Implement next pokemon selection with nextpoknum
    chat.reply(f"@{sender}\n다음 포켓몬 선택 기능은 준비 중입니다. (선택번호: {nextpoknum})")

def handle_giveup(sender, chat):
    """Handle give up command (@배틀기권)"""
    global isbattle, player1, player2, player1pok, player2pok, player1retire, player2retire
    
    if sender not in [player1, player2]:
        chat.reply(f"@{sender}\n배틀 중이 아니에요!")
        return
    
    chat.reply(f"@{sender}\n기권했습니다!")
    
    # Determine winner
    winner = player2 if sender == player1 else player1
    
    # End battle with giveup
    end_pvp_battle(chat, winner=winner)

def start_pvp_battle(chat):
    """Start PvP battle"""
    global player1, player2, player1pok, player2pok, player1maxhp, player2maxhp
    global player1pp, player2pp, player1retire, player2retire, battleres, weather
    global player1inv, player2inv
    
    # Load player data
    player1inv = read_json(f"player_{player1}_inv")
    player2inv = read_json(f"player_{player2}_inv")
    
    # Reset all deck HP to max HP at battle start
    for pok in player1inv.get("deck", []):
        pok["hp"] = pok.get("maxhp", pok["hp"])
    for pok in player2inv.get("deck", []):
        pok["hp"] = pok.get("maxhp", pok["hp"])
    
    # Select first pokemon from deck
    player1pok = player1inv["deck"][0].copy()
    player2pok = player2inv["deck"][0].copy()
    
    player1maxhp = player1pok.get("maxhp", player1pok["hp"])
    player2maxhp = player2pok.get("maxhp", player2pok["hp"])
    
    # Initialize PP
    player1skillarr = player1pok.get("skills", []) + player1pok.get("skillslocked", [])
    player1pp = {}
    for skill in player1skillarr:
        skill_data = read_json(f"기술/{skill}")
        player1pp[skill] = (skill_data.get("pp") if skill_data else None) or 10
    
    player2skillarr = player2pok.get("skills", []) + player2pok.get("skillslocked", [])
    player2pp = {}
    for skill in player2skillarr:
        skill_data = read_json(f"기술/{skill}")
        player2pp[skill] = (skill_data.get("pp") if skill_data else None) or 10
    
    # Initialize retire lists
    player1retire = []
    player2retire = []
    battleres = ""
    
    # Random weather (1/3 chance)
    if random.randint(1, 3) == 1:
        weather = random.randint(1, 4)
    else:
        weather = 0
    
    chat.reply(f"⚔️배틀 시작!⚔️\n\n[{player1}] Lv.{player1pok['level']} {player1pok['name']} [{player1pok['hp']}HP]\nvs\n[{player2}] Lv.{player2pok['level']} {player2pok['name']} [{player2pok['hp']}HP]")
    
    # Send battle image
    try:
        img1 = pokimglink(player1pok["name"], player1pok.get("formchange", 0), player1pok.get("shiny", 0))
        img2 = pokimglink(player2pok["name"], player2pok.get("formchange", 0), player2pok.get("shiny", 0))
        send_image(None, chat, 67300, {
            'player1name': player1,
            'player2name': player2,
            'player1img': img1,
            'player2img': img2,
            'player1shiny': player1pok.get("shiny", 0),
            'player2shiny': player2pok.get("shiny", 0),
            'player1': f"Lv.{player1pok['level']} {player1pok['name']}",
            'player2': f"Lv.{player2pok['level']} {player2pok['name']}",
            'player1desc': f"[{player1pok['hp']}/{player1maxhp}]",
            'player2desc': f"[{player2pok['hp']}/{player2maxhp}]"
        })
    except Exception as e:
        print(e)
    
    # Weather message
    weather_texts = {1: "☀️해가 내리찍는다!", 2: "🌧️비가 내리기 시작한다!", 3: "🌬️모래바람이 분다!", 4: "❄️싸라기눈이 내린다!"}
    if weather > 0:
        chat.reply(weather_texts.get(weather, ""))
    
    time.sleep(3)
    
    # Battle loop
    pvp_battle_loop(chat)

def pvp_battle_loop(chat):
    """Execute battle loop for PvP - continues until one player loses all Pokemon"""
    global isbattle, player1, player2, player1pok, player2pok, player1maxhp, player2maxhp
    global player1pp, player2pp, player1retire, player2retire, battleres, weather
    global isplayer1bind, isplayer2bind, player1inv, player2inv

    max_turns = 100
    turn = 0
    
    battleres = ""

    while turn < max_turns:
        turn += 1

        # Check if player1's Pokemon fainted
        if player1pok["hp"] <= 0:
            # Send accumulated battle log
            if battleres:
                space = "\u200b" * 500
                chat.reply(f"배틀 결과\n{space}\n{battleres}")
                battleres = ""
            
            player1retire.append(len(player1retire))
            
            # Check if player1 has more Pokemon
            if len(player1retire) >= len(player1inv.get("deck", [])):
                # Player1 has no more Pokemon - Player2 wins
                end_pvp_battle(chat, winner=player2)
                return
            
            # Load next Pokemon
            next_pok_idx = len(player1retire)
            player1pok = player1inv["deck"][next_pok_idx].copy()
            player1maxhp = player1pok.get("maxhp", player1pok["hp"])
            player1pok["hp"] = player1maxhp
            player1skillarr = player1pok.get("skills", []) + player1pok.get("skillslocked", [])
            player1pp = {}
            for skill in player1skillarr:
                skill_data = read_json(f"기술/{skill}")
                player1pp[skill] = (skill_data.get("pp") if skill_data else None) or 10
            
            leftpoks = (next_pok_idx+1)*"●"+(len(player1inv["deck"])-next_pok_idx-1)*"○"
            chat.reply(f"[{player1}] {player1pok['name']} 등장!\n{leftpoks}")
            
            # Send image
            try:
                img1 = pokimglink(player1pok["name"], player1pok.get("formchange", 0), player1pok.get("shiny", 0))
                img2 = pokimglink(player2pok["name"], player2pok.get("formchange", 0), player2pok.get("shiny", 0))
                send_image(None, chat, 67300, {
                    'player1name': player1,
                    'player2name': player2,
                    'player1img': img1,
                    'player2img': img2,
                    'player1shiny': player1pok.get("shiny", 0),
                    'player2shiny': player2pok.get("shiny", 0),
                    'player1': f"Lv.{player1pok['level']} {player1pok['name']}",
                    'player2': f"Lv.{player2pok['level']} {player2pok['name']}",
                    'player1desc': f"[{player1pok['hp']}/{player1maxhp}]",
                    'player2desc': f"[{player2pok['hp']}/{player2maxhp}]"
                })
            except Exception as e:
                print(e)
            
            time.sleep(3)

        # Check if player2's Pokemon fainted
        if player2pok["hp"] <= 0:
            # Send accumulated battle log
            if battleres:
                space = "\u200b" * 500
                chat.reply(f"배틀 결과\n{space}\n{battleres}")
                battleres = ""
            
            player2retire.append(len(player2retire))
            
            # Check if player2 has more Pokemon
            if len(player2retire) >= len(player2inv.get("deck", [])):
                # Player2 has no more Pokemon - Player1 wins
                end_pvp_battle(chat, winner=player1)
                return
            
            # Load next Pokemon
            next_pok_idx = len(player2retire)
            player2pok = player2inv["deck"][next_pok_idx].copy()
            player2maxhp = player2pok.get("maxhp", player2pok["hp"])
            player2pok["hp"] = player2maxhp
            player2skillarr = player2pok.get("skills", []) + player2pok.get("skillslocked", [])
            player2pp = {}
            for skill in player2skillarr:
                skill_data = read_json(f"기술/{skill}")
                player2pp[skill] = (skill_data.get("pp") if skill_data else None) or 10
            
            leftpoks = (next_pok_idx+1)*"●"+(len(player2inv["deck"])-next_pok_idx-1)*"○"
            chat.reply(f"[{player2}] {player2pok['name']} 등장!\n{leftpoks}")
            
            # Send image
            try:
                img1 = pokimglink(player1pok["name"], player1pok.get("formchange", 0), player1pok.get("shiny", 0))
                img2 = pokimglink(player2pok["name"], player2pok.get("formchange", 0), player2pok.get("shiny", 0))
                send_image(None, chat, 67300, {
                    'player1name': player1,
                    'player2name': player2,
                    'player1img': img1,
                    'player2img': img2,
                    'player1shiny': player1pok.get("shiny", 0),
                    'player2shiny': player2pok.get("shiny", 0),
                    'player1': f"Lv.{player1pok['level']} {player1pok['name']}",
                    'player2': f"Lv.{player2pok['level']} {player2pok['name']}",
                    'player1desc': f"[{player1pok['hp']}/{player1maxhp}]",
                    'player2desc': f"[{player2pok['hp']}/{player2maxhp}]"
                })
            except Exception as e:
                print(e)
            
            time.sleep(3)

        # Execute turn
        player1skills = [s for s in player1pok.get("skills", []) if s not in player1pok.get("skillslocked", [])]
        player2skills = [s for s in player2pok.get("skills", []) if s not in player2pok.get("skillslocked", [])]
        
        if not player1skills:
            player1skills = ["태클"]
        if not player2skills:
            player2skills = ["태클"]
        
        player1skill = random.choice(player1skills)
        player2skill = random.choice(player2skills)

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
            execute_pvp_attack(player1, player2, player1pok, player2pok, player1skill, player1pp)
            if player2pok["hp"] > 0:
                execute_pvp_attack(player2, player1, player2pok, player1pok, player2skill, player2pp)
        else:
            execute_pvp_attack(player2, player1, player2pok, player1pok, player2skill, player2pp)
            if player1pok["hp"] > 0:
                execute_pvp_attack(player1, player2, player1pok, player2pok, player1skill, player1pp)

        # Weather damage
        if weather > 2:
            if weather == 3:  # Sandstorm
                pok1_file_name = f"{player1pok['name']}_{player1pok['formchange']}" if player1pok.get('formchange', 0) != 0 else player1pok['name']
                pok2_file_name = f"{player2pok['name']}_{player2pok['formchange']}" if player2pok.get('formchange', 0) != 0 else player2pok['name']
                type1_1 = read_json(f"포켓몬/{pok1_file_name}", "type1") or 0
                type2_1 = read_json(f"포켓몬/{pok1_file_name}", "type2") or 0
                if type1_1 != 6 and type2_1 != 6 and type1_1 != 7 and type2_1 != 7:
                    player1pok["hp"] = max(1, math.ceil(player1pok["hp"] * 7 / 8))
                    battleres += f"[{player1}] 모래바람이 {player1pok['name']}(를)을 덮쳤어요!\n"

                type1_2 = read_json(f"포켓몬/{pok2_file_name}", "type1") or 0
                type2_2 = read_json(f"포켓몬/{pok2_file_name}", "type2") or 0
                if type1_2 != 6 and type2_2 != 6 and type1_2 != 7 and type2_2 != 7:
                    player2pok["hp"] = max(1, math.ceil(player2pok["hp"] * 7 / 8))
                    battleres += f"[{player2}] 모래바람이 {player2pok['name']}(를)을 덮쳤어요!\n"

            elif weather == 4:  # Hail
                pok1_file_name = f"{player1pok['name']}_{player1pok['formchange']}" if player1pok.get('formchange', 0) != 0 else player1pok['name']
                pok2_file_name = f"{player2pok['name']}_{player2pok['formchange']}" if player2pok.get('formchange', 0) != 0 else player2pok['name']
                type1_1 = read_json(f"포켓몬/{pok1_file_name}", "type1") or 0
                type2_1 = read_json(f"포켓몬/{pok1_file_name}", "type2") or 0
                if type1_1 != 11 and type2_1 != 11:
                    player1pok["hp"] = max(1, math.ceil(player1pok["hp"] * 7 / 8))
                    battleres += f"[{player1}] 싸라기눈이 {player1pok['name']}(를)을 덮쳤어요!\n"
                
                type1_2 = read_json(f"포켓몬/{pok2_file_name}", "type1") or 0
                type2_2 = read_json(f"포켓몬/{pok2_file_name}", "type2") or 0
                if type1_2 != 11 and type2_2 != 11:
                    player2pok["hp"] = max(1, math.ceil(player2pok["hp"] * 7 / 8))
                    battleres += f"[{player2}] 싸라기눈이 {player2pok['name']}(를)을 덮쳤어요!\n"

        # Send periodic battle update
        if turn % 5 == 0:
            if battleres:
                space = "\u200b" * 500
                chat.reply(f"배틀 진행중...\n{space}\n{battleres}")
                battleres = ""
            
            # Send image
            try:
                img1 = pokimglink(player1pok["name"], player1pok.get("formchange", 0), player1pok.get("shiny", 0))
                img2 = pokimglink(player2pok["name"], player2pok.get("formchange", 0), player2pok.get("shiny", 0))
                send_image(None, chat, 67300, {
                    'player1name': player1,
                    'player2name': player2,
                    'player1img': img1,
                    'player2img': img2,
                    'player1shiny': player1pok.get("shiny", 0),
                    'player2shiny': player2pok.get("shiny", 0),
                    'player1': f"Lv.{player1pok['level']} {player1pok['name']}",
                    'player2': f"Lv.{player2pok['level']} {player2pok['name']}",
                    'player1desc': f"[{player1pok['hp']}/{player1maxhp}]",
                    'player2desc': f"[{player2pok['hp']}/{player2maxhp}]"
                })
            except Exception as e:
                print(e)
            
            time.sleep(3)

    # Timeout
    if battleres:
        chat.reply(battleres)
    chat.reply("배틀이 너무 길어져서 무승부로 처리됩니다.")
    isbattle = 0
    player1 = ""
    player2 = ""

def execute_pvp_attack(attacker_name, defender_name, attacker, defender, skill, pp_dict):
    """Execute a single PvP attack with full mechanics"""
    global battleres, isplayer1bind, isplayer2bind, player1pok, player2pok, weather
    
    #bind check
    if attacker_name == player1 and isplayer1bind ==1:
        isplayer1bind = 0
        battleres += f"[{attacker_name}] {attacker['name']}는 공격의 반동으로 움직일 수 없었어요!\n\n"
        return

    if attacker_name == player2 and isplayer2bind ==1:
        isplayer2bind = 0
        battleres += f"[{attacker_name}] {attacker['name']}는 공격의 반동으로 움직일 수 없었어요!\n\n"
        return

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

    # Additional effects
    addi = skill_data.get("addi") or 0    

    # Calculate damage
    atktype = skill_data.get("atktype") or 1

    if addi == 6: #atk, satk highest stat
        if attacker["atk"] > attacker["satk"]:
            atktype = 0
        else:
            atktype = 1

    if atktype == 0:
        atk_stat = attacker["atk"]
        def_stat = defender["def"]
    else:
        atk_stat = attacker.get("satk", attacker["atk"])
        def_stat = defender.get("sdef", defender["def"])

    atk = math.ceil(atk_stat * (skill_data.get("damage") or 40) / 300 * (2000 - def_stat) / 2000)

    # STAB
    skill_type = skill_data.get("type") or 1
    attacker_pok_file_name = f"{attacker['name']}_{attacker['formchange']}" if attacker.get('formchange', 0) != 0 else attacker['name']
    attacker_type1 = read_json(f"포켓몬/{attacker_pok_file_name}", "type1") or 0
    attacker_type2 = read_json(f"포켓몬/{attacker_pok_file_name}", "type2") or 0
    
    if addi == 5: #multi type
        skill_type = attacker_type1

    if skill_type == attacker_type1 or (attacker_type2 != 0 and skill_type == attacker_type2):
        atk = atk * 1.5
    
    # Weather
    atk = weatherjudge(atk, skill_type, weather)
    
    # Type effectiveness
    defender_pok_file_name = f"{defender['name']}_{defender['formchange']}" if defender.get('formchange', 0) != 0 else defender['name']
    defender_type1 = read_json(f"포켓몬/{defender_pok_file_name}", "type1") or 0
    defender_type2 = read_json(f"포켓몬/{defender_pok_file_name}", "type2") or 0
    
    judge = typejudge(skill_type, defender_type1, defender_type2)

    if judge == 0 and addi == 7: #무효도 공격
        judge = 1

    atk = atk * judge
    
    
    if addi == 4:  # Revenge
        atk = atk * (attacker.get("maxhp", attacker["hp"]) - attacker["hp"]) / 2
    
    final_damage = math.ceil(atk)
    new_hp = max(0, defender["hp"] - final_damage)
    defender["hp"] = new_hp
    
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
        attacker["hp"] = max(1, attacker["hp"] + math.ceil(atk / 4))
        battleres += f"[{attacker_name}] {attacker['name']}는 공격을 통해 체력을 흡수했어요!\n"
    elif addi == 1 and skill != "솔라빔" and weather != 1:
        if attacker_name == player1:
            isplayer1bind = 1
        else:
            isplayer2bind = 1
    elif addi == 9:
        attacker["hp"] = 1
    
    battleres += f"\n[{attacker_name}] {attacker['name']} [{attacker['hp']}HP]\n[{defender_name}] {defender['name']} [{defender['hp']}HP]\n\n"

def end_pvp_battle(chat, winner=None):
    """End the PvP battle"""
    global isbattle, player1, player2, player1pok, player2pok
    global player1retire, player2retire, battleres
    
    # Send final battle log
    if battleres:
        space = "\u200b" * 500
        chat.reply(f"배틀 결과\n{space}\n{battleres}")
        battleres = ""
    
    if winner is None:
        # Determine winner based on remaining HP
        winner = player1 if player2pok["hp"] > 0 else player2
    
    loser = player2 if winner == player1 else player1
    
    # Send result image
    try:
        if winner == player1:
            winnerpok = player1pok
            loserpok = player2pok
        else:
            winnerpok = player2pok
            loserpok = player1pok
        
        img1 = pokimglink(winnerpok["name"], winnerpok.get("formchange", 0), winnerpok.get("shiny", 0))
        img2 = pokimglink(loserpok["name"], loserpok.get("formchange", 0), loserpok.get("shiny", 0))
        send_image(None, chat, 67300, {
            'player1name': player1,
            'player2name': player2,
            'player1img': img1,
            'player2img': img2,
            'player1shiny': winnerpok.get("shiny", 0),
            'player2shiny': loserpok.get("shiny", 0),
            'player1': f"Lv.{player1pok['level']} {player1pok['name']}",
            'player2': f"Lv.{player2pok['level']} {player2pok['name']}",
            'player1desc': f"[{player1pok['hp']}/{player1maxhp}]",
            'player2desc': f"[{player2pok['hp']}/{player2maxhp}]"
        })
    except Exception as e:
        print(e)
    
    chat.reply(f"🏆배틀 종료!🏆\n\n승자: [{winner}]\n패자: [{loser}]")
    
    # Update battle counts
    pokUser1 = read_json(f"player_{player1}")
    pokUser2 = read_json(f"player_{player2}")
    
    if pokUser1:
        pokUser1["battlecount"] = pokUser1.get("battlecount", {"total": 0, "win": 0, "lose": 0})
        pokUser1["battlecount"]["total"] += 1
        if winner == player1:
            pokUser1["battlecount"]["win"] += 1
        else:
            pokUser1["battlecount"]["lose"] += 1
        write_json(f"player_{player1}", pokUser1)
    
    if pokUser2:
        pokUser2["battlecount"] = pokUser2.get("battlecount", {"total": 0, "win": 0, "lose": 0})
        pokUser2["battlecount"]["total"] += 1
        if winner == player2:
            pokUser2["battlecount"]["win"] += 1
        else:
            pokUser2["battlecount"]["lose"] += 1
        write_json(f"player_{player2}", pokUser2)
    
    # Reset battle state
    if player1 and player1 in advOn:
        advOn[player1] = 0
    if player2 and player2 in advOn:
        advOn[player2] = 0
    
    isbattle = 0
    player1 = ""
    player2 = ""
    player1pok = {}
    player2pok = {}
    player1retire = []
    player2retire = []