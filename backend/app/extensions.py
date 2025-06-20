from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.utils.jwt.jwt_util import JWTManager

db = SQLAlchemy()
migrate = Migrate()
jwt_manager = JWTManager()
