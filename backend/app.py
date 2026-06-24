from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

import os

from rag import read_pdf, chunk_documents, search_similar

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

client = genai.Client(api_key=api_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

all_chunks = []
chat_history = []

MAX_FILE_SIZE = 50 * 1024 * 1024  

@app.get("/")
def home():
    return {
        "message": "PDF AI Chatbot Running (Gemini Enabled)"
    }

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global all_chunks, chat_history

    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File too large. Maximum allowed size is 50 MB."
        )

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(content)

    docs = read_pdf(file_path)
    chunks = chunk_documents(docs)

    all_chunks = chunks
    chat_history = []

    return {
        "message": "PDF uploaded successfully",
        "pages": len(docs),
        "chunks": len(chunks)
    }

class QuestionRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_question(req: QuestionRequest):
    global chat_history, all_chunks

    if not all_chunks:
        return {
            "answer": "Please upload a PDF first.",
            "sources": [],
            "chat_history": chat_history
        }

    try:
        relevant_chunks = search_similar(
            req.question,
            all_chunks
        )

        context = "\n\n".join(
            [chunk.page_content[:1000] for chunk in relevant_chunks[:3]]
        )

        prompt = f"""
You are a PDF question answering assistant.

Answer ONLY from the provided context.

If the answer is not present in the context, reply exactly:

Not mentioned in document

CONTEXT:
{context}

QUESTION:
{req.question}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
        )

        answer = response.text.strip()

    except Exception as e:
        print("Gemini Error:", str(e))
        answer = "AI temporarily unavailable. Please try again later."
        relevant_chunks = []

    sources = []

    for chunk in relevant_chunks:
        page = chunk.metadata.get("page", 0) + 1

        sources.append({
            "page": page,
            "excerpt": chunk.page_content[:250]
        })

    chat_history.append({
        "question": req.question,
        "answer": answer
    })

    return {
        "answer": answer,
        "sources": sources,
        "chat_history": chat_history
    }