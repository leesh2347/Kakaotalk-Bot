# Module 10: Champion League
import random
import math
import time
from .config import SETTING
from .io_helpers import read_json, write_json

champplayers = {}

def handle_champ(sender, chat):
    """Handle champion challenge command (@챔피언도전)"""
    global champplayers
    
    pokUser = read_json(f"player_{sender}")
    if pokUser is None:
        chat.reply(f'@{sender}\n가입 정보가 없습니다.')
        return
    
    pokInv = read_json(f"player_{sender}_inv")
    if not pokInv or not pokInv.get("deck"):
        chat.reply(f"@{sender}\n덱에 포켓몬이 없어요!")
        return
    
    # Check if player is eligible
    current_rank = pokUser.get("rank", "")
    if current_rank != "포켓몬 마스터":
        chat.reply(f"@{sender}\n챔피언 도전은 '포켓몬 마스터' 등급만 가능합니다!\n현재 등급: {current_rank}")
        return
    
    # Check attempt limit
    if sender not in champplayers:
        champplayers[sender] = 0
    
    if champplayers[sender] >= 3:
        chat.reply(f"@{sender}\n챔피언 도전 횟수를 모두 사용했어요!")
        return
    
    # Load champion data
    champ_data = read_json("trainer/champion")
    if not champ_data or "champname" not in champ_data:
        chat.reply(f"@{sender}\n아직 챔피언이 없어요!")
        return
    
    champ_name = champ_data["champname"]
    chat.reply(f"@{sender}\n챔피언 {champ_name}에게 도전합니다!")
    
    # TODO: Implement champion battle logic
    champplayers[sender] += 1

def handle_champinfo(sender, chat):
    """Handle champion info command (@챔피언정보)"""
    champ_data = read_json("trainer/champion")
    champ_log = read_json("trainer/champlog")
    
    if not champ_data or "champname" not in champ_data:
        chat.reply("@{sender}\n아직 챔피언이 없어요!")
        return
    
    champ_name = champ_data["champname"]
    champ_deck = champ_data.get("deck", [])
    
    res = f"👑 챔피언 정보 👑\n\n"
    res += f"챔피언: {champ_name}\n"
    res += f"덱 포켓몬: {len(champ_deck)}마리\n\n"
    
    for i, pok in enumerate(champ_deck[:6]):
        res += f"{i+1}. Lv.{pok.get('level', 0)} {pok.get('name', '???')}\n"
    
    if champ_log:
        res += f"\n총 챔피언 수: {champ_log.get('Champnum', 0)}명"
    
    chat.reply(res)

def newChampion(username, chat):
    """Handle new champion creation"""
    global champplayers
    
    chamRank = read_json("trainer/champlog")
    if chamRank is None:
        cdata = {"Champnum": 1, "Champlogs": []}
        write_json("trainer/champlog", cdata)
        chamRank = read_json("trainer/champlog")
    
    # Demote old champion
    if len(chamRank["Champlogs"]) > 1:
        oldchamp = chamRank["Champlogs"][-1]
        pokUser_old = read_json(f"player_{oldchamp}")
        
        if pokUser_old:
            pokUser_old["rank"] = SETTING["rank"]["name"][-3]
            write_json(f"player_{oldchamp}", pokUser_old)
            
            time.sleep(2)
            chat.reply(f"@{oldchamp}\n새로운 챔피언의 등장으로 챔피언의 자리에서 내려왔어요.")
    
    # Load new champion data
    pokUser = read_json(f"player_{username}")
    pokInv = read_json(f"player_{username}_inv")
    pokCol = read_json(f"player_{username}_collection")
    
    # Update champion log
    chamRank["Champnum"] += 1
    chamRank["Champlogs"].append(username)
    write_json("trainer/champlog", chamRank)
    
    # Create champion deck
    chamdata = read_json("trainer/champion")
    chamdata["champname"] = username
    chamdeck = [pok.copy() for pok in pokInv.get("deck", [])]
    
    # Set champion level
    for pok in chamdeck:
        pok["level"] = SETTING["championlev"]
    
    chamdata["deck"] = chamdeck
    write_json("trainer/champion", chamdata)
    
    # Update player rank
    pokUser["rank"] = SETTING["rank"]["name"][-2]
    write_json(f"player_{username}", pokUser)
    
    # Give rewards
    if "item" not in pokInv:
        pokInv["item"] = []
    pokInv["item"].append("전설알")
    pokInv["item"].append("금왕관")
    write_json(f"player_{username}_inv", pokInv)
    
    if username not in champplayers:
        champplayers[username] = 0
    champplayers[username] += 1
    
    time.sleep(2)
    deck_print = "\n".join([f"Lv.{pok['level']} {pok['name']}" for pok in chamdeck])
    chat.reply(f"@{username}\n⭐축하합니다!⭐\n{len(chamRank['Champlogs'])}번째 챔피언이 되었습니다!\n챔피언 달성 보상으로 전설의 포켓몬의 알과 금왕관이 지급되었습니다.\n\n\n전당등록을 축하합니다!" + "\u200b" * 500 + "\n" + deck_print)
