from flask import Blueprint, jsonify
from sqlalchemy import text
from models import db

users_bp = Blueprint('users', __name__)

@users_bp.route('/users', methods=['GET'])
def get_users():
    try:
        query = text("SELECT uuid, name, isadmin FROM users")
        result = db.session.execute(query).fetchall()
        users = [{'uuid': row.uuid, 'name': row.name, 'isadmin': row.isadmin} for row in result]
        return jsonify(users), 200
    except Exception as e:
        print(f"Error: {e}")  # Aggiungi il logging per capire l'errore
        return jsonify({"message": "An error occurred"}), 500
