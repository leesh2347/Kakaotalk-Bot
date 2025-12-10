import json
import base64
from pathlib import Path
import os
from datetime import date, timedelta

from msgbot.Bots.db_modules.db import get_db

from msgbot.Bots.db_modules.schemas.maple_nick_search_schema import MapleNickSearchSchema, MapleNickSearchCreate
from msgbot.Bots.db_modules.schemas.maple_history_search_schema import MapleHistorySearchSchema, MapleHistorySearchCreate
from msgbot.Bots.db_modules.models.maple_nick_search_entity import MapleNickSearchEntity
from msgbot.Bots.db_modules.models.maple_history_search_entity import MapleHistorySearchEntity

from msgbot.Bots.db_modules.crud import maple_nick_search_dao, maple_history_search_dao
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
    finally:
        db_gen.close()



def recommendnick(sender: str) -> str:
    db_gen = get_db()  # get_db()는 generator(yield)라 가정
    db: Session = next(db_gen)

    try:

        dict_arr = []

        nick_search_arr = maple_nick_search_dao.get_by_sender_order_by_count_desc(db, sender)

        if nick_search_arr:
            for nick_search_entity in nick_search_arr:
                nick_search_dict = {
                    "nick_search_key": getattr(nick_search_entity, "nick_search_key", None),
                    "sender": getattr(nick_search_entity, "sender", None),
                    "nick": getattr(nick_search_entity, "nick", None),
                    "count": getattr(nick_search_entity, "count", None)
                }
                dict_arr.append(nick_search_dict)
            return dict_arr[0]["nick"]
        else:
            return ""
    except Exception as e:
        print(e)
    finally:
        db_gen.close()

def history_db_save(nick, lev, date):
    db_gen = get_db()  # get_db()는 generator(yield)라 가정
    db: Session = next(db_gen)

    try:
        dict_arr = []

        hist_search_key = f"{nick}_{date}"

        h = MapleHistorySearchEntity(
            history_search_key=hist_search_key,
            nick=nick,
            date=date,
            level=lev
        )

        save(db, h)

        hist_search_arr = maple_history_search_dao.get_by_nick_order_by_date_desc(db, nick)

        if hist_search_arr:
            for hist_search_entity in hist_search_arr:
                hist_search_dict = {
                    "history_search_key": getattr(hist_search_entity, "history_search_key", None),
                    "nick": getattr(hist_search_entity, "nick", None),
                    "date": getattr(hist_search_entity, "date", None),
                    "level": getattr(hist_search_entity, "level", None)
                }
                dict_arr.append(hist_search_dict)
            
            if len(dict_arr) > 7:
                nick_to_del = dict_arr[-1]["nick"]
                date_to_del = dict_arr[-1]["date"]

                isdel = maple_history_search_dao.delete_by_nick_and_date(db, nick_to_del, date_to_del)
                print(f"isdel:{isdel}")
        
    except Exception as e:
        print(e)
    finally:
        db_gen.close()


def history_db_load(nick):
    db_gen = get_db()  # get_db()는 generator(yield)라 가정
    db: Session = next(db_gen)

    try:
        dict_arr = []

        hist_search_arr = maple_history_search_dao.get_by_nick_order_by_date_desc(db, nick)

        if hist_search_arr:
            for hist_search_entity in hist_search_arr:
                hist_search_dict = {
                    "history_search_key": getattr(hist_search_entity, "history_search_key", None),
                    "nick": getattr(hist_search_entity, "nick", None),
                    "date": getattr(hist_search_entity, "date", None),
                    "level": getattr(hist_search_entity, "level", None)
                }
                dict_arr.append(hist_search_dict)


            print(f"histarr:{dict_arr}")

        return dict_arr

    except Exception as e:
        print(e)
    finally:
        db_gen.close()

