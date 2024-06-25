import bcrypt
from . import db
from flask_login import UserMixin

class Users(db.Model, UserMixin):
    __tablename__ = 'users'
    uuid = db.Column(db.String, primary_key=True, server_default=db.text("gen_random_uuid()"))
    name = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    isadmin = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def get_id(self):
        return self.uuid  # Restituisce l'UUID dell'utente come ID

    def get_decrypted_password(self):
        # WARNING: This is just for demonstration and should not be used in production
        return self.password  # Directly return the hashed password for demonstration
