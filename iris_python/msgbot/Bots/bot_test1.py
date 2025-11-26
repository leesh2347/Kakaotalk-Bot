import requests
from PIL import Image, ImageDraw, ImageFont
import io

def handle_message(chat):

    if chat.room.name == '낚시터':
        if "디벨로이드" in chat.sender.name:
            if chat.message.command == '@hi':
                try:
                    # 1. 테스트용 이미지 URL
                    image_url = "https://open.api.nexon.com/static/maplestory/character/look/INKOKMIFLIHEDDGIHKCCFKCPIPKKIGCKDNILPDBMLPJKIOIDGGBGDNCLJMILPHOCHOFPDLNIBOIBGHBBPJOEHKDCMLFCAMKLJDDMENKEANNCJAFJGLNMBMHNOCAAELILNCMCAMAPCDIJIACENKAHADLBLDNJNBFIPMPCHEPOABDMFEJMFLONOLBOIPEBCLEAMCONDIBIILFBOJKMBFBHBJAGCKKLDMLILFPHIFONAHMLGGMDJJNNGHCOCOMEPLPC?wmotion=W03"
                    response = requests.get(image_url, stream=True)
                    response.raise_for_status()

                    # 2. 이미지 로드
                    img = Image.open(io.BytesIO(response.content)).convert("RGBA")

                    # 3. 캔버스(이미지) 위에 글자 넣기
                    draw = ImageDraw.Draw(img)

                    # 폰트 로딩 (사용 폰트가 없으면 기본폰트)
                    try:
                        font = ImageFont.truetype("res/NanumFontSetup_OTF_GOTHIC/NanumGothicBold.otf", 40)
                    except:
                        font = ImageFont.load_default()

                    draw.text((0, 0), "tes", font=font, fill=(255, 255, 255))

                    # 4. 전송할 BytesIO 형태로 변환
                    img_bytes = io.BytesIO()
                    img.save(img_bytes, format="PNG")
                    img_bytes = io.BytesIO(img_bytes.getvalue())

                    # 5. 카카오톡으로 이미지 전송
                    chat.reply_media(img_bytes)

                except Exception as e:
                    chat.reply(f"오류 발생: {e}")
