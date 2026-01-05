import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ LỖI: Chưa có API Key.")
else:
    try:
        genai.configure(api_key=api_key)

        # --- SỬA DÒNG NÀY ---
        # Đổi từ 'gemini-1.5-flash' thành 'gemini-2.0-flash'
        model = genai.GenerativeModel('gemini-flash-latest')
        # --------------------

        print(f"⏳ Đang gửi tin nhắn test bằng model {model.model_name}...")
        response = model.generate_content("Chào Gemini, hãy nói 'Kết nối thành công' bằng tiếng Việt.")

        print("\n✅ KẾT QUẢ:")
        print(response.text)

    except Exception as e:
        print(f"\n❌ Lỗi: {e}")