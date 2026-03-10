import requests
import json
import math
from PIL import Image, ImageDraw, ImageFont
import io
import os
from urllib import parse
import numpy as np
from bs4 import BeautifulSoup
from msgbot.Bots.hexa_data.hexa_levdata import MAX_ERDA, MAX_PIECE, JANUS_MAX_ERDA, JANUS_MAX_PIECE, HEXA_DATA, ORIGIN_DATA, MASTER_DATA, SKILL_DATA, GONGYONG_DATA
from msgbot.Bots.maple_nickskip.nickskip_module import recordnick, recommendnick, comma, get_yesterday_date
from msgbot.bot_commands.commands_config import PREFIX_MECHANG

RES_TEXT = ["메린이 응애 나 애기 메린","무자본 평균","경손실 따질 스펙","메이플 평균","메창","메이플 인생 메생이","컨텐츠가 부족한 토끼공듀","넥슨 VVIP 흑우 ㅋㅋ"]

DESC_TEXT = ["어머~ 귀여워라~","늦지 않았어..도망쳐..!","도망치기엔 이미 늦었어...","이제 메린이라 하기엔 좀...?","아 맞다! 익몬! 일퀘!","가끔은 이세계도 돌아봐주세요.","아..게임 할 거 없네..컨텐츠가 부족하네.","음머~"]

MAG_PETS = ["오베론","티타니아","쁘띠 피코","빅토리","글로리","쁘띠 포니","황혼","신야","쁘띠 초롱","토트","벨라","쁘띠 데스","마주르카","칸타빌레","쁘띠 타임","플로리안","플로렌스","쁘띠 플로라","쁘띠 탄지로","쁘띠 젠이츠","쁘띠 네즈코", "카이", "아델레", "쁘띠 스노우", "쁘띠 사이타마", "쁘띠 제노스", "쁘띠 타츠마키", "쁘띠 프리렌", "쁘띠 페른", "쁘띠 위벨", "쁘띠 슈타르크"]

COMPLETE_GATCHA_ANDROIDS = ["싱크로이드", "유니온로이드", "진로이드"]

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
            lev_data = 0

            union = 0
            union_data = 0

            artifact = 0

            atk = 0
            atk_data = 0

            symbol = 0
            symbol_data = 0

            hexa = 0

            champion = 0
            champion_data = 0

            genesis = 0
            pet = 0
            android = 0

            class_nm = ""
            img_url = ""

            liberation_status = ""

            #ocid 세팅
            ocid = search_api_ocid(nick)

            #레벨
            answer_lev = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/basic?ocid={ocid}")
            l = int(answer_lev["character_level"])
            lev_data = l

            lev = l - 250
            if lev <= 0:
                lev = 0
            lev = lev * 2

            img_url = answer_lev["character_image"]
            class_nm = answer_lev["character_class"]

            #유니온
            answer_union = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/user/union?ocid={ocid}")
            u = int(answer_union["union_level"])
            union_data = u

            union = u - 6000
            if union <= 0:
                union = 0
            else:
                union = math.floor(union / 80)
                if union > 50:
                    union = 50
            
            #아티팩트
            artifact = int(answer_union["union_artifact_level"])
            if artifact > 50:
                artifact = 50
            
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
            atk_data = at

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
            symbol_data = sym

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

            #유챔
            answer_champion = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/user/union-champion?ocid={ocid}")
            ch = answer_champion["union_champion"]

            champion_data = len(ch)

            # sss: 20 ss: 15 s: 10 a: 8 b: 5 c: 3
            for i in range(0, len(ch)):
                if ch[i]["champion_grade"] == "SSS":
                    champion += 20
                elif ch[i]["champion_grade"] == "SS":
                    champion += 15
                elif ch[i]["champion_grade"] == "S":
                    champion += 10
                elif ch[i]["champion_grade"] == "A":
                    champion += 7
                elif ch[i]["champion_grade"] == "B":
                    champion += 5
                elif ch[i]["champion_grade"] == "C":
                    champion += 3


            #해방 여부
            answer_genesis = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/item-equipment?ocid={ocid}")
            g = answer_genesis["item_equipment"]
            for equips in g:
                if equips["item_equipment_slot"] == "보조무기":
                    if "아스트라 " in equips["item_name"]:
                        liberation_status +="A"
                        genesis += 30
                    break

            if answer_lev["liberation_quest_clear"] == "3":
                liberation_status +="21G"
                genesis += 70
            elif answer_lev["liberation_quest_clear"] == "2":
                liberation_status +="1G"
                genesis += 40
            elif answer_lev["liberation_quest_clear"] == "1":
                liberation_status +="G"
                genesis += 10

            #메창안드
            answer_android = search_maple_api(f"https://open.api.nexon.com/maplestory/v1/character/android-equipment?ocid={ocid}")
            if answer_android["android_name"] in COMPLETE_GATCHA_ANDROIDS:
                android = 20
            
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

            total = lev + union + artifact + atk + symbol + hexa + champion + genesis + pet

            res_data = {
                "total":total,
                "lev_data":lev_data,
                "union_data":union_data,
                "atk_data":atk_data,
                "symbol_data":symbol_data,
                "champion_data":champion_data,
                "lev":lev,
                "union":union,
                "artifact":artifact,
                "atk":atk,
                "symbol":symbol,
                "hexa":hexa,
                "champion":champion,
                "genesis":genesis,
                "pet":pet,
                "android":android,
                "img_url":img_url,
                "class_nm":class_nm,
                "liberation_status":liberation_status
            }
            return res_data


        except Exception as e:
            print(e)
            return 0

def generate_mechang_image(nick, judge_data, judge_score, judge_title, judge_desc):

    #데이터 안에서 이미지, 직업이름 가져오기
    class_nm = ""
    if judge_data["class_nm"] is not None:
        class_nm = judge_data["class_nm"]

    image_url = ""
    if judge_data["img_url"] is not None:
        image_url = judge_data["img_url"]


    response = requests.get(image_url)
    response.raise_for_status()

    # 1. 원본 이미지 로드
    src_img = Image.open(io.BytesIO(response.content)).convert("RGBA")
    w, h = src_img.size

    # 2. 중앙 1/4 영역 crop
    crop_w, crop_h = w // 4, h // 3
    left = (w - crop_w) // 2
    top = (h - crop_h) // 2
    right = left + crop_w
    bottom = top + crop_h

    cropped_img = src_img.crop((left, top, right, bottom)).resize((int(crop_w*1.5), int(crop_h*1.5)),Image.Resampling.LANCZOS)

    bg_img = Image.open(f"res/img/maple_ascent_bg/{class_nm}.png").convert("RGBA")

    template_img_url = ""

    if "1" in judge_data["liberation_status"]:
        template_img_url = "res/img/mechang_template_destiny.png"
    else:
        template_img_url = "res/img/mechang_template_genesis.png"

    template_img = Image.open(template_img_url).convert("RGBA")

    # 3. 새 캔버스 생성 (1390x945)
    canvas = Image.new("RGBA", (1350, 925), (255, 255, 255, 255))

    canvas.paste(bg_img, (0, 0), bg_img)

    canvas.paste(template_img, (0, 0), template_img)

    # 4. crop 이미지를 캔버스 왼쪽에 붙이기 (세로 중앙)
    canvas.paste(cropped_img, (60, 30), cropped_img)

    #워터마크 추가
    watermark_img = Image.open("res/img/watermark.png").convert("RGBA")
    canvas.paste(watermark_img, (1250, 880), watermark_img)

    # 5. 텍스트 그리기
    draw = ImageDraw.Draw(canvas)

    try:
        nick_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Bold.otf", 40)
    except:
        nick_font = ImageFont.load_default()

    try:
        desc_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Light.otf", 30)
    except:
        desc_font = ImageFont.load_default()

    try:
        content_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Light.otf", 28)
    except:
        content_font = ImageFont.load_default()

    try:
        liberation_desc_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Light.otf", 16)
    except:
        liberation_desc_font = ImageFont.load_default()

    liberation_desc = ""
    if "2" in judge_data['liberation_status']:
        liberation_desc = "+데스티니 2차 해방\n+데스티니 1차 해방\n+제네시스 해방"
    elif "1" in judge_data['liberation_status']:
        liberation_desc = "+데스티니 1차 해방\n+제네시스 해방"
    elif "G" in judge_data['liberation_status']:
        liberation_desc = "+제네시스 해방"
    else:
        liberation_desc = "-해방 미완료"
    if "A" in judge_data['liberation_status']:
        liberation_desc = liberation_desc + "\n+아스트라 보조무기 획득"

    draw.text((786, 89), f'{nick}님은 "{judge_title}"({judge_score}점) 입니다.', font=nick_font, fill=(0, 0, 0), anchor="mm")

    draw.text((786, 184), judge_desc, font=desc_font, fill=(0, 0, 0), anchor="mm")

    draw.multiline_text((142, 505), f'레벨\nLv. {judge_data["lev_data"]}\n{judge_data["lev"]} / 100', font=content_font, fill=(0, 0, 0), anchor="mm", align="center", spacing=10)

    draw.multiline_text((400, 505), f'유니온\nLv. {judge_data["union_data"]}\n{judge_data["union"]} / 50', font=content_font, fill=(0, 0, 0), anchor="mm", align="center", spacing=10)

    draw.multiline_text((670, 505), f'유니온 아티팩트\nLv. {judge_data["artifact"]}\n{judge_data["artifact"]} / 50', font=content_font, fill=(0, 0, 0), anchor="mm", align="center", spacing=10)

    draw.multiline_text((933, 505), f'전투력\n{comma(judge_data["atk_data"])}\n{judge_data["atk"]} / 100', font=content_font, fill=(0, 0, 0), anchor="mm", align="center", spacing=10)

    draw.multiline_text((1197, 505), f'어센틱포스\n{judge_data["symbol_data"]}\n{judge_data["symbol"]} / 100', font=content_font, fill=(0, 0, 0), anchor="mm", align="center", spacing=10)

    draw.multiline_text((142, 820), f'HEXA 매트릭스\n{judge_data["hexa"]}%\n{judge_data["hexa"]} / 100', font=content_font, fill=(0, 0, 0), anchor="mm", align="center", spacing=10)

    draw.multiline_text((400, 820), f'유니온 챔피언\n등록 캐릭터: {judge_data["champion_data"]}명\n{judge_data["champion"]} / 100', font=content_font, fill=(0, 0, 0), anchor="mm", align="center", spacing=10)

    draw.multiline_text((670, 790), f'해방 여부\n{judge_data["genesis"]} / 100', font=content_font, fill=(0, 0, 0), anchor="mm", align="center", spacing=5)

    draw.multiline_text((670, 855), liberation_desc, font=liberation_desc_font, fill=(0, 0, 0), anchor="mm", align="center", spacing=3)

    draw.multiline_text((933, 820), f'보너스 점수\n안드로이드\n+ {judge_data["android"]}', font=content_font, fill=(0, 0, 0), anchor="mm", align="center", spacing=10)

    draw.multiline_text((1197, 820), f'보너스 점수\n펫\n+ {judge_data["pet"]}', font=content_font, fill=(0, 0, 0), anchor="mm", align="center", spacing=10)



    # 6. 전송
    img_bytes = io.BytesIO()
    canvas.save(img_bytes, format="PNG")
    img_bytes.seek(0)
    return img_bytes

def mechang(nick, sender):
    if nick is None or nick == "":
        return {
                "img_bytes":"",
                "text_print" : "닉네임을 입력해 주세요"
            }
    else:
        try:
            recordnick(sender, nick)

            judge = 0

            judge_data = calc_score(nick)

            judge = judge_data["total"]

            res = 0

            if judge < 100:
                res = 0
            elif judge < 200:
                res = 1
            elif judge < 300:
                res = 2
            elif judge < 400:
                res = 3
            elif judge < 500:
                res = 4
            elif judge < 600:
                res = 5
            elif judge < 650:
                res = 6
            elif judge < 700:
                res = 7
            else:
                res = 8

            img_bytes = generate_mechang_image(nick, judge_data, judge, RES_TEXT[res], DESC_TEXT[res])

            '''
            liberation_desc = ""
            if "2" in judge_data['liberation_status']:
                liberation_desc = "데스티니 2차 해방"
            elif "1" in judge_data['liberation_status']:
                liberation_desc = "데스티니 1차 해방"
            elif "G" in judge_data['liberation_status']:
                liberation_desc = "제네시스 해방"
            else:
                liberation_desc = "해방 미완료"
            if "A" in judge_data['liberation_status']:
                liberation_desc = liberation_desc + ", 아스트라 보조무기 획득"

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
					f"[유니온]: {judge_data['union']}/50",
					f"[유니온 아티팩트]: {judge_data['artifact']}/50",
					f"[전투력]: {judge_data['atk']}/100",
					f"[어센틱포스]: {judge_data['symbol']}/100",
					f"[HEXA 매트릭스]: {judge_data['hexa']}/100",
                    f"[유니온 챔피언]: {judge_data['champion']}/100",
					f"[해방 여부]: {judge_data['genesis']}/100 ({liberation_desc})",
                    "[보너스 점수]",
                    f"-안드로이드: +{judge_data['android']}",
					f"-펫: +{judge_data['pet']}"
                ])
            else:
                return "\n".join([
                    f"[{nick}]님의 메창력 측정 결과...",
					"",
                    "어머...",
                    f"<넥슨 창문 '{judge}'개 오너> 이시군요?",
					"",
					"\u200b"*500,
					f"[레벨]: {judge_data['lev']}/100",
					f"[유니온]: {judge_data['union']}/50",
					f"[유니온 아티팩트]: {judge_data['artifact']}/50",
					f"[전투력]: {judge_data['atk']}/100",
					f"[어센틱포스]: {judge_data['symbol']}/100",
					f"[HEXA 매트릭스]: {judge_data['hexa']}/100",
                    f"[유니온 챔피언]: {judge_data['champion']}/100",
					f"[해방 여부]: {judge_data['genesis']}/100 ({liberation_desc})",
					"[보너스 점수]",
                    f"-안드로이드: +{judge_data['android']}",
					f"-펫: +{judge_data['pet']}"
                ])
            '''

            result_json = {
                "img_bytes":img_bytes,
                "text_print":""
            }

            return result_json

        except Exception as e:
            return {
                "img_bytes":"",
                "text_print" : f"[{nick}]\n측정 조건 자료 중 측정할 수 없는 항목이 있습니다.\n측정 항목을 확인해주세요.\n\n측정 항목: 레벨, 전투력, 유니온 레벨, 아티팩트 레벨, 6차 강화, 어센틱포스, 해방 유무, 자석펫 유무\n\n※2023.12.21이후 접속 기록이 없는 캐릭터는 측정이 불가합니다."
            }

def mechang_help():
    return "\n".join([
        "사용법: !메창 (닉네임)",
		"",
		"0~100 : 메린이",
		"101~200 : 무자본 평균",
		"201~300 : 메른이",
		"301~400 : 메이플 평균",
		"401~500 : 메창",
		"501~600 : 메이플 인생",
		"601~650 : 토끼공듀",
		"651~700 : 넥슨 VVIP",
		"701+ : ?",
		"(자세한 측정 기준을 보려면 전체보기 클릭)",
		"\u200b"*500,
		"---측정 기준---",
		"",
		"[레벨]",
		"(현재 레벨-250)x2",
		"",
		"[유니온]",
		"유니온 레벨 최소 6000~최대 10000 사이에서 최소 0~최대 50점으로 환산",
		"",
		"[유니온 아티팩트]",
		"유니온 아티팩트 레벨",
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
        "[유니온 챔피언]",
		"SSS: 20점, SS: 15점, S: 10점, A: 8점, B: 5점, C: 3점",
		"1캐릭당 최대 20점 X 5 최대 100점",
		"",
		"[해방]",
		"제네시스 해방: +10",
        "데스티니 해방: 1차, 2차 각각 +30",
        "아스트라 보조무기: +30",
		"",
		"[보너스 점수]",
		"-안드로이드: 알파벳 컴플리트 가챠 이벤트 한정 안드로이드 보유시 20점 추가(진로이드, 유니온로이드, 싱크로이드)",
        "-펫: 자석펫 1마리 보유당 10점씩 최대 30점까지 추가",
    ])

def handle_message(chat):
    if any(prefix in chat.message.msg for prefix in PREFIX_MECHANG):
        parts = chat.message.msg.split(" ")
        if len(parts) < 2:
            chat.reply(mechang_help())
        else:
            nick = parts[1]
            res = mechang(nick, chat.sender.name)
            if res["img_bytes"] != "":
                chat.reply_media(res["img_bytes"])
            if res["text_print"] != "":    
                chat.reply(res["text_print"])