import random
import json
import io
import os
import numpy as np
from collections import Counter

# banned_rooms.json의 절대 경로 계산
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # msgbot/
FILTER_FILE = os.path.join(BASE_DIR, "banned_rooms.json")

DATA_PATH = os.path.join(BASE_DIR, "slotmachine_data.json")

# JSON 파일 로드
with open(FILTER_FILE, "r", encoding="utf-8") as f:
    filter_data = json.load(f)

# 금지 방 목록 로드
BANNED_PLAY_ROOMS = filter_data["banrooms"]["play"]

# -----------------------------
# 설정
# -----------------------------

# 1~9에 해당하는 아이콘
ICON_TABLE = {
    1: "🐼",   # 판다(Wild)
    2: "💰",   # 복주머니
    3: "🍒",
    4: "🍊",
    5: "🍇",
    6: "🤡",
    7: "🕌",
    8: "🌞",
    9: "⛱️"
}

PANDA = "🐼"
BAG = "💰"


NUMBER_PAY = {
    3: 5,
    4: 20,
    5: 50,
    6: 100,
    7: 300,
    8: 1000,
    9: 3000,
    10: 10000,
    11: 50000,
    12: 100000
}

BAG_PAY = {
    3: 10,
    4: 30,
    5: 80,
    6: 200,
    7: 500,
    8: 2000,
    9: 5000,
    10: 20000,
    11: 100000,
    12: 500000
}

# 숫자 범위
NUMBERS = [f"{i:02}" for i in range(100)]      # 00~99


def read_json(res=None):
    """Read from JSON file. Handles both standard JSON and bare key:value formats."""
    file_path = DATA_PATH
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if res:
            return data.get(res)
        return data
    except json.JSONDecodeError:
        pass
    except FileNotFoundError:
        return None

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
        if content and not content.startswith('{') and not content.startswith('['):
            content = '{' + content + '}'
            data = json.loads(content)
            if res:
                return data.get(res)
            return data
    except (json.JSONDecodeError, FileNotFoundError):
        pass
    return None

def write_json(data):
    """Write to JSON file"""
    try:
        file_path = DATA_PATH
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error writing {DATA_PATH}: {e}")
        return False


# -----------------------------
# 슬롯 한 칸 생성
# -----------------------------

def generate_cell():

    value = random.randint(1, 10)

    if value == 10:
        # 숫자칸
        return random.choice(NUMBERS)

    return ICON_TABLE[value]


# -----------------------------
# 슬롯 생성
# -----------------------------

def spin():

    return [generate_cell() for _ in range(12)]


# -----------------------------
# 출력
# -----------------------------

def print_board(board):
    board_res = ""

    for i in range(0, 12, 4):
        board_res += " ".join(f"{str(x):>3}" for x in board[i:i+4]) + "\n"

    return board_res.rstrip()



# -----------------------------
# 당첨 판정
# -----------------------------

def consecutive_number(line):
    longest = 0
    current = 0

    for x in line:
        if x in NUMBERS or x == PANDA:
            current += 1
            longest = max(longest, current)
        else:
            current = 0

    return longest
    
def consecutive_bag(line):
    longest = 0
    current = 0

    for x in line:
        if x == BAG or x == PANDA:
            current += 1
            longest = max(longest, current)
        else:
            current = 0

    return longest

def check_result(board, bet):

    # 검사할 라인
    lines = []

    # 가로
    for r in range(3):
        lines.append(board[r*4:(r+1)*4])

    # 세로
    for c in range(4):
        lines.append([board[c], board[c+4], board[c+8]])

    best_number_count = 0
    best_bag_count = 0

    best_number_line = None
    best_bag_line = None

    jackpot77 = False

    # --------------------------
    # 라인 검사
    # --------------------------
    for line in lines:

        number_cnt = consecutive_number(line)
        bag_cnt = consecutive_bag(line)

        if number_cnt >= 3 and number_cnt > best_number_count:
            best_number_count = number_cnt
            best_number_line = line[:]

        if bag_cnt >= 3 and bag_cnt > best_bag_count:
            best_bag_count = bag_cnt
            best_bag_line = line[:]

    number_reward = NUMBER_PAY.get(best_number_count, 0)
    bag_reward = BAG_PAY.get(best_bag_count, 0)

    t = "\n"
    profit = 0

    if number_reward == 0 and bag_reward == 0:

        profit = -bet
        t += "꽝!\n"
        t += f"-{bet} 크레딧"

    else:

        if number_reward >= bag_reward:

            prize = bet * number_reward

            # --------------------------
            # 777 JACKPOT
            # 연속 숫자 라인이 모두 77 또는 판다인지 검사
            # --------------------------
            if best_number_line is not None:

                if all(x == "77" or x == PANDA for x in best_number_line):
                    jackpot77 = True
                    prize *= 10

            t += "★★ 숫자 당첨 ★★\n"
            t += f"연속 숫자 : {best_number_count}칸\n"
            t += f"{number_reward}배 당첨!\n"

            if jackpot77:
                t += "🎰🎰 777 JACKPOT!! 🎰🎰\n"
                t += "77 라인 완성! 상금 10배!\n"

        else:

            prize = bet * bag_reward

            t += "★★ 복주머니 당첨 ★★\n"
            t += f"연속 복주머니 : {best_bag_count}칸\n"
            t += f"{bag_reward}배 당첨!\n"

        profit = prize - bet

        t += f"획득 : {prize} 크레딧\n"
        t += f"순이익 : +{profit} 크레딧"

    return {
        "profit": profit,
        "text": t
    }

# -----------------------------
# 실행
# -----------------------------

def handle_message(chat):

    if chat.room.name in BANNED_PLAY_ROOMS:
            return
    #재미요소 금지 방 필터

    if chat.message.msg == '@슬롯머신도움말' or chat.message.msg == '!슬롯머신도움말':
        chat.reply("\n".join([
            "루시 슬롯머신 게임",
            "",
            "게임 시작: @슬롯머신",
            "실제 마카오 카지노에 있는 슬롯머신의 룰을 기반으로 구현했습니다.",
            "합법적이고 건전하게 카지노의 게임을 체험해 보세요!",
            "",
            "※본 게임의 그 어느 보상도 현물 재화 환급은 절대 없습니다.",
            "※현물 재화를 걸고 하는 도박은 불법입니다. 가급적 실제 카지노에 가진 마시고 여기서만 건전하게 즐깁시다!",
            "",
            "자세한 게임 룰: 전체보기 클릭",
            "\u200b"*500,
            "3X4 칸으로 아이콘 또는 2자리 숫자가 각각 랜덤으로 나타납니다.",
            "숫자 종류 관계없이 연속 3칸 이상: 숫자 당첨",
            f"복주머니({BAG}): 연속 3칸 이상시 당첨",
            f"판다({PANDA}): 조커. 상황에 따라 숫자 또는 복주머니 판정이 될 수 있음.",
            "잭팟: 숫자 당첨 시, 모든 숫자가 7 또는 77로만 나타났을 시, 보상 x10배",
            "크레딧을 모두 잃을 시 게임 오버되며, 1000크레딧으로 초기화됩니다.",
            "베팅금 변경: @베팅금 (숫자)",
            "",
            "※실제 카지노에서 당첨금이 얼마 정도 가치인지 궁금하다면?",
            "크레딧에 x200을 곱하면 원화 기준 얼마의 가치일지 알 수 있습니다."
        ]))


    if chat.message.command == '@베팅금' or chat.message.command == '!베팅금':
        slotData = read_json()
        if chat.sender.name not in slotData:
            slotData[chat.sender.name] = {
                "credit":1000,
                "bet":10
            }
            write_json(slotData)
        slotUser = slotData[chat.sender.name]
        credit = slotUser["credit"]
        if np.nan == credit: credit = 1000
        bet = slotUser["bet"]
        if np.nan == bet: bet = 10
        
        args = chat.message.msg.split(" ")
        if len(args) < 2:
            chat.reply("사용법: @베팅금 (숫자)")
        else:
            num = int(args[1])
            if 0 < num < credit:
                slotUser["bet"] = num
                write_json(slotData)
                chat.reply(f"@{chat.sender.name}\n베팅금 변경 완료!({num})")
            else:
                chat.reply("베팅금은 1 이상 총 잔고 이하 숫자로만 변경할 수 있습니다.")

    if chat.message.msg == '@슬롯머신' or chat.message.msg == '!슬롯머신':

        slotData = read_json()
        if chat.sender.name not in slotData:
            slotData[chat.sender.name] = {
                "credit":1000,
                "bet":10
            }
            write_json(slotData)
        
        
        slotUser = slotData[chat.sender.name]
        credit = slotUser["credit"]
        if np.nan == credit: credit = 1000
        bet = slotUser["bet"]
        if np.nan == bet: bet = 10
           

        res = ""

        res += f"현재 크레딧 : {credit}\n"
        res += f"베팅 : {bet}\n\n"

        board = spin()

        res += print_board(board)
        res += "\n"

        check_result_data = check_result(board, bet)

        credit += check_result_data["profit"]
        
        # 게임 오버
        if credit <= 0:
            res += "\n\n💀 GAME OVER 💀"
            res += "\n크레딧을 모두 잃었습니다."
            res += "\n1000 크레딧으로 자동 재시작합니다!"

            credit = 1000
        
        slotUser["credit"] = credit
        write_json(slotData)
        
        res += check_result_data["text"]

        res += f"\n\n현재 보유 크레딧 : {credit}"

        chat.reply(f"@{chat.sender.name}\n{res}")


