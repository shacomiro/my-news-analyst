from flask import Blueprint

from .auth import auth_bp
from .news import news_bp
from .analysis import analysis_bp


def register_blueprints(app):
    app.register_blueprint(news_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(analysis_bp)
