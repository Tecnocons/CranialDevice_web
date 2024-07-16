from models import db

class Measurement(db.Model):
    __tablename__ = 'measurements'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.String, nullable=False)
    measurement_id = db.Column(db.String, nullable=False)  # Aggiunto measurement_id
    timestamp = db.Column(db.DateTime, nullable=False)
    spostamento_mm = db.Column(db.Float, nullable=False)
    forza_n = db.Column(db.Float, nullable=False)
    pressione_bar = db.Column(db.Float, nullable=False)
    contropressione_bar = db.Column(db.Float, nullable=False)
