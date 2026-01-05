import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DB_USER = os.getenv("DB_USER", "root")
    # Nếu password rỗng thì để trống
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3307")
    DB_NAME = os.getenv("DB_NAME", "decoria")

    # Tạo chuỗi kết nối cho SQLAlchemy (dùng driver pymysql)
    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


settings = Settings()