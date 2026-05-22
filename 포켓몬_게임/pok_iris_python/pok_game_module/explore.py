# Module 3: Exploration and Pokemon Appearance
import time
import random
import math
from .config import SETTING, POK_ARR, SEASONS, ADV_FAIL, BALL_ARR, CMDS, PALPARK_BANNED_POKS, MEGA_AFTER_NAMES, GMAX_AFTER_NAMES
from .io_helpers import read_json, write_json, pokimglink, send_image

from datetime import datetime

# Global state for exploration
ispokfind = []
battlepokinfo = []
advOn = {}
pokdelay = {}

def get_day_or_night():
    current_hour = datetime.now().hour

    if 7 <= current_hour < 19:
        return "day"
    else:
        return "night"

def handle_explore(sender, room, chat):
    """Handle exploration command (@야생/ㅇㅅ)"""
    global ispokfind, battlepokinfo, advOn, pokdelay

    # Check maintenance mode
    from .maintenance import check_updating
    if not check_updating(sender, chat):
        return

    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.\n"{CMDS["join"]}"으로 회원가입부터 진행해 주세요.')
        return
    
    if sender not in advOn:
        advOn[sender] = 0
    
    if advOn[sender] == 2 or advOn[sender] == 3:
        chat.reply(f'@{sender}\n이미 탐험 또는 배틀 중이에요.')
        return
    
    if advOn[sender] == 1:
        chat.reply(f'@{sender}\n탐험중이에요. 기다리세요.')
        return
    
    if pokUser.get("restOn", {}).get("on", False):
        chat.reply(f'@{sender} \n휴식 중입니다.\n"{CMDS["rest"]}" 을 입력해서 휴식을 종료하세요.')
        return

    if pokUser.get("hp", 0) <= 0:
        chat.reply(f'@{sender} \n체력이 부족해요.\n"{CMDS["rest"]}" 명령어를 사용해보세요.')
        return
    
    if pokUser.get("balls", 0) <= 0:
        chat.reply(f'@{sender} \n볼이 없는 상태에선 탐험할 수 없어요.\n"{CMDS["ball"]}" 을 통해 볼을 구매해 주세요.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    pokCol = read_json(f"player_{sender}_collection")
    
    if pokCol is None:
        dogam = {name: [] for name in ['관동지방', '성도지방', '호연지방', '신오지방', '하나지방', '칼로스지방', '알로라지방', '전설/환상', '울트라비스트', '???']}
        write_json(f"player_{sender}_collection", dogam)
        pokCol = read_json(f"player_{sender}_collection")
    
    cast_delay = math.ceil((random.random() * (SETTING["castT"]["max"] * 1000 - SETTING["castT"]["min"] * 1000) + SETTING["castT"]["min"] * 1000) * (100 - pokUser.get("castT", 0)) / 100)
    pokdelay[sender] = cast_delay
    advOn[sender] = 1
    
    chat.reply(f"@{sender}\n탐험을 시작합니다!\n탐험은 포켓몬을 발견하면 종료되며,\n실패 또는 포켓몬 미발견 시마다 자동으로 재시도됩니다.")
    
    time.sleep(cast_delay / 1000.0)
    
    if advOn[sender] == 0:
        return
    
    # Exploration logic
    r = random.randint(1, 100)
    while r > pokUser.get("success", 70):
        chat.reply(f"@{sender}\n{random.choice(ADV_FAIL)}")
        pokUser["hp"] = pokUser.get("hp", 0) - 1
        write_json(f"player_{sender}", pokUser)
        write_json(f"player_{sender}_inv", pokInv)
        
        cast_delay = math.ceil((random.random() * (SETTING["castT"]["max"] * 1000 - SETTING["castT"]["min"] * 1000) + SETTING["castT"]["min"] * 1000) * (100 - pokUser.get("castT", 0)) / 100)
        time.sleep(cast_delay / 1000.0)
        
        if advOn[sender] == 0:
            return
        r = random.randint(1, 100)
    
    # Determine what appears
    prob = get_prob(sender, pokUser)
    

    while prob < 3:
        r = random.randint(1, 100)
        if r > pokUser.get("success", 70):
            chat.reply(f"@{sender}\n{random.choice(ADV_FAIL)}")
        else:
            if prob == 1:  # Money discovery
                money = (random.randint(1, 100) + 1) * 500
                money = money * (BALL_ARR.index(pokUser.get("Ball", BALL_ARR[0])) + 1) * 100
                pokUser["gold"] = pokUser.get("gold", 0) + money
                chat.reply(f"@{sender}\n{random.choice(POK_ARR['gold'])}를(을) 발견했어요!\n상점에 팔아 {money:,}원을 획득했어요.")
            elif prob == 2:  # Items
                ran = random.randint(1, 100)
                if ran < 84:
                    balln = random.randint(1, 10)
                    pokUser["balls"] = pokUser.get("balls", 0) + balln
                    if pokUser["balls"] >= SETTING["maxball"]:
                        pokUser["balls"] = SETTING["maxball"]
                    chat.reply(f"@{sender}\n바닥에 떨어진 볼을 발견했어요!\n볼 {balln}개 획득.")
                else:
                    if ran == 84:
                        if "item" not in pokInv:
                            pokInv["item"] = []
                        pokInv["item"].append("금왕관")
                        chat.reply(f"@{sender}\n축하합니다!\n금왕관을 발견했습니다.")
                    elif ran < 95:
                        if "item" not in pokInv:
                            pokInv["item"] = []
                        pokInv["item"].append("일반알")
                        chat.reply(f"@{sender}\n축하합니다!\n포켓몬의 알을 발견했습니다.\n'{CMDS['egg']}' 명령어를 통해 알을 부화시키세요.")
                    elif ran == 99:
                        if "item" not in pokInv:
                            pokInv["item"] = []
                        pokInv["item"].append("전설알")
                        chat.reply(f"@{sender}\n축하합니다!\n<⭐전설/환상⭐> 포켓몬의 알을 발견했습니다.\n'{CMDS['legendegg']}' 명령어를 통해 알을 부화시키세요.")
                    else:
                        money = SETTING["luckygold"]
                        pokUser["gold"] = pokUser.get("gold", 0) + money
                        chat.reply(f"@{sender}\n축하합니다!\n🪨알 수 없는 돌을 발견했어요!\n상점에 팔아 {money:,}원을 획득했어요.")
        
        pokUser["hp"] = pokUser.get("hp", 0) - 1
        write_json(f"player_{sender}", pokUser)
        write_json(f"player_{sender}_inv", pokInv)
        
        cast_delay = math.ceil((random.random() * (SETTING["castT"]["max"] * 1000 - SETTING["castT"]["min"] * 1000) + SETTING["castT"]["min"] * 1000) * (100 - pokUser.get("castT", 0)) / 100)
        time.sleep(cast_delay / 1000.0)
        
        if advOn[sender] == 0:
            return
        prob = get_prob(sender, pokUser)
        r = random.randint(1, 100)
    
    # Pokemon appearance
    pokname = get_pokemon_name(prob, pokUser)
    lev = SETTING["minlevel"] + (BALL_ARR.index(pokUser.get("Ball", BALL_ARR[0])) + 1) * SETTING["balluplev"]
    lev = lev + random.randint(1, 10)
    
    #shiny determine
    shiny = 0

    shiny_prob = 3 * SETTING['eventp']['shiny']

    shr = random.randint(1, 1000)
    if shr < shiny_prob:
        shiny = 1

    # Display message based on rarity
    lt = len(pokname) - 1

    particle = ''

    if shiny > 0:
        particle += '✨'

    particle += '(이)가'
    
    if pokname in POK_ARR['groupunknown']['day'] or pokname in POK_ARR['groupunknown']['night']:
        chat.reply(f"@{sender}\n❗ <???> {pokname}{particle} 나타났어요!")
    elif pokname in POK_ARR['group6']['day'] or pokname in POK_ARR['group6']['night']:
        chat.reply(f"@{sender}\n❗ <⏳️패러독스⏳️> {pokname}{particle} 나타났어요!")
    elif pokname in POK_ARR['group5']['day'] or pokname in POK_ARR['group5']['night']:
        chat.reply(f"@{sender}\n❗ <🦄울트라비스트🦄> {pokname}{particle} 나타났어요!")
    elif pokname in POK_ARR['group4']['day'] or pokname in POK_ARR['group4']['night']:
        chat.reply(f"@{sender}\n❗ <⭐전설/환상⭐> {pokname}{particle} 나타났어요!")
    elif pokname in POK_ARR['group3']['day'] or pokname in POK_ARR['group3']['night']:
        chat.reply(f"@{sender}\n❗ [레어] 야생의 {pokname}{particle} 나타났어요!")
    elif pokname in POK_ARR['group2']['day'] or pokname in POK_ARR['group2']['night']:
        chat.reply(f"@{sender}\n❗ [고급] 야생의 {pokname}{particle} 나타났어요!")
    else:
        chat.reply(f"@{sender}\n❗ [일반] 야생의 {pokname}{particle} 튀어나왔어요!")
    
    pokUser["count"] = pokUser.get("count", {"total": 0, "succ": 0})
    pokUser["count"]["total"] = pokUser["count"].get("total", 0) + 1

    pokinfo = {'name': pokname, 'level': lev, 'shiny':shiny}
    ispokfind.append(sender)
    battlepokinfo.append(pokinfo)
    advOn[sender] = 2

    # Save state immediately in case of error
    try:
        # Re-read to get current ball count before writing (balls may have been decremented by throws)
        current_pokUser = read_json(f"player_{sender}")
        if current_pokUser:
            pokUser["balls"] = current_pokUser.get("balls", pokUser.get("balls", 0))
            pokUser["gold"] = current_pokUser.get("gold", pokUser.get("gold", 0))
        
        write_json(f"player_{sender}", pokUser)
        write_json(f"player_{sender}_inv", pokInv)
    except Exception as e:
        # Force cleanup on error
        ispokfind.remove(sender)
        battlepokinfo.pop(len(battlepokinfo) - 1)
        advOn[sender] = 0
        print(f"Error in exploration: {e}")
        return
    
    # Send image via KakaoTalk link
    try:
        img = pokimglink(pokname, 0, pokinfo.get("shiny", 0))
        poklink = f"ko/wiki/{pokname}_(포켓몬)"
        
        send_image(room, chat, 58796, {
            'POKIMG': img,
            'shiny':pokinfo.get("shiny", shiny),
            'POKNAME': f"Lv.{lev}  {pokname}",
            'DESC': f"도감 검색: {CMDS.get('dic', ['@도감'])} [포켓몬이름]\n볼던지기: {','.join(CMDS.get('ballthrow', ['@볼']))}        도망가기: {','.join(CMDS.get('esc', ['@도망']))}",
            'LINK': poklink
        })
    except Exception as e:
        chat.reply(f"카카오링크 오류. 리셋 한번 해주세요.\n(볼은 던질수 있음)\n\nLv.{lev}  {pokname}\n볼던지기: {','.join(CMDS.get('ballthrow', ['@볼']))}\n도망가기: {','.join(CMDS.get('esc', ['@도망']))}")

def get_prob(sender, pokUser):
    """Determine what appears during exploration"""
    r = random.randint(1, 100)
    ball_idx = BALL_ARR.index(pokUser.get("Ball", BALL_ARR[0]))
    
    gunknown_rate = 1 + SETTING["eventp"]['unknown']

    # Probability calculation
    g6_rate = SETTING["p"]["g6"] + SETTING["ballg6"][ball_idx] + pokUser.get("stat", {}).get("g6", 0.1)+ SETTING["eventp"]['g6']
    g5_rate = SETTING["p"]["g5"] + SETTING["ballg5"][ball_idx] + pokUser.get("stat", {}).get("g5", 0.1)+ SETTING["eventp"]['g5']
    g4_rate = SETTING["p"]["g4"] + SETTING["ballg4"][ball_idx] + pokUser.get("stat", {}).get("g4", 0.1)+ SETTING["eventp"]['g4']
    g3_rate = SETTING["p"]["g3"] + SETTING["ballg3"][ball_idx] + pokUser.get("stat", {}).get("g3", 0.1)+ SETTING["eventp"]['g3']
    
    if r <= gunknown_rate:
        return 99  # ???
    elif r <= g6_rate + gunknown_rate:
        return 8  # paradox
    elif r <= g6_rate + g5_rate + gunknown_rate:
        return 3  # Ultra Beast
    elif r <= g6_rate + g5_rate + g4_rate + gunknown_rate:
        return 4  # Legendary
    elif r <= g6_rate + g5_rate + g4_rate + g3_rate + gunknown_rate:
        return 5  # Rare
    elif r <= 50:
        return 6  # Common
    elif r <= 85:
        return 7  # Seasonal
    else:
        return random.choice([1, 2])  # Money or items

def get_pokemon_name(prob, pokUser):
    """Get Pokemon name based on probability"""
    from .config import SEASONS

    day_or_night = get_day_or_night()
    
    if prob == 99:
        return random.choice(POK_ARR['groupunknown'][day_or_night])
    elif prob == 8:
        return random.choice(POK_ARR['group6'][day_or_night])
    elif prob == 3:
        return random.choice(POK_ARR['group5'][day_or_night])
    elif prob == 4:
        return random.choice(POK_ARR['group4'][day_or_night])
    elif prob == 5:
        return random.choice(POK_ARR['group3'][day_or_night])
    elif prob == 6:
        return random.choice(POK_ARR['group2'][day_or_night])
    else:
        return random.choice(POK_ARR['group1'][day_or_night])

def handle_palpark(sender, room, chat, args=None):
    """Handle Pal Park command (@팔파크)"""

    if args is None:
        chat.reply(f'@{sender}\n사용법: {CMDS["palpark"]} [포켓몬이름]')
        return

    if args in PALPARK_BANNED_POKS or args in MEGA_AFTER_NAMES or args in GMAX_AFTER_NAMES:
        chat.reply(f'@{sender}\n팔파크는 탐험으로 발견 가능한 포켓몬에만 사용할 수 있어요!')
        return

    if read_json(f"포켓몬/{args}") is None:
        chat.reply(f'@{sender}\n팔파크는 탐험으로 발견 가능한 포켓몬에만 사용할 수 있어요!')
        return

    # Check maintenance mode
    from .maintenance import check_updating
    if not check_updating(sender, chat):
        return

    pokUser = read_json(f"player_{sender}")

    pokInv = read_json(f"player_{sender}_inv")

    if pokUser is None or pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.\n"{CMDS["join"]}"으로 회원가입부터 진행해 주세요.')
        return
    
    if sender not in advOn:
        advOn[sender] = 0
    
    if advOn[sender] != 0:
        chat.reply(f'@{sender}\n먼저 진행중이던 탐험이나 배틀을 끝내 주세요!')
        return

    if pokUser.get("balls", 0) <= 0:
        chat.reply(f'@{sender} \n볼이 없는 상태에선 팔파크 티켓을 사용할 수 없어요.\n"{CMDS["ball"]}" 을 통해 볼을 구매해 주세요.')
        return
    
    # Ensure item list exists
    if "item" not in pokInv:
        pokInv["item"] = []
        write_json(f"player_{sender}_inv", pokInv)

    if "팔파크티켓" not in pokInv.get("item", []):
        chat.reply(f'@{sender}\n보유하고 있는 팔파크 티켓이 없어요!')
        return
    
    # Remove ticket
    pokInv["item"].remove("팔파크티켓")

    lev = SETTING["minlevel"] + (BALL_ARR.index(pokUser.get("Ball", BALL_ARR[0])) + 1) * SETTING["balluplev"]
    lev = lev + random.randint(1, 10)
    
    #shiny determine
    shiny = 0

    shiny_prob = 3 * SETTING['eventp']['shiny']

    shr = random.randint(1, 1000)
    if shr < shiny_prob:
        shiny = 1

    # Display message based on rarity
    lt = len(args) - 1

    particle = ''

    if shiny > 0:
        particle += '✨'

    #particle += '(이)가'

    chat.reply(f"@{sender}\n팔파크 티켓 사용.\n{args}{particle} 포획 도전!")
    
    pokUser["count"] = pokUser.get("count", {"total": 0, "succ": 0})
    pokUser["count"]["total"] = pokUser["count"].get("total", 0) + 1

    pokinfo = {'name': args, 'level': lev, 'shiny':shiny}
    ispokfind.append(sender)
    battlepokinfo.append(pokinfo)
    advOn[sender] = 2

    # Save state immediately in case of error
    try:
        # Re-read to get current ball count before writing (balls may have been decremented by throws)
        current_pokUser = read_json(f"player_{sender}")
        if current_pokUser:
            pokUser["balls"] = current_pokUser.get("balls", pokUser.get("balls", 0))
            pokUser["gold"] = current_pokUser.get("gold", pokUser.get("gold", 0))
        
        write_json(f"player_{sender}", pokUser)
        write_json(f"player_{sender}_inv", pokInv)
    except Exception as e:
        # Force cleanup on error
        ispokfind.remove(sender)
        battlepokinfo.pop(len(battlepokinfo) - 1)
        advOn[sender] = 0
        print(f"Error in exploration: {e}")
        return
    
    # Send image via KakaoTalk link
    try:
        img = pokimglink(args, 0, pokinfo.get("shiny", 0))
        poklink = f"ko/wiki/{args}_(포켓몬)"
        
        send_image(room, chat, 58796, {
            'POKIMG': img,
            'shiny':pokinfo.get("shiny", shiny),
            'POKNAME': f"Lv.{lev}  {args}",
            'DESC': f"도감 검색: {CMDS.get('dic', ['@도감'])} [포켓몬이름]\n볼던지기: {','.join(CMDS.get('ballthrow', ['@볼']))}        도망가기: {','.join(CMDS.get('esc', ['@도망']))}",
            'LINK': poklink
        })
    except Exception as e:
        print(e)
        chat.reply(f"카카오링크 오류. 리셋 한번 해주세요.\n(볼은 던질수 있음)\n\nLv.{lev}  {args}\n볼던지기: {','.join(CMDS.get('ballthrow', ['@볼']))}\n도망가기: {','.join(CMDS.get('esc', ['@도망']))}")


