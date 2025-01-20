from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import services.reviews_service as _rs, schemas
import services.user_service as _us
from database import get_db

router = APIRouter()

@router.put("/reviews/{goods_id}", response_model=schemas.ReviewUpdate, tags=["reviews"])
def create_update_review(
    goods_id: int,
    review: schemas.ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(_us.get_current_user),
):
    if current_user:
        _rs.create_update_review(db=db, goods_id=goods_id, review=review, user_id=current_user.id)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Необхідно увійти в систему"
        )
    return review

@router.get("/reviews/{goods_id}", response_model=list[schemas.Review], tags=["reviews"])
def get_reviews_by_goods_id(
    goods_id: int,
    db: Session = Depends(get_db),
):
    return _rs.get_reviews_by_goods_id(db=db, goods_id=goods_id)


@router.get("/reviews/average_rating/{goods_id}", response_model=float, tags=["reviews"])
def average_rating(
    goods_id: int,
    db: Session = Depends(get_db),
):
    return _rs.average_rating(db=db, goods_id=goods_id)

@router.delete("/reviews/{goods_id}", response_model=bool, tags=["reviews"])
def delete_review(
    goods_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(_us.get_current_user),
):
    if current_user:
        return _rs.delete_review(db=db, goods_id=goods_id, user_id=current_user.id)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Необхідно увійти в систему"
        )