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

@router.get("/goods", response_model=list[schemas.Goods], tags=["goods"])
def read_all_goods(
    db: Session = Depends(get_db),
    limit: int = 10,
    offset: int = 0,
    category: str = None,
    min_price: float = None,
    max_price: float = None,
):
    goods = _gd.get_all_goods(
        db=db, limit=limit, offset=offset, category=category, min_price=min_price, max_price=max_price
    )
    return goods

@router.get("/goods/search", response_model=list[schemas.Goods], tags=["goods"])
def search_goods(
    query: str,
    db: Session = Depends(get_db),
):
    goods = _gd.search_goods(db=db, query=query)
    if not goods:
        raise HTTPException(status_code=404, detail="Товари не знайдено")
    return goods

@router.get("/goods/discounted", response_model=list[schemas.Goods], tags=["goods"])
def get_discounted_goods(
    db: Session = Depends(get_db),
):
    return _gd.get_discounted_goods(db=db)

@router.post("/goods/compare", response_model=list[schemas.Goods], tags=["goods"])
def compare_goods(
    goods_ids: list[int],
    db: Session = Depends(get_db),
):
    return _gd.compare_goods(db=db, goods_ids=goods_ids)

@router.get("/goods/category/{category}", response_model=list[schemas.Goods], tags=["goods"])
def get_goods_by_category(
    category: str,
    db: Session = Depends(get_db),
):
    return _gd.get_goods_by_category(db=db, category=category)

@router.get("/goods/get_goods_by_id_unauthorized", response_model=schemas.Goods, tags=["goods"])
def read_goods_by_id_unauthorized(
    goods_id: int,
    db: Session = Depends(get_db),
):
    goods = _gd.get_goods_by_id(db=db, goods_id=goods_id)
    if goods is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Товар не знайдено"
        )
    return goods
@router.get("/goods/get_goods_by_id", response_model=schemas.Goods, tags=["goods"])
def read_goods_by_id(
    goods_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(_us.get_current_user),
):
    goods = _gd.get_goods_by_id(db=db, goods_id=goods_id)
    if current_user:
        _us.update_user_view_history(db=db, user_id=current_user.id, goods_id=goods_id)
    if goods is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Товар не знайдено"
        )
    return goods

@router.get("/goods/get_goods_by_seller_id", response_model=list[schemas.Goods], tags=["goods"])
def read_goods_by_seller_id(
    seller_id: int,
    db: Session = Depends(get_db)
):
    goods = _gd.get_goods_by_seller_id(db=db, seller_id=seller_id)
    if goods is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Товари не знайдено"
        )
    return goods

@router.get("/goods/get_my_goods", response_model=list[schemas.Goods], tags=["goods"])
def read_get_my_goods(
    db: Session = Depends(get_db),
    seller: schemas.User = Depends(_us.get_current_user),
):
    goods = _gd.get_my_goods(db=db, seller_id=seller.id)
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
    
@router.delete("/goods/delete", response_model=schemas.Goods, tags=["goods"])
def delete_goods(
    goods_id: int,
    db: Session = Depends(get_db),
    seller: schemas.User = Depends(_us.get_current_user),
):
    try:
        deleted_goods = _gd.delete_goods(db=db, goods_id=goods_id, seller_id=seller.id)
        return deleted_goods
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Не вдалося видалити товар: {str(e)}",
        )