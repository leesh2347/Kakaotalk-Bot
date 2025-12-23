import requests
import json
from datetime import date, timedelta
from urllib import parse
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import comma
from msgbot.bot_commands.commands_config import PREFIX_MESPI

MESPI_SYMBOLS = ["브론즈","실버","골드","다이아"]
MESPI_ICONS = ["🟤","⚪","🟡","🪩"]

#api 검색
def search_meaegi_api(symbols):

    worldtype = parse.quote("일반")

    url = f"https://api.meaegi.com/api/maplestory/token-exchange?name={parse.quote(symbols)}&worldType={worldtype}&size=1"

    res = requests.get(url)
    res.raise_for_status()     # 200이 아니면 에러
    s2 = json.loads(res.text)
    return s2


def mespi():
    try:
        a = ""
        res = ""
        today = 0
        yesterday = 0
        diff = 0
        for i in range(0, len(MESPI_SYMBOLS)):
            a = search_meaegi_api(MESPI_SYMBOLS[i])
            today = int(a[0]["close"])
            yesterday = int(a[0]["open"])
            diff = today - yesterday

            if diff < 0:
                res = res + f"\n\n[{MESPI_ICONS[i]}{MESPI_SYMBOLS[i]}\n{comma(today)}메소\n▼{comma(-diff)}({round(((diff / yesterday) * 100),2)}%)"
            else:
                res = res + f"\n\n[{MESPI_ICONS[i]}{MESPI_SYMBOLS[i]}\n{comma(today)}메소\n🔺{comma(diff)}({round(((diff / yesterday) * 100),2)}%)"

        return f"오늘의 주화 가격입니다.\n매일 오전 10시 10분 이후 갱신됩니다.{res}"


    except Exception as e:
        return f"메스피 API에 문제가 발생했습니다.{e}"


def handle_message(chat):
    if chat.message.msg in PREFIX_MESPI:
        res = mespi()
        chat.reply(res)
