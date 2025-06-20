from datetime import datetime, timezone
import re

from werkzeug.security import generate_password_hash, check_password_hash

from app.extensions import db, jwt_manager
from app.models.user import User


class AuthService:
    def __init__(self):
        self.jwt_util = jwt_manager.jwt_util

    def signup_user(self, email, password):
        # 1. 입력 유효성 검사
        if not re.match(r"[^@]+@[^\.]+\.[^\.]+", email):
            return {"success": False, "message": "올바른 이메일 형식이 아닙니다."}

        # 비밀번호 복잡성 검사 (8자 이상, 특수문자 포함)
        if len(password) < 8 or not re.search(r"[^a-zA-Z0-9]", password):
            return {"success": False, "message": "비밀번호는 8자 이상이어야 하며, 특수문자를 포함해야 합니다."}

        # 2. 이메일 중복 확인
        if User.query.filter_by(email=email).first():
            return {"success": False, "message": "이미 가입된 이메일 주소입니다."}

        try:
            # 3. 비밀번호 해싱
            hashed_password = generate_password_hash(password)

            # 4. 사용자 정보 DB 저장
            new_user = User(
                email=email,
                password_hash=hashed_password,
                created_at=datetime.now(timezone.utc)
            )
            db.session.add(new_user)
            db.session.commit()
            return {"success": True, "message": "회원가입이 완료되었습니다."}
        except Exception as e:
            db.session.rollback()
            print(f"회원가입 오류: {e}")
            return {"success": False, "message": "회원가입 중 오류가 발생했습니다."}

    def authenticate_user(self, email, password):
        try:
            user = User.query.filter_by(email=email).first()

            # 1. 사용자 존재 여부 및 비밀번호 일치 확인
            if not user or not check_password_hash(user.password_hash, password):
                return {"success": False, "message": "이메일 또는 비밀번호가 일치하지 않습니다."}

            # 2. JWT 토큰 발급
            access_token = self.jwt_util.generate_token(user.id, user.email)

            # 3. 최종 로그인 시각 업데이트
            user.last_login_at = datetime.now(timezone.utc)
            db.session.commit()

            return {"success": True, "message": "로그인 성공", "access_token": access_token}
        except Exception as e:
            db.session.rollback()
            print(f"로그인 오류: {e}")
            return {"success": False, "message": "로그인 중 오류가 발생했습니다."}

    def verify_auth_token(self, token):
        try:
            decoded_token = self.jwt_util.decode_token(token)
            return {"success": True, "user_id": decoded_token['user_id'], "email": decoded_token['email']}
        except Exception as e:
            print(f"토큰 검증 오류: {e}")
            return {"success": False, "message": "유효하지 않거나 만료된 토큰입니다."}
