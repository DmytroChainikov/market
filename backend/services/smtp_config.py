from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import BaseModel, SecretStr, EmailStr
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv("config.env")


class EmailConfig(BaseModel):
    MAIL_USERNAME: str
    MAIL_PASSWORD: SecretStr
    MAIL_FROM: EmailStr
    MAIL_PORT: int = 587
    MAIL_SERVER: str
    MAIL_FROM_NAME: Optional[str] = None
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    MAIL_DEBUG: Optional[int] = 0
    SUPPRESS_SEND: Optional[int] = 0
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True
    TIMEOUT: int = 10
    
    @classmethod
    def from_env(cls):
        return cls(
            MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
            MAIL_PASSWORD=SecretStr(os.getenv("MAIL_PASSWORD")),
            MAIL_FROM=os.getenv("MAIL_FROM"),
            MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
            MAIL_SERVER=os.getenv("MAIL_SERVER"),
            MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME"),
            MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True") == "True",
            MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False") == "True",
            MAIL_DEBUG=int(os.getenv("MAIL_DEBUG", 0)),
            SUPPRESS_SEND=int(os.getenv("SUPPRESS_SEND", 0)),
            USE_CREDENTIALS=os.getenv("USE_CREDENTIALS", "True") == "True",
            VALIDATE_CERTS=os.getenv("VALIDATE_CERTS", "True") == "True",
            TIMEOUT=int(os.getenv("TIMEOUT", 10))
        )

email_config = EmailConfig.from_env()

conf = ConnectionConfig(
    MAIL_USERNAME=email_config.MAIL_USERNAME,
    MAIL_PASSWORD=email_config.MAIL_PASSWORD,
    MAIL_FROM=email_config.MAIL_FROM,
    MAIL_PORT=email_config.MAIL_PORT,
    MAIL_SERVER=email_config.MAIL_SERVER,
    MAIL_FROM_NAME=email_config.MAIL_FROM_NAME,
    MAIL_STARTTLS=email_config.MAIL_STARTTLS,
    MAIL_SSL_TLS=email_config.MAIL_SSL_TLS,
    MAIL_DEBUG=email_config.MAIL_DEBUG,
    SUPPRESS_SEND=email_config.SUPPRESS_SEND,
    USE_CREDENTIALS=email_config.USE_CREDENTIALS,
    VALIDATE_CERTS=email_config.VALIDATE_CERTS,
    TIMEOUT=email_config.TIMEOUT
)
