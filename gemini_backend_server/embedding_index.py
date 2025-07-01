import os, pickle, faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from utils import chunk_text

def build_dual_index(
    inst_path="data/tool_instructions.txt",
    word_path="data/words.txt",
    index_dir="data",
    model_name="all-MiniLM-L6-v2",
    max_chars=1500,
):
    embedder = SentenceTransformer(model_name)

    embeddings = []
    metadata = []

    # 1. 지침 청크
    with open(inst_path, "r", encoding="utf-8") as f:
        for i, chunk in enumerate(chunk_text(f.read(), max_chars=max_chars)):
            vec = embedder.encode(chunk, convert_to_numpy=True).astype("float32")
            embeddings.append(vec)
            metadata.append({
                "source": "instruction",
                "chunk_id": i,
                "chunk_text": chunk
            })

    # 2. 축약어 청크
    with open(word_path, "r", encoding="utf-8") as f:
        for i, chunk in enumerate(chunk_text(f.read(), max_chars=max_chars)):
            vec = embedder.encode(chunk, convert_to_numpy=True).astype("float32")
            embeddings.append(vec)
            metadata.append({
                "source": "words",
                "chunk_id": i,
                "chunk_text": chunk
            })

    if not embeddings:
        raise RuntimeError("임베딩할 데이터가 없습니다")

    embeddings = np.vstack(embeddings)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)

    os.makedirs(index_dir, exist_ok=True)
    faiss.write_index(index, os.path.join(index_dir, "faiss_index.idx"))
    with open(os.path.join(index_dir, "faiss_index_meta.pkl"), "wb") as f:
        pickle.dump(metadata, f)

    print(f"인덱스 생성 완료 → 총 {len(metadata)} 청크")

if __name__ == "__main__":
    build_dual_index()
