from flask import Blueprint

from .auth import auth_bp
from .news import news_bp
from .analysis import analysis_bp


def register_blueprints(_app):
    _app.register_blueprint(news_bp)
    _app.register_blueprint(auth_bp)
    _app.register_blueprint(analysis_bp)
