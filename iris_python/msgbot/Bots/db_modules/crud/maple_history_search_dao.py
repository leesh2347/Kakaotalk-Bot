from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func

from msgbot.Bots.db_modules.models.maple_history_search_entity import MapleHistorySearchEntity
from msgbot.Bots.db_modules.schemas.maple_history_search_schema import MapleHistorySearchCreate

def get_by_history_search_key(db: Session, history_search_key: str) -> Optional[MapleHistorySearchEntity]:
    return (
        db.query(MapleHistorySearchEntity)
        .filter(MapleHistorySearchEntity.history_search_key == history_search_key)
        .first()
    )

def get_by_nick_and_date(db: Session, nick: str , date: str) -> Optional[MapleHistorySearchEntity]:
    return (
        db.query(MapleHistorySearchEntity)
        .filter(MapleHistorySearchEntity.nick == nick, MapleHistorySearchEntity.date == date)
        .first()
    )

def get_by_nick_order_by_date_desc(
    db: Session, nick: str
) -> List[MapleHistorySearchEntity]:
    return (
        db.query(MapleHistorySearchEntity)
        .filter(MapleHistorySearchEntity.nick == nick)
        .order_by(MapleHistorySearchEntity.date.desc())
        .all()
    )

def get_by_nick_order_by_level_asc(
    db: Session, nick: str
) -> List[MapleHistorySearchEntity]:
    return (
        db.query(MapleHistorySearchEntity)
        .filter(MapleHistorySearchEntity.nick == nick)
        .order_by(MapleHistorySearchEntity.level.asc())
        .all()
    )

def delete_by_nick_and_date(db: Session, nick: str, date: str) -> int:
    rows = (
        db.query(MapleHistorySearchEntity)
        .filter(MapleHistorySearchEntity.nick == nick, MapleHistorySearchEntity.date == date)
        .delete()
    )
    db.commit()
    return rows