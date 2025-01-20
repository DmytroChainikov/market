from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from services import tool_service as _ts
import services.user_service as _us
from database import get_db
import schemas

router = APIRouter()

@router.post("/tool/generate_promocode", response_model=schemas.PromocodeCreate, tags=["tool"])
def generate_promocode(
    promocode_data: schemas.PromocodeCreate,
    db: Session = Depends(get_db),
    user: schemas.User = Depends(_us.get_current_user),
):
    return _ts.generate_promocode(promocode_data=promocode_data, db=db)


@router.get("/tool/get_promocode", response_model=schemas.PromocodeBase, tags=["tool"])
def get_promocode(
    promocode: str,
    db: Session = Depends(get_db)
):
    try:
        promocode_data = _ts.get_promocode(promocode=promocode, db=db)
        return promocode_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Промокод не знайдено: {str(e)}",
        )
        
        
@router.post("/tool/check_promocode", response_model=bool, tags=["tool"])
def check_promocode(
    promocode: str,
    order_items: schemas.OrderItemCreate,
    db: Session = Depends(get_db)
):
    return _ts.check_promocode(promocode=promocode, order_items=order_items, db=db)