#api/chat.py
import logging
from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse, ChatData, ProductResponse
from app.services.ai_service import parse_message_to_filter
from app.services.product_service import search_products_dynamic
from app.services.normalize_service import normalize_product_entities
from app.session.session_context import (
    get_session,
    update_product_session,
    resolve_product_from_message, log_session
)
from app.services.review_service import get_reviews_by_product
from app.services.voucher_service import get_available_vouchers
from app.services.intent_service import detect_intent

router = APIRouter()
session = get_session(session_id="demo_user")


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Tin nhắn không được để trống")

    intent = detect_intent(req.message)
    entities = {}


    # ================== SEARCH PRODUCT ==================
    if intent == "search_product":
        parsed_entities = parse_message_to_filter(req.message)
        entities = parsed_entities.get("entities", {})
        filters = normalize_product_entities(entities)
        products = search_products_dynamic(**filters)

        logger = logging.getLogger(__name__)

        # 🔍 Log entities parse được
        logger.warning("Entities parsed: %s", entities)

        if isinstance(products, str):
            return ChatResponse(
                intent=intent,
                reply=products,
                data=None
            )

        # ✅ Update session
        update_product_session(session, products)

        log_session(session, "AFTER SEARCH")

        return ChatResponse(
            intent=intent,
            reply=f"Em tìm thấy {len(products)} sản phẩm phù hợp.",
            data=ChatData(
                products=[ProductResponse(**p) for p in products]
            )
        )

    # ================== ASK PRODUCT DETAIL ==================
    if intent == "ask_product_detail":
        product = resolve_product_from_message(req.message, session)

        if not product:
            return ChatResponse(
                intent=intent,
                reply="Anh/Chị đang hỏi sản phẩm nào ạ?",
                data=None
            )

        return ChatResponse(
            intent=intent,
            reply="Thông tin chi tiết sản phẩm:",
            data=ChatData(
                product=ProductResponse(**product).dict()
            )
        )

    # ================== ASK REVIEW ==================
    if intent == "ask_review":
        logger = logging.getLogger(__name__)

        logger.warning("ASK_REVIEW MESSAGE >>> %s", req.message)

        log_session(session, "BEFORE RESOLVE REVIEW")

        product = resolve_product_from_message(req.message, session)

        log_session(session, "AFTER RESOLVE REVIEW")

        if not product or not product.get("id"):
            return ChatResponse(
                intent=intent,
                reply="Anh/Chị muốn xem đánh giá của sản phẩm nào ạ?",
                data=None
            )

        logger.warning(
            "FETCH REVIEW FOR PRODUCT >>> id=%s | name=%s",
            product.get("id"),
            product.get("name")
        )

        reviews = get_reviews_by_product(product["id"])

        if isinstance(reviews, str):
            return ChatResponse(
                intent=intent,
                reply=reviews,
                data=None
            )

        return ChatResponse(
            intent=intent,
            reply="Đây là đánh giá chi tiết của sản phẩm:",
            data=ChatData(reviews=reviews)
        )

    # ================== ASK VOUCHER ==================
    if intent == "ask_voucher":
        vouchers = get_available_vouchers()

        if isinstance(vouchers, str):
            return ChatResponse(
                intent=intent,
                reply=vouchers,
                data=None
            )

        return ChatResponse(
            intent=intent,
            reply="Hiện có các voucher sau:",
            data=ChatData(vouchers=vouchers)
        )

    if intent not in ["search_product", "ask_product_detail", "ask_review", "ask_voucher"]:
        return ChatResponse(
            intent="other",
            reply="Em chưa hiểu rõ yêu cầu, anh/chị có thể nói rõ hơn không?",
            data=None
        )


