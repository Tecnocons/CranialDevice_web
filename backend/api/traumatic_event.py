from flask import Blueprint, request, jsonify
from models import db
from models.traumatic_event import TraumaticEvent
from models.patient_traumatic_event import PatientTraumaticEvent
from flask_login import login_required

traumatic_event_bp = Blueprint('traumatic_event', __name__)

@traumatic_event_bp.route('/traumatic_events', methods=['GET'])
@login_required
def get_traumatic_events():
    events = TraumaticEvent.query.all()
    event_list = [{'id': event.id, 'name': event.name, 'description': event.description} for event in events]
    return jsonify(event_list), 200

@traumatic_event_bp.route('/traumatic_events', methods=['POST'])
@login_required
def create_traumatic_event():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')

    if not name:
        return jsonify({"message": "Name is required"}), 400

    new_event = TraumaticEvent(name=name, description=description)
    db.session.add(new_event)
    db.session.commit()
    return jsonify({"message": "Traumatic event created successfully"}), 201

@traumatic_event_bp.route('/patient_traumatic_event', methods=['POST'])
@login_required
def assign_traumatic_event():
    data = request.get_json()
    patient_uuid = data.get('patient_uuid')
    event_ids = data.get('event_ids')

    if not patient_uuid or not event_ids:
        return jsonify({"message": "Missing fields in the request data"}), 400

    try:
        for event_id in event_ids:
            new_assignment = PatientTraumaticEvent(patient_uuid=patient_uuid, traumatic_event_id=event_id)
            db.session.add(new_assignment)
        db.session.commit()
        return jsonify({"message": "Traumatic events assigned successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@traumatic_event_bp.route('/patient_traumatic_event/<patient_uuid>', methods=['GET'])
@login_required
def get_patient_traumatic_events(patient_uuid):
    assignments = PatientTraumaticEvent.query.filter_by(patient_uuid=patient_uuid).all()
    events = []
    for assignment in assignments:
        event = TraumaticEvent.query.get(assignment.traumatic_event_id)
        if event:
            events.append({
                "id": event.id,
                "name": event.name,
                "description": event.description
            })
    return jsonify(events), 200

@traumatic_event_bp.route('/patient_traumatic_event', methods=['DELETE'])
@login_required
def unassign_traumatic_event():
    data = request.get_json()
    patient_uuid = data.get('patient_uuid')
    event_id = data.get('event_id')

    if not patient_uuid or not event_id:
        return jsonify({"message": "Patient UUID and Traumatic Event ID are required"}), 400

    try:
        patient_event = db.session.query(PatientTraumaticEvent).filter_by(
            patient_uuid=patient_uuid, traumatic_event_id=event_id).first()
        if patient_event:
            db.session.delete(patient_event)
            db.session.commit()
            return jsonify({"message": "Traumatic event unassigned successfully"}), 200
        else:
            return jsonify({"message": "PatientTraumaticEvent not found"}), 404
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
