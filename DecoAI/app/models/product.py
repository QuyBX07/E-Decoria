#model/product.py
from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, TIMESTAMP, BINARY
from sqlalchemy.sql import func
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    # 1. id: binary(16) -> Thường dùng để lưu UUID
    id = Column(BINARY(16), primary_key=True)

    # 2. name: varchar(150)
    name = Column(String(150), nullable=False)

    # 3. description: text (nullable)
    description = Column(Text, nullable=True)

    # 4. price: decimal(38,2) -> Dùng Numeric trong SQLAlchemy
    price = Column(Numeric(38, 2), nullable=False)

    # 5. stock: int (default 0)
    stock = Column(Integer, default=0)

    # 6. color: varchar(255)
    color = Column(String(255), nullable=True)

    # 7. material: varchar(255)
    material = Column(String(255), nullable=True)

    # 8. style: varchar(255)
    style = Column(String(255), nullable=True)

    # 9. image_url: varchar(255)
    image_url = Column(String(255), nullable=True)

    # 10. category_id: binary(16) (nullable)
    category_id = Column(BINARY(16), nullable=True)

    # 11. is_active: tinyint(1) -> SQLAlchemy map thành Boolean
    is_active = Column(Boolean, default=True)

    # 12. created_at: timestamp
    created_at = Column(TIMESTAMP, server_default=func.now())

    # 13. updated_at: timestamp (tự động update)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())