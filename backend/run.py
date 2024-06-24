import os
from flask import Flask
from flask_cors import CORS
from models import db
from config import Config
from api.auth import auth_bp
from api.admin import admin_bp
from api.users import users_bp  # Importa il nuovo blueprint

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)

app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')
app.register_blueprint(users_bp, url_prefix='/api')  # Registra il nuovo blueprint

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
