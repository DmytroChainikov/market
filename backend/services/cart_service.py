from sqlalchemy.orm import Session
import models, schemas


def add_good_to_cart(db: Session, cart: schemas.CartCreate, user_id: int):
    try:
        db_cart = models.Cart(
            user_id=user_id,
            goods_id=cart.goods_id,
            quantity=cart.quantity
        )
        db.add(db_cart)
        db.commit()
        db.refresh(db_cart)
        return db_cart
    except Exception as e:
        print(f'помилка: {str(e)}')
        raise

def update_cart_quantity(db: Session, cart_id: int, cart: schemas.CartUpdate, user_id: int):
    db_cart = db.query(models.Cart).filter(models.Cart.id == cart_id, models.Cart.user_id == user_id).first()
    if not db_cart:
        return None
    if cart.quantity:
        db_cart.quantity = cart.quantity
    db.commit()
    db.refresh(db_cart)
    return db_cart

def get_user_cart(db: Session, user_id: int):
    return db.query(models.Cart).filter(models.Cart.user_id == user_id).all()

def get_cart_by_goods_id(db: Session, goods_id: int, user_id: int):
    return db.query(models.Cart).filter(models.Cart.goods_id == goods_id, models.Cart.user_id == user_id).first()

def delete_cart(db: Session, cart_id: int, user_id: int):
    db_cart = db.query(models.Cart).filter(models.Cart.id == cart_id, models.Cart.user_id == user_id).first()
    if not db_cart:
        return None
    db.delete(db_cart)
    db.commit()
    return db_cart