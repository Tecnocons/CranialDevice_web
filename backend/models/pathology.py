from models import db

class Pathologies(db.Model):
    __tablename__ = 'pathologies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.String(256), nullable=True)
