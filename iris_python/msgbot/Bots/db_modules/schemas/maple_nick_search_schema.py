from pydantic import BaseModel
from typing import Optional

class MapleNickSearchBase(BaseModel):
    nick_search_key: str
    sender: str
    nick: str
    count: int

class MapleNickSearchCreate(MapleNickSearchBase):
    # 유저 생성 시 필요한 추가 필드가 있으면 여기에
    #password: str
    pass

class MapleNickSearchSchema(MapleNickSearchBase):
    #user_id: int

    class Config:
        orm_mode = True
