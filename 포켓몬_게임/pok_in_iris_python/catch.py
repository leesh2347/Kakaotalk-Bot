# Module 4: Pokemon Catching
import random
import math
import unicodedata
from .config import SETTING, BALL_ARR, BALL_FAIL, RUN_POKS, V_TEXTS
from .io_helpers import read_json, write_json

isballwaiting = []

def handle_ballthrow(sender, chat):
    """Handle ball throw command (@볼/ㅂ)"""
    global isballwaiting
    
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.\n"{SETTING["join"]}"으로 회원가입부터 진행해 주세요.')
        return
    
    # Check if Pokemon is found
    from .explore import ispokfind, battlepokinfo, advOn
    
    if sender not in ispokfind:
        chat.reply(f'@{sender}\n발견한 포켓몬이 없어요!\n@야생 명령어로 탐험부터 시작해 보세요.')
        return
    
    if sender in isballwaiting:
        chat.reply(f'@{sender}\n이미 볼을 던진 상태예요.')
        return
    
    # Find Pokemon info
    idx = ispokfind.index(sender)
    pokinfo = battlepokinfo[idx]
    pokname = pokinfo['name']
    lev = pokinfo['level']
    
    # Check if player has balls
    if pokUser.get("balls", 0) <= 0:
        chat.reply(f'@{sender}\n볼이 없어요!\n"{SETTING["ball"]}" 명령어로 볼을 구매하세요.')
        return
    
    pokUser["balls"] -= 1

    chat.reply(f'@{sender}님이 {pokname}에게 {pokUser.get("Ball", BALL_ARR[0])}을 던졌어요!')
    
    # Catch calculation - determine Pokemon group
    ball_idx = BALL_ARR.index(pokUser.get("Ball", BALL_ARR[0]))
    
    # Determine group for catch rate
    from .config import POK_ARR, RUN_POKS
    
    if pokname in POK_ARR['groupunknown']:
        group = 99
        catch_rate = 20  # Unknown group fixed rate
    elif pokname in POK_ARR['group5']:
        group = 5
        catch_rate = pokUser.get("successcatch", {}).get("g5", 0)
    elif pokname in POK_ARR['group4']:
        group = 4
        catch_rate = pokUser.get("successcatch", {}).get("g4", 0)
    elif pokname in POK_ARR['group3']:
        group = 3
        catch_rate = pokUser.get("successcatch", {}).get("g3", 0)
    elif pokname in POK_ARR['group2']:
        group = 2
        catch_rate = pokUser.get("successcatch", {}).get("g2", 0)
    else:
        group = 1
        catch_rate = pokUser.get("successcatch", {}).get("g1", 0)
    
    # Apply event bonuses
    from .config import SETTING
    if group == 4:
        catch_rate = catch_rate + SETTING['eventp'].get('g4catch', 0)
    elif group == 3:
        catch_rate = catch_rate + SETTING['eventp'].get('g3catch', 0)
    else:
        catch_rate = catch_rate + SETTING['eventp'].get('allcatch', 0)
    
    # Apply collection bonus (collection index 17)
    if pokUser.get("activecollection") and 17 in pokUser.get("activecollection", []):
        catch_rate = catch_rate + pokUser.get("collectionlev", 0)
    
    # Ensure minimum catch rate
    if catch_rate < 0:
        catch_rate = 1
    
    # Level difference penalty
    lev_penalty = max(0, (lev - 100) * 2)
    catch_rate = max(10, catch_rate - lev_penalty)
    
    # Catch attempt
    if random.randint(1, 100) <= catch_rate:
        # Success - catch Pokemon
        caught_pok = create_pokemon(pokname, lev)
        pokInv = read_json(f"player_{sender}_inv")
        
        if "box" not in pokInv:
            pokInv["box"] = []
        pokInv["box"].append(caught_pok)
        
        # Update collection
        pokCol = read_json(f"player_{sender}_collection")
        if pokCol:
            from .config import COLLECTION_NAMES, COLLECTION_CONTENTS
            for ii in COLLECTION_NAMES:
                if pokname in COLLECTION_CONTENTS[COLLECTION_NAMES.index(ii)]:
                    if ii not in pokCol:
                        pokCol[ii] = []
                    if pokname not in pokCol[ii]:
                        pokCol[ii].append(pokname)
                        chat.reply(f"@{sender}\n도감의 [{ii}] 에 새로운 포켓몬이 등록되었습니다.")
                    break
            write_json(f"player_{sender}_collection", pokCol)
        
        write_json(f"player_{sender}_inv", pokInv)

        pokUser["count"]["succ"] = pokUser.get("count", {}).get("succ", 0) + 1
        pokUser["hp"] = pokUser.get("hp", 1) - 1  # Decrease HP on catch
        write_json(f"player_{sender}", pokUser)
        
        chat.reply(f"@{sender}\n축하합니다!\n{pokname}{'을' if len(unicodedata.normalize('NFD', pokname[-1])) == 3 else '를'} 잡았습니다!")

        # Clean up
        ispokfind.remove(sender)
        battlepokinfo.pop(idx)
        advOn[sender] = 0
        if sender in isballwaiting:
            isballwaiting.remove(sender)
    else:
        # Fail - Pokemon not caught
        chat.reply(f"@{sender}\n{random.choice(BALL_FAIL)}")
        
        # Calculate flee probability (reuse group from above)
        from .explore import ispokfind, battlepokinfo, advOn
        
        idx = ispokfind.index(sender)
        pokinfo = battlepokinfo[idx]
        pokname = pokinfo['name']
        
        # Determine flee probability based on group
        from .config import SETTING, RUN_POKS
        
        if pokname in RUN_POKS or pokname in POK_ARR['groupunknown']:
            runprob = 90
        else:
            # mapping: group 5→0, 4→1, 3→2, 2→3, 1→4
            runprob = SETTING['run'][5 - group]
        
        # Check if Pokemon flees
        if runprob > (random.randint(1, 100)):
            # Pokemon fled - end exploration
            pokUser["count"]["fail"] = pokUser.get("count", {}).get("fail", 0) + 1
            pokUser["hp"] = pokUser.get("hp", 1) - 1
            write_json(f"player_{sender}", pokUser)
            write_json(f"player_{sender}_inv", read_json(f"player_{sender}_inv"))
            
            ispokfind.remove(sender)
            battlepokinfo.pop(idx)
            advOn[sender] = 0
            
            lt = len(pokname) - 1
            particle = '은' if len(unicodedata.normalize('NFD', pokname[-1])) == 3 else '는'
            chat.reply(f"@{sender}\n야생의 {pokname}{particle} 도망쳐 버렸어요!\n포획 실패!")
            
            if sender in isballwaiting:
                isballwaiting.remove(sender)
        elif pokUser.get("balls", 0) < 1:
            # No balls left - end exploration
            pokUser["count"]["fail"] = pokUser.get("count", {}).get("fail", 0) + 1
            pokUser["hp"] = pokUser.get("hp", 1) - 1
            write_json(f"player_{sender}", pokUser)
            write_json(f"player_{sender}_inv", read_json(f"player_{sender}_inv"))
            
            ispokfind.remove(sender)
            battlepokinfo.pop(idx)
            advOn[sender] = 0
            
            chat.reply(f"@{sender}\n더 이상 던질 볼이 없어 도망쳐 나왔어요. {SETTING.get('ball', '@볼구매')} 를 통해 볼을 구매해 주세요!\n포획 실패!")
            
            if sender in isballwaiting:
                isballwaiting.remove(sender)
        else:
            # Pokemon didn't flee - give another chance
            write_json(f"player_{sender}", pokUser)
            chat.reply(f"@{sender}\n\n{pokinfo['name']}\nLv.{pokinfo['level']}\n\n볼 던지기:{'/'.join(SETTING.get('ballthrow_cmds', ['@볼']))} 도망가기:{'/'.join(SETTING.get('esc_cmds', ['@도망']))}")
            
            if sender in isballwaiting:
                isballwaiting.remove(sender)

def handle_escape(sender, chat):
    """Handle escape command (@도망/ㄷㅁ)"""
    global isballwaiting

    from .explore import ispokfind, battlepokinfo, advOn

    if sender not in ispokfind:
        chat.reply(f'@{sender}\n도망칠 포켓몬이 없어요!')
        return

    idx = ispokfind.index(sender)
    pokinfo = battlepokinfo[idx]

    chat.reply(f"@{sender}\n야생의 {pokinfo['name']}에게서 도망쳤어요!")

    # Clean up
    ispokfind.remove(sender)
    battlepokinfo.pop(idx)
    advOn[sender] = 0
    if sender in isballwaiting:
        isballwaiting.remove(sender)

def create_pokemon(name, level):
    """Create a Pokemon with stats"""
    from .io_helpers import read_json
    
    hp_base = read_json(f"포켓몬/{name}", "hp") or 50
    atk_base = read_json(f"포켓몬/{name}", "atk") or 50
    def_base = read_json(f"포켓몬/{name}", "def") or 50
    spd_base = read_json(f"포켓몬/{name}", "spd") or 50
    skills = read_json(f"포켓몬/{name}", "skills") or []
    
    # Calculate stats
    hp = math.ceil(hp_base * level / 50)
    atk = math.ceil(atk_base * level / 50)
    def_stat = math.ceil(def_base * level / 50)
    spd = math.ceil(spd_base * level / 50)
    
    # Select 4 random skills
    if len(skills) > 4:
        skills = random.sample(skills, 4)
    
    v = 1
    if random.randint(1, 100) <= 10:
        v = random.randint(2, 6)
    
    # Apply V bonus
    hp = math.ceil(hp * (10 + v) / 10)
    atk = math.ceil(atk * (10 + v) / 10)
    def_stat = math.ceil(def_stat * (10 + v) / 10)
    spd = math.ceil(spd * (10 + v) / 10)
    
    return {
        'name': name,
        'level': level,
        'hp': hp,
        'atk': atk,
        'def': def_stat,
        'spd': spd,
        'skills': skills[:4] if len(skills) > 4 else skills,
        'skillslocked': [],
        'formchange': 0,
        'v': v,
        'islocked': 0
    }
