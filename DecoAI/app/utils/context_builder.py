#utils/context_builder.py
from typing import List, Dict, Any


# ================= PRODUCT CONTEXT =================
def build_product_context(products: List[Dict[str, Any]]) -> str:
    """
    Build context mô tả danh sách sản phẩm cho AI
    """
    if not products:
        return (
            "Hiện tại Decoria không có sản phẩm nào phù hợp với yêu cầu của khách hàng."
        )

    lines = [
        "Danh sách sản phẩm hiện có tại Decoria (dữ liệu chính xác từ hệ thống):"
    ]

    for idx, p in enumerate(products, 1):
        price = f"{int(p['price']):,} VNĐ" if p.get("price") else "đang cập nhật"
        stock = p.get("stock", 0)

        lines.append(
            f"{idx}. {p.get('name')} – "
            f"giá {price}, "
            f"chất liệu {p.get('material', 'đang cập nhật')}, "
            f"màu sắc {p.get('color', 'đang cập nhật')}, "
            f"phong cách {p.get('style', 'đang cập nhật')}, "
            f"còn {stock} sản phẩm."
        )

    lines.append(
        "\nHướng dẫn trả lời:\n"
        "- Chỉ tư vấn dựa trên danh sách trên\n"
        "- Không bịa thêm sản phẩm ngoài hệ thống\n"
        "- Trả lời ngắn gọn, lịch sự, xưng hô Em – Anh/Chị"
    )

    return "\n".join(lines)


# ================= REVIEW CONTEXT =================
def build_review_context(review_data: Dict[str, Any]) -> str:
    """
    Build context đánh giá sản phẩm cho AI
    """
    if not review_data:
        return "Sản phẩm này hiện chưa có đánh giá nào."

    avg_rating = review_data.get("avg_rating", "N/A")
    summary = review_data.get("summary", {})
    reviews = review_data.get("reviews", [])

    lines = [
        "Thông tin đánh giá sản phẩm (dữ liệu chính xác từ hệ thống):",
        f"- Điểm đánh giá trung bình: {avg_rating}⭐"
    ]

    if summary:
        lines.append("- Thống kê số sao:")
        for star in sorted(summary.keys(), reverse=True):
            lines.append(f"  + {star}⭐: {summary[star]} lượt")

    if reviews:
        lines.append("\nMột số nhận xét gần đây của khách hàng:")
        for r in reviews[:5]:
            rating = r.get("rating", "?")
            comment = r.get("comment", "").strip()
            if comment:
                lines.append(f"- {rating}⭐: {comment}")

    lines.append(
        "\nHướng dẫn trả lời:\n"
        "- Tóm tắt đánh giá một cách khách quan\n"
        "- Không tự thêm nhận xét cá nhân\n"
        "- Khuyến khích khách xem chi tiết hoặc hỏi thêm"
    )

    return "\n".join(lines)


# ================= VOUCHER CONTEXT =================
def build_voucher_context(vouchers: List[Dict[str, Any]]) -> str:
    """
    Build context voucher cho AI
    """
    if not vouchers:
        return "Hiện tại Decoria không có voucher nào khả dụng."

    lines = [
        "Danh sách voucher hiện đang áp dụng tại Decoria:"
    ]

    for v in vouchers:
        discount_type = v.get("discount_type")
        discount_value = v.get("discount_value")
        min_order = v.get("min_order_value")

        if discount_type == "PERCENT":
            discount = f"giảm {discount_value}%"
        else:
            discount = f"giảm {int(discount_value):,} VNĐ"

        min_order_text = (
            f", áp dụng cho đơn từ {int(min_order):,} VNĐ"
            if min_order else ""
        )

        lines.append(
            f"- Mã {v.get('code')}: {discount}{min_order_text}"
        )

    lines.append(
        "\nHướng dẫn trả lời:\n"
        "- Giải thích ngắn gọn từng voucher\n"
        "- Không tự tạo mã mới\n"
        "- Có thể gợi ý voucher phù hợp nhất cho khách"
    )

    return "\n".join(lines)

