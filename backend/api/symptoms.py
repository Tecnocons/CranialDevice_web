from flask import Blueprint, request, jsonify
from models import db
from models.symptom import Symptom
from models.patient_symptom import PatientSymptom
from flask_login import login_required

symptom_bp = Blueprint('symptom', __name__)

@symptom_bp.route('/symptoms', methods=['GET'])
@login_required
def get_symptoms():
    symptoms = Symptom.query.all()
    symptom_list = [{'id': symptom.id, 'name': symptom.name, 'description': symptom.description} for symptom in symptoms]
    return jsonify(symptom_list), 200

@symptom_bp.route('/symptoms', methods=['POST'])
@login_required
def create_symptom():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')

    if not name:
        return jsonify({"message": "Name is required"}), 400

    new_symptom = Symptom(name=name, description=description)
    db.session.add(new_symptom)
    db.session.commit()
    return jsonify({"message": "Symptom created successfully"}), 201

@symptom_bp.route('/symptoms', methods=['PUT'])
@login_required
def update_symptom():
    data = request.get_json()
    symptom_id = data.get('id')
    name = data.get('name')
    description = data.get('description', '')

    symptom = Symptom.query.get(symptom_id)
    if not symptom:
        return jsonify({"message": "Symptom not found"}), 404

    symptom.name = name
    symptom.description = description
    db.session.commit()
    return jsonify({"message": "Symptom updated successfully"}), 200

@symptom_bp.route('/symptoms', methods=['DELETE'])
@login_required
def delete_symptom():
    data = request.get_json()
    ids = data.get('ids')

    if not ids:
        return jsonify({"message": "No IDs provided"}), 400

    try:
        Symptom.query.filter(Symptom.id.in_(ids)).delete(synchronize_session=False)
        db.session.commit()
        return jsonify({"message": "Symptoms deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@symptom_bp.route('/patient_symptom', methods=['POST'])
@login_required
def assign_symptom():
    data = request.get_json()
    patient_uuid = data.get('patient_uuid')
    symptom_ids = data.get('symptom_ids')

    if not patient_uuid or not symptom_ids:
        return jsonify({"message": "Missing fields in the request data"}), 400

    try:
        for symptom_id in symptom_ids:
            new_assignment = PatientSymptom(patient_uuid=patient_uuid, symptom_id=symptom_id)
            db.session.add(new_assignment)
        db.session.commit()
        return jsonify({"message": "Symptoms assigned successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@symptom_bp.route('/patient_symptom/<patient_uuid>', methods=['GET'])
@login_required
def get_patient_symptoms(patient_uuid):
    assignments = PatientSymptom.query.filter_by(patient_uuid=patient_uuid).all()
    symptoms = []
    for assignment in assignments:
        symptom = Symptom.query.get(assignment.symptom_id)
        if symptom:
            symptoms.append({
                "id": symptom.id,
                "name": symptom.name,
                "description": symptom.description
            })
    return jsonify(symptoms), 200

@symptom_bp.route('/patient_symptom', methods=['DELETE'])
@login_required
def unassign_symptom():
    data = request.get_json()
    patient_uuid = data.get('patient_uuid')
    symptom_id = data.get('symptom_id')

    if not patient_uuid or not symptom_id:
        return jsonify({"message": "Patient UUID and Symptom ID are required"}), 400

    try:
        patient_symptom = db.session.query(PatientSymptom).filter_by(
            patient_uuid=patient_uuid, symptom_id=symptom_id).first()
        if patient_symptom:
            db.session.delete(patient_symptom)
            db.session.commit()
            return jsonify({"message": "Symptom unassigned successfully"}), 200
        else:
            return jsonify({"message": "PatientSymptom not found"}), 404
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
