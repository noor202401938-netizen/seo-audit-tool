import os
import config  # noqa: F401 — side effect: loads .env into os.environ before we read JWT_SECRET
import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from db_client import prisma

SECRET_KEY = os.getenv('JWT_SECRET', 'local-default-secret-key-32charsminimum')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 365  # 1 year

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='api/auth/login', auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=365)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

class LocalUserStub:
    id = "local-user"
    email = "local@seointelligence"
    name = "Local Administrator"
    subscription = {
        "plan": "self-hosted",
        "auditsRemaining": 999999,
        "monthlyLimit": 999999
    }

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)):
    # If token exists, try to decode
    if token:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get('sub')
            if user_id:
                user = await prisma.user.find_unique(where={'id': user_id}, include={'subscription': True})
                if user:
                    return user
        except Exception:
            pass

    # Unauthenticated / local standalone mode: fallback to first DB user or local stub
    try:
        user = await prisma.user.find_first(include={'subscription': True})
        if user:
            return user
    except Exception:
        pass

    return LocalUserStub()
