# Module 3: Exploration and Pokemon Appearance
import time
import random
import math
from .config import SETTING, POK_ARR, SEASONS, ADV_FAIL, BALL_ARR
from .io_helpers import read_json, write_json, pokimglink, send_image

# Global state for exploration
ispokfind = []
battlepokinfo = []
advOn = {}
pokdelay = {}

def handle_explore(sender, room, chat):
    """Handle exploration command (@야생/ㅇㅅ)"""
    global ispokfind, battlepokinfo, advOn, pokdelay
    
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.\n"{SETTING["join"]}"으로 회원가입부터 진행해 주세요.')
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
        chat.reply(f'@{sender} \n휴식 중입니다.\n"{SETTING["rest"]}" 을 입력해서 휴식을 종료하세요.')
        return
    
    if pokUser.get("hp", 0) <= 0:
        chat.reply(f'@{sender} \n체력이 부족해요.\n"{SETTING["rest"]}" 명령어를 사용해보세요.')
        return
    
    if pokUser.get("balls", 0) <= 0:
        chat.reply(f'@{sender} \n볼이 없는 상태에선 탐험할 수 없어요.\n"{SETTING["ball"]}" 을 통해 볼을 구매해 주세요.')
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
                    if pokUser["balls"] > SETTING["maxball"]:
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
                        chat.reply(f"@{sender}\n축하합니다!\n포켓몬의 알을 발견했습니다.\n'{SETTING['egg']}' 명령어를 통해 알을 부화시키세요.")
                    elif ran == 99:
                        if "item" not in pokInv:
                            pokInv["item"] = []
                        pokInv["item"].append("전설알")
                        chat.reply(f"@{sender}\n축하합니다!\n<⭐전설⭐> 포켓몬의 알을 발견했습니다.\n'{SETTING['legendegg']}' 명령어를 통해 알을 부화시키세요.")
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
    
    # Display message based on rarity
    lt = len(pokname) - 1
    particle = '이' if len(pokname.encode('utf-8')) != len(pokname) else '가'
    
    if pokname in POK_ARR['groupunknown']:
        chat.reply(f"@{sender}\n❗ <???> {pokname}{particle} 나타났어요!")
    elif pokname in POK_ARR['group5']:
        chat.reply(f"@{sender}\n❗ <🦄울트라비스트🦄> {pokname}{particle} 나타났어요!")
    elif pokname in POK_ARR['group4']:
        chat.reply(f"@{sender}\n❗ <⭐전설⭐> {pokname}{particle} 나타났어요!")
    elif pokname in POK_ARR['group3']:
        chat.reply(f"@{sender}\n❗ [레어] 야생의 {pokname}{particle} 나타났어요!")
    elif pokname in POK_ARR['group2']:
        chat.reply(f"@{sender}\n❗ [고급] 야생의 {pokname}{particle} 나타났어요!")
    else:
        chat.reply(f"@{sender}\n❗ [일반] 야생의 {pokname}{particle} 튀어나왔어요!")
    
    pokUser["count"] = pokUser.get("count", {"total": 0, "succ": 0})
    pokUser["count"]["total"] = pokUser["count"].get("total", 0) + 1
    
    pokinfo = {'name': pokname, 'level': lev}
    ispokfind.append(sender)
    battlepokinfo.append(pokinfo)
    advOn[sender] = 2
    
    write_json(f"player_{sender}", pokUser)
    write_json(f"player_{sender}_inv", pokInv)
    
    # Send image via KakaoTalk link
    try:
        img = pokimglink(pokname, 0)
        poklink = f"ko/wiki/{pokname}_(포켓몬)"
        
        send_image(room, chat, 58796, {
            'POKIMG': img,
            'POKNAME': f"Lv.{lev}  {pokname}",
            'DESC': f"볼던지기: {','.join(SETTING.get('ballthrow_cmds', ['@볼']))}\n도망가기: {','.join(SETTING.get('esc_cmds', ['@도망']))}",
            'LINK': poklink
        })
    except Exception as e:
        chat.reply(f"카카오링크 오류. 리셋 한번 해주세요.\n(볼은 던질수 있음)\n\nLv.{lev}  {pokname}\n볼던지기: {','.join(SETTING.get('ballthrow_cmds', ['@볼']))}\n도망가기: {','.join(SETTING.get('esc_cmds', ['@도망']))}")

def get_prob(sender, pokUser):
    """Determine what appears during exploration"""
    r = random.randint(1, 100)
    ball_idx = BALL_ARR.index(pokUser.get("Ball", BALL_ARR[0]))
    
    # Probability calculation
    g5_rate = SETTING["p"]["g5"] + SETTING["ballg5"][ball_idx] + pokUser.get("stat", {}).get("g5", 0)
    g4_rate = SETTING["p"]["g4"] + SETTING["ballg4"][ball_idx] + pokUser.get("stat", {}).get("g4", 0)
    g3_rate = SETTING["p"]["g3"] + SETTING["ballg3"][ball_idx] + pokUser.get("stat", {}).get("g3", 0)
    
    if r <= g5_rate:
        return 3  # Ultra Beast
    elif r <= g5_rate + g4_rate:
        return 4  # Legendary
    elif r <= g5_rate + g4_rate + g3_rate:
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
    
    if prob == 7:  # Seasonal
        month = read_json("season", "month") or 1
        season_key = {1: 'spring', 2: 'summer', 3: 'autumn', 4: 'winter'}[month]
        return random.choice(SEASONS[season_key])
    elif prob == 99:
        return random.choice(POK_ARR['groupunknown'])
    elif prob == 3:
        return random.choice(POK_ARR['group5'])
    elif prob == 4:
        return random.choice(POK_ARR['group4'])
    elif prob == 5:
        return random.choice(POK_ARR['group3'])
    elif prob == 6:
        return random.choice(POK_ARR['group2'])
    else:
        return random.choice(POK_ARR['group1'])
