import logging
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from contextlib import asynccontextmanager

from db import get_db, engine, Base
from models import Ticket
from schemas import TicketCreate, TicketResponse, TicketUpdateStatus
from crud import (
    create_ticket,
    get_tickets,
    get_ticket_by_id,
    update_ticket_status,
    delete_ticket,
)
from ai import analyze_ticket

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="HelpDesk API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "HelpDesk API", "version": "1.0.0", "docs": "/docs"}


@app.post(
    "/tickets", response_model=TicketResponse, status_code=status.HTTP_201_CREATED
)
def create_new_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    try:
        analysis, method = analyze_ticket(ticket.description)
        logger.info(f"Created ticket with {method} analysis")
        return create_ticket(
            db, ticket, analysis.priority, analysis.ai_response, method
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@app.get("/tickets", response_model=List[TicketResponse])
def list_tickets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_tickets(db, skip, limit)


@app.get("/tickets/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found"
        )
    return ticket


@app.patch("/tickets/{ticket_id}/status", response_model=TicketResponse)
def update_status(
    ticket_id: int, status_update: TicketUpdateStatus, db: Session = Depends(get_db)
):
    if status_update.status not in ["open", "in_progress", "closed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status"
        )

    ticket = update_ticket_status(db, ticket_id, status_update)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found"
        )
    return ticket


@app.delete("/tickets/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket_endpoint(ticket_id: int, db: Session = Depends(get_db)):
    success = delete_ticket(db, ticket_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found"
        )
