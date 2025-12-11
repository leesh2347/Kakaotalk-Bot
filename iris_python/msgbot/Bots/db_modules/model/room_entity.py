#Entity 대응
from sqlalchemy import Column, Integer, String, Text
from msgbot.Bots.db_modules.db import Base

class RoomEntity(Base):
    __tablename__ = "ROOMS_TBL" 

    room_code = Column("room_code", String(100), primary_key=True)
    room_name = Column("room_name", String(100), nullable=True)
