from sqlalchemy.orm import Session
import models, schemas, datetime
import services.cart_service as _cs
import services.tool_service as _ts
import services.goods_service as _gd



def create_order(db: Session, order: schemas.OrderCreate, user_id: int):
    discount = 0
    promocode_data = None
    if order.promocode:
        promocode_data = _ts.get_promocode(db, order.promocode)
        if _ts.check_promocode(db, order.promocode, order.items):
            discount = promocode_data.discount
            promocode_data.using_left -= 1
            db.commit()
            db.refresh(promocode_data)
        else:
            raise Exception("Промокод не підходить для цього замовлення")
    sum_to_pay = 0
    for item in order.items:
        goods = _gd.get_goods_by_id(db, item.goods_id)
        goods_discount = goods.discount if goods.discount else 0
        goods_price_after_discount = goods.price - goods.price * goods_discount / 100
        sum_to_pay += goods_price_after_discount * item.quantity
    sum_to_pay_after_discount = sum_to_pay - sum_to_pay * discount / 100
    db_order = models.Order(
        user_id=user_id,
        order_date=datetime.datetime.now(),
        tracking_number="",
        status="un paid",
        confirmed_at=None,
        sum_to_pay=sum_to_pay_after_discount,
        promocode=promocode_data.code if promocode_data else ""
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_order_item = models.OrderItem(
            order_id=db_order.id,
            goods_id=item.goods_id,
            quantity=item.quantity,
        )
        db.add(db_order_item)

    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session, user_id: int):
    return db.query(models.Order).filter(models.Order.user_id == user_id).all()

def get_order_by_id(db: Session, order_id: int, user_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id, models.Order.user_id == user_id).first()
