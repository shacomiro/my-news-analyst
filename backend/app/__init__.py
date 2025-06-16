from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
import logging
from app.routes import register_blueprints

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.DevelopmentConfig')

    # Initialize CORS
    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        try:
            db.engine.connect()
            app.logger.info("데이터베이스에 성공적으로 연결되었습니다.")
        except Exception as e:
            app.logger.error(f"데이터베이스 연결 실패: {e}")

    register_blueprints(app)

    return app
