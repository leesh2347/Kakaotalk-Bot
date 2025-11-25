import random
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
import os

# banned_rooms.json의 절대 경로 계산
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # msgbot/
FILTER_FILE = os.path.join(BASE_DIR, "banned_rooms.json")

# JSON 파일 로드
with open(FILTER_FILE, "r", encoding="utf-8") as f:
    filter_data = json.load(f)

# 금지 방 목록 로드
BANNED_PLAY_ROOMS = filter_data["banrooms"]["play"]

#전역변수
ans = ""
ans_fake = ""
start_time = None
is_playing = 0
playingroom = ""

#네이버 명언 크롤링
def search_naver_sentences():
    
    url = "https://m.search.naver.com/search.naver?sm=top_hty&fbm=0&ie=utf8&query=명언"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    res = requests.get(url, headers=headers)
    res.raise_for_status()     # 200이 아니면 에러
    soup = BeautifulSoup(res.text, "lxml")
    # jsoup의 .select(...) 에 해당 (CSS 선택자 그대로 사용 가능)
    elem = soup.select("div._front")
    
    box = []
    elem2 = ""
    elem3 = ""
    for div in elem:
        elem2 = div.select_one("p.text_ko").get_text(strip=True)
        elem3 = div.select_one("span.name").get_text(strip=True)
        box.append(elem2)
    
    res = box[random.randint(0, len(box)-1)]

    return res
    
    # jsoup의 .text() 에 해당
    if elem:
        return elem.get_text(strip=True)

def handle_message(chat):
    global ans, ans_fake, start_time, is_playing, playingroom

    if chat.room.name in BANNED_PLAY_ROOMS:
        return
    #재미요소 금지 방 필터

    if chat.message.msg == "@타자게임" or chat.message.msg == "!타자게임":
        if is_playing == 1:
            chat.reply("[루시] 이미 이 방 또는 다른 방에서 진행 중인 게임이 있습니다.")
        else:
            ans = search_naver_sentences()
            ans_fake = " \u200b".join(ans.split(" "))
            start_time = datetime.now()
            is_playing = 1
            playingroom = chat.room.name
            chat.reply(f"[루시] 타자게임을 시작합니다!\n\n제시된 문장: {ans_fake}")
                
    if is_playing == 1 and chat.room.name == playingroom:
        n = datetime.now()
        playtime = int((n-start_time).total_seconds())
        if chat.message.msg == ans:
            is_playing = 0
            playingroom = ""
            start_time = None
            chat.reply(f"[루시] {chat.sender.name}님이 정답을 입력하셨습니다!\n\n걸린 시간: {playtime}초")

        if playtime > 120:
            is_playing = 0
            playingroom = ""
            start_time = None
            chat.reply("[루시] 정답을 입력하지 않은 채로 2분이 지나 타자게임이 종료됩니다.")