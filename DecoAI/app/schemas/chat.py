# app/schemas/chat.py
from pydantic import BaseModel, Field
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str  # Nội dung user chat

class ProductResponse(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    color: Optional[str] = None
    material: Optional[str] = None
    style: Optional[str] = None
    image_url: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    products: List[ProductResponse] = []   # ✅ mutable default được xử lý chuẩn
