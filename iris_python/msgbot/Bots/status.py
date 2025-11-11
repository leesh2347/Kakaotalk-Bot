import psutil
import time

def get_system_stats(interval=1):
    # 1️⃣ CPU 사용률 (%)
    cpu_percent = psutil.cpu_percent(interval=interval)

    # 2️⃣ 메모리 정보
    mem = psutil.virtual_memory()

    # 3️⃣ 네트워크 속도 계산 (1초 간격)
    net1 = psutil.net_io_counters()
    time.sleep(interval)
    net2 = psutil.net_io_counters()

    bytes_sent = net2.bytes_sent - net1.bytes_sent
    bytes_recv = net2.bytes_recv - net1.bytes_recv

    upload_speed = bytes_sent / interval / 1024 / 1024  # MB/s
    download_speed = bytes_recv / interval / 1024 / 1024  # MB/s

    # 출력
    
    res_t=f"CPU 사용량: {cpu_percent:.1f}%\n"
    res_t=res_t+f"RAM 사용량: {mem.percent:.1f}% ({mem.used / (1024**3):.2f} GB / {mem.total / (1024**3):.2f} GB)\n"
    res_t=res_t+"네트워크 속도\n"
    res_t=res_t+f"업로드 속도: {upload_speed:.2f} MB/s\n"
    res_t=res_t+f"다운로드 속도: {download_speed:.2f} MB/s\n"
    
    return res_t

def handle_message(chat):
    """
    여러 명령어를 한 모듈에서 처리할 수 있음
    """
    
    if chat.room.name == '루시 도배방' or chat.room.name == '구 바다 월드':
        if chat.message.command == '@봇상태' or chat.message.command == '!봇상태':
            res = get_system_stats(interval=1)
            chat.reply(f"------루시의 현재 상태------\n{res}------------------------")
