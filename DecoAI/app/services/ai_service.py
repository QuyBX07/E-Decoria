# app/services/ai_service.py
from google import genai
from app.core.config import settings
from app.core.prompt import SYSTEM_INSTRUCTION, SYSTEM_PARSE_PROMPT
import json

# ================================
# Khởi tạo Gemini Client (SDK MỚI)
# ================================
client = genai.Client(
    api_key=settings.GOOGLE_API_KEY
)

MODEL_NAME = "gemini-2.5-flash"


def chat_with_ai(user_message: str) -> str:
    """
    Chat hội thoại thông thường (không parse intent)
    """
    try:
        prompt = f"""{SYSTEM_INSTRUCTION}

Khách hàng: {user_message}
"""

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        return response.text

    except Exception as e:
        print("🔥 GEMINI CHAT ERROR >>>", repr(e))
        return "Xin lỗi, hiện tại tôi không thể trả lời. Anh/Chị vui lòng thử lại sau."


def parse_message_to_filter(user_message: str) -> dict:
    try:
        prompt = SYSTEM_PARSE_PROMPT.format(user_message=user_message)

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        raw_text = response.text.strip()

        if raw_text.startswith("```"):
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        data = json.loads(raw_text)

        entities = data.get("entities", {})

        if not isinstance(entities, dict):
            entities = {}

        return {
            "entities": entities
        }

    except Exception as e:
        print("🔥 GEMINI PARSE ERROR >>>", repr(e))
        return {
            "entities": {}
        }

