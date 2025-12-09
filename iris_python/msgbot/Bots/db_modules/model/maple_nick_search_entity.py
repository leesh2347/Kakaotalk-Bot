#Entity 대응
from sqlalchemy import Column, Integer, String, Text
from msgbot.Bots.db_modules.db import Base

class MapleNickSearchEntity(Base):
    __tablename__ = "MAPLE_NICK_SEARCH_TBL" 

    nick_search_key = Column("nick_search_key", String(100), primary_key=True)
    sender = Column("sender", String(45), nullable=True)
    nick = Column("nick", String(45), nullable=True)
    count = Column("count", Integer, nullable=True)
