from sqlalchemy.orm import Session
from models import Ticket
from schemas import TicketCreate, TicketUpdateStatus
from datetime import datetime


def create_ticket(
    db: Session,
    ticket: TicketCreate,
    ai_priority: str = "medium",
    ai_response: str = None,
    ai_method: str = "fallback",
) -> Ticket:
    db_ticket = Ticket(
        title=ticket.title,
        description=ticket.description,
        priority=ai_priority,
        ai_response=ai_response,
        ai_method=ai_method,
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def get_tickets(db: Session, skip: int = 0, limit: int = 100) -> list[Ticket]:
    return db.query(Ticket).offset(skip).limit(limit).all()


def get_ticket_by_id(db: Session, ticket_id: int) -> Ticket | None:
    return db.query(Ticket).filter(Ticket.id == ticket_id).first()


def update_ticket_status(
    db: Session, ticket_id: int, status_update: TicketUpdateStatus
) -> Ticket | None:
    ticket = get_ticket_by_id(db, ticket_id)
    if ticket:
        ticket.status = status_update.status
        db.commit()
        db.refresh(ticket)
    return ticket


def delete_ticket(db: Session, ticket_id: int) -> bool:
    ticket = get_ticket_by_id(db, ticket_id)
    if ticket:
        db.delete(ticket)
        db.commit()
        return True
    return False
