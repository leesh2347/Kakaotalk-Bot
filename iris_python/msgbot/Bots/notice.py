import json
import os
import requests
from bs4 import BeautifulSoup

# 데이터 파일 경로
NOTICE_FILE = os.path.join(os.path.dirname(__file__), 'notice_state.json')
RECENT_NOTICE_FILE = os.path.join(os.path.dirname(__file__), 'recent_notice.json')

# Nexon API 설정
NEXON_API_URL = "https://open.api.nexon.com/maplestory/v1"
NEXON_API_KEY = "live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59"

from msgbot.bot_commands.commands_config import PREFIX_NOTICE

# 100 톡마다 공지 확인을 위한 카운터
notice_check_counter = 0


def load_notice_state():
    """공지 상태 딕셔너리를 JSON 파일에서 불러옴"""
    if os.path.exists(NOTICE_FILE):
        try:
            with open(NOTICE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return {}
    return {}


def save_notice_state(state):
    """공지 상태를 JSON 파일에 저장"""
    try:
        with open(NOTICE_FILE, 'w', encoding='utf-8') as f:
            json.dump(state, f, ensure_ascii=False, indent=2)
        return True
    except IOError:
        return False


def load_recent_notice():
    """최근 공지 ID 를 불러옴"""
    if os.path.exists(RECENT_NOTICE_FILE):
        try:
            with open(RECENT_NOTICE_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('recent_Notice_Id', 0)
        except (json.JSONDecodeError, IOError):
            return 0
    return 0


def save_recent_notice(notice_id):
    """최근 공지 ID 를 저장"""
    try:
        with open(RECENT_NOTICE_FILE, 'w', encoding='utf-8') as f:
            json.dump({'recent_Notice_Id': notice_id}, f, ensure_ascii=False, indent=2)
        return True
    except IOError:
        return False


def get_notice_list():
    """메이플스토리 공지사항 목록을 가져옴"""
    headers = {
        "Content-Type": "application/json",
        "x-nxopen-api-key": NEXON_API_KEY
    }
    res = requests.get(f"{NEXON_API_URL}/notice", headers=headers)
    res.raise_for_status()
    return res.json()


def get_notice_detail(notice_id):
    """특정 공지의 상세 내용을 가져옴"""
    headers = {
        "Content-Type": "application/json",
        "x-nxopen-api-key": NEXON_API_KEY
    }
    res = requests.get(f"{NEXON_API_URL}/notice/detail", params={"notice_id": notice_id}, headers=headers)
    res.raise_for_status()
    return res.json()


def clean_notice_content(html_content):
    """HTML 태그를 제거하고 텍스트만 추출"""
    cleaned = html_content.replace('\n', '')
    cleaned = cleaned.replace('<br>', '\n').replace('<br/>', '\n').replace('<br />', '\n')
    cleaned = cleaned.replace('</p>', '\n')
    cleaned = cleaned.replace('&nbsp;', ' ')
    cleaned = BeautifulSoup(cleaned, 'html.parser').get_text()
    return cleaned.strip()


def get_new_notice():
    """새로운 공지가 있는지 확인하고 메시지 생성"""
    try:
        recent_notice_id = load_recent_notice()
        notice_list = get_notice_list()

        if not notice_list.get('notice') or len(notice_list['notice']) == 0:
            return ""

        latest_notice_id = notice_list['notice'][0]['notice_id']

        if recent_notice_id != latest_notice_id:
            save_recent_notice(latest_notice_id)
            notice_detail = get_notice_detail(latest_notice_id)

            raw_content = str(notice_detail)
            cleaned = clean_notice_content(raw_content)

            # contents 필드 추출
            if 'contents":"' in cleaned:
                start_idx = cleaned.find('contents":"') + 11
                end_idx = cleaned.find('","date')
                if start_idx > 10 and end_idx > start_idx:
                    cleaned = cleaned[start_idx:end_idx]

            title = notice_list['notice'][0]['title']
            contentt = json.load(cleaned['contents'])
            url = notice_list['notice'][0]['url']
            space = "\u200b" * 500

            return f"새로운 공지가 감지되었습니다.\n\n{title}\n\n{space}\n\n{contentt}\n\n공지사항 링크: {url}"
        else:
            return ""

    except Exception as e:
        print(f"[notice] Error: {e}")
        return ""


def toggle_notice(room_id):
    """방의 공지 상태 토글 (yes ↔ no)"""
    state = load_notice_state()
    current = state.get(room_id, 'no')
    new_state = 'yes' if current == 'no' else 'no'
    state[room_id] = new_state

    if save_notice_state(state):
        return new_state
    else:
        return None


def handle_message(chat):
    """
    공지 관리 모듈
    명령어: @공지등록 또는 !공지등록 - 방의 공지 수신 상태 토글 (yes ↔ no)
    """
    global notice_check_counter

    msg = chat.message.msg.strip()
    room_id = chat.room.id

    # @공지등록 또는 !공지등록 - 방 상태 토글
    if any(prefix in msg for prefix in PREFIX_NOTICE):
        new_state = toggle_notice(room_id)

        if new_state is None:
            chat.reply("[루시] 공지 구독에 문제가 발생했습니다. 관리자에게 문의해 주세요.")
        elif new_state == 'yes':
            chat.reply("[루시] 공지 구독이 시작되었습니다.")
        else:
            chat.reply(f"[루시] 공지 구독이 취소되었습니다.")
        return

    # 100 톡마다 새 공지 확인 및 공지 등록된 방들에 전송
    notice_check_counter += 1

    if notice_check_counter > 100:
        notice_msg = get_new_notice()

        if notice_msg:
            notice_state = load_notice_state()
            for room in notice_state:
                if notice_state[room] == "yes":
                    chat.reply(notice_msg, room)

        notice_check_counter = 0
