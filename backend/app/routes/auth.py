from flask import Blueprint, request, jsonify, current_app
from app.services.auth.user_auth import AuthService

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

# 나머지 추가 라우팅
