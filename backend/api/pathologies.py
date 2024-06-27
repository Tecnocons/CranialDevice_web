from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import db
from models.pathology import Pathologies

pathologies_bp = Blueprint('pathologies', __name__)

@pathologies_bp.route('/pathologies', methods=['POST'])
@login_required
def create_pathology():
    if not current_user.isadmin:
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    name = data.get('name')
    description = data.get('description')

    if not name:
        return jsonify({"message": "Name is required"}), 400

    new_pathology = Pathologies(name=name, description=description)
    try:
        db.session.add(new_pathology)
        db.session.commit()
        return jsonify({"message": "Pathology created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@pathologies_bp.route('/pathologies', methods=['GET'])
@login_required
def get_pathologies():
    try:
        pathologies = Pathologies.query.all()
        pathologies_data = [
            {"id": pathology.id, "name": pathology.name, "description": pathology.description}
            for pathology in pathologies
        ]
        return jsonify(pathologies_data), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@pathologies_bp.route('/pathologies', methods=['PUT'])
@login_required
def update_pathology():
    if not current_user.isadmin:
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()
    pathology_id = data.get('id')
    name = data.get('name')
    description = data.get('description')

    if not pathology_id:
        return jsonify({"message": "ID is required"}), 400

    pathology = Pathologies.query.get(pathology_id)
    if not pathology:
        return jsonify({"message": "Pathology not found"}), 404

    pathology.name = name
    pathology.description = description

    try:
        db.session.commit()
        return jsonify({"message": "Pathology updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@pathologies_bp.route('/pathologies/<int:id>', methods=['DELETE'])
@login_required
def delete_pathology(id):
    if not current_user.isadmin:
        return jsonify({"message": "Access denied"}), 403

    pathology = Pathologies.query.get(id)
    if not pathology:
        return jsonify({"message": "Pathology not found"}), 404

    try:
        db.session.delete(pathology)
        db.session.commit()
        return jsonify({"message": "Pathology deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@pathologies_bp.route('/pathologies/bulk_delete', methods=['DELETE'])
@login_required
def bulk_delete_pathologies():
    if not current_user.isadmin:
        return jsonify({"message": "Access denied"}), 403

    try:
        data = request.get_json()
        ids = data.get('ids')
        if not ids:
            return jsonify({"message": "IDs are required"}), 400

        pathologies_to_delete = Pathologies.query.filter(Pathologies.id.in_(ids)).all()
        if not pathologies_to_delete:
            return jsonify({"message": "No pathologies found for given IDs"}), 404

        for pathology in pathologies_to_delete:
            db.session.delete(pathology)

        db.session.commit()
        return jsonify({"message": "Pathologies deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
