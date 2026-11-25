from pydantic import BaseModel
from typing import Optional

class MapleUserBase(BaseModel):
    user_key: str
    user_nickname: str
    room_name: str
    user_apikey: str
    user_default_character: str

class MapleUserCreate(MapleUserBase):
    # 유저 생성 시 필요한 추가 필드가 있으면 여기에
    #password: str
    pass

class MapleUserSchema(MapleUserBase):
    #user_id: int

    class Config:
        orm_mode = True