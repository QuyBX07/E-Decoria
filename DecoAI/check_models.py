import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API Key
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ Chưa có API Key trong file .env")
else:
    genai.configure(api_key=api_key)

    print(f"--- ĐANG LẤY DANH SÁCH MODEL CHO KEY: ...{api_key[-5:]} ---")

    try:
        print("\nCác model bạn có thể dùng:")
        # Liệt kê tất cả model
        for m in genai.list_models():
            # Chỉ lấy các model hỗ trợ chat/tạo nội dung
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")

    except Exception as e:
        print(f"❌ Lỗi: {e}")