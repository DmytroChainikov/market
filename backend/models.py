from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name  = Column(String)
    address = Column(String)
    profile_image = Column(String)
    language = Column(String, default="uk")
    verification_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    is_verified = Column(Integer, default=0)
    favorite_goods = Column(String)
    view_history = Column(String)
    
    goods = relationship("Goods", back_populates="seller", cascade="all, delete")
    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    cart = relationship("Cart", back_populates="user", cascade="all, delete")

class Cart(Base):
    __tablename__ = "cart"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    goods_id = Column(Integer, ForeignKey("goods.id"))
    quantity = Column(Integer)
    
    user = relationship("User", back_populates="cart")
    goods = relationship("Goods")
    
class Goods(Base):
    __tablename__ = "goods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    images_path = Column(String)
    description = Column(String)
    specification = Column(String)
    goods_type = Column(String) 
    category = Column(String) 
    price = Column(Float)
    discount = Column(Float, default=0)
    quantity = Column(Integer)
    seller_id = Column(Integer, ForeignKey("users.id"))

    seller = relationship("User", back_populates="goods")
    reviews = relationship("Review", back_populates="goods", cascade="all, delete")

class Promocodes(Base):
    __tablename__ = "promocodes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String)
    discount = Column(Float)
    available_for = Column(JSON)
    using_left = Column(Integer)
    expiration_date = Column(DateTime)
    avaible = Column(Integer)
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    order_date = Column(DateTime, default=datetime)
    tracking_number = Column(String)
    status = Column(String)
    confirmed_at = Column(DateTime, nullable=True)
    sum_to_pay = Column(Float)
    promocode = Column(String, nullable=True)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    order_id = Column(Integer, ForeignKey("orders.id"), primary_key=True)
    goods_id = Column(Integer, ForeignKey("goods.id"), primary_key=True)
    quantity = Column(Integer)

    order = relationship("Order", back_populates="items")
    goods = relationship("Goods")

class Review(Base):
    __tablename__ = "reviews"

    goods_id = Column(Integer, ForeignKey("goods.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    images_path = Column(String)
    rating = Column(Integer)
    comment = Column(String)

    goods = relationship("Goods", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
