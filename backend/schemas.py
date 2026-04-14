from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, Literal


class TicketCreate(BaseModel):
    title: str
    description: str


class TicketUpdateStatus(BaseModel):
    status: Literal["open", "in_progress", "closed"]


class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    status: str
    priority: str
    ai_response: Optional[str] = None
    ai_method: Optional[str] = None
    created_at: datetime


class AIAnalysisResponse(BaseModel):
    priority: str
    ai_response: str
