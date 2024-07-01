# models/patient_symptom.py
from models import db

class PatientSymptom(db.Model):
    __tablename__ = 'patient_symptom'
    id = db.Column(db.Integer, primary_key=True)
    patient_uuid = db.Column(db.String, nullable=False)  # Rimosso il vincolo di chiave esterna
    symptom_id = db.Column(db.Integer, nullable=False)  # Rimosso il vincolo di chiave esterna
