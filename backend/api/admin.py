from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
from models import db
from models.user import Users

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if 'name' not in data or 'password' not in data:
        return jsonify({"message": "Missing name or password"}), 400

    try:
        new_user = Users(name=data['name'], isadmin=True)
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Admin registered successfully"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "User already exists"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred"}), 500

@admin_bp.route('/check-admin', methods=['GET'])
def check_admin():
    try:
        query = text("SELECT COUNT(*) FROM users WHERE isadmin = true")
        result = db.session.execute(query).scalar()
        admin_exists = result > 0
        return jsonify({"isFirstUser": not admin_exists})
    except Exception as e:
        return jsonify({"message": "An error occurred"}), 500

@admin_bp.route('/add-user', methods=['POST'])
def add_user():
    data = request.get_json()
    if 'name' not in data or 'password' not in data or 'isadmin' not in data:
        return jsonify({"message": "Missing name, password, or admin status"}), 400

    try:
        new_user = Users(name=data['name'], isadmin=data['isadmin'])
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User added successfully"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "User already exists"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred"}), 500
