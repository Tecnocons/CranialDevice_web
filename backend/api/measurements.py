from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import db
from models.measurements import Measurement

measurement_bp = Blueprint('measurement', __name__)

@measurement_bp.route('/measurements', methods=['POST'])
@login_required
def add_measurement():
    data = request.get_json()
    patient_id = data.get('patient_id')
    measurement_id = data.get('measurement_id')  # Aggiunto measurement_id
    timestamp = data.get('timestamp')
    spostamento_mm = data.get('spostamento_mm')
    forza_n = data.get('forza_n')
    pressione_bar = data.get('pressione_bar')
    contropressione_bar = data.get('contropressione_bar')

    if not all([patient_id, measurement_id, timestamp, spostamento_mm, forza_n, pressione_bar, contropressione_bar]):
        return jsonify({"message": "Missing fields in the request data"}), 400

    try:
        new_measurement = Measurement(
            patient_id=patient_id,
            measurement_id=measurement_id,  # Aggiunto measurement_id
            timestamp=timestamp,
            spostamento_mm=spostamento_mm,
            forza_n=forza_n,
            pressione_bar=pressione_bar,
            contropressione_bar=contropressione_bar
        )
        db.session.add(new_measurement)
        db.session.commit()
        return jsonify({"message": "Measurement added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@measurement_bp.route('/measurements/<patient_id>', methods=['GET'])
@login_required
def get_measurements(patient_id):
    try:
        measurements = Measurement.query.filter_by(patient_id=patient_id).all()
        results = []
        for measurement in measurements:
            results.append({
                "id": measurement.id,
                "measurement_id": measurement.measurement_id,  # Aggiunto measurement_id
                "timestamp": measurement.timestamp,
                "spostamento_mm": measurement.spostamento_mm,
                "forza_n": measurement.forza_n,
                "pressione_bar": measurement.pressione_bar,
                "contropressione_bar": measurement.contropressione_bar
            })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@measurement_bp.route('/measurements', methods=['DELETE'])
@login_required
def delete_measurement():
    data = request.get_json()
    measurement_id = data.get('measurement_id')

    if not measurement_id:
        return jsonify({"message": "Measurement ID is required"}), 400

    try:
        measurement = Measurement.query.filter_by(measurement_id=measurement_id).first()  # Modificato per utilizzare measurement_id
        if measurement:
            db.session.delete(measurement)
            db.session.commit()
            return jsonify({"message": "Measurement deleted successfully"}), 200
        else:
            return jsonify({"message": "Measurement not found"}), 404
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@measurement_bp.route('/measurements/by_measurement_id/<measurement_id>', methods=['GET'])
@login_required
def get_measurements_by_measurement_id(measurement_id):
    try:
        measurements = Measurement.query.filter_by(measurement_id=measurement_id).order_by(Measurement.timestamp.asc()).all()
        if not measurements:
            return jsonify({"message": "No measurements found"}), 404
        
        results = []
        for measurement in measurements:
            results.append({
                "id": measurement.id,
                "measurement_id": measurement.measurement_id,
                "timestamp": measurement.timestamp,
                "spostamento_mm": measurement.spostamento_mm,
                "forza_n": measurement.forza_n,
                "pressione_bar": measurement.pressione_bar,
                "contropressione_bar": measurement.contropressione_bar
            })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@measurement_bp.route('/measurements/latest', methods=['GET'])
@login_required
def get_latest_measurement():
    try:
        measurement = Measurement.query.order_by(Measurement.timestamp.desc()).first()
        if measurement:
            result = {
                "id": measurement.id,
                "measurement_id": measurement.measurement_id,  # Aggiunto measurement_id
                "timestamp": measurement.timestamp,
                "spostamento_mm": measurement.spostamento_mm,
                "forza_n": measurement.forza_n,
                "pressione_bar": measurement.pressione_bar,
                "contropressione_bar": measurement.contropressione_bar
            }
            return jsonify(result), 200
        else:
            return jsonify({"message": "No measurements found"}), 404
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@measurement_bp.route('/doctor_measurements/<doctor_id>', methods=['GET'])
@login_required
def get_doctor_measurements(doctor_id):
    try:
        measurements = Measurement.query.filter_by(doctor_id=doctor_id).all()
        results = []
        for measurement in measurements:
            results.append({
                "id": measurement.id,
                "measurement_id": measurement.measurement_id,
                "timestamp": measurement.timestamp,
                "spostamento_mm": measurement.spostamento_mm,
                "forza_n": measurement.forza_n,
                "pressione_bar": measurement.pressione_bar,
                "contropressione_bar": measurement.contropressione_bar
            })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

'''@measurement_bp.route('/measurements/measurement/<measurement_id>', methods=['GET'])
@login_required
def get_measurements_by_measurement_id(measurement_id):
    try:
        measurements = Measurement.query.filter_by(measurement_id=measurement_id).all()
        results = []
        for measurement in measurements:
            results.append({
                "id": measurement.id,
                "measurement_id": measurement.measurement_id,
                "timestamp": measurement.timestamp,
                "spostamento_mm": measurement.spostamento_mm,
                "forza_n": measurement.forza_n,
                "pressione_bar": measurement.pressione_bar,
                "contropressione_bar": measurement.contropressione_bar
            })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

'''