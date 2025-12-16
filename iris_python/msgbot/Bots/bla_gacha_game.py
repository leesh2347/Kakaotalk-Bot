from PIL import Image, ImageDraw, ImageFont
import io
import json
import os
import random

# banned_rooms.json의 절대 경로 계산
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # msgbot/
FILTER_FILE = os.path.join(BASE_DIR, "banned_rooms.json")

BLUE_ARCHIVE_GACHA_CHARS = [
    "가바키", "나기사", "나츠", "네루", "노아", "노조미", "돌쿠라코", "드아루", "드아코", "드요코", "드히나", "라로코", "레이사", "레이조", "렌게", "루미", "리오",
    "마리나", "마시로", "마코토", "마키", "메구", "메도리", "메루", "메리스", "메모이", "모에", "미나", "미네", "미노리", "미도리", "미모리", "미사키", "미야코", "미유", "미카",
    "바네루", "바스나", "바카네", "바카린", "밴시미", "밴즈사", "사사야", "사야", "사오리", "사쿠라코", "사키", "세나", "수나코", "수나타", "수노미", "수로코", "수모리", "수모에",
    "수부키", "수사키", "수시노", "수시로", "수야코", "수오리", "수요리", "수우이", "수이미", "수즈나", "수즈사", "수치세", "수카모", "수칸나", "수후미", "수히나", "슈에링", "슌",
    "스미레", "시구레", "시로코", "싸오리", "아루", "아리스", "아마리", "아즈사", "아츠코", "아코", "어과초 미사카미코토", "어과초 쇼쿠호미사키", "에이미", "온구레", "온나츠", "온도카", "와카모", "우이",
    "운루나", "운마리", "운유카", "운타하", "유즈", "유카리", "응토리", "이오리", "이즈나", "이즈미", "이치카", "임시노", "정루나", "정루카", "정리카", "정요코", "정우카", "정츠키",
    "정카리", "체리노", "츠루기", "츠쿠요", "치히로", "카린", "카스미", "카에데", "카즈사", "카호", "칸나", "캠타마", "캠하레", "코유키", "코코나", "코하루", "쿠로코", "클리나",
    "키라라", "키사키", "키쿄", "토키", "하루나", "호시노", "히나", "히나타", "히마리", "히비키", "히요리", "히카리", "히후미"
]


# JSON 파일 로드
with open(FILTER_FILE, "r", encoding="utf-8") as f:
    filter_data = json.load(f)

# 금지 방 목록 로드
BANNED_PLAY_ROOMS = filter_data["banrooms"]["play"]

def get_image_bytes(image_url):
    # 2. 이미지 로드
    img = Image.open(image_url).convert("RGBA")

    # 4. 전송할 BytesIO 형태로 변환
    img_bytes = io.BytesIO()
    img.save(img_bytes, format="PNG")
    img_bytes = io.BytesIO(img_bytes.getvalue())

    return img_bytes

def handle_message(chat):

    if chat.room.name in BANNED_PLAY_ROOMS:
        return
    #재미요소 금지 방 필터

    if chat.message.command == 'ㅁㄹㄱㅊ' or chat.message.command == 'ㅁㄺㅊ' or chat.message.command == '몰루가챠':
        try:

            rand = random.randint(1, len(BLUE_ARCHIVE_GACHA_CHARS))
            char_name = BLUE_ARCHIVE_GACHA_CHARS[rand]
            img_url = f"res/img/blue_archive_gatcha_imgs/{char_name}.jpg"

            img_bytes = get_image_bytes(img_url)
            
            chat.reply_media(img_bytes)

        except Exception as e:
            chat.reply(f"오류 발생: {e}")
