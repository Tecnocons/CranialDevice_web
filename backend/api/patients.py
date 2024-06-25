from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
from models import db
from models.patient import Patients
from models.user import Users
from flask_login import login_required, current_user

patients_bp = Blueprint('patients', __name__)

@patients_bp.route('/patients', methods=['POST'])
@login_required
def create_patient():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid input: No data received"}), 400

    eta = data.get('eta')
    altezza = data.get('altezza')
    peso = data.get('peso')
    nominativo = data.get('nominativo')
    doctorid = data.get('doctorid')

    if not all([eta, altezza, peso, nominativo, doctorid]):
        return jsonify({"message": "Missing fields in the request data"}), 400

    new_patient = Patients(eta=eta, altezza=altezza, peso=peso, nominativo=nominativo, doctorid=doctorid)

    try:
        db.session.add(new_patient)
        db.session.commit()
        return jsonify({"message": "Patient created successfully"}), 201
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({"message": "Error creating patient", "error": str(ie)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
    
@patients_bp.route('/patients', methods=['GET'])
@login_required
def get_patients():
    try:
        query = text("""
            SELECT p.eta, p.altezza, p.peso, p.nominativo, p.doctorid, u.name as doctor_name
            FROM patients p
            LEFT JOIN users u ON p.doctorid = u.uuid
        """)
        result = db.session.execute(query).fetchall()
        patients = [
            {
                #'uuid': row.uuid,
                'eta': row.eta,
                'altezza': row.altezza,
                'peso': row.peso,
                'nominativo': row.nominativo,
                'doctorid': row.doctorid,
                'doctor_name': row.doctor_name
            } for row in result
        ]
        return jsonify(patients), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@patients_bp.route('/patients/assigned', methods=['GET'])
@login_required
def get_assigned_patients():
    doctor_name = request.args.get('doctor_name')
    if not doctor_name:
        return jsonify({"message": "Doctor name is required"}), 400

    try:
        doctor = Users.query.filter_by(name=doctor_name).first()
        if not doctor:
            return jsonify({"message": "Doctor not found"}), 404

        query = text("""
            SELECT p.uuid, p.eta, p.altezza, p.peso, p.nominativo, p.doctorid, u.name as doctor_name
            FROM patients p
            LEFT JOIN users u ON p.doctorid = u.uuid
            WHERE p.doctorid = :doctorid
        """)
        result = db.session.execute(query, {'doctorid': doctor.uuid}).fetchall()
        patients = [
            {
                'uuid': row.uuid,
                'eta': row.eta,
                'altezza': row.altezza,
                'peso': row.peso,
                'nominativo': row.nominativo,
                'doctorid': row.doctorid,
                'doctor_name': row.doctor_name
            } for row in result
        ]
        return jsonify(patients), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@patients_bp.route('/patients', methods=['PUT'])
@login_required
def update_patient():
    data = request.get_json()
    uuid = data.get('uuid')
    if not uuid:
        return jsonify({"message": "UUID is required"}), 400
    
    patient = Patients.query.filter_by(uuid=uuid).first()
    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    try:
        patient.eta = data.get('eta', patient.eta)
        patient.altezza = data.get('altezza', patient.altezza)
        patient.peso = data.get('peso', patient.peso)
        patient.nominativo = data.get('nominativo', patient.nominativo)
        patient.doctorid = data.get('doctorid', patient.doctorid)
        db.session.commit()
        return jsonify({"message": "Patient updated successfully"}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Doctor not found"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred"}), 500

@patients_bp.route('/patients/<uuid>', methods=['DELETE'])
@login_required
def delete_patient(uuid):
    patient = Patients.query.filter_by(uuid=uuid).first()
    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    try:
        db.session.delete(patient)
        db.session.commit()
        return jsonify({"message": "Patient deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred"}), 500
