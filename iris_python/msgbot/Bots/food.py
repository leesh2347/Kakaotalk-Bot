import json
import os

import random

# banned_rooms.json의 절대 경로 계산
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # msgbot/
FILTER_FILE = os.path.join(BASE_DIR, "banned_rooms.json")

# JSON 파일 로드
with open(FILTER_FILE, "r", encoding="utf-8") as f:
    filter_data = json.load(f)

# 금지 방 목록 로드
BANNED_PLAY_ROOMS = filter_data["banrooms"]["play"]

FOODS = ["짜장","짬뽕","오징어순대","파스타","멘보샤","마라탕","밥버거","편의점도시락","스페셜정식","츄르","창세의뱃지","찜닭","재획","모듬회","스테이크","치즈버거","김밥", "마라탕", "쌀국수", "칼국수", "매운닭발", "카이센동", "사케동","돈까스", "덮밥", "삼겹살", "갈매기살", "갈비", "치킨", "피자", "전", "김치찌개", "된장찌개", "해물찜", "갈비찜", "찜닭", "닭도리탕", "짜글이", "비빔밥", "쭈꾸미볶음", "제육볶음", "곱창", "감자탕", "냉면","소바", "쫄면", "떡볶이", "김치찜", "부대찌개", "탕수육","칠리새우", "크림새우", "샤브샤브", "닭갈비", "족발", "보쌈", "반반족발", "불족발", "랍스터", "튀김","메밀전병", "볶음밥", "샐러드", "리조또", "죽", "야끼소바", "오코노미야끼", "계란말이", "미역국", "생선구이", "마라샹궈", "훠궈", "모듬꼬치", "육회", "카레", "전골", "까수엘라", "조개구이", "라면", "초밥", "와플", "한정식", "북엇국","니가?먹어?왜?","먹이를주지마시오","코어젬스톤","응애나아기맘마줘응애","초이스아잉성형쿠폰","이게바로레기오로스의수염이라고","모코코씨앗","명륜진사갈비"]

def handle_message(chat):
    
    if chat.room.name in BANNED_PLAY_ROOMS:
        return

    if '뭐먹지' in chat.message.msg or 'ㅁㅁㅈ' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            if 1 < n < 11:
                res = []
                t = ""
                for i in range(1,n+1):
                    t = FOODS[random.randint(1, len(FOODS))-1]
                    res.append(t)
                chat.reply(f"{chat.sender.name}님의 추천 메뉴는\n\n{','.join(res)}")
        else:
            t = random.randint(1, len(FOODS))
            chat.reply(f"선택장애 {chat.sender.name}님!\n메뉴는 [{FOODS[t-1]}]입니다 ^.^")
