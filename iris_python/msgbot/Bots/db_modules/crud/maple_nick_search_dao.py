from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func

from msgbot.Bots.db_modules.models.maple_nick_search_entity import MapleNickSearchEntity
from msgbot.Bots.db_modules.schemas.maple_nick_search_schema import MapleNickSearchCreate

def get_by_nick_search_key(db: Session, nick_search_key: str) -> Optional[MapleNickSearchEntity]:
    return (
        db.query(MapleNickSearchEntity)
        .filter(MapleNickSearchEntity.nick_search_key == nick_search_key)
        .first()
    )

def get_by_sender_and_nick(db: Session, sender: str , nick: str) -> Optional[MapleNickSearchEntity]:
    return (
        db.query(MapleNickSearchEntity)
        .filter(MapleNickSearchEntity.sender == sender, MapleNickSearchEntity.nick == nick)
        .first()
    )

def get_by_sender_order_by_count_desc(
    db: Session, sender: str
) -> List[MapleNickSearchEntity]:
    return (
        db.query(MapleNickSearchEntity)
        .filter(MapleNickSearchEntity.sender == sender)
        .order_by(MapleNickSearchEntity.count.desc())
        .all()
    )

def delete_by_sender_and_nick(db: Session, sender: str, nick: str) -> int:
    rows = (
        db.query(MapleNickSearchEntity)
        .filter(MapleNickSearchEntity.sender == sender, MapleNickSearchEntity.nick == nick)
        .delete()
    )
    db.commit()
    return rows