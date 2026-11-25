import requests
from PIL import Image, ImageDraw, ImageFont
import io

def generate_character_image(image_url):

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

    cropped_img = src_img.crop((left, top, right, bottom))

    # 3. 새 캔버스 생성 (500x500)
    canvas = Image.new("RGBA", (300, 320), (255, 255, 255, 255))

    # 4. crop 이미지를 캔버스 왼쪽에 붙이기 (세로 중앙)
    paste_x = (300 - crop_w) // 2
    canvas.paste(cropped_img, (paste_x, 10), cropped_img)

    # 5. 텍스트 그리기
    draw = ImageDraw.Draw(canvas)

    try:
        nick_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Bold.otf", 25)
    except:
        nick_font = ImageFont.load_default()

    try:
        content_font = ImageFont.truetype("res/fonts/MaplestoryFont_OTF/Maplestory OTF Light.otf", 20)
    except:
        content_font = ImageFont.load_default()


    draw.text((30, 130), "디벨로이드@스카니아", font=nick_font, fill=(0, 0, 0))

    draw.text((10, 185), "프렌즈 월드/키네시스", font=content_font, fill=(0, 0, 0))

    draw.text((10, 210), "레벨: 263(65.250%)", font=content_font, fill=(0, 0, 0))

    draw.text((10, 235), "길드: NodeJS │ 인기도: 112", font=content_font, fill=(0, 0, 0))

    draw.text((10, 260), "월드 랭킹: 1,410,486위", font=content_font, fill=(0, 0, 0))

    draw.text((10, 285), "직업 랭킹(월드): 7,372위", font=content_font, fill=(0, 0, 0))

    # 6. 전송
    img_bytes = io.BytesIO()
    canvas.save(img_bytes, format="PNG")
    img_bytes.seek(0)
    return img_bytes

def handle_message(chat):

    if chat.room.name == 'JOLT_26':
        if "JOLT_26" in chat.sender.name:
            if chat.message.command == '@h2':
                try:
                    image_url = "https://open.api.nexon.com/static/maplestory/character/look/INKOKMIFLIHEDDGIHKCCFKCPIPKKIGCKDNILPDBMLPJKIOIDGGBGDNCLJMILPHOCHOFPDLNIBOIBGHBBPJOEHKDCMLFCAMKLJDDMENKEANNCJAFJGLNMBMHNOCAAELILNCMCAMAPCDIJIACENKAHADLBLDNJNBFIPMPCHEPOABDMFEJMFLONOLBOIPEBCLEAMCONDIBIILFBOJKMBFBHBJAGCKKLDMLILFPHIFONAHMLGGMDJJNNGHCOCOMEPLPC?wmotion=W03"

                    img_bytes = generate_character_image(image_url)

                    chat.reply_media(img_bytes)

                except Exception as e:
                    chat.reply(f"오류 발생: {e}")

