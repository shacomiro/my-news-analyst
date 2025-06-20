from flask import Blueprint, request, jsonify, current_app
from app.services.auth.user_auth import AuthService
from app.extensions import jwt_manager

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
        return jsonify({"message": result["message"], "access_token": result["access_token"]}), 200
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
