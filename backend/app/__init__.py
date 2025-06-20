from flask import Flask
from flask_cors import CORS
import os
import logging
from app.extensions import db, migrate, jwt_manager


def create_app():
    _app = Flask(__name__)
    _app.config.from_object('config.DevelopmentConfig')

    # Initialize CORS
    CORS(_app, supports_credentials=True, origins=["http://localhost:3000"])

    db.init_app(_app)
    migrate.init_app(_app, db)
    jwt_manager.init_app(_app)

    # 모델을 db.init_app() 호출 후에 임포트하여 순환 임포트 방지 및 Flask-Migrate 인식
    with _app.app_context():  # 앱 컨텍스트 내에서 모델 임포트
        import app.models  # models/__init__.py를 통해 모든 모델을 한 번에 로드합니다.
        db.create_all()  # 모든 모델에 대해 테이블이 없다면 생성

    # register_blueprints를 앱 초기화 후에 임포트하고 호출합니다.
    from app.routes import register_blueprints  # 이 위치로 이동합니다.
    register_blueprints(_app)

    return _app
