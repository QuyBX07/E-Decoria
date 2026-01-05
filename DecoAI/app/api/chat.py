# app/api/chat.py
from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse, ProductResponse
from app.services.ai_service import parse_message_to_filter
from app.services.product_service import search_products_dynamic

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Tin nhắn không được để trống")

    # --- parse user message thành filter ---
    filters = parse_message_to_filter(req.message)

    # --- query DB thật ---
    products = search_products_dynamic(
        keyword=filters.get("keyword"),
        min_price=filters.get("min_price"),
        max_price=filters.get("max_price"),
        color=filters.get("color"),
        material=filters.get("material"),
        style=filters.get("style")
    )

    # --- build response ---
    product_list = []
    reply_text = ""
    if isinstance(products, list):
        for p in products:
            product_list.append(ProductResponse(**p))
        reply_text = f"Em tìm thấy {len(products)} sản phẩm phù hợp với yêu cầu của Anh/Chị."
    else:
        # lỗi query hoặc không tìm thấy
        reply_text = products

    return ChatResponse(reply=reply_text, products=product_list)
