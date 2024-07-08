from . import db

class PatientTraumaticEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_uuid = db.Column(db.String, nullable=False)
    traumatic_event_id = db.Column(db.Integer, db.ForeignKey('traumatic_event.id'), nullable=False)