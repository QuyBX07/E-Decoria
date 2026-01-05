import google.generativeai as genai
from app.core.config import settings
from app.core.prompt import SYSTEM_INSTRUCTION, SYSTEM_PARSE_PROMPT

genai.configure(api_key=settings.GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-flash-latest")


def chat_with_ai(user_message: str) -> str:
    """Hàm cũ, nếu cần vẫn dùng cho trả lời text thuần."""
    try:
        prompt = f"{SYSTEM_INSTRUCTION}\n\nKhách hàng: {user_message}"
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print("🔥 GEMINI ERROR >>>", e)
        return "Xin lỗi, hiện tại tôi không thể trả lời. Anh/Chị vui lòng thử lại sau."


def parse_message_to_filter(user_message: str) -> dict:
    """Dùng Gemini parse query người dùng thành filter JSON"""
    try:
        prompt = SYSTEM_PARSE_PROMPT.format(user_message=user_message)
        response = model.generate_content(prompt)

        # Gemini trả về text JSON
        import json
        try:
            filters = json.loads(response.text)
            return filters
        except json.JSONDecodeError:
            print("❌ Gemini trả về JSON không hợp lệ:", response.text)
            return {}
    except Exception as e:
        print("🔥 GEMINI PARSE ERROR >>>", e)
        return {}
