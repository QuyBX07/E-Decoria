# app/services/product.py
from sqlalchemy import text
from app.core.database import engine

def search_products_dynamic(
    keyword: str = None,
    min_price: float = None,
    max_price: float = None,
    color: str = None,
    material: str = None,
    style: str = None
):
    sql_query = """
        SELECT 
            name, 
            description, 
            price, 
            stock, 
            color, 
            material, 
            style, 
            image_url
        FROM products
        WHERE is_active = 1 AND stock > 0
    """
    params = {}

    if keyword:
        sql_query += " AND (name LIKE :kw OR description LIKE :kw OR material LIKE :kw OR style LIKE :kw)"
        params["kw"] = f"%{keyword}%"

    if min_price is not None:
        sql_query += " AND price >= :min_price"
        params["min_price"] = min_price

    if max_price is not None:
        sql_query += " AND price <= :max_price"
        params["max_price"] = max_price

    if color:
        sql_query += " AND color LIKE :color"
        params["color"] = f"%{color}%"

    if material:
        sql_query += " AND material LIKE :material"
        params["material"] = f"%{material}%"

    if style:
        sql_query += " AND style LIKE :style"
        params["style"] = f"%{style}%"

    sql_query += " LIMIT 10"

    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql_query), params)
            products = []
            for row in result:
                item = dict(row._mapping)
                if item.get("price"):
                    item["price"] = float(item["price"])
                products.append(item)

            if not products:
                return "Hệ thống: Không tìm thấy sản phẩm nào khớp với yêu cầu."
            return products

    except Exception as e:
        return f"Hệ thống gặp lỗi truy vấn: {str(e)}"
