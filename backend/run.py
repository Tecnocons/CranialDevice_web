import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy import text
from dotenv import load_dotenv
import logging

# Carica le variabili d'ambiente dal file .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Abilita CORS per tutte le rotte

# Configurazione del logger
logging.basicConfig(filename='app.log', level=logging.INFO)

# Configurazione del database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    app.logger.info(f"Received data: {data}")
    if 'name' not in data or 'password' not in data:
        app.logger.error("Missing name or password in the request data")
        return jsonify({"message": "Missing name or password"}), 400

    try:
        with db.engine.begin() as connection:
            query = text("INSERT INTO users (name, password) VALUES (:name, :password)")
            app.logger.info(f"Executing query: {query}, with params: name={data['name']}, password={data['password']}")
            result = connection.execute(query, {"name": data['name'], "password": data['password']})
            app.logger.info(f"Insert result: {result.rowcount}")
        return jsonify({"message": "User registered successfully"}), 201
    except IntegrityError as e:
        app.logger.error(f"IntegrityError: {e}")
        return jsonify({"message": "User already exists"}), 400
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"message": "An error occurred"}), 500

if __name__ == '__main__':
    try:
        # Tentativo di connessione al database
        with app.app_context():
            db.create_all()
            with db.engine.connect() as connection:
                connection.execute(text('SELECT 1'))
        print("Connessione al database riuscita")
        app.logger.info('Connessione al database riuscita')
    except OperationalError:
        print("Errore di connessione al database")
        app.logger.error('Errore di connessione al database')

    app.run(debug=True)
