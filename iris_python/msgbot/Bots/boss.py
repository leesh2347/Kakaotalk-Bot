import requests
import json
from datetime import date, timedelta
from urllib import parse
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import comma
from msgbot.Bots.maple_boss.boss_data import MAPLE_BOSS_DATA
from msgbot.bot_commands.commands_config import PREFIX_BOSS

def boss(bossname):
    if bossname in MAPLE_BOSS_DATA:
        s = ""
        boss_data = MAPLE_BOSS_DATA[bossname]
        for ii in boss_data["HP"]:
            s = s + f"{ii}: {boss_data['HP'][ii]}\n"
        levs = ""
        if isinstance(boss_data["level"],dict):
            for ii in boss_data["level"]:
                levs = levs + f"{ii}: Lv.{boss_data['level'][ii]}\n"
        else:
            levs = f"Lv.{boss_data['level']}"
        
        arc = ""

        if isinstance(boss_data["arcaneforce"],dict):
            arc = "어센틱포스:\n"
            for ii in boss_data["arcaneforce"]:
                arc = arc + f"{ii}: {boss_data['arcaneforce'][ii]}\n"
        else:
            if boss_data["arcaneforce"] != "":
                arc = f"아케인포스: {boss_data['arcaneforce']}"
        
        space = "\u200b"*500

        return "\n".join([
            f"[{boss_data['name']}]",
			"",
			levs,
			"HP:",
			s,
			f"방어율: {boss_data['defenseRate']}%",
			f"최소 입장 레벨: Lv.{boss_data['minLevel']}",
			f"데스카운트: {boss_data['deathCount']}",
			f"결정석 가격: {boss_data['bossCrystal']}",
			arc,
			space,
			"",
			"주요 보상:",
			"\n".join(boss_data['dropItem']),
			"",
			"Thanks to Lune"
        ])

    else:
        return "보스 이름이 제대로 입력되었는지 확인해 주세요.\n\n예시: !보스 카오스벨룸 (띄어쓰기 없이)\n※몇몇 축약어도 어느정도 인식합니다."
    


def handle_message(chat):
    if any(prefix in chat.message.msg for prefix in PREFIX_BOSS):
        parts = chat.message.msg.split(" ")
        if len(parts) > 1:
            bossname = parts[1]
        else:
            bossname = ""
        res = boss(bossname)
        chat.reply(res)
