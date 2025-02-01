import random
from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime
import services.goods_service as _gd
import services.user_service as _us

# avaible_for = {'all': 'all', 'categorys': ['electronics','home'], 'goods_type': ['laptop', 'phones'], 'goods': [1,2,3,4,5,6], 'sellers': [1,2,3,4,5,6]}

def generate_promocode(db: Session, promocode_data: schemas.PromocodeCreate):
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz"
    promocode = ""
    for i in range(10):
        promocode += random.choice(chars)
    db_promocode = models.Promocodes(
        code=promocode,
        discount=promocode_data.discount,
        expiration_date=promocode_data.expiration_date,
        available_for=promocode_data.available_for,
        avaible=0,
        using_left=promocode_data.using_left
    )
    db.add(db_promocode)
    db.commit()
    db.refresh(db_promocode)
    return db_promocode

def get_promocode(db: Session, promocode: str):
    return db.query(models.Promocodes).filter(models.Promocodes.code == promocode).first()

def check_promocode(db: Session, promocode: str, order_items):
    if len(promocode) != 10:
        return False
    for i in promocode:
        if i not in "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz":
            return False
    if promocode == get_promocode(db, promocode).code:
        promocode_data = get_promocode(db, promocode)
        if promocode_data.avaible == False: 
            return False
        if promocode_data.using_left <= 0:
            return False
        if promocode_data.expiration_date < datetime.now():
            return False
        if "all" in promocode_data.available_for and promocode_data.available_for["all"] == "all":
            return True
        if "categorys" in promocode_data.available_for:
            for item in order_items:
                if item.category in promocode_data.available_for["categorys"]:
                    return True
        if "goods_type" in promocode_data.available_for:
            for item in order_items:
                if item.goods_type in promocode_data.available_for["goods_type"]:
                    return True
        if "goods" in promocode_data.available_for:
            for item in order_items:
                if item.id in promocode_data.available_for["goods"]:
                    return True
        if "sellers" in promocode_data.available_for:
            for item in order_items:
                if item.seller_id in promocode_data.available_for["sellers"]:
                    return True
    return False

def get_promocode_discount(db: Session, promocode: str):
    return db.query(models.Promocodes).filter(models.Promocodes.code == promocode).first().discount


def get_favorite_count(db: Session, user_id: int):
    user = _us.get_user(db=db, user_id=user_id)
    if user.favorite_goods == "":
        return 0
    return len(user.favorite_goods.split(','))