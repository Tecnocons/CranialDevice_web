import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from models import db, Users  # Importa Users dal tuo modello
from config import Config
from api.auth import auth_bp
from api.admin import admin_bp
from api.users import users_bp
from api.patients import patients_bp
from werkzeug.exceptions import HTTPException

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True)

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'  # Nome della vista di login

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)

@app.errorhandler(Exception)
def handle_exception(e):
    # Passa attraverso le eccezioni HTTP
    if isinstance(e, HTTPException):
        response = e.get_response()
        response.data = jsonify({
            "code": e.code,
            "name": e.name,
            "description": e.description,
        }).data
        response.content_type = "application/json"
        return response
    # Gestisci le eccezioni non-HTTP
    return jsonify({
        "code": 500,
        "name": "Internal Server Error",
        "description": str(e),
    }), 500

app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')
app.register_blueprint(users_bp, url_prefix='/api')
app.register_blueprint(patients_bp, url_prefix='/api')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
