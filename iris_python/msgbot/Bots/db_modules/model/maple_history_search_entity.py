#Entity 대응
from sqlalchemy import Column, Integer, String, Text
from msgbot.Bots.db_modules.db import Base

class MapleHistorySearchEntity(Base):
    __tablename__ = "MAPLE_HISTORY_SEARCH_TBL" 

    history_search_key = Column("history_search_key", String(100), primary_key=True)
    nick = Column("nick", String(45), nullable=True)
    date = Column("date", String(45), nullable=True)
    level = Column("level", Integer, nullable=True)
