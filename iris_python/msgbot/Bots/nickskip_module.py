import json
from pathlib import Path
import os
from datetime import date, timedelta

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MAPLE_LOG_FILE = os.path.join(BASE_DIR, "maplelog.json")

def comma(num) -> str:
    try:
        # 숫자로 변환 가능한 값만 , formatting
        num = float(num)
        # 정수는 정수 포맷, 실수는 소수 유지
        if num.is_integer():
            return format(int(num), ",")
        return format(num, ",")
    except (ValueError, TypeError):
        # 숫자가 아닌 경우 그냥 반환
        return str(num)

def get_yesterday_date():
    today = date.today()
    # 어제
    d = today - timedelta(days=1)
    # "YYYY-MM-DD" 형태로 포맷
    d2 = d.strftime("%Y-%m-%d")

    return d2

def _load_data() -> dict:
    path = Path(MAPLE_LOG_FILE)
    if not path.exists():
        return {}
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}


def _save_data(data: dict) -> None:
    path = Path(MAPLE_LOG_FILE)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)


def recordnick(sender: str, nick: str) -> None:
    rd = _load_data()

    if sender not in rd or not isinstance(rd[sender], dict):
        rd[sender] = {}

    rd[sender][nick] = rd[sender].get(nick, 0) + 1

    # 가장 많이 사용된 nick 찾기
    n = ""
    temparr = []
    for i, cnt in rd[sender].items():
        temparr.append(f"{i}/{cnt}")

    if temparr:
        temparr.sort(key=lambda s: int(s.split("/")[1]), reverse=True)
        n = temparr[0].split("/")[0]

    if rd[sender][nick] > 30 and nick == n:
        rd[sender] = {}
        rd[sender][nick] = 2

    _save_data(rd)


def recommendnick(sender: str) -> str:
    rd = _load_data()

    if sender not in rd or not isinstance(rd[sender], dict) or not rd[sender]:
        return ""

    result = []
    for i, cnt in rd[sender].items():
        result.append(f"{i}/{cnt}")

    result.sort(key=lambda s: int(s.split("/")[1]), reverse=True)

    n = result[0].split("/")[0]
    return n