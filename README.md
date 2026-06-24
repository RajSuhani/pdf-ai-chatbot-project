PDF AI Chatbot

An AI-powered chatbot that allows users to upload PDFs and ask questions based on their content using FastAPI, RAG (Retrieval-Augmented Generation), and Google Gemini API.

Live Demo

 Frontend URL: [ADD YOUR VERCEL LINK HERE]
 Backend URL: [ADD YOUR RENDER LINK HERE]

Features
 Upload PDF documents (up to 50MB)
Ask questions from uploaded PDFs
AI-powered answers using Google Gemini
Context-aware retrieval using RAG (chunk-based search)
Source extraction with page references
Chat history tracking
Fast API-based backend

 Architecture
Frontend (React + Vite)
        |
        |  HTTP Requests (Axios/Fetch)
        v
Backend (FastAPI)
        |
        |-- PDF Processing (PyPDF / Langchain loaders)
        |-- Chunking (Text splitting)
        |-- Retrieval (Similarity search)
        |
        v
Google Gemini API (LLM)
        |
        v
Generated Answer + Sources

 Design Decisions
1. RAG-based Architecture

Instead of sending full PDFs to the LLM, documents are:

Split into chunks
Retrieved based on similarity
Only relevant context is sent to Gemini


2. FastAPI Backend
Lightweight and high performance
Easy async support
Ideal for AI APIs
3. Gemini API (LLM Choice)
Used for natural language understanding
Generates context-aware answers
Lightweight and fast compared to heavier models
4. In-Memory Storage
Chunks stored in memory for simplicity
Chat history stored per session

Setup Instructions
1. Clone Repository
git clone https://github.com/YOUR_USERNAME/pdf-ai-chatbot.git
cd pdf-ai-chatbot
2. Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt

Create .env file:

GEMINI_API_KEY=your_api_key_here

Run backend:

uvicorn app:app --reload
3. Frontend Setup
cd frontend
npm install
npm run dev

Deployment
Backend (Render)
Deploy FastAPI on Render
Start command:
uvicorn app:app --host 0.0.0.0 --port 10000
Frontend (Vercel)
Build command:
npm run build
Output directory:
dist

Project Structure
pdf-ai-chatbot/
├── backend/
│   ├── app.py
│   ├── rag.py
│   ├── uploads/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md

Notes
Ensure .env is never pushed to GitHub
Upload folder is ignored for security
Application must be live during evaluation

Tech Stack
FastAPI
Python
React (Vite)
Google Gemini API
RAG (Retrieval-Augmented Generation)

Submission Checklist
 GitHub repo is PUBLIC
 Live frontend URL added
 Live backend deployed
 README completed
 No missing dependencies
 
Author
Suhani Raj
