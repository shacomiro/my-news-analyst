import jwt
from datetime import datetime, timedelta, timezone
import os


class JWTUtil:
    def __init__(self, secret_key, algorithm='HS256'):
        if not secret_key:
            raise ValueError(
                "JWT_SECRET_KEY must be set in environment variables or configuration.")
        self.secret_key = secret_key
        self.algorithm = algorithm

    # 주어진 사용자 ID와 이메일을 사용하여 JWT를 생성. 기본 만료 시간은 1시간.
    def generate_token(self, user_id: int, email: str, expires_delta: timedelta = None) -> str:
        if expires_delta is None:
            expires_delta = timedelta(hours=1)  # 1시간 유효

        expire = datetime.now(timezone.utc) + expires_delta
        to_encode = {"exp": expire, "user_id": user_id, "email": email}
        encoded_jwt = jwt.encode(
            to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    # JWT의 유효성을 검사. 유효하면 True, 그렇지 않으면 False를 반환.
    def verify_token(self, token: str) -> bool:
        try:
            jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return True
        except jwt.ExpiredSignatureError:
            print("토큰이 만료되었습니다.")
            return False
        except jwt.InvalidTokenError:
            print("유효하지 않은 토큰입니다.")
            return False

    # JWT를 디코딩하여 페이로드(payload)를 반환. 토큰이 유효하지 않거나 만료된 경우 None을 반환.
    def decode_token(self, token: str) -> dict | None:
        try:
            payload = jwt.decode(token, self.secret_key,
                                 algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            print("토큰이 만료되었습니다.")
            return None
        except jwt.InvalidTokenError:
            print("유효하지 않은 토큰입니다.")
            return None
