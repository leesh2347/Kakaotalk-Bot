# Module: Maintenance Mode
import random
from .config import UPDATING_MSGS, CMDS
from .io_helpers import read_json, write_json

# Global maintenance state
updating = False

# Admin user who can toggle maintenance
ADMIN_USER = "JOLT_26"


def is_updating():
    """Check if system is in maintenance mode"""
    global updating
    return updating


def load_updating_state():
    """Load maintenance state from file"""
    global updating
    state = read_json("updating_state")
    if state:
        updating = state.get("on", False)
    return updating


def toggle_updating(sender, mode):
    """Toggle maintenance mode"""
    global updating

    if sender != ADMIN_USER:
        return None

    if mode == "on":
        updating = True
        write_json("updating_state", {"on": True})
        return f"@{sender}\n점검 모드를 활성화했습니다."
    elif mode == "off":
        updating = False
        write_json("updating_state", {"on": False})
        return f"@{sender}\n점검 모드를 비활성화했습니다."
    else:
        return f"@{sender}\n사용법: {CMDS['updating']} [on/off]\n현재 상태: {'점검 중' if updating else '정상 운영'}"


def check_updating(sender, chat):
    """Check if user can access battle/exploration features during maintenance"""
    if is_updating() and sender != ADMIN_USER:
        chat.reply(f"@{sender}\n{random.choice(UPDATING_MSGS)}")
        return False
    return True
