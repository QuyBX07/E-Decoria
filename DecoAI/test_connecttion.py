import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ LỖI: Chưa có API Key.")
    exit()

try:
    # ✅ SDK MỚI: dùng Client
    client = genai.Client(api_key=api_key)

    print("⏳ Đang gửi tin nhắn test ...")

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Chào Gemini, hãy trả lời: Kết nối thành công"
    )

    print("\n✅ KẾT QUẢ:")
    print(response.text)

except Exception as e:
    print("\n❌ LỖI KHI GỌI GEMINI:")
    print(e)
