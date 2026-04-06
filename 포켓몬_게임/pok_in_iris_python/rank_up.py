# Module 7: Rank Up (Ball upgrades, trainer rank)
import math
from .config import SETTING, BALL_ARR, CMDS, BALL_INFO_LIST, TRAINER_RANK_DATA
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

    space = "\u200b"*500

    res = f"포켓몬스터 게임 볼 강화 목록\n{space}\n"

    for ball in BALL_INFO_LIST:
        res += f"[{ball['name']}]\n"
        res += f"업그레이드 비용: {ball['upgrade_cost']:,}\n"
        res += f"업그레이드에 필요한 포켓몬 발견 횟수: {ball['upgrade_succ']:,}\n"
        res += f"볼 1개당 가격: {ball['price_per_ball']:,}\n"
        res += f"야생 포켓몬 레벨: {ball['level_range'][0]}~{ball['level_range'][1]}\n"
        res += "추가 포획률\n"
        res += f"전설: +{ball['catch_bonus']['전설']}%\n"
        res += f"레어: +{ball['catch_bonus']['레어']}%\n"
        res += f"고급: +{ball['catch_bonus']['고급']}%\n"
        res += f"일반: +{ball['catch_bonus']['일반']}%\n"
        res += f"전설 포켓몬 출현률: +{ball['spawn_bonus']['전설']}%\n"
        res += f"??? 출현률: +{ball['spawn_bonus']['레어']}%\n"
        res += "\n"

    chat.reply(res)

def handle_title(sender, chat):
    """Handle trainer rank command (@트레이너등급)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    space = "\u200b"*500
    res = f"포켓몬스터 게임 트레이너 등급\n{space}\n"

    for rank in TRAINER_RANK_DATA:
        res += f"{rank['name']}\n"
        if rank['required'] > 0:
            res += f"포켓몬 {rank['required']}마리 포획성공 시 등급업\n"
        else:
            if rank['name'] == '신입 트레이너':
                res += f"포켓몬 {rank['required']}마리 포획성공 시 등급업\n"
            else:
                res += "최종 등급\n"

        res += f"추가 탐험 성공률: +{rank['success_bonus']}%\n"
        res += f"추가 포획 성공률: +{rank['catch_bonus']}%\n"
        res += f"최대 체력: {rank['max_hp']}\n"
        res += f"탐험 소요시간 단축: -{rank['time_reduction']}%\n"
        res += f"휴식시 {rank['rest_interval']}초마다 체력 1 회복\n"
        res += "\n"

    chat.reply(res)

def handle_ball_purchase(sender, chat, args=None):
    """Handle ball purchase command (@볼구매)"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    # Parse quantity
    parts = args.split() if args else []
    if len(parts) < 1:
        chat.reply(f'@{sender}\n사용법: {CMDS["ball"]} [개수]')
        return

    try:
        quantity = int(parts[0])
    except:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    if quantity < 1:
        chat.reply(f'@{sender}\n잘못 입력하셨습니다.')
        return

    current_ball = pokUser.get("Ball", BALL_ARR[0])
    ball_idx = BALL_ARR.index(current_ball)

    # Calculate price with discount
    base_price = SETTING["ballPrice"][ball_idx]
    discount = pokUser.get("balldc", 0)
    price = math.ceil(base_price * (100 - discount) / 100)
    total_price = price * quantity

    if pokUser.get("gold", 0) < total_price:
        chat.reply(f"@{sender}\n골드가 부족해요!\n{current_ball} {quantity}개 가격: {total_price:,}G (할인 {discount}% 적용)\n보유 골드: {pokUser.get('gold', 0):,}")
        return

    if pokUser.get("balls", 0) + quantity > SETTING["maxball"]:
        remaining = SETTING["maxball"] - pokUser.get("balls", 0)
        chat.reply(f"@{sender}\n볼이 최대치({SETTING['maxball']}개)예요!\n최대 {remaining}개 더 구매할 수 있어요.")
        return

    # Purchase
    pokUser["gold"] -= total_price
    pokUser["balls"] = pokUser.get("balls", 0) + quantity

    write_json(f"player_{sender}", pokUser)

    chat.reply(f"@{sender}\n{current_ball} {quantity}개 구매!\n-{total_price:,}G, 현재 볼: {pokUser['balls']}개")
