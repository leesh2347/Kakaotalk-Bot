# Module 12: Etc (Gacha, Events, Ranking, etc.)
import random
import math
from .config import SETTING, TYPE_TEXTS, SEASONS, WEATHER_TEXTS
from .io_helpers import read_json, write_json, typejudge, weatherjudge, send_image, pokimglink, printskills
from .shiny_moves import SHINY_POK_SKILLS

gatchaplayers = {}

def handle_eventinfo(sender, chat):
    """Handle event info command (@포켓몬이벤트)"""
    eventp = SETTING.get("eventp", {})
    
    res = f"@{sender} 현재 진행중인 이벤트\n\n"
    
    has_event = False
    if eventp.get("unknown", 0) > 0:
        res += f"??? 포켓몬 출현률 +{eventp['unknown']}%\n"
        has_event = True
    if eventp.get("shiny", 1) > 1:
        res += f"✨색이 다른 포켓몬 출현률 x{eventp['shiny']}배\n"
        has_event = True
    if eventp.get("g6", 0) > 0:
        res += f"⏳️패러독스 출현률 +{eventp['g6']}%\n"
    if eventp.get("g5", 0) > 0:
        res += f"🦄울트라비스트 출현률 +{eventp['g5']}%\n"
        has_event = True
    if eventp.get("g4", 0) > 0:
        res += f"⭐전설/환상 포켓몬 출현률 +{eventp['g4']}%\n"
        has_event = True
    if eventp.get("g3", 0) > 0:
        res += f"레어 포켓몬 출현률 +{eventp['g3']}%\n"
        has_event = True
    if eventp.get("g4catch", 0) > 0:
        res += f"전설 포획률 +{eventp['g4catch']}%\n"
        has_event = True
    if eventp.get("g3catch", 0) > 0:
        res += f"레어 포획률 +{eventp['g3catch']}%\n"
        has_event = True
    if eventp.get("allcatch", 0) > 0:
        res += f"전체 포획률 +{eventp['allcatch']}%\n"
        has_event = True
    if eventp.get("goldX", 1) > 1:
        res += f"골드 획득량 x{eventp['goldX']}배\n"
        has_event = True
    
    if not has_event:
        res += "현재 진행중인 이벤트가 없어요!"
    
    chat.reply(res)

def handle_ribbon(sender, chat):
    """Handle ribbon info command (@리본종류)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    current_ribbon = pokUser.get("ribbon", SETTING["ribbon"]["name"][0])
    current_idx = SETTING["ribbon"]["name"].index(current_ribbon)
    
    res = f"@{sender} 현재 리본: {current_ribbon}\n"
    res += f"배틀 횟수: {pokUser.get('battlecount', {}).get('total', 0)}회\n\n"
    res += "[리본 종류]\n"
    
    for i, ribbon in enumerate(SETTING["ribbon"]["name"]):
        status = "◀ 현재" if i == current_idx else ""
        required = SETTING["ribbon"]["upif"][i] if i < len(SETTING["ribbon"]["upif"]) else 0
        res += f"{i+1}. {ribbon} - 필요 배틀: {required}회 {status}\n"
    
    chat.reply(res)

def handle_rank(sender, chat):
    """Handle ranking command (@포켓몬 랭킹)"""
    pokRank = read_json("ranking")
    
    if pokRank is None or len(pokRank) == 0:
        chat.reply("@{sender}\n랭킹에 등록된 유저가 없어요.")
        return
    
    if len(pokRank) == 1:
        entry = pokRank[0]
        res = f"[1위] <{entry.get('rank', '없음')}> {entry.get('name', '???')}\n"
        res += f"총 배틀 횟수: {entry.get('battle', {}).get('total', 0)}\n"
        res += f"승리 횟수: {entry.get('battle', {}).get('win', 0)}"
        chat.reply(res)
        return
    
    # Sort by wins descending
    pokRank.sort(key=lambda x: x.get("battle", {}).get("win", 0), reverse=True)
    
    # Show top N
    ranknum = SETTING.get("ranknum", 30)
    rarr = pokRank[:ranknum]
    
    space = "\u200b"*500

    result = ""
    for i, entry in enumerate(rarr):
        rank = i + 1
        result += f"[{rank}위] <{entry.get('rank', '없음')}> {entry.get('name', '???')}\n"
        result += f"총 배틀 횟수: {entry.get('battle', {}).get('total', 0)}\n"
        result += f"승리 횟수: {entry.get('battle', {}).get('win', 0)}\n\n"
    
    chat.reply(f"@{sender} 배틀 랭킹\n{space}\n\n{result.strip()}")

def handle_pokemon_ranking(sender, chat):
    raw = read_json("ranking")
    ranking_arr = []
    if isinstance(raw, list):
        ranking_arr = raw
    elif isinstance(raw, dict):
        ranking_arr = raw.get("ranking", [])
    else:
        ranking_arr = []

    if not ranking_arr:
        chat.reply(f"@{sender}\n랭킹 배틀에 등록된 유저가 없습니다.")
        return

    space = "\u200b"*500

    result_lines = ""
    for i, entry in enumerate(ranking_arr):
        rank = i + 1
        name = entry.get("name", "???")
        deck = entry.get("deck", [])

        result_lines += f"[{rank}위] {name}\n"
        result_lines += "현재 장착 중인 덱\n"
        for ii, pok in enumerate(deck[:6]):
            shiny_text = "✨" if pok.get('shiny', 0) > 0 else ""
            result_lines += f"{ii+1}. Lv.{pok.get('level', 0)} {pok.get('name', '???')}{shiny_text}\n"
        result_lines += "\n"

    chat.reply(f"@{sender}\n📊 포켓몬 랭킹\n{space}\n\n{result_lines}")

def handle_seasoninfo(sender, chat):
    """Handle season info command (@포켓몬날씨)"""
    
    res = "\n".join([
        "포켓몬게임 날씨 정보",
        "\u200b"*500,
        f"{WEATHER_TEXTS[1]}",
        "불 타입 기술 데미지 X1.5",
        "물 타입 기술 데미지 X0.5",
        "",
        f"{WEATHER_TEXTS[2]}",
        "물 타입 기술 데미지 X1.5",
        "불 타입 기술 데미지 X0.5",
        "",
        f"{WEATHER_TEXTS[3]}",
        "바위, 강철, 땅 타입을 제외한 모든 포켓몬 매 턴마다 1/8 지속 데미지",
        "",
        f"{WEATHER_TEXTS[4]}",
        "얼음 타입을 제외한 모든 포켓몬 매 턴마다 1/8 지속 데미지",
        "",
        f"{WEATHER_TEXTS[5]}",
        "에스퍼 타입 기술 데미지 X1.5",
        "모든 기술의 우선도 무효화",
        "",
        f"{WEATHER_TEXTS[6]}",
        "전기 타입 기술 데미지 X1.5",
        "모든 기술의 명중률 X1.5",
        "",
        f"{WEATHER_TEXTS[7]}",
        "풀 타입 기술 데미지 X1.5",
        "땅 타입 기술 데미지 X0.5",
        "모든 포켓몬 매 턴마다 1/8의 체력 회복",
        "",
        f"{WEATHER_TEXTS[8]}",
        "페어리 타입 기술 데미지 X1.5",
        "드래곤 타입 기술 데미지 X0.5",
        "",
        f"{WEATHER_TEXTS[9]}",
        "불 타입 기술 데미지 X2",
        "물 타입 기술 무효화",
        "",
        f"{WEATHER_TEXTS[10]}",
        "물 타입 기술 데미지 X2",
        "불 타입 기술 무효화",
        ""
    ])
    
    chat.reply(res)

def handle_leaguechar(sender, chat):
    """Handle league character command (@리그캐릭터)"""
    league_char = SETTING.get("leaguecharacter", "네크로즈마")
    
    pokinfo = {
        'type1':read_json(f"포켓몬/{league_char}", "type1") or 0,
        'type2':read_json(f"포켓몬/{league_char}", "type2") or 0,
        'hp':read_json(f"포켓몬/{league_char}", "hp") or 0,
        'atk':read_json(f"포켓몬/{league_char}", "atk") or 0,
        'def':read_json(f"포켓몬/{league_char}", "def") or 0,
        'satk':read_json(f"포켓몬/{league_char}", "satk") or 0,
        'sdef':read_json(f"포켓몬/{league_char}", "sdef") or 0,
        'spd':read_json(f"포켓몬/{league_char}", "spd") or 0,
        'nextup':read_json(f"포켓몬/{league_char}", "nextup") or 'x',
        'nextlv':read_json(f"포켓몬/{league_char}", "nextlv") or 0,
        'skills':read_json(f"포켓몬/{league_char}", "skills") or [],
    }
    
    # Build description

    poktype = "챔피언리그 클리어 시 획득 가능한 특별한 포켓몬입니다.\n"

    if pokinfo['type1'] > 0:
        poktype += " " + TYPE_TEXTS[pokinfo['type1']]
    if pokinfo['type1'] > 0 and pokinfo['type2'] != pokinfo['type1']:
        poktype += " " + TYPE_TEXTS[pokinfo['type2']]
    
    
    # Get image via KakaoTalk link
    try:
        img = pokimglink(league_char, 0, 0)
        send_image(None, chat, 58796, {
            'POKIMG': img,
            'POKNAME': f"리그 한정 캐릭터: {league_char}",
            'DESC': poktype,
            'shiny':0,
            'LINK': f"ko/wiki/{league_char}_(포켓몬)"
        })
    except Exception as e:
        print(e)
        chat.reply(f"이미지 전송 오류.\리그 한정 캐릭터: {league_char}\n{poktype}")
    
    skills_text = ""
    skills_text +=f"[{league_char}]\n\n[종족값]\n"
    skills_text +=f"HP:{pokinfo['hp']} (❻ {math.ceil(pokinfo['hp']*1.6)})\n"
    skills_text +=f"ATK:{pokinfo['atk']} (❻ {math.ceil(pokinfo['atk']*1.6)})\n"
    skills_text +=f"DEF:{pokinfo['def']} (❻ {math.ceil(pokinfo['def']*1.6)})\n"
    skills_text +=f"S.ATK:{pokinfo['satk']} (❻ {math.ceil(pokinfo['satk']*1.6)})\n"
    skills_text +=f"S.DEF:{pokinfo['sdef']} (❻ {math.ceil(pokinfo['sdef']*1.6)})\n"
    skills_text +=f"SPD:{pokinfo['spd']} (❻ {math.ceil(pokinfo['spd']*1.6)})\n\n"

    # Skills

    space = "\u200b"*500
    skills_text += f"{space}\n\n[배우는 기술]\n"

    
    skills_text += printskills(pokinfo['skills'],[])
    
    # Add shiny skills info if exists
    if league_char in SHINY_POK_SKILLS:
        shiny_skills = SHINY_POK_SKILLS[league_char]
        skills_text += f"\n{space}\n\n[배우는 기술(이로치 전용)]\n"
        skills_text += printskills(shiny_skills, [], shiny_skills)
    
    res = f"{skills_text}"
    
    chat.reply(res)

def handle_getzskill(sender, chat):
    """Handle Z-Skill command (@Z기술)"""
    # TODO: Implement Z-Skill
    chat.reply(f"@{sender}\nZ기술 기능은 준비 중입니다.")
