# Module 9: PVE Battle (Gym/Battle Tower/Ranking)
import random
import math
import time
from .config import SETTING, TRAINER_RAN_POKS, TYPE_TEXTS, WEATHER_TEXTS, BALL_ARR
from .io_helpers import read_json, write_json, typejudge, weatherjudge, send_image, pokimglink
from .champion import newChampion
from .explore import advOn

# Per-player battle state dict (similar to advOn[sender])
# Enables multiple independent battles simultaneously
battle_states = {}
battletowerplayers = {}
battletowerlev = {}

def _get_state(sender):
    if sender not in battle_states:
        battle_states[sender] = {
            'isbattle': 0,
            'player1': '',
            'player2': '',
            'player1pok': {},
            'player2pok': {},
            'player1maxhp': 0,
            'player2maxhp': 0,
            'player1pp': {},
            'player2pp': {},
            'player1retire': [],
            'player2retire': [],
            'isplayer1bind': 0,
            'isplayer2bind': 0,
            'battleres': '',
            'weather': 0,
            'isnpcbattle': 0,
            'nextpokchoose': 0,
            'trainerInv': {},
            'trainerpoknum': 0,
            'gymnum': 0,
            'isrankingbattle': 0
        }
    return battle_states[sender]

def _clear_state(sender):
    if sender in battle_states:
        del battle_states[sender]

def handle_gym(sender, chat, args=None):
    state = _get_state(sender)

    from .maintenance import check_updating
    if not check_updating(sender, chat):
        return

    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    if pokUser.get("restOn", {}).get("on", False):
        chat.reply(f'@{sender}\n휴식 중에는 체육관에 도전할 수 없어요!')
        return

    if state['isbattle'] != 0:
        chat.reply(f'@{sender}\n이미 배틀 중이에요!')
        return

    if advOn.get(sender, 0) != 0:
        chat.reply(f'@{sender}\n이미 탐험 또는 배틀 중이에요!')
        return

    if pokUser.get("hp", 0) < 5:
        chat.reply(f'@{sender}\n체력이 5 이상이어야 체육관에 도전할 수 있어요!')
        return

    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("deck"):
        chat.reply(f'@{sender}\n덱에 포켓몬이 없어요!')
        return

    if "badge" not in pokUser:
        pokUser["badge"] = 0

    gymnum = pokUser["badge"] + 1

    if gymnum > 18:
        chat.reply(f'@{sender}\n모든 체육관을 클리어했어요!')
        return

    advOn[sender] = 3

    state['player1'] = "체육관 관장"
    state['player2'] = sender
    state['isbattle'] = 2
    state['isnpcbattle'] = 1
    state['gymnum'] = gymnum

    pokUser["hp"] -= 5
    write_json(f"player_{sender}", pokUser)

    gym_data = read_json(f"trainer/gym_{gymnum}")
    if gym_data is None:
        chat.reply(f'@{sender}\n체육관 데이터를 불러올 수 없어요!')
        state['isbattle'] = 0
        advOn[sender] = 0
        return

    state['trainerInv'] = gym_data.get("deck", [])
    state['trainerpoknum'] = 0
    state['player1retire'] = []
    state['player2retire'] = []
    state['isplayer1bind'] = 0
    state['isplayer2bind'] = 0
    state['battleres'] = ""

    state['player1pok'] = state['trainerInv'][0].copy()
    state['player2pok'] = pokInv["deck"][0].copy()

    level = state['player1pok']["level"]
    if state['player1pok'].get("formchange", 0) > 0:
        state['player1pok']["hp"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}_{state['player1pok']['formchange']}", "hp") or 50) * level / 50)
        state['player1pok']["atk"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}_{state['player1pok']['formchange']}", "atk") or 50) * level / 50)
        state['player1pok']["def"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}_{state['player1pok']['formchange']}", "def") or 50) * level / 50)
        state['player1pok']["spd"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}_{state['player1pok']['formchange']}", "spd") or 50) * level / 50)
        state['player1pok']["satk"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}_{state['player1pok']['formchange']}", "satk") or 1) * level / 50)
        state['player1pok']["sdef"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}_{state['player1pok']['formchange']}", "sdef") or 1) * level / 50)
    else:
        state['player1pok']["hp"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}", "hp") or 50) * level / 50)
        state['player1pok']["atk"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}", "atk") or 50) * level / 50)
        state['player1pok']["def"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}", "def") or 50) * level / 50)
        state['player1pok']["spd"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}", "spd") or 50) * level / 50)
        state['player1pok']["satk"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}", "satk") or 1) * level / 50)
        state['player1pok']["sdef"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}", "sdef") or 1) * level / 50)

    if state['player2pok']["name"] == "메타몽":
        state['player2pok']["name"] = state['player1pok']["name"]
        state['player2pok']["hp"] = state['player1pok']["hp"]
        state['player2pok']["atk"] = state['player1pok']["atk"]
        state['player2pok']["def"] = state['player1pok']["def"]
        state['player2pok']["spd"] = state['player1pok']["spd"]
        state['player2pok']["satk"] = state['player1pok']["satk"]
        state['player2pok']["sdef"] = state['player1pok']["sdef"]
        state['player2pok']["skills"] = state['player1pok']["skills"][:]

    if 8 in pokUser.get("activecollection", []):
        state['player2pok']["spd"] += 8
    if 11 in pokUser.get("activecollection", []):
        state['player2pok']["def"] += 11

    state['player1maxhp'] = state['player1pok']["hp"]
    state['player2maxhp'] = state['player2pok']["hp"]

    state['player1pp'] = {}
    for skill in state['player1pok'].get("skills", []):
        skill_data = read_json(f"기술/{skill}")
        state['player1pp'][skill] = (skill_data.get("pp") if skill_data else None) or 10

    state['player2pp'] = {}
    for skill in state['player2pok'].get("skills", []):
        skill_data = read_json(f"기술/{skill}")
        state['player2pp'][skill] = (skill_data.get("pp") if skill_data else None) or 10

    if random.randint(1, 3) == 1:
        state['weather'] = random.randint(1, 4)
    else:
        state['weather'] = 0

    chat.reply(f"⚔️체육관 {gymnum}번째 도전!⚔️\n\n[{state['player1']}] Lv.{state['player1pok']['level']} {state['player1pok']['name']}\nvs\n[{state['player2']}] Lv.{state['player2pok']['level']} {state['player2pok']['name']}")

    try:
        img1 = pokimglink(state['player1pok']["name"], state['player1pok'].get("formchange", 0), state['player1pok'].get("shiny", 0))
        img2 = pokimglink(state['player2pok']["name"], state['player2pok'].get("formchange", 0), state['player2pok'].get("shiny", 0))
        send_image(None, chat, 67300, {
            'player1name': state['player1'],
            'player2name': state['player2'],
            'player1img': img1,
            'player2img': img2,
            'player1shiny': state['player1pok'].get("shiny", 0),
            'player2shiny': state['player2pok'].get("shiny", 0),
            'player1': f"Lv.{state['player1pok']['level']} {state['player1pok']['name']}",
            'player2': f"Lv.{state['player2pok']['level']} {state['player2pok']['name']}",
            'player1desc': f"[{state['player1pok']['hp']}/{state['player1maxhp']}]",
            'player2desc': f"[{state['player2pok']['hp']}/{state['player2maxhp']}]"
        })
    except Exception as e:
         print(e)

    if state['weather'] > 0:
        chat.reply(WEATHER_TEXTS[state['weather']])

    time.sleep(5)

    battle_loop(chat, sender)

def handle_battletower(sender, chat, args=None):
    state = _get_state(sender)

    from .maintenance import check_updating
    if not check_updating(sender, chat):
        return

    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    if pokUser.get("restOn", {}).get("on", False):
        chat.reply(f'@{sender}\n휴식 중에는 배틀타워에 도전할 수 없어요!')
        return

    if state['isbattle'] != 0:
        chat.reply(f'@{sender}\n이미 배틀 중이에요!')
        return

    if advOn.get(sender, 0) != 0:
        chat.reply(f'@{sender}\n이미 탐험 또는 배틀 중이에요!')
        return

    if pokUser.get("hp", 0) < 5:
        chat.reply(f'@{sender}\n체력이 5 이상이어야 배틀타워에 도전할 수 있어요!')
        return

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

    advOn[sender] = 3

    state['player1'] = "포켓몬 트레이너"
    state['player2'] = sender
    state['isbattle'] = 4
    state['isnpcbattle'] = 1

    pokUser["hp"] -= 5
    write_json(f"player_{sender}", pokUser)

    state['trainerInv'] = []
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
            'shiny':0,
            'islocked': 0
        }

        state['trainerInv'].append(aipok)

    state['trainerpoknum'] = 0
    state['player1retire'] = []
    state['player2retire'] = []
    state['isplayer1bind'] = 0
    state['isplayer2bind'] = 0
    state['battleres'] = ""

    state['player1pok'] = state['trainerInv'][0].copy()
    state['player2pok'] = pokInv["deck"][0].copy()

    state['player1maxhp'] = state['player1pok']["hp"]
    state['player2maxhp'] = state['player2pok']["hp"]

    state['player1pp'] = {}
    for skill in state['player1pok'].get("skills", []):
        skill_data = read_json(f"기술/{skill}")
        state['player1pp'][skill] = (skill_data.get("pp") if skill_data else None) or 10

    state['player2pp'] = {}
    for skill in state['player2pok'].get("skills", []):
        skill_data = read_json(f"기술/{skill}")
        state['player2pp'][skill] = (skill_data.get("pp") if skill_data else None) or 10

    if random.randint(1, 3) == 1:
        state['weather'] = random.randint(1, 4)
    else:
        state['weather'] = 0

    chat.reply(f"⚔️배틀타워 도전!⚔️\n\n[{state['player1']}] Lv.{state['player1pok']['level']} {state['player1pok']['name']}\nvs\n[{state['player2']}] Lv.{state['player2pok']['level']} {state['player2pok']['name']}")

    try:
        img1 = pokimglink(state['player1pok']["name"], state['player1pok'].get("formchange", 0), state['player1pok'].get("shiny", 0))
        img2 = pokimglink(state['player2pok']["name"], state['player2pok'].get("formchange", 0), state['player2pok'].get("shiny", 0))
        send_image(None, chat, 67300, {
            'player1name': state['player1'],
            'player2name': state['player2'],
            'player1img': img1,
            'player2img': img2,
            'player1shiny': state['player1pok'].get("shiny", 0),
            'player2shiny': state['player2pok'].get("shiny", 0),
            'player1': f"Lv.{state['player1pok']['level']} {state['player1pok']['name']}",
            'player2': f"Lv.{state['player2pok']['level']} {state['player2pok']['name']}",
            'player1desc': f"[{state['player1pok']['hp']}/{state['player1maxhp']}]",
            'player2desc': f"[{state['player2pok']['hp']}/{state['player2maxhp']}]"
        })
    except Exception as e:
         print(e)

    if state['weather'] > 0:
        chat.reply(WEATHER_TEXTS[state['weather']])

    time.sleep(5)

    battle_loop(chat, sender)

def handle_ranking_battle(sender, chat):
    state = _get_state(sender)

    from .maintenance import check_updating
    if not check_updating(sender, chat):
        return

    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    if pokUser.get("restOn", {}).get("on", False):
        chat.reply(f'@{sender}\n휴식 중에는 랭킹 배틀을 할 수 없어요!')
        return

    if state['isbattle'] != 0:
        chat.reply(f'@{sender}\n이미 배틀 중이에요!')
        return

    if advOn.get(sender, 0) != 0:
        chat.reply(f'@{sender}\n이미 탐험 또는 배틀 중이에요!')
        return

    if pokUser.get("hp", 0) < 5:
        chat.reply(f'@{sender}\n체력이 5 이상이어야 랭킹 배틀을 할 수 있어요!')
        return

    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None or not pokInv.get("deck"):
        chat.reply(f'@{sender}\n덱에 포켓몬이 없어요!')
        return

    raw = read_json("ranking")
    file_data = {}
    ranking_arr = []
    if isinstance(raw, list):
        ranking_arr = raw
    elif isinstance(raw, dict):
        file_data = raw
        ranking_arr = raw.get("ranking", [])
    else:
        file_data = {}

    sender_idx = None
    for i, entry in enumerate(ranking_arr):
        if entry.get("name") == sender:
            sender_idx = i
            break

    if sender_idx is None:
        rank = len(ranking_arr) + 1
        deck_copy = []
        for pok in pokInv["deck"]:
            deck_copy.append(pok.copy())
        ranking_arr.append({"name": sender, "deck": deck_copy})
        file_data["ranking"] = ranking_arr
        write_json("ranking", file_data)
        chat.reply(f'@{sender}\n랭킹 입성! 현재 {rank}위!')
        return

    if sender_idx == 0:
        chat.reply(f'@{sender}\n현재 1위입니다.')
        return

    opponent = ranking_arr[sender_idx - 1]
    opponent_name = opponent["name"]
    opponent_deck = opponent["deck"]

    advOn[sender] = 3

    state['player1'] = opponent_name
    state['player2'] = sender
    state['isbattle'] = 5
    state['isnpcbattle'] = 0
    state['isrankingbattle'] = 1

    pokUser["hp"] -= 5
    write_json(f"player_{sender}", pokUser)

    state['trainerInv'] = []
    for pok in opponent_deck:
        state['trainerInv'].append(pok.copy())
    state['trainerpoknum'] = 0
    state['player1retire'] = []
    state['player2retire'] = []
    state['isplayer1bind'] = 0
    state['isplayer2bind'] = 0
    state['battleres'] = ""

    state['player1pok'] = state['trainerInv'][0].copy()
    state['player2pok'] = pokInv["deck"][0].copy()

    state['player1maxhp'] = state['player1pok'].get("maxhp", state['player1pok']["hp"])
    state['player2maxhp'] = state['player2pok'].get("maxhp", state['player2pok']["hp"])

    state['player1pp'] = {}
    for skill in state['player1pok'].get("skills", []) + state['player1pok'].get("skillslocked", []):
        skill_data = read_json(f"기술/{skill}")
        state['player1pp'][skill] = (skill_data.get("pp") if skill_data else None) or 10

    state['player2pp'] = {}
    for skill in state['player2pok'].get("skills", []) + state['player2pok'].get("skillslocked", []):
        skill_data = read_json(f"기술/{skill}")
        state['player2pp'][skill] = (skill_data.get("pp") if skill_data else None) or 10

    if random.randint(1, 3) == 1:
        state['weather'] = random.randint(1, 4)
    else:
        state['weather'] = 0

    chat.reply(f"⚔️랭킹 배틀!⚔️\n\n[{state['player1']}] Lv.{state['player1pok']['level']} {state['player1pok']['name']}\nvs\n[{state['player2']}] Lv.{state['player2pok']['level']} {state['player2pok']['name']}")

    try:
        img1 = pokimglink(state['player1pok']["name"], state['player1pok'].get("formchange", 0), state['player1pok'].get("shiny", 0))
        img2 = pokimglink(state['player2pok']["name"], state['player2pok'].get("formchange", 0), state['player2pok'].get("shiny", 0))
        send_image(None, chat, 67300, {
            'player1name': state['player1'],
            'player2name': state['player2'],
            'player1img': img1,
            'player2img': img2,
            'player1shiny': state['player1pok'].get("shiny", 0),
            'player2shiny': state['player2pok'].get("shiny", 0),
            'player1': f"Lv.{state['player1pok']['level']} {state['player1pok']['name']}",
            'player2': f"Lv.{state['player2pok']['level']} {state['player2pok']['name']}",
            'player1desc': f"[{state['player1pok']['hp']}/{state['player1maxhp']}]",
            'player2desc': f"[{state['player2pok']['hp']}/{state['player2maxhp']}]"
        })
    except Exception as e:
        print(e)

    if state['weather'] > 0:
        chat.reply(WEATHER_TEXTS[state['weather']])

    time.sleep(5)

    battle_loop(chat, sender)

def battle_loop(chat, sender):
    state = _get_state(sender)

    max_turns = 50
    turn = 0

    pokInv = read_json(f"player_{sender}_inv")

    state['battleres'] = ""

    for pok in pokInv.get("deck", []):
        pok["hp"] = pok.get("maxhp", pok["hp"])

    while turn < max_turns:
        turn += 1

        if state['player1pok']["hp"] <= 0:
            if state['battleres']:
                space = "\u200b"*500
                chat.reply(f"배틀 결과\n{space}\n{state['battleres']}")
                state['battleres'] = ""

            state['player1retire'].append(state['trainerpoknum'])
            state['trainerpoknum'] += 1

            if state['trainerpoknum'] >= len(state['trainerInv']):
                end_pve_battle(chat, sender, winner=sender)
                return

            state['player1pok'] = state['trainerInv'][state['trainerpoknum']].copy()

            if state['isrankingbattle']:
                state['player1maxhp'] = state['player1pok'].get("maxhp", state['player1pok']["hp"])
                state['player1pok']["hp"] = state['player1maxhp']
            else:
                level = state['player1pok']["level"]

                if state['player1pok'].get("formchange", 0) > 0:
                    state['player1pok']["hp"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}_{state['player1pok']['formchange']}", "hp") or 50) * level / 50)
                    state['player1pok']["atk"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}_{state['player1pok']['formchange']}", "atk") or 50) * level / 50)
                    state['player1pok']["def"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}_{state['player1pok']['formchange']}", "def") or 50) * level / 50)
                    state['player1pok']["spd"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}_{state['player1pok']['formchange']}", "spd") or 50) * level / 50)
                    state['player1pok']["satk"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}_{state['player1pok']['formchange']}", "satk") or 50) * level / 50)
                    state['player1pok']["sdef"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}_{state['player1pok']['formchange']}", "sdef") or 50) * level / 50)
                else:
                    state['player1pok']["hp"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}", "hp") or 50) * level / 50)
                    state['player1pok']["atk"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}", "atk") or 50) * level / 50)
                    state['player1pok']["def"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}", "def") or 50) * level / 50)
                    state['player1pok']["spd"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}", "spd") or 50) * level / 50)
                    state['player1pok']["satk"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}", "satk") or 50) * level / 50)
                    state['player1pok']["sdef"] = math.ceil((read_json(f"포켓몬/{state['player1pok']['name']}", "sdef") or 50) * level / 50)

                state['trainerInv'][state['trainerpoknum']]["hp"] = state['player1pok']["hp"]
                state['player1maxhp'] = state['player1pok']["hp"]

            state['player1pp'] = {}
            skill_list = state['player1pok'].get("skills", [])
            if state['isrankingbattle']:
                skill_list = skill_list + state['player1pok'].get("skillslocked", [])
            for skill in skill_list:
                skill_data = read_json(f"기술/{skill}")
                state['player1pp'][skill] = (skill_data.get("pp") if skill_data else None) or 10

            leftpoks = (state['trainerpoknum'])*"●"+(len(state['trainerInv'])-state['trainerpoknum'])*"○"

            chat.reply(f"[{state['player1']}] {state['player1pok']['name']} 등장!\n{leftpoks}")

            try:
                img1 = pokimglink(state['player1pok']["name"], state['player1pok'].get("formchange", 0), state['player1pok'].get("shiny", 0))
                img2 = pokimglink(state['player2pok']["name"], state['player2pok'].get("formchange", 0), state['player2pok'].get("shiny", 0))
                send_image(None, chat, 67300, {
                    'player1name': state['player1'],
                    'player2name': state['player2'],
                    'player1img': img1,
                    'player2img': img2,
                    'player1shiny': state['player1pok'].get("shiny", 0),
                    'player2shiny': state['player2pok'].get("shiny", 0),
                    'player1': f"Lv.{state['player1pok']['level']} {state['player1pok']['name']}",
                    'player2': f"Lv.{state['player2pok']['level']} {state['player2pok']['name']}",
                    'player1desc': f"[{state['player1pok']['hp']}/{state['player1maxhp']}]",
                    'player2desc': f"[{state['player2pok']['hp']}/{state['player2maxhp']}]"
                })
            except Exception as e:
                print(e)

            time.sleep(5)

        if state['player2pok']["hp"] <= 0:
            if state['battleres']:
                space = "\u200b"*500
                chat.reply(f"배틀 결과\n{space}\n{state['battleres']}")
                state['battleres'] = ""
            state['player2retire'].append(0)

            next_pok_idx = len(state['player2retire'])

            if next_pok_idx >= len(pokInv.get("deck", [])):
                if state['battleres']:
                    space = "\u200b"*500
                    chat.reply(f"배틀 결과\n{space}\n{state['battleres']}")
                    state['battleres'] = ""
                end_pve_battle(chat, sender, winner=state['player1'])
                return

            state['player2pok'] = pokInv["deck"][next_pok_idx].copy()
            state['player2maxhp'] = state['player2pok'].get("maxhp", state['player2pok']["hp"])
            state['player2pok']["hp"] = state['player2maxhp']
            state['player2pp'] = {}
            for skill in state['player2pok'].get("skills", []):
                skill_data = read_json(f"기술/{skill}")
                state['player2pp'][skill] = (skill_data.get("pp") if skill_data else None) or 10

            leftpoks = (next_pok_idx+1)*"●"+(len(pokInv.get("deck", []))-next_pok_idx-1)*"○"

            chat.reply(f"[{state['player2']}] {state['player2pok']['name']} 등장!\n{leftpoks}")

            try:
                img1 = pokimglink(state['player1pok']["name"], state['player1pok'].get("formchange", 0), state['player1pok'].get("shiny", 0))
                img2 = pokimglink(state['player2pok']["name"], state['player2pok'].get("formchange", 0), state['player2pok'].get("shiny", 0))
                send_image(None, chat, 67300, {
                    'player1name': state['player1'],
                    'player2name': state['player2'],
                    'player1img': img1,
                    'player2img': img2,
                    'player1shiny': state['player1pok'].get("shiny", 0),
                    'player2shiny': state['player2pok'].get("shiny", 0),
                    'player1': f"Lv.{state['player1pok']['level']} {state['player1pok']['name']}",
                    'player2': f"Lv.{state['player2pok']['level']} {state['player2pok']['name']}",
                    'player1desc': f"[{state['player1pok']['hp']}/{state['player1maxhp']}]",
                    'player2desc': f"[{state['player2pok']['hp']}/{state['player2maxhp']}]"
                })
            except Exception as e:
                print(e)

            time.sleep(5)

        player1skills = [s for s in state['player1pok'].get("skills", []) if s not in state['player1pok'].get("skillslocked", [])]
        player2skills = [s for s in state['player2pok'].get("skills", []) if s not in state['player2pok'].get("skillslocked", [])]

        if not player1skills:
            player1skills = ["태클"]
        if not player2skills:
            player2skills = ["태클"]

        player1skill = random.choice(player1skills)
        player2skill = random.choice(player2skills)

        player1spd = state['player1pok']["spd"]
        player2spd = state['player2pok']["spd"]

        skill1_data = read_json(f"기술/{player1skill}")
        skill2_data = read_json(f"기술/{player2skill}")

        if skill1_data:
            player1spd += (skill1_data.get("priority") or 0) * 2
        if skill2_data:
            player2spd += (skill2_data.get("priority") or 0) * 2

        if player1spd > player2spd:
            execute_pve_attack(state, state['player1'], state['player2'], state['player1pok'], state['player2pok'], player1skill, state['player1pp'])
            if state['player2pok']["hp"] > 0:
                execute_pve_attack(state, state['player2'], state['player1'], state['player2pok'], state['player1pok'], player2skill, state['player2pp'])
        else:
            execute_pve_attack(state, state['player2'], state['player1'], state['player2pok'], state['player1pok'], player2skill, state['player2pp'])
            if state['player1pok']["hp"] > 0:
                execute_pve_attack(state, state['player1'], state['player2'], state['player1pok'], state['player2pok'], player1skill, state['player1pp'])

        if state['weather'] > 2:
            if state['weather'] == 3:
                pok1_file_name = f"{state['player1pok']['name']}_{state['player1pok']['formchange']}" if state['player1pok'].get('formchange', 0) != 0 else state['player1pok']['name']
                pok2_file_name = f"{state['player2pok']['name']}_{state['player2pok']['formchange']}" if state['player2pok'].get('formchange', 0) != 0 else state['player2pok']['name']
                type1_1 = read_json(f"포켓몬/{pok1_file_name}", "type1") or 0
                type2_1 = read_json(f"포켓몬/{pok1_file_name}", "type2") or 0
                if type1_1 != 6 and type2_1 != 6 and type1_1 != 7 and type2_1 != 7:
                    state['player1pok']["hp"] = max(0, math.ceil(state['player1pok']["hp"] * 7 / 8))
                    state['battleres'] += f"[{state['player1']}] 모래바람이 {state['player1pok']['name']}(를)을 덮쳤어요!\n"

                type1_2 = read_json(f"포켓몬/{pok2_file_name}", "type1") or 0
                type2_2 = read_json(f"포켓몬/{pok2_file_name}", "type2") or 0
                if type1_2 != 6 and type2_2 != 6 and type1_2 != 7 and type2_2 != 7:
                    state['player2pok']["hp"] = max(0, math.ceil(state['player2pok']["hp"] * 7 / 8))
                    state['battleres'] += f"[{state['player2']}] 모래바람이 {state['player2pok']['name']}(를)을 덮쳤어요!\n"

            elif state['weather'] == 4:
                pok2_file_name = f"{state['player2pok']['name']}_{state['player2pok']['formchange']}" if state['player2pok'].get('formchange', 0) != 0 else state['player2pok']['name']
                type1_2 = read_json(f"포켓몬/{pok2_file_name}", "type1") or 0
                type2_2 = read_json(f"포켓몬/{pok2_file_name}", "type2") or 0
                if type1_2 != 11 and type2_2 != 11:
                    state['player2pok']["hp"] = max(0, math.ceil(state['player2pok']["hp"] * 7 / 8))
                    state['battleres'] += f"[{state['player2']}] 싸라기눈이 {state['player2pok']['name']}(를)을 덮쳤어요!\n"

        if state['player2pok']["hp"] <= 0 and len(state['player2retire']) >= len(pokInv.get("deck", [])):
            if state['battleres']:
                space = "\u200b"*500
                chat.reply(f"배틀 결과\n{space}\n{state['battleres']}")
                state['battleres'] = ""
            end_pve_battle(chat, sender, winner=state['player1'])
            return

        if state['player1pok']["hp"] <= 0 and state['trainerpoknum'] >= len(state['trainerInv']) - 1:
            if state['battleres']:
                space = "\u200b"*500
                chat.reply(f"배틀 결과\n{space}\n{state['battleres']}")
                state['battleres'] = ""
            end_pve_battle(chat, sender, winner=sender)
            return

    if state['battleres']:
        chat.reply(state['battleres'])
    chat.reply("배틀이 너무 길어져서 무승부로 처리됩니다.")
    state['isbattle'] = 0
    state['isrankingbattle'] = 0
    advOn[sender] = 0
    _clear_state(sender)

def execute_pve_attack(state, attacker_name, defender_name, attacker, defender, skill, pp_dict):
    if attacker_name == state['player1'] and state['isplayer1bind'] == 1:
        state['isplayer1bind'] = 0
        state['battleres'] += f"[{attacker_name}] {attacker['name']}는 공격의 반동으로 움직일 수 없었어요!\n\n"
        return

    if attacker_name == state['player2'] and state['isplayer2bind'] == 1:
        state['isplayer2bind'] = 0
        state['battleres'] += f"[{attacker_name}] {attacker['name']}는 공격의 반동으로 움직일 수 없었어요!\n\n"
        return

    skill_data = read_json(f"기술/{skill}")
    if not skill_data:
        state['battleres'] += f"[{attacker_name}] {attacker['name']}의 {skill}!\n기술 데이터 없음!\n\n"
        return

    if skill not in pp_dict or pp_dict[skill] <= 0:
        state['battleres'] += f"[{attacker_name}] {attacker['name']}는 PP가 부족해요!\n\n"
        return

    pp_dict[skill] -= 1

    accr = skill_data.get("accr") or 100
    if random.randint(1, 100) > accr:
        state['battleres'] += f"[{attacker_name}] {attacker['name']}의 {skill}!\n아쉽게 빗나갔어요!\n\n"
        return

    addi = skill_data.get("addi") or 0
    atktype = skill_data.get("atktype") or 1

    if addi == 6:
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

    skill_type = skill_data.get("type") or 1
    attacker_pok_file_name = f"{attacker['name']}_{attacker['formchange']}" if attacker.get('formchange', 0) != 0 else attacker['name']
    attacker_type1 = read_json(f"포켓몬/{attacker_pok_file_name}", "type1") or 0
    attacker_type2 = read_json(f"포켓몬/{attacker_pok_file_name}", "type2") or 0

    if addi == 5:
        skill_type = attacker_type1

    if skill_type == attacker_type1 or (attacker_type2 != 0 and skill_type == attacker_type2):
        atk = atk * 1.5

    atk = weatherjudge(atk, skill_type, state['weather'])

    defender_pok_file_name = f"{defender['name']}_{defender['formchange']}" if defender.get('formchange', 0) != 0 else defender['name']
    defender_type1 = read_json(f"포켓몬/{defender_pok_file_name}", "type1") or 0
    defender_type2 = read_json(f"포켓몬/{defender_pok_file_name}", "type2") or 0

    judge = typejudge(skill_type, defender_type1, defender_type2)

    if judge == 0 and addi == 7:
        judge = 1

    atk = atk * judge

    if addi == 4:
        atk = atk * (attacker.get("maxhp", attacker["hp"]) - attacker["hp"]) / 2

    final_damage = math.ceil(atk)
    new_hp = max(0, defender["hp"] - final_damage)
    defender["hp"] = new_hp

    state['battleres'] += f"[{attacker_name}] {attacker['name']}의 {skill}!\n"

    if judge > 1:
        state['battleres'] += "효과가 굉장했어요!\n"
    elif judge == 0:
        state['battleres'] += "효과가 없는 듯해요...\n"
    elif judge < 1:
        state['battleres'] += "효과가 별로인 듯해요\n"

    if addi == 3 and judge != 0:
        attacker["hp"] = max(1, attacker["hp"] - math.ceil(atk / 4))
        state['battleres'] += f"[{attacker_name}] {attacker['name']}는 공격의 반동으로 데미지를 입었어요!\n"
    elif addi == 2 and judge != 0:
        attacker["hp"] = max(1, attacker["hp"] + math.ceil(atk / 4))
        state['battleres'] += f"[{attacker_name}] {attacker['name']}는 공격을 통해 체력을 흡수했어요!\n"
    elif addi == 1 and skill != "솔라빔" and state['weather'] != 1:
        if attacker_name == state['player1']:
            state['isplayer1bind'] = 1
        else:
            state['isplayer2bind'] = 1
    elif addi == 9:
        attacker["hp"] = 1

    state['battleres'] += f"\n[{attacker_name}] {attacker['name']} [{attacker['hp']}HP]\n[{defender_name}] {defender['name']} [{defender['hp']}HP]\n\n"

def end_pve_battle(chat, sender, winner):
    state = _get_state(sender)

    pokUser = read_json(f"player_{sender}")

    if state['isbattle'] == 5:
        raw = read_json("ranking")
        file_data = {}
        ranking_arr = []
        if isinstance(raw, list):
            ranking_arr = raw
        elif isinstance(raw, dict):
            file_data = raw
            ranking_arr = raw.get("ranking", [])
        else:
            file_data = {}

        sender_idx = None
        opponent_idx = None
        for i, entry in enumerate(ranking_arr):
            if entry.get("name") == sender:
                sender_idx = i
            if entry.get("name") == state['player1']:
                opponent_idx = i

        if winner == sender and sender_idx is not None and opponent_idx is not None:
            ranking_arr[sender_idx], ranking_arr[opponent_idx] = ranking_arr[opponent_idx], ranking_arr[sender_idx]
            pokInv = read_json(f"player_{sender}_inv")
            if pokInv and pokInv.get("deck"):
                deck_copy = []
                for pok in pokInv["deck"]:
                    deck_copy.append(pok.copy())
                ranking_arr[opponent_idx]["deck"] = deck_copy
            file_data["ranking"] = ranking_arr
            write_json("ranking", file_data)
            chat.reply(f'@{sender}\n배틀 승리! 랭킹이 상승하여 {opponent_idx + 1}위가 되었습니다!\n')
            chat.reply(f'@{state["player1"]}\n{sender}님에게 랭킹을 빼앗겼습니다. 현재 {opponent_idx}위')
        elif winner != sender:
            chat.reply(f'@{sender}\n배틀 패배, 현재 {sender_idx + 1}위')

        state['isbattle'] = 0
        state['isrankingbattle'] = 0
        advOn[sender] = 0
        _clear_state(sender)
        return

    if winner == sender:
        if state['isbattle'] == 2:
            reward = 2000000 * (state['gymnum'] + 1) ** 2
            reward = math.ceil(reward * SETTING.get("eventp", {}).get("goldX", 1))

            pokUser["gold"] += reward
            pokUser["badge"] = pokUser.get("badge", 0) + 1

            write_json(f"player_{sender}", pokUser)

            chat.reply(f"🏆체육관 {state['gymnum']} 클리어!🏆\n\n{reward:,}원을 얻었어요.\n보유금액: {pokUser['gold']:,}원\n현재 뱃지 개수: {pokUser['badge']}개")

        elif state['isbattle'] == 3:
            newChampion(sender, chat, pokUser)

        elif state['isbattle'] == 4:
            level = battletowerlev.get(sender, 50)
            reward = level ** 2 * 10000 * SETTING.get("eventp", {}).get("goldX", 1)

            pokUser["gold"] += reward
            battletowerplayers[sender] = battletowerplayers.get(sender, 0) + 1

            update_ranking(sender, True)

            write_json(f"player_{sender}", pokUser)

            chat.reply(f"🏆배틀타워 클리어!🏆\n\n{reward:,}원을 얻었어요.\n보유금액: {pokUser['gold']:,}원")
    else:
        if state['isbattle'] == 2:
            chat.reply(f"체육관 관장과의 배틀에서 패배했어요.\n도전에 실패했어요.\n현재 뱃지 개수: {pokUser.get('badge', 0)}개")
        elif state['isbattle'] == 3:
            chat.reply(f"챔피언과의 배틀에서 패배했어요.\n도전에 실패했어요.")
        elif state['isbattle'] == 4:
            chat.reply(f"배틀타워에서 패배했어요.\n도전에 실패했어요.")

        update_ranking(sender, False)

    state['isbattle'] = 0
    advOn[sender] = 0
    _clear_state(sender)

def update_ranking(sender, is_win):
    raw = read_json("ranking")

    ranking_data = {}
    battle_stats = []

    if isinstance(raw, list):
        battle_stats = raw
    elif isinstance(raw, dict):
        ranking_data["ranking"] = raw.get("ranking", [])
        battle_stats = raw.get("battle_stats", [])

    found = False
    for entry in battle_stats:
        if entry.get("name") == sender:
            battle_total = entry.get("battle", {}).get("total", 0) + 1
            battle_win = entry.get("battle", {}).get("win", 0) + (1 if is_win else 0)
            entry["battle"] = {"total": battle_total, "win": battle_win}
            found = True
            break

    if not found:
        pokUser = read_json(f"player_{sender}")
        battle_stats.append({
            "name": sender,
            "rank": pokUser.get("rank", "신입 트레이너"),
            "battle": {
                "total": 1,
                "win": 1 if is_win else 0
            }
        })

    ranking_data["battle_stats"] = battle_stats
    write_json("ranking", ranking_data)
