from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import services.cart_service as _cs, schemas
import services.user_service as _us
from database import get_db

router = APIRouter()


@router.post("/cart/add", response_model=schemas.CartBase, tags=["cart"])
def add_good_to_cart(
    cart: schemas.CartCreate,
    db: Session = Depends(get_db),
    user: schemas.User = Depends(_us.get_current_user),
):
    try:
        # Перевірка кількості
        if cart.quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Кількість товару має бути більше 0",
            )
        
        # Перевіряємо, чи товар вже у кошику
        existing_cart_item = _cs.get_cart_by_goods_id(db=db, goods_id=cart.goods_id, user_id=user.id)
        if existing_cart_item is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Товар вже є у кошику",
            )
        
        # Додаємо новий товар до кошика
        new_cart = _cs.add_good_to_cart(db=db, cart=cart, user_id=user.id)
        return new_cart

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Не вдалося додати товар до кошика: {str(e)}",
        )

@router.get("/cart", response_model=list[schemas.CartBase], tags=["cart"])
def get_user_cart(
    db: Session = Depends(get_db),
    user: schemas.User = Depends(_us.get_current_user),
):
    return _cs.get_user_cart(db=db, user_id=user.id)

@router.put("/cart/update/{cart_id}", response_model=schemas.CartBase, tags=["cart"])
def update_cart_quantity(
    cart_id: int,
    cart: schemas.CartUpdate,
    db: Session = Depends(get_db),
    user: schemas.User = Depends(_us.get_current_user),
):
    try:
        if cart.quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Кількість товару має бути більше 0",
            )
        updated_cart = _cs.update_cart_quantity(db=db, cart_id=cart_id, cart=cart, user_id=user.id)
        return updated_cart
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Не вдалося оновити кількість товару в кошику: {str(e)}",
        )

@router.delete("/cart/delete/{cart_id}", response_model=schemas.CartBase, tags=["cart"])
def delete_cart(
    cart_id: int,
    db: Session = Depends(get_db),
    user: schemas.User = Depends(_us.get_current_user),
):
    try:
        deleted_cart = _cs.delete_cart(db=db, cart_id=cart_id, user_id=user.id)
        return deleted_cart
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Не вдалося видалити товар з кошика: {str(e)}",
        )

@router.get("/cart/length", response_model=int, tags=["cart"])
def get_cart_length(
    db: Session = Depends(get_db),
    user: schemas.User = Depends(_us.get_current_user),
):
    return _cs.get_cart_length(db=db, user_id=user.id)