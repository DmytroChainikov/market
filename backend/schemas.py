from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

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


class User(UserBase):
    id: int
    language: Optional[str] = "uk"
    phone: Optional[str] = None
    verification_code: Optional[int] = None
    is_verified: int
    created_at: datetime = datetime.now()
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
    
class CartCreate(CartBase):
    pass

class CartUpdate(BaseModel):
    quantity: Optional[int] = None 

class Cart(CartBase):
    id: int

    class Config:
        from_attributes = True

class GoodsBase(BaseModel):
    name: str
    images_path: str
    description: str
    specification: str
    goods_type: str
    category: str
    discount: float
    price: float

class GoodsCreate(GoodsBase):
    pass

class GoodsUpdate(BaseModel):
    name: Optional[str] = None
    images_path: Optional[str] = None
    description: Optional[str] = None
    specification: Optional[str] = None
    goods_type: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    discount: Optional[float] = None
    quantity: Optional[int] = None

class Goods(GoodsBase):
    id: int
    seller_id: int

    class Config:
        from_attributes = True

# Order Schemas
class OrderBase(BaseModel):
    user_id: int
    status: Optional[str] = "В обробці"

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    tracking_number: Optional[str] = None
    confirmed_at: Optional[datetime] = None

class Order(OrderBase):
    id: int
    order_date: datetime

    class Config:
        from_attributes = True

# OrderItem Schemas
class OrderItemBase(BaseModel):
    order_id: int
    goods_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    pass

    class Config:
        from_attributes = True

class OrderItemUpdate(OrderItemBase):
    pass
# Review Schemas
class ReviewBase(BaseModel):
    goods_id: int
    user_id: int
    rating: int
    images_path: str
    comment: str

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    images_path: Optional[str] = ""
    comment: Optional[str] = None

class Review(ReviewBase):
    class Config:
        from_attributes = True
