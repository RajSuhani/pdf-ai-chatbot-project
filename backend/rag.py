from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from collections import Counter
import re

def read_pdf(pdf_path):
    loader = PyPDFLoader(pdf_path)
    return loader.load()

def chunk_documents(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )
    return splitter.split_documents(docs)

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return text

def search_similar(question, chunks):
    q_words = clean_text(question).split()

    scored = []

    for chunk in chunks:
        text = clean_text(chunk.page_content)
        words = text.split()

        freq = Counter(words)

        score = 0

        for w in q_words:
            if len(w) > 2:
                score += freq[w]

        scored.append((score, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)

    top = [c[1] for c in scored[:3]]

    return top