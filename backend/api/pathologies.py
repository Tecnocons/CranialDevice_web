from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from models import db
from models.pathology import Pathologies
from flask_login import login_required

pathologies_bp = Blueprint('pathologies', __name__)

@pathologies_bp.route('/pathologies', methods=['POST'])
@login_required
def create_pathology():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid input: No data received"}), 400

    name = data.get('name')
    description = data.get('description')

    if not name:
        return jsonify({"message": "Missing fields in the request data"}), 400

    new_pathology = Pathologies(name=name, description=description)

    try:
        db.session.add(new_pathology)
        db.session.commit()
        return jsonify({"message": "Pathology created successfully"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Pathology already exists"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

@pathologies_bp.route('/pathologies', methods=['GET'])
@login_required
def get_pathologies():
    try:
        pathologies = Pathologies.query.all()
        pathologies_list = [
            {
                'id': pathology.id,
                'name': pathology.name,
                'description': pathology.description
            } for pathology in pathologies
        ]
        return jsonify(pathologies_list), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
