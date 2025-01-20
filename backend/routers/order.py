from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import services.order_service as _or, schemas
import services.user_service as _us
from database import get_db

router = APIRouter()

@router.post("/order/create", response_model=schemas.OrderResponse, tags=["order"])
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db),
    user: schemas.User = Depends(_us.get_current_user),
):
    try:
        new_order = _or.create_order(db=db, order=order, user_id=user.id)
        return new_order
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Не вдалося створити замовлення: {str(e)}",
        )

@router.get("/order/get/{order_id}", response_model=schemas.OrderResponse, tags=["order"])
def get_order_by_id(
    order_id: int,
    db: Session = Depends(get_db),
    user: schemas.User = Depends(_us.get_current_user),
):
    order = _or.get_order_by_id(db=db, order_id=order_id, user_id=user.id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Замовлення не знайдено",
        )
    return order

@router.get("/order/get", response_model=list[schemas.OrderResponse], tags=["order"])
def get_orders(
    db: Session = Depends(get_db),
    user: schemas.User = Depends(_us.get_current_user),
):
    orders = _or.get_orders(db=db, user_id=user.id)
    return orders