def build_product_context(products: list) -> str:
    if not products:
        return (
            "Hiện tại Decoria không có sản phẩm phù hợp với yêu cầu của khách hàng."
        )

    lines = ["Danh sách sản phẩm hiện có tại Decoria:"]
    for i, p in enumerate(products, 1):
        lines.append(
            f"{i}. {p['name']} – "
            f"giá {int(p['price']):,}đ, "
            f"chất liệu {p.get('material', 'đang cập nhật')}, "
            f"màu sắc {p.get('color', 'đang cập nhật')}, "
            f"phong cách {p.get('style', 'đang cập nhật')}, "
            f"còn {p['stock']} sản phẩm"
        )

    return "\n".join(lines)
