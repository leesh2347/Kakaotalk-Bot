import json
import base64
from pathlib import Path
import os
from datetime import date, timedelta

from msgbot.Bots.db_modules.db import get_db

from msgbot.Bots.db_modules.schemas.maple_nick_search_schema import MapleNickSearchSchema, MapleNickSearchCreate
from msgbot.Bots.db_modules.models.maple_nick_search_entity import MapleNickSearchEntity

from msgbot.Bots.db_modules.crud import maple_nick_search_dao
from msgbot.Bots.db_modules.crud.common import save

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MAPLE_LOG_FILE = os.path.join(BASE_DIR, "maplelog.json")
MAPLE_HISTORY_DB_FILE = os.path.join(BASE_DIR, "db_level.json")

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



def _load_data(dirname: str) -> dict:
    path = Path(dirname)
    if not path.exists():
        return {}
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}


def _save_data(dirname: str, data: dict) -> None:
    path = Path(dirname)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)


def recordnick(sender: str, nick: str) -> None:
    db_gen = get_db()  # get_db()는 generator(yield)라 가정
    db: Session = next(db_gen)

    try:
        # DAO 사용

        nick_search_entity = maple_nick_search_dao.get_by_sender_and_nick(db, sender, nick)

        nick_search_dict = {}

        if not nick_search_entity:
            converted_sender = base64.urlsafe_b64encode(sender.encode()).decode().rstrip("=")
            nick_search_key = f"{converted_sender}_{nick}"

            h = MapleNickSearchEntity(
                nick_search_key=nick_search_key,
                sender=sender,
                nick=nick,
                count=1
            )

            save(db, h)
            nick_search_dict = {
                "nick_search_key": nick_search_key,
                "sender": sender,
                "nick": nick,
                "count": 0
            }

        else:
            # 4) SQLAlchemy 객체를 그대로 JSON으로 못 내보내니까 dict로 변환
            nick_search_dict = {
                "nick_search_key": getattr(nick_search_entity, "nick_search_key", None),
                "sender": getattr(nick_search_entity, "sender", None),
                "nick": getattr(nick_search_entity, "nick", None),
                "count": getattr(nick_search_entity, "count", None)
            }

        nick_search_dict["count"] = nick_search_dict["count"] + 1

        h2 = MapleNickSearchEntity(
            nick_search_key=nick_search_dict["nick_search_key"],
            sender=nick_search_dict["sender"],
            nick=nick_search_dict["nick"],
            count=nick_search_dict["count"]
        )

        save(db, h2)
    except Exception as e:
        print(e)



def recommendnick(sender: str) -> str:
    rd = _load_data(MAPLE_LOG_FILE)

    if sender not in rd or not isinstance(rd[sender], dict) or not rd[sender]:
        return ""

    result = []
    for i, cnt in rd[sender].items():
        result.append(f"{i}/{cnt}")

    result.sort(key=lambda s: int(s.split("/")[1]), reverse=True)

    n = result[0].split("/")[0]
    return n

def history_db_save(nick, lev, date):
    rd = _load_data(MAPLE_HISTORY_DB_FILE)

    if nick not in rd or not isinstance(rd[nick], dict):
        rd[nick] = {}
    
    if "lev" not in rd[nick]:
        rd[nick]["lev"] = []
    if "date" not in rd[nick]:
        rd[nick]["date"] = []

    recentlev = 0
    if len(rd[nick]["lev"]) > 0:
        recentlev = rd[nick]["lev"][len(rd[nick]["lev"])-1]
    
    if recentlev < lev:
        if len(rd[nick]["lev"]) > 6:
            del rd[nick]["lev"][0]
            del rd[nick]["date"][0]
        rd[nick]["lev"].append(lev)
        rd[nick]["date"].append(date)

        _save_data(MAPLE_HISTORY_DB_FILE, rd)


def history_db_load(nick):
    return _load_data(MAPLE_HISTORY_DB_FILE)

