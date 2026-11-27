import requests
import json
from datetime import date, timedelta
from urllib import parse
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import record_user_default_nick, record_user_info, comma
from msgbot.bot_commands.commands_config import PREFIX_NICKSKIP


def set_nickskip(nick, sender, room):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        try:
            record_user_default_nick(sender, room, nick)

            return "\n".join([
                "수동 닉스킵 등록 완료!",
                f"방 이름: {room}",
                f"유저 이름: {sender}",
                f"닉네임: {nick}",
                "※수동 닉스킵 등록은 방 별로 적용됩니다."
            ])

        except Exception as e:
            return "\n".join([
                "닉스킵 등록 중 오류가 발생했습니다. 입력을 다시 한 번 확인해 주세요.",
                f"방 이름: {room}",
                f"유저 이름: {sender}",
                f"닉네임: {nick}",
                "※수동 닉스킵 등록은 방 별로 적용됩니다."
            ])


def handle_message(chat):
    if any(prefix in chat.message.msg for prefix in PREFIX_NICKSKIP):
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            chat.reply("[루시] 등록할 닉네임을 입력해 주세요.")
        else:
            nick = parts[1]
            res = set_nickskip(nick, chat.sender.name, chat.room.name)
            chat.reply(res)
