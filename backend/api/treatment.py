from flask import Blueprint, request, jsonify
from models import db
from models.treatment import Treatment
from models.patient_treatment import PatientTreatment
from flask_login import login_required

treatment_bp = Blueprint('treatment', __name__)

@treatment_bp.route('/treatments', methods=['GET'])
@login_required
def get_treatments():
    treatments = Treatment.query.all()
    treatment_list = [{'id': treatment.id, 'name': treatment.name, 'description': treatment.description} for treatment in treatments]
    return jsonify(treatment_list), 200

@treatment_bp.route('/treatments', methods=['POST'])
@login_required
def create_treatment():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')

    if not name:
        return jsonify({"message": "Name is required"}), 400

    new_treatment = Treatment(name=name, description=description)
    db.session.add(new_treatment)
    db.session.commit()
    return jsonify({"message": "Treatment created successfully"}), 201

@treatment_bp.route('/patient_treatment', methods=['POST'])
@login_required
def assign_treatment():
    data = request.get_json()
    patient_uuid = data.get('patient_uuid')
    treatment_ids = data.get('treatment_ids')

    if not patient_uuid or not treatment_ids:
        return jsonify({"message": "Missing fields in the request data"}), 400

    try:
        for treatment_id in treatment_ids:
            new_assignment = PatientTreatment(patient_uuid=patient_uuid, treatment_id=treatment_id)
            db.session.add(new_assignment)
        db.session.commit()
        return jsonify({"message": "Treatments assigned successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@treatment_bp.route('/patient_treatment/<patient_uuid>', methods=['GET'])
@login_required
def get_patient_treatments(patient_uuid):
    assignments = PatientTreatment.query.filter_by(patient_uuid=patient_uuid).all()
    treatments = []
    for assignment in assignments:
        treatment = Treatment.query.get(assignment.treatment_id)
        if treatment:
            treatments.append({
                "id": treatment.id,
                "name": treatment.name,
                "description": treatment.description
            })
    return jsonify(treatments), 200

@treatment_bp.route('/patient_treatment', methods=['DELETE'])
@login_required
def unassign_treatment():
    data = request.get_json()
    patient_uuid = data.get('patient_uuid')
    treatment_id = data.get('treatment_id')

    if not patient_uuid or not treatment_id:
        return jsonify({"message": "Patient UUID and Treatment ID are required"}), 400

    try:
        patient_treatment = db.session.query(PatientTreatment).filter_by(
            patient_uuid=patient_uuid, treatment_id=treatment_id).first()
        if patient_treatment:
            db.session.delete(patient_treatment)
            db.session.commit()
            return jsonify({"message": "Treatment unassigned successfully"}), 200
        else:
            return jsonify({"message": "PatientTreatment not found"}), 404
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
