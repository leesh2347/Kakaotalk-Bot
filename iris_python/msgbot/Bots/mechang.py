import requests
import json
import math
from urllib import parse
import numpy as np
from bs4 import BeautifulSoup
from msgbot.Bots.hexa_data.hexa_levdata import MAX_ERDA, MAX_PIECE, JANUS_MAX_ERDA, JANUS_MAX_PIECE, HEXA_DATA, ORIGIN_DATA, MASTER_DATA, SKILL_DATA, GONGYONG_DATA
from msgbot.Bots.maple_nickskip.nickskip_module import recordnick, recommendnick, comma, get_yesterday_date

RES_TEXT = ["메린이 응애 나 애기 메린","무자본 평균","경손실 따질 스펙","메이플 평균","메창","메이플 인생 메생이","컨텐츠가 부족한 토끼공듀","넥슨 VVIP 흑우 ㅋㅋ"]

DESC_TEXT = ["어머~ 귀여워라~","늦지 않았어..도망쳐..!","도망치기엔 이미 늦었어...","이제 메린이라 하기엔 좀...?","아 맞다! 익몬! 일퀘!","가끔은 이세계도 돌아봐주세요.","아..게임 할 거 없네..컨텐츠가 부족하네.","음머~"]

MAG_PETS = ["오베론","티타니아","쁘띠 피코","빅토리","글로리","쁘띠 포니","황혼","신야","쁘띠 초롱","토트","벨라","쁘띠 데스","마주르카","칸타빌레","쁘띠 타임","플로리안","플로렌스","쁘띠 플로라","쁘띠 탄지로","쁘띠 젠이츠","쁘띠 네즈코"]

SERV_ARR = ["","","에오스","핼리오스","오로라","레드","이노시스","유니온","스카니아","루나","제니스","크로아","베라","엘리시움","아케인","노바"]

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

def calc_score(nick):
    if nick is None or nick == "":
        return 0
    else:
        try:

            #항목별 점수 변수들

            lev = 0
            union = 0
            artifact = 0
            atk = 0
            symbol = 0
            hexa = 0
            genesis = 0
            pet = 0

            #ocid 세팅
            ocid = search_api_ocid(nick)

            #레벨
            answer_lev = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/basic?ocid={ocid}")
            l = int(answer_lev["character_level"])
            lev = l - 250
            if lev <= 0:
                lev = 0
            lev = lev * 2

            #유니온
            answer_union = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/user/union?ocid={ocid}")
            u = int(answer_union["union_level"])
            union = u - 6000
            if union <= 0:
                union = 0
            else:
                union = math.floor(union / 40)
                if union > 100:
                    union = 100
            
            #아티팩트
            artifact = int(answer_union["union_artifact_level"])
            artifact = artifact * 2
            if artifact > 100:
                artifact = 100
            
            #전투력, 어센틱심볼(api 한번에 둘다 가져옴)
            answer_stat = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/stat?ocid={ocid}")
            at = 0
            sym = 0

            for iii in range(0, 43):
                if answer_stat["final_stat"][iii]["stat_name"] == "전투력":
                    at = int(answer_stat["final_stat"][iii]["stat_value"])
                if answer_stat["final_stat"][iii]["stat_name"] == "어센틱포스":
                    sym = int(answer_stat["final_stat"][iii]["stat_value"])

            #전투력
            if at > 692000000:
                atk = 100
            elif at > 350000000:
                atk = 90
            elif at > 260000000:
                atk = 80
            elif at > 232000000:
                atk = 70
            elif at > 160000000:
                atk = 60
            elif at > 120000000:
                atk = 50
            elif at > 60000000:
                atk = 40
            elif at > 30000000:
                atk = 30
            elif at > 20000000:
                atk = 20
            elif at > 13000000:
                atk = 10
            else:
                atk = 0

            #어센틱포스
            symbol = math.floor((sym / 770) * 100)
            if symbol > 100:
                symbol = 100
            
            #헥사
            answer_hexa = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/hexamatrix?ocid={ocid}")
            h = answer_hexa["character_hexa_core_equipment"]
            erda_a = [0, 0, 0, 0]
            piece_a = [0, 0, 0, 0]

            sum_erda = 2
            sum_piece = 0

            origintext = ""
            mastertext = ""
            skilltext = ""
            publictext = ""

            for i in range(0, len(h)):
                for j in range(0, h[i]["hexa_core_level"]):
                    if j > 0 and h[i]["hexa_core_type"] == "스킬 코어":
                        erda_a[0] = erda_a[0] + ORIGIN_DATA["기운"][j]
                        piece_a[0]=piece_a[0] + ORIGIN_DATA["조각"][j]
                    elif h[i]["hexa_core_type"]=="마스터리 코어":
                        erda_a[1] = erda_a[1] + MASTER_DATA["기운"][j]
                        piece_a[1] = piece_a[1] + MASTER_DATA["조각"][j]
                    elif h[i]["hexa_core_type"] == "강화 코어":
                        erda_a[1] = erda_a[1] + SKILL_DATA["기운"][j]
                        piece_a[1] = piece_a[1] + SKILL_DATA["조각"][j]
                    elif h[i]["hexa_core_type"] == "공용 코어":
                        erda_a[1] = erda_a[1] + GONGYONG_DATA["기운"][j]
                        piece_a[1] = piece_a[1] + GONGYONG_DATA["조각"][j]

            for i in range(0, 4):
                sum_erda = sum_erda + erda_a[i]
                sum_piece = sum_piece + piece_a[i]
            
            hexa = math.floor((math.floor((sum_erda*100)/MAX_ERDA)+math.floor((sum_piece*100)/MAX_PIECE))/2)

            #해방 여부
            answer_genesis = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/skill?ocid={ocid}&character_skill_grade=0")
            g = answer_genesis["character_skill"]
            for iiii in range(0, len(g)):
                if g[iiii]["skill_name"] == "창조의 아이온":
                    genesis = 50
                    break
            
            #자석펫
            answer_pet = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/pet-equipment?ocid={ocid}")
            if answer_pet["pet_1_name"] is not None:
                if answer_pet["pet_1_name"] in MAG_PETS:
                    pet = pet + 10
            if answer_pet["pet_2_name"] is not None:
                if answer_pet["pet_2_name"] in MAG_PETS:
                    pet = pet + 10
            if answer_pet["pet_3_name"] is not None:
                if answer_pet["pet_3_name"] in MAG_PETS:
                    pet = pet + 10

            total = lev + union + artifact + atk + symbol + hexa + genesis + pet

            res_data = {
                "total":total,
                "lev":lev,
                "union":union,
                "artifact":artifact,
                "atk":atk,
                "symbol":symbol,
                "hexa":hexa,
                "genesis":genesis,
                "pet":pet
            }
            return res_data


        except Exception as e:
            print(e)
            return 0

def mechang(nick, sender):
    if nick is None or nick == "":
        return "닉네임을 입력해 주세요"
    else:
        try:
            recordnick(sender, nick)

            judge = 0

            judge_data = calc_score(nick)

            judge = judge_data["total"]

            res = 0

            if judge < 100:
                res = 0
            elif judge < 150:
                res = 1
            elif judge < 230:
                res = 2
            elif judge < 320:
                res = 3
            elif judge < 400:
                res = 4
            elif judge < 475:
                res = 5
            elif judge < 550:
                res = 6
            elif judge < 620:
                res = 7
            else:
                res = 8

            if res < 8:
                return "\n".join([
                    f"[{nick}]님의 메창력 측정 결과...",
					"",
					f"3대 '{judge}'치시는",
					f"<{RES_TEXT[res]}> 입니다.",
					"",
					DESC_TEXT[res],
					"",
					"\u200b"*500,
					f"[레벨]: {judge_data['lev']}/100",
					f"[유니온]: {judge_data['union']}/100",
					f"[유니온 아티팩트]: {judge_data['artifact']}/100",
					f"[전투력]: {judge_data['atk']}/100",
					f"[어센틱포스]: {judge_data['symbol']}/100",
					f"[HEXA 매트릭스]: {judge_data['hexa']}/100",
					f"[해방 여부]: +{judge_data['genesis']}",
					f"[펫]: {judge_data['pet']}/30"
                ])
            else:
                return "\n".join([
                    f"[{nick}]님의 메창력 측정 결과...",
					"",
                    "어머...",
                    f"<넥슨 창문 '{judge}'개 오너> 이시군요?",
					"",
					desc[res],
					"",
					"\u200b"*500,
					f"[레벨]: {judge_data['lev']}/100",
					f"[유니온]: {judge_data['union']}/100",
					f"[유니온 아티팩트]: {judge_data['artifact']}/100",
					f"[전투력]: {judge_data['atk']}/100",
					f"[어센틱포스]: {judge_data['symbol']}/100",
					f"[HEXA 매트릭스]: {judge_data['hexa']}/100",
					f"[해방 여부]: +{judge_data['genesis']}",
					f"[펫]: {judge_data['pet']}/30"
                ])

        except Exception as e:
            return f"[{nick}]\n측정 조건 자료 중 측정할 수 없는 항목이 있습니다.\n측정 항목을 확인해주세요.\n\n측정 항목: 레벨, 전투력, 유니온 레벨, 아티팩트 레벨, 6차 강화, 어센틱포스, 해방 유무, 자석펫 유무\n\n※2023.12.21이후 접속 기록이 없는 캐릭터는 측정이 불가합니다."

def mechang_help():
    return "\n".join([
        "사용법: !메창 (닉네임)",
		"",
		"0~100 : 메린이",
		"101~150 : 무자본 평균",
		"151~230 : 메른이",
		"231~320 : 메이플 평균",
		"321~400 : 메창",
		"401~475 : 메이플 인생.",
		"476~550 : 토끼공듀",
		"551~620 : 넥슨 VVIP",
		"621+ : ?",
		"(자세한 측정 기준을 보려면 전체보기 클릭)",
		"\u200b"*500,
		"---측정 기준---",
		"※상향평준화로 인해 2025.10 이후 기준 개편 예정입니다.",
		"",
		"[레벨]",
		"(현재 레벨-250)x2",
		"",
		"[유니온]",
		"유니온 레벨 최소 6000~최대 10000 사이에서 최소 0~최대 100점으로 환산",
		"",
		"[유니온 아티팩트]",
		"유니온 아티팩트 레벨x2",
		"",
		"[전투력]",
		"현재 전투력을 보스 구간별로 최소 0~최대 100점으로 환산",
		"(정확하진 않을 수 있으니 재미로 보세요)",
		"",
		"[어센틱포스]",
		"최대 강화 수치를 100% 기준으로 하여 현재의 진행도를 환산",
		"",
		"[HEXA 매트릭스]",
		"최대 강화 수치를 100% 기준으로 하여 현재의 진행도를 환산",
		"(측정 항목: 오리진 스킬, 마스터리 코어, 강화 코어, 공용 코어)",
		"",
		"[해방]",
		"해방 시 50점 가산점 추가",
		"",
		"[펫]",
		"자석펫 1마리 보유당 10점씩 최대 30점까지 추가"
    ])

def handle_message(chat):
    if "@메창" in chat.message.msg or "!메창" in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            chat.reply(mechang_help())
        else:
            nick = parts[1]
            res = mechang(nick, chat.sender.name)
            chat.reply(res)