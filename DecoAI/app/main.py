# app/main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router

app = FastAPI(
    title="Decoria AI Assistant",
    description="API Chatbot nội thất sử dụng Gemini Function Calling",
    version="1.0.0"
)

# ====== CORS CONFIG (FIX 405 OPTIONS) ======
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # CRA
        "http://localhost:5173",  # Vite
    ],
    allow_credentials=True,
    allow_methods=["*"],        # ⚠️ BẮT BUỘC cho OPTIONS
    allow_headers=["*"],        # ⚠️ BẮT BUỘC cho Content-Type
)
# ==========================================

# Đăng ký Router
app.include_router(chat_router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Decoria AI is running smoothly!"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
