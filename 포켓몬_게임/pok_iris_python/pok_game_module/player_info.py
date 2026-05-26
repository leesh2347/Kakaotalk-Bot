# Module 5: Player Info Display
import math
from .config import SETTING, BALL_ARR, COLLECTION_NAMES, V_TEXTS, TYPE_TEXTS, BALL_INFO_LIST, TRAINER_RANK_DATA, COLLECTION_EFFECTS_DATA, CMDS, FORM_CHANGE_NAMES, FORM_CHANGE_STATUS
from .io_helpers import read_json, printskills, pokimglink, send_image, printability
from .shiny_moves import SHINY_POK_SKILLS

def handle_info(sender, chat, args=None):
    """Handle trainer info command (@트레이너정보)"""
    # Determine target player: if args provided, use it; otherwise use sender
    target_player = args.strip() if args and args.strip() else sender

    pokUser = read_json(f"player_{target_player}")
    if pokUser is None:
        chat.reply(f'@{sender}\n{target_player}님의 가입 정보가 없습니다.')
        return

    pokInv = read_json(f"player_{target_player}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n{target_player}님의 가입 정보가 없습니다.')
        return

    # Get rank index
    rank_name = pokUser.get('rank', SETTING["rank"]["name"][0])
    try:
        rank_idx = SETTING["rank"]["name"].index(rank_name)
    except ValueError:
        rank_idx = 0

    # Get ball info
    current_ball = pokUser.get('Ball', BALL_ARR[0])
    ball_idx = BALL_ARR.index(current_ball) if current_ball in BALL_ARR else 0
    ball_price = SETTING["ballPrice"][ball_idx]
    ball_discount = pokUser.get("balldc", 0)
    discounted_price = math.ceil(ball_price * (100 - ball_discount) / 100)
    ball_level_range = BALL_INFO_LIST[ball_idx]['level_range']

    # Get deck
    deck = pokInv.get("deck", [])

    # Get counts
    count_data = pokUser.get('count', {})
    total_encounters = count_data.get('total', 0)
    total_success = count_data.get('succ', 0)
    total_fail = count_data.get('fail', 0)
    catch_rate = int(total_success * 100 / total_encounters) if total_encounters > 0 else 0

    # Get battle data
    battle_data = pokUser.get('battlecount', {})
    total_battles = battle_data.get('total', 0)
    total_wins = battle_data.get('win', 0)
    total_losses = battle_data.get('lose', 0)
    win_rate = int(total_wins * 100 / total_battles) if total_battles > 0 else 0

    # Get ribbon
    ribbon = pokUser.get('ribbon', '없음')

    # Get badge count
    badge_count = pokUser.get('badge', 0)

    # Calculate exploration success rate
    base_success = SETTING["success"]
    rank_success_bonus = SETTING["rank"]["success"][rank_idx]
    exploration_success_rate = base_success + rank_success_bonus

    # Calculate rest interval
    rest_interval_ms = SETTING["rank"]["rest"][rank_idx]
    rest_interval_sec = rest_interval_ms // 1000

    # Calculate exploration time
    cast_time_reduction = SETTING["rank"]["castT"][rank_idx]
    cast_min = math.ceil(SETTING["castT"]["min"] * (100 - cast_time_reduction) / 100)
    cast_max = math.ceil(SETTING["castT"]["max"] * (100 - cast_time_reduction) / 100)

    # Get levelup/skillchange discount
    levelup_discount = pokUser.get("levdc", 0)
    skill_discount = pokUser.get("skilldc", 0)
    total_discount = levelup_discount + skill_discount

    # Calculate spawn rates
    # Ball spawn bonuses
    # spawn_bonus['전설'] affects ??? (groupunknown) spawn rate
    # spawn_bonus['레어'] affects rare (group3) spawn rate  
    # But in the UI, '전설' is displayed as ??? spawn rate and '레어' as legendary spawn rate
    ball_spawn_legend_ui = BALL_INFO_LIST[ball_idx]['spawn_bonus']['전설']  # Displayed as "전설 포켓몬 출현률"
    ball_spawn_rare_ui = BALL_INFO_LIST[ball_idx]['spawn_bonus']['레어']  # Displayed as "레어 포켓몬 출현률"

    # Get stat bonuses (from ribbons and other sources)
    # stat['g6'] = paradox spawn bonus
    # stat['g5'] = ultra beast spawn bonus
    # stat['g4'] = legendary spawn bonus (added to ball's legendary bonus)
    # stat['g3'] = rare spawn bonus (added to ball's rare bonus)
    stat_g6 = pokUser.get("stat", {}).get("g6", 0)
    stat_g5 = pokUser.get("stat", {}).get("g5", 0)
    stat_g4 = pokUser.get("stat", {}).get("g4", 0)
    stat_g3 = pokUser.get("stat", {}).get("g3", 0)

    # Base spawn rates from SETTING
    base_paradox = SETTING["p"]["g6"]    # 0.1
    base_ultra = SETTING["p"]["g5"]      # 0
    base_legend = SETTING["p"]["g4"]      # 0
    base_rare = SETTING["p"]["g3"]        # 1
    base_advanced = SETTING["p"]["g2"]    # 19
    base_normal = SETTING["p"]["g1"]      # 60

    # Ball spawn bonuses for paradox (패러독스)
    ball_spawn_paradox_ui = BALL_INFO_LIST[ball_idx]['spawn_bonus']['패러독스']

    # Total spawn rates
    total_paradox_spawn = base_paradox + stat_g6 + ball_spawn_paradox_ui
    total_ultra_spawn = base_ultra + stat_g5
    total_legend_spawn = base_legend + stat_g4 + ball_spawn_legend_ui
    total_rare_spawn = base_rare + stat_g3 + ball_spawn_rare_ui
    total_advanced_spawn = base_advanced
    total_normal_spawn = base_normal

    # Bonus amounts (excluding base rate)
    paradox_spawn_bonus = stat_g6 + ball_spawn_paradox_ui
    ultra_spawn_bonus = stat_g5
    legend_spawn_bonus = stat_g4 + ball_spawn_legend_ui
    rare_spawn_bonus = stat_g3 + ball_spawn_rare_ui
    advanced_spawn_bonus = 0
    normal_spawn_bonus = 0

    # Calculate catch rates
    # Base catch rate + rank bonus + ball bonus + ribbon bonus + event bonus + collection bonus
    rank_catch_bonus = SETTING["rank"]["successcatch"][rank_idx]

    # Get ribbon catch bonus
    ribbon_name = pokUser.get('ribbon', '')
    ribbon_idx = 0
    if ribbon_name and ribbon_name != '없음':
        try:
            ribbon_idx = SETTING["ribbon"]["name"].index(ribbon_name)
        except ValueError:
            ribbon_idx = 0
    ribbon_catch_bonus = SETTING["ribbon"]["successcatch"][ribbon_idx]

    # Get collection catch bonuses
    active_collection = pokUser.get("activecollection", [])
    collection_catch_bonus = 0
    ultra_beast_catch_bonus = 0
    legend_catch_bonus = 0

    # Collection 15: Legendary/Mythical 50% - additional catch rate 1%
    if 15 in active_collection:
        collection_catch_bonus += 1
        legend_catch_bonus += 1

    # Collection 22: One of Kalos 100% - gatcha reload (not catch rate)
    # Check for region-specific catch rate bonuses from collections
    # Collection 11-17: 50% completions give 2x(collection level)% damage, not catch rate
    # Collection 21: Hoenn 100% - PVP battle reward (not catch rate)
    # Collection 23: Sinnoh 100% - damage 3x(collection level)%
    # Collection 24: Unova 100% - catch rate 2x(collection level)%
    collection_level = pokUser.get("collectionlev", 1)
    if 24 in active_collection:  # Unova 100%
        collection_catch_bonus += 2 * collection_level

    # Event bonuses
    eventp = pokUser.get("eventp", SETTING["eventp"])
    event_catch_bonus = eventp.get("allcatch", 0)
    event_legend_catch_bonus = eventp.get("g4catch", 0)
    event_rare_catch_bonus = eventp.get("g3catch", 0)

    # Ball catch bonuses (from ball upgrade)
    successcatch = pokUser.get("successcatch", {})
    default_ball_catch = SETTING["catchsuccess"]
    ball_catch_paradox = successcatch.get("g6", default_ball_catch[0] * (ball_idx + 1))
    ball_catch_ultra = successcatch.get("g5", default_ball_catch[1] * (ball_idx + 1))
    ball_catch_legend = successcatch.get("g4", default_ball_catch[2])
    ball_catch_rare = successcatch.get("g3", default_ball_catch[3])
    ball_catch_advanced = successcatch.get("g2", default_ball_catch[4])
    ball_catch_normal = successcatch.get("g1", SETTING["catchsuccess"][5] if len(SETTING["catchsuccess"]) > 5 else 40)

    # Calculate total catch rates for each group
    # Paradox: base(1) + ball + rank + ribbon + event
    # Ultra Beast: base(0) + ball + ribbon + event + ultra_beast_catch_bonus
    # Legend/Rare: base + ball + rank + ribbon + event

    # Base catch rates per group
    catch_paradox = base_paradox + ball_catch_paradox + rank_catch_bonus + ribbon_catch_bonus + event_catch_bonus
    catch_ultra_beast = base_ultra + ball_catch_ultra + ribbon_catch_bonus + event_catch_bonus + ultra_beast_catch_bonus
    catch_legend = base_legend + ball_catch_legend + rank_catch_bonus + ribbon_catch_bonus + event_catch_bonus + event_legend_catch_bonus + legend_catch_bonus + collection_catch_bonus
    catch_rare = base_rare + ball_catch_rare + rank_catch_bonus + ribbon_catch_bonus + event_catch_bonus + event_rare_catch_bonus
    catch_advanced = base_advanced + ball_catch_advanced + rank_catch_bonus + ribbon_catch_bonus + event_catch_bonus
    catch_normal = base_normal + ball_catch_normal + rank_catch_bonus + ribbon_catch_bonus + event_catch_bonus

    # Build output
    space = "\u200b"*500
    res = f"[{rank_name}] {target_player}님의 정보\n{space}\n"
    res += f"현재 체력: {pokUser.get('hp', 0)}/{pokUser.get('maxHp', 0)}\n"
    res += f"보유금액: {pokUser.get('gold', 0):,}원\n"
    res += f"볼: {current_ball}\n"
    res += f"볼 1개당 가격: {discounted_price:,}원({ball_discount}% 할인)\n"
    res += f"야생 포켓몬 레벨: {ball_level_range[0]}~{ball_level_range[1]}\n"
    res += f"현재 볼 갯수: {pokUser.get('balls', 0)}\n\n"

    res += "현재 장착 중인 덱\n"
    for i, pok in enumerate(deck[:6]):
        shiny_text = "✨" if pok.get('shiny', 0) > 0 else ""
        res += f"{i+1}. Lv.{pok.get('level', 0)} {pok.get('name', '???')}{shiny_text}\n"

    res += f"\n포켓몬 조우 횟수: {total_encounters:,}\n"
    res += f"포획 성공: {total_success:,}\n"
    res += f"포획 실패: {total_fail:,}\n"
    res += f"포획 성공률: {catch_rate}%\n\n"

    res += f"리본: {ribbon}\n"
    res += f"획득한 뱃지 개수: {badge_count}개\n"
    res += f"배틀 횟수: {total_battles}\n"
    res += f"배틀 승리: {total_wins}\n"
    res += f"배틀 패배: {total_losses}\n"
    res += f"배틀 승률: {win_rate}%\n\n"

    res += f"탐험 성공률: {exploration_success_rate}%(+{rank_success_bonus}%)\n"
    res += f"휴식 소요시간: {rest_interval_sec}초마다 체력 1 회복\n"
    res += f"탐험 소요시간: {cast_min}~{cast_max}초 ({cast_time_reduction}% 단축)\n\n"

    res += f"포켓몬 레벨업/스킬뽑기 할인: {total_discount}%\n"
    res += f"패러독스 출현률: {total_paradox_spawn}%({paradox_spawn_bonus:+.1f}%)\n"
    res += f"울트라비스트 출현률: {total_ultra_spawn}%({ultra_spawn_bonus:+.1f}%)\n"
    res += f"전설의 포켓몬 출현률: {total_legend_spawn}%({legend_spawn_bonus:+.1f}%)\n"
    res += f"레어 포켓몬 출현률: {total_rare_spawn}%({rare_spawn_bonus:+.1f}%)\n"
    res += f"고급 포켓몬 출현률: {total_advanced_spawn}%({advanced_spawn_bonus:+.1f}%)\n"
    res += f"일반 포켓몬 출현률: {total_normal_spawn}%({normal_spawn_bonus:+.1f}%)\n\n"

    res += "포켓몬 그룹별 포획률\n"
    res += f"패러독스: {catch_paradox}%({catch_paradox - base_paradox:+.1f}%)\n"
    res += f"울트라비스트: {catch_ultra_beast}%({catch_ultra_beast - base_ultra:+.1f}%)\n"
    res += f"전설: {catch_legend}%({catch_legend - base_legend:+.1f}%)\n"
    res += f"레어: {catch_rare}%({catch_rare - base_rare:+.1f}%)\n"
    res += f"고급: {catch_advanced}%({catch_advanced - base_advanced:+.1f}%)\n"
    res += f"일반: {catch_normal}%({catch_normal - base_normal:+.1f}%)"

    chat.reply(res)

def handle_box(sender, chat):
    """Handle pokemon box command (@내 포켓몬)"""
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    deck = pokInv.get("deck", [])
    box = pokInv.get("box", [])
    item = pokInv.get("item", [])
    
    res = f"@{sender}님의 포켓몬 상자\n"
    res += f"덱: {len(deck)}마리\n"
    res += f"상자: {len(box)}마리\n\n"
    res+="\u200b"*500
    res+= f"\n박스 포켓몬 정보 보기: {CMDS["pokinfo"]} [박스번호]\n"
    res+= f"덱 포켓몬 정보 보기: {CMDS["dpokinfo"]} [덱번호]\n"
    res+= f"덱으로 이동: {CMDS["lock"]} [박스번호]\n"
    res+= f"덱으로 이동: {CMDS["unlock"]} [덱번호]\n"
    res+= f"박스 포켓몬 잠금: {CMDS["boxlock"]} [박스번호]\n"
    res+= f"박스 포켓몬 잠금해제: {CMDS["boxunlock"]} [박스번호]\n\n"
    
    if deck:
        res += "[덱]\n"
        for i, pok in enumerate(deck[:6]):
            v_text = V_TEXTS[pok.get('v', 1)] if pok.get('v', 1) < len(V_TEXTS) else f"V{pok.get('v', 1)}"
            shiny_text = "✨" if pok.get('shiny', 0) > 0 else ""
            res += f"{i+1}. Lv.{pok.get('level', 0)} {pok.get('name', '???')}{shiny_text} {v_text}\n"
    
    if box:
        res += f"\n[상자 - {len(box)}마리]\n"
        for i, pok in enumerate(box):
            v_text = V_TEXTS[pok.get('v', 1)] if pok.get('v', 1) < len(V_TEXTS) else f"V{pok.get('v', 1)}"
            shiny_text = "✨" if pok.get('shiny', 0) > 0 else ""
            lock_mark = "🔒" if pok.get('islocked', 0) == 1 else ""
            res += f"{i+1}. {lock_mark}Lv.{pok.get('level', 0)} {pok.get('name', '???')}{shiny_text} {v_text}\n"

    res +="\n현재 보유중인 아이템 목록\n"

    if item:
        res+=", ".join(item)
    else:
        res+="\n아이템이 없습니다."
    
    chat.reply(res)

def handle_pokinfo(sender, chat, args=None):
    """Handle pokemon info command (@포켓몬정보)"""
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {CMDS["pokinfo"]} [상자번호]')
        return
    
    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    if n < 1 or n > len(pokInv.get("box", [])):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    p = pokInv["box"][n - 1]
    
    # Build description
    v_text = V_TEXTS[p.get('v', 0)] if p.get('v', 0) < len(V_TEXTS) else f"V{p.get('v', 0)}"
    
    pok_file_name = f"{p['name']}_{p['formchange']}" if p.get('formchange', 0) != 0 else p['name']
    type1 = read_json(f"포켓몬/{pok_file_name}", "type1") or 0
    type2 = read_json(f"포켓몬/{pok_file_name}", "type2") or 0
    
    pokdesc = v_text
    if type1 > 0:
        pokdesc += " " + TYPE_TEXTS[type1]
    if type2 > 0 and type2 != type1:
        pokdesc += " " + TYPE_TEXTS[type2]
    pokdesc +=f"\nHP:{p['hp']} ATK:{p['atk']} DEF:{p['def']}\nS.ATK:{p['satk']} S.DEF:{p['sdef']} SPD:{p['spd']}"
    
    # Get image via KakaoTalk link
    try:
        img = pokimglink(p["name"], p.get("formchange", 0), p.get("shiny", 0))
        send_image(None, chat, 58796, {
            'POKIMG': img,
            'POKNAME': f"Lv.{p['level']} {p['name']}",
            'DESC': pokdesc,
            'shiny':p.get("shiny", 0),
            'LINK': f"ko/wiki/{p['name']}_(포켓몬)"
        })
    except:
        chat.reply(f"이미지 전송 오류.\nLv.{p['level']} {p['name']}\n{pokdesc}")
    
    skills_text = ""

    skills_text += printability(read_json(f"포켓몬/{pok_file_name}", "ability") or 0)

    # Skills
    if p["name"] == "메타몽":
        skills_text += "변신"
    else:
        pok_shiny_skills = SHINY_POK_SKILLS.get(p["name"], []) if p.get("shiny", 0) == 1 else []
        skills_text += printskills(p.get("skills", []), p.get("skillslocked", []), pok_shiny_skills)
        
        # Add shiny skills info if shiny value is 1
        if p.get("shiny", 0) == 1 and p["name"] in SHINY_POK_SKILLS:
            shiny_skills = SHINY_POK_SKILLS[p["name"]]
            skills_text += f"\n✨ 획득 가능 이로치 전용 기술: {', '.join(shiny_skills)}\n"

        skills_text+= f"\n레벨업: {CMDS["boxlevelup"]} [박스번호] [레벨업 횟수]\n"
        skills_text+= "스킬뽑기, 메가진화, 거다이맥스, 폼체인지의 경우 덱 장착 후 가능\n"
    
    res = f"@{sender}\n{skills_text}"
    
    chat.reply(res)

def handle_dpokinfo(sender, chat, args=None):
    """Handle deck pokemon info command (@덱정보)"""
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {CMDS["dpokinfo"]} [덱순번]')
        return
    
    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    deck = pokInv.get("deck", [])
    if n < 1 or n > len(deck):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    p = deck[n - 1]
    
    v_text = V_TEXTS[p.get('v', 0)] if p.get('v', 0) < len(V_TEXTS) else f"V{p.get('v', 0)}"
    
    pok_file_name = f"{p['name']}_{p['formchange']}" if p.get('formchange', 0) != 0 else p['name']
    type1 = read_json(f"포켓몬/{pok_file_name}", "type1") or 0
    type2 = read_json(f"포켓몬/{pok_file_name}", "type2") or 0
    
    pokdesc = v_text
    if type1 > 0:
        pokdesc += " " + TYPE_TEXTS[type1]
    if type2 > 0 and type2 != type1:
        pokdesc += " " + TYPE_TEXTS[type2]
    pokdesc +=f"\nHP:{p['hp']} ATK:{p['atk']} DEF:{p['def']}\nS.ATK:{p['satk']} S.DEF:{p['sdef']} SPD:{p['spd']}"
    
    try:
        img = pokimglink(p["name"], p.get("formchange", 0), p.get("shiny", 0))
        send_image(None, chat, 58796, {
            'POKIMG': img,
            'POKNAME': f"Lv.{p['level']} {p['name']}",
            'DESC': pokdesc,
            'shiny':p.get("shiny", 0),
            'LINK': f"ko/wiki/{p['name']}_(포켓몬)"
        })
    except:
        chat.reply(f"이미지 전송 오류.\nLv.{p['level']} {p['name']}\n{pokdesc}")
    
    skills_text = ""

    skills_text += printability(read_json(f"포켓몬/{pok_file_name}", "ability") or 0)

    skills_text += "\n"

    pok_shiny_skills = SHINY_POK_SKILLS.get(p["name"], []) if p.get("shiny", 0) == 1 else []
    skills_text += printskills(p.get("skills", []), p.get("skillslocked", []), pok_shiny_skills)
        
    # Add shiny skills info if shiny value is 1
    if p.get("shiny", 0) == 1 and p["name"] in SHINY_POK_SKILLS:
        shiny_skills = SHINY_POK_SKILLS[p["name"]]
        skills_text += f"\n✨ 획득 가능 이로치 전용 기술: {', '.join(shiny_skills)}\n"

    skills_text+="\u200b"*500
    skills_text+= f"\n도감보기: {CMDS["dic"]} [포켓몬 이름]\n"
    skills_text+= f"\n레벨업: {CMDS["levelup"]} [덱번호] [레벨업 횟수]\n"
    skills_text+= f"스킬뽑기: {CMDS["skillchange"]} [덱번호]\n"
    skills_text+= f"폼체인지: {CMDS["formchange"]} [덱번호]\n"
    skills_text+= f"메가진화/원시회귀: {CMDS["mega"]} [덱번호]\n"
    skills_text+= f"거다이맥스: {CMDS["gmax"]} [덱번호]\n"
    skills_text+= f"노력치강화(돌파): {CMDS["effort"]} [덱번호] [재료 박스번호]\n"
    
    res = f"@{sender}\n{skills_text}"
    
    chat.reply(res)

def handle_pokdictionary(sender, chat, args=None):
    """Handle pokemon info command (@도감)"""
    
    if args is None:
        chat.reply(f'@{sender}\n사용법: {CMDS["dic"]} [포켓몬이름]')
        return

    shiny = 0

    pokname = ""

    if len(args.split("/")) > 1:
        shiny = int(args.split("/")[1])
        pokname = args.split("/")[0]
    else:
        shiny = 0
        pokname = args

    if len(args.split("_")) > 1:
        formchange = int(pokname.split("_")[1])
        pokname = pokname.split("_")[0]
    else:
        formchange = 0
    
    if formchange != 0:
        pokinfo = {
            'type1':read_json(f"포켓몬/{pokname}_{formchange}", "type1") or 0,
            'type2':read_json(f"포켓몬/{pokname}_{formchange}", "type2") or 0,
            'hp':read_json(f"포켓몬/{pokname}_{formchange}", "hp") or 0,
            'atk':read_json(f"포켓몬/{pokname}_{formchange}", "atk") or 0,
            'def':read_json(f"포켓몬/{pokname}_{formchange}", "def") or 0,
            'satk':read_json(f"포켓몬/{pokname}_{formchange}", "satk") or 0,
            'sdef':read_json(f"포켓몬/{pokname}_{formchange}", "sdef") or 0,
            'spd':read_json(f"포켓몬/{pokname}_{formchange}", "spd") or 0,
            'nextup':read_json(f"포켓몬/{pokname}_{formchange}", "nextup") or 'x',
            'nextlv':read_json(f"포켓몬/{pokname}_{formchange}", "nextlv") or 0,
            'skills':read_json(f"포켓몬/{pokname}_{formchange}", "skills") or [],
            'ability':read_json(f"포켓몬/{pokname}_{formchange}", "ability") or 0
        }
    else:
        pokinfo = {
            'type1':read_json(f"포켓몬/{pokname}", "type1") or 0,
            'type2':read_json(f"포켓몬/{pokname}", "type2") or 0,
            'hp':read_json(f"포켓몬/{pokname}", "hp") or 0,
            'atk':read_json(f"포켓몬/{pokname}", "atk") or 0,
            'def':read_json(f"포켓몬/{pokname}", "def") or 0,
            'satk':read_json(f"포켓몬/{pokname}", "satk") or 0,
            'sdef':read_json(f"포켓몬/{pokname}", "sdef") or 0,
            'spd':read_json(f"포켓몬/{pokname}", "spd") or 0,
            'nextup':read_json(f"포켓몬/{pokname}", "nextup") or 'x',
            'nextlv':read_json(f"포켓몬/{pokname}", "nextlv") or 0,
            'skills':read_json(f"포켓몬/{pokname}", "skills") or [],
            'ability':read_json(f"포켓몬/{pokname}", "ability") or 0
        }
    
    # Build description

    poktype = ""

    if pokinfo['type1'] > 0:
        poktype += " " + TYPE_TEXTS[pokinfo['type1']]
    if pokinfo['type1'] > 0 and pokinfo['type2'] != pokinfo['type1']:
        poktype += " " + TYPE_TEXTS[pokinfo['type2']]

    # Get image via KakaoTalk link
    try:
        img = pokimglink(pokname, formchange, shiny)
        imgpokname = ""
        if formchange != 0:
            imgpokname = f"도감 보기: {pokname}({FORM_CHANGE_STATUS[pokname][formchange]})"
        else:
            imgpokname = f"도감 보기: {pokname}"
        send_image(None, chat, 58796, {
            'POKIMG': img,
            'POKNAME': imgpokname,
            'DESC': poktype,
            'shiny':shiny,
            'LINK': f"ko/wiki/{pokname}_(포켓몬)"
        })
    except Exception as e:
        print(e)
        chat.reply(f"이미지 전송 오류.\n도감: {pokname}\n{poktype}")
    
    skills_text = ""
    if formchange != 0:
        skills_text +=f"[{pokname}]({FORM_CHANGE_STATUS[pokname][formchange]})\n\n[종족값]\n"
    else:
        skills_text +=f"[{pokname}]\n\n[종족값]\n"
    skills_text +=f"HP:{pokinfo['hp']} (❻ {math.ceil(pokinfo['hp']*1.6)})\n"
    skills_text +=f"ATK:{pokinfo['atk']} (❻ {math.ceil(pokinfo['atk']*1.6)})\n"
    skills_text +=f"DEF:{pokinfo['def']} (❻ {math.ceil(pokinfo['def']*1.6)})\n"
    skills_text +=f"S.ATK:{pokinfo['satk']} (❻ {math.ceil(pokinfo['satk']*1.6)})\n"
    skills_text +=f"S.DEF:{pokinfo['sdef']} (❻ {math.ceil(pokinfo['sdef']*1.6)})\n"
    skills_text +=f"SPD:{pokinfo['spd']} (❻ {math.ceil(pokinfo['spd']*1.6)})\n\n"

    #진화
    if pokinfo['nextup'] != 'x':
        skills_text += f"[진화 정보]\n진화 레벨: {pokinfo['nextlv']}\n진화 후: {pokinfo['nextup']}\n\n"

    # Skills

    space = "\u200b"*500

    skills_text += printability(pokinfo['ability'])


    skills_text += f"{space}\n\n[배우는 기술]\n"

    skills_text += printskills(pokinfo['skills'],[])
    
    # Add shiny skills info if exists
    shiny_skills = []

    if formchange != 0:
        if f"{pokname}_{formchange}" in SHINY_POK_SKILLS:
            shiny_skills = SHINY_POK_SKILLS[f"{pokname}_{formchange}"]
    else:
        if pokname in SHINY_POK_SKILLS:
            shiny_skills = SHINY_POK_SKILLS[pokname]

    if len(shiny_skills) > 0:
        skills_text += f"\n{space}\n\n[배우는 기술(이로치 전용)]\n"
        skills_text += printskills(shiny_skills, [])
    
    #add guides
    skills_text += f"\n이로치 도감 보기: [포켓몬이름]/1"

    if pokname in FORM_CHANGE_NAMES:
        skills_text += f"\n폼체인지 도감 보기"
        for i in range(1, len(FORM_CHANGE_STATUS[pokname])):
            skills_text += f"\n-{FORM_CHANGE_STATUS[pokname][i]}: [{pokname}]_{i}"
    skills_text += f"\n※폼체인지 이로치의 경우 폼체인지-이로치 순서대로 입력해 주세요\n예시: 자시안_1/1"


    res = f"{skills_text}"

    chat.reply(res)
