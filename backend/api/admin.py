from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
from models import db
from models.user import Users
from models.measurements import Measurement
from flask_login import login_required, current_user

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
@login_required
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

# Endpoint per ottenere tutte le misurazioni raggruppate per measurement_id
@admin_bp.route('/measurements/all', methods=['GET'])
@login_required
def get_all_measurements():
    try:
        measurements = Measurement.query.all()
        results = []
        for measurement in measurements:
            results.append({
                "id": measurement.id,
                "measurement_id": measurement.measurement_id,
                "timestamp": measurement.timestamp,
                "spostamento_mm": measurement.spostamento_mm,
                "forza_n": measurement.forza_n,
                "pressione_bar": measurement.pressione_bar,
                "contropressione_bar": measurement.contropressione_bar,
                "patient_id": measurement.patient_id
            })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
