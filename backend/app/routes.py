from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from dotenv import load_dotenv
import os
import logging
import uuid

# Carica le variabili d'ambiente dal file .env
load_dotenv()

app = Flask(__name__)

# Configurazione del logger
logging.basicConfig(filename='app.log', level=logging.INFO)

# Configurazione del database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Definizione del modello User
class User(db.Model):
    uuid = db.Column(db.String, primary_key=True, default=str(uuid.uuid4()))
    name = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    isAdmin = db.Column(db.Boolean, default=False)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    new_user = User(name=data['name'], password=data['password'], isAdmin=False)
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "User already exists"}), 400

if __name__ == '__main__':
    try:
        # Tentativo di connessione al database
        with app.app_context():
            db.create_all()
            db.engine.connect().execute('SELECT 1')
        print("Connessione al database riuscita")
        app.logger.info('Connessione al database riuscita')
    except OperationalError:
        print("Errore di connessione al database")
        app.logger.error('Errore di connessione al database')
    
    app.run(debug=True)
