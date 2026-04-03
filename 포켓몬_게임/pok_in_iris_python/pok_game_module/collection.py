# Module 11: Collection (Pokedex)
from .config import SETTING, COLLECTION_NAMES, COLLECTION_CONTENTS
from .io_helpers import read_json, write_json

def handle_mycollection(sender, chat):
    """Handle my collection command (@내 컬렉션)"""
    pokCol = read_json(f"player_{sender}_collection")
    pokUser = read_json(f"player_{sender}")
    
    if pokCol is None or pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    res = f"@{sender} 내 컬렉션\n\n"
    
    for name in COLLECTION_NAMES:
        idx = COLLECTION_NAMES.index(name)
        collected = pokCol.get(name, [])
        total = len(COLLECTION_CONTENTS[idx])
        count = len(collected)
        
        res += f"[{name}] {count}/{total}\n"
        
        # Show completion status
        if count == total:
            res += "  ✅ 완료!\n"
        elif count > total / 2:
            res += f"  {int(count/total*100)}% 완료\n"
        else:
            res += f"  {int(count/total*100)}% 완료\n"
    
    res += f"\n컬렉션 레벨: {pokUser.get('collectionlev', 1)}"
    
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
    
    # Calculate active collections
    activecollection = []
    res = f"@{sender} 컬렉션 효과\n\n"
    
    for name in COLLECTION_NAMES:
        idx = COLLECTION_NAMES.index(name)
        collected = pokCol.get(name, [])
        total = len(COLLECTION_CONTENTS[idx])
        
        if len(collected) > total / 2:
            activecollection.append(idx + 1)
            res += f"[{name}] 50% 완료 - 효과 활성화!\n"
        
        if len(collected) == total:
            activecollection.append(idx + 8)
            res += f"[{name}] 100% 완료 - 추가 효과 활성화!\n"
    
    pokUser["activecollection"] = activecollection
    write_json(f"player_{sender}", pokUser)
    
    if activecollection:
        res += f"\n현재 적용된 컬렉션 효과 수: {len(activecollection)}개"
    else:
        res += "\n아직 활성화된 컬렉션 효과가 없어요!"
    
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
