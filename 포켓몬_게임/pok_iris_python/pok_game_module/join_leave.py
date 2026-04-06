# Module 2: Join and Leave
import time
from .config import SETTING, BALL_ARR, COLLECTION_NAMES
from .io_helpers import read_json, write_json

def pokjoin(sender, chat):
    """Join the game"""
    pokUser = read_json(f"player_{sender}")
    if pokUser is not None:
        chat.reply(f"@{sender}\n이미 가입 정보가 있습니다.")
        return
    
    new_player = {
        'rank': SETTING["rank"]["name"][0],
        'hp': 20,
        'maxHp': 20,
        'rest': SETTING["rank"]["rest"][0],
        'castT': SETTING["rank"]["castT"][0],
        'success': SETTING["success"],
        'successcatch': {
            'g5': SETTING["catchsuccess"][0],
            'g4': SETTING["catchsuccess"][1],
            'g3': SETTING["catchsuccess"][2],
            'g2': SETTING["catchsuccess"][3],
            'g1': SETTING["catchsuccess"][4]
        },
        'count': {'total': 0, 'succ': 0},
        'battlecount': {'total': 0, 'win': 0, 'lose': 0},
        'balls': 10,
        'Ball': BALL_ARR[0],
        'gold': 0,
        'stat': {
            'g5': SETTING["p"]["g5"],
            'g4': SETTING["p"]["g4"],
            'g3': SETTING["p"]["g3"],
            'g2': SETTING["p"]["g2"],
            'g1': SETTING["p"]["g1"]
        },
        'activecollection': [],
        'collectionlev': 1,
        'ribbon': SETTING["ribbon"]["name"][0],
        'balldc': SETTING["ribbon"]["balldc"][0],
        'upgradedc': SETTING["ribbon"]["upgradedc"][0],
        'restOn': {'on': False, 'time': 0}
    }
    
    write_json(f"player_{sender}", new_player)
    
    new_inv = {'deck': [], 'box': [], 'item': []}
    write_json(f"player_{sender}_inv", new_inv)
    
    new_col = {name: [] for name in COLLECTION_NAMES}
    write_json(f"player_{sender}_collection", new_col)
    
    chat.reply(f"@{sender}\n포켓몬스터 게임에 오신 것을 환영합니다!\n{SETTING.get('help_cmd', '@포켓몬스터')} 명령어로 도움말을 확인하세요.")

def pokleave(sender, chat):
    """Leave the game"""
    import os
    from .io_helpers import DATA_PATH
    
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f"@{sender}\n가입 정보가 없습니다.")
        return
    
    for suffix in ['', '_inv', '_collection']:
        try:
            file_path = os.path.join(DATA_PATH, f"player_{sender}{suffix}.json")
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error deleting file: {e}")
    
    chat.reply(f"@{sender}\n포켓몬스터 게임에서 탈퇴했습니다.")
