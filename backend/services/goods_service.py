from sqlalchemy.orm import Session
import models, schemas


def create_goods(db: Session, goods: schemas.GoodsCreate, seller_id: int):
    db_goods = models.Goods(
        name=goods.name,
        description=goods.description,
        price=goods.price,
        images_path=goods.images_path,
        specification=goods.specification,
        goods_type=goods.goods_type,
        category=goods.category,
        quantity=goods.quantity,
        discount=goods.discount,
        seller_id=seller_id,
    )
    db.add(db_goods)
    db.commit()
    db.refresh(db_goods)
    return db_goods


def update_goods(
    db: Session, goods_id: int, goods: schemas.GoodsUpdate, seller_id: int
):
    db_goods = (
        db.query(models.Goods)
        .filter(models.Goods.id == goods_id, models.Goods.seller_id == seller_id)
        .first()
    )
    if not db_goods:
        return None
    if goods.name:
        db_goods.name = goods.name
    if goods.description:
        db_goods.description = goods.description
    if goods.price:
        db_goods.price = goods.price
    if goods.images_path:
        db_goods.images_path = goods.images_path
    if goods.specification:
        db_goods.specification = goods.specification
    if goods.goods_type:
        db_goods.goods_type = goods.goods_type
    if goods.category:
        db_goods.category = goods.category
    if goods.discount:
        db_goods.discount = goods.discount
    if goods.quantity:
        db_goods.quantity = goods.quantity
    db.commit()
    db.refresh(db_goods)
    return db_goods


def get_all_goods(
    db: Session,
    limit: int,
    offset: int,
    category: str,
    min_price: float,
    max_price: float,
):
    if category:
        return (
            db.query(models.Goods)
            .filter(models.Goods.category == category)
            .limit(limit)
            .offset(offset)
            .all()
        )
    if min_price and max_price:
        return (
            db.query(models.Goods)
            .filter(models.Goods.price >= min_price, models.Goods.price <= max_price)
            .limit(limit)
            .offset(offset)
            .all()
        )
    return db.query(models.Goods).limit(limit).offset(offset).all()

def get_goods(db: Session,limit: int, ):
    goods_types = db.query(models.Goods.goods_type).distinct().all()
    
    result = []
    for goods_type in goods_types:
        type_name = goods_type[0]
        goods_list = db.query(models.Goods).filter(models.Goods.goods_type == type_name).limit(limit).all()
        # Перетворюємо кожен товар на схему Pydantic
        result.extend([schemas.Goods.from_orm(goods) for goods in goods_list])
    
    return result

def search_goods(db: Session, query: str, limit: int, offset: int):
    return (
        db.query(models.Goods)
        .filter(models.Goods.name.ilike(f"%{query}%"))
        .offset(offset)
        .limit(limit)
        .all()
    )


def get_discounted_goods(db: Session):
    return db.query(models.Goods).filter(models.Goods.discount > 0).all()


def compare_goods(db: Session, goods_ids: list[int]):
    return db.query(models.Goods).filter(models.Goods.id.in_(goods_ids)).all()


def get_goods_by_category(db: Session, category: str):
    return db.query(models.Goods).filter(models.Goods.category == category).all()


def get_goods_by_category_and_type(db: Session, category: str, goods_type: str):
    return (
        db.query(models.Goods)
        .filter(
            models.Goods.category == category, models.Goods.goods_type == goods_type
        )
        .all()
    )


def get_goods_by_id(db: Session, goods_id: int):
    return db.query(models.Goods).filter(models.Goods.id == goods_id).first()


def get_goods_by_seller_id(db: Session, seller_id: int):
    return db.query(models.Goods).filter(models.Goods.seller_id == seller_id).all()


def get_my_goods(db: Session, seller_id: int):
    return db.query(models.Goods).filter(models.Goods.seller_id == seller_id).all()


def delete_goods(db: Session, goods_id: int, seller_id: int):
    db_goods = (
        db.query(models.Goods)
        .filter(models.Goods.id == goods_id, models.Goods.seller_id == seller_id)
        .first()
    )
    if not db_goods:
        return None
    db.delete(db_goods)
    db.commit()
    return db_goods


def upload_json_to_parse(db: Session, seller_id: int, contents: dict):
    goods_list = []  # Список для збереження доданих товарів
    try:
        for item in contents.values():  # Перебираємо значення вмісту
            db_goods = models.Goods(
                name=item["name"],
                description=item["description"],
                price=item["price"],
                images_path=item["images_path"],
                specification=item["specification"],
                goods_type=item["goods_type"],
                category=item["category"],
                quantity=item.get(
                    "quantity", 0
                ),  # Якщо поле відсутнє, використовуємо 0
                discount=item["discount"],
                seller_id=seller_id,
            )
            db.add(db_goods)
            db.commit()
            db.refresh(db_goods)
            goods_list.append(db_goods)
        return goods_list  # Повертаємо список всіх доданих товарів
    except Exception as e:
        return None


def get_goods_categories(db: Session):
    categories = []
    category = db.query(models.Goods.category).distinct().all()
    for i in category:
        categories.append(i[0])
    return categories

def get_goods_type(db: Session):
    goods_types = []
    goods_type = db.query(models.Goods.goods_type).distinct().all()
    for i in goods_type:
        goods_types.append(i[0])
    goods_types.sort()
    return goods_types

def get_higest_price(db: Session):
    return db.query(models.Goods).order_by(models.Goods.price.desc()).first()