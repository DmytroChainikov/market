import models, schemas
from sqlalchemy.orm import Session
import json
from database import get_db


def get_products(db: Session = next(get_db())):
    products = db.query(models.Goods).all()
    cleaned_products = []

    for product in products:
        product_dict = schemas.Goods.from_orm(product).dict()
        product_dict.pop("images_path", None)  # Видаляємо поле "images_path", якщо є
        cleaned_products.append(product_dict)

    with open("products.json", "w", encoding="utf-8") as f:
        json.dump(cleaned_products, f, indent=4, ensure_ascii=False)
