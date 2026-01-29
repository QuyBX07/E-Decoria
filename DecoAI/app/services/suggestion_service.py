from typing import List
from app.session.session_context import SessionContext


# =========================
# Default suggestions
# =========================
def default_suggestions() -> List[str]:
    """
    Gợi ý khi user mới vào hoặc chưa có context rõ ràng
    """
    return [
        "Tìm sofa",
        "Tìm bàn ăn trên 5 triệu",
        "Tìm ghế chất liệu nỉ",
        "Shop đang có khuyến mãi gì?"
    ]


# =========================
# Product search suggestions
# =========================
def product_search_suggestions(session: SessionContext) -> List[str]:
    """
    Gợi ý sau khi search sản phẩm
    """
    products = session.last_products
    total = len(products)

    if total == 0:
        return [
            "Thử tìm sofa",
            "Tìm sản phẩm khác",
            "Có voucher nào không?"
        ]

    suggestions = [
        "Đánh giá sản phẩm đầu tiên",
        "Sản phẩm nào rẻ nhất?",
        "Có mẫu nào nhỏ gọn cho căn hộ không?"
    ]

    if total >= 2:
        suggestions.append("So sánh sản phẩm 1 và 2")

    if total >= 3:
        suggestions.append("Sản phẩm bán chạy nhất là mẫu nào?")

    return suggestions


# =========================
# Product detail suggestions
# =========================
def product_detail_suggestions(session: SessionContext) -> List[str]:
    """
    Gợi ý khi user đang hỏi về 1 sản phẩm cụ thể
    """
    if not session.current_product:
        return []

    return [
        "Giá sản phẩm này bao nhiêu?",
        "Đánh giá của sản phẩm này",
        "Có màu khác không?",
        "Chính sách bảo hành thế nào?"
    ]


# =========================
# Voucher suggestions
# =========================
def voucher_suggestions() -> List[str]:
    return [
        "Voucher này áp dụng thế nào?",
        "Voucher dùng được cho sofa không?",
        "Có voucher nào khác không?"
    ]


# =========================
# Main builder
# =========================
def build_suggestions(
    intent: str | None,
    session: SessionContext
) -> List[str]:
    """
    Trung tâm điều phối suggestion theo intent + session
    """
    if not intent:
        return default_suggestions()

    if intent == "search_product":
        return product_search_suggestions(session)

    if intent in ("ask_product_detail", "ask_review"):
        return product_detail_suggestions(session)

    if intent == "ask_voucher":
        return voucher_suggestions()

    return default_suggestions()
