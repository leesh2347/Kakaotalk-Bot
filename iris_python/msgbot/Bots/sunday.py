import requests
import json
import re
from datetime import date, timedelta, datetime
from urllib import parse
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import comma
from msgbot.bot_commands.commands_config import PREXIX_EVENTS, PREXIX_SUNDAY

#api 검색
def search_maple_api(url):
    headers = {
        "Content-Type": "application/json",
        "x-nxopen-api-key": "live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59"
    }
    res = requests.get(url, headers=headers)
    res.raise_for_status()     # 200이 아니면 에러
    s2 = json.loads(res.text)
    return s2


def get_events():
    try:
        t = search_maple_api("https://open.api.nexon.com/maplestory/v1/notice-event")
        events_list = t["event_notice"]

        res_arr = []

        today = date.today()

        for i in range(0, len(events_list)):
            event_title = events_list[i]["title"]
            event_url = events_list[i]["url"]
            event_start = events_list[i]["date_event_start"]
            event_end = events_list[i]["date_event_end"]

            event_start_dt = datetime.fromisoformat(event_start)
            event_end_dt = datetime.fromisoformat(event_end)
            start_fmt = event_start_dt.strftime("%Y.%m.%d")
            end_fmt = event_end_dt.strftime("%Y.%m.%d")

            #종료된 이벤트이면 끝내기
            if event_end_dt.date() < today:
                break
            else:
                res = f'{event_title}\n({start_fmt} ~ {end_fmt})\n{event_url}'
                res_arr.append(res)
        return f'메이플 진행중인 이벤트 목록\n\n{("\n\n").join(res_arr)}'

            
    except Exception as e:
        return "API 오류"

def get_sunday():
    try:
        t = search_maple_api("https://open.api.nexon.com/maplestory/v1/notice-event")
        events_list = t["event_notice"]

        today = date.today()

        is_sunday = 0
        cleaned_url = ""

        for i in range(0, len(events_list)):
            event_title = events_list[i]["title"]
            if "썬데이" in event_title:
                event_id = events_list[i]["notice_id"]

                sunday_maple_info = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/notice-event/detail?notice_id={event_id}")

                img_regex = r'<img[^>]+src="([^"]+)"'
                match = re.search(img_regex, str(sunday_maple_info))
                if match:
                    img_url = match.group(1)
                    cleaned_url = img_url.replace('\\&quot;', '')

                is_sunday = 1
                break

        if is_sunday == 1:
            return cleaned_url
        else:
            return "썬데이 메이플 공개 시간이 아닙니다."
            
    except Exception as e:
        return "API 오류"


def handle_message(chat):
    if any(prefix in chat.message.msg for prefix in PREXIX_EVENTS):
        res = get_events()
        chat.reply(res)

    if any(prefix in chat.message.msg for prefix in PREXIX_SUNDAY):
        res = get_sunday()
        chat.reply(res)
