#!/usr/bin/env python
# coding: utf-8
"""
MapleStory 정보 검색 도우미 AI 서버 (REST API 버전)
- Gemini 2.5 Flash REST 호출 기반
(RAG: 지침 전용 / Gemini 2.5 Flash)
- SDK 의존 없음
"""

# ──────────── 표준 및 외부 라이브러리 ────────────
import os, pickle, faiss, uvicorn, requests
import numpy as np
import json
import re
import datetime
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

# ──────────── 환경 변수 ────────────
load_dotenv()
SERVER_HOST = os.getenv("SERVER_HOST", "0.0.0.0")
SERVER_PORT = int(os.getenv("SERVER_PORT", "8000"))
DEBUG_MODE  = os.getenv("DEBUG_MODE", "false").lower() == "true"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "여기에 제미니 api 키를 발급받아 입력해 주세요")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
MAX_TOKENS = 2048
TEMPERATURE = 0.7

# ──────────── FAISS 인덱스 및 임베딩 ────────────
INDEX_PATH = "data/faiss_index.idx"
META_PATH  = "data/faiss_index_meta.pkl"

EMBED_MODEL = SentenceTransformer("paraphrase-MiniLM-L3-v2")
embed = lambda t: EMBED_MODEL.encode(t, convert_to_numpy=True).astype("float32")

try:
    faiss_index = faiss.read_index(INDEX_PATH)
    faiss_meta  = pickle.load(open(META_PATH, "rb"))
    print(f"FAISS 로드 완료: {faiss_index.ntotal} vectors")
except Exception as e:
    print("FAISS 로드 실패:", e)
    faiss_index, faiss_meta = None, None


# ──────────── Gemini REST API 호출 함수 ────────────
def gemini_generate(prompt: str) -> str:
    """
    Gemini REST API 호출 함수 (SDK 불필요)
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": TEMPERATURE,
            "maxOutputTokens": MAX_TOKENS
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        result = response.json()

        # 응답 본문 디버깅용
        if "candidates" not in result:
            raise ValueError(result.get("error", {}).get("message", "Gemini 응답 없음"))

        text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
        return text

    except Exception as e:
        raise RuntimeError(f"Gemini API 호출 오류: {e}")


# ──────────── FastAPI 앱 설정 ────────────
app = FastAPI(title="MapleStory Info Helper (REST)", version="1.0", debug=DEBUG_MODE)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────── Pydantic 모델 정의 ────────────
class AskReq(BaseModel):
    question: str

class AskRes(BaseModel):
    정보: str
    옵션: str


# ──────────── /ask 엔드포인트 ────────────
@app.post("/ask", response_model=AskRes)
async def ask(req: AskReq):
    if faiss_index is None:
        raise HTTPException(500, "FAISS 인덱스가 준비되지 않았습니다.")

    # 1. 질문 → RAG 검색
    qvec = np.array([embed(req.question)], dtype="float32")
    _, idx = faiss_index.search(qvec, 5)
    
    inst_chunks, word_chunks = [], []
    for i in idx[0]:
        src = faiss_meta[i]["source"]
        chunk = faiss_meta[i]["chunk_text"]
        if src == "instruction":
            inst_chunks.append(chunk)
        elif src == "words":
            word_chunks.append(chunk)

    # 2. 프롬프트 구성
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    prompt = (
        "다음은 AI가 반드시 따라야 할 응답 지침입니다:\n"
        + "\n".join(inst_chunks) + "\n\n"
        "다음은 사용자가 자주 사용하는 축약어 및 의미입니다:\n"
        + "\n".join(word_chunks) + "\n\n"
        f"오늘 날짜는 {today} 입니다.\n\n"
        f"사용자 질문: {req.question}\n"
        "지침과 축약어 정보를 모두 참고하여, 반드시 '정보'와 '옵션' 값을 JSON 형식으로만 출력하세요."
    )

    # 3. REST API 호출
    try:
        text = gemini_generate(prompt)
        match = re.search(r"\{.*\}", text, flags=re.DOTALL)
        if not match:
            raise ValueError("응답에서 JSON 객체를 찾을 수 없습니다.")
        parsed = json.loads(match.group(0))
        return AskRes(**parsed)
    except Exception as e:
        raise HTTPException(500, f"Gemini 응답 파싱 오류: {e}")


# ──────────── 상태 확인 엔드포인트 ────────────
@app.get("/health")
async def health():
    return {"status": "ok", "model": GEMINI_MODEL}


# ──────────── 서버 실행 ────────────
if __name__ == "__main__":
    print(f"Gemini REST 서버 실행 → http://{SERVER_HOST}:{SERVER_PORT}")
    uvicorn.run(app, host=SERVER_HOST, port=SERVER_PORT, reload=DEBUG_MODE)
