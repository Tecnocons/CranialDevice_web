from flask import Blueprint, request, jsonify
from flask_login import login_user
from models.user import Users

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if 'name' not in data or 'password' not in data:
        return jsonify({"message": "Missing name or password"}), 400

    try:
        user = Users.query.filter_by(name=data['name']).first()
        if user and user.check_password(data['password']):
            login_user(user)
            return jsonify({
                "message": f"Welcome {user.name}",
                "name": user.name,
                "isAdmin": user.isadmin
            }), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"message": "An error occurred"}), 500
