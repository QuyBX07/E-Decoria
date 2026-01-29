#service/voucher_service.py
from sqlalchemy import text
from app.core.database import engine
from datetime import datetime


def get_available_vouchers(
    order_amount: float | None = None,
    limit: int = 5
):
    """
    Lấy voucher đang khả dụng
    """

    sql = """
        SELECT 
            code,
            description,
            discount_type,
            discount_value,
            min_order_value,
            start_date,
            end_date
        FROM vouchers
        WHERE status = 'ACTIVE'
          AND start_date <= :now
          AND end_date >= :now
    """

    params = {
        "now": datetime.now(),
        "limit": limit
    }

    if order_amount is not None:
        sql += " AND (min_order_value IS NULL OR min_order_value <= :order_amount)"
        params["order_amount"] = order_amount

    sql += " ORDER BY created_at DESC LIMIT :limit"

    with engine.connect() as conn:
        vouchers = [
            dict(row._mapping)
            for row in conn.execute(text(sql), params)
        ]

    if not vouchers:
        return "Hiện tại không có voucher phù hợp."

    return vouchers
