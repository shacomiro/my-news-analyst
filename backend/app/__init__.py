from flask import Flask
from flask_cors import CORS
from app.routes import register_blueprints

def create_app():
    app = Flask(__name__)

    # Initialize CORS
    CORS(app)

    # Register Blueprints
    register_blueprints(app)

    return app
