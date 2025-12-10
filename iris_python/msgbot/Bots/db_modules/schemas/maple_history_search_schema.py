from pydantic import BaseModel
from typing import Optional

class MapleHistorySearchBase(BaseModel):
    history_search_key: str
    nick: str
    date: str
    level: int

class MapleHistorySearchCreate(MapleHistorySearchBase):
    # 유저 생성 시 필요한 추가 필드가 있으면 여기에
    #password: str
    pass

class MapleHistorySearchSchema(MapleHistorySearchBase):
    #user_id: int

    class Config:
        orm_mode = True