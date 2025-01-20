from sqlalchemy.orm import Session
import models, schemas

def create_update_review(db: Session, goods_id: int, review: schemas.ReviewUpdate, user_id: int):
    db_review = db.query(models.Review).filter(models.Review.goods_id == goods_id, models.Review.user_id == user_id).first()
    if not db_review:
        db_review = models.Review(
            user_id=user_id,
            goods_id=goods_id,
            rating=review.rating,
            comment=review.comment,
            images_path=review.images_path
        )
        db.add(db_review)
    else:
        if review.rating:
            db_review.rating = review.rating
        if review.comment:
            db_review.comment = review.comment
        if review.images_path:
            db_review.images_path = review.images_path
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews_by_goods_id(db: Session, goods_id: int):
    return db.query(models.Review).filter(models.Review.goods_id == goods_id).all()


def average_rating(db: Session, goods_id: int):
    reviews = db.query(models.Review).filter(models.Review.goods_id == goods_id).all()
    if not reviews:
        return 0
    return sum([review.rating for review in reviews]) / len(reviews)

def delete_review(db: Session, goods_id: int, user_id: int):
    db_review = db.query(models.Review).filter(models.Review.goods_id == goods_id, models.Review.user_id == user_id).first()
    if db_review:
        db.delete(db_review)
        db.commit()
        return True
    return False