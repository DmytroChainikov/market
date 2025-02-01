from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict

class UserBase(BaseModel):
    email: str
    phone: str
    name: str
    
class UserCreate(UserBase):
    hashed_password: str

class UserUpdate(UserBase):
    email: Optional[str] = None
    name: Optional[str] = None
    hashed_password: Optional[str] = None
    language: Optional[str] = None
    address: Optional[str] = None
    profile_image: Optional[str] = None
    phone: Optional[str] = None

class UserHistory(BaseModel):
    goods: List[int]
    
    class Config:
        from_attributes = True

class UserFavorite(BaseModel):
    goods: List[int]
    
    class Config:
        from_attributes = True

class User(UserBase):
    id: int
    language: Optional[str] = "uk"
    phone: Optional[str] = None
    verification_code: Optional[int] = None
    is_verified: int
    created_at: datetime = datetime.now()
    favorite_goods: Optional[str] = ""
    view_history: Optional[str] = ""
    profile_image: Optional[str] = None
    address: Optional[str] = None

    class Config:
        from_attributes = True

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str        

class Token(BaseModel):
    email: str | None = None
    
class CartBase(BaseModel):
    user_id: int
    goods_id: int
    quantity: int
    
class CartCreate(BaseModel):
    goods_id: int
    quantity: int

class CartUpdate(BaseModel):
    quantity: Optional[int] = None 


class GoodsBase(BaseModel):
    name: str
    images_path: List[str]
    description: str
    specification: dict
    goods_type: str
    category: str
    quantity: int
    discount: float
    price: float

class GoodsCreate(GoodsBase):
    pass

class GoodsUpdate(BaseModel):
    name: Optional[str] = None
    images_path: Optional[List[str]] = None
    description: Optional[str] = None
    specification: Optional[dict] = None
    goods_type: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    discount: Optional[float] = None
    quantity: Optional[int] = 0

class Goods(GoodsBase):
    id: int
    seller_id: int

    class Config:
        from_attributes = True

class PromocodeBase(BaseModel):
    code: str
    discount: float
    available_for: dict
    using_left: int
    expiration_date: datetime
    avaible: bool

class PromocodeCreate(BaseModel):
    discount: float
    available_for: dict
    using_left: int
    expiration_date: datetime

# Order Schemas
class OrderItemBase(BaseModel):
    goods_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    order_id: int

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    order_date: datetime = None
    tracking_number: Optional[str] = ""
    status: Optional[str] = "в обробці"
    confirmed_at: Optional[datetime] = ""
    sum_to_pay: Optional[float] = 0.0
    promocode: Optional[str] = ""

class OrderCreate(BaseModel):
    promocode: Optional[str] = ""
    items: List[OrderItemCreate]

class OrderResponse(OrderBase):
    id: int
    user_id: int
    items: List[OrderItem] = []

    class Config:
        from_attributes = True
# Review Schemas
class ReviewBase(BaseModel):
    goods_id: int
    user_id: int
    rating: int
    images_path: str
    comment: str

class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    images_path: Optional[str] = ""
    comment: Optional[str] = None

class Review(ReviewBase):
    class Config:
        from_attributes = True
