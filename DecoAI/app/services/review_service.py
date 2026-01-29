#service/review_service.py
from sqlalchemy import text
from app.core.database import engine


def get_reviews_by_product(
    product_id: str,
    min_rating: int = 1,
    limit: int = 10
):
    """
    Lấy review của 1 sản phẩm + thống kê rating
    """

    # --- 1. Query list review ---
    review_sql = """
        SELECT 
            rating,
            comment,
            created_at
        FROM reviews
        WHERE product_id = UNHEX(:product_id)
          AND rating >= :min_rating
        ORDER BY created_at DESC
        LIMIT :limit
    """

    # --- 2. Query thống kê rating ---
    summary_sql = """
        SELECT 
            rating,
            COUNT(*) AS count
        FROM reviews
        WHERE product_id = UNHEX(:product_id)
        GROUP BY rating
        ORDER BY rating DESC
    """

    # --- 3. Query rating trung bình ---
    avg_sql = """
        SELECT ROUND(AVG(rating), 1) AS avg_rating
        FROM reviews
        WHERE product_id = UNHEX(:product_id)
    """

    params = {
        "product_id": product_id,
        "min_rating": min_rating,
        "limit": limit
    }

    with engine.connect() as conn:
        reviews = [
            dict(row._mapping)
            for row in conn.execute(text(review_sql), params)
        ]

        summary = {
            row.rating: row.count
            for row in conn.execute(text(summary_sql), params)
        }

        avg_rating = conn.execute(
            text(avg_sql), params
        ).scalar()

    if not reviews:
        return "Sản phẩm này chưa có đánh giá nào."

    return {
        "avg_rating": avg_rating,
        "summary": summary,
        "reviews": reviews
    }
