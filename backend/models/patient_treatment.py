from . import db

class PatientTreatment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_uuid = db.Column(db.String, nullable=False)
    treatment_id = db.Column(db.Integer, db.ForeignKey('treatment.id'), nullable=False)
