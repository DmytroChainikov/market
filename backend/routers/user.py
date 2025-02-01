from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import services.user_service as _us, schemas
from database import get_db
from jose import JWTError, jwt
from datetime import timedelta, datetime
from dotenv import load_dotenv
import os

load_dotenv("config.env")

router = APIRouter()


@router.post("/token", tags=["!token"])
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = _us.get_user_by_email_or_phone(db, form_data.username)
    if not user or not _us.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Неправильний email або пароль")

    access_token_expires = timedelta(
        minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
    )
    access_token = _us.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return dict(access_token=access_token, token_type="bearer")

@router.post("/refresh-token", tags=["!token"])
def refresh_token(
    current_user: schemas.User = Depends(_us.get_current_user),
    db: Session = Depends(get_db)
):
    access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    access_token = _us.create_access_token(
        data={"sub": current_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/user/test", response_model=schemas.User, tags=["!token"])
def create_test_user(db: Session = Depends(get_db)):
    new_user = _us.create_test_user(
        db,
        user=schemas.UserCreate(
            email="string", name="string", hashed_password="string", phone="string"
        ),
    )
    return new_user


@router.post("/user/create", response_model=schemas.UserBase, tags=["user"])
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    email_valid = _us.is_valid_email(user.email)
    if email_valid:
        raise HTTPException(status_code=400, detail="Неправильний email")
    existing_user = _us.get_user_by_email_or_phone(db, username=user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Користувач із такою електронною поштою вже існує",
        )
    try:
        new_user = await _us.create_user(db=db, user=user)
        return new_user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Не вдалося створити користувача: {str(e)}",
        )


@router.get("/user/me", response_model=schemas.User, tags=["user"])
def read_users_me(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(_us.get_current_user),
):
    return current_user


@router.put("/user/update", response_model=schemas.User, tags=["user"])
def update_user(
    user: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(_us.get_current_user),
):
    try:
        updated_user = _us.update_user(db=db, user_id=current_user.id, user=user)
        return updated_user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Не вдалося оновити користувача: {str(e)}",
        )


@router.delete("/user/delete", response_model=schemas.User, tags=["user"])
def delete_self(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(_us.get_current_user),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Користувач не знайдений"
        )
    try:
        deleted_user = _us.delete_user(db=db, user_id=current_user.id)
        return deleted_user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Не вдалося видалити користувача: {str(e)}",
        )


@router.post("/user/verify", tags=["user"])
def verify_user(
    code: str,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(_us.get_current_user),
):
    if current_user.verification_code != code:
        raise HTTPException(status_code=400, detail="Невірний код верифікації")

    current_user.is_verified = 1
    current_user.verification_code = None
    db.commit()
    db.refresh(current_user)
    return {"message": "Обліковий запис підтверджено"}


@router.post("/password/reset-request/")
async def request_password_reset(email: str, db: Session = Depends(get_db)):
    email_valid = _us.is_valid_email(email)
    if email_valid:
        raise HTTPException(status_code=400, detail="Неправильний email")
    user = _us.get_user_by_email_or_phone(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="Користувач із такою поштою не знайдений")
    expire = datetime.now() + timedelta(minutes=os.getenv("RESET_PASSWORD_TOKEN_EXPIRE_MINUTES"))
    payload = {"sub": user.email, "exp": expire}
    reset_token = jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
    await _us.send_reset_password_email(user.email, reset_token)
    return {"message": "Інструкції для скидання паролю надіслано на вашу пошту"}

# @router.post("/password/reset/")
# async def reset_password(data: schemas.ResetPasswordSchema, db: Session = Depends(get_db)):
#     try:
#         payload = jwt.decode(data.token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
#         email = payload.get("sub")
#         if email is None:
#             raise HTTPException(status_code=400, detail="Невірний токен")
#     except JWTError:
#         raise HTTPException(status_code=400, detail="Термін дії токена закінчився")
#     user = _us.get_user_by_email_or_phone(db, email=email)
#     if not user:
#         raise HTTPException(status_code=404, detail="Користувач не знайдений")
#     _us.update_password(db, user, data.new_password)
#     return {"message": "Пароль успішно оновлено"}