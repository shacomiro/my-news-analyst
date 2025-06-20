from flask import Blueprint, request, jsonify, current_app, make_response
from app.services.auth.user_auth import AuthService
from app.extensions import jwt_manager
from datetime import datetime, timezone, timedelta

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# AuthService 인스턴스를 모듈 레벨에서 초기화
auth_service = AuthService()


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "이메일과 비밀번호는 필수입니다."}), 400

    result = auth_service.signup_user(email, password)
    if result["success"]:
        return jsonify({"message": result["message"]}), 201
    else:
        return jsonify({"message": result["message"]}), 400


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "이메일과 비밀번호는 필수입니다."}), 400

    result = auth_service.authenticate_user(email, password)
    if result["success"]:
        response = make_response(jsonify({"message": result["message"]}))
        # JWTManager를 통해 토큰 만료 시간 가져오기
        decoded_token = jwt_manager.jwt_util.decode_token(
            result["access_token"])
        expires_at = decoded_token.get('exp')
        if expires_at:
            # Python datetime 객체로 변환 (UTC)
            expires_datetime = datetime.fromtimestamp(
                expires_at, tz=timezone.utc)
        else:
            # 만료 시간이 없으면 기본값으로 현재 시간 + 1시간 설정 (안전장치)
            expires_datetime = datetime.now(timezone.utc) + timedelta(hours=1)

        # HttpOnly 쿠키 설정
        response.set_cookie(
            'access_token',
            result["access_token"],
            httponly=True,
            # 개발 환경에서 HTTP를 위해 False로 임시 설정. 프로덕션에서는 True로 변경해야 함.
            secure=False,
            samesite='Lax',
            expires=expires_datetime  # 쿠키 만료 시간 설정
        )
        return response, 200
    else:
        return jsonify({"message": result["message"]}), 401


@auth_bp.route('/status', methods=['GET'])
def auth_status():
    # HttpOnly 쿠키에서 access_token 가져오기. JavaScript에서 직접 접근 불가하지만, 요청 시 자동으로 포함됨.
    token = request.cookies.get('access_token')

    if not token:
        return jsonify({"is_authenticated": False, "message": "인증 토큰이 없습니다."}), 200

    result = auth_service.verify_auth_token(token)

    if result["success"]:
        return jsonify({
            "is_authenticated": True,
            "user": {
                "id": result['user_id'],
                "email": result['email']
            },
            "message": "인증되었습니다."
        }), 200
    else:
        return jsonify({"is_authenticated": False, "message": result["message"]}), 200

# 나머지 추가 라우팅
