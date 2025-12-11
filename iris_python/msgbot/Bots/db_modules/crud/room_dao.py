from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func

from msgbot.Bots.db_modules.models.room_entity import RoomEntity
from msgbot.Bots.db_modules.schemas.room_schema import RoomCreate

def get_by_room_code(db: Session, room_code: str) -> Optional[RoomEntity]:
    return (
        db.query(RoomEntity)
        .filter(RoomEntity.room_code == room_code)
        .first()
    )

def get_by_room_name(db: Session, room_name: str) -> Optional[RoomEntity]:
    return (
        db.query(RoomEntity)
        .filter(RoomEntity.room_name == room_name)
        .first()
    )