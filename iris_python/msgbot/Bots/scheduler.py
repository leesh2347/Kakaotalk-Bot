# /msgbot/Bots/scheduler.py
import threading
import time
from datetime import datetime, timedelta

# 메시지 수신 시 캡처한 최신 ChatContext를 저장 (스케줄 실행 시 사용)
_chat = None
_chat_lock = threading.Lock()


def handle_message(chat):
    """모든 수신 메시지에서 ChatContext를 캡처해 둡니다."""
    global _chat
    with _chat_lock:
        _chat = chat


# 스케줄 작업 목록
# - weekday: 0=월 ... 4=금 ... 6=일
# - 추가 시 아래 리스트에 항목만 추가하면 됩니다.
JOBS = [
    {
        "name": "sundayauto",
        "weekday": 4,   # 금요일
        "hour": 10,
        "minute": 3,
        "message": "[루시] 썬데이 자동 테스트(10:03)",
        "room_id": "18337848229494763",
        "is_media": 0,
    },
    {
        "name": "wednesdayalarm",
        "weekday": 2,   # 수요일
        "hour": 22,
        "minute": 30,
        "message": "[루시] 아 맞다 수로!\n주보, 에픽던전도 다 돌았는지 확인!",
        "room_id": "18337848229494763",
        "is_media": 0,
    }
    # 예시:
    # {
    #     "name": "weekly_report",
    #     "weekday": 0,   # 월요일
    #     "hour": 9,
    #     "minute": 0,
    #     "message": "[루시] 주간 리포트",
    #     "room_id": "1234567890",
    #     "is_media": 0,  # 0=텍스트, 1=미디어
    # },
]


def _next_run(job: dict, now: datetime) -> datetime:
    """job의 now 이후 가장 가까운 실행 시각을 반환합니다."""
    days_until = (job["weekday"] - now.weekday()) % 7
    target = now.replace(hour=job["hour"], minute=job["minute"], second=0, microsecond=0) + timedelta(days=days_until)
    if target <= now:
        target += timedelta(days=7)
    return target


def _scheduler_loop():
    global _chat
    while True:
        now = datetime.now()

        if not JOBS:
            time.sleep(60)
            continue

        # 각 job의 다음 실행 시각 계산
        scheduled = [( _next_run(job, now), job) for job in JOBS]
        target_time = min(t for t, _ in scheduled)

        # 같은 시각에 실행될 job들을 모두 수집
        jobs_to_run = [job for t, job in scheduled if t == target_time]

        wait_seconds = (target_time - now).total_seconds()
        print(f"[scheduler] 다음 실행 예정: {target_time.strftime('%Y-%m-%d %H:%M:%S')} "
              f"(약 {int(wait_seconds)}초 후) - {[j['name'] for j in jobs_to_run]}")
        if wait_seconds > 0:
            time.sleep(wait_seconds)

        with _chat_lock:
            chat = _chat

        if chat is None:
            print("[scheduler] 아직 캡처된 chat이 없어 메시지를 보낼 수 없습니다.")
            continue

        for job in jobs_to_run:
            try:
                is_media = job.get("is_media", 0)
                if is_media == 1:
                    chat.reply_media(job["message"], job["room_id"])
                else:
                    chat.reply(job["message"], job["room_id"])
                print(f"[scheduler] '{job['name']}' 전송 완료")
            except Exception as e:
                print(f"[scheduler] '{job['name']}' 전송 중 오류: {e}")


# 모듈 로드 시 백그라운드 스레드 시작 (daemon=True: 프로세스 종료 시 함께 종료)
_scheduler_thread = threading.Thread(target=_scheduler_loop, name="weekly-scheduler", daemon=True)
_scheduler_thread.start()
print("[scheduler] 다중 스케줄러 스레드 시작됨")
