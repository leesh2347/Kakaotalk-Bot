# Module 5: Player Info Display
import math
from .config import SETTING, BALL_ARR, COLLECTION_NAMES, V_TEXTS, TYPE_TEXTS, BALL_INFO_LIST, TRAINER_RANK_DATA, COLLECTION_EFFECTS_DATA
from .io_helpers import read_json, printskills, pokimglink, send_image

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
    # stat['g5'] = ultra beast spawn bonus
    # stat['g4'] = legendary spawn bonus (added to ball's legendary bonus)
    # stat['g3'] = rare spawn bonus (added to ball's rare bonus)
    stat_g5 = pokUser.get("stat", {}).get("g5", 0)
    stat_g4 = pokUser.get("stat", {}).get("g4", 0)
    stat_g3 = pokUser.get("stat", {}).get("g3", 0)

    # Base spawn rates from SETTING
    base_ultra = SETTING["p"]["g5"]      # 0
    base_legend = SETTING["p"]["g4"]      # 0
    base_rare = SETTING["p"]["g3"]        # 1
    base_advanced = SETTING["p"]["g2"]    # 19
    base_normal = SETTING["p"]["g1"]      # 60

    # Total spawn rates
    total_ultra_spawn = base_ultra + stat_g5
    total_legend_spawn = base_legend + stat_g4 + ball_spawn_legend_ui
    total_rare_spawn = base_rare + stat_g3 + ball_spawn_rare_ui
    total_advanced_spawn = base_advanced
    total_normal_spawn = base_normal

    # Bonus amounts (excluding base rate)
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

    # Ball catch bonuses
    ball_catch_legend = BALL_INFO_LIST[ball_idx]['catch_bonus']['전설']
    ball_catch_rare = BALL_INFO_LIST[ball_idx]['catch_bonus']['레어']
    ball_catch_advanced = BALL_INFO_LIST[ball_idx]['catch_bonus']['고급']
    ball_catch_normal = BALL_INFO_LIST[ball_idx]['catch_bonus']['일반']

    # Calculate total catch rates for each group
    # Ultra Beast: base(0) + ball(0 or higher) + ribbon + event
    # For ultra beast, we need to check if there's a specific ultra beast catch bonus
    # From SETTING['ballcatch']: [0.2, 0.5, 2, 3, 5] - this seems to be for different ball tiers
    # Let's use the ball's catch bonus for ultra beast (index 0 for legendary)

    # Base catch rates per group
    catch_ultra_beast = base_ultra + ball_catch_legend + ribbon_catch_bonus + event_catch_bonus + ultra_beast_catch_bonus
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
        res += f"{i+1}. Lv.{pok.get('level', 0)} {pok.get('name', '???')}\n"

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
    res += f"울트라비스트 출현률: {total_ultra_spawn}%({ultra_spawn_bonus:+.1f}%)\n"
    res += f"전설의 포켓몬 출현률: {total_legend_spawn}%({legend_spawn_bonus:+.1f}%)\n"
    res += f"레어 포켓몬 출현률: {total_rare_spawn}%({rare_spawn_bonus:+.1f}%)\n"
    res += f"고급 포켓몬 출현률: {total_advanced_spawn}%({advanced_spawn_bonus:+.1f}%)\n"
    res += f"일반 포켓몬 출현률: {total_normal_spawn}%({normal_spawn_bonus:+.1f}%)\n\n"

    res += "포켓몬 그룹별 포획률\n"
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
    
    res = f"@{sender}님의 포켓몬 상자\n"
    res += f"덱: {len(deck)}마리\n"
    res += f"상자: {len(box)}마리\n\n"
    res+="\u200b"*500
    
    if deck:
        res += "[덱]\n"
        for i, pok in enumerate(deck[:6]):
            v_text = V_TEXTS[pok.get('v', 1)] if pok.get('v', 1) < len(V_TEXTS) else f"V{pok.get('v', 1)}"
            res += f"{i+1}. Lv.{pok.get('level', 0)} {pok.get('name', '???')} [{pok.get('hp', 0)}HP] {v_text}\n"
    
    if box:
        res += f"\n[상자 - {len(box)}마리]\n"
        for i, pok in enumerate(box):
            v_text = V_TEXTS[pok.get('v', 1)] if pok.get('v', 1) < len(V_TEXTS) else f"V{pok.get('v', 1)}"
            lock_mark = "🔒" if pok.get('islocked', 0) == 1 else ""
            res += f"{i+1}. {lock_mark}Lv.{pok.get('level', 0)} {pok.get('name', '???')} {v_text}\n"
    
    chat.reply(res)

def handle_pokinfo(sender, chat, args=None):
    """Handle pokemon info command (@포켓몬정보)"""
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {SETTING["pokinfo"]} [상자번호]')
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
    v_text = V_TEXTS[p.get('v', 1)] if p.get('v', 1) < len(V_TEXTS) else f"V{p.get('v', 1)}"
    
    type1 = read_json(f"포켓몬/{p['name']}", "type1") or 1
    type2 = read_json(f"포켓몬/{p['name']}", "type2") or 1
    
    pokdesc = v_text
    if type1 > 0:
        pokdesc += " " + TYPE_TEXTS[type1]
    if type2 > 0 and type2 != type1:
        pokdesc += " " + TYPE_TEXTS[type2]
    
    # Get image via KakaoTalk link
    try:
        img = pokimglink(p["name"], p.get("formchange", 0))
        send_image(None, chat, 58796, {
            'POKIMG': img,
            'POKNAME': f"Lv.{p['level']} {p['name']}",
            'DESC': pokdesc,
            'LINK': f"ko/wiki/{p['name']}_(포켓몬)"
        })
    except:
        pass
    
    # Skills
    if p["name"] == "메타몽":
        skills_text = "변신"
    else:
        skills_text = printskills(p.get("skills", []), p.get("skillslocked", []))
    
    res = f"Lv.{p['level']} {p['name']}\n"
    res += f"HP:{p['hp']} ATK:{p['atk']} DEF:{p['def']} SPD:{p['spd']}\n"
    res += f"{pokdesc}\n\n"
    res += skills_text
    
    chat.reply(res)

def handle_dpokinfo(sender, chat, args=None):
    """Handle deck info command (@덱정보)"""
    pokInv = read_json(f"player_{sender}_inv")
    if pokInv is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {SETTING["dpokinfo"]} [덱번호]')
        return
    
    try:
        n = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    if n < 1 or n > len(pokInv.get("deck", [])):
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return
    
    p = pokInv["deck"][n - 1]
    
    # Build description
    v_text = V_TEXTS[p.get('v', 1)] if p.get('v', 1) < len(V_TEXTS) else f"V{p.get('v', 1)}"
    
    if p.get("formchange", 0) > 0:
        type1 = read_json(f"포켓몬/{p['name']}_{p['formchange']}", "type1") or 1
        type2 = read_json(f"포켓몬/{p['name']}_{p['formchange']}", "type2") or 1
    else:
        type1 = read_json(f"포켓몬/{p['name']}", "type1") or 1
        type2 = read_json(f"포켓몬/{p['name']}", "type2") or 1
    
    pokdesc = v_text
    if type1 > 0:
        pokdesc += " " + TYPE_TEXTS[type1]
    if type2 > 0 and type2 != type1:
        pokdesc += " " + TYPE_TEXTS[type2]
    
    # Get image via KakaoTalk link
    try:
        img = pokimglink(p["name"], p.get("formchange", 0))
        send_image(None, chat, 58796, {
            'POKIMG': img,
            'POKNAME': f"Lv.{p['level']} {p['name']}",
            'DESC': pokdesc,
            'LINK': f"ko/wiki/{p['name']}_(포켓몬)"
        })
    except:
        pass
    
    # Skills
    if p["name"] == "메타몽":
        skills_text = "변신"
    else:
        skills_text = printskills(p.get("skills", []), p.get("skillslocked", []))
    
    res = f"Lv.{p['level']} {p['name']}\n"
    res += f"HP:{p['hp']} ATK:{p['atk']} DEF:{p['def']} SPD:{p['spd']}\n"
    res += f"{pokdesc}\n\n"
    res += skills_text
    
    chat.reply(res)
