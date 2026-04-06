# Module 11: Collection (Pokedex)
from .config import SETTING, COLLECTION_NAMES, COLLECTION_CONTENTS, COLLECTION_EFFECTS_DATA
from .io_helpers import read_json, write_json

def handle_mycollection(sender, chat):
    """Handle my collection command (@내 컬렉션)"""
    pokCol = read_json(f"player_{sender}_collection")
    pokUser = read_json(f"player_{sender}")

    if pokCol is None or pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    space = "\u200b"*500

    res = f"@{sender} 님의 현재 컬렉션\n{space}\n"

    for name in COLLECTION_NAMES:
        idx = COLLECTION_NAMES.index(name)
        collected = pokCol.get(name, [])
        total = len(COLLECTION_CONTENTS[idx])
        count = len(collected)

        res += f"[{name}] {count}/{total}\n"

    # Show active collection effects
    activecollection = pokUser.get("activecollection", [])

    res += "\n현재 적용중인 컬렉션 효과 "
    
    # Calculate effects summary
    effects_list = []
    if 15 in activecollection:  # 전설/환상 50% - 포획률 증가
        effects_list.append("추가 포획률 1% 증가")
    
    # Count gatcha reload effects (from various 50% completions)
    gatcha_count = sum(1 for i in [1, 2, 3, 4, 5, 6, 7] if i in activecollection)
    if gatcha_count > 0:
        effects_list.append(f"제비뽑기 리로드 1회당 횟수 제한 {gatcha_count}회 증가")
    
    if effects_list:
        res += ", ".join(effects_list)
    else:
        res += "없음"

    # Show collected Pokemon details
    res += "\n\n현재 컬렉션 등록 포켓몬 현황\n"
    
    for name in COLLECTION_NAMES:
        idx = COLLECTION_NAMES.index(name)
        collected = pokCol.get(name, [])
        
        res += f"\n[{name}]\n"
        if collected:
            # Format: 8 per line with comma separation
            for i in range(0, len(collected), 8):
                chunk = collected[i:i+8]
                res += ", ".join(chunk) + ",\n"
        else:
            res += "아직 등록한 포켓몬이 없어요!\n"

    chat.reply(res)

def handle_collectioninfo(sender, chat):
    """Handle collection info command (@컬렉션목록)"""
    pokCol = read_json(f"player_{sender}_collection")
    
    if pokCol is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    res = f"@{sender} 컬렉션 목록\n\n"
    
    for name in COLLECTION_NAMES:
        idx = COLLECTION_NAMES.index(name)
        collected = pokCol.get(name, [])
        total = len(COLLECTION_CONTENTS[idx])
        
        res += f"[{name}] {len(collected)}/{total}\n"
        if collected:
            res += f"  {', '.join(collected[:5])}"
            if len(collected) > 5:
                res += f" 외 {len(collected) - 5}마리"
            res += "\n"
        res += "\n"
    
    chat.reply(res)

def handle_collectioneffects(sender, chat):
    """Handle collection effects command (@컬렉션효과)"""
    pokUser = read_json(f"player_{sender}")
    pokCol = read_json(f"player_{sender}_collection")

    if pokCol is None or pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return

    space = "\u200b"*500

    res = f"포켓몬스터 게임 컬렉션 효과 목록\n{space}\n"
    res += "※컬렉션 레벨은 100% 수집을 달성한 지역 1개당 1씩 오릅니다.\n\n"

    for collection in COLLECTION_EFFECTS_DATA:
        res += f"[{collection['name']}]\n"
        for threshold in collection['thresholds']:
            res += f"---{threshold['percent']}% 달성---\n"
            for effect in threshold['effects']:
                res += f"{effect}\n"
            res += "\n"

    chat.reply(res)

def updatecollection(chat, player):
    """Update collection and apply effects"""
    pokUser = read_json(f"player_{player}")
    pokCol = read_json(f"player_{player}_collection")
    
    if pokCol is None:
        dogam = {name: [] for name in COLLECTION_NAMES}
        write_json(f"player_{player}_collection", dogam)
        pokCol = read_json(f"player_{player}_collection")
    
    levsum = 0
    res = ""
    activecollection = []
    
    for ii in COLLECTION_NAMES:
        idx = COLLECTION_NAMES.index(ii)
        if ii in pokCol and len(pokCol[ii]) == len(COLLECTION_CONTENTS[idx]):
            levsum += 1
        
        if idx < 7:  # Generations 1-7
            if ii in pokCol and len(pokCol[ii]) > len(COLLECTION_CONTENTS[idx]) / 2:
                activecollection.append(idx + 1)
                res += f"[{ii}] 50%\n"
            if ii in pokCol and len(pokCol[ii]) == len(COLLECTION_CONTENTS[idx]):
                activecollection.append(idx + 8)
                res += f"[{ii}] 100%\n"
        
        if idx == 7:  # Legendary
            if ii in pokCol and len(pokCol[ii]) > len(COLLECTION_CONTENTS[idx]) / 2:
                activecollection.append(15)
                res += "[전설/환상] 50%\n"
            if ii in pokCol and len(pokCol[ii]) == len(COLLECTION_CONTENTS[idx]):
                activecollection.append(16)
                res += "[전설/환상] 100%\n"
        
        if idx == 8:  # Ultra Beast
            if ii in pokCol and len(pokCol[ii]) > len(COLLECTION_CONTENTS[idx]) / 2:
                activecollection.append(17)
                res += "[울트라비스트] 50%\n"
            if ii in pokCol and len(pokCol[ii]) == len(COLLECTION_CONTENTS[idx]):
                activecollection.append(18)
                res += "[울트라비스트] 100%\n"
        
        if idx == 9:  # Hidden
            if ii in pokCol and len(pokCol[ii]) > len(COLLECTION_CONTENTS[idx]) / 2:
                activecollection.append(19)
                res += "[???] 50%\n"
            if ii in pokCol and len(pokCol[ii]) == len(COLLECTION_CONTENTS[idx]):
                activecollection.append(20)
                res += "[???] 100%\n"
    
    pokUser["collectionlev"] = levsum + 1
    pokUser["activecollection"] = activecollection
    write_json(f"player_{player}", pokUser)
    
    if activecollection:
        chat.reply(f"@{player}\n현재 적용된 컬렉션 효과\n\n{res}")
