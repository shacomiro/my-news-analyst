import os
from dotenv import load_dotenv

load_dotenv()  # .env 파일에서 환경 변수 로드


class Config:
    # Flask 앱 보안을 위한 시크릿 키
    SECRET_KEY = os.getenv(
        'SECRET_KEY') or 'a-very-hard-to-guess-default-secret-key'

    # JWT 설정
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

    # Flask-SQLAlchemy 설정
    # DATABASE_URL 환경 변수로부터 값을 가져와 SQLALCHEMY_DATABASE_URI에 할당
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # SQLAlchemy 이벤트 시스템 비활성화 (성능 향상)

    # Naver API 설정
    NAVER_CLIENT_ID = os.getenv('NAVER_CLIENT_ID')
    NAVER_CLIENT_SECRET = os.getenv('NAVER_CLIENT_SECRET')

    # Google Gemini 설정
    GOOGLE_GEMINI_API_KEY = os.getenv('GOOGLE_GEMINI_API_KEY')


class DevelopmentConfig(Config):
    DEBUG = True  # 개발 환경 디버그 모드 활성화


class ProductionConfig(Config):
    DEBUG = False  # 운영 환경 디버그 모드 비활성화
