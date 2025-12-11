import base64
import os
from datetime import date, timedelta

from msgbot.Bots.db_modules.db import get_db

from msgbot.Bots.db_modules.schemas.room_schema import RoomSchema, RoomCreate
from msgbot.Bots.db_modules.models.room_entity import RoomEntity

from msgbot.Bots.db_modules.crud import room_dao
from msgbot.Bots.db_modules.crud.common import save

def record_room_info(room_code: str, room_name: str) -> None:
    db_gen = get_db()  # get_db()는 generator(yield)라 가정
    db: Session = next(db_gen)
    try:
        is_room_exist = room_dao.get_by_room_code(db, room_code)

        if not is_room_exist:
            h = RoomEntity(
                room_code=room_code,
                room_name=room_name
            )
            save(db, h)

    except Exception as e:
        print(e)
    finally:
        db_gen.close()
