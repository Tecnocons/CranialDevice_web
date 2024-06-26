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
    sesso = data.get('sesso')
    doctorid = current_user.uuid

    if not all([eta, altezza, peso, nominativo, sesso]):
        return jsonify({"message": "Missing fields in the request data"}), 400

    new_patient = Patients(eta=eta, altezza=altezza, peso=peso, nominativo=nominativo, sesso=sesso, doctorid=doctorid)

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
            SELECT p.uuid, p.eta, p.altezza, p.peso, p.nominativo, p.sesso, p.doctorid, u.name as doctor_name
            FROM patients p
            LEFT JOIN users u ON p.doctorid = u.uuid
        """)
        result = db.session.execute(query).fetchall()
        patients = [
            {
                'uuid': row.uuid,
                'eta': row.eta,
                'altezza': row.altezza,
                'peso': row.peso,
                'nominativo': row.nominativo,
                'sesso': row.sesso,
                'doctorid': row.doctorid,
                'doctor_name': row.doctor_name
            } for row in result
        ]
        return jsonify(patients), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@patients_bp.route('/patients/<uuid>', methods=['GET'])
@login_required
def get_patient(uuid):
    try:
        patient = Patients.query.filter_by(uuid=uuid).first()
        if not patient:
            return jsonify({"message": "Patient not found"}), 404

        patient_data = {
            'uuid': patient.uuid,
            'eta': patient.eta,
            'altezza': patient.altezza,
            'peso': patient.peso,
            'nominativo': patient.nominativo,
            'sesso': patient.sesso,
            'doctorid': patient.doctorid,
            'doctor_name': Users.query.filter_by(uuid=patient.doctorid).first().name
        }
        return jsonify(patient_data), 200
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
            SELECT p.uuid, p.eta, p.altezza, p.peso, p.nominativo, p.sesso, p.doctorid, u.name as doctor_name
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
                'sesso': row.sesso,
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
        patient.sesso = data.get('sesso', patient.sesso)
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

@patients_bp.route('/patients/bulk_delete', methods=['DELETE'])
@login_required
def bulk_delete_patients():
    if current_user.isadmin:
        return jsonify({"message": "Admins are not allowed to perform this action"}), 403

    try:
        data = request.get_json()
        uuids = data.get('uuids')
        if not uuids:
            return jsonify({"message": "UUIDs are required"}), 400

        # Log the incoming UUIDs
        print(f"Received UUIDs for deletion: {uuids}")

        patients_to_delete = Patients.query.filter(Patients.uuid.in_(uuids)).all()
        if not patients_to_delete:
            return jsonify({"message": "No patients found for given UUIDs"}), 404

        for patient in patients_to_delete:
            db.session.delete(patient)

        db.session.commit()
        return jsonify({"message": "Patients deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error during bulk delete: {e}")  # Log the error
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
