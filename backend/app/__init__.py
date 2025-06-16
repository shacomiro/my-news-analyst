from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
import logging
from app.routes import register_blueprints

# db와 migrate 인스턴스를 모듈 레벨에서 정의
db = SQLAlchemy()
migrate = Migrate()

# 모든 모델 정의를 여기에 임포트하여 SQLAlchemy 메타데이터에 등록
# Flask-Migrate가 스키마 변경을 감지할 수 있도록 create_app() 호출 전에 임포트
import app.models

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.DevelopmentConfig')

    # Initialize CORS
    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)


    register_blueprints(app)

    return app
