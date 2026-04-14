from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from db import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="open")
    priority = Column(String(50), default="medium")
    ai_response = Column(Text, nullable=True)
    ai_method = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
