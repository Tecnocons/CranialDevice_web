from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
from models import db
from models.user import Users
from flask_login import login_required

users_bp = Blueprint('users', __name__)

@users_bp.route('/users', methods=['GET'])
@login_required
def get_users():
    try:
        uuid = request.args.get('uuid', None)
        if uuid:
            query = text('SELECT uuid, name, isadmin, password, "helmetId" FROM users WHERE uuid = :uuid')
            result = db.session.execute(query, {"uuid": uuid}).fetchone()
            if result:
                user = {'uuid': result.uuid, 'name': result.name, 'isadmin': result.isadmin, 'password': result.password, 'helmetId': result.helmetId}
                return jsonify(user), 200
            else:
                return jsonify({"message": "User not found"}), 404
        else:
            query = text('SELECT uuid, name, isadmin, "helmetId" FROM users')
            result = db.session.execute(query).fetchall()
            users = [{'uuid': row.uuid, 'name': row.name, 'isadmin': row.isadmin, 'helmetId': row.helmetId} for row in result]
            return jsonify(users), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "An error occurred"}), 500

@users_bp.route('/users/<uuid>', methods=['GET'])
@login_required
def get_user(uuid):
    try:
        query = text('SELECT uuid, name, isadmin, password, "helmetId" FROM users WHERE uuid = :uuid')
        result = db.session.execute(query, {"uuid": uuid}).fetchone()
        if result:
            user = {'uuid': result.uuid, 'name': result.name, 'isadmin': result.isadmin, 'password': result.password, 'helmetId': result.helmetId}
            return jsonify(user), 200
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "An error occurred"}), 500

@users_bp.route('/users/<uuid>', methods=['PUT'])
@login_required
def update_user(uuid):
    try:
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')
        isadmin = data.get('isadmin')
        helmetId = data.get('helmetId')

        user = Users.query.filter_by(uuid=uuid).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        user.name = name
        user.isadmin = isadmin
        user.helmetId = helmetId
        if password:
            user.set_password(password)
        
        db.session.commit()

        return jsonify({"message": "User updated successfully"}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "User already exists"}), 400
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify({"message": "An error occurred"}), 500

@users_bp.route('/users/<uuid>/helmet', methods=['PUT'])
@login_required
def update_helmet(uuid):
    try:
        data = request.get_json()
        helmetId = data.get('helmetId')

        user = Users.query.filter_by(uuid=uuid).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        user.helmetId = helmetId
        
        db.session.commit()

        return jsonify({"message": "Helmet ID updated successfully"}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Helmet ID already exists"}), 400
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify({"message": "An error occurred"}), 500
