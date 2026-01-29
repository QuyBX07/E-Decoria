#service/normalize_service.py
def normalize_product_entities(entities: dict) -> dict:
    """
    Chuẩn hoá entities ngôn ngữ → filter cho product query
    """
    filters = {}

    # --- 1. Keyword ---
    keyword = entities.get("keyword")
    if isinstance(keyword, str) and len(keyword.split()) <= 3:
        filters["keyword"] = keyword.strip()

    # --- 2. Giá ---
    min_price = entities.get("min_price")
    max_price = entities.get("max_price")

    if isinstance(min_price, (int, float)):
        filters["min_price"] = min_price

    if isinstance(max_price, (int, float)):
        filters["max_price"] = max_price

    # --- 3. Color ---
    color = entities.get("color")
    if isinstance(color, str):
        filters["color"] = color.strip()

    # --- 4. Material (NEW) ---
    material = entities.get("material")
    if isinstance(material, str):
        filters["material"] = material.strip()

    # --- 5. Style (NEW – ưu tiên explicit) ---
    style = entities.get("style")
    if isinstance(style, str):
        filters["style"] = style.strip()

    # --- 6. Constraint ngữ nghĩa (fallback) ---
    constraints = entities.get("constraints", [])

    if isinstance(constraints, list) and "style" not in filters:
        for c in constraints:
            c = c.lower()

            if "phòng khách nhỏ" in c or "căn hộ nhỏ" in c:
                filters["style"] = "compact"

            elif "hiện đại" in c:
                filters["style"] = "modern"

    return filters

