from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import db
from models.patient_pathology import PatientPathology
from models.patient import Patients
from models.pathology import Pathologies

patient_pathology_bp = Blueprint('patient_pathology', __name__)

@patient_pathology_bp.route('/patient_pathology', methods=['POST'])
@login_required
def assign_pathology():
    data = request.get_json()
    patient_uuid = data.get('patient_uuid')
    pathology_ids = data.get('pathology_ids')

    if not patient_uuid or not pathology_ids:
        return jsonify({"message": "Missing fields in the request data"}), 400

    try:
        for pathology_id in pathology_ids:
            new_assignment = PatientPathology(patient_uuid=str(patient_uuid), pathology_id=pathology_id)
            db.session.add(new_assignment)
        db.session.commit()
        return jsonify({"message": "Pathologies assigned successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@patient_pathology_bp.route('/patient_pathology/<patient_uuid>', methods=['GET'])
@login_required
def get_patient_pathologies(patient_uuid):
    try:
        assignments = PatientPathology.query.filter_by(patient_uuid=str(patient_uuid)).all()
        pathologies = []
        for assignment in assignments:
            pathology = Pathologies.query.get(assignment.pathology_id)
            if pathology:
                pathologies.append({
                    "id": pathology.id,
                    "name": pathology.name,
                    "description": pathology.description
                })
        return jsonify(pathologies), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@patient_pathology_bp.route('/patient_pathology', methods=['DELETE'])
@login_required
def unassign_pathology():
    data = request.get_json()
    patient_uuid = data.get('patient_uuid')
    pathology_id = data.get('pathology_id')

    if not patient_uuid or not pathology_id:
        return jsonify({"message": "Patient UUID and Pathology ID are required"}), 400

    try:
        patient_pathology = db.session.query(PatientPathology).filter_by(patient_uuid=str(patient_uuid), pathology_id=pathology_id).first()
        if patient_pathology:
            db.session.delete(patient_pathology)
            db.session.commit()
            return jsonify({"message": "Pathology unassigned successfully"}), 200
        else:
            return jsonify({"message": "PatientPathology not found"}), 404
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
