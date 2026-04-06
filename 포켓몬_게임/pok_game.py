# Pokemon Game Bot - Main Entry Point
# This file handles module imports and message routing only

from .pok_game_module.config import *
from .pok_game_module.io_helpers import *
from .pok_game_module.join_leave import pokjoin, pokleave
from .pok_game_module.explore import handle_explore, advOn, pokdelay
from .pok_game_module.catch import handle_ballthrow, handle_escape
from .pok_game_module.player_info import handle_info, handle_box, handle_pokinfo, handle_dpokinfo
from .pok_game_module.training import (
    handle_levelup, handle_skillchange, handle_effort, handle_mega,
    handle_formchange, handle_lock, handle_unlock, handle_sell,
    handle_swap, handle_rest, handle_egg, handle_legendegg,
    handle_boxlock, handle_boxunlock, handle_skilllock, handle_skillunlock
)
from .pok_game_module.rank_up import handle_ballup, handle_ballinfo, handle_title, handle_ball_purchase
from .pok_game_module.battle import handle_battlejoin, handle_battleexit, handle_battlenext, handle_giveup
from .pok_game_module.pve_battle import handle_gym, handle_battletower
from .pok_game_module.champion import handle_champ, handle_champinfo
from .pok_game_module.collection import handle_mycollection, handle_collectioninfo, handle_collectioneffects
from .pok_game_module.etc import handle_gatcha, handle_eventinfo, handle_ribbon, handle_rank, handle_seasoninfo, handle_leaguechar

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
    sender = chat.sender.name
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

    # ========================================================================
    # Training
    # ========================================================================
    if msg_first == CMDS['levelup']:
        handle_levelup(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['skillchange']:
        handle_skillchange(sender, chat, msg[len(msg_first):].strip())
        return

    if msg_first == CMDS['effort']:
        handle_effort(sender, chat, msg[len(msg_first):].strip())
        return

    if msg == CMDS['mega']:
        handle_mega(sender, chat)
        return

    if msg == CMDS['formchange']:
        handle_formchange(sender, chat)
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

    if msg == CMDS['battletower']:
        handle_battletower(sender, chat)
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
    if msg == CMDS['gatcha']:
        handle_gatcha(sender, chat)
        return

    if msg == CMDS['eventinfo']:
        handle_eventinfo(sender, chat)
        return

    if msg == CMDS['ribbon']:
        handle_ribbon(sender, chat)
        return

    if msg == CMDS['rank']:
        handle_rank(sender, chat)
        return

    if msg == CMDS['seasoninfo']:
        handle_seasoninfo(sender, chat)
        return

    if msg == CMDS['leaguechar']:
        handle_leaguechar(sender, chat)
        return

    # ========================================================================
    # Help
    # ========================================================================
    if msg == CMDS['help'] or msg == CMDS['uphelp']:
        help_text = """포켓몬스터 게임 도움말

[기본 명령어]
{join} - 게임 가입
{leave} - 게임 탈퇴
{play} - 야생 포켓몬 탐험
{ballthrow} - 볼 던지기
{esc} - 도망치기
{box} - 내 포켓몬 상자
{info} - 트레이너 정보
{help} - 도움말

[포켓몬 관리]
{lock} - 덱에 포켓몬 장착
{unlock} - 덱에서 포켓몬 해제
{sell} - 포켓몬 놓아주기
{pokinfo} - 포켓몬 정보
{levelup} - 레벨업
{mega} - 메가진화
{formchange} - 폼체인지

[배틀]
{battlejoin} - 배틀 참가
{battlenext} - 다음 포켓몬
{giveup} - 배틀 기권

[상점]
{ball} - 볼 구매
{ballup} - 볼 강화

기타 명령어는 {uphelp}를 참조하세요.""".format(
            join=CMDS['join'], leave=CMDS['leave'], play='/'.join(CMDS['play']),
            ballthrow='/'.join(CMDS['ballthrow']), esc='/'.join(CMDS['esc']),
            box=CMDS['box'], info=CMDS['info'], help=CMDS['help'],
            lock=CMDS['lock'], unlock=CMDS['unlock'], sell=CMDS['sell'],
            pokinfo=CMDS['pokinfo'], levelup=CMDS['levelup'],
            mega=CMDS['mega'], formchange=CMDS['formchange'],
            battlejoin=CMDS['battlejoin'], battlenext=CMDS['battlenext'],
            giveup=CMDS['giveup'], ball=CMDS['ball'], ballup=CMDS['ballup'],
            uphelp=CMDS['uphelp']
        )
        chat.reply(f"@{sender}\n{help_text}")
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
    
    print(f"포켓몬 게임 리로드.\n현재 계절: {season_text[month]}")
