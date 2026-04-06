# Module 12: Etc (Gacha, Events, Ranking, etc.)
import random
import math
from .config import SETTING, SEASONS
from .io_helpers import read_json, write_json

gatchaplayers = {}

def handle_gatcha(sender, chat, args=None):
    """Handle gacha command (@제비뽑기)"""
    global gatchaplayers
    
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    # Check attempt limit
    if sender not in gatchaplayers:
        gatchaplayers[sender] = 0
    
    max_attempts = 5 + SETTING.get("eventp", {}).get("gatcha", 0)
    
    if gatchaplayers[sender] >= max_attempts:
        chat.reply(f"@{sender}\n제비뽑기 횟수를 모두 사용했어요!\n(최대 {max_attempts}회)")
        return
    
    # Gacha logic - random rewards
    rann = random.randint(0, 99)
    
    if rann < 30:  # 30% - Gold
        gold_amount = random.randint(1000000, 50000000)
        gold_amount = math.ceil(gold_amount * SETTING.get("eventp", {}).get("goldX", 1))
        pokUser["gold"] = pokUser.get("gold", 0) + gold_amount
        chat.reply(f"@{sender}\n🎰 제비뽑기 결과: {gold_amount:,}G 획득!")
    elif rann < 60:  # 30% - Balls
        ball_count = random.randint(5, 20)
        pokUser["balls"] = pokUser.get("balls", 0) + ball_count
        chat.reply(f"@{sender}\n🎰 제비뽑기 결과: 볼 {ball_count}개 획득!")
    elif rann < 80:  # 20% - Small gold
        gold_amount = random.randint(100000, 1000000)
        pokUser["gold"] = pokUser.get("gold", 0) + gold_amount
        chat.reply(f"@{sender}\n🎰 제비뽑기 결과: {gold_amount:,}G 획득!")
    else:  # 20% - Nothing
        chat.reply(f"@{sender}\n🎰 제비뽑기 결과: 꽝! 다음 기회에...")
    
    gatchaplayers[sender] += 1
    write_json(f"player_{sender}", pokUser)

def handle_eventinfo(sender, chat):
    """Handle event info command (@포켓몬이벤트)"""
    eventp = SETTING.get("eventp", {})
    
    res = f"@{sender} 현재 진행중인 이벤트\n\n"
    
    has_event = False
    if eventp.get("unknown", 0) > 0:
        res += f"??? 포켓몬 출현률 +{eventp['unknown']}%\n"
        has_event = True
    if eventp.get("gatcha", 0) > 0:
        res += f"제비뽑기 추가 횟수 +{eventp['gatcha']}회\n"
        has_event = True
    if eventp.get("battletower", 0) > 0:
        res += f"배틀타워 추가 횟수 +{eventp['battletower']}회\n"
        has_event = True
    if eventp.get("g4", 0) > 0:
        res += f"전설 포켓몬 출현률 +{eventp['g4']}%\n"
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
    
    result = ""
    for i, entry in enumerate(rarr):
        rank = i + 1
        result += f"[{rank}위] <{entry.get('rank', '없음')}> {entry.get('name', '???')}\n"
        result += f"총 배틀 횟수: {entry.get('battle', {}).get('total', 0)}\n"
        result += f"승리 횟수: {entry.get('battle', {}).get('win', 0)}\n\n"
    
    chat.reply(f"@{sender} 배틀 랭킹\n\n{result.strip()}")

def handle_seasoninfo(sender, chat):
    """Handle season info command (@포켓몬계절)"""
    pokseason = read_json("season")
    
    if pokseason is None:
        chat.reply("@{sender}\n계절 정보를 불러올 수 없어요!")
        return
    
    month = pokseason.get("month", 1)
    season_text = {1: "봄", 2: "여름", 3: "가을", 4: "겨울"}[month]
    
    res = f"현재 계절: {season_text}\n\n"
    res += f"{season_text}철에 출현률이 증가하는 포켓몬:\n"
    
    season_key = {1: 'spring', 2: 'summer', 3: 'autumn', 4: 'winter'}[month]
    season_poks = SEASONS[season_key][:15]
    
    res += ", ".join(season_poks)
    if len(SEASONS[season_key]) > 15:
        res += f" 외 {len(SEASONS[season_key]) - 15}마리"
    
    chat.reply(res)

def handle_leaguechar(sender, chat):
    """Handle league character command (@리그캐릭터)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    league_char = SETTING.get("leaguecharacter", "네크로즈마")
    chat.reply(f"@{sender}\n리그 캐릭터: {league_char}\n챔피언 달성 시 획득 가능한 특별한 포켓몬입니다!")

def handle_palpark(sender, chat):
    """Handle Pal Park command (@팔파크)"""
    # TODO: Implement Pal Park
    chat.reply(f"@{sender}\n팔파크 기능은 준비 중입니다.")

def handle_getzskill(sender, chat):
    """Handle Z-Skill command (@Z기술)"""
    # TODO: Implement Z-Skill
    chat.reply(f"@{sender}\nZ기술 기능은 준비 중입니다.")
