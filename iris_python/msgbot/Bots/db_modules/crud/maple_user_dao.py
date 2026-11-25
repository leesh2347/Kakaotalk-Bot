from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func

from msgbot.Bots.db_modules.models.maple_user_entity import MapleUserEntity
from msgbot.Bots.db_modules.schemas.maple_user_schema import MapleUserCreate

def get_by_user_key(db: Session, user_key: str) -> Optional[MapleUserEntity]:
    return (
        db.query(MapleUserEntity)
        .filter(MapleUserEntity.user_key == user_key)
        .first()
    )

def get_by_nickname_and_roomname(db: Session, user_nickname: str , room_name: str) -> Optional[MapleUserEntity]:
    return (
        db.query(MapleUserEntity)
        .filter(MapleUserEntity.user_nickname == user_nickname, MapleUserEntity.room_name == room_name)
        .first()
    )

def get_by_roomname_order_by_count_desc(
    db: Session, room_name: str
) -> List[MapleUserEntity]:
    return (
        db.query(MapleUserEntity)
        .filter(MapleUserEntity.room_name == room_name)
        .order_by(MapleUserEntity.count.desc())
        .all()
    )

def delete_by_nickname_and_roomname(db: Session, user_nickname: str , room_name: str) -> int:
    rows = (
        db.query(MapleUserEntity)
        .filter(MapleUserEntity.user_nickname == user_nickname, MapleUserEntity.room_name == room_name)
        .delete()
    )
    db.commit()
    return rows