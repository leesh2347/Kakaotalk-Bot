from pydantic import BaseModel
from typing import Optional

class RoomBase(BaseModel):
    room_code: str
    room_name: str

class RoomCreate(RoomBase):
    # 유저 생성 시 필요한 추가 필드가 있으면 여기에
    #password: str
    pass

class RoomSchema(RoomBase):
    #user_id: int

    class Config:
        orm_mode = True