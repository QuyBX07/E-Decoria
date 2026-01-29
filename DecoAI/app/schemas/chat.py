#schemas/chat.py
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from uuid import UUID


class ChatRequest(BaseModel):
    message: str


class ProductResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    color: Optional[str] = None
    material: Optional[str] = None
    style: Optional[str] = None
    image_url: Optional[str] = None


class ChatData(BaseModel):
    products: Optional[List[ProductResponse]] = None
    reviews: Optional[Dict[str, Any]] = None
    vouchers: Optional[List[Dict[str, Any]]] = None
    product: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    intent: str
    reply: str
    data: Optional[ChatData] = None
    suggestions: Optional[List[str]] = None
