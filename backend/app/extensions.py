from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.utils.jwt.jwt_util import JWTManager
from app.utils.naver.naver_open_api import NaverOpenApiManager
from app.utils.google.google_gemini import GoogleGemini

db = SQLAlchemy()
migrate = Migrate()
jwt_manager = JWTManager()
naver_open_api_manager = NaverOpenApiManager()
google_gemini = GoogleGemini()
