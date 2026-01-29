from typing import Optional, List
from datetime import datetime
import re
import logging

logger = logging.getLogger("session")


class SessionContext:
    def __init__(self):
        self.current_product_id: Optional[str] = None
        self.current_product: Optional[dict] = None
        self.last_products: List[dict] = []
        self.last_product_ids: List[str] = []
        self.last_intent: Optional[str] = None
        self.updated_at: datetime = datetime.now()

    def __repr__(self):
        return (
            f"<SessionContext last_intent={self.last_intent} "
            f"last_products={len(self.last_products)} "
            f"current_product={self.current_product.get('name') if self.current_product else None}>"
        )


_sessions = {}


def get_session(session_id: str):
    if session_id not in _sessions:
        _sessions[session_id] = SessionContext()
    return _sessions[session_id]


def update_product_session(session: SessionContext, products: list):
    session.last_intent = "search_product"
    session.last_products = products
    session.last_product_ids = [p.get("id") for p in products if p.get("id")]

    if products:
        session.current_product = products[0]
        session.current_product_id = products[0].get("id")


def resolve_product_from_message(
    message: str,
    session: SessionContext
) -> Optional[dict]:
    msg = message.lower()
    total = len(session.last_products)

    if total == 0:
        return None

    # --- 1. "sản phẩm thứ 2", "số 3" ---
    match = re.search(r"(thứ|số)\s*(\d+)", msg)
    if match:
        idx = int(match.group(2)) - 1
        if 0 <= idx < total:
            session.current_product = session.last_products[idx]
            session.current_product_id = session.current_product.get("id")
            return session.current_product

    # --- 2. "sản phẩm đầu tiên", "cái đầu" ---
    if any(k in msg for k in [
        "đầu tiên", "cái đầu", "sản phẩm đầu"
    ]):
        session.current_product = session.last_products[0]
        session.current_product_id = session.current_product.get("id")
        return session.current_product

    # --- 3. "sản phẩm cuối cùng", "cái cuối" ---
    if any(k in msg for k in [
        "cuối cùng", "cái cuối", "sản phẩm cuối"
    ]):
        session.current_product = session.last_products[-1]
        session.current_product_id = session.current_product.get("id")
        return session.current_product

    # --- 4. Đại từ tham chiếu ---
    if any(k in msg for k in [
        "nó", "cái đó", "sản phẩm đó"
    ]):
        return session.current_product

    return None


def log_session(session: SessionContext, tag: str = ""):
    products = [
        f"{i+1}:{p.get('name')}"
        for i, p in enumerate(session.last_products)
    ]

    logger.warning(
        "%s SESSION >>> last_intent=%s | last_products=%s | current_product=%s",
        tag,
        session.last_intent,
        products,
        session.current_product.get("name") if session.current_product else None
    )
