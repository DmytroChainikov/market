from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import services.goods_service as _gd, schemas
import services.user_service as _us
from database import get_db

router = APIRouter()

@router.post("/goods/create", response_model=schemas.Goods, tags=["goods"])
def create_goods(
    goods: schemas.GoodsCreate,
    db: Session = Depends(get_db),
    seller: schemas.User = Depends(_us.get_current_user),
):
    try:
        new_goods = _gd.create_goods(db=db, goods=goods, seller_id=seller.id)
        return new_goods
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Не вдалося створити товар: {str(e)}",
        )

@router.get("/goods/get_goods_by_id", response_model=schemas.Goods, tags=["goods"])
def read_goods_by_id(
    goods_id: int,
    db: Session = Depends(get_db),
):
    goods = _gd.get_goods_by_id(db=db, goods_id=goods_id)
    try:
        user = schemas.User = Depends(_us.get_current_user)
    except:
        user = None
    print(user)
    if user:
        print(user)
        # _us.update_user_view_history(db=db, user_id=user.id, goods_id=goods_id)
    if goods is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Товар не знайдено"
        )
    return goods

@router.get("/goods/get_goods_by_seller", response_model=list[schemas.Goods], tags=["goods"])
def read_goods_by_seller(
    db: Session = Depends(get_db),
    seller: schemas.User = Depends(_us.get_current_user),
):
    goods = _gd.get_goods_by_seller(db=db, seller_id=seller.id)
    if goods is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Товари не знайдено"
        )
    return goods

@router.put("/goods/update", response_model=schemas.Goods, tags=["goods"])
def update_goods(
    goods_id: int,
    goods: schemas.GoodsUpdate,
    db: Session = Depends(get_db),
    seller: schemas.User = Depends(_us.get_current_user),
):
    try:
        updated_goods = _gd.update_goods(db=db, goods_id=goods_id, goods=goods, seller_id=seller.id)
        return updated_goods
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Не вдалося оновити товар: {str(e)}",
        )