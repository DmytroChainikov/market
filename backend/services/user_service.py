import re
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import models, schemas, random, os
from database import get_db
from datetime import datetime, timedelta
import bcrypt
from jose import JWTError, jwt
from services.smtp_config import conf, FastMail, MessageSchema
from typing import Optional

load_dotenv("config.env")

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

# def update_password(db: Session, user_id: int, password: str):

def is_valid_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if re.match(pattern, email):
        return False
    else:
        return True

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email_or_phone(db: Session, username: str):
    email = db.query(models.User).filter(models.User.email == username).first()
    if email:
        return email
    else:
        return db.query(models.User).filter(models.User.phone == username).first()
     


def create_test_user(db: Session, user: schemas.User):
    db_user = models.User(
        email=user.email,
        name=user.name,
        phone = user.phone,
        hashed_password=hash_password(user.hashed_password),
        language="uk",
        verification_code='123456',
        view_history = "",
        profile_image = "default.jpg"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    user = db.query(models.User).filter(models.User.email == user.email).first()
    user.is_verified = 1
    user.verification_code = None
    db.commit()
    db.refresh(user)
    return db_user
    

async def create_user(db: Session, user: schemas.UserCreate):
    verification_code = str(random.randint(100000, 999999))
    db_user = models.User(
        email=user.email,
        name=user.name,
        phone = user.phone,
        hashed_password=hash_password(user.hashed_password),
        language="uk",
        verification_code=verification_code,
        view_history = "",
        profile_image = "default.jpg"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    await send_verification_email(user.email, verification_code)
    return db_user

def update_user(db: Session, user_id: int, user: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    if user.name:
        print(user.name)
        db_user.name = user.name
    if user.email:
        db_user.email = user.email
    if user.language:
        db_user.language = user.language
    if user.hashed_password:
        db_user.hashed_password = hash_password(user.hashed_password)
    if user.address:
        db_user.address = user.address
    if user.profile_image:
        db_user.profile_image = user.profile_image
    if user.phone:
        db_user.phone = user.phone
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    db.delete(db_user)
    db.commit()
    return db_user

async def send_verification_email(recipient_email: str, verification_code: str):
    subject = "Верифікація облікового запису"
    body = f"""Ваш код підтвердження: {verification_code}"""
    message = MessageSchema(
        subject=subject,
        recipients=[recipient_email],
        body=body,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    print(f"Лист із кодом верифікації надіслано на {recipient_email}")
    

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt

# async def send_reset_password_email(email: str, token: str):
#     reset_url = f"http://localhost:8000/password/reset?token={token}"

#     message = MessageSchema(
#         subject="Скидання паролю",
#         recipients=[email],
#         body=f"Для скидання паролю перейдіть за посиланням: {reset_url}",
#         subtype="html"
#     )

#     fm = FastMail()
#     await fm.send_message(message)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Невірний токен")
        user = get_user_by_email_or_phone(db, username=email)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Користувач не знайдений")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Невірний токен")
    
def update_user_view_history(db: Session, user_id: int, goods_id: int):
    user = get_user(db, user_id)
    if not user:
        return None
    if user.view_history:
        history = user.view_history.split(",")
        if str(goods_id) in history:
            history.remove(str(goods_id))
        history.insert(0, str(goods_id))
        user.view_history = ",".join(history)
    else:
        user.view_history = str(goods_id)
    db.commit()
    db.refresh(user)
    return user


def get_recomendations_data(db: Session, user_id: int,):
    user = get_user(db, user_id)
    if not user:
        return None
    if user.view_history:
        history = user.view_history.split(",")
        goods = []
        for i in history:
            goods.append(db.query(models.Goods).filter(models.Goods.id == i).first())
        return goods
    else:
        return None


