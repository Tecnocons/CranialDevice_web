from . import db

class Patients(db.Model):
    uuid = db.Column(db.String, primary_key=True, server_default=db.text("gen_random_uuid()"))
    eta = db.Column(db.Integer, nullable=False)
    altezza = db.Column(db.Float, nullable=False)
    peso = db.Column(db.Float, nullable=False)
    nominativo = db.Column(db.String, nullable=False)
    doctorid = db.Column(db.String, db.ForeignKey('users.uuid'), nullable=False)
