import requests
import json
from urllib import parse
import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
from io import BytesIO
from datetime import datetime, timedelta
import math
import threading  # 락(Lock) 사용을 위해 추가
import numpy as np
from bs4 import BeautifulSoup
from msgbot.Bots.maple_nickskip.nickskip_module import recordnick, recommendnick, comma, get_yesterday_date, history_db_save, history_db_load
from msgbot.bot_commands.commands_config import PREFIX_HISTORY, PREFIX_LEVEL_HISTORY

def graph(a, a2, d, l):
    """
    a  : 값 배열
    a2 : 값 옆에 붙는 문자열 배열
    d  : 라벨(label) 배열
    l  : 그래프 길이
    """
    result = []
    for i in range(len(a)):
        _ = 100  # JS 코드의 fill(100)과 동일
        bar_full = int(l * a[i] / _)

        # 8단계 그래픽 문자
        blocks = list("▏▎▍▌▋▊▉█")

        # 소수점 부분
        fractional = (a[i] / _ % 1) * 8
        idx = int(fractional + 0.5)
        if idx >= len(blocks):
            idx = len(blocks) - 1

        bar = "█" * bar_full + blocks[idx]
        line = f"{d[i]}\n|{bar} {a2[i]}({a[i]}%)"
        result.append(line)

    return "\n".join(result)

# 1. 전역 변수로 락 객체 생성
graph_lock = threading.Lock()

def graph_image_bytes(a, a2, d, l, title, subtitle, nextlvup, islvup):
    """
    matplotlib의 스레드 충돌을 방지하기 위해 Lock과 Non-interactive 백엔드를 사용합니다.
    """
    
    # 2. 백엔드를 'Agg'로 강제 설정 (GUI 충돌 방지)
    # 함수 내부에서 설정하거나, 임포트 직후에 설정하는 것이 안전합니다.
    mpl.use('Agg') 

    # 3. 락을 사용하여 동시 실행을 방지 (큐와 같은 효과)
    with graph_lock:
        # 폰트 설정
        FONT_PATH = "res/fonts/MaplestoryFont_OTF/Maplestory OTF Light.otf"
        font_prop = fm.FontProperties(fname=FONT_PATH)

        mpl.rcParams["font.family"] = font_prop.get_name()
        mpl.rcParams["axes.unicode_minus"] = False
        
        # 세로 막대 그래프 생성
        # plt.subplots() 대신 Figure를 직접 생성하는 것이 메모리 관리에 더 유리할 수 있습니다.
        fig, ax = plt.subplots(figsize=(max(6, len(a) * 1.2), 5))

        try:
            bars = ax.bar(d, a, width=0.55, color="#28CF59")

            # 🏷 막대 위 텍스트
            for bar, v, lv in zip(bars, a, a2):
                ax.text(
                    bar.get_x() + bar.get_width() / 2,
                    bar.get_height() + 2.5,
                    f"Lv.{lv}\n({v:.2f}%)",
                    ha="center",
                    va="bottom",
                    fontsize=12,
                    fontproperties=font_prop,
                    clip_on=False
                )

            ax.set_axisbelow(True)
            ax.set_ylim(-3, 120)
            ax.set_yticks(np.arange(0, 121, 10))
            ax.margins(y=0.05)

            # 가로 점선 그리드
            ax.grid(axis="y", linestyle="--", linewidth=0.8, color="#c3c3c3", alpha=0.8)

            ax.tick_params(axis="y", left=False, labelleft=False)
            ax.set_xlabel(f"{nextlvup}{islvup}", fontproperties=font_prop, fontsize=20, labelpad=30)
            ax.set_title(title, fontproperties=font_prop, fontsize=20, pad=30)
            
            ax.text(0.5, 1.0, subtitle, transform=ax.transAxes, ha="center", va="bottom", 
                    fontsize=16, fontproperties=font_prop)

            plt.xticks(rotation=0, ha="center", fontsize=14, fontproperties=font_prop)
            plt.tight_layout()

            # 🖼 이미지 바이트 변환
            buf = BytesIO()
            plt.savefig(buf, format="png", dpi=150)
            buf.seek(0)
            image_data = buf.getvalue()
            
        finally:
            # 4. 메모리 누수 방지를 위해 반드시 close 및 캔버스 초기화
            plt.close(fig)
            fig.clf()
            buf.close()

        return image_data


def graph2(a, d, l):
    """
    a : 값 배열
    d : 라벨(label) 배열
    l : 그래프 길이
    """
    _max = max(a)

    # 실제 반환은 그래프가 아니라 "이름: Lv.x" 라인만 출력
    result = []
    for i in range(len(a)):
        result.append(f"{d[i]}: Lv.{a[i]}")
    return "\n".join(result)

def histdatearr(datestr):
    datearr = []

    today = datetime.strptime(datestr, "%Y-%m-%d")

    for _ in range(7):
        today += timedelta(days=1)
        d2 = today.strftime("%Y-%m-%d")
        datearr.append(d2)

    return datearr

#api ocid 검색
def search_api_ocid(nick):
    headers = {
        "Content-Type": "application/json",
        "x-nxopen-api-key": "live_5fbf44d53f909c000739c6ded2630548b1340053ca172cbe0d59ef023ae9477f69320869e3c5ee348598e4c96c389f59"
    }
    res = requests.get("https://open.api.nexon.com/maplestory/v1/id", params={"character_name": nick}, headers=headers)
    res.raise_for_status()     # 200이 아니면 에러
    ocid1 = json.loads(res.text)
    ocid2 = ocid1["ocid"]
    return ocid2

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


def hist_search(nick, datearr, sender):
    if nick is None or nick == "":
        return {
                "img_bytes":"",
                "text_print":"닉네임을 입력해 주세요"
            }
    else:
        try:
            recordnick(sender, nick)
            
            ocid = search_api_ocid(nick)

            arr = []

            arr2 = []

            darr = []

            ismaxup = 0

            islevup = ""

            lvv = 0

            for i in range(0, len(datearr)):
                data = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/basic?ocid={ocid}&date={datearr[i]}")

                darr.append(f"{datearr[i].split('-')[1]}월 {datearr[i].split('-')[2]}일")
                arr.append(float(data["character_exp_rate"]))
                arr2.append(int(data["character_level"]))

                if lvv < data["character_level"]:
                    if lvv != 0:
                        islevup = "\n🎊 레벨업 축하합니다! 🎊"
                        lvv = data["character_level"]

                if data["character_level"] > 299:
                    ismaxup = 1
                    break

            #print(f"arr: {arr}")
            #print(f"arr2: {arr2}")
            #print(f"darr: {darr}")

            history_db_save(nick, arr2[-1], darr[-1])

            min = arr[0]
            max = arr[-1]

            if min > max:
                max = max + 100

            div = (max-min) / len(arr)

            if div == 0:
                lvup = 999999
            else:
                lvup = math.ceil((100 - arr[-1]) / div)

            title = f"[{nick}]님의 경험치 히스토리"
            
            subtitle = f"({datearr[-1]} 기준)"

            nextlvup = ""

            if ismaxup == 1:
                islevup = f"\n🏆 만렙 달성 축하합니다! 🏆"
            elif div == 0:
                nextlvup = f"예상 다음 레벨업: 메이플 섭종 후"
            else:
                nextlvup = f"예상 다음 레벨업: {lvup}일 후"

            img_bytes = graph_image_bytes(arr,arr2,darr,5, title, subtitle, nextlvup, islevup)

            res_json = {
                "img_bytes":img_bytes,
                "text_print":""
            }

            return res_json

        except Exception as e:
            raise
            return {
                "img_bytes":"",
                "text_print":f"[{nick}]\n2023.12.21 이후 기록이 없는 캐릭터명 입니다."
            }

def levhist(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        try:
            recordnick(sender, nick)
            
            data_lv = history_db_load(nick)

            arr = []
            darr = []

            if len(data_lv) < 1:
                return f"[{nick}]\n2024.7.17 이후 히스토리 기록이 없는 캐릭터명 입니다."
            else:
                for i in range(0, len(data_lv)):
                    darr.append(data_lv[i]["date"])
                    arr.append(data_lv[i]["level"])

                return f"[{nick}]님의 레벨 히스토리\n\n{graph2(arr,darr,5)}"

        except Exception as e:
            raise
            return f"[{nick}]\n2024.7.17 이후 히스토리 기록이 없는 캐릭터명 입니다."


def handle_message(chat):

    if any(prefix in chat.message.msg for prefix in PREFIX_HISTORY):
        parts = chat.message.msg.split(" ")
        nick = parts[1] if len(parts) > 1 else None
        if nick is None:
            nick = recommendnick(chat.sender.name)
        if nick == "":
            chat.reply("닉네임을 입력해 주세요.")
        else:
            today = datetime.now()
            # 자정 ~ 01:00 사이일 경우 한국식 로직을 반영해 날짜 보정
            if today.hour < 1:
                today -= timedelta(days=9)
            else:
                today -= timedelta(days=8)
            
            yyyyMmDd = today.strftime("%Y-%m-%d")
            daarr = histdatearr(yyyyMmDd)
            #print(daarr)
            res = hist_search(nick, daarr, chat.sender.name)
            if res["img_bytes"] != "":
                chat.reply_media(res["img_bytes"])
            if res["text_print"] != "":
                chat.reply(res["text_print"])




    if any(prefix in chat.message.msg for prefix in PREFIX_LEVEL_HISTORY):
        parts = chat.message.msg.split(" ")
        nick = ""
        if len(parts) < 2:
            nick = recommendnick(chat.sender.name)
        else:
            nick = parts[1]
        print(nick)
        res = levhist(nick, chat.sender.name)
        chat.reply(res)