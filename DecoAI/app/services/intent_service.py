# app/services/intent_service.py

def detect_intent(message: str) -> str:
    msg = message.lower()

    if any(k in msg for k in [
        "voucher", "khuyến mãi", "mã giảm", "giảm giá"
    ]):
        return "ask_voucher"

    if any(k in msg for k in [
        "đánh giá", "review", "nhận xét"
    ]):
        return "ask_review"

    return "search_product"
