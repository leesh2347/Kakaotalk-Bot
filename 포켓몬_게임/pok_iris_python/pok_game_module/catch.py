# Module 4: Pokemon Catching
import random
import math
import time
import unicodedata
from .config import SETTING, BALL_ARR, BALL_FAIL, RUN_POKS, V_TEXTS, POK_ARR
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

    # Add to waiting list BEFORE any processing to prevent spam
    isballwaiting.append(sender)

    # Find Pokemon info
    idx = ispokfind.index(sender)
    pokinfo = battlepokinfo[idx]
    pokname = pokinfo['name']
    lev = pokinfo['level']
    shiny = pokinfo['shiny']

    # Check if player has balls
    if pokUser.get("balls", 0) <= 0:
        # Remove from waiting list if no balls
        isballwaiting.remove(sender)
        chat.reply(f'@{sender}\n볼이 없어요!\n"{SETTING["ball"]}" 명령어로 볼을 구매하세요.')
        return

    # Decrement ball count
    pokUser["balls"] -= 1
    write_json(f"player_{sender}", pokUser)  # Immediately persist ball decrement

    chat.reply(f'{sender}님이 {pokname}에게 {pokUser.get("Ball", BALL_ARR[0])}을 던졌어요! (남은 볼: {pokUser.get("balls", 0)}개)')

    time.sleep(1)

    # Catch calculation - determine Pokemon group
    ball_idx = BALL_ARR.index(pokUser.get("Ball", BALL_ARR[0]))

    # Determine group for catch rate
    if pokname in POK_ARR['groupunknown']:
        group = 99
        catch_rate = 20  # Unknown group fixed rate
    elif pokname in POK_ARR['group6']:
        group = 6
        catch_rate = pokUser.get("successcatch", {}).get("g6", 1)
    elif pokname in POK_ARR['group5']:
        group = 5
        catch_rate = pokUser.get("successcatch", {}).get("g5", 1)
    elif pokname in POK_ARR['group4']:
        group = 4
        catch_rate = pokUser.get("successcatch", {}).get("g4", 1)
    elif pokname in POK_ARR['group3']:
        group = 3
        catch_rate = pokUser.get("successcatch", {}).get("g3", 1)
    elif pokname in POK_ARR['group2']:
        group = 2
        catch_rate = pokUser.get("successcatch", {}).get("g2", 1)
    else:
        group = 1
        catch_rate = pokUser.get("successcatch", {}).get("g1", 1)

    # Apply event bonuses
    if group == 6:
        catch_rate = catch_rate + SETTING['eventp'].get('g6catch', 0)
    if group == 5:
        catch_rate = catch_rate + SETTING['eventp'].get('g5catch', 0)
    elif group == 4:
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

    # Catch attempt
    if random.randint(1, 100) <= catch_rate:
        # Success - catch Pokemon
        caught_pok = create_pokemon(pokname, lev, shiny, group)
        pokInv = read_json(f"player_{sender}_inv")

        if pokInv is None:
            pokInv = {"box": [], "deck": [], "item": []}
        if "box" not in pokInv:
            pokInv["box"] = []
        pokInv["box"].append(caught_pok)

        # Check for mega/gmax notification
        from .config import MEGA_NAMES, GMAX_NAMES, FORM_CHANGE_NAMES
        noti_msg = ""
        if caught_pok.get("name") in MEGA_NAMES:
            noti_msg += f"\n💎 {caught_pok.get('name')}은(는) 메가진화 가능합니다 (@메가진화 [덱번호])"
        if caught_pok.get("name") in GMAX_NAMES:
            noti_msg += f"\n🌟 {caught_pok.get('name')}은(는) 거다이맥스 가능합니다 (@거다이맥스 [덱번호])"
        if caught_pok.get("name") in FORM_CHANGE_NAMES:
            noti_msg += f"\n🔄 {caught_pok.get('name')}은(는) 폼체인지 가능합니다 (@폼체인지 [덱번호])"
        if noti_msg:
            chat.reply(f"@{sender}\n{noti_msg}")

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

        # Auto rank up check
        current_rank = pokUser.get("rank", SETTING["rank"]["name"][0])
        try:
            current_rank_idx = SETTING["rank"]["name"].index(current_rank)
        except ValueError:
            current_rank_idx = 0

        total_succ = pokUser["count"]["succ"]
        rank_upifs = SETTING["rank"]["upif"]

        # Check if player qualifies for a higher rank
        for i in range(len(rank_upifs) - 1, -1, -1):
            if rank_upifs[i] > 0 and total_succ >= rank_upifs[i] and i > current_rank_idx:
                new_rank = SETTING["rank"]["name"][i]
                pokUser["rank"] = new_rank
                chat.reply(f"@{sender}\n축하합니다! {new_rank}(으)로 등급이 상승했습니다!")
                break

        # Update HP and other stats based on new rank
        try:
            new_rank_idx = SETTING["rank"]["name"].index(pokUser.get("rank", SETTING["rank"]["name"][0]))
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

        chat.reply(f"@{sender}\n축하합니다!\n{pokname}{'을' if len(unicodedata.normalize('NFD', pokname[-1])) == 3 else '를'} 잡았습니다!")

        # Clean up - ALWAYS execute to prevent stuck exploration
        try:
            if sender in ispokfind:
                idx = ispokfind.index(sender)
                ispokfind.remove(sender)
                if idx < len(battlepokinfo):
                    battlepokinfo.pop(idx)
            advOn[sender] = 0
            if sender in isballwaiting:
                isballwaiting.remove(sender)
        except Exception as e:
            print(f"Cleanup error: {e}")
    else:
        # Fail - Pokemon not caught
        chat.reply(f"@{sender}\n{random.choice(BALL_FAIL)}")

        # Calculate flee probability (reuse group from above)
        from .explore import ispokfind, battlepokinfo, advOn

        idx = ispokfind.index(sender)
        pokinfo = battlepokinfo[idx]
        pokname = pokinfo['name']

        # Determine flee probability based on group
        if pokname in RUN_POKS or pokname in POK_ARR['groupunknown']:
            runprob = 90
        else:
            # mapping: group 5→0, 4→1, 3→2, 2→3, 1→4
            runprob = SETTING['run'][6 - group]

        # Check if Pokemon flees
        if runprob > (random.randint(1, 100)):
            # Pokemon fled - end exploration
            # Re-read to preserve ball count
            current_pokUser = read_json(f"player_{sender}")
            if current_pokUser:
                pokUser["balls"] = current_pokUser.get("balls", pokUser.get("balls", 0))
                pokUser["gold"] = current_pokUser.get("gold", pokUser.get("gold", 0))
            
            pokUser["count"]["fail"] = pokUser.get("count", {}).get("fail", 0) + 1
            pokUser["hp"] = pokUser.get("hp", 1) - 1
            write_json(f"player_{sender}", pokUser)

            # Clean up
            try:
                if sender in ispokfind:
                    ispokfind.remove(sender)
                    if idx < len(battlepokinfo):
                        battlepokinfo.pop(idx)
                advOn[sender] = 0
                if sender in isballwaiting:
                    isballwaiting.remove(sender)
            except Exception as e:
                print(f"Cleanup error: {e}")

            lt = len(pokname) - 1
            particle = '은' if len(unicodedata.normalize('NFD', pokname[-1])) == 3 else '는'
            chat.reply(f"@{sender}\n야생의 {pokname}{particle} 도망쳐 버렸어요!\n포획 실패!")

            if sender in isballwaiting:
                isballwaiting.remove(sender)
        elif pokUser.get("balls", 0) < 1:
            # No balls left - end exploration
            # Re-read to preserve ball count
            current_pokUser = read_json(f"player_{sender}")
            if current_pokUser:
                pokUser["balls"] = current_pokUser.get("balls", pokUser.get("balls", 0))
                pokUser["gold"] = current_pokUser.get("gold", pokUser.get("gold", 0))
            
            pokUser["count"]["fail"] = pokUser.get("count", {}).get("fail", 0) + 1
            pokUser["hp"] = pokUser.get("hp", 1) - 1
            write_json(f"player_{sender}", pokUser)

            # Clean up
            try:
                if sender in ispokfind:
                    ispokfind.remove(sender)
                    if idx < len(battlepokinfo):
                        battlepokinfo.pop(idx)
                advOn[sender] = 0
                if sender in isballwaiting:
                    isballwaiting.remove(sender)
            except Exception as e:
                print(f"Cleanup error: {e}")

            chat.reply(f"@{sender}\n더 이상 던질 볼이 없어 도망쳐 나왔어요. {SETTING.get('ball', '@볼구매')} 를 통해 볼을 구매해 주세요!\n포획 실패!")

        else:
            # Pokemon didn't flee - give another chance
            # Re-read to preserve ball count
            current_pokUser = read_json(f"player_{sender}")
            if current_pokUser:
                pokUser["balls"] = current_pokUser.get("balls", pokUser.get("balls", 0))
                pokUser["gold"] = current_pokUser.get("gold", pokUser.get("gold", 0))
            
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

    # Clean up - ALWAYS execute
    try:
        if sender in ispokfind:
            ispokfind.remove(sender)
            if idx < len(battlepokinfo):
                battlepokinfo.pop(idx)
        advOn[sender] = 0
        if sender in isballwaiting:
            isballwaiting.remove(sender)
    except Exception as e:
        print(f"Cleanup error: {e}")

def create_pokemon(name, level, shiny, group=1):
    """Create a Pokemon with stats"""
    from .io_helpers import read_json

    hp_base = read_json(f"포켓몬/{name}", "hp") or 50
    atk_base = read_json(f"포켓몬/{name}", "atk") or 50
    def_base = read_json(f"포켓몬/{name}", "def") or 50
    spd_base = read_json(f"포켓몬/{name}", "spd") or 50
    satk_base = read_json(f"포켓몬/{name}", "satk") or 1
    sdef_base = read_json(f"포켓몬/{name}", "sdef") or 1
    skills = read_json(f"포켓몬/{name}", "skills") or []

    hp = math.ceil(hp_base * level / 50)
    atk = math.ceil(atk_base * level / 50)
    def_stat = math.ceil(def_base * level / 50)
    spd = math.ceil(spd_base * level / 50)
    satk = math.ceil(satk_base * level / 50)
    sdef = math.ceil(sdef_base * level / 50)

    if len(skills) > 4:
        skills = random.sample(skills, 4)

    v = 0

    hp = math.ceil(hp * (10 + v) / 10)
    atk = math.ceil(atk * (10 + v) / 10)
    def_stat = math.ceil(def_stat * (10 + v) / 10)
    spd = math.ceil(spd * (10 + v) / 10)
    satk = math.ceil(satk * (10 + v) / 10)
    sdef = math.ceil(sdef * (10 + v) / 10)

    islocked = 1 if group >= 4 else 0

    return {
        'name': name,
        'level': level,
        'hp': hp,
        'atk': atk,
        'def': def_stat,
        'spd': spd,
        'satk': satk,
        'sdef': sdef,
        'skills': skills[:4] if len(skills) > 4 else skills,
        'skillslocked': [],
        'formchange': 0,
        'v': v,
        'shiny': shiny,
        'islocked': islocked
    }
