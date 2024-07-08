from flask import Blueprint, request, jsonify
from models import db
from models.surgery import Surgery
from models.patient_surgery import PatientSurgery
from flask_login import login_required

surgery_bp = Blueprint('surgery', __name__)

@surgery_bp.route('/surgeries', methods=['GET'])
@login_required
def get_surgeries():
    surgeries = Surgery.query.all()
    surgery_list = [{'id': surgery.id, 'name': surgery.name, 'description': surgery.description} for surgery in surgeries]
    return jsonify(surgery_list), 200

@surgery_bp.route('/surgeries', methods=['POST'])
@login_required
def create_surgery():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')

    if not name:
        return jsonify({"message": "Name is required"}), 400

    new_surgery = Surgery(name=name, description=description)
    db.session.add(new_surgery)
    db.session.commit()
    return jsonify({"message": "Surgery created successfully"}), 201

@surgery_bp.route('/patient_surgery', methods=['POST'])
@login_required
def assign_surgery():
    data = request.get_json()
    patient_uuid = data.get('patient_uuid')
    surgery_ids = data.get('surgery_ids')

    if not patient_uuid or not surgery_ids:
        return jsonify({"message": "Missing fields in the request data"}), 400

    try:
        for surgery_id in surgery_ids:
            new_assignment = PatientSurgery(patient_uuid=patient_uuid, surgery_id=surgery_id)
            db.session.add(new_assignment)
        db.session.commit()
        return jsonify({"message": "Surgeries assigned successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@surgery_bp.route('/patient_surgery/<patient_uuid>', methods=['GET'])
@login_required
def get_patient_surgeries(patient_uuid):
    assignments = PatientSurgery.query.filter_by(patient_uuid=patient_uuid).all()
    surgeries = []
    for assignment in assignments:
        surgery = Surgery.query.get(assignment.surgery_id)
        if surgery:
            surgeries.append({
                "id": surgery.id,
                "name": surgery.name,
                "description": surgery.description
            })
    return jsonify(surgeries), 200

@surgery_bp.route('/patient_surgery', methods=['DELETE'])
@login_required
def unassign_surgery():
    data = request.get_json()
    patient_uuid = data.get('patient_uuid')
    surgery_id = data.get('surgery_id')

    if not patient_uuid or not surgery_id:
        return jsonify({"message": "Patient UUID and Surgery ID are required"}), 400

    try:
        patient_surgery = db.session.query(PatientSurgery).filter_by(
            patient_uuid=patient_uuid, surgery_id=surgery_id).first()
        if patient_surgery:
            db.session.delete(patient_surgery)
            db.session.commit()
            return jsonify({"message": "Surgery unassigned successfully"}), 200
        else:
            return jsonify({"message": "PatientSurgery not found"}), 404
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
