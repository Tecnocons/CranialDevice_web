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

    for pathology_id in pathology_ids:
        new_assignment = PatientPathology(patient_uuid=patient_uuid, pathology_id=pathology_id)
        db.session.add(new_assignment)

    db.session.commit()
    return jsonify({"message": "Pathologies assigned successfully"}), 201

@patient_pathology_bp.route('/patient_pathology/<patient_uuid>', methods=['GET'])
@login_required
def get_patient_pathologies(patient_uuid):
    assignments = PatientPathology.query.filter_by(patient_uuid=patient_uuid).all()
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
