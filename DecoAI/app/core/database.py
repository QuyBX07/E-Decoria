from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# pool_pre_ping=True: Giúp tự động kết nối lại nếu MySQL bị ngắt kết nối (lỗi MySQL server has gone away)
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency để lấy DB session (dùng cho các API cần thao tác CRUD trực tiếp nếu cần)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()