import enum
import uuid
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ConnectionStatus(str, enum.Enum):
    NEW = "new"
    FOLLOW_UP_NEEDED = "follow_up_needed"
    ACTIVE = "active"
    MENTOR = "mentor"
    RECRUITER = "recruiter"
    ALUMNI = "alumni"
    INACTIVE = "inactive"


class NetworkConnection(Base):
    __tablename__ = "network_connections"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    job_title: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    organization: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    where_met: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    date_met: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    last_contact_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    follow_up_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    status: Mapped[ConnectionStatus] = mapped_column(
        Enum(
            ConnectionStatus,
            name="connection_status",
            values_callable=lambda enum_class: [
                member.value for member in enum_class
            ],
        ),
        nullable=False,
        default=ConnectionStatus.NEW,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
