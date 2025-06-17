from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# 프론트엔드가 백엔드에 회원가입 요청
# @auth_bp.route('/register')
# def register():
#     return 'Register Page'

# 프론트엔드가 백엔드에 로그인 요청
# @auth_bp.route('/login')
# def login():
#     return 'Login Page'

# 나머지 추가 라우팅
