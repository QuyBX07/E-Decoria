# app/main.py
import uvicorn
from fastapi import FastAPI
from app.api.chat import router as chat_router

app = FastAPI(
    title="Decoria AI Assistant",
    description="API Chatbot nội thất sử dụng Gemini Function Calling",
    version="1.0.0"
)

# Đăng ký Router
app.include_router(chat_router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Decoria AI is running smoothly!"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
