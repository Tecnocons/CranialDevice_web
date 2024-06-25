from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import Users  # Assicurati che Users sia importato correttamente
from .patient import Patients  # Importa anche gli altri modelli se necessario
