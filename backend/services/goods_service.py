from sqlalchemy.orm import Session
import models, schemas


def create_goods(db: Session, goods: schemas.GoodsCreate, seller_id: int):
    db_goods = models.Goods(
        name=goods.name,
        description=goods.description,
        price=goods.price,
        images_path = goods.images_path,
        specification = goods.specification,
        goods_type = goods.goods_type,
        category = goods.category,
        discount = goods.discount,
        seller_id = seller_id
    )
    db.add(db_goods)
    db.commit()
    db.refresh(db_goods)
    return db_goods

def update_goods(db: Session, goods_id: int, goods: schemas.GoodsUpdate, seller_id: int):
    # filter by goods_id and seller_id
    db_goods = db.query(models.Goods).filter(models.Goods.id == goods_id, models.Goods.seller_id == seller_id).first()
    # db_goods = db.query(models.Goods).filter(models.Goods.id == goods_id).first()
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

def get_goods_by_id(db: Session, goods_id: int):
    return db.query(models.Goods).filter(models.Goods.id == goods_id).first()

def get_goods_by_seller(db: Session, seller_id: int):
    return db.query(models.Goods).filter(models.Goods.seller_id == seller_id).all()
