import random
import requests
from bs4 import BeautifulSoup
from msgbot.Bots.nyehuing_modules.chars import CHS

url = "https://example.com"  # 크롤링할 주소



#공홈 검색
def search_nick_maplehome(url):
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    res = requests.get(url, headers=headers)
    res.raise_for_status()     # 200이 아니면 에러
    soup = BeautifulSoup(res.text, "lxml")
    # jsoup의 .select(...) 에 해당 (CSS 선택자 그대로 사용 가능)
    elem = soup.select_one("#container > div > div > div:nth-child(4)")
    # jsoup의 .text() 에 해당
    if elem:
        return elem.get_text(strip=True)

def handle_message(chat):
    if '!녜힁' in chat.message.msg or '@녜힁' in chat.message.msg:
        parts = chat.message.msg.split(" ")
        if len(parts) > 1 and parts[1].isdigit():
            n = int(parts[1])
            if 1 < n < 7:
                nick = ""
                for i in range(1,n+1):
                    r = random.randint(1,len(CHS))
                    nick = nick+CHS[r]
                    
                #중복닉 검색 확인
                isava = ""
                    
                isreboot = search_nick_maplehome("https://maplestory.nexon.com/N23Ranking/World/Total?c="+nick)
                if "랭킹정보가 없습니다." not in isreboot:
                    isava = "🔴저런, 아쉽게도 이미 생성된 닉네임이군요!"
                else:
                    isexist = search_nick_maplehome("https://maplestory.nexon.com/N23Ranking/World/Total?c=" +nick+"&w=254")
                    if "랭킹정보가 없습니다." not in isexist:
                        isava = "🔴저런, 아쉽게도 이미 생성된 닉네임이군요!"
                    else:
                        isava = "🟢사용 가능한 닉네임입니다!"
                #여기까지
                    
                chat.reply(f"녜힁 생성완료: {nick}\n\n{isava}") 
            else:
                chat.reply("메이플 닉네임은 2글자에서 6글자까지만 가능합니다.")
        else:
            chat.reply("메이플 닉네임은 2글자에서 6글자까지만 가능합니다.")