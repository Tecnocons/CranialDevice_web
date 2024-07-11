from flask import Blueprint, request, jsonify
from flask_login import login_user
from models.user import Users
from flask_cors import CORS

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    name = data.get('name')
    password = data.get('password')
    
    user = Users.query.filter_by(name=name).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({
            'name': user.name,
            'isAdmin': user.isadmin,
            'helmetId': user.helmetId  # Ensure helmetId is included
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 401
