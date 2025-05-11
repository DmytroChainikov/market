import json
import numpy as np
from sklearn.feature_extraction import DictVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from services.user_service import get_user
from models import Goods
from schemas import Goods as GoodsSchema

def flatten_spec(spec: dict) -> dict:
    flat = {}
    for key, value in spec.items():
        if isinstance(value, list):
            for i, item in enumerate(value):
                flat[f"{key}_{i}"] = str(item)
        elif isinstance(value, dict):
            for subkey, subval in value.items():
                flat[f"{key}_{subkey}"] = str(subval)
        else:
            flat[key] = str(value)
    return flat

async def get_recommendations(db: AsyncSession, user_id: int, top_n: int = 5) -> list:
    # Отримуємо користувача та історію переглядів
    user = await get_user(db, user_id)
    if not user or not user.view_history:
        return []

    # Отримуємо переглянуті товари з бази
    history_ids = list(map(int, user.view_history.split(",")))
    result = await db.execute(select(Goods).where(Goods.id.in_(history_ids)))
    viewed_goods = result.scalars().all()

    if not viewed_goods:
        return []

    # Завантажуємо всі товари з локального JSON-файлу
    with open("static/goods_data.json", "r", encoding="utf-8") as f:
        all_goods_data = json.load(f)

    # Обмежуємо категорії на основі останніх переглянутих товарів
    recent_categories = set(g.category for g in viewed_goods[-10:])

    # Фільтруємо товари по категорії
    filtered_goods = [
        g for g in all_goods_data
        if g["category"] in recent_categories and g["id"] not in history_ids
    ]

    # Додаємо фільтрацію по назві (чохли, сумки тощо)
    filtered_goods = [
        g for g in filtered_goods
        if any(word in g["name"].lower() for word in ["чохол", "сумка"])
    ]

    # Фільтрація по ±30% від середньої ціни переглянутих товарів
    avg_price = np.mean([g.price for g in viewed_goods])
    price_min, price_max = avg_price * 0.7, avg_price * 1.3
    filtered_goods = [
        g for g in filtered_goods
        if price_min <= g["price"] <= price_max
    ]

    if not filtered_goods:
        return []

    # Векторизація специфікацій
    all_specs = [flatten_spec(g["specification"]) for g in filtered_goods]
    viewed_specs = [flatten_spec(g.specification) for g in viewed_goods]

    vectorizer = DictVectorizer(sparse=False)
    all_vectors = vectorizer.fit_transform(all_specs)
    viewed_vectors = vectorizer.transform(viewed_specs)
    avg_vector = np.mean(viewed_vectors, axis=0)

    # Косинусна схожість
    similarities = cosine_similarity([avg_vector], all_vectors)[0]
    scored_goods = sorted(
        zip(filtered_goods, similarities),
        key=lambda x: x[1],
        reverse=True
    )

    return scored_goods[:top_n]
