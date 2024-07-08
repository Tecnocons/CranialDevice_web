from . import db

class PatientSurgery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_uuid = db.Column(db.String, nullable=False)
    surgery_id = db.Column(db.Integer, db.ForeignKey('surgery.id'), nullable=False)
