from models import db

class PatientPathology(db.Model):
    __tablename__ = 'patient_pathology'
    id = db.Column(db.Integer, primary_key=True)
    patient_uuid = db.Column(db.String, db.ForeignKey('patients.uuid'), nullable=False)
    pathology_id = db.Column(db.Integer, db.ForeignKey('pathologies.id'), nullable=False)
