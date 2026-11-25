#Entity 대응
from sqlalchemy import Column, Integer, String, Text
from msgbot.Bots.db_modules.db import Base

class MapleUserEntity(Base):
    __tablename__ = "maple_user_tbl" 

    user_key = Column("user_key", String(100), primary_key=True)
    user_nickname = Column("user_nickname", String(100), nullable=True)
    room_name = Column("room_name", String(100), nullable=True)
    user_apikey = Column("user_apikey", String(100), nullable=True)
    user_default_character = Column("user_default_character", String(100), nullable=True)
