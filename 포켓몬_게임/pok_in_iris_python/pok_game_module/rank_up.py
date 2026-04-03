# Module 7: Rank Up (Ball upgrades, trainer rank)
import math
from .config import SETTING, BALL_ARR
from .io_helpers import read_json, write_json

def handle_ballup(sender, chat):
    """Handle ball upgrade command (@볼강화)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    current_ball = pokUser.get("Ball", BALL_ARR[0])
    current_idx = BALL_ARR.index(current_ball)
    
    if current_idx >= len(BALL_ARR) - 1:
        chat.reply(f"@{sender}\n이미 최대 강화 볼을 사용하고 있어요!")
        return
    
    # Check requirements
    required_succ = SETTING["ballupsucc"][current_idx]
    total_succ = pokUser.get("count", {}).get("succ", 0)
    
    if total_succ < required_succ:
        chat.reply(f"@{sender}\n볼 강화에는 포획 성공 {required_succ}회가 필요합니다.\n현재: {total_succ}회")
        return
    
    # Check cost
    cost = SETTING["ballupPrice"][current_idx]
    discount = pokUser.get("upgradedc", 0)
    cost = math.ceil(cost * (100 - discount) / 100)
    
    if pokUser.get("gold", 0) < cost:
        chat.reply(f"@{sender}\n골드가 부족해요!\n필요 골드: {cost:,} (할인 {discount}% 적용)\n보유 골드: {pokUser.get('gold', 0):,}")
        return
    
    # Upgrade
    pokUser["gold"] -= cost
    pokUser["Ball"] = BALL_ARR[current_idx + 1]
    
    # Update stats
    pokUser["stat"]["g5"] = SETTING["p"]["g5"] + SETTING["ballg5"][current_idx + 1]
    pokUser["stat"]["g4"] = SETTING["p"]["g4"] + SETTING["ballg4"][current_idx + 1]
    pokUser["stat"]["g3"] = SETTING["p"]["g3"] + SETTING["ballg3"][current_idx + 1]
    
    write_json(f"player_{sender}", pokUser)
    
    chat.reply(f"@{sender}\n볼을 {BALL_ARR[current_idx + 1]}(으)로 강화했어요!\n골드 {cost:,} 사용")

def handle_ballinfo(sender, chat):
    """Handle ball info command (@볼종류)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    current_ball = pokUser.get("Ball", BALL_ARR[0])
    current_idx = BALL_ARR.index(current_ball)
    
    res = f"@{sender} 현재 볼: {current_ball}\n\n"
    res += "[볼 종류]\n"
    
    for i, ball in enumerate(BALL_ARR):
        status = "◀ 현재" if i == current_idx else ""
        price = SETTING["ballPrice"][i] if i < len(SETTING["ballPrice"]) else 0
        succ_req = SETTING["ballupsucc"][i] if i < len(SETTING["ballupsucc"]) else 0
        res += f"{i+1}. {ball} - 가격: {price:,}G, 필요: {succ_req}회 {status}\n"
    
    chat.reply(res)

def handle_title(sender, chat):
    """Handle trainer rank command (@트레이너등급)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    current_rank = pokUser.get("rank", SETTING["rank"]["name"][0])
    current_idx = SETTING["rank"]["name"].index(current_rank)
    
    res = f"@{sender} 트레이너 등급\n"
    res += f"현재: {current_rank}\n"
    res += f"포획 성공: {pokUser.get('count', {}).get('succ', 0)}회\n\n"
    
    if current_idx < len(SETTING["rank"]["name"]) - 1:
        next_rank = SETTING["rank"]["name"][current_idx + 1]
        required = SETTING["rank"]["upif"][current_idx + 1]
        res += f"다음 등급: {next_rank}\n"
        res += f"필요 포획: {required}회"
    
    chat.reply(res)

def handle_ball_purchase(sender, chat):
    """Handle ball purchase command (@볼구매)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    current_ball = pokUser.get("Ball", BALL_ARR[0])
    ball_idx = BALL_ARR.index(current_ball)
    
    # Calculate price with discount
    base_price = SETTING["ballPrice"][ball_idx]
    discount = pokUser.get("balldc", 0)
    price = math.ceil(base_price * (100 - discount) / 100)
    
    if pokUser.get("gold", 0) < price:
        chat.reply(f"@{sender}\n골드가 부족해요!\n볼 가격: {price:,}G (할인 {discount}% 적용)\n보유 골드: {pokUser.get('gold', 0):,}")
        return
    
    if pokUser.get("balls", 0) >= SETTING["maxball"]:
        chat.reply(f"@{sender}\n볼이 최대치({SETTING['maxball']}개)예요!")
        return
    
    # Purchase
    pokUser["gold"] -= price
    pokUser["balls"] = pokUser.get("balls", 0) + 1
    
    write_json(f"player_{sender}", pokUser)
    
    chat.reply(f"@{sender}\n{current_ball} 1개 구매!\n-{price:,}G, 현재 볼: {pokUser['balls']}개")
