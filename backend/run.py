import os
from flask import Flask
from flask_cors import CORS
from models import db
from config import Config
from api.auth import auth_bp
from api.admin import admin_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # Assicurati che CORS sia applicato a tutte le rotte

db.init_app(app)

app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
