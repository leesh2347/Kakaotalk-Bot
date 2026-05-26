# Pokemon Game Bot - Main Entry Point
# This file handles module imports and message routing only

from .pok_game_module.config import *
from .pok_game_module.io_helpers import *
from .pok_game_module.join_leave import pokjoin, pokleave
from .pok_game_module.explore import handle_explore, advOn, pokdelay, get_day_or_night, handle_palpark
from .pok_game_module.catch import handle_ballthrow, handle_escape
from .pok_game_module.player_info import handle_info, handle_box, handle_pokinfo, handle_dpokinfo, handle_pokdictionary
from .pok_game_module.training import (
    handle_levelup, handle_boxlevelup, handle_skillchange, handle_effort, handle_mega, handle_gmax,
    handle_formchange, handle_lock, handle_unlock, handle_sell,
    handle_swap, handle_rest, handle_egg, handle_legendegg, handle_goldenegg,
    handle_boxlock, handle_boxunlock, handle_skilllock, handle_skillunlock
)
from .pok_game_module.rank_up import handle_ballup, handle_ballinfo, handle_title, handle_ball_purchase
from .pok_game_module.battle import handle_battlejoin, handle_battleexit, handle_battlenext, handle_giveup
from .pok_game_module.pve_battle import handle_gym, handle_villain, handle_ranking_battle, handle_ranking_settlement
from .pok_game_module.champion import handle_champ, handle_champinfo
from .pok_game_module.collection import handle_mycollection, handle_collectioninfo, handle_collectioneffects
from .pok_game_module.etc import handle_eventinfo, handle_ribbon, handle_rank, handle_seasoninfo, handle_leaguechar, handle_pokemon_ranking
from .pok_game_module.maintenance import toggle_updating, load_updating_state, ADMIN_USER

# Global state imports
from .pok_game_module.explore import ispokfind, battlepokinfo
from .pok_game_module.catch import isballwaiting
from .pok_game_module.battle import isbattle, player1, player2
from .pok_game_module.champion import champplayers
from .pok_game_module.etc import gatchaplayers

# ============================================================================
# Main Entry Point
# ============================================================================

def handle_message(chat):
    """
    Main message handler - routes commands to appropriate modules
    Converted according to feedback.txt rules:
    - msg -> chat.message.msg
    - sender -> chat.sender.name
    - room -> chat.room.name
    - replier.reply -> chat.reply
    
    Note: Some commands use msg.split(" ")[0] for matching (commands that take arguments)
    """
    room = chat.room.name
    msg = chat.message.msg
    sender = chat.sender.name.replace(" ", "_").replace("/", "_").replace("\\", "_")
    msg_first = msg.split(" ")[0] if msg else ""

    # Room filter - only respond in Pokemon room
    if room not in ["루시 포켓몬방","JOLT_26"]:
        return

    # ========================================================================
    # Account Management
    # ========================================================================
    if msg == CMDS['join']:
        pokjoin(sender, chat)
        return

    if msg == CMDS['leave']:
        pokleave(sender, chat)
        return

    # ========================================================================
    # Exploration & Catching
    # ========================================================================
    if msg in CMDS['play']:
        handle_explore(sender, room, chat)
        return

    if msg in CMDS['ballthrow']:
        handle_ballthrow(sender, chat)
        return

    if msg in CMDS['esc']:
        handle_escape(sender, chat)
        return

    # ========================================================================
    # Player Info
    # ========================================================================
    if msg_first == CMDS['info']:
        handle_info(sender, chat, msg[len(msg_first):].strip())
        return

    if msg == CMDS['box']:
        handle_box(sender, chat)
        return

    if msg_first == CMDS['pokinfo']:
        handle_pokinfo(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['dpokinfo']:
        handle_dpokinfo(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['dic']:
        handle_pokdictionary(sender, chat, msg[len(msg_first):].strip())
        return

    # ========================================================================
    # Training
    # ========================================================================
    if msg_first == CMDS['levelup']:
        handle_levelup(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['boxlevelup']:
        handle_boxlevelup(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['skillchange']:
        handle_skillchange(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['effort']:
        handle_effort(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['mega']:
        handle_mega(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['gmax']:
        handle_gmax(sender, chat, msg[len(msg_first):].strip())
        return
    
    if msg_first == CMDS['formchange']:
        handle_formchange(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['skilllock']:
        handle_skilllock(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['skillunlock']:
        handle_skillunlock(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['lock']:
        handle_lock(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['unlock']:
        handle_unlock(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['sell']:
        handle_sell(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['swap']:
        handle_swap(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['boxlock']:
        handle_boxlock(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['boxunlock']:
        handle_boxunlock(sender, chat, msg[len(msg_first):].strip())
        return

    if msg == CMDS['rest']:
        handle_rest(sender, chat)
        return

    if msg == CMDS['egg']:
        handle_egg(sender, chat)
        return

    if msg == CMDS['shinyegg']:
        handle_goldenegg(sender, chat)
        return

    if msg == CMDS['legendegg']:
        handle_legendegg(sender, chat)
        return

    # ========================================================================
    # Rank & Ball Upgrades
    # ========================================================================
    if msg == CMDS['ballup']:
        handle_ballup(sender, chat)
        return

    if msg == CMDS['ballinfo']:
        handle_ballinfo(sender, chat)
        return

    if msg == CMDS['title']:
        handle_title(sender, chat)
        return

    if msg_first == CMDS['ball']:
        handle_ball_purchase(sender, chat, msg[len(msg_first):].strip())
        return

    # ========================================================================
    # PvP Battles
    # ========================================================================
    if msg == CMDS['battlejoin']:
        handle_battlejoin(sender, chat)
        return

    if msg == CMDS['battleexit']:
        handle_battleexit(sender, chat)
        return

    if msg_first == CMDS['battlenext']:
        handle_battlenext(sender, chat, msg[len(msg_first):].strip())
        return

    if msg == CMDS['giveup']:
        handle_giveup(sender, chat)
        return

    # ========================================================================
    # PVE Battles
    # ========================================================================
    if msg_first == CMDS['gym']:
        handle_gym(sender, chat, msg[len(msg_first):].strip())
        return

    if msg == CMDS['villain']:
        handle_villain(sender, chat)
        return

    if msg == CMDS['rankingbattle']:
        handle_ranking_battle(sender, chat)
        return

    if msg == CMDS['rankingsettle']:
        handle_ranking_settlement(sender, chat)
        return

    # ========================================================================
    # Champion League
    # ========================================================================
    if msg == CMDS['champ']:
        handle_champ(sender, chat)
        return

    if msg == CMDS['champinfo']:
        handle_champinfo(sender, chat)
        return

    # ========================================================================
    # Collection
    # ========================================================================
    if msg == CMDS['mycollection']:
        handle_mycollection(sender, chat)
        return

    if msg == CMDS['collectioninfo']:
        handle_collectioninfo(sender, chat)
        return

    if msg == CMDS['collectioneffects']:
        handle_collectioneffects(sender, chat)
        return

    # ========================================================================
    # Etc (Gacha, Events, etc.)
    # ========================================================================


    if msg == CMDS['eventinfo']:
        handle_eventinfo(sender, chat)
        return

    if msg == CMDS['ribbon']:
        handle_ribbon(sender, chat)
        return

    if msg == CMDS['rank']:
        handle_rank(sender, chat)
        return

    if msg == CMDS['pokemonranking']:
        handle_pokemon_ranking(sender, chat)
        return

    if msg == CMDS['seasoninfo']:
        handle_seasoninfo(sender, chat)
        return

    if msg == CMDS['leaguechar']:
        handle_leaguechar(sender, chat)
        return

    if msg_first == CMDS['palpark']:
        handle_palpark(sender, room, chat, msg[len(msg_first):].strip())
        return

    # ========================================================================
    # Maintenance (Admin Only)
    # ========================================================================
    if msg_first == CMDS['updating']:
        result = toggle_updating(sender, msg[len(msg_first):].strip())
        if result:
            chat.reply(result)
        else:
            chat.reply(f"@{sender}\n권한이 없습니다.\n(관리자: {ADMIN_USER})")
        return

    # ========================================================================
    # Help
    # ========================================================================

    if msg == CMDS['help']:
        space = "\u200b"*500
        help_text = '''카톡봇 포켓몬스터 게임!
명령어 보기: {help}
게임 시스템에 대한 자세한 설명을 보려면 아래를 클릭하세요.
{space}

🔹 기본 구조
유저가 특정 명령어를 입력하면 탐험 실행
일정 시간 쿨타임 존재 (스팸 방지)
결과는 랜덤 이벤트 형태로 반환됨

🔹 탐험 결과 종류
탐험을 하면 아래 중 하나가 발생:
🐾 포켓몬 발견
🎁 아이템 획득
❌ 아무 일도 없음

🐾 2. 포켓몬 발견 & 조우 시스템
탐험 중 포켓몬이 등장하면:
“야생 포켓몬 출현” 상태가 됨
현재
이 상태에서 추가 행동 가능

 🔹 특징
 랜덤 종 등장
 등장 확률 존재 (희귀 포켓몬 포함)
 도망갈 수도 있음 (시간 제한 or 행동 제한)

🎯 3. 포켓몬 획득 방법
발견했다고 바로 얻는 게 아니라, 획득 단계가 따로 존재합니다.

🔹 획득 방식
탐험 → 포켓몬 등장
획득 명령어 입력
성공/실패 판정
🔹 결과
성공 → 내 포켓몬으로 등록
실패 → 포켓몬 도망

🧬 4. 포켓몬 육성 시스템
획득한 포켓몬은 단순 수집이 아니라 성장 대상

🔹 기본 성장 요소
레벨
노력치강화(돌파)
스킬뽑기
특정 포켓몬 특수 강화(메가진화, 폼체인지, 거다이맥스)

🔹 포켓몬 스탯 구성
  HP	체력
  ATK	물리 공격력
  DEF	물리 방어력
  SATK	특수 공격력
  SDEF	특수 방어력
  SPD	스피드 (선공 결정)

  🗡️ [물리] 기술
  공격: ATK
  방어: 상대 DEF

  🔮 [특수] 기술
  공격: SATK
  방어: 상대 SDEF

🔹 강화 방법
  돌파: 2개 이상의 같은 포켓몬 보유시 1개 소모
  그 외 모든 강화는 골드 사용

🔹 레벨업 효과
  능력치 증가
  배틀에서 더 강한 전투 가능

⚔️5. 배틀 시스템
🔹 배틀 시작
  유저가 배틀 명령어 입력 → 전투 시작
  이후부터는 유저 개입 없음 (관전형 시스템)

🔹 턴 진행 방식
1️⃣ 매 턴마다 자동 처리
  각 포켓몬은 자신이 가진 기술 목록 중 랜덤으로 하나 선택
  유저가 기술을 고르지 않음
2️⃣ 선공 결정 (Speed 기반)
  spd (스피드) 비교
  더 높은 포켓몬이 선공, 동일할 시 랜덤 1포켓몬이 선공
  선공 → 후공 순으로 공격 진행

  상대 HP 감소
  HP가 0 이하가 되면 해당 포켓몬 쓰러짐
🔹 포켓몬 교체 (자동 덱 시스템)
  현재 포켓몬이 쓰러지면:
  덱에 있는 다음 순서 포켓몬 자동 출전
  유저가 교체하지 않음
👉 즉:
  “라인업(덱)” 기반 자동 전투”
🔹 승패 조건
  상대 덱 전부 쓰러뜨리면 → 승리
  내 덱 전부 쓰러지면 → 패배
'''.format(
            space=space, help=CMDS['uphelp']
        )
        chat.reply(f"{help_text}")
        return

    if msg == CMDS['uphelp']:
        help_text = "\n".join([
            "포켓몬스터 게임 도움말",
            "\u200b"*500,
            "[기본 명령어]",
            f"{CMDS['join']} - 게임 가입",
            f"{CMDS['leave']} - 게임 탈퇴",
            f"{CMDS['help']} - 게임 시스템 설명 보기",
            f"{CMDS['play']} - 야생 포켓몬 탐험",
            f"{CMDS['explorehelp']} - 야생 탐험 관련 도움말",
            f"{CMDS['ball']} [갯수] - 볼 구매",
            f"{CMDS['rest']} - 휴식 시작/종료",
            f"{CMDS['info']} - 트레이너 정보",
            "(뒤에 닉네임 붙이면 타 유저 정보 볼수 있음. 예시: 트레이너정보 홍길동)",
            f"{CMDS['dic']} [포켓몬이름] - 도감 검색",
            "",
            "[등급 관련]",
            f"{CMDS['title']} - 트레이너 등급 목록",
            f"{CMDS['ballinfo']} - 볼 등급 목록",
            f"{CMDS['ballup']} - 볼 강화",
            f"{CMDS['ribbon']} - 리본 등급 목록",
            "",
            "[포켓몬 관리]",
            f"{CMDS['box']} - 내 포켓몬 상자",
            f"{CMDS['sell']} - 포켓몬 놓아주기(돈 획득)",
            f"레벨업, 스킬, 메가진화, 거다이맥스 등 포켓몬 강화는 {CMDS['box']} 참조.",
            "",
            "[배틀 관련]",
            f"{CMDS['battlejoin']} - PVP 매칭 참가. 2명이 매칭에 참가하면 배틀이 시작됩니다.",
            f"{CMDS['gymhelp']} -체육관 도전 관련 도움말 보기",
            f"{CMDS['champ']} - 챔피언리그 도전. 모든 뱃지 획득해야 도전 가능.",
            "",
            "[컬렉션 관련]",
            f"{CMDS['mycollection']} - 내 컬렉션 수집 현황",
            f"{CMDS['collectioninfo']} -컬렉션 항목별 포켓몬 목록",
            f"{CMDS['collectioneffects']} - 컬렉션 수집 효과 목록",
            "",
            "[기타]",
            f"{CMDS['egg']} - 일반알 사용.(레어 등급 이상 확정권)",
            f"{CMDS['legendegg']} -전설알 사용.(전설 등급 이상 확정권)"
            "",
        ])
        chat.reply(f"{help_text}")
        return

    if msg == CMDS['gymhelp']:

        help_arr = [
            f"{CMDS['gym']} -체육관 도전. 승리 시마다 뱃지를 획득하며 18번째 뱃지까지 존재.",
            "체육관별 자세한 정보를 보려면 전체보기 클릭",
            "\u200b"*500
        ]

        for i in range(0, 18):
            help_arr.append(f"{i+1}번째 관장 - {TYPE_TEXTS[i+1]}")

            reqlev = 0
            if i < 13:
                reqlev = 10 + i * 15
            else:
                reqlev = 200 + (i - 13) * 10

            help_arr.append(f"권장 도전 레벨: Lv.{reqlev} 이상")
            help_arr.append("")


        help_text = "\n".join(help_arr)
        chat.reply(f"{help_text}")
        return

    if msg == CMDS['explorehelp']:
        day_or_night = get_day_or_night()

        daytext = "☀️낮"
        if day_or_night == "night":
            daytext = "🌜밤"

        help_text = "\n".join([
            "포켓몬 게임 탐험 관련 정보",
            "\u200b"*500,
            "[그룹별 등장 포켓몬]",
            f"(현재 시각: {daytext})",
            "<일반>",
            f"{', '.join(POK_ARR['group1'][day_or_night])}",
            "",
            "<고급>",
            f"{', '.join(POK_ARR['group2'][day_or_night])}",
            "",
            "<레어>",
            f"{', '.join(POK_ARR['group3'][day_or_night])}",
            "",
            "<⭐전설/환상⭐>",
            f"{', '.join(POK_ARR['group4'][day_or_night])}",
            "",
            "<🦄울트라비스트🦄>",
            f"{', '.join(POK_ARR['group5'][day_or_night])}",
            "",
            "<⏳️패러독스⏳️>",
            f"{', '.join(POK_ARR['group6'][day_or_night])}",
            "",
            "<???>",
            f"{', '.join(POK_ARR['groupunknown'][day_or_night])}",
            "",
            "※<???> 그룹은 계정 스탯 관계없이 1% 확률로 고정 출현하며, 이벤트 등 한정으로 출시하는 포켓몬도 이 그룹에 추가되게 됩니다.",
            "",
            "※낮/밤 구분 기준",
            "☀️낮: 현실 시간 07시~19시",
            "🌜밤: 현실 시간 19시~07시",
            "(낮과 밤은 서로 출현 포켓몬 목록이 다릅니다.)",
            "",
            "[그룹별 포켓몬 도주(포획 실패) 확률]",
            f"일반: {SETTING['run'][5]}%",
            f"고급: {SETTING['run'][4]}%",
            f"레어: {SETTING['run'][3]}%",
            f"⭐전설/환상⭐: {SETTING['run'][2]}%",
            f"🦄울트라비스트🦄: {SETTING['run'][1]}%",
            f"⏳️패러독스⏳️: {SETTING['run'][0]}%",
            "???: 90%"
            "",
            "[기타 확률 정보]",
            "골드 발견 확률: 7.5%",
            "아이템 발견 확률: 7.5%",
            "-몬스터볼: 6.375%",
            "-일반 포켓몬 알: 0.75%",
            "-금왕관: 0.075%",
            "-⭐전설/환상⭐ 포켓몬의 알: 0.075%",
            "-🪨알 수 없는 돌(대량의 골드): 0.075%",
            "",
            "일반 포켓몬의 알: 레어~??? 등급의 포켓몬 1마리 랜덤 획득",
            "전설의 포켓몬의 알: 전설~??? 등급의 포켓몬 1마리 랜덤 획득",

        ])
        chat.reply(f"{help_text}")
        return

# ============================================================================
# Initialization (equivalent to onStartCompile)
# ============================================================================

def on_start():
    """
    Initialization function called when module is loaded
    """
    global month, gatchaplayers, champplayers

    season_text = ["", "봄", "여름", "가을", "겨울"]
    pokseason = read_json("season")

    if pokseason is None:
        data = {"month": 1}
        write_json("season", data)
        pokseason = read_json("season")

    month = pokseason.get("month", 1)
    gatchaplayers = {}
    champplayers = {}

    # Load maintenance state
    load_updating_state()

    print(f"포켓몬 게임 리로드.\n현재 계절: {season_text[month]}")
