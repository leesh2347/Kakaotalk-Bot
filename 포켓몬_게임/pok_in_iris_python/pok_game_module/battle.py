# Module 8: PvP Battle
import random
import math
import time
from .config import SETTING, BALL_ARR, TYPE_TEXTS
from .io_helpers import read_json, write_json, typejudge, weatherjudge, send_image, pokimglink

# Global battle state
isbattle = 0
player1 = ""
player2 = ""
player1pok = {}
player2pok = {}
player1maxhp = 0
player2maxhp = 0
player1pp = []
player2pp = []
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

def handle_battlejoin(sender, chat):
    """Handle battle join command (@배틀참가)"""
    global isbattle, player1, player2, advOn
    
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
        isbattle = 1
        advOn[sender] = 3
        chat.reply(f"@{sender}\n배틀 참가 완료!\n상대를 기다리는 중...")
    elif isbattle == 1 and player1 != sender:
        # Join existing battle
        player2 = sender
        isbattle = 2
        advOn[sender] = 3
        chat.reply(f"@{player2}\n배틀 참가 완료!\n배틀을 시작합니다!")
        start_battle(chat)
    else:
        chat.reply(f"@{sender}\n이미 배틀이 진행 중이에요!")

def handle_battleexit(sender, chat):
    """Handle battle exit command (@배틀취소)"""
    global isbattle, player1, player2, advOn
    
    if sender == player1 and isbattle == 1:
        isbattle = 0
        player1 = ""
        advOn[sender] = 0
        chat.reply(f"@{sender}\n배틀 참가가 취소되었습니다.")
    elif sender == player2 and isbattle == 2:
        isbattle = 1
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
    global isbattle, player1, player2
    
    if sender not in [player1, player2]:
        chat.reply(f"@{sender}\n배틀 중이 아니에요!")
        return
    
    chat.reply(f"@{sender}\n기권했습니다!")
    
    # End battle
    isbattle = 0
    player1 = ""
    player2 = ""

def start_battle(chat):
    """Start PvP battle"""
    global player1, player2, player1pok, player2pok, player1maxhp, player2maxhp
    
    # Load player data
    pokInv1 = read_json(f"player_{player1}_inv")
    pokInv2 = read_json(f"player_{player2}_inv")
    
    # Select first pokemon from deck
    player1pok = pokInv1["deck"][0].copy()
    player2pok = pokInv2["deck"][0].copy()
    
    player1maxhp = player1pok["hp"]
    player2maxhp = player2pok["hp"]
    
    chat.reply(f"⚔️배틀 시작!⚔️\n\n[{player1}] Lv.{player1pok['level']} {player1pok['name']} [{player1pok['hp']}HP]\nvs\n[{player2}] Lv.{player2pok['level']} {player2pok['name']} [{player2pok['hp']}HP]")
    
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
    
    # Battle loop
    battle_turn(chat)

def battle_turn(chat):
    """Execute one battle turn"""
    global player1, player2, player1pok, player2pok, player1maxhp, player2maxhp, battleres
    
    battleres = ""
    
    # Select random skills
    player1skill = random.choice(player1pok.get("skills", ["태클"]))
    player2skill = random.choice(player2pok.get("skills", ["태클"]))
    
    # Determine turn order by speed
    if player1pok["spd"] >= player2pok["spd"]:
        execute_attack(player1, player2, player1pok, player2pok, player1skill, chat)
        if player2pok["hp"] > 0:
            execute_attack(player2, player1, player2pok, player1pok, player2skill, chat)
    else:
        execute_attack(player2, player1, player2pok, player1pok, player2skill, chat)
        if player1pok["hp"] > 0:
            execute_attack(player1, player2, player1pok, player2pok, player1skill, chat)
    
    # Check for faint
    if player1pok["hp"] <= 0 or player2pok["hp"] <= 0:
        end_battle(chat)
    else:
        chat.reply(f"{battleres}")

def execute_attack(attacker_name, defender_name, attacker, defender, skill, chat):
    """Execute a single attack"""
    global battleres
    
    skill_data = read_json(f"기술/{skill}")
    if not skill_data:
        battleres += f"[{attacker_name}] {attacker['name']}의 {skill}!\n기술 데이터 없음!\n\n"
        return
    
    # Calculate damage
    atk = math.ceil(attacker["atk"] * skill_data.get("damage", 40) / 300 * (2000 - defender["def"]) / 2000)
    
    # Type effectiveness
    skill_type = skill_data.get("type", 1)
    defender_type1 = read_json(f"포켓몬/{defender['name']}", "type1") or 1
    defender_type2 = read_json(f"포켓몬/{defender['name']}", "type2") or 1
    
    judge = typejudge(skill_type, defender_type1, defender_type2)
    atk = atk * judge
    
    # Apply weather
    atk = weatherjudge(atk, skill_type, weather)
    
    defender["hp"] = max(0, defender["hp"] - atk)
    
    battleres += f"[{attacker_name}] {attacker['name']}의 {skill}!\n"
    if judge > 1:
        battleres += "효과가 굉장했어요!\n"
    elif judge == 0:
        battleres += "효과가 없는 듯해요...\n"
    elif judge < 1:
        battleres += "효과가 별로인 듯해요\n"
    
    battleres += f"\n[{attacker_name}] {attacker['name']} [{attacker['hp']}HP]\n[{defender_name}] {defender['name']} [{defender['hp']}HP]\n\n"

def end_battle(chat):
    """End the battle"""
    global isbattle, player1, player2, player1pok, player2pok
    
    winner = player1 if player2pok["hp"] > 0 else player2
    loser = player2 if winner == player1 else player1
    
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
    isbattle = 0
    player1 = ""
    player2 = ""
