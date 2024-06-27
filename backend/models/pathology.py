
from sqlalchemy import Column, Integer, String, Text
from models import db

class Pathologies(db.Model):
    __tablename__ = 'pathologies'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)